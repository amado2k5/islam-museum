# Modern Islam Browser: progress and decisions

Live state of the lane. One line per event, newest first in each section. Per-section progress files go in `progress/<section>.md` once waves start; this file keeps the lane-wide state, the decisions log and the lane-wide excluded-items table.

## Status

- **6 November 2026** — Phase 1 implemented (schema, validator, graph derivation, derived sections, reach index, census, static API, locale labels, outreach register) on branch `modern/p1-claude`; see the Phase 1 report under Deploy notes once merged. Next step: Phase 2 from Prompt B (`prompt.md` section 8): the nineteen pilot records of `seeds.md` section 0, the browser pages and the landing card, then the founder's first deploy.
- **6 November 2026** — Phase 0: plan 26, the taxonomy, the seed programme and the prompt written on the founder's request. Awaiting the founder's written approval of plan 26 sections 3 and 12. Nothing in schema, data, site or i18n changed. Next step: the founder approves; the approval is transcribed as D-000 below; Phase 1 starts from Prompt A.

## Next step

Phase 2 (Prompt B): the pilot records, the browser and the landing card. Research browser-first on the founder's Mac (D-002).

## Decisions log

### D-000 — Founder's authorization (6 November 2026)

**Founder's words (chat, 6 November 2026, answering the question "Do you approve plan 26 so Phase 1 (schema) can start from Prompt A?"):** "Approve, start Phase 1".

**Read as:** approval of plan 26 as written, with the plan's recommendations on every decision of its section 12: (1) the window and the nineteen sections; (2) the `award` class, not the `work`-kind fallback; (3) the kinds and roles of section 3.2, the five fields of 3.4 and the predicates of 3.5, as a `submission-impacting` Phase 1 with the claims register and evidence map updated in the same commit; (4) the reach-index formula of 4.6 and the weights in `taxonomy.yaml`; (5) the inclusion rule of 8.4; (6) the pilot list of `seeds.md` §0 and the proposed section order; (7) the lane row as the standing approval for Phases 3 and 4 once the pilot merges; (8) the browser-first research rule of 5.1. No deployment is authorized; merged is not live.

**Correction to plan 26 found during Phase 1 (6 November 2026):** `R2_DATA_DIRS` in `workers/site/src/route.js` and the matching lists in `publish.mjs`, `wrangler.production.toml` and `deploy.yml` name *site output* folders (`media`, `edu`, `timeline-data`, …), not repository data classes; the `invention` class (D-000 of the Inventions browser) touched none of them, and records of a class reach the API through `/api/v1/<class>/` as any class does. The `data/award/` row of plan 26 section 11 is therefore void: Phase 1 changes no Worker or workflow file, and the hosting architecture quoted by the submissions is unchanged. The `submission-impacting` label still applies to the class list and the new `/api/v1/` routes.

**Validator scoping decided in Phase 1 (rule of plan 26 §3.6, applied without breaking the existing corpus):** the two-independent-sources faith rule is an *error* for persons in the browser's window (born 1900 or later, or in the `living` wing) when the value names a Muslim school or order, and a *warning* for everyone else (854 historical records carry one-source values that are not this lane's to re-adjudicate); the three records the founder settled by express ruling (`person/bilal-philips`, `person/siraj-wahhaj`, `person/qazi-muhammad-isa`) are exempt. `made.by_muslims: true` with `basis: unverified` is an error for records dated in the window and a warning for the 93 older records that carry it.

### D-001 — Pilot first, then waves (6 November 2026)

**Founder's instruction (chat, 6 November 2026):** make the plan show this sooner to production rather than later; first one subject at least under each section, the UI, and a card on the landing main page; after the first production push, keep incrementally adding prose, subjects and content.

**Applied:** plan 26 section 6 orders the phases as plan → schema → pilot (nineteen records, the browser, the landing card, first deploy) → incremental waves with discovery alongside. Nothing in the browser waits for a section to be complete.

### D-003 — Downloads only on the microSD (6 November 2026)

**Founder's instruction (chat, 6 November 2026):** always use the microSD for any downloads; anything already downloaded to the main drive is moved to the microSD and deleted from the main drive.

**Applied:** plan 26 sections 3.7 and 5.1, `prompt.md` section 4 and the lane document name `/Volumes/exmicroSD/islam-museum-harvest/modern/<section>/` as the only download location. Nothing was downloaded in Phase 1 (schema work; no harvest ran).

### D-002 — Browser-first research on the founder's Mac (6 November 2026)

**Founder's instruction (chat, 6 November 2026):** use the Mac browser and put any tools on the Mac needed to go online, search, discover and gather all the needed information and details; use fewer APIs and more of the browser.

**Applied:** plan 26 section 5.1 and every prompt in `prompt.md`: research in Google Chrome on the Mac with its sign-ins, one action at a time on logged-in sites, any helpful tool installed on the Mac, APIs only where the browser cannot do the job at the needed scale, nothing from a platform whose terms forbid it, downloads outside git.

## Excluded items (lane-wide)

Every dropped lead, claim, prose passage or enrichment is listed here with its reason, the gate it failed and an override the founder can use to re-enter it. Nothing is re-entered without his written authorisation.

| Date | Section | Item | What it was | Reason dropped | Gate | Override |
|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — |

## Deploy notes

Merged is not live. Each phase report here names the merged PRs, the commits, whether a Worker or workflow file is among them, and what the founder must deploy. No agent runs `deploy.yml` or `deploy-uat.yml`.
