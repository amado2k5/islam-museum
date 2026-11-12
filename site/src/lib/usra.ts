// The Usra (Family and Marriages) Browser's shared reads (docs/plan/54-usra-browser.md): every
// report of marriage, family, dwellings, livelihood, daily life and social customs the museum's
// sources carry — Qur'an verses, hadith reports, seerah books and every other harvested work —
// plus the curated records about the Muslim family, all over the one graph. Passages are found by
// the shared detector in scripts/usra.ts at build time, so a family-life report in a book
// harvested later appears here the day its passage record lands; curated records join through the
// `usra-browser` tag. The famous marriages come from the graph's own `spouse_of` edges — no side
// list anywhere.
import { byId, graph, realNodes } from "./graph";
import { usraCorpusOf, usraSignalsOf, usraTagSection, usraTopicsOf, USRA_TAG, isUsraPassage, type UsraSection, type UsraTopic } from "../../../scripts/usra";
import type { Node } from "../../../scripts/build-graph";

export { USRA_SECTIONS, type UsraSection, type UsraTopic } from "../../../scripts/usra";

export interface UsraItem {
  node: Node;
  section: UsraSection;
  /** The family-life topics the passage touches (zawaj, usra, maskan, maisha, yawmi, adat). */
  topics: UsraTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const usraItems: UsraItem[] = realNodes
  .filter((n) => n.tags.includes(USRA_TAG) || isUsraPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? usraCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : usraTagSection(n),
    topics: n.class === "passage" ? usraTopicsOf(n) : [],
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** A marriage pair from the graph's forward `spouse_of` edges (inverses are computed, so the
 *  edge is written once and seen here once). */
export interface UsraCouple { a: Node; b: Node; sources: string[] }
export const usraCouples: UsraCouple[] = graph.edges
  .filter((e) => e.type === "spouse_of" && !e.inverse)
  .map((e) => ({ a: byId.get(e.from)!, b: byId.get(e.to)!, sources: e.sources ?? [] }))
  .filter((c) => c.a && c.b && !c.a.stub && !c.b.stub)
  .sort((a, b) => a.a.id.localeCompare(b.a.id));

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const usraSignals = (n: Node): string[] => usraSignalsOf(n);
