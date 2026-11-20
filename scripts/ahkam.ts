// The Rulings Browser's shared reads (docs/plan/73-ahkam-browser.md): which passage records
// name or carry one of the degrees of obligation the founder asked for —
//  • «الفروض» (`fard`)              — what the texts say God or His Messenger made obligatory:
//    «فرض الله»، «فريضة»، «افترضت عليه»، «كتب عليكم»;
//  • «فروض العين» (`fard-ayn`)      — the obligation on every person: «فريضة على كل مسلم»،
//    «واجب على كل محتلم»، and the jurists' «فرض عين»;
//  • «فروض الكفاية» (`fard-kifaya`) — the obligation on the community, lifted from the rest
//    when some carry it: «فرض كفاية»، «إذا قام به البعض سقط عن الباقين»;
//  • «الطاعات» (`taat`)             — obedience to God and His Messenger and the acts of
//    obedience: «أطيعوا الله»، «من أطاعني»، «طاعة الله»، «الطاعات»;
//  • «الواجبات» (`wajib`)           — the word «واجب» and its verbs: «يجب على»، «وجوب»،
//    «حق على كل مسلم»، «لو قلت نعم لوجبت»;
//  • «المستحبات» (`mustahabb`)      — the recommended: «مستحب»، «مندوب»، «نافلة»، «تطوع»،
//    «لولا أن أشق على أمتي»، «ليس بواجب»، «سنة مؤكدة»;
//  • «المحرمات» (`haram`)           — the forbidden as a ruling: «حرام»، «حرم الله»، «لا
//    يحل»، «تحريم»، «المحرمات»، «محارم الله» (the Halal and Haram Browser's own unlawful-side
//    lexicon, read here so the two browsers can never disagree);
//  • «المكروهات» (`makruh`)         — the disliked: «مكروه»، «كراهة»، «كان يكره»، «إن الله
//    كره لكم»، «نهينا … ولم يعزم علينا»;
//  • «صغائر الذنوب» (`saghair`)     — the minor sins: «الصغائر»، «اللمم»، «محقرات الذنوب»،
//    «ما اجتنبت الكبائر»، «مكفرات لما بينهن»;
//  • «وخلافه» (`mubah`)             — what remains of the scale: the permitted and the
//    concession: «مباح»، «رخصة»، «لا جناح»، «لا حرج»، «وما سكت عنه فهو عفو» —
// and which corpus section each belongs to. Detection runs at build time over the compiled
// graph, so a mention in any harvested book — and in every book harvested later — appears
// without any tagging step. Curated records join through the `ahkam-browser` tag.
//
// Qur'an verses come from a reviewed table (AHKAM_QURAN), never from the lexicon: each verse
// listed was read against its frozen Tanzil text, and the table names the verses whose own
// wording carries the theme («كتب عليكم»، «فريضة من الله»، «أطيعوا الله»، «حرمت عليكم»، «لا
// جناح عليكم»، «اللمم»). Every other passage is read by the guarded lexicon below. Strong
// signals admit a passage; weak ones (a bare «يكره», «المكتوبة», «السمع والطاعة») count only
// beside a strong one or two at a time.
//
// The browser describes what the texts and the jurists say; it classes nothing itself. A bare
// «نهى عن» is therefore not a signal: whether a given prohibition is forbidding or dislike is a
// jurist's reading, so such a report appears only when its own wording names the degree.
// Out of scope and blanked before matching: «الفرائض» as the shares of inheritance, «فرض له»
// as a stipend or a dower, «وجبت له الجنة», «المندوب» the horse, «ندب الناس» as a summons,
// «كراهية أن» as a purpose clause, «كره لقاء الله», coercion («أكره على»), «به لمم» as
// madness, «الصغير والكبير» as young and old, and the Halal browser's own exclusions (the
// sanctuary, ihram, the personal name Haram, deprivation).
import type { Node } from "./build-graph.js";
import { halalFold, halalSignalsOfText } from "./halal.js";

export const AHKAM_TAG = "ahkam-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const AHKAM_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type AhkamSection = (typeof AHKAM_SECTIONS)[number];
export type AhkamCorpus = Exclude<AhkamSection, "curated">;
/** The ten themes, in the order the founder named them; `mubah` is his «وخلافه». */
export const AHKAM_TOPICS = ["fard", "fard-ayn", "fard-kifaya", "taat", "wajib", "mustahabb", "haram", "makruh", "saghair", "mubah"] as const;
export type AhkamTopic = (typeof AHKAM_TOPICS)[number];
/** Curated records carry `ahkam-<topic>` beside the browser tag. */
export const AHKAM_TOPIC_TAG = "ahkam-";
/**
 * The scale of the five rulings as the books of usul al-fiqh set it out, from the act that
 * must be done to the act that must be left; each degree names the themes that stand on it.
 * The signature view (site/src/components/sig/AhkamScale.astro) draws this and nothing else.
 */
export const AHKAM_SCALE: { degree: "wajib" | "mandub" | "mubah" | "makruh" | "haram"; topics: AhkamTopic[] }[] = [
  { degree: "wajib", topics: ["fard", "fard-ayn", "fard-kifaya", "wajib"] },
  { degree: "mandub", topics: ["mustahabb"] },
  { degree: "mubah", topics: ["mubah"] },
  { degree: "makruh", topics: ["makruh"] },
  { degree: "haram", topics: ["haram"] },
];

/** A letter on neither side: the token stands alone. */
const L = String.raw`(?<![ء-ي])`;
const R = String.raw`(?![ء-ي])`;
/** Arabic diacritics and tatweel stripped before matching. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;
/** Clitics before a noun: «و»، «ف»، «ب»، «ل»، «ك»، the article, «لل». */
const PRE = String.raw`(?:[وف])?(?:[بلك])?(?:ال|ل)?`;
/** Clitics before a verb. */
const VPRE = String.raw`(?:[وف])?(?:[لس])?`;
/** An attached pronoun. */
const PRON = String.raw`(?:ه|ها|هم|هما|هن|ك|كم|كن|ي|نا)?`;
const ALA = String.raw`(?:على|علي(?:ه|ها|هم|هن|هما|كم|كن|نا|ك)?)`;
const GOD = String.raw`(?:الله|ربه|ربك|ربكم|ربي|ربنا|الرحمن)`;
const MESSENGER = String.raw`(?:رسول الله|رسوله|الرسول|النبي|نبي الله)`;
/** The person an individual duty falls on: «على كل مسلم»، «على كل محتلم». */
const KULL = String.raw`على كل (?:مسلم|مسلمة|مؤمن|مؤمنة|محتلم|حالم|بالغ|مكلف|امرئ|نفس|أحد|احد|ذكر|حر|إنسان|انسان|رجل|ذي)`;

/**
 * Senses that are not the degrees of obligation, blanked before matching (each letter
 * replaced, the spaces kept, so word positions survive for the harvest excerpts).
 */
const OUT_OF_SCOPE: RegExp[] = [
  // «الفرائض» as the shares of inheritance and its science.
  /(?<![ء-ي])(?:ألحقوا|الحقوا|تعلموا|علم|كتاب|باب|أبواب|ابواب|أهل|اهل|أصحاب|اصحاب|ذوي|ذوو|ذو|مسائل|قسمة|قسم|أعلمهم ب|اعلمهم ب)\s?(?:ال)?(?:فرائض|فروض)(?![ء-ي])|(?<![ء-ي])الفرائض (?:بأهلها|باهلها)|(?<![ء-ي])(?:أفرض|افرض)(?:هم|كم|نا)(?![ء-ي])|(?<![ء-ي])(?:أحكم|احكم|وأحكم|واحكم|يسألونه عن|يسألونها عن|يسألون عائشة عن) الفرائض(?![ء-ي])|(?<![ء-ي])(?:بالفرض والتعصيب|الفرض والرد|صاحب فرض|ذي فرض)(?![ء-ي])/g,
  // A stipend or a dower assigned: «فرض له عمر في ألفين»، «تفرضوا لهن فريضة»، «في العطاء».
  /(?<![ء-ي])[وف]?(?:ي|ت|ن|أ|ا)?(?:فرض|فرضت|فرضوا|فرضتم|فرضنا)\s(?:عمر |عثمان |معاوية |لي |لنا )?ل(?:ه|ها|هم|هن|ي|ك|كم|نا|كل|لمهاجرين|لأنصار|لانصار|لناس)(?![ء-ي])(?:\sفريضة)?|(?<![ء-ي])(?:في|من) (?:ال)?(?:عطاء|ديوان)(?![ء-ي])|(?<![ء-ي])(?:فرضة|فرضته|مفروضا له)(?![ء-ي])/g,
  // «وجبت له الجنة» and its kin: a reward falling due, not a ruling; the sun setting; a sale concluded.
  /(?<![ء-ي])[وف]?(?:قد )?(?:وجبت|وجب|أوجب|اوجب|يوجب|توجب)\s(?:الله\s)?ل(?:ه|ها|هم|ك|كم|نا|ي)\s(?:ال)?(?:جنة|نار|شفاعة|شفاعتي|مغفرة|أجر|اجر)|(?<![ء-ي])(?:وجبت|غربت) الشمس|(?<![ء-ي])(?:وجب|فوجب) البيع|(?<![ء-ي])(?:ال)?موجبتان|(?<![ء-ي])موجبات رحمتك|(?<![ء-ي])واجب الوجود|(?<![ء-ي])(?:ال)?(?:إيجاب|ايجاب) و(?:ال)?قبول/g,
  // «المندوب» the horse of Abu Talha, «ندب الناس» and «انتدب» as a summons, the lament over the dead.
  /(?<![ء-ي])(?:يقال|يسمى|اسمه|يدعى)\s(?:له\s)?(?:ال)?مندوب(?:ا)?(?![ء-ي])|(?<![ء-ي])فرس(?:ا|ه)?\s(?:[ء-ي]+\s){0,6}?(?:ال)?مندوب(?:ا)?(?![ء-ي])|(?<![ء-ي])[وف]?ندب\s(?:النبي|رسول الله|الناس|أصحابه|اصحابه|عمر|أبو بكر)|(?<![ء-ي])[وف]?(?:انتدب|فانتدب|ينتدب|انتدبوا)[ء-ي]{0,3}|(?<![ء-ي])(?:ندبة|نادبة|نوادب|يندبن|تندب|ندبته|ندبتها)(?![ء-ي])/g,
  // «استحبوا الكفر»: to prefer, not to recommend.
  /(?<![ء-ي])[وف]?(?:استحب|استحبوا|يستحبون)\s(?:ال)?(?:كفر|عمى|حياة)[ء-ي]{0,2}/g,
  // «كراهية أن»: a purpose clause; hating death or the meeting with God; coercion; hardship.
  /(?<![ء-ي])[وف]?(?:كراهية|كراهة)\s(?:أن|ان|السآمة|السامة|الموت|للموت|لقاء|القتال|ما\s)|(?<![ء-ي])[وف]?(?:كره|يكره|أكره|اكره|كرهت|كرهوا)\s(?:الله\s)?(?:لقاء|الموت|مساءته)[ء-ي]{0,3}|(?<![ء-ي])(?:ولو|وإن|وان|لو)\sكره(?![ء-ي])|(?<![ء-ي])[وف]?(?:أكره|اكره|أكرهه|اكرهه|أكرهوا|اكرهوا|أكرهت|اكرهت|يكرهه|تكرهوا|استكره|استكرهت|استكرهوا|استكرهها)[ء-ي]{0,3}\sعلى|(?<![ء-ي])(?:ال)?(?:إكراه|اكراه)(?![ء-ي])|(?<![ء-ي])[وف]?(?:ال)?(?:مكره|مكرها|مكرهين|مستكره|مستكرهة|مكاره|كرها|كاره|كارها|كارهون|كارهين)(?![ء-ي])|(?<![ء-ي])على كره(?![ء-ي])|(?<![ء-ي])(?:أصاب|اصاب|يصيب|أصابه|اصابه|يصيبه|ناله|نزل به)\s(?:ال)?مكروه(?![ء-ي])|(?<![ء-ي])(?:من كل|المحبوب و|و?مكروه\s(?:ال)?قضاء)\s?(?:ال)?مكروه?(?![ء-ي])/g,
  // «به لمم»: madness or possession.
  /(?<![ء-ي])(?:به|بها|بي|بك|أصابه|اصابه)\sلمم(?![ء-ي])/g,
  // «الصغير والكبير»: the young and the old.
  /(?<![ء-ي])(?:على|عن|من)\sكل\sصغير\s(?:و|أو\s|او\s)كبير|(?<![ء-ي])(?:ال)?صغير\sو(?:ال)?كبير(?![ء-ي])|(?<![ء-ي])صغير\s(?:أو|او)\sكبير(?![ء-ي])|(?<![ء-ي])صغيرنا\sو?/g,
  // Prices: «الرخص والغلاء».
  /(?<![ء-ي])(?:ال)?رخص\s(?:و|في\s)?(?:ال)?(?:غلاء|سعر|أسعار|اسعار)|(?<![ء-ي])الغلاء\sوالرخص|(?<![ء-ي])رخيص[ء-ي]{0,2}(?![ء-ي])/g,
  // «لا بأس طهور»: said to the sick.
  /(?<![ء-ي])لا\s(?:بأس|باس)\s(?:طهور|عليك|عليه|عليها|عليكم)(?!\s(?:أن|ان))/g,
  // «حمأ مسنون»: the clay of 15:26, when a report quotes it.
  /(?<![ء-ي])حم[أإا]\sمسنون(?![ء-ي])/g,
];

// ---------- الفروض ----------
const FARD_STRONG: [RegExp, string][] = [
  /** «فريضة»، «الفريضة»، «فرائض الله»، «الفرائض». */
  [new RegExp(`${L}${PRE}(?:فريضة|فريضت(?:ه|ها|هم|ك|كم|ي|نا)|فرائض(?:ه|ها|هم|كم|نا)?)${R}`), "farida"],
  /** «فرض الله»، «افترض الله»، «فرضها رسول الله»، «مما افترضت عليه». */
  [new RegExp(`${L}${VPRE}(?:قد )?(?:فرض|فرضه|فرضها|فرضهن|فرضهما|افترض|افترضه|افترضها|افترضهن) (?:${GOD}|${MESSENGER})${R}|${L}(?:الله|ربكم|ربنا) (?:قد )?(?:فرض|افترض)${PRON}${R}|${L}(?:مما )?افترضت(?:ه|ها)? ${ALA}${R}`), "farada-allah"],
  /** «فرضت عليكم»، «تفرض عليهم»، «فُرضت الصلاة ركعتين». */
  [new RegExp(`${L}${VPRE}(?:ي|ت)?(?:فرض|فرضت|فرضن|فرضوا|افترض|افترضت|فرضنا|فرضناها)${PRON} ${ALA}${R}|${L}${VPRE}(?:فرضت|تفرض|يفرض|فرض) (?:ال)?(?:صلاة|صلوات|صيام|صوم|زكاة|حج|رمضان|صدقة|جهاد|وضوء)${R}`), "farada-ala"],
  /** «الفرض»، «فرضا»، «الفروض» — the noun, once the stipend and inheritance senses are blanked. */
  [new RegExp(`${L}${PRE}(?:فرض|فرضا|فروض|فروضا|مفروض|مفروضة|مفروضا|مفترض|مفترضة)${PRON}${R}`), "fard"],
  /** «كتب عليكم»، «كتبهن الله على العباد»، «إن الله كتب عليكم السعي». */
  [new RegExp(`${L}${VPRE}(?:قد )?(?:كتب|كتبت) علي(?:كم|نا)${R}|${L}${VPRE}كتب(?:هن|ها|ه) الله ${ALA}${R}|${L}${VPRE}(?:إن |ان )?الله (?:قد )?كتب (?:علي(?:كم|نا)|(?:ال)?[ء-ي]{3,10} على كل)${R}|${L}${VPRE}كتب الله علي(?:كم|نا|هم)${R}`), "kutiba"],
];
const FARD_WEAK: [RegExp, string][] = [
  /** «الصلاة المكتوبة»، «المكتوبات». */
  [new RegExp(`${L}${PRE}مكتوب(?:ة|ات)${R}`), "maktuba"],
];

// ---------- فروض العين ----------
const AYN_STRONG: [RegExp, string][] = [
  /** The jurists' term: «فرض عين»، «فروض الأعيان»، «واجب عيني»، «يتعين عليه». */
  [new RegExp(`${L}${PRE}(?:فرض|فرضا|فروض) (?:على )?(?:ال)?(?:عين|أعيان|اعيان)${R}|${L}${PRE}(?:واجب|وجوب|واجبا) (?:على )?(?:ال)?(?:أعيان|اعيان|عين)${R}|${L}(?:يجب|تجب|وجب) على (?:ال)?(?:أعيان|اعيان)${R}|${L}${PRE}(?:فرض|فرضا|واجب|واجبا|وجوب|وجوبا) عيني(?:ا|ة)?${R}|${L}${PRE}(?:الفرض العيني|الواجب العيني|الوجوب العيني)${R}|${L}${VPRE}(?:يتعين|تعين|تعينت|تتعين|متعين|متعينا|متعينة) ${ALA}${R}`), "fard-ayn"],
  /** A duty laid on every person: «فريضة على كل مسلم»، «واجب على كل محتلم»، «حق على كل مسلم». */
  [new RegExp(`${L}${PRE}(?:فريضة|فرض|فرضا|واجب|واجبة|واجبا|حق|حقا|محتوم) (?:لله )?(?:واجب )?${KULL}${R}|${L}${VPRE}(?:يجب|تجب|وجب|وجبت|فرض|فرضت|فرضها|افترض|افترضها)(?: [ء-ي]+){0,7}? ${KULL}${R}`), "ala-kull"],
];

// ---------- فروض الكفاية ----------
const KIFAYA_STRONG: [RegExp, string][] = [
  /** The jurists' term: «فرض كفاية»، «فروض الكفايات»، «واجب على الكفاية». */
  [new RegExp(`${L}${PRE}(?:فرض|فرضا|فروض) (?:على )?(?:ال)?(?:كفاية|كفايات)${R}|${L}${PRE}(?:واجب|وجوب|واجبا) (?:على )?(?:ال)?كفاية${R}|${L}(?:يجب|تجب|وجب|فرض|واجب|واجبة) على الكفاية${R}|${L}${PRE}(?:فرض|فرضا|واجب|واجبا|وجوب|وجوبا) كفائي(?:ا|ة)?${R}|${L}${PRE}(?:الفرض الكفائي|الواجب الكفائي|الوجوب الكفائي)${R}`), "fard-kifaya"],
  /** Its rule: «إذا قام به البعض سقط عن الباقين»، «قام به من يكفي»، «وإن تركوه أثموا جميعا». */
  [new RegExp(`${L}${VPRE}(?:سقط|يسقط|سقطت) (?:الفرض |فرضه |فرضها |الحرج |الإثم |الاثم |الوجوب |الطلب )?عن (?:ال)?(?:باقين|آخرين|اخرين|سائرهم|غيرهم|بقيتهم)${R}|${L}(?:إذا|اذا|إن|ان|فإن|فان|متى) قام به(?:ا)? (?:ال)?(?:بعض|بعضهم|من يكفي|قوم|طائفة|واحد)${R}|${L}قام به(?:ا)? من (?:يكفي|فيه (?:ال)?كفاية)${R}|${L}(?:أثم|اثم|أثموا|اثموا|حرج|حرجوا|عصى|عصوا) (?:ال)?(?:جميع|كلهم|جميعا|جميعهم)${R}`), "saqata-an-al-baqin"],
];

// ---------- الطاعات ----------
const TAAT_STRONG: [RegExp, string][] = [
  /** «الطاعات»، «طاعاته». */
  [new RegExp(`${L}${PRE}طاعات${PRON}${R}`), "taat"],
  /** «طاعة الله»، «طاعة رسوله». */
  [new RegExp(`${L}${PRE}طاعة (?:${GOD}|${MESSENGER})${R}`), "taat-allah"],
  /** «أطيعوا الله»، «من يطع الرسول»، «من أطاعني فقد أطاع الله». */
  [new RegExp(`${L}${VPRE}(?:من )?(?:أطاع|اطاع|يطع|يطيع|أطيعوا|اطيعوا|أطعنا|اطعنا|أطاعوا|اطاعوا|تطيعوا|يطيعون|نطيع|أطع|اطع|أطعتم|اطعتم|أطعت|اطعت) (?:${GOD}|${MESSENGER})${R}|${L}(?:من )?(?:أطاعني|اطاعني)${R}|${L}(?:أطيعوني|اطيعوني|أطعتموني|اطعتموني)${R}`), "ataa-allah"],
  /** «أهل الطاعة»، «أعمال الطاعات»، «الطاعة والمعصية»، «لا طاعة لمخلوق في معصية الله»، «إنما الطاعة في المعروف». */
  [new RegExp(`${L}${PRE}(?:أهل|اهل|أعمال|اعمال|أفعال|افعال|أنواع|انواع|عمل) (?:ال)?طاعة${R}|${L}${PRE}طاعة و(?:ال)?معصية${R}|${L}${PRE}معصية و(?:ال)?طاعة${R}|${L}لا طاعة (?:ل[ء-ي]+ )?في (?:معصية|معصيت)[ء-ي]{0,2}${R}|${L}(?:إنما|انما) الطاعة في المعروف${R}|${L}${PRE}(?:مطيع|مطيعا|مطيعون|مطيعين) (?:لله|لربه)${R}`), "taa"],
];
const TAAT_WEAK: [RegExp, string][] = [
  [new RegExp(`${L}${PRE}سمع و(?:ال)?طاعة${R}|${L}سمعا وطاعة${R}|${L}سمعنا و(?:أطعنا|اطعنا)${R}`), "sam-wa-taa"],
  [new RegExp(`${L}${PRE}طاعة${R}|${L}${PRE}طاعت(?:ه|ك|ي|هم)${R}`), "taa-bare"],
];

// ---------- الواجبات ----------
const WAJIB_STRONG: [RegExp, string][] = [
  /** «واجب»، «واجبة»، «الواجبات». */
  [new RegExp(`${L}${PRE}واجب(?:ة|ا|ات|ان|تان)?${PRON}${R}`), "wajib"],
  /** «وجوب»، «إيجاب». */
  [new RegExp(`${L}${PRE}(?:وجوب|وجوبا|إيجاب|ايجاب)${PRON}${R}`), "wujub"],
  /** «يجب على»، «وجب عليه»، «أوجب الله»، «يجب أن»، «فقد وجب الغسل». */
  [new RegExp(`${L}${VPRE}(?:لا |لم |قد )?(?:يجب|تجب|وجب|وجبت|يوجب|توجب|أوجب|اوجب|أوجبه|اوجبه|أوجبها|اوجبها|نوجب|أوجبوا|اوجبوا|أوجبنا|اوجبنا)${PRON} ${ALA}${R}|${L}${VPRE}(?:أوجب|اوجب|أوجبه|اوجبه|أوجبها|اوجبها) (?:${GOD}|${MESSENGER})${R}|${L}${VPRE}(?:قد )?(?:وجب|وجبت) (?:ال)?(?:غسل|وضوء|حد|زكاة|صدقة|صلاة|حج|صوم|صيام|كفارة|قضاء|دية|مهر|صداق|قود|قصاص|جلد|رجم|عدة|نفقة)${R}`), "yajib"],
  /** «لو قلت نعم لوجبت». */
  [new RegExp(`${L}لوجبت${R}|${L}لو قلت(?:ها)? نعم${R}`), "law-wajabat"],
  /** «حق على كل مسلم»، «حقا على المتقين»، «حق واجب»، «حق الله على العباد». */
  [new RegExp(`${L}(?:حق|حقا) (?:لله )?على (?:كل )?(?:ال)?(?:مسلم|مسلمين|مؤمن|مؤمنين|محتلم|متقين|محسنين)${R}|${L}حق واجب${R}|${L}حق الله على (?:ال)?(?:عباد|عبيد|عبد)[ء-ي]{0,2}${R}`), "haqq-ala"],
  /** «عزمة من عزمات ربنا». */
  [new RegExp(`${L}عزمة من عزمات${R}`), "azma"],
];
const WAJIB_WEAK: [RegExp, string][] = [
  /** «يجب أن»، «يجب فيه»: also the physicians' and the grammarians' "must"; weak. */
  [new RegExp(`${L}${VPRE}(?:يجب|تجب) (?:أن|ان|في|فيه|فيها|به|بها)${R}`), "yajib-an"],
  [new RegExp(`${L}(?:ب)?حتم(?:ا)?${R}`), "hatm"],
  [new RegExp(`${L}حق (?:ال)?مسلم على (?:ال)?مسلم${R}|${L}للمسلم على (?:ال)?مسلم${R}`), "haqq-al-muslim"],
];

// ---------- المستحبات ----------
const MUSTAHABB_STRONG: [RegExp, string][] = [
  /** «مستحب»، «يستحب»، «كانوا يستحبون»، «استحباب». */
  [new RegExp(`${L}${PRE}مستحب(?:ة|ا|ات)?${R}|${L}${VPRE}(?:لا )?(?:يستحب|تستحب|نستحب|أستحب|استحب|استحبه|استحبها|استحبوا|يستحبون|يستحبه|استحباب|استحبابه|استحبابا)${R}`), "mustahabb"],
  /** «مندوب»، «مندوب إليه»، «على الندب»، «أمر ندب». */
  [new RegExp(`${L}${PRE}مندوب(?:ة|ا|ات)?${R}|${L}${PRE}ندب (?:إلي|الي)(?:ه|ها|هم)${R}|${L}(?:على|ل) ?(?:ال)?ندب${R}|${L}للندب${R}|${L}(?:أمر|امر) ندب${R}|${L}ندبا (?:لا|وليس)${R}|${L}الندب والاستحباب${R}|${L}(?:ي|ت)ندب (?:إلي|الي|ل)(?:ه|ها)${R}`), "mandub"],
  /** «النافلة»، «النوافل»، «يتنفل». */
  [new RegExp(`${L}${PRE}(?:نافلة|نوافل|نوافله|نافلته)${R}|${L}${VPRE}(?:يتنفل|تنفل|يتنفلون|متنفل|متنفلا|تنفلا)${R}|${L}${PRE}تنفل${R}`), "nafila"],
  /** «التطوع»، «تطوعا»، «إلا أن تطوع». */
  [new RegExp(`${L}${PRE}(?:تطوع|تطوعا|تطوعه|تطوعك)${R}|${L}${VPRE}(?:يتطوع|تتطوع|أتطوع|اتطوع|متطوع|متطوعا|متطوعين|تطوعوا)${R}`), "tatawwu"],
  /** «ليس بواجب»، «غير واجب»، «ليست بفريضة»، «سنة وليس بواجب»، «من غير أن يأمرهم بعزيمة». */
  [new RegExp(`${L}(?:ليس|ليست|وليس|وليست) (?:ب)?(?:واجب|واجبة|فريضة|فرض|حتم|مفروض|مفروضة|مكتوبة)${R}|${L}غير (?:واجب|واجبة|فريضة|مفروض|مفروضة)${R}|${L}لم (?:ي|ت)(?:فرض|كتب) ${ALA}${R}|${L}من غير (?:أن|ان) (?:يأمر|يامر)(?:هم|نا)? (?:فيه )?بعزيمة${R}`), "not-wajib"],
  /** «لولا أن أشق على أمتي لأمرتهم». */
  [new RegExp(`${L}لولا (?:أن|ان) (?:أشق|اشق) على (?:أمتي|امتي|المؤمنين|الناس)${R}`), "lawla-an-ashuqq"],
  /** «خشيت أن تفرض عليكم». */
  [new RegExp(`${L}(?:خشيت|خشية|مخافة|كراهية|كراهة) (?:أن|ان) (?:تفرض|يفرض|تكتب|يكتب) علي(?:كم|هم|نا)${R}|${L}(?:أن|ان) (?:تفرض|يفرض) علي(?:كم|هم) ف(?:تعجزوا|يعجزوا)${R}`), "khashyat-an-tufrad"],
  /** «سنة مؤكدة»، «السنن الرواتب»، «مسنون»، «يسن»، «الرغائب». */
  [new RegExp(`${L}${PRE}سن(?:ة|ن) (?:مؤكدة|مستحبة|مسنونة|رواتب|الرواتب)${R}|${L}${PRE}(?:رواتب|رغائب|رغيبة)${R}|${L}${PRE}(?:مسنون|مسنونة|مسنونات)${R}|${L}${VPRE}(?:يسن|تسن) (?:أن|ان|ل|في)${R}|${L}${PRE}فضائل (?:ال)?(?:أعمال|اعمال)${R}`), "sunna-muakkada"],
];
const MUSTAHABB_WEAK: [RegExp, string][] = [
  [new RegExp(`${L}${VPRE}(?:يرغب|رغب|يرغبهم|رغبهم|يرغبنا|رغبنا) في${R}|${L}${PRE}ترغيب${R}`), "targhib"],
  [new RegExp(`${L}لمن شاء${R}|${L}(?:ف)?من شاء (?:فل)?(?:يصم|يصل|يفعل|صام|صامه|صلى|فعل|فليصمه|تركه|أفطر|افطر)${R}`), "li-man-sha"],
  [new RegExp(`${L}${PRE}ندب(?:ا)?${R}|${L}${VPRE}(?:يندب|ندب)${R}`), "nadb-bare"],
];

// ---------- المحرمات ----------
/** The Halal and Haram Browser's strong signals on the unlawful side (scripts/halal.ts). */
const HARAM_FROM_HALAL: Record<string, string> = {
  haram: "haram", "la-yahill": "la-yahill", "harrama-allah": "harrama-allah", "harrama-ala": "harrama-ala",
  harramna: "harramna", tahrim: "tahrim", muharramat: "muharramat",
};
const HARAM_STRONG: [RegExp, string][] = [
  /** «اتق المحارم»، «المحارم» — once «ذو محرم» is blanked by the Halal fold. */
  [new RegExp(`${L}${PRE}محارم${R}`), "maharim"],
];

// ---------- المكروهات ----------
const MAKRUH_STRONG: [RegExp, string][] = [
  /** «مكروه»، «المكروهات». */
  [new RegExp(`${L}${PRE}مكروه(?:ة|ا|ات)?${R}`), "makruh"],
  /** «كراهة»، «كراهية»، «كراهة تنزيه»، «خلاف الأولى». */
  [new RegExp(`${L}[وفبل]{0,2}(?:الكراهة|الكراهية|للكراهة)${R}|${L}(?:في|باب|أبواب|ابواب|على|مع) (?:كراهة|كراهية)${R}|${L}(?:كراهة|كراهية) (?:تنزيه|تحريم|شديدة|التنزيه|التحريم)${R}|${L}(?:خلاف (?:الأولى|الاولى)|نهي (?:تنزيه|كراهة)|على التنزيه|للتنزيه)${R}`), "karaha"],
  /** «كان يكره»، «كانوا يكرهون»، «كنا نكره». */
  [new RegExp(`${L}${VPRE}(?:كان|كانوا|كنا|كانت|يكونوا) (?:${MESSENGER} )?(?:يكره|يكرهون|نكره|تكره|يكرهه|يكرهونه)${R}`), "kana-yakrah"],
  /** «إن الله كره لكم»، «يكره لكم». */
  [new RegExp(`${L}(?:إن |ان )?الله (?:عز وجل |تعالى )?(?:كره|يكره) ل(?:كم|نا)${R}|${L}${VPRE}(?:كره|يكره|أكره|اكره) لكم${R}`), "kariha-lakum"],
  /** The jurists' dislike: «كرهه مالك»، «كره قوم من أهل العلم»، «قال مالك: أكره». */
  [new RegExp(`${L}${VPRE}(?:كره|كرهه|كرهها|كرهوا|كرهوه|يكرهون|يكرهه)(?: ذلك)? (?:قوم|بعض|أهل العلم|اهل العلم|مالك|الشافعي|أحمد|احمد|سفيان|إسحاق|اسحاق|ابن المبارك|الفقهاء|العلماء|أكثر|اكثر|عامة|جماعة|أبو حنيفة|ابو حنيفة)${R}|${L}(?:مالك|الشافعي|أحمد|احمد|سفيان|ابن المبارك|إسحاق|اسحاق|أبو حنيفة|ابو حنيفة) (?:يكره|كره)${R}|${L}${VPRE}(?:يكرهون|كرهوا) (?:أن|ان|ذلك|ال)|${L}(?:قال|وقال) (?:مالك|الشافعي|أحمد|احمد)(?: [ء-ي]+){0,3}? (?:أكره|اكره|وأكره|واكره)${R}`), "fuqaha-karihu"],
  /** «نهينا عن اتباع الجنائز ولم يعزم علينا». */
  [new RegExp(`${L}(?:نهينا|نهانا|نهى)(?: [ء-ي]+){1,12}? ولم (?:يعزم|يعزمن) علي(?:نا|هم)${R}|${L}ولم (?:يعزم|يعزمن) علي(?:نا|هم)${R}`), "lam-yuzam"],
];
const MAKRUH_WEAK: [RegExp, string][] = [
  [new RegExp(`${L}${PRE}(?:كراهة|كراهية|كراهته|كراهيته)${R}`), "karaha-bare"],
  [new RegExp(`${L}${VPRE}(?:يكره|تكره|كره|أكره|اكره|نكره|كرهت|كرهوا|يكرهون|كرهه|فكرهه|كرهها) (?:أن|ان|ذلك|ل(?:ه|ها|هم|ي|ك|نا)|ال)`), "karih"],
];

// ---------- صغائر الذنوب ----------
const SAGHAIR_STRONG: [RegExp, string][] = [
  /** «الصغائر»، «صغار الذنوب»، «لا صغيرة مع الإصرار»، «لا يغادر صغيرة ولا كبيرة». */
  [new RegExp(`${L}${PRE}صغائر${PRON}${R}|${L}${PRE}(?:صغار|صغير|صغيرة) (?:من )?(?:ال)?(?:ذنوب|ذنب|معاصي|خطايا|سيئات)${R}|${L}${PRE}(?:ذنب|ذنوب|ذنبا|معصية|خطيئة|سيئة) (?:ال)?(?:صغير|صغيرة|صغيرا|صغار)${R}|${L}لا صغيرة مع${R}|${L}صغيرة ولا كبيرة${R}|${L}دقه وجله${R}`), "saghair"],
  /** «محقرات الذنوب»، «أدق في أعينكم من الشعر». */
  [new RegExp(`${L}${PRE}محقرات${R}|${L}(?:أدق|ادق) في (?:أعينكم|اعينكم) من الشعر${R}`), "muhaqqarat"],
  /** «اللمم». */
  [new RegExp(`${L}${PRE}لمم(?:ا)?${R}`), "lamam"],
  /** What the avoidance of the major sins leaves expiated: «ما اجتنبت الكبائر»، «مكفرات لما بينهن». */
  [new RegExp(`${L}(?:ما|إذا|اذا|إن|ان) (?:اجتنب|اجتنبت|تجتنب|يجتنب|اجتنبوا|تجتنبوا) (?:ال)?كبائر${R}|${L}ما لم (?:تغش|يغش|تؤت|يؤت|تصب|يصب) (?:ال)?(?:كبائر|كبيرة)${R}|${L}(?:ما )?دون (?:ال)?كبائر${R}|${L}${PRE}(?:مكفرات|كفارات|كفارة) (?:ل)?ما بين(?:هن|هما|ها)${R}`), "ijtinab-al-kabair"],
  /** «العينان تزنيان»، «حظه من الزنا». */
  [new RegExp(`${L}زنا (?:ال)?(?:عين|عينين|لسان|يد|يدين|أذن|اذن|رجل)[ء-ي]{0,2}${R}|${L}(?:ال)?عينان (?:تزنيان|زناهما)${R}|${L}(?:حظه|نصيبه) من الزنا${R}`), "zina-al-ayn"],
];
const SAGHAIR_WEAK: [RegExp, string][] = [
  [new RegExp(`${L}${PRE}(?:إصرار|اصرار) على${R}|${L}${VPRE}(?:يصر|يصروا|أصر|اصر|أصروا|اصروا|مصر|مصرا) على (?:ال)?(?:ذنب|معصية|صغيرة|ما فعل)[ء-ي]{0,2}${R}`), "israr"],
];

// ---------- المباح والرخصة ----------
const MUBAH_STRONG: [RegExp, string][] = [
  /** «مباح»، «الإباحة»، «أباح الله». */
  [new RegExp(`${L}${PRE}(?:مباح|مباحة|مباحا|مباحات|إباحة|اباحة|إباحته|اباحته)${R}|${L}${VPRE}(?:يباح|تباح|أباح|اباح|أباحه|اباحه|أباحها|اباحها|أبيح|ابيح|أبيحت|ابيحت)${R}`), "mubah"],
  /** «الرخصة»، «رخص رسول الله»، «يرخص». */
  [new RegExp(`${L}${PRE}(?:رخصة|رخصته|رخص|رخصه)${R}|${L}${VPRE}(?:رخص|يرخص|أرخص|ارخص|رخصت|ترخص|يترخص|ترخيص)${R}`), "rukhsa"],
  /** «إن الله يحب أن تؤتى رخصه كما يحب أن تؤتى عزائمه». */
  [new RegExp(`${L}(?:أن|ان) تؤتى رخصه${R}|${L}${PRE}عزيمة و(?:ال)?رخصة${R}|${L}${PRE}رخصة و(?:ال)?عزيمة${R}|${L}عزائمه${R}`), "azima-rukhsa"],
  /** «وما سكت عنه فهو عفو»، «وسكت عن أشياء رحمة لكم». */
  [new RegExp(`${L}(?:ف)?هو عفو${R}|${L}مما عفا (?:الله )?عنه${R}|${L}${VPRE}سكت عن (?:أشياء|اشياء)${R}|${L}وما سكت عنه${R}|${L}عفوت لكم عن${R}`), "afw"],
  /** «لا جناح عليكم»، «لا حرج»، «افعل ولا حرج». */
  [new RegExp(`${L}${VPRE}لا (?:جناح|حرج|إثم|اثم) (?:${ALA}|في|أن|ان)${R}|${L}${VPRE}ليس ${ALA} (?:جناح|حرج)${R}|${L}ولا حرج${R}`), "la-junah"],
  /** «لا بأس به»، «لا بأس أن». */
  [new RegExp(`${L}${VPRE}لا (?:بأس|باس) (?:ب[ء-ي]*|أن|ان|في|فيه|${ALA})${R}|${L}لم (?:ير|يروا|نر) (?:به|بها|بذلك) (?:بأسا|باسا)${R}`), "la-bas"],
];

const TOPIC_RULES: Record<AhkamTopic, { strong: [RegExp, string][]; weak: [RegExp, string][] }> = {
  fard: { strong: FARD_STRONG, weak: FARD_WEAK },
  "fard-ayn": { strong: AYN_STRONG, weak: [] },
  "fard-kifaya": { strong: KIFAYA_STRONG, weak: [] },
  taat: { strong: TAAT_STRONG, weak: TAAT_WEAK },
  wajib: { strong: WAJIB_STRONG, weak: WAJIB_WEAK },
  mustahabb: { strong: MUSTAHABB_STRONG, weak: MUSTAHABB_WEAK },
  haram: { strong: HARAM_STRONG, weak: [] },
  makruh: { strong: MAKRUH_STRONG, weak: MAKRUH_WEAK },
  saghair: { strong: SAGHAIR_STRONG, weak: SAGHAIR_WEAK },
  mubah: { strong: MUBAH_STRONG, weak: [] },
};

/**
 * The reviewed Qur'an table: verse → the themes it is listed under. The verses are named by
 * reference only; their text is the frozen Tanzil text of the passage records.
 */
const Q = (topic: AhkamTopic, refs: string): [string, AhkamTopic][] => refs.split(/\s+/).filter(Boolean).map((r) => [`passage/quran-${r.replace(":", "-")}`, topic]);
const QURAN_ROWS: [string, AhkamTopic][] = [
  // «كتب عليكم»، «فريضة من الله»، «فرضناها»، «كتابا موقوتا»، «نصيبا مفروضا»
  ...Q("fard", "2:178 2:180 2:183 2:197 2:216 2:246 4:7 4:11 4:24 4:77 4:103 5:32 5:45 9:60 24:1 28:85 33:50 57:27 66:2"),
  // the two verses al-Shafi'i reads the communal obligation from (al-Risala, paragraphs 981–990)
  ...Q("fard-kifaya", "4:95 9:122"),
  // «أطيعوا الله وأطيعوا الرسول»، «ومن يطع الله ورسوله»، «سمعنا وأطعنا»
  ...Q("taat", "2:285 3:32 3:132 4:13 4:59 4:69 4:80 5:7 5:92 8:1 8:20 8:46 9:71 24:51 24:52 24:54 24:56 33:33 33:66 33:71 47:33 48:17 49:14 58:13 64:12 64:16"),
  // «حقا على المتقين»، «حقا على المحسنين»، «ولله على الناس حج البيت»
  ...Q("wajib", "2:180 2:236 2:241 3:97"),
  // «ومن تطوع خيرا»، «نافلة لك»، «المطوعين»، «وأن تصدقوا خير لكم»، «فاستبقوا الخيرات»، «قرضا حسنا»
  ...Q("mustahabb", "2:148 2:158 2:184 2:237 2:245 2:271 2:280 4:25 5:48 9:79 17:79 24:60 57:11 57:18 64:17 73:20"),
  // «حرمت عليكم»، «حرم ربكم عليكم»، «لا يحل لكم»، «هذا حلال وهذا حرام»
  ...Q("haram", "2:173 2:228 2:229 2:230 2:275 4:19 4:23 5:3 5:87 5:96 6:119 6:140 6:145 6:150 6:151 7:32 7:33 7:157 9:29 9:37 10:59 16:115 16:116 17:33 24:3 25:68 33:52 60:10 66:1"),
  // «كان سيئه عند ربك مكروها»، «وكره إليكم الكفر والفسوق والعصيان»
  ...Q("makruh", "17:38 49:7"),
  // «إلا اللمم»، «إن تجتنبوا كبائر ما تنهون عنه»، «لا يغادر صغيرة ولا كبيرة»
  ...Q("saghair", "4:31 18:49 42:37 53:32 54:53"),
  // «لا جناح عليكم»، «أحل لكم»، «فمن اضطر»، «يريد الله بكم اليسر»، «من حرج»، «إلا وسعها»
  ...Q("mubah", "2:158 2:173 2:182 2:185 2:187 2:198 2:203 2:229 2:230 2:233 2:234 2:235 2:236 2:240 2:282 2:286 4:23 4:24 4:28 4:101 4:102 4:128 5:1 5:3 5:4 5:5 5:6 5:93 5:96 6:119 6:145 9:91 16:115 22:78 24:29 24:58 24:60 24:61 33:5 33:51 33:55 48:17 60:10"),
];
export const AHKAM_QURAN = new Map<string, AhkamTopic[]>();
for (const [id, topic] of QURAN_ROWS) {
  const t = AHKAM_QURAN.get(id) ?? [];
  if (!t.includes(topic)) t.push(topic);
  AHKAM_QURAN.set(id, t);
}

/** Passage records whose only lexical hit is a verified false positive. */
export const AHKAM_EXCLUDE = new Set<string>([]);

/** A text as the detector reads it: diacritics stripped, the out-of-scope senses blanked. */
export function ahkamFold(text: string): string {
  let raw = text.replace(DIACRITICS, "").replace(/[‎‏‪-‮⁦-⁩]/g, "");
  for (const re of OUT_OF_SCOPE) raw = raw.replace(re, (m) => m.replace(/\S/g, "·"));
  return raw;
}

export interface AhkamHit { topic: AhkamTopic; signal: string; strong: boolean }

/** Signals of a folded text, per theme. `strongOnly` is the harvest gate: weak signals never admit. */
export function ahkamHitsOfText(raw: string, strongOnly = false): AhkamHit[] {
  if (!raw.trim()) return [];
  const out: AhkamHit[] = [];
  const weak: AhkamHit[] = [];
  for (const topic of AHKAM_TOPICS) {
    const seen = new Set<string>();
    for (const [re, signal] of TOPIC_RULES[topic].strong) if (!seen.has(signal) && re.test(raw)) { seen.add(signal); out.push({ topic, signal, strong: true }); }
    for (const [re, signal] of TOPIC_RULES[topic].weak) if (re.test(raw)) weak.push({ topic, signal, strong: false });
  }
  // The unlawful side is read by the Halal and Haram Browser's own detector, on its own fold.
  const seenHaram = new Set(out.filter((h) => h.topic === "haram").map((h) => h.signal));
  for (const s of halalSignalsOfText(halalFold(raw), true)) {
    const signal = HARAM_FROM_HALAL[s];
    if (signal && !seenHaram.has(signal)) { seenHaram.add(signal); out.push({ topic: "haram", signal, strong: true }); }
  }
  // A weak signal counts beside a strong one; two distinct weak signals admit a passage on density.
  if (out.length > 0 || (!strongOnly && new Set(weak.map((w) => `${w.topic}:${w.signal}`)).size >= 2)) out.push(...weak);
  return out;
}

/** Offset of the first strong match in a folded text, or -1. */
export function ahkamFirstStrongAt(raw: string): number {
  let at = -1;
  for (const topic of AHKAM_TOPICS) for (const [re] of TOPIC_RULES[topic].strong) {
    const m = re.exec(raw);
    if (m && (at === -1 || m.index < at)) at = m.index;
  }
  if (at === -1) {
    const m = /حرام|حرم|يحل|تحل|تحريم|محرمات|محارم/.exec(raw);
    if (m && halalSignalsOfText(halalFold(raw), true).some((s) => HARAM_FROM_HALAL[s])) at = m.index;
  }
  return at;
}

const textOf = (n: Node) => ahkamFold([n.data.text_search, n.data.text].filter(Boolean).join(" "));
const isQuran = (n: Node) => n.data.work === "work/quran";

/** The matched signal names for a passage (`<topic>:<signal>`), or [] when it carries none of the themes. */
export function ahkamSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub || AHKAM_EXCLUDE.has(n.id)) return [];
  if (isQuran(n)) return (AHKAM_QURAN.get(n.id) ?? []).map((t) => `${t}:quran-table`);
  // Only the passage's own text counts: labels and summaries are museum metadata.
  return ahkamHitsOfText(textOf(n)).map((h) => `${h.topic}:${h.signal}`);
}

/** The themes a record belongs to: from the signals of a passage, from the `ahkam-<topic>` tags of a curated record. */
export function ahkamTopicsOf(n: Node): AhkamTopic[] {
  const tagged = AHKAM_TOPICS.filter((t) => n.tags.includes(`${AHKAM_TOPIC_TAG}${t}`));
  if (n.class !== "passage") return tagged;
  const found = new Set<string>(ahkamSignalsOf(n).map((s) => s.split(":")[0]));
  return AHKAM_TOPICS.filter((t) => found.has(t) || tagged.includes(t));
}

/** True when the passage names or carries one of the themes. */
export function isAhkamPassage(n: Node): boolean {
  return ahkamSignalsOf(n).length > 0;
}

/**
 * Which corpus a passage belongs to, from its work: the frozen Qur'an, the hadith collections
 * (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), and every other
 * harvested work. Works not yet harvested land in the right section the day their passages arrive.
 */
export function ahkamCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): AhkamCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}
