# 31 · The Battles, Wars and Conquests Browser: proposal

Status: **proposal; implementation began on the founder's instruction in the same session (9 November 2026).** Nothing in schema, `data/` or `workers/` changes: the browser is a set of index pages over the existing `event` records, and needs no approval-gated edits beyond new pages, i18n keys and one API export (`docs/ai-change-gates.md` §1). This document adds one file plus its row in `docs/plan/00-README.md`.

Requested by the founder in chat, 9 November 2026: «megaplan — متصفح الغزوات والحروب والفتوحات», with the scope answered as **all military events**, the ghazwa/sariyya split **derived from the graph**, and delivery as proposal plus implementation in one session.

## 0 · What the browser is for, and what it is not

The browser is the front door onto the museum's record of armed engagement: the Prophet's ghazawat and the saraya he sent, the Rashidun and Umayyad conquests, the wars of the caliphates, the sieges, revolts, raids and naval battles, from Badr to the present. A visitor lands on the prophetic expeditions first — the spine the Arabic name carries (الغزوات والسرايا) — then browses by kind (battle, siege, conquest, war, campaign, raid, revolt, civil war, skirmish, naval battle, mutiny) or by era (prophetic, Rashidun, Umayyad, the Crusades and the Mamluks, the gunpowder empires, the colonial age, modernity). Every record shown is an ordinary `event` entity — cited, dated in both calendars, reachable from every other page, exported in the API and indexed by search.

The browser describes, it does not glorify and it does not judge. The museum's frame is Sunni (`docs/scope.md`): an outcome is stated as the sources give it, a contested reading (a crusade, a colonial war, a civil-war battle) carries its labelled `perspectives`, and no verdict is delivered. The hard block stands untouched: no page, record or name of a blocked organisation appears anywhere (`docs/agents/content-safety.md`); where a modern event's record would require one, the record is out of scope for the lane until it can be told without the group.

## 1 · What the repository already has (checked 9 November 2026)

- **Events** (`data/event/`, 4,984 records). Military engagement is already modelled: `battle` 1,483, `siege` 710, `conquest` 375, `war` 228, `revolt` 157, `campaign` 135, `raid` 106, `civil-war` 29, `skirmish` 12, `mutiny` 9, `naval-battle` 7 — **3,251 records** in eleven kinds, the largest coherent set in the graph after persons.
- **Rich per-battle fields on `event`** (`schema/event.schema.json`): `sides[]` (label, `participants`, `commanders`, `strength` with value/range + `status` + `sources`), `outcome`, `casualties` (same sourced-number shape), `significance`, `date` (EDTF + Hijri + precision + status), `periods`, `regions`, `themes`, `relations` (`had_participant` with role, `occurred_at`, `part_of` for a battle inside a war or a raid inside a campaign), and `map` (kind `battle|siege|naval|campaign|route|area`, precision, features with `map-feature-role`). 270 military events already carry `sides`, 49 carry `map`, 3 carry `outcome` today — the fields exist and enrichment is a data lane, not a schema change.
- **The prophetic set** (`periods: [period/prophetic-era]`, 75 military events): `data/event/expedition-of-al-sawiq.yaml` is the golden shape — kind `campaign`, `themes: [battles]`, full `sides` with sourced strengths, `had_participant` edges with Arabic roles. Under the derivation in §2.3 it splits today into **53 ghazawat** (the Prophet among participants or commanders) and **22 saraya**; the split refines itself as edges land, which is why it is derived and never stored.
- **Eras** (`data/period/`): the military records spread over thirteen periods — prophetic-era 75, rashidun 127, umayyad 155, abbasid-early 181, abbasid-fragmentation 54, buyid-seljuk-fatimid 155, crusades-ayyubid-mamluk 623, mongol-post-mongol 158, gunpowder-empires 672, colonial-era 436, modern-era 288, contemporary-era 85, pre-islamic-arabia 41. Period records carry trilingual labels; the era pages reuse them.
- **Themes** (`schema/enums/themes.yaml`): `battles`, `wars-and-campaigns`, `civil-wars-and-revolts`, `colonial-wars-and-resistance`, `laws-of-war-and-peace` exist as tags; the browser's kind grouping is the honest one — a theme may tag a massacre or a truce, while the browser lists engagements.
- **Sources already filed** for the domain: `source/al-waqidi-maghazi`, `source/ibn-hisham-sira`, `source/mubarakpuri-raheeq`, `source/zad-al-maad`, `source/sira-nabawiyya-sallabi`, `source/kamil-ibn-al-athir`, `source/tabari-tarikh-*`, `source/futuh-buldan-maarif-1407`, `source/futuh-al-sham-ilmiyya-1997-v1`/`v2`, `source/futuh-misr-amir-1999` and the encyclopaedias — the enrichment lane is a mining lane over the canon (`docs/agents/mining-sources.md`), not new sourcing.
- **Browser precedent:** `site/src/pages/[lang]/asma/{index,[slug]}.astro`, `site/src/lib/asma.ts`, `site/src/scripts/asma-filter.ts`, the `asma:` i18n blocks, the `asma.json` row in `scripts/export-api.ts`, the `asma` key in `site/src/lib/nav.ts` (plan 29, approved and phased 1–4 same-day 9 November 2026). Records keep their canonical pages at `/[lang]/event/<slug>/` through `EntityLayout.astro`, which already renders sides, outcome, dates, relations and maps — so this browser ships **index pages only**, the Job Browser shape (`jobs/` has an index; records live at `/job/<slug>/`).
- **Date machinery** (`site/src/lib/dates.ts`): `formatDate` (EDTF+Hijri dual rendering, derived conversions flagged †), `startOf`, `timelineKey` — the sort key already prefers the Hijri string and handles year-precision ordering.
- No `data/_stubs.d/battles.yaml` yet; no `battles:` i18n block yet; no plan-31 row yet.

## 2 · The data model (proposed)

### 2.1 Classes and kinds

- **Every engagement stays an `event` record** of one of the eleven military kinds. No new class, no new kind, no enum change — the class list and `schema/enums/kinds.yaml` do not move.
- **Wars, campaigns and their engagements** relate by the existing `part_of` predicate: a battle `part_of` a war, a raid `part_of` a campaign, a siege `part_of` a revolt. Edges are written once on the engagement side with sources; the war's "battles" list is the computed inverse.
- **A new `event` record is created only where a real engagement is missing** — the lane's mining side — never a stub for a name. Each new record follows the gold shape (`expedition-of-al-sawiq`): trilingual label + summary at creation, sourced `sides`, `date` with Hijri, `periods`, `occurred_at`, `part_of` where it belongs to a larger engagement.

### 2.2 Fields

Nothing added to the schema. The pages read: `label`, `summary`, `kind`, `date`, `periods`, `regions`, `themes`, `relations`, `sides`, `outcome`, `casualties`, `significance`, `map`, `prose`, `sources`.

### 2.3 The ghazwa/sariyya derivation (build-time, never stored)

A military event is listed under **الغزوات** when `periods` includes `period/prophetic-era` **and** `person/muhammad` appears among its `had_participant` edges or its `sides[].commanders`/`participants`; prophetic-era military events without him are **السرايا** — expeditions he sent and did not join. The rule is computed in `site/src/lib/battles.ts` from the graph, exported as a `ghazwa` boolean on `/api/v1/battles.json`, and stated on the ghazawat page in one sentence («غزوةٌ شهدها النبي أو قادها؛ وسريةٌ بعثها ولم يشهدها»). Where the sira counts a record differently (a ghazwa whose Prophet edge is not yet mined), the missing edge is a data task in the lane, not a second flag.

### 2.4 Edges used (existing predicates only)

| Edge | Predicate | What the browser does with it |
|---|---|---|
| engagement → war/campaign | `part_of` | war pages list their battles (inverse); cards show the parent |
| engagement → place | `occurred_at` | the "where" on every card; era pages can map later |
| engagement → person/group | `had_participant` + `role` | commanders and participants; the ghazwa test |
| engagement → `period/<era>` | `periods` field | era pages |
| engagement → sibling | `preceded`/`followed` if already registered, else none | ordering stays `timelineKey` |

## 3 · Browser design (proposed)

### 3.1 Routes and components

- `/[lang]/battles/` — landing: Pagefind header block (`data-pagefind-body`: title «متصفح الغزوات والحروب والفتوحات», lede, status line with build-time counts), then the prophetic section — two headed lists, «الغزوات» (53 today) and «السرايا» (22 today), chronological by `timelineKey`, each card carrying dual date, place and commanders; then «حسب النوع» — the eleven kind tiles with counts; then «حسب العصر» — the era rows with counts. Long lists sit inside `data-pagefind-ignore`.
- `/[lang]/battles/ghazawat/` — the prophetic expeditions in full chronological order, ghazwa and sariyya labelled per card, with the derivation sentence at the top.
- `/[lang]/battles/kind/<kind>/` — one page per military kind, chronological cards; a card shows dual date (`formatDate`), place (`occurred_at` first target), commanders (first side's `commanders`, up to two), outcome if present.
- `/[lang]/battles/era/<period>/` — one page per period with ≥ 1 military event, same card shape, ordered by `timelineKey`; the period's own label from its `period` record, its `part_of` parent era noted where one exists.
- `site/src/lib/battles.ts` — build-time accessors: `MILITARY_KINDS`, `battleNodes`, `byKind`, `byPeriod`, `ghazawat`, `saraya`, `isGhazwa`, `commandersOf`, `placeOf`.
- `site/src/scripts/battles-filter.ts` — the asma-filter pattern: hides cards as the visitor types, no-JS-safe.
- i18n: a `battles:` block in `i18n/{ar,en,ur}.yaml` in the same commit (title, lede, badge, status, the eleven kind names trilingual, section titles, ghazwa/sariyya labels and the derivation note, filter and empty-state lines).
- Explore-menu entry `{ key: "battles", href: /{lang}/battles/, ready: false }` and the landing card marked «قيد الإعداد» until the founder flips it (the asma precedent).

### 3.2 Data flow and hosting

Everything is build-time SSG over the compiled graph; no runtime calls and no AI at runtime. The browser emits pages under `battles/` inside the existing site output and one file under the existing `api/v1` export — **zero new R2 folders**, so `workers/site/src/route.js`, `workers/r2-sync/batch/publish.mjs`, `wrangler.production.toml` and `deploy.yml` stay untouched and nothing here is `submission-impacting`.

### 3.3 Search and API

- `/api/v1/battles.json` — every military event: slug, kind, trilingual label/summary, `date`, `periods`, `regions`, `sides`, `outcome`, `casualties`, `map`, `part_of`, and the derived `ghazwa` flag — added to `scripts/export-api.ts` with a row in `docs/data/README.md`, a path in `site/public/openapi/v1.json` and a line in `site/src/pages/llms.txt.ts`. The generic event exports (`/api/v1/event/index.json`, `/api/v1/event/<slug>.json`, graph dumps) already carry the records.
- Landing carries `data-pagefind-body`; kind, era and ghazawat pages carry it too (they are listings of entity pages, each already indexed); the long card lists are ignored.

## 4 · Content plan

- **No records required for launch** — the browser opens on the 3,251 records that exist.
- **Enrichment waves inside the lane, ≤ 25 records per commit:** fill `sides`, `outcome`, `casualties` and `occurred_at` on the engagements that lack them (1,483 battles, 270 sided today); add `part_of` edges battles→wars; mine the missing saraya and conquest records from al-Waqidi, Ibn Hisham, al-Raheeq and Futuh al-Buldan; every new record trilingual in the same commit at draft tier with provenance.
- **Battle maps** are the `map` block's lane (plan 16; 49 exist today): the browser shows the map flag on cards and lets `EntityLayout` render it; new maps come through the illustrations lane, not this one.
- **Voice:** engagements are described, never glorified; casualty figures carry `status` and a source; colonial-era and civil-war records keep their neutral phrasing; no blocked organisation is ever named.

## 5 · The lane

- Lane name: `battles`.
- Scope: the browser pages and lib, the i18n block, the API export, and data enrichment of military `event` records (`sides`, `outcome`, `casualties`, `occurred_at`, `part_of`, new engagements mined from the canon).
- Files, on landing: `docs/agents/lanes/battles.md`, `docs/delegation/battles-progress.md`, `data/_stubs.d/battles.yaml` when the first stub is needed, a row in `docs/agents/lanes.md`, a row in `docs/status.md`. Owner line set by the founder.

## 6 · Files this proposal touches, and risk labels

| File | Intent | Label |
|---|---|---|
| `docs/plan/31-battles-browser.md` (new) | This proposal | `non-impacting` |
| `docs/plan/00-README.md` | One row for plan 31 | `non-impacting` |
| `site/src/lib/battles.ts` | Build-time accessors | `non-impacting` |
| `site/src/pages/[lang]/battles/{index,ghazawat}.astro`, `kind/[kind].astro`, `era/[period].astro` | Browser pages | `non-impacting`; new routes need approval — given in chat 9 Nov 2026 |
| `site/src/scripts/battles-filter.ts` | Client filter (progressive enhancement) | `non-impacting` |
| `i18n/{ar,en,ur}.yaml` | `battles:` keys, identical sets | `non-impacting`; new keys approved in chat |
| `site/src/lib/nav.ts` | `battles` Explore entry, `ready: false` | `non-impacting` |
| `scripts/export-api.ts`, `site/public/openapi/v1.json`, `docs/data/README.md`, `site/src/pages/llms.txt.ts` | `/api/v1/battles.json` | `non-impacting` |
| `docs/site/browsers.md`, `docs/agents/lanes.md`, `docs/status.md`, `docs/agents/lanes/battles.md`, `docs/delegation/battles-progress.md`, `CANARY.md`, `docs/coverage.md` | Register, lane, status, canary, coverage | `non-impacting` |
| `schema/*`, `data/event/*`, `workers/*`, `.github/workflows/deploy.yml` | Untouched | — |

## 7 · Acceptance tests

- `/[lang]/battles/` renders in ar/en/ur with JS off: the prophetic section, the eleven kind tiles and the era rows all link correctly; counts equal the build's actual numbers.
- `/[lang]/battles/ghazawat/` lists every prophetic-era military event once, each labelled ghazwa or sariyya by the §2.3 rule, in `timelineKey` order.
- Every kind page and era page lists the same records the graph holds for that group, chronologically.
- `/api/v1/battles.json` exports all military events with the `ghazwa` flag; the browser is findable by name in Pagefind in all three languages.
- No new R2 folder; `npm run validate` + `npm test` + `npm run build` pass; `npm run coverage` regenerated; CANARY entry appended.

## 8 · Order of work after this proposal

1. Phase 1: `site/src/lib/battles.ts` + the four routes + the filter script + the `battles:` i18n block (ar first, en and ur in the same commit) + `nav.ts` entry `ready: false`.
2. Phase 2: `/api/v1/battles.json` + the three documentation lines.
3. Phase 3: register, lane, status, progress file, CANARY, coverage regeneration.
4. Phase 4 (the lane, open-ended): `sides`/`outcome`/`casualties`/`part_of` enrichment waves and newly mined engagements, each wave ≤ 25 records, cited, trilingual, draft-tier.

## 9 · Decisions for the founder

- Confirm the route `/battles/` (recommended for trilingual clarity) versus `/maghazi/` (المغازي, the classical name — covers only the prophetic material).
- Confirm the eleven-kind military set in §1; `massacre`, `expulsion`, `persecution` and `attack` stay out of the kind list (they are atrocities and acts, not engagements) though their records may carry a `battles` theme and stay findable.
- Confirm `ready: false` on the Explore entry until a human review pass, and the landing card as «قيد الإعداد».
- The enrichment lane's first wave order: ghazawat and saraya first (the smallest, most-read set), then Rashidun conquests, then the rest by era.
