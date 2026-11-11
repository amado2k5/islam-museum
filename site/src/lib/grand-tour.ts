// The Grand Tour (docs/fable-run/): a guided walk through the museum's cornerstones, entered through the River of Time.
// The manifest (tour/grand-tour.yaml) is an ordered list of record ids and nothing else. Everything shown at a stop is
// read here from the record and the graph at build time: its date, its wings, its lead narrative, its counted position
// in the graph, its doors onward. The rules below are restated in scripts/fable/fable.py, which re-derives every number
// independently; if the two disagree, the oracle fails.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import { graph, byId, labelOf, href } from "./graph";
import { connectionsOf } from "./entity";
import { formatDate } from "./dates";
import type { Lang } from "./i18n";
import type { Node } from "../../../scripts/build-graph";

/** The Tour is published in Arabic and English. No /ur/ page is built. */
export const TOUR_LANGS: Lang[] = ["ar", "en"];
export const tourPath = (lang: Lang, slug?: string) => `/${lang}/grand-tour/${slug ? slug + "/" : ""}`;

const manifest = parse(readFileSync(repoPath("tour", "grand-tour.yaml"), "utf8")) as { stops: { id: string }[] };
export const stopIds: string[] = manifest.stops.map((s) => s.id);

// ---- where a record stands in time (the anchor rule) ----
// 1. the record's own date; 2. for a work with none, its latest-dying author; 3. otherwise it floats inside the periods
// it lists, or anywhere if it lists none. Hijri year: the one the record states for that date, else
// floor((CE year - 622) * 33 / 32) + 1. Century 0 is before the Hijra; 15 is the present century.
const OWN: Record<string, string[]> = { person: ["died", "floruit", "born"], event: ["date.start"], building: ["built"], object: ["made"], work: ["composed"], period: ["start"], polity: ["start"], place: ["founded"], group: ["founded"] };
const edtfYear = (d: any): number | undefined => { const m = /^\s*(-?\d{1,4})/.exec(String(d?.edtf ?? "")); return m ? Number(m[1]) : undefined; };
const hijriYear = (d: any): number => { const h = /^\s*(-?\d{1,4})/.exec(String(d?.hijri ?? "")); return h ? Number(h[1]) : Math.floor((edtfYear(d)! - 622) * 33 / 32) + 1; };
export const centuryOf = (hy: number) => (hy < 1 ? 0 : Math.floor((hy - 1) / 100) + 1);
const pick = (data: any, key: string) => key.split(".").reduce((o: any, k) => (o && typeof o === "object" ? o[k] : undefined), data);

export interface Anchor { basis: "own-date" | "author" | "period" | "none"; field?: string; date?: any; ce?: number; hijri?: number; century?: number; via?: string[]; lo?: number; hi?: number }

const authorsOf = new Map<string, string[]>();
for (const e of graph.edges) if (e.type === "authored" && !e.inverse) authorsOf.set(e.to, [...(authorsOf.get(e.to) ?? []), e.from]);

export function anchorOf(n: Node): Anchor {
  for (const key of OWN[n.class] ?? []) {
    const d = pick(n.data, key);
    if (d && typeof d === "object" && edtfYear(d) !== undefined) { const hy = hijriYear(d); return { basis: "own-date", field: key, date: d, ce: edtfYear(d), hijri: hy, century: centuryOf(hy) }; }
  }
  if (n.class === "work") {
    let best: { id: string; d: any } | undefined;
    for (const a of authorsOf.get(n.id) ?? []) { const d = byId.get(a)?.data.died; if (d && edtfYear(d) !== undefined && (!best || edtfYear(d)! > edtfYear(best.d)!)) best = { id: a, d }; }
    if (best) { const hy = hijriYear(best.d); return { basis: "author", field: "died", date: best.d, ce: edtfYear(best.d), hijri: hy, century: centuryOf(hy), via: [best.id] }; }
  }
  const spans = (n.periods ?? []).map((pid) => byId.get(pid)).filter((p): p is Node => !!p && edtfYear(p.data.start) !== undefined).map((p) => ({ id: p.id, lo: edtfYear(p.data.start)!, hi: edtfYear(p.data.end) ?? 9999 }));
  if (spans.length) return { basis: "period", via: spans.map((s) => s.id), lo: Math.min(...spans.map((s) => s.lo)), hi: Math.max(...spans.map((s) => s.hi)) };
  return { basis: "none" };
}

// ---- a record's counted position in the graph ----
const inbound = new Map<string, number>();
const neighbours = new Map<string, Set<string>>();
for (const e of graph.edges) {
  inbound.set(e.to, (inbound.get(e.to) ?? 0) + 1);
  if (!neighbours.has(e.from)) neighbours.set(e.from, new Set());
  neighbours.get(e.from)!.add(e.to);
}
const real = (id: string) => { const n = byId.get(id); return !!n && !n.stub; };
const pathwaysOf = new Map<string, Set<string>>();
for (const n of graph.nodes) {
  if (n.stub || !n.id.startsWith("exhibit/path-")) continue;
  for (const m of JSON.stringify(n.data.rooms ?? []).matchAll(/"([a-z]+\/[a-z0-9][a-z0-9-]*)"/g)) {
    if (!pathwaysOf.has(m[1])) pathwaysOf.set(m[1], new Set());
    pathwaysOf.get(m[1])!.add(n.id);
  }
}

export interface Door { label: string; node: Node }
export interface Stop {
  index: number; id: string; slug: string; node: Node; anchor: Anchor;
  /** the century the visitor stands in at this stop: the latest century reached by a dated stop so far */
  walk: number;
  /** relations in the graph that arrive at this record (inverses included, as the graph holds them) */
  relations: number;
  /** distinct records directly related to it (stubs excluded) */
  linked: number;
  /** pathways (exhibit/path-*) that feature it */
  pathways: number;
}

const stopSet = new Set(stopIds);
let walk = 0;
export const stops: Stop[] = stopIds.map((id, i) => {
  const node = byId.get(id);
  if (!node || node.stub) throw new Error(`grand tour: ${id} is not a record`);
  const anchor = anchorOf(node);
  if (anchor.century !== undefined) walk = Math.max(walk, Math.min(anchor.century, 15));
  return { index: i, id, slug: node.slug, node, anchor, walk, relations: inbound.get(id) ?? 0, linked: [...(neighbours.get(id) ?? [])].filter(real).length, pathways: pathwaysOf.get(id)?.size ?? 0 };
});
if (new Set(stops.map((s) => s.slug)).size !== stops.length) throw new Error("grand tour: two stops share a slug");
if (stops.some((s) => s.slug === "complete")) throw new Error("grand tour: a stop is named 'complete'");

/** The record's own strongest relations that lead off the path: cornerstones first, then canon, then the best-connected. */
export function sideDoors(stop: Stop, lang: Lang, n = 4): Door[] {
  const seen = new Set<string>();
  const all: Door[] = [];
  for (const g of connectionsOf(stop.id, lang)) for (const { node } of g.items) {
    if (node.stub || stopSet.has(node.id) || seen.has(node.id)) continue;
    seen.add(node.id);
    all.push({ label: g.label, node });
  }
  const rank = (d: Door) => d.node.data.importance ?? 3;
  return all.sort((a, b) => rank(a) - rank(b) || b.node.degree - a.node.degree || a.node.id.localeCompare(b.node.id)).slice(0, n);
}

/** Distinct records (stubs and the stops themselves excluded) directly related to at least one stop. */
export const hangingOff: number = (() => {
  const out = new Set<string>();
  for (const s of stops) for (const t of neighbours.get(s.id) ?? []) if (real(t) && !stopSet.has(t)) out.add(t);
  return out.size;
})();

/** Relations in the graph between two stops (each pair once), for the route drawing. */
export const stopLinks: [number, number][] = (() => {
  const idx = new Map(stops.map((s) => [s.id, s.index]));
  const seen = new Set<string>();
  const out: [number, number][] = [];
  for (const e of graph.edges) {
    const a = idx.get(e.from), b = idx.get(e.to);
    if (a === undefined || b === undefined || a === b) continue;
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!seen.has(k)) { seen.add(k); out.push(a < b ? [a, b] : [b, a]); }
  }
  return out.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
})();

/** Cornerstones dated to each century by their own date (index 0..15): the river is widest where the canon is densest. */
export const density: number[] = (() => {
  const out = new Array(16).fill(0);
  for (const n of graph.nodes) {
    if (n.stub || n.data.importance !== 1) continue;
    const a = anchorOf(n);
    if (a.basis === "own-date" && a.century !== undefined) out[Math.min(a.century, 15)]++;
  }
  return out;
})();

/** The date line of a stop: the record's own date, or the periods it stands in, or nothing (the page then says so). */
export function dateText(stop: Stop, lang: Lang): { kind: "date" | "period" | "none"; field?: string; text: string } {
  const a = stop.anchor;
  if (a.basis === "own-date" || a.basis === "author") return { kind: "date", field: a.basis === "author" ? "author" : a.field, text: formatDate(a.date, lang).text };
  if (a.basis === "period") return { kind: "period", text: (a.via ?? []).map((id) => labelOf(byId.get(id)!, lang)).join(lang === "ar" ? "، " : ", ") };
  return { kind: "none", text: "" };
}

/** The stop's narrative: the lead section of the record's own prose in this language. */
export const leadOf = (stop: Stop, lang: Lang) => stop.node.prose[lang]?.sections[0];

export const stopHref = (lang: Lang, stop: Stop) => tourPath(lang, stop.slug);
export const recordHref = (lang: Lang, stop: Stop) => href(lang, stop.id);
