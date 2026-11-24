# 67 · Cloudflare version retention from 8 December 2026: what it means for us

Written 23 November 2026 from the repository's own files. Investigation only: no workflow, wrangler config or Cloudflare setting was changed, nothing was deployed and Cloudflare was not contacted. What the repo cannot show (the live account) is listed as questions at the end.

**The notice (Cloudflare email, 23 Nov 2026, as relayed by the founder).** From 8 December 2026, saved versions of Workers and Pages projects older than 30 days are deleted. Always kept: the 100 most recent versions of each Worker or Pages project, any currently deployed Worker version, the current Pages production deployment. Running applications are unaffected. Rollback stays possible to any of the 100 most recent Worker versions or any undeleted Pages production deployment. A deleted Worker version's Version URL (including `--preview-alias` URLs) stops working; a deleted Pages deployment's preview URL stops working.

## 1. Setup inventory

| Item | What the repo says |
|---|---|
| Both Pages **and** Workers | Production: Worker `islam-museum-site` ([workers/site/wrangler.production.toml:5](../../workers/site/wrangler.production.toml)) plus Pages project `islam-museum` (the root [wrangler.toml:1-2](../../wrangler.toml); project name from `PAGES_PROJECT`, [deploy-env.yml:17](../../.github/workflows/deploy-env.yml)). UAT: `islam-museum-site-uat` (`[env.uat]`, [wrangler.production.toml:49](../../workers/site/wrangler.production.toml)) and Pages `islam-museum-uat`. |
| Sync Workers | `islam-museum-r2-sync` and `-2` to `-7` (7 copies, `SYNC_WORKER_COUNT`, [deploy-env.yml:16](../../.github/workflows/deploy-env.yml), [:103](../../.github/workflows/deploy-env.yml)); UAT `…-sync-uat[-N]`. Config: [workers/r2-sync/wrangler.production.toml](../../workers/r2-sync/wrangler.production.toml). |
| Test Workers | `islam-museum-site-test` ([wrangler.test.toml:2](../../workers/site/wrangler.test.toml)) and `islam-museum-r2-sync-test[-N]`, deployed by `r2-html-test.yml` (push to `feat/html-from-r2` or manual, [r2-html-test.yml:5-8](../../.github/workflows/r2-html-test.yml)) and `r2-sync-parallel-test.yml`. |
| Other services | R2 buckets `islam-museum-search`, `islam-museum-uat` ([wrangler.production.toml:35-37](../../workers/site/wrangler.production.toml), [:70-72](../../workers/site/wrangler.production.toml)); Workers Assets (`[assets]`, [:26-35](../../workers/site/wrangler.production.toml)); Workers Caching with `cross_version_cache = false` ([:20-22](../../workers/site/wrangler.production.toml)); Workers Logs observability ([:9-10](../../workers/site/wrangler.production.toml), [r2-sync :9-11](../../workers/r2-sync/wrangler.production.toml)); Custom Domain `uat.islam.museum` ([:55](../../workers/site/wrangler.production.toml)); production domain attached in the dashboard, not in config ([deploy-env.yml:304-306](../../.github/workflows/deploy-env.yml)); Worker secret `SYNC_TOKEN` set per sync Worker ([deploy-env.yml:279](../../.github/workflows/deploy-env.yml)). **Not used** (grep of all wrangler configs for `kv_namespaces`, `d1_databases`, `queues`, `durable_objects`, `triggers`/`crons`: no hits): KV, D1, Queues, Durable Objects, cron triggers. |
| Trigger | Manual only, the founder's: every deploy workflow is `workflow_dispatch` ([deploy.yml:17](../../.github/workflows/deploy.yml), [deploy-uat.yml:24](../../.github/workflows/deploy-uat.yml), [deploy-all-parts.yml:9](../../.github/workflows/deploy-all-parts.yml)); [AGENTS.md](../../AGENTS.md) "Deployment is manual". Normal cadence: about once a day ([docs/status.md:200](../status.md)). Builds (`build.yml`) run on every push to `main` and deploy nothing ([build.yml:10-11](../../.github/workflows/build.yml)). |
| Pages mode | Always a production deployment: `--branch=main` is passed explicitly ([deploy-env.yml:341](../../.github/workflows/deploy-env.yml)). The workflows create no Pages previews and no aliases. **Correction, 23 Nov 2026:** the live account holds 19,933 Pages deployments since 18 Oct (section 3.8), far more than these workflows create, so something else (probably Pages' own Git integration, which the root `wrangler.toml` suggests) makes previews. |
| Pages content | Only the assets-only folder (about 1,600 files, [wrangler.production.toml:25](../../workers/site/wrangler.production.toml)), no HTML, data or media. |

## 2. Impact verdict

The change does not hurt us in a way that affects running traffic, and it does not touch R2. What it removes is **Cloudflare's own rollback targets**, and those were never the real rollback path: Worker and Pages rollback only reverts the Worker code and the ~1,600 assets, while every page, API file, search index and image lives in R2 and is not versioned by Cloudflare. The rollback that actually restores the site is "redeploy an older `build_run_id`", and that is bounded by GitHub, not Cloudflare: build artifacts live 14 days and only the five newest successful builds are kept ([build.yml:197](../../.github/workflows/build.yml), keep-newest at [:200-206](../../.github/workflows/build.yml)), which is a stricter limit than the new Cloudflare one. The one doc that promises "CF Pages keeps prior deployments for instant rollback" ([06-deployment.md:128](06-deployment.md), also [08-security.md:60](08-security.md), [11-assessment.md:143](11-assessment.md), [executive-deck.md:146](../presentation/executive-deck.md)) overstates what that buys (code only, not content) and after 8 December will be limited to roughly the last 100 Pages deployments and 30 days. The practical exposure is small and is about **identifying** a rollback target, because the repo records the commit and build run in `api/v1/meta/deploy.json` ([deploy-env.yml:253](../../.github/workflows/deploy-env.yml)) but not the Cloudflare Worker version or Pages deployment ID.

## 3. Exposure list

**3.1 How far back the 100-version window reaches (check 2).** The repo shows how many versions one workflow run creates; it cannot show how many runs actually happened (question Q1).

| Resource | Versions or deployments per run | Production runs of `deploy.yml` (one job) | Runs of `deploy-all-parts.yml` (shared + 7 languages) |
|---|---|---|---|
| Site Worker `islam-museum-site` | 1 (`wrangler deploy`, [deploy-env.yml:310](../../.github/workflows/deploy-env.yml)); the language deploys do not deploy it, only the shared deploy does ([deploy-shared-env.yml:335](../../.github/workflows/deploy-shared-env.yml), none in `deploy-lang-env.yml`) | 1 | 1 |
| Pages `islam-museum` | 1 (`pages deploy`, [deploy-env.yml:341](../../.github/workflows/deploy-env.yml)); the shared deploy only ([deploy-shared-env.yml:363](../../.github/workflows/deploy-shared-env.yml)) | 1 | 1 |
| Each of the 7 sync Workers | `wrangler deploy` ([deploy-env.yml:276](../../.github/workflows/deploy-env.yml)) **and** `wrangler secret put` ([:279](../../.github/workflows/deploy-env.yml)); secret changes make a new version in Cloudflare's model (general knowledge, not shown by the repo) | 2 | 2 × 8 = 16 (shared [deploy-shared-env.yml:301,304](../../.github/workflows/deploy-shared-env.yml) and each language [deploy-lang-env.yml:232,235](../../.github/workflows/deploy-lang-env.yml)) |

At one run a day: the site Worker and the Pages project reach 100 versions after about 100 days, so the **30-day rule is what binds** them, and 8 December onward they keep about the last 30 days (roughly 30 versions). The sync Workers hit the 100 cap first (16 a day via all-parts means about 6 days; 2 a day via `deploy.yml` means about 50 days), so their 30-day window is not the limit but their history is short. UAT adds its own, separately named Workers and project, with the same arithmetic. The sync Workers are redeployed from the built commit every run, so losing their history costs nothing.

**3.2 Habits and runbooks that assume arbitrary rollback.**
- [06-deployment.md:128](06-deployment.md): "CF Pages also keeps prior deployments for instant rollback". Overstated; correct after 8 December.
- [08-security.md:60](08-security.md) "rolling back the CF Pages deployment", [11-assessment.md:143](11-assessment.md), [executive-deck.md:146](../presentation/executive-deck.md): same claim.
- [wrangler.production.toml:2-4](../../workers/site/wrangler.production.toml): the comment says the Worker is "deployed by deploy.yml on every push to main … on its workers.dev URL only … no route"; stale since 21 Oct 2026 (manual deploys) and the production domain is attached. A documentation fix, not a retention problem.
- [build.yml:200-206](../../.github/workflows/build.yml) and [deploy-env.yml:167-169](../../.github/workflows/deploy-env.yml): the working rollback is a redeploy of one of the five newest kept build artifacts. After a build is older than 14 days or sixth-newest, the only way back is to rebuild the commit ("Rebuild the commit with Build islam.museum", [deploy-env.yml:171](../../.github/workflows/deploy-env.yml)), about an hour and a half ([06-deployment.md:130](06-deployment.md)).

**3.3 What would be lost on 8 December.** Pages deployments and site Worker versions older than 30 days (beyond the current one) vanish from the dashboard and API; so does the ability to click "rollback" to them. Reproducing an old state is still possible from git if the commit is known, and the deploy summary records the commit ([deploy-env.yml:358-368](../../.github/workflows/deploy-env.yml)) in the GitHub run only; a run's logs are subject to GitHub's own retention.

**3.4 URL exposure (check 3).** Every hit in the whole repo for `pages.dev`, `workers.dev`, `preview-alias`, `versions upload`, "Version URL":

| Where | What it is | Affected? |
|---|---|---|
| [docs/plan/03-architecture.md:168](../plan/03-architecture.md), [docs/status.md:198](../status.md) | DNS CNAME target `islam-museum.pages.dev` | No: the project's stable `<project>.pages.dev` alias, not a deployment URL |
| [r2-html-test.yml:85](../../.github/workflows/r2-html-test.yml) | `https://islam-museum-site-test.ahamdy.workers.dev` smoke test | No: the script's own `workers.dev` address, not a Version URL; but the test Workers deploy rarely, so their history is not a concern |
| [r2-sync-parallel-test.yml:83](../../.github/workflows/r2-sync-parallel-test.yml) | list of `islam-museum-r2-sync-test[-N].ahamdy.workers.dev` | No: same |
| [deploy-env.yml:278](../../.github/workflows/deploy-env.yml), [deploy-shared-env.yml:303](../../.github/workflows/deploy-shared-env.yml) | reads the Worker's `…workers.dev` URL from `wrangler deploy` output and passes it to `publish.mjs` as `SYNC_URLS` | No: the script's stable address, read fresh on every deploy |
| [workers/site/src/route.js:135](../../workers/site/src/route.js), `wrangler.production.toml:2-4` | comments mentioning workers.dev | No |
| `--preview-alias`, `wrangler versions upload`, `wrangler rollback`, `wrangler deployments` | no occurrence in any workflow, script, doc or config | No: we never use Version URLs or aliases |

No doc, outreach note, marketing script or workflow in the repo links to a specific Pages deployment URL (`<hash>.islam-museum.pages.dev`) or a Worker Version URL. A grep of `docs`, `scripts`, `tools`, `workers`, `marketing`, `site/src`, `site/public/shell`, `.github` and the README files found none. Anything outside the repo (chat messages, emails, tickets) cannot be searched (Q3).

**3.5 R2 (check 4).** The distinction holds. R2 holds the HTML pages, API JSON, search indexes, media, books and open data, written at deploy time by `workers/r2-sync/batch/publish.mjs` through the sync Workers, using the manifest diff so unchanged files are not resent ([deploy-env.yml:30-31](../../.github/workflows/deploy-env.yml), [:335-345](../../.github/workflows/deploy-env.yml)); the site Worker only reads from it (`SITE_BUCKET` binding, [wrangler.production.toml:35-37](../../workers/site/wrangler.production.toml)); there are no runtime writes from the site Worker; manual writes only through `r2-seed.yml`. Objects are keyed by path, not by Worker or Pages version, so deleting a version deletes no object and the Worker serves whatever the bucket holds under any version. Reverse dependency: no build or deploy step fetches a previous Cloudflare deployment's output. The builds start from git and the GitHub-stored build artifact; the only "previous" input is the R2 manifest, which is in R2, not in a version. One related risk, not caused by this change: rolling a Worker version back in Cloudflare would pair old code with newer R2 content.

**3.6 Preview and PR workflow (check 5).** The workflows deploy no previews for PRs or branches (but see 3.8: the account shows thousands of Pages deployments, so Pages itself probably builds previews): `validate.yml` runs tests and a build on `pull_request` and deploys nothing ([validate.yml:3-4](../../.github/workflows/validate.yml)); Pages is always `--branch=main`; UAT is a separate, long-lived Worker and Pages project, not per-version previews, reached at `https://uat.islam.museum`, which the review flow uses ([deploy-uat.yml:11-13](../../.github/workflows/deploy-uat.yml), [06-deployment.md:201-202](06-deployment.md)). The one pattern of the founder's that depends on identity, not on age, is "deploy the same `build_run_id` to UAT then production", which survives because it relies on the GitHub artifact. Worker Previews would not change anything today; they would be an option only if per-PR review of Worker code ever started.

**3.8 Live figures, answered by the founder from the dashboard on 23 Nov 2026 (read-only).**
- Pages `islam-museum`: **19,933 deployments**, oldest 18 Oct, current production 22 Nov; about 3,500 (estimate 3,300 to 3,700) older than 30 days. The workflows account for only a few dozen, so the rest are almost certainly Git-integration previews of branches and pull requests (about 550 a day). **Confirmed the same day (3.9):** Git integration is on. On 8 December all of them beyond the newest 100 and the current production deployment go; their preview URLs stop working. Nothing in the repo links to one (3.4).
- Worker `islam-museum-site`: 36 versions, 7 older than 24 Oct; all kept (under 100). UAT Worker 12 versions, UAT Pages 9 deployments, none older than 30 days; test Worker 2 versions; the 21 sync Workers were not counted.
- Logs: Workers Logs is set at Worker (Production) level, 100% sampling, not tied to a version; Web Analytics is per hostname and off for islam.museum. Neither is affected (answers Q4).
- Effect on 3.1: the Pages arithmetic there is wrong for Pages (one per deploy); the Worker arithmetic stands, and the Worker's 36 versions are consistent with it. Pages rollback targets are the newest 100 deployments, mostly previews, so the Pages rollback is worth even less than stated.

**3.9 Pages Git integration is on (founder's dashboard check, 23 Nov 2026, read-only).**
- The 30 newest deployments of `islam-museum` are all from 23 Nov and all come from GitHub commits (no Direct Uploads): **10 Production (branch `main`) and 20 Preview** (branches such as `nuzul-browser`, `harvest/…`, `feat/gap-retry3-doc`, and this task's own `claude/cloudflare-version-retention-01ba93`). Settings: GitHub repo `amado2k5/islam-museum` connected, production branch `main`, automatic deployments on, preview branch "All non-Production branches".
- So the ~550 a day are Pages building every pushed branch and every push to `main` itself, **in addition to** the manual `pages deploy` of `deploy-env.yml:341`. The 20-to-10 split fits agents pushing branches and merging pull requests all day.
- **Two things to decide, both the founder's and both outside this task:** (1) Previews are what 8 December deletes; their URLs stop working and nothing in the repo links to one. (2) Production deployments also come from every push to `main`, which sits oddly with the rule that a push to `main` publishes nothing ([AGENTS.md](../../AGENTS.md), "Deployment is manual"). What that Git build runs, and whether its output is what serves islam.museum or is overwritten by the manual deploy, cannot be read from the repo: the build command and output directory are dashboard settings (the root `wrangler.toml` names only `dist`). It also spends Pages build minutes (the architecture note lists a 500 builds a month limit, [03-architecture.md:12](../plan/03-architecture.md), a figure from 2026-10 that was not re-checked).
- UAT `islam-museum-uat`: 9 deployments, all Production on `main`, no GitHub repo connected (they arrive as direct uploads that carry commit metadata). Unaffected.
- Rollback consequence: the newest 100 Pages deployments are a mix of previews and git-triggered production builds, roughly one every 3 minutes at today's pace, so the 100-deployment window covers hours, not days. Pages rollback is therefore no real rollback path.

**3.7 Everything else (check 6).**
- Build caching: GitHub Actions artifacts only; nothing is cached in Cloudflare. Unaffected.
- Deployment hooks and cron: none in the repo (no `triggers`, no scheduled Cloudflare Workers). Unaffected.
- Environment variables and secrets: `[vars]` (`HOST_REWRITES`, `ROBOTS`) are in the wrangler config and re-applied by each deploy; `SYNC_TOKEN` is re-set by every deploy. Both live with the current version, so nothing depends on an old version. Unaffected.
- Workers Caching: `cross_version_cache = false` ([wrangler.production.toml:22](../../workers/site/wrangler.production.toml)), so the cache does not span versions; version deletion cannot expose old cache entries. Unaffected.
- Analytics and Workers Logs: tied to the Worker, not to a version. Unaffected (the documentation does not describe the Cloudflare side; Q4).
- Custom domains and routes: attach to the Worker, not to a version. Unaffected.

## 4. Recommended actions

**(a) Before 8 December 2026**

| # | Action | Effort | Changes deploy behaviour? |
|---|---|---|---|
| a1 | Answer Q1 to Q3 below from the Cloudflare dashboard so that this note's arithmetic is checked against the real counts. | 10 minutes of the founder's time | No |
| a2 | Correct the rollback sentence in [06-deployment.md:128](06-deployment.md) (and the three echoes in 3.2) to say: Worker or Pages rollback reverts code and assets only, content is in R2; the real rollback is redeploying a kept `build_run_id` (five newest builds, 14 days) or rebuilding the commit. Fix the stale header of [wrangler.production.toml:1-4](../../workers/site/wrangler.production.toml). | 20 minutes, docs and a comment | No (a comment edit changes no deploy behaviour; wrangler files are not in `tools/deploy/shell-paths.list`) |
| a3 | If any old deployment or version is wanted as a known-good reference (the founder's choice, not one this repo can judge), note its commit before 8 December; after that date its Cloudflare copy is gone but git still has the commit. | minutes | No |

**(b) Habits worth adopting at each deploy** (each changes the workflows, so each **needs the founder's approval before it is enacted**)

| # | Action | Effort | Changes deploy behaviour? |
|---|---|---|---|
| b1 | Add Cloudflare's Worker `version_id` (from `wrangler deploy` output) and the Pages deployment ID to the "Record what was deployed" summary ([deploy-env.yml:358-368](../../.github/workflows/deploy-env.yml)) and to `api/v1/meta/deploy.json`, which already carries commit, build run and time ([deploy-env.yml:253](../../.github/workflows/deploy-env.yml)). | Small, about 20 lines of YAML | Yes (a workflow change; the new fields also change one published file per deploy) |
| b2 | Tag each production deploy in git (for example `deploy-YYYYMMDD-N` pointing at the built commit) so that "the last build before the bad change" is a name, not a search. | Small | Yes (adds a push of a tag from the deploy workflow, which needs a write permission the deploy job lacks, [deploy-env.yml:56-60](../../.github/workflows/deploy-env.yml)); doing it by hand after each deploy needs no change |
| b3 | When a rollback target must outlive five builds or 14 days, deliberately keep it: re-run the build on that commit, or download the `dist-tar` artifact. | Minutes per case | No |
| b4 | Optional: stop `wrangler secret put` on every deploy (the secret changes rarely), which would halve the sync Workers' version churn. Not necessary for retention. | Small | Yes |

**(c) Verified safe, no action**

- Running traffic: unaffected by the notice.
- R2 objects, bucket policy, manifest: unaffected (3.5).
- URLs: no Version URLs, preview aliases or per-deployment Pages URLs anywhere in the repo (3.4).
- Preview and PR flow: none on Cloudflare (3.6).
- KV, D1, Queues, Durable Objects, cron: not used.
- Secrets and vars, Workers Caching, domains: re-applied by every deploy or tied to the Worker, not to a version (3.7).
- Test Workers (`islam-museum-site-test`, `…-r2-sync-test[-N]`): script addresses, stable.

## 5. Questions the repo cannot answer (for the founder)

- **Q1 (answered, 3.8).** How many versions and Pages deployments exist today for `islam-museum-site`, `islam-museum` (and the UAT pair), and how many are older than 30 days? The dashboard shows it.
- **Q2.** Which runs does the founder start: `deploy.yml` (one job) or `deploy-all-parts.yml`? This decides how fast the sync Workers' 100 versions are used up (3.1).
- **Q3.** Has any message, ticket, outreach email or partner been given a `*.pages.dev` deployment link or a Worker Version URL? The repo has none; elsewhere cannot be checked.
- **Q4 (answered, 3.8: no).** Does the Cloudflare analytics or Logs setup in the dashboard (not described in the repo) rely on a version URL or a version-bound setting? The repo suggests not.
- **Q6 (answered, 3.9).** Git integration is on, previews for all non-production branches.
- **Q7.** Do you want Git-triggered Pages builds (previews and `main`) to continue? Options: leave as is; set preview branches to none or a list; or disconnect Git so only `deploy-env.yml` deploys. Each is a dashboard change and yours. Also: what are the Git build's command and output directory, and does it overwrite what the manual deploy published?
- **Q5.** Is the "secret put makes a new version" behaviour (assumed here from Cloudflare's general model) right for the account? It only affects the sync Workers' counts.

## 6. Sources used

Files cited above; live figures from the founder's brief for this task (87,800 entries, 448,365 record pages) were not needed for the argument. No count of real deployments could be taken from the repository: the repo keeps no deployment history, and GitHub's run list was not queried (no network and no deploy action taken).
