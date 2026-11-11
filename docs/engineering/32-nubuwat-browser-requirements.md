# 32 · Nubuwat Browser — requirements and production checklist

_The feature requirements for «متصفح النبؤات وأسرار القرآن ومعجزاته» (the
Nubuwat Browser — every prophecy of the Prophet, proof of prophethood, secret
and marvel of the Qur'an, miracle of the Prophet, report of unseen knowledge
and eschatological prediction mentioned or written in the Qur'an, the Sunnah,
the seerah, Companion and Tabi'i reports and every harvested book), as
requested by the founder and delivered in `docs/plan/44-nubuwat-browser.md`.
Written so any person or AI agent can validate each requirement against
production (`https://islam.museum`, `https://api.islam.museum`) without
reading the plan. Every requirement has an id (`NUB-R..`), a "how to check"
line, and the artifact that proves it._

## 0. The original request (verbatim)

> "megaplan — Use microsd instead of Mac main drive, get latest from main,
> clone the repo to a separate folder then start working on نبؤات الرسول
> وأسرار وخبايا ومعجزات القران where it should list all the mentioned and
> written نبؤات الرسول وأسرار وخبايا ومعجزات القران that are in quran, see
> rah, sunna, tabi3een stories, quotes, mentioned and written in books that
> were harvested and any future harvested book if it has a نبؤات الرسول
> وأسرار وخبايا ومعجزات القران should be viewable here. add a box for it on
> landing page and in navigation menus. make sure this is done end to end and
> full detailed proses and make it ready for production at the end of this.
> this is only about نبؤات الرسول وأسرار وخبايا ومعجزات القران and everything
> mentioned about نبؤات الرسول وأسرار وخبايا ومعجزات القران anywhere in any of
> the sunni books or quran or sunna or sera. find all the instances where
> نبؤات الرسول وأسرار وخبايا ومعجزات القران Were mentioned or part of quotes
> from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add
> those stories, mentions, quotes, details. also add this in engineering
> documents as the original requirements to allow AI later on to test and
> validate it when it is in production. you can use mac browser to browse to
> any web page, to get any information or download any books, you can use mac
> apple vision to OCR and then harvest those OCRd books or you can find any
> other online website that you can decide whether or not can be authentic
> and trusted as a source and get from it information to fully enrich and
> fill detailed proses. when context is tight, just commit and push and
> continue. do not wait for build/test or ci. in the end commit, push, raise
> PR and merge it. Then delete all the files and folder related to this work
> from the microsd"

Scope note: «نبؤات الرسول وأسرار وخبايا ومعجزات القران» covers the Prophet's
prophecies and predictions, the proofs of prophethood, the Qur'an's secrets,
inimitability and marvels, the Prophet's miracles, the reports of unseen
knowledge, and the eschatological predictions — across the Qur'an, Sunnah,
seerah, Companion/Tabi'i reports and every harvested book, present and
future. Overlap with the Signs-of-the-Hour Browser on eschatology and with
the Dream Browser on dreams is accepted: this browser is the prophecy-and-
marvel union, not a replacement.

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| NUB-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `nubuwat-browser` (+ optional `nubuwat-<section>` / `nubuwat-<topic>`) | `grep -rl "nubuwat-browser" data/`; `scripts/lib.ts` `CLASSES` unchanged |
| NUB-R02 | Five sections derived from the corpus: `quran` · `sunnah` · `seerah` · `books` · `curated` | `NUBUWAT_SECTIONS` in `scripts/nubuwat.ts`; `site/src/lib/nubuwat.ts` |
| NUB-R03 | **Automatic inclusion of future harvested books**: a prophecy or marvel in any book enters the browser the day its passage record lands in the graph | add a fixture passage containing «من بعدي يأتي» to a test work, run `npm run graph && npm run api`, confirm it appears in `nubuwat.json` with the right `section`; then remove the fixture |
| NUB-R04 | Detection is over passage-owned text (`text`, `text_search`, Arabic label/summary, English label/summary/translation) — never chapter titles alone | `nubuwatTopicsOf` in `scripts/nubuwat.ts` |
| NUB-R05 | Seven topic families: `nubuwwa`, `nubuwat`, `muajizat`, `ijaz`, `asrar`, `ilm-ghayb`, `akhira` | `NUBUWAT_TOPICS`; `nubuwat.json` rows carry `topics` |
| NUB-R06 | Guarded lexicon: ambiguous forms (يأتي/سيأتي، معجز، سر، غيب، آخرة، ساعة، باطن، ظاهر، مثله) count only beside a domain collocation in the same passage; verified false positives excluded by id in `NUBUWAT_EXCLUDE` | `scripts/features-api.test.ts` nubuwat test: «ياتي بالليل» fixture absent, «من بعدي» and «انشق القمر» fixtures present |
| NUB-R07 | Bare nature vocabulary never counts as miracle: نور، ماء، سماء، ارض، جبال، شمس، قمر، نجوم، نار، ظلام، رؤيا، منام are excluded from unguarded matching | a fixture «أنزل الله من السماء ماء» must not produce `muajizat` |
| NUB-R08 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books | `nubuwatCorpusOf` |
| NUB-R09 | English signals mirror the museum's translations (prophecy, miracle, inimitability, unseen, Dajjal/Mahdi/eschatology) | `EN_*` patterns in `scripts/nubuwat.ts` |
| NUB-R10 | Reuse before create: curated records use existing concepts where they exist; new records (dalā'il works, prophecy concepts) cite defined sources with `status.review: draft` + `provenance` | spot-check new `data/` files |

## 2. Surface

| Id | Requirement | How to check |
|---|---|---|
| NUB-R11 | Page at `/[lang]/nubuwat/` for ar, en, ur — badge, breadcrumb, title, trilingual lede, build-time status count, method note, API link | open `/ar/nubuwat/`, `/en/nubuwat/`, `/ur/nubuwat/` |
| NUB-R12 | Five section chips with live counts; topic chips per record; filter input narrows by title/summary/work/excerpt in all three languages ignoring Arabic diacritics | type in the filter; `nubuwat-filter.ts` normalization |
| NUB-R13 | No-JavaScript fallback: the complete list is readable server-rendered; `data-pagefind-body` on the header block, `data-pagefind-ignore` on the filterable list | disable JS; Pagefind indexes title/lede/headings |
| NUB-R14 | Landing-page card with decorative SVG and accent colour; Explore/navigation entry `/{lang}/nubuwat/` marked ready | landing page grid; Explore menu |
| NUB-R15 | Trilingual i18n: `nubuwat:` block (title, lede, badge, status, method_title, method_note, api, sections_title, filter_label, filter_none, empty, topics×7, sections×5 title+desc) and `explore.pages.nubuwat` in `i18n/{ar,en,ur}.yaml` | `grep -n "nubuwat:" i18n/*.yaml` |

## 3. API

| Id | Requirement | How to check |
|---|---|---|
| NUB-R16 | `/api/v1/nubuwat.json` exported by `FEATURE_EXPORTS` in `scripts/export-api.ts`, feature `nubuwat-browser`, with `section` + `topics` extras | `curl https://api.islam.museum/api/v1/nubuwat.json` |
| NUB-R17 | Documented in `docs/data/README.md`, `site/public/openapi/v1.json`, `site/src/pages/llms.txt.ts` | grep each file for `nubuwat` |
| NUB-R18 | `scripts/features-api.test.ts` covers detection, gating, sections, topics and the file list | `npx vitest run scripts/features-api.test.ts` |

## 4. Data wave and registers

| Id | Requirement | How to check |
|---|---|---|
| NUB-R19 | Bounded mining wave: ~35–40 sourced passage records from al-Bayhaqi's *Dalā'il al-Nubuwwa* and Abū Nu'aym's *Khalā'il al-Nubwwa* (OCR on the SD card), ≤25 records per batch, source refs preserved, no invented text; Abū Nu'aym work record created if missing | `data/passage/` files citing the two works; `docs/delegation/` mining note |
| NUB-R20 | Registers updated: `docs/site/browsers.md`, `docs/plan/00-README.md`, roadmap, `docs/agents/lanes.md`, `docs/status.md` | grep each for `nubuwat`/`44-`/`32-` |
| NUB-R21 | `CANARY.md` entry under the new version block (v1.17.0) in the same commit | top of `CANARY.md` |

## 5. Production validation checklist

1. `npm run validate` → 0 errors; `npm test` → all pass; `npm run build` → clean.
2. `/ar/nubuwat/` `/en/nubuwat/` `/ur/nubuwat/` render with counts > 0.
3. `/api/v1/nubuwat.json` returns items with `section` ∈ {quran,sunnah,seerah,books,curated} and `topics` ⊆ the seven families.
4. Landing page shows the Nubuwat card; Explore menu links to it.
5. Pagefind search for «معجزات» or "prophecies" surfaces the browser page.
6. A known prophecy («ليأتين عليكم من بعدي») and a known miracle (انشقاق القمر) both appear; a generic «ياتي بالليل» passage does not.
