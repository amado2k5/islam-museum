// The Nature Explorer's shared reads (docs/plan/34-nature-browser.md): every record tagged
// `nature-browser`, grouped by its `nature-<section>` tag into the browser's six sections,
// plus the Qur'an and hadith passages that mention each record (from `mentions` edges on the
// passage records). Everything comes from the compiled graph at build time; there is no side list.
import { realNodes, edgesFrom, byId } from "./graph";
import type { Node } from "../../../scripts/build-graph";

export const NATURE_TAG = "nature-browser";
/** Section order of the browser; a `nature-<id>` tag not listed here sorts last. */
export const NATURE_SECTIONS = ["land", "bird", "insect", "sea", "plant", "cosmos"];

export interface NatureItem { node: Node; section: string }

export const natureItems: NatureItem[] = realNodes
  .filter((n) => n.tags.includes(NATURE_TAG))
  .map((n) => ({ node: n, section: (n.tags.find((t) => t.startsWith("nature-") && t !== NATURE_TAG) ?? "nature-").slice(7) }))
  .sort((a, b) => {
    const r = NATURE_SECTIONS.indexOf(a.section) - NATURE_SECTIONS.indexOf(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

export const natureById = new Map(natureItems.map((i) => [i.node.slug ?? i.node.id.split("/")[1], i]));

/** Passages that mention this record: the `mentions` edges live on the passage files, so the
 *  concept sees them as `mentioned_in` inverses (inverse: true, from = the concept). */
export function passagesOf(id: string): { quran: Node[]; hadith: Node[] } {
  const quran: Node[] = [], hadith: Node[] = [];
  for (const e of edgesFrom(id)) {
    if (e.type !== "mentioned_in") continue;
    const n = byId.get(e.to);
    if (!n || n.stub || n.class !== "passage") continue;
    (n.data.unit === "ayah" ? quran : hadith).push(n);
  }
  const order = (a: Node, b: Node) => ((a.data.sura ?? 0) - (b.data.sura ?? 0)) || ((a.data.aya ?? 0) - (b.data.aya ?? 0)) || a.id.localeCompare(b.id);
  return { quran: quran.sort(order), hadith: hadith.sort((a, b) => a.id.localeCompare(b.id)) };
}

/** Other graph records this concept points at (persons, events, related concepts). */
export function relatedOf(id: string): Node[] {
  return edgesFrom(id)
    .filter((e) => !e.inverse && e.type === "related_to")
    .map((e) => byId.get(e.to))
    .filter((n): n is Node => !!n && !n.stub);
}
