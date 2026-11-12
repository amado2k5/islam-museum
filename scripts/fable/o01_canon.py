#!/usr/bin/env python3
"""Statement 1: a canon exists in the data, selected by the museum's own structure; a reach signal may rank, never write.

Reads data/, content/ar/, tour/ and docs/canon.md through the canon script's own scanner (scripts/report/canon.py), so the
signals measured here are the ones the selection used. No network: the Wikipedia language-edition counts are not read.

  python3 scripts/fable/o01_canon.py
"""
import collections, inspect, json, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "report"))
from fable import Oracle, ROOT
import canon as C

o = Oracle("01", "the canon exists and is selected by the museum's own structure (statement 1)", needs_graph=False)
ents = C.scan()
marked = {k: e for k, e in ents.items() if e["current"]}
ones = {k for k, e in marked.items() if e["current"] == 1}
include = set(C.INCLUDE)

base = json.load(open("schema/_base.schema.json"))
o.check("the schema carries the field: importance is an optional 1-or-2 integer on every class",
        base["properties"].get("importance", {}).get("enum") == [1, 2] and "importance" not in base.get("required", []))
o.check("roughly 800-1,000 canon records", 800 <= len(marked) <= 1000, f"{len(marked)} records carry importance")
o.check("roughly 250-300 cornerstones", 250 <= len(ones) <= 300, f"{len(ones)} records carry importance 1")

o.note()
o.note("How each canon record stands on the museum's own structure (g = inbound relations + inbound Arabic prose links;")
o.note("paths = appearances in pathways, courses, journeys and tour halls; woven = g + 3*paths). The script's eligibility")
o.note("rule is evaluated twice: with the reach signal set to zero, and with it set as high as it can go.")
alone, with_reach, incl, below = [], [], [], []
for k, e in sorted(marked.items()):
    if C.eligible(dict(e, sl=0)):
        alone.append(k)
    elif C.eligible(dict(e, sl=10 ** 9)):
        with_reach.append(k)
    elif k in include:
        incl.append(k)
    else:
        below.append(k)
o.note(f"  {len(alone):>4}  qualify on structure alone (eligible even with the reach signal at zero)")
o.note(f"  {len(with_reach):>4}  pass the structural floor and need the reach signal to be eligible")
o.note(f"  {len(incl):>4}  are editorial includes named in the script (of {len(include)} named; the rest now qualify by rule)")
o.note(f"  {len(below):>4}  are below the structural floor today and not an editorial include")
for k in below:
    e = marked[k]
    o.note(f"        {k}: g={e['g']} paths={e['paths']} importance={e['current']}")
zero = [k for k, e in marked.items() if e["g"] + e["paths"] == 0]
o.note(f"  {len(zero):>4}  canon records have no internal signal at all (g = 0 and paths = 0): {', '.join(sorted(zero)) or 'none'}")
o.check("no record is in the canon on the reach signal alone: every one passes the structural floor, is a period, or is a named editorial include",
        not below, f"{len(below)} below the floor")
o.check("no canon record is without any internal signal unless it is a named editorial include or a period", all(k in include or k.startswith("period/") for k in zero))

src = inspect.getsource(C.write_records)
subs = re.findall(r"re\.sub\(r?\"([^\"]+)\"", src)
o.check("the reach signal never writes: the canon script's only write to a record is its importance line", all("importance" in s or s == "^status:" for s in subs) and "sl" not in src, f"substitutions in write_records: {subs}")
hits = 0
for cls in os.listdir("data"):
    d = os.path.join("data", cls)
    if os.path.isdir(d):
        for f in os.listdir(d):
            if f.endswith(".yaml") and re.search(r"^\s*(sitelinks|sitelink_count|wikipedia_editions)\s*:", open(os.path.join(d, f), encoding="utf-8", errors="ignore").read(), re.M):
                hits += 1
o.check("no record stores a Wikipedia language-edition count", hits == 0, f"{hits} records with such a field")

doc = open("docs/canon.md", encoding="utf-8").read()
total = re.search(r"\| \*\*all\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\*", doc)
o.check("the readable register docs/canon.md matches the data", bool(total) and int(total.group(1)) == len(marked) and int(total.group(2)) == len(ones),
        f"register says {total.group(1) if total else '?'} canon, {total.group(2) if total else '?'} cornerstones")
missing = [k for k in marked if "`" + k.split("/")[1] + "`" not in doc]
o.check("every canon record is named in the register", not missing, f"{len(missing)} missing")

o.note()
o.note("Cornerstones by Hijri century of the record's own date (the century floor; 0 = before the Hijra, 15 = the present century):")
cent = collections.Counter()
canon_cent = collections.Counter()
undated = 0
for k, e in marked.items():
    c = C.anchor_century(k, e["cls"])
    if c is None:
        undated += e["current"] == 1
        continue
    canon_cent[c] += 1
    if e["current"] == 1:
        cent[c] += 1
for c in range(0, 16):
    o.note(f"  century {c:>2}: {cent[c]:>3} cornerstones, {canon_cent[c]:>3} canon records")
o.note(f"  cornerstones with no date of their own (concepts, practices, most places and works): {undated}")
empty = [c for c in C.FLOOR_CENTURIES if cent[c] == 0]
o.check("every Hijri century from the 1st to the 14th holds at least one cornerstone", not empty, f"empty: {empty}" if empty else "none empty")
prior = sorted(C.doc_state()[1])
o.note(f"  raised by the century floor (marked in the register): {', '.join(prior) or 'none'}")

o.note()
o.note("Cornerstones by wing (a record's own `wings` field; a record may sit in more than one):")
by_wing = collections.Counter()
wingless = []
for k in sorted(ones):
    t = open(f"data/{k}.yaml", encoding="utf-8").read()
    m = re.search(r"^wings:[ \t]*\[([^\]\n]*)\]", t, re.M)
    ws = [w.strip() for w in m.group(1).split(",") if w.strip()] if m else re.findall(r"-[ \t]*(\w+)", (re.search(r"^wings:[ \t]*\n((?:[ \t]*-.*\n)+)", t, re.M) or [None, ""])[1])
    if not ws:
        wingless.append(k)
    for w in ws:
        by_wing[w] += 1
WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"]
for w in WINGS:
    o.note(f"  {w:8} {by_wing[w]:>3}")
o.check("every cornerstone sits in at least one wing", not wingless, f"{len(wingless)} with no wing")
o.check("every one of the nine wings holds at least one cornerstone", all(by_wing[w] > 0 for w in WINGS), "empty: " + (", ".join(w for w in WINGS if by_wing[w] == 0) or "none"))
o.finish()
