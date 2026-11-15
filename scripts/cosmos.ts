// The Cosmos Browser's shared reads (docs/plan/cosmos-browser.md): which passage records speak of
// beings and worlds beyond the Earth, the earlier creation and peoples that lived before the
// human story as the sources tell it, the vanished and hidden nations, and the secrets of the
// cosmos — and which corpus section each belongs to. Detection runs at build time over the
// compiled graph, so a mention in any harvested book — and in every book harvested later —
// appears without a tagging step. Curated records join through the `cosmos-browser` tag.
//
// Two detection paths, because the two kinds of text need different care:
//  1. The Qur'an: an explicit, reviewed table of verses (COSMOS_QURAN_REFS) — the verse text is
//     frozen and never searched by vocabulary, so a verse is in the browser because a person
//     decided it speaks of the topic, not because a word matched.
//  2. Every other passage (hadith, tafsir, history, geography, wonders-of-creation books, poetry):
//     a guarded lexicon over the passage's own text, search text, label and summary. Bare common
//     words never match alone («عاد» is also "he returned", «الأرض» is the ground): the lexicon
//     uses phrases and names that carry the topic by themselves.
// COSMOS_EXCLUDE is the curated escape hatch for verified false positives; a passage can also
// join with a `cosmos-browser` tag when its wording carries no lexicon word.
import type { Node } from "./build-graph.js";

export const COSMOS_TAG = "cosmos-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const COSMOS_SECTIONS = ["quran", "sunnah", "seerah", "books", "concepts"] as const;
export type CosmosSection = (typeof COSMOS_SECTIONS)[number];
export type CosmosCorpus = Exclude<CosmosSection, "concepts">;

/** Topic chips carried by a record: detected families on passages, `cosmos-<topic>` tags on curated records. */
export const COSMOS_TOPICS = [
  "beyond-earth", "many-worlds", "heavens", "origins", "before-adam", "lost-peoples", "hidden-peoples", "secrets",
] as const;
export type CosmosTopic = (typeof COSMOS_TOPICS)[number];

/** [sura, first aya, last aya, topics] — every row read against the verse text and the classical commentaries. */
export const COSMOS_QURAN_REFS: ReadonlyArray<readonly [number, number, number, readonly CosmosTopic[]]> = [
  // — creatures and beings dispersed through the heavens and the earth
  [42, 29, 29, ["beyond-earth"]], // «وما بث فيهما من دابة»: living creatures dispersed in both heaven and earth
  [16, 8, 8, ["beyond-earth"]], // «ويخلق ما لا تعلمون»
  [36, 36, 36, ["beyond-earth"]], // «ومما لا يعلمون»: pairs among what they do not know
  [74, 31, 31, ["beyond-earth", "secrets"]], // «وما يعلم جنود ربك إلا هو»
  [6, 38, 38, ["beyond-earth"]], // «ما من دابة... إلا أمم أمثالكم»
  [17, 44, 44, ["beyond-earth", "many-worlds"]], // the seven heavens and the earth and whoever is in them glorify Him
  [55, 29, 29, ["beyond-earth"]], // «يسأله من في السماوات والأرض»
  [19, 93, 95, ["beyond-earth"]], // «إن كل من في السماوات والأرض إلا آتي الرحمن عبدا»
  [22, 18, 18, ["beyond-earth"]], // all who are in the heavens and the earth prostrate to Him
  [13, 15, 15, ["beyond-earth"]],
  // — the worlds, the seven heavens and the like of them of the earth
  [1, 2, 2, ["many-worlds"]], // «رب العالمين»
  [45, 36, 36, ["many-worlds"]],
  [65, 12, 12, ["many-worlds", "heavens"]], // «سبع سماوات ومن الأرض مثلهن»
  [2, 29, 29, ["many-worlds", "heavens"]],
  [41, 12, 12, ["many-worlds", "heavens"]],
  [67, 3, 3, ["many-worlds", "heavens"]],
  [71, 15, 15, ["many-worlds", "heavens"]],
  [23, 17, 17, ["heavens"]],
  [78, 12, 12, ["heavens"]],
  [14, 48, 48, ["many-worlds", "origins"]], // the earth replaced by another earth
  // — the structure of the heavens, the orbits and the stars
  [36, 38, 40, ["heavens"]],
  [21, 33, 33, ["heavens"]],
  [10, 5, 5, ["heavens"]],
  [55, 5, 5, ["heavens"]],
  [13, 2, 2, ["heavens"]],
  [31, 10, 10, ["heavens"]],
  [22, 65, 65, ["heavens"]],
  [35, 41, 41, ["heavens"]],
  [37, 6, 10, ["heavens"]],
  [15, 16, 18, ["heavens"]],
  [67, 5, 5, ["heavens"]],
  [72, 8, 9, ["heavens"]],
  [86, 1, 3, ["heavens"]],
  [56, 75, 76, ["heavens", "secrets"]], // «فلا أقسم بمواقع النجوم»
  [55, 33, 33, ["heavens", "secrets"]], // «إن استطعتم أن تنفذوا من أقطار السماوات والأرض فانفذوا»
  [15, 14, 15, ["heavens", "secrets"]], // «ولو فتحنا عليهم بابا من السماء فظلوا فيه يعرجون»
  [51, 7, 7, ["heavens"]],
  [50, 6, 6, ["heavens"]],
  [21, 32, 32, ["heavens"]],
  [79, 27, 29, ["heavens", "origins"]],
  // — the beginning of creation: smoke, rending, expansion, the six days, the Throne on the water
  [21, 30, 30, ["origins"]],
  [41, 9, 11, ["origins", "heavens"]],
  [51, 47, 47, ["origins", "heavens"]],
  [7, 54, 54, ["origins"]],
  [10, 3, 3, ["origins"]],
  [11, 7, 7, ["origins", "secrets"]],
  [25, 59, 59, ["origins"]],
  [32, 4, 4, ["origins"]],
  [50, 38, 38, ["origins"]],
  [57, 4, 4, ["origins"]],
  [21, 104, 104, ["origins"]],
  [39, 67, 67, ["origins"]],
  // — who held the earth before Adam: the jinn made earlier, the angels' question, the successions
  [2, 30, 30, ["before-adam"]],
  [15, 26, 27, ["before-adam"]], // man from clay; «والجان خلقناه من قبل من نار السموم»
  [55, 14, 15, ["before-adam"]],
  [76, 1, 1, ["before-adam"]], // «هل أتى على الإنسان حين من الدهر لم يكن شيئا مذكورا»
  [7, 69, 69, ["before-adam", "lost-peoples"]],
  [7, 74, 74, ["before-adam", "lost-peoples"]],
  [10, 14, 14, ["before-adam"]],
  [6, 6, 6, ["before-adam"]],
  [6, 133, 133, ["before-adam"]], // «كما أنشأكم من ذرية قوم آخرين»
  [27, 62, 62, ["before-adam"]],
  [35, 39, 39, ["before-adam"]],
  // — the peoples that vanished
  [14, 9, 9, ["lost-peoples"]], // «والذين من بعدهم لا يعلمهم إلا الله»
  [25, 38, 38, ["lost-peoples"]],
  [50, 12, 14, ["lost-peoples"]],
  [89, 6, 8, ["lost-peoples"]],
  [46, 21, 26, ["lost-peoples"]],
  [7, 65, 72, ["lost-peoples"]],
  [7, 73, 79, ["lost-peoples"]],
  [11, 50, 60, ["lost-peoples"]],
  [11, 61, 68, ["lost-peoples"]],
  [26, 123, 140, ["lost-peoples"]],
  [26, 141, 159, ["lost-peoples"]],
  [26, 176, 191, ["lost-peoples"]],
  [41, 13, 17, ["lost-peoples"]],
  [54, 18, 32, ["lost-peoples"]],
  [69, 4, 8, ["lost-peoples"]],
  [51, 41, 45, ["lost-peoples"]],
  [53, 50, 51, ["lost-peoples"]],
  [91, 11, 15, ["lost-peoples"]],
  [15, 78, 84, ["lost-peoples"]],
  [27, 45, 53, ["lost-peoples"]],
  [85, 4, 8, ["lost-peoples"]],
  [44, 37, 37, ["lost-peoples"]],
  [34, 15, 19, ["lost-peoples"]],
  [38, 12, 13, ["lost-peoples"]],
  // — the peoples behind the barrier, in the cave, and the beast of the earth
  [18, 9, 26, ["hidden-peoples"]],
  [18, 83, 99, ["hidden-peoples"]],
  [21, 96, 97, ["hidden-peoples"]],
  [27, 82, 82, ["hidden-peoples", "secrets"]],
  // — the keys of the unseen, the dominion, the Tablet, the Pen, the Lote-tree, the Throne
  [6, 59, 59, ["secrets"]],
  [27, 65, 65, ["secrets"]],
  [72, 26, 28, ["secrets"]],
  [17, 85, 85, ["secrets"]],
  [85, 21, 22, ["secrets"]],
  [68, 1, 1, ["secrets"]],
  [53, 13, 18, ["secrets"]],
  [2, 255, 255, ["secrets"]],
  [40, 7, 7, ["secrets"]],
  [39, 75, 75, ["secrets"]],
  [69, 17, 17, ["secrets"]],
  [6, 75, 75, ["secrets"]],
  [7, 185, 185, ["secrets"]],
  [23, 88, 88, ["secrets"]],
  [36, 83, 83, ["secrets"]],
  [18, 109, 109, ["secrets"]],
  [31, 27, 27, ["secrets"]],
  [34, 3, 3, ["secrets"]],
  [41, 53, 53, ["secrets"]],
  [18, 65, 65, ["secrets"]],
];

/** Topic families of a Qur'an verse from the reviewed table. */
export function cosmosQuranTopics(sura: unknown, aya: unknown): CosmosTopic[] {
  const s = Number(sura), a = Number(aya);
  if (!s || !a) return [];
  const out = new Set<CosmosTopic>();
  for (const [rs, from, to, topics] of COSMOS_QURAN_REFS) if (rs === s && a >= from && a <= to) for (const t of topics) out.add(t);
  return [...out];
}

// ---------- lexicon for everything that is not the Qur'an (hadith, tafsir, history, geography, wonders books, poetry)
/** The earth as seven, and the heavens as seven: phrases, never the bare words. */
const AR_SEVEN_EARTHS = /سبع أرضين|سبع أراضين|الأرضين السبع|الأرضون السبع|سبع أرضون|سبع سماوات|السماوات السبع|السبع الطباق|سبع طرائق|سبع سموات|السموات السبع/;
/** Other worlds and the number of the worlds. */
const AR_WORLDS = /عوالم|ألف عالم|عالم آخر|عالما آخر|عوالم أخرى|تعدد العوالم|الكواكب المأهولة|سكان الكواكب|أهل الأرض الأخرى/;
/** Creatures of the heavens other than the angels and the jinn, and the "unknown creation". */
const AR_BEYOND = /ما بث فيهما|مخلوقات في السماء|كائنات فضائية|الفضاء الخارجي|كائنات حية في السماء|الدابة في السماء|دواب السماء/;
/** The beginning of creation. */
const AR_ORIGINS = /كان الله ولم يكن شيء غيره|كان عرشه على الماء|أول ما خلق الله|خلق الله التربة|رتقا ففتقناهما|ثم استوى إلى السماء وهي دخان|لموسعون|الدخان الذي خلقت منه السماء|خلق السماوات والأرض في ستة أيام/;
/** The earlier creation and the earth before Adam. */
const AR_BEFORE_ADAM = /قبل آدم|قبل خلق آدم|قبل أن يخلق الله آدم|الجن في الأرض|سكان الأرض قبل|عمار الأرض قبل|عمران الأرض قبل|الحن والبن|الحن والبنّ|الحِن والبِن|بنو الجان|الأمم قبل آدم|أمم قبل آدم|كان في الأرض قبل|خلفاء الجن|الجن قبل|سلطان الجن|الطم والرم|عالم قبل آدم/;
/** The vanished peoples by name. «عاد» alone is a verb, so it counts only inside a people-name phrase. */
const AR_LOST = /قوم عاد|عاد وثمود|عادا وثمود|عاد وفرعون|عاد الأولى|عاد الأخيرة|عاد بن عوص|إرم ذات العماد|إرم العماد|ثمود|أصحاب الرس|أصحاب الأيكة|أهل الأيكة|أصحاب الأخدود|قوم تبع|قوم تبّع|أصحاب الحجر|قوم صالح|قوم هود|مدائن صالح|الأمم البائدة|الأقوام البائدة|العرب البائدة|العماليق|طسم وجديس|جرهم الأولى|أهل سبأ|سيل العرم/;
/** The hidden peoples: Gog and Magog, the barrier, the cave, the Two-Horned. */
const AR_HIDDEN = /يأجوج|ماجوج|مأجوج|يأجوج ومأجوج|ردم يأجوج|سد ذي القرنين|ذو القرنين|ذي القرنين|أصحاب الكهف|أهل الكهف|دابة الأرض|الجساسة/;
/** The secrets of the heavens and the unseen. */
const AR_SECRETS = /اللوح المحفوظ|سدرة المنتهى|البيت المعمور|مفاتح الغيب|مفاتيح الغيب|ملكوت السماوات|ملكوت السموات|عالم الملكوت|الكرسي وسع|العرش والكرسي|أطت السماء|حملة العرش|حاملو العرش|اللوح والقلم|أول ما خلق الله القلم|ما فيها موضع أربع أصابع|الفلك الأعلى|مواقع النجوم|الشهب والرجوم|الرجم بالشهب/;
/** Sunnah-specific cosmic reports: the sun under the Throne, the creation of the earth in days, the earthquake of the earth. */
const AR_SUNNAH_COSMIC = /تسجد تحت العرش|أين تذهب هذه الشمس|الشمس تذهب حتى تسجد|كسوف الشمس والقمر آيتان|خلق الله التربة يوم السبت|ما بين السماء والأرض مسيرة خمسمائة عام|كثف كل سماء|بعد ما بين السماء والأرض/;

/** English fields: the museum's own translations name these plainly. */
const EN_BEYOND = /\b(extraterrestrial\w*|life beyond (the )?earth|other worlds|plurality of worlds|beings in the heavens|creatures in the heavens|alien\w*)\b/i;
const EN_WORLDS = /\b(seven earths|seven heavens|the worlds)\b/i;
const EN_BEFORE_ADAM = /\b(before Adam|pre-?Adamite\w*|hinn and binn|earth before Adam)\b/i;
const EN_LOST = /\b('?Ad and Thamud|people of 'Ad|Thamud|Iram|(Companions|People) of the Rass|Ashab al-Rass|Aykah|Ukhdud|lost peoples|vanished (peoples|nations))\b/i;
const EN_HIDDEN = /\b(Gog and Magog|Yajuj|Majuj|Dhu al-Qarnayn|Dhul-Qarnayn|Sleepers of the Cave|People of the Cave)\b/i;
const EN_SECRETS = /\b(Preserved Tablet|Lote[- ]tree of the Utmost Boundary|Sidrat al-Muntaha|Throne and the Footstool|keys of the unseen|dominion of the heavens|celestial sphere)\b/i;
const EN_ORIGINS = /\b(expanding the heaven|the Throne was upon the water)\b/i;

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape hatch, each
 * verified by reading the passage; empty until the first audit flags one.
 */
export const COSMOS_EXCLUDE = new Set<string>([]);

/** The Arabic text a passage is judged on: matn, normalized search text, Arabic label and summary. */
const arabicOf = (n: Node): string =>
  [n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar].filter(Boolean).join(" ");
const englishOf = (n: Node): string =>
  [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");

/** Per-topic lexicon for non-Qur'an passages: the Arabic patterns first, then the English ones. */
const LEXICON: Record<CosmosTopic, RegExp[]> = {
  "many-worlds": [AR_SEVEN_EARTHS, AR_WORLDS, EN_WORLDS],
  heavens: [AR_SUNNAH_COSMIC],
  "beyond-earth": [AR_BEYOND, EN_BEYOND],
  origins: [AR_ORIGINS, EN_ORIGINS],
  "before-adam": [AR_BEFORE_ADAM, EN_BEFORE_ADAM],
  "lost-peoples": [AR_LOST, EN_LOST],
  "hidden-peoples": [AR_HIDDEN, EN_HIDDEN],
  secrets: [AR_SECRETS, EN_SECRETS, AR_SUNNAH_COSMIC],
};

/** The words that made a passage match, per topic (the audit prints them; the page never does). */
export function cosmosMatches(n: Node): Partial<Record<CosmosTopic, string[]>> {
  if (n.class !== "passage" || n.stub || n.data.work === "work/quran") return {};
  const ar = arabicOf(n);
  const en = englishOf(n);
  const out: Partial<Record<CosmosTopic, string[]>> = {};
  for (const t of COSMOS_TOPICS) {
    const hits: string[] = [];
    for (const re of LEXICON[t]) {
      const m = (re.source.includes("\\b") ? en : ar).match(re);
      if (m) hits.push(m[0]);
    }
    if (t === "heavens" && AR_SEVEN_EARTHS.test(ar) && /سماوات|سموات|سماء/.test(ar)) hits.push("seven-earths+heavens");
    if (hits.length) out[t] = hits;
  }
  return out;
}

/** The cosmos topic families a passage mentions. The Qur'an by the reviewed table, all else by the lexicon. */
export function cosmosTopicsOf(n: Node): CosmosTopic[] {
  if (n.class !== "passage" || n.stub || COSMOS_EXCLUDE.has(n.id)) return [];
  if (n.data.work === "work/quran") return cosmosQuranTopics(n.data.sura, n.data.aya);
  return Object.keys(cosmosMatches(n)) as CosmosTopic[];
}

/** True when the passage's own text mentions the cosmos topics. */
export function isCosmosPassage(n: Node): boolean {
  return cosmosTopicsOf(n).length > 0;
}

/**
 * Which corpus a cosmos passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by their
 * genre the day their passages arrive.
 */
export function cosmosCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): CosmosCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: the first `cosmos-<section>` tag naming a real section, else `concepts`. */
export function cosmosTagSection(n: Node): CosmosSection {
  for (const t of n.tags) {
    if (!t.startsWith("cosmos-") || t === COSMOS_TAG) continue;
    const id = t.slice(7);
    if ((COSMOS_SECTIONS as readonly string[]).includes(id)) return id as CosmosSection;
  }
  return "concepts";
}

/** The topic chips of a curated record, from its `cosmos-<topic>` tags (section tags are not topics). */
export function cosmosTagTopics(n: Node): CosmosTopic[] {
  return n.tags
    .filter((t) => t.startsWith("cosmos-") && t !== COSMOS_TAG)
    .map((t) => t.slice(7))
    .filter((t): t is CosmosTopic => (COSMOS_TOPICS as readonly string[]).includes(t));
}
