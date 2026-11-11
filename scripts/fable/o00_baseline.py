#!/usr/bin/env python3
"""Statement 12: the baseline is frozen and concurrency is accounted for.

Measures the headline counts of whichever graph artifact it is given, and proves the branch still stands on the frozen
baseline with no merge from a moving main inside it.

  npm run graph && python3 scripts/fable/o00_baseline.py                     # the branch
  python3 scripts/fable/o00_baseline.py --graph <graph.json built at the baseline commit>   # the "before" column
"""
import collections, subprocess
from fable import Oracle, BASELINE, PRODUCTION, ROOT, sh, real_nodes, review, importance

o = Oracle("00", "baseline frozen, concurrency accounted for (statement 12)")
g = o.graph
real = real_nodes(g)
auth_out, any_edge = collections.Counter(), collections.Counter()
for e in g["edges"]:
    any_edge[e["from"]] += 1
    any_edge[e["to"]] += 1
    if not e.get("inverse"):
        auth_out[e["from"]] += 1
rev = collections.Counter(review(n) for n in real)
canon = [n for n in real if importance(n)]
corner = [n for n in canon if importance(n) == 1]

o.note("Three states, kept distinct:")
o.note(f"  production (what visitors see): {PRODUCTION}")
o.note(f"  baseline (main at branch start): {BASELINE}")
o.note(f"  this artifact: built from {g.get('commit')}")
o.note()
o.note("Headline counts of this artifact:")
rows = [
    ("records (stubs excluded)", len(real)),
    ("stubs", len(g["nodes"]) - len(real)),
    ("relations (edges, inverses included)", len(g["edges"])),
    ("relations as authored (inverses excluded)", sum(1 for e in g["edges"] if not e.get("inverse"))),
    ("records in review state draft", rev.get("draft", 0)),
    ("records in review state published", rev.get("published", 0)),
    ("canon records (importance 1 or 2)", len(canon)),
    ("cornerstones (importance 1)", len(corner)),
    ("records with no authored outgoing relation", sum(1 for n in real if auth_out[n["id"]] == 0)),
    ("records with no relation in either direction", sum(1 for n in real if any_edge[n["id"]] == 0)),
    ("cornerstones with no authored outgoing relation", sum(1 for n in corner if auth_out[n["id"]] == 0)),
    ("cornerstones with no wing", sum(1 for n in corner if not n["wings"])),
    ("exhibit records whose id starts path- (pathways)", sum(1 for n in real if n["id"].startswith("exhibit/path-"))),
]
for k, v in rows:
    o.note(f"  {v:>8,}  {k}")
o.note()

if "--graph" in __import__("sys").argv:
    o.check("the artifact given with --graph was built from the frozen baseline commit", g.get("commit") == BASELINE, str(g.get("commit")))
else:
    anc = subprocess.run(["git", "merge-base", "--is-ancestor", BASELINE, "HEAD"], cwd=ROOT).returncode == 0
    o.check("the frozen baseline is an ancestor of HEAD", anc)
    merges = [l for l in sh(f"git rev-list --merges {BASELINE}..HEAD").splitlines() if l]
    o.check("no merge commit since the baseline (main was never merged into the branch mid-run)", not merges, f"{len(merges)} merge commits")
    ahead = sh(f"git rev-list --count {BASELINE}..HEAD")
    o.note(f"  commits on this branch since the baseline: {ahead}")
    main = sh("git rev-parse --verify -q origin/main")
    moved = sh(f"git rev-list --count {BASELINE}..origin/main") if main else "?"
    o.note(f"  origin/main as last fetched: {main or 'unknown'} ({moved} commits past the baseline; informational, not chased)")
o.finish()
