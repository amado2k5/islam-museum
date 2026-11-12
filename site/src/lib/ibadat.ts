// The Ibadat and Adhkar Browser's shared reads (docs/plan/51-ibadat-browser.md): every act of
// worship and remembrance the museum's sources mention — Qur'an verses, hadith reports, seerah
// books and every other harvested work — plus the curated records about worship, all over the
// one graph. Passages are found by the shared detector in scripts/ibadat.ts at build time, so an
// act of worship in a book harvested later appears here the day its passage record lands;
// curated records join through the `ibadat-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { ibadatCorpusOf, ibadatKindOf, ibadatSignalsOf, ibadatTagSection, ibadatTopicsOf, IBADAT_TAG, isIbadatPassage, type IbadatKind, type IbadatSection, type IbadatTopic } from "../../../scripts/ibadat";
import type { Node } from "../../../scripts/build-graph";

export { IBADAT_SECTIONS, type IbadatKind, type IbadatSection, type IbadatTopic } from "../../../scripts/ibadat";

export interface IbadatItem {
  node: Node;
  section: IbadatSection;
  /** `act` when the passage performs or commands the worship, `mention` when it is about it. */
  kind: IbadatKind | null;
  /** The worship families the passage touches (salah, sawm, dhikr, dua…). */
  topics: IbadatTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const ibadatItems: IbadatItem[] = realNodes
  .filter((n) => n.tags.includes(IBADAT_TAG) || isIbadatPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? ibadatCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : ibadatTagSection(n),
    kind: n.class === "passage" ? ibadatKindOf(n) : null,
    topics: n.class === "passage" ? ibadatTopicsOf(n) : [],
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const ibadatSignals = (n: Node): string[] => ibadatSignalsOf(n);
