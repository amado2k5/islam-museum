// The Mukatabat Browser's shared reads (docs/plan/46-mukatabat-browser.md): every
// mention of correspondence the museum's sources carry — letters sent by the
// Prophet, kings and caliphs and the letters, replies and reports that came back —
// Qur'an verses, hadith reports, seerah books and every other harvested work, plus
// the curated records about correspondence, all over the one graph. Passages are
// found by the shared detector in scripts/mukatabat.ts at build time, so a letter
// in a book harvested later appears here the day its passage record lands; curated
// records join through the `mukatabat-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import {
  isMukatabatPassage,
  mukatabatCorpusOf,
  mukatabatKindOf,
  mukatabatSenderOf,
  mukatabatSignalsOf,
  mukatabatTagSection,
  mukatabatTagSender,
  MUKATABAT_SECTIONS,
  MUKATABAT_TAG,
  type MukatabatKind,
  type MukatabatSection,
  type MukatabatSender,
} from "../../../scripts/mukatabat";
import type { Node } from "../../../scripts/build-graph";

export { MUKATABAT_SECTIONS, type MukatabatKind, type MukatabatSection, type MukatabatSender };

export interface MukatabatItem {
  node: Node;
  section: MukatabatSection;
  /** `letter` when the passage carries an actual letter, `mention` when it is only about correspondence. */
  kind: MukatabatKind | null;
  /** prophetic / caliphal / royal / other — who the correspondence belongs to. */
  sender: MukatabatSender;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const mukatabatItems: MukatabatItem[] = realNodes
  .filter((n) => n.tags.includes(MUKATABAT_TAG) || isMukatabatPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? mukatabatCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : mukatabatTagSection(n),
    kind: n.class === "passage" ? mukatabatKindOf(n) : null,
    sender: n.class === "passage"
      ? mukatabatSenderOf(n)
      : mukatabatTagSender(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const mukatabatSignals = (n: Node): string[] => mukatabatSignalsOf(n);
