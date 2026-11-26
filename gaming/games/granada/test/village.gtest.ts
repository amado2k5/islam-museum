// Granada's first scenario, "Water for the Valley", as rules: water, fields, hands, households, works, quests.
import { describe, expect, it } from "vitest";
import { audit, dinars, freeCapacity } from "../src/sim/economy";
import { PLAYERS, REAL_PLAYERS, playVillage } from "../src/sim/players";
import { A_DRY_YEAR as Y3, MERCHANTS_OF_MALAGA as Y2, SCENARIOS, WATER_FOR_THE_VALLEY as SC, scenarioAfter } from "../src/sim/scenarios";
import { siteRefusal } from "../src/world/ground";
import { CROPS, HARVEST_RATE, QUESTS, wholeDinar, nextYear, taskState, tasksOf, tradeSince, expectedHarvest, flowOn, housesBuilt, marketsOf, priceFactor, poolCapacityOf, siteOf, act, carries, foodNeed, forecast, invariants, newVillage, preview, reserveDays, riverYear, seasonOf, tick, treasuryOf, waterNeed, weather, workersOf, type Scenario, type VillageCommand, type VillageState } from "../src/sim/village";

const start = (seed = 7) => newVillage(SC, seed);
/** Applies commands, failing the test if one is refused. */
function order(sc: Scenario, s: VillageState, ...commands: VillageCommand[]): VillageState {
  for (const c of commands) {
    const r = act(sc, s, c);
    if (!r.result.ok) throw new Error(`${JSON.stringify(c)} was refused: ${r.result.why}`);
    s = r.state;
  }
  return s;
}
const days = (sc: Scenario, s: VillageState, n: number): VillageState => {
  for (let i = 0; i < n && !s.outcome; i++) {
    s = tick(sc, s);
    expect(invariants(sc, s), `day ${s.day - 1}`).toEqual([]);
  }
  return s;
};
const stock = (s: VillageState, good: string) => s.economy.stock[good]?.quantity ?? 0;
/** The same valley with no rain and a river that gives exactly what the scenario says, for exact sums. */
const DRY: Scenario = { ...SC, water: { ...SC.water, rainChance: [0, 0, 0, 0] } };

describe("the valley at the start", () => {
  it("has 24 workers, eats 6 a day, drinks 10, and holds 36 days of grain", () => {
    const s = start();
    expect([workersOf(s), foodNeed(s), waterNeed(s), reserveDays(s)]).toEqual([24, 6, 10, 36]);
    expect(s.day).toBe(25);
    expect(seasonOf(25)).toBe(0);
    expect(seasonOf(31)).toBe(1);
    expect(seasonOf(120)).toBe(3);
    expect(treasuryOf(s)).toBe(dinars(1200));
    expect(freeCapacity(s.economy)).toBe(200);
    expect(invariants(SC, s)).toEqual([]);
  });

  it("has a ripe wheat field, a thirsty olive terrace behind a broken branch, and a meadow no water reaches", () => {
    const s = start();
    expect(s.plots["mill-field"]).toMatchObject({ crop: "wheat", ripeSince: 25, standing: 320, yielded: 320 });
    expect(s.plots["olive-terrace"]).toMatchObject({ crop: "olives", growth: 300, ripeSince: null });
    expect(s.plots["river-meadow"]!.crop).toBeNull();
    expect(carries(s.branches.west!)).toBe(20);
    expect(carries(s.branches.east!)).toBe(5);
    expect(carries(s.branches.meadow!)).toBe(0);
    expect(CROPS.olives.water).toBe(10);
  });
});

describe("weather", () => {
  it("is fixed by the seed and the day, so tomorrow can be shown today", () => {
    for (const day of [25, 40, 77, 119]) expect(weather(SC, 7, day)).toEqual(weather(SC, 7, day));
    const a = Array.from({ length: 96 }, (_, i) => weather(SC, 7, 25 + i).inflow).join(",");
    const b = Array.from({ length: 96 }, (_, i) => weather(SC, 8, 25 + i).inflow).join(",");
    expect(a).not.toBe(b);
  });

  it("gives a river between three quarters and five quarters of a usual year", () => {
    const seen = new Set<number>();
    for (let seed = 1; seed <= 400; seed++) {
      for (const season of [0, 1, 2, 3] as const) {
        const f = riverYear(seed, season);
        expect(f).toBeGreaterThanOrEqual(75);
        expect(f).toBeLessThanOrEqual(125);
        seen.add(f);
      }
    }
    // Thin years and full years both happen.
    expect(Math.min(...seen)).toBe(75);
    expect(Math.max(...seen)).toBe(125);
  });
});

describe("water", () => {
  it("reaches the olives at half strength through the broken branch, and in full once it is repaired", () => {
    let s = days(DRY, newVillage(DRY, 7), 1);
    expect(s.plots["olive-terrace"]!.watered).toBe(500);
    expect(s.last).toMatchObject({ townWater: 10, townNeed: 10 });
    s = order(DRY, s, { kind: "repair" });
    expect(treasuryOf(s)).toBe(dinars(1200 + 3 - 140));
    expect(stock(s, "stone")).toBe(70);
    // Twelve worker-days at six hands a day: finished at the end of the second day.
    s = days(DRY, s, 2);
    expect(s.built.repaired).toBe(true);
    expect(carries(s.branches.east!)).toBe(14);
    s = days(DRY, s, 1);
    expect(s.plots["olive-terrace"]!.watered).toBe(1000);
  });

  it("never lets the pool go below empty or above its brim", () => {
    const thirsty: Scenario = { ...DRY, water: { ...DRY.water, inflow: [3, 3, 3, 3], pool: 40 } };
    let s = newVillage(thirsty, 3);
    for (let i = 0; i < 30; i++) {
      s = tick(thirsty, s);
      expect(s.pool).toBeGreaterThanOrEqual(0);
      expect(invariants(thirsty, s)).toEqual([]);
    }
    expect(s.pool).toBe(0);
    const wet: Scenario = { ...DRY, water: { ...DRY.water, inflow: [900, 900, 900, 900] } };
    expect(days(wet, newVillage(wet, 3), 5).pool).toBe(wet.water.poolCapacity);
  });

  it("goes to the households first or to the fields first, as the player has said", () => {
    // Eight units a day and an empty pool: not enough for both the ten the households want and the olives.
    const scarce: Scenario = { ...DRY, water: { ...DRY.water, inflow: [8, 8, 8, 8], pool: 0 } };
    const homes = tick(scarce, newVillage(scarce, 3));
    expect(homes.last).toMatchObject({ townWater: 8, townNeed: 10 });
    expect(homes.plots["olive-terrace"]!.watered).toBe(0);
    const fields = tick(scarce, order(scarce, newVillage(scarce, 3), { kind: "water-first", who: "fields" }));
    expect(fields.plots["olive-terrace"]!.watered).toBe(500);
    expect(fields.last).toMatchObject({ townWater: 3, townNeed: 10 });
    expect(fields.last!.events).toContain("thirsty:7");
  });

  it("costs a thirsty crop part of its yield, and never more than it had", () => {
    const watered = days(DRY, order(DRY, newVillage(DRY, 7), { kind: "expand" }), 60);
    const parched = days(DRY, newVillage(DRY, 7), 60);
    const a = watered.plots["olive-terrace"]!;
    const b = parched.plots["olive-terrace"]!;
    expect(a.ripeSince).not.toBeNull();
    expect(a.yielded).toBeGreaterThan(44);
    // Half water: half speed, so it is not ripe yet, and it has lost yield on the way.
    expect(b.ripeSince).toBeNull();
    expect(b.stress).toBeGreaterThan(a.stress + 200);
  });
});

describe("works", () => {
  it("are paid for through the ledger, take the days their labour takes, and then change the valley", () => {
    let s = order(SC, start(), { kind: "build", what: "granary" });
    expect(treasuryOf(s)).toBe(dinars(1200 - 240));
    expect([stock(s, "timber"), stock(s, "stone")]).toEqual([80, 50]);
    expect(s.works).toHaveLength(1);
    expect(s.economy.journal.filter((e) => e.why === "building a granary").map((e) => e.asset).sort()).toEqual(["money", "stone", "timber"]);
    const free = freeCapacity(s.economy);
    // Thirty worker-days at six a day.
    s = days(SC, s, 4);
    expect(s.built.granary).toBe(0);
    s = days(SC, s, 1);
    expect(s.built.granary).toBe(1);
    expect(s.last!.events).toContain("built:granary");
    expect(freeCapacity(s.economy)).toBeGreaterThanOrEqual(free + 500 - 5 * 6);
    expect(preview(SC, s, { kind: "build", what: "granary" })).toEqual({ ok: false, why: "no-site" });
  });

  it("refuse what cannot be afforded, what is done, and what is already under way", () => {
    const poor: Scenario = { ...SC, treasury: dinars(100) };
    expect(preview(poor, newVillage(poor, 1), { kind: "repair" })).toMatchObject({ ok: false, why: "no-money" });
    const bare: Scenario = { ...SC, stock: { ...SC.stock, stone: 5 } };
    expect(preview(bare, newVillage(bare, 1), { kind: "repair" })).toMatchObject({ ok: false, why: "no-materials", detail: { stone: 5 } });
    const s = order(SC, start(), { kind: "repair" });
    expect(preview(SC, s, { kind: "repair" })).toEqual({ ok: false, why: "already-under-way" });
    expect(preview(SC, s, { kind: "expand" })).toEqual({ ok: false, why: "already-under-way" });
    const done = days(SC, s, 3);
    expect(preview(SC, done, { kind: "repair" })).toEqual({ ok: false, why: "already-done" });
    // The great works can still follow a cheap repair.
    expect(preview(SC, done, { kind: "expand" }).ok).toBe(true);
  });

  it("open the meadow only through the great works, and a field takes only what can grow there, in its season", () => {
    const s = start();
    expect(preview(SC, s, { kind: "plant", plot: "river-meadow", crop: "vegetables" })).toEqual({ ok: false, why: "no-water-branch" });
    expect(preview(SC, s, { kind: "plant", plot: "olive-terrace", crop: "vegetables" })).toEqual({ ok: false, why: "not-fallow" });
    expect(preview(SC, s, { kind: "plant", plot: "nowhere", crop: "wheat" })).toEqual({ ok: false, why: "unknown-plot" });
    let opened = days(SC, order(SC, s, { kind: "expand" }), 8);
    expect(opened.built.expanded).toBe(true);
    expect(carries(opened.branches.meadow!)).toBe(24);
    expect(carries(opened.branches.east!)).toBe(20);
    expect(preview(SC, opened, { kind: "plant", plot: "river-meadow", crop: "olives" })).toEqual({ ok: false, why: "cannot-grow-here" });
    // Wheat is sown in autumn; it is summer.
    expect(preview(SC, opened, { kind: "plant", plot: "river-meadow", crop: "wheat" })).toEqual({ ok: false, why: "wrong-season" });
    opened = order(SC, opened, { kind: "plant", plot: "river-meadow", crop: "vegetables" });
    expect(opened.plots["river-meadow"]).toMatchObject({ crop: "vegetables", growth: 0 });
  });

  it("house more households, who come when the valley fares well", () => {
    let s = order(SC, start(), { kind: "harvest", plot: "mill-field", rest: "sell" }, { kind: "repair" }, { kind: "build", what: "house" });
    s = days(SC, s, 40);
    expect(s.built.house).toBe(1);
    expect(s.housing).toBe(70);
    expect(s.households).toBeGreaterThan(60);
    expect(s.households).toBeLessThanOrEqual(70);
    expect(s.quests["q04-home"]).toBe(true);
  });
});

describe("the harvest", () => {
  it("is brought in by hand a little each day, and waits in the field when the store is full", () => {
    let s = order(SC, start(), { kind: "harvest", plot: "mill-field", rest: "wait" });
    s = tick(SC, s);
    const p = s.plots["mill-field"]!;
    // There is room for 200. Twenty-four workers could carry more than that in a day.
    expect(24 * HARVEST_RATE).toBeGreaterThan(200);
    expect(p).toMatchObject({ brought: 200, standing: 120, soldFromField: 0, spoiled: 0, harvesting: "wait" });
    expect(s.last!.events).toContain("store-full:mill-field");
    expect(s.everFull).toBe(true);
    // The households eat six a day, so six more fit each day; nothing is lost while the window lasts.
    s = days(SC, s, 5);
    expect(s.plots["mill-field"]).toMatchObject({ brought: 230, standing: 90, spoiled: 0 });
    expect(invariants(SC, s)).toEqual([]);
  });

  it("sells from the field what will not fit, at the price the market pays, when told to", () => {
    const before = start();
    const s = tick(SC, order(SC, before, { kind: "harvest", plot: "mill-field", rest: "sell" }));
    expect(s.plots["mill-field"]).toMatchObject({ brought: 200, soldFromField: 120, standing: 0, harvesting: null });
    // The sale, the day's levy, and the reward for a first harvest fully accounted for.
    expect(treasuryOf(s) - treasuryOf(before)).toBe(120 * dinars(18) + dinars(3) + SC.reward);
    expect(s.last!.events).toContain("harvested:mill-field");
    expect(s.quests["q02-harvest"]).toBe(true);
  });

  it("spoils if it is left standing past its time, and a crop left to rot is no harvest", () => {
    let s = days(SC, start(), 14);
    expect(s.plots["mill-field"]!.spoiled).toBe(0);
    s = days(SC, s, 2);
    expect(s.plots["mill-field"]!.spoiled).toBeGreaterThan(30);
    expect(s.last!.events.some((e) => e.startsWith("spoiled:mill-field:"))).toBe(true);
    s = days(SC, s, 60);
    const p = s.plots["mill-field"]!;
    expect(p.standing).toBe(0);
    expect(p.spoiled).toBe(320);
    expect(s.quests["q02-harvest"]).toBe(false);
  });

  it("cannot be ordered from a field that is not ripe", () => {
    expect(preview(SC, start(), { kind: "harvest", plot: "olive-terrace", rest: "wait" })).toEqual({ ok: false, why: "not-ripe" });
    expect(preview(SC, start(), { kind: "harvest", plot: "river-meadow", rest: "wait" })).toEqual({ ok: false, why: "not-ripe" });
  });
});

describe("households", () => {
  it("go hungry when the store is empty, fare worse for it, and begin to leave", () => {
    const bare: Scenario = { ...SC, stock: { ...SC.stock, wheat: 12 }, plots: SC.plots.map((p) => (p.id === "mill-field" ? { ...p, crop: null, growth: 0 } : p)) };
    let s = days(bare, newVillage(bare, 5), 2);
    expect(s.last).toMatchObject({ eaten: 6, foodNeed: 6 });
    s = days(bare, s, 1);
    expect(s.last).toMatchObject({ eaten: 0, foodNeed: 6 });
    expect(s.last!.events).toContain("hungry:6");
    const before = s.welfare;
    s = days(bare, s, 30);
    expect(s.welfare).toBeLessThan(before - 20);
    expect(s.households).toBeLessThan(60);
    expect(invariants(bare, s)).toEqual([]);
  });

  it("eat what spoils soonest first", () => {
    const mixed: Scenario = { ...SC, stock: { ...SC.stock, wheat: 100, vegetables: 4 } };
    const s = tick(mixed, newVillage(mixed, 5));
    expect([stock(s, "vegetables"), stock(s, "wheat")]).toEqual([0, 98]);
  });

  it("can be fed from the market, at the price the market asks", () => {
    const before = start();
    const s = order(SC, before, { kind: "sell", good: "wheat", quantity: 30 }, { kind: "buy", good: "wheat", quantity: 10 });
    expect(treasuryOf(s) - treasuryOf(before)).toBe(30 * dinars(18) - 10 * dinars(26));
    expect(preview(SC, s, { kind: "sell", good: "wheat", quantity: 9999 })).toMatchObject({ ok: false, why: "not-enough" });
    expect(preview(SC, s, { kind: "buy", good: "wheat", quantity: 100 })).toMatchObject({ ok: false, why: "no-money" });
    expect(preview(SC, s, { kind: "buy", good: "saffron", quantity: 1 })).toEqual({ ok: false, why: "unknown-good" });
    expect(preview(SC, s, { kind: "buy", good: "wheat", quantity: 0 })).toEqual({ ok: false, why: "bad-quantity" });
    expect(audit(s.economy)).toEqual([]);
  });
});

describe("quests", () => {
  it("are not finished by rain alone: the branch must be mended", () => {
    const rainy: Scenario = { ...SC, water: { ...SC.water, rainChance: [100, 100, 100, 100] } };
    const s = days(rainy, newVillage(rainy, 2), 10);
    // In the rain the olives want five, and the broken branch carries five.
    expect(s.plots["olive-terrace"]!.watered).toBe(1000);
    expect(s.quests["q01-water"]).toBe(false);
    const mended = days(rainy, order(rainy, newVillage(rainy, 2), { kind: "repair" }), 6);
    expect(mended.quests["q01-water"]).toBe(true);
  });

  it("pay their reward once, however long the game goes on", () => {
    const s = days(SC, order(SC, start(), { kind: "harvest", plot: "mill-field", rest: "sell" }, { kind: "repair" }), 60);
    expect(s.quests["q01-water"]).toBe(true);
    expect(s.quests["q02-harvest"]).toBe(true);
    for (const q of ["q01-water", "q02-harvest"]) {
      const paid = s.economy.journal.filter((e) => e.why === `quest ${q}`);
      expect(paid).toHaveLength(1);
      expect(paid[0]!.amount).toBe(SC.reward);
    }
  });

  it("count the reserve only as winter approaches, so last year's grain does not finish it in spring", () => {
    const s = days(SC, start(), 20);
    expect(reserveDays(s)).toBeGreaterThanOrEqual(15);
    expect(s.streak.reserve).toBe(0);
    expect(s.quests["q03-reserve"]).toBe(false);
  });
});

describe("the end of the scenario", () => {
  it("is a loss, with its reasons, for a steward who does nothing", () => {
    const end = playVillage(SC, start(), PLAYERS.idle!, 7).state;
    expect(end.day).toBe(SC.endDay + 1);
    expect(end.outcome!.won).toBe(false);
    for (const q of QUESTS) expect(end.outcome!.reasons).toContain(q);
    expect(end.outcome!.reasons).toContain("reserve");
    expect(act(SC, end, { kind: "repair" }).result).toEqual({ ok: false, why: "over" });
    expect(tick(SC, end)).toBe(end);
  });

  it("is a win for a steward who mends the branch, brings in the crops and builds", () => {
    const c = playVillage(SC, start(), PLAYERS.mender!, 7);
    expect(c.violations).toEqual([]);
    expect(c.state.outcome).toMatchObject({ won: true, reasons: [] });
    expect(Object.values(c.state.quests).every(Boolean)).toBe(true);
    expect(c.state.outcome!.score).toBeGreaterThan(1000);
  });
});

describe("trade beyond the village", () => {
  const T = DRY.trade!;
  /** A valley with olives already in the store, to press and send. */
  const withOlives = (n: number): VillageState => newVillage({ ...DRY, stock: { ...DRY.stock, olives: n } }, 7);

  it("presses five measures of olives into one of oil, for the price of the pressing", () => {
    const s = order(DRY, withOlives(23), { kind: "press", runs: 4 });
    expect([stock(s, "olives"), stock(s, "oil")]).toEqual([3, 4]);
    expect(treasuryOf(s)).toBe(dinars(1200) - 4 * T.press.cost);
    expect(act(DRY, s, { kind: "press", runs: 1 }).result).toMatchObject({ ok: false, why: "not-enough" });
    expect(audit(s.economy)).toEqual([]);
  });

  it("sends a load on a road of three days: the carriage is paid as it leaves, and the port pays on the morning it arrives", () => {
    const a = order(DRY, withOlives(20), { kind: "press", runs: 4 });
    const r = act(DRY, a, { kind: "send", good: "oil", quantity: 4 });
    expect(r.result).toEqual({ ok: true, money: -4 * dinars(4) });
    let s = r.state;
    expect([stock(s, "oil"), s.shipments]).toEqual([0, [{ id: s.shipments[0]!.id, good: "oil", quantity: 4, contract: null, arrives: a.day + T.port.days }]]);
    expect(treasuryOf(a) - treasuryOf(s)).toBe(4 * dinars(4));
    expect(invariants(DRY, s)).toEqual([]);
    // Nothing is paid while it travels.
    s = days(DRY, s, T.port.days);
    expect(s.shipments).toHaveLength(1);
    expect(s.economy.markets.malaga!.goods.oil!.inventory).toBe(T.port.market.goods.oil!.inventory);
    // The morning it arrives: sold at what the port pays that morning, and said so.
    const before = treasuryOf(s);
    s = days(DRY, s, 1);
    expect(s.shipments).toEqual([]);
    expect(s.last!.events).toContain(`sold-at-port:oil:4:${4 * dinars(190)}`);
    expect(treasuryOf(s) - before).toBeGreaterThanOrEqual(4 * dinars(190));
    expect(s.economy.markets.malaga!.goods.oil!.inventory).toBeGreaterThan(T.port.market.goods.oil!.inventory);
    expect(audit(s.economy)).toEqual([]);
  });

  it("sends no more in a day than the carts can take, and the carts are back in the morning", () => {
    let s = order(DRY, start(), { kind: "send", good: "wheat", quantity: T.port.cartsPerDay });
    const more = act(DRY, s, { kind: "send", good: "wheat", quantity: 1 });
    expect(more.result).toMatchObject({ ok: false, why: "carts-full", detail: { left: 0 } });
    expect(more.state).toBe(s);
    s = days(DRY, s, 1);
    expect(s.carted).toBe(0);
    order(DRY, s, { kind: "send", good: "wheat", quantity: 1 });
  });

  it("refuses a load before a dinar of carriage is spent, when the port or the store cannot meet it", () => {
    const s = start();
    for (const c of [{ kind: "send", good: "oil", quantity: 1 }, { kind: "send", good: "timber", quantity: 1 }, { kind: "send", good: "wheat", quantity: 0 }] as VillageCommand[]) {
      const r = act(DRY, s, c);
      expect(r.result.ok, JSON.stringify(c)).toBe(false);
      expect(r.state).toBe(s);
    }
  });

  it("sells a load only as far as the port's purse goes on the morning it arrives; the rest waits there", () => {
    const poor: Scenario = { ...DRY, trade: { ...T, port: { ...T.port, market: { ...T.port.market, cash: dinars(30) } } } };
    let s = order(poor, newVillage(poor, 7), { kind: "send", good: "wheat", quantity: 2 });
    s = days(poor, s, T.port.days + 1);
    // Thirty dinars buy one measure at twenty-two.
    expect(s.last!.events).toContain(`sold-at-port:wheat:1:${dinars(22)}`);
    expect(s.shipments).toMatchObject([{ good: "wheat", quantity: 1, contract: null }]);
    expect(invariants(poor, s)).toEqual([]);
  });

  it("makes no money by carrying the village's own goods to the port, or by pressing bought olives", () => {
    const v = SC.market.goods;
    const port = T.port.market.goods;
    for (const g of Object.keys(T.port.carriage)) if (v[g]) expect(port[g]!.bid - T.port.carriage[g]!, g).toBeLessThan(v[g]!.ask);
    const pressed = 5 * v.olives!.ask + T.press.cost;
    expect(port.oil!.bid - T.port.carriage.oil!).toBeLessThan(pressed);
    const c = T.contracts[0]!;
    expect((c.revenue - c.transport - c.fees) / c.units).toBeLessThan(pressed);
  });

  it("pays a contract as the oil arrives at the port, counts what is on the road, and takes no more than was agreed", () => {
    const c = T.contracts[0]!;
    let s = order(DRY, withOlives(45), { kind: "press", runs: 9 }, { kind: "accept", contract: c.id });
    const before = treasuryOf(s) + s.economy.treasury.reserved;
    s = order(DRY, s, { kind: "deliver", contract: c.id, quantity: 3 });
    // Three are on the road for it: five more can be sent, and not six.
    expect(act(DRY, s, { kind: "deliver", contract: c.id, quantity: 6 }).result).toMatchObject({ ok: false, why: "too-much" });
    s = order(DRY, s, { kind: "deliver", contract: c.id, quantity: 5 });
    expect([s.economy.contracts[c.id]!.state, s.economy.contracts[c.id]!.delivered, stock(s, "oil")]).toEqual(["accepted", 0, 1]);
    s = days(DRY, s, T.port.days + 1);
    expect(s.economy.contracts[c.id]!.state).toBe("settled");
    expect(s.last!.events).toEqual(expect.arrayContaining([`delivered:${c.id}:3`, `delivered:${c.id}:5`, `contract-kept:${c.id}`]));
    expect(s.journal.some((j) => j.event === `contract-kept:${c.id}`)).toBe(true);
    // Against the same valley with no contract: what it paid, less its carriage and fees, and nothing else.
    const plain = days(DRY, order(DRY, withOlives(45), { kind: "press", runs: 9 }), T.port.days + 1);
    expect(treasuryOf(s) + s.economy.treasury.reserved - before - (treasuryOf(plain) - (treasuryOf(order(DRY, withOlives(45), { kind: "press", runs: 9 }))))).toBe(c.revenue - c.transport - c.fees);
    expect(act(DRY, s, { kind: "deliver", contract: c.id, quantity: 1 }).result).toMatchObject({ ok: false, why: "contract-closed" });
    expect(audit(s.economy)).toEqual([]);
  });

  it("will not send on a contract a load that cannot arrive by its day, and sells at the port a load whose contract failed on the road", () => {
    const c = T.contracts[0]!;
    let s = order(DRY, withOlives(45), { kind: "press", runs: 9 }, { kind: "accept", contract: c.id });
    // The last morning a load can leave and still arrive.
    s = days(DRY, s, c.byDay - T.port.days - s.day);
    expect(act(DRY, s, { kind: "deliver", contract: c.id, quantity: 4 }).result.ok).toBe(true);
    const late = days(DRY, s, 1);
    expect(act(DRY, late, { kind: "deliver", contract: c.id, quantity: 1 }).result).toMatchObject({ ok: false, why: "contract-late" });
    // Four sent in time arrive and are paid for; the contract, four short, then fails.
    let half = order(DRY, s, { kind: "deliver", contract: c.id, quantity: 4 });
    half = days(DRY, half, T.port.days + 2);
    expect([half.economy.contracts[c.id]!.delivered, half.economy.contracts[c.id]!.state]).toEqual([4, "failed"]);
    expect(invariants(DRY, half)).toEqual([]);
  });

  it("charges the penalty once, on the day after the last day, when a promise is not kept", () => {
    const c = T.contracts[0]!;
    let s = order(DRY, start(), { kind: "accept", contract: c.id });
    s = days(DRY, s, c.byDay - s.day);
    expect(s.economy.contracts[c.id]!.state).toBe("accepted");
    s = days(DRY, s, 1);
    expect(s.economy.contracts[c.id]!.state).toBe("failed");
    expect(s.last!.events).toContain(`contract-failed:${c.id}`);
    s = days(DRY, s, 3);
    expect(s.last!.events).not.toContain(`contract-failed:${c.id}`);
    // Against the same valley with the contract left alone: the penalty, and nothing else, is the difference.
    const plain = days(DRY, start(), s.day - DRY.startDay);
    expect(treasuryOf(plain) - treasuryOf(s)).toBe(c.penalty);
    expect(s.economy.treasury.reserved).toBe(0);
    expect(act(DRY, s, { kind: "deliver", contract: c.id, quantity: 1 }).result.ok).toBe(false);
  });

  it("is never forced: a contract left on the table costs nothing, and cannot be taken after its day", () => {
    const c = T.contracts[0]!;
    const s = days(DRY, start(), c.byDay - DRY.startDay + 1);
    expect(s.economy.contracts[c.id]!.state).toBe("offered");
    expect(act(DRY, s, { kind: "accept", contract: c.id }).result).toMatchObject({ ok: false, why: "contract-late" });
  });

  it("is refused whole in a valley with no port", () => {
    const { trade: _none, ...plain } = DRY;
    const s = newVillage(plain, 7);
    for (const c of [{ kind: "press", runs: 1 }, { kind: "send", good: "wheat", quantity: 1 }, { kind: "accept", contract: "x" }, { kind: "deliver", contract: "x", quantity: 1 }] as VillageCommand[]) expect(act(plain, s, c).result).toMatchObject({ ok: false, why: "no-trade" });
    expect(invariants(plain, days(plain, s, 5))).toEqual([]);
  });

  it("is kept by a steward who presses the olives, in most years", () => {
    let kept = 0;
    for (let seed = 1; seed <= 60; seed++) if (playVillage(SC, newVillage(SC, seed), PLAYERS.presser!, seed).state.economy.contracts[T.contracts[0]!.id]!.state === "settled") kept += 1;
    expect(kept).toBeGreaterThanOrEqual(40);
  });
});

describe("building on the land", () => {
  const CAT = SC.catalogue!;
  /** Open ground east of the village, far from anything. */
  const A = { x: 600, z: 250 };
  const B = { x: 640, z: 250 };
  const rich: Scenario = { ...DRY, treasury: dinars(5000), stock: { ...DRY.stock, timber: 300, stone: 300 }, capacity: 900 };

  it("refuses water, a field, a road, a slope, the edge of the valley and what already stands, each by its name", () => {
    expect(siteRefusal(140, -84, 9)).toBe("site-water");
    expect(siteRefusal(0, -150, 9)).toBe("site-water");
    expect(siteRefusal(300, 120, 9)).toBe("site-field");
    expect(siteRefusal(318, 244, 9)).toBe("site-road");
    expect(siteRefusal(300, 0, 9)).toBe("site-steep");
    expect(siteRefusal(300, 400, 9)).toBe("site-outside");
    expect(siteRefusal(900, -150, 9)).toBe("site-outside");
    expect(siteRefusal(84, 162, 9)).toBe("site-taken");
    expect(siteRefusal(A.x, A.z, 9)).toBeNull();
    // Somewhere on the plain a tree stands in the way, and a few metres off it does not.
    let trees = 0;
    for (let x = -440; x < 500 && trees === 0; x += 7) for (let z = 200; z < 290; z += 7) if (siteRefusal(x, z, 9) === "site-trees") trees += 1;
    expect(trees).toBeGreaterThan(0);
  });

  it("starts a building where the ground takes it, for the catalogue's price, and finishes it with the hands' days", () => {
    const s0 = newVillage(rich, 7);
    const r = act(rich, s0, { kind: "place", what: "house", x: A.x + 0.4, z: A.z - 0.3 });
    expect(r.result).toEqual({ ok: true, money: -CAT.house!.cost });
    let s = r.state;
    expect(s.placed).toEqual([{ id: 1, what: "house", x: A.x, z: A.z, done: false }]);
    expect(treasuryOf(s0) - treasuryOf(s)).toBe(CAT.house!.cost);
    expect(stock(s0, "timber") - stock(s, "timber")).toBe(CAT.house!.timber);
    expect(s.housing).toBe(60);
    // Twenty worker-days at six hands a day: four days.
    s = days(rich, s, 3);
    expect(s.placed[0]!.done).toBe(false);
    s = days(rich, s, 1);
    expect(s.placed[0]!.done).toBe(true);
    expect(s.last!.events).toContain("placed:house");
    expect([s.housing, housesBuilt(rich, s)]).toEqual([70, 1]);
  });

  it("changes nothing when it refuses: bad ground, another building in the way, no money, no more allowed, an unknown thing", () => {
    const s = order(rich, newVillage(rich, 7), { kind: "place", what: "house", ...A });
    const refused = (sc: Scenario, st: VillageState, c: VillageCommand, why: string) => {
      const r = act(sc, st, c);
      expect(r.result, JSON.stringify(c)).toMatchObject({ ok: false, why });
      expect(r.state).toBe(st);
    };
    refused(rich, s, { kind: "place", what: "house", x: 300, z: 120 }, "site-field");
    refused(rich, s, { kind: "place", what: "house", x: A.x + 10, z: A.z }, "site-taken");
    refused(rich, s, { kind: "place", what: "granary", x: A.x + 20, z: A.z }, "site-taken");
    refused(rich, s, { kind: "place", what: "castle", ...B }, "unknown-building");
    refused(rich, s, { kind: "place", what: "house", x: Number.NaN, z: 0 }, "site-outside");
    const poor: Scenario = { ...DRY, treasury: dinars(100) };
    refused(poor, newVillage(poor, 7), { kind: "place", what: "house", ...A }, "no-money");
    const bare: Scenario = { ...DRY, stock: { ...DRY.stock, stone: 0 } };
    refused(bare, newVillage(bare, 7), { kind: "place", what: "cistern", ...A }, "no-materials");
    expect(siteOf(rich, s, "house", B.x, B.z)).toBeNull();
    let full = s;
    for (let i = 0; i < CAT.garden!.max; i++) full = order(rich, full, { kind: "place", what: "garden", x: -420, z: 60 + i * 24 });
    refused(rich, full, { kind: "place", what: "garden", x: 560, z: 60 }, "no-more");
    expect(invariants(rich, full)).toEqual([]);
  });

  it("gives each building its one effect when it is finished, and none before", () => {
    let s = order(rich, newVillage(rich, 7), { kind: "place", what: "granary", ...A }, { kind: "place", what: "cistern", x: 560, z: 60 }, { kind: "place", what: "garden", x: -420, z: 60 });
    const room = s.economy.capacity;
    expect(poolCapacityOf(rich, s)).toBe(rich.water.poolCapacity);
    s = days(rich, s, 20);
    expect(s.placed.every((p) => p.done)).toBe(true);
    expect(s.economy.capacity - room).toBe(CAT.granary!.capacity);
    expect(poolCapacityOf(rich, s)).toBe(rich.water.poolCapacity + CAT.cistern!.pool!);
    // The garden: the same valley without it fares two points worse once both have settled.
    const without = days(rich, order(rich, newVillage(rich, 7), { kind: "place", what: "granary", ...A }, { kind: "place", what: "cistern", x: 560, z: 60 }), 20);
    expect(days(rich, s, 30).welfare - days(rich, without, 30).welfare).toBe(CAT.garden!.welfare);
  });

  it("lets a cistern's water be held: a fuller pool in a wet spell, and never more than it can hold", () => {
    const wet: Scenario = { ...rich, water: { ...rich.water, inflow: [200, 200, 200, 200] } };
    let s = order(wet, newVillage(wet, 7), { kind: "place", what: "cistern", ...A });
    s = days(wet, s, 12);
    expect(s.pool).toBe(wet.water.poolCapacity + CAT.cistern!.pool!);
  });

  it("counts a placed house for the steward's fourth task", () => {
    let s = order(SC, start(), { kind: "harvest", plot: "mill-field", rest: "wait" }, { kind: "repair" }, { kind: "place", what: "house", ...A });
    s = days(SC, s, 60);
    expect(housesBuilt(SC, s)).toBe(1);
    expect(s.quests["q04-home"]).toBe(s.households > SC.households);
  });

  it("is refused whole in a valley with no catalogue", () => {
    const { catalogue: _none, ...plain } = DRY;
    expect(act(plain, newVillage(plain, 7), { kind: "place", what: "house", ...A }).result).toMatchObject({ ok: false, why: "unknown-building" });
  });
});

describe("an estate", () => {
  it("is forecast by the rules themselves: what the panel expects is what comes, to the unit and the day", () => {
    for (const seed of [3, 7, 11, 19]) {
      for (const orders of [[], [{ kind: "repair" }], [{ kind: "harvest", plot: "mill-field", rest: "wait" }, { kind: "expand" }]] as VillageCommand[][]) {
        let s = order(SC, newVillage(SC, seed), ...orders);
        const said = expectedHarvest(SC, s, "olive-terrace");
        while (!s.outcome && s.plots["olive-terrace"]!.ripeSince === null) s = tick(SC, s);
        const p = s.plots["olive-terrace"]!;
        if (said === null) expect(p.ripeSince, `seed ${seed}`).toBeNull();
        else expect([p.ripeSince, p.yielded], `seed ${seed}`).toEqual([said.day, said.units]);
      }
    }
    // A crop already ripe: today, and what stands. A fallow field: nothing.
    expect(expectedHarvest(SC, start(), "mill-field")).toEqual({ day: start().plots["mill-field"]!.ripeSince, units: start().plots["mill-field"]!.standing });
    expect(expectedHarvest(SC, start(), "river-meadow")).toBeNull();
  });

  it("can be put first for water and hands, and then thrives where it would have thirsted", () => {
    // Little water and both branches whole: the mill field stands before the terrace in the valley's order.
    const thin: Scenario = { ...DRY, water: { ...DRY.water, inflow: [18, 18, 18, 18], pool: 0, branches: DRY.water.branches.map((b) => (b.id === "east" ? { ...b, condition: 100 } : b)) }, plots: DRY.plots.map((p) => (p.id === "mill-field" ? { ...p, growth: 0 } : p)) };
    const usual = days(thin, newVillage(thin, 7), 20);
    const first = days(thin, order(thin, newVillage(thin, 7), { kind: "field-first", plot: "olive-terrace" }), 20);
    expect(first.plots["olive-terrace"]!.stress).toBeLessThan(usual.plots["olive-terrace"]!.stress);
    expect(first.plots["mill-field"]!.stress).toBeGreaterThan(usual.plots["mill-field"]!.stress);
    // And back to the usual order.
    const back = order(thin, first, { kind: "field-first", plot: null });
    expect(back.fieldFirst).toBeNull();
    expect(act(thin, back, { kind: "field-first", plot: "nowhere" }).result).toMatchObject({ ok: false, why: "unknown-plot" });
  });

  it("changes nothing in a valley where no field is put first", () => {
    const a = days(SC, order(SC, start(), { kind: "repair" }), 40);
    const b = days(SC, order(SC, start(), { kind: "repair" }, { kind: "field-first", plot: null }), 40);
    expect(b.plots).toEqual(a.plots);
  });
});

describe("prices that move", () => {
  const P = SC.prices!;
  const quote = (s: VillageState, market: string, good: string) => s.economy.markets[market]!.goods[good]!;

  it("stay where they are while a market holds its usual stock", () => {
    const s = days(DRY, start(), 10);
    for (const [id, usual] of Object.entries(marketsOf(DRY))) for (const [good, u] of Object.entries(usual.goods)) expect(quote(s, id, good), `${id} ${good}`).toEqual(u);
    expect(s.priceWas.village!.wheat).toBe(SC.market.goods.wheat!.ask);
  });

  it("fall the morning after the player sells a market more than it usually holds, both prices together, and no further than the scenario says", () => {
    const rich = newVillage({ ...DRY, stock: { ...DRY.stock, olives: 60 } }, 7);
    const sold = order(DRY, rich, { kind: "sell", good: "olives", quantity: 60 });
    // The same day: the price has not moved, so what the panel showed is what was paid.
    expect(quote(sold, "village", "olives")).toMatchObject({ ask: dinars(39), bid: dinars(28), inventory: 100 });
    const next = days(DRY, sold, 1);
    const q = quote(next, "village", "olives");
    // It holds 100 where it usually holds 40; an eighth of the gap has gone on, and the price is at its floor.
    expect(q.inventory).toBe(100 - Math.floor((60 * P.drift) / 1000));
    // Olives have a narrower swing of their own than the other goods.
    const swing = P.swings!.olives!;
    expect(swing).toBeLessThan(P.swing);
    expect([q.ask, q.bid]).toEqual([wholeDinar((dinars(39) * (1000 - swing)) / 1000), wholeDinar((dinars(28) * (1000 - swing)) / 1000)]);
    // Whole dinars: what the page shows for one is what the ledger pays for one.
    expect([q.ask % 100, q.bid % 100]).toEqual([0, 0]);
    expect(next.priceWas.village!.olives).toBe(dinars(39));
    expect(q.ask).toBeGreaterThanOrEqual(q.bid);
    expect(audit(next.economy)).toEqual([]);
  });

  it("rise after the player buys a market short, and come back of themselves as the market restocks", () => {
    const rich: Scenario = { ...DRY, treasury: dinars(20000) };
    let s = order(rich, newVillage(rich, 7), { kind: "buy", good: "stone", quantity: 100 });
    s = days(rich, s, 1);
    expect(quote(s, "village", "stone").ask).toBeGreaterThan(dinars(20));
    const high = quote(s, "village", "stone").ask;
    s = days(rich, s, 12);
    expect(quote(s, "village", "stone").ask).toBeLessThan(high);
    s = days(rich, s, 40);
    expect(quote(s, "village", "stone")).toEqual(SC.market.goods.stone);
  });

  it("give a market back its purse as it sells on what it bought, and never more than it began with", () => {
    const rich = newVillage({ ...DRY, stock: { ...DRY.stock, olives: 80 } }, 7);
    let s = order(DRY, rich, { kind: "sell", good: "olives", quantity: 80 });
    const spent = SC.market.cash - s.economy.markets.village!.cash;
    expect(spent).toBe(80 * dinars(28));
    s = days(DRY, s, 3);
    const back = s.economy.markets.village!.cash;
    expect(back).toBeGreaterThan(SC.market.cash - spent);
    s = days(DRY, s, 60);
    expect(s.economy.markets.village!.cash).toBeLessThanOrEqual(SC.market.cash);
  });

  it("can never be turned into a round trip: the dearest a market ever pays is below the cheapest it ever asks", () => {
    for (const [id, usual] of Object.entries(marketsOf(SC))) for (const [good, u] of Object.entries(usual.goods)) expect(wholeDinar((u.bid * (1000 + P.swing)) / 1000), `${id} ${good}`).toBeLessThan(wholeDinar((u.ask * (1000 - P.swing)) / 1000));
    // Nor by carrying: the port never holds less than its usual stock (the player can only add to it), so the most it
    // pays, less carriage, is below the least the village ever asks.
    const T = SC.trade!;
    for (const [good, carriage] of Object.entries(T.port.carriage)) {
      const v = SC.market.goods[good];
      if (v) expect(T.port.market.goods[good]!.bid - carriage, good).toBeLessThan(wholeDinar((v.ask * (1000 - P.swing)) / 1000));
    }
    // Nor by pressing what was bought: olives at the least the village ever asks, pressed, cost more than the port pays for the oil.
    expect(5 * wholeDinar((SC.market.goods.olives!.ask * (1000 - P.swings!.olives!)) / 1000) + T.press.cost).toBeGreaterThan(T.port.market.goods.oil!.bid - T.port.carriage.oil!);
    expect(priceFactor(SC, 40, 0, "olives")).toBe(1000 + P.swings!.olives!);
    expect(priceFactor(SC, 40, 0)).toBe(1000 + P.swing);
    expect(priceFactor(SC, 40, 4000)).toBe(1000 - P.swing);
    expect(priceFactor(SC, 40, 40)).toBe(1000);
  });

  it("do not reward glutting the village to buy olives back cheap and press them", () => {
    // Two stewards with eighty olives. One presses them. The other sells them all in the village, buys back at the
    // next morning's low price what the market will sell, and presses that.
    const eighty = () => newVillage({ ...DRY, stock: { ...DRY.stock, wheat: 100, olives: 80 } }, 7);
    const worth = (s: VillageState) => treasuryOf(s) + stock(s, "oil") * (dinars(190) - dinars(4)) + stock(s, "olives") * dinars(28);
    const plain = days(DRY, order(DRY, eighty(), { kind: "press", runs: 16 }), 1);
    let sly = days(DRY, order(DRY, eighty(), { kind: "sell", good: "olives", quantity: 80 }), 1);
    const can = Math.min(sly.economy.markets.village!.goods.olives!.inventory, 80);
    sly = order(DRY, sly, { kind: "buy", good: "olives", quantity: can }, { kind: "press", runs: Math.floor(can / 5) });
    expect(worth(sly)).toBeLessThan(worth(plain));
  });
});

describe("what an independent review found, and the rules now keep", () => {
  const T = DRY.trade!;
  const c = T.contracts[0]!;

  it("food held for a contract is not counted as the households' food, and is not offered for sale", () => {
    const veg: Scenario = { ...DRY, stock: { ...DRY.stock, wheat: 0, vegetables: 120 }, trade: { ...T, contracts: [{ ...c, good: "vegetables", units: 100 }] } };
    const s0 = newVillage(veg, 7);
    expect(reserveDays(s0)).toBe(20);
    const s = order(veg, s0, { kind: "accept", contract: c.id });
    expect(s.economy.stock.vegetables).toMatchObject({ quantity: 120, reserved: 100 });
    expect(reserveDays(s)).toBe(3);
    expect(act(veg, s, { kind: "sell", good: "vegetables", quantity: 21 }).result.ok).toBe(false);
  });

  it("a contract nothing could reach in time cannot be taken", () => {
    const s = days(DRY, start(), c.byDay - T.port.days - DRY.startDay);
    expect(act(DRY, s, { kind: "accept", contract: c.id }).result.ok).toBe(true);
    expect(act(DRY, days(DRY, s, 1), { kind: "accept", contract: c.id }).result).toMatchObject({ ok: false, why: "contract-late" });
  });

  it("in the campaign's last year nothing is sent that could not arrive before its end; in an earlier year it is, and arrives in the next", () => {
    expect(Object.values(SCENARIOS).filter((sc) => sc.final).map((sc) => sc.id)).toEqual(Object.values(SCENARIOS).filter((sc) => scenarioAfter(sc.id) === null).map((sc) => sc.id));
    // Valleys with grain enough to have some left at the year's end.
    const fat = (sc: Scenario): Scenario => ({ ...sc, capacity: 6000, stock: { ...sc.stock, wheat: 4000 } });
    const [L, E] = [fat(Y3), fat(DRY)];
    const tooLate = days(L, newVillage(L, 7), L.endDay - L.trade!.port.days);
    const r = act(L, tooLate, { kind: "send", good: "wheat", quantity: 5 });
    expect(r.result).toMatchObject({ ok: false, why: "year-ending" });
    expect(r.state).toBe(tooLate);
    // The morning before, it can still arrive on the year's last day.
    expect(act(L, days(L, newVillage(L, 7), L.endDay - L.trade!.port.days - 1), { kind: "send", good: "wheat", quantity: 5 }).result.ok).toBe(true);
    // In a year that another follows, a load sent on the last morning is carried into the next.
    expect(act(E, days(E, newVillage(E, 7), E.endDay - E.startDay), { kind: "send", good: "wheat", quantity: 5 }).result.ok).toBe(true);
  });

  it("the field put first is brought in first when hands are short", () => {
    const both: Scenario = { ...DRY, households: 10, housing: 10, plots: DRY.plots.map((p) => (p.id === "olive-terrace" ? { ...p, growth: 1000 } : p)) };
    const ordered = (first: string | null) => days(both, order(both, newVillage(both, 7), { kind: "harvest", plot: "mill-field", rest: "sell" }, { kind: "harvest", plot: "olive-terrace", rest: "sell" }, { kind: "field-first", plot: first }), 1);
    // Four workers bring in 56 a day: all of it from whichever field comes first.
    expect(ordered(null).plots["olive-terrace"]!.standing).toBe(50);
    expect(ordered("olive-terrace").plots["olive-terrace"]!.standing).toBe(0);
  });

  it("a penalty the treasury could not pay is taken off the score", () => {
    const poor: Scenario = { ...DRY, treasury: dinars(60) };
    let s = order(poor, newVillage(poor, 7), { kind: "accept", contract: c.id });
    while (!s.outcome) s = tick(poor, s);
    const owed = s.economy.contracts[c.id]!.owed;
    const base = s.welfare * 10 + s.households * 5 + Math.min(60, reserveDays(s)) * 5;
    expect(s.outcome.score).toBe(base + Math.floor((treasuryOf(s) - owed) / dinars(10)));
  });
});

describe("a decision", () => {
  const D = SC.decisions![0]!;
  const share = D.options.find((o) => o.id === "share")!;
  const refuse = D.options.find((o) => o.id === "refuse")!;
  /** The morning the question is first seen. */
  const asked = (sc: Scenario = DRY) => days(sc, newVillage(sc, 7), D.day - sc.startDay);

  it("is put on its day, said in the day's events, and cannot be answered before or by an answer it does not have", () => {
    const before = days(DRY, start(), D.day - DRY.startDay - 1);
    expect(before.decisions[D.id]!.state).toBe("ahead");
    expect(act(DRY, before, { kind: "decide", decision: D.id, option: "share" }).result).toMatchObject({ ok: false, why: "decision-closed" });
    const s = asked();
    // It is there on the morning of the day it names, before that day is lived.
    expect(s.day).toBe(D.day);
    expect(s.decisions[D.id]).toEqual({ state: "open", choice: null, day: D.day });
    expect(s.last!.events).toContain(`asked:${D.id}`);
    expect(act(DRY, s, { kind: "decide", decision: D.id, option: "neither" }).result).toMatchObject({ ok: false, why: "decision-closed" });
    expect(act(DRY, s, { kind: "decide", decision: "nothing", option: "share" }).result).toMatchObject({ ok: false, why: "unknown-decision" });
  });

  it("to share: the dinars come at once, and the river gives less for exactly its days", () => {
    const s0 = asked();
    const r = act(DRY, s0, { kind: "decide", decision: D.id, option: "share" });
    expect(r.result).toEqual({ ok: true, money: share.dinars });
    const s = r.state;
    expect(treasuryOf(s) - treasuryOf(s0)).toBe(share.dinars);
    expect(s.decisions[D.id]).toEqual({ state: "answered", choice: "share", day: s0.day });
    for (const d of [s.day, s.day + share.days! - 1]) expect(weather(DRY, 7, d).inflow - flowOn(DRY, s, d).inflow).toBe(share.inflow);
    expect(flowOn(DRY, s, s.day + share.days!).inflow).toBe(weather(DRY, 7, s.day + share.days!).inflow);
    // The day's own report shows the river as it ran.
    const next = days(DRY, s, 1);
    expect(next.last!.inflow).toBe(weather(DRY, 7, s.day).inflow - share.inflow!);
    // It cannot be answered twice.
    expect(act(DRY, s, { kind: "decide", decision: D.id, option: "refuse" }).result).toMatchObject({ ok: false, why: "decision-closed" });
    expect(audit(s.economy)).toEqual([]);
  });

  it("to refuse: nothing is paid, the river is whole, and the households fare worse for its days and no longer", () => {
    const s0 = asked();
    const s = order(DRY, s0, { kind: "decide", decision: D.id, option: "refuse" });
    expect(treasuryOf(s)).toBe(treasuryOf(s0));
    expect(flowOn(DRY, s, s.day).inflow).toBe(weather(DRY, 7, s.day).inflow);
    const shared = order(DRY, s0, { kind: "decide", decision: D.id, option: "share" });
    // Both valleys are fed and watered at first, so how they fare differs by the refusal's price alone.
    expect(days(DRY, shared, 6).welfare - days(DRY, s, 6).welfare).toBeGreaterThan(0);
    expect(days(DRY, s, refuse.days! + 1).effects).toEqual([]);
  });

  it("left unanswered through its last morning, is answered as it said it would be", () => {
    let s = asked();
    s = days(DRY, s, D.open - 1);
    expect(s.decisions[D.id]!.state).toBe("open");
    s = days(DRY, s, 1);
    expect(s.decisions[D.id]).toMatchObject({ state: "lapsed", choice: D.otherwise });
    expect(s.last!.events).toContain(`lapsed:${D.id}:${D.otherwise}`);
    expect(s.effects).toEqual([{ kind: "welfare", amount: refuse.welfare, untilDay: s.day - 1 + refuse.days! - 1, from: D.id }]);
  });

  it("is in the forecast: what the panel shows for the days ahead already counts the answer that will be given", () => {
    const s = asked();
    const ahead = forecast(DRY, s, 10);
    expect(ahead.at(-1)!.decisions[D.id]!.state).toBe("lapsed");
    expect(JSON.stringify(days(DRY, s, 10))).toBe(JSON.stringify(ahead.at(-1)));
  });

  it("keeps a journal of what a steward would look back on, and no more than sixty lines of it", () => {
    let s = order(DRY, asked(), { kind: "decide", decision: D.id, option: "share" });
    expect(s.journal.map((j) => j.event)).toEqual([`asked:${D.id}`, `decided:${D.id}:share`]);
    // The mending takes twelve worker-days at six hands a day: it is written on the day it is done.
    s = days(DRY, order(DRY, s, { kind: "repair" }), 2);
    expect(s.journal.at(-1)).toEqual({ day: s.day - 1, event: "built:repair" });
    const long = { ...asked(), journal: Array.from({ length: 60 }, (_, i) => ({ day: i, event: "arrived" })) };
    const kept = order(DRY, long, { kind: "decide", decision: D.id, option: "share" }).journal;
    expect([kept.length, kept.at(-1)!.event, kept[0]!.day]).toEqual([60, `decided:${D.id}:share`, 1]);
  });
});

describe("a campaign of years", () => {
  /** A first year won by the mending steward, with a house placed and wheat sown for the spring. */
  const wonYearOne = (seed = 7): VillageState => {
    for (let s0 = seed; ; s0++) {
      let s = newVillage(SC, s0);
      s = order(SC, s, { kind: "place", what: "house", x: 600, z: 250 });
      const c = playVillage(SC, s, PLAYERS.builder!, s0);
      if (c.state.outcome!.won) return c.state;
    }
  };

  it("names the scenario that follows each year, and none after the last", () => {
    expect(scenarioAfter(SC.id)).toBe(Y2);
    expect(scenarioAfter(Y2.id)).toBe(Y3);
    expect(scenarioAfter(Y3.id)).toBeNull();
    expect(Object.keys(SCENARIOS)).toEqual([SC.id, Y2.id, Y3.id]);
    // Every task's reward is paid by its id, once: no two years share one.
    const ids = Object.values(SCENARIOS).flatMap((sc) => tasksOf(sc).map((x) => x.id));
    expect(new Set(ids).size).toBe(ids.length);
    const contracts = Object.values(SCENARIOS).flatMap((sc) => sc.trade!.contracts.map((c) => c.id));
    expect(new Set(contracts).size).toBe(contracts.length);
  });

  it("in a dry year gives the river about three quarters of its water, and counts the days the households fare well", () => {
    for (let q = 0; q < 4; q++) {
      expect(Y3.water.inflow[q]! * 100).toBeLessThanOrEqual(Y2.water.inflow[q]! * 76);
      expect(Y3.water.inflow[q]! * 100).toBeGreaterThanOrEqual(Y2.water.inflow[q]! * 70);
    }
    const faring = tasksOf(Y3).find((x) => x.kind === "welfare-streak")!;
    expect(taskState(Y3, newVillage(Y3, 7), faring)).toEqual({ done: false, have: 0, want: 60 });
    // The run is the days in a row, ending yesterday, on which the households fared at 65 or better.
    let s = newVillage(Y3, 7);
    let run = 0;
    for (let i = 0; i < 40; i++) {
      s = tick(Y3, s);
      run = s.welfare >= 65 ? run + 1 : 0;
      expect(s.streak.welfare, `day ${s.day - 1}`).toBe(run);
    }
    // A valley that goes hungry loses the run.
    const hungry: Scenario = { ...Y3, stock: { ...Y3.stock, wheat: 0 }, plots: Y3.plots.map((p) => ({ ...p, crop: null, growth: 0 })) };
    const bad = days(hungry, newVillage(hungry, 7), 12);
    expect([bad.welfare < 65, bad.streak.welfare]).toEqual([true, 0]);
    // In a year that does not ask it, nothing is counted.
    expect(days(SC, start(), 8).streak.welfare).toBe(0);
  });

  it("opened fresh, the dry year cannot be won by doing nothing or at random, and can be won in more than one way", () => {
    const wins: Record<string, number> = {};
    for (const name of ["idle", "random", "trader", "sharer"]) {
      wins[name] = 0;
      for (let seed = 1; seed <= 40; seed++) {
        const c = playVillage(Y3, newVillage(Y3, seed), PLAYERS[name]!, seed);
        expect(c.violations, `${name} seed ${seed}`).toEqual([]);
        if (c.state.outcome!.won) wins[name]! += 1;
      }
    }
    expect([wins.idle, wins.random]).toEqual([0, 0]);
    expect(wins.trader).toBeGreaterThanOrEqual(8);
    expect(wins.sharer).toBeGreaterThanOrEqual(8);
  });

  it("can be played through three years with every rule kept every day", () => {
    let reached = 0;
    for (let seed = 1; seed <= 10; seed++) {
      const one = playVillage(SC, newVillage(SC, seed), PLAYERS.builder!, seed);
      if (!one.state.outcome!.won) continue;
      const two = playVillage(Y2, nextYear(Y2, one.state)!, PLAYERS.trader!, seed);
      expect(two.violations, `year two, seed ${seed}`).toEqual([]);
      if (!two.state.outcome!.won) continue;
      const three = playVillage(Y3, nextYear(Y3, two.state)!, PLAYERS.trader!, seed);
      expect(three.violations, `year three, seed ${seed}`).toEqual([]);
      expect([three.state.year, three.state.outcome !== null]).toEqual([3, true]);
      reached += 1;
    }
    expect(reached).toBeGreaterThan(0);
  });

  it("goes on only from a year that was won, and only into the year that follows it", () => {
    const lost = playVillage(SC, newVillage(SC, 7), PLAYERS.idle!, 7).state;
    expect(lost.outcome!.won).toBe(false);
    expect(nextYear(Y2, lost)).toBeNull();
    expect(nextYear(Y2, start())).toBeNull();
    expect(nextYear(SC, wonYearOne())).toBeNull();
  });

  it("carries the valley as it stands: its people, its money and store, what was built, its water; and begins a new year's calendar, weather, offers and tasks", () => {
    const end = wonYearOne();
    const s = nextYear(Y2, end)!;
    expect([s.scenario, s.year, s.day, s.seed, s.outcome, s.last]).toEqual([Y2.id, 2, 1, end.seed + 1, null, null]);
    expect([s.households, s.housing, s.welfare, s.pool, treasuryOf(s), s.economy.capacity]).toEqual([end.households, end.housing, end.welfare, end.pool, treasuryOf(end), end.economy.capacity]);
    expect(s.economy.stock).toEqual(end.economy.stock);
    expect([s.placed, s.built, s.branches]).toEqual([end.placed, end.built, end.branches]);
    expect(s.placed.some((p) => p.what === "house" && p.done)).toBe(true);
    // New things asked, none done; the question not yet put; the journal begun again.
    expect(s.quests).toEqual(Object.fromEntries(tasksOf(Y2).map((x) => [x.id, false])));
    expect(Object.values(s.decisions).map((d) => d.state)).toEqual(["ahead"]);
    expect(s.journal).toEqual([{ day: 1, event: "year:2" }]);
    // The port's new offers stand beside the old year's contract, and it now deals in vegetables.
    expect(s.economy.contracts["oil-for-the-port-2"]!.state).toBe("offered");
    expect(s.economy.contracts["greens-for-the-port"]!.deadlineTick).toBe(end.economy.tick + 79);
    expect(s.economy.contracts["oil-for-the-port"]).toEqual(end.economy.contracts["oil-for-the-port"]);
    expect(s.economy.markets.malaga!.goods.vegetables).toEqual(Y2.trade!.port.market.goods.vegetables);
    // The olives bear again; the year's first state breaks no rule and the books close.
    expect(s.plots["olive-terrace"]).toMatchObject({ crop: "olives", growth: 0, ripeSince: null, standing: 0 });
    expect(invariants(Y2, s)).toEqual([]);
    expect(audit(s.economy)).toEqual([]);
    // The year that was is not changed by going on from it.
    expect(end.year).toBe(1);
  });

  it("closes the books at the year's end: each balance carried forward as one line, the audit still closing, and a saved game no longer growing year on year", () => {
    const end = wonYearOne();
    const s = nextYear(Y2, end)!;
    expect(end.economy.journal.length).toBeGreaterThan(150);
    expect(s.economy.journal.length).toBeLessThan(60);
    // One line for each balance carried, and after them what the new year itself opens (the port's stock of what it now deals in).
    expect(s.economy.journal.every((j) => j.commandId === "carried:1" || j.commandId === "year:2")).toBe(true);
    expect(s.economy.journal.filter((j) => j.commandId === "year:2").map((j) => j.asset)).toEqual(["vegetables"]);
    expect(audit(s.economy)).toEqual([]);
    // Every balance the audit looks at is what it was.
    expect([s.economy.treasury, s.economy.stock, s.economy.markets.village, s.economy.capacity]).toEqual([end.economy.treasury, end.economy.stock, end.economy.markets.village, end.economy.capacity]);
    // A task's reward stays paid; nothing else of the old year's commands is kept.
    expect(Object.keys(s.economy.done).every((id) => id.startsWith("quest:"))).toBe(true);
    expect(Object.keys(s.economy.done).length).toBeGreaterThan(0);
    expect(JSON.stringify(s).length).toBeLessThan(JSON.stringify(end).length / 3);
    // And the year plays on from the closed books under every rule.
    const played = playVillage(Y2, s, PLAYERS.trader!, 7);
    expect(played.violations).toEqual([]);
    expect(audit(played.state.economy)).toEqual([]);
  });

  it("carries a crop still in the ground: wheat sown in autumn is growing in spring", () => {
    const end = wonYearOne();
    const sown = Object.entries(end.plots).filter(([, p]) => p.crop === "wheat" && p.ripeSince === null);
    const s = nextYear(Y2, end)!;
    for (const [id, p] of sown) expect(s.plots[id]).toMatchObject({ crop: "wheat", growth: p.growth });
    for (const [id, p] of Object.entries(end.plots)) if (p.crop !== "olives" && p.ripeSince !== null && p.standing === 0) expect(s.plots[id]!.crop, id).toBeNull();
  });

  it("counts the second year's trade from the second year alone, and pays each task's reward once", () => {
    const s0 = nextYear(Y2, wonYearOne())!;
    expect(tradeSince(s0, Y2.startDay)).toBe(0);
    const s = order(Y2, s0, { kind: "send", good: "wheat", quantity: 10 });
    // The carriage is counted the day the load leaves; the sale, the morning it arrives.
    expect(tradeSince(s, Y2.startDay)).toBe(-10 * dinars(2));
    const there = days(Y2, s, Y2.trade!.port.days + 1);
    expect(tradeSince(there, Y2.startDay)).toBe(10 * (s0.economy.markets.malaga!.goods.wheat!.bid - dinars(2)));
    expect(taskState(Y2, there, { id: "x", kind: "trade", dinars: 1 })).toMatchObject({ done: true });
    expect(taskState(Y2, s, tasksOf(Y2)[0]!)).toMatchObject({ done: false, want: 1600 });
  });

  it("can be played through two years, by a steward who mends and then one who trades, with every rule kept every day", () => {
    let won = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const one = playVillage(SC, newVillage(SC, seed), PLAYERS.builder!, seed);
      expect(one.violations).toEqual([]);
      if (!one.state.outcome!.won) continue;
      const two = playVillage(Y2, nextYear(Y2, one.state)!, PLAYERS.trader!, seed);
      expect(two.violations, `seed ${seed}`).toEqual([]);
      expect(two.state.outcome).not.toBeNull();
      expect(two.state.year).toBe(2);
      if (two.state.outcome!.won) won += 1;
    }
    expect(won).toBeGreaterThan(0);
  });

  it("opened fresh, the second year holds every rule under every scripted player, cannot be won by doing nothing, and can be won in more than one way", () => {
    const wins: Record<string, number> = {};
    for (const name of ["idle", "random", "trader", "greengrocer", "oilman", "provisioner"]) {
      wins[name] = 0;
      for (let seed = 1; seed <= 40; seed++) {
        const c = playVillage(Y2, newVillage(Y2, seed), PLAYERS[name]!, seed);
        expect(c.violations, `${name} seed ${seed}`).toEqual([]);
        if (c.state.outcome!.won) wins[name]! += 1;
      }
    }
    expect([wins.idle, wins.random, wins.provisioner]).toEqual([0, 0, 0]);
    expect(wins.trader).toBeGreaterThanOrEqual(8);
    expect(wins.greengrocer).toBeGreaterThanOrEqual(8);
  });
});

describe("the rules as a whole", () => {
  it("never change the state they are given, and return it untouched when a command is refused", () => {
    const s = start();
    const print = JSON.stringify(s);
    const refused = act(SC, s, { kind: "harvest", plot: "olive-terrace", rest: "wait" });
    expect(refused.state).toBe(s);
    const next = tick(SC, s);
    const acted = act(SC, s, { kind: "repair" });
    expect(next).not.toBe(s);
    expect(acted.state).not.toBe(s);
    expect(JSON.stringify(s)).toBe(print);
  });

  it("give the same valley for the same seed and commands, and another for another seed", () => {
    const run = (seed: number) => JSON.stringify(playVillage(SC, newVillage(SC, seed), PLAYERS.builder!, seed).state);
    expect(run(11)).toBe(run(11));
    expect(run(11)).not.toBe(run(12));
  });

  it("forecast the real future: what the panel shows is what happens if nothing more is done", () => {
    const s = order(SC, start(), { kind: "harvest", plot: "mill-field", rest: "wait" }, { kind: "repair" });
    const ahead = forecast(SC, s, 30);
    expect(ahead).toHaveLength(30);
    expect(JSON.stringify(ahead[29])).toBe(JSON.stringify(days(SC, s, 30)));
    // It stops at the end of the scenario.
    expect(forecast(SC, s, 500).at(-1)!.outcome).not.toBeNull();
  });

  it("hold under every scripted player over sixty years of weather, with no player who cannot be beaten by doing nothing", () => {
    const wins: Record<string, number> = {};
    for (const [name, player] of Object.entries(PLAYERS)) {
      wins[name] = 0;
      for (let seed = 1; seed <= 60; seed++) {
        const c = playVillage(SC, newVillage(SC, seed), player, seed);
        expect(c.violations, `${name} seed ${seed}`).toEqual([]);
        expect(c.state.outcome).not.toBeNull();
        if (c.state.outcome!.won) wins[name]! += 1;
      }
    }
    expect(wins.idle).toBe(0);
    expect(wins.random).toBe(0);
    // At least three of the ways of playing win one campaign in five.
    expect(REAL_PLAYERS.filter((p) => wins[p]! >= 12).length).toBeGreaterThanOrEqual(3);
  });
});
