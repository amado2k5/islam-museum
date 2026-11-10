#!/usr/bin/env python3
"""Self-test for filter_dump.py on a tiny synthetic dump in the real (compact, one-entity-per-line) format. Run: python test_filter.py"""
import json, subprocess, sys, tempfile
from pathlib import Path
import duckdb

HERE = Path(__file__).parent
item = lambda n: {"snaktype": "value", "datatype": "wikibase-item", "datavalue": {"type": "wikibase-entityid", "value": {"entity-type": "item", "numeric-id": n, "id": f"Q{n}"}}}
ents = [
    {"type": "item", "id": "Q1", "labels": {"en": {"language": "en", "value": "Seed"}, "ar": {"language": "ar", "value": "أ"}}, "descriptions": {},
     "claims": {"P31": [{"mainsnak": item(5), "rank": "normal"}],
               "P214": [{"mainsnak": {"snaktype": "value", "datatype": "external-id", "datavalue": {"type": "string", "value": "31996761"}}, "rank": "normal"}]},
     "sitelinks": {"enwiki": {"site": "enwiki", "title": "Seed"}}},
    {"type": "item", "id": "Q2", "labels": {"en": {"language": "en", "value": "Unrelated"}}, "claims": {}},
    {"type": "item", "id": "Q3", "labels": {"en": {"language": "en", "value": "Points at seed"}}, "claims": {"P140": [{"mainsnak": item(1), "rank": "normal"}]}},
    {"type": "item", "id": "Q5", "labels": {"en": {"language": "en", "value": "human"}}, "claims": {}},
    {"type": "property", "datatype": "wikibase-item", "id": "P31", "labels": {"en": {"language": "en", "value": "instance of"}}, "claims": {}},
]
with tempfile.TemporaryDirectory() as t:
    t = Path(t)
    dump = "[\n" + ",\n".join(json.dumps(e, separators=(",", ":"), ensure_ascii=False) for e in ents) + "\n]\n"
    (t / "seeds.txt").write_text("Q1\n")
    run = lambda *a: subprocess.run([sys.executable, str(HERE / "filter_dump.py"), "--seeds", str(t / "seeds.txt"), "--out", str(t / "out"), *a], input=dump.encode(), check=True, capture_output=True)
    run("--pass", "1"); run("--pass", "2"); run("--build")
    con = duckdb.connect(str(t / "out" / "wikidata-subset.duckdb"))
    ids = {r[0] for r in con.execute("select id from wd_entity").fetchall()}
    assert ids == {"Q1", "Q3", "Q5", "P31"}, ids          # seed, incoming neighbour, outgoing neighbour (pass 2), property; not Q2
    assert con.execute("select count(*) from wd_external_id").fetchone()[0] == 1
    assert con.execute("select count(*) from wd_label where id='Q1'").fetchone()[0] == 2
    print("ok: seeds, incoming and outgoing neighbours, properties kept; unrelated entity dropped")
