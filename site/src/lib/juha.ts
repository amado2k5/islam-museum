// The Juha and Islamic Folklore Browser's shared reads (docs/plan/72-juha-browser.md): Juha,
// the wits and fools, the anecdotes (نوادر), the jests and the laughter the museum's sources
// carry — Qur'an verses, hadith reports, seerah books, Juha's own anecdote collections and
// every other harvested work — plus the curated records, all over the one graph. Passages are
// found by the shared detector in scripts/juha.ts at build time, so a book harvested later
// appears here the day its passage records land; curated records join through the
// `juha-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { isJuhaPassage, juhaCorpusOf, juhaKindOf, juhaTagKind, juhaTagSection, JUHA_KINDS, JUHA_SECTIONS, JUHA_TAG, type JuhaKind, type JuhaSection } from "../../../scripts/juha";
import type { Node } from "../../../scripts/build-graph";

export { JUHA_KINDS, JUHA_SECTIONS, type JuhaKind, type JuhaSection };

export interface JuhaItem {
  node: Node;
  section: JuhaSection;
  /** juha / wits / anecdote / jest / laughter / ethics — what kind of humour the record carries. */
  kind: JuhaKind | null;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined => (workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined);
const SECTION_ORDER = new Map(JUHA_SECTIONS.map((s, i) => [s, i]));
const natural = new Intl.Collator("en", { numeric: true });

export const juhaItems: JuhaItem[] = realNodes
  .filter((n) => n.tags.includes(JUHA_TAG) || isJuhaPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage" ? juhaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined) : juhaTagSection(n),
    kind: n.class === "passage" ? juhaKindOf(n) : juhaTagKind(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => SECTION_ORDER.get(a.section)! - SECTION_ORDER.get(b.section)! || natural.compare(a.node.id, b.node.id));
