// The Ubuwwa (Fatherhood) Browser's shared reads (docs/plan/65-ubuwwa-browser.md): which
// passage records report or mention the father and fatherhood (الأب والأبوة), the dutifulness
// owed to the father and the parents (بر الوالدين) and its opposite (العقوق), the father
// raising and counselling his children (التربية والوصية — يا بني، لقمان), paternity and
// lineage (النسب والانتساب), and the orphan whose father is lost (اليتيم) — and which corpus
// section each belongs to. Detection runs at build time over the compiled graph, so a
// fatherhood report in any harvested book — and in every book harvested later — appears
// without any tagging step. Curated records join through the `ubuwwa-browser` tag instead.
// The ambiguous words are guarded: the kunya «أبو فلان» names a man without reporting
// fatherhood, so bare «أبو» never counts — only possessed, plural, vocative or contexted
// father forms; child vocabulary («ولد»، «ابن»، «يا بني») counts only beside father
// vocabulary (God's «يا بني آدم» and a mother's speech drop out unless the father is there);
// «بر» counts only beside the parents; and verified false positives are excluded by id.
import type { Node } from "./build-graph.js";

export const UBUWWA_TAG = "ubuwwa-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const UBUWWA_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type UbuwwaSection = (typeof UBUWWA_SECTIONS)[number];
export type UbuwwaCorpus = Exclude<UbuwwaSection, "curated">;
export type UbuwwaTopic =
  | "ab" | "birr" | "tarbiyya" | "nasab" | "yatm";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/* ————— الأب والأبوة — the father and fatherhood ————— */
/** أبوة/الأبوة — the abstract noun of fatherhood itself. */
const AR_UBUWWA_NOUN = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?أبوة(?:ه|ها|هم|نا)?(?=$|${E})`);
/** Possessed and plural fathers: أبوه، أبوها، أبيه، أبوك، أبوي، أبونا، أبينا، أبانا، أبويه، أبويهم، آباء —
 *  these always mean a father; the bare kunya «أبو بكر/أبو هريرة» never enters because bare «أبو»
 *  is not listed. */
const AR_AB_POSSESSED = new RegExp(
  `${BL}(?:[وبفسكل])?(?:ال)?(?:أبوه|أبوها|أبوهم|أبوهما|أبوهن|أبوك|أبوكم|أبوكما|أبوكن|أبوي|أبيا|أبونا|أبينا|أبانا|أبيه|أبيها|أبيك|أبيكم|أبيكما|أبيكن|أبويه|أبويها|أبويك|أبويكم|أبويهم|أبائه|أبائها|أبائهم|أبائك|أبائكم|أبائنا|آباء|آباؤه|آباؤها|آباؤهم|آباؤنا|آبائه|آبائها|آبائهم|آبائنا|آبائك|آبائكم|أب الآباء|آبائيا|الآب)(?=$|${E})`);
/** «أبي» — "my father": a real fatherhood word, but also the genitive of the kunya
 *  «أبو فلان» in isnads («عن أبي هريرة قال»), so it counts only when the next word is a
 *  verb or particle of father-speech (مات، قال، أمرني، كان، علمني…), a pronouned verb,
 *  or the end of the utterance — never when a proper name follows. */
const AR_ABI = new RegExp(`${BL}أبي(?=$|${E})`, "g");
const ABI_FOLLOW = new RegExp(`^${B}*(?:مات|ماتت|توفى|توفي|توفاه|قال|قالت|أخبرني|حدثني|أمرني|أعطاني|أعطاه|كان|كانت|أخذ|أخذت|علمني|علمنيّ|رحمه|رحمها|أوصاني|عهد|غفر|رضي|رضى|أراد|أرادت|أرسلني|أدخلني|أخرجني|خرج|دخل|زوجني|رباني|ربى|أنجبني|ولدني|حملني|أبى|فقال|فمات|وهو|وهي|الذي|التي|إلى|الي|عن|من|في|على|إلى|ثم|ف|و)(?=$|${E})`);
/** The vocatives a father hears: يا أبت/يا أبتِ، يا أبانَ — always addressed to a father. */
const AR_AB_VOCATIVE = new RegExp(`${BL}يا ?(?:أبت|أبتي|أبتاه|أبان|أبّة|أبة)(?=$|${E})`);
/** والد — the parent, almost always the father in the singular: possessed, definite, and tanwin
 *  forms; bare «والد» stays out (it pairs inside والدين, covered by the birr family). */
const AR_WALID = new RegExp(
  `${BL}(?:[وبفسكل])?(?:ال)?(?:والد|والده|والدها|والدهم|والدك|والدكم|والدي|والدنا|والديه|والديها|والديهم|والدًا|والداً|والدا|والد واحد|والد مسلم|جدي|جده|جدها|جدهم|جدك|جدك?م|أجداد|أجدادهم|أجدادنا)(?=$|${E})`);
/** «يا بني» / «يا بنيّ» — the father's address to his son; weak on its own (God also says
 *  «يا بني آدم», «يا بني إسرائيل»), so it counts only beside father vocabulary — see below. */
const AR_YA_BUNAYYA = new RegExp(`${BL}يا ?(?:بني|بنيّ|بنيّة|بنيتا)(?=$|${E})`, "g");
/** «يا بني» contexts that are not a father speaking: God's address and tribal plurals. */
const YA_BUNAYYA_FALSE = /(?:بني آدم|بني إسرائيل|بني اسرائيل|بني إسماعيل|يا بني أمت)/;
/** Children in a father's mouth or hand — weak child vocabulary, gated on father context:
 *  «ابن أبيه»، «ولده»، «أولاده» beside an أب/والد word. */
const AR_WLAD_WEAK = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:ولده|ولدها|ولدهم|ولدي|ولدك|أولاده|أولادها|أولادهم|ابنه|ابنها|ابنهم|ابني|ابنهما|أبناؤه|أبنائه|أبنائها|أبنائهم|بنيه|بنيها|بنيهم|بنوه|بنونا|بنيهن|فلذة|فلذات)(?=$|${E})`, "g");
/** The window context that admits weak child words: a father word nearby. */
const ABU_CONTEXT = /أبوة|أبوه|أبوها|أبوك|أبوي|أبونا|أبينا|أبانا|أبيه|أبويه|أبويها|أبويك|أبويهم|أبائ|آباء|آبائ|يا أبت|يا أبتي|والد|والده|والدك|والدي|والديه|والدين|الوالد|جدّ|جده|جدي|أجداد|نسبه|أنجب|أب ل|أبًا ل|أباً ل|لأبيه|من أبيه|عن أبيه|عن أب|كأبيه|رضاعته|رضعته|حمله|ربّى|رباه|يربيه/;

/* ————— بر الوالدين والعقوق — dutifulness to parents and its opposite ————— */
/** بر + الوالدين/الوالد — the great duty; «بالوالدين إحساناً»، «بر الوالدين»، «بر والديه». */
const AR_BIRR_WALIDAYN = new RegExp(`${BL}(?:[وبفسكل])?(?:بر الوالدين|بالوالدين|بأبوي|بأبويك|لوالديه|لوالدي|لوالدك|لوالديه|بر والده|بر والديه|بر والدي|بر أبيه|بر أبويه|إحسانا بالوالدين|إحسان بالوالدين|والدين إحسانا|الوالدين إحسانا|بريرة بوالديه|بار بوالديه|بارّ بوالديه|صلة الوالدين|صلة والديه|إكرام الوالدين|طاعة الوالدين|أطع والديك|حق الوالدين|حقوق الوالدين|حق الوالد|حقوق الوالد|دعاء الوالد|دعا الوالد|رحم الله والديه|غفر الله لوالدي|رضى الوالدين|رضا الوالدين|سخط الوالدين|رضى الله من رضى الوالد|رضا الله في رضا الوالد)(?=$|${E})`);
/** العقوق — disobedience and severance toward the parents: عقوق، عاق، يعق، العاق، قاطع رحمه مع أبويه. */
const AR_UQUQ = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:عقوق|عقوقه|عقوقهم|عاق|العاق|يعق|يعقه|يعقهما|عاقّ|عقوق الوالدين|عاق والديه|عاق أبيه|قاطع أبيه|قاطع والديه|قطيعة الوالدين|قطع والديه|قتل أباه|قتل أبيه|لعن أباه|لعن والديه|سب أباه|شتم أباه|أهان أباه)(?=$|${E})`);
/** الوالدين as a pair — the parents' verse pair counts as a fatherhood mention (the father is
 *  half of it); kept inside the birr topic. */
const AR_WALIDAYN_PAIR = new RegExp(`${BL}(?:[وبفسكل])?(?:ال)?(?:والدين|والديه|والديها|والديك|والديكم|والديهما|والديهن|أبويه|أبويها|أبويك|أبويهم|أبوي|أب وأم|أبا وأما)(?=$|${E})`);

/* ————— التربية والوصية — the father raising, teaching and counselling ————— */
/** لقمان's counsel — the Qur'an's great fatherly speech; «وصى لقمان ابنه»، «قال لقمان لابنه». */
const AR_LUQMAN = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?لقمان(?=$|${E})`);
/** تربية — raising a child: ربّى، رباه، يربي، تربية أولاده، تربية الأبناء, plus the Prophet's
 *  «علموا أولادكم» teaching forms. */
const AR_TARBIYYA = new RegExp(`${BL}(?:[وبفس])?(?:أ|ا|ي|ت|ن|ل)?(?:ربّى|رباه|رباها|رباهم|يربي|يربيه|يربيها|تربية|تربيته|تربيتها|تربيتهم|مربي|مربى|نشأ|نشأه|نشأت|أنشأ|علموا أولادكم|علم أولاده|علم بنيه|يعلم ابنه|يعلمهم|حفظ أولاده)(?=$|${E})`);
/** وصية الأب — the father's testament and counsel to his children: وصى أبوهم، أوصى بهم، وصية أبيهم. */
const AR_WASIYYA_AB = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:وصية أبيهم|وصية أبيه|وصى أبوهم|وصى بهم|أوصى بهم أبوهم|أوصاه أبوه|أوصاهم|وصاه أبوه|ميثاقا من أبيه|عهد إليه أبوه|عهد أبوه|من وصية أبيه|وصية الأب|وصية الوالد|وصية والده)(?=$|${E})`);
/** الحمل على اليد والحضن — the father carrying and fondling the child: حمله على يده، احتضن ابنه،
 *  قبل ابنه, الحسن على عاتقه — kept with a child/father boundary so «حمل السلاح» stays out. */
const AR_HAML_CHILD = new RegExp(`${BL}(?:[وبفس])?(?:حمله على يده|يحمله على يده|على عاتقه|على عنقه|احتضن ابنه|قبل ابنه|قبل ابنته|يقبل ابنه|ركب على عنقه|ركب ابنه|مع ابنه|أخذ بيد ابنه|أخذ ابنه|أخذ ابنته|جاء بابنه|جاء بابنته|أهدى ابنه|نحر عن ابنه|عق عن ابنه|سمى ابنه|سمى أولاده)(?=$|${E})`);

/* ————— النسب والانتساب — paternity and lineage ————— */
/** النسب — the father's line: نسبه، نسب إلى أبيه، انتسب، ينتسب، ادعى نسبه، ادعياء، «الولد للفراش». */
const AR_NASAB = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:نسب|نسبه|نسبها|نسبهم|أنساب|أنسابهم|انتساب|ينتسب|انتسب|منتسب|ادعى|ادعياء|ادعاه|يدعيه|دعي|الدعي|لحق نسبه|نفى نسبه|أنكر أباه|ليس من أبيه|ليس ابنه|الولد للفراش|ولد الفراش|بنو لبن|رضاعه من أبيه|ابن لغير أبيه|ابن الزنا|ولد الزنا|ولد زنا)(?=$|${E})`);

/* ————— اليتيم — the orphan and the father lost ————— */
/** يتيم — the orphan is an orphan by losing the father: يتيم، يتامى، أيتام، كفالة اليتيم. */
const AR_YATIM = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:يتيم|يتيمة|يتامى|اليتامى|أيتام|أيتاما|إيتام|يتم|يتمه|يتمها|كفالة اليتيم|كفل اليتيم|يكفل يتيما|ضم اليتيم|وصي على اليتيم|ولي اليتيم|مال اليتيم|أموال اليتامى|أكل مال اليتيم|قيم اليتيم|أرملة ويتيم)(?=$|${E})`);

/** Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `ubuwwa-browser` also admits it (see pick in export-api). */
export const UBUWWA_EXCLUDE = new Set<string>([]);

/** topic for each signal name. */
export const UBUWWA_SIGNAL_TOPICS: Record<string, UbuwwaTopic> = {
  ubuwwa_noun: "ab", ab_possessed: "ab", ab_vocative: "ab", walid: "ab", ya_bunayya: "ab", wlad_weak: "ab",
  birr_walidayn: "birr", uquq: "birr", walidayn_pair: "birr",
  luqman: "tarbiyya", tarbiyya: "tarbiyya", wasiyya_ab: "tarbiyya", haml_child: "tarbiyya",
  nasab: "nasab",
  yatim: "yatm",
};

/**
 * The matched signal names for a raw Arabic text, or [] when it is not about the father.
 * Diacritics are stripped first — pass the vowelled text as it came.
 */
export function ubuwwaSignalsOfText(rawText: string): string[] {
  const raw = rawText.replace(DIACRITICS, "");
  if (!raw) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);
  /** ±40-char context window around a match, with the matched token itself removed. */
  const contextOf = (m: RegExpMatchArray) =>
    raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);

  /* ab — the father and fatherhood */
  if (has(AR_UBUWWA_NOUN)) hits.add("ubuwwa_noun");
  if (has(AR_AB_POSSESSED)) hits.add("ab_possessed");
  if (has(AR_AB_VOCATIVE)) hits.add("ab_vocative");
  for (const m of raw.matchAll(AR_ABI)) {
    const after = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 35);
    if (!after.replace(new RegExp(`${B}*$`), "").length || ABI_FOLLOW.test(after)) { hits.add("ab_possessed"); break; }
  }
  if (has(AR_WALID)) hits.add("walid");
  for (const m of raw.matchAll(AR_YA_BUNAYYA)) {
    if (YA_BUNAYYA_FALSE.test(raw.slice(0, m.index! + m[0].length + 20).slice(Math.max(0, m.index! - 40)))) continue;
    if (ABU_CONTEXT.test(contextOf(m))) { hits.add("ya_bunayya"); break; }
  }
  for (const m of raw.matchAll(AR_WLAD_WEAK)) {
    if (ABU_CONTEXT.test(contextOf(m))) { hits.add("wlad_weak"); break; }
  }

  /* birr — dutifulness and disobedience to the parents */
  if (has(AR_BIRR_WALIDAYN)) hits.add("birr_walidayn");
  if (has(AR_UQUQ)) hits.add("uquq");
  if (has(AR_WALIDAYN_PAIR)) hits.add("walidayn_pair");

  /* tarbiyya — raising, teaching, counselling */
  if (has(AR_LUQMAN)) hits.add("luqman");
  if (has(AR_TARBIYYA)) hits.add("tarbiyya");
  if (has(AR_WASIYYA_AB)) hits.add("wasiyya_ab");
  if (has(AR_HAML_CHILD)) hits.add("haml_child");

  /* nasab — paternity and lineage */
  if (has(AR_NASAB)) hits.add("nasab");

  /* yatm — the orphan */
  if (has(AR_YATIM)) hits.add("yatim");

  return [...hits];
}

/** The matched signal names for a passage record, or [] when it is not about the father. */
export function ubuwwaSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // a «كتاب البر والصلة» chapter without the passage itself being a fatherhood report.
  if (UBUWWA_EXCLUDE.has(n.id)) return [];
  const raw = [n.data.text_search, n.data.text].filter(Boolean).join(" ");
  if (!raw) return [];
  return ubuwwaSignalsOfText(raw);
}

/** True when the passage reports or mentions the father or fatherhood in any of the five families. */
export function isUbuwwaPassage(n: Node): boolean {
  return ubuwwaSignalsOf(n).length > 0;
}

/** The fatherhood topics a passage touches: every family whose signals hit. */
export function ubuwwaTopicsOf(n: Node): UbuwwaTopic[] {
  const topics = new Set<UbuwwaTopic>();
  for (const s of ubuwwaSignalsOf(n)) {
    const t = UBUWWA_SIGNAL_TOPICS[s];
    if (t) topics.add(t);
  }
  return [...topics];
}

/**
 * Which corpus an ubuwwa passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function ubuwwaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): UbuwwaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `ubuwwa-<section>` when present, else `curated`. */
export function ubuwwaTagSection(n: Node): UbuwwaSection {
  const tag = n.tags.find((t) => t.startsWith("ubuwwa-") && t !== UBUWWA_TAG);
  const id = tag?.slice(7) ?? "curated";
  return (UBUWWA_SECTIONS as readonly string[]).includes(id) ? (id as UbuwwaSection) : "curated";
}
