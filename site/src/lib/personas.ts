// The five personas of the landing page (founder request, 23 November 2026): five views of the same museum, each with its
// own colour, mind-set and reading order. Text lives in i18n/<lang>.yaml under `personas`; this file holds only what is
// language-neutral: the keys, the colours and which museum pages each section points to. A view is a navigation layer over
// existing records: it adds no entity, no edge and no data of its own.
export const PERSONAS = ["convert", "doubter", "researcher", "learner", "critic"] as const;
export type Persona = (typeof PERSONAS)[number];

/** Accent per persona. White text on each is above 4.5:1; the accent is used as a ground, a stripe or a border, never as text on the page ground. */
export const PERSONA_COLOR: Record<Persona, string> = {
  convert: "#1f7a52",
  doubter: "#a8631a",
  researcher: "#1f5f99",
  learner: "#6b3f95",
  critic: "#9c3a32",
};

/** Link key → route under /<lang>/. Every target is an existing hall or page; the label of each is `personas.links.<key>`. */
export const LINK_PATH: Record<string, string> = {
  ibadat: "ibadat", arkan: "arkan", ahkam: "ahkam", halal: "halal", hudud: "hudud", dua: "dua", akhlaq: "akhlaq",
  hasanat: "hasanat", sayyiat: "sayyiat", usra: "usra", ukhuwwa: "ukhuwwa", places: "places", ulama: "ulama",
  quran: "quran", tafsir: "tafsir", seerah: "seerah", messengers: "messengers", umam: "umam", munazarat: "munazarat",
  questions: "questions", method: "method", authenticity: "authenticity", cite: "cite", learn: "learn",
  courses: "learn/courses", trails: "learn/trails", wander: "wander", search: "search", madhahib: "madhahib",
  calendar: "calendar", signs: "signs", miracles: "miracles", cosmos: "cosmos", companions: "companions",
  network: "network", timeline: "timeline", graph: "graph", developers: "developers", licenses: "licenses",
  battles: "battles", khulafa: "khulafa", qurun: "qurun", jobs: "jobs", qiraat: "qiraat", why: "why",
};

/** Link keys of each section, in the order of `personas.<persona>.sections` in the i18n files. */
export const SECTION_LINKS: Record<Persona, string[][]> = {
  convert: [
    ["arkan", "ibadat", "dua"],
    ["usra", "ukhuwwa", "akhlaq"],
    ["halal", "ahkam"],
    ["places", "ulama", "ukhuwwa"],
    ["halal", "places", "wander"],
    ["courses", "seerah", "messengers", "quran"],
    ["messengers", "umam", "munazarat"],
    ["questions", "dua", "akhlaq"],
    ["akhlaq", "hasanat", "sayyiat"],
  ],
  doubter: [
    ["learn", "arkan"],
    ["quran", "tafsir", "seerah"],
    ["questions", "munazarat"],
    ["messengers", "umam", "munazarat"],
    ["ibadat", "calendar", "arkan"],
    ["ulama", "wander", "ukhuwwa"],
    ["signs", "miracles", "cosmos"],
  ],
  researcher: [
    ["search", "graph"],
    ["method", "authenticity", "cite"],
    ["timeline", "calendar", "places"],
    ["ulama", "companions", "network"],
    ["quran", "tafsir", "qiraat"],
    ["developers", "licenses"],
    ["madhahib", "munazarat", "ahkam"],
  ],
  learner: [
    ["arkan", "ibadat"],
    ["dua", "calendar"],
    ["quran", "tafsir"],
    ["seerah", "messengers", "companions"],
    ["akhlaq", "usra", "ukhuwwa", "jobs"],
    ["madhahib", "ulama", "ahkam"],
    ["courses", "trails"],
    ["sayyiat", "hasanat", "dua"],
  ],
  critic: [
    ["method", "authenticity", "cite"],
    ["quran", "tafsir", "seerah"],
    ["battles", "hudud", "ahkam"],
    ["munazarat", "umam", "messengers"],
    ["madhahib", "ulama"],
    ["khulafa", "battles", "qurun"],
    ["graph", "developers", "search"],
  ],
};

/** Link keys of each stage of the convert's path (the only view with a staged path). */
export const STEP_LINKS: string[][] = [
  ["ibadat", "dua", "arkan"],
  ["places", "ukhuwwa"],
  ["halal", "usra"],
  ["calendar", "seerah", "quran"],
  ["akhlaq", "questions"],
];

export const personaPath = (lang: string, p: Persona) => `/${lang}/for/${p}/`;
export const linkPath = (lang: string, key: string) => `/${lang}/${LINK_PATH[key]}/`;
