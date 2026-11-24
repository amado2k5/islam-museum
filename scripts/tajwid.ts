// The Tajwid and Tilawah Browser's shared reads (docs/plan/76-tajwid-tilawah-browser.md): which
// passage records speak of tajwid — articulating each letter from its makhraj with its sifat — and
// tilawah — the recitation of the Qur'an, its measured pace (tartil, tahzir, tadwir, hadr), its
// etiquette (isti'adha, listening, prostration on tilawa), its melodies (maqamat), its rules
// (mudud, ghunna, qalqala, waqf wa-ibtida') — and the qurra' who teach it, and which corpus or
// curated section each belongs to. Detection runs at build time over the compiled graph, so a
// mention in any harvested book — and in every book harvested later — appears without a tagging
// step. Curated records join through the `tajwid-browser` tag and one `tajwid-<section>` tag;
// topics ride on `tajwid-<topic>` tags and on the lexicon's detected families.
//
// Two detection paths, because the two kinds of text need different care (the qiraat model):
//  1. The Qur'an: an explicit, reviewed table of verses (TAJWID_QURAN_REFS). The verse text is
//     frozen and never searched by vocabulary: a verse is in the browser because a person decided
//     it speaks of recitation and its measure, the etiquette of the one who recites or hears it,
//     or the teaching of the Book.
//  2. Every other passage (hadith, seerah, tafsir, Qur'anic sciences, history, biography):
//     a guarded lexicon over the passage's own text, search text, label and summary, folded
//     (vowel marks dropped, alef forms joined). Bare common words never match alone: «تلاوة» is
//     any reading, «قراءة» the reading in prayer, «مقام» a station or a place, «مخرج» any exit.
//     The lexicon uses phrases and names that carry the topic.
// TAJWID_EXCLUDE is the curated escape hatch for verified false positives; a passage can also
// join with a `tajwid-browser` tag when its wording carries no lexicon word.
//
// Scope against the Qira'at Browser (/qiraat/): that browser covers which readings exist, how
// the codices are spelled and which script the text is written in; this one covers how the
// letters are pronounced — makharij and sifat — and how the recitation is performed, taught
// and heard. A record may belong to both.
import type { Node } from "./build-graph.js";

export const TAJWID_TAG = "tajwid-browser";

/** Page sections: the five passage corpora, then the curated records by what they are. */
export const TAJWID_SECTIONS = ["quran", "sunnah", "seerah", "tafsir", "books", "ahkam", "adab", "taalim", "qurra", "mutun", "maqamat"] as const;
export type TajwidSection = (typeof TAJWID_SECTIONS)[number];
export type TajwidCorpus = "quran" | "sunnah" | "seerah" | "tafsir" | "books";

/** Topic chips carried by a record: detected families on passages, `tajwid-<topic>` tags on curated records. */
export const TAJWID_TOPICS = ["tartil", "adab", "ahkam", "qurra", "mutun", "maqamat", "taalim"] as const;
export type TajwidTopic = (typeof TAJWID_TOPICS)[number];

/**
 * [sura, first aya, last aya, topics] — every row read against the verse and the books of tajwid
 * and tilawa. The comment names why the verse is here; the page never states a ruling the comment
 * does not. Groups: the measure of recitation (tartil), the etiquette of reciting and hearing
 * (adab), and the recitation taught and heard (taalim).
 */
export const TAJWID_QURAN_REFS: ReadonlyArray<readonly [number, number, number, readonly TajwidTopic[]]> = [
  // — the measure of recitation: tartil, following the recitation, not hurrying the tongue
  [73, 4, 4, ["tartil"]], // «ورتل القرآن ترتيلا»
  [73, 20, 20, ["tartil"]], // «فاقرءوا ما تيسر من القرآن»
  [25, 32, 32, ["tartil"]], // «وقلناه ترتيلا» — «ورتلناه ترتيلا»
  [17, 106, 106, ["tartil"]], // «وقرآنا فرقناه لتقرأه على الناس على مكث»
  [2, 121, 121, ["tartil"]], // «يتلونه حق تلاوته»
  [75, 16, 19, ["tartil"]], // «لا تحرك به لسانك» — «إن علينا جمعه وقرآنه» — «فاتبع قرآنه»
  [87, 6, 6, ["tartil"]], // «سنقرئك فلا تنسى»
  [20, 114, 114, ["tartil"]], // «ولا تعجل بالقرآن من قبل أن يقضى إليك وحيه»
  // — the etiquette of the one who recites and the one who hears
  [16, 98, 98, ["adab"]], // seeking refuge before reciting
  [7, 204, 204, ["adab"]], // «وإذا قرئ القرآن فاستمعوا له وأنصتوا»
  [84, 21, 21, ["adab"]], // «وإذا قرئ عليهم القرآن لا يسجدون»
  [17, 78, 78, ["adab"]], // «وقرآن الفجر إن قرآن الفجر كان مشهودا» — the audible reading
  [32, 15, 15, ["adab"]], // «إذا تتلى عليهم آياتنا خروا سجدا»
  [19, 58, 58, ["adab"]], // «إذا تتلى عليهم آيات الرحمن خروا سجدا وبكيا»
  [17, 107, 108, ["adab"]], // «إذا يتلى عليهم يخرون للأذقان سجدا… ويزيدهم خشوعا»
  [17, 46, 46, ["adab"]], // «وإذا قرأت القرآن جعلنا بينك وبين الذين لا يؤمنون حجابا مستورا»
  [41, 26, 26, ["adab"]], // «لا تسمعوا للقرآن والغوا فيه» — the disbelievers' counsel against hearing it
  [46, 29, 32, ["adab"]], // the jinn listening to the recitation: «يستمعون القرآن… قالوا أنصتوا»
  [72, 1, 1, ["adab"]], // «استمع نفر من الجن»
  [8, 31, 31, ["adab"]], // «وإذا تتلى عليهم آياتنا قالوا قد سمعنا»
  [22, 72, 72, ["adab"]], // «وإذا تتلى عليهم آياتنا بينات تعرف في وجوه الذين كفروا»
  [68, 15, 15, ["adab"]], // «إذا تتلى عليه آياتنا قال أساطير الأولين»
  [83, 13, 13, ["adab"]], // the same answer to the recited verses
  [31, 7, 7, ["adab"]], // «وإذا تتلى عليه آياتنا ولى مستكبرا»
  // — the recitation taught and heard: the Prophet recites, the believers recite, tilawa as a sign
  [96, 1, 5, ["taalim"]], // «اقرأ باسم ربك» — the first command and the pen
  [62, 2, 2, ["taalim"]], // «يتلو عليهم آياته ويزكيهم ويعلمهم الكتاب»
  [3, 164, 164, ["taalim"]], // «يتلو عليهم آياته»
  [2, 151, 151, ["taalim"]], // «يتلو عليكم آياتنا ويعلمكم الكتاب»
  [35, 29, 32, ["taalim"]], // «إن الذين يتلون كتاب الله»
  [3, 113, 113, ["taalim"]], // «يتلون آيات الله آناء الليل وهم يسجدون»
  [13, 30, 30, ["taalim"]], // «لتتلو عليهم الذي أوحينا إليك»
  [10, 15, 16, ["taalim"]], // «وإذا تتلى عليهم آياتنا بينات… وما كنت أتلوه عليكم»
  [27, 92, 92, ["taalim"]], // «وأن أتلو القرآن»
  [18, 27, 27, ["taalim"]], // «واتل ما أوحي إليك من كتاب ربك»
  [5, 27, 27, ["taalim"]], // «واتل عليهم نبأ ابني آدم»
  [28, 3, 3, ["taalim"]], // «نتلو عليك من نبأ موسى وفرعون بالحق»
  [45, 6, 6, ["taalim"]], // «تلك آيات الله نتلوها عليك بالحق»
  [29, 48, 48, ["taalim"]], // «وما كنت تتلو من قبله من كتاب»
  [29, 51, 51, ["taalim"]], // «أنزلنا عليك الكتاب يتلى عليهم»
  [33, 34, 34, ["taalim"]], // «واذكرن ما يتلى في بيوتكن من آيات الله»
  [2, 44, 44, ["taalim"]], // «وأنتم تتلون الكتاب»
];

/** Topic families of a Qur'an verse from the reviewed table. */
export function tajwidQuranTopics(sura: unknown, aya: unknown): TajwidTopic[] {
  const s = Number(sura), a = Number(aya);
  if (!s || !a) return [];
  const out = new Set<TajwidTopic>();
  for (const [rs, from, to, topics] of TAJWID_QURAN_REFS) if (rs === s && a >= from && a <= to) for (const t of topics) out.add(t);
  return [...out];
}

/** One spelling for matching: vowel marks, Qur'anic marks and tatweel dropped, alef forms joined, final ya and ta marbuta folded. */
export const tajwidFold = (s: string): string =>
  s.normalize("NFC").replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ");

// ---------- lexicon for everything that is not the Qur'an, written in the folded spelling
// A bare word is closed with (?![ء-ي]) where a longer common word begins with it.
/** The measured recitation and its paces. */
const AR_TARTIL = /التجويد|تجويد القران|تجويدا|احكام التلاوه|احكام التجويد|علم التجويد|التلاوه(?![ء-ي])|تلاوه القران|يتلو القران|يتلون القران|يتلوه حق تلاوته|حق تلاوته|الترتيل|رتل القران|ترتيلا|بالترتيل|التحزير|التدوير|الحدر(?![ء-ي])|الترسل|بترتيل|قراءه مرتله|يقرءه ترتيلا|قراءه ترتيل|كان يقرا ترتيلا|مرتلا|اجود قراءته|يحسن القران|يحسنون القران|احسن القران|احسن قراءته|تجويد قراءته/;
/** The etiquette of reciting and hearing. */
const AR_ADAB = /الاستعاذه(?![ء-ي])|اعوذ بالله من الشيطان|اعوذ بالله ثم اقرا|اذا قرات القران فاستعذ|فاستمعوا له|استمعوا للقران|واذا قرء القران|اذا قرا عليه القران|استمع القران|ليس منا من لم يتغن|يتغني بالقران|يتغني بالقران|يترنم بالقران|ترنم بالقران|زينوا القران باصواتكم|حسنوا القران باصواتكم|اجهروا بقرانكم|اقرءوا باصواتكم|حسن الصوت بالقران|اجملوا القران باصواتكم|زينوا القران|اجملوا بالقران|الجهار بالقران|يجهر بالقران|قرا جهرا|يقرا جهرا|قران الفجر|افحشوا بالقران|لا يمسه الا المطهرون|مس المصحف|سجدات التلاوه|سجده التلاوه|سجد التلاوه|ختم القران|ختمه القران|دعاء ختم القران|قراءه القران في الصلاه|يقرا في صلاته|يقرا به في الصلاه|قراءه في الركعتين|تطويل القراءه|يطيل القراءه|يخفف القراءه|يبكي عند قراءه|يبكي اذا قرا|اذا تلي عليه|اذا قرء عليه|اصغوا للقران|انصتوا للقران/;
/** The rules: makharij, sifat, the letters' qualities, mudud, ghunna, qalqala, tafkhim, the nun and mim rules, waqf. */
const AR_AHKAM = /مخارج الحروف|مخرج الحروف|مخارج الحرف|مخرج الحرف|صفات الحروف|صفه الحروف|صفات الحرف|المدود(?![ء-ي])|الغنه(?![ء-ي])|الغنات|بالغنه|القلقله|قلقله|التفخيم|الترقيق|يفخم|يفخمون|يرقق|يرققون|الادغام|ادغام|الاخفاء|اخفاء|الاظهار|اظهار|الاقلاب|اقلاب|المد المنفصل|المد المتصل|مد العارض|مد اللين|مد البدل|المد الطبيعي|المد الفرعي|المد الاصلي|المد اللازم|مد الجائز|مد الوقف|تسهيل الهمزه|ابدال الهمزه|تحقيق الهمزه|نون ساكنه|النون الساكنه|احكام النون|ميم ساكنه|الميم الساكنه|احكام الميم|تنوين|التنوين|شده(?![ء-ي])|الشدات|لفظ الجلاله|الروم|الاشمام|صلة هاء|صلة ميم|الوقف والابتدا|الوقف والوصل|علامات الوقف|وقف تام|وقف حسن|وقف قبيح|وقف كاف|الابتداء(?![ء-ي])|السكت(?![ء-ي])|سكته(?![ء-ي])|همس الجلاله|الفرش(?![ء-ي])|المدلق|الاماله|اماله|الترخيم|التقليل|التوسط بين|الازهر|الفتح والاماله|الحروف المستعليه|الحروف المستفله|الاستعلاء|الاستفال|الجهر والهمس|الشده والرخاوه|بين بين/;
/** The reciters: the class, the named imams and teachers, the teaching office. */
const AR_QURRA = /القراء(?![ء-ي])|القرا(?![ء-ي])|قارئ(?![ء-ي])|القراء السبعه|القراء العشره|ائمه القراءه|امام القراء|شيخ القراء|سيد القراء|شيخ الاقراء|مشيخه الاقراء|تصدر للاقراء|مصحف معلم|مقرئ(?![ء-ي])|المقرئه|قارئه(?![ء-ي])|طبقات القراء|خذوا القران من اربعه|استقرئوا القران من اربعه|اقرؤهم ابي|اقرؤكم ابي|اقرؤهم لكتاب الله|نافع بن ابي نعيم|عاصم بن ابي النجود|عاصم بن بهدله|حمزه الزيات|حمزه بن حبيب|ابو عمرو بن العلاء|ابي عمرو بن العلاء|ابن عامر اليحصبي|ابن كثير المكي|ابي بكر بن كثير|يعقوب الحضرمي|ابو جعفر القارئ|خلف البزار|حفص بن سليمان|ورش|قالون|ابن ذكوان|الدوري|السوسي|ابن محيصن|ابن الجزري|الشاطبي|الداني|ابن مجاهد|السجاوندي|الجعبري|مذهب الجمهور من القراء|اختيار ابي عبيد/;
/** The teaching texts of the discipline. */
const AR_MUTUN = /الجزريه|الموقد|المقدمه الجزريه|متن الجزريه|تحفه الاطفال|الشاطبيه|حرز الاماني|وجه التهاني|طيبه النشر|الدرة اللوامع|سلم الوصول|المنار الهدي|النشر في القراءات|التيسير في القراءات|المقنع|كتاب الضبط|تاج التجويد|البرهان في تجويد|غايه المراد|تحفه ذوي الرشاد|المنثور في القراءات|جمع الوسايل|عقيده اهالي?|التمهيد في علم التجويد|التمهيد في القراءات|الكافي في القراءات|الكامل في القراءات|الشامل في القراءات|الوسيط في القراءات|السراج الوهاج|العنوان في ام القراءات/;
/** The melodies: the maqamat and the adorned voice, a debated art (each view under its holder). */
const AR_MAQAMAT = /المقامات|مقامات القراءه|قراءه بالحان|بالحان(?![ء-ي])|الحان القران|تلحين القران|اللحن في القران|النغم(?![ء-ي])|النغمات|مقام الصبا|مقام الراست|مقام البياتي|مقام النهاوند|مقام الحجاز|مقام السيكاه|مقام الكرد|مقام العجم|المقام(?![ء-ي])|تطرب في القران|اطرب في القران|يحسن صوته بالقران|احسن الناس قراءه|احسن قراءه|حلاوه الصوت|حسن النغمه|تطريب القران/;
/** The teaching and learning of the recitation. */
const AR_TAALIM = /تعلم القران|تعليم القران|علم القران|علمه القران|علمني القران|اقراني|اقرانيها|اقرئوا|اتقوا القران|اتقوا(?![ء-ي])|خيركم من تعلم القران|خيركم من تعلم|استقرئوا|حلق القران|حلقه القران|مجالس القران|الكتاتيب|الكتتاب|معلم القران|معلمه القران|تحفيظ القران|حفظ القران|حفاظ القران|حمله القران|يقرا عليه فيقرا|عرض عليه القران|يعارضه القران|يعرض القران|العرضه الاخيره|يقرا بالكتاب|انزل علي سوره|يقرئه|كان يقرئه|تلا عليه|يتلو عليه|تلاها عليه|اقراها|اقرأها عليه|يتعلم قراءه|يتعلمون القران|يقرا القران|يقرءون القران|قراءه الولدان|اطفال يقرءون|يفقهون قراءه|قراءه الصبيان/;

/** English fields: the museum's own translations name these plainly. */
const EN_TARTIL = /\b(tajwid|tajweed|tartil|tarteel|tilawa|tilawah|rules of recitation|measured recitation|reciting (the )?Qur'an|recitation of the Qur'an)\b/i;
const EN_ADAB = /\b(isti'adha|isti'aadha|seeking refuge before|etiquette of (recitation|reading)|listening to the Qur'an|sujud (al[- ])?tilawa|prostration of recitation|beautif\w+ (your |the )?(voice|recitation)|recite aloud|khatm|complet\w+ (of|a reading of) the Qur'an)\b/i;
const EN_AHKAM = /\b(makhraj|makharij|articulation point\w*|point\w* of articulation|sifat (al[- ])?huruf|ghunna|madd|mudud|qalqala|tafkhim|tarqiq|idgham|ikhfa|iqlab|izhar|i?zhar|nun (sakinah|sakina)|mim (sakinah|sakina)|tanw\w+|waqf|ibtida'?|stopping rule\w*|imala|tashk\w*)\b/i;
const EN_QURRA = /\b(qurra'?|qari'?|reciter\w*|seven readers|ten readers|Qur'an[- ]readers?|imam\w* of (the )?read\w*|teacher of recitation|Ibn al-Jazari|al-Shatibi|al-Dani|Nafi'|Hafs|Warsh|Qalun|tabaqat al-qurra)\b/i;
const EN_MUTUN = /\b(al-Jazariyya|Jazariyyah|Tuhfat al-Atfal|al-Shatibiyya|Shatibiyyah|Hirz al-Amani|Tayyibat al-Nashr|al-Taysir|al-Muqni'|matn of tajwid|tajwid poem)\b/i;
const EN_MAQAMAT = /\b(maqam(at)?|maqamat|melodic mode\w*|melod\w+ (of|in) recitation|beautif\w+ voice\w* (with|for) the Qur'an|singing the Qur'an)\b/i;
const EN_TAALIM = /\b(teach\w* (the )?Qur'an|learn\w* (the )?Qur'an|memori[sz]\w* (the )?Qur'an|hifz|quran school\w*|katatib|kuttab|recite(d)? (it )?to him)\b/i;

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape hatch, each
 * verified by reading the passage; empty until an audit flags one.
 */
export const TAJWID_EXCLUDE = new Set<string>([]);

/** The Arabic text a passage is judged on, folded: matn, normalized search text, Arabic label and summary. */
const arabicOf = (n: Node): string =>
  tajwidFold([n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar].filter(Boolean).join(" "));
const englishOf = (n: Node): string =>
  [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");

/** Per-topic lexicon for non-Qur'an passages: the Arabic patterns first, then the English ones. */
const LEXICON: Record<TajwidTopic, RegExp[]> = {
  tartil: [AR_TARTIL, EN_TARTIL],
  adab: [AR_ADAB, EN_ADAB],
  ahkam: [AR_AHKAM, EN_AHKAM],
  qurra: [AR_QURRA, EN_QURRA],
  mutun: [AR_MUTUN, EN_MUTUN],
  maqamat: [AR_MAQAMAT, EN_MAQAMAT],
  taalim: [AR_TAALIM, EN_TAALIM],
};

/** The words that made a text match, per topic. `ar` must already be folded with tajwidFold. */
export function tajwidMatchesOfText(ar: string, en = ""): Partial<Record<TajwidTopic, string[]>> {
  const out: Partial<Record<TajwidTopic, string[]>> = {};
  for (const t of TAJWID_TOPICS) {
    const hits: string[] = [];
    for (const re of LEXICON[t]) {
      const m = (re.source.includes("\\b") ? en : ar).match(re);
      if (m) hits.push(m[0]);
    }
    if (hits.length) out[t] = hits;
  }
  return out;
}

/**
 * Detected topics of a passage. A Qur'an ayah answers from the reviewed table; every other
 * passage answers the lexicon's topics.
 */
export function tajwidTopicsOf(n: Node): TajwidTopic[] {
  if (n.class !== "passage" || n.stub || TAJWID_EXCLUDE.has(n.id)) return [];
  if (n.data.work === "work/quran") {
    if (n.data.unit !== "ayah") return [];
    return tajwidQuranTopics(n.data.sura, n.data.aya);
  }
  return Object.keys(tajwidMatchesOfText(arabicOf(n), englishOf(n))) as TajwidTopic[];
}

/** True when the passage speaks of tajwid or tilawah: a tabled Qur'an verse or a lexicon hit. */
export function isTajwidPassage(n: Node): boolean {
  return tajwidTopicsOf(n).length > 0;
}

/** The curated `tajwid-<topic>` tags a record carries. */
export function tajwidTagTopics(n: Node): TajwidTopic[] {
  return n.tags
    .filter((t) => t.startsWith("tajwid-") && (TAJWID_TOPICS as readonly string[]).includes(t.slice(7)))
    .map((t) => t.slice(7) as TajwidTopic);
}

/**
 * Which corpus a tajwid passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), the
 * commentaries (genre `tafsir`), and every other harvested work. A work harvested later lands in
 * the right section by its genre the day its passages arrive.
 */
export function tajwidCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): TajwidCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("tafsir")) return "tafsir";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section of a curated record: its `tajwid-<section>` tag when listed, else `ahkam`. */
export function tajwidTagSection(n: Node): TajwidSection {
  const tag = n.tags.find((t) => t.startsWith("tajwid-") && (TAJWID_SECTIONS as readonly string[]).includes(t.slice(7)));
  return (tag?.slice(7) as TajwidSection) ?? "ahkam";
}
