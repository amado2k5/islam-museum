#!/usr/bin/env python3
"""Create a draft data/source/<id>.yaml for every book in books.yaml that has no source entity yet (existing ids are mapped, never duplicated).
  make_sources.py [--write]       dry-run by default; --write creates files. Run `npm run validate` afterwards."""
import sys
from pathlib import Path
import yaml
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(Path(__file__).parent))
from idmap import MAP
books = yaml.safe_load((Path(__file__).parent / "books.yaml").read_text())["books"]
kind = lambda b: "secondary" if (b["d"] is None or b["d"] > 1300) else "primary"
made = 0
for b in books:
    sid = MAP.get(b["id"], b["id"]); f = ROOT / "data/source" / f"{sid}.yaml"
    if f.exists(): continue
    d = {"id": f"source/{sid}", "class": "source", "kind": kind(b), "type": "book",
         "label": {"ar": f"{b['t']} — {b['a']}" if b["a"] else b["t"]},
         "summary": {"ar": f"{b['t']}" + (f" لـ{b['a']}" + (f" (ت {b['d']}هـ)" if b["d"] else "") if b["a"] else "") + "؛ من مدوَّنة المصادر السنّية الكبرى في المتحف (تصنيف: " + b["cat"] + ")."},
         "title": b["t"], "language": "ar", "open_access": False,
         "reliability_note": "Bibliographic details of the edition used still need a human check (edition, publisher, year, volumes); cite volume/page as printed.",
         "status": {"review": "draft", "completeness": 1, "generated_by": "scripts/harvest/library/make_sources.py"}}
    if b["a"]: d["author"] = [{"family": b["a"].split()[-1], "given": " ".join(b["a"].split()[:-1]) or b["a"]}]
    print("new", sid); made += 1
    if "--write" in sys.argv: f.write_text(yaml.safe_dump(d, allow_unicode=True, sort_keys=False, width=200))
print(made, "source entities", "written" if "--write" in sys.argv else "(dry run)")
