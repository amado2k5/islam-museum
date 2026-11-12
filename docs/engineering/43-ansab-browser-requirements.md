# 43 · Genealogies, Peoples, Mutun and Prophets' Tree Browser — requirements and production acceptance spec

Browser: متصفح الأنساب والأعراق والمتون وشجرة الأنبياء والمرسلين — `/{lang}/ansab/` + `/{lang}/ansab/<slug>/` + `/api/v1/ansab.json`. Plan: `docs/plan/55-ansab-browser.md`. Lane: `ansab`. Built 2026-11-19. Every requirement below is checkable in production by an AI agent or a human with curl + a browser; requirement ids are `ANS-R<n>`.

## 1 · Original request (verbatim, founder, 19 November 2026 — preserved so future agents can test against it)

> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working on
>
> متصفح الأنساب والأعراق والمتون وشجرة الأنبياء والمرسلون
>
> where it should list all the mentioned and written
>
> متصفح الأنساب والأعراق والمتون وشجرة الأنبياء والمرسلون
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that were harvested and any future harvested book if it has a
>
> متصفح الأنساب والأعراق والمتون وشجرة الأنبياء والمرسلون
>
> should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about
>
> متصفح الأنساب والأعراق والمتون وشجرة الأنبياء والمرسلون
>
> and everything mentioned about
>
> متصفح الأنساب والأعراق والمتون وشجرة الأنبياء والمرسلون
>
> anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
>
> متصفح الأنساب والأعراق والمتون وشجرة الأنبياء والمرسلون
>
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or download any books, you can use mac apple vision to OCR and then harvest those OCRd books or you can find any other online website that you can decide whether or not can be authentic and trusted as a source and get from it information to fully enrich and fill detailed proses
>
> when context is tight, just commit and push and continue
>
> do not wait for build/test or ci
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the microsd

**Clarifications the founder gave before implementation:** one combined browser with internal sections (not separate browsers); المتون = the didactic memorization texts (the school mutūn); the prophets' tree must show the full chain including the disputed links above Adnan — flagged as disputed, not asserted; local build/test/CI gates explicitly skipped for this pass («do not wait for build/test or ci»).

## 2 · Checkable requirements

**Pages and navigation**

- `ANS-R1` `GET /ar/ansab/`, `/en/ansab/`, `/ur/ansab/` return 200. The Arabic home carries the exact title «متصفح الأنساب والأعراق والمتون وشجرة الأنبياء والمرسلين» inside `data-pagefind-body`, with lede, build-status line, methodology note and a link to `/api/v1/ansab.json`.
- `ANS-R2` The home renders the prophets' tree (`ANSAB_PROPHET_CHAIN`) as a linked chain ordered Ibrahim → Ismail → (28 disputed links) → Adnan → Ma'add → … → Muhammad, oldest first. Links marked `agreed: false` (qaydar through udd-ibn-adnan) render visually distinct (dashed outline) with a disputed tooltip/legend; nothing on the page asserts the disputed segment as established.
- `ANS-R3` Six domain sections render when populated: `shajara`, `tribes`, `peoples`, `mutun`, `curated`, `mentioned` — each with a count, an anchor `#t-<section>`, and cards linking to `/{lang}/ansab/<slug>/`.
- `ANS-R4` The mention feed groups detected passages into four corpus sections — `quran`, `sunnah`, `seerah`, `books` — each with its count. The landing page, Explore grid and navigation menus carry the browser (landing card with the tree icon; `explore.pages.ansab` in all three locales).
- `ANS-R5` Subject pages exist for every `ANSAB_SUBJECTS` id present in the graph — lineage links (e.g. `/ar/ansab/qusayy-ibn-kilab/`, `/ar/ansab/udd-ibn-adnan/`), tribes (`/ar/ansab/quraysh/`, `/ar/ansab/al-aws/`), peoples (`/ar/ansab/al-rum/`, `/ar/ansab/banu-israil/`), mutun (`/ar/ansab/ajurrumiyya/`, `/ar/ansab/al-shatibiyya/`), nasab concepts (`/ar/ansab/nasab-al-nabi/`). Each shows the trilingual summary, its section chip, its on-chain position with parent/child links when on the tree, the «حلقة مختلَف فيها» chip when the link is disputed, mention passages grouped by corpus (Qur'an text rendered only from frozen passage records), a sources list and related records.
- `ANS-R6` The page is fully readable with JavaScript disabled; the filter input is progressive enhancement only. Alt-text/a11y: decorative SVGs carry `aria-hidden`; WCAG 2.2 AA.

**Detection and future harvested books**

- `ANS-R7` Detection runs at build time in `scripts/ansab.ts` over passage matns (`text_search`/`text` only — never labels, summaries or isnads) with imlaei normalisation. A passage in a book harvested **later** that names a lineage link, tribe, people, matn or the class terms appears in the browser and in `ansab.json` with no tagging step — verifiable by adding a passage record that mentions «قريش» or «الأنساب» to a newly harvested work and rebuilding.
- `ANS-R8` Ambiguous forms are gated: bare «عاد» (the verb) does not match `group/aad` — only «قوم عاد», «عاد الأولى/الثانية», «بني عاد» and «إرم ذات العماد» do; «تميم» matches only as بني تميم; English matches read the matn translation only. `ANSAB_EXCLUDE` / `ANSAB_TOPIC_EXCLUDE` drop verified false positives by id.
- `ANS-R9` Corpus classification follows the shared rule: `work/quran` or `unit: ayah` → quran; `genre: sira` → seerah; `genre: hadith` or `unit: hadith` → sunnah; everything else → books. Canonical `mentions` edges join the same feed.

**Data and scholarly framing**

- `ANS-R10` The full requested tree is present: agreed chain Muhammad → Adnan (22 links), disputed links Adnan → Qaydar → Ismail → Ibrahim (28 links on the Ibn Ishaq/al-Tabari order), and Ibrahim's two lines to the prophets. `concept/nasab-al-nabi` and `concept/waqf-al-nasab-inda-maadd` carry the three-part scholarly framing and are browser members.
- `ANS-R11` Every new record cites at least one registered `source/*` (al-Mubarakpuri, Ibn Hisham, al-Tabari, Ibn Sa'd, al-Mutun al-Ilmiyya, al-A'lam…) and is `status.review: draft` with a `provenance` block; Arabic prose first with en/ur draft translations; no honorifics typed; no Qur'an text typed (frozen passage records only); Arabic parentheticals wrapped in U+2066/U+2069 isolates.
- `ANS-R12` The duplicate-resolution rule held: no second copies of existing richer records — `al-aws`, `al-khazraj`, `banu-qaynuqa`, `banu-qurayza`, `banu-dabba`, `banu-ghifar`, `banu-lakhm`, `banu-hamdan`, `banu-shayban`, `banu-taghlib`, `banu-tamim`, `banu-sulaym`, `maadd-ibn-adnan`, `nizar-ibn-maadd`, `mudar-ibn-nizar`, `mudrika-ibn-ilyas`, `fihr-ibn-malik`, `qusayy-ibn-kilab` are the pre-existing records tagged in place. The Ansari father of Anas is `person/malik-ibn-al-nadr-al-ansari` (distinct from the Qurashi ancestor `person/malik-ibn-al-nadr`).

**API and docs**

- `ANS-R13` `GET /api/v1/ansab.json` returns `{ feature: "ansab-browser", subjects: [...], items: [...] }`: `subjects` is the index (id, label, summary, status, section, per-corpus `counts`, `passages`); `items` are detected passages (corpus `section`, `subjects`, `topics`, work, ref, excerpt, edges) plus curated `ansab-browser` records. Documented in `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
- `ANS-R14` Registers updated: `docs/site/browsers.md` row + API row, `docs/plan/00-README.md` row 55, `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` lane `ansab`, `docs/status.md`, `CANARY.md` v1.26.0 entry.
- `ANS-R15` Records appear in Pagefind search as ordinary entity pages; the home's title/lede/headings are inside `data-pagefind-body` and long lists are `data-pagefind-ignore`.

## 3 · Known limits at ship time

- Gates were skipped on the founder's explicit instruction («do not wait for build/test or ci»): `npm run validate`, `npm test` and `npm run build` were **not** run for this change — the repo's normal gate rule still applies and the next contributor should run them. Nothing here claims the gates pass.
- Detection counts are build-dependent; the exact feed size is not asserted in this spec (assert behaviour, not numbers).
- Disputed-link prose follows the Ibn Ishaq/al-Tabari/Ibn Sa'd transmission with alternates noted; a human read may adjust individual links before promotion to `published`.
