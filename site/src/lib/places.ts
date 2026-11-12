// The Sacred Places Browser's shared reads (docs/plan/49-places-browser.md): every sacred,
// important and valued place the museum's sources mention — tagged `places-browser` records and
// every place/building record a passage mentions — grouped into the browser's sanctity
// sections. The passages that mention each record come from `mentioned_in` inverse edges, so a
// place named in a book harvested later appears here automatically. There is no side list.
import { realNodes, edgesFrom, byId } from "./graph";
import {
  PLACES_TAG, PLACES_SECTIONS, placeSectionOf, placeCorpusOf,
  type PlaceSection, type PlaceCorpus,
} from "../../../scripts/places";
import { browserSlugs } from "../../../scripts/browser-slugs";
import type { Node } from "../../../scripts/build-graph";

export { PLACES_SECTIONS, type PlaceSection } from "../../../scripts/places";

/** Passage nodes that mention a record, keyed by the mentioned node's id. */
export const placeMentioners = (() => {
  const map = new Map<string, Node[]>();
  for (const p of realNodes) {
    if (p.class !== "passage") continue;
    for (const e of edgesFrom(p.id)) {
      if (e.type !== "mentions") continue;
      const list = map.get(e.to) ?? [];
      list.push(p);
      map.set(e.to, list);
    }
  }
  return map;
})();

export interface PlacesItem {
  node: Node;
  section: PlaceSection;
  /** Count of mentioning passages per corpus, for the card line. */
  counts: Record<PlaceCorpus, number>;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

const countsOf = (id: string): Record<PlaceCorpus, number> => {
  const counts: Record<PlaceCorpus, number> = { quran: 0, sunnah: 0, seerah: 0, books: 0 };
  for (const p of placeMentioners.get(id) ?? []) {
    counts[placeCorpusOf(p.data.work as string | undefined, genreOf(p.data.work as string | undefined), p.data.unit as string | undefined)]++;
  }
  return counts;
};

export const placesItems: PlacesItem[] = realNodes
  .filter((n) =>
    (n.class === "place" || n.class === "building") &&
    (n.tags.includes(PLACES_TAG) || (placeMentioners.get(n.id) ?? []).length > 0))
  .map((n) => ({ node: n, section: placeSectionOf(n), counts: countsOf(n.id) }))
  .sort((a, b) => {
    const r = PLACES_SECTIONS.indexOf(a.section) - PLACES_SECTIONS.indexOf(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** The browser slug of each record, keyed by node id — the one place a page URL is decided.
 *  It is the record's own slug; when a place and a building share a slug, the later one takes
 *  its class as a prefix (scripts/browser-slugs.ts). The same slug serves every language, so the page routes, the cards
 *  that link to them and the language switch all agree. */
export const placesSlugById = browserSlugs(placesItems.map((i) => i.node));
export const placesSlugOf = (i: PlacesItem): string => placesSlugById.get(i.node.id)!;

export const placesBySlug = new Map(placesItems.map((i) => [placesSlugOf(i), i]));

/** The passages that mention this record, grouped by corpus: Qur'an ayahs first by sura/aya,
 *  then sunnah, seerah and other books in id order. */
export function passagesOf(id: string): Record<PlaceCorpus, Node[]> {
  const out: Record<PlaceCorpus, Node[]> = { quran: [], sunnah: [], seerah: [], books: [] };
  for (const p of placeMentioners.get(id) ?? []) {
    out[placeCorpusOf(p.data.work as string | undefined, genreOf(p.data.work as string | undefined), p.data.unit as string | undefined)].push(p);
  }
  const order = (a: Node, b: Node) => ((a.data.sura ?? 0) - (b.data.sura ?? 0)) || ((a.data.aya ?? 0) - (b.data.aya ?? 0)) || a.id.localeCompare(b.id);
  out.quran.sort(order);
  for (const k of ["sunnah", "seerah", "books"] as const) out[k].sort((a, b) => a.id.localeCompare(b.id));
  return out;
}

/** Other graph records this place points at (persons, events, related places). */
export function relatedOf(id: string): Node[] {
  return edgesFrom(id)
    .filter((e) => !e.inverse && e.type === "related_to")
    .map((e) => byId.get(e.to))
    .filter((n): n is Node => !!n && !n.stub);
}
