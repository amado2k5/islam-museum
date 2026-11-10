// The Companions Browser's shared reads (docs/plan/29-companions-browser.md): the Companion records and their facets
// (the Ten, the circles, clans, events, women and Hijri death decades), all taken from the compiled graph at build time.
import { byId, graph, labelOf } from "./graph";
import { fmt, ui, type Lang } from "./i18n";
import { num } from "./nav";
import { companionIndex, decadeOrder, TEN_CONCEPT, TEN_TRAIL, CIRCLES } from "../../../scripts/companions";
import type { Node } from "../../../scripts/build-graph";

export { TEN_CONCEPT, TEN_TRAIL, CIRCLES };
export const companions = companionIndex(graph.nodes, graph.edges);
export const companionNodes: Node[] = companions.ids.map((id) => byId.get(id)!);
export const hasArticle = (n: Node): boolean => Object.keys(n.prose ?? {}).length > 0;

/** Facets shown with their own page: two or more Companions. */
const MIN = 2;
const bySize = (m: Map<string, unknown[]>) => [...m.entries()].filter(([, xs]) => xs.length >= MIN).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
export const clanFacets = bySize(companions.clans).map(([id]) => id);
const eventStart = (id: string): string => byId.get(id)?.data?.date?.start?.edtf ?? byId.get(id)?.data?.date?.edtf ?? "9999";
export const eventFacets = [...companions.events.entries()].filter(([, xs]) => xs.length >= MIN).map(([id]) => id).sort((a, b) => eventStart(a).localeCompare(eventStart(b)) || a.localeCompare(b));
export const decadeFacets = [...companions.decades.keys()].sort((a, b) => decadeOrder(a) - decadeOrder(b));
export const groupFacets = [...CIRCLES.filter((c) => byId.has(c)), ...clanFacets];
export const groupMembers = (id: string): string[] => companions.circles.get(id) ?? companions.clans.get(id) ?? [];

export const decadeLabel = (key: string, lang: Lang): string => {
  const C = ui(lang).companions;
  if (key === "bh") return C.decade_bh;
  const a = Number(key);
  return fmt(C.decade_label, { a: num(a, lang), b: num(a + 9, lang) });
};
export const deathText = (id: string, lang: Lang): string | undefined => {
  const d = companions.death.get(id);
  if (!d) return undefined;
  const C = ui(lang).companions;
  const text = d.year < 1 ? fmt(C.died_bh, { y: num(1 - d.year, lang) }) : fmt(C.died, { y: num(d.year, lang) });
  return d.derived ? `${text} †` : text;
};

export const collatedBy = (lang: Lang) => {
  const c = new Intl.Collator(lang, { sensitivity: "base" });
  return (a: string, b: string) => c.compare(labelOf(byId.get(a)!, lang), labelOf(byId.get(b)!, lang)) || a.localeCompare(b);
};
export const byDeath = (lang: Lang) => {
  const label = collatedBy(lang);
  return (a: string, b: string) => (companions.death.get(a)?.year ?? 1e9) - (companions.death.get(b)?.year ?? 1e9) || label(a, b);
};
