# 21 — Landing page and the six interactive explorers (Part 3)

Source of truth for the landing page: `docs/design/landing-mockup.html` (layout, section order, Arabic copy). Colours come from the
site tokens in `site/src/styles/global.css`, not from the mockup, so a later token change applies everywhere at once.

## A. Navigation

The 16-link flat menu became: **الأجنحة ▾** (nine wings with counts) · **جولة وتعلّم** · **استكشف ▾** (timeline, journeys, connections,
revelation, wander) · **اليوم**, then the tools (search, AR | EN, font, theme). Below 720px a hamburger opens the same structure
grouped; `aria-expanded` on the button, Escape closes the menu or an open dropdown, a click elsewhere closes dropdowns.
Questions, Screening Room, Themes, Exhibits, Foundation, Coverage and the data API moved to the three-column footer.

- `site/src/layouts/BaseLayout.astro` (header, footer, menu script), `site/src/lib/nav.ts` (wing counts by class; the Explore
  pages with a `ready` flag — an unfinished explorer shows «قيد الإعداد» and links to the nearest page that exists).
- Dropdowns are native `<details>` elements, so they open without JavaScript.

## B. Landing page

`site/src/components/Landing.astro`: hero with the "this day" ritual (C.1) → the five live pathways + «300 مسار قيد الإعداد» →
the nine wings with counts → the four explorer cards with mini previews → «اكتشف تاريخك الهجري» widget → stats + honesty line →
footer. The widget (`site/src/scripts/hijri-widget.ts`) converts with the museum's own converter (`scripts/hijri/convert.ts`,
bundled for the browser) and looks the day up in the index embedded in the page; nothing is sent anywhere.

Counts: events, places, people, concepts, objects+buildings and passages are counted by class over non-stub entities at build
time; the three uncounted wings (الحياة، اليوم، صُنع) show a phrase. The stats line uses the real entity count and the page
count rounded to the thousand.

## C. The explorers, in build order

| Phase | Route | Status |
|---|---|---|
| C.1 "This day" hero + `/ar/today/` | landing hero; the `today` wing page | **shipped** (12 Oct 2026) |
| C.2 Hijri-primary timeline | `/ar/time/` | **shipped** (12 Oct 2026) |
| C.3 Lifespan ribbons | person pages | **shipped** (12 Oct 2026) |
| C.4 Journey player | `/ar/journey/<slug>/` | **shipped** for درب الهجرة (12 Oct 2026); other journeys keep the static rendering until waypointed |
| C.5 Constellation view | `/ar/graph/?from=` | **shipped** (12 Oct 2026) |
| C.6 Revelation-order reading | `/ar/words/revelation/` | **shipped**, v1 sura level (12 Oct 2026) |

### C.1 details

- `site/src/lib/today.ts` indexes every event whose `date.start` has a day-precision Hijri or EDTF date, by month/day in each
  calendar (25 Hijri-day and 27 Gregorian-day events at the time of writing). A day with no event falls back to the nearest day
  that has one, labelled «أقرب يومٍ له أحداث».
- `TodayCards.astro` renders the build day (so the page reads correctly without JavaScript) and embeds the small index as JSON;
  `today-client.ts` recomputes the viewer's own day with the converter and refreshes the cards. The random button never repeats
  the current event of either card.
- `/ar/today/` is the `today` wing's page: the full lists for both calendars sit above the wing's own entries (the two were one
  route already, so the wing was extended rather than shadowed).
- Build assertions: `npm run build` runs `check-site` and `check-static` (no runtime network calls; the widget's converter is
  bundled).

### C.2 details

- `site/src/lib/timeline.ts` places every event on a decimal Hijri year: from the stored Hijri string when there is one (331 events),
  else converted from the CE span (48 more); one event has no date and stays in the list only. `timeline-layout.ts` is pure and
  shared with the browser: one marker per Hijri year, stacked into lanes, radius by count; era bands are the `period` entities.
- Events before 150 BH (the patriarchs) gather at the edge marker «قبل المحور» rather than stretching the axis by millennia.
- `HijriTimeline.astro` renders the SVG at build time (markers are links, so the chart works without JS) and asserts every
  marker and band lies on the axis. `scripts/timeline.ts` adds the cards, the draggable playhead (`role="slider"`, arrows ±1,
  Shift ±10, Home/End), the هجري/ميلادي toggle and zoom to an era (click a band; «كل القرون» resets).
- The card grid below the chart stays as the no-JS fallback and for screen readers.

### C.3 details

- `TimeStrip.astro` draws the person's bar in gold over the era bands, then up to five contemporaries (computed at build time
  in `build-graph.ts` by lifespan overlap), earliest year at the right in Arabic. Approximate dates fade at the ends and carry
  «نحو». The caption lists eras and contemporaries as plain links.

### C.4 details

- Data: `journey.waypoints[]` (schema in `scripts/gen-schema.ts`): `place`, `day`, `day_status` (a claim status; `debated`
  marks an estimated day, shown as «≈»), `day_note`, `date`, `title`, `narrative` (localized), `events`, `sources`.
  `data/journey/hijra-route.yaml` has eight stations from al-Raheeq al-Makhtum pp. 163-173 (and Ibn Hisham's itinerary);
  the three dated stations (27 Safar, 1 Rabi' I, 8 and 12 Rabi' I) follow the book, the four wadi stations are estimated.
- `JourneyPlayer.astro` draws a schematic route (the stations in order along a drawn curve; most Hijra stations are unlocated
  wadis, so a projection would be false precision — the caption says so), the narrative panel, the facts row (distance when
  recorded, companions from `had_participant`), and the player bar; `scripts/journey.ts` adds play/pause (4.5 s per station),
  the station ticks (`role="tab"`, arrows/Home/End) and the moving marker. The full station list is rendered beneath for
  reading without JavaScript.

### C.5 details

- `scripts/export-api.ts` writes `/api/v1/graph/<class>/<slug>.json` for every non-stub entity with at least one edge: the
  centre, up to 22 first-hop neighbours (best connected first, passages last), then second-hop neighbours to a cap of 40, with
  the forward edges among them. The export throws on a duplicate node id (one node per entity, always).
- `/[lang]/graph/` renders a default centre (`person/muhammad`) with its neighbour list; `scripts/graph.ts` reads `?from=`,
  fetches the JSON (same origin, static), draws rings in SVG (inner ring = first hop, outer = second, hung near its parent),
  curved edges with the predicate labels from `schema/predicates.yaml`, a card on hover/click, re-centre on click (pushState).
  Nodes are focusable (`role="button"`, Enter); the list beside the chart says the same connections in words.
- Every entity page links «استكشف الصلات» → `/ar/graph/?from=<id>` under its connections heading.

### C.6 details

- Data: `revelation_order` (1-114) and `revelation_place` (meccan | medinan) on the 114 sura passages, the Cairo-edition
  chronology as carried by Tanzil's metadata (a well-known ordering, not a unanimous one — the page says so). The Quran
  generator writes the same fields, so a regeneration keeps them.
- `/[lang]/words/revelation/`: one row per sura (order number, mushaf number, مكية/مدنية chip, name, verse count, the
  opening verse from the frozen Tanzil passage), a dotted connector, and the events, people and concepts the graph's
  `revealed_about` edges link to any verse of that sura. A pairing is «مروي» when the edge cites sources and «تقدير» when it
  does not. The toggle ترتيب النزول / ترتيب المصحف switches a CSS `order`; build assertion: 114 suras, each with a sequence
  number and a place. Verse-level refinement is v2.

## Non-goals

No rebrand, no new wings, no runtime model, no third-party script. Each phase ships only when it passes on `/ar/` and `/en/`,
in both themes and with `data-font="sans"`, with a usable no-JS fallback and no horizontal scroll at 390px.
