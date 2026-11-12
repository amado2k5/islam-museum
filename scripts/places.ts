// The Sacred Places Browser's shared reads (docs/plan/49-places-browser.md): which place and
// building records belong to the browser and which section each lands in. Membership is graph
// membership, never a side list: a record joins through the `places-browser` tag (the curated
// layer) or through any `mentioned_in` edge a passage record gives it — so a place named in a
// book harvested later appears automatically the day its passage record lands. Sections are
// sanctity sections, not corpora; the corpus split (Qur'an / Sunnah / seerah / other books)
// happens per subject page through `placeCorpusOf`.
import type { Node } from "./build-graph.js";

export const PLACES_TAG = "places-browser";
/**
 * Section order of the browser; a `places-<id>` tag not listed here sorts last and lands in
 * `mentioned`, the automatic section for every passage-mentioned record without a curated tag.
 */
export const PLACES_SECTIONS = ["sanctuaries", "hajj", "seerah", "quran", "sacred", "mentioned"] as const;
export type PlaceSection = (typeof PLACES_SECTIONS)[number];
export type PlaceCorpus = "quran" | "sunnah" | "seerah" | "books";
export const PLACE_CORPORA: PlaceCorpus[] = ["quran", "sunnah", "seerah", "books"];

/** The classes the browser walks: places and the buildings that are themselves sacred sites. */
export function isPlaceNode(n: Node): boolean {
  return (n.class === "place" || n.class === "building") && !n.stub;
}

/** True when the record is a curated member: it carries the browser's tag. */
export function isCuratedPlace(n: Node): boolean {
  return isPlaceNode(n) && n.tags.includes(PLACES_TAG);
}

/**
 * The section of a curated record: its `places-<section>` tag when present and registered,
 * else `mentioned` — the same section automatic members land in.
 */
export function placeSectionOf(n: Node): PlaceSection {
  const tag = n.tags.find((t) => t.startsWith("places-") && t !== PLACES_TAG);
  const id = tag?.slice(7) ?? "mentioned";
  return (PLACES_SECTIONS as readonly string[]).includes(id) ? (id as PlaceSection) : "mentioned";
}

/**
 * Which corpus a mentioning passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), and
 * every other harvested work. Works not yet harvested land in the right section by their genre
 * the day their passages arrive.
 */
export function placeCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): PlaceCorpus {
  if (workId === "work/quran" || unit === "ayah") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/**
 * Membership over compiled edges: tagged records plus every place/building record that has a
 * `mentioned_in` edge coming from a passage. `mentioners` maps a node id to the passage nodes
 * that mention it (inverse edges live on the place/building side as `mentioned_in`).
 */
export function placesMembers(nodes: Node[], mentioners: Map<string, Node[]>): { node: Node; section: PlaceSection }[] {
  return nodes
    .filter((n) => isPlaceNode(n) && (n.tags.includes(PLACES_TAG) || (mentioners.get(n.id) ?? []).length > 0))
    .map((n) => ({ node: n, section: placeSectionOf(n) }))
    .sort((a, b) => {
      const r = PLACES_SECTIONS.indexOf(a.section) - PLACES_SECTIONS.indexOf(b.section);
      return r || a.node.id.localeCompare(b.node.id);
    });
}
