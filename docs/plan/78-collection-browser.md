# 78. Objects and Artifacts Browser — متصفح المقتنيات والقطع الأثرية

**متصفح المقتنيات والقطع الأثرية** — a browser over the one graph listing the museum's collection by material family — manuscripts and folios, ceramics, tile and glass, metalwork, textiles and carpets, relics, arms and instruments, coins.

Scope: class-driven membership read from the record itself — class `object`, section = material family from kind.
Curated records outside the rule join through the `collection-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/71-collection-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `collection` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/collection/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `collection` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/collection.json` — feature export `collection-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `manuscripts` — Manuscripts and folios
- `ceramics` — Ceramics, tile and glass
- `metalwork` — Metalwork
- `textiles` — Textiles and carpets
- `relics` — Relics
- `arms` — Arms and instruments
- `coins` — Coins
- `other` — Other objects
- `curated` — Curated records

## What's next

museum-object enrichment (culture, period, holding museum, object images); human read of draft records
