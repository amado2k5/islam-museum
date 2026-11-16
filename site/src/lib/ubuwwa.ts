// The Ubuwwa (Fatherhood) Browser's shared reads (docs/plan/63-ubuwwa-browser.md): every
// report of the father and fatherhood the museum's sources carry — Qur'an verses, hadith
// reports, seerah books and every other harvested work — plus the curated records about the
// father, all over the one graph. Passages are found by the shared detector in
// scripts/ubuwwa.ts at build time, so a fatherhood report in a book harvested later appears
// here the day its passage record lands; curated records join through the `ubuwwa-browser`
// tag. The famous fathers come from the graph's own `parent_of`/`child_of` edges — no side
// list anywhere; a recorded mother never enters the fathers list.
import { byId, graph, realNodes } from "./graph";
import { ubuwwaCorpusOf, ubuwwaSignalsOf, ubuwwaTagSection, ubuwwaTopicsOf, UBUWWA_TAG, isUbuwwaPassage, type UbuwwaSection, type UbuwwaTopic } from "../../../scripts/ubuwwa";
import type { Node } from "../../../scripts/build-graph";

export { UBUWWA_SECTIONS, type UbuwwaSection, type UbuwwaTopic } from "../../../scripts/ubuwwa";

export interface UbuwwaItem {
  node: Node;
  section: UbuwwaSection;
  /** The fatherhood topics the passage touches (ab, birr, tarbiyya, nasab, yatm). */
  topics: UbuwwaTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const ubuwwaItems: UbuwwaItem[] = realNodes
  .filter((n) => n.tags.includes(UBUWWA_TAG) || isUbuwwaPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? ubuwwaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : ubuwwaTagSection(n),
    topics: n.class === "passage" ? ubuwwaTopicsOf(n) : [],
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** A father–child pair from the graph's forward `parent_of` and `child_of` edges (inverses
 *  are computed, so the edge is written once and seen here once). A person recorded female
 *  is a mother and stays out of the fathers list; an unrecorded gender counts as a father
 *  candidate the record may later refine. */
export interface UbuwwaFather { father: Node; child: Node; sources: string[] }
export const ubuwwaFathers: UbuwwaFather[] = graph.edges
  .filter((e) => !e.inverse && (e.type === "parent_of" || e.type === "child_of"))
  .map((e) => {
    const parent = e.type === "parent_of" ? e.from : e.to;
    const child = e.type === "parent_of" ? e.to : e.from;
    return { father: byId.get(parent)!, child: byId.get(child)!, sources: e.sources ?? [] };
  })
  .filter((c) => c.father && c.child && !c.father.stub && !c.child.stub && c.father.data.gender !== "female")
  .sort((a, b) => a.father.id.localeCompare(b.father.id) || a.child.id.localeCompare(b.child.id));

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const ubuwwaSignals = (n: Node): string[] => ubuwwaSignalsOf(n);
