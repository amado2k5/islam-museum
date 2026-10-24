# 01 · Business requirements

_Engineering view. The product statements live in
[`docs/plan/01-vision.md`](../plan/01-vision.md) (vision, personas, charter)
and [`docs/plan/06-roadmap.md`](../plan/06-roadmap.md) (phases, metrics)._

## 1. Purpose

islam.museum is an **open, free, all-digital museum of Islam**: the faith,
civilization, peoples, places, ideas, objects, texts and living culture, from
the world Islam was born into until today. It is built as a **knowledge graph
in git** and published as a **static website** — no accounts, no servers, no
advertising, no paywall.

The business requirement behind every engineering choice: the museum must be
**free to run forever** and **durable for decades** — plain files in a public
repository that outlive any hosting provider.

## 2. Stakeholders

| Stakeholder | Interest |
|---|---|
| Visitors (general public, students, teachers, researchers, Muslims and non-Muslims) | Accurate, neutral, well-sourced content in Arabic, English and Urdu; works on any device |
| The founder (@amado2k5) | Sole deploy authority; owns governance and the change gates |
| Contributing agents (Claude, Devin, Codex, others) and human contributors | Clear lanes, schemas, gates and PR workflow |
| Reviewers of formal submissions | The DPGA application (GID0094424) and the UNESCO dossier quote repository state; doc claims must stay true (`docs/ai-change-gates.md` §3) |
| Source institutions (Wikidata, Wikipedia, museums with open collections, Tanzil) | Correct attribution and licence compliance |

## 3. Functional requirements

| ID | Requirement | Where implemented |
|---|---|---|
| FR-1 | Store every entity as language-neutral YAML facts (`data/<class>/<slug>.yaml`) plus per-language prose (`content/<lang>/...`) | `data/`, `content/` |
| FR-2 | Model relationships as a directed graph with a fixed predicate registry; inverses computed, each edge written once | `schema/predicates.yaml`, `scripts/build-graph.ts` |
| FR-3 | Represent dates as EDTF + Hijri string + calendar flag + precision; conversions marked derived; never invent a date | `schema/_base.schema.json`, `scripts/hijri/` |
| FR-4 | Every entity cites sources; every dated fact has two sources or a flag | validator rules, `data/source/` |
| FR-5 | Render one page per entity per language, plus hall pages (time, place, people, ideas, objects, words, living, today), exhibits, questions, screening room, themes, wander, today | `site/src/pages/` |
| FR-6 | Full-text search with no server, per published language | Pagefind indexes on R2 |
| FR-7 | Dual Hijri/Gregorian timeline, interactive map at a date, network graph explorer | Svelte/Preact islands, MapLibre + PMTiles, Sigma.js |
| FR-8 | Public read-only JSON API (`/api/v1/`): per-entity JSON, indexes, graph dump, coverage metadata | `scripts/export-api.ts`, R2 |
| FR-9 | Qur'an text rendered only from the frozen Tanzil files, referenced as `passage/quran-<sura>-<aya>`; validator re-verifies every ayah byte-for-byte | `data/work/quran-source/`, `data/passage/` |
| FR-10 | Contested topics render a `perspectives` block (Sunni position first, then academic, then other views, each labelled and cited) | content model §8, layouts |
| FR-11 | Maps for events rendered deterministically from sourced features (Natural Earth + relief), in Arabic and English | `scripts/media/maps/`, `geo/` |
| FR-12 | "On this day", random wander, related entities, breadcrumbs — all precomputed at build | `scripts/derive.ts` |
| FR-13 | Community intake via GitHub (issue forms, discussions, PRs) | `.github/ISSUE_TEMPLATE/` |
| FR-14 | Education programme: age-band hubs (sighar/sprouts, explorers, storytellers), learn front door, passport, study modes, share cards, printables — static, no accounts, no student data, localStorage only | `edu/`, `site/src/pages/[lang]/{learn,sighar}/`, `site/src/lib/edu.ts`, lane `education` |

## 4. Non-functional requirements

| ID | Requirement | Mechanism |
|---|---|---|
| NFR-1 | **Zero runtime compute**: the published site is static files; nothing calls a model or server code per visitor | ADR 0002; CF Pages + R2 only |
| NFR-2 | **$0/month marginal runtime cost** (see [09](09-cost-analysis.md)); only paid item is the CF Pages plan for its file limit | free tiers; AGENTS.md |
| NFR-3 | **Arabic first**; Arabic + English + Urdu ship together for every new string/prose file; RTL is a first-class layout | `docs/language.md`, logical CSS properties |
| NFR-4 | **WCAG 2.2 AA**; every page readable with JavaScript disabled; alt text required in every published language | validator, Lighthouse CI, `check-static.ts` |
| NFR-5 | **Neutrality**: Sunni Islam is the default frame, labelled; other views labelled before stated; describe, never prescribe | `docs/scope.md`, editorial policy, validator honorific checks |
| NFR-6 | **Licence hygiene**: prose CC BY-SA 4.0, data CC0, code MIT; media only from `schema/enums/licenses.yaml` whitelist; source files never committed | `docs/sources-policy.md`, validator |
| NFR-7 | **Durability**: content lives as plain YAML/Markdown in a public git repo; hosting is replaceable | ADR 0001 |
| NFR-8 | **Privacy**: cookieless analytics only; no forms posting to third parties; no JS injected by the platform (NEL/email-obfuscation disabled) | plan 03 §6, `check-static.ts` |
| NFR-9 | **Performance budgets**: Lighthouse CI on every build; lazy search index; responsive images | `lighthouserc.json`, [07](07-performance.md) |
| NFR-10 | **Reproducible builds**: `npm run validate`, `npm test`, `npm run build` must pass locally before any push | `docs/agents/workflow.md` §4 |
| NFR-11 | **Auditability**: every AI-produced artefact enters as `status.review: draft` with a `provenance` block; commits carry `AI-Agent`/`AI-Model`/`AI-Editor` trailers | change gates §6–7 |

## 5. Scope

- **In scope** (phase-by-phase, `docs/plan/06-roadmap.md`): the Phase-1 spine
  (Prophetic era), the eight halls, Words and Objects wings, more languages,
  the data product (`api/v1`), tours/learn features.
- **Explicit non-goals** (`docs/plan/01-vision.md` §7): accounts,
  comments/UGC on pages, live chat, e-commerce beyond a gift-shop concept,
  any runtime personalization, mobile apps (the static API serves third
  parties instead).
- **Editorial scope** (`docs/scope.md`): Sunni Islam is the default and main
  frame; research starts from Sunni sources; other views are welcome,
  labelled before stated.

## 6. Success metrics

From the roadmap (§"Metrics dashboard"): public coverage JSON
(`api/v1/meta/coverage.json`, regenerated by `npm run coverage` →
`docs/coverage.md`) tracks entities per class, sourced percentage, languages,
and review status. Editorial quality metrics are in
`docs/plan/05-editorial.md` §9. Snapshot at the time of writing: ~36k data
files across 21 classes (8.7k+ people, 9.5k Qur'an passages, 4.4k events,
1.7k places, 1.5k works …) plus the `edu/` programme data (bands, stamps) —
all `draft` until human review.
