// Granada's first scenario, "Water for the Valley", as rules: water, fields, hands, households, works, quests.
import { describe, expect, it } from "vitest";
import { audit, dinars, freeCapacity } from "../src/sim/economy";
import { PLAYERS, REAL_PLAYERS, playVillage } from "../src/sim/players";
import { WATER_FOR_THE_VALLEY as SC } from "../src/sim/scenarios";
import { CROPS, HARVEST_RATE, QUESTS, act, carries, foodNeed, forecast, invariants, newVillage, preview, reserveDays, riverYear, seasonOf, tick, treasuryOf, waterNeed, weather, workersOf, type Scenario, type VillageCommand, type VillageState } from "../src/sim/village";

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
    // At least three of the four ways of playing win one campaign in five.
    expect(REAL_PLAYERS.filter((p) => wins[p]! >= 12).length).toBeGreaterThanOrEqual(3);
  });
});
