// The Nuzul Browser's shared reads (docs/plan/75-asbab-nuzul-browser.md): every report
// of an occasion of revelation (sabab al-nuzul) the museum's sources carry — why a
// verse or sura came down, the event or question behind it — in the Qur'an's own
// reports, the hadith, the seerah, Companion and Tabi'i reports and every harvested
// book, plus the curated records about the occasions and their science, all over the
// one graph. Passages are found by the shared detector in scripts/nuzul.ts at build
// time, so an occasion in a book harvested later appears here the day its passage
// record lands; curated records join through the `nuzul-browser` tag. There is no
// side list.
import { byId, realNodes } from "./graph";
import {
  isNuzulPassage,
  nuzulCorpusOf,
  nuzulKindOf,
  nuzulNarratorOf,
  nuzulSignalsOf,
  nuzulTagSection,
  nuzulTagNarrator,
  NUZUL_SECTIONS,
  NUZUL_TAG,
  type NuzulKind,
  type NuzulNarrator,
  type NuzulSection,
} from "../../../scripts/nuzul";
import type { Node } from "../../../scripts/build-graph";

export { NUZUL_SECTIONS, type NuzulKind, type NuzulNarrator, type NuzulSection };

export interface NuzulItem {
  node: Node;
  section: NuzulSection;
  /** `occasion` when the passage reports an actual occasion, `mention` when it is about the science. */
  kind: NuzulKind | null;
  /** prophetic / companion / tabii / later — the generation the report is traced to. */
  narrator: NuzulNarrator;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const nuzulItems: NuzulItem[] = realNodes
  .filter((n) => n.tags.includes(NUZUL_TAG) || isNuzulPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? nuzulCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : nuzulTagSection(n),
    kind: n.class === "passage" ? nuzulKindOf(n) : null,
    narrator: n.class === "passage"
      ? nuzulNarratorOf(n)
      : nuzulTagNarrator(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const nuzulSignals = (n: Node): string[] => nuzulSignalsOf(n);
