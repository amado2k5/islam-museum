#!/usr/bin/env tsx
/**
 * check-records — ledger schema validation (rollout step 2).
 *
 * Parses every docs/decisions/records/*.yaml and asserts the record contract:
 *   REQUIRED (fail): id, date, question_hash OR question, status, step,
 *     decision|reason, confidence, reversible, decided_by
 *   WARN (legacy tolerance): missing expires_at, domain, mode, kind
 *   CROSS-REFS (fail): every `supersedes:` target exists as a record;
 *     every cited precedent.id resolves in precedents.yaml or records/.
 *
 * Read-only — never modifies records. Exit 1 on any FAIL so it can gate CI
 * and the benchmark chain (`npm run decisions:check`).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { parse } from "yaml";

const ROOT = process.cwd();
const RECORDS_DIR = join(ROOT, "docs/decisions/records");
const PRECEDENTS = join(ROOT, "docs/decisions/precedents.yaml");
const RULESET = join(ROOT, "docs/decisions/rules.yaml");

interface Rec {
  id?: string; kind?: string; date?: string; question?: string; question_hash?: string;
  status?: string; step?: string; decision?: string; reason?: string;
  confidence?: unknown; reversible?: boolean; decided_by?: { agent?: string; pipeline?: string };
  expires_at?: string; domain?: string; mode?: string; supersedes?: string;
  rule_id?: string; precedent?: { id?: string };
}

function questionHash(question: string): string {
  const norm = question.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, " ").trim();
  return createHash("sha1").update(norm).digest("hex").slice(0, 12);
}

const REQUIRED: (keyof Rec)[] = ["id", "date", "status", "step", "confidence", "reversible", "decided_by"];
const WARN_ONLY: (keyof Rec)[] = ["expires_at", "domain", "mode", "kind"];

function main() {
  const files = existsSync(RECORDS_DIR)
    ? readdirSync(RECORDS_DIR).filter((f) => f.endsWith(".yaml")).sort()
    : [];
  const records: Rec[] = [];
  const parseErrors: string[] = [];
  for (const f of files) {
    try {
      const r = parse(readFileSync(join(RECORDS_DIR, f), "utf8")) as Rec;
      records.push({ ...r, id: r.id ?? f.replace(/\.yaml$/, "") });
    } catch (e) { parseErrors.push(`${f}: ${(e as Error).message.slice(0, 100)}`); }
  }

  const fails: string[] = [...parseErrors];
  const warns: string[] = [];
  const ids = new Set(records.map((r) => r.id).filter((x): x is string => !!x));

  // Precedent id universe: mined precedents + ledger record ids.
  const precIds = new Set<string>();
  if (existsSync(PRECEDENTS)) {
    const p = parse(readFileSync(PRECEDENTS, "utf8")) as { precedents?: { id?: string }[] } | { id?: string }[];
    const list = Array.isArray(p) ? p : (p.precedents ?? []);
    for (const e of list) if (e.id) precIds.add(String(e.id));
  }
  for (const id of ids) precIds.add(id);

  // Rule ids that exist in the ruleset — a decided record citing a deleted or
  // renamed rule is stale authority (Fable F2 quarantine).
  const ruleIds = new Set<string>();
  if (existsSync(RULESET)) {
    const rs = parse(readFileSync(RULESET, "utf8")) as { rules?: { id?: string }[] };
    for (const r of rs.rules ?? []) if (r.id) ruleIds.add(r.id);
  }

  // Dead authority: records named by another record's `supersedes` are
  // superseded — their outcome no longer counts (that is what an override is).
  const supersededIds = new Set(records.map((r) => r.supersedes).filter(Boolean));

  // Duplicate question hashes with DIFFERING outcomes among LIVE decided
  // records = contradictory authority (Fable F10).
  const byHash = new Map<string, Rec[]>();
  for (const r of records) {
    if (!r.question || supersededIds.has(r.id)) continue;
    const h = questionHash(r.question);
    byHash.set(h, [...(byHash.get(h) ?? []), r]);
  }
  for (const [h, rs2] of byHash) {
    const decidedOnes = rs2.filter((r) => r.status === "decided");
    const distinct = new Set(decidedOnes.map((r) => `${r.step}|${r.decision ?? r.reason}`));
    if (distinct.size > 1) {
      fails.push(`question_hash ${h}: ${decidedOnes.length} live decided records with ${distinct.size} different outcomes (${decidedOnes.map((r) => r.id).join(", ")}) — contradictory authority`);
    }
  }

  for (const r of records) {
    const tag = r.id ?? "?";
    for (const k of REQUIRED) {
      const v = r[k];
      if (v === undefined || v === null || v === "") fails.push(`${tag}: missing required field '${k}'`);
    }
    if (!r.question && !r.question_hash) fails.push(`${tag}: missing both question and question_hash`);
    for (const k of WARN_ONLY) {
      if (r[k] === undefined || r[k] === null) warns.push(`${tag}: legacy-missing optional '${k}'`);
    }
    // Authority provenance (Fable F2): a `decided` record is ledger authority
    // only if the engine wrote it or it is an explicit override ruling.
    if (r.status === "decided" && r.kind !== "override"
      && r.decided_by?.pipeline !== "scripts/decisions/decide.ts") {
      fails.push(`${tag}: status decided but decided_by.pipeline is '${r.decided_by?.pipeline ?? "absent"}' — hand-written decisions are not authority (use kind: override)`);
    }
    if (r.supersedes && !precIds.has(r.supersedes)) {
      fails.push(`${tag}: supersedes '${r.supersedes}' — resolves nowhere (records + precedents)`);
    }
    if (r.rule_id && ruleIds.size && !ruleIds.has(r.rule_id)) {
      fails.push(`${tag}: cites rule_id '${r.rule_id}' which no longer exists in rules.yaml — stale authority`);
    }
    if (r.precedent?.id && !precIds.has(r.precedent.id)) {
      fails.push(`${tag}: cites precedent '${r.precedent.id}' which resolves nowhere`);
    }
  }

  for (const w of warns) console.log(`WARN  ${w}`);
  for (const f of fails) console.log(`FAIL  ${f}`);
  console.log(`\n${records.length - parseErrors.length}/${files.length} records valid — ${fails.length} failure(s), ${warns.length} warning(s)`);
  if (fails.length) process.exit(1);
}

main();
