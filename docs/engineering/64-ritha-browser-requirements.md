# 64. Elegy and Death-Announcement Browser — requirements and acceptance spec

**Status:** built, awaiting production validation · **Lane:** `ritha` · **Plan:** `docs/plan/72-ritha-browser.md` · **Shipped:** `/[lang]/ritha/`, `/api/v1/ritha.json`, `sig/RithaDoors.astro`

## The founder's original brief (20 November 2026, translated from the mixed Arabic and English message)

> Use the microSD instead of the Mac's main drive. Get the latest from main, clone the repo to a separate folder, then start working on **«متصفح أشهر ما قيل في الرثاء والنعي»** (a browser of the most famous things said in elegy and in death announcements). It should list everything mentioned and written about «أشهر ما قيل في الرثاء والنعي» that is in the Qur'an, the seerah, the Sunnah, the stories of the Tabi'in, quotes, and mentioned and written in the books that were harvested and in any future harvested book. Add a box for it on the landing page and in the navigation menus. Do it end to end, with full detailed prose, ready for production at the end. It is only about, and everything mentioned about, «أشهر ما قيل في الرثاء والنعي» anywhere in any Sunni book, the Qur'an, the Sunnah or the seerah. Find every instance where it is mentioned or part of quotes from the Qur'an, Sunnah, hadith, seerah, or from the Sahaba and Tabi'in, and add those stories, mentions, quotes and details. Also add this in the engineering documents as the original requirements so AI can later test and validate it in production. Use the Mac browser for any web page or book, Apple Vision to OCR and harvest books, or other online sources judged authentic. When context is tight, commit and push and continue. Do not wait for build, tests or CI. Make the changes in all the website's languages. Give the browser a unique UI relevant to its content, like the other browsers. At the end commit, push, raise a PR and merge it, then delete all files and folders related to this work from the microSD.

## Requirements

- **RT-R1 — One browser, one graph.** `/[lang]/ritha/` lists every record the graph knows, computed at build time; no side table.
- **RT-R2 — Detection.** `scripts/ritha.ts` matches a guarded Arabic lexicon over passage `text`/`text_search` (and a poem line's title); Qur'an verses come from the reviewed table `RITHA_QURAN`.
- **RT-R3 — Corpus sections.** quran, sunnah, seerah, books, curated; a book harvested later lands automatically in `books`.
- **RT-R4 — Kind.** `ritha_kind` ∈ {ritha, nay, taziya, bukaa}; elegy outranks announcement, which outranks condolence, which outranks weeping.
- **RT-R5 — Curated records.** Records tagged `ritha-browser` (+ `ritha-kind-<kind>`) join the curated section; `concept/ritha-wal-nay` is the umbrella, with prose in all five languages.
- **RT-R6 — Five languages.** Page, landing card, Explore menu, every i18n string, every harvested record's label and summary, and the umbrella prose ship in ar, en, ur, fr and es.
- **RT-R7 — Unique UI.** `sig/RithaDoors.astro` («الرايات الأربع»): four black-selvedge banners, one per kind, each with a count, a corpus bar and three records; the death-notice frame; the famous-formulas cards. Readable without JavaScript, with a table as the text alternative.
- **RT-R8 — Discovery.** Landing card, Explore entry (group `texts`), `browser-registry` row, `docs/site/browsers.md` row.
- **RT-R9 — API.** `/api/v1/ritha.json` with `section`, `ritha_kind`, `signals`, work, ref, excerpt, themes, tags and edges; in OpenAPI `v1.json` and `llms.txt`.
- **RT-R10 — Never a dead end.** Every card links its ordinary entity page.
- **RT-R11 — Sources and safety.** No Qur'an text typed; excerpts at most 40 words (OCR) or 55 words (hadith-api); every record cites a defined source; no content from blocked organisations.
- **RT-R12 — Verification.** `scripts/features-api.test.ts` covers detection, exclusions, future-book inclusion and the export.

## Acceptance tests (production)

1. `/ar/ritha/`, `/en/ritha/`, `/ur/ritha/`, `/fr/ritha/` and `/es/ritha/` render, with lede, banners, formulas and section labels localised.
2. The page shows the four banners and the filter; with JavaScript off the whole list is readable; the kind chips narrow the list.
3. `GET /api/v1/ritha.json` returns items with `section`, `ritha_kind` and `signals`; it is in OpenAPI and `llms.txt`.
4. The curated section holds `concept/ritha-wal-nay`, `event/mutah-prophets-grief-and-condolence`, `event/death-of-ibrahim`, `event/death-of-the-prophet`, `work/hassan-elegy-for-the-prophet`, `work/kab-ibn-malik-elegy-mutah` and `concept/ritha-fiqh`.
5. The Qur'an section holds 2:156 (istirja'), 3:144, 12:84 and 89:27.
6. `passage/bukhari-api-1284` («إن لله ما أخذ وله ما أعطى»), `passage/bukhari-api-3630` (announcing Ja'far and Zayd) and `passage/muslim-api-2127` (Umm Salama's supplication) appear, with kinds taziya, nay and taziya.
7. A passage using «نعتوه» (describing), «عزاه السيوطي» (attributing) or «ورثته أمه» (inheriting) alone does not appear.
8. A harvested-book passage carrying «يرثي فلانا» raises the books section on the next build with no code change.
9. The umbrella record `/en/concept/ritha-wal-nay/` shows the six sections with working links.
