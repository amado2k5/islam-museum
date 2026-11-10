# 19 · Asma ul Husna Browser — requirements and production checklist

_The feature requirements for «متصفح أسماء الله الحسنى» (the Browser of the Most
Beautiful Names), as approved by the founder in `docs/plan/29-asma-browser.md`
and delivered in PR #5811 (merged 9 November 2026). This document is written so
any person or AI agent can validate each requirement against the production site
(`https://islam.museum`, `https://api.islam.museum`) without reading the plan.
Every requirement has an id (`ASMA-R..`), a "how to check" line, and the build
target that proves it._

## 1. Catalog and data model

| Id | Requirement | How to check |
|---|---|---|
| ASMA-R01 | All **99 names** exist as graph records: `data/concept/asma-*.yaml`, `class: concept`, `kind: divine-name` | `ls data/concept/asma-*.yaml | wc -l` = 99 (excluding `asma-allah-al-husna.yaml`); `npm run validate` 0 errors |
| ASMA-R02 | Every record has `id`, `kind: divine-name`, `order` 1–99 (Tirmidhi enumeration, unique), `parent_concept: concept/asma-allah-al-husna` via `part_of`, trilingual `label`/`summary` (ar/en/ur), `name_meta` (transliteration, root, enumeration), `sources`, `status`, `provenance` | validator enforces order/enumeration/source on divine-name records; spot-check `data/concept/asma-al-rahman.yaml` |
| ASMA-R03 | The enumeration is the Tirmidhi list; where the Ibn Majah list differs it must be **labelled**, never silently conflated | `name_meta.enumeration` field; differences flagged when sourced (deferred, §6) |
| ASMA-R04 | No new graph class; names are `concept` records, not a side table | `schema/classes.yaml` unchanged; `data/concept/` holds them |
| ASMA-R05 | Every fact cites a defined source (Jami' al-Tirmidhi for the list; Jala' al-Afham for meaning; Tanzil for ayah edges; collection source for hadith edges) | every record/edge carries `sources:`; validator rejects orphan edges |
| ASMA-R06 | Qur'an text is never typed — occurrences are edges to frozen Tanzil `passage` records | `grep -c "passage/quran-"` in name prose; no verse text inside `data/concept/asma-*` |

## 2. The browser landing page `/{lang}/asma/`

| Id | Requirement | How to check |
|---|---|---|
| ASMA-R10 | Page exists in all three languages: `/ar/asma/`, `/en/asma/`, `/ur/asma/` | `curl -sI` each → 200 |
| ASMA-R11 | Localized title «متصفح أسماء الله الحسنى» / "The Most Beautiful Names Browser" / اسمائے حسنیٰ براؤزر and lede | view page, or `grep "asma.title"` the three `i18n/*.yaml` |
| ASMA-R12 | All **99 names shown as a numbered grid** in enumeration order; every card links to `/{lang}/asma/<slug>/` | count links on `/en/asma/` = 99; numbers 1–99 present |
| ASMA-R13 | Each card shows Arabic name, transliteration, brief meaning | card markup carries all three |
| ASMA-R14 | Client-side filter input narrows the grid, **vowel-insensitive** for Arabic (`الرحمن` matches `رحمن`) | type in the box on `/ar/asma/`; JS file `site/src/scripts/asma-filter.ts` normalizes NFKC + strips tashkil |
| ASMA-R15 | **Works with JavaScript disabled** — full grid readable | open with JS off; all 99 cards visible |
| ASMA-R16 | Pagefind: landing title/lede/headings indexed (`data-pagefind-body`); long card lists not flooding the index | search `islam.museum` for «الرحمن» lands on `/ar/asma/` |
| ASMA-R17 | RTL correct on `/ar/` and `/ur/`; Arabic parentheses isolated (U+2066/U+2069) | validator; visual check |
| ASMA-R18 | Landing page reachable from the homepage **landing card** and the **Explore menu** in all three languages | homepage card «أسماء الله الحسنى» links `/ar/asma/`; Explore menu lists it (auto from `explorePages`) |

## 3. Name pages `/{lang}/asma/<slug>/`

| Id | Requirement | How to check |
|---|---|---|
| ASMA-R20 | All 99 names have a page in each language (297 pages) | `curl -sI /en/asma/al-rahman/` etc. → 200; sitemap lists them |
| ASMA-R21 | Hero: Arabic name, transliteration, English/Urdu label, order number, meaning summary | open `/ar/asma/al-rahman/` |
| ASMA-R22 | **Story sections, each populated only when cited records exist:** Qur'an passages, hadith, seerah events, Companions (sahaba), the righteous (saliheen), paired names, curated prose, link to the canonical `concept` record | e.g. `/en/asma/al-rahman/` shows Qur'an + Sunna; `/en/asma/al-sabur/` shows the Bilal story under people sections; sections with no edges are absent, never "empty" chrome |
| ASMA-R23 | Qur'an section lists the ayat that contain the name, as links to `passage/quran-<s>-<a>` records | e.g. al-Rahman lists 1:1, 17:110, the Hashr close for the 59:22–24 names |
| ASMA-R24 | Hadith section: the founding hadith («إن لله تسعة وتسعين اسمًا…») + naming reports as links | `passage/muslim-2677` and `bukhari-*`/`muwatta-*` refs |
| ASMA-R25 | Exemplar stories render for the wired persons (Bilal→الصبور, Salman→الهادي, Rabi'a→الودود, Uways→البر, Umar→العدل, Uthman→الكريم, Ali→الحكم, Abu Ubayda→الوكيل, Maryam→الرزاق, Ibrahim→السلام, Yusuf→اللطيف, Sulayman→الوهاب, Ayyub→الرحيم, Musa→المجيب, the Prophet→الرحيم) and the Hudaybiyya naming dispute→الرحمن | `/en/asma/al-sabur/` shows Bilal's story; `/en/asma/al-rahman/` shows the seerah card |
| ASMA-R26 | Paired names (الرحمن/الرحيم, الأول/الآخر, القابض/الباسط …) link each other via `related_to` | the al-Rahman page links al-Rahim and vice versa |
| ASMA-R27 | Entity pages are indexed by search as normal entities | Pagefind query for a name lands its detail page |
| ASMA-R28 | No figurative depictions, no honorifics typed, no invented stories — every claim traceable to a `source/` record | validator; visual review |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| ASMA-R30 | `https://api.islam.museum/api/v1/asma.json` returns all 99 items with `id`, `kind`, `order`, `name_meta`, trilingual labels, edges/connections, prose languages | `curl -s .../asma.json | jq '.items | length'` = 99 |
| ASMA-R31 | Ordered by enumeration (order 1 = al-Rahman) | first item `order: 1` |
| ASMA-R32 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json`, `llms.txt` | the three rows exist |
| ASMA-R33 | Registered in `docs/site/browsers.md` (feature row + export row), `docs/agents/lanes.md` + `lanes/asma.md`, `docs/status.md`, `docs/plan/00-README.md`, `docs/delegation/asma-progress.md`, `CANARY.md` | all rows present |
| ASMA-R34 | `features-api.test.ts` asserts `asma.json` in the export set | `npm test` green |

## 5. Governance and site rules

| Id | Requirement | How to check |
|---|---|---|
| ASMA-R40 | Graph + API + search — the never-bend rule (`AGENTS.md`) | §1, §4, R16/R27 all pass |
| ASMA-R41 | Arabic first; en/ur shipped in the same commits, `status.review: draft` with provenance on AI content | records/prose carry provenance + draft |
| ASMA-R42 | WCAG 2.2 AA; no JS needed to read any page | JS off: grid + detail pages fully readable; headings/labels/focusable links |
| ASMA-R43 | Deploy-churn rule: `nav.ts` is a shell file → the merge was labelled `rewrites-all-pages` for the weekly batch | PR #5811 |
| ASMA-R44 | CANARY entry per change under `v1.5.1` | CANARY.md Added section |

## 6. Deferred items (by design — not defects)

- ~40 names have no verbatim Qur'an occurrence and show brief + Sunna only (truthful: the name as such doesn't appear; tafsir-backed variant edges may be added in waves).
- `name_meta.enumeration` flags for Ibn Majah differences pending a sourced comparison.
- Curated per-name story prose is generated-at-draft depth; deeper Ibn Qayyim-style narratives land in waves (lane `asma`, ≤25/commit).
- All AI content stays `draft` until a human reads it — draft is a review state, not a quality verdict.

## 7. One-line production smoke test

```bash
for u in /ar/asma/ /en/asma/ /ur/asma/ /ar/asma/al-rahman/ /en/asma/al-sabur/ /ur/asma/al-wahid/; do
  curl -sI "https://islam.museum$u" | head -1; done
curl -s https://api.islam.museum/api/v1/asma.json | jq '.items | length'   # → 99
curl -s https://islam.museum/en/asma/ | grep -c 'href="/en/asma/al-'     # → 99
```
