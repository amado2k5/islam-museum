// Viewpoints (founder request of 23 and 24 November 2026; design in docs/design/viewpoints-poc/): nine ways in to the same
// museum, each with its own accent, thoughts, reading order and one specific block. Text lives in i18n/<lang>.yaml under
// `viewpoints`; this file holds only what is language-neutral: keys, accents, icons, the link and minutes of each step.
// A viewpoint is a navigation layer over existing records: it adds no entity, no edge and no data of its own.
// Docs: docs/site/viewpoints.md.
export const VIEWPOINTS = ["new", "back", "five", "curious", "doubt", "research", "learn", "challenge", "pass"] as const;
export type Viewpoint = (typeof VIEWPOINTS)[number];

/** The five earlier persona URLs (/for/convert/ and so on) still resolve: each is a small redirect page to its viewpoint. */
export const OLD_ALIASES: Record<string, Viewpoint> = { convert: "new", doubter: "doubt", researcher: "research", learner: "learn", critic: "challenge" };

/** Light accent, light tint, dark-mode accent, dark-mode tint. White on the light accent and #0a2533 on the dark accent are both above 4.5:1. */
export const ACCENT: Record<Viewpoint, [string, string, string, string]> = {
  new: ["#3B6D11", "#EAF3DE", "#97C459", "#27500A"],
  back: ["#0F6E56", "#E1F5EE", "#5DCAA5", "#085041"],
  five: ["#993556", "#FBEAF0", "#ED93B1", "#72243E"],
  curious: ["#854F0B", "#FAEEDA", "#EF9F27", "#633806"],
  doubt: ["#993C1D", "#FAECE7", "#F0997B", "#712B13"],
  research: ["#185FA5", "#E6F1FB", "#85B7EB", "#0C447C"],
  learn: ["#534AB7", "#EEEDFE", "#AFA9EC", "#3C3489"],
  challenge: ["#A32D2D", "#FCEBEB", "#F09595", "#791F1F"],
  pass: ["#5F5E5A", "#F1EFE8", "#B4B2A9", "#444441"],
};

/** Line-icon paths (24 by 24, stroke only). */
export const ICON: Record<Viewpoint, string> = {
  new: '<path d="M12 21v-9M12 12c0-4 3-6 8-6 0 4-3 6-8 6zM12 15c0-3-2-5-7-5 0 3 2 5 7 5z"/>',
  back: '<path d="M8 8H3V3M3 8a9 9 0 1 1-1 7"/>',
  five: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M8 15h3M13 15h3"/>',
  curious: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  doubt: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
  research: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
  learn: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13"/>',
  challenge: '<path d="M12 4v16M6 20h12M5 8h14M5 8l-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0z"/>',
  pass: '<path d="M5 20V4h8v16M13 12h8M18 9l3 3-3 3"/>',
};

/** The arch form of each viewpoint's door (viewBox 0 0 100 152): shape tells the doors apart, not colour alone. */
export const ARCH: Record<Viewpoint, string> = {
  new: "M8 150V60A42 42 0 0 1 92 60V150Z", // round
  back: "M14 150V84C0 64 4 18 50 18C96 18 100 64 86 84V150Z", // horseshoe
  five: "M8 150V66A14 14 0 0 1 16 42A14 14 0 0 1 36 24A15 15 0 0 1 64 24A14 14 0 0 1 84 42A14 14 0 0 1 92 66V150Z", // multifoil
  curious: "M8 150V58Q9 41 26 33L50 20L74 33Q91 41 92 58V150Z", // four-centred
  doubt: "M8 150V72C8 44 42 46 50 10C58 46 92 44 92 72V150Z", // ogee
  research: "M8 150V66Q8 42 30 32Q45 24 50 8Q55 24 70 32Q92 42 92 66V150Z", // keel
  learn: "M8 150V68Q10 30 50 10Q90 30 92 68V150Z", // pointed
  challenge: "M8 150V68A24 24 0 0 1 28 36A22 22 0 0 1 72 36A24 24 0 0 1 92 68V150Z", // trefoil
  pass: "M8 150V28H92V150Z", // plain gateway
};

/** Link key → route under /<lang>/. Every target is an existing hall or page; the label of each is `viewpoints.links.<key>`. */
export const LINK_PATH: Record<string, string> = {
  ibadat: "ibadat", arkan: "arkan", ahkam: "ahkam", dua: "dua", usra: "usra", ulama: "ulama", places: "places",
  quran: "quran", tafsir: "tafsir", seerah: "seerah", messengers: "messengers", munazarat: "munazarat",
  questions: "questions", method: "method", authenticity: "authenticity", learn: "learn", wander: "wander",
  search: "search", madhahib: "madhahib", calendar: "calendar", signs: "signs", miracles: "miracles", graph: "graph",
  developers: "developers", journeys: "journeys",
  islam30: "exhibit/path-islam-in-30-minutes",
  // TODO(converts-exhibit): the converts exhibit is being written in another job; until it exists this points to the closest
  // existing page, the trail "The New Muslims" (early converts). Replace with the new exhibit's route when it lands.
  converts: "exhibit/path-hijra-converts",
};

/** Per viewpoint: the link key and minutes of each reading-order step, in the order of `viewpoints.<key>.steps` in the i18n files. */
export const STEPS: Record<Viewpoint, [string, number][]> = {
  new: [["arkan", 10], ["ibadat", 15], ["usra", 8], ["converts", 30], ["calendar", 10], ["questions", 10]],
  back: [["ibadat", 12], ["dua", 8], ["arkan", 10], ["ulama", 15], ["places", 10]],
  five: [["madhahib", 20], ["tafsir", 25], ["seerah", 30], ["converts", 25], ["ulama", 15]],
  curious: [["wander", 5], ["islam30", 30], ["journeys", 8], ["signs", 8]],
  doubt: [["questions", 15], ["quran", 12], ["messengers", 15], ["munazarat", 20], ["miracles", 10]],
  research: [["method", 10], ["authenticity", 12], ["search", 5], ["graph", 15], ["developers", 10]],
  learn: [["arkan", 12], ["ibadat", 25], ["ahkam", 20], ["madhahib", 20], ["learn", 40]],
  challenge: [["questions", 15], ["authenticity", 12], ["munazarat", 20], ["method", 8]],
  pass: [["journeys", 1], ["wander", 1], ["islam30", 1]],
};

/** The shape of the specific block of each viewpoint: a timeline, cards, or two-voice questions. */
export const BLOCK: Record<Viewpoint, "timeline" | "cards" | "voices"> = {
  new: "timeline", back: "cards", five: "timeline", curious: "cards", doubt: "voices", research: "cards", learn: "cards", challenge: "cards", pass: "cards",
};
/** Cards that also link somewhere: viewpoint → card index → link key. */
export const CARD_LINK: Partial<Record<Viewpoint, Record<number, string>>> = { curious: { 0: "miracles" } };

export const viewpointPath = (lang: string, v: string) => `/${lang}/for/${v}/`;
export const linkPath = (lang: string, key: string) => `/${lang}/${LINK_PATH[key]}/`;
/** Inline style that sets the four accent variables of a viewpoint. */
export const accentStyle = (v: Viewpoint) => { const [a, t, ad, td] = ACCENT[v]; return `--a:${a};--t:${t};--ad:${ad};--td:${td}`; };

/** Opening and closing quotation marks for the first-person line of a card, per language (fr uses narrow no-break spaces). */
export const QUOTES: Record<string, [string, string]> = {
  ar: ["«", "»"], fr: ["«\u202F", "\u202F»"], es: ["«", "»"], en: ["\u201C", "\u201D"], ur: ["\u201C", "\u201D"], tr: ["\u201C", "\u201D"], id: ["\u201C", "\u201D"],
};
export const quote = (lang: string, s: string) => `${QUOTES[lang][0]}${s}${QUOTES[lang][1]}`;
