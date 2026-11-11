// The Hasanat Browser's shared reads (docs/plan/45-hasanat-browser.md): every mention of the
// good deeds (al-hasanat) the museum's sources carry — Qur'an verses, hadith reports, seerah
// books and every other harvested work — plus the curated records about good deeds, all over
// the one graph. Passages are found by the shared detector in scripts/hasanat.ts at build
// time, so a mention of الحسنات in a book harvested later appears here the day its passage
// record lands; curated records join through the `hasanat-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { hasanatCorpusOf, hasanatKindOf, hasanatSignalsOf, hasanatTagSection, HASANAT_TAG, isHasanatPassage, type HasanatKind, type HasanatSection } from "../../../scripts/hasanat";
import type { Node } from "../../../scripts/build-graph";

export { HASANAT_SECTIONS, type HasanatKind, type HasanatSection } from "../../../scripts/hasanat";

export interface HasanatItem {
  node: Node;
  section: HasanatSection;
  /** The dominant term family of the passage: plural «الحسنات», singular «حسنة» or «الحسنى». */
  kind: HasanatKind | null;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const hasanatItems: HasanatItem[] = realNodes
  .filter((n) => n.tags.includes(HASANAT_TAG) || isHasanatPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? hasanatCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : hasanatTagSection(n),
    kind: n.class === "passage" ? hasanatKindOf(n) : null,
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const hasanatSignals = (n: Node): string[] => hasanatSignalsOf(n);
