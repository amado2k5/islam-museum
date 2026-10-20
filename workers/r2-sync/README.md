# R2 sync Worker

How the built search indexes and API JSON get from the build into the R2 buckets, how the Worker applies them, and how to test it. Read `docs/plan/03-architecture.md` §4 and §6 for where this sits in the build; this file is the detail.

## What it does

The site's search indexes (`pagefind-ar`, `pagefind-en`, `pagefind-ur`) and API JSON (`api`) are served from R2, not from Cloudflare Pages, to stay under the Pages file limit. The build uploads them to R2 through this Worker. Only files whose SHA-256 changed since the last publish are sent.

Pieces:

| Piece | Where | Role |
|---|---|---|
| Publisher | `batch/publish.mjs` | Builds the desired file list from `dist/`, diffs it against the last manifest, packs the changes into archives, uploads each archive to `_staging/`, and asks the Worker to apply it. Writes the new manifest only after every archive succeeds. |
| Packer | `batch/pack.mjs` | Splits operations into zip archives: at most 250 operations and 20 MB each. |
| Worker | `src/index.js` | `POST /process` reads one archive, checks each operation, applies them (COPY 6 at a time, MOVE/DELETE one by one), writes progress to `_r2-sync/status.json`, and deletes the archive only if every operation succeeded. `GET /status` returns the progress file. |
| Config | `wrangler.production.toml`, `wrangler.toml` | Production Worker (`islam-museum-r2-sync`, bucket `islam-museum-search`) and test Worker (`islam-museum-r2-sync-test`, bucket `islam-museum-sync-test`). Both allow writes only under their own prefixes (`ALLOWED_PREFIXES`). `limits.cpu_ms` is 300000 (paid-plan maximum). Observability is on in the production config. |

Worker limits that shape the design (Cloudflare docs, checked 19 Oct 2026): no wall-clock limit for HTTP Workers, 10,000 subrequests per request on the paid plan, six simultaneous open connections per invocation, 128 MB memory per isolate.

## Production flow (every push to `main`)

1. `deploy.yml` builds the site and `dist/`.
2. The job runs `node workers/r2-sync/batch/publish.mjs --dist dist`. It first deploys the production Worker and sets its token from `R2_SYNC_TOKEN`.
3. `publish.mjs` reads `_r2-sync/manifest.json` from the bucket, diffs it against `dist/`, and packs the changes.
4. For each archive: upload to `_staging/` with the S3 API, then `POST /process` to the Worker.
5. After all archives succeed, the manifest is written and `_staging/` is cleared.

Runs are queued, not overlapping: the workflow's `concurrency: group: pages` with `cancel-in-progress: false` keeps every waiting run.

### Known problem (open at the time of writing)

The first publish is about 73,000 files. Publishes of 19 Oct 2026 were cut off after about 4.5 to 5 minutes with `ECONNRESET`, even though the Worker has no wall-clock limit. Archive size was reduced to 250 operations and writes were made parallel (six at a time) to shorten each request. Whether that is enough is still being tested (see the test flow below). The cause of the drops isn't confirmed.

## Secrets and variables

| Name | Type | Used by |
|---|---|---|
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | Secret | `wrangler deploy` and the S3 endpoint |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | Secret | Production publish: S3 writes to `islam-museum-search`. Must not be used for the test. |
| `R2_SYNC_TOKEN` | Secret | Production Worker bearer token. The deploy step copies it into the Worker as `SYNC_TOKEN`, so the GitHub value is the source of truth. |
| `R2_SYNC_TEST_TOKEN`, `R2_SYNC_TEST_URL` | Secret | Test Worker bearer token and URL |
| `R2_SYNC_TEST_ACCESS_KEY_ID`, `R2_SYNC_TEST_SECRET_ACCESS_KEY` | Secret | Test S3 writes to `islam-museum-sync-test` only |

To change a Worker token: set the new value in GitHub (`R2_SYNC_TOKEN` for production, `R2_SYNC_TEST_TOKEN` for the test Workers), then run a deploy, or run `npx wrangler secret put SYNC_TOKEN -c wrangler.production.toml` from this folder. Both must hold the same value or every request returns 401.

Never paste a token or key into chat, issues or commit messages. `gh secret list` shows names and dates only; values can't be read back.

## Test flow (manual, never production)

Workflow: `.github/workflows/r2-sync-parallel-test.yml`, "R2 sync parallel test (manual)".

1. Go to Actions → **R2 sync parallel test (manual)** → **Run workflow**.
2. Set **Use workflow from** to `main`.
3. Inputs: `deploy_worker` (on: deploys the original test Worker from the chosen branch and sets its token), `files` (`all` for every file in `test/sizes.txt`, or a count), `parallel` (archives posted at once; default 6).
4. The job runs the in-memory archive test (`test/archive-test.mjs`), then `test/parallel-test.mjs`.

What `parallel-test.mjs` does:

- Builds one small file per line of `test/sizes.txt` (97,160 real sizes from a local build, 317 MB in total), packs them into archives, and stages each one in `_staging/` on the test bucket.
- Posts the archives to the seven test Workers round-robin (`SYNC_URLS`): `islam-museum-r2-sync-test` and `islam-museum-r2-sync-test-2` to `-7`. Up to `parallel` requests are in flight at once.
- Retries an archive up to three times after a reset or a non-200 response, with a 5-second pause. Logs every attempt with its Worker, time and error.
- Checks: every archive answered 200, no failed operations, the copy count equals the file count, peak concurrency, file count in the bucket, sampled file contents, `GET /status`, and that no staging archive from this run remains. It then deletes its own test files.

Only the original test Worker is deployed by the workflow. The other six were deployed by hand from the same Worker code. If the Worker code changes, redeploy all seven.

### Watching a test run

- Live logs: `npx wrangler tail islam-museum-r2-sync-test` (or any of the others). It shows only requests received while it is connected, and it expires after six hours.
- Stored logs: Cloudflare dashboard → Workers & Pages → the Worker → Logs. Logs are on for the test Worker. How long they are kept depends on the plan.
- Progress of the last archive: `curl -H "authorization: Bearer <token>" <worker URL>/status`.

### Cleaning up the test bucket

Each run deletes its own test files, but a run that fails part way leaves them behind. Delete `_sync-test/` and `_staging/` in `islam-museum-sync-test` before a long run, because R2 storage is limited to 10 GB on this account. Do this only when no test run is in progress. Check the bucket name before deleting anything. Never run the delete against `islam-museum-search`.

## Deploying a new Worker from this code

Use a clean checkout of `main`:

```bash
cd <checkout>
git checkout main
git pull --ff-only origin main
cd workers/r2-sync
npm ci
npx wrangler deploy -c wrangler.toml --name <worker-name>
npx wrangler secret put SYNC_TOKEN --name <worker-name>
```

Wrangler must be logged in to the account (`npx wrangler login`). The token prompt doesn't show what you type. Use the same token as the other Workers in that group.

## Files

- `src/index.js`: Worker (`/process`, `/status`, COPY concurrency)
- `batch/publish.mjs`: publisher used by `deploy.yml`
- `batch/pack.mjs`: archive packer (250 operations, 20 MB)
- `test/archive-test.mjs`: in-memory archive test
- `test/parallel-test.mjs`: parallel upload test against the test Workers
- `test/sizes.txt`: real file sizes for the parallel test
- `wrangler.toml`, `wrangler.production.toml`: Worker configs
