#!/usr/bin/env python3
"""Build scene briefs from data (docs/plan/16 §2.4): one JSON per spatial event, regenerable at any time. Writes .cache/briefs/event/<slug>.json.
Everything comes from data/ and the offline ETOPO1 grid; nothing is invented: unknown fields are omitted and unreviewed accuracy lines are labelled.
Run in .venv-media: python scripts/media/brief.py event [--event slug ...]"""
import json, os, sys
from pathlib import Path
import yaml

REPO = Path(__file__).resolve().parents[2]
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
SEASON = {12: "winter", 1: "winter", 2: "winter", 3: "spring", 4: "spring", 5: "spring", 6: "summer", 7: "summer", 8: "summer", 9: "autumn", 10: "autumn", 11: "autumn"}  # northern hemisphere
SPATIAL = {"battle", "siege", "naval-battle", "campaign", "war", "conquest", "treaty", "migration", "revolt", "massacre", "council", "founding", "raid", "skirmish", "pilgrimage", "death", "birth", "other"}
_etopo = None


def elevation(lat, lon):
    global _etopo
    f = HARVEST / "basemaps" / "ETOPO1_Ice_g_gmt4.grd"
    if not f.exists():
        return None
    import netCDF4
    if _etopo is None:
        d = netCDF4.Dataset(str(f)); _etopo = (d["z"], d["x"][:], d["y"][:])
    z, x, y = _etopo
    ix = int(round((lon - float(x[0])) / float(x[1] - x[0]))); iy = int(round((lat - float(y[0])) / float(y[1] - y[0])))
    return int(z[iy, ix])


def load(kind, slug):
    p = REPO / "data" / kind / f"{slug}.yaml"
    return yaml.safe_load(p.read_text()) if p.exists() else None


def tr(d, lang="en"):
    return (d or {}).get(lang) or (d or {}).get("en")


def brief(slug, table):
    ev = load("event", slug)
    d0 = (ev.get("date") or {}).get("start") or {}
    edtf, hijri = d0.get("edtf", ""), d0.get("hijri")
    month = int(edtf[5:7]) if len(edtf) >= 7 and edtf[4] == "-" and edtf[5:7].isdigit() else None
    place = None
    for r in ev.get("relations", []):
        if r["type"] in ("occurred_at", "site_of"):
            p = load("place", r["target"].split("/")[1])
            if p and p.get("coordinates"):
                lat, lon = p["coordinates"]
                place = {"id": p["id"], "label": tr(p["label"]), "coords": [lat, lon], "elevation_m": elevation(lat, lon), "coordinate_precision": p.get("coordinate_precision"), "summary": tr(p.get("summary"))}
                break
    period = (ev.get("periods") or [None])[0]; region = (ev.get("regions") or [None])[0]
    acc = next((a for a in table if a["period"] == period and a["region"] == region), None)
    out = {
        "id": ev["id"], "kind": ev["kind"], "label": tr(ev["label"]),
        "date": {"edtf": edtf, **({"hijri": hijri} if hijri else {}), **({"season": SEASON[month]} if month else {})},
        "place": place, "region": region, "period": period,
        "sides": [{"label": tr(s["label"]), **({"dress": acc["sides_dress"]["default"]} if acc else {})} for s in ev.get("sides", [])],
        "sensitivity": [ev["sensitivity"]] if ev.get("sensitivity") not in (None, "none") else [],
        "sources": ev.get("sources", []),
        "map": {"present": bool(ev.get("map")), "precision": (ev.get("map") or {}).get("precision")},
    }
    if acc:
        out.update({"material_culture": acc["material_culture"], "avoid_anachronisms": acc["avoid_anachronisms"], "figure_policy": acc["figure_policy"],
                    "accuracy_status": acc["accuracy_status"], "accuracy_sources": acc.get("sources", [])})
    else:
        out["accuracy_status"] = "missing: no period x region entry in scripts/media/accuracy.yaml"
    return out


if __name__ == "__main__":
    args = sys.argv[1:]
    table = yaml.safe_load((Path(__file__).parent / "accuracy.yaml").read_text())
    slugs = args[args.index("--event") + 1:] if "--event" in args else [p.stem for p in sorted((REPO / "data" / "event").glob("*.yaml"))]
    out = REPO / ".cache" / "briefs" / "event"; out.mkdir(parents=True, exist_ok=True)
    n = 0
    for s in slugs:
        ev = load("event", s)
        if not ev or ev.get("kind") not in SPATIAL:
            continue
        b = brief(s, table)
        if not b["place"]:
            print(f"skip {s}: no place with coordinates"); continue
        (out / f"{s}.json").write_text(json.dumps(b, indent=1, ensure_ascii=False)); n += 1
    print(f"{n} briefs -> .cache/briefs/event/")
