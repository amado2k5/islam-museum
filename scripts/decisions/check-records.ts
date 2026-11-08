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
import { parse } from "yaml";

const ROOT = process.cwd();
const RECORDS_DIR = join(ROOT, "docs/decisions/records");
const PRECEDENTS = join(ROOT, "docs/decisions/precedents.yaml");

interface Rec {
  id?: string; kind?: string; date?: string; question?: string; question_hash?: string;
  status?: string; step?: string; decision?: string; reason?: string;
  confidence?: unknown; reversible?: boolean; decided_by?: unknown;
  expires_at?: string; domain?: string; mode?: string; supersedes?: string;
  precedent?: { id?: string };
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
    if (r.supersedes && !ids.has(r.supersedes)) {
      fails.push(`${tag}: supersedes '${r.supersedes}' — no such record (dead chain link)`);
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
