# 84. Tombs and Resting Places Browser — متصفح القبور والمدافن

**متصفح القبور والمدافن** — a browser over the one graph listing the resting places: tombs and mausolea, shrines and graves on record.

Scope: class-driven membership read from the record itself — class `building`, kind tomb or shrine.
Curated records outside the rule join through the `mawt-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/77-mawt-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `mawt` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/mawt/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `mawt` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/mawt.json` — feature export `mawt-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `tombs` — Tombs and mausolea
- `shrines` — Shrines
- `curated` — Curated records

## What's next

buried_in edges joining tombs to the people they hold; period and patron chips; human read of drafts
