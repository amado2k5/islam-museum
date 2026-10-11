#!/usr/bin/env python3
"""Render event maps from data/event/*.yaml `map` blocks (docs/plan/16 §4). Deterministic: the same inputs give byte-identical SVGs.
Basemap layers are optional: if Natural Earth files are not installed in $HARVEST/basemaps, a plain background is drawn and the map says so.
Usage: render.py [--event slug ...] [--lang en|ar ...] [--out DIR]     default out: ~/islam-museum-media/img"""
import hashlib, json, math, os, sys
from pathlib import Path
import yaml
import warnings
warnings.filterwarnings("ignore", message="The GeoSeries you are attempting to plot is empty")
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import rcParams
from matplotlib.patches import Rectangle

VERSION = "0.1"
REPO = Path(__file__).resolve().parents[3]
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
BASE = HARVEST / "basemaps"
rcParams["svg.fonttype"] = "path"          # glyphs as paths: identical everywhere
rcParams["svg.hashsalt"] = "islam-museum"  # stable ids
STYLE = {"land": "#F7F3EA", "sea": "#DCE6EE", "river": "#9FB8CC", "side": ["#1F4E8C", "#B8932F", "#0F5F5C", "#8C2F1F"], "text": "#1B1B1F", "muted": "#6B6660",
         "approx": (0, (4, 3))}
FONT = {"en": ["Times New Roman", "DejaVu Serif"], "ar": ["Geeza Pro", "DejaVu Sans"]}   # DejaVu supplies the glyphs Geeza Pro lacks (brackets)
NOTE = {"en": "Positions approximate", "ar": "المواقع تقريبية"}
NOBASE = {"en": "Basemap not yet installed", "ar": "الخريطة الأساسية غير مثبتة بعد"}


def txt(s: str, lang: str) -> str:
    # Matplotlib >= 3.11 shapes and orders Arabic itself (verified: reshape+bidi on top of it garbles the text), so strings pass through.
    return s


def tr(d, lang):
    return (d or {}).get(lang) or (d or {}).get("en") or ""


def frame(center, extent_km, ratio=1.5):
    lat, lon = center
    dlat = extent_km / 111.0 / 2 / ratio
    dlon = extent_km / (111.0 * max(0.2, math.cos(math.radians(lat)))) / 2
    return (lon - dlon, lat - dlat, lon + dlon, lat + dlat)  # minx, miny, maxx, maxy


def load_event(slug):
    return yaml.safe_load((REPO / "data" / "event" / f"{slug}.yaml").read_text())


def place_coords(pid):
    p = REPO / "data" / "place" / f"{pid.split('/')[1]}.yaml"
    return yaml.safe_load(p.read_text()).get("coordinates") if p.exists() else None


def basemap_files():
    return sorted([p.name for p in BASE.glob("ne_10m_*.shp")] + [p.name for p in BASE.glob("SR_HR.tif")]) if BASE.exists() else []


def inputs_hash(ev, m, geos):
    blob = json.dumps({"id": ev["id"], "label": ev["label"], "map": m, "sides": ev.get("sides"), "geo": geos, "basemap": basemap_files(), "renderer": VERSION}, sort_keys=True, ensure_ascii=False)
    return "sha256:" + hashlib.sha256(blob.encode()).hexdigest()


def render(slug, lang, out_root):
    ev = load_event(slug)
    m = ev["map"]
    center = m.get("center")
    if not center:
        for r in ev.get("relations", []):
            if r["type"] in ("occurred_at", "site_of") and place_coords(r["target"]):
                center = place_coords(r["target"]); break
    if not center:
        raise SystemExit(f"{slug}: no center and no place coordinates")
    minx, miny, maxx, maxy = frame(center, m.get("extent_km", 12))
    geos = {}
    fig, ax = plt.subplots(figsize=(9, 6), dpi=200)
    ax.add_patch(Rectangle((minx, miny), maxx - minx, maxy - miny, facecolor=STYLE["sea"] if m.get("basemap") == "sea" else STYLE["land"], edgecolor="none", zorder=0))
    have_base = False
    if (BASE / "ne_10m_land.shp").exists():
        import geopandas as gpd
        from shapely.geometry import box
        bb = box(minx, miny, maxx, maxy)
        ax.add_patch(Rectangle((minx, miny), maxx - minx, maxy - miny, facecolor=STYLE["sea"], edgecolor="none", zorder=0))
        gpd.read_file(BASE / "ne_10m_land.shp", bbox=bb.bounds).plot(ax=ax, color=STYLE["land"], linewidth=0, zorder=1)
        if m.get("basemap", "terrain") == "terrain" and (BASE / "SR_HR.tif").exists():
            import numpy as np, rasterio
            from rasterio.windows import from_bounds
            with rasterio.open(BASE / "SR_HR.tif") as r:
                win = from_bounds(minx, miny, maxx, maxy, r.transform)
                arr = r.read(1, window=win, boundless=True, fill_value=0).astype(float)
            ax.imshow(arr, extent=(minx, maxx, miny, maxy), cmap="gray", alpha=0.32, zorder=2, aspect="auto", interpolation="bilinear")
        if (BASE / "ne_10m_ocean.shp").exists():
            gpd.read_file(BASE / "ne_10m_ocean.shp", bbox=bb.bounds).plot(ax=ax, color=STYLE["sea"], linewidth=0, zorder=3)
        if (BASE / "ne_10m_coastline.shp").exists():
            gpd.read_file(BASE / "ne_10m_coastline.shp", bbox=bb.bounds).plot(ax=ax, color="#7F93A6", linewidth=0.6, zorder=3)
        if (BASE / "ne_10m_rivers_lake_centerlines.shp").exists():
            gpd.read_file(BASE / "ne_10m_rivers_lake_centerlines.shp", bbox=bb.bounds).plot(ax=ax, color=STYLE["river"], linewidth=0.6, zorder=3)
        if (BASE / "ne_10m_lakes.shp").exists():
            gpd.read_file(BASE / "ne_10m_lakes.shp", bbox=bb.bounds).plot(ax=ax, color=STYLE["sea"], linewidth=0, zorder=3)
        have_base = True
    names = FONT[lang]
    sides = ev.get("sides", [])
    for f in m.get("features", []):
        dashed = STYLE["approx"] if (f.get("precision") in ("approximate", "schematic") or m["precision"] in ("approximate", "schematic")) else "solid"
        colour = STYLE["side"][f["side"] % 4] if "side" in f else STYLE["text"]
        if f["type"] == "point":
            y, x = f["at"]
            ax.plot(x, y, marker={"well": "o", "camp": "^", "landmark": "s", "city": "D"}.get(f["role"], "o"), color=colour, ms=6, zorder=5)
            if f.get("label"):
                ax.annotate(txt(tr(f["label"], lang), lang), (x, y), xytext=(6 if lang == "en" else -6, 6), textcoords="offset points", fontsize=9, color=STYLE["text"],
                            family=names, ha="left" if lang == "en" else "right", zorder=6)
        elif f["type"] == "line":
            pts = f.get("path") or [f["from"], f["to"]]
            xs, ys = [p[1] for p in pts], [p[0] for p in pts]
            ax.plot(xs, ys, color=colour, linewidth=1.8, linestyle=dashed, zorder=4)
            if f["role"] in ("advance", "retreat", "march", "flank"):
                # arrowhead only (a full-length arrow would paint over the dashed line that marks schematic positions)
                tx, ty = xs[-2] + 0.93 * (xs[-1] - xs[-2]), ys[-2] + 0.93 * (ys[-1] - ys[-2])
                ax.annotate("", xy=(xs[-1], ys[-1]), xytext=(tx, ty), arrowprops=dict(arrowstyle="-|>", color=colour, lw=0, mutation_scale=14), zorder=4)
        elif f["type"] == "polygon":
            import geopandas as gpd
            g = json.loads((REPO / f["geometry"]).read_text()); geos[f["geometry"]] = g
            gpd.read_file(REPO / f["geometry"]).plot(ax=ax, facecolor=colour, alpha=0.15, edgecolor=colour, linestyle=dashed)
    fig.subplots_adjust(left=0.02, right=0.98, top=0.92, bottom=0.06)
    ax.set_xlim(minx, maxx); ax.set_ylim(miny, maxy)
    ax.set_aspect(1 / max(0.2, math.cos(math.radians(center[0]))))
    ax.axis("off")
    title = tr(ev["label"], lang)
    ax.set_title(txt(title, lang), loc="right" if lang == "ar" else "left", fontsize=13, family=names, pad=10)
    if m.get("legend", True) and sides:
        for i, s in enumerate(sides):
            if any(f.get("side") == i for f in m.get("features", [])):
                fig.text(0.97 if lang == "ar" else 0.03, 0.86 - 0.04 * i, txt("— " + tr(s["label"], lang), lang), fontsize=8, color=STYLE["side"][i % 4], family=names,
                         ha="right" if lang == "ar" else "left", transform=fig.transFigure)
    # scale bar (nice round length, about a fifth of the width) and north arrow
    width_km = (maxx - minx) * 111.0 * max(0.2, math.cos(math.radians(center[0])))
    nice = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]
    bar_km = max([n for n in nice if n <= width_km * 0.22] or [1])
    bar_deg = bar_km / (111.0 * max(0.2, math.cos(math.radians(center[0]))))
    pad_x, pad_y = (maxx - minx) * 0.03, (maxy - miny) * 0.05
    x0 = (maxx - pad_x - bar_deg) if lang == "ar" else (minx + pad_x)
    ax.plot([x0, x0 + bar_deg], [miny + pad_y, miny + pad_y], color=STYLE["text"], linewidth=2.2, zorder=8, solid_capstyle="butt")
    ax.text(x0 + bar_deg / 2, miny + pad_y * 1.25, f"{bar_km} km" if lang == "en" else f"{bar_km} كم", ha="center", va="bottom", fontsize=8, family=names, color=STYLE["text"], zorder=8)
    nx = (minx + pad_x * 1.5) if lang == "ar" else (maxx - pad_x * 1.5)
    ax.annotate("", xy=(nx, maxy - pad_y * 0.6), xytext=(nx, maxy - pad_y * 2.6), arrowprops=dict(arrowstyle="-|>", color=STYLE["text"], lw=1.4, mutation_scale=12), zorder=8)
    ax.text(nx, maxy - pad_y * 2.9, "N" if lang == "en" else "ش", ha="center", va="top", fontsize=9, family=names, color=STYLE["text"], zorder=8)
    notes = []
    if m["precision"] in ("approximate", "schematic"): notes.append(NOTE[lang])
    if not have_base: notes.append(NOBASE[lang])
    if notes:
        fig.text(0.99 if lang == "ar" else 0.01, 0.01, txt(" · ".join(notes), lang), fontsize=7, color=STYLE["muted"], family=names, ha="right" if lang == "ar" else "left")
    out = Path(out_root) / f"map-{ev['id'].replace('/', '-')}"
    out.mkdir(parents=True, exist_ok=True)
    meta = {"tool": "scripts/media/maps/render.py", "version": VERSION, "inputs_hash": inputs_hash(ev, m, geos), "precision": m["precision"], "basemap": basemap_files()}
    fig.savefig(out / f"map.{lang}.svg", dpi=96, metadata={"Date": None, "Creator": f"islam.museum render.py {VERSION}"}, format="svg")
    fig.savefig(out / f"1536.{lang}.png", dpi=170, metadata={"Software": None})
    plt.close(fig)
    (out / "meta.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False))
    return out


if __name__ == "__main__":
    a = sys.argv[1:]
    def opt(name, default):
        vals, i = [], 0
        while i < len(a):
            if a[i] == name:
                i += 1
                while i < len(a) and not a[i].startswith("--"): vals.append(a[i]); i += 1
            else: i += 1
        return vals or default
    out = opt("--out", [str(Path.home() / "islam-museum-media" / "img")])[0]
    langs = opt("--lang", ["ar"])   # Arabic first (docs/language.md); pass --lang ar en for both
    events = opt("--event", [p.stem for p in sorted((REPO / "data" / "event").glob("*.yaml")) if "map" in yaml.safe_load(p.read_text())])
    for slug in events:
        for lang in langs:
            print(render(slug, lang, out), lang)
