// cite-check: the mechanical half of the publication standard
// (docs/agents/publication-standard.md). The bar for publishing a record is:
// it cites its sources, every cited source is a defined data/source entity, and
// its provenance is recorded. No review, no promotion, no second-source rule.
// This tool checks exactly that bar for a batch of records before commit.
//
// Run: npm run cite-check -- <class/slug> [<class/slug> ...] [--json]
// Exit code 1 if any record FAILs the bar.
import { existsSync, readFileSync } from "node:fs";
import { p, readYaml } from "./lib.js";

export function extractCiteSlugs(text: string): string[] {
  // Same citation shape the validator accepts: {cite:<slug> <free-form anchor>}.
  const re = /\{cite:([a-z0-9-]+)(?:\s[^}]*)?\}/g;
  return [...new Set([...text.matchAll(re)].map((m) => m[1]))];
}

export interface CheckResult { name: string; ok: boolean; detail: string }
export interface RecordReport { id: string; result: "pass" | "fail"; checks: CheckResult[] }

export function checkRecord(id: string): RecordReport {
  const checks: CheckResult[] = [];
  const add = (name: string, ok: boolean, detail: string) => checks.push({ name, ok, detail });
  const dataFile = p("data", `${id}.yaml`);
  if (!existsSync(dataFile)) {
    add("record-exists", false, `no file at data/${id}.yaml`);
    return { id, result: "fail", checks };
  }
  const entity: any = readYaml(dataFile);

  const sources: string[] = Array.isArray(entity?.sources) ? entity.sources : [];
  add("sources-present", sources.length >= 1, sources.length ? `${sources.length} source(s) cited` : "no sources listed — the bar requires at least one");
  const undefined_ = sources.filter((s) => !existsSync(p("data", `${s}.yaml`)));
  add("sources-defined", undefined_.length === 0, undefined_.length ? `not defined as source entities: ${undefined_.join(", ")}` : "every cited source is a defined source entity");

  const prov = entity?.provenance ?? {};
  const provMissing = ["source", "generated_by"].filter((k) => !prov[k]);
  add("provenance-recorded", provMissing.length === 0, provMissing.length ? `provenance missing: ${provMissing.join(", ")}` : "provenance records source and generated_by");

  const citeSlugs = new Set<string>();
  for (const lang of ["ar", "en", "ur"]) {
    const f = p("content", lang, `${id}.md`);
    if (existsSync(f)) for (const s of extractCiteSlugs(readFileSync(f, "utf8"))) citeSlugs.add(s);
  }
  const badCites = [...citeSlugs].filter((s) => !existsSync(p("data", "source", `${s}.yaml`)));
  add("cites-resolve", badCites.length === 0, badCites.length ? `citations to undefined sources: ${badCites.join(", ")}` : `${citeSlugs.size} distinct citation(s) in prose, all defined`);

  return { id, result: checks.every((c) => c.ok) ? "pass" : "fail", checks };
}

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const ids = args.filter((a) => !a.startsWith("--"));
  if (!ids.length) {
    console.error("usage: npm run cite-check -- <class/slug> [<class/slug> ...] [--json]");
    process.exit(2);
  }
  const reports = ids.map(checkRecord);
  if (json) {
    console.log(JSON.stringify(reports, null, 2));
  } else {
    for (const r of reports) {
      console.log(`${r.result.toUpperCase().padEnd(4)} ${r.id}`);
      for (const c of r.checks) console.log(`  ${c.ok ? "✓" : "✗"} ${c.name}: ${c.detail}`);
    }
    const fails = reports.filter((r) => r.result === "fail").length;
    console.log(`\ncite-check: ${reports.length - fails} pass, ${fails} fail of ${reports.length} record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)`);
    if (fails) process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
