#!/usr/bin/env python3
"""Find a record under any spelling: the tool behind the absence list (statement 7).

Searches every record and stub in the graph artifact by label (all languages), alias, slug, `names[]`,
`historical_names`, `term` and `title`, after normalising spelling: Arabic diacritics and letter forms (أإآ to ا,
ى to ي, ة to ه, ؤ to و, ئ to ي), Latin diacritics, case, apostrophes, ayn and hamza marks, hyphens.

  python3 scripts/fable/find_record.py "Shah Wali Allah" "شاه ولي الله" "Waliullah"
  python3 scripts/fable/find_record.py --class person "Hafiz"

Three kinds of match, strongest first:
  exact   the whole name equals the variant
  tokens  every word of the variant is a whole word of the name (catches fuller names: "al-Junayd" in "al-Junayd al-Baghdadi")
  part    the variant is a substring of the name (catches joined spellings; noisy for short variants)
"""
import json, os, re, sys, unicodedata

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def norm(s):
    s = unicodedata.normalize("NFKD", str(s))
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub("[ً-ْٰـ]", "", s)
    s = re.sub("[أإآٱ]", "ا", s).replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    s = s.lower()
    s = re.sub("['’‘`ʿʾʼ⁦⁩‏‎]", "", s)
    s = re.sub(r"[-_()/,.:;«»\"]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def leaves(x):
    if isinstance(x, str):
        yield x
    elif isinstance(x, dict):
        for v in x.values():
            yield from leaves(v)
    elif isinstance(x, list):
        for v in x:
            yield from leaves(v)


_index = None


def index(graph_path=None):
    """[(id, stub, normalised name, raw name)] for every name a record goes by."""
    global _index
    if _index is None:
        g = json.load(open(graph_path or os.path.join(ROOT, ".cache", "graph.json"), encoding="utf-8"))
        _index = []
        for n in g["nodes"]:
            names = set(leaves(n.get("label"))) | set(n.get("aliases") or []) | {n["slug"].replace("-", " ")}
            d = n.get("data") or {}
            for key in ("names", "historical_names", "term", "title"):
                names |= set(leaves(d.get(key)))
            for raw in names:
                k = norm(raw)
                if k:
                    _index.append((n["id"], n["stub"], k, raw))
    return _index


def find(variant, cls=None, graph_path=None):
    """{id: (kind, matched name, stub)} for one variant, keeping each record's strongest match."""
    v = norm(variant)
    vt = v.split()
    rank = {"exact": 0, "tokens": 1, "part": 2}
    out = {}
    if not v:
        return out
    for rid, stub, k, raw in index(graph_path):
        if cls and not rid.startswith(cls + "/"):
            continue
        kind = "exact" if k == v else "tokens" if all(t in k.split() for t in vt) else "part" if len(v) >= 4 and v in k else None
        if kind and (rid not in out or rank[kind] < rank[out[rid][0]]):
            out[rid] = (kind, raw, stub)
    return out


if __name__ == "__main__":
    args = sys.argv[1:]
    cls = None
    if "--class" in args:
        cls = args[args.index("--class") + 1]
        args = [a for i, a in enumerate(args) if a != "--class" and (i == 0 or args[i - 1] != "--class")]
    for variant in args:
        hits = find(variant, cls)
        print(f'"{variant}" (normalised: "{norm(variant)}"): {len(hits)} record(s)')
        for rid, (kind, raw, stub) in sorted(hits.items(), key=lambda x: ({"exact": 0, "tokens": 1, "part": 2}[x[1][0]], x[0]))[:40]:
            print(f"  {kind:6} {rid}{' [stub]' if stub else ''}  as «{raw}»")
        if len(hits) > 40:
            print(f"  ... and {len(hits) - 40} more")
