// What Granada's screen shows and keeps: the figures of the panels (worked out from the rules alone) and the
// saved game. The DOM itself is exercised in a real browser by tools/granada-play.ts.
import { describe, expect, it } from "vitest";
import { PLAYERS, playVillage } from "../src/sim/players";
import { WATER_FOR_THE_VALLEY as SC } from "../src/sim/scenarios";
import { act, invariants, newVillage, tick, type VillageCommand, type VillageState } from "../src/sim/village";
import { SAVE_KEY, clearSave, readSave, writeSave, type Store } from "../src/save";
import { advice, fieldCards, marketRows, tradeView, questRows, riverOfYear, skyAhead, stocks, workRows } from "../src/ui/model";

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
    expect(rows["q02-harvest"]).toEqual({ id: "q02-harvest", done: false, progress: { have: 200, want: 320 } });
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
