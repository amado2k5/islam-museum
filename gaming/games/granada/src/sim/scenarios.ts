// Granada's authored scenarios. Every figure is a game number chosen for play and tuned in the lab
// (tools/village-lab.ts); none is a historical measurement.
import { dinars } from "./economy";
import type { Scenario } from "./village";
import { siteRefusal } from "../world/ground";

/**
 * Act I, "Water for the Valley". Late spring: a wheat field stands ripe, an olive terrace is thirsty behind a
 * broken branch, a meadow by the river has never been watered, and the store is nearly full. By the end of winter
 * the district is to be fed, housed and watered.
 */
export const WATER_FOR_THE_VALLEY: Scenario = {
  id: "water-for-the-valley",
  startDay: 25,
  endDay: 120,
  households: 60,
  housing: 60,
  treasury: dinars(1200),
  capacity: 420,
  yard: ["timber", "stone"],
  stock: { wheat: 220, timber: 120, stone: 80 },
  market: {
    cash: dinars(2500),
    goods: {
      wheat: { inventory: 600, ask: dinars(26), bid: dinars(18) },
      olives: { inventory: 40, ask: dinars(39), bid: dinars(28) },
      vegetables: { inventory: 120, ask: dinars(19), bid: dinars(12) },
      timber: { inventory: 200, ask: dinars(14), bid: dinars(9) },
      stone: { inventory: 200, ask: dinars(20), bid: dinars(13) },
    },
  },
  plots: [
    { id: "mill-field", branch: "west", potential: { wheat: 320, vegetables: 200 }, crop: "wheat", growth: 1000 },
    { id: "olive-terrace", branch: "east", potential: { olives: 50 }, crop: "olives", growth: 300 },
    { id: "river-meadow", branch: "meadow", potential: { vegetables: 240, wheat: 300 }, crop: null, growth: 0 },
  ],
  water: {
    inflow: [70, 26, 46, 60],
    rainChance: [22, 5, 18, 30],
    rainBonus: 30,
    pool: 150,
    poolCapacity: 300,
    branches: [
      { id: "west", capacity: 20, condition: 100, built: true },
      { id: "east", capacity: 20, condition: 25, built: true },
      { id: "meadow", capacity: 24, condition: 0, built: false },
    ],
  },
  works: {
    repair: { branch: "east", to: 70, cost: dinars(140), timber: 0, stone: 10, labour: 12 },
    expand: { restores: "east", opens: "meadow", cost: dinars(420), timber: 20, stone: 40, labour: 40 },
    house: { housing: 10, sites: 4, cost: dinars(160), timber: 30, stone: 0, labour: 20 },
    granary: { capacity: 500, sites: 1, cost: dinars(240), timber: 40, stone: 30, labour: 30 },
  },
  goal: { welfare: 60, households: 60, reserveDays: 20 },
  reward: dinars(40),
  // What the steward can place on the land. A house and a granary cost what they do on the prepared lots; a cistern
  // lets the pool hold more for the dry months; a garden is a little ease for the households.
  catalogue: {
    house: { category: "housing", cost: dinars(160), timber: 30, stone: 0, labour: 20, radius: 9, max: 6, housing: 10 },
    granary: { category: "agriculture", cost: dinars(240), timber: 40, stone: 30, labour: 30, radius: 13, max: 2, capacity: 500 },
    cistern: { category: "infrastructure", cost: dinars(180), timber: 0, stone: 40, labour: 24, radius: 10, max: 2, pool: 60 },
    garden: { category: "gardens", cost: dinars(90), timber: 10, stone: 10, labour: 10, radius: 10, max: 3, welfare: 2 },
  },
  site: siteRefusal,
  // Prices move by up to fifteen parts in a hundred with what a market holds, and a market goes an eighth of the
  // way back to its usual stock each night. Fifteen is small enough that no market ever pays more than it asks.
  // Olives move less: at the full swing, olives bought cheap from a glutted village could be pressed for more than they cost.
  prices: { swing: 150, drift: 120, swings: { olives: 50 } },
  // In the heat of summer the village downstream asks for water. To share is to be paid and to run short; to refuse
  // costs nothing in dinars and something in how the households fare. Fiction, and the panel says so.
  decisions: [
    {
      id: "water-for-the-neighbours",
      day: 40,
      open: 5,
      otherwise: "refuse",
      options: [
        { id: "share", dinars: dinars(220), inflow: 8, days: 20 },
        { id: "refuse", welfare: -4, days: 20 },
      ],
    },
  ],
  // A port on the coast, a few days off by cart. It pays less than the village asks for the same grain, so nothing
  // bought here is worth carrying there; what it wants is oil, which the valley can press and the village cannot.
  // Fiction: the name is a real port's, the prices, the buyer and the contract are invented for play.
  trade: {
    port: {
      id: "malaga",
      market: {
        cash: dinars(6000),
        // What the port usually holds; it pays less for what it has more of, and comes back to this of itself.
        goods: {
          wheat: { inventory: 150, ask: dinars(40), bid: dinars(22) },
          olives: { inventory: 40, ask: dinars(60), bid: dinars(34) },
          oil: { inventory: 12, ask: dinars(300), bid: dinars(190) },
        },
      },
      carriage: { wheat: dinars(2), olives: dinars(3), oil: dinars(4) },
      cartsPerDay: 60,
      // Three days by cart: Málaga is some ninety kilometres off in a straight line, and no road is straight.
      days: 3,
    },
    // Five measures of olives to one of oil; the pressing is paid for each run.
    press: { id: "olive-press", inputs: { olives: 5 }, outputs: { oil: 1 }, cost: dinars(12) },
    contracts: [{ id: "oil-for-the-port", good: "oil", units: 8, byDay: 95, revenue: dinars(1680), transport: dinars(32), fees: dinars(20), penalty: dinars(300) }],
  },
};

/**
 * The second year, "The Merchants of Málaga": a whole year, from the first day of spring. The valley is fed; now it
 * is asked to trade. The port offers two contracts, for oil and for vegetables; the steward is asked to bring in
 * 1,600 dinars by trade, keep at least one of the two, house eighty households, build a cistern and hold the
 * winter reserve. Taking both pays more and leaves less to eat.
 * It follows the first year: a steward who won that goes on with the valley as it stands. Opened fresh (as the lab
 * and the tests open it), it begins from a valley much as a first year leaves one.
 */
export const MERCHANTS_OF_MALAGA: Scenario = {
  ...WATER_FOR_THE_VALLEY,
  id: "merchants-of-malaga",
  follows: WATER_FOR_THE_VALLEY.id,
  startDay: 1,
  endDay: 120,
  households: 70,
  housing: 70,
  treasury: dinars(900),
  capacity: 920,
  stock: { wheat: 300, timber: 80, stone: 60 },
  plots: [
    // Sown last autumn, and half grown.
    { id: "mill-field", branch: "west", potential: { wheat: 320, vegetables: 200 }, crop: "wheat", growth: 500 },
    { id: "olive-terrace", branch: "east", potential: { olives: 50 }, crop: "olives", growth: 0 },
    { id: "river-meadow", branch: "meadow", potential: { vegetables: 240, wheat: 300 }, crop: null, growth: 0 },
  ],
  water: { ...WATER_FOR_THE_VALLEY.water, branches: WATER_FOR_THE_VALLEY.water.branches.map((b) => (b.id === "east" ? { ...b, condition: 70 } : b)) },
  goal: { welfare: 60, households: 70, reserveDays: 20 },
  trade: {
    ...WATER_FOR_THE_VALLEY.trade!,
    port: {
      ...WATER_FOR_THE_VALLEY.trade!.port,
      market: { ...WATER_FOR_THE_VALLEY.trade!.port.market, goods: { ...WATER_FOR_THE_VALLEY.trade!.port.market.goods, vegetables: { inventory: 80, ask: dinars(30), bid: dinars(17) } } },
      carriage: { ...WATER_FOR_THE_VALLEY.trade!.port.carriage, vegetables: dinars(2) },
    },
    // Neither is worth filling with goods bought in the village: each pays less a unit than the village asks.
    contracts: [
      { id: "oil-for-the-port-2", good: "oil", units: 12, byDay: 100, revenue: dinars(2460), transport: dinars(48), fees: dinars(30), penalty: dinars(400) },
      { id: "greens-for-the-port", good: "vegetables", units: 120, byDay: 80, revenue: dinars(2100), transport: dinars(200), fees: dinars(20), penalty: dinars(300) },
    ],
  },
  tasks: [
    { id: "m1-trade", kind: "trade", dinars: 1600 },
    { id: "m2-contracts", kind: "contracts", kept: 1 },
    { id: "m3-households", kind: "households", atLeast: 80 },
    { id: "m4-cistern", kind: "placed", what: "cistern", n: 1 },
    { id: "m5-reserve", kind: "reserve-streak" },
  ],
  // The neighbours ask again, later in the summer and for less, and offer more: the valley now has more to lose.
  decisions: [{ ...WATER_FOR_THE_VALLEY.decisions![0]!, day: 45, options: [{ id: "share", dinars: dinars(300), inflow: 5, days: 15 }, { id: "refuse", welfare: -4, days: 20 }] }],
};

/**
 * The third year, "A Dry Year": the river runs at about three quarters of a usual year and it rains less. The valley
 * is asked to hold two cisterns, to keep its households faring well for sixty days running, to go on trading a
 * little, to keep the port's one contract and to hold the winter's food. The neighbours ask for water again, for
 * more dinars, and refusing costs more goodwill. Opened fresh, it begins from a valley much as a second year leaves
 * one, with the meadow watered and no cistern.
 */
export const A_DRY_YEAR: Scenario = {
  ...MERCHANTS_OF_MALAGA,
  id: "a-dry-year",
  follows: MERCHANTS_OF_MALAGA.id,
  final: true,
  households: 80,
  housing: 80,
  treasury: dinars(1200),
  capacity: 920,
  stock: { wheat: 360, timber: 60, stone: 80 },
  water: {
    ...MERCHANTS_OF_MALAGA.water,
    inflow: [52, 19, 34, 45],
    rainChance: [15, 3, 13, 23],
    branches: MERCHANTS_OF_MALAGA.water.branches.map((b) => ({ ...b, condition: 100, built: true })),
  },
  goal: { welfare: 60, households: 80, reserveDays: 20 },
  trade: {
    ...MERCHANTS_OF_MALAGA.trade!,
    contracts: [{ id: "oil-for-the-port-3", good: "oil", units: 8, byDay: 100, revenue: dinars(1640), transport: dinars(32), fees: dinars(20), penalty: dinars(300) }],
  },
  tasks: [
    { id: "d1-cisterns", kind: "placed", what: "cistern", n: 2 },
    { id: "d2-welfare", kind: "welfare-streak", atLeast: 65, days: 60 },
    { id: "d3-trade", kind: "trade", dinars: 700 },
    { id: "d4-contract", kind: "contracts", kept: 1 },
    { id: "d5-reserve", kind: "reserve-streak" },
  ],
  decisions: [{ ...WATER_FOR_THE_VALLEY.decisions![0]!, day: 40, options: [{ id: "share", dinars: dinars(400), inflow: 6, days: 20 }, { id: "refuse", welfare: -6, days: 20 }] }],
};

export const SCENARIOS: Record<string, Scenario> = { [WATER_FOR_THE_VALLEY.id]: WATER_FOR_THE_VALLEY, [MERCHANTS_OF_MALAGA.id]: MERCHANTS_OF_MALAGA, [A_DRY_YEAR.id]: A_DRY_YEAR };
/** The scenario that follows one, where the campaign goes on. */
export const scenarioAfter = (id: string): Scenario | null => Object.values(SCENARIOS).find((sc) => sc.follows === id) ?? null;
