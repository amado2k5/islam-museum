// The museum's public numbers, computed once from the build's own data (audit of 13 November 2026, S16). The
// Developers, Backstage and Support pages and the homepage printed figures typed into strings months apart:
// "52,576 records" beside a homepage that said 58,128, three different page counts, repository statistics frozen
// weeks earlier. Every such figure is now read from here, so two surfaces cannot disagree and none can go stale.
//
// One definition of "pages", used wherever a page count is printed and said in words where it first appears
// (the homepage): a RECORD PAGE is one record's own page in one language, so record pages = records that have a
// page (stubs included: a stub has a page) x the three languages. Listings, browsers and lessons are not counted.
import { graph, nodes, realNodes } from "./graph";
import { pathways } from "./pathways";
import { LANGS, type Lang } from "./i18n";
import { num } from "./nav";

const forward = graph.edges.filter((e: any) => !e.inverse);
const review = (r: string) => realNodes.filter((n) => n.data.status?.review === r).length;
export const NUMBERS = {
  /** Records with a page of their own, drafts included, stubs excluded. */
  records: realNodes.length,
  /** Records named by others but not yet written. */
  stubs: nodes.length - realNodes.length,
  /** Record pages: every record and stub, in each of the three languages. */
  pages: nodes.length * LANGS.length,
  /** Sourced connections: each relation once (its computed inverse is not counted). */
  edges: forward.length,
  classes: new Set(realNodes.map((n) => n.class)).size,
  published: review("published"),
  drafts: review("draft"),
  /** Lines of /api/v1/graph/nodes.ndjson (records and stubs) and of edges.ndjson. */
  nodeLines: nodes.length,
  edgeLines: forward.length,
  pathways: pathways().length,
  commits: graph.repo?.commits ?? null,
  pulls: graph.repo?.pulls ?? null,
};
/** The same numbers, formatted for a language, ready for i18n placeholders. */
export const numbersFor = (lang: Lang): Record<string, string> =>
  Object.fromEntries(Object.entries(NUMBERS).map(([k, v]) => [k, v === null ? "" : num(v as number, lang)]));
