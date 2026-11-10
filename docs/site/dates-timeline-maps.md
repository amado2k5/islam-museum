# Dates, the time wing, the timeline strip and maps

## Dates are displayed from EDTF and Hijri strings

Data stores each date as an EDTF string (`edtf`, Gregorian or Julian as labelled by `calendar`), optionally a Hijri string (`hijri`), a precision (`year`, `month`, `day`) and a status. The site shows both calendars through `site/src/lib/dates.ts`.

Rules that the code enforces:

- **There is no Hijri year 0.** The year before 1 AH (up to 16 July 622) is **1 BH**, the one before that **2 BH**, and so on. `renderAH` maps any year below 1 to `1 − y` and writes `ق.هـ` (BH) in Arabic. So stored `-0011` renders as **12 ق.هـ**, and a derived 622 CE date before July renders as **1 ق.هـ**. Never print `0 هـ`.
- **Converted Hijri dates are marked.** A Hijri date computed from a Gregorian one gets a trailing `†` and the legend in `i18n` (`entity.dagger`). Dates written in the data are not marked. Do not hand-type a converted date without `derived: true` in the data.
- **"نحو" is for approximations.** An approximate date (`~`) or an unknown part renders with `نحو`. A placeholder digit (`X` after a hyphen, such as `0571-04-2X`) is not a valid date; `validate` rejects it. Decade dates such as `062X` (620–629) are allowed, because EDTF defines them; the lint only rejects an `X` after a hyphen.
- **Dates of the Hijra era are authoritative in the Hijri calendar.** Where the sources date an event by its Hijri year, the CE year can be a year off (8 AH falls in 629 CE, for example). Sorting uses the Hijri date when it exists.

Do not change a date to make the display look better. Correct the source value, or leave it.

## The time wing sort (`site/src/pages/[lang]/[hall]/index.astro`)

The time wing lists entries in chronological order, sorted by `timelineKey` in `dates.ts`:

1. **Key.** If the entry has a Hijri date, its key is that date converted to CE (`hijriToCivil`, then a decimal year). Otherwise it is the CE span start from `span.earliest`. Undated entries get `Infinity` and sort last.
2. **Eras.** A `period` whose start has `precision: year` sorts **after** the events of its start year: its key is the end of that year.
3. **Tie-break.** Equal keys are ordered by the Hijri date (`ord`), so Hunayn (8 AH, Shawwal) follows the conquest (8 AH, Ramadan).

The page asserts that the rendered sequence is non-decreasing and fails the build otherwise. That assertion is the guard; do not remove it to get a build through.

Known limit (not a bug in the sort): an entry dated only to a **month** sorts at the start of that month. Burial and the Saqifa (June 632) therefore sort before the Prophet's death (8 June 632), and the Badr prisoners and Qulayb sort before the battle. The fix is a better source date (a day, or a precise range), not a change to the sort.

## The timeline strip (`site/src/components/TimeStrip.astro`)

The strip shows the entity and its contemporaries on a scale cut from their own dates:

- The scale covers the earliest and latest dates, with a margin of 15% of the width (at least 8 years), and at least 30 years wide.
- Ticks are every 10, 25, 50 or 100 years, chosen by the total width.
- **Build-time assertion:** every marker must lie inside the scale; the component throws otherwise. A fixed range (the old 700–1900) clipped the 622 Hijra marker off the left edge. Do not reintroduce a fixed range.

## Maps

`MiniMap.astro` draws a schematic equirectangular map with no tiles and no third-party requests:

- **Land** comes from `site/src/data/basemap-mena.json`, which is a Natural Earth 10m land extract (public domain), clipped to Egypt to Iran and Yemen to the Caspian, and simplified. Only the rings that fall inside the current map frame are written into the page.
- **Places** come from the graph (`coordinates`). **The route** is a dashed line through the places in the order `placesOf` returns them (by predicate, then by the order written in the data).
- **Waypoints** are ordinary `occurred_at` edges. The Hijra lists Mecca, Ghar Thawr, Quba and Medina in that order (`data/event/hijra.yaml`).
- **Label collisions:** a label that would overlap an earlier one drops below its dot. This is what keeps Mecca and Ghar Thawr readable, which lie about 0.05° apart.
- The map carries a credit line (`entity.map_credit`). Keep it when you change the map.

To regenerate the basemap (only needed if the extent or the simplification changes):

```bash
pip install pyshp
python3 scripts/map/build_basemap.py <path-to-ne_10m_land.shp> site/src/data/basemap-mena.json
```

The source shapefile is not in the repo. The 310 KB JSON is read at build time only; the browser receives just the SVG paths for the map on that page.

When you add a map to a new place, put its places in the graph with coordinates and link them to the event with `occurred_at` (or `site_of` for a site). Do not draw points in the template.
