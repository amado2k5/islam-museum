// The Medicine Browser's shared reads (docs/plan/57-tibb-browser.md): every mention of prophetic
// medicine, medicine and illness, anatomy, surgery, drugs and the seeking of treatment the
// museum's sources carry — Qur'an verses, hadith reports, seerah books, the reports of the
// Companions and the Successors, the medical classics and every other harvested work — plus the
// curated records (physicians, hospitals, medical books, remedies, rulings), all over the one
// graph. Passages are found by the shared detector in scripts/tibb.ts at build time, so a medical
// report in a book harvested later appears here the day its passage record lands; curated records
// join through the `tibb-browser` tag and carry `tibb-<topic>` tags.
import { byId, realNodes } from "./graph";
import { tibbCorpusOf, tibbSignalsOf, tibbTagSection, tibbTagTopics, tibbTopicsOfSignals, TIBB_TAG, TIBB_TOPICS, TIBB_JARS, type TibbSection, type TibbTopic } from "../../../scripts/tibb";
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

/** A jar of the signature view: the passages that name its remedy, disease or procedure. */
export interface TibbJar { id: string; topic: TibbTopic; count: number; record?: Node; section: TibbSection }
const signalsById = new Map<string, string[]>(realNodes.filter((n) => n.class === "passage").map((n) => [n.id, tibbSignalsOf(n)]));
const passages = tibbItems.filter((i) => i.node.class === "passage");
/** The six shelves: for each topic its jars (those the build's texts fill), and its curated records. */
export const tibbShelves: { topic: TibbTopic; jars: TibbJar[]; records: number }[] = TIBB_TOPICS.map((topic) => ({
  topic,
  records: tibbItems.filter((i) => i.node.class !== "passage" && i.topics.includes(topic)).length,
  jars: TIBB_JARS.filter((j) => j.topic === topic).map((j) => {
    const hits = passages.filter((i) => (signalsById.get(i.node.id) ?? []).some((s) => j.signals.includes(s)));
    const per = new Map<TibbSection, number>();
    for (const h of hits) per.set(h.section, (per.get(h.section) ?? 0) + 1);
    const section = ([...per.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "sunnah") as TibbSection;
    const record = j.record ? byId.get(j.record) : undefined;
    if (j.record && (!record || record.stub)) throw new Error(`Medicine jars: ${j.id} names ${j.record}, which is not a record of the graph`);
    return { id: j.id, topic, count: hits.length, record, section };
  }).filter((j) => j.count > 0),
}));
/** Passages the lexicon admitted, for the view's check that every one stands in a jar. */
export const tibbPassageCount = passages.filter((i) => (signalsById.get(i.node.id) ?? []).length > 0).length;
export const tibbJarredCount = passages.filter((i) => (signalsById.get(i.node.id) ?? []).some((s) => TIBB_JARS.some((j) => j.signals.includes(s)))).length;
