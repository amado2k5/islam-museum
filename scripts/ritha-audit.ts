// Counts for the Elegy and Death-Announcement Browser (docs/plan/72-ritha-browser.md): what the detector in
// scripts/ritha.ts admits from data/, by section, kind and signal, read straight from the YAML files so it runs
// without a graph build.   npx tsx scripts/ritha-audit.ts [--list]
import { readdirSync, readFileSync } from "node:fs";
import YAML from "yaml";
import { rithaCorpusOf, rithaKindOf, rithaSignalsOf, rithaTagKind, RITHA_SECTIONS, RITHA_TAG } from "./ritha.js";

const LIST = process.argv.includes("--list");
const genre = new Map<string, string[]>();
for (const f of readdirSync("data/work")) { if (!f.endsWith(".yaml")) continue; const m = readFileSync(`data/work/${f}`, "utf8").match(/^genre:\s*\[(.*)\]/m); if (m) genre.set(`work/${f.replace(/\.yaml$/, "")}`, m[1].split(",").map((s) => s.trim())); }
const bySection: Record<string, number> = {}, byKind: Record<string, number> = {}, bySignal: Record<string, number> = {};
let total = 0;
for (const cls of readdirSync("data")) {
  if (cls.startsWith("_") || cls.includes(".")) continue;
  let files: string[]; try { files = readdirSync(`data/${cls}`); } catch { continue; }
  for (const f of files) {
    if (!f.endsWith(".yaml")) continue;
    const raw = readFileSync(`data/${cls}/${f}`, "utf8");
    if (cls !== "passage" && !raw.includes(RITHA_TAG)) continue;
    if (cls === "passage" && !/^text(_search)?:/m.test(raw)) continue;
    let d: any; try { d = YAML.parse(raw); } catch { continue; }
    if (!d) continue;
    const n: any = { id: d.id ?? `${cls}/${f.replace(/\.yaml$/, "")}`, class: cls, stub: d.stub === true, tags: d.tags ?? [], label: d.label ?? {}, data: d };
    const signals = rithaSignalsOf(n);
    if (!signals.length && !n.tags.includes(RITHA_TAG)) continue;
    total++;
    const section = cls === "passage" ? rithaCorpusOf(d.work, genre.get(d.work), d.unit) : "curated";
    const kind = cls === "passage" ? rithaKindOf(n) : rithaTagKind(n);
    bySection[section] = (bySection[section] ?? 0) + 1;
    byKind[String(kind)] = (byKind[String(kind)] ?? 0) + 1;
    for (const s of signals) bySignal[s] = (bySignal[s] ?? 0) + 1;
    if (LIST) console.log([n.id, section, kind, signals.join("+"), String(d.text_search ?? d.text ?? "").replace(/\s+/g, " ").slice(0, 110)].join("\t"));
  }
}
console.log(JSON.stringify({ total, bySection: Object.fromEntries(RITHA_SECTIONS.map((s) => [s, bySection[s] ?? 0])), byKind, bySignal }, null, 1));
