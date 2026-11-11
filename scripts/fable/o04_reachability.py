#!/usr/bin/env python3
"""Statement 4: no cornerstone is a dead end, and every published record sits within three relation-hops of a cornerstone.

Definitions, fixed here so the numbers can be re-derived:
  relation        an edge of the graph artifact between two real records (stubs are not traversed: a stub has no page).
  weak relation   the predicate `related_to`, which the schema itself calls a fallback. Never counted, never traversed.
  dead end        a cornerstone from which traversal cannot go on: it has fewer than two distinct neighbours. With
                  none it is isolated (its page shows no door). With one it is a leaf (the only way on is the way back).
  own relation    a relation written in the record's own data file (`relations:`). Reported as a finer measure only:
                  the museum writes each relation once and computes its inverse, so a record other records point to
                  has outgoing relations in the graph whether or not its own file wrote one.
  hop distance    the length of the shortest path, in either direction, from a record to its nearest cornerstone.
  published       status.review == published.

  npm run graph && python3 scripts/fable/o04_reachability.py [--list-beyond N]
  python3 scripts/fable/o04_reachability.py --graph <graph.json built at another commit>     # for example the baseline
"""
import collections, sys
from fable import Oracle, real_nodes, review, importance, arg, own_relations

o = Oracle("04", "no cornerstone is a dead end; every published record within three hops of a cornerstone (statement 4)")
g = o.graph
real = {n["id"]: n for n in real_nodes(g)}
WEAK = {"related_to"}

adj = collections.defaultdict(set)
for e in g["edges"]:
    if e["type"] in WEAK or e["from"] not in real or e["to"] not in real or e["from"] == e["to"]:
        continue
    adj[e["from"]].add(e["to"])
    adj[e["to"]].add(e["from"])

corner = sorted(i for i, n in real.items() if importance(n) == 1)
own = {}
for i in corner:
    rels = [r for r in own_relations(i) if r[0] not in WEAK and r[1] in real]
    own[i] = len(rels)
isolated = [i for i in corner if len(adj[i]) == 0]
leaves = [i for i in corner if len(adj[i]) == 1]
dead = isolated + leaves
no_own = [i for i in corner if own[i] == 0]
deg = collections.Counter(min(len(adj[i]), 5) for i in corner)
o.note(f"cornerstones: {len(corner)}")
o.note("  distinct neighbours:  " + "   ".join(f"{k if k < 5 else '5+'}: {deg[k]}" for k in range(6)))
o.note(f"  isolated (no neighbour): {len(isolated)}")
for i in isolated:
    o.note(f"    {i}")
o.note(f"  leaves (one neighbour): {len(leaves)}")
for i in leaves:
    o.note(f"    {i}  ->  {next(iter(adj[i]))}")
o.check("no cornerstone is a dead end (each has at least two distinct neighbours over meaningful relations)", not dead, f"{len(dead)} dead ends ({len(isolated)} isolated, {len(leaves)} leaves)")
if "--graph" in sys.argv:
    o.note("  finer measure (cornerstones whose own file writes no relation): not computed with --graph, because it reads the data files of the working tree, not of the commit the artifact was built from")
else:
    o.note(f"  finer measure, not a check: cornerstones whose own file writes no relation: {len(no_own)} ({dict(collections.Counter(i.split('/')[0] for i in no_own).most_common())})")

# multi-source breadth-first search from every cornerstone
dist = {i: 0 for i in corner}
frontier = list(corner)
while frontier:
    nxt = []
    for u in frontier:
        for v in adj[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                nxt.append(v)
    frontier = nxt

def table(pop, title):
    c = collections.Counter(dist.get(i, -1) for i in pop)
    o.note(f"{title}: {len(pop):,} records")
    for d in sorted(k for k in c if k >= 0):
        o.note(f"  {d} hops{' (a cornerstone)' if d == 0 else '':<16} {c[d]:>7,}")
    o.note(f"  no path to any cornerstone {c[-1]:>7,}")
    within = sum(v for k, v in c.items() if 0 <= k <= 3)
    o.note(f"  within three hops: {within:,} of {len(pop):,} ({100 * within / max(len(pop), 1):.1f}%); beyond three hops: {sum(v for k, v in c.items() if k > 3):,}; unconnected: {c[-1]:,}")
    return within

o.note()
published = [i for i, n in real.items() if review(n) == "published"]
w = table(published, "Hop distance to the nearest cornerstone, published records (the population the statement is about)")
o.note()
table(list(real), "Hop distance to the nearest cornerstone, all records")
o.note()
out = [i for i in published if dist.get(i, -1) == -1 or dist[i] > 3]
no_edges = [i for i in out if not adj[i]]
o.note(f"The uncovered published population: {len(out):,} records")
o.note(f"  of which have no relation at all in the graph: {len(no_edges):,}")
o.note(f"  of which have relations but no path within three hops: {len(out) - len(no_edges):,}")
cc = collections.Counter(i.split("/")[0] for i in out)
o.note(f"  by class: {dict(cc.most_common())}")
n = int(arg("--list-beyond", "0"))
for i in sorted(out)[:n]:
    o.note(f"    {i}  dist={dist.get(i, 'none')}  relations={len(adj[i])}")
APPARATUS = {"source", "media", "dataset"}
subject = [i for i in published if i.split("/")[0] not in APPARATUS]
sub_out = [i for i in subject if dist.get(i, -1) == -1 or dist[i] > 3]
o.note()
o.note(f"The same measure without the museum's reference apparatus (source, media and dataset records, which attach to records by citation, not by relation):")
o.note(f"  published subject records: {len(subject):,}; within three hops: {len(subject) - len(sub_out):,} ({100 * (len(subject) - len(sub_out)) / max(len(subject), 1):.1f}%); uncovered: {len(sub_out):,}")
cited_by = collections.defaultdict(set)
for i, n in real.items():
    for s in n["data"].get("sources") or []:
        if isinstance(s, str):
            cited_by[s].add(i)
src_out = [i for i in out if i.startswith("source/")]
near = [i for i in src_out if any(dist.get(r, 99) <= 2 for r in cited_by[i])]
o.note(f"  of the {len(src_out):,} uncovered source records, {len(near):,} are cited by a record within two hops of a cornerstone, and {sum(1 for i in src_out if not cited_by[i]):,} are cited by no record. A citation is not a relation and is not counted as a hop.")
o.check("every published record sits within three relation-hops of a cornerstone", not out, f"{len(out):,} of {len(published):,} published records do not")
o.finish()
