# Lane `education`: the education programme (plan `docs/delegation/education-master-plan.md`)

**Scope.** Builds the phases of the education master plan, one at a time, only after the founder approves each phase in writing (recorded in the plan's §9.1). Files: `edu/` (band, stamp and later topic data), `site/src/pages/[lang]/learn/**`, the band hubs under `site/src/pages/[lang]/sighar/`, `site/src/pages/[lang]/shabab/**` (from E4), the components, scripts and styles those pages need, the `edu:` block of `i18n/*.yaml`, `scripts/edu.test.ts`, `scripts/check-weight.ts`, and the progress file. Changes to the existing Kids' Wing pages are limited to linking the new hubs, the mascot sprite and the QR on printables.

**Rules.** `AGENTS.md`, `docs/agents/workflow.md`, `docs/agents/kids-content.md` (every child-facing string), `docs/ai-change-gates.md` (one approved phase at a time; each phase carries its label), `docs/site/README.md` (every page readable without JavaScript, no site-wide number in a layout, byte-identical builds). Static only: no account, no form that posts, no network call, no student data; `localStorage` reads and writes inside `try/catch`. Every new string ships in Arabic, English and Urdu in the same commit, Urdu translated from the Arabic and flagged for the founder's review in the hand-off.

**Budgets.** The page-weight budgets of plan §3 are enforced by `npm run check:weight` after the build; a breach is fixed by removing weight, never by raising the number.

**Branch / progress / stubs.** `education/E<n>-<agent>`; `docs/delegation/education-progress.md` (one section per phase: routes live in ar/en/ur, tests added, Urdu for review, evidence, what the founder must deploy); `data/_stubs.d/education.yaml` when a phase needs stubs (none in E1).

**Hand-off.** A phase is done when its acceptance tests in the plan pass in the three languages, `npm run validate && npm test && npm run build` are green on fresh `origin/main`, the PR is merged, and the progress file names the commits the founder has to deploy.
