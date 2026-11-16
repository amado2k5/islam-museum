# 53 · Pillars of Islam, Pillars of Faith, Branches of Faith and Traits of the Believer Browser — requirements and production checklist

_The feature requirements for «متصفح أركان الإسلام وأركان الإيمان وشُعَب الإيمان وخِصَال المؤمن», as requested by the founder on 16 November 2026 and delivered in [`docs/plan/61-arkan-browser.md`](../plan/61-arkan-browser.md). Written so any person or AI agent can validate each requirement against production (`https://islam.museum`, `https://api.islam.museum`) without reading the plan. Every requirement has an id (`ARK-R..`), a "how to check" line, and the artifact that proves it. A merged pull request is not a live site: deployment is the founder's manual step, so run the production checks only after his next deploy._

## 0. The original request (verbatim)

> "Use microsd instead of Mac main drive. get latest from main, clone the repo to a separate folder then start working on متصفح أركان الإسلام وأركان الإيمان وشُعَب الإيمان وخِصَالُ الْمُؤْمِن where it should list all the mentioned and written أركان الإسلام وأركان الإيمان وشُعَب الإيمان وخِصَالُ الْمُؤْمِن that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that were harvested and any future harvested book if it has a أركان الإسلام وأركان الإيمان وشُعَب الإيمان وخِصَالُ الْمُؤْمِن should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this. this is only about أركان الإسلام وأركان الإيمان وشُعَب الإيمان وخِصَالُ الْمُؤْمِن and everything mentioned about أركان الإسلام وأركان الإيمان وشُعَب الإيمان وخِصَالُ الْمُؤْمِن anywhere in any of the sunni books or quran or sunna or sera. find all the instances where أركان الإسلام وأركان الإيمان وشُعَب الإيمان وخِصَالُ الْمُؤْمِن Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details. also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production. you can use mac browser to browse to any web page, to get any information or download any books, you can use mac apple vision to OCR and then harvest those OCRd books or you can find any other online website that you can decide whether or not can be authentic and trusted as a source and get from it information to fully enrich and fill detailed proses. when context is tight, just commit and push and continue. do not wait for build/test or ci. in the end commit, push, raise PR and merge it. Then delete all the files and folder related to this work from the microsd"

Scope note: four themes and nothing wider — the pillars of Islam (`islam`), the pillars of faith (`iman`), the branches of faith (`shuab`), the traits of the believer (`khisal`). The detail of each act of worship belongs to the Ibadat Browser, virtues at large to the Akhlaq Browser, the angels, the Last Day and the messengers to their own browsers. No new book was downloaded for this build: every text came from the OCR library already on the harvest drive and from the hadith-api editions already there.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| ARK-R01 | No new class or side table: every row is an ordinary graph node — passages found at build time, curated records tagged `arkan-browser` plus `arkan-<topic>` | `grep -rl "arkan-browser" data/ \| cut -d/ -f2 \| sort \| uniq -c` shows only `concept`, `practice`, `work`; `scripts/lib.ts` `CLASSES` unchanged |
| ARK-R02 | Four topics, in the founder's order: `islam`, `iman`, `shuab`, `khisal`; a record can carry more than one | `ARKAN_TOPICS` in `scripts/arkan.ts`; `passage/quran-2-177` has `topics: ["islam","iman","shuab"]` in `/api/v1/arkan.json` |
| ARK-R03 | Five sections derived from the corpus: `quran`, `sunnah`, `seerah`, `books`, `curated` | `ARKAN_SECTIONS`; `arkanCorpusOf` (work/quran → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; else books) |
| ARK-R04 | **Qur'an verses enter by the reviewed table only**, never by the lexicon; the verse text shown is the Tanzil text of the passage record | `ARKAN_QURAN`; test "exports arkan" in `scripts/features-api.test.ts`: `quran-2-177` in, an off-table verse with matching words out |
| ARK-R05 | **Automatic inclusion of future harvested books**: a passage whose text carries a strong signal appears the day its record lands, with no tagging step | the same test: `passage/futurebook-arkan-1` appears with `section: "books"` |
| ARK-R06 | Detection reads the passage's own text only (`text_search`, `text`), diacritics, tatweel and directional marks stripped | `arkanFold`, `arkanSignalsOf` |
| ARK-R07 | Strong signals per topic — islam: the term and its synonyms, «بني الإسلام على», the answer on Islam, the prayer, zakat and fast or pilgrimage named together, the testimony with the prayer and the zakat; iman: the term, «تؤمن بالله وملائكته», belief in the decree, the question on faith; shuab: «شعب الإيمان», «بضع وسبعون/وستون شعبة», «… من الإيمان», the sweetness, reality and completeness of faith, «لا يؤمن أحدكم حتى», «من كان يؤمن بالله واليوم الآخر ف», «وهو مؤمن», faith as the best deed; khisal: «خصال/صفات/أخلاق المؤمن», «ثلاث من كن فيه», the likenesses and descriptions of the believer, what a believer owes a believer, the Muslim described | `TOPIC_RULES` in `scripts/arkan.ts`; `passage/muslim-0016`, `muslim-0035`, `muslim-0043`, `muslim-2585`, `bukhari-api-50` are in the dataset |
| ARK-R08 | Weak signals (a single article of faith, faith increasing and decreasing, a grain's weight of faith) count only beside a strong one, or two distinct ones together; the harvest gate never admits on weak signals | the test's `weakOnly` fixture is out; `arkanHitsOfText(…, true)` returns `[]` for weak-only text |
| ARK-R09 | Structural false positives are out: a footnote citing «في شعب الإيمان» or the running head «الجامع لشعب الإيمان»; «شعب» as a mountain pass; «يخرج الرجل من الإيمان» | the test's `titleFp`, `passFp`, `leaveFp` fixtures are out |
| ARK-R10 | Harvested passages carry `mentions` edges to their theme's record: `concept/five-pillars`, `concept/arkan-al-iman`, `concept/shuab-al-iman`, `concept/khisal-al-mumin` | `grep -l "target: concept/shuab-al-iman" data/passage/*.yaml \| wc -l` > 0 |
| ARK-R11 | Every record carries `sources`, `provenance` and a `status`; OCR excerpts say on the record that the text is machine-read and not corrected | open any `data/passage/*-arkan-*.yaml` |
| ARK-R12 | No Qur'an text typed: OCR windows that share four consecutive words with a verse (other than the testimony and the faith formula) or carry a quotation marker are skipped; hadith reports that share six are skipped; prose refers to verses as `[[passage/quran-s-a|label]]` | `scripts/harvest-arkan-ocr.ts`, `scripts/harvest-arkan-hadithapi.ts`; `grep -c "﴿" content/*/concept/{arkan-al-iman,shuab-al-iman,khisal-al-mumin}.md` → 0 |
| ARK-R13 | No honorific typed anywhere; Arabic parentheses isolated | `npm run validate` (0 errors) |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| ARK-R20 | **Qur'an**: the testimony verses, the prayer-and-zakat pairs, the fasting and pilgrimage verses; 2:177, 2:285, 4:136 and the decree verses; the verses of faith increasing; the passages describing the believers (23:1–11, 25:63–76 in part, 8:2–4, 9:71, 9:112, 33:35, 49:10, 49:15, 70:22–35 in part, 42:36–39, 13:20–22, 3:134–135) | `/api/v1/arkan.json` rows with `section: "quran"`; each has `signals: ["<topic>:quran-table"]` |
| ARK-R21 | **Sunnah**: the hadith of Jibril, «بني الإسلام على خمس», the branches of faith, the sweetness of faith, «لا يؤمن أحدكم حتى», the likenesses of the believer, from the two Sahihs, the four Sunan and the Muwatta, plus excerpts from the commentaries and compilations | rows with `section: "sunnah"`; spot-check `passage/bukhari-api-9`, `passage/bukhari-api-50`, `passage/muslim-0008` |
| ARK-R22 | **Seerah**: passages of works with genre `sira` land in `seerah` | rows with `section: "seerah"`; the section renders nothing rather than erroring when empty |
| ARK-R23 | **Companions and Successors**: their reports arrive through the same detector from the books on them (Hilya, Sifat al-Safwa, Hayat al-Sahaba, Usd al-Ghaba, al-Isaba, al-Isti'ab, the two Kitab al-Zuhd, Ibn Sa'd) | rows whose `work` is one of those works |
| ARK-R24 | **Harvested books**: the books of faith and creed, histories, fiqh and usul land in `books` | rows with `section: "books"` |
| ARK-R25 | **Curated layer**: three new records with trilingual prose (`concept/arkan-al-iman`, `concept/shuab-al-iman`, `concept/khisal-al-mumin`) and 22 records tagged in place | rows with `section: "curated"` → 25; `/ar/concept/shuab-al-iman/` lists the seventy-seven branches in three groups, cited to 'Umdat al-Qari |

## 3. The pages

| Id | Requirement | How to check |
|---|---|---|
| ARK-R30 | `/ar/arkan/`, `/en/arkan/`, `/ur/arkan/` exist | `curl -sI` each → 200 |
| ARK-R31 | Localised title, lede, badge, method note and a status line whose count equals the records the page lists | view each page; `renderedHeadline` in `site/src/lib/paged.ts` fails the build otherwise |
| ARK-R32 | The signature view "the four doors": four panels, the five pillars and the six pillars as linked lists, per-section counts, links to the theme page and the theme's record; readable without JavaScript | `site/src/components/sig/ArkanFour.astro`; the build throws when a named record is missing |
| ARK-R33 | Four theme pages `/[lang]/arkan/topic/<islam\|iman\|shuab\|khisal>/`, answers first (curated, Qur'an in mushaf order, Sunnah, seerah, books), paged at 75 rows | `curl -sI https://islam.museum/ar/arkan/topic/shuab/` → 200; page 2 at `/2/` when the theme is long |
| ARK-R34 | Section lists on the home show the first 24 rows and link to `/arkan/all/<section>/[n]/` | the "all N" chip under a long section |
| ARK-R35 | Every card links to the ordinary entity page; passage cards show work and reference; theme chips link to the theme pages | inspect `href`s |
| ARK-R36 | The filter narrows the rows as typed and ignores Arabic vowel marks; with JavaScript off the whole page is readable | `site/src/scripts/arkan-filter.ts` |
| ARK-R37 | Pagefind: title, lede and method inside `data-pagefind-body` on the landing and on page 1 of each theme; lists inside `data-pagefind-ignore` | page source |
| ARK-R38 | **Landing card** on the home page (five columns under a pediment) and **Explore menu** entry in the group `conduct`, in the three languages | home page; `site/src/lib/nav.ts` `{ key: "arkan", ready: true }` |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| ARK-R40 | `/api/v1/arkan.json` exports every record with `section`, `topics`, `signals`, work, ref, text and edges; `feature` is `arkan-browser` | `curl -s https://api.islam.museum/api/v1/arkan.json \| jq '.feature, (.items\|length)'` |
| ARK-R41 | Documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/arkan.json`, `getArkan`) and `llms.txt` | grep each for `arkan.json` |
| ARK-R42 | Registered in `docs/site/browsers.md`, `docs/site/signature-views.md`, the plan index, the roadmap, `docs/agents/lanes.md` (lane `arkan`), `docs/status.md`, and `CANARY.md` | grep each for `arkan` |
| ARK-R43 | Tests: "exports arkan" in `scripts/features-api.test.ts` passes, and the export list names `arkan.json` | `npx vitest run scripts/features-api.test.ts` |

## 5. What to say truthfully about it

The OCR excerpts are machine-read and uncorrected. The English and Urdu prose is machine translation not yet read by a person. The Qur'an table is a selection. The list of seventy-seven branches is al-'Ayni's, not al-Bayhaqi's, whose first volume is not among the scans. Counts are those the page prints on the day of the build; the plan records the counts of 16 November 2026.
