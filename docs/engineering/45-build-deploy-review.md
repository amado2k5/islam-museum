# 45 · Build and deploy review (November 2026)

A review of the technology stack, the CI, the build and the deployment to Cloudflare, done on 12 and 13 November 2026 at
the founder's request; what it measured, what was changed, the platform limits it was checked against, and what is left
open. Companion to [16 · Deploy churn proposal](16-deploy-churn-proposal.md), which covers *how much* a deploy uploads;
this document covers *how fast* the build and the deploy run.

Changes landed in pull request 6343 (trial on `release/uat`) and pull request 6496 (`main`). Decision record:
`docs/decisions/records/dec-20261113-269.yaml`.

## 1. Summary

- The build had grown to about three and a half hours and was heading for GitHub's six-hour job limit. Almost all of it
  was the entity page template, which did two expensive lookups on every page. With both prepared once, page rendering
  fell from 3 h 6 min to 43 min, and the pages are byte for byte the same.
- A full publish to R2 took about two hours because the publisher's staging upload blocked every other upload. With a
  non-blocking upload it took 42 minutes for a larger publish.
- The build artifact is one compressed file instead of 456,000 files, and the deploy no longer copies the whole build.
- Hosting, the manifest diff, the UAT and production split and the Worker routing were reviewed and left as they are.
  The page count rules out both Cloudflare Pages and Workers static assets for the HTML (section 5), so R2 stays.
- Section 7 lists what was found and not changed. The largest items are the CI flow (a pull request waits an hour or
  more for a result, and many run at once) and the churn of doc 16.

## 2. Measurements

Production ran the old code and UAT the new code on the same content one day apart, so the runs compare directly.

| | Production, old code | UAT, new code |
|---|---|---|
| Build run | 43290221939 (commit `eeb962b73`) | 43300358009 (commit `8e55622e8`) |
| Entities, edges, pages | 58,128 · 147,712 · 202,253 | the same |
| Page rendering (Astro) | 11,157 s (3 h 6 min) | 2,569 s (43 min) |
| Entity template, per page | 53 ms (run 42911617876) | 7.5 ms (run 43300301847) |
| Artifact | 456,579 files, 6.7 GB, upload 24 min | one file, 1.15 GB, pack 139 s, upload under 15 s |
| Whole build run | about 3 h 34 min (run 42911617876) | 1 h 22 min |
| Deploy run | 43330494209 | 43334841849 |
| Deploy job | 3 h 13 min | 47 min |
| R2 publish | 5,938 s, 307,693 operations, 678 retries, 1 failed operation (retried) | 2,514 s, 441,087 operations, 13 retries, 0 failed |
| Assets-only folder | 363 s (copy 19 GB, delete most) | 16 s (copy 95 files) |
| Strip step before Pages | 69 s | removed (Pages deploys the assets-only folder) |

Rendering time varies between runners: the same code rendered in 27 minutes in run 43300301847 and in 43 minutes in run
43300358009.

Where a build's time went before the change (run 42911617876, 11 November):

| Step | Time |
|---|---|
| validate, graph, derive, api, daily | 8 min |
| Astro page rendering, 180,245 pages | 2 h 41 min |
| Pagefind, three languages in sequence | 5.5 min |
| `check:site` and `check:static` | 12 min |
| Artifact upload | 24 min |

## 3. What was found and changed

### 3.1 Entity pages: two lookups repeated on every page

`site/src/lib/graph.ts` exported `edgesFrom(id)` as a scan of every edge (`graph.edges.filter(...)`), and `related(id)`
as a fresh read and parse of `.cache/derived/related.json`. An entity page calls `edgesFrom` about eight times (the
layout, `placesOf`, `connectionsOf`, `jsonLd`, `Extras.astro`, `JourneyPlayer.astro`) and `related` once. With 147,712
edges and a 7.6 MB related file, that cost 21.65 ms a page on a laptop and most of the 53 ms on a runner, and it grew
with pages × edges.

Now the edges are grouped by `from` once per build and the related lists are parsed once. `edgesFrom` still returns a
fresh array in the order of `graph.edges`, since callers sort it. Checked against the old implementation for all 60,000
ids (0 mismatches), and 400 pages sampled evenly from the production sitemap are byte-identical between production (old
code) and UAT (new code).

The lesson for new code: anything a page template calls must be an indexed lookup, never a scan of `nodes` or `edges` or
a file read. Build such an index once at module level (as `Extras.astro` does for `DEPICTS`).

### 3.2 R2 publish: a blocking upload made the parallel publish serial

`workers/r2-sync/batch/publish.mjs` runs up to 42 archive uploads "in parallel" (seven sync Workers, six each). Each one
first uploaded its zip to the staging prefix with `execFileSync("aws", ["s3", "cp", ...])`, which blocks Node's event
loop, so the archives went up one at a time: 1,763 archives in 7,172 s on 10 November, about four seconds each. The
upload now uses `spawn` (`runCommand`), and the 42 runners really overlap. The median time per archive fell from 96 s
(mostly waiting) to 19 s.

### 3.3 Sync Worker: one status key written by every invocation

Every invocation of the sync Worker wrote `_r2-sync/status.json` at the start, every 100 operations and at the end. R2
allows one write per second to a key and answers 429 above that, and a publish runs up to 42 invocations at once. The
writes were caught and ignored, so nothing failed, but the file could not be kept and each attempt was a billable Class A
request. `STATUS_FILE = "off"` in `workers/r2-sync/wrangler.production.toml` (both environments) skips it;
`processArchive` keeps the option for the tests and for a single-archive run.

### 3.4 Build artifact: one file

`build.yml` packs `dist/` with `tar` and `zstd -T0 -3` and uploads the tar as the artifact `dist-tar` with
`compression-level: 0`. `deploy-env.yml` downloads and unpacks it (204 s to unpack 456,579 files). It still accepts the
plain `dist` tree of builds made before 13 November, so the five rollback copies stayed deployable; those old artifacts
are no longer pruned by `keep-newest` and expire by their 14-day retention.

### 3.5 Deploy job: no copy of the whole build

The assets-only folder for the site Worker is built with one `rsync` exclude list instead of `cp -r dist` followed by
`rm -rf` lines, and Cloudflare Pages deploys that same folder, so the separate strip step is gone. The exclude list in
`deploy-env.yml` is now the one place (with `R2_DATA_DIRS`, the publish list and `run_worker_first`) where a new
R2-served folder is added. The job no longer needs room for two copies of a 19 GB tree; the runner's documented disk is
14 GB (section 5).

### 3.6 Smaller fixes in the same pull request

- `/ar`, `/en` and `/ur` without the trailing slash answered 404 on production and UAT: `route.js` redirects them, but
  `run_worker_first` only listed `/ar/*`, so the assets layer answered. The three paths are now listed.
- The workflows moved to checkout, setup-node and upload-artifact v7, download-artifact v8 and wrangler-action v4. The
  v4 and v3 versions target Node 20, which GitHub is retiring from its runners; the deploy of 13 November logged the
  deprecation warning and ran them on Node 24. Release notes were read for breaking changes; none applies to these workflows (no `pull_request_target`, no
  `registry-url`, downloads by name).
- `tour/halls.yaml`: three stops had fallen behind their records' sources, `scripts/tour.test.ts` failed on `main`, and a
  failed test job cancels the build run. See 7.1 for the wider point.

## 4. How it was verified on UAT

- Build logs of the two build runs compared line by line: the same counts for entities, edges, pages, the three search
  indexes, checked pages, weighed routes, e-books and files.
- Deploy logs compared: the same file count in each of the 22 publish groups, 95 asset files, 93 Pages files; the only
  step differences are the new unpack step, the removed strip step and the IndexNow job that never runs on UAT.
- 400 pages sampled from the sitemap, and the fixed files, fetched from both sites and compared by MD5: 409 of 416
  identical. The seven that differ are expected (the home page after later content commits, `robots.txt`, the feed and
  the three Pagefind entry files).
- 24,155 internal links from 36 seed pages checked on UAT: 318 broken, all in the Places and Ansab browsers and present
  on production too (fixed by pull request 6363, section 7.1).
- In a browser: the place map loads its 3,873 places and the year slider; the Connections explorer draws a neighbourhood
  from the UAT API; search returns results; the footer shows the version from the deploy stamp; no failed requests.

## 5. Platform limits the plan was checked against

Read from the vendors' documentation on 12 November 2026. Re-read before relying on a number: these pages change.

### Cloudflare

| Limit | Value | Source |
|---|---|---|
| Pages: files per site | 20,000 free, 100,000 paid; 25 MiB per file | developers.cloudflare.com/pages/platform/limits/ |
| Workers static assets: files per version | 20,000 free, 100,000 paid; 25 MiB per file | developers.cloudflare.com/workers/platform/limits/ |
| Worker memory | 128 MB per isolate | same |
| Worker CPU time (paid) | 30 s by default, up to 5 min (`limits.cpu_ms`); no wall-clock limit on an HTTP request | same |
| Subrequests per request (paid) | 10,000 by default | same |
| Simultaneous open connections | 6 per invocation | same |
| Workers per account | 500 paid | same |
| Requests and CPU (paid) | 10 million requests and 30 million CPU ms a month included, then $0.30 and $0.02 per million | developers.cloudflare.com/workers/platform/pricing/ |
| Workers Cache (`[cache]` in wrangler) | a hit runs no Worker code, but every request is billed, static assets included; the Worker version is in the cache key unless `cross_version_cache = true`, so each deploy starts with an empty cache; Range requests are sliced from the cached full response | developers.cloudflare.com/workers/cache/ |
| Workers Logs (paid) | 20 million events a month included, then $0.60 per million; 256 KB of log data per request; pricing changes on 1 December 2026 | developers.cloudflare.com/workers/observability/logs/workers-logs/ |
| R2: writes to one key | 1 per second; 429 above that | developers.cloudflare.com/r2/platform/limits/ |
| R2: writes per bucket | no limit stated | same |
| R2: batch PUT, or unpacking an archive | not available; one write per object | developers.cloudflare.com/r2/api/s3/api/ |
| R2 price | storage $0.015 per GB-month; Class A $4.50 and Class B $0.36 per million; 10 GB, 1 million Class A and 10 million Class B free each month; deletes and egress free | developers.cloudflare.com/r2/pricing/ |
| R2 consistency | a write is visible to reads and lists at once | developers.cloudflare.com/r2/reference/consistency/ |

What follows from them:

- The site has 202,253 HTML pages and 456,579 files. Neither Pages nor Workers static assets can hold the pages, on any
  plan. The pages stay on R2, as decided on 28 October 2026.
- One write per file is unavoidable. A full rewrite is about 300,000 to 360,000 Class A operations, so three in a month
  use the free million; after that each costs about $1.40 to $1.60.
- The sync Worker's six parallel writes are at the connection cap, and it unzips each archive in memory, so 250 files per
  archive (about 25 MB) is about right; the larger subrequest limit does not justify bigger archives.
- `HTMLRewriter` streams and would run only on cache misses, so the narrowed Phase 2 of doc 16 (the Worker inlining the
  stylesheet) fits the limits. It still needs the founder's decision on ADR 0002.

### GitHub

| Limit | Value | Source |
|---|---|---|
| Standard runner, public repository | 4 vCPU, 16 GB RAM, 14 GB SSD; free and unlimited | docs.github.com/en/actions/reference/runners/github-hosted-runners |
| Job execution time | 6 hours, then the job is terminated | docs.github.com/en/actions/reference/limits |
| Concurrent jobs | 20 on Free, 40 on Pro, 60 on Team | same |
| `concurrency.queue: max` | up to 100 pending runs per group; further ones are cancelled | docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax |
| Matrix | 256 jobs per run | same |
| Artifacts | retention up to 90 days; size and file-count limits not stated | github.com/actions/upload-artifact |
| Cache | 10 GB per repository by default, entries unused for 7 days removed | docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching |
| `GITHUB_TOKEN` | 1,000 REST requests an hour per repository | docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api |
| GitHub Pages | published site at most 1 GB; a deployment times out after 10 minutes | docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits |
| Node 20 actions | Node 24 by default from 16 June 2026; Node 20 scheduled for removal from runners on 23 September 2026 | github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/ |

What follows from them:

- A build near six hours fails outright. Build time must be watched as the graph grows (section 8).
- The runner's documented disk is smaller than one copy of the build. It works on undocumented headroom, so nothing in a
  workflow should make a second copy of `dist/`.
- **The GitHub Pages fallback mirror did not exist as documented.** The site is about 19 GB and no workflow step publishes
  it; GitHub Pages allows 1 GB. `06-deployment.md`, `02-architecture.md` and `09-cost-analysis.md` named it as the
  fallback for a Cloudflare outage. The founder decided on 13 November 2026 to accept the risk; the decision, the three
  options and the conditions for revisiting it are in `06-deployment.md` §5a.

## 6. What was reviewed and left alone

- **Static site, no runtime compute.** Astro, Pagefind per language, the static API. Sound.
- **Hosting split.** Code in the Worker's assets and on Pages, everything else on R2, served by the site Worker with
  Workers Cache in front. Correct given the file limits.
- **Manifest diff.** Only changed files are sent, with resume and reconcile. Not the cause of slow deploys.
- **UAT and production from one build.** One artifact, one procedure, guarded names. Sound, and it is what made this trial
  safe.
- **Deploys by the founder only.** Unchanged.

## 7. Open: found and not changed

Each of these needs its own proposal (`docs/ai-change-gates.md` section 1).

**Update, 13 November 2026:** 7.1, 7.2 and 7.3 were proposed, approved by the founder and implemented the same day:
[46 · CI flow proposal](46-ci-flow-proposal.md) has the changes and the measured result. The required status check of
7.1 stays a question for the founder.

### 7.1 CI gives its answer late, and `main` breaks silently

- A pull request's Validate run does the full build. Before this change that was three hours, and agents merge without
  waiting, so the result arrived after the merge. Of the 500 most recent runs on 12 November, none had succeeded: 344 were
  cancelled and 153 had failed.
- Failures surface at the end. On 12 November three builds of `main` died on page-weight budgets and a U+FFFD character
  after about three hours each; 772 pages of broken links in the Places and Ansab browsers went unseen because no run
  reached the link check; on 13 November a data change broke `scripts/tour.test.ts` and every build of `main` was
  cancelled for hours.
- Suggested: check U+FFFD on the source files in `npm run validate` (seconds); give pull requests a sample build (the 46
  weighed routes plus the changed entities) and keep the full build for `main`; make the fast job (`validate` and unit
  tests, about ten minutes) a required check so a red `main` cannot be merged into.

### 7.2 Runner slots

On 13 November a UAT deploy waited 2 h 40 min for a runner: 28 build jobs were running, 27 of them Validate runs for
agent branches, and 78 more were queued. The sample build of 7.1 is the cure. Until then, Validate runs of pull requests
that are already merged can be cancelled safely.

### 7.3 Build queue on `main`

`build.yml` queues a full build for every push (`queue: max`); 238 runs were cancelled by hand on 12 November. Suggested:
keep the queue for builds started by hand, and let pushes keep only the newest waiting run (two concurrency groups).

### 7.4 Remaining time in the build

- Rendering is still 43 minutes. The next costs, from run 43300301847: `[lang]/[hall]/index.astro` at about 20 s a page
  (27 pages), `embed/fact/index.astro` at 21 s a page, `references/index.astro` at 5 s a page, and the entity template at
  7.5 ms × 180,000 pages. A CPU profile of a few thousand pages would show what is left in the entity template.
- Pagefind's three indexes run one after another (5.5 min); the runner has four cores.
- `check:site`, `check:static` and the link check each read all the HTML (22 minutes together on a pull request); one
  pass, or worker threads, would do.
- The Playwright browser is downloaded on every Validate run.

### 7.5 Deploy and hosting

- **Churn (doc 16).** A deploy still rewrites 99 % of the pages on most days, which is what makes a publish 42 minutes
  instead of a few. Phase 2 narrowed awaits the founder.
- **A direct S3 uploader** (for example `rclone` with high concurrency) may beat the zip-and-Worker route now that R2
  documents no per-bucket write limit. Needs a benchmark on UAT.
- **Per-file log lines.** The sync Worker logs one line per file with Workers Logs on: several hundred thousand events
  per full publish, and the price changes on 1 December 2026.
- **404s** cost two uncached R2 reads each (`no-store`). A short cache would blunt crawler scans, at the price of a new
  page answering 404 for that long after a publish.
- **Fallback for a Cloudflare outage:** decided on 13 November 2026 (accept the risk, no live mirror). Open only as a
  standing item to revisit: `06-deployment.md` §5a lists the options and the triggers. One check is still owed there:
  that the domain can be moved off Cloudflare without access to the Cloudflare account.
- **Is the Pages deployment still needed?** The site Worker serves the domain from its own assets; the Pages project
  receives the same 93 files. Not investigated.

## 8. How to measure again

```bash
# Step timings of a run
gh run view <run-id> --json jobs --jq '.jobs[]|.name, (.steps[]|"\(((.completedAt|fromdate)-(.startedAt|fromdate)))s \(.name)")'

# Render time per page template, from a build log
gh run view <build-run-id> --log | grep -P '^build\t' | cut -f3 | perl -pe 's/\x1b\[[0-9;]*m//g' > build.txt
awk '/▶ src\/pages/{cur=$NF} match($0,/\(\+[0-9.]+(ms|s)\)/){t=substr($0,RSTART+2,RLENGTH-3); v=(t~/ms$/)?t+0:(t+0)*1000; ms[cur]+=v; n[cur]++}
     END{for(k in ms) printf "%8.0fs %7d pages %7.1fms/pg %s\n", ms[k]/1000, n[k], ms[k]/n[k], k}' build.txt | sort -rn | head

# Publish: operations, retries, failed operations, time per archive
gh run view <deploy-run-id> --log | cut -f3 > deploy.log
grep -E "files in dist,|HTML pages re-uploaded" deploy.log; grep -c "retrying in" deploy.log
grep -oE "zip via [^ ]+ in [0-9]+ ms" deploy.log | awk '{print $5}' | sort -n | awk '{a[NR]=$1} END{print NR, a[int(NR/2)], a[int(NR*0.9)]}'
```

Watch three numbers as the graph grows: milliseconds per entity page (7.5 on 13 November), the whole build run (1 h 22
min) against the six-hour limit, and operations per second in a full publish (175).
