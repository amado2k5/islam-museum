#!/usr/bin/env python3
"""Alias search over the museum graph: the search an agent MUST run before linking a connection or declaring a gap.

Searches labels (ar/en/ur), slugs, alias ids, and `names[].value` of every real record (stubs are listed apart: a stub is
not a record). Matching is accent-, hamza-, tashkil- and article-insensitive, so `al-Jazari`, `Jazari`, `الجزري`, `jazarī`
all find the same record.

  python3 scripts/courses/find_entity.py "al-Jazari" "الجزري" "Ibn al-Razzaz"      # any number of spellings
  python3 scripts/courses/find_entity.py --class person "Banu Musa"
  python3 scripts/courses/find_entity.py --json "astrolabe"

Needs .cache/graph.json (npm run graph).
"""
import json, os, re, sys, unicodedata, glob, yaml

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
AR_DROP = re.compile("[ً-ٰٟـ]")


def norm(s):
    s = unicodedata.normalize("NFKD", str(s).lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = AR_DROP.sub("", s)
    s = s.translate(str.maketrans("أإآٱىةؤئ", "اااايهوي"))
    s = re.sub(r"[ʿʾ'`’‘\"]", "", s)
    s = re.sub(r"[^0-9a-z؀-ۿ]+", " ", s)
    toks = [t for t in s.split() if t not in ("al", "el", "the", "ibn", "bin", "b", "of", "kitab")]
    toks = [re.sub(r"^ال(?=..)", "", t) for t in toks]
    return " ".join(toks)


_names = None


def names_index():
    """names[].value from the data files (the graph artifact does not carry them for every class)."""
    global _names
    if _names is None:
        _names = {}
    return _names


def load_index():
    """The graph, slimmed to what the search reads (ids, labels, aliases, names), cached beside it.

    The full artifact is hundreds of megabytes and took 10 to 30 seconds to load on every call, which starved a fleet of
    agents searching at once. The slim index is rebuilt only when the graph artifact is newer than it.
    """
    gp, ip = os.path.join(ROOT, ".cache", "graph.json"), os.path.join(ROOT, ".cache", "courses-search-index.json")
    if os.path.exists(ip) and os.path.getmtime(ip) >= os.path.getmtime(gp):
        return json.load(open(ip, encoding="utf-8"))
    g = json.load(open(gp, encoding="utf-8"))
    slim = {"nodes": [{"id": n["id"], "class": n["class"], "slug": n["slug"], "stub": n["stub"], "label": n.get("label") or {}, "aliases": n.get("aliases") or [], "degree": n.get("degree", 0),
                       "prose": {k: 1 for k in (n.get("prose") or {})},
                       "data": {"names": [x for x in ((n.get("data") or {}).get("names") or []) if isinstance(x, dict)], "title": (n.get("data") or {}).get("title")}} for n in g["nodes"]]}
    tmp = ip + f".{os.getpid()}.tmp"
    json.dump(slim, open(tmp, "w", encoding="utf-8"), ensure_ascii=False)
    os.replace(tmp, ip)
    return slim


def search(queries, cls=None, graph=None):
    g = graph or load_index()
    qs = [norm(q) for q in queries if norm(q)]
    hits = []
    for n in g["nodes"]:
        if cls and n["class"] != cls:
            continue
        keys = [n["slug"].replace("-", " ")] + list((n.get("label") or {}).values()) + [a.split("/")[-1].replace("-", " ") for a in n.get("aliases", [])]
        d = n.get("data") or {}
        keys += [x.get("value", "") for x in d.get("names", []) if isinstance(x, dict)]
        keys += [str(d.get("title", ""))] if d.get("title") else []
        nk = [norm(k) for k in keys if k]
        best = 0
        for q in qs:
            for k in nk:
                if not k:
                    continue
                if q == k:
                    best = max(best, 3)
                elif set(q.split()) <= set(k.split()):
                    best = max(best, 2)
                elif len(q) >= 5 and q in k:
                    best = max(best, 1)
        if best:
            hits.append((best, n))
    hits.sort(key=lambda h: (-h[0], h[1]["stub"], -h[1].get("degree", 0), h[1]["id"]))
    return hits


if __name__ == "__main__":
    args = sys.argv[1:]
    cls = None
    if "--class" in args:
        cls = args[args.index("--class") + 1]
        args = [a for i, a in enumerate(args) if a != "--class" and (i == 0 or args[i - 1] != "--class")]
    as_json = "--json" in args
    qs = [a for a in args if not a.startswith("--")]
    hits = search(qs, cls)
    if as_json:
        print(json.dumps([{"id": n["id"], "stub": n["stub"], "match": m, "label": n.get("label")} for m, n in hits[:40]], ensure_ascii=False, indent=1))
    else:
        real = [(m, n) for m, n in hits if not n["stub"]]
        stubs = [(m, n) for m, n in hits if n["stub"]]
        print(f"searched {qs} (normalised: {[norm(q) for q in qs]})" + (f" in class {cls}" if cls else ""))
        print(f"REAL RECORDS: {len(real)}")
        for m, n in real[:25]:
            lab = n.get("label") or {}
            print(f"  {'exact' if m == 3 else 'words' if m == 2 else 'part '}  {n['id']:55s} {lab.get('en', '')} | {lab.get('ar', '')}  (degree {n.get('degree', 0)}, prose {','.join((n.get('prose') or {}).keys()) or 'none'})")
        print(f"STUBS (not records; never link a connection to one): {len(stubs)}")
        for m, n in stubs[:10]:
            print(f"         {n['id']}")
        if not real:
            print("NO REAL RECORD under these spellings. Try more spellings before registering a gap.")
