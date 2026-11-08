# Autonomous decision ledger — POC

**Status:** proof of concept on branch `poc/decision-ledger`. Not merged, not deployed.
**Risk label (`docs/ai-change-gates.md` §3):** `non-impacting` — adds documentation,
one generated YAML index, two build-time scripts and one test. Touches no `data/`,
`content/`, `site/`, `schema/`, i18n, validator, workflow or policy file, so no
submission claim changes. Nothing here runs at visitor runtime.

## Why

Today every ambiguity a lane hits becomes a question for the founder, serialized
through one person. This POC tests the alternative: **convert each decision into a
record** that is either (a) decided by an existing rule, (b) decided by a cited
precedent already on record, or (c) defaulted to the most conservative reversible
action and logged for later audit. The founder's role shifts from per-decision
blocking to asynchronous sampling of a ledger.

## Components

| File | Role |
|---|---|
| `docs/decisions/precedents.yaml` | Generated index of every decision/ruling/flag already in `docs/` (D-records, FLAG lines, founder rulings). Re-run `npx tsx scripts/decisions/extract-precedents.ts --write`. |
| `scripts/decisions/extract-precedents.ts` | Miner: scans `docs/**/*.md` for `## D-NNN` records, `FLAG:` lines and founder-ruling sentences → `precedents.yaml`. |
| `scripts/decisions/decide.ts` | Pilot pipeline: rule gate → precedent match → safe default → decision record. Dry-run unless `--write`. |
| `docs/decisions/records/` | Decision records emitted by the pipeline (`dec-YYYYMMDD-NNN.yaml`). |
| `scripts/decisions/decisions.test.ts` | Vitest coverage of the pipeline gates. |
| `docs/decisions/rules.yaml` | Canonical rules, gates, domains and autonomy mapping — data, not code. |
| `scripts/decisions/founder-rule.ts` | Writes a founder verdict (`approved`/`rejected`/`held`) into a record's `calibration_log.founder_resolution` — the label stream every agreement metric reads. |
| `scripts/decisions/audit.ts` | Per-surface agreement report + domain rollup + decided-but-rejected worklist + demotion candidates. |
| `scripts/decisions/replay.ts` | Replays mined precedent questions through the engine; `--mask-self` is the generalization test. |
| `scripts/decisions/check-records.ts` | Ledger contract checker: required fields, authority provenance, duplicate ids/hashes, chain integrity. |
| `scripts/decisions/digest.ts` | Governance dashboard: blocked items, safe-state rates, chain/duplicate-hash integrity metrics. |
| `scripts/decisions/mark-applied.ts` | Records `state_chain.current_state: applied` when a decision is acted on. |

## The pipeline (`decide.ts` + `rules.yaml`)

The engine is data-driven: `docs/decisions/rules.yaml` holds every gate, rule,
domain pattern and autonomy mapping — versioned, editable without code, compiled
at load. `decide()` returns a full `trace` of every stage evaluated.

Two modes (`rules.yaml` `mode:` or `--mode`):

- **`conservative` (default)** — non-delegable surfaces route to
  `docs/decisions/docket.md` for the founder; safe defaults hold.
- **`autonomous` (opt-in)** — the engine decides everything. Each gate maps
  to a conservative reversible decision in `rules.yaml` `autonomous.gates`
  (deploy → cost-aware cadence policy; spend → budget proposal; outreach →
  draft-only; delete → never, merge/alias instead; governance → labelled
  proposal). A gate with no mapping still docks — autonomy never invents
  authority. `hard_reject` entries refuse in BOTH modes. Gate-mapping in
  autonomous mode additionally requires the domain on `safe_proceed:` —
  content-domain deletions still docket even when autonomous is on.

Pipeline order:

0. **Founder-reserved** (conservative only) — the question defers to the
   founder → docket.
1. **Gates** — non-delegable list + hard rejects, negation-aware.
2. **Rules** — ~35 canonical rules mined from AGENTS.md, docs/agents/* and the
   full 20k-commit history (doubt→unknown, two-source faith doctrine, homonyms,
   stub-replace, wing defaults, kids' wing, conflict preservation, fail-closed
   external IDs, no-skip lanes, inclusive harvest…).
3. **Precedent** — BM25 over mined precedents **plus the ledger itself**: every
   `decided` record becomes a `ledger-record` precedent, so the system learns
   from its own rulings. Gates: score ≥ 0.6 AND title overlap ≥ 0.3; `flag`
   entries never count.
4. **Judge tier (optional)** — if `DECIDE_JUDGE_CMD` or `DECIDE_JUDGE_URL`
   (OpenAI-compatible: Ollama, LM Studio) is set, held questions get a GenAI
   recommendation recorded as `status: recommended` — advisory only.
5. **Safe default** — conservative reversible hold, `needs_precedent: true`.

**Proposer/disposer contract (`--advisory`)**: any AI model submits
`{question, proposed_action}`; the engine returns `verdict: allow | redirect |
deny | route-to-founder` plus its own authoritative `engine_decision`. Models
propose; the engine disposes. This is the AI-control pattern (untrusted
proposer, trusted deterministic monitor — Greenblatt et al. 2024; SafeChain's
deterministic-policy-engine-then-LLM-judge ordering).

Every outcome writes a decision record with domain, mode, rule/gate id,
precedent scores, trace and provenance. Decided records also carry a `chain:`
block — `depth` (bounded at 1: precedent-step records never become precedents,
so citation chains cannot launder TTL), `root_id`, `root_kind`,
`root_expires_at` and `derived_rule_hash` (a hash of the governing rule text;
`check-records.ts` warns when a later doctrine edit makes a past derivation
stale). Founder verdicts land in `calibration_log.founder_resolution` via
`founder-rule.ts`; `audit.ts` reports per-surface agreement and the
decided-but-rejected worklist.

## Doctrine mined from commit history

The full `origin/main` history (20,332 commits) was mined for founder rulings
and agent decision patterns. Encoded as rules: the doubt rule (absolute — doubt
is `unknown`, never establishment), the strict two-independent-sources faith
rule (office/descent/movement/infobox-only never count; the founder's
Shia-mapping gives `shia-twelver` documented), homonyms never merge
(`data/_homonyms.yaml`), unidentifiable items logged with searches, stubs
REPLACEd in place, unrecognised wings → Ideas, children's-wing rulebook,
conflicts preserved as attributed `debated` readings, external IDs fail-closed,
reach thresholds, inclusive harvest (nothing intelligible dropped, garbled
reported), the no-skip lane rule, and open corrections. The founder's
re-review revert (1 Nov 2026) is the cautionary precedent: agent-drafted
rulings were reverted when they drifted from doctrine — which is why gates
beat precedents and precedents beat nothing.

## Calibration plan (not in this POC)

- Founder samples ~20% of records weekly; agreement rate per decision class.
- Classes holding >95% agreement get wider autonomy; below threshold, the rubric
  tightens or the class returns to the docket.
- `precedents.yaml` is regenerated as lanes accumulate rulings, so precedent
  coverage grows with the repository's own history.

## The inbox flow (batch mode)

Lanes never interrupt the founder directly. A lane that hits an ambiguity drops a
question file in `docs/decisions/inbox/<name>.yaml`:

```yaml
question: "..."
class: "process"
lane: "coverage-programme"
options: ["...", "..."]
evidence: ["docs/...", "..."]
```

`npx tsx scripts/decisions/decide.ts --batch docs/decisions/inbox --write` processes
every inbox file, writes a record per question to `docs/decisions/records/`, and
regenerates `docs/decisions/docket.md` — the short list of items that genuinely need
the founder. The founder reviews the docket asynchronously instead of answering
questions as they arrive.

## Pilot experiment (8 November 2026)

The ten unanswered founder decisions of `docs/coverage-programme/README.md` §7
(decisions 2–11) were run through the batch pipeline as the first real test:

- **5 routed to the founder docket** by the policy gate: corpus access (money),
  edge schema (governance surface), Content-Signal flip (robots.txt), Sahaba lane
  (commission). Render-QA crawl initially hit the gate on the word "deploy" inside
  "not a deploy" — a negation false positive, fixed in the self-heal pass below;
  it now correctly holds at safe-default.
- **6 answered `safe-default` with `needs_precedent: true`**: canon process,
  muhaddithat scope, rijal inclusion, lane registration, Wikidata flag field,
  render-QA crawl. These are genuine governance questions with no on-record
  ruling, so the pipeline correctly refused to invent authority.

## Self-heal pass (8 November 2026)

Issues found and fixed after the first pilot:

1. **False authority via `flag` precedents** — flags are observations, not rulings;
   matching now excludes them (the pilot's wrong "decisions" all came from flags).
2. **Negation false positives** — "not a deploy" tripped the deploy rule; policy
   patterns now skip matches inside negated contexts ("not/never/no/without…").
3. **No idempotency** — re-running `--batch` re-decided every inbox question;
   records now carry `question_hash` and decided questions are skipped.
4. **Self-referential pollution** — `extract-precedents` now excludes
   `docs/decisions/` so the ledger cannot cite itself.
5. **Deploy churn** — `decisions.json` used a build timestamp; it now stamps the
   newest record's date so the file only changes when the ledger does.
6. **Held items invisible** — `docket.md` now has a second section listing
   safe-default holds (questions a precedent would unblock), regenerated from all
   records on disk rather than only the latest run.
7. **Threshold raised** 0.34 → 0.60 plus a title-overlap floor (0.25): probing
   showed summary-only matches confuses "same topic" with "same question"; a
   strong match must overlap the precedent's title. Verified: a full question
   matching D-001 scores 0.75 and decides; the vague short form correctly holds.
8. **Rule table added** — the pipeline's step 1 was only policy gates; canonical
   AGENTS.md answers (duplicates→aliases, Arabic-first, batch cap, immutable ids)
   now decide by `step: rule` before any precedent lookup.

**Finding that changed the design:** the first run matched `flag`-kind precedents
and produced confident-looking but wrong "decisions" (e.g. lane registration
"decided" by an unrelated EI2 flag). Flags are observations, not rulings, so
precedent matching now excludes them. After the fix, zero false decisions were
produced — every unmatched question fell to the conservative default. This is the
behaviour the system must have: better a held question than a fabricated precedent.

## Known POC limits

- Precedent matching is BM25 lexical, not semantic — strong on seen-before
  questions, conservative on novel ones. The judge tier covers the residual.
- `rules.yaml` rules are regex-over-text; they answer HOW questions well but a
  genuinely novel judgment still lands at safe-default or `recommended`.
- Autonomous-mode gate decisions are conservative BY CONSTRUCTION (draft-tier,
  proposals, never-delete) — they decide the safe course, not the ambitious one.
  That is the correct POC posture: autonomy expands coverage, never blast radius.
- Benchmark: `npx tsx scripts/decisions/benchmark.ts` — 70 labelled cases,
  per-class metrics, `--verbose` for traces.
