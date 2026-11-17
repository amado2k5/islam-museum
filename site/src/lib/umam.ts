// The Umam Browser's shared reads (docs/plan/67-umam-browser.md): «متصفح الأمم والأديان والطوائف
// والشعوب غير المسلمة» — every graph record that is a non-Muslim nation, religion, sect or people
// the sources name, and every passage, work, event and question that mentions them. Membership is
// computed at build time by the shared detector in scripts/umam.ts: tags place curated records,
// `mentions` edges and the guarded name lexicon place every mention, so a book harvested later
// appears here the day its edges land. There is no side list.
import { graph, realNodes, byId } from "./graph";
import {
  umamMembers, umamMentionCounts, UMAM_SECTIONS,
  type UmamSection, type UmamCorpus,
} from "../../../scripts/umam";
import type { Node } from "../../../scripts/build-graph";

export { UMAM_SECTIONS, type UmamSection, type UmamCorpus } from "../../../scripts/umam";

export interface UmamItem { node: Node; sections: string[] }

export const umamItems: UmamItem[] = umamMembers(realNodes, graph.edges)
  .sort((a, b) => a.node.id.localeCompare(b.node.id));

/** Flat lookup: one entry per node id (the same node can sit in several sections). */
export const umamById = new Map(umamItems.map((i) => [i.node.id, i]));

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

/** Per-corpus mention counts for the "mentioned in" strip (Qur'an / Sunnah / Seerah / books). */
export const mentionCountsOf = (id: string) => umamMentionCounts(id, graph.edges, byId);

/** Members in one section, stable order. */
export const inSection = (section: string): UmamItem[] =>
  umamItems.filter((i) => i.sections[0] === section);

/** A member's first section (its home on the page). */
export const homeSection = (i: UmamItem): string => i.sections[0];

// ---------- the timeline: the curated records that carry a date, oldest first. A person's death,
// else the record's own start date — the same rule the other browsers use.
const placedDate = (n: Node): any => n.data.date?.start ?? n.data.date ?? n.data.died ?? n.data.start ?? n.data.composed ?? n.data.made ?? n.data.floruit;
const yearOfEdtf = (d: any): number | undefined => { const m = typeof d?.edtf === "string" ? d.edtf.match(/^(-?\d{2}[\dX]{2})/) : null; return m ? Number(m[1].replace(/X/g, "0")) || undefined : undefined; };
export interface UmamDated { node: Node; section: string; year: number; date: any }
export const umamDated: UmamDated[] = umamItems
  .filter((i) => i.node.class !== "passage")
  .map((i) => ({ node: i.node, section: homeSection(i), date: placedDate(i.node), year: yearOfEdtf(placedDate(i.node)) }))
  .filter((x): x is UmamDated => typeof x.year === "number")
  .sort((a, b) => a.year - b.year || a.node.id.localeCompare(b.node.id));
export const umamUndated = umamItems.filter((i) => i.node.class !== "passage").length - umamDated.length;

/** The leading peoples for the "mentioned in" strip: non-passage members with the most incoming mentions edges. */
export const umamLeadMentioned = (limit = 8): { node: Node; count: number }[] =>
  umamItems
    .filter((i) => i.node.class !== "passage")
    .map((i) => ({ node: i.node, count: mentionedByIndex.get(i.node.id)?.length ?? 0 }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count || a.node.id.localeCompare(b.node.id))
    .slice(0, limit);
