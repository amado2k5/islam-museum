# Prompt for Claude (islam-museum repo). DRAFT: use only after the founder approves DESIGN.md.

You are building the Islam Museum Time Browser in the islam-museum repo. Work in your own worktree, never in a shared folder.

## Read first (in order)
1. `AGENTS.md`, then `docs/ai-change-gates.md`, `docs/agents/workflow.md`, `docs/agents/lanes.md`.
2. `docs/site/README.md` (design, accessibility, date and timeline rules) before any site change.
3. `time-browser-plan/DESIGN.md` in this repo (the approved design). If it is missing from `origin/main`, stop and ask the founder.
4. `docs/agents/publication-standard.md`, `docs/agents/content-standards.md`.

## Hard rules
- Zero AI at runtime. No model call, no generation, no telemetry, no third-party request from the page.
- Search covers prepared records only. Missing records get the "not in the Time Browser yet" message.
- Arabic first; English and Urdu in the same commit for any new prose, UI string or component (`i18n/en.yaml`, `i18n/ur.yaml`).
- No honorifics typed. No Qur'an text typed (use `[[passage/...]]` references).
- Commit explicit paths only. Never `git add -A`. Trailers: `AI-Agent: Claude Code`, `AI-Model: <your model>`, `AI-Editor: Claude Code`.
- Before every push: `git fetch origin && git rebase origin/main`, then `npm run validate`, `npm test`, and `npm run build` for any site change.
- Open a PR and merge it yourself once Validate is green. Roughly every 15 minutes of work: push, PR, merge.
- After each merge, add one progress line to your lane file (`docs/agents/lanes/time-browser.md`, append only) and comment on the PR with a short status.

## Your lane
You own: `scripts/time-browser*.ts`, `site/src/pages/[lang]/time-browser/`, `site/src/scripts/time-browser*.ts`, `site/src/components/time-browser/`, `schema/time-browser*`, `docs/agents/lanes/time-browser.md`, and the time-browser section of `docs/site/README.md`. Devin owns `scripts/time-browser-media*` and the historynavigator repo. Do not edit their files.

## Phases (one PR each, each deployable alone)
- **TB0 (docs only):** write `docs/agents/lanes/time-browser.md`; measure the file count per language for the planned topics and report it; confirm Pages vs R2 for the JSON with the founder's answer in DESIGN.md §8.
- **TB1 (data):** `scripts/time-browser.ts` reads `.cache/graph.json` and writes records and per-topic JSON in the content model of DESIGN.md §3. Schema file, tests: shape, sorted by `timelineKey`, every record has sources, kids lists exclude contested records, ur ≠ en. No UI.
- **TB2 (media wiring):** consume Devin's media index (`time-browser-media` output, one image or map id per record, reuse counts). Do not create images here. Make the build fail on a record that references a missing media id.
- **TB3 (static pages):** `/<lang>/time-browser/` index and per-topic pages, no JavaScript needed to read, Pagefind index limited to time-browser records, i18n keys ar, en, ur. Run axe and lychee. Add no menu entry yet.
- **TB4 (interactive):** vanilla TypeScript (no React), progressive enhancement over TB3's HTML. Full-viewport layout, no page scroll: timeline strip at the bottom, detail panel on the side (tablet and desktop) or a bottom sheet (phone). Keyboard: ←/→, Home/End, Enter, Escape, focus trap in the sheet. Reduced motion respected. Search box, only over the index. JS ≤ 20 KB gzipped (set the budget in `scripts/check-weight.ts`). Test: keyboard walk, screenshots light/dark × ar/en/ur × phone/tablet/desktop, no horizontal or vertical page scroll.
- **TB5 (entry points):** landing "Navigate today: time-browse the museum" button right after today's date (hard to miss); random start event with a first-visit hint; a "Time-browse this" button above References on each entity page that has a record; the "What we offer" page with features, usage and screenshots in three languages. Update `docs/status.md` (append only), `docs/coverage.md` via `npm run coverage`, and the time-browser section of `docs/site/README.md`.

## Scope and batches
- Show every record type. Launch batch: 50 records per type (events, persons, places, polities, periods, themes, works, concepts, practices). Draft records carry a visible "draft" label.
- Base URL comes from one constant (`TIME_BROWSER_BASE`); never hard-code the host, so a later subdomain is a config change.
- Urdu UI name: ٹائم براؤزر (needs a native reviewer). Arabic: متصفح الزمن.
- When the founder says "add 50 more" or "add 50 more of <type>", run one more batch of 50 for the named types, with its own PR.

## Logging (required)
- Append one line per step to `.time-browser-logs/claude.log` (git-ignored; add the path to `.gitignore` in TB0 if missing): `ISO-time | phase | action | result | next`.
- When the founder asks for status, tail the last 50 lines, then report: the latest completed step, what is in progress, and what remains per phase.

## Report
After each PR: one line in the lane file and a PR comment: phase, PR number, what merged, what is next, anything blocked. Stop and ask the founder if a decision in DESIGN.md §8 is still open when you reach it.
