// The Akhlaq and Mu'amalat Browser's shared reads (docs/plan/54-akhlaq-browser.md): every
// mention of ethics and dealings the museum's sources carry — Qur'an verses, hadith reports,
// seerah books and every other harvested work — plus the curated records on the traits and the
// contracts themselves, all over the one graph. Passages are found by the shared detector in
// scripts/akhlaq.ts at build time, so a mention in a book harvested later appears here the day
// its passage record lands; curated records join through the `akhlaq-browser` tag. There is no
// side list.
import { byId, realNodes } from "./graph";
import {
  akhlaqCorpusOf, akhlaqKindOf, akhlaqKindsOf, akhlaqSignalsOf, akhlaqTagSection,
  akhlaqTagTopics, akhlaqTopicsOf, akhlaqTracksOf, AKHLAQ_TAG, isAkhlaqPassage,
  type AkhlaqKind, type AkhlaqSection, type AkhlaqTrack,
} from "../../../scripts/akhlaq";
import type { Node } from "../../../scripts/build-graph";

export { AKHLAQ_SECTIONS, type AkhlaqKind, type AkhlaqSection, type AkhlaqTrack } from "../../../scripts/akhlaq";

export interface AkhlaqItem {
  node: Node;
  section: AkhlaqSection;
  /** Primary kind for the card chip: dealing > vice > virtue > mention. */
  kind: AkhlaqKind | null;
  /** All kinds the record carries. */
  kinds: AkhlaqKind[];
  /** `akhlaq` (virtues/vices) and/or `muamalat` (dealings). */
  tracks: AkhlaqTrack[];
  /** Trait or contract families (`sidq`, `bay`, `ghiba`, `riba`…). */
  topics: string[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const akhlaqItems: AkhlaqItem[] = realNodes
  .filter((n) => n.tags.includes(AKHLAQ_TAG) || isAkhlaqPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? akhlaqCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : akhlaqTagSection(n),
    kind: n.class === "passage" ? akhlaqKindOf(n) : null,
    kinds: n.class === "passage" ? akhlaqKindsOf(n) : [],
    tracks: n.class === "passage" ? akhlaqTracksOf(n) : [],
    topics: n.class === "passage" ? akhlaqTopicsOf(n) : akhlaqTagTopics(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const akhlaqSignals = (n: Node): string[] => akhlaqSignalsOf(n);
