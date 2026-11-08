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
   spending, outreach, licence changes, review-status escalation, content-safety
   hard-block topics, Qur'an text — routes straight to the founder docket. No
   precedent can override this list.
2. **Hard reject.** Figurative depictions of prophets, typed honorifics — reject
   outright.
3. **Precedent match.** Token-overlap similarity between the question and each
   precedent's title+summary; threshold 0.34 (tuned on fixtures; to be calibrated
   against founder spot-checks). A match produces `status: decided` citing the
   precedent's source file.
4. **Safe default.** No rule, no precedent → `hold as draft-tier / pointer-only`
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

## Known POC limits

- Similarity is lexical (token overlap), not semantic — good enough to prove the
  record flow; a real version would embed or use a judge model at build time.
- The non-delegable list is hand-maintained; it should be derived from
  `AGENTS.md` + `docs/ai-change-gates.md` no-go registry over time.
- One pilot decision surface only; expanding to canon/scope/source-admission
  classes is the next step after founder review of this POC.
