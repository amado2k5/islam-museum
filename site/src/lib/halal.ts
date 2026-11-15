// The Halal and Haram Browser's shared reads (docs/plan/58-halal-haram-browser.md): every
// mention of «الحلال والحرام» — what God made lawful and what He made unlawful — in the
// Qur'an, the hadith reports, the seerah books and every harvested work, plus the curated
// records, all over the one graph. Passages are found by the shared detector in
// scripts/halal.ts at build time, so a halal or haram mention in a book harvested later
// appears here the day its passage record lands; curated records join through the
// `halal-haram-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { halalCorpusOf, halalKindOf, halalSignalsOf, halalSubjectsOf, halalTagSection, HALAL_SECTIONS, HALAL_SUBJECTS, HALAL_TAG, isHalalPassage, type HalalKind, type HalalSection, type HalalSubject } from "../../../scripts/halal";
import type { Node } from "../../../scripts/build-graph";

export { HALAL_SECTIONS, HALAL_SUBJECTS, type HalalKind, type HalalSection, type HalalSubject } from "../../../scripts/halal";

export interface HalalItem {
  node: Node;
  section: HalalSection;
  /** `halal` when the passage names only the lawful, `haram` only the unlawful, `both` the two. */
  kind: HalalKind | null;
  /** What the record's lawful or unlawful is about (scripts/halal.ts); `other` when no subject word matched. */
  subjects: HalalSubject[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const halalItems: HalalItem[] = realNodes
  .filter((n) => n.tags.includes(HALAL_TAG) || isHalalPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? halalCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : halalTagSection(n),
    kind: n.class === "passage" ? halalKindOf(n) : null,
    subjects: halalSubjectsOf(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const halalSignals = (n: Node): string[] => halalSignalsOf(n);

/** Answers first inside a subject: the museum's records, then the Qur'an in mushaf order, then the reports and the books. */
const SUBJECT_ORDER: HalalSection[] = ["curated", ...HALAL_SECTIONS.filter((x) => x !== "curated")];
const mushaf = (n: Node) => Number(n.data.sura ?? 0) * 1000 + Number(n.data.aya ?? 0);
/** Every subject with its records, in page order; a record with several subjects stands under each. */
export const halalSubjectGroups: { id: HalalSubject; items: HalalItem[] }[] = HALAL_SUBJECTS.map((id) => ({
  id,
  items: halalItems
    .filter((i) => i.subjects.includes(id))
    .sort((a, b) => SUBJECT_ORDER.indexOf(a.section) - SUBJECT_ORDER.indexOf(b.section) || (a.section === "quran" ? mushaf(a.node) - mushaf(b.node) : 0) || a.node.id.localeCompare(b.node.id)),
}));
if (halalItems.some((i) => i.subjects.length === 0)) throw new Error("halal: a record has no subject, not even `other`");
