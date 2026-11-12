// The Nubuwat Browser's shared reads (docs/plan/44-nubuwat-browser.md): which passage records
// carry the Prophet's prophecies, the proofs of prophethood, the Qur'an's inimitability and
// secrets, the Prophet's miracles, the reports of unseen knowledge and the eschatological
// predictions — and which corpus section each belongs to. Detection runs at build time over
// the compiled graph, so a prophecy or marvel in any harvested book — and in every book
// harvested later — appears without any tagging step. Curated records join through the
// `nubuwat-browser` tag instead.
//
// The lexicon is deliberately gated, on the magic.ts/eschatology.ts model: unvocalized
// Arabic makes «النبي» a name and a title, «المعجز» a wonder and a wonder-worker, «السر»
// a secret and a matter, «الغيب» the unseen and the unseen realm, «الآخرة» the Hereafter
// and "the other" of two, «الساعة» the Hour and the hour. Bare ambiguous forms count only
// beside a domain collocation in the same passage; verified false positives live in
// NUBUWAT_EXCLUDE.
import type { Node } from "./build-graph.js";

export const NUBUWAT_TAG = "nubuwat-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const NUBUWAT_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type NubuwatSection = (typeof NUBUWAT_SECTIONS)[number];
export type NubuwatCorpus = Exclude<NubuwatSection, "curated">;

/** Topic chips carried by a record: detected families on passages, `nubuwat-<topic>` tags on curated records. */
export const NUBUWAT_TOPICS = [
  "nubuwwa", "nubuwat", "muajizat", "ijaz", "asrar", "ilm-ghayb", "akhira",
] as const;
export type NubuwatTopic = (typeof NUBUWAT_TOPICS)[number];

/**
 * Prophethood and its proofs («دلائل النبوة»): the seal of prophethood, claims of
 * prophethood, the proofs genre, the warner/glad-tidings role, and reports that verify
 * the Prophet's truthfulness («صدق ما قال»). Ambiguous forms («منذر»، «يبشر»، «بشارة»)
 * count only beside a prophecy-domain collocation.
 */
const AR_NUBUWWA_STRONG =
  /خاتم النبيين|خاتم الانبياء|خاتم الرسل|خاتم المرسلين|ختم النبوة|خاتم النبوة|دلائل النبوة|دلائل النبوه|علامات النبوة|براهين النبوة|شواهد النبوة|ادلة النبوة|ادعي النبوة|ادعاء النبوة|دعوي النبوة|مدعي النبوة|صدق ما قال|صدق قوله|صدق حديثه|صدق رسول الله|صدق النبي|اخبر بالحق|اخبر بالصدق|تثبت ما|ثبت ما قال|تحقق ما قال|اخبر عن الغيب|اخبر بالغيبيات/;
const AR_NUBUWWA_WEAK = /يبشر امته|يبشر الناس|مبشر|تبشر|بشارة|بشائر|ادعي النبوة|ادعاء النبوة|دعوي النبوة|ادعي بالنبوة|ادعي اني نبي|ادعي اني رسول|مدعي النبوة|منذر امته|نذير امته/;
const AR_NUBUWWA_CONTEXT =
  /الله|الرسول|النبي|محمد|نبوة|امته|المؤمنين|الانبياء|المرسلين|الرسل|الساعة|القيامة|الحشر|النشور|الجنة|النار|الدنيا|الاخرة|الملائكة|الوحي|القرآن|قرآن|سورة|سوره|آية|اية|معجز|دلائل|خواتم|خاتم|بشير/;

/**
 * Prophecies and predictions: the future-announcement formulas the tradition records —
 * «من بعدي»، «بعدي ياتي/يخرج/يقوم»، «سيأتي زمان»، «لا تقوم الساعة حتي»، «يأتي في اخر
 * الزمان»، and the eschatological announcements proper.
 */
const AR_NUBUWAT_STRONG =
  /من بعدي|من بعده|بعدي ياتي|بعدي يأتي|بعدي يخرج|بعدي يقوم|بعدي ينبعث|بعد موتي|بعد وفاتي|بعد رحيل|بعد انصرامي|بعد انقضاء|سيأتي زمان|يأتي زمان|يأتي في اخر الزمان|اخر الزمان|لا تقوم الساعة حتي|لا تقوم الساعة حتى|لا تزال الحرب|لا تزال قائمة|تنقلبن|لتنقلبن|لتتغيرن|لتغيرن|يؤتى به من بعد|يؤتى به من قبل|يؤتى بكتاب|يؤتى بالقران|يؤتى بالقرآن/;
/** Future-announcement verbs count only beside a prophecy-domain collocation. */
const AR_NUBUWAT_WEAK =
  /سيأتي|سياتين|سياتون|سيأتون|سيأتي|يأتي|ياتون|ياتين|يأتون|يأتيك|يأتيه|يأتيها|يأتيهم|يأتين|ياتيني|يأتيني|يأتي علي|يأتي الي|يأتي في|يأتي من|يأتي عن|يأتي عند|يأتي مع|يأتي الا|يأتي ان|يأتي اذا|يأتي حين|يأتي يوم|يأتي لما|يأتي له|يأتي لها|يأتي لهم|يأتي لنا|يأتي لكم|يأتيكن|يأتوك|يأتوه|يأتوا|يؤتى|يؤتى به|يؤتى بكتاب|يؤتى بالقران|يؤتى بالقرآن|يؤتى به من|يؤتى به من بعد|يؤتى به من بعدي|يؤتى به من بعده|يؤتى به من قبل|يؤتى به من قبل/;
const AR_NUBUWAT_CONTEXT =
  /النبي|الرسول|محمد|الله|ربنا|وعد|ميعاد|بشر|اخبر|اخبركم|اخبرنا|نبي|رسول|امتي|الناس|الدنيا|الاخرة|الساعة|القيامة|الحشر|النشور|الموتي|الاموات|الدجال|المهدي|عيسي|ياجوج|ماجوج|القدر|الاجل|الموت|الجنة|النار|الدنيا|المال|الملك|السلطان|الامام|الخليفة|القائم|الانبياء|المرسلين|الرسل|الساعة|الاخرة|القيامة|الحشر|النشور|القدر|الاجل|الموت|الجنة|النار|الدنيا|المال|الملك|السلطان|الامام|الخليفة|القائم|الانبياء|المرسلين|الرسل|نبوة|نبي|رسول|آية|اية|سورة|سوره|قران|قرآن|وحي|نزل|تلاوة|قراءة|بلاغة|إعجاز|اعجاز|اسرار|أسرار|خبايا|معجز|خارق/;

/**
 * The Prophet's miracles («دلائل النبوة» the miracles genre): only the named wonders and
 * their unambiguous collocations — the moon's splitting, the weeping tree, the multiplied
 * food, the night journey and ascent, the water from between his fingers, the chest-opening,
 * the light between his eyes, the stones glorifying. Bare nature words (نور، ماء، سماء،
 * ارض، جبال، شمس، قمر، نجوم، نار، ظلام، رؤيا، منام) never count on their own — they are
 * ordinary vocabulary and belong to other browsers.
 */
const AR_MUAJIZAT_STRONG =
  /معجز|معجزه|معجزات|المعجز|خارق للعادة|خارق العادات|خارق ما اعتاد|فوق العادة|خوارق العادات|انشقاق القمر|انشق القمر|شق القمر|القمر انشق|انشق ما بين|بكاء الشجرة|بكت الشجرة|الشجرة تبكي|الشجرة بكت|بكت نخلة|بكت طلح|بكت السدرة|تكثير|زاد الطعام|تكاثر الطعام|طعاما اضعاف|اضعافا مضاعفة|لم ينقص طعام|لا ينقص طعام|اسراء|الاسراء|المعراج|عرج بي|صعد بي|عرج الي السماء|ليلة الاسراء|ليلة المعراج|عرج به|عرج بي|عرج به الي|شق صدر|شق صدره|شق ما بين|نبع الماء من بين اصابعه|من بين اصابعه|من بين اصابع|نبع من بينغرة بين عينيه|نورا بين عينيه|نور بين عينيه|النور الذي بين عينيه|نورا محمدا|نور محمد|الحجارة تسبح|الحجر يسبح|حجارة تسبح|الحجر يسبح|تسبح الحجارة|يسبح الحجارة|سبحان الله علي الحجارة/;
/** Ambiguous marvel forms count only beside a miracle-domain collocation. */
const AR_MUAJIZAT_WEAK = /انشق|نور بين|غرة|بكاء|تبكي|تنوح|نوحت|ناحت|سبق|يسبق|تعجز|اعجز|نبع من بين/;
const AR_MUAJIZAT_CONTEXT =
  /الله|ربنا|صدق|اخبر|بشر|وعد|ميعاد|اخبركم|اخبرنا|نبو|رسول|امتي|الناس|الدنيا|الاخرة|الساعة|القيامة|الحشر|النشور|الموتي|الاموات|الدجال|المهدي|عيسي|ياجوج|ماجوج|القدر|الاجل|الموت|الجنة|النار|الدنيا|المال|الملك|السلطان|الامام|الخليفة|القائم|الانبياء|المرسلين|الرسل|الساعة|الاخرة|القيامة|الحشر|النشور|القدر|الاجل|الموت|الجنة|النار|الدنيا|المال|الملك|السلطان|الامام|الخليفة|القائم|الانبياء|المرسلين|الرسل|نبوة|نبي|رسول|آية|اية|سورة|سوره|قران|قرآن|وحي|نزل|تلاوة|قراءة|بلاغة|إعجاز|اعجاز|اسرار|أسرار|خبايا|معجز|دلائل|علامات|نبوة|نبي|رسول|حجارة|حجر|نخل|سدر|طلع|رطب|شجر|شجرة|قمر|شمس|مدر/;

/**
 * The Qur'an's inimitability («إعجاز القرآن»): the challenge formulas, the i'jaz root,
 * the rhetorical and scientific inimitability genres.
 */
const AR_IJAZ_STRONG =
  /اعجاز|الإعجاز|الاعجاز|اعجاز القرآن|بمثل هذا القرآن|بمثل القرآن|مثل القرآن|امثال القرآن|مثل هذا القرآن|اتوا بمثله|اتوا بسورة|فاتوا بسورة|لو اجتمع الإنس والجن|اجتمعت الإنس والجن|الإنس والجن|لو اجتمع|ان ياتوا بمثله|عجزوا عن مثل|اعجزكم|اعجز الله|اعجاز علمي|الاعجاز العلمي|نظم علمي|النظم العلمي|اعجاز كوني|الاعجاز الكوني|ايات كونية|الآيات الكونية|بلاغة القرآن|بلاغه القرآن/;
/** The challenge formulas count only beside a Qur'an-domain collocation. */
const AR_IJAZ_WEAK = /مثله|بمثله|بمثل هذا|بقوله|بمثل قوله|اعجز|لا يستطيعون|ما استطاعوا|ما قدروا|بلاغة|فصاحة|اسلوب|أسلوب|بلاغ|معاني|البيان|بيان/;
const AR_IJAZ_CONTEXT =
  /قرآن|قران|سورة|سوره|آيات|سور|تفسير|بلاغة|إعجاز|اعجاز|محكم|متشابه|ناسخ|منسوخ|مكية|مدنية|نظم|بلاغة القرآن|بلاغه القرآن/;

/**
 * The Qur'an's secrets («أسرار القرآن»): the secrets genre, the marvels, the hidden and
 * the manifest, the esoteric reading, the abrogation and the similar/precise verses.
 */
const AR_ASRAR_STRONG =
  /اسرار القرآن|خبايا القرآن|باطن القرآن|ظاهر القرآن|جواهر القرآن|كنوز القرآن|لطائف القرآن|سر القرآن|اسرار|أسرار|الإسرار|خبايا|غوامض|مغلقات|سرائر|السرائر/;
/** The secrets vocabulary counts only beside a Qur'an-domain collocation. */
const AR_ASRAR_WEAK = /باطن|ظاهر|كليات|جزئيات|ظواهر|بطائن|لطائف|عجائب|غرائب|جواهر|كنوز|احكام|ناسخ|منسوخ|متشابه|محكم|مكية|مدنية|مكي|مدني|سرائر|السرائر|سريرة|السريرة|خفي|خفية|مخفي|مستور|مكتوم|مخفية|مغلقة|مغلقة|اسرار|أسرار|خبايا/;
const AR_ASRAR_CONTEXT =
  /قرآن|قران|سورة|سوره|آيات|سور|تفسير|بلاغة|إعجاز|اعجاز|محكم|متشابه|ناسخ|منسوخ|مكية|مدنية|نظم|بلاغة القرآن|بلاغه القرآن/;

/**
 * The reports of unseen knowledge («علم الغيب»): what is hidden from creation, what the
 * Prophet knew of hearts and unseen, the verses that ascribe comprehensive knowledge.
 */
const AR_ILM_GHYB_STRONG =
  /علم الغيب|الغيب|بالغيب|بالغيبيات|الغيبيات|غيب الله|يعلم السر|يعلم ما في الصدور|ما تكنه|كنه صدورهم|كنه قلوبهم|ما يخفون|ما يضمرون|ما في الصدور|في صدورهم|في قلوبهم|يعلم ما بين ايديهم وما خلفهم|يعلم ما في الارض وما في السماء|لا يحيطون به علما|لا يحيطون|احاطة علمه|وسعت كل شيء علما|كل شيء علما|لا يعزب عنه مثقال|يعلم ما في الصدور|ما يكنونه|ما يخفونه|ما يخفون في صدورهم|ما يضمرون في قلوبهم|ما في قلوبهم|ما في صدورهم|السرائر|سرائر|سرائرهم|سريرتهم|سريرته/;
/** The unseen-knowledge forms count only beside a divine-knowledge collocation. */
const AR_ILM_GHYB_WEAK = /يكتم|كتمان|يكتمون|يكتمها|يكتمونه|مكتوم|مكتومة|اخفي|اخفي الله|ما اخفي|يخفي|يخفون|يخفين|خفى|خافية|مستور|مخفي|يكتمن|يكتمنه|يكتمنها|يكتمنهم/;
const AR_ILM_GHYB_CONTEXT =
  /الله|ربنا|سرائر|صدور|قلوب|خفية|علم الغيب|السر|باطن|خفى|بطن|خبير|عليم|سميع|بصير|استخبار|فاحص|غيب|يعلم|تعلم|أعلم|يعلمون|تعلمون|أعلموا|يخفي|يكتم|مكتوم|مستور|مخفي/;

/**
 * The eschatological prophecies («أشراط الساعة»): the Hour's approach, the named signs —
 * Dajjal, Mahdi, 'Isa's descent, Gog and Magog — and the Day's events.
 */
const AR_AKHIRA_STRONG =
  /يوم القيامة|يوم الدين|الساعة الكبري|الساعة الصغري|اخر الزمان|الدجال|المسيح الدجال|المهدي|ياجوج|ماجوج|النبي عيسي|عيسي ينزل|ينزل عيسي|يخرج المهدي|يظهر المهدي|يخرج الدجال|يظهر الدجال|يوم القيامة|يوم الدين|يوم البعث|يوم النشور|يوم الحشر|يوم الحساب|القيامة|النشور|الحشر|المحشر|الساعة تدنو|دنت الساعة|اقتربت الساعة|قربت الساعة|الساعة اتية|الساعة نازلة|الساعة دانية|الساعة قريبة|الساعة بعيدة|الساعة باقية|الساعة تمضي|الساعة مضت/;

/** English fields, per family: the museum's own translations name the strand plainly. */
const EN_NUBUWWA = /\b(prophethood|seal of the prophets|proofs? of prophethood|warner|glad tidings)\b/i;
const EN_NUBUWAT = /\b(prophec\w+|prediction\w*|after me|after his death|in the last days|last hour|signs? of the hour|eschatolog\w*)\b/i;
const EN_MUAJIZAT = /\b(miracle\w*|marvel\w*|moon split|split the moon|night journey|night ascent|ascension|chest|weeping tree|water from|light between his eyes)\b/i;
const EN_IJAZ = /\b(inimitability|i'jaz|challenge|imitate the Qur'an|like this Qur'an|produce a sura|rhetorical|scientific miracle)\b/i;
const EN_ASRAR = /\b(secret\w*|hidden|mystery|mysteries|esoteric|exoteric|abrogat\w*|similar verses|precise verses|gems|treasures|subtleties)\b/i;
const EN_ILM_GHYB = /\b(unseen|hidden knowledge|what is in the breasts|hearts?|knows the unseen|comprehensive knowledge|concealment)\b/i;
const EN_AKHIRA = /\b(Dajjal|deceiver|Mahdi|guided one|'Isa|Jesus|descends?|Gog and Magog|Yajuj|Majuj|Day of Judgment|Day of Resurrection|last hour|eschatolog\w*)\b/i;

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape hatch,
 * each verified by reading the passage.
 */
export const NUBUWAT_EXCLUDE = new Set<string>([]);

/** The Arabic text a passage is judged on: matn, normalized search text, Arabic label and summary. */
const arabicOf = (n: Node): string =>
  [n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar].filter(Boolean).join(" ");
const englishOf = (n: Node): string =>
  [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");

/** The nubuwat topic families a passage mentions, detected from its own text. */
export function nubuwatTopicsOf(n: Node): NubuwatTopic[] {
  if (n.class !== "passage" || n.stub || NUBUWAT_EXCLUDE.has(n.id)) return [];
  const ar = arabicOf(n);
  const en = englishOf(n);
  const topics = new Set<NubuwatTopic>();
  if (AR_NUBUWWA_STRONG.test(ar) || (AR_NUBUWWA_WEAK.test(ar) && AR_NUBUWWA_CONTEXT.test(ar)) || EN_NUBUWWA.test(en)) topics.add("nubuwwa");
  const weakOk = AR_NUBUWAT_WEAK.test(ar) && AR_NUBUWAT_CONTEXT.test(ar);
  if (AR_NUBUWAT_STRONG.test(ar) || weakOk || EN_NUBUWAT.test(en)) topics.add("nubuwat");
  const mWeak = AR_MUAJIZAT_WEAK.test(ar) && AR_MUAJIZAT_CONTEXT.test(ar);
  if (AR_MUAJIZAT_STRONG.test(ar) || mWeak || EN_MUAJIZAT.test(en)) topics.add("muajizat");
  const iWeak = AR_IJAZ_WEAK.test(ar) && AR_IJAZ_CONTEXT.test(ar);
  if (AR_IJAZ_STRONG.test(ar) || iWeak || EN_IJAZ.test(en)) topics.add("ijaz");
  const aWeak = AR_ASRAR_WEAK.test(ar) && AR_ASRAR_CONTEXT.test(ar);
  if (AR_ASRAR_STRONG.test(ar) || aWeak || EN_ASRAR.test(en)) topics.add("asrar");
  const gWeak = AR_ILM_GHYB_WEAK.test(ar) && AR_ILM_GHYB_CONTEXT.test(ar);
  if (AR_ILM_GHYB_STRONG.test(ar) || gWeak || EN_ILM_GHYB.test(en)) topics.add("ilm-ghayb");
  if (AR_AKHIRA_STRONG.test(ar) || EN_AKHIRA.test(en)) topics.add("akhira");
  return [...topics];
}

/** True when the passage's own text carries prophecy, prophethood, Qur'anic marvel or eschatology. */
export function isNubuwatPassage(n: Node): boolean {
  return nubuwatTopicsOf(n).length > 0;
}

/**
 * Which corpus a nubuwat passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function nubuwatCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): NubuwatCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: the first `nubuwat-<section>` tag naming a real section, else `curated`. */
export function nubuwatTagSection(n: Node): NubuwatSection {
  for (const t of n.tags) {
    if (!t.startsWith("nubuwat-") || t === NUBUWAT_TAG) continue;
    const id = t.slice(8);
    if ((NUBUWAT_SECTIONS as readonly string[]).includes(id)) return id as NubuwatSection;
  }
  return "curated";
}

/** The topic chips of a curated record, from its `nubuwat-<topic>` tags (section tags are not topics). */
export function nubuwatTagTopics(n: Node): NubuwatTopic[] {
  return n.tags
    .filter((t) => t.startsWith("nubuwat-") && t !== NUBUWAT_TAG)
    .map((t) => t.slice(8))
    .filter((t): t is NubuwatTopic => (NUBUWAT_TOPICS as readonly string[]).includes(t));
}
