# Plan: Arabic prose for the entities that have none

_Written 23 October 2026. Lane: `docs/agents/lanes/prose-backfill.md` (this plan replaces its "slug order, 25 at a time" tail strategy). Branch `claude/enrich-entities-ar-prose-fc38ef`. Status: Phase 0 done (numbers below); Phases 1 to 5 not started._

## 1. What the gap is

12,862 entities have a `data/` record and no `content/ar/` prose (bibliography classes excluded; the number includes 467 `media/*` captions that take no prose page). Counting without media: **12,395**.

- **12,249 are Wikidata "draft cards"**: `summary.ar` starts «بطاقة أولية… لم تُراجع الصفحة بعد». They have no dates, coordinates or relations (5,459 of the 5,463 buildings have neither coordinates nor a date). The `source/...` they cite (5,172 buildings cite `tarikh-islam-hasan-ibrahim`, 2,350 persons cite `al-aalam`) is a loose attribution: nobody read the page.
- About 146 have real extracted content.
- The lane did 1,487 entities in 68 batches of 25. At that pace the rest takes about 500 batches, and prose written from a card alone would be padding, which the thin-file rule forbids.

So the work is to find, by evidence, which entities a library book actually supports, draft only those, and leave the rest as honest cards.

## 2. Phases

0. **Triage (no model).** Name locator over the harvest books, duplicate and alias sweep, scope filter. Done; see section 3.
1. **Fix the metric.** Report "prose-eligible" (no media) and the buckets below in `docs/coverage.md` and the priority report.
2. **Grounded drafting (bucket 1, then 2).** Group by book so each book is read once. Per entity: pull located pages, build a claims table (claim, page, quote of at most 40 words) with `claims_pipeline.py` / `dict_entry.py`; draft with `draft_prose.py` (restate-only); automated gates: `verify_cites.py`, regex for honorifics, Qur'an glyphs and quotes over 40 words, a second-model entailment check of each sentence against its page, `npm run validate`. Failures go to a reject pile, never committed. All output `status.review: draft` with `provenance`. 25 entities per commit; one PR per class and book.
3. **Wikidata-only entities.** Pull structured facts (inception, coordinates, country, architect) from the local `wikidata-subset.duckdb` into `data/`, flagged "second source needed". No prose until a real source exists.
4. **Nothing found.** Leave the card, log the miss. Re-run the locator when more books are OCR'd (147 PDFs on the drive still have no OCR).
5. **Keep it honest.** Re-run the ranking after each merge; `npm run coverage` in the same commit.

## 3. Phase 0 results (23 October 2026)

Tools (committed): `scripts/harvest/library/locate_names.py` (Aho-Corasick over 1,094 extracted books, 2.4 GB of text, one pass, about 20 minutes) and `scripts/harvest/library/triage_gap.py`. Outputs stay in `~/islam-museum-harvest/work/prose-gap/` (`locator.jsonl`, `triage.json`), outside git.

A bucket is decided by the normalised Arabic label and aliases found as a whole phrase on a page (diacritics, hamza, ta marbuta and punctuation folded). "Distinct works" counts a book once however many scans or editions of it exist.

| Bucket | Entities | Meaning |
|---|---|---|
| 0 Duplicate of an entity that already has prose | 50 | alias candidates; merge, do not write |
| 1 Grounded in 2 or more distinct works | **1,216** | first drafting target |
| 2 Grounded in 1 work | **622** | second target; needs a second source for dated facts |
| 3 No hit | 8,087 | unknown: genuinely absent, or OCR/spelling variance |
| 4 No Arabic name to search | 1,856 | Latin or Turkish transliteration in `label.ar` (1,637 buildings, 109 works, 84 persons) |
| 5 Generic name (more than 60 pages) | 564 | e.g. «الجامع الكبير»; needs disambiguation by context |

By class (buckets 1 + 2): person 833, building 310, work 446, event 198, group 28, polity 19, place 3. Buildings are 44% of the gap and only 6% grounded; persons and works are the productive classes. The books that ground the most entities are Siyar A'lam al-Nubala, al-A'lam (al-Zirikli), Shadharat al-Dhahab, Tarikh Ibn Khaldun, Hasan Ibrahim's Tarikh al-Islam, Subul al-Huda, al-Isaba, al-Bidaya wa'l-Nihaya and Nafh al-Tib.

Scope: 16 buildings carry a non-Islamic name (church, manor, palace in Polish and similar, for example `building/zespo-pa-acowy-w-roztoce`) and 56 have an unusual `kind`; a list for the founder's decision, nothing deleted.

### Caveats
- A name on a page is not proof the page is about this entity: «عبد الأعلى بن وهب» also appears in the Kuwaiti fiqh encyclopedia. Bucket 1 and 2 are candidates; the claims pass must confirm identity before any sentence is written.
- Bucket 3 is a lower bound on what exists. The next locator pass should add fuzzy variants (drop the nasab chain to first name plus last name, kunya forms) and the page-image OCR where the text is poor.
- Bucket 4 needs an Arabic name first: from Wikidata labels in the local subset, or from the cited book once located.
- The cited source was not used to decide a bucket; the match is against the whole library.

## 4. Decisions still with the founder
- The 25-per-batch cap (`AGENTS.md`): kept for now, many commits per PR.
- What the 8,000-odd entities with no located source become: cards indefinitely, or a short data-driven page.
- The scope list (section 3).
- Deployment is the founder's alone; none of this publishes.
