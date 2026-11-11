# Jinn & Devils Browser — requirements and production acceptance test

«متصفح الشياطين والجن» — the museum's browser over jinn, devils and demons, angels, and the dreams that carry them, as mentioned and written in the Qur'an, the Sunnah, the seerah, the Companion and Tabi'i reports, and every harvested book. Plan: `docs/plan/37-jinn-devils-browser.md`. Lane: `jinn-devils` (`docs/agents/lanes.md`). Implemented in `site/src/pages/[lang]/jinn-devils/`, `site/src/lib/jinn-devils.ts`, `scripts/export-api.ts` (`jinn-devils.json`).

This file is the acceptance spec: each numbered requirement states what must be true, how to check it against the production site, and what the expected result is. Any agent or reviewer can run the checks verbatim. Numbers marked *(derived)* are computed from the graph at build time — the exact figures below are the values at implementation (10 November 2026, 33 browser records); they can only grow as waves land, so test against *at least* those values, or better, against the numbers the graph build reports.

Base URL for checks: `https://islam.museum` (or the current production domain).

## 1. Scope requirement (the original brief, verbatim)

The founder's request of 10 November 2026, kept verbatim so any future agent can validate the shipped browser against it:

> "start working on متصفح الشياطين والجن where it should list all the mentioned and written Jinn and demons/devil that are in quran, sunnah, any of seerah and any dreams mentioned and written in books that were harvested and any future harvested book if it has a Jinn and demons/devil should be viewable here. add a box for it on landing page and in navigation menus. make sure this is done end to end and full detailed proses and make it ready for production at the end of this. this is only about Jinn and demons/devil and everything mentioned about angels in quran, sunnah, serrah, anywhere in any of the sunni books. also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production."

Second instruction, same day:

> "find all the instances where jinn and devil/demons met or interacted with humans in the quran, seerah, sunna, quotes from sa7aba and tabi3een and add those stories, mentions, quotes"

- **R1** The browser covers **jinn and demons/devils** in the Qur'an, Sunnah, seerah, Companion and Tabi'i reports, dreams, and all harvested books — plus **everything mentioned about angels** in the same sources — as graph records tagged `jinn-devils-browser` (with `jd-<section>` tags) inside the one graph, never a side table.
  Check: `curl -s https://islam.museum/api/v1/jinn-devils.json | python3 -c "import json,sys; d=json.load(sys.stdin); items=d if isinstance(d,list) else d['items']; print(len(items))"` → `>= 33`.
- **R2** **Future harvested books surface automatically**: a record from any later book enters the browser the moment it carries the `jinn-devils-browser` tag (or `angels-browser` for the angels section); no code change is needed. The mentions harvester `scripts/harvest/jinn-devils/mentions.py` is idempotent and re-runnable over `data/passage/` so new passage records get their `mentions` edges on the next run.
  Check: `python3 scripts/harvest/jinn-devils/mentions.py` (dry run) reports 0 *new* files against the committed state; the script's PATTERNS table is the classification contract.
- **R3** **Interaction stories**: the records include the meetings and interactions between jinn/devils and humans recorded in the Qur'an, seerah, Sunnah and Companion/Tabi'i reports — at implementation: `event/jinn-delegation` (Sahih Muslim), `event/sihr-against-the-prophet` and `person/labid-ibn-al-asam` (the bewitching, Two Sahihs + Ibn Ishaq), plus the angel-interaction events already in the graph (`event/battle-of-badr`, `event/uhud-archers-mistake`, `person/dihya-al-kalbi`, `event/jinn-hear-the-quran`). Additional waves are planned (plan 37 §6).
  Check: `curl -s https://islam.museum/api/v1/jinn-devils.json` items include `event/jinn-delegation`, `event/sihr-against-the-prophet`, `person/labid-ibn-al-asam`, `person/iblis`, `concept/jinn`, `concept/jinn-anwa`, `concept/qareen`, `concept/shayatin-al-ins-wal-jinn`.

## 2. Pages exist and render in all three languages

- **R4** The landing page exists at `/{lang}/jinn-devils/` for `lang ∈ {ar, en, ur}` and returns HTTP 200.
  `curl -sI https://islam.museum/en/jinn-devils/ | head -1` → `200`. Repeat for `/ar/` and `/ur/`.
- **R5** A subject page exists at `/{lang}/jinn-devils/<slug>/` for every record the lib selects *(derived)*: 33 slugs at implementation, ×3 languages. Spot-check: `/en/jinn-devils/iblis/`, `/en/jinn-devils/jinn/`, `/en/jinn-devils/jinn-anwa/`, `/en/jinn-devils/jinn-delegation/`, `/en/jinn-devils/sihr-against-the-prophet/` all return 200.
- **R6** Pages are readable with JavaScript disabled: title, lede, section headings, cards, verse/hadith text are all in the HTML. The filter is progressive enhancement only.
- **R7** The landing page is indexed for site search: its HTML carries `data-pagefind-body` around title, lede and headings; «Jinn & Devils Browser» / «متصفح الشياطين والجن» / «جنوں اور شیاطین کا براؤزر» is findable via `/{lang}/search/` (Pagefind).

## 3. Taxonomy — four sections

- **R8** The landing page groups records into the `jd-<section>` tags: `jinn` (the jinn), `devils` (devils and demons), `angels` (angels), `dreams` (dreams and dream literature). Each section shows its record count and links its cards. *(derived)* roster at implementation is in `docs/plan/37-jinn-devils-browser.md`.
- **R9** The section set is data-driven: a record re-tagged between sections moves sections on the next build; a record carrying several `jd-*` tags appears in each of its sections; only the four tag names are ordered in `site/src/lib/jinn-devils.ts` `JD_SECTIONS`.

## 4. Subject page content

- **R10** Each subject page shows: the trilingual label and summary; every Qur'an ayah with a `mentions` edge to the record, rendering the ayah's frozen Arabic text and its English/Urdu translations; every hadith passage with a `mentions` edge, as a report card; and `related_to` records as links.
  Spot-check: `/en/jinn-devils/jinn/` shows Qur'an 72 (al-Jinn) ayahs and the shayatin ayahs; `/en/jinn-devils/iblis/` shows Q 2:34, 7:11–18, 15:26–35, 17:61, 18:50, 20:116, 38:69–76; `/en/jinn-devils/sihr/` shows Q 2:102 and the sihr-domain hadith cards.
- **R11** Arabic verse text is byte-identical with the Tanzil passage record it comes from (the page reads `data/passage/quran-*.yaml`; it never stores its own copy).
- **R12** Source distinctions are labelled, not blended: Prophetic text, Companion/Tabi'i reports, seerah narrative and classical lore (e.g. the jinn kinds of `concept/jinn-anwa`) carry their own citations; folklore is not presented as revelation.
- **R13** The angels section shows every record tagged `angels-browser` even when the parallel Angels Browser branch has not landed — the union is in `site/src/lib/jinn-devils.ts` and `scripts/export-api.ts`.

## 5. Independence from sibling browsers (founder architecture rule)

- **R14** Jinn & Devils has its own routes (`/{lang}/jinn-devils/` and `/{lang}/jinn-devils/<slug>/`), its own lib (`site/src/lib/jinn-devils.ts`), its own i18n block (`jinn-devils:`), and its own API file — none shared with `ghayb`, `nature`, `battles` or the Angels Browser.
- **R15** The Explore menu carries the entry as its own item; the landing page carries its own card — `jinn-devils` is a distinct key in `site/src/lib/nav.ts` `explorePages()`, which feeds both `site/src/components/Landing.astro` and `site/src/layouts/BaseLayout.astro`.
- **R16** The Ghayb Browser and Nature Explorer routes, nav entries, landing cards and exports are unchanged by this feature.

## 6. Navigation and discovery

- **R17** The Explore menu contains a «Jinn & Devils Browser» entry in all three languages (`explore.pages.jinn-devils` in `i18n/{ar,en,ur}.yaml`), linking `/{lang}/jinn-devils/`.
- **R18** The landing page shows a dedicated card (title + lede), separate from every other browser card, via `explorePages(lang)`.
- **R19** The browser is registered in `docs/site/browsers.md` (row with routes, plan link, counts), `docs/status.md`, `docs/agents/lanes.md` (`jinn-devils` lane), `docs/plan/37-jinn-devils-browser.md`, the plan index (`docs/plan/00-README.md`), and `CANARY.md` (reader-facing entry per commit).

## 7. API

- **R20** `GET /api/v1/jinn-devils.json` returns 200 with the JSON of all `jinn-devils-browser` records plus `angels-browser` records — *(derived)* 33 items at implementation. Each item carries id, kind, trilingual label, section tags and edges.
  `curl -s https://islam.museum/api/v1/jinn-devils.json | python3 -c "import json,sys; d=json.load(sys.stdin); items=d if isinstance(d,list) else d['items']; print(len(items))"` → `>= 33`.
- **R21** The endpoint is registered in `scripts/export-api.ts` `FEATURE_EXPORTS`, documented in `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`, and appears in `scripts/features-api.test.ts`'s expected list.
- **R22** The export is generated at build time from the graph — never a hand-written file — and stays separate from every other feature export.

## 8. Graph and content rules the browser must obey

- **R23** Graph-backed only: all listings come from entities tagged `jinn-devils-browser` or `angels-browser`. No side table, no second dataset, no page-only dataset.
- **R24** Edges are registered predicates only (`mentions`, `related_to`, `had_participant`, `part_of`, `occurred_at`), each written once on the record that owns it, with cited `sources:`.
- **R25** Qur'an text is never typed into any field — ayahs enter only as `passage/quran-*` relations and the frozen `text`/`text_search` fields.
- **R26** Every record cites defined `data/source/` records; `status.review: draft` with a `provenance` block until a human promotes it.
- **R27** Arabic first: `label.ar` and `summary.ar` on every record; `en` and `ur` shipped in the same commit.
- **R28** No honorifics typed into prose or data fields; Arabic-script parentheses wrapped in U+2066…U+2069; the `jinn-devils` schema kinds (`jinn`, `devil`) stay inside `schema/enums/kinds.yaml` and the regenerated `schema/concept.schema.json` only.
- **R29** Content safety: the extremism hard block stays at 0 errors — no Jinn & Devils record touches a blocked organisation.

## 9. Gates

- **R30** `npm run validate` → 0 errors. `npm test` → all pass. `npm run build` → the jinn-devils routes render in all three languages.
- **R31** Every change appends a reader-facing entry to `CANARY.md` in the same commit.
- **R32** The `.githooks/pre-commit` Qur'an freeze is respected: `data/passage/quran-*.yaml` changes are relation-only (`mentions` edges); any diff touching text fields is a defect.

## 10. Data state at implementation (regression baseline)

| Metric | Value (10 Nov 2026) | Check |
|---|---|---|
| `jinn-devils-browser`-tagged records | 29 (existing) + 4 new = 33 in the browser | `jinn-devils.json` count |
| New records | `concept/jinn-anwa`, `event/jinn-delegation`, `event/sihr-against-the-prophet`, `person/labid-ibn-al-asam` | `data/` |
| `mentions` edges added | ~150 across 97 passage records (sihr 38, shayatin 29, jinn 23, ruya 4, taabir 4, ghul 3, jinn-anwa 3, kahana 2, waswasa 1, lammas 1) | graph build report |
| New concept kinds | `jinn`, `devil` (angel kind already existed) | `schema/enums/kinds.yaml` |
| Sections | 4 (`jinn devils angels dreams`) | landing page headings |
| Languages | ar + en + ur on every record, page, nav string | R4/R27 |
| Harvester | `scripts/harvest/jinn-devils/mentions.py` (idempotent, dry-run by default) | §1 R2 |

## 11. Coverage roster at implementation (spot-check slugs)

- **jinn**: `jinn`, `jinn-anwa`, `qareen`, `mass-al-jinn`, `jinn-hear-the-quran`, `jinn-delegation`, `what-are-jinn`
- **devils**: `iblis`, `shayatin-al-ins-wal-jinn`, `sihr`, `kahana`, `kahana-fiqh`, `al-waswasa`, `waswasa-fiqh`, `al-lamma`, `hasad`, `al-ayn`, `tathir-al-jinn-wal-sihr`, `sihr-against-the-prophet`, `labid-ibn-al-asam`, `fariq-bayn-maasiyat-adam-wa-iblis`, `does-magic-have-a-reality`, `satih-al-kahin`, `shiqq-al-kahin`, `imran-ibn-amir-al-kahin`, `kahin-asfan-al-khuzai`
- **angels**: the records tagged `jd-angels`/`angels-browser` — `battle-of-badr`, `uhud-archers-mistake`, `dihya-al-kalbi`, plus the Angels Browser branch's angel records when it lands
- **dreams**: `taabir-al-ruya`, `al-hulm`, `ruya-fiqh`, `tafsir-al-ahlam-ibn-sirin`, `nuwayri-dream-729`, `the-prophets-dream-of-the-two-gold-bracelets`

*(The exact list is in the graph; this is the acceptance baseline — any missing slug is a defect, any extra is enrichment.)*

## 12. Known open items (not defects)

- All records are `status.review: draft` — awaiting human read before publication tier.
- Interaction-story waves continue: the cave of the three men, the well of Banu Ghifar, the traveller's devil, more seerah and Companion/Tabi'i encounter records — each lands as ordinary tagged records, no page change needed.
- The angels section is a union of `jd-angels` and `angels-browser` tags; when the Angels Browser branch merges, its records appear here automatically and the two browsers' angel rosters reconcile through the shared tags.
- `person/harut` and `person/marut` remain stubs in `data/_stubs.d/quran-mentions.yaml` until sourced person records are written (Q 2:102 names them as teachers of magic).
