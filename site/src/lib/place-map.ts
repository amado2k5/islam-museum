// The Place wing map's data, built once per build from the compiled graph (docs/site/dates-timeline-maps.md, "The Place
// wing map"). Three consumers read it:
//   - site/src/components/PlaceMap.astro draws the map as plain SVG in the page (it reads without JavaScript) and the
//     index of places under it;
//   - site/src/pages/[lang]/place-map/[file].json.ts writes the files the page's script fetches: places.json (every
//     place: name, position, region, how many records are tied to it, the years it is active) and 2 × 128 small files
//     with the people, events and buildings tied to each place and each record's own links. Nothing of this is baked into the HTML: the page was
//     25 MB when it was.
//   - scripts/place-map.test.ts checks the pure helpers in place-map-core.ts.
// The map is a view over the one graph (AGENTS.md): places and their edges, nothing typed here but the twelve regions'
// country lists and where each region's name sits.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { feature, merge, mesh } from "topojson-client";
import { geoContains, geoNaturalEarth1, geoPath } from "d3-geo";
import { parse } from "yaml";
import { repoPath } from "./paths";
import { byId, graph, href, labelOf, realNodes, summaryOf } from "./graph";
import { ERA, startOf, yearOf } from "./dates";
import { civilToHijri, hijriToCivil } from "../../../scripts/hijri/convert";
import type { Lang } from "./i18n";
import { activityState, mergeIntervals, shardName, shardOf, SHARDS, tierOf, wholeYears, yearBounds, type Interval } from "./place-map-core";
export { shardName, shardOf, SHARDS };

/** The world plane every position is expressed in: Natural Earth projection of the whole world fitted to 1000 × 560. */
export const W = 1000, H = 560;
/** The file-name part for places outside the twelve regions. */
export const ELSEWHERE = "elsewhere";

// The twelve museum regions as groups of countries (world-atlas names), the strength of each one's tint, and the point
// [longitude, latitude] its name is anchored to (a hand-picked spot inside the region: a centroid falls in the sea for
// Southeast Asia and in the far west of China). The names themselves are in i18n (map.viewer.regions).
const REGIONS: { id: string; tint: number; anchor: [number, number]; countries: string[] }[] = [
  { id: "andalus-europe", tint: 0.16, anchor: [9, 48.5], countries: ["Portugal", "Spain", "France", "Italy", "United Kingdom", "Ireland", "Belgium", "Netherlands", "Luxembourg", "Germany", "Switzerland", "Austria", "Czechia", "Slovakia", "Poland", "Denmark", "Norway", "Sweden", "Finland", "Iceland", "Estonia", "Latvia", "Lithuania", "Belarus", "Ukraine", "Moldova"] },
  { id: "maghreb", tint: 0.22, anchor: [3, 29], countries: ["Morocco", "W. Sahara", "Algeria", "Tunisia", "Libya", "Mauritania"] },
  { id: "west-africa-sahel", tint: 0.3, anchor: [3, 13.5], countries: ["Senegal", "Gambia", "Guinea-Bissau", "Guinea", "Sierra Leone", "Liberia", "Côte d'Ivoire", "Mali", "Burkina Faso", "Niger", "Nigeria", "Chad", "Cameroon", "Ghana", "Togo", "Benin"] },
  { id: "egypt-nile", tint: 0.24, anchor: [30.5, 19.5], countries: ["Egypt", "Sudan", "S. Sudan"] },
  { id: "east-africa", tint: 0.28, anchor: [39.5, 3], countries: ["Eritrea", "Djibouti", "Ethiopia", "Somalia", "Kenya", "Uganda", "Rwanda", "Burundi", "Tanzania", "Mozambique"] },
  { id: "arabia", tint: 0.36, anchor: [46, 22.5], countries: ["Saudi Arabia", "Yemen", "Oman", "United Arab Emirates", "Qatar", "Kuwait"] },
  { id: "levant-iraq", tint: 0.32, anchor: [41.5, 34], countries: ["Iraq", "Syria", "Lebanon", "Jordan", "Israel", "Palestine", "Cyprus", "N. Cyprus"] },
  { id: "anatolia-balkans", tint: 0.2, anchor: [31, 41], countries: ["Turkey", "Georgia", "Armenia", "Azerbaijan", "Greece", "Albania", "Macedonia", "Bulgaria", "Romania", "Serbia", "Kosovo", "Montenegro", "Bosnia and Herz.", "Croatia", "Slovenia", "Hungary"] },
  { id: "persia-central-asia", tint: 0.4, anchor: [62, 40], countries: ["Iran", "Afghanistan", "Turkmenistan", "Uzbekistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan"] },
  { id: "south-asia", tint: 0.46, anchor: [78.5, 22], countries: ["Pakistan", "India", "Bangladesh", "Nepal", "Bhutan", "Sri Lanka"] },
  { id: "southeast-asia", tint: 0.34, anchor: [106, 4], countries: ["Myanmar", "Thailand", "Laos", "Cambodia", "Vietnam", "Malaysia", "Indonesia", "Brunei", "Philippines", "Timor-Leste"] },
  { id: "china-east-asia", tint: 0.26, anchor: [104, 35.5], countries: ["China", "Mongolia", "Taiwan", "North Korea", "South Korea", "Japan"] },
];
export const REGION_IDS = REGIONS.map((r) => r.id);

// What may stand around a place on the map, and which relations date a place (a person born there dates it; a book
// that merely mentions it does not).
const KEEP = new Set(["person", "event", "place", "building", "group", "work", "journey", "polity", "object"]);
const DATING = new Set(["born_in", "died_in", "buried_in", "lived_in", "traveled_to", "ruler_of", "ruled_over", "occurred_at", "site_of", "located_in", "wrote_in", "built", "founded", "visited_by", "made_in", "capital_of"]);
/** An entity's own links shown when it is in focus: at most this many, places first, then the best-connected. */
const FOCUS_LINKS = 60;

type GNode = (typeof realNodes)[number];
/** [other end's id, relation, 0 when this record is the edge's subject and 1 when it is its object] */
type Link = [string, string, 0 | 1];

export interface MapRegion { id: string; d: string; bbox: [number, number, number, number]; ax: number; ay: number; tint: number; count: number }
export interface MapPlace { id: string; slug: string; node: GNode; x: number; y: number; r: number; kind: string; n: number; iv: number[]; approx: boolean }
export interface MapModel {
  land: string; borders: string;
  regions: MapRegion[];
  /** Every place the map shows, best-connected first (so a lower index wins a name on the map). */
  places: MapPlace[];
  /** Places per region index; index REGIONS.length is "elsewhere". */
  byRegion: number[][];
  /** The rectangle (world plane) that holds the twelve regions, and a tighter one from Morocco to Bengal for narrow screens. */
  home: [number, number, number, number]; core: [number, number, number, number];
  /** Slider range in Hijri years and the civil year each one maps to (mid-year, the site's converter). */
  ahMin: number; ahMax: number; ce: number[]; startAh: number;
  /** Dated records tied to places, counted per 25 Hijri years from ahMin: the slider's backdrop. */
  bins: number[];
  adj: Map<string, Link[]>;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

let cached: MapModel | null = null;
export function placeMapModel(): MapModel {
  if (cached) return cached;
  const topo = JSON.parse(readFileSync(repoPath("site", "node_modules", "world-atlas", "countries-110m.json"), "utf8")) as any;
  const world = feature(topo, topo.objects.countries) as any;
  const projection = geoNaturalEarth1().fitSize([W, H], world);
  const path = geoPath(projection as any).digits(2);
  const geoms = topo.objects.countries.geometries as any[];
  const land = path(merge(topo, geoms as any) as any) ?? "";
  const borders = path(mesh(topo, topo.objects.countries, (a: any, b: any) => a !== b) as any) ?? "";
  const xy = (lon: number, lat: number) => projection([lon, lat]) as [number, number];

  const regionGeo = REGIONS.map((r) => merge(topo, geoms.filter((g) => r.countries.includes(g.properties.name)) as any) as any);
  const regions: MapRegion[] = REGIONS.map((r, i) => {
    const [[x0, y0], [x1, y1]] = path.bounds(regionGeo[i]);
    const [ax, ay] = xy(r.anchor[0], r.anchor[1]);
    return { id: r.id, d: path(regionGeo[i]) ?? "", bbox: [r2(x0), r2(y0), r2(x1), r2(y1)], ax: r2(ax), ay: r2(ay), tint: r.tint, count: 0 };
  });

  // Places with coordinates; a place without them (a quarter, a small battle site) borrows its host place's position
  // with a small turn, and is marked approximate so the page can say so.
  const coord = new Map<string, [number, number]>();
  const approx = new Set<string>();
  const hostOf = new Map<string, string>();
  // [0, 0] is a placeholder some records carry, not a position in the Gulf of Guinea: such a place is treated as one without coordinates.
  const placed = (c: unknown): c is [number, number] => Array.isArray(c) && c.length === 2 && !(c[0] === 0 && c[1] === 0);
  for (const n of realNodes) if (n.class === "place" && placed(n.coordinates)) coord.set(n.id, n.coordinates as [number, number]);
  let turn = 0;
  for (const n of realNodes) {
    if (n.class !== "place" || coord.has(n.id)) continue;
    const e = graph.edges.find((x) => !x.inverse && ((x.from === n.id && coord.has(x.to) && !approx.has(x.to)) || (x.to === n.id && coord.has(x.from) && !approx.has(x.from))));
    if (!e) continue;
    const host = e.from === n.id ? e.to : e.from;
    const base = coord.get(host)!;
    const a = turn++ * 2.4;
    coord.set(n.id, [base[0] + Math.sin(a) * 0.12, base[1] + Math.cos(a) * 0.12]);
    approx.add(n.id);
    hostOf.set(n.id, host);
  }
  const placeNodes = realNodes.filter((n) => n.class === "place" && coord.has(n.id));
  const placeIds = new Set(placeNodes.map((n) => n.id));

  // One pass over the edges: who stands next to whom, among places and the records one step from a place.
  const near = new Set(placeIds);
  for (const e of graph.edges) {
    if (e.inverse) continue;
    if (placeIds.has(e.from) && KEEP.has(byId.get(e.to)?.class ?? "") && !byId.get(e.to)!.stub) near.add(e.to);
    if (placeIds.has(e.to) && KEEP.has(byId.get(e.from)?.class ?? "") && !byId.get(e.from)!.stub) near.add(e.from);
  }
  const adj = new Map<string, Link[]>();
  const push = (id: string, l: Link) => { const a = adj.get(id); if (a) a.push(l); else adj.set(id, [l]); };
  for (const e of graph.edges) {
    if (e.inverse || e.from === e.to || !near.has(e.from) || !near.has(e.to)) continue;
    push(e.from, [e.to, e.type, 0]);
    push(e.to, [e.from, e.type, 1]);
  }

  // The region of a place: its first tag among the twelve, else the region whose outline holds it (tried a little to
  // two degrees around it as well, because the 1:110m coastline cuts off harbours and islands), else "elsewhere".
  const regionIndex = new Map(REGIONS.map((r, i) => [r.id, i] as const));
  const containing = (lat: number, lon: number): number => {
    const ring: [number, number][] = [[0, 0]];
    for (const d of [0.5, 1, 1.5, 2]) for (let k = 0; k < 8; k++) ring.push([Math.sin((k * Math.PI) / 4) * d, Math.cos((k * Math.PI) / 4) * d]);
    for (const [dy, dx] of ring) {
      const [px, py] = xy(lon + dx, lat + dy);
      for (let i = 0; i < regionGeo.length; i++) {
        const [x0, y0, x1, y1] = regions[i].bbox;
        if (px < x0 - 1 || px > x1 + 1 || py < y0 - 1 || py > y1 + 1) continue;
        if (geoContains(regionGeo[i], [lon + dx, lat + dy])) return i;
      }
    }
    return REGIONS.length;
  };

  const starts: number[] = [], ends: number[] = [];
  const datedSeen = new Set<string>();
  const places: MapPlace[] = placeNodes.map((n) => {
    const [lat, lon] = coord.get(n.id)!;
    const [x, y] = xy(lon, lat);
    const tagged = (n.regions ?? []).map((id: string) => regionIndex.get(id)).find((i: number | undefined) => i !== undefined);
    const host = hostOf.get(n.id);
    const hostTag = host ? (byId.get(host)?.regions ?? []).map((id: string) => regionIndex.get(id)).find((i: number | undefined) => i !== undefined) : undefined;
    const r = tagged ?? hostTag ?? containing(lat, lon);
    const links = adj.get(n.id) ?? [];
    const spans: Interval[] = [];
    if ((n as any).span) spans.push(wholeYears((n as any).span));
    for (const [other, type] of links) {
      const o = byId.get(other) as any;
      if (!o?.span || !DATING.has(type)) continue;
      spans.push(wholeYears(o.span));
      if (!datedSeen.has(other)) { datedSeen.add(other); starts.push(o.span.earliest); ends.push(o.span.latest); }
    }
    return { id: n.id, slug: n.slug, node: n, x: r2(x), y: r2(y), r, kind: String((n as any).data?.kind ?? "site"), n: new Set(links.map((l) => l[0])).size, iv: mergeIntervals(spans), approx: approx.has(n.id) };
  });
  places.sort((a, b) => b.n - a.n || (a.slug < b.slug ? -1 : 1));
  const byRegion: number[][] = Array.from({ length: REGIONS.length + 1 }, () => []);
  places.forEach((p, i) => { byRegion[p.r].push(i); if (p.r < REGIONS.length) regions[p.r].count++; });

  const box = (list: MapRegion[]): [number, number, number, number] => [Math.min(...list.map((r) => r.bbox[0])), Math.min(...list.map((r) => r.bbox[1])), Math.max(...list.map((r) => r.bbox[2])), Math.max(...list.map((r) => r.bbox[3]))];
  const home = box(regions);
  const [cx0, cy0] = xy(-17, 47), [cx1, cy1] = xy(92, 4);
  const core: [number, number, number, number] = [r2(cx0), r2(cy0), r2(cx1), r2(cy1)];

  // The slider counts Hijri years, as the wing always has; its ends come from the dated records (place-map-core.ts).
  const b = yearBounds(starts, ends);
  const toAh = (y: number, end: boolean) => civilToHijri(y < 1583 ? "julian" : "gregorian", { y, m: end ? 12 : 1, d: end ? 31 : 1 }).date.y;
  const ahMin = toAh(b.min, false), ahMax = toAh(Math.ceil(b.max), true);
  const ce: number[] = [];
  for (let a = ahMin; a <= ahMax; a++) ce.push(hijriToCivil({ y: a, m: 7, d: 1 }).date.y);
  const bins: number[] = Array.from({ length: Math.ceil((ahMax - ahMin + 1) / 25) }, () => 0);
  for (const id of datedSeen) {
    const s = wholeYears((byId.get(id) as any).span);
    for (let k = 0; k < bins.length; k++) {
      const from = ce[Math.min(k * 25, ce.length - 1)], to = ce[Math.min(k * 25 + 24, ce.length - 1)];
      if (s[0] <= to && s[1] >= from) bins[k]++;
    }
  }
  cached = { land, borders, regions, places, byRegion, home, core, ahMin, ahMax, ce, startAh: Math.min(Math.max(11, ahMin), ahMax), bins, adj };
  return cached;
}

/** The marker paths as the page first draws them: one path per size and per state at the opening year, each place a stroke a hundredth of a unit long with a round cap, which every browser draws as a dot. */
export function dotPaths(m: MapModel): string[][] {
  const year = m.ce[m.startAh - m.ahMin];
  const out: string[][] = [0, 1, 2].map(() => ["", "", "", ""]);
  for (const p of m.places) out[tierOf(p.n)][activityState(p.iv, year)] += `M${p.x} ${p.y}h.01`;
  return out;
}

const predicates: Record<string, any> = parse(readFileSync(repoPath("schema", "predicates.yaml"), "utf8"));
/** A relation's name read from the subject's side and from the object's side, in the page's language (the registry holds Arabic and English; other languages fall back to English, as entity pages do). */
export function relationLabels(lang: Lang, types: string[], own: Record<string, string> = {}): Record<string, [string, string]> {
  const out: Record<string, [string, string]> = {};
  for (const t of types) {
    const p = predicates[t];
    const fwd = own[t] ?? p?.label?.[lang] ?? p?.label?.en ?? t.replaceAll("_", " ");
    const inv = p?.inverse_label?.[lang] ?? p?.inverse_label?.en ?? fwd;
    out[t] = [fwd, inv];
  }
  return out;
}

const teaser = (s: string, n: number) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);

/** Stored years only, never a converted or invented one: "570–632 CE", "624 CE", "– 855 CE" when only the end is known. */
export function yearsText(n: GNode, lang: Lang): string {
  const d = (n as any).data ?? {};
  const E = ERA[lang];
  const a = yearOf(startOf(d)), b = yearOf(d.died ?? d.date?.end ?? d.end);
  const one = (y: number) => (y < 0 ? `${-y} ${E.bce}` : `${y}`);
  if (a === undefined && b === undefined) return "";
  if (a !== undefined && b !== undefined && a !== b) return `${one(a)}–${one(b)}${b >= 0 ? " " + E.ce : ""}`;
  if (a !== undefined) return `${one(a)}${a >= 0 ? " " + E.ce : ""}`;
  return `– ${one(b!)}${b! >= 0 ? " " + E.ce : ""}`;
}

/** places.json: what the script needs to draw, name, search and time every place. Rows are best-connected first. */
export function corePayload(lang: Lang) {
  const m = placeMapModel();
  const kinds = [...new Set(m.places.map((p) => p.kind))].sort();
  const others = (["ar", "en", "ur"] as Lang[]).filter((l) => l !== lang);
  return {
    v: 1,
    kinds,
    // [slug, name, its names in the other two languages joined by "|" (for search only: a reader of the Urdu page may type "Konya") or 0, x, y, region, kind, records tied to it, active years (flat pairs), 1 when the position is borrowed]
    places: m.places.map((p) => {
      const label = labelOf(p.node, lang);
      const alt = [...new Set(others.map((l) => p.node.label[l]).filter((x): x is string => !!x && x !== label))].join("|");
      const row: (string | number | number[])[] = [p.slug, label, alt || 0, p.x, p.y, p.r, kinds.indexOf(p.kind), p.n, p.iv];
      if (p.approx) row.push(1);
      return row;
    }),
  };
}

interface Shards { p: any[]; e: any[] }
const shardCache = new Map<Lang, Shards>();
/**
 * The files behind a click, per language:
 *   p-<hh>.json  for the places whose slug hashes to hh: a short summary and the place's links;
 *   e-<hh>.json  for the records whose id hashes to hh: a short summary and the record's own links (for the focus view).
 * Each file names the records its links point to in a small table of its own: [id, name, first year, last year, years as text, degree].
 * An e-file entry is [summary, number of links in all, links (at most FOCUS_LINKS), name, years as text].
 */
export function shards(lang: Lang): Shards {
  const hit = shardCache.get(lang);
  if (hit) return hit;
  const m = placeMapModel();
  const placeIds = new Set(m.places.map((p) => p.id));
  const degree = (id: string) => (byId.get(id) as any)?.degree ?? 0;
  const make = () => {
    const types: string[] = [], ents: any[] = [], index = new Map<string, number>();
    return {
      types, ents,
      type(t: string) { let i = types.indexOf(t); if (i < 0) { types.push(t); i = types.length - 1; } return i; },
      ent(id: string) {
        let i = index.get(id);
        if (i === undefined) {
          const n = byId.get(id)!;
          const span = (n as any).span ? wholeYears((n as any).span) : null;
          i = ents.length;
          index.set(id, i);
          ents.push([id, labelOf(n, lang), span ? span[0] : null, span ? span[1] : null, n.class === "place" ? "" : yearsText(n, lang), degree(id)]);
        }
        return i;
      },
    };
  };
  const P = Array.from({ length: SHARDS }, () => ({ t: make(), places: {} as Record<string, [string, number[][]]> }));
  const E = Array.from({ length: SHARDS }, () => ({ t: make(), full: {} as Record<string, [string, number, number[][], string, string]> }));
  for (const p of m.places) {
    const s = P[shardOf(p.slug)];
    s.places[p.slug] = [teaser(summaryOf(p.node, lang), 260), (m.adj.get(p.id) ?? []).map(([other, type, dir]) => [s.t.ent(other), s.t.type(type), dir])];
  }
  for (const [id, all] of m.adj) {
    if (placeIds.has(id)) continue;
    const s = E[shardOf(id)];
    const ranked = all.length > FOCUS_LINKS ? [...all].sort((a, b) => Number(placeIds.has(b[0])) - Number(placeIds.has(a[0])) || degree(b[0]) - degree(a[0]) || (a[0] < b[0] ? -1 : 1)).slice(0, FOCUS_LINKS) : all;
    const me = byId.get(id)!;
    s.full[id] = [teaser(summaryOf(me, lang), 160), all.length, ranked.map(([other, type, dir]) => [s.t.ent(other), s.t.type(type), dir]), labelOf(me, lang), yearsText(me, lang)];
  }
  const out: Shards = { p: P.map((s) => ({ v: 1, types: s.t.types, ents: s.t.ents, places: s.places })), e: E.map((s) => ({ v: 1, types: s.t.types, ents: s.t.ents, full: s.full })) };
  shardCache.set(lang, out);
  return out;
}

const versions = new Map<Lang, string>();
/**
 * A short fingerprint of everything the script can fetch for a language. The page carries it and the script adds it to
 * every request (`places.json?v=…`), so a page and its data always come from the same build: the Worker lets a browser
 * keep a JSON file for a day and a page for an hour, and without this a reader could meet today's page with
 * yesterday's places. It changes only when the data does, so the page's HTML changes only then.
 */
export function dataVersion(lang: Lang): string {
  let v = versions.get(lang);
  if (!v) {
    const h = createHash("sha256");
    h.update(JSON.stringify(corePayload(lang)));
    const s = shards(lang);
    for (const part of [...s.p, ...s.e]) h.update(JSON.stringify(part));
    v = h.digest("hex").slice(0, 10);
    versions.set(lang, v);
  }
  return v;
}

/** Every relation that can appear in those files, for the page's label table. */
export function allRelationTypes(): string[] {
  const m = placeMapModel();
  const s = new Set<string>();
  for (const links of m.adj.values()) for (const l of links) s.add(l[1]);
  return [...s].sort();
}

/** The index under the map: every place by region, sorted by name in the page's language, plus the wing's other records. */
export function placeIndex(lang: Lang) {
  const m = placeMapModel();
  const coll = new Intl.Collator(lang === "ur" ? "ur" : lang === "ar" ? "ar" : "en", { sensitivity: "base", numeric: true });
  const groups = m.byRegion.map((ix, r) => ({
    id: r < REGIONS.length ? REGIONS[r].id : ELSEWHERE,
    places: ix.map((i) => ({ label: labelOf(m.places[i].node, lang), href: href(lang, m.places[i].id), slug: m.places[i].slug })).filter((p) => p.label).sort((a, b) => coll.compare(a.label, b.label)),
  }));
  const shown = new Set(m.places.map((p) => p.id));
  const others = realNodes.filter((n) => n.wings.includes("place") && !shown.has(n.id) && labelOf(n, lang)).map((n) => ({ cls: n.class, label: labelOf(n, lang), href: href(lang, n.id) })).sort((a, b) => (a.cls === b.cls ? coll.compare(a.label, b.label) : a.cls < b.cls ? -1 : 1));
  return { groups, others };
}
