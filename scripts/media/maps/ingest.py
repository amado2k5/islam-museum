#!/usr/bin/env python3
"""Ingest rendered maps into the repository (docs/plan/16 §8 step 6). For each approved event slug:
  - writes 1280 px WebP files to ~/islam-museum-media/web/maps/<slug>/ and copies them to site/public/media/maps/<slug>/ (git-ignored: media files
    live in the separate media repo, docs/plan/03 §3 and §8; the main repo carries only the records)
  - writes data/media/map-event-<slug>.yaml (kind map, alt text in en + ar, generated block with the inputs hash, precision, basemap sources)
  - links the record from the event (media.map)
The record is written as status.review: draft; a human reviewer sets it to reviewed. Usage: ingest.py slug [slug ...]  (run render.py first)"""
import json, re, shutil, sys
from datetime import date
from pathlib import Path
import yaml

REPO = Path(__file__).resolve().parents[3]
LANGS = ("ar",)   # Arabic first (docs/language.md); add "en" in Phase 4
SRC = Path.home() / "islam-museum-media" / "img"
J = lambda s: json.dumps(s, ensure_ascii=False)
tr = lambda d, l: (d or {}).get(l) or (d or {}).get("en") or ""


def alt(ev, lang):
    m = ev["map"]; feats = m.get("features", [])
    places = [tr(f["label"], lang) for f in feats if f["type"] == "point" and f.get("label")]
    sides = ev.get("sides", [])
    lines = [tr(sides[f["side"]]["label"], lang) for f in feats if f["type"] == "line" and "side" in f and f["side"] < len(sides)]
    sep = "، " if lang == "ar" else ", "
    if lang == "ar":
        s = f"خريطة تخطيطية: {tr(ev['label'], 'ar')}. تُظهر المواضع التالية: {sep.join(places)}"
        if lines: s += f". الخطوط المتقطعة تبيّن مسير كل طرف: {sep.join(lines)}"
        return s + ". المواقع تقريبية."
    s = f"Schematic map for {tr(ev['label'], 'en')} showing {sep.join(places)}"
    if lines: s += f", with dashed lines for the movement of {sep.join(lines)}"
    return s + ". Positions are approximate."


for slug in sys.argv[1:]:
    evp = REPO / "data" / "event" / f"{slug}.yaml"
    ev = yaml.safe_load(evp.read_text())
    src = SRC / f"map-event-{slug}"
    meta = json.loads((src / "meta.json").read_text())
    from PIL import Image
    web = Path.home() / "islam-museum-media" / "web" / "maps" / slug
    dest = REPO / "site" / "public" / "media" / "maps" / slug
    for d in (web, dest): d.mkdir(parents=True, exist_ok=True)
    for lang in LANGS:
        im = Image.open(src / f"1536.{lang}.png").convert("RGB")
        im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
        im.save(web / f"map.{lang}.webp", "WEBP", quality=82, method=6)
        shutil.copyfile(web / f"map.{lang}.webp", dest / f"map.{lang}.webp")
    mid = f"media/map-event-{slug}"
    rec = f"""id: {mid}
class: media
kind: map
label: {{ ar: {J('خريطة تخطيطية: ' + tr(ev['label'], 'ar'))} }}
summary: {{ ar: {J('خريطة: ' + tr(ev['label'], 'ar') + '، مرسومة من مواقع موثَّقة.')} }}
wings: [place]
alt: {{ ar: {J(alt(ev, 'ar'))} }}
depicts: [{ev['id']}]
generated: {{ tool: {meta['tool']}, version: "{meta['version']}", inputs_hash: "{meta['inputs_hash']}", date: "{date.today().isoformat()}" }}
precision: {meta['precision']}
basemap_sources: [source/natural-earth, source/etopo1]
license: CC0
attribution: "islam.museum, CC0. Basemap: Natural Earth and NOAA ETOPO1 (public domain)."
files: {{ webp_ar: media/maps/{slug}/map.ar.webp }}
sources: [{', '.join(sorted(set((ev['map'].get('sources') or []))))}]
status: {{ review: draft, completeness: 2, generated_by: "scripts/media/maps/ingest.py; awaiting human review of every feature against its source" }}
"""
    (REPO / "data" / "media").mkdir(exist_ok=True)
    (REPO / "data" / "media" / f"map-event-{slug}.yaml").write_text(rec)
    txt = evp.read_text()
    if "media:" not in txt.split("\nsources:")[0] or not re.search(r"^media:", txt, re.M):
        txt = re.sub(r"^(sources:)", f"media: {{ map: {mid} }}\n\\1", txt, count=1, flags=re.M)
        evp.write_text(txt)
    print("ingested", mid)
