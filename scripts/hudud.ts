// The Hudud Allah and Kaba'ir Browser's shared reads (docs/plan/52-hudud-browser.md): which
// passage records mention or carry «حدود الله» — the limits God set and the penalties He
// prescribed — and «الكبائر», the major sins, and which corpus section each belongs to.
// Detection runs at build time over the compiled graph, so a hudud or kaba'ir mention in
// any harvested book — and in every book harvested later — appears without any tagging
// step. Curated records join through the `hudud-browser` tag instead.
//
// Scope is the two-fold theme the founder chose:
//  • «حدود الله» — the limits of God in the Qur'anic phrase («تلك حدود الله»، «ومن يتعد
//    حدود الله») and the prescribed penalties the jurists call hudud: stoning (رجم),
//    flogging (جلد), the amputated hand (قطع اليد), the discretionary «تعزير», and — beside
//    a strong signal — the crimes the hudud answer (الزنا، السرقة، القذف، الخمر، الردة،
//    الحرابة), the «قصاص» retaliation and the ungated «حد/حدود» forms.
//  • «الكبائر» — the major sins: «كبائر» and «الكبائر» unambiguous, the «موبقات» of the
//    hadith lists, and the gated «كبيرة» which mostly means "big".
// Two gating rules keep the lexicon honest: a weak signal counts only beside a strong one,
// and a passage carrying two or more distinct weak signals is admitted on density alone
// (the fiqh phrasing «حد الزنا الجلد»). Out of scope: «حد» as "since"/"definition" with no
// penalty context, borders between countries, «كبيرة» in every non-sin sense, and the wider
// sins theme — the Sayyi'at Browser owns that.
import type { Node } from "./build-graph.js";

export const HUDUD_TAG = "hudud-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const HUDUD_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type HududSection = (typeof HUDUD_SECTIONS)[number];
export type HududCorpus = Exclude<HududSection, "curated">;
/** `hudud` = the limits/penalties theme; `kabair` = the major-sins theme (hudud wins when both fire). */
export type HududKind = "hudud" | "kabair";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/**
 * Clitic/definite-article cluster allowed before a stem: «فحدود الله»، «والكبائر»، «بالرجم».
 * At most three units, matching the sayyiat detector's inventory.
 */
const PRE = String.raw`(?:(?:ال)|[وبفسلك]){0,3}`;
/** Pronoun/plural/case suffixes — the same explicit inventory the sayyiat detector uses. */
const SUF = String.raw`(?:هما|هم|هن|كما|كم|كن|ها|ه|نا|ك|[ىي]|ات|وا|ين|ون|ة|ا)?`;
/** Loose Arabic-letter suffix where a stem needs it. */
const NSUF = String.raw`[ء-ي]{0,3}`;

// ---------- strong: «حدود الله» and the penalties ----------

/**
 * The namesake phrase: «حدود الله» in every inflection — «تلك حدود الله»، «فأولئك حدود الله»،
 * «ومن يتعد حدود الله»، «وحدود الله». Unambiguous.
 */
const AR_HUDUD_ALLAH = new RegExp(`${BL}${PRE}حدود (?:الله|ما أنزل)${NSUF}(?=$|${E})`);
/**
 * «حدوده» — "His limits" with the attached pronoun («إن يتبعوا إلا الظن ... وما تهوى الأنفس
 * ولقد جاءهم من ربهم الهدى» contexts): never bare «حدود», which can be borders.
 */
const AR_HUDUDUHU = new RegExp(`${BL}${PRE}حدوده(?:ما)?(?=$|${E})`);
/**
 * Establishing the hadd: «أقام الحد»، «أقيم الحد»، «يقيم الحدود»، «إقامة الحد» — the
 * jurists' own wording for carrying out the penalty.
 */
const AR_IQAMAT_ALHADD = new RegExp(`${BL}${PRE}(?:أقام|أقيم|يقيم|أقاموا|اقم|إقامة|اقامة) ${PRE}حد[ود]?${SUF}(?=$|${E})`);
/** Stoning: «الرجم»، «رجم»، «رجمت»، «يرجم»، «المرجوم» — unambiguous. */
const AR_RAJM = new RegExp(`${BL}${PRE}(?:رجم|رجمت|رجما|يرجم|مرجوم)${SUF}(?=$|${E})`);
/** The discretionary punishment: «تعزير»، «تعزّر»، «عزّره» — unambiguous. */
const AR_TAZIR = new RegExp(`${BL}${PRE}(?:تعزير|تعزيرا|تعزيرات|معزر)${NSUF}(?=$|${E})`);
/**
 * The amputated hand — the Qur'anic «فاقطعوا أيديهما» (5:38) and the hadith forms «قطعت يده»،
 * «قطع يده»، «قطعا أيديهم»، «اليد تقطع». The cutting verb and a hand word within ten
 * characters, in either direction; a crime report without the hand stays weak.
 */
const AR_QAT_YAD = new RegExp(`${BL}${PRE}(?:قطع|اقطع|أقطع|يقطع|تقطع|مقطوع|قطعا)[ء-ي]{0,4}[\\s،؛]{0,2}[ء-ي]{0,10}[\\s،؛](?:يد|اليد|أيدي|أيديهما|يده|يدها|يمين|أيمان)|${BL}${PRE}(?:يد|أيدي|يمين|اليد)[ء-ي]{0,4}[\\s،؛]{0,2}[ء-ي]{0,10}[\\s،؛](?:تقطع|اقطع|أقطع|مقطوع|القطع)`);
/**
 * Flogging as punishment — «فاجلدوا»، «اجلدوا»، «جلدوا»، «يجلد»، «جلدة»، «جلدات»،
 * «مائة جلدة». Bare «جلد» (also "skin") and «جلدت» stay weak below.
 */
const AR_JALD_PUN = new RegExp(`${BL}${PRE}(?:اجلد|اجلدوا|جلدوا|يجلد|تجلد|جلدة|جلدات|جلد مائة|مائة جلدة)${NSUF}(?=$|${E})`);

// ---------- strong: «الكبائر» ----------

/** «كبائر» and «الكبائر» — unambiguous, the word the founder named. */
const AR_KABAIR = new RegExp(`${BL}${PRE}كبائر${NSUF}(?=$|${E})`);
/** «الموبقات» — «اجتنبوا السبع الموبقات» (Bukhari 2766, Muslim 89): the destroying major sins. */
const AR_MUBIQAT = new RegExp(`${BL}${PRE}موبق[اة]ت${NSUF}(?=$|${E})`);

// ---------- weak: ungated forms and the hadd crimes ----------

/**
 * Ungated «حدود» and «الحد» — borders, definitions and "since" in most registers, hudud in
 * the jurists' («باب الحدود»، «حد الزنا»). Weak: they need a strong neighbour or a second
 * weak signal to count.
 */
const AR_HUDUD = new RegExp(`${BL}${PRE}حدود${NSUF}(?=$|${E})`);
const AR_HADD = new RegExp(`${BL}(?:ال|ل|ب)حد${SUF}(?=$|${E})`);
/** Bare «جلد»/«جلدت»/«جلده» — "skin" or the flogging; weak. */
const AR_JALD = new RegExp(`${BL}${PRE}(?:جلد|جلدت)${NSUF}(?=$|${E})`);
/** The slander hadd and its verb: «قذف»، «قاذف»، «يقذف»، «رمى المحصنات». Weak. */
const AR_QADHF = new RegExp(`${BL}${PRE}(?:قذف|قذفا|قاذف|يقذف|القذف|رمى المحصنات|رمي المحصنة)${NSUF}(?=$|${E})`);
/** The hadd crimes — a story about a thief or a drinker is not a hudud mention until the
 *  penalty theme is present, so these are weak: الزنا, السارق والسرقة واللص, الخمر, الردة,
 *  المحاربة/الحرابة, and «قصاص» the hudud-adjacent retaliation. */
const AR_ZINA = new RegExp(`${BL}${PRE}(?:زنا|زنى|زانية|زاني|زان|يزن|تزن|الزنا)${NSUF}(?=$|${E})`);
const AR_SARIQ = new RegExp(`${BL}${PRE}(?:سارق|سرق|سرقة|سرقه|يسرق|تسرق|السرقة|اللص|لصوص)${NSUF}(?=$|${E})`);
const AR_KHAMR = new RegExp(`${BL}${PRE}(?:خمر|خمور|الخمر|شرب الخمر|يشرب الخمر|مسكر|سكران)${NSUF}(?=$|${E})`);
const AR_RIDDA = new RegExp(`${BL}${PRE}(?:ردة|الردة|مرتد|ارتد|يرتد)${NSUF}(?=$|${E})`);
const AR_HIRABA = new RegExp(`${BL}${PRE}(?:حرابة|الحرابة|محارب|محاربين|يحاربون)${NSUF}(?=$|${E})`);
const AR_QISAS = new RegExp(`${BL}${PRE}(?:قصاص|القصاص|يقتص|اقتص|قصاصا)${NSUF}(?=$|${E})`);
/** «كبيرة» — mostly "big"; weak and gated, admitting the minor/major pair phrasings. */
const AR_KABIRA = new RegExp(`${BL}${PRE}كبيرة${NSUF}(?=$|${E})`);
/** «إثما كبيرا» — the Qur'an's own wording for a major sin; weak and gated. */
const AR_ITHM_KABIR = new RegExp(`${BL}${PRE}إثما كبيرا(?=$|${E})`);

/**
 * Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `hudud-browser` also admits it (see pick in export-api).
 */
export const HUDUD_EXCLUDE = new Set<string>([
  // «فارجموا بالغيب» — "guessing at the unseen", not stoning.
  "passage/quran-18-22",
  // «قطعن أيديهن» — the women of Yusuf cut their hands by accident, not a hadd.
  "passage/quran-12-31",
  "passage/quran-12-50",
  // «ولغت في خمر وقذفته في وعائه» — a snake dipped in wine and "thrown", not the slander hadd.
  "passage/tathbit-j2-102",
  // «لا تهلك أسى وتجلد» — the mu'allaqa's "be patient, endure", not flogging.
  "passage/poem-muallaqat-tarafa-02",
]);

const STRONG = new Map<RegExp, string>([
  [AR_HUDUD_ALLAH, "hudud-allah"],
  [AR_HUDUDUHU, "hududuhu"],
  [AR_IQAMAT_ALHADD, "iqama"],
  [AR_RAJM, "rajm"],
  [AR_TAZIR, "tazir"],
  [AR_QAT_YAD, "qat-yad"],
  [AR_JALD_PUN, "jald"],
  [AR_KABAIR, "kabair"],
  [AR_MUBIQAT, "mubiqat"],
]);
const WEAK: [RegExp, string][] = [
  [AR_HUDUD, "hudud"],
  [AR_HADD, "hadd"],
  [AR_JALD, "jald-bare"],
  [AR_QADHF, "qadhf"],
  [AR_ZINA, "zina"],
  [AR_SARIQ, "sariq"],
  [AR_KHAMR, "khamr"],
  [AR_RIDDA, "ridda"],
  [AR_HIRABA, "hiraba"],
  [AR_QISAS, "qisas"],
  [AR_KABIRA, "kabira"],
  [AR_ITHM_KABIR, "ithm-kabir"],
];
const KABAIR_SIGNALS = new Set(["kabair", "mubiqat", "kabira", "ithm-kabir"]);

/** The matched signal names for a passage, or [] when it is not about «حدود الله والكبائر». */
export function hududSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // a «كتاب الحدود» chapter of a fiqh collection without the passage itself being about hudud.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || HUDUD_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  for (const [re, name] of STRONG) if (re.test(raw)) hits.add(name);
  const weak = new Set<string>();
  for (const [re, name] of WEAK) if (re.test(raw)) weak.add(name);
  // A weak signal counts beside a strong one; two or more distinct weak signals admit the
  // passage on density alone (the fiqh phrasing «حد الزنا الجلد»).
  if (hits.size > 0 || weak.size >= 2) for (const s of weak) hits.add(s);
  return [...hits];
}

/** True when the passage mentions or carries the «حدود الله والكبائر» theme. */
export function isHududPassage(n: Node): boolean {
  return hududSignalsOf(n).length > 0;
}

/** `hudud` when any limits/penalty signal fired, else `kabair` for the major-sins theme. */
export function hududKindOf(n: Node): HududKind | null {
  const s = hududSignalsOf(n);
  if (!s.length) return null;
  return s.some((x) => !KABAIR_SIGNALS.has(x)) ? "hudud" : "kabair";
}

/**
 * Which corpus a hudud passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function hududCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): HududCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `hudud-<section>` when present, else `curated`. */
export function hududTagSection(n: Node): HududSection {
  const tag = n.tags.find((t) => t.startsWith("hudud-") && t !== HUDUD_TAG);
  const id = tag?.slice(6) ?? "curated";
  return (HUDUD_SECTIONS as readonly string[]).includes(id) ? (id as HududSection) : "curated";
}
