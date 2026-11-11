#!/usr/bin/env python3
"""Statement 3: every Tour stop's prose meets the published standard and is deepened only from sources the record already cited.

For each stop in the manifest, in Arabic and English, the narrative is the lead section of the record's own prose. Checked:
  - length: 150 to 250 words as a reader sees it (citations and link syntax not counted);
  - every sentence of four words or more carries a citation;
  - every citation in the lead names a source the record already listed at the frozen baseline commit (no new source);
  - the publication bar (`npm run cite-check`): sources present and defined, provenance recorded, citations resolve;
  - no typed honorific and no typed Qur'an bracket in the lead (the validator checks the whole file as well).
A record that could not be finished to this standard is not in the manifest: it was taken off the Tour and is listed, with
its reason, in docs/fable-run/GAP-REGISTER.md section 1.

  python3 scripts/fable/o03_tour_prose.py                 # all stops
  python3 scripts/fable/o03_tour_prose.py person/aisha    # named records only (working check, not a ledger run)
  python3 scripts/fable/o03_tour_prose.py --at <commit>   # today's stops, with their leads as they stood at that commit
"""
import os, re, subprocess, sys
from fable import Oracle, BASELINE, ROOT, CITE, lead_section, word_count, uncited_sentences, sources_at, manifest_ids, arg

AT = arg("--at")
only = [a for a in sys.argv[1:] if "/" in a and not a.startswith("-")]
o = Oracle("03", "Tour prose meets the published standard, deepened only from already-cited sources (statement 3)", needs_graph=False)
ids = only or manifest_ids()
if AT:
    o.note(f"The leads below are read from commit {AT} (`git show`), for the stops of today's manifest. The publication-bar check is skipped: it reads the working tree.")
HONORIFIC = re.compile("ﷺ|صلى الله عليه|عليه السلام|عليها السلام|رضي الله عن|رحمه الله|﴿|﴾|\\(pbuh\\)|peace be upon him", re.I)

bad = {"length": [], "uncited": [], "new-source": [], "missing": [], "typed": []}
o.note("stop | record | Arabic words | English words | sentences without a citation (ar/en) | citations outside the baseline source list")
for k, rid in enumerate(ids, 1):
    allowed = set(sources_at(BASELINE, rid))
    cells, problems = [], []
    for lang in ("ar", "en"):
        lead = lead_section(rid, lang, AT)
        if not lead:
            bad["missing"].append(f"{rid} [{lang}]")
            cells.append("none")
            continue
        md = lead[1]
        n = word_count(md)
        unc = uncited_sentences(md)
        new = sorted(set(CITE.findall(md)) - allowed)
        if not 150 <= n <= 250:
            bad["length"].append(f"{rid} [{lang}] {n}")
        if unc:
            bad["uncited"].append(f"{rid} [{lang}] {len(unc)}")
        if new:
            bad["new-source"].append(f"{rid} [{lang}] {', '.join(new)}")
        if HONORIFIC.search(md):
            bad["typed"].append(f"{rid} [{lang}]")
        cells.append((n, len(unc), new))
    row = " | ".join([f"{k:>2}", f"{rid:<38}"] + [f"{c[0]:>4}" if c != "none" else "none" for c in cells] + ["/".join(str(c[1]) if c != "none" else "-" for c in cells), "; ".join(", ".join(c[2]) for c in cells if c != "none" and c[2]) or "-"])
    o.note(row)

o.note()
o.check("every stop has an Arabic and an English lead", not bad["missing"], "; ".join(bad["missing"]))
o.check("every lead is 150 to 250 words in both languages", not bad["length"], f"{len(bad['length'])} outside the range: " + "; ".join(bad["length"]) if bad["length"] else "")
o.check("every sentence of a lead carries a citation", not bad["uncited"], f"{len(bad['uncited'])} leads with an uncited sentence: " + "; ".join(bad["uncited"]) if bad["uncited"] else "")
o.check("no lead cites a source the record did not already list at the baseline", not bad["new-source"], "; ".join(bad["new-source"]))
o.check("no typed honorific or Qur'an bracket in a lead", not bad["typed"], "; ".join(bad["typed"]))
if not AT:
    r = subprocess.run(["npx", "tsx", "scripts/cite-check.ts", *ids], cwd=ROOT, capture_output=True, text=True)
    line = [l for l in r.stdout.splitlines() if l.startswith("cite-check:")]
    o.note("  " + (line[0] if line else r.stdout[-300:] + r.stderr[-300:]))
    o.check("the publication bar holds for every stop (cite-check)", bool(line) and re.search(r"\b0 fail\b", line[0]) is not None, line[0].split(" — ")[0] if line else "no result")
if only:
    o.note("  (named records only: a working check, not a ledger run)")
o.finish()
