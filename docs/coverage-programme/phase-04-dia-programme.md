# Phase 04: DİA as a programme

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

A systematic pass over the TDV İslâm Ansiklopedisi for entities that the Arabic and English sources cover thinly, Ottoman and Turkish worlds first. Turkish sources admitted on the same terms as any other.

## Source corpora and access

- TDV İslâm Ansiklopedisi, online at islamansiklopedisi.org.tr. **Homepage read in this session. Article count (brief: about 16,800) not verified. Access terms for a systematic crawl not checked.**
- The site cites biographies by named authors (for example, İsmail E. Erünsal on Turkish literature); their authorship is recorded, not reproduced.

## Size estimate and derivation

Unsized until an index crawl is done. The brief's figure (about 16,800 articles, 44 volumes plus supplements) is an unverified claim. Thirteen data files cite the DİA domain today, so the baseline overlap is small. First deliverable: an index crawl (counts by letter and by category), then a 30-entry sample with a measured yield.

## Entry criteria

- Phase 1 for cited books where DİA cites a canon book.
- Founder decision 5 (access terms and whether a crawl is permitted).
- Turkish-language prose: Arabic first still applies; the Turkish source is first-class for facts.

## Exit criteria (definition of done)

- Index crawl recorded with counts.
- 30-entry yield sample, overlap with existing `source/` and `person/` recorded.
- Every entity cites the DİA article with its named author where the article names one.
- Validate 0 errors; cite-check 0 fail.

## Lane mechanics

Waves by category (Ottoman, Turkish, then Ottoman-world places). Waves of 10 (5+5 across two writers); at most 25 entities per batch; schema-shape checklist in every brief; cite-check gated on the literal "0 fail"; validate gated on the literal "0 errors" as a separate asserted step; queue file with `[ ]` / `[x]` / `[~]`; STOPs logged, not guessed; founder flags one line each; no-skip rule within scope. Turkish prose translated into Arabic first per `docs/language.md`.

## Dependencies on other phases

- Depends on Phase 1 for canon citations.
- Contends with Phases 6 and 7 for `place/` and `polity/`: run place pre-check.

## Known risks

- Crawl under the site's terms: founder confirms before any crawl.
- Turkish-to-Arabic translation accuracy: a translator note on each record.
- Overlap with EI2 (Phase 5) on the same entries: reuse first.

## Founder decisions needed before this phase starts

- Decision 5 (access terms for DİA).
- Confirm whether Turkish-language DİA prose is an allowed source for Arabic prose under the standing rules.
