# The games: building, testing, releasing and rolling back

_Written 25 November 2026 at the founder's instruction of that day. **Nothing described here has run against Cloudflare yet.** The workflows, the Worker and the publisher exist and are tested on a developer's machine and by a rehearsal with a stand-in for the AWS CLI; the first real proof is the first UAT run, which is the founder's to start._

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
golden-age/index.html      one page per game that has a page, in the order of gaming/games/registry.json
atlas/index.html
assets/<name>-<hash>.js    every script, style and worker, named by the hash of its content
release.json               the manifest: commit, games, every file with its size and SHA-256
index.html, 404.html       no text of their own: they hand the visitor to the museum
```

A release holds code only. The build stops if it produced a media file: by the museum's hosting rule media belongs on R2, and audio is never in git, so a release built by a workflow has no music and its games show no music control. Hosting the six tracks and building with `--music-base` is a later step ([G-0007](adr/G-0007-music-and-audio.md)).

On 25 November 2026 the release was 37 files and 3.12 MB (two games; Granada has no page yet and is listed as planned).

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
| UAT | `islam-museum-games-uat` | `uat-games.islam.museum` | `islam-museum-uat` |
| Production | `islam-museum-games` | `games.islam.museum` | `islam-museum-search` |

No new bucket, no new token, no new secret and no new GitHub Environment variable: the workflows use `R2_BUCKET`, `WRANGLER_ENV`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as they are set for the website. Two things may need the founder's hand, and the run will say so if they do:

- The API token must be allowed to create a Worker and a Custom Domain in the zone. It already does both for the website's UAT Worker, so it probably is; this has not been tried.
- The UAT S3 keys are scoped to the UAT bucket and must be allowed to write objects under `games/`. They write the website's objects there today; a key restricted by prefix would refuse.

**Cost.** Not measured, because nothing has run. What a release adds: about 3 MB of storage per release kept; one Worker request and one or two R2 reads for each file a visitor's browser asks for the first time (scripts and styles are then cached by the browser for a year, by their hashed names). Whether that stays inside the account's plan depends on the plan and on traffic, neither of which is recorded in this repository. The first UAT run will show the request counts in the Cloudflare dashboard.

## What is not done

- No run against Cloudflare. The R2 calls are rehearsed against a stand-in for the AWS CLI (`workers/games/test/fake-aws.mjs`), which proves the steps fit together and proves nothing about R2 or wrangler.
- No caching at Cloudflare's edge in front of the Worker; every first request for a file runs the Worker. Enough for prototypes.
- No music in a release, and no captures or other media.
- The Play page and the menu entry on the website, which are what will send a visitor to the games' address.
- Granada has no page, so it is in the registry as `planned` and in no release.
- A browser test inside the workflow. The runners have no GPU; the smoke test is run by hand.
