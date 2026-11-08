#!/usr/bin/env tsx
/**
 * decide — the islam.museum autonomous approver (POC, hardened).
 *
 * A deterministic rule engine wrapped around the repository's own rulebook:
 *
 *   0. FOUNDER-RESERVED — the question defers to the founder → docket
 *   1. GATES          — non-delegable list + hard rejects (rules.yaml `gates`)
 *   2. RULES          — canonical repository rules, data-driven from
 *                       docs/decisions/rules.yaml (priority-ordered)
 *   3. PRECEDENT      — BM25 match over mined precedents + the decision ledger
 *                       itself (every `decided` record becomes a precedent —
 *                       the self-improvement loop)
 *   4. SAFE DEFAULT   — conservative reversible hold when nothing matches
 *   5. RECORD         — auditable YAML record + regenerated docket
 *
 * The engine is proposer-agnostic: any AI model can ask it a question
 * (`--question`, stdin JSON, `--batch`), inspect the full trace (`--explain`),
 * consume machine output (`--json`), or propose an action for adjudication
 * (`--advisory`). GenAI models may propose; only this engine disposes — gates
 * cannot be overridden by any proposal, precedent or model.
 *
 * Dry-run by default: prints the record, writes nothing unless --write.
 * Build-time tool only; never called by the site.
 *
 * Usage:
 *   npx tsx scripts/decisions/decide.ts --question q.yaml [--write] [--explain] [--json]
 *   echo '{"question": "..."}' | npx tsx scripts/decisions/decide.ts
 *   echo '{"question":"...","proposed_action":"merge the two records"}' \
 *     | npx tsx scripts/decisions/decide.ts --advisory
 *   npx tsx scripts/decisions/decide.ts --batch docs/decisions/inbox --write
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { parse, stringify } from "yaml";

const ROOT = process.cwd();
const PRECEDENTS = join(ROOT, "docs/decisions/precedents.yaml");
const RULESET = join(ROOT, "docs/decisions/rules.yaml");
const RECORDS_DIR = join(ROOT, "docs/decisions/records");
const DOCKET = join(ROOT, "docs/decisions/docket.md");

// ---------------------------------------------------------------------------
// Ruleset — compiled once from docs/decisions/rules.yaml
// ---------------------------------------------------------------------------

interface GateDef { id: string; pattern: string; reason: string }
interface RuleDef {
  id: string; domain?: string; priority?: number; pattern: string;
  decision: string; cite?: string; confidence: number; reversible: boolean;
}
interface DomainDef { id: string; pattern: string }
interface AutonomousGate { decision: string; confidence: number; reversible: boolean }
interface Ruleset {
  version?: number;
  mode?: "autonomous" | "conservative";
  autonomous?: { founder_reserved?: string; gates?: Record<string, AutonomousGate> };
  founder_reserved?: string;
  gates: { non_delegable: GateDef[]; hard_reject: GateDef[] };
  domains: DomainDef[];
  rules: RuleDef[];
}

let rulesetCache: Ruleset | null = null;
export function loadRuleset(): Ruleset {
  if (rulesetCache) return rulesetCache;
  const doc = parse(readFileSync(RULESET, "utf8")) as Ruleset;
  doc.gates ??= { non_delegable: [], hard_reject: [] };
  doc.domains ??= [];
  doc.rules = (doc.rules ?? []).slice().sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  rulesetCache = doc;
  return doc;
}

// ---------------------------------------------------------------------------
// Question / precedent / record types
// ---------------------------------------------------------------------------

interface Question {
  question: string;
  class?: string;
  lane?: string;
  options?: string[];
  evidence?: string[];
  proposed_action?: string;
  proposed_by?: string;
}

export interface Precedent {
  id: string;
  kind: string;
  title?: string;
  summary: string;
  source_file: string;
}

interface TraceStep { stage: string; result: string; detail?: string; score?: number }

// ---------------------------------------------------------------------------
// Text utilities — tokenizer (Latin + Arabic), BM25, negation-aware matching
// ---------------------------------------------------------------------------

const STOP = new Set(("the a an and or of to in for on is are was were be been it its this that with without as at by from into about should would could can may might must shall will not no yes do does did have has had we you they he she i".split(" ")));

function tokens(s: string): Map<string, number> {
  const tf = new Map<string, number>();
  const hasArabic = /[؀-ۿ]/.test(s);
  const raw = hasArabic
    ? s.split(/\s+/) // Arabic: whitespace-delimited words; no stopword list applies
    : s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/);
  for (const t of raw) {
    const tok = hasArabic ? t.replace(/[ً-ْٰـ]/g, "") : t;
    if (tok.length > 2 && (hasArabic || !STOP.has(tok))) tf.set(tok, (tf.get(tok) ?? 0) + 1);
  }
  return tf;
}

/** Document frequency over the precedent corpus, for BM25 IDF. */
let dfCache: Map<string, number> | null = null;
let N = 0;
function dfOf(corpus: string[]): Map<string, number> {
  if (dfCache) return dfCache;
  dfCache = new Map();
  N = corpus.length;
  for (const doc of corpus) {
    for (const t of new Set(tokens(doc).keys())) dfCache.set(t, (dfCache.get(t) ?? 0) + 1);
  }
  return dfCache;
}

const K1 = 1.2, B = 0.75, K1P1 = K1 + 1;

function bm25(qTf: Map<string, number>, docTf: Map<string, number>, avgLen: number, df: Map<string, number>, docLen: number): number {
  let score = 0;
  const denom = K1 * (1 - B + B * (docLen / Math.max(avgLen, 1)));
  for (const [t, qf] of qTf) {
    const tf = docTf.get(t);
    if (!tf) continue;
    const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
    score += idf * ((tf * K1P1) / (tf + denom)) * qf;
  }
  return score;
}

/** Normalized 0..1 score: BM25 divided by the max possible for this query. */
function normBm25(raw: number, qTf: Map<string, number>, df: Map<string, number>): number {
  let max = 0;
  for (const [t, qf] of qTf) {
    const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
    max += idf * qf * (K1P1 / (1 + K1P1));
  }
  return max > 0 ? raw / max : 0;
}

/** A policy match inside a negated phrase ("not a deploy", "never delete") is not a hit. */
function isNegated(text: string, index: number): boolean {
  const before = text.slice(Math.max(0, index - 48), index).toLowerCase();
  return /(?<![=\w])(not|never|no|without|non-|cannot|can't|don't|doesn't|isn't|aren't)\b[^.;:]{0,40}$/.test(before);
}

/** True when the pattern matches at least once outside a negated context. */
function hits(text: string, pattern: RegExp | string, checkNegation = true): boolean {
  const re = new RegExp(typeof pattern === "string" ? pattern : pattern.source, typeof pattern === "string" ? "i" : (pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g"));
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (!checkNegation || !isNegated(text, m.index)) return true;
    if (m[0] === "") re.lastIndex++;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Corpus — mined precedents + the decision ledger itself
// ---------------------------------------------------------------------------

export function loadMinedPrecedents(): Precedent[] {
  if (!existsSync(PRECEDENTS)) return [];
  const doc = parse(readFileSync(PRECEDENTS, "utf8")) as { precedents?: Precedent[] };
  return doc.precedents ?? [];
}

interface StoredRecord extends Question {
  id?: string; status?: string; step?: string; decision?: string; reason?: string;
  rationale?: string; needs_precedent?: boolean; confidence?: number;
}

function readRecords(): StoredRecord[] {
  if (!existsSync(RECORDS_DIR)) return [];
  const out: StoredRecord[] = [];
  for (const f of readdirSync(RECORDS_DIR).filter((f) => f.endsWith(".yaml")).sort()) {
    try { out.push(parse(readFileSync(join(RECORDS_DIR, f), "utf8")) as StoredRecord); }
    catch { /* skip unreadable record */ }
  }
  return out;
}

/**
 * The self-improvement loop: every record the engine decided (rule, precedent,
 * research — anything but a safe-default hold or a docket item) becomes a
 * precedent for future questions. Held questions (needs_precedent) and
 * non-decisions never become authority.
 */
export function loadLedgerPrecedents(): Precedent[] {
  return readRecords()
    .filter((r) => r.status === "decided" && !r.needs_precedent && r.question && r.decision)
    .map((r) => ({
      id: r.id ?? "ledger",
      kind: "ledger-record",
      title: r.question.slice(0, 140),
      summary: `${r.decision} ${r.rationale ?? ""}`.slice(0, 400),
      source_file: `docs/decisions/records/${r.id}.yaml`,
    }));
}

export function loadPrecedents(): Precedent[] {
  return [...loadMinedPrecedents(), ...loadLedgerPrecedents()];
}

// ---------------------------------------------------------------------------
// Decision
// ---------------------------------------------------------------------------

export function questionHash(q: Question): string {
  const norm = q.question.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, " ").trim();
  return createHash("sha1").update(norm).digest("hex").slice(0, 12);
}

/** Hashes of every question already decided — batch mode skips these (idempotent re-runs). */
function decidedHashes(): Set<string> {
  return new Set(readRecords().filter((r) => r.question).map((r) => questionHash(r)));
}

let seq = 0;
function nextId(): string {
  seq = readRecords().length;
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `dec-${d}-${String(seq + 1).padStart(3, "0")}`;
}

/** First matching domain id, or "fallback". */
export function classifyDomain(text: string, rs: Ruleset = loadRuleset()): string {
  for (const d of rs.domains) {
    if (hits(text, d.pattern, false)) return d.id;
  }
  return "fallback";
}

const PRECEDENT_THRESHOLD = 0.6;
const TITLE_OVERLAP_FLOOR = 0.3;
const PRECEDENT_TOP_N = 3;

export function decide(q: Question, precedents: Precedent[], mode?: "autonomous" | "conservative"): Record<string, unknown> {
  const rs = loadRuleset();
  const m = mode ?? rs.mode ?? "conservative";
  const text = `${q.question} ${(q.options ?? []).join(" ")} ${(q.evidence ?? []).join(" ")} ${q.proposed_action ?? ""}`;
  const domain = classifyDomain(text, rs);
  const trace: TraceStep[] = [{ stage: "domain", result: domain }, { stage: "mode", result: m }];

  // In autonomous mode the engine decides founder-reserved questions like any
  // other; in conservative mode they defer to the docket.
  if (m === "conservative" && rs.founder_reserved && hits(text, rs.founder_reserved)) {
    trace.push({ stage: "founder-reserved", result: "docket", detail: "question explicitly reserves the decision to the founder" });
    return {
      status: "founder-docket", step: "founder-reserved",
      reason: "the question reserves this decision to the founder", domain, trace, mode: m,
      reversible: false,
    };
  }
  trace.push({ stage: "founder-reserved", result: m === "autonomous" ? "auto-decide" : "pass" });

  // Step 1: gates — non-delegable surfaces and hard rejects.
  // Conservative mode → founder docket. Autonomous mode → the engine takes the
  // mapped conservative decision itself (rules.yaml `autonomous.gates`); a gate
  // with no mapping still docks — autonomy never invents authority.
  for (const g of rs.gates.non_delegable) {
    if (hits(text, g.pattern)) {
      const auto = m === "autonomous" ? rs.autonomous?.gates?.[g.id] : undefined;
      if (auto) {
        trace.push({ stage: "policy-gate", result: `${g.id}→autonomous`, detail: g.reason });
        return {
          status: "decided", step: "autonomous-override",
          decision: auto.decision, gate: g.id, domain, mode: m, trace,
          confidence: auto.confidence, reversible: auto.reversible,
          rationale: `Gate ${g.id} would dock in conservative mode; autonomous mode applies the engine's conservative decision. Gate reason: ${g.reason}.`,
        };
      }
      trace.push({ stage: "policy-gate", result: g.id, detail: g.reason });
      return {
        status: "founder-docket", step: "policy-gate", reason: g.reason,
        gate: g.id, domain, trace, mode: m, reversible: false,
      };
    }
  }
  for (const g of rs.gates.hard_reject) {
    if (hits(text, g.pattern)) {
      trace.push({ stage: "hard-reject", result: g.id, detail: g.reason });
      return {
        status: "rejected", step: "hard-reject", reason: g.reason,
        gate: g.id, domain, trace, mode: m, reversible: false,
      };
    }
  }
  trace.push({ stage: "gates", result: "pass" });

  // Step 2: canonical rules — the repository already answers these.
  // Negation guard OFF: "no source attests X" is evidence, not a negated decision.
  for (const r of rs.rules) {
    if (hits(text, r.pattern, false)) {
      trace.push({ stage: "rule", result: r.id, detail: r.cite });
      return {
        status: "decided", step: "rule",
        decision: r.decision, rule: r.cite, rule_id: r.id, domain, mode: m,
        confidence: r.confidence, reversible: r.reversible,
        rationale: `Answered by a standing repository rule (${r.id}): ${r.cite}.`,
        trace,
      };
    }
  }
  trace.push({ stage: "rules", result: "no-match", detail: `${rs.rules.length} rules evaluated` });

  // Step 3: precedent match — BM25 over ruling/decision-record/ledger titles+summaries.
  // `flag` entries are observations, never authority. Gates: normalized score
  // >= 0.6 AND title token overlap >= 0.3 — stops vague same-topic matches.
  const rulingDocs = precedents.filter((p) => p.kind !== "flag");
  const bodyDocs = rulingDocs.map((p) => `${p.title ?? ""} ${p.summary}`);
  const df = dfOf(bodyDocs);
  const allLens = bodyDocs.map((d) => [...tokens(d).values()].reduce((a, b) => a + b, 0));
  const avgLen = allLens.reduce((a, b) => a + b, 0) / Math.max(allLens.length, 1);
  const qTf = tokens(text);

  const overlap = (a: Map<string, number>, b: Map<string, number>) => {
    let inter = 0;
    for (const t of a.keys()) if (b.has(t)) inter++;
    const amin = Math.min(a.size, b.size);
    return amin ? inter / amin : 0;
  };

  const scored = rulingDocs.map((p, i) => {
    const tTf = tokens(p.title ?? "");
    const bTf = tokens(`${p.title ?? ""} ${p.summary}`);
    const tLen = [...tTf.values()].reduce((a, b) => a + b, 0);
    const titleScore = normBm25(bm25(qTf, tTf, avgLen, df, tLen), qTf, df);
    const bodyScore = normBm25(bm25(qTf, bTf, avgLen, df, allLens[i]), qTf, df);
    return {
      p, titleScore, bodyScore,
      titleOverlap: overlap(qTf, tTf),
      score: Math.max(titleScore, bodyScore * 0.9),
    };
  }).sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternatives = scored.slice(0, PRECEDENT_TOP_N).map((s) => ({
    id: s.p.id, kind: s.p.kind, score: Number(s.score.toFixed(3)),
    title_overlap: Number(s.titleOverlap.toFixed(3)),
    title: (s.p.title ?? s.p.summary).slice(0, 100),
  }));

  if (best && best.score >= PRECEDENT_THRESHOLD && best.titleOverlap >= TITLE_OVERLAP_FLOOR) {
    trace.push({ stage: "precedent", result: best.p.id, score: Number(best.score.toFixed(3)), detail: `overlap ${best.titleOverlap.toFixed(2)}` });
    return {
      status: "decided", step: "precedent",
      decision: `apply precedent ${best.p.id} (${best.p.kind}): ${best.p.title ?? best.p.summary.slice(0, 80)}`,
      precedent: { id: best.p.id, source_file: best.p.source_file, score: Number(best.score.toFixed(3)), title_score: Number(best.titleScore.toFixed(3)) },
      alternatives, domain,
      confidence: Math.min(0.95, 0.5 + best.score), reversible: true, mode: m,
      rationale: `Question overlaps precedent ${best.p.id} recorded in ${best.p.source_file}. Conservative application; founder audits the sample.`,
      trace,
    };
  }
  trace.push({
    stage: "precedent", result: "no-match",
    detail: best ? `best ${best.p.id} score ${best.score.toFixed(2)} overlap ${best.titleOverlap.toFixed(2)} below gates` : "empty corpus",
  });

  // Step 4: no rule, no precedent → conservative reversible default.
  // The default NEVER escalates review status, deletes, or asserts a contested fact.
  return {
    status: "decided", step: "safe-default",
    decision: "hold as draft-tier / pointer-only; record question in lane progress file for the next precedent-extraction pass",
    confidence: 0.4, reversible: true, domain, mode: m, alternatives, trace,
    rationale: "No rule or precedent matched. Defaulting to the most conservative reversible action per the decision-ledger design.",
    needs_precedent: true,
  };
}

// ---------------------------------------------------------------------------
// Records, docket, advisory verdicts
// ---------------------------------------------------------------------------

function toYamlRecord(id: string, q: Question, d: Record<string, unknown>): string {
  const esc = (s: unknown) => JSON.stringify(String(s ?? ""));
  const lines = [
    `id: ${id}`,
    `date: "${new Date().toISOString().slice(0, 10)}"`,
    `question_hash: ${questionHash(q)}`,
    `lane: ${esc(q.lane ?? "poc")}`,
    `class: ${esc(q.class ?? "uncategorised")}`,
    `domain: ${esc(d.domain ?? "fallback")}`,
    `mode: ${esc(d.mode ?? "conservative")}`,
    `question: ${esc(q.question)}`,
    `options:`,
    ...(q.options ?? []).map((o) => `  - ${esc(o)}`),
    ...(q.evidence?.length ? [`evidence:`, ...q.evidence.map((e) => `  - ${esc(e)}`)] : []),
    `status: ${d.status}`,
    `step: ${d.step}`,
    `decision: ${esc(d.decision ?? d.reason)}`,
    `confidence: ${d.confidence ?? "n/a"}`,
    `reversible: ${d.reversible}`,
    `rationale: ${esc(d.rationale ?? "")}`,
  ];
  if (d.rule) lines.push(`rule: ${esc(d.rule)}`);
  if (d.rule_id) lines.push(`rule_id: ${esc(d.rule_id)}`);
  if (d.gate) lines.push(`gate: ${esc(d.gate)}`);
  if (d.precedent) lines.push(`precedent:`, `  id: ${esc((d.precedent as { id: string }).id)}`, `  source_file: ${esc((d.precedent as { source_file: string }).source_file)}`, `  score: ${(d.precedent as { score: number }).score}`);
  if (d.judge_evidence) lines.push(`judge_evidence:`, ...(d.judge_evidence as string[]).map((e) => `  - ${esc(e)}`));
  if (d.engine_hold) lines.push(`engine_hold: ${esc(d.engine_hold)}`);
  if (d.needs_precedent) lines.push(`needs_precedent: true`);
  lines.push(`review_sampled: false`, `decided_by:`, `  agent: poc-decide`, `  pipeline: scripts/decisions/decide.ts`, `  ruleset: docs/decisions/rules.yaml`);
  return lines.join("\n") + "\n";
}

/** Regenerate the docket from ALL records on disk — the current state, not just this run. */
function writeDocket() {
  const all = readRecords();
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
    lines.push(`## ${r.id} — ${r.question}`, "", `- status: \`${r.status}\``, `- step: \`${r.step ?? "?"}\``, `- domain: \`${(r as { domain?: string }).domain ?? "?"}\``, `- reason: ${r.decision ?? r.reason ?? ""}`, "");
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

/**
 * Advisory verdict — the proposer/disposer contract. Any AI model may submit
 * {question, proposed_action}; the engine returns its authoritative decision and
 * whether the proposal is permitted. The engine NEVER defers to the proposer:
 * gates and hard-rejects deny outright; a decided verdict carries the engine's
 * own answer so the proposer gets a usable response either way.
 */
export function advisory(q: Question, precedents: Precedent[], mode?: "autonomous" | "conservative"): Record<string, unknown> {
  const d = decide(q, precedents, mode);
  const status = String(d.status);
  const step = String(d.step);
  // autonomous-override means the engine substituted its own conservative
  // decision for a gated proposal — the literal proposal is not permitted,
  // but a safe path exists: verdict "redirect".
  const verdict =
    status === "rejected" ? "deny"
    : status === "founder-docket" ? "route-to-founder"
    : step === "autonomous-override" ? "redirect"
    : "allow";
  return {
    verdict,
    proposed_by: q.proposed_by ?? "unknown",
    engine_decision: d,
    note: verdict === "allow"
      ? "Proposal is within autonomous scope. Apply the engine_decision verbatim; it cites the governing rule or precedent."
      : verdict === "redirect"
        ? "The proposed action touches a gated surface — do NOT proceed as proposed. Apply the engine_decision's conservative alternative instead."
        : verdict === "deny"
          ? "Proposal violates a hard rule — do not proceed under any framing."
          : "Proposal touches a non-delegable surface — escalate to the founder docket; do not proceed.",
  };
}

// ---------------------------------------------------------------------------
// Judge tier — optional GenAI advisor for held questions (build-time only).
//
// Architecture (AI-control pattern: untrusted proposer, trusted monitor —
// Greenblatt et al. 2024; SafeChain guardian design): the deterministic engine
// above is the trusted monitor; a GenAI model may be plugged in as an
// UNTRUSTED advisor that only ever produces status "recommended" records —
// never "decided". Its output is evidence for async audit, not authority.
//
// Two transports, both optional, both build-time only:
//   DECIDE_JUDGE_CMD  — shell command; receives the question payload as JSON on
//                       stdin, must print a JSON object on stdout:
//                       {recommendation, confidence?, evidence?[], rationale?}
//                       e.g. DECIDE_JUDGE_CMD="ollama run qwen3:32b"
//   DECIDE_JUDGE_URL  — OpenAI-compatible chat endpoint (Ollama, LM Studio):
//                       POST {model: DECIDE_JUDGE_MODEL ?? "local", messages:
//                       [system, user(payload)]} → parses the JSON reply.
// ---------------------------------------------------------------------------

interface JudgeResult { recommendation: string; confidence?: number; evidence?: string[]; rationale?: string }

function judgePayload(q: Question, d: Record<string, unknown>): string {
  return JSON.stringify({
    task: "You are advising an autonomous decision engine for islam.museum, a trilingual museum knowledge graph. A question reached the safe-default hold. Recommend the most conservative reversible answer consistent with the repository's rules (Arabic-first, sources cited, no invented dates, Sunni-first labelled perspectives, no verdicts, CC0 data). Reply with ONLY a JSON object: {\"recommendation\": string, \"confidence\": 0-1, \"evidence\": [strings], \"rationale\": string}.",
    question: q.question,
    lane: q.lane,
    domain: d.domain,
    alternatives: d.alternatives ?? [],
  });
}

function parseJudgeJson(text: string): JudgeResult | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const j = JSON.parse(m[0]) as JudgeResult;
    return j.recommendation ? j : null;
  } catch { return null; }
}

async function consultJudge(q: Question, d: Record<string, unknown>): Promise<JudgeResult | null> {
  const payload = judgePayload(q, d);
  try {
    if (process.env.DECIDE_JUDGE_CMD) {
      const { execFileSync } = await import("node:child_process");
      const [cmd, ...args] = process.env.DECIDE_JUDGE_CMD.split(" ");
      const out = execFileSync(cmd, [...args, payload], { encoding: "utf8", timeout: 300_000, maxBuffer: 4 * 1024 * 1024 });
      return parseJudgeJson(out);
    }
    if (process.env.DECIDE_JUDGE_URL) {
      const res = await fetch(process.env.DECIDE_JUDGE_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: process.env.DECIDE_JUDGE_MODEL ?? "local",
          messages: [
            { role: "system", content: "Reply with ONLY a JSON object, no prose." },
            { role: "user", content: payload },
          ],
        }),
      });
      const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return parseJudgeJson(j.choices?.[0]?.message?.content ?? "");
    }
  } catch { /* judge unavailable — the hold stands */ }
  return null;
}

/** If a judge is configured and the engine held the question, upgrade the hold
 *  to a "recommended" record carrying the model's advice + evidence. The engine
 *  verdict stays safe-default underneath — the recommendation is advisory only. */
async function maybeJudge(q: Question, d: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (d.step !== "safe-default" || (!process.env.DECIDE_JUDGE_CMD && !process.env.DECIDE_JUDGE_URL)) return d;
  const j = await consultJudge(q, d);
  if (!j) return d;
  return {
    ...d,
    status: "recommended",
    step: "judge",
    decision: j.recommendation,
    confidence: j.confidence ?? 0.5,
    rationale: `GenAI advisor recommendation (${process.env.DECIDE_JUDGE_MODEL ?? process.env.DECIDE_JUDGE_CMD ?? "endpoint"}) — advisory only, awaits async audit: ${j.rationale ?? ""}`,
    judge_evidence: j.evidence ?? [],
    engine_hold: "safe-default preserved underneath; the recommendation does not decide",
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const explain = args.includes("--explain");
  const json = args.includes("--json");
  const isAdvisory = args.includes("--advisory");
  const mi = args.indexOf("--mode");
  const cliMode = (mi >= 0 ? args[mi + 1] : undefined) as "autonomous" | "conservative" | undefined;
  const precedents = loadPrecedents();

  const emit = (id: string, q: Question, d: Record<string, unknown>) => {
    if (json) {
      console.log(JSON.stringify({ id, question_hash: questionHash(q), ...d }, null, 2));
      return;
    }
    const yaml = toYamlRecord(id, q, d);
    if (explain && Array.isArray(d.trace)) {
      console.log(`# trace: ${stringify(d.trace).trim()}`);
    }
    console.log(write ? `# wrote docs/decisions/records/${id}.yaml` : `# dry run — record ${id} (use --write to save)`);
    console.log(yaml);
  };

  const batchIdx = args.indexOf("--batch");
  if (batchIdx >= 0) {
    const dir = args[batchIdx + 1] ?? join(ROOT, "docs/decisions/inbox");
    const files = readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
    const seen = decidedHashes();
    const results: { id: string; q: Question; d: Record<string, unknown> }[] = [];
    for (const f of files) {
      let q: Question;
      try {
        q = parse(readFileSync(join(dir, f), "utf8")) as Question;
      } catch (e) {
        console.log(`skip (unparseable)  ${f}: ${(e as Error).message.slice(0, 80)}`);
        continue;
      }
      if (!q.question) { console.log(`skip (no question)  ${f}`); continue; }
      if (seen.has(questionHash(q))) {
        console.log(`skip (already decided)  ${f}`);
        continue;
      }
      let d = isAdvisory ? advisory(q, precedents, cliMode) : decide(q, precedents, cliMode);
      if (!isAdvisory) d = await maybeJudge(q, d);
      const id = nextId();
      if (write && !isAdvisory) {
        mkdirSync(RECORDS_DIR, { recursive: true });
        writeFileSync(join(RECORDS_DIR, `${id}.yaml`), toYamlRecord(id, q, d));
      }
      results.push({ id, q, d });
      const head = isAdvisory ? String(d.verdict) : `${d.status}/${d.step}`;
      console.log(`${id}  ${head.padEnd(24)} ${q.question.slice(0, 90)}`);
    }
    if (write && !isAdvisory) writeDocket();
    const counts = results.reduce<Record<string, number>>((a, r) => {
      const k = isAdvisory ? String(r.d.verdict) : `${r.d.status}/${r.d.step}`;
      a[k] = (a[k] ?? 0) + 1; return a;
    }, {});
    console.log(`\n${results.length} questions → ${JSON.stringify(counts)}${write && !isAdvisory ? " (records + docket.md written)" : " (dry run)"}`);
    return;
  }

  const qi = args.indexOf("--question");
  let q: Question;
  if (qi >= 0 && args[qi + 1]) {
    q = parse(readFileSync(args[qi + 1], "utf8")) as Question;
  } else {
    const chunks: Buffer[] = [];
    for await (const c of process.stdin) chunks.push(c as Buffer);
    const raw = Buffer.concat(chunks).toString("utf8");
    q = raw.trim().startsWith("{") ? (JSON.parse(raw) as Question) : (parse(raw) as Question);
  }
  if (!q.question) { console.error("question required"); process.exit(2); }

  let d = isAdvisory ? advisory(q, precedents, cliMode) : decide(q, precedents, cliMode);
  if (!isAdvisory) d = await maybeJudge(q, d);
  const id = nextId();

  if (write && !isAdvisory) {
    mkdirSync(RECORDS_DIR, { recursive: true });
    writeFileSync(join(RECORDS_DIR, `${id}.yaml`), toYamlRecord(id, q, d));
    console.log(`wrote docs/decisions/records/${id}.yaml — status: ${d.status}`);
  } else {
    emit(id, q, d);
  }
}

if (process.argv[1]?.endsWith("decide.ts")) main();
