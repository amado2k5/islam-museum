// Working check for relations added during the Grand Tour mission (statement 4): not an oracle, a guard for writers.
//   npx tsx scripts/fable/check-relations.ts <class/slug> [...]
// For each named record it re-reads the data file and reports, per relation: whether the predicate is registered and fits
// the two classes, whether the target is a real record (not a stub, not missing), whether the relation names sources and
// every one of them is already in the record's own `sources:` list, whether the same edge is written twice in the file,
// and whether the other record already writes the same edge from its side (the museum writes each edge once).
import { existsSync } from "node:fs";
import { loadPredicates, resolvePredicate, p, readYaml } from "../lib.js";

const preds = loadPredicates();
const ids = process.argv.slice(2).filter((a) => a.includes("/"));
let bad = 0;
for (const id of ids) {
  const file = p("data", `${id}.yaml`);
  if (!existsSync(file)) { console.log(`FAIL ${id}: no data file`); bad++; continue; }
  let e: any;
  try { e = readYaml(file); } catch (err: any) { console.log(`FAIL ${id}: the file no longer parses as YAML: ${String(err.message).split("\n")[0]}`); bad++; continue; }
  const sources: string[] = e.sources ?? [];
  const rels: any[] = e.relations ?? [];
  const seen = new Set<string>();
  const targets = new Set<string>();
  console.log(`${id}: ${rels.length} relation(s) in its own file`);
  for (const r of rels) {
    const problems: string[] = [];
    const tcls = String(r.target ?? "").split("/")[0];
    const rp = resolvePredicate(preds, r.type, e.class, tcls);
    if (!rp) problems.push(`predicate ${r.type} is not registered or does not fit ${e.class} -> ${tcls}`);
    else if (rp.pred.derived) problems.push(`${r.type} is a derived predicate and cannot be written`);
    if (r.type === "related_to") problems.push("related_to is the fallback: choose a typed predicate or leave the relation out");
    const tfile = p("data", `${r.target}.yaml`);
    if (!existsSync(tfile)) problems.push(`target ${r.target} is not a record (missing or only a stub)`);
    if (!Array.isArray(r.sources) || r.sources.length === 0) problems.push("no sources on the relation");
    else for (const s of r.sources) if (!sources.includes(s)) problems.push(`source ${s} is not in this record's own sources list`);
    const key = `${r.type}|${r.target}`;
    if (seen.has(key)) problems.push("written twice in this file");
    seen.add(key);
    if (rp && existsSync(tfile)) {
      const other: any = readYaml(tfile);
      const mirror = (other.relations ?? []).some((x: any) => {
        if (x.target !== id) return false;
        const xp = resolvePredicate(preds, x.type, other.class, e.class);
        return !!xp && xp.canonical === rp.canonical && xp.reversed !== rp.reversed;
      });
      if (mirror) problems.push(`${r.target} already writes this edge from its side: do not write it again`);
    }
    if (existsSync(tfile)) targets.add(r.target);
    if (problems.length) { bad++; console.log(`  FAIL ${r.type} -> ${r.target}: ${problems.join("; ")}`); }
    else console.log(`  ok   ${r.type} -> ${r.target}`);
  }
  console.log(`  distinct real targets written by this record: ${targets.size}`);
}
console.log(bad ? `\ncheck-relations: ${bad} problem(s)` : "\ncheck-relations: 0 problems");
process.exit(bad ? 1 : 0);
