// The locked box's rules: each way of playing has one answer and the fewest moves it states, every move keeps the
// answer (which is what makes the rules honest), slips are counted and explained by the way of playing, the four
// goals, a saved place that is proved by search, and the problem said in words with the right form in all seven
// languages.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Rng } from "@im/kernel/prng";
import { describe, expect, it } from "vitest";
import { ALGEBRA_RECORDS, ALGEBRA_SLACK, algebraStart, amountWords, equationWords, sideWords, thingKey } from "../content/algebra";
import { ALGEBRA_ART, trayLayout } from "../art/algebra";
import {
  ALGEBRA_FLAGS,
  ALL_MOVES,
  algebraGoals,
  applyAlgebra,
  available,
  balance,
  equation,
  fewest,
  keyOf,
  moveName,
  newAlgebra,
  play,
  reachable,
  restore,
  restoreAlgebra,
  sameEquation,
  share,
  shortest,
  side,
  snapshotAlgebra,
  solved,
  tryMove,
  valueOf,
  type AlgebraCommand,
  type AlgebraState,
  type AlgebraStyle,
  type Equation,
  type Move,
} from "../sim/algebra";

const STYLES: AlgebraStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const run = (s: AlgebraState, cs: AlgebraCommand[]) => cs.reduce(applyAlgebra, s);
const fresh = (style: AlgebraStyle) => newAlgebra(style, algebraStart(style));
const solve = (style: AlgebraStyle): Move[] => shortest(algebraStart(style))!;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;

describe("the three problems", () => {
  it("are the problems the quest says, each with a positive whole number for an answer", () => {
    expect(algebraStart("story")).toEqual(equation({ things: 2, number: 3 }, { things: 1, number: 8 }));
    expect(algebraStart("explorer")).toEqual(equation({ things: 3, lessNumber: 4 }, { things: 1, number: 6 }));
    expect(algebraStart("challenge")).toEqual(equation({ things: 4, lessNumber: 7 }, { number: 13, lessThings: 1 }));
    expect(STYLES.map((s) => valueOf(algebraStart(s)))).toEqual([5, 5, 4]);
    for (const s of STYLES) {
      expect(Number.isInteger(valueOf(algebraStart(s)))).toBe(true);
      expect(valueOf(algebraStart(s))!).toBeGreaterThan(0);
      expect(solved(algebraStart(s))).toBe(false);
    }
    expect(ALGEBRA_SLACK).toEqual({ story: null, explorer: 2, challenge: 0 });
  });
  it("have the fewest moves they state, found by search, and the kinds of move that are really needed", () => {
    expect(STYLES.map((s) => fewest(algebraStart(s)))).toEqual([2, 3, 3]);
    const types = (s: AlgebraStyle) => solve(s).map((m) => m.type);
    // Story: two balances, no restoring (and no sharing either).
    expect(types("story")).toEqual(["balance", "balance"]);
    expect(fewest(algebraStart("story"), ["balance"])).toBe(2);
    // Explorer: one restore, one balance and one share, and the problem cannot be done without any one of the three.
    expect(types("explorer").sort()).toEqual(["balance", "restore", "share"]);
    for (const left of [["balance", "share"], ["restore", "share"], ["restore", "balance"]] as const) expect(fewest(algebraStart("explorer"), left)).toBeNull();
    // Challenge: two restores, then a share of twenty among five; neither can be left out.
    expect(types("challenge")).toEqual(["restore", "restore", "share"]);
    for (const left of [["balance", "share"], ["restore", "balance"], ["restore"]] as const) expect(fewest(algebraStart("challenge"), left)).toBeNull();
    const path = solve("challenge");
    const afterRestores = path.slice(0, 2).reduce((e, m) => tryMove(e, m)!, algebraStart("challenge"));
    expect(afterRestores).toEqual(equation({ things: 5 }, { number: 20 }));
    expect(tryMove(afterRestores, path[2]!)).toEqual(equation({ things: 1 }, { number: 4 }));
  });
  it("end with one thing equal to the answer, whichever way they are brought home", () => {
    for (const style of STYLES) {
      const end = solve(style).reduce((e, m) => tryMove(e, m)!, algebraStart(style));
      expect(solved(end)).toBe(true);
      expect(end.left).toEqual(side({ things: 1 }));
      expect(end.right).toEqual(side({ number: valueOf(algebraStart(style))! }));
    }
  });
  it("reach no state where nothing can be done: from every state that is not home some move works", () => {
    for (const style of STYLES) {
      const all = reachable(algebraStart(style));
      expect(all.size).toBeGreaterThan(3);
      for (const key of all.keys()) {
        const e = parse(key);
        expect(solved(e) || available(e).length > 0, key).toBe(true);
        expect(fewest(e), key).not.toBeNull();
      }
    }
  });
});

/** The inverse of keyOf, for the search tests. */
function parse(key: string): Equation {
  const [l, r] = key.split("|").map((x) => x.split(",").map(Number)) as [number[], number[]];
  const mk = (a: number[]) => side({ things: a[0]!, number: a[1]!, lessThings: a[2]!, lessNumber: a[3]! });
  return { left: mk(l), right: mk(r) };
}

describe("every move keeps the answer", () => {
  it("in every state reachable from the three authored problems", () => {
    for (const style of STYLES) {
      const x = valueOf(algebraStart(style));
      for (const key of reachable(algebraStart(style)).keys()) {
        const e = parse(key);
        expect(valueOf(e), key).toBe(x);
        for (const m of ALL_MOVES) {
          const n = tryMove(e, m);
          if (n) expect(valueOf(n), `${key} ${moveName(m)}`).toBe(x);
        }
      }
    }
  });
  /** A problem built so that one thing is worth `x`: random amounts on each side, then the number on the right is set to make it so. */
  function random(rng: Rng): Equation {
    for (;;) {
      const left = side({ things: rng.int(0, 6), number: rng.int(0, 9), lessThings: rng.int(0, 4), lessNumber: rng.int(0, 6) });
      const right = side({ things: rng.int(0, 6), lessThings: rng.int(0, 4) });
      const x = rng.int(1, 9);
      const c = left.things - left.lessThings - (right.things - right.lessThings);
      if (c === 0) continue;
      const target = left.number - left.lessNumber + c * x; // what the right side's number must be worth
      right.number = Math.max(target, 0);
      right.lessNumber = Math.max(-target, 0);
      const e = { left, right };
      if (valueOf(e) === x) return e;
    }
  }
  it("in a few hundred random valid equations, for every move that applies, one step and a walk", () => {
    const rng = new Rng("algebra-property");
    let applied = 0;
    const kinds = new Set<string>();
    for (let i = 0; i < 400; i++) {
      let e = random(rng);
      const x = valueOf(e)!;
      for (let step = 0; step < 6; step++) {
        const ms = available(e);
        for (const m of ms) {
          const n = tryMove(e, m)!;
          expect(valueOf(n), `${keyOf(e)} ${moveName(m)}`).toBe(x);
          expect(sameEquation(n, e)).toBe(false);
          applied++;
          kinds.add(moveName(m));
        }
        if (ms.length === 0) break;
        e = tryMove(e, ms[rng.int(0, ms.length - 1)]!)!;
      }
    }
    expect(applied).toBeGreaterThan(1000);
    // Every kind of move but sharing (tried on its own below) was met by the random search, so the property is not about only some of them.
    for (const m of ALL_MOVES) if (m.type !== "share") expect(kinds.has(moveName(m)), moveName(m)).toBe(true);
  });
  it("in sharing, whatever the sides: a number shared among n things is the thing's worth", () => {
    const rng = new Rng("algebra-share");
    for (let i = 0; i < 100; i++) {
      const n = rng.int(2, 9);
      const x = rng.int(1, 12);
      const e = rng.chance(0.5) ? equation({ things: n }, { number: n * x }) : equation({ number: n * x }, { things: n });
      expect(valueOf(e)).toBe(x);
      const out = share(e)!;
      expect(solved(out)).toBe(true);
      expect(valueOf(out)).toBe(x);
    }
  });
});

describe("the moves", () => {
  it("restore: adds what is taken away to both sides, cancelling what is taken away there too, and changes nothing if nothing is taken", () => {
    const e = algebraStart("explorer");
    expect(restore(e, "left", "number")).toEqual(equation({ things: 3 }, { things: 1, number: 10 }));
    expect(restore(e, "left", "things")).toBeNull();
    expect(restore(e, "right", "number")).toBeNull();
    // Both sides have something taken away: restoring the left's cancels what the right had taken away.
    const both = equation({ things: 3, lessNumber: 4 }, { things: 1, number: 3, lessNumber: 1 });
    expect(restore(both, "left", "number")).toEqual(equation({ things: 3 }, { things: 1, number: 6 }));
    expect(valueOf(both)).toBe(3);
    expect(valueOf(restore(both, "left", "number")!)).toBe(3);
    // A side that has something taken away in a kind it also has: the same.
    expect(restore(equation({ things: 4, lessThings: 3 }, { number: 8 }), "left", "things")).toEqual(equation({ things: 4 }, { number: 8, things: 3 }));
  });
  it("balance: takes the smaller amount of a kind that stands on both sides from both, and changes nothing otherwise", () => {
    const e = algebraStart("story");
    expect(balance(e, "things")).toEqual(equation({ things: 1, number: 3 }, { number: 8 }));
    expect(balance(e, "number")).toEqual(equation({ things: 2 }, { things: 1, number: 5 }));
    expect(balance(algebraStart("explorer"), "number")).toBeNull(); // the left only has a number taken away
    expect(balance(algebraStart("challenge"), "things")).toBeNull();
    expect(balance(equation({ things: 2 }, { things: 2, number: 1 }), "things")).toEqual(equation({}, { number: 1 }));
  });
  it("share: one side only things, the other only a number that divides evenly, either way round; nothing otherwise", () => {
    expect(share(equation({ things: 5 }, { number: 20 }))).toEqual(equation({ things: 1 }, { number: 4 }));
    expect(share(equation({ number: 20 }, { things: 5 }))).toEqual(equation({ number: 4 }, { things: 1 }));
    expect(share(equation({ things: 3 }, { number: 20 }))).toBeNull(); // does not divide
    expect(share(equation({ things: 5, number: 1 }, { number: 20 }))).toBeNull();
    expect(share(equation({ things: 5 }, { number: 20, lessThings: 1 }))).toBeNull();
    expect(share(equation({ things: 1 }, { number: 4 }))).toBeNull(); // already home
    expect(share(algebraStart("story"))).toBeNull();
  });
  it("find home exactly when one thing is alone on a side and a number alone on the other, either way round", () => {
    expect(solved(equation({ things: 1 }, { number: 4 }))).toBe(true);
    expect(solved(equation({ number: 4 }, { things: 1 }))).toBe(true);
    for (const e of [equation({ things: 2 }, { number: 4 }), equation({ things: 1 }, { number: 0 }), equation({ things: 1, number: 1 }, { number: 4 }), equation({ things: 1 }, { number: 4, lessNumber: 1 })]) expect(solved(e)).toBe(false);
  });
  it("have a value only when there is a positive whole one", () => {
    expect(valueOf(equation({ things: 2 }, { things: 2, number: 3 }))).toBeNull(); // no things to find
    expect(valueOf(equation({ things: 2 }, { number: 5 }))).toBeNull(); // not whole
    expect(valueOf(equation({ things: 1, number: 5 }, { number: 2 }))).toBeNull(); // not positive
    expect(valueOf(equation({ things: 2 }, { number: 8 }))).toBe(4);
  });
});

describe("slips", () => {
  it("count a move that does nothing, say why, and leave the problem alone", () => {
    const s = fresh("explorer");
    const slipped = play(s, { type: "balance", kind: "number" });
    expect(slipped.eq).toBe(s.eq);
    expect([slipped.moves, slipped.slips, slipped.done]).toEqual([0, 1, false]);
    expect(slipped.last).toEqual({ move: { type: "balance", kind: "number" }, applied: false, slip: "not-on-both" });
    expect(play(s, { type: "restore", side: "right", kind: "things" }).last).toMatchObject({ applied: false, slip: "nothing-taken" });
    expect(play(s, { type: "share" }).last).toMatchObject({ applied: false, slip: "cannot-share" });
    // A move that works is a move, not a slip, and says so.
    const worked = play(s, { type: "restore", side: "left", kind: "number" });
    expect([worked.moves, worked.slips]).toEqual([1, 0]);
    expect(worked.last).toEqual({ move: { type: "restore", side: "left", kind: "number" }, applied: true, slip: null });
  });
  it("are counted again each time the same move is tried", () => {
    const s = run(fresh("story"), [{ type: "share" }, { type: "share" }, { type: "restore", side: "left", kind: "things" }]);
    expect([s.moves, s.slips]).toEqual([0, 3]);
  });
  it("never come from a move that is among the ones available now", () => {
    for (const style of STYLES) {
      for (const key of reachable(algebraStart(style)).keys()) {
        const e = parse(key);
        for (const m of ALL_MOVES) expect(tryMove(e, m) !== null, `${key} ${moveName(m)}`).toBe(available(e).some((a) => moveName(a) === moveName(m)));
      }
    }
  });
});

describe("opening the box", () => {
  it.each(STYLES)("is done on the fewest moves with no slips, and nothing changes afterwards, in %s", (style) => {
    let s = fresh(style);
    for (const m of solve(style)) s = applyAlgebra(s, m);
    expect([s.done, s.moves, s.slips]).toEqual([true, fewest(algebraStart(style)), 0]);
    expect(solved(s.eq)).toBe(true);
    expect(run(s, [{ type: "share" }, { type: "flag", flag: "feather" }, { type: "balance", kind: "things" }])).toBe(s);
  });
  it("is not done while the problem is only partly brought home", () => {
    const s = run(fresh("story"), [{ type: "balance", kind: "things" }]);
    expect([s.done, s.moves]).toEqual([false, 1]);
  });
});

describe("the four goals", () => {
  it("are the same four every quest has, and Ingenuity counts slips and moves beyond the fewest only where a way of playing has a count", () => {
    let s = fresh("explorer");
    s = run(s, [{ type: "flag", flag: "askedWords" }, { type: "flag", flag: "askedWords" }, { type: "flag", flag: "nonsense" as never }]);
    expect(s.flags).toEqual(["askedWords"]);
    expect(algebraGoals(s, 2)).toMatchObject({ turns: 0, slips: 0, curiosity: false, ingenuity: true, kindness: false, feather: false });
    s = run(s, [{ type: "flag", flag: "askedOps" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }]);
    expect(algebraGoals(s, 2)).toMatchObject({ curiosity: true, kindness: true, feather: true });
    expect([...ALGEBRA_FLAGS]).toEqual(["askedWords", "askedOps", "kind", "feather", "answered"]);
  });
  it("Explorer allows two slips and two moves more than the fewest; Challenge allows none of either; Story has no count", () => {
    const slips = (n: number): Move[] => Array.from({ length: n }, () => ({ type: "share" }) as Move);
    const finish = (style: AlgebraStyle, extra: Move[], before: Move[]) => run(fresh(style), [...before, ...extra]);
    const good = (style: AlgebraStyle) => solve(style);
    // Explorer: two slips are all right, three are not.
    expect(algebraGoals(finish("explorer", good("explorer"), slips(2)), ALGEBRA_SLACK.explorer).ingenuity).toBe(true);
    expect(algebraGoals(finish("explorer", good("explorer"), slips(3)), ALGEBRA_SLACK.explorer).ingenuity).toBe(false);
    // Challenge: the shortest way is allowed, a slip is not.
    expect(algebraGoals(finish("challenge", good("challenge"), []), ALGEBRA_SLACK.challenge)).toMatchObject({ ingenuity: true, turns: 3, slips: 0 });
    expect(algebraGoals(finish("challenge", good("challenge"), slips(1)), ALGEBRA_SLACK.challenge)).toMatchObject({ ingenuity: false, slips: 1 });
    // Story: whatever happened.
    expect(algebraGoals(finish("story", good("story"), slips(9)), ALGEBRA_SLACK.story).ingenuity).toBe(true);
  });
  it("count the moves beyond the fewest as well as the slips", () => {
    let s = fresh("explorer");
    for (const m of solve("explorer")) s = applyAlgebra(s, m);
    expect(s.moves).toBe(3);
    // The problems have no honest way longer than the fewest, so the count is shown on the record itself: more moves than the fewest plus the allowance fails the goal even with no slips.
    expect(algebraGoals({ ...s, moves: 6, slips: 0 }, 2).ingenuity).toBe(false);
    expect(algebraGoals({ ...s, moves: 5, slips: 0 }, 2).ingenuity).toBe(true);
    expect(algebraGoals({ ...s, moves: 3, slips: 2 }, 2).ingenuity).toBe(true);
    expect(algebraGoals({ ...s, moves: 4, slips: 0 }, 0).ingenuity).toBe(false);
    // Every way of coming home has the same number of moves, in every way of playing, so that the count never punishes a different honest order.
    for (const style of STYLES) {
      const all = reachable(algebraStart(style));
      const homes = [...all].filter(([k]) => solved(parse(k))).map(([, d]) => d);
      expect(homes.length).toBeGreaterThan(0);
      expect(new Set(homes).size).toBe(1);
      expect(homes[0]).toBe(fewest(algebraStart(style)));
    }
  });
  it("name the records the results link to, and each is a museum record that exists", () => {
    expect([...ALGEBRA_RECORDS]).toEqual(["person/al-khwarizmi", "work/al-jabr-wal-muqabala", "invention/algebra"]);
    for (const id of ALGEBRA_RECORDS) expect(existsSync(resolve(__dirname, "..", "..", "..", "..", "..", "data", `${id}.yaml`)), id).toBe(true);
  });
});

describe("the box kept in the middle", () => {
  const through = (s: AlgebraState) => restoreAlgebra(JSON.parse(JSON.stringify(snapshotAlgebra(s))), algebraStart);
  const started = (style: AlgebraStyle) => run(fresh(style), [solve(style)[0]!, { type: "share" }, { type: "flag", flag: "feather" }]);
  const snap = (style: AlgebraStyle) => JSON.parse(JSON.stringify(snapshotAlgebra(started(style)))) as Record<string, unknown>;
  const refused = (x: unknown) => restoreAlgebra(x, algebraStart);

  it.each(STYLES)("comes back through JSON as it was, with nothing shown and not done, in %s", (style) => {
    const s = started(style);
    const back = through(s)!;
    expect(back).not.toBeNull();
    expect(back.eq).toEqual(s.eq);
    expect([back.style, back.flags, back.moves, back.slips, back.last, back.done]).toEqual([style, s.flags, s.moves, s.slips, null, false]);
    expect(back.start).toEqual(algebraStart(style));
    // And it can be played on to its end.
    const rest = shortest(back.eq)!;
    expect(rest.length).toBeGreaterThan(0);
    expect(run(back, rest).done).toBe(true);
  });
  it("keeps a box with nothing changed too, and every state the problem can reach", () => {
    expect(restoreAlgebra(snapshotAlgebra(fresh("story")), algebraStart)).not.toBeNull();
    for (const style of STYLES) {
      for (const [key, d] of reachable(algebraStart(style))) {
        const e = parse(key);
        const back = refused({ style, eq: e, moves: d, slips: 0, flags: [] });
        expect(back === null, key).toBe(solved(e));
      }
    }
  });
  it("refuses an equation of the right shape that cannot be reached from the start, proved by search and not by its numbers", () => {
    const good = snap("explorer");
    const reach = reachable(algebraStart("explorer"));
    // A problem the start does reach, not yet home, is accepted at the number of moves that reach it.
    const reached = equation({ things: 2 }, { number: 10 });
    expect(reach.get(keyOf(reached))).toBe(2);
    expect(refused({ ...good, eq: reached, moves: 2 })).not.toBeNull();
    expect(refused({ ...good, eq: reached, moves: 1 })).toBeNull(); // not in fewer moves than the fewest
    // Doubled: the same answer, the same shape, whole numbers, and not a state of the search.
    const doubled = equation({ things: 6, lessNumber: 8 }, { things: 2, number: 12 });
    expect(valueOf(doubled)).toBe(valueOf(algebraStart("explorer")));
    expect(reach.has(keyOf(doubled))).toBe(false);
    for (const e of [doubled, equation({ things: 7, lessNumber: 4 }, { things: 1, number: 6 }), algebraStart("story"), algebraStart("challenge"), equation({}, {})]) {
      expect(reach.has(keyOf(e)), keyOf(e)).toBe(false);
      expect(refused({ ...good, eq: e, moves: 5 }), keyOf(e)).toBeNull();
    }
    // Home: a box is never restored as opened.
    expect(refused({ ...good, eq: equation({ things: 1 }, { number: 5 }), moves: 3 })).toBeNull();
  });
  it("refuses what cannot be trusted", () => {
    const good = snap("explorer");
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }, { ...good, style: undefined }]) expect(refused(bad)).toBeNull();
    const eq = good.eq as Record<string, Record<string, unknown>>;
    for (const eq2 of [null, undefined, 3, "x", [], {}, { left: eq.left }, { right: eq.right }, { left: null, right: eq.right }, { left: [], right: eq.right }]) expect(refused({ ...good, eq: eq2 })).toBeNull();
    // A side with a missing field, a field that is not a whole number, a negative one, a huge one.
    for (const field of ["things", "number", "lessThings", "lessNumber"]) {
      for (const v of [undefined, null, "3", 1.5, -1, NaN, Infinity, 1e9, 1001, true]) expect(refused({ ...good, eq: { ...eq, left: { ...eq.left, [field]: v } } }), `${field}=${String(v)}`).toBeNull();
    }
    // The count of moves: never fewer than the fewest that reach the problem, always a whole number.
    expect(refused({ ...good, moves: 0 })).toBeNull(); // the start has not been left in zero moves
    for (const moves of [-1, 1.5, "3", null, NaN, Infinity, 1e9]) expect(refused({ ...good, moves })).toBeNull();
    expect(refused({ ...good, moves: undefined })).toBeNull();
    expect(refused({ ...good, moves: 40 })!.moves).toBe(40);
    // The count of slips.
    for (const slips of [-1, 1.5, "3", null, NaN, Infinity, 1e9]) expect(refused({ ...good, slips })).toBeNull();
    expect(refused({ ...good, slips: undefined })).toBeNull();
    expect(refused({ ...good, slips: 3 })!.slips).toBe(3);
    // Flags that are not a list.
    expect(refused({ ...good, flags: "feather" })).toBeNull();
    expect(refused({ ...good, flags: undefined })).toBeNull();
  });
  it("drops flags it does not know, keeps the ones it does, and never takes a finish, a reading or a problem's start from the file", () => {
    const back = refused({ ...snap("explorer"), flags: ["feather", "askedWords", "nonsense", 7, "kind", "kind"], done: true, last: { applied: true }, start: equation({ things: 1 }, { number: 1 }) })!;
    expect(back.flags).toEqual(["askedWords", "kind", "feather"]);
    expect([back.done, back.last]).toEqual([false, null]);
    expect(back.start).toEqual(algebraStart("explorer"));
  });
});

describe("the messenger's answer, the child's, is kept whichever it was", () => {
  it("keeps `answered` for a blunt answer too, without making it a goal, and a resume still knows", () => {
    const blunt = run(fresh("explorer"), [{ type: "flag", flag: "answered" }]);
    expect(blunt.flags).toEqual(["answered"]);
    expect(algebraGoals(blunt, 2).kindness).toBe(false);
    const back = restoreAlgebra(JSON.parse(JSON.stringify(snapshotAlgebra(blunt))), algebraStart)!;
    expect(back.flags).toEqual(["answered"]);
    const kind = run(blunt, [{ type: "flag", flag: "kind" }]);
    expect(restoreAlgebra(JSON.parse(JSON.stringify(snapshotAlgebra(kind))), algebraStart)!.flags).toEqual(["kind", "answered"]);
  });
});

describe("the problem in words", () => {
  /** Says a key from a language's table, filling `{name}` parts; a missing key or a part left empty is a fault. */
  const sayFrom = (t: Record<string, string>, used?: Set<string>) => (key: string, vars: Record<string, string | number> = {}) => {
    const text = t[key];
    if (typeof text !== "string" || text.trim() === "") throw new Error(`missing ${key}`);
    used?.add(key);
    return text.replace(/\{(\w+)\}/g, (_, name: string) => {
      if (!(name in vars)) throw new Error(`${key} needs ${name}`);
      return String(vars[name]);
    });
  };
  const west = (n: number) => String(n);
  /** Every distinct problem any of the three ways of playing can come to. */
  const allStates = () => {
    const seen = new Map<string, Equation>();
    for (const style of STYLES) for (const k of reachable(algebraStart(style)).keys()) seen.set(k, parse(k));
    return [...seen.values()];
  };

  it("chooses a form of 'thing' for every amount: one, two, a few (3 to 10) and many (11 and more)", () => {
    expect([1, 2, 3, 10, 11, 20].map((n) => thingKey(n, false))).toEqual(["ak_thing_one", "ak_thing_two", "ak_thing_few", "ak_thing_few", "ak_thing_many", "ak_thing_many"]);
    expect([1, 2, 3].map((n) => thingKey(n, true))).toEqual(["ak_thing_one_obj", "ak_thing_two_obj", "ak_thing_few"]);
  });
  it("keeps every amount in every reachable state to 20 or under, so the forms written cover every case", () => {
    let max = 0;
    for (const e of allStates()) for (const s of [e.left, e.right]) max = Math.max(max, s.things, s.number, s.lessThings, s.lessNumber);
    expect(max).toBeLessThanOrEqual(20);
  });
  it.each(LANGS)("has every part, with no part left empty, for every reachable state of the three problems, in %s", (lang) => {
    const t = table(lang);
    const used = new Set<string>();
    const say = sayFrom(t, used);
    const sentences = new Set<string>();
    const states = allStates();
    for (const e of states) {
      const text = equationWords(e, say, west);
      expect(text, keyOf(e)).not.toMatch(/[{}]/);
      expect(text.trim().length).toBeGreaterThan(3);
      sentences.add(text);
    }
    // Different problems are said differently.
    expect(sentences.size).toBe(states.length);
    for (const k of used) expect(k.startsWith("ak_"), k).toBe(true);
    for (const k of ["ak_eq_sentence", "ak_t_and", "ak_t_less"]) expect(used.has(k), k).toBe(true);
  });
  it("says the starting problems the way the quest says them, in English", () => {
    const say = sayFrom(table("en"));
    expect(equationWords(algebraStart("story"), say, west)).toBe("2 things and 3 equal 1 thing and 8");
    expect(equationWords(algebraStart("explorer"), say, west)).toBe("3 things less 4 equal 1 thing and 6");
    expect(equationWords(algebraStart("challenge"), say, west)).toBe("4 things less 7 equal 13 less 1 thing");
    expect(equationWords(equation({ things: 1 }, { number: 5 }), say, west)).toBe("1 thing equal 5");
  });
  it("says it in Arabic with the right plural: one, two, a few, and the accusative where the thing is not the subject", () => {
    const say = sayFrom(table("ar"));
    const num = (n: number) => new Intl.NumberFormat("ar-EG").format(n);
    expect(equationWords(algebraStart("explorer"), say, num)).toBe("٣ أشياء إلا ٤ تعدل شيئًا واحدًا و٦");
    expect(equationWords(equation({ things: 2, number: 3 }, { things: 2, number: 8 }), say, num)).toBe("شيئان و٣ تعدل شيئين و٨");
    expect(equationWords(equation({ things: 1 }, { number: 5 }), say, num)).toBe("شيء واحد تعدل ٥");
    expect(equationWords(algebraStart("challenge"), say, num)).toBe("٤ أشياء إلا ٧ تعدل ١٣ إلا شيئًا واحدًا");
    expect(sideWords(side({ things: 12 }), true, say, num)).toBe("١٢ شيئًا");
    expect(amountWords("number", 4, false, say, num)).toBe("٤");
    expect(amountWords("things", 2, false, say, num)).toBe("شيئان");
  });
  it.each(LANGS)("has a form for every amount of things up to 20 and for none left out, in %s", (lang) => {
    const t = table(lang);
    const say = sayFrom(t);
    for (let n = 1; n <= 20; n++) for (const object of [false, true]) expect(amountWords("things", n, object, say, west)).not.toMatch(/[{}]/);
    // The forms that have a number in them have it in every language; the forms for one and two may name the amount in words.
    expect(t.ak_thing_few).toContain("{n}");
    expect(t.ak_thing_many).toContain("{n}");
  });
});

describe("the picture", () => {
  it("lays out every reachable state of the three problems inside its tray, with no two things in one place", () => {
    const { trayW, trayH, pad } = ALGEBRA_ART;
    for (const style of STYLES) {
      for (const key of reachable(algebraStart(style)).keys()) {
        const e = parse(key);
        for (const s of [e.left, e.right]) {
          const { items, height } = trayLayout(s);
          expect(items.length).toBe(s.things + s.number + s.lessThings + s.lessNumber);
          expect(height, key).toBeLessThanOrEqual(trayH - 2 * pad - 14);
          const places = new Set(items.map((i) => `${i.x},${i.y}`));
          expect(places.size, key).toBe(items.length);
          for (const i of items) {
            expect(i.x, key).toBeGreaterThan(0);
            expect(i.x, key).toBeLessThan(trayW - 2 * pad);
            expect(i.hollow === (items.indexOf(i) >= s.things + s.number)).toBe(true);
          }
        }
      }
    }
  });
  it("draws what is taken away hollow and everything else solid", () => {
    const { items } = trayLayout(side({ things: 2, number: 3, lessThings: 1, lessNumber: 2 }));
    expect(items.map((i) => `${i.kind}${i.hollow ? "-hollow" : ""}`)).toEqual(["box", "box", "coin", "coin", "coin", "box-hollow", "coin-hollow", "coin-hollow"]);
  });
});
