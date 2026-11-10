# Nature Explorer — requirements and production acceptance test

«مستكشف الطبيعة» — the museum's browser over the natural world in the Qur'an, hadith and tradition: animals, birds, insects and small creatures, sea creatures, plants and trees, and the phenomena of creation. Plan: `docs/plan/34-nature-browser.md`. Lane: `nature` (`docs/agents/lanes.md`). Implemented in `site/src/pages/[lang]/nature/`, `site/src/lib/nature.ts`, `scripts/export-api.ts` (`nature.json`).

This file is the acceptance spec: each numbered requirement states what must be true, how to check it against the production site, and what the expected result is. Any agent or reviewer can run the checks verbatim. Numbers marked *(derived)* are computed from the graph at build time — the exact figures below are the values at implementation (10 November 2026, 119 records, ~650 `mentions` edges); they can only grow as waves land, so test against *at least* those values, or better, against the numbers the graph build reports.

Base URL for checks: `https://islam.museum` (or the current production domain).

## 1. Scope requirement (the original brief)

- **R1** The browser covers the natural world in Islam — the founder's list: **animals, insects, living organisms, fish, sea/whales/oceans, rivers, trees, plants, birds (incl. hoopoe, eagle, hawk and other bird kinds), ants, spiders, stars, planets, meteors, sun, moon, lions, crocodiles** — as tagged `concept` records of kind `natural` inside the one graph, plus creatures attested only in classical zoology cited to al-Damiri and al-Qazwini.
  Check: `curl -s https://islam.museum/api/v1/nature.json | python3 -c "import json,sys; d=json.load(sys.stdin); items=d if isinstance(d,list) else d['items']; print(len(items))"` → `>= 119`.
- **R2** Every subject links the Qur'an ayahs that mention it (rendered from frozen Tanzil passage records, never typed) and the hadith reports about it where the graph holds them. Spot-check `/en/nature/ant/` shows Q 27:18 with its translation and the ant report family (Muslim/Bukhari/Abu Dawud/Ibn Majah/Nasa'i ant-stung-prophet passages + Abu Dawud 5267); `/en/nature/horse/` shows Q 100 (al-Adiyat) and Q 8:60; `/en/nature/bee/` shows Q 16:68-69 and Bukhari 5684.

## 2. Pages exist and render in all three languages

- **R3** The landing page exists at `/{lang}/nature/` for `lang ∈ {ar, en, ur}` and returns HTTP 200.
  `curl -sI https://islam.museum/en/nature/ | head -1` → `200`. Repeat for `/ar/` and `/ur/`.
- **R4** A subject page exists at `/{lang}/nature/<slug>/` for every record tagged `nature-browser` *(derived)*: 119 slugs at implementation, ×3 languages. Spot-check: `/en/nature/ant/`, `/ar/nature/ant/`, `/ur/nature/ant/`, `/en/nature/whale-of-yunus/`, `/en/nature/crocodile/` all return 200.
- **R5** Every subject page also resolves on the ordinary entity route `/{lang}/concept/<slug>/` — the records are ordinary graph entities, not page-only data.
- **R6** Pages are readable with JavaScript disabled: title, lede, section headings, cards, verse/hadith text are all in the HTML. Filters are progressive enhancement only.
- **R7** The landing page is indexed for site search: its HTML carries `data-pagefind-body` around title, lede and headings; the name «Nature Explorer» / «مستكشف الطبيعة» / «قدرت کا متلاشی» is findable via `/en/search/` (Pagefind).

## 3. Taxonomy — six sections

- **R8** The landing page groups records into the six `nature-<section>` tags: `land` (land animals), `bird`, `insect` (insects and small creatures), `sea` (sea and water creatures), `plant` (plants and trees), `cosmos` (phenomena of creation — sky, weather, minerals, fire, east/west). Each section shows its record count and links its cards. *(derived)* section rosters at implementation are in `docs/plan/34-nature-browser.md` §5.
- **R9** The section set is data-driven: a record re-tagged between sections moves sections on the next build; no section list is hard-coded beyond the six tag names.

## 4. Subject page content

- **R10** Each subject page shows: the trilingual label and summary; every Qur'an ayah with a `mentions` edge to the record, rendering the ayah's frozen Arabic text and its English/Urdu translations; every hadith passage with a `mentions` edge, as a report card; and `related_to` records as links.
- **R11** Arabic verse text is byte-identical with the Tanzil passage record it comes from (the page reads `data/passage/quran-*.yaml`; it never stores its own copy).
- **R12** Interpretation debates are labelled, not adjudicated: e.g. `lion` (qaswara — lion *or* huntsmen) and `talh` (banana tree *or* acacia) carry both readings in their summaries.
- **R13** Tradition-only creatures (crocodile, peacock, phoenix, vulture, bustard, bear, salamander, bat, turtle, heron) are labelled in their summaries as classical zoology/adab lore — never presented as Prophetic text — and cite `source/hayat-al-hayawan-damiri` and/or `source/ajaib-al-makhluqat-qazwini`.

## 5. Independence from the Time Browser (founder rule)

- **R14** Nature Explorer has its own routes (`/{lang}/nature/` and `/{lang}/nature/<slug>/`), its own lib (`site/src/lib/nature.ts`), its own i18n block (`nature:`), and its own API file — none shared with `timeexplorer`. The Time Browser's routes, nav entry, landing card and build behaviour are unchanged by the Nature feature.
- **R15** The Explore menu carries both entries as separate items; the landing page carries both as separate cards — `nature` and `timeexplorer` are distinct keys in `site/src/lib/nav.ts` `explorePages()`.
- **R16** Removing every `nature-browser` tag leaves the Time Browser fully working; removing the Time Browser's records leaves Nature Explorer fully working. No cross-import of Time Browser data or components.

## 6. Navigation and discovery

- **R17** The Explore menu contains a «Nature Explorer» entry in all three languages (`explore.pages.nature` in `i18n/{ar,en,ur}.yaml`), linking `/{lang}/nature/`.
- **R18** The landing page shows a dedicated Nature Explorer card (title + lede), separate from the Time Browser card, via `explorePages(lang)` in `site/src/components/Landing.astro`.
- **R19** The browser is registered in `docs/site/browsers.md` (row with routes, plan link, counts), `docs/status.md`, `docs/agents/lanes.md` (`nature` lane), `docs/plan/34-nature-browser.md`, `docs/plan/00-README.md`, and `CANARY.md` (reader-facing entry per wave).

## 7. API

- **R20** `GET /api/v1/nature.json` returns 200 with a JSON array/object of all `nature-browser` records — *(derived)* 119 items. Each item carries id, kind, trilingual label, section tags and edges.
  `curl -s https://islam.museum/api/v1/nature.json | python3 -c "import json,sys; d=json.load(sys.stdin); items=d if isinstance(d,list) else d['items']; print(len(items))"` → `>= 119`.
- **R21** The endpoint is registered in `scripts/export-api.ts` `FEATURE_EXPORTS`, documented in `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`, and appears in `scripts/features-api.test.ts`'s expected list.
- **R22** The export is generated at build time from the graph — it is never a hand-written file, and it stays separate from every other feature export (`ghayb.json`, `battles.json`, `jobs.json`, …).

## 8. Graph and content rules the browser must obey

- **R23** Graph-backed only: all listings come from entities tagged `nature-browser` (kind `natural`, plus the tagged-in `concept/asal` honey record shared with the Ghayb Browser). No side table, no second dataset, no page-only dataset.
- **R24** Edges are registered predicates only (`mentions`, `related_to`), each written once on the passage/entity record, with cited `sources:`.
- **R25** Qur'an text is never typed into any field — ayahs enter only as `passage/quran-*` relations.
- **R26** Every record cites defined `data/source/` records; every new hadith passage carries `provenance` (`layer`, `source`, `generated_by`, `run`).
- **R27** Arabic first: `label.ar` and `summary.ar` on every record; `en` and `ur` shipped in the same commit. *(verified for all 119 records.)*
- **R28** Draft-tier: every record and new passage is `status.review: draft` — no agent self-promotes to `published`; promotion is a human act.
- **R29** No honorifics typed into prose or data fields; Arabic-script parentheses wrapped in U+2066…U+2069.
- **R30** Content safety: the extremism hard block stays at 0 errors — no Nature record touches a blocked organisation.

## 9. Gates

- **R31** `npm run validate` → 0 errors. `npm test` → all pass (the pre-existing Time-Browser chronology failure on `person/muadh-ibn-jabal` vs `event/plague-of-amwas` is a main-line data issue outside this browser's scope). `npm run build` → the nature routes render.
- **R32** Every change appends a reader-facing entry to `CANARY.md` in the same commit.

## 10. Data state at implementation (regression baseline)

| Metric | Value (10 Nov 2026) | Check |
|---|---|---|
| `nature-browser` records | 119 (108 new `kind: natural` + `concept/asal`) | `nature.json` count |
| `mentions` edges to nature records | ~650 on Qur'an + hadith passages | graph build report |
| New hadith passage records | 7 (bukhari-3303, muslim-2240a, abudawud-5263/5264/5267/5268, bukhari-5684) | `data/passage/` |
| New sources | `hayat-al-hayawan-damiri`, `ajaib-al-makhluqat-qazwini` | `data/source/` |
| New work | `work/ajaib-al-makhluqat` | `data/work/` |
| Sections | 6 (`land bird insect sea plant cosmos`) | landing page headings |
| Languages | ar + en + ur on every record, page, nav string | R3/R27 |

## 11. Coverage roster at implementation (spot-check slugs)

- **land**: elephant, she-camel-of-salih, camel, cow-of-bani-israil, livestock, horse, donkey, buraq, dog, dog-of-the-cave, wolf, serpent-of-musa, apes, swine, ewes-of-david, ram-of-sacrifice, golden-calf, cat, sheep, lizard, hyena, gazelle, hare, jerboa, leopard, cheetah, fox, gecko, mouse, mule, salamander, bear
- **bird**: hoopoe, ababil-birds, birds, crow, quail, ostrich, falcon, hawk, eagle, kite, owl, sparrow, rooster, dove, shrike, peacock, phoenix, vulture, bustard, bat, heron
- **insect**: ant, bee, spider, fly, gnat, locust, lice, frog, scorpion, moth, termite
- **sea**: whale-of-yunus, fish-of-al-khidr, sea-game, pearl-coral, deep-sea, fish, crocodile, turtle
- **plant**: date-palm, olive, fig, pomegranate, grapevine, lote-tree, zaqqum, gourd-plant, mustard-seed, trees-plants, herbs-vegetables, pasture, seeds-grain, tree-of-eden, ginger, camphor, talh, tamarisk, paradise-fruits, asal *(tagged-in legal record)*
- **cosmos**: rain, mountains, thunder-lightning, wind, clouds, night-day, sun, moon, stars, water-of-life, earth, heavens, shadow, rivers-springs, sea, ships, flood, iron, sleep, mirage, planets, meteors, fire, clay-dust, gold-silver, east-west

*(The exact list is in the graph; this is the acceptance baseline — any missing slug is a defect, any extra is enrichment.)*

## 12. Known open items (not defects)

- All records are `status.review: draft` — awaiting human read before publication tier.
- No long-form `content/<lang>/concept/<slug>.md` prose yet for most records; curated story prose is a planned wave.
- The Muwatta hunting/fiqh rulings cited are as transmitted in `source/muwatta-maruf-1997`; the classical-zoology records cite al-Damiri/al-Qazwini as lore, per their `reliability_note`s.
