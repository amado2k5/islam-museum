#!/usr/bin/env python3
"""Rank the books, articles and URLs cited by in-scope Wikipedia pages (docs/plan/15 §6.2: "the most valuable thing Wikipedia gives us").
Reads pages.jsonl from extract.py, groups citations by ISBN, DOI or a normalised author+title key, counts how many distinct pages cite each,
and writes $HARVEST/candidates/sources/wikipedia-<lang>-ranked.tsv. These are LEADS to real sources (by-sa layer, discovery only): a candidate becomes a
`source/` entity only after a person has found the work in a catalogue and checked the details.
Usage: rank_sources.py --lang en [--input pages-test300.jsonl] [--top 2000]"""
import argparse, json, os, re, unicodedata
from collections import defaultdict
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--lang", required=True); ap.add_argument("--input", default="pages.jsonl"); ap.add_argument("--top", type=int, default=2000)
a = ap.parse_args()
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
src = HARVEST / "layers" / "by-sa" / "wikipedia" / a.lang / a.input
out = HARVEST / "candidates" / "sources"; out.mkdir(parents=True, exist_ok=True)


def clean(s):
    s = re.sub(r"\[\[([^\]|]*\|)?([^\]]*)\]\]", r"\2", s or "")          # wiki links
    s = re.sub(r"<[^>]+>|\{\{[^}]*\}\}|'''?", "", s)
    return re.sub(r"\s+", " ", s).strip()


def key(r):
    isbn = re.sub(r"[^0-9Xx]", "", r.get("isbn") or "")
    if len(isbn) in (10, 13): return "isbn:" + isbn.upper()
    doi = (r.get("doi") or "").strip().lower()
    if doi.startswith("10."): return "doi:" + doi
    title = unicodedata.normalize("NFKD", clean(r.get("title"))).lower()
    title = re.sub(r"[^a-z0-9؀-ۿ ]", "", title).strip()
    author = re.sub(r"[^a-z0-9؀-ۿ ]", "", unicodedata.normalize("NFKD", clean(r.get("author"))).lower()).strip()
    return f"title:{author[:30]}|{title[:80]}" if len(title) > 8 else None


groups = defaultdict(lambda: {"pages": set(), "sample": None, "kinds": set()})
n = 0
for line in open(src, encoding="utf-8"):
    page = json.loads(line); n += 1
    for r in page["refs"]:
        k = key(r)
        if not k: continue
        g = groups[k]; g["pages"].add(page["page_id"]); g["kinds"].add((r.get("kind") or "").lower().split()[-1])
        if not g["sample"] or len(clean(r.get("title"))) > len(clean(g["sample"].get("title"))): g["sample"] = r
# Works (books, journals, encyclopedias, anything with an ISBN or DOI) are the leads to real sources; plain web links are kept in a separate list.
WORK_KINDS = {"book", "journal", "encyclopedia", "thesis", "conference", "كتاب", "دورية"}
is_work = lambda k, g: k.startswith(("isbn:", "doi:")) or bool(g["kinds"] & WORK_KINDS)
noise = re.compile(r"^(archived copy|archive copy|retrieved|click here)", re.I)
works = {k: g for k, g in groups.items() if is_work(k, g) and not noise.match(clean(g["sample"].get("title")))}
web = {k: g for k, g in groups.items() if k not in works}
ranked = sorted(works.items(), key=lambda kv: -len(kv[1]["pages"]))[: a.top]
dest = out / f"wikipedia-{a.lang}-ranked.tsv"
with open(out / f"wikipedia-{a.lang}-web-ranked.tsv", "w", encoding="utf-8") as wf:
    wf.write("pages\ttitle\turl\n")
    for k, g in sorted(web.items(), key=lambda kv: -len(kv[1]["pages"]))[:500]:
        wf.write(f"{len(g['pages'])}\t{clean(g['sample'].get('title'))[:100]}\t{(g['sample'].get('url') or '')[:120]}\n")
with open(dest, "w", encoding="utf-8") as f:
    f.write("pages\tkey\tauthor\ttitle\tyear\tpublisher\tisbn\tdoi\tkind\turl\n")
    for k, g in ranked:
        r = g["sample"]
        f.write("\t".join([str(len(g["pages"])), k, clean(r.get("author")), clean(r.get("title")), clean(r.get("year"))[:10], clean(r.get("publisher")), r.get("isbn") or "", r.get("doi") or "", "/".join(sorted(g["kinds"])), (r.get("url") or "")[:120]]).replace("\n", " ") + "\n")
print(f"{n:,} pages read, {len(groups):,} distinct citations: {len(works):,} works, {len(web):,} web/other; top {len(ranked)} works written to {dest}")
for k, g in ranked[:25]:
    r = g["sample"]; print(f"{len(g['pages']):4}  {clean(r.get('author'))[:28]:28}  {clean(r.get('title'))[:70]}  ({clean(r.get('year'))[:4]})")
