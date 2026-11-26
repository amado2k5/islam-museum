// What the screen shows, worked out from the rules and nothing else. No DOM here, so every figure a player reads
// can be tested: the numbers in the top bar, what tomorrow and the next ten days will bring (the rules run on a
// copy, so it is the real future unless the player acts), what each field needs, what each work costs and why it
// may be refused, what the market will take, how far each quest has got, and the one thing most worth doing now.
import { scenarioAfter } from "../sim/scenarios";
import { MINOR, freeCapacity } from "../sim/economy";
import {
  CROPS,
  HARVEST_RATE,
  QUESTS,
  carries,
  dayOfSeason,
  foodInStore,
  expectedHarvest,
  flowOn,
  taskState,
  tasksOf,
  tradeSince,
  foodNeed,
  forecast,
  poolCapacityOf,
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
  /** What trade has brought in the last thirty days, in whole dinars: sales and contract payments, less purchases, carriage and penalties. */
  trade30: number;
  /** The same figures tomorrow and in ten days if nothing more is done; null once the scenario is over. */
  tomorrow: { dinars: number; reserveDays: number; welfare: number; pool: number; households: number } | null;
  inTen: { dinars: number; reserveDays: number; welfare: number; pool: number; households: number } | null;
}
const glance = (s: VillageState) => ({ dinars: wholeDinars(treasuryOf(s)), reserveDays: reserveDays(s), welfare: s.welfare, pool: s.pool, households: s.households });

/** The top bar's figures for a state, worked out once however many parts of the page ask for them. */
const STOCKS = new WeakMap<VillageState, Stocks>();
export function stocks(sc: Scenario, s: VillageState): Stocks {
  const known = STOCKS.get(s);
  if (known) return known;
  // The first ten days of the one forecast the rest of the page reads from: the rules are run forward once for a state.
  const ahead = restOfScenario(sc, s).slice(0, 10);
  const made: Stocks = {
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
    poolCapacity: poolCapacityOf(sc, s),
    workers: workersOf(s),
    storeUsed: s.economy.capacity - freeCapacity(s.economy),
    storeRoom: s.economy.capacity,
    timber: have(s, "timber"),
    stone: have(s, "stone"),
    trade30: Math.round(tradeSince(s, s.day - 30) / MINOR),
    tomorrow: ahead[0] ? glance(ahead[0]) : null,
    inTen: ahead.length ? glance(ahead[ahead.length - 1]!) : null,
  };
  STOCKS.set(s, made);
  return made;
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
  /** Workers who tended it yesterday, and how many its crop needs while it grows. Null when nothing grows. */
  hands: { have: number; need: number } | null;
  /** Units of the crop already lost to thirst. */
  lostToThirst: number;
  /**
   * What it will give if nothing more is ordered, by the rules run forward: in how many days, how much, whether the
   * store has room for it today, and what it would fetch in the village and (after carriage) at the port.
   */
  expected: { inDays: number; units: number; fits: boolean; village: number; villageShort: boolean; port: number | null } | null;
  /** The steward has put this field first for water and hands. */
  first: boolean;
}

/** The rest of the scenario if nothing more is ordered, worked out once for each state however many panels ask. */
const AHEAD = new WeakMap<VillageState, VillageState[]>();
export function restOfScenario(sc: Scenario, s: VillageState): VillageState[] {
  let a = AHEAD.get(s);
  if (!a) {
    a = forecast(sc, s, sc.endDay - s.day + 1);
    AHEAD.set(s, a);
  }
  return a;
}

const CARDS = new WeakMap<VillageState, FieldCard[]>();
export function fieldCards(sc: Scenario, s: VillageState): FieldCard[] {
  const known = CARDS.get(s);
  if (known) return known;
  const made = fieldCardsOf(sc, s);
  CARDS.set(s, made);
  return made;
}
function fieldCardsOf(sc: Scenario, s: VillageState): FieldCard[] {
  return sc.plots.map((def) => {
    const p = s.plots[def.id]!;
    const b = s.branches[def.branch]!;
    const carry = carries(b);
    const wants = p.crop ? CROPS[p.crop].water : Math.max(...Object.keys(def.potential).map((c) => CROPS[c as Crop].water));
    const stage: FieldStage = p.crop === null ? "fallow" : p.ripeSince === null ? "growing" : p.standing === 0 ? "spent" : p.harvesting ? "harvesting" : "ripe";
    const ripe = p.crop !== null && p.ripeSince !== null && p.standing > 0;
    const e = stage === "spent" ? null : expectedHarvest(sc, s, def.id, restOfScenario(sc, s));
    const good = p.crop ? CROPS[p.crop].good : null;
    const villageBid = good ? (s.economy.markets.village!.goods[good]?.bid ?? 0) : 0;
    const port = sc.trade && good && sc.trade.port.carriage[good] !== undefined ? s.economy.markets[sc.trade.port.id]!.goods[good]!.bid - sc.trade.port.carriage[good]! : null;
    return {
      hands: p.crop && p.ripeSince === null ? { have: Math.round((p.tended * CROPS[p.crop].tenders) / 1000), need: CROPS[p.crop].tenders } : null,
      lostToThirst: p.crop && p.ripeSince === null ? Math.floor((def.potential[p.crop]! * p.stress) / 1000) : 0,
      expected: e ? { inDays: Math.max(0, e.day - s.day + (p.ripeSince === null ? 1 : 0)), units: e.units, fits: e.units <= freeCapacity(s.economy), village: wholeDinars(Math.min(e.units * villageBid, s.economy.markets.village!.cash)), villageShort: e.units * villageBid > s.economy.markets.village!.cash, port: port === null ? null : wholeDinars(e.units * port) } : null,
      first: s.fieldFirst === def.id,
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

/** One thing of the catalogue, as the Construction panel shows it. */
export { tradeSince };

export interface CatalogueRow {
  what: string;
  category: string;
  dinars: number;
  timber: number;
  stone: number;
  labour: number;
  radius: number;
  placed: number;
  max: number;
  /** Percent done of each one being built. */
  underWay: number[];
  /** The one thing it does when finished. */
  effect: { key: "housing" | "capacity" | "pool" | "welfare"; n: number };
  /** Whether one could be started now, the ground apart: allowed, or why not. */
  now: ActResult;
}

export function catalogueRows(sc: Scenario, s: VillageState): CatalogueRow[] {
  return Object.entries(sc.catalogue ?? {}).map(([what, def]) => {
    const placed = s.placed.filter((p) => p.what === what);
    const key = def.housing ? "housing" : def.capacity ? "capacity" : def.pool ? "pool" : "welfare";
    const now: ActResult =
      placed.length >= def.max
        ? { ok: false, why: "no-more" }
        : treasuryOf(s) < def.cost
          ? { ok: false, why: "no-money" }
          : have(s, "timber") < def.timber || have(s, "stone") < def.stone
            ? { ok: false, why: "no-materials" }
            : { ok: true, money: -def.cost };
    return {
      what,
      category: def.category,
      dinars: wholeDinars(def.cost),
      timber: def.timber,
      stone: def.stone,
      labour: def.labour,
      radius: def.radius,
      placed: placed.length,
      max: def.max,
      underWay: placed.filter((p) => !p.done).map((p) => {
        const w = s.works.find((x) => x.placed === p.id);
        return w ? Math.floor((100 * (w.labour - w.labourLeft)) / w.labour) : 0;
      }),
      effect: { key, n: def[key] ?? 0 },
      now,
    };
  });
}

/**
 * The olive oil's road, step by step, each with the figure that stands there now: the grove, the press, the oil in
 * store, the store's room, the port. It is a view of the same rules and stock as everything else, in the order the
 * goods travel.
 */
export interface ChainView {
  grove: { field: string | null; state: "none" | "growing" | "ripe"; units: number; inDays: number };
  press: { input: string; inStore: number; each: number; canRun: number; cost: number };
  oil: { good: string; inStore: number; held: number };
  store: { free: number; room: number };
  /** `owed`: what the contract still wants sent. `onRoad`: oil travelling now. `days`: how long the road is. */
  port: { id: string; canSend: number; net: number; cartsLeft: number; owed: number; canDeliver: number; onRoad: number; days: number };
}
export function chainView(sc: Scenario, s: VillageState): ChainView | null {
  const tv = tradeView(sc, s);
  if (!tv || !sc.trade) return null;
  const input = tv.press.from;
  const def = sc.plots.find((p) => s.plots[p.id]!.crop !== null && CROPS[s.plots[p.id]!.crop!].good === input);
  const card = def ? fieldCards(sc, s).find((c) => c.id === def.id) : undefined;
  const oilRow = tv.port.rows.find((r) => r.good === tv.press.makes);
  const contract = tv.contracts.find((c) => c.good === tv.press.makes && c.state === "accepted");
  return {
    grove: !card || card.stage === "spent" || card.stage === "fallow" ? { field: def?.id ?? null, state: "none", units: 0, inDays: 0 } : card.stage === "growing" ? { field: card.id, state: "growing", units: card.expected?.units ?? 0, inDays: card.expected?.inDays ?? 0 } : { field: card.id, state: "ripe", units: card.standing, inDays: 0 },
    press: { input, inStore: have(s, input), each: tv.press.each, canRun: tv.press.canRun, cost: tv.press.cost },
    oil: { good: tv.press.makes, inStore: have(s, tv.press.makes), held: s.economy.stock[tv.press.makes]?.reserved ?? 0 },
    store: { free: freeCapacity(s.economy), room: s.economy.capacity },
    port: { id: tv.port.id, canSend: oilRow?.canSend ?? 0, net: oilRow?.net ?? 0, cartsLeft: tv.port.cartsPerDay - tv.port.carted, owed: contract ? contract.units - contract.delivered - contract.onRoad : 0, canDeliver: contract?.canDeliver ?? 0, onRoad: tv.port.road.filter((r) => r.good === tv.press.makes).reduce((n, r) => n + r.quantity, 0), days: tv.port.days },
  };
}

/** Whether a price is above or below yesterday's, and how a market's stock of a good stands beside its usual stock. */
export type Trend = "up" | "down" | "steady";
export type Demand = "short" | "usual" | "glut";
const trendOf = (now: number, was: number | undefined): Trend => (was === undefined || now === was ? "steady" : now > was ? "up" : "down");
const demandOf = (holds: number, usual: number): Demand => (usual === 0 || (holds * 10 >= usual * 8 && holds * 10 <= usual * 12) ? "usual" : holds < usual ? "short" : "glut");

export interface MarketRow {
  good: string;
  trend: Trend;
  demand: Demand;
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
      trend: trendOf(q.ask, s.priceWas.village?.[good]),
      demand: demandOf(q.inventory, sc.market.goods[good]?.inventory ?? 0),
      have: have(s, good),
      ask: wholeDinars(q.ask),
      bid: wholeDinars(q.bid),
      onOffer: q.inventory,
      canBuy: Math.max(0, Math.min(q.inventory, Math.floor(treasuryOf(s) / q.ask), inYard ? Number.MAX_SAFE_INTEGER : room)),
      canSell: Math.max(0, Math.min(have(s, good) - (s.economy.stock[good]?.reserved ?? 0), q.bid === 0 ? 0 : Math.floor(m.cash / q.bid))),
    };
  });
}

/** Trade beyond the village, as the Economy panel shows it. Null where the scenario has none. */
export interface TradeView {
  /** `days`: how long a load is on the road. `road`: the loads now on it, soonest first. */
  port: { id: string; carted: number; cartsPerDay: number; days: number; road: Array<{ good: string; quantity: number; contract: string | null; inDays: number }>; rows: Array<{ good: string; have: number; bid: number; carriage: number; net: number; canSend: number; trend: Trend; demand: Demand }> };
  press: { cost: number; from: string; makes: string; each: number; canRun: number };
  /** `onRoad`: sent on it and not yet arrived. `sendWithin`: mornings left on which a load sent would still arrive in time; nought or less is too late. */
  contracts: Array<{ id: string; good: string; units: number; delivered: number; onRoad: number; sendWithin: number; state: "offered" | "accepted" | "settled" | "cancelled" | "failed"; daysLeft: number; revenue: number; costs: number; penalty: number; canAccept: boolean; canDeliver: number }>;
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
      days: tr.port.days,
      road: [...s.shipments].sort((a, b) => a.arrives - b.arrives).map((sh) => ({ good: sh.good, quantity: sh.quantity, contract: sh.contract, inDays: Math.max(1, sh.arrives - s.day) })),
      rows: Object.entries(tr.port.carriage).map(([good, carriage]) => {
        const bid = m.goods[good]!.bid;
        return { good, trend: trendOf(m.goods[good]!.ask, s.priceWas[tr.port.id]?.[good]), demand: demandOf(m.goods[good]!.inventory, tr.port.market.goods[good]?.inventory ?? 0), have: have(s, good), bid: wholeDinars(bid), carriage: wholeDinars(carriage), net: wholeDinars(bid - carriage), canSend: Math.max(0, Math.min(free(good), cartsLeft, carriage === 0 ? Number.MAX_SAFE_INTEGER : Math.floor(treasuryOf(s) / carriage))) };
      }),
    },
    press: { cost: wholeDinars(tr.press.cost), from, makes, each, canRun: Math.max(0, Math.min(Math.floor(free(from) / each), tr.press.cost === 0 ? Number.MAX_SAFE_INTEGER : Math.floor(treasuryOf(s) / tr.press.cost))) },
    contracts: tr.contracts.map((def) => {
      const c = s.economy.contracts[def.id]!;
      const daysLeft = def.byDay - s.day + 1;
      const onRoad = s.shipments.reduce((n, sh) => n + (sh.contract === c.id ? sh.quantity : 0), 0);
      const owed = c.units - c.delivered - onRoad;
      const sendWithin = def.byDay - tr.port.days - s.day + 1;
      return {
        id: c.id,
        good: c.good,
        units: c.units,
        delivered: c.delivered,
        onRoad,
        sendWithin,
        state: c.state,
        daysLeft,
        revenue: wholeDinars(c.revenue),
        costs: wholeDinars(c.transport + c.fees),
        penalty: wholeDinars(c.penalty),
        canAccept: c.state === "offered" && sendWithin > 0 && treasuryOf(s) >= c.transport + c.fees,
        canDeliver: c.state === "accepted" && sendWithin > 0 ? Math.max(0, Math.min(owed, have(s, c.good), cartsLeft)) : 0,
      };
    }),
  };
}

/** A question that is open, with each answer's price and gain in figures, and what is in force from answers given. */
export interface DecisionRow {
  id: string;
  /** Mornings left to answer, this one included. */
  daysLeft: number;
  otherwise: string;
  options: Array<{ id: string; dinars: number; inflow: number; welfare: number; days: number }>;
}
export function decisionRows(sc: Scenario, s: VillageState): DecisionRow[] {
  return (sc.decisions ?? [])
    .filter((def) => s.decisions[def.id]?.state === "open")
    .map((def) => ({ id: def.id, daysLeft: s.decisions[def.id]!.day! + def.open - s.day, otherwise: def.otherwise, options: def.options.map((o) => ({ id: o.id, dinars: wholeDinars(o.dinars ?? 0), inflow: o.inflow ?? 0, welfare: o.welfare ?? 0, days: o.days ?? 0 })) }));
}
export function effectRows(s: VillageState): Array<{ kind: "inflow" | "welfare"; amount: number; daysLeft: number; from: string }> {
  return s.effects.filter((e) => e.untilDay >= s.day).map((e) => ({ kind: e.kind, amount: Math.abs(e.amount), daysLeft: e.untilDay - s.day + 1, from: e.from }));
}

export interface QuestRow {
  id: QuestId;
  done: boolean;
  /** How far it has got, where that is a number. */
  progress: { have: number; want: number } | null;
  /** The figures the task itself names (so many dinars, so many households), for its words on the page. */
  values: Record<string, number>;
}

export function questRows(sc: Scenario, s: VillageState): QuestRow[] {
  return tasksOf(sc).map((def) => {
    const now = taskState(sc, s, def);
    const done = Boolean(s.quests[def.id]);
    const values = Object.fromEntries(Object.entries(def).filter((e): e is [string, number] => typeof e[1] === "number"));
    return { id: def.id, done, progress: done || now.have === null ? null : { have: now.have, want: now.want }, values };
  });
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
  for (let d = s.day; d < s.day + days && d <= sc.endDay; d++) out.push({ day: d, season: seasonOf(d), ...flowOn(sc, s, d) });
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

/**
 * What lies ahead if nothing more is done, each line a fact read from the rules run forward on a copy: the day the
 * households first go hungry or short of water, a crop that will begin to spoil, a contract that will fail, and a
 * reserve too small at the scenario's end. It warns; it never plays the game for the player.
 */
export interface Warning {
  key: "warn_hunger" | "warn_thirst" | "warn_spoil" | "warn_spoiling" | "warn_contract" | "warn_reserve" | "warn_unsown";
  /** How many days must pass for it to have happened: one is by tomorrow morning. */
  days: number;
  field?: string;
  have?: number;
  want?: number;
}
export function warnings(sc: Scenario, s: VillageState): Warning[] {
  if (s.outcome) return [];
  const ahead = restOfScenario(sc, s);
  const out: Warning[] = [];
  const first = (test: (x: VillageState) => boolean) => ahead.findIndex(test);
  const hungry = first((x) => x.last!.eaten < x.last!.foodNeed);
  if (hungry >= 0) out.push({ key: "warn_hunger", days: hungry + 1 });
  const thirsty = first((x) => x.last!.townWater < x.last!.townNeed);
  if (thirsty >= 0) out.push({ key: "warn_thirst", days: thirsty + 1 });
  for (const def of sc.plots) {
    const day = first((x) => x.last!.events.some((e) => e.startsWith(`spoiled:${def.id}:`)));
    // A crop already spoiling is said to be spoiling, not about to begin.
    if (day >= 0) out.push(s.plots[def.id]!.spoiled > 0 ? { key: "warn_spoiling", days: 0, field: def.id } : { key: "warn_spoil", days: day + 1, field: def.id });
  }
  for (const c of Object.values(s.economy.contracts)) {
    if (c.state !== "accepted") continue;
    const day = first((x) => x.last!.events.includes(`contract-failed:${c.id}`));
    if (day >= 0) out.push({ key: "warn_contract", days: day + 1, have: c.delivered, want: c.units });
  }
  const end = ahead.at(-1);
  if (end && reserveDays(end) < sc.goal.reserveDays) out.push({ key: "warn_reserve", days: ahead.length, have: reserveDays(end), want: sc.goal.reserveDays });
  // Where another year follows, what is in the ground at this one's end is next spring's bread: from autumn on, an
  // unsown valley is said so, while there is still time to sow or to know.
  if (end && scenarioAfter(sc.id) && seasonOf(s.day) >= 2 && !Object.values(end.plots).some((p) => p.crop === "wheat" && p.standing === 0 && p.ripeSince === null)) out.push({ key: "warn_unsown", days: ahead.length });
  return out.sort((a, b) => a.days - b.days);
}
/**
 * How much food could leave the store and still leave, by the forecast, the reserve the scenario asks for at its
 * end. Nought when the forecast is already short.
 */
export function foodToSpare(sc: Scenario, s: VillageState): number {
  const end = restOfScenario(sc, s).at(-1) ?? s;
  return Math.max(0, foodInStore(end) - sc.goal.reserveDays * foodNeed(end));
}
/**
 * What a won year hands to the next: the people, the money, the food, and what is in the ground for the spring.
 * Null where no year follows.
 */
export function carryOver(sc: Scenario, s: VillageState): { households: number; dinars: number; foodDays: number; sown: string[] } | null {
  if (!scenarioAfter(sc.id)) return null;
  return { households: s.households, dinars: wholeDinars(treasuryOf(s)), foodDays: reserveDays(s), sown: sc.plots.filter((def) => s.plots[def.id]!.crop !== null && s.plots[def.id]!.crop !== "olives" && s.plots[def.id]!.ripeSince === null).map((def) => def.id) };
}

/** The season in figures: the river against what the valley wants today, how the fields fared yesterday, and winter. */
export function seasonFigures(sc: Scenario, s: VillageState): { inflow: number; wanted: number; fields: number | null; toWinter: number } {
  const today = flowOn(sc, s, s.day);
  const growing = sc.plots.map((def) => s.plots[def.id]!).filter((p) => p.crop !== null && p.ripeSince === null);
  // Yesterday's fields: what grew yesterday, so not a field sown since, and with one that ripened only yesterday.
  const grewYesterday = sc.plots.map((def) => s.plots[def.id]!).filter((p) => p.crop !== null && (p.ripeSince === null ? p.growth > 0 : p.ripeSince === s.day - 1));
  const wanted = waterNeed(s) + growing.reduce((n, p) => n + (today.rain ? Math.ceil(CROPS[p.crop!].water / 2) : CROPS[p.crop!].water), 0);
  return {
    inflow: today.inflow,
    wanted,
    fields: grewYesterday.length && s.last ? Math.round(grewYesterday.reduce((n, p) => n + (p.watered * p.tended) / 1000, 0) / grewYesterday.length / 10) : null,
    toWinter: Math.max(0, 91 - s.day),
  };
}

/** Yesterday's water and food, for the line that says how the day went. */
export function yesterday(s: VillageState): { rain: boolean; inflow: number; townWater: number; townNeed: number; eaten: number; foodNeed: number; workers: number; idle: number; events: string[] } | null {
  return s.last ? { rain: s.last.rain, inflow: s.last.inflow, townWater: s.last.townWater, townNeed: s.last.townNeed, eaten: s.last.eaten, foodNeed: s.last.foodNeed, workers: s.last.workers, idle: s.last.idle, events: s.last.events } : null;
}
export const needs = (s: VillageState): { food: number; water: number } => ({ food: foodNeed(s), water: waterNeed(s) });
