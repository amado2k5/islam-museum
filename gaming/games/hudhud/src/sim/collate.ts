// The copies' rules: a page of the Atlas was copied, and the copies do not agree everywhere. The player compares the
// copies place by place and marks where a copy slipped. Pure rules over plain data: nothing here draws and nothing here
// is left to chance. The Karima quest (content/collate, ui/collate) is built on it.
//
// What it is for first: the museum's record says that Karima al-Marwaziyya kept her book carefully and collated it
// against other copies. Nothing else about how she or anyone collated a book is claimed. The rule below, that what two
// copies agree on is right, is the game's own and not the method of the scholars of hadith; the copies are rows of
// drawn signs and hold no text of any kind (review ledger, HR-HH-44 to HR-HH-46).
export type CollateStyle = "story" | "explorer" | "challenge";
// `kind` is a goal: the boy was answered kindly. `answered` is only that he was answered at all, so that the question
// is not asked again after a resume (the same arrangement as the other quests' helpers).
export const COLLATE_FLAGS = ["askedWho", "askedBook", "kind", "feather", "answered"] as const;
export type CollateFlag = (typeof COLLATE_FLAGS)[number];

/**
 * A puzzle: the copies, each a row of sign ids of the same length, and which copy is hers. With three copies or more,
 * the copy that differs from all the others at a place is the one that slipped there. With two copies there is no
 * majority, so the copy that is not hers slipped (the page says her copy is the careful one).
 */
export interface CollatePuzzle {
  copies: readonly (readonly string[])[];
  /** Her copy (0 is the first). */
  hers: number;
}
/** A place of a copy: `copy` and `place` count from 0. */
export interface Spot {
  copy: number;
  place: number;
}

/** The length of the copies, or -1 if they are not all the same length (or there are none). */
export function lengthOf(p: CollatePuzzle): number {
  const n = p.copies[0]?.length ?? -1;
  return n > 0 && p.copies.every((c) => c.length === n) ? n : -1;
}
/** The places where the copies do not all agree. */
export function differences(p: CollatePuzzle): number[] {
  const n = lengthOf(p);
  const out: number[] = [];
  for (let place = 0; place < n; place++) if (p.copies.some((c) => c[place] !== p.copies[0]![place])) out.push(place);
  return out;
}
/**
 * The copy that slipped at a place, or null: null where every copy agrees, and null where no single copy differs from
 * all the others (with three copies, where all three differ). The authored puzzles never have such a place; the tests
 * prove it.
 */
export function slipAt(p: CollatePuzzle, place: number): number | null {
  const n = lengthOf(p);
  if (!Number.isInteger(place) || place < 0 || place >= n) return null;
  const signs = p.copies.map((c) => c[place]!);
  if (signs.every((s) => s === signs[0])) return null;
  if (signs.length === 2) return p.hers === 0 ? 1 : p.hers === 1 ? 0 : null;
  for (let c = 0; c < signs.length; c++) {
    const others = signs.filter((_, i) => i !== c);
    if (others.every((s) => s === others[0]) && signs[c] !== others[0]) return c;
  }
  return null;
}
/** Every slip of a puzzle: the copy that slipped at each place where the copies do not all agree, in place order. */
export function slipsOf(p: CollatePuzzle): Spot[] {
  const out: Spot[] = [];
  for (const place of differences(p)) {
    const copy = slipAt(p, place);
    if (copy !== null) out.push({ copy, place });
  }
  return out;
}
export const isSlip = (p: CollatePuzzle, copy: number, place: number): boolean => slipAt(p, place) === copy;
const inRange = (p: CollatePuzzle, copy: number, place: number): boolean => Number.isInteger(copy) && Number.isInteger(place) && copy >= 0 && copy < p.copies.length && place >= 0 && place < lengthOf(p);

/** Why a mark was refused: every copy agrees there; this copy agrees with another; or (with two copies) it is her careful copy. */
export type Refusal = "same" | "agrees" | "hers";
/** What the last command did; null before the first. */
export type CollateLast = { type: "mark"; copy: number; place: number } | { type: "unmark"; copy: number; place: number } | { type: "refused"; copy: number; place: number; why: Refusal };
export interface CollateState {
  style: CollateStyle;
  puzzle: CollatePuzzle;
  /** The slips marked so far, in place order. Only a slip can be marked. */
  marks: readonly Spot[];
  /** Marks refused because the place was not a slip of that copy. */
  wrong: number;
  flags: CollateFlag[];
  last: CollateLast | null;
  done: boolean;
}
export type CollateCommand = { type: "mark"; copy: number; place: number } | { type: "unmark"; copy: number; place: number } | { type: "flag"; flag: CollateFlag };

export function newCollate(style: CollateStyle, puzzle: CollatePuzzle): CollateState {
  if (lengthOf(puzzle) < 0) throw new Error("the copies are not all the same length");
  return { style, puzzle, marks: [], wrong: 0, flags: [], last: null, done: false };
}
export const isMarked = (s: Pick<CollateState, "marks">, copy: number, place: number): boolean => s.marks.some((m) => m.copy === copy && m.place === place);
/** How many slips are still to find. */
export const remaining = (s: CollateState): number => slipsOf(s.puzzle).length - s.marks.length;
const byPlace = (a: Spot, b: Spot) => a.place - b.place || a.copy - b.copy;

/**
 * Marks a copy's sign at a place. If that copy slipped there, the mark stands, and the puzzle is done when every slip is
 * marked. If not, the mark is refused and counted as a slip of the player. A place or copy that does not exist, a mark
 * already made, or anything after the end changes nothing.
 */
export function mark(s: CollateState, copy: number, place: number): CollateState {
  if (s.done || !inRange(s.puzzle, copy, place) || isMarked(s, copy, place)) return s;
  if (!isSlip(s.puzzle, copy, place)) {
    const why: Refusal = !differences(s.puzzle).includes(place) ? "same" : s.puzzle.copies.length === 2 && copy === s.puzzle.hers ? "hers" : "agrees";
    return { ...s, wrong: s.wrong + 1, last: { type: "refused", copy, place, why } };
  }
  const marks = [...s.marks, { copy, place }].sort(byPlace);
  return { ...s, marks, last: { type: "mark", copy, place }, done: marks.length === slipsOf(s.puzzle).length };
}
/** Takes a mark away. Only a mark that stands can be taken away, and nothing changes after the end. */
export function unmark(s: CollateState, copy: number, place: number): CollateState {
  if (s.done || !isMarked(s, copy, place)) return s;
  return { ...s, marks: s.marks.filter((m) => !(m.copy === copy && m.place === place)), last: { type: "unmark", copy, place } };
}
export function applyCollate(s: CollateState, c: CollateCommand): CollateState {
  if (s.done) return s;
  if (c.type === "flag") return !COLLATE_FLAGS.includes(c.flag) || s.flags.includes(c.flag) ? s : { ...s, flags: [...s.flags, c.flag] };
  return c.type === "mark" ? mark(s, c.copy, c.place) : unmark(s, c.copy, c.place);
}

/** The four goals, in the shape every quest's record has. `slack` is the wrong marks allowed; null is no count (Story). */
export function collateGoals(s: CollateState, slack: number | null): { turns: number; slips: number; curiosity: boolean; ingenuity: boolean; kindness: boolean; feather: boolean } {
  const has = (f: CollateFlag) => s.flags.includes(f);
  return {
    turns: s.marks.length + s.wrong,
    slips: s.wrong,
    curiosity: has("askedWho") && has("askedBook"),
    ingenuity: slack === null || s.wrong <= slack,
    kindness: has("kind"),
    feather: has("feather"),
  };
}

/** What is kept of a puzzle in progress: the marks, the wrong marks and the flags, and nothing that cannot be checked. */
export interface CollateSnapshot {
  style: CollateStyle;
  marks: Spot[];
  wrong: number;
  flags: CollateFlag[];
}
export function snapshotCollate(s: CollateState): CollateSnapshot {
  return { style: s.style, marks: s.marks.map((m) => ({ ...m })), wrong: s.wrong, flags: [...s.flags] };
}
/**
 * A puzzle put back from what was saved, or null if what was saved cannot be trusted. Nothing is taken on faith: the
 * puzzle is built afresh for the style (`puzzleOf`), a mark is accepted only on a (copy, place) that exists and is a slip
 * of that copy, never twice, and the marks may not cover every slip (a puzzle is never restored as done); the count of
 * wrong marks is a whole number, not negative; unknown flags are dropped. What the last command did is not kept.
 */
export function restoreCollate(x: unknown, puzzleOf: (style: CollateStyle) => CollatePuzzle): CollateState | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  if (o.style !== "story" && o.style !== "explorer" && o.style !== "challenge") return null;
  const base = newCollate(o.style, puzzleOf(o.style));
  if (!Array.isArray(o.marks)) return null;
  const marks: Spot[] = [];
  for (const m of o.marks as unknown[]) {
    if (typeof m !== "object" || m === null) return null;
    const { copy, place } = m as Record<string, unknown>;
    if (typeof copy !== "number" || typeof place !== "number" || !inRange(base.puzzle, copy, place) || !isSlip(base.puzzle, copy, place) || isMarked({ marks }, copy, place)) return null;
    marks.push({ copy, place });
  }
  if (marks.length >= slipsOf(base.puzzle).length) return null;
  if (typeof o.wrong !== "number" || !Number.isInteger(o.wrong) || o.wrong < 0 || o.wrong > 100000) return null;
  if (!Array.isArray(o.flags)) return null;
  const flags = COLLATE_FLAGS.filter((f) => (o.flags as unknown[]).includes(f));
  return { ...base, marks: marks.sort(byPlace), wrong: o.wrong, flags: [...flags] };
}
