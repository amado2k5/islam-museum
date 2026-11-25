# 83. Institutions of Learning Browser — متصفح معاهد العلم

**متصفح معاهد العلم** — a browser over the one graph listing the houses of knowledge and care: madrasas, libraries, observatories, bimaristan hospitals and the learned organisations.

Scope: class-driven membership read from the record itself — building kinds madrasa/library/observatory/bimaristan; group kinds university/institution/standards-body/international-organisation; work kind online-library.
Curated records outside the rule join through the `maahid-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/76-maahid-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `maahid` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/maahid/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `maahid` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/maahid.json` — feature export `maahid-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `madrasas` — Madrasas
- `libraries` — Libraries
- `observatories` — Observatories
- `hospitals` — Hospitals (bimaristans)
- `organisations` — Organisations and bodies
- `curated` — Curated records

## What's next

foundation chains (Nizamiyya, al-Azhar, Bayt al-Hikma, Sankore); patron and waqf edges; human read of drafts
