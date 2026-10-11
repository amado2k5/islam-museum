#!/usr/bin/env python3
"""One command that reports where every drill stands (docs/plan/15 §9): registry, downloads, seeds, candidates, checkpoints, disk."""
import json, shutil
from pathlib import Path
from common import HARVEST, REGISTRY

print(f"workspace: {HARVEST}")
free = shutil.disk_usage(HARVEST).free / 2**30
print(f"disk free: {free:.0f} GiB")
print("\nsources:")
for k, v in REGISTRY["sources"].items():
    if k == "forbidden":
        continue
    print(f"  {k:18} {v['status']:8} layer={v['layer']:6} {v['licence']}")
for layer in ("cc0", "by", "by-sa", "odbl", "nc", "link-only", "unverified"):
    n = sum(1 for _ in (HARVEST / "layers" / layer).rglob("*") if _.is_file())
    if n:
        print(f"layer {layer}: {n} files")
seeds = HARVEST / "db" / "seeds.txt"
print(f"\nseeds: {len(seeds.read_text().split()) if seeds.exists() else 0} QIDs")
for f in sorted((HARVEST / "logs").glob("*.checkpoint.json")):
    print(f"checkpoint {f.name}: {json.dumps({k: (v.get('count') if isinstance(v, dict) else v) for k, v in json.loads(f.read_text()).items()})}")
raw = list((HARVEST / "raw" / "quran").glob("*"))
print(f"\nquran text: {'present (' + ', '.join(p.name for p in raw) + ')' if raw else 'MISSING: download by hand from https://tanzil.net/download/ (doc 15 §6.3)'}")
cand = sum(1 for _ in (HARVEST / "candidates").rglob("*.yaml"))
print(f"candidates waiting: {cand}")
