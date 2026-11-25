// Random legal and illegal play for Granada's economy: the openings and commands the property tests and the fuzz
// report share, so that what is reported is what is tested. Everything comes from the seeded generator it is given.
import type { Rng } from "@im/kernel/prng";
import { dinars, type EconomyCommand, type EconomyState, type Market, type Opening, type Recipe } from "./economy";

export const PLAY_GOODS = ["wheat", "olives", "oliveOil", "silk", "ceramics"];
export const PRESS_OIL: Recipe = { id: "press-oil", inputs: { olives: 5 }, outputs: { oliveOil: 1 }, cost: 0 };

/** A market with the given shelves and a purse of its own. */
export const marketOf = (goods: Market["goods"], cash: number): Market => ({ cash, goods: structuredClone(goods) });

/** Two markets with different prices (neither ever selling below what it pays), four contracts, a random purse. */
export function randomOpening(rng: Rng, goods: Market["goods"]): Opening {
  const second = marketOf(goods, dinars(rng.int(500, 400_000)));
  for (const q of Object.values(second.goods)) {
    q.bid = Math.max(1, q.bid + dinars(rng.int(-12, 30)));
    q.ask = q.bid + dinars(rng.int(0, 25));
  }
  const contracts = Array.from({ length: 4 }, (_, i) => ({
    id: `k${i}`,
    good: PLAY_GOODS[rng.int(0, PLAY_GOODS.length - 1)]!,
    units: rng.int(1, 600),
    deadlineTick: rng.int(2, 60),
    revenue: rng.int(0, 5_000_000),
    transport: rng.int(0, 90_000),
    fees: rng.int(0, 60_000),
    penalty: rng.int(0, 400_000),
  }));
  return { treasury: dinars(rng.int(0, 60_000)), capacity: rng.int(200, 9000), markets: { granada: marketOf(goods, dinars(rng.int(1000, 900_000))), malaga: second }, recipes: [PRESS_OIL], contracts };
}

/** One command, chosen without looking at whether it can succeed: refusals are exercised as much as trades. */
export function randomCommand(rng: Rng, s: EconomyState): EconomyCommand {
  const good = PLAY_GOODS[rng.int(0, PLAY_GOODS.length - 1)]!;
  const market = rng.chance(0.5) ? "granada" : "malaga";
  // Mostly sensible sizes, sometimes far too large.
  const quantity = rng.chance(0.1) ? rng.int(1, 50_000) : rng.int(1, 400);
  const ids = Object.keys(s.contracts);
  const contract = ids[rng.int(0, ids.length - 1)]!;
  const remaining = Math.max(1, s.contracts[contract]!.units - s.contracts[contract]!.delivered);
  switch (rng.int(0, 9)) {
    case 0:
      return { kind: "buy", market, good, quantity };
    case 1:
      // Buying what a contract asks for, so that some contracts can be filled.
      return { kind: "buy", market, good: s.contracts[contract]!.good, quantity: remaining };
    case 2:
    case 3:
      return { kind: "sell", market, good, quantity };
    case 4:
      return { kind: "harvest", good: rng.chance(0.5) ? "olives" : "wheat", quantity, overflow: (["refuse", "leave", "sell", "lose"] as const)[rng.int(0, 3)]!, market };
    case 5:
      return { kind: "process", recipe: PRESS_OIL.id, runs: rng.int(1, 120) };
    case 6:
      return { kind: "accept-contract", contract };
    case 7:
      return { kind: "deliver", contract, quantity: rng.chance(0.5) ? remaining : rng.int(1, 250) };
    case 8:
      // Cancelling is the rarer choice, or no contract would ever live long enough to be settled.
      return rng.chance(0.2) ? { kind: "cancel-contract", contract } : { kind: "deliver", contract, quantity: remaining };
    default:
      return { kind: "advance", ticks: rng.int(1, 3) };
  }
}
