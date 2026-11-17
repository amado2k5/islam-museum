// The Trade Browser's shared reads (docs/plan/63-trade-browser.md): every mention
// of the Quraysh winter and summer caravans, the Silk Road and Muslim trade —
// the «متصفح قافلة الشتاء والصيف وطريق الحرير وتجارة المسلمين» — in the Qur'an,
// the Sunnah, the seerah, every harvested book and every book harvested later,
// plus the curated records, all over the one graph. Passages are found by the
// shared detector in scripts/trade.ts at build time, so a mention in a book
// harvested later appears here the day its passage record lands; curated records
// join through the `trade-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { isTradePassage, tradeCorpusOf, tradeSignalsOf, tradeTagSection, tradeTagTopics, tradeTopicsOf, TRADE_SECTIONS, TRADE_TAG, TRADE_TOPICS, type TradeSection, type TradeTopic } from "../../../scripts/trade";
import type { Node } from "../../../scripts/build-graph";

export { TRADE_SECTIONS, TRADE_TOPICS, type TradeSection, type TradeTopic } from "../../../scripts/trade";

export interface TradeItem {
  node: Node;
  section: TradeSection;
  /** The topic chips the record carries: caravans, silk-road and/or trade. */
  topics: TradeTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const tradeItems: TradeItem[] = realNodes
  .filter((n) => n.tags.includes(TRADE_TAG) || isTradePassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? tradeCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : tradeTagSection(n),
    topics: n.class === "passage" ? tradeTopicsOf(n) : tradeTagTopics(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const tradeSignals = (n: Node): string[] => tradeSignalsOf(n);
