// The Du'a Browser's shared reads (docs/plan/43-dua-browser.md): every supplication the museum's
// sources mention — Qur'an verses, hadith reports, seerah books and every other harvested work —
// plus the curated records about supplication, all over the one graph. Passages are found by
// the shared detector in scripts/dua.ts at build time, so a supplication in a book harvested
// later appears here the day its passage record lands; curated records join through the
// `dua-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { duaCorpusOf, duaKindOf, duaSignalsOf, duaTagSection, DUA_TAG, isDuaPassage, type DuaKind, type DuaSection } from "../../../scripts/dua";
import type { Node } from "../../../scripts/build-graph";

export { DUA_SECTIONS, type DuaKind, type DuaSection } from "../../../scripts/dua";

export interface DuaItem {
  node: Node;
  section: DuaSection;
  /** `formula` when the passage carries a supplication, `mention` when it is only about one. */
  kind: DuaKind | null;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const duaItems: DuaItem[] = realNodes
  .filter((n) => n.tags.includes(DUA_TAG) || isDuaPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? duaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : duaTagSection(n),
    kind: n.class === "passage" ? duaKindOf(n) : null,
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const duaSignals = (n: Node): string[] => duaSignalsOf(n);
