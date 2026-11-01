# Job Browser: phases

Part of the Job Browser plan. Master plan: [`README.md`](README.md). Each phase stops and reports at its gate; none starts before the founder's go for it. Every report uses live-check language discipline: **merged is not live**; a page is called live only after its URL was checked on the deployed site.

## Standing machinery (inherited from the modern-figures and coverage lanes)

- Waves of 10 (5+5 across two writers), at most 25 content entities per batch, one coordinator merge per wave.
- A writer brief carries the schema-shape checklist (`schema.md` sections 1–3), the research order (`research.md` section 1) and the classification discipline (`research.md` section 3).
- Before every merge, as separate asserted steps: `npm run validate` output contains the literal **"0 errors"**; `npm run cite-check -- <ids>` output contains the literal **"0 fail"**; `npm test` passes; `npm run build` passes for any site, schema, i18n or date change. Never a grep over error text.
- `npm run coverage` regenerated in the same commit as any entity, stub or edge change.
- Queue files with `[ ]` / `[x]` / `[~]`; STOPs logged, not guessed; founder flags one line each; no-skip rule inside a phase's scope; excluded items reported with reason, gate and override.
- Merge gate every time: fetch `origin/main`, read what arrived, rebase or merge keeping both sides, never force-push, never overwrite another agent's work; pull request to `main`, merged by the lane itself once the local checks are clean.
- Attribution trailers on every commit; the same facts in every record's `provenance`.
- Branches `jobs/<phase>-<agent>`; stubs in `data/_stubs.d/jobs.yaml`; progress in `docs/jobs/progress.md`.

## Phase 1: the first ten, end to end

**Scope.** `job/qadi`, `job/vizier`, `job/muhaddith`, `job/physician`, `job/astronomer`, `job/calligrapher`, `job/merchant`, `job/architect`, `job/copyist`, `job/teacher` (or the swap of decision 2), each to the full depth of `schema.md` section 1 and the seventeen prose sections in Arabic, English and Urdu; their source entities (`research.md` section 2); their holders from the bootstrap (1,149 persons carry a mapped role for these ten) plus targeted enrichment from the leads (about 3,400 lead records, read for dates, places, `under` and `trained_under` where the source gives them, with the copyist and architect leads first since those pages have 0 and 11 holders); the schema, validator and derived edges (`schema.md` sections 4–7); the browser home, the job page sections, the career strip, the discovery entry and the API (`site.md`); the census report script.

**Order of work.** (1) The `submission-impacting` commit: class, enums, schema, validator, predicates, API, outreach files, tests; validate, test, build; pull request; merge. (2) Source entities for the ten. (3) Job records and Arabic articles, two per batch, with English and Urdu in the same commit. (4) The bootstrap for the ten jobs only (a script over the 1,149 records, committed in chunks of about 500 files per pull request, decision 4), then the leads. (5) The site change, checked at 390px and desktop, light and dark, with `npm run build`, `check:static` and `check:weight`. (6) The lane row and the status row updated; the phase report.

**Size.** Ten articles of 17 sections in three languages (about 2,000–3,500 Arabic words each by the brief's depth, mirrored in English, shorter in Urdu as the museum's practice allows); about 15 new source entities; 1,149 bootstrap entries; about 3,400 leads to read, of which the copyist's 74 and the architect's 23 first; one site change. Batches of 2 jobs; the bootstrap in 3 chunks; the leads in batches of 25 records.

**Gate and report.** Validate "0 errors", cite-check "0 fail", tests, build, all stated with their output lines; the pull request numbers; what the founder must deploy (the commits, and that no Worker or workflow file is among them); "merged, not live" until the founder deploys and the URLs `/ar/jobs/`, `/en/jobs/`, `/ur/jobs/` and one job page per language are checked live.

## Phase 2: all job entities, domain by domain

**Scope.** The 147 remaining jobs of `taxonomy.yaml`, each to the same depth, in domain waves: Governance & Law, Court & Administration, Scholarship & Teaching, Faith & Preaching, Medicine & Care, Sciences & Numbers, Arts & Letters, Building & Making, Trade, Travel & the Sea, War & Command, Media & Performance, Sport, Patronage & Public Life, Land & Water. A wave is one domain or about 10 jobs; the biggest domains (Governance & Law 23, Building & Making 17) are two waves. Jobs with few or no museum holders still get the full article (the browser is an encyclopaedia). Guild, union and order bodies that the sources describe and the museum lacks are written as `group/` records in the same wave (the guild layer has one record today). Each wave bootstraps its jobs' holders from the roles.

**Size.** 15 waves at the Phase 1 pace per job. Each wave is validate- and cite-check-gated and reports as Phase 1 does.

**Additions to the taxonomy** that the sources surface are appended to `taxonomy.yaml` with a `progress.md` line; nothing is removed; a duplicate becomes an alias.

## Phase 3: the person sweep, in waves

**Scope.** `occupations:` on all 10,725 person records.

- **3a, the bootstrap.** The merge map applied by script to the 7,555 records with a mapped role (decision 4), in chunks of about 500 files per pull request, re-run on fresh `main` before each push, each chunk validate-gated. The 587 descriptor-only and 215 review-only records get no bootstrap entry; the 2,368 role-less records get none. After 3a, the agreement check turns from a warning count into enforcement per record as each is swept.
- **3b, the prose sweep.** Every record read against its sources and prose: dates, places, `polity`, `under`, `trained_under`, `certification`, `family_business`, stints, and the specific craft behind a generic `alim` or `ruler`; the review-only, descriptor-only and role-less records written from scratch. Waves by era and class, office jobs first (caliph, sultan, emir, vizier, qadi, shaykh al-islam, mufti, court posts) where the sources are strongest, then the scholars, then the rest. The 1,410 role-less records with prose leads go before the role-less without.
- **Teacher–student signal.** `student_of` and `teacher_of` edges and `member_of` with roles are read first for `trained_under` and `certification`; the sweep adds the edge where the source gives a teacher and the graph lacks it.

**Size.** 3a: 16 chunks. 3b: 10,725 / 25 = 429 batches, at the modern-figures wave pace; the pilot (the first two waves) sets the measured batch time, and the plan is re-sized from it, never from a guess. Sweep batches add one block and touch nothing else in the file, so they merge beside the live lanes that also edit `data/person/` (decision 10).

## Phase 4: things, buildings, works, groups, events, places, journeys

**Scope.** `jobs:` entries where a record's sources attest the connection: objects (made by, used by), buildings (built by, staffed by, with named people), works (reference for, produced by), groups (body of), events (gathering of), places and journeys (workplace of, route of). Kind-level links (every mosque's imam) are the display-only map of `schema.md` section 3, never written into records. Pilot: the things of the Phase 1 ten (the 4 astrolabes, the 52 manuscripts and 88 folios for copyist and calligrapher, the 7 bimaristans, the 339 madrasas' named mudarrisun where attested, the 15 bazaars and 8 khans for merchant), which sizes the rest.

## Phase 5: discovery layer

**Scope.** (1) The modern crosswalk: one page per language under `/[lang]/jobs/today/` mapping modern jobs to historical shelves ("doctor: the court and bimaristan physicians"; "judge: qadi and mufti"; "life coach: the murshid and teacher shelf"), labelled as analogy in its first line and written into no record. (2) Job trails through the existing trails system (`exhibit` records of kind `trail`): The Viziers; Women Teachers of Hadith; Court Astronomers; The Copyists Who Saved the Books; The Muhtasib's Market; The Ship Captains. (3) The Timeline Explorer `job` filter on person subjects. (4) The shared-job view on the connections graph. Each is its own non-impacting proposal under the gates, because each is a site change.

## What every phase report contains

1. Pull request numbers and commit ranges merged.
2. The validate line ("0 errors"), the cite-check line ("0 fail"), the test summary, and the build result where the phase touched the site.
3. Counts: jobs with articles, jobs with holders, persons swept, things tagged, read from the built graph.
4. Excluded items, each with record id, reason, gate and the override the founder may give.
5. Founder flags, one line each.
6. "Merged, not live" or "live, checked at <URL> on <date>", never the second without the check.
7. The exact next step.
