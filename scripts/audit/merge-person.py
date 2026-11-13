#!/usr/bin/env python3
"""Audit of 13 November 2026, S7: merge a person record filed twice into the richer record.

  python3 scripts/audit/merge-person.py <canonical-slug> <duplicate-slug> [--apply]

What it does, and nothing else (docs/agents/workflow.md section 5, "Duplicates"):
  - the canonical record gains `aliases: [person/<duplicate>]`, so the old id still resolves;
  - facts the duplicate holds and the canonical lacks are carried over unchanged: external ids, sources, relations
    (by type and target), names (the duplicate's labels become alternate names), every other field the canonical
    lacks (roles, regions, periods, gender, faith and the like, word for word), and a birth or death date when the canonical has none and the duplicate's is not a
    date-enrichment graft;
  - the duplicate's prose sections are appended to the canonical's prose in each language under a heading that names
    the duplicate's source, word for word;
  - every relation target and every [[wiki-link]] in data/ and content/ that names the duplicate is repointed;
  - the duplicate's files are removed (git rm).
It writes no fact of its own and stops if the result does not parse or a carried fact is missing afterwards.
"""
import re, subprocess, sys
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[2]
canon, dup = sys.argv[1], sys.argv[2]
apply = "--apply" in sys.argv
cid, did = f"person/{canon}", f"person/{dup}"
cp, dp = ROOT / f"data/{cid}.yaml", ROOT / f"data/{did}.yaml"
ct, dt = cp.read_text(encoding="utf8"), dp.read_text(encoding="utf8")
c, d = yaml.safe_load(ct), yaml.safe_load(dt)
log = []

def top_block(text, key):
    """(start, end) line indexes of a top-level key's block, or None."""
    lines = text.split("\n")
    for i, l in enumerate(lines):
        if re.match(rf"^{key}:(\s|$)", l):
            j = i + 1
            while j < len(lines) and (lines[j].startswith((" ", "\t", "- ")) or lines[j].strip() == ""):
                j += 1
            while j > i + 1 and lines[j - 1].strip() == "":
                j -= 1
            return i, j
    return None

def flow(v):
    return yaml.safe_dump(v, default_flow_style=True, allow_unicode=True, width=10**6).strip()

t = ct.rstrip("\n") + "\n"
# aliases
if "aliases" in c:
    # a record already merged into once: add to its one-line alias list
    if not re.search(r"(?m)^aliases: \[[^\]\n]*\]", t):
        raise SystemExit(f"{cid} has aliases in a shape this script does not edit: merge by hand")
    t = re.sub(r"(?m)^aliases: \[([^\]\n]*)\]", lambda m: f"aliases: [{m.group(1)}, {did}]", t, count=1)
else:
  t = re.sub(r"(?m)^(id: person/[a-z0-9-]+)[ \t]*$", lambda m: f"{m.group(1)}\naliases: [{did}]   # the same person filed twice; merged 13 Nov 2026 (audit S7), the id still resolves", t, count=1)
# sources
new_sources = [s for s in d.get("sources", []) if s not in c.get("sources", [])]
if new_sources:
    b = top_block(t, "sources"); lines = t.split("\n")
    if b is None: lines.insert(len(lines) - 1, "sources: [" + ", ".join(new_sources) + "]")
    elif b[1] == b[0] + 1:
        lines[b[0]] = re.sub(r"\]\s*$", ", " + ", ".join(new_sources) + "]", lines[b[0]])
    else:
        indent = re.match(r"^(\s*)-", lines[b[0] + 1]).group(1)
        lines[b[1]:b[1]] = [f"{indent}- {s}" for s in new_sources]
    t = "\n".join(lines); log.append(f"sources +{new_sources}")
# relations
have = {(r["type"], r["target"]) for r in c.get("relations", [])}
new_rel = [r for r in d.get("relations", []) if (r["type"], r["target"]) not in have and r["target"] != cid]
if new_rel:
    b = top_block(t, "relations"); lines = t.split("\n")
    if b is None:
        lines[len(lines) - 1:len(lines) - 1] = ["relations:"] + [f"  - {flow(r)}" for r in new_rel]
    else:
        indent = re.match(r"^(\s*)-", lines[b[0] + 1]).group(1)
        lines[b[1]:b[1]] = [f"{indent}- {flow(r)}" for r in new_rel]
    t = "\n".join(lines); log.append(f"relations +{[(r['type'], r['target']) for r in new_rel]}")
# external ids
new_ext = {k: v for k, v in (d.get("external_ids") or {}).items() if k not in (c.get("external_ids") or {})}
if new_ext:
    b = top_block(t, "external_ids"); lines = t.split("\n")
    if b is None: lines[len(lines) - 1:len(lines) - 1] = ["external_ids: " + flow(new_ext)]
    elif b[1] == b[0] + 1:
        lines[b[0]] = re.sub(r"\}\s*$", ", " + flow(new_ext)[1:-1] + " }", lines[b[0]])
    else:
        lines[b[1]:b[1]] = [f"  {k}: {flow(v)}" for k, v in new_ext.items()]
    t = "\n".join(lines); log.append(f"external_ids +{new_ext}")
# names: the duplicate's labels and names, as alternative names
known = {v for v in (c.get("label") or {}).values()} | {n.get("value") for n in c.get("names", [])}
new_names = [n for n in d.get("names", []) if n.get("value") not in known]
for lang, v in (d.get("label") or {}).items():
    if v not in known and v not in [n["value"] for n in new_names]:
        new_names.append({"value": v, "kind": "alternate"})
if new_names:
    b = top_block(t, "names"); lines = t.split("\n")
    if b is None: lines[len(lines) - 1:len(lines) - 1] = ["names:"] + [f"  - {flow(n)}" for n in new_names]
    elif b[1] == b[0] + 1: raise SystemExit(f"{cid}: names is written inline; merge by hand")
    else:
        indent = re.match(r"^(\s*)-", lines[b[0] + 1]).group(1)
        lines[b[1]:b[1]] = [f"{indent}- {flow(n)}" for n in new_names]
    t = "\n".join(lines); log.append(f"names +{[n['value'] for n in new_names]}")
# dates
for k in ("born", "died"):
    if k not in c and k in d and "Date-enrichment pass" not in str(d[k].get("note", "")):
        lines = t.split("\n"); lines[len(lines) - 1:len(lines) - 1] = [f"{k}: {flow(d[k])}"]; t = "\n".join(lines); log.append(f"{k} carried")
# every other field only the duplicate holds (roles, regions, periods, gender, faith, story_roles, education, ...),
# word for word: a merge must not lose a fact because the kept record never had that field
HANDLED = ("id", "aliases", "label", "summary", "sources", "relations", "external_ids", "names", "born", "died")
carried = [k for k in d if k not in c and k not in HANDLED]
for k in carried:
    b = top_block(dt, k)
    if b is None: raise SystemExit(f"{did}: cannot find the block of '{k}': merge by hand")
    t = t.rstrip("\n") + "\n" + "\n".join(dt.split("\n")[b[0]:b[1]]) + "\n"
if carried: log.append(f"fields carried +{carried}")
after = yaml.safe_load(t)
for k in carried: assert after[k] == d[k], k
assert after["aliases"] == list(c.get("aliases", [])) + [did]
for s in new_sources: assert s in after["sources"], s
for r in new_rel: assert any(x["type"] == r["type"] and x["target"] == r["target"] for x in after["relations"]), r
for k, v in new_ext.items(): assert after["external_ids"][k] == v
for k in c:
    if k not in ("sources", "relations", "external_ids", "names", "aliases"): assert after[k] == c[k], k
for n in new_names: assert any(x.get("value") == n["value"] for x in after["names"]), n

# prose
src = (d.get("sources") or [None])[0]
src_label = {}
if src and (ROOT / f"data/{src}.yaml").exists():
    s = yaml.safe_load((ROOT / f"data/{src}.yaml").read_text(encoding="utf8"))
    src_label = s.get("label") or {}
first = {"ar": "في «{x}»", "en": "In {x}", "ur": "«{x}» میں"}
prose_changes = {}
for lang in ("ar", "en", "ur"):
    dprose = ROOT / f"content/{lang}/{did}.md"
    if not dprose.exists(): continue
    body = dprose.read_text(encoding="utf8").split("---\n", 2)[2].strip()
    x = src_label.get(lang) or src_label.get("ar") or src_label.get("en") or d["label"].get(lang) or d["label"]["ar"]
    heads = re.findall(r"(?m)^## (.*)$", body); parts = re.split(r"(?m)^## .*\n", body)[1:]
    if not heads: heads, parts = [""], [body]
    out = []
    for i, (h, p) in enumerate(zip(heads, parts)):
        out.append(f"## {first[lang].format(x=x)}" + (f": {h}" if i > 0 and h else "") + f"\n{p.strip()}")
    cprose = ROOT / f"content/{lang}/{cid}.md"
    if cprose.exists():
        prose_changes[cprose] = cprose.read_text(encoding="utf8").rstrip("\n") + "\n\n" + "\n\n".join(out) + "\n"
    else:
        fm = dprose.read_text(encoding="utf8").split("---\n", 2)[1].replace(did, cid)
        prose_changes[cprose] = f"---\n{fm}---\n" + "\n\n".join(out) + "\n"
    log.append(f"prose {lang}: {len(out)} section(s) carried")

# repoint
repoint = []
grep = subprocess.run(["grep", "-rlE", rf"{re.escape(did)}([^a-z0-9-]|$)", "data", "content"], cwd=ROOT, capture_output=True, text=True).stdout.split()
for f in grep:
    if f in (f"data/{did}.yaml", f"data/{cid}.yaml") or re.match(rf"content/../{re.escape(did)}\.md$", f): continue
    repoint.append(f)
log.append(f"repoint {len(repoint)} file(s): {repoint[:6]}")
print(f"{did} -> {cid}: " + "; ".join(log))
if apply:
    cp.write_text(t, encoding="utf8")
    for f, txt in prose_changes.items(): f.write_text(txt, encoding="utf8")
    for f in repoint:
        p = ROOT / f; s = p.read_text(encoding="utf8")
        p.write_text(re.sub(rf"{re.escape(did)}(?![a-z0-9-])", cid, s), encoding="utf8")
    rm = [f"data/{did}.yaml"] + [f"content/{l}/{did}.md" for l in ("ar", "en", "ur") if (ROOT / f"content/{l}/{did}.md").exists()]
    subprocess.check_call(["git", "rm", "-q", "-f"] + rm, cwd=ROOT)
