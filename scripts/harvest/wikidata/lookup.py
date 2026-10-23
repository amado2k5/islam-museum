#!/usr/bin/env python3
"""Read the local Wikidata subset (CC0) instead of the live query service.
  lookup.py QID [QID ...]        show labels, description, sitelinks and claims (property labels resolved)
  lookup.py --search TEXT        find items whose Arabic or English label contains TEXT
Reads the v2 subset, $HARVEST/layers/cc0/wikidata-v2/wikidata-subset.duckdb, read-only (override with WIKIDATA_SUBSET=path). Never calls the network."""
import argparse, os, sys
from pathlib import Path

import duckdb

HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
DB = Path(os.environ.get("WIKIDATA_SUBSET", HARVEST / "layers" / "cc0" / "wikidata-v2" / "wikidata-subset.duckdb"))


def connect():
    return duckdb.connect(str(DB), read_only=True)


def show(con, qid: str, limit: int):
    ent = con.execute("select label_en, description_en from wd_entity where id = ?", [qid]).fetchone()
    if not ent:
        print(f"{qid}: not in the local subset"); return
    labels = dict(con.execute("select lang, label from wd_label where id = ? and lang in ('ar','en')", [qid]).fetchall())
    print(f"{qid}  ar: {labels.get('ar', '-')}  en: {ent[0] or '-'}")
    if ent[1]: print(f"  {ent[1]}")
    sites = con.execute("select site, title from wd_sitelink where id = ? and site in ('arwiki','enwiki') order by site", [qid]).fetchall()
    for site, title in sites: print(f"  {site}: {title}")
    rows = con.execute("""select c.property, coalesce(p.label_ar, p.label_en, c.property), coalesce(c.value_id, c.value_str, c.value_time, c.value_amount::varchar)
                          from wd_claim c left join wd_property p on p.id = c.property where c.id = ? order by c.property limit ?""", [qid, limit]).fetchall()
    for prop, plabel, value in rows:
        print(f"  {prop} {plabel}: {value}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("qids", nargs="*"); ap.add_argument("--search"); ap.add_argument("--limit", type=int, default=40)
    a = ap.parse_args()
    if not DB.exists():
        sys.exit(f"local subset not found: {DB}")
    con = connect()
    if a.search:
        for qid, lab in con.execute("select distinct l.id, l.label from wd_label l where l.label ilike ? and l.lang in ('ar','en') limit 50", [f"%{a.search}%"]).fetchall():
            print(qid, lab)
        return
    for q in a.qids:
        show(con, q, a.limit)


if __name__ == "__main__":
    main()
