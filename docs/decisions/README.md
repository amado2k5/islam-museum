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

## The pipeline (`decide.ts`)

1. **Policy gate (deterministic).** A non-delegable list — deploys, deletions,
   spending, outreach, licence changes, review-status escalation, governance
   surfaces (schema, predicates, robots.txt, headers, infra, CI), commissions,
   content-safety hard-block topics, Qur'an text — routes straight to the founder
   docket. Matches inside negated phrases ("not a deploy") do not count. No
   precedent can override this list.
2. **Hard reject.** Figurative depictions of prophets, typed honorifics — reject
   outright.
3. **Canonical rules.** A small table of questions the repository already answers
   unambiguously (duplicate → alias of the richer entity, Arabic-first prose,
   25-entity batch cap, immutable ids) — each cites its source document.
4. **Precedent match.** Token-overlap similarity, but gated twice: score ≥ 0.6
   AND title overlap ≥ 0.25 (a precedent's title carries its subject; summary-only
   or table-row matches cannot decide). Only `decision-record` and `ruling` kinds
   count — `flag` entries are observations, not rulings.
5. **Safe default.** No rule, no precedent → `hold as draft-tier / pointer-only`
   with `needs_precedent: true`. Never escalates review status, never deletes,
   never asserts a contested fact.

Every outcome writes a decision record: id, date, lane, question, options,
status, step, decision, confidence, reversibility, rationale, precedent citation,
`review_sampled` flag, and `decided_by` provenance.

## What is deliberately NOT autonomous

Deploys (founder-only, cost), deletions, spending, external communications,
licence changes, review-status escalation, anything under the content-safety hard
block, and Qur'an text. These stay founder decisions permanently — that is
governance, not a limitation to engineer away.

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

- Similarity is lexical (token overlap), not semantic — good enough to prove the
  record flow; a real version would embed or use a judge model at build time.
  The flag-exclusion fix shows the failure mode: lexical matches feel authoritative
  while being wrong, so matched precedents should display their score and source
  for human spot-checks.
- The non-delegable list is hand-maintained; it should be derived from
  `AGENTS.md` + `docs/ai-change-gates.md` no-go registry over time.
- One pilot decision surface only; expanding to canon/scope/source-admission
  classes is the next step after founder review of this POC.
