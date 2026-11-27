// The scattered sheets' rules: each map has one arrangement only (proved by search), a border that carries nothing, no
// two sheets alike, and the fewest exchanges it states (proved against a brute search on the small map); seams are
// listed and matched; an exchange is a move, a check is shown only when asked and a failed one is counted; the four
// goals; a saved place that is proved, not trusted; the picture's hit-test both ways round; and the words in all
// seven languages, with the lines written for the quest kept exactly.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Rng } from "@im/kernel/prng";
import { describe, expect, it } from "vitest";
import { NEAR_ALIKE, SHEETS_RECORDS, SHEETS_SLACK, sheetsIntended, sheetsMap } from "../content/sheets";
import { SHEETS_ART, sheetOrigin, sheetsHit, sheetsLayout } from "../art/sheets";
import {
  FEATURES,
  SHEETS_FLAGS,
  allSeams,
  applySheets,
  borderSeams,
  check,
  decodeEdge,
  distance,
  edgeCode,
  exchange,
  fewest,
  fewestFromStart,
  gridOf,
  inOrder,
  isEdgeCode,
  newSheets,
  restoreSheets,
  seams,
  sheetsGoals,
  snapshotSheets,
  solutions,
  tally,
  wrongPlaces,
  type SheetsCommand,
  type SheetsState,
  type SheetsStyle,
} from "../sim/sheets";

const STYLES: SheetsStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const root = resolve(__dirname, "..", "..", "..", "..", "..");
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const fresh = (style: SheetsStyle) => newSheets(style, sheetsMap(style));
const run = (s: SheetsState, cs: SheetsCommand[]) => cs.reduce(applySheets, s);
/** The exchanges that put the sheets in order, one at a time: for each place that is wrong, bring the right sheet there. */
function path(s: SheetsState): [number, number][] {
  const grid = [...s.grid];
  const out: [number, number][] = [];
  for (let p = 0; p < grid.length; p++) {
    if (grid[p] === s.solution[p]) continue;
    const q = grid.indexOf(s.solution[p]!);
    [grid[p], grid[q]] = [grid[q]!, grid[p]!];
    out.push([p, q]);
  }
  return out;
}
const solve = (s: SheetsState) => run(s, path(s).map(([a, b]) => ({ type: "exchange", a, b }) as SheetsCommand));
/** Every arrangement of 0..n-1, for the brute search. */
function* permutations(items: number[]): Generator<number[]> {
  if (items.length <= 1) return yield items;
  for (let i = 0; i < items.length; i++) for (const rest of permutations([...items.slice(0, i), ...items.slice(i + 1)])) yield [items[i]!, ...rest];
}

describe("the three maps", () => {
  it("are the size the quest says, with the number of sheets that lie out of place and the fewest exchanges it states", () => {
    const shape = STYLES.map((s) => [sheetsMap(s).rows, sheetsMap(s).cols, sheetsMap(s).sheets.length, wrongPlaces(fresh(s)), fewest(fresh(s))]);
    expect(shape).toEqual([
      [2, 3, 6, 4, 2],
      [3, 4, 12, 8, 5],
      [3, 5, 15, 15, 11],
    ]);
    // Story: two pairs exchanged. Explorer: six or more wrong. Challenge: every sheet out of place.
    expect(wrongPlaces(fresh("explorer"))).toBeGreaterThanOrEqual(6);
    expect(fresh("challenge").grid.every((id, p) => id !== fresh("challenge").solution[p])).toBe(true);
    for (const s of STYLES) expect(fewest(fresh(s))).toBe(fewestFromStart(fresh(s)));
  });
  it.each(STYLES)("has exactly one arrangement that makes every seam match, and it is the one written for it, in %s", (style) => {
    const def = sheetsMap(style);
    const all = solutions(def.sheets, def.rows, def.cols);
    expect(all).toEqual([[...sheetsIntended(style)]]);
    expect(fresh(style).solution).toEqual(sheetsIntended(style));
    expect(inOrder({ ...fresh(style), grid: sheetsIntended(style) })).toBe(true);
    expect(inOrder(fresh(style))).toBe(false);
  });
  it.each(STYLES)("has a border that carries nothing, and no two sheets alike, in %s", (style) => {
    const def = sheetsMap(style);
    const g = gridOf({ ...fresh(style), grid: sheetsIntended(style) });
    expect(borderSeams(g).every((x) => x.match)).toBe(true);
    for (let p = 0; p < g.cells.length; p++) {
      const r = Math.floor(p / def.cols);
      const c = p % def.cols;
      const sh = g.cells[p]!;
      if (r === 0) expect(sh.n).toBe(0);
      if (r === def.rows - 1) expect(sh.s).toBe(0);
      if (c === 0) expect(sh.w).toBe(0);
      if (c === def.cols - 1) expect(sh.e).toBe(0);
    }
    const keys = def.sheets.map((sh) => `${sh.n},${sh.e},${sh.s},${sh.w}`);
    expect(new Set(keys).size).toBe(keys.length);
    // Sheets are numbered 1 and up in order, every code is a real one, and every sheet carries something.
    def.sheets.forEach((sh, i) => {
      expect(sh.id).toBe(i + 1);
      for (const code of [sh.n, sh.e, sh.s, sh.w]) expect(isEdgeCode(code), `${sh.id}:${code}`).toBe(true);
      expect([sh.n, sh.e, sh.s, sh.w].filter((x) => x !== 0).length, `sheet ${sh.id}`).toBeGreaterThanOrEqual(2);
    });
    // The start is a permutation of the sheets.
    expect([...def.start].sort((a, b) => a - b)).toEqual(def.sheets.map((sh) => sh.id));
  });
  it("has, in the Challenge map, two sheets that differ in one edge only, so that a careless match fits on three sides", () => {
    const sheets = sheetsMap("challenge").sheets;
    const differ = (a: number, b: number) => (["n", "e", "s", "w"] as const).filter((k) => sheets[a - 1]![k] !== sheets[b - 1]![k]);
    expect(differ(...NEAR_ALIKE)).toEqual(["e"]);
    // And it is not the only way to find one: search every pair.
    const pairs: [number, number][] = [];
    for (let a = 1; a <= sheets.length; a++) for (let b = a + 1; b <= sheets.length; b++) if (differ(a, b).length === 1) pairs.push([a, b]);
    expect(pairs).toContainEqual([...NEAR_ALIKE]);
    // Putting one in the other's place fits three sides and fails on the fourth.
    const s = { ...fresh("challenge"), grid: [...sheetsIntended("challenge")] };
    const [a, b] = NEAR_ALIKE;
    const pa = s.grid.indexOf(a);
    const pb = s.grid.indexOf(b);
    const swapped = exchange({ ...s, style: "story" }, pa, pb);
    const bad = allSeams(gridOf(swapped)).filter((x) => !x.match);
    expect(bad.length).toBeGreaterThan(0);
    expect(bad.length).toBeLessThanOrEqual(2);
  });
  it("count their seams: inner ones between sheets side by side, and border ones for the edge of the map", () => {
    const counts = STYLES.map((s) => [seams(gridOf(fresh(s))).length, borderSeams(gridOf(fresh(s))).length, tally(fresh(s)).total]);
    expect(counts).toEqual([
      [7, 10, 17],
      [17, 14, 31],
      [22, 16, 38],
    ]);
    const g = gridOf(fresh("story"));
    expect(seams(g).filter((x) => x.across === "row").length).toBe(4);
    expect(seams(g).filter((x) => x.across === "column").length).toBe(3);
    for (const sm of seams(g)) expect(sm.b === (sm.across === "row" ? sm.a + 1 : sm.a + 3)).toBe(true);
  });
  it("reach a map with nothing to do only by the answer: every seam matches exactly when the sheets are in the one order, over every arrangement of the small map", () => {
    const def = sheetsMap("story");
    const ids = def.sheets.map((x) => x.id);
    let seen = 0;
    for (const perm of permutations(ids)) {
      seen++;
      expect(inOrder({ ...fresh("story"), grid: perm }), perm.join()).toBe(perm.join() === sheetsIntended("story").join());
    }
    expect(seen).toBe(720);
  });
  it("is the same for the larger maps: random arrangements and arrangements one or two exchanges from the answer", () => {
    const rng = new Rng("sheets-property");
    for (const style of ["explorer", "challenge"] as const) {
      const s = fresh(style);
      for (let i = 0; i < 400; i++) {
        let grid = [...s.solution];
        const k = i < 100 ? 1 + (i % 2) : rng.int(3, 40);
        for (let j = 0; j < k; j++) {
          const a = rng.int(0, grid.length - 1);
          const b = rng.int(0, grid.length - 1);
          [grid[a], grid[b]] = [grid[b]!, grid[a]!];
        }
        expect(inOrder({ ...s, grid }), grid.join()).toBe(grid.join() === s.solution.join());
      }
    }
  });
});

describe("the fewest exchanges", () => {
  it("is places wrong less the cycles they fall into, and a brute search over every arrangement of the small map agrees", () => {
    const s = fresh("story");
    const target = [...s.solution];
    const dist = new Map<string, number>([[target.join(), 0]]);
    let frontier = [target];
    for (let d = 1; frontier.length > 0; d++) {
      const next: number[][] = [];
      for (const g of frontier) {
        for (let a = 0; a < g.length; a++) {
          for (let b = a + 1; b < g.length; b++) {
            const h = [...g];
            [h[a], h[b]] = [h[b]!, h[a]!];
            if (!dist.has(h.join())) {
              dist.set(h.join(), d);
              next.push(h);
            }
          }
        }
      }
      frontier = next;
    }
    expect(dist.size).toBe(720);
    for (const perm of permutations(s.sheets.map((x) => x.id))) expect(distance(perm, target), perm.join()).toBe(dist.get(perm.join()));
    expect(dist.get(s.start.join())).toBe(2);
    expect(Math.max(...dist.values())).toBe(5);
  });
  it("is reached by the exchanges a person would make, one place at a time, and no fewer exist", () => {
    for (const style of STYLES) {
      const s = fresh(style);
      expect(path(s).length).toBe(fewest(s));
      const done = solve(s);
      expect(done.moves).toBe(fewest(s));
      expect(done.grid).toEqual(s.solution);
    }
  });
  it("is zero for the answer, one for a pair exchanged, and symmetric", () => {
    const s = fresh("explorer");
    expect(distance(s.solution, s.solution)).toBe(0);
    const g = [...s.solution];
    [g[0], g[5]] = [g[5]!, g[0]!];
    expect(distance(g, s.solution)).toBe(1);
    expect(distance(s.solution, g)).toBe(1);
    expect(distance(s.start, s.solution)).toBe(distance(s.solution, s.start));
  });
});

describe("exchanging two sheets", () => {
  it("swaps two places, counts a move and says what it did; the same place twice, or none, changes nothing", () => {
    const s = fresh("explorer");
    const x = exchange(s, 0, 1);
    expect(x.grid[0]).toBe(s.grid[1]);
    expect(x.grid[1]).toBe(s.grid[0]);
    expect(x.moves).toBe(1);
    expect(x.last).toEqual({ type: "exchange", a: 0, b: 1 });
    expect(x.start).toEqual(s.start);
    for (const [a, b] of [[2, 2], [-1, 3], [0, 12], [1.5, 2], [0, NaN]] as [number, number][]) expect(exchange(s, a, b)).toBe(s);
    // Exchanging twice puts them back, and counts both.
    const back = exchange(x, 0, 1);
    expect(back.grid).toEqual(s.grid);
    expect(back.moves).toBe(2);
  });
  it("is done when every seam matches, in Story and Explorer, and nothing changes afterwards", () => {
    for (const style of ["story", "explorer"] as const) {
      const s = solve(fresh(style));
      expect([s.done, s.moves, s.checks]).toEqual([true, fewest(fresh(style)), 0]);
      expect(run(s, [{ type: "exchange", a: 0, b: 1 }, { type: "check" }, { type: "flag", flag: "feather" }])).toBe(s);
      expect(exchange(s, 0, 1)).toBe(s);
      expect(check(s)).toBe(s);
    }
  });
  it("is not done in the Challenge map until the map is checked, and a check that finds it in order is not a failed one", () => {
    const s = solve(fresh("challenge"));
    expect(inOrder(s)).toBe(true);
    expect(s.done).toBe(false);
    const c = check(s);
    expect([c.done, c.checks, c.moves]).toEqual([true, 0, 11]);
    expect(c.last).toEqual({ type: "check", matched: 38, total: 38 });
  });
  it("is not done while only part of the map is in order", () => {
    const s = exchange(fresh("story"), ...(path(fresh("story"))[0] as [number, number]));
    expect([s.done, s.moves]).toEqual([false, 1]);
  });
});

describe("checking the map", () => {
  it("counts the seams that match, counts a check that finds the map not in order, and shows nothing else", () => {
    let s = fresh("challenge");
    const t0 = tally(s);
    const c1 = check(s);
    expect([c1.checks, c1.done, c1.moves]).toEqual([1, false, 0]);
    expect(c1.last).toEqual({ type: "check", matched: t0.matched, total: 38 });
    expect(c1.grid).toBe(s.grid);
    s = exchange(c1, ...(path(c1)[0] as [number, number]));
    expect(s.last?.type).toBe("exchange"); // an exchange takes the count away again
    const c2 = check(s);
    expect(c2.checks).toBe(2);
    expect(c2.last?.type).toBe("check");
  });
  it("counts more seams matching as the sheets come closer to the answer", () => {
    let s = fresh("explorer");
    const counts = [tally(s).matched];
    for (const [a, b] of path(s)) {
      s = exchange(s, a, b);
      counts.push(tally(s).matched);
    }
    expect(counts[0]).toBeLessThan(counts[counts.length - 1]!);
    expect(counts[counts.length - 1]).toBe(31);
  });
});

describe("the four goals", () => {
  it("are the same four every quest has; Curiosity needs both questions, Kindness and the feather their flags, and unknown flags are ignored", () => {
    let s = fresh("explorer");
    s = run(s, [{ type: "flag", flag: "askedBook" }, { type: "flag", flag: "askedBook" }, { type: "flag", flag: "nonsense" as never }]);
    expect(s.flags).toEqual(["askedBook"]);
    expect(sheetsGoals(s, SHEETS_SLACK.explorer)).toMatchObject({ turns: 0, slips: 0, curiosity: false, ingenuity: true, kindness: false, feather: false });
    s = run(s, [{ type: "flag", flag: "askedMaps" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }]);
    expect(sheetsGoals(s, SHEETS_SLACK.explorer)).toMatchObject({ curiosity: true, kindness: true, feather: true });
    expect([...SHEETS_FLAGS]).toEqual(["askedBook", "askedMaps", "kind", "feather", "answered"]);
  });
  it("Story has no count; Explorer allows four exchanges more than the fewest; Challenge allows six more and two failed checks", () => {
    expect(SHEETS_SLACK).toEqual({ story: null, explorer: { extra: 4, checks: null }, challenge: { extra: 6, checks: 2 } });
    const extra = (style: SheetsStyle, n: number): SheetsState => {
      let s = fresh(style);
      for (let i = 0; i < n; i++) s = exchange(s, 0, 1); // wasted exchanges, an even number puts the sheets back
      return s;
    };
    const best = (style: SheetsStyle) => fewestFromStart(fresh(style));
    // Story: whatever happened.
    expect(sheetsGoals({ ...extra("story", 20), moves: 99 }, SHEETS_SLACK.story).ingenuity).toBe(true);
    // Explorer: the fewest and four more are all right, five more are not; failed checks are not counted.
    expect(sheetsGoals({ ...fresh("explorer"), moves: best("explorer") + 4, checks: 9 }, SHEETS_SLACK.explorer).ingenuity).toBe(true);
    expect(sheetsGoals({ ...fresh("explorer"), moves: best("explorer") + 5 }, SHEETS_SLACK.explorer).ingenuity).toBe(false);
    // Challenge: six more and two failed checks are all right; one more of either is not.
    const ch = (moves: number, checks: number) => sheetsGoals({ ...fresh("challenge"), moves, checks }, SHEETS_SLACK.challenge).ingenuity;
    expect([ch(best("challenge") + 6, 2), ch(best("challenge") + 7, 2), ch(best("challenge") + 6, 3), ch(best("challenge"), 0)]).toEqual([true, false, false, true]);
    expect(sheetsGoals({ ...fresh("challenge"), moves: 13, checks: 1 }, SHEETS_SLACK.challenge)).toMatchObject({ turns: 13, slips: 1 });
  });
  it("end to end: the fewest exchanges, both questions, kindness and the feather meet all four goals in every way of playing", () => {
    for (const style of STYLES) {
      let s = run(fresh(style), [{ type: "flag", flag: "askedBook" }, { type: "flag", flag: "askedMaps" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }]);
      s = solve(s);
      if (!s.done) s = check(s);
      expect(s.done).toBe(true);
      expect(sheetsGoals(s, SHEETS_SLACK[style])).toMatchObject({ curiosity: true, ingenuity: true, kindness: true, feather: true, turns: fewest(fresh(style)), slips: 0 });
    }
  });
});

describe("the map kept in the middle", () => {
  const through = (s: SheetsState) => restoreSheets(JSON.parse(JSON.stringify(snapshotSheets(s))), sheetsMap);
  const started = (style: SheetsStyle) => run(fresh(style), [{ type: "exchange", ...(() => ({ a: path(fresh(style))[0]![0], b: path(fresh(style))[0]![1] }))() }, { type: "flag", flag: "feather" }]);
  const snap = (style: SheetsStyle) => JSON.parse(JSON.stringify(snapshotSheets(started(style)))) as Record<string, unknown>;
  const refused = (x: unknown) => restoreSheets(x, sheetsMap);

  it.each(STYLES)("comes back through JSON as it was, with nothing shown and not done, in %s", (style) => {
    const s = started(style);
    const back = through(s)!;
    expect(back).not.toBeNull();
    expect([back.style, back.grid, back.flags, back.moves, back.checks, back.last, back.done]).toEqual([style, s.grid, s.flags, s.moves, s.checks, null, false]);
    expect(back.start).toEqual(sheetsMap(style).start);
    // And it can be played on to its end.
    expect(solve(back).grid).toEqual(back.solution);
  });
  it("keeps a map with nothing changed too, and a Challenge map put in order but not yet checked", () => {
    for (const style of STYLES) expect(restoreSheets(snapshotSheets(fresh(style)), sheetsMap)).not.toBeNull();
    const ordered = solve(fresh("challenge"));
    expect(inOrder(ordered)).toBe(true);
    const back = through(ordered)!;
    expect(back.done).toBe(false);
    expect(check(back).done).toBe(true);
  });
  it("refuses a map that is already in order, except in Challenge: a map is never restored as done", () => {
    for (const style of ["story", "explorer"] as const) expect(refused({ style, grid: sheetsIntended(style), moves: fewest(fresh(style)), checks: 0, flags: [] })).toBeNull();
  });
  it("refuses an arrangement that is not a permutation of the style's own sheets, whatever else is right", () => {
    const good = snap("explorer");
    const grid = good.grid as number[];
    const dup = [...grid];
    dup[1] = dup[0]!; // one sheet twice, one missing
    const bad: unknown[] = [dup, grid.slice(1), [...grid, 13], grid.map((id) => id + 12), grid.map((id) => (id === 3 ? 99 : id)), grid.map((id) => String(id)), grid.map((id) => (id === 3 ? 3.5 : id)), grid.map((id) => (id === 3 ? null : id)), "x", null, undefined, 4, { 0: 1 }];
    for (const b of bad) expect(refused({ ...good, grid: b }), JSON.stringify(b)).toBeNull();
    // A Story arrangement is not an Explorer one, even of the same length class.
    expect(refused({ ...good, style: "story" })).toBeNull();
    expect(refused({ ...good, style: "challenge" })).toBeNull();
  });
  it("refuses a count of exchanges fewer than the fewest that reach the arrangement from the start, and counts that are not whole numbers", () => {
    const good = snap("explorer");
    const d = distance(sheetsMap("explorer").start, good.grid as number[]);
    expect(d).toBe(1);
    expect(refused({ ...good, moves: d })).not.toBeNull();
    expect(refused({ ...good, moves: 0 })).toBeNull();
    for (const moves of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined]) expect(refused({ ...good, moves }), String(moves)).toBeNull();
    expect(refused({ ...good, moves: 40 })!.moves).toBe(40);
    for (const checks of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined]) expect(refused({ ...good, checks }), String(checks)).toBeNull();
    expect(refused({ ...good, checks: 3 })!.checks).toBe(3);
  });
  it("refuses what cannot be trusted at all, drops flags it does not know, and never takes a finish or the start from the file", () => {
    const good = snap("story");
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }, { ...good, style: undefined }, { ...good, flags: "feather" }, { ...good, flags: undefined }]) expect(refused(bad)).toBeNull();
    const back = refused({ ...good, flags: ["feather", "askedBook", "nonsense", 7, "kind", "kind"], done: true, last: { type: "check" }, start: [1, 2, 3, 4, 5, 6], solution: [1, 2, 3, 4, 5, 6] })!;
    expect(back.flags).toEqual(["askedBook", "kind", "feather"]);
    expect([back.done, back.last]).toEqual([false, null]);
    expect(back.start).toEqual(sheetsMap("story").start);
    expect(back.solution).toEqual(sheetsIntended("story"));
  });
  it("keeps `answered` for a blunt answer too, without making it a goal", () => {
    const blunt = run(fresh("explorer"), [{ type: "flag", flag: "answered" }]);
    expect(sheetsGoals(blunt, SHEETS_SLACK.explorer).kindness).toBe(false);
    expect(restoreSheets(JSON.parse(JSON.stringify(snapshotSheets(blunt))), sheetsMap)!.flags).toEqual(["answered"]);
  });
});

describe("the edges", () => {
  it("are codes: nothing, or one of three features at one of three places; and decode back", () => {
    expect(FEATURES).toEqual(["coast", "river", "road"]);
    expect(edgeCode("coast", 1)).toBe(11);
    expect(edgeCode("river", 2)).toBe(22);
    expect(edgeCode("road", 3)).toBe(33);
    for (const f of FEATURES) for (const at of [1, 2, 3] as const) expect(decodeEdge(edgeCode(f, at))).toEqual({ feature: f, at });
    expect(decodeEdge(0)).toBeNull();
    for (const bad of [4, 10, 14, 40, 41, 100, -11, 1.5, NaN]) expect(isEdgeCode(bad), String(bad)).toBe(false);
    expect(isEdgeCode(0)).toBe(true);
  });
  it("use all three features somewhere in every map, so that the picture shows all three kinds", () => {
    for (const style of STYLES) {
      const kinds = new Set<string>();
      for (const sh of sheetsMap(style).sheets) for (const code of [sh.n, sh.e, sh.s, sh.w]) kinds.add(decodeEdge(code)?.feature ?? "");
      expect([...kinds].filter(Boolean).sort(), style).toEqual(["coast", "river", "road"]);
    }
  });
});

describe("the picture's hit-test", () => {
  const centre = (p: number, rows: number, cols: number) => {
    const o = sheetOrigin(p, rows, cols);
    const { tile } = sheetsLayout(rows, cols);
    return { x: o.x + tile / 2, y: o.y + tile / 2 };
  };
  it.each(STYLES)("finds the sheet under the middle of every place, left to right, and under its mirror image on a right to left page, in %s", (style) => {
    const { rows, cols } = sheetsMap(style);
    for (let p = 0; p < rows * cols; p++) {
      const c = centre(p, rows, cols);
      expect(sheetsHit(c.x, c.y, rows, cols, false), `ltr ${p}`).toBe(p);
      expect(sheetsHit(SHEETS_ART.w - c.x, c.y, rows, cols, true), `rtl ${p}`).toBe(p);
      // The other way round: the same point is another place, or none, the other way.
      if (cols > 1 && Math.abs(c.x - SHEETS_ART.w / 2) > 1) expect(sheetsHit(c.x, c.y, rows, cols, true)).not.toBe(p);
    }
  });
  it("puts the first column on the right when the page reads right to left, and the last column on the left", () => {
    const { rows, cols } = sheetsMap("explorer");
    const first = centre(0, rows, cols);
    const last = centre(cols - 1, rows, cols);
    expect(first.x).toBeLessThan(last.x); // drawn left to right before mirroring
    expect(sheetsHit(SHEETS_ART.w - first.x, first.y, rows, cols, true)).toBe(0);
    expect(SHEETS_ART.w - first.x).toBeGreaterThan(SHEETS_ART.w - last.x); // so on screen the first is the right-most
    expect(sheetsHit(SHEETS_ART.w - last.x, last.y, rows, cols, true)).toBe(cols - 1);
  });
  it("finds nothing in the gap between sheets, outside the sheets, or outside the picture", () => {
    for (const style of STYLES) {
      const { rows, cols } = sheetsMap(style);
      const { pitch, tile, x0, y0 } = sheetsLayout(rows, cols);
      const o = sheetOrigin(0, rows, cols);
      // The middle of the gap to the right of the first sheet, and the middle of the gap below it.
      expect(sheetsHit(o.x + tile + (pitch - tile) / 2, o.y + tile / 2, rows, cols, false)).toBeNull();
      expect(sheetsHit(o.x + tile / 2, o.y + tile + (pitch - tile) / 2, rows, cols, false)).toBeNull();
      for (const [x, y] of [[0, 0], [SHEETS_ART.w, SHEETS_ART.h], [-5, 10], [10, -5], [5000, 5000], [x0 - 2, y0 - 2]] as [number, number][]) expect(sheetsHit(x, y, rows, cols, false), `${x},${y}`).toBeNull();
    }
  });
  it("lays every sheet inside the picture, apart from every other", () => {
    for (const style of STYLES) {
      const { rows, cols } = sheetsMap(style);
      const { tile } = sheetsLayout(rows, cols);
      expect(tile).toBeGreaterThanOrEqual(100);
      const boxes = Array.from({ length: rows * cols }, (_, p) => sheetOrigin(p, rows, cols));
      for (const o of boxes) {
        expect(o.x).toBeGreaterThanOrEqual(0);
        expect(o.y).toBeGreaterThanOrEqual(0);
        expect(o.x + tile).toBeLessThanOrEqual(SHEETS_ART.w);
        expect(o.y + tile).toBeLessThanOrEqual(SHEETS_ART.h);
      }
      for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) expect(Math.abs(boxes[a]!.x - boxes[b]!.x) >= tile || Math.abs(boxes[a]!.y - boxes[b]!.y) >= tile).toBe(true);
    }
  });
});

describe("the words and the records", () => {
  /** The lines written for the quest, kept exactly: key, Arabic, English. */
  const WRITTEN: [string, string, string][] = [
    ["id_intro_1", "صفحة الأطلس انزلقت بين أوراق خريطة، والأوراق اختلط ترتيبها!", "The page of the Atlas has slipped among the sheets of a map, and the sheets are out of order!"],
    ["id_intro_2", "انظر إلى أطراف الأوراق: الساحل والنهر لا ينقطعان عند الحافة.", "Look at the edges of the sheets: a coast or a river does not stop at the edge."],
    ["id_book_1", "يقول سجل المتحف إن الإدريسي كتب كتابه نزهة المشتاق لروجر الثاني ملك صقلية، وإنه يذكر في مقدمته أنه أتمّه في شوال سنة 548 للهجرة.", "The museum's record says al-Idrisi wrote his book Nuzhat al-Mushtaq for Roger II, king of Sicily. By his own word in its opening, he finished it in Shawwal of the year 548 of the Hijra."],
    ["id_maps_1", "ويقول إن الكتاب صحب قرصًا من فضة عليه الأقاليم السبعة، وإنه قسّم كل إقليم عشرة أجزاء، فكانت الخرائط سبعين.", "It says the book went with a silver disc showing the seven climes, and that he divided each clime into ten sections, which made seventy maps."],
    ["id_note_1", "هذه لعبة وليست كتاب تاريخ. الأوراق المبعثرة والمساعد الصغير وكل كلمة تُقال من خيال اللعب. والرسم الذي على الأوراق ساحل متخيَّل، ليس خريطة الإدريسي ولا أي مكان حقيقي.", "This is a game, not a history. The scattered sheets, the young helper and every spoken line are invented for play. The drawing on the sheets is an imagined coast: it is not al-Idrisi's map, nor any real place."],
    ["id_note_2", "من سجل المتحف: كتب الإدريسي نزهة المشتاق لروجر الثاني ملك صقلية ويذكر في مقدمته أنه أتمّه في شوال سنة 548 للهجرة. صحب الكتاب قرصًا من فضة عليه الأقاليم السبعة، وفيه سبعون خريطة، عشر لكل إقليم. ويذكر سجل آخر في المتحف سنة 549.", "From the museum's record: al-Idrisi wrote Nuzhat al-Mushtaq for Roger II, king of Sicily, and by his own word finished it in Shawwal 548 of the Hijra. The book went with a silver disc showing the seven climes, and it has seventy maps, ten for each clime. Another of the museum's records gives the year 549."],
    ["id_note_3", "بُسِّط من أجل اللعب: في اللعبة ست أوراق أو اثنتا عشرة أو خمس عشرة، لا سبعون. وترتيب الأوراق بمطابقة أطرافها من وضع اللعبة، فما قُرئ لهذه اللعبة لا يذكر كيف رُتّبت خرائطه.", "Made simpler for play: the game has six, twelve or fifteen sheets, not seventy. Putting sheets in order by matching their edges is the game's own idea: nothing read for this game says how his maps were ordered."],
  ];
  it("keeps the lines written for the quest exactly, in Arabic and English, and the speakers' labels", () => {
    for (const [k, ar, en] of WRITTEN) {
      expect(table("ar")[k], k).toBe(ar);
      expect(table("en")[k], k).toBe(en);
    }
    expect(table("en").id_who_idrisi).toBe("Al-Idrisi, in imagined words");
    expect(table("ar").id_who_idrisi).toBe("الإدريسي، بكلمات متخيَّلة");
    expect(table("en").id_who_helper).toBe("The young helper, an invented person");
    expect(table("ar").id_who_helper).toBe("المساعد الصغير، شخصية من الخيال");
    expect(table("ar").id_rec_book).toBe("كتابه نزهة المشتاق");
    expect(table("en").id_rec_book).toBe("his book Nuzhat al-Mushtaq");
    // The helper is never called the Messenger, in any language that has the word.
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("id_")) expect(v, `${l}:${k}`).not.toMatch(/الرسول/);
  });
  it("gives only the two Hijri years the museum's records hold, 548 on the author's word and 549 from another record: no other number is written in digits, so no Common Era year", () => {
    for (const l of LANGS) {
      for (const [k, v] of Object.entries(table(l))) {
        if (!k.startsWith("id_")) continue;
        const digits = v.replace(/\{\w+\}/g, "").match(/\d+/g) ?? [];
        for (const d of digits) expect(["548", "549"], `${l}:${k}`).toContain(d);
      }
    }
  });
  it("has every key the page uses, in all seven languages, with no part left empty", () => {
    const src = readFileSync(resolve(__dirname, "..", "ui", "sheets.ts"), "utf8");
    const keys = new Set([...src.matchAll(/"(id_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    for (const f of ["coast", "river", "road"]) keys.add(`id_feat_${f}`);
    for (const n of [1, 2, 3]) keys.add(`id_pos_${n}`);
    for (const w of ["hudhud", "idrisi", "helper", "narrator"]) keys.add(`id_who_${w}`);
    expect(keys.size).toBeGreaterThan(55);
    for (const l of LANGS) for (const k of keys) expect((table(l)[k] ?? "").trim().length, `${l}:${k}`).toBeGreaterThan(0);
    // And no key is written that nothing uses.
    for (const k of Object.keys(table("en"))) if (k.startsWith("id_")) expect(keys.has(k), k).toBe(true);
  });
  it("names the records the results link to, and each is a museum record that exists", () => {
    expect([...SHEETS_RECORDS]).toEqual(["person/al-idrisi-muhammad-ibn-abd-allah", "work/nuzhat-al-mushtaq"]);
    for (const id of SHEETS_RECORDS) expect(existsSync(resolve(root, "data", `${id}.yaml`)), id).toBe(true);
  });
  it("says in the hub that quests are built, in every language, and no longer four (the count itself is pinned in channels.gtest.ts)", () => {
    expect(table("en").hub_note).toMatch(/(Five|Six|Seven|Eight|Nine|Ten|Eleven) quests are built/);
    for (const l of LANGS) expect(table(l).hub_note).not.toMatch(/\b(four|quatre|cuatro|dört|empat)\b|أربع|چار/i);
  });
});
