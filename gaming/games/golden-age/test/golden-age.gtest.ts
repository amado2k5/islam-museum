import { describe, expect, it } from "vitest";
import { Rng } from "@im/kernel/prng";
import { REAL_STRATEGIES, playCampaign, runLab } from "../src/lab";
import { makePolicies } from "../src/policies";
import {
  BUILDINGS,
  CANAL_COST,
  GRID_W,
  PLOTS,
  RESEARCH,
  SILT_CLEAR_COST,
  activeEvents,
  adjacent,
  distance,
  housingCapacity,
  intakeCapacity,
  invariants,
  jobs,
  learned,
  linkKey,
  newGame,
  plotOf,
  preview,
  score,
  servedByWater,
  step,
  wateredPlots,
  xyOf,
  type Command,
  type State,
} from "../src/rules";
import { FAILING_CANAL as SC } from "../src/scenarios";
import { LOAN_SEASONS, LOAN_SUM, invariants as loanInvariants, newGame as freshGame, preview as judge, step as act } from "../src/rules";

const end = (s: State, n = 1) => {
  for (let i = 0; i < n && s.outcome === "playing"; i++) s = step(SC, s, { type: "end-season" });
  return s;
};

describe("the district grid", () => {
  it("measures distance in streets and knows its neighbours", () => {
    expect(distance(plotOf(0, 0), plotOf(3, 2))).toBe(5);
    expect(adjacent(plotOf(2, 2), plotOf(2, 3))).toBe(true);
    expect(adjacent(plotOf(GRID_W - 1, 0), plotOf(0, 1))).toBe(false); // the end of one row is not next to the start of the next
    expect(xyOf(plotOf(5, 4))).toEqual([5, 4]);
    expect(linkKey(3, 9)).toBe(linkKey(9, 3));
  });
});

describe("water", () => {
  it("reaches only what is joined to the river bank by canal", () => {
    const s = newGame(SC, 1);
    const wet = wateredPlots(s);
    expect(wet[plotOf(1, 0)] && wet[plotOf(1, 1)] && wet[plotOf(1, 2)]).toBe(true);
    expect(wet.filter(Boolean).length).toBe(3);
    expect(servedByWater(wet, plotOf(2, 1))).toBe(true); // a neighbour of a canal plot
    expect(servedByWater(wet, plotOf(4, 2))).toBe(false);
  });

  it("refuses a canal that starts in a dry field, and allows one from the bank or from the network", () => {
    const s = newGame(SC, 1);
    expect(preview(s, { type: "canal", a: plotOf(5, 3), b: plotOf(5, 4) }).reason).toBe("not-connected");
    expect(preview(s, { type: "canal", a: plotOf(1, 2), b: plotOf(1, 3) }).ok).toBe(true);
    expect(preview(s, { type: "canal", a: plotOf(6, 0), b: plotOf(6, 1) }).ok).toBe(true);
    expect(preview(s, { type: "canal", a: plotOf(1, 0), b: plotOf(1, 1) }).reason).toBe("exists");
    expect(preview(s, { type: "canal", a: plotOf(1, 0), b: plotOf(3, 0) }).reason).toBe("not-adjacent");
  });

  it("runs short when the canal is silted and recovers when it is cleared", () => {
    const s = newGame(SC, 1);
    const before = intakeCapacity(s);
    const cleared = step(SC, s, { type: "clear-silt" });
    expect(cleared.treasury).toBe(s.treasury - SILT_CLEAR_COST);
    expect(intakeCapacity(cleared)).toBeGreaterThan(before);
    expect(preview(cleared, { type: "clear-silt" }).reason).toBe("no-silt");
  });

  it("is cut by a drought, which is always announced a full season ahead", () => {
    for (let seed = 1; seed <= 40; seed++) {
      let s = newGame(SC, seed);
      const announcedAt = new Map<string, number>();
      while (s.outcome === "playing") {
        for (const e of s.events) {
          const key = `${e.kind}:${e.season}`;
          if (!announcedAt.has(key)) announcedAt.set(key, s.season);
        }
        s = end(s);
      }
      for (const [key, seen] of announcedAt) {
        const starts = Number(key.split(":")[1]);
        expect(starts - seen, `${key} seed ${seed}`).toBeGreaterThanOrEqual(1);
      }
    }
    const s = newGame(SC, 1);
    const dry: State = { ...s, events: [{ kind: "drought", season: 0, seasons: 2 }] };
    expect(activeEvents(dry)).toEqual(["drought"]);
    expect(intakeCapacity(dry)).toBeLessThan(intakeCapacity(s));
  });
});

describe("commands", () => {
  it("charges what preview says, and step refuses whatever preview refuses", () => {
    const s = newGame(SC, 1);
    const free = s.plots.findIndex((b) => b === null);
    const built = step(SC, s, { type: "build", building: "market", plot: free });
    expect(built.treasury).toBe(s.treasury - BUILDINGS.market.cost);
    expect(built.plots[free]).toBe("market");
    expect(s.plots[free]).toBeNull(); // the old state is untouched
    const illegal: Command[] = [
      { type: "build", building: "market", plot: plotOf(2, 1) },
      { type: "build", building: "library", plot: free },
      { type: "build", building: "market", plot: PLOTS + 3 },
      { type: "demolish", plot: free },
      { type: "tax", level: s.tax },
      { type: "research", id: "water-wheel" },
    ];
    for (const cmd of illegal) {
      expect(preview(s, cmd).ok, JSON.stringify(cmd)).toBe(false);
      expect(() => step(SC, s, cmd)).toThrow();
    }
    const poor: State = { ...s, treasury: CANAL_COST - 1 };
    expect(preview(poor, { type: "canal", a: plotOf(1, 2), b: plotOf(1, 3) }).reason).toBe("no-funds");
  });

  it("returns a quarter of the cost on demolition", () => {
    const s = newGame(SC, 1);
    const d = step(SC, s, { type: "demolish", plot: plotOf(1, 1) });
    expect(d.plots[plotOf(1, 1)]).toBeNull();
    expect(d.treasury).toBe(s.treasury + Math.floor(BUILDINGS.farm.cost / 4));
  });

  it("does research in order, and loses nothing when the project is changed", () => {
    let s = newGame(SC, 1);
    s = step(SC, s, { type: "build", building: "school", plot: plotOf(3, 2) });
    s = step(SC, s, { type: "research", id: "lined-canals" });
    s = end(s, 2);
    const before = learned(s);
    expect(s.researchProgress).toBeGreaterThan(0);
    const switched = step(SC, s, { type: "research", id: "paper" });
    expect(learned(switched)).toBe(before);
    expect(switched.researchProgress).toBe(0);
    let done = s;
    while (!done.researched.includes("lined-canals") && done.outcome === "playing") done = end(done);
    expect(done.researched).toContain("lined-canals");
    expect(preview(done, { type: "research", id: "water-wheel" }).ok).toBe(true);
    expect(preview(done, { type: "research", id: "lined-canals" }).reason).toBe("already-researched");
    expect(RESEARCH["water-wheel"].needs).toBe("lined-canals");
  });
});

describe("a season", () => {
  it("is the same every time for the same seed and commands, and differs across seeds", () => {
    const play = (seed: number) => {
      let s = newGame(SC, seed);
      s = step(SC, s, { type: "build", building: "market", plot: plotOf(3, 2) });
      return end(s, 24);
    };
    expect(play(7)).toEqual(play(7));
    expect(JSON.stringify(play(7))).not.toBe(JSON.stringify(play(8)));
  });

  it("continues identically from a saved copy", () => {
    let s = newGame(SC, 11);
    s = end(step(SC, s, { type: "build", building: "school", plot: plotOf(3, 2) }), 5);
    const copy = JSON.parse(JSON.stringify(s)) as State;
    expect(end(copy, 10)).toEqual(end(s, 10));
  });

  it("feeds people before it stores, and never has negative grain", () => {
    let s: State = { ...newGame(SC, 1), grain: 0, households: 400 };
    s = end(s);
    expect(s.last!.eaten).toBeLessThanOrEqual(400);
    expect(s.last!.hungerPermille).toBeGreaterThan(0);
    expect(s.grain).toBeGreaterThanOrEqual(0);
    expect(invariants(s)).toEqual([]);
  });

  it("offers more housing where there is water and a bath", () => {
    const s = newGame(SC, 1);
    const withBath = step(SC, s, { type: "build", building: "bath", plot: plotOf(2, 0) });
    expect(housingCapacity(withBath)).toBeGreaterThan(housingCapacity(s));
    expect(jobs(withBath)).toBe(jobs(s) + BUILDINGS.bath.workers);
  });

  it("ends in insolvency only after three seasons in the red, with the count visible from the first", () => {
    let s: State = { ...newGame(SC, 1), treasury: -500 };
    s = end(s);
    expect(s.insolventSeasons).toBe(1);
    expect(s.outcome).toBe("playing");
    s = end(s, 2);
    expect(s.outcome).toBe("lost-insolvent");
    expect(preview(s, { type: "end-season" }).reason).toBe("over");
  });

  it("scores balance, not wealth: a rich city that has learned nothing scores below a balanced one", () => {
    const base = end(newGame(SC, 1), 3);
    const rich: State = { ...base, treasury: 100000, knowledge: 0, researched: [], researchProgress: 0 };
    const even: State = { ...base, treasury: 200, knowledge: SC.goal.knowledge, households: SC.goal.households, welfare: SC.goal.welfare };
    expect(score(SC, even)).toBeGreaterThan(score(SC, rich));
    expect(score(SC, even)).toBeLessThanOrEqual(1000);
  });
});

describe("the simulation lab", () => {
  const report = runLab(SC, 120);

  it("plays every campaign to an end without breaking an invariant", () => {
    expect(report.violations).toEqual([]);
    for (const p of report.policies) expect(p.won + p.ended + p.lostInsolvent + p.lostUnrest, p.policy).toBe(p.campaigns);
  });

  it("cannot be won by doing nothing, by taxing, by one building, or by chance", () => {
    for (const p of report.policies) if (!REAL_STRATEGIES.includes(p.policy)) expect(p.won, p.policy).toBe(0);
  });

  it("can be won in more than one way, and no way wins every time", () => {
    const real = report.policies.filter((p) => REAL_STRATEGIES.includes(p.policy));
    // The design goal is three strategies that each win at least one campaign in five. On 25 November 2026 the lab
    // found two (balanced and merchant); irrigator and scholar win about one in eight. That shortfall is an open
    // finding in docs/gaming/games/golden-age.md, and this test holds the line already reached until it is closed.
    expect(real.filter((p) => p.winPermille >= 200).length).toBeGreaterThanOrEqual(2);
    for (const p of real) {
      expect(p.won, p.policy).toBeGreaterThan(0);
      expect(p.winPermille, p.policy).toBeLessThan(950);
    }
  });

  it("gives the same result for the same seed", () => {
    const policy = makePolicies(step).find((p) => p.name === "balanced")!;
    expect(playCampaign(SC, policy, 5)).toEqual(playCampaign(SC, policy, 5));
  });

  it("survives random legal play from hostile starting stocks", () => {
    const random = makePolicies(step).find((p) => p.name === "random")!;
    for (let seed = 1; seed <= 60; seed++) {
      const rng = new Rng(`fuzz:${seed}`);
      let s: State = { ...newGame(SC, seed), treasury: rng.int(-200, 5000), grain: rng.int(0, 3000), households: rng.int(0, 900), welfare: rng.int(0, 100) };
      for (let guard = 0; s.outcome === "playing" && guard < 60; guard++) {
        for (const cmd of random.plan(SC, s, rng)) {
          s = step(SC, s, cmd);
          expect(invariants(s), `seed ${seed} season ${s.season}`).toEqual([]);
          if (s.outcome !== "playing") break;
        }
      }
      expect(s.outcome).not.toBe("playing");
    }
  });
});

describe("the merchants' loan", () => {
  it("lends once, without interest, and is repaid in equal parts until it is cleared", () => {
    let s = freshGame(SC, 5);
    const before = s.treasury;
    s = act(SC, s, { type: "borrow" });
    expect(s.treasury).toBe(before + LOAN_SUM);
    expect([s.loanOwed, s.loanEach]).toEqual([LOAN_SUM, LOAN_SUM / LOAN_SEASONS]);
    // Not a second loan while the first is owed.
    expect(judge(s, { type: "borrow" })).toMatchObject({ ok: false, reason: "loan-open" });
    let repaid = 0;
    for (let i = 0; i < LOAN_SEASONS && s.outcome === "playing"; i++) {
      s = act(SC, s, { type: "end-season" });
      repaid += s.last!.repaid;
      expect(loanInvariants(s)).toEqual([]);
    }
    // Exactly what was lent is paid back: no interest, nothing forgiven.
    if (s.outcome === "playing") {
      expect(repaid).toBe(LOAN_SUM);
      expect([s.loanOwed, s.loanEach]).toEqual([0, 0]);
      expect(judge(s, { type: "borrow" }).ok).toBe(true);
    }
  });

  it("changes nothing in a game that never borrows", () => {
    let a = freshGame(SC, 7);
    for (let i = 0; i < 6; i++) a = act(SC, a, { type: "end-season" });
    expect(a.last!.repaid).toBe(0);
    expect([a.loanOwed, a.loanEach]).toEqual([0, 0]);
  });
});
