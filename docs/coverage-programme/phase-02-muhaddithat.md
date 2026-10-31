# Phase 02: The muhaddithat (women hadith scholars)

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

Create person records for women hadith scholars from Nadwi's *Al-Muhaddithat* and cross-check against al-Sakhawi's *al-Daw' al-Lami'* (vol. 12 on women) and Ibn Hajar's *al-Isaba*. Pilot first (one century or one letter sample), then full waves.

## Source corpora and access

- Nadwi, *Al-Muhaddithat / Al-Wafa bi-Asma' al-Nisa'*: 43 volumes, Arabic, Dar al-Minhaj (Jeddah, 2021). **Readability from this environment not verified.** Needs founder-supplied text or a checked sample.
- al-Sakhawi, *al-Daw' al-Lami'* (volume 12 on women, per the brief, unverified): not checked in canon in this session; founder confirms holdings.
- `isaba` (Ibn Hajar) is in canon (`scripts/harvest/library/books.yaml`).

## Size estimate and derivation

Target: 9,328 female scholars (Aga Khan Library listing, cited in Wikipedia); Al-Salam Institute gives about 10,000. Working target 9,328 minus matches to existing records. Existing female persons: 538 (of 10,481). Matches unmeasured. Batches: at 25 per batch, with no matches, at least 374 batches (9,328 / 25, rounded up). At 10 per wave with no matches, that is about 933 waves: the pilot must measure the match rate, because it sets the batch count directly. This phase is unsized until then.

## Entry criteria

- Founder decision 3 (scope, faith labelling).
- Nadwi text access confirmed for the pilot slice (founder-supplied).
- Phase 1 ledger entry for any book cited as a source (`isaba` is canon with its ledger decision still undecided).
- Name-matching normaliser for Arabic names, documented.

## Exit criteria (definition of done)

- Pilot: one century (or one letter) sample of at least 30 entries, name-matched against existing data; match rate recorded and batch count re-sized.
- Every record: rich first-pass prose in Arabic, English and Urdu; one defined cited source; provenance block.
- Faith recorded only on two independent sources; otherwise `unknown` with a note.
- Validate 0 errors; cite-check 0 fail on every batch.

## Lane mechanics

Pilot: one batch of 10 (5+5) from the chosen slice, reviewed by the founder before the harvest. Then waves per the standing machinery. Waves of 10 (5+5 across two writers); at most 25 entities per batch; schema-shape checklist in every brief; cite-check gated on the literal "0 fail"; validate gated on the literal "0 errors" as a separate asserted step; queue file with `[ ]` / `[x]` / `[~]`; STOPs logged, not guessed; founder flags one line each; no-skip rule within scope.

## Dependencies on other phases

- Shares the person-entity pattern with Phase 3 (the pilot proves it).
- Depends on Phase 1 only for the cited books' ledger status.

## Known risks

- Overlap with existing persons creates duplicates: match first; duplicates become aliases.
- Transmitter-level biography drawn from a source with no verdict on reliability; any reliability grade is attributed.
- Scale: about 374 batches minimum; time per batch from the pilot.

## Founder decisions needed before this phase starts

- Decision 3 (scope and faith labelling).
- Decision 5 (Nadwi access).
