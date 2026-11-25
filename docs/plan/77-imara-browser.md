# 77. Sacred Architecture Browser — متصفح العمارة الإسلامية

**متصفح العمارة الإسلامية** — a browser over the one graph listing every building on record that is not a tomb or shrine — mosques and minarets, madrasas, palaces, fortresses, libraries, observatories, bimaristans, markets, khans, hammams and gardens.

Scope: class-driven membership read from the record itself — class `building`, kind ≠ tomb/shrine, section = kind family; tombs and shrines stand in the mawt browser and the sanctity reading stays with the Sacred Places Browser.
Curated records outside the rule join through the `imara-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/70-imara-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `imara` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/imara/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `imara` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/imara.json` — feature export `imara-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `mosques` — Mosques and minarets
- `madrasas` — Madrasas
- `palaces` — Palaces
- `defense` — Fortresses and defenses
- `learning` — Libraries and observatories
- `care` — Hospitals (bimaristans)
- `civic` — Markets, khans, hammams and gardens
- `curated` — Curated records

## What's next

per-kind sections over periods, patrons and styles; backdrop media; human read of draft records
