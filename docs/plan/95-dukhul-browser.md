# 95. Entering Islam Browser — متصفح دخول الإسلام

**متصفح دخول الإسلام** — a browser over the one graph listing the records of the door to Islam both ways.

Scope: named id sets covering persons, events and concepts, plus an event-id pattern (`islam-of-*`, `conversion-of-*`, `*-converts?-to-islam`) that lets harvested conversion events join automatically; curated records outside the rule join through the `dukhul-browser` tag (and keep their section through the `<slug>-<section>` tag convention). The Ridda wars also stand in the Zakat browser's history section — the shelves reuse records, never duplicate them. Acceptance spec: `docs/engineering/88-dukhul-browser-requirements.md`.

## Architecture (the shelves pattern)

- `scripts/shelves.ts` — the shared spec registry `SHELVES`: `dukhul` carries the tag, the section ids, `pick(n)` and `sectionOf(n)`; membership is computed over the compiled graph at build time.
- `site/src/lib/shelves.ts` — `shelfItems(slug)`: the same array the page, the whole-list filter index (`site/src/lib/browser-registry.ts`) and the API export (`scripts/export-api.ts`) draw from.
- `site/src/components/sig/ShelfPage.astro` — the shared page; `site/src/scripts/shelf-filter.ts` is the progressive-enhancement filter.
- `site/src/pages/[lang]/dukhul/[...page].astro` — the thin route; strings in `i18n/<lang>.yaml`, all seven languages; Explore menu entry under the conduct group in `site/src/lib/nav.ts`.
- `/api/v1/dukhul.json` — feature export `dukhul-browser` with the computed `section` per item, documented in `site/public/openapi/v1.json` and `llms.txt`.

## Sections

- `converts`
- `modern`
- `leavers`
- `rulings`
- `sunnah`
- `curated`

## What's next

more `islam-of-*` events as the seerah is mined; modern convert records as they land; a perspectives block on ridda rulings; human read of drafts
