// The Ukhuwwa (Brotherhood in Islam) Browser's shared reads (docs/plan/63-ukhuwwa-browser.md):
// which passage records report or mention brotherhood and sisterhood in Islam — the faith-brotherhood
// of «المؤمنون إخوة» and «المسلم أخو المسلم», the brothers and sisters themselves (أخ، أخت، إخوة،
// إخوان، أخوات), the Prophet's brothering (المؤاخاة) of the Muhajirun and the Ansar, love for God's
// sake (الحب في الله), altruism and aid (الإيثار ونصرة الأخ), the rights a Muslim owes a Muslim
// (حقوق الأخ), and what breaks brotherhood (حسد، بغض، هجر، ظن السوء، غيبة الأخ) — and which corpus
// section each belongs to. Detection runs at build time over the compiled graph, so a brotherhood
// report in any harvested book — and in every book harvested later — appears without any tagging
// step. Curated records join through the `ukhuwwa-browser` tag instead. The ambiguous words are
// guarded: bare «أخ» counts only possessed or in a defined collocation, «عن أخيه» in a pure isnad
// does not count, «عيادة/تشميت» count only beside the Muslim-owes-Muslim rights context, and
// «حسد/غيبة/هجر» count only beside a brother word; verified false positives are excluded by id.
import type { Node } from "./build-graph.js";

export const UKHUWWA_TAG = "ukhuwwa-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const UKHUWWA_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type UkhuwwaSection = (typeof UKHUWWA_SECTIONS)[number];
export type UkhuwwaCorpus = Exclude<UkhuwwaSection, "curated">;
export type UkhuwwaTopic =
  | "ikwha" | "muakhat" | "hubb" | "ithar" | "huquq" | "tahdhir";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const E = B;
/** Leading boundary that also matches the start of the text. */
const BL = String.raw`(?:^|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

/* ————— الإخوة — brotherhood and the brothers and sisters themselves ————— */
/** أخوة/إخوة — the brotherhood noun, always on-topic («أخوة الإسلام»، «الإخوة في الله»، «إخوة»). */
const AR_UKHUWWA_NOUN = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:أخوة|إخوة|أخوتها|إخوتها|أخوته|إخوته)(?=$|${E})`);
/** إخوان/أخوان and every possessed إخوت- form — «إخوانك»، «إخوتهم»، «بني إخوان». */
const AR_IKHWAN = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:إخوان|أخوان|إخوانا|أخوانا|إخوته|إخوتها|إخوتهم|إخوتهن|إخوتك|إخوتكم|إخوتكن|إخوتي|إخوتنا|إخوانه|إخوانها|إخوانهم|إخوانك|إخوانكم|إخواننا|بني إخوان|بني أخوان|بني الإخوان|بني الأخوان)(?=$|${E})`);
/** أخت/أخوات and the possessed sister forms — the sisterhood side of الأخوة. */
const AR_UKHT = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:أخوات|أخته|أختها|أختهم|أختهن|أختك|أختكم|أختكن|أختي|أختنا|أختاك|أختاه|أخواته|أخواتها|أخواتهم|أخواتك|أخواتكم|أخواتنا|أختايا|أخيات)(?=$|${E})`);
/** Faith-brotherhood phrases — the unmisable collocations of the Qur'an and the hadith. */
const AR_FAITH_BRO = new RegExp(
  `${BL}(?:المؤمنون إخوة|المؤمنين إخوة|إنما المؤمنون إخوة|عباد الله إخوانا|عباد الله إخوان|إخوة في الله|أخوة في الله|الأخوة في الله|أخ في الله|أخاً في الله|أخا في الله|إخوة في دين الله|أخوة الإسلام|الأخوة الإسلامية|أخوة الإيمان|إخوة الإيمان|أخوة الدين|إخوة الدين|المسلم أخو المسلم|مسلم أخو المسلم|المؤمن أخو المؤمن|مؤمن أخو المؤمن|المرء أخو دينه|أخوك المسلم|أخوك في الله|إخوة اليمين|أخوة المسلمين|إخوة المسلمين|أخوة النصرة|أخوة العقيدة|ألف بين قلوبهم|ألف بين قلوبكم|ألف بين قلوبها|ألف بين قلوبنا|ألف بينهم|ألفت بين قلوبهم|ألفت بينهم|آلف بين قلوبهم|تأليف بين القلوب|ألف الله بين قلوبهم|فألف بين قلوبهم|مؤلفة قلوبهم|المؤلفة قلوبهم)(?=$|${E})`);
/** Possessed brother forms — أخوه، أخاه، أخيه، أخيها، أخاهم، أخوهما، أخيك، أخيكم، أخونا، أخوكم،
 *  أخوهم، أخوكما، أخاي، أخوي. Counted except in pure isnad («عن أخيه»، «عن أخيه قال»):
 *  a chain's «عن أخيه» is a narrator, not a brotherhood report — unless another brother word
 *  stands elsewhere in the passage. */
const AR_AKH_POSSESSED = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:أخوه|أخاها|أخيه|أخيها|أخاه|أخاهم|أخاهما|أخاهن|أخيك|أخيكم|أخيكن|أخونا|أخوكم|أخوكن|أخوهم|أخوهما|أخوك|أخوكما|أخاي|أخوي)(?=$|${E})`, "g");
/** The isnad shapes that make a possessed أخ a narrator link, not a brotherhood mention. */
const ISNAD_BEFORE = /(?:عن|أن|سمعت|سمع|حدثني|أخبرني|رأيت|لقيت) ?$/;
/** The construct forms — «أخا فلان»، «أخو بني»، «أخا الإسلام» — explicit brother-naming. */
const AR_AKH_CONSTRUCT = new RegExp(
  `${BL}(?:أخا بني|أخو بني|أخا قبيلة|أخو قبيلة|أخا العرب|أخو العرب|أخا الإسلام|أخو الإسلام|أخا المسلمين|أخو المسلمين|أخا النبي|أخو النبي|أخا رشيد|أخو السن|أخو مكة|أخو يثرب|أخو الحجاز|أخا هذيل|أخو هذيل|أخا غطفان|أخو غطفان|أخا قريش|أخو قريش|أخا الأنصار|أخو الأنصار|أخا المهاجرين|أخو المهاجرين)(?=$|${E})`);

/* ————— المؤاخاة — the Prophet's brothering and every pairing as brothers ————— */
/** مؤاخاة/آخى/يؤاخي/تآخى — the brothering verb and noun; آخى بين الناس. */
const AR_MUAKHAT = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:مؤاخاة|آخى|يؤاخي|تؤاخي|مؤاخي|تآخى|تآخي|يؤاخون|يؤاخوا|آخوا|آخيت|آخى بين|يؤاخي بين|إخاء|الإخاء|مؤاخاة النبي|مؤاخاة المهاجرين|مؤاخاة الأنصار|أخوين)(?=$|${E})`);
/** المهاجرون والأنصار beside a brother word — the brothering pairs' context signal. */
const AR_ANSAR_PAIR = new RegExp(`${BL}(?:ال)?(?:مهاجرون|مهاجرين|المهاجرين|المهاجرون|أنصار|الأنصار)(?=$|${E})`, "g");
const MUAKHAT_CONTEXT = /آخى|مؤاخاة|أخوة|إخوة|أخوه|أخاه|إخوان/;

/* ————— الحب في الله — love for God's sake and loving the brother ————— */
/** في الله/لله collocations of love — «أحب في الله»، «أحب لله»، «الحب في الله»، «المحبة في الله». */
const AR_HUBB_FILLAH = new RegExp(
  `${BL}(?:ال)?(?:حب في الله|الحب في الله|أحب في الله|أحب لله|أحببته لله|أحبك في الله|أحبك لله|أحبها في الله|أحبه في الله|أحبهم في الله|يحب في الله|أحبت في الله|المحبة في الله|المودة في الله|أحباب في الله|أحباء في الله|المتحابين في الله|حبه في الله|أحبك الذي|أحبني لله)(?=$|${E})`);
/** تحابُّ — the mutual-love verb family: تحابوا، يتحابون، متحابين، تحابوا بجلال الله، تَحابُّوا. */
const AR_TAHABB = new RegExp(
  `${BL}(?:[وبفس])?(?:ال)?(?:تحابوا|تحابوا|يتحابون|تتحابون|متحابين|المتحابين|متحابون|المحبون|تحابّوا)(?=$|${E})`);
/** «يحب لأخيه» — loving for the brother what one loves for oneself. */
const AR_HUBB_LIAKH = new RegExp(
  `${BL}(?:[وبفس])?(?:يحب لأخيه|تحب لأخيك|يحب لأخيه كما يحب لنفسه|حتى يحب لأخيه|لا يؤمن أحدكم حتى يحب لأخيه|يحب لنفسه|يحب للناس|أحب للناس|أحب للأخ)(?=$|${E})`);

/* ————— الإيثار والنصرة — altruism, aid and being for the brother ————— */
/** إيثار/الأثرة — the altruism noun, always on-topic; bare «أثرة» below gates on a brother word
 *  because the vocalized «أَثَارَة» (a remnant, 46:4) normalizes to the same token. */
const AR_ITHAR_NOUN = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:إيثار|الإيثار|الأثرة)(?=$|${E})`);
const AR_ATHARA_BARE = new RegExp(`${BL}أثرة(?=$|${E})`, "g");
/** The preferring verbs count only on «على» (يؤثرون على أنفسهم) or a brother word — «آثر الحياة»
 *  and «سحر يؤثر» are preferring/handed-down senses, not brotherhood. */
const AR_ITHAR_VERB = new RegExp(
  `${BL}(?:[وبفس])?(?:يؤثرون|تؤثرون|يؤثروا|يؤثرن|يؤثر|تؤثر|آثر|آثرت|آثروا|يؤاثر|تؤاثر|مؤثر)(?=$|${E})`, "g");
const ITHAR_AFTER = /^ ?(?:على|أنفسهم|أنفسنا|إخوانه|أخيه|أخاه)/;
/** نصرة الأخ وعدم خذلانه — «انصر أخاك ظالماً أو مظلوماً»، «لا يظلمه ولا يخذله»، «في حاجة أخيه». */
const AR_NASR_AKH = new RegExp(
  `${BL}(?:[وبفس])?(?:انصر أخاك|انصر أخاه|نصر أخاه|نصرة أخيه|نصرة الأخ|ينصر أخاه|ينصر أخيه|نصرت أخي|تنصر أخاك|لا يخذله|يخذل أخاه|خذل أخاه|خذلان أخيه|خذلان الأخ|في حاجة أخيه|من كان في حاجة أخيه|في حاجة إخوانه|قضاء حاجة أخيه|حاجة أخيه|قضاء حوائج الإخوان|كانت في حاجة أخيها|تسلم أخاك|لا تسلم أخاك|لا تسلمه)(?=$|${E})`);
/** The body/building similes of Muslim brotherhood — «كالبنيان»، «كالجسد الواحد»، «توادهم وتراحمهم». */
const AR_BUNYAN = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:كالبنيان|كالجسد|جسد واحد|الجسد الواحد|البنيان يشد|يشد بعضه بعضا|توادهم وتراحمهم|توادهم|تراحمهم|تعاطفهم|مثل المؤمنين في|أشد الأخوة)(?=$|${E})`);
/** عضد/سند (arm/support) count only beside a brother word — «عضد الدولة» is a throne name. */
const AR_UDUD = new RegExp(`${BL}(?:[وبفسك])?(?:ال)?(?:عضد|عضده|عضدها|سند أخيه|سند لأخيه)(?=$|${E})`, "g");

/* ————— حقوق الأخ — the rights a Muslim owes a Muslim ————— */
/** حق الأخ/حقوق الأخوة/حق المسلم على المسلم — the rights vocabulary itself. */
const AR_HAQQ = new RegExp(
  `${BL}(?:[وبفسك])?(?:ال)?(?:حق الأخ|حق أخيه|حقوق الأخوة|حق الإخوة|حقوق الإخوة|حقوق الأخ|حق الأخوة|حق المسلم على المسلم|حقوق المسلم|المسلم على المسلم|المؤمن على المؤمن|حق الضعيف|حقوق الإخوان|بر أخيه|بر أخيه المسلم|صل أخاك|وصل أخيه|وصال الأخ)(?=$|${E})`);
/** The six duties of the famous hadith — عيادة المريض، تشميت العاطس، إجابة الدعوة، اتباع الجنازة —
 *  gated on the rights/brother context so a plain sick-visit report does not count alone. */
const AR_DUTIES = new RegExp(
  `${BL}(?:[وبفس])?(?:ال)?(?:عيادة|عاد المريض|يعود المريض|تشميت|يشمت|شمت العاطس|شمّت|إجابة الدعوة|يجيب الدعوة|أجب الدعوة|اتباع الجنازة|اتبع الجنازة|اتباع الجنائز|إجابة الداعي|نصيحة أخيه|نصح لأخيه|كف أذاه|كف الأذى|رد السلام|إفشاء السلام|أفشوا السلام|إطعام الطعام|تسنيم)(?=$|${E})`, "g");
const DUTY_CONTEXT = /حق|أخيه|أخاه|أخاك|أخوك|أخيك|المسلم على المسلم|أخوة|إخوة|إخوان|المسلم|المؤمن/;

/* ————— محاذير الأخوة — what breaks brotherhood, recorded as brotherhood mentions ————— */
/** The great hadith's own prohibitions — تحاسد، تباغض، تدابر، هجران، ظن السوء على الأخ. */
const AR_TAHDHIR = new RegExp(
  `${BL}(?:[وبفس])?(?:لا تحاسدوا|تحاسدوا|لا تباغضوا|تباغضوا|لا تدابروا|تدابروا|كونوا عباد الله إخوانا|عباد الله إخوانا|لا تحاقدوا|تحاقدوا|تناجشوا|لا تناجشوا|هجر أخاه|يهجر أخاه|هاجر أخاه|هجر أخيه|يهجر أخيه|هجران أخيه|هجران|فوق ثلاث ليال|ثلاث ليال|أكثر من ثلاث|لا يحل لمسلم أن يهجر|لا يحل للمسلم|ظن السوء|سوء الظن|أسيء الظن|يحقر أخاه|يحقر أخيه|يحقره|احتقره|احتقر أخاه|ازدرى أخاه|لا يزدري|بيع على بيع|خطبة على خطبة|لعن أخاه|قاتل أخاه|شتم أخيه|سباب المسلم|أذية أخيه|أهانه|إهانة أخيه|مني أخاه|تنابز)(?=$|${E})`);
/** اغتياب/غيبة الأخ — «أكل لحم أخيه»؛ gated on a brother word elsewhere so generic ghiba stays out. */
const AR_GHIBA_AKH = new RegExp(
  `${BL}(?:[وبفس])?(?:ال)?(?:أكل لحم أخيه|لحم أخيه|يغتاب|اغتاب|غيبة أخيه|اغتاب أخاه|غبت أخاك|غيبته|يغتب|غيبة)(?=$|${E})`, "g");
const BRO_CONTEXT = /أخيه|أخاه|أخيك|أخوك|أخاك|أخوه|أخيها|إخوان|إخوة|أخوة|أخت|أخوات/;
/** حسد gated on a brother word — plain envy reports stay out. */
const AR_HASAD = new RegExp(`${BL}(?:[وبفس])?(?:ال)?(?:حسد|يحسد|حاسد|حسده|حسدهم|الحسد)(?=$|${E})`, "g");

/** Compounds that carry a brotherhood token without a brotherhood sense — «دم الأخوين» is the
 *  dragon's-blood resin of the pharmacopoeia, not two brothers. Stripped before matching. */
const UKHUWWA_FALSE = /(?:دم الأخوين|دم الاخوين|دماء الأخوين)/g;

/** Passage records whose only lexical hit is a verified false positive. Curated escape hatch:
 * tagging a passage `ukhuwwa-browser` also admits it (see pick in export-api). */
export const UKHUWWA_EXCLUDE = new Set<string>([]);

/** topic for each signal name. */
const SIGNAL_TOPICS: Record<string, UkhuwwaTopic> = {
  ukhuwwa_noun: "ikwha", ikhwan: "ikwha", ukht: "ikwha", faith_bro: "ikwha",
  akh_possessed: "ikwha", akh_construct: "ikwha",
  muakhat: "muakhat", ansar_pair: "muakhat",
  hubb_fillah: "hubb", tahabb: "hubb", hubb_liakh: "hubb",
  ithar: "ithar", nasr_akh: "ithar", bunyan: "ithar",
  haqq: "huquq", duties: "huquq",
  tahdhir: "tahdhir", ghiba_akh: "tahdhir", hasad_akh: "tahdhir",
};

/** The matched signal names for a passage, or [] when it is not about brotherhood in Islam. */
export function ukhuwwaSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  // Only the passage's own text counts: labels and summaries are museum metadata and can name
  // «كتاب الإخاء» of a hadith collection without the passage itself being a brotherhood report.
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(DIACRITICS, "")
    .replace(UKHUWWA_FALSE, "");
  if (!raw || UKHUWWA_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  const has = (re: RegExp) => re.test(raw);

  /* ikwha */
  if (has(AR_UKHUWWA_NOUN)) hits.add("ukhuwwa_noun");
  if (has(AR_IKHWAN)) hits.add("ikhwan");
  if (has(AR_UKHT)) hits.add("ukht");
  if (has(AR_FAITH_BRO)) hits.add("faith_bro");
  if (has(AR_AKH_CONSTRUCT)) hits.add("akh_construct");
  for (const m of raw.matchAll(AR_AKH_POSSESSED)) {
    const before = raw.slice(Math.max(0, m.index! - 10), m.index!);
    if (!ISNAD_BEFORE.test(before) || BRO_CONTEXT.test(raw)) { hits.add("akh_possessed"); break; }
  }

  /* muakhat */
  if (has(AR_MUAKHAT)) hits.add("muakhat");
  for (const m of raw.matchAll(AR_ANSAR_PAIR)) {
    const window = raw.slice(Math.max(0, m.index! - 60), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 60);
    if (MUAKHAT_CONTEXT.test(window)) { hits.add("ansar_pair"); break; }
  }

  /* hubb */
  if (has(AR_HUBB_FILLAH)) hits.add("hubb_fillah");
  if (has(AR_TAHABB)) hits.add("tahabb");
  if (has(AR_HUBB_LIAKH)) hits.add("hubb_liakh");

  /* ithar */
  if (has(AR_ITHAR_NOUN)) hits.add("ithar");
  for (const m of raw.matchAll(AR_ATHARA_BARE)) {
    const window = raw.slice(Math.max(0, m.index! - 50), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 50);
    if (BRO_CONTEXT.test(window)) { hits.add("ithar"); break; }
  }
  for (const m of raw.matchAll(AR_ITHAR_VERB)) {
    const after = raw.slice(m.index! + m[0].length, m.index! + m[0].length + 25);
    if (ITHAR_AFTER.test(after) || BRO_CONTEXT.test(raw)) { hits.add("ithar"); break; }
  }
  if (has(AR_NASR_AKH)) hits.add("nasr_akh");
  if (has(AR_BUNYAN)) hits.add("bunyan");
  for (const m of raw.matchAll(AR_UDUD)) {
    const window = raw.slice(Math.max(0, m.index! - 50), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 50);
    if (BRO_CONTEXT.test(window)) { hits.add("bunyan"); break; }
  }

  /* huquq */
  if (has(AR_HAQQ)) hits.add("haqq");
  for (const m of raw.matchAll(AR_DUTIES)) {
    const window = raw.slice(Math.max(0, m.index! - 60), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 60);
    if (DUTY_CONTEXT.test(window)) { hits.add("duties"); break; }
  }

  /* tahdhir */
  if (has(AR_TAHDHIR)) hits.add("tahdhir");
  for (const m of raw.matchAll(AR_GHIBA_AKH)) {
    const window = raw.slice(Math.max(0, m.index! - 50), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 50);
    if (BRO_CONTEXT.test(window)) { hits.add("ghiba_akh"); break; }
  }
  for (const m of raw.matchAll(AR_HASAD)) {
    const window = raw.slice(Math.max(0, m.index! - 50), m.index!) + raw.slice(m.index! + m[0].length, m.index! + m[0].length + 50);
    if (BRO_CONTEXT.test(window)) { hits.add("hasad_akh"); break; }
  }

  return [...hits];
}

/** True when the passage reports or mentions brotherhood in Islam in any of the six families. */
export function isUkhuwwaPassage(n: Node): boolean {
  return ukhuwwaSignalsOf(n).length > 0;
}

/** The brotherhood topics a passage touches: every family whose signals hit. */
export function ukhuwwaTopicsOf(n: Node): UkhuwwaTopic[] {
  const topics = new Set<UkhuwwaTopic>();
  for (const s of ukhuwwaSignalsOf(n)) {
    const t = SIGNAL_TOPICS[s];
    if (t) topics.add(t);
  }
  return [...topics];
}

/**
 * Which corpus an ukhuwwa passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function ukhuwwaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): UkhuwwaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `ukhuwwa-<section>` when present, else `curated`. */
export function ukhuwwaTagSection(n: Node): UkhuwwaSection {
  const tag = n.tags.find((t) => t.startsWith("ukhuwwa-") && t !== UKHUWWA_TAG);
  const id = tag?.slice(8) ?? "curated";
  return (UKHUWWA_SECTIONS as readonly string[]).includes(id) ? (id as UkhuwwaSection) : "curated";
}
