// The Qira'at, Rasm, Scripts and Dotting Browser's shared reads (docs/plan/60-qiraat-browser.md):
// which passage records speak of the readings of the Qur'an (qira'at) and the seven ahruf, the
// readers, the collection and the codices (masahif), the orthography of the mushaf (rasm), its
// dotting and vowel marks (naqt, i'jam, shakl, dabt) and the scripts it was written in (khatt) —
// and which corpus section each belongs to. Detection runs at build time over the compiled
// graph, so a mention in any harvested book — and in every book harvested later — appears
// without a tagging step. Curated records join through the `qiraat-browser` tag.
//
// Two detection paths, because the two kinds of text need different care:
//  1. The Qur'an: an explicit, reviewed table of verses (QIRAAT_QURAN_REFS). The verse text is
//     frozen and never searched by vocabulary: a verse is in the browser because a person decided
//     it speaks of recitation, the written Book and the pen, or because the canonical readers or
//     the codices of the garrison cities are recorded as differing in it.
//  2. Every other passage (hadith, seerah, tafsir, Qur'anic sciences, history, biography):
//     a guarded lexicon over the passage's own text, search text, label and summary, folded
//     (vowel marks dropped, alef forms joined). Bare common words never match alone: «القراءة»
//     is also the recitation in prayer, «الخط» a line drawn in the sand, «النقط» any dots,
//     «الحرف» any letter or edge. The lexicon uses phrases and names that carry the topic.
// QIRAAT_EXCLUDE is the curated escape hatch for verified false positives; a passage can also
// join with a `qiraat-browser` tag when its wording carries no lexicon word.
import type { Node } from "./build-graph.js";

export const QIRAAT_TAG = "qiraat-browser";
/** Page sections: the four passage corpora, then the curated records by what they are. */
export const QIRAAT_SECTIONS = ["quran", "sunnah", "seerah", "books", "sciences", "people", "scripts", "works", "mushafs"] as const;
export type QiraatSection = (typeof QIRAAT_SECTIONS)[number];
export type QiraatCorpus = "quran" | "sunnah" | "seerah" | "books";

/** Topic chips carried by a record: detected families on passages, `qiraat-<topic>` tags on curated records. */
export const QIRAAT_TOPICS = ["ahruf", "readings", "readers", "codex", "rasm", "naqt", "khatt"] as const;
export type QiraatTopic = (typeof QIRAAT_TOPICS)[number];

/**
 * [sura, first aya, last aya, topics] — every row read against the verse and the classical books of the
 * readings (Ibn Mujahid's al-Sab'a, al-Dani's al-Taysir and al-Muqni', Ibn al-Jazari's al-Nashr).
 * The comment names why the verse is here; the page never states a reading the comment does not.
 */
export const QIRAAT_QURAN_REFS: ReadonlyArray<readonly [number, number, number, readonly QiraatTopic[]]> = [
  // — recitation: the command to read, tartil, the teaching of the reading
  [96, 1, 5, ["readings", "khatt"]], // «اقرأ»… «الذي علم بالقلم»
  [73, 4, 4, ["readings"]], // «ورتل القرآن ترتيلا»
  [73, 20, 20, ["readings"]], // «فاقرءوا ما تيسر من القرآن»
  [25, 32, 32, ["readings"]], // «ورتلناه ترتيلا»
  [17, 106, 106, ["readings"]], // «لتقرأه على الناس على مكث»
  [75, 16, 19, ["readings", "codex"]], // «إن علينا جمعه وقرآنه»
  [87, 6, 6, ["readings"]], // «سنقرئك فلا تنسى»
  [20, 114, 114, ["readings"]], // «ولا تعجل بالقرآن من قبل أن يقضى إليك وحيه»
  [16, 98, 98, ["readings"]], // seeking refuge before reading
  [7, 204, 204, ["readings"]], // «وإذا قرئ القرآن فاستمعوا له»
  [84, 21, 21, ["readings"]],
  [2, 121, 121, ["readings"]], // «يتلونه حق تلاوته»
  [35, 29, 29, ["readings"]],
  [17, 78, 78, ["readings"]], // «وقرآن الفجر»
  [27, 92, 92, ["readings"]],
  // — the tongue of the revelation and its easing: the verses the chapters on the seven ahruf open with
  [12, 2, 2, ["ahruf"]], // «قرآنا عربيا»
  [26, 192, 195, ["ahruf"]], // «بلسان عربي مبين»
  [16, 103, 103, ["ahruf"]],
  [14, 4, 4, ["ahruf"]], // «بلسان قومه»
  [41, 44, 44, ["ahruf"]],
  [19, 97, 97, ["ahruf"]], // «فإنما يسرناه بلسانك»
  [44, 58, 58, ["ahruf"]],
  [54, 17, 17, ["ahruf"]], // «ولقد يسرنا القرآن للذكر»
  [25, 1, 1, ["ahruf"]], // the sura 'Umar heard Hisham ibn Hakim read, in the report of the seven ahruf
  // — the Book kept and written: its preservation, the pages, the scribes
  [15, 9, 9, ["codex"]], // «وإنا له لحافظون»
  [41, 41, 42, ["codex"]],
  [80, 11, 16, ["codex", "khatt"]], // «في صحف مكرمة… بأيدي سفرة»
  [98, 2, 3, ["codex"]], // «صحفا مطهرة فيها كتب قيمة»
  [56, 77, 80, ["codex"]], // «في كتاب مكنون لا يمسه إلا المطهرون»
  [85, 21, 22, ["codex"]],
  [25, 5, 5, ["codex", "khatt"]], // «اكتتبها فهي تملى عليه»
  [29, 48, 48, ["codex", "khatt"]], // «ولا تخطه بيمينك»
  [9, 128, 129, ["codex"]], // the two verses found with Abu Khuzayma in the first collection (al-Bukhari)
  [33, 23, 23, ["codex"]], // the verse found with Khuzayma ibn Thabit when the codices were copied (al-Bukhari)
  // — the pen, the ink, the page and the act of writing
  [68, 1, 1, ["khatt"]], // «ن والقلم وما يسطرون»
  [31, 27, 27, ["khatt"]], // «من شجرة أقلام»
  [18, 109, 109, ["khatt"]], // «مدادا لكلمات ربي»
  [52, 1, 3, ["khatt"]], // «وكتاب مسطور في رق منشور»
  [6, 7, 7, ["khatt"]], // «كتابا في قرطاس»
  [6, 91, 91, ["khatt", "codex"]], // «تجعلونه قراطيس»
  [2, 282, 282, ["khatt"]], // «وليكتب بينكم كاتب بالعدل»
  [2, 79, 79, ["khatt"]], // «يكتبون الكتاب بأيديهم»
  [21, 104, 104, ["khatt"]], // «كطي السجل للكتب»
  [83, 9, 9, ["khatt"]], // «كتاب مرقوم»
  [83, 20, 20, ["khatt"]],
  [7, 145, 145, ["khatt"]], // «وكتبنا له في الألواح»
  // — verses the Companions' codices and readings are reported to differ in (hadith collections)
  [2, 238, 238, ["readings", "codex"]], // the codices of 'A'isha and Hafsa (the Muwatta)
  [2, 198, 198, ["readings"]], // Ibn 'Abbas's reading with «في مواسم الحج» (al-Bukhari)
  [5, 89, 89, ["readings"]], // Ibn Mas'ud's «متتابعات»
  [62, 9, 9, ["readings"]], // 'Umar's and Ibn Mas'ud's «فامضوا»
  [92, 3, 3, ["readings"]], // Ibn Mas'ud's and Abu al-Darda's reading (al-Bukhari)
  // — verses the codices of the cities differ in by a letter or a word (al-Dani, al-Muqni'), each read as its codex is written
  [2, 116, 116, ["readings", "rasm"]],
  [2, 132, 132, ["readings", "rasm"]],
  [3, 133, 133, ["readings", "rasm"]],
  [5, 54, 54, ["readings", "rasm"]],
  [9, 100, 100, ["readings", "rasm"]],
  [18, 36, 36, ["readings", "rasm"]],
  [26, 217, 217, ["readings", "rasm"]],
  [36, 35, 35, ["readings", "rasm"]],
  [40, 26, 26, ["readings", "rasm"]],
  [42, 30, 30, ["readings", "rasm"]],
  [43, 71, 71, ["readings", "rasm"]],
  [46, 15, 15, ["readings", "rasm"]],
  [55, 78, 78, ["readings", "rasm"]],
  [57, 24, 24, ["readings", "rasm"]],
  [91, 15, 15, ["readings", "rasm"]],
  // — verses the readers differ in on one written skeleton: by the dots of a letter
  [2, 259, 259, ["readings", "naqt"]], // «ننشزها» / «ننشرها»
  [4, 94, 94, ["readings", "naqt"]], // «فتبينوا» / «فتثبتوا»
  [49, 6, 6, ["readings", "naqt"]],
  [6, 57, 57, ["readings", "naqt"]], // «يقص» / «يقض»
  [10, 30, 30, ["readings", "naqt"]], // «تبلو» / «تتلو»
  [7, 57, 57, ["readings", "naqt"]], // «بشرا» / «نشرا»
  // — and by the vowels and doubling of a word
  [1, 4, 4, ["readings"]], // «مالك» / «ملك»
  [2, 106, 106, ["readings"]],
  [2, 222, 222, ["readings"]], // «يطهرن» / «يطّهّرن»
  [3, 146, 146, ["readings"]], // «قاتل» / «قتل»
  [5, 6, 6, ["readings"]], // «وأرجلكم» by nasb and by jarr
  [12, 110, 110, ["readings"]], // «كذبوا» light and doubled
  [21, 4, 4, ["readings"]], // «قال» / «قل»
  [43, 19, 19, ["readings"]], // «عباد» / «عند»
];

/** Topic families of a Qur'an verse from the reviewed table. */
export function qiraatQuranTopics(sura: unknown, aya: unknown): QiraatTopic[] {
  const s = Number(sura), a = Number(aya);
  if (!s || !a) return [];
  const out = new Set<QiraatTopic>();
  for (const [rs, from, to, topics] of QIRAAT_QURAN_REFS) if (rs === s && a >= from && a <= to) for (const t of topics) out.add(t);
  return [...out];
}

/** One spelling for matching: vowel marks, Qur'anic marks and tatweel dropped, alef forms joined, final ya and ta marbuta folded. */
export const qiraatFold = (s: string): string =>
  s.normalize("NFC").replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ");

// ---------- lexicon for everything that is not the Qur'an, written in the folded spelling
/** The seven ahruf. */
// A bare word is closed with (?![ء-ي]) where a longer common word begins with it: «القراء» / «القراءة», «الخط» / «الخطبة».
const AR_AHRUF = /سبعه احرف|السبعه الاحرف|الاحرف السبعه|علي حرف واحد|علي حرفين|اقراني جبريل علي حرف|انزل القران علي سبع|نزل القران علي سبع|انزل علي سبعه/;
/** The readings as a science and as reports: named readings, the Companions' readings, how a word is read. */
const AR_READINGS = /القراءات|القراات|علم القراءه|القراءه سنه|قراءه شاذه|القراءه الشاذه|الشواذ من القراء|قراءه العامه|قراءه الجمهور|في قراءه (?:ابن مسعود|عبد الله|ابي بن كعب|ابي|ابن عباس|عائشه|حفصه|علي|عمر|زيد|اهل)|في حرف (?:ابن مسعود|عبد الله|ابي)|قراءه (?:ابن مسعود|ابي بن كعب|ابن عباس|نافع|عاصم|حمزه|الكسائي|ابن كثير|ابي عمرو|ابن عامر|حفص|ورش|اهل المدينه|اهل الكوفه|اهل البصره|اهل مكه|اهل الشام|اهل الحجاز)|قرا (?:نافع|عاصم|حمزه|الكسائي|ابن كثير|ابو عمرو|ابن عامر|حفص|ورش|قالون)|روايه حفص عن عاصم|روايه شعبه عن عاصم|روايه ورش|روايه قالون|روايه الدوري|هكذا اقراني|اقرانيها|اقراني رسول|هكذا انزلت|كذلك انزلت|العرضه الاخيره|يعارضني بالقران|يعارضه القران|يعرض القران|اختلف القراء(?![ء-ي])|اختلفت القراه|اختلفت القراء(?![ء-ي])|القراه(?![ء-ي])|كيف كانت قراءه (?:النبي|رسول)|كانت قراءته مدا|يقطع قراءته|التجويد|ترتيل القران/;
/** The readers: the class and the named imams. */
const AR_READERS = /القراء السبعه|القراء العشره|السبعه القراء|ائمه القراءه|ائمه القراء|شيخ القراء|امام القراء|سيد القراء|شيخ الاقراء|مشيخه الاقراء|تصدر للاقراء|القراء(?![ء-ي])|خذوا القران من اربعه|استقرئوا القران من اربعه|اقرؤهم ابي|اقرؤكم ابي|اقرؤهم لكتاب الله|نافع بن ابي نعيم|عاصم بن ابي النجود|عاصم بن بهدله|حمزه الزيات|حمزه بن حبيب|ابو عمرو بن العلاء|ابي عمرو بن العلاء|ابن عامر اليحصبي|ورش عن نافع|حفص عن عاصم|حفص بن سليمان|ابن مجاهد|ابن الجزري|الشاطبيه|يعقوب الحضرمي|ابو جعفر القارئ|ابي جعفر القارئ/;
/** The collection of the Qur'an and the codices. */
const AR_CODEX = /مصحف|مصاحف|جمع القران|جمع ابي بكر|الصحف التي|في الصحف(?![ء-ي])|بين اللوحين|بين الدفتين|العسب واللخاف|اللخاف|الرقاع والاكتاف|كتاب الوحي|كاتب الوحي|كتبه الوحي|يكتب الوحي|كتابه الوحي|اللوح والدواه|الكتف والدواه|بالكتف والدواه|بلسان قريش/;
/** The orthography of the mushaf. */
const AR_RASM = /رسم المصحف|رسم المصاحف|الرسم العثماني|رسم القران|مرسوم الخط(?![ء-ي])|مرسوم المصاحف|هجاء المصاحف|هجاء المصحف|خط المصحف|خط المصاحف|رسم الخط(?![ء-ي])|الرسم الاملائي|الرسم القياسي|الرسم الاصطلاحي|الرسم التوقيفي|المصحف الامام|مصاحف الامصار|مصاحف اهل (?:المدينه|الكوفه|البصره|مكه|الشام|العراق)|فاكتبوه بلسان|كتبت في المصحف|مكتوبه في المصحف|كتبوها في المصحف|بغير الف في المصحف|بحذف الالف|باثبات الالف|موافقه الرسم|موافقه المصحف|خالف المصحف|يخالف المصحف|خلاف المصحف/;
/** Dotting, vowel marks and the other marks of the mushaf. */
const AR_NAQT = /نقط المصحف|نقط المصاحف|تنقيط|النقط والشكل|الشكل والنقط|نقط الاعراب|نقط الاعجام|الاعجام(?![ء-ي])|شكل المصحف|شكل المصاحف|ضبط المصحف|ضبط المصاحف|علم الضبط|التعشير|تعشير المصاحف|الاخماس والاعشار|التخميس والتعشير|جردوا القران|جردوا المصاحف|تجريد المصحف|نقط ابي الاسود|نقطه فوق الحرف|فانقط(?![ء-ي])|ينقط المصحف|ينقط المصاحف|الحروف المعجمه|الحروف المهمله|نقط الحروف|النقط(?![ء-ي])/;
/** The scripts and the craft of writing. */
const AR_KHATT = /الخط الكوفي|القلم الكوفي|الخط العربي|الخط الحجازي|الخط المكي|الخط المدني|الخط المغربي|الخط الاندلسي|خط الثلث|قلم الثلث|خط النسخ|قلم النسخ|قلم المحقق|قلم الريحان|قلم الرقاع|قلم التوقيع|قلم الطومار|القلم الجليل|الاقلام السته|الاقلام السبعه|الخط المنسوب|الخطاط(?!يف)|الخطاطين|الخطاطون|حسن الخط(?![ء-ي])|جوده الخط(?![ء-ي])|تجويد الخط(?![ء-ي])|مليح الخط(?![ء-ي])|ابن مقله|ابن البواب|ياقوت المستعصمي|صناعه الخط(?![ء-ي])|صنعه الخط(?![ء-ي])|علم الخط(?![ء-ي])|صناعه الكتابه|الوراقين|الوراقون|كتاب المصاحف|كاتب المصاحف|يكتب المصاحف|كتابه المصاحف|كتابه المصحف/;

/** English fields: the museum's own translations name these plainly. */
const EN_AHRUF = /\b(seven (ahruf|modes|letters|harfs)|sab'at ahruf)\b/i;
const EN_READINGS = /\b(qira'?at|qira'a|canonical readings?|variant readings?|Qur'anic readings?|seven readings|ten readings|riwaya of (Hafs|Warsh|Qalun)|tajwid|tartil)\b/i;
const EN_READERS = /\b(seven readers|ten readers|Qur'an[- ]readers?|Qur'an reciters?|qurra')\b/i;
const EN_CODEX = /\b(mushafs?|masahif|codex|codices|collection of the Qur'an|compilation of the Qur'an|scribes? of (the )?revelation)\b/i;
const EN_RASM = /\b(rasm|'?Uthmanic (orthography|spelling|script)|orthography of the (mushaf|Qur'an))\b/i;
const EN_NAQT = /\b(diacritic\w*|vowel marks?|vowel points?|vocali[sz]ation|i'jam|dotting of|tashkil)\b/i;
const EN_KHATT = /\b(calligraph\w*|Kufic|Hijazi script|naskh script|thuluth|muhaqqaq|maghribi script|six pens|proportioned script)\b/i;

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape hatch, each
 * verified by reading the passage; empty until an audit flags one.
 */
export const QIRAAT_EXCLUDE = new Set<string>([]);

/** The Arabic text a passage is judged on, folded: matn, normalized search text, Arabic label and summary. */
const arabicOf = (n: Node): string =>
  qiraatFold([n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar].filter(Boolean).join(" "));
const englishOf = (n: Node): string =>
  [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");

/** Per-topic lexicon for non-Qur'an passages: the Arabic patterns first, then the English ones. */
const LEXICON: Record<QiraatTopic, RegExp[]> = {
  ahruf: [AR_AHRUF, EN_AHRUF],
  readings: [AR_READINGS, EN_READINGS],
  readers: [AR_READERS, EN_READERS],
  codex: [AR_CODEX, EN_CODEX],
  rasm: [AR_RASM, EN_RASM],
  naqt: [AR_NAQT, EN_NAQT],
  khatt: [AR_KHATT, EN_KHATT],
};

/** The words that made a text match, per topic. `ar` must already be folded with qiraatFold. */
export function qiraatMatchesOfText(ar: string, en = ""): Partial<Record<QiraatTopic, string[]>> {
  const out: Partial<Record<QiraatTopic, string[]>> = {};
  for (const t of QIRAAT_TOPICS) {
    const hits: string[] = [];
    for (const re of LEXICON[t]) {
      const m = (re.source.includes("\\b") ? en : ar).match(re);
      if (m) hits.push(m[0]);
    }
    if (hits.length) out[t] = hits;
  }
  return out;
}

/** The words that made a passage match, per topic (the audit prints them; the page never does). */
export function qiraatMatches(n: Node): Partial<Record<QiraatTopic, string[]>> {
  if (n.class !== "passage" || n.stub || n.data.work === "work/quran") return {};
  return qiraatMatchesOfText(arabicOf(n), englishOf(n));
}

/** The topic families a passage mentions. The Qur'an by the reviewed table, all else by the lexicon. */
export function qiraatTopicsOf(n: Node): QiraatTopic[] {
  if (n.class !== "passage" || n.stub || QIRAAT_EXCLUDE.has(n.id)) return [];
  if (n.data.work === "work/quran") return qiraatQuranTopics(n.data.sura, n.data.aya);
  return Object.keys(qiraatMatches(n)) as QiraatTopic[];
}

/** True when the passage's own text mentions the readings, the codex, its orthography, its dots or its scripts. */
export function isQiraatPassage(n: Node): boolean {
  return qiraatTopicsOf(n).length > 0;
}

/**
 * Which corpus a passage belongs to, from its work: the frozen Qur'an, the hadith collections
 * (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), and every other
 * harvested work. Works not yet harvested land in the right section by their genre the day
 * their passages arrive.
 */
export function qiraatCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): QiraatCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The curated sections a record may be filed under by tag. */
const CURATED: readonly QiraatSection[] = ["sciences", "people", "scripts", "works", "mushafs"];
/**
 * The section of a curated record: the first `qiraat-<section>` tag naming a curated section;
 * without one, by class — a person is filed under people, a work under works, an object under
 * mushafs, everything else under sciences.
 */
export function qiraatTagSection(n: Node): QiraatSection {
  for (const t of n.tags) {
    if (!t.startsWith("qiraat-") || t === QIRAAT_TAG) continue;
    const id = t.slice(7) as QiraatSection;
    if (CURATED.includes(id)) return id;
  }
  if (n.class === "person" || n.class === "group") return "people";
  if (n.class === "work") return "works";
  if (n.class === "object") return "mushafs";
  return "sciences";
}

/** The topic chips of a curated record, from its `qiraat-<topic>` tags (section tags are not topics). */
export function qiraatTagTopics(n: Node): QiraatTopic[] {
  return n.tags
    .filter((t) => t.startsWith("qiraat-") && t !== QIRAAT_TAG)
    .map((t) => t.slice(7))
    .filter((t): t is QiraatTopic => (QIRAAT_TOPICS as readonly string[]).includes(t));
}
