# Modern Islam Browser (متصفح الإسلام المعاصر)

**Status: Phase 0, proposal written 6 November 2026 at the founder's request; awaiting the founder's written approval.** No schema, data, site or i18n file has changed. The plan is [`docs/plan/26-modern-islam-browser.md`](../plan/26-modern-islam-browser.md).

The browser is the museum's entrance to the last fifty years of Islam and Muslims, from 1 Muharram 1396 (3 January 1976) to today and into what comes next: nineteen sections (websites and apps, music, films, series, conferences, heritage months and festivals, rights and protest, books, upcoming, figures, organisations, media, sport, awards and competitions, achievements, enterprise, arts, built since 1976, learning) as views over the museum's one graph, with a year ribbon, a world map, a language view, footprint badges (on Wikipedia, in the news) and transparent reach indices.

The order of work follows the founder's instruction of 6 November 2026: **a pilot in production first** (one sourced record per section, the browser pages and the landing-page card), then incremental waves of subjects and prose for as long as the sources last. Research is **browser-first on the founder's Mac**, with any tool installed there that helps, and APIs last.

| File | What it holds |
|---|---|
| [`../plan/26-modern-islam-browser.md`](../plan/26-modern-islam-browser.md) | The plan: window, sections, data model, views and UI, discovery, phases, lanes, editorial rules, risks, acceptance tests, files and labels, decisions for the founder |
| [`taxonomy.yaml`](./taxonomy.yaml) | Sections, new kinds and roles, award kinds, honour results, horizon stages, reach platforms, press kinds, genres, sports, firsts tags, the reach-index weights, the inclusion rule |
| [`seeds.md`](./seeds.md) | The pilot list (one record per section), the first-wave and full targets, the generators, and the named leads per section |
| [`prompt.md`](./prompt.md) | The operative prompt for any agent or model: Prompt A (schema), B (pilot and browser), C (section waves), D (discovery) |
| [`progress.md`](./progress.md) | Status, decisions log (D-000 onward), next step, excluded-items table; one file per section under `progress/` once waves start |
| `queue/<section>.yaml` | Created in Phase 4 per section: leads with state, batch, lead sources, flags, disposition |
| [`../agents/lanes/modern-islam.md`](../agents/lanes/modern-islam.md) | The lane document, planning-only until Phase 1 is approved |

Related plans and lanes it builds on, never duplicates: Screen index (plan 12), Made directory (plan 11), Figures (plan 13), Themes atlas (plan 14), the `modern-figures` lane, the Khutab and Durus Explorer and the Fatwa Explorer (plan 25), the Inventions and Job browsers (their companion-document and site shapes).
