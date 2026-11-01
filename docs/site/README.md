# Site: how the published site is built and what must stay true

Read this before you change anything under `site/`, `i18n/`, `scripts/validate.ts`, `scripts/check-site.ts`, `scripts/map/` or the date and timeline code. It explains the rules that the code now enforces, where each rule lives, and what to run before a push.

| Document | Read it when |
|---|---|
| [`changes-2026-10.md`](changes-2026-10.md) | You want to know why a piece of the site looks or behaves the way it does now, or what was decided and what is still open. |
| [`design-and-accessibility.md`](design-and-accessibility.md) | You touch colour, type, headings, cards, the header or the menu, or anything at phone width. |
| [`dates-timeline-maps.md`](dates-timeline-maps.md) | You touch a date, a Hijri value, the time wing, the timeline strip, or a map. |
| [`checks.md`](checks.md) | A build or validate step fails, or you want to add a rule. |

## Checklist for any site or data change

1. **Read the rules in this folder for the area you touch** (table above).
2. **Fetch and merge `origin/main` first.** Other sessions edit the same files. Never revert their work; if a merge conflicts, combine both intents and say so in the commit message (see `docs/agents/workflow.md`).
3. **Make the change with the smallest set of files.** Commit explicit paths only (`git add <path>`, never `git add -A`).
4. **Run, in this order, and stop at the first failure:**
   ```bash
   npm run validate && npm test && npm run build
   ```
   `npm run build` runs `validate`, the graph and derive steps, the Astro build, and then `check:site` (the rendered-output assertions). A failure is a real finding: fix the data or the code, do not weaken the check.
   The build is a function of the commit, not the clock: nothing under `site/` or `scripts/` may read the date or `Math.random()` at build time (citation dates come from git, the Hudhud ids are per-page indexes, the landing art strip is seeded from the commit). Two builds of the same commit must produce byte-identical pages; the R2 publish depends on it.
   **Site-wide numbers never go into a shared layout.** A total rendered into every page (the per-wing entity counts the header menu used to carry) rewrites all 110k+ pages on every content commit: measured on 21 October 2026, two builds one content batch apart differed on 112,061 of 112,127 HTML pages for that one reason, against 362 API files for the content itself. The pattern instead: the build writes every such value once into `api/v1/meta/counts.json` (`scripts/export-api.ts`, `scripts/wings.ts`; no timestamp, so the file changes only when a count does), the static HTML keeps the names, blurbs and structure plus the language's template (`data-wing-count="time" data-tpl="{n} events"`), and a few lines of inline script in `BaseLayout.astro` fetch the file the first time the menu opens and fill the numbers. A reader without JavaScript loses only the numbers. The file is served with the API's one-hour `Cache-Control`, so a visitor fetches it once an hour across every page; no storage, no service worker. Add any new site-wide value to that one file, never to a layout or a component the layouts import. The landing page's "Last updated" line follows the same pattern with a file the deploy writes, not the build: `deploy.yml` stamps `api/v1/meta/deploy.json` (`deployed_at`, UTC) before the R2 publish and `site/src/scripts/landing-random.ts` fills the line from it (hidden without JavaScript or without the file). The same script shows a random entry in each landing wing card, picked in the browser from a pool the build fixes by id hash (`featuredPool` in `scripts/wings.ts`), so the page stays byte-stable. A wing with no candidate in the page's language borrows from the next one (Urdu: Arabic, then English), and the link stays in the page's language. Per-page content (related lists, contemporaries) is the opposite case: it stays in the HTML, and its derivation must be stable under insertion (`scripts/derive.ts` caps a big theme at its best-connected members, never its first 200 in file order; `scripts/build-graph.ts` breaks contemporaries ties by id), so adding an entity changes only the pages it genuinely touches.
5. **Look at the change in a browser** when it is visual: `npm --prefix site run dev` for the dev server, or serve `dist/` with `python3 -m http.server` after a build. Check at 390px width as well as desktop, and in dark mode when colours are involved.
6. **Record the change** in the relevant document here if it changes a rule, a token, a check, or a convention. Add one line to `docs/status.md` only if the change matters to the project's live state.
7. Attribution trailers on the commit (`AI-Agent`, `AI-Model`, `AI-Editor`), as `docs/agents/workflow.md` requires.

## Renamed or merged entities: aliases become redirects

Ids are immutable (`AGENTS.md`): a rename or a merge keeps the old id in the surviving entity's `aliases`. The site Worker turns every alias into a 301 in all three languages at deploy time (`workers/site/scripts/bundle-rules.mjs` reads `data/**/*.yaml`, `aliasTarget` in `workers/site/src/route.js` answers `/ar/person/old-slug/` with `/ar/person/new-slug/`), so a cited URL never breaks and nothing has to be added to `site/public/_redirects` for a rename. `_redirects` stays for cross-class moves, non-entity paths and the Pages fallback. An entity deleted without an alias leaves its old URL as a 404: on 21 October 2026 six merged entities shipped that way, which is why the Worker now reads the aliases itself; when you merge, always add the alias.

## Deploying (manual, founder only)

A push to `main` does not deploy. Since 21 October 2026 the work is split in two workflows:

- `.github/workflows/build.yml` ("Build islam.museum") runs on every push to `main`: unit tests and, in parallel, `npm run build` (validation included) and `check:static`, then the whole `dist/` is kept as the artifact `dist`. Only a run whose conclusion is success (tests and build both green) is deployable; the artifact of a failed run is never chosen and expires. One active build per branch: every run, pushed or started by hand, waits its turn in order and runs to its end (`queue: max`); a later push never replaces or stops an earlier build. The five newest successful builds keep their artifacts (founder's rule, changed on 22 October 2026 from one): a final `keep-newest` job, run only when both jobs passed, keeps those five and deletes every other finished run's `dist` artifact, so a failed run never takes a good build's place; the 14-day retention is a safety net, not the mechanism.
- `.github/workflows/deploy.yml` ("Deploy islam.museum to Cloudflare") runs only when the founder starts it (Actions tab or `gh workflow run deploy.yml --ref main`), normally once a day, to keep R2 costs down. It does not build. It downloads the `dist` artifact of a build run (input `build_run_id`; empty means the latest successful build of `main`, which is the default and normally the only artifact there is; a run id means that build, which can be redeployed only while its artifact still exists, so a rollback copy of an older build is kept only when the founder asks for it), checks out that build's commit, deploys the R2 sync Workers and the site Worker (`workers/site`, which serves `/ar/`, `/en/` and `/ur/` from R2), publishes to R2 only the files whose content changed since the last successful publish (redeploying the same build sends nothing: the manifest diff is empty), uploads the rest to Pages, and pings IndexNow. The job summary says which build (run id, commit, date) went live.

- `.github/workflows/deploy-uat.yml` ("Deploy islam.museum to UAT", since 1 November 2026) deploys the same artifact with the same steps to the UAT copy of the hosting (`https://uat.islam.museum`, bucket `islam-museum-uat`, Workers `islam-museum-site-uat` and `islam-museum-r2-sync-uat[-N]`, Pages project `islam-museum-uat`, API at `uat-api.islam.museum`), so the founder can review a build before publishing it to production with the same `build_run_id`. The steps of both workflows live once in `deploy-env.yml`; a GitHub Environment (`production` or `uat`) supplies the bucket, the wrangler environment (`[env.uat]` in the two `wrangler.production.toml`), the Pages project and the keys. UAT is never indexed (its Worker answers `/robots.txt` with `Disallow: /` and marks every response noindex) and touches no production resource. Details: `docs/engineering/06-deployment.md` section 8.

Agents never start the deploy; when a site change needs to be live, ask the founder in chat and name the commits (`docs/agents/workflow.md` section 9). This is why two builds of the same commit must be byte-identical and why no site-wide number may sit in a shared layout: every changed page costs an upload on the next deploy.

## Job Browser routes (Phase 1)

`/[lang]/jobs/` is the Job Browser home: the fourteen domains with their job and people counts, the crafts shelf (jobs with `hirfa: true`), and an A-to-Z list of every job record in the language with a name filter (a few lines of inline script; the full list is in the HTML without it). Every count on that page is read from the graph at build time and appears on that page only. The shared reads are in `site/src/lib/jobs.ts` (holders are the persons whose `occupations:` name the job). `/[lang]/job/<slug>/` is the job page: `EntityLayout.astro` renders the `JobSections.astro` blocks for class `job` (holders by period, the craft panel, workplaces, bodies, related jobs, the "not yet covered" note, which is pulled out of the prose into a note). A person with `occupations:` gets the `CareerStrip.astro` above Connections; a person without them keeps the roles line. Weight budgets for `/ar/jobs/` are in `scripts/check-weight.ts`; `scripts/check-site.ts` asserts the badge and at least one job row on `/ar/jobs/`. Nothing in a shared layout carries a job count.

## Where the code lives

| Concern | File |
|---|---|
| Design tokens, global type, cards, header menu, disclosure | `site/src/styles/global.css` |
| Header, theme toggle, phone menu script | `site/src/layouts/BaseLayout.astro` |
| Entity page (hero, at a glance, identifiers, timeline and map panel) | `site/src/layouts/EntityLayout.astro` |
| Wing pages (time wing sort and its assertion) | `site/src/pages/[lang]/[hall]/index.astro` |
| Hijri and Gregorian display, timeline sort key | `site/src/lib/dates.ts` |
| Entity citation date: the day the entity's data or prose last changed (git commit dates, never the build day, so a page's HTML only changes with its content and the R2 publish re-uploads only what moved) | `scripts/git-dates.ts`, `scripts/build-graph.ts` (`updated`), `site/src/lib/graph.ts` (`updatedOn`) |
| Site-wide totals (per-wing counts in the header menu): one JSON written at build time, filled in by the client, never baked into pages | `scripts/wings.ts`, `scripts/export-api.ts` (`meta/counts.json`), `site/src/lib/nav.ts` (`wingCountTemplate`), `site/src/layouts/BaseLayout.astro` |
| Timeline strip | `site/src/components/TimeStrip.astro` |
| Feature pages `/future/` (2077 imagination) and `/world/` (the Muslim world today: dataset `site/src/data/muslim-world.json`, flags `WorldFlag.astro`, landing teasers `FutureStrip.astro`/`WorldStrip.astro`); page styles are scoped inside the page/components — never added to `global.css`, which is inlined into every page and would change every page's weight | `site/src/pages/[lang]/future/index.astro`, `site/src/pages/[lang]/world/index.astro`, `site/src/components/FutureScenes.astro` |
| Schematic map and its basemap | `site/src/components/MiniMap.astro`, `site/src/data/basemap-mena.json`, `scripts/map/build_basemap.py` |
| Hijri ↔ civil conversion | `scripts/hijri/convert.ts` |
| Data and content lints | `scripts/validate.ts` |
| Rendered-output assertions | `scripts/check-site.ts` |
| UI strings (Arabic first) | `i18n/ar.yaml` (and `i18n/en.yaml` for parity) |

## Timeline Explorer (go-live notes)

Public name: «مستكشف الخط الزمني» / Timeline Explorer / «ٹائم لائن ایکسپلورر». The URL stays `/<lang>/time-browser/`.

- **Data:** `scripts/time-browser-explorer.ts` reads `.cache/graph.json` and writes `.cache/time-browser/explorer.json` and `explorer-index.json`: curated subjects (people, eras, places), each with 4–14 ordered nodes. A record is eligible when it meets the publication standard (cited, defined sources, recorded provenance), whatever its draft flag; the draft flag is never shown. The build fails on a chronology inversion or an uncited node. It runs inside `prebuild`.
- **Pages:** `/<lang>/time-browser/` (subject search, journeys, shelves), `/<lang>/time-browser/s/<class>/<slug>/` (the stage: focal card, strip, rail, details and map dialogs, kids toggle, node in `?node=`), `/<lang>/time-browser/guide/`. `/<lang>/time-browser/all/` is an unlinked, noindex QA list. Old `/<lang>/time-browser/<kind>/<slug>/` pages redirect to the museum entry.
- **Entry points:** the homepage feature band after the day-cards (`site/src/components/ExplorerModule.astro`), the Explore menu, and "Explore the timeline" on each entity that is a subject.
- **Dates:** formatted with `site/src/lib/dates.ts` (Hijri and Gregorian, approximate and debated chips). No raw EDTF string is rendered.
- **Rules:** no runtime AI, no AI prompt or chat, no sign-in, no request from the page. The backdrop is a colour wash: no generated or stock imagery.
- **Checks before deploy:** `npm run validate`, `npm run cite-check -- <ids>` on the subjects and nodes, `npm test` (`scripts/time-browser*.test.ts`), `npm run build`, `npm run check:static`, `npm run check:weight`.
- **Known open items:** Ibn Khaldun has 3 eligible nodes, so he does not ship yet; curated backdrop media per node; the "early Ottoman" era uses the gunpowder-empires period; a native Urdu review of the new strings.
