// The Testaments Browser's shared reads (docs/plan/61-wasaya-browser.md): every mention of the last testaments and
// parting counsels of the prophets, the caliphs, the Companions, the Successors, the imams and the righteous, of
// their last hours, of what they left behind, of their relics and of their graves — plus the curated records about
// them, all over the one graph. Qur'an verses come from the reviewed table in scripts/wasaya.ts; every other passage
// is found by the guarded lexicon in that file at build time, so a mention in a book harvested later appears here the
// day its passage record lands; curated records and hand-checked passages join through the `wasaya-browser` tag
// (and `wasaya-<section>` / `wasaya-<topic>` tags). There is no side list.
import { byId, realNodes } from "./graph";
import { wasayaCorpusOf, wasayaTagSection, wasayaTagTopics, WASAYA_SECTIONS, WASAYA_TAG, wasayaTopicsOf, type WasayaSection, type WasayaTopic } from "../../../scripts/wasaya";
import type { Node } from "../../../scripts/build-graph";

export { WASAYA_SECTIONS, WASAYA_TOPICS, type WasayaSection, type WasayaTopic } from "../../../scripts/wasaya";

export interface WasayaItem {
  node: Node;
  section: WasayaSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
  /** Topic chips: detected families on passages (plus any `wasaya-<topic>` tag), `wasaya-<topic>` tags on curated records. */
  topics: WasayaTopic[];
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

/** Detected topics of a passage joined with any `wasaya-<topic>` tag it carries (the escape hatch for wording the lexicon cannot see). */
const topicsOf = (n: Node): WasayaTopic[] =>
  n.class === "passage" ? [...new Set([...wasayaTopicsOf(n), ...wasayaTagTopics(n)])] : wasayaTagTopics(n);

export const wasayaItems: WasayaItem[] = realNodes
  .filter((n) => n.tags.includes(WASAYA_TAG) || wasayaTopicsOf(n).length > 0)
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? wasayaCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : wasayaTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
    topics: topicsOf(n),
  }))
  .sort((a, b) => {
    const r = WASAYA_SECTIONS.indexOf(a.section) - WASAYA_SECTIONS.indexOf(b.section);
    // verses in mushaf order, everything else by id with numbers compared as numbers (page 9 before page 10)
    return r || (Number(a.node.data.sura ?? 0) - Number(b.node.data.sura ?? 0)) || (Number(a.node.data.aya ?? 0) - Number(b.node.data.aya ?? 0))
      || a.node.id.localeCompare(b.node.id, "en", { numeric: true });
  });

// ---------- the timeline (docs/plan/61-wasaya-browser.md §4): the curated records that carry a date
/** The date a curated record is placed at on the timeline: a person's death, else the record's own start date. */
const placedDate = (n: Node): any => n.data.date?.start ?? n.data.date ?? n.data.died ?? n.data.start ?? n.data.composed ?? n.data.made ?? n.data.floruit;
/** The year of an EDTF date; an unspecified decade or century ("06XX") is placed at its start. A year before the common era is not placed. */
const yearOfEdtf = (d: any): number | undefined => { const m = typeof d?.edtf === "string" ? d.edtf.match(/^(\d{2}[\dX]{2})/) : null; return m ? Number(m[1].replace(/X/g, "0")) || undefined : undefined; };
export interface WasayaDated { node: Node; section: WasayaSection; year: number; date: any }
/** Curated records with a date, oldest first; undated ones are counted by the timeline, not placed. */
export const wasayaDated: WasayaDated[] = wasayaItems
  .filter((i) => i.node.class !== "passage")
  .map((i) => ({ node: i.node, section: i.section, date: placedDate(i.node), year: yearOfEdtf(placedDate(i.node)) }))
  .filter((x): x is WasayaDated => typeof x.year === "number" && x.year > 0)
  .sort((a, b) => a.year - b.year || a.node.id.localeCompare(b.node.id));
export const wasayaUndated = wasayaItems.filter((i) => i.node.class !== "passage").length - wasayaDated.length;
