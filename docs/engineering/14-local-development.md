# 14 · Running locally — full offline development on a laptop

The site is static, so "running it offline" means: compile the graph and
the site on your machine, serve `dist/` over plain HTTP. **No Cloudflare,
R2, account, API key or secret is needed.** The only network the build
needs is `npm install` (and, optionally, map tiles — see §6).

## 1. Prerequisites

| Need | Version | Notes |
|---|---|---|
| Node.js | ≥ 22 (CI uses 22+) | `node --version` |
| npm | bundled | two installs: repo root **and** `site/` |
| Python 3.12 | only for `scripts/harvest/` + `scripts/media/` (map renderer) | not needed for the site itself |
| Disk | ~3–4 GB | repo + node_modules + dist |
| RAM | 8 GB+ recommended | full build of ~36k entities is heavy |

## 2. Sequence — from clone to browser

```bash
git clone https://github.com/amado2k5/islam-museum.git
cd islam-museum

# 1. Dependencies (two package.json files)
npm install
npm install --prefix site

# 2. Sanity: validate the whole corpus (takes minutes on 36k+ entities)
npm run validate        # expect: 0 errors (warnings are normal)
npm test                # vitest suite

# 3. Compile the graph → derived layers → static API
npm run graph           # .cache/graph.json   (gitignored, rebuilt every run)
npm run derive          # timelines, map features, journeys, related, on-this-day
npm run api             # site/public/api/v1/**  JSON endpoints

# 4a. Develop (hot reload)
npm run dev             # = graph+derive+api, then `site` astro dev
                        # → http://localhost:4321 (Astro default)

# 4b. Or produce the real static site + search indexes
npm run build           # = prebuild (validate+graph+derive+api) then astro build
                        # + pagefind-ar/-en/-ur indexes into dist/
                        # + check:site + check:weight (integrity + page-weight budgets)
```

`npm run build` produces `dist/` — the entire museum as files. Serve them:

```bash
npm run --prefix site preview     # astro preview (serves dist/)
# or any static server:
npx serve dist                    # → http://localhost:3000
python3 -m http.server -d dist 8080
```

Then open `/ar/`, `/en/` or `/ur/`. The root path redirects by language in
production via a Cloudflare rule; locally just open the language path
directly.

## 3. What works offline vs. what needs thought

| Feature | Offline? | Why |
|---|---|---|
| All entity/hall/exhibit/question/theme pages | ✅ fully | static HTML |
| All prose, data browsing, API JSON (`/api/v1/…`) | ✅ fully | generated into `dist/api/` and `site/public/api/` |
| RTL, honorifics rendering, no-JS readability | ✅ | pure HTML/CSS |
| **Search** | ✅ if built | `npm run build` runs Pagefind per language into `dist/pagefind-<lang>/`; the search page falls back to the local index automatically when `PUBLIC_PAGEFIND_BASE` is unset (see `site/src/pages/[lang]/search/index.astro`) |
| Wander / on-this-day / related entities | ✅ | precomputed into static files |
| Timeline, graph explorer (Sigma.js), islands | ✅ | client-side JS over shipped JSON |
| **Basemap** (interactive map island) | ⚠️ needs the PMTiles file | the basemap lives on R2 in production — see §6 to self-host or skip |
| Event map images / illustrations | ✅ | committed SVG/PNG under `site/public/media/` |
| Fonts | ✅ | `@fontsource/*` — bundled locally, no Google Fonts call |
| Analytics | n/a | none loaded locally |

## 4. Independence from Cloudflare — the mapping

| Production piece | Local equivalent |
|---|---|
| Cloudflare Pages (host) | `astro preview`, `npx serve dist`, `python3 -m http.server`, nginx — anything that serves files |
| R2: pagefind indexes | leave `PUBLIC_PAGEFIND_BASE` unset at build → search uses `/pagefind-<lang>/` inside `dist/` |
| R2: `api/v1` JSON | `dist/api/v1/` is already in the output; in production `/api/*` 301s to `api.islam.museum` — locally the files are served in place (the `_redirects` file is a CF feature; other static hosts ignore it harmlessly) |
| Root → `/[lang]/` Accept-Language redirect | open `/<lang>/` directly, or configure one redirect rule on your server |
| `workers/` (r2-sync, site) | deploy-only plumbing — not needed at all locally |
| GitHub Actions | `npm run build` locally does the same compile steps |
| GitHub Pages mirror | another static server — nothing special |

In short: **the only Cloudflare-specific behaviour baked into the site is
the optional `PUBLIC_PAGEFIND_BASE` env var. Leave it unset and the whole
thing is self-contained.**

Optional tweaks for a fully self-hosted deployment:

- `PUBLIC_PAGEFIND_BASE=` unset (default) — local index paths.
- If you build a custom host and want search anyway at a URL path, keep
  `dist/pagefind-*/` next to the HTML — no change needed.
- `_redirects` (slug renames, `/api/*` 301) — replicate the slug-rename
  lines as nginx/Apache rules only if you care about old URLs; a fresh
  offline deploy doesn't need them.

## 5. Making changes locally (the developer loop)

```bash
# Edit a fact file, then re-check + rebuild what changed:
vim data/person/ibn-sina.yaml
npm run validate && npm test          # required gates
npm run graph && npm run derive && npm run api
npm run --prefix site dev             # or rebuild

# Site changes:
vim site/src/components/Some.astro
npm run build                         # build is required for site/ changes

# If you changed entities/stubs/edges and intend to commit:
npm run coverage                      # regenerates docs/coverage.md — same commit
```

- Authoring conventions: `templates/`, `docs/agents/content-standards.md`.
- New page prose: `content/ar/` first, `en` + `ur` in the same commit.
- Iterating on data only? `npm run dev` re-runs graph+derive+api then
  starts Astro — one command.

## 6. Maps offline (optional)

The interactive map island uses MapLibre + a PMTiles basemap hosted on R2
in production. Options for a laptop:

- **Skip it** — every event map image is a committed static file and every
  page reads fine without the island (no-JS rule).
- **Self-host**: download a Protomaps PMTiles build for your region into
  `site/public/` (or `dist/`), and point the map component's tile URL at
  the local file — range requests work against `astro preview`/`serve`
  natively.
- The deterministic event maps (`scripts/media/maps/render.py`, Natural
  Earth vectors) are already fully offline — that's their design.

## 7. The harvest side is *not* part of local dev

`scripts/harvest/` and `scripts/media/` assume the founder's workspace
(`$HARVEST`, a 1 TB drive, DuckDB, Ollama models, `.venv-harvest` /
`.venv-media`). You do **not** need any of it to run or modify the site —
those pipelines produce PRs of finished content. If you want a mini
harvest anyway, `docs/plan/15-local-harvest.md` §4 has the setup; point the
workspace path at your own disk.
Audio harvest (`scripts/harvest/audio/`) also needs `ffmpeg` and `mlx-whisper`
(setup in `docs/agents/audio-video-harvest.md` §3); it is equally outside the site.

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| `npm run dev` fails immediately | ran `npm install --prefix site`? Both installs are required |
| Search shows the fallback message | you ran `astro dev` only — indexes exist after `npm run build` |
| vitest fails resolving `astro/tsconfigs/strict` | `site/node_modules` missing → `npm install --prefix site` |
| Root `/` 404s locally | expected — open `/ar/` `/en/` or `/ur/` |
| Build is slow / OOM | normal for 36k+ entities; give Node more heap: `NODE_OPTIONS=--max-old-space-size=8192 npm run build` |
| `/api/*` links 404 on a non-Astro static server | check your server doesn't honour `_redirects` (only CF does); serve `dist/api/` in place |

## 9. Minimal offline summary card

```bash
npm install && npm install --prefix site
npm run validate && npm test
npm run build
npm run --prefix site preview   # http://localhost:4321/ar/
```

Four commands, zero accounts, zero secrets, zero cloud.
