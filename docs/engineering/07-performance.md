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

- Full pipeline ≈ 35 min on GitHub Actions (validate + test parallel to
  build; deploy waits).
- Pages deploy stays under the CF Pages file limit by **stripping**
  `dist/pagefind-*` and `dist/api` before `wrangler pages deploy` — those go
  to R2 instead. (This file-count pressure, not bandwidth, is why the host
  moved from GitHub Pages to CF Pages on 18 Oct 2026.)
- R2 sync is manifest-diffed: only changed chunks are uploaded (typically
  hundreds of PUTs), and sync is skipped entirely when `data/`+`content/`
  are unchanged.
- Validation is total, not incremental — deliberately: correctness beats
  build speed.

## 4. Known scale pressures

| Pressure | State / mitigation |
|---|---|
| Entity growth (~36k files and climbing) | Build time grows linearly; watch Astro build; per-language builds could parallelise if needed |
| Pagefind chunk count | Already mitigated by passage exclusion; a Worker+D1 FTS5 fallback is documented as the upgrade path if indexes get too heavy (plan 03 §7) |
| 3 languages now, more later | Pagefind runs per language; each language multiplies index and page count — language additions are phased (plan 06 Phase 4) |
| Media (maps, illustrations, thumbnails) | Rendered offline on the Mac, committed as static files, served from `site/public/media/` and the media repo/R2 |

## 5. What we explicitly do not optimise for

- Time-to-interactive of islands over no-JS readability (islands lazy-load
  anyway).
- Real-time anything — staleness of up to a day (manual deploy cadence) is
  an accepted trade-off for a museum.
