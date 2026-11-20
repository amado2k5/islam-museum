// The Rulings Browser's shared reads (docs/plan/72-ahkam-browser.md): every mention of the obligations
// (individual and communal), the acts of obedience, the obligatory, the recommended, the forbidden,
// the disliked, the minor sins and the permitted in the Qur'an, the hadith reports, the seerah books
// and every harvested work, plus the curated records, all over the one graph. Qur'an verses come from
// the reviewed table and other passages from the guarded lexicon in scripts/ahkam.ts at build time, so
// a mention in a book harvested later appears here the day its passage record lands; curated records
// join through the `ahkam-browser` tag and name their theme with `ahkam-<topic>`. There is no side list.
import { byId, realNodes } from "./graph";
import { ahkamCorpusOf, ahkamSignalsOf, ahkamTopicsOf, AHKAM_SECTIONS, AHKAM_TAG, AHKAM_TOPICS, isAhkamPassage, type AhkamSection, type AhkamTopic } from "../../../scripts/ahkam";
import type { Node } from "../../../scripts/build-graph";

export { AHKAM_SECTIONS, AHKAM_TOPICS, AHKAM_SCALE, type AhkamSection, type AhkamTopic } from "../../../scripts/ahkam";
/** The museum record each theme points at. */
export const AHKAM_RECORD: Record<AhkamTopic, string> = { fard: "concept/fard", "fard-ayn": "concept/fard-ayn", "fard-kifaya": "concept/fard-kifaya", taat: "concept/taa", wajib: "concept/wajib-fiqh", mustahabb: "concept/nadb", haram: "concept/haram-hukm", makruh: "concept/makruh", saghair: "concept/minor-sins-saghair", mubah: "concept/ibaha" };

export interface AhkamItem {
  node: Node;
  section: AhkamSection;
  /** The themes the record belongs to; a passage can carry more than one. */
  topics: AhkamTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;
/** Mushaf order for ayahs, then the id: so a theme's verses read in the order of the Book. */
const orderKey = (n: Node) => (n.data.sura && n.data.aya ? `${String(n.data.sura).padStart(3, "0")}-${String(n.data.aya).padStart(3, "0")}` : n.id);

export const ahkamItems: AhkamItem[] = realNodes
  .filter((n) => n.tags.includes(AHKAM_TAG) || isAhkamPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? ahkamCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : ("curated" as AhkamSection),
    topics: ahkamTopicsOf(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => AHKAM_SECTIONS.indexOf(a.section) - AHKAM_SECTIONS.indexOf(b.section) || orderKey(a.node).localeCompare(orderKey(b.node)));

/** One theme's records, answers first: the curated records, then the Qur'an, the Sunnah, the seerah, the other books. */
const TOPIC_ORDER: AhkamSection[] = ["curated", "quran", "sunnah", "seerah", "books"];
export const ahkamTopicGroups: { id: AhkamTopic; items: AhkamItem[] }[] = AHKAM_TOPICS.map((id) => ({
  id,
  items: ahkamItems.filter((i) => i.topics.includes(id)).sort((a, b) => TOPIC_ORDER.indexOf(a.section) - TOPIC_ORDER.indexOf(b.section)),
}));

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const ahkamSignals = (n: Node): string[] => ahkamSignalsOf(n);
