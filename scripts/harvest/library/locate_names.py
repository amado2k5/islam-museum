#!/usr/bin/env python3
"""Phase 0 of docs/delegation/ar-prose-gap-plan.md: find which library books name each entity that has a data record but no Arabic prose.

  uv run --python 3.12 --with pyahocorasick --with pyyaml python scripts/harvest/library/locate_names.py [--limit-books N] [--out DIR]

Reads data/<class>/*.yaml with no content/ar/<class>/<slug>.md, normalises each Arabic label and alias (diacritics, hamza, ta marbuta, tatweel,
punctuation) and scans every extracted book page in ~/islam-museum-harvest/books/*/*/*/pages.json with one Aho-Corasick automaton.
Writes locator.jsonl and summary.json to DIR (default ~/islam-museum-harvest/work/prose-gap/), outside git. Read-only on the repository."""
import argparse, collections, json, multiprocessing as mp, os, re, sys
from pathlib import Path
import ahocorasick, yaml

ROOT = Path(__file__).resolve().parents[3]
H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
SKIP_CLASSES = {"passage", "source", "listing", "dataset", "language", "screen", "media"}
DIAC = re.compile("[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]")
NONWORD = re.compile(r"[^\w]+|_+")
MAXHITS = 12


def norm(s):
    s = DIAC.sub("", s or "")
    for a, b in (("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ٱ", "ا"), ("ى", "ي"), ("ة", "ه"), ("ؤ", "و"), ("ئ", "ي")):
        s = s.replace(a, b)
    return " " + NONWORD.sub(" ", s).strip().lower() + " "


def has_arabic(s):
    return bool(re.search("[\u0600-\u06ff]", s or ""))


def load_entities():
    ents = {}
    for cdir in sorted((ROOT / "data").iterdir()):
        c = cdir.name
        if c.startswith("_") or c in SKIP_CLASSES or not cdir.is_dir():
            continue
        for f in sorted(cdir.glob("*.yaml")):
            if (ROOT / "content/ar" / c / (f.stem + ".md")).exists():
                continue
            d = yaml.safe_load(f.read_text()) or {}
            label = (d.get("label") or {}).get("ar") or ""
            names = [label] + [a for a in (d.get("aliases") or []) if isinstance(a, str)]
            pats = set()
            for n in names:
                n = re.sub(r"\([^)]*\)", " ", n)
                if not has_arabic(n):
                    continue
                p = norm(n)
                if len(p.split()) >= 2 or len(p.strip()) >= 7:
                    pats.add(p)
            ents[d.get("id", f"{c}/{f.stem}")] = {
                "class": c, "label_ar": label, "label_en": (d.get("label") or {}).get("en"),
                "patterns": sorted(pats), "qid": (d.get("external_ids") or {}).get("wikidata"),
                "sources": [s if isinstance(s, str) else str(s) for s in (d.get("sources") or [])],
                "summary_ar": (d.get("summary") or {}).get("ar") or "",
                "card": "بطاقة أولية" in ((d.get("summary") or {}).get("ar") or ""),
            }
    return ents


def build_automaton(ents):
    A = ahocorasick.Automaton(); owners = collections.defaultdict(list)
    for eid, e in ents.items():
        for p in e["patterns"]:
            owners[p].append(eid)
    for p, ids in owners.items():
        A.add_word(p, p)
    A.make_automaton()
    return A, owners


_A = _OWN = None


def _init(ents):
    global _A, _OWN
    _A, _OWN = build_automaton(ents)


def scan_book(path):
    book = "/".join(Path(path).parts[-4:-1])
    res = collections.defaultdict(lambda: {"pages": 0, "hits": []})
    try:
        pages = json.loads(Path(path).read_text())
    except Exception:
        return book, {}
    for pg in pages:
        t = norm(pg.get("text", ""))
        seen = set()
        for _, pat in _A.iter(t):
            for eid in _OWN[pat]:
                seen.add(eid)
        for eid in seen:
            r = res[eid]; r["pages"] += 1
            if len(r["hits"]) < MAXHITS:
                r["hits"].append(pg.get("page"))
    return book, dict(res)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--limit-books", type=int); ap.add_argument("--out", default=str(H / "work/prose-gap"))
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    ents = load_entities()
    print("entities:", len(ents), "with an Arabic pattern:", sum(1 for e in ents.values() if e["patterns"]), flush=True)
    books = sorted((H / "books").glob("*/*/*/pages.json"))[: a.limit_books]
    print("books:", len(books), flush=True)
    agg = collections.defaultdict(lambda: {"pages": 0, "books": {}})
    with mp.Pool(min(8, os.cpu_count() or 4), initializer=_init, initargs=(ents,)) as pool:
        for i, (book, res) in enumerate(pool.imap_unordered(scan_book, map(str, books)), 1):
            for eid, r in res.items():
                g = agg[eid]; g["pages"] += r["pages"]; g["books"][book] = {"pages": r["pages"], "first": r["hits"]}
            if i % 50 == 0:
                print(f"{i}/{len(books)} books", flush=True)
    with open(out / "locator.jsonl", "w") as fh:
        for eid, e in ents.items():
            g = agg.get(eid, {"pages": 0, "books": {}})
            fh.write(json.dumps({"id": eid, "class": e["class"], "label_ar": e["label_ar"], "qid": e["qid"], "card": e["card"], "sources": e["sources"],
                                 "has_pattern": bool(e["patterns"]), "pages": g["pages"], "books": g["books"]}, ensure_ascii=False) + "\n")
    print("wrote", out / "locator.jsonl")


if __name__ == "__main__":
    main()
