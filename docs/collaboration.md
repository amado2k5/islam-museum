# Working together: rules for every agent session and for Devin

_Decided 11 October 2026 (founder instruction). Several sessions and Devin work on this repository at the same time. The rule is simple: **never ignore, discard or revert another session's work. Read what arrives, understand it, and merge it with yours so that both survive.**_

## Before you start, before every commit, and before every push

1. `git fetch origin`, then read what is new: `git log HEAD..origin/main --stat` and the diffs of anything that touches files you also touch (code, schema, validator, site, i18n, policy documents, shared data such as `_stubs`). Read the commit messages; they say why.
2. Read `docs/status.md` (current state, who owns what) and the policy documents that govern your work: `CLAUDE.md`, `docs/scope.md`, `docs/language.md`, `docs/plan/` (the section you are implementing), the ADRs in `docs/adr/`.
3. Think about how the new work and yours fit together. Decide the merge deliberately; do not take "whichever is newer" or "whichever is mine".

## Never

- Never revert, overwrite, delete, `git checkout -- <file>`, `git reset --hard`, `git clean`, `git stash drop` or force-push anything you did not create. "It looked unrelated to my task" is not a reason.
- Never `git add -A` or `git add .` in a shared folder. Add explicit paths. (A wholesale add has already swept one session's files into another's commit.)
- Never rewrite or "tidy" another session's files while they may still be editing them. If a file needs a change for the merge, make the smallest change that keeps their intent, and say so in the commit message.
- Never lower a validation rule, skip a test or delete a failing check to get green. Fix the data or the code, or file a request.

## If you find changes you did not make

Leave them exactly as they are. If they block you (for example `git pull` refuses), do not discard them: either work from a clean `git worktree` (see below), or preserve them on a clearly named branch with a commit message that says whose they are and why, and tell the owner in `docs/status.md` or in the PR. They belong to someone else and may be unfinished.

## Integrate, do not override

- **Rebase or merge onto the latest `origin/main` before you push**, resolve every conflict by combining both sides' intent, and run `npm run validate && npm test` afterwards, because other people's content can break your rule and your rule can break their content.
- **Same thing twice (duplicates).** If two sessions modelled the same entity under different slugs, keep the richer, better-sourced entity as canonical, add the other id to its `aliases` (so every old link still resolves), carry over any sources, themes or facts the other one had, and only then remove the redundant file. Example: `event/conversion-of-hamza` became an alias of `event/islam-of-hamza`.
- **Two ways of doing the same thing in code.** Keep both behaviours working where possible; otherwise write an ADR or a note in `docs/status.md` explaining the choice, and update every caller.
- **Policy conflicts** (code versus plan, or plan versus plan) are not yours to settle by editing the plan. Follow the most recent founder decision, implement it, and flag the conflict in `docs/status.md`.
- **Keep the other person's voice and conventions** in files you edit: language (Arabic first), Sunni-first perspectives, draft status, sources.

## Ownership and lanes

`docs/status.md` has a table of who owns what. Stay in your lane; if you need a change in someone else's lane (schema, scripts, site, a person or event someone else wrote), either make the minimal, additive change described above or write a request file `docs/requests/<who>-<topic>.md` and use the closest existing option meanwhile.

## Mechanics that keep sessions apart

- **One `git worktree` per session** (`git worktree add ../islam-museum-<name> -b <branch> origin/main`) instead of sharing one folder. Share `node_modules` by symlink.
- Work on a branch and open a pull request for anything non-trivial; small, explicit-path commits otherwise. Conventional commit messages; at most 25 content entities per batch.
- If main moved while you worked, rebase your commits onto it (in a worktree if your own folder has uncommitted changes) and push; never force-push main.
- Long jobs (downloads, extraction) write to the harvest workspace outside the repository and never block other sessions: use a separate database file per job (for example `wikipedia-ar.duckdb`) so locks do not collide.
- After merging anything, record in `docs/status.md` what changed and what the next session should know.

## For Devin specifically

All of the above, plus: stay in the lanes in `docs/delegation/`; read main's changes since your last PR before you start each batch and adapt (the validator, the language rule and the scope rule have all changed since the first prompt: Arabic first, Sunni first, perspectives ordered Sunni then academic then others); when a duplicate of your entity appears, merge it as described instead of deleting one; and when the maintainer or another session has edited a file you created, rebase on it and keep their edits.
