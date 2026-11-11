// The Sayyi'at Browser's shared reads (docs/plan/44-sayyiat-browser.md): every mention of
// «السيئات» and the sins theme the museum's sources carry — Qur'an verses, hadith reports,
// seerah books and every other harvested work — plus the curated records on sins, all over
// the one graph. Passages are found by the shared detector in scripts/sayyiat.ts at build
// time, so a sin mention in a book harvested later appears here the day its passage record
// lands; curated records join through the `sayyiat-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { sayyiatCorpusOf, sayyiatKindOf, sayyiatSignalsOf, sayyiatTagSection, SAYYIAT_TAG, isSayyiatPassage, type SayyiatKind, type SayyiatSection } from "../../../scripts/sayyiat";
import type { Node } from "../../../scripts/build-graph";

export { SAYYIAT_SECTIONS, type SayyiatKind, type SayyiatSection } from "../../../scripts/sayyiat";

export interface SayyiatItem {
  node: Node;
  section: SayyiatSection;
  /** `sayyi` when the passage carries the «سيّئ» family, `related` for the wider sins theme. */
  kind: SayyiatKind | null;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const sayyiatItems: SayyiatItem[] = realNodes
  .filter((n) => n.tags.includes(SAYYIAT_TAG) || isSayyiatPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? sayyiatCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : sayyiatTagSection(n),
    kind: n.class === "passage" ? sayyiatKindOf(n) : null,
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const sayyiatSignals = (n: Node): string[] => sayyiatSignalsOf(n);
