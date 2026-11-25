# 96. Metals, Money and the Wealthy Browser — متصفح المعادن والأغنياء

**متصفح المعادن والأغنياء** — a browser over the one graph listing the records of gold, silver and the minerals.

Scope: named id sets covering concepts, objects and persons, plus a fatwa-work id-pattern rule for gold/silver/jewellery fatwas; curated records outside the rule join through the `maadin-browser` tag (and keep their section through the `<slug>-<section>` tag convention). This browser is the deliberate counterpart of `masakin`: where that shelf reads poverty and the underdog, this one reads wealth, its material and its people. Acceptance spec: `docs/engineering/89-maadin-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `maadin` carries the tag, the section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at build time.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/maadin/[...page].astro` — the thin route; strings in `i18n/<lang>.yaml`, all seven languages; Explore menu entry under the conduct group in `site/src/lib/nav.ts`.
- `/api/v1/maadin.json` — feature export `maadin-browser` with the computed `section` per item, documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `metals`
- `money`
- `adornment`
- `riches`
- `rulings`
- `fatwas`
- `sunnah`
- `curated`

## What's next

a'yan/safwa concept records; more wealthy figures and hoarded-treasure events; minerals as object records land; human read of drafts
