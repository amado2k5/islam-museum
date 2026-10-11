// Derives view-ready artifacts from the compiled graph: timeline rows, map features (GeoJSON),
// ego graphs, snapshot-year indexes and on-this-day indexes → .cache/derived/*.json
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Compiled, Node } from "./build-graph.js";
import { p } from "./lib.js";

const sorted = <T>(a: T[], f: (t: T) => number) => [...a].sort((x, y) => f(x) - f(y));

export function derive(c: Compiled) {
  const real = c.nodes.filter((n) => !n.stub);
  const byId = new Map(c.nodes.map((n) => [n.id, n]));

  const timeline = sorted(real.filter((n) => n.span), (n) => n.span!.earliest).map((n) => ({
    id: n.id, class: n.class, label: n.label, earliest: +n.span!.earliest.toFixed(3), latest: +n.span!.latest.toFixed(3), wings: n.wings,
  }));

  const features = real.filter((n) => n.coordinates).map((n) => ({
    type: "Feature", id: n.id,
    geometry: { type: "Point", coordinates: [n.coordinates![1], n.coordinates![0]] }, // GeoJSON is [lon, lat]
    properties: { id: n.id, class: n.class, label: n.label, summary: n.summary, kind: n.data.kind },
  }));
  const map = { type: "FeatureCollection", features };

  const ego: Record<string, { nodes: any[]; edges: any[] }> = {};
  for (const n of real.filter((x) => x.class === "person")) {
    const edges = c.edges.filter((e) => !e.inverse && (e.from === n.id || e.to === n.id));
    const ids = new Set<string>([n.id, ...edges.flatMap((e) => [e.from, e.to])]);
    ego[n.id] = {
      nodes: [...ids].map((i) => { const m = byId.get(i)!; return { id: i, class: m.class, label: m.label, stub: m.stub }; }),
      edges: edges.map((e) => ({ from: e.from, to: e.to, type: e.type })),
    };
  }

  // snapshot years every 25 years: entities whose span covers the year
  const snapshots: Record<number, string[]> = {};
  for (let y = 600; y <= 2000; y += 25) {
    snapshots[y] = real.filter((n) => n.span && n.span.earliest <= y + 1 && n.span.latest >= y).map((n) => n.id);
  }

  // on this day: entities with a day-precision date, keyed by MM-DD (Gregorian/Julian as written) and by Hijri MM-DD
  const onThisDay: Record<string, { id: string; which: string; year?: number }[]> = {};
  const hijriDay: Record<string, { id: string; which: string; year?: number }[]> = {};
  const visit = (n: Node, which: string, d: any) => {
    if (!d) return;
    const g = d.edtf?.match(/^(-?\d{4})-(\d{2})-(\d{2})$/);
    if (g) (onThisDay[`${g[2]}-${g[3]}`] ??= []).push({ id: n.id, which, year: Number(g[1]) });
    const h = d.hijri?.match(/^(-?\d{4})-(\d{2})-(\d{2})$/);
    if (h) (hijriDay[`${h[2]}-${h[3]}`] ??= []).push({ id: n.id, which, year: Number(h[1]) });
  };
  for (const n of real) {
    visit(n, "born", n.data.born); visit(n, "died", n.data.died);
    visit(n, "start", n.data.date?.start); visit(n, "end", n.data.date?.end);
  }

  return { timeline, map, ego, snapshots, onThisDay: { gregorian: onThisDay, hijri: hijriDay } };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const c: Compiled = JSON.parse(readFileSync(p(".cache", "graph.json"), "utf8"));
  const d = derive(c);
  mkdirSync(p(".cache", "derived"), { recursive: true });
  for (const [k, v] of Object.entries(d)) writeFileSync(p(".cache", "derived", `${k}.json`), JSON.stringify(v));
  console.log(`derived: ${d.timeline.length} timeline rows, ${d.map.features.length} map features, ${Object.keys(d.ego).length} ego graphs`);
}
