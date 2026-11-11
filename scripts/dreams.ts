// The Dream Browser's shared reads (docs/plan/35-dreams-browser.md): which passage records report or
// mention dreams, and which corpus section each belongs to. Detection runs at build time over the
// compiled graph, so a dream in any harvested book — and in every book harvested later — appears
// without any tagging step. Curated records join through the `dream-browser` tag instead.
import type { Node } from "./build-graph.js";

export const DREAM_TAG = "dream-browser";
/** Page sections: the four passage corpora, then the curated concept records. */
export const DREAM_SECTIONS = ["quran", "sunnah", "seerah", "books", "concepts"] as const;
export type DreamSection = (typeof DREAM_SECTIONS)[number];
export type DreamCorpus = Exclude<DreamSection, "concepts">;

/**
 * Unambiguous Arabic dream vocabulary, matched against the Arabic fields of a passage
 * (matn, normalized search text, Arabic label and summary). Deliberately narrow: «رأى» alone is
 * waking sight, «رؤية» is sight or the vision of God, «كأنه» is a simile, «تبشّر» is glad tidings,
 * «حلم» alone is forbearance, and «تعبير» alone is "expression" — none of those are enough on
 * their own (interpretation passages carry رؤيا/أحلام/منام anyway, so تعبير adds only noise).
 */
const AR_DREAM =
  /في المنام|في منام|في منامه|في منامي|رأيت كأن|رأى كأن|رأينا كأن|أرأيت كأن|ترى كأن|حلمت|أحلام|رؤيا|الرؤيا|منام|حديث نفس|أضغاث|معبّر|مؤول|تؤل|أريت|أُريت/;
/** The saw-in-sleep formula: «رأى … في النوم/نومه/منامه» (the Prophet's and the companions' dream reports). */
const AR_DREAM_SLEEP =
  /(رأى|رأيت|يرى|أرى|ترى|رأوا|أراني|أراه|أرينّا|أريت|أُريت) في (النوم|نومه|نومها|نومهم|نومي|المنام|منامه|منامهم|منامي)/;
/** English fields: the museum's own translations say "dream" plainly; «vision» alone is not enough. */
const EN_DREAM = /\bdream/i;
/** «أحلام العصافير» (bird-brains) is a fool's insult, not a dream report. */
const NOT_DREAMS = /أحلام العصافير/g;

/**
 * Passage records whose only lexical hit is a known false positive. Curated escape hatch:
 * the har-ibn-kab poem's «الأحلام» is the bird-brains insult of its own title, and its
 * companion file says «يحلم» only as a simile of worldly striving.
 */
export const DREAM_EXCLUDE = new Set([
  "passage/poem-hassan-diwan-har-ibn-kab-ala-al-ahlam-tazjurukum-01",
  "passage/poem-hassan-diwan-har-ibn-kab-ala-al-ahlam-tazjurukum-02",
]);

/** True when the passage's own Arabic or English text reports or mentions a dream. */
export function isDreamPassage(n: Node): boolean {
  if (n.class !== "passage" || n.stub || DREAM_EXCLUDE.has(n.id)) return false;
  const ar = [n.data.text, n.data.text_search, n.label?.ar, n.summary?.ar]
    .filter(Boolean)
    .join(" ")
    .replace(NOT_DREAMS, "");
  if (AR_DREAM.test(ar) || AR_DREAM_SLEEP.test(ar)) return true;
  const en = [n.summary?.en, n.label?.en, n.data.translations?.en?.text].filter(Boolean).join(" ");
  return EN_DREAM.test(en);
}

/**
 * Which corpus a dream passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`),
 * and every other harvested work. Works not yet harvested land in the right section by
 * their genre the day their passages arrive.
 */
export function dreamCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): DreamCorpus {
  if (workId === "work/quran") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section tag of a curated record: `dream-<section>` when present, else `concepts`. */
export function dreamTagSection(n: Node): DreamSection {
  const tag = n.tags.find((t) => t.startsWith("dream-") && t !== DREAM_TAG);
  const id = tag?.slice(6) ?? "concepts";
  return (DREAM_SECTIONS as readonly string[]).includes(id) ? (id as DreamSection) : "concepts";
}
