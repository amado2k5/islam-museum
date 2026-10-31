# Phase 03: The rijal graph (narrators and teacher–student edges)

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

Create narrator entities from the rijal corpus with dated, graded facts and teacher–student edges, in century waves. This phase is what makes the Isnad Explorer buildable.

## Source corpora and access

- Tahdhib al-Kamal (al-Mizzi, d. 742 AH) — canon `tahdhib-kamal`.
- Tahdhib al-Tahdhib and Taqrib al-Tahdhib (Ibn Hajar, d. 852 AH) — canon `tahdhib-tahdhib`, `taqrib-tahdhib`.
- Mizan al-I'tidal (al-Dhahabi, d. 748 AH) — canon `mizan-itidal`; Siyar A'lam al-Nubala (canon `siyar-alam-nubala`).
- **Access:** the harvested files are on the founder's microSD, not readable in this session. Count and sample must be run by the founder (Mac name-match).

## Size estimate and derivation

Unsized. The narrator count of these corpora is not measured here, and no figure is given in this plan. The pilot will measure: (a) sample-based yield of entries that pass the inclusion rule; (b) overlap with the 10,481 existing persons; (c) edges per entity. Batch count = expected new narrators ÷ 25, computed after the pilot.

## Entry criteria

- Phase 2 pattern proven (person records).
- Founder decision 4 (rijal inclusion rule: non-Sunni narrators in the corpora).
- Founder decision 6 (edge schema: `studied_under` and transmitted-to predicates in `schema/predicates.yaml`).
- Founder runs the name-match and returns counts.

## Exit criteria (definition of done)

- Pilot: one century (sample of at least 30) with yield, overlap and edges measured and recorded.
- Every edge written once in `data/` (inverses computed).
- Dated facts and gradings are attributed: a grade is recorded as a fact about the rijal literature, with its source; never the museum's verdict.
- Validate 0 errors; cite-check 0 fail.

## Lane mechanics

Waves by century. Place-entity pre-check in every brief. Edge schema checked before any wave writes an edge. Waves of 10 (5+5 across two writers); at most 25 entities per batch; schema-shape checklist in every brief; cite-check gated on the literal "0 fail"; validate gated on the literal "0 errors" as a separate asserted step; queue file with `[ ]` / `[x]` / `[~]`; STOPs logged, not guessed; founder flags one line each; no-skip rule within scope.

## Dependencies on other phases

- Depends on Phase 2 (pattern) and Phase 1 (ledger for the cited books).
- Phase 13's census can use its edges for thickening.

## Known risks

- Graded narrators from non-Sunni traditions: labelled, sourced, no verdict.
- Edge explosion: the corpus has many chains; edges are written only where the source states the teacher–student link.
- The Isnad Explorer is a future feature, out of scope here: no UI work in this programme.

## Founder decisions needed before this phase starts

- Decision 4 (rijal inclusion).
- Decision 6 (edge schema).
- Decision 5 (corpus access).
