// The Munazarat Browser's shared reads (docs/plan/63-munazarat-browser.md): which passage
// records report or mention a debate, disputation or exchange of arguments — between
// Muslims and the scriptuaries, the polytheists, or inside the ummah — and which corpus
// section and opponent class each belongs to. Detection runs at build time over the
// compiled graph, so a debate in any harvested book — and in every book harvested
// later — appears without any tagging step. Curated records join through the
// `munazarat-browser` tag instead.
//
// Scope (founder's brief + clarification): the debates between Islam and the other
// religions — and, per the founder's answer, debates inside the ummah as well — from
// the Qur'an (Ibrahim's argument with Nimrod and his people, the mubahala verse,
// «جدلهم بالتي هي أحسن», Musa before Pharaoh), the Sunnah and the seerah (the Najran
// Christians, the exchange before the Negus, Ibn Abbas at Harura), the Sahaba's and
// Tabi'in's reported disputations, and every debate mention in the harvested books.
// Out of scope by design: the fiqh li'an oath (ملاعنة/تلاعن), «جدل/جديلة» the braid,
// حَجّ the pilgrimage, the bare «حاج» pilgrim noun, «احتاج» the needing verb, and
// «ناظر» the viewer/inspector sense without a Form III debate context.
import type { Node } from "./build-graph.js";

export const MUNAZARAT_TAG = "munazarat-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const MUNAZARAT_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type MunazaratSection = (typeof MUNAZARAT_SECTIONS)[number];
export type MunazaratCorpus = Exclude<MunazaratSection, "curated">;
/** `debate` = the passage carries or reports an actual exchange; `mention` = about debating. */
export type MunazaratKind = "debate" | "mention";
/** The debate's interlocutor class: the scriptuaries (Jews, Christians, Sabians —
 *  أهل الكتاب), the polytheists (مشركون، مجوس، عبدة الأوثان), inside-the-ummah parties
 *  (خوارج، مرجئة، قدرية، جهمية، متكلمون، فلاسفة/زنادقة…), anyone else, or no class. */
export type MunazaratOpponent = "scriptuaries" | "polytheists" | "intra" | "other" | null;

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

// ---------------------------------------------------------------------------
// Debate vocabulary
// ---------------------------------------------------------------------------

/**
 * Form III ناظر/تناظر — the disputation verbs and nouns: مناظرة، مناظرات، تناظر،
 * يناظر، ناظره/ناظرت/ناظروا (verb + pronoun/plural; the bare «ناظر» viewer sense is
 * absent), مناظر/مناظرون (the debater). «ناظر» inspector/editor uses are gated by
 * requiring a debate-form token, not the bare stem.
 */
const AR_MUNAZARA = new RegExp(`${BL}(?:[وبفسلك]?(?:مناظرة|مناظرات|مناظرةً|تناظر|تتناظر|يتناظر|تناظروا|يناظر|تناظره|ناظره|ناظرها|ناظرهم|ناظرت|ناظرتم|ناظروا|ناظرن|يناظره|يناظرهم|يناظروا|تناظره|تناظرهم|ناظرني|ناظرك|مناظر|المناظر|مناظرون|مناظرين|المناظرون|المناظرين|مناظره|مناظرهما|مناظرته|مناظرتها|مناظرتهم|مناظرتهما|المناظرة|المناظرات))(?=$|${E})`);

/**
 * جدل family — argument and disputation: جادل، يجادل، تجادل، جادلوا، يتجادلون،
 * جدال، مجادلة، أجدل، أكثر شيء جدلا. The braid «جديلة/جدائل» and the personal-name
 * uses are gated below per match.
 */
const AR_JADAL_VERB = new RegExp(`${BL}(?:[وبفسلك]?(?:جادل|جادلت|جادلوا|يجادل|تجادل|نجادل|تجادله|تجادلهم|تجادلوا|يجادله|يجادلهم|يجادلوا|يجادلون|تجادلون|جادله|جادلها|جادلهم|جادلهم|جادلني|جادلتك|جادلنا|جادلكم|جادلتكم|جادلتنا))(?=$|${E})`);
const AR_JADAL_NOUN = new RegExp(`${BL}(?:الجدال|جدال|جدالا|مجادلة|المجادلة|مجادلات|الجدل|جدل|جدلا|جدلاً|أجدل|الجدليون|الجدلي)(?=$|${E})`);
/** «جدل» braid/hair-plait and «جديلة/جدائل» — never a dispute. */
const JADAL_BRAID = /جديل|جدائل|جديلة|جدال العقل/;

/**
 * حجة/احتجاج — proof argued against a party: احتج، يحتج، احتجاج، حاجّ، يحاجّ،
 * محاجّة، حجة، حجج، أقام الحجة، داحضت حجته. حَجّ the pilgrimage never matches:
 * only the ة-forms and the Form III/Form VIII verbs are listed. The bare «حاج»
 * pilgrim and «احتاج» needing are excluded by the boundary + spelling.
 */
const AR_IHTIJAJ = new RegExp(`${BL}(?:[وبفسلك]?(?:احتج|احتجت|احتجوا|يحتج|تحتج|نحتج|احتجاج|الاحتجاج|حاجّ|حاجج|حاججت|حاججوا|يحاجّ|يحاجج|تحاجّ|تحاجج|محاجّة|المحاجة|يحتجون|احتجوا|احتجّوا|يحتجّون|اختلفوا))(?=$|${E})`);
const AR_HUJJA = new RegExp(`${BL}(?:الحجة|حجة|حجّة|حجةً|حجته|حجتها|حجتهم|حجتهما|حجتك|حجتكم|حجتي|حجتنا|حجج|الحجج|حجاج|بالحجة|بالحجج|الحجة البالغة|أقام الحجة|أقاموا الحجة|داحضت|دحض|دحضت|دحضوا)(?=$|${E})`);
/** «حجة» as a woman's given name (حجة بنت …) — never a proof. */
const HUJJA_NAME = /حجة\s+(?:بنت|ابنة|بن)/;

/**
 * مباهلة — the mutual-curse disputation: باهل، يباهل، تباهل، مباهلة، ابتهل،
 * ابتهال، تلاعن ملاعنة stay OUT (the fiqh li'an oath — gated below).
 */
const AR_MUBAHALA = new RegExp(`${BL}(?:[وبفسلك]?(?:باهل|باهلت|باهلوا|يباهل|تباهل|نباهل|مباهلة|المباهلة|مباهلات|ابتهل|ابتهلت|ابتهلوا|يبتهل|تبتهل|ابتهال|الابتهال|لعنة الله على الكاذبين))(?=$|${E})`);
/** li'an oath context: the fiqh mula'ana between spouses — never the mubahala debate. */
const LIAN_FIQH = /ملاعنة|تلاعن|لعان|لِّعَان|اللعان|زوج(?:ه|ها|ة|ته)?\s+لعان|شهادات|أربع\s+شهادات/;

/**
 * خصم/خصومة — contention: اختصم، يختصمون، خصم، خصومة، خصيم، الخصمان. Debate-level
 * when a party clash is narrated (اختصموا، خصمان اختصموا); mention-level elsewhere.
 */
const AR_KHISAM = new RegExp(`${BL}(?:[وبفسلك]?(?:اختصم|اختصمت|اختصموا|يختصم|تختصم|يختصمون|اختصام|خصم|خصما|خصمان|الخصم|الخصمان|خصومة|الخصومة|خصيم|الخصيم|خصماء|الخصماء|تخاصم|يتخاصمون|تخاصموا))(?=$|${E})`);

/**
 * حاور — Form III dialogue: حاور، يحاور، حاوره، محاورة، تحاوروا. A real exchange
 * of words; the bare «حوار» dialogue noun stays out — the founder's bar is
 * argument-for-argument, not every conversation.
 */
const AR_HAWAR = new RegExp(`${BL}(?:[وبفسلك]?(?:حاور|حاورت|حاوروا|يحاور|تحاور|نحاور|حاوره|حاورها|حاورهم|محاورة|المحاورة|محاورات|تحاوروا|يتحاورون|حوارهم|محاورته|محاورتهم))(?=$|${E})`);

/**
 * Quoted exchange around debate vocabulary: «قال … فقال له … قال» is not detected
 * alone (every narrative has dialogue) — it upgrades a mention to a debate when a
 * debate signal already fired inside the same window.
 */
const AR_EXCHANGE = /قال\s+(?:له|لهم|لها|لنبي|لرسول|يا|أيها|إنه|إنها|فإن|أما|ألم|:)[ء-ي\s،؛:.«»]{0,80}?(?:فقال|قال له|قالوا|فأجاب|أجاب)/;

/**
 * Named-episode anchors: «نصارى نجران» beside مباهلة/مناظرة، «حروراء» beside ابن
 * عباس/الخوارج، «النجاشي» beside جعفر/عمرو بن العاص/القرآن debate reports. These
 * are debate-level on their own.
 */
const AR_NAJRAN_DEBATE = /نصارى\s+نجران|نجران.*(?:مباهلة|باهل|يباهل|ناظر|مناظرة|السيد|العاقب)|مباهلة.*نجران/;
const AR_HARURA = /حروراء|ابن\s+عباس.*خوارج|خوارج.*ابن\s+عباس/;
const AR_NEGUS_DEBATE = /النجاشي.*(?:جعفر|عمرو بن العاص|قرآن|مريم|يسجد)|جعفر.*النجاشي/;

// ---------------------------------------------------------------------------
// Opponent classes
// ---------------------------------------------------------------------------

/** The scriptuaries: Jews, Christians, Sabians — أهل الكتاب and their scholars. */
const RE_SCRIPTUARIES = /(?:اليهود|يهود|يهودي|يهودية|أحبار|حبر|أحبارهم|النصارى|نصارى|نصراني|نصرانية|أهل الكتاب|أهل الكتابين|الكتابيون|صابئة|الصابئة|صابئ|الصابئين|رهبان|راهب|أسقف|بطريرك|قسيس|قس|بنات إسرائيل|بني إسرائيل)/;
/** The polytheists: mushrikun, idolaters, Magians, Sabian star-worshippers' rivals. */
const RE_POLYTHEISTS = /(?:مشرك|مشركون|المشركون|المشركين|مشركين|وثنيون|وثني|وثنية|أصنام|صنم|أوثان|وثن|عبدة الأوثان|عابد الوثن|مجوس|المجوس|مجوسي|دهرية|الدهرية|دهري|براهمة|برهمان|بوذي|البوذية|صنمية|عبدة الأصنام|الكفار|كفار قريش|مشركي قريش|قوم لوط|عاد|ثمود|فرعون|النمرود|نمرود)/;
/** Inside-the-ummah parties: sects, schools and disputants within Islam. */
const RE_INTRA = /(?:خوارج|الخوارج|خارجي|حرورية|أهل حروراء|مرجئة|المرجئة|مرجئ|قدرية|القدرية|قدري|جهمية|الجهمية|جهمي|جهم بن صفوان|معتزلة|المعتزلة|معتزلي|رافضة|الرافضة|رافضي|روافض|متكلم|متكلمون|المتكلمون|أهل الكلام|فلاسفة|الفلاسفة|فيلسوف|زنديق|زنادقة|الزنادقة|ملحد|ملاحدة|باطنية|الباطنية|قرامطة|القرامطة|جبرية|الجبرية|سفسطائية|السفسطائية|متصوفة|المتصوفة|صوفي|أهل البدع|صاحب بدعة|غلاة|الغلاة|مشبهة|المشبهة|مجسمة|المجسمة|حشوية|الحشوية|كلابية|الكلابية|كرامية|الكرامية|أشاعرة|الأشاعرة|حنابلة|الحنابلة|شافعية|الشافعية|حنفية|الحنفية|مالكية|المالكية|ماتريدية|الماتريدية|سلفية|السلفية|وجدية|نجارية|النجارية|ثعلبية)/;

// ---------------------------------------------------------------------------
// Detector
// ---------------------------------------------------------------------------

/**
 * Passage records whose only lexical hit is a verified false positive. Curated
 * escape hatch: tagging a passage `munazarat-browser` also admits it.
 */
export const MUNAZARAT_EXCLUDE = new Set<string>([
  // Known false positives land here after audit: «حاج» pilgrim windows that
  // slipped through the conjugated-form guard, «ناظر» viewer/inspector hits,
  // «جديلة» braid hits, li'an-oath spillover. Add by id, never by deleting a rule.
]);

const DEBATE_SIGNALS = new Set([
  "munazara", "mubahala", "jadal_verb", "hajja", "ihtijaj", "hawar", "khisam_clash",
  "najran", "harura", "negus",
]);
const MENTION_SIGNALS = new Set([
  "jadal_noun", "hujja", "khisam_noun",
]);

function rawTextOf(n: Node): string {
  return [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    // The dagger alif (ٰ) is a long ā — restore it to alif BEFORE stripping.
    .replace(/ٰ/g, "ا")
    // Tatweel is pure elongation — remove it outright.
    .replace(/ـ/g, "")
    .replace(DIACRITICS, "");
}

/** Whether a match sits inside the li'an-oath fiqh context (never the mubahala debate). */
function isLianContext(raw: string, index: number): boolean {
  const window = raw.slice(Math.max(0, index - 100), index + 120);
  return LIAN_FIQH.test(window);
}

/** Whether a «جدل»-family match is the braid/etymology sense, not a dispute. */
function isBraidContext(raw: string, index: number): boolean {
  const window = raw.slice(Math.max(0, index - 60), index + 60);
  return JADAL_BRAID.test(window);
}

/** Whether a «حجة»-family match is the woman's name or the pilgrimage verb. */
function isHajjOrName(raw: string, index: number): boolean {
  const window = raw.slice(Math.max(0, index - 60), index + 60);
  return HUJJA_NAME.test(window) || /حج\s+(?:ال)?بيت|حجة\s+الوداع|حج\s+الناس|يحج\s+(?:ال)?بيت/.test(window);
}

/** The matched signal names for a passage, or [] when it is not about debates. */
export function munazaratSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  const raw = rawTextOf(n);
  if (!raw || MUNAZARAT_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();

  if (AR_MUNAZARA.test(raw)) hits.add("munazara");
  if (AR_MUBAHALA.test(raw) && !isLianContext(raw, raw.search(AR_MUBAHALA))) hits.add("mubahala");
  if (AR_HAWAR.test(raw)) hits.add("hawar");
  if (AR_NAJRAN_DEBATE.test(raw)) hits.add("najran");
  if (AR_HARURA.test(raw)) hits.add("harura");
  if (AR_NEGUS_DEBATE.test(raw)) hits.add("negus");

  // جدل: verbs are debate-level; nouns are mention-level; braid contexts are out.
  for (const m of raw.matchAll(new RegExp(AR_JADAL_VERB.source, "g"))) {
    if (isBraidContext(raw, m.index!)) continue;
    hits.add("jadal_verb");
    break;
  }
  for (const m of raw.matchAll(new RegExp(AR_JADAL_NOUN.source, "g"))) {
    if (isBraidContext(raw, m.index!)) continue;
    hits.add("jadal_noun");
    break;
  }

  // حجة/احتجاج: verb forms and «محاجّة» are debate-level; the bare noun is mention-level.
  for (const m of raw.matchAll(new RegExp(AR_IHTIJAJ.source, "g"))) {
    if (isHajjOrName(raw, m.index!)) continue;
    hits.add("ihtijaj");
    break;
  }
  for (const m of raw.matchAll(new RegExp(AR_HUJJA.source, "g"))) {
    if (isHajjOrName(raw, m.index!)) continue;
    hits.add("hujja");
    break;
  }

  // خصم: a narrated clash of parties is debate-level; the abstract nouns mention-level.
  for (const m of raw.matchAll(new RegExp(AR_KHISAM.source, "g"))) {
    const tok = m[0];
    if (/اختصم|يختصمون|تخاصم|يتخاصمون|خصمان/.test(tok)) hits.add("khisam_clash");
    else hits.add("khisam_noun");
  }

  return [...hits];
}

/** True when the passage reports or mentions a debate or exchange of arguments. */
export function isMunazaratPassage(n: Node): boolean {
  return munazaratSignalsOf(n).length > 0;
}

/** `debate` when the passage carries an actual exchange, `mention` when only about debating. */
export function munazaratKindOf(n: Node): MunazaratKind {
  const signals = munazaratSignalsOf(n);
  return signals.some((s) => DEBATE_SIGNALS.has(s)) ? "debate" : "mention";
}

/**
 * The debate's interlocutor class. Priority: scriptuaries > polytheists > intra —
 * a debate with a People-of-the-Book party is the founder's named scope; a debate
 * with polytheists next; inside-the-ummah parties after; `other` when debate
 * signals exist but no class party is named; `null` for genre-level mentions.
 */
export function munazaratOpponentOf(n: Node): MunazaratOpponent {
  if (n.class !== "passage" || n.stub) return null;
  if (!isMunazaratPassage(n)) return null;
  const raw = rawTextOf(n);
  if (RE_SCRIPTUARIES.test(raw)) return "scriptuaries";
  if (RE_POLYTHEISTS.test(raw)) return "polytheists";
  if (RE_INTRA.test(raw)) return "intra";
  const signals = munazaratSignalsOf(n);
  const hasPartyContext = signals.some((s) => DEBATE_SIGNALS.has(s));
  return hasPartyContext ? "other" : null;
}

/**
 * Which corpus a munazarat passage belongs to, from its work: the frozen Qur'an, the
 * hadith collections (genre `hadith` or a hadith-unit passage), the seerah books
 * (genre `sira`), and every other harvested work.
 */
export function munazaratCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): MunazaratCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `munazarat-<section>` when present, else `curated`. */
export function munazaratTagSection(n: Node): MunazaratSection {
  for (const t of n.tags) {
    if (!t.startsWith("munazarat-") || t === MUNAZARAT_TAG) continue;
    const id = t.slice(10);
    if ((MUNAZARAT_SECTIONS as readonly string[]).includes(id)) return id as MunazaratSection;
  }
  return "curated";
}

/** The opponent tag of a curated record: `munazarat-<opponent>` when it names a class. */
export function munazaratTagOpponent(n: Node): MunazaratOpponent {
  for (const t of n.tags) {
    if (!t.startsWith("munazarat-") || t === MUNAZARAT_TAG) continue;
    const id = t.slice(10);
    if (["scriptuaries", "polytheists", "intra", "other"].includes(id)) return id as MunazaratOpponent;
  }
  return null;
}
