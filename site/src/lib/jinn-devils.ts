// The Jinn & Devils Browser's shared reads (docs/plan/35-jinn-devils-browser.md): every record
// tagged `jinn-devils-browser`, grouped by its `jd-<section>` tags into the browser's four
// sections, plus the angel records the parallel Angels Browser tags (`angels-browser`) so this
// browser is complete whether or not that branch has landed. The Qur'an and hadith passages that
// mention each record come from `mentions` edges on the passage records. Everything is compiled
// from the one graph at build time; there is no side list, so future harvested books surface here
// automatically once their records carry the browser tag.
import { realNodes, edgesFrom, byId } from "./graph";
import type { Node } from "../../../scripts/build-graph";

export const JD_TAG = "jinn-devils-browser";
/** Section order of the browser; a `jd-<id>` tag not listed here sorts last. */
export const JD_SECTIONS = ["jinn", "devils", "angels", "dreams"];

export interface JinnDevilsItem { node: Node; sections: string[] }

/** Records this browser shows: the browser tag, or the Angels Browser's tag for the angels section. */
export const jinnDevilsItems: JinnDevilsItem[] = realNodes
  .filter((n) => n.tags.includes(JD_TAG) || n.tags.includes("angels-browser"))
  .map((n) => ({
    node: n,
    sections: [...new Set(n.tags.filter((t) => t.startsWith("jd-")).map((t) => t.slice(3)))]
      .concat(n.tags.includes("angels-browser") ? ["angels"] : [])
      .filter((s, i, a) => a.indexOf(s) === i),
  }))
  .filter((i) => i.sections.length > 0)
  .sort((a, b) => a.node.id.localeCompare(b.node.id));

/** Flat lookup for subject pages: one entry per node id. */
export const jinnDevilsById = new Map(jinnDevilsItems.map((i) => [i.node.id, i]));

/** Passages that mention this record: the `mentions` edges live on the passage files, so the
 *  record sees them as `mentioned_in` inverses (inverse: true, from = the record). */
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

/** Other graph records this record points at (persons, events, related concepts). */
export function relatedOf(id: string): Node[] {
  return edgesFrom(id)
    .filter((e) => !e.inverse && e.type === "related_to")
    .map((e) => byId.get(e.to))
    .filter((n): n is Node => !!n && !n.stub);
}
