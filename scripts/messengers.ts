// The Messengers Browser's shared reads (docs/plan/40-messengers-browser.md): which passage
// records mention the prophets and messengers — by name, by the class terms (الأنبياء، الرسل،
// المرسلون، بعثنا/أرسلنا), or by the canonical mention edges already in the graph — and which
// corpus section each belongs to. Detection runs at build time over the compiled graph, so a
// prophet mention in any harvested book — and in every book harvested later — appears without a
// tagging step. Curated records join through the `messengers-browser` tag instead.
//
// The lexicon is deliberately narrow: unvocalized Arabic makes «يحيي» collide with the verb
// "he gives life", «صالح» is also the ordinary adjective "righteous", «موسي» is inside
// «موسيقى», «داود» inside the collector's name «أبو داود», «عيسى» inside «أبو عيسى», «خضر»
// is the ordinary word "green", «محمد» inside narrator names in isnads, «إسحاق»/«إبراهيم»/
// «سليمان» inside isnad chains, and «ابن آدم» means mankind rather than Adam. Person names are
// therefore matched on the passage matn only (text_search/text, never the isnad-heavy summary or
// the work label), «ابن آدم»/«بني آدم» are stripped before matching, «آ» is preserved so Adam
// (آدم) stays distinct from leather/tawny (أدم), the genuinely ambiguous names are context-gated,
// and MESSENGERS_EXCLUDE / MESSENGER_TOPIC_EXCLUDE are the curated escape hatches for verified
// false positives (whole records and single subject hits such as isnad narrators).
import type { Node } from "./build-graph.js";

export const MESSENGERS_TAG = "messengers-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const MESSENGER_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type MessengerSection = (typeof MESSENGER_SECTIONS)[number];
export type MessengerCorpus = Exclude<MessengerSection, "curated">;

/**
 * The canonical prophet/messenger subjects. This is the browser's subject index: the named
 * prophets and messengers the museum treats as such, plus al-Khidr, whom the tradition places
 * among the prophetic figures. Adjacent people — Maryam, the Pharaohs, Talut, Dhu al-Qarnayn,
 * Luqman, Uzair and the false claimants — are deliberately not subjects; they remain ordinary
 * records and may appear as related links or in their own browsers.
 */
export const MESSENGER_SUBJECTS = [
  "person/adam", "person/nuh", "person/idris", "person/hud", "person/salih", "person/ibrahim",
  "person/ismail", "person/ishaq", "person/yaqub", "person/yusuf", "person/shuayb", "person/ayyub",
  "person/musa", "person/harun", "person/dawud", "person/sulayman", "person/ilyas", "person/al-yasa",
  "person/yunus", "person/zakariyya", "person/yahya", "person/dhu-l-kifl", "person/isa-ibn-maryam",
  "person/muhammad", "person/al-khidr",
] as const;
export type MessengerSubjectId = (typeof MESSENGER_SUBJECTS)[number];
export const MESSENGER_SUBJECT_SET = new Set<string>(MESSENGER_SUBJECTS);

/** Class-level chips for passages that talk about prophets/messengers without naming one. */
export const MESSENGER_GENERIC_TOPICS = ["prophets", "messengers", "sending", "unnamed"] as const;
export type MessengerGenericTopic = (typeof MESSENGER_GENERIC_TOPICS)[number];
export type MessengerTopic = MessengerSubjectId | MessengerGenericTopic;

/** Passage records whose only lexical hit is a known false positive, verified by reading. */
export const MESSENGERS_EXCLUDE = new Set<string>([]);
/** Single-topic exclusions for verified false positives (e.g. a prophet's name inside an isnad). */
export const MESSENGER_TOPIC_EXCLUDE = new Set<string>([
  "passage/bukhari-7517:person/sulayman", // «حدثني سليمان» is the isnad narrator, not Sulayman
  "passage/ibnmajah-3225:person/yunus", // «عن يونس» is the isnad narrator
  "passage/ibnmajah-3225:person/muhammad", // «حدثنا محمد بن يحيى» is the isnad narrator
  "passage/ibnmajah-4299:person/ibrahim", // «حدثنا إبراهيم بن نصر» is the isnad narrator
  "passage/nasai-4359:person/ibrahim", // «إسحاق بن إبراهيم» is the isnad chain
  "passage/nasai-4359:person/ishaq", // «أخبرنا إسحاق بن إبراهيم» is the isnad chain
  "passage/tirmidhi-2088:person/ishaq", // «حدثنا إسحاق بن منصور» is the isnad narrator
  "passage/tirmidhi-3125:person/muhammad", // «عبد العزيز بن محمد» is the isnad narrator
  "passage/bukhari-3547:person/adam", // «أبيض أمهق ولا أدم» is the colour tawny, not Adam
  "passage/arbaun-47:person/adam", // «ما ملأ آدمي» is "my Adamite" (mankind), not the prophet
  "passage/poem-hassan-diwan-law-kunta-min-hashim-musafi-05:person/al-khidr", // «الخضر الجلاعيد» is a tribal name, not al-Khidr
]);

const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;
/** Imlaei-style normalization for matching: hamza seats and final alif/ya unified; «آ» is kept so آدم stays distinct from أدم. */
export function normalizeMessengerArabic(s: string): string {
  return s
    .replace(DIACRITICS, "")
    .replace(/[أإٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي");
}

/** Phrases that mean mankind, not Adam the prophet, removed before person matching. */
const NOT_ADAM = /ابن آدم|بني آدم|ابناء آدم|ذريه آدم|نسل آدم|امتها آدم|نسل آدم|يا ابن آدم/g;
/** The collector's names «أبو داود» and «أبو عيسى» are not the prophets Dawud and Isa. */
const NOT_DAWUD = /ابو داود/g;
const NOT_ISA = /ابو عيسي|ابن عيسي/g;

const BOUNDARY = String.raw`(?=\s|$|[،,.;:!؟?()\[\]{}«»"'\-ـ])`;
/** A token name with clitic prefixes and the common case/number suffixes. */
function tok(name: string, suffix = "(?:ا|ه|ي|هم|هن|كم|كن|نا|ك)?"): RegExp {
  return new RegExp(String.raw`(?:^|\s)[بلوفسك]{0,2}` + name + suffix + BOUNDARY);
}
/** A fixed phrase that must not sit inside a longer word; a leading و/ف/ب/ل/س/ك clitic is allowed (وذا، وابن). */
function phrase(p: string): RegExp {
  const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(String.raw`(?<![ء-ي])[وبلفسكا]{0,2}` + esc + String.raw`(?![ء-ي])`);
}

/** Unambiguous one-token names. Ambiguous ones (صالح، يحيي) are gated below. */
const SUBJECT_PATTERNS: Partial<Record<MessengerSubjectId, RegExp[]>> = {
  "person/adam": [tok("آدم", "(?:ا|ه|هم|هن|كم|نا)?")],
  "person/nuh": [tok("نوح")],
  "person/idris": [tok("ادريس")],
  "person/hud": [tok("هود")],
  "person/ibrahim": [tok("ابراهيم")],
  "person/ismail": [tok("اسماعيل")],
  "person/ishaq": [tok("اسحاق")],
  "person/yaqub": [tok("يعقوب")],
  "person/yusuf": [tok("يوسف")],
  "person/shuayb": [tok("شعيب")],
  "person/ayyub": [tok("ايوب")],
  "person/musa": [tok("موسي")],
  "person/harun": [tok("هارون")],
  "person/dawud": [tok("داود")],
  "person/sulayman": [tok("سليمان")],
  "person/ilyas": [tok("الياس")],
  "person/al-yasa": [tok("اليسع")],
  "person/yunus": [tok("يونس"), phrase("ذا النون"), phrase("ذان النون"), phrase("ذو النون")],
  "person/zakariyya": [tok("زكريا")],
  "person/dhu-l-kifl": [phrase("ذو الكفل"), phrase("ذال كفل"), phrase("ذا الكفل")],
  "person/isa-ibn-maryam": [tok("عيسي"), tok("المسيح"), phrase("ابن مريم"), phrase("عيسي ابن مريم")],
  "person/muhammad": [
    tok("محمد"), phrase("محمد بن عبد الله"), phrase("محمد رسول"), phrase("يا محمد"),
    phrase("خاتم النبيين"), phrase("سيد النبيين"), phrase("خير النبيين"), phrase("سيد المرسلين"),
  ],
  "person/al-khidr": [tok("الخضر"), phrase("عبدنا خضر"), phrase("عبد خضر")],
};

/** «صالح» is a common adjective; it is Salih only beside Thamud or the messenger formula. */
const SALIH_GATES = [
  phrase("اخاهم صالح"), phrase("اخا صالح"), phrase("اخوهم صالح"), phrase("صالحا قال"), phrase("نبي ثمود"),
  phrase("صالح ثمود"), phrase("ثمود صالح"), phrase("صالح النذير"), phrase("يا صالح"), phrase("قوم صالح"),
  phrase("نجينا صالحا"), phrase("صالحا مرسل"), phrase("صالح ابن"),
];
/** «يحيي» is also "he gives life"; it is Yahya only in the annunciation and naming formulas. */
const YAHYA_GATES = [
  phrase("يا يحيي"), phrase("اسمه يحيي"), phrase("بسم يحيي"), phrase("يحيي بن زكريا"), phrase("يحيي ابن زكريا"),
  phrase("يبشرك بيحيي"), phrase("وهبنا له يحيي"), phrase("وزكريا ويحيي"), phrase("ويحيي وعيسي"),
];

const gphrase = (p: string): RegExp => {
  const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(String.raw`(?<![ء-ي])` + esc + String.raw`(?![ء-ي])`);
};
/** Class-level mentions: the prophets/messengers as a group, and the sending formula. */
const GENERIC_PATTERNS: [MessengerGenericTopic, RegExp[]][] = [
  ["prophets", [
    gphrase("الانبياء"), gphrase("الانبيين"), gphrase("انبياء"), gphrase("النبيين"), gphrase("كل نبي"),
    gphrase("كلهم انبياء"), gphrase("سيد الانبياء"), gphrase("خير الانبياء"), gphrase("اول الانبياء"),
    gphrase("عدد الانبياء"), gphrase("انبياء بني اسراييل"), gphrase("انبياء الله"), gphrase("من النبيين"),
    gphrase("من الانبياء"), gphrase("سبعه عشر نبيا"), gphrase("الف نبيا"), gphrase("مائه نبيا"),
  ]],
  ["messengers", [
    gphrase("الرسل"), gphrase("الرسلين"), gphrase("المرسلون"), gphrase("المرسلين"), gphrase("مرسلون"),
    gphrase("مرسلين"), gphrase("كل رسول"), gphrase("سيد المرسلين"), gphrase("ختم الرسل"), gphrase("خاتم الرسل"),
    gphrase("رسل الله"), gphrase("رسل الانبياء"), gphrase("من المرسلين"), gphrase("من الرسل"),
  ]],
  ["sending", [
    gphrase("بعثنا رسلا"), gphrase("بعثنا نبيا"), gphrase("بعثنا مرسلا"), gphrase("بعثنا عبدا"), gphrase("بعثنا فيهم"),
    gphrase("بعثنا الي قوم"), gphrase("بعثنا اليهم"), gphrase("بعثنا اليكم"), gphrase("ارسلنا الي"),
    gphrase("ارسلنا رسولا"), gphrase("ارسلنا نبيا"), gphrase("ارسلنا مرسلا"), gphrase("ارسلنا عبدا"),
    gphrase("ارسلنا فيهم"), gphrase("ارسلنا الي قوم"), gphrase("ارسلنا اليهم"), gphrase("ارسلنا اليكم"),
    gphrase("ارسل الله نبيا"), gphrase("ارسل الله رسولا"), gphrase("ارسل الله مرسلا"), gphrase("ارسال الله"),
    gphrase("ارسل الرسل"), gphrase("ارسل رسولا"), gphrase("ارسل نبيا"), gphrase("ارسل مرسلا"), gphrase("ارسال الرسل"),
    gphrase("ختم النبيين"), gphrase("خاتم النبيين"), gphrase("ختم الرسل"), gphrase("خاتم الرسل"),
  ]],
  ["unnamed", [
    gphrase("نبي من"), gphrase("نبيا من"), gphrase("رسول من"), gphrase("رسولا من"), gphrase("مرسل من"),
    gphrase("مرسلا من"), gphrase("من الانبياء"), gphrase("احد الانبياء"), gphrase("احد الرسل"),
    gphrase("احد المرسلين"), gphrase("انبياء بني اسراييل"), gphrase("بني اسراييل انبياء"),
  ]],
];

/** English fallbacks for the museum's own translations (matn translations only). */
const EN_NAMES: [MessengerSubjectId, string][] = [
  ["person/adam", "adam"], ["person/nuh", "noah"], ["person/idris", "enoch"], ["person/hud", "hud"],
  ["person/salih", "salih"], ["person/ibrahim", "abraham"], ["person/ismail", "ishmael"],
  ["person/ishaq", "isaac"], ["person/yaqub", "jacob"], ["person/yusuf", "joseph"],
  ["person/shuayb", "shuaib"], ["person/ayyub", "job"], ["person/musa", "moses"],
  ["person/harun", "aaron"], ["person/dawud", "david"], ["person/sulayman", "solomon"],
  ["person/ilyas", "elijah"], ["person/al-yasa", "elisha"], ["person/yunus", "jonah"],
  ["person/zakariyya", "zechariah"], ["person/yahya", "john the baptist"],
  ["person/isa-ibn-maryam", "jesus"], ["person/muhammad", "muhammad"],
];
const EN_GENERIC: [MessengerGenericTopic, RegExp][] = [
  ["prophets", /\bprophets\b|\bprophet\b/i],
  ["messengers", /\bmessengers\b|\bapostles\b/i],
];

/** The Arabic matn a passage is judged on: frozen text_search first, then the matn text. */
const arabicMatnOf = (n: Node): string =>
  normalizeMessengerArabic(String(n.data.text_search ?? n.data.text ?? ""))
    .replace(NOT_ADAM, " ")
    .replace(NOT_DAWUD, " ")
    .replace(NOT_ISA, " ");
/** English is read only from the matn translation, never the isnad-heavy summary; the frozen Qur'an translation inserts «(O Muhammad)» as an addressee gloss, so Arabic stays the judge there. */
const englishMatnOf = (n: Node): string => {
  if (n.data.work === "work/quran") return "";
  const tr = n.data.translations as Record<string, { text?: string }> | undefined;
  return [tr?.en?.text].filter(Boolean).join(" ");
};

/** The messenger topics a passage mentions, detected from its own matn. */
export function messengerTopicsOf(n: Node): MessengerTopic[] {
  if (n.class !== "passage" || n.stub || MESSENGERS_EXCLUDE.has(n.id)) return [];
  const ar = ` ${arabicMatnOf(n)} `;
  const en = englishMatnOf(n).toLowerCase();
  const topics = new Set<MessengerTopic>();
  for (const [id, pats] of Object.entries(SUBJECT_PATTERNS) as [MessengerSubjectId, RegExp[]][]) {
    if (pats.some((p) => p.test(ar))) topics.add(id);
  }
  if (SALIH_GATES.some((p) => p.test(ar)) || ((ar.includes(" صالح") || ar.includes("صالحا")) && /ثمود|اخاهم|اخا /.test(ar))) topics.add("person/salih");
  if (YAHYA_GATES.some((p) => p.test(ar))) topics.add("person/yahya");
  for (const [id, word] of EN_NAMES) {
    if (new RegExp(String.raw`\b` + word + String.raw`\b`, "i").test(en)) topics.add(id);
  }
  for (const [topic, pats] of GENERIC_PATTERNS) if (pats.some((p) => p.test(ar))) topics.add(topic);
  for (const [topic, pat] of EN_GENERIC) if (pat.test(en)) topics.add(topic);
  for (const t of [...topics]) if (MESSENGER_TOPIC_EXCLUDE.has(`${n.id}:${t}`)) topics.delete(t);
  return [...topics];
}

/** True when the passage's own matn mentions a prophet, messenger or the prophetic class. */
export function isMessengerPassage(n: Node): boolean {
  return messengerTopicsOf(n).length > 0;
}

/**
 * Which corpus a messenger passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by their
 * genre the day their passages arrive.
 */
export function messengerCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): MessengerCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: the first `messengers-<section>` tag naming a real section, else `curated`. */
export function messengerTagSection(n: Node): MessengerSection {
  for (const t of n.tags) {
    if (!t.startsWith("messengers-") || t === MESSENGERS_TAG) continue;
    const id = t.slice(11);
    if ((MESSENGER_SECTIONS as readonly string[]).includes(id)) return id as MessengerSection;
  }
  return "curated";
}
