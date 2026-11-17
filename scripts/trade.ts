// The Trade Browser's shared reads (docs/plan/63-trade-browser.md): which passage
// records mention the Quraysh winter and summer caravans (قافلة الشتاء والصيف),
// the Silk Road (طريق الحرير) and Muslim trade (تجارة المسلمين) — the
// «متصفح قافلة الشتاء والصيف وطريق الحرير وتجارة المسلمين». Detection runs at
// build time over the compiled graph, so a mention in any harvested book — and
// in every book harvested later — appears without any tagging step. Curated
// records join through the `trade-browser` tag instead.
//
// The lexicon is deliberately gated, because unvocalized Arabic makes the core
// words dangerously ambiguous (the same problem the eschatology, magic and
// islamic-economy lexicons solve):
//  - «عير» is the caravan or the town of 'Ir; «ركب» is a mounted company or a knee;
//    «خان» is a caravanserai or a khan/title; «رباط» is a way-station or a frontier
//    post; «سوق» is a market or "he drove"; «سفر/رحلة» is travel anywhere; «فلك» is
//    a ship or an orbit; «حرير» is silk fabric or the road only inside «طريق
//    الحرير»; «سمرقند» and the oasis cities appear in conquest narratives with no
//    trade in view; «الصين» is the country in any context; «عشر» is a tithe or ten;
//    «مد» is a measure or "he extended"; «ميزان» is a shop balance or the
//    eschatological Scale; «دلال» is a broker or guidance; «متاع» is goods or
//    "enjoyment"; «بازار» is a bazaar or a name.
// Ambiguous forms (WEAK) count only beside their own domain collocations (CONTEXT)
// in the same passage — with the weak tokens themselves stripped first, so a
// context word can never be satisfied by the weak word's own occurrence. Verified
// false positives are excluded by id in TRADE_EXCLUDE. Strong forms are
// unambiguous inside trade-and-routes vocabulary.
import type { Node } from "./build-graph.js";

export const TRADE_TAG = "trade-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const TRADE_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type TradeSection = (typeof TRADE_SECTIONS)[number];
export type TradeCorpus = Exclude<TradeSection, "curated">;
/** Topic chips: caravans (قافلة الشتاء والصيف — the Quraysh ilaf and the caravan
 * institution), silk-road (طريق الحرير — the Silk Road and the trade roads), trade
 * (تجارة المسلمين — Muslim trade, merchants, markets, maritime and caravan
 * commerce). A record may carry several. */
export const TRADE_TOPICS = ["caravans", "silk-road", "trade"] as const;
export type TradeTopic = (typeof TRADE_TOPICS)[number];

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
const BL = String.raw`(?:^|${B})`;
/** Clitic prefixes و ف ب ل ك س tolerated before a token. */
const PRE = String.raw`[وبفسك]{0,3}`;
/** Token regex: optional clitic prefixes + the alternation + boundary. Patterns are
 * normalized (hamza/alef/ya variants unified) so lexicon spellings match the normalized
 * passage text regardless of how the source wrote them. */
const tok = (alts: string) => new RegExp(`${BL}${PRE}(?:${normAr(alts)})(?=$|${E})`);
/** Phrase regex (multi-word): optional clitic prefixes + the phrase + boundary. */
const phr = (alts: string) => new RegExp(`${BL}${PRE}(?:${normAr(alts)})(?=$|${E})`);
/** Clitic prefixes plus an optional definite article, for the boundary-aware matcher. */
const PREW = String.raw`[وبفسك]{0,3}(?:ال)?`;
/** Plain substring regex — only for patterns containing regex groups that cannot be
 * split into `|` alternatives (the `measures` strong pattern). */
const anySub = (alts: string) => new RegExp(normAr(alts));
/** Boundary-aware presence regex: every `|` alternative is wrapped in token boundaries
 * with clitic and definite-article tolerance, so «مد» cannot hide inside «مدد»,
 * «عير» inside «معيرة» or «خان» inside «خانقاه». Used for every context, veto and
 * strong-phrase pattern; alternatives must not contain `|` or groups. */
const any = (alts: string) =>
  new RegExp(
    alts
      .split("|")
      .map((a) => `(?:^|${B})${PREW}(?:${normAr(a)})(?=$|${E})`)
      .join("|"),
  );
/** Arabic diacritics and tatweel stripped before matching; alef/ya variants unified
 * (the lexicon below is written in this normalized form). The dagger alif «ٰ» and
 * maddah «ٓ» are letters (long ā), not diacritics: they must become «ا» first. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;
const normAr = (s: string): string =>
  s
    .replace(/[ٰٓ]/g, "ا")
    .replace(DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ءا/g, "ا");

interface Signal {
  /** Stable signal name reported in the API `signals` list. */
  name: string;
  topic: TradeTopic;
  /** Unambiguous form: matches alone. */
  strong?: RegExp;
  /** Ambiguous form: counts only when `context` also matches the passage with the weak
   * tokens themselves stripped out — so a context word can never be satisfied by the
   * weak word's own occurrence (the self-reference trap). */
  weak?: RegExp;
  /** Domain collocations that make a weak form count. */
  context?: RegExp;
  /** Veto: when this matches, a weak form never counts. */
  veto?: RegExp;
  /** Global form of `weak`, precomputed for the strip pass. */
  strip?: RegExp;
}
const S = (name: string, topic: TradeTopic, o: { strong?: RegExp; weak?: RegExp; context?: RegExp; veto?: RegExp }): Signal => ({
  name,
  topic,
  ...o,
  strip: o.weak ? new RegExp(o.weak.source, "g") : undefined,
});

// ---------------------------------------------------------------------------
// Shared context fragments
// ---------------------------------------------------------------------------

/** Trade-domain collocations shared by the broadest weak trade signals (سوق، بيع،
 * ثمن، ربح، سفر، رحلة). */
const TRADE_CTX =
  "تجارة|التجارة|تاجر|التاجر|تجار|التجار|بضاعة|البضاعة|بضائع|سلعة|السلعة|سلع|بازار|البازار|سوق|أسواق|الأسواق|دكان|حانوت|دكاكين|قيصرية|ثمن|الثمن|سعر|السعر|أسعار|قيمة|ربح|الربح|خسارة|بيع|البيع|شراء|الشراء|البيوع|مال|أموال|اموال|درهم|دينار|دراهم|دنانير|نقد|نقود|فلس|قافلة|القافلة|قوافل|القوافل|عير|ركب|الركب|ركبان|هودج|جمال|إبل|نوق|طريق|طرق|درب|دروب|سفر|السفر|رحلة|رحلات|مسافر|نزل|منزل|رباط|خان|سراي|قيصرية|ميناء|موانئ|مرفأ|سفينة|سفن|مركب|فلك|حمولة|شحنة|شحن|ملاح|ربان|بحر|بر|بضاعته|سلعته|بز|بزاز|عطار|صيرفي|جهبذ|سمسار|دلال|نخاس|بقال|حرير|ديباج|قز|بخور|لبان|كندر|مر|توابل|بهارات|عطر|عطور|مكيال|ميزان|كيل|صاع|أوقية|رطل|قسطاس|وزن|مكوس|جمارك|عشار|ضريبة|خراج|جزية|حوالة|صك|مضاربة|قيراض|مشاركة|شركة|مرابحة|سلم|استصناع|وكيل|وكالة|معاملة|عقد|صفقة|استثمار|رأس مال|رزق|كساد|رواج|غلاء|رخص|موسم|عكاظ|مجنة|حباشة";
const TRADE_CTX_RE = any(TRADE_CTX);

/** Route-domain collocations for the caravan and road weak signals. */
const ROUTE_CTX =
  "طريق|طرق|درب|دروب|سفر|السفر|رحلة|رحلات|مسافر|مسافرين|قوافل|قافلة|ركب|عير|هودج|جمال|إبل|نوق|نزل|منزل|رباط|خان|سراي|قيصرية|بادية|صحراء|وادي|ممر|مضيق|باب|تجارة|تاجر|تجار|بضاعة|سلعة|ميناء|مرفأ|ساحل|بحر|بر|الشام|اليمن|مكة|المدينة|الحجاز|العراق|فارس|خراسان|الصين|الهند|الروم|مصر|الحبشة";
const ROUTE_CTX_RE = any(ROUTE_CTX);

// ---------------------------------------------------------------------------
// The signal table
// ---------------------------------------------------------------------------

const SIGNALS: Signal[] = [
  // ========================== CARAVANS ==========================
  // قافلة الشتاء والصيف — the Quraysh ilaf and the caravan institution

  S("ilaf", "caravans", {
    strong: any("إيلاف|ايلاف|الايلاف|الإيلاف|لإيلاف|لايلاف|لإلف|إيلافهم|ايلافهم|إيلافها|ايلافها|إيلاف قريش|ايلاف قريش|ليلاف|لالف") }),
  S("rihla_shita_sayf", "caravans", {
    strong: any("رحلة الشتاء والصيف|رحله الشتاء والصيف|رحلتي الشتاء والصيف|رحلة الشتاء|رحله الشتاء|رحلت الشتاء|رحلة الصيف|رحله الصيف|رحلت الصيف|رحلة الشتا|شتائها وصيفها|رحلتي الشتا والصيف") }),
  S("qafila", "caravans", {
    strong: tok("قافلة|القافلة|قوافل|القوافل|قافلته|قافلتها|قافلتهم|قافلتنا|قافلتك|قافلتي|قافلتا") }),
  S("ir_caravan", "caravans", {
    weak: tok("عير|العير"),
    context: any("قافلة|قوافل|تجارة|تاجر|أموال|اموال|بضاعة|سلعة|قريش|أبو سفيان|ابو سفيان|بدر|الشام|ركب|غنائم|تجار|ركبان|جمال|إبل|نوق|بضاعتهم|تجارتهم|عيرهم|العير") }),
  S("rukban", "caravans", {
    weak: tok("ركب|الركب|ركبان|الركبان|ركبا|ركبه|ركبها|ركبهم"),
    context: any("قافلة|قوافل|سفر|طريق|تجارة|عير|بضاعة|تاجر|هودج|جمال|إبل|نوق|مسافر|نزل|قادم|وصل|سار|رحل|رحلة"),
    veto: any("ركبتي|ركبتيه|ركبتها|ركبة|الركبة|ركبتا|ركبتين|ركبن|ركبوا|ركبنا|ركبتم|ركبت|يركب|تركب|نركب|راكب") }),
  S("huduj", "caravans", {
    weak: tok("هودج|الهودج|هوادج|محمل|المحمل"),
    context: any("قافلة|قوافل|ركب|سفر|طريق|حج|بضاعة|تجارة|جمال|إبل|نوق|رحلة") }),
  S("caravanserai", "caravans", {
    weak: tok("رباط|الرباط|رباطات|سراي|السراي|سرايا|خانقاه|الخانقاه|قافلنسراي|كاروانسراي"),
    context: any("طريق|طرق|تجار|قوافل|مسافر|سفر|نزل|منزل|تجارة|طريق الحرير|درب|مبيت|قافلة|ركب") }),
  S("khan", "caravans", {
    weak: tok("خان|الخان|خانات|الخانات|خانا"),
    context: any("رباط|سراي|طريق|تجار|قوافل|مسافر|نزل|منزل|سفر|تجارة|قافلة|ركب|مبيت|دكاكين|سوق|حوانيت"),
    veto: any("خانقاه|جنكيز|هولاكو|تيمور|أوقبا|باطو|بركة خان|قوبلاي|خان بالي|خان الحرير") }),
  S("qaysariyya", "caravans", { strong: tok("قيصرية|القيصرية|قيسارية|القيسارية|قياصرة") }),

  // ========================== SILK ROAD ==========================
  // طريق الحرير — the Silk Road and the trade roads

  S("tariq_al_harir", "silk-road", {
    strong: any("طريق الحرير|طرق الحرير|طريق الحرير القديم|طريق الحرير الجديد|طريق الحرير البري|طريق الحرير البحري|درب الحرير") }),
  S("trade_roads", "silk-road", {
    strong: any("طرق التجارة|طريق التجارة|طريق تجاري|طرق تجارية|دروب التجارة|درب التجارة|طريق القوافل|طرق القوافل|طريق البخور|طريق اللبان|درب البخور|طريق البهارات|طريق التوابل|طريق العنبر|طريق اللؤلؤ") }),
  S("silk_cities", "silk-road", {
    weak: tok("سمرقند|بخاري|بخارا|خوارزم|مرو|نيسابور|بلخ|ترمذ|فرغانة|كاشغر|ختن|طشقند|سغد|الصغد|فرغانه|ماوراء النهر|ما وراء النهر"),
    context: any("حرير|الحرير|طريق|طرق|تجارة|تاجر|تجار|قافلة|قوافل|بضاعة|سلعة|الصين|صين|تركستان|التركستان|بازار|سوق|رباط|خان|سراي|درب") }),
  S("china_trade", "silk-road", {
    weak: tok("الصين|صين|كاثاي|ختا|الخطا"),
    context: any("حرير|تجارة|تاجر|بضاعة|سلعة|طريق|طرق|سفر|رحلة|سند|بحر|سفينة|قافلة|بازار|سوق|خزف|صيني|صينية"),
    veto: any("اطلبوا العلم ولو في الصين") }),
  S("transit_goods", "silk-road", {
    weak: tok("بضاعة|بضائع|سلعة|سلع"),
    context: any("طريق|طرق|قوافل|قافلة|سفينة|ميناء|شحنة|حمولة|نقل|الصين|الهند|الروم|فارس|خراسان|بازار|تجارة|تاجر") }),

  // ============================ TRADE ============================
  // تجارة المسلمين — trade, merchants, markets, maritime and caravan commerce

  S("tijara", "trade", {
    strong: tok("تجارة|التجارة|تجار|التجار|تاجر|التاجر|تجارته|تجارتها|تجارتهم|تجارتنا|تجارتك|تجارتي|متاجرة|المتاجرة|متجر|المتجر|متاجر|تجاري|تجارية") }),
  S("goods", "trade", {
    strong: tok("بضاعة|البضاعة|بضائع|البضائع|بضاعته|بضاعتهم|سلعة|السلعة|سلع|السلع|سلعه|سلعها|سلعتهم") }),
  S("suq", "trade", {
    weak: tok("سوق|السوق|أسواق|الأسواق|سوقا|سوقه|سوقها|سوقهم|سوقنا|سوقكم|سوقك|سوقي|أسواقا|اسواق"),
    context: TRADE_CTX_RE,
    veto: any("سوقا إليكم|سوقا اليكم") }),
  S("bazaar", "trade", { strong: tok("بازار|البازار|بازارات|البازارات|السوق المسقوف|سوق مسقوف") }),
  S("bay_buy", "trade", {
    weak: tok("بيع|البيع|شراء|الشراء|باع|باعوا|اشترى|يبيع|يشتري|البيوع|مبيع|مشتري|مبيعة|بائع|البائع|بياع|البياع"),
    context: TRADE_CTX_RE }),
  S("ribh", "trade", {
    weak: phr("ربح|الربح|ربحا|ربحه|ربحها|ربحهم|ربحنا|ربحكم|ربحكن|ربحك|ربحي|أرباح|ارباح|كساد|الكساد|رواج|الرواج"),
    context: TRADE_CTX_RE }),
  S("price_value", "trade", {
    weak: tok("ثمن|الثمن|أثمان|سعر|السعر|أسعار|الأسعار|قيمة|القيمة|غلاء|رخص"),
    context: TRADE_CTX_RE }),
  S("cargo", "trade", {
    weak: tok("حمولة|الحمولة|شحنة|الشحنة|شحن|الشحن|شحنات"),
    context: any("سفينة|سفن|قافلة|قوافل|بضاعة|سلعة|تجارة|ميناء|نقل|بحر|مركب|تاجر|ركب") }),
  S("mina", "trade", {
    weak: tok("ميناء|الميناء|موانئ|الموانئ|مرفأ|المرفأ|مرسى|المرسى"),
    context: any("سفينة|سفن|بحر|تجارة|بضاعة|ساحل|شحن|حمولة|تاجر|مركب|فلك|ملاح|ربان|رست|رسا|رسو") }),
  S("ship_trade", "trade", {
    weak: tok("سفينة|السفينة|سفن|السفن|سفينته|سفينتها|سفينتهم|مركب|المركب|مراكب|فلك|الفلك|ملاح|الملاح|ربان|الربان"),
    context: any("بضاعة|سلعة|تجارة|تاجر|ميناء|موانئ|حمولة|شحنة|بحر|ملاح|ربان|غرق|غرقت|ركب|تجار|مرفأ|مرسى|ساحل|عبر|عبور") }),
  S("measures", "trade", {
    strong: anySub("مكيال|كيال|المكيال|أوفوا الكيل|اوفوا الكيل|تبخس|تبخسوا|مطفف|المطففين|الطامفون في المكيال|الطامفين في المكيال|إذا كالوا|اذا كالوا|إذا وزنوا|اذا وزنوا|الوزن والسعر|أوفوا المكيال|أوفوا الكيل والميزان|أوفوا الوزن|أوفوا الميزان|قسطاس|القسطاس|بقسطاس|كيلا|مكيالا|وزنا ظلما|ميزانا") }),
  S("mizan", "trade", {
    weak: tok("ميزان|الميزان|موازين|الموازين|كيلة|الكيلة|كيل"),
    context: any("وزن|كيلة|كيل|مكيال|شراء|بيع|ثمن|تجارة|صاع|سعر|يوازن|قسط|قسطاس|سوق|بضاعة|سلعة|تاجر|عدل|خسر|بخس"),
    veto: any("ميزان يوم|ميزان الحسنات|الموازين يوم|ميزان الأعمال|ميزان الاعمال|الموازين القسط|وضع الموازين") }),
  S("units", "trade", { strong: tok("صاع|الصاع|أوقية|الأوقية|اونية|رطل|الرطل|رطلا|قفيز|القفيز|مد|المد|مكوك|المكوك") }),
  S("merchants", "trade", {
    strong: tok("نخاس|النخاس|سمسار|السمسار|سماسرة|السماسرة|جهبذ|الجهبذ|جهابذة|بزاز|البزاز|بزازين|عطار|العطار|عطارين|دلال|الدلال|دلالين|خردة|بقال|البقال|تجار الكباد|الكباد") }),
  S("hilf_fudul", "trade", { strong: any("حلف الفضول|حلف الفضولات") }),
  S("jahili_markets", "trade", {
    strong: any("عكاظ|سوق عكاظ|مجنة|سوق مجنة|ذي المجاز|سوق ذي المجاز|ذو المجاز|حباشة|سوق حباشة|سوق الموسم|مواسم الأسواق|مواسم الاسواق|أسواق العرب|اسواق العرب|أسواق الجاهلية|اسواق الجاهلية") }),
  S("customs_octroi", "trade", {
    weak: tok("مكوس|المكوس|جمارك|الجمارك|عشار|العشار|عشور|العشور|مكس|المكس"),
    context: any("سوق|تجارة|بضاعة|سلعة|طريق|طرق|أخذ|ضريبة|مال|تاجر|باب|ميناء|قافلة|خراج|جزية") ,
    veto: any("اثني عشر|اثنا عشر|ثلاثة عشر|أربعة عشر|خمسة عشر|ستة عشر|سبعة عشر|ثمانية عشر|تسعة عشر|عشرة|العشرة|العشر الأواخر|العشر الأوسط|العشر الأولى") }),
  S("trade_contracts", "trade", {
    weak: tok("مضاربة|المضاربة|قيراض|القيراض|مشاركة|المشاركة|مرابحة|المرابحة|استصناع|الاستصناع|مقارضة|مساقاة|مزارعة|جعالة|الجعالة|معاوضة|المعاوضة"),
    context: TRADE_CTX_RE }),
  S("spice_incense", "trade", {
    weak: tok("لبان|اللبان|بخور|البخور|كندر|الكندر|توابل|التوابل|بهارات|البهارات|عنبر|العنبر|مسك|المسك|زعفران|الزعفران|قرنفل|القرنفل|فلفل|الفلفل|قرفة|القرفة|كمون|هيل|الهيل"),
    context: any("تجارة|تاجر|سوق|طريق|بضاعة|سلعة|الهند|اليمن|حضرموت|ظفار|عمان|بازار|بيع|شراء|ثمن|سعر|قافلة|سفينة|ميناء|عطر|عطور") }),
  S("silk_fabric", "trade", {
    weak: tok("حرير|الحرير|ديباج|الديباج|قز|القز|إبريسم|استبرق|الاستبرق|سندس|السندس|تيراز|طراز|الطراز"),
    context: any("ثوب|ثياب|كساء|نسيج|بز|سوق|تجارة|بضاعة|بيع|شراء|ثمن|سعر|سلعة|دكاكين|بازار|حلل|حرم|تحريم|لباس|لبس|يلبس|منسوج|غزل|نسج") ,
    veto: any("طريق الحرير|طرق الحرير") }),
  S("travel_trade", "trade", {
    weak: phr("سفر|السفر|سافر|يسافر|سافروا|رحلة|الرحلة|رحلات|الرحلات|أسفار|اسفار|سفرة|سفرا|رحل|ارتحل"),
    context: any("تجارة|التجارة|تاجر|التجار|قافلة|قوافل|بضاعة|سلعة|تجارته|تجارتهم|ركب|عير|الشتاء|الصيف|الشام|اليمن|سفر التجارة|للتجارة|في تجارة|بضاعته|سلعته") }),
];

/** Passage records whose only lexical hit is a verified false positive. Curated escape
 * hatch: tagging a passage `trade-browser` also admits it. Filled after the detection
 * review sweep. */
export const TRADE_EXCLUDE = new Set<string>([]);

/** The matched signal names for a passage, or [] when it is not about the caravans,
 * the roads or trade. */
export function tradeSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can
  // name the «كتاب التجارة» chapter of a book without the passage itself being about it.
  const raw = normAr([n.data.text_search, n.data.text].filter(Boolean).join(" "));
  if (!raw || TRADE_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  for (const s of SIGNALS) {
    if (s.strong && s.strong.test(raw)) { hits.add(s.name); continue; }
    if (s.weak && s.context && s.weak.test(raw)) {
      // The context must be satisfied by the REST of the passage: weak tokens are
      // stripped first so a context alternative can never be fulfilled by the weak
      // word's own occurrence.
      const stripped = raw.replace(s.strip!, " ");
      if (s.context.test(stripped) && !(s.veto && s.veto.test(raw))) hits.add(s.name);
    }
  }
  return [...hits];
}

/** The topic chips a passage carries: caravans, silk-road and/or trade. */
export function tradeTopicsOf(n: Node): TradeTopic[] {
  const signals = tradeSignalsOf(n);
  const topics = new Set<TradeTopic>();
  for (const s of SIGNALS) {
    if (signals.includes(s.name)) topics.add(s.topic);
  }
  return [...topics];
}

/** True when the passage mentions the caravans, the roads or the trade. */
export function isTradePassage(n: Node): boolean {
  return tradeSignalsOf(n).length > 0;
}

/**
 * Which corpus a trade passage belongs to, from its work: the frozen Qur'an, the
 * hadith collections (genre `hadith` or a hadith-unit passage), the seerah books
 * (genre `sira`), and every other harvested work. Works not yet harvested land in the
 * right section by their genre the day their passages arrive.
 */
export function tradeCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): TradeCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `trade-<section>` when present, else `curated`. */
export function tradeTagSection(n: Node): TradeSection {
  for (const t of n.tags) {
    if (!t.startsWith("trade-") || t === TRADE_TAG) continue;
    const id = t.slice("trade-".length);
    if ((TRADE_SECTIONS as readonly string[]).includes(id)) return id as TradeSection;
  }
  return "curated";
}

/** The topic chips of a curated record, from its `trade-<topic>` tags (section tags are not topics). */
export function tradeTagTopics(n: Node): TradeTopic[] {
  return n.tags
    .filter((t) => t.startsWith("trade-") && t !== TRADE_TAG)
    .map((t) => t.slice("trade-".length))
    .filter((t): t is TradeTopic => (TRADE_TOPICS as readonly string[]).includes(t));
}
