// The Signs-of-the-Hour Browser's shared reads (docs/plan/39-eschatology-browser.md): every
// mention of the signs of the Hour, the Day of Judgment and all eschatology in the museum's
// sources — the major and minor signs, barzakh and the grave, resurrection and gathering,
// reckoning and the Scale, the Sirat and the Hawd, Paradise and Hell, and the named
// end-times figures — plus the curated records about them, all over the one graph.
// Passages are found by the shared detector in scripts/eschatology.ts at build time, so an
// eschatology mention in a book harvested later appears here the day its passage record
// lands; curated records join through the `eschatology-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { eschCorpusOf, eschTagSection, eschTagTopics, ESCH_TAG, eschatologyTopicsOf, type EschSection, type EschTopic } from "../../../scripts/eschatology";
import type { Node } from "../../../scripts/build-graph";

export { ESCH_SECTIONS, ESCH_TOPICS, type EschSection, type EschTopic } from "../../../scripts/eschatology";

export interface EschItem {
  node: Node;
  section: EschSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Topic chips: detected families on passages, `eschatology-<topic>` tags on curated records. */
  topics: EschTopic[];
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const eschItems: EschItem[] = realNodes
  .filter((n) => n.tags.includes(ESCH_TAG) || eschatologyTopicsOf(n).length > 0)
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? eschCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : eschTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
    topics: n.class === "passage" ? eschatologyTopicsOf(n) : eschTagTopics(n),
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });
