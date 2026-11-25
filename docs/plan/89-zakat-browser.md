# 89. Zakat and Sadaqat Browser — متصفح الزكاة والصدقات

**متصفح الزكاة والصدقات** — a browser over the one graph listing the records of the third pillar as institution.

Scope: named id sets covering practices, concepts (incl. six new asnaf records), persons, events, works and passages + a fatwa-work id pattern; curated records outside the rule join through the `zakat-browser` tag (and keep their section through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec: `docs/engineering/82-zakat-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `zakat` carries the tag, the section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body` landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/zakat/[...page].astro` — the thin route (paginated like the other browsers); strings live in `i18n/<lang>.yaml` under `zakat` plus the shared `shelf` block, in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/zakat.json` — feature export `zakat-browser` with the computed `section` per item, documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `pillar`
- `recipients`
- `rulings`
- `treasury`
- `history`
- `works`
- `fatwas`
- `sunnah`
- `curated`

## What's next

wider curated tagging; deeper prose for the records in this wave; human read of draft records
