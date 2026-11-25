// Granada's first scenario as rules: a valley district, a day at a time.
//
// Water comes down from the river into a pool and out along branches to the fields and the households; a field
// grows as fast as it is watered and tended; a ripe field is brought in by hand, a little each day, into a store
// that may be full; households eat, and stay or leave by how they fare. Money and goods live in the ledger
// (economy.ts) and move only through it. Nothing here reads a clock or a random number: the weather of a day is a
// pure function of the seed and the day, so a forecast is the real future unless the player acts.
//
// Every number is a game number. The crops, their seasons and their yields are not taken from any source about the
// Vega of Granada; the museum has none yet (docs/gaming/granada/g0-discovery.md, section 6), and a screen that shows
// them must say that they are simulation.
import { hash32 } from "@im/kernel/prng";
import { audit, dinars, freeCapacity, open, submit, type CommandResult, type EconomyCommand, type EconomyState, type Market } from "./economy";

export const VILLAGE_VERSION = 1;
export const SEASON_DAYS = 30;
export const YEAR_DAYS = 120;
export type Season = 0 | 1 | 2 | 3; // spring, summer, autumn, winter
export const seasonOf = (day: number): Season => (Math.floor(((day - 1) % YEAR_DAYS) / SEASON_DAYS) as Season);
export const dayOfSeason = (day: number): number => ((day - 1) % SEASON_DAYS) + 1;

export type Crop = "wheat" | "olives" | "vegetables";
export interface CropDef {
  good: string;
  /** Days from sowing (or from the turn of the year, for a grove) to ripeness, fully watered and tended. */
  days: number;
  /** Water a growing field asks for each day. */
  water: number;
  /** Workers a growing field wants each day. */
  tenders: number;
  /** Days a ripe crop stands before it begins to spoil. */
  window: number;
  /** Seasons in which it may be sown. A grove is not sown. */
  sowIn: Season[];
  /** Food a unit gives a household. Nought for a crop that is sold, not eaten. */
  food: number;
}
export const CROPS: Record<Crop, CropDef> = {
  wheat: { good: "wheat", days: 60, water: 6, tenders: 4, window: 14, sowIn: [2], food: 1 },
  olives: { good: "olives", days: 50, water: 10, tenders: 3, window: 16, sowIn: [], food: 0 },
  vegetables: { good: "vegetables", days: 30, water: 14, tenders: 5, window: 8, sowIn: [0, 1], food: 1 },
};
/** Units one worker brings in from a ripe field in a day. */
export const HARVEST_RATE = 14;
/** Share of a standing crop that spoils each day after its window, in thousandths. */
export const SPOIL_PER_DAY = 120;

export interface WorkDef {
  cost: number;
  timber: number;
  stone: number;
  /** Worker-days. */
  labour: number;
}
export interface PlotDef {
  id: string;
  /** The branch that waters it. */
  branch: string;
  /** Units a full, unstressed crop yields here, by crop. A crop missing from the map cannot grow here. */
  potential: Partial<Record<Crop, number>>;
  crop: Crop | null;
  /** Growth at the start, in thousandths. */
  growth: number;
}
export interface BranchDef {
  id: string;
  capacity: number;
  /** Percent of its capacity it carries. */
  condition: number;
  /** False for a branch that does not exist until the great works are done. */
  built: boolean;
}
export interface Scenario {
  id: string;
  startDay: number;
  endDay: number;
  households: number;
  housing: number;
  treasury: number;
  capacity: number;
  yard: string[];
  stock: Record<string, number>;
  market: Market;
  plots: PlotDef[];
  water: { inflow: [number, number, number, number]; rainChance: [number, number, number, number]; rainBonus: number; pool: number; poolCapacity: number; branches: BranchDef[] };
  works: { repair: WorkDef & { branch: string; to: number }; expand: WorkDef & { opens: string; restores: string }; house: WorkDef & { housing: number; sites: number }; granary: WorkDef & { capacity: number; sites: number } };
  goal: { welfare: number; households: number; reserveDays: number };
  reward: number;
}

export type QuestId = "q01-water" | "q02-harvest" | "q03-reserve" | "q04-home" | "q05-granary";
export const QUESTS: QuestId[] = ["q01-water", "q02-harvest", "q03-reserve", "q04-home", "q05-granary"];

export interface PlotState {
  crop: Crop | null;
  growth: number;
  /** Yield lost to thirst so far, in thousandths. */
  stress: number;
  /** Day it ripened, or null. */
  ripeSince: number | null;
  /** Units still standing in the field. */
  standing: number;
  /** What the crop came to when it ripened, and where every unit of it went: these always add up. */
  yielded: number;
  brought: number;
  soldFromField: number;
  spoiled: number;
  /** Whether the player has ordered it brought in, and what happens to what does not fit. */
  harvesting: "wait" | "sell" | null;
  /** Yesterday's water and hands, in thousandths of what it wanted. */
  watered: number;
  tended: number;
}
export interface Work {
  id: string;
  kind: "repair" | "expand" | "house" | "granary";
  labourLeft: number;
  labour: number;
}
export interface DayReport {
  day: number;
  rain: boolean;
  inflow: number;
  townWater: number;
  townNeed: number;
  eaten: number;
  foodNeed: number;
  workers: number;
  idle: number;
  events: string[];
}
export interface VillageState {
  version: number;
  scenario: string;
  seed: number;
  /** The day about to be lived. */
  day: number;
  economy: EconomyState;
  /** Counts the ledger commands issued, so that each has an id of its own. */
  n: number;
  households: number;
  housing: number;
  welfare: number;
  pool: number;
  waterFirst: "households" | "fields";
  branches: Record<string, { capacity: number; condition: number; built: boolean }>;
  plots: Record<string, PlotState>;
  works: Work[];
  built: { house: number; granary: number; repaired: boolean; expanded: boolean };
  /** Consecutive days of the things quests ask to be sustained. */
  streak: { eastWatered: number; reserve: number };
  everFull: boolean;
  quests: Record<QuestId, boolean>;
  last: DayReport | null;
  outcome: null | { won: boolean; reasons: string[]; score: number };
}

export type VillageCommand =
  | { kind: "repair" }
  | { kind: "expand" }
  | { kind: "build"; what: "house" | "granary" }
  | { kind: "harvest"; plot: string; rest: "wait" | "sell" }
  | { kind: "plant"; plot: string; crop: Crop }
  | { kind: "sell"; good: string; quantity: number }
  | { kind: "buy"; good: string; quantity: number }
  | { kind: "water-first"; who: "households" | "fields" };
export type Refusal =
  | "over"
  | "already-done"
  | "already-under-way"
  | "no-site"
  | "no-money"
  | "no-materials"
  | "unknown-plot"
  | "not-ripe"
  | "not-fallow"
  | "wrong-season"
  | "cannot-grow-here"
  | "no-water-branch"
  | "bad-quantity"
  | "unknown-good"
  | "not-enough"
  | "market-out"
  | "market-poor"
  | "no-room";
export type ActResult = { ok: true; money: number } | { ok: false; why: Refusal; detail?: Record<string, number> };

// ---- Starting ----------------------------------------------------------------------------------------------------------

export function newVillage(sc: Scenario, seed: number): VillageState {
  const economy = open({ treasury: sc.treasury, capacity: sc.capacity, yard: sc.yard, stock: Object.fromEntries(Object.entries(sc.stock).map(([g, q]) => [g, { quantity: q }])), markets: { village: structuredClone(sc.market) } });
  const plots: Record<string, PlotState> = {};
  for (const p of sc.plots) {
    const ripe = p.crop !== null && p.growth >= 1000;
    const yielded = ripe ? p.potential[p.crop!]! : 0;
    plots[p.id] = { crop: p.crop, growth: Math.min(1000, p.growth), stress: 0, ripeSince: ripe ? sc.startDay : null, standing: yielded, yielded, brought: 0, soldFromField: 0, spoiled: 0, harvesting: null, watered: 1000, tended: 1000 };
  }
  return {
    version: VILLAGE_VERSION,
    scenario: sc.id,
    seed,
    day: sc.startDay,
    economy,
    n: 0,
    households: sc.households,
    housing: sc.housing,
    welfare: 60,
    pool: sc.water.pool,
    waterFirst: "households",
    branches: Object.fromEntries(sc.water.branches.map((b) => [b.id, { capacity: b.capacity, condition: b.condition, built: b.built }])),
    plots,
    works: [],
    built: { house: 0, granary: 0, repaired: false, expanded: false },
    streak: { eastWatered: 0, reserve: 0 },
    everFull: false,
    quests: { "q01-water": false, "q02-harvest": false, "q03-reserve": false, "q04-home": false, "q05-granary": false },
    last: null,
    outcome: null,
  };
}

// ---- Reading -----------------------------------------------------------------------------------------------------------

export const workersOf = (s: VillageState): number => Math.floor((s.households * 2) / 5);
export const foodNeed = (s: VillageState): number => Math.ceil(s.households / 10);
export const waterNeed = (s: VillageState): number => Math.ceil(s.households / 6);
const have = (s: VillageState, good: string): number => s.economy.stock[good]?.quantity ?? 0;
/** Food in store, in units a household eats. */
export const foodInStore = (s: VillageState): number => Object.values(CROPS).reduce((n, c) => n + (c.food > 0 ? have(s, c.good) * c.food : 0), 0);
/** Days the food in store would last at today's need. */
export const reserveDays = (s: VillageState): number => Math.floor(foodInStore(s) / Math.max(1, foodNeed(s)));
export const treasuryOf = (s: VillageState): number => s.economy.treasury.available;

/** The weather of a day: decided by the seed and the day alone, so that tomorrow can be shown today. */
export function weather(sc: Scenario, seed: number, day: number): { rain: boolean; inflow: number } {
  const season = seasonOf(day);
  const rain = hash32(`rain:${seed}:${day}`) % 100 < sc.water.rainChance[season];
  return { rain, inflow: Math.floor((sc.water.inflow[season] * riverYear(seed, season)) / 100) + (rain ? sc.water.rainBonus : 0) };
}
/**
 * How the river runs in a season of this year, in percent of a usual year: between 75 and 125. It is fixed by the
 * seed, so a thin summer is known in spring and can be planned for.
 */
export const riverYear = (seed: number, season: Season): number => 75 + (hash32(`river:${seed}:${season}`) % 51);

/** Water a branch can carry in a day. */
export const carries = (b: { capacity: number; condition: number; built: boolean }): number => (b.built ? Math.floor((b.capacity * b.condition) / 100) : 0);

// ---- Acting ------------------------------------------------------------------------------------------------------------

/** A copy to change. The ledger is never changed in place (every command returns a new one), so the copy shares it. */
const copy = (state: VillageState): VillageState => ({ ...structuredClone({ ...state, economy: null }), economy: state.economy }) as VillageState;

function ledger(s: VillageState, command: EconomyCommand): CommandResult {
  const out = submit(s.economy, { commandId: `d${s.day}:${s.n}`, expectedStateVersion: s.economy.stateVersion, command });
  s.n += 1;
  s.economy = out.state;
  return out.result;
}

function startWork(s: VillageState, def: WorkDef, kind: Work["kind"], why: string): ActResult {
  if (treasuryOf(s) < def.cost) return { ok: false, why: "no-money", detail: { cost: def.cost, have: treasuryOf(s) } };
  if (have(s, "timber") < def.timber || have(s, "stone") < def.stone) return { ok: false, why: "no-materials", detail: { timber: def.timber - have(s, "timber"), stone: def.stone - have(s, "stone") } };
  if (def.cost > 0) ledger(s, { kind: "spend", amount: def.cost, why });
  if (def.timber > 0) ledger(s, { kind: "consume", good: "timber", quantity: def.timber, why });
  if (def.stone > 0) ledger(s, { kind: "consume", good: "stone", quantity: def.stone, why });
  s.works.push({ id: `${kind}-${s.day}-${s.n}`, kind, labourLeft: def.labour, labour: def.labour });
  return { ok: true, money: -def.cost };
}

/** What a command would do, without doing it. */
export const preview = (sc: Scenario, state: VillageState, command: VillageCommand): ActResult => act(sc, state, command).result;

/** A player's decision, applied at once. The state passed in is never changed; a refusal returns it untouched. */
export function act(sc: Scenario, state: VillageState, command: VillageCommand): { state: VillageState; result: ActResult } {
  if (state.outcome) return { state, result: { ok: false, why: "over" } };
  const s = copy(state);
  const result = apply(sc, s, command);
  return result.ok ? { state: s, result } : { state, result };
}

function apply(sc: Scenario, s: VillageState, cmd: VillageCommand): ActResult {
  const under = (kind: Work["kind"]) => s.works.some((w) => w.kind === kind);
  switch (cmd.kind) {
    case "repair": {
      if (s.built.repaired || s.built.expanded) return { ok: false, why: "already-done" };
      if (under("repair") || under("expand")) return { ok: false, why: "already-under-way" };
      return startWork(s, sc.works.repair, "repair", "repairing the broken branch");
    }
    case "expand": {
      if (s.built.expanded) return { ok: false, why: "already-done" };
      if (under("repair") || under("expand")) return { ok: false, why: "already-under-way" };
      return startWork(s, sc.works.expand, "expand", "rebuilding and extending the channel");
    }
    case "build": {
      const def = sc.works[cmd.what];
      const underWay = s.works.filter((w) => w.kind === cmd.what).length;
      if (s.built[cmd.what] + underWay >= def.sites) return { ok: false, why: "no-site" };
      return startWork(s, def, cmd.what, cmd.what === "house" ? "building a house" : "building a granary");
    }
    case "harvest": {
      const p = s.plots[cmd.plot];
      if (!p) return { ok: false, why: "unknown-plot" };
      if (p.ripeSince === null || p.standing === 0) return { ok: false, why: "not-ripe" };
      p.harvesting = cmd.rest;
      return { ok: true, money: 0 };
    }
    case "plant": {
      const p = s.plots[cmd.plot];
      const def = sc.plots.find((x) => x.id === cmd.plot);
      if (!p || !def) return { ok: false, why: "unknown-plot" };
      if (p.crop !== null) return { ok: false, why: "not-fallow" };
      if (def.potential[cmd.crop] === undefined) return { ok: false, why: "cannot-grow-here" };
      if (!CROPS[cmd.crop].sowIn.includes(seasonOf(s.day))) return { ok: false, why: "wrong-season" };
      if (carries(s.branches[def.branch]!) === 0) return { ok: false, why: "no-water-branch" };
      s.plots[cmd.plot] = { crop: cmd.crop, growth: 0, stress: 0, ripeSince: null, standing: 0, yielded: 0, brought: 0, soldFromField: 0, spoiled: 0, harvesting: null, watered: 0, tended: 0 };
      return { ok: true, money: 0 };
    }
    case "sell":
    case "buy": {
      if (!Number.isSafeInteger(cmd.quantity) || cmd.quantity <= 0) return { ok: false, why: "bad-quantity" };
      if (!s.economy.markets.village!.goods[cmd.good]) return { ok: false, why: "unknown-good" };
      const r = ledger(s, { kind: cmd.kind, market: "village", good: cmd.good, quantity: cmd.quantity });
      if (r.ok) return { ok: true, money: r.money };
      const map: Record<string, Refusal> = { "insufficient-stock": "not-enough", "insufficient-funds": "no-money", "market-out-of-stock": "market-out", "market-short-of-cash": "market-poor", "no-storage": "no-room" };
      return { ok: false, why: map[r.error] ?? "bad-quantity", ...(r.detail ? { detail: r.detail } : {}) };
    }
    case "water-first": {
      s.waterFirst = cmd.who;
      return { ok: true, money: 0 };
    }
  }
}

// ---- A day -------------------------------------------------------------------------------------------------------------

/** Lives one day. The state passed in is never changed. */
export function tick(sc: Scenario, state: VillageState): VillageState {
  if (state.outcome) return state;
  const s = copy(state);
  const day = s.day;
  const events: string[] = [];
  const sky = weather(sc, s.seed, day);

  // 1. Water: the day's flow and the pool are shared out, households or fields first as the player has chosen.
  let water = sky.inflow + s.pool;
  const townNeed = waterNeed(s);
  let townWater = 0;
  const wants: Array<{ plot: string; want: number; got: number }> = [];
  for (const def of sc.plots) {
    const p = s.plots[def.id]!;
    if (p.crop === null || p.ripeSince !== null) continue;
    const want = sky.rain ? Math.ceil(CROPS[p.crop].water / 2) : CROPS[p.crop].water;
    wants.push({ plot: def.id, want, got: 0 });
  }
  const giveTown = () => {
    townWater = Math.min(townNeed, water);
    water -= townWater;
  };
  const giveFields = () => {
    for (const w of wants) {
      const branch = s.branches[sc.plots.find((p) => p.id === w.plot)!.branch]!;
      w.got = Math.min(w.want, carries(branch), water);
      water -= w.got;
    }
  };
  if (s.waterFirst === "households") {
    giveTown();
    giveFields();
  } else {
    giveFields();
    giveTown();
  }
  // What is left stays in the pool, up to its brim; the rest runs on down the river.
  s.pool = Math.min(sc.water.poolCapacity, water);

  // 2. Hands: bringing in a ripe crop first, then the works, then tending what grows.
  const workers = workersOf(s);
  let free = workers;
  for (const def of sc.plots) {
    const p = s.plots[def.id]!;
    if (p.harvesting === null || p.standing === 0) continue;
    const hands = Math.min(free, Math.ceil(p.standing / HARVEST_RATE));
    const reach = Math.min(p.standing, hands * HARVEST_RATE);
    if (reach === 0) continue;
    const good = CROPS[p.crop!].good;
    const r = ledger(s, { kind: "harvest", good, quantity: reach, overflow: p.harvesting === "sell" ? "sell" : "leave", market: "village" });
    if (r.ok) {
      p.brought += r.stored;
      p.soldFromField += r.sold;
      p.standing -= r.stored + r.sold;
      // Hands are counted for what was actually carried.
      free -= Math.min(hands, Math.ceil((r.stored + r.sold) / HARVEST_RATE));
      // The store could not take it all: left standing, or sold from the field because the player said so.
      if (r.leftInField > 0 || r.sold > 0) s.everFull = true;
      if (r.leftInField > 0) events.push(`store-full:${def.id}`);
    }
    if (p.standing === 0) {
      p.harvesting = null;
      events.push(`harvested:${def.id}`);
    }
  }
  for (const w of s.works) {
    const hands = Math.min(free, 6, w.labourLeft);
    w.labourLeft -= hands;
    free -= hands;
  }
  for (const w of s.works.filter((x) => x.labourLeft === 0)) {
    if (w.kind === "repair") {
      s.branches[sc.works.repair.branch]!.condition = Math.max(s.branches[sc.works.repair.branch]!.condition, sc.works.repair.to);
      s.built.repaired = true;
    } else if (w.kind === "expand") {
      s.branches[sc.works.expand.restores]!.condition = 100;
      Object.assign(s.branches[sc.works.expand.opens]!, { built: true, condition: 100 });
      s.built.expanded = true;
    } else if (w.kind === "house") {
      s.housing += sc.works.house.housing;
      s.built.house += 1;
    } else {
      ledger(s, { kind: "add-capacity", units: sc.works.granary.capacity, why: "the granary is finished" });
      s.built.granary += 1;
    }
    events.push(`built:${w.kind}`);
  }
  s.works = s.works.filter((w) => w.labourLeft > 0);

  // 3. Fields: growth by water and by hands; thirst costs yield; a ripe crop left too long begins to spoil.
  for (const def of sc.plots) {
    const p = s.plots[def.id]!;
    if (p.crop === null) continue;
    const crop = CROPS[p.crop];
    if (p.ripeSince === null) {
      const w = wants.find((x) => x.plot === def.id)!;
      const hands = Math.min(free, crop.tenders);
      free -= hands;
      p.watered = Math.floor((1000 * w.got) / w.want);
      p.tended = Math.floor((1000 * hands) / crop.tenders);
      p.growth = Math.min(1000, p.growth + Math.floor((1000 * w.got * hands) / (crop.days * w.want * crop.tenders)));
      // A wholly dry season would halve the crop.
      p.stress = Math.min(900, p.stress + Math.floor((1000 - p.watered) / (2 * crop.days)));
      if (p.growth >= 1000) {
        p.ripeSince = day;
        p.yielded = Math.floor((def.potential[p.crop]! * (1000 - p.stress)) / 1000);
        p.standing = p.yielded;
        events.push(`ripe:${def.id}`);
      }
    } else if (p.standing > 0 && day - p.ripeSince > crop.window) {
      const lost = Math.min(p.standing, Math.max(1, Math.floor((p.standing * SPOIL_PER_DAY) / 1000)));
      p.standing -= lost;
      p.spoiled += lost;
      events.push(`spoiled:${def.id}:${lost}`);
      if (p.standing === 0) p.harvesting = null;
    }
    // A sown field that has given all it had lies fallow again, keeping the account of where its crop went.
    // A grove is not sown: it rests until its next year, which this one-year scenario does not reach.
    if (p.ripeSince !== null && p.standing === 0 && p.harvesting === null && crop.sowIn.length > 0) {
      const done = { yielded: p.yielded, brought: p.brought, soldFromField: p.soldFromField, spoiled: p.spoiled };
      s.plots[def.id] = { ...p, crop: null, growth: 0, stress: 0, ripeSince: null, ...done };
    }
  }

  // 4. Households: they eat what spoils soonest first, they are counted, they pay the market's levy.
  const need = foodNeed(s);
  let eaten = 0;
  for (const good of ["vegetables", "wheat"]) {
    if (eaten >= need || have(s, good) === 0) continue;
    const r = ledger(s, { kind: "consume", good, quantity: need - eaten, why: "eaten by the households", atMost: true });
    if (r.ok) eaten += r.sold;
  }
  ledger(s, { kind: "earn", amount: dinars(Math.floor(s.households / 20)), why: "the market's levy" });
  const fed = eaten >= need;
  const watered = townWater >= townNeed;
  // A household that is not fed fares badly enough to leave: hunger alone takes welfare below the point of going.
  const target = Math.max(0, Math.min(100, 55 + (fed ? 10 : -Math.ceil((35 * (need - eaten)) / need)) + (watered ? 5 : -Math.ceil((15 * (townNeed - townWater)) / townNeed)) + (s.households > s.housing ? -5 : 0) + (reserveDays(s) >= 20 ? 5 : 0)));
  if (s.welfare < target) s.welfare += 1;
  else if (s.welfare > target) s.welfare = Math.max(target, s.welfare - 2);
  if (!fed) events.push(`hungry:${need - eaten}`);
  if (!watered) events.push(`thirsty:${townNeed - townWater}`);
  if (day % 6 === 0) {
    if (s.welfare >= 65 && s.housing > s.households) {
      s.households = Math.min(s.housing, s.households + 2);
      events.push("arrived");
    } else if (s.welfare < 35 && s.households > 20) {
      s.households -= 2;
      events.push("left");
    }
  }
  if (freeCapacity(s.economy) === 0) s.everFull = true;

  // 5. What quests ask to be sustained, and the quests themselves.
  // The mended branch must be able to carry a dry day's water, so that three days of rain do not pass for a repair.
  const east = s.plots[sc.plots.find((p) => p.branch === sc.works.repair.branch)!.id]!;
  const mended = east.crop !== null && carries(s.branches[sc.works.repair.branch]!) >= CROPS[east.crop].water;
  s.streak.eastWatered = mended && east.ripeSince === null && east.watered >= 900 ? s.streak.eastWatered + 1 : mended && east.ripeSince !== null ? s.streak.eastWatered : 0;
  // The reserve that matters is the one held as winter approaches: the store is full of last year's grain in spring.
  s.streak.reserve = seasonOf(day) >= 2 && reserveDays(s) >= 20 ? s.streak.reserve + 1 : 0;
  const first = s.plots[sc.plots[0]!.id]!;
  const done: Record<QuestId, boolean> = {
    "q01-water": s.quests["q01-water"] || s.streak.eastWatered >= 3,
    // Brought in or sold, nine parts in ten at least: a crop left to rot is not a harvest.
    "q02-harvest": s.quests["q02-harvest"] || (first.yielded > 0 && first.standing === 0 && (first.brought + first.soldFromField) * 10 >= first.yielded * 9),
    "q03-reserve": s.quests["q03-reserve"] || s.streak.reserve >= 10,
    "q04-home": s.quests["q04-home"] || (s.built.house >= 1 && s.households > sc.households),
    "q05-granary": s.quests["q05-granary"] || (s.everFull && freeCapacity(s.economy) >= 100),
  };
  for (const q of QUESTS) {
    if (done[q] && !s.quests[q]) {
      s.quests[q] = true;
      // Paid once: the ledger answers a repeated id with its first result.
      const out = submit(s.economy, { commandId: `quest:${q}`, expectedStateVersion: s.economy.stateVersion, command: { kind: "earn", amount: sc.reward, why: `quest ${q}` } });
      s.economy = out.state;
      events.push(`quest:${q}`);
    }
  }

  s.last = { day, rain: sky.rain, inflow: sky.inflow, townWater, townNeed, eaten, foodNeed: need, workers, idle: free, events };
  s.day = day + 1;
  if (s.day > sc.endDay) s.outcome = judge(sc, s);
  return s;
}

function judge(sc: Scenario, s: VillageState): NonNullable<VillageState["outcome"]> {
  const reasons: string[] = [];
  for (const q of QUESTS) if (!s.quests[q]) reasons.push(q);
  if (s.welfare < sc.goal.welfare) reasons.push("welfare");
  if (s.households < sc.goal.households) reasons.push("households");
  if (reserveDays(s) < sc.goal.reserveDays) reasons.push("reserve");
  return { won: reasons.length === 0, reasons, score: s.welfare * 10 + s.households * 5 + Math.min(60, reserveDays(s)) * 5 + Math.floor(treasuryOf(s) / dinars(10)) };
}

/** The days ahead if the player does nothing more: each day's state, so a panel can show the real future. */
export function forecast(sc: Scenario, state: VillageState, days: number): VillageState[] {
  const out: VillageState[] = [];
  let s = state;
  for (let i = 0; i < days && !s.outcome; i++) {
    s = tick(sc, s);
    out.push(s);
  }
  return out;
}

// ---- Proof -------------------------------------------------------------------------------------------------------------

/** What must always hold. Empty when sound. */
export function invariants(sc: Scenario, s: VillageState): string[] {
  const bad = audit(s.economy).map((x) => `ledger: ${x}`);
  if (s.pool < 0 || s.pool > sc.water.poolCapacity) bad.push(`the pool holds ${s.pool} of ${sc.water.poolCapacity}`);
  if (s.welfare < 0 || s.welfare > 100) bad.push(`welfare is ${s.welfare}`);
  if (s.households < 0 || s.households > Math.max(s.housing, sc.households)) bad.push(`${s.households} households in housing for ${s.housing}`);
  for (const [id, p] of Object.entries(s.plots)) {
    if (p.brought + p.soldFromField + p.spoiled + p.standing !== p.yielded) bad.push(`${id}: ${p.yielded} ripened but ${p.brought} stored, ${p.soldFromField} sold, ${p.spoiled} spoiled and ${p.standing} standing`);
    if (p.growth < 0 || p.growth > 1000 || p.stress < 0 || p.stress > 900 || p.standing < 0) bad.push(`${id}: growth ${p.growth}, stress ${p.stress}, standing ${p.standing}`);
  }
  for (const w of s.works) if (w.labourLeft <= 0 || w.labourLeft > w.labour) bad.push(`work ${w.id} has ${w.labourLeft} of ${w.labour} days left`);
  if (s.last) {
    if (s.last.townWater > s.last.townNeed || s.last.eaten > s.last.foodNeed || s.last.idle < 0 || s.last.idle > s.last.workers) bad.push(`the day's report does not add up: ${JSON.stringify(s.last)}`);
  }
  return bad;
}
