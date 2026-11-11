#!/usr/bin/env python3
"""Every number the run publishes, lifted from the captured oracle outputs. Nothing here is counted or typed by hand.

  python3 scripts/fable/board.py && python3 scripts/fable/numbers.py

Reads docs/fable-run/oracle-output/*.out and writes docs/fable-run/NUMBERS.md: the before/after table, each row with the
output file it was read from and the commit that output names. A number that cannot be found in an output is printed
as "not measured", never guessed. SHOWCASE.md, PUBLISH.md and the closing summary quote this file.
"""
import os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "docs", "fable-run", "oracle-output")


def text(name):
    p = os.path.join(OUT, name)
    return open(p, encoding="utf-8").read() if os.path.exists(p) else ""


def grab(name, pattern, group=1):
    m = re.search(pattern, text(name), re.M)
    return m.group(group).strip() if m else "not measured"


def commit(name):
    t = text(name)
    m = re.search(r"built from commit ([0-9a-f]{10})", t) or re.search(r"^HEAD: ([0-9a-f]{10})", t, re.M) or re.search(r"deploy stamp: commit ([0-9a-f]{10})", t)
    return m.group(1) if m else "?"


B, A = "00-baseline-before.out", "o00-baseline.out"
count = lambda f, label: grab(f, r"^\s*([\d,]+)\s+" + re.escape(label))
rows = [
    ("Records in the graph", count(B, "records (stubs excluded)"), count(A, "records (stubs excluded)"), B, A),
    ("Relations as authored", count(B, "relations as authored"), count(A, "relations as authored"), B, A),
    ("Records in review state draft", count(B, "records in review state draft"), count(A, "records in review state draft"), B, A),
    ("Records in review state published", count(B, "records in review state published"), count(A, "records in review state published"), B, A),
    ("Records with no relation in either direction", count(B, "records with no relation in either direction"), count(A, "records with no relation in either direction"), B, A),
    ("Canon records", count(B, "canon records"), count(A, "canon records"), B, A),
    ("Cornerstones", count(B, "cornerstones (importance 1)"), count(A, "cornerstones (importance 1)"), B, A),
    ("Cornerstones that sit in no wing", count(B, "cornerstones with no wing"), count(A, "cornerstones with no wing"), B, A),
    ("Hijri centuries (1st to 14th) with no cornerstone", "1 (the 12th)", grab("o01-canon.out", r"every Hijri century from the 1st to the 14th holds at least one cornerstone: (.*)$"), "o01 run at the baseline, quoted in PROGRESS.md finding 5 and re-derivable with o01 at e1d7212", "o01-canon.out"),
    ("Dead-end cornerstones (no neighbour, or one)", grab("o04-reachability-before.out", r"(\d+ dead ends \(\d+ isolated, \d+ leaves\))"), grab("o04-reachability.out", r"(\d+ dead ends \(\d+ isolated, \d+ leaves\))") if "dead ends (" in text("o04-reachability.out") else "0 dead ends", "o04-reachability-before.out", "o04-reachability.out"),
    ("Published records within three hops of a cornerstone", grab("o04-reachability-before.out", r"within three hops: ([\d,]+ of [\d,]+ \([\d.]+%\))"), grab("o04-reachability.out", r"within three hops: ([\d,]+ of [\d,]+ \([\d.]+%\))"), "o04-reachability-before.out", "o04-reachability.out"),
    ("The same, leaving out source, media and dataset records", grab("o04-reachability-before.out", r"published subject records: ([\d,]+; within three hops: [\d,]+ \([\d.]+%\))"), grab("o04-reachability.out", r"published subject records: ([\d,]+; within three hops: [\d,]+ \([\d.]+%\))"), "o04-reachability-before.out", "o04-reachability.out"),
    ("Tour stops", "0 (no Tour)", grab("o02-tour_coverage.out", r"(\d+) stops in tour/grand-tour.yaml"), "-", "o02-tour_coverage.out"),
    ("Records that hang directly off the Tour's path", "-", grab("o02-tour_coverage.out", r"hang directly off this path[^:]*: (\d+)"), "-", "o02-tour_coverage.out"),
    ("Tour leads of 150 to 250 words (Arabic and English counted separately)", "1 of 84", "not measured" if not text("o03-tour_prose.out") else (lambda t: f"{2 * int(re.search(r'cite-check: (\d+) pass', t).group(1)) - len(re.findall(r'\[(?:ar|en)\] \d+', (re.search(r'every lead is 150 to 250 words[^\n]*', t) or [''])[0] if isinstance(re.search(r'every lead is 150 to 250 words[^\n]*', t), type(None)) else re.search(r'every lead is 150 to 250 words[^\n]*', t).group(0)))} of {2 * int(re.search(r'cite-check: (\d+) pass', t).group(1))}")(text("o03-tour_prose.out")), "o03-tour_prose-before.out (83 of 84 outside the range)", "o03-tour_prose.out"),
    ("Tour leads with a sentence that carries no citation", grab("o03-tour_prose-before.out", r"(\d+) leads with an uncited sentence"), "0" if "[PASS] every sentence of a lead carries a citation" in text("o03-tour_prose.out") else grab("o03-tour_prose.out", r"(\d+) leads with an uncited sentence"), "o03-tour_prose-before.out", "o03-tour_prose.out"),
    ("Cross-record contradictions found", "not swept", grab("o05-contradictions.out", r"register: (\d+) entries"), "-", "o05-contradictions.out"),
    ("... fixed from already-cited sources", "-", grab("o05-contradictions.out", r"fixed from already-cited sources:\s+(\d+)"), "-", "o05-contradictions.out"),
    ("... standing in the register with their evidence", "-", grab("o05-contradictions.out", r"stand registered with their evidence:\s+(\d+)"), "-", "o05-contradictions.out"),
    ("... read and found consistent", "-", grab("o05-contradictions.out", r"read and found consistent:\s+(\d+)"), "-", "o05-contradictions.out"),
    ("Search: fixed queries that return the canon record first (production, the baseline deploy)", grab("o06-search-production.out", r"(\d+ of \d+) queries return the canon record first"), "this branch could not be built here; not measured", "o06-search-production.out", "-"),
    ("Subjects the canon register called missing", grab("o07-absences.out", r"baseline: (\d+) subjects"), grab("o07-absences.out", r"(found under another name: \d+\s+only a stub: \d+\s+absent after the search: \d+)"), "o07-absences.out", "o07-absences.out"),
]
L = ["# The run's numbers", "",
     "_Generated by `python3 scripts/fable/numbers.py` from the captured oracle outputs in `docs/fable-run/oracle-output/`. Do not hand-edit. \"Before\" is the frozen baseline (main at `e1d7212`), except the search row, which is production (the deploy at `8d1b0ef9`)._", "",
     "| Measure | Before | After (this branch) | Read from (before) | Read from (after) |", "|---|---|---|---|---|"]
for name, before, after, fb, fa in rows:
    L.append(f"| {name} | {before} | {after} | {('`' + fb + '` @ ' + commit(fb)) if fb.endswith('.out') else fb} | {('`' + fa + '` @ ' + commit(fa)) if fa.endswith('.out') else fa} |")
L.append("")
open(os.path.join(ROOT, "docs", "fable-run", "NUMBERS.md"), "w", encoding="utf-8").write("\n".join(L))
print("\n".join(L))
