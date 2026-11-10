# 29. Companions Browser (متصفح الصحابة)

Status: **approved in chat by the founder, 10 November 2026** ("megaplan for islam-museum create the متصفح الصحابة"; Ahmed Abdelaal, @amado2k5). Phases 0 to 4 ship in one pull request, built in sequence by one agent session; Phase 5 (enrichment) is a separate content lane run batch by batch.

## 1. Proposal record (section 1 of `docs/ai-change-gates.md`)

| Field | Value |
|---|---|
| Feature | Companions Browser: a front door over the Companion records already in the graph, at `/[lang]/companions/`, grouping them by circle (the Ten, Muhajirun, Ansar, Ahl al-Bayt, the Mothers of the Believers), by clan and tribe, by the events they took part in, by the Hijri decade of their death, the women Companions (الصحابيات), and an A to Z list with a name filter |
| Approval | Founder, in chat, 10 November 2026; standing requirements: graph records, a feature export under `/api/v1/`, Pagefind, Arabic, English and Urdu in the same change, register entries in `docs/site/browsers.md`, the plan index, the roadmap, `docs/agents/lanes.md` and `docs/status.md`, the Explore menu and a landing card |
| Risk label | `submission-impacting` for Phase 3 only: it adds `/api/v1/companions.json` (the data-extraction route named in `docs/ai-change-gates.md` section 3), so the claims register (`docs/outreach/unesco-nomination-dossier.md` A.5) and the evidence map (`docs/outreach/dpga-evidence-map.md`) are updated in the same commit. Every other phase is `non-impacting`: no class, kind, field, predicate or record is added, removed or merged |
| Shell impact | Phase 4 edits `site/src/lib/nav.ts` (the Explore menu) and the `explore` block of the i18n files, so the pull request is labelled `rewrites-all-pages` (`tools/deploy/shell-paths.list`) |
| Files, Phase 0 | this document; `docs/plan/00-README.md`; `docs/plan/06-roadmap.md`; `docs/site/browsers.md`; `docs/agents/lanes.md`; `docs/status.md`; `CANARY.md` |
| Files, Phase 1 | `scripts/companions.ts` (who is a Companion and the facets, shared by the site and the API); `scripts/companions.test.ts` |
| Files, Phase 2 | `site/src/lib/companions.ts`; `site/src/pages/[lang]/companions/**`; `site/src/scripts/companions-filter.ts`; the `companions:` block of `i18n/ar.yaml`, `i18n/en.yaml`, `i18n/ur.yaml` |
| Files, Phase 3 | `scripts/export-api.ts`; `scripts/features-api.test.ts`; `docs/data/README.md`; `site/public/openapi/v1.json`; `site/src/pages/llms.txt.ts`; the two outreach files |
| Files, Phase 4 | `site/src/lib/nav.ts`; `site/src/components/Landing.astro` (the card's abstract thumbnail); the `explore.pages.companions` keys of the three i18n files; `scripts/check-site.ts`; `scripts/check-weight.ts` |
| Out of scope | editing any person record or its prose; any new class, kind, field, enum value or predicate; portraits or any figurative image of a Companion (`AGENTS.md`, licences); the person page layout (`EntityLayout.astro`) |

## 2. Intent

A visitor who opens the Companions Browser meets the generation that knew the Prophet as people with places in a web: who they were kin to, which circle they belonged to, which events they stood in, when and where they died. Every Companion links to the record page that already exists; the browser has no data of its own.

## 3. Model (no new schema)

- **Who is a Companion.** A non-stub `person` record with any one of: `companion` in `roles`; a `story_roles` entry with role `companion`; a `member_of` edge to `group/sahaba` (the membership roll opened 5 November 2026 on al-Isaba's definition). On 10 November 2026 this selects 605 records (474 on the roll, 600 with the role), 543 with Arabic prose.
- **The Ten.** The Companions featured in the trail `exhibit/path-ashara` (its `rooms[].features`), linked to the trail and to `concept/ashara-mubashshara`; nothing is typed into the browser.
- **Circles.** `member_of` edges to `group/muhajirun`, `group/ansar`, `group/ahl-al-bayt`, `group/mothers-of-the-believers`.
- **Clans and tribes.** Every other `member_of` target of class `group` except `group/sahaba` and the circles.
- **Events.** `participated_in` targets of class `event`, ordered by date.
- **The women Companions.** `gender: female`.
- **Death by Hijri decade.** `died.hijri` when stored; otherwise the Hijri year converted from `died.edtf` (`scripts/hijri/convert.ts`), marked derived (†) wherever it is printed.

Every number on the pages (circle sizes, clan counts, decade counts, the status line) is computed at build from these records.

## 4. Pages

| Route | Content |
|---|---|
| `/[lang]/companions/` | Header and status line (Pagefind body); the Ten; the circles; the women Companions; clans and tribes (two or more Companions); the events (two or more); death by Hijri decade; A to Z of every Companion with a name filter that matches the Arabic, English and Urdu name (the full list is in the HTML; JavaScript only narrows it) |
| `/[lang]/companions/group/<slug>/` | The Companions of one circle, clan or tribe, with a link to the group record |
| `/[lang]/companions/event/<slug>/` | The Companions recorded in one event, with the role when the edge carries one, and a link to the event record |
| `/[lang]/companions/decade/<n>/` | The Companions who died in one Hijri decade, in date order |
| `/[lang]/companions/women/` | The women Companions |

Readable without JavaScript, WCAG 2.2 AA, right-to-left in Arabic and Urdu, no letter-spacing or upper-casing of Arabic script, no honorifics typed (the UI renders them).

## 5. API and search

- `/api/v1/companions.json` (`scripts/export-api.ts` feature export `companions-browser`): every Companion's compact row with `gender`, `born`, `died`, `roles`, `names`, the derived `died_ah` year and decade, the circles, every edge from the record and the prose languages.
- Every Companion is already an entity page indexed by Pagefind; the browser's pages expose their title, lede and headings in `data-pagefind-body` and keep the long lists out (`data-pagefind-ignore`).

## 6. Phases

| Phase | Content | Merge rule |
|---|---|---|
| 0 | This proposal and the register entries | `npm run validate`, `npm test` |
| 1 | `scripts/companions.ts` and its tests | as Phase 0 |
| 2 | The pages in Arabic, English and Urdu | as Phase 0, plus `npm run build` |
| 3 | `/api/v1/companions.json`, documentation, OpenAPI, llms.txt, outreach files | labelled `submission-impacting` |
| 4 | Explore menu, landing card, `check-site` and `check-weight` assertions | labelled `rewrites-all-pages` |
| 5 | Enrichment lane `companions`: per-Companion facts (clan, circle, events, dates, places of death and burial) and prose from al-Isaba, Usd al-Ghaba, al-Isti'ab and Ibn Sa'd's Tabaqat, read on the founder's Mac (browser, microSD download, Apple Vision OCR, harvest) and cited page by page | content batches of at most 25 entities, `npm run coverage` in the same commit |

## 7. Register and documentation

The feature row is in `docs/site/browsers.md` (sections 2 and 3), the lane in `docs/agents/lanes.md`, the plan index row in `docs/plan/00-README.md`, the roadmap line in `docs/plan/06-roadmap.md`, the status row in `docs/status.md`, and the canary entry in `CANARY.md`.

## 8. Data findings at build (10 November 2026)

Shown as they are (golden-set rule); they're the first items for Phase 5:

- `exhibit/path-ashara` names nine of the Ten as `features`, so the browser shows nine. The tenth needs adding to the trail or a `concept/ashara-mubashshara` member list.
- `group/muhajirun` has 10 members recorded against 134 for `group/ansar`, so most emigrants still need their `member_of` edge.
- Ten records carry `roles: [companion]` but have death dates from 112 to 673 AH, all converted from the Gregorian `died.edtf` of the date-enrichment pass: `abbasa-bint-al-fadl`, `abu-khaythama`, `abu-zayd-ibn-amr-al-dubaybi`, `amina-bint-khalf`, `amr-ibn-abdullah-al-dibabi`, `harami-ibn-abdullah`, `hassan-ibn-milla`, `umm-musa-al-qahramana`, `yazid-ibn-al-muhajjal`, `yusuf-ibn-mirdaw`. Either the role or the date is wrong. Each one gets checked against al-Isaba before anything changes.
