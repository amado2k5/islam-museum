# 03 · Architecture — free, static, durable

## 1. Constraints we design around

| Platform | Limit (free) | Implication |
|---|---|---|
| GitHub Pages | Static files only; published site ≤ 1 GB; soft 100 GB/month bandwidth; 10 builds/hour; 100 MB/file | Text-only main repo; media elsewhere; Cloudflare caches HTML so GitHub bandwidth is rarely hit |
| GitHub Actions | 2,000 min/month (private) / generous for public repos | Public repo → effectively free CI; keep builds under ~10 min |
| Cloudflare (DNS+CDN) | Unlimited bandwidth, free SSL, cache rules, redirects, Web Analytics | Cache everything at the edge; privacy-first analytics with no cookies |
| Cloudflare Workers | 100k requests/day, 10 ms CPU | Not needed for visitors; reserved for build-side jobs only if ever required (redirects and headers are Cloudflare rules, not code) |
| Cloudflare R2 | 10 GB storage, free egress, 1M writes/10M reads per month | Thumbnails, map tiles (PMTiles), audio, later 3D models |
| Cloudflare D1 / KV / Vectorize / Workers AI | Free tiers | **Not used on the published site.** No runtime AI, no runtime database (see §13). |
| Cloudflare Pages (alt host) | 20,000 files per deployment, 25 MB/file, 500 builds/month | **The file-count limit rules it out** for the main site at scale (a 10k-entity, 3-language site is >60k files). GitHub Pages wins. Use CF Pages only for PR previews if wanted. |

Decision: **GitHub Pages hosts the site**, built by GitHub Actions (not the legacy Jekyll builder), proxied by **Cloudflare** with aggressive caching. Media on a second GitHub Pages repo (`media.islam.museum`) and/or R2. No runtime compute: the published site is static files only (see §13).

## 2. Stack

| Layer | Choice | Why |
|---|---|---|
| Site generator | **Astro** (5.x, Node 22) with Content Layer | Static-first, zero JS by default, islands for interactive halls, built-in i18n routing, fast builds for tens of thousands of pages, loaders let us feed the compiled graph as a content collection |
| Interactive islands | **Svelte** (small bundles) or Preact | Timeline, map, network graph, Hijri calendar, depth dial, search UI; each lazy-loaded with `client:visible` |
| Styling | Tailwind CSS 4 + design tokens in CSS variables; logical properties (`margin-inline-start`) for RTL | Fast, consistent, RTL by construction |
| Content pipeline | TypeScript scripts in `scripts/`: `validate`, `build-graph`, `derive`, `export-api`, `import-wikidata`, `hijri` | One source of truth: the compiled graph (`.cache/graph.json`) feeds Astro, API export, search, sitemaps |
| Graph library | `graphology` (+ `graphology-traversal`, `graphology-shortest-path`) at build and in the browser | Same data model server/client; path-finder feature ("connect Ibn Sina to Timbuktu") |
| Validation | **JSON Schema (ajv)** + custom rules (EDTF parse, link resolution, license whitelist, required alt text) | Fails CI with precise messages |
| Markdown | remark/rehype with custom plugins: wiki-links, `{cite:}`, `:::directives` | Authoring speed; renders to semantic HTML; no MDX needed |
| Search | **Pagefind** (static, chunked index, multilingual incl. Arabic) | No server; index loads lazily in ~100 KB chunks; filters by wing/class/period/region |
| Maps | **MapLibre GL JS** + **Protomaps PMTiles** basemap (one file on R2, served by range requests) + GeoJSON overlays | Free, offline-capable, no tile API keys; historical labels via our own gazetteer layer |
| Timeline | Custom Svelte + D3 scales (dual Hijri/Gregorian axis), virtualised rows | Off-the-shelf timelines don't do dual calendars or EDTF uncertainty |
| Network graph | **Sigma.js** (WebGL) on graphology | Handles tens of thousands of nodes in-browser |
| Images | Build-time thumbnails (sharp → AVIF/WebP, 320/640/1280) stored in media repo; full-res via institution **IIIF** Image API; deep-zoom with OpenSeadragon | We never host what we don't have rights to; IIIF gives zoom for free |
| Dates | `edtf` npm parser; Hijri conversion via `@umalqura/core` (modern) and a tabular arithmetical converter for historical dates (own script, tests against known anchors) | Correctness; derived values flagged |
| Analytics | Cloudflare Web Analytics (cookieless) | Privacy charter |
| Comments / community | GitHub Discussions + Issue Forms | Free, moderated, no backend |
| Offline | Service worker (Workbox) caching shell + visited pages; optional "download a wing" later | Museum in your pocket |

## 3. Repository layout

```
islam-museum/
├─ CNAME                          # islam.museum
├─ README.md  LICENSE (MIT)  LICENSE-CONTENT.md (CC BY-SA 4.0 / CC0 data)
├─ CONTRIBUTING.md  CODE_OF_CONDUCT.md  GOVERNANCE.md  CLAUDE.md
├─ docs/
│  ├─ plan/                       # these documents
│  ├─ adr/                        # architecture decision records (0001-static-git-graph.md …)
│  ├─ style-guide.md              # voice, transliteration (ALA-LC simplified), honorifics, naming
│  └─ editorial-policy.md
├─ schema/
│  ├─ _base.schema.json           # common fields
│  ├─ person.schema.json … dataset.schema.json  listing.schema.json  screen.schema.json
│  ├─ predicates.yaml             # relationship registry with inverses, domain, range, labels
│  ├─ enums/ (regions, traditions, roles, kinds, disciplines, materials, licenses, themes, story-roles)
│  └─ external-id-patterns.yaml   # wikidata: https://www.wikidata.org/wiki/{id} …
├─ data/                          # language-neutral YAML, one file per entity
│  ├─ person/  group/  polity/  event/  period/  journey/
│  ├─ place/  building/  object/  media/  work/  passage/
│  ├─ concept/  language/  practice/  exhibit/  question/  source/  dataset/
│  ├─ listing/  screen/
│  └─ _stubs.yaml                 # wanted entities referenced but not yet written
├─ content/                       # prose per language, mirrors data/
│  ├─ en/  ar/  (fr/ ur/ tr/ id/ es/ later)
│  └─ en/_pages/ (about, how-to-read, licenses, contribute)
├─ geo/                           # GeoJSON: polity extents by date, routes, regions
├─ datasets/                      # CSV files referenced by data/dataset/*.yaml
├─ i18n/                          # UI strings: en.yaml ar.yaml …
├─ templates/                     # authoring templates per class (yaml + md)
├─ scripts/                       # build pipeline (TypeScript, run with tsx)
│  ├─ validate.ts  build-graph.ts  derive.ts  export-api.ts  export-jsonld.ts
│  ├─ hijri/  (convert.ts, anchors.test.ts)
│  ├─ import/  (wikidata.ts, met-open-access.ts, pleiades.ts)
│  ├─ harvest/ (Python, run on the founder's Mac per 15-local-harvest.md: wikidata/, wikipedia/, quran/, screen/, directories/, web/, promote.py, status.py)
│  ├─ media/   (thumbnails.ts, license-check.ts)
│  └─ report/  (coverage.ts → docs/coverage.md + api/v1/meta/coverage.json)
├─ site/                          # Astro project
│  ├─ astro.config.mjs  tailwind config  package.json
│  ├─ src/
│  │  ├─ layouts/  components/  islands/ (Timeline.svelte, Map.svelte, Graph.svelte, HijriCalendar.svelte, DepthDial.svelte, Search.svelte)
│  │  ├─ pages/[lang]/[class]/[slug].astro   # entity pages
│  │  ├─ pages/[lang]/(time|place|people|ideas|objects|words|living|today)/index.astro
│  │  ├─ pages/[lang]/exhibits/…  questions/…  screen/…  themes/[slug].astro  wander.astro  today.astro
│  │  ├─ pages/api/v1/…           # static JSON endpoints emitted at build
│  │  ├─ loaders/graph.ts         # Astro content loader reading .cache/graph.json
│  │  └─ styles/tokens.css
│  └─ public/ (fonts, favicon, robots.txt, llms.txt, manifest.webmanifest, sw.js)
├─ .github/
│  ├─ workflows/validate.yml (PRs)  deploy.yml (main → gh-pages + Cloudflare purge)  link-check.yml  lighthouse.yml  wikidata-sync.yml (weekly)
│  ├─ ISSUE_TEMPLATE/ (suggest-entity.yml, report-error.yml, request-translation.yml)
│  └─ PULL_REQUEST_TEMPLATE.md  CODEOWNERS
└─ .cache/                        # gitignored compiled graph
```

The **harvest workspace** (raw dumps, licence-layered extracts, local databases, model caches: hundreds of GB) lives outside this repository on the founder's Mac and is never committed; only validated candidates arrive here, by pull request (`15-local-harvest.md`).

A second repo **`islam-museum-media`** (GitHub Pages at `media.islam.museum`, or an R2 bucket behind the same hostname) holds thumbnails, audio snippets, PMTiles. Each media file has a sidecar in `data/media/*.yaml` in the main repo with license and attribution.

## 4. Build pipeline

```
data/ + content/ + geo/ + schema/
        │
        ▼  scripts/validate.ts     — JSON Schema, EDTF, Hijri sanity, link resolution, license whitelist,
        │                             alt text, orphan detection, slug rules, duplicate external IDs
        ▼  scripts/build-graph.ts  — load all entities → graphology graph; add inverse edges;
        │                             normalise dates to [earliest, latest]; attach prose per lang;
        │                             compute: contemporaries, degree, wing membership, breadcrumbs,
        │                             snapshot-year indices, coverage stats → .cache/graph.json
        ▼  scripts/derive.ts       — timeline rows, map features (GeoJSON per wing/period), journey lines,
        │                             network subgraphs (ego graphs per person, dynasty trees), "on this day" index,
        │                             related-entity recommendations (shared neighbours + tags)
        ▼  astro build             — pages per entity per lang, hall pages, exhibits, questions,
        │                             JSON-LD, OpenGraph images (satori) per entity, sitemaps, RSS (new entities, updated exhibits),
        │                             api/v1/*.json, redirects (_redirects → Cloudflare Bulk Redirects or meta refresh)
        ▼  pagefind                — search index over built HTML with data-pagefind-filter attributes
        ▼  deploy                  — push dist/ to gh-pages; call Cloudflare API to purge cache
```

CI on pull requests runs validate + build + link check + Lighthouse budget; a comment on the PR lists the entities changed and a preview (optional Cloudflare Pages preview, since previews don't hit the file-count limit for a long time).

## 5. URLs

```
https://islam.museum/                       → redirect by Accept-Language to /en/ or /ar/ (Cloudflare rule), remembers choice
https://islam.museum/en/person/ibn-sina
https://islam.museum/ar/person/ibn-sina     (same slug in every language; label localized)
https://islam.museum/en/time/               hall pages
https://islam.museum/en/time/year/1000      snapshot year (CE)
https://islam.museum/en/time/hijri/450      snapshot year (AH)
https://islam.museum/en/place/map?at=1258   map at a date
https://islam.museum/en/exhibits/house-of-wisdom
https://islam.museum/en/questions/what-is-sharia
https://islam.museum/en/screen/                 the Screening Room
https://islam.museum/en/screen/al-risala-1976
https://islam.museum/en/themes/medicine
https://islam.museum/en/wander              random entity (static: picks client-side from index)
https://islam.museum/en/today               on this day (Hijri + Gregorian)
https://islam.museum/api/v1/person/ibn-sina.json
https://islam.museum/api/v1/person/index.json
https://islam.museum/api/v1/graph/nodes.ndjson  edges.ndjson
https://islam.museum/api/v1/meta/coverage.json
https://islam.museum/llms.txt  robots.txt  sitemap-index.xml
```

Slugs are ASCII, lowercase, hyphenated, derived from the common English/transliterated name; Arabic-script URL aliases can be added later via redirects. IDs never change; `aliases` produce redirects.

## 6. Cloudflare configuration

- DNS: `islam.museum` and `www` → GitHub Pages (A/AAAA records or CNAME flattening), proxied (orange cloud). `media` → media repo Pages or R2 custom domain.
- SSL: Full (strict); HSTS; always HTTPS.
- Cache rules: cache everything; HTML edge TTL 1 hour, browser 10 min; hashed assets 1 year; `/api/` 1 day with `stale-while-revalidate`. Deploy workflow purges cache.
- Redirect rules: root → language; legacy aliases via Bulk Redirects (free list up to 20 rules; beyond that use static HTML meta-refresh pages generated at build).
- Transform rules: add CORS `Access-Control-Allow-Origin: *` on `/api/*`; security headers.
- Web Analytics: enabled, no cookies.
- No Workers in front of visitors. Random, on-this-day and search run client-side on prebuilt indexes; share cards are built at build time.

## 7. Search

Pagefind indexes rendered pages. Each entity page sets `data-pagefind-body`, plus filters: `data-pagefind-filter="wing"`, `class`, `period`, `region`, `tradition`, `lang`, and sort keys for dates. Arabic stemming is supported; we also index transliteration variants and alternate names (`names[]`) in a hidden metadata block so "Avicenna" finds Ibn Sina. For 50k+ pages the index stays in chunks that load on demand; if it ever becomes too heavy, a Worker + D1 FTS5 fallback is the upgrade path.

## 8. Media strategy

1. **Prefer linking, not hosting.** Objects point to the holding institution's IIIF manifest. The page embeds the IIIF image (deep-zoom) and attributes it. CC0 institutions (Met, Smithsonian, Cleveland, Walters, Rijksmuseum, Wikimedia Commons) also allow us to cache a thumbnail.
2. **Thumbnails** are generated at build in the media repo (AVIF/WebP, 3 sizes) with a license check against a whitelist (`CC0`, `CC BY`, `CC BY-SA`, `PD`, `institution-open`). Anything else fails validation.
3. **Hero images** for people/places use public-domain manuscripts, coins, calligraphy, architecture photos from Wikimedia Commons; the schema requires `alt` in every language published.
4. **Figurative depictions of prophets** are never displayed; `sensitivity: figurative-prophet` forces a text description instead.
5. **Audio** (recitation, poetry readings, pronunciations of names) from open sources (e.g. EveryAyah-type CC recordings, verify license) streamed from R2.
6. **3D / AR** later: glTF in R2, viewed with `<model-viewer>`.

## 9. Performance and accessibility budgets

- Entity page HTML ≤ 120 KB, no JavaScript required to read, images lazy.
- Each island ≤ 150 KB gzipped, loaded on visibility; map tiles and fonts cached by service worker.
- Lighthouse ≥ 95 performance / 100 accessibility on entity pages (CI budget).
- WCAG 2.2 AA; full keyboard navigation; screen-reader tested in both LTR and RTL; `prefers-reduced-motion` respected; font-size and dyslexia-friendly toggles; high-contrast theme.
- Fonts: subsetted WOFF2 self-hosted; Arabic (Noto Naskh Arabic for body, Amiri for Qur'anic text, Reem Kufi for display) and Latin (Source Serif 4 body, Inter UI).

## 10. Internationalisation

- Astro i18n routing with `en` default and `ar` RTL; UI strings in `i18n/*.yaml`; prose per language; labels multilingual in data.
- Fallback chain per page: requested language → English → any; a visible banner "This page is not yet translated — help translate" links to a prefilled GitHub issue.
- Numbers, dates and calendars via `Intl` with per-language preferences (Arabic-Indic digits optional).
- Language order of attack: en, ar → ur, id, tr, fr → es, bn, fa, sw, zh, de, ms, ha, bs.

## 11. Security, privacy, resilience

- No accounts, no cookies, no third-party scripts except Cloudflare Analytics.
- Content Security Policy strict; external embeds (IIIF, YouTube) are opt-in per visitor click.
- Dependabot and lockfile; signed deploys from `main` only; branch protection with required CI.
- Monthly export of the full graph (`api/v1/graph/*.ndjson`) and a GitHub Release; Zenodo DOI per release for citation.
- The site has no runtime dependency: if Cloudflare disappears, GitHub Pages still serves it; if GitHub disappears, any static host serves `dist/`; if the web disappears, the repo is the museum.

## 13. No AI and no compute at runtime (hard rule)

Decision (founder, 11 October 2026): AI exists only in the building phase. Once content is drafted, verified, translated, illustrated and built, the published website is a finished, static artifact.

- **No model answers a visitor.** There is no chat, no "ask the museum", no generated summaries, no on-demand translation, no semantic search service. Every answer a visitor can get is a page or a JSON file that already exists.
- **No server-side code on the visitor path.** No Workers, functions, databases or vector stores serve requests. Cloudflare provides only DNS, TLS, caching, redirects and headers.
- **Everything is precomputed at build time:** search indexes (Pagefind), related-entity recommendations, snapshot years, on-this-day, ego graphs, path-finder adjacency, question-and-answer pages, share cards, derived maps.
- **Interactivity is client-side only** and works on static files: timelines, maps, network views, compare, bookmarks in localStorage, random (client picks from an index), search (client loads index chunks).
- **Community input goes through GitHub** (issue forms, discussions, pull requests), never through a service the site runs.
- **What replaces the AI docent:** the Questions wing (precomputed, reviewed answers to the questions people actually ask), strong static search with synonyms and transliteration variants, and the "wander", "connections" and "path" features built from the graph at build time. Zero-result searches, collected through privacy-preserving analytics, feed new Questions in the next build.
- **Build-time AI stays:** drafting, extraction, judging, translation, illustration and map prompts per `09-ai-content-pipeline.md`, `10-image-generation.md` and `16-event-maps-and-images.md`, always followed by human review before publication.

## 12. Growth path (when free tiers or static limits bite)

| Symptom | Move |
|---|---|
| Build > 15 min | Split Astro build per language or wing into parallel jobs; cache `.cache/graph.json`; incremental builds |
| Site > 1 GB | Move `api/` and OpenGraph images to R2; strip inline JSON-LD duplication |
| Search index too big | Shard the Pagefind index by wing and language and load chunks lazily; precompute per-wing indexes. No server-side search. |
| Need user state | Bookmarks in localStorage first; then Worker + D1 with GitHub OAuth, opt-in |
| Heavy traffic | Already on Cloudflare; nothing changes |
| Institutional partner wants a mirror | `git clone`, `npm run build`, done |
