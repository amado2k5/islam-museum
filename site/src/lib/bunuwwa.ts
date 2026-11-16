// The Bunuwwa (Sonhood and Daughterhood) Browser's shared reads (docs/plan/63-bunuwwa-browser.md):
// every report of sons and daughters, offspring, filial piety and disobedience, orphans and
// suckling, the child's rights and the named children of the stories the museum's sources
// carry — Qur'an verses, hadith reports, seerah books and every other harvested work — plus
// the curated records on the filial theme, all over the one graph. Passages are found by the
// shared detector in scripts/bunuwwa.ts at build time, so a filial report in a book harvested
// later appears here the day its passage record lands; curated records join through the
// `bunuwwa-browser` tag. The named parents and children come from the graph's own `child_of`
// edges — no side list anywhere.
import { byId, graph, realNodes } from "./graph";
import { bunuwwaCorpusOf, bunuwwaSignalsOf, bunuwwaTagSection, bunuwwaTopicsOf, BUNUWWA_TAG, isBunuwwaPassage, type BunuwwaSection, type BunuwwaTopic } from "../../../scripts/bunuwwa";
import type { Node } from "../../../scripts/build-graph";

export { BUNUWWA_SECTIONS, BUNUWWA_TOPICS, type BunuwwaSection, type BunuwwaTopic } from "../../../scripts/bunuwwa";

export interface BunuwwaItem {
  node: Node;
  section: BunuwwaSection;
  /** The filial topics the passage touches (banun, dhurriyya, birr, yatim, huquq, qisas). */
  topics: BunuwwaTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const bunuwwaItems: BunuwwaItem[] = realNodes
  .filter((n) => n.tags.includes(BUNUWWA_TAG) || isBunuwwaPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? bunuwwaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : bunuwwaTagSection(n),
    topics: n.class === "passage" ? bunuwwaTopicsOf(n) : [],
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** A parent–child pair from the graph's forward `child_of` edges (inverses are computed, so the
 *  edge is written once and seen here once). Only pairs where the parent or the child is a
 *  curated bunuwwa-browser record are drawn — the famous sons and daughters of the stories,
 *  not every genealogy in the graph. */
export interface BunuwwaChild { parent: Node; child: Node; sources: string[] }
export const bunuwwaChildren: BunuwwaChild[] = graph.edges
  .filter((e) => e.type === "child_of" && !e.inverse)
  .map((e) => ({ parent: byId.get(e.to)!, child: byId.get(e.from)!, sources: e.sources ?? [] }))
  .filter((c) => c.parent && c.child && !c.parent.stub && !c.child.stub
    && (c.parent.tags.includes(BUNUWWA_TAG) || c.child.tags.includes(BUNUWWA_TAG)))
  .sort((a, b) => a.parent.id.localeCompare(b.parent.id) || a.child.id.localeCompare(b.child.id));

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const bunuwwaSignals = (n: Node): string[] => bunuwwaSignalsOf(n);
