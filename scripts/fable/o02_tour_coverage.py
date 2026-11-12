#!/usr/bin/env python3
"""Statement 2: every Tour stop is a cornerstone, and the stops span all nine wings and all fourteen centuries.

The proof is a mapping, not a claim: each id in the Tour's manifest (tour/grand-tour.yaml) is looked up in the graph
artifact; its wings are the record's own `wings` field; its century comes from the anchor rule in fable.py (the record's
own date, else a work's author, else it floats in its periods). Only stops with a date of their own or their author's
count toward century coverage. Also prints each stop's counted position in the graph, which the Tour pages display.

  npm run graph && python3 scripts/fable/o02_tour_coverage.py
"""
import collections, json, re
from fable import Oracle, anchor, authors_index, manifest_ids, importance

WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"]
o = Oracle("02", "every Tour stop is a cornerstone; the stops span nine wings and fourteen centuries (statement 2)")
g = o.graph
by_id = {n["id"]: n for n in g["nodes"]}
authors = authors_index(g)
ids = manifest_ids()

o.check("the manifest lists roughly forty stops", 35 <= len(ids) <= 45, f"{len(ids)} stops in tour/grand-tour.yaml")
o.check("no stop is listed twice", len(set(ids)) == len(ids))
missing = [i for i in ids if i not in by_id or by_id[i]["stub"]]
o.check("every stop is a record in the graph", not missing, ", ".join(missing))
ids = [i for i in ids if i not in missing]
not_corner = [i for i in ids if importance(by_id[i]) != 1]
o.check("every stop is a cornerstone (importance 1)", not not_corner, ", ".join(not_corner) or f"{len(ids)} of {len(ids)}")
no_prose = [i for i in ids if not all(by_id[i]["prose"].get(l, {}).get("sections") for l in ("ar", "en"))]
o.check("every stop has Arabic and English prose", not no_prose, ", ".join(no_prose))

inbound, neigh = collections.Counter(), collections.defaultdict(set)
for e in g["edges"]:
    if e["type"] == "related_to":  # the schema's fallback predicate: never counted, here or in the reachability oracle
        continue
    inbound[e["to"]] += 1
    neigh[e["from"]].add(e["to"])
real = lambda i: i in by_id and not by_id[i]["stub"]
paths = collections.defaultdict(set)
for n in g["nodes"]:
    if not n["stub"] and n["id"].startswith("exhibit/path-"):
        for m in re.findall(r'"([a-z]+/[a-z0-9][a-z0-9-]*)"', json.dumps(n["data"].get("rooms") or [])):
            paths[m].add(n["id"])

o.note()
o.note("The mapping (stop, record, how it is anchored, CE year, Hijri year, century, wings | relations arriving, records linked, pathways):")
rows, wing_stops, cent_stops, sensitive = [], collections.defaultdict(list), collections.defaultdict(list), []
for k, i in enumerate(ids, 1):
    n = by_id[i]
    a = anchor(n, by_id, authors)
    rows.append((k, i, a))
    for w in n["wings"]:
        wing_stops[w].append(k)
    if a["century"] is not None:
        cent_stops[min(a["century"], 15)].append(k)
        if a["hijri_basis"] == "arithmetic" and a["hijri"] % 100 in (0, 1):
            sensitive.append(f"{k} {i} (AH {a['hijri']} by arithmetic)")
    when = f"CE {a['ce']:>5}  AH {a['hijri']:>5} ({a['hijri_basis'][:5]})  century {a['century']:>2}" if a["century"] is not None else (f"floats in {a['lo']}-{a['hi']} CE ({', '.join(x.split('/')[1] for x in a['via'])})" if a["basis"] == "period" else "no date, no period: crosses the centuries")
    linked = len([t for t in neigh[i] if real(t)])
    o.note(f"  {k:>2}  {i:<38} {a['basis']:<8} {when:<52} {','.join(n['wings']):<14} | {inbound[i]:>5} {linked:>5} {len(paths[i]):>3}")

# river order
bad = []
hard = [(k, a["ce"]) for k, i, a in rows if a["ce"] is not None]
for (k1, y1), (k2, y2) in zip(hard, hard[1:]):
    if y2 < y1:
        bad.append(f"stop {k2} ({y2}) stands after stop {k1} ({y1})")
for idx, (k, i, a) in enumerate(rows):
    if a["basis"] != "period":
        continue
    before = [y for kk, y in hard if kk < k]
    after = [y for kk, y in hard if kk > k]
    if before and before[-1] > a["hi"]:
        bad.append(f"stop {k} floats in {a['lo']}-{a['hi']} but follows a stop dated {before[-1]}")
    if after and after[0] < a["lo"]:
        bad.append(f"stop {k} floats in {a['lo']}-{a['hi']} but precedes a stop dated {after[0]}")
o.note()
o.check("the stops stand in river order (dated stops never run backwards; a stop dated by its period stands inside it)", not bad, "; ".join(bad))

o.note()
o.note("Wings, from each record's own `wings` field:")
for w in WINGS:
    o.note(f"  {w:8} {len(wing_stops[w]):>2} stops: {', '.join(map(str, wing_stops[w])) or '-'}")
o.check("the stops span all nine wings", all(wing_stops[w] for w in WINGS), "missing: " + (", ".join(w for w in WINGS if not wing_stops[w]) or "none"))
no_wing = [i for i in ids if not by_id[i]["wings"]]
o.check("every stop sits in at least one wing", not no_wing, ", ".join(no_wing))

o.note()
o.note("Centuries, from stops with a date of their own or their author's (0 = before the Hijra, 15 = the present century):")
for c in range(0, 16):
    o.note(f"  century {c:>2}: {len(cent_stops[c]):>2} stops: {', '.join(map(str, cent_stops[c])) or '-'}")
empty = [c for c in range(1, 15) if not cent_stops[c]]
o.check("the stops span all fourteen Hijri centuries", not empty, "empty: " + (", ".join(map(str, empty)) or "none"))
o.note(f"  stops whose century rests on the arithmetic conversion within one year of a century boundary: {'; '.join(sensitive) or 'none'}")
floating = [f"{k} {i}" for k, i, a in rows if a["basis"] in ("period", "none")]
o.note(f"  stops that float (counted for wings, never for centuries): {len(floating)}: {'; '.join(floating)}")

stopset = set(ids)
hanging = {t for i in ids for t in neigh[i] if real(t) and t not in stopset}
pairs = {tuple(sorted((e["from"], e["to"]))) for e in g["edges"] if e["type"] != "related_to" and e["from"] in stopset and e["to"] in stopset and e["from"] != e["to"]}
o.note()
o.note(f"Completion room: records that hang directly off this path (a relation other than related_to with at least one stop; stops and stubs excluded): {len(hanging)}")
o.note(f"Completion room: pairs of stops with a relation between them in the graph: {len(pairs)}")
o.finish()
