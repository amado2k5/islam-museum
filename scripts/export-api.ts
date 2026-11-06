// Writes the static JSON API (docs/plan/09 §6) to site/public/api/v1/ from the compiled graph.
//   /api/v1/<class>/<slug>.json   full entity     /api/v1/<class>/index.json   compact index
//   /api/v1/graph/nodes.ndjson, edges.ndjson      /api/v1/meta/coverage.json, meta/index.json
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Compiled, Node } from "./build-graph.js";
import { CLASSES, p } from "./lib.js";
import { buildRelated } from "./derive.js";
import { wingCounts } from "./wings.js";
import { primaryYear, recordOfNode, SECTION_IDS, sectionsOf, taxonomy as modernTaxonomy, yearsOf, WINDOW_START_YEAR } from "./modern/sections.js";
import { reachFormula, reachIndex, REACH_LISTS } from "./modern/reach.js";
import { existsSync } from "node:fs";

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

export function inventionApiData(c: Compiled) {
  const byId = new Map(c.nodes.map((node) => [node.id, node]));
  const inventions = c.nodes.filter((node) => !node.stub && node.class === "invention").sort((a, b) => a.id.localeCompare(b.id));
  const taxonomy = yparse(rf(p("docs", "inventions", "taxonomy.yaml"), "utf8"));
  const items = inventions.map((node) => {
    const data = node.data;
    const place = data.origin?.place ? byId.get(data.origin.place) : undefined;
    return {
      id: node.id, slug: node.slug, label: node.label, summary: node.summary, domain: data.domain, kind: data.kind,
      disciplines: data.disciplines, era: data.era, makers: data.makers, attribution: data.attribution,
      origin: { ...data.origin, coordinates: place?.coordinates }, spread: data.spread, precursors: data.precursors,
      dependents: data.dependents, described_in: data.described_in, examples: data.examples, sites: data.sites,
      concepts: data.concepts, today: data.today, media: data.media, significance: data.impact?.significance,
      status: data.status?.review,
    };
  });

  const chainNodes = new Map<string, Record<string, unknown>>();
  const chainEdges = new Map<string, Record<string, unknown>>();
  const addInventionNode = (id: string) => {
    const node = byId.get(id);
    if (!node || node.class !== "invention") return;
    chainNodes.set(id, {
      id, class: "invention", label: node.label, domain: node.data.domain, era: node.data.era?.origins,
      external: false, stub: node.stub || undefined,
    });
  };
  const addExternalNode = (label: Record<string, string>) => {
    const name = (label.en ?? label.ar).normalize("NFKC").trim().toLowerCase();
    const id = `external:${encodeURIComponent(name)}`;
    if (!chainNodes.has(id)) chainNodes.set(id, { id, class: "external", label, external: true });
    return id;
  };
  const addChainEdge = (from: string, to: string, item: Record<string, any>) => {
    const key = `${from}|${to}|built_on`;
    const previous = chainEdges.get(key) as { sources?: string[]; notes?: string[] } | undefined;
    const sources = [...new Set([...(previous?.sources ?? []), ...(item.sources ?? [])])].sort();
    const notes = [...new Set([...(previous?.notes ?? []), ...(item.note ? [item.note] : [])])].sort();
    chainEdges.set(key, { from, to, type: "built_on", derived: true, sources, ...(notes.length ? { notes } : {}) });
  };

  for (const node of inventions) {
    addInventionNode(node.id);
    for (const item of node.data.precursors ?? []) {
      const target = item.invention;
      if (target) {
        addInventionNode(target);
        addChainEdge(node.id, target, item);
      } else if (item.external) addChainEdge(node.id, addExternalNode(item.external), item);
    }
    for (const item of node.data.dependents ?? []) {
      const source = item.invention;
      if (source) {
        addInventionNode(source);
        addChainEdge(source, node.id, item);
      } else if (item.external) addChainEdge(addExternalNode(item.external), node.id, item);
    }
  }
  return {
    inventions: {
      generated: c.generated,
      filters: { domains: taxonomy.domains, eras: taxonomy.eras },
      items,
    },
    chains: {
      generated: c.generated,
      nodes: [...chainNodes.values()].sort((a, b) => String(a.id).localeCompare(String(b.id))),
      edges: [...chainEdges.values()].sort((a, b) => String(a.from).localeCompare(String(b.from)) || String(a.to).localeCompare(String(b.to))),
    },
  };
}

/**
 * Modern Islam Browser (docs/plan/26 section 4.1): one file per derived section, one per year, the reach indices and a
 * sections index. Built from the compiled graph; empty-capable until records exist. No runtime computation.
 */
export function modernApiData(c: Compiled) {
  const real = c.nodes.filter((n) => !n.stub);
  const records = real.map(recordOfNode);
  const awardsById = new Map(records.filter((r) => r.class === "award").map((r) => [r.id as string, r]));
  const byId = new Map(real.map((n) => [n.id, n]));
  const item = (id: string, sections: string[]) => {
    const n = byId.get(id)!;
    const d = n.data;
    return {
      ...compact(n), sections, kind: n.class === "screen" ? d.format : d.kind, year: primaryYear(recordOfNode(n)),
      countries: d.countries ?? (d.country ? [d.country] : undefined), languages: d.languages,
      honours: (d.honours ?? []).length || undefined, press: (d.footprint?.press ?? []).length || undefined,
      wikipedia_languages: d.footprint?.wikipedia?.languages?.length || undefined,
      horizon: d.horizon ? { stage: d.horizon.stage, expected: d.horizon.expected } : undefined,
      updated: n.updated,
    };
  };
  const sections: Record<string, ReturnType<typeof item>[]> = Object.fromEntries(SECTION_IDS.map((s) => [s, []]));
  const years = new Map<number, ReturnType<typeof item>[]>();
  const current = new Date(c.generated).getUTCFullYear();
  for (const r of records) {
    const s = sectionsOf(r, awardsById);
    if (!s.length) continue;
    const row = item(r.id as string, s);
    for (const section of s) sections[section].push(row);
    for (const y of yearsOf(r)) if (y >= WINDOW_START_YEAR && y <= current + 20) { if (!years.has(y)) years.set(y, []); years.get(y)!.push(row); }
  }
  const sortRows = (rows: ReturnType<typeof item>[]) => rows.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.id.localeCompare(b.id));
  for (const rows of Object.values(sections)) sortRows(rows);
  for (const rows of years.values()) sortRows(rows);
  const top = Object.fromEntries(Object.keys(REACH_LISTS).map((list) => [list, reachIndex(list, records, awardsById)]));
  return {
    index: {
      generated: c.generated, window: { start: WINDOW_START_YEAR, end: current },
      sections: modernTaxonomy.sections.map((s) => ({ id: s.id, label: s.label, count: sections[s.id].length, facets: s.facets })),
      years: [...years.keys()].sort((a, b) => a - b).map((y) => ({ year: y, count: years.get(y)!.length })),
      lists: Object.fromEntries(Object.entries(top).map(([k, v]) => [k, v.length])),
    },
    sections, years, top,
  };
}

/**
 * One export per browser or explorer (AGENTS.md, "every feature is graph, API and search"; register docs/site/browsers.md):
 * the records the feature's pages show, with their compact row, the listed data fields and every edge from the record.
 * Static, built with the site; empty-capable.
 */
const FEATURE_EXPORTS: { file: string; feature: string; pick: (n: Node) => boolean; fields: string[] }[] = [
  { file: "jobs.json", feature: "job-browser", pick: (n) => n.class === "job",
    fields: ["kind", "domain", "hirfa", "era", "broader", "regions", "organization", "training"] },
  { file: "fatwa.json", feature: "fatwa-explorer", pick: (n) => n.class === "work" && ["fatwa", "fatwa-collection"].includes(n.data.kind),
    fields: ["kind", "publisher", "url", "languages", "language", "composed", "content_type", "ruler_at_time", "collection_type", "fiqh_area", "asker_role", "form"] },
  { file: "khutab.json", feature: "khutab-durus-explorer", pick: (n) => n.class === "work" && ["sermon", "lecture", "lecture-series"].includes(n.data.kind),
    fields: ["kind", "delivered", "host", "occasion", "audience", "order", "composed", "delivery_date_status", "book_studied", "sermon_type", "language", "genre", "duration"] },
  { file: "tafsir.json", feature: "tafsir-browser", pick: (n) => n.class === "work" && (n.data.kind === "tafsir-volume" || n.id === "work/jami-al-bayan"),
    fields: ["kind"] },
  { file: "poetry.json", feature: "poetry", pick: (n) => n.class === "work" && ["poem", "diwan"].includes(n.data.kind),
    fields: ["kind", "authors", "language", "languages", "genre", "metre", "composed"] },
  { file: "screens.json", feature: "screening-room", pick: (n) => n.class === "screen",
    fields: ["format", "relevance", "titles", "released", "first_broadcast", "ramadan_season", "countries", "languages", "seasons", "episodes", "runtime_min", "broadcaster", "approach", "depiction", "external_ids", "made", "honours"] },
];

export function featureApiData(c: Compiled): Record<string, { generated: string; feature: string; items: Record<string, unknown>[] }> {
  const real = c.nodes.filter((n) => !n.stub);
  const edgesFrom = new Map<string, { type: string; to: string; inverse: boolean; role?: string }[]>();
  for (const e of c.edges) {
    const list = edgesFrom.get(e.from) ?? [];
    list.push({ type: e.type, to: e.to, inverse: e.inverse, ...(e.role ? { role: e.role } : {}) });
    edgesFrom.set(e.from, list);
  }
  const holders = new Map<string, string[]>();
  for (const person of real) {
    if (person.class !== "person") continue;
    for (const job of new Set<string>((person.data.occupations ?? []).map((o: any) => o.job))) {
      const list = holders.get(job) ?? [];
      list.push(person.id);
      holders.set(job, list);
    }
  }
  const out: Record<string, { generated: string; feature: string; items: Record<string, unknown>[] }> = {};
  for (const spec of FEATURE_EXPORTS) {
    const items = real.filter(spec.pick).sort((a, b) => a.id.localeCompare(b.id)).map((n) => {
      const picked = Object.fromEntries(spec.fields.filter((f) => n.data[f] !== undefined).map((f) => [f, n.data[f]]));
      const row: Record<string, unknown> = { ...compact(n), ...picked, connections: edgesFrom.get(n.id) ?? [], prose: Object.keys(n.prose ?? {}) };
      if (n.class === "job") row.holders = (holders.get(n.id) ?? []).sort();
      return row;
    });
    out[spec.file] = { generated: c.generated, feature: spec.feature, items };
  }
  return out;
}

export function exportApi(c: Compiled) {
  rmSync(OUT, { recursive: true, force: true });
  const real = c.nodes.filter((n) => !n.stub);
  const related = buildRelated(c);
  for (const cls of CLASSES) {
    const items = real.filter((n) => n.class === cls);
    if (!items.length && cls !== "invention" && cls !== "award") continue;
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
  exportNeighbourhoods(c, real);
  write("graph/nodes.ndjson", c.nodes.map((n) => JSON.stringify(compact(n))).join("\n") + "\n");
  write("graph/edges.ndjson", c.edges.filter((e) => !e.inverse).map((e) => JSON.stringify(e)).join("\n") + "\n");
  write("themes/index.json", JSON.stringify(themeIndex(c), null, 1));
  write("meta/coverage.json", JSON.stringify({ generated: c.generated, ...c.coverage }, null, 1));
  // Site-wide totals that every page's header shows (docs/site/README.md, "site-wide numbers"): one small file, fetched by a
  // few lines of client script, so the numbers are never baked into the 100k+ static pages and a content commit leaves them untouched.
  // No `generated` field: the file changes only when a count does.
  write("meta/counts.json", JSON.stringify({ wings: wingCounts(real), entities: real.length }));
  const inventionData = inventionApiData(c);
  write("inventions.json", JSON.stringify(inventionData.inventions, null, 1));
  write("inventions/chains.json", JSON.stringify(inventionData.chains, null, 1));
  const modern = modernApiData(c);
  write("modern/index.json", JSON.stringify(modern.index, null, 1));
  for (const [section, items] of Object.entries(modern.sections)) {
    const label = modernTaxonomy.sections.find((s) => s.id === section)?.label;
    write(`modern/${section}.json`, JSON.stringify({ generated: c.generated, section, label, items }, null, 1));
  }
  for (const [year, items] of modern.years) write(`modern/year/${year}.json`, JSON.stringify({ generated: c.generated, year, items }, null, 1));
  for (const [list, items] of Object.entries(modern.top)) {
    write(`modern/top/${list}.json`, JSON.stringify({ generated: c.generated, list, formula: reachFormula(), items }, null, 1));
  }
  for (const [file, body] of Object.entries(featureApiData(c))) write(file, JSON.stringify(body, null, 1));
  // The Time Browser's subject index (scripts/time-browser-explorer.ts runs in prebuild and writes .cache/time-browser/).
  const timeBrowserIndex = p(".cache", "time-browser", "explorer-index.json");
  if (existsSync(timeBrowserIndex)) {
    write("time-browser/index.json", JSON.stringify({ generated: c.generated, feature: "time-browser", subjects: JSON.parse(readFileSync(timeBrowserIndex, "utf8")) }, null, 1));
  }
  write("meta/index.json", JSON.stringify({
    version: "v1", generated: c.generated, classes: CLASSES.filter((k) => k === "invention" || k === "award" || real.some((n) => n.class === k)),
    docs: "https://github.com/amado2k5/islam-museum/blob/main/docs/plan/09-ai-content-pipeline.md",
    license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" },
  }, null, 1));
  return real.length;
}

const shortText = (s: string | undefined, n = 120) => (s && s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s ?? "");

/**
 * The one definition of "connected" for the graph endpoint: an entity with at least one typed relation, i.e. a forward
 * edge (schema/predicates.yaml) between two nodes of the graph, in either direction. Every connected entity gets
 * /api/v1/graph/<class>/<slug>.json; an entity without one has no neighbourhood to draw and no file.
 *
 * This is not the record's `related` list (scripts/derive.ts buildRelated): that is a "see also" recommendation, scored
 * from typed neighbours and shared themes, and it leaves out ayah passages, sources and media. An entity can therefore
 * have `related` entries from its themes alone and no graph file, or a graph file (an ayah's part_of edge) and `related: []`.
 */
export function connectedIds(c: Compiled): Set<string> {
  const known = new Set(c.nodes.map((n) => n.id));
  const out = new Set<string>();
  for (const e of c.edges) {
    if (e.inverse || !known.has(e.from) || !known.has(e.to)) continue;
    out.add(e.from); out.add(e.to);
  }
  return out;
}

export type Neighbourhood = { centre: string; nodes: { id: string; c: string; l: any; s?: { ar: string; en: string }; hop: number }[]; edges: { s: string; t: string; r: string }[] };

/** Two-hop neighbourhood per connected entity: the centre, its strongest neighbours, then theirs, capped at 40 nodes; forward edges among them. */
export function buildNeighbourhoods(c: Compiled, real: Node[]): Map<Node, Neighbourhood> {
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
  const out = new Map<Node, Neighbourhood>();
  for (const n of real) {
    const first = adj.get(n.id);
    if (!first?.length) continue;
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
    out.set(n, { centre: n.id, nodes, edges });
  }
  return out;
}

/** Connected entities without a neighbourhood: the build fails on any (scripts/graph-endpoint.test.ts checks the same). */
export function missingNeighbourhoods(c: Compiled, real: Node[], hoods: Map<Node, Neighbourhood>): string[] {
  const connected = connectedIds(c);
  const have = new Set([...hoods.keys()].map((n) => n.id));
  return real.filter((n) => connected.has(n.id) && !have.has(n.id)).map((n) => n.id);
}

export function exportNeighbourhoods(c: Compiled, real: Node[]) {
  const hoods = buildNeighbourhoods(c, real);
  const missing = missingNeighbourhoods(c, real, hoods);
  if (missing.length) throw new Error(`graph endpoint: ${missing.length} connected entities have no neighbourhood, e.g. ${missing.slice(0, 5).join(", ")}`);
  for (const [n, hood] of hoods) write(`graph/${n.class}/${n.slug}.json`, JSON.stringify(hood));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const c: Compiled = JSON.parse(readFileSync(p(".cache", "graph.json"), "utf8"));
  console.log(`api: ${exportApi(c)} entities -> site/public/api/v1/`);
}
