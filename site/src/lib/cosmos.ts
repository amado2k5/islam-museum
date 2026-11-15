// The Cosmos Browser's shared reads (docs/plan/59-cosmos-browser.md): every mention of beings and
// worlds beyond the earth, the earlier creation and peoples, the vanished and hidden nations, and
// the secrets of the cosmos in the museum's sources — plus the curated records about them, all over
// the one graph. Qur'an verses come from the reviewed table in scripts/cosmos.ts; every other passage
// is found by the guarded lexicon in that file at build time, so a mention in a book harvested later
// appears here the day its passage record lands; curated records and hand-checked passages join
// through the `cosmos-browser` tag (and `cosmos-<topic>` tags). There is no side list.
import { byId, realNodes } from "./graph";
import { cosmosCorpusOf, cosmosTagSection, cosmosTagTopics, COSMOS_TAG, cosmosTopicsOf, type CosmosSection, type CosmosTopic } from "../../../scripts/cosmos";
import type { Node } from "../../../scripts/build-graph";

export { COSMOS_SECTIONS, COSMOS_TOPICS, type CosmosSection, type CosmosTopic } from "../../../scripts/cosmos";

export interface CosmosItem {
  node: Node;
  section: CosmosSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Topic chips: detected families on passages (plus any `cosmos-<topic>` tag), `cosmos-<topic>` tags on curated records. */
  topics: CosmosTopic[];
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

/** Detected topics of a passage joined with any `cosmos-<topic>` tag it carries (the escape hatch for wording the lexicon cannot see). */
const topicsOf = (n: Node): CosmosTopic[] =>
  n.class === "passage" ? [...new Set([...cosmosTopicsOf(n), ...cosmosTagTopics(n)])] : cosmosTagTopics(n);

export const cosmosItems: CosmosItem[] = realNodes
  .filter((n) => n.tags.includes(COSMOS_TAG) || cosmosTopicsOf(n).length > 0)
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? cosmosCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : cosmosTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
    topics: topicsOf(n),
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });
