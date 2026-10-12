#!/usr/bin/env python3
"""Check library citations in new content: every {cite:ID p.N} in content/ar/** must name an existing source entity, and for books whose
text has been extracted, N must lie inside the page count of at least one extracted copy. Exit 1 on any failure.
  verify_cites.py [paths...]     default: content/ar"""
import json, os, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]; H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
CITE = re.compile(r"\{cite:([a-z0-9-]+)\s+(?:p\.)?(\d+)(?:/(\d+))?")
sys.path.insert(0, str(Path(__file__).parent))
from idmap import MAP
pages = {}
for m in (H / "books").glob("*/*/*/meta.json"):
    pages.setdefault(MAP.get(m.parent.parent.name, m.parent.parent.name), []).append(json.loads(m.read_text())["pages"])
bad = 0
for root in map(Path, sys.argv[1:] or [str(ROOT / "content/ar")]):
    for f in root.rglob("*.md") if root.is_dir() else [root]:
        for n, line in enumerate(f.read_text().splitlines(), 1):
            for sid, a, b in CITE.findall(line):
                if not (ROOT / "data/source" / f"{sid}.yaml").exists():
                    print(f"{f}:{n}: unknown source {sid}"); bad += 1
                elif sid in pages and int(a) > max(pages[sid]) and not b:
                    print(f"{f}:{n}: {sid} page {a} beyond extracted page count {max(pages[sid])}"); bad += 1
print("cite check:", "FAILED" if bad else "ok", f"({bad} problems)"); sys.exit(1 if bad else 0)
