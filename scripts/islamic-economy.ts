// The Islamic Economy Browser's shared reads (docs/plan/44-islamic-economy-browser.md):
// which passage records mention money and Islamic economics, deeds/instruments/covenants,
// and endowments — the «متصفح العملات والصكوك والوقف الإسلامي». Detection runs at build
// time over the compiled graph, so a mention in any harvested book — and in every book
// harvested later — appears without any tagging step. Curated records join through the
// `islamic-economy-browser` tag instead.
//
// The lexicon is deliberately gated, because unvocalized Arabic makes the core words
// dangerously ambiguous (the same problem the eschatology and magic lexicons solve):
//  - «دين» is debt or religion; «وقف» is endowment or "he stopped"; «عهد» is covenant or
//    era; «حبس» is endowment or prison; «شركة/شركاء» is partnership or polytheism; «سند»
//    is a bond or an isnad chain; «سجل» is a register or "he recorded"; «صحيفة» is a
//    document or a newspaper; «رقاع» is parchment or a patch; «ديوان» is a registry or
//    a poetry divan; «أمان» is safe-conduct or "security"; «ذمة» is a protection pact
//    or an obligation; «جوار» is a protection pact or a neighbourhood/sanctuary;
//    «صرف» is exchange or spend/interpret; «سلم» is the salam contract or peace/ladder;
//    «مضاربة» is mudaraba or beating; «مشاركة» is musharaka or sharing; «سوق» is market
//    or "he drove"; «سعر» is price or fame; «قيمة» is value or dignity; «مال/أموال» is
//    wealth everywhere; «بيعة/بايع» is allegiance or sale; «جارية» is a perpetual charity
//    or a slave-girl; «أمد» is a term-endowment or a duration; «منّ»/«مدّ» weight units
//    favour; «ذراع» is a cubit or an arm; «مدّ» is a measure or "he extended"; «عشر» is
//    a tithe or ten; «ميزان» is a balance or the eschatological Scale; «نقد» is cash or
//    criticism («نقدا» alone is cash); «ضرب» is minting or striking; «سكة» is the mint
//    or a rail; «عملة» is currency or "he worked"; «مصرف» is a bank or an outlet; «بنك»
//    is a bank or a bench; «جنيه/ريال/ليرة» are currencies or other senses; «عقد» is a
//    contract or a knot; «وكالة/وكيل» is agency or "trusted one"; «رهن» is pawn or
//    hostage; «كفالة/ضمان» is guarantee or sponsorship; «وديعة» is a deposit or an
//    entrustment; «عارية» is a loan-of-use; «عار» is shame (excluded); «إجارة/أجرة» is
//    hire or wage; «مزارعة/مساقاة» are sharecrop contracts; «مقاولة» is contracting;
//    «فائدة» is benefit or interest; «جمارك» is customs or "pilgrimage rites»;
//    «معاملة» is a transaction or "dealing"; «قسط» is an installment or a portion;
//    «آجل/مؤجل» is deferred or postponed; «سلف» is a loan or a predecessor; «غش» is
//    fraud or dimming; «غرر/جهالة» are gharar/jahala or danger/unknown; «رخص» is
//    cheapness or permission (excluded); «منا» is a weight or "from us" (excluded);
//    «رقبة» is ruqba or a neck; «عمري» is a life-term endowment or "my age".
// Ambiguous forms (WEAK) count only beside their own domain collocations (CONTEXT) in
// the same passage — with the weak tokens themselves stripped first, so a context word
// can never be satisfied by the weak word's own occurrence. Verified false positives
// are excluded by id in IE_EXCLUDE. Strong forms are unambiguous inside
// Islamic-economics vocabulary.
import type { Node } from "./build-graph.js";

export const IE_TAG = "islamic-economy-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const IE_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type IeSection = (typeof IE_SECTIONS)[number];
export type IeCorpus = Exclude<IeSection, "curated">;
/** Topic chips: money (العملات — full Islamic economics), sukuk (الصكوك — deeds,
 * instruments and covenants), waqf (الوقف — endowment). A record may carry several. */
export const IE_TOPICS = ["money", "sukuk", "waqf"] as const;
export type IeTopic = (typeof IE_TOPICS)[number];

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
 * with clitic and definite-article tolerance, so «مال» cannot hide inside «أعمال»,
 * «ذهب» inside «يذهب», «الربا» inside «الرباب» or «أجل» inside «أجلهم». Used for every
 * context, veto and strong-phrase pattern; alternatives must not contain `|` or groups. */
const any = (alts: string) =>
  new RegExp(
    alts
      .split("|")
      .map((a) => `(?:^|${B})${PREW}(?:${normAr(a)})(?=$|${E})`)
      .join("|"),
  );
/** Arabic diacritics and tatweel stripped before matching; alef/ya variants unified
 * (the lexicon below is written in this normalized form). The dagger alif «ٰ» and
 * maddah «ٓ» are letters (long ā), not diacritics: they must become «ا» first, or the
 * vocalized Tanzil text collapses «الشَّفَـٰعَة» into «الشفعة» and «ٱلْقِيَـٰمَة» into
 * «القيامه» — false hits on «شفعة» and «قيم». */
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
  topic: IeTopic;
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
const S = (name: string, topic: IeTopic, o: { strong?: RegExp; weak?: RegExp; context?: RegExp; veto?: RegExp }): Signal => ({
  name,
  topic,
  ...o,
  strip: o.weak ? new RegExp(o.weak.source, "g") : undefined,
});

// ---------------------------------------------------------------------------
// Shared context fragments
// ---------------------------------------------------------------------------

/** Money-domain collocations shared by the broadest weak money signals (dayn, مدين,
 * رهن, كفالة, عارية). */
const MONEY_CTX =
  "درهم|دينار|دنانير|دراهم|نقد|نقود|فلس|فلوس|فكة|مسكوك|ذهب|فضة|ورق|عملة|عملات|دولار|يورو|ريال|جنيه|ليرة|فرنك|ثمن|سعر|قيمة|مال|أموال|اموال|تجارة|تاجر|سوق|بيع|شراء|قرض|دين|ديون|ربا|صرف|حوالة|شيك|صك|وثيقة|خراج|جزية|زكاة|كنز|بخل|إنفاق|ادخار|استثمار|ربح|خسارة|ثروة|غنى|فقر|مكيال|ميزان|صاع|رطل|أوقية|ذراع|شبر|قفيز|عشر|موات|إقطاع|بيت مال|جباية|مكوس|ضريبة|جمارك|نصاب|قسط|أقساط|آجل|مؤجل|نسيئة|وفاء|قضاء|سداد|أداء|قبض|تأجيل|مطلوب|غارم|غريم|مدين|إجارة|مضاربة|قيراض|مشاركة|شركة|شركاء|مرابحة|استصناع|جعالة|معاوضة|تورق|توريق|تأمين|تكافل|إقراض|خيار|إقالة|شفعة|غبن|تدليس|غش|نجش|احتكار|غرر|جهالة|وكالة|وكيل|وديعة|رهن|كفالة|ضمان|أجرة|إيجار|مزارعة|مساقاة|مقاولة|فائدة|معاملة|عقد|عقود|صفقة|مبايعة|بوالص|بوليصة|مصرف|بنك|صرافة|ديوان|سجل|رقاع|صحيفة|ميثاق|عهد|حلف|صلح|معاهدة|هدنة|موادعة|بيعة|أمان|ذمة|جوار|وقف|أوقاف|حبس|صدقة|جارية|أمد|ناظر|متولي|نظارة|سادن|للفقراء|للمساكين|لأهل|للمسجد|للقرآن|للعباد|لأبناء|للمسافرين|لأبناء السبيل|للأبد|خيرات|فوائد|ورقة|أوراق|دفع|حساب|تمويل|ربوي|دولارات|يوروهات|جنيهات|ريالات|ليرات|فرنكات|احتياط|متداولة|بضاعة|سلعة|نقداً|آجلاً|بذل|غنيمة|فيء|أنفال|خمس|أيديكم";
const MONEY_CTX_RE = any(MONEY_CTX);

/** Waqf-domain collocations: only unambiguous endowment markers — beneficiary phrases
 * (للأبد، للفقراء، للمسجد…), waqf vocabulary (أوقاف، موقوف، ناظر، متولي، حبس، جارية،
 * أمد…) and endowed-object nouns (مسجد، مدرسة، بئر، دار، أرض، مال…). Bare «وقف» senses
 * ("he stopped") need one of these to count. */
const WAQF_CTX =
  "للأبد|للفقراء|للمساكين|لأهل|للمسجد|للقرآن|للعباد|لأبناء|للمسافرين|لأبناء السبيل|لذوي|خيرات|ناظر|نظارة|متولي|سادن|حبس|حبوس|محبوس|جارية|أمد|وقفاً|الوقف|أوقاف|الأوقاف|موقوف|موقوفات|صدقة جارية|الصدقة الجارية|لا يباع|لا يورث|لا تباع|لا تهب|مسجد|مدرسة|مستشفى|بئر|سبيل|حوض|دار|أرض|مال|أموال|اموال";
const WAQF_CTX_RE = any(WAQF_CTX);

// ---------------------------------------------------------------------------
// The signal table
// ---------------------------------------------------------------------------

const SIGNALS: Signal[] = [
  // ============================ MONEY ============================

  // coins, cash, minting
  S("coins", "money", { strong: tok("دنانير|دينار|دراهم|درهم|فلوس|فلس|فكة|نقود|مسكوكات|مسكوك") }),
  S("cash_nqd", "money", { strong: phr("نقدا") }),
  S("metals", "money", {
    weak: tok("ذهب|الذهب|فضة|الفضة"),
    context: any("درهم|دينار|نقد|نقود|زكاة|بيوع|صرف|وزن|ميزان|كنز|الكنز|تجارة|مال|ثمن|قيمة|جوهرة|حلي|حلية|سبيكة|عيار|سبائك|استثمار|خراج|جزية|ينفقون|يربون|أموال|أيديكم|بذل|صدقة") }),
  S("mint_strike", "money", {
    weak: tok("ضرب|يضرب|ضربت|ضربوا|ضربنا|الضرب"),
    context: any("درهم|دينار|فلس|نقد|نقود|مسكوك|سكة|سكك|عملة|عملات|ذهب|فضة|نقاش|فلوس|دنانير|دراهم|النقود") ,
    veto: any("يضرب الله|يضرب الأمثال|ضرب الأمثال|ضرب المثل|يضرب لنا|ضرب لنا|يضرب بها|ضرب بها|ضربه الله|ضرب الله|مثل يضرب|يضرب المثل") }),
  S("mint_dar", "money", {
    strong: any("دار الضرب|دار السكة|ضرب الدراهم|ضرب الدينار|ضرب الفلوس|سكّة دار|ضربت الدولة|ضربت الدراهم|ضربت الدينار|ضربت الفلوس|ضربوا الدراهم|ضربوا الدينار|ضرب الدر|ضرب الفلس|ضرب النقود|ضرب المسكوك|ضرب العملة|ضرب العملات") }),
  S("mint_sikka", "money", {
    weak: tok("سكة|سكك|السكك"),
    context: any("ضرب|نقش|دار|نقود|درهم|دينار|فلس|عملة|عملات|مسكوك|دنانير|دراهم|النقود") }),
  S("mint_worker", "money", {
    weak: tok("الصيرفي|صيرفي|النقاش|نقاش"),
    context: any("ضرب|سكة|سكك|دار|نقود|درهم|دينار|مسكوك|عملة|نقش|فلوس|دنانير|دراهم") }),

  // exchange, price, value
  S("sarf", "money", { strong: tok("صرافة|الصرافة|صرفية") }),
  S("sarf_word", "money", {
    weak: tok("صراف|الصراف|يتصرف|تصرف|متصرف|صرف|يصرف|صرفوا|تصرفوا"),
    context: any("درهم|دينار|نقد|نقود|ذهب|فضة|فلوس|مال|أموال|اموال|ثمن|بيع|شراء|سعر|قيمة|عملة|عملات|ورق|بنك|حوالة|شيك|تجارة|سوق|بضاعة|سلعة") }),
  S("price", "money", { strong: tok("ثمن|الثمن|أثمان|بثمن") }),
  S("suar", "money", {
    weak: tok("سعر|السعر|أسعار|الأسعار"),
    context: any("ثمن|قيمة|مال|دراهم|دينار|نقد|نقود|بيع|شراء|تجارة|سوق|بضاعة|سلعة|غلاء|رخص|ارتفاع|انخفاض|زيادة|نقصان") }),
  S("value", "money", {
    weak: tok("قيمة|القيمة|قيم"),
    context: any("مال|ثمن|سعر|دراهم|دينار|نقد|نقود|بيع|شراء|تجارة|سوق|بضاعة|سلعة|أرض|دار|مالاً|أثمان") }),
  S("dearness", "money", {
    weak: tok("غلاء|الغلاء"),
    context: any("سعر|ثمن|مال|دراهم|دينار|نقد|بيع|شراء|تجارة|سوق|سنين|عام|عاماً|بلاء|شدة|قحط|جدب|رخاء|رخص") }),

  // usury, debt, credit
  S("riba", "money", {
    strong: any("الربا|يربون|ربا الفضل|ربا النسيئة|ربا الجاهلية|آكلو الربا|المراباة|مراباة|أكل الربا|آكلي الربا|يأكلون الربا|يأكل الربا") }),
  S("riba_bare", "money", {
    weak: phr("ربا|يربو|يربون|تربو|نربو|ربوا|تربوا|ينربو"),
    context: any("درهم|دينار|ذهب|فضة|قرض|نقد|نقود|بيع|شراء|فضل|نسيئة|ثمن|مال|قيمة|زيادة|زياد|أجل|مؤجل|آجل|بيوع|الذهب والفضة|ذهب وفضة") }),
  S("dayn_phrase", "money", {
    strong: any("قضاء الدين|قضاء ديني|وفاء بالدين|أداء الدين|سداد الدين|الدين الذي|عليه دين|عليه الدين|دين في عنق|دين مقبوض|قضاء دينه|أداء دينه|سداد دينه|دين عليه|قضاء دين|أداء دين|سداد دين|وفاء دين|قضاء الديون|أداء الديون|سداد الديون|الديون|الدين دينار|الدين درهم|الدين نقد|دين بالدرهم|دين بالدينار|دين بالنقد|دين دراهم|دين دنانير|دين فلوس|دين فلس|دين نقدا|دين ثمن|دين ثمنه|دين ثمنها|دين ثمنهم|دين ثمننا|دين ثمنكم|دين ثمنكن|دين ثمنك") }),
  S("dayn", "money", {
    weak: tok("دين|الدين"),
    context: MONEY_CTX_RE,
    veto: any("دين الله|دين الإسلام|ديننا|دينهم|دينك|ديني|دينها|دينكم|دينكن|في الدين|أهل الدين|علم الدين|شريعة|الدين الحق|الدين القيم|الدين القويم|دين الحق|دين القيم|دين القويم|الدين الباطل|دين الباطل|الدين الزائف|دين الزائف|الملة|دين الفطرة|دين الجاهلية|دين الموتى|دين القبور|دين النبيين|دين الرسل|دين إبراهيم|دين موسى|دين عيسى|دين محمد|دين الكفار|دين المشركين|الدينوري|الدينان|الدينين|الدينون") }),
  S("creditor", "money", { strong: tok("غارم|غريم|غرماء") }),
  S("creditor_weak", "money", {
    weak: tok("مدين|المدينين|المدينون"),
    context: MONEY_CTX_RE,
    veto: any("إلى مدين|تلقاء مدين|من مدين|بمدين") }),
  S("qard", "money", { strong: tok("القرض|قرض|قروض|أقرض|تسلف|استلف|استقرض|القرض الحسن|قرض حسن") }),
  S("salaf", "money", {
    weak: phr("سلف|السلف|سلفا|سلفه|سلفي"),
    context: any("مال|درهم|دينار|نقد|نقود|ثمن|قرض|بذل|أعطى|أقرض|دين|أجل|مؤجل|آجل|نسيئة|قسط|أقساط") }),
  S("nasia", "money", { strong: tok("نسيئة|النسيئة|بالنسيئة") }),
  S("deferred", "money", {
    weak: phr("آجل|مؤجل|قسط|القسط|أقساط|الأقساط|أقساطا|تأجيل|تأخير|تأخيراً"),
    context: any("بيع|شراء|ثمن|دين|دفع|سداد|قرض|نقد|درهم|دينار|مال|نسيئة|مؤجل|آجل|أجل|قبض|تسليم|تسلم") }),

  // trade, contracts, market law
  S("sale", "money", {
    strong: phr("البيع|بيع|الشراء|شراء|البيوع|بيعاً|شراءً|تجارة|التجارة|تاجر|التجار|تجار") }),
  S("sale_verb", "money", {
    strong: phr("باع|بيعت|باعوا|شترى|اشترى|اشتروا|اشترين|تباع|تباعون|يباع|يباعون|يبيع|تبيع|نبيع|ابيع|يشتري|تشتري|نشتري|تشتري|يُشترى|تُشترى") }),
  S("hire", "money", {
    strong: phr("إجارة|الإجارة|إيجار|الإيجار|أجرة|الأجرة|أجور|الأجور|مزارعة|المزارعة|مساقاة|المساقاة|مقاولة|المقاولة") }),
  S("hire_verb", "money", {
    weak: tok("أجار|أجارة|يؤجر|تؤجر|مؤجر|مستأجر|أجير|استأجر|مستأجرة"),
    context: any("دار|أرض|ثوب|دابة|خيمة|بيت|سكن|سفينة|ماشية|مزرعة|إجارة|الإجارة|إيجار|الإيجار|أجرة|الأجرة|أجور|الأجور|مال") }),
  S("aqd_muamala", "money", {
    weak: tok("عقد|العقد|العقود|عقود|معاملة|معاملات|صفقة|الصفقة|صفقات|مبايعة|المبايعة"),
    context: any("بيع|شراء|ثمن|مال|دين|إجارة|مضاربة|شركة|مشاركة|مرابحة|استصناع|جعالة|معاوضة|تورق|توريق|تأمين|تكافل|إقراض|خيار|إقالة|شفعة|عهود|ميثاق|صلح|حلف|شرط|شروط|بائع|مشتري|مبيعة|سعر|قيمة|دراهم|دينار|نقد|نقود|تجارة|سوق|بضاعة|سلعة|أرض|دار|ثوب|طعام|نقداً|آجلاً|وكالة|وكيل|وديعة|رهن|كفالة|ضمان|أجرة|إيجار|مزارعة|مساقاة|مقاولة|فائدة") }),
  S("mudaraba", "money", {
    weak: tok("مضاربة|قيراض|المضاربة|القيراض"),
    context: any("مال|تجارة|تاجر|بيع|شراء|ربح|نصاب|مشترك|شريك|ضارب|مضارب|تضارب") }),
  S("musharaka", "money", {
    weak: tok("مشاركة|الشركة|شركة|شركاء|الشركاء|مشاركات|مشاريع|شراكة"),
    context: any("مال|تجارة|تاجر|بيع|شراء|ربح|نصاب|مشترك|شريك|عقد|صفقة|تشارك|مشتركة|مشتركون") ,
    veto: any("الشركاء عن الشرك|أغنى الشركاء|لهم شركاء|شركاء شرعوا|من دون الله") }),
  S("salam", "money", {
    weak: tok("سلم|السلم|السلَم"),
    context: any("بيع|شراء|مال|طعام|عقد|نقد|درهم|دينار|مؤجل|آجل|ثمن|حيوان|إبل|شاة|تمر|حنطة|شعير|قبض|أجل|نسيئة|قسط|أقساط") ,
    veto: any("صلى|صلاة|صلوات|ركعة|ركعات|سجود|ساجد|سجدة|سجدتين|إمام|مأموم|الفجر|الظهر|العصر|المغرب|العشاء|الجماعة") }),
  S("option", "money", {
    weak: tok("خيار|الخيارات"),
    context: any("مجلس|بيع|شراء|شرط|عقد|ثمن|فسخ|بائع|مشتري|مبيعة|إقالة|شفعة|شفيع|إجارة|مضاربة|شركة|مشاركة|مرابحة|استصناع|جعالة|معاوضة") }),
  S("shufaa", "money", { strong: tok("إقالة|الإقالة|شفعة|الشفعة|أخذ الشفعة") }),
  S("market_ethics_strong", "money", {
    strong: any("الاحتكار|احتكار|النجش|نجش|التدليس|تدليس|البيع بالغرر|البيع بالجهالة|بيع الغرر|بيع الجهالة|الغبن|غبن") }),
  S("market_ethics", "money", {
    weak: tok("غبن|الغبن|تدليس|التدليس|غش|الغش|نجش|النجش|احتكار|الاحتكار|غرر|الغرر|جهالة|الجهالة|خديعة"),
    context: any("بيع|شراء|ثمن|سعر|تجارة|تاجر|سلعة|بضاعة|مال|تدليس|نجش|احتكار|غرر|جهالة|غبن|غش|خديعة|نصب|احتيال|تلاعب") }),
  S("agency", "money", {
    weak: tok("وكالة|الوكالة|وكيل|الوكيل|وكلاء|الوسطاء|وسيط|الوسيط"),
    context: any("مال|تجارة|تاجر|بيع|شراء|ثمن|سعر|قيمة|دراهم|دينار|نقد|نقود|سوق|بضاعة|سلعة|أرض|دار|مالاً|أموال|قيم|عقد|عقود|صفقة|مبايعة|إجارة|مضاربة|شركة|مشاركة|مرابحة|استصناع|جعالة|معاوضة|تورق|توريق|تأمين|تكافل|إقراض|خيار|إقالة|شفعة|غبن|تدليس|غش|نجش|احتكار|غرر|جهالة|وديعة|رهن|كفالة|ضمان|أجرة|إيجار|مزارعة|مساقاة|مقاولة|فائدة|معاملة") }),
  S("deposit", "money", {
    weak: tok("وديعة|الوديعة|ودائع|الودائع"),
    context: any("مال|أمانة|حفظ|أودع|أودعت|إيداع") }),
  S("rahn", "money", {
    weak: tok("رهن|الرهن|مرهون|المرهون|رهنوا|رهنه|رهنها|رهنهم|رهننا|رهنكم|رهنكن|رهنك"),
    context: MONEY_CTX_RE }),
  S("kafala", "money", {
    weak: tok("كفالة|الكفالة|كفيل|الكفيل|ضمان|الضمان|مضمون|ضمانا"),
    context: MONEY_CTX_RE }),
  S("ariyya", "money", {
    weak: tok("عارية|العارية"),
    context: MONEY_CTX_RE }),

  // weights and measures
  S("measures", "money", {
    strong: anySub("مكيال|كيال|المكيال|أوفوا الكيل|تبخس|تبخسوا|الطامفون في المكيال|الطامفين في المكيال|إذا كالوا|إذا وزنوا|الوزن والسعر|أوفوا المكيال|أوفوا الكيل والميزان|أوفوا الوزن|أوفوا الميزان|أوفوا الصاع|أوفوا المد|أوفوا الأوقية|أوفوا الرطل|أوفوا الذراع|أوفوا الشبر|أوفوا القفيز|أوفوا (?:ال)?(?:كيل|مكيال|وزن|ميزان|صاع|أوقية|رطل|ذراع|شبر|قفيز)") }),
  S("mizan", "money", {
    weak: tok("ميزان|الميزان"),
    context: any("وزن|كيلة|كَيْل|شراء|بيع|ثمن|دراهم|دينار|نقد|تجارة|صاع|مكيال|يوازن|قسط|سعر|الوزن|وزنوا|وزنتم") }),
  S("units", "money", { strong: tok("صاع|الصاع|أوقية|الاوقية|اوقية|رطل|الرطل|قفيز|القفيز") }),
  S("dhira", "money", {
    weak: tok("ذراع|الذراع|أذرع|ذرع"),
    context: any("كَيْل|مكيال|وزن|بناء|ثوب|قطعة|أرض|حدّ|مساحة|قياس|عُقدة|صاع|رطل|أوقية|ميزان") }),
  S("shibr", "money", {
    weak: tok("شبر|الشبر|أشبار|شبرا"),
    context: any("كَيْل|قياس|ثوب|بناء|أرض|مساحة|صاع|رطل|أوقية|ميزان|قفيز") }),

  // fiscal, treasury, zakat
  S("kharaj", "money", {
    strong: tok("خراج|الخراج|جزية|الجزية|الموات|موات|إقطاع|الإقطاع|بيت المال|بيت مال|مال بيت") }),
  S("ushr", "money", {
    weak: tok("عشر|العشر|عشور|العشور|عشرا"),
    context: any("زكاة|خراج|جزية|نصاب|نخل|حبوب|زرع|خمس|صدقة|مال|نقد|درهم|دينار") ,
    veto: any("اثني عشر|اثنا عشر|ثلاثة عشر|أربعة عشر|خمسة عشر|ستة عشر|سبعة عشر|ثمانية عشر|تسعة عشر") }),
  S("jibaya", "money", {
    weak: tok("الجباية|جباية|الجباة|جباة|الجبّاي|جباي"),
    context: any("مال|خراج|جزية|زكاة|دفع|أخذ|سعاة|عامل|دولة|سلطان|ملك") }),
  S("makus", "money", {
    weak: tok("مكوس|المكوس|مكوسا"),
    context: any("ضريبة|خراج|جزية|مال|تجارة|سوق|أخذ|جمارك") }),
  S("daraib", "money", { strong: tok("ضريبة|الضريبة|ضرائب|الضرائب") }),
  S("jums", "money", {
    weak: tok("جمارك|الجمارك|جماركا"),
    context: any("مال|تجارة|سوق|ضريبة|خراج|جزية|أخذ|دفع|سدد|بوابة|ميناء") }),
  S("zakat", "money", { strong: tok("الزكاة|زكاة|الزكوات|زكوات") }),
  S("zakat_yzki", "money", {
    weak: phr("يزكي|تزكية|تُزكى|يزكى|تزكوا|تزكى"),
    context: any("مال|نصاب|زكاة|درهم|دينار|ذهب|فضة|عروض|أنعام|زرع|نخل|فطر|صدق|بركة") }),

  // wealth, markets, economics discourse
  S("kanz", "money", {
    strong: tok("كنز|كنوز|الكنز|الكنوز|بخل|البخل|البخلاء|بخلاء|يبخل|تبخل|الإنفاق|إنفاق|أنفق|تنفق|ينفق|ادخار|الادخار|يدخر|تدخر|استثمار|الاستثمار|يستثمر|تستثمر|رأس المال|رأس مال|الخسارة|خسارة|الثروة|ثروة") }),
  S("ribh", "money", {
    weak: phr("ربح|الربح|ربحا|ربحه|ربحها|ربحهم|ربحنا|ربحكم|ربحكن|ربحك"),
    context: any("مال|تجارة|بيع|شراء|سوق|نقود|دراهم|دينار|استثمار|رأس مال|فائدة|خسارة|الخسارة|سداد|وفاء|قضاء|أداء|قبض|تسليم|تسلم|تأجيل|تأخير|قسط|أقساط|نسيئة|آجل|مؤجل|إجارة|مضاربة|قيراض|مشاركة|شركة|شركاء|مرابحة|استصناع|جعالة|معاوضة|تورق|توريق|تأمين|تكافل|إقراض|خيار|إقالة|شفعة|غبن|تدليس|غش|نجش|احتكار|غرر|جهالة") }),
  S("mal", "money", {
    weak: phr("مال|المال|أموال|الأموال|اموال|الاموال|غنى|الغنى|فقر|الفقر|ثروة|الثروة"),
    context: any("بذل|كنز|إنفاق|زكاة|صدقة|بيع|شراء|دراهم|دينار|نقد|نقود|ربا|قرض|تجارة|سوق|أموال اليتامى|في أيديكم|ما في أيديكم|استثمار|ادخار|بخل|ربح|خراج|جزية|خمس|غنيمة|فيء|أنفال|مال اليتامى|أموال الناس|أموال الضعفاء|ما ملكت أيمانكم|تحت أيديكم|ماله|مالها|مالهم|مالنا|مالكم|مالكن|أموالهم|أموالنا|أموالكم|أموالكن") }),
  S("suuq", "money", {
    weak: phr("سوق|السوق|أسواق|الأسواق"),
    context: any("تجارة|تاجر|بيع|شراء|سعر|ثمن|مال|دراهم|دينار|نقد|نقود|سلع|بضاعة|غنم|إبل|شاة|فرس|عبد|أمة|أرض|دار|ثوب|طعام|نقداً|آجلاً|مكاس|وكاس") }),
  S("worka", "money", {
    weak: tok("عملة|العملة|عملات|العملات"),
    context: any("ذهب|فضة|ورق|نقد|دولار|دينار|درهم|صرف|سعر|قيمة|يورو|ريال|جنيه|ليرة|فرنك|بنك|ورقية|صلبة|احتياط|متداولة") }),
  S("modern_currency", "money", {
    weak: tok("الدولار|دولار|اليورو|يورو|الجنيه|جنيه|الريال|ريال|الليرة|ليرة|الفرنك|فرنك"),
    context: any("عملة|نقد|ورق|ذهب|فضة|صرف|سعر|قيمة|بنك|دفع|سداد|تجارة|سوق|استثمار|دولار|يورو|دينار|درهم|ريال|جنيه|ليرة|فرنك|دولارات|يوروهات|جنيهات|ريالات|ليرات|فرنكات") }),
  S("iqtisad", "money", { strong: tok("اقتصاد|الاقتصاد|اقتصادي|اقتصادية|اقتصادا|اقتصاديين|اقتصاديا") }),
  S("faida", "money", {
    weak: tok("فائدة|الفائدة|فوائد|الفوائد"),
    context: any("مال|قرض|دين|ربا|استثمار|بنك|مصرف|شيك|ورقة|قيمة|ثمن|بيع|شراء") }),

  // ============================ SUKUK ============================

  // instruments, documents, modern finance
  S("sukuk", "sukuk", {
    strong: tok("صكوك|الصكوك|صكوكه|صكوكها|صكوكهم|سندات|السندات|كمبيالة|الكمبيالة|شيك|الشيك|شيكات|السفتجة|سفتجة|السفاتج|سفاتج|أوراق مالية|التوريق|التأمين|التكافل") }),
  S("sakk", "sukuk", {
    weak: tok("صك|الصك|صكا|سند|حوالة|الحوالة|حوالات|بوالص|البوالص|بوليصة"),
    context: any("مال|مالي|خزينة|ورقة|قيمة|دين|سندات|صك|وثيقة|دفع|سداد|ربح|فائدة|استثمار|بنك|مصرف|وقف|أرض|دار|حق|ميراث|بيع|شراء|شرط|عقد|نقود|درهم|دينار|نقد|عملات|عملة|دولار|يورو|أوراق|ورق|حوالة|بوالص|بوليصة|شيك|كمبيالة|سفتجة|توريق|تأمين|تكافل") }),
  S("hawala", "sukuk", {
    weak: tok("حوالة|الحوالة|حوالات"),
    context: any("دين|مال|دراهم|دينار|ثمن|سداد|دفع|نقد|بنك|شيك|صك|نقداً|آجلاً|كمبيالة|سفتجة|مصرف") }),
  S("bank", "sukuk", {
    weak: tok("مصرف|مصارف|المصارف|بنك|بنوك|البنوك|الصرافة|صرافة"),
    context: any("مال|حساب|وديعة|قرض|تمويل|استثمار|ربح|فائدة|دولار|شيك|حوالة|صك|عملات|عملة|درهم|دينار|ربوي|تجارة|سوق|نقد|ورق|ذهب|فضة|صرف|سعر|قيمة|دفع|سداد") }),
  S("documents", "sukuk", { strong: tok("وثيقة|وثائق|الوثيقة|وثائق") }),
  S("sijill", "sukuk", {
    weak: tok("سجل|سجلات|السجل|سجلا"),
    context: any("ديوان|قاضي|محكمة|مال|أرض|وقف|أوقاف|شهادة|وثيقة|محضر|ضبط|أحوال|أموال|جزية|خراج|قيد|قيود|تسجيل|تسجل|مسجل|مسجلة|مسجلون") }),
  S("raqqa", "sukuk", {
    weak: tok("رقاع|رقعة|الرقاع|رقاعا|ترقاع"),
    context: any("قرطاس|ورق|كتب|صك|وثيقة|رسالة|ديوان|أدب|شعر|نسخ|مصنف|كتاب|مصحف|رقع|مرقع|مرقعة|مرقعات") }),
  S("sahifa", "sukuk", {
    weak: tok("صحيفة|صحائف|الصحيفة"),
    context: any("مدينة|المدينة|دستور|عهد|ميثاق|وثيقة|صلح|عمر|النبي|الرسول|المسلمين|الإسلام|الاسلام|بنو|بني|الأنصار|المهاجرين") }),
  S("diwan_fiscal", "money", {
    weak: tok("ديوان|الديوان|دواوين|ديوانا"),
    context: any("خراج|مال|ضياع|جزية|سجل|كتب|رسائل|أوقاف|صدقات|ديوان الخراج|ديوان الصدقات|ديوان الأوقاف|ديوان المال|ديوان الجند|ديوان الرسائل|ديوان التوقيع|ديوان الندب") }),
  S("diwan_register", "sukuk", {
    weak: tok("ديوان|الديوان|دواوين|ديوانا"),
    context: any("سجل|كتب|رسائل|أحوال|ديوان الرسائل|ديوان التوقيع|ديوان الصدقات|ديوان الأوقاف|ديوان الجند|ديوان الخراج|ديوان الندب") }),

  // covenants, treaties, charters
  S("mithaq", "sukuk", { strong: tok("ميثاق|الميثاق|مواثيق|المواثيق|ميثاقا|ميثاقه|ميثاقها|ميثاقهم|ميثاقنا|ميثاقكم|ميثاقكن|ميثاقك") }),
  S("ahd", "sukuk", {
    weak: phr("عهد|العهد|عهود|العهود|عهدا"),
    context: any("أخذ|وفى|نقض|بين|الله|ميثاق|ذمة|جوار|أمان|موسى|إبراهيم|نوح|الأنبياء|بنو إسرائيل|بني إسرائيل|أهل|قبيلة|قريش|المهاجرين|الأنصار|أصحاب|رسول|نبي|خليفة|أمير|إمام|صحابة|الصحيفة|المدينة|الإسلام|الاسلام|مسلمين|المسلمين|عهد الله|عهد الرسول|عهد النبي"),
    veto: any("في عهد|من عهد|عهد عمر|عهد عثمان|عهد علي|عهد يزيد|عهد الوليد|عهد الرشيد|عهد المأمون|عهد المعتصم|عهد المتوكل|عهد الزمان|عهد الدنيا|عهد الجاهلية|عهد النبوة") }),
  S("hilf", "sukuk", {
    weak: tok("حلف|الأحلاف|حليف|الحلف|تحالف|التحالف|حلفوا|أحلاف|حلفن"),
    context: any("بين|أهل|قوم|بنو|بني|قبيلة|المهاجرين|الأنصار|الحلف|حلف الفضول|الفضول|ذمة|جوار|أمان|بيعة|عهد|معاهدة|صلح|نصرة|نصر|أنصار|أحلاف|تحالف|تحالفوا|حلفوا|حليف") }),
  S("sulh", "sukuk", {
    weak: tok("صلح|الصلح|صلحوا|تصالح|صالحوا"),
    context: any("بين|المسلمين|المشركين|معاهدة|الحديبية|صلح الحديبية|بني|أهل|قبيلة|القبائل|شروط|عهد|ذمة|جوار|أمان|المدينة|الإسلام|الاسلام|دولة|حرب|قتال|دماء|مسالمة|موادعة") }),
  S("muahada", "sukuk", { strong: tok("معاهدة|المعاهدة|معاهدات") }),
  S("hudna", "sukuk", { strong: tok("هدنة|الهدنة|هدنه|هدنت|هدنوا") }),
  S("muwada", "sukuk", { strong: tok("موادعة|المسالمة|مسالمة|المسالمة") }),
  S("bay_a", "sukuk", {
    weak: tok("بيعة|البيعة|البيعات|بايعوا|بايعوه|تبايع|تبايعوا|بايع|بايعن"),
    context: any("رسول|نبي|خليفة|إمام|باليد|أخذ|الأنصار|المهاجرين|عمر|عثمان|علي|أبي بكر|مسلمين|المسلمين|قبيلة|قوم|الناس|أهل|المبايعة|بيعات") }),
  S("aman", "sukuk", {
    weak: phr("أمان|الأمان|أمانا|بالأمان"),
    context: any("أعطى|ذمة|عهد|جوار|أهل|مسلمين|الناس|ضمان|الله|رسول|نبي|إمام|خليفة|قبيلة|قوم|بني|بنو|حماية"),
    veto: any("أمانة|الأمانة|أمانات|الأمانات") }),
  S("dhimma", "sukuk", {
    weak: phr("ذمة|الذمة|الذمم|بذمة|في ذمة"),
    context: any("الله|أهل الكتاب|جزية|عهد|جوار|أمان|مسلمين|الناس|بني|بنو|أهل|مال|دين|حق|واجب|شيء|عليه|له|لنا|ضمان|أخذ|وفى|نقض") }),
  S("jiwar", "sukuk", {
    weak: phr("جوار|الجوار|جواره|جوارا"),
    context: any("عهد|ذمة|أمان|أهل|قبيلة|بني|بنو|مسلمين|الناس|حماية|دار|هجرة|أخذ|الله|ضمان|أمن|أمنوا|إمام|خليفة|رسول|نبي"),
    veto: any("جوار الحرم|جوار المسجد|جوار الكعبة|جوار البيت|جوار مكة|جوار المدينة|جوار الكعبة") }),

  // ============================ WAQF ============================

  S("awqaf", "waqf", { strong: tok("الأوقاف|أوقاف|أوقافا|أوقافه|أوقافها|أوقافهم|أوقافنا|أوقافكم|أوقافكن|أوقافك") }),
  S("waqf", "waqf", {
    weak: tok("الوقف|وقف|وقفا|وقفه|وقفها|وقفهم|وقفنا|وقفكم|وقفكن|وقفك|وقفوا|وقفن"),
    context: WAQF_CTX_RE }),
  S("waqf_verb", "waqf", {
    weak: phr("أوقف|أوقفوا|أوقفت|يوقف|أوقفتم"),
    context: WAQF_CTX_RE }),
  S("waqf_stop", "waqf", {
    weak: phr("توقف|يتوقف|توقفوا|توقفت|توقفن"),
    context: WAQF_CTX_RE }),
  S("mauquf", "waqf", {
    weak: tok("موقوف|موقوفات|موقوفا|موقوفه|موقوفها|موقوفهم|موقوفنا|موقوفكم|موقوفكن|موقوفك"),
    context: WAQF_CTX_RE }),
  S("waqf_formula", "waqf", {
    strong: any("لا يباع ولا يورث|لا يورث ولا يباع|لا تباع ولا توهب|لا تباع ولا تهب|لا يباع|لا تُباع|لا يورث|لا يُباع|لا تباع|لا تهب") }),
  S("sadaqa_jariya", "waqf", {
    strong: any("صدقة جارية|الصدقة الجارية|جارية للأبد|جارية ما دامت|جارية ما بقيت|جارية في سبيل الله|جارية للأبد") }),
  S("jariya", "waqf", {
    weak: tok("جارية|الجارية|جاريه"),
    context: any("صدقة|وقف|حبس|أمد|خيرات|للأبد|ما دامت|ما بقيت|في سبيل الله|مسجد|مدرسة|للمسافرين|لأبناء السبيل|للفقراء|للمساكين") }),
  S("mutawalli", "waqf", {
    weak: tok("ناظر|الناظر|نظارة|نظار|متولي|المتولي|متولية|السادن|سادن"),
    context: WAQF_CTX_RE }),
  S("waqf_al", "waqf", {
    weak: phr("وقف على|موقوف على|الوقف على"),
    context: WAQF_CTX_RE }),
  S("ruqba_umri", "waqf", {
    weak: tok("الرقبى|رقبى|العمري|عمري"),
    context: any("وقف|أوقف|حبس|صدقة|جارية|أمد|للأبد|للفقراء|للمساكين|لأهل|للمسجد|للقرآن|للعباد|لأبناء|للمسافرين|لأبناء السبيل|خيرات|ناظر|متولي|أوقاف|موقوف") }),
  S("habs", "waqf", {
    weak: phr("حبس|الحبس|حبوس|محبوس|حبسا|حبسه|حبسها|حبسهم|حبسنا|حبسكم|حبسكن|حبسك"),
    context: any("للأبد|للفقراء|للمساكين|لأهل|للمسجد|للقرآن|للعباد|لأبناء|للمسافرين|لأبناء السبيل|لذوي|خيرات|وقف|أوقاف|الأوقاف|موقوف|جارية|أمد|صدق|ناظر|متولي|مسجد|مدرسة|بئر|سبيل|حوض|دار|أرض|مال|أموال|اموال") }),
  S("amad", "waqf", {
    weak: phr("أمد|الأمد|أمدا|أمده|أمدها|أمدهم|أمدنا|أمدكم|أمدكن|أمدك"),
    context: any("وقف|حبس|صدقة|جارية|للأبد|للفقراء|للمساكين|لأهل|للمسجد|للقرآن|للعباد|لأبناء|للمسافرين|لأبناء السبيل|خيرات|ناظر|متولي|مسجد|مدرسة|بئر|سبيل|حوض|دار|أرض|مال|أموال|اموال|مدد") }),
];

/** Passage records whose only lexical hit is a verified false positive. Curated escape
 * hatch: tagging a passage `islamic-economy-browser` also admits it (see pick in
 * export-api). Filled after the detection review sweep. */
export const IE_EXCLUDE = new Set<string>([]);

/** The matched signal names for a passage, or [] when it is not about money, deeds or waqf. */
export function ieSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can
  // name the «كتاب البيوع» chapter of a fiqh book without the passage itself being about it.
  const raw = normAr([n.data.text_search, n.data.text].filter(Boolean).join(" "));
  if (!raw || IE_EXCLUDE.has(n.id)) return [];
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

/** The topic chips a passage carries: money, sukuk and/or waqf. */
export function ieTopicsOf(n: Node): IeTopic[] {
  const signals = ieSignalsOf(n);
  const topics = new Set<IeTopic>();
  for (const s of SIGNALS) {
    if (signals.includes(s.name)) topics.add(s.topic);
  }
  return [...topics];
}

/** True when the passage mentions money, deeds/instruments/covenants, or endowment. */
export function isIslamicEconomyPassage(n: Node): boolean {
  return ieSignalsOf(n).length > 0;
}

/**
 * Which corpus an Islamic-economy passage belongs to, from its work: the frozen Qur'an,
 * the hadith collections (genre `hadith` or a hadith-unit passage), the seerah books
 * (genre `sira`), and every other harvested work. Works not yet harvested land in the
 * right section by their genre the day their passages arrive.
 */
export function ieCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): IeCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `islamic-economy-<section>` when present, else `curated`. */
export function ieTagSection(n: Node): IeSection {
  for (const t of n.tags) {
    if (!t.startsWith("islamic-economy-") || t === IE_TAG) continue;
    const id = t.slice("islamic-economy-".length);
    if ((IE_SECTIONS as readonly string[]).includes(id)) return id as IeSection;
  }
  return "curated";
}

/** The topic chips of a curated record, from its `islamic-economy-<topic>` tags (section tags are not topics). */
export function ieTagTopics(n: Node): IeTopic[] {
  return n.tags
    .filter((t) => t.startsWith("islamic-economy-") && t !== IE_TAG)
    .map((t) => t.slice("islamic-economy-".length))
    .filter((t): t is IeTopic => (IE_TOPICS as readonly string[]).includes(t));
}
