// The ninth quest as data: al-Tusi and the two circles, three ways of setting one small circle turning inside a large one.
//
// History and invention, kept apart on purpose:
//   from museum records  (person/nasir-al-din-al-tusi and building/maragha-observatory, after the Encyclopaedia of Islam,
//                        vol. 10 p. 802 and vol. 6 p. 628)
//                        the article calls his planetary theory his most original achievement: troubled by the departure of
//                        the Ptolemaic system from uniform circular motion, he devised a model of two spheres, the smaller
//                        rotating twice as fast as the larger and in the opposite direction, so that a point on it moves
//                        along a straight line. The observatory at Maragha was founded by the Mongol ruler Hulagu at his
//                        suggestion; he oversaw the building of the observatory and its instruments and became its first
//                        director; it had a large library and a school, lasted only about fifty years, and its legacy had
//                        repercussions from China to Europe for centuries.
//   invented for play    flat circles for the record's spheres; the half size (the record does not give the sizes of the
//                        spheres: the half is the size at which the arithmetic gives a straight line); the other speeds,
//                        directions and sizes offered as wrong settings, and the shapes they trace (the game's own
//                        arithmetic, nobody's historical model); the girl who cleans the instruments; al-Tusi's one imagined
//                        line; and the page of the Atlas. The record's mention of astrology is left out (it is not needed for
//                        the puzzle). Review ledger HR-HH-32 to HR-HH-34.
import { DIRS, type CoupleStyle, type Dir, type Offer } from "../sim/couple";

export const COUPLE_QUEST = "w01q3-al-tusi";
/** The Atlas subject the quest belongs to. */
export const COUPLE_SUBJECT = "al-tusi";

/**
 * What each way of playing lets the player choose. The answer is one setting in all of them: the half size, twice as
 * fast, the opposite way; no other setting offered anywhere traces a straight line (the tests measure every one).
 *   Story      the size is a half and the speed is twice; only the direction is chosen (two settings).
 *   Explorer   the size is a half; the speed (1, 2 or 3 times) and the direction are chosen (six settings).
 *   Challenge  the size (a third, a half or two thirds), the speed and the direction are chosen (eighteen settings).
 */
const OFFERS: Record<CoupleStyle, { sizes: number[]; speeds: number[]; dirs: Dir[] }> = {
  story: { sizes: [1 / 2], speeds: [2], dirs: [...DIRS] },
  explorer: { sizes: [1 / 2], speeds: [1, 2, 3], dirs: [...DIRS] },
  challenge: { sizes: [1 / 3, 1 / 2, 2 / 3], speeds: [1, 2, 3], dirs: [...DIRS] },
};
/** A fresh copy of the choices for a way of playing. */
export function coupleOffer(style: CoupleStyle): Offer {
  const o = OFFERS[style];
  return { sizes: [...o.sizes], speeds: [...o.speeds], dirs: [...o.dirs] };
}

/** The museum records the note at the end links to. Existing source material; not reviewed for this game. */
export const COUPLE_RECORDS = ["person/nasir-al-din-al-tusi", "building/maragha-observatory"] as const;
