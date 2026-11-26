# The games: building, testing, releasing and rolling back

_Written 25 November 2026 at the founder's instruction of that day, and updated the same evening after the first real run. **UAT is live** at `https://uat-games.islam.museum`: the founder said "Yes, run UAT" in chat and the agent started the workflow, action `check` and then `release` (check run [45713511479](https://github.com/amado2k5/islam-museum/actions/runs/45713511479), release run [45713830185](https://github.com/amado2k5/islam-museum/actions/runs/45713830185)). **Production has not been deployed**, and a rollback has not yet been made on Cloudflare, because it needs a second release to go back from._

## The first UAT run, 25 November 2026

| Step | What happened |
|---|---|
| `check` | Passed in 95 seconds and wrote nothing: the owner check, the environment (bucket `islam-museum-uat`, wrangler environment `uat`), the build (the latest games build of `main`, commit `3599b8f514c`), the release verified against its manifest, the Worker's 31 tests on the runner, and a dry run that read the bucket and found nothing released |
| `release`: the Worker | `islam-museum-games-uat` deployed (6.53 KiB) and the Custom Domain `uat-games.islam.museum` created by the same step. The existing API token was enough |
| `release`: the files | 46 files, 3.28 MB, uploaded to `s3://islam-museum-uat/games/r/20261125-3599b8f514c/` in about five seconds; read back from the bucket and verified against the manifest; then the pointer written (live: `20261125-3599b8f514c`, before it: none). The existing UAT S3 keys were enough |
| After it | `/_channel`, `/granada/`, `/golden-age/`, `/atlas/`, `/release.json`, `/robots.txt` and `/` answered 200 with the content security policy, `nosniff` and `noindex`; a path that is not there is refused. Granada was opened there in Arabic in a browser: it started, orders were given, three days passed, the game was saved on that address, and the console stayed empty |
| Whole run | Two minutes |

So R2, wrangler, the Custom Domain and both sets of credentials are now proved for UAT. Not proved by this run: production; a rollback; what the requests cost.

## Releases to UAT so far

| Release | Run | What it carried |
|---|---|---|
| `20261125-3599b8f514c` | [45713830185](https://github.com/amado2k5/islam-museum/actions/runs/45713830185) | The first: three games, Granada on its plan |
| `20261125-1057ab8a554` | [45717519130](https://github.com/amado2k5/islam-museum/actions/runs/45717519130) | The music found beside the games |
| `20261125-7c31b7631c6` | [45728259166](https://github.com/amado2k5/islam-museum/actions/runs/45728259166) | Granada's valley in 3D and Atlas's lit globe; checked in Chrome on UAT: all three games start in 3D |
| `20261125-484ead40122` | [45733594650](https://github.com/amado2k5/islam-museum/actions/runs/45733594650) | Granada's village, mosque, mill and bridge; checked in Chrome on UAT in English and Arabic: the five addresses start in 3D with no error |
| `20261125-e2930d63426` | [45737573014](https://github.com/amado2k5/islam-museum/actions/runs/45737573014) | The first build that looks for models beside the release (the mill made in Blender, uploaded just before), and Atlas's rebuilt pack; checked in Chrome on UAT in English and Arabic: Granada loads the mill, no error |

Each was started by the agent after the founder's word for it in chat ("Yes, run UAT"; "where is the music"; "Release to UAT", three times; and "Yes, upload to UAT" for the models). The agent asks before each one. No rollback has been made on UAT, and production has not been deployed.

## The rule

The games are built, tested and deployed apart from the website. In the founder's words:

> you can separate the game testing suite and building suite completely from the normal website testing and build

> we would only need to build and deploy the main site to introduce the main landing pages for games and other UI that takes the visitor to games, but going forward any changes to games should be deployed and built and tested separately only for its code and its files

> the files should go to R2 just like we do with the main website, save them under games folder on r2, one for production and one folder for uat and create the necessary workers and everything else you need in cloudflare, follow the same process we had in islam museum main website build and deployment for production and uat

> make sure the existing islam museum build and deployment workflows do not deploy the games code or files or resources, except for the things that are in navigation menus or on landing page or is a page

So there are two sides, and each has its own of everything:

| | The website | The games |
|---|---|---|
| Code | `site/`, `scripts/`, `data/`, `content/` | `gaming/`, `workers/games/` |
| Test and build | `validate.yml`, `build.yml` (`npm run validate`, `npm test`, `npm run build`) | `games-build.yml` (`npm --prefix gaming test`, `typecheck`, `strings`, `build:release`; `node --test workers/games/test/*.test.mjs`) |
| Build artifact | `dist-tar` | `games-release` |
| Deploy | `deploy-uat.yml`, `deploy.yml` → `deploy-env.yml` | `games-deploy-uat.yml`, `games-deploy.yml` → `games-deploy-env.yml` |
| Worker | `islam-museum-site` (`-uat`) | `islam-museum-games` (`-uat`) |
| Where it is in the bucket | language folders, `api/`, `media/`, search indexes and the rest | `games/` only |
| Address | `islam.museum`, `uat.islam.museum` | `games.islam.museum`, `uat-games.islam.museum` |
| Who starts a deploy | The founder | The founder |

The website is built and deployed for the games only when a museum page changes: the Play page, a menu entry, a landing page. After that, a change to a game touches only the right-hand column.

Two tests hold the wall up, one on each side: `scripts/games-separation.test.ts` (no website workflow builds or deploys anything of the games; the site Worker does not serve `games/`; the site's publish neither writes nor deletes there; the site imports nothing from `gaming/`) and `workers/games/test/separation.test.mjs` (no games workflow touches anything of the website; the build runs only for the games' files; a deploy starts only by hand). The website's `validate.yml` and `build.yml` skip a change confined to the games' paths.

## What a release is

`npm --prefix gaming run build:release` writes `gaming/dist/release/`:

```
granada/index.html         one page per game that has a page, in the order of gaming/games/registry.json
golden-age/index.html
atlas/index.html
assets/<name>-<hash>.js    every script, style and worker, named by the hash of its content
release.json               the manifest: commit, games, every file with its size and SHA-256
index.html, 404.html       no text of their own: they hand the visitor to the museum
```

A release holds code only. The build stops if it produced a media file: by the museum's hosting rule media belongs on R2, and audio is never in git. The music is uploaded on its own and found by the games beside themselves on the games host (see "The music" below).

On 25 November 2026 the release was 46 files and 3.28 MB: three game pages, Granada first.

## Where it lives

In each environment's own bucket (production `islam-museum-search`, UAT `islam-museum-uat`), under `games/` and nowhere else:

```
games/channel.json               the pointer: the live release and the one before it
games/r/<release>/…              one folder per release, written once and never changed
```

A release id is the commit's date and hash, for example `20261125-a707db02d7f`. **Releasing and rolling back change only the pointer.** No release folder is ever overwritten or deleted by a workflow; pruning old ones is a manual decision, and at about 3 MB each there is no hurry.

The games Worker (`workers/games`) answers the games' address from those objects. It reads nothing outside `games/`, answers only GET and HEAD, decides the content type from the file's name, and sets the security headers itself, so nothing uploaded can loosen them: a content security policy under which a page may load scripts, styles, fonts and data only from its own address (no inline script, no inline style, no eval), `nosniff`, and `noindex` while every game is a prototype. It trusts the pointer for thirty seconds, so a release or a rollback is live everywhere within about half a minute. A page opened just before a release still gets its own scripts from the release before.

The website's R2 publish works only under its own list of folders and never lists or deletes under `games/` (read in `workers/r2-sync/batch/publish.mjs`, and held by a test). The website's Worker does not serve `games/`.

One thing to know: the buckets are also public at `api.islam.museum` and `uat-api.islam.museum`. The objects under `games/` are therefore readable there too, without the games Worker's headers. They are public static files, so nothing is exposed that is not meant to be; the address to link to is the games host.

## Before a release: on a developer's machine

```bash
npm --prefix gaming ci
npm --prefix gaming test && npm --prefix gaming run typecheck && npm --prefix gaming run strings
node --test workers/games/test/*.test.mjs
npm --prefix gaming run build:release
npm --prefix gaming run check:release -- --allow-dirty   # --allow-dirty only for an uncommitted local build
npm --prefix gaming run release:smoke                    # real Chrome, the Worker's own code, a folder for the bucket
```

The last command opens every game of the release in Chrome, in Arabic and English, served by the Worker's real code from a folder laid out like the bucket, and fails on a console error, a blocked or failed request, a content security policy violation, a request to another origin, or a game that does not start. It needs a machine with a GPU, so it is not part of the workflow.

## Releasing: UAT, then production

Both are manual, started from the Actions tab by the founder (or an admin). **No agent or session starts a deploy workflow.**

1. Merge to `main`. "Build the games" runs on its own for a change under `gaming/`, `workers/games/` or `games-*.yml`, and keeps the release as the artifact `games-release`.
2. **Deploy the games to UAT**, action `check`. It verifies the release and says what it would do. It writes nothing.
3. The same workflow, action `release`. It deploys the Worker `islam-museum-games-uat`, uploads the release to `islam-museum-uat` under `games/r/<id>/`, reads it back and verifies every file, and only then moves the pointer. Look at `https://uat-games.islam.museum/golden-age/?lang=ar`.
4. **Deploy the games to production**, with the `build_run_id` shown in the UAT run's summary, action `check` and then `release`: the identical release goes to `islam-museum-search` behind `https://games.islam.museum`.

To go back: either workflow with action `rollback` moves the pointer to the release before, uploads nothing and deletes nothing. Running it again returns to where it was.

## What the first run of each environment creates in Cloudflare

Read this before the first `release`. Everything here is created by `wrangler deploy` inside the workflow, with the same API token the website's deploy uses.

| Environment | Worker | Custom Domain (DNS record and certificate in the `islam.museum` zone) | Bucket binding |
|---|---|---|---|
| UAT (created 25 November 2026) | `islam-museum-games-uat` | `uat-games.islam.museum` | `islam-museum-uat` |
| Production | `islam-museum-games` | `games.islam.museum` | `islam-museum-search` |

No new bucket, no new token, no new secret and no new GitHub Environment variable: the workflows use `R2_BUCKET`, `WRANGLER_ENV`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as they are set for the website. Two things may need the founder's hand, and the run will say so if they do:

- The API token must be allowed to create a Worker and a Custom Domain in the zone. For UAT it was. Production uses the same token.
- The S3 keys must be allowed to write objects under `games/`. The UAT keys were. The production keys have not been tried.

**Cost.** Not measured: one UAT run has been made and nobody but the author has visited. What a release adds: about 3 MB of storage per release kept; one Worker request and one or two R2 reads for each file a visitor's browser asks for the first time (scripts and styles are then cached by the browser for a year, by their hashed names). Whether that stays inside the account's plan depends on the plan and on traffic, neither of which is recorded in this repository. The first UAT run will show the request counts in the Cloudflare dashboard.

## The music

The museum's suite is the music of every game, and the audio is never in git. So it travels on its own:

1. On the machine that has the masters: `npm --prefix gaming run music:import -- <folder>` encodes the six tracks into the git-ignored `gaming/media/music/` and records each one's size and SHA-256 in `gaming/packages/audio/music.json`.
2. The six `.m4a` files are attached to a **draft** release of this repository named `games-media` (drafts are not public): `gh release create games-media --draft … gaming/media/music/*.m4a`. It is a way of carrying the files to a workflow, not a release of anything. Done on 25 November 2026.
3. **Upload the games' music** (`games-media.yml`, manual, owner-only), `check` then `upload`, for UAT (done 25 November 2026: six tracks, 20.5 MB, runs [45717165700](https://github.com/amado2k5/islam-museum/actions/runs/45717165700) and [45717350066](https://github.com/amado2k5/islam-museum/actions/runs/45717350066)) and then for production (not done): it fetches the six files, refuses any that is not byte for byte what `music.json` records, puts them in the environment's bucket under `games/media/music/`, and reads each back. A track already there is left alone if identical and refused if not. Nothing is deleted.
4. A release is built with `--music-base ../media/music/`, so each game asks for its tracks beside itself on the games host. The games Worker serves `/media/…` from `games/media/…`, whole or in spans of bytes (players ask for audio in spans, and some refuse a host that cannot answer them).

If an environment has no tracks yet, a game shows its music control and reports that the music cannot be played; nothing else is affected.

On UAT, after the second release ([run 45717519130](https://github.com/amado2k5/islam-museum/actions/runs/45717519130), release `20261125-1057ab8a554`, with `20261125-3599b8f514c` kept as the one before): a track answers 206 to a span of bytes with the right `content-range`, 200 whole, and its SHA-256 as fetched equals the one in `music.json`; `gaming/tools/uat-check.ts` opened the three games there in a muted Chrome and each showed the music control, asked for nothing before a click, played a track after one, and kept an empty console. The Golden Age ran in 3D there.

## The models

The games' authored models (`gaming/art/`) are media too, and travel as the music does:

1. On the machine that has Blender: `npm --prefix gaming run art:mill` makes the model under the git-ignored `gaming/media/models/`, and `npm --prefix gaming run art:manifest` records every file's size and SHA-256 in `gaming/art/manifest.json`, which is committed.
2. The files are attached to the same draft release, `games-media`. A release has no folders, so each goes under a flat name, `/` written as `__` (`granada/mill.gltf` is `granada__mill.gltf`).
3. **Upload the games' media** (`games-media.yml`), kind `models`, `check` then `upload`, for UAT and then for production: it fetches the files, refuses any that is not byte for byte what the manifest records, puts each under `games/media/models/` at its own path, and reads it back. A file already there is left alone if identical and refused if not. Nothing is deleted.
4. The workflow's build is made with `--models-base ../media/models/`, so a game asks for its models beside itself on the games host.

On 26 November 2026 (UTC) the watermill's 17 files were uploaded to UAT this way (check run 45736853275, upload run 45736985159) and read back from the host identical to the manifest.

**Upload before you release.** A game does without a model it cannot fetch (it keeps the shape its own code draws), but the browser still records the failed request. So the models go to an environment before a release that looks for them does, as with the music; production has neither yet.

## Trying the games from another device on the same network

The development server can listen on the machine's network address: start the launch configuration `gaming-dev-lan` (`.claude/launch.json`: the same server with `--host 0.0.0.0`), then open `http://<this machine's address>:4330/games/granada/index.html?lang=ar` on a phone or another computer on the same network. It is the development build, with the music if the tracks were imported, and it is reachable by anyone on that network while it runs. One limit comes from the browsers, not from the games: WebGPU is offered only on `https` or on `localhost`, so over a plain network address The Golden Age shows its plan view instead of 3D. Granada and Atlas do not need it. The UAT address is `https` and has no such limit.

## What is not done

- No production deployment. It is the founder's to start, with the `build_run_id` of the UAT run.
- No rollback on Cloudflare yet. A second release now exists on UAT, so it can be tried; it was not, because the founder was testing there and a rollback would have put the release without music back in front of him. It is rehearsed against a stand-in for the AWS CLI (`workers/games/test/fake-aws.mjs`).
- No caching at Cloudflare's edge in front of the Worker; every first request for a file runs the Worker. Enough for prototypes.
- No captures or other media besides the music.
- The Play page and the menu entry on the website, which are what will send a visitor to the games' address.
- The whole of each game was not played on UAT: Granada was opened and played for three days there; The Golden Age and Atlas were only asked for and answered 200.
- A browser test inside the workflow. The runners have no GPU; the smoke test is run by hand.
