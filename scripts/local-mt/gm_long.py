#!/usr/bin/env python3
"""Very long records through Google Gemini in the browser, in consecutive parts (founder's instruction, 19 November
2026: records over 5,000 words go to Gemini). One record is cut into parts of about --words English words at paragraph
boundaries; each part is a small Word file whose first paragraph is "#### <part> ####"; the answers are stored part by
part and the record is written only when every part is back and the whole passes the usual checks.

    gm_long.py next --lang es              build the next part to send (prints its file name), or "nothing left"
    gm_long.py add  --lang es --txt FILE   store Gemini's answer for the part just built
State lives in <home>/gm-long/<lang>/ (one JSON per record). Always from English."""
import argparse, io, json, os, re, sys, time, zipfile
from xml.sax.saxutils import escape

import yaml

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from translate import BROKEN, FIXED_HEADINGS, LEVELED, ROOT, check, protect, queue, restore  # noqa: E402

ap = argparse.ArgumentParser(); ap.add_argument("cmd", choices=["next", "add", "status"]); ap.add_argument("--lang", required=True, choices=["es", "fr"])
ap.add_argument("--words", type=int, default=8000); ap.add_argument("--min-record", type=int, default=5000); ap.add_argument("--txt", default="")
ap.add_argument("--home", default="/Volumes/exmicroSD/islam-museum-local-mt"); ap.add_argument("--up", default="")
a = ap.parse_args(); L = a.lang; D = f"{a.home}/gm-long/{L}"; os.makedirs(D, exist_ok=True)
split = lambda p: re.match(r"^---\n(.*?)\n---\n?(.*)$", open(p, encoding="utf-8").read(), re.S)
state_of = lambda i: f"{D}/{i.replace('/', '__')}.json"


def docx(paras, path):
    doc = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
           + "".join(f'<w:p><w:r><w:t xml:space="preserve">{escape(p)}</w:t></w:r></w:p>' for p in paras) + "</w:body></w:document>")
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        z.writestr("_rels/.rels", '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        z.writestr("word/document.xml", doc)


def plan(ident):
    """Cut a record into lines (fixed or to translate) and parts of about a.words words."""
    body = split(os.path.join(ROOT, "content", "en", ident + ".md")).group(2)
    lines, parts, cur, words = [], [], [], 0
    for line in body.split("\n"):
        if not line.strip() or line.strip() in (":::", ":::perspectives") or re.fullmatch(r"\s*[-|: ]+\s*", line) or not re.search(r"[A-Za-z]{2}", line):
            lines.append({"fixed": line}); continue
        m = re.match(r"^(#{1,6} |\s*(?:[-*]|\d+\.) +|> ?)(.*)$", line)
        prefix, text = (m.group(1), m.group(2)) if m else ("", line)
        src, kept, links = protect(text)
        lines.append({"prefix": prefix, "kept": kept, "links": links, "en": text, "src": src})
        w = len(text.split())
        if cur and words + w > a.words: parts.append(cur); cur, words = [], 0
        cur.append(len(lines) - 1); words += w
    if cur: parts.append(cur)
    return {"id": ident, "lines": lines, "parts": parts, "done": {}, "body": body}


def candidates():
    skip = set(l.strip() for l in open(f"{a.home}/fr-taken.txt", encoding="utf-8")) if L == "fr" and os.path.exists(f"{a.home}/fr-taken.txt") else set()
    for i in queue(L, [], skip):
        m = split(os.path.join(ROOT, "content", "en", i + ".md"))
        if m and not LEVELED.search(m.group(2)) and not BROKEN.search(m.group(2)) and len(m.group(2).split()) > a.min_record: yield i


def current():
    """The record in progress (a state file not finished), else the next candidate."""
    for f in sorted(os.listdir(D)):
        if f.endswith(".json"):
            st = json.load(open(f"{D}/{f}", encoding="utf-8"))
            if not st.get("finished") and not st.get("failed"): return st
    for i in candidates():
        if not os.path.exists(state_of(i)):
            st = plan(i); json.dump(st, open(state_of(i), "w", encoding="utf-8"), ensure_ascii=False); return st
    return None


def finish(st):
    out = []
    for n, l in enumerate(st["lines"]):
        if "fixed" in l: out.append(l["fixed"]); continue
        tr, head = st["tr"][str(n)], l["prefix"].startswith("#")
        if head and l["en"].strip() in FIXED_HEADINGS[L]: out.append(l["prefix"] + FIXED_HEADINGS[L][l["en"].strip()]); continue
        if "*" not in l["en"]: tr = tr.replace("*", "")
        done = restore(re.sub(r" {2,}", " ", tr).strip(), l["kept"], l["links"])
        if done is None: return f"markers lost in line {n}: {tr[:80]!r}"
        if L == "es": done = re.sub(r"\b([Ss])unitas\b", r"\1uníes", done); done = re.sub(r"\b([Ss])unita\b", r"\1uní", done)
        if head and not l["en"].endswith("."): done = done.rstrip(".")
        out.append(l["prefix"] + done)
    body = "\n".join(out); problem = check(st["body"], body, L)
    if problem: return problem
    ident = st["id"]; fm = yaml.safe_load(split(os.path.join(ROOT, "content", "en", ident + ".md")).group(1)); date = time.strftime("%Y-%m-%d")
    new = {"id": ident, "lang": L, "source_lang": "en", "translators": [f"Google Gemini (gemini.google.com, Task mode, model shown as Hydrogen, {date}; translated in {len(st['parts'])} consecutive parts), draft translation"]}
    for k, v in fm.items():
        if k not in ("id", "lang", "source_lang", "translators", "provenance", "translation_of"): new[k] = v
    new["provenance"] = {"generated_by": "scripts/local-mt/gm_long.py (spanish lane, Google Gemini in the browser, managed by Claude Code)", "model": "gemini (Hydrogen)", "run": f"gemini-long-{L}-{date}", "source": f"content/en/{ident}.md"}
    target = os.path.join(ROOT, "content", L, ident + ".md"); os.makedirs(os.path.dirname(target), exist_ok=True)
    text = "---\n" + yaml.safe_dump(new, allow_unicode=True, sort_keys=False, width=10000, default_flow_style=None).rstrip("\n") + "\n---\n" + body
    open(target, "w", encoding="utf-8").write(text if text.endswith("\n") else text + "\n"); return None


st = current()
if a.cmd == "status":
    for f in sorted(os.listdir(D)):
        if f.endswith(".json"):
            s = json.load(open(f"{D}/{f}", encoding="utf-8")); print(s["id"], f"{len(s['done'])}/{len(s['parts'])} parts", "finished" if s.get("finished") else s.get("failed", "in progress"))
    print("left to start:", sum(1 for i in candidates() if not os.path.exists(state_of(i)))); sys.exit(0)
if st is None: print("nothing left"); sys.exit(3)
k = next((n for n in range(len(st["parts"])) if str(n) not in st["done"]), None)
if a.cmd == "next":
    name = f"gml-{L}.docx"; path = f"{D}/{name}"
    docx([f"#### {k + 1} ####"] + [st["lines"][n]["src"] for n in st["parts"][k]], path)
    if a.up: open(os.path.join(a.up, name), "wb").write(open(path, "rb").read())
    print(f"{name}\t{st['id']}\tpart {k + 1} of {len(st['parts'])}\t{len(st['parts'][k])} paragraphs"); sys.exit(0)
got = [l.strip() for l in open(a.txt, encoding="utf-8").read().split("\n") if l.strip() and not l.strip().startswith("```") and not re.fullmatch(r"#{3,4}\s*\d+\s*#{3,4}", l.strip())]
want = st["parts"][k]
if len(got) != len(want): print(f"part {k + 1}: {len(got)} paragraphs came back, {len(want)} expected; not stored"); sys.exit(1)
st.setdefault("tr", {}); st["tr"].update({str(n): t for n, t in zip(want, got)}); st["done"][str(k)] = time.strftime("%H:%M:%S")
if len(st["done"]) == len(st["parts"]):
    problem = finish(st); st["finished" if not problem else "failed"] = problem or True
    print(f"{st['id']}: all {len(st['parts'])} parts back; " + ("WRITTEN" if not problem else f"NOT written: {problem}"))
else: print(f"{st['id']}: part {k + 1} of {len(st['parts'])} stored")
json.dump(st, open(state_of(st["id"]), "w", encoding="utf-8"), ensure_ascii=False)
