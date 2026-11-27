// The twelfth quest as data: al-Razi and the loose leaves, a physician's notebook to be put back in order.
//
// History and invention, kept apart on purpose:
//   from the museum record  (person/al-razi-abu-bakr, after the Encyclopaedia of Islam, vol. 8 p. 516) his notebooks
//                           were edited in some twenty-five volumes as the Kitab al-Hawi fi al-tibb; the edition holds
//                           his notes from a wide range of sources, organised anatomically from head to toe, and his own
//                           clinical observations, often at variance with received opinion, typically close the
//                           sections; he headed the hospital of Rayy before the corresponding post in Baghdad; arriving
//                           patients first saw an outer circle of disciples, then an inner circle, and the hardest cases
//                           were left to al-Razi himself.
//   invented for play       the loose leaves and the desk, the four parts of the body (the game's own choice: head,
//                           chest, belly, foot), the two kinds of leaf made a strict rule (the record says "typically"),
//                           the signs drawn on the leaves, the child who helps at the hospital, al-Razi's one imagined
//                           line and every spoken line (review ledger, HR-HH-41 to HR-HH-43).
// The quest carries no medical content: a leaf is marked by a part of the body and by whether it is what the books say
// or what he saw himself, and by nothing else. No illness, sign of illness, remedy, dose or advice appears anywhere.
import type { ChainPuzzle, Part } from "../sim/chain";
import type { LeavesStyle } from "../sim/leaves";

export const LEAVES_QUEST = "w04q4-al-razi";
/** The Atlas subject the quest belongs to. */
export const LEAVES_SUBJECT = "al-razi";

/** The parts of the body, from the top down: the game's own choice of four. */
export const BODY = ["head", "chest", "belly", "foot"] as const;
/** The two kinds of leaf: what earlier books say, and what he saw himself. */
export const KINDS = ["books", "own"] as const;

/** The parts of the body each way of playing has, from the top down. */
const PARTS_OF: Record<LeavesStyle, readonly (typeof BODY)[number][]> = {
  story: ["head", "chest", "belly", "foot"],
  explorer: ["head", "chest", "foot"],
  challenge: ["head", "chest", "belly", "foot"],
};
/** Story has only leaves of what the books say; Explorer and Challenge have both kinds for every part. */
const KINDS_OF: Record<LeavesStyle, readonly (typeof KINDS)[number][]> = { story: ["books"], explorer: ["books", "own"], challenge: ["books", "own"] };

/**
 * The leaves of a way of playing as parts of a row. A leaf takes "the notebook up to here" and hands on "the notebook up
 * to and including this leaf". The states are `start`, then for each part `<part>-books` (its books leaf is in) and
 * `<part>-done` (the part is closed), and the goal `notebook` in place of the last part's `-done`. In Story the books
 * leaf of a part closes it, so it takes the part before it straight.
 */
export function leavesParts(style: LeavesStyle): Part[] {
  const parts = PARTS_OF[style];
  const kinds = KINDS_OF[style];
  const out: Part[] = [];
  let before = "start";
  parts.forEach((body, i) => {
    const last = i === parts.length - 1;
    const done = last ? "notebook" : `${body}-done`;
    if (kinds.length === 1) {
      out.push({ id: `books-${body}`, takes: before, gives: done });
    } else {
      out.push({ id: `books-${body}`, takes: before, gives: `${body}-books` });
      out.push({ id: `own-${body}`, takes: `${body}-books`, gives: done });
    }
    before = done;
  });
  return out;
}
/** Every leaf id there is, in every way of playing. */
export const LEAVES_IDS = BODY.flatMap((b) => KINDS.map((k) => `${k}-${b}`));
/** Every state a binding can have reached when it stops (the goal is never one). */
export const LEAVES_STATES = ["start", "head-books", "head-done", "chest-books", "chest-done", "belly-books", "belly-done", "foot-books"] as const;

/**
 * How each way of playing finds the row. No leaf is a decoy and every place is filled from the start.
 *   Story      four leaves of what the books say, one for each part; two pairs exchanged; a failed binding says which
 *              part comes next.
 *   Explorer   six leaves (head, chest, foot, each with both kinds); four places wrong; a failed binding says what the
 *              row had reached when it stopped.
 *   Challenge  eight leaves (all four parts, both kinds); every place wrong; a failed binding says only where it stopped.
 */
const START: Record<LeavesStyle, string[]> = {
  story: ["books-chest", "books-head", "books-foot", "books-belly"],
  explorer: ["books-head", "own-chest", "own-head", "books-foot", "books-chest", "own-foot"],
  challenge: ["own-chest", "books-belly", "books-head", "own-foot", "books-foot", "own-head", "books-chest", "own-belly"],
};
export function leavesPuzzle(style: LeavesStyle): ChainPuzzle {
  return { start: "start", goal: "notebook", places: [...START[style]], parts: leavesParts(style) };
}
/** Moves allowed for the Ingenuity goal, over the fewest possible: Story has no count. */
export const LEAVES_SLACK: Record<LeavesStyle, number | null> = { story: null, explorer: 2, challenge: 1 };

/** The museum records the note at the end links to (each only because its file exists under data/). Existing source material; not reviewed for this game. */
export const LEAVES_RECORDS = ["person/al-razi-abu-bakr", "work/al-hawi-fi-al-tibb"] as const;
