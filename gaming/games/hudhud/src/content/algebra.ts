// The fourth quest as data: al-Khwarizmi and the locked box that holds a page of the Atlas.
//
// History and invention, kept apart on purpose:
//   from museum records  al-Khwarizmi wrote everything in words, not symbols: the unknown is a "thing" or a "root",
//                        and the constant a "number" or "dirhams". His book is named after two operations: al-jabr,
//                        "restoring", which removes a subtracted quantity from one side by adding its like to both
//                        sides, and al-muqabala, "balancing", which cancels like terms that appear on both sides.
//                        He brings every problem to one of six types, each with a rule and a proof by a figure; he
//                        restricts solutions to positive numbers; the book was written for inheritances, trade and
//                        the measuring of land. Solving equations is older than he is (the record names Babylon, the
//                        Greeks and India, and others), and Ibn Khaldun names him the first to write on it as an art
//                        of its own (invention/algebra, work/al-jabr-wal-muqabala, person/al-khwarizmi, after the
//                        Cairo 1939 edition and TDV).
//   invented for play    the locked box and the page in it, the two trays, the three problems, the move of sharing
//                        among the things (the game's own plain step, not one of his), the child who carries the box
//                        and every spoken line, and the three ways of playing (review ledger, HR-HH-17 to HR-HH-19).
//                        Nothing read for the game says he used trays or a pair of scales.
import type { AlgebraStyle, Equation, Side } from "../sim/algebra";
import { equation } from "../sim/algebra";

export const ALGEBRA_QUEST = "w02q2-al-khwarizmi";

// The problems are written out, not made by chance. Each is of the simplest type, things equal to a number, once it
// has been brought home.
//
//   Story      two things and three equal a thing and eight. Answer 5. Two balances, no restoring.
//   Explorer   three things less four equal a thing and six. Answer 5. One restore, one balance, one share.
//   Challenge  four things less seven equal thirteen less a thing. Answer 4. Two restores, then a share of twenty
//              among five.
const STARTS: Record<AlgebraStyle, { left: Partial<Side>; right: Partial<Side> }> = {
  story: { left: { things: 2, number: 3 }, right: { things: 1, number: 8 } },
  explorer: { left: { things: 3, lessNumber: 4 }, right: { things: 1, number: 6 } },
  challenge: { left: { things: 4, lessNumber: 7 }, right: { number: 13, lessThings: 1 } },
};
export function algebraStart(style: AlgebraStyle): Equation {
  return equation(STARTS[style].left, STARTS[style].right);
}
/** Slips allowed, and moves beyond the fewest allowed, for the Ingenuity goal: Story has no count. */
export const ALGEBRA_SLACK: Record<AlgebraStyle, number | null> = { story: null, explorer: 2, challenge: 0 };

/** The museum records the note at the end links to. Existing source material; not reviewed for this game. */
export const ALGEBRA_RECORDS = ["person/al-khwarizmi", "work/al-jabr-wal-muqabala", "invention/algebra"] as const;

// ------------------------------------------------------------------------------------------- the problem in words
// The page says the problem as a sentence at every step ("3 things less 4 equal 1 thing and 6"), built from string
// parts, with the right form of "thing" for the amount. Arabic needs one, two, a few (3 to 10) and many (11 and
// more), and the nominative where the thing is the subject (the first side) and the accusative everywhere else; the
// other languages write the forms they need under the same keys. The numbers are written with the page's numerals.
type Say = (key: string, vars?: Record<string, string | number>) => string;
/** The key of the words for `n` things (n is 1 or more). `object` is the form for a thing that is not the subject. */
export function thingKey(n: number, object: boolean): string {
  if (n === 1) return object ? "ak_thing_one_obj" : "ak_thing_one";
  if (n === 2) return object ? "ak_thing_two_obj" : "ak_thing_two";
  return n <= 10 ? "ak_thing_few" : "ak_thing_many";
}
const thingPhrase = (n: number, object: boolean, say: Say, num: (n: number) => string): string => say(thingKey(n, object), { n: num(n) });
/** An amount of a kind, in words: "3 things" or "4". Used for the sentence and for the buttons. */
export function amountWords(kind: "things" | "number", n: number, object: boolean, say: Say, num: (n: number) => string): string {
  return kind === "things" ? thingPhrase(n, object, say, num) : num(n);
}
/** One side in words. `subject` is true for the first side, where a thing takes the nominative. */
export function sideWords(s: Side, subject: boolean, say: Say, num: (n: number) => string): string {
  const plus: string[] = [];
  if (s.things > 0) plus.push(thingPhrase(s.things, !subject, say, num));
  if (s.number > 0) plus.push(num(s.number));
  const minus: string[] = [];
  if (s.lessThings > 0) minus.push(thingPhrase(s.lessThings, true, say, num));
  if (s.lessNumber > 0) minus.push(num(s.lessNumber));
  if (plus.length === 0 && minus.length === 0) return say("ak_eq_zero");
  let out = plus.length > 0 ? plus.reduce((a, b) => say("ak_t_and", { a, b })) : say("ak_eq_zero");
  for (const m of minus) out = say("ak_t_less", { a: out, b: m });
  return out;
}
/** The whole problem as one sentence. */
export function equationWords(eq: Equation, say: Say, num: (n: number) => string): string {
  return say("ak_eq_sentence", { left: sideWords(eq.left, true, say, num), right: sideWords(eq.right, false, say, num) });
}
