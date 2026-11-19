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
ap.add_argument("--lang", required=True, choices=["es", "fr"])
ap.add_argument("--dir", required=True)
ap.add_argument("--n", type=int, required=True, help="file number")
ap.add_argument("--bytes", type=int, default=990_000)
ap.add_argument("--taken", default="")
ap.add_argument("--failed", default="")
a = ap.parse_args()
skip = set()
for f in (a.taken, a.failed):
    if f and os.path.exists(f): skip |= set(l.split("\t")[0].strip() for l in open(f, encoding="utf-8"))


def docx_bytes(paras):
    doc = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
           + "".join(f'<w:p><w:r><w:t xml:space="preserve">{escape(p)}</w:t></w:r></w:p>' for p in paras) + "</w:body></w:document>")
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        z.writestr("_rels/.rels", '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        z.writestr("word/document.xml", doc)
    return buf.getvalue()


records, paras, sizes, words, est = [], [], [], 0, 0
for ident in queue(a.lang, [], skip):
    raw = open(os.path.join(ROOT, "content", "en", ident + ".md"), encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", raw, re.S)
    if not m: continue
    body = m.group(2)
    if LEVELED.search(body) or BROKEN.search(body): continue
    rec, new = {"id": ident, "lines": []}, [f"#### {len(records) + 1} ####"]
    for line in body.split("\n"):
        if not line.strip() or line.strip() in (":::", ":::perspectives") or re.fullmatch(r"\s*[-|: ]+\s*", line) or not re.search(r"[A-Za-z]{2}", line):
            rec["lines"].append({"fixed": line}); continue
        mm = re.match(r"^(#{1,6} |\s*(?:[-*]|\d+\.) +|> ?)(.*)$", line)
        prefix, text = (mm.group(1), mm.group(2)) if mm else ("", line)
        src, kept, links = protect(text)
        rec["lines"].append({"prefix": prefix, "kept": kept, "links": links, "en": text}); new.append(src)
    est += sum(len(p.encode("utf-8")) for p in new) * 0.36
    records.append(rec); paras += new; sizes.append(len(new)); words += len(body.split())
    if est > a.bytes * 1.05: break
data = docx_bytes(paras)
while len(data) > a.bytes and len(records) > 1:  # drop whole records from the end until the file fits
    for _ in range(max(1, len(records) // 100)):
        rec = records.pop(); paras = paras[:-sizes.pop()]; words -= sum(len(l.get("en", "").split()) for l in rec["lines"])
    data = docx_bytes(paras)
if not records: print("nothing left to build"); sys.exit(3)
os.makedirs(a.dir, exist_ok=True)
name = f"gt-{a.lang}-{a.n:03d}"
open(os.path.join(a.dir, name + "-en.docx"), "wb").write(data)
json.dump(records, open(os.path.join(a.dir, name + ".json"), "w", encoding="utf-8"), ensure_ascii=False)
print(f"{name}\trecords {len(records)}\twords {words}\tbytes {len(data)}")
