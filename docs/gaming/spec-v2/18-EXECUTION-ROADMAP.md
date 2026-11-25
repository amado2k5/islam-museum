# Milestone roadmap and dependency gates
| ID | Deliverable and exit evidence | Dependencies |
|---|---|---|
| M0 | Repository inventory, seven locales, actual hosting/CI/rights, ADRs, baseline timings, threat model, file ownership; identify blockers | none |
| M1 | Golden Age district rendering spike, two engine comparison, real captures and hardware benchmark or explicit pending physical test | M0 |
| M2 | Golden Age core trade-off loop and Atlas playable five rounds; gameplay lab and solver, first independent feedback | M0; M1 for visual slice |
| M3 | Shared lifecycle/content/save/SDK contracts, portal shell, route/nav/home staging, independent CI and deploy dry run; sample data-only pack | M0–2 |
| M4 | Golden Age complete campaign candidate, three modes/quality settings, art pipeline and independent candidate review | M3 |
| M5 | Atlas, Lost Manuscripts, Knowledge Web candidates and 365-day validation | M3 |
| M6 | House, Architects, Relics candidates, validated import/export | M3, M1 |
| M7 | Silk Road, Dynasty, ChronoQuest candidates; story, simulation balance, real environment streaming | M3, M1 |
| M8 | Creator Studio, SDK sample independent game/pack, cross-game interchange; programmable mods only after security gate | M3; actual consumers |
| M9 | All seven locale integration, nav/home/SEO/docs/settings, final independent build/staging/rollback matrix | all relevant candidates |
| M10 | Independent visual/gameplay/security, real GPU, human tests and museum validation; fixes and retest | candidates |
| M11 | Portable eligible exports, real press kit, review readiness and release approval | M10 |
M4–7 can proceed independently if contracts stable; do not release incomplete games. M9 verification begins at M3. Do not create 10 branches with shared uncontrolled changes; own file paths, schema version and merge order. Staged release possible per game only if its hard gates pass and governance approves. Scope reductions require founder decision if changing core commitments; small implementation choices documented via ADR. Human testing and real GPU unavailable? leave gate pending, publish no false validated claim, continue remaining build work. A candidate is usable for testing, not public launch by default.

## Checkpoint template
Milestone/game; status; commit/PR; files owned; requirements satisfied IDs; commands/results/evidence paths; actual known failures; environment; decisions/alternatives; outstanding blocker, owner and exact next command. Update after each verified unit of work. At session resume read checkpoint and confirm branch/head, not just prior summary. Keep authoritative acceptance matrix and test outputs in repo per governance. Use small reviewable PRs. No changes to main outside existing rules. Report meaningful milestones, not generic status. Budget/cost decisions transparent; no speculative deadline promises.
