// The Hudud Allah and Kaba'ir Browser's shared reads (docs/plan/52-hudud-browser.md): every
// mention of «حدود الله» — the limits God set and the penalties He prescribed — and
// «الكبائر», the major sins, in the Qur'an, the hadith reports, the seerah books and every
// harvested work, plus the curated records, all over the one graph. Passages are found by
// the shared detector in scripts/hudud.ts at build time, so a hudud or kaba'ir mention in
// a book harvested later appears here the day its passage record lands; curated records
// join through the `hudud-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { hududCorpusOf, hududKindOf, hududSignalsOf, hududTagSection, HUDUD_TAG, isHududPassage, type HududKind, type HududSection } from "../../../scripts/hudud";
import type { Node } from "../../../scripts/build-graph";

export { HUDUD_SECTIONS, type HududKind, type HududSection } from "../../../scripts/hudud";

export interface HududItem {
  node: Node;
  section: HududSection;
  /** `hudud` when the passage carries the limits/penalties theme, `kabair` for major sins. */
  kind: HududKind | null;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const hududItems: HududItem[] = realNodes
  .filter((n) => n.tags.includes(HUDUD_TAG) || isHududPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? hududCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : hududTagSection(n),
    kind: n.class === "passage" ? hududKindOf(n) : null,
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const hududSignals = (n: Node): string[] => hududSignalsOf(n);
