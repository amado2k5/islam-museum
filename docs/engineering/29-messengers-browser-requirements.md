# 29 · Messengers and Prophets Browser — requirements and production checklist

_The feature requirements for «متصفح الرسل والأنبياء» (the Messengers and
Prophets Browser — every mention of the messengers and prophets in the
Qur'an, the Sunnah, the seerah and every harvested book), as requested by the
founder and delivered in `docs/plan/41-messengers-browser.md`. Written so any
person or AI agent can validate each requirement against production
(`https://islam.museum`, `https://api.islam.museum`) without reading the plan.
Every requirement has an id (`MSG-R..`), a "how to check" line, and the
artifact that proves it._

## 0. The original request (verbatim)

> "megaplan
> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working
> on
>
> متصفح الرسل والانبياء
>
>   where it should list all the mentioned and written
>
>
> الرسل والانبياء
>
>
>
> that are in tabi3een stories , quotes , mentioned and written in books that
> were harvested and any future harvested book if it has a
>
> الرسل والانبياء
>
>
>
> should be viewable here. add a box for it on landing page and in navigation
> menus. make sure this is done end to end and full detailed proses and make
> it ready for production at the end of this.
>
> this is only about
>
> الرسل والانبياء
>
>
> and everything mentioned about
>
> الرسل والانبياء
>
>
>  anywhere in any of the sunni books, quran, sunnah, see rah
>
>
> find all the instances where
>
>
> الرسل والانبياء
>
>
>
> Were mentioned or part of quotes from sa7aba and tabi3een and add those
> stories, mentions, quotes, details
>
>
>
> also add this in engineering documents as the original requirements to allow
> AI later on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or
> download any books, you can use mac apple vision to OCR and then harvest
> those OCRd books or you can find any other online website that you can
> decide whether or not can be authentic and trusted as a source and get from
> it information to fully enrich and fill detailed proses
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

_Scope notes agreed before implementation: the browser covers all prophet
figures (not only the 25 named in the Qur'an), presents subject pages for the
canonical records plus a mention feed over the corpus, is built on `main`
alone, and ships with the standing rule that work is pushed without waiting on
local build/test/CI._

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| MSG-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `messengers-browser` (+ optional `messengers-<section>`), subjects are the canonical `person/*` prophet records | `grep -rl "messengers-browser" data/` — hits under `data/{concept,person,event,passage}/`; `scripts/lib.ts` `CLASSES` unchanged |
| MSG-R02 | Five feed sections derived from the corpus, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` سجلات منتقاة | `MESSENGER_SECTIONS` in `scripts/messengers.ts`; `site/src/lib/messengers.ts` |
| MSG-R03 | **Automatic inclusion of future harvested books**: a prophet/messenger mention in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «النبي»/«نوح» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `messengers.json` with the right `section`; then remove the fixture |
| MSG-R04 | Detection vocabulary is gated: unambiguous names match directly (`نوح`, `ابراهيم`, `موسي`, `عيسى`/`المسيح`, `محمد` in the matn, `الخضر`); ambiguous forms count only beside their own collocations — `صالح` only with Thamud/the messenger formula, `يحيي` only in the annunciation formulas; class terms (`الأنبياء`, `الرسل`, `المرسلين`, `بعثنا`/`أرسلنا` forms, unnamed-prophet phrases) are separate chips | `SUBJECT_PATTERNS`, `SALIH_GATES`, `YAHYA_GATES`, `GENERIC_PATTERNS` in `scripts/messengers.ts` |
| MSG-R05 | Non-subject senses are stripped before matching: `ابن آدم`/`بني آدم`/`ذريته` (mankind, not Adam) and `أبو داود` (the collector, not Dawud) | `NOT_ADAM`, `NOT_DAWUD` in `scripts/messengers.ts`; `passage/muslim-7777`-style «يا ابن آدم» fixture is not a mention |
| MSG-R06 | Detection reads the passage matn only (`text_search`/`text` + English translation), never the isnad-heavy summary or work label; a bare `mentions → person/muhammad` edge is a narrator edge and does not by itself put a hadith in the feed | `arabicMatnOf`/`englishMatnOf` in `scripts/messengers.ts`; the include rule in `site/src/lib/messengers.ts` and `messengerApiData` |
| MSG-R07 | Known false positives stay out, each verified by reading; `MESSENGERS_EXCLUDE` is the curated escape hatch | `MESSENGERS_EXCLUDE` in `scripts/messengers.ts`; excluded ids absent from `messengers.json` |
| MSG-R08 | Qur'an text is never typed: prophet ayahs are the frozen Tanzil `passage/quran-*` records; edits are limited to relations/tags and the canonical retarget `person/zakariya → person/zakariyya`, `person/dhu-al-kifl → person/dhu-l-kifl` | `text`/`text_search` byte-identical to Tanzil (validator enforces); `grep -rn "zakariya\|dhu-al-kifl" data/passage/quran-*.yaml` shows only the retargeted canonical ids |
| MSG-R09 | Canonical subject index: `MESSENGER_SUBJECTS` = Adam, Nuh, Idris, Hud, Salih, Ibrahim, Ismail, Ishaq, Yaqub, Yusuf, Shu'ayb, Ayyub, Musa, Harun, Dawud, Sulayman, Ilyas, al-Yasa, Yunus, Zakariyya, Yahya, Dhu al-Kifl, Isa ibn Maryam, Muhammad, al-Khidr; adjacent figures (Maryam, Pharaohs, Talut, Dhu al-Qarnayn, Luqman, Uzair, false claimants) are not subjects | `MESSENGER_SUBJECTS` in `scripts/messengers.ts`; `/api/v1/messengers.json` `subjects[]` |
| MSG-R10 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule); already-published records keep `review: published` | spot-check `data/person/{idris,hud,ilyas}.yaml`; `npm run validate` 0 errors |
| MSG-R11 | Stale Qur'an-mention stubs are reconciled: `person/zakariya`, `person/dhu-al-kifl`, `person/idris`, `person/hud`, `person/ilyas` removed from `data/_stubs.d/quran-mentions.yaml` once the canonical records exist | `grep -n "zakariya\|dhu-al-kifl\|idris\|hud\|ilyas" data/_stubs.d/quran-mentions.yaml` → no hits |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| MSG-R12 | **Qur'an**: every ayah naming or classing a prophet/messenger is listed — the named figures in the stories of the nations, the missions («بعثنا», «أرسلنا»), the collective descriptions (الأنبياء، الرسل، المرسلون), and the unnamed prophets | `/api/v1/messengers.json` `section:"quran"` items; `/ar/messengers/` quran section cards |
| MSG-R13 | **Sunnah**: the hadiths of the two Sahihs, the Muwatta, the Arba'in and the Sunan that mention prophets/messengers — their stories, states, and the class terms — including Companion and Tabi'in voices in the isnads and matns | `section:"sunnah"` items; each card links to its `/{lang}/passage/<slug>/` page |
| MSG-R14 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `messengerCorpusOf` in `scripts/messengers.ts`; today the section is empty or near-empty (no seerah passages harvested yet) — verify it renders nothing rather than erroring |
| MSG-R15 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a prophet/messenger passage lands in `books` — tafsir, qisas, history, poetry and whatever is harvested next | `section:"books"` items; new books appear without code changes (MSG-R03) |
| MSG-R16 | **Companions and Tabi'in reports**: the isnad-bearing hadith passages carry the Companion/Tabi'in mentions of the prophets (e.g. the Musa–al-Khidr reports, the intercession hadiths naming Adam/Ibrahim/Musa/Isa) | inspect `sunnah` cards: `bukhari-0074/0078/0122`, `bukhari-3339`, `bukhari-3443` present with work+ref |
| MSG-R17 | **Unnamed prophets preserved as unnamed**: passages like «نزل نبي من الأنبياء تحت شجرة» appear under the `unnamed`/`prophets` chips without being assigned to a named subject | `/ar/messengers/` cards show the generic chips; no fabricated subject link |

## 3. The browser pages `/{lang}/messengers/`

| Id | Requirement | How to check |
|---|---|---|
| MSG-R20 | Home page exists in all three languages: `/ar/messengers/`, `/en/messengers/`, `/ur/messengers/` | `curl -sI` each → 200 |
| MSG-R21 | Localized title «متصفح الرسل والأنبياء» / "Messengers and Prophets Browser" / رسولوں اور انبیاء کا براؤزر + lede + badge + method note + status count | `i18n/{ar,en,ur}.yaml` `messengers:` block; view each page |
| MSG-R22 | Subject cards for every canonical prophet/messenger record with mention counts, each linking to `/[lang]/messengers/<slug>/`; section chips with counts; every populated section shows title + description + card grid; empty sections do not render | `/ar/messengers/` shows subject grid + populated sections; chip counts sum to item count |
| MSG-R23 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/`, `/{lang}/person/<slug>/` etc.), never a browser-only page | inspect card `href`s on `/en/messengers/` |
| MSG-R24 | Passage cards show work name + ref/unit and a text excerpt; topic chips show detected subjects and class chips; subject cards show the mention count | `/ar/messengers/` cards carry the work/ref line and chips |
| MSG-R25 | Subject page `/[lang]/messengers/<slug>/` exists for each canonical subject in all three languages: summary lede, passages grouped by corpus (Qur'an ayahs with Tanzil text + translation, Sunnah/seerah/books reports with work+ref + excerpt), sources footnotes, related records | `/ar/messengers/musa/`, `/ar/messengers/muhammad/` render |
| MSG-R26 | Client filter narrows cards across labels, summaries, work names, topic/subject names and excerpts in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/messengers-filter.ts`; open `/ar/messengers/` with JS disabled → full list; type «نوح» → filtered cards |
| MSG-R27 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «الأنبياء» reaches the page |
| MSG-R28 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| MSG-R29 | **Landing card** on the homepage («متصفح الرسل والأنبياء» with messenger icon + accent) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "messengers", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| MSG-R30 | `https://api.islam.museum/api/v1/messengers.json` returns every detected + tagged record with `section`, `subjects`, `topics`, `work`, `ref`, `unit`, `text`, `kind`, `themes`, `tags`, edges, prose languages, plus `subjects[]` (id, label, summary, status, per-corpus counts, passage ids) | `curl -s .../messengers.json \| jq '.items \| length'`; `feature: "messengers-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated} |
| MSG-R31 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/messengers.json` path), and `llms.txt` | all three rows exist |
| MSG-R32 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 41), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`messengers` lane), `docs/status.md`, `CANARY.md`, `docs/plan/41-messengers-browser.md`, this spec | all rows present |
| MSG-R33 | `features-api.test.ts` asserts `messengers.json` in the export set and its detection/classification rules (named subject, gated «صالح», «ابن آدم» strip, edge-mention inclusion, narrator-edge exclusion) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| MSG-R40 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| MSG-R41 | All work shipped as small PRs with canary entries; nothing committed directly to protected `main` | merged-PR list; `gh pr list --search messengers` |
| MSG-R42 | **Full trilingual coverage**: every new record has `label.ar/en/ur`, `summary.ar/en/ur`, and `content/{ar,en,ur}/<class>/<slug>.md` when prose is written | the 3 new records (`idris`, `hud`, `ilyas`) carry trilingual label/summary; prose files added in the same commit or flagged for the prose lane |
| MSG-R43 | Draft gate: all AI-authored records remain `status.review: draft` until a human promotes them | `data/person/{idris,hud,ilyas}.yaml` carry `review: draft` |
| MSG-R44 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check MSG-R20/R29/R30 |
| MSG-R45 | Scope discipline: only prophet/messenger mentions are collected; adjacent figures and generic «رسول» in non-prophetic senses are not forced into subjects | inspect `messengers.json` `subjects`/`topics`; no Maryam/Talut/Dhu-al-Qarnayn subject pages |

## 6. Explicitly out of scope / known limits

- **Story depth**: the browser is a mention index plus subject pages; it does
  not replace the per-prophet biography prose — that grows in the prose lanes.
- **Lexical recall**: a prophet mention phrased without the lexicon needs a
  `messengers-browser` tag on the passage (the documented escape hatch).
- **Seerah**: the section is taxonomy-ready but empty until seerah passages
  are harvested.
- **Identity disputes**: unnamed or disputed figures (Dhu al-Kifl's
  identification, Uzair, Luqman) are not promoted to subjects; they remain
  ordinary records with their own perspectives blocks.
