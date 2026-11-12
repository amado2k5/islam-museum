// The Janna Browser's shared reads (docs/plan/45-janna-browser.md): every mention of the
// Paradise (al-janna) the museum's sources carry — Qur'an verses, hadith reports, seerah
// books and every other harvested work — plus the curated records about Paradise, all over
// the one graph. Passages are found by the shared detector in scripts/janna.ts at build
// time, so a mention of الجنة in a book harvested later appears here the day its passage
// record lands; curated records join through the `janna-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { jannaCorpusOf, jannaKindOf, jannaSignalsOf, jannaTagSection, JANNA_TAG, isJannaPassage, type JannaKind, type JannaSection } from "../../../scripts/janna";
import type { Node } from "../../../scripts/build-graph";

export { JANNA_SECTIONS, type JannaKind, type JannaSection } from "../../../scripts/janna";

export interface JannaItem {
  node: Node;
  section: JannaSection;
  /** The dominant term family of the passage: plural «الجنة», singular «حسنة» or «الحسنى». */
  kind: JannaKind | null;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const jannaItems: JannaItem[] = realNodes
  .filter((n) => n.tags.includes(JANNA_TAG) || isJannaPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? jannaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : jannaTagSection(n),
    kind: n.class === "passage" ? jannaKindOf(n) : null,
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const jannaSignals = (n: Node): string[] => jannaSignalsOf(n);
