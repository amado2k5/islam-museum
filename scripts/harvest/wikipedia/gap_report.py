#!/usr/bin/env python3
"""Which in-scope Arabic Wikipedia pages have no entity in the museum yet? (docs/plan/15 §6.2: Wikipedia is for discovery only.)
Reads pages.jsonl (extract.py) and data/**/*.yaml (labels, names, aliases), matches by normalised Arabic title, and writes
$HARVEST/candidates/entities/wikipedia-ar-gaps.tsv ranked by a priority score so the next batches know what to add.
Only titles, categories, infobox names, counts and the English interlanguage title are read; no article text is kept or published.
  gap_report.py [--min-score 20] [--top 5000]"""
import argparse, json, os, re
from collections import Counter
from pathlib import Path
import yaml

ap = argparse.ArgumentParser(); ap.add_argument("--min-score", type=int, default=20); ap.add_argument("--top", type=int, default=5000); a = ap.parse_args()
ROOT = Path(__file__).resolve().parents[3]; H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
SRC = H / "layers/by-sa/wikipedia/ar/pages.jsonl"; OUT = H / "candidates/entities"; OUT.mkdir(parents=True, exist_ok=True)
DIAC = re.compile("[ً-ٰٟـ]")
def norm(s):
    s = DIAC.sub("", (s or "").replace("_", " "))
    for x, y in (("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ى", "ي"), ("ة", "ه")): s = s.replace(x, y)
    return re.sub(r"\s+", " ", re.sub(r"\s*\([^)]*\)\s*", " ", s)).strip()

have = {}
for f in (ROOT / "data").glob("*/*.yaml"):
    if f.parent.name in ("passage", "dataset") or f.parent.name.startswith("_"): continue
    try: d = yaml.safe_load(f.read_text())
    except Exception: continue
    if not isinstance(d, dict) or "id" not in d: continue
    names = [(d.get("label") or {}).get("ar")] + [n.get("value") for n in d.get("names", []) if isinstance(n, dict)] + [x for x in d.get("aliases", []) if isinstance(x, str) and not "/" in x]
    for n in names:
        if n: have[norm(n)] = d["id"]
print("museum names:", len(have))

pages, indeg = [], Counter()
for line in open(SRC):
    d = json.loads(line)
    pages.append({"id": d["page_id"], "title": d["title"], "depth": d["depth"], "strong": d.get("strong"), "cats": d.get("categories", []),
                  "box": (d.get("infoboxes") or [{}])[0].get("name", ""), "len": sum(len(s.get("text", "")) for s in d.get("sections", [])) + len(d.get("lead", "")),
                  "en": next((x.get("title") for x in d.get("interlanguage", []) if isinstance(x, dict) and x.get("lang") == "en"), ""), "nref": len(d.get("refs", []))})
    for l in d.get("links", []): indeg[l] += 1
titles = {p["title"] for p in pages}
CORE = re.compile("صحاب|تابعي|رواة|راوي|محدث|عالم مسلم|علماء|فقه|مفسر|أئمة|خلفاء|خلافة|غزوات|سرايا|سيرة|معارك|فتوح|أمويين|عباسي|أيوبي|مماليك|عثماني|أندلس|مساجد|مدارس|كتب إسلام|مؤلفات")
KIND = [("راوي حديث", "person-narrator"), ("عالم مسلم", "person-scholar"), ("شخص", "person"), ("شيخ", "person-scholar"), ("شخصية", "person"), ("نزاع عسكري", "event-battle"),
        ("مسجد", "building-mosque"), ("كتاب", "work"), ("تجمع سكاني", "place"), ("مدينة", "place"), ("ملكية", "person-ruler"), ("صاحب منصب", "person-office"), ("منظمة", "group")]
def kind(p):
    for k, v in KIND:
        if k in p["box"]: return v
    return "page"
rows = []
for p in pages:
    if norm(p["title"]) in have: continue
    k = kind(p)
    if k == "page" and not CORE.search(" ".join(p["cats"])): continue
    if re.search(r"كرة|ممثل|مغن|مسلسل|فيلم|لاعب|نادي|انتخابات|كويكب|\(\d+\)", " ".join(p["cats"]) + p["title"]): continue
    score = (30 if p["strong"] in (True, "True") else 0) + max(0, 20 - 4 * int(p["depth"])) + min(30, indeg[p["title"]]) + min(15, p["len"] // 2000) + (15 if CORE.search(" ".join(p["cats"])) else 0) + (5 if p["en"] else 0)
    rows.append((score, k, p["title"], p["en"], p["depth"], indeg[p["title"]], p["len"], p["nref"], ";".join(p["cats"][:4])))
rows.sort(reverse=True)
sel = [r for r in rows if r[0] >= a.min_score][:a.top]
with open(OUT / "wikipedia-ar-gaps.tsv", "w") as f:
    f.write("score\tkind\ttitle_ar\ttitle_en\tdepth\tinlinks\tchars\trefs\tcategories\n")
    for r in sel: f.write("\t".join(map(str, r)) + "\n")
print(f"{len(pages)} pages, {len(rows)} candidate gaps, {len(sel)} written -> {OUT/'wikipedia-ar-gaps.tsv'}")
print(Counter(r[1] for r in sel).most_common())
for r in sel[:25]: print(r[0], r[1], r[2], "|", r[3])
