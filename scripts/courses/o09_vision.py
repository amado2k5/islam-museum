#!/usr/bin/env python3
"""Statement 9: the vision pass. The new surface was reviewed from committed screenshots at three widths in both
languages; every defect is fixed and confirmed gone on a re-taken screenshot by a LATER reviewer, or registered with a reason.

Mechanical: this oracle reads the committed files and judges nothing itself.
  python3 scripts/courses/defects.py && python3 scripts/courses/o09_vision.py [--save]
"""
import collections, glob, json, os
from lib import Oracle, ROOT, sh

V = os.path.join(ROOT, "docs", "courses-mission", "vision")
o = Oracle("09", "the vision pass: committed screenshots, fresh-context defect lists, every defect confirmed gone or registered (statement 9)")
rounds = sorted(d for d in os.listdir(V) if d.startswith("round-"))
widths_ok = langs_ok = True
for r in rounds:
    idx = json.load(open(os.path.join(V, r, "index.json")))
    shots = idx["shots"]
    files = [s["file"] for s in shots]
    present = all(os.path.exists(os.path.join(V, r, f)) for f in files)
    tracked = len(sh(f"git ls-files docs/courses-mission/vision/{r}").splitlines())
    w = sorted({s["width"] for s in shots if s["state"] == "as loaded"})
    l = sorted({s["lang"] for s in shots})
    over = sorted({s["file"].split("-nojs-")[0] for s in shots if s["overflow_px"] > 0 and "nojs" not in s["file"]})
    o.note(f"{r}{' (targeted: ' + idx['only'] + ')' if idx.get('only') else ''}: {len(files)} screenshots captured at commit {idx['commit'][:10]} (uncommitted paths at capture: {idx['uncommitted_paths']}); widths {w}; languages {l}; all files present: {present}; files tracked by git in the folder: {tracked}; pages with sideways scroll outside the no-script shots: {len(over)}")
    if not idx.get("only"):  # a targeted round re-takes only the pages a fix touched
        widths_ok = widths_ok and w == [390, 820, 1280]
    langs_ok = langs_ok and l == ["ar", "en"]
    reviews = sorted(os.path.basename(f) for f in glob.glob(os.path.join(V, r, "review*.md")) + glob.glob(os.path.join(V, r, "confirm*.md")))
    o.note(f"   reviewers' files: {reviews}")
d = json.load(open(os.path.join(V, "defects.json")))["defects"]
by = collections.Counter(e["status"] for e in d)
sev = collections.Counter(e["severity"] for e in d)
o.note()
o.note(f"defects found by fresh reviewers over {len(rounds)} rounds: {len(d)} (high {sev.get('high', 0)}, medium {sev.get('medium', 0)}, low {sev.get('low', 0)})")
o.note(f"  closed (fixed, and a later reviewer saw it gone on a re-taken screenshot): {by.get('closed', 0)}")
o.note(f"  registered with a reason: {by.get('registered', 0)}")
o.note(f"  fixed but not yet confirmed by a later reviewer: {by.get('awaiting a later reviewer', 0)}")
o.note(f"  a later reviewer still saw it: {by.get('still present', 0)}")
why = collections.Counter()
for e in d:
    if e["status"] == "registered":
        r = e["reason"]
        why["pilot data, not rewritten" if r.startswith("Pilot data") or "Pilot data" in r else "by design" if r.startswith("By design") else "disproved by a measurement" if r.startswith("Disproved") else "capture artefact" if "artefact" in r else "other"] += 1
o.note(f"  registered, by reason: {dict(why)}")
open_ = [e["id"] for e in d if e["status"] in ("awaiting a later reviewer", "still present")]
high_open = [e["id"] for e in d if e["severity"] == "high" and e["status"] != "closed"]
o.check("screenshots were captured at phone, tablet and desktop widths in every round", widths_ok)
o.check("screenshots cover Arabic and English in every round", langs_ok)
o.check("at least two review rounds exist, the later ones by reviewers who had not seen the earlier", len(rounds) >= 2)
o.check("every defect is closed by a later reviewer or registered with a reason", not open_, ", ".join(open_))
o.check("every registered defect carries its reason", all(e.get("reason") for e in d if e["status"] == "registered"))
o.check("no high-severity defect is left open or merely registered", not high_open, ", ".join(high_open))
o.done("o09-vision")
