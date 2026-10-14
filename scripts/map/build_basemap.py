# Builds the schematic land basemap used by site/src/components/MiniMap.astro.
# Source: Natural Earth 10m land (public domain), read from a local copy. Output: lon/lat rings clipped to the
# Middle East and North Africa, simplified and rounded, so the site ships a few tens of KB and no tiles or third-party requests.
# Run: python3 scripts/map/build_basemap.py <path-to-ne_10m_land.shp> site/src/data/basemap-mena.json
import json, sys
import shapefile

SRC, OUT = sys.argv[1], sys.argv[2]
LON0, LON1, LAT0, LAT1 = 18.0, 72.0, 4.0, 46.0   # covers Egypt to Iran, Yemen to the Caspian
TOL = 0.06                                       # degrees; ~6 km, invisible at map scale

def clip_ring(ring):
    # keep vertices inside the box, then simplify by distance; rings that leave the box stay closed at its edge
    pts = [(round(x, 2), round(y, 2)) for x, y in ring]
    out = []
    for x, y in pts:
        if out and abs(out[-1][0] - x) < TOL and abs(out[-1][1] - y) < TOL:
            continue
        out.append((x, y))
    return out if len(out) >= 4 else None

rings = []
sh = shapefile.Reader(SRC)
for shp in sh.iterShapes():
    xmin, ymin, xmax, ymax = shp.bbox
    if xmax < LON0 or xmin > LON1 or ymax < LAT0 or ymin > LAT1:
        continue
    parts = list(shp.parts) + [len(shp.points)]
    for a, b in zip(parts, parts[1:]):
        ring = shp.points[a:b]
        if not any(LON0 <= x <= LON1 and LAT0 <= y <= LAT1 for x, y in ring):
            continue
        r = clip_ring(ring)
        if r:
            rings.append(r)

json.dump({"source": "Natural Earth 10m land (public domain)", "bbox": [LON0, LAT0, LON1, LAT1], "rings": rings},
          open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(f"{len(rings)} rings, {sum(len(r) for r in rings)} vertices")
