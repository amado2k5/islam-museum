# Islam Map — requirements and production test plan

Scope: the full-viewport interactive map at `/<lang>/map` (landing "map" card, Svelte island `MapViewer.svelte`, MapLibre + PMTiles). Every requirement below is testable in production; the checklist at the bottom maps each to a pass/fail check.

## R1 — Visual identity

- **R1.1** Palette is strictly black, white, and gold (`#c5a059` family). No other colors anywhere on the map surface, markers, boundaries, water, or chrome.
- **R1.2** Dark mode: black background with gold linework; light mode: white/ivory background with gold linework. Both themes exist and follow the site's theme toggle.
- **R1.3** Real-world basemap geometry (coastlines, country boundaries, major water) at every zoom level — never an abstract grid or blank canvas.
- **R1.4** Boundaries and labels render in gold on dark, dark-gold/black on light.

## R2 — Viewport and camera

- **R2.1** Full-viewport map (not a cropped card) at mobile, tablet, laptop, and large-screen widths.
- **R2.2** The complete world map is pannable on every viewport size — on narrow screens the user can pan across the whole world, including areas with no Islamic regions and no records for the selected year. The camera must never clamp to a cropped edge.
- **R2.3** Zoom works to city scale; geometry stays legible at all levels.
- **R2.4** A home/exit control returns the user to the landing page or prior view.
- **R2.5** No visible flicker, white flash, or double paint on initial load.

## R3 — Temporal filtering

- **R3.1** A year slider filters map content by CE year; the active year is always visible and its labels are not clipped.
- **R3.2** Slider behavior is data-driven — bounds and steps derive from entity `born`/`died` dates in the graph, never hardcoded ranges.
- **R3.3** Changing the year updates markers and orbit contents without a page reload.

## R4 — Data model and hierarchy

- **R4.1** Markers come from graph person/place/event/object records with coordinates; the map is a view over the one graph, never a side table.
- **R4.2** Drill-down hierarchy: world → region → city → place → entity (person/event/object/relationship).
- **R4.3** Makkah and all major cities are clickable at all zoom levels where they appear.
- **R4.4** Hovering any marker shows a localized label.

## R5 — Entity and orbit views

- **R5.1** Clicking a city opens its context panel and a place orbit showing **all** linked entities (people, events, objects) — never filtered down to the active year alone.
- **R5.2** Entities active in the selected year are prioritized visually; inactive ones remain present and navigable.
- **R5.3** Entity-focused views (person/event/object) show their place anchor, story links, and a back path to the city/world view.
- **R5.4** Markers are usable: minimum touch target ~24px, no marker permanently occluded by toolbar icons.

## R6 — Chrome and layout

- **R6.1** Toolbar sits inside the map stage and below the site header; no overlap with markers or header at any breakpoint.
- **R6.2** The page scrolls normally (map is not a fixed overlay that blocks the rest of the page).
- **R6.3** Step arrows on the year control advance/retreat correctly in LTR and RTL layouts; icon direction follows locale.

## R7 — Localization

- **R7.1** All chrome strings come from i18n files — Arabic (primary, RTL default), English, Urdu. No hardcoded English on the map.
- **R7.2** Entity labels render in the active locale when a translation exists; card titles and region names localize.
- **R7.3** `aria-label`s on all controls are localized.

## R8 — Integration and platform

- **R8.1** Reachable from the landing-page exploration card and site navigation in all three languages.
- **R8.2** Static build only — no runtime server, database, or model calls per visitor request; tiles come from the shipped PMTiles.
- **R8.3** Works without JS for reading entity pages; the map island lazy-loads.
- **R8.4** WCAG 2.2 AA: keyboard-reachable controls, labeled inputs, visible focus.

## Production test checklist

| # | Check | Pass |
|---|-------|------|
| 1 | Open `/{ar,en,ur}/map` — loads in all three locales | |
| 2 | Palette scan — only black/white/gold pixels on map surface | |
| 3 | Toggle theme — gold-on-black and dark-on-white both render | |
| 4 | Zoom 1→10 — real coastlines/boundaries at every level | |
| 5 | At 375px width, pan to Pacific/Atlantic edges — world pans fully | |
| 6 | Drag year slider — markers change, no reload, labels unclipped | |
| 7 | Click Makkah → city panel + orbit; confirm inactive-year entities still listed | |
| 8 | Click a person in orbit → entity view + path back | |
| 9 | Toolbar under header at 375/768/1440px, no icon overlap | |
| 10 | Hover markers — localized labels | |
| 11 | Page scrolls past the map stage | |
| 12 | Home control exits to landing page | |
| 13 | Keyboard: tab to slider and markers, labels/focus visible | |
| 14 | Network: no runtime API/model calls; only static tile/data fetches | |
