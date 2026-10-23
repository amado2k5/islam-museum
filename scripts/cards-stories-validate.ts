// Stories validator: schema-check every cards/stories/<slug>.yaml.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const DIR = `${ROOT}cards/stories`;

const errors: string[] = [];
const seen = new Set<string>();
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".yaml"))) {
  const tag = `stories/${f}`;
  let d: any;
  try { d = parse(readFileSync(`${DIR}/${f}`, "utf8")); }
  catch (e) { errors.push(`${tag}: YAML parse error`); continue; }
  if (!d.slug || !/^[a-z0-9-]+$/.test(d.slug)) errors.push(`${tag}: bad slug`);
  if (d.slug !== f.replace(/\.yaml$/, "")) errors.push(`${tag}: slug must match filename`);
  if (seen.has(d.slug)) errors.push(`${tag}: duplicate slug`);
  seen.add(d.slug);
  if (!d.title?.ar || !d.title?.en) errors.push(`${tag}: title.ar/en required`);
  if (!d.source_card) errors.push(`${tag}: source_card required`);
  if (!Array.isArray(d.stations) || !d.stations.length) errors.push(`${tag}: stations empty`);
  d.stations?.forEach((s: any, i: number) => {
    if (!s.title?.ar || !s.body?.ar) errors.push(`${tag}: station ${i} missing title.ar/body.ar`);
    if (!s.ref) errors.push(`${tag}: station ${i} missing ref (surah ayah)`);
  });
  if (/ﷺ|ﷻ|رضي الله عنه|عليه السلام/.test(JSON.stringify(d))) errors.push(`${tag}: typed honorific`);
}
if (errors.length) { console.error(`stories: ${errors.length} error(s):\n` + errors.join("\n")); process.exit(1); }
console.log(`stories: ${seen.size} decks OK`);
