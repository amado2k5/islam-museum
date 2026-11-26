// The light puzzle: a thin beam on a grid, turned by mirrors and stopped by anything opaque. Pure rules over plain
// data, so that the same puzzle gives the same beam in Node, in a test and in the browser. Nothing here draws.
//
// What it stands on: the museum's record invention/camera-obscura says that in Ibn al-Haytham's dark-room tests the
// light "appears on the opposite wall along a straight line that can be cut with an opaque body". The beam here goes
// straight until a mirror turns it or a solid thing stops it. The grid, the mirrors at 45 degrees and the page that
// wants light are the game's own invention.
import type { Rng } from "@im/kernel/prng";

export type Dir = "E" | "S" | "W" | "N";
/** A mirror leans one of two ways ("/" rises to the right, "\\" falls to the right) or is laid flat ("-"), out of the
 * beam's way: the beam then passes over it as if it were not there. */
export type Lean = "/" | "\\" | "-";
export interface Cell {
  col: number;
  row: number;
}
export interface Mirror extends Cell {
  id: string;
  lean: Lean;
}
export interface LightPuzzle {
  cols: number;
  rows: number;
  /** The beam comes in at this cell's edge, already travelling in `dir`. */
  source: Cell & { dir: Dir };
  mirrors: Mirror[];
  /** Solid things that stop the beam. */
  blocks: Cell[];
  /** Glass the beam passes through; the picture changes, the rule does not. */
  prisms: Cell[];
  /** The cell that must be lit, from any side. */
  target: Cell;
  /** The positions a mirror goes through as it is turned, in order. Two leans unless a puzzle says otherwise. */
  leans?: Lean[];
}
export const TWO_LEANS: readonly Lean[] = ["/", "\\"];
export const THREE_LEANS: readonly Lean[] = ["/", "\\", "-"];
const leansOf = (p: LightPuzzle): readonly Lean[] => p.leans ?? TWO_LEANS;
export interface Segment {
  from: Cell;
  to: Cell;
  dir: Dir;
  /** True once the beam has gone through a prism. */
  spread: boolean;
}
export interface Trace {
  segments: Segment[];
  /** Mirror ids in the order the beam meets them. */
  touched: string[];
  /** How the beam ends. */
  end: "target" | "block" | "wall" | "loop";
  lit: boolean;
  /** The last cell the beam reaches (inside the grid). */
  last: Cell;
}

const STEP: Record<Dir, [number, number]> = { E: [1, 0], S: [0, 1], W: [-1, 0], N: [0, -1] };
// Rows grow downward, so "/" sends a beam travelling east up (north), and "\" sends it down (south).
const TURN: Record<"/" | "\\", Record<Dir, Dir>> = {
  "/": { E: "N", N: "E", W: "S", S: "W" },
  "\\": { E: "S", S: "E", W: "N", N: "W" },
};
const same = (a: Cell, b: Cell) => a.col === b.col && a.row === b.row;
/** The position after this one as a mirror is turned. */
export const nextLean = (l: Lean, leans: readonly Lean[] = TWO_LEANS): Lean => leans[(leans.indexOf(l) + 1) % leans.length] ?? leans[0]!;

/** Follows the beam from the source until it lights the target, is stopped, leaves the grid or goes round in a ring. */
export function trace(p: LightPuzzle): Trace {
  const segments: Segment[] = [];
  const touched: string[] = [];
  const seen = new Set<string>();
  let at: Cell = { col: p.source.col, row: p.source.row };
  let dir = p.source.dir;
  let start: Cell = { col: at.col - STEP[dir][0], row: at.row - STEP[dir][1] };
  let spread = false;
  const push = (to: Cell) => segments.push({ from: start, to, dir, spread });
  for (;;) {
    if (at.col < 0 || at.row < 0 || at.col >= p.cols || at.row >= p.rows) {
      const last = { col: at.col - STEP[dir][0], row: at.row - STEP[dir][1] };
      push(at);
      return { segments, touched, end: "wall", lit: false, last };
    }
    const key = `${at.col},${at.row},${dir}`;
    if (seen.has(key)) {
      push(at);
      return { segments, touched, end: "loop", lit: false, last: at };
    }
    seen.add(key);
    if (same(at, p.target)) {
      push(at);
      return { segments, touched, end: "target", lit: true, last: at };
    }
    if (p.blocks.some((b) => same(b, at))) {
      push(at);
      return { segments, touched, end: "block", lit: false, last: at };
    }
    const mirror = p.mirrors.find((m) => same(m, at) && m.lean !== "-");
    if (mirror && mirror.lean !== "-") {
      push(at);
      touched.push(mirror.id);
      start = at;
      dir = TURN[mirror.lean][dir];
    } else if (p.prisms.some((g) => same(g, at)) && !spread) {
      push(at);
      start = at;
      spread = true;
    }
    at = { col: at.col + STEP[dir][0], row: at.row + STEP[dir][1] };
  }
}

/** The puzzle with one mirror turned to its next position. An unknown id changes nothing. */
export function turnMirror(p: LightPuzzle, id: string): LightPuzzle {
  return { ...p, mirrors: p.mirrors.map((m) => (m.id === id ? { ...m, lean: nextLean(m.lean, leansOf(p)) } : m)) };
}

export interface Solution {
  /** The fewest turns of mirrors that light the target, or null when no setting does. */
  turns: number | null;
  /** The mirrors to turn for that fewest, one entry a turn (a mirror turned twice is named twice). */
  ids: string[];
  /** How many settings of the mirrors light the target. */
  settings: number;
}

/** Tries every setting of the mirrors. Twelve two-way mirrors or seven three-way ones at most: a few thousand traces. */
export function solve(p: LightPuzzle): Solution {
  const leans = leansOf(p);
  const k = leans.length;
  const n = p.mirrors.length;
  if (k ** n > 5000) throw new RangeError(`solve: ${k}^${n} settings is more than this search is meant for`);
  let best: number | null = null;
  let ids: string[] = [];
  let settings = 0;
  const steps = new Array<number>(n).fill(0);
  for (let c = 0; c < k ** n; c++) {
    // The c-th setting: each mirror turned `steps[i]` times from where it stands.
    for (let i = 0, rest = c; i < n; i++, rest = Math.floor(rest / k)) steps[i] = rest % k;
    const q: LightPuzzle = { ...p, mirrors: p.mirrors.map((m, i) => ({ ...m, lean: leans[(leans.indexOf(m.lean) + steps[i]!) % k]! })) };
    if (!trace(q).lit) continue;
    settings++;
    const total = steps.reduce((a, b) => a + b, 0);
    if (best === null || total < best) {
      best = total;
      ids = p.mirrors.flatMap((m, i) => Array.from({ length: steps[i]! }, () => m.id));
    }
  }
  return { turns: best, ids, settings };
}

/**
 * A puzzle made from a seed, for challenge rooms and the tests: a path with `turns` corners is laid from the west
 * wall, a mirror is set at every corner, `decoys` more are scattered off the path, and every mirror is then left
 * leaning by the seed. The path guarantees that a setting exists which lights the target; `solve` confirms it.
 */
export function generate(rng: Rng, opts: { cols?: number; rows?: number; turns?: number; decoys?: number } = {}): LightPuzzle {
  const cols = opts.cols ?? 12;
  const rows = opts.rows ?? 5;
  const turns = Math.max(1, Math.min(opts.turns ?? 3, 6));
  const decoys = Math.max(0, Math.min(opts.decoys ?? 2, 4));
  for (let attempt = 0; attempt < 400; attempt++) {
    const source = { col: 0, row: rng.int(0, rows - 1), dir: "E" as Dir };
    const used = new Set<string>();
    const k = (c: Cell) => `${c.col},${c.row}`;
    const mirrors: Mirror[] = [];
    let at: Cell = { col: 0, row: source.row };
    let dir: Dir = "E";
    let ok = true;
    used.add(k(at));
    const walk = (len: number): boolean => {
      for (let i = 0; i < len; i++) {
        at = { col: at.col + STEP[dir][0], row: at.row + STEP[dir][1] };
        if (at.col < 0 || at.row < 0 || at.col >= cols || at.row >= rows || used.has(k(at))) return false;
        used.add(k(at));
      }
      return true;
    };
    for (let t = 0; t < turns && ok; t++) {
      const going = dir as Dir;
      const horizontal: boolean = going === "E" || going === "W";
      ok = walk(rng.int(1, horizontal ? 3 : 2));
      if (!ok) break;
      const next: Dir = horizontal ? (rng.chance(0.5) ? "N" : "S") : "E";
      const lean = (Object.keys(TURN) as ("/" | "\\")[]).find((l) => TURN[l][going] === next)!;
      mirrors.push({ id: `m${mirrors.length + 1}`, col: at.col, row: at.row, lean });
      dir = next;
    }
    if (!ok || !walk(rng.int(1, 2))) continue;
    const target = at;
    for (let d = 0, tries = 0; d < decoys && tries < 40; tries++) {
      const c = { col: rng.int(1, cols - 1), row: rng.int(0, rows - 1) };
      if (used.has(k(c))) continue;
      used.add(k(c));
      mirrors.push({ id: `m${mirrors.length + 1}`, col: c.col, row: c.row, lean: rng.chance(0.5) ? "/" : "\\" });
      d++;
    }
    const solved: LightPuzzle = { cols, rows, source, mirrors, blocks: [], prisms: [], target };
    if (!trace(solved).lit) continue;
    // Leave it unsolved: turn mirrors by the seed until the target is dark.
    let p = solved;
    for (let i = 0; i < 24 && trace(p).lit; i++) p = turnMirror(p, rng.pick(p.mirrors).id);
    for (const m of p.mirrors) if (rng.chance(0.35)) p = turnMirror(p, m.id);
    if (trace(p).lit) continue;
    return p;
  }
  throw new Error("generate: no puzzle found for this seed and these options");
}

/** The beam in words, for a player who cannot see it: which mirrors it meets, in order, and how it ends. */
export function describe(t: Trace): { mirrors: string[]; end: Trace["end"] } {
  return { mirrors: t.touched, end: t.end };
}
