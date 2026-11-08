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
// --mask-self: replay each question with its own source precedent removed from
// the corpus — the generalization test. Unmasked replay can trivially
// self-cite (the answer key is in the corpus); masked replay measures whether
// rules or OTHER authority cover the question. This is coverage evidence,
// not semantic agreement — that still needs founder_resolution labels.
const maskSelf = process.argv.includes("--mask-self");

const rows: { src: string; status: string; outcome: string; cited?: string; citedAuthority?: boolean; citedSelf?: boolean; rule?: string }[] = [];
for (const p of doc.precedents) {
  const q = extractQuestion(p.summary ?? "");
  if (!q) continue;
  const corpus = maskSelf ? all.filter((c) => c.id !== p.id) : all;
  const d = decide({ question: q }, corpus, "conservative");
  const step = String(d.step);
  const outcome = `${d.status}/${step}`;
  const cited = (d.precedent as { id?: string } | undefined)?.id;
  rows.push({
    src: p.id, status: p.provenance_status ?? "unlabeled", outcome,
    cited, citedAuthority: cited ? (authorityIds.has(cited) || cited.startsWith("dec-")) : undefined,
    citedSelf: cited === p.id,
    rule: d.rule_id as string | undefined,
  });
}

const held = rows.filter((r) => r.outcome.includes("safe-default") || r.outcome.includes("docket")).length;
const decided = rows.length - held - rows.filter((r) => r.outcome.startsWith("rejected")).length;
const rejected = rows.filter((r) => r.outcome.startsWith("rejected")).length;
const citedRows = rows.filter((r) => r.cited);
const badCites = citedRows.filter((r) => r.citedAuthority === false);
const selfCites = citedRows.filter((r) => r.citedSelf).length;
const ruleDecisions = rows.filter((r) => r.outcome === "decided/rule").length;
const otherAuthority = citedRows.filter((r) => r.citedAuthority && !r.citedSelf).length;

console.log(`replay: ${rows.length} precedent questions replayed (conservative mode${maskSelf ? ", mask-self" : ""})`);
console.log(`  coverage: ${decided} decided (${ruleDecisions} via rules, ${otherAuthority} via other-authority precedent, ${selfCites} self-cite) | ${held} held | ${rejected} rejected`);
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
