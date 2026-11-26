// A quest made of a row (./chain): the parts of a machine, or the steps of a craft, to be put in order. What every such
// quest needs around the rules of the row is here and nowhere else: the count of moves, the fewest possible, what the
// player found out on the way, the four goals, and a place kept in the middle that is proved and not trusted. A quest
// gives it its own list of flags and its own two questions; the elephant clock (./clock) and the paper of Samarkand
// (./paper) are both made with it. Pure rules over plain data: nothing here draws, and nothing here knows a part or a
// step by name (what a quest says about them is in its content file).
import { run as runChain, stand, swap, type ChainPuzzle, type Run } from "./chain";

export type ChainStyle = "story" | "explorer" | "challenge";

export interface ChainState<F extends string = string> {
  style: ChainStyle;
  puzzle: ChainPuzzle;
  /** Parts put into places so far. */
  moves: number;
  /** The fewest moves that make the row work from this style's start. */
  par: number;
  flags: F[];
  /** What happened the last time the row was set going; null after any change. */
  last: Run | null;
  /** How many times it was set going. */
  runs: number;
  done: boolean;
}
export type ChainCommand<F extends string = string> = { type: "put"; place: number; part: string } | { type: "go" } | { type: "flag"; flag: F };

/** What is kept of a quest in progress: enough to put the row back, and nothing that cannot be checked. */
export interface ChainSnapshot<F extends string = string> {
  style: ChainStyle;
  places: (string | null)[];
  moves: number;
  flags: F[];
}

/** The four goals, in the shape every quest's record has. `slack` is the moves allowed over the fewest; null is no count. */
export interface ChainGoals {
  turns: number;
  par: number;
  curiosity: boolean;
  ingenuity: boolean;
  kindness: boolean;
  feather: boolean;
}

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

/**
 * The rules of a quest made of a row, for its own flags. `name` is for error messages only. `flagList` is every flag the
 * quest knows (a flag outside it is refused, and one outside it in a saved place is dropped); the flags `kind`,
 * `feather` and `answered` are the same in every quest (the first two are goals, the third is only that the helper was
 * answered at all, kindly or not, so that the question is not asked again after a resume); `curious` are the two flags
 * that together are the Curiosity goal.
 */
export function chainRules<F extends string>(name: string, flagList: readonly F[], curious: readonly [F, F]) {
  const known = (f: unknown): f is F => flagList.includes(f as F);
  const has = (s: ChainState<F>, f: string) => (s.flags as string[]).includes(f);

  function newState(style: ChainStyle, puzzle: ChainPuzzle): ChainState<F> {
    const par = fewest(puzzle);
    if (par === null || par === 0) throw new Error(`${name}: the ${style} row ${par === 0 ? "already works" : "cannot be made to work"}`);
    return { style, puzzle, moves: 0, par, flags: [], last: null, runs: 0, done: false };
  }

  function apply(s: ChainState<F>, c: ChainCommand<F>): ChainState<F> {
    if (s.done) return s;
    if (c.type === "flag") return !known(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
    if (c.type === "put") {
      const puzzle = put(s.puzzle, c.place, c.part);
      return puzzle === s.puzzle ? s : { ...s, puzzle, moves: s.moves + 1, last: null };
    }
    const last = runChain(s.puzzle);
    return { ...s, last, runs: s.runs + 1, done: last.end === "done" };
  }

  function goals(s: ChainState<F>, slack: number | null): ChainGoals {
    return { turns: s.moves, par: s.par, curiosity: curious.every((f) => has(s, f)), ingenuity: slack === null || s.moves <= s.par + slack, kindness: has(s, "kind"), feather: has(s, "feather") };
  }

  function snapshot(s: ChainState<F>): ChainSnapshot<F> {
    return { style: s.style, places: [...s.puzzle.places], moves: s.moves, flags: [...s.flags] };
  }

  /**
   * A quest put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the
   * puzzle is built afresh for the style (`puzzleOf`) and only the places, the count and known flags are laid over it.
   * The fewest moves is worked out again from the style's own start, never read from the file. What the last run
   * showed is not kept. A row that already works comes back not yet set going, and only if the count of moves makes it
   * possible.
   */
  function restore(x: unknown, puzzleOf: (style: ChainStyle) => ChainPuzzle): ChainState<F> | null {
    if (typeof x !== "object" || x === null) return null;
    const o = x as Record<string, unknown>;
    if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
    const base = newState(o.style, puzzleOf(o.style));
    const ids = new Set(base.puzzle.parts.map((p) => p.id));
    if (!Array.isArray(o.places) || o.places.length !== base.puzzle.places.length) return null;
    const places: (string | null)[] = [];
    for (const id of o.places as unknown[]) {
      if (id === null) places.push(null);
      else if (typeof id === "string" && ids.has(id) && !places.includes(id)) places.push(id);
      else return null;
    }
    if (typeof o.moves !== "number" || !Number.isInteger(o.moves) || o.moves < 0 || o.moves > 100000) return null;
    if (!Array.isArray(o.flags)) return null;
    const flags = flagList.filter((f) => (o.flags as unknown[]).includes(f));
    const puzzle = { ...base.puzzle, places };
    // A row that works can be a place to come back to: the last part was stood and the row not yet set going. But it
    // cannot have been reached in fewer moves than the fewest there are.
    if (runChain(puzzle).end === "done" && o.moves < base.par) return null;
    return { ...base, puzzle, moves: o.moves, flags: [...flags] };
  }

  return { newState, apply, goals, snapshot, restore };
}
