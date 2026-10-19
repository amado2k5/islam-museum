# Wikidata insertion plan (owner: maintainer session, started 19 Oct 2026)

Goal: bring the Islam and Muslim-history part of the local Wikidata subset (`layers/cc0/wikidata-v2`) into the site data, without breaking the build, without invented sources, and in reviewable batches.

## 1. What "in scope" means (the decision rubric every agent follows)
An item is in scope if at least one holds, checked in the subset:
- its label or description names an Islamic polity, ruler, scholar, city, mosque, madrasa, battle, treaty or work of Islamic history; or
- it has a claim `P140` (religion) = Q432 (Islam) or a subclass; or
- it is an Islamic-world person (occupation or position in a scope class) who died before 1800 CE.
Out of scope: film and TV titles, Commons categories, scholarly articles, paintings and coins unless the subject is a scope item, modern Saudi mosques with no historical record, and anything without a Wikidata description.

## 2. Autonomous decision rules (no question to the owner needed)
For every candidate item, the agent decides in this order:
1. **Existing record?** Search `data/` for the Wikidata ID and for the English and Arabic labels. If found: **link** (add `external_ids.wikidata`) only if the description matches the record. Otherwise go to 2.
2. **Duplicate or near-duplicate?** If a record covers the same entity under another name, link it and do not create a new one.
3. **In scope?** If not, **skip** (log it).
4. **Source available?** Find at least one real book, confirmed in a library or publisher catalogue (WorldCat, a national library, the publisher). Wikidata and Wikipedia are pointers only, never sources. If no book source can be confirmed, **skip and log**: never invent a citation, page, ISBN or date.
5. **Create** a draft record: class, slug, Arabic and English labels, a short summary in Arabic (English optional), the Wikidata ID, dates only where a source supports them (year precision, with a second source or a flag), and the source record. Status `draft`, completeness 1.
6. **Batch cap:** at most 25 new records per agent commit.

Tie-breaks: prefer linking to creating; prefer a skip with a reason to a weak record; a date with one source is kept with a flag, a date with no source is left out.

## 3. Hard rules (from AGENTS.md; never relaxed)
- Arabic label and summary required; no honorifics typed (no ﷺ, صلى الله عليه وسلم, عليه السلام, رضي الله عنه, رحمه الله).
- Qur'an text is never typed.
- AI output is `status.review: draft`; never `reviewed` or `verified`.
- Commit only explicit paths; never `git add -A`; never touch `data/_stubs.yaml`, `docs/status.md` or enum files (append to your own `data/_stubs.d/<slice>.yaml` if needed).
- Before each commit: `npm run validate` must report 0 errors; then `npm run coverage` in the same commit.
- Attribution trailers on every commit: `AI-Agent`, `AI-Model`, `AI-Editor`.

## 4. The ten slices (no two slices write the same entity)
| Slice | Scope (subset query basis) | Expected kind |
|---|---|---|
| S1 | polities: dynasties, caliphates, emirates, sultanates with P140 Islam, not yet in data | new polity records |
| S2 | rulers: humans with P39 (position) in caliph, sultan, emir, khan, shah classes, died before 1800 | new person records |
| S3 | jurists, theologians, hadith scholars, Sufi masters: occupation in those classes, died before 1800 | new person records |
| S4 | mosques, madrasas, caravanserais, palaces with P140 Islam and at least 10 sitelinks | new building records |
| S5 | cities and historical regions in the Islamic world (P31 city or region, P17 in a Muslim-majority country, at least 20 sitelinks) | new place records |
| S6 | battles, sieges, treaties from q06 and q07 seeds, scope-checked | new event records |
| S7 | Companions and early-Islam persons (seed set q05 plus Prophet's family) not yet in data | new person records |
| S8 | works: Qur'an commentaries, hadith collections, chronicles, philosophy and science texts by Islamic authors | new work records |
| S9 | scientists, physicians, astronomers, mathematicians of the Islamic world, died before 1600 | new person records |
| S10 | audit: the 1,700 existing records still without a Wikidata link. Link only (rule 1), no new records | links only |

## 5. How each agent works
1. Read this plan, `AGENTS.md`, `docs/agents/content-standards.md`, and one existing record of its class.
2. Query the subset for its slice (duckdb at `/Volumes/exmicroSD/islam-museum-harvest/layers/cc0/wikidata-v2/wikidata-subset.duckdb`, read-only; the venv is `/Users/ahmedabdelaal/Documents/GitHub/islam-museum/.venv-harvest`).
3. Apply the rubric to each item, record the decision, and stop at 25 new records per commit.
4. Write the slice log `docs/delegation/wikidata-insertion/<slice>.md` with one line per item: decision and reason.
5. Commit on the agent's own branch, not `main`, with explicit paths and trailers. Report back the counts: created, linked, skipped, and the commit hash.

## 6. Coordinator (maintainer session) duties
- Merge the ten branches one at a time, validate after each merge, and fix conflicts only in the slice logs.
- Push to `main` only after the full merge validates with 0 errors.
- Regenerate coverage once at the end, not per slice.
- Update `docs/delegation/wikidata-insertion/PLAN.md` with the results and the next wave.

## 7. Batching and order
- Wave 1 (this run): all ten slices, one batch each (up to 25 new records per slice).
- Wave 2: continue each slice from its log's "next" marker, one batch per run.
- Stop a slice when its scope is exhausted or its skip rate exceeds 80 percent.

## 8. Known limits (stated up front)
- Source discovery is the bottleneck. Expect many skips for obscure people and places.
- The subset covers only about 838k items, so some expected entities are missing and will stay missing until a later rebuild.
- The site build already has about 20,900 entities; each wave is validated before merge so that the build keeps working.
