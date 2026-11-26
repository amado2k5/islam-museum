// The elephant clock as a quest: a row of places, the parts that belong in them, and the motion that must pass from
// one to the next. The rules of the row are in ./chain; this adds what a quest needs around them: a count of moves,
// the fewest possible, what the player found out on the way, and the end. Pure rules over plain data.
import { run as runChain, stand, swap, type ChainPuzzle, type Run } from "./chain";

export type ClockStyle = "story" | "explorer" | "challenge";
// `kind` is a goal: the apprentice was answered kindly. `answered` is only that he was answered at all, kindly or not,
// so that the question is not asked again after a resume. A snapshot kept before `answered` existed has none, and is
// still good: an apprentice answered kindly is `kind` alone, and the answer a blunt one got is asked again.
export const CLOCK_FLAGS = ["askedFloat", "askedBalls", "kind", "feather", "answered"] as const;
export type ClockFlag = (typeof CLOCK_FLAGS)[number];

export interface ClockState {
  style: ClockStyle;
  puzzle: ChainPuzzle;
  /** Parts put into places so far. */
  moves: number;
  /** The fewest moves that make the clock work from this style's start. */
  par: number;
  flags: ClockFlag[];
  /** What happened the last time the clock was set going; null after any change. */
  last: Run | null;
  /** How many times it was set going. */
  runs: number;
  done: boolean;
}
export type ClockCommand = { type: "put"; place: number; part: string } | { type: "go" } | { type: "flag"; flag: ClockFlag };

/** A part is put into a place. If it stood in another place the two change places; whatever stood here becomes spare. */
export function put(p: ChainPuzzle, place: number, part: string): ChainPuzzle {
  const from = p.places.indexOf(part);
  return from >= 0 ? swap(p, place, from) : stand(p, place, part);
}

/** The fewest moves to an arrangement that works, or null if there is none: a search over every arrangement. */
export function fewest(p: ChainPuzzle): number | null {
  const key = (q: ChainPuzzle) => q.places.join("|");
  const seen = new Set([key(p)]);
  let edge = [p];
  for (let depth = 0; edge.length > 0 && depth <= 12; depth++) {
    const next: ChainPuzzle[] = [];
    for (const q of edge) {
      if (runChain(q).end === "done") return depth;
      for (let place = 0; place < q.places.length; place++) {
        for (const part of q.parts) {
          const r = put(q, place, part.id);
          const k = key(r);
          if (r === q || seen.has(k)) continue;
          seen.add(k);
          next.push(r);
        }
      }
    }
    edge = next;
  }
  return null;
}

export function newClock(style: ClockStyle, puzzle: ChainPuzzle): ClockState {
  const par = fewest(puzzle);
  if (par === null || par === 0) throw new Error(`newClock: the ${style} clock ${par === 0 ? "already works" : "cannot be made to work"}`);
  return { style, puzzle, moves: 0, par, flags: [], last: null, runs: 0, done: false };
}

export function applyClock(s: ClockState, c: ClockCommand): ClockState {
  if (s.done) return s;
  if (c.type === "flag") return !CLOCK_FLAGS.includes(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
  if (c.type === "put") {
    const puzzle = put(s.puzzle, c.place, c.part);
    return puzzle === s.puzzle ? s : { ...s, puzzle, moves: s.moves + 1, last: null };
  }
  const last = runChain(s.puzzle);
  return { ...s, last, runs: s.runs + 1, done: last.end === "done" };
}

/** The four goals, in the shape every quest's record has. `slack` is the moves allowed over the fewest; null is no count. */
export function clockGoals(s: ClockState, slack: number | null): { turns: number; par: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean } {
  const has = (f: ClockFlag) => s.flags.includes(f);
  return { turns: s.moves, par: s.par, curiosity: has("askedFloat") && has("askedBalls"), ingenuity: slack === null || s.moves <= s.par + slack, kindness: has("kind"), feather: has("feather") };
}

/** What is kept of a clock in progress: enough to put the bench back, and nothing that cannot be checked. */
export interface ClockSnapshot {
  style: ClockStyle;
  places: (string | null)[];
  moves: number;
  flags: ClockFlag[];
}
export function snapshotClock(s: ClockState): ClockSnapshot {
  return { style: s.style, places: [...s.puzzle.places], moves: s.moves, flags: [...s.flags] };
}
/**
 * A clock put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the
 * puzzle is built afresh for the style (`puzzleOf`) and only the places, the count and known flags are laid over it.
 * The fewest moves is worked out again from the style's own start, never read from the file. What the last run
 * showed is not kept. A row that already works comes back not yet set going, and only if the count of moves makes it
 * possible.
 */
export function restoreClock(x: unknown, puzzleOf: (style: ClockStyle) => ChainPuzzle): ClockState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newClock(o.style, puzzleOf(o.style));
  const known = new Set(base.puzzle.parts.map((p) => p.id));
  if (!Array.isArray(o.places) || o.places.length !== base.puzzle.places.length) return null;
  const places: (string | null)[] = [];
  for (const id of o.places as unknown[]) {
    if (id === null) places.push(null);
    else if (typeof id === "string" && known.has(id) && !places.includes(id)) places.push(id);
    else return null;
  }
  if (typeof o.moves !== "number" || !Number.isInteger(o.moves) || o.moves < 0 || o.moves > 100000) return null;
  if (!Array.isArray(o.flags)) return null;
  const flags = CLOCK_FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  const puzzle = { ...base.puzzle, places };
  // A row that works can be a place to come back to: the last part was stood and the clock not yet set going. But it
  // cannot have been reached in fewer moves than the fewest there are.
  if (runChain(puzzle).end === "done" && o.moves < base.par) return null;
  return { ...base, puzzle, moves: o.moves, flags: [...flags] };
}
