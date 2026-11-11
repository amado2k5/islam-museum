// The Signs-of-the-Hour Browser's shared reads (docs/plan/42-eschatology-browser.md):
// which passage records mention the signs of the Hour, the Day of Judgment and all
// eschatology — the major and minor signs (أشراط الساعة), barzakh and the grave,
// resurrection and gathering, reckoning and the Scale, the Sirat and the Hawd,
// Paradise and Hell, and the named end-times figures (the Dajjal, Yajuj and Majuj,
// the Mahdi, the Beast, the rising sun from the west). Detection runs at build time
// over the compiled graph, so an eschatology mention in any harvested book — and in
// every book harvested later — appears without any tagging step. Curated records join
// through the `eschatology-browser` tag instead.
//
// The lexicon is deliberately gated, because unvocalized Arabic makes the core words
// dangerously ambiguous:
//  - «الساعة» is the Hour or an hour of time (of prayer, of commerce);
//  - «يوم» is the Day or "today" — only the «يوم القيامة/الدين/البعث/الحساب…»
//    compounds count;
//  - «الآخرة» is the Hereafter or "the last (of a series)";
//  - «القيامة» is the Resurrection or "getting up" (from sitting, sleep, prayer);
//  - «البعث» is resurrection or "sending/mission" (بعث الرسل);
//  - «الحشر» is the Gathering or "driving out";
//  - «النار» is the Fire or Hell — «الجنة» is Paradise or a garden of this world;
//  - «الصراط» is the Bridge or a path (الصراط المستقيم in al-Fatiha is the
//    eschatological bridge per the hadith);
//  - «الحوض» is the Basin or a pool of this world; «الكوثر» is the Paradise river
//    or the sura name;
//  - «الميزان» is the Scale or a balance of commerce; «المعاد» is the Return or
//    a modern toilet (مِعْداد vs مَعَاد, unvocalized identical);
//  - «المهدي» is the eschatological Mahdi or "the guided one" (rare);
//  - «الصور» is the Trumpet or an image/likeness; «النفخ» is the blowing or
//    bellows/whistle; «الروح» is the Spirit or "spirit" generic;
//  - «الدابة» is the Beast or "the animal"; «الموقف» is the Standing or a stance;
//  - «الحساب» is the Reckoning or arithmetic (علم الحساب is fiqh);
//  - «الفتن» is the eschatological trials or worldly trials; «الملاحم» is the
//    epic-events or literature.
// Bare ambiguous forms (WEAK) count only beside an eschatology-domain collocation
// (CONTEXT) in the same passage; the worldly usages are stripped before matching where
// a pattern is reliable, and ESCH_EXCLUDE is the curated escape hatch for verified
// false positives.
import type { Node } from "./build-graph.js";

export const ESCH_TAG = "eschatology-browser";
/** Page sections: the four passage corpora, the two curated dwelling/hereafter groupings, then the rest. */
export const ESCH_SECTIONS = ["quran", "sunnah", "seerah", "books", "hereafter", "dwelling", "concepts"] as const;
export type EschSection = (typeof ESCH_SECTIONS)[number];
export type EschCorpus = Exclude<EschSection, "hereafter" | "dwelling" | "concepts">;

/** Topic chips carried by a record: detected families on passages, `eschatology-<topic>` tags on curated records. */
export const ESCH_TOPICS = [
  "ashrat", "saa", "qiyama", "barzakh", "hisab", "mizan", "sirat", "hawd",
  "jannah", "jahannam", "akhira", "dajjal", "yajuj-majuj", "mahdi", "malakut",
] as const;
export type EschTopic = (typeof ESCH_TOPICS)[number];

// ---------------------------------------------------------------------------
// Arabic vocabulary — strong (unambiguous) forms
// ---------------------------------------------------------------------------

/** Signs of the Hour: the compounds that name the signs. */
const AR_ASHRAT_STRONG = /اشراط الساعة|اشراط يوم القيامة|علامات الساعة|من علامات الساعة|اشراط الساعة الكبري|اشراط الساعة الصغري/;
/** Ambiguous sign-words: «أشراط» (heralds/signs), «علامات» (signs/marks) — count only beside Hour collocations. */
const AR_ASHRAT_WEAK = /اشراط|علامات/;
const AR_ASHRAT_CONTEXT = /الساعة|القيامة|يوم القيامة|النبوة|النبي|الاخرة|ظهور|خروج|الدجال|الفتن|ملاحم/;

/** The Day of Judgment and resurrection: the named Day-compounds, the Hereafter-Days, the gathering terms. */
const AR_QIYAMA_STRONG =
  /يوم القيامة|يوم الدين|يوم البعث|يوم النشور|يوم الحشر|يوم الحساب|يوم الفصل|يوم الحسرة|يوم الفرقان|يوم الجمع|يوم الصاعقة|يوم ينادي المنادي|يوم لا ينفع|يوم لا بيع|يوم لا ربا|يوم لا جزاء|يوم يجمع|يوم يبعث|يوم يقوم|يوم يوجد|يوم يكشف|يوم تلفح|يوم يمحو|يوم يقول|يوم يؤتى|يوم يبعثون|يوم يقومون|القيامة الكبرى|القيامة الصغرى|البعث والنشور|النشور|المحشر|القيامة/;
/** Resurrection verbs/nouns — «يبعث» is resurrection or "sending"; count beside resurrection collocations. */
const AR_QIYAMA_WEAK = /يبعث|يبعثون|يبعثهم|يبعثون|يُبعث|يبعث|الحشر|يبعثهم|يبعثون|يُبعث|يبعث|الموتي|القبور|من القبور/;
const AR_QIYAMA_CONTEXT = /القيامة|النشور|الحشر|المحشر|يوم|الله|الاخرة|الساعة|الدين|البعث|يبعث|يبعثون|يبعثهم|يبعثون|يُبعث|يبعث|الحشر|يبعثهم|يبعثون|يُبعث|يبعث|الموتي|القبور|من القبور|القيامة|النشور|الحشر|المحشر|يوم|الله|الاخرة|الساعة|الدين|البعث/;

/** The Hour and end-times: the named Hour-compounds, the coming-near phrases, «آخر الزمان». */
const AR_SAA_STRONG =
  /الساعة الكبرى|الساعة الصغرى|آخر الزمان|الساعة تدنو|دنت الساعة|اقتربت الساعة|قربت الساعة|الساعة آتية|الساعة نازلة|الساعة دانية|الساعة قريبة|الساعة بعيدة|الساعة باقية|الساعة تمضي|الساعة مضت/;
/** The Hour itself: «الساعة» (definite) counts beside Hour collocations (it is also an hour of time). */
const AR_SAA_WEAK = /الساعة/;
const AR_SAA_CONTEXT = /تقوم|تدنو|تاتي|جاءت|اقترب|قربت|انقض|تنقض|اشراط|ملاحم|الدجال|الفتن|الاخرة|القيامة|خروج|ظهور|اذا قامت|يوم القيامة|الساعة اتية|الساعة نازلة|الساعة دانية|الساعة قريبة|الساعة بعيدة|الساعة باقية|الساعة تمضي|الساعة مضت/;

/** Barzakh, the grave and death: the isthmus, the grave-punishment pair, the death-pangs. */
const AR_BARZAKH_STRONG = /البرزخ|سكرات الموت|عذاب القبر|سؤال القبر|منكر ونكير|سؤال منكر|سؤال نكير/;
/** Grave/death words — count only beside barzakh/death collocations. */
const AR_BARZAKH_WEAK = /القبر|القبور|الموتي|الموت|الميت|يموت|عذاب القبر|سؤال القبر/;
const AR_BARZAKH_CONTEXT = /عذاب|سؤال|منكر|نكير|برزخ|يبعث|النشور|الحشر|القيامة|يوم|الاخرة|تُفتح|تُنبش|يقلبون|زائر|يزور|موت|قبر|قبور|موتي|ميت|يموت|يبعثهم|يبعثون|يُبعث|يبعث/;

/** Reckoning: the account, the recompense, the weighing — all gated (الحساب also = arithmetic). */
const AR_HISAB_WEAK = /الحساب|حساب|حاسب|يحاسب|حاسبوا|الموقف|المعاد|الجزاء|العقاب|المثوبة|الثواب|توزن|يوزن|حسنات|سيئات|بالاعمال|الوزن|الموازين|جزاؤه|جزاء|عقاب|مثوبة|ثواب/;
const AR_HISAB_CONTEXT = /الاخرة|القيامة|يوم القيامة|يوم الحساب|يوم الدين|الله|الاعمال|الوزن|الموازين|النار|الجنة|في الاخرة|يوزن|توزن|حسنات|سيئات|بالاعمال|الوزن|الموازين|جزاؤه|جزاء|عقاب|مثوبة|ثواب|حساب|الاخرة|القيامة|يوم القيامة|يوم الحساب|يوم الدين|الله|الاعمال|الوزن|الموازين|النار|الجنة|في الاخرة|يوزن|توزن|حسنات|سيئات|بالاعمال|الوزن|الموازين|جزاؤه|جزاء|عقاب|مثوبة|ثواب|حساب/;

/** The Scale: «الميزان» counts beside weighing-reckoning collocations. */
const AR_MIZAN_WEAK = /الميزان|ميزان|مِيزان|الموازين|توزن|يوزن|الوزن/;
const AR_MIZAN_CONTEXT = /حسنات|سيئات|اعمال|يوم|يوزن|توزن|الوزن|في الاخرة|القيامة|الله|العباد|المؤمنين|الكافرين|الموازين|بالاعمال/;

/** The Bridge: «الصراط» counts beside bridge/Day collocations. */
const AR_SIRAT_STRONG = /الصراط المستقيم|يمرون علي الصراط|يعبرون الصراط|عبر الصراط|اجتاز الصراط/;
const AR_SIRAT_WEAK = /الصراط|صراط|جسر/;
const AR_SIRAT_CONTEXT = /يوم|القيامة|يمرون|يعبرون|علي|من|الي|جهنم|الجنة|الاخرة|المستقيم|العبور|يعبر|يمر|يمرون|علي الصراط|من الصراط|الي الصراط|عبر الصراط|اجتاز الصراط/;

/** The Basin: «الحوض» counts beside Basin collocations; «الكوثر» is the river or sura name. */
const AR_HAWD_STRONG = /حوض النبي|حوض الكوثر|يردون الحوض|يشربون من الحوض|الانبياء يحشرون/;
const AR_HAWD_WEAK = /الحوض|حوض|الكوثر|كوثر/;
const AR_HAWD_CONTEXT = /النبي|الكوثر|الجنة|يشربون|يردون|الانبياء|المؤمنين|يوم|الساعة|القيامة|الاخرة|منه|عنده|امتي|امتي|من امتي|شرب|نهر|ورود/;

/** Paradise: the unambiguous paradise terms, then «الجنة/جنات/جنان» beside paradise collocations. */
const AR_JANNAH_STRONG = /الفردوس|جنات عدن|جنة الخلود|دار الجنة|اهل الجنة|اصحاب الجنة|حور العين|قاصرات النظر|مقصورات الخلق/;
const AR_JANNAH_WEAK = /الجنة|جنات|جنان|جنانات|الجنان/;
const AR_JANNAH_CONTEXT = /خلود|عدن|فردوس|دار|اهل|اصحاب|ورود|ماكوث|حور|نهر|كوثر|مانوسة|نعيم|لا يموت|ما يشيخ|ذوات افنان|الي جنات|من جنات|في الجنة|الي الجنة|من الجنة|علي الجنة|الجنة|سكني|مقام|ابداً|ابد|اقامة|ماكوث|خلود|نعيم|غرف|غرفهم|حرير|استبرق|اساور|لؤلؤ|ياقوت|زمرد|سندس|خز|ابرار/;

/** Hell: «جهنم/الجحيم/سقر» unambiguous; «النار» counts beside Hell collocations. */
const AR_JAHANNAM_STRONG = /جهنم|الجحيم|سقر|النار الموقدة|دار النار|اهل النار|اصحاب النار|عذاب النار/;
const AR_JAHANNAM_WEAK = /النار|نار/;
const AR_JAHANNAM_CONTEXT = /جهنم|اهل|عذاب|دار|موقدة|الله|الناس|جزوا|بئس|المشركين|الكافرين|الظالمين|الضالين|المجرمين|في النار|من النار|علي النار|الي النار|عذاب|جزاء|يوم|الاخرة|العقاب/;

/** The Hereafter: the «دار الآخرة» compounds strong; «الآخرة» counts beside Hereafter collocations. */
const AR_AKHIRA_STRONG = /دار الاخرة|في الاخرة|ثواب الاخرة|عمل الاخرة|اجر الاخرة|يوم الاخرة|الدار الاخرة|الدنيا والاخرة|للدار الاخرة|دار البقاء|المصير/;
const AR_AKHIRA_WEAK = /الاخرة|اخرة|العاقبة|الخاتمة|النهاية|المنتهي/;
const AR_AKHIRA_CONTEXT = /دار|في|ثواب|اجر|عمل|يوم|الله|جعل|مال|ماله|المال|الدار|الباقية|البوار|الخلود|بئس|سعادة|شقاوة|العمل|الحساب|الجزاء|الوزن|القيامة|الساعة|النار|الجنة|اعمال|الحسنات|السيئات|المؤمنين|الكافرين|للدار|الي الاخرة|من الاخرة|علي الاخرة/;

/** The Dajjal: «الدجال» definite unambiguous; «دجال» bare counts beside deceiver collocations. */
const AR_DAJJAL_STRONG = /الدجال|المسيح الدجال|فتنة الدجال|خروج الدجال|يخرج الدجال/;
const AR_DAJJAL_WEAK = /دجال/;
const AR_DAJJAL_CONTEXT = /المسيح|الفتنة|يخرج|الدجال|خروج|يظهر|ياتي|يكون|فتنة/;

/** Yajuj and Majuj: unambiguous proper nouns; «سدّ» (the wall) counts beside Gog-Magog collocations. */
const AR_YAJUJ_STRONG = /ياجوج|ماجوج|Gog and Magog|ياجوج وماجوج/;
const AR_YAJUJ_WEAK = /سدّ|سد/;
const AR_YAJUJ_CONTEXT = /ياجوج|ماجوج|ذو القرنين|الساعة|القيامة|يفتح|يفتحون|ينفذون|يخرقون|يخرجون|ياتون|ياتين/;

/** The Mahdi: «المهدي» definite is the eschatological Mahdi almost always; «مهدي» bare counts beside Mahdi collocations. */
const AR_MAHDI_STRONG = /المهدي|يخرج المهدي|يظهر المهدي/;
const AR_MAHDI_WEAK = /مهدي/;
const AR_MAHDI_CONTEXT = /يخرج|يظهر|اخر الزمان|يؤمن|يملا|يعدل|الزمن|الدنيا|الامام|في اخر|من ال|من ولد|من بني|من قريش|يملا/;

/** The Trumpet and end-times angels: «إسرافيل» unambiguous; the blowing forms count beside Trumpet collocations. */
const AR_MALAKUT_STRONG = /اسرافيل|الملك الموكل بالصور/;
const AR_MALAKUT_WEAK = /النفخ|نفخ|الصور|صور|بوق|الروح|روح|ينفخ/;
const AR_MALAKUT_CONTEXT = /الصور|ينفخ|بوق|اسرافيل|يوم|الساعة|القيامة|الاخرة|ينفخ فيه|في الصور|علي الصور|من الصور|في الصور|علي الصور|بوق|الصور|ينفخ|بوق|اسرافيل|يوم|الساعة|القيامة|الاخرة/;

// ---------------------------------------------------------------------------
// Arabic strips — worldly usages removed before matching
// ---------------------------------------------------------------------------

/** Fiqh arithmetic stripped: «علم الحساب» is the science of calculation, not the Reckoning. */
const NOT_HISAB = /علم الحساب|الحساب الفقهي/g;
/** Prayer-time and commercial hour usages stripped: «ساعة» as clock-time is not the Hour. */
const NOT_SAA = /ساعة من وقت|ساعة من نهار|ساعة من ليل|ساعة الصلاة|ساعة المغرب|ساعة العشاء|ساعة الظهر|ساعة العصر|ساعة الفجر|ساعة الوتر/g;
/** Literal fire usages stripped: «نار» as cooking-fire, forge-fire, bellows. */
const NOT_NAR = /نار الموقد|نار التنور|نار الحداد|نار الحمام|نار الطبخ|نار المطبخ|نار النار/g;
/** Literal garden usages stripped: «الجنتين»/«صاحب الجنتين» as this-world orchards (the two-gardens parable). */
const NOT_JANNA = /صاحب الجنتين|اصحاب الجنتين|الجنتين/g;
/** «المهدي» as guided-caliph adjective stripped: «المهتدي»/«الهادي» are different words. */
const NOT_MAHDI = /المهتدي|الهادي/g;

// ---------------------------------------------------------------------------
// English vocabulary
// ---------------------------------------------------------------------------

/** Unambiguous English eschatology terms. */
const EN_STRONG =
  /\b(dajjal|yajuj|majuj|gog and magog|antichrist|anti-christ|mahdi|israfil|jahannam|gehenna|firdaws|barzakh|the trumpet|last day|last hour|end times|end of time|day of judgment|judgment day|day of resurrection|resurrection day|day of reckoning|day of account|day of the hour|the hereafter|the last day|the last hour|the end times|the end of time|the promised hour|the sign of the hour|the signs of the hour|the minor signs|the major signs|ashrat|yawm al-qiyamah|yawm al-din|yawm al-ba'th|yawm al-nushur|yawm al-hashr|yawm al-hisab|yawm al-fasl|yawm al-hasrah|resurrection|judgment|hereafter|paradise|hell|isthmus)\b/i;
/** Ambiguous English terms — count only beside eschatology-domain collocations. */
const EN_WEAK = /\b(hour|day|garden|fire|scale|bridge|basin|account|reward|punishment|grave|gathering|dead|dying|death|the hour|the day|the last|the end|the sign|the signs)\b/i;
/** English eschatology-domain collocations — the context that makes an ambiguous word count. */
const EN_CONTEXT = /\b(judgment|resurrection|hereafter|paradise|hell|scale|bridge|basin|hour|signs|gathering|account|recompense|reward|punishment|grave|death|dead|dying|barzakh|isthmus|the hour|the day|the last day|the last hour|the end|the end times|the end of time|the promised hour|the sign|the signs|the minor signs|the major signs|the day of judgment|the day of resurrection|the day of account|the day of reckoning|the day of the hour|the hereafter|the last day|the last hour|the end times|the end of time|the promised hour|the sign of the hour|the signs of the hour|the minor signs|the major signs|ashrat|yawm al-qiyamah|yawm al-din|yawm al-ba'th|yawm al-nushur|yawm al-hashr|yawm al-hisab|yawm al-fasl|yawm al-hasrah)\b/i;

// ---------------------------------------------------------------------------
// The judged text and the detector
// ---------------------------------------------------------------------------

/** Normalize Arabic for matching: strip tashkeel/tatweel, unify alef/ya variants (the lexicon is written in this normalized form). */
const normAr = (s: string): string =>
  s
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي");

/** The Arabic text a passage is judged on: matn, normalized search text, Arabic label and summary. */
const arabicOf = (n: Node): string =>
  normAr(
    [n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar]
      .filter(Boolean)
      .join(" "),
  )
    .replace(NOT_HISAB, "")
    .replace(NOT_SAA, "")
    .replace(NOT_NAR, "")
    .replace(NOT_JANNA, "")
    .replace(NOT_MAHDI, "");
const englishOf = (n: Node): string =>
  [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");

/** The eschatology topic families a passage mentions, detected from its own text. */
export function eschatologyTopicsOf(n: Node): EschTopic[] {
  if (n.class !== "passage" || n.stub || ESCH_EXCLUDE.has(n.id)) return [];
  const ar = arabicOf(n);
  const en = englishOf(n);
  const topics = new Set<EschTopic>();
  const add = (t: EschTopic) => topics.add(t);
  // Poetry is judged on strong vocabulary only: elegiac death-meditation («مات»، «المنية»،
  // «الموت»، «عقاب» the eagle, «الحسنات») overlaps the eschatology lexicon without being
  // about the signs of the Hour — a verse needs an unambiguous eschatology term to join.
  const weakOk = n.data.unit !== "poem-line";
  const enHit = weakOk
    ? EN_STRONG.test(en) || (EN_WEAK.test(en) && EN_CONTEXT.test(en))
    : EN_STRONG.test(en);

  // Ashrat — signs of the Hour
  if (AR_ASHRAT_STRONG.test(ar) || (weakOk && AR_ASHRAT_WEAK.test(ar) && AR_ASHRAT_CONTEXT.test(ar)) || (enHit && /signs of the hour|minor signs|major signs|ashrat|signs|the signs/i.test(en))) add("ashrat");
  // The Hour / end-times
  if (AR_SAA_STRONG.test(ar) || (weakOk && AR_SAA_WEAK.test(ar) && AR_SAA_CONTEXT.test(ar)) || (enHit && /last hour|final hour|end times|last days|end of time|the promised hour|the hour is|the hour has|the hour will|the hour would|the hour was|the hour shall|the hour should|the hour must|the hour may|the hour can|the hour could|the hour would|the hour will|the hour near|the hour come|the hour coming|the hour arriv|the hour approach|the hour draw|the hour close|the hour nigh|the hour be|the hour at hand|the hour upon|the hour about|the hour when|the hour that|the hour of judgment|the hour of the day|the hour of the night|the hour of the dawn/i.test(en))) add("saa");
  // The Day of Judgment / resurrection
  if (AR_QIYAMA_STRONG.test(ar) || (weakOk && AR_QIYAMA_WEAK.test(ar) && AR_QIYAMA_CONTEXT.test(ar)) || (enHit && /day of judgment|judgment day|day of resurrection|resurrection day|day of reckoning|day of account|day of the hour|yawm al-qiyamah|yawm al-din|yawm al-ba'th|yawm al-nushur|yawm al-hashr|yawm al-hisab|yawm al-fasl|yawm al-hasrah|resurrection/i.test(en))) add("qiyama");
  // Barzakh, grave, death
  if (AR_BARZAKH_STRONG.test(ar) || (weakOk && AR_BARZAKH_WEAK.test(ar) && AR_BARZAKH_CONTEXT.test(ar)) || (enHit && /barzakh|grave|death|dead|dying|the grave|the dead|the dying|the death|the barzakh|the isthmus/i.test(en))) add("barzakh");
  // Reckoning
  if ((weakOk && AR_HISAB_WEAK.test(ar) && AR_HISAB_CONTEXT.test(ar)) || (enHit && /reckoning|account|recompense|reward|punishment|the reckoning|the account|the recompense|the reward|the punishment|yawm al-hisab|yawm al-fasl|yawm al-hasrah/i.test(en))) add("hisab");
  // The Scale
  if ((weakOk && AR_MIZAN_WEAK.test(ar) && AR_MIZAN_CONTEXT.test(ar)) || (enHit && /scale|the scale|the balance|the weights|the mizan|yawm al-mizan/i.test(en))) add("mizan");
  // The Bridge
  if (AR_SIRAT_STRONG.test(ar) || (weakOk && AR_SIRAT_WEAK.test(ar) && AR_SIRAT_CONTEXT.test(ar)) || (enHit && /bridge|the bridge|the sirat|the path|the way|yawm al-sirat/i.test(en))) add("sirat");
  // The Basin
  if (AR_HAWD_STRONG.test(ar) || (weakOk && AR_HAWD_WEAK.test(ar) && AR_HAWD_CONTEXT.test(ar)) || (enHit && /basin|the basin|the hawd|the pool|the kawthar|yawm al-hawd/i.test(en))) add("hawd");
  // Paradise
  if (AR_JANNAH_STRONG.test(ar) || (weakOk && AR_JANNAH_WEAK.test(ar) && AR_JANNAH_CONTEXT.test(ar)) || (enHit && /paradise|the paradise|the jannah|the garden|the firdaws|the eden|yawm al-jannah/i.test(en))) add("jannah");
  // Hell
  if (AR_JAHANNAM_STRONG.test(ar) || (weakOk && AR_JAHANNAM_WEAK.test(ar) && AR_JAHANNAM_CONTEXT.test(ar)) || (enHit && /hell|the hell|the jahannam|the gehenna|the fire|the nar|yawm al-jahannam/i.test(en))) add("jahannam");
  // The Hereafter
  if (AR_AKHIRA_STRONG.test(ar) || (weakOk && AR_AKHIRA_WEAK.test(ar) && AR_AKHIRA_CONTEXT.test(ar)) || (enHit && /hereafter|the hereafter|the akhira|the last|the hereafter|yawm al-akhirah/i.test(en))) add("akhira");
  // The Dajjal
  if (AR_DAJJAL_STRONG.test(ar) || (weakOk && AR_DAJJAL_WEAK.test(ar) && AR_DAJJAL_CONTEXT.test(ar)) || (enHit && /dajjal|the dajjal|the antichrist|the anti-christ|the deceiver|the false messiah|the true messiah|yawm al-dajjal/i.test(en))) add("dajjal");
  // Yajuj and Majuj
  if (AR_YAJUJ_STRONG.test(ar) || (weakOk && AR_YAJUJ_WEAK.test(ar) && AR_YAJUJ_CONTEXT.test(ar)) || (enHit && /yajuj|majuj|gog and magog|gog|magog|the beast|the wall|the dam|yawm al-yajuj|yawm al-majuj/i.test(en))) add("yajuj-majuj");
  // The Mahdi
  if (AR_MAHDI_STRONG.test(ar) || (weakOk && AR_MAHDI_WEAK.test(ar) && AR_MAHDI_CONTEXT.test(ar)) || (enHit && /mahdi|the mahdi|the guided|the rightly guided|yawm al-mahdi/i.test(en))) add("mahdi");
  // The Trumpet and end-times angels
  if (AR_MALAKUT_STRONG.test(ar) || (weakOk && AR_MALAKUT_WEAK.test(ar) && AR_MALAKUT_CONTEXT.test(ar)) || (enHit && /trumpet|the trumpet|israfil|the israfil|the spirit|the angel|the malak|yawm al-malakut/i.test(en))) add("malakut");

  return [...topics];
}

/** True when the passage's own text mentions the signs of the Hour, the Day of Judgment or all eschatology. */
export function isEschatologyPassage(n: Node): boolean {
  return eschatologyTopicsOf(n).length > 0;
}

/**
 * Which corpus an eschatology passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function eschCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): EschCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: the first `eschatology-<section>` tag naming a real section, else `concepts`. */
export function eschTagSection(n: Node): EschSection {
  for (const t of n.tags) {
    if (!t.startsWith("eschatology-") || t === ESCH_TAG) continue;
    const id = t.slice(12);
    if ((ESCH_SECTIONS as readonly string[]).includes(id)) return id as EschSection;
  }
  return "concepts";
}

/** The topic chips of a curated record, from its `eschatology-<topic>` tags (section tags are not topics). */
export function eschTagTopics(n: Node): EschTopic[] {
  return n.tags
    .filter((t) => t.startsWith("eschatology-") && t !== ESCH_TAG)
    .map((t) => t.slice(12))
    .filter((t): t is EschTopic => (ESCH_TOPICS as readonly string[]).includes(t));
}

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape hatch,
 * each verified by reading the passage. Filled after the detection review sweep
 * (docs/plan/42-eschatology-browser.md §7).
 */
export const ESCH_EXCLUDE = new Set<string>([]);
