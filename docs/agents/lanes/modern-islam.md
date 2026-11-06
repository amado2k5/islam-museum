# Lane `modern-islam`: the Modern Islam Browser

_Opened 6 November 2026 on the founder's request; plan 26 (`docs/plan/26-modern-islam-browser.md`) approved by the founder the same day (D-000) and Phase 1 implemented. Binding with `AGENTS.md`, `docs/ai-change-gates.md`, `docs/agents/publication-standard.md`, `docs/agents/content-standards.md`, `docs/sources-policy.md`, the Wikipedia broad rule and the `modern-figures` lane's faith rulings of 1 November 2026._

## Mission

Build and keep growing the museum's entrance to the last fifty years of Islam and Muslims (1 Muharram 1396 / 3 January 1976 to today, plus the upcoming): nineteen sections as views over the one graph, a pilot in production first, then incremental waves of subjects and trilingual prose for as long as the sources last. The plan, the taxonomy, the seed programme and the prompts are in `docs/modern-islam/`.

## Scope and files

- Sections and their classes: `docs/modern-islam/taxonomy.yaml`. The lane owns the new class `award`, the new kinds and fields of plan 26 section 3, the browser pages under `site/src/pages/[lang]/modern/**`, the `modern:` i18n block, `scripts/modern/*.ts`, and the records it creates in every section.
- Sub-lanes, one per section: `modern-web`, `modern-music`, `modern-film`, `modern-tv`, `modern-conferences`, `modern-heritage`, `modern-rights`, `modern-books`, `modern-upcoming`, `modern-figures-50` (named so it never collides with the existing `modern-figures` lane), `modern-organizations`, `modern-media`, `modern-sports`, `modern-awards`, `modern-achievements`, `modern-enterprise`, `modern-arts`, `modern-built`, `modern-learning`. One agent per sub-lane at a time.
- Branches: `modern/p1-<agent>` (schema), `modern/p2-<agent>` (pilot and browser), `modern/<section>-b<nn>-<agent>` (waves), `modern/q-<section>-<agent>` (discovery).
- Progress: `docs/modern-islam/progress.md` (lane-wide), `docs/modern-islam/progress/<section>.md` (per section, created with the first batch). Queues: `docs/modern-islam/queue/<section>.yaml`. Stubs: `data/_stubs.d/modern-<section>.yaml` (created with the first stub).
- Harvest storage: the microSD harvest drive only, `/Volumes/exmicroSD/islam-museum-harvest/modern/<section>/` (founder's rule, 6 November 2026: always the microSD, never the Mac's main drive; anything downloaded to the Mac is moved there and deleted); never in git.

## Batch order

1. Phase 1 (schema, API, validator, tests, locales; `submission-impacting`, outreach files in the same commit).
2. Phase 2 (pilot): the nineteen records of `seeds.md` section 0, the browser, the landing card, the Explore entry; first deploy by the founder.
3. Phase 3 waves in the founder's section order (proposed: figures, web, music, organizations, conferences, film, tv, books, awards, sports, then the rest), 25 entities per PR.
4. Phase 4 discovery per section alongside the waves.

## Research method

Browser first, on the founder's Mac, in Google Chrome with its sign-ins, one action at a time on logged-in sites; any tool installed on the Mac that helps; APIs last and never against a platform's terms. Full rule: plan 26 section 5.1 and `docs/modern-islam/prompt.md` section 4.

## Overlap warnings

- `screen` records belong to the Screen index pipeline (plan 12); the film and tv sub-lanes add and enrich through it.
- `listing` basis rules belong to the Made wing (plan 11).
- Media-figure persons belong to the `modern-figures` lane's model; enrich, never duplicate.
- Recorded lectures and conference sermons belong to the Khutab and Durus lane; link to its works.
- The fatwa-website index belongs to the Fatwa Explorer; reuse it in `web`.
- Thin existing buildings belong to the prose-fill lanes; the `built` sub-lane adds new 1976+ buildings and the modern facts on existing ones.
- Search `data/` by label in every script, by `external_ids.wikidata` and by aliases before creating anything; a duplicate becomes an alias of the richer record.

## Rules restated

Arabic first and all three languages in the same commit; one defined source is enough for a fact and nothing enters without one; faith only on two independent sources naming the school; `made.by_muslims` only with basis; no lyrics, no article text, no embeds; dated platform figures in `reach`, never in prose as facts; describe, attribute, label, no verdict; ≤ 25 entities per PR; explicit paths; trailers; three-way merge; coverage regenerated; canary entry; never deploy.

## Progress and handoff

Resume at the "next step" of `docs/modern-islam/progress.md` or of the section's progress file; the lane document and the prompt are the brief. Report excluded items with reason, gate and override in the progress file.
