# 80. Theology and Philosophy Browser — متصفح الكلام والفلسفة

**متصفح الكلام والفلسفة** — a browser over the one graph listing the schools of thought: sects and madhhabs, the mutakallimun and the falasifa, and the works of kalam and falsafa.

Scope: class-driven membership read from the record itself — group kinds sect/madhhab; person roles theologian/philosopher or job mutakallim/faylasuf; works tagged kalam-browser.
Curated records outside the rule join through the `kalam-browser` tag (and keep their section
through the `<slug>-<section>` tag convention the other browsers use). Acceptance spec:
`docs/engineering/73-kalam-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `kalam` carries the tag, the
  section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at
  build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter
  index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section
  nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body`
  landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/kalam/[...page].astro` — the thin route (paginated like the other
  browsers); strings live in `i18n/<lang>.yaml` under `kalam` plus the shared `shelf` block,
  in all seven languages; Explore menu entry under the right group in `site/src/lib/nav.ts`.
- `/api/v1/kalam.json` — feature export `kalam-browser` with the computed `section` per item,
  documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `schools` — The schools and sects
- `mutakallimun` — Theologians (mutakallimun)
- `philosophers` — Philosophers (falasifa)
- `works` — Works and texts
- `curated` — Curated records

## What's next

curated works of kalam and falsafa; perspectives blocks on the debated questions (attributes, qadar, khalq al-Qur'an) each cited and labelled; human read of drafts
