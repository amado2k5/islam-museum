// The Hasanat and Sayyi'at Ledger's shared reads (docs/plan/50-hisab-browser.md): which passage
// records state how good and bad deeds are written, counted, multiplied, erased, weighed or
// reckoned, and which corpus section each belongs to. This is the «قائمة وآلة حاسبة وعدّاد
// للحسنات والسيئات»: the list is every such passage, the calculator reads the `reckoning`
// block of the curated records, and the counter is a tally kept in the visitor's browser.
//
// Detection runs at build time over the compiled graph, so a passage in any harvested book —
// and in every book harvested later — that counts a deed appears without any tagging step.
// Curated records join through the `hisab-browser` tag instead.
//
// Scope is the arithmetic of deeds only. The plain mention of «الحسنات» or «السيئات» belongs
// to the Hasanat and Sayyi'at browsers; a passage enters here only when it carries a counting
// element: a number or a multiple of deeds («عشر حسنات»، «بعشر أمثالها»، «سبعمائة ضعف»), the
// writing of a deed («كتبت له حسنة»), its erasure or expiation («محيت عنه سيئة»، «حطت
// خطاياه»، «يكفر عنكم سيئاتكم»), ranks and measures («سبع وعشرين درجة»، «قيراط»), an
// equivalence («تعدل ثلث القرآن»، «عدل عشر رقاب»), the Scale («ثقلت موازينه»، «مثقال ذرة»), the
// written record and its scribes («كراما كاتبين»، «كتابه بيمينه»), the settling of deeds
// between people («المفلس») and the reckoning itself («سريع الحساب»، «حسابا يسيرا»).
import type { Node } from "./build-graph.js";

export const HISAB_TAG = "hisab-browser";
/** The tag of a curated record that is also a calculator row (it carries a `reckoning` block). */
export const HISAB_CALC_TAG = "hisab-calculator";
/** Page sections: the four passage corpora, then the curated records. */
export const HISAB_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type HisabSection = (typeof HISAB_SECTIONS)[number];
export type HisabCorpus = Exclude<HisabSection, "curated">;
/**
 * What a passage does in the ledger: `hasanat` adds or multiplies good deeds, `sayyiat` counts
 * a bad deed or a loss, `erasure` wipes out or expiates, `scale` is the weighing, the written
 * record and the reckoning.
 */
export const HISAB_KINDS = ["hasanat", "sayyiat", "erasure", "scale"] as const;
export type HisabKind = (typeof HISAB_KINDS)[number];

const DIACRITICS = /[ؐ-ًؚ-ٟۖ-ۭـ‌-‏]/g;
/** Fold a passage text for matching: dagger alif and wasla become alif, marks go, hamzated alifs fold. */
export function hisabFold(s: string): string {
  return s
    .replace(/[ٰٱ]/g, "ا")
    .replace(DIACRITICS, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[^ء-ي\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Word pieces, written in folded spelling (no hamzated alif, final ى as ي).
const P = "(?:[وفبلك]|ال|بال|وال|فال|لل|ول|فل|وب|فب)?";
const HASANA = `${P}حسن(?:ة|ات|اته|اتهم|اتك|اتي|اتكم|اتنا)`;
const SAYYIA = `${P}سيي?[ئي](?:ة|ات|اته|اتهم|اتك|اتي|اتكم|اتنا|اتهن)`;
const KHATIA = `${P}خط(?:يئة|ايا|اياه|اياهم|اياك|اياي|اياكم|يئته|يئاته|يئاتهم|يئاتكم|يئات)`;
const DHANB = `${P}ذن(?:ب|به|وب|وبه|وبهم|وبك|وبكم|وبي|بك)`;
const DARAJA = `${P}درج(?:ة|ات|تين)`;
const NUM =
  "[وبفل]?(?:واحدة|عشر|عشرة|عشرا|عشرين|عشرون|ثلاثين|ثلاثون|اربعين|اربعون|خمسين|خمسون|ستين|ستون|سبعين|سبعون|ثمانين|ثمانون|تسعين|تسعون|مائة|مئة|مائتي|مائتا|مئتي|الف|الفي|سبعمائة|سبعمئة|ثلاثمائة|خمسمائة|خمس|سبع|ثلاث|اربع|ست|ثمان|تسع|بضع|بكل|كل)ا?";
const GAP = "(?:\\s+\\S+){0,5}?\\s+";
const B = "(?<![\\u0621-\\u064A])";
const E = "(?![\\u0621-\\u064A])";
const re = (src: string) => new RegExp(`${B}(?:${src})${E}`);

/** Each signal: a name, the kind it votes for, and its pattern over the folded text. */
const SIGNALS: [string, HisabKind, RegExp][] = [
  // numbers and multiples of good deeds
  ["count-hasanat", "hasanat", re(`${NUM}(?:\\s+\\S+){0,2}?\\s+${HASANA}|${HASANA}\\s+(?:واحدة|كاملة)`)],
  ["tenfold", "hasanat", re(`${P}عشر\\s+امثالها|عشرة\\s+امثالها|${P}سبع\\s?مائة\\s+ضعف|${P}سبعمئة\\s+ضعف|اضعافا?\\s+(?:كثيرة|مضاعفة)|${HASANA}${GAP}(?:يضاعفها|تضاعف|يضاعف)|(?:يضاعف|تضاعف|يضاعفها)${GAP}${HASANA}|${HASANA}\\s+فله\\s+خير\\s+منها`)],
  ["multiply", "hasanat", re(`فيضاعفه\\s+له|يضاعفه\\s+لكم|يضاعف\\s+لمن\\s+يشاء|مائة\\s+حبة|ضعفين|اجرهم\\s+مرتين|اجره\\s+مرتين|اجرها\\s+مرتين|جزاء\\s+الضعف|كفلين\\s+من\\s+رحمته|ويزيدهم\\s+من\\s+فضله|الحسني\\s+وزيادة|نزد\\s+له\\s+في(?:ها)?\\s+(?:حرثه|حسنا)`)],
  ["written-hasana", "hasanat", re(`[وف]?(?:كتب|كتبت|كتبها|كتبه|يكتب|تكتب|اكتبوها|نكتب)${GAP}${HASANA}|كتب\\s+له\\s+(?:به|بها|بكل)|كتب\\s+الله\\s+له\\s+(?:به|بها|بكل)`)],
  ["degree", "hasanat", re(`${NUM}(?:\\s+\\S+){0,2}?\\s+${DARAJA}|[وف]?(?:رفع|رفعه|يرفع|رفعت|ترفع|رفعك)${GAP}${DARAJA}|ولكل\\s+درجات\\s+مما\\s+عملوا|[وب]?(?:خمس|سبع)[اة]?\\s+وعشرين\\s+(?:درجة|جزءا|ضعفا|صلاة)`)],
  ["qirat-reward", "hasanat", re(`${P}قيراط(?:ان|ين)?\\s+(?:من\\s+الاجر|مثل\\s+احد)|فله\\s+قيراط(?:ان)?|له\\s+قيراط(?:ان)?`)],
  ["equivalence", "hasanat", re(`تعدل\\s+(?:ثلث|ربع|نصف)|عدل\\s+(?:عشر\\s+)?(?:رقاب|رقبة|محرر)|كعتق\\s+رقبة|كان\\s+كعدل|تعدل\\s+حجة|كاجر\\s+حجة|ثقيلتان\\s+في\\s+الميزان|تملا\\s+الميزان|مثل\\s+اجر\\s+(?:فاعله|من\\s+(?:عمل|تبعه|صام))|مثل\\s+اجور|كصيام\\s+الدهر|صيام\\s+الدهر|صام\\s+الدهر`)],
  ["two-rewards", "hasanat", re(`(?:فله|له|لهم|لهما)\\s+اجران|يوتون\\s+اجرهم\\s+مرتين|اجرهم\\s+بغير\\s+حساب`)],
  // bad deeds counted, losses
  ["count-sayyia", "sayyiat", re(`${SAYYIA}\\s+واحدة|${NUM}(?:\\s+\\S+){0,2}?\\s+${SAYYIA}|فلا\\s+يجزي\\s+الا\\s+مثلها|الا\\s+مثلها`)],
  ["written-sayyia", "sayyiat", re(`[وف]?(?:كتب|كتبت|كتبها|يكتب|تكتب|اكتبوها|تكتبوها)${GAP}${SAYYIA}|جزاء\\s+سيئة\\s+(?:بمثلها|سيئة\\s+مثلها)`)],
  ["qirat-loss", "sayyiat", re(`(?:نقص|ينقص|انتقص)${GAP}قيراط(?:ان|ين)?`)],
  ["burden", "sayyiat", re(`مثل\\s+اثام|من\\s+اوزار|وزرها\\s+ووزر|مثل\\s+وزر|تزر\\s+وازرة\\s+وزر\\s+اخري|اثقالا\\s+مع\\s+اثقالهم|كفل\\s+من(?:ها|\\s+دمها)`)],
  ["bankrupt", "sayyiat", re(`${P}مفلس|من\\s+حسناته|من\\s+سيئات\\S*\\s+(?:فطرحت|فحمل)|اخذ\\s+من\\s+(?:خطاياهم|سيئات)|فطرحت\\s+عليه`)],
  // erasure, expiation, exchange
  ["erased", "erasure", re(`[وفل]?(?:محا|محي|محيت|يمحو|يمحي|تمحها|تمحو|يمح|حط|حطت|يحط|تحط|حت|تحات|تحاتت|كفر|كفرت|يكفر|تكفر|نكفر|لاكفرن|لنكفرن|لكفرنا|ليكفر|نتجاوز|كفارة|كفارات|مكفرات|يذهبن|اذهب|خرجت|تخرج|خرج|تساقط|تساقطت)${GAP}(?:${SAYYIA}|${KHATIA}|${DHANB})|ليكفر\\s+الله\\s+عنهم\\s+اسوا|يعفو\\s+عن\\s+السيئات`)],
  ["exchanged", "erasure", re(`يبدل\\s+الله\\s+سيئاتهم\\s+حسنات|بدل\\s+حسنا\\s+بعد\\s+سوء|مكان\\s+كل\\s+سيئة\\s+حسنة|مكان\\s+السيئة\\s+الحسنة|واتبع\\s+السيئة\\s+الحسنة|اتبع\\s+السيئة\\s+الحسنة`)],
  ["forgiven-past", "erasure", re(`غفر\\s+له\\s+ما\\s+تقدم\\s+من\\s+ذنبه|غفرت\\s+(?:له\\s+)?(?:ذنوبه|خطاياه)|غفر\\s+الله\\s+له\\s+ذنوبه|كيوم\\s+ولدته\\s+امه|مثل\\s+زبد\\s+البحر|السنة\\s+(?:الماضية|التي\\s+قبله)|ما\\s+بينهما\\s+(?:ما|اذا)|ما\\s+بينه\\s+وبين\\s+الجمعة|كفارة\\s+لما\\s+بينه(?:ما|ن)|مكفرات\\s+ل?ما\\s+بينهن|كفارات\\s+لما\\s+بينهن`)],
  // the Scale, the record, the reckoning
  ["scale", "scale", re(`لا\\s+يظلم\\s+مثقال\\s+ذرة|مثقال\\s+ذرة\\s+(?:خيرا|شرا)|مثقال\\s+حبة\\s+من\\s+خردل\\s+(?:اتينا|فتكن)|من\\s+مثقال\\s+ذرة\\s+في|(?:ثقلت|خفت)\\s+موازينه|${P}موازين\\s+القسط|والوزن\\s+يومئذ|في\\s+الميزان|في\\s+ميزان(?:ه|ي|ك)?|اثقل\\s+(?:شيء\\s+)?في\\s+ميزان`)],
  ["record", "scale", re(`كراما\\s+كاتبين|رقيب\\s+عتيد|يتلقي\\s+المتلقيان|لا\\s+يغادر\\s+صغيرة|كتابه\\s+(?:بيمينه|بشماله|وراء)|اقرا\\s+كتابك|كتابنا\\s+ينطق|نستنسخ|ونكتب\\s+ما\\s+قدموا|في\\s+الزبر|مستطر|لديهم\\s+يكتبون|سنكتب\\s+ما|احصاه\\s+الله|احصيناه\\s+كتابا|كتابا\\s+يلقاه\\s+منشورا|كتاب\\s+(?:الفجار|الابرار)|رسلنا\\s+يكتبون|عليكم\\s+(?:حفظة|لحافظين)|لما\\s+عليها\\s+حافظ|له\\s+كاتبون|من\\s+خير\\s+محضرا|ما\\s+عملوا\\s+حاضرا|في\\s+امام\\s+مبين|ملك\\s+(?:اليمين|الشمال)|صاحب\\s+(?:اليمين|الشمال)|الحفظة|يتعاقبون\\s+فيكم|ترفع\\s+الاعمال|تعرض\\s+الاعمال|يرفع\\s+(?:اليه\\s+)?عمل`)],
  ["reckoning", "scale", re(`سريع\\s+الحساب(?!\\s+اهزم)|سوء\\s+الحساب|حسابا\\s+(?:يسيرا|شديدا)|يوم\\s+الحساب|${P}حاسبين|عليك\\s+حسيبا|يحاسبكم\\s+به|حاسبناها|يحاسب|حوسب|نوقش\\s+الحساب|القصاص\\s+يوم|اول\\s+ما\\s+يحاسب`)],
];

/** Verified false positives: the pattern matches but the passage does not count a deed. */
export const HISAB_EXCLUDE: ReadonlySet<string> = new Set<string>([
  "passage/quran-55-8", // «ألا تطغوا في الميزان»: the balance of trade, not the Scale of deeds
  "passage/quran-3-130", // «الربا أضعافا مضاعفة»: usury doubled, not deeds multiplied
  "passage/quran-7-95", // «بدلنا مكان السيئة الحسنة»: hardship exchanged for ease in this world
  "passage/quran-54-43", // «براءة في الزبر»: an immunity in the scriptures
  "passage/quran-33-68", // a plea of the damned against their leaders
]);

function textOf(n: Node): string {
  return hisabFold(String(n.data.text_search ?? n.data.text ?? ""));
}

/** The matched signal names of a passage (empty when it does not count a deed). */
export function hisabSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || HISAB_EXCLUDE.has(n.id)) return [];
  return hisabSignalsOfText(textOf(n));
}

/** The matched signal names of a folded text; exported for the harvest script and the tests. */
export function hisabSignalsOfText(folded: string): string[] {
  if (!folded) return [];
  const hits: string[] = [];
  for (const [name, , pattern] of SIGNALS) if (pattern.test(folded)) hits.push(name);
  return hits;
}

/** True when the passage counts, writes, erases, weighs or reckons a deed. */
export function isHisabPassage(n: Node): boolean {
  return hisabSignalsOf(n).length > 0;
}

/** The ledger kinds of a list of signals, in the fixed order of HISAB_KINDS. */
export function hisabKindsOfSignals(signals: string[]): HisabKind[] {
  const set = new Set(signals);
  const kinds = new Set<HisabKind>();
  for (const [name, kind] of SIGNALS) if (set.has(name)) kinds.add(kind);
  return HISAB_KINDS.filter((k) => kinds.has(k));
}

/** The ledger kinds of a detected passage. */
export function hisabKindsOf(n: Node): HisabKind[] {
  return hisabKindsOfSignals(hisabSignalsOf(n));
}

/**
 * Which corpus a ledger passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function hisabCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): HisabCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The calculator row of a curated record: its `reckoning` block, or null. */
export interface Reckoning {
  effect: HisabKind;
  /** Good deeds stated per unit; with `hasanat_max` the text gives a range. */
  hasanat?: number;
  hasanat_max?: number;
  /** Bad deeds written per unit. */
  sayyiat?: number;
  /** Bad deeds the text says are erased per unit. */
  erased?: number;
  /** Ranks raised per unit. */
  degrees?: number;
  /** The text states a result that is not a number of deeds (forgiveness of what is past, a qirat, an equivalence). */
  unbounded?: boolean;
  /** How many times the text says the act is done for the stated result (100 tasbih, 10 salawat); 1 when absent. */
  times?: number;
  unit: Record<string, string>;
  result?: Record<string, string>;
  basis: string[];
}

export function reckoningOf(n: Node): Reckoning | null {
  const r = n.data.reckoning as Reckoning | undefined;
  return r && n.tags.includes(HISAB_CALC_TAG) ? r : null;
}

/** Debug aid for the harvest script and the tests: each matched signal with the matched words and their offset. */
export function hisabMatchesOfText(folded: string): { signal: string; match: string; index: number }[] {
  const out: { signal: string; match: string; index: number }[] = [];
  for (const [name, , pattern] of SIGNALS) {
    const m = pattern.exec(folded);
    if (m) out.push({ signal: name, match: m[0], index: m.index });
  }
  return out;
}
