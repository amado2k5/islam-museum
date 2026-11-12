// The Janna Browser's shared reads (docs/plan/53-janna-browser.md): which passage records
// mention or describe Paradise (الجنة), and which corpus section each belongs to. Detection
// runs at build time over the compiled graph, so a mention of الجنة in any harvested book —
// and in every book harvested later — appears without any tagging step. Curated records join
// through the `janna-browser` tag instead.
//
// Scope is the Paradise noun family: the Qur'anic names and fixed collocations (الفردوس،
// جنات عدن، جنة المأوى، دار السلام، جنة النعيم، جنة الخلد، الفردوس الأعلى، مقام أمين…),
// the people-of-Paradise collocations (أهل الجنة، أصحاب الجنة، ولدان الجنة، حور العين),
// and the gated definite/indefinite noun «الجنة/جنات/جنان» which counts only beside a
// Paradise collocation (rivers, degrees, gates, eternity, reward) so a worldly garden
// («كانت له جنتان»، «جنة من نخيل») stays out. Out of scope by design: the jinn family
// (الجن، الجنة never shares a boundary with جن by letter-guard), the fasting-shield matn
// «الصيام جنة» (masked before matching), and the verb جَنَّ forms.
import type { Node } from "./build-graph.js";

export const JANNA_TAG = "janna-browser";
/** Page sections: the four passage corpora, then the curated records. */
export const JANNA_SECTIONS = ["quran", "sunnah", "seerah", "books", "curated"] as const;
export type JannaSection = (typeof JANNA_SECTIONS)[number];
export type JannaCorpus = Exclude<JannaSection, "curated">;
/** Two flavours: `description` paints Paradise, `mention` names it in passing. */
export type JannaKind = "description" | "mention";

/** Boundary characters around a token: whitespace, Arabic/Latin quotes, brackets, punctuation, Quranic pause marks. */
const B = String.raw`[\s«»"'\(\)\[\]{},،.;:!؟?\-ۖۗ]`;
const BL = String.raw`(?:^|${B})`;
const E = String.raw`(?:$|${B})`;

/** Arabic diacritics and tatweel stripped before matching; text_search is preferred, text is the fallback. */
const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;

const PRE = String.raw`(?:[وبفسلك]){0,2}`;
const ART = String.raw`(?:ال)?`;

/**
 * The fasting-shield matn «الصيام جنة» (fasting is a shield) — masked before matching so
 * the indefinite «جنة» after «الصيام» can never read as Paradise. Matches الصوم جنة too.
 */
const SHIELD = /الص(?:يام|وم)\s+(?:جنة|وجنة)/g;

/** Strong hits — unambiguous Paradise names and collocations, no gate needed. */
const STRONG: [string, RegExp][] = [
  ["firdaws", new RegExp(`${BL}${PRE}الفردوس(?=$|${B})`)],
  ["jannat-adn", new RegExp(`${BL}${PRE}جنات\\s+عدن(?=$|${B})`)],
  ["jannat-al-naim", new RegExp(`${BL}${PRE}${ART}جن[ةات]\\s+النعيم(?=$|${B})`)],
  ["jannat-al-khuld", new RegExp(`${BL}${PRE}${ART}جن[ةات]\\s+الخلد(?=$|${B})`)],
  ["jannat-al-mawa", new RegExp(`${BL}${PRE}جنة\\s+الما[ءو]ى(?=$|${B})`)],
  ["jannat-al-firdaws", new RegExp(`${BL}${PRE}${ART}جن[ةات]\\s+الفردوس(?=$|${B})`)],
  ["dar-al-salam", new RegExp(`${BL}${PRE}دار\\s+السلام(?=$|${B})`)],
  ["dar-al-janna", new RegExp(`${BL}${PRE}دار\\s+الجنة(?=$|${B})`)],
  ["ahl-al-janna", new RegExp(`${BL}${PRE}ا[هه]ل\\s+الجنة(?=$|${B})`)],
  ["ashab-al-janna", new RegExp(`${BL}${PRE}اصحاب\\s+الجنة(?=$|${B})`)],
  ["hur-al-ayn", new RegExp(`${BL}${PRE}حور(\\s+ال)?عين(?=$|${B})`)],
  ["wildan", new RegExp(`${BL}${PRE}ولدان\\s+مخلدون(?=$|${B})`)],
  ["ghuraf", new RegExp(`${BL}${PRE}غرف[ةات]?\\s+من\\s+فوقها\\s+غرف|${BL}${PRE}الغرفات\\s+الجنة(?=$|${B})`)],
  ["shajarat-tuba", new RegExp(`${BL}${PRE}طوبى(?=$|${B})`)],
  ["al-kawthar", new RegExp(`${BL}${PRE}الكوثر(?=$|${B})`)],
  ["tasnim", new RegExp(`${BL}${PRE}تسنيم(?=$|${B})`)],
  ["salsabil", new RegExp(`${BL}${PRE}سلسبيلا?(?=$|${B})`)],
  ["maqam-amin", new RegExp(`${BL}${PRE}مقام\\s+امين(?=$|${B})`)],
];

/**
 * Weak hits — the bare noun «الجنة/جنة/جنات/جنان/الجنان». These count only when a Paradise
 * collocation sits in the window (CONTEXT below); «الجن» the jinn never reaches these
 * patterns because the patterns require the trailing ة/ات/ان.
 */
const WEAK = new RegExp(`${BL}${PRE}(?:الجنة|الجنات|جنة|جنات|جنان|الجنان)(?=$|${B})`, "g");

/**
 * Paradise context that upgrades a weak «الجنة» hit: eternity and reward vocabulary,
 * the rivers/trees/soil/degrees/gates of Paradise, and the Fire counterpoint
 * («الجنة والنار» is always the afterlife pair).
 */
const CONTEXT = new RegExp(
  `خلد|خالدين|خالدا|نعيم|رضوان|اجر|ثواب|جزاء|فردوس|عدن|سلام|م[اا]وى|` +
  `انهار|نهر|عين|عيون|شجر|طوبى|زقوم|كوثر|تسنيم|سلسبيل|رحيق|مسك|كافور|` +
  `ابواب|باب|درجات|درجة|رفيق|حور|ولدان|غرف|قصور|قصر|فراش|سندس|استبرق|` +
  `النار|جهنم|سعير|حطمة|جحيم|نارا|نار\\s|اهل\\s+النار|اصحاب\\s+النار|` +
  `ادخل|يدخل|دخل|فاز|فلاح|مفلحون|جنتين|سبع\\s+سماوات|الرفيق\\s+الاعلى`,
);

/**
 * Passage records whose only lexical hit is a verified false positive. Curated escape
 * hatch: tagging a passage `janna-browser` also admits it (see pick in export-api).
 */
export const JANNA_EXCLUDE = new Set<string>([
  // «وكلا الجنتين آتت أكلها» الكهف 33 — the worldly two gardens of the parable of the
  // garden-owner; the indefinite «الجنتين» here means orchards, not Paradise.
  "passage/quran-18-33",
  "passage/quran-34-15",
  "passage/quran-34-16",
]);

/** The matched signal names for a passage, or [] when it does not mention Paradise. */
export function jannaSignalsOf(n: Node): string[] {
  if (n.class !== "passage" || n.stub) return [];
  const raw = [n.data.text_search, n.data.text]
    .filter(Boolean)
    .join(" ")
    .replace(/[ٰٱ]/g, "ا")
    .replace(DIACRITICS, "")
    .replace(SHIELD, "الصيام وقاية");
  if (!raw || JANNA_EXCLUDE.has(n.id)) return [];
  const hits = new Set<string>();
  for (const [name, re] of STRONG) if (re.test(raw)) hits.add(name);
  for (const m of raw.matchAll(WEAK)) {
    const window = raw.slice(Math.max(0, m.index! - 60), m.index! + 90);
    if (CONTEXT.test(window)) {
      hits.add("janna");
      break;
    }
  }
  return [...hits];
}

/** True when the passage mentions or describes Paradise (الجنة). */
export function isJannaPassage(n: Node): boolean {
  return jannaSignalsOf(n).length > 0;
}

const DESCRIPTION_SIGNALS = new Set([
  "hur-al-ayn", "wildan", "ghuraf", "shajarat-tuba", "al-kawthar",
  "tasnim", "salsabil", "maqam-amin", "jannat-adn", "jannat-al-naim",
  "jannat-al-khuld", "jannat-al-mawa", "jannat-al-firdaws", "firdaws",
]);

/** The dominant flavour of a detected passage: does it paint Paradise or name it in passing? */
export function jannaKindOf(n: Node): JannaKind | null {
  const signals = jannaSignalsOf(n);
  if (!signals.length) return null;
  return signals.some((s) => DESCRIPTION_SIGNALS.has(s)) ? "description" : "mention";
}

/**
 * Which corpus a janna passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function jannaCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): JannaCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `janna-<section>` when present, else `curated`. */
export function jannaTagSection(n: Node): JannaSection {
  const tag = n.tags.find((t) => t.startsWith("janna-") && t !== JANNA_TAG);
  const id = tag?.slice(6) ?? "curated";
  return (JANNA_SECTIONS as readonly string[]).includes(id) ? (id as JannaSection) : "curated";
}
