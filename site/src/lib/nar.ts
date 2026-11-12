// The Fire Browser's shared reads (docs/plan/51-nar-browser.md): every mention of النار — the
// Fire — in the museum's sources: Qur'an verses, hadith reports, seerah books and every other
// harvested work, hellfire and worldly fire alike, plus the curated records about the Fire,
// all over the one graph. Passages are found by the shared detector in scripts/nar.ts at build
// time, so a fire mention in a book harvested later appears here the day its passage record
// lands; curated records join through the `nar-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { narKindOf, narSectionOf, narSignalsOf, narTagSection, NAR_TAG, isNarPassage, type NarKind, type NarSection } from "../../../scripts/nar";
import type { Node } from "../../../scripts/build-graph";

export { NAR_SECTIONS, type NarKind, type NarSection } from "../../../scripts/nar";

export interface NarItem {
  node: Node;
  section: NarSection;
  /** `hellfire` when the mention is of the Fire of the hereafter, `worldly` for this world's fire. */
  kind: NarKind | null;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const narItems: NarItem[] = realNodes
  .filter((n) => n.tags.includes(NAR_TAG) || isNarPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage" ? narSectionOf(n, genreOf(n.data.work as string | undefined)) : narTagSection(n),
    kind: n.class === "passage" ? narKindOf(n) : null,
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const narSignals = (n: Node): string[] => narSignalsOf(n);
