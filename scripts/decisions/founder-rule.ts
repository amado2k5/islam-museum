#!/usr/bin/env tsx
/**
 * founder-rule — record the founder's verdict on a decision record.
 *
 * This is the label stream every calibration metric depends on (Fable Q5/Q7):
 * `founder_resolution` on a record is what turns "the engine decided" into
 * "the engine was right". Without it, agreement rates are unmeasurable.
 *
 * Usage:
 *   npx tsx scripts/decisions/founder-rule.ts --record dec-20261108-014 \
 *       --verdict approved|rejected|held [--note "..."] [--by "founder"]
 *
 * `rejected` does NOT auto-create an override — write one with kind: override
 * + supersedes: when the ruling itself was wrong. This tool only labels.
 * Build-time tool only; nothing on the published site calls it.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse, stringify } from "yaml";

const ROOT = process.cwd();
const RECORDS_DIR = join(ROOT, "docs/decisions/records");
const VERDICTS = new Set(["approved", "rejected", "held"]);

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const recordId = arg("--record");
const verdict = arg("--verdict");
const note = arg("--note");
const by = arg("--by") ?? "founder";

if (!recordId || !verdict || !VERDICTS.has(verdict)) {
  console.error("usage: founder-rule.ts --record <dec-id> --verdict approved|rejected|held [--note ...] [--by ...]");
  process.exit(2);
}

const file = join(RECORDS_DIR, `${recordId}.yaml`);
if (!existsSync(file)) {
  // Records may be named by id; fall back to scanning the id: field.
  const hit = readdirSync(RECORDS_DIR).filter((f) => f.endsWith(".yaml"))
    .find((f) => (parse(readFileSync(join(RECORDS_DIR, f), "utf8")) as { id?: string }).id === recordId);
  if (!hit) { console.error(`no record '${recordId}' in ${RECORDS_DIR}`); process.exit(1); }
  label(join(RECORDS_DIR, hit));
} else {
  label(file);
}

function label(path: string) {
  const rec = parse(readFileSync(path, "utf8")) as Record<string, unknown> & {
    calibration_log?: Record<string, unknown>;
    review_sampled?: boolean;
  };
  rec.calibration_log = {
    ...(rec.calibration_log ?? {}),
    founder_resolution: {
      verdict,
      at: new Date().toISOString().slice(0, 10),
      by,
      note: note ?? null,
    },
  };
  // A founder verdict IS the review — mark the sample so audit rates see it.
  rec.review_sampled = true;
  writeFileSync(path, stringify(rec));
  console.log(`${rec.id ?? path}: founder_resolution = ${verdict}${note ? ` (${note})` : ""}`);
}
