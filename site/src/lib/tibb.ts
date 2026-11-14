// The Medicine Browser's shared reads (docs/plan/57-tibb-browser.md): every mention of prophetic
// medicine, medicine and illness, anatomy, surgery, drugs and the seeking of treatment the
// museum's sources carry — Qur'an verses, hadith reports, seerah books, the reports of the
// Companions and the Successors, the medical classics and every other harvested work — plus the
// curated records (physicians, hospitals, medical books, remedies, rulings), all over the one
// graph. Passages are found by the shared detector in scripts/tibb.ts at build time, so a medical
// report in a book harvested later appears here the day its passage record lands; curated records
// join through the `tibb-browser` tag and carry `tibb-<topic>` tags.
import { byId, realNodes } from "./graph";
import { tibbCorpusOf, tibbSignalsOf, tibbTagSection, tibbTagTopics, tibbTopicsOfSignals, TIBB_TAG, TIBB_TOPICS, type TibbSection, type TibbTopic } from "../../../scripts/tibb";
import type { Node } from "../../../scripts/build-graph";

export { TIBB_SECTIONS, TIBB_TOPICS, type TibbSection, type TibbTopic } from "../../../scripts/tibb";

export interface TibbItem {
  node: Node;
  section: TibbSection;
  /** The medical topics the record touches (nabawi, tibb, tashrih, jiraha, dawa, tadawi). */
  topics: TibbTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const tibbItems: TibbItem[] = realNodes
  .map((n) => ({ n, signals: n.class === "passage" ? tibbSignalsOf(n) : [] }))
  .filter(({ n, signals }) => n.tags.includes(TIBB_TAG) || signals.length > 0)
  .map(({ n, signals }) => ({
    node: n,
    section: n.class === "passage"
      ? tibbCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : tibbTagSection(n),
    topics: n.class === "passage" ? [...new Set([...tibbTopicsOfSignals(signals), ...tibbTagTopics(n)])] : tibbTagTopics(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** The cabinet of the signature view: for each topic, how many records each section holds. */
export const tibbCabinet: { topic: TibbTopic; cells: Record<TibbSection, number>; total: number }[] = TIBB_TOPICS.map((topic) => {
  const cells = { quran: 0, sunnah: 0, seerah: 0, books: 0, curated: 0 } as Record<TibbSection, number>;
  for (const i of tibbItems) if (i.topics.includes(topic)) cells[i.section]++;
  return { topic, cells, total: Object.values(cells).reduce((a, b) => a + b, 0) };
});
