// The Halal and Haram Browser's shared reads (docs/plan/58-halal-haram-browser.md): every
// mention of «الحلال والحرام» — what God made lawful and what He made unlawful — in the
// Qur'an, the hadith reports, the seerah books and every harvested work, plus the curated
// records, all over the one graph. Passages are found by the shared detector in
// scripts/halal.ts at build time, so a halal or haram mention in a book harvested later
// appears here the day its passage record lands; curated records join through the
// `halal-haram-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { halalCorpusOf, halalKindOf, halalSignalsOf, halalTagSection, HALAL_TAG, isHalalPassage, type HalalKind, type HalalSection } from "../../../scripts/halal";
import type { Node } from "../../../scripts/build-graph";

export { HALAL_SECTIONS, type HalalKind, type HalalSection } from "../../../scripts/halal";

export interface HalalItem {
  node: Node;
  section: HalalSection;
  /** `halal` when the passage names only the lawful, `haram` only the unlawful, `both` the two. */
  kind: HalalKind | null;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const halalItems: HalalItem[] = realNodes
  .filter((n) => n.tags.includes(HALAL_TAG) || isHalalPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? halalCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : halalTagSection(n),
    kind: n.class === "passage" ? halalKindOf(n) : null,
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const halalSignals = (n: Node): string[] => halalSignalsOf(n);
