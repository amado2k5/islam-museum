# 81. Women of Islam Browser — متصفح نساء الإسلام

**متصفح نساء الإسلام** — a browser over the one graph listing every female person record grouped by her roles — Companions, scholars, mystics, writers, artists, rulers, athletes and society.

Scope: class-driven membership read from the record itself — class `person`, gender female; section = first matching role family.
Curated records outside the rule join through the `nisa-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/74-nisa-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `nisa` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/nisa/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `nisa` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/nisa.json` — feature export `nisa-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `companions` — Companions and early Muslims
- `scholars` — Scholars and transmitters
- `piety` — Mystics and devotees
- `writers` — Writers and poets
- `arts` — Artists and performers
- `rulers` — Rulers and leaders
- `sports` — Athletes
- `society` — Society and daily life
- `curated` — Curated records

## What's next

the muhaddithat wave already queued in the coverage programme; fuller prose for the high-link women; human read of drafts
