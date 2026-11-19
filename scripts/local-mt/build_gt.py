#!/usr/bin/env python3
"""Builds the next Word file of untranslated English prose for Google Translate (document translation).

    python3 scripts/local-mt/build_gt.py --lang es --dir /Volumes/exmicroSD/islam-museum-local-mt/gt --n 3

Plain text only: each record opens with a paragraph "#### n ####", then one Word paragraph per source line, with
citations and other spans that must survive hidden behind [[N]] markers and link labels wrapped as <xN>label</xN>.
Writes gt-<lang>-<nnn>-en.docx and gt-<lang>-<nnn>.json (the map scripts/local-mt/import_gt.py needs). Skips records
that already have a file in the language, the held records, and records Google's output already failed on.
"""
import argparse, io, json, os, re, sys, zipfile
from xml.sax.saxutils import escape

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from translate import BROKEN, LEVELED, ROOT, protect, queue  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("--lang", required=True, choices=["es", "fr", "both"], help="both: one file for the two languages (records missing in either)")
ap.add_argument("--dir", required=True)
ap.add_argument("--n", type=int, required=True, help="file number")
ap.add_argument("--bytes", type=int, default=990_000)
ap.add_argument("--taken", default="")
ap.add_argument("--failed", default="")
ap.add_argument("--home", default="/Volumes/exmicroSD/islam-museum-local-mt", help="for --lang both: where fr-taken.txt and logs/gt-<lang>.log.failed live")
ap.add_argument("--ids-file", default="", help="build from these ids (first column) instead of the queue")
ap.add_argument("--scheme", default="link", help="tags | num (10-digit numbers: 80… citation, 81…/82… link start/end) | link (numeric citations, link labels as Word hyperlinks); several, comma-separated, put each record in once per scheme (to compare them)")
ap.add_argument("--name", default="")
ap.add_argument("--src", default="en", choices=["en", "ar"], help="source language of the file (ar: comparison tests only; the lane translates from English)")
a = ap.parse_args()
skip = set()
for f in (a.taken, a.failed):
    if f and os.path.exists(f): skip |= set(l.split("\t")[0].strip() for l in open(f, encoding="utf-8"))


def docx_bytes(paras):
    doc = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
           + "".join(f"<w:p>{p}</w:p>" for p in paras) + "</w:body></w:document>")
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        z.writestr("_rels/.rels", '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        z.writestr("word/document.xml", doc)
    return buf.getvalue()


records, paras, sizes, words, est = [], [], [], 0, 0
def run(t): return f'<w:r><w:t xml:space="preserve">{escape(t)}</w:t></w:r>' if t else ""


def render(src, scheme):
    if scheme == "tags": return run(src)
    if scheme == "num": return run(numeric(src))
    src = re.sub(r"\[\[(\d+)\]\]", lambda m: f"({8000000000 + int(m.group(1))})", src)
    out, pos = "", 0
    for m in re.finditer(r"<x(\d+)>([^<]*)</x\1>", src):
        out += run(src[pos:m.start()]) + f'<w:hyperlink w:anchor="x{m.group(1)}">{run(m.group(2))}</w:hyperlink>'; pos = m.end()
    return out + run(src[pos:])


def numeric(src):
    src = re.sub(r"\[\[(\d+)\]\]", lambda m: f"({8000000000 + int(m.group(1))})", src)
    src = re.sub(r"<x(\d+)>", lambda m: f"{8100000000 + int(m.group(1))} ", src)
    return re.sub(r"</x(\d+)>", lambda m: f" {8200000000 + int(m.group(1))}", src)


if a.ids_file:
    seen, ids = set(), []
    for l in open(a.ids_file, encoding="utf-8"):
        i = l.split("\t")[0].strip()
        if i and i not in seen: seen.add(i); ids.append(i)
elif a.lang == "both":
    def ids_of(f): return set(l.split("\t")[0].strip() for l in open(f, encoding="utf-8")) if os.path.exists(f) else set()
    es = list(queue("es", [], ids_of(f"{a.home}/logs/gt-es.log.failed")))
    fr = set(queue("fr", [], ids_of(f"{a.home}/logs/gt-fr.log.failed") | ids_of(f"{a.home}/fr-taken.txt")))
    order = {i: n for n, i in enumerate(queue("fr", [], set()))}
    ids = sorted(set(es) | fr, key=lambda i: order.get(i, 10**9))
else:
    ids = queue(a.lang, [], skip)
for ident in ids:
    path = os.path.join(ROOT, "content", a.src, ident + ".md")
    if not os.path.exists(path): continue
    raw = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", raw, re.S)
    if not m: continue
    body = m.group(2)
    if LEVELED.search(body) or BROKEN.search(body): continue
    lines, srcs = [], []
    for line in body.split("\n"):
        if not line.strip() or line.strip() in (":::", ":::perspectives") or re.fullmatch(r"\s*[-|: ]+\s*", line) or not re.search(r"[A-Za-z]{2}" if a.src == "en" else r"[\u0621-\u064A]{2}", line):
            lines.append({"fixed": line}); continue
        mm = re.match(r"^(#{1,6} |\s*(?:[-*]|\d+\.) +|> ?)(.*)$", line)
        prefix, text = (mm.group(1), mm.group(2)) if mm else ("", line)
        src, kept, links = protect(text)
        lines.append({"prefix": prefix, "kept": kept, "links": links, "en": text}); srcs.append(src)
    for scheme in a.scheme.split(","):
        new = [run(f"#### {len(records) + 1} ####")] + [render(x, scheme) for x in srcs]
        est += sum(len(x.encode("utf-8")) for x in srcs) * 0.36
        records.append({"id": ident, "scheme": scheme, "src": a.src, "lines": lines}); paras += new; sizes.append(len(new)); words += len(body.split())
    if est > a.bytes * 1.05: break
data = docx_bytes(paras)
while len(data) > a.bytes and len(records) > 1:  # drop whole records from the end until the file fits
    for _ in range(max(1, len(records) // 100)):
        rec = records.pop(); paras = paras[:-sizes.pop()]; words -= sum(len(l.get("en", "").split()) for l in rec["lines"])
    data = docx_bytes(paras)
if not records: print("nothing left to build"); sys.exit(3)
os.makedirs(a.dir, exist_ok=True)
name = a.name or (f"gt-{a.n:03d}" if a.lang == "both" else f"gt-{a.lang}-{a.n:03d}")
open(os.path.join(a.dir, name + "-en.docx"), "wb").write(data)
json.dump(records, open(os.path.join(a.dir, name + ".json"), "w", encoding="utf-8"), ensure_ascii=False)
print(f"{name}\trecords {len(records)}\twords {words}\tbytes {len(data)}")
