// The thirteenth quest as data: Karima al-Marwaziyya and the copies of a page of the Atlas that do not agree.
//
// History and invention, kept apart on purpose:
//   from the museum record  (person/karima-al-marwaziyya, after Ibn al-Imad, Shadharat al-Dhahab, and Ibn al-Jawzi,
//                           al-Muntazam) she was a woman hadith transmitter who lived as a neighbour of the sanctuary at
//                           Mecca; she transmitted the Sahih on the authority of al-Kushmihani; Ibn al-Imad says she kept
//                           her book carefully and collated it against other copies; Ibn al-Jawzi writes that leading
//                           scholars read hadith with her, among them al-Khatib; she died at Mecca in 463 of the Hijra.
//   invented for play       the copies of the page as rows of drawn signs, the slips in them, the rule that what two copies
//                           agree on is right (the game's own, and not how the scholars of hadith collated their books),
//                           the three puzzles, the boy who carries the copies, Karima's one imagined line and every spoken
//                           line (review ledger, HR-HH-44 to HR-HH-46).
// No religious text of any kind is shown: no hadith and nothing of the Qur'an, in words or in the picture. The copies
// carry plain drawn signs (a ring, a drop, a triangle, a crescent, a star, a square, a wave, a leaf, a key, a lamp), none
// of them a letter, a word or anything like script.
import type { CollatePuzzle, CollateStyle } from "../sim/collate";

export const COLLATE_QUEST = "w05q3-karima-al-marwaziyya";
/** The Atlas subject the quest belongs to. */
export const COLLATE_SUBJECT = "karima-al-marwaziyya";

/** The signs the copies are written in. Each is drawn in art/collate.ts and named in words in every language (kr_sign_*). */
export const SIGNS = ["ring", "drop", "triangle", "crescent-right", "crescent-left", "star-five", "star-six", "square", "wave", "leaf", "key", "lamp"] as const;
export type Sign = (typeof SIGNS)[number];
/**
 * The pairs of signs that are near alike, so that a slip between them is easy to miss: a ring and a drop (a drop is a
 * ring drawn up to a point), a crescent open to the right and one open to the left (the same crescent turned the other
 * way), and a star of five points and one of six.
 */
export const NEAR_ALIKE: readonly (readonly [Sign, Sign])[] = [
  ["ring", "drop"],
  ["crescent-right", "crescent-left"],
  ["star-five", "star-six"],
];
export const nearAlike = (a: string, b: string): boolean => NEAR_ALIKE.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

/** A copy written out from the page as it should read, with a slip at each place given (counted from 0). */
const slipped = (page: readonly Sign[], slips: Record<number, Sign>): Sign[] => page.map((s, i) => slips[i] ?? s);

// The page as it should read, for each way of playing, and the slips in each copy. The puzzles are written out, not made
// by chance; the tests prove each has copies of one length, that at every place where they do not agree exactly one copy
// differs from the others (in Story, always the other copy), and the number of slips stated here.
//
//   Story      two copies of twelve signs: her copy (copy 1) and one other. Four slips, all in the other copy (places
//              3, 6, 9 and 11), none of them near alike.
//   Explorer   three copies of sixteen signs. Six slips, two in each copy, her copy too: copy 1 at places 5 and 15,
//              copy 2 at places 2 and 10, copy 3 at places 8 and 13. One of them (copy 2, place 10) is a ring for a drop.
//   Challenge  three copies of twenty signs. Eight slips: copy 1 at places 4 and 14, copy 2 at places 6, 12 and 17,
//              copy 3 at places 2, 9 and 20. Six of them are near alike: a drop for a ring (copy 3, place 2), the
//              crescent turned the other way (copy 1, place 4; copy 2, place 12), a star of six points for one of five
//              (copy 2, place 6) and of five for one of six (copy 1, place 14), and a ring for a drop (copy 3, place 20).
const STORY_PAGE: Sign[] = ["ring", "triangle", "leaf", "square", "wave", "key", "crescent-right", "lamp", "drop", "star-five", "square", "wave"];
const EXPLORER_PAGE: Sign[] = ["star-six", "wave", "ring", "leaf", "lamp", "triangle", "key", "square", "crescent-left", "drop", "wave", "star-five", "leaf", "ring", "square", "key"];
const CHALLENGE_PAGE: Sign[] = ["lamp", "ring", "square", "crescent-right", "wave", "star-five", "leaf", "key", "triangle", "drop", "ring", "crescent-left", "square", "star-six", "wave", "lamp", "leaf", "triangle", "key", "drop"];

const PUZZLES: Record<CollateStyle, CollatePuzzle> = {
  story: {
    hers: 0,
    copies: [STORY_PAGE, slipped(STORY_PAGE, { 2: "key", 5: "ring", 8: "triangle", 10: "lamp" })],
  },
  explorer: {
    hers: 0,
    copies: [slipped(EXPLORER_PAGE, { 4: "key", 14: "star-six" }), slipped(EXPLORER_PAGE, { 1: "leaf", 9: "ring" }), slipped(EXPLORER_PAGE, { 7: "triangle", 12: "wave" })],
  },
  challenge: {
    hers: 0,
    copies: [
      slipped(CHALLENGE_PAGE, { 3: "crescent-left", 13: "star-five" }),
      slipped(CHALLENGE_PAGE, { 5: "star-six", 11: "crescent-right", 16: "wave" }),
      slipped(CHALLENGE_PAGE, { 1: "drop", 8: "square", 19: "ring" }),
    ],
  },
};
export const collatePuzzle = (style: CollateStyle): CollatePuzzle => PUZZLES[style];
/** The page as it should read in each way of playing, for the tests to compare with what the copies agree on. */
export const collatePage = (style: CollateStyle): readonly Sign[] => (style === "story" ? STORY_PAGE : style === "explorer" ? EXPLORER_PAGE : CHALLENGE_PAGE);

/** Wrong marks allowed for the Ingenuity goal: Story has no count. */
export const COLLATE_SLACK: Record<CollateStyle, number | null> = { story: null, explorer: 2, challenge: 1 };
/** Whether the page says how many slips are still to find: not in Challenge. */
export const showsRemaining = (style: CollateStyle): boolean => style !== "challenge";

/** The museum record the note at the end links to; it is shown only if its file exists. Existing source material; not reviewed for this game. */
export const COLLATE_RECORDS = ["person/karima-al-marwaziyya"] as const;
