#!/usr/bin/env python3
"""The museum canon: which entities carry `importance` (1 = cornerstone, 2 = major).

Method and rules: docs/canon.md (this script writes that file). Signals per entity:
  g      inbound graph edges + inbound prose links ([[class/slug]] in content/ar)
  paths  appearances in pathways, courses, journeys and the tour halls (weighted 3 in the tour)
  sl     Wikidata sitelink count for the entity's recorded external_ids.wikidata (a reach signal only;
         nothing from Wikidata is written into any record by this script)

Usage:
  python3 scripts/report/canon.py --cache <dir outside git>            # report only (stdout)
  python3 scripts/report/canon.py --cache <dir> --write                # set `importance:` and write docs/canon.md
The sitelink cache (sitelinks.json) is fetched once from query.wikidata.org and must stay out of git.
"""
import argparse, collections, datetime, json, math, os, re, sys, time, urllib.parse, urllib.request

QUOTA = dict(person=380, event=140, place=130, concept=120, building=70, work=60, polity=40, group=20, practice=15, object=12, period=13)
TIER1 = dict(person=100, event=30, place=30, concept=30, building=20, work=15, polity=12, group=5, practice=10, object=5, period=13)
# Editorial includes: cornerstone subjects whose graph signals are still weak (no Wikidata id, few inbound links).
# They enter at importance 2. Remove a line once the record qualifies on its own.
INCLUDE = """
person/ibrahim person/nuh person/yusuf person/dawud person/sulayman person/ismail person/maryam person/harun
person/yunus person/ayyub person/zakariyya person/yahya person/salih person/lut person/shuayb
person/nizam-al-mulk person/abu-mansur-al-maturidi person/shajar-al-durr person/razia-sultana person/nana-asmau
person/al-masudi person/ahmad-sirhindi person/ahmad-baba-al-timbukti person/abd-al-hamid-ii-uthmani
person/abbas-ibn-firnas person/ulugh-beg person/sibawayh person/al-mutanabbi person/ibn-bajja
person/abd-al-rahman-al-dakhil person/al-zahrawi person/rabia-al-adawiyya
event/battle-of-karbala event/founding-of-baghdad event/conquest-of-al-andalus event/battle-of-talas-133
event/battle-of-manzikert-463 event/zallaqa-504 event/abolition-caliphate-1342 event/saqifa event/compilation-of-quran
event/battle-kosovo-791 event/battle-of-nicopolis-1396 event/battle-of-panipat-932 event/second-fitna
concept/ijma concept/ijtihad concept/madhhab concept/tafsir concept/ilm concept/tajwid concept/madrasa concept/wahy
concept/dajjal concept/hudud-penalties concept/maqasid-al-shariah concept/bida concept/halal-haram concept/falsafa
person/timur-lang person/usman-dan-fodio person/shah-waliullah-al-dahlawi person/hafiz-al-shirazi person/al-junayd-ibn-muhammad
person/idris person/hud event/battle-of-al-zab event/balat-al-shuhada event/abbasid-dawa-in-khurasan
concept/ashariyya concept/al-mahdi
""".split()
ID = re.compile(r"\b((?:person|place|event|building|concept|work|polity|group|object|practice|period|journey|invention|question)/[a-z0-9][a-z0-9-]*)")
SKIP_SRC = {"source", "media", "screen", "listing", "dataset"}


def scan():
    ents, indeg, paths, prose_in, depicted = {}, collections.Counter(), collections.Counter(), collections.Counter(), set()
    for cls in sorted(os.listdir("data")):
        d = "data/" + cls
        if not os.path.isdir(d) or cls.startswith("_"):
            continue
        for f in sorted(os.listdir(d)):
            if not f.endswith(".yaml"):
                continue
            eid, t = cls + "/" + f[:-5], open(d + "/" + f, encoding="utf-8", errors="ignore").read()
            qid, lab = re.search(r'wikidata:\s*"?(Q\d+)', t), re.search(r'en:\s*"?([^"\n}]+)', t)
            cur = re.search(r"^importance:\s*(\d)", t, re.M)
            p = f"content/ar/{cls}/{f[:-5]}.md"
            ents[eid] = dict(cls=cls, qid=qid.group(1) if qid else None, label=lab.group(1).strip() if lab else eid,
                             draft=bool(re.search(r"review:\s*draft", t)), current=int(cur.group(1)) if cur else None,
                             words=len(open(p, encoding="utf-8", errors="ignore").read().split()) if os.path.exists(p) else 0)
            targets = set(ID.findall(t)) - {eid}
            if cls == "media":
                depicted |= targets
            if cls in ("exhibit", "course", "journey"):
                paths.update(targets)
            elif cls not in SKIP_SRC:
                indeg.update(targets)
    for fn in ("tour/halls.yaml", "tour/exhibits.yaml", "tour/journeys.yaml"):
        for x in set(ID.findall(open(fn, encoding="utf-8").read())):
            paths[x] += 3
    for root, _, fs in os.walk("content/ar"):
        for f in fs:
            if f.endswith(".md"):
                me = root.split("/")[-1] + "/" + f[:-3]
                for x in set(re.findall(r"\[\[([a-z]+/[a-z0-9-]+)", open(root + "/" + f, encoding="utf-8", errors="ignore").read())):
                    if x != me:
                        prose_in[x] += 1
    for k, e in ents.items():
        e.update(g=indeg[k] + prose_in[k], paths=paths[k], image=k in depicted)
    return ents


def sitelinks(ents, cache):
    path = os.path.join(cache, "sitelinks.json")
    out = json.load(open(path)) if os.path.exists(path) else {}
    todo = sorted({e["qid"] for e in ents.values() if e["qid"]} - set(out))
    for i in range(0, len(todo), 400):
        batch = todo[i:i + 400]
        q = "SELECT ?i ?n WHERE { VALUES ?i { %s } ?i wikibase:sitelinks ?n }" % " ".join("wd:" + x for x in batch)
        req = urllib.request.Request("https://query.wikidata.org/sparql", data=urllib.parse.urlencode({"query": q, "format": "json"}).encode(),
                                     headers={"User-Agent": "canon-report/1.0 (sitelink counts)", "Accept": "application/sparql-results+json"})
        for attempt in range(4):
            try:
                rows = json.load(urllib.request.urlopen(req, timeout=60))["results"]["bindings"]
                break
            except Exception as ex:  # rate limit or timeout: wait and retry, then fail loudly
                print("retry:", ex, file=sys.stderr)
                time.sleep(10 * (attempt + 1))
        else:
            sys.exit("Wikidata query failed; re-run to resume from the cache")
        for r in rows:
            out[r["i"]["value"].rsplit("/", 1)[1]] = int(r["n"]["value"])
        for x in batch:
            out.setdefault(x, 0)
        json.dump(out, open(path, "w"))
        time.sleep(1.5)
    for e in ents.values():
        e["sl"] = out.get(e["qid"], 0) if e["qid"] else 0


def eligible(e):
    woven = e["g"] + 3 * e["paths"]
    if e["cls"] == "period":
        return True
    if e["cls"] == "object":
        return e["paths"] >= 2
    if e["cls"] == "place":
        return (e["sl"] >= 20 and e["g"] >= 20) or (e["paths"] >= 2 and e["g"] >= 10)
    if e["cls"] == "polity":
        return e["paths"] >= 1 and e["sl"] >= 20
    if e["cls"] == "event":
        return (e["sl"] >= 20 and woven >= 3) or (e["paths"] >= 2 and e["g"] >= 5) or (woven >= 25 and e["paths"] >= 1)
    return (e["sl"] >= 20 and woven >= 5) or (woven >= 25 and e["paths"] >= 1) or (e["paths"] >= 3 and e["g"] >= 10)


def pick(ents):
    for e in ents.values():
        e["score"] = math.log2(1 + e["sl"]) + 0.8 * math.log2(1 + e["g"]) + 1.5 * math.log2(1 + e["paths"])
    canon = {}
    for cls, n in QUOTA.items():
        ranked = sorted((k for k, e in ents.items() if e["cls"] == cls and eligible(e)), key=lambda k: (-ents[k]["score"], k))[:n]
        for i, k in enumerate(ranked):
            canon[k] = 1 if i < TIER1[cls] else 2
    missing = [k for k in INCLUDE if k not in ents]
    if missing:
        sys.exit("INCLUDE names records that do not exist: " + ", ".join(missing))
    for k in INCLUDE:
        canon.setdefault(k, 2)
    return canon


def write_records(ents, canon):
    changed = 0
    for k, e in ents.items():
        want = canon.get(k)
        if want == e["current"]:
            continue
        path = f"data/{k}.yaml"
        t = open(path, encoding="utf-8").read()
        t = re.sub(r"^importance:.*\n", "", t, flags=re.M)
        if want:
            if not re.search(r"^status:", t, re.M):
                sys.exit(f"{path}: no top-level status: line to anchor on")
            t = re.sub(r"^status:", f"importance: {want}\nstatus:", t, count=1, flags=re.M)
        open(path, "w", encoding="utf-8").write(t)
        changed += 1
    return changed


def report(ents, canon):
    L = ["# The canon", "",
         f"_Generated by `python3 scripts/report/canon.py --write` on {datetime.date.today().isoformat()}. Do not hand-edit; change the rules or the `INCLUDE` list in the script._", "",
         "The canon is the set of records the museum finishes first and shows first: the people, places, events, ideas, buildings and books a first-time visitor expects to find. Each carries `importance` in its data file: **1** for a cornerstone, **2** for a major subject. A record without the field is an ordinary record; nothing about it changes. The field ranks editorial priority only. It says nothing about a subject's religious standing, and it is not a judgement on any record left out.", "",
         "## How a record enters", "",
         "Three signals are read for every record: `g`, the inbound graph edges plus inbound prose links; `paths`, its appearances in pathways, courses, journeys and the tour halls; and `sl`, the number of Wikipedia language editions linked from its recorded Wikidata item. The first two say how far the museum's own story already leans on the record; the third says how widely the subject is known. A record must pass a per-class eligibility rule that needs both kinds of evidence (the `eligible` function), is ranked by `log2(1+sl) + 0.8·log2(1+g) + 1.5·log2(1+paths)`, and enters up to a class quota; the top of each class is importance 1. Places need real weight inside the graph, so modern states known only from a few mentions stay out; polities must appear in at least one pathway.", "",
         f"A further {len(INCLUDE)} records are editorial includes at importance 2: cornerstone subjects whose signals are still weak, mostly because the record has no Wikidata id yet or few links point to it. Giving those records their identifiers and links is part of finishing them.", "",
         "## Where the canon stands", "",
         "| Class | Canon | Importance 1 | No Arabic prose | Under 300 words | Draft | No image |", "|---|---|---|---|---|---|---|"]
    tot = collections.Counter()
    for cls in QUOTA:
        ks = [k for k in canon if ents[k]["cls"] == cls]
        row = dict(n=len(ks), t1=sum(canon[k] == 1 for k in ks), nop=sum(ents[k]["words"] == 0 for k in ks),
                   short=sum(ents[k]["words"] < 300 for k in ks), draft=sum(ents[k]["draft"] for k in ks), noimg=sum(not ents[k]["image"] for k in ks))
        tot.update(row)
        L.append(f"| {cls} | {row['n']} | {row['t1']} | {row['nop']} | {row['short']} | {row['draft']} | {row['noimg']} |")
    L += [f"| **all** | **{tot['n']}** | **{tot['t1']}** | **{tot['nop']}** | **{tot['short']}** | **{tot['draft']}** | **{tot['noimg']}** |", "",
          "\"Under 300 words\" counts the Arabic prose file, front matter included, and includes the records with none. \"No image\" means no `media/` record depicts the subject; for prophets and Companions that is the rule, not a gap.", "",
          "## The list", "",
          "Marks after a name: ∅ no Arabic prose, ✎ under 300 words, ◌ draft, + editorial include."]
    for cls in QUOTA:
        for tier in (1, 2):
            ks = sorted((k for k in canon if ents[k]["cls"] == cls and canon[k] == tier), key=lambda k: (-ents[k]["score"], k))
            if not ks:
                continue
            L += ["", f"### {cls} — importance {tier} ({len(ks)})", ""]
            L.append(" · ".join(f"`{k.split('/')[1]}`" + ("∅" if ents[k]["words"] == 0 else "✎" if ents[k]["words"] < 300 else "") + ("◌" if ents[k]["draft"] else "") + ("+" if k in INCLUDE else "") for k in ks))
    open("docs/canon.md", "w", encoding="utf-8").write("\n".join(L) + "\n")
    return tot


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", required=True)
    ap.add_argument("--write", action="store_true")
    a = ap.parse_args()
    ents = scan()
    sitelinks(ents, a.cache)
    canon = pick(ents)
    print("canon:", len(canon), "importance 1:", sum(v == 1 for v in canon.values()))
    if a.write:
        print("records changed:", write_records(ents, canon))
        print(dict(report(ents, canon)))
