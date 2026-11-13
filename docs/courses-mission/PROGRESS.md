# Courses mission: progress and checkpoints

The run's log. Three states are kept apart everywhere:

| State | Commit | What it is |
|---|---|---|
| Production | `8d1b0ef9d7556cc570e9e452e8cd3257e346ab1f` | What visitors see at https://islam.museum: build run 42832259141, site v1.10.0, deployed 2026-11-10T18:33:45Z (read from `/api/v1/meta/deploy.json` on 2026-11-11 and again by the audit oracle). |
| Baseline | `800467e93e2c9ef073807f6bd5c7b717b028f859` | `origin/main` when this branch was cut (2026-11-11 23:28 EST). The "before" of every repository measurement. Frozen in `scripts/courses/lib.py`. |
| This mission's branches | `courses/phase-1-audit` … `courses/phase-4-…` | What the mission builds, one branch and one pull request per phase, each targeting `release/uat`. None of it is live: merged into `release/uat` is not live, and deploying is the founder's. |

At the baseline, `origin/release/uat` stood at `aecd4832884d9966db32521328f4ae608849576d`: 33 commits main does not have and 246 commits behind main. The phase pull requests target `release/uat`, as the brief requires; because the branch was cut from main, the first pull request's diff against `release/uat` also shows main's 246 commits. That is a property of the two instructions together, not work of this mission; the mission's own commits are listed below.

## Checkpoints

| # | When (EST) | Commit | What |
|---|---|---|---|
| 0 | 2026-11-11 23:28 | `800467e93e` | Baseline frozen; production stamp read; worktree fast-forwarded to `origin/main`. |
| 1 | 2026-11-11 23:50 | `47e1537aba` | Phase 1, the measured audit: `AUDIT.md`, the audit oracle, the alias-search tool, the baseline validator output. PR #6141. |
| 1m | 2026-11-12 00:20 | `b1e67853d3` → merge `841cdc52c4` | `release/uat` merged into the phase 1 branch (six conflicts between `release/uat` and main, none in this mission's files, both sides kept; the two generated reports regenerated on the merged tree). PR #6141 merged into `release/uat` on the user's instruction. |
| 2 | 2026-11-12 | this branch's head | Phase 2, design and prototype: `DESIGN.md`, the new courses home, course map and lesson pages (Arabic, English), the oracles for taps, no-script, boundaries and the vision register, five screenshot review rounds. |

## Who merges

The brief said the founder merges. On 12 November 2026, during the run, the user instructed: merge every pull request you raise without waiting for CI, resolve conflicts, and discard nothing from main. From PR #6141 on, each phase pull request is merged into `release/uat` by the agent as soon as it is opened. Deployment remains the founder's.

A consequence for the ledger: each phase branch has `release/uat` merged into it before it is built on, so the branch head is the integration point. The boundary oracle compares against `release/uat` with phase 1 merged (`841cdc52c4`), not against the original baseline.

## Things found on the way that are not this mission's

- **With scripts off, the site's header menu makes every page scroll sideways on a phone** (290 px in English, 196 px in Arabic, where the page also starts shifted). Measured on production on 12 November 2026 on `/en/learn/`, `/en/learn/courses/` and an entity page: `UL.dd-menu` is the widest element. The header is shared by every page and is outside this mission; the new pages inherit it.
- **The site's `.flip` class does not mirror an arrow that sits in running text.** It sets a transform, which has no effect on an inline box; it works inside buttons because flex items are blockified. The courses stylesheet sets `display: inline-block` for its own arrows only.

- **Main fails its own validator at the baseline.** `npm run validate` at `800467e93e` prints `16 errors`: ten `provenance.layer` values in the Janna Browser concept records and six front-matter errors in `concept/hudud-allah-wal-kabair` (captured in `oracle-output/gate-validate-baseline.out`). They are another lane's records, landed minutes before the branch was cut. This mission does not edit them; the ship gate at the branch head is reported both as the literal string and as "errors this branch added".

## Urdu

Urdu is outside this mission by the founder's brief: no `/ur/` page and no Urdu string is created or edited. `AGENTS.md` asks that every new page and string ship with Urdu, or that the change say it cannot: this mission says so here and in every phase commit. New pages are built for Arabic and English only; `i18n/ur.yaml` is untouched (the string loader falls back to English for a missing key, but no Urdu page of the new surface is generated).

## 12 November 2026: Ontario finished, merged to main, on hold

- Ontario Grades 1 to 12: 66 courses attempted, 65 with lessons (360 lessons, 671 connections), reviewed in eight sweeps and corrected; table in `docs/courses/FLEET.md`.
- The surface is in Arabic, English and Urdu; the homepage carries a section and an explorer card.
- The finished work was carried onto a branch cut from `main` (`courses/ontario-main`), `main` was merged into it (it had meanwhile received the first two phases through `release/uat`), and it was merged to `main` by pull request.
- Scale map, ledger and `PUBLISH.md` are in the same merge.
- **On hold by the user's instruction.** British Columbia is next when asked to resume, then Quebec, Michigan, Texas, Washington, California; `SCALE-MAP.md` says what each needs.


## The depth layer (13 November 2026)

After an Ontario educator's review ("very surface level"), a depth layer was added to the lessons of every Science and Social Studies course: 143 of 147 lessons, Arabic and English, written only from the linked records and checked by `scripts/courses/check_depth.py` (`DEPTH: GREEN`). The standard is `docs/courses/depth-rubric.md`; what is done, what is next and what was found on the way is `docs/courses/depth-rollout.md`. The course tree, the cards, the expectation texts and the draft label were not touched; Urdu was not touched. The lesson page shows the layer after the woven cards (`DEPTH` in `site/src/lib/courses.ts`).
