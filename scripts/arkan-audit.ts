// Counts for the Pillars and Branches of Faith Browser (docs/plan/61-arkan-browser.md): what the detector in
// scripts/arkan.ts admits from data/, by section and theme, read straight from the YAML files so it runs
// without a graph build.   npx tsx scripts/arkan-audit.ts
import { readdirSync, readFileSync } from "node:fs";
import YAML from "yaml";
import { arkanCorpusOf, arkanSignalsOf, arkanTopicsOf, ARKAN_SECTIONS, ARKAN_TAG, ARKAN_TOPICS } from "./arkan.js";

const genre = new Map<string, string[]>();
for (const f of readdirSync("data/work")) { if (!f.endsWith(".yaml")) continue; const m = readFileSync(`data/work/${f}`, "utf8").match(/^genre:\s*\[(.*)\]/m); if (m) genre.set(`work/${f.replace(/\.yaml$/, "")}`, m[1].split(",").map((s) => s.trim())); }
const bySection: Record<string, number> = {}, byTopic: Record<string, number> = {}, bySignal: Record<string, number> = {};
let total = 0;
for (const cls of readdirSync("data")) {
  if (cls.startsWith("_") || cls.includes(".")) continue;
  let files: string[]; try { files = readdirSync(`data/${cls}`); } catch { continue; }
  for (const f of files) {
    if (!f.endsWith(".yaml")) continue;
    const raw = readFileSync(`data/${cls}/${f}`, "utf8");
    if (cls !== "passage" && !raw.includes(ARKAN_TAG)) continue;
    if (cls === "passage" && !/^text(_search)?:/m.test(raw)) continue;
    let d: any; try { d = YAML.parse(raw); } catch { continue; }
    if (!d) continue;
    const n: any = { id: d.id ?? `${cls}/${f.replace(/\.yaml$/, "")}`, class: cls, stub: d.stub === true, tags: d.tags ?? [], data: d };
    const signals = arkanSignalsOf(n);
    if (!signals.length && !n.tags.includes(ARKAN_TAG)) continue;
    total++;
    const section = cls === "passage" ? arkanCorpusOf(d.work, genre.get(d.work), d.unit) : "curated";
    bySection[section] = (bySection[section] ?? 0) + 1;
    for (const t of arkanTopicsOf(n)) byTopic[t] = (byTopic[t] ?? 0) + 1;
    for (const s of signals) bySignal[s] = (bySignal[s] ?? 0) + 1;
  }
}
console.log(JSON.stringify({ total, bySection: Object.fromEntries(ARKAN_SECTIONS.map((s) => [s, bySection[s] ?? 0])), byTopic: Object.fromEntries(ARKAN_TOPICS.map((t) => [t, byTopic[t] ?? 0])), bySignal }, null, 1));
