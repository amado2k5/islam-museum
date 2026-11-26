// What Granada's screen shows and keeps: the figures of the panels (worked out from the rules alone) and the
// saved game. The DOM itself is exercised in a real browser by tools/granada-play.ts.
import { describe, expect, it } from "vitest";
import { PLAYERS, playVillage } from "../src/sim/players";
import { MERCHANTS_OF_MALAGA as Y2, WATER_FOR_THE_VALLEY as SC } from "../src/sim/scenarios";
import { VILLAGE_VERSION, act, invariants, newVillage, tick, type VillageCommand, type VillageState } from "../src/sim/village";
import { SAVE_KEY, clearSave, readSave, writeSave, type Store } from "../src/save";
import { regionView } from "../src/ui/region";
import { metresBetween } from "../src/world/geography";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { advice, carryOver, chainView, foodToSpare, seasonFigures, warnings, catalogueRows, stocks as stocksOf, tradeSince, decisionRows, effectRows, skyAhead as skyOf, fieldCards, marketRows, tradeView, questRows, riverOfYear, skyAhead, stocks, workRows } from "../src/ui/model";

const start = () => newVillage(SC, 7);
const order = (s: VillageState, ...commands: VillageCommand[]) => {
  for (const c of commands) {
    const r = act(SC, s, c);
    if (!r.result.ok) throw new Error(`${JSON.stringify(c)} refused: ${r.result.why}`);
    s = r.state;
  }
  return s;
};
const days = (s: VillageState, n: number) => {
  for (let i = 0; i < n; i++) s = tick(SC, s);
  return s;
};
const memory = (): Store & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) };
};

describe("the top bar", () => {
  it("shows the valley as it is, and as it will be tomorrow and in ten days if nothing more is done", () => {
    const s = start();
    const now = stocks(SC, s);
    expect(now).toMatchObject({ day: 25, season: 0, dayOfSeason: 25, daysLeft: 96, dinars: 1200, food: 220, reserveDays: 36, households: 60, housing: 60, welfare: 60, workers: 24, storeUsed: 220, storeRoom: 420, timber: 120, stone: 80 });
    // Tomorrow is the rules run once; in ten days, ten times. Not an estimate.
    expect(now.tomorrow).toEqual({ dinars: 1203, reserveDays: 35, welfare: 61, pool: days(s, 1).pool, households: 60 });
    expect(now.inTen!.dinars).toBe(1230);
    expect(now.inTen!.reserveDays).toBe(26);
  });

  it("has nothing ahead to show once the scenario is over", () => {
    const end = playVillage(SC, start(), PLAYERS.mender!, 7).state;
    expect(stocks(SC, end).tomorrow).toBeNull();
    expect(stocks(SC, end).daysLeft).toBe(0);
  });
});

describe("the fields", () => {
  it("says where each stands: ripe wheat, thirsty olives behind a weak branch, a meadow no water reaches", () => {
    const [wheat, olives, meadow] = fieldCards(SC, start());
    expect(wheat).toMatchObject({ id: "mill-field", crop: "wheat", stage: "ripe", standing: 320, spoilsIn: 15, daysToBring: 1, branch: { state: "flowing" } });
    expect(olives).toMatchObject({ id: "olive-terrace", crop: "olives", stage: "growing", growth: 30, spoilsIn: null, branch: { carries: 5, wants: 10, state: "weak" } });
    expect(meadow).toMatchObject({ id: "river-meadow", crop: null, stage: "fallow", branch: { carries: 0, state: "none" }, sowable: [] });
  });

  it("counts down to the day a ripe crop begins to spoil, and follows a harvest through", () => {
    let s = days(start(), 14);
    expect(fieldCards(SC, s)[0]).toMatchObject({ stage: "ripe", spoilsIn: 1, spoiled: 0 });
    s = days(s, 2);
    expect(fieldCards(SC, s)[0]!.spoilsIn).toBeLessThanOrEqual(0);
    expect(fieldCards(SC, s)[0]!.spoiled).toBeGreaterThan(0);
    let h = order(start(), { kind: "harvest", plot: "mill-field", rest: "wait" });
    expect(fieldCards(SC, h)[0]!.stage).toBe("harvesting");
    h = days(order(start(), { kind: "harvest", plot: "mill-field", rest: "sell" }), 1);
    expect(fieldCards(SC, h)[0]).toMatchObject({ stage: "fallow", brought: 200, sold: 120, standing: 0 });
    // Summer has not begun on day 26: vegetables may be sown in spring.
    expect(fieldCards(SC, h)[0]!.sowable).toEqual(["vegetables"]);
  });
});

describe("the works", () => {
  it("lists each with its cost and with what ordering it now would do", () => {
    const rows = workRows(SC, start());
    expect(rows.map((r) => [r.id, r.dinars, r.timber, r.stone, r.labour, r.now.ok])).toEqual([
      ["repair", 140, 0, 10, 12, true],
      ["expand", 420, 20, 40, 40, true],
      ["house", 160, 30, 0, 20, true],
      ["granary", 240, 40, 30, 30, true],
    ]);
    const s = days(order(start(), { kind: "repair" }), 1);
    const [repair, expand] = workRows(SC, s);
    expect(repair).toMatchObject({ progress: 50, built: 0 });
    expect(repair!.now).toEqual({ ok: false, why: "already-under-way" });
    expect(expand!.now).toEqual({ ok: false, why: "already-under-way" });
    const done = days(s, 2);
    expect(workRows(SC, done)[0]).toMatchObject({ progress: null, built: 1, now: { ok: false, why: "already-done" } });
  });
});

describe("what a year hands to the next", () => {
  it("is warned of from autumn: a valley with no wheat in the ground for the year that follows", () => {
    const summer = days(order(start(), { kind: "harvest", plot: "mill-field", rest: "wait" }, { kind: "repair" }), 20);
    expect(warnings(SC, summer).some((w) => w.key === "warn_unsown")).toBe(false);
    const autumn = days(summer, 20);
    expect(warnings(SC, autumn).some((w) => w.key === "warn_unsown")).toBe(true);
    const sown = order(autumn, { kind: "plant", plot: "mill-field", crop: "wheat" });
    expect(warnings(SC, sown).some((w) => w.key === "warn_unsown")).toBe(false);
    // The last year of the campaign has no year after it to warn of.
    expect(warnings(Y2, days(newVillage(Y2, 7), 70)).some((w) => w.key === "warn_unsown")).toBe(false);
  });

  it("is said at a won year's end: the people, the money, the food, and what is sown", () => {
    const end = playVillage(SC, start(), PLAYERS.builder!, 7).state;
    expect(end.outcome!.won).toBe(true);
    const c = carryOver(SC, end)!;
    expect([c.households, c.foodDays]).toEqual([end.households, Math.floor(((end.economy.stock.wheat?.quantity ?? 0) + (end.economy.stock.vegetables?.quantity ?? 0)) / Math.ceil(end.households / 10))]);
    expect(c.sown).toEqual(Object.entries(end.plots).filter(([, p]) => p.crop === "wheat" && p.ripeSince === null).map(([id]) => id));
    expect(c.sown.length).toBeGreaterThan(0);
    expect(carryOver(Y2, newVillage(Y2, 7))).toBeNull();
  });
});

describe("the oil's road", () => {
  it("shows at each step what stands there now, from the same stock as everything else", () => {
    const c0 = chainView(SC, start())!;
    expect(c0.grove).toMatchObject({ field: "olive-terrace", state: "growing" });
    expect(c0.grove.units).toBe(fieldCards(SC, start()).find((f) => f.id === "olive-terrace")!.expected!.units);
    expect([c0.press, c0.oil, c0.store, c0.port]).toEqual([{ input: "olives", inStore: 0, each: 5, canRun: 0, cost: 12 }, { good: "oil", inStore: 0, held: 0 }, { free: 200, room: 420 }, { id: "malaga", net: 186, cartsLeft: 60, owed: 0 }]);
    // Olives in the store, a contract taken, some oil pressed and some sent: every step moves with it.
    const rich = newVillage({ ...SC, stock: { ...SC.stock, olives: 33 } }, 7);
    let s = order(rich, { kind: "accept", contract: "oil-for-the-port" }, { kind: "press", runs: 4 });
    let c = chainView(SC, s)!;
    expect([c.press.inStore, c.press.canRun, c.oil.inStore, c.port.owed]).toEqual([13, 2, 4, 8]);
    s = order(s, { kind: "deliver", contract: "oil-for-the-port", quantity: 4 });
    c = chainView(SC, s)!;
    expect([c.oil.inStore, c.port.owed, c.port.cartsLeft]).toEqual([0, 4, 56]);
    const { trade: _none, ...plain } = SC;
    expect(chainView(plain, newVillage(plain, 7))).toBeNull();
  });
});

describe("what lies ahead", () => {
  it("warns of what the rules, run forward, will do, and each warning comes true on its day if nothing is done", () => {
    for (const seed of [3, 7, 11]) {
      const s0 = newVillage(SC, seed);
      const said = warnings(SC, s0);
      expect(said.map((w) => w.key)).toContain("warn_spoil");
      for (const w of said) {
        const then = days(s0, w.days);
        const before = days(s0, w.days - 1);
        if (w.key === "warn_spoil") {
          expect(then.last!.events.some((e) => e.startsWith(`spoiled:${w.field}:`)), `seed ${seed} spoil`).toBe(true);
          expect(before.last?.events.some((e) => e.startsWith(`spoiled:${w.field}:`)) ?? false).toBe(false);
        } else if (w.key === "warn_hunger") expect([then.last!.eaten < then.last!.foodNeed, (before.last?.eaten ?? 1) < (before.last?.foodNeed ?? 0)], `seed ${seed} hunger`).toEqual([true, false]);
        else if (w.key === "warn_thirst") expect(then.last!.townWater < then.last!.townNeed, `seed ${seed} thirst`).toBe(true);
        else if (w.key === "warn_reserve") expect([then.outcome !== null, w.have! < w.want!], `seed ${seed} reserve`).toEqual([true, true]);
      }
      // Soonest first.
      expect(said.map((w) => w.days)).toEqual([...said.map((w) => w.days)].sort((a, b) => a - b));
    }
  });

  it("changes when the steward acts, and falls silent when the game is over", () => {
    const s0 = start();
    expect(warnings(SC, s0).some((w) => w.key === "warn_spoil" && w.field === "mill-field")).toBe(true);
    const acted = order(s0, { kind: "harvest", plot: "mill-field", rest: "sell" });
    expect(warnings(SC, acted).some((w) => w.key === "warn_spoil" && w.field === "mill-field")).toBe(false);
    const failing = order(s0, { kind: "accept", contract: "oil-for-the-port" });
    const c = warnings(SC, failing).find((w) => w.key === "warn_contract")!;
    expect(c).toMatchObject({ have: 0, want: 8 });
    expect(days(failing, c.days).economy.contracts["oil-for-the-port"]!.state).toBe("failed");
    expect(days(failing, c.days - 1).economy.contracts["oil-for-the-port"]!.state).toBe("accepted");
    let done = s0;
    while (!done.outcome) done = tick(SC, done);
    expect(warnings(SC, done)).toEqual([]);
  });

  it("says how much food can be spared, by the store the forecast leaves at winter's end", () => {
    const s = order(start(), { kind: "harvest", plot: "mill-field", rest: "wait" }, { kind: "repair" }, { kind: "build", what: "granary" });
    const spare = foodToSpare(SC, s);
    let end = s;
    while (!end.outcome) end = tick(SC, end);
    const need = Math.ceil(end.households / 10);
    expect(spare).toBe(Math.max(0, (end.economy.stock.wheat?.quantity ?? 0) + (end.economy.stock.vegetables?.quantity ?? 0) - SC.goal.reserveDays * need));
    // A steward who does nothing has none to spare.
    expect(foodToSpare(SC, start())).toBe(0);
  });

  it("gives the season in figures: the river against what is wanted, how the fields fared, and the days to winter", () => {
    const s0 = start();
    const f0 = seasonFigures(SC, s0);
    // Sixty households drink ten; the olives want ten; the wheat is ripe and wants none.
    expect([f0.wanted, f0.fields, f0.toWinter]).toEqual([s0.last ? f0.wanted : 20, null, 91 - 25]);
    const s = days(order(s0, { kind: "repair" }), 6);
    const f = seasonFigures(SC, s);
    expect(f.fields).toBe(100);
    expect(seasonFigures(SC, days(s0, 6)).fields).toBe(50);
    expect(seasonFigures(SC, days(s0, 70)).toWinter).toBe(0);
  });
});

describe("prices on the page", () => {
  it("says whether each price is above or below yesterday's, and how the market's stock stands", () => {
    const rich = newVillage({ ...SC, stock: { ...SC.stock, olives: 60 } }, 7);
    const before = Object.fromEntries(marketRows(SC, rich).map((r) => [r.good, r]));
    expect([before.olives!.trend, before.olives!.demand]).toEqual(["steady", "usual"]);
    const next = days(order(rich, { kind: "sell", good: "olives", quantity: 60 }), 1);
    const after = Object.fromEntries(marketRows(SC, next).map((r) => [r.good, r]));
    expect([after.olives!.trend, after.olives!.demand, after.wheat!.trend]).toEqual(["down", "glut", "steady"]);
    expect(after.olives!.bid).toBeLessThan(before.olives!.bid);
    // What the panel says can be sold, at the price it shows, is what the rules pay.
    const one = act(SC, next, { kind: "buy", good: "olives", quantity: 1 });
    expect(one.result).toMatchObject({ ok: true, money: -next.economy.markets.village!.goods.olives!.ask });
    const port = tradeView(SC, days(order(start(), { kind: "send", good: "wheat", quantity: 60 }), 1))!.port.rows.find((r) => r.good === "wheat")!;
    expect([port.trend, port.demand]).toEqual(["down", "glut"]);
  });

  it("counts what trade has brought in thirty days from the ledger's own journal", () => {
    const s0 = start();
    expect(stocksOf(SC, s0).trade30).toBe(0);
    const s = order(s0, { kind: "send", good: "wheat", quantity: 10 }, { kind: "buy", good: "stone", quantity: 5 }, { kind: "sell", good: "timber", quantity: 10 });
    // Ten wheat at the port for 22 less 2 of carriage; five stone bought at 20; ten timber sold at 9.
    expect(tradeSince(s, s.day)).toBe((10 * (22 - 2) - 5 * 20 + 10 * 9) * 100);
    expect(stocksOf(SC, s).trade30).toBe(190);
    // It is trade only: the works, the levy and a task's reward are not in it.
    const worked = days(order(s, { kind: "repair" }), 3);
    expect(tradeSince(worked, s.day)).toBe(19000);
    expect(stocksOf(SC, days(worked, 31)).trade30).toBe(0);
  });
});

describe("the region", () => {
  const pack = JSON.parse(readFileSync(resolve(import.meta.dirname, "../data/museum-records.v1.json"), "utf8")) as Parameters<typeof regionView>[2] & { records: Record<string, { coordinates?: [number, number] }> };

  it("puts each place where the museum's coordinates put it, with the museum's own distances", () => {
    const v = regionView(SC, start(), pack);
    expect(v.places.map((p) => p.id)).toEqual(["place/granada", "place/malaga", "place/almeria", "place/sierra-nevada"]);
    const granada = pack.records["place/granada"]!.coordinates!;
    for (const p of v.places) {
      const at = pack.records[p.id]!.coordinates!;
      expect(p.km, p.id).toBe(Math.round(metresBetween(granada, at) / 1000));
      expect(Math.round(Math.hypot(p.x, p.y)), p.id).toBe(p.km);
    }
    const [malaga, almeria] = [v.places[1]!, v.places[2]!];
    // West and south of the city; east and south of it: the land is never mirrored.
    expect([malaga.x < 0, malaga.y < 0, almeria.x > 0, almeria.y < 0]).toEqual([true, true, true, true]);
    expect(v.route).toEqual({ to: "place/malaga", km: 89 });
    expect(v.coast.map((p) => p.id)).toEqual(["place/malaga", "place/almunecar", "place/almeria"]);
  });

  it("lays over it only what the game holds: carts, contract, fields, water, store and buildings", () => {
    const s = days(order(start(), { kind: "send", good: "wheat", quantity: 20 }, { kind: "accept", contract: "oil-for-the-port" }, { kind: "place", what: "garden", x: 600, z: 250 }), 0);
    const f = regionView(SC, s, pack).facts;
    expect(f.economy).toEqual([{ key: "region_carts", values: { used: 20, max: 60 } }, { key: "region_port_cash", values: { dinars: 6000 - 20 * 22 } }, { key: "region_contract_accepted", values: { have: 0, want: 8 } }]);
    expect(f.agriculture[0]).toEqual({ key: "region_fields", values: { sown: 2, all: 3 } });
    expect(f.agriculture.slice(1).map((x) => x.values.field)).toEqual(["mill-field", "olive-terrace"]);
    expect(f.infrastructure).toEqual([{ key: "region_pool", values: { have: 150, max: 300 } }, { key: "region_channels", values: { flowing: 2, all: 3 } }, { key: "region_store", values: { free: 220, room: 420 } }, { key: "region_built", values: { n: 0 } }]);
    expect(regionView(SC, days(s, 4), pack).facts.infrastructure.at(-1)).toEqual({ key: "region_built", values: { n: 1 } });
    // A valley with no trade has no route and no trade facts.
    const { trade: _none, ...plain } = SC;
    const quiet = regionView(plain, newVillage(plain, 7), pack);
    expect([quiet.route, quiet.facts.economy]).toEqual([null, []]);
  });
});

describe("a decision on the page", () => {
  it("shows each answer's price and gain in figures, the mornings left, and what an unanswered question becomes", () => {
    const s = days(start(), 40 - SC.startDay + 1);
    const [d] = decisionRows(SC, s);
    expect(d).toMatchObject({ id: "water-for-the-neighbours", daysLeft: 5, otherwise: "refuse" });
    expect(d!.options).toEqual([{ id: "share", dinars: 220, inflow: 8, welfare: 0, days: 20 }, { id: "refuse", dinars: 0, inflow: 0, welfare: -4, days: 20 }]);
    expect(decisionRows(SC, start())).toEqual([]);
    const shared = order(s, { kind: "decide", decision: d!.id, option: "share" });
    expect(decisionRows(SC, shared)).toEqual([]);
    expect(effectRows(shared)).toEqual([{ kind: "inflow", amount: 8, daysLeft: 20, from: d!.id }]);
    // The sky ahead shows the river as it will run.
    expect(skyOf(SC, s, 1)[0]!.inflow - skyOf(SC, shared, 1)[0]!.inflow).toBe(8);
    expect(effectRows(days(shared, 20))).toEqual([]);
  });
});

describe("an estate's card", () => {
  it("says who tends it, what it will give and when, whether the store can take it, and what it is worth", () => {
    const s = days(order(start(), { kind: "harvest", plot: "mill-field", rest: "wait" }, { kind: "repair" }), 6);
    const olives = fieldCards(SC, s).find((f) => f.id === "olive-terrace")!;
    expect(olives.hands).toEqual({ have: 3, need: 3 });
    const e = olives.expected!;
    // The same figures, by letting the days pass.
    let later = s;
    while (later.plots["olive-terrace"]!.ripeSince === null) later = tick(SC, later);
    expect(e.units).toBe(later.plots["olive-terrace"]!.yielded);
    expect(e.inDays).toBe(later.day - s.day);
    expect(e.village).toBe(e.units * 28);
    expect(e.port).toBe(e.units * 31);
    expect(olives.first).toBe(false);
    expect(fieldCards(SC, order(s, { kind: "field-first", plot: "olive-terrace" })).find((f) => f.id === "olive-terrace")!.first).toBe(true);
  });

  it("counts what thirst has already cost, and warns when the store cannot take the harvest", () => {
    const dry = days(start(), 12);
    const olives = fieldCards(SC, dry).find((f) => f.id === "olive-terrace")!;
    expect(olives.lostToThirst).toBeGreaterThan(0);
    const wheat = fieldCards(SC, start()).find((f) => f.id === "mill-field")!;
    expect(wheat.expected).toMatchObject({ inDays: 0, units: 320, fits: false });
    expect(fieldCards(SC, start()).find((f) => f.id === "river-meadow")!.expected).toBeNull();
  });
});

describe("the catalogue", () => {
  it("lists what can be placed, by kind, with its price, its one effect and whether one can be started", () => {
    const rows = Object.fromEntries(catalogueRows(SC, start()).map((r) => [r.what, r]));
    expect(Object.keys(rows)).toEqual(["house", "granary", "cistern", "garden"]);
    expect(rows.house).toMatchObject({ category: "housing", dinars: 160, timber: 30, stone: 0, labour: 20, placed: 0, max: 6, underWay: [], effect: { key: "housing", n: 10 }, now: { ok: true } });
    expect(rows.granary!.effect).toEqual({ key: "capacity", n: 500 });
    expect(rows.cistern!.effect).toEqual({ key: "pool", n: 60 });
    expect(rows.garden!.effect).toEqual({ key: "welfare", n: 2 });
  });

  it("says why one cannot be started, and how far one being built has got", () => {
    const poor = newVillage({ ...SC, treasury: 100_00 }, 7);
    expect(catalogueRows(SC, poor).find((r) => r.what === "house")!.now).toEqual({ ok: false, why: "no-money" });
    const bare = newVillage({ ...SC, stock: { ...SC.stock, stone: 0 } }, 7);
    expect(catalogueRows(SC, bare).find((r) => r.what === "cistern")!.now).toEqual({ ok: false, why: "no-materials" });
    const s = days(order(start(), { kind: "place", what: "house", x: 600, z: 250 }), 2);
    expect(catalogueRows(SC, s).find((r) => r.what === "house")).toMatchObject({ placed: 1, underWay: [60] });
    // What the panel allows, the rules allow on good ground.
    for (const r of catalogueRows(SC, start())) if (r.now.ok) expect(act(SC, start(), { kind: "place", what: r.what, x: 600, z: 250 }).result.ok, r.what).toBe(true);
  });
});

describe("trade beyond the village", () => {
  it("shows what the port pays after carriage, and the most the carts, the store and both purses allow", () => {
    const tv = tradeView(SC, start())!;
    const wheat = tv.port.rows.find((r) => r.good === "wheat")!;
    expect(wheat).toMatchObject({ have: 220, bid: 22, carriage: 2, net: 20, canSend: 60 });
    expect(tv.port.rows.find((r) => r.good === "oil")).toMatchObject({ have: 0, net: 186, canSend: 0 });
    expect(act(SC, start(), { kind: "send", good: "wheat", quantity: wheat.canSend }).result.ok).toBe(true);
    expect(act(SC, start(), { kind: "send", good: "wheat", quantity: wheat.canSend + 1 }).result.ok).toBe(false);
    expect(tv.press).toMatchObject({ cost: 12, from: "olives", makes: "oil", each: 5, canRun: 0 });
  });

  it("shows the contract's terms, lets it be taken, and offers to deliver only what is in the store", () => {
    const c = tradeView(SC, start())!.contracts[0]!;
    expect(c).toMatchObject({ units: 8, delivered: 0, state: "offered", daysLeft: 71, revenue: 1680, costs: 52, penalty: 300, canAccept: true, canDeliver: 0 });
    const rich = newVillage({ ...SC, stock: { ...SC.stock, olives: 33 } }, 7);
    expect(tradeView(SC, rich)!.press.canRun).toBe(6);
    const s = order(rich, { kind: "press", runs: 6 }, { kind: "accept", contract: c.id });
    const now = tradeView(SC, s)!;
    expect(now.contracts[0]).toMatchObject({ state: "accepted", canDeliver: 6 });
    // Oil held for the contract is not offered to the port's open market.
    expect(now.port.rows.find((r) => r.good === "oil")!.canSend).toBe(0);
    expect(act(SC, s, { kind: "deliver", contract: c.id, quantity: 6 }).result.ok).toBe(true);
  });

  it("is absent where a scenario has no port", () => {
    const { trade: _none, ...plain } = SC;
    expect(tradeView(plain, newVillage(plain, 7))).toBeNull();
  });
});

describe("the market", () => {
  it("shows both prices, and the most that money, room, stock and the market's own purse allow", () => {
    const rows = Object.fromEntries(marketRows(SC, start()).map((r) => [r.good, r]));
    expect(rows.wheat).toMatchObject({ have: 220, ask: 26, bid: 18, onOffer: 600, canBuy: 46, canSell: 138 });
    // 1,200 dinars buy 46 at 26; the market's 2,500 dinars buy 138 at 18.
    expect(rows.timber).toMatchObject({ have: 120, ask: 14, bid: 9, canBuy: 85 });
    for (const r of Object.values(rows)) expect(r.ask).toBeGreaterThanOrEqual(r.bid);
    // What the panel says can be done, can be done; one more cannot.
    for (const r of Object.values(rows)) {
      if (r.canBuy > 0) expect(act(SC, start(), { kind: "buy", good: r.good, quantity: r.canBuy }).result.ok, `buy ${r.good}`).toBe(true);
      expect(act(SC, start(), { kind: "buy", good: r.good, quantity: r.canBuy + 1 }).result.ok, `buy one more ${r.good}`).toBe(false);
      if (r.canSell > 0) expect(act(SC, start(), { kind: "sell", good: r.good, quantity: r.canSell }).result.ok, `sell ${r.good}`).toBe(true);
      expect(act(SC, start(), { kind: "sell", good: r.good, quantity: r.canSell + 1 }).result.ok, `sell one more ${r.good}`).toBe(false);
    }
  });
});

describe("the quests and the advice", () => {
  it("show how far each quest has got, in the thing it counts", () => {
    const s = days(order(start(), { kind: "harvest", plot: "mill-field", rest: "wait" }), 1);
    const rows = Object.fromEntries(questRows(SC, s).map((r) => [r.id, r]));
    expect(rows["q02-harvest"]).toEqual({ id: "q02-harvest", done: false, progress: { have: 200, want: 320 }, values: {} });
    // A later year's task carries the figure it names, for its words on the page.
    expect(questRows(Y2, newVillage(Y2, 7))[0]).toEqual({ id: "m1-trade", done: false, progress: { have: 0, want: 1600 }, values: { dinars: 1600 } });
    expect(rows["q01-water"]!.progress).toEqual({ have: 0, want: 3 });
    const won = playVillage(SC, start(), PLAYERS.mender!, 7).state;
    expect(questRows(SC, won).every((r) => r.done && r.progress === null)).toBe(true);
  });

  it("name the most pressing fact, and never the same one once it is dealt with", () => {
    expect(advice(SC, start())).toEqual({ key: "advice_harvest", field: "mill-field", days: 15 });
    const ordered = order(start(), { kind: "harvest", plot: "mill-field", rest: "wait" });
    expect(advice(SC, ordered)).toEqual({ key: "advice_branch", field: "olive-terrace" });
    expect(advice(SC, days(ordered, 1))).toEqual({ key: "advice_store_full", field: "mill-field" });
    expect(advice(SC, days(start(), 16)).key).toBe("advice_spoiling");
    const hungry = days(newVillage({ ...SC, stock: { ...SC.stock, wheat: 0 }, plots: SC.plots.map((p) => ({ ...p, crop: null, growth: 0 })) }, 1), 1);
    expect(advice(SC, hungry).key).toBe("advice_hungry");
  });
});

describe("the sky ahead", () => {
  it("is the weather that will happen, day by day, to the end of the scenario and no further", () => {
    const s = start();
    const week = skyAhead(SC, s, 7);
    expect(week.map((d) => d.day)).toEqual([25, 26, 27, 28, 29, 30, 31]);
    let t = s;
    for (const d of week) {
      t = tick(SC, t);
      expect(t.last).toMatchObject({ day: d.day, rain: d.rain, inflow: d.inflow });
    }
    expect(skyAhead(SC, days(s, 94), 7)).toHaveLength(2);
    for (const pct of riverOfYear(s)) {
      expect(pct).toBeGreaterThanOrEqual(75);
      expect(pct).toBeLessThanOrEqual(125);
    }
  });
});

describe("the saved game", () => {
  it("comes back exactly as it was left, and plays on to the same end", () => {
    const store = memory();
    const s = days(order(start(), { kind: "harvest", plot: "mill-field", rest: "wait" }, { kind: "repair" }), 20);
    expect(writeSave(store, s)).toBe(true);
    const back = readSave(store);
    expect(back.status).toBe("ok");
    if (back.status !== "ok") return;
    expect(back.state).toEqual(s);
    expect(JSON.stringify(days(back.state, 30))).toBe(JSON.stringify(days(s, 30)));
  });

  it("carries a game saved before the port existed into the present rules, with nothing of the player's changed", () => {
    // What version 1 wrote: the same valley with no port in its books, no carts, and a ledger clock that never moved.
    const { trade: _none, ...plain } = SC;
    let old = newVillage(plain, 7);
    for (const c of [{ kind: "harvest", plot: "mill-field", rest: "wait" }, { kind: "repair" }] as VillageCommand[]) old = act(plain, old, c).state;
    for (let i = 0; i < 20; i++) old = tick(plain, old);
    const v1 = JSON.parse(JSON.stringify(old)) as Record<string, unknown>;
    v1.version = 1;
    delete v1.carted;
    const store = memory();
    store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: v1 }));
    const back = readSave(store);
    expect(back.status).toBe("ok");
    if (back.status !== "ok") return;
    expect([back.state.day, back.state.households, back.state.economy.treasury, back.state.economy.stock]).toEqual([old.day, old.households, old.economy.treasury, old.economy.stock]);
    const c = tradeView(SC, back.state)!.contracts[0]!;
    expect(c).toMatchObject({ state: "offered", daysLeft: 51, canAccept: true });
    expect(act(SC, back.state, { kind: "send", good: "wheat", quantity: 5 }).result.ok).toBe(true);
    // And it plays on to the end under every rule.
    let s = back.state;
    while (!s.outcome) {
      s = tick(SC, s);
      expect(invariants(SC, s)).toEqual([]);
    }
    // A game saved after the port and before anything could be placed (version 2) comes forward too.
    const v2 = JSON.parse(JSON.stringify(newVillage(SC, 9))) as Record<string, unknown>;
    v2.version = 2;
    delete v2.placed;
    store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: v2 }));
    const two = readSave(store);
    expect(two.status).toBe("ok");
    if (two.status === "ok") expect([two.state.version, two.state.placed, two.state.fieldFirst, invariants(SC, two.state)]).toEqual([VILLAGE_VERSION, [], null, []]);
    // And one saved after buildings and before a field could be put first (version 3).
    const v3 = JSON.parse(JSON.stringify(order(newVillage(SC, 9), { kind: "place", what: "house", x: 600, z: 250 }))) as Record<string, unknown>;
    v3.version = 3;
    delete v3.fieldFirst;
    store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: v3 }));
    const three = readSave(store);
    expect(three.status).toBe("ok");
    // And one saved before the steward was asked anything (version 4), early and late in the year.
    for (const [n, state] of [[0, "ahead"], [30, "lapsed"]] as const) {
      const v4 = JSON.parse(JSON.stringify(days(newVillage(SC, 9), n))) as Record<string, unknown>;
      v4.version = 4;
      for (const k of ["decisions", "effects", "journal"]) delete v4[k];
      if (n > 0) (v4 as { journal?: unknown }).journal = undefined;
      store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: v4 }));
      const four = readSave(store);
      expect(four.status).toBe("ok");
      if (four.status === "ok") expect([four.state.version, four.state.decisions["water-for-the-neighbours"]!.state, four.state.effects, four.state.journal, invariants(SC, four.state)]).toEqual([VILLAGE_VERSION, state, [], [], []]);
    }
    // And one saved before there were years (version 6): it is in its first.
    const v6 = JSON.parse(JSON.stringify(days(newVillage(SC, 9), 5))) as Record<string, unknown>;
    v6.version = 6;
    delete v6.year;
    store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: v6 }));
    const six = readSave(store);
    expect(six.status).toBe("ok");
    if (six.status === "ok") expect([six.state.version, six.state.year, invariants(SC, six.state)]).toEqual([VILLAGE_VERSION, 1, []]);
    store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: v3 }));
    if (three.status === "ok") expect([three.state.version, three.state.placed.length, three.state.fieldFirst, invariants(SC, three.state)]).toEqual([VILLAGE_VERSION, 1, null, []]);
    // A version this code has never heard of is still set aside.
    store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: { ...v1, version: 0 } }));
    expect(readSave(store)).toEqual({ status: "unreadable", why: "unknown-game" });
  });

  it("is set aside, not half-loaded, when it is damaged, tampered with, or from a newer version", () => {
    const store = memory();
    expect(readSave(store)).toEqual({ status: "empty" });
    store.data.set(SAVE_KEY, "{ not json");
    expect(readSave(store)).toEqual({ status: "unreadable", why: "not-json" });
    store.data.set(SAVE_KEY, JSON.stringify({ state: start() }));
    expect(readSave(store)).toEqual({ status: "unreadable", why: "no-version" });
    store.data.set(SAVE_KEY, JSON.stringify({ v: 99, state: start() }));
    expect(readSave(store)).toEqual({ status: "newer", version: 99 });
    store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: { ...start(), scenario: "nowhere" } }));
    expect(readSave(store)).toEqual({ status: "unreadable", why: "unknown-game" });
    // A treasury edited by hand no longer agrees with the ledger's journal.
    const rich = structuredClone(start());
    rich.economy.treasury.available = 99_999_999;
    store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: rich }));
    expect(readSave(store)).toEqual({ status: "unreadable", why: "broken-rules" });
    store.data.set(SAVE_KEY, JSON.stringify({ v: 1, state: { version: 1, scenario: SC.id } }));
    expect(readSave(store).status).toBe("unreadable");
    clearSave(store);
    expect(readSave(store)).toEqual({ status: "empty" });
  });

  it("says so when the device refuses to keep it", () => {
    const full: Store = { getItem: () => null, setItem: () => { throw new Error("QuotaExceededError"); }, removeItem: () => {} };
    expect(writeSave(full, start())).toBe(false);
    const dead: Store = { getItem: () => { throw new Error("SecurityError"); }, setItem: () => {}, removeItem: () => { throw new Error("SecurityError"); } };
    expect(readSave(dead)).toEqual({ status: "unreadable", why: "storage" });
    expect(() => clearSave(dead)).not.toThrow();
  });
});
