// The Golden Age screen. It holds no rules: every decision is src/rules.ts, every sentence about a state comes
// from ui/model.ts, and this file shows them, collects a command and stores the game on this device.
// The 3D district is one way to play and the plan view is another; both send the same commands.
import { loadMusicStrings, musicControl } from "@im/audio/control";
import { MUSIC_AVAILABLE, MUSIC_BASE, MusicPlayer } from "@im/audio/player";
import { installCounters } from "@im/kernel/counters";
import { probeWebGPU } from "@im/kernel/capability";
import links from "../../data/museum-links.v1.json";
import en from "../../i18n/en.json";
import { BUILDINGS, BUILDING_TYPES, CANAL_COST, GRID_H, GRID_W, PLOTS, SILT_CLEAR_COST, TAX_PER_TEN, TAX_WELFARE, newGame, plotOf, preview, score, servedByWater, step, wateredPlots, type BuildingType, type Command, type Scenario, type State, type TaxLevel } from "../rules";
import { endowCost } from "../rules";
import { SAVE_KEY, SAVE_VERSION, readSave, writeSave } from "../save";
import { CHAPTERS, FAILING_CANAL, SCENARIOS } from "../scenarios";
import { linkKey } from "../rules";
import { nearestLink, neighbour, plotAt, plotCentre, plotName, type Dir, type Link } from "../view/layout";
import { icon } from "./icons";
import { advice, aim, calendar, eventsInView, goals, isBuilding, ledger, overlay, plotInfo, plotProblems, project, researchList, showing, signed, stocks, type Line, type Projection, type Tint, type Tool, type Vars } from "./model";
import { Stage } from "./stage";

const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
type Lang = (typeof LANGS)[number];
const LANG_NAMES: Record<Lang, string> = { ar: "العربية", en: "English", ur: "اردو", fr: "Français", es: "Español", tr: "Türkçe", id: "Bahasa Indonesia" };
const NUM_LOCALE: Record<Lang, string> = { ar: "ar-EG-u-nu-latn", en: "en-GB", ur: "ur-PK-u-nu-latn", fr: "fr-FR", es: "es-ES", tr: "tr-TR", id: "id-ID" };
const RTL: Lang[] = ["ar", "ur"];
const PREFS_KEY = "im.golden-age.prefs.v1";
const TOOLS: Tool[] = ["inspect", "canal", ...BUILDING_TYPES, "demolish"];
/** Linear colours of the planning overlay. */
const TINTS: Record<Tint, [number, number, number]> = { water: [0.08, 0.6, 0.72], "new-water": [0.3, 1, 0.9], reach: [1, 0.74, 0.22], "served-house": [0.25, 1, 0.45], "unserved-house": [1, 0.3, 0.2] };

const query = new URLSearchParams(location.search);
// Asked to measure itself, the page counts its frames, memory and live resources from here on (kernel/counters.ts).
const counters = query.has("counters") ? installCounters(window as never) : null;
const lang: Lang = (LANGS as readonly string[]).includes(query.get("lang") ?? "") ? (query.get("lang") as Lang) : "en";
// The chapter in hand. A saved game brings its own; `?scenario=` starts a new game in the one named.
let scenario: Scenario = SCENARIOS[query.get("scenario") ?? ""] ?? FAILING_CANAL;

declare global {
  interface Window {
    __GA__?: Record<string, unknown>;
  }
}

type Props<K extends keyof HTMLElementTagNameMap> = Partial<HTMLElementTagNameMap[K]> & { class?: string; data?: Record<string, string> };
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Props<K> = {}, ...children: Array<Node | string | null | undefined | false>): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  const { class: cls, data, ...rest } = props;
  if (cls) node.className = cls;
  if (data) for (const [k, v] of Object.entries(data)) node.dataset[k] = v;
  Object.assign(node, rest);
  for (const c of children) if (c !== null && c !== undefined && c !== false) node.append(c);
  return node;
};
/** A thin progress bar: `share` is 0 to 1. */
const meter = (share: number): HTMLElement => {
  const fill = el("span", { class: "fill" });
  fill.style.inlineSize = `${Math.round(Math.max(0, Math.min(1, share)) * 100)}%`;
  return el("span", { class: "meter" }, fill);
};
/** A number, kept left-to-right inside right-to-left text so "56 / 80" is never reordered. */
const ltr = (text: string, cls = ""): HTMLElement => el("bdi", { dir: "ltr", textContent: text, class: cls });

function newSeed(): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return (a[0]! % 900000) + 100000;
}

async function main(): Promise<void> {
  const strings = (await import(`../../i18n/${lang}.json`)).default as Record<string, string>;
  const fallback = en as unknown as Record<string, string>;
  const t = (key: string, vars: Vars = {}): string => (strings[key] ?? fallback[key] ?? key).replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
  const num = (n: number) => new Intl.NumberFormat(NUM_LOCALE[lang], { maximumFractionDigits: 0 }).format(n);
  const line = (l: Line): string => {
    const vars: Vars = { ...(l.vars ?? {}) };
    if (typeof vars.research === "string") vars.research = t(`research_${vars.research}`);
    return t(l.id, vars);
  };
  const toolName = (tool: Tool): string => (isBuilding(tool) ? t(`building_${tool}`) : t(`tool_${tool}`));
  const whatIs = (type: BuildingType | null): string => (type ? t(`building_${type}`) : t("empty_plot"));

  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.includes(lang) ? "rtl" : "ltr";
  const setTitle = () => (document.title = `${t("title")}: ${t(`scenario_${scenario.id}`)}`);
  setTitle();
  const skip = document.querySelector<HTMLAnchorElement>("a.skip");
  if (skip) skip.textContent = t("skip");

  const app = document.getElementById("app") as HTMLElement;
  const canvas = document.getElementById("board") as HTMLCanvasElement;
  const hud = document.getElementById("hud") as HTMLElement;
  const tip = document.getElementById("tip") as HTMLElement;
  const toasts = document.getElementById("toasts") as HTMLElement;
  const live = document.getElementById("live") as HTMLElement;
  const boot = document.getElementById("boot") as HTMLElement;
  const bootText = document.getElementById("boot-text") as HTMLElement;
  canvas.setAttribute("aria-label", t("board_label"));
  const say = (text: string) => (live.textContent = text);

  const bar = el("header", { class: "bar", id: "bar" });
  const barMain = el("div", { class: "barmain" });
  // The soundtrack is the museum's own. This game opens with "The First Light" and the suite follows in order.
  const music = new MusicPlayer({ base: MUSIC_BASE, first: "the-first-light", forceOff: query.get("music") === "off" || !MUSIC_AVAILABLE });
  const planButton = el("button", { type: "button", id: "btn-plan", ariaPressed: "false", title: t("plan"), ariaLabel: t("plan"), onclick: () => togglePlan() }, icon("plan"), el("span", { textContent: t("plan") }));
  const helpButton = el("button", { type: "button", id: "btn-help", title: t("help"), ariaLabel: t("help"), onclick: () => showHelp() }, icon("help"), el("span", { textContent: t("help") }));
  const menu = el("div", { class: "menu" }, planButton, helpButton);
  if (MUSIC_AVAILABLE) menu.prepend(musicControl(music, await loadMusicStrings(lang), `https://islam.museum/${lang}/backstage/`));
  bar.append(barMain, menu);
  const side = el("aside", { class: "side", id: "side" });
  const tools = el("nav", { class: "tools", id: "tools", ariaLabel: t("tools_label") });
  const actions = el("div", { class: "actions", id: "actions" });
  const viewctl = el("div", { class: "viewctl", id: "viewctl" });
  const plan = el("section", { class: "plan", id: "plan", hidden: true, ariaLabel: t("plan_title") });
  const helpDialog = el("dialog", { class: "sheet", id: "help" });
  const outcomeDialog = el("dialog", { class: "sheet", id: "outcome" });
  const briefDialog = el("dialog", { class: "sheet", id: "brief" });
  hud.append(bar, side, tools, actions, viewctl, plan, helpDialog, outcomeDialog, briefDialog);
  // Markers over the district for what is going wrong. They repeat what the panel's list says, so they are hidden
  // from assistive technology and never take a click away from the district.
  const marks = el("div", { class: "marks", id: "marks", ariaHidden: "true" });
  canvas.after(marks);
  let markNodes: Array<{ plot: number; node: HTMLElement }> = [];

  /** The museum record behind a piece of research or a tool, as a link, when there is one. */
  const museumLink = (id: string | undefined): HTMLElement | null => {
    const record = id ? (links.records as Record<string, { label: Record<string, string> }>)[id] : undefined;
    if (!id || !record) return null;
    return el("span", { class: "museum" }, `${t("museum_in")} `, el("a", { href: `https://islam.museum/${lang}/${id}/`, target: "_blank", rel: "noopener", title: t("museum_note"), textContent: record.label[lang] ?? record.label.en ?? id }));
  };

  /** Replaces a region's content and puts keyboard focus back on the control it was on. */
  const swap = (region: HTMLElement, ...nodes: Array<Node | null | false | undefined>) => {
    const focused = document.activeElement instanceof HTMLElement && region.contains(document.activeElement) ? document.activeElement.id : "";
    region.replaceChildren(...nodes.filter((n): n is Node => Boolean(n)));
    if (focused) document.getElementById(focused)?.focus();
  };

  // ---- The game in hand ------------------------------------------------------------------------------------------------
  let writable = true;
  let saveNote = "";
  let state: State;
  // A new game is started, and its brief shown, when the address asks for one or nothing usable is saved.
  const asksNew = query.has("seed") || query.has("scenario") || query.has("fresh");
  const seedAsked = query.has("seed") ? Number(query.get("seed")) | 0 : null;
  let resumed = false;
  try {
    const reading = readSave(query.has("fresh") ? null : localStorage.getItem(SAVE_KEY));
    if (reading.status === "unreadable") {
      localStorage.setItem(`${SAVE_KEY}.unreadable`, reading.keep);
      saveNote = t("save_unreadable");
    }
    if (reading.status === "newer") {
      writable = false;
      saveNote = t("save_newer");
    }
    const saved = reading.save.state;
    if (saved && saved.scenario in SCENARIOS && !asksNew) {
      state = saved;
      scenario = SCENARIOS[saved.scenario]!;
      resumed = true;
    } else state = newGame(scenario, seedAsked ?? newSeed());
  } catch {
    writable = false; // storage is unavailable: the game plays, it just is not remembered
    state = newGame(scenario, seedAsked ?? newSeed());
  }
  setTitle();
  const persist = () => {
    if (!writable) return;
    try {
      localStorage.setItem(SAVE_KEY, writeSave({ v: SAVE_VERSION, state }));
    } catch {
      /* private mode or full storage */
    }
  };
  let prefs: { quality: "high" | "low" } = { quality: "high" };
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") as { quality?: string };
    if (raw.quality === "low") prefs = { quality: "low" };
  } catch {
    /* defaults */
  }
  if (query.get("q") === "low" || query.get("q") === "high") prefs = { quality: query.get("q") as "low" | "high" };

  let proj: Projection | null = project(scenario, state);
  let undoStack: State[] = [];
  let tool: Tool = "inspect";
  let tab: "city" | "ledger" | "research" = "city";
  let cursorPlot = plotOf(2, 1);
  let hoverPlot: number | null = null;
  let hoverLink: Link | null = null;
  let pointer: [number, number] | null = null;
  let keyboardCursor = false;
  let stage: Stage | null = null;
  let planOpen = false;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Toasts and the tooltip -----------------------------------------------------------------------------------------
  const toast = (text: string, tone: "" | "good" | "warn" | "bad" = "") => {
    const node = el("div", { class: `toast ${tone}`, textContent: text });
    toasts.append(node);
    while (toasts.children.length > 4) toasts.firstElementChild?.remove();
    setTimeout(() => node.remove(), 9000);
  };
  const lineNode = (l: Line) => el("li", { class: l.tone ?? "", textContent: line(l) });
  const hideTip = (): void => {
    tip.hidden = true;
  };
  const showTip = (x: number, y: number, title: string, body: Array<Node | null | false>) => {
    tip.replaceChildren(el("strong", { textContent: title }), ...body.filter((n): n is Node => Boolean(n)));
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    tip.style.left = `${Math.max(8, Math.min(window.innerWidth - r.width - 8, x + 18))}px`;
    tip.style.top = `${Math.max(8, Math.min(window.innerHeight - r.height - 8, y + 18))}px`;
  };

  // ---- Commands ----------------------------------------------------------------------------------------------------------
  const servedCount = (s: State): number => {
    const wet = wateredPlots(s);
    let n = 0;
    for (let p = 0; p < PLOTS; p++) if (servedByWater(wet, p)) n++;
    return n;
  };
  function dispatch(cmd: Command, dug: [number, number] | null = null): void {
    const before = state;
    state = step(scenario, state, cmd);
    if (cmd.type === "end-season") undoStack = [];
    else undoStack.push(before);
    proj = project(scenario, state);
    persist();
    stage?.sync(state, dug);
    if (cmd.type === "build") toast(t("toast_built", { name: t(`building_${cmd.building}`) }), "good");
    else if (cmd.type === "demolish") toast(t("toast_cleared", { name: whatIs(before.plots[cmd.plot] ?? null) }));
    else if (cmd.type === "canal") toast(t("toast_canal", { n: servedCount(state) }), "good");
    else if (cmd.type === "endow") toast(t("toast_endowed", { name: whatIs(state.plots[cmd.plot] ?? null) }), "good");
    else if (cmd.type === "end-season") seasonNews(before);
    renderAll();
    if (before.outcome === "playing" && state.outcome !== "playing") showOutcome();
  }
  function seasonNews(before: State): void {
    const r = state.last!;
    const c = calendar(before.season);
    const money = r.income.tax + r.income.trade + r.income.sales - r.upkeep;
    const text = t("toast_season", { season: t(`season_${c.soy}`), year: c.year, harvest: num(r.harvest), money: signed(money), households: signed(state.households - before.households) });
    toast(text, money < 0 || state.households < before.households ? "warn" : "");
    say(text);
    if (r.completedResearch) toast(t("toast_research", { research: t(`research_${r.completedResearch}`) }), "good");
    for (const e of state.events) {
      if (e.season === state.season) toast(t("toast_event_start", { event: t(`event_${e.kind}`), effect: t(`effect_${e.kind}`) }), e.kind === "good-harvest" || e.kind === "caravan" ? "good" : "warn");
      else if (e.season === state.season + 1 && !before.events.some((b) => b.kind === e.kind && b.season === e.season)) toast(t("toast_event_warn", { event: t(`event_${e.kind}`), effect: t(`effect_${e.kind}`) }), e.kind === "good-harvest" || e.kind === "caravan" ? "good" : "warn");
    }
  }
  function refuse(reason: string | undefined): void {
    const text = t(`reason_${reason ?? "same"}`);
    say(text);
    toast(text, "bad");
  }
  /** Uses the tool in hand at a plot, or (for the canal) on a link. */
  function act(plot: number | null, link: [number, number] | null): void {
    if (plot !== null) cursorPlot = plot;
    if (tool === "inspect") {
      tab = "city";
      renderAll();
      return;
    }
    const a = aim(state, tool, plot, link);
    if (!a.command || !a.preview) return;
    if (!a.preview.ok) refuse(a.preview.reason);
    else dispatch(a.command, a.dug);
  }
  function undo(): void {
    const back = undoStack.pop();
    if (!back) return;
    state = back;
    proj = project(scenario, state);
    persist();
    stage?.sync(state);
    toast(t("toast_undone"));
    renderAll();
  }
  function restart(seed: number, chapter: string = scenario.id): void {
    scenario = SCENARIOS[chapter] ?? scenario;
    setTitle();
    state = newGame(scenario, seed);
    keepTool();
    undoStack = [];
    proj = project(scenario, state);
    persist();
    stage?.sync(state);
    outcomeDialog.close();
    helpDialog.close();
    renderAll();
    showBrief();
  }
  /** One goal as a sentence, for the panel, the brief and the outcome. */
  const goalLine = (row: ReturnType<typeof goals>["rows"][number], g: ReturnType<typeof goals>): string =>
    row.id === "welfare" ? t("goal_welfare", { goal: row.goal, steady: g.steady, n: g.steadyGoal }) : row.id === "treasury" ? t("goal_treasury") : t(`goal_${row.id}`, { value: num(row.value), goal: num(row.goal) });
  // A chapter change can take the tool in hand away (endowing is not open everywhere).
  const keepTool = () => {
    if (tool === "endow" && !state.mayEndow) tool = "inspect";
  };
  /** The chapter's charge: what the district is, what is asked, and the museum's own account of the history behind it. */
  function showBrief(): void {
    const g = goals(scenario, state);
    const records = links.records as Record<string, { label: Record<string, string>; summary?: Record<string, string> }>;
    const history = ((links.scenario as Record<string, string[]>)[scenario.id] ?? []).map((id) => {
      const record = records[id];
      if (!record?.summary) return null;
      const told = el("p", { textContent: record.summary[lang] ?? record.summary.en ?? "" });
      told.dir = "auto";
      return el("div", { class: "history" }, el("a", { href: `https://islam.museum/${lang}/${id}/`, target: "_blank", rel: "noopener", textContent: record.label[lang] ?? record.label.en ?? id }), told);
    });
    const parts: Array<HTMLElement | null> = [
      el("p", { class: "kicker", textContent: t("chapter", { n: CHAPTERS.findIndex((c) => c.id === scenario.id) + 1 }) }),
      el("h2", { textContent: t(`scenario_${scenario.id}`) }),
      el("p", { textContent: t(`brief_${scenario.id}`) }),
      el("h3", {}, t("brief_goal"), el("small", { textContent: ` ${t("goal_deadline", { year: Math.ceil(scenario.seasons / 4) })}` })),
      el("ul", { class: "lines" }, ...g.rows.map((row) => el("li", { textContent: goalLine(row, g) }))),
      history.some(Boolean) ? el("div", { class: "behind" }, el("h3", { textContent: t("museum_behind") }), ...history, el("p", { class: "muted small", textContent: t("museum_note") })) : null,
      el("div", { class: "row" }, el("button", { type: "button", id: "brief-begin", class: "primary", textContent: t("brief_begin"), onclick: () => briefDialog.close() })),
    ];
    briefDialog.replaceChildren(...parts.filter((n): n is HTMLElement => n !== null));
    if (!briefDialog.open) briefDialog.showModal();
    document.getElementById("brief-begin")?.focus();
  }
  function setTool(next: Tool): void {
    if (next === "endow" && !state.mayEndow) return;
    if (isBuilding(next)) {
      const needs = BUILDINGS[next].needs;
      if (needs && !state.researched.includes(needs)) {
        const text = t("locked", { research: t(`research_${needs}`) });
        say(text);
        toast(text, "warn");
        return;
      }
    }
    tool = next;
    say(t("tool_now", { name: toolName(tool) }));
    renderTools();
    renderPlan();
    refreshHighlight();
  }
  /** Moves the plot cursor one step; with `dig`, the canal tool digs the link it crosses. */
  function moveCursor(dir: Dir, dig: boolean): void {
    const to = neighbour(cursorPlot, dir);
    if (to === null) return;
    const from = cursorPlot;
    keyboardCursor = true;
    cursorPlot = to;
    if (dig && tool === "canal") act(to, [from, to]);
    else {
      renderSide();
      renderPlan();
    }
    stage?.lookAt(cursorPlot);
    refreshHighlight();
    const info = plotInfo(state, cursorPlot);
    say(t("cursor_moved", { name: plotName(cursorPlot), what: `${whatIs(info.type)}. ${line(info.lines[0]!)}` }));
  }

  // ---- The top bar ---------------------------------------------------------------------------------------------------------
  function renderBar(): void {
    const c = calendar(showing(state));
    const g = goals(scenario, state);
    const chips = stocks(scenario, state, proj).map((s) => {
      const label = t(`stock_${s.id}`);
      const value = s.id === "water" ? `${num(s.value)} / ${num(s.of ?? 0)}` : s.id === "households" || s.id === "knowledge" ? `${num(s.value)} / ${num(s.of ?? 0)}` : num(s.value);
      const spoken = [`${label}: ${s.id === "water" ? t("stock_water_note", { value: s.value, of: s.of ?? 0 }) : s.of !== undefined ? t("stock_of", { value: s.value, of: s.of }) : num(s.value)}`, s.delta !== null && s.delta !== 0 ? t("stock_delta", { delta: signed(s.delta) }) : ""].filter(Boolean).join(", ");
      return el("div", { class: `stock tone-${s.tone}`, id: `stock-${s.id}`, role: "group", ariaLabel: spoken, title: spoken }, icon(s.id), el("span", { class: "v" }, ltr(value)), s.delta !== null && s.delta !== 0 ? ltr(signed(s.delta), `d ${s.delta < 0 ? "down" : "up"}`) : null, el("span", { class: "l", textContent: label }));
    });
    swap(
      barMain,
      el("div", { class: "brand" }, el("h1", { textContent: t("title") }), el("span", { class: "sub" }, t(`scenario_${scenario.id}`), " · ", el("span", { class: "badge", textContent: t("prototype") }))),
      el("div", { class: "when", id: "when" }, icon("season"), el("span", {}, el("strong", { textContent: t("calendar", { year: c.year, season: t(`season_${c.soy}`) }) }), el("small", { textContent: t("seasons_left", { n: g.seasonsLeft }) }))),
      el("div", { class: "stocks" }, ...chips),
    );
    planButton.ariaPressed = String(planOpen);
  }

  // ---- The side panel --------------------------------------------------------------------------------------------------
  function cityTab(): Node[] {
    const g = goals(scenario, state);
    const lastYear = Math.ceil(scenario.seasons / 4);
    const goalText = (row: (typeof g.rows)[number]) => goalLine(row, g);
    const goalRows = g.rows.map((row) => {
      const share = row.id === "welfare" ? g.steady / g.steadyGoal : row.id === "treasury" ? (row.met ? 1 : 0) : Math.min(1, row.value / row.goal);
      return el("li", { class: row.met ? "met" : "" }, el("span", { class: "tick" }, row.met ? icon("check", 16) : null), el("span", { class: "goal-text" }, goalText(row), el("span", { class: "visually-hidden", textContent: ` (${row.met ? t("goal_met") : t("goal_open")})` })), meter(share));
    });
    const note = advice(scenario, state, proj);
    const events = eventsInView(state);
    const eventRows = events.map((e) => {
      const when = e.inSeasons === 0 ? (e.seasonsLeft > 1 ? t("event_now_more", { n: e.seasonsLeft }) : t("event_now")) : e.inSeasons === 1 ? t("event_next") : t("event_in", { n: e.inSeasons });
      return el("li", { class: e.kind === "good-harvest" || e.kind === "caravan" ? "good" : "warn" }, el("strong", { textContent: `${t(`event_${e.kind}`)} · ${when}` }), el("span", { textContent: ` ${t(`effect_${e.kind}`)}` }));
    });
    const tax = el(
      "div",
      { class: "seg", role: "group", ariaLabel: t("tax_title") },
      ...([0, 1, 2] as TaxLevel[]).map((level) => el("button", { type: "button", id: `tax-${level}`, ariaPressed: String(state.tax === level), disabled: state.outcome !== "playing", textContent: t(`tax_${level}`), onclick: () => { if (state.tax !== level) dispatch({ type: "tax", level }); } })),
    );
    const silt = state.canalCondition < 1000 ? el("div", { class: "card" }, el("p", { textContent: t("canal_condition", { percent: Math.round(state.canalCondition / 10) }) }), el("button", { type: "button", id: "clear-silt", disabled: !preview(state, { type: "clear-silt" }).ok, textContent: t("clear_silt", { cost: SILT_CLEAR_COST }), onclick: () => dispatch({ type: "clear-silt" }) })) : null;
    const info = plotInfo(state, cursorPlot);
    const problems = plotProblems(state);
    const attention = problems.length
      ? el(
          "div",
          { class: "card", id: "attention" },
          el("h2", { textContent: t("attention_title") }),
          el(
            "ul",
            { class: "lines" },
            ...problems.slice(0, 5).map((pr) =>
              el(
                "li",
                {},
                el("button", {
                  type: "button",
                  class: "linklike",
                  id: `attn-${pr.plot}`,
                  textContent: `${plotName(pr.plot)} · ${whatIs(state.plots[pr.plot] ?? null)}`,
                  onclick: () => {
                    cursorPlot = pr.plot;
                    keyboardCursor = true;
                    stage?.lookAt(pr.plot);
                    renderAll();
                  },
                }),
                ` ${line(pr.line)}`,
              ),
            ),
            problems.length > 5 ? el("li", { class: "muted", textContent: t("attention_more", { n: problems.length - 5 }) }) : null,
          ),
        )
      : null;
    const cards: Array<HTMLElement | null> = [
      el("div", { class: "card goal" }, el("h2", {}, t("brief_goal"), el("small", { textContent: ` ${t("goal_deadline", { year: lastYear })}` })), el("ul", { class: "goals" }, ...goalRows)),
      note ? el("div", { class: `card advice ${note.tone ?? ""}`, id: "advice" }, el("h2", { textContent: t("advice_title") }), el("p", { textContent: line(note) })) : null,
      attention,
      el("div", { class: "card" }, el("h2", { textContent: t("horizon_title") }), events.length ? el("ul", { class: "lines" }, ...eventRows) : el("p", { class: "muted", textContent: t("horizon_none") })),
      el("div", { class: "card" }, el("h2", { textContent: t("tax_title") }), tax, el("p", { class: "muted", textContent: t("tax_note", { coins: TAX_PER_TEN[state.tax], welfare: signed(-TAX_WELFARE[state.tax]) }) })),
      silt,
      el("div", { class: "card", id: "selected" }, el("h2", {}, t("selected_title", { name: plotName(cursorPlot) }), el("small", { textContent: ` ${whatIs(info.type)}` })), el("ul", { class: "lines" }, ...info.lines.map(lineNode))),
      el("p", { class: "muted small" }, t("seed", { seed: state.seed }), " · ", saveNote || t("saved_note")),
    ];
    return cards.filter((n): n is HTMLElement => n !== null);
  }
  function ledgerTab(): Node[] {
    const block = (title: string, id: string, report: State["last"], open: boolean) =>
      el(
        "details",
        { class: "card", id, open },
        el("summary", { textContent: title }),
        report ? el("div", {}, ...ledger(report).map((g) => el("div", { class: "group" }, el("h3", { textContent: t(`ledger_group_${g.id}`) }), el("ul", { class: "lines" }, ...g.lines.map(lineNode))))) : el("p", { class: "muted", textContent: t("ledger_none") }),
      );
    return [proj ? block(t("ledger_next"), "ledger-next", proj.report, true) : null, block(t("ledger_last"), "ledger-last", state.last, !proj)].filter((n): n is HTMLDetailsElement => Boolean(n));
  }
  function researchTab(): Node[] {
    const rows = researchList(state).map((r) => {
      const status = r.state === "done" ? t("research_done") : r.state === "current" ? t("research_progress", { progress: r.progress, cost: r.cost }) : r.state === "locked" && r.needs ? t("research_needs", { research: t(`research_${r.needs}`) }) : t("research_cost", { cost: r.cost });
      const button =
        r.state === "open"
          ? el("button", { type: "button", id: `research-${r.id}`, disabled: state.outcome !== "playing", textContent: t("research_choose"), onclick: () => dispatch({ type: "research", id: r.id }) })
          : r.state === "current"
            ? el("button", { type: "button", id: `research-${r.id}`, textContent: t("research_stop"), onclick: () => dispatch({ type: "research", id: null }) })
            : null;
      return el("li", { class: `research ${r.state}` }, el("div", {}, el("strong", { textContent: t(`research_${r.id}`) }), el("span", { class: "status", textContent: status }), el("p", { textContent: t(`research_effect_${r.id}`) }), museumLink((links.research as Record<string, string>)[r.id]), r.state === "current" ? meter(r.progress / r.cost) : null), button);
    });
    return [el("div", { class: "card" }, el("p", { class: "muted", textContent: t("research_note") }), el("p", { textContent: t("research_in_hand", { n: state.knowledge }) }), el("ul", { class: "research-list" }, ...rows))];
  }
  function renderSide(): void {
    const tabs = (["city", "ledger", "research"] as const).map((id) =>
      el("button", {
        type: "button",
        id: `tab-${id}`,
        role: "tab",
        ariaSelected: String(tab === id),
        textContent: t(`tab_${id}`),
        onclick: () => {
          tab = id;
          renderSide();
        },
      }),
    );
    swap(side, el("div", { class: "tabs", role: "tablist" }, ...tabs), el("div", { class: "tabpanel", role: "tabpanel", id: "tabpanel" }, ...(tab === "city" ? cityTab() : tab === "ledger" ? ledgerTab() : researchTab())));
  }

  // ---- Tools and actions ---------------------------------------------------------------------------------------------------
  const toolCost = (tl: Tool): number | null => (tl === "canal" ? CANAL_COST : isBuilding(tl) ? BUILDINGS[tl].cost : null);
  /** The tools on offer: endowing joins them in the chapter that opens it. */
  const toolList = (): Tool[] => (state.mayEndow ? [...TOOLS.slice(0, -1), "endow", "demolish"] : TOOLS);
  function renderTools(): void {
    const buttons = toolList().map((tl, i) => {
      const cost = toolCost(tl);
      const needs = isBuilding(tl) ? BUILDINGS[tl].needs : undefined;
      const locked = Boolean(needs && !state.researched.includes(needs));
      const poor = cost !== null && state.treasury < cost;
      const key = tl === "inspect" ? "I" : tl === "canal" ? "C" : tl === "demolish" ? "X" : tl === "endow" ? "T" : String((i - 1) % 10);
      const title = locked && needs ? t("locked", { research: t(`research_${needs}`) }) : `${toolName(tl)}${cost !== null ? ` · ${t("cost", { cost })}` : ""}`;
      return el("button", { type: "button", id: `tool-${tl}`, class: `tool${locked ? " locked" : ""}${poor ? " poor" : ""}`, ariaPressed: String(tool === tl), ariaDisabled: String(locked), title, onclick: () => setTool(tl) }, icon(tl), el("span", { class: "name", textContent: toolName(tl) }), cost !== null ? ltr(String(cost), "cost") : el("span", { class: "cost" }), el("kbd", { textContent: key, ariaHidden: "true" } as Props<"kbd">));
    });
    const b = isBuilding(tool) ? BUILDINGS[tool] : null;
    const toolMuseum = museumLink((links.tool as Record<string, string>)[tool]);
    swap(tools, el("div", { class: "toolrow" }, ...buttons), el("p", { class: "tooldesc", id: "tooldesc" }, el("strong", { textContent: `${toolName(tool)}. ` }), t(`desc_${tool}`), b ? ` ${t("upkeep_line", { upkeep: b.upkeep, workers: b.workers, water: b.water })}` : "", toolMuseum ? " · " : "", toolMuseum));
  }
  function renderActions(): void {
    const over = state.outcome !== "playing";
    swap(
      actions,
      el("button", { type: "button", id: "undo", disabled: undoStack.length === 0, title: t("undo"), onclick: () => undo() }, icon("undo"), el("span", { textContent: t("undo") })),
      over
        ? el("button", { type: "button", id: "end-season", class: "primary", onclick: () => showOutcome() }, el("span", { textContent: t(`outcome_${state.outcome}`) }))
        : el("button", { type: "button", id: "end-season", class: "primary", onclick: () => dispatch({ type: "end-season" }) }, el("span", { textContent: t("end_season") })),
    );
  }
  function renderViewControls(): void {
    const b = (id: string, name: string, label: string, fn: () => void) => el("button", { type: "button", id, title: label, ariaLabel: label, onclick: fn }, icon(name));
    swap(viewctl, b("view-in", "plus", t("zoom_in"), () => stage?.zoomBy(1 / 1.35)), b("view-out", "minus", t("zoom_out"), () => stage?.zoomBy(1.35)), b("view-left", "left", t("turn_left"), () => stage?.turnBy(-Math.PI / 8)), b("view-right", "right", t("turn_right"), () => stage?.turnBy(Math.PI / 8)), b("view-all", "overview", t("overview"), () => stage?.overview()));
  }

  // ---- The plan: the whole board as buttons -----------------------------------------------------------------------------
  function renderPlan(): void {
    if (plan.hidden) return;
    const wet = wateredPlots(state);
    const cells: HTMLElement[] = [];
    const linkButton = (a: number, b: number, vertical: boolean) => {
      const dug = state.canals.includes(linkKey(a, b));
      const ok = !dug && preview(state, { type: "canal", a, b }).ok;
      const label = `${t("plan_link", { a: plotName(a), b: plotName(b) })}: ${dug ? t("plan_link_dug") : t("plan_link_dig", { cost: CANAL_COST })}`;
      return el("button", { type: "button", id: `link-${a}-${b}`, class: `plink${vertical ? " v" : " h"}${dug ? " dug" : ok ? " ok" : ""}`, tabIndex: -1, ariaLabel: label, title: label, disabled: dug, onclick: () => actLink(a, b) });
    };
    for (let y = GRID_H - 1; y >= 0; y--) {
      for (let x = 0; x < GRID_W; x++) {
        const p = plotOf(x, y);
        const type = state.plots[p] ?? null;
        const info = plotInfo(state, p);
        const label = `${t("plan_plot", { name: plotName(p), what: whatIs(type) })} ${line(info.lines[0]!)}${wet[p] ? ` ${t("plan_canal_through")}` : ""}`;
        cells.push(
          el(
            "button",
            {
              type: "button",
              id: `plot-${p}`,
              class: `pplot ${type ?? "empty"}${info.served ? " served" : ""}${wet[p] ? " wet" : ""}${p === cursorPlot ? " cursor" : ""}`,
              tabIndex: p === cursorPlot ? 0 : -1,
              ariaLabel: label,
              title: label,
              onclick: () => {
                keyboardCursor = true;
                act(p, null);
                refreshHighlight();
              },
            },
            type ? icon(type, 18) : null,
            el("span", { class: "pname", textContent: plotName(p), ariaHidden: "true" } as Props<"span">),
          ),
        );
        if (x < GRID_W - 1) cells.push(linkButton(p, plotOf(x + 1, y), false));
      }
      if (y > 0) {
        for (let x = 0; x < GRID_W; x++) {
          cells.push(linkButton(plotOf(x, y - 1), plotOf(x, y), true));
          if (x < GRID_W - 1) cells.push(el("span", { class: "pgap" }));
        }
      }
    }
    swap(plan, el("div", { class: "planhead" }, el("h2", { textContent: t("plan_title") }), el("button", { type: "button", id: "plan-close", class: "x", ariaLabel: t("close"), title: t("close"), onclick: () => togglePlan() }, icon("demolish", 16))), el("p", { class: "muted small", textContent: t("plan_note") }), el("div", { class: "pgrid", id: "pgrid", dir: "ltr" }, ...cells), el("div", { class: "priver", textContent: t("plan_river") }));
  }
  function actLink(a: number, b: number): void {
    const target = aim(state, "canal", null, [a, b]);
    if (!target.command || !target.preview) return;
    if (!target.preview.ok) refuse(target.preview.reason);
    else dispatch(target.command, target.dug);
  }
  function togglePlan(force?: boolean): void {
    planOpen = force ?? !planOpen;
    plan.hidden = !planOpen;
    app.classList.toggle("plan-open", planOpen);
    renderPlan();
    renderBar();
    if (planOpen) document.getElementById(`plot-${cursorPlot}`)?.focus();
  }
  plan.addEventListener("keydown", (e) => {
    const dir = ({ ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 } as Record<string, Dir>)[e.key];
    if (dir === undefined || !(e.target instanceof HTMLElement) || !e.target.classList.contains("pplot")) return;
    e.preventDefault();
    moveCursor(dir, e.shiftKey);
    document.getElementById(`plot-${cursorPlot}`)?.focus();
  });

  // ---- Dialogs ---------------------------------------------------------------------------------------------------------------
  function showHelp(): void {
    let armed: "" | "same" | "new" | "chapter" = "";
    let chosen = scenario.id;
    const draw = () => {
      const chapterSelect = el("select", { id: "chapter", onchange: () => (chosen = chapterSelect.value) }, ...CHAPTERS.map((c, i) => el("option", { value: c.id, textContent: `${t("chapter", { n: i + 1 })}: ${t(`scenario_${c.id}`)}`, selected: c.id === chosen })));
      const chapterStart = el("button", {
        type: "button",
        id: "chapter-start",
        textContent: armed === "chapter" ? t("restart_confirm") : t("chapter_start"),
        class: armed === "chapter" ? "danger" : "",
        onclick: () => {
          if (armed !== "chapter" && state.season > 0 && state.outcome === "playing") {
            armed = "chapter";
            draw();
            document.getElementById("chapter-start")?.focus();
          } else restart(newSeed(), chosen);
        },
      });
      const restartButton = (kind: "same" | "new") =>
        el("button", {
          type: "button",
          id: `restart-${kind}`,
          textContent: armed === kind ? t("restart_confirm") : t(`restart_${kind}`),
          class: armed === kind ? "danger" : "",
          onclick: () => {
            if (armed !== kind && state.season > 0 && state.outcome === "playing") {
              armed = kind;
              draw();
              document.getElementById(`restart-${kind}`)?.focus();
            } else restart(kind === "same" ? state.seed : newSeed());
          },
        });
      const langSelect = el("select", { id: "lang", onchange: () => go({ lang: langSelect.value }) }, ...LANGS.map((l) => el("option", { value: l, textContent: LANG_NAMES[l], selected: l === lang, lang: l })));
      const qualitySelect = el(
        "select",
        {
          id: "quality",
          onchange: () => {
            try {
              localStorage.setItem(PREFS_KEY, JSON.stringify({ quality: qualitySelect.value }));
            } catch {
              /* not remembered */
            }
            go({ q: qualitySelect.value });
          },
        },
        el("option", { value: "high", textContent: t("graphics_high"), selected: prefs.quality === "high" }),
        el("option", { value: "low", textContent: t("graphics_low"), selected: prefs.quality === "low" }),
      );
      helpDialog.replaceChildren(
        el("h2", { textContent: t("help_title") }),
        el("ol", { class: "help" }, ...[1, 2, 3, 4, 5, 6].map((i) => el("li", { textContent: t(`help_${i}`) }))),
        el("p", { class: "muted", textContent: t("help_controls") }),
        el("p", { class: "muted", textContent: `${t("help_7")} ${t("museum_note")}` }),
        el("div", { class: "settings" }, el("label", {}, t("language"), " ", langSelect), el("label", {}, t("graphics"), " ", qualitySelect)),
        el(
          "div",
          { class: "settings" },
          el("label", {}, t("chapter_label"), " ", chapterSelect),
          chapterStart,
          el("button", {
            type: "button",
            id: "brief-read",
            textContent: t("brief_read"),
            onclick: () => {
              helpDialog.close();
              showBrief();
            },
          }),
        ),
        el("div", { class: "row" }, restartButton("same"), restartButton("new"), el("button", { type: "button", id: "help-close", class: "primary", textContent: t("close"), onclick: () => helpDialog.close() })),
      );
    };
    draw();
    helpDialog.showModal();
    document.getElementById("help-close")?.focus();
  }
  /** Reloads with changed query parameters (language, graphics). The game is saved, so it comes back as it was. */
  function go(changes: Record<string, string>): void {
    const next = new URLSearchParams(location.search);
    next.delete("seed");
    next.delete("fresh");
    for (const [k, v] of Object.entries(changes)) next.set(k, v);
    location.search = next.toString();
  }
  function showOutcome(): void {
    const g = goals(scenario, state);
    const rows = g.rows.map((row) => el("li", { class: row.met ? "good" : "bad" }, goalLine(row, g), " · ", row.met ? t("goal_met") : t("goal_open")));
    const next = CHAPTERS[CHAPTERS.findIndex((c) => c.id === scenario.id) + 1];
    outcomeDialog.replaceChildren(
      el("h2", { textContent: t(`outcome_${state.outcome}`) }),
      el("p", { textContent: t(`outcome_${state.outcome}_text`) }),
      el("ul", { class: "lines" }, ...rows),
      el("p", { class: "muted", textContent: t("score_line", { score: score(scenario, state) }) }),
      el(
        "div",
        { class: "row" },
        el("button", { type: "button", id: "again-same", textContent: t("restart_same"), onclick: () => restart(state.seed) }),
        el("button", { type: "button", id: "again-new", textContent: t("restart_new"), onclick: () => restart(newSeed()) }),
        next ? el("button", { type: "button", id: "next-chapter", textContent: t("next_chapter", { name: t(`scenario_${next.id}`) }), onclick: () => restart(newSeed(), next.id) }) : null,
        el("button", { type: "button", id: "outcome-close", class: "primary", textContent: t("look_around"), onclick: () => outcomeDialog.close() }),
      ),
    );
    if (!outcomeDialog.open) outcomeDialog.showModal();
    say(`${t(`outcome_${state.outcome}`)}. ${t(`outcome_${state.outcome}_text`)}`);
    tab = "ledger";
    renderSide();
  }

  // ---- The overlay in the 3D view, and the tooltip that follows the pointer ----------------------------------------------
  function refreshHighlight(): void {
    const at = keyboardCursor ? cursorPlot : hoverPlot;
    let link: [number, number] | null = tool === "canal" && hoverLink && !keyboardCursor ? [hoverLink.a, hoverLink.b] : null;
    // A link that is already dug is not something to aim at: leave it alone, so its water is not hidden under a
    // warning the moment after it is dug.
    if (link && state.canals.includes(linkKey(link[0], link[1]))) link = null;
    const a = aim(state, tool, at, link);
    stage?.setHighlight({
      tiles: overlay(state, tool, at, link).map(([p, tint]) => [p, ...TINTS[tint]]),
      cursor: tool === "canal" && !keyboardCursor ? null : at === null ? null : { plot: at, ok: a.preview ? a.preview.ok : null },
      link: link ? { a: link[0], b: link[1], ok: Boolean(a.preview?.ok) } : null,
    });
    if (!pointer || keyboardCursor) return hideTip();
    if (tool === "canal") {
      if (!link || !a.preview) return hideTip();
      const gain = a.preview.ok ? overlay(state, tool, null, link).filter(([, tint]) => tint === "new-water").length : 0;
      showTip(pointer[0], pointer[1], `${t("tip_canal")} · ${t("cost", { cost: CANAL_COST })}`, [a.preview.ok ? el("p", { class: "good", textContent: t("tip_canal_gain", { n: gain }) }) : el("p", { class: "bad", textContent: t(`reason_${a.preview.reason}`) })]);
      return;
    }
    if (at === null) return hideTip();
    const info = plotInfo(state, at);
    if (!isBuilding(tool)) {
      const refused = tool !== "inspect" && a.preview && !a.preview.ok ? el("p", { class: "bad", textContent: t(`reason_${a.preview.reason}`) }) : null;
      const price = tool === "endow" && info.type && a.preview?.ok ? ` · ${t("cost", { cost: endowCost(info.type) })}` : "";
      showTip(pointer[0], pointer[1], `${plotName(at)} · ${whatIs(info.type)}${price}`, [el("ul", { class: "lines" }, ...info.lines.map(lineNode)), refused]);
      return;
    }
    const reach = overlay(state, tool, at).filter(([, tint]) => tint === "served-house").length;
    const hasReach = tool === "market" || tool === "school" || tool === "bath" || tool === "hospital";
    showTip(pointer[0], pointer[1], `${toolName(tool)} · ${t("cost", { cost: BUILDINGS[tool].cost })}`, [
      a.preview && !a.preview.ok ? el("p", { class: "bad", textContent: t(`reason_${a.preview.reason}`) }) : null,
      BUILDINGS[tool].water > 0 ? el("p", { class: info.served ? "good" : "warn", textContent: t(info.served ? "info_water_yes" : "info_water_no") }) : null,
      hasReach ? el("p", { textContent: t("tip_reach", { n: reach, total: state.plots.filter((b) => b === "house").length }) }) : null,
    ]);
  }

  /** One marker for each plot with a problem. Where they sit is set every frame, from the camera. */
  function renderMarks(): void {
    markNodes = stage ? plotProblems(state).map((pr) => ({ plot: pr.plot, node: el("div", { class: `mark ${pr.kind}` }, icon(pr.kind === "water" ? "nowater" : "noreach", 15)) })) : [];
    marks.replaceChildren(...markNodes.map((m) => m.node));
    placeMarks();
  }
  function placeMarks(): void {
    if (!stage) return;
    for (const m of markNodes) {
      const [x, z] = plotCentre(m.plot);
      const at = stage.screenOf(x, 15, z);
      m.node.hidden = at === null;
      if (at) m.node.style.transform = `translate(${Math.round(at[0])}px, ${Math.round(at[1])}px)`;
    }
  }

  function renderAll(): void {
    renderMarks();
    renderBar();
    renderSide();
    renderTools();
    renderActions();
    renderPlan();
    refreshHighlight();
  }

  // ---- Keys ----------------------------------------------------------------------------------------------------------------
  document.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement | null;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey || !target || target.closest("dialog[open]") || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === "escape") setTool("inspect");
    else if (k === "i") setTool("inspect");
    else if (k === "c") setTool("canal");
    else if (k === "x") setTool("demolish");
    else if (k === "t" && state.mayEndow) setTool("endow");
    else if (k === "u") undo();
    else if (k === "m") togglePlan();
    else if (k === "o") stage?.overview();
    else if (k === "h" || k === "?") showHelp();
    else if (/^[0-9]$/.test(k)) setTool(BUILDING_TYPES[(Number(k) + 9) % 10] ?? "inspect");
    else return;
    e.preventDefault();
  });
  canvas.addEventListener("keydown", (e) => {
    const arrow = ({ ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 } as Record<string, number>)[e.key];
    if (arrow !== undefined) {
      e.preventDefault();
      // The arrows follow the view: "up" is whichever way the camera is facing, to the nearest quarter turn.
      const quarter = Math.round((stage?.getPose().yaw ?? 0) / (Math.PI / 2));
      moveCursor((((arrow + quarter) % 4) + 4) % 4 as Dir, e.shiftKey);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      keyboardCursor = true;
      if (tool !== "canal") act(cursorPlot, null);
      refreshHighlight();
    }
  });
  canvas.addEventListener("blur", () => {
    keyboardCursor = false;
    refreshHighlight();
  });

  renderViewControls();
  renderAll();
  if (state.outcome !== "playing") showOutcome();
  else if (!resumed) showBrief();

  // ---- The 3D district -----------------------------------------------------------------------------------------------------
  const hook: Record<string, unknown> = {
    ready: false,
    lang,
    state: () => state,
    projection: () => proj,
    tool: () => tool,
    setTool,
    dispatch,
    undo,
    restart,
    scenario: () => scenario.id,
    music,
    problems: () => plotProblems(state),
    screenOfPlot: (p: number) => stage?.screenOfPlot(p) ?? null,
    screenOfLink: (a: number, b: number) => {
      const pa = stage?.screenOfPlot(a);
      const pb = stage?.screenOfPlot(b);
      return pa && pb ? [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2] : null;
    },
  };
  if (counters) hook.counters = () => counters.snapshot();
  window.__GA__ = hook;
  bootText.textContent = t("boot_check");
  try {
    if (query.has("no3d")) throw new Error("3D switched off by the address");
    const capability = await probeWebGPU();
    hook.capability = capability;
    if (!capability.supported) throw new Error(capability.failure ?? "no WebGPU");
    stage = await Stage.create(canvas, {
      quality: prefs.quality,
      seed: 7,
      reducedMotion,
      onStatus: (stepName) => (bootText.textContent = t(`boot_${stepName}`)),
      onPoint: (ground, x, y) => {
        pointer = ground ? [x, y] : null;
        keyboardCursor = false;
        hoverPlot = ground ? plotAt(ground[0], ground[1]) : null;
        hoverLink = tool === "canal" && ground ? nearestLink(ground[0], ground[1]) : null;
        refreshHighlight();
      },
      onClick: (ground) => {
        if (!ground) return;
        keyboardCursor = false;
        if (tool === "canal") {
          const link = nearestLink(ground[0], ground[1]);
          if (link) act(null, [link.a, link.b]);
        } else {
          const plot = plotAt(ground[0], ground[1]);
          if (plot !== null) act(plot, null);
        }
        hoverLink = tool === "canal" ? nearestLink(ground[0], ground[1]) : null;
        refreshHighlight();
      },
    });
    stage.sync(state);
    stage.run(() => placeMarks());
    hook.stage = stage;
    renderMarks();
    boot.hidden = true;
  } catch (e) {
    // No 3D here: the plan view is the game.
    hook.no3d = e instanceof Error ? e.message : String(e);
    app.classList.add("no3d");
    canvas.hidden = true;
    viewctl.hidden = true;
    bootText.textContent = t("no_3d");
    boot.classList.add("note");
    togglePlan(true);
  }
  hook.ready = true;
}

main().catch((e) => {
  const boot = document.getElementById("boot-text");
  if (boot) boot.textContent = e instanceof Error ? e.message : String(e);
  window.__GA__ = { ready: false, error: e instanceof Error ? e.message : String(e) };
  console.error(e);
});
