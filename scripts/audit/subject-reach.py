#!/usr/bin/env python3
"""Connectedness, as the founder restated it on 13 November 2026 (audit Part VI, item 9).

The Grand Tour's measure (scripts/fable/o04_reachability.py, target 60%) counts every published record, and 47% of
them are source records: a book or an article is tied to the records that cite it by citation, which is not a relation,
so that measure cannot pass about 53% whatever edges are added. The oracle and its baseline are data and are not
edited. This script is the measure that replaces the target, reported beside two numbers that keep it honest:

  1. subject records within three relation-hops of a cornerstone  (published records that are not sources)
  2. source records that no record cites                           (the reference apparatus's own dead weight)
  3. published subject records with no relation at all             (the work list for sourced edges)

Same definitions as the oracle otherwise: real records only, `related_to` never traversed, published = status.review,
cornerstone = importance 1.
  npm run graph && python3 scripts/audit/subject-reach.py [--json]"""
import collections, json, sys
g = json.load(open(".cache/graph.json", encoding="utf8"))
real = {n["id"]: n for n in g["nodes"] if not n.get("stub")}
pub = [i for i, n in real.items() if (n["data"].get("status") or {}).get("review") == "published"]
subjects = [i for i in pub if not i.startswith("source/")]
corner = [i for i, n in real.items() if n["data"].get("importance") == 1]
adj = collections.defaultdict(set)
for e in g["edges"]:
    if e["type"] == "related_to" or e["from"] not in real or e["to"] not in real or e["from"] == e["to"]: continue
    adj[e["from"]].add(e["to"]); adj[e["to"]].add(e["from"])
dist = {i: 0 for i in corner}; frontier = list(corner)
while frontier:
    nxt = []
    for u in frontier:
        for v in adj[u]:
            if v not in dist: dist[v] = dist[u] + 1; nxt.append(v)
    frontier = nxt
within = sum(1 for i in subjects if dist.get(i, 99) <= 3)
cited = set()
for n in real.values():
    for s in (n["data"].get("sources") or []):
        if s != n["id"]: cited.add(s)
    for r in (n["data"].get("relations") or []):
        for s in (r.get("sources") or []): cited.add(s)
sources = [i for i in real if i.startswith("source/")]
uncited = [i for i in sources if i not in cited]
isolated = [i for i in subjects if not adj[i]]
by_class = collections.Counter(i.split("/")[0] for i in isolated)
out = {
    "subject_records_published": len(subjects), "within_three_hops": within, "share": round(100 * within / len(subjects), 1),
    "all_published": len(pub), "all_published_within_three_hops": sum(1 for i in pub if dist.get(i, 99) <= 3),
    "source_records": len(sources), "source_records_cited_by_nothing": len(uncited),
    "subject_records_with_no_relation": len(isolated), "no_relation_by_class": dict(by_class.most_common()),
}
if "--json" in sys.argv:
    print(json.dumps(out, ensure_ascii=False, indent=2))
else:
    print(f"subject records within three hops of a cornerstone: {within:,} of {len(subjects):,} ({out['share']}%)")
    print(f"  (the Grand Tour's measure over all published records: {out['all_published_within_three_hops']:,} of {len(pub):,}, {100*out['all_published_within_three_hops']/len(pub):.1f}%)")
    print(f"source records that no record cites: {len(uncited):,} of {len(sources):,}")
    print(f"published subject records with no relation at all: {len(isolated):,}  {dict(by_class.most_common(8))}")
