#!/usr/bin/env tsx
/**
 * tradition-audit.ts — classify every person record's tradition/faith
 * attestation strength under rule-tradition-attestation.
 *
 * Tiers (strongest first):
 *   documented      — faith[] entry with basis documented/attested AND sources
 *   basis-only      — faith[] entry with a real basis but no sources listed
 *   default-only    — only basis:"tradition" (museum framework default) and/or
 *                     bare traditions[] strings with no faith[] basis
 *   unknown-only    — only unknown/other/unverified values present
 *   missing         — no faith[] and no traditions[] at all
 *
 * Read-only audit: writes docs/decisions/tradition-attestation-audit.{json,md}
 * Candidates for judge packets = default-only + missing (the weak/missing set).
 *
 * Usage: npx tsx scripts/decisions/tradition-audit.ts [--top N]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const ROOT = process.cwd();
const PERSONS = join(ROOT, "data/person");
const OUT_JSON = join(ROOT, "docs/decisions/tradition-attestation-audit.json");
const OUT_MD = join(ROOT, "docs/decisions/tradition-attestation-audit.md");

const WEAK_BASES = new Set(["tradition", "default", "framework", "scope"]);
const EMPTY_VALUES = new Set(["unknown", "unverified", "other", "none"]);

type FaithEntry = { value?: string; basis?: string; sources?: unknown[] };
type Tier = "documented" | "basis-only" | "default-only" | "unknown-only" | "missing";

interface Row { id: string; tier: Tier; values: string[]; bases: string[] }

function classify(doc: any): { tier: Tier; values: string[]; bases: string[] } {
  const faith: FaithEntry[] = Array.isArray(doc?.faith) ? doc.faith : [];
  const trads: string[] = Array.isArray(doc?.traditions) ? doc.traditions : [];
  const values = new Set<string>();
  const bases = new Set<string>();
  let documented = false, realBasis = false, hasDefault = false, hasEmpty = false, hasReal = false;

  for (const f of faith) {
    const v = String(f?.value ?? "");
    const b = String(f?.basis ?? "");
    const srcs = Array.isArray(f?.sources) ? f.sources : [];
    if (v) values.add(v);
    if (b) bases.add(b);
    if (EMPTY_VALUES.has(v)) { hasEmpty = true; continue; }
    hasReal = true;
    if (WEAK_BASES.has(b)) hasDefault = true;
    else if (srcs.length > 0) { realBasis = true; if (b === "documented" || b === "attested") documented = true; }
    else realBasis = true;
  }
  for (const t of trads) { values.add(String(t)); hasReal = true; }

  let tier: Tier;
  if (documented) tier = "documented";
  else if (realBasis) tier = "basis-only";
  else if (hasReal && hasDefault) tier = "default-only";
  else if (hasReal) tier = "basis-only"; // traditions[] strings count as real-but-unsourced
  else if (hasEmpty || values.size > 0) tier = "unknown-only";
  else tier = "missing";
  return { tier, values: [...values], bases: [...bases] };
}

function main() {
  const topN = (() => { const i = process.argv.indexOf("--top"); return i >= 0 ? parseInt(process.argv[i + 1]) : 0; })();
  const rows: Row[] = [];
  let parseFails = 0;
  for (const fn of readdirSync(PERSONS).filter(f => f.endsWith(".yaml"))) {
    const id = fn.replace(/\.yaml$/, "");
    try {
      const doc = parse(readFileSync(join(PERSONS, fn), "utf8"));
      const c = classify(doc);
      rows.push({ id, ...c });
    } catch { parseFails++; }
  }
  const byTier = new Map<Tier, number>();
  for (const r of rows) byTier.set(r.tier, (byTier.get(r.tier) ?? 0) + 1);
  const candidates = rows.filter(r => r.tier === "default-only" || r.tier === "missing" || r.tier === "unknown-only")
    .sort((a, b) => a.id.localeCompare(b.id));

  const summary = {
    generated_at: new Date().toISOString(),
    total_persons: rows.length,
    parse_failures: parseFails,
    by_tier: Object.fromEntries(byTier),
    judge_candidates: candidates.length,
    rule: "rule-tradition-attestation",
  };
  writeFileSync(OUT_JSON, JSON.stringify({ summary, rows }, null, 1));

  const md = [
    "# Tradition attestation audit",
    "",
    `Generated ${summary.generated_at} by \`scripts/decisions/tradition-audit.ts\` under \`rule-tradition-attestation\`.`,
    "",
    `- persons scanned: **${rows.length}** (${parseFails} YAML parse failures)`,
    ...(["documented", "basis-only", "default-only", "unknown-only", "missing"] as Tier[])
      .map(t => `- ${t}: **${byTier.get(t) ?? 0}**`),
    `- judge-packet candidates (default-only + unknown-only + missing): **${candidates.length}**`,
    "",
    "Tiers: documented = faith entry with documented/attested basis + sources; basis-only = real basis, no sources; default-only = museum 'tradition' default or bare traditions[] strings; unknown-only = only unknown/other; missing = no faith/traditions fields.",
    "",
    "## Sample candidates",
    "",
    ...candidates.slice(0, topN || 40).map(r => `- \`${r.id}\` — ${r.tier} ${r.values.length ? `(${r.values.join(", ")})` : ""}`),
    "",
  ].join("\n");
  writeFileSync(OUT_MD, md);

  console.log(JSON.stringify(summary, null, 1));
  console.log(`wrote ${OUT_JSON} and ${OUT_MD}`);
}

main();
