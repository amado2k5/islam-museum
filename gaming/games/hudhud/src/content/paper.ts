// The seventh quest as data: the paper of Samarkand, a papermaker's steps to be put in order.
//
// History and invention, kept apart on purpose:
//   from museum records  (invention/paper-mill-samarkand, after the Encyclopaedia of Islam and Carter 1925; place/samarqand)
//                        transmitted accounts say Chinese artisans captured after a battle near the Talas in 751 taught
//                        the people of Samarkand to make paper from linen and hemp rags, and Samarkand paper became
//                        famous; the record calls the prisoner story a transmitted account rather than a proved founding
//                        act, says the Chinese invented paper and that the Islamic world's part was to receive, adapt and
//                        spread the craft. The documented recipe: rotten linen, flax or hemp rags are cut small, cleaned,
//                        bleached and pounded (in mortars, stampers or paper-mills) to a pulp in water, dressed with
//                        wheat-starch size, lifted on a mould (a deckle) and shaken until the fibres interlace; the sheet
//                        is laid flat, dried on a wall, rubbed with flour and starch and polished smooth. From Samarkand
//                        the craft moved to Baghdad and on to Egypt, Damascus, the Maghrib and Jativa in Spain, among others.
//   invented for play    the workshop, the papermaker and the child who helps, every spoken line, the cards, a card for
//                        each step (and in Story a card for two steps that the record's own sentence joins), the single
//                        mallet for the record's mortars, stampers and mills, the names given to the states of the
//                        material, and the idea that a torn page of the Atlas is remade (review ledger, HR-HH-26 to HR-HH-28)
import type { ChainPuzzle, Part } from "../sim/chain";
import type { PaperStyle } from "../sim/paper";

export const PAPER_QUEST = "w10q5-samarqand";
/** The Atlas subject the quest belongs to. */
export const PAPER_SUBJECT = "samarqand";

/**
 * Every card there is and what it takes and hands on. The states of the material, in the order of the work: `rags`,
 * `pieces` (cut small), `clean`, `white` (bleached), `pulp`, `sized` (dressed with wheat starch), `wet-sheet` (lifted on
 * a mould), `dry-sheet`, and the goal `paper`. A joined card takes the first state of its two steps and hands on the last.
 */
export const PAPER_PARTS: Part[] = [
  { id: "cut", takes: "rags", gives: "pieces" },
  { id: "clean", takes: "pieces", gives: "clean" },
  { id: "bleach", takes: "clean", gives: "white" },
  { id: "pound", takes: "white", gives: "pulp" },
  { id: "size", takes: "pulp", gives: "sized" },
  { id: "lift", takes: "sized", gives: "wet-sheet" },
  { id: "dry", takes: "wet-sheet", gives: "dry-sheet" },
  { id: "polish", takes: "dry-sheet", gives: "paper" },
  // Joined cards, for Story and Explorer: two steps that the record joins in one sentence.
  { id: "clean-bleach", takes: "pieces", gives: "white" },
  { id: "size-lift", takes: "pulp", gives: "wet-sheet" },
  { id: "dry-polish", takes: "wet-sheet", gives: "paper" },
];
/** The states, in order, for the picture of the material and the words for what reached a place. */
export const PAPER_STATES = ["rags", "pieces", "clean", "white", "pulp", "sized", "wet-sheet", "dry-sheet", "paper"] as const;

/**
 * How each way of playing finds the row. No card is a decoy: every card is a real step of the record's recipe, and
 * every place is filled from the start.
 *   Story      five places (cut, clean and bleach, pound, size and lift, dry and polish), two pairs changed over; a
 *              failed run says what the place needs.
 *   Explorer   seven places (size and lift, and dry and polish, each become two cards), five of them wrong at the
 *              start; a failed run says what reached the place where it stopped.
 *   Challenge  all eight steps, every place wrong; a failed run says only where it stopped.
 */
const START: Record<PaperStyle, string[]> = {
  story: ["clean-bleach", "cut", "pound", "dry-polish", "size-lift"],
  explorer: ["clean-bleach", "pound", "cut", "size", "polish", "dry", "lift"],
  challenge: ["clean", "bleach", "cut", "size", "lift", "pound", "polish", "dry"],
};
export function paperPuzzle(style: PaperStyle): ChainPuzzle {
  const places = [...START[style]];
  return { start: "rags", goal: "paper", places, parts: PAPER_PARTS.filter((p) => places.includes(p.id)) };
}
/** Moves allowed for the Ingenuity goal, over the fewest possible: Story has no count. */
export const PAPER_SLACK: Record<PaperStyle, number | null> = { story: null, explorer: 2, challenge: 0 };

/** The museum records the note at the end links to. Existing source material; not reviewed for this game. */
export const PAPER_RECORDS = ["invention/paper-mill-samarkand", "place/samarqand"] as const;
