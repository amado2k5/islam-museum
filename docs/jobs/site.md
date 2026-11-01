# Job Browser: site design

Part of the Job Browser plan. Master plan: [`README.md`](README.md). Rules that bind every line here: `docs/site/README.md` (the checklist, the byte-stability rule, no site-wide number in a shared layout), `docs/site/design-and-accessibility.md`, WCAG 2.2 AA, readable without JavaScript, Arabic first with English and Urdu in the same commit, identical flattened key sets in `i18n/ar.yaml`, `en.yaml` and `ur.yaml` (`scripts/pipeline.test.ts` lines 220–235 enforce it). Client-side page components and data only: no build, deploy, workflow, R2 or Pages configuration changes. The hosting split stays as it is: `/[lang]/jobs/` and `/[lang]/job/` are HTML under `/[lang]/`, which the site Worker already serves from R2 like every other language route, so nothing is added to `R2_DATA_DIRS`.

## 1. `/[lang]/jobs/`: the browser home

New page `site/src/pages/[lang]/jobs/index.astro`, built like `site/src/pages/[lang]/learn/trails/index.astro`.

- **Header**: `PageHeader` with the title, a lede, and the "in the making" badge pill (`learn/trails/index.astro` line 56: the gold-dot pill) plus the status panel (line 60: `panel ui` with the gold border). New keys `jobs.badge` and `jobs.status` say, honestly, that the browser grows as records are researched and that counts are as of the last build.
- **Browse by domain**: fourteen cards in the order of `job-domains.yaml`, each with its job count and holder total from the built graph.
- **A to Z**: one list per language, sorted by the language's label (Arabic by Arabic label, English by English, Urdu by Urdu), each row the job label, its domain chip and its holder count. The count is per-page content of this one page, allowed by the byte-stability rule (a shared layout is what is forbidden).
- **Filter box**: a text input that narrows the list with a few lines of inline script, the trails index's `filter_*` pattern; without JavaScript the full list is there to scroll.
- **Newest strip**: the ten jobs with the most recent git date of their data or prose (`updatedOn` from `scripts/git-dates.ts`), so the strip changes only when a job changes.
- Weight budget: a route entry in `scripts/check-weight.ts` `BUDGETS`, set in Phase 1 from the measured page.

## 2. `/[lang]/job/<slug>/`: the job page

`site/src/pages/[lang]/[class]/[slug].astro` builds every node with no allowlist, so a published `job` entity gets a page at `/[lang]/job/<slug>/` with no routing change (`SEGMENT` in `site/src/lib/graph.ts` stays as it is; the brief's URL uses the singular). `EntityLayout.astro` gains job-specific sections, in this order after the hero and the prose:

1. **Image**: the `media.image` entity, caption and three-language alt text from the media record; no image, no empty frame.
2. **Holders rail**: every person with a `practised` edge to this job, grouped by period in the Explorer's period order, each row the name, place, years and a `kind` chip (career, also held, once, honorary), with a marker for "held it more than once" (two or more stints in the block). Filter controls for period, region, kind and the more-than-once flag work with inline script on `data-*` attributes; without JavaScript the grouped list is complete. A job with more than 300 holders splits the rail by period into details disclosures, so the HTML stays under its budget.
3. **Timeline band**: a static SVG in the `TimeStrip.astro` manner (`site/src/components/TimeStrip.astro`), one tick per dated holder on the era bands, with the count per century beneath; undated holders are counted in a line, not drawn.
4. **The things of this job**: objects with a `tied_to` edge, by relation (made by, used by).
5. **Its workplaces**: buildings and places tied to it, plus the kind-level "jobs of this kind of building" note where it applies (schema.md section 3), labelled as kind-level.
6. **Its bodies**: groups from `organization.bodies` and `body-of` ties.
7. **Its gatherings**: events tied as `gathering-of`.
8. **Related jobs**: `broader`, narrower jobs (computed), `successor_jobs` and computed predecessors first and prominent, then the same domain.
9. **References**: the job's `sources`, rendered as every entity page renders them.

Pages without JavaScript lose only the filters. The rail and band are per-page content and stable under insertion: adding a holder changes that job's page and the index, nothing else.

## 3. Person pages: the career strip

New component `site/src/components/CareerStrip.astro`, rendered in `EntityLayout.astro` above the Connections section (line 266) for persons with `occupations:`.

- One horizontal bar per entry on a shared year axis: the job label linked to the job page, the place, the years as the site formats dates (`site/src/lib/dates.ts`, Hijri and Gregorian, approximate and debated chips; no raw EDTF), the `kind` as a chip. Overlapping entries sit on separate rows so simultaneity is visible; undated entries are listed beneath the axis in words.
- Fallback: a record with no `occupations:` keeps today's roles line in "At a glance" (line 178). A record with both shows the strip and descriptor chips only (the agreement check guarantees no job value remains in `roles:`).
- Static SVG, no script; colours from the design tokens in `global.css`, never new tokens; checked at 390px and in dark mode before the Phase 1 pull request.

## 4. Discovery

- `site/src/lib/nav.ts`: `jobs` added to the `ExplorePage` union and `explorePages()` with `ready: true`.
- `site/src/components/Landing.astro` (lines 81–104): the Explore row card for `jobs`, with the per-key thumbnail and accent in the same pattern as the other cards.
- `site/src/layouts/BaseLayout.astro` (lines 109–142): the Explore menu takes the entry from the same list.
- i18n: `class.job`, `explore.pages.jobs.{title,desc,menu}`, the `jobs.*` block for the browser home and the job page sections, and the `career.*` block for the strip, in all three files in one commit.
- Footer browse list: `job` in `BROWSE_CLASSES` (`site/src/lib/browse.ts`), so `/[lang]/browse/job/` exists.
- `site/src/lib/entity.ts` `SCHEMA_TYPE`: `job: "Occupation"` (schema.org), so the JSON-LD names the type.
- Phase 5, not Phase 1: a `job` filter on the Timeline Explorer's person subjects (a new field on `SubjectDef` in `scripts/time-browser-explorer.ts` filled from `occupations:`, and a shelf on `time-browser/index.astro`), and the shared-job view on the connections graph (a caliph's viziers through `under`; qadis who trained qadis through `trained_under`), which needs an `?job=` mode in `site/src/scripts/graph.ts`.

## 5. API and AI surface

- `/api/v1/job/index.json` and `/api/v1/job/<slug>.json` come from the `CLASSES` loop in `scripts/export-api.ts` with no change.
- `/api/v1/jobs.json`: one dump of every job with its domain, labels, holder ids with their `kind`, and the ids of its things, workplaces and bodies; written beside `themes/index.json` in the one-off section of `export-api.ts`.
- `/api/v1/meta/index.json` lists the new class.
- `site/src/pages/llms.txt.ts`: jobs appear through `realNodes` automatically; one added line explains that "which Muslims were X" is answered by `/api/v1/jobs.json` and the job pages.
- Per-person API records carry the `occupations:` block as data, as they carry `faith` today.

## 6. Progressive visibility

- A job page is built when its entity meets the publication standard (cited, defined sources, provenance recorded). Decision 5 of the master plan asks whether it must also have a holder; the plan recommends not, and the holders rail then says in words that no holder is tagged yet.
- Counts and holders are read from the built graph at every build, so they update with no further step.
- The browser home carries the "in the making" badge from the first build and keeps it; the status text names the number of jobs with articles and the number with holders, both read from the graph.
- **Merged is not live.** Deployment is the founder's manual step. Every phase report says "merged" or "live" and never the second without a live check of the URL on `islam.museum` (or on `uat.islam.museum` when the founder deploys there first).

## 7. Files touched by Phase 1 (site side)

| File | Change |
|---|---|
| `site/src/pages/[lang]/jobs/index.astro` | new |
| `site/src/components/CareerStrip.astro` | new |
| `site/src/components/JobHolders.astro`, `JobBand.astro` | new (the rail and the band, kept out of `EntityLayout.astro` so other classes' pages do not change weight) |
| `site/src/layouts/EntityLayout.astro` | job sections and the career strip hook |
| `site/src/lib/nav.ts`, `site/src/components/Landing.astro`, `site/src/layouts/BaseLayout.astro` | the `jobs` entry |
| `site/src/lib/browse.ts`, `site/src/lib/entity.ts` | class lists |
| `i18n/ar.yaml`, `i18n/en.yaml`, `i18n/ur.yaml` | new keys, parity in one commit |
| `scripts/check-weight.ts` | budgets for `/ar/jobs/` and `/ar/job/<slug>/` |
| `scripts/check-site.ts` | an assertion that the browser home renders its badge and at least one job |
| `docs/site/README.md`, `docs/site/changes-2026-10.md` or its November successor | the new routes and the kind-level note recorded |

Nothing in `workers/`, `.github/workflows/`, `site/public/_redirects` or `_headers` changes.
