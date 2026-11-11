# 30 · Signs of the Hour Browser — requirements and production checklist

_The feature requirements for «متصفح علامات الساعة» (the Signs of the Hour /
Day-of-Judgment Browser — every mention of the signs of the Hour, the Day of
Judgment and all eschatology in the Qur'an, the Sunnah, the seerah and every
harvested book), as requested by the founder and delivered in
`docs/plan/42-eschatology-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has
an id (`ESCH-R..`), a "how to check" line, and the artifact that proves it._

## 0. The original request (verbatim)

> "megaplan
> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working
> on   
>
> متصفح علامات يوم القيامة الكبرى والصغرى   
>
>   where it should list all the mentioned and written 
>
>
> متصفح علامات يوم القيامة الكبرى والصغرى  
>
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned
> and written in books that were harvested and any future harvested book if it
> has a 
>
> متصفح علامات يوم القيامة الكبرى والصغرى  
>
>
> should be viewable here. add a box for it on landing page and in navigation
> menus. make sure this is done end to end and full detailed proses and make
> it ready for production at the end of this.
>
> this is only about 
>
> متصفح علامات يوم القيامة الكبرى والصغرى  
>
>
> and everything mentioned about 
>
> متصفح علامات يوم القيامة الكبرى والصغرى  
>
>
>  anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where 
>
>
> متصفح علامات يوم القيامة الكبرى والصغرى  
>
>
>
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or
> from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
>
> also add this in engineering documents as the original requirements to allow
> AI later on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or
> download any books, you can use mac apple vision to OCR and then harvest those
> OCRd books or you can find any other online website that you can decide
> whether or not can be authentic and trusted as a source and get from it
> information to fully enrich and fill detailed proses
>
>
> when context is tight, just commit and push and continue
>
>
> do not wait for build/test or ci
>
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the microsd"

_Scope notes agreed with the founder before implementation: **all
eschatology** is in scope — the major and minor signs of the Hour, signs of
the Hour generally, barzakh and the grave, resurrection and gathering,
reckoning and the Scale, the Sirat and the Hawd, Paradise and Hell, and the
named end-times figures; hadith enrichment imports the fitan/hereafter
chapters of the already-registered `fawazahmed0/hadith-api` source; Muwatta
is skipped for import (its 2,861 passages already cover it and its numbering
differs); the work was pushed without waiting on local build/test/CI._

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| ESCH-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `eschatology-browser` (+ optional `eschatology-<section>`/`eschatology-<topic>`) | `grep -rl "eschatology-browser" data/` — hits under `data/{concept,person,event,passage}/`; `scripts/lib.ts` `CLASSES` unchanged |
| ESCH-R02 | Sections derived from the corpus, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `hereafter` في الآخرة · `dwelling` في المسكن · `concepts` سجلات الآخرة | `ESCH_SECTIONS` in `scripts/eschatology.ts`; `site/src/lib/eschatology.ts` |
| ESCH-R03 | **Automatic inclusion of future harvested books**: an eschatology mention in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «الساعة» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `eschatology.json` with the right `section`; then remove the fixture |
| ESCH-R04 | Detection vocabulary is gated: unambiguous forms match directly (أشراط الساعة، قيام الساعة، يوم القيامة، يوم الدين، الدجال، يأجوج، مأجوج، برزخ in grave collocation, القيامة with resurrection collocation, ميزان with weighing collocation, حديث هنا/هناك forms of البعث/النشور/الحشر/الحساب, English "Day of Judgment/Resurrection/Hereafter/Dajjal/Yajuj/Majuj/Mahdi/Trumpet/Scale of deeds") — ambiguous forms (ساعة، يوم، الآخرة، نار، جنة، مهدي، مقياس) count only beside eschatology collocations | `scripts/eschatology.ts` `AR_*`/`EN_*` families |
| ESCH-R05 | Worldly usages are stripped before matching: prayer-time hours, commercial scales, garden-paradise of this world, "the last of" series, the guided-caliph Mahdi, literal fires — each gated by collocation or strip-pattern | `NOT_*`/`AR_*_CONTEXT` patterns in `scripts/eschatology.ts` |
| ESCH-R06 | Known false positives stay out, each verified by reading; `ESCH_EXCLUDE` carries the curated id list | `ESCH_EXCLUDE` in `scripts/eschatology.ts`; none appear in `eschatology.json` |
| ESCH-R07 | Manually verified true positives without lexicon words join through the tag path (paraphrased eschatology) | `grep -l "eschatology-browser" data/passage/*.yaml` |
| ESCH-R08 | Qur'an text is never typed: eschatology ayahs are the frozen Tanzil `passage/quran-*` records; the only edits are tags/`mentions` edges | `text`/`text_search` byte-identical to Tanzil (validator enforces); `grep -rn "eschatology" data/passage/quran-*.yaml` shows only relations/tags |
| ESCH-R09 | Reuse before create: existing concepts/persons/events tagged in place; new records only where the graph lacks the subject | each exists once in `data/`; `npm run validate` 0 errors |
| ESCH-R10 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule); already-published records keep `review: published` | spot-check the new records; `npm run validate` 0 errors |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| ESCH-R11 | **Qur'an**: every ayah of the signs of the Hour, the Day, barzakh, resurrection, reckoning, the Scale, the Sirat, the Hawd, Paradise and Hell is listed — the major-signs chapters (54, 81, 82, 84, 99, 101), the signs-of-the-Hour chapters (6:158, 30:40, 46, 51, 52, 53, 56, 57, 59, 67, 68, 69, 70, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101), the Ya-Sin eschatology block (36–37), the Dajjal-adjacent verses (4:159, 9:30 context), Yajuj-Majuj (18:94–99, 21:96), and the barzakh/death verses (23:99–100, 40:45–46, 50:19–20) | `/api/v1/eschatology.json` `section:"quran"` → ≥100 items; `/ar/signs/` quran section shows them |
| ESCH-R12 | **Sunnah**: the hadiths of the signs of the Hour (ashrat al-saa), the Dajjal, Yajuj-Majuj, the Hour's portents, barzakh and the grave, resurrection and gathering, reckoning and the Scale, the Sirat and the Hawd, Paradise and Hell — Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami' al-Tirmidhi, Sunan al-Nasa'i, Sunan Ibn Majah, the Muwatta, the Arba'in | `section:"sunnah"` → ≥200 items (existing + imported); each card links to its `/{lang}/passage/<slug>/` page |
| ESCH-R13 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `eschCorpusOf` in `scripts/eschatology.ts`; verify it renders nothing rather than erroring when empty |
| ESCH-R14 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with an eschatology passage lands in `books` | `section:"books"` → ≥1 items; new books appear without code changes (ESCH-R03) |
| ESCH-R15 | **Companion and Tabi'in reports**: the isnad-bearing hadith passages carry the Companion and Tabi'in voices on the signs of the Hour (Ka'b al-Ahbar, Ibn Mas'ud, Abu Hurayra, Anas, Ibn Abbas reports), the stories of the grave, the Day and the hereafter | inspect `sunnah`/`books` cards for the famous narrators; each carries `work`+`ref` |
| ESCH-R16 | **Curated layer**: ~30 tagged + ~35 new records in `section:"concepts"` — the major-signs detail records, the end-times figures, the Day's stations, barzakh, Paradise and Hell | `section:"concepts"` → ≥30 items; `/ar/signs/` concepts section lists them |
| ESCH-R17 | **Stories, mentions, quotes, details**: the Prophet's own eschatology discourses, the Companion/Tabi'in stories on death and the grave, the Dajjal/Yajuj-Majuj/Mahdi narrations, the Qur'anic sign-stories — each an ordinary entity page with trilingual prose | `/{lang}/concept/<slug>/` renders in ar/en/ur for the new records |

## 3. The browser page `/{lang}/signs/`

| Id | Requirement | How to check |
|---|---|---|
| ESCH-R20 | Page exists in all three languages: `/ar/signs/`, `/en/signs/`, `/ur/signs/` | `curl -sI` each → 200 |
| ESCH-R21 | Localized title «متصفح علامات الساعة» / "Signs of the Hour Browser" / ساعت کی نشانیوں کا براؤزر + lede + badge + method note + status count | `i18n/{ar,en,ur}.yaml` `signs:` block; view each page |
| ESCH-R22 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections (seerah today) do not render | `/ar/signs/` shows the populated sections; chip counts sum to item count |
| ESCH-R23 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/`, `/{lang}/concept/<slug>/` etc.), never a browser-only page | inspect card `href`s on `/en/signs/` |
| ESCH-R24 | Passage cards show work name + ref/unit (e.g. «صحيح مسلم · 99»، «القرآن · 54:1») and a text excerpt; topic chips show the detected families; concept cards show their summary | `/ar/signs/` sunnah section cards carry the work/ref line and topic chips |
| ESCH-R25 | Client filter narrows cards across labels, summaries, work names, topic names and excerpts in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/signs-filter.ts`; open `/ar/signs/` with JS disabled → full list; type «الساعة» → filtered cards |
| ESCH-R26 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «الساعة» reaches the page |
| ESCH-R27 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| ESCH-R28 | **Landing card** on the homepage («متصفح علامات الساعة» with signs thumbnail + accent) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "signs", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| ESCH-R30 | `https://api.islam.museum/api/v1/eschatology.json` returns every detected + tagged record with `section`, `topics`, `work`, `ref`, `unit`, `text`, `kind`, `themes`, `tags`, edges, prose languages | `curl -s .../eschatology.json \| jq '.items \| length'` ≥ 200; `feature: "eschatology-browser"`; `section` ∈ {quran,sunnah,seerah,books,hereafter,dwelling,concepts} |
| ESCH-R31 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/eschatology.json` path), and `llms.txt` | all three rows exist |
| ESCH-R32 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 42), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`eschatology` lane), `docs/status.md`, `CANARY.md`, `docs/plan/42-eschatology-browser.md`, this spec | all rows present |
| ESCH-R33 | `features-api.test.ts` asserts `eschatology.json` in the export set and its detection/classification rules (quran/sunnah/books/seerah classification, gated-form rules) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| ESCH-R40 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| ESCH-R41 | All work shipped as small PRs with canary entries; nothing committed directly to protected `main` | merged-PR list; `gh pr list --search eschatology` |
| ESCH-R42 | **Full trilingual coverage**: every new record has `label.ar/en/ur`, `summary.ar/en/ur`, and `content/{ar,en,ur}/<class>/<slug>.md` | the new records each have 3 prose files |
| ESCH-R43 | Draft gate: all AI-authored records remain `status.review: draft` until a human promotes them | the new records carry `review: draft` |
| ESCH-R44 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check ESCH-R20/R28/R30 |
| ESCH-R45 | Content safety: no blocked-organisation content; the fitan chapters that overlap with modern organisations are checked before import; `scripts/check-extremism.ts` passes | `npm run validate` 0 errors; `grep -rn "dabiq\|isis\|al-qaeda" data/` in the new files |

## 6. Explicitly out of scope / known limits

- **Dreams, magic, jinn**: those stay in their own browsers; a passage about
  both a sign and a dream may appear in both — that is correct, they are
  different questions.
- **Lexical recall**: an eschatology mention phrased without the lexicon
  needs a manual `eschatology-browser` tag on the passage (ESCH-R07
  documents the known cases); future audits may add more.
- **Worldly polysemy**: «ساعة» (hour), «يوم» (day), «النار» (fire),
  «الجنة» (garden), «الميزان» (scale), «البرζخ» (partition), «المهدي»
  (guided caliph) are gated by collocation; verified false positives are
  excluded by id.
- **Seerah**: the section is taxonomy-ready but thin until seerah passages
  with eschatology vocabulary are harvested.
- **Hadith coverage**: the import covers the six main collections'
  fitan/hereafter chapters from `fawazahmed0/hadith-api`; Muwatta is not
  imported (its passages already exist); the numbering reconciliation is
  collection-specific (Muslim uses `arabicnumber`, the rest use
  `hadithnumber`).
