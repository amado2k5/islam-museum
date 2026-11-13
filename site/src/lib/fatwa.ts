// The Fatwa Explorer's reads (docs/plan/25-fatwa-explorer.md; audit of 13 November 2026, S23). A fatwa is a `work` of
// kind fatwa. Two axes, both from the records themselves: the source it was distilled from (its first `sources`
// entry) and its subjects (the concept and practice records its own `about` relations point at: 331 of the 345
// fatwas name at least one). The museum records fatwas as history and attributes them; it never issues a ruling.
import { byId, edgesFrom, realNodes } from "./graph";
import type { Node } from "../../../scripts/build-graph";

export const fatwas: Node[] = realNodes.filter((n) => n.class === "work" && n.data.kind === "fatwa").sort((a, b) => a.id.localeCompare(b.id));
export const sourceOf = (n: Node) => String((n.data.sources ?? [])[0] ?? "");
export const sourceSlug = (sid: string) => sid.replace(/^source\//, "").replace(/[^a-z0-9]+/g, "-") || "unknown";

export interface FatwaSource { sid: string; slug: string; node: Node | undefined; list: Node[] }
const bySource = new Map<string, Node[]>();
for (const n of fatwas) (bySource.get(sourceOf(n)) ?? bySource.set(sourceOf(n), []).get(sourceOf(n))!).push(n);
export const fatwaSources: FatwaSource[] = [...bySource].map(([sid, list]) => ({ sid, slug: sourceSlug(sid), node: byId.get(sid), list }))
  .sort((a, b) => b.list.length - a.list.length || a.sid.localeCompare(b.sid));

/** The subjects of one fatwa: the concept and practice records its own `about` relations name. */
export const subjectsOf = (n: Node): Node[] =>
  edgesFrom(n.id).filter((e) => !e.inverse && e.type === "about").map((e) => byId.get(String(e.to)))
    .filter((t): t is Node => !!t && !t.stub && (t.class === "concept" || t.class === "practice"));
export interface FatwaSubject { node: Node; slug: string; list: Node[] }
const bySubject = new Map<string, FatwaSubject>();
for (const n of fatwas) for (const t of subjectsOf(n)) (bySubject.get(t.id) ?? bySubject.set(t.id, { node: t, slug: t.slug, list: [] }).get(t.id)!).list.push(n);
/** Every subject at least one fatwa is about, the most asked-about first. */
export const fatwaSubjects: FatwaSubject[] = [...bySubject.values()].sort((a, b) => b.list.length - a.list.length || a.node.id.localeCompare(b.node.id));
/** Fatwas whose record names no subject. */
export const fatwasWithoutSubject: Node[] = fatwas.filter((n) => subjectsOf(n).length === 0);
// two subjects of different classes can share a slug: the page address then carries the class
const clash = new Set(fatwaSubjects.map((s) => s.slug).filter((x, i, a) => a.indexOf(x) !== i));
for (const s of fatwaSubjects) if (clash.has(s.slug)) s.slug = `${s.node.class}-${s.slug}`;
