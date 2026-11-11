// The Four Madhhabs Browser's shared reads (docs/plan/38-madhahib-browser.md): every record of «متصفح
// المذاهب الأربعة» — the four imams and schools, the other schools, the salaf forebears, the
// canonical books, the fiqh/usul concepts, and every work, passage or question whose `mentions`
// edge names a madhhab — over the one graph. Membership is computed at build time by the shared
// detector in scripts/madhahib.ts: tags place curated records, `mentions` edges to a madhhab
// target place everything a harvested book says about the schools, so future harvests appear here
// the day their edges land. There is no side list.
import { graph, realNodes, byId } from "./graph";
import { madhahibMembers, MADHABIB_SECTIONS, type MadhahibSection } from "../../../scripts/madhahib";
import type { Node } from "../../../scripts/build-graph";

export { MADHABIB_SECTIONS, type MadhahibSection } from "../../../scripts/madhahib";

export interface MadhahibItem { node: Node; sections: string[] }

export const madhahibItems: MadhahibItem[] = madhahibMembers(realNodes, graph.edges)
  .sort((a, b) => a.node.id.localeCompare(b.node.id));

/** Flat lookup: one entry per node id (the same node can sit in several sections). */
export const madhahibById = new Map(madhahibItems.map((i) => [i.node.id, i]));

/** Records that `mentions` this record (works, passages, questions), indexed once: "mentioned in" lines. */
const mentionedByIndex = new Map<string, Node[]>();
for (const e of graph.edges) {
  if (e.inverse || e.type !== "mentions") continue;
  const src = byId.get(e.from);
  if (!src || src.stub) continue;
  const list = mentionedByIndex.get(e.to) ?? [];
  list.push(src);
  mentionedByIndex.set(e.to, list);
}
export const mentionedBy = (id: string): Node[] => mentionedByIndex.get(id) ?? [];
