// The topic axes of the passage browsers (audit of 13 November 2026, S24): one page per heading of a browser
// (a virtue, a vice or a dealing in Akhlaq; an act of worship in Ibadat), listing the museum's own records first
// and then the passages, each heading paginated at a fixed size so every page stays under the page budget and
// every record stays reachable without script. The du'a occasions axis (site/src/lib/dua.ts) is its own thing:
// it follows a book's divisions; these follow the headings the browsers already mark on every row.
import type { Lang } from "./i18n";
import type { Node } from "../../../scripts/build-graph";

/** Rows on one axis page (the same size as a listing sub-page, site/src/lib/paged.ts). */
export const AXIS_ROWS = 75;
const CORPUS_ORDER = ["quran", "sunnah", "seerah", "books"];

export interface AxisItem { node: Node; section: string; topics: string[] }
export interface AxisHeading<T extends AxisItem> { id: string; group: string; items: T[]; own: number; pages: number }

/** The headings that hold a record, in the order given, each with its own records first and then the passages by corpus. */
export function axisHeadings<T extends AxisItem>(items: T[], order: readonly string[], groupOf: (id: string) => string): AxisHeading<T>[] {
  const rank = (i: T) => (i.node.class === "passage" ? 1 + Math.max(0, CORPUS_ORDER.indexOf(i.section)) : 0);
  return order.map((id) => {
    const list = items.filter((i) => i.topics.includes(id)).sort((a, b) => rank(a) - rank(b) || a.node.id.localeCompare(b.node.id));
    return { id, group: groupOf(id), items: list, own: list.filter((i) => i.node.class !== "passage").length, pages: Math.ceil(list.length / AXIS_ROWS) };
  }).filter((h) => h.items.length > 0);
}

export interface AxisProps { lang: Lang; id: string; pageNo: number }
/** getStaticPaths of an axis route `[...path].astro`: `<id>` is page 1, `<id>/<n>` page n. */
export function axisStaticPaths(langs: readonly Lang[], headings: { id: string; pages: number }[]) {
  return langs.flatMap((lang) => headings.flatMap((h) =>
    Array.from({ length: h.pages }, (_x, k) => ({ params: { lang, path: k === 0 ? h.id : `${h.id}/${k + 1}` }, props: { lang, id: h.id, pageNo: k + 1 } as AxisProps }))));
}

/** Rows of one section shown on a subject's own page (a prophet in the Messengers Browser, a person in the Genealogy
 *  Browser) before "All N" takes over: the rest are on `/<browser>/<slug>/passages/<section>/` (audit S18). */
export const SUBJECT_ROWS = 60;
/** One section of a subject's passages as an axis heading, for AxisPage. */
export function subjectHeading(id: string, nodes: Node[]): AxisHeading<AxisItem> {
  return { id, group: "", items: nodes.map((node) => ({ node, section: id, topics: [] })), own: 0, pages: Math.ceil(nodes.length / AXIS_ROWS) };
}
