# Modern Islam Browser: progress and decisions

Live state of the lane. One line per event, newest first in each section. Per-section progress files go in `progress/<section>.md` once waves start; this file keeps the lane-wide state, the decisions log and the lane-wide excluded-items table.

## Status

- **6 November 2026** — Phase 0: plan 26, the taxonomy, the seed programme and the prompt written on the founder's request. Awaiting the founder's written approval of plan 26 sections 3 and 12. Nothing in schema, data, site or i18n changed. Next step: the founder approves; the approval is transcribed as D-000 below; Phase 1 starts from Prompt A.

## Next step

Founder's approval of plan 26 (decisions 1 to 8 in its section 12). Then Prompt A (`prompt.md`), Phase 1.

## Decisions log

### D-000 — Founder's authorization (pending)

To be transcribed verbatim from the founder's written approval: the window, the sections, the `award` class or its fallback, the kinds, fields and predicates, the `submission-impacting` sign-off for Phase 1 and the `data/award/` R2 folder, the reach-index formula, the inclusion rule, the pilot list, the section order, the lane row as standing approval, and the browser-first research rule.

### D-001 — Pilot first, then waves (6 November 2026)

**Founder's instruction (chat, 6 November 2026):** make the plan show this sooner to production rather than later; first one subject at least under each section, the UI, and a card on the landing main page; after the first production push, keep incrementally adding prose, subjects and content.

**Applied:** plan 26 section 6 orders the phases as plan → schema → pilot (nineteen records, the browser, the landing card, first deploy) → incremental waves with discovery alongside. Nothing in the browser waits for a section to be complete.

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
