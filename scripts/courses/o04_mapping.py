#!/usr/bin/env python3
"""Statements 4 and 5, over every course on the branch.

4. Every `entity:` in every connection resolves to a real graph record, and every connection carries at least one source.
5. Enrichment provenance: every connection's sources were already cited by the museum at the baseline commit.
   Two readings are measured, and both are printed:
     weak    the source record existed at the baseline (the museum already held and cited that source somewhere);
     strict  the source was cited at the baseline by the very record the connection links (the reading PIPELINE.md enforces).
   Curriculum sources registered for a newly ingested course are the only permitted new sources, and they are never
   cited by a connection, only by the course records themselves.

Results are printed per course, so the pilot and a pipeline-made course can be told apart.
  python3 scripts/courses/o04_mapping.py [--save]
"""
from lib import Oracle, BASELINE, courses, tree, exists, baseline_has, entity_sources

o = Oracle("04", "every connection's entity is a real record with a source, written from sources the museum already cited (statements 4 and 5)")
cs = courses()
subjects = [i for i, d in cs.items() if d["kind"] == "subject"]
tot = dict(conns=0, linked=0, stub=0, nosrc=0, newsrc=0, notown=0)
per = {}
for sid in sorted(subjects):
    ids = tree(cs, sid)
    conns = [(i, c) for i in ids for c in cs[i].get("connections", [])]
    linked = [(i, c) for i, c in conns if c.get("entity")]
    stub = sorted({c["entity"] for _, c in linked if not exists(c["entity"])})
    nosrc = [i for i, c in conns if not c.get("sources")]
    newsrc = sorted({s for _, c in conns for s in c.get("sources", []) if not baseline_has(f"data/{s}.yaml")})
    notown = []
    for i, c in linked:
        if exists(c["entity"]):
            own = entity_sources(c["entity"], BASELINE) | ({"source/tanzil-quran"} if c["entity"].startswith("passage/quran-") else set())
            if [s for s in c.get("sources", []) if s not in own]:
                notown.append(f"{i.split('/')[1]}->{c['entity']}")
    made_by_pipeline = "courses pipeline" in str((cs[sid].get("status") or {}).get("generated_by", ""))
    existed = baseline_has(f"data/{sid}.yaml")
    per[sid] = dict(stub=stub, nosrc=nosrc, newsrc=newsrc, notown=notown, n=len(conns), linked=len(linked))
    o.note(f"{sid} ({'at the baseline: the pilot' if existed else 'new on this branch'}{', made by the pipeline' if made_by_pipeline else ''}): lessons {len([i for i in ids if cs[i]['kind'] == 'lesson'])}, connections {len(conns)}, linking a record {len(linked)}, with no link {len(conns) - len(linked)}")
    o.note(f"    links that are not a real record: {len(stub)} {stub}")
    o.note(f"    connections with no source: {len(nosrc)}")
    o.note(f"    sources that did not exist at the baseline (weak reading): {len(newsrc)} {newsrc}")
    o.note(f"    linked connections citing a source their own record did not cite at the baseline (strict reading): {len(notown)} of {len(linked)}")
    for k, v in (("conns", len(conns)), ("linked", len(linked)), ("stub", len(stub)), ("nosrc", len(nosrc)), ("newsrc", len(newsrc)), ("notown", len(notown))):
        tot[k] += v
o.note()
o.note(f"all courses: {len(subjects)} subjects, {tot['conns']} connections, {tot['linked']} linking a record")
new = [s for s in subjects if not baseline_has(f"data/{s}.yaml")]
old = [s for s in subjects if baseline_has(f"data/{s}.yaml")]
o.check("statement 4: every connection carries at least one source", tot["nosrc"] == 0)
o.check("statement 4: every linked entity is a real record, in courses new on this branch", all(not per[s]["stub"] for s in new) and bool(new), ", ".join(x for s in new for x in per[s]["stub"]) or f"{len(new)} new course(s)")
o.check("statement 4: every linked entity is a real record, in the pilot", all(not per[s]["stub"] for s in old), ", ".join(x for s in old for x in per[s]["stub"]))
o.check("statement 5 (weak): every source a connection cites existed at the baseline", tot["newsrc"] == 0)
o.check("statement 5 (strict): in courses new on this branch, every source was cited at the baseline by the linked record itself", all(not per[s]["notown"] for s in new) and bool(new), "; ".join(x for s in new for x in per[s]["notown"][:5]) or f"{len(new)} new course(s)")
o.check("statement 5 (strict): the same, in the pilot", all(not per[s]["notown"] for s in old), f"{sum(len(per[s]['notown']) for s in old)} of {sum(per[s]['linked'] for s in old)} linked connections")
o.done("o04-mapping")
