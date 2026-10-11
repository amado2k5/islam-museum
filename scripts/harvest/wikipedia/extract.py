#!/usr/bin/env python3
"""Extract selected pages from a Wikipedia multistream dump without decompressing the whole file (docs/plan/15 §6.2).
Uses the multistream index (offset:page_id:title) to seek straight to the 100-page compressed blocks that hold the selected pages.
Per page it writes one JSON line: Wikipedia is the by-sa layer, kept for discovery and local context; none of this text is republished.
  page_id, title, depth/strong (from select_pages), lead, sections[{heading,text}], categories, interlanguage, links (internal titles),
  infoboxes[{name, params}]  (UNCONFIRMED hints for the extraction stage), refs[{kind, title, author, publisher, year, isbn, doi, url, journal}]
Usage: extract.py --lang en [--limit N] [--titles "Muhammad" "Battle of Badr"] [--out DIR]"""
import argparse, bz2, json, os, re, sys, time
from collections import defaultdict
from pathlib import Path
import mwparserfromhell as mw

ap = argparse.ArgumentParser()
ap.add_argument("--lang", required=True); ap.add_argument("--limit", type=int, default=0)
ap.add_argument("--titles", nargs="*"); ap.add_argument("--out")
a = ap.parse_args()
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
L = a.lang
RAW = HARVEST / "raw" / "wikipedia" / L
DUMP = RAW / f"{L}wiki-latest-pages-articles-multistream.xml.bz2"
INDEX = RAW / f"{L}wiki-latest-pages-articles-multistream-index.txt.bz2"
OUT = Path(a.out) if a.out else HARVEST / "layers" / "by-sa" / "wikipedia" / L
OUT.mkdir(parents=True, exist_ok=True)

# ---- which pages
want_titles = {t.replace(" ", "_") for t in (a.titles or [])}
want_ids: dict = {}
if not want_titles:
    import duckdb
    con = duckdb.connect(str(HARVEST / "db" / "wikipedia.duckdb"), read_only=True)
    q = f"select page_id, depth, strong from wp_{L}_scope order by depth, page_id" + (f" limit {a.limit}" if a.limit else "")
    want_ids = {r[0]: (r[1], r[2]) for r in con.execute(q).fetchall()}
    print(f"{len(want_ids):,} pages selected")

# ---- offsets from the index
offsets = defaultdict(list)    # stream offset -> [(page_id, title)]
t0 = time.time()
with bz2.open(INDEX, "rt", encoding="utf-8") as f:
    for line in f:
        off, pid, title = line.rstrip("\n").split(":", 2)
        pid = int(pid)
        if (want_titles and title.replace(" ", "_") in want_titles) or pid in want_ids:
            offsets[int(off)].append((pid, title))
print(f"index scanned in {time.time() - t0:.0f}s: {sum(len(v) for v in offsets.values()):,} pages in {len(offsets):,} blocks")

PAGE = re.compile(r"<page>.*?</page>", re.S)
import html

def unxml(s): return html.unescape(s)

CITE = re.compile(r"^(cite|citation)", re.I)

def parse_page(xml: str, depth_strong):
    title = unxml(re.search(r"<title>(.*?)</title>", xml, re.S).group(1))
    pid = int(re.search(r"<id>(\d+)</id>", xml).group(1))
    text_m = re.search(r"<text[^>]*>(.*?)</text>", xml, re.S)
    if not text_m or "<redirect" in xml:
        return None
    wt = unxml(text_m.group(1))
    code = mw.parse(wt)
    infoboxes, refs = [], []
    for tpl in code.filter_templates(recursive=True):
        name = str(tpl.name).strip()
        low = name.lower()
        if low.startswith("infobox"):
            infoboxes.append({"name": name, "params": {str(p.name).strip(): mw.parse(str(p.value)).strip_code().strip()[:300] for p in tpl.params if str(p.value).strip()}})
        elif CITE.match(low):
            g = lambda k: (str(tpl.get(k).value).strip() if tpl.has(k) else None)
            refs.append({"kind": name, "title": g("title"), "author": g("author") or g("last") or g("last1"), "publisher": g("publisher"), "year": g("year") or g("date"),
                         "isbn": g("isbn"), "doi": g("doi"), "url": g("url"), "journal": g("journal")})
    cats = [str(l.title).split(":", 1)[1].split("|")[0].strip() for l in code.filter_wikilinks() if str(l.title).lower().startswith("category:")]
    ilinks = [str(l.title)[:80] for l in code.filter_wikilinks() if ":" not in str(l.title)]
    inter = [str(l.title).split(":", 1)[0] for l in code.filter_wikilinks() if re.match(r"^[a-z]{2,3}(-[a-z]+)?:", str(l.title))]
    sections, lead = [], ""
    for i, sec in enumerate(code.get_sections(levels=[0, 2], include_lead=True, flat=True)):
        heading = "" if i == 0 else (str(sec.filter_headings()[0].title).strip() if sec.filter_headings() else "")
        body = sec.strip_code().strip()
        body = re.sub(r"\n{3,}", "\n\n", body)
        if i == 0: lead = body[:1500]
        elif body: sections.append({"heading": heading, "text": body[:6000]})
    d, s = depth_strong or (None, None)
    return {"page_id": pid, "title": title, "depth": d, "strong": s, "lead": lead, "sections": sections, "categories": cats, "interlanguage": sorted(set(inter)),
            "links": sorted(set(ilinks))[:400], "infoboxes": infoboxes, "refs": refs}

n = 0; dumpsize = DUMP.stat().st_size
outf = open(OUT / ("pages-sample.jsonl" if want_titles else "pages.jsonl"), "w", encoding="utf-8")
offs = sorted(offsets)
with open(DUMP, "rb") as f:
    for i, off in enumerate(offs):
        f.seek(off)
        dec = bz2.BZ2Decompressor(); buf = b""
        while not dec.eof:
            chunk = f.read(1 << 20)
            if not chunk: break
            buf += dec.decompress(chunk)
        xml = buf.decode("utf-8", "replace")
        wanted = {pid for pid, _ in offsets[off]}
        for m in PAGE.finditer(xml):
            pid = int(re.search(r"<id>(\d+)</id>", m.group(0)).group(1))
            if pid not in wanted: continue
            rec = parse_page(m.group(0), want_ids.get(pid))
            if rec:
                outf.write(json.dumps(rec, ensure_ascii=False) + "\n"); n += 1
        if i % 500 == 0: print(f"block {i:,}/{len(offs):,}, pages written {n:,}", file=sys.stderr, flush=True)
outf.close()
print(f"wrote {n:,} pages -> {outf.name}")
