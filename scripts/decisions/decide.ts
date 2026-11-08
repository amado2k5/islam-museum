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
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
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
  /** Domains where autonomous gate-mapping is allowed even in autonomous mode.
   *  Fail-closed: unlisted domains dock. Promotion is per-domain, earned by
   *  calibration evidence — never a global switch (Fable Q6/F8). */
  safe_proceed?: Record<string, boolean>;
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

export interface Question {
  question: string;
  class?: string;
  lane?: string;
  modality?: "book" | "website" | "video" | "audio" | "repo" | "other";
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
  /** Muse §2: a proposal is not a precedent — only founder-ruled* entries may decide. */
  provenance_status?: "founder-ruled" | "founder-ruled-ai-assisted" | "agent-ruled-delegated" | "agent-proposed-pending" | "agent-proposed-rejected" | "reverted" | "ledger-decided" | "ledger-override" | "unlabeled";
  supersedes?: string;
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

/** A policy match inside a tight negated phrase ("not a deploy", "never delete")
 *  is not a hit. The negation cue must sit immediately before the match (allowing
 *  only "going to"-style interveners): "do not hesitate to delete" is an
 *  imperative, not a negation, and must still fire the gate. */
function isNegated(text: string, index: number): boolean {
  const before = text.slice(Math.max(0, index - 48), index).toLowerCase();
  return /\b(?:not|never|no|cannot|can't|don't|doesn't|isn't|aren't|won't|wouldn't|shouldn't)\s+(?:(?:going|about|planning)\s+to\s+)?(?:a|an|the|this|that|any)?\s*$/.test(before);
}

/** True when the pattern matches at least once outside a negated context. */
function hits(text: string, pattern: RegExp | string, checkNegation = true): boolean {
  // String patterns (from rules.yaml) need BOTH i and g: without /g, exec()
  // never advances lastIndex and a negated first match loops forever.
  const src = typeof pattern === "string" ? pattern : pattern.source;
  const flags = typeof pattern === "string"
    ? "gi"
    : pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
  const re = new RegExp(src, flags);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (!checkNegation || !isNegated(text, m.index)) return true;
    if (m[0] === "") re.lastIndex++;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Semantic layer — optional hybrid precedent retrieval (BM25 + embeddings).
//
// Dense vectors rescue lexical misses (transliteration variants, paraphrased
// questions) but are kept honest by a dual-path gate: the semantic path still
// requires title-token overlap >= 0.25, so embeddings cannot smuggle in a
// same-topic/different-question match (negation and count tokens survive).
// Vectors come from a local OpenAI-compatible embeddings endpoint (Ollama
// /api/embeddings); the corpus cache lives in docs/decisions/.embeddings-*.json
// so only new/changed precedents are embedded. DECIDE_HYBRID=0 disables.
// ---------------------------------------------------------------------------

export interface SemanticContext {
  model: string;
  /** precedent id → L2-normalized embedding */
  vecs: Map<string, number[]>;
  queryVec: number[] | null;
}

const EMBED_URL = () => process.env.DECIDE_EMBED_URL ?? "http://localhost:11434";
const EMBED_MODEL = () => process.env.DECIDE_EMBED_MODEL ?? "qwen3-embedding:0.6b";
const EMB_CACHE = () => join(ROOT, `docs/decisions/.embeddings-${EMBED_MODEL().replace(/[^a-z0-9.-]+/gi, "_")}.json`);

function l2norm(v: number[]): number[] {
  const n = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1;
  return v.map((x) => x / n);
}

async function embedOne(text: string): Promise<number[] | null> {
  try {
    const res = await fetch(`${EMBED_URL()}/api/embeddings`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({ model: EMBED_MODEL(), prompt: text.slice(0, 4000) }),
    });
    const j = (await res.json()) as { embedding?: number[] };
    return j.embedding?.length ? l2norm(j.embedding) : null;
  } catch { return null; }
}

/** precedent key → {hash, vec} cache so corpus embeddings survive precedent growth. */
async function corpusEmbeddings(precedents: Precedent[]): Promise<Map<string, number[]>> {
  const docs = precedents.filter((p) => p.kind !== "flag");
  const entries = docs.map((p) => ({ id: p.id, h: createHash("sha1").update(`${p.title ?? ""} ${p.summary}`).digest("hex").slice(0, 12), text: `${p.title ?? ""} ${p.summary}` }));
  const cachePath = EMB_CACHE();
  let cache: Record<string, { h: string; v: number[] }> = {};
  try { cache = JSON.parse(readFileSync(cachePath, "utf8")); } catch { /* cold cache */ }
  const missing = entries.filter((e) => cache[e.id]?.h !== e.h);
  if (missing.length) {
    for (let i = 0; i < missing.length; i += 8) {
      const chunk = missing.slice(i, i + 8);
      await Promise.all(chunk.map(async (e) => {
        const v = await embedOne(e.text);
        if (v) cache[e.id] = { h: e.h, v };
      }));
    }
    try { mkdirSync(dirname(cachePath), { recursive: true }); writeFileSync(cachePath, JSON.stringify(cache)); } catch { /* cache is best-effort */ }
  }
  const vecs = new Map<string, number[]>();
  for (const e of entries) {
    const v = cache[e.id]?.v;
    if (v?.length) vecs.set(e.id, l2norm(v));
  }
  return vecs;
}

/** Build the reusable corpus half once per run; per-question calls add the query vector. */
export async function loadSemanticCorpus(precedents: Precedent[]): Promise<{ model: string; vecs: Map<string, number[]> } | null> {
  if (process.env.DECIDE_HYBRID === "0") return null;
  try {
    const vecs = await corpusEmbeddings(precedents);
    return vecs.size ? { model: EMBED_MODEL(), vecs } : null;
  } catch { return null; }
}

export async function semanticFor(q: Question, corpus: { model: string; vecs: Map<string, number[]> } | null): Promise<SemanticContext | null> {
  if (!corpus) return null;
  const queryVec = await embedOne(questionText(q));
  return queryVec ? { ...corpus, queryVec } : null;
}

function cosine(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i];
  return s;
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
  rationale?: string; needs_precedent?: boolean; confidence?: number; expires_at?: string;
  kind?: string; supersedes?: string; override_reason?: { detail?: string };
  decided_by?: { agent?: string; pipeline?: string };
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
  const today = new Date().toISOString().slice(0, 10);
  const records = readRecords();
  // A record named in another record's `supersedes:` is dead authority — the
  // override stands, the original stays on disk untouched but never decides.
  const superseded = new Set(records.map((r) => r.supersedes).filter(Boolean) as string[]);
  return records
    .filter((r) =>
      r.status === "decided" && !r.needs_precedent && r.question && r.decision
      // Depth-0 authority only: a precedent-step record is derivative of its
      // root — letting it become a precedent launders TTLs and compounds
      // errors (Fable F2). Rule/gate/autonomous/safe-default/research records
      // are roots; precedent applications are not.
      && r.step !== "precedent"
      // Engine-written records or explicit override rulings are authority;
      // a hand-written `status: decided` is a proposal until ruled (Fable F2).
      && (r.kind === "override" || r.decided_by?.pipeline === "scripts/decisions/decide.ts")
      && !(r.id && superseded.has(r.id))
      && !(r.expires_at && r.expires_at < today)) // expired rulings need re-review, not reuse
    .map((r) => ({
      id: r.id ?? "ledger",
      kind: "ledger-record",
      provenance_status: r.kind === "override" ? "ledger-override" : "ledger-decided",
      supersedes: r.supersedes,
      title: r.question.slice(0, 140),
      summary: `${r.decision} ${r.rationale ?? r.override_reason?.detail ?? ""}`.slice(0, 400),
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

/** State of docs/decisions/records/ on origin/main — the cross-worktree guard.
 *  Two parallel sessions can mint the same dec-id or re-decide the same question
 *  because each sees only its own checkout (Fable F10). git is the shared truth:
 *  we refuse hashes already decided on main and never mint an id main already has.
 *  Graceful no-op when origin/main is unavailable (shallow clone, no remote). */
let originState: { hashes: Set<string>; maxSeq: number } | null = null;
function originRecords(): { hashes: Set<string>; maxSeq: number } {
  if (originState) return originState;
  const hashes = new Set<string>();
  let maxSeq = 0;
  try { // grep exits 1 on zero matches — keep it separate from ls-tree
    const gh = execFileSync("git", ["grep", "-h", "-o", "question_hash: [a-f0-9]*", "origin/main", "--", "docs/decisions/records"], { encoding: "utf8", cwd: ROOT });
    for (const m of gh.matchAll(/question_hash: ([a-f0-9]+)/g)) hashes.add(m[1]);
  } catch { /* no origin/main, no records there, or none decided yet */ }
  try {
    const ls = execFileSync("git", ["ls-tree", "-r", "--name-only", "origin/main", "--", "docs/decisions/records"], { encoding: "utf8", cwd: ROOT });
    for (const f of ls.split("\n")) {
      const n = Number(f.match(/-(\d+)\.yaml$/)?.[1] ?? 0);
      if (Number.isFinite(n) && n > maxSeq) maxSeq = n;
    }
  } catch { /* same — local state only */ }
  originState = { hashes, maxSeq };
  return originState;
}

function nextId(): string {
  // Sequence = max(existing numeric suffix, origin/main suffix) + 1, NOT file
  // count — record numbers have gaps so count+1 collides with live records.
  // seq persists for the process so a batch can't hand out the same id twice.
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  if (!seq && existsSync(RECORDS_DIR)) {
    seq = readdirSync(RECORDS_DIR).reduce((m, f) => {
      const n = Number(f.match(/-(\d+)\.yaml$/)?.[1] ?? 0);
      return Number.isFinite(n) && n > m ? n : m;
    }, originRecords().maxSeq);
  } else if (!seq) {
    seq = originRecords().maxSeq;
  }
  return `dec-${d}-${String(++seq).padStart(3, "0")}`;
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
// Confidence is capped by the authority of the precedent cited — a ledger
// record never outranks a founder ruling, and every precedent decision was
// previously reporting a flat 0.95 (Fable F2).
const AUTHORITY_CONFIDENCE: Record<string, number> = {
  "founder-ruled": 0.9,
  "founder-ruled-ai-assisted": 0.85,
  "agent-ruled-delegated": 0.8,
  "ledger-override": 0.85,
  "ledger-decided": 0.75,
};

export function questionText(q: Question): string {
  return `${q.question} ${(q.options ?? []).join(" ")} ${(q.evidence ?? []).join(" ")} ${q.proposed_action ?? ""}`;
}

export function decide(q: Question, precedents: Precedent[], mode?: "autonomous" | "conservative", semantic?: SemanticContext | null): Record<string, unknown> {
  const rs = loadRuleset();
  const m = mode ?? rs.mode ?? "conservative";
  const text = questionText(q);
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

  // Step 1: gates — hard rejects run BEFORE non-delegable gates in BOTH modes.
  // A proposal that is both gated and forbidden ("deploy the page with the
  // prophet portrait") must reject, never get an autonomous substitute.
  for (const g of rs.gates.hard_reject) {
    if (hits(text, g.pattern)) {
      trace.push({ stage: "hard-reject", result: g.id, detail: g.reason });
      return {
        status: "rejected", step: "hard-reject", reason: g.reason,
        gate: g.id, domain, trace, mode: m, reversible: false,
      };
    }
  }
  trace.push({ stage: "hard-reject", result: "pass" });

  // Non-delegable gates: conservative mode → founder docket. Autonomous mode →
  // the engine takes the mapped conservative decision itself (rules.yaml
  // `autonomous.gates`); a gate with no mapping still docks — autonomy never
  // invents authority. Gates flagged no_negation in rules.yaml ignore the
  // negation guard: "do not delete" phrasing tricks must never disarm them.
  for (const g of rs.gates.non_delegable) {
    if (hits(text, g.pattern, !(g as { no_negation?: boolean }).no_negation)) {
      // Autonomous gate-mapping requires BOTH mode: autonomous AND the question's
      // domain on the safe_proceed list — a deploy question about faith content
      // dockets even in autonomous mode (fail-closed per-domain promotion).
      const auto = m === "autonomous" && (rs.safe_proceed?.[domain] ?? false)
        ? rs.autonomous?.gates?.[g.id]
        : undefined;
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
  // Authority filter (Muse §2): only founder-ruled precedents may decide —
  // proposals, rejections, reverts and unlabelled entries are context, not law.
  // Entries named in another precedent's `supersedes:` are dead authority.
  const supersededIds = new Set(precedents.map((p) => p.supersedes).filter(Boolean) as string[]);
  const AUTHORITY = new Set(["founder-ruled", "founder-ruled-ai-assisted", "agent-ruled-delegated"]);
  const rulingDocs = precedents.filter((p) =>
    p.kind !== "flag" && !supersededIds.has(p.id)
    && (p.kind === "ledger-record" || AUTHORITY.has(p.provenance_status ?? "")));
  if (rulingDocs.length !== precedents.filter((p) => p.kind !== "flag").length) {
    trace.push({ stage: "precedent-filter", result: `${rulingDocs.length}/${precedents.length}`, detail: "non-authority precedents (proposals/reverted/unlabeled) excluded from deciding" });
  }
  const bodyDocs = rulingDocs.map((p) => `${p.title ?? ""} ${p.summary}`);
  const df = dfOf(bodyDocs);
  const allLens = bodyDocs.map((d) => [...tokens(d).values()].reduce((a, b) => a + b, 0));
  const avgLen = allLens.reduce((a, b) => a + b, 0) / Math.max(allLens.length, 1);
  const qTf = tokens(q.question); // precedent gates score the QUESTION only — stuffing evidence/options must not buy a match (Fable F3)

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
    const score = Math.max(titleScore, bodyScore * 0.9);
    // Hybrid fusion (Q5 spec): 0.55 lexical + 0.45 cosine mapped from [0.40..1.0].
    let cosineSim = 0, cosineNorm = 0, hybrid = score;
    const qv = semantic?.queryVec;
    const pv = qv ? semantic?.vecs.get(p.id) : undefined;
    if (qv && pv) {
      cosineSim = cosine(qv, pv);
      cosineNorm = Math.max(0, (cosineSim - 0.4) / 0.6);
      hybrid = 0.55 * score + 0.45 * cosineNorm;
    }
    return {
      p, titleScore, bodyScore,
      titleOverlap: overlap(qTf, tTf),
      score, cosineSim, cosineNorm, hybrid,
    };
  }).sort((a, b) => b.hybrid - a.hybrid);

  const best = scored[0];
  const alternatives = scored.slice(0, PRECEDENT_TOP_N).map((s) => ({
    id: s.p.id, kind: s.p.kind, score: Number(s.hybrid.toFixed(3)),
    title_overlap: Number(s.titleOverlap.toFixed(3)),
    cosine: Number(s.cosineSim.toFixed(3)),
    title: (s.p.title ?? s.p.summary).slice(0, 100),
  }));

  // Dual-path gate: the lexical path is unchanged; the semantic path rescues
  // paraphrased/transliterated matches but still demands title-token overlap so
  // embeddings cannot bypass the same-topic/different-question floor.
  const passesLex = !!best && best.score >= PRECEDENT_THRESHOLD && best.titleOverlap >= TITLE_OVERLAP_FLOOR;
  const passesSem = !!best && !!semantic?.queryVec && best.cosineSim >= 0.68 && best.titleOverlap >= 0.25 && best.hybrid >= 0.52;
  if (best && (passesLex || passesSem)) {
    trace.push({ stage: "precedent", result: best.p.id, score: Number(best.hybrid.toFixed(3)), detail: `overlap ${best.titleOverlap.toFixed(2)} cosine ${best.cosineSim.toFixed(2)} via ${passesSem && !passesLex ? "semantic" : "lexical"}` });
    return {
      status: "decided", step: "precedent",
      decision: `apply precedent ${best.p.id} (${best.p.kind}): ${best.p.title ?? best.p.summary.slice(0, 80)}`,
      precedent: { id: best.p.id, source_file: best.p.source_file, score: Number(best.hybrid.toFixed(3)), title_score: Number(best.titleScore.toFixed(3)), cosine: Number(best.cosineSim.toFixed(3)), retrieval: passesSem && !passesLex ? "hybrid-semantic" : "lexical" },
      precedent_distance: Number((1 - best.hybrid).toFixed(3)),
      top_precedent_id: best.p.id,
      top_precedent_status: best.p.provenance_status ?? (best.p.kind === "ledger-record" ? "ledger-decided" : "unlabeled"),
      alternatives, domain,
      confidence: Math.min(AUTHORITY_CONFIDENCE[best.p.provenance_status ?? ""] ?? 0.7, 0.5 + best.hybrid), reversible: true, mode: m,
      rationale: `Question overlaps precedent ${best.p.id} recorded in ${best.p.source_file}. Conservative application; founder audits the sample.`,
      trace,
    };
  }
  trace.push({
    stage: "precedent", result: "no-match",
    detail: best ? `best ${best.p.id} hybrid ${best.hybrid.toFixed(2)} overlap ${best.titleOverlap.toFixed(2)} cosine ${best.cosineSim.toFixed(2)} below gates` : "empty corpus",
  });

  // Step 4: no rule, no precedent → conservative reversible default.
  // The default NEVER escalates review status, deletes, or asserts a contested fact.
  return {
    status: "decided", step: "safe-default",
    decision: "hold as draft-tier / pointer-only; record question in lane progress file for the next precedent-extraction pass",
    confidence: 0.4, reversible: true, domain, mode: m, alternatives, trace,
    rationale: "No rule or precedent matched. Defaulting to the most conservative reversible action per the decision-ledger design.",
    needs_precedent: true,
    ...(best ? {
      precedent_distance: Number((1 - best.hybrid).toFixed(3)),
      top_precedent_id: best.p.id,
      top_precedent_status: best.p.provenance_status ?? (best.p.kind === "ledger-record" ? "ledger-decided" : "unlabeled"),
    } : {}),
  };
}

// ---------------------------------------------------------------------------
// Records, docket, advisory verdicts
// ---------------------------------------------------------------------------

/** Emit one optional record field: scalars plain, scalar arrays as YAML lists,
 *  flat objects as nested maps, anything deeper as JSON flow (valid YAML). */
function emitField(lines: string[], key: string, value: unknown): void {
  if (value === undefined || value === null) return;
  const scalar = (v: unknown) => v === null ? "null" : typeof v === "number" || typeof v === "boolean" ? String(v) : JSON.stringify(String(v));
  if (Array.isArray(value)) {
    if (!value.length) return;
    if (value.every((v) => v === null || typeof v !== "object")) {
      lines.push(`${key}:`);
      for (const v of value) lines.push(`  - ${scalar(v)}`);
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
    return;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
    if (entries.length && entries.every(([, v]) => v === null || typeof v !== "object")) {
      lines.push(`${key}:`);
      for (const [k, v] of entries) lines.push(`  ${k}: ${scalar(v)}`);
    } else if (entries.length) {
      lines.push(`${key}: ${JSON.stringify(Object.fromEntries(entries))}`);
    }
    return;
  }
  lines.push(`${key}: ${scalar(value)}`);
}

function toYamlRecord(id: string, q: Question, d: Record<string, unknown>): string {
  const esc = (s: unknown) => JSON.stringify(String(s ?? ""));
  const date = new Date().toISOString().slice(0, 10);
  // TTL: autonomous decisions are provisional — they expire for re-review so
  // early rulings cannot harden into permanent unchecked facts.
  const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const lines = [
    `id: ${id}`,
    `kind: ${esc(d.kind ?? "decision")}`,
    `date: "${date}"`,
    `expires_at: "${expires}"`,
    `question_hash: ${questionHash(q)}`,
    `lane: ${esc(q.lane ?? "poc")}`,
    `class: ${esc(q.class ?? "uncategorised")}`,
    `modality: ${esc(q.modality ?? "repo")}`,
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
  if (d.judge_dissent) lines.push(`judge_dissent: true`);
  if (d.engine_hold) lines.push(`engine_hold: ${esc(d.engine_hold)}`);
  if (d.needs_precedent) lines.push(`needs_precedent: true`);
  lines.push(`review_sampled: false`, `decided_by:`, `  agent: poc-decide`, `  pipeline: scripts/decisions/decide.ts`, `  ruleset: docs/decisions/rules.yaml`);
  const derived = [d.rule_id && `rule:${d.rule_id}`, d.gate && `gate:${d.gate}`, d.precedent && `precedent:${(d.precedent as { id: string }).id}`].filter(Boolean);
  if (derived.length) lines.push(`derived_from:`, ...derived.map((x) => `  - ${x}`));
  // Override-record fields (Muse Q3): present only on kind: override rulings.
  for (const [k, v] of Object.entries({
    supersedes: d.supersedes, correct_outcome: d.correct_outcome, wrong_outcome: d.wrong_outcome,
    override_reason: d.override_reason, signals: d.signals, induction: d.induction,
    jury: d.jury, state_chain: d.state_chain, calibration_log: d.calibration_log,
  })) emitField(lines, k, v);
  return lines.join("\n") + "\n";
}

/** Attach the calibration_log block (record schema v2 / cold-start conformal
 *  logging): raw scores preserved NOW so isotonic/conformal fitting becomes
 *  possible once real founder_resolution labels accumulate. The deterministic
 *  fields are always present; judge fields are merged in by maybeJudge. */
function finalizeRecord(d: Record<string, unknown>): Record<string, unknown> {
  const existing = (d.calibration_log ?? {}) as Record<string, unknown>;
  d.calibration_log = {
    deterministic_gates_all_pass: true, // reaching any verdict means gates passed
    fired_rule_count: [d.rule_id, d.gate].filter(Boolean).length,
    rule_ids_fired: [d.rule_id, d.gate].filter(Boolean),
    precedent_distance: d.precedent_distance ?? null,
    top_precedent_id: d.top_precedent_id ?? null,
    top_precedent_status: d.top_precedent_status ?? null,
    founder_resolution: null,   // backfilled post-hoc — this IS the label stream
    founder_override: false,
    calibration_weight: 1.0,
    ...existing,
  };
  return d;
}

/** Regenerate the docket from ALL records on disk — the current state, not just this run. */
function writeDocket() {
  const all = readRecords();
  const open = all.filter((r) => r.status === "founder-docket" || r.status === "rejected");
  const held = all.filter((r) => r.status === "decided" && r.needs_precedent);
  const today = new Date().toISOString().slice(0, 10);
  const expired = all.filter((r) => r.status === "decided" && typeof r.expires_at === "string" && r.expires_at < today);
  const lines = [
    "# Founder docket — decisions awaiting the founder",
    "",
    "Generated by `npx tsx scripts/decisions/decide.ts --batch docs/decisions/inbox`.",
    "Lanes drop questions in `docs/decisions/inbox/*.yaml`; the pipeline answers what it can",
    "by rule or precedent and lists only what genuinely needs the founder here.",
    "",
    // No timestamp: the file must be byte-identical for identical records so
    // concurrent worktrees merge cleanly (Fable F10).
    `State: ${open.length} item(s) need the founder, ${held.length} held pending a precedent, ${expired.length} decided record(s) past expires_at (re-review), ${all.length} record(s) total.`,
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
  lines.push("", "## Expired decisions (past expires_at — re-review before reuse as precedent)", "");
  for (const r of expired) {
    lines.push(`- ${r.id} — ${r.question} (expired ${r.expires_at})`);
  }
  if (!expired.length) lines.push("_None._");
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
export function advisory(q: Question, precedents: Precedent[], mode?: "autonomous" | "conservative", semantic?: SemanticContext | null): Record<string, unknown> {
  const d = decide(q, precedents, mode, semantic);
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

interface JudgeResult {
  recommendation: string; confidence?: number; evidence?: string[]; rationale?: string;
  strongest_objection?: string; confidence_components?: Record<string, number>;
}

type JudgeFraming = "affirmative" | "adversarial";

function judgePayload(q: Question, d: Record<string, unknown>, framing: JudgeFraming): string {
  const task = framing === "affirmative"
    ? "You are advising an autonomous decision engine for islam.museum, a trilingual museum knowledge graph. A question reached the safe-default hold. Evaluate it as a TWO-SIDED packet: first name the strongest reason the obvious answer is WRONG (false conflation, single-source copy presented as independent, invented date, legend stated as fact, office/descent counted as personal attestation), then recommend the most conservative reversible answer consistent with the repository's rules (Arabic-first, sources cited, no invented dates, two independent attestations for contested fields, Sunni-first labelled perspectives, no verdicts, CC0 data). An AI's own answer is never evidence."
    : // Adversarial pass (SCOPE-style bidirectional evaluation): assume the obvious
      // answer is a false conflation, single-source copy, or legend, and check
      // whether the evidence survives falsification before recommending.
      "You are the adversarial reviewer for islam.museum's decision engine. A question reached the safe-default hold. Assume the most obvious answer is wrong — a false conflation, a single-source copy presented as independent attestation, an invented date, a legend stated as fact, or a shortcut like office/descent/AI-output counted as personal attestation. Try to falsify it against the repository's rules (Arabic-first, every fact cited with a verbatim quote, doubt resolves to unknown, no invented dates, contested claims stay labelled). Recommend the most conservative reversible answer only if it survives this attack.";
  return JSON.stringify({
    task,
    framing,
    question: q.question,
    lane: q.lane,
    modality: q.modality ?? "repo",
    domain: d.domain,
    // Judge sees precedent IDS + scores only — precedent titles are untrusted
    // text that could carry injected instructions (Fable F15). The full
    // alternatives list stays in the record for humans/audit.
    alternatives: ((d.alternatives ?? []) as { id: string; score: number }[]).map((a) => ({ id: a.id, score: a.score })),
    instruction: 'Reply with ONLY a JSON object: {"recommendation": string, "confidence": 0-1, "confidence_components": {"evidence_strength": 0-1, "source_independence": 0-1, "model_agreement": 0-1}, "strongest_objection": string, "evidence": [strings], "rationale": string}. Decomposed confidence matters: thin evidence, conflicting evidence and model disagreement are different failure modes — report the components, not just the aggregate.',
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

async function consultJudge(q: Question, d: Record<string, unknown>, framing: JudgeFraming): Promise<JudgeResult | null> {
  const payload = judgePayload(q, d, framing);
  try {
    if (process.env.DECIDE_JUDGE_CMD) {
      const { execFileSync } = await import("node:child_process");
      const [cmd, ...args] = process.env.DECIDE_JUDGE_CMD.split(" ");
      const out = execFileSync(cmd, args, { encoding: "utf8", timeout: 300_000, maxBuffer: 4 * 1024 * 1024, input: payload });
      return parseJudgeJson(out);
    }
    if (process.env.DECIDE_JUDGE_URL) {
      const res = await fetch(process.env.DECIDE_JUDGE_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(300_000), // a hung judge must never stall the pipeline
        body: JSON.stringify({
          model: process.env.DECIDE_JUDGE_MODEL ?? "local",
          think: false, // Qwen3-class models: skip the reasoning trace, we want the JSON verdict
          response_format: { type: "json_object" }, // grammar-constrained JSON where supported
          temperature: 0.3,
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

interface BpeResult { pick: JudgeResult; fwd: JudgeResult | null; rev: JudgeResult | null; confidence: number; dissent: boolean; uncertainty: number; sameVerdict: boolean }

/** Jaccard overlap over content tokens — do two recommendation strings say the
 *  same thing? Free-text verdicts can't be compared by equality. */
function recSimilarity(a: string, b: string): number {
  const ta = new Set([...tokens(a).keys()]);
  const tb = new Set([...tokens(b).keys()]);
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / (ta.size + tb.size - inter);
}

const clipConf = (c: number) => Math.min(0.95, Math.max(0.05, c));

/** Bidirectional Preference Entropy (SCOPE-style): affirmative + adversarial
 *  passes are combined into an order-invariant support estimate. Each pass
 *  supports the picked verdict with its clipped confidence when it reached the
 *  same conclusion, or with 1−confidence when it confidently reached a
 *  different one. Composite uncertainty s(x) = min(1, H(p̄) + 0.5·Δflip); the
 *  reported confidence is 1−s(x). Material dissent keeps the safe-default
 *  hold — the model cannot argue the engine out of its hold on a coin-flip. */
async function consultJudgeBpe(q: Question, d: Record<string, unknown>): Promise<BpeResult | null> {
  if (process.env.DECIDE_JUDGE_SINGLE === "1") {
    const single = await consultJudge(q, d, "affirmative");
    return single ? { pick: single, fwd: single, rev: null, confidence: (single.confidence ?? 0.5) * 0.9, dissent: false, uncertainty: 1 - (single.confidence ?? 0.5), sameVerdict: true } : null;
  }
  const [fwd, rev] = await Promise.all([
    consultJudge(q, d, "affirmative"),
    consultJudge(q, d, "adversarial"),
  ]);
  if (!fwd && !rev) return null;
  if (!fwd || !rev) {
    const only = (fwd ?? rev)!;
    const c = only.confidence ?? 0.5;
    return { pick: only, fwd, rev, confidence: c * 0.85, dissent: false, uncertainty: 1 - c, sameVerdict: true };
  }
  const cf = clipConf(fwd.confidence ?? 0.5);
  const cr = clipConf(rev.confidence ?? 0.5);
  const sameVerdict = recSimilarity(fwd.recommendation, rev.recommendation) >= 0.3;
  const pick = cf >= cr ? fwd : rev;
  // Uncertainty = verdict disagreement dominates; mean clipped confidence
  // modulates. (Replaces the earlier entropy-of-self-report formula, which
  // flagged two AGREEING 0.8-confidence passes as ~72% uncertain — treating a
  // self-reported scalar as a Bernoulli parameter is an artifact, not signal.
  // Fable F12.)
  const meanConf = (cf + cr) / 2;
  const uncertainty = (sameVerdict ? 0 : 0.6) + (1 - meanConf) * 0.4;
  const confidence = 1 - uncertainty;
  // Dissent: material disagreement between passes, or very low combined
  // confidence even when they concur.
  const dissent = uncertainty > 0.5;
  return { pick, fwd, rev, confidence, dissent, uncertainty, sameVerdict };
}

/** If a judge is configured and the engine held the question, upgrade the hold
 *  to a "recommended" record carrying the model's advice + evidence. The engine
 *  verdict stays safe-default underneath — the recommendation is advisory only.
 *  When the affirmative and adversarial passes materially disagree, the hold
 *  stands and the dissent is recorded for audit instead. */
async function maybeJudge(q: Question, d: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (d.step !== "safe-default" || (!process.env.DECIDE_JUDGE_CMD && !process.env.DECIDE_JUDGE_URL)) return d;
  const bpe = await consultJudgeBpe(q, d);
  if (!bpe) return d;
  const model = process.env.DECIDE_JUDGE_MODEL ?? process.env.DECIDE_JUDGE_CMD ?? "endpoint";
  const judgeCal = {
    model,
    model_quant: process.env.DECIDE_JUDGE_MODEL ?? null,
    framing_a_confidence: bpe.fwd?.confidence ?? null,
    framing_b_confidence: bpe.rev?.confidence ?? null,
    framing_entropy: Math.round(bpe.uncertainty * 1000) / 1000,
    verdict_agreement: bpe.sameVerdict,
    jury: "none",
  };
  if (bpe.dissent) {
    return {
      ...d,
      calibration_log: { ...((d.calibration_log as Record<string, unknown>) ?? {}), ...judgeCal },
      judge_dissent: true,
      judge_evidence: [
        `uncertainty s(x)=${Math.round(bpe.uncertainty * 100) / 100} (entropy+flip composite)`,
        `affirmative(${bpe.fwd?.confidence ?? "?"}): ${bpe.fwd?.recommendation ?? "no response"}`,
        `adversarial(${bpe.rev?.confidence ?? "?"}): ${bpe.rev?.recommendation ?? "no response"}`,
      ],
      rationale: `${d.rationale ?? ""} [judge BPE dissent — passes disagreed, hold stands for audit]`,
    };
  }
  const j = bpe.pick;
  return {
    ...d,
    calibration_log: { ...((d.calibration_log as Record<string, unknown>) ?? {}), ...judgeCal },
    status: "recommended",
    step: "judge",
    decision: j.recommendation,
    confidence: Math.round(bpe.confidence * 100) / 100,
    rationale: `GenAI advisor recommendation, bidirectional-evaluated (${model}, BPE conf ${Math.round(bpe.confidence * 100) / 100}) — advisory only, awaits async audit: ${j.rationale ?? ""}`,
    judge_evidence: [
      ...(j.strongest_objection ? [`strongest objection: ${j.strongest_objection}`] : []),
      ...(j.confidence_components ? [`confidence components: ${JSON.stringify(j.confidence_components)}`] : []),
      ...(j.evidence ?? []),
      ...(bpe.rev && bpe.rev !== j ? [`adversarial pass concurs at conf ${bpe.rev.confidence ?? "?"}`] : []),
    ],
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
  if (cliMode && cliMode !== "autonomous" && cliMode !== "conservative") {
    console.error(`--mode must be autonomous|conservative, got '${cliMode}'`);
    process.exit(2);
  }
  const precedents = loadPrecedents();
  // Hybrid retrieval: embed the precedent corpus once per run (cached on disk),
  // then one query embedding per question. Unreachable endpoint → lexical only.
  const semCorpus = isAdvisory ? null : await loadSemanticCorpus(precedents);
  if (!isAdvisory && process.env.DECIDE_HYBRID !== "0" && !semCorpus) {
    console.error("note: embedding endpoint unreachable — precedent matching stays lexical (BM25)");
  }

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
      if (seen.has(questionHash(q)) || originRecords().hashes.has(questionHash(q))) {
        console.log(`skip (already decided${originRecords().hashes.has(questionHash(q)) ? " on origin/main" : ""})  ${f}`);
        continue;
      }
      const sem = isAdvisory ? null : await semanticFor(q, semCorpus);
      let d = isAdvisory ? advisory(q, precedents, cliMode) : decide(q, precedents, cliMode, sem);
      if (!isAdvisory) d = finalizeRecord(await maybeJudge(q, d));
      const id = nextId();
      if (write && !isAdvisory) {
        mkdirSync(RECORDS_DIR, { recursive: true });
        try {
          writeFileSync(join(RECORDS_DIR, `${id}.yaml`), toYamlRecord(id, q, d), { flag: "wx" });
        } catch (e) {
          if ((e as NodeJS.ErrnoException).code === "EEXIST") {
            console.log(`ID COLLISION ${id} — record exists; re-run to mint a fresh id (never overwrite)`);
            continue;
          }
          throw e;
        }
      }
      results.push({ id, q, d });
      const head = isAdvisory ? String(d.verdict) : `${d.status}/${d.step}`;
      console.log(`${id}  ${head.padEnd(24)} ${q.question.slice(0, 90)}`);
    }
    if (write && !isAdvisory) {
      writeDocket();
      // Governance digest rides the same pass (Muse Q6) — it reads the records
      // just written, so it can never disagree with the docket.
      try {
        const { execFileSync } = await import("node:child_process");
        execFileSync("npx", ["tsx", join(ROOT, "scripts/decisions/digest.ts")], { stdio: "inherit" });
      } catch { console.error("note: digest generation failed — records and docket are still written"); }
    }
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
  if (decidedHashes().has(questionHash(q)) || originRecords().hashes.has(questionHash(q))) {
    console.log("skip (already decided) — question_hash matches an existing record (local or origin/main)");
    return;
  }

  const sem = isAdvisory ? null : await semanticFor(q, semCorpus);
  let d = isAdvisory ? advisory(q, precedents, cliMode, sem) : decide(q, precedents, cliMode, sem);
  if (!isAdvisory) d = finalizeRecord(await maybeJudge(q, d));
  const id = nextId();

  if (write && !isAdvisory) {
    mkdirSync(RECORDS_DIR, { recursive: true });
    try {
      writeFileSync(join(RECORDS_DIR, `${id}.yaml`), toYamlRecord(id, q, d), { flag: "wx" });
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "EEXIST") {
        console.error(`ID COLLISION ${id} — record exists; refusing to overwrite`);
        process.exit(1);
      }
      throw e;
    }
    console.log(`wrote docs/decisions/records/${id}.yaml — status: ${d.status}`);
  } else {
    emit(id, q, d);
  }
}

if (process.argv[1]?.endsWith("decide.ts")) main();
