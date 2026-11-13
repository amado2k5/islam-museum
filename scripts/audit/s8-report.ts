// Audit S8: every person record whose summary states a death year that its structured date contradicts, as the
// validator's own check sees it. Run: npx tsx scripts/audit/s8-report.ts [--list]
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { summaryDeathYearMismatch } from "../validate.js";
const dir = "data/person";
let n = 0, withDied = 0, pass = 0; const out: string[] = [];
for (const f of readdirSync(dir)) {
  if (!f.endsWith(".yaml")) continue;
  const e = parse(readFileSync(`${dir}/${f}`, "utf8"));
  n++; if (e.died?.edtf) withDied++;
  const m = summaryDeathYearMismatch(e);
  if (m) { out.push(`${e.id}: ${m}`); if (String(e.died?.note ?? "").includes("Date-enrichment pass")) pass++; }
}
if (process.argv.includes("--list")) for (const l of out) console.log(l);
console.log(`persons: ${n}; with a structured death year: ${withDied}; summary disagrees: ${out.length} (of them carrying the date-enrichment note: ${pass})`);
