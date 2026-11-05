// Compiles data/ + content/ into a graphology graph and writes .cache/graph.json.
// Inverse edges are computed, dates normalised to numeric [earliest, latest] years, prose attached.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { MultiDirectedGraph } from "graphology";
import {
  Entity, LANGS, Localized, loadEnumIds, Prose, dateRange, listFiles, loadEntities, loadPredicates, loadProse, loadStubs, p, rel,
  resolvePredicate, Predicate, Range, ROOT,
} from "./lib.js";
import { gitDates } from "./git-dates.js";

export interface Edge {
  from: string; to: string; type: string; inverse: boolean;
  start?: any; end?: any; via?: string; role?: string; note?: string; sources?: string[]; confidence?: string; perspective?: string;
  derived?: boolean;
}
/** `updated`: YYYY-MM-DD of the last commit that touched this prose file (scripts/git-dates.ts). */
export interface ProseDoc { sections: { heading: string; markdown: string }[]; frontmatter: Record<string, any>; updated: string }
export interface Node {
  id: string; class: string; slug: string; label: Localized; summary: Localized;
  stub: boolean; wings: string[]; regions: string[]; periods: string[]; tags: string[]; aliases: string[]; themes: string[];
  span?: Range; display?: { start?: any; end?: any };
  coordinates?: [number, number];
  data: Record<string, any>;
  prose: Record<string, ProseDoc>;
  degree: number;
  contemporaries: string[];
  /** YYYY-MM-DD of the last commit that touched data/<class>/<slug>.yaml (a stub: its stubs file); see scripts/git-dates.ts. */
  updated: string;
}
/** `generated` and `commit` come from the HEAD commit, so the same commit compiles to the same graph (the clock only when there is no git). */
export interface Compiled { generated: string; commit: string | null; nodes: Node[]; edges: Edge[]; coverage: Coverage }
export interface Coverage {
  entities: number; stubs: number;
  byClass: Record<string, number>; byWing: Record<string, number>; byPeriod: Record<string, number>; byRegion: Record<string, number>; byTheme: Record<string, number>; emptyThemes: string[];
  byReview: Record<string, number>; proseByLang: Record<string, number>;
  avgSourcesPerEntity: number; womenShare: number | null; wanted: string[];
}

/** Primary time extent of an entity for timelines. */
export function entitySpan(e: Entity): { span?: Range; display?: { start?: any; end?: any } } {
  const pick = (a?: any, b?: any) => {
    const ra = a && dateRange(a);
    const rb = b && dateRange(b);
    const lo = [ra, rb].filter(Boolean).map((r) => r!.earliest);
    const hi = [ra, rb].filter(Boolean).map((r) => r!.latest);
    return lo.length ? { span: { earliest: Math.min(...lo), latest: Math.max(...hi) }, display: { start: a, end: b } } : {};
  };
  switch (e.class) {
    case "person": return pick(e.born ?? e.floruit, e.died);
    case "event": return pick(e.date?.start, e.date?.end ?? e.date?.start);
    case "period": case "polity": return pick(e.start, e.end);
    case "group": return pick(e.founded, e.dissolved);
    case "place": return pick(e.founded);
    case "building": return pick(e.built);
    case "object": return pick(e.made);
    case "work": return pick(e.composed);
    default: return {};
  }
}

function splitSections(pr: Prose, updated: string): ProseDoc {
  const sections: { heading: string; markdown: string }[] = [];
  let cur: { heading: string; lines: string[] } | null = null;
  for (const line of pr.body.split("\n")) {
    const m = line.match(/^## (.+)$/);
    if (m) { if (cur) sections.push({ heading: cur.heading, markdown: cur.lines.join("\n").trim() }); cur = { heading: m[1].trim(), lines: [] }; }
    else if (cur) cur.lines.push(line);
  }
  if (cur) sections.push({ heading: cur.heading, markdown: cur.lines.join("\n").trim() });
  return { sections, frontmatter: pr.frontmatter, updated };
}

const inventionRolePredicate: Record<string, string> = {
  inventor: "invented",
  "co-inventor": "invented",
  improver: "improved",
  describer: "described",
  transmitter: "transmitted",
  translator: "transmitted",
  disputed: "invented",
};

export function deriveInventionEdges(
  entities: Entity[],
  predicates: Record<string, Predicate>,
  nodeIds: ReadonlySet<string>,
): Edge[] {
  const edges = new Map<string, Edge>();
  const add = (from: string, to: string, type: string, meta: Partial<Edge>) => {
    const predicate = predicates[type];
    if (!predicate || !nodeIds.has(from) || !nodeIds.has(to)) return;
    const forward: Edge = { from, to, type, inverse: false, derived: true, ...meta };
    const inverse: Edge = { from: to, to: from, type: predicate.inverse, inverse: true, derived: true, ...meta };
    for (const edge of [forward, inverse]) {
      const key = `${edge.from}|${edge.to}|${edge.type}`;
      const previous = edges.get(key);
      if (!previous) edges.set(key, edge);
      else {
        const sources = [...new Set([...(previous.sources ?? []), ...(edge.sources ?? [])])].sort();
        edges.set(key, { ...previous, sources });
      }
    }
  };
  const makerEdge = (person: string, invention: string, role: string, meta: Partial<Edge>) => {
    const type = inventionRolePredicate[role];
    if (type) add(person, invention, type, { ...meta, role });
  };
  const internalLink = (item: any, from: string, to: string) => {
    if (item?.invention) add(from, to, "built_on", { note: item.note, sources: item.sources });
  };

  for (const entity of entities) {
    if (entity.class === "invention") {
      for (const maker of entity.makers ?? []) makerEdge(maker.person, entity.id, maker.role, {
        start: maker.start, end: maker.end, role: maker.role, note: maker.note, sources: maker.sources,
      });
      for (const item of entity.precursors ?? []) internalLink(item, entity.id, item.invention);
      for (const item of entity.dependents ?? []) internalLink(item, item.invention, entity.id);
      for (const item of entity.spread ?? []) add(entity.id, item.place, "spread_to", {
        start: item.start, via: item.via, note: item.note, sources: item.sources,
      });
      for (const work of entity.described_in ?? []) add(work, entity.id, "described", { sources: entity.sources });
      for (const object of entity.examples ?? []) add(object, entity.id, "example_of", { sources: entity.sources });
    }

    for (const tie of entity.inventions ?? []) {
      if (entity.class === "person") makerEdge(entity.id, tie.invention, tie.role, {
        start: tie.start, end: tie.end, role: tie.role, note: tie.note, sources: tie.sources,
      });
      if (entity.class === "object" && tie.relation === "example-of") add(entity.id, tie.invention, "example_of", { role: tie.relation, sources: tie.sources });
      if (entity.class === "work" && ["describes", "first-describes", "patent-of"].includes(tie.relation)) {
        add(entity.id, tie.invention, "described", { role: tie.relation, sources: tie.sources });
      }
      if (entity.class === "place" && tie.relation === "spread-to") add(tie.invention, entity.id, "spread_to", {
        start: tie.start, sources: tie.sources,
      });
    }
  }
  return [...edges.values()];
}

export function compile(): Compiled {
  const predicates = loadPredicates();
  const loaded = loadEntities();
  const entities = loaded.map((x) => x.entity);
  const stubs = loadStubs();
  const prose = loadProse();
  const g = new MultiDirectedGraph();
  const nodes = new Map<string, Node>();
  const dates = gitDates(ROOT, ["data", "content"]);
  // a stub has no file of its own: the newest of the stub files stands for all of them
  const stubFiles = [p("data", "_stubs.yaml"), ...listFiles(p("data", "_stubs.d"), ".yaml")].map((f) => dates.dateOf(rel(f)));
  const stubsUpdated = stubFiles.length ? stubFiles.sort().at(-1)! : dates.dateOf("data");

  for (const { entity: e, file } of loaded) {
    const { span, display } = entitySpan(e);
    const { relations, label, summary, wings, regions, periods, tags, aliases, themes, id, class: cls, ...rest } = e;
    const node: Node = {
      id, class: cls, slug: id.split("/")[1], label, summary, stub: false,
      wings: wings ?? [], regions: regions ?? [], periods: periods ?? [], tags: tags ?? [], aliases: aliases ?? [], themes: themes ?? [],
      span, display, coordinates: e.coordinates, data: rest, prose: {}, degree: 0, contemporaries: [], updated: dates.dateOf(rel(file)),
    };
    nodes.set(id, node);
  }
  for (const s of stubs) {
    if (!s.id) continue;
    if (nodes.has(s.id)) continue;
    const [cls, slug] = s.id.split("/");
    nodes.set(s.id, {
      id: s.id, class: cls, slug, label: s.label ?? { en: slug }, summary: {}, stub: true, wings: [], regions: [], periods: [],
      tags: [], aliases: [], themes: [], data: { note: s.note }, prose: {}, degree: 0, contemporaries: [], updated: stubsUpdated,
    });
  }
  for (const pr of prose) {
    const n = nodes.get(pr.id);
    if (n) n.prose[pr.lang] = splitSections(pr, dates.dateOf(rel(pr.file)));
  }
  for (const n of nodes.values()) g.addNode(n.id);

  // edges: canonical forward + computed inverse, de-duplicated
  const edges = new Map<string, Edge>();
  const add = (e: Edge) => { const k = `${e.from}|${e.to}|${e.type}`; if (!edges.has(k)) edges.set(k, e); };
  for (const e of entities) {
    for (const r of e.relations ?? []) {
      const rp = resolvePredicate(predicates, r.type, e.class, String(r.target ?? "").split("/")[0]);
      if (!rp || !nodes.has(r.target)) continue; // validate.ts reports these
      if (rp.pred.derived) continue;
      const [src, dst] = rp.reversed ? [r.target, e.id] : [e.id, r.target];
      const { type: _t, target: _g, ...meta } = r;
      add({ from: src, to: dst, type: rp.canonical, inverse: false, ...meta });
      add({ from: dst, to: src, type: rp.pred.inverse, inverse: true, ...meta });
    }
  }
  for (const edge of deriveInventionEdges(entities, predicates, new Set(nodes.keys()))) add(edge);
  for (const e of edges.values()) { g.addEdge(e.from, e.to, { type: e.type }); }
  for (const n of nodes.values()) n.degree = g.degree(n.id);

  // contemporaries: same-class people whose lifetimes overlap, most-overlapping first
  const people = [...nodes.values()].filter((n) => n.class === "person" && n.span);
  for (const a of people) {
    a.contemporaries = people
      .filter((b) => b.id !== a.id)
      .map((b) => ({ id: b.id, overlap: Math.min(a.span!.latest, b.span!.latest) - Math.max(a.span!.earliest, b.span!.earliest) }))
      .filter((x) => x.overlap > 0)
      .sort((x, y) => y.overlap - x.overlap || x.id.localeCompare(y.id)) // ties by id, so file order never decides who is shown
      .slice(0, 12)
      .map((x) => x.id);
  }

  const list = [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id));
  return { generated: dates.committed ?? new Date().toISOString(), commit: dates.commit, nodes: list, edges: [...edges.values()], coverage: coverage(list, entities) };
}

function tally<T>(items: T[], key: (t: T) => string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const i of items) for (const k of key(i)) out[k] = (out[k] ?? 0) + 1;
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

function coverage(list: Node[], entities: Entity[]): Coverage {
  const real = list.filter((n) => !n.stub);
  const people = entities.filter((e) => e.class === "person" && e.gender);
  return {
    entities: real.length,
    stubs: list.length - real.length,
    byClass: tally(real, (n) => [n.class]),
    byWing: tally(real, (n) => n.wings),
    byPeriod: tally(real, (n) => n.periods),
    byRegion: tally(real, (n) => n.regions),
    byTheme: tally(real, (n) => n.themes),
    emptyThemes: loadEnumIds("themes").filter((t) => !real.some((n) => n.themes.includes(t))),
    byReview: tally(entities, (e) => [e.status?.review ?? "unknown"]),
    proseByLang: Object.fromEntries(LANGS.map((l) => [l, real.filter((n) => n.prose[l]).length])),
    avgSourcesPerEntity: entities.length ? +(entities.reduce((s, e) => s + (e.sources?.length ?? 0), 0) / entities.length).toFixed(2) : 0,
    womenShare: people.length ? +(people.filter((e) => e.gender === "female").length / people.length).toFixed(3) : null,
    wanted: list.filter((n) => n.stub).map((n) => n.id),
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const c = compile();
  mkdirSync(p(".cache"), { recursive: true });
  writeFileSync(p(".cache", "graph.json"), JSON.stringify(c));
  console.log(`graph: ${c.nodes.length} nodes (${c.coverage.entities} entities, ${c.coverage.stubs} stubs), ${c.edges.length} edges -> .cache/graph.json`);
}
