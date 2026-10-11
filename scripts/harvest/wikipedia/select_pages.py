#!/usr/bin/env python3
"""Select in-scope Wikipedia pages by walking the category tree offline (docs/plan/15 §6.2). Reads the DuckDB tables made by load_sql.py,
writes wp_<lang>_scope(page_id, title, depth, strong) and a report. Never reads or copies article text.
 strong: within 3 category levels of a seed category.  weak: 4-6 levels (category trees leak, so weak pages need a second signal).
Usage: select_pages.py --lang en [--max-depth 6] [--seeds seed-categories.yaml]"""
import argparse, os
from pathlib import Path
import duckdb, yaml

ap = argparse.ArgumentParser()
ap.add_argument("--lang", required=True); ap.add_argument("--max-depth", type=int, default=6)
ap.add_argument("--seeds", default=str(Path(__file__).with_name("seed-categories.yaml")))
a = ap.parse_args()
LANGVAR = a.lang   # English keeps wikipedia.duckdb; other languages use wikipedia-<lang>.duckdb
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
cfg = yaml.safe_load(open(a.seeds))[a.lang]
con = duckdb.connect(str(HARVEST / "db" / ("wikipedia.duckdb" if LANGVAR == "en" else f"wikipedia-{LANGVAR}.duckdb")))
L = a.lang

con.execute(f"""create or replace temp table cat_edge as
  -- category page (child) -> parent category (via linktarget), for subcategories
  select p.title as child, t.title as parent
  from wp_{L}_catlinks c join wp_{L}_page p on p.id = c.from_id and p.ns = 14
  join wp_{L}_linktarget t on t.id = c.target_id and t.ns = 14
  where c.type = 'subcat'""")
con.execute(f"""create or replace temp table art_edge as
  select p.id as page_id, p.title, t.title as cat
  from wp_{L}_catlinks c join wp_{L}_page p on p.id = c.from_id and p.ns = 0 and p.is_redirect = 0
  join wp_{L}_linktarget t on t.id = c.target_id and t.ns = 14
  where c.type = 'page'""")

import re
stop = set(cfg.get("stoplist", []))
stop_re = [re.compile(x) for x in cfg.get("stop_patterns", [])]
is_stopped = lambda cat: cat in stop or any(r.search(cat) for r in stop_re)
depth = {s: 0 for s in cfg["seeds"]}
frontier = list(depth)
children: dict = {}
for child, parent in con.execute("select child, parent from cat_edge").fetchall():
    children.setdefault(parent, []).append(child)
for d in range(1, a.max_depth + 1):
    nxt = []
    for cat in frontier:
        for ch in children.get(cat, []):
            if ch in depth or is_stopped(ch):
                continue
            depth[ch] = d; nxt.append(ch)
    frontier = nxt
    print(f"category depth {d}: {len(nxt):,} new categories")
missing = [s for s in cfg["seeds"] if s not in children and not con.execute(f"select 1 from wp_{L}_page where ns = 14 and title = ? limit 1", [s]).fetchone()]
if missing: print("seed categories not found in this wiki:", missing)

con.execute(f"create or replace table wp_{L}_catdepth(cat varchar, depth integer)")
con.executemany(f"insert into wp_{L}_catdepth values (?, ?)", list(depth.items()))
# ncats = how many distinct in-scope categories hold the article: a second signal for weak (depth 4-6) pages, since a leaked page usually sits in one stray category
con.execute(f"""create or replace table wp_{L}_scope as
  select page_id, any_value(title) as title, min(d.depth) as depth, min(d.depth) <= 3 as strong, count(distinct e.cat) as ncats
  from art_edge e join wp_{L}_catdepth d on d.cat = e.cat group by page_id""")
n, strong = con.execute(f"select count(*), count(*) filter (strong) from wp_{L}_scope").fetchone()
weak2 = con.execute(f"select count(*) filter (not strong and ncats >= 2), count(*) filter (not strong and ncats >= 3) from wp_{L}_scope").fetchone()
print(f"weak pages with a second category signal: ncats>=2: {weak2[0]:,}, ncats>=3: {weak2[1]:,}")
print(f"in scope: {n:,} articles ({strong:,} strong, {n - strong:,} weak) from {len(depth):,} categories")
rep = HARVEST / "reports" / f"wikipedia-{L}-scope.txt"
lines = [f"{L}: {n:,} articles in scope ({strong:,} strong)", "by depth: " + ", ".join(f"{d}={c:,}" for d, c in con.execute(f"select depth, count(*) from wp_{L}_scope group by 1 order by 1").fetchall())]
for d in (0, 1, 2, 3, 4, 5, 6):
    sample = con.execute(f"select title from wp_{L}_scope where depth = {d} order by random() limit 12").fetchall()
    lines.append(f"-- depth {d} sample: " + "; ".join(t[0] for t in sample))
rep.write_text("\n".join(lines) + "\n"); print(rep.read_text())
