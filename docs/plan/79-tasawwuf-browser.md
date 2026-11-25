# 79. Tasawwuf (Sufism) Browser — متصفح التصوف

**متصفح التصوف** — a browser over the one graph listing the spiritual path: the Sufi orders, the mystics and masters on record, their works and the stations and concepts they named.

Scope: class-driven membership read from the record itself — group kind `order`; person roles mystic/sufi; works and concepts tagged tasawwuf-browser.
Curated records outside the rule join through the `tasawwuf-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/72-tasawwuf-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `tasawwuf` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/tasawwuf/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `tasawwuf` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/tasawwuf.json` — feature export `tasawwuf-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `orders` — The orders
- `masters` — Masters and mystics
- `works` — Works of tasawwuf
- `concepts` — Stations and concepts
- `curated` — Curated records

## What's next

curated works and concepts waves (maqamat, ahwal, the classic manuals); interaction-story waves from the harvested corpus; perspectives blocks where contested; human read of drafts
