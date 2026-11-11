#!/usr/bin/env python3
"""Statement 8: the vision pass is mechanical, not impressionistic.

The proof is three sets of files, all committed:
  docs/fable-run/vision/shots/         the rendered pages as screenshots, with index.json (what was captured, at which
                                       commit, from which build, and the sideways overflow measured in each page);
  docs/fable-run/vision/review-*.md    the defect lists of fresh-context reviewers who did not build the pages and who
                                       looked only at the committed screenshots;
  docs/fable-run/vision/defects.json   every defect they listed, each with a status: fixed (and how) or registered
                                       (and why it stands).
This oracle checks the sets are complete and agree with each other. It does not look at pixels: the reviewers did.

  python3 scripts/fable/o08_vision.py
"""
import glob, json, os, re
from fable import Oracle, ROOT, sh

o = Oracle("08", "the vision pass is mechanical: screenshots, fresh-context defect lists, every defect fixed or registered (statement 8)", needs_graph=False)
V = os.path.join(ROOT, "docs/fable-run/vision")
idx_path = os.path.join(V, "shots", "index.json")
if not os.path.exists(idx_path):
    o.finish("no screenshots have been captured and committed yet")
idx = json.load(open(idx_path))
shots = idx["shots"]
o.note(f"screenshots: {len(shots)}, captured at commit {idx['captured_at_commit']} from {idx['source']}; uncommitted measured paths at capture: {idx['uncommitted_measured_paths']}")
WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"]
want = {(l, p, s) for l in ("ar", "en") for p in ["river", "room-first", "room-badr", "room-last", "complete", "home"] + [f"wing-{w}" for w in WINGS] for s in ("phone", "tablet", "desktop")}
have = {(s["lang"], s["page"], s["size"]) for s in shots}
o.check("the capture covers the Tour's pages, the homepage and the nine wing landings, in Arabic and English, at phone, tablet and desktop widths", want <= have, f"{len(want & have)} of {len(want)}; missing {sorted(want - have)[:4]}")
missing = [s["file"] for s in shots if not os.path.exists(os.path.join(V, "shots", s["file"]))]
o.check("every screenshot in the index is a committed file", not missing and not sh("git status --porcelain -- docs/fable-run/vision/shots"), f"{len(missing)} missing; uncommitted changes: {len(sh('git status --porcelain -- docs/fable-run/vision/shots').splitlines())}")
o.check("every captured page answered 200", all(s["status"] == 200 for s in shots), ", ".join(s["file"] for s in shots if s["status"] != 200))
anc = os.system(f"git -C '{ROOT}' merge-base --is-ancestor {idx['captured_at_commit']} HEAD") == 0
later = sh(f"git diff --name-only {idx['captured_at_commit']} HEAD -- site i18n tour").splitlines() if anc else ["?"]
o.check("the screenshots show the pages as they are now: no site, string or manifest file changed since the capture", anc and not later, f"changed since: {', '.join(later[:5])}")

reviews = sorted(glob.glob(os.path.join(V, "review-*.md")))
o.note(f"fresh-context review files: {', '.join(os.path.basename(r) for r in reviews) or 'none'}")
o.check("at least two fresh-context reviewers left a defect list", len(reviews) >= 2)
dpath = os.path.join(V, "defects.json")
defects = json.load(open(dpath))["defects"] if os.path.exists(dpath) else None
if defects is None:
    o.check("the defect register exists", False)
else:
    by = {}
    for d in defects:
        by[d.get("status")] = by.get(d.get("status"), 0) + 1
    o.note(f"defects listed by the reviewers: {len(defects)}  ({', '.join(f'{k}: {v}' for k, v in sorted(by.items()))})")
    scope = {}
    for d in defects:
        scope[d.get("where")] = scope.get(d.get("where"), 0) + 1
    o.note(f"  by where they are: {', '.join(f'{k}: {v}' for k, v in sorted(scope.items()))}")
    bad = [d.get("id") for d in defects if d.get("status") not in ("fixed", "registered") or not str(d.get("note", "")).strip() or not d.get("screenshots")]
    o.check("every defect is fixed or registered, names the screenshot it was seen in, and says what was done or why it stands", not bad, f"{len(bad)} incomplete: {bad[:6]}")
    ids = set()
    for r in reviews:
        ids |= set(re.findall(r"\b([A-Z]\d{1,3})\b(?=\s*\|)", open(r, encoding="utf-8").read()))
    unreg = sorted(ids - {d.get("id") for d in defects})
    o.check("every defect id in the reviewers' lists is in the register", not unreg, ", ".join(unreg[:10]))
# a second round: a reviewer who re-checks earlier defects on the re-captured screenshots writes rows of three cells,
# | id | GONE / STILL THERE / CHANGED | what the new screenshot shows |. Nothing may be called fixed that is still seen.
recheck = {}
for r in reviews:
    for line in open(r, encoding="utf-8"):
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 3 and re.fullmatch(r"[A-Z]\d{1,3}", cells[0]):
            verdict = next((k for k in ("STILL THERE", "GONE", "CHANGED") if cells[1].upper().replace("*", "").startswith(k)), None)
            if verdict:
                recheck[cells[0]] = verdict
if recheck and defects is not None:
    status = {d.get("id"): d.get("status") for d in defects}
    tally = {k: sum(1 for v in recheck.values() if v == k) for k in ("GONE", "STILL THERE", "CHANGED")}
    o.note(f"second round, earlier defects looked for again on the re-captured screenshots: {len(recheck)}  (gone: {tally['GONE']}, still there: {tally['STILL THERE']}, changed: {tally['CHANGED']})")
    called_fixed = sorted(i for i, v in recheck.items() if v == "STILL THERE" and status.get(i) == "fixed")
    o.check("nothing is called fixed that the second-round reviewer still sees", not called_fixed, f"called fixed but still seen: {called_fixed or 'none'}")
    changed = sorted(i for i, v in recheck.items() if v == "CHANGED")
    o.note(f"  seen in a changed form (each one's register note says what stands): {', '.join(f'{i} ({status.get(i)})' for i in changed) or 'none'}")
    fixed_gone = sum(1 for i, v in recheck.items() if v == "GONE" and status.get(i) == "fixed")
    o.note(f"  called fixed and confirmed gone by the second round: {fixed_gone}")
overflow = [s for s in shots if s["horizontalOverflowPx"] > 0]
o.note(f"pages that scroll sideways, measured in the page at capture: {len(overflow)}" + ("" if not overflow else ": " + ", ".join(f"{s['file']} ({s['horizontalOverflowPx']}px)" for s in overflow[:8])))
tour_overflow = [s for s in overflow if s["page"] in ("river", "room-first", "room-badr", "room-last", "complete")]
o.check("no Tour page scrolls sideways at any width", not tour_overflow, ", ".join(s["file"] for s in tour_overflow))
o.finish()
