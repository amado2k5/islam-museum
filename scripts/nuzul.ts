// The Nuzul Browser's shared reads (docs/plan/75-asbab-nuzul-browser.md): which passage
// records report or mention an occasion of revelation (sabab al-nuzul) — the events,
// questions and incidents in whose context a verse or sura came down — and which corpus
// section and narrator generation each belongs to. Detection runs at build time over the
// compiled graph, so an occasion report in any harvested book — and in every book
// harvested later — appears without any tagging step. Curated records join through the
// `nuzul-browser` tag instead.
//
// Scope: reports that tell WHY or WHEN or ABOUT WHOM a verse or sura was revealed —
// «نزلت هذه الآية في…»، «أنزل الله فيهم…»، «سبب نزولها…» — plus passages about the
// science of asbab al-nuzul itself (mention-kind). Out of scope by design: every other
// نزل/نزول sense — rain and weather («نزل المطر/البرد/السيل»), calamity («نزل بهم
// البلاء»), guests and descents («نزل الضيف/الحجيج»), eschatological descents («نزول
// عيسى»، «نزول الروح»), medical «نزول الماء», military landings — enforced by the
// verse-context requirement on the weak signals and by the verified-id exclusion list.
import type { Node } from "./build-graph.js";

export const NUZUL_TAG = "nuzul-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const NUZUL_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type NuzulSection = (typeof NUZUL_SECTIONS)[number];
export type NuzulCorpus = Exclude<NuzulSection, "curated">;
/** `occasion` = the passage reports an actual occasion of revelation; `mention` = it is about the occasions as a topic. */
export type NuzulKind = "occasion" | "mention";
/** The generation the report is traced to: the Prophet's own explanation, a Companion's,
 *  a Successor's, a later scholar's — or unidentifiable. */
export type NuzulNarrator = "prophetic" | "companion" | "tabii" | "later" | null;

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

// ---------------------------------------------------------------------------
// Occasion vocabulary
// ---------------------------------------------------------------------------

/**
 * The occasion formula: «سبب نزول»، «أسباب النزول»، «أسباب نزول»، «في سبب نزولها»،
 * «بسبب نزولها»، «سبب في نزولها». No context needed — the phrase names the subject.
 */
const AR_SABAB = /(?:سبب|أسباب)\s+(?:في\s+)?نزول[ء-ي]{0,4}|نزول(?:ها|ه|هما|هم)\s+بسبب/;

/**
 * «نزلت هذه الآية/الآيات/السورة»، «أنزلت هذه الآية»، «نزلت هاتان الآيتان» — the
 * demonstrative form, an occasion report by shape.
 */
const AR_THESE = /(?:نزلت|أنزلت|أنزَلَت|نَزَلَت)\s+(?:هذه|هاتان|تلك)\s+(?:ال)?(?:آية|آيات|آيتان|آيتين|سورة|سور)(?=$|[\sء-ي])/;

/**
 * «فأنزل الله»، «فنزلت»، «فنزل جبريل»، «فأنزل الله تعالى»، «أنزل الله فيه/فيهم/
 * فيها/عليه» — God/Gabriel revealing in response to what precedes; the verse
 * context window is still checked, since «أنزل الله المطر» exists too.
 */
const AR_FA_ANZALA = /(?:ف?أنزل|ف?نزّل)\s+(?:الله|الله\s+تعالى|ربي|ربّي|جبريل)(?=$|[\sء-ي])/;
const AR_NAZALA_JIBRIL = /نزل\s+(?:بها|به)?\s*جبريل(?=$|[\sء-ي])/;

/**
 * «نزلت في فلان»، «نزلت فيه/فيها/فيهم/عليه/عليها/عليهم»، «نزل فيهم»، «نزلت في بني
 * فلان» — a verse "coming down about" someone or something. Weak: requires the
 * verse-context window (the gate below), which rain and calamity senses fail.
 */
const AR_NAZALAT_FI = new RegExp(`${BL}(?:نزلت|نزل|أنزلت|أنزل|تنزل|تنزّل)\\s+(?:هذه\\s+(?:ال)?(?:آية|الآيات|السورة|آيات)\\s+)?(?:في|على|فيما|عمّا|بشأن)\\s+[ء-ي]{1,15}`, "g");

/** «نزلت آية»، «نزلت سورة»، «نزل قرآن»، «أنزلت آية» — verse/sura as the revealed subject. */
const AR_NAZALAT_AYA = /(?:نزلت|أنزلت|نزل|أنزل|تنزلت)\s+(?:ال)?(?:آية|الآية|آيات|سورة|السورة|قرآن|القرآن|قرآنا|قرآنًا)(?=$|[\sء-ي])/;

/**
 * «فيها نزلت»، «فيها أنزلت»، «بها نزلت»، «عليه نزلت» — pronoun-first occasion
 * formula («قال فلان ففيها نزلت هذه الآية»).
 */
const AR_PRONOUN_NAZALAT = /(?:فيها|فيها|بها|عليه|عليها|فيه|فيهم|لهم|عليهم|لأجله|لأجلها)\s+(?:نزلت|أنزلت|نزل|أنزل)(?=$|[\sء-ي])/;

/** «سبب نزول قوله/قوله تعالى» and the genre's own terms: «مما نزل في»، «ما نزل في». */
const AR_WHAT_NAZALA = /(?:ما|مما|فيما)\s+نزل(?:ت)?\s+(?:في|على|عن)\s+[ء-ي]{1,15}/;

/**
 * The science itself (mention-kind): «علم أسباب النزول»، «الوقوف على أسباب النزول»،
 * «معرفة أسباب النزول»، «نزلت/أسباب النزول من كذا»، «رواية أسباب النزول»،
 * «المُسند في أسباب النزول»، «المعلَّق» — talking about the occasions as a field.
 */
const AR_SCIENCE = /(?:علم|معرفة|رواية|روايات|سماع|وقوف|باب|أبواب|فن|كتاب|مصنف|مؤلف|المسند|المعلق)\s+(?:في|على|عن|ل)?\s*أسباب\s+(?:ال)?نزول|أسباب\s+(?:ال)?نزول\s+(?:القرآن|الآية|الآيات|من|في|عند|علم)/;

// ---------------------------------------------------------------------------
// Gates
// ---------------------------------------------------------------------------

/**
 * The verse context required around a weak «نزل/أنزل» signal: the revelation's
 * object must be a verse, sura, the Qur'an or God's speech nearby — آية، آيات،
 * سورة، قرآن، قوله تعالى، كتاب الله، الذكر، التنزيل، جبريل، الوحي، النبي,
 * رسول الله, السماء (نزل من السماء with scripture context). A «نزل المطر» has none.
 */
const VERSE_CONTEXT = /آي[ةهات]|سور[ةة]|قرآن|قوله\s+تعالى|قال\s+تعالى|كتاب\s+الله|تنزيل|الذكر|جبريل|ميكائيل|الروح\s+الأمين|الوحي|رسول\s+الله|النبي\s*ﷺ|النبي(?:\s|$)|أوحى|يوحى|السماء|اللوح|الفرقان|التوراة|الإنجيل/;

/**
 * Weather, calamity, guest and other physical-descent senses that must NOT satisfy
 * the weak signal even beside a stray context word — checked on a small window
 * around the match.
 */
const DESCENT_SENSES = /نزل\s+(?:ال)?(?:مطر|برد|سيل|ثلج|قطر|غيث|بلاء|ضيف|ضيفان|حجيج|جيش|عسكر|سراي|خيام|قوم|ركب|قافلة|ماء|سحاب|رعد|برق|عذاب|صاعقة|رجز|خسف|دمار|وباء|طاعون)|نزول\s+(?:ال)?(?:مطر|ماء|عيسى|روح|ملائكة|سيل|ضيف|بلاء|جيش)|نزل\s+(?:به|بهم|بنا|بكم|عليهم)\s+(?:ال)?(?:بلاء|عذاب|مطر|سيل|برد)/;

/**
 * The prophetic-descent senses that are eschatology, not occasions: «نزول عيسى»،
 * «ينزل عيسى بن مريم»، «نزول الروح/الملائكة» (laylat al-qadr descent is a
 * Qur'anic statement, gated by context window only when no verse anchor sits
 * near — kept out by DESCENT_SENSES anyway).
 */
const ESCH_DESCENT = /نزول\s+(?:عيسى|المسيح|الروح|الملائكة|إبليس)|ينزل\s+(?:عيسى|المسيح|الروح)(?=$|[\sء-ي])/;

/**
 * Passage records whose only hit is a verified false positive. Curated escape
 * hatch: tagging a passage `nuzul-browser` also admits it.
 */
export const NUZUL_EXCLUDE = new Set<string>([
  // kept for verified false positives as they surface
]);

const OCCASION_SIGNALS = new Set([
  "sabab", "these", "fa_anzala", "nazala_jibril", "nazalat_fi",
  "nazalat_aya", "pronoun_nazalat", "what_nazala",
]);
const MENTION_SIGNALS = new Set(["science"]);

function rawTextOf(n: Node): string {
  return [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(/ٰ/g, "ا")
    .replace(/ـ/g, "")
    .replace(DIACRITICS, "");
}

/** The window test: does a verse-context word sit within `rad` chars of `idx`? */
function verseAt(raw: string, idx: number, rad = 90): boolean {
  return VERSE_CONTEXT.test(raw.slice(Math.max(0, idx - rad), idx + rad));
}
/** Does a physical/eschatological descent sense sit in the match's window? */
function descentAt(raw: string, idx: number): boolean {
  const w = raw.slice(Math.max(0, idx - 60), idx + 80);
  return DESCENT_SENSES.test(w) || ESCH_DESCENT.test(w);
}

/** The matched signal names for a passage, or [] when it is not about an occasion of revelation. */
export function nuzulSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  const raw = rawTextOf(n);
  if (!raw || NUZUL_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();

  // Strong occasion formulae — they name the subject and need no context.
  if (AR_SABAB.test(raw)) hits.add("sabab");
  if (AR_THESE.test(raw)) hits.add("these");
  if (AR_NAZALA_JIBRIL.test(raw)) hits.add("nazala_jibril");
  if (AR_SCIENCE.test(raw)) hits.add("science");

  // «فأنزل الله/فنزل جبريل» — strong verb, but «أنزل الله المطر/العذاب» stays out.
  for (const m of raw.matchAll(new RegExp(AR_FA_ANZALA.source, "g"))) {
    if (descentAt(raw, m.index!)) continue;
    hits.add("fa_anzala");
    break;
  }

  // «نزلت آية/سورة/قرآن» — the revealed subject explicit; descent gates still apply.
  for (const m of raw.matchAll(new RegExp(AR_NAZALAT_AYA.source, "g"))) {
    if (descentAt(raw, m.index!)) continue;
    hits.add("nazalat_aya");
    break;
  }

  // «فيها نزلت» — pronoun-first occasion formula; needs a verse context nearby
  // since «فيها نزل القوم» guest reports share the shape.
  for (const m of raw.matchAll(new RegExp(AR_PRONOUN_NAZALAT.source, "g"))) {
    if (descentAt(raw, m.index!) || !verseAt(raw, m.index!)) continue;
    hits.add("pronoun_nazalat");
    break;
  }

  // «ما نزل في/على فلان» — genre phrasing; same context gate.
  for (const m of raw.matchAll(new RegExp(AR_WHAT_NAZALA.source, "g"))) {
    if (descentAt(raw, m.index!) || !verseAt(raw, m.index!)) continue;
    hits.add("what_nazala");
    break;
  }

  // «نزلت في فلان/فيه/عليهم» — the weakest: a descent or military landing shares
  // the shape, so both the descent gate and the verse-context window must pass.
  for (const m of raw.matchAll(AR_NAZALAT_FI)) {
    if (descentAt(raw, m.index!) || !verseAt(raw, m.index!)) continue;
    hits.add("nazalat_fi");
    break;
  }

  return [...hits];
}

/** True when the passage reports or mentions an occasion of revelation. */
export function isNuzulPassage(n: Node): boolean {
  return nuzulSignalsOf(n).length > 0;
}

/** `occasion` when the passage reports an actual occasion, `mention` when it is about the science. */
export function nuzulKindOf(n: Node): NuzulKind {
  const signals = nuzulSignalsOf(n);
  return signals.some((s) => OCCASION_SIGNALS.has(s)) ? "occasion" : "mention";
}

// ---------------------------------------------------------------------------
// Narrator generation
// ---------------------------------------------------------------------------

/** The Prophet's own explanation — the report quotes him or names the revelation's
 *  circumstances in his words («قال رسول الله»، «فأنزل الله» answering his question). */
const PROPHET_FORMULA = /(?:رسول\s+الله|النبي(?:\s|$)|نزل\s+عليه|أوحى\s+إليه|سأل(?:ت|وا)?\s+(?:ال)?(?:نبي|رسول))/;

/**
 * Companions whose reports carry the occasions: the famous mufassirun and eyewitnesses.
 * Matched by common name forms (short window text; full names also match).
 */
const COMPANION_NAMES = String.raw`ابن عباس|عبد الله بن عباس|عمر بن الخطاب|عمر|عثمان بن عفان|عثمان|علي بن أبي طالب|علي|أبو بكر|الصديق|عائشة|أم سلمة|حفصة|خديجة|خولة بنت ثعلبة|سودة|جابر بن عبد الله|جابر|أنس بن مالك|أنس|أبو هريرة|عبد الله بن مسعود|ابن مسعود|ابن عمر|عبد الله بن عمر|البراء بن عازب|البراء|معاذ بن جبل|معاذ|أبو سعيد الخدري|أبو سعيد|أبي بن كعب|أبي|زيد بن ثابت|بلال|سلمان|أبو ذر|المقداد|عمار|حذيفة|سعد بن معاذ|سعد بن أبي وقاص|طلحة|الزبير|عبد الرحمن بن عوف|أسامة|سمرة|رفاعة|النعمان|أوس بن|الأشعث|كعب بن مالك|حسان|نعيم بن مسعود|جرير|أبو طلحة|سهل بن سعد|سهل|عدي بن حاتم|عدي|أبو أيوب|أبو الدرداء|معاوية|عبد الله بن أبي أوفى|هريرة|أسماء بنت|أم أيمن|أم الفضل|ليلى|مارية|إبراهيم بن|وهب بن|بريرة|ميمونة|أم المؤمنين|مصعب|عتبان|سالم|حاطب|عتبة بن|أبو جهل|أمية بن خلف|الوليد بن المغيرة|العباس|حمزة|جعفر|قتادة بن النعمان|أسيد بن حضير|أسيد|سعد بن عبادة|أويس|أم حرام|بريدة|شداد|الدحاح|المسور|وهب|كعب الأحبار|كعب|تميم الداري|تميم|أبو رافع|بلال بن|أم أيوب|القاسم بن|سفيان|أبو سفيان|هند بنت|عكرمة مولى|عكرمة بن أبي جهل|أبو موسى|أبو موسى الأشعري|الأشعري|معقب|عثمان بن مظعون|مظعون|سعد بن|أنس بن|حبيب|ذو اليدين|الخزرج|الأوس|الأنصاري|الأنصار|المهاجرين|رجل من الأنصار|امرأة من الأنصار|رجل من المهاجرين`;

/**
 * Successors (tabi'un) whose reports carry the occasions: مُجاهد، قتادة، سعيد بن
 * جبير، عكرمة، الحسن البصري، ابن سيرين، الزهري، عطاء، الضحاك، السدي، إبراهيم
 * النخعي، الشعبي، عروة بن الزبير، أبان، طاوس، عبيدة السلماني، عامر الشعبي، علقمة،
 * الأسود، مسروق، زيد بن أسلم، أبو العالية، ربيع بن أنس، وهب بن منبه، كعب الأحبار.
 */
const TABII_NAMES = String.raw`مجاهد|قتادة|سعيد بن جبير|ابن جبير|عكرمة|الحسن البصري|الحسن|ابن سيرين|محمد بن سيرين|الزهري|ابن شهاب|عطاء بن أبي رباح|عطاء|الضحاك|السدي|إبراهيم النخعي|النخعي|الشعبي|عامر الشعبي|عروة بن الزبير|عروة|أبان بن عثمان|أبان|طاوس|عبيدة السلماني|السلماني|علقمة|الأسود بن يزيد|الأسود|مسروق|زيد بن أسلم|أبو العالية|أبو العالية|ربيع بن أنس|ربيع|وهب بن منبه|مقاتل|كعب الأحبار|عبد الله بن سلام|ابن سلام|رافع بن خديج|رافع|حبان|عبد الله بن أبي بكر|عاصم بن|سعيد بن المسيب|المسيب|سليمان بن يسار|سليمان|عبد الله بن شداد|القاسم بن محمد|القاسم|سالم بن عبد الله|سالم|نافع مولى|نافع|شهر بن حوشب|شهر|محمد بن علي|أبو جعفر|الباقر|جعفر الصادق|الصادق|أبو بكر بن|عبد الرحمن بن أبي ليلى|أبي ليلى|حرم|أبو الزناد|الزناد|أبو إسحاق السبيعي|السبيعي|عمرو بن دينار|عمرو|عبد الله بن بريدة|بريدة|سلمة بن|أبو مالك|إسماعيل بن|الأعمش|سليمان الأعمش|الأوزاعي|سفيان الثوري|الثوري|مالك بن أنس|مالك|الليث بن سعد|الليث|شعبة|حماد بن سلمة|حماد|ابن جريج|جريج|ورقاء|يحيى بن سعيد|يحيى|عبيد الله بن عمر|عبيد الله|هشام بن عروة|هشام|أبو حنيفة|النعمان بن ثابت|نعمان|سفيان بن عيينة|عيينة|موسى بن عقبة|عقبة|عبد الله بن المبارك|المبارك|وكيع|يحيى بن آدم|آدم|عبد الرزاق|عبد بن حميد|عبد|ابن أبي شيبة|مصعب|عبد الله بن وهب|وهب|أسد بن موسى|أسد|سعيد بن منصور|منصور|إسحاق بن راهويه|راهويه|أحمد بن حنبل|أحمد|يحيى بن معين|معين|علي بن المديني|المديني|البخاري|مسلم بن الحجاج|مسلم|أبو داود|داود|الترمذي|النسائي|ابن ماجه|ماجه`;

/** Later scholars whose citations of the occasions are themselves the mention. */
const LATER_NAMES = String.raw`الواحدي|السيوطي|الطبري|ابن كثير|الزمخشري|الرازي|القرطبي|الثعلبي|البغوي|أبو حيان|ابن عطية|ابن الجوزي|ابن تيمية|ابن القيم|ابن حجر|العسقلاني|الذهبي|ابن الأثير|النووي|ابن رجب|ابن قدامة|الطحاوي|البيهقي|الدارقطني|الطبراني|الخطيب|ابن عساكر|الآلوسي|الشوكاني|ابن عاشور|السعدي|الشنقيطي|ابن باز|الألباني|ابن عثيمين|البيضاوي|النسفي|الخازن|النيسابوري|السمرقندي|الجصاص|ابن حزم|ابن العربي|الماتريدي|النسفي|أبو الليث|الكشاف|معالم التنزيل|لباب النقل|لباب التأويل`;

const RE_PROPHET_FORMULA = new RegExp(PROPHET_FORMULA);
const RE_COMPANION = new RegExp(`${BL}(?:${COMPANION_NAMES})(?=$|${E})`);
const RE_TABII = new RegExp(`${BL}(?:${TABII_NAMES})(?=$|${E})`);
const RE_LATER = new RegExp(`${BL}(?:${LATER_NAMES})(?=$|${E})`);

/**
 * The report's narrator generation. Priority: prophetic formula (the Prophet's own
 * explanation or the revelation-addressed-to-him context) > companion > tabii >
 * later > null. Names are matched anywhere in the passage text — passages are
 * short, and the named narrator of an occasion report is the passage's subject.
 */
export function nuzulNarratorOf(n: Node): NuzulNarrator {
  if (n.class !== "passage" || n.stub || !isNuzulPassage(n)) return null;
  const raw = rawTextOf(n);
  if (RE_PROPHET_FORMULA.test(raw)) return "prophetic";
  if (RE_COMPANION.test(raw)) return "companion";
  if (RE_TABII.test(raw)) return "tabii";
  if (RE_LATER.test(raw)) return "later";
  return null;
}

/**
 * Which corpus a nuzul passage belongs to, from its work: the frozen Qur'an, the
 * hadith collections (genre `hadith` or a hadith-unit passage), the seerah books
 * (genre `sira`), and every other harvested work (the tafsir and asbab books land
 * here — their reports are the browser's spine).
 */
export function nuzulCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): NuzulCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `nuzul-<section>` when present, else `curated`. */
export function nuzulTagSection(n: Node): NuzulSection {
  for (const t of n.tags) {
    if (!t.startsWith("nuzul-") || t === NUZUL_TAG) continue;
    const id = t.slice(6);
    if ((NUZUL_SECTIONS as readonly string[]).includes(id)) return id as NuzulSection;
  }
  return "curated";
}

/** The narrator tag of a curated record: `nuzul-<narrator>` when it names a generation. */
export function nuzulTagNarrator(n: Node): NuzulNarrator {
  for (const t of n.tags) {
    if (!t.startsWith("nuzul-") || t === NUZUL_TAG) continue;
    const id = t.slice(6);
    if (["prophetic", "companion", "tabii", "later"].includes(id)) return id as NuzulNarrator;
  }
  return null;
}
