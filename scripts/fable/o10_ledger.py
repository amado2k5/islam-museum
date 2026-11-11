#!/usr/bin/env python3
"""Statements 10 and 13: every statement has an oracle, and the board is what the oracles last said, never narrated.

Reads the board between the BOARD markers of docs/fable-run/VERIFICATION.md and checks it against the files it names:

  statement 10
  - every statement from 1 to 12 that the brief makes has a row (9 has one, 8 has two; 10 and 13 are this file);
  - every row's oracle is a file committed to git, with no uncommitted change;
  - every row's captured output is a file that ends with the oracle's own RESULT line;
  - every number in docs/fable-run/NUMBERS.md names a captured output that exists.

  statement 13
  - every row's state and last line are, word for word, the RESULT line of its captured output;
  - every captured output was produced at the commit the board names (no row carried over from an earlier run);
  - the board was measured with no uncommitted file under the measured folders;
  - nothing under the measured folders has changed between the commit the board names and HEAD, so the board describes
    the tree as it is now.

  python3 scripts/fable/o10_ledger.py        # board.py runs it last and adds its row
"""
import os, re, subprocess
from fable import Oracle, ROOT, MEASURED, sh

o = Oracle("10 and 13", "every statement has an oracle; the board is derived from the last runs, never narrated", needs_graph=False)
vf = open(os.path.join(ROOT, "docs/fable-run/VERIFICATION.md"), encoding="utf-8").read()
m = re.search(r"<!-- BOARD:BEGIN.*?-->(.*?)<!-- BOARD:END -->", vf, re.S)
block = m.group(1) if m else ""
hm = re.search(r"Measured at commit `([0-9a-f]{40})`.*?uncommitted paths under the measured folders: (\d+)", block)
board_commit, board_dirty = (hm.group(1), int(hm.group(2))) if hm else ("", -1)
rows = []
for line in block.splitlines():
    c = [x.strip() for x in line.strip().strip("|").split(" | ")]
    mm = re.match(r"\*\*(.+?)\*\* ", c[0]) if len(c) == 6 else None
    if mm and c[3].startswith("`scripts/fable/") and "o10_ledger" not in c[3]:
        rows.append({"st": mm.group(1), "state": c[1].strip("*"), "last": c[2], "file": c[3].strip("`"), "out": c[5].strip("`")})
o.note(f"board: measured at {board_commit or 'unknown'}; {len(rows)} rows besides this one")

have = {r["st"].split(" ")[0] for r in rows}
need = [str(n) for n in range(1, 13) if n != 10]
o.check("statement 10: every statement from 1 to 12 has a row on the board (10 and 13 are this oracle)", all(n in have for n in need), "missing: " + (", ".join(n for n in need if n not in have) or "none"))

untracked, dirty, noresult, differs, carried = [], [], [], [], []
for r in rows:
    if subprocess.run(["git", "ls-files", "--error-unmatch", r["file"]], cwd=ROOT, capture_output=True).returncode != 0:
        untracked.append(r["file"])
    elif sh(f"git status --porcelain -- '{r['file']}'"):
        dirty.append(r["file"])
    p = os.path.join(ROOT, r["out"])
    t = open(p, encoding="utf-8").read() if os.path.exists(p) else ""
    res = [l for l in t.splitlines() if l.startswith("RESULT:")]
    if not res:
        noresult.append(r["out"])
        continue
    said = res[-1][8:].replace("|", "/")
    shown = re.sub(r" \[not re-run in this pass; last run at [0-9a-f?unknow]+\]$", "", r["last"])
    if shown != said or r["state"] != ("GREEN" if said.startswith("GREEN") else "NOT-GREEN"):
        differs.append(r["st"])
    hd = re.search(r"^HEAD: ([0-9a-f]{40})", t, re.M)
    if shown != r["last"] or not hd or hd.group(1) != board_commit:
        carried.append(f"{r['st']} (output from {hd.group(1)[:10] if hd else 'unknown'})")
    o.note(f"  statement {r['st']:<22} {r['state']:<9} {os.path.basename(r['out']):<28} produced at {hd.group(1)[:10] if hd else 'unknown'}")

o.check("statement 10: every oracle on the board is a file committed to git", not untracked and not dirty, f"not committed: {untracked or 'none'}; changed since the commit: {dirty or 'none'}")
o.check("statement 10: every row has a captured output that ends with the oracle's own RESULT line", not noresult, f"without one: {noresult or 'none'}")
nm = open(os.path.join(ROOT, "docs/fable-run/NUMBERS.md"), encoding="utf-8").read() if os.path.exists(os.path.join(ROOT, "docs/fable-run/NUMBERS.md")) else ""
named = sorted(set(re.findall(r"`([\w.-]+\.out)`", nm)))
missing = [n for n in named if not os.path.exists(os.path.join(ROOT, "docs/fable-run/oracle-output", n))]
o.check("statement 10: every number in NUMBERS.md names a captured output that exists", bool(named) and not missing, f"{len(named)} outputs named; missing: {missing or 'none'}")

o.check("statement 13: every row's state and last line are the RESULT line of its captured output, word for word", bool(rows) and not differs, f"rows that differ: {differs or 'none'}")
o.check("statement 13: every captured output was produced at the commit the board names", bool(rows) and not carried, f"carried over from an earlier run: {carried or 'none'}")
o.check("statement 13: the board was measured with nothing uncommitted under the measured folders", board_dirty == 0, f"uncommitted paths at the time: {board_dirty}")
head = sh("git rev-parse HEAD")
since = [l for l in sh(f"git diff --name-only {board_commit} HEAD -- " + " ".join(MEASURED)).splitlines() if l.strip()] if board_commit else ["?"]
now = [l for l in sh("git status --porcelain -- " + " ".join(MEASURED)).splitlines() if l.strip()]
o.check("statement 13: nothing under the measured folders has changed since the commit the board names", not since and not now, f"HEAD {head[:10]}; changed in commits since: {len(since)}; uncommitted now: {len(now)}")
o.finish()
