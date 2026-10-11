#!/usr/bin/env python3
"""Reconcile museum places (data/place/*.yaml with coordinates) to GeoNames and Pleiades by name and distance.
Writes $HARVEST/reports/place-reconciliation.tsv. With --apply, adds `geonames` / `pleiades` external ids to a place file only when exactly one
candidate matches by name within the distance limit (facts and identifiers only; both sources are CC BY, attribution in docs/attribution.md).
Usage: reconcile_places.py [--apply]"""
import math, re, sys
from pathlib import Path
import duckdb, yaml
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import HARVEST

REPO = Path(__file__).resolve().parents[3]
con = duckdb.connect(str(HARVEST / "db" / "harvest.duckdb"), read_only=True)
apply = "--apply" in sys.argv


def km(a, b, c, d):
    p = math.pi / 180
    x = math.sin((c - a) * p / 2) ** 2 + math.cos(a * p) * math.cos(c * p) * math.sin((d - b) * p / 2) ** 2
    return 12742 * math.asin(math.sqrt(x))


rows = []
for f in sorted((REPO / "data" / "place").glob("*.yaml")):
    e = yaml.safe_load(f.read_text())
    if not e.get("coordinates"):
        rows.append((f.stem, "", "", "", "no coordinates: not reconcilable yet")); continue
    lat, lon = e["coordinates"]
    names = {e["label"]["en"].lower()} | {h["name"].lower() for h in e.get("historical_names", []) if h.get("lang", "").startswith("en") or "-Latn" in h.get("lang", "")}
    gn = con.execute("""select geonameid, name, fclass, fcode, country, population, lat, lon from gn_place
        where fclass in ('P','A') and abs(lat - ?) < 0.5 and abs(lon - ?) < 0.5 and (lower(name) in (select unnest(?)) or lower(asciiname) in (select unnest(?))
          or geonameid in (select geonameid from gn_altname where lower(name) in (select unnest(?))))
        order by population desc""", [lat, lon, list(names), list(names), list(names)]).fetchall()
    gn = [g for g in gn if km(lat, lon, g[6], g[7]) < 25]
    gn_pop = [g for g in gn if g[2] == "P"] or gn
    pl = con.execute("""select distinct p.id, p.title, p.reprLat, p.reprLong from pl_place p
        left join pl_name n on n.place_id = p.id
        where p.reprLat is not null and abs(p.reprLat - ?) < 1.0 and abs(p.reprLong - ?) < 1.0
          and (lower(p.title) in (select unnest(?)) or lower(n.nameTransliterated) in (select unnest(?)) or lower(n.title) in (select unnest(?)))""",
        [lat, lon, list(names), list(names), list(names)]).fetchall()
    note = []
    gid = str(gn_pop[0][0]) if len(gn_pop) == 1 or (gn_pop and len({g[0] for g in gn_pop}) == 1) else ""
    if len(gn_pop) > 1: note.append(f"geonames ambiguous ({len(gn_pop)}): " + ", ".join(f"{g[1]}#{g[0]}" for g in gn_pop[:4]))
    if not gn_pop: note.append("no geonames match")
    pid = str(pl[0][0]) if len(pl) == 1 else ""
    if len(pl) > 1: note.append(f"pleiades ambiguous ({len(pl)}): " + ", ".join(f"{p[1]}#{p[0]}" for p in pl[:4]))
    if not pl: note.append("no pleiades match")
    rows.append((f.stem, gid, pid, "applied" if False else "", "; ".join(note)))
    if apply and (gid or pid):
        txt = f.read_text()
        ids = e.get("external_ids") or {}
        add = {k: v for k, v in (("geonames", gid), ("pleiades", pid)) if v and k not in ids}
        if add:
            extra = ", ".join(f'{k}: "{v}"' for k, v in add.items())
            if re.search(r"^external_ids: \{\s*\}", txt, re.M): txt = re.sub(r"^external_ids: \{\s*\}", "external_ids: { " + extra + " }", txt, flags=re.M)
            elif re.search(r"^external_ids: \{(.*)\}", txt, re.M): txt = re.sub(r"^external_ids: \{(.*)\}", lambda m: "external_ids: {" + m.group(1).rstrip() + ", " + extra + " }", txt, count=1, flags=re.M)
            else: txt = re.sub(r"^(sources:)", "external_ids: { " + extra + " }\n\\1", txt, count=1, flags=re.M)
            f.write_text(txt); rows[-1] = rows[-1][:3] + ("applied",) + rows[-1][4:]

out = HARVEST / "reports" / "place-reconciliation.tsv"
out.write_text("place\tgeonames\tpleiades\tstatus\tnotes\n" + "\n".join("\t".join(r) for r in rows) + "\n")
print(out.read_text())
