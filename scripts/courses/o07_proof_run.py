#!/usr/bin/env python3
"""Statement 7: the proof course was ingested by a fresh-context agent using only PIPELINE.md.

What a script can check, it checks: the run log exists and was written during the run; the runbook the agent was given
is a committed version (so "only PIPELINE.md" can be read exactly as the agent read it); the course's records are new on
this branch; the gate's captured output for the course ends GREEN; and the runbook changed after the run, with the list
of forced edits written down. What a script cannot check (that the agent had no other briefing) rests on the launch
prompt, quoted in full in the proof-run report.

  python3 scripts/courses/o07_proof_run.py [--save]
"""
import os, re
from lib import Oracle, ROOT, OUT, courses, tree, baseline_has, sh

RUNBOOK_AS_RUN = "8abde83fd4769d45d4a76c85bfcc325cf3b71e86"  # release/uat with phase 2 merged: the PIPELINE.md the proof agent read
SID = "course/ca-on-g4-social-studies"
o = Oracle("07", "the proof course was ingested by a fresh-context agent using only PIPELINE.md (statement 7)")
log = os.path.join(ROOT, "docs/courses/runs/ca-on-g4-social-studies.md")
report = os.path.join(ROOT, "docs/courses-mission/PROOF-RUN.md")
o.check("the run log exists", os.path.exists(log))
t = open(log, encoding="utf-8").read() if os.path.exists(log) else ""
times = re.findall(r"\b\d{2}:\d{2}Z\b", t)
o.note(f"run log: {len(t.splitlines())} lines; UTC times written in it: {len(times)} (first {times[0] if times else '-'}, last {times[-1] if times else '-'})")
o.check("the log carries times for its steps", len(times) >= 5)
asrun = sh(f"git show {RUNBOOK_AS_RUN}:docs/courses-mission/PIPELINE.md")
now = open(os.path.join(ROOT, "docs/courses-mission/PIPELINE.md"), encoding="utf-8").read()
o.check("the runbook the agent read is a committed version", len(asrun) > 1000, f"commit {RUNBOOK_AS_RUN[:10]}, {len(asrun.splitlines())} lines")
stat = sh(f"git diff --shortstat {RUNBOOK_AS_RUN} HEAD -- docs/courses-mission/PIPELINE.md")
o.note(f"runbook edits since the run: {stat or 'none'}")
o.check("the runbook was repaired after the run", asrun.strip() != now.strip())
cs = courses()
ids = tree(cs, SID) if SID in cs else []
new = [i for i in ids if not baseline_has(f"data/{i}.yaml")]
o.note(f"records of the proof course: {len(ids)}; new on this branch: {len(new)}")
o.check("the proof course's records exist and are new on this branch", len(ids) > 3 and len(new) == len(ids))
gate = os.path.join(ROOT, "docs", "courses", "gates", "check-ca-on-g4-social-studies.out")
last = open(gate, encoding="utf-8").read().strip().splitlines()[-1] if os.path.exists(gate) else "(no captured gate output)"
o.note(f"the gate's captured last line for the course: {last}")
o.check("the ingestion gate ends GREEN for the proof course", last.startswith("RESULT: GREEN"))
rep = open(report, encoding="utf-8").read() if os.path.exists(report) else ""
o.check("the proof-run report quotes the launch prompt, gives the timing and lists the runbook edits the run forced", all(k in rep for k in ("## The launch prompt", "## Timing", "## Runbook edits the run forced")))
o.done("o07-proof-run")
