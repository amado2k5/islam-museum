// The Islamic Economy Browser's shared reads (docs/plan/44-islamic-economy-browser.md):
// every mention of money and Islamic economics, deeds/instruments/covenants, and
// endowments — the «متصفح العملات والصكوك والوقف الإسلامي» — in the Qur'an, the Sunnah,
// the seerah, every harvested book and every book harvested later, plus the curated
// records, all over the one graph. Passages are found by the shared detector in
// scripts/islamic-economy.ts at build time, so a mention in a book harvested later
// appears here the day its passage record lands; curated records join through the
// `islamic-economy-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { ieCorpusOf, ieSignalsOf, ieTagSection, ieTagTopics, ieTopicsOf, isIslamicEconomyPassage, IE_TAG, IE_SECTIONS, IE_TOPICS, type IeSection, type IeTopic } from "../../../scripts/islamic-economy";
import type { Node } from "../../../scripts/build-graph";

export { IE_SECTIONS, IE_TOPICS, type IeSection, type IeTopic } from "../../../scripts/islamic-economy";

export interface IeItem {
  node: Node;
  section: IeSection;
  /** The topic chips the record carries: money, sukuk and/or waqf. */
  topics: IeTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const ieItems: IeItem[] = realNodes
  .filter((n) => n.tags.includes(IE_TAG) || isIslamicEconomyPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? ieCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : ieTagSection(n),
    topics: n.class === "passage" ? ieTopicsOf(n) : ieTagTopics(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const ieSignals = (n: Node): string[] => ieSignalsOf(n);
