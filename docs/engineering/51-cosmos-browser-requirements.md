# 51 · Cosmos Browser — requirements and production checklist

_The feature requirements for «متصفح الكائنات الفضائية والأمم السابقة لبني البشر وأسرار الكون» (the
Cosmos Browser — beings beyond the earth, the earlier nations and the secrets of the universe, as the
Qur'an, the Sunnah, the seerah and every harvested book carry them), as requested by the founder and
delivered in `docs/plan/59-cosmos-browser.md`. Written so any person or AI agent can validate each
requirement against production (`https://islam.museum`, `https://api.islam.museum`) without reading the
plan. Every requirement has an id (`COSMOS-R..`) and a "how to check" line._

## 0. The original request (verbatim, 15 November 2026)

> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working on
>
> متصفح الكائنات الفضائية وال أمم السابقة لبني البشر واسرار الكون
>
> where it should list all the mentioned and written
>
> الكائنات الفضائية وال أمم السابقة لبني البشر واسرار الكون
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in books that
> were harvested and any future harvested book if it has a
>
> الكائنات الفضائية وال أمم السابقة لبني البشر واسرار الكون
>
> should be viewable here. add a box for it on landing page and in navigation menus. make sure this is
> done end to end and full detailed proses and make it ready for production at the end of this.
>
> this is only about الكائنات الفضائية وال أمم السابقة لبني البشر واسرار الكون and everything mentioned
> about it anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where it was mentioned or part of quotes from quran, sunnah, Hadith, seerah or
> from sa7aba and tabi3een and add those stories, mentions, quotes, details
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

_Interpretation recorded in `docs/plan/59-cosmos-browser.md` §7: "aliens" is read by what the sources
say (creatures dispersed in the heavens, many worlds), kept apart from the angels and jinn (their own
browsers); "nations before mankind" covers the earlier inhabitants of the earth before Adam and the
peoples that vanished in the human story._

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| COSMOS-R01 | No new class or side table: every record is an ordinary graph node — Qur'an verses and passages detected at build time, curated records tagged `cosmos-browser` (+ `cosmos-<topic>`) | `grep -rl "cosmos-browser" data/` — hits under `data/{concept,question,event,place,person,group,passage}/`; `scripts/lib.ts` `CLASSES` unchanged |
| COSMOS-R02 | Five sections derived from the corpus: `quran` · `sunnah` · `seerah` · `books` · `concepts` | `COSMOS_SECTIONS` in `scripts/cosmos.ts`; `site/src/lib/cosmos.ts` |
| COSMOS-R03 | Eight themes: `beyond-earth`, `many-worlds`, `heavens`, `origins`, `before-adam`, `lost-peoples`, `hidden-peoples`, `secrets` | `COSMOS_TOPICS`; `cosmos.topics` in `i18n/{ar,en,ur}.yaml` |
| COSMOS-R04 | **Automatic inclusion of future harvested books**: a mention of these themes in any book enters the browser the day its passage record lands — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «سبع أرضين» to a test work → it appears in `cosmos.json` (`scripts/features-api.test.ts` "exports cosmos") |
| COSMOS-R05 | Qur'an verses come from the reviewed table `COSMOS_QURAN_REFS`, never from word search; a verse not in the table is not listed | `features-api.test.ts` asserts `quran-2-1x` is absent and `quran-42-29x` present |
| COSMOS-R06 | The lexicon is guarded: bare «عاد», «السد», «ستة أيام», «الأفلاك», «ما لا تعلمون», «أهل السماء» never match alone | `features-api.test.ts` (`muwatta-8888`) ; `npx tsx scripts/cosmos-audit.ts` prints each hit with the words that matched |
| COSMOS-R07 | Qur'an text is never typed: verses are the frozen Tanzil `passage/quran-*` records; prose refers to them with `[[passage/quran-S-A\|label]]` | `npm run validate` 0 errors; no ﴿ ﴾ in `content/` |
| COSMOS-R08 | Reuse before create: existing records are tagged in place (29: Gog and Magog, the Cave, the Trench, the Throne, Footstool, Tablet, Pen, Lote-tree, the seven heavens, `ghayb`, Isra' and Mi'raj, 'Ad, Thamud, Saba', Iram, al-Hijr, Hud, Salih, the Two-Horned, celestial-body records, `jinn`) | `git log -p` of the tagging commit; each id exists once |
| COSMOS-R09 | Every AI-authored record carries `sources`, `provenance` and `status.review: draft` | spot-check any new record; `npm run validate` 0 errors |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| COSMOS-R11 | **Qur'an**: the verses on creatures dispersed in the heavens (42:29, 16:8, 36:36, 74:31, 6:38), the worlds and the seven heavens and earths (1:2, 65:12, 2:29, 41:12, 67:3), the beginning of creation (21:30, 41:11, 51:47, 7:54, 11:7), the earlier inhabitants (2:30, 15:27, 55:15, 6:133), the vanished peoples ('Ad, Thamud, Iram, al-Rass, Tubba', al-Aykah, al-Ukhdud, Saba'), the barrier and the Cave (18:9-26, 18:83-99, 21:96), and the unseen (6:59, 17:85, 53:13-18, 2:255, 85:21-22) | `cosmos.json` → items with `section:"quran"` ≥ 300; spot-check the ids above |
| COSMOS-R12 | **Sunnah**: the reports that mention the seven earths, the heavens, the Lote-tree, al-Jassasa, the Throne on the water, the keys of the unseen | `section:"sunnah"` → items include `muslim-0162`, `muslim-2942`, `bukhari-4684`; note: only hadith passages already harvested are detected, the rest are covered in the curated prose with citations |
| COSMOS-R13 | **Seerah**: the section exists and fills itself — any passage whose work carries genre `sira` lands in `seerah` | `cosmosCorpusOf` in `scripts/cosmos.ts`; the section renders nothing while empty |
| COSMOS-R14 | **Harvested books**: passages mined from the OCR library (al-Bidaya wa-l-Nihaya, Tarikh al-Tabari, Qisas al-Anbiya of Ibn Kathir and al-Kisa'i, al-Athar al-Baqiya, Akhbar Makka and the tafsir books) are `section:"books"` with the work, page and a quotation of at most 40 words | `section:"books"` → items with ids `passage/cosmos-*` |
| COSMOS-R15 | **Companions and Tabi'in reports** (Ibn Abbas on the earths and the earlier inhabitants, Ibn Umar, Qatada, Sa'id ibn al-Musayyab, Mujahid, Wahb and others) appear as attributed voices in the curated prose and the mined passages, with the status of each chain stated as the scholars stated it | read `concept/earth-before-adam`, `concept/seven-earths`, `concept/alamin-the-worlds` |
| COSMOS-R16 | **Curated layer**: tagged-in-place records plus the new records listed in `docs/plan/59-cosmos-browser.md` §6, each trilingual with prose in `content/{ar,en,ur}/` | `section:"concepts"` count; each new record has three prose files |
| COSMOS-R17 | **Tension cards** (≥ 2 cited voices, no verdict): `question/is-there-life-beyond-earth`, `question/who-lived-on-earth-before-adam` | both exist with `perspectives` |
| COSMOS-R18 | **Voice**: no claim that extraterrestrials exist or do not; each view is attributed; modern discourse is labelled modern; disputed chains are graded by the named scholar, never by the museum | read `concept/life-beyond-earth-in-the-sources` and `concept/modern-alien-and-ufo-claims-in-islamic-discourse` |

## 3. The browser page `/{lang}/cosmos/`

| Id | Requirement | How to check |
|---|---|---|
| COSMOS-R20 | Page exists in three languages: `/ar/cosmos/`, `/en/cosmos/`, `/ur/cosmos/` (long sections on numbered sub-pages) | `curl -sI` each → 200 |
| COSMOS-R21 | Localized title «متصفح الكائنات الفضائية والأمم السابقة لبني البشر وأسرار الكون» / "Cosmos Browser: Beings, Earlier Nations and the Secrets of the Universe" / کائنات کا براؤزر + lede + method note + status count | `cosmos:` block in `i18n/{ar,en,ur}.yaml` |
| COSMOS-R22 | Signature view: one bar per theme split by section, every segment a link; readable without JS | `components/sig/CosmosThemes.astro`; `docs/site/signature-views.md` |
| COSMOS-R23 | Section chips with counts linking to anchors; every card links to the ordinary entity page, never a browser-only page | inspect hrefs on `/en/cosmos/` |
| COSMOS-R24 | Passage cards show work + ref and an excerpt; topic chips show the themes | `/ar/cosmos/` quran section cards |
| COSMOS-R25 | Client filter over labels, summaries, work names, topic names and excerpts in three languages, Arabic vowel-insensitive; full list readable with JS off; whole-list filter index registered (`browser-registry.ts`) | `site/src/scripts/cosmos-filter.ts`; `/ar/list-index/cosmos.json` |
| COSMOS-R26 | Pagefind: title, lede, headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source |
| COSMOS-R27 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated, no honorifics typed | validator + visual check |
| COSMOS-R28 | **Landing card** (orbit icon, accent `#1f4f6e`) and **Explore menu** entry in the "unseen" group, in all three languages | homepage; `nav.ts` `{ key: "cosmos", ready: true }` |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| COSMOS-R30 | `https://api.islam.museum/api/v1/cosmos.json` lists every detected + tagged record with `section`, `topics`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags` and edges | `curl -s .../cosmos.json \| jq '.items \| length'` ≥ 380; `feature:"cosmos-browser"`; every `section` ∈ {quran,sunnah,seerah,books,concepts}; every topic ∈ the eight |
| COSMOS-R31 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/cosmos.json`), and `llms.txt` | three rows exist |
| COSMOS-R32 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/site/signature-views.md`, `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`cosmos` lane), `docs/status.md`, `CANARY.md` | rows present |
| COSMOS-R33 | `features-api.test.ts` asserts `cosmos.json` in the export set and its detection rules | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| COSMOS-R40 | Gates: `npm run validate` 0 errors, `npm test` pass, `npm run build` clean | run them |
| COSMOS-R41 | Shipped as a pull request with a canary entry (v1.34.0); nothing pushed directly to `main` | PR list |
| COSMOS-R42 | Full trilingual coverage of every new record: `label` and `summary` in ar/en/ur and three prose files | file listing |
| COSMOS-R43 | Draft gate: AI-authored records stay `status.review: draft` | grep new records |
| COSMOS-R44 | Deploy readiness: nothing live until the founder deploys; then R20, R28 and R30 hold | post-deploy checks |
| COSMOS-R45 | Blocked organisations never appear (`npm run validate` runs `check-extremism`); dreams, magic, jinn and angels stay in their own browsers | validator |

## 6. Known limits

- Detection of non-Qur'an passages is lexical; a mention phrased without the lexicon needs a tag on the
  passage (`cosmos-browser` + `cosmos-<topic>`).
- Only hadith already harvested into passage records are detected; further hadith enter as their books
  are mined, and the curated prose cites the rest by collection and number.
- The page numbers of the mined OCR passages are the OCR page markers of the harvested file, which can
  differ by a few pages from the printed edition (each record's `provenance.source` names the file).
- The seerah section is empty until seerah passages with these themes are harvested.
- Everything AI-authored is a draft until a human reads it.
