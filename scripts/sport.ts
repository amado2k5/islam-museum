// The Sport Browser's shared reads (docs/plan/66-sport-browser.md): which passage records report
// or mention sport and contest — horsemanship (الفروسية والخيل), archery (الرماية), swimming
// (السباحة), wrestling and strength (المصارعة والقوة), races and wagered contests (السبق
// والمسابقة), play and games (اللعب والحراب والكرة والصولجان والشطرنج), hunting as field sport
// (الصيد) and sport named as sport (الرياضة) — and which corpus section each belongs to.
// Detection runs at build time over the compiled graph, so a sport report in any harvested
// book — and in every book harvested later — appears without any tagging step. Curated records
// join through the `sport-browser` tag instead. The ambiguous words are guarded: «سبق» counts
// only beside race/stake vocabulary, «صيد» only beside hunt vocabulary, «رمي» only beside
// arrow vocabulary (رمي الجمرات excluded), «يسبح» only beside water vocabulary, «صرع» only
// beside wrestling vocabulary, and verified false positives drop out by id.
import type { Node } from "./build-graph.js";

export const SPORT_TAG = "sport-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const SPORT_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type SportSection = (typeof SPORT_SECTIONS)[number];
export type SportCorpus = Exclude<SportSection, "curated">;
export type SportTopic =
  | "khayl" | "ramy" | "sibaha" | "sira" | "sabq" | "laib" | "sayd" | "riyada";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/* ————— الفروسية والخيل — horses, riding, the equestrian art ————— */
/** Unambiguous horse words: الخيل، فرس، أفراس، حصان، مهر، مهرات، الفارس، الفرسان، فروسية،
 *  جياد، صافنات، عاديات، مركوب، ركوب الخيل/الفرس. «ركب» alone stays out (generic travel). */
const AR_KHAYL = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:خيل|الخيل|خيله|خيلها|خيلكم|فرس|فرسان|أفراس|حصان|حصانه|حصانها|مهر|مهرات|مهره|مهرة|فارس|الفارس|فرسان|الفرسان|فروسية|الفروسية|جياد|الجياد|صافنات|عاديات|مركوب|مركبة|ركوب|ركوبه|ركوبها|مغيرا|مغيرات|ضبحا|تضبح)(?=$|${E})`);

/* ————— الرماية — archery and shooting ————— */
/** Strong: رماية، الرمي، نصل، نصال، سهم، سهام، أقذع، رامياً، الرامي، رمية، رماة. Bare «رمي»
 *  forms count only beside arrow/target vocabulary — رمي الجمرات and رمي بالكلام stay out. */
const AR_RAMY_STRONG = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:رماية|الرماية|رمية|رميتها|نصل|نصال|النصل|النصال|سهم|سهام|أسهم|السهم|السهام|أقذع|راميا|رامي|الرامي|رماة|الرماة|رمى بالنبل|قوس|أقواس)(?=$|${E})`);
const AR_RAMY_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:رمي|يرمي|يرمون|ارم|ارموا|رميت|رمى|يرميه|رموهم|نرمي)(?=$|${E})`, "g");
const RAMY_CONTEXT = /سهم|سهام|نصل|نصال|نبل|قوس|هدف|مصلى|رمية|رامي|غرس|بني إسماعيل|فداك أبي|يرمون بالنبل/;
const RAMY_FALSE = /رمي الجمرات|رمية الجمر|الجمرة|رمى بالكلام|رمي بصر|رمى بهم بأسوأ/;

/* ————— السباحة — swimming ————— */
/** Strong: سباحة، عوم، يعوم، العوم. Bare يسبح/تسبح counts only beside water/swim vocabulary —
 *  تسبيح glorification stays out. */
const AR_SIBAHA_STRONG = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:سباحة|السباحة|عوم|العوم|يعوم|يعومون|عوموا|سبحتم|عمود|سباحتها)(?=$|${E})`);
const AR_SIBAHA_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:يسبح|تسبح|سبحا|سبحوا)(?=$|${E})`, "g");
const SIBAHA_CONTEXT = /ماء|الماء|نهر|أنهار|بحر|البحر|غطس|عوم|سباحة|غرق|يغرق|اليم/;

/* ————— المصارعة والقوة — wrestling and strength ————— */
/** Strong: مصارعة، مصارع، صارع، يصارع. Bare صرع* counts only beside bout vocabulary —
 *  صرعى "struck down dead" and صرعوا are excluded. */
const AR_SIRA_STRONG = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:مصارعة|المصارعة|مصارع|مصارعا|صارع|يصارع|صارعه|أصارع|صارعته|صارعك|صرعة|إشالة|يشال|أشال)(?=$|${E})`);
const AR_SIRA_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:صرع|صرعت|صرعتك|صرعه|صرعته|صرعها)(?=$|${E})`, "g");
const SIRA_CONTEXT = /مصارع|صارع|صرعة|ركانة|بطن|فخذ|ألصق|وثب|وثبة|أرضعاه/;
const SIRA_FALSE = /صرعى|صرعاهم|صرعا ب|يصرعون|صرعوا|مُصرع/;

/* ————— السبق — races and wagered contests ————— */
/** Strong: سباق، مسابقة، يسابق، تسابق، سابقني، محلل، مزمل، مضمر، حلبة، الرهان على السباق.
 *  Bare «سبق» counts only beside race/stake vocabulary — the forerunner sense stays out. */
const AR_SABQ_STRONG = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:سباق|السباق|مسابقة|المسابقة|مسابقات|يسابق|تسابق|تسابقني|سابقني|سبقتك|سبقته|سبقها|محلل|المحلل|محللان|مزمل|المزمل|مضمر|المضمر|مضمار|حلبة|الحلبة|حلب|السابق والمزمل|سبق الخيل|سبق الإبل)(?=$|${E})`);
const AR_SABQ_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:سبق|سبقا|سبقة|السبق|جعل|الجعل|مجعل)(?=$|${E})`, "g");
const SABQ_CONTEXT = /خف|حافر|نصل|سابق|محلل|مزمل|مضمر|مسابق|سباق|رهان|السابق|خيل|إبل|فرس|عدو|يركض|جري|سبق الخيل/;

/* ————— اللعب والألعاب — play, spear-play, ball and board games ————— */
/** Strong: the Abyssinian spear-play words, polo, ball, chess, backgammon, maysir.
 *  Bare «لعب/يلعب» counts only beside play-contest vocabulary (diversion senses listed in
 *  the Qur'an stay in — they are the topic — but «لعب» as child's play alone stays out). */
const AR_LAIB_STRONG = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:حرابها|حرابهم|الحراب|بالحراب|صولجان|الصولجان|كرة|الكرة|كرة القدم|شطرنج|الشطرنج|نرد|النرد|نردشير|ميسر|الميسر|أنصاب|أزلام|لعبة|ألعاب|اللعبة|الألعاب)(?=$|${E})`);
const AR_LAIB_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:لعب|اللعب|يلعب|يلعبون|لعبوا|لعبت|لهو|اللهو)(?=$|${E})`, "g");
const LAIB_CONTEXT = /حراب|الحبشة|حبش|مسجد|كرة|صولجان|لعبة|لهو|زخرف|لغو|مسرح|عرض|دف|مزمار|صغار|صبيان|أولاد|الصبيان/;

/* ————— الصيد — hunting and falconry as field sport ————— */
/** Strong: جوارح، باز، صقر، قنص، كلب صيد، الصيد البري، الفاكهة. Bare «صيد» counts only beside
 *  hunt/falconry vocabulary — the snare/trap-of-people sense stays out. */
const AR_SAYD_STRONG = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:جوارح|الجوارح|باز|بازي|الباز|البازي|صقر|الصقر|صقور|قنص|القنص|قناص|القناص|صيد بري|الصيد البري|صيد البر|صيد البحر|صيدا حلالا|كلب صيد|كلاب الصيد|فاكهة الصيد|مكلبين)(?=$|${E})`);
const AR_SAYD_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:صيد|الصيد|صيدا|يصيد|يصطاد|اصطادوا|صائد|صياد|الصياد|الصائد|صيود)(?=$|${E})`, "g");
const SAYD_CONTEXT = /جوارح|صقر|باز|كلب|كلاب|بر|بحر|فاكهة|أكل|حل|طعام|غنيمة|فرسخ|نصب|قنص|حرم|إحرام/;

/* ————— الرياضة — sport named as sport ————— */
/** Modern vocabulary: رياضة، رياضي، الألعاب الأولمبية، كأس العالم، بطولة. «بطولة» counts only
 *  beside sport vocabulary (a tournament), never the heroic sense. */
const AR_RIYADA_STRONG = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:رياضة|الرياضة|رياضي|رياضيين|الرياضي|الأولمبية|أولمبياد|كأس العالم|المونديال|ألعاب القوى|ماراثون|جائزة الكرة الذهبية)(?=$|${E})`);
const AR_RIYADA_BARE = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:بطولة|بطولات|الدوري|منتخب|المنتخب)(?=$|${E})`, "g");
const RIYADA_CONTEXT = /رياض|كرة|قدم|لعبة|فريق|دوري|أولمبي|ملعب|هدف|مباراة|كأس|سباق/;

/** Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 *  tagging a passage `sport-browser` also admits it (see pick in export-api). */
export const SPORT_EXCLUDE = new Set<string>([]);

/** topic for each signal name. */
const SIGNAL_TOPICS: Record<string, SportTopic> = {
  khayl: "khayl",
  ramy_strong: "ramy", ramy_bare: "ramy",
  sibaha_strong: "sibaha", sibaha_bare: "sibaha",
  sira_strong: "sira", sira_bare: "sira",
  sabq_strong: "sabq", sabq_bare: "sabq",
  laib_strong: "laib", laib_bare: "laib",
  sayd_strong: "sayd", sayd_bare: "sayd",
  riyada_strong: "riyada", riyada_bare: "riyada",
};

/** The matched signal names for a passage, or [] when it is not about sport or contest. */
export function sportSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name a
  // sport without the passage itself being a sport report.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "");
  if (!raw || SPORT_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);
  const gated = (re: RegExp, ctx: RegExp, name: string) => {
    for (const m of raw.matchAll(re)) {
      const window = raw.slice(Math.max(0, m.index! - 40), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 40);
      if (ctx.test(window)) { hits.add(name); return; }
    }
  };

  if (has(AR_KHAYL)) hits.add("khayl");

  if (has(AR_RAMY_STRONG)) hits.add("ramy_strong");
  if (!RAMY_FALSE.test(raw)) gated(AR_RAMY_BARE, RAMY_CONTEXT, "ramy_bare");

  if (has(AR_SIBAHA_STRONG)) hits.add("sibaha_strong");
  gated(AR_SIBAHA_BARE, SIBAHA_CONTEXT, "sibaha_bare");

  if (has(AR_SIRA_STRONG)) hits.add("sira_strong");
  if (!SIRA_FALSE.test(raw)) gated(AR_SIRA_BARE, SIRA_CONTEXT, "sira_bare");

  if (has(AR_SABQ_STRONG)) hits.add("sabq_strong");
  gated(AR_SABQ_BARE, SABQ_CONTEXT, "sabq_bare");

  if (has(AR_LAIB_STRONG)) hits.add("laib_strong");
  gated(AR_LAIB_BARE, LAIB_CONTEXT, "laib_bare");

  if (has(AR_SAYD_STRONG)) hits.add("sayd_strong");
  gated(AR_SAYD_BARE, SAYD_CONTEXT, "sayd_bare");

  if (has(AR_RIYADA_STRONG)) hits.add("riyada_strong");
  gated(AR_RIYADA_BARE, RIYADA_CONTEXT, "riyada_bare");

  return [...hits];
}

/** True when the passage reports or mentions sport or contest in any of the eight families. */
export function isSportPassage(n: Node): boolean {
  return sportSignalsOf(n).length > 0;
}

/** The sport topics a passage touches: every family whose signals hit. */
export function sportTopicsOf(n: Node): SportTopic[] {
  const topics = new Set<SportTopic>();
  for (const s of sportSignalsOf(n)) {
    const t = SIGNAL_TOPICS[s];
    if (t) topics.add(t);
  }
  return [...topics];
}

/**
 * Which corpus a sport passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function sportCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): SportCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `sport-<section>` when present, else `curated`. */
export function sportTagSection(n: Node): SportSection {
  const tag = n.tags.find((t) => t.startsWith("sport-") && t !== SPORT_TAG);
  const id = tag?.slice(6) ?? "curated";
  return (SPORT_SECTIONS as readonly string[]).includes(id) ? (id as SportSection) : "curated";
}
