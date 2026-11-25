// Granada's authored scenarios. Every figure is a game number chosen for play and tuned in the lab
// (tools/village-lab.ts); none is a historical measurement.
import { dinars } from "./economy";
import type { Scenario } from "./village";

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
};

export const SCENARIOS: Record<string, Scenario> = { [WATER_FOR_THE_VALLEY.id]: WATER_FOR_THE_VALLEY };
