// The Qiyama Browser's shared reads (docs/plan/54-qiyama-browser.md): every mention of the
// Resurrection (البعث), the Day of Judgement (يوم القيامة) and the Reckoning (الحساب) the
// museum's sources carry — Qur'an verses, hadith reports, seerah books and every other
// harvested work — plus the curated records about the Day and its stations, all over the
// one graph. Passages are found by the shared detector in scripts/qiyama.ts at build time,
// so a qiyama mention in a book harvested later appears here the day its passage record
// lands; curated records join through the `qiyama-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { qiyamaCorpusOf, qiyamaKindOf, qiyamaSignalsOf, qiyamaTagSection, QIYAMA_TAG, isQiyamaPassage, type QiyamaKind, type QiyamaSection } from "../../../scripts/qiyama";
import type { Node } from "../../../scripts/build-graph";

export { QIYAMA_SECTIONS, type QiyamaKind, type QiyamaSection } from "../../../scripts/qiyama";

export interface QiyamaItem {
  node: Node;
  section: QiyamaSection;
  /** The dominant flavour of the passage: raising and gathering, the Day, or the reckoning. */
  kind: QiyamaKind | null;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const qiyamaItems: QiyamaItem[] = realNodes
  .filter((n) => n.tags.includes(QIYAMA_TAG) || isQiyamaPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? qiyamaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : qiyamaTagSection(n),
    kind: n.class === "passage" ? qiyamaKindOf(n) : null,
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const qiyamaSignals = (n: Node): string[] => qiyamaSignalsOf(n);
