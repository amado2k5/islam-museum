// Time Browser media phase M3: generate static SVG cards for stops with no real image.
// No AI: a card is the period colour (deterministic palette keyed on the stop's primary
// period), the stop title and its first place name. One card is shared by every stop with
// the same (period, place) pair, so adjacent stops reuse it (DESIGN.md §4.3).
// Usage: npx tsx scripts/time-browser-cards.ts [--index data/time-browser-media-index.json]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n: string, d: string) => (process.argv.indexOf(`--${n}`) >= 0 ? process.argv[process.argv.indexOf(`--${n}`) + 1] : d);
const INDEX = resolve(ROOT, arg("index", "data/time-browser-media-index.json"));
const OUT_DIR = resolve(ROOT, "site/public/media/time-browser/cards");
const OUT_JSON = resolve(ROOT, "data/time-browser-cards.json");

const W = 480, H = 300;
// Museum palette (earth tones in the same family as the site class colours): the card colour
// is picked deterministically from the period id, so the same period always renders the same
// colour without a hand-kept table.
const PALETTE = ["#8c6d3b", "#7a5c3e", "#b27b42", "#4d8a4f", "#2a7b88", "#1c4e40", "#8e5aa8", "#b65c5c", "#3f6fb5", "#9e4a38"];
const FALLBACK = "#5f5a53";
const INK = "#f7f3ea";

const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Arabic label first (Arabic-first rule), English fallback. SVG text uses a generic font stack.
const pick = (l: Record<string, string>) => l?.ar || l?.en || l?.ur || "";
const trim = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

const index = JSON.parse(readFileSync(INDEX, "utf8"));
const graph = JSON.parse(readFileSync(resolve(ROOT, ".cache/graph.json"), "utf8"));
const labelOf = new Map<string, Record<string, string>>();
for (const n of graph.nodes) labelOf.set(n.id, n.label);

interface CardKey { period: string; place: string }
const cards = new Map<string, { key: CardKey; color: string; stops: string[] }>();
const stopCard = new Map<string, string>();

for (const s of index.stops) {
  if (s.hero || s.candidates.length) continue;           // real image covers it
  const period = s.periods[0] ?? "no-period";
  const pid = s.places[0] ?? (s.id.startsWith("place/") ? s.id : "no-place");
  const key = `${period}|${pid}`;
  if (!cards.has(key)) {
    cards.set(key, {
      key: { period, place: pid },
      color: period === "no-period" ? FALLBACK : PALETTE[hash(period) % PALETTE.length],
      stops: [],
    });
  }
  cards.get(key)!.stops.push(s.id);
  stopCard.set(s.id, key);
}

mkdirSync(OUT_DIR, { recursive: true });
const slug = (s: string) => s.replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
let total = 0;
const out: any[] = [];
for (const [key, c] of [...cards.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const file = `card-${slug(key)}.svg`;
  // Title: the shared card shows the place name and period label, not one stop's title,
  // because several stops reuse it.
  const placeLabel = c.key.place === "no-place" ? "" : trim(pick(labelOf.get(c.key.place) ?? {}), 40);
  const periodLabel = c.key.period === "no-period" ? "" : trim(pick(labelOf.get(c.key.period) ?? {}), 40);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(placeLabel || periodLabel)}"><rect width="${W}" height="${H}" fill="${c.color}"/><rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${INK}" stroke-opacity=".35" stroke-width="2"/>${placeLabel ? `<text x="${W / 2}" y="${H / 2}" fill="${INK}" font-family="Georgia,'Times New Roman',serif" font-size="30" text-anchor="middle">${esc(placeLabel)}</text>` : ""}${periodLabel ? `<text x="${W / 2}" y="${H / 2 + (placeLabel ? 44 : 0)}" fill="${INK}" fill-opacity=".8" font-family="Georgia,'Times New Roman',serif" font-size="20" text-anchor="middle">${esc(periodLabel)}</text>` : ""}</svg>\n`;
  writeFileSync(resolve(OUT_DIR, file), svg);
  total += Buffer.byteLength(svg);
  out.push({ id: key, file: `media/time-browser/cards/${file}`, period: c.key.period, place: c.key.place, color: c.color, stops: c.stops, bytes: Buffer.byteLength(svg) });
}

writeFileSync(OUT_JSON, JSON.stringify({
  generated: new Date().toISOString(),
  rule: "one card per (primary period, primary place); colour = deterministic palette index of the period id; no AI",
  cards: out,
  stops: Object.fromEntries(stopCard),
}, null, 1) + "\n");

console.log(`stops needing a card: ${stopCard.size}  distinct cards: ${cards.size}  total ${(total / 1024).toFixed(1)} KB`);
console.log(`-> ${OUT_DIR}/  and  ${OUT_JSON}`);
