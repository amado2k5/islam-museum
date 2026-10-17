#!/usr/bin/env python3
"""Harvest Wikimedia Commons images for objects lacking media (Phase 3).

For every data/object/*.yaml with an `external_ids.wikidata` Q-id and no
depicting media record, fetch the Wikidata P18 (image) claim, resolve the
Commons file, and keep it only when its licence is on the museum whitelist
(PD / CC0 / CC BY / CC BY-SA). Writes data/media/photo-<slug>.yaml records
with remote upload.wikimedia.org URLs — nothing is copied into git.

Usage: python3 scripts/harvest/objects/commons.py [--apply]
"""
import json, re, sys, time, urllib.parse
from pathlib import Path
import requests, yaml

REPO = Path(__file__).resolve().parents[3]
UA = {"User-Agent": "islam-museum-harvest/1.0 (research; contact via github)"}
WD = "https://www.wikidata.org/wiki/Special:EntityData/{}.json"
CM = "https://commons.wikimedia.org/w/api.php"

LICENSE_MAP = [
    (re.compile(r'public domain|pd-|pdm\b', re.I), "PD"),
    (re.compile(r'cc0|cc-0|zero', re.I), "CC0"),
    (re.compile(r'cc[ -]?by[ -]?sa', re.I), "CC-BY-SA"),
    (re.compile(r'cc[ -]?by\b', re.I), "CC-BY"),
]
REJECT = re.compile(r'nc|nd|noncommercial|gfdl', re.I)


def fetch(url: str) -> dict | None:
    for attempt in range(3):
        try:
            r = requests.get(url, headers=UA, timeout=30)
            r.raise_for_status()
            return r.json()
        except Exception:
            time.sleep(1.5 * (attempt + 1))
    return None


def license_for(meta: dict) -> str | None:
    short = (meta.get("LicenseShortName") or {}).get("value", "")
    lic = (meta.get("License") or {}).get("value", "")
    hay = f"{short} {lic}"
    if REJECT.search(hay):
        return None
    for pat, out in LICENSE_MAP:
        if pat.search(hay):
            return out
    return "PD" if (meta.get("Copyrighted") or {}).get("value", "") == "False" else None


def p18_files(qid: str) -> list[str]:
    d = fetch(WD.format(qid)) or {}
    ent = (d.get("entities") or {}).get(qid) or {}
    files = []
    for c in (ent.get("claims") or {}).get("P18") or []:
        v = (c.get("mainsnak", {}).get("datavalue") or {}).get("value")
        if isinstance(v, str):
            files.append(v)
    # Fallback: the item's Commons sitelink or P373 category — pick its
    # first image members when no P18 exists (e.g. maqam-ibrahim).
    if not files:
        cat = ((ent.get("sitelinks") or {}).get("commonswiki") or {}).get("title")
        if not cat:
            for c in (ent.get("claims") or {}).get("P373") or []:
                v = (c.get("mainsnak", {}).get("datavalue") or {}).get("value")
                if isinstance(v, str):
                    cat = "Category:" + v.split(":")[-1]
                    break
        if cat:
            q = {"action": "query", "generator": "categorymembers", "gcmtitle": cat,
                 "gcmtype": "file", "gcmlimit": "8", "prop": "imageinfo",
                 "iiprop": "mime", "format": "json"}
            d2 = fetch(CM + "?" + urllib.parse.urlencode(q)) or {}
            for p in sorted((d2.get("query", {}).get("pages") or {}).values(),
                            key=lambda p: p.get("index", 99)):
                t = p.get("title", "")
                if t.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff")):
                    files.append(t.split(":", 1)[-1])
    # Fallback 2: the lead image of the linked Wikipedia article — many
    # manuscripts carry an article image without a P18 claim.
    if not files:
        sl = ent.get("sitelinks") or {}
        for site in ("enwiki", "arwiki"):
            title = (sl.get(site) or {}).get("title")
            if not title:
                continue
            q = {"action": "query", "titles": title, "prop": "pageimages",
                 "piprop": "name", "format": "json"}
            d2 = fetch(f"https://{site.replace('wiki', '.wikipedia.org')}/w/api.php"
                     + "?" + urllib.parse.urlencode(q)) or {}
            for p in (d2.get("query", {}).get("pages") or {}).values():
                img = (p.get("pageimage") or "")
                if img:
                    files.append(img)
            if files:
                break
    return files


def imageinfo(fname: str) -> dict | None:
    q = {
        "action": "query", "titles": f"File:{fname}", "prop": "imageinfo",
        "iiprop": "url|extmetadata|mime", "iiurlwidth": "800", "format": "json",
    }
    d = fetch(CM + "?" + urllib.parse.urlencode(q)) or {}
    for p in (d.get("query", {}).get("pages") or {}).values():
        ii = (p.get("imageinfo") or [{}])[0]
        if ii.get("url"):
            return ii
    return None


def depicted_objects() -> set:
    out = set()
    for f in (REPO / "data" / "media").glob("*.yaml"):
        d = yaml.safe_load(f.read_text(encoding="utf-8"))
        for t in (d.get("depicts") or []):
            out.add(t)
    return out


def slugify_label(ar: str) -> str:
    return ar


def main():
    apply = "--apply" in sys.argv
    have = depicted_objects()
    written = skipped = nolicense = nop18 = 0
    for f in sorted((REPO / "data" / "object").glob("*.yaml")):
        d = yaml.safe_load(f.read_text(encoding="utf-8"))
        oid = d["id"]
        if oid in have:
            continue
        qid = (d.get("external_ids") or {}).get("wikidata")
        if not qid:
            skipped += 1
            continue
        files = p18_files(qid)
        if not files:
            nop18 += 1
            continue
        got = False
        for fname in files[:3]:
            ii = imageinfo(fname)
            if not ii or "image" not in (ii.get("mime") or ""):
                continue
            lic = license_for(ii.get("extmetadata") or {})
            if not lic:
                continue
            label = d.get("label", {})
            slug = oid.split("/", 1)[1]
            rec = {
                "id": f"media/photo-{slug}",
                "class": "media", "kind": "image",
                "label": {"ar": f"صورة: {label.get('ar','')}", "en": f"Photo: {label.get('en','')}"},
                "summary": {"ar": "صورة القطعة من ويكيميديا كومنز، مضمّنة بلا نسخ.",
                            "en": "The object's photograph from Wikimedia Commons, embedded without copying."},
                "url": ii["url"], "thumbnail": ii.get("thumburl") or ii["url"],
                "license": lic,
                "attribution": "Wikimedia Commons; see file page for author and licence",
                "depicts": [oid],
                "alt": {"ar": f"صورة القطعة «{label.get('ar','')}» من ويكيميديا كومنز",
                        "en": f"Photograph of {label.get('en','')} from Wikimedia Commons"},
                "sources": ["source/wikidata"],
                "status": {"review": "draft", "completeness": 1,
                           "generated_by": "Devin (SWE-2 High), scripts/harvest/objects/commons.py; remote URL only, no copy"},
            }
            if apply:
                (REPO / "data" / "media" / f"photo-{slug}.yaml").write_text(
                    yaml.safe_dump(rec, allow_unicode=True, sort_keys=False), encoding="utf-8")
            written += 1
            got = True
            print(("WROTE" if apply else "would"), oid, "->", lic, ii["url"][:80])
            break
        if not got:
            nolicense += 1
        time.sleep(0.3)
    print(f"\n{written} records {'written' if apply else 'would be written'}; "
          f"{skipped} no wikidata id; {nop18} no P18; {nolicense} no usable licence")


if __name__ == "__main__":
    main()
