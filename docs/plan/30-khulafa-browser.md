# 30 · The Khulafa Browser: proposal

Status: **proposal, awaiting the founder's approval.** Nothing in schema, data, site, i18n or the canon changes until it is approved (`docs/ai-change-gates.md` §1). This document is the only file this change adds, together with its row in `docs/plan/00-README.md`.

Requested by the founder in chat, 9 November 2026: «megaplan — متصفح الخلفاء», with permission to browse the web for data, download books to the harvest drive, OCR them with Apple Vision and harvest from the museum's trusted sources and canons.

## 0 · What the browser is for, and what it is not

The browser gives every caliph a page: his reign in both calendars, his bay'a and his succession — who came before, who came after — then the events, buildings and works his reign saw, the realm he ruled, and the stories and perspectives his record carries. The caliphs are grouped by the caliphate they ruled: the Rashidun, the Umayyads of Damascus, the Umayyads of Cordoba, the Abbasids of Baghdad and the Cairo line, the Fatimids, the Almohads, the Ottomans and the Sokoto line — and the rival claims that ran alongside them (Ibn al-Zubayr's Meccan caliphate, the Hammudids, the Sharifian claim of 1924) labelled as claims.

The browser describes, it does not prescribe and it does not judge. The museum's frame is Sunni (`docs/scope.md`): the Fatimid and Almohad claims are shown as those houses stated them and labelled by tradition in `perspectives`, with no verdict; a contested accession — Saqifa, the arbitration, Ibn al-Zubayr, the Abbasid da'wa — gets the same labelled treatment the golden record `person/abu-bakr` already models. A caliph page is a reading of the one graph through a single reign: every record shown is an ordinary museum record, cited, reachable from every other page, exported in the API and indexed by search.

## 1 · What the repository already has (checked 9 November 2026)

- **Persons** (`data/person/`, 11,318 records). The Rashidun five are the gold shape: `person/abu-bakr`, `umar-ibn-al-khattab`, `uthman-ibn-affan`, `ali-ibn-abi-talib`, `hasan-ibn-ali` each carry `roles: […, caliph]` and `story_roles: { role: ruler, toward: polity/rashidun-caliphate, start, end, sources }`. Umayyad, Abbasid, Fatimid, Cordoba, Almohad, Ottoman and Sokoto caliph records largely exist (the CANARY records a date-enrichment pass over "the full Abbasid and Cairo-caliph succession" and the Fatimid caliphs) but **only 28 persons carry a `role: ruler` story_role, and only 5 toward a caliphate** — the reign edge is missing almost everywhere (e.g. `person/abd-al-malik-ibn-marwan`, rich prose, no reign). ~27 records carry `caliph` in `roles:`; several are non-caliphate uses (Mouride khalifas of Touba, a daughter of al-Mustanjid) — an audit decides each.
- **Polities** (`data/polity/`): `rashidun-caliphate`, `umayyad-caliphate`, `umayyads-of-cordoba`, `abbasid-caliphate`, `fatimid-caliphate`, `almohad-caliphate`, `ottoman-empire` (kind `empire`), `sokoto-caliphate` — all with `capitals`, `start`/`end`, `periods`.
- **Predicates** (`schema/predicates.yaml`): `ruler_of` (person→polity), `ruled_over` (person|polity→polity|place|group), `successor_of` (person→person, inverse `predecessor_of`), `part_of`, `had_participant`, `occurred_at` — temporal, inverses computed. No "under the reign of" edge exists for events/works/buildings yet (§2.3).
- **Events** carry `date`, `periods`, `occurred_at`, `sides`, `map.center` (gold: `event/expedition-of-al-sawiq`).
- **Geo** (`geo/`): the format `geo/polity/<slug>-<year>.geojson` dated extents is defined (plan 16 §2.2) — the folder exists and is empty.
- **Sources already filed**: `source/tarikh-khulafa-minhaj-1434` (al-Suyuti, *Tarikh al-Khulafa*), `source/tabari-tarikh-abu-al-fadl`, `source/kamil-ibn-al-athir`, `source/tarikh-khalifa-umari-1985` (Khalifa ibn Khayyat), `source/khulafa-rashidun-salabi`, `source/siyar-alam-nubala*`, `source/encyclopaedia-of-islam-2`, `source/umayyad-birth-to-fall-2006`, TDV biographies, Wikidata where a second source exists.
- **Browser precedent:** `site/src/pages/[lang]/asma/{index,[slug]}.astro`, `site/src/lib/asma.ts`, `site/src/scripts/asma-filter.ts`, the `asma:` i18n blocks, the `asma.json` row in `scripts/export-api.ts`, the `asma` key in `site/src/lib/nav.ts` (plan 29, approved and phased 1–3 done 9 November 2026).

## 2 · The data model (proposed)

### 2.1 Classes and kinds

- **Each caliph** = `person` record. The caliphate is carried structurally: `roles` includes `caliph`, and `story_roles` carries `{ role: ruler, toward: polity/<caliphate>, start, end, status, sources }` — the exact shape of `person/abu-bakr`. No new class, no new kind required on `person`; `ruler` is already a registered story role.
- **Each caliphate** = existing `polity` record of kind `caliphate` (Ottoman stays kind `empire` — the browser groups it under the caliph sections because the sultans held the claim from 1517, labelled as a claim that became formal).
- **Rival claims** get their own `polity` records, created only where a real claim existed: `polity/zubayrid-caliphate` (Mecca, 683–692), `polity/hammudid-caliphate` (Cordoba, 1016+), `polity/sharifian-caliphate` (Husayn ibn Ali, 1924–1925, contested and brief). The browser labels these sections «مطالبات بالخلافة».
- No side table: `datasets/khulafa-roster.csv` is a working research artifact (like the existing sira datasets), never read by the site.

### 2.2 Fields

Reuse existing fields; nothing new is proposed on `person` or `polity`.

| Group | Field | Shape | Notes |
|---|---|---|---|
| Identity | `roles` | `[…, caliph]` | Only on caliphs; the audit removes/handles non-caliphate uses (Mouride khalifas stay, labelled) |
| Reign | `story_roles[]` | `{ role: ruler, toward: polity/<caliphate>, start: {edtf, hijri, calendar, precision, status}, end: {…}, sources }` | Golden shape; dates EDTF + Hijri string + calendar + precision; conversions `derived` |
| Reign edge | `relations[]` | `{ type: ruled_over, target: polity/<caliphate>, role: "الخليفة", sources }` | Written once, inverse computed |
| Succession | `relations[]` | `{ type: successor_of, target: person/<predecessor>, sources }` | Between consecutive caliphs of one polity |
| Polity | `capitals`, `start`, `end`, `periods` | existing | Enriched where missing; `successor_of` between polities already present on `umayyad-caliphate` |
| Sources | `sources[]` | ≥ 1 defined source per record | Suyuti's Tarikh al-Khulafa is the classical spine; Ottoman/Sokoto rows cite their own filed or newly harvested sources |
| Provenance | `provenance`, `status.review` | existing | AI output `draft` until a human reads |

Order inside a chain is **computed** from `story_roles` start dates — no `order` field; the roster CSV is the audit checklist.

### 2.3 Edges (one new predicate proposed)

| Edge | Predicate | Page section |
|---|---|---|
| `person` → `polity/<caliphate>` | `ruled_over` (existing) + `story_roles` | The reign box |
| `person` → `person` | `successor_of` (existing) | The predecessor/successor strip; the chain page order cross-checks it |
| `event`/`building`/`work`/`invention` → `person` | **`during_reign` (proposed, inverse `reign_saw`)** | «أحداث العهد» — events of the reign |
| `event` → `place` | `occurred_at` (existing) | Map pins |
| `polity` → `person` | `ruled_by` (computed inverse) | Polity pages gain the ruler list automatically |

`during_reign` domain `[event, building, work, invention]`, range `[person, polity]`, temporal false (the reign dates live on the ruler's story_roles). If the founder prefers no new predicate, the pages fall back to derived edges (`derived: true`) computed from event dates within the reign span — flagged clearly as derived.

### 2.4 Rival claims, ceremonial caliphs and labels

- **Ibn al-Zubayr** and the **Hammudids** appear under their own claim-polity sections; `person/abd-allah-ibn-al-zubayr`'s record keeps its `perspectives`.
- **The Cairo Abbasid line** (1261–1517) is labelled ceremonial — the Mamluk sultans ruled; the record says so, cited.
- **Ottomans**: the page notes the caliph claim was asserted from Selim I's 1517 transfer and formalised later; `person/abdulmecid-ii` closes the browser (caliphate abolished 1924).
- **Fatimids and Almohads**: `traditions`/`faith` recorded with basis; `perspectives` states the Sunni view first, then the academic view, each cited — never a verdict, never "enemy of Islam".

### 2.5 The roster (working spine, ~140–160 caliphs)

| Polity | Caliphs | State of records |
|---|---|---|
| `rashidun-caliphate` | 5 | All exist with reign edges |
| `umayyad-caliphate` (Damascus) | 14 | Most exist; reign edges missing |
| `umayyads-of-cordoba` | ~9 | Caliphs from `abd-al-rahman-iii` (929); earlier emirs shown as polity rulers, not caliphs |
| `abbasid-caliphate` (Baghdad) | 37 | Records exist per the CANARY succession pass |
| `abbasid-caliphate` (Cairo line) | ~16 | Labelled ceremonial |
| `fatimid-caliphate` | 14 | Exist; `shia-ismaili` tradition labelled |
| `almohad-caliphate` | ~13 | |
| `ottoman-empire` | ~30 | Claim labelled; last caliph Abdulmejid II |
| `sokoto-caliphate` | ~20 | amir al-mu'minin line from `usman-dan-fodio` |
| claims | ~4–6 | Zubayrid, Hammudid, Sharifian |

## 3 · Browser design (proposed)

### 3.1 Routes and components

- `/[lang]/khulafa/` — landing: Pagefind header block (`data-pagefind-body`: title, lede, status line with counts read at build), a chronologically ordered set of caliphate sections; each section shows its chain as numbered reign cards (name, reign CE+Hijri, one-line gloss) with a no-JS-safe filter; the grids sit inside `data-pagefind-ignore`. Claims sections come last, labelled.
- `/[lang]/khulafa/<slug>/` — per-caliph page: the reign box (CE + Hijri spans, duration, bay'a or claim note), the predecessor/successor strip, then headed sections — «أحداث العهد» (reign events from `during_reign` inverses), the realm map (capital + `occurred_at` places; the polity extent when `geo/polity/` data exists), the stories, the `perspectives` block where contested, and the link to the full museum record `/{lang}/person/<slug>/` (which continues to resolve and cross-links back, the Job Browser pattern).
- `/[lang]/khulafa/<polity-slug>/` — per-caliphate chain page: the ordered succession as one ribbon, the polity summary, capitals, extent map when sourced.
- `site/src/lib/khulafa.ts` — build-time accessors over the compiled graph (`asmaNodes`-style): `caliphsByPolity` (persons with a `ruler` story_role toward a `caliphate`-kind polity, ordered by reign start), `chainOf(polity)`, `reignEventsOf(person)` (computed inverses), realm-geo accessor. Counts are read at build and appear on the browser's pages only.
- `site/src/scripts/khulafa-filter.ts` — the filter script, a plain compiled file per the deploy-churn rule.
- i18n: a `khulafa:` block in `i18n/{ar,en,ur}.yaml` in the same commit (title, lede, badge, section titles, reign/chain/claims labels, empty-state lines).
- Explore-menu entry (`nav.ts` key `khulafa`) and landing card, marked «قيد الإعداد» until the founder flips it live.

### 3.2 Data flow and hosting

Everything is build-time SSG over the compiled graph; no runtime calls, no AI at runtime. `geo/` is an existing data folder already on the R2 lists (verify `R2_DATA_DIRS` at implementation); the design adds no new folders, so `workers/*` and `deploy.yml` stay untouched. If any new folder proves necessary it becomes a separate `submission-impacting` sign-off.

### 3.3 Search and API

- `/api/v1/khulafa.json` — every caliph: polity, order in chain, reign (CE + Hijri), predecessor/successor ids, trilingual label/summary.
- `/api/v1/khulafa/chains.json` — per-polity ordered chains including claims.
- Both added to `scripts/export-api.ts` with a row in `docs/data/README.md`, a path in `site/public/openapi/v1.json` and a line in `site/src/pages/llms.txt.ts`. The generic `person`/`polity` exports already carry the records.
- Landing carries `data-pagefind-body`; caliph pages are entity pages (auto-indexed); the long grids are ignored.

## 4 · Content plan

- **Roster research first** (`datasets/khulafa-roster.csv`): each row polity, order, person slug, reign CE+Hijri, source ref — built from Suyuti's *Tarikh al-Khulafa* (through al-Musta'in II, 1517), Tabari, Ibn al-Athir, Khalifa ibn Khayyat, EI2, TDV; Ottoman and Sokoto rows cite their own sources, with books downloaded to the harvest drive and OCR'd where the filed canon does not cover them.
- **Phase 1 (schema):** `during_reign` predicate (if approved), validator rule (a `ruler` story_role toward a `caliphate`-kind polity requires `caliph` in `roles` — and the reverse), vitest tests.
- **Phase 2 (data):** reign `story_roles` + `ruled_over` + `roles: [caliph]` on existing records; new `person` records for missing caliphs (trilingual label + summary, `draft` + `provenance`); the claim polities; `successor_of` edges; polity `capitals`/dates enrichment. Batches ≤ 25 entities per commit, CANARY each.
- **Phase 3 (site):** lib + three route families + filter script + trilingual i18n + API exports + register/lane/status rows.
- **Phase 4 (edges and maps):** `during_reign` edges in waves from dated events, buildings, works and inventions; `geo/polity/<polity>-<year>.geojson` sourced extents flagged `precision: schematic`.
- **Phase 5 (prose):** trilingual `content/{ar,en,ur}/person/<caliph>.md` where the record is thin, draft-tier, batches ≤ 25.

## 5 · The lane

- Lane name: `khulafa`.
- Scope: the roster audit, the reign edges and `caliph` roles on every caliph record, the claim polities, the succession edges, the browser pages, the API exports, the extent geojson and the reign-event edges.
- Files, after approval: `docs/agents/lanes/khulafa.md`, `docs/delegation/khulafa-progress.md`, `data/_stubs.d/khulafa.yaml` when the first stub is needed, a row in `docs/agents/lanes.md`, a row in `docs/status.md`. Owner line set by the founder.

## 6 · Files this proposal touches, and risk labels

| File | Intent | Label |
|---|---|---|
| `docs/plan/30-khulafa-browser.md` (new) | This proposal | `non-impacting` |
| `docs/plan/00-README.md` | One row for plan 30 | `non-impacting` |
| `schema/predicates.yaml` | `during_reign`/`reign_saw` | `non-impacting`; predicate change, needs approval |
| `scripts/validate.ts` | caliph role ⇔ ruler-toward-caliphate consistency | `non-impacting`; needs approval |
| `data/person/*.yaml` | `roles`, `story_roles`, `ruled_over`, `successor_of` with sources; new records | `non-impacting` inside the lane |
| `data/polity/*.yaml` | Enrichment; ~3 claim polities | `non-impacting` inside the lane |
| `datasets/khulafa-roster.csv` (new) | Working roster | `non-impacting` |
| `geo/polity/*.geojson` (new) | Sourced schematic extents | `non-impacting` inside the lane |
| `site/src/lib/khulafa.ts`, `site/src/pages/[lang]/khulafa/**`, `site/src/scripts/khulafa-filter.ts` | Browser pages | `non-impacting`; new routes need approval |
| `i18n/{ar,en,ur}.yaml` | `khulafa:` keys | `non-impacting`; new keys need approval |
| `scripts/export-api.ts`, `site/public/openapi/v1.json`, `docs/data/README.md`, `site/src/pages/llms.txt.ts` | `/api/v1/khulafa.json`, `/khulafa/chains.json` | `non-impacting`; needs approval |
| `docs/site/browsers.md`, `docs/agents/lanes.md`, `docs/status.md`, `docs/agents/lanes/khulafa.md`, `docs/delegation/khulafa-progress.md`, `CANARY.md` | Register, lane, status, canary | `non-impacting` |
| `workers/*`, `.github/workflows/deploy.yml`, `docs/outreach/*` | Untouched — unless a new R2 folder proves necessary, then separate `submission-impacting` approval | — |

## 7 · Acceptance tests

- The validator accepts `during_reign` edges and rejects a `ruler` story_role toward a `caliphate` polity without `caliph` in `roles` (and vice versa).
- Every roster row maps to exactly one `person` record with a sourced `story_roles` reign; the chain order computed from reign starts matches the roster order.
- `/[lang]/khulafa/` renders every caliphate section in ar/en/ur with JS off; every card links to its caliph page.
- Every caliph page shows its reign box, predecessor/successor strip and — where edges exist — the reign-events section and map; claims appear only under their labelled claims sections.
- `/api/v1/khulafa.json` and `/api/v1/khulafa/chains.json` export the set; the browser is findable by name in Pagefind in all three languages.
- No typed Qur'an, no typed honorifics, Arabic parentheses isolated, `npm run validate` + `npm test` + `npm run build` pass, CANARY entry appended.

## 8 · Order of work after approval

1. Approve this proposal (and, separately, any `submission-impacting` item if one appears).
2. Phase 1: predicate + validator + tests.
3. Phase 2: roster CSV, then data batches ≤ 25 — reign edges, missing records, claims, succession.
4. Phase 3: browser pages, i18n, API exports, register/lane/status rows, landing card «قيد الإعداد».
5. Phase 4: `during_reign` edges and extent geojson in waves.
6. Phase 5: curated trilingual prose, batches ≤ 25, spot-checks logged in the lane file.

## 9 · Decisions for the founder

- Approve the `during_reign`/`reign_saw` predicate, or prefer derived date-overlap edges marked `derived: true`.
- Confirm the eight caliphates + claims structure, and that Ottoman sultans sit in the browser under the labelled claim (their polity stays `empire`).
- Confirm new claim polities (`zubayrid`, `hammudid`, `sharifian`) and the ceremonial label for the Cairo Abbasid line.
- Confirm the succession chain is computed from reign dates with `successor_of` edges as citations (no `order` field).
- Go-live timing for the landing card and the Explore entry.
