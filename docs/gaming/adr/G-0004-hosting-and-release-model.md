# G-0004: static, content-addressed game releases behind a pointer file

_25 November 2026. Status: **decided by the founder the same day and built; never yet run against Cloudflare.** The proposal below is kept as it was written. What he decided, and where what was built differs from the proposal, is in the next section. The runbook is [`../release-and-deploy.md`](../release-and-deploy.md)._

## Decided and built (25 November 2026, later the same day)

The founder settled the open points in chat, in five messages (quoted in the runbook): the games' test and build suite is completely separate from the website's; the website is built and deployed for the games only for pages, menus and landing pages; game files go to R2 under a `games/` folder, in production and in UAT, following the website's process, with whatever Workers that needs; the website's workflows must not build or deploy anything of the games; and the work may be merged to `main`.

| Point of the proposal | What was built |
|---|---|
| 1. Portal pages are museum pages | Unchanged, and not built yet. They will link to the games' address |
| 2. A separate release tree, files named by content hash, with a manifest | Built: `gaming/tools/build.ts` → `gaming/dist/release/`, `release.json` with every file's size and SHA-256; verified by `gaming/tools/check-release.mjs` |
| 2. `boot.js`, a loader the page includes | **Dropped.** A game is its own page at its own address, so nothing needs to be loaded into a museum page |
| 3. Release and rollback are a pointer change | Built: `games/channel.json` names the live release and the one before; `workers/games/publish.mjs` uploads a release once, reads it back, verifies it, then moves the pointer |
| 4. One new R2 folder, added to the website's four lists and served by the site Worker | **Changed.** The folder is `games/`, and it is in **none** of the website's lists: a second Worker of the games' own (`workers/games`) serves it at the games' own address (`games.islam.museum`, `uat-games.islam.museum`). The website's Worker, publish and deploy are not touched, which is what the founder asked for |
| 5. A separate workflow, and a manual publish workflow | Built as four files shaped like the website's: `games-build.yml`, `games-deploy-uat.yml`, `games-deploy.yml`, `games-deploy-env.yml` |
| 6. The museum build does not build games | Built, and held by tests on both sides |

The open questions, as they now stand:

- **Does the museum publish delete objects it did not write?** Read in `workers/r2-sync/batch/publish.mjs`: it lists, copies and deletes only under its own list of folders and root files, and `games/` is not among them. A test (`scripts/games-separation.test.ts`) fails if that changes. Still to be seen on UAT with real objects.
- **Cost.** Still unmeasured; see the runbook.
- **Cross-origin isolation.** Not needed by any game.
- **A separate origin.** Now true for the museum's own games: they run on their own address, so a game's script cannot reach the museum's pages or storage. Third-party and programmable content still needs a further, sandboxed origin before it is allowed at all (threat model).

A consequence worth stating: games on their own address keep their saved games there, not on `islam.museum`.

## The proposal as first written

### What the hosting is today (checked 25 November 2026)

- Cloudflare. HTML pages, search indexes, open data and media are objects in an R2 bucket, served by the site Worker (`workers/site`). Cloudflare Pages holds code only: `_astro/`, `vendor/`, `_headers`, `_redirects`. The Worker decides by path: the folders in `R2_DATA_DIRS` (`workers/site/src/route.js`) and every `/<lang>/` page come from R2.
- A deploy is the founder's manual step. `build.yml` builds every push to `main` and keeps `dist/` as an artifact; `deploy.yml` (production) and `deploy-uat.yml` (`uat.islam.museum`) publish a chosen artifact. The R2 publish sends only files whose bytes changed since the last publish, from a manifest in the bucket.
- Every response carries one content security policy (`site/public/_headers`): scripts, workers, styles, fonts and media from the museum's own origin only, `connect-src` limited to the origin and `api.islam.museum`, WebAssembly allowed, no cross-origin isolation headers.
- A new data or media folder needs four edits: `R2_DATA_DIRS`, the publish list in `workers/r2-sync/batch/publish.mjs`, `run_worker_first` in `workers/site/wrangler.production.toml`, and the exclude list in `deploy-env.yml`.

### Proposal

1. **Portal pages are museum pages.** `/[lang]/play/…` is built by the site build like any other page, in seven languages, with the shared header and footer. A play page ships no engine code: it holds the game's description, its requirements, its controls, a poster made from a real capture, and one small script tag.
2. **Game code and assets are a separate release tree**, built by `gaming/tools/build.ts` into `gaming/dist/play-rt/`:
   - `r/<game>/<release-id>/…`: every file named by the hash of its content, never changed after upload, cached for a year.
   - `r/<game>/<release-id>/manifest.json`: the files, their sizes and SHA-256 digests, the content and schema versions, the browsers and hardware the release was tested on.
   - `channels/<game>.json`: a few hundred bytes naming the live release id and the one before it. Cached for five minutes. This is the only file that changes when a game is released or rolled back.
   - `boot.js`: a small loader with a stable name (cached like `/shell/*`) that reads the channel file, checks the browser, and imports the game's entry module.
3. **Release and rollback are a pointer change.** Upload the new immutable tree and verify every digest; then write the channel file. Rollback writes the previous id back. A player who is mid-game keeps the release they started with, because every file they need is addressed by hash.
4. **One new R2 folder, `play-rt/`**, added to the four lists above in one pull request that the founder reviews. Game code goes to R2 with the game's assets and not to Pages: a release is hundreds of hashed files and tens of megabytes, Pages has a per-project file limit and a per-file size limit, and an R2 publish does not redeploy the site.
5. **A separate workflow, `gaming.yml`**, with path filters on `gaming/**`: type-check, unit tests, simulation lab, release build, and a dry run that prints the upload and deletion lists. It never touches the bucket. A second workflow that does publish `play-rt/` to UAT and production is manual and owner-only, like every other deploy workflow here.
6. **The museum build does not build games** and a game release does not rebuild pages. The two meet only at the channel file.

### Open questions for the founder (answered above)

- **Does the museum publish delete objects it did not write?** If the manifest diff in `publish.mjs` removes R2 objects that are not in `dist/`, a separate gaming publish would be deleted by the next museum deploy unless `play-rt/` is excluded there. This has to be read and tested on UAT before either workflow is trusted.
- **Storage and transfer cost.** No game assets exist yet, so there is nothing to price. Each game's release manifest will state its size, and the estimate goes to the founder before a first production upload. No new paid service is proposed.
- **Cross-origin isolation.** WebAssembly threads and `SharedArrayBuffer` need `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers, which the museum does not send and which can break embedding. No game needs them today. If one does, it is a per-route header change with its own proposal.
- **A separate origin for untrusted content.** The threat model keeps third-party games and any programmable mod off the museum's origin. That means a second hostname (for example a subdomain used only for sandboxed frames), which is a DNS and Worker change and is not requested yet.

### Alternatives turned down

- **Bundle games into the Astro build.** Every game change would run the 45-minute site build and put engine code under `_astro/`.
- **Publish games to Pages.** File count and file size limits, and a Pages deploy for every game release.
- **A versioned URL in the page** (`/play-rt/1.4.2/…` written into HTML). A game release would rewrite seven pages per game and need a site deploy; the pointer file needs neither.

### Until this is approved

Games run from the Vite dev server (`npm --prefix gaming run dev`) and from a local static build. `acceptance.json` R02 stays `not-tested`.

_(Since approved; R02 is now `in-progress`: the separate build exists and is exercised locally, and no staging or rollback has been proved on Cloudflare.)_
