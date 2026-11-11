// The Magic Browser's shared reads (docs/plan/37-magic-browser.md): which passage records
// mention magic and the magicians — sorcery, soothsaying and augury, ruqyah and the counter-
// incantations, the evil eye and envy — and which corpus section each belongs to. Detection
// runs at build time over the compiled graph, so a magic mention in any harvested book — and
// in every book harvested later — appears without any tagging step. Curated records join
// through the `magic-browser` tag instead.
//
// The lexicon is deliberately gated: unvocalized Arabic makes «سحر» ambiguous between sorcery
// (سَحَرَ) and the night-vigil (سَحَر/سَحِرَ), «رقى» between the incantation and "he ascended",
// «يسترق» between seeking ruqyah and seeking enslavement, «العين» between the evil eye and
// the eye, a spring or the 'īna sale, «عراف» a substring of «الأعراف» (the sura), and «منجم»
// both astrologer and "in installments" (منجمة). Bare ambiguous forms count only beside a
// magic-domain collocation in the same passage; the sahar (night) usages are stripped before
// matching, and MAGIC_EXCLUDE is the curated escape hatch for verified false positives.
import type { Node } from "./build-graph.js";

export const MAGIC_TAG = "magic-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const MAGIC_SECTIONS = ["quran", "sunnah", "seerah", "books", "concepts"] as const;
export type MagicSection = (typeof MAGIC_SECTIONS)[number];
export type MagicCorpus = Exclude<MagicSection, "concepts">;

/** Topic chips carried by a record: detected families on passages, `magic-<topic>` tags on curated records. */
export const MAGIC_TOPICS = [
  "sihr", "sahara", "kahana", "ruqyah", "ayn", "hasad", "waswasah", "kashf", "irafa", "jinn", "nujum",
] as const;
export type MagicTopic = (typeof MAGIC_TOPICS)[number];

/**
 * Unambiguous sorcery vocabulary: the practitioner («ساحر» and its plurals/feminine by
 * substring), the bewitched («مسحور» and its cases), the enchanter («مشعوذ», «شعوذة»),
 * and the form-II enchantment forms («تسحير», «مسحّر», «مسحر»).
 */
const AR_SIHR_STRONG = /ساحر|سحرة|ساحرة|مسحور|مسحورة|مشعوذ|شعوذة|تسحير|مسحّر|مسحر/;
/**
 * Ambiguous sorcery forms — «السحر»/«سحر»/«سحرا» are sorcery or the night-vigil, the
 * pronoun-suffixed forms («سحره»، «سحرتها»، «سحروا») are "bewitched him" or the idafa
 * "his/their night". These count only when a magic-domain collocation appears in the same
 * passage (see AR_MAGIC_CONTEXT).
 */
const AR_SIHR_WEAK = /السحر|سحر|سحرا|سحره|سحرتها|سحرت|سحروا|سحرهم|سحرنا|يسحر/;
/** Magic-domain words that make an ambiguous «سحر» a mention of sorcery, not the night. */
const AR_MAGIC_CONTEXT =
  /ساحر|سحرة|مسحور|مشعوذ|شعوذة|شياطين|شيطان|تمائم|تعويذ|طلسم|تنجيم|منجم|كاهن|عراف|رقى|يرقي|استرقاء|كفروا|يبطل|يتعلم|يعمل|صنعة|قراءة|كتاب|من السحر|بالسحر|للسحر|لسحر|علم السحر|سحره|سحروا|بيان/;
/**
 * The night-vigil (sahar) usages stripped before matching: «تسحر/أسحر/يستسحر» are "stay up
 * (pre-dawn)", «سحراً» and «في/من السحر» are time expressions, and the possessive night-forms
 * «سحرها/سحرهم/سحرنا» (the «سحرها ونحرها» idiom — in Bukhari 4450 «سحرها» is anatomy).
 */
const NOT_SAHAR = /تسحر|أسحر|يستسحر|استسحر|سحراً|في السحر|من السحر إلى|بين سحر|سحرها|سحرهم|سحرنا/g;
/** The sura name «الأعراف» and the 'īna sale «العينة» stripped before matching — neither is a soothsayer or an evil eye. */
const NOT_MAGIC_WORD = /الأعراف|العينة/g;
/** Ruqayya the Prophet's daughter / a maidservant named Ruqayya — «رقية» followed by a name marker. */
const RUQAYYA_NAME = /رقية (مولاة|بنت|أمّ|أم |الخلفية|خادمة)/g;

/** Soothsaying, augury and astrology: the kahin and his craft, the soothsayer and his craft. */
const AR_KAHANA = /كاهن|كهنة|كهانة|كهان|عراف|عرافة|يتكهن|تكهن|متكهن|تنجيم|منجم(?!ة)|ضرب الرمل|الرمل والنجوم/;
/**
 * The lawful counter-incantation and its verbs: «الرقى»/«الرقية» (the incantations, definite),
 * «يرقي» (he performs ruqyah), «مرقية»/«المرقي» (the practitioner), and the guarded short
 * forms — «رقية» only word-initial (never inside «شرقية»), «ترقي» only word-initial and not
 * before «م» (never inside «مفترقين»/«ترقيم»/«يترقي»), «رقاه»/«رقينا»/«ارقي»/«أرقي» only
 * word-initial (never inside «سرقاهم»/«فارقي»). Bare «رقى» stays out: unvocalized it is also
 * "he ascended" (ترقى في السماء).
 */
const AR_RUQYAH_CORE = /الرقى|الرقية|المرقي|مرقية|يرقي|(?<![ء-ي])(?:رقية|ترقي(?!م)|رقاه|رقينا|ارقي|أرقي)/;
/** «استرقاء» in its two senses: seeking ruqyah and seeking enslavement — the slavery markers veto it. */
const AR_RUQYAH_ISTIRQA = /استرقاء|استرقوا|استرقى|يسترق|تسترقون|تسترقين|نسترق|أسترق|تسترقأ|يسترقون|يسترقين/;
const SLAVERY_CTX = /عبد|مكاتب|عتق|ولاء|سيد|أمة|رقبة|جارية|أرقاء|استرقاق|مفاداة|فداء|يفتدي/;
/** Envy: «حسد» and its forms are unambiguous; «حساد» is the plural. */
const AR_HASAD = /حسد|يحسد|حاسد|الحسد|حسود|تحاسد|حساد/;
/** The evil eye («العين») counts only beside its own collocations; fiqh eyes, springs and sales are stripped above. */
const AR_AYN_WEAK = /العين/;
const AR_AYN_CONTEXT =
  /حسد|زعل|شؤم|تصيب|مسحة|عقربا|بصاق|رقية|سترق|شفاء|دواء|أذى|يضر|مرض|مريض|ضرر|مكروه|هلاك|نفث|يسترق|تسترقي/;
const AR_AYN_STRONG = /العين حق|صاحب العين|ذو العين/;

/** English fields, per family: the museum's own translations name the craft plainly. */
const EN_SIHR = /\b(magic|magician|magicians|sorcerer|sorcerers|sorcery)\b/i;
const EN_KAHANA = /\b(soothsaying|soothsayer|soothsayers|kahin|kahina|augury|astrolog\w*)\b/i;
const EN_RUQYAH = /\bruqyah|ruqya\b/i;
const EN_HASAD = /\b(envy|envious|hasad)\b/i;
const EN_AYN = /\bevil eye\b/i;

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape hatch,
 * each verified by reading the passage:
 * - muwatta-15-1731: «تخرج سحرا» — she goes out at sahar (pre-dawn), not sorcery;
 * - bukhari-4450: «موته بين سحرها ونحرها» — "his death between her night and day";
 * - muwatta-1-062: «أعراقية» — "an Iraqi woman", substring noise, no magic at all;
 * - muwatta-6-1144: «رقية مولاة» — Ruqayya the maidservant's name, not an incantation;
 * - muwatta-4-824: «أن تسحر» — "that you stay up (pre-dawn) and fast";
 * - poem-muattaqat-zuhayr-09: «واستحرن بسحرة» — "they hastened at dawn" (سَحَر), not magicians.
 */
export const MAGIC_EXCLUDE = new Set([
  "passage/muwatta-15-1731",
  "passage/bukhari-4450",
  "passage/muwatta-1-062",
  "passage/muwatta-6-1144",
  "passage/muwatta-4-824",
  "passage/poem-muallaqat-zuhayr-09",
]);

/** The Arabic text a passage is judged on: matn, normalized search text, Arabic label and summary. */
const arabicOf = (n: Node): string =>
  [n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar]
    .filter(Boolean)
    .join(" ")
    .replace(NOT_SAHAR, "")
    .replace(NOT_MAGIC_WORD, "")
    .replace(RUQAYYA_NAME, "");
const englishOf = (n: Node): string =>
  [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");

/** The magic topic families a passage mentions, detected from its own text. */
export function magicTopicsOf(n: Node): MagicTopic[] {
  if (n.class !== "passage" || n.stub || MAGIC_EXCLUDE.has(n.id)) return [];
  const ar = arabicOf(n);
  const en = englishOf(n);
  const topics = new Set<MagicTopic>();
  const sihrWeak = AR_SIHR_WEAK.test(ar) && AR_MAGIC_CONTEXT.test(ar);
  if (AR_SIHR_STRONG.test(ar) || sihrWeak || EN_SIHR.test(en)) topics.add("sihr");
  if (AR_KAHANA.test(ar) || EN_KAHANA.test(en)) topics.add("kahana");
  if (AR_RUQYAH_CORE.test(ar) || (AR_RUQYAH_ISTIRQA.test(ar) && !SLAVERY_CTX.test(ar)) || EN_RUQYAH.test(en)) topics.add("ruqyah");
  if (AR_HASAD.test(ar) || EN_HASAD.test(en)) topics.add("hasad");
  if (AR_AYN_STRONG.test(ar) || (AR_AYN_WEAK.test(ar) && AR_AYN_CONTEXT.test(ar)) || EN_AYN.test(en)) topics.add("ayn");
  return [...topics];
}

/** True when the passage's own text mentions magic, a magician, soothsaying, ruqyah or the unseen harm. */
export function isMagicPassage(n: Node): boolean {
  return magicTopicsOf(n).length > 0;
}

/**
 * Which corpus a magic passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function magicCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): MagicCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: the first `magic-<section>` tag naming a real section, else `concepts`. */
export function magicTagSection(n: Node): MagicSection {
  for (const t of n.tags) {
    if (!t.startsWith("magic-") || t === MAGIC_TAG) continue;
    const id = t.slice(6);
    if ((MAGIC_SECTIONS as readonly string[]).includes(id)) return id as MagicSection;
  }
  return "concepts";
}

/** The topic chips of a curated record, from its `magic-<topic>` tags (section tags are not topics). */
export function magicTagTopics(n: Node): MagicTopic[] {
  return n.tags
    .filter((t) => t.startsWith("magic-") && t !== MAGIC_TAG)
    .map((t) => t.slice(6))
    .filter((t): t is MagicTopic => (MAGIC_TOPICS as readonly string[]).includes(t));
}
