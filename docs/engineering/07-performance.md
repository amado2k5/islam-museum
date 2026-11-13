# 07 · Performance

## 1. Strategy: move all cost to build time

The site is static, so performance is an edge-cache and payload problem —
not a compute problem. Everything expensive (graph computation, related
entities, "on this day", share cards, maps) is precomputed in CI.

## 2. Budgets and enforcement

| Budget | Mechanism |
|---|---|
| Lighthouse CI on built Arabic pages (RTL = stress case) | `lighthouserc.json`; fonts preloaded; space reserved for the date line to hold CLS |
| Zero-JS readability | Astro ships no JS except lazy islands (`client:visible`) |
| Pagefind | Per-language indexes (`pagefind-ar/-en/-ur`); chunked, content-addressed, loaded lazily ~100 KB at a time; passage (verse) pages excluded via `data-pagefind-body` — cutting chunk count by ~44% (9.5k pages × langs); utility pages carry `data-pagefind-ignore` |
| Images | Build-time thumbnails (sharp → AVIF/WebP, 320/640/1280); full-res from institution IIIF, never re-hosted; deep zoom via OpenSeadragon |
| Maps | One PMTiles basemap on R2, HTTP range requests; GeoJSON overlays; event maps are static SVG/PNG |
| Graph explorer | Sigma.js/WebGL over precomputed subgraphs — no live graph queries |
| Cache headers | Pagefind `immutable, max-age=31536000`; API `max-age=3600, stale-while-revalidate=86400`; hashed assets 1y; HTML edge ~1h |
| API | Static JSON files on R2 — cacheable forever-ish, no per-request cost |
| Page weight | `check:weight` enforces per-route HTML/JS budgets on the education routes (`learn/`, `sighar/` hubs), measured on `dist/` in Arabic (the heaviest script); a breach fails the build — weight is removed, never the budget raised |

## 3. Build performance

Measured on 13 November 2026 (58,128 entities, 202,253 pages); the full account is
[45 · Build and deploy review](45-build-deploy-review.md).

- A build run takes about 1 h 22 min on a GitHub runner: validate, graph, derive
  and API export 8 min; Astro page rendering 27 to 43 min depending on the runner;
  Pagefind 5.5 min; `check:site` and `check:static` about 12 min; packing and
  uploading the artifact under 3 min. Before 13 November it took about 3 h 34 min.
- A job is killed at six hours, so build time is a hard constraint, not a comfort.
- **A page template must never scan the graph or read a file.** The entity template
  runs 180,000 times; two such lookups (`edgesFrom` scanning every edge, `related`
  re-parsing a 7.6 MB file) cost 2 h 20 min of every build until they were indexed
  once in `site/src/lib/graph.ts`. Build an index at module level and look up in it.
- The build is kept as one compressed artifact (`dist-tar`, 1.15 GB). A deploy
  unpacks it; it never copies the whole `dist/` (19 GB, more than the runner's
  documented 14 GB disk).
- The HTML pages, search indexes, API and media are published to R2, not to
  Cloudflare Pages: Pages and Workers static assets both stop at 100,000 files.
  The publish is manifest-diffed, so only changed files are sent; a full rewrite
  (about 360,000 files) takes about 42 minutes at 175 operations a second.
- Validation is total, not incremental — deliberately: correctness beats
  build speed.

## 4. Known scale pressures

| Pressure | State / mitigation |
|---|---|
| Entity growth (58,128 entities, 202,253 pages on 13 Nov 2026) | Render time is pages × milliseconds per page (7.5 ms for an entity page); watch both, and the build run against the six-hour job limit. Next costs and options: doc 45 §7.4 |
| Pagefind chunk count | Already mitigated by passage exclusion; a Worker+D1 FTS5 fallback is documented as the upgrade path if indexes get too heavy (plan 03 §7) |
| 3 languages now, more later | Pagefind runs per language; each language multiplies index and page count — language additions are phased (plan 06 Phase 4) |
| Media (maps, illustrations, thumbnails) | Rendered offline on the Mac, committed as static files, served from `site/public/media/` and the media repo/R2 |

## 5. What we explicitly do not optimise for

- Time-to-interactive of islands over no-JS readability (islands lazy-load
  anyway).
- Real-time anything — staleness of up to a day (manual deploy cadence) is
  an accepted trade-off for a museum.
