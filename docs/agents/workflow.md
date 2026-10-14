# Workflow: setup, commit, push, merge, hand off

Applies to every agent and human. Rules that never bend are in [`AGENTS.md`](../../AGENTS.md); this document is the mechanics.

_Origin: founder decision of 11 October 2026 that several sessions work in parallel and nobody's work is ever ignored, discarded or reverted._

## 1. Set up your own copy (once per session)

- Work in your own clone or `git worktree`, never in a folder another session uses.
  - Clone: `git clone https://github.com/amado2k5/islam-museum.git ~/islam-museum-<name> && cd ~/islam-museum-<name> && npm ci`
  - Or, from an existing clone: `git worktree add ../islam-museum-<name> -b <branch> origin/main`, and link `node_modules` from the main clone (never commit that link; `node_modules/` is in `.gitignore`).
- Create a branch from the latest `origin/main`: `git checkout -b <lane-branch> origin/main` (names in `docs/agents/lanes.md`).
- Check the baseline: `npm run validate` must say 0 errors and `npm test` must pass. If main is already broken by someone else's commit, fix that first (section 6), then start.
- Enable the attribution hook once: `git config core.hooksPath .githooks`.

## 2. Before you start, before every commit, before every push

1. `git fetch origin`; read what is new: `git log HEAD..origin/main --stat`, and the diffs of anything touching files you also touch (code, schema, validator, site, i18n, policy documents, shared data such as stubs). Read the commit messages: they say why.
2. Read `docs/status.md` and the lane's progress file.
3. Think about how the new work and yours fit; decide the merge deliberately, not by "whichever is newer".

## 3. Never

- Never revert, overwrite, delete, `git checkout -- <file>`, `git reset --hard`, `git clean`, `git stash drop` or force-push anything you did not create. "It looked unrelated" is not a reason.
- Never `git add -A` or `git add .`; add explicit paths.
- Never commit `node_modules` (or a symlink to it), PDFs, OCR text, page images, dumps, or any file over a few hundred KB outside the established data folders. Check `git status` and `git diff --stat origin/main` before every commit: only your paths, and no mass deletions in shared files.
- Never rewrite another session's files while they may still be editing them; if a merge needs a change, make the smallest one that keeps their intent and say so in the commit message.
- Never lower a validation rule, skip a test, delete a failing check or add a guard (`if (!x) continue`) that hides bad data. Fix the data, or write a request (`docs/requests/<lane>-<topic>.md`) for a schema or script change: do not edit `schema/` or `scripts/` outside the lane that owns them.
- Never chain checks and a push with `;`. Use `&&`: `npm run validate && npm test && git push ...`. A failing test must stop the push.

## 4. Commit and push often

Work can be lost if an agent runs out of credit or time, so push small validated commits to `main` frequently (after about every 10 entities and at the end of every batch). The sequence, every time:

```
git fetch origin
git add <explicit paths of your own files>
git commit -m "<type>(<lane>): <what> pp. N-M (draft)"      # conventional message, plus the trailers in section 7
git pull --rebase origin main            # review what arrived; combine both sides; never drop another session's work
npm run validate && npm test             # clean AFTER the rebase
git push origin HEAD:main
git push origin HEAD:<your-branch>       # keep your branch in sync too
```

If the push is rejected because main moved, repeat. If pushing to `main` is blocked by a policy of your tool, push your branch, say so in your progress file, and carry on: the maintainer will merge. Small commits, at most 25 content entities per batch; one logical change per commit.

**Totals on every check-in.** `docs/coverage.md` holds the public totals (entities, stubs, edges, by class, wing, period, region, theme). Every commit that adds, removes or changes entities, stubs or edges must regenerate it in the same commit: run `npm run coverage` after your data changes, then `git add docs/coverage.md` with your other explicit paths. Do not hand-edit the file, and do not commit a check-in that leaves it stale. If another session has just merged data, regenerate after the rebase, before the validate. The homepage counts (`الناس`, `المكان`, `الزمان`, `الكلمة`, `الآثار`, `الأفكار`) are not rendered from this file: a deployed site that shows them must be rebuilt from `origin/main` to update.

## 5. Integrate, do not override

- Rebase or merge onto the latest `origin/main` before you push; resolve every conflict by combining both sides' intent; run validate and tests afterwards, because other people's content can break your rule and your rule can break their content.
- **Duplicates.** If two sessions modelled the same entity under different slugs, keep the richer, better-sourced one as canonical, add the other id to its `aliases` (every old link still resolves), carry over sources, themes and facts, and only then remove the redundant file. Do not add a stub for something that exists.
- **Two ways of doing the same thing in code:** keep both working where possible, otherwise record the choice (ADR or `docs/status.md`) and update every caller.
- **Policy conflicts** are not yours to settle by editing the plan: follow the most recent founder decision, implement it, flag the conflict in `docs/status.md`.
- **Keep the other author's voice and conventions** in files you edit: Arabic first, Sunni-first perspectives, draft status, sources.
- If you find changes you did not make in your folder, leave them as they are; work from a clean worktree, or preserve them on a clearly named branch and tell the owner in `docs/status.md`.

## 6. Shared files and repairing main

- Shared files are append-only: `data/_stubs.yaml`, `data/_stubs.d/*`, `docs/status.md`, `schema/enums/*`. Never replace one wholesale (an earlier merge swapped the 156-line stub list for an 18-line fragment and main went to 183 errors). Your own stubs go in `data/_stubs.d/<lane>.yaml` as list items: `- { id: class/slug, label: { ar: "…", en: "…" }, class: <class> }`. Remove a stub only when the entity it names is written.
- After every `git pull --rebase`, run `npm run validate`. If it reports errors you did not cause, repair them in place (restore from `git show <last-good-sha>:<path>`), say so in the commit message, and push. Do not wait for the original author.
- Fix defects you find in anyone's merged work in place, with a clear message.

## 7. Attribution trailers (mandatory on every agent commit)

Every commit made by an AI agent or model says who made it, in git trailers at the end of the message:

```
AI-Agent: <agent or tool, e.g. Claude Code, Codex, Devin, Kiro, Antigravity, Gemini CLI, Cursor, Copilot>
AI-Model: <model name and exact version if known, e.g. claude-sonnet-5-5, gpt-5.1-codex; "unknown" if you cannot tell>
AI-Editor: <editor or host the agent ran in, e.g. Claude desktop app, VS Code, Codex CLI, Kiro IDE, terminal>
```

- All three, after the body and any `Co-Authored-By` line, separated from the body by a blank line. A human-only commit needs none.
- Be truthful and specific: read the model from your own system prompt or tool; never guess a version; write `unknown` rather than inventing one. If a sub-agent or another model did part of the work, add one extra `AI-Model:` line.
- The same facts go in the `provenance` block of every entity you create or change (`generated_by`, `model`, `run`).
- Never edit or amend another session's commits to add trailers; if they are missing, note it in `docs/status.md`.
- `.githooks/commit-msg` warns when they are missing and never blocks.
- Query: `git log --format='%h %(trailers:key=AI-Model,valueonly)'`.

## 8. Ownership, lanes and hand-off

- `docs/agents/lanes.md` says who owns what. Stay in your lane; for a change in someone else's lane make the minimal, additive change described above, or write a request file and use the closest existing option meanwhile.
- Keep your lane's progress file (`docs/delegation/<lane>-progress.md`) current after every push: edition and item used, sections done with pages, section in progress, flagged doubts, the exact next step. Update your lane's row in `docs/status.md` when a book or a stream finishes.
- If you cannot decide something, flag it in the progress file and continue with the next item; do not stop to ask unless the lane document says to.
- Long jobs (downloads, extraction) run in the harvest workspace outside the repository, use a separate database file per job so locks do not collide, and never block other sessions. After merging anything, record in `docs/status.md` what changed and what the next session should know.
