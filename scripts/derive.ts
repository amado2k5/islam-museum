// Derives view-ready artifacts from the compiled graph: timeline rows, map features (GeoJSON),
// ego graphs, snapshot-year indexes and on-this-day indexes → .cache/derived/*.json
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Compiled, Node } from "./build-graph.js";
import { p, readYaml } from "./lib.js";

const sorted = <T>(a: T[], f: (t: T) => number) => [...a].sort((x, y) => f(x) - f(y));


// ---------- build-time search aids (docs/plan/03 §13: no runtime AI or compute) ----------
const norm = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f\u064B-\u0652\u0670]/g, "").toLowerCase().replace(/['’‘`ʿʾ]/g, "").replace(/[-_()/,.]/g, " ").replace(/\s+/g, " ").trim();

/** Variant spellings -> canonical labels, from labels, names[], aliases and the rules in scripts/search-variants.yaml. */
export function buildSynonyms(c: Compiled) {
  const rules = readYaml<{ swap: [string, string][]; drop_prefix: string[] }>(p("scripts", "search-variants.yaml"));
  const out = new Map<string, Set<string>>();
  const add = (variant: string, canonical: string) => {
    const v = norm(variant);
    if (v.length < 3 || v === norm(canonical)) return;
    (out.get(v) ?? out.set(v, new Set()).get(v)!).add(canonical);
  };
  for (const n of c.nodes.filter((x) => !x.stub && !(x.class === "passage" && x.data.unit === "ayah") && x.class !== "source")) {
    const canonical = n.label.en;
    if (!canonical) continue;
    const forms = new Set<string>([canonical, ...Object.values(n.label), ...(n.data.names ?? []).map((x: any) => x.value), ...n.aliases.map((a) => a.split("/")[1].replace(/-/g, " "))]);
    for (const form of forms) {
      const full = norm(form);
      add(form, canonical);                                              // names and aliases find the canonical label
      const bases = new Set([full]);
      for (const pre of rules.drop_prefix) if (full.startsWith(pre + " ")) bases.add(full.slice(pre.length + 1));
      for (const base of bases) {
        add(base, canonical);
        for (const [from, to] of rules.swap) {
          if (base.includes(from)) add(base.replace(from, to), canonical);
          if (base.includes(to)) add(base.replace(to, from), canonical);
        }
      }
    }
  }
  return Object.fromEntries([...out].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, [...v].slice(0, 3)]));
}

/** "People also explored": shared neighbours (weight 3) and shared themes (weight 1), plus the same period, computed once at build time. */
export function buildRelated(c: Compiled, perNode = 8) {
  const skip = (n: Node) => n.stub || n.class === "source" || n.class === "media" || (n.class === "passage" && n.data.unit === "ayah");
  const nodes = c.nodes.filter((n) => !skip(n));
  const ids = new Set(nodes.map((n) => n.id));
  const nbr = new Map<string, Set<string>>();
  for (const e of c.edges) {
    if (e.inverse || !ids.has(e.from) || !ids.has(e.to)) continue;
    (nbr.get(e.from) ?? nbr.set(e.from, new Set()).get(e.from)!).add(e.to);
    (nbr.get(e.to) ?? nbr.set(e.to, new Set()).get(e.to)!).add(e.from);
  }
  const byTheme = new Map<string, string[]>();
  for (const n of nodes) for (const t of n.themes) (byTheme.get(t) ?? byTheme.set(t, []).get(t)!).push(n.id);
  const related: Record<string, string[]> = {};
  for (const n of nodes) {
    const score = new Map<string, number>();
    const bump = (id: string, w: number) => { if (id !== n.id && ids.has(id)) score.set(id, (score.get(id) ?? 0) + w); };
    for (const m of nbr.get(n.id) ?? []) {
      bump(m, 2);                                            // direct neighbours
      for (const k of nbr.get(m) ?? []) bump(k, 3);          // shares a neighbour
    }
    for (const t of n.themes) for (const k of (byTheme.get(t) ?? []).slice(0, 200)) bump(k, 1);
    const top = [...score].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, perNode).map(([id]) => id);
    if (top.length) related[n.id] = top;
  }
  return related;
}

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

  return { timeline, map, ego, snapshots, onThisDay: { gregorian: onThisDay, hijri: hijriDay }, related: buildRelated(c), synonyms: buildSynonyms(c) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const c: Compiled = JSON.parse(readFileSync(p(".cache", "graph.json"), "utf8"));
  const d = derive(c);
  mkdirSync(p(".cache", "derived"), { recursive: true });
  for (const [k, v] of Object.entries(d)) writeFileSync(p(".cache", "derived", `${k}.json`), JSON.stringify(v));
  mkdirSync(p("site", "public"), { recursive: true });
  writeFileSync(p("site", "public", "search-synonyms.json"), JSON.stringify(d.synonyms));   // loaded by the client-side search page
  console.log(`derived: ${d.timeline.length} timeline rows, ${d.map.features.length} map features, ${Object.keys(d.ego).length} ego graphs, ${Object.keys(d.related).length} related lists, ${Object.keys(d.synonyms).length} search variants`);
}
