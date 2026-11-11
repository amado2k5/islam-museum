# 23 · Dream Browser — requirements and production checklist

_The feature requirements for «متصفح الأحلام» (the Dream Browser — every dream
mentioned and written in the Qur'an, the Sunnah, the seerah and every harvested
book), as requested by the founder on 10 November 2026 and delivered in
`docs/plan/35-dreams-browser.md`. Written so any person or AI agent can validate
each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has an
id (`DREAM-R..`), a "how to check" line, and the artifact that proves it._

## 0. The original request (verbatim)

> "get latest from main, clone the repo to a separate folder then start working
> on متصفح الأحلام where it should list all the mentioned and written dreams
> that are in quran, sunnah, any of seerah and any dreams mentioned and written
> in books that were harvested and any future harvested book if it has a dream
> should be viewable here. add a box for it on landing page and in navigation
> menus. make sure this is done end to end and full detailed proses and make it
> ready for production at the end of this. also add this in engineering
> documents as the original requirements to allow AI later on to test and
> validate it when it is in production."

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| DREAM-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `dream-browser` (+ optional `dream-<section>`) | `grep -rl "dream-browser" data/` — all hits under `data/concept/`; `scripts/lib.ts` `CLASSES` unchanged |
| DREAM-R02 | Five sections derived from the corpus, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `concepts` علم الرؤيا | `DREAM_SECTIONS` in `scripts/dreams.ts`; `site/src/lib/dreams.ts` |
| DREAM-R03 | **Automatic inclusion of future harvested books**: a dream in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «رأى في المنام» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `dreams.json` with the right `section`; then remove the fixture |
| DREAM-R04 | Detection vocabulary is unambiguous: `في المنام`, `رؤيا`, `أحلام`, `أضغاث`, `حديث نفس`, `معبّر`/`مؤول`/`تؤل`, the saw-in-sleep formulas (`رأى … في النوم/نومه/منامه`), the `أريت` report formula, English "dream" — and NOT waking sight, the vision of God, similes (`كأنه`), forbearance (`حلم`), "expression" (`تعبير` alone — every interpretation passage carries رؤيا/أحلام/منام anyway), glad tidings without dreams, or the `أحلام العصافير` insult | `scripts/dreams.ts` `AR_DREAM`, `AR_DREAM_SLEEP`, `EN_DREAM`, `DREAM_EXCLUDE`; the known false positives below must NOT appear |
| DREAM-R05 | Known false positives stay out: `passage/bukhari-*` "أرى في نافذة"-type sighting reports, `passage/muwatta-1-187` («تعبيراً عما رآه» — "as an expression of what he saw", adhan chapter, no dream content), `passage/poem-hassan-diwan-har-ibn-kab-ala-al-ahlam-*` (bird-brains insult), `concept/ruyah-fiqh` and `concept/al-ruya-wa-al-risala` (legal sight / strategic vision — NOT tagged) | `dreams.json` contains none of these |
| DREAM-R06 | Qur'an text is never typed: dream ayahs are the frozen Tanzil `passage/quran-*` records; the only edits are `mentions` edges in `relations` | `grep -rn "concept/ahlam" data/passage/quran-*.yaml` — 15 hits; `text`/`text_search` byte-identical to Tanzil (validator enforces) |
| DREAM-R07 | `mentions → concept/ahlam` edges on every detected Qur'an ayah and every detected hadith passage, each citing the record's own source (the one poetry passage carries no edge — the harvested-poetry format has no `relations` block); `mentions → concept/ahlam-al-anbiya` on the 8 narrative prophetic-dream ayahs | `grep -l "concept/ahlam" data/passage/*.yaml \| wc -l` ≥ 33; spot-check `quran-12-4`, `bukhari-3680`, `muwatta-31-2748` |
| DREAM-R08 | Reuse before create: the 5 existing dream concepts (`ruya-fiqh`, `taabir-al-ruya`, `al-hulm`, `ihtilam`, `tafsir-al-ahlam-al-yawm`) are tagged in place, never duplicated; 4 new records (`ahlam`, `kitab-al-ruya`, `mubashshirat`, `ahlam-al-anbiya`) fill the umbrella gaps | each exists once in `data/concept/`; `npm run validate` 0 errors |
| DREAM-R09 | Every record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule); the already-published `tafsir-al-ahlam-al-yawm` keeps `review: published` | spot-check `data/concept/ahlam.yaml`; `npm run validate` 0 errors |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| DREAM-R10 | **Qur'an**: every ayah that mentions or narrates a dream/vision is listed — the Yusuf cycle (12:4,5,36,43,44,100), Ibrahim's sacrifice dream (37:102,105), the Prophet's fulfilled dreams (48:27, 8:43, 17:60), the dream accusations (21:5, 52:32), and the sleep verses (30:23, 39:42) | `/api/v1/dreams.json` `section:"quran"` → 15 items; `/ar/dreams/` quran section shows 15 cards |
| DREAM-R11 | **Sunnah**: the dream reports of the two Sahihs, the Muwatta and the Sunan — the Prophet's dreams (Bukhari 3680/3681, Muwatta 5:894/895), companions' dreams (Muslim 2479, Muwatta 1:172, 2:623), the ru'ya chapter principles (Muwatta 31:2666, 2737, 2746, 2748–2751), ihtilam reports (Muwatta 1:126–128), Tirmidhi 3233 | `section:"sunnah"` → 18 items; each card links to its `/{lang}/passage/<slug>/` page |
| DREAM-R12 | **Seerah**: the section exists in the taxonomy and fills itself — any passage record whose work carries genre `sira` lands in `seerah` automatically | `dreamCorpusOf` in `scripts/dreams.ts`; today the section is empty (no seerah passages harvested yet) — verify it renders nothing rather than erroring |
| DREAM-R13 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a dream passage lands in `books` — currently the Hassan diwan poetry passage | `section:"books"` → ≥1 item; new books appear without code changes (DREAM-R03) |
| DREAM-R14 | **Curated layer**: 9 `concept` records in `section:"concepts"` — 4 new + 5 tagged-in-place — covering the science of dreams: the umbrella, the hadith genre, interpretation, rulings, ihtilam, glad tidings, prophetic dreams, the modern debate | `section:"concepts"` → 9 items; `/ar/dreams/` concepts section lists them |

## 3. The browser page `/{lang}/dreams/`

| Id | Requirement | How to check |
|---|---|---|
| DREAM-R20 | Page exists in all three languages: `/ar/dreams/`, `/en/dreams/`, `/ur/dreams/` | `curl -sI` each → 200 |
| DREAM-R21 | Localized title «متصفح الأحلام» / "Dream Browser" / خوابوں کا براؤزر + lede + badge + method note + status count | `i18n/{ar,en,ur}.yaml` `dreams:` block; view each page |
| DREAM-R22 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections (seerah today) do not render | `/ar/dreams/` shows 4 populated sections; chip counts sum to item count |
| DREAM-R23 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`), never a browser-only page | inspect card `href`s on `/en/dreams/` |
| DREAM-R24 | Passage cards show work name + ref/unit (e.g. «صحيح البخاري · 3681», «القرآن · 12:4») and a text excerpt; concept cards show their summary | `/ar/dreams/` sunnah section cards carry the work/ref line |
| DREAM-R25 | Client filter narrows cards across labels, summaries, work names and excerpts in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/dreams-filter.ts`; open `/ar/dreams/` with JS disabled → full list; type «رؤيا» → filtered cards |
| DREAM-R26 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «الأحلام» reaches the page |
| DREAM-R27 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| DREAM-R28 | **Landing card** on the homepage («متصفح الأحلام» with dream thumbnail) and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "dreams", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| DREAM-R30 | `https://api.islam.museum/api/v1/dreams.json` returns every detected + tagged record with `section`, `work`, `ref`, `unit`, `text`, `kind`, `themes`, `tags`, edges, prose languages | `curl -s .../dreams.json \| jq '.items \| length'` ≥ 40; `feature: "dream-browser"`; `section` ∈ {quran,sunnah,seerah,books,concepts} |
| DREAM-R31 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/dreams.json` path), and `llms.txt` | all three rows exist |
| DREAM-R32 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 35), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`dreams` lane), `docs/status.md`, `CANARY.md` (v1.11.0 + entries), `docs/plan/35-dreams-browser.md`, `docs/engineering/23-dream-browser-requirements.md` | all rows present |
| DREAM-R33 | `features-api.test.ts` asserts `dreams.json` in the export set and its detection/classification rules | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| DREAM-R40 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| DREAM-R41 | All work shipped as small PRs with canary entries; nothing committed directly to protected `main` | merged-PR list; `gh pr list --search dreams` |
| DREAM-R42 | **Full trilingual coverage**: every new concept record has `label.ar/en/ur`, `summary.ar/en/ur`, and `content/{ar,en,ur}/concept/<slug>.md` | the four new records each have 3 prose files |
| DREAM-R43 | Draft gate: all AI-authored records remain `status.review: draft` until a human promotes them | `data/concept/{ahlam,kitab-al-ruya,mubashshirat,ahlam-al-anbiya}.yaml` carry `review: draft` |
| DREAM-R44 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check DREAM-R20/R28/R30 |

## 6. Explicitly out of scope / known limits

- **Seerah section is empty today**: no seerah book has passage records yet; the taxonomy and classifier are ready (`genre: sira` → `seerah`), and the section appears the day such passages are harvested.
- **Detection is lexical, not semantic**: a dream reported without any of the registered Arabic dream formulas or English "dream" (e.g. only «في منامه» variants already covered, or a bare «كأن») may be missed; the escape hatch is the `dream-browser` tag for curated additions.
- **Dream interpretation books** (تعاريف الرؤيا, Ibn Sirin's corpus) are not yet harvested as passage records; when they are, their dream mentions enter via detection and any curated interpretation records join via the tag.
- **No dedicated dream-interpretation engine**: the browser lists and links; it does not interpret dreams for visitors.
- **Poetry inclusion is literal-only**: the one poetry passage counts because it literally reports «يحلم»; similes do not.
- Every new record is draft-tier pending human review (DREAM-R43) — the only gate before counting as published content.
