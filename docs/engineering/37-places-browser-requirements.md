# 37 · Sacred Places Browser — requirements and production checklist

_The feature requirements for «متصفح الأماكن المقدسة والهامة وذات القيمة في
الإسلام» (the Sacred Places Browser — every place of sanctity, importance and
value in Islam the museum's sources mention), as requested by the founder on
11 November 2026 and delivered in `docs/plan/49-places-browser.md`. Written
so any person or AI agent can validate each requirement against production
(`https://islam.museum`, `https://api.islam.museum`) without reading the plan.
Every requirement has an id (`PLACE-R..`), a "how to check" line, and the
artifact that proves it._

## 0. The original request (verbatim)

> "get latest from main, clone the repo to a separate folder then start
> working on متصفح الاماكن المقدسة والهامة وذات القيمة في الاسلام where it
> should list all the mentioned and written [places] that are in quran, see
> rah, sunna, tabi3een stories, quotes, mentioned and written in books that
> were harvested and any future harvested book if it has a [sacred place]
> should be viewable here. add a box for it on landing page and in navigation
> menus. make sure this is done end to end and full detailed proses and make
> it ready for production at the end of this. this is only about [the sacred
> and important places of value in Islam] and everything mentioned about
> [them] anywhere in any of the sunni books or quran or sunna or sera. find
> all the instances where [they] were mentioned or part of quotes from quran,
> sunnah, Hadith, seerah or from sahaba and tabi3een and add those stories,
> mentions, quotes, details. also add this in engineering documents as the
> original requirements to allow AI later on to test and validate it when it
> is in production. you can use mac browser to browse to any web page, to get
> any information or download any books, you can use mac apple vision to OCR
> and then harvest those OCRd books or you can find any other online website
> that you can decide whether or not can be authentic and trusted as a source
> and get from it information to fully enrich and fill detailed proses. when
> context is tight, just commit and push and continue. do not wait for
> build/test or ci. in the end commit, push, raise PR and merge it. Then
> delete all the files and folder related to this work from the microsd."

(Founder decisions taken during planning: sanctity-section structure —
subject pages like the Nature Explorer; `place` **and** `building` classes;
full trilingual prose for every passage-mentioned place; quality-gate waits
waived by explicit instruction.)

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| PLACE-R01 | No new class or side table: every browser member is an ordinary `place` or `building` node — curated via `places-browser` (+ `places-<section>`) tag, automatic via `mentioned_in` edges from passages | `grep -rl "places-browser" data/place data/building`; `scripts/lib.ts` `CLASSES` unchanged |
| PLACE-R02 | Six sanctity sections, not corpora: `sanctuaries` الحرمات الثلاثة · `hajj` مشاعر الحج والمواقيت · `seerah` مواقع السيرة والمغازي · `quran` أماكن سماها القرآن · `sacred` مواقع موقّرة أخرى · `mentioned` وردت في المصادر | `PLACES_SECTIONS` in `scripts/places.ts` |
| PLACE-R03 | **Automatic inclusion of future harvested books**: a place named by any passage in any book enters the browser the day its passage record lands — membership is a build-time function of the compiled graph (tag ∪ `mentioned_in`), never a hand list | add a fixture passage with `mentions → place/x`, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `places.json`; then remove the fixture |
| PLACE-R04 | Both classes walk: `place` and `building` (the three sacred mosques and shrines live in `building`) | `places.json` contains `building/masjid-al-haram`, `building/prophets-mosque`, `building/al-aqsa-mosque` |
| PLACE-R05 | Corpus split is per subject page: `placeCorpusOf` maps a mentioning passage to `quran` (work/quran or unit ayah), `seerah` (genre sira), `sunnah` (genre hadith or unit hadith), `books` (everything else) | `scripts/places.ts`; spot-check `places.json` `mentions` counts for `place/mecca`, `place/medina`, `place/jerusalem` |
| PLACE-R06 | Untagged automatic members land in `mentioned` — the self-growing shelf; curated `places-<section>` tags route to their section; an unregistered tag id also falls back to `mentioned` | `placeSectionOf` in `scripts/places.ts`; `places.json` `section` values ∈ the six ids |
| PLACE-R07 | Qur'an text is never typed: subject pages render ayah text from the frozen Tanzil `passage/quran-*` records; the only data edits are `mentions` edges in `relations` | `site/src/pages/[lang]/places/[slug].astro`; Tanzil checksum validator green |
| PLACE-R08 | Reuse before create: `place/mecca`, `place/medina`, `place/jerusalem`, `place/quba`, `place/uhud`, `place/badr`, `building/masjid-al-haram`, `building/prophets-mosque`, `building/masjid-quba`, `building/kaaba`, `building/al-aqsa-mosque`, `building/al-haram-al-sharif`, `place/ghar-hira`, `place/ghar-thawr`, `place/baqi-al-gharqad` are tagged in place, never duplicated | each exists once; `npm run validate` 0 errors |
| PLACE-R09 | Every new or touched record carries `sources`, `provenance`, and `status.review: draft` until a human reads it (AI-content rule) | spot-check the new records; `npm run validate` 0 errors |

## 2. Coverage

| Id | Requirement | How to check |
|---|---|---|
| PLACE-R10 | **The three sanctuaries**: Mecca + Masjid al-Haram/Kaaba, Medina + the Prophet's Mosque, Jerusalem + al-Aqsa/al-Haram al-Sharif all carry the tag and land in `sanctuaries` | `/ar/places/` sanctuaries section lists them |
| PLACE-R11 | **Hajj stations**: al-Safa, al-Marwa, Mina, Arafat, Muzdalifa, the Jamarat, and the miqat stations (Dhu al-Hulayfa, al-Juhfa, Qarn al-Manazil, Yalamlam…) in `hajj` | `/ar/places/` hajj section; `places.json` `section:"hajj"` ≥ 8 |
| PLACE-R12 | **Seerah sites**: Ghar Hira, Ghar Thawr, Quba, Uhud, Badr, Hunayn, al-Hudaybiyya, Khaybar, al-Ta'if, al-Baqi', Saqifat Bani Sa'ida, Ghadir Khumm, al-Ji'ranah in `seerah` | `/ar/places/` seerah section; `places.json` `section:"seerah"` ≥ 12 |
| PLACE-R13 | **Qur'anic places**: Madyan, Saba, Misr, Babil, Iram, al-Ahqaf, Judi, Tur Sina, Najran, Yathrib — the towns, lands and mountains the Qur'an names — in `quran` | `/ar/places/` quran section |
| PLACE-R14 | **Mention edges enriched**: Qur'an ayahs that name places carry `mentions → place/…` edges citing the passage's own source | `grep -l "target: place/" data/passage/quran-*.yaml` grew beyond the pre-feature 24; spot-check quran-2-125 (Bakka/Mecca), quran-7-85 (Madyan), quran-11-44 (Judi), quran-34-15 (Saba) |
| PLACE-R15 | **Every passage-mentioned place appears**: all ~85+ pre-existing `mentions` targets are members (automatic layer), not just the curated set | `places.json` item count ≥ the distinct `mentions → place/` targets in `data/passage/` |
| PLACE-R16 | Trilingual prose for every member in scope: `content/{ar,en,ur}/{place,building}/<slug>.md` exists for each curated member; Arabic first | `ls content/ar/place/` covers the curated set; en/ur mirrors exist |

## 3. The browser pages `/{lang}/places/` and `/{lang}/places/<slug>/`

| Id | Requirement | How to check |
|---|---|---|
| PLACE-R20 | Pages exist in all three languages: `/ar/places/`, `/en/places/`, `/ur/places/` | `curl -sI` each → 200 |
| PLACE-R21 | Localized title «متصفح الأماكن المقدسة والهامة وذات القيمة في الإسلام» / "Sacred Places Browser" / «اسلام کے مقدس اور اہم مقامات کا براؤزر» + lede + badge + method note + status count | `i18n/{ar,en,ur}.yaml` `places:` block; view each page |
| PLACE-R22 | Section chips with counts link to anchors; populated sections show title + description + card grid; empty sections do not render | `/ar/places/` chip counts sum to item count |
| PLACE-R23 | Home cards link to the browser subject page `/{lang}/places/<slug>/`; subject pages link to the ordinary entity page `/{lang}/place/<slug>/` or `/{lang}/building/<slug>/` | inspect card `href`s |
| PLACE-R24 | Home cards show per-corpus mention counts (Qur'an · n) and the place summary | `/ar/places/` cards carry the counts line |
| PLACE-R25 | Subject page groups mentions by corpus: Qur'an ayah cards render the frozen Tanzil text with the page language's translation (none on ar), then Sunnah, seerah and book reports each with work + ref | `/en/places/mecca/` ayah cards show verse text; report cards show work·ref |
| PLACE-R26 | Client filter narrows cards across labels and summaries in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/places-filter.ts`; JS-disabled view shows the full list |
| PLACE-R27 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes |
| PLACE-R28 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| PLACE-R29 | **Landing card** on the homepage and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "places", ready: true }` |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| PLACE-R30 | `https://api.islam.museum/api/v1/places.json` returns every member with `section`, per-corpus `mentions` counts, `kind`, `coordinates`, `regions`, `tags`, `connections`, `prose` languages | `curl -s …/places.json \| jq '.items \| length'` ≥ 90; `feature: "places-browser"` |
| PLACE-R31 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/places.json` path), and `llms.txt` | all three rows exist |
| PLACE-R32 | Registered in `docs/site/browsers.md`, `docs/plan/00-README.md` (plan 49), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`places` lane), `docs/status.md`, `CANARY.md` (v1.21.0), `docs/plan/49-places-browser.md`, this file | all rows present |
| PLACE-R33 | `features-api.test.ts` asserts `places.json` in the export set | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| PLACE-R40 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them (the founder waived waiting on them; run opportunistically) |
| PLACE-R41 | Work shipped as PRs with canary entries; the microSD working copy deleted after merge | merged-PR list; `/Volumes/exmicroSD/islam-museum-places` absent after delivery |
| PLACE-R42 | Full trilingual coverage: every new record has `label.ar/en/ur`, `summary.ar/en/ur`, and `content/{ar,en,ur}/` prose | spot-check new records |
| PLACE-R43 | Draft gate: all AI-authored records remain `status.review: draft` until a human promotes them | `data/place/*.yaml` touched records carry `review: draft` |
| PLACE-R44 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + pages + API appear automatically | post-deploy check PLACE-R20/R29/R30 |

## 6. Explicitly out of scope / known limits

- **Buildings are members only as sacred sites or passage-mentioned** — the
  5,792-strong building class is not bulk-included; only the tagged set and
  the mentioned set appear.
- **`mentioned` is the self-growing shelf**: a place only named in a book
  not yet harvested appears when the book lands, not before.
- **No pilgrimage planner or ranking**: the browser lists, groups and
  links; it does not route journeys or rank sanctity.
- Every new record and prose file is draft-tier pending human review
  (PLACE-R43).
