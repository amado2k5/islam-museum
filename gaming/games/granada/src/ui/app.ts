// Granada on screen: the first scenario, "Water for the Valley", as a page a person can play.
//
// The rules live in ../sim and know nothing of this file. This file shows what they say (ui/model.ts), sends them the
// player's decisions (act), lets the days pass (tick), and keeps the game on the device (save.ts). Every control
// is an ordinary button, so the whole game can be played with the keyboard, and the plan of the valley (ui/map.ts)
// says in words what it shows in colour. A 3D valley will be drawn over the same state; it is not here yet.
import en from "../../i18n/en.json";
import records from "../../data/museum-records.v1.json";
import { loadMusicStrings, musicControl } from "@im/audio/control";
import { MUSIC_AVAILABLE, MUSIC_BASE, MusicPlayer } from "@im/audio/player";
import { MINOR } from "../sim/economy";
import { SCENARIOS, WATER_FOR_THE_VALLEY } from "../sim/scenarios";
import { act, newVillage, siteOf, tick, type ActResult, type Refusal, type Scenario, type VillageCommand, type VillageState } from "../sim/village";
import { clearSave, readSave, writeSave } from "../save";
import { probeWebGPU } from "@im/kernel/capability";
import { installCounters } from "@im/kernel/counters";
import type { ValleyLook } from "../view/three-valley";
import { drawMap, setMapGhost } from "./map";
import type { Stage } from "./stage";
import { advice, catalogueRows, fieldCards, marketRows, tradeView, questRows, riverOfYear, skyAhead, stocks, workRows, yesterday, type FieldCard, type WorkRow } from "./model";

type Strings = Record<Exclude<keyof typeof en, "_meta">, string>;
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const LANG_NAMES: Record<string, string> = { ar: "العربية", en: "English", ur: "اردو", fr: "Français", es: "Español", tr: "Türkçe", id: "Indonesia" };
const MUSEUM = "https://islam.museum";
const DAY_MS = { 1: 1500, 2: 450 } as const;
type Tab = "valley" | "fields" | "works" | "market" | "ledger";

type Child = Node | string | null | false | undefined;
function h<K extends keyof HTMLElementTagNameMap>(tag: K, props: Record<string, unknown> = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") e.className = String(v);
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v as EventListener);
    else if (k in e && k !== "list") (e as unknown as Record<string, unknown>)[k] = v;
    else e.setAttribute(k, String(v));
  }
  for (const c of children) if (c) e.append(c);
  return e;
}

declare global {
  interface Window {
    __GR__?: Record<string, unknown>;
  }
}

async function main(): Promise<void> {
  const query = new URLSearchParams(location.search);
  // Asked to measure itself, the page counts its frames, memory and live resources from here on (kernel/counters.ts).
  const counters = query.has("counters") ? installCounters(window as never) : null;
  const lang = (LANGS as readonly string[]).includes(query.get("lang") ?? "") ? query.get("lang")! : "en";
  const strings = (lang === "en" ? en : (await import(`../../i18n/${lang}.json`)).default) as Strings;
  const nf = new Intl.NumberFormat(`${lang}-u-nu-latn`);
  const num = (n: number) => nf.format(n);
  const t = (key: string, params: Record<string, string | number> = {}): string => {
    const text = (strings as Record<string, string>)[key] ?? (en as Record<string, unknown>)[key];
    if (typeof text !== "string") return key;
    return text.replace(/\{(\w+)\}/g, (_, name: string) => (typeof params[name] === "number" ? num(params[name] as number) : String(params[name] ?? "")));
  };
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" || lang === "ur" ? "rtl" : "ltr";
  document.title = `${t("title")}: ${t("scenario_title")}`;
  const label = (id: string): string => (records.records as Record<string, { label: Record<string, string> }>)[id]?.label[lang] ?? id;
  const fieldName = (id: string) => t(`field_${id}`);

  // ---- The game ------------------------------------------------------------------------------------------------
  const sc: Scenario = WATER_FOR_THE_VALLEY;
  const seedParam = Number(query.get("seed"));
  const newSeed = () => (Number.isSafeInteger(seedParam) && seedParam > 0 ? seedParam : 1 + (Math.floor(performance.now() * 1000) % 100000));
  let notice: string | null = null;
  let state: VillageState;
  let resumed = false;
  const saved = query.has("fresh") ? ({ status: "empty" } as const) : readSave(localStorage);
  if (saved.status === "ok" && SCENARIOS[saved.state.scenario] === sc) {
    state = saved.state;
    resumed = true;
  } else {
    if (saved.status === "unreadable") notice = t("save_unreadable");
    if (saved.status === "newer") notice = t("save_newer");
    state = newVillage(sc, newSeed());
  }
  // How much is spent on the picture: asked for in the address, or chosen before and kept on this device, or High.
  const QUALITIES = ["low", "medium", "high"] as const;
  type QualityChoice = (typeof QUALITIES)[number];
  const PREFS_KEY = "im.granada.prefs.v1";
  const isQuality = (v: unknown): v is QualityChoice => QUALITIES.includes(v as QualityChoice);
  let keptQuality: QualityChoice | null = null;
  try {
    const kept = (JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") as { quality?: unknown }).quality;
    if (isQuality(kept)) keptQuality = kept;
  } catch {
    // An unreadable preference is no preference.
  }
  const askedQuality = query.get("q");
  const quality: QualityChoice = isQuality(askedQuality) ? askedQuality : (keptQuality ?? "high");
  let speed: 0 | 1 | 2 = 0;
  let tab: Tab = "valley";
  let selected: string | null = null;
  /** What the player is choosing ground for, and the ground being considered, in the valley's metres. */
  let placing: string | null = null;
  let ghost: { x: number; z: number } | null = null;
  let saveOk = true;
  const log: string[] = [];

  // ---- The page ------------------------------------------------------------------------------------------------
  const app = document.getElementById("app")!;
  const live = document.getElementById("live")!;
  const skip = document.querySelector<HTMLAnchorElement>("a.skip");
  if (skip) skip.textContent = t("skip");
  const bar = h("header", { class: "bar" });
  const ahead = h("div", { class: "ahead" });
  const mapBox = h("div", { class: "mapbox" });
  const map = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  map.classList.add("map");
  // On the plan, while a site is being chosen, the pointer names the ground and a click builds on it.
  const planPoint = (e: MouseEvent): [number, number] | null => {
    const m = map.getScreenCTM();
    if (!m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return [p.x - 500, p.y - 280];
  };
  map.addEventListener("pointermove", (e) => {
    const p = placing ? planPoint(e) : null;
    if (p) considerSite(p[0], p[1]);
  });
  map.addEventListener("click", (e) => {
    const p = placing ? planPoint(e) : null;
    if (p) buildAt(p[0], p[1]);
  });
  // The valley is shown in 3D where the browser can draw it, and as a plan everywhere. The plan is never taken away.
  let stage: Stage | null = null;
  let view: "3d" | "plan" = "plan";
  const sceneBox = h("div", { class: "scenebox", hidden: true });
  const viewBar = h("div", { class: "viewbar", role: "group", hidden: true });
  mapBox.append(viewBar, sceneBox, map);
  // Round the valley, as the founder's target picture arranges them: a rail of the game's parts down one side, what
  // is asked of the steward beside it, the part in hand on the other side, and the season in the corner. On the plan,
  // or in a window too small for that, the same four stand in one column beside the land.
  const rail = h("nav", { class: "rail", role: "tablist", "aria-label": t("rail_label") });
  const objectives = h("aside", { class: "objectives", id: "objectives", "aria-label": t("quests_title") });
  const side = h("aside", { class: "side", id: "side" });
  const seasonBox = h("aside", { class: "seasonbox", id: "seasonbox", "aria-label": t("sky_title") });
  // What is chosen in the valley, said beside it.
  const fieldPop = h("div", { class: "fieldpop", id: "field-pop", hidden: true });
  sceneBox.append(fieldPop);
  const toasts = h("div", { class: "toasts", role: "log" });
  app.append(bar, ahead, h("main", { class: "main" }, mapBox, h("div", { class: "column" }, rail, objectives, side, seasonBox)), toasts);

  const music = new MusicPlayer({ base: MUSIC_BASE, first: "the-ancient-library", forceOff: query.get("music") === "off" || !MUSIC_AVAILABLE });
  const musicBox = MUSIC_AVAILABLE ? musicControl(music, await loadMusicStrings(lang), `${MUSEUM}/${lang}/backstage/`) : null;

  // The picture's preset is chosen here. The valley is built once for a preset, so a change keeps the choice and
  // opens the page again; the game in hand is saved and comes back where it was.
  const qualitySelect = h("select", { id: "quality", "aria-label": t("quality_label") }, ...QUALITIES.map((q) => h("option", { value: q, selected: q === quality }, t(`quality_${q}`)))) as HTMLSelectElement;
  qualitySelect.addEventListener("change", () => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ quality: qualitySelect.value }));
    } catch {
      // Without storage the choice still holds for this visit, through the address.
    }
    const next = new URL(location.href);
    next.searchParams.set("q", qualitySelect.value);
    next.searchParams.delete("fresh");
    location.replace(next);
  });
  const qualityBox = query.has("no3d") ? null : h("label", { class: "quality" }, h("span", {}, t("quality_label")), qualitySelect);

  const say = (text: string) => {
    log.unshift(text);
    log.length = Math.min(log.length, 40);
    const item = h("p", { class: "toast" }, text);
    toasts.prepend(item);
    while (toasts.children.length > 4) toasts.lastElementChild!.remove();
    setTimeout(() => item.remove(), 9000);
    live.textContent = text;
  };
  const refusal = (r: ActResult): string => (r.ok ? "" : t(`refuse_${r.why}` in strings ? `refuse_${r.why}` : "refuse_other"));
  const keep = () => {
    saveOk = writeSave(localStorage, state);
  };
  const order = (command: VillageCommand): boolean => {
    const r = act(sc, state, command);
    if (!r.result.ok) {
      say(refusal(r.result));
      return false;
    }
    state = r.state;
    keep();
    render();
    return true;
  };

  const eventText = (e: string): string | null => {
    const [kind, a, b] = e.split(":");
    switch (kind) {
      case "ripe":
      case "harvested":
      case "store-full":
        return t(`event_${kind}`, { field: fieldName(a!) });
      case "spoiled":
        return t("event_spoiled", { field: fieldName(a!), n: Number(b) });
      case "built":
        return t(`event_built_${a}`);
      case "hungry":
      case "thirsty":
        return t(`event_${kind}`, { n: Number(a) });
      case "arrived":
      case "left":
        return t(`event_${kind}`);
      case "placed":
        return t("event_placed", { what: t(`place_${a}`) });
      case "contract-failed":
        return t("event_contract_failed");
      case "quest":
        return t("event_quest", { quest: t(a!), reward: Math.floor(sc.reward / MINOR) });
      default:
        return null;
    }
  };

  const nextDay = () => {
    if (state.outcome) return;
    state = tick(sc, state);
    for (const e of state.last?.events ?? []) {
      const text = eventText(e);
      if (text) say(text);
    }
    keep();
    if (state.outcome) {
      speed = 0;
      render();
      showOutcome();
    } else render();
  };

  // ---- Panels ----------------------------------------------------------------------------------------------------
  const delta = (now: number, then: number | undefined) => {
    if (then === undefined || then === now) return null;
    const up = then > now;
    return h("span", { class: `delta ${up ? "up" : "down"}` }, `${up ? "+" : "−"}${num(Math.abs(then - now))}`);
  };
  const stat = (name: string, value: string, extra: Child = null, cls = "") => h("div", { class: `stat ${cls}` }, h("span", { class: "stat-name" }, name), h("span", { class: "stat-value" }, value), extra);

  function renderBar(): void {
    const s = stocks(sc, state);
    const speedButton = (to: 0 | 1 | 2, key: string, glyph: string) => h("button", { type: "button", class: `speed${speed === to ? " on" : ""}`, "aria-pressed": String(speed === to), title: t(key), "aria-label": t(key), onclick: () => setSpeed(to), id: `speed-${to}` }, glyph);
    bar.replaceChildren(
      h("div", { class: "brand" }, h("h1", {}, t("title")), h("p", {}, `${t("scenario_title")} · `, h("span", { class: "tag" }, t("prototype")))),
      h("div", { class: "when" }, h("strong", { id: "day-line" }, t("day_line", { season: t(`season_${s.season}`), day: s.dayOfSeason })), h("span", {}, t("days_left", { n: s.daysLeft }))),
      h(
        "div",
        { class: "stats" },
        stat(t("stock_dinars"), num(s.dinars), delta(s.dinars, s.tomorrow?.dinars)),
        stat(t("stock_food"), t("stock_days", { n: s.reserveDays }), delta(s.reserveDays, s.tomorrow?.reserveDays), s.reserveDays < 10 ? "warn" : ""),
        stat(t("stock_households"), `${num(s.households)} / ${num(s.housing)}`, delta(s.households, s.tomorrow?.households)),
        stat(t("stock_welfare"), num(s.welfare), delta(s.welfare, s.tomorrow?.welfare), s.welfare < 45 ? "warn" : ""),
        stat(t("stock_pool"), `${num(s.pool)} / ${num(s.poolCapacity)}`, delta(s.pool, s.tomorrow?.pool)),
        stat(t("stock_store"), `${num(s.storeUsed)} / ${num(s.storeRoom)}`, null, s.storeUsed >= s.storeRoom ? "warn" : ""),
        stat(t("stock_timber"), num(s.timber)),
        stat(t("stock_stone"), num(s.stone)),
      ),
      h(
        "div",
        { class: "clock", role: "group", "aria-label": t("speed_label") },
        speedButton(0, "speed_pause", "❚❚"),
        speedButton(1, "speed_play", "▶"),
        speedButton(2, "speed_fast", "▶▶"),
        h("button", { type: "button", class: "speed step", id: "step", title: t("speed_step"), disabled: Boolean(state.outcome), onclick: () => nextDay() }, t("speed_step")),
      ),
      h("div", { class: "menu" }, musicBox, qualityBox, h("button", { type: "button", id: "btn-help", onclick: () => showHelp() }, t("help"))),
    );
    const line = (name: string, g: NonNullable<typeof s.tomorrow>) => h("span", { class: "ahead-part" }, h("b", {}, `${name}: `), `${t("stock_dinars")} ${num(g.dinars)} · ${t("stock_food")} ${t("stock_days", { n: g.reserveDays })} · ${t("stock_welfare")} ${num(g.welfare)} · ${t("stock_pool")} ${num(g.pool)}`);
    ahead.replaceChildren(...([h("span", { class: "ahead-title" }, t("ahead_title")), s.tomorrow && line(t("tomorrow"), s.tomorrow), s.inTen && line(t("in_ten"), s.inTen), !saveOk && h("span", { class: "warnline" }, t("save_failed"))].filter(Boolean) as Node[]));
  }

  const fieldLabel = (f: FieldCard): string => `${fieldName(f.id)}: ${f.crop ? `${t(`crop_${f.crop}`)}, ` : ""}${t(`stage_${f.stage}`)}${f.stage === "growing" ? ` ${num(f.growth)}%` : ""}. ${t(`branch_${f.branch.state}`, { carries: f.branch.carries, wants: f.branch.wants })}`;

  /** What the 3D valley should show, worked out from the same figures as the plan. */
  function lookOf(): ValleyLook {
    const cards = fieldCards(sc, state);
    const branches: Record<string, "flowing" | "weak" | "none"> = {};
    const fields: ValleyLook["fields"] = {};
    // A field is shown with people at work in it from the moment its harvest is ordered until the day after the last
    // of it is in: with hands enough, the rules bring a small field in within the day, and that day's work is shown.
    const gathered = new Set((state.last?.events ?? []).filter((e) => e.startsWith("harvested:")).map((e) => e.split(":")[1]!));
    for (const f of cards) {
      branches[f.branch.id] = f.branch.state;
      const ripe = f.stage === "ripe" || f.stage === "harvesting";
      fields[f.id] = { crop: f.crop, growth: f.stage === "growing" ? f.growth / 100 : f.crop ? 1 : 0, standing: f.stage === "growing" ? 1 : ripe && f.yielded > 0 ? f.standing / f.yielded : 0, ripe, harvesting: f.stage === "harvesting" || gathered.has(f.id) };
    }
    return {
      season: stocks(sc, state).season,
      rain: Boolean(state.last?.rain),
      pool: state.pool / sc.water.poolCapacity,
      branches,
      fields,
      houses: Math.round(sc.housing / 10) + state.built.house,
      housesUnderWay: state.works.filter((w) => w.kind === "house").length,
      granary: state.built.granary ? "built" : state.works.some((w) => w.kind === "granary") ? "under-way" : "none",
      placed: state.placed.map((p) => ({ ...p, r: sc.catalogue?.[p.what]?.radius ?? 9 })),
      busy: state.last ? state.last.workers - state.last.idle : 8,
      selected,
    };
  }
  function renderViewBar(): void {
    const button = (id: string, text: string, on: boolean, act: () => void) => h("button", { type: "button", id, class: on ? "on" : "", "aria-pressed": String(on), onclick: act }, text);
    const items: Node[] = [button("view-3d", t("view_3d"), view === "3d", () => setView("3d")), button("view-plan", t("view_plan"), view === "plan", () => setView("plan"))];
    if (view === "3d") items.push(h("button", { type: "button", id: "view-overview", onclick: () => stage?.overview() }, t("view_overview")), h("span", { class: "viewhint" }, t("view_hint")));
    viewBar.replaceChildren(...items);
  }
  function setView(to: "3d" | "plan"): void {
    view = stage ? to : "plan";
    // With the 3D valley on, the panels stand round it; on the plan they stand beside it.
    document.body.classList.toggle("hud", view === "3d");
    sceneBox.hidden = view !== "3d";
    map.toggleAttribute("hidden", view === "3d");
    stage?.setVisible(view === "3d");
    renderViewBar();
    if (view === "3d") stage?.setLook(lookOf());
    if (placing) {
      stage?.setPlacing(view === "3d");
      if (view === "plan" && !ghost) considerSite(...nearestSite(placing));
      render();
    }
  }

  function renderMap(): void {
    if (stage && view === "3d") stage.setLook(lookOf());
    const s = stocks(sc, state);
    const works = state.works;
    drawMap(
      map,
      {
        fields: fieldCards(sc, state),
        poolPct: Math.round((100 * s.pool) / s.poolCapacity),
        storePct: Math.round((100 * s.storeUsed) / s.storeRoom),
        houses: Math.round(sc.housing / 10) + state.built.house,
        placed: state.placed.map((p) => ({ what: p.what, x: p.x, z: p.z, done: p.done, label: `${t(`place_${p.what}`)}${p.done ? "" : `: ${t("place_building")}`}` })),
        housesUnderWay: works.filter((w) => w.kind === "house").length,
        granary: state.built.granary ? "built" : works.some((w) => w.kind === "granary") ? "under-way" : "none",
        channelWork: works.some((w) => w.kind === "repair" || w.kind === "expand"),
        season: s.season,
        rain: Boolean(state.last?.rain),
        selected,
        labels: { title: t("map_title"), river: t("map_river"), pool: t("map_pool"), village: t("map_village"), store: t("map_store"), market: t("map_market"), mountain: label("place/sierra-nevada"), fieldLabel, channel: { flowing: t("map_channel_flowing"), weak: t("map_channel_weak"), none: t("map_channel_none") } },
      },
      (id) => {
        // While a site is being chosen, a click on a field is an answer about that ground, not a visit to the field.
        if (placing) return;
        selected = id;
        tab = "fields";
        render();
        document.getElementById(`card-${id}`)?.focus();
      },
    );
  }

  // ---- Building on the land: a thing chosen from the catalogue, then its ground ----
  const siteWhy = (): Refusal | null => (placing && ghost ? siteOf(sc, state, placing, ghost.x, ghost.z) : null);
  /** Shows the ground being considered, in the valley, on the plan and in words, without redrawing the page. */
  function showGhost(): void {
    const def = placing ? sc.catalogue?.[placing] : undefined;
    const why = siteWhy();
    const g = def && ghost ? { x: ghost.x, z: ghost.z, r: def.radius, ok: why === null } : null;
    stage?.setGhost(view === "3d" ? g : null);
    setMapGhost(map, g && view === "plan" ? { ...g, label: "" } : null);
    const status = document.getElementById("site-status");
    if (status) {
      status.textContent = !g ? t("site_none") : why ? t(`refuse_${why}`) : t("site_ok");
      status.className = g && !why ? "site-ok" : "why";
    }
    const go = document.getElementById("site-build") as HTMLButtonElement | null;
    if (go) go.disabled = !g || why !== null;
  }
  /** The nearest ground to the village, on the plan's sheet, that will take a building of this kind. */
  function nearestSite(what: string): [number, number] {
    for (let ring = 0; ring < 60; ring++)
      for (let k = 0; k < Math.max(1, ring * 6); k++) {
        const a = (k / Math.max(1, ring * 6)) * Math.PI * 2;
        const x = Math.round(110 + Math.cos(a) * ring * 10);
        const z = Math.round(170 + Math.sin(a) * ring * 10);
        if (Math.abs(x) < 480 && Math.abs(z) < 262 && siteOf(sc, state, what, x, z) === null) return [x, z];
      }
    return [110, 170];
  }
  function considerSite(x: number, z: number): void {
    if (!placing) return;
    ghost = { x: Math.round(x), z: Math.round(z) };
    showGhost();
  }
  function startPlacing(what: string): void {
    placing = what;
    ghost = null;
    render();
    // In 3D the first ground offered is the middle of the view; on the plan, the nearest ground to the village that will take it.
    if (view === "3d" && stage) stage.setPlacing(true);
    else considerSite(...nearestSite(what));
    document.getElementById("site-build")?.scrollIntoView({ block: "nearest" });
    live.textContent = t("site_title", { what: t(`place_${what}`) });
  }
  function stopPlacing(): void {
    if (!placing) return;
    const what = placing;
    placing = null;
    ghost = null;
    stage?.setPlacing(false);
    render();
    (document.querySelector(`[data-act='place-${what}']`) as HTMLElement | null)?.focus();
  }
  function buildAt(x: number, z: number): void {
    if (!placing) return;
    const what = placing;
    considerSite(x, z);
    if (!order({ kind: "place", what, x: Math.round(x), z: Math.round(z) })) return;
    say(t("site_started", { what: t(`place_${what}`) }));
    stopPlacing();
  }

  const bar01 = (name: string, pct: number) => h("label", { class: "gauge" }, h("span", {}, `${name} ${num(pct)}%`), h("progress", { max: 100, value: Math.max(0, Math.min(100, pct)) }));

  function valleyPanel(): Child[] {
    const a = advice(sc, state);
    return [
      h("section", { class: "card advice" }, h("h2", {}, t("advice_title")), h("p", { id: "advice" }, t(a.key, { field: a.field ? fieldName(a.field) : "", days: a.days ?? 0 }))),
      h(
        "section",
        { class: "card" },
        h("h2", {}, t("water_first")),
        h(
          "div",
          { class: "choice", role: "group", "aria-label": t("water_first") },
          ...(["households", "fields"] as const).map((who) => h("button", { type: "button", class: state.waterFirst === who ? "on" : "", "aria-pressed": String(state.waterFirst === who), id: `water-${who}`, onclick: () => order({ kind: "water-first", who }) }, t(`water_${who}`))),
        ),
      ),
    ];
  }

  /** What is asked of the steward: the quests, each with how far it has got. */
  function objectivesPanel(): Child[] {
    return [
      h(
        "section",
        { class: "card" },
        h("h2", {}, t("quests_title")),
        h(
          "ul",
          { class: "quests" },
          ...questRows(sc, state).map((q) => h("li", { class: q.done ? "done" : "", "data-quest": q.id }, h("strong", {}, t(q.id)), h("span", { class: "quest-state" }, q.done ? t("quest_done") : q.progress ? t("quest_progress", q.progress) : ""), h("p", {}, t(`${q.id}_text`)))),
        ),
        h("p", { class: "goal" }, h("b", {}, `${t("goal_title")}: `), t("goal_text", { welfare: sc.goal.welfare, days: sc.goal.reserveDays })),
      ),
    ];
  }

  /** The season in hand: the weather that will come, and the river's year. */
  function seasonPanel(): Child[] {
    const sky = skyAhead(sc, state, 7);
    const river = riverOfYear(state);
    const s = stocks(sc, state);
    return [
      h(
        "section",
        { class: "card" },
        h("p", { class: "season-line" }, h("strong", {}, t("day_line", { season: t(`season_${s.season}`), day: s.dayOfSeason })), ` · ${t("days_left", { n: s.daysLeft })}`),
        h("h2", {}, t("sky_title")),
        h("p", { class: "note" }, t("sky_note")),
        h("ol", { class: "sky" }, ...sky.map((d) => h("li", { class: d.rain ? "rain" : "dry", title: t("sky_flow", { n: d.inflow }) }, h("span", { class: "sky-glyph", "aria-hidden": "true" }, d.rain ? "☂" : "☀"), h("span", { class: "visually-hidden" }, `${d.rain ? t("sky_rain") : t("sky_dry")}. `), h("span", { class: "sky-flow" }, num(d.inflow))))),
        h("h3", {}, t("river_title")),
        h("ul", { class: "river" }, ...river.map((pct, q) => h("li", {}, t("river_pct", { season: t(`season_${q}`), pct })))),
      ),
    ];
  }

  function fieldsPanel(): Child[] {
    return fieldCards(sc, state).map((f) =>
      h(
        "section",
        { class: `card field-card${selected === f.id ? " selected" : ""}`, id: `card-${f.id}`, tabIndex: -1 },
        h("h2", {}, `${fieldName(f.id)} · ${f.crop ? t(`crop_${f.crop}`) : t("stage_fallow")}`),
        h("p", { class: "stage" }, t(`stage_${f.stage}`), f.spoilsIn !== null ? ` · ${f.spoilsIn > 0 ? t("field_spoils_in", { days: f.spoilsIn }) : t("field_spoiling")}` : ""),
        f.stage === "growing" && h("div", { class: "gauges" }, bar01(t("field_growth"), f.growth), bar01(t("field_water"), f.watered), bar01(t("field_hands"), f.tended)),
        h("p", { class: `branch ${f.branch.state}` }, t(`branch_${f.branch.state}`, { carries: f.branch.carries, wants: f.branch.wants })),
        f.standing > 0 && h("p", {}, t("field_standing", { n: f.standing })),
        f.yielded > 0 && h("p", { class: "note" }, t("field_account", { brought: f.brought, sold: f.sold, spoiled: f.spoiled })),
        ...estateLines(f),
        f.crop !== null &&
          f.stage === "growing" &&
          h("button", { type: "button", class: f.first ? "on" : "", "aria-pressed": String(f.first), "data-act": `first-${f.id}`, title: t("estate_first_text"), onclick: () => order({ kind: "field-first", plot: f.first ? null : f.id }) }, t("estate_first")),
        (f.stage === "ripe" || f.stage === "harvesting") &&
          h(
            "div",
            { class: "actions" },
            ...(["wait", "sell"] as const).map((rest) => h("button", { type: "button", class: state.plots[f.id]!.harvesting === rest ? "on" : "", "data-act": `harvest-${rest}-${f.id}`, onclick: () => order({ kind: "harvest", plot: f.id, rest }) }, t(`act_harvest_${rest}`))),
          ),
        f.sowable.length > 0 && h("div", { class: "actions" }, ...f.sowable.map((crop) => h("button", { type: "button", "data-act": `sow-${crop}-${f.id}`, onclick: () => order({ kind: "plant", plot: f.id, crop }) }, t("act_sow", { crop: t(`crop_${crop}`) })))),
      ),
    );
  }

  /** An estate's own figures, each the rules' own: its hands, what thirst has cost, what it will give and what that is worth. */
  function estateLines(f: FieldCard): Child[] {
    const e = f.expected;
    return [
      f.hands && h("p", { "data-estate": "hands" }, t("estate_hands", { have: f.hands.have, need: f.hands.need })),
      f.lostToThirst > 0 && h("p", { class: "why", "data-estate": "lost" }, t("estate_lost", { n: f.lostToThirst })),
      f.stage === "growing" && (e ? h("p", { "data-estate": "expected" }, t("estate_expected", { n: e.units, days: e.inDays })) : h("p", { class: "why", "data-estate": "expected" }, t("estate_never"))),
      e && e.units > 0 && h("p", { class: e.fits ? "note" : "why", "data-estate": "store" }, t(e.fits ? "estate_fits" : "estate_no_room", { n: e.units, free: stocks(sc, state).storeRoom - stocks(sc, state).storeUsed })),
      e && e.units > 0 && h("p", { class: "note", "data-estate": "value" }, e.port === null ? t("estate_value", { village: num(e.village) }) : t("estate_value_port", { village: num(e.village), port: num(e.port) })),
    ];
  }

  /** The catalogue: what can be placed on the land, by kind, and, once one is chosen, where. */
  function cataloguePanel(): Child[] {
    const rows = catalogueRows(sc, state);
    if (rows.length === 0) return [];
    const out: Child[] = [h("section", { class: "card", "data-part": "catalogue" }, h("h2", {}, t("catalogue_title")), h("p", { class: "note" }, t("catalogue_note")))];
    if (placing)
      out.unshift(
        h(
          "section",
          { class: "card siting", "data-part": "siting" },
          h("h2", {}, t("site_title", { what: t(`place_${placing}`) })),
          h("p", { class: "note" }, t(view === "3d" ? "site_help_3d" : "site_help_plan")),
          h("p", { id: "site-status", class: "why", role: "status" }, t("site_none")),
          h("div", { class: "actions" }, h("button", { type: "button", id: "site-build", "data-act": "site-build", disabled: true, onclick: () => ghost && buildAt(ghost.x, ghost.z) }, t("site_build")), h("button", { type: "button", id: "site-stop", "data-act": "site-stop", onclick: () => stopPlacing() }, t("site_stop"))),
        ),
      );
    let category = "";
    for (const r of rows) {
      if (r.category !== category) out.push(h("p", { class: "cat" }, t(`cat_${r.category}`)));
      category = r.category;
      const cost = [t("work_cost", { dinars: r.dinars }), r.timber ? t("work_timber", { n: r.timber }) : "", r.stone ? t("work_stone", { n: r.stone }) : "", t("work_labour", { n: r.labour })].filter(Boolean).join(" · ");
      out.push(
        h(
          "section",
          { class: `card work${placing === r.what ? " selected" : ""}`, "data-place": r.what },
          h("h2", {}, t(`place_${r.what}`)),
          h("p", {}, t(`place_${r.effect.key}_text`, { n: r.effect.n })),
          h("p", { class: "note" }, cost),
          h("p", { class: "note" }, t("place_count", { have: r.placed, max: r.max })),
          ...r.underWay.map((pct) => h("label", { class: "gauge" }, h("span", {}, t("work_under_way", { pct })), h("progress", { max: 100, value: pct }))),
          h("button", { type: "button", "data-act": `place-${r.what}`, disabled: !r.now.ok, "aria-pressed": String(placing === r.what), onclick: () => (placing === r.what ? stopPlacing() : startPlacing(r.what)) }, t("place_choose")),
          !r.now.ok && h("p", { class: "why" }, refusal(r.now)),
        ),
      );
    }
    return out;
  }

  function worksPanel(): Child[] {
    // Where there is a catalogue, houses and granaries are placed on the land from it; the list keeps the channel's works.
    const listed = workRows(sc, state).filter((w) => !sc.catalogue || w.id === "repair" || w.id === "expand");
    // While a site is being chosen, what is being asked stays at the head of the panel.
    const catalogue = cataloguePanel();
    const siting = placing ? catalogue.splice(0, 1) : [];
    return [...siting, ...listed.map((w) => worksCard(w)), ...catalogue];
  }
  function worksCard(w: WorkRow): Child {
    {
      const done = w.built >= w.sites && w.progress === null;
      const cost = [t("work_cost", { dinars: w.dinars }), w.timber ? t("work_timber", { n: w.timber }) : "", w.stone ? t("work_stone", { n: w.stone }) : "", t("work_labour", { n: w.labour })].filter(Boolean).join(" · ");
      return h(
        "section",
        { class: "card work" },
        h("h2", {}, t(`work_${w.id}`)),
        h("p", {}, t(`work_${w.id}_text`)),
        h("p", { class: "note" }, cost),
        w.sites > 1 && h("p", { class: "note" }, t("work_built", { built: w.built, sites: w.sites })),
        w.progress !== null && h("label", { class: "gauge" }, h("span", {}, t("work_under_way", { pct: w.progress })), h("progress", { max: 100, value: w.progress })),
        done ? h("p", { class: "done" }, t("work_done")) : h("button", { type: "button", "data-act": `work-${w.id}`, disabled: !w.now.ok, onclick: () => order(w.command) }, t("work_order")),
        !done && !w.now.ok && h("p", { class: "why" }, refusal(w.now)),
      );
    }
  }

  function marketPanel(): Child[] {
    const lots = (most: number) => [...new Set([1, 10, 50, most].filter((n) => n > 0 && n <= most))];
    return [
      h("section", { class: "card" }, h("h2", {}, t("market_title")), h("p", { class: "note" }, t("market_note"))),
      ...marketRows(sc, state).map((m) =>
        h(
          "section",
          { class: "card good" },
          h("h2", {}, t(`good_${m.good}`)),
          h("p", {}, `${t("market_have")}: ${num(m.have)}`),
          h("div", { class: "trade" }, h("span", {}, `${t("market_buy_at")} ${num(m.ask)}`), ...lots(m.canBuy).map((n) => h("button", { type: "button", "data-act": `buy-${m.good}-${n}`, title: t("market_total", { total: n * m.ask }), onclick: () => order({ kind: "buy", good: m.good, quantity: n }) }, t("market_buy", { n })))),
          h("div", { class: "trade" }, h("span", {}, `${t("market_sell_at")} ${num(m.bid)}`), ...lots(m.canSell).map((n) => h("button", { type: "button", "data-act": `sell-${m.good}-${n}`, title: t("market_total", { total: n * m.bid }), onclick: () => order({ kind: "sell", good: m.good, quantity: n }) }, t("market_sell", { n })))),
        ),
      ),
      ...tradePanel(),
    ];
  }

  /** The port, the press and the contract: everything here is an order the rules carry out, or it is not shown. */
  function tradePanel(): Child[] {
    const tv = tradeView(sc, state);
    if (!tv) return [];
    const lots = (most: number) => [...new Set([1, 10, most].filter((n) => n > 0 && n <= most))];
    return [
      h(
        "section",
        { class: "card", "data-part": "press" },
        h("h2", {}, t("press_title")),
        h("p", { class: "note" }, t("press_note", { each: tv.press.each, cost: tv.press.cost })),
        tv.press.canRun > 0
          ? h("div", { class: "trade" }, ...lots(tv.press.canRun).map((n) => h("button", { type: "button", "data-act": `press-${n}`, title: t("market_total", { total: n * tv.press.cost }), onclick: () => order({ kind: "press", runs: n }) }, t("press_run", { n }))))
          : h("p", { class: "why" }, t("press_none")),
      ),
      h(
        "section",
        { class: "card", "data-part": "port" },
        h("h2", {}, t("port_title")),
        h("p", { class: "note" }, t("port_note")),
        h("p", {}, t("port_carts", { used: tv.port.carted, max: tv.port.cartsPerDay })),
        ...tv.port.rows.map((r) =>
          h(
            "div",
            { class: "trade" },
            h("span", {}, `${t(`good_${r.good}`)}: ${t("port_pays", { bid: r.bid, carriage: r.carriage, net: r.net })}`),
            ...lots(r.canSend).map((n) => h("button", { type: "button", "data-act": `send-${r.good}-${n}`, title: t("market_total", { total: n * r.net }), onclick: () => order({ kind: "send", good: r.good, quantity: n }) }, t("port_send", { n }))),
          ),
        ),
      ),
      ...tv.contracts.map((c) =>
        h(
          "section",
          { class: "card", "data-part": "contract", "data-state": c.state },
          h("h2", {}, t("contract_title")),
          h("p", {}, t("contract_terms", { units: c.units, good: t(`good_${c.good}`), revenue: c.revenue, costs: c.costs, penalty: c.penalty })),
          c.state === "offered" && (c.daysLeft > 0 ? h("p", {}, t("contract_days", { days: c.daysLeft })) : h("p", { class: "why" }, t("contract_passed"))),
          c.state === "offered" && c.daysLeft > 0 && h("button", { type: "button", "data-act": `accept-${c.id}`, disabled: !c.canAccept, onclick: () => order({ kind: "accept", contract: c.id }) }, t("contract_accept")),
          c.state === "accepted" && h("p", {}, `${t("contract_progress", { have: c.delivered, want: c.units })} ${t("contract_days", { days: c.daysLeft })}`),
          c.state === "accepted" &&
            (c.canDeliver > 0
              ? h("div", { class: "trade" }, ...lots(c.canDeliver).map((n) => h("button", { type: "button", "data-act": `deliver-${c.id}-${n}`, onclick: () => order({ kind: "deliver", contract: c.id, quantity: n }) && state.economy.contracts[c.id]!.state === "settled" && say(t("contract_settled")) }, t("contract_deliver", { n }))))
              : h("p", { class: "why" }, t("contract_nothing"))),
          c.state === "settled" && h("p", {}, t("contract_settled")),
          c.state === "failed" && h("p", { class: "why" }, t("contract_failed")),
        ),
      ),
    ];
  }

  function ledgerPanel(): Child[] {
    const y = yesterday(state);
    return [
      h(
        "section",
        { class: "card" },
        h("h2", {}, t("tab_ledger")),
        y ? h("ul", { class: "plain" }, y.rain && h("li", {}, t("ledger_rain")), h("li", {}, t("ledger_water", { got: y.townWater, need: y.townNeed })), h("li", {}, t("ledger_food", { got: y.eaten, need: y.foodNeed })), h("li", {}, t("ledger_hands", { busy: y.workers - y.idle, workers: y.workers }))) : h("p", {}, t("ledger_none")),
      ),
      log.length > 0 && h("section", { class: "card" }, h("ul", { class: "plain log" }, ...log.slice(0, 14).map((line) => h("li", {}, line)))),
    ];
  }

  // A small drawing for each part of the game, in the rail. Decoration only: the word beside it is the name.
  const RAIL_ICONS: Record<Tab, string> = {
    valley: "M3 19l6-9 4 6 3-4 5 7z M17 6a2 2 0 1 0 0.01 0",
    fields: "M12 21V7 M12 7c-2-1-3-2-3-4 M12 7c2-1 3-2 3-4 M12 11c-2 0-4-1-5-3 M12 11c2 0 4-1 5-3 M12 15c-2 0-4-1-5-3 M12 15c2 0 4-1 5-3",
    works: "M14 4l6 6-3 3-6-6z M11 9l-8 8 3 3 8-8",
    market: "M12 4v16 M7 20h10 M5 8h14 M5 8l-3 6h6z M19 8l-3 6h6z",
    ledger: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z M8 4v13",
  };
  const railIcon = (id: Tab): SVGElement => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("rail-icon");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", RAIL_ICONS[id]);
    svg.append(path);
    return svg;
  };

  /** The field chosen in the 3D valley, said in a card beside it: what stands there, and what can be done at once. */
  function renderFieldPop(): void {
    const f = view === "3d" && selected ? fieldCards(sc, state).find((c) => c.id === selected) : undefined;
    if (!f) {
      fieldPop.hidden = true;
      fieldPop.replaceChildren();
      return;
    }
    const ripe = f.stage === "ripe" || f.stage === "harvesting";
    const parts: Child[] = [
      h("h2", {}, `${fieldName(f.id)} · ${f.crop ? t(`crop_${f.crop}`) : t("stage_fallow")}`),
      h("p", { class: "stage" }, t(`stage_${f.stage}`), f.stage === "growing" ? ` · ${num(f.growth)}%` : "", f.spoilsIn !== null ? ` · ${f.spoilsIn > 0 ? t("field_spoils_in", { days: f.spoilsIn }) : t("field_spoiling")}` : ""),
      h("p", { class: `branch ${f.branch.state}` }, t(`branch_${f.branch.state}`, { carries: f.branch.carries, wants: f.branch.wants })),
      f.standing > 0 && h("p", {}, t("field_standing", { n: f.standing })),
      ...estateLines(f),
      h(
        "div",
        { class: "actions" },
        ...(ripe ? (["wait", "sell"] as const).map((rest) => h("button", { type: "button", class: state.plots[f.id]!.harvesting === rest ? "on" : "", "data-pop": `harvest-${rest}-${f.id}`, onclick: () => order({ kind: "harvest", plot: f.id, rest }) }, t(`act_harvest_${rest}`))) : []),
        h("button", { type: "button", "data-pop": "details", onclick: () => setTab("fields") }, t("pop_details")),
        h("button", { type: "button", "data-pop": "close", "aria-label": t("pop_close"), onclick: () => { selected = null; render(); } }, "×"),
      ),
    ];
    fieldPop.replaceChildren(...(parts.filter(Boolean) as Node[]));
    fieldPop.hidden = false;
    placeFieldPop();
  }
  /** Keeps the card beside its field as the view moves. */
  function placeFieldPop(): void {
    if (fieldPop.hidden || !stage || !selected) return;
    const at = stage.fieldOnScreen(selected);
    const box = sceneBox.getBoundingClientRect();
    if (!at) {
      fieldPop.style.visibility = "hidden";
      return;
    }
    fieldPop.style.visibility = "visible";
    const x = Math.max(8, Math.min(box.width - fieldPop.offsetWidth - 8, at[0] - box.left - fieldPop.offsetWidth / 2));
    const y = Math.max(8, Math.min(box.height - fieldPop.offsetHeight - 8, at[1] - box.top - fieldPop.offsetHeight - 26));
    fieldPop.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }

  function renderSide(): void {
    const tabs: Tab[] = ["valley", "fields", "works", "market", "ledger"];
    const panel = tab === "valley" ? valleyPanel() : tab === "fields" ? fieldsPanel() : tab === "works" ? worksPanel() : tab === "market" ? marketPanel() : ledgerPanel();
    rail.replaceChildren(...tabs.map((id) => h("button", { type: "button", role: "tab", id: `tab-${id}`, "aria-selected": String(tab === id), "aria-controls": "tabpanel", class: tab === id ? "on" : "", onclick: () => setTab(id) }, railIcon(id), h("span", {}, t(`tab_${id}`)))));
    objectives.replaceChildren(...(objectivesPanel().filter(Boolean) as Node[]));
    seasonBox.replaceChildren(...(seasonPanel().filter(Boolean) as Node[]));
    side.replaceChildren(
      h("div", { class: "panel", id: "tabpanel", role: "tabpanel", "aria-labelledby": `tab-${tab}` }, ...panel),
    );
  }

  function render(): void {
    // Keep the keyboard where it was: the panels are rebuilt whole.
    const focus = document.activeElement as HTMLElement | null;
    const keepId = focus?.id || null;
    const keepAct = focus?.getAttribute?.("data-act") ?? null;
    // A site is chosen from the Construction panel; leaving it, or the end of the game, ends the choosing.
    if (placing && (tab !== "works" || state.outcome)) {
      placing = null;
      ghost = null;
      stage?.setPlacing(false);
    }
    renderBar();
    renderMap();
    renderSide();
    renderFieldPop();
    map.classList.toggle("placing", placing !== null);
    showGhost();
    // Round the valley the season stands under the part in hand: the part in hand ends where the season begins,
    // whatever the season's height in this language, so that nothing in it lies under the season and out of reach.
    side.style.maxBlockSize = document.body.classList.contains("hud") && matchMedia("(min-width: 1180px) and (min-height: 640px)").matches ? `calc(100% - ${seasonBox.offsetHeight + 36}px)` : "";
    const again = keepId ? document.getElementById(keepId) : keepAct ? document.querySelector<HTMLElement>(`[data-act="${keepAct}"]`) : null;
    again?.focus();
  }
  const setTab = (to: Tab) => {
    tab = to;
    render();
    document.getElementById(`tab-${to}`)?.focus();
  };
  const setSpeed = (to: 0 | 1 | 2) => {
    speed = state.outcome ? 0 : to;
    renderBar();
    document.getElementById(`speed-${speed}`)?.focus();
  };

  // ---- Dialogs ---------------------------------------------------------------------------------------------------
  const dialog = (cls: string, ...children: Child[]): HTMLDialogElement => {
    const d = h("dialog", { class: `dialog ${cls}` }, ...children);
    d.addEventListener("close", () => d.remove());
    app.append(d);
    d.showModal();
    return d;
  };
  const museumLink = (id: string) => h("a", { href: `${MUSEUM}/${lang}/${id}/`, target: "_blank", rel: "noopener" }, label(id));

  function showBrief(): void {
    const d = dialog(
      "brief",
      h("p", { class: "kicker" }, t("subtitle")),
      h("h2", {}, t("scenario_title")),
      h("p", {}, t("brief_text")),
      notice && h("p", { class: "warnline" }, notice),
      h("p", { class: "note" }, t("simulation_note")),
      h("p", { class: "note" }, `${t("brief_setting")}: `, museumLink("place/granada"), " · ", museumLink("polity/emirate-of-granada"), " · ", museumLink("place/sierra-nevada")),
      h("button", { type: "button", class: "primary", id: "brief-start", onclick: () => d.close() }, resumed ? t("brief_resume") : t("brief_start")),
    );
  }
  function showHelp(): void {
    let armed = false;
    const restart = h("button", { type: "button", id: "restart" }, t("restart"));
    restart.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        restart.textContent = t("restart_confirm");
        return;
      }
      begin(newSeed());
      d.close();
    });
    const d = dialog(
      "help",
      h("h2", {}, t("help")),
      h("p", {}, t("help_text")),
      h("p", { class: "note" }, t("simulation_note")),
      h("h3", {}, t("language")),
      h("p", { class: "langs" }, ...LANGS.map((code) => h("a", { href: `?lang=${code}`, lang: code, "aria-current": code === lang ? "true" : undefined }, LANG_NAMES[code]!))),
      h("div", { class: "actions" }, restart, h("button", { type: "button", class: "primary", id: "help-close", onclick: () => d.close() }, t("close"))),
    );
  }
  function showOutcome(): void {
    const o = state.outcome;
    if (!o) return;
    const why = (r: string) => (r.startsWith("q0") ? t(r) : r === "welfare" ? t("reason_welfare", { n: sc.goal.welfare }) : r === "households" ? t("reason_households") : t("reason_reserve", { n: sc.goal.reserveDays }));
    const d = dialog(
      `outcome ${o.won ? "won" : "lost"}`,
      h("h2", { id: "outcome-title" }, o.won ? t("outcome_won") : t("outcome_lost")),
      h("p", { class: "score" }, t("outcome_score", { score: o.score })),
      !o.won && h("div", {}, h("p", {}, t("outcome_reasons")), h("ul", {}, ...o.reasons.map((r) => h("li", {}, why(r))))),
      h(
        "div",
        { class: "actions" },
        h("button", { type: "button", id: "again", onclick: () => (begin(state.seed), d.close()) }, t("outcome_again")),
        h("button", { type: "button", class: "primary", id: "new-year", onclick: () => (begin(state.seed + 1), d.close()) }, t("outcome_new_year")),
      ),
    );
  }
  function begin(seed: number): void {
    clearSave(localStorage);
    state = newVillage(sc, seed);
    speed = 0;
    tab = "valley";
    selected = null;
    log.length = 0;
    keep();
    render();
  }

  // ---- Time and keys ---------------------------------------------------------------------------------------------
  let waited = 0;
  setInterval(() => {
    placeFieldPop();
    // Time does not pass behind a dialog, in a hidden tab, or when paused.
    if (speed === 0 || state.outcome || document.hidden || document.querySelector("dialog[open]")) return;
    waited += 100;
    if (waited >= DAY_MS[speed]) {
      waited = 0;
      nextDay();
    }
  }, 100);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && speed !== 0) setSpeed(0);
  });
  document.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;
    if (e.ctrlKey || e.metaKey || e.altKey || document.querySelector("dialog[open]") || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
    const tabs: Tab[] = ["valley", "fields", "works", "market", "ledger"];
    if (e.key >= "1" && e.key <= "5") setTab(tabs[Number(e.key) - 1]!);
    else if (e.key === "p" || e.key === "P") setSpeed(speed === 0 ? 1 : 0);
    else if (e.key === "." || e.key === "n" || e.key === "N") nextDay();
    else if (e.key === "h" || e.key === "H" || e.key === "?") showHelp();
    else if (placing && e.key === "Escape") stopPlacing();
    else if (placing && e.key === "Enter" && !["BUTTON", "A"].includes(target.tagName)) {
      if (ghost) buildAt(ghost.x, ghost.z);
    } else if (placing && view === "plan" && e.key.startsWith("Arrow") && ghost) {
      // On the plan the ground considered is moved by the arrow keys: eight metres, or thirty-two with Shift.
      const step = e.shiftKey ? 32 : 8;
      considerSite(ghost.x + (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0), ghost.z + (e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0));
    } else return;
    e.preventDefault();
  });

  const hook: Record<string, unknown> = { ready: true, lang, scenario: sc.id, state: () => state, speed: () => speed, tab: () => tab, music, saveOk: () => saveOk, order: (c: VillageCommand) => order(c), days: (n: number) => { for (let i = 0; i < n; i++) nextDay(); }, begin: (seed: number) => begin(seed), view: () => view, setView: (to: "3d" | "plan") => setView(to), stage: () => stage, threeD: "pending" };
  hook.quality = quality;
  if (counters) {
    counters.provide("renderer", () => stage?.info() ?? null);
    hook.counters = () => counters.snapshot();
    hook.countersStartOver = () => counters.startOver();
  }
  window.__GR__ = hook;
  render();
  if (state.outcome) showOutcome();
  else showBrief();

  // The 3D valley comes up after the game is already playable from the plan. If it cannot, the plan stays.
  if (query.has("no3d")) hook.threeD = "off";
  else {
    try {
      const capability = await probeWebGPU();
      if (!capability.supported) throw new Error(capability.failure ?? "no WebGPU");
      say(t("boot_3d"));
      const { Stage: StageClass } = await import("./stage");
      stage = await StageClass.create(sceneBox, {
        seed: state.seed,
        quality,
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        models: query.get("models") !== "off",
        onField: (id) => {
          selected = id;
          tab = "fields";
          render();
        },
        onSite: (x, z) => considerSite(x, z),
        onBuild: (x, z) => buildAt(x, z),
      });
      stage.run();
      viewBar.hidden = false;
      setView(query.get("view") === "plan" ? "plan" : "3d");
      hook.threeD = "on";
    } catch (e) {
      hook.threeD = `failed: ${e instanceof Error ? e.message : String(e)}`;
      say(t("no_3d"));
    }
  }
}

main().catch((e) => {
  window.__GR__ = { ready: false, error: e instanceof Error ? e.message : String(e) };
  console.error(e);
});
