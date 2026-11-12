#!/usr/bin/env python3
"""Shared helpers for the courses-mission oracles (docs/courses-mission/VERIFICATION.md).

An oracle prints what it measured and ends with one line: `RESULT: GREEN (...)` or `RESULT: NOT-GREEN (...)`.
Its output is captured under docs/courses-mission/oracle-output/ by passing --save.
"""
import os, subprocess, sys, datetime, glob, yaml

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASELINE = "800467e93e2c9ef073807f6bd5c7b717b028f859"  # origin/main when the mission branch was cut (2026-11-11)
PRODUCTION = "https://islam.museum"
OUT = os.path.join(ROOT, "docs", "courses-mission", "oracle-output")
LANGS = ("ar", "en")  # the mission's languages; Urdu is not this mission's lane


def sh(cmd, check=False):
    r = subprocess.run(cmd, shell=True, cwd=ROOT, capture_output=True, text=True)
    if check and r.returncode:
        raise SystemExit(f"command failed: {cmd}\n{r.stderr}")
    return r.stdout.strip()


def load(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return yaml.safe_load(f)


def courses():
    """Every course record on disk, by id."""
    out = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "data", "course", "*.yaml"))):
        d = yaml.safe_load(open(f, encoding="utf-8"))
        out[d["id"]] = d
    return out


def exists(entity_id):
    return os.path.exists(os.path.join(ROOT, "data", entity_id + ".yaml"))


def baseline_has(path):
    return subprocess.run(f"git cat-file -e {BASELINE}:{path}", shell=True, cwd=ROOT, capture_output=True).returncode == 0


def baseline_text(path):
    r = subprocess.run(f"git show {BASELINE}:{path}", shell=True, cwd=ROOT, capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


def tree(cs, root_id):
    """Ids under root_id (inclusive), following part_of."""
    kids = {}
    for i, d in cs.items():
        kids.setdefault(d.get("part_of"), []).append(i)
    out, todo = [], [root_id]
    while todo:
        i = todo.pop()
        out.append(i)
        todo += kids.get(i, [])
    return out


class Oracle:
    def __init__(self, num, title):
        self.num, self.title, self.lines, self.passed, self.failed = num, title, [], 0, []
        self.note(f"ORACLE {num}: {title}")
        dirty = len([l for l in sh("git status --porcelain -- data content site i18n scripts/courses").splitlines() if l.strip()])
        self.note(f"run at commit {sh('git rev-parse HEAD')} on {datetime.datetime.now().astimezone().strftime('%Y-%m-%d %H:%M %Z')}; baseline {BASELINE[:10]}; uncommitted paths under data/ content/ site/ i18n/ scripts/courses/: {dirty}")
        self.note()

    def note(self, s=""):
        self.lines.append(s)
        print(s)

    def check(self, name, ok, detail=""):
        if ok:
            self.passed += 1
        else:
            self.failed.append(name)
        self.note(f"  [{'PASS' if ok else 'FAIL'}] {name}" + (f" — {detail}" if detail else ""))
        return ok

    def done(self, slug):
        self.note()
        last = f"RESULT: GREEN ({self.passed} checks passed)" if not self.failed else f"RESULT: NOT-GREEN ({len(self.failed)} failed: {'; '.join(self.failed)})"
        self.note(last)
        if "--save" in sys.argv:
            os.makedirs(OUT, exist_ok=True)
            with open(os.path.join(OUT, slug + ".out"), "w", encoding="utf-8") as f:
                f.write("\n".join(self.lines) + "\n")
        sys.exit(0)


# ---- curriculum text inside the repository's quotation limit -------------------------------------------------------
QUOTE_WORDS = 40  # docs/sources-policy.md: verbatim text is stored at most 40 words per quotation


def quote_official(text):
    """The form in which an authority's expectation text is stored in a record.

    The repository stores at most 40 words of any source verbatim. Official expectations are often longer, almost always
    because of their example lists. The rule is mechanical and loses no word silently:
      1. every parenthetical that begins "(e.g." is replaced by "[…]" (an omission mark);
      2. if what remains is still longer than 40 words, it is cut after the 40th word and ends with " …".
    Nothing is reworded, reordered or added. The fidelity check compares a record's text with quote_official(official text).
    """
    out, i, n = [], 0, len(text)
    while i < n:
        if text.startswith("(e.g.", i):
            depth, j = 0, i
            while j < n:
                depth += text[j] == "("
                depth -= text[j] == ")"
                j += 1
                if depth == 0:
                    break
            out.append("[…]")
            i = j
        else:
            out.append(text[i])
            i += 1
    s = " ".join("".join(out).split())
    s = s.replace(" [,", " [").replace("[…] ,", "[…],").replace(" ,", ",").replace(" ;", ";").replace(" .", ".")
    words = s.split(" ")
    real = [k for k, w in enumerate(words) if w.strip(",;.") != "[…]"]
    if len(real) > QUOTE_WORDS:
        s = " ".join(words[: real[QUOTE_WORDS - 1] + 1]).rstrip(",;:") + " …"
    return s


def entity_sources(eid, at=None):
    """Every source id an entity's own record names (anywhere in its data file) or cites in its prose, now or at a commit."""
    import re
    read = (lambda p: baseline_text(p) if at == BASELINE else sh(f"git show {at}:{p}")) if at else (lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read() if os.path.exists(os.path.join(ROOT, p)) else None)
    out = set()
    t = read(f"data/{eid}.yaml") or ""
    out |= set(re.findall(r"source/[a-z0-9-]+", t)) | {"source/" + s for s in re.findall(r"\{cite:([a-z0-9-]+)", t)}
    for l in ("ar", "en", "ur"):
        out |= {"source/" + s for s in re.findall(r"\{cite:([a-z0-9-]+)", read(f"content/{l}/{eid}.md") or "")}
    return out
