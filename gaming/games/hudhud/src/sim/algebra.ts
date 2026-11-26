// The locked box's rules: a page of the Atlas is in a box that opens only for the right number. A problem is two
// sides, each made of things and of plain number, and of amounts taken away. The player brings it to "one thing
// equals a number" with three moves: restore, balance and share. Pure rules over plain data: nothing here draws and
// nothing here is left to chance. The al-Khwarizmi quest (content/algebra, ui/algebra) is built on it.
//
// What it is for first: the museum's records say that al-Khwarizmi wrote everything in words, that his book is named
// after two operations (al-jabr, which removes a subtracted quantity from one side by adding its like to both, and
// al-muqabala, which cancels like terms that appear on both sides), and that every problem is brought to one of six
// types. The box, the two trays, the three problems, the move of sharing among the things and the child are the
// game's own (review ledger, HR-HH-17 to HR-HH-19). Nothing here says he used trays or a pair of scales.
export type AlgebraStyle = "story" | "explorer" | "challenge";
// `kind` is a goal: the child was answered kindly. `answered` is only that he or she was answered at all, so that the
// question is not asked again after a resume (the same arrangement as the secret page's messenger).
export const ALGEBRA_FLAGS = ["askedWords", "askedOps", "kind", "feather", "answered"] as const;
export type AlgebraFlag = (typeof ALGEBRA_FLAGS)[number];

/** One side: what is there, and what is taken away. Whole numbers, never below nothing. "3 things less 4" is `{ things: 3, lessNumber: 4 }`. */
export interface Side {
  things: number;
  number: number;
  lessThings: number;
  lessNumber: number;
}
export interface Equation {
  left: Side;
  right: Side;
}
export type Kind = "things" | "number";
export type Place = "left" | "right";
export type Move = { type: "restore"; side: Place; kind: Kind } | { type: "balance"; kind: Kind } | { type: "share" };
export type AlgebraCommand = Move | { type: "flag"; flag: AlgebraFlag };
/** Why a move changed nothing. */
export type Slip = "nothing-taken" | "not-on-both" | "cannot-share";
export interface Outcome {
  move: Move;
  applied: boolean;
  slip: Slip | null;
}
export interface AlgebraState {
  style: AlgebraStyle;
  /** The problem as it was given: kept so that the fewest moves, and a saved place, can be checked against it. */
  start: Equation;
  eq: Equation;
  /** Moves that changed the problem, and moves that changed nothing. */
  moves: number;
  slips: number;
  flags: AlgebraFlag[];
  /** What the last move did; null before the first. */
  last: Outcome | null;
  done: boolean;
}

export const side = (p: Partial<Side> = {}): Side => ({ things: 0, number: 0, lessThings: 0, lessNumber: 0, ...p });
export const equation = (left: Partial<Side>, right: Partial<Side>): Equation => ({ left: side(left), right: side(right) });
const less = (kind: Kind): "lessThings" | "lessNumber" => (kind === "things" ? "lessThings" : "lessNumber");
const same = (a: Side, b: Side): boolean => a.things === b.things && a.number === b.number && a.lessThings === b.lessThings && a.lessNumber === b.lessNumber;
export const sameEquation = (a: Equation, b: Equation): boolean => same(a.left, b.left) && same(a.right, b.right);
const sideKey = (s: Side) => `${s.things},${s.number},${s.lessThings},${s.lessNumber}`;
/** A string for an equation: equal equations have the same string. */
export const keyOf = (e: Equation): string => `${sideKey(e.left)}|${sideKey(e.right)}`;

/** Every move there is, in a fixed order, so that a search is the same on every machine. */
export const ALL_MOVES: readonly Move[] = [
  { type: "restore", side: "left", kind: "things" },
  { type: "restore", side: "left", kind: "number" },
  { type: "restore", side: "right", kind: "things" },
  { type: "restore", side: "right", kind: "number" },
  { type: "balance", kind: "things" },
  { type: "balance", kind: "number" },
  { type: "share" },
];
export const moveName = (m: Move): string => (m.type === "restore" ? `restore-${m.side}-${m.kind}` : m.type === "balance" ? `balance-${m.kind}` : "share");

/** Adds `k` of a kind to a side. What is taken away of that kind is cancelled first, so the sum stays what it was worth. */
function addTo(s: Side, kind: Kind, k: number): Side {
  const l = less(kind);
  const cancelled = Math.min(k, s[l]);
  return { ...s, [l]: s[l] - cancelled, [kind]: s[kind] + (k - cancelled) };
}

/**
 * Al-jabr, restoring: on one side, one kind has something taken away. That amount is added to both sides, so the
 * deduction is gone. Returns null (nothing changes) if nothing of that kind is taken away on that side.
 */
export function restore(eq: Equation, place: Place, kind: Kind): Equation | null {
  const k = eq[place][less(kind)];
  if (k === 0) return null;
  return { left: addTo(eq.left, kind, k), right: addTo(eq.right, kind, k) };
}
/**
 * Al-muqabala, balancing: a kind that stands on both sides has its smaller amount removed from both. Returns null if
 * the kind does not stand on both sides.
 */
export function balance(eq: Equation, kind: Kind): Equation | null {
  const a = eq.left[kind];
  const b = eq.right[kind];
  if (a === 0 || b === 0) return null;
  const m = Math.min(a, b);
  return { left: { ...eq.left, [kind]: a - m }, right: { ...eq.right, [kind]: b - m } };
}
const onlyThings = (s: Side) => s.things > 0 && s.number === 0 && s.lessThings === 0 && s.lessNumber === 0;
const onlyNumber = (s: Side) => s.number > 0 && s.things === 0 && s.lessThings === 0 && s.lessNumber === 0;
/**
 * Sharing (the game's own plain step, not a move of his): one side is only things and the other only a number that
 * divides evenly among them; the number is shared, and one thing is left alone. Returns null if it cannot be done.
 */
export function share(eq: Equation): Equation | null {
  for (const [t, n] of [[eq.left, eq.right], [eq.right, eq.left]] as const) {
    if (onlyThings(t) && onlyNumber(n) && t.things > 1 && n.number % t.things === 0) {
      const shared = side({ number: n.number / t.things });
      const one = side({ things: 1 });
      return t === eq.left ? { left: one, right: shared } : { left: shared, right: one };
    }
  }
  return null;
}

/** The equation after a move, or null if the move changes nothing. */
export function tryMove(eq: Equation, m: Move): Equation | null {
  return m.type === "restore" ? restore(eq, m.side, m.kind) : m.type === "balance" ? balance(eq, m.kind) : share(eq);
}
/** Why a move changed nothing. */
export const slipOf = (m: Move): Slip => (m.type === "restore" ? "nothing-taken" : m.type === "balance" ? "not-on-both" : "cannot-share");
/** The moves that would change the problem now. */
export const available = (eq: Equation): Move[] => ALL_MOVES.filter((m) => tryMove(eq, m) !== null);

/** One thing equals a number. */
export function solved(eq: Equation): boolean {
  const one = (s: Side) => s.things === 1 && s.number === 0 && s.lessThings === 0 && s.lessNumber === 0;
  return (one(eq.left) && onlyNumber(eq.right)) || (one(eq.right) && onlyNumber(eq.left));
}
/**
 * What one thing is worth, by honest arithmetic on the whole problem (a thing is the same on both sides, so the
 * things on the left minus the things on the right give the number that the numbers are worth): a whole number of
 * one or more, or null if there is none. It never looks at how the problem was reached, so it can check every move.
 */
export function valueOf(eq: Equation): number | null {
  const c = eq.left.things - eq.left.lessThings - (eq.right.things - eq.right.lessThings);
  const k = eq.right.number - eq.right.lessNumber - (eq.left.number - eq.left.lessNumber);
  if (c === 0 || k % c !== 0) return null;
  const x = k / c;
  return x >= 1 ? x : null;
}

/** Every problem reachable from `start` by valid moves, with the fewest moves to each. Breadth first, in a fixed order. */
const reachCache = new Map<string, Map<string, number>>();
export function reachable(start: Equation): Map<string, number> {
  const k0 = keyOf(start);
  const hit = reachCache.get(k0);
  if (hit) return hit;
  const dist = new Map<string, number>([[k0, 0]]);
  let frontier: Equation[] = [start];
  for (let d = 1; frontier.length > 0; d++) {
    const next: Equation[] = [];
    for (const e of frontier) {
      if (solved(e)) continue;
      for (const m of ALL_MOVES) {
        const n = tryMove(e, m);
        if (n && !dist.has(keyOf(n))) {
          dist.set(keyOf(n), d);
          next.push(n);
        }
      }
    }
    frontier = next;
  }
  reachCache.set(k0, dist);
  return dist;
}
/** The shortest way to one thing equals a number: the moves, or null if there is none. `allowed` leaves out kinds of move, to show which are needed. */
export function shortest(eq: Equation, allowed: readonly Move["type"][] = ["restore", "balance", "share"]): Move[] | null {
  const seen = new Set<string>([keyOf(eq)]);
  let frontier: { e: Equation; path: Move[] }[] = [{ e: eq, path: [] }];
  while (frontier.length > 0) {
    const next: typeof frontier = [];
    for (const { e, path } of frontier) {
      if (solved(e)) return path;
      for (const m of ALL_MOVES) {
        if (!allowed.includes(m.type)) continue;
        const n = tryMove(e, m);
        if (n && !seen.has(keyOf(n))) {
          seen.add(keyOf(n));
          next.push({ e: n, path: [...path, m] });
        }
      }
    }
    frontier = next;
  }
  return null;
}
export const fewest = (eq: Equation, allowed?: readonly Move["type"][]): number | null => shortest(eq, allowed)?.length ?? null;

export function newAlgebra(style: AlgebraStyle, start: Equation): AlgebraState {
  return { style, start, eq: start, moves: 0, slips: 0, flags: [], last: null, done: false };
}

/** A move: it changes the problem, or it changes nothing and is counted as a slip. */
export function play(s: AlgebraState, m: Move): AlgebraState {
  if (s.done) return s;
  const n = tryMove(s.eq, m);
  if (n === null) return { ...s, slips: s.slips + 1, last: { move: m, applied: false, slip: slipOf(m) } };
  return { ...s, eq: n, moves: s.moves + 1, last: { move: m, applied: true, slip: null }, done: solved(n) };
}
export function applyAlgebra(s: AlgebraState, c: AlgebraCommand): AlgebraState {
  if (s.done) return s;
  if (c.type === "flag") return !ALGEBRA_FLAGS.includes(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
  return play(s, c);
}

/** The four goals, in the shape every quest's record has. `slack` is the slips, and the moves beyond the fewest, allowed; null is no count. */
export function algebraGoals(s: AlgebraState, slack: number | null): { turns: number; slips: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean } {
  const has = (f: AlgebraFlag) => s.flags.includes(f);
  const best = fewest(s.start);
  return {
    turns: s.moves,
    slips: s.slips,
    curiosity: has("askedWords") && has("askedOps"),
    ingenuity: slack === null || (best !== null && s.slips <= slack && s.moves <= best + slack),
    kindness: has("kind"),
    feather: has("feather"),
  };
}

/** What is kept of a box in progress: enough to put the bench back, and nothing that cannot be checked. */
export interface AlgebraSnapshot {
  style: AlgebraStyle;
  eq: Equation;
  moves: number;
  slips: number;
  flags: AlgebraFlag[];
}
export function snapshotAlgebra(s: AlgebraState): AlgebraSnapshot {
  return { style: s.style, eq: { left: { ...s.eq.left }, right: { ...s.eq.right } }, moves: s.moves, slips: s.slips, flags: [...s.flags] };
}
const SIDE_FIELDS = ["things", "number", "lessThings", "lessNumber"] as const;
const AMOUNT_LIMIT = 1000;
function sideFrom(x: unknown): Side | null {
  if (typeof x !== "object" || x === null || Array.isArray(x)) return null;
  const o = x as Record<string, unknown>;
  const out: Record<string, number> = {};
  for (const f of SIDE_FIELDS) {
    const v = o[f];
    if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v > AMOUNT_LIMIT) return null;
    out[f] = v;
  }
  return out as unknown as Side;
}
/**
 * A box put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the
 * problem is built afresh for the style (`startOf`), and the saved problem is accepted only if it can be reached
 * from that start by valid moves (proved by search, not by its numbers looking right), is not already solved, and
 * the count of moves is not fewer than the fewest that reach it. What the last move did is not kept, and a box is
 * never restored as opened.
 */
export function restoreAlgebra(x: unknown, startOf: (style: AlgebraStyle) => Equation): AlgebraState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newAlgebra(o.style, startOf(o.style));
  if (typeof o.eq !== "object" || o.eq === null || Array.isArray(o.eq)) return null;
  const e = o.eq as Record<string, unknown>;
  const left = sideFrom(e.left);
  const right = sideFrom(e.right);
  if (!left || !right) return null;
  const eq: Equation = { left, right };
  const d = reachable(base.start).get(keyOf(eq));
  if (d === undefined || solved(eq)) return null;
  if (typeof o.moves !== "number" || !Number.isInteger(o.moves) || o.moves < d || o.moves > 100000) return null;
  if (typeof o.slips !== "number" || !Number.isInteger(o.slips) || o.slips < 0 || o.slips > 100000) return null;
  if (!Array.isArray(o.flags)) return null;
  const flags = ALGEBRA_FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  return { ...base, eq, moves: o.moves, slips: o.slips, flags: [...flags] };
}
