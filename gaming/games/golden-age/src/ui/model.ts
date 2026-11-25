// What the screen says about a state: the figures in the top bar, what ending the season now would do, how far the
// goal is, what is going wrong and why. Pure functions over the rules, so the wording of the interface can be
// tested without a browser. Nothing here changes a state.
import {
  BATH_REACH,
  BUILDINGS,
  COLLAPSE_SEASONS,
  GOODS_REACH,
  HOSPITAL_REACH,
  HOUSE_CAPACITY,
  HOUSE_CAPACITY_SERVED,
  MARKET_CAPACITY,
  MARKET_REACH,
  PLOTS,
  RESEARCH,
  RESEARCH_IDS,
  SCHOOL_REACH,
  activeEvents,
  distance,
  has,
  housingCapacity,
  learned,
  preview,
  seasonOfYear,
  servedByWater,
  step,
  wateredPlots,
  xyOf,
  type BuildingType,
  type Command,
  type EventKind,
  type Preview,
  type ResearchId,
  type Scenario,
  type SeasonReport,
  type State,
  type WelfareParts,
} from "../rules";

export type Vars = Record<string, string | number>;
export interface Line {
  /** A key of the string table. */
  id: string;
  vars?: Vars;
  tone?: "good" | "warn" | "bad";
}

// ---- What ending the season now would do -----------------------------------------------------------------------------
// The rules are pure, so the season can be run on a copy. Everything in the result is exact except which event (if
// any) is next put on the horizon, which the interface never shows from this copy.

export interface Projection {
  next: State;
  report: SeasonReport;
}
export function project(scenario: Scenario, s: State): Projection | null {
  if (s.outcome !== "playing") return null;
  const next = step(scenario, s, { type: "end-season" });
  return { next, report: next.last! };
}

export type StockId = "treasury" | "grain" | "households" | "welfare" | "knowledge" | "water";
export interface Stock {
  id: StockId;
  value: number;
  /** Change at the end of this season if nothing else is done (null once the game is over). */
  delta: number | null;
  /** The figure the value is measured against: housing for households, the goal for welfare and knowledge, need for water. */
  of?: number;
  tone: "ok" | "warn" | "bad";
}

export function stocks(scenario: Scenario, s: State, p: Projection | null): Stock[] {
  // Once the game is over there is no season to come: the water figures are the last season's.
  const r = p?.report ?? s.last;
  const d = (key: "treasury" | "grain" | "households" | "welfare") => (p ? p.next[key] - s[key] : null);
  const housing = housingCapacity(s);
  return [
    { id: "treasury", value: s.treasury, delta: d("treasury"), tone: s.treasury < 0 || (p !== null && p.next.treasury < 0) ? "bad" : (d("treasury") ?? 0) < 0 ? "warn" : "ok" },
    { id: "grain", value: s.grain, delta: d("grain"), tone: r && r.hungerPermille > 0 ? "bad" : (d("grain") ?? 0) < 0 && s.grain + (d("grain") ?? 0) < s.households ? "warn" : "ok" },
    { id: "households", value: s.households, delta: d("households"), of: housing, tone: (d("households") ?? 0) < 0 ? "bad" : s.households >= housing ? "warn" : "ok" },
    { id: "welfare", value: s.welfare, delta: d("welfare"), of: scenario.goal.welfare, tone: s.welfare < 35 ? "bad" : s.welfare < 55 ? "warn" : "ok" },
    { id: "knowledge", value: learned(s), delta: p ? p.report.knowledgeGained : null, of: scenario.goal.knowledge, tone: "ok" },
    { id: "water", value: r ? r.waterSupply : 0, delta: null, of: r ? r.waterNeed : 0, tone: !r ? "ok" : r.waterShare[0] < 1000 ? "bad" : r.waterShare[1] < 1000 || r.waterShare[2] < 1000 ? "warn" : "ok" },
  ];
}

// ---- The goal ----------------------------------------------------------------------------------------------------------

export interface GoalRow {
  id: "households" | "knowledge" | "welfare" | "treasury";
  value: number;
  goal: number;
  met: boolean;
}
export function goals(scenario: Scenario, s: State): { rows: GoalRow[]; seasonsLeft: number; steady: number; steadyGoal: number } {
  const g = scenario.goal;
  return {
    rows: [
      { id: "households", value: s.households, goal: g.households, met: s.households >= g.households },
      { id: "knowledge", value: learned(s), goal: g.knowledge, met: learned(s) >= g.knowledge },
      { id: "welfare", value: s.welfare, goal: g.welfare, met: s.steadySeasons >= g.steadySeasons },
      { id: "treasury", value: s.treasury, goal: 0, met: s.treasury >= 0 },
    ],
    seasonsLeft: Math.max(0, scenario.seasons - s.season),
    steady: Math.min(s.steadySeasons, g.steadySeasons),
    steadyGoal: g.steadySeasons,
  };
}

/** Year (from 1) and season of the year for a count of seasons played. */
export const calendar = (season: number): { year: number; soy: 0 | 1 | 2 | 3 } => ({ year: Math.floor(season / 4) + 1, soy: seasonOfYear(season) });
/** The season the screen is showing: the one being played, or the last one played once the game is over. */
export const showing = (s: State): number => (s.outcome === "playing" ? s.season : Math.max(0, s.season - 1));

// ---- Advice: the one thing most worth saying now ------------------------------------------------------------------------

export function advice(scenario: Scenario, s: State, p: Projection | null): Line | null {
  if (!p) return null;
  const r = p.report;
  const count = (t: BuildingType) => s.plots.filter((b) => b === t).length;
  const wet = wateredPlots(s);
  const houses: number[] = [];
  for (let i = 0; i < PLOTS; i++) if (s.plots[i] === "house") houses.push(i);
  const dryHouses = houses.filter((h) => !servedByWater(wet, h)).length;
  if (s.insolventSeasons > 0) return { id: "advice_debt", vars: { n: s.insolventSeasons, max: COLLAPSE_SEASONS }, tone: "bad" };
  if (s.unrestSeasons > 0) return { id: "advice_unrest", vars: { n: s.unrestSeasons, max: COLLAPSE_SEASONS }, tone: "bad" };
  if (p.next.treasury < 0) return { id: "advice_debt_coming", tone: "bad" };
  if (r.hungerPermille > 0) return { id: "advice_hunger", vars: { percent: Math.round(r.hungerPermille / 10) }, tone: "bad" };
  if (r.waterShare[0] < 1000) return { id: "advice_thirst", tone: "bad" };
  // The first thing to try is a canal link; the silt it inherits comes next.
  if (s.season === 0 && s.canals.length <= scenario.start.canals.length && dryHouses > 0) return { id: "advice_first_canal", vars: { n: dryHouses } };
  if (s.canalCondition < 700) return { id: "advice_silt", vars: { percent: Math.round(s.canalCondition / 10) }, tone: "warn" };
  if (r.waterShare[1] < 1000) return { id: "advice_farm_water", vars: { percent: Math.round(r.waterShare[1] / 10) }, tone: "warn" };
  if (dryHouses > 0) return { id: "advice_dry_houses", vars: { n: dryHouses }, tone: "warn" };
  if (count("market") === 0) return { id: "advice_market" };
  if (s.households >= housingCapacity(s, wet)) return { id: "advice_housing", tone: "warn" };
  if (r.staffingPermille < 900) return { id: "advice_labour", vars: { percent: Math.round(r.staffingPermille / 10) }, tone: "warn" };
  if (count("school") === 0) return { id: "advice_school" };
  if (s.research === null && s.researched.length < RESEARCH_IDS.length && s.knowledge > 0) return { id: "advice_research" };
  if (s.welfare < scenario.goal.welfare && r.welfareTarget < scenario.goal.welfare) return { id: "advice_welfare", vars: { target: r.welfareTarget, goal: scenario.goal.welfare }, tone: "warn" };
  if (r.welfareParts.idle < 0) return { id: "advice_idle", tone: "warn" };
  if (count("workshop") === 0 && count("market") > 0) return { id: "advice_workshop" };
  return { id: "advice_steady", tone: "good" };
}

// ---- The ledger: what a season did, cause by cause ----------------------------------------------------------------------

export interface LedgerGroup {
  id: "water" | "food" | "money" | "people" | "learning";
  lines: Line[];
}

const WELFARE_ORDER: Array<keyof WelfareParts> = ["base", "food", "water", "baths", "school", "hospital", "market", "tax", "crowding", "idle", "fever", "unpaid"];

export function ledger(r: SeasonReport): LedgerGroup[] {
  const pct = (permille: number) => Math.round(permille / 10);
  const tone = (permille: number): Line["tone"] => (permille >= 1000 ? "good" : permille >= 700 ? "warn" : "bad");
  const welfare: Line[] = [];
  for (const k of WELFARE_ORDER) {
    const v = r.welfareParts[k];
    if (v !== 0) welfare.push({ id: `welfare_${k}`, vars: { n: v > 0 ? `+${v}` : `${v}` }, tone: v < 0 ? "bad" : undefined });
  }
  return [
    {
      id: "water",
      lines: [
        { id: "ledger_water", vars: { supply: r.waterSupply, need: r.waterNeed }, tone: r.waterSupply >= r.waterNeed ? "good" : "warn" },
        { id: "ledger_water_drink", vars: { percent: pct(r.waterShare[0]) }, tone: tone(r.waterShare[0]) },
        { id: "ledger_water_farms", vars: { percent: pct(r.waterShare[1]) }, tone: tone(r.waterShare[1]) },
        { id: "ledger_water_crafts", vars: { percent: pct(r.waterShare[2]) }, tone: tone(r.waterShare[2]) },
      ],
    },
    {
      id: "food",
      lines: [
        { id: "ledger_harvest", vars: { n: r.harvest } },
        { id: "ledger_eaten", vars: { n: r.eaten } },
        ...(r.hungerPermille > 0 ? [{ id: "ledger_hunger", vars: { percent: pct(r.hungerPermille) }, tone: "bad" as const }] : []),
        ...(r.sold > 0 ? [{ id: "ledger_sold", vars: { n: r.sold, coins: r.income.sales } }] : []),
        ...(r.spoiled > 0 ? [{ id: "ledger_spoiled", vars: { n: r.spoiled }, tone: "warn" as const }] : []),
      ],
    },
    {
      id: "money",
      lines: [
        { id: "ledger_tax", vars: { n: r.income.tax } },
        { id: "ledger_trade", vars: { n: r.income.trade } },
        { id: "ledger_upkeep", vars: { n: r.upkeep } },
        { id: "ledger_net", vars: { n: signed(r.income.tax + r.income.trade + r.income.sales - r.upkeep) }, tone: r.income.tax + r.income.trade + r.income.sales - r.upkeep < 0 ? "bad" : "good" },
      ],
    },
    {
      id: "people",
      lines: [
        { id: "ledger_staffing", vars: { percent: pct(r.staffingPermille), jobs: r.jobs }, tone: tone(r.staffingPermille) },
        { id: "ledger_housing", vars: { households: r.households, housing: r.housing }, tone: r.households >= r.housing ? "warn" : undefined },
        { id: "ledger_welfare_target", vars: { n: r.welfareTarget } },
        ...welfare,
      ],
    },
    { id: "learning", lines: [{ id: "ledger_knowledge", vars: { n: r.knowledgeGained } }, ...(r.completedResearch ? [{ id: "ledger_research_done", vars: { research: r.completedResearch }, tone: "good" as const }] : [])] },
  ];
}

export const signed = (n: number): string => (n > 0 ? `+${n}` : `${n}`);

// ---- Events -------------------------------------------------------------------------------------------------------------

export interface EventView {
  kind: EventKind;
  /** Seasons until it starts: 0 means it is happening now. */
  inSeasons: number;
  /** Seasons it still has to run once started. */
  seasonsLeft: number;
}
export function eventsInView(s: State): EventView[] {
  return s.events
    .filter((e) => s.season < e.season + e.seasons)
    .map((e) => ({ kind: e.kind, inSeasons: Math.max(0, e.season - s.season), seasonsLeft: e.season + e.seasons - Math.max(s.season, e.season) }))
    .sort((a, b) => a.inSeasons - b.inSeasons);
}
export const happeningNow = (s: State): EventKind[] => activeEvents(s);

// ---- One plot, in words ------------------------------------------------------------------------------------------------

export interface PlotInfo {
  plot: number;
  type: BuildingType | null;
  /** A canal runs through the crossing. */
  canal: boolean;
  /** Water is within reach. */
  served: boolean;
  lines: Line[];
}

const of = (s: State, t: BuildingType): number[] => {
  const out: number[] = [];
  for (let p = 0; p < PLOTS; p++) if (s.plots[p] === t) out.push(p);
  return out;
};
const reachOf: Partial<Record<BuildingType, number>> = { market: MARKET_REACH, school: SCHOOL_REACH, bath: BATH_REACH, hospital: HOSPITAL_REACH };

export function plotInfo(s: State, plot: number): PlotInfo {
  const wet = wateredPlots(s);
  const served = servedByWater(wet, plot);
  const type = s.plots[plot] ?? null;
  const houses = of(s, "house");
  const lines: Line[] = [];
  const near = (t: BuildingType, reach: number, needsWater = false) => of(s, t).some((b) => distance(plot, b) <= reach && (!needsWater || servedByWater(wet, b)));
  const reached = (reach: number) => houses.filter((h) => distance(plot, h) <= reach).length;
  lines.push(served ? { id: "info_water_yes", tone: "good" } : { id: "info_water_no", tone: type === null || type === "market" || type === "school" || type === "granary" || type === "library" ? undefined : "warn" });
  switch (type) {
    case null:
      break;
    case "house": {
      const bathed = served && near("bath", BATH_REACH, true);
      lines.push({ id: "info_house_capacity", vars: { n: bathed ? HOUSE_CAPACITY_SERVED : HOUSE_CAPACITY } });
      if (!bathed) lines.push({ id: "info_house_more", vars: { n: HOUSE_CAPACITY_SERVED } });
      lines.push(near("market", MARKET_REACH) ? { id: "info_near_market", tone: "good" } : { id: "info_far_market" });
      lines.push(near("school", SCHOOL_REACH) ? { id: "info_near_school", tone: "good" } : { id: "info_far_school" });
      if (of(s, "hospital").length > 0) lines.push(near("hospital", HOSPITAL_REACH) ? { id: "info_near_hospital", tone: "good" } : { id: "info_far_hospital" });
      break;
    }
    case "farm":
      lines.push(served ? { id: "info_farm_watered", tone: "good" } : { id: "info_farm_dry", tone: "warn" });
      break;
    case "market": {
      const supplied = of(s, "workshop").some((w) => distance(plot, w) <= GOODS_REACH && servedByWater(wet, w));
      lines.push({ id: "info_market_reach", vars: { n: reached(MARKET_REACH), total: houses.length, capacity: MARKET_CAPACITY } });
      lines.push(supplied ? { id: "info_market_goods", tone: "good" } : { id: "info_market_no_goods" });
      break;
    }
    case "workshop":
      if (!served) lines.push({ id: "mark_workshop_dry", tone: "bad" });
      lines.push({ id: "info_workshop_markets", vars: { n: of(s, "market").filter((m) => distance(plot, m) <= GOODS_REACH).length } });
      break;
    case "school":
      lines.push({ id: "info_school_reach", vars: { n: reached(SCHOOL_REACH), total: houses.length } });
      break;
    case "bath":
      if (!served) lines.push({ id: "mark_bath_dry", tone: "bad" });
      lines.push({ id: "info_bath_reach", vars: { n: served ? reached(BATH_REACH) : 0, total: houses.length } });
      break;
    case "granary":
      lines.push({ id: "info_granary" });
      break;
    case "library":
      lines.push({ id: "info_library" });
      break;
    case "hospital":
      lines.push({ id: "info_hospital_reach", vars: { n: reached(HOSPITAL_REACH), total: houses.length } });
      break;
  }
  // A building that serves houses and has none within its reach is doing nothing.
  const reach = type ? reachOf[type] : undefined;
  if (reach !== undefined && reached(reach) === 0) lines.push({ id: "mark_no_houses", tone: "bad" });
  if (type) lines.push({ id: "info_running", vars: { workers: BUILDINGS[type].workers, upkeep: BUILDINGS[type].upkeep, water: BUILDINGS[type].water } });
  return { plot, type, canal: wet[plot]!, served, lines };
}

// ---- What is going wrong, plot by plot: shown as a marker over the district and as a list in the panel --------------------

export interface PlotProblem {
  plot: number;
  /** "water": a building that needs water has none in reach. "reach": a service with no houses to serve. */
  kind: "water" | "reach";
  line: Line;
}
export function plotProblems(s: State): PlotProblem[] {
  const out: PlotProblem[] = [];
  for (let p = 0; p < PLOTS; p++) {
    const type = s.plots[p];
    if (!type) continue;
    const info = plotInfo(s, p);
    // The hospital draws water but works without it, so a dry hospital is not marked.
    if (!info.served && BUILDINGS[type].water > 0 && type !== "hospital") {
      out.push({ plot: p, kind: "water", line: { id: type === "farm" ? "info_farm_dry" : type === "bath" ? "mark_bath_dry" : type === "workshop" ? "mark_workshop_dry" : "info_water_no" } });
      continue;
    }
    const idle = info.lines.find((l) => l.id === "mark_no_houses");
    if (idle) out.push({ plot: p, kind: "reach", line: idle });
  }
  return out;
}

// ---- The planning overlay: which plots to tint for a tool ----------------------------------------------------------------

export type Tool = "inspect" | "canal" | "demolish" | BuildingType;
export type Tint = "water" | "reach" | "served-house" | "unserved-house" | "new-water";

/**
 * Plots to tint while a tool is in hand, and why. With a plot under the pointer, a building with a reach shows the
 * houses it would serve from there; the canal tool shows where water reaches now, and what a link would add.
 */
export function overlay(s: State, tool: Tool, hover: number | null, link: [number, number] | null = null): Array<[number, Tint]> {
  if (tool === "inspect" || tool === "demolish") return [];
  const wet = wateredPlots(s);
  const tinted = new Map<number, Tint>();
  if (tool === "canal") {
    const after = link && preview(s, { type: "canal", a: link[0], b: link[1] }).ok ? wateredPlots(step0(s, link)) : null;
    for (let p = 0; p < PLOTS; p++) {
      if (servedByWater(wet, p)) tinted.set(p, "water");
      else if (after && servedByWater(after, p)) tinted.set(p, "new-water");
    }
    return [...tinted.entries()];
  }
  const reach = reachOf[tool];
  if (reach !== undefined) {
    if (hover !== null) for (let p = 0; p < PLOTS; p++) if (distance(hover, p) <= reach) tinted.set(p, s.plots[p] === "house" ? "served-house" : "reach");
    for (let p = 0; p < PLOTS; p++) if (s.plots[p] === "house" && !tinted.has(p)) tinted.set(p, "unserved-house");
    return [...tinted.entries()];
  }
  // A building that draws water: show where water reaches.
  if (BUILDINGS[tool].water > 0) for (let p = 0; p < PLOTS; p++) if (servedByWater(wet, p)) tinted.set(p, "water");
  return [...tinted.entries()];
}
/** A state with one more canal link, without charging for it: only used to ask where water would reach. */
const step0 = (s: State, link: [number, number]): State => ({ ...s, canals: [...s.canals, Math.min(link[0], link[1]) * PLOTS + Math.max(link[0], link[1])] });

// ---- What a tool would do at a place --------------------------------------------------------------------------------------

export interface Aim {
  command: Command | null;
  preview: Preview | null;
  /** For a canal: the source plot first, so the water can be shown arriving from the right end. */
  dug: [number, number] | null;
}

/** The command a tool means at a plot (or, for the canal, at a link), and whether the rules allow it. */
export function aim(s: State, tool: Tool, plot: number | null, link: [number, number] | null): Aim {
  if (tool === "inspect") return { command: null, preview: null, dug: null };
  if (tool === "canal") {
    if (!link) return { command: null, preview: null, dug: null };
    const command: Command = { type: "canal", a: link[0], b: link[1] };
    const wet = wateredPlots(s);
    const touches = (p: number) => wet[p] || xyOf(p)[1] === 0;
    // Water comes from whichever end is already on the network; of two bank plots, the one that already has a canal.
    const aFirst = wet[link[0]] || (!wet[link[1]] && touches(link[0]));
    return { command, preview: preview(s, command), dug: aFirst ? [link[0], link[1]] : [link[1], link[0]] };
  }
  if (plot === null) return { command: null, preview: null, dug: null };
  const command: Command = tool === "demolish" ? { type: "demolish", plot } : { type: "build", building: tool, plot };
  return { command, preview: preview(s, command), dug: null };
}

/** Research in the order it is offered, with what each needs and whether it can be chosen. */
export function researchList(s: State): Array<{ id: ResearchId; cost: number; needs: ResearchId | null; state: "done" | "current" | "open" | "locked"; progress: number }> {
  return RESEARCH_IDS.map((id) => {
    const spec = RESEARCH[id];
    const state = has(s, id) ? "done" : s.research === id ? "current" : spec.needs && !has(s, spec.needs) ? "locked" : "open";
    return { id, cost: spec.cost, needs: spec.needs ?? null, state, progress: s.research === id ? s.researchProgress : state === "done" ? spec.cost : 0 };
  });
}

