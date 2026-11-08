#!/usr/bin/env tsx
/**
 * decide — POC pilot of the autonomous decision pipeline.
 *
 * Given a decision question (a YAML file or stdin JSON), runs:
 *   1. RULE CHECK   — deterministic rules (non-delegable list, hard blocks)
 *   2. PRECEDENT    — similarity match against docs/decisions/precedents.yaml
 *   3. DEFAULT      — conservative reversible action when no precedent matches
 *   4. RECORD       — writes a decision record to docs/decisions/records/
 *
 * Dry-run by default: prints the record, writes nothing unless --write.
 * Build-time tool only; never called by the site.
 *
 * Usage:
 *   npx tsx scripts/decisions/decide.ts --question question.yaml [--write]
 *   echo '{"question": "...", "class": "..."}' | npx tsx scripts/decisions/decide.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { parse } from "yaml";

const ROOT = process.cwd();
const PRECEDENTS = join(ROOT, "docs/decisions/precedents.yaml");
const RECORDS_DIR = join(ROOT, "docs/decisions/records");

/** Decisions an agent may never take autonomously, whatever the evidence. */
const NON_DELEGABLE = [
  { pattern: /deploy|publish to production|dns|r2 sync/i, reason: "deploys are founder-only (cost + control)" },
  { pattern: /delete|remove entity|drop table|purge/i, reason: "destructive operations are never autonomous" },
  { pattern: /spend|purchase|buy|subscribe|payment/i, reason: "money is never autonomous" },
  { pattern: /outreach|send email|submit|file application|nomination/i, reason: "external communications are founder-only" },
  { pattern: /license.{0,20}(change|new license)|licence.{0,20}(change|new licence)/i, reason: "licence changes are submission-impacting" },
  { pattern: /verified|reviewed status|review status|mark.{0,40}published|escalat.{0,20}review/i, reason: "review-status escalation is founder/pipeline only" },
  { pattern: /terrorist|extremist|isis|al-qaeda|hamas|taliban|boko haram/i, reason: "content-safety hard block — always founder" },
  { pattern: /quran|qur'an|tafsir text|ayah/i, reason: "Qur'an text is never agent-decided" },
  { pattern: /schema\/predicates|robots\.txt|_headers|wrangler|workflow|deploy\.yml/i, reason: "governance surfaces (schema, headers, infra, CI) are founder-only" },
  { pattern: /commission|purchase|subscribe|payment|contract|partnership|nomination/i, reason: "commissions, money and external commitments are founder-only" },
];

/** Hard blocks that reject outright regardless of precedent. */
const HARD_REJECT = [
  { pattern: /figurative|portrait|depiction of (the )?prophet/i, reason: "no figurative depictions of prophets (licence rule)" },
  { pattern: /honorific|صلى الله عليه/i, reason: "no typed honorifics" },
];

interface Question {
  question: string;
  class?: string;
  lane?: string;
  options?: string[];
  evidence?: string[];
}

export interface Precedent {
  id: string;
  kind: string;
  title?: string;
  summary: string;
  source_file: string;
}

const STOP = new Set(("the a an and or of to in for on is are was were be been it its this that with without as at by from into about should would could can may might must shall will not no yes do does did have has had we you they he she i".split(" ")));

function tokens(s: string): Set<string> {
  return new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t)));
}

function similarity(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / Math.min(a.size, b.size); // overlap coefficient: partial matches count
}

function loadPrecedents(): Precedent[] {
  const doc = parse(readFileSync(PRECEDENTS, "utf8")) as { precedents?: Precedent[] };
  return doc.precedents ?? [];
}

export function questionHash(q: Question): string {
  const norm = q.question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return createHash("sha1").update(norm).digest("hex").slice(0, 12);
}

/** Hashes of every question already decided — batch mode skips these (idempotent re-runs). */
function decidedHashes(): Set<string> {
  const dir = existsSync(RECORDS_DIR) ? RECORDS_DIR : "";
  const out = new Set<string>();
  if (!dir) return out;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
    try {
      const r = parse(readFileSync(join(dir, f), "utf8")) as Question;
      if (r.question) out.add(questionHash(r));
    } catch { /* skip unreadable record */ }
  }
  return out;
}

let seq = 0;
function nextId(): string {
  const existing = existsSync(RECORDS_DIR) ? readdirSync(RECORDS_DIR).filter((f) => f.endsWith(".yaml")) : [];
  seq = existing.length;
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `dec-${d}-${String(seq + 1).padStart(3, "0")}`;
}

/** A policy match inside a negated phrase ("not a deploy", "never delete") is not a hit. */
function isNegated(text: string, index: number): boolean {
  const before = text.slice(Math.max(0, index - 48), index).toLowerCase();
  return /\b(not|never|no|without|non-|cannot|can't|don't|doesn't|isn't|aren't)\b[^.;:]{0,40}$/.test(before);
}

/** True when the pattern matches at least once outside a negated context. */
function hits(text: string, pattern: RegExp): boolean {
  const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (!isNegated(text, m.index)) return true;
    if (m[0] === "") re.lastIndex++;
  }
  return false;
}

export function decide(q: Question, precedents: Precedent[]): Record<string, unknown> {
  const text = `${q.question} ${(q.options ?? []).join(" ")} ${(q.evidence ?? []).join(" ")}`;

  // Step 0: non-delegable and hard-reject checks — deterministic, no precedent can override.
  for (const r of NON_DELEGABLE) {
    if (hits(text, r.pattern)) {
      return {
        status: "founder-docket",
        reason: r.reason,
        step: "policy-gate",
        reversible: false,
      };
    }
  }
  for (const r of HARD_REJECT) {
    if (hits(text, r.pattern)) {
      return { status: "rejected", reason: r.reason, step: "hard-reject", reversible: false };
    }
  }

  // Step 1: precedent match. Only rulings count: `flag` entries are observations
  // ("X is unmeasured"), not decisions, and matching them produces false authority.
  const qTokens = tokens(text);
  const scored = precedents
    .filter((p) => p.kind !== "flag")
    .map((p) => ({ p, score: similarity(qTokens, tokens(`${p.title ?? ""} ${p.summary}`)) }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];
  const PRECEDENT_THRESHOLD = 0.4;

  if (best && best.score >= PRECEDENT_THRESHOLD) {
    return {
      status: "decided",
      step: "precedent",
      decision: `apply precedent ${best.p.id} (${best.p.kind}): ${best.p.title ?? best.p.summary.slice(0, 80)}`,
      precedent: { id: best.p.id, source_file: best.p.source_file, score: Number(best.score.toFixed(3)) },
      confidence: Math.min(0.95, 0.5 + best.score),
      reversible: true,
      rationale: `Question overlaps precedent ${best.p.id} recorded in ${best.p.source_file}. Conservative application; founder audits the sample.`,
    };
  }

  // Step 2: no rule, no precedent → conservative reversible default.
  // The default NEVER escalates review status, deletes, or asserts a contested fact.
  return {
    status: "decided",
    step: "safe-default",
    decision: "hold as draft-tier / pointer-only; record question in lane progress file for the next precedent-extraction pass",
    confidence: 0.4,
    reversible: true,
    rationale: "No rule or precedent matched. Defaulting to the most conservative reversible action per the decision-ledger design.",
    needs_precedent: true,
  };
}

function toYamlRecord(id: string, q: Question, d: Record<string, unknown>): string {
  const esc = (s: unknown) => JSON.stringify(String(s ?? ""));
  const lines = [
    `id: ${id}`,
    `date: "${new Date().toISOString().slice(0, 10)}"`,
    `question_hash: ${questionHash(q)}`,
    `lane: ${esc(q.lane ?? "poc")}`,
    `class: ${esc(q.class ?? "uncategorised")}`,
    `question: ${esc(q.question)}`,
    `options:`,
    ...(q.options ?? []).map((o) => `  - ${esc(o)}`),
    `status: ${d.status}`,
    `step: ${d.step}`,
    `decision: ${esc(d.decision ?? d.reason)}`,
    `confidence: ${d.confidence ?? "n/a"}`,
    `reversible: ${d.reversible}`,
    `rationale: ${esc(d.rationale ?? "")}`,
  ];
  if (d.precedent) lines.push(`precedent:`, `  id: ${esc((d.precedent as { id: string }).id)}`, `  source_file: ${esc((d.precedent as { source_file: string }).source_file)}`, `  score: ${(d.precedent as { score: number }).score}`);
  if (d.needs_precedent) lines.push(`needs_precedent: true`);
  lines.push(`review_sampled: false`, `decided_by:`, `  agent: poc-decide`, `  pipeline: scripts/decisions/decide.ts`);
  return lines.join("\n") + "\n";
}

const DOCKET = join(ROOT, "docs/decisions/docket.md");

interface StoredRecord extends Question { id?: string; status?: string; step?: string; decision?: string; reason?: string; needs_precedent?: boolean }

/** Regenerate the docket from ALL records on disk — the current state, not just this run. */
function writeDocket() {
  const dir = existsSync(RECORDS_DIR) ? RECORDS_DIR : "";
  const all: StoredRecord[] = dir
    ? readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort()
        .map((f) => parse(readFileSync(join(dir, f), "utf8")) as StoredRecord)
    : [];
  const open = all.filter((r) => r.status === "founder-docket" || r.status === "rejected");
  const held = all.filter((r) => r.status === "decided" && r.needs_precedent);
  const lines = [
    "# Founder docket — decisions awaiting the founder",
    "",
    "Generated by `npx tsx scripts/decisions/decide.ts --batch docs/decisions/inbox`.",
    "Lanes drop questions in `docs/decisions/inbox/*.yaml`; the pipeline answers what it can",
    "by rule or precedent and lists only what genuinely needs the founder here.",
    "",
    `Last run: ${new Date().toISOString()} — ${open.length} item(s) need the founder, ${held.length} held pending a precedent, ${all.length} record(s) total.`,
    "",
    "## Needs the founder",
    "",
  ];
  for (const r of open) {
    lines.push(`## ${r.id} — ${r.question}`, "", `- status: \`${r.status}\``, `- reason: ${r.decision ?? r.reason ?? ""}`, "");
  }
  if (!open.length) lines.push("_Nothing awaiting the founder._", "");
  lines.push("## Held at the safe default (a precedent would unblock these)", "");
  for (const r of held) {
    lines.push(`- ${r.id} — ${r.question}`);
  }
  if (!held.length) lines.push("_None._");
  lines.push("");
  writeFileSync(DOCKET, lines.join("\n"));
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const batchIdx = args.indexOf("--batch");
  if (batchIdx >= 0) {
    const dir = args[batchIdx + 1] ?? join(ROOT, "docs/decisions/inbox");
    const { readdirSync } = await import("node:fs");
    const files = readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
    const precedents = existsSync(PRECEDENTS) ? loadPrecedents() : [];
    const seen = decidedHashes();
    const results: { id: string; q: Question; d: Record<string, unknown> }[] = [];
    for (const f of files) {
      const q = parse(readFileSync(join(dir, f), "utf8")) as Question;
      if (!q.question) continue;
      if (seen.has(questionHash(q))) {
        console.log(`skip (already decided)  ${f}`);
        continue;
      }
      const d = decide(q, precedents);
      const id = nextId();
      if (write) {
        mkdirSync(RECORDS_DIR, { recursive: true });
        writeFileSync(join(RECORDS_DIR, `${id}.yaml`), toYamlRecord(id, q, d));
      }
      results.push({ id, q, d });
      console.log(`${id}  ${String(d.status).padEnd(15)} ${String(d.step).padEnd(12)} ${q.question.slice(0, 90)}`);
    }
    if (write) writeDocket();
    const counts = results.reduce<Record<string, number>>((a, r) => { a[String(r.d.status)] = (a[String(r.d.status)] ?? 0) + 1; return a; }, {});
    console.log(`\n${results.length} questions → ${JSON.stringify(counts)}${write ? " (records + docket.md written)" : " (dry run)"}`);
    return;
  }
  const qi = args.indexOf("--question");
  let q: Question;
  if (qi >= 0 && args[qi + 1]) {
    q = parse(readFileSync(args[qi + 1], "utf8")) as Question;
  } else {
    const chunks: Buffer[] = [];
    for await (const c of process.stdin) chunks.push(c as Buffer);
    q = JSON.parse(Buffer.concat(chunks).toString("utf8")) as Question;
  }
  if (!q.question) { console.error("question required"); process.exit(2); }

  const precedents = existsSync(PRECEDENTS) ? loadPrecedents() : [];
  const d = decide(q, precedents);
  const id = nextId();
  const yaml = toYamlRecord(id, q, d);

  if (write) {
    mkdirSync(RECORDS_DIR, { recursive: true });
    writeFileSync(join(RECORDS_DIR, `${id}.yaml`), yaml);
    console.log(`wrote docs/decisions/records/${id}.yaml — status: ${d.status}`);
  } else {
    console.log(`# dry run — record ${id} (use --write to save)`);
    console.log(yaml);
  }
}

if (process.argv[1]?.endsWith("decide.ts")) main();
