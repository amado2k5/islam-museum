# Courses mission: progress and checkpoints

The run's log. Three states are kept apart everywhere:

| State | Commit | What it is |
|---|---|---|
| Production | `8d1b0ef9d7556cc570e9e452e8cd3257e346ab1f` | What visitors see at https://islam.museum: build run 42832259141, site v1.10.0, deployed 2026-11-10T18:33:45Z (read from `/api/v1/meta/deploy.json` on 2026-11-11 and again by the audit oracle). |
| Baseline | `800467e93e2c9ef073807f6bd5c7b717b028f859` | `origin/main` when this branch was cut (2026-11-11 23:28 EST). The "before" of every repository measurement. Frozen in `scripts/courses/lib.py`. |
| This branch | `claude/course-data-verification-uat-b293fd` | What the mission builds. None of it is live; merged is not live; merging and deploying are the founder's. |

At the baseline, `origin/release/uat` stood at `aecd4832884d9966db32521328f4ae608849576d`: 33 commits main does not have and 246 commits behind main. The phase pull requests target `release/uat`, as the brief requires; because the branch was cut from main, the first pull request's diff against `release/uat` also shows main's 246 commits. That is a property of the two instructions together, not work of this mission; the mission's own commits are listed below.

## Checkpoints

| # | When (EST) | Commit | What |
|---|---|---|---|
| 0 | 2026-11-11 23:28 | `800467e93e` | Baseline frozen; production stamp read; worktree fast-forwarded to `origin/main`. |
| 1 | 2026-11-12 | (this commit) | Phase 1, the measured audit: `AUDIT.md`, the audit oracle, the alias-search tool, the baseline validator output. |

## Things found on the way that are not this mission's

- **Main fails its own validator at the baseline.** `npm run validate` at `800467e93e` prints `16 errors`: ten `provenance.layer` values in the Janna Browser concept records and six front-matter errors in `concept/hudud-allah-wal-kabair` (captured in `oracle-output/gate-validate-baseline.out`). They are another lane's records, landed minutes before the branch was cut. This mission does not edit them; the ship gate at the branch head is reported both as the literal string and as "errors this branch added".

## Urdu

Urdu is outside this mission by the founder's brief: no `/ur/` page and no Urdu string is created or edited. `AGENTS.md` asks that every new page and string ship with Urdu, or that the change say it cannot: this mission says so here and in every phase commit. New pages are built for Arabic and English only; `i18n/ur.yaml` is untouched (the string loader falls back to English for a missing key, but no Urdu page of the new surface is generated).
