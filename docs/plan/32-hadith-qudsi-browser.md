# 32. Hadith Qudsi Browser

Status: **requested by the founder in chat, 9 November 2026** ("create متصفح الأحاديث القدسية ... make it shown on main landing museum page as well as in navigation, work end to end until you have included all the الأحاديث القدسية"). Data, page, API and search ship in one pull request; the records stay `status.review: draft` until a human reads them.

## 1. Proposal record (section 1 of `docs/ai-change-gates.md`)

| Field | Value |
|---|---|
| Feature | Hadith Qudsi Browser (متصفح الأحاديث القدسية): every hadith qudsi of the six books and the Muwatta of Malik, each hadith with its narrations in every collection, arranged by theme, at `/[lang]/qudsi/`, with an Explore menu entry and a landing card |
| Approval | Founder, in chat, 9 November 2026 |
| Risk label | `submission-impacting` (adds `/api/v1/qudsi.json`, the data-extraction route named in `docs/ai-change-gates.md` section 3); not `rewrites-all-pages` beyond the Explore menu entry and landing card that every browser adds |
| Files, data | `data/passage/{bukhari,muslim,abudawud,tirmidhi,nasai,ibnmajah}-NNNN.yaml` (new narrations), existing hadith passages tagged in place (Muslim and Muwatta records), `data/source/hadith-api-fawazahmed0.yaml` |
| Files, site | `site/src/lib/qudsi.ts`, `site/src/pages/[lang]/qudsi/index.astro`, `site/src/scripts/qudsi-filter.ts`, `site/src/lib/nav.ts`, `site/src/components/Landing.astro`, `i18n/{ar,en,ur}.yaml` |
| Files, API | `scripts/export-api.ts`, `docs/data/README.md`, `site/public/openapi/v1.json`, `site/src/pages/llms.txt.ts` |
| Files, register | this document, `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`, `docs/site/browsers.md`, `docs/agents/lanes.md`, `docs/status.md`, `CANARY.md` |
| Out of scope | new predicates or classes; full matn text (excerpts stay within 40 words); grading of chains; collections beyond the six books and the Muwatta |

## 2. Scope

The corpus is the scope of the classic collection «الأحاديث القدسية من الصحاح الستة والموطأ» (Supreme Council for Islamic Affairs, Cairo): Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami' al-Tirmidhi, Sunan al-Nasa'i, Sunan Ibn Majah and the Muwatta of Malik. A hadith qudsi is a report in which the Prophet relates speech from God in the first person, in words other than the Qur'an's. The list is checked against the Forty Hadith Qudsi.

"All" means all within that stated scope, as found by the method below. The first build holds 113 hadiths in 331 narrations. A reader who finds a missing or misclassed narration files it as a correction; the list is not a ruling on what is or is not qudsi.

## 3. Method

1. Every matn of the seven collections (the open `fawazahmed0/hadith-api` Arabic editions, Unlicense, standard numbering; `source/hadith-api-fawazahmed0`) is scanned for divine first-person speech: «قال الله», «يقول الله», «فيما يروي عن ربه», «قال ربكم», «إن الله يقول», and the like.
2. Each hit is read, dropping Qur'an quotations, Companions' words, and reports that only describe God's acts.
3. Close narrations of one hadith (in one collection or across collections) are joined by text similarity and then by hand into one hadith.
4. Existing hadith passages are reused: a narration already in the graph (for example `passage/muslim-2577`, `passage/muwatta-1-224`) is tagged in place, never duplicated.
5. Later compilations are not narrations of the corpus: the four qudsi hadiths of al-Nawawi's Forty (`passage/arbaun-24`, `-37`, `-38`, `-42`) stay untagged, because each is already present here through the Bukhari, Muslim or Tirmidhi narration it quotes. The Forty Hadith Qudsi list was used only as a checklist: every one of its forty that occurs in the seven collections maps to a hadith in the browser.

## 4. Model

- **Narration**: an ordinary `passage` with `unit: hadith`, `work`, `ref` (the collection's number), `text` (a matn excerpt of at most 40 words), and a `mentions` edge to `concept/hadith-qudsi` and to `person/muhammad`.
- **Hadith**: the tag `qudsi-<slug>` shared by all its narrations. No group record and no side table: the browser groups by tag at build time.
- **Theme**: the narration's `themes` (ids from `schema/enums/themes.yaml`); the browser's section labels are UI strings under `qudsi.themes` in the three languages.
- **Classification**: the tag `hadith-qudsi` on every narration; the API export picks on it.

## 5. Site, API and search

- `/[lang]/qudsi/`: title, lede, counts, method note inside `data-pagefind-body`; theme index; a filter box (`site/src/scripts/qudsi-filter.ts`) that narrows rows and needs no server; without JavaScript every row is on the page. The long list is `data-pagefind-ignore` because each narration is its own indexed entity page.
- Explore menu entry `qudsi` after the hadith explorer and a landing card with its own drawing.
- `/api/v1/qudsi.json` (feature `hadith-qudsi-browser`): every tagged narration with `work`, `ref`, `unit`, `text`, `tags`, `themes` and edges; documented in `docs/data/README.md`, OpenAPI and `llms.txt`.

## 6. Status

| Phase | State |
|---|---|
| Corpus, records, page, API, search, register | In this pull request, draft tier |
| Human read of labels, summaries and grouping | Pending |
| Cross-check against a printed Qudsi collection (page-level) | Pending; sunnah.com and dorar.net refuse automated reads (HTTP 403) |
