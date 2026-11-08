#!/usr/bin/env tsx
/**
 * seed-inbox — convert precedent "Question:" entries into inbox YAML files so
 * real lane questions flow through the engine (pilot seeding).
 *
 * Only NON-authority precedents are seeded (agent-proposed-pending / unlabeled):
 * authority precedents already have rulings — re-asking them tests nothing.
 * Dedupes by question_hash against existing inbox files and records.
 *
 * Usage: npx tsx scripts/decisions/seed-inbox.ts [--write]
 *   default: dry run listing what would be seeded
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { questionHash, type Question } from "./decide";

const ROOT = process.cwd();
const PRECEDENTS = join(ROOT, "docs/decisions/precedents.yaml");
const INBOX = join(ROOT, "docs/decisions/inbox");
const RECORDS = join(ROOT, "docs/decisions/records");
const AUTHORITY = new Set(["founder-ruled", "founder-ruled-ai-assisted", "agent-ruled-delegated"]);

function extractQuestion(summary: string): string | null {
  const m = summary.match(/Question:\s*(.{15,500}?\?)/);
  return m ? m[1].replace(/\*\*/g, "").trim() : null;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

// Hashes already represented: existing inbox questions + decided records.
const taken = new Set<string>();
for (const dir of [INBOX, RECORDS]) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
    try {
      const doc = parse(readFileSync(join(dir, f), "utf8")) as Question & { question?: string };
      if (doc.question) taken.add(questionHash(doc));
    } catch { /* skip unparseable */ }
  }
}

const doc = parse(readFileSync(PRECEDENTS, "utf8")) as { precedents: { id: string; provenance_status?: string; summary?: string; source_file?: string }[] };
const write = process.argv.includes("--write");
let seeded = 0, skippedAuth = 0, skippedDup = 0;

for (const p of doc.precedents) {
  if (p.provenance_status && AUTHORITY.has(p.provenance_status)) { skippedAuth++; continue; }
  const q = extractQuestion(p.summary ?? "");
  if (!q) continue;
  const h = questionHash({ question: q });
  if (taken.has(h)) { skippedDup++; continue; }
  taken.add(h);
  const file = join(INBOX, `seed-${slug(q)}.yaml`);
  const body = [
    `question: ${JSON.stringify(q)}`,
    `lane: seed`,
    `modality: repo`,
    `class: uncategorised`,
    `seeded_from: "${p.id} (${p.source_file ?? "?"})"`,
    ``,
  ].join("\n");
  if (write) { writeFileSync(file, body); seeded++; }
  else console.log(`would seed ${p.id}: ${q.slice(0, 80)}`);
}

console.log(`${write ? `seeded ${seeded}` : "dry run"} inbox files — skipped ${skippedAuth} authority, ${skippedDup} duplicates`);
