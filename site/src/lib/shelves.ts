// The shelves wave's shared reads (docs/site/browsers.md): the ten class-driven browsers —
// imara, collection, tasawwuf, kalam, nisa, uhud, maahid, mawt, ulum and funun — each list the
// records its spec in scripts/shelves.ts selects: buildings by kind, objects by material, and
// persons by roles and occupations, plus every record tagged the browser's `-browser` tag.
// Membership is computed over the compiled graph at build time; a record that matches appears
// here the day it lands, and a curated record joins through the tag alone.
import { realNodes } from "./graph";
import { SHELVES, type ShelfSpec } from "../../../scripts/shelves";
import type { Node } from "../../../scripts/build-graph";

export { SHELVES, SHELF_SLUGS, type ShelfSpec } from "../../../scripts/shelves";

export interface ShelfItem {
  node: Node;
  section: string;
}

const itemsCache = new Map<string, ShelfItem[]>();

/** Every member of a shelf browser, section-tagged and stably sorted. */
export const shelfItems = (slug: string): ShelfItem[] => {
  const cached = itemsCache.get(slug);
  if (cached) return cached;
  const spec = SHELVES[slug];
  const items = realNodes
    .filter((n) => spec.pick(n))
    .map((n) => ({ node: n, section: spec.sectionOf(n) }))
    .sort((a, b) => a.section.localeCompare(b.section) || a.node.id.localeCompare(b.node.id));
  itemsCache.set(slug, items);
  return items;
};
