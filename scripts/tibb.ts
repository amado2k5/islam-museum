// The Medicine Browser's shared reads (docs/plan/57-tibb-browser.md): which passage records
// report or mention prophetic medicine (الطب النبوي), medicine and illness (الطب), anatomy
// (التشريح), surgery (الجراحة), drugs (الدواء) and the seeking of treatment (التداوي), and which
// corpus section each belongs to. Detection runs at build time over the compiled graph, so a
// medical report in any harvested book — and in every book harvested later — appears without any
// tagging step. Curated records join through the `tibb-browser` tag instead.
//
// The lexicon is written in folded spelling (no vowel marks, hamzated alifs as bare alif, final
// ى as ي). The ambiguous words are guarded: «في قلوبهم مرض» (the heart-disease of hypocrisy) is
// masked, «الحمى» counts as fever only beside fever vocabulary (never the protected pasture),
// «القسط» only in its drug compounds (never justice), «عسل» and «عجوة» only beside medical words
// (never the rivers of Paradise), «سم» never the eye of the needle, «عدوى» never «عدوّي», «برأ»
// only beside an illness, the wound words only beside treatment (never the legal compensation of
// wounds), and verified false positives are excluded by id.
import type { Node } from "./build-graph.js";

export const TIBB_TAG = "tibb-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const TIBB_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type TibbSection = (typeof TIBB_SECTIONS)[number];
export type TibbCorpus = Exclude<TibbSection, "curated">;
/** The six topics of the browser's title, in its order. */
export const TIBB_TOPICS = ["nabawi", "tibb", "tashrih", "jiraha", "dawa", "tadawi"] as const;
export type TibbTopic = (typeof TIBB_TOPICS)[number];

const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED\u0640\u200C-\u200F]/g;
/** Fold a passage text for matching: dagger alif and wasla become alif, marks go, hamzated alifs fold. */
export function tibbFold(s: string): string {
  return s
    .replace(/[\u0670\u0671]/g, "ا")
    .replace(DIACRITICS, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[^ء-ي\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Word pieces, in folded spelling.
const P = "(?:[وفبلك]|ال|بال|وال|فال|لل|ول|فل|وب|فب|كال|وبال|ولل)?";
const B = "(?<![\\u0621-\\u064A])";
const E = "(?![\\u0621-\\u064A])";
/** Prefix for verb forms and short words, where ب/ك/ال would build another word («كاشف», «بسم»). */
const PV = "(?:[وفل]|فل|ول)?";
const SUF = "(?:ه|ها|هم|هما|هن|ك|كم|كن|نا|ي|ني)?";
const w = (alts: string, prefix = P) => new RegExp(`${B}${prefix}(?:${alts})${E}`, "g");

/** Phrases removed before matching: they carry a lexicon word in a non-medical sense. */
const MASKS = new RegExp(
  [
    "قل(?:وبهم|به|وبكم|وبنا) مرضا?", "فزادهم الله مرضا", // the disease of the hypocrites' hearts
    "حمية الجاهلية", "الحمية حمية",
    "سم الخياط",
    "(?:ا?بن|ابي|ابو) (?:ال)?جراح", "الجراح بن",
    "(?:ابي|ابو|ابا) جبيرة", "ليلة الحصبة", "يوم الحصبة",
    "الرقي (?=حدثنا|عن |قال |اخبرنا|انبانا|ثنا |ح )", "الختان بالختان", "بختان", "ابي عبيدة بن الجراح",
    "الختان الختان", "مس الختان", "جاوز الختان", "الختانان", "الختانين",
    "حمي الله", "حول الحمي", "حمي النقيع", "حمي الربذة", "حمي ضرية", "لا حمي الا", "يرعي حول",
    "شفا حفرة", "شفا جرف",
    "دار الشفاء", "كتاب الشفا",
  ].join("|"),
  "g",
);

interface Signal {
  name: string;
  topic: TibbTopic;
  re: RegExp;
  /** When set, a match counts only with this context inside the window around it. */
  ctx?: RegExp;
  /** Half-width of the context window in characters (default 70). */
  win?: number;
}

const ILL = "مرض|مريض|داء|دواء|وجع|سقم|شفا|شفي|طبيب|علة|حمي|محموم|لدغ|لديغ|جرح|رمد|برص|جذام";

const SIGNALS: Signal[] = [
  /* ————— الطب النبوي — the remedies and treatments reported from the Prophet ————— */
  { name: "hijama", topic: "nabawi", re: w("حجامة|حجام|حجاما|حجامين|محاجم|محجم|محجمة|احتجم|احتجمت|احتجموا|احتجمنا|يحتجم|تحتجم|نحتجم|يحتجمون|حجمه|حجمني|يحجم|حجمها|فحجمه|محتجم|محجوم") },
  { name: "kayy", topic: "nabawi", re: w("الكي|كية|كيتين|اكتوي|اكتوينا|اكتويت|يكتوون|يكتوي|نكتوي|تكتوي|كواه|فكواه|كواني|يكوي|كويت|نكويه|اكووه|مكوي", "(?:[وفبل]|بال|وال|فال)?") },
  { name: "ruqya", topic: "nabawi", re: w("رقية|رقيته|رقيتك|رقيتها|استرقي|استرقوا|يسترقون|تسترقي|استرقيت|نسترقي|ارقيها|ارقيك|ارقيه|فرقاه|رقاه|رقاني|رقيت|فرقيته|يرقيه|ترقيه|الراقي|راقيا|من راق") },
  { name: "ruqya_weak", topic: "nabawi", re: w("الرقي|ارقي|يرقي|ترقي|نرقي|رقي|راق"), ctx: /اعرضوا|شرك|تمائم|التولة|نهي عن الرقي|رخص في|مريض|لدغ|لديغ| سليم |حمة|العين |نملة|وجع|شفا|عقرب|رقية|نفث|تفل|معوذ|الفاتحة|ام الكتاب|ام القران|قطيع/ },
  { name: "asal", topic: "nabawi", re: w("عسل|عسلا|عسله|العسل"), ctx: /شفا|بطن|اسقه|دواء| داء|حجم|الكي|شربة|استطلق|يشتكي|اشتكي/ },
  { name: "habba_sawda", topic: "nabawi", re: w("الحبة السوداء|الحبة السويداء|الشونيز|حبة سوداء|الحبيبة السوداء") },
  { name: "qust", topic: "nabawi", re: w("القسط البحري|القسط الهندي|العود الهندي|قسط بحري|قسط هندي") },
  { name: "qust_weak", topic: "nabawi", re: w("القسط|قسط|قسطا"), ctx: /العذرة|ذات الجنب|يسعط|يلد|حجامة|تداويتم|اشفية|سبعة اشفية/ },
  { name: "sana", topic: "nabawi", re: w("السنوت|سنوت|الشبرم|شبرم|السنا والسنوت") },
  { name: "talbina", topic: "nabawi", re: w("تلبينة|تلبين|التلبين|التلبينة") },
  { name: "kamaa", topic: "nabawi", re: w("كماة|الكماة"), ctx: /المن|ماؤها|ماءها|شفاء|للعين|العين/ },
  { name: "ajwa", topic: "nabawi", re: w("عجوة|العجوة"), ctx: /سم|سحر|شفا|داء|تصبح|ترياق|العالية/ },
  { name: "abwal", topic: "nabawi", re: w("ابوالها|ابوال الابل"), ctx: /البان|الابل|فشربوا|يشربوا|اجتووا|استوخموا/ },
  { name: "ithmid", topic: "nabawi", re: w("اثمد|الاثمد") },
  { name: "kuhl", topic: "nabawi", re: w("اكتحل|يكتحل|اكتحلوا|تكتحل|كحل|الكحل|كحلها|مكحلة"), ctx: /بصر|رمد|اثمد|تشتكي|اشتكت|دواء|يجلو|ينبت/ },
  { name: "ladud", topic: "nabawi", re: w("اللدود|لدود|لددناه|لدوه|تلدوني|لدوني|فلدوه|سعوط|السعوط|استعط|يستعط|يسعط|وجور|الوجور") },
  { name: "zamzam_shifa", topic: "nabawi", re: w("شفاء سقم|طعام طعم") },

  /* ————— الطب — medicine, physicians, illness, epidemics and the care of the sick ————— */
  { name: "tibb", topic: "tibb", re: w("طبيب|طبيبا|طبيبة|طبيبين|اطباء|الطب|طبه|متطبب|متطببا|تطبب|يتطبب|المتطببين|طبيبها|طبيبه|تطبيب|طبابة|الطبي|الطبية|صناعة الطب|علم الطب") },
  { name: "marad_nabi", topic: "tibb", re: w("مرضه الذي مات فيه|مرضه الذي توفي فيه|مرض موته|مرض النبي|مرض رسول الله|وجعه الذي|شكواه الذي|اشتد به وجعه|اشتد وجعه") },
  { name: "marad", topic: "tibb", re: w("مرض|مرضا|مرضه|مرضها|كنتم مرضي|منكم مرضي|المرضي|مرضك|مرضت|مرضنا|مرضوا|يمرض|تمرض|مريض|مريضا|مريضة|مريضه|مريضهم|مرضاهم|مرضاكم|مرضانا|امراض|امراضهم|مرضة|تمريض|مرضته|يمرضه|تمرضه|مرضها") },
  { name: "suqm", topic: "tibb", re: w("سقم|سقما|سقمه|سقيم|سقيما|اسقام|سقام|الاسقام") },
  { name: "waja", topic: "tibb", re: w("وجع|وجعا|وجعه|وجعها|وجعي|وجعك|اوجاع|وجعت|موجوع|يوجع|توجع|اوجعه|الوجع|وبالوجع", "(?:[فبلك]|ال|بال|وال|فال|لل|و)?") },
  { name: "shakwa", topic: "tibb", re: w("اشتكي|يشتكي|اشتكت|تشتكي|اشتكيت|يشتكون|شكوي|شكاة|شكا|يشكو|شاك"), ctx: /عين|عيني|راس|بطن|وجع|مرض|الم|ضرس|صدر|حمي|يعود|رقي|دواء|قرحة|رمد|شديدا|فعاد|جسد|رجل|ذكر/ },
  { name: "humma", topic: "tibb", re: w("محموم|محمومة|محموما|وعك|وعكا|يوعك|موعوك|توعك|وعكه|وعكت|حمي يثرب|ام ملدم|الحميات|حميات|حمي الربع") },
  { name: "humma_weak", topic: "tibb", re: w("الحمي|حمي"), ctx: /فيح|ابردوها|وعك|كير|خطايا|زمزم|فور|تنفض|اخذته|اصابته|اصابتهم|محموم|تسبي|لا تسبوا|ربع|نافض|صالب|حظ المومن|المدينة|يثرب|جهنم|مهيعة|الجحفة|اصابه|صداع|مرض|سهر/ },
  { name: "waba", topic: "tibb", re: w("طاعون|طواعين|وباء|وبيئة|وبئة|مطعون|المطعون|الطواعين|موتان") },
  { name: "adwa", topic: "tibb", re: w("لا عدوي|اعدي الاول|ممرض علي مصح|لا يورد ممرض", "(?:[وف])?") },
  { name: "adwa_weak", topic: "tibb", re: w("العدوي|عدوي|يعدي"), ctx: /طيرة|هامة|صفر|مجذوم|جرب|ممرض|مصح/ },
  { name: "judham", topic: "tibb", re: w("الجذام|مجذوم|مجذومين|مجذوما|مجذومة|جذمي|برص|ابرص|برصاء|الاكمه|اكمه|بهق") },
  { name: "amrad", topic: "tibb", re: w("فالج|مفلوج|لقوة|ذات الجنب|عرق النسا|جدري|مجدور|حصبة|برسام|مبرسم|قولنج|بواسير|باسور|ناسور|نقرس|يرقان|الجرب|دمل|دمامل|صداع|مصدوع|رمد|ارمد|رمدت|رمداء|زكام|مزكوم|سعال|ذربت|استطلق بطنه|استطلاق|اسهال|مصروع|المصروع|خدرت رجل|شلاء|شلت يد|الدبيلة") },
  { name: "udhra", topic: "tibb", re: w("العذرة"), ctx: /القسط|العود الهندي|تدغرن|اعلقت|يسعط|العلاق/ },
  { name: "sar", topic: "tibb", re: w("اصرع|تصرع|يصرع|الصرع"), ctx: /اتكشف|ادع الله|جنون|المس|افاق|يفيق|خنق|مصروع/ },
  { name: "iyada", topic: "tibb", re: w("عاد مريضا|يعود مريضا|عيادة المريض|عودوا المريض|عودوا المرضي|عائد المريض|عيادة المرضي|يعوده|نعوده|تعوده|اعوده|يعودني|يعودونه|يعودها|عواده|عيادته") },
  { name: "iyada_weak", topic: "tibb", re: w("عاده|عادني|عدناه|فعاده|عدته|عادها|عدت"), ctx: /مرض|مريض|وجع|شكو|اشتك|يعود|فلم تعدني/ },
  { name: "bimaristan", topic: "tibb", re: w("بيمارستان|مارستان|المارستان|البيمارستان|مستشفي|المستشفي|مستشفيات|الكحال|كحالا|الكحالين|بيطار|البيطرة|البلغم|الاخلاط|النبض|القارورة والنبض|الامزجة|مزاج البدن|العلل والاعراض|حفظ الصحة") },
  { name: "ilaj", topic: "tibb", re: w("علاج|علاجه|علاجها|معالجة|يعالج|عالجه|يعالجه|تعالج|معالج|عولج|معالجته"), ctx: new RegExp(ILL) },
  { name: "bur", topic: "tibb", re: w("برا|يبرا|برئ|فبرا|برات|ابرا|تبرئ|ابرئ|البرء|برء|يبرئ|فبرئ|برات"), ctx: /مرض|مريض|داء|دواء|وجع|جرح|الاكمه|الابرص|سقم|شفا|رمد|علة|لدغ|رقي|تفل|بصق|باذن الله/ },
  { name: "sihha", topic: "tibb", re: w("صحة|الصحة|صحته|صحتك|مصح|اصح الله"), ctx: /فراغ|سقم|مرض|جسم|بدن|عافية|شباب|مريض|ممرض/ },
  { name: "himya", topic: "tibb", re: w("حمية|الحمية|احتمي|يحتمي|يحمي احدكم مريضه|يحمي سقيمه"), ctx: /مريض|مرض|ناقه|طعام|دواء|داء|تمر|رطب|عنب|سقيم|المعدة/ },

  /* ————— التشريح — the body, its organs and the stages of its creation ————— */
  { name: "janin", topic: "tashrih", re: w("نطفة|نطفته|النطف|علقة|مضغة|امشاج|اجنة|مشيمة|بطون امهاتكم|بطون امهاتهم|بطن امه|في الارحام|ارحامهن|في الرحم|بالرحم ملكا|تغيض الارحام|قرار مكين|ظلمات ثلاث|ماء دافق|ماء مهين|مخلقة|سلالة من") },
  { name: "aada", topic: "tashrih", re: w("الترائب|حبل الوريد|الوتين|بنانه|ابهري|الابهر|اكحله|الاكحل|مفاصل|مفاصله|ثلاثمائة مفصل|سبعة امعاء|الامعاء|الكبد|كبده|كبدها|الطحال|طحال|كليتيه|الكليتين|ام الدماغ|النخاع|المعدة|معدته|شريان|شرايين|الشرايين|اوردة|الوريد|اعصاب|الاعصاب|غضروف|عجب الذنب|تشريح|التشريح|القحف|الجمجمة|الحنجرة|الحلقوم|التراقي|المريء|غدة|الغدد|المثانة|مثانة|الحجاب الحاجز|عضلة|عضلات|العضل|الحدقة|حدقة|القرنية|الشبكية|الرطوبة الجليدية|العصبة المجوفة|في معي واحد|ذلك عرق|عرق وليست|الدورة الدموية|بطني القلب|الشريان الوريدي") },
  { name: "janin_weak", topic: "tashrih", re: w("جنين|جنينا|جنينها|الجنين"), ctx: /بطن امه|نطفة|علقة|مضغة|خلق|الرحم|ينفخ|الروح|اربعين/ },
  { name: "uruq", topic: "tashrih", re: w("العروق|عروقه|عروق"), ctx: /الدم|لحم|بدن|جسد|القلب|يجري|شريان|نبض|الودك/ },
  { name: "sulama", topic: "tashrih", re: w("سلامي"), ctx: /صدقة|مفصل|عظم/ },
  { name: "izam", topic: "tashrih", re: w("عظاما|العظام|عظامه|العظم"), ctx: /لحما|كسونا|مضغة|ننشزها|كسر|جبر|مفصل|وهن/ },

  /* ————— الجراحة — wounds and their treatment, operations, bone-setting ————— */
  { name: "jiraha", topic: "jiraha", re: w("الجراحين|جرائحي|علم الجراحة|صناعة الجراحة|الفصد|فصاد|افتصد|يفتصد|فصد|ختان|اختتن|يختتن|اختتنت|مختون|خاتنة|خفاض|اخفضي|جبيرة|الجبائر|جبائر|جبيرته|تجبير|ضماد|ضمادة|ضمد|يضمد|ضمده|يضمدهما|مبضع|المبضع|مشرط|نشر رجله|انفا من ذهب|انفا من ورق|كسر عظم|وثئت|عمل اليد|صناعة اليد") },
  { name: "hasm", topic: "jiraha", re: w("حسمه|فحسمه|احسموه|حسم|يحسم|بط|يبط|فبطه"), ctx: /عرق|جرح|دم|قطع|نار|كوي|اكحل|ورم|خراج|مشقص/ },
  { name: "jurh", topic: "jiraha", re: w("جراحة|جراحات|جرح|جرحه|جرحا|جراح|جراحه|جراحاته|جراحاتهم|جريح|جريحا|الجرحي|جرحي|جرحاهم|مجروح|جرحت|جروح|الجروح|الكلمي|كلوم|شجة|شج"), ctx: /داو|دواء|طبيب|كواه|الكي|حسم|رقا الدم|يرقا|استمسك الدم|ضمد|عصب|عصابة|حشي|حشت|حصير|رماد|خاط|برا|اندمل|تمريض|يسقين|نسقي|نزف|يتيمم|جبيرة|فتيلة|مرهم|يعصر|يعصب/ },
  { name: "nisa_jarha", topic: "jiraha", re: w("نداوي الجرحي|يداوين الجرحي|نداوي الكلمي|تداوي الجرحي|واداوي الجرحي|اداوي الجرحي|نرد الجرحي|رفيدة") },
  { name: "shaqq_sadr", topic: "jiraha", re: w("شق صدره|فشق صدري|شق عن قلبه|فشق عن قلبه|فشق بطني|فشق بطنه|شق بطنه|ففرج صدري|فرج صدري|اثر المخيط|اثر ذلك المخيط|فاستخرج القلب|فاستخرج قلبي|شق الصدر") },
  { name: "jabr", topic: "jiraha", re: w("جبر|يجبر|فجبر|انجبر|المجبر"), ctx: /عظم|كسر|يده|رجله|ساق|كسير/ },

  /* ————— الدواء — drugs, simples, poisons and antidotes ————— */
  { name: "dawa", topic: "dawa", re: w("دوا[ءؤئ]" + SUF + "|ادوية|الادوية|ادويتهم|ادويتها") },
  { name: "daa", topic: "dawa", re: w("دا[ءؤئ]" + SUF + "|ادواء|داءان|دائين", "(?:[ولب]|وال|بال|فال|لل|ال)?") },
  { name: "samm", topic: "dawa", re: w("السم|مسموم|مسمومة|مسموما|ترياق|درياق|الترياق|ترياقا") },
  { name: "samm_weak", topic: "dawa", re: w("سم|سما", "(?:[وف])?"), ctx: /شرب|تحسي|اكل|قتل نفسه|ذراع|شاة|يهود|ترياق|عجوة|سحر|يتحساه|ساعة/ },
  { name: "aqaqir", topic: "dawa", re: w("عقاقير|العقاقير|مرهم|مراهم|ذرور|سفوف|معجون|المعاجين|اقرباذين|مفردات الادوية|الادوية المفردة|الادوية المركبة|صيدلة|صيدلاني|الصيادلة|العشابين|عشاب|الحلبة|حلبة") },
  { name: "hinna", topic: "dawa", re: w("حناء|الحناء"), ctx: /وجع|قرحة|شوكة|رجليه|صداع|نكبة|اخضبهما/ },

  /* ————— التداوي — seeking treatment and cure, and its rulings ————— */
  { name: "tadawi", topic: "tadawi", re: w("تداوي|تداووا|تداوينا|يتداوي|نتداوي|اتداوي|تتداوي|يتداوون|التداوي|مداواة|المداواة|داوي|داواه|يداوي|يداويه|داووا|فداووه|داوني|اداوي|يداوين|نداوي|تداويتم|يتداوي|استشفي|يستشفي|استشفوا|يستشفون|نستشفي|فتداووا") },
  { name: "shifa", topic: "tadawi", re: w("شفا[ءؤئ]" + SUF + "|الشافي|اشفية") },
  { name: "shifa_verb", topic: "tadawi", re: w("يشفي|يشفيه|يشفين|يشفيك|يشفيني|اشف|اشفه|اشفني|اشفها|شفاك|شفاني|شفاه الله|شفاها الله|شفي|شفيت|يشف|نشفي|يشفيك|تشفي", PV) },
  { name: "haram_dawa", topic: "tadawi", re: w("ليس بدواء|ليست بدواء|ولكنه داء|ولكنها داء|شفاءكم فيما حرم|الدواء الخبيث|دواء خبيث") },
];

/**
 * The jars of the signature view (site/src/components/sig/TibbJars.astro): each jar gathers the
 * signals of one remedy, disease or procedure, stands on the shelf of its topic, and names the
 * museum record that explains it where one exists. Every signal belongs to exactly one jar; the
 * view throws when a signal has no jar or a named record is missing.
 */
export const TIBB_JARS: { id: string; topic: TibbTopic; signals: string[]; record?: string }[] = [
  { id: "hijama", topic: "nabawi", signals: ["hijama"], record: "concept/hijama" },
  { id: "kayy", topic: "nabawi", signals: ["kayy"], record: "concept/al-kayy" },
  { id: "ruqya", topic: "nabawi", signals: ["ruqya", "ruqya_weak"], record: "concept/ruqya" },
  { id: "asal", topic: "nabawi", signals: ["asal"], record: "concept/asal" },
  { id: "habba_sawda", topic: "nabawi", signals: ["habba_sawda"], record: "concept/al-habba-al-sawda" },
  { id: "qust", topic: "nabawi", signals: ["qust", "qust_weak"], record: "concept/al-qust-al-hindi" },
  { id: "sana", topic: "nabawi", signals: ["sana"], record: "concept/al-sana-wal-sannut" },
  { id: "talbina", topic: "nabawi", signals: ["talbina"], record: "concept/al-talbina" },
  { id: "kamaa", topic: "nabawi", signals: ["kamaa"], record: "concept/al-kamaa" },
  { id: "ajwa", topic: "nabawi", signals: ["ajwa"] },
  { id: "abwal", topic: "nabawi", signals: ["abwal"] },
  { id: "ithmid", topic: "nabawi", signals: ["ithmid", "kuhl"], record: "concept/al-ithmid" },
  { id: "ladud", topic: "nabawi", signals: ["ladud"], record: "concept/al-ladud-wal-saut" },
  { id: "zamzam_shifa", topic: "nabawi", signals: ["zamzam_shifa"] },
  { id: "tibb", topic: "tibb", signals: ["tibb"], record: "concept/medicine" },
  { id: "marad", topic: "tibb", signals: ["marad", "suqm"], record: "concept/disease" },
  { id: "marad_nabi", topic: "tibb", signals: ["marad_nabi"] },
  { id: "waja", topic: "tibb", signals: ["waja", "shakwa"] },
  { id: "humma", topic: "tibb", signals: ["humma", "humma_weak"], record: "concept/al-humma" },
  { id: "waba", topic: "tibb", signals: ["waba"], record: "concept/al-taun" },
  { id: "adwa", topic: "tibb", signals: ["adwa", "adwa_weak"], record: "concept/adwa" },
  { id: "judham", topic: "tibb", signals: ["judham"] },
  { id: "amrad", topic: "tibb", signals: ["amrad", "udhra", "sar"] },
  { id: "iyada", topic: "tibb", signals: ["iyada", "iyada_weak"], record: "concept/iyada" },
  { id: "bimaristan", topic: "tibb", signals: ["bimaristan"] },
  { id: "ilaj", topic: "tibb", signals: ["ilaj", "bur"], record: "concept/medical-treatment" },
  { id: "sihha", topic: "tibb", signals: ["sihha", "himya"], record: "concept/health" },
  { id: "janin", topic: "tashrih", signals: ["janin", "janin_weak"], record: "concept/marahil-al-janin" },
  { id: "aada", topic: "tashrih", signals: ["aada", "uruq"], record: "concept/anatomy" },
  { id: "sulama", topic: "tashrih", signals: ["sulama", "izam"] },
  { id: "jurh", topic: "jiraha", signals: ["jurh", "hasm"], record: "concept/mudawat-al-jarha" },
  { id: "nisa_jarha", topic: "jiraha", signals: ["nisa_jarha"] },
  { id: "jiraha", topic: "jiraha", signals: ["jiraha", "jabr"], record: "concept/al-jiraha" },
  { id: "shaqq_sadr", topic: "jiraha", signals: ["shaqq_sadr"], record: "event/shaqq-al-sadr" },
  { id: "dawa", topic: "dawa", signals: ["dawa", "daa"], record: "concept/al-adwiya-al-mufrada" },
  { id: "samm", topic: "dawa", signals: ["samm", "samm_weak"], record: "concept/al-tiryaq" },
  { id: "aqaqir", topic: "dawa", signals: ["aqaqir", "hinna"] },
  { id: "tadawi", topic: "tadawi", signals: ["tadawi"], record: "concept/tadawi" },
  { id: "shifa", topic: "tadawi", signals: ["shifa", "shifa_verb"] },
  { id: "haram_dawa", topic: "tadawi", signals: ["haram_dawa"] },
];
/** Every signal name of the lexicon, for the view's build check. */
export const TIBB_SIGNAL_NAMES: readonly string[] = SIGNALS.map((x) => x.name);

/** Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `tibb-browser` also admits it (see pick in export-api). */
export const TIBB_EXCLUDE: ReadonlySet<string> = new Set<string>([
  "passage/sahaba-isaba-007", // «يوم حنين» misread by the OCR as «يوم جنين»
]);

/** Each matched signal of a folded text with the matched words and their offset; the first
 *  admitted match of each signal. Exported for the harvest scripts and the tests. */
export function tibbMatchesOfText(folded: string): { signal: string; topic: TibbTopic; match: string; index: number }[] {
  if (!folded) return [];
  const text = folded.replace(MASKS, (m) => " ".repeat(m.length));
  const out: { signal: string; topic: TibbTopic; match: string; index: number }[] = [];
  for (const s of SIGNALS) {
    s.re.lastIndex = 0;
    for (const m of text.matchAll(s.re)) {
      if (s.ctx) {
        const win = s.win ?? 70;
        const around = text.slice(Math.max(0, m.index! - win), m.index!) + " " + text.slice(m.index! + m[0].length, m.index! + m[0].length + win);
        if (!s.ctx.test(around)) continue;
      }
      out.push({ signal: s.name, topic: s.topic, match: m[0], index: m.index! });
      break;
    }
  }
  return out;
}

/** Signals that are common figures of speech or passing notices outside the Qur'an and the
 *  hadith reports (a chronicle's «ومرض فلان», a poet's «شفاء الغليل»): in the book corpora they
 *  count only beside another signal. */
export const TIBB_WEAK_IN_BOOKS: ReadonlySet<string> = new Set(["marad", "waja", "suqm", "shakwa", "shifa", "shifa_verb", "daa", "bur", "ithmid", "iyada_weak", "sihha"]);

/** The matched signal names of a folded text. `book` applies the book-corpus rule: a passage
 *  whose only hits are weak-in-books signals is not a medical passage. */
export function tibbSignalsOfText(folded: string, book = false): string[] {
  const signals = tibbMatchesOfText(folded).map((m) => m.signal);
  if (book && signals.every((s) => TIBB_WEAK_IN_BOOKS.has(s))) return [];
  return signals;
}

/** The topics of a list of signal names, in the fixed order of TIBB_TOPICS. */
export function tibbTopicsOfSignals(signals: string[]): TibbTopic[] {
  const set = new Set(signals.map((s) => SIGNALS.find((x) => x.name === s)?.topic).filter(Boolean) as TibbTopic[]);
  return TIBB_TOPICS.filter((t) => set.has(t));
}

const textOf = (n: Node): string => tibbFold(String(n.data.text_search ?? n.data.text ?? ""));

/** The matched signal names of a passage (empty when it is not a medical passage). Only the
 *  passage's own text counts: labels and summaries are museum metadata. */
export function tibbSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub || TIBB_EXCLUDE.has(n.id)) return [];
  const scripture = n.data.work === "work/quran" || n.data.unit === "hadith" || n.data.unit === "ayah";
  return tibbSignalsOfText(textOf(n), !scripture);
}

/** True when the passage reports or mentions medicine in any of the six topics. */
export function isTibbPassage(n: Node): boolean {
  return tibbSignalsOf(n).length > 0;
}

/** The medical topics a passage touches. */
export function tibbTopicsOf(n: Node): TibbTopic[] {
  return tibbTopicsOfSignals(tibbSignalsOf(n));
}

/**
 * Which corpus a medical passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), and
 * every other harvested work. Works not yet harvested land in the right section by their genre
 * the day their passages arrive.
 */
export function tibbCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): TibbCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section of a curated record: `tibb-<section>` when present, else `curated`. */
export function tibbTagSection(n: Node): TibbSection {
  const tag = n.tags.find((t) => t.startsWith("tibb-") && t !== TIBB_TAG && (TIBB_SECTIONS as readonly string[]).includes(t.slice(5)));
  return tag ? (tag.slice(5) as TibbSection) : "curated";
}

/** The topics of a curated record, from its `tibb-<topic>` tags. */
export function tibbTagTopics(n: Node): TibbTopic[] {
  return TIBB_TOPICS.filter((t) => n.tags.includes(`tibb-${t}`));
}
