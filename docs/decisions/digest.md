# Governance digest — autonomous approver metrics

Generated: 2026-11-08T10:37:20.983Z by `scripts/decisions/digest.ts` (also runs at the end of every `--batch --write`).
This file is a dashboard, not a log — history lives in the records and in git.

## Headline

**Blocked items: 13** — 5 founder-docket/rejected record(s) + 8 inbox question(s) with no decision record.
Target: 0. Any nonzero count in a live class is a defect report, not a workload.

## Metrics

| metric | value | threshold | status |
|---|---|---|---|
| blocked-item count | 13 | 0 | ALERT |
| autonomous decision rate | 11% of decided records (1/9; 2 substantive) | ≥95% of in-scope | watch |
| held pending precedent | 7 | downward trend | info |
| safe-state rate by domain | ?: 86%, sources: 0%, safety: 100% | >40% in a live class = alert | info |
| override / reversal rate | 0% (0 override record(s)) | >2%/class/cycle demotes; >5% immediate | OK |
| benchmark debt (override-pending cases) | 0 | >0 sustained 2 cycles = alert | OK |
| expired-decision backlog | 0 past expires_at | >0 older than 14d past expiry | OK |
| judge dissent rate | n/a of judged records (0) | safe-state routing >10% of judged = alert | info |
| verification-failure rate | instrumentation: partial — state chain (decided→applied→merged→deployed→verified-live) not yet implemented | >0 itemised | partial |
| gate integrity | instrumentation: partial — literal gate-string assertion lands with the merge path (rollout step 10) | 100% binary | partial |

## Founder docket items

- dec-20261108-002 — Can we mark these 400 records reviewed and published? (`founder-docket`/`policy-gate`)
- dec-20261108-005 — Content-Signal flip: add 'Content-Signal: search=yes, ai-input=yes, ai-train=no' as one line in site/public/robots.txt — the data is already CC0 so the flip grants nothing the licence does not; reversible. (`founder-docket`/`policy-gate`)
- dec-20261108-006 — Corpus access for Phases 3, 4, 5, 7, 8: the founder runs the rijal name-match and returns counts; for Nadwi and DİA decide whether to purchase, scan or use the free index. (`founder-docket`/`policy-gate`)
- dec-20261108-010 — Edge schema for rijal Phase 4: confirm the studied_under and transmitted-to predicates, or propose new ones through schema/predicates.yaml. (`founder-docket`/`policy-gate`)
- dec-20261108-012 — Commission the Sahaba lane: a separate harvest commission on the modern-figures machinery (al-Isaba / Usd al-Ghaba) sequenced after Phase 1 — commissioned only on the founder's explicit word. (`founder-docket`/`policy-gate`)

## Undecided inbox items

- `canon-decision-process.yaml` — 0d old
- `content-signal-flip.yaml` — 0d old
- `corpus-access.yaml` — 0d old
- `lane-registration.yaml` — 0d old
- `muhaddithat-scope.yaml` — 0d old
- `rijal-edge-schema.yaml` — 0d old
- `rijal-inclusion.yaml` — 0d old
- `sahaba-lane.yaml` — 0d old

## Expired decisions (re-review before reuse as precedent)

_None._
