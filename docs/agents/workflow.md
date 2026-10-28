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

Work can be lost if an agent runs out of credit or time, so push small validated commits frequently (after about every 10 entities and at the end of every batch). Since 22 October 2026 `main` accepts pull requests only: a repository ruleset ("main: pull requests only") blocks direct pushes, force-pushes and branch deletion, with no bypass for anyone. You open the pull request and merge it yourself; no review is required. The sequence, every time:

```
git fetch origin
git add <explicit paths of your own files>
git commit -m "<type>(<lane>): <what> pp. N-M (draft)"      # conventional message, plus the trailers in section 7
git pull --rebase origin main            # review what arrived; combine both sides; never drop another session's work
npm run validate && npm test             # clean AFTER the rebase
git push origin HEAD:<your-branch>
gh pr create --base main --head <your-branch> --fill   # once per branch; later pushes update the same pull request
gh pr merge --merge --delete-branch=false              # merge it yourself when the checks you ran are clean
```

The Validate workflow runs the tests and the build on every pull request; you may merge before it finishes when your local checks passed, since the deploy is manual and never picks an unbuilt commit (section 9). If the merge is rejected because main moved, rebase and push again. Small commits, at most 25 content entities per batch; one logical change per commit.

A push to `main` does not deploy anything (section 9). The checks you run before the push are the gate; CI runs the same checks on pull requests only.

**Totals on every check-in.** `docs/coverage.md` holds the public totals (entities, stubs, edges, by class, wing, period, region, theme). Every commit that adds, removes or changes entities, stubs or edges must regenerate it in the same commit: run `npm run coverage` after your data changes, then `git add docs/coverage.md` with your other explicit paths. Do not hand-edit the file, and do not commit a check-in that leaves it stale. If another session has just merged data, regenerate after the rebase, before the validate. The homepage counts (`الناس`, `المكان`, `الزمان`, `الكلمة`, `الآثار`, `الأفكار`) are not rendered from this file: a deployed site that shows them must be rebuilt from `origin/main` to update.

**Homepage totals move with the data.** The homepage stats line (`i18n/*.yaml`, key `landing.stats`) and its pages figure are derived from the entity count in `site/src/lib/graph.ts` and `site/src/components/Landing.astro`. Any commit that changes the entity count, adds or removes pathways (`data/exhibit/path-*`), or changes the planned pathway total must, in the same commit: (1) run `npm run coverage` and commit `docs/coverage.md`; (2) update every hard-coded pathway figure in `i18n/en.yaml`, `i18n/ur.yaml` and `i18n/ar.yaml` (the `landing.stats` line, and `learn_text` / `plan_note` where they state a count), so the homepage reads the same number as the repo; (3) state the old and new totals in the commit message. Do not invent a planned-pathway figure: take it from `docs/plan/` or from the agreed total, and say in the commit if that source is missing. Verify with `npm run build` that the homepage renders the new numbers, and check the Urdu and Arabic strings are updated too.

**Publication.** Content batches are published under `docs/agents/publication-standard.md`: citations to defined sources and recorded provenance are the whole bar — no review step exists. Run `npm run cite-check -- <record ids>` on the batch before committing; a failure means the bar is not met yet.

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
- If you cannot decide something, flag it in the progress file and continue with the next item; do not stop to ask unless the lane document says to. Never wait for the founder's sign-off on using a source, writing an entity, or committing and pushing validated work: that permission is standing (`docs/sources-policy.md` §5).
- Long jobs (downloads, extraction) run in the harvest workspace outside the repository, use a separate database file per job so locks do not collide, and never block other sessions. After merging anything, record in `docs/status.md` what changed and what the next session should know.

## 9. Deploying to Cloudflare: manual, founder only

**Where files go (founder rule, 28 Oct 2026).** Cloudflare Pages holds code and logic only. Data, content, maps, images, pictures and video go to Cloudflare R2, served by the site Worker. A new folder of data or media is added to `R2_DATA_DIRS` in `workers/site/src/route.js`, the publish list in `workers/r2-sync/batch/publish.mjs`, `run_worker_first` in `workers/site/wrangler.production.toml` and both `rm -rf` lines in `.github/workflows/deploy.yml`; never leave it on Pages. Details: `docs/engineering/06-deployment.md` "What goes where".

Since 21 October 2026 a push to `main` publishes nothing. Two workflows share the work:

- **`build.yml`, "Build islam.museum"**, runs on every push to `main` (and on demand). It runs the unit tests and, in parallel, `npm run build` (validation first) and `check:static`, and keeps the whole `dist/` as the artifact `dist`. A deploy takes only a run whose conclusion is success, which needs both jobs green, so a broken build can never be deployed: the artifact of a run whose tests failed is never chosen and simply expires. When the tests fail, the test job cancels the whole run so the build job does not run to the end (the job summary says the cancel was for failed tests, not a manual stop); a cancelled run has no deployable artifact. One active build per branch: every run, from a push or started by hand, waits its turn in the order it arrived and runs to its end (`queue: max`); no later push replaces or stops an earlier build. After many pushes the newest artifact can therefore arrive hours later; the deploy always takes the latest successful build. **Five successful builds are kept** (founder's rule, changed on 22 October 2026 from one): a final `keep-newest` job, which runs only when tests and build both passed, keeps the `dist` artifacts of the five newest successful builds and deletes every other finished run's `dist` artifact, so a failed run never takes a good build's place. Artifacts are kept for 14 days, so five daily builds stay available. The build touches nothing on Cloudflare.
- **`deploy.yml`, "Deploy islam.museum to Cloudflare"**, has no trigger but the founder's hand (Actions tab, or `gh workflow run deploy.yml --ref main`). It does not build: it downloads the `dist` artifact of a build run, deploys the sync Workers and the site Worker from that build's commit, publishes to R2 what differs from the last publish, uploads the rest to Pages, and pings IndexNow. Its one input, `build_run_id`, picks the build: empty means the latest successful build of `main`; a run id (from the build's Actions page, or `gh run list --workflow build.yml --branch main --status success`) deploys or redeploys that build, which is possible only while its artifact still exists: the five newest successful builds. The job summary names the build deployed (run id, commit, date). Redeploying the same build sends nothing to R2: the manifest diff finds no change. A deploy takes minutes, not the 45 minutes of a build.

The founder deploys normally once a day when enough work has landed on `main`. The reason is cost: every deploy republishes to R2 whatever differs from the last publish, redeploys the sync Workers and the site Worker, and uploads to Pages; a deploy per push would do that dozens of times a day for the same files.

What this means for you:

- **Never start the deploy yourself**, by any route, and never add a push trigger to `deploy.yml`. The same goes for the other `R2 *` workflows, which touch the buckets. Starting `build.yml` by hand is harmless (it only builds) but not needed: every push to `main` builds. Every manually startable workflow checks who started it and stops unless it was the repository owner or an admin (founder's rule of 22 October 2026), and a pull request from an outside contributor runs no workflow until the founder approves it.
- **When your work needs to be live, ask the founder in chat.** Say which commits (or the range since the last deploy), what they change, and whether any of them touch `workers/`, `.github/workflows/`, `site/public/_redirects` or `_headers`, because those change the Worker or the routing and the founder may want to check the deploy's result. A deploy is not needed for most content batches: the next daily deploy publishes them.
- **Your own gate is unchanged:** `npm run validate`, `npm test` and, for anything under `site/`, `npm run build`, all clean before you push. If you want the same checks run by CI, open a pull request; `validate.yml` runs on pull requests. A red "Build islam.museum" run on `main` means your push broke the build for everyone: fix it at once, because no deployable artifact exists until a build goes green again.
- **What a deploy publishes:** the manifest in R2 (`_r2-sync/manifest.json`) records what is already there, so a run sends only the files whose content changed since the previous successful run, in batches that are recorded as they finish. A failed or cancelled run resumes from the last recorded batch; nothing is re-sent. See `workers/r2-sync/README.md`.

