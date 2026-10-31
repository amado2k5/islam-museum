# Phase 01: Canon decisions

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

Record an authenticity decision (accept / label / reject / undecided, with reason) for each of the 286 undecided canon books, in the shape the authenticity system already uses.

## Source corpora and access

- `scripts/harvest/library/books.yaml` (289 canon books) — in git.
- `docs/authenticity-ledger/books/` (259 records, 256 undecided) — in git.
- `scripts/harvest/library/authenticity.yaml` (register; 3 decisions) — in git.
- Source for checks: named editions or institutional records. Not all holdings are confirmed in this session; the founder states which editions are held.

## Size estimate and derivation

Size: 286 decision records. Derivation: canon count (289) minus decided (3) = 286, confirmed by `npx tsx scripts/check-authenticity.ts`. Throughput is bounded by founder review, not agent work: the ledger README says decisions are recorded only by the founder. A batch size is set by the founder, not estimated here.

## Entry criteria

- Founder has chosen the review process (README decision 2).
- The register's shape is confirmed for each record (`decision` with `work`, `decided_by`, `decided_on`, `reason`).

## Exit criteria (definition of done)

- Every undecided book has a recorded decision, or is explicitly left `undecided` with a reason.
- `npx tsx scripts/check-authenticity.ts` reports 0 errors; the canon warning count is reduced by the number decided.
- No decision recorded by an agent.

## Lane mechanics

Each batch: the founder names the books; the agent prepares the check list from the ledger (no decision text); the founder records the decision. Progress recorded in `progress.md`. No wave machinery applies to decisions.

## Dependencies on other phases

- Phases 2, 3, 6–11 cite against this ledger, so their citation checks depend on it.
- Phase 12 and 14 do not depend on it.

## Known risks

- Bottleneck is founder time.
- A decision recorded from a non-named edition would be invalid under the ledger's rules; checks against websites are `valid: false`.

## Founder decisions needed before this phase starts

- Decision 2 (process).
