// The sixth quest as data: al-Jahiz and the animal cards that hide a page of the Atlas.
//
// History and invention, kept apart on purpose:
//   from museum records  (work/kitab-al-hayawan, with the editor's pages of the 2003 Beirut edition, vol. 1 pp. 24 to
//                        27) before the kinds of animals, al-Jahiz divides the animals into those that walk, fly, swim
//                        or creep, and says that in this he follows the names established and known among the people
//                        of his language. He divides birds into predators, grazers and swarming insects; separates
//                        predators armed with talons, such as the eagle, from those armed with beaks, such as vultures
//                        and crows; and notes that not everything that flies on two wings is a bird: locusts, bees and
//                        flies fly but are not called birds, the bat is reckoned among birds though featherless, and
//                        the ostrich has feathers but is not a bird. The hoopoe is listed among the creatures of the
//                        third part of the book (the record's chapter list), and the editor says the book holds far
//                        more than its title suggests (person/al-jahiz, work/kitab-al-hayawan).
//   invented for play    the cards, the trays and putting cards in them, the three groupings below as the game words
//                        them (Explorer's two-way split is the game's summary of his statements), the girl who carries
//                        the cards, al-Jahiz's one imagined line and the sentence about science today, which is
//                        general knowledge and not from the record (review ledger, HR-HH-23 to HR-HH-25).
import type { SortDef, SortSlack, SortStyle } from "../sim/sort";

export const SORT_QUEST = "w09q1-al-jahiz";
/** The Atlas subject the quest belongs to. */
export const SORT_SUBJECT = "al-jahiz";

/** The eight creatures, every one named in the passage. */
export const CARDS = ["eagle", "vulture", "crow", "bat", "ostrich", "locust", "bee", "fly"] as const;
export type Card = (typeof CARDS)[number];

// The cards and groups of each way of playing, and the group each card belongs to. The strings of each group are
// `jz_g_<group>`; the phrases are the passage's own (see i18n), and the tests write the answer table again by hand.
//
//   Story      4 cards, 2 groups: called a bird / flies, but not called a bird.
//   Explorer   8 cards, 2 groups: counted among the birds / not counted (the bat and the ostrich are the surprises).
//   Challenge  8 cards, 5 groups, each a phrase of the passage.
const DEFS: Record<SortStyle, SortDef> = {
  story: {
    items: ["eagle", "crow", "bee", "locust"],
    groups: ["story_bird", "story_other"],
    answer: { eagle: "story_bird", crow: "story_bird", bee: "story_other", locust: "story_other" },
  },
  explorer: {
    items: [...CARDS],
    groups: ["exp_in", "exp_out"],
    answer: { eagle: "exp_in", vulture: "exp_in", crow: "exp_in", bat: "exp_in", ostrich: "exp_out", locust: "exp_out", bee: "exp_out", fly: "exp_out" },
  },
  challenge: {
    items: [...CARDS],
    groups: ["ch_talons", "ch_beak", "ch_bat", "ch_ostrich", "ch_wings"],
    answer: { eagle: "ch_talons", vulture: "ch_beak", crow: "ch_beak", bat: "ch_bat", ostrich: "ch_ostrich", locust: "ch_wings", bee: "ch_wings", fly: "ch_wings" },
  },
};
export const sortDef = (style: SortStyle): SortDef => DEFS[style];

/** Failed showings allowed for the Ingenuity goal: Story has no count. */
export const SORT_SLACK: Record<SortStyle, SortSlack | null> = { story: null, explorer: { shows: 1 }, challenge: { shows: 1 } };

/** The museum records the note at the end links to; each is shown only if its file exists. Existing source material; not reviewed for this game. */
export const SORT_RECORDS = ["person/al-jahiz", "work/kitab-al-hayawan"] as const;
