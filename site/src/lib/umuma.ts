// The Umuma (Motherhood in Islam) Browser's shared reads (docs/plan/63-umuma-browser.md): every
// report of the mother and her standing, pregnancy, childbirth, nursing, the custody and raising
// of children and dutifulness to parents that the museum's sources carry — Qur'an verses, hadith
// reports, seerah books and every other harvested work — plus the curated records about
// motherhood, all over the one graph. Passages are found by the shared detector in
// scripts/umuma.ts at build time, so a motherhood report in a book harvested later appears here
// the day its passage record lands; curated records join through the `umuma-browser` tag. The
// famous mothers come from the graph's own `child_of` edges to female parents — no side list
// anywhere.
import { byId, graph, realNodes } from "./graph";
import { umumaCorpusOf, umumaSignalsOf, umumaTagSection, umumaTopicsOf, UMUMA_TAG, isUmumaPassage, type UmumaSection, type UmumaTopic } from "../../../scripts/umuma";
import type { Node } from "../../../scripts/build-graph";

export { UMUMA_SECTIONS, type UmumaSection, type UmumaTopic } from "../../../scripts/umuma";

export interface UmumaItem {
  node: Node;
  section: UmumaSection;
  /** The motherhood topics the passage touches (umm, haml, wilada, radaa, tarbiya, birr). */
  topics: UmumaTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const umumaItems: UmumaItem[] = realNodes
  .filter((n) => n.tags.includes(UMUMA_TAG) || isUmumaPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? umumaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : umumaTagSection(n),
    topics: n.class === "passage" ? umumaTopicsOf(n) : [],
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** A mother on record: the graph's forward `child_of` edges whose parent end is a woman
 *  (inverses are computed, so the edge is written once and seen here once). */
export interface UmumaMother { mother: Node; child: Node; sources: string[] }
export const umumaMothers: UmumaMother[] = graph.edges
  .filter((e) => e.type === "child_of" && !e.inverse)
  .map((e) => ({ child: byId.get(e.from)!, mother: byId.get(e.to)!, sources: e.sources ?? [] }))
  .filter((c) => c.child && c.mother && !c.child.stub && !c.mother.stub && c.mother.class === "person" && (c.mother.data.gender as string | undefined) === "female")
  .sort((a, b) => a.mother.id.localeCompare(b.mother.id));

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const umumaSignals = (n: Node): string[] => umumaSignalsOf(n);
