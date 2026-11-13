// The Khutab and Durus Explorer's shared reads (docs/plan/25-khutab-durus-explorer.md): the sermons (works of kind
// "sermon") and the recorded lesson series (kind "lecture-series"), read by the landing page's lists and by its signature
// view (site/src/components/sig/KhutabMinbar.astro). Read at build time on the browser's own page only.
import { realNodes, byId, labelOf } from "./graph";
import type { Lang } from "./i18n";

const works = realNodes.filter((n: any) => n.class === "work");

/** The Hijri year of a work's composition date ("0011-01-12" → 11; month as a fraction), or null when it has none. */
export function composedHijri(n: any): { year: number; at: number; approx: boolean } | null {
  const h = String(n.data.composed?.hijri ?? "");
  const m = h.match(/^(-?\d{1,4})(?:-(\d{2}))?/);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  return { year, at: year + (m[2] ? (Number(m[2]) - 1) / 12 : 0), approx: /[~?]/.test(h) };
}
const hijriYear = (n: any) => composedHijri(n)?.year ?? 99999;

/** Sermons in order of Hijri year; undated ones come last. */
export const sermons: any[] = works.filter((n: any) => n.data.kind === "sermon")
  .sort((a: any, b: any) => hijriYear(a) - hijriYear(b) || String(a.id).localeCompare(String(b.id)));
export const datedSermons = sermons.filter((n) => composedHijri(n));
export const undatedSermons = sermons.filter((n) => !composedHijri(n));
export const series: any[] = works.filter((n: any) => n.data.kind === "lecture-series");

export const speakerOf = (n: any) => { const id = n.data.delivered?.by ?? n.data.authors?.[0]; return id ? byId.get(id) : undefined; };

/** Lecture series grouped by speaker, the largest group first (a group with no speaker has id "_none"). */
export function seriesGroups(lang: Lang) {
  const bySpeaker = new Map<string, any[]>();
  for (const n of series) { const sp = speakerOf(n); const k = sp ? sp.id : "_none"; (bySpeaker.get(k) ?? bySpeaker.set(k, []).get(k)!).push(n); }
  return [...bySpeaker.entries()]
    .map(([k, items]) => ({ id: k, speaker: k === "_none" ? undefined : byId.get(k), items: items.sort((a: any, b: any) => labelOf(a, lang).localeCompare(labelOf(b, lang), lang)) }))
    .sort((a, b) => b.items.length - a.items.length || String(a.id).localeCompare(String(b.id)));
}
