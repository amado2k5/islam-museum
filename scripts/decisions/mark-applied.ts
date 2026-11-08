#!/usr/bin/env tsx
/**
 * mark-applied — record that a decided record's outcome was actually applied.
 *
 * Decided-but-unapplied is the metric that matters (Fable F11): a `decided`
 * record nobody acted on is not progress. When a lane applies the engine's
 * ruling (merged the PR, shipped the deploy cadence, wrote the entities),
 * mark it here so digest/audit can count the decided→applied funnel.
 *
 * Usage:
 *   npx tsx scripts/decisions/mark-applied.ts --record dec-20261108-018 \
 *       [--note "merged in PR #1234"] [--by "lane-name"]
 *
 * Build-time tool only.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse, stringify } from "yaml";

const ROOT = process.cwd();
const RECORDS_DIR = join(ROOT, "docs/decisions/records");

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const recordId = arg("--record");
const note = arg("--note");
const by = arg("--by") ?? "unknown";
if (!recordId) {
  console.error("usage: mark-applied.ts --record <dec-id> [--note ...] [--by ...]");
  process.exit(2);
}

let path = join(RECORDS_DIR, `${recordId}.yaml`);
if (!existsSync(path)) {
  const hit = readdirSync(RECORDS_DIR).filter((f) => f.endsWith(".yaml"))
    .find((f) => (parse(readFileSync(join(RECORDS_DIR, f), "utf8")) as { id?: string }).id === recordId);
  if (!hit) { console.error(`no record '${recordId}'`); process.exit(1); }
  path = join(RECORDS_DIR, hit);
}

const rec = parse(readFileSync(path, "utf8")) as Record<string, unknown> & {
  state_chain?: Record<string, unknown>;
};
rec.state_chain = {
  ...(rec.state_chain ?? {}),
  current_state: "applied",
  applied: { at: new Date().toISOString().slice(0, 10), by, note: note ?? null },
};
writeFileSync(path, stringify(rec));
console.log(`${rec.id ?? recordId}: state_chain.current_state = applied${note ? ` (${note})` : ""}`);
