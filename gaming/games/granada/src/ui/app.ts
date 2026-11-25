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
import { act, newVillage, tick, type ActResult, type Scenario, type VillageCommand, type VillageState } from "../sim/village";
import { clearSave, readSave, writeSave } from "../save";
import { drawMap } from "./map";
import { advice, fieldCards, marketRows, questRows, riverOfYear, skyAhead, stocks, workRows, yesterday, type FieldCard } from "./model";

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
  let speed: 0 | 1 | 2 = 0;
  let tab: Tab = "valley";
  let selected: string | null = null;
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
  mapBox.append(map);
  const side = h("aside", { class: "side", id: "side" });
  const toasts = h("div", { class: "toasts", role: "log" });
  app.append(bar, ahead, h("main", { class: "main" }, mapBox, side), toasts);

  const music = new MusicPlayer({ base: MUSIC_BASE, first: "the-ancient-library", forceOff: query.get("music") === "off" || !MUSIC_AVAILABLE });
  const musicBox = MUSIC_AVAILABLE ? musicControl(music, await loadMusicStrings(lang), `${MUSEUM}/${lang}/backstage/`) : null;

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
      h("div", { class: "menu" }, musicBox, h("button", { type: "button", id: "btn-help", onclick: () => showHelp() }, t("help"))),
    );
    const line = (name: string, g: NonNullable<typeof s.tomorrow>) => h("span", { class: "ahead-part" }, h("b", {}, `${name}: `), `${t("stock_dinars")} ${num(g.dinars)} · ${t("stock_food")} ${t("stock_days", { n: g.reserveDays })} · ${t("stock_welfare")} ${num(g.welfare)} · ${t("stock_pool")} ${num(g.pool)}`);
    ahead.replaceChildren(...([h("span", { class: "ahead-title" }, t("ahead_title")), s.tomorrow && line(t("tomorrow"), s.tomorrow), s.inTen && line(t("in_ten"), s.inTen), !saveOk && h("span", { class: "warnline" }, t("save_failed"))].filter(Boolean) as Node[]));
  }

  const fieldLabel = (f: FieldCard): string => `${fieldName(f.id)}: ${f.crop ? `${t(`crop_${f.crop}`)}, ` : ""}${t(`stage_${f.stage}`)}${f.stage === "growing" ? ` ${num(f.growth)}%` : ""}. ${t(`branch_${f.branch.state}`, { carries: f.branch.carries, wants: f.branch.wants })}`;

  function renderMap(): void {
    const s = stocks(sc, state);
    const works = state.works;
    drawMap(
      map,
      {
        fields: fieldCards(sc, state),
        poolPct: Math.round((100 * s.pool) / s.poolCapacity),
        storePct: Math.round((100 * s.storeUsed) / s.storeRoom),
        houses: Math.round(state.housing / 10),
        housesUnderWay: works.filter((w) => w.kind === "house").length,
        granary: state.built.granary ? "built" : works.some((w) => w.kind === "granary") ? "under-way" : "none",
        channelWork: works.some((w) => w.kind === "repair" || w.kind === "expand"),
        season: s.season,
        rain: Boolean(state.last?.rain),
        selected,
        labels: { title: t("map_title"), river: t("map_river"), pool: t("map_pool"), village: t("map_village"), store: t("map_store"), market: t("map_market"), mountain: label("place/sierra-nevada"), fieldLabel, channel: { flowing: t("map_channel_flowing"), weak: t("map_channel_weak"), none: t("map_channel_none") } },
      },
      (id) => {
        selected = id;
        tab = "fields";
        render();
        document.getElementById(`card-${id}`)?.focus();
      },
    );
  }

  const bar01 = (name: string, pct: number) => h("label", { class: "gauge" }, h("span", {}, `${name} ${num(pct)}%`), h("progress", { max: 100, value: Math.max(0, Math.min(100, pct)) }));

  function valleyPanel(): Child[] {
    const a = advice(sc, state);
    const sky = skyAhead(sc, state, 7);
    const river = riverOfYear(state);
    return [
      h("section", { class: "card advice" }, h("h2", {}, t("advice_title")), h("p", { id: "advice" }, t(a.key, { field: a.field ? fieldName(a.field) : "", days: a.days ?? 0 }))),
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
      h(
        "section",
        { class: "card" },
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

  function worksPanel(): Child[] {
    return workRows(sc, state).map((w) => {
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
    });
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

  function renderSide(): void {
    const tabs: Tab[] = ["valley", "fields", "works", "market", "ledger"];
    const panel = tab === "valley" ? valleyPanel() : tab === "fields" ? fieldsPanel() : tab === "works" ? worksPanel() : tab === "market" ? marketPanel() : ledgerPanel();
    side.replaceChildren(
      h("nav", { class: "tabs", role: "tablist" }, ...tabs.map((id) => h("button", { type: "button", role: "tab", id: `tab-${id}`, "aria-selected": String(tab === id), class: tab === id ? "on" : "", onclick: () => setTab(id) }, t(`tab_${id}`)))),
      h("div", { class: "panel", role: "tabpanel", "aria-labelledby": `tab-${tab}` }, ...panel),
    );
  }

  function render(): void {
    // Keep the keyboard where it was: the panels are rebuilt whole.
    const focus = document.activeElement as HTMLElement | null;
    const keepId = focus?.id || null;
    const keepAct = focus?.getAttribute?.("data-act") ?? null;
    renderBar();
    renderMap();
    renderSide();
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
    else return;
    e.preventDefault();
  });

  window.__GR__ = { ready: true, lang, scenario: sc.id, state: () => state, speed: () => speed, tab: () => tab, music, saveOk: () => saveOk, order: (c: VillageCommand) => order(c), days: (n: number) => { for (let i = 0; i < n; i++) nextDay(); }, begin: (seed: number) => begin(seed) };
  render();
  if (state.outcome) showOutcome();
  else showBrief();
}

main().catch((e) => {
  window.__GR__ = { ready: false, error: e instanceof Error ? e.message : String(e) };
  console.error(e);
});
