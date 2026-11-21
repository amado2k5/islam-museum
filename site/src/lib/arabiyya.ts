// The Arabic Language Browser's shared reads (docs/plan/73-arabic-language-browser.md): every passage of
// the Qur'an, the hadith, the seerah, the tafsir and the harvested books that speaks about the Arabic
// language, plus the curated records on its history, script, sciences, dialects, world, scholars and
// books — all over the one graph. Passages are found by the shared detector in scripts/arabiyya.ts at
// build time, so a mention in a book harvested later appears here the day its passage record lands;
// curated records join through the `arabiyya-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import {
  ARABIYYA_TAG, ARABIYYA_CORPORA, ARABIYYA_SECTIONS, arabiyyaCorpusOf, arabiyyaTagSection, isArabiyyaPassage,
  type ArabiyyaCorpus, type ArabiyyaSection,
} from "../../../scripts/arabiyya";
import type { Node } from "../../../scripts/build-graph";

export { ARABIYYA_CORPORA, ARABIYYA_SECTIONS, type ArabiyyaCorpus, type ArabiyyaSection } from "../../../scripts/arabiyya";

export interface ArabiyyaPassage { node: Node; corpus: ArabiyyaCorpus; work?: Node }
export interface ArabiyyaRecord { node: Node; section: ArabiyyaSection }

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

/** Detected passages, in corpus order; Qur'an verses in mushaf order, the rest by work then id. */
export const arabiyyaPassages: ArabiyyaPassage[] = realNodes
  .filter((n) => isArabiyyaPassage(n))
  .map((n) => ({
    node: n,
    corpus: arabiyyaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined),
    work: byId.get(n.data.work as string),
  }))
  .sort((a, b) => {
    const r = ARABIYYA_CORPORA.indexOf(a.corpus) - ARABIYYA_CORPORA.indexOf(b.corpus);
    if (r) return r;
    if (a.corpus === "quran") return (Number(a.node.data.sura) - Number(b.node.data.sura)) || (Number(a.node.data.aya) - Number(b.node.data.aya));
    return String(a.node.data.work ?? "").localeCompare(String(b.node.data.work ?? "")) || a.node.id.localeCompare(b.node.id, "en", { numeric: true });
  });

/** Curated records (everything tagged `arabiyya-browser` that is not a passage), in section order. */
export const arabiyyaRecords: ArabiyyaRecord[] = realNodes
  .filter((n) => n.class !== "passage" && n.tags.includes(ARABIYYA_TAG))
  .map((n) => ({ node: n, section: arabiyyaTagSection(n) }))
  .sort((a, b) => {
    const r = ARABIYYA_SECTIONS.indexOf(a.section) - ARABIYYA_SECTIONS.indexOf(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/**
 * The twenty-eight letters in the order al-Khalil ibn Ahmad arranged them in Kitab al-Ayn, from the
 * deepest place of articulation (the throat) outwards to the lips and then the letters of the open
 * mouth — the order the first Arabic dictionary is filed by. Each group is one makhraj.
 */
export const KHALIL_ORDER: { id: string; letters: string[]; hue: string }[] = [
  { id: "halq", letters: ["ع", "ح", "ه", "خ", "غ"], hue: "#9a4f68" },
  { id: "lahat", letters: ["ق", "ك"], hue: "#7a3a5e" },
  { id: "shajr", letters: ["ج", "ش", "ض"], hue: "#b27b42" },
  { id: "asala", letters: ["ص", "س", "ز"], hue: "#c5a059" },
  { id: "nat", letters: ["ط", "د", "ت"], hue: "#4d8a4f" },
  { id: "litha", letters: ["ظ", "ذ", "ث"], hue: "#2e7d52" },
  { id: "dhalq", letters: ["ر", "ل", "ن"], hue: "#2a7b88" },
  { id: "shafa", letters: ["ف", "ب", "م"], hue: "#4a6e8a" },
  { id: "jawf", letters: ["و", "ا", "ي", "ء"], hue: "#6b6b8f" },
];
