# Prints a one-line-per-run table from the JSON files tools/bench.ts writes.
# Usage: python3 -I tools/bench-summary.py <file.json> [...]
import json, sys

for path in sys.argv[1:]:
    d = json.load(open(path))
    m = d["meta"]
    print(f"# {path.split('/')[-1]}  {m['browserChannel']} {m['browserVersion']}  uncapped={m['uncapped']}  commit={m['commit'][:9]}{'+dirty' if m['dirty'] else ''}  {m['startedAt']}")
    for r in d["results"]:
        f, c = r["frame"], r["cpuRender"]
        print(f"  {r['name']:<40} v{r['engineVersion']:<7} frames {f['frames']:>5}  fps {f['avgFps']:>7.1f}  frame ms p50 {f['p50Ms']:>5.2f} p95 {f['p95Ms']:>5.2f} p99 {f['p99Ms']:>5.2f} max {f['maxMs']:>6.2f}  >16.7ms {f['over16_7']:>3}  cpu ms p50 {c['p50Ms']:>5.2f} p95 {c['p95Ms']:>5.2f}  draws {r['drawCalls']:>4}  tris {r['trianglesDrawn'] / 1e6:.2f}M  init {r['engineInitMs']}ms  first {r['firstFrameMs']}ms  errors {len(r['consoleErrors'])}")
