#!/usr/bin/env python3
"""Harvest open-licence object images into media records (docs/plan/06 Phase 3: object images).

For every data/object/*.yaml held by the Met or Cleveland with an official catalogue URL,
query the museum's open API once and, only when the work is flagged public domain/CC0,
write data/media/photo-<slug>.yaml carrying the remote image URL (link-don't-copy; no file
is committed). Records: kind=image, url=full, thumbnail=small, license=CC0, depicts=[object].

Run: python3 scripts/harvest/objects/images.py
"""
import json, re, sys, time
from pathlib import Path
import requests, yaml

REPO = Path(__file__).resolve().parents[3]
OUT = REPO / "data" / "media"

UA = {"User-Agent": "islam.museum harvest (https://islam.museum; github.com/amado2k5/islam-museum)"}

def get(url):
    r = requests.get(url, headers=UA, timeout=20)
    r.raise_for_status()
    return r.json()

def slugify(s):
    return re.sub(r"[^a-z0-9-]", "", s.lower().replace(" ", "-"))

def met_media(obj, data):
    if not data.get("isPublicDomain") or not data.get("primaryImage"):
        return None
    slug = obj["id"].split("/")[1]
    return {
        "url": data["primaryImage"],
        "thumbnail": data.get("primaryImageSmall") or data["primaryImage"],
        "attribution": "The Metropolitan Museum of Art, New York; Open Access (CC0)",
        "source": "source/met-open-access",
        "creator": data.get("artistDisplayName") or None,
    }

def cleveland_media(obj, data):
    if data.get("share_license_status") != "CC0":
        return None
    img = (data.get("images") or {}).get("web", {}).get("url")
    if not img:
        return None
    return {
        "url": img,
        "thumbnail": (data.get("images") or {}).get("print", {}).get("url") or img,
        "attribution": "Cleveland Museum of Art; Open Access (CC0)",
        "source": "source/cleveland-open-access",
        "license": "CC0",
        "creator": (data.get("creators") or [{}])[0].get("description") or None,
    }

def vam_media(obj, data):
    iiif = (data.get("images") or {}).get("_iiif_image")
    thumb = (data.get("images") or {}).get("_primary_thumbnail")
    if not iiif:
        # the v2 object endpoint omits _iiif_image for some works; the manifest still lists services
        manifest = obj.get("iiif_manifest")
        if not manifest:
            return None
        try:
            m = get(manifest)
        except Exception:
            return None
        canvases = (m.get("sequences") or [{}])[0].get("canvases") or []
        for c in canvases:
            svc = ((c.get("images") or [{}])[0].get("resource") or {}).get("service") or {}
            if svc.get("@id"):
                iiif = svc["@id"]; break
        if not iiif:
            return None
    iiif = iiif.rstrip("/")
    return {
        "url": iiif + "/full/!800,/0/default.jpg",
        "thumbnail": thumb or iiif + "/full/!200,200/0/default.jpg",
        "iiif_image": iiif,
        "attribution": "© Victoria and Albert Museum, London — via the V&A IIIF image service (free for non-commercial use)",
        "source": "source/vam-collection",
        "license": "institution-open",
        "creator": None,
    }

def write_media(obj, m):
    slug = obj["id"].split("/")[1]
    mid = f"media/photo-{slug}"
    label_ar = f"صورة: {obj['label'].get('ar')}"
    alt_ar = f"صورة القطعة «{obj['label'].get('ar')}» من مجموعة المتحف المفتوحة"
    alt_en = f"Photograph of {obj['label'].get('en')} from the museum's open collection"
    alt_ur = f"میوزیم کے کھلے ذخیرے سے «{obj['label'].get('en')}» کی تصویر"
    rec = {
        "id": mid,
        "class": "media",
        "kind": "image",
        "label": {"ar": label_ar, "en": f"Photo: {obj['label'].get('en')}"},
        "summary": {"ar": f"صورة القطعة من موقع المتحف، مضمّنة بلا نسخ.", "en": "The museum's photograph of the object, embedded without copying."},
        "url": m["url"],
        "thumbnail": m["thumbnail"],
        "license": m.get("license", "CC0"),
        "attribution": m["attribution"],
        "depicts": [obj["id"]],
        "alt": {"ar": alt_ar, "en": alt_en, "ur": alt_ur},
        "sources": [m["source"]],
        "status": {"review": "draft", "completeness": 1, "generated_by": "Devin (SWE-2 High), scripts/harvest/objects/images.py; remote URL only, no copy"},
    }
    if m.get("iiif_image"):
        rec["iiif_image"] = m["iiif_image"]
    if m.get("creator"):
        rec["creator"] = m["creator"]
    (OUT / f"photo-{slug}.yaml").write_text(yaml.safe_dump(rec, allow_unicode=True, sort_keys=False, width=1000))
    return mid

def main():
    written, skipped = [], []
    for f in sorted((REPO / "data" / "object").glob("*.yaml")):
        obj = yaml.safe_load(f.read_text())
        official = (obj.get("external_ids") or {}).get("official", "")
        inst = obj.get("holding_institution") or ""
        try:
            if "metmuseum.org/art/collection/search/" in official:
                oid = official.rstrip("/").rsplit("/", 1)[-1]
                m = met_media(obj, get(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{oid}"))
            elif "clevelandart.org/art/" in official:
                acc = official.rstrip("/").rsplit("/", 1)[-1]
                m = cleveland_media(obj, get(f"https://openaccess-api.clevelandart.org/api/artworks/{acc}"))
            elif "collections.vam.ac.uk/item/" in official:
                oid = official.rstrip("/").rsplit("/", 1)[-1]
                m = vam_media(obj, get(f"https://api.vam.ac.uk/v2/museumobject/{oid}"))
            else:
                continue
        except Exception as e:
            skipped.append((obj["id"], str(e)[:60])); continue
        if not m:
            skipped.append((obj["id"], "not public domain / no image")); continue
        written.append(write_media(obj, m))
        time.sleep(0.1)
    print(f"written {len(written)} media records; skipped {len(skipped)}")
    for s in skipped[:15]:
        print("  skip", s)

if __name__ == "__main__":
    main()
