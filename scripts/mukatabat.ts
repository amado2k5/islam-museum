// The Mukatabat Browser's shared reads (docs/plan/46-mukatabat-browser.md): which passage
// records report or mention correspondence — letters sent by, received by, or exchanged
// between prophets, caliphs, kings and rulers — and which corpus section and sender class
// each belongs to. Detection runs at build time over the compiled graph, so a letter in any
// harvested book — and in every book harvested later — appears without any tagging step.
// Curated records join through the `mukatabat-browser` tag instead.
//
// Scope (founder's clarification): the letters sent from the Prophet, kings and caliphs to
// others — and, per the founder's answers, letters written TO them and replies received.
// Out of scope by design: the fiqh mukataba (manumission by instalments — «المكاتب»،
// «يعتق بمكاتبة»), «خاتم النبوة» the seal of prophethood as a title, the prophetic
// *message* sense of «الرسالة» («بلغ رسالة ربه»), scripture senses («الكتاب»، «كتب الله»،
// «مكتوب في»), sermon/address senses («خطب»، «خاطب»، bare «خطاب»), «صك» deed/receipt
// senses without a document context, and correspondence with no prophet/caliph/king party.
import type { Node } from "./build-graph.js";

export const MUKATABAT_TAG = "mukatabat-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const MUKATABAT_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type MukatabatSection = (typeof MUKATABAT_SECTIONS)[number];
export type MukatabatCorpus = Exclude<MukatabatSection, "curated">;
/** `letter` = the passage carries or reports an actual letter; `mention` = it is about correspondence. */
export type MukatabatKind = "letter" | "mention";
/** The correspondence's principal party class: the Prophet/prophets, the caliphs and the
 *  caliphate administration, kings/emperors/sultans, anyone else, or no identifiable party. */
export type MukatabatSender = "prophetic" | "caliphal" | "royal" | "other" | null;

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

// ---------------------------------------------------------------------------
// Letter vocabulary
// ---------------------------------------------------------------------------

/** The letter nouns: كتاب، رسالة، رقعة، صك، خطاب، جواب (+ clitic prefixes and pronoun suffixes). */
const LETTER_NOUN = String.raw`(?:كتاب|رسالة|رقعة|صك|خطاب|جواب)`;
/** A letter noun with an optional preposition (ب/ل/و/ف) and pronoun suffix. «في» is absent —
 *  «كتب في كتاب» is "wrote in a book" (a book sense), not a letter sent. */
const LETTER_OBJ = String.raw`(?:ب|ل|و|ف)?\s*${LETTER_NOUN}[ء-ي]{0,3}`;

/**
 * Send and reply verbs (perfect/imperfect families): كتب، أرسل، بعث، وجّه، ردّ،
 * أجاب، أنفذ، أوصل. «حمل»، «أتى»، «جاء»، «أقبل» take «بـ» before the letter noun
 * and are handled in their own pattern. «دعا» is deliberately absent — it is the
 * supplication verb.
 */
const SEND_VERB = String.raw`(?:[وبفسلك]?كتب|[وبفسلك]?تكتب|[وبفسلك]?يكتب|[وبفسلك]?نكتب|كتبوا|[وبفسلك]?أرسل|[وبفسلك]?ترسل|[وبفسلك]?يرسل|[وبفسلك]?نرسل|أرسلوا|[وبفسلك]?أنفذ|[وبفسلك]?تنفذ|[وبفسلك]?ينفذ|[وبفسلك]?أوصل|[وبفسلك]?توصل|[وبفسلك]?يوصل|[وبفسلك]?بعث|[وبفسلك]?تبعث|[وبفسلك]?يبعث|[وبفسلك]?نبعث|بعثوا|[وبفسلك]?وجّه|[وبفسلك]?توجّه|[وبفسلك]?يوجّه|[وبفسلك]?نوجّه|وجّهوا|[وبفسلك]?ردّ|[وبفسلك]?تردّ|[وبفسلك]?يردّ|[وبفسلك]?نردّ|ردّوا|[وبفسلك]?أجاب|[وبفسلك]?تجيب|[وبفسلك]?يجيب|[وبفسلك]?نجيب|أجابوا)`;
/** «حمل/أتى/جاء/أقبل + ب + letter» — carried or brought a letter. */
const BRING_VERB = String.raw`(?:[وبفسلك]?(?:حمل|تحمل|يحمل|نحمل|حملوا|أتى|أتيت|تأتي|يأتي|نأتي|جاء|جاءت|جاءوا|أقبل|تقبل|يقبل|نقبل))`;

/**
 * send/reply verb + up to six words + letter noun: «كتب إلى هرقل كتابا»، «أرسل إليه
 * رسالة»، «فأجاب بكتاب»، «بعث جوابه»، «كتب في صك». The gap stays small so a
 * «كتب» meaning "ordained" in a distant clause cannot pick up an unrelated noun.
 */
const AR_SEND_OBJ = new RegExp(`${BL}${SEND_VERB}(?=$|${E})\\s+(?:\\S+\\s+){0,6}${LETTER_OBJ}(?=$|${E})`);
/** bring/carry verb + «ب» + letter noun: «أتى بكتاب»، «حمل إليه كتابا». */
const AR_BRING_OBJ = new RegExp(`${BL}${BRING_VERB}(?=$|${E})\\s+(?:\\S+\\s+){0,4}ب(?:ال)?\\s*${LETTER_NOUN}[ء-ي]{0,3}(?=$|${E})`);

/**
 * send verb + «إلى/لـ» + a named ruler: «كتب إلى هرقل»، «أرسل إلى كسرى»، «بعث إلى
 * النجاشي». The recipient list is the attested royal correspondents plus the
 * generic royal titles; a send verb + «إلى» + a non-listed name is left to the
 * letter-noun patterns (and to curation) rather than guessed.
 */
const ROYAL_RECIPIENT = String.raw`هرقل|قيصر|كسرى|النجاشي|مقوقس|أبرويز|بلقيس|فرعون|السلطانة?|الملكة?|شاه|أكاسرة|الفرعون|أرحمة|المنذر`;
const AR_SEND_TO_ROYAL = new RegExp(`${BL}${SEND_VERB}(?=$|${E})\\s+(?:\\S+\\s+){0,4}(?:إلى|ل)\\s+(?:ال)?(?:${ROYAL_RECIPIENT})(?=$|${E})`);
/** «كتب/أرسل/بعث + إلى + النبي/رسول الله» — correspondence addressed to the Prophet. */
const AR_SEND_TO_PROPHET = new RegExp(`${BL}${SEND_VERB}(?=$|${E})\\s+(?:\\S+\\s+){0,4}(?:إلى|ل)\\s+(?:ال)?(?:النبي|رسول الله|محمد)(?=$|${E})`);
/**
 * «كتب/أرسل/بعث/وجّه/أنفذ/أوصل + إلى + <party>» — the generic send-to: in classical
 * usage «كتب إلى فلان» IS the correspondence act (the letter is implied). Divine
 * subjects («كتب الله إلى») and non-human recipients (السماء، اللوح، العرش…) are
 * gated per match below.
 */
const AR_SEND_TO_GENERIC = new RegExp(`${BL}(?:[وبفسلك]?كتب|[وبفسلك]?تكتب|[وبفسلك]?يكتب|[وبفسلك]?نكتب|كتبوا)(?=$|${E})\\s+(?:\\S+\\s+){0,4}إلى\\s+(\\S+)(?=$|${E})`, "g");
/** Recipients that are never correspondents: God, the heavens, the cosmic registers. */
const NON_CORRESPONDENT = /^(?:الله|ربه|ربك|ربنا|الرحمن|الرحيم|السماء|الأرض|اللوح|العرش|القلم|الصحف|المصحف|القرآن|الجن|الملائكة|النبيين|الأمم|القرون)$/;
/** «إلى» as "until/up to" — quantities, spans and measures, never a correspondent:
 *  «كتب له عشر حسنات إلى سبعمائة ضعف»، «يرسل الأخرى إلى أجل مسمى». */
const QUANTITY_RECIPIENT = /^(?:[0-9]+|سبعمائة|مائة|مئة|مائة|مئة|ألف|مليون|يوم|أيام|ليلة|ليال|شهر|شهور|أسبوع|أسابيع|ساعة|دقائق|ثانية|أجل|وقت|مدّة|مدة|فترة|فترات|طول|مسافة|درجة|درجات|مرتبة|مراتب|ضعف|أضعاف|أمثال|مثقال|حبة|حبات|دراهم|درهم|دينار|دنانير|صاع|أصع|مد|مدا|كيّل|كيلو|وزن|أوزان|طول|عرض|ارتفاع|عمق|سنين|سنة|أشهر|قرن|قرون|جيل|أجيال|دهر|آباد|أبد|دهور|نهاية|بداية|أول|آخر|نصف|ثلث|ربع|كثير|قليل|بعض|جميع|كل|غير|سوى|عدا|إلا|حيث|إذ|إذا|لما|منذ|مذ|آناء|حينئذ|الآن|اليوم|غدا|أمس|البارحة|صباحا|مساء|ظهرا|عشيا|ليلا|نهارا|سرّا|علانية|جهرًا|خفية|إسرارًا|إعلانًا|إشهارا|تسمية|تلقينا|تلقبنا|تلقينا|تلقينا|تلقينا|تلقينا|تلقينا|تلقينا)$/;
/** «جاءه/أتاه/وصله كتاب» — a letter arrived for someone (incoming correspondence). */
const AR_ARRIVE_LETTER = new RegExp(`${BL}(?:جاءه|أتاه|وصله|بلغه|بلغه)\\s+(?:\\S+\\s+){0,3}${LETTER_OBJ}(?=$|${E})`);

/**
 * Letter references: «في كتابه»، «في رسالته»، «في كتاب فلان»، «في رقعة»، «في
 * جوابه»، «في خطابه»، «في صكه» — a named letter as the object of a verb or
 * preposition. Scripture senses («كتاب الله»، «بلغ رسالة ربه») and the
 * «في كتاب <hadith author>» book senses are gated per match.
 */
const AR_LETTER_REF = new RegExp(`${BL}(?:في|من|عن|ب)\\s+${LETTER_NOUN}(?:ه|ها|هم|هن|نا|ي|ت|كم|كن|هما|ك)?(?=$|${E})`, "g");
/** What may NOT follow the noun in a letter reference: scripture and message senses. */
const REF_SCRIPTURE_AFTER = /^\s*(?:الله|المنزل|المنزّل|القيّم|العزيز|المجيد|المحكم|المبين|التنزيل|القرآن|الحكيم|ربك|ربنا|ربه|الناس|الأعمال|الحسنات|السيئات|الذكر|الآثار|الإسراء)/;
const REF_MESSAGE_BEFORE = /بلغ\s+رسالة|رسالة\s+ربه|رسالة\s+الله|أدّى\s+رسالة|حمل\s+رسالة/;
/** Hadith-author names after «كتاب»: «في كتاب مسلم/البخاري» names the book, not a letter. */
const BOOK_AUTHOR_AFTER = /^(?:مسلم|البخاري|بخاري|الترمذي|ترمذي|النسائي|نسائي|أبي داود|ابن ماجه|مالك|أحمد|ابن حبان|ابن خزيمة|الدارمي|الدارقطني|البيهقي|ابن أبي شيبة|ابن الجارود|ابن عدي|الطبراني|ابن كثير|السيوطي|ابن القيم|ابن تيمية|ابن الجوزي|النووي|ابن رجب|ابن حجر|ابن عساكر|ابن عبد البر|ابن قدامة|ابن العربي|الشافعي|الحنابلة|أبو حنيفة|أبو يوسف|محمد بن الحسن|ابن وهب|ابن عمر|ابن عباس|ابن مسعود|أبو هريرة|أنس بن مالك|الحسن|ابن سيرين|مجاهد|الضحاك|قتادة|السدي|ابن عباس|مقاتل|الفراء|الزجاج|الراغب|ابن جزي|ابن عرفة|السمين|أبو حيان|الجرجاني|الفخر|الرازي|البيضاوي|ابن كثير|الشنقيطي|السعدي|ابن باز|الألباني|الشافعي|مالك|أحمد|ابن تيمية)/;

/**
 * Found/received letter reports: «وجد كتاباً فيه كذا»، «وجدت كتابا»، «أصاب كتابا»،
 * «عثر على كتاب». «قرأ» counts only with a pronoun- or name-bound letter object
 * («قرأ كتابه» = read his letter) — a bare «قرأ كتابا/كتاب الله» book sense stays out.
 */
const AR_FOUND_LETTER = new RegExp(`${BL}(?:وجد|وجدت|أصاب|أصابت|عثر|عثر\s+على|وصل|وصلت|تلقى|تلقّى|تلقوا)\\s+(?:\\S+\\s+){0,4}${LETTER_OBJ}(?=$|${E})`);
const AR_READ_LETTER = new RegExp(`${BL}(?:قرأ|قرأت|تقرأ|يقرأ|قرأوا|اتلى|أتلى)\\s+(?:\\S+\\s+){0,3}كتاب(?=[ء-ي]{0,3})([ء-ي]{0,3})`, "g");

/**
 * Quoted letter openings: «من محمد إلى هرقل»، «من رسول الله إلى»، «من سليمان»
 * (the Bilqis letter), «من عمر إلى معاوية» (caliphal), «من الأمير/الوالي إلى»
 * (office letters). The «من … إلى» span is bounded so a «من مكان إلى مكان»
 * journey cannot match; the first term must be a prophet, ruler, caliph or office.
 */
const OPEN_FIRST = String.raw`محمد|رسول الله|سليمان|هرقل|كسرى|النجاشي|المقوقس|أبرويز|بلقيس|السلطان|السلطانة|الملك|الملكة|النبي|إبراهيم|إسماعيل|عيسى|موسى|هارون|نوح|هود|صالح|لوط|شعيب|إسحاق|يعقوب|يوسف|أيوب|يونس|يحيى|زكريا|داود|الخضر|عزير|ابراهيم|أبو بكر|عمر بن الخطاب|عثمان بن عفان|علي بن أبي طالب|معاوية|عبد الملك|الوليد|يزيد|هشام|مروان|السفاح|المنصور|المهدي|هارون الرشيد|المأمون|المعتصم|الواثق|المتوكل|عمر|عثمان|علي|الخليفة|أمير المؤمنين|الوالي|العامل|الأمير|القاضي|الوزير|صاحب البريد|صاحب الخاتم|صاحب الإنشاء`;
const AR_OPEN_NAMED = new RegExp(`${BL}من\\s+(?:${OPEN_FIRST})[ء-ي\\s]{0,50}?إلى[ء-ي\\s]{0,50}`);
/** «كتاب/رسالة/رقعة من <party>» — a letter *from* a named correspondent. The
 *  optional clitic covers «بكتاب من هرقل» (a letter *with/from* Heraclius). */
const AR_LETTER_FROM = new RegExp(`${BL}(?:ب|ل|و|ف)?${LETTER_NOUN}\\s+من\\s+(?:${OPEN_FIRST})(?=$|${E})`);
/**
 * Reply openings: «فكتب إليه: بسم الله…»، «فأجاب بكتاب: من فلان إلى فلان» —
 * a send/reply verb + recipient pronoun + a letter header (basmala or «من…إلى»)
 * inside the quoted text.
 */
const AR_REPLY_OPEN = new RegExp(`${BL}(?:كتب|كتبوا|أجاب|أجابت|أجابوا|ردّ|ردّت|ردّوا|أرسل|أرسلت|أرسلوا|بعث|بعثت|بعثوا)(?=$|${E})\\s+(?:إليه|له|لهم|إليهم|لها|لنا|لك|لكم)(?=$|${E})[ء-ي\\s«»"'،؛.]{0,60}?(?:بسم\\s+الله\\s+الرحمن\\s+الرحيم|من\\s+(?:${OPEN_FIRST})[ء-ي\\s]{0,50}?إلى)`);
const AR_OPEN_SULAIMAN = new RegExp(`${BL}من\\s+سليمان(?=[ء-ي\\s]{0,60}(?:بسم|الرحمن|الرحيم|إلى|كتاب|رسالة|إنه))`);
/** «بسم الله الرحمن الرحيم من <party> … إلى <party>» — a basmala letter header; the
 *  «من» must follow the basmala almost directly, so surah-opening basmalas whose
 *  «من…إلى» belongs to the verse text never match. */
const AR_BASMALA = /بسم\s+الله\s+الرحمن\s+الرحيم[\s،؛.]{0,12}من\s+(?:${OPEN_FIRST})[ء-ي\s]{0,60}?إلى[ء-ي\s]{0,60}/;

/**
 * The correspondence institutions and genre (mention-level): ديوان الخاتم، ديوان
 * البريد، ديوان الإنشاء، ديوان الرسائل، صاحب البريد، مكاتبات الملوك/الرسل،
 * مراسلة الملوك، and the «خاتم» of a king or chancery («خاتم كسرى»، «خاتم فضي»،
 * «خاتم كتاب»). «خاتم النبوة/الأنبياء/الرسل» as titles are the seal of prophethood — out.
 */
const AR_DIWAN = /ديوان\s+(?:ال)?(?:خاتم|بريد|إنشاء|رسائل|كتاب|مكاتبات|مراسلات)(?=$|[\sء-ي])/;
const AR_DIWAN_OTHER = /ديوان\s+(?:ال)?(?:شعر|أدب|علم|فقه|حديث|تفسير|لغة|نحو|أصول|موسيقى|حساب)/;
const AR_SAHIB_BARID = /صاحب\s+(?:ال)?(?:بريد|خاتم|إنشاء|رسائل|مكاتبات)(?=$|[\sء-ي])/;
/** Bare «بريد/البريد» — the barid post itself («ولى عثمان البريد»، «بريد الطير»). */
const AR_BARID = /(?:^|[^ء-ي])(?:ال)?بريد(?=$|[\sء-ي،؛])/;
const AR_MUKATABAT_NOUN = /(?:مكاتبات|مراسلات|مكاتب\s+ال?(?:ملوك|رسل|سلاطين|أمراء|ولاة|أجناد)|مراسلة\s+ال?(?:ملوك|رسل|سلاطين|أمراء)|مكاتبة\s+ال?(?:ملوك|رسل|سلاطين))/;
const AR_KHATM_DOC = /خواتم\s+(?:ال)?(?:ملوك|رسل|سلاطين|خلفاء)|خاتم(?:ه|ها|هم|نا|ي|ك|كم|هما)?\s+(?:كسرى|فضي|ذهب|الكتاب|الرسالة|الصك|الرقعة|إمام|سلطان|ملك|خليفة|الخليفة|رسول|على|في|فيه|كتاب|رسالة)|خاتم\s+(?:على|في|فيه|كتاب|رسالة)/;
const AR_KHATM_NUBUWWA = /خاتم\s+(?:ال)?(?:نبوة|أنبياء|رسل(?!و)|النبيين|الرسالة)/;

/**
 * «مكاتب/مكاتبة» fiqh mukataba gate: within a short window of the word, the
 * markers عبد، مملوك، غلم، سرير، نصف، شريك، عتق، أعتق، يعتق, مال، درهم, دينار,
 * قسط, سيد, مولى, أمة, جارية mark the slave self-purchase contract — never
 * correspondence. Checked per match so one fiqh use does not poison a passage.
 */
const MUKATABA_FIQH = /(?:عبد|مملوك|غلم|سرير|نصف|شريك|عتق|أعتق|يعتق|مال|درهم|دينار|قسط|أقساط|سيد|مولى|أمة|جارية|مكاتبا|على\s+مال|بمال|بدينار|بدرهم)/;
const AR_MUKATABA_WORD = /مكاتب[ةه]?(?=$|[\sء-ي])/g;

/**
 * «كاتب»/«راسل» Form III (corresponded) — «كاتب الملوك»، «كان يراسل هرقل». The
 * match window is checked for slave objects («كاتب عبده» is the mukataba contract).
 */
const AR_KATABA_VERB = new RegExp(`${BL}(?:[وبفسلك]?(?:كاتب|تكاتب|يكاتب|نكاتب|كاتبوا|تكاتبوا|راسل|تراسل|يراسل|نراسل|راسلوا))(?=$|${E})[ء-ي\\s]{0,60}`, "g");
const SLAVE_OBJECT = /(?:عبده|أمته|غلامه|جاريته|مملوكه|سريره|نفسه\s+على|على\s+مال|بمال|بدينار|بدرهم|بنفسه)/;

/**
 * «صحيفة» — leaf/notebook/document. Counts only beside a send, find, write or
 * «في» document context; a bare «صحيفة» page sense never matches alone.
 */
const AR_SAHIFA = new RegExp(`${BL}صحيفة[ء-ي]{0,3}(?=$|${E})`, "g");
const SAHIFA_CONTEXT = /(?:كتب|أرسل|بعث|وجد|قرأ|في|رقعة|خطاب|رسالة|صك|ديوان|خاتم|ورقة|صفحة)/;

// ---------------------------------------------------------------------------
// Sender classes
// ---------------------------------------------------------------------------

/** Prophets and messenger-kings whose correspondence belongs to the prophetic class. */
const PROPHET_NAMES = String.raw`محمد|رسول الله|النبي|سليمان|عيسى|موسى|هارون|نوح|هود|صالح|لوط|شعيب|إسماعيل|إسحاق|يعقوب|يوسف|أيوب|يونس|يحيى|زكريا|داود|إبراهيم|الخضر|عزير|ابراهيم`;
/** Caliphs and the caliphate administration that carries their letters. */
const CALIPH_NAMES = String.raw`أبو بكر|الصديق|عمر بن الخطاب|عثمان بن عفان|علي بن أبي طالب|معاوية بن أبي سفيان|عبد الملك بن مروان|الوليد بن عبد الملك|يزيد بن معاوية|يزيد بن عبد الملك|هشام بن عبد الملك|مروان بن محمد|إبراهيم بن الوليد|السفاح|المنصور|المهدي|هارون الرشيد|المأمون|المعتصم|الواثق|المتوكل|عمر|عثمان|علي|معاوية|عبد الملك|الوليد|يزيد|هشام|مروان|إبراهيم|الخلفاء|الخليفة|أمير المؤمنين|بنو أمية|بنو العباس|الأمويين|العباسيين`;
const CALIPH_TITLES = String.raw`الخليفة|أمير المؤمنين|الوالي|العامل|صاحب البريد|صاحب الخاتم|صاحب الإنشاء|قاضي القضاة|الوزير|وال|عامل`;
/** Kings, emperors, sultans and royal titles. */
const ROYAL_NAMES = String.raw`هرقل|قيصر|كسرى|أبرويز|النجاشي|أرحمة|المقوقس|بلقيس|ملكة سبأ|فرعون|الفرعون|النمرود|السلطانة?|الملكة?|شاهنشاه|أكاسرة|السلطان|السلطانة|الملك|الملكة|شاه|قيصر الروم|هرقل الروم|أبرويز بن قباد|كسرى بن قباد|شاور|المنذر|النعمان|جذيمة|أنوشروان|بهرام|شهرورز`;

const RE_PROPHET = new RegExp(`${BL}(?:${PROPHET_NAMES})(?=$|${E})`);
const RE_CALIPH = new RegExp(`${BL}(?:${CALIPH_NAMES})(?=$|${E})`);
const RE_CALIPH_TITLE = new RegExp(`${BL}(?:${CALIPH_TITLES})(?=$|${E})`);
const RE_ROYAL = new RegExp(`${BL}(?:${ROYAL_NAMES})(?=$|${E})`);

/**
 * Direction-aware sender: a quoted «من <party> … إلى <party>» names the letter's
 * author first — «من هرقل إلى» is a royal letter, «من عمر إلى» a caliphal one,
 * «من محمد إلى هرقل» a prophetic one. Checked before the name-priority fallback
 * so incoming letters classify by their actual sender.
 */
const AR_FROM_TO = /من\s+([ء-ي]+(?:\s+[ء-ي]+){0,3}?)\s+(?:إلى|الي)(?=$|[\sء-ي])/g;
const SENDER_FIRST: [RegExp, MukatabatSender][] = [
  [new RegExp(`^(?:${PROPHET_NAMES})(?=$|${E})`), "prophetic"],
  [new RegExp(`^(?:${CALIPH_NAMES}|${CALIPH_TITLES})(?=$|${E})`), "caliphal"],
  [new RegExp(`^(?:${ROYAL_NAMES})(?=$|${E})`), "royal"],
];
function senderFromDirection(raw: string): MukatabatSender | null {
  for (const m of raw.matchAll(AR_FROM_TO)) {
    const who = (m[1] ?? "").trim();
    for (const [re, cls] of SENDER_FIRST) if (re.test(who)) return cls;
  }
  return null;
}

/** Institution-level royal markers for mention-kind passages about kings' correspondence. */
const RE_ROYAL_INSTITUTION = /مكاتبات\s+(?:ال)?(?:ملوك|سلاطين)|خواتيم\s+(?:ال)?(?:ملوك|سلاطين)|خاتم\s+(?:كسرى|السلطان|الملك)|ملك\s+(?:ال)?(?:روم|فارس|الحبشة|اليمن|الأرض)|مراسلة\s+(?:ال)?(?:ملوك|سلاطين)/;

// ---------------------------------------------------------------------------
// Detector
// ---------------------------------------------------------------------------

/**
 * Passage records whose only lexical hit is a verified false positive. Curated
 * escape hatch: tagging a passage `mukatabat-browser` also admits it.
 */
export const MUKATABAT_EXCLUDE = new Set<string>([
  // «لما خلق/قضى الله الخلق كتب في كتابه/كتب كتابا عنده» — God's register (kitab
  // 'indahu), not correspondence; six transmissions of the same report.
  "passage/bukhari-3194",
  "passage/bukhari-7404",
  "passage/bukhari-7553",
  "passage/bukhari-7554",
  "passage/muslim-2751",
  "passage/muslim-2751c",
  // «يا أيها الذين آمنوا إذا تداينتم بدين … فاكتبوه» — the debt-contract scribe
  // sense of «كاتب/يكتب», not correspondence.
  "passage/quran-2-282",
  "passage/quran-2-283",
  // Uthman's mushaf standardisation: «أرسل إلى كل أفق بمصحف» sends codices, and
  // «في كل صحيفة أو مصحف» names a physical codex — not correspondence.
  "passage/bukhari-4987",
]);

const LETTER_SIGNALS = new Set([
  "send_obj", "bring_obj", "send_to_royal", "send_to_prophet", "send_to",
  "arrive_letter", "letter_ref", "found_letter", "read_letter",
  "open_named", "open_sulaiman", "basmala_open", "letter_from", "reply_open",
  "kataba_verb", "sahifa",
]);
const MENTION_SIGNALS = new Set([
  "diwan", "sahib_barid", "barid", "mukatabat_noun", "khatm_doc",
]);

function rawTextOf(n: Node): string {
  return [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    // The dagger alif (ٰ) is a long ā — restore it to alif BEFORE stripping, or
    // «كِتَـٰبِ» collapses to «كتب» and the noun "book" reads as the verb "wrote".
    .replace(/ٰ/g, "ا")
    // Tatweel is pure elongation — remove it outright.
    .replace(/ـ/g, "")
    .replace(DIACRITICS, "");
}

/** Whether a «مكاتب/مكاتبة» match sits inside the fiqh mukataba contract context. */
function isFiqhMukataba(raw: string, index: number): boolean {
  const window = raw.slice(Math.max(0, index - 100), index + 120);
  return MUKATABA_FIQH.test(window);
}

/**
 * The divine-book sense: «كتب الله»، «كتب عليكم»، «أم الكتاب»، «اللوح المحفوظ»،
 * «عند الله/عند ربه/عنده» — God's register. A «كتاب» in this context is the
 * divine record, never a letter. Checked around each weak-signal match.
 */
const DIVINE_BOOK = /كتب\s+الله|كتب\s+عليكم|كتب\s+عليهم|كتب\s+في\s+(?:ال)?(?:لوح|صحف)|أم\s+الكتاب|اللوح\s+المحفوظ|عند\s+(?:الله|ربه|ربك|مولاه)|عنده|فوق\s+العرش|قضى\s+الله|خلق\s+الله|لما\s+(?:خلق|قضى)\s+الله|قال\s+في\s+كتاب|تلا\s+في\s+كتاب|يتلو\s+في\s+كتاب|نزل\s+في\s+كتاب|أنزل\s+في\s+كتاب|أوحى\s+في\s+كتاب|في\s+كتاب\s+الله|في\s+كتاب\s+ربك|في\s+كتاب\s+ربه/;
/**
 * The mushaf/scripture page sense: «في كتابه وما في الصحيفة» (understanding given
 * in the Book and the page), «ما في المصحف» — «كتاب/صحيفة» here names the
 * scripture or its page, never a letter. Checked around weak letter signals.
 */
const SCRIPTURE_PAGE = /صحيفة|صحف|مصحف|قرآن|فهم|تلاوة|تلا|آية|سورة|مصحفا/;

/** Words that may legitimately continue a letter reference («كتاب فيه»، «كتاب
 *  الذي»، «كتاب على»، «كتاب من») — prepositions, relatives and determiners.
 *  Bare conjunctions («و»، «ف»، «ثم») are absent: «من كتاب ولا تخطه» is the
 *  scripture sense, not a document. Each alternative must end at a word boundary. */
const REF_CONTINUE = /^\s*(?:فيه|فيها|منه|عنه|عليه|إليه|الذي|التي|اللذان|اللذين|على|إلى|مع|عند|لدى|بين|تحت|فوق|أمام|وراء|قبل|بعد|حين|يوم|هذا|هذه|ذلك|تلك|هنا|هناك|أينما|كيفما|مهما|أي|كل|بعض|جميع|غير|سوى|عدا|إلا|إما|سواء|فقط|وحده|معه|معها|معهم|معهن|معنا|معي|معك|معكما|معكم|معكن|ما|الذين|اللاتي|اللواتي|اللواتي|اللتين|حيثما|إذ|إذا|لما|منذ|مذ|آناء|حينئذ)(?=$|[\sء-ي،؛])/;

/** The matched signal names for a passage, or [] when it is not about correspondence. */
export function mukatabatSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  const raw = rawTextOf(n);
  if (!raw || MUKATABAT_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();

  // Weak signals (letter_ref, send_obj, found_letter, read_letter) are suppressed
  // inside the divine-book context; strong signals (send_to_*, open_*, institutions)
  // are not — a letter report may mention God's book for another reason.
  const divineAt = (index: number) => {
    const w = raw.slice(Math.max(0, index - 70), index + 90);
    return DIVINE_BOOK.test(w);
  };

  if (AR_SEND_OBJ.test(raw) && !divineAt(raw.search(AR_SEND_OBJ))) hits.add("send_obj");
  if (AR_BRING_OBJ.test(raw)) hits.add("bring_obj");
  if (AR_SEND_TO_ROYAL.test(raw)) hits.add("send_to_royal");
  if (AR_SEND_TO_PROPHET.test(raw)) hits.add("send_to_prophet");
  if (AR_ARRIVE_LETTER.test(raw)) hits.add("arrive_letter");
  if (AR_OPEN_NAMED.test(raw)) hits.add("open_named");
  if (AR_OPEN_SULAIMAN.test(raw)) hits.add("open_sulaiman");
  if (AR_BASMALA.test(raw)) hits.add("basmala_open");
  if (AR_LETTER_FROM.test(raw)) hits.add("letter_from");
  if (AR_REPLY_OPEN.test(raw)) hits.add("reply_open");

  // Generic «كتب إلى <party>»: correspondence by the write-to act itself. Divine
  // subjects («كتب الله إلى») and non-correspondent recipients are skipped per match.
  for (const m of raw.matchAll(AR_SEND_TO_GENERIC)) {
    const recipient = m[1] ?? "";
    if (NON_CORRESPONDENT.test(recipient) || QUANTITY_RECIPIENT.test(recipient)) continue;
    const span = m[0];
    // «كتب الله/ربه إلى» — the divine subject inside the verb-to-إلى span.
    if (new RegExp(`${SEND_VERB}(?=$|${E})\\s+(?:الله|ربه|ربك|ربنا|الرحمن|الرحيم)(?=$|${E})`).test(span)) continue;
    // «كتب عليه/له/عليهم … إلى» — the ordain/record sense («كتب عليهم القتل إلى
    // مضاجعهم»): a pronoun right after the verb makes it "written upon/for",
    // never "wrote to".
    const afterVerb = span.trimStart().replace(/^[وبفسلك]*(?:كتب|تكتب|يكتب|نكتب|كتبوا)\s+/, "");
    const firstWord = afterVerb.split(/\s+/)[0] ?? "";
    if (/^(?:عليه|عليها|عليهم|له|لها|لهم|لنا|بها|به|بي|بك|بكم|بهن|بنا|بهم|إليه|إليها|إليهم|له|لهم)$/.test(firstWord)) continue;
    hits.add("send_to");
    break;
  }

  // «في كتابه/رسالته…» — letter reference: needs a pronoun-bound document or a
  // continuation («كتاب فيه»، «كتاب الذي»); bare «كتاب + adjective» is "the Book".
  for (const m of raw.matchAll(AR_LETTER_REF)) {
    const noun = m[0].replace(/^[^ء-ي]*/, "").replace(/^(?:في|من|عن|ب)\s+/, "");
    const after = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 45);
    const before = raw.slice(Math.max(0, m.index! - 40), m.index!);
    if (REF_SCRIPTURE_AFTER.test(after)) continue;
    if (BOOK_AUTHOR_AFTER.test(after.trimStart())) continue;
    if (REF_MESSAGE_BEFORE.test(before + m[0])) continue;
    if (divineAt(m.index!)) continue;
    const pageWindow = raw.slice(Math.max(0, m.index! - 80), m.index! + 80);
    if (SCRIPTURE_PAGE.test(pageWindow)) continue;
    const hasPronoun = /(?:ه|ها|هم|هن|نا|ي|ت|كم|كن|هما|ك)$/.test(noun) && !/^(?:كتاب|رسالة|رقعة|صك|خطاب|جواب)$/.test(noun);
    const continues = REF_CONTINUE.test(after);
    if (!hasPronoun && !continues) continue;
    hits.add("letter_ref");
    break;
  }

  if (AR_FOUND_LETTER.test(raw)) {
    const idx = raw.search(AR_FOUND_LETTER);
    if (!divineAt(idx)) hits.add("found_letter");
  }
  for (const m of raw.matchAll(AR_READ_LETTER)) {
    const tail = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
    const noun = m[0].match(/كتاب[ء-ي]{0,3}$/)?.[0] ?? "كتاب";
    const hasPronoun = /(?:ه|ها|هم|هن|نا|ي|ت|كم|كن|هما|ك)$/.test(noun) && noun !== "كتاب";
    if (REF_SCRIPTURE_AFTER.test(tail.trimStart())) continue;
    if (!hasPronoun) continue;
    if (divineAt(m.index!)) continue;
    hits.add("read_letter");
    break;
  }

  for (const m of raw.matchAll(AR_KATABA_VERB)) {
    // «كاتب علي» = Ali's scribe (a person), «كاتب عبده/عليهم» = the fiqh
    // manumission contract — neither is correspondence.
    if (/كاتب\s+(?:ال)?(?:نبي|رسول|علي|أمير|والي|قاضي|سلطان|ملك|خليفة|إمام|صاحب|دواوين|الكتب|المهدي|السلطان)/.test(m[0])) continue;
    if (isFiqhMukataba(raw, m.index!)) continue;
    if (!SLAVE_OBJECT.test(m[0])) { hits.add("kataba_verb"); break; }
  }

  for (const m of raw.matchAll(AR_SAHIFA)) {
    const window = raw.slice(Math.max(0, m.index! - 50), m.index! + 70);
    if (SAHIFA_CONTEXT.test(window) && !/(?:مصحف|قرآن|صحف|فهم|تلاوة|تلا|آية|سورة)/.test(window)) { hits.add("sahifa"); break; }
  }

  // Institutions and genre nouns (mention-level).
  if (AR_DIWAN.test(raw) && !AR_DIWAN_OTHER.test(raw)) hits.add("diwan");
  if (AR_SAHIB_BARID.test(raw)) hits.add("sahib_barid");
  if (AR_BARID.test(raw)) hits.add("barid");
  if (AR_MUKATABAT_NOUN.test(raw)) hits.add("mukatabat_noun");
  if (AR_KHATM_DOC.test(raw) && !AR_KHATM_NUBUWWA.test(raw)) hits.add("khatm_doc");

  // «مكاتب/مكاتبة» — correspondence plural counts; the fiqh contract is gated per match.
  for (const m of raw.matchAll(AR_MUKATABA_WORD)) {
    if (isFiqhMukataba(raw, m.index!)) continue;
    hits.add("mukatabat_noun");
    break;
  }

  return [...hits];
}

/** True when the passage reports or mentions correspondence involving a prophet, caliph or king. */
export function isMukatabatPassage(n: Node): boolean {
  return mukatabatSignalsOf(n).length > 0;
}

/** `letter` when the passage carries an actual letter, `mention` when it is only about correspondence. */
export function mukatabatKindOf(n: Node): MukatabatKind {
  const signals = mukatabatSignalsOf(n);
  return signals.some((s) => LETTER_SIGNALS.has(s)) ? "letter" : "mention";
}

/**
 * The correspondence's principal party class. Priority: prophetic > caliphal > royal;
 * `other` when correspondence signals exist but no class party is named; `null` for
 * genre-level mentions with no identifiable party. Actor names are matched anywhere in
 * the passage text — passages are short, and the named parties of a letter report are
 * the passage's subject.
 */
export function mukatabatSenderOf(n: Node): MukatabatSender {
  if (n.class !== "passage" || n.stub) return null;
  if (!isMukatabatPassage(n)) return null;
  const raw = rawTextOf(n);
  const directed = senderFromDirection(raw);
  if (directed) return directed;
  if (RE_PROPHET.test(raw)) return "prophetic";
  if (RE_CALIPH.test(raw) || RE_CALIPH_TITLE.test(raw)) return "caliphal";
  if (RE_ROYAL.test(raw) || RE_ROYAL_INSTITUTION.test(raw)) return "royal";
  const signals = mukatabatSignalsOf(n);
  const hasPartyContext = signals.some((s) => ["send_to_royal", "send_to_prophet", "open_named", "open_sulaiman", "basmala_open", "kataba_verb", "send_obj", "bring_obj", "found_letter", "arrive_letter", "letter_ref", "read_letter"].includes(s));
  return hasPartyContext ? "other" : null;
}

/**
 * Which corpus a mukatabat passage belongs to, from its work: the frozen Qur'an, the
 * hadith collections (genre `hadith` or a hadith-unit passage), the seerah books
 * (genre `sira`), and every other harvested work.
 */
export function mukatabatCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): MukatabatCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `mukatabat-<section>` when present, else `curated`. */
export function mukatabatTagSection(n: Node): MukatabatSection {
  for (const t of n.tags) {
    if (!t.startsWith("mukatabat-") || t === MUKATABAT_TAG) continue;
    const id = t.slice(10);
    if ((MUKATABAT_SECTIONS as readonly string[]).includes(id)) return id as MukatabatSection;
  }
  return "curated";
}

/** The sender tag of a curated record: `mukatabat-<sender>` when it names a sender class. */
export function mukatabatTagSender(n: Node): MukatabatSender {
  for (const t of n.tags) {
    if (!t.startsWith("mukatabat-") || t === MUKATABAT_TAG) continue;
    const id = t.slice(10);
    if (["prophetic", "caliphal", "royal", "other"].includes(id)) return id as MukatabatSender;
  }
  return null;
}
