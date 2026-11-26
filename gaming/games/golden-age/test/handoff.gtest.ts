// The two games of the third chapter that an outside reviewer played on UAT on 26 November 2026, kept so that every
// later release is held to what was seen (docs/gaming/spec-production, scenario GA-07 of its regression matrix).
// It built one workshop and one market, set the heavy tax, did nothing else for twenty seasons, and ended with 2,248
// coins, trade of 72 a season, 204 households of 380, and every goal but none met: rich, and not a win. Its other
// game traded and also built, taught, healed and endowed, and won.
//
// These are the rules' own numbers for those two ways of playing. They are a record, not a verdict that the balance
// is right: that a trading city which also builds wins every time is an open finding (docs/gaming/games/golden-age.md),
// and the work on the economy is expected to change these figures on purpose, here, in the same change.
import { describe, expect, it } from "vitest";
import { playCampaign } from "../src/lab";
import { makePolicies } from "../src/policies";
import { PLOTS, newGame, preview, step, type Command, type State } from "../src/rules";
import { WHAT_ENDURES as E } from "../src/scenarios";
import { goals } from "../src/ui/model";

const SEEDS = 200;

/** One workshop and one market on the first plots that take them, the heavy tax, and then nothing for twenty seasons. */
function tradeAndTaxAlone(seed: number): State {
  let s = newGame(E, seed);
  for (const building of ["workshop", "market"] as const) {
    for (let plot = 0; plot < PLOTS; plot++) {
      const c: Command = { type: "build", building, plot };
      if (preview(s, c).ok) {
        s = step(E, s, c);
        break;
      }
    }
  }
  s = step(E, s, { type: "tax", level: 2 });
  while (s.outcome === "playing") s = step(E, s, { type: "end-season" });
  return s;
}

describe("What Endures, as the outside reviewer played it (GA-07)", () => {
  it("ends rich and unwon for a steward who trades, taxes heavily and does nothing else", () => {
    const trade = new Map<number, number>();
    for (let seed = 1; seed <= SEEDS; seed++) {
      const s = tradeAndTaxAlone(seed);
      expect(s.outcome, `seed ${seed}`).toBe("ended");
      expect(s.season).toBe(E.seasons);
      // Rich: more than ten times what the chapter starts with (the reviewer ended with 2,248).
      expect(s.treasury, `seed ${seed}`).toBeGreaterThan(E.start.treasury * 10);
      trade.set(s.last!.income.trade, (trade.get(s.last!.income.trade) ?? 0) + 1);
      // And nothing else done: no household gained, no endowment, and every goal of the chapter unmet.
      expect(s.households).toBeLessThanOrEqual(204);
      expect(s.endowed).toEqual([]);
      expect(goals(E, s).rows.filter((r) => !r.met).map((r) => r.id).sort()).toEqual(["endowments", "households", "knowledge", "welfare"]);
    }
    // One workshop and one market trade 72 a season, as the reviewer read off the screen; a season with an event in
    // it can differ, so what is held is the usual figure and that trade never falls under it.
    expect(trade.get(72) ?? 0).toBeGreaterThan(SEEDS / 2);
    expect(Math.min(...trade.keys())).toBe(72);
  });

  it("is won by the trading city that also builds, teaches and endows", () => {
    const merchant = makePolicies(step).find((p) => p.name === "merchant")!;
    let won = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const r = playCampaign(E, merchant, seed);
      expect(r.violations, `seed ${seed}`).toEqual([]);
      if (r.outcome === "won") won++;
    }
    // Today it wins all forty, which is the open finding; what is held here is only that trading well can win.
    expect(won).toBeGreaterThan(20);
  });
});
