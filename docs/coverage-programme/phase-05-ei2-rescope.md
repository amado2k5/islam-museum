# Phase 05: EI2 re-scope (the live `ei2` lane)

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

Recognise that the Encyclopaedia of Islam, 2nd edition, is already an approved, running lane (scope B, 24 October 2026). Reconcile PR #1599 with `main`, record its state accurately, and confirm the lane's schema on current `main`. No re-issue.

## Source corpora and access

- EI2 (Brill, 1954–2008): 13 volumes per `docs/agents/lanes/ei2.md`. Founder-supplied PDFs; OCR in progress per the lane.
- Source entity `source/encyclopaedia-of-islam-2`; Brill copyright, not verified as public domain; facts and rewritten prose enter the repository, verbatim beyond a 40-word quotation does not.

## Size estimate and derivation

Size: the lane's own scope (13 volumes, as `docs/agents/lanes/ei2.md` states, all entries, A to Z). Entry count per volume not measured here. The lane's progress file (`docs/delegation/ei2-progress.md`) is the record of batch sizes; Phase 5's size is the lane's, not this plan's. PR #1599: GitHub records MERGED on 25 October 2026 (`mergedAt` equals `closedAt`), while its body says it was held until main validated. Read on `main` before any change.

## Entry criteria

- Founder confirms that Phase 5 is a re-scope, not a new lane.
- `git log` on `main` confirms PR #1599's content state.

## Exit criteria (definition of done)

- PR #1599 state recorded accurately in `progress.md`.
- Lane's schema checked against current `main`; a wrong-dialect entry (the wave-32 lesson) caught before merge.
- Validate 0 errors; cite-check 0 fail.

## Lane mechanics

The lane's own mechanics (`docs/agents/lanes/ei2.md`); English-first drafting, then Arabic, then Urdu, per the lane's founder decision of 24 October 2026. Waves of 10 (5+5 across two writers); at most 25 entities per batch; schema-shape checklist in every brief; cite-check gated on the literal "0 fail"; validate gated on the literal "0 errors" as a separate asserted step; queue file with `[ ]` / `[x]` / `[~]`; STOPs logged, not guessed; founder flags one line each; no-skip rule within scope.

## Dependencies on other phases

- Shares `place/` and `person/` with Phases 4, 6, 7; reuse first.
- Phase 1 ledger for cited books.

## Known risks

- The lane's English-first order is a founder policy amendment; `docs/language.md` is unchanged until the founder amends it.
- OCR errors in headword columns: checked against page images.

## Founder decisions needed before this phase starts

- Decision 1 (approve the re-scope).
