// The Akhlaq and Mu'amalat Browser's shared reads (docs/plan/54-akhlaq-browser.md): which passage
// records carry ethics (virtues and vices) and dealings (the mu'amalat contracts and rulings)
// mentions, and which corpus section each belongs to. Detection runs at build time over the
// compiled graph, so an akhlaq or mu'amalat passage in any harvested book — and in every book
// harvested later — appears without any tagging step. Curated records join through the
// `akhlaq-browser` tag instead. Scope is character ethics and social dealings only: worship
// rites (prayer, fasting, dhikr, du'a) belong to the Ibadat and Du'a browsers; bay'ah
// (allegiance), «ربا» as growth, «حكم» as wisdom, «شهادة» as martyrdom/testimony-of-faith and
// «أجر» as bare reward are out of scope.
import type { Node } from "./build-graph.js";

export const AKHLAQ_TAG = "akhlaq-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const AKHLAQ_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type AkhlaqSection = (typeof AKHLAQ_SECTIONS)[number];
export type AkhlaqCorpus = Exclude<AkhlaqSection, "curated">;
/** `virtue`/`vice` are akhlaq-track, `dealing` is mu'amalat-track, `mention` is the chapter-level words. */
export type AkhlaqKind = "virtue" | "vice" | "dealing" | "mention";
export type AkhlaqTrack = "akhlaq" | "muamalat";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/**
 * One signal = a trait or contract family: `id` (the matched signal name), `topic` (the card chip
 * and the `akhlaq-<topic>` tag vocabulary), `kind` (virtue/vice/dealing/mention), `re` (the guarded
 * pattern). Track derives from kind: virtue|vice → akhlaq, dealing → muamalat, mention → from topic.
 */
interface AkhlaqSignal {
  id: string;
  topic: string;
  kind: AkhlaqKind;
  re: RegExp;
}

const S = (id: string, topic: string, kind: AkhlaqKind, body: string): AkhlaqSignal => ({
  id, topic, kind, re: new RegExp(`${BL}(?:[وبفسل]{0,2})?(?:${body})(?=$|${E})`),
});

const SIGNALS: AkhlaqSignal[] = [
  // ── Virtues (akhlaq track) ─────────────────────────────────────────────
  // الصدق: صدقاً/الصدق/صادقين/اصدق — «صدقة» (charity) never matches: ة after صدق is not a boundary.
  S("sidq", "sidq", "virtue", String.raw`(?:[وبفل]){0,2}صدق(?:اً|ا|وا|و|ه|ها|هم|هما|كم|كما|كن|نا|ي|ت|تم|تن)|صادق(?:ين|ا|ون|ة|ه|ها|هم|هما|كم|نا|تي|تك|ي|نا)?|الصادق(?:ين|ون|ة|ه|ها)?`),
  // الأمانة والأمين — trust and trustworthiness.
  S("amana", "amana", "virtue", String.raw`أمانة|الأمانات|أمانات|مأمون|المأمون|أمين(?:اً|ا|ة|ين|ون|ه|ها|هم|هما|كم|نا|ي)?|يؤتمن|ائتمن`),
  // الوفاء noun + the وفى verbs when they take a ب-object (handled below: «توفي» = die is gated).
  S("wafa_noun", "wafa", "virtue", String.raw`وفاء|الوفاء|الوفي(?:ّ|ء)?|أوفياء|أوفى`),
  // الصبر.
  S("sabr", "sabr", "virtue", String.raw`صبر|صبراً|صبروا|صابر|الصابر|الصابرين|الصابرون|صبرت|صبركم|اصبروا|اصبر|يصبر|تصبر|صبور|الصبور|مصابر|مصبرة`),
  // الشكر.
  S("shukr", "shukr", "virtue", String.raw`شكر|شكراً|شكروا|شاكر|الشاكر|الشاكرين|الشاكرون|شكرا|اشكر|نشكر|يشكر|تشكر|شكور|الشكور`),
  // التواضع والخشوع.
  S("tawadu", "tawadu", "virtue", String.raw`تواضع|متواضع|المتواضعين|يتواضع|خشوع|الخاشعين|خاشع|خاشعون|خشعوا|يخشع|خضوع|ذليلاً للمؤمنين|أذلة على المؤمنين|أذلة`),
  // الإحسان والمحسنون («أحسن» superlative rides along — still a mention of excellence).
  S("ihsan", "ihsan", "virtue", String.raw`إحسان|الإحسان|احسان|محسن|المحسنين|محسنين|محسناً|أحسن|أحسنت|أحسنتم|أحسنوا|يحسن|الإحساني`),
  // الحياء.
  S("haya", "haya", "virtue", String.raw`الحياء|حياء|حياءً|يستحي|يستحيي|تستحيي|استحيا|استحى`),
  // الحلم والعفو والصفح (حلم bare is gated below against the dream sense).
  S("hilm", "hilm", "virtue", String.raw`الحليم|حليم|حليماً|حلماء|العفو|عفو|عفواً|العافين|يعفو|تعفو|اعفوا|اعف|الصفح|صفح|يصفح|اصفح`),
  // الإخلاص والمخلصون.
  S("ikhlas", "ikhlas", "virtue", String.raw`إخلاص|الإخلاص|اخلاص|مخلص|المخلصين|مخلصين|مخلصاً|أخلص|أخلصوا|يخلص|اخلصوا`),
  // التوبة والتائبون.
  S("tawba", "tawba", "virtue", String.raw`توبة|التوبة|توبوا|تاب|يتوب|تائب|التائبين|تائبون|أتوب|متاب|تابوا|تابت`),
  // الكرم والإيثار.
  S("karam", "karam", "virtue", String.raw`كرم|الكرام|كريم|كريماً|أكرم|يكرم|يكرمون|أكرمت|إيثار|يؤثرون|آثر|يؤثر|يثار|أثر`),
  // بر الوالدين — the parents' terms themselves carry the duty.
  S("birr", "birr", "virtue", String.raw`بر الوالدين|بالوالدين|الوالدين|والديه|والديهما|والديك|والدتك|والدته|والدتها|أبويه|أبويهما|أبويك|الأبرار|براً|بارّ|البار|أبرار|بررت`),
  // صلة الرحم — kinship ties (الرحيم is a divine name and stays out).
  S("rahim", "rahim", "virtue", String.raw`الأرحام|الرحم\b|صلة الرحم|صلة الأرحام|أرحام|أرحامهم|رحماء|رحماً|الرحمات`),
  // حق الجار.
  S("jiwar", "jiwar", "virtue", String.raw`الجار|جاره|جارها|الجيران|الجوار|الجيرة|جاري|جاركم|جاريته`),
  // حسن الظن وسوء الظن.
  S("husn-zann", "husn-zann", "virtue", String.raw`حسن الظن|سوء الظن|ظن السوء|الظنون`),
  // النصيحة.
  S("nasiha", "nasiha", "virtue", String.raw`النصيحة|نصيحة|نصح|انصح|ينصح|تناصح|الناصح|ناصح|يحب لأخيه|يحب لنفسه|تحب لأخيك`),
  // كف الأذى ولا ضرر.
  S("kaf-adha", "kaf-adha", "virtue", String.raw`كف الأذى|يكف أذاه|كاف الأذى|لا يؤذي|لا ضرر ولا ضرار|آذى`),
  // إتقان العمل.
  S("itqan", "itqan", "virtue", String.raw`إتقان|أتقن|يتقن|متقن|أتقنوا|إتقان العمل`),
  // الرحمة والراحمون.
  S("rahmah", "rahmah", "virtue", String.raw`رحمة|الرحمة|الراحمون|راحم|يرحم|يرحمون|ترحم|المرحمة|رحماً|ارحموا|مراحم`),
  // العدل والقسط (المعاملة والشهادة; «عدل» as equivalence is a mention anyway).
  S("adl", "adl", "virtue", String.raw`العدل|عدل|عدلاً|يعدل|قسط|القسط|قسطاً|مقسط|المقسطين|أقسط|بالقسط|قاسط|ميزان العدل`),
  // القناعة والرضا بالقسمة.
  S("qanaa", "qanaa", "virtue", String.raw`قناعة|قنوع|قنع|اقتنع|الرضا بما|رضي بما قسم`),

  // ── Vices (akhlaq track) ───────────────────────────────────────────────
  S("kadhib", "kadhib", "vice", String.raw`كذب|الكذب|كذباً|كذبوا|كاذب|الكاذب|الكاذبين|الكاذبون|كاذبون|يكذب|يكذبون|كذاب|الكذاب|أكذب|يكذّب`),
  S("khiyana", "khiyana", "vice", String.raw`خيانة|الخيانة|يخون|خائن|الخائنين|خائنون|خوان|الخوان|خائنات|خيانةً|غدر|الغدر|يغدر|غادر|الغادر`),
  // الكبر والعجب والخيلاء — bare كبر would hit «كبير» (big); the boundary check saves it.
  S("kibr", "kibr", "vice", String.raw`الكبر|كبرياء|متكبر|المتكبرين|تكبر|استكبر|المستكبرين|كبراء?|عجب|العجب|معجب|خيلاء|الخيلاء|بطر|البطر`),
  S("riya", "riya", "vice", String.raw`رياء|الرياء|يرائي|يراءون|مراء|رائي الناس|الرياء وسمعة|سمعة الناس`),
  S("hasad", "hasad", "vice", String.raw`حسد|الحسد|حاسد|الحاسد|الحاسدون|يحسد|يحسدون|حسداً|حاسدون`),
  S("bukhl", "bukhl", "vice", String.raw`بخل|البخل|بخيل|البخلاء|بخلاء|يخل|شح|الشح|شحيح|شحاً`),
  S("ghiba", "ghiba", "vice", String.raw`غيبة|الغيبة|يغتب|يغتاب|اغتاب|اغتياب|اغتبت|غيبةً`),
  S("namima", "namima", "vice", String.raw`نميمة|النميمة|نمام|النمام|نميم|يمشي بالنميمة|هماز|الهماز|لماز|همزة|الهمزة|لمزة|اللمزة|سخرية|يسخر|يسخرون|سخريا|سخروا|لمز|اللمز|همز`),
  S("fahish-sabb", "fahish", "vice", String.raw`فحش|الفحشاء|فاحشة|الفاحشة|فحشاء|بذي|البذيء|سب|يسب|يساب|سباب|شتم|لعن|اللعن|لعنة|يلعن|طعن`),
  S("ghadab", "ghadab", "vice", String.raw`غضب|الغضب|يغضب|غضبان|الغضبان|غضباً|غيظ|الغيظ|كظم الغيظ|كاظمين الغيظ|كظمت`),
  S("zulm", "zulm", "vice", String.raw`ظلم|الظلم|ظالم|الظالم|الظالمين|الظالمون|ظالمون|يظلم|ظلموا|ظلماً|ظلمت|مظلوم|ظليمة`),
  S("uquq", "uquq", "vice", String.raw`عقوق|العقوق|عاق|العاقين|عاقر|عقوقاً|عق`),
  S("nifaq", "nifaq", "vice", String.raw`نفاق|النفاق|منافق|المنافق|المنافقين|المنافقون|منافقون|منافقات|النفاق وسمعة|نفاقاً|نفقه`),
  S("ghish", "ghish", "vice", String.raw`غش|يغش|الغش|غاش|مغشوش|يغشش|غشش|تغشّى`),

  // ── Dealings (mu'amalat track) ─────────────────────────────────────────
  // البيع والتجارة — «بايع» (allegiance) and «بيعة» stay out: بايع requires a follow-up sale word
  // (handled below); «بيعة» fails because ة follows بيع.
  S("bay", "bay", "dealing", String.raw`بيع|البيع|البيعان|بيعان|باع|باعوا|بعته|بعت|يبع|يبعون|بائع|البائع|مبيع|اشترى|يشتري|يشتريه|شراء|الشراء|تجارة|التجارة|تاجر|التجار|تجار|متجر|أسواق|السوق|ثمن|الثمن|أثمان`),
  // الربا in transaction context (growth senses gated below).
  S("riba", "riba", "dealing", String.raw`الربا|ربا|آكل الربا|موكل الربا|ربا الفضل|ربا النسيئة|ربا نسيئة|الربوي|يربون|أكل الربا|يربو|ليربو|تربو|فيربو|أربى`),
  // الدَّين debt — «دين» religion stays out: only the debt-specific forms and the gated bare word.
  S("dayn", "dayn", "dealing", String.raw`داين|الداين|مداين|الدائن|دائن|مدين|المدين|مدينون|مقضي الدين|اقترض|القرض|قرض|قرضاً|أقرض|يقرض|استقرض|مقرض|القروض|غريم|الغريم|معسر|المعسر`),
  S("rahn", "rahn", "dealing", String.raw`رهن|الرهن|مرهون|مرهونة|رهائن|رهين|الرهينة|رهينة|ارتهن|مرتهن`),
  // الإجارة والأجير — bare «أجر» (reward) stays out.
  S("ijara", "ijara", "dealing", String.raw`إجارة|الإجارة|اجارة|أجير|الأجير|أجيراً|أجراء|أجرة|الأجرة|استأجر|استأجرت|يستأجر|أجر الأجير|أجره|إجارته|أجار|يؤجر|أجّر`),
  S("wasiyya", "wasiyya", "dealing", String.raw`وصية|الوصية|وصي|الوصي|أوصى|يوصي|يوصى|موصي|وصايا|الوصايا|أوصوا|الموصي`),
  S("irth", "irth", "dealing", String.raw`ميراث|الميراث|إرث|الإرث|ورث|يرث|يورث|وارث|الوارث|أوارث|تركة|التركة|المواريث|ميراثاً`),
  // النكاح وأسرته: الزواج والمهر والرضاع (mahram-making) تُجمع هنا.
  S("nikah", "nikah", "dealing", String.raw`نكاح|النكاح|نكاحاً|تزوج|يتزوج|تزوجوا|تزوجت|زواج|الزواج|أنكحوا|أنكح|منكح|منكوح|نكح|الزوج|الأزواج|زوجة|زوجته|زوجها|مهر|المهر|مهور|صداق|الصداق|رضاعة|الرضاعة|أرضع|أرضعت|رضاع|الرضاع|مرضعة`),
  // الطلاق وما يتبعه: الخلع والعدة والنفقة والحضانة.
  S("talaq", "talaq", "dealing", String.raw`طلاق|الطلاق|طلاقاً|طلق|طلقت|طلقها|يطلق|مطلق|مطلقة|المطلقة|مطلقات|الخلع|خالع|اختعل|ختلع|نفقة|النفقة|نفقات|ينفق عليهن|حضانة|الحضانة|الحاضنة|ظهار|الظهار|إيلاء|الإيلاء|لعان|اللعان|متعة الطلاق`),
  // اليمين والكفارة — «قسم» النصيب stays out; the verbs and oath nouns only.
  S("yamin", "yamin", "dealing", String.raw`يمين|اليمين|أيمان|الأيمان|أقسم|يقسم|أقسموا|حلف|يحلف|الحلف|حالف|حلفوا|كفارة|الكفارة|كفارات|حنث|الحنث|حانث`),
  // الشهادة testimony — الشهداء martyrs and شهادة الإيمان stay out (gated below).
  S("shahada", "shahada", "dealing", String.raw`شهادة|الشهادة|شهادات|شاهد|الشاهد|أشهد|يشهد|شهود|بينة|البينة|بينات|إثبات`),
  // القضاء والحكم بين الناس — «حكم» الحكمة stays out (gated below).
  S("qada", "qada", "dealing", String.raw`قضاء|القضاء|قاضي|القاضي|قاض|قضاة|القضاة|قضى بين|يحكم بين|حكم بين|حاكم|الحاكم|تحاكم|حكّم|القضاء بين`),
  // الميزان والكيل والتطفيف والوزن.
  S("mizan", "mizan", "dealing", String.raw`ميزان|الميزان|موازين|الموازين|كيل|الكيل|يكال|مكيال|المكيال|مكاييل|تطفيف|المطففين|المطفف|مطففين|مطفف|يطفف|يوفون|يوفى|قسطاس|القسطاس|وزن|الوزن|يزن|وزناً|وازن|اكتال|يكتال|اكتالوا|يستوف|استوفى|يستوفون|كال|كتال`),
  // الصلح والمصالحة.
  S("sulh", "sulh", "dealing", String.raw`صلح|الصلح|صلحاً|مصالحة|المصالحة|تصالح|يصالح|أصلح بين|الإصلاح بين|إصلاح ذات البين|يصلح بين|صالح بين|الصلح بين|مصالح`),
  // الهبة والهدية والعطية.
  S("hiba", "hiba", "dealing", String.raw`هبة|الهبة|هدية|الهدية|هدايا|عطية|العطية|أعطى|عطايا|يهب|موهوب|الموهوبة|أهداها|أهدى`),
  // الكفالة والضمان.
  S("kafala", "kafala", "dealing", String.raw`كفالة|الكفالة|كفيل|الكفيل|كفل|تكفل|ضمان|الضمان|ضامن|الضامن|ضمين|يضمن|ضماناً|ضمانات`),
  // الوكالة — «وكيل» is also a divine name; the bare word is gated below.
  S("wakala", "wakala", "dealing", String.raw`وكالة|الوكالة|توكيل|التوكيل|وكل|أوكل|يوكل|وكيله|وكيلاً|وكيلي|وكيلكم|وكيلنا|وكيلها|توكيله`),
  // الشركة والقراض والمزارعة — «شريك/شركاء» (polytheism partners) stays out.
  S("sharika", "sharika", "dealing", String.raw`شركة|الشركة|شركات|مشاركة|المشاركة|قراض|القراض|مضاربة|المضاربة|مزارعة|المزارعة|مساقاة|المساقاة|الخلطاء|خليط|الخليط|خلط|خالط|مشاع`),
  // السلم والاستصناع — سلف/سلم bare are ambiguous; the verbs only.
  S("salam", "salam", "dealing", String.raw`أسلف|يسلف|سلفاً|أسلمت|سلماً|أسلفوا|استصنع|الاستصناع|استصناع|يستصنع|مصنوع`),
  // الحوالة (debt transfer) — «حول» (around/year) stays out.
  S("hawala", "hawala", "dealing", String.raw`حوالة|الحوالة|حوالات|أحال الدين|يحيل عليه|أحال عليه|حيل عليه`),
  // العارية والوديعة.
  S("ariya", "ariya", "dealing", String.raw`عارية|العارية|أعار|يعير|أعارة|الإعارة|وديعة|الوديعة|ودائع|أودع|استودع|مستودع|الاستيداع`),
  // الغصب واللقطة.
  S("ghasb", "ghasb", "dealing", String.raw`غصب|الغصب|غاصب|يغصب|مغصوب|غصباً|لقطة|اللقطة|لقط|لقيط|اللقيط|لقاط`),
  // الشفعة — «شفيع» (intercessor) stays out.
  S("shufa", "shufa", "dealing", String.raw`شفعة|الشفعة|شفع في|أشفع في|شفعةً|شفعاً`),
  S("ihtikar", "ihtikar", "dealing", String.raw`احتكار|الاحتكار|احتكر|يحتكر|محتكر|الاحتكاري`),
  // العقد والعقود — contracts; bare «عقد» (a decade/a knot) stays out.
  S("aqd", "aqd", "dealing", String.raw`العقد|العقود|عقود|عقوداً|تعاقد|عاقد|ينعقد|العاقدة|عقدة|عقدها|عقدهم|عقدكم|أوفوا بالعقود`),
  // الإكراه — «أكره» (I hate) stays out; the coercion noun and passive forms only.
  S("ikrah", "ikrah", "dealing", String.raw`إكراه|الإكراه|أكرهه|أكرهها|أكرهتم|يكره|مكره|المكره|مكرهة|إكراهاً|أكره على|أكرهت على|مكرهون`),
  // الحجر (interdiction) — «حجر» (stone) stays out; the fiqh forms only.
  S("hajr", "hajr", "dealing", String.raw`حجر عل|حجروا على|محجور|المحجور|يحجر على|الحجر عل|حجرة عل`),

  // ── Chapter-level mentions (the «الأخلاق» and «المعاملات» words) ───────
  // «خلق» (creation) stays out; the أخلاق forms and the akhlaq phrases only.
  S("akhlaq_noun", "akhlaq", "mention", String.raw`الأخلاق|أخلاق|أخلاقه|أخلاقك|أخلاقكم|أخلاقنا|أخلاقهم|مكارم الأخلاق|مكارم|محاسن الأخلاق|حسن الخلق|خلق حسن|خلقاً حسناً|سوء الخلق|حسن خلقه|الخلق الحسن|من حسن إسلام|مسلم من سلم|من سلم المسلمون`),
  S("muamalat_noun", "muamalat", "mention", String.raw`المعاملات|معاملات|معاملة|المعاملة|يعامل|يعاملهم|معاملتهم|المعامل|حسن المعاملة|معاملةً`),
];

/** Topics that belong to the mu'amalat track. */
const MUAMALAT_TOPICS = new Set(["muamalat", "bay", "riba", "dayn", "rahn", "ijara", "wasiyya", "irth", "nikah", "talaq", "yamin", "shahada", "qada", "mizan", "sulh", "hiba", "kafala", "wakala", "sharika", "salam", "hawala", "ariya", "ghasb", "shufa", "ihtikar", "ikrah", "hajr", "aqd"]);

const VIRTUE_SIGNALS = new Set(SIGNALS.filter((s) => s.kind === "virtue").map((s) => s.id));
const VICE_SIGNALS = new Set(SIGNALS.filter((s) => s.kind === "vice").map((s) => s.id));
const DEALING_SIGNALS = new Set(SIGNALS.filter((s) => s.kind === "dealing").map((s) => s.id));

/**
 * Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `akhlaq-browser` also admits it (see pick in export-api).
 */
export const AKHLAQ_EXCLUDE = new Set<string>([
  // Filled by the build sweep: ids whose only hit is a verified false positive are documented here.
]);

/** Gated checks: patterns that need a context window before they count. */

/** الوفاء verbs: «توفي» (to die) and «وفّى» (to pay in full) both look like the faithfulness verb —
 *  they count only when a ب-object follows («يوفون بالعهد»، «وفيت بالنذر»، «توفي بالعهدة»). */
const AR_WAFA_VERB = new RegExp(`${BL}(?:[وبفل])?(?:يوفي|يوفون|توفي|توفون|وفي|وفيت|وفيتم|وفوا|وفّى|يوفّى|توفّى|أوفى|أوفوا)(?=$|${E}|\\s)`, "g");
const WAFA_OBJECT = /ب(?:ال)?(?:عهد|ميثاق|نذر|عقد|أمانة|قول|شرط|موعد|وعد|الناس|حق|إيمان|كلمة)/;
/** Bay'ah gate: «بايع/يبايع/مبايعة» is the pledge of allegiance, not a sale. A بيع-family hit
 *  inside a pure bay'ah context («بايعوا النبي تحت الشجرة»، «بيعة الرضوان») is discounted when no
 *  real sale form (بيع/باع/يبع/بائع/ثمن/اشترى/تجارة/البيع as a word) is present. */
const AR_BAYAH = /بايع|يبايع|مبايعة|البيعة|بيعة الرضوان|بيعة العقبة|بايعوه|بايعوهن/;
const AR_BAY_REAL = new RegExp(`${BL}(?:[وبفسل]{0,2})?(?:بيع(?!ة)|باع(?!ث)|يبع(?:وا|ون|ه|ها|هم|نا|ت|تم|تن|ي|ن|ّ)?|بائع|مبيع|اشترى|يشتري|تجارة|التجارة|تاجر|ثمن|سوق|شراء|أثمان)`);
/** «الربا» growth senses stay out unless a transaction word is near (the definite الربا and the
 *  riba formulas already require that context; «يربون» needs a money neighbour). */
const RIBA_MONEY = /أكل|آكل|موكل|حرم|أحرم|دين|قرض|مال|أموال|ثمن|فضل|نسيئة|بيع|سلف|زيادة|نماء|تجارة|ربح|صلب/;
/** «دين» bare (religion vs debt): counts only beside a debt marker (عليه|له|لي|قضى|غريم|أدى|سدد). */
const AR_DAYN_BARE = new RegExp(`${BL}(?:[وبفل])?دين(?=$|${E})`, "g");
const DAYN_CONTEXT = /(?:عليه|على|له|لي|لها|عليها|عليهم|لهم)\s+دين|دين\s+(?:عليه|على|له|لي|لها|عليها|عليهم|لهم|في|من)|قضى\s+(?:ال)?دين|سدد|غريم|أدى\s+دين|وفى\s+دين|دائن|مدين/;
/** «شهادة» testimony-of-faith and martyrdom stay out: the bare word counts only beside a witness
 *  or contract marker (شهد|بينة|دعوى|قضاء|بيع|ركن|عدل|زور). */
const SHAHADA_CONTEXT = /شهد|شاهد|بينة|دعوى|قضاء|بيع|عقد|عدل|زور|الكتاب|إثبات|حكم|يقيم|أقام|عدل/;
/** «قضاء/حكم» as destiny-or-wisdom stays out unless it is judgement between people (بين الناس،
 *  قاضي، حاكم، خصومة، دعوى، فصل). */
const AR_QADA_GATE = /بين\s+(?:الناس|الخصمين|المتخاصمين|عباده|الرجلين|المرأتين)|خصومة|دعوى|حاكم|قاضي|قضاة|فصل|منازعة|تخاصم|شهادة|الحق/;
/** «عدل» equivalence («عدل كذا»، «يعدل» = equals) stays out unless a justice marker is near. */
const ADL_CONTEXT = /قسط|ميزان|حكم|قضاء|شهادة|شاهد|ناس|بر|إحسان|ظلم|قسطاً|وزن|معاملة|حق/;
/** «حلم» dream sense stays out unless a forbearance marker is near (حليم، صفح، عفو، غضب). */
const HILM_CONTEXT = /حليم|حلماء|صفح|عفو|غضب|غيظ|أناة|وقار/;
/** «رضاع/أرضع» nursing as biology vs rulings: still mu'amalat-relevant (mahram); no gate. */
/** «سب/لعن/طعن» — «طعن» also "criticism of hadith narrators" (jarh) which is akhlaq anyway; kept. */

/** The matched signal names for a passage, or [] when it is not about ethics or dealings. */
export function akhlaqSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // the «كتاب البيوع» or «كتاب الأدب» chapter of a collection without the passage itself being
  // about the topic.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || AKHLAQ_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);

  for (const s of SIGNALS) {
    if (!has(s.re)) continue;
    // Gated exceptions:
    if (s.id === "qada" && !/قاضي|القاضي|قضاة|القضاة|حاكم|الحاكم|تحاكم|حكّم/.test(raw) && !AR_QADA_GATE.test(raw)) continue;
    if (s.id === "hilm" && !/حليم|حلماء/.test(raw) && /حلم/.test(raw) && !HILM_CONTEXT.test(raw)) continue;
    if (s.id === "adl" && !ADL_CONTEXT.test(raw)) continue;
    if (s.id === "shahada") {
      // «أشهد أن لا إله» (testimony-of-faith) is not testimony between people.
      let ok = /شهادة|شهادات|الشهادة|شاهد|الشاهد|شهود|بينة|البينة|بينات|إثبات/.test(raw);
      if (!ok) {
        for (const m of raw.matchAll(/(?:أشهد|يشهد)(?=\s|$)/g)) {
          const tail = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 30);
          if (!/^\s*أن/.test(tail)) { ok = true; break; }
        }
      }
      if (!ok) continue;
    }
    if (s.id === "riba" && !RIBA_MONEY.test(raw)) continue;
    // «يوفون» alone is faithfulness — mizan needs a measure/weight word somewhere in the text.
    if (s.id === "mizan" && !/كيل|مكيال|مكاييل|ميزان|موازين|وزن|وزنا|قسطاس|تطفيف|مطفف|اكتال|يكتال|استوف|يستوف|كال|كتال|يكال/.test(raw)) continue;
    if (s.id === "bay" && AR_BAYAH.test(raw) && !AR_BAY_REAL.test(raw)) continue;
    hits.add(s.id);
  }
  // الوفاء verb family with the ب-object gate («يوفون بالعهد» in, «توفاه الله» out).
  for (const m of raw.matchAll(AR_WAFA_VERB)) {
    const window = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 30);
    if (WAFA_OBJECT.test(window)) { hits.add("wafa_verb"); break; }
  }
  // «دين» bare with a debt context.
  for (const m of raw.matchAll(AR_DAYN_BARE)) {
    const lo = Math.max(0, (m.index ?? 0) - 30);
    const window = raw.slice(lo, (m.index ?? 0) + m[0].length + 30);
    if (DAYN_CONTEXT.test(window)) { hits.add("dayn_bare"); break; }
  }
  // العقوق/القطيعة: «يقطع» alone is broad — kinship-cutting needs the رحم/أمر الله object.
  for (const m of raw.matchAll(new RegExp(`${BL}(?:[وبفل])?(?:يقطع|يقطعون|قاطع|قطيعة|قطع|يقطعوا)(?=$|${E})`, "g"))) {
    const window = raw.slice(m.index!, m.index! + m[0].length + 40);
    if (/الرحم|الأرحام|رحمهم|رحم|ما أمر الله|الذي أمر الله|صلة/.test(window)) { hits.add("uquq_qatia"); break; }
  }
  // العدّة (waiting period) vs «عدّة» (several/equipment): needs a marriage-or-widowhood context.
  for (const m of raw.matchAll(new RegExp(`${BL}(?:[وبفل])?(?:عدة|العدة|عدتها)(?=$|${E})`, "g"))) {
    const lo = Math.max(0, (m.index ?? 0) - 40);
    const window = raw.slice(lo, (m.index ?? 0) + m[0].length + 40);
    if (/طلاق|مطلق|قروء|حيض|وفاة|متوفى|توفي عنها|زوج/.test(window)) { hits.add("idda"); break; }
  }
  return [...hits];
}

/** True when the passage reports or mentions akhlaq or mu'amalat. */
export function isAkhlaqPassage(n: Node): boolean {
  return akhlaqSignalsOf(n).length > 0;
}

const KIND_BY_SIGNAL = new Map(SIGNALS.map((s) => [s.id, s.kind] as const));
const TOPIC_BY_SIGNAL = new Map(SIGNALS.map((s) => [s.id, s.topic] as const));
KIND_BY_SIGNAL.set("wafa_verb", "virtue"); TOPIC_BY_SIGNAL.set("wafa_verb", "wafa");
KIND_BY_SIGNAL.set("dayn_bare", "dealing"); TOPIC_BY_SIGNAL.set("dayn_bare", "dayn");
KIND_BY_SIGNAL.set("uquq_qatia", "vice"); TOPIC_BY_SIGNAL.set("uquq_qatia", "uquq");
KIND_BY_SIGNAL.set("idda", "dealing"); TOPIC_BY_SIGNAL.set("idda", "talaq");

/** The kind(s) each topic is declared with in the signal table above (read by the signature view of the landing page; a topic whose signals declare different kinds lists them all). */
export const AKHLAQ_TOPIC_KINDS: Record<string, AkhlaqKind[]> = (() => {
  const out: Record<string, AkhlaqKind[]> = {};
  for (const [sig, topic] of TOPIC_BY_SIGNAL) {
    const kind = KIND_BY_SIGNAL.get(sig)!;
    const list = (out[topic] ??= []);
    if (!list.includes(kind)) list.push(kind);
  }
  return out;
})();

/** The kinds a passage carries: `virtue`, `vice`, `dealing` and/or `mention` (a sorted set). */
export function akhlaqKindsOf(n: Node): AkhlaqKind[] {
  const kinds = new Set<AkhlaqKind>();
  for (const s of akhlaqSignalsOf(n)) {
    const k = KIND_BY_SIGNAL.get(s);
    if (k) kinds.add(k);
  }
  return [...kinds].sort();
}

/** The trait/contract families a passage's signals belong to. */
export function akhlaqTopicsOf(n: Node): string[] {
  const topics = new Set<string>();
  for (const s of akhlaqSignalsOf(n)) {
    const t = TOPIC_BY_SIGNAL.get(s);
    if (t) topics.add(t);
  }
  return [...topics].sort();
}

/** The tracks a passage belongs to: `akhlaq` (virtue/vice/akhlaq mention) and/or `muamalat`. */
export function akhlaqTracksOf(n: Node): AkhlaqTrack[] {
  const tracks = new Set<AkhlaqTrack>();
  for (const s of akhlaqSignalsOf(n)) {
    const topic = TOPIC_BY_SIGNAL.get(s) ?? "akhlaq";
    tracks.add(MUAMALAT_TOPICS.has(topic) ? "muamalat" : "akhlaq");
  }
  return [...tracks].sort();
}

/** Primary kind for the card chip: dealing > vice > virtue > mention. */
export function akhlaqKindOf(n: Node): AkhlaqKind | null {
  const kinds = akhlaqKindsOf(n);
  if (!kinds.length) return null;
  for (const k of ["dealing", "vice", "virtue", "mention"] as const) if (kinds.includes(k)) return k;
  return kinds[0];
}

/**
 * Which corpus an akhlaq passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function akhlaqCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): AkhlaqCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `akhlaq-<section>` when present, else `curated`. */
export function akhlaqTagSection(n: Node): AkhlaqSection {
  const tag = n.tags.find((t) => t.startsWith("akhlaq-") && t !== AKHLAQ_TAG);
  const id = tag?.slice(7) ?? "curated";
  return (AKHLAQ_SECTIONS as readonly string[]).includes(id) ? (id as AkhlaqSection) : "curated";
}

/** The `akhlaq-<topic>` tags of a curated record (topics, not the corpus sections). */
export function akhlaqTagTopics(n: Node): string[] {
  return n.tags
    .filter((t) => t.startsWith("akhlaq-") && t !== AKHLAQ_TAG && !(AKHLAQ_SECTIONS as readonly string[]).includes(t.slice(7)))
    .map((t) => t.slice(7));
}
