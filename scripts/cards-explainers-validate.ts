// Explainers validator: schema-check every cards/explainers/<slug>.yaml.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const DIR = `${ROOT}cards/explainers`;
const WIDGETS = ["stepper", "decision-tree", "timeline", "compare"];

const errors: string[] = [];
const seen = new Set<string>();
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".yaml"))) {
  const tag = `explainers/${f}`;
  let d: any;
  try { d = parse(readFileSync(`${DIR}/${f}`, "utf8")); }
  catch (e) { errors.push(`${tag}: YAML parse error`); continue; }
  if (!d.slug || !/^[a-z0-9-]+$/.test(d.slug)) errors.push(`${tag}: bad slug`);
  if (d.slug !== f.replace(/\.yaml$/, "")) errors.push(`${tag}: slug must match filename`);
  if (seen.has(d.slug)) errors.push(`${tag}: duplicate slug`);
  seen.add(d.slug);
  if (!d.title?.ar || !d.title?.en) errors.push(`${tag}: title.ar/en required`);
  if (!d.source_card) errors.push(`${tag}: source_card required`);
  const w = d.widget ?? "stepper";
  if (!WIDGETS.includes(w)) errors.push(`${tag}: unknown widget ${w}`);
  if (w === "stepper" && (!Array.isArray(d.steps) || !d.steps.length)) errors.push(`${tag}: steps empty`);
  d.steps?.forEach((s: any, i: number) => {
    if (!s.q?.ar || !s.a?.ar) errors.push(`${tag}: step ${i} missing q.ar/a.ar`);
  });
  if (w === "decision-tree" && !d.tree?.q) errors.push(`${tag}: tree.q required`);
  if (w === "timeline" && (!Array.isArray(d.stations) || !d.stations.length)) errors.push(`${tag}: stations empty`);
  if (w === "compare" && (!Array.isArray(d.columns) || !d.columns.length)) errors.push(`${tag}: columns empty`);
  if (/ﷺ|ﷻ|رضي الله عنه|عليه السلام/.test(JSON.stringify(d))) errors.push(`${tag}: typed honorific`);
}
if (errors.length) { console.error(`explainers: ${errors.length} error(s):\n` + errors.join("\n")); process.exit(1); }
console.log(`explainers: ${seen.size} decks OK`);
