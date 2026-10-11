#!/usr/bin/env python3
"""Reconcile every museum place's coordinates with GeoNames and Pleiades in the harvest database (docs/plan/16 §8 step 1).
Writes $HARVEST/reports/coords-verification.tsv and prints a summary. Reports only; it changes no data.
Status: ok (within 5 km of a name match), check (5-25 km), far (> 25 km), unmatched (no name match nearby), missing (no coordinates).
Wikidata P625 is added once the Wikidata subset exists. Run in .venv-harvest."""
import math, os, sys
from pathlib import Path
import duckdb, yaml

HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
REPO = Path(__file__).resolve().parents[3]
con = duckdb.connect(str(HARVEST / "db" / "harvest.duckdb"), read_only=True)


def km(a, b, c, d):
    p = math.pi / 180
    x = math.sin((c - a) * p / 2) ** 2 + math.cos(a * p) * math.cos(c * p) * math.sin((d - b) * p / 2) ** 2
    return 12742 * math.asin(math.sqrt(x))


rows = []
for f in sorted((REPO / "data" / "place").glob("*.yaml")):
    e = yaml.safe_load(f.read_text())
    if not e.get("coordinates"):
        rows.append((e["id"], "", "", "", "missing", "no coordinates")); continue
    lat, lon = e["coordinates"]
    names = list({e["label"]["en"].lower(), *[h["name"].lower() for h in e.get("historical_names", []) if "Latn" in h.get("lang", "") or h.get("lang", "").startswith("en")]})
    gn = con.execute("""select geonameid, name, lat, lon from gn_place where abs(lat-?)<1.5 and abs(lon-?)<1.5 and (lower(name) in (select unnest(?)) or lower(asciiname) in (select unnest(?))
        or geonameid in (select geonameid from gn_altname where lower(name) in (select unnest(?))))""", [lat, lon, names, names, names]).fetchall()
    gid = (e.get("external_ids") or {}).get("geonames")
    if gid:
        gn += con.execute("select geonameid, name, lat, lon from gn_place where geonameid = ?", [int(gid)]).fetchall()
    best = min(gn, key=lambda g: km(lat, lon, g[2], g[3])) if gn else None
    if not best:
        rows.append((e["id"], f"{lat},{lon}", "", "", "unmatched", e.get("coordinate_precision", ""))); continue
    d = km(lat, lon, best[2], best[3])
    status = "ok" if d <= 5 else "check" if d <= 25 else "far"
    rows.append((e["id"], f"{lat},{lon}", f"{best[1]}#{best[0]}", f"{d:.1f}", status, e.get("coordinate_precision", "")))

out = HARVEST / "reports" / "coords-verification.tsv"
out.write_text("place\tours\tgeonames\tdistance_km\tstatus\tprecision\n" + "\n".join("\t".join(r) for r in rows) + "\n")
from collections import Counter
print(Counter(r[4] for r in rows)); print(out.read_text())
sys.exit(1 if any(r[4] == "far" and not r[5] == "approx" for r in rows) else 0)
