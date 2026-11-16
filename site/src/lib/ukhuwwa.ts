// The Ukhuwwa (Brotherhood in Islam) Browser's shared reads (docs/plan/63-ukhuwwa-browser.md): every
// report of brotherhood and sisterhood in Islam the museum's sources carry — the faith-brotherhood
// of «المؤمنون إخوة», the brothers and sisters themselves, the Prophet's brothering of the
// Muhajirun and the Ansar, love for God's sake, altruism and aid, the rights a Muslim owes a
// Muslim, and what breaks brotherhood — Qur'an verses, hadith reports, seerah books and every
// harvested work, plus the curated records about الأخوة, all over the one graph. Passages are
// found by the shared detector in scripts/ukhuwwa.ts at build time, so a brotherhood report in a
// book harvested later appears here the day its passage record lands; curated records join
// through the `ukhuwwa-browser` tag. The brothers and sisters on record come from the graph's own
// `sibling_of` edges — no side list anywhere.
import { byId, graph, realNodes } from "./graph";
import { ukhuwwaCorpusOf, ukhuwwaSignalsOf, ukhuwwaTagSection, ukhuwwaTopicsOf, UKHUWWA_TAG, isUkhuwwaPassage, type UkhuwwaSection, type UkhuwwaTopic } from "../../../scripts/ukhuwwa";
import type { Node } from "../../../scripts/build-graph";

export { UKHUWWA_SECTIONS, type UkhuwwaSection, type UkhuwwaTopic } from "../../../scripts/ukhuwwa";

export interface UkhuwwaItem {
  node: Node;
  section: UkhuwwaSection;
  /** The brotherhood topics the passage touches (ikwha, muakhat, hubb, ithar, huquq, tahdhir). */
  topics: UkhuwwaTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const ukhuwwaItems: UkhuwwaItem[] = realNodes
  .filter((n) => n.tags.includes(UKHUWWA_TAG) || isUkhuwwaPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? ukhuwwaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : ukhuwwaTagSection(n),
    topics: n.class === "passage" ? ukhuwwaTopicsOf(n) : [],
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** A sibling pair from the graph's forward `sibling_of` edges (inverses are computed, so the
 *  edge is written once and seen here once). */
export interface UkhuwwaSiblings { a: Node; b: Node; sources: string[] }
export const ukhuwwaSiblings: UkhuwwaSiblings[] = graph.edges
  .filter((e) => e.type === "sibling_of" && !e.inverse)
  .map((e) => ({ a: byId.get(e.from)!, b: byId.get(e.to)!, sources: e.sources ?? [] }))
  .filter((c) => c.a && c.b && !c.a.stub && !c.b.stub)
  .sort((a, b) => a.a.id.localeCompare(b.a.id));

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const ukhuwwaSignals = (n: Node): string[] => ukhuwwaSignalsOf(n);
