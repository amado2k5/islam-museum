#!/usr/bin/env tsx
/**
 * replay — coverage + citation-precision diagnostic for the decision engine.
 *
 * Replays every precedent whose summary carries an extractable "Question:"
 * (the lane decision logs) through decide() in conservative mode — the
 * production default — and reports:
 *   coverage   — decided (rule/precedent/override) vs held (default/docket/reject)
 *   citation precision — when the engine cites a precedent, is it authority
 *     (founder-ruled, founder-ruled-ai-assisted, agent-ruled-delegated, ledger)
 *     or a mere proposal?
 *
 * This is NOT an agreement metric — pending proposals have no ground truth.
 * The real agreement signal is founder_resolution labels (founder-rule.ts).
 * Usage: npx tsx scripts/decisions/replay.ts [--verbose] [--write FILE]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { decide, loadPrecedents, type Precedent } from "./decide";

const ROOT = process.cwd();
const PRECEDENTS_FILE = join(ROOT, "docs/decisions/precedents.yaml");
const AUTHORITY = new Set(["founder-ruled", "founder-ruled-ai-assisted", "agent-ruled-delegated"]);

function extractQuestion(summary: string): string | null {
  const m = summary.match(/Question:\s*(.{15,500}?\?)/);
  return m ? m[1].replace(/\*\*/g, "").trim() : null;
}

const doc = parse(readFileSync(PRECEDENTS_FILE, "utf8")) as { precedents: Precedent[] };
const authorityIds = new Set(doc.precedents.filter((p) => p.provenance_status && AUTHORITY.has(p.provenance_status)).map((p) => p.id));
const all = loadPrecedents();

const rows: { src: string; status: string; outcome: string; cited?: string; citedAuthority?: boolean; rule?: string }[] = [];
for (const p of doc.precedents) {
  const q = extractQuestion(p.summary ?? "");
  if (!q) continue;
  const d = decide({ question: q }, all, "conservative");
  const step = String(d.step);
  const outcome = `${d.status}/${step}`;
  const cited = (d.precedent as { id?: string } | undefined)?.id;
  rows.push({
    src: p.id, status: p.provenance_status ?? "unlabeled", outcome,
    cited, citedAuthority: cited ? (authorityIds.has(cited) || cited.startsWith("dec-")) : undefined,
    rule: d.rule_id as string | undefined,
  });
}

const held = rows.filter((r) => r.outcome.includes("safe-default") || r.outcome.includes("docket")).length;
const decided = rows.length - held - rows.filter((r) => r.outcome.startsWith("rejected")).length;
const rejected = rows.filter((r) => r.outcome.startsWith("rejected")).length;
const citedRows = rows.filter((r) => r.cited);
const badCites = citedRows.filter((r) => r.citedAuthority === false);

console.log(`replay: ${rows.length} precedent questions replayed (conservative mode)`);
console.log(`  coverage: ${decided} decided | ${held} held | ${rejected} rejected`);
console.log(`  precedent citations: ${citedRows.length} | non-authority citations: ${badCites.length}${badCites.length ? "  <-- PRECISION BUG" : ""}`);
for (const r of badCites) console.log(`    ${r.src} → cited ${r.cited} (${r.outcome})`);

if (process.argv.includes("--verbose")) {
  for (const r of rows.filter((r) => r.outcome.includes("safe-default") || r.outcome.includes("docket") || r.outcome.startsWith("rejected"))) {
    console.log(`  ${r.outcome.padEnd(26)} ${r.src} [${r.status}]${r.rule ? ` (${r.rule})` : ""}`);
  }
}

if (process.argv.includes("--write")) {
  const out = process.argv[process.argv.indexOf("--write") + 1] ?? join(ROOT, "docs/decisions/replay.md");
  const lines = [
    "# Precedent replay — engine coverage diagnostic",
    "",
    `Generated ${new Date().toISOString().slice(0, 10)} by scripts/decisions/replay.ts.`,
    "Replays extractable lane questions through the engine (conservative mode).",
    "Coverage and citation precision only — agreement needs founder_resolution labels.",
    "",
    `- questions replayed: ${rows.length}`,
    `- decided: ${decided} | held: ${held} | rejected: ${rejected}`,
    `- precedent citations: ${citedRows.length} (${badCites.length} non-authority)`,
    "",
    "| source precedent | its status | engine outcome | cited | verdict |",
    "|---|---|---|---|---|",
    ...rows.map((r) => `| ${r.src} | ${r.status} | ${r.outcome}${r.rule ? ` (${r.rule})` : ""} | ${r.cited ?? "—"} | ${r.citedAuthority === false ? "NON-AUTHORITY CITE" : r.outcome.startsWith("decided/") ? "covered" : "held"} |`),
    "",
  ];
  writeFileSync(out, lines.join("\n"));
  console.log(`wrote ${out}`);
}
