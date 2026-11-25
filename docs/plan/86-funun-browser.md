# 86. Arts and Artists Browser — متصفح الفنون والفنانين

**متصفح الفنون والفنانين** — a browser over the one graph listing the arts and their people: calligraphers, painters and illuminators, musicians and singers, architects, and the crafts of the book.

Scope: class-driven membership read from the record itself — person roles/occupations mapped to arts; objects of art keep the collection browser and media-makers keep their own — here the record is the person.
Curated records outside the rule join through the `funun-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/79-funun-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `funun` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/funun/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `funun` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/funun.json` — feature export `funun-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `calligraphy` — Calligraphy
- `visual` — The visual arts
- `music` — Music and song
- `architecture` — Architects
- `bookcrafts` — Crafts of the book
- `curated` — Curated records

## What's next

artistic works (calligraphy albums, treatises on the arts) tagged funun-browser; schools of calligraphy; human read of drafts
