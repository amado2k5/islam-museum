// The Centuries, Years and Months Browser's shared reads (docs/plan/56-qurun-browser.md):
// which passage records mention the centuries/generations (القرون), the years and the named
// years of the seerah (السنين والأعوام), the important months (الشهور الهامة) and the sacred
// months (الأشهر الحرم) — by the time vocabulary itself (قرن/قرون, سنة/سنين/عام/حول), by the
// twelve lunar month names (محرم، صفر، ربيع، جمادى، رجب، شعبان، رمضان، شوال، ذو القعدة، ذو
// الحجة), by the sacred-months and intercalation vocabulary (الأشهر الحرم، الشهر الحرام، النسيء),
// by the named years (عام الفيل، عام الحزن، عام الوفود، عام الرمادة) and by the canonical
// `mentions` edges already in the graph — so a month or a named year mentioned in any book
// harvested later appears here the day its passage record lands. Curated records join through
// the `qurun-browser` tag.
//
// Precision notes learned from the corpus: «سنة» is also the sunnah/practice (سنة الله، سنة
// رسول الله), so the bare singular never counts — only «سنين/سنون/أعوام/حول» or «سنة» beside a
// number or a duration verb; «عام» is also "public/general" and "this year", so it counts only
// in the named-year formulas and beside elapsed-time verbs; «قرن/قرون» is generation/century
// but «قرون» beside beasts is horns, so beast collocations gate it out; «صفر» is also zero,
// «رجب» a man's name (Ibn Rajab), «شعبان» a name, «محرم» a fiqh term (forbidden/mahram), «ربيع»
// the spring season — each counts only beside its own month collocations; «شهر» bare is the
// month noun everywhere.
import type { Node } from "./build-graph.js";

export const QURUN_TAG = "qurun-browser";
export const QURUN_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type QurunSection = (typeof QURUN_SECTIONS)[number];
export type QurunCorpus = Exclude<QurunSection, "curated">;
export type QurunKind = "period" | "mention";

/**
 * The browser's subject index: the twelve lunar months, the sacred-months complex, the year
 * and calendar concepts, the named years of the seerah and the qurun (generations/centuries)
 * concept. Month topics map to their month subject; the meta topics map to the concept
 * records; the named years map to the seerah event records.
 */
export const QURUN_SUBJECTS = [
  "concept/qurun-generations",
  "concept/sanah",
  "concept/yawm-ka-alf-sana",
  "concept/month-shahr",
  "concept/hijri-calendar",
  "concept/al-sana-al-arabiyya",
  "concept/shuhur-al-furs",
  "concept/al-ashhur-al-hurum",
  "concept/nasi",
  "concept/asma-al-ayyam-wal-shuhur-jahiliyya",
  "concept/ayyam-al-arab",
  "concept/muharram-month",
  "concept/hisab-sawm-arafa-wa-ashura",
  "concept/safar-month",
  "concept/rabi-months",
  "concept/jumada-months",
  "concept/rajab-month",
  "concept/shaban-month",
  "concept/ramadan-month",
  "concept/ramadan-fiqh",
  "concept/ashr-awakhir-ramadan",
  "concept/laylat-al-qadr",
  "concept/shawwal-month",
  "concept/dhul-qada-month",
  "concept/dhul-hijja-month",
  "concept/ashr-dhu-al-hijja",
  "concept/ayyam-al-tashriq",
  "concept/yawm-arafa-fiqh",
  "event/year-of-the-elephant-and-birth",
  "event/year-of-sorrow",
  "event/year-of-delegations",
  "event/am-al-jamaa",
  "event/fasting-of-ramadan-prescribed",
  "event/umrah-of-qada",
] as const;
export type QurunSubjectId = (typeof QURUN_SUBJECTS)[number];
export const QURUN_SUBJECT_SET = new Set<string>(QURUN_SUBJECTS);

export const QURUN_TOPICS = [
  "qurun", "sunnin", "named-years", "shuhur", "sacred", "jahiliyya-time",
  "muharram", "safar", "rabi", "jumada", "rajab", "shaban", "ramadan",
  "shawwal", "dhul-qada", "dhul-hijja",
] as const;
export type QurunTopic = (typeof QURUN_TOPICS)[number];

/** Topic -> kind: the named periods and months are "period"; the meta mentions are "mention". */
export const QURUN_TOPIC_KIND: Record<QurunTopic, QurunKind> = {
  qurun: "mention", sunnin: "mention", "named-years": "period", shuhur: "mention",
  sacred: "period", "jahiliyya-time": "mention",
  muharram: "period", safar: "period", rabi: "period", jumada: "period", rajab: "period",
  shaban: "period", ramadan: "period", shawwal: "period", "dhul-qada": "period",
  "dhul-hijja": "period",
};

/** Topic -> canonical subjects the passage joins on the subject pages. */
export const QURUN_TOPIC_SUBJECTS: Partial<Record<QurunTopic, QurunSubjectId[]>> = {
  qurun: ["concept/qurun-generations"],
  sunnin: ["concept/sanah", "concept/yawm-ka-alf-sana"],
  "named-years": ["event/year-of-the-elephant-and-birth", "event/year-of-sorrow",
    "event/year-of-delegations", "event/am-al-jamaa"],
  shuhur: ["concept/month-shahr", "concept/hijri-calendar", "concept/al-sana-al-arabiyya"],
  sacred: ["concept/al-ashhur-al-hurum", "concept/nasi"],
  "jahiliyya-time": ["concept/asma-al-ayyam-wal-shuhur-jahiliyya", "concept/ayyam-al-arab",
    "concept/shuhur-al-furs"],
  muharram: ["concept/muharram-month", "concept/hisab-sawm-arafa-wa-ashura"],
  safar: ["concept/safar-month"],
  rabi: ["concept/rabi-months"],
  jumada: ["concept/jumada-months"],
  rajab: ["concept/rajab-month"],
  shaban: ["concept/shaban-month"],
  ramadan: ["concept/ramadan-month", "concept/ramadan-fiqh", "concept/ashr-awakhir-ramadan",
    "concept/laylat-al-qadr", "event/fasting-of-ramadan-prescribed"],
  shawwal: ["concept/shawwal-month"],
  "dhul-qada": ["concept/dhul-qada-month", "event/umrah-of-qada"],
  "dhul-hijja": ["concept/dhul-hijja-month", "concept/ashr-dhu-al-hijja",
    "concept/ayyam-al-tashriq", "concept/yawm-arafa-fiqh", "concept/hisab-sawm-arafa-wa-ashura"],
};

/** Passage records whose only lexical hit is a known false positive, verified by reading. */
export const QURUN_EXCLUDE = new Set<string>([]);
/** Single-topic exclusions for verified false positives. */
export const QURUN_TOPIC_EXCLUDE = new Set<string>([]);

const DIACRITICS = /[ً-ٰٟۖ-ۭـ]/g;
/** Match-space normalization: hamza seats unified, dagger alif becomes alef, standalone hamza
 * dropped, ة→ه, ى→ي, ؤ→و, ئ→ي. Patterns are written in natural Arabic and run through the same
 * function at load, so orthography can never drift from the text. */
export function normalizeQurunArabic(s: string): string {
  return s
    .replace(/ٰ/g, "ا")
    .replace(DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ء/g, "");
}

interface TopicPattern { re: RegExp; all?: RegExp[]; none?: RegExp[]; corpora?: QurunCorpus[] }
interface TopicSpec { kind: QurunKind; pats: TopicPattern[] }

const ph = (s: string): RegExp => new RegExp(normalizeQurunArabic(String.raw`(?<![ء-ي])(?:` + s + String.raw`)(?![ء-ي])`));

/** The time lexicon. `any` hit + optional `all` co-occurrence gates + `none` exclusions. */
const SPECS: Record<QurunTopic, TopicSpec> = {
  // القرون — generations/centuries. «قرون» beside beasts is horns, so beast words gate it out.
  qurun: { kind: "mention", pats: [
    { re: ph("قرون") , none: [ph("ثور|ثيران|بقر|بقره|كبش|كباش|غنم|غنيم|وعل|ظبي|ثورين|تيس|عجل|كبشين|غزال|نعجه|ناقه|جمل|بعير|خيل|حمار")] },
    { re: ph("القرون") , none: [ph("ثور|ثيران|بقر|بقره|كبش|كباش|غنم|غنيم|وعل|ظبي|ثورين|تيس|عجل|كبشين|غزال|نعجه|ناقه|جمل|بعير|خيل|حمار")] },
    { re: ph("قرن") , all: [ph("القرن|قرنهم|قرنها|قرنه|قرني|قرنك|قرنكم|القرون|قرون|خير|مضي|مضت|خلف|وسطي|اول|ثاني|ثالث|رابع|خامس|سادس|سابع|ثامن|تاسع|عاشر|هجري|ميلادي|قبل الميلاد|الزمان|الدهر|امم|اجيال|اجيالهم")] },
    { re: ph("قرنهم") }, { re: ph("قرنها") }, { re: ph("القرون الوسطي") },
    { re: ph("خير القرون") }, { re: ph("القرون الخاليه") }, { re: ph("القرون الماضيه") },
    { re: ph("القرون المتوسطه") }, { re: ph("القرون الاولي") }, { re: ph("القرون الثلاثه") },
    { re: new RegExp(normalizeQurunArabic("القرن") + String.raw`.{0,12}` + normalizeQurunArabic("(?:اول|ثاني|ثالث|رابع|خامس|سادس|سابع|ثامن|تاسع|عاشر|عشر|هجري|ميلادي)")) },
    { re: new RegExp(normalizeQurunArabic("قرن") + String.raw`.{0,15}` + normalizeQurunArabic("(?:هجري|ميلادي|زمان|دهر|مضي|مضت|خلف)")) },
  ]},
  // السنين — years. «سنة» bare is the sunnah sense, so only the plurals, «حول/أعوام» and the
  // counted forms count; the sunnah collocations gate the singular out entirely.
  sunnin: { kind: "mention", pats: [
    { re: ph("سنين") }, { re: ph("سنون") }, { re: ph("سنينات") },
    { re: ph("اعوام") }, { re: ph("اعواما") }, { re: ph("عوام") },
    { re: ph("حول") , all: [ph("سنه|سنين|عام|اعوام|زكاه|زكواه|لقطه|مضي|مضت|كامل|هلالي|قمري|شمسي")] },
    { re: ph("حولا") , all: [ph("سنه|سنين|عام|اعوام|كامل|هلالي|قمري|مضي|مضت|زكاه|احول")] },
    { re: ph("احول") }, { re: ph("احوال") },
    { re: new RegExp(normalizeQurunArabic("(?:سنه|سنتين|عام|عامين)") + String.raw`.{0,15}` + normalizeQurunArabic("(?:ثلاث|اربع|خمس|سبع|ثمان|تسع|عشر|مائه|الف|الفين|عدد|مضت|مضي|خلت|كامله|هلاليه|قمريه|شمسيه|معدوده|معدودات)")) },
    { re: new RegExp(normalizeQurunArabic("(?:ثلاث|اربع|خمس|سبع|ثمان|تسع|عشر|عشرون|ثلاثين|اربعين|خمسين|مائه|الف|الفين|ثلاثمائه)") + String.raw`.{0,12}` + normalizeQurunArabic("(?:سنه|سنين|عام|اعوام|حولا|حول)")) },
    { re: ph("عدد السنين") }, { re: ph("الف سنه") }, { re: ph("خمسين الف سنه") },
    { re: ph("سبع سنين") }, { re: ph("ثلاثمائه سنين") }, { re: ph("عشر سنين") },
    { re: ph("مائه سنه") }, { re: ph("سنه هجريه") }, { re: ph("السنه الهجريه") },
    { re: ph("سنه ميلاديه") }, { re: ph("السنه الميلاديه") }, { re: ph("سنه قمريه") },
    { re: ph("سنه شمسيه") }, { re: ph("السنه القمريه") }, { re: ph("السنه الشمسيه") },
    { re: ph("سنه") , all: [ph("عدد|ثلاث|اربع|خمس|سبع|ثمان|تسع|عشر|مائه|الف|حول|هلاليه|قمريه|شمسيه|ميلاديه|هجريه")],
      none: [ph("سنه الله|سنه رسول|السنه|سنه نبينا|سنه نبيه|سنه المصطفي|سنه الائمه|سنه اولي|سنه ثانيه|سنه راشده|السنه النبويه|سنن")] },
    { re: ph("عام") , all: [ph("مضي|مضت|جاء|جاءت|اتي|مقبل|منصرم|ماضي|هذا|كل|ذلك|سنه|سنين|هلال|هلالي")],
      none: [ph("عام الناس|عامه|العامه|عام المسلمين|عام النظر|عام الراي")] },
  ]},
  // الأعوام المسمّاة — the named years of the seerah and of the nations.
  "named-years": { kind: "period", pats: [
    { re: ph("عام الفيل") }, { re: ph("عام الفيل") },
    { re: ph("عام الحزن") }, { re: ph("عام الاحزان") },
    { re: ph("عام الوفود") }, { re: ph("عام الوفد") },
    { re: ph("عام الرماده") }, { re: ph("عام الرماده") },
    { re: ph("عام الحج") }, { re: ph("عام حجه الوداع") },
    { re: ph("عام الجماعه") }, { re: ph("عام الجماعه والكهرباء") },
    { re: ph("عام الفتح") }, { re: ph("عام الهدنه") }, { re: ph("عام صلح الحديبيه") },
    { re: ph("عام الارصاد") }, { re: ph("عام الوعسه") }, { re: ph("عام التسره") },
    { re: ph("عام البركه") }, { re: ph("عام الطاعون") }, { re: ph("عام الجفاف") },
    { re: ph("عام الزلزال") }, { re: ph("عام الزلزله") }, { re: ph("عام الرحمه") },
    { re: ph("عام الخمس") }, { re: ph("عام العشر") }, { re: ph("عام التسع") },
    { re: ph("عام الحره") }, { re: ph("عام الجراد") }, { re: ph("عام السنه") },
    { re: ph("عام الاشعب") }, { re: ph("عام التطبيع") }, { re: ph("عام الامام") },
    { re: ph("عام المرأه") }, { re: ph("عام الاسره") },
  ]},
  // الشهور — the month unit itself and the calendrical phrases.
  shuhur: { kind: "mention", pats: [
    { re: ph("شهر") , all: [ph("هلال|قمري|هلالي|رمضان|محرم|صفر|ربيع|جمادي|رجب|شعبان|شوال|القعده|الحجه|حرام|الحرام|معلومات|الحج|اثني عشر|اثنا عشر|عده|صيام|صوم|اعتكاف|عده|ثلاثين|تسعه وعشرين|كامل|ناقص|الشهور|الاشهر|شهور|اشهر")] },
    { re: ph("شهرا") }, { re: ph("شهرين") }, { re: ph("شهور") }, { re: ph("اشهر") },
    { re: ph("شهورا") }, { re: ph("الشهور") }, { re: ph("الاشهر") },
    { re: ph("عده الشهور") }, { re: ph("اثني عشر شهرا") }, { re: ph("اثنا عشر شهرا") },
    { re: ph("اشهر معلومات") }, { re: ph("شهور الحج") }, { re: ph("اشهر الحج") },
    { re: ph("الشهر الهلالي") }, { re: ph("الشهر القمري") }, { re: ph("الشهر الهجري") },
    { re: ph("شهر قمري") }, { re: ph("شهر هلالي") }, { re: ph("شهر هجري") },
    { re: ph("التقويم الهجري") }, { re: ph("التقويم القمري") }, { re: ph("تقويم هجري") },
    { re: ph("هلال") , all: [ph("شهر|شهور|رمضان|شوال|رؤيه|رؤيته|يوم الشك|مطلع|مغيب|اثبات|اثباته")] },
  ]},
  // الأشهر الحرم — the four sacred months and the jahiliyya intercalation that tampered with them.
  sacred: { kind: "period", pats: [
    { re: ph("الاشهر الحرم") }, { re: ph("الشهور الحرم") }, { re: ph("اشهر حرم") },
    { re: ph("اربعه حرم") }, { re: ph("اربعة حرم") }, { re: ph("اربعه منها حرم") },
    { re: ph("الشهر الحرام") }, { re: ph("شهر حرام") }, { re: ph("شهرا حراما") },
    { re: ph("الاشهر الحرم الثلاثه") }, { re: ph("ثلاثه سرد") },
    { re: ph("النسيء") }, { re: ph("النسي") }, { re: ph("نسيء") },
    { re: ph("نسئ") , all: [ph("شهر|شهور|حرم|محرم|صفر|زياده|كفر|تاليه|تاليه")] },
    { re: ph("شهر الله المحرم") }, { re: ph("شهر الله") , all: [ph("محرم|رجب|حرم|الحرم")] },
    { re: ph("رجب مضر") }, { re: ph("رجب الفرد") }, { re: ph("الاصم") , all: [ph("رجب|شهر")] },
    { re: ph("لا يستحل") , all: [ph("حرم|محرم|شهر|اشهر")] },
    { re: ph("الحج اكبر") , all: [ph("حرم|اشهر|شهور|معلومات")] },
    { re: new RegExp(normalizeQurunArabic("(?:ذو القعده|ذي القعده|ذو الحجه|ذي الحجه|محرم|رجب)") + String.raw`.{0,20}` + normalizeQurunArabic("(?:حرم|الحرم|الاشهر الحرم|اربعه)")) },
  ]},
  // أسماء الزمن عند الجاهلية — the pre-Islamic time names and the Persian months.
  "jahiliyya-time": { kind: "mention", pats: [
    { re: ph("ايام العرب") }, { re: ph("اسماء الشهور") , all: [ph("جاهليه|العرب|ناتق|ثقيل|طليق|ناجر")] },
    { re: ph("ناتق") , all: [ph("محرم|شهر|الشهور|جاهليه|عرب")] },
    { re: ph("شهور الفرس") }, { re: ph("فرورديماه") }, { re: ph("مهرماه") },
    { re: ph("ايام النسيه") }, { re: ph("الفرودجان") },
  ]},

  // الشهور الاثنا عشر — each lunar month beside its own collocations.
  muharram: { kind: "period", pats: [
    { re: ph("محرم") , all: [ph("شهر|هلال|عاشوراء|يوم عاشوراء|الاشهر|الحرم|حرم|مضي|جاء|اول السنه|راس السنه|ليله|ايام|صيام|صوم")] },
    { re: ph("المحرم") , all: [ph("شهر|هلال|عاشوراء|يوم عاشوراء|الاشهر|الحرم|حرم|مضي|جاء|اول السنه|راس السنه|ليله|ايام|صيام|صوم|ناتق")] },
    { re: ph("شهر محرم") }, { re: ph("شهر المحرم") }, { re: ph("شهر الله المحرم") },
    { re: ph("عاشوراء") }, { re: ph("يوم عاشوراء") }, { re: ph("ليله عاشوراء") },
    { re: ph("راس السنه") , all: [ph("محرم|هلال|شهر|الهجريه|القمريه|احتفال|تهانيه")] },
  ]},
  safar: { kind: "period", pats: [
    { re: ph("صفر") , all: [ph("شهر|هلال|الخير|المظفر|مضي|جاء|شعبان|رمضان|المحرم|ربيع|ايام|ليله|الشهور|اشهر|جاهليه|تشاءم|طيره|صفريات")],
      none: [ph("عدد|رقم|يساوي|درجه|مئويه|فهرنهايت|تحت الصفر|سيليزيوس|صفره|رياضيات|معادله|كسور")] },
    { re: ph("شهر صفر") }, { re: ph("صفر الخير") }, { re: ph("صفر المظفر") },
    { re: ph("في صفر") }, { re: ph("بصفر") }, { re: ph("لصفر") }, { re: ph("من صفر") },
    { re: ph("صفريات") },
  ]},
  rabi: { kind: "period", pats: [
    { re: ph("ربيع الاول") }, { re: ph("ربيع الاخر") }, { re: ph("ربيع الثاني") },
    { re: ph("ربيع الاولي") }, { re: ph("ربيع الاخره") }, { re: ph("الربيعين") },
    { re: ph("شهر ربيع") }, { re: ph("مولد") , all: [ph("ربيع|النبي|شهر")] },
    { re: new RegExp(normalizeQurunArabic("ربيع") + String.raw`.{0,10}` + normalizeQurunArabic("(?:اول|اخر|ثاني|اولي|اخره|شهر)")) },
  ]},
  jumada: { kind: "period", pats: [
    { re: ph("جمادي الاولي") }, { re: ph("جمادي الاخره") }, { re: ph("جمادي الثانيه") },
    { re: ph("جمادي الاول") }, { re: ph("جمادي الاخر") }, { re: ph("جمادي الثاني") },
    { re: ph("الجمادين") }, { re: ph("شهر جمادي") },
    { re: new RegExp(normalizeQurunArabic("جمادي") + String.raw`.{0,12}` + normalizeQurunArabic("(?:اول|اولي|اخر|اخره|ثاني|ثانيه|شهر|هلال)")) },
  ]},
  rajab: { kind: "period", pats: [
    { re: ph("شهر رجب") }, { re: ph("رجب مضر") }, { re: ph("رجب الفرد") },
    { re: ph("في رجب") }, { re: ph("برجب") }, { re: ph("لرجب") }, { re: ph("من رجب") },
    { re: ph("ليله الاسراء") , all: [ph("رجب|شهر|سبعه وعشرين")] },
    { re: ph("رجب") , all: [ph("شهر|هلال|الفرد|مضر|الاصم|الاصب|الاشهر|الحرم|حرم|مضي|جاء|ايام|ليله|اسراء|معراج|عمره")],
      none: [ph("ابن رجب|رجب بن|رجب الحنبلي|زين الدين رجب|عبد الرحمن بن رجب|احمد بن رجب|رجب ايبك|رجب طيب|رجب التركي")] },
    { re: ph("الاصب") , all: [ph("رجب|شهر|صوم|صيام")] },
    { re: new RegExp(normalizeQurunArabic("رجب") + String.raw`.{0,15}` + normalizeQurunArabic("(?:شهر|حرم|الفرد|مضر|اصم|اصب)")),
      none: [ph("ابن رجب|رجب بن|رجب الحنبلي|زين الدين رجب|عبد الرحمن بن رجب|احمد بن رجب|رجب ايبك|رجب طيب|رجب التركي")] },
  ]},
  shaban: { kind: "period", pats: [
    { re: ph("شهر شعبان") }, { re: ph("شعبان المعظم") }, { re: ph("في شعبان") },
    { re: ph("بشعبان") }, { re: ph("لشعبان") }, { re: ph("من شعبان") },
    { re: ph("النصف من شعبان") }, { re: ph("نصف شعبان") }, { re: ph("ليله النصف من شعبان") },
    { re: ph("ليله البراءه") }, { re: ph("شعبان") , all: [ph("شهر|هلال|النصف|ليله|صيام|صوم|رمضان|رجب|ايام|مضي|جاء|المعظم")],
      none: [ph("ابن شعبان|شعبان بن|بني شعبان|بنو شعبان")] },
  ]},
  ramadan: { kind: "period", pats: [
    { re: ph("رمضان") }, { re: ph("شهر رمضان") }, { re: ph("شهر الصيام") },
    { re: ph("ليله القدر") }, { re: ph("ليالي القدر") }, { re: ph("ليله القدر") },
    { re: ph("العشر الاواخر") , all: [ph("رمضان|شهر|اعتكاف|ليالي|وتر|الفرديه")] },
    { re: ph("اواخر رمضان") }, { re: ph("الوتر من رمضان") }, { re: ph("الليالي الوتر") },
  ]},
  shawwal: { kind: "period", pats: [
    { re: ph("شوال") , all: [ph("شهر|هلال|ست|سته|ايام|رمضان|القعده|عيد|فطر|مضي|جاء|الحج|اشهر الحج")] },
    { re: ph("شهر شوال") }, { re: ph("ست من شوال") }, { re: ph("سته من شوال") },
    { re: ph("ايام شوال") }, { re: ph("في شوال") }, { re: ph("بشوال") }, { re: ph("من شوال") },
  ]},
  "dhul-qada": { kind: "period", pats: [
    { re: ph("ذو القعده") }, { re: ph("ذي القعده") }, { re: ph("ذوالقعده") },
    { re: ph("شهر ذي القعده") }, { re: ph("شهر ذو القعده") }, { re: ph("في ذي القعده") },
    { re: ph("عمره القضاء") }, { re: ph("عمره القضيه") },
    { re: new RegExp(normalizeQurunArabic("(?:ذو|ذي|ذات)") + String.raw`.{0,8}` + normalizeQurunArabic("(?:قعده|قعده)")) },
  ]},
  "dhul-hijja": { kind: "period", pats: [
    { re: ph("ذو الحجه") }, { re: ph("ذي الحجه") }, { re: ph("ذوالحجه") },
    { re: ph("شهر ذي الحجه") }, { re: ph("شهر ذو الحجه") }, { re: ph("في ذي الحجه") },
    { re: ph("عشر ذي الحجه") }, { re: ph("العشر من ذي الحجه") }, { re: ph("ايام العشر") , all: [ph("حجه|الحجه|نحر|ذي|ذو|معلومات|عشر")] },
    { re: ph("يوم عرفه") }, { re: ph("يوم عرفات") }, { re: ph("يوم النحر") },
    { re: ph("يوم الحج الاكبر") }, { re: ph("ايام التشريق") }, { re: ph("يوم القر") },
    { re: ph("ايام مني") , all: [ph("تشريق|حجه|الحجه|نحر|اذكار|رمي|جمرات")] },
    { re: ph("العشر المعلومات") }, { re: ph("عشر ذي الحجه المعلومات") },
  ]},
};

const EXCLUDE_WORKS = new Set<string>();

/** Vocabulary that marks a passage as *about* the time units in the general book corpus:
 * centuries, years, months, the month names and the calendrical terms. A book that merely
 * says «عام» or «سنة» in passing does not qualify; one that talks calendars and months does. */
const QURUN_CONTEXT = /قرن|قرون|سنين|سنون|اعوام|حول|شهر|شهور|اشهر|هلال|محرم|صفر الخير|شهر صفر|ربيع الاول|ربيع الاخر|جمادي|رجب|شعبان|رمضان|شوال|القعده|الحجه|عاشوراء|عرفه|تشريق|ليله القدر|النسيء|النسي|عام الفيل|عام الحزن|عام الوفود|عام الرماده|هجري|قمري|تقويم|الاشهر الحرم|الشهر الحرام|ايام التشريق|ايام العرب|ليله النصف|العشر الاواخر/;

export function qurunTopicsOf(n: Node, corpus?: QurunCorpus): QurunTopic[] {
  if (n.class !== "passage" || n.stub || QURUN_EXCLUDE.has(n.id)) return [];
  const workId = n.data.work as string | undefined;
  if (workId && EXCLUDE_WORKS.has(workId)) return [];
  const resolved = corpus ?? (workId === "work/quran" ? "quran" : "books");
  const ar = ` ${normalizeQurunArabic(String(n.data.text_search ?? n.data.text ?? ""))} `;
  // In the general book corpus a time topic needs the time lexicon somewhere in the passage;
  // the Qur'an, Sunnah and seerah name the periods themselves and are judged on the patterns.
  if (resolved === "books" && !QURUN_CONTEXT.test(ar)) return [];
  const topics = new Set<QurunTopic>();
  for (const [id, spec] of Object.entries(SPECS) as [QurunTopic, TopicSpec][]) {
    for (const p of spec.pats) {
      if (p.corpora && !p.corpora.includes(resolved)) continue;
      if (!p.re.test(ar)) continue;
      if (p.all && !p.all.some((g) => g.test(ar))) continue;
      if (p.none && p.none.some((g) => g.test(ar))) continue;
      if (QURUN_TOPIC_EXCLUDE.has(`${n.id}:${id}`)) { topics.delete(id); break; }
      topics.add(id);
      break;
    }
  }
  return [...topics];
}

/** The strongest kind among the topics hit: a named period/month > a meta mention. */
export function qurunKindOf(n: Node): QurunKind | null {
  const topics = qurunTopicsOf(n);
  if (!topics.length) return null;
  if (topics.some((t) => QURUN_TOPIC_KIND[t] === "period")) return "period";
  return "mention";
}

/** True when the passage's own matn mentions a century, year, month or sacred month. */
export function isQurunPassage(n: Node): boolean {
  return qurunTopicsOf(n).length > 0;
}

/** Corpus section from the passage's work record (same rule as the other browsers). */
export function qurunCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): QurunCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: the first `qurun-<section>` tag naming a real section, else `curated`. */
export function qurunTagSection(n: Node): QurunSection {
  for (const t of n.tags) {
    if (!t.startsWith("qurun-") || t === QURUN_TAG) continue;
    const id = t.slice(6);
    if ((QURUN_SECTIONS as readonly string[]).includes(id)) return id as QurunSection;
  }
  return "curated";
}
