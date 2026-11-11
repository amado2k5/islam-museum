#!/usr/bin/env python3
"""Statement 7: the absence list is honest. Every subject claimed to have no record has survived a search under other spellings.

Reads scripts/fable/absences.json: the subjects the canon register claimed were missing at the baseline, each attacked
by a fresh-context verifier whose job was to find it. For every subject this oracle re-runs the search over the graph
artifact (labels in every language, aliases, slugs, names, historical names, terms, titles; spelling normalised):

  absent     no real record of the subject's class matches any published variant, exactly or word for word, other than
             the near misses the verifier opened and rejected (each with its reason). A variant that reaches more than
             ten records of the class is a name fragment (a nisba such as "al-Tusi", a title such as "Hafiz"): it is too
             common to settle anything, so for it only an exact match counts, and the oracle prints how many it reaches;
  stub-only  the named id is a stub and no real record of the class matches;
  found      the named record exists, is not a stub, and is reached by at least one published variant.

It also checks that docs/canon.md's "Not in the graph yet" section now lists exactly the subjects that survived.

  npm run graph && python3 scripts/fable/o07_absences.py [--write-md]
"""
import json, os, re, sys
from fable import Oracle, ROOT
import find_record as F

o = Oracle("07", "the absence list is honest: every claimed absence survived an alias search (statement 7)")
data = json.load(open(os.path.join(ROOT, "scripts/fable/absences.json"), encoding="utf-8"))
subjects = data["subjects"]
by_id = {n["id"]: n for n in o.graph["nodes"]}
graph_path = os.path.join(ROOT, ".cache", "graph.json")
count = {s: sum(1 for x in subjects if x["status"] == s) for s in ("found", "stub-only", "absent")}
o.note(f"claimed missing by the canon register at the baseline: {len(subjects)} subjects ({data['claimed_in']})")
o.note(f"  found under another name: {count['found']}   only a stub: {count['stub-only']}   absent after the search: {count['absent']}")
o.note()

bad = []
few = [s["subject"] for s in subjects if len(s["variants"]) < 6]
for s in subjects:
    rejected = {m["record"] for m in s.get("near_misses") or []}
    hits, fragments = {}, []
    for v in s["variants"]:
        found = {rid: h for rid, h in F.find(v, s["class"], graph_path).items() if h[0] in ("exact", "tokens")}
        common = sum(1 for h in found.values() if not h[2]) > 10
        if common:
            fragments.append(f"{v} ({sum(1 for h in found.values() if not h[2])})")
        for rid, (kind, raw, stub) in found.items():
            if common and kind != "exact":
                continue
            if rid not in hits or kind == "exact":
                hits[rid] = (kind, raw, stub, v)
    real_hits = {r: h for r, h in hits.items() if not h[2]}
    if s["status"] == "found":
        n = by_id.get(s["record"])
        reached = s["record"] in hits or any(s["record"] in F.find(v, None, graph_path) for v in s["variants"])
        ok = bool(n) and not n["stub"] and reached
        line = f"found      {s['subject']:<34} -> {s['record']}  (as «{s['found_as']}»; {len(s['variants'])} variants searched)"
        if not ok:
            bad.append(f"{s['subject']}: record {s['record']} " + ("does not exist" if not n else "is a stub" if n["stub"] else "is not reached by any published variant"))
    else:
        unexplained = sorted(r for r in real_hits if r not in rejected)
        stub_ok = True
        if s["status"] == "stub-only":
            n = by_id.get(s["record"])
            stub_ok = bool(n) and n["stub"]
            if not stub_ok:
                bad.append(f"{s['subject']}: {s['record']} is not a stub")
        line = f"{s['status']:<10} {s['subject']:<34} {len(s['variants'])} variants searched, {len(rejected)} near misses opened and rejected" + (f"; stub {s['record']}" if s["status"] == "stub-only" else "")
        if unexplained:
            bad.append(f"{s['subject']}: a real {s['class']} record matches a variant and is not among the rejected near misses: " + ", ".join(f"{r} (as «{real_hits[r][1]}» for \"{real_hits[r][3]}\")" for r in unexplained[:4]))
    o.note("  " + line)
    if s["status"] != "found":
        o.note("             variants: " + " · ".join(s["variants"]))
        if fragments:
            o.note("             name fragments, with the number of records each reaches (exact matches only are counted): " + ", ".join(fragments))
        for m in s.get("near_misses") or []:
            o.note(f"             near miss {m['record']}: {m['why_not']}")

o.note()
o.check("every subject was searched under at least six spellings", not few, ", ".join(few))
o.check("every claimed absence survives the search: no unexplained record matches any published variant", not [b for b in bad if "matches a variant" in b], "; ".join(b for b in bad if "matches a variant" in b))
o.check("every subject marked found points at a real record reached by a published variant, and every stub is a stub", not [b for b in bad if "matches a variant" not in b], "; ".join(b for b in bad if "matches a variant" not in b))
doc = open(os.path.join(ROOT, "docs/canon.md"), encoding="utf-8").read()
sec = re.search(r"## Not in the graph yet\n\n(.*?)\n\n## ", doc, re.S)
listed = sec.group(1) if sec else ""
still = [s["subject"] for s in subjects if s["status"] != "found"]
wrongly = [s["subject"] for s in subjects if s["status"] == "found" and re.search(r"(?<![\w-])" + re.escape(s["subject"]) + r"(?![\w-])", listed)]
missing = [x for x in still if x.split(" (")[0].replace("the ", "") not in listed]
o.check("docs/canon.md no longer lists as missing any subject that has a record", not wrongly, ", ".join(wrongly))
o.check("docs/canon.md lists every subject that is still absent or only a stub", not missing, ", ".join(missing))

if "--write-md" in sys.argv:
    L = ["# The absence list", "",
         "_Generated by `python3 scripts/fable/o07_absences.py --write-md` from `scripts/fable/absences.json`. Do not hand-edit._", "",
         "At the mission baseline the canon register listed 29 subjects (31 when the two paired entries are split) as having no record in the museum. A verifier with no stake in the list was given one job: find each of them under another spelling, transliteration, epithet, regnal name or slug. This is what survived.", "",
         f"| Claimed missing | Found under another name | Only a stub | Absent after the search |", "|---|---|---|---|",
         f"| {len(subjects)} | {count['found']} | {count['stub-only']} | {count['absent']} |", "",
         "## Still absent", "", "Every spelling searched is listed. A near miss is a record that matched and was opened and rejected, with the reason.", ""]
    for s in subjects:
        if s["status"] == "found":
            continue
        L += [f"### {s['subject']}" + (" (a stub only)" if s["status"] == "stub-only" else ""), "",
              (f"Stub: `{s['record']}`. " if s["status"] == "stub-only" else "") + "Searched as: " + " · ".join(s["variants"]) + ".", ""]
        for m in s.get("near_misses") or []:
            L.append(f"- Near miss `{m['record']}`: {m['why_not']}")
        L.append("")
    L += ["## Found: the register was wrong about these", "", "| Subject | Record | Found as |", "|---|---|---|"]
    for s in subjects:
        if s["status"] == "found":
            L.append(f"| {s['subject']} | `{s['record']}` | {s['found_as']} |")
    L.append("")
    open(os.path.join(ROOT, "docs/fable-run/ABSENCES.md"), "w", encoding="utf-8").write("\n".join(L))
    o.note("wrote docs/fable-run/ABSENCES.md")
o.finish()
