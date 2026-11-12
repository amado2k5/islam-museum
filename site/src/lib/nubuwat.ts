// The Nubuwat Browser's shared reads (docs/plan/44-nubuwat-browser.md): every prophecy of
// the Prophet, proof of prophethood, secret and marvel of the Qur'an, miracle of the
// Prophet, report of unseen knowledge and eschatological prediction in the museum's
// sources — plus the curated records about them, all over the one graph. Passages are
// found by the shared detector in scripts/nubuwat.ts at build time, so a prophecy or
// marvel in a book harvested later appears here the day its passage record lands; curated
// records join through the `nubuwat-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { nubuwatCorpusOf, nubuwatTagSection, nubuwatTagTopics, NUBUWAT_TAG, nubuwatTopicsOf, type NubuwatSection, type NubuwatTopic } from "../../../scripts/nubuwat";
import type { Node } from "../../../scripts/build-graph";

export { NUBUWAT_SECTIONS, NUBUWAT_TOPICS, type NubuwatSection, type NubuwatTopic } from "../../../scripts/nubuwat";

export interface NubuwatItem {
  node: Node;
  section: NubuwatSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Topic chips: detected families on passages, `nubuwat-<topic>` tags on curated records. */
  topics: NubuwatTopic[];
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const nubuwatItems: NubuwatItem[] = realNodes
  .filter((n) => n.tags.includes(NUBUWAT_TAG) || nubuwatTopicsOf(n).length > 0)
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? nubuwatCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : nubuwatTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
    topics: n.class === "passage" ? nubuwatTopicsOf(n) : nubuwatTagTopics(n),
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });
