// The Bayt al-Nubuwwa & Al al-Nabi Browser's shared reads (docs/plan/40-bayt-browser.md):
// which passage records mention the Prophet's household and family — بيت النبوة وآل النبي —
// and which corpus section each belongs to. Detection runs at build time over the compiled
// graph, so a mention in any harvested book — and in every book harvested later — appears
// without any tagging step. Curated records join through the `bayt-browser` tag instead.
//
// Scope (founder's rulings, 10 Nov 2026): the whole clan — household terms of art
// (أهل البيت، العترة، آل النبي…), the Prophet's immediate family, all twelve wives'
// names (wife-name mentions accepted, narrator noise included), Banu Hashim /
// Banu Abd al-Muttalib clan terms and named clan figures, and Alid descendants.
//
// The lexicon is deliberately gated: «آل» alone is generic (آل فرعون، آل لوط، سورة آل عمران),
// «أهل» alone is generic (أهل الكتاب، أهل القرى، أهل بيته = "his household" in fiqh),
// «فدك» collides with the verb فدكت and the word رفد, «سودة»/«فاطمة»/«زينب»/«صفية»/«ميمونة»
// are other people's names, «سبط» alone is a simile for a young animal, «القاسم بن محمد»
// is almost always the Muwatta narrator Ibn Abi Bakr rather than the Prophet's son, and
// bare «العباس»/«حمزة»/«جعفر»/«أبو طالب» collide with poets and narrators. Ambiguous
// forms therefore appear only qualified (full names, clan forms, titles); BAYT_EXCLUDE is
// the curated escape hatch for verified false positives and BAYT_EXTRA for family passages
// that carry no lexical marker.
import type { Node } from "./build-graph.js";

export const BAYT_TAG = "bayt-browser";
/** Page sections: the four passage corpora, then the curated groups. */
export const BAYT_SECTIONS = ["quran", "sunnah", "seerah", "books", "ahl", "mawaqif", "concepts"] as const;
export type BaytSection = (typeof BAYT_SECTIONS)[number];
export type BaytCorpus = Exclude<BaytSection, "ahl" | "mawaqif" | "concepts">;

/**
 * Household terms of art — the phrases the tradition itself uses for the Prophet's
 * household: أهل البيت and its possessive, العترة, آل + family names, the clan names,
 * and the signature events/objects (الثقلين، غدير خم، فدك، أهل الكساء، أم أيمن).
 */
const AR_HOUSEHOLD =
  /أهل البيت|أهل بيتي|أهل بيت النبي|أهل بيت رسول الله|أهل بيت محمد|أهل النبوة|أهل الكساء|أصحاب الكساء|أهل الصفة|العترة|عترتي|بضعة مني|الثقلين|كتاب الله وعترتي|عترتي وأهل بيتي|غدير خم|يوم الغدير|بيت النبوة|دار النبوة|أمهات المؤمنين|أم المؤمنين|زوج النبي|زوجة النبي|زوجات النبي|أزواج النبي|أزواج رسول الله|نساء النبي|بنت النبي|بنت رسول الله|ابنة النبي|ابنة رسول الله/;
/** Clan forms: Banu Hashim and the other Banu Abd al-Muttalib branches. */
const AR_CLAN =
  /بني هاشم|بنو هاشم|آل هاشم|الهاشمي|الهاشمية|الهاشميون|ابن هاشم|بني عبد المطلب|بنو عبد المطلب|آل عبد المطلب|بني المطلب|بنو المطلب|آل المطلب|بني طالب|بنو طالب|آل طالب|بني علي|بنو علي|آل علي|بني فاطمة|بنو فاطمة|آل فاطمة|بني الحسن|بنو الحسن|آل الحسن|بني الحسين|بنو الحسين|آل الحسين|بني محمد|بنو محمد|آل محمد|بني رسول الله|بنو رسول الله|آل البيت|بني عقيل|بنو عقيل|آل عقيل|بني جعفر|بنو جعفر|آل جعفر|بني العباس|بنو العباس|آل عباس|آل العباس|عبد المطلب|الفضل بن العباس|العباس بن عبد المطلب|عقيل بن أبي طالب|أم أيمن|فاطمة بنت أسد/;
/** Immediate family: the daughter, the son-in-law, the grandsons, the Prophet's children. */
const AR_IMMEDIATE =
  /(?<![ء-ي])فاطمة(?![ء-ي])|علي بن أبي طالب|ابن أبي طالب|الحسن بن علي|الحسين بن علي|الحسن والحسين|سبط رسول الله|سبط النبي|السبطين|سبطا رسول|السبط الأكبر|السبط الأصغر|(?<![ء-ي])خديجة(?![ء-ي])/;
/** The Prophet's daughters and their qualified names (bare «زينب»/«أم كلثوم»/«رقية» stay out). */
const AR_DAUGHTERS =
  /زينب بنت النبي|زينب بنت رسول الله|زينب بنت محمد|زينب بنت علي|زينب بنت فاطمة|زينب بنت جحش|زينب بنت خزيمة|أم كلثوم بنت (رسول الله|النبي|محمد|فاطمة|علي)|رقية بنت (رسول الله|النبي|محمد|فاطمة|علي)|إبراهيم بن (رسول الله|النبي|فاطمة)|القاسم بن محمد بن عبد الله|طاهر بن محمد/;
/** The twelve wives: bare names for the distinctive ones, qualified forms for the ambiguous. */
const AR_WIVES =
  /(?<![ء-ي])عائشة(?![ء-ي])|(?<![ء-ي])حفصة(?![ء-ي])|(?<![ء-ي])أم سلمة(?![ء-ي])|(?<![ء-ي])أم حبيبة(?![ء-ي])|(?<![ء-ي])ميمونة(?![ء-ي])|(?<![ء-ي])سودة(?![ء-ي])|(?<![ء-ي])مارية(?![ء-ي])|زينب بنت جحش|زينب بنت خزيمة|جويرية بنت الحارث|صفية بنت حيي|ميمونة بنت الحارث/;
/** Descendants: the Alid line and the named Imams, qualified full names. */
const AR_DESCENDANTS =
  /محمد بن علي|علي بن الحسين|علي بن محمد|الحسن بن محمد|الحسن بن الحسن|القاسم بن الحسن|جعفر بن محمد|جعفر الصادق|موسى بن جعفر|موسى الكاظم|علي بن موسى|علي الرضا|زين العابدين|محمد بن علي الرضا|محمد الجواد|علي الهادي|الحسن العسكري|محمد المهدي|النفس الزكية|زيد بن علي|محمد بن الحنفية|الحسن بن الحسن|ابن علي بن الحسين|بن الحسن بن علي|بن الحسين بن علي/;

/** English fields: the museum's own translations name the household plainly; generic
 * «people of the house»/«members of the family» stay out — they fire on unrelated households. */
const EN_BAYT =
  /\b(ahl al-?bayt|ahlul ?bayt|prophet'?s (household|family|wives)|wives of the prophet|fatima|khadija|ibn abi talib|ghadir|fadak|mubahala|thaqalayn|banu hashim|hasan and husayn|husayn ibn ali)\b/i;

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape
 * hatch, each verified by reading the passage:
 * - quran-11-73: «أهل البيت» is Lot's household, not the Prophet's family;
 * - muwatta-6-1093: «سودة بنت عبد الله بن عمر» is a different Sawda (Urwa's wife);
 * - muwatta-1-159: «زينب بنت جحش» here is Abd al-Rahman ibn Awf's wife, not the Prophet's;
 * - the non-Prophet Fatima files (bint Abi Hubaysh, bint Umar, bint Qays, bint al-Mundhir,
 *   bint al-Walid) — kept out until per-passage context can separate the names.
 */
export const BAYT_EXCLUDE = new Set([
  "passage/quran-11-73",
  "passage/muwatta-6-1093",
  "passage/muwatta-1-159",
  "passage/muwatta-1-157",
  "passage/muwatta-1-156",
  "passage/muwatta-1-510",
  "passage/muwatta-16-1769",
  "passage/muwatta-16-1775",
  "passage/muwatta-15-1693",
  "passage/muwatta-15-1697",
  "passage/muwatta-31-2721",
  "passage/muwatta-6-1163",
  "passage/muwatta-6-919",
  "passage/muslim-2942",
]);

/**
 * Family passages that carry no lexical marker — verified one by one. The wife verses
 * of Surat al-Ahzab address «أزواجه» without naming them; 33:5 marries Zaynab;
 * 33:6 legislates the Prophet's household; 4:128 is revealed about Sawda; 58:1-4
 * regulate access to the Prophet's wives; 33:37 and 33:40 narrate the marriage to
 * Zaynab bint Jahsh through the adopted son Zayd; 33:53 bars replacing his wives;
 * 3:61 is the mubahala verse (its «أبناءنا» are Ali, Fatima, Hasan and Husayn in the
 * Sunni reading).
 */
export const BAYT_EXTRA = new Set([
  "passage/quran-3-61",
  "passage/quran-4-128",
  "passage/quran-33-4",
  "passage/quran-33-5",
  "passage/quran-33-6",
  "passage/quran-33-37",
  "passage/quran-33-40",
  "passage/quran-33-28",
  "passage/quran-33-29",
  "passage/quran-33-30",
  "passage/quran-33-31",
  "passage/quran-33-32",
  "passage/quran-33-50",
  "passage/quran-33-51",
  "passage/quran-33-52",
  "passage/quran-33-53",
  "passage/quran-58-1",
  "passage/quran-58-2",
  "passage/quran-58-3",
  "passage/quran-58-4",
  // Waqidi, Kitab al-Maghazi: Usama ibn Zayd's final expedition — grandson-in-law and
  // adopted grandson of the Prophet through Zayd ibn Haritha; no lexical household marker.
  "passage/waqidi-maghazi-usama-expedition",
]);

/** The Arabic text a passage is judged on: matn, normalized search text, Arabic label and summary. */
const arabicOf = (n: Node): string =>
  [n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar].filter(Boolean).join(" ");
const englishOf = (n: Node): string =>
  [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");

/** True when the passage's own text mentions the Prophet's household or family. */
export function isBaytPassage(n: Node): boolean {
  if (n.class !== "passage" || n.stub) return false;
  if (BAYT_EXTRA.has(n.id)) return true;
  if (BAYT_EXCLUDE.has(n.id)) return false;
  const ar = arabicOf(n);
  return (
    AR_HOUSEHOLD.test(ar) ||
    AR_CLAN.test(ar) ||
    AR_IMMEDIATE.test(ar) ||
    AR_DAUGHTERS.test(ar) ||
    AR_WIVES.test(ar) ||
    AR_DESCENDANTS.test(ar) ||
    EN_BAYT.test(englishOf(n))
  );
}

/**
 * Which corpus a bayt passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function baytCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): BaytCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: the first `bayt-<section>` tag naming a real section, else `concepts`. */
export function baytTagSection(n: Node): BaytSection {
  for (const t of n.tags) {
    if (!t.startsWith("bayt-") || t === BAYT_TAG) continue;
    const id = t.slice(5);
    if ((BAYT_SECTIONS as readonly string[]).includes(id)) return id as BaytSection;
  }
  return "concepts";
}
