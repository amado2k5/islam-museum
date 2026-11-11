// The Magic Browser's shared reads (docs/plan/37-magic-browser.md): every mention of magic
// and the magicians in the museum's sources — sorcery, soothsaying and augury, ruqyah, the
// evil eye and envy — plus the curated records about them, all over the one graph. Passages
// are found by the shared detector in scripts/magic.ts at build time, so a magic mention in
// a book harvested later appears here the day its passage record lands; curated records join
// through the `magic-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { magicCorpusOf, magicTagSection, magicTagTopics, MAGIC_TAG, magicTopicsOf, type MagicSection, type MagicTopic } from "../../../scripts/magic";
import type { Node } from "../../../scripts/build-graph";

export { MAGIC_SECTIONS, MAGIC_TOPICS, type MagicSection, type MagicTopic } from "../../../scripts/magic";

export interface MagicItem {
  node: Node;
  section: MagicSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Topic chips: detected families on passages, `magic-<topic>` tags on curated records. */
  topics: MagicTopic[];
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const magicItems: MagicItem[] = realNodes
  .filter((n) => n.tags.includes(MAGIC_TAG) || magicTopicsOf(n).length > 0)
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? magicCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : magicTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
    topics: n.class === "passage" ? magicTopicsOf(n) : magicTagTopics(n),
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });
