// The Golden Age rules: a district on a river, played one season at a time.
// Pure functions over plain integer data. No rendering, no clock, no floating-point money: every stock is a whole
// number and every ratio is in thousandths, so a season computes the same on every machine and a replay is exact.
//
// The city is fictional. Costs, yields and prices are game numbers, not historical figures, and are labelled as
// such wherever a player sees them.
import { Rng, type RngState } from "@im/kernel/prng";

export const RULES_VERSION = 1;

// ---- The district ---------------------------------------------------------------------------------------------------
// A grid of plots. Row 0 lies on the river bank. A canal link joins two neighbouring plots; water reaches a plot
// that is joined to the river bank through canal links. One building per plot.

export const GRID_W = 8;
export const GRID_H = 6;
export const PLOTS = GRID_W * GRID_H;
export const plotOf = (x: number, y: number): number => y * GRID_W + x;
export const xyOf = (plot: number): [number, number] => [plot % GRID_W, Math.floor(plot / GRID_W)];
export const distance = (a: number, b: number): number => {
  const [ax, ay] = xyOf(a);
  const [bx, by] = xyOf(b);
  return Math.abs(ax - bx) + Math.abs(ay - by);
};
export const adjacent = (a: number, b: number): boolean => distance(a, b) === 1;
/** A canal link's key: the two plots, smaller first. */
export const linkKey = (a: number, b: number): number => (a < b ? a * PLOTS + b : b * PLOTS + a);

export type BuildingType = "house" | "farm" | "market" | "workshop" | "school" | "bath" | "granary" | "library" | "hospital" | "caravanserai" | "mill";
export const BUILDING_TYPES: BuildingType[] = ["house", "farm", "market", "workshop", "school", "bath", "granary", "library", "hospital", "caravanserai", "mill"];

export interface BuildingSpec {
  cost: number;
  upkeep: number;
  /** Households' worth of labour the building needs to run at full strength. */
  workers: number;
  /** Water it draws each season when watered. */
  water: number;
  /** Research that must be complete before it can be built. */
  needs?: ResearchId;
}
export const BUILDINGS: Record<BuildingType, BuildingSpec> = {
  house: { cost: 25, upkeep: 0, workers: 0, water: 2 },
  farm: { cost: 20, upkeep: 1, workers: 8, water: 6 },
  market: { cost: 40, upkeep: 2, workers: 6, water: 0 },
  workshop: { cost: 45, upkeep: 2, workers: 10, water: 2 },
  school: { cost: 60, upkeep: 4, workers: 5, water: 0 },
  bath: { cost: 35, upkeep: 2, workers: 3, water: 4 },
  granary: { cost: 30, upkeep: 1, workers: 2, water: 0 },
  library: { cost: 90, upkeep: 6, workers: 6, water: 0, needs: "paper" },
  hospital: { cost: 80, upkeep: 5, workers: 8, water: 2, needs: "medicine" },
  // A caravanserai lodges traders and their animals: a district with a market draws more trade, and a caravan more.
  caravanserai: { cost: 70, upkeep: 3, workers: 6, water: 2 },
  // A watermill on the canal grinds the grain: stored grain spoils less, and what is sold fetches more as flour.
  mill: { cost: 50, upkeep: 2, workers: 4, water: 3 },
};
/** Grain a watered, fully staffed farm brings in at a full harvest (spring and autumn); summer and winter bring far less. */
export const FARM_YIELD = 60;
export const FARM_YIELD_ROTATION = 78;
/** Thousandths of a full harvest by season: spring, summer, autumn, winter. A year is two and a half full harvests. */
export const HARVEST_BY_SEASON = [1000, 350, 1000, 150] as const;
export const CANAL_COST = 12;
export const CANAL_UPKEEP = 1;
export const HOUSE_CAPACITY = 20;
/** A house with water and a bath within reach holds more households. */
export const HOUSE_CAPACITY_SERVED = 32;
export const MARKET_REACH = 3;
/** Households one market can serve in a season. More people need more markets, each with its cost and its staff. */
export const MARKET_CAPACITY = 60;
export const SCHOOL_REACH = 3;
export const BATH_REACH = 2;
export const HOSPITAL_REACH = 4;
export const GOODS_REACH = 4;

export type ResearchId = "lined-canals" | "water-wheel" | "paper" | "medicine" | "crop-rotation";
export interface ResearchSpec {
  cost: number;
  needs?: ResearchId;
}
/** Each project costs knowledge. Two lead to water, two to learning and health, one to food: alternative investments. */
export const RESEARCH: Record<ResearchId, ResearchSpec> = {
  "lined-canals": { cost: 40 },
  "crop-rotation": { cost: 50 },
  paper: { cost: 70 },
  "water-wheel": { cost: 90, needs: "lined-canals" },
  medicine: { cost: 110, needs: "paper" },
};
export const RESEARCH_IDS = Object.keys(RESEARCH) as ResearchId[];

export type TaxLevel = 0 | 1 | 2;
/** Coins a season per ten households, by tax level. */
export const TAX_PER_TEN = [1, 2, 3] as const;
/** Welfare points a tax level costs. */
export const TAX_WELFARE = [0, 4, 11] as const;

export type EventKind = "drought" | "good-harvest" | "caravan" | "silting" | "fever";
export interface Forecast {
  kind: EventKind;
  /** The season it starts. It is always announced one full season ahead. */
  season: number;
  /** How many seasons it lasts. */
  seasons: number;
}

export interface Scenario {
  id: string;
  seasons: number;
  start: {
    treasury: number;
    grain: number;
    households: number;
    buildings: Array<[number, BuildingType]>;
    canals: Array<[number, number]>;
    intake: number;
    /** Research the district already has. Its cost counts as learning already done. */
    researched?: ResearchId[];
    /** Thousandths of full flow the canals start at; 600 (silted) when not given. */
    canalCondition?: number;
  };
  goal: { households: number; welfare: number; knowledge: number; steadySeasons: number; /** Public buildings that must be endowed by the end. */ endowments?: number };
  /** Thousandths: chance each season that a new event is put on the horizon. */
  eventRate: number;
  /** This scenario's own chances of each kind of event; EVENT_WEIGHTS when not given. */
  eventWeights?: [number, number, number, number, number];
  /** The steward may endow public buildings in this scenario. */
  endowments?: boolean;
}

export interface State {
  rules: number;
  scenario: string;
  seed: number;
  rng: RngState;
  /** Seasons completed. Season 0 is the first spring. */
  season: number;
  treasury: number;
  grain: number;
  households: number;
  /** 0 to 100. */
  welfare: number;
  knowledge: number;
  /** Knowledge already spent on the project in hand. */
  researchProgress: number;
  research: ResearchId | null;
  researched: ResearchId[];
  tax: TaxLevel;
  /** Building on each plot, or null. */
  plots: Array<BuildingType | null>;
  /** Canal links, by linkKey, in the order built. */
  canals: number[];
  /** Plots whose building has been endowed, in the order endowed. */
  endowed: number[];
  /** Endowing is open in this game (copied from the scenario, so a command can be judged from the state alone). */
  mayEndow: boolean;
  /** Thousandths of full capacity the canals run at (silt lowers it). */
  canalCondition: number;
  /** Units of water the intake can take from the river each season. */
  intake: number;
  events: Forecast[];
  /** What is still owed on the merchants' loan, and what is repaid of it each season; both 0 when there is none. */
  loanOwed: number;
  loanEach: number;
  /** Seasons in a row the treasury has ended below zero, and welfare below the collapse line. */
  insolventSeasons: number;
  unrestSeasons: number;
  /** Seasons in a row the end-of-season welfare has met the goal. */
  steadySeasons: number;
  outcome: "playing" | "won" | "lost-insolvent" | "lost-unrest" | "ended";
  /** What happened last season, for the ledger the player reads. */
  last: SeasonReport | null;
}

export interface SeasonReport {
  season: number;
  waterNeed: number;
  waterSupply: number;
  /** Thousandths of their need that each tier received: drinking, farms, crafts and baths. */
  waterShare: [number, number, number];
  harvest: number;
  eaten: number;
  hungerPermille: number;
  spoiled: number;
  sold: number;
  income: { tax: number; trade: number; sales: number };
  upkeep: number;
  /** Repaid on the merchants' loan this season. */
  repaid: number;
  knowledgeGained: number;
  welfareTarget: number;
  staffingPermille: number;
  households: number;
  events: EventKind[];
  completedResearch: ResearchId | null;
  /** Why welfare is heading where it is: the points each cause adds or takes. They sum to welfareTarget before it is clamped to 0..100. */
  welfareParts: WelfareParts;
  /** Thousandths of houses within reach of each service. */
  cover: { water: number; bath: number; school: number; hospital: number; market: number };
  /** Households the district's houses can hold, and the work its buildings offer. */
  housing: number;
  jobs: number;
}

export interface WelfareParts {
  base: number;
  food: number;
  water: number;
  baths: number;
  school: number;
  hospital: number;
  market: number;
  tax: number;
  crowding: number;
  idle: number;
  fever: number;
  unpaid: number;
}

export type Command =
  | { type: "build"; building: BuildingType; plot: number }
  | { type: "canal"; a: number; b: number }
  | { type: "demolish"; plot: number }
  | { type: "tax"; level: TaxLevel }
  | { type: "research"; id: ResearchId | null }
  | { type: "clear-silt" }
  | { type: "endow"; plot: number }
  | { type: "borrow" }
  | { type: "end-season" };

export const SILT_CLEAR_COST = 20;

// ---- The merchants' loan --------------------------------------------------------------------------------------------
// A way back for a city in trouble: the merchants lend a sum once, without interest, and it is repaid in equal parts
// at the end of each season until it is cleared. It is the game's form of the qard hasan, the interest-free loan; a
// second cannot be taken while the first is owed. The sums are game numbers.
export const LOAN_SUM = 120;
export const LOAN_SEASONS = 10;

// ---- Endowments ------------------------------------------------------------------------------------------------------
// From the third chapter the steward may endow a public building: a sum is set aside for ever, its yield pays the
// building's upkeep from then on, and the building can no longer be cleared. It is the game's form of the waqf:
// the principal is kept and the yield is given. The sum is a game number.
export const ENDOWABLE: BuildingType[] = ["school", "bath", "library", "hospital"];
/** An endowment costs this many seasons of the building's upkeep: five years of it. */
export const ENDOW_SEASONS = 20;
export const endowCost = (t: BuildingType): number => BUILDINGS[t].upkeep * ENDOW_SEASONS;
/** Relative chances of each kind of event, in the order drought, good harvest, caravan, silting, fever. */
export const EVENT_WEIGHTS: [number, number, number, number, number] = [26, 20, 22, 16, 16];
/** Seasons of insolvency or unrest in a row that end the scenario. A warning is due from the first. */
export const COLLAPSE_SEASONS = 3;
export const UNREST_WELFARE = 25;

// ---- Reading the state --------------------------------------------------------------------------------------------

export const has = (s: State, id: ResearchId): boolean => s.researched.includes(id);
export const seasonOfYear = (season: number): 0 | 1 | 2 | 3 => (season % 4) as 0 | 1 | 2 | 3;
export const SEASON_NAMES = ["spring", "summer", "autumn", "winter"] as const;
const HARVEST = HARVEST_BY_SEASON;
/** Thousandths of normal demand for water, by season. */
const THIRST = [1000, 1400, 1000, 700] as const;

export function activeEvents(s: State, season = s.season): EventKind[] {
  return s.events.filter((e) => season >= e.season && season < e.season + e.seasons).map((e) => e.kind);
}

/** Plots that water reaches: joined to a river-bank plot through canal links. */
export function wateredPlots(s: State): boolean[] {
  const next: number[][] = Array.from({ length: PLOTS }, () => []);
  for (const k of s.canals) {
    const a = Math.floor(k / PLOTS);
    const b = k % PLOTS;
    next[a]!.push(b);
    next[b]!.push(a);
  }
  const wet = new Array<boolean>(PLOTS).fill(false);
  const queue: number[] = [];
  for (let x = 0; x < GRID_W; x++) {
    const p = plotOf(x, 0);
    if (next[p]!.length > 0) {
      wet[p] = true;
      queue.push(p);
    }
  }
  while (queue.length) {
    const p = queue.pop()!;
    for (const q of next[p]!) {
      if (!wet[q]) {
        wet[q] = true;
        queue.push(q);
      }
    }
  }
  return wet;
}

/** A plot is served with water if a canal reaches it or one of its four neighbours. */
export function servedByWater(wet: boolean[], plot: number): boolean {
  if (wet[plot]) return true;
  const [x, y] = xyOf(plot);
  return (x > 0 && wet[plot - 1]!) || (x < GRID_W - 1 && wet[plot + 1]!) || (y > 0 && wet[plot - GRID_W]!) || (y < GRID_H - 1 && wet[plot + GRID_W]!);
}

const plotsOf = (s: State, type: BuildingType): number[] => {
  const out: number[] = [];
  for (let p = 0; p < PLOTS; p++) if (s.plots[p] === type) out.push(p);
  return out;
};
const within = (from: number, targets: number[], reach: number): boolean => targets.some((t) => distance(from, t) <= reach);

/** Households' worth of work the district's buildings offer. Households beyond this are idle, which costs welfare. */
export function jobs(s: State): number {
  let n = 0;
  for (const b of s.plots) if (b) n += BUILDINGS[b].workers;
  return n;
}

export function housingCapacity(s: State, wet = wateredPlots(s)): number {
  const baths = plotsOf(s, "bath").filter((b) => servedByWater(wet, b));
  let cap = 0;
  for (const h of plotsOf(s, "house")) cap += servedByWater(wet, h) && within(h, baths, BATH_REACH) ? HOUSE_CAPACITY_SERVED : HOUSE_CAPACITY;
  return cap;
}

export function intakeCapacity(s: State, season = s.season): number {
  let c = s.intake;
  if (has(s, "water-wheel")) c = Math.floor((c * 1500) / 1000);
  if (activeEvents(s, season).includes("drought")) c = Math.floor((c * 600) / 1000);
  let condition = s.canalCondition;
  if (has(s, "lined-canals")) condition = Math.min(1000, condition + 250);
  return Math.floor((c * condition) / 1000);
}

// ---- What a command would do ---------------------------------------------------------------------------------------

export interface Preview {
  ok: boolean;
  /** Why not, as a stable code the interface translates. */
  reason?: "over" | "occupied" | "empty" | "not-researched" | "no-funds" | "not-adjacent" | "exists" | "not-connected" | "off-map" | "already-researched" | "needs-research" | "no-silt" | "same" | "not-here" | "not-endowable" | "already-endowed" | "endowed" | "loan-open";
  cost: number;
}
const no = (reason: NonNullable<Preview["reason"]>, cost = 0): Preview => ({ ok: false, reason, cost });
const onMap = (p: number) => Number.isInteger(p) && p >= 0 && p < PLOTS;

export function preview(s: State, cmd: Command): Preview {
  if (s.outcome !== "playing") return no("over");
  switch (cmd.type) {
    case "build": {
      const spec = BUILDINGS[cmd.building];
      if (!spec || !onMap(cmd.plot)) return no("off-map");
      if (s.plots[cmd.plot] !== null) return no("occupied", spec.cost);
      if (spec.needs && !has(s, spec.needs)) return no("not-researched", spec.cost);
      if (s.treasury < spec.cost) return no("no-funds", spec.cost);
      return { ok: true, cost: spec.cost };
    }
    case "canal": {
      if (!onMap(cmd.a) || !onMap(cmd.b)) return no("off-map");
      if (!adjacent(cmd.a, cmd.b)) return no("not-adjacent", CANAL_COST);
      if (s.canals.includes(linkKey(cmd.a, cmd.b))) return no("exists", CANAL_COST);
      // A new link must start at the river bank or touch the existing network: no canal begins in a dry field.
      const wet = wateredPlots(s);
      const touches = (p: number) => wet[p] || xyOf(p)[1] === 0;
      if (!touches(cmd.a) && !touches(cmd.b)) return no("not-connected", CANAL_COST);
      if (s.treasury < CANAL_COST) return no("no-funds", CANAL_COST);
      return { ok: true, cost: CANAL_COST };
    }
    case "demolish":
      if (!onMap(cmd.plot)) return no("off-map");
      if (s.plots[cmd.plot] === null) return no("empty");
      // What has been endowed is no longer the steward's to clear.
      return s.endowed.includes(cmd.plot) ? no("endowed") : { ok: true, cost: 0 };
    case "endow": {
      if (!s.mayEndow) return no("not-here");
      if (!onMap(cmd.plot)) return no("off-map");
      const type = s.plots[cmd.plot];
      if (!type) return no("empty");
      if (!ENDOWABLE.includes(type)) return no("not-endowable");
      const cost = endowCost(type);
      if (s.endowed.includes(cmd.plot)) return no("already-endowed", cost);
      return s.treasury < cost ? no("no-funds", cost) : { ok: true, cost };
    }
    case "tax":
      return cmd.level === s.tax ? no("same") : { ok: [0, 1, 2].includes(cmd.level), cost: 0 };
    case "research": {
      if (cmd.id === null) return { ok: s.research !== null, cost: 0, ...(s.research === null ? { reason: "same" as const } : {}) };
      const spec = RESEARCH[cmd.id];
      if (!spec) return no("off-map");
      if (has(s, cmd.id)) return no("already-researched");
      if (spec.needs && !has(s, spec.needs)) return no("needs-research");
      return cmd.id === s.research ? no("same") : { ok: true, cost: 0 };
    }
    case "clear-silt":
      if (s.canalCondition >= 1000) return no("no-silt", SILT_CLEAR_COST);
      return s.treasury < SILT_CLEAR_COST ? no("no-funds", SILT_CLEAR_COST) : { ok: true, cost: SILT_CLEAR_COST };
    case "borrow":
      return s.loanOwed > 0 ? no("loan-open") : { ok: true, cost: 0 };
    case "end-season":
      return { ok: true, cost: 0 };
  }
}

// ---- A season ------------------------------------------------------------------------------------------------------

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function runSeason(s: State, scenario: Scenario): State {
  const rng = new Rng(s.rng);
  const season = s.season;
  const soy = seasonOfYear(season);
  const events = activeEvents(s, season);
  const wet = wateredPlots(s);
  const of = (t: BuildingType) => plotsOf(s, t);
  const houses = of("house");
  const farms = of("farm");
  const markets = of("market");
  const workshops = of("workshop");
  const schools = of("school");
  const baths = of("bath");
  const granaries = of("granary");
  const libraries = of("library");
  const hospitals = of("hospital");
  const caravanserais = of("caravanserai");
  const mills = of("mill");

  // Labour: every household gives one worker. If there are too few, every workplace runs at the same share.
  let workersNeeded = 0;
  for (const t of BUILDING_TYPES) workersNeeded += BUILDINGS[t].workers * of(t).length;
  const staffing = workersNeeded === 0 ? 1000 : Math.min(1000, Math.floor((s.households * 1000) / workersNeeded));

  // Water, in three tiers: drinking first, then farms, then crafts and baths.
  const thirst = THIRST[soy];
  const need = (plots: number[], t: BuildingType) => plots.filter((p) => servedByWater(wet, p)).length * Math.floor((BUILDINGS[t].water * thirst) / 1000);
  const tiers = [need(houses, "house") + need(hospitals, "hospital"), need(farms, "farm"), need(workshops, "workshop") + need(baths, "bath") + need(mills, "mill") + need(caravanserais, "caravanserai")];
  let supply = intakeCapacity(s, season);
  const waterSupply = supply;
  const share: [number, number, number] = [1000, 1000, 1000];
  for (let i = 0; i < 3; i++) {
    const n = tiers[i]!;
    if (n === 0) continue;
    const got = Math.min(n, supply);
    share[i] = Math.floor((got * 1000) / n);
    supply -= got;
  }

  // Food.
  let perFarm = FARM_YIELD;
  if (has(s, "crop-rotation")) perFarm = FARM_YIELD_ROTATION;
  let harvestRate: number = HARVEST[soy];
  if (events.includes("good-harvest")) harvestRate = Math.floor((harvestRate * 1350) / 1000);
  const wateredFarms = farms.filter((p) => servedByWater(wet, p)).length;
  const dryFarms = farms.length - wateredFarms;
  // A farm without a canal still grows a little on rain.
  const harvest = Math.floor((((wateredFarms * perFarm * share[1]) / 1000 + dryFarms * Math.floor(perFarm / 4)) * harvestRate * staffing) / 1_000_000);
  let grain = s.grain + harvest;
  const eaten = Math.min(grain, s.households);
  grain -= eaten;
  const hungerPermille = s.households === 0 ? 0 : Math.floor(((s.households - eaten) * 1000) / s.households);
  const storage = 80 + 160 * granaries.length;
  // What cannot be stored is sold at once, cheaply; a tenth of what is stored spoils unless there is a granary.
  const surplus = Math.max(0, grain - storage);
  const sold = surplus;
  grain -= surplus;
  // A watermill with water grinds what is stored, and flour keeps better than grain: spoilage is halved.
  const grinding = mills.some((p) => servedByWater(wet, p));
  const spoilDivisor = (granaries.length > 0 ? 40 : 10) * (grinding ? 2 : 1);
  const spoiled = Math.floor(grain / spoilDivisor);
  grain -= spoiled;

  // Money.
  const servedByMarket = houses.filter((h) => within(h, markets, MARKET_REACH)).length;
  const householdsPerHouse = houses.length === 0 ? 0 : Math.floor(s.households / houses.length);
  // Goods: a workshop within reach of a market, with water and labour, doubles what that market's customers spend.
  const supplied = markets.filter((m) => workshops.some((w) => distance(m, w) <= GOODS_REACH && servedByWater(wet, w))).length;
  const goods = markets.length === 0 ? 0 : Math.floor((supplied * share[2] * staffing) / (markets.length * 1000));
  const customers = Math.min(servedByMarket * householdsPerHouse, markets.length * MARKET_CAPACITY);
  let trade = Math.floor((customers * (260 + (goods * 340) / 1000) * staffing) / 1_000_000);
  if (events.includes("caravan")) trade = Math.floor((trade * 1500) / 1000) + (markets.length > 0 ? 8 : 0);
  // Each caravanserai, where there is a market for its traders, brings trade every season, and more with a caravan.
  if (markets.length > 0) trade += Math.floor((caravanserais.length * (events.includes("caravan") ? 16 : 6) * staffing) / 1000);
  const tax = Math.floor((s.households * TAX_PER_TEN[s.tax]) / 10);
  // Surplus sold as flour from a working mill fetches more than grain.
  const sales = Math.floor(sold / (grinding ? 3 : 5));
  let upkeep = s.canals.length * CANAL_UPKEEP;
  for (const t of BUILDING_TYPES) upkeep += BUILDINGS[t].upkeep * of(t).length;
  // An endowed building's upkeep is paid by its endowment.
  for (const p of s.endowed) if (s.plots[p]) upkeep -= BUILDINGS[s.plots[p]!].upkeep;
  // The loan is repaid before anything else is reckoned, whatever the season brought.
  const repaid = Math.min(s.loanEach, s.loanOwed);
  const treasury = s.treasury + tax + trade + sales - upkeep - repaid;

  // Learning. A school or library that cannot be paid for, or whose city is hungry, teaches nothing.
  const paid = treasury >= 0;
  const fed = hungerPermille < 250;
  const taught = houses.filter((h) => within(h, schools, SCHOOL_REACH)).length;
  let knowledgeGained = 0;
  if (paid && fed) {
    knowledgeGained = Math.floor((taught * 1800 * staffing) / 1_000_000) + (taught > 0 ? 1 : 0) + schools.length;
    if (libraries.length > 0) knowledgeGained = Math.floor((knowledgeGained * (1000 + 450 * Math.min(2, libraries.length))) / 1000);
  }
  let knowledge = s.knowledge + knowledgeGained;
  let research = s.research;
  let researchProgress = s.researchProgress;
  const researched = [...s.researched];
  let completed: ResearchId | null = null;
  if (research) {
    const want = RESEARCH[research].cost - researchProgress;
    const spend = Math.min(want, knowledge);
    researchProgress += spend;
    knowledge -= spend;
    if (researchProgress >= RESEARCH[research].cost) {
      researched.push(research);
      completed = research;
      research = null;
      researchProgress = 0;
    }
  }

  // Welfare: what the season was like, and the city moves a third of the way toward it.
  const bathed = houses.filter((h) => within(h, baths.filter((b) => servedByWater(wet, b)), BATH_REACH)).length;
  const healed = houses.filter((h) => within(h, hospitals, HOSPITAL_REACH)).length;
  const cover = (n: number) => (houses.length === 0 ? 0 : Math.floor((n * 1000) / houses.length));
  const housed = housingCapacity(s, wet);
  const crowding = s.households > housed ? Math.min(15, Math.floor(((s.households - housed) * 100) / Math.max(1, housed))) : 0;
  const idle = workersNeeded >= s.households ? 0 : Math.floor(((s.households - workersNeeded) * 1000) / Math.max(1, s.households));
  const parts: WelfareParts = {
    base: 22,
    food: Math.floor(((1000 - hungerPermille) * 28) / 1000),
    water: Math.floor((share[0] * 14) / 1000) * (houses.some((h) => servedByWater(wet, h)) ? 1 : 0),
    baths: Math.floor((cover(bathed) * share[2] * 12) / 1_000_000),
    school: Math.floor((cover(taught) * 8) / 1000),
    hospital: Math.floor((cover(healed) * 8) / 1000),
    market: Math.floor((cover(servedByMarket) * 6) / 1000),
    // Written as 0 - x so that nothing is ever minus zero, which a saved game could not bring back.
    tax: 0 - TAX_WELFARE[s.tax],
    crowding: 0 - crowding,
    idle: 0 - Math.floor((idle * 12) / 1000),
    fever: events.includes("fever") ? (cover(bathed) >= 500 || healed > 0 ? -3 : -10) : 0,
    unpaid: paid ? 0 : -6,
  };
  let target = 0;
  for (const v of Object.values(parts)) target += v;
  target = clamp(target, 0, 100);
  const welfare = clamp(s.welfare + Math.trunc((target - s.welfare) / 3) + Math.sign(target - s.welfare), 0, 100);

  // People come to a city that is doing well and leave one that is not.
  let households = s.households;
  if (hungerPermille >= 300 || welfare < 35) households -= Math.max(1, Math.floor(households / 12));
  else if (welfare >= 55 && households < housed) households += Math.max(1, Math.min(housed - households, Math.floor(households / 9) + 2));
  households = Math.max(0, households);

  // Silt: a tenth of a per cent off the canals each season per link, more when an event brings it down the river.
  let canalCondition = s.canalCondition - Math.min(30, s.canals.length * 2);
  if (events.includes("silting")) canalCondition -= 120;
  canalCondition = clamp(canalCondition, 300, 1000);

  // The horizon: perhaps a new event, announced a full season before it begins.
  const horizon = s.events.filter((e) => season + 1 < e.season + e.seasons);
  if (rng.int(0, 999) < scenario.eventRate && !horizon.some((e) => e.season > season)) {
    const kind = rng.weighted<EventKind>(["drought", "good-harvest", "caravan", "silting", "fever"], scenario.eventWeights ?? EVENT_WEIGHTS);
    horizon.push({ kind, season: season + 2, seasons: kind === "drought" ? 2 : 1 });
  }

  const insolventSeasons = treasury < 0 ? s.insolventSeasons + 1 : 0;
  const unrestSeasons = welfare < UNREST_WELFARE ? s.unrestSeasons + 1 : 0;
  const steadySeasons = welfare >= scenario.goal.welfare ? s.steadySeasons + 1 : 0;
  const done = season + 1 >= scenario.seasons;
  let outcome: State["outcome"] = "playing";
  if (insolventSeasons >= COLLAPSE_SEASONS) outcome = "lost-insolvent";
  else if (unrestSeasons >= COLLAPSE_SEASONS || households === 0) outcome = "lost-unrest";
  else if (done) outcome = households >= scenario.goal.households && knowledge + spentKnowledge(researched, researchProgress) >= scenario.goal.knowledge && steadySeasons >= scenario.goal.steadySeasons && treasury >= 0 && s.endowed.length >= (scenario.goal.endowments ?? 0) ? "won" : "ended";

  return {
    ...s,
    rng: rng.state(),
    season: season + 1,
    treasury,
    grain,
    households,
    welfare,
    knowledge,
    research,
    researchProgress,
    researched,
    canalCondition,
    events: horizon,
    loanOwed: s.loanOwed - repaid,
    loanEach: s.loanOwed - repaid > 0 ? s.loanEach : 0,
    insolventSeasons,
    unrestSeasons,
    steadySeasons,
    outcome,
    last: { season, waterNeed: tiers[0]! + tiers[1]! + tiers[2]!, waterSupply, waterShare: share, harvest, eaten, hungerPermille, spoiled, sold, income: { tax, trade, sales }, upkeep, repaid, knowledgeGained, welfareTarget: target, staffingPermille: staffing, households, events, completedResearch: completed, welfareParts: parts, cover: { water: cover(houses.filter((h) => servedByWater(wet, h)).length), bath: cover(bathed), school: cover(taught), hospital: cover(healed), market: cover(servedByMarket) }, housing: housed, jobs: workersNeeded },
  };
}

/** Knowledge that has gone into finished and unfinished research. */
export function spentKnowledge(researched: ResearchId[], progress: number): number {
  let n = progress;
  for (const id of researched) n += RESEARCH[id].cost;
  return n;
}
/** Everything the city has learned: knowledge in hand plus what research has used. */
export const learned = (s: State): number => s.knowledge + spentKnowledge(s.researched, s.researchProgress);

// ---- Starting and stepping -----------------------------------------------------------------------------------------

export function newGame(scenario: Scenario, seed: number): State {
  const plots = new Array<BuildingType | null>(PLOTS).fill(null);
  for (const [p, t] of scenario.start.buildings) plots[p] = t;
  return {
    rules: RULES_VERSION,
    scenario: scenario.id,
    seed,
    rng: new Rng(`golden-age:${scenario.id}:${seed}`).state(),
    season: 0,
    treasury: scenario.start.treasury,
    grain: scenario.start.grain,
    households: scenario.start.households,
    welfare: 50,
    knowledge: 0,
    researchProgress: 0,
    research: null,
    researched: [...(scenario.start.researched ?? [])],
    tax: 1,
    plots,
    canals: scenario.start.canals.map(([a, b]) => linkKey(a, b)),
    endowed: [],
    mayEndow: scenario.endowments === true,
    canalCondition: scenario.start.canalCondition ?? 600,
    intake: scenario.start.intake,
    events: [],
    loanOwed: 0,
    loanEach: 0,
    insolventSeasons: 0,
    unrestSeasons: 0,
    steadySeasons: 0,
    outcome: "playing",
    last: null,
  };
}

/** Applies one command. An illegal command throws: the interface offers only what preview() allows. */
export function step(scenario: Scenario, s: State, cmd: Command): State {
  if (scenario.id !== s.scenario) throw new Error("this game belongs to another scenario");
  const p = preview(s, cmd);
  if (!p.ok) throw new Error(`illegal command ${cmd.type}: ${p.reason ?? "refused"}`);
  switch (cmd.type) {
    case "build": {
      const plots = [...s.plots];
      plots[cmd.plot] = cmd.building;
      return { ...s, plots, treasury: s.treasury - p.cost };
    }
    case "canal":
      return { ...s, canals: [...s.canals, linkKey(cmd.a, cmd.b)], treasury: s.treasury - p.cost };
    case "demolish": {
      const plots = [...s.plots];
      const refund = Math.floor(BUILDINGS[plots[cmd.plot]!].cost / 4);
      plots[cmd.plot] = null;
      return { ...s, plots, treasury: s.treasury + refund };
    }
    case "tax":
      return { ...s, tax: cmd.level };
    case "research":
      // Changing course returns the knowledge already put into the project in hand to the pool; nothing is lost.
      return { ...s, research: cmd.id, researchProgress: 0, knowledge: s.knowledge + s.researchProgress };
    case "clear-silt":
      return { ...s, canalCondition: 1000, treasury: s.treasury - p.cost };
    case "endow":
      return { ...s, endowed: [...s.endowed, cmd.plot], treasury: s.treasury - p.cost };
    case "borrow":
      return { ...s, treasury: s.treasury + LOAN_SUM, loanOwed: LOAN_SUM, loanEach: LOAN_SUM / LOAN_SEASONS };
    case "end-season":
      return runSeason(s, scenario);
  }
}

/** A single number for comparing two games on the same seed: balance, not wealth. Each part is capped. */
export function score(scenario: Scenario, s: State): number {
  const part = (value: number, goal: number) => Math.min(1000, Math.floor((Math.max(0, value) * 1000) / Math.max(1, goal)));
  const people = part(s.households, scenario.goal.households);
  const learning = part(learned(s), scenario.goal.knowledge);
  const wellbeing = part(s.welfare, scenario.goal.welfare);
  const reserves = part(s.treasury + s.grain, 200);
  // The weakest part counts double: a city that is rich and ignorant, or learned and hungry, does not score well.
  return Math.floor((people + learning + wellbeing + reserves + 2 * Math.min(people, learning, wellbeing, reserves)) / 6);
}

/** Checks that must hold in every state the rules can reach. Returns what is broken (empty when sound). */
export function invariants(s: State): string[] {
  const bad: string[] = [];
  const int = (name: string, v: number) => {
    if (!Number.isSafeInteger(v)) bad.push(`${name} is not a whole number: ${v}`);
  };
  int("loanOwed", s.loanOwed);
  int("loanEach", s.loanEach);
  if (s.loanOwed < 0 || s.loanEach < 0 || (s.loanOwed === 0) !== (s.loanEach === 0)) bad.push("a loan with no repayment, or a repayment with no loan");
  int("treasury", s.treasury);
  int("grain", s.grain);
  int("households", s.households);
  int("welfare", s.welfare);
  int("knowledge", s.knowledge);
  int("canalCondition", s.canalCondition);
  if (s.grain < 0) bad.push(`grain is negative: ${s.grain}`);
  if (s.households < 0) bad.push(`households is negative: ${s.households}`);
  if (s.knowledge < 0 || s.researchProgress < 0) bad.push("knowledge is negative");
  if (s.welfare < 0 || s.welfare > 100) bad.push(`welfare out of range: ${s.welfare}`);
  if (s.canalCondition < 300 || s.canalCondition > 1000) bad.push(`canal condition out of range: ${s.canalCondition}`);
  if (s.plots.length !== PLOTS) bad.push("the map changed size");
  if (new Set(s.canals).size !== s.canals.length) bad.push("a canal link is listed twice");
  if (new Set(s.researched).size !== s.researched.length) bad.push("a research project is listed twice");
  if (new Set(s.endowed).size !== s.endowed.length) bad.push("a plot is endowed twice");
  for (const p of s.endowed) if (!s.plots[p] || !ENDOWABLE.includes(s.plots[p]!)) bad.push(`plot ${p} is endowed but holds nothing that can be`);
  if (s.endowed.length > 0 && !s.mayEndow) bad.push("something is endowed in a game where endowing is closed");
  if (s.research && s.researched.includes(s.research)) bad.push("researching something already known");
  if (Math.abs(s.treasury) > 10_000_000 || s.grain > 10_000_000 || s.households > 100_000) bad.push("a stock has run away");
  if (s.last) {
    const r = s.last;
    for (const v of r.waterShare) if (v < 0 || v > 1000) bad.push(`water share out of range: ${v}`);
    if (r.hungerPermille < 0 || r.hungerPermille > 1000) bad.push(`hunger out of range: ${r.hungerPermille}`);
    if (r.eaten < 0 || r.harvest < 0 || r.sold < 0 || r.spoiled < 0) bad.push("a flow is negative");
  }
  return bad;
}
