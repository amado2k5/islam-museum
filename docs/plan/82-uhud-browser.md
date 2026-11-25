# 82. Covenants and Diplomacy Browser — متصفح العهود والدبلوماسية

**متصفح العهود والدبلوماسية** — a browser over the one graph listing recorded diplomacy: treaty-family events (treaty, declaration, truce, pact, peace, armistice, capitulation, covenant, alliance), charter works and the diplomats on record.

Scope: class-driven membership read from the record itself — event kinds of the treaty family; work kind `charter`; person roles diplomat/ambassador or job diplomat.
Curated records outside the rule join through the `uhud-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/75-uhud-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `uhud` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/uhud/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `uhud` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/uhud.json` — feature export `uhud-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `treaties` — Treaties and pacts
- `declarations` — Declarations
- `charters` — Charters and covenants
- `envoys` — Envoys and diplomats
- `other` — Other diplomatic events
- `curated` — Curated records

## What's next

event-kind vocabulary audit (truce/armistice coverage); delegation and embassy events as they are mined; map layers; human read of drafts
