#!/usr/bin/env python3
"""Run each SPARQL file in queries/ against the Wikidata Query Service, in series, with a pause between queries.
Writes $HARVEST/layers/cc0/wikidata/seeds-<name>.json (QIDs) and appends to $HARVEST/db/seeds.txt (deduplicated).
Resumable: queries already done (per checkpoint) are skipped unless --force. Usage: run_queries.py [--force] [name ...]"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import HARVEST, checkpoint, client, polite_sleep, require_source, save_checkpoint

src = require_source("wikidata-query")
pause = src["limits"]["pause_seconds"]
qdir = Path(__file__).parent / "queries"
out = HARVEST / "layers" / "cc0" / "wikidata"
out.mkdir(parents=True, exist_ok=True)
args = [a for a in sys.argv[1:] if not a.startswith("--")]
force = "--force" in sys.argv
ck = checkpoint("wikidata-queries")

with client() as http:
    for f in sorted(qdir.glob("*.rq")):
        name = f.stem
        if args and name not in args and not any(name.startswith(a) for a in args):
            continue
        if ck.get(name, {}).get("ok") and not force:
            print(f"skip {name} (done: {ck[name]['count']} items)")
            continue
        r = http.get(src["url"], params={"query": f.read_text(), "format": "json"}, headers={"Accept": "application/sparql-results+json"})
        if r.status_code in src["limits"]["backoff_on"]:
            print(f"{name}: HTTP {r.status_code}, backing off; rerun later"); ck[name] = {"ok": False, "status": r.status_code}
            save_checkpoint("wikidata-queries", ck); polite_sleep(60); continue
        if r.status_code != 200:
            print(f"{name}: HTTP {r.status_code}: {r.text[:200]}"); ck[name] = {"ok": False, "status": r.status_code}
            save_checkpoint("wikidata-queries", ck); polite_sleep(pause); continue
        qids = sorted({b["item"]["value"].rsplit("/", 1)[1] for b in r.json()["results"]["bindings"]})
        (out / f"seeds-{name}.json").write_text(json.dumps({"query": name, "licence": "CC0 1.0", "count": len(qids), "qids": qids}, indent=0))
        ck[name] = {"ok": True, "count": len(qids)}
        save_checkpoint("wikidata-queries", ck)
        print(f"{name}: {len(qids)} items")
        polite_sleep(pause)

seeds = set()
for f in out.glob("seeds-*.json"):
    seeds.update(json.loads(f.read_text())["qids"])
(HARVEST / "db" / "seeds.txt").write_text("\n".join(sorted(seeds, key=lambda q: int(q[1:]))) + "\n")
print(f"seeds.txt: {len(seeds)} distinct QIDs")
