// The tenth quest as data: the journey of coffee, known or told? Cards about coffee are put on one of three shelves,
// by how sure the museum's record is of each. It is the second use of the sorting rules (sim/sort.ts), after the
// animal cards of al-Jahiz (content/sort.ts).
//
// History and invention, kept apart on purpose:
//   from museum records  (invention/coffee-yemen, after the Encyclopaedia of Islam, 2nd edition, vol. 4 "Kahwa", and
//                        Ukers, All About Coffee, 1922; invention/coffeehouse-yemen for the governor at Mecca) coffee is
//                        brewed from the beans of the coffee plant, native to Ethiopia, where the tree grew wild, or from
//                        the dried husk of the bean (qishr) as the Yemenis preferred; the drinking of it spread from Sufi
//                        circles because it aided wakefulness for devotional nights; from Yemen it passed to Mecca, Cairo
//                        and Istanbul; at Mecca Kha'ir Beg's attempt to ban it failed to stop it; traditions credit its
//                        introduction at Aden to the jurist Muhammad ibn Sa'id al-Dhabhani and at Mocha to 'Ali ibn 'Umar
//                        al-Shadhili, and "the traditions compete rather than agree"; three names contest the honour
//                        (al-Dhabhani, al-Shadhili and al-'Aidarus) and their plurality "points to local traditions
//                        rather than one documented event"; and one of the record's sources, Ukers, "treats the
//                        Omar-and-the-goats-type legends as unhistorical".
//   invented for play    the three shelves as a scheme (the record does not sort its own statements this way: this is the
//                        game's reading of it), which card the game puts on which shelf, the eight card sentences as the
//                        game words them, the keeper of the records, the child who tidies the cards, the two imagined
//                        lines they speak, and the page of the Atlas. The third shelf does not say that the tale is a
//                        lie: it says that the record's source does not take it as history. The record's mention that the
//                        word for coffee was once used in poetry for wine is left out of every card and line, and so is
//                        al-'Aidarus, the third name the record gives (review ledger, HR-HH-35 to HR-HH-37).
import type { SortDef, SortSlack, SortStyle } from "../sim/sort";

export const COFFEE_QUEST = "w07q3-coffee";
/** The Atlas subject the quest belongs to. */
export const COFFEE_SUBJECT = "coffee";

/** The eight cards, in the order of the picture and the list. */
export const COFFEE_CARDS = ["ethiopia", "husk", "sufis", "spread", "ban", "dhabhani", "shadhili", "goats"] as const;
export type CoffeeCard = (typeof COFFEE_CARDS)[number];

/** The three shelves, in the order they lie (one, two and three dots): stated plainly, a tradition, a legend. */
export const SHELVES = ["stated", "tradition", "legend"] as const;
export type Shelf = (typeof SHELVES)[number];

/** The shelf each card belongs to, as the game reads the record. The tests write this table again by hand with the record's sentence beside every card. */
const ANSWER: Record<CoffeeCard, Shelf> = {
  ethiopia: "stated",
  husk: "stated",
  sufis: "stated",
  spread: "stated",
  ban: "stated",
  dhabhani: "tradition",
  shadhili: "tradition",
  goats: "legend",
};

// The cards of each way of playing; the shelves are the same three in all of them.
//   Story      4 cards: the tree, the Sufi nights, al-Dhabhani, the tale of Omar and the goats.
//   Explorer   6 cards: and the husk drink and al-Shadhili.
//   Challenge  8 cards: and the road to Mecca, Cairo and Istanbul and the ban at Mecca.
const ITEMS: Record<SortStyle, readonly CoffeeCard[]> = {
  story: ["ethiopia", "sufis", "dhabhani", "goats"],
  explorer: ["ethiopia", "husk", "sufis", "dhabhani", "shadhili", "goats"],
  challenge: [...COFFEE_CARDS],
};
export const coffeeDef = (style: SortStyle): SortDef => ({ items: ITEMS[style], groups: SHELVES, answer: Object.fromEntries(ITEMS[style].map((i) => [i, ANSWER[i]])) });

/** Failed showings allowed for the Ingenuity goal: Story has no count. */
export const COFFEE_SLACK: Record<SortStyle, SortSlack | null> = { story: null, explorer: { shows: 1 }, challenge: { shows: 1 } };

/** The museum records the note at the end links to; each is shown only if its file exists. Existing source material; not reviewed for this game. */
export const COFFEE_RECORDS = ["invention/coffee-yemen", "invention/coffeehouse-yemen"] as const;
