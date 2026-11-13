#!/usr/bin/env python3
"""Audit of 13 November 2026, S8: take back the dates a date-enrichment pass grafted onto the wrong person.

The pass (27 commits of 9 November 2026, "data(person): date-enrichment batch ...") wrote `born` and `died` objects
marked `derived: true` with the note "Date-enrichment pass; source: <name>". On 550 records the record's own text
states a year that the grafted date contradicts (docs/audit/data/s8-conflicts.json: the conflict list, with the
sentence each conflict rests on). This script removes the pass's `born` and `died` from those records and nothing
else: it never writes a date. Six records are held back (`held_back`): read by hand, the later year in their text is
about something else (a dynasty's end, a printing, a later object), so their dates stay.

Every removed value is written to docs/audit/data/s8-removed-dates.json, so any one of them can be put back.

  python3 scripts/audit/s8-remove-grafted-dates.py            # report only
  python3 scripts/audit/s8-remove-grafted-dates.py --apply
"""
import json, re, sys
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[2]
MARK = "Date-enrichment pass"
apply = "--apply" in sys.argv
conflicts = json.loads((ROOT / "docs/audit/data/s8-conflicts.json").read_text(encoding="utf8"))
removed, skipped = [], []

def drop_key(text: str, key: str) -> str:
    """Remove one top-level key (inline or block form) from a YAML document, leaving every other byte alone."""
    lines = text.split("\n")
    out, i = [], 0
    while i < len(lines):
        if re.match(rf"^{key}:(\s|$)", lines[i]):
            i += 1
            while i < len(lines) and (lines[i].startswith((" ", "\t")) or lines[i].strip() == "" and i + 1 < len(lines) and lines[i + 1].startswith((" ", "\t"))):
                i += 1
            continue
        out.append(lines[i]); i += 1
    return "\n".join(out)

for c in conflicts:
    if c["held_back"]:
        skipped.append((c["id"], "held back after a hand read")); continue
    path = ROOT / "data" / f"{c['id']}.yaml"
    text = path.read_text(encoding="utf8")
    doc = yaml.safe_load(text)
    keys = [k for k in ("born", "died") if isinstance(doc.get(k), dict) and MARK in str(doc[k].get("note", ""))]
    if not keys:
        skipped.append((c["id"], "no date from the pass left on the record")); continue
    new = text
    for k in keys:
        new = drop_key(new, k)
    after = yaml.safe_load(new)
    expect = {k: v for k, v in doc.items() if k not in keys}
    if after != expect:
        raise SystemExit(f"{c['id']}: removing {keys} would change something else; stopped")
    removed.append({"id": c["id"], "kinds": c["kinds"], "removed": {k: doc[k] for k in keys}, "text": c["text"]})
    if apply:
        path.write_text(new, encoding="utf8")

print(f"conflicts listed: {len(conflicts)}; dates removed from {len(removed)} records "
      f"({sum('died' in r['removed'] for r in removed)} died, {sum('born' in r['removed'] for r in removed)} born); skipped {len(skipped)}")
for s in skipped: print("  skipped", *s)
if apply:
    (ROOT / "docs/audit/data/s8-removed-dates.json").write_text(json.dumps(removed, ensure_ascii=False, indent=1, default=str) + "\n", encoding="utf8")
    print("applied; ledger -> docs/audit/data/s8-removed-dates.json")
