// The Alhambra and the dry fountain, the eleventh quest: the channel rules (sim/channels.ts). In each way of playing the
// grid has one answer only, proved by a search that grows the water out from the spout (and checked against a brute
// search over every turn of every piece on many small grids), no basin has water at the start, the answer is the road
// written in the content file, and the fewest turns are the numbers stated; flow and leak rules on small hand-made
// grids; turns are moves and a piece that looks the same turned is refused; the sluice of the Challenge; the goals; a
// saved place that is proved and not trusted; a finished grid that nothing changes; the picture's hit-test both ways
// round, and a mirrored grid whose channels still meet across every seam; and the words in all seven languages, with
// the lines written for the quest kept word for word and anchored to the museum record's own file, the one Arabic word
// that differs from the brief (and why), no digit and no «الرسول» in any string of the quest, and the names the quest
// uses checked against the museum's labels.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { CHANNELS_ART, channelsHit, channelsLayout, seamPoint, tileOrigin } from "../art/channels";
import { CHANNELS_QUEST, CHANNELS_RECORDS, CHANNELS_SLACK, CHANNELS_SUBJECT, channelsGrid, channelsIntended, channelsRoad } from "../content/channels";
import {
  CHANNELS_FLAGS,
  KINDS,
  SIDES,
  answerOf,
  answers,
  applyChannels,
  channelsGoals,
  checkChannels,
  fewest,
  fewestFromStart,
  fewestTurns,
  finished,
  flow,
  gridOf,
  isOpen,
  neighbour,
  newChannels,
  opens,
  opposite,
  period,
  pieceFor,
  restoreChannels,
  snapshotChannels,
  turn,
  turnable,
  type Basin,
  type ChannelsCommand,
  type ChannelsDef,
  type ChannelsState,
  type ChannelsStyle,
  type Kind,
  type Piece,
  type Side,
} from "../sim/channels";

const STYLES: ChannelsStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const root = resolve(__dirname, "..", "..", "..", "..", "..");
const here = (...p: string[]) => resolve(__dirname, "..", ...p);
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const fresh = (style: ChannelsStyle) => newChannels(style, channelsGrid(style));
const run = (s: ChannelsState, cs: ChannelsCommand[]) => cs.reduce(applyChannels, s);
/** The record's text with its links and citations written as plain words, on one line. */
const plain = (path: string) => readFileSync(resolve(root, path), "utf8").replace(/\[\[[^|\]]*\|([^\]]*)\]\]/g, "$1").replace(/\s*\{cite:[^}]*\}/g, "").replace(/\s+/g, " ");
const alhambra = plain("content/en/building/alhambra.md");
const alhambraAr = plain("content/ar/building/alhambra.md");
const ui = readFileSync(resolve(__dirname, "..", "ui", "channels.ts"), "utf8");

/** The turns that finish a grid, one press at a time: each piece is pressed until it looks as the answer wants. */
function presses(s: ChannelsState): number[] {
  const out: number[] = [];
  s.cells.forEach((piece, p) => {
    const want = s.answer.wet.get(p);
    if (want === undefined) return;
    let t = piece.turn;
    while (t % period(piece.kind) !== want) {
      out.push(p);
      t = (t + 1) % 4;
    }
  });
  return out;
}
const solve = (s: ChannelsState): ChannelsState => run(s, presses(s).map((cell) => ({ type: "turn", cell }) as ChannelsCommand));
/** The pieces of a written mask row, for hand-made grids: a string of sides per place. */
const grid1 = (masks: string[], offs: number[]): Piece[] =>
  masks.map((m, i) => {
    const hit = pieceFor([...m] as Side[])!;
    return { kind: hit.kind, turn: (hit.turn + offs[i]!) % 4 };
  });
const make = (rows: number, cols: number, cells: Piece[], basins: Basin[], noLeaks = false, spout = { cell: 0, side: "w" as Side }): ChannelsDef => ({ rows, cols, start: cells, spout, basins, noLeaks });

describe("the pieces", () => {
  it("are six, each open on the sides its kind says, turned a quarter turn at a time clockwise", () => {
    expect([...KINDS]).toEqual(["straight", "bend", "tee", "cross", "end", "blank"]);
    expect([0, 1, 2, 3].map((t) => opens("straight", t).join(""))).toEqual(["ns", "ew", "sn", "we"]);
    expect([0, 1, 2, 3].map((t) => opens("bend", t).join(""))).toEqual(["ne", "es", "sw", "wn"]);
    expect([0, 1, 2, 3].map((t) => opens("tee", t).sort().join(""))).toEqual(["enw", "ens", "esw", "nsw"]);
    expect([0, 1, 2, 3].map((t) => opens("end", t).join(""))).toEqual(["n", "e", "s", "w"]);
    for (const t of [0, 1, 2, 3]) expect(opens("cross", t).sort().join("")).toBe("eswn".split("").sort().join(""));
    for (const t of [0, 1, 2, 3]) expect(opens("blank", t)).toEqual([]);
    expect(SIDES.map(opposite).join("")).toBe("sw" + "ne");
  });
  it("look the same after their period: a straight piece after two turns, a cross or a plain stone at once, the others after four; only the others can be turned", () => {
    for (const k of KINDS) {
      for (let t = 0; t < 4; t++) expect(opens(k, (t + period(k)) % 4).sort(), `${k}:${t}`).toEqual(opens(k, t).sort());
      for (let t = 1; t < period(k); t++) expect(opens(k, t).sort().join(""), `${k}:${t}`).not.toBe(opens(k, 0).sort().join(""));
    }
    expect(KINDS.filter(turnable)).toEqual(["straight", "bend", "tee", "end"]);
  });
  it("can be found again from the sides they are open on, and no other set of sides is a piece", () => {
    expect(pieceFor(["e", "w"])).toEqual({ kind: "straight", turn: 1 });
    expect(pieceFor(["n", "e", "w"])).toEqual({ kind: "tee", turn: 0 });
    expect(pieceFor(["s", "w"])).toEqual({ kind: "bend", turn: 2 });
    expect(pieceFor([])).toEqual({ kind: "blank", turn: 0 });
    expect(pieceFor(["n", "e", "s", "w"])).toEqual({ kind: "cross", turn: 0 });
    expect(pieceFor(["w"])).toEqual({ kind: "end", turn: 3 });
  });
});

describe("the water: flow and leaks on small grids made by hand", () => {
  it("runs from the spout along openings that meet openings, and not past a closed side", () => {
    // [straight ew][straight ew][end w]
    const cells = grid1(["ew", "ew", "w"], [0, 0, 0]);
    const g = { rows: 1, cols: 3, cells, spout: { cell: 0, side: "w" as Side } };
    const f = flow(g);
    expect(f.wet).toEqual([true, true, true]);
    expect(f.reach).toEqual([0, 1, 2]);
    expect(f.leaks).toEqual([]);
    expect(f.blocked).toEqual([]);
    // The middle piece turned: the spout's piece is wet, spills against the closed side of its neighbour, and nothing beyond is.
    const turned = flow({ ...g, cells: [cells[0]!, { ...cells[1]!, turn: 2 }, cells[2]!] });
    expect(turned.wet).toEqual([true, false, false]);
    expect(turned.reach).toEqual([0, -1, -1]);
    expect(turned.leaks).toEqual([{ cell: 0, side: "e" }]);
    expect(turned.blocked).toEqual([1]);
  });
  it("has no water at all if the spout's piece is not open to the spout, and then nothing leaks", () => {
    const g = { rows: 1, cols: 2, cells: grid1(["ns", "w"], [0, 0]), spout: { cell: 0, side: "w" as Side } };
    const f = flow(g);
    expect(f.wet).toEqual([false, false]);
    expect(f.leaks).toEqual([]);
  });
  it("counts an opening that faces the edge as a leak, but not the opening that the spout feeds", () => {
    // [bend e,s] with the spout on its west side would not be wet; [straight ew] at the edge: its east side faces the edge.
    const g = { rows: 1, cols: 1, cells: grid1(["ew"], [0]), spout: { cell: 0, side: "w" as Side } };
    const f = flow(g);
    expect(f.wet).toEqual([true]);
    expect(f.leaks).toEqual([{ cell: 0, side: "e" }]);
    expect(f.blocked).toEqual([]);
  });
  it("lists the leaks row by row and does not count the opening twice; a wet piece facing another wet piece that does not open back leaks too", () => {
    // 2 x 2: spout at 0. [bend w,e][bend w,s]/[bend n,e][end w]? place 1 is open west and south: it meets 3's north (end n).
    const cells = grid1(["we", "ws", "ne", "n"], [0, 0, 0, 0]);
    const f = flow({ rows: 2, cols: 2, cells, spout: { cell: 0, side: "w" } });
    expect(f.wet).toEqual([true, true, false, true]);
    expect(f.leaks).toEqual([]);
    // Turn place 3 so that it is open east: the water reaches it no more, and place 1 spills against it.
    const g = flow({ rows: 2, cols: 2, cells: [cells[0]!, cells[1]!, cells[2]!, { ...cells[3]!, turn: 1 }], spout: { cell: 0, side: "w" } });
    expect(g.wet).toEqual([true, true, false, false]);
    expect(g.leaks).toEqual([{ cell: 1, side: "s" }]);
    expect(g.blocked).toEqual([3]);
  });
  it("lets the water run both ways round a loop and through a cross, counting how many places it ran through to reach each", () => {
    // 2 x 2 ring: [bend w? ] spout at place 0 (e,s) hmm: use a cross at 0.
    const cells = grid1(["nesw", "ws", "ne", "wn"], [0, 0, 0, 0]);
    const f = flow({ rows: 2, cols: 2, cells, spout: { cell: 0, side: "w" } });
    expect(f.wet).toEqual([true, true, true, true]);
    expect(f.reach).toEqual([0, 1, 1, 2]);
    // The cross at 0 also opens north and west: the north side faces the edge (a leak), the west side is the spout's own.
    expect(f.leaks).toEqual([{ cell: 0, side: "n" }]);
  });
  it("knows what faces what at the edges of a grid", () => {
    expect(neighbour(0, "n", 2, 3)).toBeNull();
    expect(neighbour(0, "w", 2, 3)).toBeNull();
    expect(neighbour(0, "e", 2, 3)).toBe(1);
    expect(neighbour(0, "s", 2, 3)).toBe(3);
    expect(neighbour(5, "e", 2, 3)).toBeNull();
    expect(neighbour(5, "s", 2, 3)).toBeNull();
    expect(neighbour(4, "w", 2, 3)).toBe(3);
  });
});

describe("the search for the answer", () => {
  /** Every way to turn the pieces of a small grid, by brute force: the same signatures as the search gives. */
  function brute(def: ChannelsDef, noLeaks: boolean): string[] {
    const n = def.rows * def.cols;
    const found = new Set<string>();
    const cells: Piece[] = def.start.map((p) => ({ ...p, turn: 0 }));
    const go = (p: number): void => {
      if (p === n) {
        const f = flow({ rows: def.rows, cols: def.cols, cells, spout: def.spout });
        if (!def.basins.every((b) => f.wet[b.cell])) return;
        if (noLeaks && f.leaks.length > 0) return;
        found.add(cells.flatMap((c, i) => (f.wet[i] ? [`${i}:${c.turn % period(c.kind)}`] : [])).join(","));
        return;
      }
      for (let t = 0; t < period(cells[p]!.kind); t++) {
        cells[p] = { ...cells[p]!, turn: t };
        go(p + 1);
      }
    };
    go(0);
    return [...found].sort();
  }
  const keyOf = (a: { wet: ReadonlyMap<number, number> }) =>
    [...a.wet.entries()]
      .sort((x, y) => x[0] - y[0])
      .map(([p, t]) => `${p}:${t}`)
      .join(",");
  it("agrees with a brute search over every turn of every piece on many small grids, with and without leaks allowed", () => {
    let seed = 20261126;
    const next = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    let checked = 0;
    let withAnswers = 0;
    for (let i = 0; i < 160; i++) {
      const rows = 2;
      const cols = 3;
      const kinds: Kind[] = Array.from({ length: rows * cols }, () => KINDS[Math.floor(next() * KINDS.length)]!);
      const ends = kinds.flatMap((k, p) => (k === "end" && p !== 0 ? [p] : []));
      if (ends.length === 0) continue;
      const basins: Basin[] = ends.slice(0, 1 + Math.floor(next() * 2)).map((cell) => ({ cell, kind: "fountain" as const }));
      const def = make(rows, cols, kinds.map((kind) => ({ kind, turn: 0 })), basins);
      for (const noLeaks of [false, true]) {
        const mine = answers(def, noLeaks).map(keyOf).sort();
        expect(mine, `grid ${i} ${kinds.join()} leaks ${noLeaks}`).toEqual(brute(def, noLeaks));
        if (mine.length > 0) withAnswers++;
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(150);
    expect(withAnswers).toBeGreaterThan(40);
  });
  it("agrees with the brute search on a 3 by 3 grid made by hand, which has more than one way to turn the pieces", () => {
    const cells = grid1(["ew", "esw", "sw", "ns", "ne", "ns", "e", "ew", "w"], [0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const def = make(3, 3, cells, [{ cell: 6, kind: "pool" }, { cell: 8, kind: "fountain" }]);
    for (const noLeaks of [false, true]) expect(answers(def, noLeaks).map(keyOf).sort(), String(noLeaks)).toEqual(brute(def, noLeaks));
  });
  it("refuses a grid that has no answer or more than one", () => {
    // A plain stone at the spout can never be open to it: no way to turn the pieces wets the basin.
    const none = make(1, 2, grid1(["", "w"], [0, 0]), [{ cell: 1, kind: "fountain" }]);
    expect(answers(none, false)).toEqual([]);
    expect(() => checkChannels(none)).toThrow(/0 answers/);
    // A grid with two answers: a ring that the water can go round either way to the one basin.
    const ring = make(2, 2, grid1(["nesw", "ws", "ne", "n"], [0, 0, 0, 0]), [{ cell: 3, kind: "fountain" }]);
    expect(answers(ring, false).length).toBeGreaterThan(1);
    expect(() => checkChannels(ring)).toThrow(/answers, not one/);
  });
  it("refuses a spout that is not on an edge, a basin that is not a channel end or lies twice, a grid without a basin, and pieces that are not pieces", () => {
    const base = grid1(["ew", "w"], [0, 0]);
    expect(() => checkChannels(make(1, 2, base, [{ cell: 1, kind: "fountain" }], false, { cell: 0, side: "e" }))).toThrow(/spout/);
    expect(() => checkChannels(make(1, 2, base, [{ cell: 0, kind: "fountain" }]))).toThrow(/basin/);
    expect(() => checkChannels(make(1, 2, base, [{ cell: 1, kind: "fountain" }, { cell: 1, kind: "pool" }]))).toThrow(/basin/);
    expect(() => checkChannels(make(1, 2, base, []))).toThrow(/needs a basin/);
    expect(() => checkChannels(make(1, 2, [base[0]!], [{ cell: 1, kind: "fountain" }]))).toThrow(/pieces/);
    expect(() => checkChannels(make(1, 2, [base[0]!, { kind: "end", turn: 7 }], [{ cell: 1, kind: "fountain" }]))).toThrow(/not a piece/);
  });
});

describe("the three grids", () => {
  const SIZE: Record<ChannelsStyle, [number, number, number]> = { story: [3, 3, 1], explorer: [4, 4, 2], challenge: [5, 5, 2] };
  const FEWEST: Record<ChannelsStyle, number> = { story: 6, explorer: 11, challenge: 14 };
  for (const style of STYLES) {
    describe(style, () => {
      const def = channelsGrid(style);
      const s = fresh(style);
      it("has the size and the basins it is written to have, and the spout on an edge", () => {
        expect([def.rows, def.cols, def.basins.length]).toEqual(SIZE[style]);
        expect(def.start.length).toBe(def.rows * def.cols);
        expect(neighbour(def.spout.cell, def.spout.side, def.rows, def.cols)).toBeNull();
        expect(def.basins.every((b) => def.start[b.cell]!.kind === "end")).toBe(true);
        expect(def.noLeaks).toBe(style === "challenge");
        if (style === "explorer" || style === "challenge") expect(def.basins.map((b) => b.kind).sort()).toEqual(["fountain", "pool"]);
        else expect(def.basins.map((b) => b.kind)).toEqual(["fountain"]);
      });
      it("has one answer only, with leaks allowed and with leaks forbidden alike", () => {
        expect(answers(def, false).length).toBe(1);
        expect(answers(def, true).length).toBe(1);
        expect(keyOf(answers(def, false)[0]!)).toBe(keyOf(answers(def, true)[0]!));
        expect(answerOf(def)).toBe(answerOf(def));
      });
      it("has no basin with water at the start", () => {
        const f = flow(gridOf(s));
        for (const b of def.basins) expect(f.wet[b.cell], `basin at ${b.cell}`).toBe(false);
        expect(s.done).toBe(false);
        expect(finished(s)).toBe(false);
      });
      it("has for its answer the road written in the content file, and no piece off the road is wet", () => {
        const road = channelsRoad(style);
        const wet = new Set(s.answer.wet.keys());
        const onRoad = road.flatMap((m, p) => (m !== "" && wet.has(p) ? [p] : []));
        expect(onRoad.length).toBe(wet.size);
        // The answer's wet places are the ones the written road wets when every piece lies as written.
        const intended = channelsIntended(style);
        const f = flow({ rows: def.rows, cols: def.cols, cells: intended, spout: def.spout });
        expect(new Set(f.wet.flatMap((w, p) => (w ? [p] : [])))).toEqual(wet);
        for (const [p, t] of s.answer.wet) expect(intended[p]!.turn % period(intended[p]!.kind), `place ${p}`).toBe(t);
        // The written road wets every basin, and spills nowhere.
        expect(def.basins.every((b) => f.wet[b.cell])).toBe(true);
        expect(f.leaks).toEqual([]);
        // Nothing the water faces is left dry, so no piece off the road has to be turned clear of it.
        expect(s.answer.closed.size).toBe(0);
      });
      it(`needs the ${FEWEST[style]} quarter turns it is written to need, worked out again from the road`, () => {
        expect(fewestFromStart(s)).toBe(FEWEST[style]);
        expect(fewest(s)).toBe(FEWEST[style]);
        // Worked out again here: for each place on the road, the turns past the answer it lies at.
        let sum = 0;
        for (const [p, t] of s.answer.wet) sum += (((t - def.start[p]!.turn) % period(def.start[p]!.kind)) + period(def.start[p]!.kind)) % period(def.start[p]!.kind);
        expect(sum).toBe(FEWEST[style]);
        // And by the presses that finish it: that many, no fewer.
        expect(presses(s).length).toBe(FEWEST[style]);
      });
      it("is finished by exactly those presses, and by no press fewer", () => {
        const all = presses(s);
        let cur = s;
        for (const [i, cell] of all.entries()) {
          cur = applyChannels(cur, { type: "turn", cell });
          if (style === "challenge") expect(cur.done, `turn ${i}`).toBe(false);
          else expect(cur.done, `turn ${i}`).toBe(i === all.length - 1);
          expect(fewest(cur)).toBe(FEWEST[style] - i - 1);
        }
        expect(finished(cur)).toBe(true);
        expect(cur.moves).toBe(FEWEST[style]);
        expect(flow(gridOf(cur)).leaks).toEqual([]);
      });
      it("has a road that does not touch the places off it", () => {
        const f = flow({ rows: def.rows, cols: def.cols, cells: channelsIntended(style), spout: def.spout });
        expect(f.blocked).toEqual([]);
      });
    });
  }
  const keyOf = (a: { wet: ReadonlyMap<number, number> }) =>
    [...a.wet.entries()]
      .sort((x, y) => x[0] - y[0])
      .map(([p, t]) => `${p}:${t}`)
      .join(",");

  it("makes the Explorer's water branch at a tee: its answer has a tee with water on all three of its open sides", () => {
    const s = fresh("explorer");
    const f = flow({ rows: 4, cols: 4, cells: channelsIntended("explorer"), spout: s.spout });
    const tees = [...s.answer.wet.keys()].filter((p) => s.cells[p]!.kind === "tee");
    expect(tees.length).toBeGreaterThanOrEqual(1);
    for (const p of tees) {
      const sides = opens("tee", s.answer.wet.get(p)!);
      expect(sides.length).toBe(3);
      for (const side of sides) {
        const q = neighbour(p, side, 4, 4);
        expect(q === null || f.wet[q] || side === s.spout.side).toBe(true);
      }
    }
    // Both basins hang from that tee: two roads leave it.
    expect(s.basins.length).toBe(2);
  });
  it("gives the Challenge at least three pieces that are not on the answer's road, which lie as they are and cost nothing", () => {
    const s = fresh("challenge");
    const off = s.cells.flatMap((piece, p) => (!s.answer.wet.has(p) && piece.kind !== "blank" ? [p] : []));
    expect(off.length).toBeGreaterThanOrEqual(3);
    expect(off.length).toBe(10);
    // Turned any way they like, the water does not reach them, and the answer is as it was.
    for (const p of off) {
      for (let t = 0; t < 4; t++) {
        const cells = channelsIntended("challenge").map((c, i) => (i === p ? { ...c, turn: t } : c));
        const f = flow({ rows: 5, cols: 5, cells, spout: s.spout });
        expect(f.wet[p], `place ${p} turn ${t}`).toBe(false);
        expect(finished({ ...s, cells })).toBe(true);
      }
    }
    // Some are not turnable and some are: the Challenge has a cross, a tee and an end among them.
    expect(new Set(off.map((p) => s.cells[p]!.kind))).toEqual(new Set(["straight", "bend", "tee", "cross", "end"]));
  });
  it("makes the Challenge start leak and the answer not: water runs at the start and spills, so a wrong piece shows only when the sluice is opened", () => {
    const s = fresh("challenge");
    const f = flow(gridOf(s));
    expect(f.wet.some(Boolean)).toBe(true);
    expect(f.leaks.length).toBeGreaterThan(0);
    const done = solve(s);
    expect(flow(gridOf(done)).leaks).toEqual([]);
    expect(finished(done)).toBe(true);
  });
  it("gives the Story and the Explorer an answer that spills nowhere and a start that spills somewhere", () => {
    for (const style of ["story", "explorer"] as const) {
      const s = fresh(style);
      expect(flow(gridOf(s)).leaks.length, style).toBeGreaterThan(0);
      expect(flow(gridOf(solve(s))).leaks, style).toEqual([]);
    }
  });
  it("names the quest's id from the Atlas: the subject's quest code, then the subject", () => {
    const atlas = JSON.parse(readFileSync(here("content", "atlas.v1.json"), "utf8")) as { subjects: { id: string; world: string; quest: string; records: string[] }[]; worlds: { id: string; order: number }[] };
    const sub = atlas.subjects.find((x) => x.id === CHANNELS_SUBJECT)!;
    expect(sub.quest).toBe("w08q2");
    expect(CHANNELS_QUEST).toBe(`${sub.quest}-${sub.id}`);
    expect(atlas.worlds.find((w) => w.id === sub.world)!.order).toBe(8);
    expect([...CHANNELS_RECORDS]).toEqual(sub.records);
  });
});

describe("playing", () => {
  it("makes a turn one move, turns the piece a quarter turn clockwise, and says what it did", () => {
    const s = fresh("explorer");
    const p = s.cells.findIndex((c) => c.kind === "bend");
    const t = applyChannels(s, { type: "turn", cell: p });
    expect(t.moves).toBe(1);
    expect(t.cells[p]!.turn).toBe((s.cells[p]!.turn + 1) % 4);
    expect(t.last).toEqual({ type: "turn", cell: p });
    expect(t.cells.filter((c, i) => c !== s.cells[i]).length).toBe(1);
    // Four turns bring it back, and four moves are counted.
    let c = t;
    for (let i = 0; i < 3; i++) c = turn(c, p);
    expect(c.cells[p]).toEqual(s.cells[p]);
    expect(c.moves).toBe(4);
  });
  it("refuses a place that is not on the grid, and a piece that looks the same turned, and counts neither", () => {
    const s = fresh("challenge");
    for (const cell of [-1, 25, 1.5, NaN, Infinity]) expect(turn(s, cell), String(cell)).toBe(s);
    const cross = s.cells.findIndex((c) => c.kind === "cross");
    const blank = s.cells.findIndex((c) => c.kind === "blank");
    expect(cross).toBeGreaterThanOrEqual(0);
    expect(blank).toBeGreaterThanOrEqual(0);
    expect(turn(s, cross)).toBe(s);
    expect(turn(s, blank)).toBe(s);
  });
  it("makes a straight piece that is turned twice look as it did, and counts both turns", () => {
    const s = fresh("story");
    const p = s.cells.findIndex((c) => c.kind === "straight");
    const t = turn(turn(s, p), p);
    expect(t.moves).toBe(2);
    expect(opens("straight", t.cells[p]!.turn).sort()).toEqual(opens("straight", s.cells[p]!.turn).sort());
    expect(fewest(t)).toBe(fewest(s));
  });
  it("makes the Story and the Explorer done the moment the water reaches every basin, and the Challenge only when the sluice is opened", () => {
    for (const style of ["story", "explorer"] as const) {
      const s = fresh(style);
      expect(solve(s).done, style).toBe(true);
    }
    const c = fresh("challenge");
    const ready = solve(c);
    expect(finished(ready)).toBe(true);
    expect(ready.done).toBe(false);
    const opened = applyChannels(ready, { type: "open" });
    expect(opened.done).toBe(true);
    expect(opened.openings).toBe(0);
    expect(opened.last).toEqual({ type: "open", wet: 2, basins: 2, leaks: 0 });
  });
  it("counts an opening of the sluice that does not finish the grid, says how much water reached and how many places leak, and hides the water again with the next turn", () => {
    const c = fresh("challenge");
    const o = applyChannels(c, { type: "open" });
    expect(o.done).toBe(false);
    expect(o.openings).toBe(1);
    expect(o.moves).toBe(0);
    expect(o.last).toEqual({ type: "open", wet: 0, basins: 2, leaks: flow(gridOf(c)).leaks.length });
    expect(o.last).toMatchObject({ type: "open", leaks: 1 });
    const t = applyChannels(o, { type: "turn", cell: 11 });
    expect(t.last?.type).toBe("turn");
    expect(applyChannels(t, { type: "open" }).openings).toBe(2);
  });
  it("does not call water done where it reaches the basin but spills, if the grid says nothing may leak; a grid that allows it is done", () => {
    // [straight ew][tee w,s,n]/[blank][end n]: the tee also opens to the north, which is the edge.
    const cells = grid1(["ew", "nsw", "", "n"], [0, 0, 0, 0]);
    const base = { rows: 2, cols: 2, cells, spout: { cell: 0, side: "w" as Side }, basins: [{ cell: 3, kind: "fountain" as const }] };
    expect(flow(gridOf(base)).wet[3]).toBe(true);
    expect(flow(gridOf(base)).leaks).toEqual([{ cell: 1, side: "n" }]);
    expect(finished({ ...base, noLeaks: true })).toBe(false);
    expect(finished({ ...base, noLeaks: false })).toBe(true);
  });
  it("lets nothing change a finished grid: no turn, no opening, no question", () => {
    const done = solve(fresh("story"));
    expect(done.done).toBe(true);
    for (const cmd of [{ type: "turn", cell: 0 }, { type: "turn", cell: 3 }, { type: "open" }, { type: "flag", flag: "feather" }] as ChannelsCommand[]) expect(applyChannels(done, cmd)).toBe(done);
    const cd = applyChannels(solve(fresh("challenge")), { type: "open" });
    expect(cd.done).toBe(true);
    expect(applyChannels(cd, { type: "turn", cell: 11 })).toBe(cd);
    expect(applyChannels(cd, { type: "open" })).toBe(cd);
  });
  it("keeps the questions as flags, once each, ignores a flag it does not know, and does not count a flag as a move", () => {
    const s = fresh("story");
    const f = run(s, [{ type: "flag", flag: "askedWater" }, { type: "flag", flag: "askedWater" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "nonsense" as never }]);
    expect(f.flags).toEqual(["askedWater", "kind"]);
    expect(f.moves).toBe(0);
    expect([...CHANNELS_FLAGS]).toEqual(["askedWater", "askedCourts", "kind", "feather", "answered"]);
  });
});

describe("the goals", () => {
  const full = (style: ChannelsStyle, extra: ChannelsCommand[] = []) => run(fresh(style), [{ type: "flag", flag: "askedWater" }, { type: "flag", flag: "askedCourts" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }, ...extra]);
  it("gives the Story no count: curiosity needs both questions, kindness the kind answer, the feather the look", () => {
    const g = channelsGoals(solve(full("story")), CHANNELS_SLACK.story);
    expect(g).toEqual({ turns: 6, slips: 0, curiosity: true, ingenuity: true, kindness: true, feather: true });
    const half = channelsGoals(solve(run(fresh("story"), [{ type: "flag", flag: "askedWater" }, { type: "flag", flag: "answered" }])), CHANNELS_SLACK.story);
    expect(half).toMatchObject({ curiosity: false, ingenuity: true, kindness: false, feather: false });
  });
  it("lets the Explorer take up to four turns more than the fewest", () => {
    const s = full("explorer");
    expect(CHANNELS_SLACK.explorer).toEqual({ extra: 4, openings: null });
    // Turns spent on a piece off the road, which change nothing: 11 + 4 = 15 is within the slack; one more is not.
    const off = s.cells.findIndex((piece, i) => !s.answer.wet.has(i) && turnable(piece.kind));
    expect(off).toBeGreaterThanOrEqual(0);
    const spend = (n: number) => {
      let c: ChannelsState = s;
      for (let i = 0; i < n; i++) c = turn(c, off);
      return solve(c);
    };
    expect(spend(4).moves).toBe(15);
    expect(channelsGoals(spend(4), CHANNELS_SLACK.explorer).ingenuity).toBe(true);
    expect(channelsGoals(spend(5), CHANNELS_SLACK.explorer).ingenuity).toBe(false);
  });
  it("lets the Challenge take two turns more than the fewest and two openings of the sluice that did not finish it", () => {
    expect(CHANNELS_SLACK.challenge).toEqual({ extra: 2, openings: 2 });
    const off = (c: ChannelsState) => c.cells.findIndex((piece, i) => !c.answer.wet.has(i) && turnable(piece.kind));
    const base = full("challenge");
    const o = off(base);
    const play = (waste: number, vain: number) => {
      let c: ChannelsState = base;
      for (let i = 0; i < waste; i++) c = turn(c, o);
      for (let i = 0; i < vain; i++) c = applyChannels(c, { type: "open" });
      return applyChannels(solve(c), { type: "open" });
    };
    expect(channelsGoals(play(2, 2), CHANNELS_SLACK.challenge)).toMatchObject({ turns: 16, slips: 2, ingenuity: true });
    expect(channelsGoals(play(3, 0), CHANNELS_SLACK.challenge).ingenuity).toBe(false);
    expect(channelsGoals(play(0, 3), CHANNELS_SLACK.challenge)).toMatchObject({ slips: 3, ingenuity: false });
    expect(play(0, 0).done).toBe(true);
  });
});

describe("a place kept and put back", () => {
  it("round-trips a grid in the middle: the turns, the counts and the questions come back, and what the last command did does not", () => {
    for (const style of STYLES) {
      const s = run(fresh(style), [{ type: "turn", cell: 1 }, { type: "flag", flag: "askedCourts" }, { type: "turn", cell: 5 }, { type: "turn", cell: 5 }]);
      const snap = snapshotChannels(s);
      expect(JSON.parse(JSON.stringify(snap))).toEqual(snap);
      const back = restoreChannels(snap, channelsGrid)!;
      expect(back.cells).toEqual(s.cells);
      expect(back.moves).toBe(s.moves);
      expect(back.openings).toBe(s.openings);
      expect(back.flags).toEqual(s.flags);
      expect(back.last).toBeNull();
      expect(back.done).toBe(false);
    }
  });
  it("brings back a Challenge grid that is ready, because it is done only when the sluice is opened, but never a Story or Explorer grid that is already finished", () => {
    const ready = solve(fresh("challenge"));
    expect(restoreChannels(snapshotChannels(ready), channelsGrid)!.cells).toEqual(ready.cells);
    for (const style of ["story", "explorer"] as const) expect(restoreChannels(snapshotChannels(solve(fresh(style))), channelsGrid), style).toBeNull();
  });
  it("refuses what cannot be trusted: not an object, an unknown style, the wrong number of turns, a turn that is not 0 to 3, a fixed piece that was turned, fewer moves than the turns need, bad counts, no list of flags", () => {
    const s = run(fresh("explorer"), [{ type: "turn", cell: 1 }]);
    const good = snapshotChannels(s);
    for (const bad of [null, undefined, 5, "x", [], { ...good, style: "easy" }, { ...good, turns: good.turns.slice(1) }, { ...good, turns: [...good.turns, 0] }, { ...good, turns: good.turns.map((t, i) => (i === 0 ? 4 : t)) }, { ...good, turns: good.turns.map((t, i) => (i === 0 ? -1 : t)) }, { ...good, turns: good.turns.map((t, i) => (i === 0 ? 1.5 : t)) }, { ...good, turns: good.turns.map((t, i) => (i === 0 ? "1" : t)) }, { ...good, moves: -1 }, { ...good, moves: 1.5 }, { ...good, moves: 100001 }, { ...good, openings: -1 }, { ...good, openings: "1" }, { ...good, flags: "kind" }, { ...good, flags: undefined }]) {
      expect(restoreChannels(bad, channelsGrid), JSON.stringify(bad)).toBeNull();
    }
    // Fewer moves than the turns past the start need: the grid was not reached by playing.
    const far = { ...good, turns: good.turns.map((t, i) => (i === 1 ? (fresh("explorer").start[1]!.turn + 3) % 4 : fresh("explorer").start[i]!.turn)), moves: 2 };
    expect(restoreChannels(far, channelsGrid)).toBeNull();
    expect(restoreChannels({ ...far, moves: 3 }, channelsGrid)).not.toBeNull();
    // A cross that the player never could have turned.
    const c = fresh("challenge");
    const cross = c.cells.findIndex((p) => p.kind === "cross");
    const bent = { ...snapshotChannels(c), turns: snapshotChannels(c).turns.map((t, i) => (i === cross ? 1 : t)), moves: 1 };
    expect(restoreChannels(bent, channelsGrid)).toBeNull();
  });
  it("keeps only the flags it knows, in its own order", () => {
    const s = fresh("story");
    const b = restoreChannels({ ...snapshotChannels(s), flags: ["feather", "kind", "nonsense", "askedWater"] }, channelsGrid)!;
    expect(b.flags).toEqual(["askedWater", "kind", "feather"]);
  });
  it("builds the grid afresh for the style, so that a saved Story is never read as an Explorer", () => {
    const s = run(fresh("story"), [{ type: "turn", cell: 0 }]);
    expect(restoreChannels({ ...snapshotChannels(s), style: "explorer" }, channelsGrid)).toBeNull();
  });
});

describe("the picture's hit-test", () => {
  for (const style of STYLES) {
    for (const rtl of [false, true]) {
      it(`finds each place from its middle and its middle from each place, ${style}, ${rtl ? "right to left" : "left to right"}`, () => {
        const { rows, cols } = channelsGrid(style);
        const { tile } = channelsLayout(rows, cols);
        for (let p = 0; p < rows * cols; p++) {
          const o = tileOrigin(p, rows, cols);
          const x = rtl ? CHANNELS_ART.w - (o.x + tile / 2) : o.x + tile / 2;
          expect(channelsHit(x, o.y + tile / 2, rows, cols, rtl), `place ${p}`).toBe(p);
          // The corners just inside belong to the place too.
          const inx = rtl ? CHANNELS_ART.w - (o.x + 2) : o.x + 2;
          expect(channelsHit(inx, o.y + 2, rows, cols, rtl)).toBe(p);
        }
        // The gap between two places, the margin and the corners of the picture are nothing.
        expect(channelsHit(0, 0, rows, cols, rtl)).toBeNull();
        expect(channelsHit(CHANNELS_ART.w, CHANNELS_ART.h, rows, cols, rtl)).toBeNull();
        expect(channelsHit(-5, 10, rows, cols, rtl)).toBeNull();
        const a = tileOrigin(0, rows, cols);
        const gapX = a.x + tile + (channelsLayout(rows, cols).pitch - tile) / 2;
        expect(channelsHit(rtl ? CHANNELS_ART.w - gapX : gapX, a.y + tile / 2, rows, cols, rtl)).toBeNull();
      });
    }
  }
  it("puts the first column on the right of the picture when the page reads right to left", () => {
    const { rows, cols } = channelsGrid("explorer");
    const { tile } = channelsLayout(rows, cols);
    const first = tileOrigin(0, rows, cols);
    const rightMiddle = CHANNELS_ART.w - (first.x + tile / 2);
    expect(channelsHit(rightMiddle, first.y + tile / 2, rows, cols, true)).toBe(0);
    expect(channelsHit(rightMiddle, first.y + tile / 2, rows, cols, false)).not.toBe(0);
    expect(rightMiddle).toBeGreaterThan(CHANNELS_ART.w / 2);
  });
  it("keeps every tile inside the picture, with room for the spout on its side", () => {
    for (const style of STYLES) {
      const { rows, cols, spout } = channelsGrid(style);
      const { tile } = channelsLayout(rows, cols);
      for (let p = 0; p < rows * cols; p++) {
        const o = tileOrigin(p, rows, cols);
        expect(o.x).toBeGreaterThanOrEqual(CHANNELS_ART.mx - 1);
        expect(o.y).toBeGreaterThanOrEqual(CHANNELS_ART.my - 1);
        expect(o.x + tile).toBeLessThanOrEqual(CHANNELS_ART.w - CHANNELS_ART.mx + 1);
        expect(o.y + tile).toBeLessThanOrEqual(CHANNELS_ART.h - CHANNELS_ART.my + 1);
      }
      expect(spout.side).toBe("w");
      expect(tileOrigin(spout.cell, rows, cols).x).toBeGreaterThanOrEqual(CHANNELS_ART.mx);
    }
  });
});

describe("the mirrored grid", () => {
  for (const style of STYLES) {
    for (const rtl of [false, true]) {
      it(`joins its channels across every seam where two pieces open to each other, ${style}, ${rtl ? "mirrored" : "plain"}`, () => {
        const def = channelsGrid(style);
        const { rows, cols } = def;
        const cells = channelsIntended(style);
        let seams = 0;
        for (let p = 0; p < rows * cols; p++) {
          for (const side of ["e", "s"] as const) {
            const q = neighbour(p, side, rows, cols);
            if (q === null) continue;
            if (!isOpen(cells[p]!.kind, cells[p]!.turn, side) || !isOpen(cells[q]!.kind, cells[q]!.turn, opposite(side))) continue;
            seams++;
            // The channel that leaves p by `side` and the one that leaves q by the opposite side cross the gap at the same point, as the picture shows them.
            const a = seamPoint(p, side, rows, cols, rtl);
            const b = seamPoint(q, opposite(side), rows, cols, rtl);
            expect(a.x, `${p}->${q}`).toBeCloseTo(b.x, 6);
            expect(a.y, `${p}->${q}`).toBeCloseTo(b.y, 6);
          }
        }
        expect(seams).toBeGreaterThan(3);
      });
    }
  }
  it("shows east on the left of west when mirrored, so that the first column is on the right and the water runs from right to left", () => {
    const { rows, cols } = channelsGrid("challenge");
    const e = seamPoint(7, "e", rows, cols, true);
    const w = seamPoint(7, "w", rows, cols, true);
    expect(e.x).toBeLessThan(w.x);
    const e0 = seamPoint(7, "e", rows, cols, false);
    const w0 = seamPoint(7, "w", rows, cols, false);
    expect(e0.x).toBeGreaterThan(w0.x);
    // North and south keep their places.
    expect(seamPoint(7, "n", rows, cols, true).y).toBeLessThan(seamPoint(7, "s", rows, cols, true).y);
    // A mirrored picture of the same place has the same y.
    expect(seamPoint(7, "n", rows, cols, true).y).toBe(seamPoint(7, "n", rows, cols, false).y);
    expect(seamPoint(7, "n", rows, cols, true).x).toBeCloseTo(CHANNELS_ART.w - seamPoint(7, "n", rows, cols, false).x, 6);
  });
});

describe("the record behind the lines", () => {
  it("links only to records that exist in the museum's data, and each is one the Atlas subject names", () => {
    expect([...CHANNELS_RECORDS]).toEqual(["building/alhambra", "building/nasrid-palaces-alhambra"]);
    for (const id of CHANNELS_RECORDS) expect(existsSync(resolve(root, "data", `${id}.yaml`)), id).toBe(true);
  });
  it("rests the narrator's lines and the note on the record's own sentences", () => {
    expect(alhambra).toContain("Work began with an aqueduct from the mountains, so that water ran through the town and the palaces.");
    expect(alhambra).toContain("The article describes the palaces as groups of buildings arranged round courtyards, with the court and not the building as the central element");
    expect(alhambra).toContain("the patio of Comares, also called the patio of la Alberca or of the Myrtles");
    expect(alhambra).toContain("A very long pool bordered by myrtles fills the centre");
    expect(alhambra).toContain("The court is divided by two intersecting paths with a fountain at the crossing, whose basin rests on stone lions that probably belonged to a palace of the 5th/11th century.");
    expect(alhambra).toContain("## The Court of the Lions");
    // The record says the Generalife is supplied by the same aqueduct, and that is all it says about where the water goes.
    expect(alhambra).toContain("supplied by the same aqueduct");
    expect(alhambra).not.toMatch(/sluice|irrigation|acequia system|waterworks/i);
  });
  it("reads the same in the museum's Arabic record: the aqueduct, the pool bordered by myrtle (al-as) in the court the museum calls fina' Qumarish, and the Court of the Lions as bahw al-usud", () => {
    expect(alhambraAr).toContain("وبدأ العمل بقناة ماء من الجبال، حتى جرى الماء في المدينة والقصور");
    expect(alhambraAr).toContain("ويسمى أيضاً فناء البركة أو الآس");
    expect(alhambraAr).toContain("فبركة طويلة جداً يحدها الآس تملأ الوسط");
    expect(alhambraAr).toContain("## بهو الأسود");
    expect(alhambraAr).toContain("ويقسم الفناءَ ممران متقاطعان في تقاطعهما نافورة يستقر حوضها على أسود من حجر يرجح أنها من قصر");
    // The museum's Arabic record never calls the myrtle al-rayhan (basil and sweet herbs), which the brief wrote; it writes al-as.
    expect(alhambraAr).not.toContain("الريحان");
  });
  it("calls the court of the Myrtles a patio in the record and a court in the brief, and says only 'probably' of the lions", () => {
    expect(alhambra).toContain("patio of Comares");
    expect(table("en").ah_note_2).toContain("In the Court of the Myrtles");
    expect(table("en").ah_note_3).toContain("probably");
    expect(table("ar").ah_note_3).toContain("على الأرجح");
  });
});

describe("the words", () => {
  /** The lines written for the quest, kept exactly: key, Arabic, English. One word of the Arabic differs from the brief: in `ah_note_2` the myrtle is written «الآس», as the museum's Arabic record writes it (twice), and not «الريحان» (basil), which the brief typed. */
  const WRITTEN: [string, string, string][] = [
    ["ah_intro_1", "صفحة الأطلس سقطت في نافورة جافّة. إذا جرى الماء طفت الصفحة وخرجت!", "The page of the Atlas has fallen into a dry fountain. If the water runs, the page will float up and out!"],
    ["ah_intro_2", "الماء ينزل من الجبل في القناة. أدِر قطع السواقي حتى يتّصل الطريق.", "The water comes down from the mountain in the channel. Turn the pieces of the channels until the way is joined."],
    ["ah_water_1", "يقول سجل المتحف إن العمل في الحمراء بدأ بقناة تجلب الماء من الجبال، فجرى الماء في المدينة والقصور.", "The museum's record says work on the Alhambra began with an aqueduct from the mountains, so that water ran through the town and the palaces."],
    ["ah_court_1", "ويقول إن بهو الأسود يقطعه ممرّان متقاطعان، وعند تقاطعهما نافورة يقوم حوضها على أسود من حجر.", "It says the Court of the Lions is divided by two paths that cross, with a fountain at the crossing whose basin rests on stone lions."],
    ["ah_note_1", "هذه لعبة وليست كتاب تاريخ. شبكة السواقي والنافورة الجافّة وحارس الماء والطفلة التي تكنس البهو وكل كلمة تُقال من خيال اللعب. والشبكة ليست مخطّط الحمراء ولا مخطّط مياهها.", "This is a game, not a history. The grid of channels, the dry fountain, the keeper of the water, the girl who sweeps the court and every spoken line are invented for play. The grid is not the plan of the Alhambra, nor of its waterworks."],
    ["ah_note_2", "من سجل المتحف: بدأ العمل في الحمراء بقناة تجلب الماء من الجبال. وفي بهو الآس بركة طويلة جدًّا يحفّ بها الآس، وفي بهو الأسود نافورة عند تقاطع ممرّين يقوم حوضها على أسود من حجر.", "From the museum's record: work on the Alhambra began with an aqueduct from the mountains. In the Court of the Myrtles a very long pool bordered by myrtles fills the centre, and in the Court of the Lions a fountain stands where two paths cross, its basin resting on stone lions."],
    ["ah_note_3", "ويقول السجل إن الأسود الحجرية كانت على الأرجح لقصر أقدم.", "The record says the stone lions probably belonged to an older palace."],
    ["ah_note_4", "بُسِّط من أجل اللعب: ما قُرئ لهذه اللعبة لا يذكر كيف كان الماء يُساق من القناة إلى كل بهو. وقطع السواقي التي تُدار من وضع اللعبة.", "Made simpler for play: what was read for this game does not say how the water was led from the aqueduct to each court. The channel pieces that turn are the game's own."],
  ];
  it("keeps the lines written for the quest exactly, in Arabic and English, and the speakers' words", () => {
    for (const [k, ar, en] of WRITTEN) {
      expect(table("ar")[k], k).toBe(ar);
      expect(table("en")[k], k).toBe(en);
    }
    const en = table("en");
    const ar = table("ar");
    expect(en.ah_who_keeper).toBe("The keeper of the water, an invented person");
    expect(ar.ah_who_keeper).toBe("حارس الماء، شخصية من الخيال");
    expect(en.ah_who_girl).toBe("The girl who sweeps the court, an invented person");
    expect(ar.ah_who_girl).toBe("الطفلة كنّاسة البهو، شخصية من الخيال");
    expect([en.ah_rec_alhambra, en.ah_rec_palaces, en.ah_sluice]).toEqual(["the Alhambra", "the Nasrid palaces", "Open the sluice"]);
    expect(en.ah_label).toBe("Row {r}, place {c}: {piece}, open to {sides}");
    expect(en.ah_did_turn).toBe("Row {r}, place {c} turned.");
    expect(en.ah_water_basins).toBe("Water reaches {list}.");
    expect(en.ah_water_leak).toBe("Water leaks at {list}.");
    // Four notes and no fifth; the fourth says the game's pieces are its own.
    expect(Object.keys(en).filter((k) => k.startsWith("ah_note_") && /\d$/.test(k))).toEqual(["ah_note_1", "ah_note_2", "ah_note_3", "ah_note_4"]);
  });
  it("writes the myrtle the way the museum's Arabic record does, in the one line that differs from the brief, and nowhere writes al-rayhan", () => {
    const ar = table("ar");
    expect(ar.ah_note_2).toContain("بهو الآس");
    expect(ar.ah_note_2).toContain("يحفّ بها الآس");
    for (const [k, v] of Object.entries(ar)) if (k.startsWith("ah_")) expect(v, k).not.toContain("الريحان");
    expect(table("ur").ah_note_2).toContain("آس");
  });
  it("anchors each line to the record's own file: the sentence of the record it rests on is there, in English and in Arabic", () => {
    // [key, a phrase of the English record, a phrase of the Arabic record]
    const rests: [string, string, string][] = [
      ["ah_water_1", "Work began with an aqueduct from the mountains, so that water ran through the town and the palaces", "وبدأ العمل بقناة ماء من الجبال، حتى جرى الماء في المدينة والقصور"],
      ["ah_court_1", "The court is divided by two intersecting paths with a fountain at the crossing, whose basin rests on stone lions", "ويقسم الفناءَ ممران متقاطعان في تقاطعهما نافورة يستقر حوضها على أسود من حجر"],
      ["ah_note_2", "A very long pool bordered by myrtles fills the centre", "فبركة طويلة جداً يحدها الآس تملأ الوسط"],
      ["ah_note_3", "stone lions that probably belonged to a palace of the 5th/11th century", "أسود من حجر يرجح أنها من قصر يعود إلى القرن الخامس الهجري"],
    ];
    for (const [k, en, ar] of rests) {
      expect(table("en")[k], k).toBeTruthy();
      expect(alhambra, `${k} en`).toContain(en);
      expect(alhambraAr, `${k} ar`).toContain(ar);
    }
  });
  it("never calls an invented character the Messenger, in any language that has the word", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ah_")) expect(v, `${l}:${k}`).not.toMatch(/الرسول/);
  });
  it("writes no digit in any string of the quest except inside a placeholder, in any language", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) {
      if (!k.startsWith("ah_")) continue;
      expect(v.replace(/\{\w+\}/g, "").match(/[0-9٠-٩۰-۹]+/g) ?? [], `${l}:${k}`).toEqual([]);
    }
  });
  it("types no honorific and no bare parenthesis round Arabic or Urdu script in any string of the quest", () => {
    for (const l of ["ar", "ur"]) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ah_")) expect(/\(|\)/.test(v), `${l}:${k}`).toBe(false);
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ah_")) expect(v, `${l}:${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله/);
  });
  it("says that the grid is not the Alhambra's plan, in every language that the note is written in", () => {
    const needs: Record<string, RegExp> = { en: /not the plan of the Alhambra/, ar: /ليست مخطّط الحمراء/, ur: /نقشہ نہیں/, fr: /n'est pas le plan de l'Alhambra/, es: /no es el plano de la Alhambra/, tr: /Elhamra'nın planı değildir/, id: /bukan denah Istana Alhambra/ };
    for (const l of LANGS) expect(table(l).ah_note_1, l).toMatch(needs[l]!);
  });
  it("has every key the page uses, in all seven languages, with no part left empty, the same placeholders, and no key that nothing uses", () => {
    const keys = new Set([...ui.matchAll(/"(ah_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    for (const who of ["hudhud", "keeper", "girl", "narrator"]) keys.add(`ah_who_${who}`);
    for (const k of KINDS) keys.add(`ah_p_${k}`);
    for (const s of SIDES) keys.add(`ah_s_${s}`);
    expect(keys.size).toBeGreaterThan(60);
    for (const l of LANGS) for (const k of keys) expect((table(l)[k] ?? "").trim().length, `${l}:${k}`).toBeGreaterThan(0);
    for (const k of Object.keys(table("en"))) if (k.startsWith("ah_")) expect(keys.has(k), k).toBe(true);
    for (const l of LANGS) expect(Object.keys(table(l)).filter((k) => k.startsWith("ah_")), l).toEqual(Object.keys(table("en")).filter((k) => k.startsWith("ah_")));
    for (const l of LANGS) for (const k of keys) expect([...(table(l)[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l}:${k}`).toEqual([...(table("en")[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
  });
  it("is appended at the end of each language's file, after the keys of the tenth quest, and only the next quests' keys (`rz_`, then `kr_`) and the journey's (`jn_`), then al-Jazari's room's (`jr_`), then al-Tusi's room's (`tsr_`), then al-Khwarizmi's room's (`akr_`), then al-Kindi's room's (`kdr_`), then al-Idrisi's hall's (`isr_`), then al-Razi's study's (`rzr_`), then Karima's room's (`krr_`), then Ibn Battuta's inn's (`ibr_`), then the coffee room's (`cqr_`), then al-Jahiz's room's (`jzr_`), then the Alhambra's court's (`ahr_`) come after it", () => {
    for (const l of LANGS) {
      const ks = Object.keys(table(l));
      const first = ks.findIndex((k) => k.startsWith("ah_"));
      expect(first, l).toBeGreaterThan(0);
      const count = ks.filter((k) => k.startsWith("ah_")).length;
      expect(ks.slice(first, first + count).every((k) => k.startsWith("ah_")), l).toBe(true);
      expect(ks.slice(first + count).every((k) => k.startsWith("rz_") || k.startsWith("kr_") || k.startsWith("jn_") || k.startsWith("jr_") || k.startsWith("tsr_") || k.startsWith("akr_") || k.startsWith("kdr_") || k.startsWith("isr_") || k.startsWith("rzr_") || k.startsWith("krr_") || k.startsWith("ibr_") || k.startsWith("cqr_") || k.startsWith("jzr_") || k.startsWith("ahr_")), l).toBe(true);
      expect(ks[first - 1]!.startsWith("cq_"), l).toBe(true);
    }
  });
  it("no longer says in the hub that ten quests are built, in any language (the count itself is pinned in leaves.gtest.ts)", () => {
    for (const l of LANGS) expect(table(l).hub_note).not.toMatch(/\bTen quests|\bDix quêtes|\bdiez misiones|\bon görev|\bsepuluh misi|عشر مهمات|دس مہمیں/i);
  });
  it("takes each name from the Atlas heading and the museum's labels unless it is on a short list of named exceptions, which is exactly this list", () => {
    const heading = (l: string) => (JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n-atlas", `${l}.json`), "utf8")) as Record<string, string>).s_alhambra!;
    const label = (path: string) => (parse(readFileSync(resolve(root, "data", path), "utf8")) as { label: Record<string, string | undefined> }).label;
    // Compared without the isolates, the curly apostrophe, case, or a leading article.
    const bare = (x: string | undefined) => (x ?? "").replace(/[\u2066\u2069]/g, "").replace(/\u2019/g, "'").toLowerCase().replace(/^(the|l'|la|les|los|el) ?/, "");
    const found: Record<string, string> = {};
    // The Alhambra: the quest's name is the Atlas heading, as the brief asks; where that is not the museum's label, it is a named exception.
    const lab = label("building/alhambra.yaml");
    for (const l of LANGS) {
      expect(bare(table(l).ah_rec_alhambra), `${l}: the Atlas heading`).toBe(bare(heading(l)));
      if (bare(table(l).ah_rec_alhambra) !== bare(lab[l])) found[`alhambra:${l}`] = `${lab[l]} -> ${table(l).ah_rec_alhambra}`;
    }
    // The Nasrid palaces: the museum's label holds the quest's name (the label may add "Alhambra" or "Hamra" after it).
    const pal = label("building/nasrid-palaces-alhambra.yaml");
    for (const l of LANGS) if (!bare(pal[l]).includes(bare(table(l).ah_rec_palaces))) found[`palaces:${l}`] = `${pal[l]} -> ${table(l).ah_rec_palaces}`;
    // Where the game's form is not the museum's label, and why. The Alhambra: Urdu (the Atlas heading writes the name with the qasr and without the final hamza, the museum's label is الہمبرا) and Turkish (the Atlas heading writes Elhamra Sarayı, the museum's label Alhambra Sarayı); the brief asked for the Atlas heading. The palaces: the museum's Urdu label (ناصرد محل، الحمبرہ) is a garbled form, and the game writes the name the museum's Arabic label has (قصور بني نصر), in Urdu as بنو نصر کے محل.
    const EXCEPTIONS: Record<string, string> = {
      "alhambra:ur": "الہمبرا -> قصر الحمرا",
      "alhambra:tr": "Alhambra Sarayı -> Elhamra Sarayı",
      "palaces:ur": "ناصرد محل، الحمبرہ -> بنو نصر کے محل",
    };
    expect(found).toEqual(EXCEPTIONS);
  });
});

describe("the registry and the helper that keeps movement still", () => {
  const app = readFileSync(here("ui", "app.ts"), "utf8");
  it("adds the quest through the registry of page quests: its subject, its trial line, what it keeps, how it is made, a button on the Atlas, and the test hook", () => {
    expect(app).toMatch(/\[CHANNELS_QUEST\]: \{\s*subject: CHANNELS_SUBJECT,\s*trial: "ah_trial",/);
    expect(app).toContain("restoreChannels(snap, channelsGrid)");
    // The table of built quests is content/journey.ts's since the journey (27 November 2026).
    expect(readFileSync(here("content", "journey.ts"), "utf8")).toContain("[CHANNELS_SUBJECT]: CHANNELS_QUEST");
    // Since 27 November 2026 the channels are turned in the Alhambra's court: the hook opens the page (the way they are played without WebGL), and startAlhambra the court.
    expect(app).toContain("startChannels: () => openPage(CHANNELS_QUEST, null, true)");
    expect(app).toContain("startAlhambra: () => openPage(CHANNELS_QUEST)");
    expect(app).toMatch(/channels: \(\) => \{ const r = pageOf<ChannelsQuest>\(CHANNELS_QUEST\)/);
    expect(app).toContain("channelsCommand:");
    expect(app).toMatch(/reducedMotion: calm,/);
  });
  it("makes the quest follow the game's setting, the system preference and `motion=reduced` through the one helper that the registry hands it, and shows the water at once when movement is kept still", () => {
    expect(ui).toMatch(/reducedMotion\(\): boolean;/);
    expect(ui).toMatch(/host\.reducedMotion\(\)/);
    expect(ui).not.toMatch(/matchMedia|settings\(\)/);
    // A water that runs is stopped when the quest is left.
    expect(ui).toMatch(/stop: \(\) => stopTimer\(\)/);
  });
  it("writes no text in the picture, and draws only a plain spout, a plain round basin and a plain long basin: no plan, tower, arch or lion", () => {
    const art = readFileSync(here("art", "channels.ts"), "utf8");
    expect(art).not.toMatch(/fillText|strokeText|drawImage/);
    for (const k of ["function fountain", "function pool", "function spout"]) expect(art).toContain(k);
    // The words tower, arch and lion appear in no function name of the picture's code.
    expect(art.match(/function (\w+)/g)!.join(" ")).not.toMatch(/tower|arch|lion|plan/i);
  });
});

describe("the fewest turns, kept honest", () => {
  const want = (t: number) => ({ wet: new Map([[0, t]]), closed: new Map<number, ReadonlySet<Side>>() });
  it("is what it takes to bring each piece to the answer by forward turns only, not the shortest way round if that is backwards", () => {
    // A bend that lies a quarter turn past the answer needs three forward turns, not one backwards.
    expect(fewestTurns([{ kind: "bend", turn: 1 }], want(0))).toBe(3);
    expect(fewestTurns([{ kind: "bend", turn: 3 }], want(0))).toBe(1);
    expect(fewestTurns([{ kind: "tee", turn: 0 }], want(2))).toBe(2);
    // A straight piece looks right after two turns, so it needs at most one; a cross or a plain stone none.
    expect(fewestTurns([{ kind: "straight", turn: 3 }], want(0))).toBe(1);
    expect(fewestTurns([{ kind: "straight", turn: 2 }], want(0))).toBe(0);
    expect(fewestTurns([{ kind: "cross", turn: 0 }], want(0))).toBe(0);
  });
  it("makes a piece off the road that touches the water cost the turns it takes to clear it, if the answer has water facing it", () => {
    const closed = new Map<number, ReadonlySet<Side>>([[0, new Set<Side>(["n"])]]);
    // An end piece open to the north must be turned once to be open to the east; one already open that way costs nothing.
    expect(fewestTurns([{ kind: "end", turn: 0 }], { wet: new Map(), closed })).toBe(1);
    expect(fewestTurns([{ kind: "end", turn: 1 }], { wet: new Map(), closed })).toBe(0);
    expect(fewestTurns([{ kind: "blank", turn: 0 }], { wet: new Map(), closed })).toBe(0);
  });
});
