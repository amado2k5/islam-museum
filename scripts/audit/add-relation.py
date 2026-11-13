#!/usr/bin/env python3
"""Append one sourced relation to a record's `relations` block, leaving every other byte alone (audit S12).
  python3 scripts/audit/add-relation.py <class/slug> <type> <target> <source> "<note>"
Refuses when the record already has that type and target, when the source or target record does not exist, or when
the file does not parse to exactly the old record plus the new relation."""
import re, sys
from pathlib import Path
import yaml
ROOT = Path(__file__).resolve().parents[2]
rid, typ, target, source, note = sys.argv[1:6]
p = ROOT / f"data/{rid}.yaml"
for x in (target, source):
    if not (ROOT / f"data/{x}.yaml").exists(): raise SystemExit(f"{x} does not exist")
t = p.read_text(encoding="utf8"); d = yaml.safe_load(t)
if any(r["type"] == typ and r["target"] == target for r in d.get("relations", [])): raise SystemExit(f"{rid} already has {typ} {target}")
rel = {"type": typ, "target": target, "sources": [source], "note": note}
line = yaml.safe_dump(rel, default_flow_style=True, allow_unicode=True, width=10**6, sort_keys=False).strip()
lines = t.rstrip("\n").split("\n")
i = next((k for k, l in enumerate(lines) if re.match(r"^relations:(\s|$)", l)), None)
if i is None:
    lines += ["relations:", f"  - {line}"]
elif lines[i].strip() != "relations:":
    raise SystemExit(f"{rid}: relations is written inline; add by hand")
else:
    j = i + 1
    while j < len(lines) and (lines[j].startswith((" ", "\t", "- ")) or lines[j].strip() == ""): j += 1
    while j > i + 1 and lines[j - 1].strip() == "": j -= 1
    indent = re.match(r"^(\s*)-", lines[i + 1]).group(1) if j > i + 1 else "  "
    lines[j:j] = [f"{indent}- {line}"]
new = "\n".join(lines) + "\n"
after = yaml.safe_load(new)
assert after["relations"] == d.get("relations", []) + [rel] and {k: v for k, v in after.items() if k != "relations"} == {k: v for k, v in d.items() if k != "relations"}
p.write_text(new, encoding="utf8")
print(f"{rid}: + {typ} {target} [{source}]")
