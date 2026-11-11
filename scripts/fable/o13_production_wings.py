#!/usr/bin/env python3
"""A measurement of production, not of this branch: which cornerstones the live wing pages list.

Fetches the live wing landing pages (what visitors see: the deploy stamped at /api/v1/meta/deploy.json) and checks, for a
fixed handful of cornerstones, whether the wing page that should hold each one links to it. This is the "before" a
visitor can see for themselves; the branch's own state is measured by o01 (cornerstones by wing).

  python3 scripts/fable/o13_production_wings.py [https://islam.museum]
  python3 scripts/fable/o13_production_wings.py --dist .cache/fable-dist    # the same probe on this branch's built pages

With --dist it reads the wing pages of the scoped production build of this branch (scripts/fable/scoped-build.sh), so
the same twelve probes have an "after". The file is numbered 13 for its place in the sequence; it is a measurement, not
the oracle of statement 13 (that is o10_ledger.py).
"""
import json, os, subprocess, sys, urllib.request

DIST = sys.argv[sys.argv.index("--dist") + 1] if "--dist" in sys.argv else None
base = (sys.argv[1] if len(sys.argv) > 1 and not DIST else "https://islam.museum").rstrip("/")
PROBES = [("living", "practice/salah"), ("living", "practice/hajj"), ("living", "practice/sawm-ramadan"), ("living", "practice/zakat"),
          ("words", "work/quran"), ("words", "work/sahih-al-bukhari"), ("words", "work/muwatta-malik"),
          ("time", "period/prophetic-era"), ("time", "polity/abbasid-caliphate"), ("people", "group/quraysh"),
          ("people", "person/muhammad"), ("time", "event/battle-of-badr")]


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "wing-probe/1.0"})
    return urllib.request.urlopen(req, timeout=120).read().decode("utf-8", "replace")


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if DIST:
    sh = lambda c: subprocess.run(c, shell=True, cwd=ROOT, capture_output=True, text=True).stdout.strip()
    print("MEASUREMENT 13: which cornerstones the wing pages list (this branch's built pages, not production)")
    print("file: scripts/fable/o13_production_wings.py")
    print(f"HEAD: {sh('git rev-parse HEAD')}")
    print(f"uncommitted paths under data/ content/ tour/ schema/ scripts/ site/ i18n/: {len([l for l in sh('git status --porcelain -- data content tour schema scripts site i18n').splitlines() if l.strip()])}")
    print(f"built pages: {DIST} (scoped production build: homepage, wing landings and the Tour, rendered by the real site source)")

    def get(url):
        return open(os.path.join(ROOT, DIST, url.split("//", 1)[1].split("/", 1)[1], "index.html"), encoding="utf-8").read()
else:
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
