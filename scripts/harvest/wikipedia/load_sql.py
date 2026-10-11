#!/usr/bin/env python3
"""Parse a Wikipedia language's MySQL dumps (page, linktarget, categorylinks) into DuckDB tables (docs/plan/15 §6.2).
Binary-safe streaming parser (sort keys contain raw bytes); keeps only what the category walk needs.
Tables in $HARVEST/db/wikipedia.duckdb:  wp_<lang>_page(id, ns, title, is_redirect, len)   ns 0 articles, 14 categories
                                         wp_<lang>_linktarget(id, ns, title)             category names behind cl_target_id
                                         wp_<lang>_catlinks(from_id, type, target_id)    page/subcat/file membership
Usage: load_sql.py LANG [page] [linktarget] [categorylinks]        (default: all three)  -- by-sa layer: discovery only"""
import gzip, os, re, sys, time
from pathlib import Path
import duckdb

HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
lang = sys.argv[1]
which = sys.argv[2:] or ["page", "linktarget", "categorylinks"]
RAW = HARVEST / "raw" / "wikipedia" / lang
TMP = HARVEST / "layers" / "by-sa" / "wikipedia" / lang
TMP.mkdir(parents=True, exist_ok=True)

Q = rb"'((?:[^'\\]|\\.)*)'"          # quoted string with backslash escapes
PAGE = re.compile(rb"\((\d+),(-?\d+)," + Q + rb",([01]),[01],[-\d.eE+]+,'\d*',(?:'\d*'|NULL),\d+,(\d+),(?:'[^']*'|NULL),(?:'[^']*'|NULL)\)", re.S)
LT = re.compile(rb"\((\d+),(-?\d+)," + Q + rb"\)", re.S)
CL = re.compile(rb"\((\d+)," + Q + rb",'[^']*'," + Q + rb",'(page|subcat|file)',\d+,(\d+)\)", re.S)
UNESC = re.compile(rb"\\(.)", re.S)
MAP = {b"n": b"\n", b"r": b"\r", b"t": b"\t", b"0": b"\0", b"Z": b"\x1a"}


def title(b: bytes) -> str:
    return UNESC.sub(lambda m: MAP.get(m.group(1), m.group(1)), b).decode("utf-8", "replace").replace("\t", " ").replace("\n", " ")


def stream_inserts(path):
    with gzip.open(path, "rb") as f:
        for line in f:
            # dumps come either as one huge INSERT line or as a header line followed by one "(...)," row per line: accept both
            if line.startswith(b"(") or line.startswith(b"INSERT INTO"):
                yield line


def run(table):
    src = RAW / f"{lang}wiki-latest-{table}.sql.gz"
    if not src.exists() or Path(str(src) + ".aria2").exists():
        print(f"{table}: {src.name} missing or still downloading, skipped"); return
    out = TMP / f"{table}.tsv"
    n = 0; t0 = time.time()
    with open(out, "w", encoding="utf-8") as o:
        for line in stream_inserts(src):
            if table == "page":
                for m in PAGE.finditer(line):
                    ns = int(m.group(2))
                    if ns in (0, 14):
                        o.write(f"{m.group(1).decode()}\t{ns}\t{title(m.group(3))}\t{m.group(4).decode()}\t{m.group(5).decode()}\n"); n += 1
            elif table == "linktarget":
                for m in LT.finditer(line):
                    if int(m.group(2)) in (0, 14):          # articles and categories are the only targets we follow
                        o.write(f"{m.group(1).decode()}\t{m.group(2).decode()}\t{title(m.group(3))}\n"); n += 1
            else:
                for m in CL.finditer(line):
                    o.write(f"{m.group(1).decode()}\t{m.group(4).decode()}\t{m.group(5).decode()}\n"); n += 1
    print(f"{table}: {n:,} rows parsed in {time.time() - t0:.0f}s -> {out.name}")
    con = duckdb.connect(str(HARVEST / "db" / "wikipedia.duckdb"))
    cols = {"page": "{'id':'BIGINT','ns':'INTEGER','title':'VARCHAR','is_redirect':'INTEGER','len':'BIGINT'}",
            "linktarget": "{'id':'BIGINT','ns':'INTEGER','title':'VARCHAR'}",
            "categorylinks": "{'from_id':'BIGINT','type':'VARCHAR','target_id':'BIGINT'}"}[table]
    name = {"page": "page", "linktarget": "linktarget", "categorylinks": "catlinks"}[table]
    con.execute(f"create or replace table wp_{lang}_{name} as select * from read_csv('{out}', delim='\t', header=false, quote='', escape='', columns={cols}, strict_mode=false)")
    print(f"  wp_{lang}_{name}: {con.execute(f'select count(*) from wp_{lang}_{name}').fetchone()[0]:,} rows loaded")
    out.unlink()   # the table is the artifact; the intermediate TSV is not kept


for t in which:
    run(t)
