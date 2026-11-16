// The Pillars and Branches of Faith Browser's shared reads (docs/plan/61-arkan-browser.md):
// which passage records name or carry one of the four themes the founder asked for —
//  • «أركان الإسلام» (`islam`)  — the five acts Islam is built on: the two testimonies, the
//    prayer, the zakat, the fast of Ramadan and the pilgrimage to the House;
//  • «أركان الإيمان» (`iman`)   — the six articles of the hadith of Jibril: belief in God, His
//    angels, His books, His messengers, the Last Day and the decree, its good and its ill;
//  • «شُعَب الإيمان» (`shuab`)  — the "seventy-odd branches" of faith: every act, word or
//    state a text counts as part of faith («الحياء شعبة من الإيمان»، «لا يؤمن أحدكم حتى»،
//    «من كان يؤمن بالله واليوم الآخر فليكرم ضيفه»);
//  • «خِصَال المؤمن» (`khisal`) — the traits the texts give the believer («المؤمن للمؤمن
//    كالبنيان»، «ثلاث من كن فيه»، «مثل المؤمن», the "qad aflaha al-mu'minun" passages) —
// and which corpus section each belongs to. Detection runs at build time over the compiled
// graph, so a mention in any harvested book — and in every book harvested later — appears
// without any tagging step. Curated records join through the `arkan-browser` tag.
//
// Qur'an verses come from a reviewed table (ARKAN_QURAN), never from the lexicon: the Qur'an
// does not use the later terms «أركان» or «شعب الإيمان», so the verses listed are the ones
// the hadith collections and the commentaries tie to each theme (the testimony verses, the
// prayer-and-zakat pairs, the fasting and pilgrimage verses; 2:177, 2:285 and 4:136 for the
// articles of faith; the verses of faith increasing; the passages that describe the
// believers). Every other passage is read by the guarded lexicon below. Strong signals admit
// a passage; weak ones (a bare article of faith, «يزيد وينقص») count only beside a strong
// one or two at a time. Out of scope: «شعب» as mountain passes or the month Sha'ban, the
// pillars (arkan) of the prayer or of the Ka'ba, «آمن» as "safe", and the wider themes that
// have their own browsers (acts of worship one by one: Ibadat; virtues at large: Akhlaq).
import type { Node } from "./build-graph.js";

export const ARKAN_TAG = "arkan-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const ARKAN_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type ArkanSection = (typeof ARKAN_SECTIONS)[number];
export type ArkanCorpus = Exclude<ArkanSection, "curated">;
/** The four themes, in the order the founder named them. */
export const ARKAN_TOPICS = ["islam", "iman", "shuab", "khisal"] as const;
export type ArkanTopic = (typeof ARKAN_TOPICS)[number];
/** Curated records carry `arkan-<topic>` beside the browser tag. */
export const ARKAN_TOPIC_TAG = "arkan-";

/** Boundary characters around a token. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const BL = String.raw`(?:^|${B})`;
const ER = String.raw`(?=$|${B})`;
/** Arabic diacritics and tatweel stripped before matching. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;
/** Clitics before a noun or verb. */
const PRE = String.raw`(?:(?:ال)|[وبفلك]){0,3}`;
const W = String.raw`[ء-ي]`;

// ---------- أركان الإسلام ----------
const ISLAM_STRONG: [RegExp, string][] = [
  /** The term itself and its classical synonyms. */
  [new RegExp(`${BL}${PRE}(?:أركان|اركان|دعائم|مباني|قواعد) (?:ال)?(?:إسلام|اسلام)${ER}`), "arkan-al-islam"],
  [new RegExp(`${BL}${PRE}(?:أركان|اركان) الدين${ER}|${BL}${PRE}(?:الأركان|الاركان) الخمسة?${ER}`), "arkan-al-islam"],
  /** «بني الإسلام على خمس» (Bukhari 8, Muslim 16). */
  [new RegExp(`بني (?:ال)?(?:إسلام|اسلام) على`), "buniya"],
  /** The Jibril hadith's question and answer on Islam. */
  [new RegExp(`(?:ال)?(?:إسلام|اسلام) أن (?:تشهد|تعبد الله|تسلم)|(?:ما|عن) (?:ال)?(?:إسلام|اسلام)${B}{1,3}(?:ف)?قال`), "ma-al-islam"],
  /** The five named together: the prayer, the zakat and the fast or the pilgrimage in one breath. */
  [new RegExp(`(?:إقام|اقام|تقيم|تقيموا|يقيموا|يقيم|أقام|اقام|تقيمون|أقيموا|إقامة) (?:ال)?صلاة.{0,60}(?:إيتاء|ايتاء|تؤتي|تؤتوا|يؤتوا|يؤتي|آتى|تؤتون|تؤدي|أداء|اداء|آتوا) (?:ال)?زكاة.{0,160}(?:رمضان|${PRE}حج|تحج|يحج)`), "khams"],
  [new RegExp(`خمس صلوات.{0,240}(?:رمضان).{0,240}(?:زكاة|صدقة)|خمس صلوات.{0,240}(?:زكاة|صدقة).{0,240}(?:رمضان)`), "khams"],
  /** The testimony, the prayer and the zakat as the entry into Islam («أمرت أن أقاتل الناس»، the sending of Mu'adh). */
  [new RegExp(`(?:شهادة|يشهدوا|تشهد|يشهد|شهدوا|تشهدوا) أن لا (?:إله|اله) (?:إلا|الا) الله.{0,220}(?:ال)?صلاة.{0,160}(?:زكاة|صدقة)`), "shahada-salat-zakat"],
];

// ---------- أركان الإيمان ----------
const IMAN_STRONG: [RegExp, string][] = [
  [new RegExp(`${BL}${PRE}(?:أركان|اركان|أصول|اصول|دعائم|قواعد) (?:ال)?(?:إيمان|ايمان)${ER}`), "arkan-al-iman"],
  /** «أن تؤمن بالله وملائكته وكتبه ورسله» in every person and tense. */
  [new RegExp(`(?:تؤمن|يؤمن|آمن|نؤمن|يؤمنوا|تؤمنوا|آمنت|آمنا|أومن|اومن|(?:ال)?(?:إيمان|ايمان)) بالله وملا?ئكته`), "an-tumina"],
  /** Belief in the decree. */
  [new RegExp(`(?:تؤمن|يؤمن|آمن|نؤمن|يؤمنوا|تؤمنوا|آمنت|(?:ال)?(?:إيمان|ايمان)) بالقدر|بالقدر (?:كله )?خيره وشره|القدر خيره وشره`), "qadar"],
  /** The Jibril hadith's question on faith. */
  [new RegExp(`(?:ما|عن) (?:ال)?(?:إيمان|ايمان)${B}{1,3}(?:ف)?قال|ما (?:ال)?(?:إيمان|ايمان) بالله وحده`), "ma-al-iman"],
];
const IMAN_WEAK: [RegExp, string][] = [
  [new RegExp(`(?:ال)?(?:إيمان|ايمان) (?:بالملائكة|بالملا?ئكة)|(?:ال)?(?:إيمان|ايمان) بالكتب|(?:ال)?(?:إيمان|ايمان) بالرسل|(?:ال)?(?:إيمان|ايمان) بالبعث|(?:ال)?(?:إيمان|ايمان) باليوم الآخر|(?:ال)?(?:إيمان|ايمان) بالله`), "article"],
  [new RegExp(`(?:تؤمن|يؤمن|يؤمنون|آمن) بالبعث|(?:تؤمن|يؤمن) بالموت`), "bath"],
];

// ---------- شعب الإيمان ----------
/** Nouns that can stand before «من الإيمان» without naming a branch: «يخرج الرجل من الإيمان». */
const MIN_STOP = String.raw`(?!الرجل|العبد|المرء|الناس|القوم|الشيء|الخروج|البراءة|الذرة|القلب|العرب)`;
const SHUAB_STRONG: [RegExp, string][] = [
  [new RegExp(`(?<!(?:في|فى|كتاب|كتابه|الجامع|جامع) )(?<=^|${B})${PRE}شعب (?:ال)?(?:إيمان|ايمان)${ER}|شعبة من (?:شعب )?(?:ال)?(?:إيمان|ايمان)|شعب من (?:ال)?(?:إيمان|ايمان)`), "shuab"],
  /** «الإيمان بضع وسبعون شعبة» (Muslim 35), «بضع وستون» (Bukhari 9), «بابا» (Tirmidhi 2614). */
  [new RegExp(`بضعة? و(?:سبعون|ستون|سبعين|ستين).{0,12}(?:شعبة|بابا|باب)`), "bid-wa-sabun"],
  /** A named thing counted as part of faith: «الحياء من الإيمان»، «حسن العهد من الإيمان»، «من الإيمان أن». */
  [new RegExp(`${BL}[وف]?${MIN_STOP}(?:ال${W}{2,9}|حسن العهد|حب ${W}{2,9}|إماطة الأذى|اماطة الاذى) من (?:ال)?(?:إيمان|ايمان)${ER}|${BL}من (?:ال)?(?:إيمان|ايمان) أن${ER}`), "min-al-iman"],
  [new RegExp(`(?:حلاوة|طعم|عرى|آية|حقيقة|صريح|محض|أضعف|اضعف|شطر|نصف|أفضل|افضل|كمال|ذروة) (?:ال)?(?:إيمان|ايمان)${ER}|(?:استكمل|يستكمل|استكملوا)(?: ${W}{2,8})? (?:ال)?(?:إيمان|ايمان)|أي (?:ال)?(?:إيمان|ايمان|إسلام|اسلام) (?:أفضل|افضل|خير)|(?:أكمل|اكمل) المؤمنين (?:إيمانا|ايمانا)`), "iman-quality"],
  /** «لا يؤمن أحدكم حتى» and its kin: faith denied until a branch is present. */
  [new RegExp(`لا يؤمن (?:أحدكم|احدكم|عبد|العبد|أحد|احد|الرجل) حتى|والله لا يؤمن|لا يؤمن من (?:لا|بات)|ليس (?:ال)?مؤمن (?:ب)?الذي`), "la-yuminu"],
  /** «من كان يؤمن بالله واليوم الآخر فليكرم ضيفه»: an act tied to faith. */
  [new RegExp(`من كان يؤمن بالله واليوم الآخر ف`), "man-kana-yuminu"],
  /** «لا يزني الزاني حين يزني وهو مؤمن»: faith lifted at the moment of the act. */
  [new RegExp(`حين (?:يزني|يسرق|يشربها|يشرب|ينتهبها|يغل|يقتل) وهو مؤمن`), "wa-huwa-mumin"],
  /** «أي الأعمال أفضل؟ قال: إيمان بالله»: faith ranked first among deeds. */
  [new RegExp(`(?:أي|اي) (?:ال)?(?:أعمال|اعمال|عمل) (?:أفضل|افضل|خير).{0,80}(?:إيمان|ايمان) بالله`), "afdal-al-amal"],
];
const SHUAB_WEAK: [RegExp, string][] = [
  [new RegExp(`(?:مثقال|وزن) (?:ذرة|حبة|دينار|شعيرة|برة)(?: من خردل)? من (?:ال)?(?:إيمان|ايمان)|حبة خردل من (?:ال)?(?:إيمان|ايمان)`), "mithqal"],
  [new RegExp(`(?:ال)?(?:إيمان|ايمان) (?:قول وعمل|يزيد وينقص)|يزيد وينقص|زيادة (?:ال)?(?:إيمان|ايمان)|(?:يزداد|ازداد|ليزدادوا|زادهم|زادتهم) (?:إيمانا|ايمانا)`), "ziyada"],
];

// ---------- خصال المؤمن ----------
const KHISAL_STRONG: [RegExp, string][] = [
  [new RegExp(`(?:خصال|صفات|صفة|أخلاق|اخلاق|علامات|علامة|نعت|شيم|خلال|أوصاف|اوصاف|خلق|سمات) (?:ال)?(?:مؤمن|مؤمنين|مؤمنون)${ER}|(?:خصال|خلال) (?:ال)?(?:إيمان|ايمان)|خصلة من (?:خصال )?(?:ال)?(?:إيمان|ايمان)`), "khisal"],
  /** «ثلاث من كن فيه وجد بهن حلاوة الإيمان» and the counted-traits wording about faith. */
  [new RegExp(`(?:ثلاث|أربع|اربع|خمس|ست) من كن فيه.{0,60}(?:إيمان|ايمان|مؤمن)|(?:ثلاث|أربع|اربع|خمس) (?:خصال|خلال).{0,80}(?:إيمان|ايمان|مؤمن)`), "min-kunna-fih"],
  /** The Prophet's sayings that describe the believer. */
  [new RegExp(`مثل (?:ال)?مؤمن${ER}|مثل (?:ال)?مؤمنين في|(?:ال)?مؤمن للمؤمن|(?:ال)?مؤمن (?:أخو|اخو|مرآة|مراة) (?:ال)?مؤمن|(?:ال)?مؤمنون كرجل|ترى (?:ال)?مؤمنين في|(?:ال)?مؤمنون (?:هينون|تتكافأ|إخوة)`), "mathal-al-mumin"],
  [new RegExp(`${BL}[وفإن ]{0,4}(?:ال)?مؤمن (?:القوي|من أمنه|من امنه|غر كريم|يألف|يالف|مألف|مالف|كيس|يغار|الذي يخالط|يأكل في|ياكل في|لا ينجس|ليس ب|بخير|يموت بعرق)|لا يلدغ (?:ال)?مؤمن|ليس (?:ال)?مؤمن ب|عجبا لأمر (?:ال)?مؤمن|عجبا لامر (?:ال)?مؤمن|لا يشبع (?:ال)?مؤمن|لا يفرك مؤمن|ما يصيب (?:ال)?مؤمن|لا يزال (?:ال)?بلاء ب(?:ال)?مؤمن|إن (?:ال)?مؤمن (?:ل)?ي(?:رى|درك)`), "al-mumin"],
  /** What a believer owes a believer: «للمؤمن على المؤمن ست خصال»، «حق المسلم على المسلم». */
  [new RegExp(`للمؤمن على (?:ال)?مؤمن|حق (?:ال)?مسلم على (?:ال)?مسلم|للمسلم على (?:ال)?مسلم`), "haqq"],
  /** The Muslim described: «المسلم من سلم المسلمون من لسانه ويده»، «المسلم أخو المسلم». */
  [new RegExp(`(?:ال)?مسلم من سلم|(?:ال)?مسلم (?:أخو|اخو) (?:ال)?مسلم|(?:ال)?مهاجر من هجر`), "al-muslim"],
];

const TOPIC_RULES: Record<ArkanTopic, { strong: [RegExp, string][]; weak: [RegExp, string][] }> = {
  islam: { strong: ISLAM_STRONG, weak: [] },
  iman: { strong: IMAN_STRONG, weak: IMAN_WEAK },
  shuab: { strong: SHUAB_STRONG, weak: SHUAB_WEAK },
  khisal: { strong: KHISAL_STRONG, weak: [] },
};

/**
 * The reviewed Qur'an table: verse → the themes it is listed under. The verses are named by
 * reference only; their text is the frozen Tanzil text of the passage records.
 */
const Q = (topic: ArkanTopic, refs: string): [string, ArkanTopic][] => refs.split(/\s+/).filter(Boolean).map((r) => [`passage/quran-${r.replace(":", "-")}`, topic]);
const range = (sura: number, from: number, to: number) => Array.from({ length: to - from + 1 }, (_x, k) => `${sura}:${from + k}`).join(" ");
const QURAN_ROWS: [string, ArkanTopic][] = [
  // the testimony; the prayer and the zakat named together or apart; the fast; the pilgrimage
  ...Q("islam", "2:163 3:18 3:19 20:14 21:25 37:35 47:19 48:29"),
  ...Q("islam", "2:43 2:110 2:177 2:238 2:277 4:77 4:103 4:162 5:55 9:11 9:18 9:71 11:114 17:78 19:31 19:55 20:132 21:73 22:41 22:78 24:37 24:56 27:3 29:45 31:4 33:33 58:13 73:20 98:5 9:60 9:103"),
  ...Q("islam", "2:183 2:184 2:185 2:187 2:196 2:197 3:97 22:27"),
  // the articles of faith
  ...Q("iman", "2:3 2:4 2:136 2:177 2:285 3:84 4:136 4:152 9:51 54:49 57:22 64:11"),
  // faith as words and deeds that grow: the verses the collections open the Book of Faith with
  ...Q("shuab", "2:143 2:177 3:173 8:2 9:124 33:22 48:4 49:7 49:14 49:15 58:22 74:31"),
  // the believers described
  ...Q("khisal", `8:2 8:3 8:4 8:74 9:71 9:112 13:20 13:21 13:22 24:51 24:62 32:15 32:16 33:23 33:35 48:29 49:10 49:15 5:54 3:134 3:135 ${range(23, 1, 11)} ${range(25, 63, 65)} 25:67 25:68 ${range(25, 72, 76)} ${range(42, 36, 39)} ${range(70, 22, 27)} ${range(70, 29, 35)}`),
];
export const ARKAN_QURAN = new Map<string, ArkanTopic[]>();
for (const [id, topic] of QURAN_ROWS) {
  const t = ARKAN_QURAN.get(id) ?? [];
  if (!t.includes(topic)) t.push(topic);
  ARKAN_QURAN.set(id, t);
}

/** Passage records whose only lexical hit is a verified false positive. */
export const ARKAN_EXCLUDE = new Set<string>([]);

/** A text as the detector reads it: diacritics stripped. */
export function arkanFold(text: string): string {
  return text.replace(DIACRITICS, "").replace(/[\u200e\u200f\u202a-\u202e]/g, "");
}

/** Signals of a folded text, per theme. `strongOnly` is the harvest gate: weak signals never admit. */
export function arkanHitsOfText(raw: string, strongOnly = false): { topic: ArkanTopic; signal: string; strong: boolean }[] {
  if (!raw.trim()) return [];
  const out: { topic: ArkanTopic; signal: string; strong: boolean }[] = [];
  const weak: { topic: ArkanTopic; signal: string; strong: boolean }[] = [];
  for (const topic of ARKAN_TOPICS) {
    const seen = new Set<string>();
    for (const [re, signal] of TOPIC_RULES[topic].strong) if (!seen.has(signal) && re.test(raw)) { seen.add(signal); out.push({ topic, signal, strong: true }); }
    for (const [re, signal] of TOPIC_RULES[topic].weak) if (re.test(raw)) weak.push({ topic, signal, strong: false });
  }
  // A weak signal counts beside a strong one; two distinct weak signals admit a passage on density.
  if (out.length > 0 || (!strongOnly && new Set(weak.map((w) => w.signal)).size >= 2)) out.push(...weak);
  return out;
}

/** Offset of the first strong match in a folded text, or -1. */
export function arkanFirstStrongAt(raw: string): number {
  let at = -1;
  for (const topic of ARKAN_TOPICS) for (const [re] of TOPIC_RULES[topic].strong) {
    const m = re.exec(raw);
    if (m && (at === -1 || m.index < at)) at = m.index;
  }
  return at;
}

const textOf = (n: Node) => arkanFold([n.data.text_search, n.data.text].filter(Boolean).join(" "));
const isQuran = (n: Node) => n.data.work === "work/quran";

/** The matched signal names for a passage (`<topic>:<signal>`), or [] when it carries none of the four themes. */
export function arkanSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub || ARKAN_EXCLUDE.has(n.id)) return [];
  if (isQuran(n)) return (ARKAN_QURAN.get(n.id) ?? []).map((t) => `${t}:quran-table`);
  // Only the passage's own text counts: labels and summaries are museum metadata.
  return arkanHitsOfText(textOf(n)).map((h) => `${h.topic}:${h.signal}`);
}

/** The themes a record belongs to: from the signals of a passage, from the `arkan-<topic>` tags of a curated record. */
export function arkanTopicsOf(n: Node): ArkanTopic[] {
  const tagged = ARKAN_TOPICS.filter((t) => n.tags.includes(`${ARKAN_TOPIC_TAG}${t}`));
  if (n.class !== "passage") return tagged;
  const found = new Set<string>(arkanSignalsOf(n).map((s) => s.split(":")[0]));
  return ARKAN_TOPICS.filter((t) => found.has(t) || tagged.includes(t));
}

/** True when the passage names or carries one of the four themes. */
export function isArkanPassage(n: Node): boolean {
  return arkanSignalsOf(n).length > 0;
}

/**
 * Which corpus a passage belongs to, from its work: the frozen Qur'an, the hadith collections
 * (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), and every other
 * harvested work. Works not yet harvested land in the right section the day their passages arrive.
 */
export function arkanCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): ArkanCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}
