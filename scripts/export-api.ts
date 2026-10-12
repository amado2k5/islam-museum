// Writes the static JSON API (docs/plan/09 §6) to site/public/api/v1/ from the compiled graph.
//   /api/v1/<class>/<slug>.json   full entity     /api/v1/<class>/index.json   compact index
//   /api/v1/graph/nodes.ndjson, edges.ndjson      /api/v1/meta/coverage.json, meta/index.json
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Compiled, Node } from "./build-graph.js";
import { CLASSES, p } from "./lib.js";
import { buildRelated } from "./derive.js";

const OUT = p("site", "public", "api", "v1");
const write = (rel: string, body: string) => {
  const f = `${OUT}/${rel}`;
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, body);
};

const compact = (n: Node) => ({
  id: n.id, class: n.class, label: n.label, summary: n.summary, wings: n.wings, regions: n.regions,
  born: n.data.born, died: n.data.died, date: n.data.date, start: n.data.start, end: n.data.end,
  coordinates: n.coordinates, wikidata: n.data.external_ids?.wikidata, status: n.data.status?.review,
});

import { readFileSync as rf } from "node:fs";
import { parse as yparse } from "yaml";
function themeIndex(c: Compiled) {
  const themes: any[] = yparse(rf(p("schema", "enums", "themes.yaml"), "utf8"));
  return themes.map((t) => ({ ...t, entries: c.nodes.filter((n) => !n.stub && n.themes.includes(t.id)).map((n) => n.id) }));
}

export function exportApi(c: Compiled) {
  rmSync(OUT, { recursive: true, force: true });
  const real = c.nodes.filter((n) => !n.stub);
  const related = buildRelated(c);
  for (const cls of CLASSES) {
    const items = real.filter((n) => n.class === cls);
    if (!items.length) continue;
    write(`${cls}/index.json`, JSON.stringify(items.map(compact), null, 1));
    for (const n of items) {
      const connections = c.edges.filter((e) => e.from === n.id).map(({ from, ...e }) => e);
      write(`${cls}/${n.slug}.json`, JSON.stringify({ ...n, connections, related: related[n.id] ?? [], license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" } }, null, 1));
    }
  }
  // Stubs get entity pages and a /api/v1/<class>/<slug>.json link (EntityLayout),
  // so each stub needs a minimal export too or the internal link check 404s.
  for (const n of c.nodes.filter((n) => n.stub)) {
    const slug = n.slug ?? n.id.split("/")[1];
    const connections = c.edges.filter((e) => e.from === n.id).map(({ from, ...e }) => e);
    write(`${n.class}/${slug}.json`, JSON.stringify({ ...n, slug, connections, related: [], license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" } }, null, 1));
  }
  // Constellation neighbourhoods (docs/plan/21 §C.5): /api/v1/graph/<class>/<slug>.json, two hops, at most 40 nodes, one node per id.
  exportNeighbourhoods(c, real, related);
  write("graph/nodes.ndjson", c.nodes.map((n) => JSON.stringify(compact(n))).join("\n") + "\n");
  write("graph/edges.ndjson", c.edges.filter((e) => !e.inverse).map((e) => JSON.stringify(e)).join("\n") + "\n");
  write("themes/index.json", JSON.stringify(themeIndex(c), null, 1));
  write("meta/coverage.json", JSON.stringify({ generated: c.generated, ...c.coverage }, null, 1));
  write("meta/index.json", JSON.stringify({
    version: "v1", generated: c.generated, classes: CLASSES.filter((k) => real.some((n) => n.class === k)),
    docs: "https://github.com/amado2k5/islam-museum/blob/main/docs/plan/09-ai-content-pipeline.md",
    license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" },
  }, null, 1));
  return real.length;
}

const shortText = (s: string | undefined, n = 120) => (s && s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s ?? "");

/** Two-hop neighbourhood per entity: the centre, its strongest neighbours, then theirs, capped at 40 nodes; forward edges among them. */
export function exportNeighbourhoods(c: Compiled, real: Node[], related: Record<string, string[]>) {
  const byId = new Map(c.nodes.map((n) => [n.id, n]));
  const adj = new Map<string, { to: string; type: string }[]>();
  for (const e of c.edges) {
    if (e.inverse || !byId.has(e.from) || !byId.has(e.to)) continue;
    (adj.get(e.from) ?? adj.set(e.from, []).get(e.from)!).push({ to: e.to, type: e.type });
    (adj.get(e.to) ?? adj.set(e.to, []).get(e.to)!).push({ to: e.from, type: e.type });
  }
  const CAP = 40, HOP1 = 22;
  // passages crowd a neighbourhood; they come after everything else, and the best-connected neighbours first
  const rank = (id: string) => (byId.get(id)!.class === "passage" ? -1e6 : 0) + (byId.get(id)?.degree ?? 0);
  const pick = (ids: Set<string>, exclude: Set<string>, n: number) => [...ids].filter((i) => !exclude.has(i)).sort((a, b) => rank(b) - rank(a)).slice(0, n);
  for (const n of real) {
    const first = adj.get(n.id);
    if (!first?.length) continue;
    // a verse whose only edge is part_of its sura has no constellation of its own (the sura's serves); this keeps the export small
    if (n.class === "passage" && n.data.unit === "ayah" && first.length <= 1) continue;
    const keep = new Set<string>([n.id]);
    const hop1 = pick(new Set(first.map((x) => x.to)), keep, HOP1);
    hop1.forEach((i) => keep.add(i));
    const cand = new Set<string>();
    for (const h of hop1) for (const x of adj.get(h) ?? []) if (!keep.has(x.to)) cand.add(x.to);
    pick(cand, keep, CAP - keep.size).forEach((i) => keep.add(i));
    const hopOf = (id: string) => (id === n.id ? 0 : hop1.includes(id) ? 1 : 2);
    // summaries only where the card shows them (centre and first hop), kept short
    const nodes = [...keep].map((id) => { const m = byId.get(id)!; const hop = hopOf(id); return { id, c: m.class, l: m.label, s: hop < 2 ? { ar: shortText(m.summary?.ar, 90), en: shortText(m.summary?.en, 90) } : undefined, hop }; });
    const seen = new Set<string>();
    for (const x of nodes) { if (seen.has(x.id)) throw new Error(`graph neighbourhood for ${n.id}: duplicate node ${x.id}`); seen.add(x.id); }
    const edges: { s: string; t: string; r: string }[] = [];
    const eseen = new Set<string>();
    for (const e of c.edges) {
      if (e.inverse || !keep.has(e.from) || !keep.has(e.to)) continue;
      // edges that the drawing uses: centre-first hop, first-first, first-second (second-second edges only clutter)
      if (hopOf(e.from) === 2 && hopOf(e.to) === 2) continue;
      const k = `${e.from}|${e.to}|${e.type}`;
      if (eseen.has(k)) continue;
      eseen.add(k); edges.push({ s: e.from, t: e.to, r: e.type });
    }
    write(`graph/${n.class}/${n.slug}.json`, JSON.stringify({ centre: n.id, nodes, edges }));
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const c: Compiled = JSON.parse(readFileSync(p(".cache", "graph.json"), "utf8"));
  console.log(`api: ${exportApi(c)} entities -> site/public/api/v1/`);
}
