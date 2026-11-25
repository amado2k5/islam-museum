# 85. Sciences and Scientists Browser — متصفح العلوم والعلماء

**متصفح العلوم والعلماء** — a browser over the one graph listing the people of the disciplines by field: astronomers, mathematicians, physicians, geographers, natural scientists and engineers.

Scope: class-driven membership read from the record itself — person roles/occupations mapped to fields; the inventions themselves keep the Muslim Inventions Browser and medical texts keep the Medicine Browser — here the record is the person.
Curated records outside the rule join through the `ulum-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/78-ulum-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `ulum` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/ulum/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `ulum` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/ulum.json` — feature export `ulum-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `astronomy` — Astronomy
- `mathematics` — Mathematics
- `medicine` — Medicine
- `geography` — Geography
- `natural` — The natural sciences
- `engineering` — Engineering
- `curated` — Curated records

## What's next

scientific works and manuscripts tagged ulum-browser; field chips on person pages; human read of drafts
