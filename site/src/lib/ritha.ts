// The Elegy and Death-Announcement Browser's shared reads (docs/plan/72-ritha-browser.md,
// «متصفح أشهر ما قيل في الرثاء والنعي»): every elegy, death announcement, word of condolence
// and report of weeping and wailing the museum's sources carry — Qur'an verses, hadith
// reports, seerah books, Companion and Successor reports and every other harvested work,
// plus the curated records — all over the one graph. Passages are found by the shared
// detector in scripts/ritha.ts at build time, so a book harvested later appears here the day
// its passage records land; curated records join through the `ritha-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import {
  isRithaPassage,
  rithaCorpusOf,
  rithaKindOf,
  rithaTagKind,
  rithaTagSection,
  RITHA_KINDS,
  RITHA_SECTIONS,
  RITHA_TAG,
  type RithaKind,
  type RithaSection,
} from "../../../scripts/ritha";
import type { Node } from "../../../scripts/build-graph";

export { RITHA_KINDS, RITHA_SECTIONS, type RithaKind, type RithaSection };

export interface RithaItem {
  node: Node;
  section: RithaSection;
  /** elegy / death announcement / condolence / weeping and wailing. */
  kind: RithaKind | null;
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const rithaItems: RithaItem[] = realNodes
  .filter((n) => n.tags.includes(RITHA_TAG) || isRithaPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? rithaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : rithaTagSection(n),
    kind: n.class === "passage" ? rithaKindOf(n) : rithaTagKind(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });
