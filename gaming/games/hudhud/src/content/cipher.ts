// The third quest as data: al-Kindi and a page of the Atlas turned into secret marks.
//
// History and invention, kept apart on purpose:
//   from museum records  al-Kindi wrote the earliest treatise on breaking ciphers that survives; in it he counts the
//                        letters of a long sample of a known language, ranks them from most to fewest, and compares
//                        that ranking with the symbols of the secret message; he warns that a short message can
//                        mislead, and tests a guess by which letters stand next to each other and by the usual
//                        openings of messages (invention/frequency-analysis-al-kindi, after the Damascus 1987 edition
//                        and TDV). The record calls it the earliest surviving treatise, not the invention of all
//                        secret writing.
//   invented for play    the page of the Atlas and its marks, the picture signs (the museum's record speaks of the
//                        letters of Arabic; the game uses drawn signs so that the puzzle is the same in every
//                        language), the fixed opening of every page (the feather, then the sun), the young messenger
//                        and every spoken line, the three ways of playing and the rows themselves
//                        (review ledger, HR-HH-14 to HR-HH-16)
import type { CipherPuzzle, CipherStyle } from "../sim/cipher";

export const CIPHER_QUEST = "w02q3-al-kindi";

/** The signs of a page, and the marks that stand for them. Names are in the strings (cf_sign_*, cf_mark_*). */
export const SIGNS = ["sun", "moon", "star", "wave", "leaf", "key", "feather", "lamp"] as const;
export const MARKS = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"] as const;
/** Every page of the Atlas begins with these two signs: the usual opening a guess can be tested against. */
export const OPENING = ["feather", "sun"] as const;

// Rows are written out, not made by chance. Each sample is a long row from an undamaged page in which every sign has
// a different count; each message is a shorter row of marks made by giving each sign its mark. Every row begins with
// the opening.
//
//   Story      5 signs. The message has 30 marks, each a different count in the same order as the sample's:
//              ranking alone gives the whole answer.
//   Explorer   7 signs. The message has 24 marks with ONE tie: the sun and the feather each occur twice, and the
//              sample puts the sun above the feather. The tie is broken in the order of the marks' ids, which here
//              gives the wrong answer for that pair; the opening settles it.
//   Challenge  8 signs. The message has 15 marks and uses 6 of the 8 marks (the key and the lamp are not in it).
//              TWO ties (the star and the wave, the sun and the leaf), and the short message misleads: the sample
//              puts the moon above the feather, but here the feather occurs 5 times and the moon 4, so ranking alone
//              gives the feather's mark the moon and the moon's mark the feather (wrong for both, and neither is
//              in a tie). The opening shows that the first mark is the feather. The star and the wave have to be tried.
const ROWS: Record<CipherStyle, { signs: string[]; marks: string[]; sample: string; message: string; key: Record<string, string> }> = {
  story: {
    signs: ["sun", "moon", "star", "wave", "feather"],
    marks: ["m1", "m2", "m3", "m4", "m5"],
    sample: "feather sun wave sun moon sun feather sun sun sun feather feather sun star moon star moon wave moon star sun sun wave feather feather feather wave feather star sun moon moon feather moon moon feather sun sun star sun star moon feather sun feather sun sun",
    message: "feather sun sun feather wave sun moon sun moon feather moon sun moon feather sun moon star sun sun feather feather sun star wave feather feather sun moon star sun",
    key: { m1: "sun", m2: "star", m3: "feather", m4: "moon", m5: "wave" },
  },
  explorer: {
    signs: ["sun", "moon", "star", "wave", "leaf", "key", "feather"],
    marks: ["m1", "m2", "m3", "m4", "m5", "m6", "m7"],
    sample: "feather sun wave star star leaf leaf wave feather wave star moon star moon moon wave wave star star moon leaf leaf star star moon moon star moon leaf wave feather sun sun moon leaf moon sun key moon star moon moon moon star sun leaf key leaf moon",
    message: "feather sun wave sun key moon star moon leaf feather wave moon moon moon star moon star moon star leaf wave leaf leaf star",
    key: { m1: "leaf", m2: "feather", m3: "star", m4: "key", m5: "sun", m6: "moon", m7: "wave" },
  },
  challenge: {
    signs: ["sun", "moon", "star", "wave", "leaf", "key", "feather", "lamp"],
    marks: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"],
    sample: "feather sun feather wave moon feather key wave feather moon feather leaf star star wave moon sun feather feather wave moon moon moon leaf feather moon star moon moon wave sun feather wave key star key feather wave feather star star sun star moon lamp moon moon lamp star sun leaf leaf",
    message: "feather sun star moon feather star moon feather moon feather wave leaf wave moon feather",
    key: { m1: "lamp", m2: "star", m3: "leaf", m4: "moon", m5: "sun", m6: "feather", m7: "wave", m8: "key" },
  },
};
export function cipherPuzzle(style: CipherStyle): CipherPuzzle {
  const r = ROWS[style];
  const marks = (words: string) => words.split(" ");
  // The message is written in signs above; each is turned into its mark by the style's key.
  const markOf = Object.fromEntries(Object.entries(r.key).map(([m, s]) => [s, m]));
  return { signs: [...r.signs], marks: [...r.marks], sample: marks(r.sample), message: marks(r.message).map((s) => markOf[s]!), key: { ...r.key } };
}
/** Failed readings allowed for the Ingenuity goal: Story has no count. */
export const CIPHER_SLACK: Record<CipherStyle, number | null> = { story: null, explorer: 2, challenge: 1 };

/** The museum records the note at the end links to. Existing source material; not reviewed for this game. */
export const CIPHER_RECORDS = ["person/al-kindi", "invention/frequency-analysis-al-kindi"] as const;
