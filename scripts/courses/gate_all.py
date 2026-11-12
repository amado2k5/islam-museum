#!/usr/bin/env python3
"""Run the ingestion gate for every course on the branch, by one hand, and say what each printed.

The fleet's agents each ran their own course's gate; two correction agents handed work to sub-agents and did not
re-run it. This script is the coordinator's own run: every subject, the same command, the outputs saved.

  python3 scripts/courses/gate_all.py          # every course; rewrites docs/courses/gates/check-<subject>.out

The authority's document for a course is found from its last saved gate output (the line naming official.json), or
from the manifest whose expectation codes match. A course made before the pipeline (the pilot) is run without --strict.
A gap-only course has no record to gate and is listed as such.
"""
import glob, json, os, re, subprocess, sys
from lib import ROOT, courses, tree, baseline_has

cs = courses()
subjects = sorted(i for i, d in cs.items() if d["kind"] == "subject")
green, rows = 0, []
for sid in subjects:
    slug = sid.split("/")[1]
    official = None
    gp = os.path.join(ROOT, "docs", "courses", "gates", f"check-{slug}.out")
    if os.path.exists(gp):
        m = re.search(r"authority's document: (\S+official\.json)", open(gp, encoding="utf-8").read())
        official = m.group(1) if m else None
    if not official or not os.path.exists(os.path.join(ROOT, official)):
        codes = {e["code"] for i in tree(cs, sid) for e in cs[i].get("expectations", []) if cs[i]["kind"] == "lesson"}
        best = (0, None)
        for f in glob.glob(os.path.join(ROOT, ".cache", "curricula", "*", "official.json")):
            if "/_" in f:
                continue
            try:
                off = json.load(open(f, encoding="utf-8"))
                oc = {s["code"] for st in off["strands"] for ov in st["overall"] for s in ov["specific"]}
            except Exception:
                continue
            n = len(codes & oc)
            if codes and codes <= oc and n > best[0]:
                best = (n, os.path.relpath(f, ROOT))
        official = best[1]
    pilot = baseline_has(f"data/{sid}.yaml")
    cmd = [sys.executable, os.path.join(ROOT, "scripts", "courses", "check_course.py"), sid] + (["--official", official] if official else []) + ([] if pilot else ["--strict"]) + ["--save"]
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    last = (r.stdout.strip().splitlines() or ["(no output) " + r.stderr[-200:]])[-1]
    green += last.startswith("RESULT: GREEN")
    rows.append((slug, "pilot" if pilot else "pipeline", official or "(no official document found)", last))
    print(f"{slug:48s} {'pilot   ' if pilot else 'pipeline'} {last[:110]}")
gapsonly = [os.path.basename(f)[:-5] for f in sorted(glob.glob(os.path.join(ROOT, "docs", "courses", "gaps", "*.yaml"))) if f"course/{os.path.basename(f)[:-5]}" not in cs]
for g in gapsonly:
    print(f"{g:48s} gap only: no record to gate")
print()
print(f"GATES: {len(subjects)} courses with records; ingestion gate GREEN for {green}; not green: {[r[0] for r in rows if not r[3].startswith('RESULT: GREEN')]}; gap-only courses: {len(gapsonly)}")
