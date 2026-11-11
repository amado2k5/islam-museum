// The Dream Browser's shared reads (docs/plan/35-dreams-browser.md): every dream the museum's
// sources mention — Qur'an ayahs, hadith reports, seerah books and every other harvested work —
// plus the curated concept records about dreams, all over the one graph. Passages are found by
// the shared detector in scripts/dreams.ts at build time, so a dream in a book harvested later
// appears here the day its passage record lands; curated records join through the `dream-browser`
// tag. There is no side list.
import { byId, realNodes } from "./graph";
import { dreamCorpusOf, dreamTagSection, DREAM_TAG, isDreamPassage, type DreamSection } from "../../../scripts/dreams";
import type { Node } from "../../../scripts/build-graph";

export { DREAM_SECTIONS, type DreamSection } from "../../../scripts/dreams";

export interface DreamItem {
  node: Node;
  section: DreamSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const dreamItems: DreamItem[] = realNodes
  .filter((n) => n.tags.includes(DREAM_TAG) || isDreamPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? dreamCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : dreamTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });
