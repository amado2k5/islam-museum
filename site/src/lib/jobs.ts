// The Job Browser's shared reads (docs/jobs/site.md, docs/jobs/schema.md): the job records, their domains and their holders,
// all taken from the compiled graph at build time. A holder is a person whose `occupations:` block names the job
// (schema.md section 2); nothing is inferred from roles.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { realNodes } from "./graph";
import { repoPath } from "./paths";
import type { Node } from "../../../scripts/build-graph";
import type { Lang } from "./i18n";
import { timelineKey } from "./dates";

export interface Domain { id: string; label: Record<Lang, string> }
/** The fourteen domains, in the order of schema/enums/job-domains.yaml. */
export const DOMAINS: Domain[] = parse(readFileSync(repoPath("schema", "enums", "job-domains.yaml"), "utf8"));
export const domainLabel = (id: string, lang: Lang): string => {
  const d = DOMAINS.find((x) => x.id === id);
  return d ? d.label[lang] ?? d.label.en : id;
};

export const jobNodes: Node[] = realNodes.filter((n) => n.class === "job");
const personNodes: Node[] = realNodes.filter((n) => n.class === "person");

// job id -> the persons who hold it (one entry per person, however many stints the occupations block lists)
const holdersByJob = new Map<string, Node[]>();
for (const p of personNodes) {
  for (const job of new Set<string>((p.data.occupations ?? []).map((o: any) => o.job))) {
    const list = holdersByJob.get(job) ?? [];
    list.push(p);
    holdersByJob.set(job, list);
  }
}
export const holdersOf = (jobId: string): Node[] => holdersByJob.get(jobId) ?? [];
/** Persons with at least one occupations entry: the "people recorded" count of the browser home. */
export const peopleWithJobs: Node[] = personNodes.filter((p) => (p.data.occupations?.length ?? 0) > 0);
/** A job has an article when it has prose in at least one language. */
export const hasArticle = (n: Node): boolean => Object.keys(n.prose ?? {}).length > 0;

/** The headings that mark a job article's "not yet covered" section, in the three languages it is written in. */
export const JOB_NOT_YET = ["Not yet covered", "ما لم يُستوفَ بعد", "ابھی تحریر نہیں ہوا"];

// ---- the street of stalls (site/src/components/sig/JobsStreet.astro) ----------------------------------------------------
export interface Rect { x: number; y: number; w: number; h: number }
/**
 * Squarified treemap (Bruls, Huizing and van Wijk): lays the items out in `rect`, each with an area proportional to its value.
 * Items must be in descending order of value; the rectangles come back in the same order. Deterministic, no randomness.
 */
export function squarify<T extends { v: number }>(items: T[], rect: Rect): (T & Rect)[] {
  const total = items.reduce((s, i) => s + i.v, 0);
  const k = total > 0 ? (rect.w * rect.h) / total : 0;
  const out: (T & Rect)[] = [];
  let { x, y, w, h } = rect;
  let rest = items.map((i) => ({ i, a: i.v * k }));
  const worst = (row: { a: number }[], side: number) => {
    const s = row.reduce((t, r) => t + r.a, 0);
    const max = Math.max(...row.map((r) => r.a)), min = Math.min(...row.map((r) => r.a));
    return Math.max((side * side * max) / (s * s), (s * s) / (side * side * min));
  };
  while (rest.length) {
    const side = Math.min(w, h);
    const row = [rest[0]];
    let n = 1;
    while (n < rest.length && worst([...row, rest[n]], side) <= worst(row, side)) row.push(rest[n++]);
    const s = row.reduce((t, r) => t + r.a, 0);
    const thick = side > 0 ? s / side : 0;
    let off = 0;
    for (const r of row) {
      const len = s > 0 ? (r.a / s) * side : 0;
      out.push(w >= h ? { ...r.i, x, y: y + off, w: thick, h: len } : { ...r.i, x: x + off, y, w: len, h: thick });
      off += len;
    }
    if (w >= h) { x += thick; w -= thick; } else { y += thick; h -= thick; }
    rest = rest.slice(n);
  }
  return out;
}

/**
 * Up to `limit` holders of a job for the readout. When any holder carries a date (born, floruit...) the earliest by date come
 * first (undated holders after them) and `byDate` is true; otherwise the lib's own order is kept and `byDate` is false.
 */
export function holdersShown(jobId: string, limit = 5): { people: Node[]; byDate: boolean } {
  const all = holdersOf(jobId);
  const keyed = all.map((p, i) => ({ p, i, k: timelineKey(p as any).key }));
  const byDate = keyed.some((x) => Number.isFinite(x.k));
  if (byDate) keyed.sort((a, b) => (Number.isFinite(a.k) ? a.k : Infinity) - (Number.isFinite(b.k) ? b.k : Infinity) || a.i - b.i);
  return { people: keyed.slice(0, limit).map((x) => x.p), byDate };
}
