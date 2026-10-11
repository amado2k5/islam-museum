#!/usr/bin/env python3
"""Stream the Wikidata JSON dump (one entity per line) and keep a subset: docs/plan/15 §6.1 step 2.

  pass 1  keeps (a) every seed entity, (b) every entity that points AT a seed (incoming neighbour), (c) every property entity;
          and records the QIDs that seeds point TO (outgoing neighbours) in <out>/needed.txt.
  pass 2  streams the dump again and keeps only the outgoing neighbours not already kept.
Deviation from the plan's "one pass": an outgoing neighbour may sit earlier in the dump than the seed that refers to it, so one
pass cannot find it. Each pass is a single streaming read; nothing is decompressed to disk.

Usage (pass 1, then pass 2):
  pbzip2 -dc latest-all.json.bz2 | filter_dump.py --seeds $HARVEST/db/seeds.txt --pass 1 --out $HARVEST/layers/cc0/wikidata/
  pbzip2 -dc latest-all.json.bz2 | filter_dump.py --seeds $HARVEST/db/seeds.txt --pass 2 --out $HARVEST/layers/cc0/wikidata/
  filter_dump.py --build --out $HARVEST/layers/cc0/wikidata/        # write the Parquet tables and the DuckDB views
Tables: wd_entity, wd_label, wd_claim, wd_sitelink, wd_external_id. Output is CC0 (Wikidata). Resumable by pass; never writes raw files."""
import argparse, re, sys
from pathlib import Path
import orjson

ap = argparse.ArgumentParser()
ap.add_argument("--seeds"); ap.add_argument("--out", required=True); ap.add_argument("--pass", dest="passno", type=int, choices=[1, 2])
ap.add_argument("--build", action="store_true"); ap.add_argument("--limit", type=int, default=0)
args = ap.parse_args()
OUT = Path(args.out); OUT.mkdir(parents=True, exist_ok=True)
CH = OUT / "chunks"; CH.mkdir(exist_ok=True)

HEAD = re.compile(rb'^\{"type":"(item|property)","id":"([QP])(\d+)"')
NUMID = re.compile(rb'"numeric-id":(\d+)')


def row_entity(e):
    labels, descs = e.get("labels", {}), e.get("descriptions", {})
    yield "wd_entity", {"id": e["id"], "type": e["type"], "label_en": labels.get("en", {}).get("value"), "description_en": descs.get("en", {}).get("value"),
                        "lastrevid": e.get("lastrevid"), "modified": e.get("modified")}
    for lang, v in labels.items():
        yield "wd_label", {"id": e["id"], "lang": lang, "label": v["value"], "description": descs.get(lang, {}).get("value")}
    for site, v in e.get("sitelinks", {}).items():
        yield "wd_sitelink", {"id": e["id"], "site": site, "title": v["title"]}
    for prop, claims in e.get("claims", {}).items():
        for c in claims:
            snak = c["mainsnak"]
            if snak.get("snaktype") != "value":
                continue
            dv, dt = snak["datavalue"], snak.get("datatype")
            if dt == "external-id":
                yield "wd_external_id", {"id": e["id"], "property": prop, "value": dv["value"]}; continue
            r = {"id": e["id"], "property": prop, "datatype": dt, "rank": c.get("rank"), "value_id": None, "value_str": None, "value_time": None,
                 "value_precision": None, "value_calendar": None, "value_lat": None, "value_lon": None, "value_amount": None,
                 "qualifiers": orjson.dumps(c["qualifiers"]).decode() if c.get("qualifiers") else None}
            v = dv["value"]
            if dv["type"] == "wikibase-entityid": r["value_id"] = v.get("id")
            elif dv["type"] == "string": r["value_str"] = v
            elif dv["type"] == "monolingualtext": r["value_str"] = f'{v["language"]}:{v["text"]}'
            elif dv["type"] == "time": r["value_time"], r["value_precision"], r["value_calendar"] = v["time"], v["precision"], v["calendarmodel"].rsplit("/", 1)[-1]
            elif dv["type"] == "globecoordinate": r["value_lat"], r["value_lon"] = v["latitude"], v["longitude"]
            elif dv["type"] == "quantity": r["value_amount"] = v["amount"]
            yield "wd_claim", r


def outgoing(e):
    for claims in e.get("claims", {}).values():
        for c in claims:
            s = c["mainsnak"]
            if s.get("snaktype") == "value" and s.get("datatype") == "wikibase-item":
                yield s["datavalue"]["value"]["id"]


if args.build:
    import duckdb
    con = duckdb.connect(str(OUT / "wikidata-subset.duckdb"))
    for t in ("wd_entity", "wd_label", "wd_claim", "wd_sitelink", "wd_external_id"):
        files = sorted(CH.glob(f"{t}.*.ndjson"))
        if not files:
            print(f"{t}: no chunks"); continue
        con.execute(f"CREATE OR REPLACE TABLE {t} AS SELECT DISTINCT * FROM read_json_auto({[str(f) for f in files]}, format='newline_delimited', sample_size=-1, union_by_name=true)")
        con.execute(f"COPY {t} TO '{OUT / (t + '.parquet')}' (FORMAT parquet, COMPRESSION zstd)")
        print(t, con.execute(f"SELECT count(*) FROM {t}").fetchone()[0])
    sys.exit(0)

seeds = {int(q[1:]) for q in Path(args.seeds).read_text().split() if q.startswith("Q")}
seed_bytes = {str(n).encode() for n in seeds}
kept_f = OUT / "kept.txt"
kept = set(kept_f.read_text().split()) if kept_f.exists() else set()
needed_f = OUT / "needed.txt"
needed = set(needed_f.read_text().split()) if needed_f.exists() else set()
if args.passno == 1:
    for f in CH.glob("*.p1.*"): f.unlink()
    kept, needed = set(), set()
else:
    for f in CH.glob("*.p2.*"): f.unlink()

writers = {}
def write(table, row):
    f = writers.get(table)
    if f is None:
        f = writers[table] = open(CH / f"{table}.p{args.passno}.0.ndjson", "ab")
    f.write(orjson.dumps(row) + b"\n")

n = k = 0
for raw in sys.stdin.buffer:
    n += 1
    if raw[:1] != b"{":
        continue
    line = raw.rstrip(b",\r\n")
    m = HEAD.match(line)
    if not m:
        continue
    eid = (m.group(2) + m.group(3)).decode()
    take = False
    if args.passno == 1:
        if m.group(1) == b"property" or int(m.group(3)) in seeds and m.group(2) == b"Q":
            take = True
        elif any(x in seed_bytes for x in NUMID.findall(line)):   # incoming neighbour: some claim points at a seed
            take = True
    else:
        take = eid in needed and eid not in kept
    if not take:
        continue
    e = orjson.loads(line)
    for table, row in row_entity(e):
        write(table, row)
    kept.add(eid); k += 1
    if args.passno == 1 and e["type"] == "item" and int(m.group(3)) in seeds:
        needed.update(t for t in outgoing(e))
    if k % 20000 == 0:
        print(f"pass {args.passno}: read {n:,} lines, kept {k:,}", file=sys.stderr, flush=True)
    if args.limit and k >= args.limit:
        break
for f in writers.values(): f.close()
kept_f.write_text("\n".join(sorted(kept)) + "\n")
if args.passno == 1:
    needed_f.write_text("\n".join(sorted(needed - kept)) + "\n")
print(f"pass {args.passno} done: read {n:,} lines, kept {k:,}; outgoing neighbours still needed: {len(needed - kept):,}", file=sys.stderr)
