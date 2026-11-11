#!/usr/bin/env python3
"""A measurement of production, not of this branch: which cornerstones the live wing pages list.

Fetches the live wing landing pages (what visitors see: the deploy stamped at /api/v1/meta/deploy.json) and checks, for a
fixed handful of cornerstones, whether the wing page that should hold each one links to it. This is the "before" a
visitor can see for themselves; the branch's own state is measured by o01 (cornerstones by wing).

  python3 scripts/fable/o13_production_wings.py [https://islam.museum]
"""
import json, sys, urllib.request

base = (sys.argv[1] if len(sys.argv) > 1 else "https://islam.museum").rstrip("/")
PROBES = [("living", "practice/salah"), ("living", "practice/hajj"), ("living", "practice/sawm-ramadan"), ("living", "practice/zakat"),
          ("words", "work/quran"), ("words", "work/sahih-al-bukhari"), ("words", "work/muwatta-malik"),
          ("time", "period/prophetic-era"), ("time", "polity/abbasid-caliphate"), ("people", "group/quraysh"),
          ("people", "person/muhammad"), ("time", "event/battle-of-badr")]


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "wing-probe/1.0"})
    return urllib.request.urlopen(req, timeout=120).read().decode("utf-8", "replace")


print("MEASUREMENT 13: which cornerstones the live wing pages list (production, not this branch)")
print("file: scripts/fable/o13_production_wings.py")
print(f"site measured: {base}")
try:
    d = json.loads(get(base + "/api/v1/meta/deploy.json"))
    print(f"that site's own deploy stamp: commit {d.get('commit')}, version {d.get('version')}, deployed {d.get('deployed_at')}")
except Exception as e:
    print("deploy stamp: not readable:", e)
print("-" * 78)
pages = {}
listed = 0
for wing, rid in PROBES:
    if wing not in pages:
        pages[wing] = get(f"{base}/en/{wing}/")
    cls, slug = rid.split("/")
    there = f'href="/en/{cls}/{slug}/"' in pages[wing]
    listed += there
    print(f"  /en/{wing}/  {'lists' if there else 'does NOT list'}  {rid}")
print("-" * 78)
print(f"{listed} of {len(PROBES)} probed cornerstones are listed on the wing page that should hold them (the last two are controls that should be listed)")
