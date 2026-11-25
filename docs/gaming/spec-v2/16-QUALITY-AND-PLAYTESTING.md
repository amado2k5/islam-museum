# Independent quality and release evidence
Hard gates in contracts/acceptance.json apply by scope. Candidate != validated != released. Required evidence: commit, game/version/profile, test command, environment, logs/screenshots, date, reviewer, result and limitations. Do not self-award perfect scores. Software CI catches correctness, not entertainment. Independent visual reviewer compares actual footage against art brief; gameplay reviewer plays without being told intended solution; security reviewer did not author sandbox. Human tests required for validated release, not invented by model. If unavailable, mark gate pending and supply test build. Real hardware testing separate from headless.

## Playtest protocol
Recruit a small initial diverse sample (e.g. 5–8 per slice, later 15–30 per candidate if feasible), including players uninterested in history, novice/experienced genres, all relevant language/RTL users and accessibility testers. Obtain consent; no compulsory identifiable recording. Observe silent first run, time to meaningful action, failed attempts, UI navigation, hints, frustration, choice reasoning, willingness to replay/share. Ask neutral questions, not 'was it amazing?'. Record anonymized counts and verbatim notes only with consent. Repeat after fixes. This is diagnostic, not statistically representative. A blind reviewer must finish a scenario and evaluate alternate strategy. Track pacing and quit reason. Stop shipping if a dominant exploit, unfinishable loop, unreadable HUD or severe historical issue appears.

## Scorecard (proposed internal rubric)
| Category | Weight | Evidence |
|---|---:|---|
| Gameplay depth | 20 | meaningful decisions, alternatives, replay observed |
| Visual direction | 20 | actual footage, distinct identity, moving scene |
| Originality | 10 | distinctive museum-driven mechanics |
| Controls | 10 | responsive, readable, remappable |
| Replayability | 10 | mastery, varied outcomes, no grind |
| Audio | 5 | coherent mix and accessibility |
| UI | 5 | task completion, no confusion |
| Performance | 5 | declared real GPU benchmark and soak |
| Historical integrity | 5 | source audit and distinction |
| Extensibility | 5 | real independent pack round trip |
| Accessibility/locales | 5 | locale coverage and functional tests |
Proposed target 90/100 overall and no category below 8/10; use independent reviewers and evidence for scores. Scoring cannot waive hard gates; don't fabricate precision. For games with no executable mods, evaluate supported content extension rather than penalizing security boundary. Release only after founder/governance and all required hard gates.

## Tests and anti-patterns
Unit and property tests for invariants, seeded simulation lab with thousands of runs as appropriate, replay determinism or state snapshot, daily solver validates 365 days, malformed assets, security red-team, save corruption and migration, input focus, browser reload and device loss, 60-min soak, locale screenshots and keyboard tests, actual portal iframe integration. Bugs: severity critical (security/data loss/unplayable), high (broken loop/major misrepresentation), medium/low tracked. No unresolved critical/high blockers on release. Use screenshot baseline approval; no automated rewriting baselines to hide defects. Record actual real-browser capture for press kit. Validate source and license for all shipped assets and museum claims. Existing museum validator 0 errors and citation check 0 failures; use actual discovered commands. Report exact pending tests and reason.
