// The Sayyi'at Browser's shared reads (docs/plan/44-sayyiat-browser.md): which passage records
// mention or carry the «السيئات» theme — evil deeds and sins — and which corpus section each
// belongs to. Detection runs at build time over the compiled graph, so a sin mention in any
// harvested book — and in every book harvested later — appears without any tagging step.
// Curated records join through the `sayyiat-browser` tag instead.
//
// Scope is the full sins theme the founder chose: the «سيّئ» word family itself (السيئات،
// سيئة، السيئة، السيّئ and the «سيء» spelling), the misconduct verbs (أساء/يسيء/مسيء/إساءة/
// تسيئة), the «ساء» family (ساء ما يعملون، يسوء), the «سوء» noun family, and the sin nouns
// and categories of the tradition — إثم/آثام/آثم, ذنب/ذنوب, معصية/معاصي/عاصي/يعصي/عصيان,
// فاحشة/فواحش/فحشاء, خطيئة/خطايا, لمم, فاسق/فسوق, فاجر/فجار/فجور, أجرم/مجرم/إجرام, and
// كبائر/صغائر with «كبيرة/صغيرة» admitted only beside another sin signal (they mostly mean
// "big"/"small"). Out of scope: البأساء (hardship), سماء (sky), مساء (evening), النساء
// (women — «ساء» sits inside it but never at a boundary), عصا (staff — «عصى» ends differently),
// تكبيرة (takbir — «كبيرة» sits inside it but never at a boundary), ظلم/شر/كذب (different
// themes), and حسنات (good deeds — only their «سيئة» counterpart counts).
import type { Node } from "./build-graph.js";

export const SAYYIAT_TAG = "sayyiat-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const SAYYIAT_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type SayyiatSection = (typeof SAYYIAT_SECTIONS)[number];
export type SayyiatCorpus = Exclude<SayyiatSection, "curated">;
/** `sayyi` = the passage carries the «سيّئ» word family; `related` = the wider sins-theme vocabulary. */
export type SayyiatKind = "sayyi" | "related";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/**
 * Clitic/definite-article cluster allowed before a stem: «بالسيئات»، «فبالإثم»، «والذنوب»،
 * «فسيئة»، «كمعصية». At most three units so «والإثم» parses as و+ال+إثم while a consonant
 * cluster like «تسيئة» (ت is not a clitic here) still fails.
 */
const PRE = String.raw`(?:(?:ال)|[وبفسلك]){0,3}`;
/** Loose Arabic-letter suffix for nouns: pronouns, plurals and case endings up to three letters. */
const NSUF = String.raw`[ء-ي]{0,3}`;

/**
 * «سيّئ» family — the word the browser is named for. Covers سيئ/سيئة/سيئه/سيئات with
 * pronoun and clitic forms («بسيئة»، «سيئاتكم»، «السيئات»). The «سيء» spelling variant is
 * included; «شيء» (thing) and «مسيء» (evildoer, counted under `asa`) can never match because
 * the stem must start at a boundary.
 */
const AR_SAYYI = new RegExp(`${BL}${PRE}سي[ئيء]${NSUF}(?=$|${E})`);
/**
 * «أساء» family — doing wrong. Past «أساء/أساءوا/أساءت» (hamza forms plus the bare-alef
 * spelling), imperfect «يسيء/تسيء», participle «مسيء/مسيئون/مسيئة», masdars «إساءة/إساءات/
 * تسيئة». «البأساء» (hardship) fails: «أساء» inside it is preceded by ب.
 */
const AR_ASA_PAST = new RegExp(`${BL}${PRE}[اأإ]س[ائي]ء${NSUF}(?=$|${E})`);
const AR_ASA_IMPF = new RegExp(`${BL}${PRE}(?:ي|ت)سيء${NSUF}(?=$|${E})`);
const AR_ASI = new RegExp(`${BL}${PRE}مسيء${NSUF}(?=$|${E})`);
const AR_ISAA = new RegExp(`${BL}${PRE}(?:إساءة|إساءات|تسيئة)${NSUF}(?=$|${E})`);
/**
 * «ساء» family — "evil is/was". Form-I past «ساء/ساءت/ساءوا» takes the clitic prefixes
 * because the Quranic fa- attaches it («فَسَاءَ مَطَرُ الْمُنْذِرِينَ»، «ساء ما يعملون»،
 * «ساء قرينا»). Imperfect «يسوء/تسوء» covers "it turns out evil". «النساء» (women),
 * «مساء» (evening), «سماء» (sky) and «تساءل» (they asked) all fail the boundary check.
 */
const AR_SAA = new RegExp(`${BL}(?:[وبفسلك])?ساء(?:ت|وا|تم|تن|ه|ها|هم|هن|كن|كما|كم|نا|وه)?(?=$|${E})`);
const AR_SAA_IMPF = new RegExp(`${BL}${PRE}(?:ي|ت)سوء(?:ون|ين|وا)?(?=$|${E})`);
/** «سوء» — evil as a noun: السوء، سوءًا، بسوء، سوءه. «أسوأ» (worse) ends in alif and «مساء» has no و. */
const AR_SUU = new RegExp(`${BL}${PRE}سوء(?:ا|ة|ه|ها|هم|هن|كن|كما|كم|نا|ي|ك|وا)?(?=$|${E})`);
/**
 * Pronoun/plural/case suffixes for the sin nouns — the same inventory Arabic actually uses
 * (ضمائر، جمع، تنوين). «إثمد» (kohl, antimony) ends in د, which is never a suffix here, so a
 * loose [ء-ي]{0,3} tail would false-positive on it; the explicit list does not.
 */
const SUF = String.raw`(?:هما|هم|هن|كما|كم|كن|ها|ه|نا|ك|[ىي]|ات|وا|ين|ون|ة|ا)?`;
/** «إثم» family — sin deserving punishment: إثم، إثمه، آثام، آثم/آثمة، يأثم، مؤثم. */
const AR_ITHM = new RegExp(`${BL}${PRE}(?:إثم|آثام|آثم|يأثم|مؤثم)${SUF}(?=$|${E})`);
/**
 * «ذنب» family — sin and the verbs of sinning: ذنب/ذنوب with pronoun suffixes
 * («ذنوبه»، «ذنوبكم»، «الذنوب»), «أذنب» (he sinned/confessed), «يذنب»، «مذنب».
 * «ذنب الأسد»-type tail usage would need an id-level exclusion; none attested today.
 */
const AR_DHANB = new RegExp(`${BL}${PRE}(?:ذنوب|ذنب|أذنب|يذنب|تذنب|مذنب)${NSUF}(?=$|${E})`);
/**
 * «معصية» family — disobedience to God: معصية/معصيته (Tanzil writes the construct
 * state «مَعْصِيَتِ ٱلرَّسُولِ» with ت, so both endings count)/معاصي, the participle «عاصي/عاصية»
 * (a kunya like «أبو العاصي» can false-positive and is excluded by id), the verbs
 * «يعصي/تعصي/أعصى/عصوا», and «عصيان/عصاة». Bare «معص» is not a stem — it would hit
 * «معصم» (bracelet); «عصا» (staff) ends in alif, «يعصي» in ي — distinct.
 */
const AR_MAASIYA = new RegExp(`${BL}${PRE}(?:معصي[ةت]|معاصي|عاصي|يعصي|تعصي|أعصى|عصوا|عصيان|عصاة)${NSUF}(?=$|${E})`);
/** «فاحشة» family — obscenity and indecency: فاحشة/فاحش, فواحش, فحشاء. */
const AR_FAHISHA = new RegExp(`${BL}${PRE}(?:فاحش|فواحش|فحشاء)${NSUF}(?=$|${E})`);
/** «خطيئة» family — the Qur'anic sin word: خطيئة/خطيئات, خطايا. */
const AR_KHATIIA = new RegExp(`${BL}${PRE}(?:خطيئ|خطايا)${NSUF}(?=$|${E})`);
/** «لمم» — the minor slips of 53:32 («إلا اللَّمَمَ»). */
const AR_LEMM = new RegExp(`${BL}${PRE}لمم${NSUF}(?=$|${E})`);
/** «فاسق/فسوق» — the wicked and their deviance. */
const AR_FASIQ = new RegExp(`${BL}${PRE}(?:فاسق|فسوق)${NSUF}(?=$|${E})`);
/** «فاجر» family — the open sinner: فاجر/فاجرة/فجار, the depravity «فجور». «فجر» (dawn) and «فجرة» (crater) lack the alif. */
const AR_FAJIR = new RegExp(`${BL}${PRE}(?:فاجر|فجار|فجور)${NSUF}(?=$|${E})`);
/** «أجرم» family — crime and the criminal: أجرم/أجرمت/أجرموا, مجرم/مجرمون/المجرمين, إجرام. */
const AR_IJRIM = new RegExp(`${BL}${PRE}(?:أجرم|يجرم|تجرم|مجرم|إجرام)${NSUF}(?=$|${E})`);
/** «كبائر» — the major sins, unambiguous. */
const AR_KABAIR = new RegExp(`${BL}${PRE}كبائر${NSUF}(?=$|${E})`);
/** «صغائر» — the minor sins, unambiguous. */
const AR_SAGHAAIR = new RegExp(`${BL}${PRE}صغائر${NSUF}(?=$|${E})`);
/**
 * Weak signals — «كبيرة» and «صغيرة» mean "big"/"small" far more often than "major/minor
 * sin" («تكبيرة» never reaches here — the stem sits inside a longer word). They count only
 * when the passage already carries a strong sin signal, which is what admits the famous
 * «لا يغادر صغيرة ولا كبيرة إلا أحصاها» (18:49, via «المجرمين») while keeping «واديا
 * صغيرا ولا كبيرة» (9:121) and «مدينة كبيرة» out.
 */
const AR_KABIRA = new RegExp(`${BL}${PRE}كبيرة${NSUF}(?=$|${E})`);
const AR_SAGHIIRA = new RegExp(`${BL}${PRE}صغيرة${NSUF}(?=$|${E})`);

/**
 * Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `sayyiat-browser` also admits it (see pick in export-api).
 */
export const SAYYIAT_EXCLUDE = new Set<string>([
  // «بذنوب من ماء فصب على ذلك المكان» — ذَنُوب here is waterskins, not sins.
  "passage/muwatta-1-166",
  // «إلا عجب الذنب» — the hadith of the tailbone; الذَّنَب is the body part, not sin.
  "passage/muwatta-2-642",
  // «منهم أبو العاصي تجدل مقعصا» — العاصي is the kunya of the poet's companion, not "the sinner".
  "passage/poem-hassan-diwan-khabat-banu-asad-02",
]);

const STRONG = new Map<RegExp, string>([
  [AR_SAYYI, "sayyi"],
  [AR_ASA_PAST, "asa"],
  [AR_ASA_IMPF, "asa"],
  [AR_ASI, "asa"],
  [AR_ISAA, "asa"],
  [AR_SAA, "saa"],
  [AR_SAA_IMPF, "saa"],
  [AR_SUU, "suu"],
  [AR_ITHM, "ithm"],
  [AR_DHANB, "dhanb"],
  [AR_MAASIYA, "maasiya"],
  [AR_FAHISHA, "fahisha"],
  [AR_KHATIIA, "khatiia"],
  [AR_LEMM, "lemm"],
  [AR_FASIQ, "fasiq"],
  [AR_FAJIR, "fajir"],
  [AR_IJRIM, "ijrim"],
  [AR_KABAIR, "kabair"],
  [AR_SAGHAAIR, "saghaair"],
]);
const WEAK: [RegExp, string][] = [
  [AR_KABIRA, "kabira"],
  [AR_SAGHIIRA, "saghiira"],
];

/** The matched signal names for a passage, or [] when it is not about «السيئات». */
export function sayyiatSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // a «كتاب...الذنوب» chapter of a hadith collection without the passage itself being about sins.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || SAYYIAT_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  for (const [re, name] of STRONG) if (re.test(raw)) hits.add(name);
  if (hits.size > 0) for (const [re, name] of WEAK) if (re.test(raw)) hits.add(name);
  return [...hits];
}

/** True when the passage mentions or carries «السيئات»-theme vocabulary. */
export function isSayyiatPassage(n: Node): boolean {
  return sayyiatSignalsOf(n).length > 0;
}

/** `sayyi` when the passage carries the «سيّئ» word family, `related` for the wider sins theme. */
export function sayyiatKindOf(n: Node): SayyiatKind {
  return sayyiatSignalsOf(n).includes("sayyi") ? "sayyi" : "related";
}

/**
 * Which corpus a sayyiat passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function sayyiatCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): SayyiatCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `sayyiat-<section>` when present, else `curated`. */
export function sayyiatTagSection(n: Node): SayyiatSection {
  const tag = n.tags.find((t) => t.startsWith("sayyiat-") && t !== SAYYIAT_TAG);
  const id = tag?.slice(8) ?? "curated";
  return (SAYYIAT_SECTIONS as readonly string[]).includes(id) ? (id as SayyiatSection) : "curated";
}
