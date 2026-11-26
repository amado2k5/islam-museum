// Granada's money and goods, proved against the package's own arithmetic (docs/gaming/spec-granada/contracts/
// economy-fixture.json) and against random play. The fixture is a regression oracle for the sums, not a balance:
// its prices are the package's illustrative ones.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Rng } from "@im/kernel/prng";
import {
  MAX_UNITS,
  audit,
  dinars,
  fingerprint,
  freeCapacity,
  liabilities,
  open,
  preview,
  stored,
  submit,
  unreserved,
  type EconomyCommand,
  type EconomyState,
  type Market,
  type Opening,
} from "../src/sim/economy";
import { PLAY_GOODS, randomCommand, randomOpening } from "../src/sim/random-play";
import { appraiseContract, harvestForecast, processingForecast, reserveStatus, roundTrip } from "../src/sim/appraise";

const FIXTURE = JSON.parse(readFileSync(fileURLToPath(new URL("../../../../docs/gaming/spec-granada/contracts/economy-fixture.json", import.meta.url)), "utf8"));

/** The fixture's one market, in minor units, with a purse the fixture does not give (a market's money is finite). */
function fixtureMarket(cash = dinars(2_000_000)): Market {
  const goods: Market["goods"] = {};
  for (const [good, q] of Object.entries(FIXTURE.market) as Array<[string, { inventory: number; ask: number; bid: number }]>) goods[good] = { inventory: q.inventory, ask: dinars(q.ask), bid: dinars(q.bid) };
  return { cash, goods };
}
const OIL = { id: "press-oil", inputs: { olives: FIXTURE.oliveEstate.illustrativeRawPerOil }, outputs: { oliveOil: 1 }, cost: 0 };
const MALAGA = {
  id: "malaga-oil",
  good: "oliveOil",
  units: FIXTURE.contract.units,
  deadlineTick: FIXTURE.contract.deadlineDays,
  revenue: dinars(FIXTURE.contract.revenue),
  transport: dinars(FIXTURE.contract.transport),
  fees: dinars(FIXTURE.contract.fees),
  penalty: dinars(1000),
};
function start(over: Partial<Opening> = {}): EconomyState {
  return open({ treasury: dinars(50_000), capacity: 20_000, markets: { granada: fixtureMarket() }, recipes: [OIL], contracts: [MALAGA], ...over });
}
/** Runs commands one after another, each planned against the state before it, and returns every result. */
function run(s: EconomyState, commands: EconomyCommand[], prefix = "c") {
  const results = [];
  for (const [i, command] of commands.entries()) {
    const out = submit(s, { commandId: `${prefix}${i}`, expectedStateVersion: s.stateVersion, command });
    s = out.state;
    results.push(out.result);
  }
  return { state: s, results };
}
const money = (s: EconomyState) => s.treasury.available + s.treasury.reserved;

describe("markets: the player buys at ask and sells at bid", () => {
  it("opens the fixture's market with every ask at or above its bid", () => {
    const s = start();
    for (const q of Object.values(s.markets.granada!.goods)) expect(q.ask).toBeGreaterThanOrEqual(q.bid);
    expect(audit(s)).toEqual([]);
  });

  it("refuses a market that sells below what it pays (the second concept image's price table)", () => {
    expect(() => open({ treasury: 0, capacity: 10, markets: { wrong: { cash: 0, goods: { wheat: { inventory: 10, ask: dinars(18), bid: dinars(26) } } } } })).toThrow(/ask may not be below bid/);
  });

  it("loses 80 dinars on the fixture's wheat round trip, and the ledger agrees", () => {
    const f = FIXTURE.wheatRoundTrip;
    const before = start();
    const { state, results } = run(before, [
      { kind: "buy", market: "granada", good: "wheat", quantity: f.quantity },
      { kind: "sell", market: "granada", good: "wheat", quantity: f.quantity },
    ]);
    expect(results.map((r) => r.ok && r.money)).toEqual([-dinars(f.buyCost), dinars(f.saleRevenue)]);
    expect(money(state) - money(before)).toBe(dinars(f.netBeforeFees));
    // What the player lost, the market gained; the wheat is back on its shelf.
    expect(state.markets.granada!.cash - before.markets.granada!.cash).toBe(-dinars(f.netBeforeFees));
    expect(state.markets.granada!.goods.wheat!.inventory).toBe(FIXTURE.market.wheat.inventory);
    expect(stored(state)).toBe(0);
    expect(audit(state)).toEqual([]);
    const sums = roundTrip(before.markets.granada!.goods.wheat!, f.quantity);
    expect([sums.buyCost, sums.saleRevenue, sums.net]).toEqual([dinars(f.buyCost), dinars(f.saleRevenue), dinars(f.netBeforeFees)]);
  });

  it("cannot be bought out of stock it does not have, nor sold more than it can pay for", () => {
    const s = start({ treasury: dinars(10_000_000), capacity: 100_000, stock: { silk: { quantity: 5000 } }, markets: { granada: fixtureMarket(dinars(1000)) } });
    const tooMany = preview(s, { commandId: "a", expectedStateVersion: 0, command: { kind: "buy", market: "granada", good: "silk", quantity: FIXTURE.market.silk.inventory + 1 } });
    expect(tooMany).toMatchObject({ ok: false, error: "market-out-of-stock", detail: { available: FIXTURE.market.silk.inventory } });
    // 1,000 dinars buys seven units of silk at 140, not 5,000.
    const tooRich = preview(s, { commandId: "b", expectedStateVersion: 0, command: { kind: "sell", market: "granada", good: "silk", quantity: 5000 } });
    expect(tooRich).toMatchObject({ ok: false, error: "market-short-of-cash", detail: { canBuy: 7 } });
    const { state, results } = run(s, [{ kind: "sell", market: "granada", good: "silk", quantity: 7 }]);
    expect(results[0]).toMatchObject({ ok: true, money: dinars(980) });
    expect(state.markets.granada!.cash).toBe(dinars(20));
    expect(audit(state)).toEqual([]);
  });

  it("refuses a purchase the treasury or the warehouse cannot take", () => {
    const poor = start({ treasury: dinars(100) });
    expect(preview(poor, { commandId: "a", expectedStateVersion: 0, command: { kind: "buy", market: "granada", good: "silk", quantity: 1 } })).toMatchObject({ ok: false, error: "insufficient-funds" });
    const full = start({ capacity: 5 });
    expect(preview(full, { commandId: "a", expectedStateVersion: 0, command: { kind: "buy", market: "granada", good: "wheat", quantity: 6 } })).toMatchObject({ ok: false, error: "no-storage", detail: { free: 5 } });
  });
});

describe("the olive estate: a raw crop is worth the raw price, and a harvest too big for the store says so", () => {
  const f = FIXTURE.oliveEstate;
  const bid = dinars(f.rawBid);

  it("values 6,800 olives at 190,400, not at the price of oil", () => {
    const forecast = harvestForecast(f.expectedRawUnits, f.freeCapacity, bid);
    expect(forecast).toMatchObject({ fits: f.freeCapacity, overflow: f.overflowUnits, grossIfAllSold: dinars(f.conditionalFullGross), grossIfStoredOnly: dinars(f.conditionalStoredGross) });
    // The third concept image shows 435,200: the same quantity multiplied by the oil bid.
    expect(f.expectedRawUnits * FIXTURE.market.oliveOil.bid).toBe(435_200);
    expect(forecast.grossIfAllSold).not.toBe(dinars(435_200));
  });

  it("presses at most 1,360 units of oil from them, worth 87,040 at the oil bid", () => {
    const oil = processingForecast(f.expectedRawUnits, f.illustrativeRawPerOil, dinars(FIXTURE.market.oliveOil.bid));
    expect(oil).toEqual({ units: f.maxOilUnitsBeforeLoss, rawLeftOver: 0, grossAtBid: dinars(f.oilGrossAtBid) });
    const { state, results } = run(start({ stock: { olives: { quantity: f.expectedRawUnits, costBasis: dinars(13_600) } } }), [{ kind: "process", recipe: "press-oil", runs: f.maxOilUnitsBeforeLoss }]);
    expect(results[0]!.ok).toBe(true);
    expect(state.stock.olives!.quantity).toBe(0);
    // What the olives cost goes with them into the oil.
    expect(state.stock.oliveOil).toEqual({ quantity: f.maxOilUnitsBeforeLoss, reserved: 0, costBasis: dinars(13_600) });
    expect(preview(state, { commandId: "again", expectedStateVersion: state.stateVersion, command: { kind: "process", recipe: "press-oil", runs: 1 } })).toMatchObject({ ok: false, error: "insufficient-stock" });
    expect(audit(state)).toEqual([]);
  });

  /** A warehouse with exactly the fixture's free room: 5,200. */
  const estate = () => start({ capacity: 9000, stock: { wheat: { quantity: 9000 - f.freeCapacity } } });

  it("does not bring in a harvest that will not fit unless the player has said what happens to the rest", () => {
    const s = estate();
    expect(freeCapacity(s)).toBe(f.freeCapacity);
    const refused = submit(s, { commandId: "h", expectedStateVersion: 0, command: { kind: "harvest", good: "olives", quantity: f.expectedRawUnits, overflow: "refuse" } });
    expect(refused.result).toEqual({ ok: false, error: "overflow", detail: { expected: f.expectedRawUnits, free: f.freeCapacity, overflow: f.overflowUnits } });
    expect(refused.state).toBe(s);
  });

  it("stores what fits and leaves the rest in the field, counted", () => {
    const { state, results } = run(estate(), [{ kind: "harvest", good: "olives", quantity: f.expectedRawUnits, overflow: "leave" }]);
    expect(results[0]).toMatchObject({ ok: true, stored: f.freeCapacity, leftInField: f.overflowUnits, lost: 0, sold: 0, money: 0 });
    expect(freeCapacity(state)).toBe(0);
    expect(audit(state)).toEqual([]);
  });

  it("sells the overflow from the field at the raw bid when told to", () => {
    const before = estate();
    const { state, results } = run(before, [{ kind: "harvest", good: "olives", quantity: f.expectedRawUnits, overflow: "sell", market: "granada" }]);
    expect(results[0]).toMatchObject({ ok: true, stored: f.freeCapacity, sold: f.overflowUnits, money: f.overflowUnits * bid, leftInField: 0 });
    expect(money(state) - money(before)).toBe(f.overflowUnits * bid);
    expect(state.markets.granada!.goods.olives!.inventory).toBe(FIXTURE.market.olives.inventory + f.overflowUnits);
    expect(audit(state)).toEqual([]);
  });

  it("writes a loss in the journal when the player accepts one, and never loses anything unasked", () => {
    const { state, results } = run(estate(), [{ kind: "harvest", good: "olives", quantity: f.expectedRawUnits, overflow: "lose" }]);
    expect(results[0]).toMatchObject({ ok: true, stored: f.freeCapacity, lost: f.overflowUnits, leftInField: 0 });
    const loss = state.journal.filter((e) => e.to === "loss");
    expect(loss).toHaveLength(1);
    expect(loss[0]).toMatchObject({ asset: "olives", from: "field", amount: f.overflowUnits });
    expect(audit(state)).toEqual([]);
  });

  it("leaves in the field what a market cannot afford to take", () => {
    const { results } = run(start({ capacity: 9000, stock: { wheat: { quantity: 9000 - f.freeCapacity } }, markets: { granada: fixtureMarket(dinars(2800)) } }), [
      { kind: "harvest", good: "olives", quantity: f.expectedRawUnits, overflow: "sell", market: "granada" },
    ]);
    expect(results[0]).toMatchObject({ ok: true, sold: 100, money: dinars(2800), leftInField: f.overflowUnits - 100 });
  });
});

describe("the Málaga contract: what it pays depends on where the oil came from", () => {
  const f = FIXTURE.contract;
  const oilQuote = () => fixtureMarket().goods.oliveOil!;
  const withOil = () => start({ stock: { oliveOil: { quantity: 500, costBasis: dinars(f.productionCostBasis) * 2.5 } } });

  it("appraises the fixture: 7,200 on paper, 2,400 better than selling here, a loss of 1,200 if the oil is bought", () => {
    const a = appraiseContract(MALAGA, dinars(f.productionCostBasis), oilQuote());
    expect(a).toEqual({
      cashMovement: dinars(f.revenue - f.transport - f.fees),
      accountingProfit: dinars(f.accountingProfit),
      localGross: dinars(f.localGross),
      localMargin: dinars(f.localMargin),
      incrementalAdvantage: dinars(f.incrementalAdvantage),
      purchaseCost: dinars(f.purchaseAtAskCost),
      profitIfPurchased: dinars(f.profitIfPurchased),
    });
  });

  it("really loses 1,200 dinars when the oil is bought at ask and delivered", () => {
    const before = start();
    const { state, results } = run(before, [
      { kind: "buy", market: "granada", good: "oliveOil", quantity: f.units },
      { kind: "accept-contract", contract: "malaga-oil" },
      { kind: "deliver", contract: "malaga-oil", quantity: f.units },
    ]);
    expect(results.every((r) => r.ok)).toBe(true);
    expect(money(state) - money(before)).toBe(dinars(f.profitIfPurchased));
    expect(state.contracts["malaga-oil"]!.state).toBe("settled");
    expect(audit(state)).toEqual([]);
  });

  it("holds the oil and the costs on acceptance, so neither can be spent twice", () => {
    const { state, results } = run(withOil(), [{ kind: "accept-contract", contract: "malaga-oil" }]);
    expect(results[0]!.ok).toBe(true);
    expect(state.stock.oliveOil).toMatchObject({ quantity: 500, reserved: f.units });
    expect(unreserved(state, "oliveOil")).toBe(500 - f.units);
    expect(state.treasury.reserved).toBe(dinars(f.transport + f.fees));
    // Reserved oil cannot be sold or pressed away, and the contract cannot be accepted again.
    expect(preview(state, { commandId: "s", expectedStateVersion: 1, command: { kind: "sell", market: "granada", good: "oliveOil", quantity: 301 } })).toMatchObject({ ok: false, error: "insufficient-stock", detail: { available: 300 } });
    expect(preview(state, { commandId: "a", expectedStateVersion: 1, command: { kind: "accept-contract", contract: "malaga-oil" } })).toMatchObject({ ok: false, error: "wrong-contract-state" });
    expect(audit(state)).toEqual([]);
  });

  it("pays once for a full delivery: the cash that moves is revenue less the new costs", () => {
    const before = withOil();
    const { state, results } = run(before, [
      { kind: "accept-contract", contract: "malaga-oil" },
      { kind: "deliver", contract: "malaga-oil", quantity: f.units },
    ]);
    expect(results[1]).toMatchObject({ ok: true, money: dinars(f.revenue - f.transport - f.fees), sold: f.units });
    expect(money(state) - money(before)).toBe(dinars(f.revenue - f.transport - f.fees));
    expect(state.treasury.reserved).toBe(0);
    expect(state.stock.oliveOil).toEqual({ quantity: 300, reserved: 0, costBasis: dinars(f.productionCostBasis) * 1.5 });
    // A settled contract takes no more and pays no more.
    expect(preview(state, { commandId: "d", expectedStateVersion: state.stateVersion, command: { kind: "deliver", contract: "malaga-oil", quantity: 1 } })).toMatchObject({ ok: false, error: "wrong-contract-state" });
    expect(audit(state)).toEqual([]);
  });

  it("pays the same total however the delivery is split, to the last minor unit", () => {
    const rng = new Rng("granada-partial-deliveries");
    for (let round = 0; round < 200; round++) {
      // Awkward terms on purpose: nothing divides evenly.
      const units = rng.int(1, 997);
      const contract = { ...MALAGA, units, revenue: rng.int(0, 9_999_999), transport: rng.int(0, 99_999), fees: rng.int(0, 99_999) };
      let s = start({ treasury: dinars(10_000), stock: { oliveOil: { quantity: units, costBasis: rng.int(0, 999_999) } }, contracts: [contract] });
      const before = money(s);
      s = run(s, [{ kind: "accept-contract", contract: contract.id }], `r${round}a`).state;
      let left = units;
      let n = 0;
      while (left > 0) {
        const q = rng.int(1, left);
        const out = submit(s, { commandId: `r${round}d${n++}`, expectedStateVersion: s.stateVersion, command: { kind: "deliver", contract: contract.id, quantity: q } });
        expect(out.result.ok).toBe(true);
        s = out.state;
        left -= q;
      }
      expect(money(s) - before).toBe(contract.revenue - contract.transport - contract.fees);
      expect(s.contracts[contract.id]!.state).toBe("settled");
      expect(s.stock.oliveOil).toEqual({ quantity: 0, reserved: 0, costBasis: 0 });
      expect(audit(s)).toEqual([]);
    }
  });

  it("refuses to deliver more than was asked for", () => {
    const { state } = run(withOil(), [{ kind: "accept-contract", contract: "malaga-oil" }, { kind: "deliver", contract: "malaga-oil", quantity: 150 }]);
    expect(preview(state, { commandId: "x", expectedStateVersion: state.stateVersion, command: { kind: "deliver", contract: "malaga-oil", quantity: 51 } })).toMatchObject({ ok: false, error: "over-delivery", detail: { remaining: 50 } });
  });

  it("releases what it held exactly once when cancelled, and charges the disclosed penalty once", () => {
    const before = withOil();
    const { state, results } = run(before, [
      { kind: "accept-contract", contract: "malaga-oil" },
      { kind: "cancel-contract", contract: "malaga-oil" },
      { kind: "cancel-contract", contract: "malaga-oil" },
    ]);
    expect(results.map((r) => (r.ok ? "ok" : r.error))).toEqual(["ok", "ok", "wrong-contract-state"]);
    expect(money(state) - money(before)).toBe(-MALAGA.penalty);
    expect(state.treasury.reserved).toBe(0);
    expect(state.stock.oliveOil).toMatchObject({ quantity: 500, reserved: 0 });
    expect(audit(state)).toEqual([]);
  });

  it("fails a contract whose deadline passes, with what was delivered paid for and the penalty charged once", () => {
    const before = withOil();
    const { state, results } = run(before, [
      { kind: "accept-contract", contract: "malaga-oil" },
      { kind: "deliver", contract: "malaga-oil", quantity: 50 },
      { kind: "advance", ticks: f.deadlineDays },
      { kind: "advance", ticks: 1 },
      { kind: "advance", ticks: 30 },
    ]);
    // On the last day it is still open; the day after, it has failed.
    expect(results[2]).toMatchObject({ ok: true, money: 0 });
    expect(results[3]).toMatchObject({ ok: true, money: -MALAGA.penalty });
    expect(results[4]).toMatchObject({ ok: true, money: 0 });
    expect(state.contracts["malaga-oil"]).toMatchObject({ state: "failed", delivered: 50, reservedUnits: 0, reservedCash: 0, owed: 0 });
    const quarter = dinars(f.revenue - f.transport - f.fees) / 4;
    expect(money(state) - money(before)).toBe(quarter - MALAGA.penalty);
    expect(state.stock.oliveOil).toMatchObject({ quantity: 450, reserved: 0 });
    expect(audit(state)).toEqual([]);
  });

  it("cannot be taken up once its deadline has passed", () => {
    const { state, results } = run(withOil(), [
      { kind: "advance", ticks: f.deadlineDays },
      { kind: "advance", ticks: 1 },
      { kind: "accept-contract", contract: "malaga-oil" },
    ]);
    expect(results[2]).toEqual({ ok: false, error: "contract-expired", detail: { deadlineTick: f.deadlineDays, tick: f.deadlineDays + 1 } });
    expect(state.contracts["malaga-oil"]!.state).toBe("offered");
    // On the last day it could still have been.
    const lastDay = run(withOil(), [{ kind: "advance", ticks: f.deadlineDays }, { kind: "accept-contract", contract: "malaga-oil" }]);
    expect(lastDay.results[1]!.ok).toBe(true);
  });

  it("records what a treasury could not pay of a penalty instead of going below nothing", () => {
    const { state } = run(start({ treasury: dinars(900), stock: { oliveOil: { quantity: 10 } } }), [
      { kind: "accept-contract", contract: "malaga-oil" },
      { kind: "advance", ticks: f.deadlineDays + 1 },
    ]);
    expect(state.treasury).toEqual({ available: 0, reserved: 0 });
    expect(liabilities(state)).toBe(dinars(100));
    expect(audit(state)).toEqual([]);
  });
});

describe("winter reserves", () => {
  it("reads 36,400 against 40,000 as 91% and 3,600 short, not as adequate", () => {
    const f = FIXTURE.food;
    expect(reserveStatus(f.current, f.target)).toEqual({ shortfall: f.shortfall, percentOfTarget: f.percentTarget, meetsTarget: false });
    expect(reserveStatus(39_999, 40_000)).toMatchObject({ percentOfTarget: 99, meetsTarget: false });
    expect(reserveStatus(40_000, 40_000)).toEqual({ shortfall: 0, percentOfTarget: 100, meetsTarget: true });
  });
});

describe("commands: safe to retry, refused when stale, all or nothing", () => {
  it("answers a repeated command with its first result and changes nothing", () => {
    const s0 = start();
    const env = { commandId: "buy-1", expectedStateVersion: 0, command: { kind: "buy", market: "granada", good: "wheat", quantity: 10 } as const };
    const first = submit(s0, env);
    const again = submit(first.state, env);
    expect(again.state).toBe(first.state);
    expect(again.result).toEqual(first.result);
    // Ten retries of a delivery pay once.
    let s = run(start({ stock: { oliveOil: { quantity: 200 } } }), [{ kind: "accept-contract", contract: "malaga-oil" }]).state;
    const before = money(s);
    const deliver = { commandId: "deliver-1", expectedStateVersion: s.stateVersion, command: { kind: "deliver", contract: "malaga-oil", quantity: 200 } as const };
    for (let i = 0; i < 10; i++) s = submit(s, deliver).state;
    expect(money(s) - before).toBe(MALAGA.revenue - MALAGA.transport - MALAGA.fees);
    expect(audit(s)).toEqual([]);
  });

  it("refuses a command planned against a state that has since changed", () => {
    const s = run(start(), [{ kind: "buy", market: "granada", good: "wheat", quantity: 1 }]).state;
    const out = submit(s, { commandId: "late", expectedStateVersion: 0, command: { kind: "buy", market: "granada", good: "wheat", quantity: 1 } });
    expect(out.result).toEqual({ ok: false, error: "stale-state", detail: { stateVersion: 1 } });
    expect(out.state).toBe(s);
  });

  it("returns the very same state when a command is refused, and never changes the state it was given", () => {
    const s = start({ stock: { olives: { quantity: 12 } } });
    const print = fingerprint(s);
    const bad: EconomyCommand[] = [
      { kind: "buy", market: "nowhere", good: "wheat", quantity: 1 },
      { kind: "buy", market: "granada", good: "saffron", quantity: 1 },
      { kind: "sell", market: "granada", good: "olives", quantity: 13 },
      { kind: "process", recipe: "press-oil", runs: 3 },
      { kind: "process", recipe: "alchemy", runs: 1 },
      { kind: "deliver", contract: "malaga-oil", quantity: 1 },
      { kind: "cancel-contract", contract: "none" },
      ...[0, -1, 0.5, NaN, Infinity, MAX_UNITS + 1, Number.MAX_SAFE_INTEGER].map((quantity) => ({ kind: "buy", market: "granada", good: "wheat", quantity }) as const),
      { kind: "advance", ticks: 0 },
    ];
    for (const [i, command] of bad.entries()) {
      const out = submit(s, { commandId: `bad${i}`, expectedStateVersion: 0, command });
      expect(out.result.ok, JSON.stringify(command)).toBe(false);
      expect(out.state).toBe(s);
    }
    const good = submit(s, { commandId: "ok", expectedStateVersion: 0, command: { kind: "process", recipe: "press-oil", runs: 2 } });
    expect(good.result.ok).toBe(true);
    expect(fingerprint(s)).toBe(print);
    expect(good.state).not.toBe(s);
  });

  it("refuses openings that are not whole, or that do not fit", () => {
    expect(() => open({ treasury: 0.5, capacity: 1, markets: {} })).toThrow();
    expect(() => open({ treasury: -1, capacity: 1, markets: {} })).toThrow();
    expect(() => open({ treasury: 0, capacity: 5, stock: { wheat: { quantity: 6 } }, markets: {} })).toThrow(/does not fit/);
    expect(() => open({ treasury: 0, capacity: 5, markets: {}, recipes: [{ id: "free", inputs: {}, outputs: { silk: 1 }, cost: 0 }] })).toThrow(/from nothing/);
  });
});

describe("works and households: money and goods that leave for a purpose", () => {
  it("spends and earns by name, and refuses to spend what is not there", () => {
    const before = start();
    const { state, results } = run(before, [
      { kind: "spend", amount: dinars(150), why: "repairing the east branch" },
      { kind: "earn", amount: dinars(6), why: "market levy" },
      { kind: "spend", amount: dinars(60_000), why: "a palace" },
    ]);
    expect(results.map((r) => (r.ok ? r.money : r.error))).toEqual([-dinars(150), dinars(6), "insufficient-funds"]);
    expect(money(state) - money(before)).toBe(dinars(6 - 150));
    expect(state.journal.filter((e) => e.why === "repairing the east branch")).toHaveLength(1);
    expect(audit(state)).toEqual([]);
  });

  it("uses goods up, takes what there is when told to, and says what was missing", () => {
    const { state, results } = run(start({ stock: { wheat: { quantity: 30, costBasis: dinars(300) } } }), [
      { kind: "consume", good: "wheat", quantity: 20, why: "eaten by the households" },
      { kind: "consume", good: "wheat", quantity: 20, why: "eaten by the households" },
      { kind: "consume", good: "wheat", quantity: 20, why: "eaten by the households", atMost: true },
      { kind: "consume", good: "wheat", quantity: 5, why: "eaten by the households", atMost: true },
    ]);
    expect(results[0]).toMatchObject({ ok: true, sold: 20, leftInField: 0 });
    expect(results[1]).toMatchObject({ ok: false, error: "insufficient-stock", detail: { available: 10 } });
    expect(results[2]).toMatchObject({ ok: true, sold: 10, leftInField: 10 });
    expect(results[3]).toMatchObject({ ok: true, sold: 0, leftInField: 5 });
    expect(state.stock.wheat).toEqual({ quantity: 0, reserved: 0, costBasis: 0 });
    expect(state.journal.filter((e) => e.to === "used").reduce((n, e) => n + e.amount, 0)).toBe(30);
    expect(audit(state)).toEqual([]);
  });

  it("keeps timber and stone in the yard, where they take no room, and adds room when something is built", () => {
    const opening = { capacity: 100, yard: ["timber", "stone"], stock: { wheat: { quantity: 90 }, timber: { quantity: 120 }, stone: { quantity: 80 } } };
    const s = start(opening);
    expect(stored(s)).toBe(90);
    expect(freeCapacity(s)).toBe(10);
    const { state, results } = run(s, [
      { kind: "harvest", good: "timber", quantity: 500, overflow: "refuse" },
      { kind: "harvest", good: "wheat", quantity: 11, overflow: "refuse" },
      { kind: "add-capacity", units: 600, why: "the granary is finished" },
      { kind: "harvest", good: "wheat", quantity: 11, overflow: "refuse" },
      { kind: "consume", good: "timber", quantity: 40, why: "built into the granary" },
    ]);
    expect(results.map((r) => (r.ok ? "ok" : r.error))).toEqual(["ok", "overflow", "ok", "ok", "ok"]);
    expect(state.stock.timber!.quantity).toBe(580);
    expect(freeCapacity(state)).toBe(599);
    expect(audit(state)).toEqual([]);
  });
});

// ---- Random play ---------------------------------------------------------------------------------------------------

const GOODS = PLAY_GOODS;
const SHELVES = fixtureMarket().goods;
function play(seed: string, commands: number, check: (s: EconomyState, step: number) => void): { state: EconomyState; accepted: number } {
  const rng = new Rng(seed);
  let s = open(randomOpening(rng, SHELVES));
  let accepted = 0;
  for (let i = 0; i < commands; i++) {
    const out = submit(s, { commandId: `${seed}:${i}`, expectedStateVersion: s.stateVersion, command: randomCommand(rng, s) });
    if (out.result.ok) accepted++;
    else expect(out.state).toBe(s);
    s = out.state;
    check(s, i);
  }
  return { state: s, accepted };
}

describe("random play", () => {
  it("keeps the books sound after every one of 60,000 random commands over 300 openings", () => {
    let accepted = 0;
    const ends: Record<string, number> = {};
    for (let seed = 0; seed < 300; seed++) {
      const run = play(`fuzz-${seed}`, 200, (s, step) => {
        const bad = audit(s);
        if (bad.length) throw new Error(`seed ${seed}, command ${step}: ${bad.join("; ")}`);
      });
      accepted += run.accepted;
      for (const c of Object.values(run.state.contracts)) ends[c.state] = (ends[c.state] ?? 0) + 1;
    }
    // The run means something only if a good share of the commands went through, and only if contracts ended in
    // every way they can: paid in full, cancelled, and failed at the deadline.
    expect(accepted).toBeGreaterThan(15_000);
    for (const state of ["settled", "cancelled", "failed"]) expect(ends[state] ?? 0, state).toBeGreaterThan(50);
  });

  it("gives the same books for the same commands, and different books for different ones", () => {
    const a = play("replay-7", 400, () => {});
    const b = play("replay-7", 400, () => {});
    const c = play("replay-8", 400, () => {});
    expect(fingerprint(a.state)).toBe(fingerprint(b.state));
    expect(a.state).toEqual(b.state);
    expect(fingerprint(a.state)).not.toBe(fingerprint(c.state));
  });

  it("never makes money by carrying goods between a market's two prices", () => {
    // Wealth: money, plus everything in store at the best price any market pays for it. Buying and selling alone
    // can only keep it or lower it, whatever the order, the size or the market.
    for (let seed = 0; seed < 200; seed++) {
      const rng = new Rng(`arbitrage-${seed}`);
      const opening = randomOpening(rng, SHELVES);
      // One set of prices everywhere, so that carrying goods from one market to another is not a trade either:
      // moving goods for gain is the transport system's business, and it will cost time and carriage.
      opening.markets.malaga = { cash: opening.markets.malaga!.cash, goods: structuredClone(opening.markets.granada!.goods) };
      let s = open({ ...opening, contracts: [] });
      const wealth = (x: EconomyState) => money(x) + Object.entries(x.stock).reduce((n, [good, h]) => n + h.quantity * x.markets.granada!.goods[good]!.bid, 0);
      let last = wealth(s);
      for (let i = 0; i < 150; i++) {
        const good = GOODS[rng.int(0, GOODS.length - 1)]!;
        const command: EconomyCommand = { kind: rng.chance(0.5) ? "buy" : "sell", market: rng.chance(0.5) ? "granada" : "malaga", good, quantity: rng.int(1, 300) };
        s = submit(s, { commandId: `t${i}`, expectedStateVersion: s.stateVersion, command }).state;
        const now = wealth(s);
        expect(now).toBeLessThanOrEqual(last);
        last = now;
      }
    }
  });

  it("gives a market its own day: goods come and go, its buyers pay it, its prices are set, and the books still close", () => {
    const market: Market = { cash: dinars(100), goods: { wheat: { inventory: 50, ask: dinars(26), bid: dinars(18) } } };
    let s = open({ treasury: dinars(1000), capacity: 500, stock: { wheat: { quantity: 100 } }, markets: { village: market } });
    const day = (changes: Extract<EconomyCommand, { kind: "market-day" }>["changes"], id: string) => submit(s, { commandId: id, expectedStateVersion: s.stateVersion, command: { kind: "market-day", changes } });
    const r = day([{ market: "village", good: "wheat", arrive: 10, leave: 25, paid: dinars(40), ask: dinars(24), bid: dinars(17) }], "d1");
    expect(r.result.ok).toBe(true);
    s = r.state;
    expect(s.markets.village).toEqual({ cash: dinars(140), goods: { wheat: { inventory: 35, ask: dinars(24), bid: dinars(17) } } });
    expect(audit(s)).toEqual([]);
    // The player's own money and goods are not touched by it.
    expect([s.treasury.available, s.stock.wheat!.quantity]).toEqual([dinars(1000), 100]);
    // Refused whole: more leaving than there is, a price pair the wrong way round, a market or a good that is not there.
    for (const bad of [
      [{ market: "village", good: "wheat", arrive: 0, leave: 36, paid: 0, ask: dinars(24), bid: dinars(17) }],
      [{ market: "village", good: "wheat", arrive: 0, leave: 0, paid: 0, ask: dinars(16), bid: dinars(17) }],
      [{ market: "village", good: "wheat", arrive: 1, leave: 0, paid: 0, ask: dinars(24), bid: dinars(17) }, { market: "nowhere", good: "wheat", arrive: 0, leave: 0, paid: 0, ask: 1, bid: 1 }],
      [{ market: "village", good: "silk", arrive: 0, leave: 0, paid: 0, ask: 1, bid: 1 }],
      [{ market: "village", good: "wheat", arrive: -1, leave: 0, paid: 0, ask: dinars(24), bid: dinars(17) }],
    ]) {
      const refused = day(bad, `bad${JSON.stringify(bad).length}`);
      expect(refused.result.ok, JSON.stringify(bad)).toBe(false);
      expect(refused.state).toBe(s);
    }
  });

  it("keeps a command's result for a retry, unless the caller says it will never send it again", () => {
    const market: Market = { cash: dinars(500), goods: { wheat: { inventory: 50, ask: dinars(26), bid: dinars(18) } } };
    const s0 = open({ treasury: dinars(1000), capacity: 500, markets: { village: market } });
    const buy = { commandId: "b1", expectedStateVersion: 0, command: { kind: "buy", market: "village", good: "wheat", quantity: 2 } as EconomyCommand };
    const kept = submit(s0, buy);
    // Sent again, it is answered with its first result and nothing is bought twice.
    expect(submit(kept.state, buy)).toEqual({ state: kept.state, result: kept.result });
    expect(Object.keys(kept.state.done)).toEqual(["b1"]);
    const once = submit(s0, { ...buy, once: true });
    expect(once.result).toEqual(kept.result);
    expect(once.state.done).toEqual({});
    expect({ ...once.state, done: kept.state.done }).toEqual(kept.state);
    expect(audit(once.state)).toEqual([]);
  });

  describe("goods on the road", () => {
    const market: Market = { cash: dinars(500), goods: { wheat: { inventory: 0, ask: dinars(26), bid: dinars(20) }, oil: { inventory: 0, ask: dinars(300), bid: dinars(190) } } };
    const begin = () => open({ treasury: dinars(1000), capacity: 100, stock: { wheat: { quantity: 60 }, oil: { quantity: 10 } }, markets: { port: structuredClone(market) }, contracts: [{ id: "c", good: "oil", units: 8, deadlineTick: 5, revenue: dinars(1600), transport: dinars(30), fees: dinars(10), penalty: dinars(100) }] });
    let n = 0;
    const run = (s: EconomyState, command: EconomyCommand) => submit(s, { commandId: `r${n++}`, expectedStateVersion: s.stateVersion, command });
    const must = (s: EconomyState, command: EconomyCommand) => {
      const r = run(s, command);
      if (!r.result.ok) throw new Error(`${JSON.stringify(command)} refused: ${r.result.error}`);
      return r.state;
    };

    it("leave the warehouse when they are sent, are in the books while they travel, and are sold when they arrive", () => {
      let s = must(begin(), { kind: "dispatch", shipment: "a", market: "port", good: "wheat", quantity: 20 });
      expect([s.stock.wheat!.quantity, s.road.a, freeCapacity(s), s.treasury.available]).toEqual([40, { good: "wheat", quantity: 20, costBasis: 0, market: "port", contract: null }, 50, dinars(1000)]);
      expect(audit(s)).toEqual([]);
      const r = run(s, { kind: "arrive", shipment: "a" });
      expect(r.result).toMatchObject({ ok: true, money: 20 * dinars(20), sold: 20, leftInField: 0 });
      s = r.state;
      expect([s.road, s.markets.port!.goods.wheat!.inventory, s.markets.port!.cash, s.treasury.available]).toEqual([{}, 20, dinars(100), dinars(1400)]);
      expect(audit(s)).toEqual([]);
    });

    it("are sold as far as the market's purse goes, and the rest waits at the market", () => {
      let s = must(begin(), { kind: "dispatch", shipment: "a", market: "port", good: "wheat", quantity: 40 });
      const r = run(s, { kind: "arrive", shipment: "a" });
      // Five hundred dinars buy twenty-five at twenty.
      expect(r.result).toMatchObject({ ok: true, money: dinars(500), sold: 25, leftInField: 15 });
      s = r.state;
      expect(s.road.a).toMatchObject({ quantity: 15, contract: null });
      expect(audit(s)).toEqual([]);
      expect(run(s, { kind: "arrive", shipment: "a" }).result).toMatchObject({ ok: true, sold: 0, leftInField: 15 });
    });

    it("for a contract take what was held for it first, cannot be more than it still asks, and are paid for as they arrive", () => {
      let s = must(begin(), { kind: "accept-contract", contract: "c" });
      expect(s.stock.oil).toMatchObject({ quantity: 10, reserved: 8 });
      s = must(s, { kind: "dispatch", shipment: "a", market: "port", good: "oil", quantity: 5, contract: "c" });
      expect([s.stock.oil!.quantity, s.stock.oil!.reserved, s.contracts.c!.reservedUnits, s.contracts.c!.delivered]).toEqual([5, 3, 3, 0]);
      expect(audit(s)).toEqual([]);
      // Five are on the road for it: only three more can be sent.
      expect(run(s, { kind: "dispatch", shipment: "b", market: "port", good: "oil", quantity: 4, contract: "c" }).result).toMatchObject({ ok: false, error: "over-delivery", detail: { remaining: 3 } });
      const first = run(s, { kind: "arrive", shipment: "a" });
      expect(first.result).toMatchObject({ ok: true, money: dinars(1000) - dinars(25), sold: 5 });
      s = must(first.state, { kind: "dispatch", shipment: "b", market: "port", good: "oil", quantity: 3, contract: "c" });
      s = must(s, { kind: "arrive", shipment: "b" });
      expect([s.contracts.c!.state, s.contracts.c!.delivered, s.treasury.reserved, s.treasury.available]).toEqual(["settled", 8, 0, dinars(1000) + dinars(1600) - dinars(40)]);
      expect(audit(s)).toEqual([]);
    });

    it("that arrive after their contract has failed are sold at what the market pays", () => {
      let s = must(begin(), { kind: "accept-contract", contract: "c" });
      s = must(s, { kind: "dispatch", shipment: "a", market: "port", good: "oil", quantity: 2, contract: "c" });
      s = must(s, { kind: "advance", ticks: 6 });
      expect(s.contracts.c!.state).toBe("failed");
      const r = run(s, { kind: "arrive", shipment: "a" });
      expect(r.result).toMatchObject({ ok: true, money: 2 * dinars(190), sold: 2 });
      expect(audit(r.state)).toEqual([]);
    });

    it("are refused whole, with nothing changed, when there is no such market, good, load or stock, or the load's name is taken", () => {
      const s = must(begin(), { kind: "dispatch", shipment: "a", market: "port", good: "wheat", quantity: 5 });
      for (const bad of [
        { kind: "dispatch", shipment: "a", market: "port", good: "wheat", quantity: 5 },
        { kind: "dispatch", shipment: "b", market: "nowhere", good: "wheat", quantity: 5 },
        { kind: "dispatch", shipment: "b", market: "port", good: "silk", quantity: 5 },
        { kind: "dispatch", shipment: "b", market: "port", good: "wheat", quantity: 56 },
        { kind: "dispatch", shipment: "b", market: "port", good: "oil", quantity: 1, contract: "c" },
        { kind: "dispatch", shipment: "b", market: "port", good: "oil", quantity: 1, contract: "none" },
        { kind: "arrive", shipment: "z" },
      ] as EconomyCommand[]) {
        const r = run(s, bad);
        expect(r.result.ok, JSON.stringify(bad)).toBe(false);
        expect(r.state).toBe(s);
      }
    });
  });
});