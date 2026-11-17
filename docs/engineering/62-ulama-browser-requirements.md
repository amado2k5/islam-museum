# 62. Ulama Browser — requirements and acceptance spec

**Status:** accepted for production validation · **Lane:** `ulama` · **Plan:** `docs/plan/70-ulama-browser.md` · **Shipped:** `/[lang]/ulama/`, `/api/v1/ulama.json`, `sig/UlamaMajlis.astro`

## The founder's original brief (verbatim)

> متصفح المفكرون والعلماء والأدباء والمحدثون والكتاب
>
> where it should list all the mentioned and written المفكرون والعلماء والأدباء والمحدثون والكتاب that are in quran, see rah, sunna, tabi3een stories, quotes, mentioned and written in books that were harvested and any future harvested book if it has a المفكرون والعلماء والأدباء والمحدثون والكتاب should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about المفكرون والعلماء والأدباء والمحدثون والكتاب and everything mentioned about المفكرون والعلماء والأدباء والمحدثون والكتاب anywhere in any of the sunni books or quran or sunna or sera.
>
> find all the instances where المفكرون والعلماء والأدباء والمحدثون والكتاب were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details.
>
> also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.
>
> Use microsd instead of Mac main drive; get latest from main, clone the repo to a separate folder; use browser/web sources, downloaded books, OCR or other trusted sources to fully enrich detailed proses; when context is tight commit and push and continue; do not wait for build/test or ci; in the end commit, push, raise PR and merge it; then delete all files and folders related to this work from the microsd.
>
> **Addendum (founder, same session):** add to the enrichment list "my father hamdy abdel aal (origins.faith his books) and add Heba Kotb & Saad El-Din El-Hilali & Islam Behery & Youssef Ziedan & Khaled Montaser among all the others you can find and research from the most recent and going backward to the beginning."
>
> **Second addendum (founder, same session):** "please make sure you always fill proses with full detail, and if you need any more details use the internet browser to search on my mac and you can download any files you need and any books and browse to any website, you can also you my mac apple vision to OCR and use can you devin model to harvest and injest and mine content into islam.museum. please make this page unique in its UI and very rich and should have a lot of characters and be really useful and rich with all the details it will provide about them, their lives, their mission, their quotes, their work, any books they wrote, any tv interviews, any artifacts or anything they did"

**Clarification (founder, this session):** the browser covers the **five named categories plus all knowledge professions** — scholars, muhaddiths, jurists, muftis, qadis, theologians, philosophers/thinkers, historians, geographers, writers, teachers, preachers, and the scientists of the pen (scientists, mathematicians, astronomers, physicians, calligraphers). **Poets are excluded** (the founder's chosen scope; the poetry wing already has its own reader). Mentions are detected by `mentions` edges, guarded folded name forms, and a reviewed Qur'an verse table — never by vocabulary search of the frozen verse text.

## Requirements

- **UL-R1 — One browser, one graph.** `/[lang]/ulama/` lists every thinker/scholar/litterateur/muhaddith/writer record the graph knows, computed at build time; no side table.
- **UL-R2 — Person detection.** `scripts/ulama.ts` qualifies a `person` record by role set `ULAMA_ROLES` (scholar, muhaddith, jurist, mufti, qadi, shaykh-al-islam, theologian, philosopher, historian, geographer, writer, teacher, preacher, scientist, mathematician, astronomer, physician, calligrapher) or by `occupations[].job` in `ULAMA_JOBS` (alim, muhaddith, adib, katib, faqih, mufassir, mufti, historian, qari). Poets are out of scope by decision.
- **UL-R3 — Mention detection.** A `passage` joins when a `mentions` relation targets a qualifying person, or its folded `text`/`text_search`/`label`/`summary` contains a guarded name form of a qualifying person (name forms built from `label.ar` + `names[]`, minimum length and a common-word stoplist; «علي»-type single common names never match alone). Signals (person id + matched form) are returned, not just a boolean. `ULAMA_EXCLUDE` is the verified false-positive escape hatch.
- **UL-R4 — Qur'an verses.** A reviewed table `ULAMA_QURAN_REFS` lists every verse in the browser: verses naming learned figures (Luqman, 31:12–19) and verses speaking of the people of knowledge as a class (35:28, 3:18, 58:11, 39:9, 20:114, and the rest of the reviewed rows), each row commented against the classical commentaries. The frozen verse text is never searched.
- **UL-R5 — Corpus sections.** Passages file under `quran`, `sunnah`, `seerah` or `books` from work genre/unit; a book harvested later lands automatically in `books`. Persons file under `mufakkirun`, `ulama`, `muhaddithun`, `udaba`, `kuttab` (first matching category, ordered) or `curated` for tagged records of other classes.
- **UL-R6 — Category chips.** Every person carries its categories (`mufakkir`, `alim`, `muhaddith`, `adib`, `katib`, `scientist`) as filter chips; a person may carry several.
- **UL-R7 — Curated records.** Records about scholarship itself (e.g. `concept/al-ulama`) and hand-checked mentions carry `ulama-browser` (+ `ulama-<section>` / `ulama-<topic>`) tags. New records cite defined `source/` IDs and ship Arabic first with English and Urdu in the same commit, each with a `provenance` block.
- **UL-R8 — Prose enrichment and person richness.** Every enriched person's record and prose is full-detail — life, mission, quotes (as passage/quote records or cited lines), authored books (`author_of`/work edges and a "his books" line), TV interviews and programmes (`screen` records or interview citations where a trusted source exists), and artifacts/legacy objects where the graph holds them. Enrichment sources per `docs/agents/source-families.md` plus web research, downloaded books and macOS-Vision OCR harvest; no source files enter git. Specifically:  Founder-named figures — Hamdy Abdel Aal (origins.faith books), Heba Kotb, Saad El-Din El-Hilali, Islam Behery, Youssef Ziedan, Khaled Montaser — plus an anchor wave of canonical figures enriched most-recent-first going backward to the Companions and Successors: full trilingual cited prose per `docs/agents/publication-standard.md`.
- **UL-R9 — Trilingual.** The page, the landing card, the Explore menu and every i18n string ship in ar/en/ur.
- **UL-R10 — Unique UI.** A browser-specific signature view `sig/UlamaMajlis.astro` («مجلس العلم») — five knowledge-category columns fed from the graph, keyboard-reachable, reduced-motion safe, with the no-JS readable list staying on the page.
- **UL-R11 — Discovery & API.** Landing explorer card, Explore menu entry (people group), `docs/site/browsers.md` row, `/api/v1/ulama.json` (items with `section`, `categories`/`topics`, `mentions_persons`, signals), indexed in `index.json`, OpenAPI `v1.json`, `llms.txt`, `docs/data/README.md`.
- **UL-R12 — Every card links its ordinary entity page** (`/person/<slug>/`, `/passage/<slug>/`); the browser never becomes a dead end.
- **UL-R13 — Verification.** `npm run validate && npm test` pass on the branch; `features-api.test.ts` covers person detection, mention detection, exclusions, corpus/category classification and the API export. Per the founder's instruction, CI/build are not waited on.

## Acceptance tests (production)

1. Visit `/ar/ulama/`, `/en/ulama/`, `/ur/ulama/` — all render, lede and section labels localized.
2. The page shows the مجلس العلم signature view and the filter box; disabling JS leaves the full list readable.
3. `GET /api/v1/ulama.json` returns persons with `categories` and passages with `section` + `mentions_persons`; `index.json` lists it.
4. The founder-named figures — `person/hamdy-abdel-aal`, `person/heba-kotb`, `person/saad-al-din-al-hilali`, `person/islam-behery`, `person/youssef-ziedan`, `person/khaled-montaser` — appear with trilingual prose.
5. A passage whose `mentions` edge targets a qualifying person appears; a harvested book passage containing a guarded scholar name form appears the next build with no code change.
6. A passage containing only a common single name («علي», «الحسن») does not appear.
