import subprocess, yaml, collections, json, sys
B="800467e93e"
def git(*a):
    return subprocess.run(["git",*a],capture_output=True,text=True,cwd=".").stdout
def show(p):
    r=subprocess.run(["git","show",f"{B}:{p}"],capture_output=True,text=True)
    return r.stdout if r.returncode==0 else None
files=[f for f in git("ls-tree","-r","--name-only",B,"data/course").split("\n") if f]
recs={}
for f in files: recs[f]=yaml.safe_load(show(f))
print("records",len(recs),collections.Counter(r["kind"] for r in recs.values()))
print("review",collections.Counter(r["status"]["review"] for r in recs.values()))
ids={r["id"] for r in recs.values()}
print("orphans/parents")
roots=[r["id"] for r in recs.values() if not r.get("part_of")]
print(" roots",roots)
bad=[r["id"] for r in recs.values() if r.get("part_of") and r["part_of"] not in ids]
print(" dangling",bad)
ch=collections.defaultdict(list)
for r in recs.values():
    if r.get("part_of"): ch[r["part_of"]].append(r["id"])
for k,v in sorted(ch.items()): print(" ",k,len(v),[recs_k for recs_k in []])
# kinds of children
kind={r["id"]:r["kind"] for r in recs.values()}
print(" child kinds",{k:collections.Counter(kind[c] for c in v) for k,v in ch.items()})
# lessons[] lists agree?
for r in recs.values():
    if "lessons" in r:
        print(" lessons[]",r["id"],len(r["lessons"]),set(r["lessons"])==set(ch[r["id"]]))
lessons=[r for r in recs.values() if r["kind"]=="lesson"]
units=[r for r in recs.values() if r["kind"]=="unit"]
le=[e for r in lessons for e in r.get("expectations",[])]
print("lesson expectations",len(le),"distinct",len({e["code"] for e in le}))
print("lessons with expectations",sum(1 for r in lessons if r.get("expectations")))
ue=[e for r in units for e in r.get("expectations",[])]
print("unit expectations",len(ue),[(e["code"],e["text"]["en"]) for e in ue])
print("exp copies ar==en",sum(e["text"].get("ar")==e["text"]["en"] for e in le),"ur==en",sum(e["text"].get("ur")==e["text"]["en"] for e in le),"of",len(le))
print("unit exp ar==en",sum(e["text"].get("ar")==e["text"]["en"] for e in ue))
cons=[(r["id"],c) for r in recs.values() for c in r.get("connections",[])]
print("connections",len(cons),"on lessons",len({i for i,_ in cons}),"in nonlessons",[i for i,_ in cons if kind[i]!="lesson"])
per=collections.Counter(i for i,_ in cons)
print(" per lesson min/max",min(per.values()),max(per.values()),"lessons with 0",sum(1 for r in lessons if per[r["id"]]==0), collections.Counter(per.values()))
print(" position",collections.Counter(c["position"] for _,c in cons))
print(" kind",collections.Counter(c["kind"] for _,c in cons))
ent=[(i,c) for i,c in cons if c.get("entity")]
print(" with entity",len(ent),"distinct",len({c["entity"] for _,c in ent}))
src=collections.Counter(s for _,c in cons for s in c.get("sources",[]))
print(" sources",src,"distinct",len(src))
print(" conns citing hill",sum(1 for _,c in cons if "source/hill-1993" in c.get("sources",[])))
print(" conns with no sources",sum(1 for _,c in cons if not c.get("sources")))
q=[c for _,c in cons if c["kind"]=="quran"]
print(" quran",len(q),"with ref",sum(1 for c in q if c.get("ref")),"entity passage",sum(1 for c in q if str(c.get("entity","")).startswith("passage/")),"entities",[c.get("entity") for c in q])
print(" refs on non-quran",[(c["kind"],c["ref"]) for _,c in cons if c.get("ref") and c["kind"]!="quran"])
print(" ar/ur cons text==en", sum(c["text"].get("ar")==c["text"]["en"] for _,c in cons))
# entities
ents=sorted({c["entity"] for _,c in ent})
missing=[]
for e in ents:
    cl,sl=e.split("/",1)
    ok=show(f"data/{cl}/{sl}.yaml") is not None
    print("  entity",e,"datafile" if ok else "MISSING")
    if not ok: missing.append(e)
print("missing",len(missing),missing)
# source overlap
noover=0;details=[]
for i,c in ent:
    cl,sl=c["entity"].split("/",1)
    texts=[]
    d=show(f"data/{cl}/{sl}.yaml")
    if d: texts.append(d)
    for l in ("ar","en","ur"):
        p=show(f"content/{l}/{cl}/{sl}.md")
        if p: texts.append(p)
    blob="\n".join(texts)
    hit=[s for s in c["sources"] if s in blob or s.split("/",1)[1] in blob]
    hit_full=[s for s in c["sources"] if s in blob]
    details.append((i,c["entity"],bool(d),len(texts),hit,hit_full))
    if not hit: noover+=1
for d in details: print("  ",d)
print("no overlap (slug or full id)",noover,"of",len(ent))
print("no overlap (full id only)",sum(1 for d in details if not d[5]))
print("no overlap among entities WITH files",sum(1 for d in details if d[2] and not d[4]))
