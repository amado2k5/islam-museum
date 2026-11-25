# 94. Transactions and Personal-Status Fiqh Browser — متصفح المعاملات والأحوال الشخصية

**متصفح المعاملات والأحوال الشخصية** — a browser over the one graph listing the records of the fiqh of dealings domain by domain.

Scope: named id sets covering concepts and practices across seven legal domains, plus a fatwa-work id-pattern rule that classifies `work/fatwa-*` records into their domain sections (unmatched fatwas stand in `fatwas`); curated records outside the rule join through the `muamalat-browser` tag (and keep their section through the `<slug>-<section>` tag convention the other browsers use). The corpus-side reading of halal/haram, the five rulings and the hudud stays with the Halal, Rulings and Hudud browsers; this browser is the domain shelf — the concepts, practices, works and fatwas of each legal area. Acceptance spec: `docs/engineering/87-muamalat-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `muamalat` carries the tag, the section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at build time, so a record that matches appears the day it lands — no tagging step, no side table.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page: badge, lede, method note, section nav, filter box, one card grid per section, `PagedNav` pagination and the `data-pagefind-body` landing; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/muamalat/[...page].astro` — the thin route (paginated like the other browsers); strings live in `i18n/<lang>.yaml` under `muamalat` plus the shared `shelf` block, in all seven languages; Explore menu entry under the conduct group in `site/src/lib/nav.ts`.
- `/api/v1/muamalat.json` — feature export `muamalat-browser` with the computed `section` per item, documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `inheritance`
- `marriage`
- `transactions`
- `food`
- `intoxicants`
- `punishments`
- `fatwas`
- `sunnah`
- `curated`

## What's next

deeper id coverage per domain (mudaraba, musharaka, salam, wadi'a as records land); fatwa-keyword tuning; human read of draft records
