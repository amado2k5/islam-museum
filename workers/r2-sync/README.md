# R2 sync Workers

How the built search indexes and API JSON get from the build into the R2 buckets, how the Workers apply them, and how to test them. `docs/plan/03-architecture.md` §4 and §6 cover where this sits in the build. This file is the detail.

## What it does

The site's search indexes (`pagefind-ar`, `pagefind-en`, `pagefind-ur`) and API JSON (`api`) are served from R2, not from Cloudflare Pages, to stay under the Pages file limit. The build uploads them through Worker copies. Only files whose SHA-256 changed since the last publish are sent.

| Piece | Where | Role |
|---|---|---|
| Publisher | `batch/publish.mjs` | Builds the desired file list from `dist/`, diffs it against the manifest in the bucket, packs the changes into archives, uploads each archive to `_staging/` (retried on S3 errors), and posts it to a Worker. Writes the manifest after every batch, so a failed run resumes from the failed batch; before a large publish it also lists the bucket and skips files whose ETag already matches the build. |
| Packer | `batch/pack.mjs` | Splits operations into archives of at most 250 operations and 20 MB. Archives are stored without compression (`level: 0`). |
| Worker | `src/index.js` | `POST /process` reads one archive, checks each operation, and applies them. COPY runs six at a time; MOVE, DELETE and unknown operations run one at a time, in order. Writes progress to `_r2-sync/status.json`, and deletes the archive only if every operation succeeded. `GET /status` returns that file. |
| Config | `wrangler.toml` (test), `wrangler.production.toml` (production) | Bucket binding, `ALLOWED_PREFIXES`, `ALLOW_ROOT_FILES` (production only: lets the bucket-root data files in `ROOT_FILES` through), `limits.cpu_ms = 300000` (paid-plan maximum). Observability is on in the production config. |

Worker limits behind the design (Cloudflare docs): no wall-clock limit for HTTP Workers; 10,000 subrequests per request on the paid plan; six simultaneous open connections per invocation; 128 MB memory per isolate.

## Production

### Workers

Production is meant to run **seven identical Workers** on `islam-museum-search`: `islam-museum-r2-sync` and `islam-museum-r2-sync-2` to `-7`. They share one token, `R2_SYNC_TOKEN`.

- Every deploy (`deploy.yml`) deploys all seven and sets each token, and publish spreads archives across their URLs (`SYNC_URLS`).

### Publish flow (every deploy, started by the founder)

Since 21 October 2026 building and deploying are two workflows. `build.yml` ("Build islam.museum") runs on every push to `main` and keeps `dist/` as the artifact `dist` and deletes the older ones, so only the newest successful build is deployable. `deploy.yml` ("Deploy islam.museum to Cloudflare") runs only when the founder starts it and never builds: its input `build_run_id` picks the build run whose artifact to deploy (empty: the latest successful build of `main`). The same build can be deployed again while its artifact exists; a redeploy sends nothing to R2, because the manifest already matches the build.

1. `deploy.yml` downloads the `dist` artifact of the chosen build and checks out that build's commit, so the Worker code and `publish.mjs` match the build.
2. The Worker deploy step deploys the Worker copies and sets their token from `R2_SYNC_TOKEN`. It collects their URLs.
3. `publish.mjs` reads `_r2-sync/manifest.json` from the bucket and diffs it against `dist/`. It packs the changes.
4. Each archive is uploaded to `_staging/` with the S3 API, then posted to a Worker. Archives go to the Workers in turn, `PARALLEL` at a time.
5. After each batch of archives succeeds, the manifest is written (`partial: true` until the last batch; `commit` is the built commit, not the deploy run's head). `_staging/` is cleared only after the whole publish succeeds, never before a resume; the clear also aborts incomplete multipart uploads under `_staging/` (a staging upload that died part-way leaves one behind, invisible to `s3 rm` and billed until aborted).

Deploys don't overlap: `deploy.yml`'s `concurrency: group: pages` with `cancel-in-progress: false` queues every waiting run.

`PARALLEL` defaults to six per Worker (six concurrent requests each, matching the connection limit). With one Worker that's six at a time; with seven, 42.

### One-time seed (before the first publish with the manifest)

Without a manifest, `publish.mjs` now fails instead of uploading everything. The bucket already holds the files from before the Worker sync, so the first run needs `--seed`:

- `--seed` lists the bucket and compares each object's ETag (its MD5 for single-part uploads) with the local file. Matching files are recorded as published. Changed or missing files are uploaded, and stored objects not in the build are deleted. It then writes the manifest.
- Run it once by adding `--seed` to the publish command in `deploy.yml`, for one deploy. Check the log's "already match the build" count is close to the file count. After that, remove `--seed`.

### Known problem (open)

Publishes of 19 Oct 2026 were cut off after about 4.5 to 5 minutes with `ECONNRESET`, although the Worker has no wall-clock limit. Changes since then: 250 operations per archive, six parallel writes per Worker, and seven Workers. The cause isn't confirmed.

## Secrets and variables

| Name | Type | Used by |
|---|---|---|
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | Secret | `wrangler deploy` and the S3 endpoint |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | Secret | Production publish: S3 writes to `islam-museum-search`. Not used by the test. |
| `R2_SYNC_TOKEN` | Secret | Production Workers' bearer token. The deploy step copies it into each Worker as `SYNC_TOKEN`, so the GitHub value is the source of truth. |
| `R2_SYNC_TEST_TOKEN`, `R2_SYNC_TEST_URL` | Secret | Test Workers' bearer token and the original test Worker's URL |
| `R2_SYNC_TEST_ACCESS_KEY_ID`, `R2_SYNC_TEST_SECRET_ACCESS_KEY` | Secret | Test S3 writes to `islam-museum-sync-test` only |

All Workers in a group must hold the same token. Otherwise each request returns `401`.

To rotate a token, generate a value once and set it everywhere in the same session, so it is never printed:

```bash
T=$(openssl rand -hex 32) && printf '%s' "$T" | gh secret set R2_SYNC_TOKEN --repo amado2k5/islam-museum
```

Then set `SYNC_TOKEN` on each Worker in the group with `npx wrangler secret put SYNC_TOKEN --name <name>`, piping `$T` in, and unset `T`. Use `R2_SYNC_TEST_TOKEN` for the test group.

Never paste a token or key into chat, issues or commit messages. `gh secret list` shows names and dates only.

## Test flow (manual, never production)

Workflow: `.github/workflows/r2-sync-parallel-test.yml`, "R2 sync parallel test (manual)". It writes only to `islam-museum-sync-test`.

1. Actions → **R2 sync parallel test (manual)** → **Run workflow**.
2. **Use workflow from:** `main`.
3. Inputs:
   - `deploy_worker`: on, to deploy the original test Worker from the chosen branch and set its token.
   - `files`: `all` (every line of `test/sizes.txt`, 97,160 real sizes, 317 MB) or a count.
   - `parallel`: archives in flight at once, default **42** (seven Workers × six).
4. The job runs `test/archive-test.mjs` (in-memory), then `test/parallel-test.mjs`.

What `parallel-test.mjs` does:

- Builds one file per size in `test/sizes.txt`, packs them into archives of up to 250 operations, and stages each in `_staging/` on the test bucket. It logs each archive as it stages.
- Posts the archives round-robin to the seven test Workers (`SYNC_URLS`: `islam-museum-r2-sync-test` and `-2` to `-7`). It logs each request with its Worker host, time and result.
- Retries an archive up to three times after a reset or a non-200 response, with a 5-second pause. A failure is recorded; the run keeps going.
- Checks every archive answered 200, no operation failed, copies equal the file count, peak concurrency, bucket file count, sampled contents, `GET /status`, and that no staging archive from this run remains. It then deletes its own test files.

Only the original test Worker is deployed by the workflow. The other six were deployed by hand from the same code. When the Worker code changes, redeploy all seven.

### Before a test run

- Empty `_sync-test/` and `_staging/` in `islam-museum-sync-test`. Failed or cancelled runs leave files behind. Deletes are free. Don't do this while another run is active.
- Make sure no earlier run is still in progress.

### Cancelling a run

Cancelling stops the runner; it doesn't clean up. Archives already staged stay in the bucket, and requests already sent to a Worker may still finish. The test doesn't resume, so the next run starts again with new file names. Empty the test prefixes before the next run.

### Watching a run

- Live: `npx wrangler tail islam-museum-r2-sync-test` (or any test Worker). Shows only requests received while it's connected; the tail expires after six hours.
- Stored: Cloudflare dashboard → Workers & Pages → the Worker → Logs.
- Progress of the last archive: `curl -H "authorization: Bearer <token>" <worker URL>/status`.

## Costs (R2 pricing, checked 20 Oct 2026)

- **Class A** (writes and lists): $4.50 per million. Each archive upload is one. Each file the Worker writes is one, so a file costs the same whether it's uploaded directly or inside an archive.
- **Class B** (reads): $0.36 per million.
- **Deletes are free.** Overwriting a file is a normal write and is charged as one.
- **Storage:** $0.015 per GB-month. Free tier each month: 10 GB storage, 1 million Class A and 10 million Class B.
- Egress is free.

A full test run is about 97,000 Class A requests. A first production publish is about 73,000. Repeated full runs in one month will use up the free million.

## Deploying a new Worker from this code

Use a clean checkout of `main`:

```bash
cd <checkout>
git checkout main
git pull --ff-only origin main
cd workers/r2-sync
npm ci
npx wrangler deploy -c wrangler.toml --name <worker-name>
```

Then set its token with `npx wrangler secret put SYNC_TOKEN --name <worker-name>`, using the token of its group. Wrangler must be logged in (`npx wrangler login`). The prompt doesn't show what you type.

## Files

- `src/index.js`: the Worker (`/process`, `/status`, COPY concurrency)
- `batch/publish.mjs`: the publisher used by `deploy.yml` (`--seed` for the one-time bootstrap)
- `batch/pack.mjs`: archive packer (250 operations, 20 MB, stored)
- `test/archive-test.mjs`: in-memory archive test
- `test/parallel-test.mjs`: parallel upload test against the test Workers
- `test/sizes.txt`: real file sizes for the parallel test
- `wrangler.toml`, `wrangler.production.toml`: Worker configs
