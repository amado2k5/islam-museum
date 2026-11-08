#!/usr/bin/env tsx
/**
 * benchmark — runs the decision pipeline over docs/decisions/benchmark.yaml and
 * reports agreement with the expected step. This is the calibration loop: every
 * mismatch is either a pipeline bug or a mislabelled expectation to review.
 *
 * Usage: npx tsx scripts/decisions/benchmark.ts [--verbose]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { decide, loadPrecedents, type Question } from "./decide";

const ROOT = process.cwd();
const BENCH = join(ROOT, "docs/decisions/benchmark.yaml");

interface Case extends Question { q: string; expect: string; note?: string; mode?: "autonomous" | "conservative" }

function actualOf(d: Record<string, unknown>): string {
  const status = String(d.status);
  if (status === "founder-docket") return "docket";
  if (status === "rejected") return "reject";
  const step = String(d.step);
  return step === "safe-default" ? "default" : step; // rule | precedent
}

const doc = parse(readFileSync(BENCH, "utf8")) as { cases: Case[] };
// Same corpus the engine sees in production: mined precedents + the ledger.
const precedents = loadPrecedents();

const verbose = process.argv.includes("--verbose");
let pass = 0;
const misses: { c: Case; got: string; detail: string }[] = [];
const byExpect = new Map<string, { pass: number; total: number }>();

for (const c of doc.cases) {
  const { expect, note, mode, question: _q, q: question, ...rest } = c as Case & { q: string };
  const q: Question = { question, ...rest };
  // Benchmark defaults to conservative so gate expectations stay meaningful;
  // cases may opt into autonomous mode explicitly.
  const d = decide(q, precedents, mode ?? "conservative");
  const got = actualOf(d);
  const ok = got === expect;
  const stat = byExpect.get(expect) ?? { pass: 0, total: 0 };
  stat.total++; if (ok) { pass++; stat.pass++; }
  byExpect.set(expect, stat);
  if (!ok) misses.push({ c, got, detail: `${d.step} — ${String(d.decision ?? d.reason).slice(0, 110)}` });
  if (verbose || !ok) {
    console.log(`${ok ? "PASS" : "MISS"} expect=${expect.padEnd(9)} got=${got.padEnd(9)} ${c.q.slice(0, 80)}`);
    if (!ok) console.log(`      ${misses[misses.length - 1]?.detail ?? ""}`);
  }
}

console.log(`\n${pass}/${doc.cases.length} cases match expectations (${Math.round((pass / doc.cases.length) * 1000) / 10}% reconstruction agreement — ICAI gate: promote rule changes only if this does not regress)`);

// Per-class metrics — the calibration dashboard.
for (const [k, v] of [...byExpect.entries()].sort()) {
  console.log(`  expect=${k.padEnd(9)} ${v.pass}/${v.total} pass`);
}
if (misses.length) {
  console.log("\nMisses (review: pipeline bug or mislabelled expectation?):");
  for (const m of misses) console.log(`- [${m.got} vs ${m.c.expect}] ${m.c.q.slice(0, 100)}\n    ${m.detail}`);
}
process.exit(misses.length ? 1 : 0);
