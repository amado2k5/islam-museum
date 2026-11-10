# 28. Quran.com discovery

Status: **approved in chat by the founder, 6 November 2026, route (c) "Discovery only"**. This is a planning document. It changes no data and no content. Each later step is a separate pull request with its own proposal line in its description.

## 1. Proposal record (section 1 of `docs/ai-change-gates.md`)

| Field | Value |
|---|---|
| Feature | Use the public catalogs of Quran.com (Quran Foundation Content API resource lists) only to discover which Qur'an commentaries, translations and reciters exist, and check each against the sources islam.museum already holds or can cite from books |
| Approval | Founder, in chat, 6 November 2026: "Discovery only" |
| Risk label | `non-impacting` (documentation only) |
| Files, this step | this document; `docs/plan/00-README.md` (index row); `CANARY.md` |
| Out of scope | copying any text, translation, tafsir passage, word-level data, audio or media from the API; any Qur'an text; any `data/` record created from API output; any API key or account |

## 2. Findings that set the route

Source: the Quran Foundation documentation portal (`api-docs.quran.com`) and its Developer Terms, last updated 11 October 2026.

- **Catalogs are available**: translations, tafsirs, languages, reciters, recitation styles, chapter infos, and the canonical core `quran_core:1` (Uthmani, IndoPak and Imla'i word text, surah metadata, Juz/Hizb boundaries).
- **Redistribution is restricted**: offering API data to others as data, in a dataset, feed, download or API, needs a signed commercial licence. islam.museum publishes `data/` as CC0 files and an API, so raw API output must not enter `data/`.
- **Caching is limited to 7 days**, except through the Content Sync endpoints, which have their own sync duties.
- **Scraping is prohibited** outside API responses.
- **Derived materials** that reproduce or permit reconstruction of the content stay under the same restriction.
- **Credentials**: a registered client ID and secret are needed. No account is created or used under this plan.

The Developer Terms conflict with the standing rule that any source may be read and its facts entered in `data/` (`docs/sources-policy.md`). Route (c) is chosen so that nothing enters `data/` from the API while the question stays open with the founder.

## 3. Phases

| Phase | Content | Merge rule |
|---|---|---|
| 1 | This plan, index row and canary entry | `npm run validate`, `npm test`; merged by pull request |
| 2 | Coverage check: list the 6,350 `data/passage/quran-*.yaml` records against the 6,236 verses and note any gaps. Output is a note in this document's section 5, not a data change | read-only |
| 3 | Edition checklist: for each tafsir, translation and reciter named in the catalogs, record whether a source record already exists in `data/source/` or `data/work/`, and whether a book is available to cite. Names, editions and years are taken from the catalog's listing and checked against the book itself before any record is made | read-only, then a documentation pull request |
| 4 | Gap follow-ups: each edition with a book in hand becomes a separate source or work record, written from the book under the existing rules. Editions with no book are listed as leads | one pull request per batch, under the normal gates |
| 5 | Ledger update: the `websites/quran.com` authenticity-ledger entry and `data/listing/quran-com.yaml` are updated with the terms reading and the discovery result | documentation only |

Route (a) or (b) would be a new proposal to the founder. Nothing in this plan moves to them without a fresh approval.

## 4. Rules that continue to apply

- Qur'an text comes only from the frozen Tanzil files. A difference found with `quran_core` is reported to the founder and never edited.
- No honorifics, no figurative depictions, no AI-generated portraits, and the Arabic parenthesis rule for any Arabic text written.
- Any person named as a translator, tafsir author or reciter is checked against the inclusion and perspective rules in `AGENTS.md`.

## 5. Results log

| Step | Date | Result |
|---|---|---|
| Phase 2 | not started | |
| Phase 3 | not started | |
