#!/usr/bin/env python3
"""Put a depth layer into a lesson's prose file, before "Try this" (docs/courses/depth-rubric.md).

  python3 scripts/courses/insert_depth.py <lang> course/<lesson-slug> <file-with-the-sections.md>

Replaces any depth sections already in the file with the ones given, and leaves every other section as it is.
"""
import os, re, sys
from check_depth import HEAD
from lib import ROOT

lang, lid, src = sys.argv[1:4]
path = os.path.join(ROOT, "content", lang, lid + ".md")
text = open(path, encoding="utf-8").read()
new = open(src, encoding="utf-8").read().strip()
for h in re.findall(r"^##\s+(.*?)\s*$", new, re.M):
    if h not in HEAD[lang]:
        raise SystemExit(f"'{h}' is not a depth heading for {lang}")
parts = re.split(r"(?m)^(?=## )", text)
keep = [p for p in parts if not (p.startswith("## ") and p.splitlines()[0][3:].strip() in HEAD[lang])]
at = next((i for i, p in enumerate(keep) if re.match(r"## (Try this|جرّب هذا|جرب هذا)\s*$", p.splitlines()[0])), len(keep))
keep = [p if p.endswith("\n\n") else p.rstrip("\n") + "\n\n" for p in keep[:at]] + [new + "\n\n"] + keep[at:]
open(path, "w", encoding="utf-8").write("".join(keep).rstrip("\n") + "\n")
print(f"{lang}/{lid}: depth layer written")
