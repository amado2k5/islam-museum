# Phase 12: The Wikidata second-source debt

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

A verification lane: work the flagged person records in batches. Each dated fact either gains its second source or is marked honestly. No new entities.

## Source corpora and access

- Wikipedia and Wikidata are fact sources only for the entity facts named in `docs/agents/`; the recorded revision and the authenticity ledger apply.
- A second source for each dated fact: an independent named source.

## Size estimate and derivation

Range, not a figure. Person files mentioning Wikidata: 5,604 (text match). The brief's flagged count (about 4,199) is not measured; the flag field must be counted. Size = flagged records ÷ batch of 25, computed after the count. Until then: between 0 and 5,604 records in scope.

## Entry criteria

- Founder decision 7 (confirm the flag field and count).

## Exit criteria (definition of done)

- Every flagged dated fact gains a second source or is marked honestly as single-sourced.
- No new entities. No deletions without founder approval.
- Validate 0 errors; cite-check 0 fail.

## Lane mechanics

Batches of 25 existing records. Edits to existing records only, with a per-record note. Waves of 10 (5+5 across two writers); at most 25 entities per batch; schema-shape checklist in every brief; cite-check gated on the literal "0 fail"; validate gated on the literal "0 errors" as a separate asserted step; queue file with `[ ]` / `[x]` / `[~]`; STOPs logged, not guessed; founder flags one line each; no-skip rule within scope.

## Dependencies on other phases

- Runs in parallel with everything: it touches existing `person/` records only.
- Contends with 2 and 3 on the same `person/` files: coordinate by id.

## Known risks

- Second-source search returns the same source twice: that is one source, not two.

## Founder decisions needed before this phase starts

- Decision 7.
