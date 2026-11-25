# Theology and Philosophy Browser: requirements (shelves wave)

The browser lists the schools of thought: sects and madhhabs, the mutakallimun and the falasifa, and the works of kalam and falsafa. Everything below is required for acceptance; each item must be true in
the same build.

1. **Membership** — group kinds sect/madhhab; person roles theologian/philosopher or job mutakallim/faylasuf; works tagged kalam-browser. A record tagged `kalam-browser` is a member even when the rule does
   not match it; a `<slug>-<section>` tag names its section.
2. **Sections** — every member stands in exactly one of: schools, mutakallimun, philosophers, works, curated.
3. **No duplication, no side table** — members are ordinary graph records reachable from their
   own pages; the browser never copies data out of the graph.
4. **Page** — `/[lang]/kalam/` exists in all seven languages, readable without JavaScript,
   indexed by Pagefind through `data-pagefind-body`, paginated by `site/src/lib/paged.ts`.
5. **Filter** — the page carries the progressive-enhancement filter (`shelf-filter.ts`) and the
   whole-list index row (`browser-registry.ts`) so the filter box searches every page of the list.
6. **Explore menu** — the browser stands in exactly one `EXPLORE_GROUPS` group in
   `site/src/lib/nav.ts` and the build's group check passes.
7. **i18n** — `i18n/{ar,en,ur,fr,es,tr,id}.yaml` each carry the `kalam` block (title, lede,
   method_note, a title per section) and the `explore.pages.kalam` entry (title, desc, menu).
8. **API** — `/api/v1/kalam.json` is emitted by `scripts/export-api.ts` as feature
   `kalam-browser` with a computed `section` per item and the record's edges; it is listed in
   `site/public/openapi/v1.json` and `llms.txt`.
9. **Docs** — register row in `docs/site/browsers.md`, a lane in `docs/agents/lanes.md`,
   this plan in `docs/plan/` and a CANARY entry in the same commit.
10. **Voice** — record names and summaries render as written; nothing here states a judgement in
    the museum's voice.
