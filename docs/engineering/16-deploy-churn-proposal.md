# 16 · Deploy churn: why a deploy re-uploads ~180,000 files, and the proposal to stop it

_Status: **Phase 1 implemented on 6 November 2026, with one item measured and not shipped** (1.1, the stylesheet; section 6a).
Written as a proposal the same day, then built on request. Phase 2 and Phase 3 are not built; Phase 2 needs the founder's
decision (`docs/ai-change-gates.md` section 1: it is `submission-impacting`, ADR 0002). Canonical deploy rules stay in
`06-deployment.md` and `workers/r2-sync/README.md`; the rules this work added are in `AGENTS.md` ("Keep deploys small")
and `docs/site/README.md` ("site-wide numbers")._

## 1. Summary

The publisher (`workers/r2-sync/batch/publish.mjs`) already does what Netlify, Vercel and Cloudflare's own uploaders
do: it hashes every built file (SHA-256), keeps the hashes of the last publish in the bucket, and sends only files
whose bytes changed. That part works. The last three production deploys still copied 174,000 to 206,000 files each,
because the **bytes of pages whose content did not change still change between daily builds**:

- 65 % of every entity page is the site's stylesheet, inlined into the HTML (`inlineStylesheets: "always"`); another
  10 % is the header, theme and accessibility scripts inlined by `BaseLayout.astro`. Any edit to `global.css` or to
  those scripts rewrites all 163,929 HTML pages.
- The footer prints the version and date read from `CANARY.md`. Every version bump (three in the last six days)
  rewrites every page.
- Shared files that are baked into every page (layouts, `global.css`, `i18n/*.yaml`, components the layouts import)
  changed on **17 of the 17 days** with commits since 20 October. So "a content-only day" has not happened once.
- The accessibility EPUBs write the build clock into `content.opf`, so all 867 of them change on every build.
- Pagefind rebuilds its 2,691 index chunks on every build (by construction; the 124,002 fragments are stable).

Two builds thirty minutes apart with the same version and no shared-file change differ on **6,583 of 370,707 files**
(1,065 changed, 2,788 added, 2,730 deleted), of which 2,691 are Pagefind chunks and 867 are EPUBs. That is the churn
floor the pipeline could have today: about 4,000 uploads instead of 180,000.

The proposal is to make unchanged entities produce unchanged bytes (Phase 1, build-side, inside ADR 0002), to make
the all-pages files visible and rare (a label and a deploy window), and only if that is not enough, to move the page
shell out of the stored objects (Phase 2, needs an ADR amendment). A per-source hash, which the founder asked about,
already exists at the output level; a source-level hash that skips rendering is Astro 7.2's experimental incremental
build and helps build time, not uploads, unless Phase 1 is done first (section 5).

## 2. What the measurements show

### 2.1 The last three production deploys (`deploy.yml` logs)

| Deploy (UTC) | Built commit | Files in dist | Copied to R2 | Deleted | Publish step | Shared files changed since the previous deployed build |
|---|---|---:|---:|---:|---:|---|
| 2 Nov 19:08 | `a56e530b` | 348,396 | 205,785 | 24,624 | 66 min | `EntityLayout.astro`, `global.css`, `nav.ts`, `Landing.astro`, `i18n/*.yaml` (+117 lines each), 12 files |
| 3 Nov 04:30 | `c88415c9` | 354,870 | 184,951 | 13,889 | 55 min | `i18n/*.yaml` (+3 keys), `SocialLinks.astro` (footer), `recordings.ts`; version v1.0.2 → v1.1.0 |
| 4 Nov 05:37 | `0f22d081` | 356,302 | 173,799 | 10,898 | 53 min | `BaseLayout.astro`, `global.css`, `edu.css`, `kids.css`, `markdown.ts`, `StoryCards.astro`, `Tour3D.astro` |

In each case the "reconciled with the bucket" line reports `0 of N files to copy are already there`: the manifest
is right, the bytes really differ. The data and content diff between the 3 and 4 November builds was 2,058 files;
the publish copied 173,799.

### 2.2 Two builds without a shared-file change (artifacts of runs 42145688385 and 42148894745, 6 Nov, 30 minutes apart, both v1.2.0)

| Prefix | Files | Changed | Added | Deleted | Why |
|---|---:|---:|---:|---:|---|
| `pagefind-*/index` | 2,691 | 0 | 2,691 | 2,691 | every chunk is renamed on every build (content-hashed ranges of the whole word list) |
| `*/books/*.epub` | 1,734 | 867 | 0 | 0 | `dcterms:modified` = build clock (`scripts/a11y-books.ts` line 141) |
| `api/v1` | 71,026 | 63 | 10 | 0 | real content change (a new edge changes the two-hop neighbourhoods it touches) |
| `pagefind-*/fragment` | 124,002 | 0 | 30 | 6 | stable: only the changed pages |
| HTML pages (`ar`, `en`, `ur`) | 163,929 | 72 | 27 | 0 | the touched passages, listings and hubs only |
| root data files | 535 | 60 | 0 | 0 | sitemaps, feed, synonyms: real changes |
| **Total** | **370,707** | **1,065** | **2,788** | **2,730** | **≈ 6,600 operations, ≈ 4,000 of them avoidable or inherent** |

Three content pull requests (44 source files) produced 72 changed pages and 63 API files. The derivations are stable
under insertion, as `docs/site/README.md` requires. The pipeline is sound; the shell is the problem.

### 2.3 What a page is made of (30 random entity pages from the 6 Nov build)

| Part | Share of bytes | Changes when |
|---|---:|---|
| Inlined `<style>` (the whole stylesheet, every page) | 65 % | any CSS edit |
| Inline `<script>` (menu, theme, font, a11y prefs, wing counts) | 10 % | any edit to those scripts in `BaseLayout.astro` |
| Header, nav, footer markup, `<head>` metadata | 10 % | layout markup, nav i18n keys, the version line |
| `<main>` (the entity) | 13 % | the entity, its related lists, its renderer (`markdown.ts`) |

Average page: 114 KB; 19 GB of HTML in the artifact; about 100 KB of each page is identical across all pages of a
language. The `_astro/` references inside a page are content-hashed (`DepthDial.B6wrZWBs.js`,
`EntityLayout.astro_astro_type_script….CiITl3yE.js`, fonts): a change to one of those files renames it and
rewrites every page that references it.

### 2.4 How often the all-pages files change (`origin/main`, 20 Oct to 5 Nov)

Commits touching layouts, styles, i18n, lib or components: every one of the 17 days (from 1 to 52 commits a day).
Most-touched: `i18n/ur.yaml` 89, `i18n/en.yaml` 86, `i18n/ar.yaml` 85, `BaseLayout.astro` 22, `global.css` 16,
`EntityLayout.astro` 16, `Landing.astro` 15, `nav.ts` 9, `markdown.ts` 4. An i18n commit rewrites every page only
when it edits a key the shell or the entity layout uses; adding keys for a new page does not. CSS, layout and
`markdown.ts` edits rewrite everything.

## 3. What it costs today

Prices from `developers.cloudflare.com/r2/pricing` (checked 6 Nov 2026): Class A (writes, lists) $4.50 per million,
Class B (reads) $0.36 per million, deletes free, 1 million Class A free per month, storage $0.015 per GB-month.

| Per production deploy | Today | After Phase 1, content-only day | After Phase 1, shell-change day |
|---|---:|---:|---:|
| Files copied | 174k to 206k | ≈ 4k to 8k | ≈ 164k (pages) + 4k |
| Bytes re-uploaded | ≈ 19 GB | < 1 GB | ≈ 7 GB (pages are 40 KB, not 114 KB) |
| Class A operations (copies + ~1,400 staged archives × multipart parts + manifest writes + reconcile lists) | ≈ 190k to 215k | ≈ 5k to 10k | ≈ 170k |
| Publish step | 53 to 66 min | ≈ 3 to 5 min | ≈ 25 to 35 min |
| Class A cost at one deploy a day, above the free million | ≈ $20 to $25 a month | $0 | $0.75 per such deploy |

The two "After Phase 1" columns are the proposal's estimates and assumed the stylesheet leaves the page. It did not ship (6a), so on a shell-change day the pages stay about 104 KB and the upload is about 17 GB, not 7 GB; the file counts are unchanged.

A UAT deploy of the same build doubles every line (its own bucket, its own manifest). The Worker CPU of the seven sync
Workers and the GitHub runner time (public repository) are not significant next to the Class A line. The second cost
is the hour of wall-clock each deploy takes, during which no other deploy can start (`concurrency: pages`).

## 4. Why the manifest diff is not the problem

The repository documented this mechanism itself on 21 October (`docs/site/README.md`, "site-wide numbers"): two
builds one content batch apart differed on 112,061 of 112,127 pages because of one number in the header, and the fix
was to keep that number out of the layout. The same rule now has to cover the stylesheet, the layout scripts and the
version line, which together are 75 % of every page's bytes, and it needs a measurement so a regression is seen in
the deploy summary rather than discovered in the bill.

Hash-based upload dedup is the industry norm and is already in place:

- Netlify's deploy API takes a `{path: sha1}` digest and answers with `required`, the hashes it lacks; "uniquing the
  objects" by SHA is how its deploys stay small (docs.netlify.com/api/get-started, netlify.com/blog 2016-08-11).
- Vercel's file upload carries `x-vercel-digest` and answers "File already uploaded" for a known SHA1.
- Cloudflare Workers Static Assets takes a manifest of `{path: {hash, size}}` and returns only the buckets of hashes
  to upload ("Unmodified files will not be returned"); Pages' uploader posts hashes to `check-missing` first. Both are
  capped at 100,000 files per deployment on paid plans, 25 MiB per file, so neither can take this site's 370k files.
- `hugo deploy`, `s3deploy`, `rclone --checksum` compare MD5/ETag per object; `aws s3 sync` compares size and mtime,
  which re-uploads everything from a fresh CI checkout.

All of them stop helping the moment the build emits different bytes for the same content, which is the case here.

## 5. The founder's question: a hash and version in every YAML file

What that idea buys depends on where the hash is checked:

- **At upload (output hash).** Done. `publish.mjs` keeps `_r2-sync/manifest.json` (key → SHA-256 of the built file)
  and writes it after every batch, so a failed run resumes. A redeploy of the same build sends nothing but the deploy
  stamp. Adding a hash to the YAML would not change what is uploaded: the page's bytes, not the source's, decide.
- **At render (source hash, skip the page).** This is what Gatsby's incremental builds and **Astro 7.2's
  `experimental.incrementalBuild`** (released 6 Aug 2026) do: a page is reused when its `cacheKey` (for content
  collections, `entry.digest`) **and** the hash of the module graph of its layouts, components and imports both
  match the previous build; `node_modules/.astro/incremental-build.json` and `dist/` must be kept between builds;
  `build.concurrency` must be 1; a config or dependency change clears the cache. Two consequences for this site:
  (1) the site is on Astro 5.18, two majors behind; (2) a changed layout, stylesheet or `markdown.ts` invalidates
  every page exactly as today, because it is in every page's module graph. Incremental rendering therefore cuts the
  45-minute build on content-only days, but only after Phase 1 has made content-only days exist. It is listed as a
  later step (section 6, Phase 3), not as the fix.
- **At storage (content-addressed pages).** Cloudflare's own Workers Sites model (a path → content-hash manifest with
  hashed KV objects), Netlify's SHA trees, and the kvant-solver project (PR #109, Nov 2026: a static site past the
  Pages file limit, packed into content-addressed archives on R2, a 256-shard index, and a Worker doing one ranged
  read per page). Packing makes a full rewrite cost a few hundred writes instead of 164,000, at the price of a
  pack-aware Worker, one shard read plus one ranged read per uncached page, and re-uploading 7 to 19 GB of packs on a
  shell day. It is the last resort (Phase 3), not the first move.

## 6. Proposal

### Phase 1 · Stable pages (build-side, no change to how the site is served; ADR 0002 untouched)

| # | Change | Files | Effect on a deploy | Risk and trade-off |
|---|---|---|---|---|
| 1.1 | **NOT SHIPPED, see 6a: it failed its Lighthouse check.** Stop inlining the stylesheet. `build.inlineStylesheets: "never"` (or inline only a few KB of above-the-fold rules), emit the main stylesheet under a **stable name** (Vite `build.rollupOptions.output.assetFileNames` for CSS, e.g. `/_astro/site.css`) and serve it with `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` plus the asset layer's ETag instead of the hashed-immutable rule; add `<link rel="preload" as="style">`. | `site/astro.config.mjs`, `site/public/_headers`, `BaseLayout.astro` | A CSS edit costs **1 upload instead of 163,929**. Pages drop from ≈114 KB to ≈40 KB; the artifact from 5.4 GB to ≈2 GB; every full rewrite that remains uploads 7 GB instead of 19 GB. | Inlining was chosen (comment in `astro.config.mjs`) to remove the html → css → font chain (≈2 s in Lighthouse) when the stylesheet was ≈22 KB; it is now ≈75 KB per page. External, it is cached after the first page, same origin, HTTP/2; the preload keeps it off the critical path. Re-measure with `lighthouserc.json` on UAT before production; recalibrate `scripts/check-weight.ts` budgets, which count inlined CSS as HTML. |
| 1.2 | **Move the layout scripts out of the page.** The four inline IIFEs in `BaseLayout.astro` (menu, font, theme, a11y prefs) and the inline scripts of `EntityLayout.astro` become `site/src/scripts/shell.ts` with a stable output name (same Vite rule, `entryFileNames` for that one entry), loaded with `defer`. The Svelte island chunks (`DepthDial`, `client.svelte`) stay hashed: they change rarely. | `BaseLayout.astro`, `EntityLayout.astro`, `site/src/scripts/shell.ts`, `astro.config.mjs` | A script fix costs 1 upload. | Same-origin script, no new network call; `check:static` still passes. The theme script runs before first paint today to avoid a flash; keep that one small block inline (it changes almost never) and move the rest. |
| 1.3 | **Take the version out of the page.** The footer keeps the changelog link; the version and date are filled from `api/v1/meta/deploy.json`, which `deploy-env.yml` already writes and which the landing page already fetches. The deploy step adds `version` and `version_date` from the built commit's `CANARY.md`. Without JavaScript the footer reads "islam.museum · changelog", the same pattern as the wing counts. | `BaseLayout.astro`, `site/src/lib/version.ts` (changelog page keeps using it), `deploy-env.yml` | A version bump costs 1 upload instead of 163,929. Three bumps in the last six days. | None for readers with JavaScript; a no-JS reader loses the number in the footer (the changelog page still shows it). |
| 1.4 | **Deterministic EPUBs.** `dcterms:modified` = the entity's `updated` git date (already computed by `scripts/git-dates.ts`), not the build clock. | `scripts/a11y-books.ts` | 867 uploads a day → 0. | None. |
| 1.5 | **Pagefind 1.6.x.** 1.6.0 completed deterministic output (PRs #1104, #1124); fragments are already stable since 1.3.0. The 2,691 index chunks still rename on every build because any page shifts the word ranges (open issue #1395 covers the remaining machine-dependent ordering). | `site/package.json` | Keeps the floor at ≈2.7k chunk uploads a day (≈$0.36 a month). `max_fragments` or per-section bundles are not needed. | Upgrade test on UAT. |
| 1.6 | **A churn report in every deploy.** `publish.mjs` prints the copies per top-level prefix (`ar`, `en`, `ur`, `api`, `pagefind-*`, `media`, root) and writes them to the job summary next to the data/content diff size of the deployed commit range. A deploy that rewrites more than, say, 20 % of the pages while fewer than 1 % of the sources changed prints a warning naming the shared files that changed. Add `tools/deploy/compare-builds.py` (the script used for section 2.2) so anyone can diff two artifacts. | `workers/r2-sync/batch/publish.mjs`, `deploy-env.yml`, `tools/deploy/` | Makes a regression visible in the summary instead of the bill. | None. |
| 1.7 | **Name the all-pages files and gate them.** Extend the "site-wide numbers" rule in `docs/site/README.md` and `AGENTS.md`: `site/src/layouts/*`, `site/src/styles/*`, `site/src/lib/markdown.ts`, `nav.ts`, the components the layouts import, and the i18n keys under `nav`, `footer`, `entity` and `a11y` are **shell files**; a pull request that touches one is labelled `rewrites-all-pages` by a path filter in `validate.yml`, with the cost line in its summary ("this change rewrites ≈164,000 pages: ≈$0.75 and ≈30 minutes on the next deploy"). The founder deploys shell changes knowingly, ideally batched into one deploy a week; content deploys stay daily. | `.github/workflows/validate.yml`, `docs/site/README.md`, `AGENTS.md` | Turns 17 full-rewrite days out of 17 into a few. | A process rule, so it depends on agents reading it; the label and the summary line are the enforcement. |

Expected outcome of Phase 1 as proposed: a content-only deploy copies about 4,000 to 8,000 files in 3 to 5 minutes and
stays inside the free million Class A operations even with daily UAT and production deploys; a shell deploy still copies
every page, but in 7 GB rather than 19 GB and a third of the time, and happens when the founder chooses. **The shipped
Phase 1 reaches the first half of that sentence only on days with no shell change, and not the second half: see 6a.**

Order of work: 1.4, 1.5, 1.6 first (no visible change, one day); then 1.3; then 1.1 and 1.2 together with a Lighthouse
run on UAT; then 1.7. Verify each step by building twice (the same commit, and the commit plus one content batch) and
diffing the artifacts with the script from section 2.2: the goal is "0 HTML pages changed for the same commit, only
the touched pages for a content batch".

### 6a. What was built and what was not (6 November 2026)

| # | Result | What exists |
|---|---|---|
| 1.1 | **Built, measured, not shipped** | Linking the stylesheet as `/shell/site.css` worked (a post-build step gave the compiled file a stable name and rewrote the link in every page), but it fails the Lighthouse gate. Numbers below. |
| 1.2 | Shipped | The four inline scripts of `BaseLayout.astro` are `site/public/shell/shell.js`, the two of `EntityLayout.astro` are `site/public/shell/entity.js`, loaded with `defer`; `_headers` caches them five minutes, then revalidates. The tiny theme-init script stays inline: it must run before first paint. Plain files rather than a Vite entry, so the name never changes and no build step is needed. |
| 1.3 | Shipped | The footer shows the changelog link; `shell.js` fills in `v<version> · <date>` from `api/v1/meta/deploy.json` when the browser is idle. `deploy-env.yml` writes `version` and `version_date` into that file from `CANARY.md` of the built commit. Checked in a browser: filled with the stamp, link text only without the stamp or without JavaScript. |
| 1.4 | Shipped | `dcterms:modified` is the day the entity's data or prose last changed (`scripts/epub-meta.ts`, from the graph); the 14 pathway and statement books per language take the build commit's day. Two runs 2 s apart: the old builder changed 867 of 867 EPUBs, the new one 0 of 867. |
| 1.5 | Shipped | `pagefind` `^1.6.0` (`site/package.json`, lockfile). On 5,293 pages indexed twice: 1.5.2 changed 4 of 1,727 files between the runs (two filters, the meta file, the entry file); 1.6.0 changed 0 of 1,741, also when the files were copied in the opposite order. The site's search page returns results from the 1.6.0 index in a headless browser. |
| 1.6 | Shipped | `publish.mjs` prints and summarises the churn table and warns above a fifth of the pages; `tools/deploy/compare-builds.py` compares two builds; unit tests added. |
| 1.7 | Shipped | `tools/deploy/shell-paths.list`, the `shell-impact` job in `validate.yml` (label `rewrites-all-pages`, summary), the rule in `AGENTS.md` and `docs/site/README.md`. |

**Why the stylesheet did not ship.** Same pages, built once, served by Lighthouse CI 0.15.1 (the tool of `validate.yml`) with its mobile profile, three runs each, median:

| Route | Before: CSS and scripts inline | CSS linked | Shipped: CSS inline, scripts external |
|---|---|---|---|
| `/ar/index.html` | 0.95, FCP 1,617 ms | **0.94**, 1,964 ms | 0.95, 1,616 ms |
| `/ar/person/…` (an entity) | 0.96, 1,393 ms | 0.95, 1,657 ms | 0.96, 1,363 ms |
| `/en/index.html` | 0.96, 1,616 ms | 0.98, 1,817 ms | 0.96, 1,626 ms |
| `/ur/index.html` | 0.95, 1,618 ms | **0.94** (one run 0.93), 1,967 ms | 0.95, 1,613 ms |
| `/en/accessibility/` | 1.00, 1,203 ms | 1.00, 1,206 ms | not measured |
| `/ur/accessibility/` | 0.98, 903 ms | 0.98, 1,208 ms | not measured |

`lighthouserc.json` requires 0.95 (an `error`) on all six routes, and the two home pages already sit exactly on it, so
linking the stylesheet turns the pull-request check red; AGENTS.md says a failing rule is never lowered. The cost is one
round trip (150 ms in the profile) plus the stylesheet sharing the simulated bandwidth with the two preloaded fonts
(162 KB on Arabic pages). Two cures were tried and are no cure: dropping the font preloads makes it much worse (FCP about
2,700 ms, scores 0.87 to 0.92) and a preload hint for the stylesheet changes nothing. Moving the scripts out of the page costs
nothing (right-hand column). Real visitors would also see the extra round trip on a cold first view.

**What the shipped change does, measured.** Two builds of 15,878 pages (every page except 24 of each 25 entity pages), the
second after editing both shell scripts and bumping the version in `CANARY.md`: **5 of 87,725 files differ** (the two
scripts and the three changelog pages, which render `CANARY.md`); the other 15,875 pages are byte-identical. Before this
change either edit rewrote every page.

**What it does not do.** A line edit of the stylesheet, a change to a layout or to a shell string in `i18n/`, and a
change to the libraries listed in `tools/deploy/shell-paths.list` still rewrite most pages. Of the 17 days from 20 October
to 5 November, 15 had a commit that touched one of those files (an upper bound: some touch only part of the pages).
So Phase 1 as shipped removes the triggers that were avoidable (the version, the page scripts, the e-books), shows each
deploy's cause in its summary, and makes the rest visible in review; it does not make most days cheap. A deploy on a day
with no listed shell change uploads about 4,000 to 8,000 files; a deploy on any other day still uploads about 164,000 (about
17 GB). The remaining index churn is Pagefind's: editing one entity page changes 9 of 1,741 files on one machine
(one fragment, six index chunks, the meta and entry files), but the two real builds of 6 November renamed all 2,691 index
chunks, which matches Pagefind issue 1395 (pages are numbered in directory-walk order, and that order differs between the
virtual machines of two builds). Indexing through Pagefind's Node API with the pages added in sorted order would remove it;
it is worth about 2,700 uploads a day, about $0.40 a month, so it was not done.

**What would make most days cheap: Phase 2, narrowed (needs the founder).** Keep `dist/` exactly as it is, so the Lighthouse
and link checks keep measuring what visitors get. At publish time `publish.mjs` replaces the one inlined global stylesheet
(found by a marker) with `<link rel="stylesheet" href="/shell/site.css">` before hashing and uploading, and publishes
the stylesheet as that one file. The site Worker, which already reads every page from R2, puts the stylesheet back
inline with `HTMLRewriter` (the file is read once per isolate and kept) before answering. Visitors then receive the same bytes
as today, so the Lighthouse scores do not move; the stored pages no longer change when the stylesheet does. The same step can later
carry the header, footer and navigation, which would end every remaining shell day. Cost: a Worker that rewrites HTML on
every uncached view, an amendment to ADR 0002 ("no server code on the visitor path" is already stretched by the site Worker),
tests for parity between `dist/` and what the Worker serves, and a `submission-impacting` rating
(`docs/ai-change-gates.md` section 3). About a week.

### Phase 2 · Shell outside the stored page (only if shell days stay frequent)

Store, for each page, only its `<head>` metadata and `<main>` (≈15 KB) in R2, and let the site Worker wrap it in the
language's shell (header, nav, footer: a static fragment bundled with the Worker or read once from the asset layer
and kept per isolate). A shell change then costs **zero** R2 writes; only the Worker is redeployed. The build keeps
writing full pages for the GitHub Pages mirror and for `check:site`; the publisher splits them at the markers.

This is composition of static fragments, not generation, but ADR 0002 says "no page is generated on demand" and
"Cloudflare provides only DNS, TLS, caching, redirects and headers", so it needs the founder to amend the ADR wording
(the R2-serving Worker of 28 October already went past that sentence). It also changes what the submissions describe
as the architecture, hence `submission-impacting`. Edge caching must key on the shell version (`cross_version_cache`
off, or a purge on shell deploys). Estimate: a week, including no-JS and mirror parity tests. Not recommended until
Phase 1 has run for a few weeks and the churn report shows that shell days are still the cost.

### Phase 3 · Later, if ever

- **Astro 7.2 incremental builds** (section 5) for the 45-minute build, after Phase 1, since they need a stable
  module graph to skip anything. Two major upgrades and `build.concurrency: 1`.
- **Content-addressed packs with ranged reads** (kvant-solver pattern) if the Class A count on shell days still
  matters after Phases 1 and 2. It would also remove the per-object storage of 370k keys, but adds a shard lookup and a
  ranged read per uncached page and re-uploads whole packs on a shell day.
- **Trim the deploy job itself** regardless: the "Build assets-only folder" step copies the 20 GB artifact (5 minutes)
  to delete most of it; a `rsync --exclude` or a direct listing of the 77 asset files avoids the copy. The reconcile
  listing before a large publish (≈350 LIST calls, 5 minutes) becomes unnecessary once large publishes are rare.

## 7. Decisions needed from the founder

1. Merge Phase 1 as shipped (6a). Items 1.2 and 1.3 touch `site/src/layouts/BaseLayout.astro`, which is on the
   submission-impacting list of `docs/ai-change-gates.md` section 3 because of the privacy posture; they add no cookie,
   form, analytics or external call (the footer reads one same-origin static file that the landing page already reads),
   and `npm run check:static` still guards that.
2. Whether to build Phase 2 narrowed (6a): an ADR 0002 amendment and a Worker that inlines the stylesheet. It is the only
   change in this document that makes most days cheap without lowering a performance gate.
3. The cadence for shell changes (weekly is suggested): agents hold `rewrites-all-pages` pull requests, or the founder
   deploys them together.
4. Optional: the sorted Pagefind indexing (6a), worth about $0.40 a month.

## 8. Sources

- Deploy logs: GitHub Actions runs 41507185832, 41578486071, 41780420404 (`deploy.yml`); build artifacts of runs
  42145688385 and 42148894745 compared by zip central-directory CRC and size (370,707 files each).
- R2 pricing and operation classes: https://developers.cloudflare.com/r2/pricing/ · Workers Static Assets limits and
  direct-upload dedup: https://developers.cloudflare.com/workers/platform/limits/ ,
  https://developers.cloudflare.com/workers/static-assets/direct-upload/ · Pages limits:
  https://developers.cloudflare.com/pages/platform/limits/ and the uploader
  https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/pages/upload.ts
- Netlify digest deploys: https://docs.netlify.com/api/get-started/ ,
  https://www.netlify.com/blog/2016/08/11/from-unstable-to-reliable-a-release-engineering-journey/ · Vercel:
  https://vercel.com/docs/rest-api/reference/endpoints/deployments/upload-deployment-files
- Astro incremental builds (7.2, experimental): https://docs.astro.build/en/reference/experimental-flags/incremental-build/ ,
  https://github.com/withastro/astro/pull/17084 · Gatsby incremental builds and the shared-layout caveat:
  https://www.gatsbyjs.com/docs/debugging-incremental-builds/ · Reproducible builds:
  https://reproducible-builds.org/specs/source-date-epoch/
- Pagefind output stability: https://github.com/Pagefind/pagefind/releases/tag/v1.3.0 (stable fragment names),
  https://github.com/Pagefind/pagefind/pull/1104 , https://github.com/Pagefind/pagefind/pull/1124 (deterministic
  output, v1.6.0), https://github.com/Pagefind/pagefind/issues/1395 (remaining ordering issue),
  https://pagefind.app/docs/multisite/ , https://pagefind.app/docs/config-options/
- Content-addressed packs on R2 with ranged reads: https://github.com/tamnd/kvant-solver/pull/109 · R2 ranged
  `get()`: https://developers.cloudflare.com/r2/api/workers/workers-api-reference/ · Workers Sites manifest model:
  https://github.com/cloudflare/workers-sdk/blob/main/packages/kv-asset-handler/README.md
- Edge composition: https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/ ,
  https://blog.cloudflare.com/edge-side-includes-with-cloudflare-workers/
- `hugo deploy` and sync tools: https://gohugo.io/host-and-deploy/deploy-with-hugo-deploy/ ,
  https://github.com/bep/s3deploy , https://rclone.org/s3/ , https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html

## Appendix · The artifact comparison used in section 2.2

```python
# python3 -I compare_builds.py old-dist.zip new-dist.zip
# Compares two `dist` artifacts by the CRC-32 and size stored in the zip central directory (no extraction).
import sys, zipfile, collections
def index(path):
    return {i.filename: (i.CRC, i.file_size) for i in zipfile.ZipFile(path).infolist() if not i.filename.endswith("/")}
a, b = index(sys.argv[1]), index(sys.argv[2])
stats = collections.defaultdict(lambda: [0, 0, 0, 0])  # files, changed, added, deleted
top = lambda k: "/".join(k.split("/")[:2]) if k.startswith(("ar/", "en/", "ur/", "api/", "pagefind-")) else k.split("/")[0]
for k, v in b.items():
    s = stats[top(k)]; s[0] += 1
    if k not in a: s[2] += 1
    elif a[k] != v: s[1] += 1
for k in a:
    if k not in b: stats[top(k)][3] += 1
for t, s in sorted(stats.items(), key=lambda x: -(x[1][1] + x[1][2])):
    if s[1] or s[2] or s[3]: print(f"{t:36} {s[0]:8} files {s[1]:7} changed {s[2]:7} added {s[3]:7} deleted")
```
