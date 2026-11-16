// The Bunuwwa (Sonhood and Daughterhood) Browser's shared reads (docs/plan/63-bunuwwa-browser.md):
// which passage records report or mention sons and daughters (البنون والبنات), offspring
// (الذرية), filial piety and disobedience (بر الوالدين والعقوق), orphans and suckling
// (اليتامى والرضاعة), the rights of the child (الحضانة والعقيقة والميراث) and the named
// sons and daughters of the Qur'anic and prophetic stories — and which corpus section each
// belongs to. Detection runs at build time over the compiled graph, so a filial report in
// any harvested book — and in every book harvested later — appears without any tagging step.
// Curated records join through the `bunuwwa-browser` tag instead. The ambiguous words are
// guarded: bare «ابن» stays out (every isnad and patronymic carries it) and only its
// possessed relational forms count, «ولد» counts in its born/child forms but the bare name
// ابن in chains does not, «ميراث» counts only beside children vocabulary, and verified
// false positives are excluded by id.
import type { Node } from "./build-graph.js";

export const BUNUWWA_TAG = "bunuwwa-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const BUNUWWA_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type BunuwwaSection = (typeof BUNUWWA_SECTIONS)[number];
export type BunuwwaCorpus = Exclude<BunuwwaSection, "curated">;
export const BUNUWWA_TOPICS = ["banun", "dhurriyya", "birr", "yatim", "huquq", "qisas"] as const;
export type BunuwwaTopic = (typeof BUNUWWA_TOPICS)[number];

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/* ————— البنون والبنات — sons and daughters ————— */
/** The plural and collective forms: بنون، بنين، بنات، أولاد، أبناء — safe in every form. */
const AR_BANUN_PLURAL = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:بنون|بنين|بنونا|بنيكم|بنيهم|بنات|بناته|بناتها|بناتكم|بناتكن|بناتهم|بناتنا|أولاد|أولاده|أولادها|أولادهم|أولادك|أولادكم|أولادنا|أبناء|أبنائه|أبنائها|أبنائهم|أبنائك|أبنائكم|أبناؤكم|بنيك)(?=$|${E})`);
/** Possessed sons and daughters: ابنه، ابنها، ابنك، ابني، ابنته، ابنتها، بنته — the possessive
 *  keeps the patronymic «ابن فلان» of isnads and genealogies out. */
const AR_IBN_POSSESSED = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:ابنه|ابنها|ابنك|ابنكم|ابنكن|ابنهم|ابني|ابننا|ابنته|ابنتها|ابنتك|ابنتكم|ابنتي|ابنتنا|بنته|بنتها|بنتي|بنتك|بنتهم)(?=$|${E})`);
/** ولد in its child/birth forms: ولده، ولدها، ولدك، يولد، وُلد، تلد، ولادة، مولود —
 *  including the doctrinal «لم يلد ولم يولد» which counts as a mention of sonship. */
const AR_WALAD = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:ولده|ولدها|ولدك|ولدكم|ولدهم|ولدي|ولدنا|ولدت|ولد له|ولد لها|يولد|ولد|ولادة|ولادته|ولادتها|مولود|مولودة|مولوده|مولودها|تلد|تلدن|يلد|أولاد)(?=$|${E})`);
/** The bare «يا بني» / «يا بنيّ» vocative — the father addressing his son in the stories. */
const AR_YA_BUNAYYA = new RegExp(`${BL}(?:يا\s)?(?:بني|بنيّ|بنيّة|يا\sبني|يا\sبنيّ|يا\sبُنَيّ|يا\sابني|يا\sابنتي)(?=$|${E})`);
/** الأنثى والموءودة — daughters as such: the buried infant girl and the female-child verses. */
const AR_UNTHA = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:أنثى|الأنثى|أنثيين|للأنثى|بالأنثى|الإناث|إناث|موءودة|الموءودة|يئد|وئد|وأد|يؤد)(?=$|${E})`);

/* ————— الذرية — offspring and progeny ————— */
/** ذرية and ذراري — the offspring, possessed and qualified forms all safe. */
const AR_DHURRIYYA = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:ذرية|ذريته|ذريتها|ذريتهم|ذريتك|ذريتكم|ذرية طيبة|ذريات|ذراري|ذرية ضعفاء|ذرية بعضها)(?=$|${E})`);
/** نسل/عقب — descent and posterity, possessed forms (bare نسل counts beside offspring words). */
const AR_NASL = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:نسله|نسلها|نسلهم|نسلكم|عقبه|عقبها|عقبهم|العقب|عقب)(?=$|${E})`);
/** بني إسرائيل وبنو آدم — the children-of collective names of the Qur'anic address. */
const AR_BANI_COLLECTIVE = new RegExp(
  `${BL}(?:[وبفس])?(?:بني إسرائيل|بنو إسرائيل|بنى إسرائيل|بني آدم|بنو آدم|بني إسماعيل|بني إسحاق|يا بني إسرائيل|يا بني آدم)(?=$|${E})`);

/* ————— بر الوالدين والعقوق — filial piety and disobedience ————— */
/** الوالدين and its possessed pairs — the parents as a pair, the axis of birr. */
const AR_WALIDAYN = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:والدين|والديه|والديها|والديك|والديكم|والديهم|أبويه|أبويها|أبويك|أبويهم|أبوي|والدك|والدتك|والدكما)(?=$|${E})`);
/** بر الوالدين and the ihsan phrases — explicit piety vocabulary. */
const AR_BIRR_PHRASE = new RegExp(
  `${BL}(?:[وبفسك])?(?:بر الوالدين|بالوالدين إحسانا|بر بوالديه|بر والديه|بر والديك|البر بالوالدين|ببر والديه|ببر والديهما|أمك ثم|أرضى الوالدين|رضا الوالدين|أقدام الأمهات|حق الوالد|حق الوالدة|حق الأم|حق الأب|صلة الوالدين|أحسن إلى والديه|رحم والديه)(?=$|${E})`);
/** العقوق — the disobedient son and the cutting off of parents. */
const AR_UQUQ = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:عقوق|العقوق|عاق|عاقا|عقّ|يعق|عاقة|عقق|عقوق الوالدين|العاق)(?=$|${E})`);
/** The Qur'anic filial phrases: «لا تقل لهما أف»، «اخفض لهما جناح الذل»، «ارحمهما». */
const AR_QURAN_FILIAL = new RegExp(
  `${BL}(?:لا تقل لهما|تقل لهما أف|أفٍّ|اخفض لهما|جناح الذل|ارحمهما|واخفض لهما جناح|كما ربياني|كلا|بلغ الكبر)(?=$|${E})`);

/* ————— اليتامى والرضاعة — orphans, infants and suckling ————— */
/** يتيم/يتامى — the orphan child. */
const AR_YATIM = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:يتيم|يتامى|اليتيم|يتامى|أيتام|يتيمة|يتم|أيامى)(?=$|${E})`);
/** رضاعة — suckling and milk-kinship; فطام — weaning; حمل — the bearing of the child. */
const AR_RADAA_FITAM = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:رضاعة|الرضاعة|رضاع|رضاعتهن|أرضع|ترضع|يرضع|يرضعن|أرضعن|أرضعت|مرضعة|مرضعات|رضيع|رضيعة|فطام|فطامه|حملته|حمله|حملها|حبالى|وضعت|وضعها|وهن على وهن)(?=$|${E})`);

/* ————— حقوق الولد — the child's rights and rulings ————— */
/** حضانة — custody of the child; عقيقة — the birth sacrifice; تحنيك/تسمية — first rites. */
const AR_HADANA_AQIQA = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:حضانة|حاضنة|حواضن|عقيقة|العقيقة|عق عن|يعق عن|عقيقته|تحنيك|حنكه|تحنيكه|تسمية|سمّه|سماه|سميته|أذن في أذن|أذّن في أذن|الكفالة|يكفله|كفيل)(?=$|${E})`);
/** The inheritance share of sons and daughters: «للذكر مثل حظ الأنثيين»، ميراث/يرث gated on
 *  children vocabulary (inheritance alone is not a filial mention). */
const AR_MIRATH_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:ميراث|يرث|يورث|ورثة|مواريث|حظ الأنثيين|للذكر مثل|أنصباء|فروض)(?=$|${E})`, "g");
const MIRATH_CONTEXT = /ابن|بنت|بنات|بنين|أولاد|ولد|ذرية|والدين|والد|أب|أم|إخوة|أخوات|كلا|الأبناء|الأبوين|أبويه|يوصيكم/;

/* ————— القصص — the named sons and daughters of the stories ————— */
/** غلام — the boy of the annunciation and the story verses (غلام حليم، غلام عليم، غلام زكية). */
const AR_GHULAM = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:غلام|غلاما|غلامه|غلامها|الغلام|بغلام)(?=$|${E})`);
/** The filial story markers: لقمان's counsel, the sacrificed son, the sons of Adam and Noah. */
const AR_QISAS_PHRASE = new RegExp(
  `${BL}(?:لقمان|افعل ما تؤمر|بلغ معه السعي|الذبيح|ابني اركب|ابنا آدم|ابني آدم|ابن نوح|ابنه كان|فتى الكهف|بشرناه|يبشرك)(?=$|${E})`);

/** Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `bunuwwa-browser` also admits it (see pick in export-api). */
export const BUNUWWA_EXCLUDE = new Set<string>([]);

/** topic for each signal name. */
const SIGNAL_TOPICS: Record<string, BunuwwaTopic> = {
  banun_plural: "banun", ibn_possessed: "banun", walad: "banun", ya_bunayya: "banun", untha: "banun",
  dhurriyya: "dhurriyya", nasl: "dhurriyya", bani_collective: "dhurriyya",
  walidayn: "birr", birr_phrase: "birr", uquq: "birr", quran_filial: "birr",
  yatim: "yatim", radaa_fitam: "yatim",
  hadana_aqiqa: "huquq", mirath_bare: "huquq",
  ghulam: "qisas", qisas_phrase: "qisas",
};

/** The matched signal names for a passage, or [] when it is not about sonhood/daughterhood. */
export function bunuwwaSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // the «كتاب البر» chapter of a hadith collection without the passage itself being a filial report.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || BUNUWWA_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);

  /* banun */
  if (has(AR_BANUN_PLURAL)) hits.add("banun_plural");
  if (has(AR_IBN_POSSESSED)) hits.add("ibn_possessed");
  if (has(AR_WALAD)) hits.add("walad");
  if (has(AR_YA_BUNAYYA)) hits.add("ya_bunayya");
  if (has(AR_UNTHA)) hits.add("untha");

  /* dhurriyya */
  if (has(AR_DHURRIYYA)) hits.add("dhurriyya");
  if (has(AR_NASL)) hits.add("nasl");
  if (has(AR_BANI_COLLECTIVE)) hits.add("bani_collective");

  /* birr */
  if (has(AR_WALIDAYN)) hits.add("walidayn");
  if (has(AR_BIRR_PHRASE)) hits.add("birr_phrase");
  if (has(AR_UQUQ)) hits.add("uquq");
  if (has(AR_QURAN_FILIAL)) hits.add("quran_filial");

  /* yatim */
  if (has(AR_YATIM)) hits.add("yatim");
  if (has(AR_RADAA_FITAM)) hits.add("radaa_fitam");

  /* huquq */
  if (has(AR_HADANA_AQIQA)) hits.add("hadana_aqiqa");
  for (const m of raw.matchAll(AR_MIRATH_BARE)) {
    const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
    if (MIRATH_CONTEXT.test(window)) { hits.add("mirath_bare"); break; }
  }

  /* qisas */
  if (has(AR_GHULAM)) hits.add("ghulam");
  if (has(AR_QISAS_PHRASE)) hits.add("qisas_phrase");

  return [...hits];
}

/** True when the passage reports or mentions sonhood, daughterhood or the filial relationship. */
export function isBunuwwaPassage(n: Node): boolean {
  return bunuwwaSignalsOf(n).length > 0;
}

/** The filial topics a passage touches: every family whose signals hit. */
export function bunuwwaTopicsOf(n: Node): BunuwwaTopic[] {
  const topics = new Set<BunuwwaTopic>();
  for (const s of bunuwwaSignalsOf(n)) {
    const t = SIGNAL_TOPICS[s];
    if (t) topics.add(t);
  }
  return [...topics];
}

/**
 * Which corpus a bunuwwa passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function bunuwwaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): BunuwwaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `bunuwwa-<section>` when present, else `curated`. */
export function bunuwwaTagSection(n: Node): BunuwwaSection {
  const tag = n.tags.find((t) => t.startsWith("bunuwwa-") && t !== BUNUWWA_TAG);
  const id = tag?.slice(8) ?? "curated";
  return (BUNUWWA_SECTIONS as readonly string[]).includes(id) ? (id as BunuwwaSection) : "curated";
}
