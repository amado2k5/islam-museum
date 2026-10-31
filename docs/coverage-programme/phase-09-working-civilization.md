# Phase 09: The working civilization

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

Routes (Hajj and trade), coinage, weights and measures, waqf, guilds, markets and souqs, courts and the tax and land regimes. Entities and the relations that make them a system, not a list.

## Source corpora and access

- Canon: waqf and fiqh works as available; coinage catalogues; **access to economic-history sources not checked in this session.**

## Size estimate and derivation

Unsized. Presence measure: waqf 88 files, coin 92 (mostly mentions), guild 7, souq 6, darb 42 (mentions), Hajj-caravan 2. Pilot: one system (for example, the Darb Zubaydah) with its entities and edges; the pilot measures relations per entity.

## Entry criteria

- Phase 1 for cited canon.
- Relation predicates confirmed (`schema/predicates.yaml`).

## Exit criteria (definition of done)

- Pilot system with entities and edges written once.
- Validate 0 errors; cite-check 0 fail.

## Lane mechanics

Waves by system (routes, coinage, waqf, guilds, courts). Waves of 10 (5+5 across two writers); at most 25 entities per batch; schema-shape checklist in every brief; cite-check gated on the literal "0 fail"; validate gated on the literal "0 errors" as a separate asserted step; queue file with `[ ]` / `[x]` / `[~]`; STOPs logged, not guessed; founder flags one line each; no-skip rule within scope.

## Dependencies on other phases

- Contends with 8 and 10 for `concept/` and `place/`.

## Known risks

- Coinage and weights: values differ by region and period; each stated with its source and as derived where converted.

## Founder decisions needed before this phase starts

- None beyond decision 6 (edge schema) if new predicates are needed.
