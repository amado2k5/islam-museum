# 52 · Qur'an Readings, Orthography, Scripts and Dotting Browser — requirements and production checklist

_The feature requirements for «متصفح قراءات القرآن والرسم الإملائي والخطوط والتنقيط» (the browser of the
readings of the Qur'an, the orthography of the mushaf, its scripts and its dotting, as the Qur'an, the
Sunnah, the seerah, the reports of the Companions and Successors and every harvested book carry them),
as requested by the founder and delivered in `docs/plan/60-qiraat-browser.md`. Written so any person or
AI agent can validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has an id (`QIRAAT-R..`) and a
"how to check" line._

## 0. The original request (verbatim, 15 November 2026)

> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working on
>
> متصفح قراءات القران والرسم الإملائي والخطوط والتنقيط
>
> where it should list all the mentioned and written
>
> قراءات القران والرسم الإملائي والخطوط والتنقيط
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that
> were harvested and any future harvested book if it has a
>
> قراءات القران والرسم الإملائي والخطوط والتنقيط
>
> should be viewable here. add a box for it on landing page and in navigation menus. make sure this is
> done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about
>
> قراءات القران والرسم الإملائي والخطوط والتنقيط
>
> and everything mentioned about
>
> قراءات القران والرسم الإملائي والخطوط والتنقيط
>
> anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
>
> قراءات القران والرسم الإملائي والخطوط والتنقيط
>
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and
> add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow AI later on to test and
> validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or download any books, you
> can use mac apple vision to OCR and then harvest those OCRd books or you can find any other online
> website that you can decide whether or not can be authentic and trusted as a source and get from it
> information to fully enrich and fill detailed proses
>
> when context is tight, just commit and push and continue
>
> do not wait for build/test or ci
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the microsd

_Interpretation recorded in `docs/plan/60-qiraat-browser.md` §2: the four named subjects are read as
seven topics — the seven ahruf, the readings, the readers and transmitters, the collection of the Qur'an
and the codices, the orthography of the mushaf (with the debate over writing it in ordinary, imla'i
spelling), its dots, vowel marks and signs, and the scripts and craft of writing. The recitation in the
ritual prayer, the abrogation sense of «النسخ», and writing in general (letters, contracts, the writing
down of hadith) stay out; they belong to other browsers._

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| QIRAAT-R01 | No new class or side table: every record is an ordinary graph node — Qur'an verses and passages detected at build time, curated records tagged `qiraat-browser` (+ `qiraat-<section>`, `qiraat-<topic>`) | `grep -rl "qiraat-browser" data/` — hits under `data/{concept,event,question,person,work,object}/`; `scripts/lib.ts` `CLASSES` unchanged |
| QIRAAT-R02 | Nine sections: four derived from the corpus (`quran` · `sunnah` · `seerah` · `books`) and five curated (`sciences` · `people` · `scripts` · `works` · `mushafs`); a curated record without a section tag is filed by its class | `QIRAAT_SECTIONS`, `qiraatCorpusOf`, `qiraatTagSection` in `scripts/qiraat.ts` |
| QIRAAT-R03 | Seven topics: `ahruf`, `readings`, `readers`, `codex`, `rasm`, `naqt`, `khatt` | `QIRAAT_TOPICS`; `qiraat.topics` and `qiraat.topics_desc` in `i18n/{ar,en,ur}.yaml` |
| QIRAAT-R04 | **Automatic inclusion of future harvested books**: a mention of these subjects in any book enters the browser the day its passage record lands — detection is a build-time function of the compiled graph, never a hand-kept list | `scripts/features-api.test.ts` "exports qiraat": a fixture passage saying who first dotted the mushaf appears in `qiraat.json` with topics `codex`, `naqt` |
| QIRAAT-R05 | Qur'an verses come from the reviewed table `QIRAAT_QURAN_REFS`, never from word search; a verse not in the table is not listed | the test asserts `quran-2-1y` is absent and `quran-73-4x` present |
| QIRAAT-R06 | The lexicon is guarded and folds vowel marks: «القراءة» in the prayer, «الخط» as a drawn line, «الخطبة», a bare «الحرف», a bare «النقطة» and a narrator named Nafi' never match; «سَبْعَةِ أَحْرُفٍ» with full vowels does | the test (`muwatta-8889`, `muslim-8889`); `npx tsx scripts/qiraat-audit.ts` prints each hit with the words that matched |
| QIRAAT-R07 | Qur'an text is never typed: verses are the frozen Tanzil `passage/quran-*` records; prose refers to them with `[[passage/quran-S-A\|label]]`, and a variant reading is described in words | `npm run validate` 0 errors; no ﴿ ﴾ in `content/` |
| QIRAAT-R08 | Reuse before create: existing records (the qira'at, ahruf, rasm, mushaf, tajwid and tartil concepts, the script concepts, the readers, scribes and calligraphers, the books of the readings, the mushaf manuscripts) are tagged in place, never duplicated | each id exists once; `docs/plan/60-qiraat-browser.md` §6 |
| QIRAAT-R09 | Every AI-authored record carries `sources`, `provenance` (`generated_by`, `model`, `run`, `source`) and a `status.review` value allowed by `docs/agents/publication-standard.md` | spot-check any new record; `npm run validate` 0 errors |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| QIRAAT-R11 | **Qur'an**: the verses on reading and measured recitation (96:1-5, 73:4, 73:20, 25:32, 17:106, 75:16-19, 87:6, 20:114), the tongue of the revelation and its easing (12:2, 26:192-195, 14:4, 54:17), the Book kept and written (15:9, 80:11-16, 98:2-3, 56:77-80, 85:21-22, 29:48, 9:128-129, 33:23), the pen, ink and page (68:1, 31:27, 18:109, 52:1-3, 6:7, 2:282), and the verses in which the readers or the codices of the cities are recorded as differing (e.g. 1:4, 2:132, 2:259, 3:133, 5:6, 9:100, 49:6, 57:24, 91:15) | `qiraat.json` → items with `section:"quran"` ≥ 100; spot-check the ids above |
| QIRAAT-R12 | **Sunnah**: the reports of the seven ahruf ('Umar and Hisham ibn Hakim), Abu Bakr's collection and 'Uthman's copying, the books of «الحروف والقراءات» in Sunan Abi Dawud and «القراءات» in Jami' al-Tirmidhi, the Companions' readings and codices, and the reports that mention the mushaf | `section:"sunnah"` includes `passage/bukhari-2419`, `passage/bukhari-4986`, `passage/bukhari-4987`, `passage/muwatta-1-540` and the `*-api-*` reports of those books |
| QIRAAT-R13 | **Seerah**: the section exists and fills itself — any passage whose work carries genre `sira` and mentions these subjects lands in `seerah` | `qiraatCorpusOf` in `scripts/qiraat.ts`; the section renders nothing while empty |
| QIRAAT-R14 | **Harvested books**: passages mined from the OCR library (al-Itqan, al-Burhan, Manahil al-'Irfan, al-Nashr, al-Taysir, al-Fihrist, Subh al-A'sha, the Muqaddima, the tabaqat, Companion and history books) are `section:"books"` (or `seerah`/`sunnah` by the work's genre) with the work, page marker and a quotation of at most 40 words | items with ids `passage/*-qiraat-*`; `scripts/harvest-qiraat-ocr.ts` |
| QIRAAT-R15 | **Companions and Tabi'in reports** (Zayd ibn Thabit, Hudhayfa, Ibn Mas'ud, Ubayy, Ibn 'Abbas, 'A'isha and Hafsa; Abu al-Aswad, Nasr ibn 'Asim, Yahya ibn Ya'mar, al-Hasan, Ibn Sirin and others) appear as attributed voices in the curated prose and the mined passages | read the events and concepts in the `sciences` section |
| QIRAAT-R16 | **Curated layer**: tagged-in-place records plus the new records listed in `docs/plan/60-qiraat-browser.md` §6, each trilingual with prose in `content/{ar,en,ur}/` | `sciences`, `people`, `scripts`, `works`, `mushafs` section counts > 0; each new record has three prose files |
| QIRAAT-R17 | **Tension cards** (≥ 2 cited voices, no verdict) on the questions scholars differed on, including whether the mushaf may be written in ordinary (imla'i) spelling and what the seven ahruf mean | the `question/*` records tagged `qiraat-browser` carry `perspectives` |
| QIRAAT-R18 | **Voice**: the museum prefers no reading, no script and no side of a disputed question; each view is attributed; no ruling is given | read the questions and `concept/rasm-al-quran` |

## 3. The browser page `/{lang}/qiraat/`

| Id | Requirement | How to check |
|---|---|---|
| QIRAAT-R20 | Page exists in three languages: `/ar/qiraat/`, `/en/qiraat/`, `/ur/qiraat/` (long sections on numbered sub-pages) | `curl -sI` each → 200 |
| QIRAAT-R21 | Localized title «متصفح قراءات القرآن والرسم الإملائي والخطوط والتنقيط» / "Qur'an Readings, Orthography, Scripts and Dotting Browser" / «قرآن کی قراءات، رسم الخط، خطوط اور نقطوں کا براؤزر» + lede + method note + the seven topics defined + status count | `qiraat:` block in `i18n/{ar,en,ur}.yaml` |
| QIRAAT-R22 | Signature view "The ruled page": a line per topic, a dot per section sized by its records, every dot a link; readable without JS | `components/sig/QiraatLines.astro`; `docs/site/signature-views.md` |
| QIRAAT-R23 | Section chips with counts linking to anchors; curated sections before the passage sections; every card links to the ordinary entity page, never a browser-only page | inspect hrefs on `/en/qiraat/` |
| QIRAAT-R24 | Passage cards show work + ref and an excerpt; topic chips show the topics | `/ar/qiraat/` cards |
| QIRAAT-R25 | Client filter over labels, summaries, work names, topic names and excerpts in three languages, Arabic vowel-insensitive; full list readable with JS off; whole-list filter index registered (`browser-registry.ts`) | `site/src/scripts/qiraat-filter.ts`; `/ar/list-index/qiraat.json` |
| QIRAAT-R26 | Pagefind: title, lede, method, topics and headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source |
| QIRAAT-R27 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated, no honorifics typed | validator + visual check |
| QIRAAT-R28 | **Landing card** (ruled page with dotted strokes, accent `#2a6b5a`) and **Explore menu** entry in the "texts" group after the Tafsir Browser, in all three languages | homepage; `nav.ts` `{ key: "qiraat", ready: true }`, `EXPLORE_GROUPS` |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| QIRAAT-R30 | `https://api.islam.museum/api/v1/qiraat.json` lists every detected + tagged record with `section`, `topics`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags` and edges | `curl -s .../qiraat.json \| jq '.items \| length'` > 0; `feature:"qiraat-browser"`; every `section` ∈ the nine; every topic ∈ the seven |
| QIRAAT-R31 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/qiraat.json`), and `llms.txt` | three rows exist |
| QIRAAT-R32 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/site/signature-views.md`, `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`qiraat` lane), `docs/status.md`, `CANARY.md` | rows present |
| QIRAAT-R33 | `features-api.test.ts` asserts `qiraat.json` in the export set and its detection rules | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| QIRAAT-R40 | Gates: `npm run validate` 0 errors, `npm test` pass, `npm run build` clean | run them; the pull request body says which were run before merge and which were left to CI |
| QIRAAT-R41 | Shipped as a pull request with a canary entry; nothing pushed directly to `main` | PR list |
| QIRAAT-R42 | Full trilingual coverage of every new record: `label` and `summary` in ar/en/ur and three prose files | file listing |
| QIRAAT-R43 | Harvest register: the books mined for passages have their `mining` state updated in `docs/library/harvest-register.yaml`; no PDF, OCR text or page image enters git | `npx tsx scripts/check-harvest-register.ts` |
| QIRAAT-R44 | Deploy readiness: nothing live until the founder deploys; then R20, R28 and R30 hold | post-deploy checks |
| QIRAAT-R45 | Blocked organisations never appear (`npm run validate` runs `check-extremism`) | validator |

## 6. Production smoke test (run after the founder's deploy)

```bash
for l in ar en ur; do curl -s -o /dev/null -w "$l %{http_code}\n" https://islam.museum/$l/qiraat/; done
curl -s https://api.islam.museum/api/v1/qiraat.json | jq '{feature, n: (.items|length), sections: ([.items[].section]|unique), topics: ([.items[].topics[]]|unique)}'
curl -s https://api.islam.museum/api/v1/qiraat.json | jq '[.items[] | select(.id=="passage/quran-73-4" or .id=="passage/bukhari-4987" or .id=="concept/qiraat" or .id=="concept/rasm-al-quran")] | map(.id)'
curl -s https://islam.museum/en/ | grep -c "/en/qiraat/"      # landing card + menu entry
curl -s https://islam.museum/llms.txt | grep -c "qiraat.json"
```

Expected: three 200s; `feature` is `qiraat-browser`; sections within the nine and topics within the seven
of §1; the four spot-check ids present; the landing page links to the browser; `llms.txt` names the dataset.

## 7. Known limits

- Detection of non-Qur'an passages is lexical; a mention phrased without the lexicon needs a tag on the
  passage (`qiraat-browser` + `qiraat-<topic>`).
- The Qur'an table lists a reviewed selection of the verses in which the readers differ, not all of them:
  the full farsh of the ten readings is a later wave (`docs/plan/60-qiraat-browser.md` §8).
- Only hadith already harvested into passage records are detected; the curated prose cites the rest by
  collection and number.
- The page numbers of the mined OCR passages are the page markers of the scanned file, which can differ
  by a few pages from the printed edition (each record's `provenance.source` names the file); the OCR
  text of an excerpt is not corrected.
- The prose was written by AI agents from the cited sources and has not been read by a human; each record
  lists its sources so a reader can check it.
