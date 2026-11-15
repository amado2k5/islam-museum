// Reads the museum graph (data/) and writes assets/museum-data.js for the trailer.
// Everything the trailer draws (map dots, timeline columns, arcs) comes from real records.
// Run from the repository root: node marketing/trailer/scripts/build-data.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");
const read = (cls) =>
  readdirSync(join(root, "data", cls))
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((f) => [`${cls}/${f.slice(0, -5)}`, readFileSync(join(root, "data", cls, f), "utf8")]);

// 1. Points: every place and building with coordinates ([lat, lon]).
const coordRe = /^coordinates:\s*(?:\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]|\n\s*-\s*(-?[\d.]+)\s*\n\s*-\s*(-?[\d.]+))/m;
const pts = [];
const index = new Map();
let nPlace = 0, nBuilding = 0;
for (const cls of ["place", "building"]) {
  for (const [id, text] of read(cls)) {
    const m = coordRe.exec(text);
    if (!m) continue;
    const lat = Number(m[1] ?? m[3]);
    const lon = Number(m[2] ?? m[4]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
    index.set(id, pts.length);
    pts.push([Math.round(lon * 100), Math.round(lat * 100)]);
    cls === "place" ? nPlace++ : nBuilding++;
  }
}

// 2. Timeline: dated events per century of the Common Era.
const centuries = {};
let dated = 0;
for (const [, text] of read("event")) {
  const m = /^\s*start:\s*\{?[^\n]*?edtf:\s*"?(-?\d{4})/m.exec(text) || /^\s*start:\s*\n\s+edtf:\s*"?(-?\d{4})/m.exec(text);
  if (!m) continue;
  const y = Number(m[1]);
  if (y < 400 || y > 2026) continue;
  const c = Math.floor(y / 100);
  centuries[c] = (centuries[c] || 0) + 1;
  dated++;
}

// 3. Arcs: a record that names two mapped places links them (a life, an event, a journey).
const arcs = new Map();
const tRe = /target:\s*((?:place|building)\/[a-z0-9-]+)/g;
let linking = 0;
for (const cls of ["person", "event", "journey", "place", "building"]) {
  for (const [id, text] of read(cls)) {
    const seen = new Set();
    if (index.has(id)) seen.add(index.get(id));
    for (const m of text.matchAll(tRe)) if (index.has(m[1])) seen.add(index.get(m[1]));
    const list = [...seen];
    if (list.length < 2) continue;
    linking++;
    for (let i = 0; i + 1 < list.length && i < 6; i++) {
      const a = Math.min(list[i], list[i + 1]), b = Math.max(list[i], list[i + 1]);
      const dx = pts[a][0] - pts[b][0], dy = pts[a][1] - pts[b][1];
      if (dx * dx + dy * dy < 300 * 300) continue; // under ~3 degrees: too short to read
      arcs.set(a * 100000 + b, [a, b]);
    }
  }
}
// Deterministic thinning to a drawable number.
const all = [...arcs.values()];
const step = Math.max(1, Math.floor(all.length / 900));
const picked = all.filter((_, i) => i % step === 0).slice(0, 900);

const out = { pts, centuries, arcs: picked, meta: { places: nPlace, buildings: nBuilding, datedEvents: dated, arcsFound: all.length, linking } };
writeFileSync(join(here, "..", "assets", "museum-data.js"), `window.__IM = ${JSON.stringify(out)};\n`);
console.log(out.meta, centuries);
