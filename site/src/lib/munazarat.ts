// The Munazarat Browser's shared reads (docs/plan/63-munazarat-browser.md): every
// debate, disputation and exchange of arguments the museum's sources carry — between
// Islam and the other religions and, per the founder's clarification, inside the
// ummah too — Qur'an verses, hadith reports, seerah books and every other harvested
// work, plus the curated records about debates, all over the one graph. Passages are
// found by the shared detector in scripts/munazarat.ts at build time, so a debate in
// a book harvested later appears here the day its passage record lands; curated
// records join through the `munazarat-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import {
  isMunazaratPassage,
  munazaratCorpusOf,
  munazaratKindOf,
  munazaratOpponentOf,
  munazaratSignalsOf,
  munazaratTagSection,
  munazaratTagOpponent,
  MUNAZARAT_SECTIONS,
  MUNAZARAT_TAG,
  type MunazaratKind,
  type MunazaratSection,
  type MunazaratOpponent,
} from "../../../scripts/munazarat";
import type { Node } from "../../../scripts/build-graph";

export { MUNAZARAT_SECTIONS, type MunazaratKind, type MunazaratSection, type MunazaratOpponent };

export interface MunazaratItem {
  node: Node;
  section: MunazaratSection;
  /** `debate` when the passage carries an actual exchange, `mention` when it is about debating. */
  kind: MunazaratKind | null;
  /** scriptuaries / polytheists / intra / other — who the debate is with. */
  opponent: MunazaratOpponent;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const munazaratItems: MunazaratItem[] = realNodes
  .filter((n) => n.tags.includes(MUNAZARAT_TAG) || isMunazaratPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? munazaratCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : munazaratTagSection(n),
    kind: n.class === "passage" ? munazaratKindOf(n) : null,
    opponent: n.class === "passage"
      ? munazaratOpponentOf(n)
      : munazaratTagOpponent(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });
