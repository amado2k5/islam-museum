# 16 · Event maps and images — rendering every battle, war and incident locally

A concrete step that sits between the content pipeline (09), the image plan (10) and the local harvest (15): for every `event` of a spatial kind (battle, siege, campaign, war, conquest, treaty, migration, revolt, massacre, disaster, assassination, council, founding) the Mac renders **(a) a map** programmatically from data and **(b) a scene illustration** from a diffusion model, both reproducible, both labelled, both stored with provenance. This document specifies the data the renderer and the model need, the toolchain, the scripts, the prompt packs, and a seed table of approximate coordinates for the major events from 570 CE to today.

## 1. What gets rendered

| Output | How | For which events | Format |
|---|---|---|---|
| **Locator map** | programmatic | every event with a place | SVG + PNG, 3:2, Arabic labels (English in Phase 4) |
| **Battle or siege schematic** | programmatic, from a `map` block in the event YAML | battles, sieges, naval battles | SVG + PNG, 1:1 and 3:2 |
| **Campaign or war map** | programmatic, from child events and legs | wars, campaigns, conquests, revolts, migrations | SVG + PNG, 3:2 and 21:9 |
| **Polity context layer** | programmatic, from `geo/polity/*.geojson` at the event date | all | drawn under the above |
| **Scene illustration** | diffusion model (10 §2), from a *scene brief* derived from data | all spatial events | PNG 1536 × 1024 |
| **Aftermath or memorial image** | diffusion model, restricted template | massacres, atrocities, disasters | PNG, landscape only |

Maps are evidence-like and are drawn only from sourced data with precision flags. Illustrations are explicitly "artist's impression" and follow the figure policy in 10 §8.2: no figures at all for the Prophetic era, distant figures elsewhere, never gore.

## 2. Data the renderer needs (additions to the scaffold)

### 2.1 `map` block on `event` (add to `schema/event.schema.json`)

```yaml
map:
  kind: battle                     # locator | battle | siege | naval | campaign | route | area
  precision: schematic             # site | locality | approximate | schematic (controls the "approximate" badge and the dashed styling)
  center: [23.77, 38.79]           # [lat, lon]; defaults to occurred_at place coordinates
  extent_km: 12                    # width of the framed area; 3–15 for battles, 50–500 for campaigns, 1000+ for wars
  basemap: terrain                 # terrain | plain | sea
  date_for_borders: "0624"         # which polity extents to draw underneath (EDTF)
  features:                        # all optional; each needs a source
    - { type: point, role: well, label: { en: "Wells of Badr", ar: "آبار بدر" }, at: [23.775, 38.795], source: source/watt-1956-medina }
    - { type: point, role: camp, side: 0, label: { en: "Muslim camp" }, at: [23.78, 38.80], precision: schematic, source: source/ibn-ishaq-guillaume }
    - { type: point, role: camp, side: 1, label: { en: "Quraysh camp" }, at: [23.76, 38.78], precision: schematic, source: source/ibn-ishaq-guillaume }
    - { type: line, role: advance, side: 1, from: [23.70, 38.75], to: [23.76, 38.78], source: source/watt-1956-medina }
    - { type: line, role: march, side: 0, path: [[24.47, 39.61], [24.1, 39.2], [23.78, 38.80]], label: { en: "From Medina" } }
    - { type: polygon, role: terrain, subkind: dune, geometry: geo/event/battle-of-badr-dune.geojson }
    - { type: point, role: landmark, subkind: hill, label: { en: "al-Udwa" }, at: [...] }
  legend: true
  sources: [source/watt-1956-medina, source/ibn-ishaq-guillaume]
  note: { en: "Positions are schematic, following Watt's reconstruction of Ibn Ishaq's account; no archaeological survey exists." }
```

Feature roles: `well`, `spring`, `camp`, `line` (battle line), `advance`, `retreat`, `flank`, `march`, `siege_line`, `wall`, `gate`, `fort`, `ship`, `landmark` (hill, pass, ford, bridge, mosque, tower), `terrain` (dune, lava field, marsh, wadi, forest), `city`, `area` (affected area, deployment), `event_point` (where something specific happened). `side` indexes the event's `sides[]` so colours and names come from data.

### 2.2 `geo/` folder (new)

```
geo/event/<slug>-<feature>.geojson     polygons and long paths referenced by map features
geo/polity/<slug>-<year>.geojson       dated extents with precision (02 §6)
geo/journey/<slug>.geojson             routes
geo/region/<id>.geojson                the 14 museum regions
```

### 2.3 `media` kinds (add `map` and `illustration` to `schema/media.schema.json` kind enum)

```yaml
id: media/map-event-battle-of-badr
class: media
kind: map
label: { en: "Schematic map of the Battle of Badr", ar: "خريطة تخطيطية لغزوة بدر" }
alt: { en: "Map of a desert valley with wells; two camps marked schematically on either side; an approach route from the south-west.", ar: "..." }
depicts: [event/battle-of-badr, place/badr]
generated: { tool: scripts/media/maps/render.py, version: "0.1", inputs_hash: "sha256:…", date: 2026-11-10 }
precision: schematic
basemap_sources: [source/natural-earth, source/srtm]
license: CC0-1.0
files: { svg: img/map-event-battle-of-badr/map.svg, png: img/map-event-battle-of-badr/1536.png, svg_ar: …, png_ar: … }
```

### 2.4 Scene brief (derived, not stored by hand)

`scripts/media/brief.py` builds, for each event, a JSON brief the prompt generator consumes. Everything comes from data, so a brief can be regenerated at any time:

```json
{
  "id": "event/battle-of-badr",
  "kind": "battle",
  "date": { "edtf": "0624-03-13", "hijri": "0002-09-17", "season": "spring", "time_of_day": "dawn" },
  "place": { "label": "Badr", "coords": [23.77, 38.79], "terrain": "sandy valley between low rocky hills; wells; scattered palms", "climate": "hot desert", "elevation_m": 130 },
  "region": "arabia", "period": "prophetic-era",
  "sides": [ { "label": "Muslims of Medina", "dress": "simple Hijazi robes, cloth head-covers, leather shields, spears; few horses, camels" },
             { "label": "Quraysh of Mecca", "dress": "Meccan merchants' robes, mail shirts for a few, horses, camels, banners of plain cloth" } ],
  "material_culture": "no firearms, no fortifications, tents of goat hair, waterskins, palm-fibre ropes",
  "figure_policy": "none",
  "sensitivity": ["prophetic-era"],
  "mood": "still, expectant, dawn before anything happens",
  "avoid_anachronisms": ["minarets (none in 624)", "domes", "paper", "plate armour", "stirrups debated: omit"],
  "sources": ["source/watt-1956-medina", "source/ibn-ishaq-guillaume"]
}
```

Terrain comes from the place record and a small offline lookup (elevation and landcover sampled from public-domain rasters at the coordinates). Dress and material culture come from a **period × region accuracy table** (`scripts/media/accuracy.yaml`) written once by hand with sources, so every prompt in a period shares the same correct details.

## 3. Toolchain on the Mac (all offline after download)

```bash
# geospatial Python stack for map rendering, plus Arabic shaping for labels
cd ~/Documents/GitHub/islam-museum && source .venv-media/bin/activate && uv pip install geopandas shapely pyproj matplotlib rasterio cartopy arabic-reshaper python-bidi pyyaml tqdm pillow
```

```bash
# public-domain basemap data: Natural Earth 10 m (coast, land, rivers, lakes, ocean, shaded relief) into the harvest workspace
mkdir -p ~/islam-museum-harvest/basemaps && cd ~/islam-museum-harvest/basemaps && for f in physical/ne_10m_coastline physical/ne_10m_land physical/ne_10m_rivers_lake_centerlines physical/ne_10m_lakes physical/ne_10m_ocean raster/SR_HR; do curl -sLO "https://naciscdn.org/naturalearth/10m/${f}.zip" && unzip -oq "$(basename $f).zip"; done && ls
```

```bash
# elevation for hillshade and terrain lookups: SRTM 90 m tiles for the Islamic world are large; start with the global 1 km GTOPO30/ETOPO (public domain) and add SRTM tiles per region later
curl -sLo etopo.zip "https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO1/data/ice_surface/grid_registered/netcdf/ETOPO1_Ice_g_gmt4.grd.gz"
```

(Verify current download URLs; Natural Earth and ETOPO are public domain, SRTM is public domain. OpenStreetMap-derived data is ODbL and is not used for rendered maps that we release as CC0; it may be used in the site's interactive map with attribution.)

Fonts: Amiri and Noto Naskh Arabic for Arabic labels, Source Serif 4 for Latin (installed in 10 §3.1). Matplotlib renders Arabic correctly once labels pass through `arabic_reshaper` and `python-bidi`.

## 4. The map renderer

`scripts/media/maps/render.py` (outline; one SVG and one PNG per language per event):

```python
#!/usr/bin/env python3
"""Render event maps from data/event/*.yaml map blocks, Natural Earth basemaps and geo/ overlays. Deterministic."""
import sys, json, hashlib, pathlib, yaml
import geopandas as gpd, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from shapely.geometry import Point, LineString, box
import arabic_reshaper
from bidi.algorithm import get_display

BASE = pathlib.Path.home() / "islam-museum-harvest/basemaps"
OUT = pathlib.Path("../islam-museum-media/img")
STYLE = { "land": "#F7F3EA", "sea": "#DCE6EE", "river": "#9FB8CC", "relief_alpha": 0.35,
          "side": ["#1F4E8C", "#B8932F", "#0F5F5C", "#8C2F1F"], "text": "#1B1B1F", "approx": (0, (4, 3)) }

def ar(s):  # shape + reorder Arabic for matplotlib
    return get_display(arabic_reshaper.reshape(s))

def label(ax, x, y, text, lang, **kw):
    ax.annotate(ar(text) if lang == "ar" else text, (x, y), fontsize=9, color=STYLE["text"],
                fontfamily="Amiri" if lang == "ar" else "Source Serif 4", ha="left" if lang == "en" else "right", **kw)

def frame(center, extent_km, ratio=1.5):
    lat, lon = center; dlat = extent_km / 111.0 / 2; dlon = dlat * ratio / max(0.2, abs(__import__("math").cos(__import__("math").radians(lat))))
    return box(lon - dlon, lat - dlat, lon + dlon, lat + dlat)

def render(event_path, lang):
    ev = yaml.safe_load(open(event_path)); m = ev["map"]
    bbox = frame(m["center"], m["extent_km"])
    fig, ax = plt.subplots(figsize=(9, 6), dpi=200); ax.set_facecolor(STYLE["sea"])
    for layer, colour in (("ne_10m_land", STYLE["land"]), ("ne_10m_lakes", STYLE["sea"])):
        gpd.read_file(BASE / f"{layer}.shp", bbox=bbox).plot(ax=ax, color=colour, linewidth=0)
    gpd.read_file(BASE / "ne_10m_rivers_lake_centerlines.shp", bbox=bbox).plot(ax=ax, color=STYLE["river"], linewidth=0.6)
    # optional shaded relief raster clipped to bbox (rasterio) → ax.imshow(..., alpha=STYLE["relief_alpha"])
    # dated polity extents under everything else: geo/polity/*-<year>.geojson matching m["date_for_borders"]
    for f in m.get("features", []):
        dashed = STYLE["approx"] if f.get("precision") in ("approximate", "schematic") or m["precision"] == "schematic" else "solid"
        colour = STYLE["side"][f["side"]] if "side" in f else STYLE["text"]
        if f["type"] == "point":
            x, y = f["at"][1], f["at"][0]; ax.plot(x, y, marker={"well": "o", "camp": "^", "landmark": "s", "city": "D"}.get(f["role"], "o"), color=colour, ms=6)
            if "label" in f: label(ax, x, y, f["label"].get(lang) or f["label"]["en"], lang, xytext=(5, 5), textcoords="offset points")
        elif f["type"] == "line":
            pts = f.get("path") or [f["from"], f["to"]]; xs, ys = [p[1] for p in pts], [p[0] for p in pts]
            ax.plot(xs, ys, color=colour, linewidth=1.6, linestyle=dashed)
            if f["role"] in ("advance", "retreat", "march", "flank"): ax.annotate("", xy=(xs[-1], ys[-1]), xytext=(xs[-2], ys[-2]), arrowprops=dict(arrowstyle="->", color=colour, lw=1.6))
        elif f["type"] == "polygon":
            gpd.read_file(f["geometry"]).plot(ax=ax, facecolor=colour, alpha=0.15, edgecolor=colour, linestyle=dashed)
    ax.set_xlim(bbox.bounds[0], bbox.bounds[2]); ax.set_ylim(bbox.bounds[1], bbox.bounds[3]); ax.set_aspect(1 / max(0.2, abs(__import__("math").cos(__import__("math").radians(m["center"][0]))))); ax.axis("off")
    title = ev["label"].get(lang) or ev["label"]["en"]; ax.set_title(ar(title) if lang == "ar" else title, loc="right" if lang == "ar" else "left", fontsize=12, fontfamily="Amiri" if lang == "ar" else "Source Serif 4")
    if m["precision"] in ("approximate", "schematic"): fig.text(0.01, 0.01, ar("مواقع تقريبية") if lang == "ar" else "Positions approximate", fontsize=7, color="#6B6660")
    out = OUT / f"map-{ev['id'].replace('/', '-')}"; out.mkdir(parents=True, exist_ok=True)
    fig.savefig(out / f"map.{lang}.svg", bbox_inches="tight"); fig.savefig(out / f"1536.{lang}.png", bbox_inches="tight"); plt.close(fig)
    return out

if __name__ == "__main__":
    for p in sorted(pathlib.Path("data/event").glob("*.yaml")):
        if "map" in yaml.safe_load(open(p)):
            for lang in ("en", "ar"): print(render(p, lang))
```

Campaign and war maps use the same renderer with `kind: campaign`: the features are generated from the war's child events (`has_part`) placed at their `occurred_at` coordinates with dates, joined by `march` lines in chronological order per side, and the extent computed from the children.

A scale bar, a north arrow, a legend built from `sides[]`, and the dated polity layer are added once the first ten maps look right. The renderer is deterministic: the same inputs give the same SVG, and the `inputs_hash` in the media record proves it.

## 5. Scene illustrations for events

`gen-prompts.py` (10 §6.1) gains an event branch that reads the scene brief and fills the template for the event kind. House style prefix and suffix from 10 §8.1 wrap every prompt.

| Event kind | Template core | Figures | Extra rules |
|---|---|---|---|
| battle (Prophetic era) | "The setting of {label} at {place}: {terrain}, {season} {time_of_day}; the ground where it will happen, empty; {material_culture} hinted by a few abandoned objects" | none | no weapons in foreground, no blood |
| battle (later) | "{terrain} at {time_of_day} with two forces as distant lines of {dress_side_0} and {dress_side_1} facing across the ground, banners as plain cloth, dust" | distant | no faces, no gore, no identifiable commanders |
| siege | "{city_architecture} walls and towers of {place} seen from the besiegers' camp of tents at {distance}, siege works of the period ({siege_tech}), {season}" | distant | siege_tech from accuracy table (mangonels before 1300; cannon after) |
| naval | "{ship_types} of {period} in {sea_name} under {weather}, a coastline of {coast_terrain} behind" | distant | ship types per period (dhow, galley, galleon) |
| campaign / conquest | "A column of {dress} on the move through {terrain_between}, baggage camels or wagons, a far horizon toward {destination}" | distant | |
| treaty / council / meeting | "The place of {label}: {setting} with seating of the period prepared and empty, {objects} on a cloth, {light}" | none | no documents with legible text |
| migration / hijra | "A path of {mode} tracks through {terrain} at {time_of_day}, a distant {destination_sign}" | none | |
| revolt / uprising | "{city_architecture} street at dawn after a night of unrest: overturned stalls, a torn banner, lamps still lit, quiet" | none or distant | no violence depicted |
| massacre / atrocity | **aftermath template only**: "{landscape or town} after {label}: silence, scattered belongings, a broken wall, a single lamp or a tree; morning light" | none | never bodies, blood, fire in progress; labelled "memorial image" |
| disaster (earthquake, flood, plague) | "{place} with {damage_type} seen from a distance, people absent, {season}" | none | |
| assassination | "The place where {label} occurred: {interior_or_street}, empty, a dropped object, light through a door" | none | |
| founding (city, mosque, institution) | "The site of {place} at founding: surveyors' stakes and ropes on open ground, first courses of {materials}, a river or well, {season}" | none or hands | |
| revelation / religious event | landscape and light only; no symbolic figures of angels | none | |

### Worked prompts (ready to paste after the house-style prefix)

1. **Battle of Badr (624)** — "The setting of the Battle of Badr at the wells of Badr, Arabia: a sandy valley floor between low dark rocky hills, a few stone-lined wells, scattered date palms, a long dune on one side, spring dawn with cool blue shadows and the first warm light on the hilltops; the ground is empty before anything happens; goat-hair tent pegs, a waterskin and palm-fibre rope left near a well. No people, no weapons, no blood." Figures: none.
2. **Battle of Uhud (625)** — "The plain south of Mount Uhud near Medina at morning: a bare, rust-red mountain with a long ridge filling the background, a small rocky hill in the foreground, flat sandy ground with sparse scrub and a dry wadi, date groves far to the south, bright March light." Figures: none.
3. **Battle of the Trench (627)** — "A freshly dug dry trench cutting across open ground on the north side of an oasis town of mud-brick houses and date palms, heaps of excavated earth, black basalt lava fields on the flanks, a cold overcast sky, tents of a besieging camp far across the plain." Figures: none (Prophetic era).
4. **Battle of Yarmouk (636)** — "A deep river gorge with a plateau of dry grass and basalt above it, two distant lines of forces facing across the plateau: one of Byzantine-style late-antique infantry with oval shields and red cloaks, one of Arab cavalry and infantry in simple robes with spears and leather shields, banners of plain cloth, dust rising in an August afternoon." Figures: distant.
5. **Battle of al-Qadisiyyah (636)** — "A flat alluvial plain at the edge of the Iraqi desert with a canal and date palms on one side, two distant lines: Sasanian cataphracts with lamellar armour and a few war elephants, and Arab cavalry and infantry in robes, dust and a dark sky before a sandstorm." Figures: distant.
6. **Karbala (680)** — aftermath template: "The plain of Karbala by the Euphrates in October at dusk after the battle: silence, a few goat-hair tents collapsed, a cut tent rope, a dropped waterskin by the river bank, palms, the light fading; no bodies, no blood, no fire." Figures: none. Labelled memorial image; perspectives on the page.
7. **Battle of Tours / Poitiers (732)** — "A wooded river valley in western France in October: oaks turning gold, a Roman road, two distant camps on a gentle slope, Frankish infantry with round shields and Umayyad-Berber cavalry in robes and light mail, mist." Figures: distant. Precision note: site disputed.
8. **Battle of Talas (751)** — "A broad river valley in the Central Asian steppe with snow-capped Tian Shan mountains, grass and poplar groves, two distant arrays: Tang infantry with crossbows and Abbasid cavalry, and Karluk horsemen on a flank, late July afternoon." Figures: distant.
9. **Siege of Baghdad (1258)** — siege template, then aftermath: "The round city of Baghdad seen from the Mongol siege lines in February: brick walls and towers, the Tigris with boat bridges, catapults of the period, thousands of felt tents on the plain, smoke beginning to rise; mood of grief and restraint." Figures: distant. Aftermath image per the massacre template with manuscript pages drifting on the river.
10. **Battle of Hattin (1187)** — "A double-peaked volcanic hill above the Sea of Galilee in July heat: dry golden grass, smoke from burning scrub drifting over the slope, distant columns of crusader heavy cavalry in surcoats and Ayyubid mounted archers, the lake blue far below." Figures: distant.
11. **Battle of Ain Jalut (1260)** — "The spring of Goliath in the Jezreel valley in September: a wide fertile plain, a low ridge, distant Mamluk heavy cavalry in lamellar and Mongol horse archers, dust, morning light." Figures: distant.
12. **Fall of Constantinople (1453)** — siege template: "The land walls of Constantinople at dawn on 29 May: triple walls of stone and brick with towers, a breach of rubble, giant bronze bombards in earthworks, a sea of Ottoman tents and banners of plain cloth, ships hauled overland into the Golden Horn in the distance, the dome of Hagia Sophia beyond." Figures: distant.
13. **Fall of Granada (1492)** — treaty/council template: "The Alhambra on its hill at sunrise in January seen from the vega: red walls and towers, snow on the Sierra Nevada behind, a camp of tents on the plain, a bare poplar; empty, still." Figures: none.
14. **Battle of Mohács (1526)** — "A marshy plain by the Danube in late August under a thunderstorm: distant lines of Ottoman janissaries with matchlocks behind chained wagons and cannon, and Hungarian heavy cavalry, mud and rain." Figures: distant.
15. **Siege of Vienna (1683)** — siege template: "The bastioned walls of Vienna seen from Ottoman trenches in September: zigzag saps, gabions, mining tunnels' spoil heaps, a vast tent city with the grand vizier's pavilion, vineyards on the hills of the Wienerwald behind." Figures: distant.
16. **Battle of Plassey (1757)** — "A mango grove by the Hooghly river in June monsoon: rain soaking cannon, red-coated East India Company sepoys and Bengal cavalry in the distance, elephants with howdahs, wet green." Figures: distant.
17. **Battle of Omdurman (1898)** — "A sandy plain by the Nile with low hills in September morning light: distant lines of Mahdist infantry with banners and British-Egyptian troops with Maxim guns, gunboats on the river, Khartoum's ruins across the water." Figures: distant.
18. **Srebrenica (1995)** — memorial template only: "A green valley in eastern Bosnia in July: a quiet road, a factory building at a distance, wildflowers, an empty field with the light fading." Figures: none. Labelled memorial image; sources and perspectives on the page.
19. **Hijra route (622)** — migration template: "A narrow track between black basalt hills south of Mecca at night, a cave mouth high on a mountain, two camels' tracks in sand lit by starlight, the distant glow of an oasis far to the north." Figures: none.
20. **Treaty of Hudaybiyya (628)** — "An acacia tree beside a well on the stony edge of the Meccan hills in March afternoon light, a few goat-hair tents at a distance, a leather writing case and a reed pen on a cloth, empty." Figures: none.

## 6. Seed coordinates (approximate; verify before rendering)

Latitude, longitude in decimal degrees. **Precision** is `site` (a known place), `locality` (within a few km), `approx` (contested or within tens of km). Every value is to be reconciled against Wikidata P625 and a gazetteer by `scripts/media/maps/verify_coords.py` before a map is approved; contested sites keep the `approx` badge on the map.

| Event | Year CE | Lat | Lon | Precision | Note |
|---|---|---|---|---|---|
| Year of the Elephant | c. 570 | 21.42 | 39.83 | site | Mecca |
| First revelation (Hira) | c. 610 | 21.46 | 39.86 | site | Jabal al-Nur |
| Migration to Abyssinia | 615 | 14.03 | 38.97 | approx | Axum region |
| Journey to Ta'if | 619 | 21.27 | 40.42 | site | |
| Pledges of Aqaba (Mina) | 621–622 | 21.41 | 39.89 | locality | |
| Hijra: Cave of Thawr | 622 | 21.38 | 39.85 | site | |
| Hijra: Quba / Medina | 622 | 24.44 | 39.62 | site | |
| Battle of Badr | 624 | 23.77 | 38.79 | locality | wells; positions schematic |
| Battle of Uhud | 625 | 24.50 | 39.61 | site | Mount Uhud |
| Battle of the Trench | 627 | 24.49 | 39.60 | locality | north of Medina |
| Treaty of Hudaybiyya | 628 | 21.45 | 39.70 | approx | al-Shumaysi, west of Mecca |
| Khaybar | 628 | 25.70 | 39.29 | site | oasis |
| Battle of Mu'tah | 629 | 31.07 | 35.69 | site | Jordan |
| Conquest of Mecca | 630 | 21.42 | 39.83 | site | |
| Battle of Hunayn | 630 | 21.47 | 40.10 | approx | valley toward Ta'if |
| Siege of Ta'if | 630 | 21.27 | 40.42 | site | |
| Expedition to Tabuk | 630 | 28.38 | 36.57 | site | |
| Farewell Pilgrimage (Arafat) | 632 | 21.35 | 39.98 | site | |
| Ghadir Khumm | 632 | 22.60 | 39.20 | approx | near al-Juhfa / Rabigh |
| Saqifa / death of the Prophet | 632 | 24.47 | 39.61 | site | Medina |
| Battle of Yamama | 632 | 24.20 | 47.30 | approx | Ridda wars |
| Battle of Yarmouk | 636 | 32.75 | 35.95 | approx | Yarmuk valley |
| Battle of al-Qadisiyyah | 636 | 31.60 | 44.30 | approx | south-west of Kufa |
| Surrender of Jerusalem | 637 | 31.78 | 35.24 | site | |
| Battle of Nahavand | 642 | 34.19 | 48.37 | site | |
| Conquest of Alexandria | 641 | 31.20 | 29.92 | site | |
| Battle of the Camel | 656 | 30.50 | 47.80 | approx | near Basra |
| Battle of Siffin | 657 | 35.90 | 39.00 | approx | near Raqqa |
| Battle of Nahrawan | 658 | 33.40 | 44.90 | approx | |
| Karbala | 680 | 32.61 | 44.03 | site | |
| Battle of al-Harra | 683 | 24.47 | 39.65 | locality | Medina |
| Battle of Guadalete | 711 | 36.50 | −6.00 | approx | disputed |
| Battle of Tours / Poitiers | 732 | 46.80 | 0.50 | approx | disputed |
| Battle of the Zab | 750 | 36.10 | 43.40 | approx | Great Zab |
| Battle of Talas | 751 | 42.50 | 71.50 | approx | Talas valley |
| Founding of Baghdad | 762 | 33.31 | 44.37 | site | |
| Battle of Manzikert | 1071 | 39.14 | 42.54 | site | Malazgirt |
| Battle of Zallaqa (Sagrajas) | 1086 | 38.95 | −6.95 | approx | near Badajoz |
| Crusader capture of Jerusalem | 1099 | 31.78 | 35.24 | site | |
| Battle of Hattin | 1187 | 32.80 | 35.44 | site | Horns of Hattin |
| Las Navas de Tolosa | 1212 | 38.28 | −3.58 | site | |
| Siege of Baghdad | 1258 | 33.31 | 44.37 | site | |
| Ain Jalut | 1260 | 32.55 | 35.37 | locality | |
| Fall of Acre | 1291 | 32.92 | 35.07 | site | |
| Battle of Kosovo | 1389 | 42.69 | 21.14 | locality | |
| Battle of Ankara | 1402 | 40.20 | 33.00 | approx | Çubuk plain |
| Fall of Constantinople | 1453 | 41.01 | 28.98 | site | |
| Fall of Granada | 1492 | 37.18 | −3.60 | site | |
| Battle of Chaldiran | 1514 | 39.10 | 44.30 | approx | |
| Battle of Marj Dabiq | 1516 | 36.45 | 37.10 | approx | north of Aleppo |
| First Battle of Panipat | 1526 | 29.39 | 76.97 | site | |
| Battle of Mohács | 1526 | 45.94 | 18.67 | site | |
| Siege of Vienna | 1529 / 1683 | 48.21 | 16.37 | site | |
| Battle of Preveza | 1538 | 38.96 | 20.75 | locality | |
| Battle of Lepanto | 1571 | 38.40 | 21.30 | approx | Gulf of Patras |
| Battle of Tondibi | 1591 | 16.60 | −0.10 | approx | north of Gao |
| Battle of Plassey | 1757 | 23.80 | 88.25 | site | |
| Battle of the Pyramids | 1798 | 30.05 | 31.20 | locality | Imbaba |
| Battle of Navarino | 1827 | 36.92 | 21.69 | site | |
| French capture of Algiers | 1830 | 36.75 | 3.06 | site | |
| Battle of Omdurman | 1898 | 15.64 | 32.48 | site | |
| Gallipoli campaign | 1915 | 40.20 | 26.30 | approx | peninsula |
| Abolition of the caliphate | 1924 | 39.93 | 32.86 | site | Ankara |
| Partition of India | 1947 | 31.55 | 74.34 | site | Lahore (one of several) |
| Suez crisis | 1956 | 30.60 | 32.30 | approx | canal zone |
| Grand Mosque seizure | 1979 | 21.42 | 39.83 | site | |
| Iranian revolution | 1979 | 35.69 | 51.39 | site | Tehran |
| Srebrenica | 1995 | 44.10 | 19.30 | site | |
| 11 September attacks | 2001 | 40.71 | −74.01 | site | New York |

These seventy are the opening set; the harvest (15) supplies P625 coordinates for every event with a Wikidata item, and events without one get coordinates from the gazetteers (al-Thurayya, Pleiades, WHG) or from the place record, each with a precision flag.

## 7. Period × region accuracy table (for prompts)

`scripts/media/accuracy.yaml` holds, per period and region, sourced one-liners the brief generator inserts: dress and armour, weapons and siege technology, ship types, architecture of cities and forts, banners (plain cloth; no later symbols), animals and transport, and a list of anachronisms to avoid. Examples: Arabia 600s: "no minarets or domes, mud-brick and palm-trunk mosques, leather shields, mail for a few, no stirrups shown"; Mamluk Egypt/Syria 1250–1517: "lamellar and mail, composite bows, heraldic blazons on round shields, stone citadels, counterweight trebuchets"; Ottoman 1450–1700: "janissaries with matchlocks and tall felt caps, bronze bombards, galleys, domed mosques with pencil minarets". The table is reviewed like any other content.

## 8. Batch, monitoring, review

1. `python scripts/media/maps/verify_coords.py` → reconciles every event's coordinates with Wikidata P625 and the gazetteers in the harvest workspace, writes a diff report, and sets `precision`.
2. `python scripts/media/brief.py event` → `.cache/briefs/event/*.json`.
3. `python scripts/media/maps/render.py` → maps for every event with a `map` block (seconds each; all events in minutes).
4. `python scripts/media/gen-prompts.py event` then `generate.py event` in tmux with caffeinate (10 §6.3), three seeds per event.
5. Monitor as in 10 §7 (log tail, progress and ETA script, asitop); maps need no GPU.
6. Review contact sheets; for maps, a side-by-side sheet shows the map, the source quote for each feature, and the precision badge. Approve → `ingest.py` writes media records, links `media.map` and `media.hero` on the event.

## 9. Acceptance tests

- Every spatial event has coordinates with a precision flag and at least one source; `verify_coords.py` reports zero unreconciled sites in the spine.
- Rendering the same event twice gives byte-identical SVGs.
- Arabic labels on maps are correctly shaped and right-to-left; titles align right in Arabic.
- No map feature exists without a `source`; schematic positions render dashed and carry the "Positions approximate" note in both languages.
- No Prophetic-era illustration contains a human figure; no massacre or atrocity image contains bodies, blood or fire in progress (checked by a reviewer and by an image-classifier pass before contact sheets).
- Prompts contain no anachronisms listed for the period and region (lint against `accuracy.yaml`).
