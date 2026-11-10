# 17 — The Autonomous Decision Approver (POC)

Status: proof of concept on branch `poc/decision-ledger` (PR pending). Everything
here is build-time tooling: no part of it runs on the published site, calls a
model at runtime, or touches deploys, deletions, spending, outreach, licences or
review-status escalation. Those surfaces are answered conservatively by the
engine itself or refused outright — never executed.

## 1. What it is

A data-driven rule engine plus an optional local GenAI judge that answers the
questions lanes used to queue for the founder. Any AI model working on the
repository can submit a question — or a proposed action — and receive a
machine-readable verdict with a full explainable trace.

```
question (+ optional proposed_action)
  │
  ├─ 1. DOMAIN CLASSIFY     rules.yaml classifiers → content/dates/sources/…
  │                        (scans question + proposed_action — the proposal is
  │                        part of what is being gated, Muse H5 fix)
  ├─ 2. FOUNDER-RESERVED    conservative mode only: explicit "founder decides" → docket
  ├─ 3. POLICY GATES        non-delegable surfaces + hard rejects (never model-overridable)
  ├─ 4. CANONICAL RULES     priority-ordered rules.yaml — the repo already answers these
  │                        (question text ONLY — options/evidence/proposed_action
  │                        cannot steer semantic rule selection)
  ├─ 5. PRECEDENT MATCH     BM25 + hybrid embeddings over mined rulings + ledger
  │                        (question text ONLY, same anti-stuffing rule)
  ├─ 6. JUDGE (optional)    local model, bidirectional BPE evaluation → "recommended" only
  └─ 7. SAFE DEFAULT        hold as draft-tier, needs_precedent, recorded for audit
```

The split above is load-bearing: **gates see the whole proposal** (a tidy
question proposing a delete must still hit the delete gate), while **rules and
precedents see only the literal question** (proposed_action/options/evidence are
untrusted proposer text and must not be able to stuff a rule or precedent match).

Every outcome emits a YAML decision record (`docs/decisions/records/`) and a
trace (`--explain`, `--json`).

## 2. Modes

`docs/decisions/rules.yaml` → `mode:` selects behaviour; `--mode` overrides per call.
**Default is `conservative`** — an autonomous default plus lanes reading `decided`
as permission was judged the riskiest shortcut (Fable F8) and reverted.

- **conservative** (default): non-delegable surfaces route to the founder docket;
  safe defaults hold. This is also the A/B harness, the rollback target and the
  auto-demotion state.
- **autonomous** (opt-in per run or via `mode:` in rules.yaml): each mapped gate
  gets the engine's own conservative, reversible decision instead of a docket —
  licence change → labelled proposal, review-status → governed-path answer,
  content-safety/Qur'an → refuse-with-rationale, governance → proposal,
  conflicting authorities → newest-dated-ruling + preserved readings. Gate
  mapping additionally requires the domain on `safe_proceed:` — currently
  `engineering`, `process`, `governance`; `money-outreach` was removed
  2026-11-08.
- **Founder-only in BOTH modes**: deploy, delete, spend and outreach have no
  `autonomous.gates` mapping, so they docket even under `--mode autonomous` —
  the founder's standing ruling (decision record dec-186 and predecessors) is
  that these surfaces never get engine-decided.

Hard rejects (`hard_reject` in rules.yaml) refuse in **every** mode and run
before override lookup: the terrorist-organisation content block, Qur'an text
handling, typed honorifics, prophet depictions.

## 3. Rule engine

All gates, rules, domains, autonomy mappings and thresholds live in
`docs/decisions/rules.yaml` — versioned data, editable without code. Rules are
priority-ordered; the first matching rule decides. Doctrine was mined from the
full commit history (~20k commits): the doubt rule (doubt → `unknown`), the
two-independent-sources faith rule, homonyms never merge, stubs replaced in
place, conflicts preserved as labelled readings, impossible dates stripped,
external IDs fail-closed, office-vs-faith claim separation (the 1 Nov 2026 R1
"office shortcut" was an unapproved agent draft reverted under PR #2873 — office
may be recorded as a biographical fact on one source but never settles `faith`).

## 4. Precedent retrieval — lexical + hybrid

Corpus: `docs/decisions/precedents.yaml` (~200 mined entries plus the decision
ledger itself — every `decided` record becomes a `ledger-record` precedent, so
the system cites its own rulings). Held questions (`needs_precedent`), expired
records and records named in another record's `supersedes:` never become
authority (the override stands; the original stays on disk untouched). Mined
precedents carry a 365-day `expires_at` and `supersedes` chains — delegated
authority cannot silently harden into permanent doctrine (the kill-switch the
founder required alongside full agent authority, dec-186/Q9).

**Authority filter ("a proposal is not a precedent"):** every mined entry
carries `provenance_status`, assigned fail-closed by the extractor:

| status | meaning | may decide? |
|---|---|---|
| `founder-ruled` | the founder's own ruling, citable to a ruling act | yes |
| `founder-ruled-ai-assisted` | founder ruled on AI-drafted options (the 1 Nov incident class) | yes, weighted below clean rulings |
| `agent-ruled-delegated` | agent decision under standing delegation (dec-186: full authority, not reduced) | yes, within delegated scope |
| `agent-proposed-pending` | drafted, never ruled | **no — context only** |
| `agent-proposed-rejected` / `reverted` | ruled against / undone | no (negative authority needs polarity-aware matching — roadmap) |

Entries named in another precedent's `supersedes:` field are dead authority and
excluded. The extractor mints `founder-ruled` authority only from structured
claims in whitelisted founder-owned paths, and only when the claim is dated —
regex-matching "founder ruled" in agent prose is a forgery surface (H5 lesson:
wording steers this engine).

**Overrides:** a `kind: override` record bypasses gates ONLY when every check
passes — `status: decided`, live (not superseded), unexpired, exact
`question_hash` match, and `calibration_log.founder_resolution.verdict ===
approved`. Overrides without founder approval can still inform precedent
retrieval but cannot bypass a gate; hard rejects always run before override
lookup. This is the dec-179/dec-182 pattern for correcting a record's rule
citation without re-litigating its outcome.

**Lexical path (always on):** BM25 over title+summary with IDF, plus a
title-token-overlap floor. Gates: normalized score ≥ 0.6 **and** title overlap
≥ 0.3 — the floor stops same-topic/different-question matches.

**Hybrid path (opt-out via `DECIDE_HYBRID=0`):** each precedent is embedded once
(`qwen3-embedding:0.6b` via Ollama `/api/embeddings`, L2-normalised, cached in
`docs/decisions/.embeddings-*.json` keyed by id+text-hash so precedent growth
only embeds the delta). The query is embedded per question. Fusion per
candidate:

```
cosineNorm = clamp((cosine − 0.40) / 0.60, 0, 1)
hybrid     = 0.55 · bm25Norm + 0.45 · cosineNorm
```

Dual-path gate — a candidate decides if **either** holds:

- lexical: `bm25Norm ≥ 0.6 && titleOverlap ≥ 0.3` (unchanged), or
- semantic: `cosine ≥ 0.68 && titleOverlap ≥ 0.25 && hybrid ≥ 0.52`

The semantic path still requires title-token overlap — embeddings cannot smuggle
in negation/count flips ("one source" vs "two sources"). Verified live: a
paraphrase with near-zero lexical overlap ("Before opening another ingestion
lane, is a scope document mandatory?") correctly stayed `safe-default` under
BM25 and matched the scope-document precedent via cosine 0.84.

Unreachable embedding endpoint → silent lexical fallback (one stderr note).

## 5. Judge tier — advisory only

Held questions (`step: safe-default`) may be advised by a local model. The judge
**can never** produce `decided`, override a gate/rule/precedent, or touch gated
surfaces — those are intercepted before it runs. Output lands as
`status: recommended` for async audit; the safe-default stays underneath
(`engine_hold` field).

Transports (build-time only):

- `DECIDE_JUDGE_URL` — any OpenAI-compatible chat endpoint (Ollama
  `http://localhost:11434/v1/chat/completions`, LM Studio, llama-server).
  Sends `think:false` (Qwen3-class), `response_format: json_object`,
  `temperature: 0.3`.
- `DECIDE_JUDGE_CMD` — shell command reading JSON on stdin, printing JSON.
- `DECIDE_JUDGE_MODEL` — model id (default `local`).
- `DECIDE_JUDGE_SINGLE=1` — single affirmative pass (debugging).

### Bidirectional Preference Entropy (BPE)

Each held question is judged **twice in parallel**: affirmative framing
("recommend the most conservative reversible answer") and adversarial framing
("assume the obvious answer is a false conflation / single-source copy /
legend — try to falsify it"). Verdicts are free text, so agreement is measured
by token Jaccard similarity (≥ 0.3 = same verdict).

For the picked verdict, each pass contributes support = its clipped
confidence (0.05–0.95) if it reached the same verdict, else `1 − confidence`.
With supports `p_fwd`, `p_rev`:

```
p̄       = (p_fwd + p_rev) / 2
Δflip   = |p_fwd − p_rev|
H(p̄)    = −p̄·ln p̄ − (1−p̄)·ln(1−p̄)  (binary Shannon entropy, /ln 2)
s(x)    = min(1, H(p̄) + 0.5·Δflip)   ← composite uncertainty
confidence = 1 − s(x)
```

**Dissent** (`s(x) > 0.5`, or two confident passes reaching different verdicts)
keeps the safe-default hold and records `judge_dissent: true` with both
recommendations — zero human blocking, conservative epistemic fallback. This is
the SCOPE pattern (arXiv:2602.13110) adapted to two passes; K=2 stochastic
sampling per framing and conformal λ-calibration against proxy labels are the
documented next step once judge outcome data accumulates.

Malformed/empty/timed-out judge output → hold stands; the judge is untrusted
input, schema-validated before use.

## 6. Records, docket, self-learning

Record schema (`toYamlRecord`): `id`, `date`, `expires_at` (+365d TTL),
`question_hash` (idempotency), `lane`, `class`, `modality`
(book/website/video/audio/repo), `domain`, `mode`, `question`, `options`,
`evidence`, `status`, `step`, `decision`, `confidence`, `reversible`,
`rationale`, plus conditional `rule`/`rule_id`/`gate`/`precedent`/`judge_evidence`/
`judge_dissent`/`engine_hold`/`needs_precedent`, `review_sampled`,
`decided_by {agent, pipeline, ruleset}` and `derived_from` links to the
governing rule/gate/precedent.

- **TTL**: expired records drop out of precedent matching automatically and are
  listed in `docket.md`'s re-review section — early autonomous rulings cannot
  harden into permanent facts.
- **Docket** (`docs/decisions/docket.md`): regenerated from ALL records on every
  `--write` run — items needing the founder, items held pending precedent, and
  expired decisions due for re-review.
- **Inbox**: lanes drop `docs/decisions/inbox/*.yaml`; `--batch` processes them,
  skips already-decided hashes and unparseable files. **Harvest lanes are
  required to route every labeling/classification/judgment call through this
  flow** — `docs/agents/mining-sources.md` §4b (founder ruling, 8 Nov 2026).
  Mechanical choices (which scan to read, page offsets, schema-required fields)
  and founder-only surfaces (exclusions, safety blocks, Qur'an text, licences)
  are carved out explicitly.
- **Advisory contract** (`--advisory`): any model submits
  `{question, proposed_action, proposed_by}` → receives
  `allow | redirect | deny | route-to-founder` plus the engine's authoritative
  decision. The proposer/disposer pattern: untrusted proposer, trusted
  deterministic monitor — the engine never defers to the proposal.
- **Agent self-labelling (dec-186 standing delegation, 8 Nov 2026)**: the
  founder delegated record labeling to agents — `decided_by` carries
  `devin-swe2 (agent, delegation)` style stamps and agents write verdicts
  autonomously going forward. `calibration_log.founder_resolution` remains the
  field for genuine founder verdicts (`founder-rule.ts`); agent labels are
  recorded with their own provenance so the audit trail stays honest about who
  decided what. Hard gates (deploy, delete, spend, outreach, safety, Qur'an,
  governance, licences) remain founder-docketed regardless.
- **Golden-set doctrine (dec-188)**: everything currently in the museum — data,
  prose, events, persons, books — is the reference corpus. A rule that would
  reject or invalidate existing content is wrong and gets amended; content is
  never removed to satisfy a stricter rule. AGENTS.md carries this as a
  rule-that-never-bends.

## 6b. Operator tooling — the full script surface

| Script | Purpose |
|---|---|
| `decide.ts` | The engine. Single question (`--question`, `--proposed-action`), `--batch <dir> --write` for inbox processing, `--explain` trace, `--json`, `--advisory` proposer/disposer contract, `--mode`. |
| `benchmark.ts` | Replays `benchmark.yaml`'s 112 labelled cases; asserts exact rule/gate/precedent ids. The reconstruction-agreement gate — a rule mutation may not regress it. |
| `check-records.ts` | Ledger contract: required fields, authority provenance, duplicate ids/hashes, supersedes-chain integrity, stale rule citations. Runs inside `npm run validate`. |
| `sweep.ts` | Stale-authority detector: finds live records citing rules that no longer match, precedents gone dead, or doctrine drifted since the record was written. |
| `extract-precedents.ts` | Re-mines `docs/**` into `precedents.yaml` with `provenance_status` fail-closed assignment, `expires_at` stamping and `supersedes` honouring (founder-owned whitelisted paths only for founder-minted authority, dated claims required). |
| `seed-inbox.ts` | Converts non-authority precedent questions into inbox YAMLs for batch processing. |
| `replay.ts` | Replays extractable lane questions through the engine; reports coverage + citation precision (`--mask-self` = generalization test). |
| `audit.ts` | Per-surface agreement report over labelled records — the promotion-gate instrument. |
| `founder-rule.ts` | Writes a founder verdict into `calibration_log.founder_resolution` — the label stream. |
| `mark-applied.ts` | Records `state_chain.current_state: applied` — the decided→applied funnel. |
| `triage.ts` | Judge-assisted digest of unlabelled safe-default holds (requires judge transport). |
| `digest.ts` | Governance dashboard → `docs/decisions/digest.md`; runs at the end of every `--batch --write`. |
| `decisions.test.ts` | Vitest coverage of pipeline gates and mode behaviour. Run scoped: `npx vitest run scripts/decisions/decisions.test.ts`. |

## 7. Benchmark — the reconstruction gate

`docs/decisions/benchmark.yaml` holds 112 labelled cases mined from real repo
questions across every domain (content, sources, dates, media, i18n,
accessibility, process, engineering, safety, governance) with expected outcomes
asserting the exact `rule_id`/`gate`/`precedent_id` — not just the broad step —
plus per-mode autonomous cases (`autonomous-override`, `reject`).

```
npx tsx scripts/decisions/benchmark.ts   # → 71/71, prints reconstruction-agreement %
```

The printed percentage is the ICAI-style promotion gate: a rule mutation may
only land if replaying the historical decision set does not regress. Per-class
pass counts are the calibration dashboard.

## 8. Configuration reference

| Env var | Default | Purpose |
|---|---|---|
| `DECIDE_HYBRID` | on | `0` disables embedding-augmented precedent retrieval |
| `DECIDE_EMBED_URL` | `http://localhost:11434` | embeddings endpoint (Ollama) |
| `DECIDE_EMBED_MODEL` | `qwen3-embedding:0.6b` | embedding model |
| `DECIDE_JUDGE_URL` | — | OpenAI-compatible judge endpoint |
| `DECIDE_JUDGE_CMD` | — | shell-command judge transport |
| `DECIDE_JUDGE_MODEL` | `local` | judge model id |
| `DECIDE_JUDGE_SINGLE` | off | `1` = single-pass judge (no BPE) |

Local setup: `brew install ollama && ollama serve && ollama pull qwen2.5:32b
qwen3-embedding:0.6b` — see `docs/decisions/JUDGE-SETUP.md`. (Judge model is
founder-approved `qwen2.5:32b`, updated from the original `qwen3:32b`.)

## 9. Research basis

Patterns implemented from the literature review in
`docs/decisions/RESEARCH.md` and the external architecture audit:

- **Proposer/disposer AI control** — untrusted GenAI advisor, trusted
  deterministic monitor (Greenblatt et al. 2024; SafeChain guardian design).
- **BPE / SCOPE** — bidirectional preference evaluation with entropy+flip
  uncertainty (Badshah et al., ICML 2026, arXiv:2602.13110).
- **Conservative epistemic fallback** — uncertainty resolves to the domain's
  safe state (`unknown`/label/quarantine), never a block on humans.
- **ICAI reconstruction gate** — induced rules must replay historical rulings
  (Findeis et al., ICLR 2025, arXiv:2406.06560) → the benchmark agreement %.
- **CEGIS/AutoSpec direction** — counterexample-driven rule induction is the
  documented next step (§10).
- **PolicyLLM two-stage gate** — deterministic symbolic checks before any model
  call; the judge sees only what survived Stage 1.
- **PRELUDE/CIPHER latent preferences** — precedent-weight direction; DDJR
  borderline-case weighting is future work.

## 10. Muse operational doctrine (orchestrator rulings, 8 Nov 2026)

The fleet orchestrator's advisory — verified against the branch at `5905b8d` —
adds the operational layer the research survey lacks. **Implemented:**
provenance_status + supersedes chains (§4), adversarial benchmark traps (§3.2
→ 10 cases, 81/81), rule-ai-not-evidence, rule-excluded-absent,
rule-office-vs-faith, rule-impossible-dates, two-sided judge packets with
`strongest_objection` + decomposed `confidence_components`, nextId max-suffix
fix, `kind: override` records with supersedes-based dead-authority exclusion
in `loadLedgerPrecedents`, `calibration_log` on every record (raw framing
scores, entropy, precedent distance, `founder_resolution: null` as the future
label stream), `scripts/decisions/digest.ts` (blocked-item headline + the full
metric table, runs at the end of every `--batch --write`),
`scripts/decisions/check-records.ts` (ledger schema gate, WARN-tolerant on
legacy fields), npm `decisions:*` scripts, `rule-relation-direction` and
`rule-ui-no-deviation` (the two domain-table gaps), and the `DECIDE_JUDGE_CMD`
stdin contract fix (payload now goes to stdin, matching JUDGE-SETUP.md).

**Rollout sequence adopted (Muse Q1):** harness freeze → record validation →
shadow calibration (50 real lane questions, `records/shadow/`, inert to
precedent extraction) → per-domain `safe_proceed:` config → pilot = **source
admission** (highest frequency, deterministic evidence, fully reversible,
densest precedent coverage) → override machinery (`induce.ts`, not yet built)
→ stub-enrichment + dedup classes → entity-creation classes → classification
settlements LAST at strictest α (gated on the FDR policy record dec-016) →
merge execution with literal gate strings. Per-class `autonomy:` flags;
conservative mode is never deleted — it is the A/B harness, the rollback
target, and the auto-demotion state at >5% override rate.

**Doctrine details the deferred work must honour** (full text in Muse's
8 Nov advisory; these are the load-bearing specifics):

- *Safe-proceed per domain* — every domain needs a defined autonomous
  "proceed safely" output; domains with NO autonomous state are deploys
  (execution — recorded cadence decision only), licence changes (proposal
  only, effectively irrevitable), outreach sends (until `gate-outreach-clearance`
  exists — draft-only is the whole domain), and spend outside a founder-set
  envelope (`envelopes.yaml`, zero until set).
- *Reversibility grading* — autonomy tiers by cost of reversal, not
  importance; the hard-reject list stays tiny, explicit, founder-owned.
- *Idempotency* — question-level exists (`question_hash`); action-level
  (external sends/applies) needs an idempotency key + verify-against-system-
  of-record before any send-flag flips.
- *State chain* — `decided → applied → merged → deployed → verified-live`,
  each timestamped; "merged" has never meant "live" here.
- *Evidence discipline* — attestations need verbatim quotes + locators;
  independence is source *families* not documents; briefs/queue notes are the
  least authoritative layer (the engine decides from sources, never from the
  brief's claims); present-tense external facts must be fetched, not remembered.
- *Deterministic gates* — literal `"0 errors"`/`"0 fail"` strings asserted in
  code, never a model's summary; allowed-repairs transcribe shape/provenance
  from the record's own fields — fact values are never repaired.
- *MDL constraint on induced rules* — schema-level signals only (counts,
  booleans, gate results); never entity ids, slugs or proper nouns; a rule
  that fires on one person is a precedent, not a rule.
- *Plural jury* — proposer ≠ judge ≠ jury across model families; disagreement
  routes to the domain's safe-state + audit flag, never to a human queue.
- *Private forbidden lists* — `$ISLAM_MUSEUM_PRIVATE_DIR/lists/*.yaml`
  (mode 700/600, never inside a git worktree); absent → `private-gate:
  unavailable` and dependent domains fail closed to safe states; matches log
  as `{list_id, list_version, sha256 prefixes, disposition}` — never the
  terms; `not_matches` suppressions checked first, grow only from observed
  false positives; a pre-push `check-no-leak` greps the tree (counts only).

**Implemented since (8 Nov 2026):** digest.ts, check-records.ts, mark-applied.ts,
audit.ts, replay.ts, seed-inbox.ts, founder-rule.ts, triage.ts, sweep.ts, TTL +
`expires_at` on records and precedents, `supersedes` dead-lettering, the
question/proposed_action split (gates see both, rules/precedents question-only),
exact-id benchmark assertions (112 cases), founder-only deploy/delete/spend/
outreach surfaces, agent self-labelling under dec-186, harvest §4b routing,
golden-set doctrine dec-188.

**Still open:** `docs/decisions/envelopes.yaml` (spend envelopes — founder-set,
zero until set), `gate-outreach-clearance` (deterministic pre-send gate),
`attestation_families` deterministic field (needed before the faith class goes
live), private forbidden lists at `$ISLAM_MUSEUM_PRIVATE_DIR` (fail-closed
loader + hash-only logging + check-no-leak), shadow mode + `shadow-report.ts`,
`induce.ts` CEGIS candidates, `jury-ab.ts` roster harness, `calibrate-retrieval.ts`
grid search, plural-jury `jury:` record blocks, the full decided→applied→merged→
deployed→verified-live state chain (mark-applied covers the first hop), and §11
metrics not yet instrumented (reported `partial` in the digest rather than
faked).

## 11. Known limitations & roadmap

- **Judge calibration is cold-start**: BPE thresholds (0.5) are conservative
  placeholders until judge-vs-proxy-label outcomes accumulate; then sweep λ on
  the benchmark+precedent proxy set for FDR ≤ 0.05 (SCOPE conformal).
- **K=1 sampling per framing**: Gemini's spec calls for K=2 stochastic samples
  per framing (4 calls); machinery supports it via repeated `consultJudge`
  calls — enabled once latency budget allows (~4–8 min/question on 32B).
- **No explicit CEGIS loop yet**: override records (`supersedes:`) and signal
  extraction over cases are designed (AutoSpec pseudocode in the audit) but not
  implemented — rule mutations today are human-authored and benchmark-gated.
- **Single judge family**: qwen3:32b verified; jury diversity (llama3.3:70b,
  gemma3:27b per the model audit) is the planned upgrade for heterogeneous
  error modes.
- **Semantic gate constants** (cosine 0.68, hybrid 0.52, overlap 0.25) are
  starting values from the retrieval literature — recalibrate against the
  benchmark once labelled precedent-match outcomes exist.
- **vitest at repo root scans the full worktree** — run scoped:
  `npx vitest run scripts/decisions/decisions.test.ts`.
