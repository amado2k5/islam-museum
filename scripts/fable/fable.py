"""Shared helpers for the Grand Tour mission oracles (docs/fable-run/VERIFICATION.md).

An oracle is one file in this folder. It prints what it measured and ends with one line, `RESULT: GREEN` or
`RESULT: NOT-GREEN`, and exits 0 or 1 to match. Every oracle starts with the same header, so a reader of a captured
output can tell which commit and which graph artifact produced the numbers. Standard library only.
"""
import collections, json, math, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
os.chdir(ROOT)

PRODUCTION = "8d1b0ef9d7556cc570e9e452e8cd3257e346ab1f"  # what visitors see (api/v1/meta/deploy.json on launch morning)
BASELINE = "e1d721298ab4b2494a4c8f04d3defcde1808b939"    # main at the moment this branch started
MEASURED = ("data", "content", "tour", "schema", "scripts", "site", "i18n")


def sh(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=ROOT).stdout.strip()


def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default


class Oracle:
    def __init__(self, number, title, needs_graph=True):
        self.ok, self.n, self.failed = True, 0, []
        self.graph = None
        head = sh("git rev-parse HEAD")
        dirty = [l for l in sh("git status --porcelain -- " + " ".join(MEASURED)).splitlines() if l.strip()]
        print(f"ORACLE {number}: {title}")
        print(f"file: scripts/fable/{os.path.basename(sys.argv[0])}")
        print(f"HEAD: {head}")
        print(f"baseline (main at branch start): {BASELINE}; ancestor of HEAD: {'yes' if subprocess.run(['git', 'merge-base', '--is-ancestor', BASELINE, 'HEAD'], cwd=ROOT).returncode == 0 else 'NO'}")
        print(f"uncommitted paths under {'/ '.join(MEASURED)}/: {len(dirty)}" + ("" if not dirty else "  (the numbers below describe the working tree, not HEAD)"))
        if needs_graph:
            path = arg("--graph", os.path.join(ROOT, ".cache", "graph.json"))
            if not os.path.exists(path):
                print("graph artifact: MISSING. Run `npm run graph` first.")
                print("RESULT: NOT-GREEN (no graph artifact)")
                sys.exit(1)
            self.graph = json.load(open(path, encoding="utf-8"))
            g = self.graph
            print(f"graph artifact: {os.path.relpath(path, ROOT) if path.startswith(ROOT) else path}; built from commit {g.get('commit')}; {len(g['nodes'])} nodes, {len(g['edges'])} edges")
            if g.get("commit") != head and "--graph" not in sys.argv:
                print("WARNING: the graph artifact was built from a different commit than HEAD. Run `npm run graph` and re-run.")
                self.ok = False
                self.failed.append("graph artifact is stale")
        print("-" * 78)

    def check(self, name, ok, detail=""):
        self.n += 1
        if not ok:
            self.ok = False
            self.failed.append(name)
        print(f"[{'PASS' if ok else 'FAIL'}] {name}" + (f": {detail}" if detail else ""))

    def note(self, text=""):
        print(text)

    def finish(self, not_green_reason=None):
        print("-" * 78)
        if not_green_reason:
            print(f"RESULT: NOT-GREEN ({not_green_reason})")
            sys.exit(1)
        if self.ok:
            print(f"RESULT: GREEN ({self.n} checks passed)")
            sys.exit(0)
        print(f"RESULT: NOT-GREEN ({len(self.failed)} of {self.n} checks failed: {'; '.join(self.failed)})")
        sys.exit(1)


def real_nodes(graph):
    return [n for n in graph["nodes"] if not n["stub"]]


def review(n):
    return (n["data"].get("status") or {}).get("review")


def importance(n):
    return n["data"].get("importance")


# ---- The anchor rule: where a record stands in time (used by the canon floor check and the Tour coverage oracle) ----
# 1. the record's own date: a person's death (else floruit, else birth); an event's date.start; a building's `built`; an
#    object's `made`; a work's `composed`; a period's or polity's `start`; a place's or group's `founded`.
# 2. a work with no date of its own: the latest death among the persons the graph says authored it.
# 3. otherwise the record floats: inside the span of the periods it lists, or anywhere if it lists none.
# The Hijri year is the one the record states for that date; where it states none it is floor((CE year - 622) * 33 / 32) + 1,
# the arithmetic rule (33 lunar years to 32 solar), exact to within one year. Century 0 is "before the Hijra".
OWN_DATE = {"person": ["died", "floruit", "born"], "event": ["date.start"], "building": ["built"], "object": ["made"], "work": ["composed"],
            "period": ["start"], "polity": ["start"], "place": ["founded"], "group": ["founded"]}


def edtf_year(d):
    m = re.match(r"\s*(-?\d{1,4})", str((d or {}).get("edtf", "")))
    return int(m.group(1)) if m else None


def hijri_of(d):
    """(hijri_year, 'stated' | 'arithmetic') for one date object, or None."""
    y = edtf_year(d)
    if y is None:
        return None
    h = re.match(r"\s*(-?\d{1,4})", str(d.get("hijri", "")))
    if h:
        return int(h.group(1)), "stated"
    return math.floor((y - 622) * 33 / 32) + 1, "arithmetic"


def century_of(hy):
    return 0 if hy < 1 else (hy - 1) // 100 + 1


def own_date(n):
    for key in OWN_DATE.get(n["class"], []):
        d = n["data"]
        for part in key.split("."):
            d = (d or {}).get(part) if isinstance(d, dict) else None
        if isinstance(d, dict) and edtf_year(d) is not None:
            return key, d
    return None


def anchor(n, by_id, authors_of):
    """dict(basis, ce, hijri, hijri_basis, century, via) for a node; basis is own-date, author, period or none."""
    od = own_date(n)
    if od:
        hy, hb = hijri_of(od[1])
        return dict(basis="own-date", field=od[0], ce=edtf_year(od[1]), hijri=hy, hijri_basis=hb, century=century_of(hy), via=None)
    if n["class"] == "work":
        best = None
        for a in authors_of.get(n["id"], []):
            p = by_id.get(a)
            d = (p or {}).get("data", {}).get("died") if p else None
            if isinstance(d, dict) and edtf_year(d) is not None and (best is None or edtf_year(d) > edtf_year(best[1])):
                best = (a, d)
        if best:
            hy, hb = hijri_of(best[1])
            return dict(basis="author", field="died", ce=edtf_year(best[1]), hijri=hy, hijri_basis=hb, century=century_of(hy), via=best[0])
    spans = []
    for pid in n.get("periods") or []:
        p = by_id.get(pid)
        if p and isinstance(p["data"].get("start"), dict) and edtf_year(p["data"]["start"]) is not None:
            end = p["data"].get("end")
            spans.append((edtf_year(p["data"]["start"]), edtf_year(end) if isinstance(end, dict) and edtf_year(end) is not None else 9999, pid))
    if spans:
        return dict(basis="period", field=None, ce=None, hijri=None, hijri_basis=None, century=None, via=[s[2] for s in spans], lo=min(s[0] for s in spans), hi=max(s[1] for s in spans))
    return dict(basis="none", field=None, ce=None, hijri=None, hijri_basis=None, century=None, via=None)


def authors_index(graph):
    out = collections.defaultdict(list)
    for e in graph["edges"]:
        if e["type"] == "authored" and not e.get("inverse"):
            out[e["to"]].append(e["from"])
    return out


def manifest_ids(path="tour/grand-tour.yaml"):
    """The Tour's stops, in order. The manifest keeps one `- id: class/slug` line per stop so this needs no YAML library."""
    if not os.path.exists(os.path.join(ROOT, path)):
        return []
    return re.findall(r"^\s*-\s*id:\s*([a-z]+/[a-z0-9-]+)\s*$", open(os.path.join(ROOT, path), encoding="utf-8").read(), re.M)
