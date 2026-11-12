#!/usr/bin/env python3
"""The board: runs every statement's oracle and writes the result, so that no green is ever narrated (statement 13).

  python3 scripts/fable/board.py              # rebuilds the graph artifact, runs every oracle, rewrites the board
  python3 scripts/fable/board.py --fast       # skips the two slow ones (the double build of o08b and the live search run)
  python3 scripts/fable/board.py --only 8,11  # re-runs only those statements; every other row is read from its captured
                                              # output, and only if that output was produced at this same commit

For each statement it runs the command shown, saves the full output under docs/fable-run/oracle-output/, reads the
oracle's own last line (`RESULT: GREEN` or `RESULT: NOT-GREEN (...)`), and writes the table between the BOARD markers in
docs/fable-run/VERIFICATION.md. Nothing in that table is typed by hand. A statement whose oracle cannot run on this
machine is written NOT-GREEN with the oracle's own reason.
"""
import datetime, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "docs", "fable-run", "oracle-output")
FAST = "--fast" in sys.argv
ONLY = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
PROD = "https://islam.museum"

# (statement, what it says, oracle file, command, output file, slow)
ORACLES = [
    ("1", "A canon exists in the data, selected by the museum's own structure", "scripts/fable/o01_canon.py", "python3 scripts/fable/o01_canon.py", "o01-canon.out", False),
    ("2", "Every Tour stop is a cornerstone; the stops span nine wings and fourteen centuries", "scripts/fable/o02_tour_coverage.py", "python3 scripts/fable/o02_tour_coverage.py", "o02-tour_coverage.out", False),
    ("3", "Every Tour stop's prose meets the published standard, deepened only from already-cited sources", "scripts/fable/o03_tour_prose.py", "python3 scripts/fable/o03_tour_prose.py", "o03-tour_prose.out", False),
    ("4", "No cornerstone is a dead end; every published record within three hops of a cornerstone", "scripts/fable/o04_reachability.py", "python3 scripts/fable/o04_reachability.py", "o04-reachability.out", False),
    ("5", "The cross-record contradiction sweep is complete; zero silently left", "scripts/fable/o05_contradictions.ts", "npx tsx scripts/fable/o05_contradictions.ts", "o05-contradictions.out", False),
    ("6", "Canon-first search: the fixed queries return the canon record first on the built site", "scripts/fable/o06_search.mjs", f"node scripts/fable/o06_search.mjs {PROD}", "o06-search-production.out", True),
    ("7", "The absence list is honest: every claimed absence survived an alias search", "scripts/fable/o07_absences.py", "python3 scripts/fable/o07_absences.py", "o07-absences.out", False),
    ("8", "The vision pass is mechanical: committed screenshots, fresh-context defect lists, every defect fixed or registered", "scripts/fable/o08_vision.py", "python3 scripts/fable/o08_vision.py", "o08-vision.out", False),
    ("8 (rest of the site)", "The rest of the site renders exactly as before", "scripts/fable/o08_unchanged.py", "python3 scripts/fable/o08_unchanged.py", "o08b-unchanged.out", True),
    ("9", "The flagship degrades honestly with JavaScript disabled; no stop unreachable; the site's own standards hold", "scripts/fable/o09_nojs.mjs", "node scripts/fable/o09_nojs.mjs", "o09-nojs.out", False),
    ("11", "The work exists on the remote: every phase's pull request is live on the host", "scripts/fable/o11_remote.py", "python3 scripts/fable/o11_remote.py", "o11-remote.out", False),
    ("12", "The baseline is frozen and concurrency is accounted for", "scripts/fable/o00_baseline.py", "python3 scripts/fable/o00_baseline.py", "o00-baseline.out", False),
]


def run(cmd):
    return subprocess.run(cmd, shell=True, cwd=ROOT, capture_output=True, text=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    head = run("git rev-parse HEAD").stdout.strip()
    dirty = [l for l in run("git status --porcelain -- data content tour schema scripts site i18n").stdout.splitlines() if l.strip()]
    print(f"board: HEAD {head}; uncommitted measured paths: {len(dirty)}")
    if ONLY is None:
        g = run("npx tsx scripts/build-graph.ts")
        print("board:", (g.stdout.strip().splitlines() or [g.stderr.strip()[-200:]])[-1])
    rows = []
    for st, text, file, cmd, out, slow in ORACLES:
        path = os.path.join(OUT, out)
        if not os.path.exists(os.path.join(ROOT, file)):
            rows.append((st, text, file, cmd, out, "NOT-GREEN (the oracle file does not exist yet)", None))
            continue
        if ONLY is not None and st.split(" ")[0] not in ONLY:
            prev = open(path, encoding="utf-8").read() if os.path.exists(path) else ""
            at = re.search(r"^HEAD: ([0-9a-f]{40})", prev, re.M)
            last = [l for l in prev.splitlines() if l.startswith("RESULT:")]
            if at and at.group(1) == head and last:
                rows.append((st, text, file, cmd, out, last[-1][8:], None))
                print(f"board: statement {st}: read from its run at this commit")
                continue
        if slow and FAST:
            last = [l for l in (open(path, encoding="utf-8").read().splitlines() if os.path.exists(path) else []) if l.startswith("RESULT:")]
            head_line = [l for l in (open(path, encoding="utf-8").read().splitlines() if os.path.exists(path) else []) if l.startswith("HEAD:")]
            rows.append((st, text, file, cmd, out, (last[-1][8:] if last else "NOT-GREEN (not run)") + f" [not re-run in this pass; last run at {head_line[0][6:16] if head_line else 'unknown'}]", None))
            continue
        r = run(cmd)
        open(path, "w", encoding="utf-8").write(r.stdout + (("\n[stderr]\n" + r.stderr) if r.returncode not in (0, 1) and r.stderr.strip() else ""))
        res = [l for l in r.stdout.splitlines() if l.startswith("RESULT:")]
        result = res[-1][8:] if res else f"NOT-GREEN (the oracle did not finish: exit {r.returncode}; {r.stderr.strip()[-160:]})"
        rows.append((st, text, file, cmd, out, result, r.returncode))
        print(f"board: statement {st}: {result[:110]}")
    # two measurements that are not statements: the wing probe on production (what visitors see) and on this branch's build
    if ONLY is None:
        if not FAST:
            open(os.path.join(OUT, "o13-production-wings.out"), "w", encoding="utf-8").write(run(f"python3 scripts/fable/o13_production_wings.py {PROD}").stdout)
        open(os.path.join(OUT, "o13-branch-wings.out"), "w", encoding="utf-8").write(run("python3 scripts/fable/o13_production_wings.py --dist .cache/fable-dist").stdout)
    now = datetime.datetime.now().astimezone().strftime("%Y-%m-%d %H:%M %Z")
    L = ["<!-- BOARD:BEGIN (generated by scripts/fable/board.py; do not edit by hand) -->", "",
         f"Measured at commit `{head}` on {now}; graph artifact built from that commit; uncommitted paths under the measured folders: {len(dirty)}.", "",
         "| Statement | State | The oracle's own last line | Oracle (a committed file) | Command | Captured output |", "|---|---|---|---|---|---|"]
    for st, text, file, cmd, out, result, code in rows:
        state = "GREEN" if result.startswith("GREEN") else "NOT-GREEN"
        L.append(f"| **{st}** {text} | **{state}** | {result.replace('|', '/')} | `{file}` | `{cmd}` | `docs/fable-run/oracle-output/{out}` |")
    vf = os.path.join(ROOT, "docs", "fable-run", "VERIFICATION.md")

    def write(extra):
        green = sum(1 for r in rows if r[5].startswith("GREEN")) + sum(1 for e in extra if "| **GREEN** |" in e)
        total = len(rows) + len(extra)
        block = "\n".join(L + extra + ["", f"{green} of {total} oracle runs end GREEN. The last row is the ledger checking itself: that every statement has a committed oracle and a captured output (statement 10), and that every row above is the oracle's own last line from a run at the commit named, never typed (statement 13).", "", "<!-- BOARD:END -->"])
        text = open(vf, encoding="utf-8").read() if os.path.exists(vf) else "# Verification ledger\n\n<!-- BOARD:BEGIN -->\n<!-- BOARD:END -->\n"
        open(vf, "w", encoding="utf-8").write(re.sub(r"<!-- BOARD:BEGIN.*?<!-- BOARD:END -->", lambda m: block, text, flags=re.S))
        return green, total

    # statements 10 and 13: the ledger checks the table just written against the files it names, then its own row is added
    write([])
    subprocess.run("python3 scripts/fable/numbers.py", shell=True, cwd=ROOT, capture_output=True, text=True)
    r = run("python3 scripts/fable/o10_ledger.py")
    open(os.path.join(OUT, "o10-ledger.out"), "w", encoding="utf-8").write(r.stdout)
    res = [l for l in r.stdout.splitlines() if l.startswith("RESULT:")]
    result = res[-1][8:] if res else f"NOT-GREEN (the oracle did not finish: exit {r.returncode}; {r.stderr.strip()[-160:]})"
    print(f"board: statements 10 and 13: {result[:110]}")
    state = "GREEN" if result.startswith("GREEN") else "NOT-GREEN"
    green, total = write([f"| **10 and 13** Every statement has an oracle; the board is derived from the last runs, never narrated | **{state}** | {result.replace('|', '/')} | `scripts/fable/o10_ledger.py` | `python3 scripts/fable/o10_ledger.py` | `docs/fable-run/oracle-output/o10-ledger.out` |"])
    print(f"board: {green} of {total} green -> docs/fable-run/VERIFICATION.md")


if __name__ == "__main__":
    main()
