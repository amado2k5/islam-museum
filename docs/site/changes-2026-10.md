# Changes of October 2026: audit fixes (data, integrity, structure, design, accessibility)

An independent audit on 2026-10-12 found pipeline bugs visible in the first minute, a few integrity problems, and design and accessibility faults. This document records what was changed, why, where, and what was decided on the way. Read it before you change the same area, so that you do not undo a fix by accident.

## Part 1: data pipeline, integrity and structure

### Timeline order and the Hijri year 0

| Audit finding | What changed | Where |
|---|---|---|
| Time wing out of chronological order; era listed too early; Badr cluster and Fath Mecca at the end; Hunayn before the conquest; 8 AH entries before 'Umrat al-Qada | Sort by a timeline key: Hijri date when present, else CE span; eras after their start year; Hijri tie-break; undated last. A build assertion checks the order. | `site/src/lib/dates.ts` (`timelineKey`), `site/src/pages/[lang]/[hall]/index.astro` |
| "0 هـ" for 622 CE dates | The Hijri calendar has no year 0. Years before 1 AH render as BH. | `dates.ts` (`renderAH`), `scripts/check-site.ts` |
| Placeholder and corrupted strings: `0571-04-2X`, a mojibake word, `أبو طلب`, `ق.م هـ` | Corrected at the source: the Elephant date is now `0571-04~` (approximate month), the typo is fixed, and Ubayda's `0624-03-1X` became `0624-03` (month precision, as the entry already said). The mojibake was not present in this checkout, so the lint guards against it instead. | `data/event/year-of-the-elephant-and-birth.yaml`, `data/event/abu-talib-gathers-clans.yaml`, `data/person/ubayda-ibn-al-harith.yaml`; lints in `scripts/validate.ts` |

### Duplicates

| Duplicate | Decision | Where |
|---|---|---|
| Hatib's letter: an event and a work | The letter is the **work** (`work/hatib-letter-to-quraysh`). The event copy is removed; its Arabic prose moved to `content/ar/work/hatib-letter-to-quraysh.md`. The event id is kept as an alias of the work. | `data/work/hatib-letter-to-quraysh.yaml`, `content/ar/work/…md` |
| The Khuzaa appeal: an event and a work | The appeal is the **event** (`event/khuzaa-appeal-to-medina`). The work copy is removed and its id is an alias of the event. | `data/event/khuzaa-appeal-to-medina.yaml` |

References were repointed to the survivor. Two edges were changed in meaning, not just in target, and are worth knowing about:
- `passage/quran-60-1` now says it was revealed about **Hatib the person** (`revealed_about` does not accept works). The letter is still named in the note.
- Sara al-Mawla lost her `participated_in` edge to the letter, because no predicate links a person to a work for carrying one.

Old URLs redirect to the survivor through Astro `redirects` (`site/astro.config.mjs`). GitHub Pages cannot send HTTP 301s, so these are generated pages with a meta refresh and a canonical link.

### Structure and copy

- `/sitemap.xml` is a copy of the sitemap index (`site/package.json`, the build script), not a redirect.
- The homepage no longer promises English before it exists: "English is coming" (`i18n/ar.yaml`, `landing.pillars`). `/en/` stays unbuilt and hreflang stays Arabic-only.
- The time wing says what is still being built: the visual timeline (`hall.coming_time`). The homepage points to the coverage page (`landing.coverage`).
- Citations show the build date, not a hardcoded date (`site/src/lib/graph.ts`, `buildDate`).
- `scripts/validate.ts` now runs the content lints and a same-title check. `scripts/check-site.ts` runs after the Astro build and checks the rendered pages.

### Decisions in Part 1 you should know about

- **610 CE renders "12 ق.هـ", not "11".** The stored Hijri value is `-0011`. Under the convention that year 0 is 1 BH, year −11 is 12 BH. The audit expected 11, which is one year short. The data was not changed; it is the author's value.
- **Hijri before CE for ordering.** Early entries are dated in the Hijri calendar in the sources, and the CE year can be a year off (8 AH falls in 629 CE). The Hijri date is therefore the sort key.
- **Cross-class same titles are warnings**, not errors, because a place and an event can share a name legitimately (Ghadir Khumm).
- **`‡` does not occur** in the build, so nothing was removed. The dagger `†` gets a legend.

## Part 2: design, typography, accessibility and the map

Full rules are in [`design-and-accessibility.md`](design-and-accessibility.md) and [`dates-timeline-maps.md`](dates-timeline-maps.md).

| Audit finding | What changed | Where |
|---|---|---|
| 2.1 Gold text fails contrast (2.61:1) | New `--gold-text` token (`#6e5414`, 6.45:1 on ivory). Gold stays for decoration only. | `global.css` |
| 2.2 Tracking on Arabic | Arabic eyebrow already reset tracking to 0. Inline tracking on three Arabic labels moved into a `.kicker` class that is Latin-only. | `global.css`, screen, hall and themes templates |
| 2.3 Flat heading outline | Card titles are real headings at the level the page context requires. Same styling. | `global.css` (`.card .card-title`), Landing, wing, exhibits, questions, screen, themes templates |
| 2.4 Dark muted text washed out | Brightened `--muted` to `#bdb7ac` (8.97:1). The old value was already 7.75:1; the change is a step, as asked. | `global.css` |
| 2.5 Navigation at phone width | A real button opens the full list below 720px, with `aria-expanded`, Escape and focus return. Search and theme toggle stay visible. | `BaseLayout.astro`, `global.css` |
| 2.6 Stacked layouts | Panels stack through `auto-fit`. Verified at 390px: no horizontal scroll on the four pages. | `global.css` |
| 2.7 Timeline strip clipped the 622 marker | Scale cut from the entity's own dates with a margin; build assertion that markers lie inside it. | `TimeStrip.astro` |
| 2.8 Route map is two dots on beige | Self-hosted Natural Earth land basemap, waypoints as `occurred_at` edges (Ghar Thawr and Quba added to the Hijra), label collisions handled, credit line. | `MiniMap.astro`, `scripts/map/build_basemap.py`, `site/src/data/basemap-mena.json`, `data/event/hijra.yaml` |
| 2.9 Year shown twice on time cards | Not reproduced in this build: no title contains a year; each card shows one date line. No change. | — |
| 2.10 Raw identifiers; draft badge | Identifiers render as labelled links; identifiers without a URL pattern are omitted. The completeness badge is a small muted line with a link to the contribute form. | `EntityLayout.astro`, `i18n/*.yaml` (`ids`, `entity.complete_help`), `global.css` (`.status-note`) |
| 2.11 Stray ◀ | It was the browser's native `<summary>` marker. Replaced by a direction-neutral + or −. | `global.css` (`details > summary`) |
| 2.12 Empty media cards | Not reproduced: only one media entity exists (the Badr map), and its figure is already hidden when the file is missing. No change. | `Extras.astro` (existing behaviour) |

### Decisions in Part 2

- **Card heading levels** depend on context, not on a single rule: `h2` directly under the page `h1`, `h3` under a section `h2`, `h4` under a group `h3`.
- **The phone menu needs JavaScript**; without it the nav is visible. This keeps the no-JS reading rule.
- **The map is not MapLibre.** The brief allowed a static or self-hosted basemap, and MapLibre is the Phase 1 plan; the schematic map stays until then.
- **The proposals (time-wing visualisation, visual anchors, bilingual wordmark) were not implemented.** The wordmark needs the founder's approval first.

## Part 4: teen hub page weight (timeline data moved out of the page, 25 Oct 2026)

**Why.** The build's weight check (`scripts/check-weight.ts`) fails the teen hub `/ar/shabab/`: 1.94 MB of HTML against a 200 KB budget, and its Hijri timeline script at 25.7 KB against 12 KB. Two causes, both in the timeline component (`site/src/components/HijriTimeline.astro`):
1. The full event data (about 1.07 MB) was written into the page as a JSON block for the browser script.
2. The SVG drew one marker link for each of the 1,224 dated events.

No event was added by the Omar Abdel Kafi work. The timeline was already showing all events, which made the page too heavy to deploy.

**What changed.**
- The layout and data code moved to `site/src/lib/timeline-model.ts`, so the page and the data file use the same computation.
- The full data is served as `/timeline-data/<lang>.json` (`site/src/pages/timeline-data/[lang].json.ts`). The browser script fetches it (`site/src/scripts/timeline.ts`). If the fetch fails, the page keeps its build-time drawing.
- The page draws 120 markers, spread evenly across the timeline, not all 1,224.
- A new plain list of every dated event is at `/<lang>/timeline/events/`, and the timeline links to it.
- Labels were added in English, Arabic and Urdu under `timeline.all_events_*`.

**Why this shape.** `AGENTS.md` requires every page to be readable without JavaScript. Loading the markers on demand would have hidden events from readers without JavaScript, so it was rejected. The compliant version keeps every event readable without JavaScript (through the list page), and it leaves the timeline's behaviour for users with JavaScript unchanged apart from the data now being fetched.

**Trade-off.** The timeline now shows 120 markers instead of 1,224. Each event is still reachable from the list page. If the cap should change, change `SHOWN` in `HijriTimeline.astro` and rebuild.

## Open items (not fixed; they need source decisions)

- **Month-precision dates sort inside their month.** Burial and the Saqifa (June 632) sort before the death (8 June); the Badr prisoners and Qulayb sort before the battle. Fix the source dates (a day, or a precise range), not the sort. See [`dates-timeline-maps.md`](dates-timeline-maps.md).
- **239 stub entities have English-only labels**, which show on Arabic pages. They need Arabic names.
- **`derive.ts` still sorts its timeline rows by CE span.** That output (`.cache/derived/timeline.json`) is not used by the time wing, but it can disagree with the wing's order. Align it if a page starts to use it.
- **Strip ticks are Gregorian only.** Hijri ticks would need a design decision.
- **"JSON" and the Tanzil credit** on entity pages are English. They are format and licence names and were left as they are.
- **No real device testing** of the phone menu or the map beyond the browser's mobile preset.

## Verification at the time of writing

- `npm run validate`: 0 errors. `npm test`: 40 tests pass. `npm run build`: passes, `check:site` reports 0 errors and 0 warnings across 7,581 pages. `npm run check:static`: 0 runtime-network problems.
- Browser checks: the eyebrow computes to `rgb(110, 84, 20)`; the homepage outline is h1 → h2 → h3; `/ar/time/` is h1 → h2; no horizontal scroll at 390px on the four pages; the phone menu opens, Escape closes it and focus returns; the Hijra strip shows 610–640 with the marker at 622; the theme label is "تبديل الوضع الفاتح" after a fresh load in dark mode; search for مكة returns 228 results with Arabic filter groups.
