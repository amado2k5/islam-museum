// The Pillars and Branches of Faith Browser's shared reads (docs/plan/61-arkan-browser.md): every
// mention of «أركان الإسلام», «أركان الإيمان», «شعب الإيمان» and «خصال المؤمن» in the Qur'an, the
// hadith reports, the seerah books and every harvested work, plus the curated records, all over
// the one graph. Qur'an verses come from the reviewed table and other passages from the guarded
// lexicon in scripts/arkan.ts at build time, so a mention in a book harvested later appears here
// the day its passage record lands; curated records join through the `arkan-browser` tag and
// name their theme with `arkan-<topic>`. There is no side list.
import { byId, realNodes } from "./graph";
import { arkanCorpusOf, arkanSignalsOf, arkanTopicsOf, ARKAN_SECTIONS, ARKAN_TAG, ARKAN_TOPICS, isArkanPassage, type ArkanSection, type ArkanTopic } from "../../../scripts/arkan";
import type { Node } from "../../../scripts/build-graph";

export { ARKAN_SECTIONS, ARKAN_TOPICS, type ArkanSection, type ArkanTopic } from "../../../scripts/arkan";

export interface ArkanItem {
  node: Node;
  section: ArkanSection;
  /** The themes the record belongs to; a passage can carry more than one. */
  topics: ArkanTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;
/** Mushaf order for ayahs, then the id: so a theme's verses read in the order of the Book. */
const orderKey = (n: Node) => (n.data.sura && n.data.aya ? `${String(n.data.sura).padStart(3, "0")}-${String(n.data.aya).padStart(3, "0")}` : n.id);

export const arkanItems: ArkanItem[] = realNodes
  .filter((n) => n.tags.includes(ARKAN_TAG) || isArkanPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? arkanCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : ("curated" as ArkanSection),
    topics: arkanTopicsOf(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => ARKAN_SECTIONS.indexOf(a.section) - ARKAN_SECTIONS.indexOf(b.section) || orderKey(a.node).localeCompare(orderKey(b.node)));

/** One theme's records, answers first: the curated records, then the Qur'an, the Sunnah, the seerah, the other books. */
const TOPIC_ORDER: ArkanSection[] = ["curated", "quran", "sunnah", "seerah", "books"];
export const arkanTopicGroups: { id: ArkanTopic; items: ArkanItem[] }[] = ARKAN_TOPICS.map((id) => ({
  id,
  items: arkanItems.filter((i) => i.topics.includes(id)).sort((a, b) => TOPIC_ORDER.indexOf(a.section) - TOPIC_ORDER.indexOf(b.section)),
}));

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const arkanSignals = (n: Node): string[] => arkanSignalsOf(n);
