// Time Browser media phase M1: inventory whitelisted images, match them to timeline stops,
// and write data/time-browser-media-index.json plus a match-rate report.
// No AI and no rendering: matching is deterministic (direct depiction, shared place + period,
// shared period + tags). Maps (M2) and SVG cards (M3) come later and read this index.
// Usage: npx tsx scripts/time-browser-media.ts [--batch N] [--out data/time-browser-media-index.json]
// Requires .cache/graph.json (run `npm run graph` first).
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name: string, dflt: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : dflt;
};
const BATCH = Number(arg("batch", "50"));
const OUT = resolve(ROOT, arg("out", "data/time-browser-media-index.json"));
const GRAPH = resolve(ROOT, ".cache/graph.json");

interface Range { earliest: number; latest: number }
interface Node {
  id: string; class: string; slug: string; label: Record<string, string>;
  summary?: Record<string, string>;
  stub: boolean; wings: string[]; regions: string[]; periods: string[]; tags: string[];
  span?: Range; coordinates?: [number, number];
  data: Record<string, any>; degree: number;
}
interface Edge { from: string; to: string; type: string; inverse?: boolean }
interface Compiled { nodes: Node[]; edges: Edge[] }

if (!existsSync(GRAPH)) {
  console.error(".cache/graph.json missing — run `npm run graph` first.");
  process.exit(1);
}
const graph: Compiled = JSON.parse(readFileSync(GRAPH, "utf8"));
const byId = new Map(graph.nodes.map((n) => [n.id, n]));

// Record types the Time Browser shows (DESIGN.md §1). "theme" is not a data class; themes are
// attributes of records. passage, source, dataset, language, listing, screen and media are
// plumbing, not stops.
const STOP_CLASSES = [
  "building", "concept", "event", "exhibit", "group", "journey",
  "object", "period", "person", "place", "polity", "practice", "question", "work",
];

const WHITELISTED_LICENSES = new Set(["CC0", "CC-BY", "CC-BY-SA", "PD", "VAM-NC"]);
// Image kinds that can illustrate a stop. Maps are rendered separately in M2.
const IMAGE_KINDS = new Set(["image", "illustration"]);
// Generated media may never depict a person (no AI portraits, no figurative depiction of
// prophets or Companions, AGENTS.md).
const FIGURATIVE_CLASSES = new Set(["person", "group"]);

// ---- stops -------------------------------------------------------------------
// Launch batch: BATCH records per class. Published first, then most-linked (degree), then id,
// so the batch is deterministic. Drafts are allowed (they are labelled in the UI, DESIGN §1)
// because published coverage is far below 50 per class today; sources are preferred but the
// batch is filled regardless and the shortfall is reported.
function pickStops(cls: string): Node[] {
  const all = graph.nodes.filter((n) => n.class === cls && !n.stub);
  const rank = (n: Node) => [
    n.data?.status?.review === "published" ? 0 : 1,
    (n.data?.sources?.length ?? 0) > 0 ? 0 : 1,
    -n.degree,
    n.id,
  ] as const;
  return all.sort((a, b) => JSON.stringify(rank(a)).localeCompare(JSON.stringify(rank(b)))).slice(0, BATCH);
}

// ---- signatures ---------------------------------------------------------------
// place/<id> nodes a node is tied to (any predicate edge, either direction).
const placeEdges = new Map<string, Set<string>>();
for (const e of graph.edges) {
  const a = e.from.startsWith("place/") ? e.to : e.to.startsWith("place/") ? e.from : null;
  if (!a) continue;
  const place = e.from.startsWith("place/") ? e.from : e.to;
  if (!placeEdges.has(a)) placeEdges.set(a, new Set());
  placeEdges.get(a)!.add(place);
}
const periodSpans = new Map<string, Range>();
for (const n of graph.nodes) if (n.class === "period" && n.span) periodSpans.set(n.id, n.span);

const overlap = (a?: Range, b?: Range) => !!a && !!b && a.earliest <= b.latest && b.earliest <= a.latest;

interface Sig { places: Set<string>; periods: Set<string>; tags: Set<string>; span?: Range }
function signature(n: Node): Sig {
  const periods = new Set(n.periods);
  if (n.span) for (const [pid, s] of periodSpans) if (overlap(n.span, s)) periods.add(pid);
  return { places: placeEdges.get(n.id) ?? new Set(), periods, tags: new Set(n.tags), span: n.span };
}

// ---- media inventory ----------------------------------------------------------
interface MediaEntry {
  id: string; kind: string; license: string; file?: string; alt: Record<string, string>;
  review: string; generated: boolean; depicts: string[]; sig: Sig; covers: string[];
}
const media: MediaEntry[] = [];
for (const n of graph.nodes) {
  if (n.class !== "media" || !IMAGE_KINDS.has(n.data?.kind)) continue;
  if (!WHITELISTED_LICENSES.has(n.data?.license)) continue;
  const depicts: string[] = (n.data?.depicts ?? []).filter((d: string) => byId.has(d));
  const generated = !!n.data?.generated;
  // Drop AI-generated media that depicts a person or group (no AI portraits rule).
  if (generated && depicts.some((d) => FIGURATIVE_CLASSES.has(byId.get(d)!.class))) continue;
  const sig: Sig = { places: new Set(), periods: new Set(), tags: new Set() };
  const spans: Range[] = [];
  for (const d of depicts) {
    const e = byId.get(d)!;
    const es = signature(e);
    es.places.forEach((p) => sig.places.add(p));
    es.periods.forEach((p) => sig.periods.add(p));
    es.tags.forEach((t) => sig.tags.add(t));
    if (e.class === "place") sig.places.add(e.id);
    if (es.span) spans.push(es.span);
  }
  if (spans.length) sig.span = {
    earliest: Math.min(...spans.map((s) => s.earliest)),
    latest: Math.max(...spans.map((s) => s.latest)),
  };
  const files = n.data?.files ?? {};
  media.push({
    id: n.id, kind: n.data.kind, license: n.data.license,
    file: files.webp ?? files.png ?? files.jpg ?? n.data.url ?? n.data.iiif_image,
    alt: n.data?.alt ?? {}, review: n.data?.status?.review ?? "draft",
    generated, depicts, sig, covers: [],
  });
}

// ---- matching -----------------------------------------------------------------
// A media item covers a stop when (in priority order, first match wins for the stop's image):
//  1. it depicts the stop itself; or
//  2. media and stop share a place and a period; or
//  3. they share a period and at least one tag; or
//  4. neither has a usable signature anchor, but spans overlap within the same period.
// TB1 launch records (the spread batch the browser actually ships) are always
// stops, so maps and cards cover them even when they rank below the batch cut.
const stops: Node[] = (() => {
  const chosen = STOP_CLASSES.flatMap(pickStops);
  const have = new Set(chosen.map((n) => n.id));
  const extra: Node[] = [];
  try {
    const ix = JSON.parse(readFileSync(".cache/time-browser/en/index.json", "utf8"));
    const nodeById = byId;
    for (const recs of Object.values(ix.topics ?? {}) as { id: string }[][]) {
      for (const r of recs) {
        if (!have.has(r.id)) {
          const n = nodeById.get(r.id);
          if (n) { have.add(n.id); extra.push(n); }
        }
      }
    }
  } catch { /* no TB1 output yet */ }
  if (extra.length) console.log(`+ ${extra.length} TB1 launch stops merged into the media index`);
  return [...chosen, ...extra];
})();
const stopSig = new Map(stops.map((s) => [s.id, signature(s)]));
const stopIndex = new Map(stops.map((s, i) => [s.id, i]));

const inter = (a: Set<string>, b: Set<string>) => [...a].filter((x) => b.has(x));
function covers(m: MediaEntry, s: Node): "depicts" | "place+period" | "period+tag" | null {
  const ss = stopSig.get(s.id)!;
  if (m.depicts.includes(s.id)) return "depicts";
  if (inter(m.sig.places, ss.places).length && inter(m.sig.periods, ss.periods).length) return "place+period";
  if (inter(m.sig.periods, ss.periods).length && inter(m.sig.tags, ss.tags).length) return "period+tag";
  return null;
}

// Adjacent stops may share one image (DESIGN §4.2): each stop lists every media id that can
// cover it; the renderer picks the first usable one and may reuse it for a run of stops.
const stopRecords = stops.map((s) => {
  const ss = stopSig.get(s.id)!;
  const direct = s.data?.media?.hero;
  const matches = media.filter((m) => covers(m, s));
  for (const m of matches) m.covers.push(s.id);
  return {
    id: s.id, kind: s.class,
    title: s.label, status: s.data?.status?.review ?? "draft",
    span: ss.span ?? null,
    periods: [...ss.periods], places: [...ss.places], tags: [...ss.tags],
    hero: direct && byId.has(direct) ? direct : null,
    candidates: matches.map((m) => m.id),
    coverage: matches.length ? "image" : "card",
  };
});

const matched = stopRecords.filter((s) => s.hero || s.candidates.length);
const report = {
  batchPerClass: BATCH,
  stopsTotal: stopRecords.length,
  mediaTotal: media.length,
  mediaUsed: media.filter((m) => m.covers.length).length,
  stopsWithImage: matched.length,
  stopsWithCard: stopRecords.length - matched.length,
  matchRate: stopRecords.length ? +(matched.length / stopRecords.length * 100).toFixed(1) : 0,
  perClass: Object.fromEntries(STOP_CLASSES.map((cls) => {
    const rs = stopRecords.filter((s) => s.kind === cls);
    const pool = graph.nodes.filter((n) => n.class === cls && !n.stub);
    return [cls, {
      pool: pool.length, stops: rs.length,
      publishedInPool: pool.filter((n) => n.data?.status?.review === "published").length,
      withImage: rs.filter((s) => s.hero || s.candidates.length).length,
      withCard: rs.filter((s) => !(s.hero || s.candidates.length)).length,
    }];
  })),
};

const index = {
  generated: new Date().toISOString(),
  rule: "stop batch per class: published first, then degree desc, then id asc; media covers a stop by depicts | shared place+period | shared period+tag",
  report,
  media: media.map(({ sig, ...m }) => ({ ...m, places: [...sig.places], periods: [...sig.periods], tags: [...sig.tags] })),
  stops: stopRecords,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(index, null, 1) + "\n");

console.log(`stops: ${report.stopsTotal} across ${STOP_CLASSES.length} classes (batch ${BATCH})`);
console.log(`whitelisted images: ${report.mediaTotal}; used by >=1 stop: ${report.mediaUsed}`);
console.log(`match rate: ${report.matchRate}%  (image ${report.stopsWithImage} / card ${report.stopsWithCard})`);
for (const [cls, r] of Object.entries(report.perClass) as any)
  console.log(`  ${cls.padEnd(9)} pool ${String(r.pool).padStart(6)} (pub ${r.publishedInPool}) -> stops ${r.stops}, image ${r.withImage}, card ${r.withCard}`);
console.log(`-> ${OUT}`);
