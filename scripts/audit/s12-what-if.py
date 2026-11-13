#!/usr/bin/env python3
"""Audit S12: what the three-hop measure of scripts/fable/o04_reachability.py WOULD be under two modelling choices
the run did not make, so the founder can see their size before ruling. Nothing is written.
  A. the era a record belongs to (its `periods` field) counted as a relation to the period record;
  B. a record's citation of a source (its `sources` field) counted as a relation to the source record.
Same definitions as the oracle otherwise: real records only, `related_to` never traversed, published = status.review.
  npm run graph && python3 scripts/audit/s12-what-if.py"""
import collections, json
g = json.load(open(".cache/graph.json", encoding="utf8"))
real = {n["id"]: n for n in g["nodes"] if not n.get("stub")}
pub = [i for i, n in real.items() if (n["data"].get("status") or {}).get("review") == "published"]
corner = [i for i, n in real.items() if n["data"].get("importance") == 1]
def measure(extra):
    adj = collections.defaultdict(set)
    for e in g["edges"]:
        if e["type"] == "related_to" or e["from"] not in real or e["to"] not in real or e["from"] == e["to"]: continue
        adj[e["from"]].add(e["to"]); adj[e["to"]].add(e["from"])
    for a, b in extra:
        if a in real and b in real and a != b: adj[a].add(b); adj[b].add(a)
    dist = {i: 0 for i in corner}; frontier = list(corner)
    while frontier:
        nxt = []
        for u in frontier:
            for v in adj[u]:
                if v not in dist: dist[v] = dist[u] + 1; nxt.append(v)
        frontier = nxt
    within = sum(1 for i in pub if dist.get(i, 99) <= 3)
    dead = sum(1 for i in corner if len(adj[i]) < 2)
    return within, dead
periods = [(i, p) for i, n in real.items() for p in n.get("periods", [])]
cites = [(i, s) for i, n in real.items() for s in (n["data"].get("sources") or [])]
print(f"published records: {len(pub):,}; cornerstones: {len(corner)}; published source records: {sum(1 for i in pub if i.startswith('source/')):,}")
for name, extra in (("as the graph stands", []), ("A. era field counted as a relation", periods), ("B. citations counted as relations", cites), ("A and B together", periods + cites)):
    w, d = measure(extra)
    print(f"{name:38s} within three hops: {w:,} of {len(pub):,} ({100*w/len(pub):.1f}%); cornerstone dead ends: {d}")
