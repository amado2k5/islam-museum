// The Miracles Browser's shared reads (docs/plan/44-miracles-browser.md): which passage records
// mention the divine miracles and the prophets' miracles — by the miracle vocabulary itself
// (معجزة/إعجاز/دلائل النبوة), by the miracle narratives of the Qur'an and the Sunnah (the staff,
// the sea, the she-camel, the ark, the fire, the clay bird, the cradle speech, the heavenly table,
// Sulayman's signs, the dreams, the annunciation, the covenant chest, the moon-split, the Isra' and
// Mi'raj, the descent of 'Isa, the Prophet's signs), by the cosmic-sign verses (آيات كونية), and by
// the canonical `mentions` edges already in the graph — so a miracle mentioned in any book
// harvested later appears here the day its passage record lands. Curated records join through the
// `miracles-browser` tag instead.
//
// Precision notes learned from the corpus: «معجز/معجزين» in the Qur'an is almost always the
// verb "to defeat/escape" (وما أنتم بمعجزين), never the noun "miracle", so the bare form is gated
// out of the Qur'an corpus entirely; «أعجاز نخل» is "palm-roots", not inimitability; «حبا» is
// "love", not a loaf; «قدير» is a divine attribute everywhere; «خسف» is humiliation, not the lunar
// eclipse; «الكرامة» can be generosity or «ذو الكرامة»; «المن» is only the manna beside Banu
// Isra'il context; poetry uses «بريد» for mail and «نار» for ordinary fire.
import type { Node } from "./build-graph.js";

export const MIRACLES_TAG = "miracles-browser";
export const MIRACLE_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type MiracleSection = (typeof MIRACLE_SECTIONS)[number];
export type MiracleCorpus = Exclude<MiracleSection, "curated">;
export type MiracleKind = "event" | "sign" | "mention";

/**
 * The browser's subject index: the miracle-bearing prophets and the concepts/events the museum
 * already keeps for the miracle complex. Prophet-specific topics map to their person subject; the
 * meta topics (doctrine, challenge, i'jaz, karamat, cosmic signs, unnamed signs) map to the
 * concept records; the Prophet's own signs and journeys map to person/muhammad and the event
 * records. Deniers'-nations destructions are split per people so each lands on its prophet.
 */
export const MIRACLE_SUBJECTS = [
  "concept/mujiza",
  "concept/al-tahaddi-bil-quran",
  "concept/ijaz-al-quran",
  "concept/al-ayat-al-kawniyya-wal-mujiza",
  "concept/karamat-al-awliya",
  "concept/inshiqaq-al-qamar",
  "concept/descent-of-isa",
  "event/isra-and-miraj",
  "event/year-of-the-elephant-and-birth",
  "concept/ayat-musa-al-tis",
  "person/muhammad", "person/ibrahim", "person/ismail", "person/isa-ibn-maryam",
  "person/zakariyya", "person/yahya", "person/yusuf", "person/musa", "person/harun",
  "person/sulayman", "person/ayyub", "person/yunus", "person/al-khidr", "person/nuh",
  "person/hud", "person/salih", "person/shuayb", "person/lut", "person/talut",
] as const;
export type MiracleSubjectId = (typeof MIRACLE_SUBJECTS)[number];
export const MIRACLE_SUBJECT_SET = new Set<string>(MIRACLE_SUBJECTS);

export const MIRACLE_TOPICS = [
  "doctrine", "challenge", "i3jaz", "karamat", "unnamed", "cosmic-signs",
  "moon", "isra-miraj", "descent", "staff", "sea", "provision", "fire", "she-camel",
  "ad-destruction", "thamud-destruction", "madyan-destruction", "lut-destruction",
  "pharaoh-destruction", "generic-destruction", "elephant", "fish", "ark", "basket",
  "healing", "clay-bird", "cradle", "table", "sulayman", "dreams", "annunciation",
  "covenant-ark", "prophet-signs",
] as const;
export type MiracleTopic = (typeof MIRACLE_TOPICS)[number];

/** Topic -> kind: narrated miracle events, cosmic-sign verses, and meta mentions. */
export const MIRACLE_TOPIC_KIND: Record<MiracleTopic, MiracleKind> = {
  doctrine: "mention", challenge: "mention", i3jaz: "mention", karamat: "mention", unnamed: "mention",
  "cosmic-signs": "sign",
  moon: "event", "isra-miraj": "event", descent: "event", staff: "event", sea: "event",
  provision: "event", fire: "event", "she-camel": "event", "ad-destruction": "event",
  "thamud-destruction": "event", "madyan-destruction": "event", "lut-destruction": "event",
  "pharaoh-destruction": "event", "generic-destruction": "event", elephant: "event",
  fish: "event", ark: "event", basket: "event", healing: "event", "clay-bird": "event",
  cradle: "event", table: "event", sulayman: "event", dreams: "event",
  annunciation: "event", "covenant-ark": "event", "prophet-signs": "event",
};

/** Topic -> canonical subjects the passage joins on the subject pages. */
export const MIRACLE_TOPIC_SUBJECTS: Partial<Record<MiracleTopic, MiracleSubjectId[]>> = {
  doctrine: ["concept/mujiza"], challenge: ["concept/al-tahaddi-bil-quran"],
  i3jaz: ["concept/ijaz-al-quran"], karamat: ["concept/karamat-al-awliya"], unnamed: ["concept/mujiza"],
  "cosmic-signs": ["concept/al-ayat-al-kawniyya-wal-mujiza"],
  moon: ["person/muhammad", "concept/inshiqaq-al-qamar"],
  "isra-miraj": ["person/muhammad", "event/isra-and-miraj"],
  descent: ["person/isa-ibn-maryam", "concept/descent-of-isa"],
  staff: ["person/musa", "person/harun"], sea: ["person/musa"], provision: ["person/musa", "person/ismail"],
  fire: ["person/ibrahim"], "she-camel": ["person/salih"],
  "ad-destruction": ["person/hud"], "thamud-destruction": ["person/salih"],
  "madyan-destruction": ["person/shuayb"], "lut-destruction": ["person/lut"],
  "pharaoh-destruction": ["person/musa"], "generic-destruction": ["concept/mujiza"],
  elephant: ["person/muhammad", "event/year-of-the-elephant-and-birth"],
  fish: ["person/yunus", "person/al-khidr"], ark: ["person/nuh"], basket: ["person/musa"],
  healing: ["person/isa-ibn-maryam", "person/ayyub"], "clay-bird": ["person/isa-ibn-maryam"],
  cradle: ["person/isa-ibn-maryam", "person/yahya"], table: ["person/isa-ibn-maryam"],
  sulayman: ["person/sulayman"], dreams: ["person/yusuf"],
  annunciation: ["person/zakariyya", "person/yahya"], "covenant-ark": ["person/talut"],
  "prophet-signs": ["person/muhammad"],
};

/** Passage records whose only lexical hit is a known false positive, verified by reading. */
export const MIRACLES_EXCLUDE = new Set<string>([]);
/** Single-topic exclusions for verified false positives. */
export const MIRACLE_TOPIC_EXCLUDE = new Set<string>([]);

const DIACRITICS = /[ً-ٰٟۖ-ۭـ]/g;
/** Match-space normalization: hamza seats unified, dagger alif becomes alef, standalone hamza
 * dropped, ة→ه, ى→ي, ؤ→و, ئ→ي. Patterns are written in natural Arabic and run through the same
 * function at load, so orthography can never drift from the text. */
export function normalizeMiracleArabic(s: string): string {
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

interface TopicPattern { re: RegExp; all?: RegExp[]; none?: RegExp[]; corpora?: MiracleCorpus[] }
interface TopicSpec { kind: MiracleKind; pats: TopicPattern[] }

const P = (s: string): RegExp => new RegExp(normalizeMiracleArabic(s));
const W = String.raw`(?<![ء-ي])`;
const E = String.raw`(?![ء-ي])`;
const ph = (s: string): RegExp => new RegExp(normalizeMiracleArabic(String.raw`(?<![ء-ي])(?:` + s + String.raw`)(?![ء-ي])`));

const NON_QURAN: MiracleCorpus[] = ["sunnah", "seerah", "books"];

/** The miracle lexicon. `any` hit + optional `all` co-occurrence gates + `none` exclusions. */
const SPECS: Record<MiracleTopic, TopicSpec> = {
  doctrine: { kind: "mention", pats: [
    { re: ph("معجزه") }, { re: ph("معجزات") }, { re: ph("معجزتين") },
    { re: ph("معجزه" + "هن") },
    { re: new RegExp(normalizeMiracleArabic("معجز") + String.raw`(?:ه[هنكمكيتما]?|ات|تين|ين|ون|ي|نا|ك|كما|تي|ته|تها)(?=\s|$|[،,.;:!؟?()\[\]{}«»"'\-ـ])`), corpora: NON_QURAN },
    { re: new RegExp(normalizeMiracleArabic("معجز") + String.raw`(?:ين|ون|ه|ها|هم|هن|كم|كن|نا|ك|ي|تي|تما|كما)?(?=\s|$|[،,.;:!؟?()\[\]{}«»"'\-ـ])`), all: [ph("نبوه|نبي|رسول|ايه|ايات|برهان|دليل|خارق|اعجاز|صدق|قران|تنزيل|كلام|علامه|حجه|سلطان")], corpora: NON_QURAN },
    { re: ph("اعجاز") , none: [ph("اعجاز نخل"), ph("اعجاز النخل"), ph("اعجاز نخيل")] },
    { re: ph("خوارق")  }, { re: ph("خارق للعادات") }, { re: ph("خارق العادات") },
    { re: ph("دلائل النبوه") }, { re: ph("دلائل الرساله") }, { re: ph("علامات النبوه") }, { re: ph("علامة النبوه") },
    { re: new RegExp(normalizeMiracleArabic("دلائل") + String.raw`.{0,25}` + normalizeMiracleArabic("نبوه|رساله|صدق|تنزيل|اسلام|حق|محمد")) },
    { re: new RegExp(normalizeMiracleArabic("براهين") + String.raw`.{0,25}` + normalizeMiracleArabic("نبوه|رساله|صدق|اسلام|حق|محمد")) },
    { re: new RegExp(normalizeMiracleArabic("علامات") + String.raw`.{0,15}` + normalizeMiracleArabic("نبوه|رساله|صدق|رسول")) },
    { re: ph("اثبات النبوه") }, { re: ph("تصديق النبوه") }, { re: ph("تحقق النبوه") },
    { re: ph("حجه النبوه") }, { re: ph("براهين علي صدق") },
  ]},
  challenge: { kind: "mention", pats: [
    { re: new RegExp(normalizeMiracleArabic("هاتوا|فاتوا|ائتوا|فلياتوا|ائتوا") + String.raw`.{0,12}` + normalizeMiracleArabic("بسوره|برهانا|بايه|ببرهان|بكتاب|بمثل")) },
    { re: ph("مثل هذا القران") }, { re: ph("مثل قراني") }, { re: ph("لا يأتون بمثل") },
    { re: ph("لا يأتون بمثله") }, { re: ph("اجتمعت الانس والجن") },
    { re: new RegExp(normalizeMiracleArabic("الانس والجن") + String.raw`.{0,20}` + normalizeMiracleArabic("ياتوا|يأتون|ياتون")) },
    { re: ph("يعجزونه") }, { re: ph("اعجزوني") }, { re: ph("اعجزه") , all: [ph("قران"), ph("نبوه"), ph("نبي"), ph("ايه"), ph("ايات")] },
    { re: ph("فلياتوا") }, { re: ph("فليات") , all: [ph("بسوره"), ph("برهانا"), ph("ببرهان"), ph("بمثل"), ph("ايه")] },
    { re: ph("مثله هدي") }, { re: ph("بعشر سور") }, { re: ph("بعشر ايات") },
    { re: ph("من غير مال إن هديتم") }, { re: ph("لو اجتمعت") },
    { re: new RegExp(normalizeMiracleArabic("بشر") + String.raw`.{0,15}` + normalizeMiracleArabic("مثلنا|مثلكم|امثالنا|امثالكم|مثلهم")) },
    { re: new RegExp(normalizeMiracleArabic("ما هو الا بشر|ما هو الا بشرا|انما هو بشر|ليس هو الا بشر|ما هذا الا بشر|ليس هذا الا بشر|ان هذا الا بشر|انه الا بشر|ما انت الا بشر|انما انت بشر|انك الا بشر|جاءنا بشر|ارسل.{0,10}بشرا|بشر من امثالنا|بشر مثلنا|مثلنا من البشر|ليسوا الا بشرا|ما هو الا بشرا")) },
    { re: ph("سحر مبين") , all: [ph("آيه"), ph("ايات"), ph("معجز"), ph("دليل"), ph("برهان"), ph("نبوه"), ph("كفروا"), ph("قالوا")] },
    { re: new RegExp(normalizeMiracleArabic("ليس|ما هذا|ان هذا|انه|ليسوا|ما هو|ما هي") + String.raw`.{0,15}` + normalizeMiracleArabic("سحر")) , all: [ph("ايه"), ph("ايات"), ph("معجز"), ph("دليل"), ph("برهان"), ph("نبوه"), ph("قران")] },
  ]},
  i3jaz: { kind: "mention", pats: [
    { re: ph("اعجاز") , none: [ph("اعجاز نخل"), ph("اعجاز النخل"), ph("اعجاز نخيل")] },
    { re: ph("الاعجاز") }, { re: ph("اعجاز القران") }, { re: ph("اعجاز المصحف") },
    { re: ph("اعجاز الدين") }, { re: ph("اعجاز النبوه") }, { re: ph("اعجاز الرسول") },
    { re: ph("اعجاز المتحدي") }, { re: ph("اعجاز المتحداه") }, { re: ph("اعجاز القرآن") },
  ]},
  karamat: { kind: "mention", pats: [
    { re: new RegExp(normalizeMiracleArabic("كرامه|كرامات") + String.raw`.{0,20}` + normalizeMiracleArabic("ولي|اولياء|صالح|معجز|خارق|قبول|تصديق|امر|كفار|شفاعه|نعمه|ملائكه")) },
    { re: new RegExp(normalizeMiracleArabic("كرامات|كرامه") + String.raw`(?!\s*الله)`), all: [ph("اولياء"), ph("ولي"), ph("صالح"), ph("معجز"), ph("خارق"), ph("تصديق"), ph("امر")] },
  ]},
  unnamed: { kind: "mention", pats: [
    { re: new RegExp(normalizeMiracleArabic("كل نبي|كلما جاء نبي|كل نبياء|كل نبي|كل الانبياء|كل المرسلين|كل رسول|كل رسل|كل نبي") + String.raw`.{0,25}` + normalizeMiracleArabic("ايات|معجز|براهين|دليل|علامات|سلطان|آيه")) },
    { re: new RegExp(normalizeMiracleArabic("ما من نبي|ما من رسول|ما من مرسل|كل نبياء") + String.raw`.{0,25}` + normalizeMiracleArabic("ايات|معجز|براهين|دليل|علامات")) },
    { re: new RegExp(normalizeMiracleArabic("انبياء|الانبياء|الرسل|المرسلون") + String.raw`.{0,15}` + normalizeMiracleArabic("اوتوا ايات|اوتوا آيات|اعطوا ايات|اعطوا آيات|اعطيتهم ايات|اعطيتهم آيات|اوتوا معجز|اوتوا براهين")) },
    { re: ph("ما من نبي إلا") , all: [ph("ايات"), ph("معجز"), ph("دليل"), ph("علامات")] },
  ]},
  "cosmic-signs": { kind: "sign", pats: [
    { re: ph("يسبح له ما في السماوات") }, { re: ph("ومن اياته") }, { re: ph("واياته في") },
    { re: ph("ان في خلق السماوات") }, { re: ph("افلا ينظرون") }, { re: ph("افلا يتفكرون") },
    { re: ph("افلا يتدبرون") }, { re: ph("افلا تنظرون") }, { re: ph("افلا يبصرون") }, { re: ph("افلا تفكرون") },
    { re: ph("الم تر الي") }, { re: ph("الم تر كيف") }, { re: ph("الم تروا") }, { re: ph("اولم ير") }, { re: ph("اولم تر") },
    { re: ph("قل انظروا") }, { re: ph("انظروا الي") }, { re: ph("انظر الي") }, { re: ph("انظروا ماذا") }, { re: ph("انظر ماذا في") },
    { re: new RegExp(normalizeMiracleArabic("وترى|وترون|تري") + String.raw`.{0,30}` + normalizeMiracleArabic("جبال|ارض|سماء|شمس|قمر|نجم|فلك|ماء|بحر|رياح|سحاب|غيم|مطر|نبات|شجر|ازهر|فواكه|حبوب|بهائم|انعام|طيور|اسماك|انسان|خلق|نخل|نار|صخر|حجر")) },
    { re: ph("يسبحون له") }, { re: ph("سبحانه") , all: [ph("ما في السماوات"), ph("في السماوات"), ph("السماوات والارض")] },
    { re: ph("تسبيح") , all: [ph("السماوات"), ph("الارض")] },
    { re: ph("في السماوات والارض") }, { re: ph("في السماوات والأرض") }, { re: ph("ما في السماوات") },
    { re: ph("وما بينهما") , all: [ph("السماوات"), ph("الارض")] }, { re: ph("ايات للمؤمنين") }, { re: ph("ايات للعالمين") },
    { re: ph("له في السماوات") }, { re: ph("في الارض وما بينهما") }, { re: ph("في الارض من آيه") },
    { re: ph("من آيه في") }, { re: ph("ايات في الأرض") }, { re: ph("ربنا ما خلقت هذا باطلا") },
    { re: ph("كيف رفعناها") }, { re: ph("كيف بسطناها") }, { re: ph("كيف خلقنا") }, { re: ph("كيف انزلنا") },
    { re: ph("النعم") , all: [ph("تعدون"), ph("تحصونها"), ph("تحصونها"), ph("يعدون")] },
    { re: ph("اولم ينظروا") }, { re: ph("افلا ينظرون الي") }, { re: ph("افلا يعقلون") , all: [ph("ارض"), ph("سماء"), ph("خلق"), ph("نعم"), ph("ايه"), ph("ايات")] },
    { re: ph("افلا يشكرون") , all: [ph("نعم"), ph("ايه"), ph("ايات"), ph("فضل")] }, { re: ph("افلا يذكرون") , all: [ph("نعم"), ph("ايه"), ph("ايات")] },
    { re: ph("واتخذوا من دون الله") , all: [ph("ايه"), ph("ايات"), ph("عباد")] },
    { re: ph("في الارض من آية") }, { re: ph("من آية في") },
    { re: ph("السماء") , all: [ph("كيف رفعناها"), ph("كيف بسطناها"), ph("كيف صعد"), ph("بنيناها"), ph("سقفا"), ph("رفعناها")] },
    { re: ph("الارض") , all: [ph("كيف بسطناها"), ph("بسطناها"), ph("ذلولا"), ph("مهدا"), ph("فراشا"), ph("فلقنا"), ph("سبحان الذي بيده ملكوت كل شيء")] },
  ]},
  moon: { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("انشق|انشقاق|انشقت|انشقوا") + String.raw`.{0,15}` + normalizeMiracleArabic("قمر|القمر")) },
    { re: new RegExp(normalizeMiracleArabic("قمر|القمر") + String.raw`.{0,15}` + normalizeMiracleArabic("انشق|انشقاق")) },
    { re: ph("انشقاق القمر") }, { re: ph("شقت القمر") }, { re: ph("اقتربت الساعه وانشق") },
  ]},
  "isra-miraj": { kind: "event", pats: [
    { re: ph("اسري بعبده") }, { re: ph("اسري") , all: [ph("بعبده"), ph("ليلا"), ph("المسجد"), ph("البيت"), ph("سماوات"), ph("سدره"), ph("براق")] },
    { re: ph("ليله اسري") }, { re: ph("ليله بني") }, { re: ph("من المسجد الحرام") , all: [ph("المسجد الاقصي"), ph("ليلا"), ph("بعبده"), ph("اسري")] },
    { re: ph("المسجد الاقصي") , all: [ph("الحرم"), ph("اسري"), ph("بعبده"), ph("ليلا")] },
    { re: ph("البيت المعمور") }, { re: ph("سدرة المنتهي") }, { re: ph("سدره المنتهي") },
    { re: ph("عند سدره") , all: [ph("المنتهي"), ph("ما زاغ"), ph("ما طغي"), ph("راي")] },
    { re: ph("النجم اذا هوي") }, { re: ph("ما كذب الفؤاد") }, { re: ph("قاب قوسين") },
    { re: ph("ادني") , all: [ph("قاب قوسين"), ph("النجم"), ph("سماوات")] },
    { re: ph("ما زاغ البصر") }, { re: ph("ما طغي") , all: [ph("البصر"), ph("راي"), ph("ايات"), ph("ربه")] },
    { re: ph("راي من ايات ربه الكبري") }, { re: ph("فراي من ايات") , all: [ph("ربه"), ph("الكبري")] },
    { re: ph("لا يغشيه") , all: [ph("سماوات"), ph("ايات"), ph("راي")] }, { re: ph("لغشيه") , all: [ph("سماوات"), ph("ايات")] },
    { re: ph("البراق") }, { re: ph("فرائض") , all: [ph("خمسه"), ph("الصلوه"), ph("الصلوات"), ph("الصلوات")] },
    { re: new RegExp(normalizeMiracleArabic("فرض|فرائض|فرضت") + String.raw`.{0,15}` + normalizeMiracleArabic("خمسه|الصلوه|الصلوات|خمسا")) , all: [ph("ليله"), ph("اسري"), ph("براق"), ph("سماوات"), ph("نبي"), ph("رسول")] },
    { re: ph("السبع اطباق") }, { re: ph("اطباق") , all: [ph("سماوات"), ph("سما"), ph("براق"), ph("بيت"), ph("فرائض"), ph("ليله")] },
    { re: ph("عرج بي") }, { re: ph("صعد بي") }, { re: new RegExp(normalizeMiracleArabic("صعد|عرج|صعدت|عرجت") + String.raw`.{0,15}` + normalizeMiracleArabic("بي|سماوات|سبع|بيت معمر|براق|سدره")) , all: [ph("ليله"), ph("نبي"), ph("رسول"), ph("الله"), ph("بعبده")] },
    { re: ph("ففرض علينا الصلاه") }, { re: ph("فرض علينا الصلاه") }, { re: ph("فرضت الصلاه") },
    { re: ph("ليله بني") }, { re: ph("رمي الجمرات") }, { re: ph("الجمرات") , all: [ph("ليله"), ph("براق"), ph("اسري")] },
    { re: ph("شجرة الرضوان") }, { re: ph("الشجره") , all: [ph("الرضوان"), ph("بيعه"), ph("الحديبيه")] },
  ]},
  descent: { kind: "event", pats: [
    { re: ph("متوفك ورافعك") }, { re: ph("رافعك الي") }, { re: ph("ليؤمنن به قبل موته") },
    { re: ph("قبل موته") , all: [ph("عيسي"), ph("ليؤمنن"), ph("اهل الكتاب")] },
    { re: ph("عيسي ينزل") }, { re: ph("نزول عيسي") }, { re: ph("عيسي بن مريم ينزل") },
    { re: ph("يحكم عيسي") }, { re: ph("يرفعه الله الي") }, { re: ph("عيسي") , all: [ph("ينزل"), ph("نزول")] },
    { re: ph("نزول") , all: [ph("عيسي"), ph("المسيح")] }, { re: new RegExp(normalizeMiracleArabic("عيسي|المسيح") + String.raw`.{0,20}` + normalizeMiracleArabic("ينزل|نزول|يحكم")) },
  ]},
  staff: { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("عصا|عصي|عصاه|عصاي|عصوا|عصيه") + String.raw`.{0,30}` + normalizeMiracleArabic("ثعبان|حيه|بيضاء|مبين|تنساب|انقلبت|اذا|فاذا|موسي|مصر|فرعون|سحر|سحره|انسل|تلقون|تفعلون|تفعل|تلقف|مصر|آيه|ايات|رب|بني اسراييل")) },
    { re: new RegExp(normalizeMiracleArabic("ثعبان|حيه|بيضاء") + String.raw`.{0,20}` + normalizeMiracleArabic("عصا|عصي|عصاه")) },
    { re: ph("فاذا هي ثعبان") }, { re: ph("فاذا هي حيه") }, { re: ph("فاذا هي بيضاء") },
    { re: ph("بيضاء للناظرين") }, { re: ph("بيضاء من الضياء") }, { re: ph("يد بيضاء") }, { re: ph("يدا بيضاء") },
    { re: ph("انقلبت عصاي") }, { re: ph("انقلبت عصا") }, { re: ph("تنساب") , all: [ph("عصا"), ph("موسي")] },
    { re: new RegExp(normalizeMiracleArabic("عصا|عصي") + String.raw`.{0,10}` + normalizeMiracleArabic("موسي|مصر|فرعون|سحر|سحرة")) },
    { re: ph("القي السحره عصيهم") }, { re: ph("القي عصاه") , all: [ph("ثعبان"), ph("حيه"), ph("بيضاء"), ph("مبين"), ph("موسي")] },
    { re: ph("عصاه") , all: [ph("ثعبان"), ph("حيه"), ph("بيضاء"), ph("تنساب"), ph("انقلبت")] },
  ]},
  sea: { kind: "event", pats: [
    { re: ph("اقصم به البحر") }, { re: ph("فلقنا له البحر") }, { re: ph("لقينا له البحر") },
    { re: ph("اضرب بعصاك البحر") }, { re: ph("ارفع عصاك") , all: [ph("البحر"), ph("موسي")] },
    { re: ph("شقنا لك البحر") }, { re: ph("شقنا عنك غمك") }, { re: ph("فلقنا لك") , all: [ph("البحر")] },
    { re: new RegExp(normalizeMiracleArabic("بحر") + String.raw`.{0,15}` + normalizeMiracleArabic("فلق|شق|نصفي|فريقين|فريق")) },
    { re: new RegExp(normalizeMiracleArabic("فريقين|نصفي البحر|علي الجانبين|سلك الطريق|الطريق") + String.raw`.{0,15}` + normalizeMiracleArabic("بحر|فريق|اليم")) },
    { re: ph("بحر ميته") }, { re: ph("بحر ميت") }, { re: new RegExp(normalizeMiracleArabic("عصاك|عصا") + String.raw`.{0,10}` + normalizeMiracleArabic("بحر")) },
    { re: new RegExp(normalizeMiracleArabic("موسي") + String.raw`.{0,20}` + normalizeMiracleArabic("بحر|يم|فلق|شق")) },
    { re: new RegExp(normalizeMiracleArabic("بحر|يم") + String.raw`.{0,15}` + normalizeMiracleArabic("موسي|فلق|شق|عصا|اضرب|ارفع")) },
    { re: ph("نجيناكم من آل فرعون") }, { re: ph("نجيناكم") , all: [ph("فرعون"), ph("البحر"), ph("يم")] },
    { re: ph("فنجيناكم واغرقنا") }, { re: ph("اغرقنا آل فرعون") },
    { re: ph("فجعلناها كالي اليم الضحل") }, { re: ph("كالي اليم الضحل") }, { re: ph("يم الضحل") }, { re: ph("اليم الضحل") },
    { re: new RegExp(normalizeMiracleArabic("فصلنا بكم البحر|فجعلنا البحر|شقنا عنك") + String.raw`.{0,15}` + normalizeMiracleArabic("موسي|بني اسراييل|عصا|بحر")) },
  ]},
  provision: { kind: "event", pats: [
    { re: ph("المن والسلوي") }, { re: ph("والسلوي") }, { re: ph("المن") , all: [ph("بني اسراييل"), ph("موسي"), ph("قومي"), ph("الطير"), ph("السلوي"), ph("النعمه"), ph("انزلنا عليكم"), ph("نبيهم")] },
    { re: ph("حبز") }, { re: ph("اثني عشر عينا") }, { re: ph("اثنا عشر عينا") }, { re: ph("عينا انبعث") },
    { re: ph("من النخل") }, { re: ph("تعبروها") }, { re: ph("الطير الحبز") }, { re: ph("سلوي") },
    { re: new RegExp(normalizeMiracleArabic("طائرا|طير|الطير") + String.raw`.{0,15}` + normalizeMiracleArabic("تحوم|حبز|يمد|طعام|رزق|يأكلون|تاكل")) },
    { re: ph("من كل شيء لم يكونا يملك") }, { re: new RegExp(normalizeMiracleArabic("انزلنا عليكم") + String.raw`.{0,25}` + normalizeMiracleArabic("المن|السلوي|الطير|العيون")) },
    { re: new RegExp(normalizeMiracleArabic("بني اسراييل|موسي|قومي|نبيهم") + String.raw`.{0,30}` + normalizeMiracleArabic("المن|السلوي|الطير|العيون|النعمه")) },
    { re: ph("زمزم") }, { re: ph("زمزمه") }, { re: ph("بئر زمزم") }, { re: ph("زمزم") , all: [ph("ماء"), ph("بئر")] },
    { re: ph("عيونا") , all: [ph("انبعت|تنبعث|نجري|اثني عشر|اثنا عشر|بني اسراييل")] },
  ]},
  fire: { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("بريدا|بردا|بردا و سلاما|بريد[اوه]") + String.raw`.{0,15}` + normalizeMiracleArabic("ابراهيم|نار|احرق|سلاما|نجا|نعمه|بارد")) },
    { re: new RegExp(normalizeMiracleArabic("ابراهيم|نار") + String.raw`.{0,25}` + normalizeMiracleArabic("بريدا|بردا|بردا و سلاما|احرق|نجا|سلاما|رمى|ارمي")) },
    { re: ph("احرقوه") }, { re: ph("احموه") }, { re: ph("رمينا عليك") }, { re: ph("ارمينا عليك") },
    { re: ph("الرميم") , all: [ph("ابراهيم"), ph("نار")] }, { re: ph("النار") , all: [ph("ابراهيم"), ph("احرق"), ph("رمى"), ph("بارد"), ph("سلاما")] },
    { re: ph("نار") , all: [ph("ابراهيم"), ph("احرقوه"), ph("بريدا"), ph("بردا")] },
    { re: new RegExp(normalizeMiracleArabic("نار|نارا|نارا") + String.raw`.{0,25}` + normalizeMiracleArabic("ابراهيم|احرق|بردا|سلاما|نجا|رمى")) },
    { re: ph("بريد") , all: [ph("ابراهيم"), ph("نار"), ph("بردا")] },
    { re: ph("ناركم") , all: [ph("ابراهيم"), ph("بارد"), ph("سلاما")] },
  ]},
  "she-camel": { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("ناقه") + String.raw`.{0,25}` + normalizeMiracleArabic("صالح|ثمود|اعور|عقر|نحر|ذبح|يوم معلوم|احمار|اشتر|عطش|شرب|رعي|اولادها|اقبالها|انكسار|كليها|عجوز|امها|ثلث ايام|يومين|الله|معبود|اله|ناقه")) },
    { re: new RegExp(normalizeMiracleArabic("صالح|ثمود") + String.raw`.{0,45}` + normalizeMiracleArabic("ناقه")) },
    { re: ph("ناقه الله") }, { re: new RegExp(normalizeMiracleArabic("الله") + String.raw`.{0,10}` + normalizeMiracleArabic("ناقه")) },
    { re: ph("نحروها") }, { re: ph("عقروها") }, { re: ph("اعوروا") , all: [ph("ناقه")] },
    { re: ph("يوم معلوم") , all: [ph("ناقه")] }, { re: new RegExp(normalizeMiracleArabic("ثلاث ايام|يومين|ثلاثه ايام") + String.raw`.{0,10}` + normalizeMiracleArabic("ناقه")) },
    { re: ph("ناقه") , all: [ph("صالح"), ph("ثمود"), ph("اعور"), ph("عقر"), ph("يوم معلوم")] },
    { re: ph("انكسار") , all: [ph("ناقه")] }, { re: ph("عقروا ناقة") }, { re: ph("اعقروا ناقة") },
  ]},
  "ad-destruction": { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("بني عاد|قوم عاد|اخا عاد|اخاهم عاد|عاد الاولى|عاد الاولي|الارم|ارمات|الارمين|بني ارم|قوم ارم|اخا ارم|اخاهم ارم") + String.raw`.{0,35}` + normalizeMiracleArabic("ريح|هلك|دمر|عذاب|صيحه|صرصر|اخذ|مطر|مهلك|قوم|ناس|جاثمين|كالبنيان")) },
    { re: new RegExp(normalizeMiracleArabic("ريح|هلك|دمر|عذاب|صيحه|صرصر|اخذ|مطر|مهلك") + String.raw`.{0,35}` + normalizeMiracleArabic("عاد|ارم|اريم|ارمات|الارم|الارمين|ارمات|بني عاد|اخا عاد|اخاهم عاد")) },
    { re: ph("ارسلنا عليهم ريحا صرصر") }, { re: ph("ارسلنا عليهم الريح") , all: [ph("عاد|ارم|اريم|ارمات|قوم|ناس|هود")] },
    { re: new RegExp(normalizeMiracleArabic("ريح|هلك|دمر|عذاب|اخذ|مطر|مهلك") + String.raw`.{0,30}` + normalizeMiracleArabic("ارم|اريم|ارمات|الارمين|بني ارم|قوم ارم|اخاهم")) },
    { re: ph("هود") , all: [ph("عاد"), ph("ارم"), ph("اريم"), ph("ارمات"), ph("ريح"), ph("هلك"), ph("دمر"), ph("عذاب")] },
    { re: ph("مهلك") , all: [ph("عاد"), ph("ارم"), ph("اريم"), ph("ارمات")] }, { re: ph("مهلكين") , all: [ph("عاد"), ph("ارم"), ph("اريم"), ph("ارمات")] },
    { re: ph("فإذا هم كسف مدموس") }, { re: ph("كسف مدموس") , all: [ph("عاد"), ph("ارم"), ph("اريم"), ph("ارمات")] },
    { re: ph("كأنهم أعجاز نخل") }, { re: ph("كأنهم أعجاز نخل منقعر") },
  ]},
  "thamud-destruction": { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("ثمود|صالح|قريه ثمود|اخا ثمود|اخاهم ثمود|بني ثمود|قوم ثمود") + String.raw`.{0,45}` + normalizeMiracleArabic("ريح|هلك|دمر|عذاب|صيحه|اخذ|مطر|مهلك|جاثمين|كالبنيان|يوم الظله|ناقه|عقر|اعقر|ذبح|نحر|يوم معلوم|ثلاث ايام|يومين")) },
    { re: new RegExp(normalizeMiracleArabic("ريح|هلك|دمر|عذاب|صيحه|اخذ|مطر|مهلك|جاثمين|كالبنيان|يوم الظله|ناقه|عقر|اعقر|ذبح|نحر|يوم معلوم|ثلاث ايام|يومين") + String.raw`.{0,45}` + normalizeMiracleArabic("ثمود|صالح|قريه ثمود|اخا ثمود|اخاهم ثمود|بني ثمود|قوم ثمود")) },
    { re: ph("ارسلنا عليهم صيحه") }, { re: ph("ارسلنا عليهم الريح") , all: [ph("ثمود"), ph("صالح")] },
    { re: ph("فأهلكوا بريح") , all: [ph("ثمود"), ph("صالح")] }, { re: ph("اهلكوا بريح") , all: [ph("ثمود"), ph("صالح")] },
    { re: ph("يوم الظله") , all: [ph("ثمود"), ph("صالح")] }, { re: ph("يوم الظله") },
    { re: ph("اخذتكم الصاعقه") }, { re: ph("الصاعقه") , all: [ph("ثمود"), ph("صالح")] },
    { re: ph("فإذا هم جاثمين") , all: [ph("ثمود"), ph("صالح")] }, { re: ph("كالبنيان المرصوص") , all: [ph("ثمود"), ph("صالح")] },
  ]},
  "madyan-destruction": { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("مدين|المدين|مدائن|شعيب|اخا مدين|اخاهم مدين|قوم مدين|بني مدين|رؤساء قوم لوط") + String.raw`.{0,45}` + normalizeMiracleArabic("ريح|هلك|دمر|عذاب|صيحه|اخذ|مطر|مهلك|حجاره|طين|سجيل|جاثمين|كالبنيان|قوم|ناس")) },
    { re: new RegExp(normalizeMiracleArabic("ريح|هلك|دمر|عذاب|صيحه|اخذ|مطر|مهلك|حجاره|طين|سجيل|جاثمين|كالبنيان") + String.raw`.{0,45}` + normalizeMiracleArabic("مدين|المدين|مدائن|شعيب|اخا مدين|اخاهم مدين|قوم مدين|بني مدين|رؤساء قوم لوط")) },
    { re: ph("ارسلنا عليهم") , all: [ph("مدين"), ph("شعيب"), ph("حجاره"), ph("طين"), ph("سجيل"), ph("مطر"), ph("ريح")] },
    { re: ph("امطرنا عليهم") , all: [ph("مدين"), ph("شعيب"), ph("حجاره"), ph("طين"), ph("سجيل")] },
    { re: ph("ارسلنا عليهم حجاره") , all: [ph("طين"), ph("سجيل"), ph("مدين"), ph("شعيب")] },
    { re: ph("امطرنا عليهم حجاره") , all: [ph("طين"), ph("سجيل"), ph("مدين"), ph("شعيب")] },
  ]},
  "lut-destruction": { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("لوط|قوم لوط|بني لوط|اهل لوط|القرية|القرية التي امطرنا|غشيه|مطر") + String.raw`.{0,45}` + normalizeMiracleArabic("حجاره|طين|سجيل|امطرنا|مطر|هلك|دمر|عذاب|اخذ|صيحه|جاثمين|كالبنيان|قوم|ناس|فجار|كفار|مجرمين") ) },
    { re: new RegExp(normalizeMiracleArabic("حجاره|طين|سجيل|امطرنا|مطر|هلك|دمر|عذاب|اخذ|صيحه|جاثمين|كالبنيان") + String.raw`.{0,45}` + normalizeMiracleArabic("لوط|قوم لوط|بني لوط|اهل لوط|القرية")) },
    { re: ph("امطرنا عليهم") , all: [ph("لوط"), ph("حجاره"), ph("طين"), ph("سجيل")] },
    { re: ph("ارسلنا عليهم") , all: [ph("لوط"), ph("حجاره"), ph("طين"), ph("سجيل")] },
    { re: ph("حجاره من طين"), all: [ph("لوط"), ph("مطر"), ph("امطرنا")] }, { re: ph("طين") , all: [ph("لوط"), ph("حجاره")] },
    { re: ph("فإذا هم جاثمين") , all: [ph("لوط")] }, { re: ph("كالبنيان المرصوص") , all: [ph("لوط")] },
  ]},
  "pharaoh-destruction": { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("فرعون|آل فرعون|موسي|بني اسراييل") + String.raw`.{0,35}` + normalizeMiracleArabic("اغرق|اغرقنا|الاغراق|فاغرق|هلك|دمر|عذاب|اخذ|نجا|نجينا|يم|البحر|جاثمين")) },
    { re: new RegExp(normalizeMiracleArabic("اغرق|اغرقنا|الاغراق|فاغرق|هلك|دمر|عذاب|اخذ|نجا|نجينا|يم|البحر|جاثمين") + String.raw`.{0,35}` + normalizeMiracleArabic("فرعون|آل فرعون|موسي|بني اسراييل")) },
    { re: ph("أغرقنا آل فرعون") }, { re: ph("اغرقنا آل فرعون") }, { re: ph("وأغرقناهم") , all: [ph("فرعون"), ph("موسي"), ph("بني اسراييل")] },
    { re: ph("فأغرقناه") , all: [ph("فرعون"), ph("موسي")] }, { re: ph("وأغرقنا آخرين") },
    { re: ph("نجيناكم من آل فرعون") }, { re: ph("نجيناكم") , all: [ph("فرعون")] },
    { re: ph("وأغرقناهم") , all: [ph("فرعون"), ph("موسي")] }, { re: ph("وأغرقنا") , all: [ph("فرعون", "موس", "بني اسراييل")] },
  ]},
  "generic-destruction": { kind: "event", pats: [
    { re: ph("فأخذهم العذاب") }, { re: ph("فأخذهم الله") , all: [ph("كذبوا بآياتنا")] },
    { re: ph("فإذا هم جاثمين") }, { re: ph("كالبنيان المرصوص") },
    { re: ph("فإذا هم صرعى") }, { re: ph("صيرى") }, { re: ph("ساطع") }, { re: ph("صاعقه") , all: [ph("ثمود"), ph("صالح"), ph("اخذتكم")] },
    { re: ph("يوم الصيحه") , all: [ph("ثمود"), ph("صالح"), ph("اخذهم"), ph("مرسلوا")] },
    { re: ph("اخذهم الصيحه") }, { re: ph("اخذتهم الصيحه") }, { re: ph("اخذتكم الصاعقه") },
    { re: ph("فإذا هم") , all: [ph("جاثمين"), ph("صرعى"), ph("كا"), ph("صيحا")] },
    { re: ph("فأصبحوا في دارهم جاثمين") }, { re: ph("فإذا هم") , all: [ph("في دارهم")] },
    { re: new RegExp(normalizeMiracleArabic("ارسلنا عليهم|ارسلنا علي|أرسلنا عليهم") + String.raw`.{0,20}` + normalizeMiracleArabic("ريح|صيحه|حجاره|عذاب|مطر|مهلك")) },
    { re: new RegExp(normalizeMiracleArabic("اهلكوا|أهلكوا") + String.raw`.{0,15}` + normalizeMiracleArabic("ريح|صيحه|عذاب|حجاره|مطر")) },
    { re: ph("عذاب") , all: [ph("قوم")] , none: [ph("يوم")] },
  ]},
  elephant: { kind: "event", pats: [
    { re: ph("الفيل") }, { re: ph("اصحاب الفيل") }, { re: ph("ابابيل") }, { re: ph("تردم") , all: [ph("الفيل")] },
    { re: ph("الم تر كيف فعل ربك بأصحاب الفيل") }, { re: ph("ألم تر كيف فعل ربك بأصحاب الفيل") },
    { re: ph("الطير الابابيل") }, { re: ph("ابابيل") , all: [ph("طير")] },
  ]},
  fish: { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("حوت") + String.raw`.{0,25}` + normalizeMiracleArabic("ذي النون|ذو النون|صاحب|تلقمه|بطن|يم|خضر|بحر|سمك|حبش|اليم|يونس|صاحب")) },
    { re: ph("ذي النون") }, { re: ph("ذو النون") }, { re: ph("صاحب الحوت") }, { re: ph("تلقمه الحوت") },
    { re: ph("بطن الحوت") }, { re: ph("القطرس") }, { re: ph("حبش") , all: [ph("الحوت"), ph("صاحب")] },
    { re: new RegExp(normalizeMiracleArabic("اليم|البحر|الحوت") + String.raw`.{0,15}` + normalizeMiracleArabic("حوت|ذو النون|ذي النون|يونس")) },
    { re: new RegExp(normalizeMiracleArabic("يونس") + String.raw`.{0,25}` + normalizeMiracleArabic("حوت|يم|بحر|صاحب|ذو النون|ذي النون")) },
    { re: ph("السمكه") , all: [ph("خضر"), ph("عبدنا")] }, { re: ph("سمكه") , all: [ph("خضر"), ph("عبدنا", "الحوت")] },
    { re: ph("السمك") , all: [ph("خضر"), ph("عبدنا")] }, { re: new RegExp(normalizeMiracleArabic("سمك|سمكه") + String.raw`.{0,20}` + normalizeMiracleArabic("خضر|عبدنا|الحوت|صاحب")) },
  ]},
  ark: { kind: "event", pats: [
    { re: ph("اصنع الفلك") }, { re: ph("من كل زوجين") }, { re: ph("الطوفان") }, { re: ph("طوفان") },
    { re: new RegExp(normalizeMiracleArabic("فلك") + String.raw`.{0,25}` + normalizeMiracleArabic("نوح|اصنع|امرنا|اصنعها|جعلنا|ركب|الجبال|الموج|امواج|طوفان|غمر|زوجين|من كل")) },
    { re: new RegExp(normalizeMiracleArabic("نوح|طوفان|الموج|الامواج|غمر") + String.raw`.{0,25}` + normalizeMiracleArabic("فلك|اصنع|زوجين|طوفان")) },
    { re: ph("فاغسلوا") , all: [ph("فلك"), ph("نوح")] }, { re: ph("تنجينا") , all: [ph("فلك"), ph("نوح", "طوفان")] },
    { re: ph("غرقت") , all: [ph("فلك"), ph("نوح", "طوفان", "مطر")] }, { re: ph("غمرهم") , all: [ph("فلك"), ph("نوح", "طوفان")] },
    { re: ph("الموج") , all: [ph("فلك"), ph("نوح", "طوفان")] }, { re: ph("الامواج") , all: [ph("فلك"), ph("نوح", "طوفان")] },
    { re: ph("فلك") , all: [ph("نوح"), ph("طوفان")] },
  ]},
  basket: { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("التابوت") + String.raw`.{0,20}` + normalizeMiracleArabic("اليم|النيل|الماء|فلق|جزء|موضع|ارض|قريه|موسي|اطفاله|صبي|ولد")) },
    { re: new RegExp(normalizeMiracleArabic("تابوت") + String.raw`.{0,20}` + normalizeMiracleArabic("اليم|النيل|الماء|فلق|جزء|موضع|ارض|قريه|موسي|اطفاله|صبي|ولد")) },
    { re: ph("ألقيته في التابوت") }, { re: ph("القيته في التابوت") }, { re: ph("فالتقطه") , all: [ph("التابوت"), ph("ام"), ph("موسي")] },
    { re: ph("كفلته") , all: [ph("التابوت")] }, { re: ph("كفلته") , all: [ph("موس", "صبي")] },
    { re: ph("التابوت") , all: [ph("موس|اطفاله|صبي|اليم|النيل|الماء")] },
  ]},
  healing: { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("ابري|ابرا|شفا|اشفاء|احيا|احياء|موتي|موتى|اعم|اكه|اكب") + String.raw`.{0,25}` + normalizeMiracleArabic("الكمه|ابريص|موتي|موتى|باذن الله|اذن الله|بإذن الله|الابريص|باذن")) },
    { re: new RegExp(normalizeMiracleArabic("ابري|ابريص") + String.raw`.{0,15}` + normalizeMiracleArabic("الكمه|ابريص|مريض|الابريص")) },
    { re: ph("حياه") , all: [ph("الابريص"), ph("باذن")] }, { re: ph("احيي") , all: [ph("موتي|موتى") ] },
    { re: ph("احياء") , all: [ph("موتي|موتى") ] }, { re: ph("الموتي") , all: [ph("باذن الله|اذن الله|بإذن الله|احيا|احيي|عيسي") ] },
    { re: new RegExp(normalizeMiracleArabic("عيسي") + String.raw`.{0,40}` + normalizeMiracleArabic("يموت|يحيي|يشفي|يبري|موتي|موتى|كمه|ابريص|الابريص")) },
    { re: new RegExp(normalizeMiracleArabic("باذن الله|اذن الله") + String.raw`.{0,15}` + normalizeMiracleArabic("موتي|موتى|احيا|احيي|يبري|يشفي")) },
    { re: ph("اشفاء") , all: [ph("ابريص|الكمه|مريض|الابريص")] }, { re: new RegExp(normalizeMiracleArabic("يشفي|يبري") + String.raw`.{0,15}` + normalizeMiracleArabic("الابريص|الكمه|مريض|عيسي")) },
    { re: ph("شفي") , all: [ph("مريض|ابريص|الكمه|عيسي")] }, { re: ph("برئ") , all: [ph("الابريص|الكمه|مريض")] },
    { re: ph("ابري") , all: [ph("مريض|الكمه|ابريص")] }, { re: ph("اكه") , all: [ph("مريض|الكمه|ابريص")] },
    { re: new RegExp(normalizeMiracleArabic("ايوب") + String.raw`.{0,40}` + normalizeMiracleArabic("اغسل|يدك|ضغثا|بركه|كفه|ماء|بئر|نبع|مريض|برئ")) },
    { re: ph("ضغثا") }, { re: ph("وامسح برجلك") }, { re: new RegExp(normalizeMiracleArabic("بركه|البركه|كفه|كفاه") + String.raw`.{0,15}` + normalizeMiracleArabic("ايوب")) },
    { re: new RegExp(normalizeMiracleArabic("ماء|بئر|نبع") + String.raw`.{0,15}` + normalizeMiracleArabic("بارد|ايوب|بركه")) },
  ]},
  "clay-bird": { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("طير|طيرا") + String.raw`.{0,30}` + normalizeMiracleArabic("طين|خلق|صوره|هيئه|نفخ|من الطين")) },
    { re: ph("خلق من الطين") }, { re: new RegExp(normalizeMiracleArabic("من الطين") + String.raw`.{0,20}` + normalizeMiracleArabic("طير|طيرا|نفخ|صوره")) },
    { re: ph("صوره الطير") }, { re: ph("طيرا") , all: [ph("الطين")] }, { re: ph("كهيئه الطير") },
    { re: ph("هيئه الطير") }, { re: ph("من صوره الطير") }, { re: new RegExp(normalizeMiracleArabic("من طين") + String.raw`.{0,10}` + normalizeMiracleArabic("طير|طيرا")) },
    { re: new RegExp(normalizeMiracleArabic("طين") + String.raw`.{0,15}` + normalizeMiracleArabic("طير|طيرا")) },
    { re: new RegExp(normalizeMiracleArabic("خلق") + String.raw`.{0,15}` + normalizeMiracleArabic("طير|طيرا")) },
    { re: new RegExp(normalizeMiracleArabic("طير|طيرا") + String.raw`.{0,15}` + normalizeMiracleArabic("خلق|باذن")) , all: [ph("طين|صوره|هيئه|نفخ|باذن")] },
  ]},
  cradle: { kind: "event", pats: [
    { re: ph("في المهد") , all: [ph("كلام|صغير|طفل|عيسي|يحيي|صبي|تكلم|انما انا")] },
    { re: ph("كلاما") , all: [ph("مهد|صغير|طفل|عيسي|يحيي|صبي")] }, { re: ph("كلام") , all: [ph("مهد|صغير|طفل|عيسي|يحيي|صبي")] },
    { re: ph("مهد") , all: [ph("كلام|صغير|طفل|عيسي|يحيي|صبي|ولدت")] }, { re: ph("المهد") , all: [ph("كلام|صغير|طفل|عيسي|يحيي|صبي|ولدت")] },
    { re: new RegExp(normalizeMiracleArabic("يا مريم|فاشارت|فأشارت|فأشر|اشارت") + String.raw`.{0,30}` + normalizeMiracleArabic("كلام|مهد|صبي|صغير|طفل")) },
    { re: ph("فكلم الناس في المهد") }, { re: ph("كلم الناس في المهد") }, { re: ph("في المهد وكهلا") },
    { re: ph("ولدت") , all: [ph("مهد|كلام|عيسي|يحيي|صبي|صغير|طفل")] },
    { re: new RegExp(normalizeMiracleArabic("يوم يولد|يوم اموت|يوم يبعث حيا") + String.raw`.{0,15}` + normalizeMiracleArabic("سلام|كلام|عيسي|يحيي|صبي|مهد")) },
  ]},
  table: { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("مائده") + String.raw`.{0,40}` + normalizeMiracleArabic("سماء|انزل|تنزل|رسل|مريم|عيسي|قومي|اكرمنا|السماء|الارض|ربك|ضيافه")) },
    { re: new RegExp(normalizeMiracleArabic("انزل|تنزل|أرسل") + String.raw`.{0,20}` + normalizeMiracleArabic("مائده")) },
    { re: ph("مائده من السماء") }, { re: ph("يا مريم") , all: [ph("مائده|قومي|عيسي|رسل")] },
    { re: ph("اكرمنا") , all: [ph("ضيافه|مائده|قومي|عيسي")] }, { re: new RegExp(normalizeMiracleArabic("قومي") + String.raw`.{0,30}` + normalizeMiracleArabic("مائده|عيسي|مريم")) },
    { re: new RegExp(normalizeMiracleArabic("مائده") + String.raw`.{0,15}` + normalizeMiracleArabic("قومي|عيسي|مريم|رسل")) },
    { re: ph("هل يقدر ربك") , all: [ph("مائده|ينزل|سماء")] }, { re: ph("ينزل علينا مائده") },
    { re: new RegExp(normalizeMiracleArabic("مائده") + String.raw`.{0,15}` + normalizeMiracleArabic("ربك|ربنا")) },
  ]},
  sulayman: { kind: "event", pats: [
    { re: ph("هدهد") }, { re: ph("بلقيس") }, { re: ph("عرش") , all: [ph("بلقيس|سبا|سلطان|حمل|ريح|العرش|سليمان")] },
    { re: new RegExp(normalizeMiracleArabic("ريح|الريح") + String.raw`.{0,20}` + normalizeMiracleArabic("عاصف|سخرت|حمل|سليمان|بغت|مرتبه|تجري|مسخره|عنده")) },
    { re: new RegExp(normalizeMiracleArabic("سبا|بلقيس|ملكة سبا") + String.raw`.{0,20}` + normalizeMiracleArabic("عرش|هدهد|سليمان")) },
    { re: new RegExp(normalizeMiracleArabic("سليمان|سليمن") + String.raw`.{0,35}` + normalizeMiracleArabic("عرش|ريح|هدهد|بلقيس|سبا|طير|حشر|جنود|ملكوت")) },
    { re: new RegExp(normalizeMiracleArabic("عرش|هدهد|بلقيس|سبا|حشر|طير") + String.raw`.{0,35}` + normalizeMiracleArabic("سليمان|سليمن")) },
    { re: ph("حشروا لسليمان") }, { re: ph("حشر") , all: [ph("سليمان|سليمن"), ph("طير|جنود|جن")] },
    { re: ph("الطير") , all: [ph("سليمان|سليمن"), ph("حشر|محشورا|مسبحات|يحتفلون")] },
    { re: ph("ريح") , all: [ph("سليمان|سليمن"), ph("تجري|عاصف|سخرت|مسخره|حمل")] },
    { re: ph("سليمان") , all: [ph("تسخير|سخر|ريح|عرش|هدهد|بلقيس")] },
    { re: ph("الريح عاصفه") , all: [ph("سليمان|سليمن")] }, { re: ph("الريح") , all: [ph("سليمان|سليمن")] },
    { re: ph("عرشها") }, { re: ph("بعرشها") }, { re: ph("تأتيك") , all: [ph("بلقيس|عرش")] }, { re: ph("بعرش") , all: [ph("بلقيس|سبا|سليمان|سليمن")] },
    { re: ph("يا ايها الملوك") , all: [ph("بلقيس|سبا|عرش")] }, { re: ph("عرش") , all: [ph("بلقيس")] },
    { re: ph("فقال عودا علي") , all: [ph("بلقيس|هدهد|عرش")] }, { re: ph("اعرف") , all: [ph("بلقيس|هدهد")] },
    { re: ph("اتينا سليمان") , all: [ph("ريح|عرش|هدهد|بلقيس")] }, { re: ph("سبحان الذي سخر لنا هذا") , all: [ph("سليمان|سليمن|ريح|ملكوت")] },
    { re: ph("ملكوت كل شيء") , all: [ph("سليمان|سليمن")] },
  ]},
  dreams: { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("يوسف") + String.raw`.{0,40}` + normalizeMiracleArabic("رؤيا|حلم|تعبير|ملك|سبع|بقر|احلام|حلمه|كوكب|شمس|قمر")) },
    { re: new RegExp(normalizeMiracleArabic("احلام|رؤيا|حلم|تعبير|ملك") + String.raw`.{0,15}` + normalizeMiracleArabic("يوسف")) },
    { re: ph("تعبير الرؤيا") }, { re: ph("تعبير") , all: [ph("رؤيا|احلام|حلم|يوسف|ملك")] },
    { re: ph("الرؤيا") , all: [ph("تعبير|يوسف|ملك|تعبر")] }, { re: ph("تعبر") , all: [ph("رؤيا|احلام|حلم|يوسف")] },
    { re: ph("حلم") , all: [ph("يوسف|مصر|ملك|رؤيا|تعبير|بقر|سنين")] }, { re: ph("رؤيا") , all: [ph("يوسف|ملك|تعبير|تعبر")] },
    { re: ph("سبع سنين") , all: [ph("بقر|زرع|حصاد|يوسف|ملك|تعبير")] }, { re: ph("سبع سنين تزرعون") },
    { re: ph("سبع سنين") , all: [ph("بقر|سنين|تعبير|يوسف")] }, { re: new RegExp(normalizeMiracleArabic("سبع|بقر|سنين") + String.raw`.{0,15}` + normalizeMiracleArabic("بقر|سنين|تعبير|يوسف|ملك")) },
    { re: new RegExp(normalizeMiracleArabic("كوكب|شمس|قمر") + String.raw`.{0,20}` + normalizeMiracleArabic("ساجدين|رأيت|رؤيا|حلم") ) , all: [ph("يوسف")] },
    { re: ph("رأيت أحد عشر كوكبا") }, { re: ph("رأيت") , all: [ph("كوكب|شمس|قمر|سبع|بقر"), ph("يوسف")] },
    { re: ph("الملك") , all: [ph("رؤيا|حلم|تعبير|يوسف|سبع")] },
  ]},
  annunciation: { kind: "event", pats: [
    { re: ph("يا زكريا") }, { re: ph("فان") , all: [ph("يحيي")] }, { re: ph("يحيي") , all: [ph("اسم|بسم|بن|ابن|ولد|غلام|صالح|مبارك|يحيا")] },
    { re: ph("بسم يحيي") }, { re: ph("بقبول حسن") }, { re: ph("فتقبلها ربها") }, { re: ph("ازواجنا وذرياتنا") },
    { re: ph("انا نبشرك") }, { re: ph("يبشرك") , all: [ph("يحيي|الغلام|الولد|صالح|مبارك")] }, { re: ph("محراب") , all: [ph("زكريا|رزق|موسم|مجتمع")] },
    { re: ph("رزق") , all: [ph("موسم|مجتمع|زكريا|محراب")] }, { re: ph("مجتمع") , all: [ph("رزق|موسم|زكريا|محراب")] },
    { re: ph("في المحراب") }, { re: ph("من محزها") }, { re: ph("محزها") }, { re: ph("قد كتب ربك") },
    { re: new RegExp(normalizeMiracleArabic("زكريا|زكريا") + String.raw`.{0,40}` + normalizeMiracleArabic("يحيي|نبشر|بشر|محراب|رزق|موسم|مجتمع|ولد|غلام|صالح")) },
    { re: ph("اصفر") , all: [ph("يدي|اليد|ازار|ازارك|برق|لحم|صبغ|اصفرر|زكريا")] },
    { re: ph("اصفرر") , all: [ph("يدي|اليد|ازار|برق|لحم|صبغ|زكريا")] },
    { re: new RegExp(normalizeMiracleArabic("يدي|اليد|ازار|ازارك|برق|لحم") + String.raw`.{0,15}` + normalizeMiracleArabic("اصفر|اصفرر|صبغ")) , all: [ph("زكريا")] },
    { re: new RegExp(normalizeMiracleArabic("زكريا") + String.raw`.{0,40}` + normalizeMiracleArabic("اصفر|يدي|اليد|برق|ازار|لحم|بني")) },
    { re: ph("يا زكريا") , all: [ph("اصفر|يدي|اليد|برق|ازار|لحم")] },
    { re: ph("فان") , all: [ph("يحيي|اسم|بسم|ولد|غلام|صالح|مبارك")] },
  ]},
  "covenant-ark": { kind: "event", pats: [
    { re: ph("تابوت") , all: [ph("سكينه|من ربكم|ربكم|السكينه")] }, { re: ph("سكينه") , all: [ph("تابوت")] },
    { re: new RegExp(normalizeMiracleArabic("تابوت") + String.raw`.{0,20}` + normalizeMiracleArabic("سكينه|من ربكم|ربكم|السكينه")) },
    { re: ph("فيه سكينه") , all: [ph("تابوت")] }, { re: ph("من ربكم") , all: [ph("تابوت")] },
    { re: ph("طابوت") , all: [ph("سكينه")] },
  ]},
  "prophet-signs": { kind: "event", pats: [
    { re: new RegExp(normalizeMiracleArabic("نبع|الماء") + String.raw`.{0,30}` + normalizeMiracleArabic("اصابع|تحت اصابع|من اصابع|من بين اصابع|اصابع")) },
    { re: ph("نبع الماء") }, { re: ph("الماء ينبع") }, { re: ph("نبع") , all: [ph("اصابع|تحت اصابع|من اصابع|من بين اصابع")] },
    { re: ph("جوامع الكلم") }, { re: ph("كلم") , all: [ph("جوامع")] }, { re: ph("جوامع") , all: [ph("كلم")] },
    { re: new RegExp(normalizeMiracleArabic("بكاء|بكي") + String.raw`.{0,15}` + normalizeMiracleArabic("جذع|الجذع|النخل|صوت|ينوح|نوح")) },
    { re: new RegExp(normalizeMiracleArabic("جذع|الجذع|النخل") + String.raw`.{0,15}` + normalizeMiracleArabic("بكاء|بكي|صوت|ينوح|نوح|بك")) },
    { re: ph("الجذع") , all: [ph("بكاء|بكي|صوت|ينوح|نوح|بك|النخل")] }, { re: ph("جذع") , all: [ph("بكاء|بكي|صوت|ينوح|نوح|بك")] },
    { re: ph("النخل") , all: [ph("بكاء|بكي|جذع|صوت")] }, { re: ph("بك") , all: [ph("جذع|النخل")] },
    { re: ph("كسوف الشمس") }, { re: ph("انكسف") , all: [ph("شمس|قمر|كسوف")] }, { re: ph("كسفت") , all: [ph("شمس|قمر|كسوف")] },
    { re: ph("الكسوف") , all: [ph("شمس|قمر|انكسف|كسفت")] }, { re: ph("خسوف القمر") }, { re: ph("انكسف القمر") },
    { re: ph("صدق الله رسوله الرؤيا") }, { re: ph("الرؤيا بالحق") , all: [ph("صدق|رسوله|الله")] },
    { re: ph("حجاب") , all: [ph("نبي|رسول|معجز|آيه|ايات|خارق")] },
    { re: ph("ثلاث ايام") , all: [ph("ظلام|حجب|نبي|رسول|سخر")] }, { re: ph("ظلام") , all: [ph("ثلاث ايام|حجب|نبي|رسول")] },
    { re: new RegExp(normalizeMiracleArabic("سخر") + String.raw`.{0,15}` + normalizeMiracleArabic("لكم|له|لك")) , all: [ph("نبي|رسول|بني اسراييل|موس|عيسي|لوط|هارون")] },
    { re: ph("أسر") , all: [ph("لكم|له") , ph("نبي|رسول")] },
  ]},
};

const EXCLUDE_WORKS = new Set<string>();

/** The miracle topics a passage mentions, detected from its own matn (text_search then text). */
/** Vocabulary that marks a passage as *about* miracles in the general book corpus: the miracle
 * nouns and the proof-of-prophethood lexicon. Books discussing miracles use it constantly; a
 * random book that merely mentions «عصا» or «ناقة» does not, so the gate keeps book hits honest. */
const MIRACLE_CONTEXT = /معجز|خارق|اعجاز|خوارق|دلائل|براهين|علامات|اثبات|تصديق|تحقق|حجه|سلطان|خارق للعاد|معجزه|معجزات|دلائل النبوه|علامات النبوه|براهين النبوه|اثبات النبوه|تصديق النبوه/;

export function miracleTopicsOf(n: Node, corpus?: MiracleCorpus): MiracleTopic[] {
  if (n.class !== "passage" || n.stub || MIRACLES_EXCLUDE.has(n.id)) return [];
  const workId = n.data.work as string | undefined;
  if (workId && EXCLUDE_WORKS.has(workId)) return [];
  const resolved = corpus ?? (workId === "work/quran" ? "quran" : "books");
  const isQuran = resolved === "quran";
  const ar = ` ${normalizeMiracleArabic(String(n.data.text_search ?? n.data.text ?? ""))} `;
  // In the general book corpus a miracle topic needs the miracle lexicon somewhere in the passage;
  // the Qur'an, Sunnah and seerah narrate the events themselves and are judged on the patterns.
  if (resolved === "books" && !MIRACLE_CONTEXT.test(ar)) return [];
  const topics = new Set<MiracleTopic>();
  for (const [id, spec] of Object.entries(SPECS) as [MiracleTopic, TopicSpec][]) {
    for (const p of spec.pats) {
      if (p.corpora && !p.corpora.includes(resolved)) continue;
      if (!p.re.test(ar)) continue;
      if (p.all && !p.all.some((g) => g.test(ar))) continue;
      if (p.none && p.none.some((g) => g.test(ar))) continue;
      if (MIRACLE_TOPIC_EXCLUDE.has(`${n.id}:${id}`)) { topics.delete(id); break; }
      topics.add(id);
      break;
    }
  }
  return [...topics];
}

/** The strongest kind among the topics hit: narrated event > cosmic sign > meta mention. */
export function miracleKindOf(n: Node): MiracleKind | null {
  const topics = miracleTopicsOf(n);
  if (!topics.length) return null;
  if (topics.some((t) => MIRACLE_TOPIC_KIND[t] === "event")) return "event";
  if (topics.some((t) => MIRACLE_TOPIC_KIND[t] === "sign")) return "sign";
  return "mention";
}

/** True when the passage's own matn mentions a divine or prophetic miracle. */
export function isMiraclePassage(n: Node): boolean {
  return miracleTopicsOf(n).length > 0;
}

/** Corpus section from the passage's work record (same rule as the other browsers). */
export function miracleCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): MiracleCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: the first `miracles-<section>` tag naming a real section, else `curated`. */
export function miracleTagSection(n: Node): MiracleSection {
  for (const t of n.tags) {
    if (!t.startsWith("miracles-") || t === MIRACLES_TAG) continue;
    const id = t.slice(10);
    if ((MIRACLE_SECTIONS as readonly string[]).includes(id)) return id as MiracleSection;
  }
  return "curated";
}
