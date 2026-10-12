# Site: how the published site is built and what must stay true

Read this before you change anything under `site/`, `i18n/`, `scripts/validate.ts`, `scripts/check-site.ts`, `scripts/map/` or the date and timeline code. It explains the rules that the code now enforces, where each rule lives, and what to run before a push.

| Document | Read it when |
|---|---|
| [`changes-2026-10.md`](changes-2026-10.md) | You want to know why a piece of the site looks or behaves the way it does now, or what was decided and what is still open. |
| [`design-and-accessibility.md`](design-and-accessibility.md) | You touch colour, type, headings, cards, the header or the menu, or anything at phone width. |
| [`dates-timeline-maps.md`](dates-timeline-maps.md) | You touch a date, a Hijri value, the time wing, the timeline strip, or a map. |
| [`checks.md`](checks.md) | A build or validate step fails, or you want to add a rule. |

## Checklist for any site or data change

1. **Read the rules in this folder for the area you touch** (table above).
2. **Fetch and merge `origin/main` first.** Other sessions edit the same files. Never revert their work; if a merge conflicts, combine both intents and say so in the commit message (see `docs/agents/workflow.md`).
3. **Make the change with the smallest set of files.** Commit explicit paths only (`git add <path>`, never `git add -A`).
4. **Run, in this order, and stop at the first failure:**
   ```bash
   npm run validate && npm test && npm run build
   ```
   `npm run build` runs `validate`, the graph and derive steps, the Astro build, and then `check:site` (the rendered-output assertions). A failure is a real finding: fix the data or the code, do not weaken the check.
5. **Look at the change in a browser** when it is visual: `npm --prefix site run dev` for the dev server, or serve `dist/` with `python3 -m http.server` after a build. Check at 390px width as well as desktop, and in dark mode when colours are involved.
6. **Record the change** in the relevant document here if it changes a rule, a token, a check, or a convention. Add one line to `docs/status.md` only if the change matters to the project's live state.
7. Attribution trailers on the commit (`AI-Agent`, `AI-Model`, `AI-Editor`), as `docs/agents/workflow.md` requires.

## Where the code lives

| Concern | File |
|---|---|
| Design tokens, global type, cards, header menu, disclosure | `site/src/styles/global.css` |
| Header, theme toggle, phone menu script | `site/src/layouts/BaseLayout.astro` |
| Entity page (hero, at a glance, identifiers, timeline and map panel) | `site/src/layouts/EntityLayout.astro` |
| Wing pages (time wing sort and its assertion) | `site/src/pages/[lang]/[hall]/index.astro` |
| Hijri and Gregorian display, timeline sort key | `site/src/lib/dates.ts` |
| Timeline strip | `site/src/components/TimeStrip.astro` |
| Schematic map and its basemap | `site/src/components/MiniMap.astro`, `site/src/data/basemap-mena.json`, `scripts/map/build_basemap.py` |
| Hijri ↔ civil conversion | `scripts/hijri/convert.ts` |
| Data and content lints | `scripts/validate.ts` |
| Rendered-output assertions | `scripts/check-site.ts` |
| UI strings (Arabic first) | `i18n/ar.yaml` (and `i18n/en.yaml` for parity) |
