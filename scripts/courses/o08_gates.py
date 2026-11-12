#!/usr/bin/env python3
"""Statement 8: the ship gates at the branch head. validate prints `0 errors`; cite-check prints `0 fail`.

The two gates are run here as separate, asserted steps on their literal strings, never on a search of error output.
The validator covers the whole repository, so its line is reported twice: as printed (the gate), and as the errors
this mission added, by comparing its error lines with the validator's own output at the baseline commit
(oracle-output/gate-validate-baseline.out), where main already failed.

  python3 scripts/courses/o08_gates.py [--save]        # about ten minutes (the validator)
"""
import os, re, subprocess
from lib import Oracle, ROOT, OUT, BASELINE, courses, sh

o = Oracle("08", "the ship gates at the branch head: validate prints `0 errors`, cite-check prints `0 fail` (statement 8)")
r = subprocess.run("npm run validate", shell=True, cwd=ROOT, capture_output=True, text=True)
out = r.stdout + r.stderr
errs = sorted(l for l in out.splitlines() if l.startswith("ERROR"))
summary = next((l for l in out.splitlines() if l.startswith("validated")), "(no summary line)")
open(os.path.join(OUT, "gate-validate.out"), "w", encoding="utf-8").write(f"GATE: npm run validate at {sh('git rev-parse HEAD')}\n" + "\n".join(errs) + ("\n" if errs else "") + summary + "\n")
base = [l for l in open(os.path.join(OUT, "gate-validate-baseline.out"), encoding="utf-8").read().splitlines() if l.startswith("ERROR")]
mine = [e for e in errs if e not in base]
changed = set(sh(f"git diff --name-only {BASELINE} HEAD -- data content").splitlines())
in_mine = [e for e in errs if any(f in e for f in changed if "/course/" in f or f.startswith("docs/courses"))]
o.note(f"validator's last line: {summary}")
o.note(f"validator's last line at the baseline commit (main, before this mission): {next((l for l in open(os.path.join(OUT, 'gate-validate-baseline.out'), encoding='utf-8').read().splitlines() if l.startswith('validated')), '')}")
o.note(f"error lines now: {len(errs)}; of them not present at the baseline: {len(mine)}; of them naming a course file: {len(in_mine)}")
for e in mine[:20]:
    o.note("    new: " + e[:240])
gate1 = bool(re.search(r"\b0 errors\b", summary))
o.check("GATE validate prints the literal string `0 errors`", gate1, summary)
o.check("this mission's files add no validator error (no error line names a course file)", not in_mine, f"{len(in_mine)} error lines")

ids = sorted(courses())
r2 = subprocess.run(["npx", "tsx", "scripts/cite-check.ts", *ids], cwd=ROOT, capture_output=True, text=True)
last = next((l for l in reversed(r2.stdout.splitlines()) if l.startswith("cite-check:")), "(no summary line)")
open(os.path.join(OUT, "gate-cite-check.out"), "w", encoding="utf-8").write(f"GATE: npx tsx scripts/cite-check.ts <all {len(ids)} course ids> at {sh('git rev-parse HEAD')}\n" + r2.stdout)
o.note(f"cite-check's last line over all {len(ids)} course records: {last}")
o.check("GATE cite-check prints the literal string `0 fail`", bool(re.search(r"\b0 fail\b", last)), last)
o.done("o08-gates")
