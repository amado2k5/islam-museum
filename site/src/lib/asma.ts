// The Asma ul Husna Browser's shared reads (docs/plan/29-asma-browser.md): the 99 divine-name
// concept records in enumeration order, and per-name grouped lookups over the compiled graph —
// every section of a name page is computed from edges (mentioned_in / exemplified_by), never a
// side table. Counts are read at build time on the browser's pages only.
import { realNodes, edgesFrom, byId } from "./graph";
import type { Node } from "../../../scripts/build-graph";

/** The 99 divine-name records, ordered by their `order` field (Tirmidhi enumeration 1–99). */
export const asmaNodes: Node[] = realNodes
  .filter((n) => n.class === "concept" && n.data.kind === "divine-name")
  .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));

export const asmaBySlug = new Map(asmaNodes.map((n) => [n.slug, n]));

export interface NameSections {
  quran: Node[];
  hadith: Node[];
  seerah: Node[];
  sahaba: Node[];
  saliheen: Node[];
  paired: Node[];
}

const isCompanion = (p: Node): boolean =>
  ((p.data.roles ?? []) as string[]).includes("companion") ||
  (((p.data.story_roles ?? []) as any[]).some((r) => r.role === "companion"));

/** Everything a name page shows, resolved from the computed inverse edges of the graph. */
export function sectionsOf(nameId: string): NameSections {
  const out: NameSections = { quran: [], hadith: [], seerah: [], sahaba: [], saliheen: [], paired: [] };
  for (const e of edgesFrom(nameId)) {
    const t = byId.get(e.to);
    if (!t) continue;
    if (e.type === "mentioned_in") {
      if (t.class === "passage") (t.data.work === "work/quran" ? out.quran : out.hadith).push(t);
      else if (t.class === "event") out.seerah.push(t);
    } else if (e.type === "exemplified_by" && t.class === "person") {
      (isCompanion(t) ? out.sahaba : out.saliheen).push(t);
    } else if (e.type === "related_to" && t.data?.kind === "divine-name") {
      out.paired.push(t);
    }
  }
  const byRef = (a: Node, b: Node) => String(a.data.ref ?? a.slug).localeCompare(String(b.data.ref ?? b.slug), "en", { numeric: true });
  out.quran.sort(byRef); out.hadith.sort(byRef);
  return out;
}
