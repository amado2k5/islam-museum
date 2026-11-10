// Time Browser media phase M2: render one small static SVG map per place cluster.
// Deterministic, no AI, no tiles, no third-party requests. Land shapes come from the two
// self-hosted Natural Earth extracts already in the repo (site/src/data/basemap-mena.json for
// lon 18–72 / lat 4–46, site/src/data/basemap-world.json for everything else, equirectangular).
// Output: site/public/media/time-browser/maps/<cluster>.svg and data/time-browser-maps.json
// mapping each coordinated stop to its cluster map.
// Usage: npx tsx scripts/time-browser-maps.ts [--index data/time-browser-media-index.json]
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n: string, d: string) => (process.argv.indexOf(`--${n}`) >= 0 ? process.argv[process.argv.indexOf(`--${n}`) + 1] : d);
const INDEX = resolve(ROOT, arg("index", "data/time-browser-media-index.json"));
const OUT_DIR = resolve(ROOT, "site/public/media/time-browser/maps");
const OUT_JSON = resolve(ROOT, "data/time-browser-maps.json");
const MENA = JSON.parse(readFileSync(resolve(ROOT, "site/src/data/basemap-mena.json"), "utf8")) as {
  source: string; bbox: [number, number, number, number]; rings: number[][][];
};
const WORLD = JSON.parse(readFileSync(resolve(ROOT, "site/src/data/basemap-world.json"), "utf8")) as {
  credit: string; viewBox: string; paths: { d: string }[];
};

const W = 480, H = 300;               // output canvas (px viewBox units)
const CLUSTER_KM = 600;               // max distance between two places in one cluster
const MIN_SPAN_DEG = 6;               // a cluster map always shows at least this much context
const PAD = 1.25;                     // frame padding factor around cluster bbox

const hav = (a: [number, number], b: [number, number]) => {
  const r = Math.PI / 180, [la1, lo1] = a, [la2, lo2] = b;
  const h = Math.sin((la2 - la1) * r / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin((lo2 - lo1) * r / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

// ---- load stops + graph places ------------------------------------------------
const index = JSON.parse(readFileSync(INDEX, "utf8"));
const graph = JSON.parse(readFileSync(resolve(ROOT, ".cache/graph.json"), "utf8"));
const placeCoord = new Map<string, [number, number]>();
for (const n of graph.nodes) if (n.class === "place" && n.coordinates) placeCoord.set(n.id, n.coordinates);

// A stop sits on a map when it is itself a coordinated place or is tied to one.
// stop.places[] holds place/* ids (written by time-browser-media.ts).
const stopPoints = new Map<string, { id: string; coord: [number, number]; label: Record<string, string> }>();
for (const s of index.stops) {
  const pid = s.places.find((p: string) => placeCoord.has(p)) ?? (placeCoord.has(s.id) ? s.id : null);
  if (!pid) continue;
  stopPoints.set(s.id, { id: pid, coord: placeCoord.get(pid)!, label: s.title });
}
// Unique places only — several stops share a dot.
const unique = new Map<string, [number, number]>();
for (const p of stopPoints.values()) unique.set(p.id, p.coord);

// ---- cluster (single-linkage, deterministic order) ------------------------------
const ids = [...unique.keys()].sort();
const parent = new Map(ids.map((i) => [i, i]));
const find = (x: string): string => { const p = parent.get(x)!; return p === x ? x : find(p); };
for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++)
  if (hav(unique.get(ids[i])!, unique.get(ids[j])!) <= CLUSTER_KM) parent.set(find(ids[i]), find(ids[j]));
const clusters = new Map<string, string[]>();
for (const id of ids) { const r = find(id); if (!clusters.has(r)) clusters.set(r, []); clusters.get(r)!.push(id); }

// ---- render ----------------------------------------------------------------------
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const LAND = "#d8d2c4", SEA = "#eef2f5", DOT = "#8c6d3b", DOT_HALO = "#b8932f";

// RDP simplify (same algorithm as site/src/components/MiniMap.astro).
const rdp = (pts: number[][], eps: number) => {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack: number[][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let dmax = 0, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > dmax) { dmax = d; idx = i; }
    }
    if (dmax > eps && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
};

interface Frame { minLon: number; minLat: number; maxLon: number; maxLat: number }
function frameFor(coords: [number, number][]): Frame {
  const lats = coords.map((c) => c[0]), lons = coords.map((c) => c[1]);
  let minLon = Math.min(...lons), maxLon = Math.max(...lons);
  let minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const lonSpan = Math.max((maxLon - minLon) * PAD, MIN_SPAN_DEG);
  const latSpan = Math.max((maxLat - minLat) * PAD, MIN_SPAN_DEG * (H / W) * (360 / 180) * 0 + MIN_SPAN_DEG * 0.75);
  const clon = (minLon + maxLon) / 2, clat = (minLat + maxLat) / 2;
  // keep the canvas aspect: widen whichever span is proportionally smaller
  const aspect = W / H;
  let w = lonSpan, h = latSpan;
  if (w / h < aspect) w = h * aspect; else h = w / aspect;
  return { minLon: clon - w / 2, maxLon: clon + w / 2, minLat: clat - h / 2, maxLat: clat + h / 2 };
}

const inMena = (f: Frame) => f.minLon >= MENA.bbox[0] && f.minLat >= MENA.bbox[1] && f.maxLon <= MENA.bbox[2] && f.maxLat <= MENA.bbox[3];

// Ring bounding boxes, computed once: a ring is a candidate for a frame when its bbox
// intersects it — coastline vertices are coarse, so a ring can cross a frame with no
// vertex inside it.
const MENA_BBOXES = MENA.rings.map((r) => ({
  minLon: Math.min(...r.map((p) => p[0])), maxLon: Math.max(...r.map((p) => p[0])),
  minLat: Math.min(...r.map((p) => p[1])), maxLat: Math.max(...r.map((p) => p[1])),
}));
const bboxHit = (b: { minLon: number; maxLon: number; minLat: number; maxLat: number }, f: Frame) =>
  b.minLon <= f.maxLon && b.maxLon >= f.minLon && b.minLat <= f.maxLat && b.maxLat >= f.minLat;

function menaPaths(f: Frame): string {
  const X = (lon: number) => ((lon - f.minLon) / (f.maxLon - f.minLon)) * W;
  const Y = (lat: number) => H - ((lat - f.minLat) / (f.maxLat - f.minLat)) * H;
  const margin = 20;
  const inView = (x: number, y: number) => x >= -margin && x <= W + margin && y >= -margin && y <= H + margin;
  const ds: string[] = [];
  for (let i = 0; i < MENA.rings.length; i++) {
    if (!bboxHit(MENA_BBOXES[i], f)) continue;
    let pts = MENA.rings[i].map(([lo, la]) => [X(lo), Y(la)]);
    pts = rdp(pts, 1.5).filter((p, i, a) => i === 0 || i === a.length - 1 || inView(p[0], p[1]));
    if (pts.length > 2) ds.push(`M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L")}Z`);
  }
  return ds.join("");
}

function worldCrop(f: Frame): { view: string; unit: number; dxy: (c: [number, number]) => [number, number] } {
  // World paths live in a fixed equirectangular 1000x500 space; crop with the viewBox.
  const Xw = (lon: number) => ((lon + 180) / 360) * 1000;
  const Yw = (lat: number) => ((90 - lat) / 180) * 500;
  const x0 = Xw(f.minLon), x1 = Xw(f.maxLon), y0 = Yw(f.maxLat), y1 = Yw(f.minLat);
  const cw = x1 - x0, ch = y1 - y0;
  return {
    view: `${x0.toFixed(1)} ${y0.toFixed(1)} ${cw.toFixed(1)} ${ch.toFixed(1)}`,
    unit: cw / W, // one display px in crop-space units
    dxy: (c) => [Xw(c[1]), Yw(c[0])],
  };
}

mkdirSync(OUT_DIR, { recursive: true });
const maps: any[] = [];
const stopMap = new Map<string, string>();
let totalBytes = 0;
for (const [root, placeIds] of [...clusters.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const coords = placeIds.map((p) => unique.get(p)!);
  const f = frameFor(coords);
  const clusterId = `cluster-${root.split("/")[1]}`;
  const dots = placeIds.map((p) => ({ id: p, coord: unique.get(p)! }));
  let svg: string;
  if (inMena(f)) {
    const X = (lon: number) => ((lon - f.minLon) / (f.maxLon - f.minLon)) * W;
    const Y = (lat: number) => H - ((lat - f.minLat) / (f.maxLat - f.minLat)) * H;
    const circles = dots.map((d) => `<circle cx="${X(d.coord[1]).toFixed(1)}" cy="${Y(d.coord[0]).toFixed(1)}" r="7" fill="${DOT_HALO}" opacity=".35"/><circle cx="${X(d.coord[1]).toFixed(1)}" cy="${Y(d.coord[0]).toFixed(1)}" r="4" fill="${DOT}"/>`).join("");
    const land = menaPaths(f);
    // No coastline crosses the frame: the stops are inland, so the ground is land, not sea.
    const ground = land ? SEA : LAND;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(clusterId)}"><rect width="${W}" height="${H}" fill="${ground}"/>${land ? `<path d="${land}" fill="${LAND}"/>` : ""}${circles}</svg>\n`;
  } else {
    const { view, unit, dxy } = worldCrop(f);
    const circles = dots.map((d) => { const [x, y] = dxy(d.coord); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(7 * unit).toFixed(1)}" fill="${DOT_HALO}" opacity=".35"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(4 * unit).toFixed(1)}" fill="${DOT}"/>`; }).join("");
    const land = WORLD.paths.map((p) => `<path d="${p.d}"/>`).join("");
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" role="img" aria-label="${esc(clusterId)}"><rect x="${view.split(" ")[0]}" y="${view.split(" ")[1]}" width="${view.split(" ")[2]}" height="${view.split(" ")[3]}" fill="${SEA}"/><g fill="${LAND}">${land}</g>${circles}</svg>\n`;
  }
  const file = `${clusterId}.svg`;
  writeFileSync(resolve(OUT_DIR, file), svg);
  totalBytes += Buffer.byteLength(svg);
  maps.push({ id: clusterId, file: `media/time-browser/maps/${file}`, basemap: inMena(f) ? "mena" : "world", frame: f, places: placeIds, bytes: Buffer.byteLength(svg) });
  for (const [sid, sp] of stopPoints) if (placeIds.includes(sp.id)) stopMap.set(sid, clusterId);
}

writeFileSync(OUT_JSON, JSON.stringify({
  generated: new Date().toISOString(),
  rule: `single-linkage clustering of stop places with coordinates, threshold ${CLUSTER_KM}km; mena basemap when the frame fits bbox ${MENA.bbox}, else cropped world`,
  clusters: maps,
  stops: Object.fromEntries(stopMap),
  unmappedStops: index.stops.filter((s: any) => !stopMap.has(s.id)).map((s: any) => s.id),
}, null, 1) + "\n");

console.log(`coordinated stops: ${stopPoints.size} of ${index.stops.length} (${unique.size} unique places)`);
console.log(`clusters: ${maps.length}  total SVG: ${(totalBytes / 1024).toFixed(1)} KB  (avg ${(totalBytes / 1024 / Math.max(maps.length, 1)).toFixed(1)} KB)`);
for (const m of maps) console.log(`  ${m.id}  ${m.basemap}  places ${m.places.length}  ${(m.bytes / 1024).toFixed(1)} KB`);
console.log(`unmapped stops (no coordinates): ${index.stops.length - stopPoints.size}`);
console.log(`-> ${OUT_DIR}/  and  ${OUT_JSON}`);
