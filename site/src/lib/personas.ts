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

// ---- Depth added 23 November 2026: questions, a first-week list, a comparison table and checked resources. ----
// Everything below points at records already in the graph (question/…, listing/…); nothing here is a new claim.

/** Question records each view puts up front, in order. Their text, answers and sources are the records' own. */
export const QUESTIONS: Record<Persona, string[]> = {
  convert: ["what-is-islam", "what-are-five-pillars", "who-was-muhammad", "what-is-the-quran", "why-no-alcohol", "what-is-birr", "what-is-hijab", "what-is-jihad", "what-is-difference-sunni-shia", "what-is-qadar", "what-is-the-afterlife", "what-is-sabr"],
  doubter: ["what-is-islam", "who-was-muhammad", "what-is-the-quran", "what-is-tawhid", "who-was-isa", "what-is-the-afterlife", "what-is-qadar", "what-is-jihad", "what-is-sharia", "is-human-evolution-compatible-with-islam", "why-five-daily-prayers", "why-fast-in-ramadan"],
  researcher: ["what-is-sanad", "what-is-hadith", "what-is-difference-quran-hadith", "what-is-tafsir", "what-is-fiqh", "what-is-ijma", "what-is-ijtihad", "are-the-seven-readings-the-seven-ahruf", "is-the-order-of-the-suras-fixed-by-revelation", "do-the-texts-of-revelation-yield-certainty"],
  learner: ["what-is-niyya", "what-is-ihsan", "what-is-taqwa", "what-is-ikhlas", "what-is-sabr", "what-is-tawakkul", "what-is-dhikr", "what-is-ilm", "what-is-adab", "must-a-layperson-follow-one-madhhab"],
  critic: ["what-is-jihad", "what-is-sharia", "what-is-hijab", "why-is-riba-forbidden", "why-is-gambling-forbidden", "what-is-the-hadd-for-drinking-wine", "what-is-talaq", "what-were-the-crusades", "who-were-the-khawarij", "what-is-difference-sunni-shia", "who-was-aisha"],
};

/** The convert's first-week list (question records, each with a tick box that is not saved). */
export const CHECKLIST: string[] = ["what-is-shahada", "what-is-wudu", "what-is-ghusl", "what-is-salah", "what-is-adhan", "what-is-halal", "what-is-dua", "what-is-birr", "what-is-ramadan", "what-is-zakat"];

/** Figures the Qur'an and the Bible/Torah traditions share: the table of comparison for views that ask "how does this compare?". */
export const COMPARE: string[] = ["who-was-adam", "who-was-nuh", "who-was-ibrahim", "who-was-musa", "who-was-dawud", "who-was-sulayman", "who-was-yunus", "who-was-yusuf", "who-was-isa"];
export const COMPARE_PERSONAS: Persona[] = ["convert", "doubter", "critic"];

/** Checked resources: listing records, opened and read on 23 November 2026. Titles are `personas.shelves.<key>`. */
export const SHELVES: Record<Persona, { key: string; ids: string[] }[]> = {
  convert: [
    { key: "support", ids: ["new-muslim-care", "newmuslim-net", "convert-muslim-foundation", "rabata-convert-care", "mcc-east-bay-convert-care", "iera"] },
    { key: "places", ids: ["zabihah", "halaltrip", "muslim-pro", "islamicfinder", "halalbooking"] },
    { key: "books", ids: ["mecca-books", "dar-us-salam-usa", "islamic-bookstore-com", "kube-publishing", "goodword-books", "white-thread-press"] },
    { key: "dress", ids: ["haute-hijab", "modanisa", "verona-collection"] },
    { key: "learn", ids: ["almaghrib", "yaqeen", "quran-com", "islamqa"] },
    { key: "help", ids: ["cair", "mend", "tell-mama"] },
  ],
  doubter: [
    { key: "learn", ids: ["yaqeen", "quran-com", "sunnah-com", "islamqa"] },
    { key: "books", ids: ["kube-publishing", "mecca-books"] },
  ],
  researcher: [{ key: "texts", ids: ["quran-com", "sunnah-com", "islam360", "yaqeen"] }],
  learner: [
    { key: "learn", ids: ["almaghrib", "yaqeen", "quran-com", "sunnah-com", "islamqa"] },
    { key: "tools", ids: ["muslim-pro", "tarteel", "islamicfinder"] },
    { key: "books", ids: ["kube-publishing", "white-thread-press", "turath-publishing", "mecca-books"] },
  ],
  critic: [{ key: "texts", ids: ["quran-com", "sunnah-com", "yaqeen"] }],
};
