# 38 · Hasanat and Sayyi'at Ledger, Calculator and Counter — requirements and production checklist

_The feature requirements for «قائمة وآلة حاسبة وعدّاد للحسنات والسيئات» (the list, calculator
and counter of good and bad deeds: every text in the Qur'an, the Sunnah, the seerah, Companion
and Tabi'i reports and every harvested book that counts, writes, multiplies, erases, weighs or
reckons a deed), as requested by the founder on 11 November 2026 and delivered in
`docs/plan/50-hisab-browser.md`. Written so any person or AI agent can validate each
requirement against production (`https://islam.museum`, `https://api.islam.museum`) without
reading the plan. Every requirement has an id (`HISAB-R..`), a "how to check" line, and the
artifact that proves it._

## 0. The original request (verbatim)

> "Use microsd instead of Mac main drive. get latest from main, clone the repo to a separate
> folder then start working on قائمة و ألة حاسبة و عداد للحسنات والسيئات where it should list
> all the mentioned and written قائمة و ألة حاسبة و عداد للحسنات والسيئات that are in quran,
> see rah, sunna, tabi3een stories , quotes , mentioned and written in books that were harvested
> and any future harvested book if it has a قائمة و ألة حاسبة و عداد للحسنات والسيئات should be
> viewable here. add a box for it on landing page and in navigation menus. make sure this is
> done end to end and full detailed proses and make it ready for production at the end of this.
> this is only about قائمة و ألة حاسبة و عداد للحسنات والسيئات and everything mentioned about
> قائمة و ألة حاسبة و عداد للحسنات والسيئات anywhere in any of the sunni books or quran or sunna
> or sera. find all the instances where قائمة و ألة حاسبة و عداد للحسنات والسيئات Were mentioned
> or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those
> stories, mentions, quotes, details. also add this in engineering documents as the original
> requirements to allow AI later on to test and validate it when it is in production. you can
> use mac browser to browse to any web page, to get any information or download any books, you
> can use mac apple vision to OCR and then harvest those OCRd books or you can find any other
> online website that you can decide whether or not can be authentic and trusted as a source and
> get from it information to fully enrich and fill detailed proses. when context is tight, just
> commit and push and continue. do not wait for build/test or ci. in the end commit, push, raise
> PR and merge it. Then delete all the files and folder related to this work from the microsd."

Scope note (the agent's reading, recorded so it can be audited): the request names three things
— a **list** (قائمة), a **calculator** (آلة حاسبة) and a **counter** (عدّاد) — of good and bad
deeds. The Hasanat Browser (plan 45) and the Sayyi'at Browser (plan 44) already list every plain
mention of «الحسنات» and «السيئات». This feature is therefore the *arithmetic* of deeds: the
texts that state a number, a multiple, a writing, an erasure, a measure, a weighing or a
reckoning. A text that only mentions good or bad deeds, with no counting element, stays in those
two browsers and is out of scope here by design.

The museum's voice rule applies in full: the page describes what the texts state and gives no
ruling and no promise. The calculator multiplies the visitor's count by the figure a named text
states; it does not compute anyone's standing.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| HISAB-R01 | No new class and no side table: list items are ordinary `passage` records detected at build time; curated records are `concept` records tagged `hisab-browser` | `grep -rl "hisab-browser" data/` hits only `data/concept/hisab-*.yaml`; `scripts/lib.ts` `CLASSES` unchanged |
| HISAB-R02 | Calculator rows are graph records too: a `concept` tagged `hisab-calculator` with a `reckoning` block (`effect`, optional `hasanat`, `hasanat_max`, `sayyiat`, `erased`, `degrees`, `times`, `unbounded`, localized `unit` and `result`, and `basis`: the passage ids the figure is read from) | `schema/concept.schema.json` has `reckoning`; `scripts/gen-schema.ts`; `grep -l "^reckoning:" data/concept/hisab-*.yaml` → 24 files |
| HISAB-R03 | Every figure in a `reckoning` block is stated by a passage listed in its `basis`, and every `basis` id resolves to a record | open a row, open its basis passage, read the number in the passage text; `npm run validate` 0 errors |
| HISAB-R04 | Five sections derived from the corpus: `quran`, `sunnah`, `seerah`, `books`, `curated` | `HISAB_SECTIONS` in `scripts/hisab.ts` |
| HISAB-R05 | Four ledger kinds per passage (a passage may carry several): `hasanat` (written, numbered, multiplied, ranks, qirat of reward, equivalences), `sayyiat` (a bad deed numbered or written, a qirat lost, a burden carried, the bankrupt), `erasure` (erased, shed, expiated, exchanged, past sins forgiven), `scale` (the Scale, the record and its scribes, the reckoning) | `HISAB_KINDS`, `hisabKindsOf` in `scripts/hisab.ts`; `hisab_kinds` in `/api/v1/hisab.json` |
| HISAB-R06 | **Automatic inclusion of future harvested books**: a counting text in any book enters the list the day its passage record lands — detection is a build-time function of the compiled graph, never a hand-kept list | the `futurezuhd-1` fixture in `scripts/features-api.test.ts`; or add a passage with «غفر له ما تقدم من ذنبه» to a test work, rebuild the API and find it in `hisab.json` with `section: "books"` |
| HISAB-R07 | Detection reads passage-owned text only (`text_search`, then `text`), never labels or summaries | `hisabSignalsOf` in `scripts/hisab.ts` |
| HISAB-R08 | Matching runs on folded text: vowel marks and tatweel stripped, dagger alif and wasla mapped to alif, hamzated alifs folded, so fully vowelled hadith text and bare Qur'an search text match the same patterns | `hisabFold`; the `tirmidhi-9990` vowelled fixture in the test |
| HISAB-R09 | A plain mention with no counting element is NOT listed | fixture `passage/quran-7-131x` in the test is absent from `hisab.json` |
| HISAB-R10 | Guarded forms: «مثقال ذرة/حبة» counts only for deeds, not for faith in the intercession reports; «سريع الحساب» does not count in the supplication against the Confederates; «خير منها» counts only after «بالحسنة فله» | fixtures `bukhari-9990`, `tirmidhi-9991` absent; `passage/quran-28-84` present |
| HISAB-R11 | Verified false positives are frozen by id in `HISAB_EXCLUDE`: `quran-55-8` (the trade balance), `quran-3-130` (usury doubled), `quran-7-95` (hardship exchanged for ease), `quran-54-43`, `quran-33-68` | none of these ids appears in `/api/v1/hisab.json` |
| HISAB-R12 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books | `hisabCorpusOf` |
| HISAB-R13 | Harvested hadith passages carry `mentions → concept/hisab-al-hasanat-wal-sayyiat` (plus `concept/al-hasanat` / `concept/al-sayyiat` by kind), `sources`, `provenance` naming the hadith-api edition and number, a matn excerpt of at most 55 words with honorific formulas left out, and `status.review: draft` | any `data/passage/*-api-*.yaml` with run `hisab-hadithapi-1` |
| HISAB-R14 | The umbrella `concept/hisab-al-hasanat-wal-sayyiat` has `label`/`summary` in ar/en/ur, sources, provenance, `related_to` edges to `al-hasanat`, `al-sayyiat`, `al-hisab`, `al-mizan`, `kitab-al-amal`, `kiraman-katibin`, `kaffara`, `tawba`, and full prose in three languages | `data/concept/hisab-al-hasanat-wal-sayyiat.yaml`; `content/{ar,en,ur}/concept/hisab-al-hasanat-wal-sayyiat.md` |
| HISAB-R15 | Content rules hold: no Qur'an text typed (verses are linked as `[[passage/quran-s-a]]`), no honorifics typed, Arabic text carries no bare parentheses, AI text is `draft` with provenance | `npm run validate` 0 errors |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| HISAB-R20 | **Qur'an** (107 ayahs at delivery): tenfold and its like (6:160, 28:84, 27:89, 40:40), multiplication (2:245, 2:261, 4:40, 57:11, 64:17), remission and exchange of bad deeds (4:31, 5:12, 11:114, 25:70, 29:7, 47:2, 64:9, 65:5, 66:8), the scribes and the record (82:10–12, 50:17–18, 18:49, 17:13–14, 45:29, 36:12, 69:19, 84:7), the Scale (7:8–9, 21:47, 23:102–103, 101:6–8, 99:7–8, 31:16), the reckoning (2:284, 13:41, 24:39, 65:8) | `/api/v1/hisab.json` items with `section: "quran"`; spot-check the listed verses on `/ar/hisab/` |
| HISAB-R21 | **Sunnah** (603 reports at delivery, 538 of them harvested for this feature from the seven hadith-api Arabic editions: Bukhari, Muslim, Abu Dawud, al-Tirmidhi, al-Nasa'i, Ibn Majah, the Muwatta): the hadith qudsi of the writing of good and bad deeds, the letter of the Qur'an, the hundred tasbih and tahlil, the ten for one blessing, the twenty-seven ranks, the steps to the mosque, the qirat of the funeral and of the dog, the expiations, the bankrupt, the first thing reckoned | `section: "sunnah"`; spot-check `muslim-0131`, `tirmidhi-api-2910`, `muslim-api-6852`, `muwatta-1-560`, `nasai-api-1297`, `muslim-0650`, `bukhari-api-647`, `bukhari-api-1325`, `bukhari-api-2322`, `muslim-api-552`, `muslim-2581`, `abudawud-0864` |
| HISAB-R22 | **Seerah**: the section exists and fills itself from any work with genre `sira` | empty at delivery; the page renders no empty section |
| HISAB-R23 | **Harvested books**: every other work with a counting passage lands in `books` | 1 at delivery (`tathbit-j1-026`); future books appear without code changes (HISAB-R06) |
| HISAB-R24 | **Companions and Tabi'in**: their reports arrive through the same detector as sunnah or book passages; no separate pipeline | a Companion statement in a harvested work with a counting phrase appears with its work label |
| HISAB-R25 | **Curated layer**: 25 records — the umbrella article and 24 calculator rows (`hisab-al-hasana-al-mamula`, `hisab-al-hamm-bil-hasana`, `hisab-tark-al-sayyia`, `hisab-al-sayyia-al-mamula`, `hisab-al-tahlil-mia`, `hisab-al-tasbih-mia`, `hisab-subhan-allah-wa-bihamdih`, `hisab-harf-al-quran`, `hisab-al-salat-ala-al-nabi`, `hisab-salat-al-jamaa`, `hisab-al-khuta-ila-al-masjid`, `hisab-qirat-al-janaza`, `hisab-qirat-iqtina-al-kalb`, `hisab-siyam-ramadan-wa-qiyamuh`, `hisab-al-hajj-wal-umra`, `hisab-mukaffirat-ma-baynahunna`, `hisab-sawm-arafa-wa-ashura`, `hisab-al-nafaqa-fi-sabil-allah`, `hisab-al-dalala-ala-al-huda-wal-dalala`, `hisab-surat-al-ikhlas-thuluth-al-quran`, `hisab-umra-fi-ramadan`, `hisab-al-shawka-wal-musiba`, `hisab-khuruj-al-khataya-bil-wudu`, `hisab-al-muflis`) | `section: "curated"` → 25 items |

## 3. The page `/{lang}/hisab/`

| Id | Requirement | How to check |
|---|---|---|
| HISAB-R30 | The page exists in all three languages | `curl -sI https://islam.museum/{ar,en,ur}/hisab/` → 200 |
| HISAB-R31 | Localized title, lede, badge, status count, the "before you count" caveat, the method note and the API link, all inside `data-pagefind-body` | view each page; `i18n/{ar,en,ur}.yaml` `hisab:` block |
| HISAB-R32 | **Calculator**: one table row per calculator record with the act (linked to its entity page), the unit, what the text states (figures and the worded result), links to the basis passages, and a count input | `/ar/hisab/#calculator` shows 24 rows; every row has at least one basis link |
| HISAB-R33 | Calculator sums: good deeds written (a range `min – max` when a text gives a range), bad deeds written, bad deeds erased, ranks; rows whose text names no figure list their worded result under the totals; the columns are never subtracted from one another | enter 3 on «الحسنة المعمولة» → 30 – 2,100; enter 2 on «التهليل مائة مرة» → adds 200 good deeds and 200 erased; enter 1 on «شهود الجنازة» → the qirat sentence appears under "results with no figure" |
| HISAB-R34 | **Counter**: a tally with a chooser (free tally + every row that names a repetition count), +1, undo and reset; on reaching the stated number the row's result appears with a link to the row; the tally is kept in `localStorage` (`hisab-counter-v1`) and sent nowhere | choose «مائة تسبيحة», press 100 times → "ألف حسنة…" appears; reload → the tally is still there; the network panel shows no request |
| HISAB-R35 | **List**: section chips with counts, a search filter (ignores Arabic vowel marks), kind buttons with counts, and a card per item linking to the ordinary entity page with work, reference, kind chips and an excerpt | filter «قيراط» → only qirat cards; press «محو وتكفير» → only erasure cards |
| HISAB-R36 | No JavaScript needed to read: the table and the whole list are in the HTML; inputs are disabled and the totals, the counter panel and the kind buttons are hidden until the script runs; `<noscript>` notes explain | view source or disable JavaScript |
| HISAB-R37 | Accessibility: table headers with `scope`, labelled inputs, 44px targets, `aria-live` on totals and tally, `aria-pressed` on kind buttons, `dir="auto"` on source text | axe or Lighthouse on `/en/hisab/` |
| HISAB-R38 | Landing page card and Explore menu entry in all three languages | `/ar/` shows the card «قائمة وآلة حاسبة وعدّاد الحسنات والسيئات»; the Explore menu lists it; `site/src/lib/nav.ts` key `hisab` |

## 4. API, search, documentation

| Id | Requirement | How to check |
|---|---|---|
| HISAB-R40 | `/api/v1/hisab.json` exports every item with `section`, `hisab_kinds`, `signals`, `reckoning` (null for non-rows), work, ref, text, themes, tags and edges | `curl -s https://api.islam.museum/api/v1/hisab.json \| jq '.feature, (.items\|length)'` → `"hisab-browser"`, ≥ 736 |
| HISAB-R41 | The export is documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/hisab.json`) and `llms.txt` | grep each file for `hisab.json` |
| HISAB-R42 | Search: every record is an entity page; the landing header is indexed and the long lists are `data-pagefind-ignore` | search «آلة حاسبة الحسنات» on the site |
| HISAB-R43 | Registered in `docs/site/browsers.md`, the plan index, the roadmap, `docs/agents/lanes.md`, `docs/status.md` and `CANARY.md` | grep each for `hisab` |
| HISAB-R44 | Tests: the feature export test covers detection by corpus and kind, the calculator row, the gated false positives and future-book inclusion | `npx vitest run scripts/features-api.test.ts` |

## 5. Known limits at delivery (11 November 2026)

- Every record is `review: draft` until a human reads it (AI-content rule). The harvested hadith
  labels and summaries are generated from the matched signals; the matn excerpts are the
  edition's text.
- Narration variants are shown, not ranked: twenty-seven and twenty-five ranks, one qirat and
  two, "or" and "and" in the hundred tasbihs. Hadith grading is not modelled; where al-Tirmidhi
  states a grade in the excerpt it is visible in the passage text.
- Reports that count a deed without any of the detector's signals are not listed (for example
  the greeting of peace counted as ten, twenty and thirty in the Sunan, where the word for good
  deeds is absent from the short wording). They enter when a signal is added.
- The seerah section is empty until seerah works with counting passages are harvested; books of
  merits and of renunciation (Riyad al-Salihin in full, al-Targhib wa al-Tarhib, Ibn al-Mubarak's
  al-Zuhd, Ibn Abi al-Dunya) are the next harvest targets for Companion and Tabi'i reports.
- The full site build and Lighthouse were not run for this delivery on the founder's
  instruction ("do not wait for build/test or ci"); `npm run validate` and the feature tests
  were run.
