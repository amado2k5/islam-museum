#!/usr/bin/env tsx
/**
 * sweep — stale-authority detector for the decision ledger.
 *
 * Every rule edit can silently orphan records: a record written under an old
 * pattern keeps citing a rule_id that no longer matches what the engine would
 * answer today — and because engine-written `decided` records are ledger
 * precedent, the stale ruling propagates to future similar questions
 * (the dec-014 / dec-129 vulnerability class).
 *
 * This re-runs every LIVE rule-decided record's question through decide() and
 * reports records whose current answer differs from the stored one.
 *
 * "Live" = status decided, step rule, not superseded, no rejected/held founder
 * verdict (dead authority is allowed to stay stale — it cannot be cited).
 *
 * Exit 1 when live stale records exist — wire into validate or run after any
 * rules.yaml edit. Fix by writing a kind:override record superseding the stale
 * one (see dec-20261108-153 for the pattern).
 *
 * Usage: npx tsx scripts/decisions/sweep.ts [--verbose]
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { decide, loadPrecedents } from "./decide";

const DIR = join(process.cwd(), "docs/decisions/records");
const verbose = process.argv.includes("--verbose");

interface Rec {
  id?: string; status?: string; step?: string; rule_id?: string;
  question?: string; supersedes?: string; kind?: string;
  calibration_log?: { founder_resolution?: { verdict?: string } | null };
}

const recs: Rec[] = [];
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".yaml")).sort()) {
  try { recs.push(parse(readFileSync(join(DIR, f), "utf8")) as Rec); }
  catch { /* skip unreadable */ }
}

const superseded = new Set(recs.map((r) => r.supersedes).filter((x): x is string => !!x));
const live = (r: Rec) =>
  r.status === "decided" && r.step === "rule" && r.question
  && !superseded.has(r.id ?? "")
  && !["rejected", "held"].includes(r.calibration_log?.founder_resolution?.verdict ?? "");

const corpus = loadPrecedents();
const stale: { id: string; stored: string; now: string; q: string }[] = [];
let checked = 0;
for (const r of recs.filter(live)) {
  checked++;
  const d = decide({ question: r.question }, corpus, "conservative");
  const now = d.step === "rule" ? `rule/${d.rule_id}` : `${d.status}/${d.step}`;
  const stored = `rule/${r.rule_id}`;
  if (now !== stored) stale.push({ id: r.id ?? "?", stored, now, q: r.question! });
}

console.log(`sweep: ${checked} live rule-decided records re-checked`);
if (!stale.length) {
  console.log("  0 stale citations — every live rule record still matches the engine");
  process.exit(0);
}
console.log(`  ${stale.length} STALE — live records citing rules the engine no longer fires:`);
for (const s of stale) {
  console.log(`  ${s.id}  stored:${s.stored}  now:${s.now}`);
  if (verbose) console.log(`      q: ${s.q.slice(0, 100)}`);
}
console.log("\nFix: write a kind:override record superseding each stale id (pattern: dec-20261108-153). Dead records need no fix.");
process.exit(1);
