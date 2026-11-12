// The Hasanat and Sayyi'at Ledger's shared reads (docs/plan/50-hisab-browser.md): the list of
// every passage that counts, writes, multiplies, erases, weighs or reckons a deed, and the
// calculator rows read from the `reckoning` block of the curated records — all over the one
// graph. Passages are found by the shared detector in scripts/hisab.ts at build time, so a
// counting text in a book harvested later appears here the day its passage record lands;
// curated records join through the `hisab-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { hisabCorpusOf, hisabKindsOf, hisabSignalsOf, isHisabPassage, reckoningOf, HISAB_TAG, type HisabKind, type HisabSection, type Reckoning } from "../../../scripts/hisab";
import type { Node } from "../../../scripts/build-graph";

export { HISAB_SECTIONS, HISAB_KINDS, type HisabKind, type HisabSection, type Reckoning } from "../../../scripts/hisab";

export interface HisabItem {
  node: Node;
  section: HisabSection;
  /** What the passage does in the ledger; a curated row carries the effect of its reckoning. */
  kinds: HisabKind[];
  signals: string[];
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const hisabItems: HisabItem[] = realNodes
  .filter((n) => n.tags.includes(HISAB_TAG) || isHisabPassage(n))
  .map((n) => {
    const passage = n.class === "passage";
    const r = reckoningOf(n);
    return {
      node: n,
      section: passage
        ? hisabCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
        : ("curated" as HisabSection),
      kinds: passage ? hisabKindsOf(n) : r ? [r.effect] : [],
      signals: passage ? hisabSignalsOf(n) : [],
      work: passage ? byId.get(n.data.work as string) : undefined,
    };
  })
  .sort((a, b) => a.section.localeCompare(b.section) || a.node.id.localeCompare(b.node.id, "en", { numeric: true }));

export interface HisabRow { node: Node; reckoning: Reckoning; basis: Node[] }

/** The calculator rows: curated records with a `reckoning` block, in the order the records give (the rule of the count first). */
export const hisabRows: HisabRow[] = realNodes
  .map((n) => ({ node: n, reckoning: reckoningOf(n) }))
  .filter((r): r is { node: Node; reckoning: Reckoning } => r.reckoning !== null)
  .map((r) => ({ ...r, basis: (r.reckoning.basis ?? []).map((id) => byId.get(id)).filter((b): b is Node => !!b) }))
  .sort((a, b) => (Number(a.node.data.order) || 999) - (Number(b.node.data.order) || 999) || a.node.id.localeCompare(b.node.id));
