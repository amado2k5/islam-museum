// What the screen shows, worked out from the rules and nothing else. No DOM here, so every figure a player reads
// can be tested: the numbers in the top bar, what tomorrow and the next ten days will bring (the rules run on a
// copy, so it is the real future unless the player acts), what each field needs, what each work costs and why it
// may be refused, what the market will take, how far each quest has got, and the one thing most worth doing now.
import { MINOR, freeCapacity } from "../sim/economy";
import {
  CROPS,
  HARVEST_RATE,
  QUESTS,
  carries,
  dayOfSeason,
  foodInStore,
  foodNeed,
  forecast,
  preview,
  reserveDays,
  riverYear,
  seasonOf,
  treasuryOf,
  waterNeed,
  weather,
  workersOf,
  type ActResult,
  type Crop,
  type QuestId,
  type Scenario,
  type Season,
  type VillageCommand,
  type VillageState,
} from "../sim/village";

const have = (s: VillageState, good: string): number => s.economy.stock[good]?.quantity ?? 0;
/** Whole dinars, for showing. */
export const wholeDinars = (minor: number): number => Math.floor(minor / MINOR);

export interface Stocks {
  day: number;
  season: Season;
  dayOfSeason: number;
  daysLeft: number;
  dinars: number;
  food: number;
  reserveDays: number;
  households: number;
  housing: number;
  welfare: number;
  pool: number;
  poolCapacity: number;
  workers: number;
  storeUsed: number;
  storeRoom: number;
  timber: number;
  stone: number;
  /** The same figures tomorrow and in ten days if nothing more is done; null once the scenario is over. */
  tomorrow: { dinars: number; reserveDays: number; welfare: number; pool: number; households: number } | null;
  inTen: { dinars: number; reserveDays: number; welfare: number; pool: number; households: number } | null;
}
const glance = (s: VillageState) => ({ dinars: wholeDinars(treasuryOf(s)), reserveDays: reserveDays(s), welfare: s.welfare, pool: s.pool, households: s.households });

export function stocks(sc: Scenario, s: VillageState): Stocks {
  const ahead = forecast(sc, s, 10);
  return {
    day: s.day,
    season: seasonOf(s.day),
    dayOfSeason: dayOfSeason(s.day),
    daysLeft: Math.max(0, sc.endDay - s.day + 1),
    dinars: wholeDinars(treasuryOf(s)),
    food: foodInStore(s),
    reserveDays: reserveDays(s),
    households: s.households,
    housing: s.housing,
    welfare: s.welfare,
    pool: s.pool,
    poolCapacity: sc.water.poolCapacity,
    workers: workersOf(s),
    storeUsed: s.economy.capacity - freeCapacity(s.economy),
    storeRoom: s.economy.capacity,
    timber: have(s, "timber"),
    stone: have(s, "stone"),
    tomorrow: ahead[0] ? glance(ahead[0]) : null,
    inTen: ahead.length ? glance(ahead[ahead.length - 1]!) : null,
  };
}

export type FieldStage = "fallow" | "growing" | "ripe" | "harvesting" | "spent";
export interface FieldCard {
  id: string;
  crop: Crop | null;
  stage: FieldStage;
  /** Growth, yesterday's water and yesterday's hands, in percent. */
  growth: number;
  watered: number;
  tended: number;
  /** What its branch can carry in a day, and what a growing crop here would want. */
  branch: { id: string; carries: number; wants: number; state: "flowing" | "weak" | "none" };
  standing: number;
  yielded: number;
  brought: number;
  sold: number;
  spoiled: number;
  /** Days before a ripe crop begins to spoil; nought or less means it is spoiling. Null if not ripe. */
  spoilsIn: number | null;
  /** Days the hands available would need to bring in what stands. */
  daysToBring: number | null;
  /** What could be sown here now. */
  sowable: Crop[];
}

export function fieldCards(sc: Scenario, s: VillageState): FieldCard[] {
  return sc.plots.map((def) => {
    const p = s.plots[def.id]!;
    const b = s.branches[def.branch]!;
    const carry = carries(b);
    const wants = p.crop ? CROPS[p.crop].water : Math.max(...Object.keys(def.potential).map((c) => CROPS[c as Crop].water));
    const stage: FieldStage = p.crop === null ? "fallow" : p.ripeSince === null ? "growing" : p.standing === 0 ? "spent" : p.harvesting ? "harvesting" : "ripe";
    const ripe = p.crop !== null && p.ripeSince !== null && p.standing > 0;
    return {
      id: def.id,
      crop: p.crop,
      stage,
      growth: Math.floor(p.growth / 10),
      watered: Math.floor(p.watered / 10),
      tended: Math.floor(p.tended / 10),
      branch: { id: def.branch, carries: carry, wants, state: carry === 0 ? "none" : carry < wants ? "weak" : "flowing" },
      standing: p.standing,
      yielded: p.yielded,
      brought: p.brought,
      sold: p.soldFromField,
      spoiled: p.spoiled,
      spoilsIn: ripe ? CROPS[p.crop!].window - (s.day - p.ripeSince!) + 1 : null,
      daysToBring: ripe ? Math.ceil(p.standing / (workersOf(s) * HARVEST_RATE)) : null,
      sowable: p.crop === null ? (Object.keys(def.potential) as Crop[]).filter((c) => preview(sc, s, { kind: "plant", plot: def.id, crop: c }).ok) : [],
    };
  });
}

export type WorkId = "repair" | "expand" | "house" | "granary";
export interface WorkRow {
  id: WorkId;
  dinars: number;
  timber: number;
  stone: number;
  labour: number;
  command: VillageCommand;
  /** What ordering it now would do: allowed, or why not. */
  now: ActResult;
  /** Under way: percent done. Null otherwise. */
  progress: number | null;
  built: number;
  sites: number;
}

export function workRows(sc: Scenario, s: VillageState): WorkRow[] {
  const row = (id: WorkId, command: VillageCommand, built: number, sites: number): WorkRow => {
    const def = sc.works[id];
    const w = s.works.find((x) => x.kind === id);
    return { id, dinars: wholeDinars(def.cost), timber: def.timber, stone: def.stone, labour: def.labour, command, now: preview(sc, s, command), progress: w ? Math.floor((100 * (w.labour - w.labourLeft)) / w.labour) : null, built, sites };
  };
  return [
    row("repair", { kind: "repair" }, s.built.repaired || s.built.expanded ? 1 : 0, 1),
    row("expand", { kind: "expand" }, s.built.expanded ? 1 : 0, 1),
    row("house", { kind: "build", what: "house" }, s.built.house, sc.works.house.sites),
    row("granary", { kind: "build", what: "granary" }, s.built.granary, sc.works.granary.sites),
  ];
}

export interface MarketRow {
  good: string;
  have: number;
  /** The price the player pays, and the lower one the player is paid, in whole dinars. */
  ask: number;
  bid: number;
  onOffer: number;
  /** The most that could be bought or sold right now, given money, room, stock and the market's own purse. */
  canBuy: number;
  canSell: number;
}

export function marketRows(sc: Scenario, s: VillageState): MarketRow[] {
  const m = s.economy.markets.village!;
  const room = freeCapacity(s.economy);
  return Object.entries(m.goods).map(([good, q]) => {
    const inYard = s.economy.yard.includes(good);
    return {
      good,
      have: have(s, good),
      ask: wholeDinars(q.ask),
      bid: wholeDinars(q.bid),
      onOffer: q.inventory,
      canBuy: Math.max(0, Math.min(q.inventory, Math.floor(treasuryOf(s) / q.ask), inYard ? Number.MAX_SAFE_INTEGER : room)),
      canSell: Math.max(0, Math.min(have(s, good), q.bid === 0 ? 0 : Math.floor(m.cash / q.bid))),
    };
  });
}

/** Trade beyond the village, as the Economy panel shows it. Null where the scenario has none. */
export interface TradeView {
  port: { id: string; carted: number; cartsPerDay: number; rows: Array<{ good: string; have: number; bid: number; carriage: number; net: number; canSend: number }> };
  press: { cost: number; from: string; makes: string; each: number; canRun: number };
  contracts: Array<{ id: string; good: string; units: number; delivered: number; state: "offered" | "accepted" | "settled" | "cancelled" | "failed"; daysLeft: number; revenue: number; costs: number; penalty: number; canAccept: boolean; canDeliver: number }>;
}

export function tradeView(sc: Scenario, s: VillageState): TradeView | null {
  const tr = sc.trade;
  if (!tr) return null;
  const m = s.economy.markets[tr.port.id]!;
  const cartsLeft = Math.max(0, tr.port.cartsPerDay - s.carted);
  const free = (good: string) => have(s, good) - (s.economy.stock[good]?.reserved ?? 0);
  const [from, each] = Object.entries(tr.press.inputs)[0]!;
  const makes = Object.keys(tr.press.outputs)[0]!;
  return {
    port: {
      id: tr.port.id,
      carted: s.carted,
      cartsPerDay: tr.port.cartsPerDay,
      rows: Object.entries(tr.port.carriage).map(([good, carriage]) => {
        const bid = m.goods[good]!.bid;
        return { good, have: have(s, good), bid: wholeDinars(bid), carriage: wholeDinars(carriage), net: wholeDinars(bid - carriage), canSend: Math.max(0, Math.min(free(good), cartsLeft, Math.floor(m.cash / bid), carriage === 0 ? Number.MAX_SAFE_INTEGER : Math.floor(treasuryOf(s) / carriage))) };
      }),
    },
    press: { cost: wholeDinars(tr.press.cost), from, makes, each, canRun: Math.max(0, Math.min(Math.floor(free(from) / each), tr.press.cost === 0 ? Number.MAX_SAFE_INTEGER : Math.floor(treasuryOf(s) / tr.press.cost))) },
    contracts: tr.contracts.map((def) => {
      const c = s.economy.contracts[def.id]!;
      const daysLeft = def.byDay - s.day + 1;
      const owed = c.units - c.delivered;
      return {
        id: c.id,
        good: c.good,
        units: c.units,
        delivered: c.delivered,
        state: c.state,
        daysLeft,
        revenue: wholeDinars(c.revenue),
        costs: wholeDinars(c.transport + c.fees),
        penalty: wholeDinars(c.penalty),
        canAccept: c.state === "offered" && daysLeft > 0 && treasuryOf(s) >= c.transport + c.fees,
        canDeliver: c.state === "accepted" ? Math.max(0, Math.min(owed, have(s, c.good), cartsLeft)) : 0,
      };
    }),
  };
}

export interface QuestRow {
  id: QuestId;
  done: boolean;
  /** How far it has got, where that is a number. */
  progress: { have: number; want: number } | null;
}

export function questRows(sc: Scenario, s: VillageState): QuestRow[] {
  const first = s.plots[sc.plots[0]!.id]!;
  const progress: Record<QuestId, QuestRow["progress"]> = {
    "q01-water": { have: Math.min(3, s.streak.eastWatered), want: 3 },
    "q02-harvest": first.yielded > 0 ? { have: first.brought + first.soldFromField, want: first.yielded } : null,
    "q03-reserve": { have: Math.min(10, s.streak.reserve), want: 10 },
    "q04-home": { have: Math.max(0, s.households - sc.households), want: 1 },
    "q05-granary": null,
  };
  return QUESTS.map((id) => ({ id, done: s.quests[id], progress: s.quests[id] ? null : progress[id] }));
}

export interface SkyDay {
  day: number;
  season: Season;
  rain: boolean;
  inflow: number;
}
/** The sky and the river for the days ahead. It is not a guess: the weather is fixed when the game begins. */
export function skyAhead(sc: Scenario, s: VillageState, days: number): SkyDay[] {
  const out: SkyDay[] = [];
  for (let d = s.day; d < s.day + days && d <= sc.endDay; d++) out.push({ day: d, season: seasonOf(d), ...weather(sc, s.seed, d) });
  return out;
}
/** How the river runs in each season of this year, in percent of a usual year. */
export const riverOfYear = (s: VillageState): [number, number, number, number] => [0, 1, 2, 3].map((q) => riverYear(s.seed, q as Season)) as [number, number, number, number];

export interface Advice {
  key: "advice_harvest" | "advice_spoiling" | "advice_store_full" | "advice_hungry" | "advice_low_food" | "advice_branch" | "advice_thirsty" | "advice_sow" | "advice_house" | "advice_steady";
  field?: string;
  days?: number;
}
/** The one thing most worth the steward's attention now. It names a fact; it never plays the game for the player. */
export function advice(sc: Scenario, s: VillageState): Advice {
  const cards = fieldCards(sc, s);
  const spoiling = cards.find((c) => c.spoilsIn !== null && c.spoilsIn <= 0);
  if (spoiling) return { key: "advice_spoiling", field: spoiling.id };
  if (s.last && s.last.eaten < s.last.foodNeed) return { key: "advice_hungry" };
  const waiting = cards.find((c) => c.stage === "ripe");
  if (waiting) return { key: "advice_harvest", field: waiting.id, days: waiting.spoilsIn ?? 0 };
  // Yesterday some of a crop stayed in the field because the store could not take it.
  const stuck = s.last?.events.find((e) => e.startsWith("store-full:"));
  if (stuck && cards.some((c) => c.stage === "harvesting")) return { key: "advice_store_full", field: stuck.slice("store-full:".length) };
  if (reserveDays(s) < 10) return { key: "advice_low_food", days: reserveDays(s) };
  if (s.last && s.last.townWater < s.last.townNeed) return { key: "advice_thirsty" };
  const weak = cards.find((c) => c.stage === "growing" && c.branch.state === "weak");
  if (weak && !s.works.some((w) => w.kind === "repair" || w.kind === "expand")) return { key: "advice_branch", field: weak.id };
  const fallow = cards.find((c) => c.sowable.length > 0);
  if (fallow) return { key: "advice_sow", field: fallow.id };
  if (s.households >= s.housing && s.welfare >= 65 && !s.works.some((w) => w.kind === "house") && s.built.house < sc.works.house.sites) return { key: "advice_house" };
  return { key: "advice_steady" };
}

/** Yesterday's water and food, for the line that says how the day went. */
export function yesterday(s: VillageState): { rain: boolean; inflow: number; townWater: number; townNeed: number; eaten: number; foodNeed: number; workers: number; idle: number; events: string[] } | null {
  return s.last ? { rain: s.last.rain, inflow: s.last.inflow, townWater: s.last.townWater, townNeed: s.last.townNeed, eaten: s.last.eaten, foodNeed: s.last.foodNeed, workers: s.last.workers, idle: s.last.idle, events: s.last.events } : null;
}
export const needs = (s: VillageState): { food: number; water: number } => ({ food: foodNeed(s), water: waterNeed(s) });
