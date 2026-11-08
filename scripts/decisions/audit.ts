#!/usr/bin/env tsx
/**
 * audit — per-rule / per-gate precision report over founder-labelled records.
 *
 * The promotion gate for autonomous mode needs per-surface agreement rates
 * (Fable Q7/Q8): a rule that the founder keeps rejecting is a false-positive
 * machine. This reads every record's calibration_log.founder_resolution and
 * reports, per rule_id / gate / step:
 *   decided-by-engine   — records the engine marked decided via that surface
 *   labelled            — how many carry a founder verdict
 *   approved/rejected/held — the verdict split
 *   agreement           — approved / (approved + rejected); held counts neither
 *                         way (founder deferred, not a verdict on correctness)
 *
 * Surfaces with <10 labels are "insufficient data" — promotion thresholds
 * (≥50 labels, ≥95% agreement) are enforced by humans reading this, not here.
 *
 * Usage: npx tsx scripts/decisions/audit.ts [--write docs/decisions/audit.md]
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const ROOT = process.cwd();
const RECORDS = join(ROOT, "docs/decisions/records");

interface Rec {
  id?: string; status?: string; step?: string; rule_id?: string; gate?: string;
  domain?: string; mode?: string;
  calibration_log?: { founder_resolution?: { verdict?: string; at?: string; by?: string; note?: string } };
}

const rows = new Map<string, { decided: number; approved: number; rejected: number; held: number; unlabeled: number }>();
const bump = (k: string, f: "decided" | "approved" | "rejected" | "held" | "unlabeled") => {
  const r = rows.get(k) ?? { decided: 0, approved: 0, rejected: 0, held: 0, unlabeled: 0 };
  r[f]++; rows.set(k, r);
};

if (existsSync(RECORDS)) {
  for (const f of readdirSync(RECORDS).filter((f) => f.endsWith(".yaml")).sort()) {
    let r: Rec;
    try { r = parse(readFileSync(join(RECORDS, f), "utf8")) as Rec; } catch { continue; }
    const surface = r.rule_id ? `rule:${r.rule_id}` : r.gate ? `gate:${r.gate}` : `step:${r.step ?? "?"}`;
    const decided = r.status === "decided" && !String(r.step).includes("safe-default");
    if (decided) bump(surface, "decided");
    const v = r.calibration_log?.founder_resolution?.verdict;
    if (v === "approved") bump(surface, "approved");
    else if (v === "rejected") bump(surface, "rejected");
    else if (v === "held") bump(surface, "held");
    else if (r.status) bump(surface, "unlabeled");
  }
}

const sorted = [...rows.entries()].sort((a, b) => (b[1].approved + b[1].rejected) - (a[1].approved + a[1].rejected));
console.log("surface audit — founder_resolution labels per rule/gate/step\n");
console.log("surface".padEnd(38) + "decided  appr  rej  held  unlabeled  agreement  labels");
for (const [k, r] of sorted) {
  const labelled = r.approved + r.rejected + r.held;
  const verdicts = r.approved + r.rejected;
  const agree = verdicts ? `${Math.round((r.approved / verdicts) * 100)}%` : "—";
  console.log(k.padEnd(38) + `${String(r.decided).padStart(7)}  ${String(r.approved).padStart(4)}  ${String(r.rejected).padStart(3)}  ${String(r.held).padStart(4)}  ${String(r.unlabeled).padStart(9)}  ${agree.padStart(9)}  ${labelled < 10 ? `${labelled} (insufficient)` : labelled}`);
}
const totalLabels = [...rows.values()].reduce((a, r) => a + r.approved + r.rejected + r.held, 0);
console.log(`\ntotal founder labels: ${totalLabels} — promotion needs ≥50/class at ≥95% agreement`);

// Domain rollup — the promotion gate is per class (domain), not per surface:
// a domain promotes when its aggregate labels clear the bar, then individual
// surfaces inside it are checked for FP concentration.
const doms = new Map<string, { approved: number; rejected: number; held: number; unlabeled: number }>();
if (existsSync(RECORDS)) {
  for (const f of readdirSync(RECORDS).filter((f) => f.endsWith(".yaml")).sort()) {
    let r: Rec & { domain?: string };
    try { r = parse(readFileSync(join(RECORDS, f), "utf8")) as Rec & { domain?: string }; } catch { continue; }
    const d = r.domain ?? "unclassified";
    const row = doms.get(d) ?? { approved: 0, rejected: 0, held: 0, unlabeled: 0 };
    const v = r.calibration_log?.founder_resolution?.verdict;
    if (v === "approved") row.approved++;
    else if (v === "rejected") row.rejected++;
    else if (v === "held") row.held++;
    else if (r.status) row.unlabeled++;
    doms.set(d, row);
  }
}
console.log("\ndomain rollup (per-class promotion view)");
console.log("domain".padEnd(20) + "appr  rej  held  unlabeled  agreement  labels");
for (const [d, r] of [...doms.entries()].sort((a, b) => (b[1].approved + b[1].rejected) - (a[1].approved + a[1].rejected))) {
  const labelled = r.approved + r.rejected + r.held;
  const verdicts = r.approved + r.rejected;
  const agree = verdicts ? `${Math.round((r.approved / verdicts) * 100)}%` : "—";
  console.log(d.padEnd(20) + `${String(r.approved).padStart(4)}  ${String(r.rejected).padStart(3)}  ${String(r.held).padStart(4)}  ${String(r.unlabeled).padStart(9)}  ${agree.padStart(9)}  ${labelled < 50 ? `${labelled} (need 50)` : labelled}`);
}

if (process.argv.includes("--write")) {
  const out = process.argv[process.argv.indexOf("--write") + 1] ?? join(ROOT, "docs/decisions/audit.md");
  const lines = [
    "# Decision surface audit — founder_resolution labels",
    "",
    `Generated ${new Date().toISOString().slice(0, 10)} by scripts/decisions/audit.ts.`,
    "Promotion gate per class: ≥50 labels, ≥95% agreement, zero non-engine decided.",
    "",
    "| surface | decided | approved | rejected | held | unlabeled | agreement |",
    "|---|---|---|---|---|---|---|",
    ...sorted.map(([k, r]) => {
      const v = r.approved + r.rejected;
      return `| ${k} | ${r.decided} | ${r.approved} | ${r.rejected} | ${r.held} | ${r.unlabeled} | ${v ? Math.round((r.approved / v) * 100) + "%" : "—"} |`;
    }),
    "",
  ];
  writeFileSync(out, lines.join("\n"));
  console.log(`wrote ${out}`);
}
