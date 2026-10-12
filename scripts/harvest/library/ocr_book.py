#!/usr/bin/env python3
"""Turn one PDF into per-page text for mining: the PDF's own text layer when it has one, Apple Vision OCR (ocrmac, Mac only) when it is a scan.

  uv run --quiet --with pymupdf --with ocrmac python ocr_book.py <pdf> [--out DIR] [--force-ocr] [--no-png]

Output (default $HARVEST/books/<cat>/<id>/<item>/): pages.json [{page, text, source: layer|ocr}], book.txt with '===== [pN] =====' markers,
pages-png/ (OCR'd pages only, for verifying doubtful passages), meta.json. Resumable per page. The text is a copyrighted-reference layer:
it stays in the harvest workspace and never enters git."""
import argparse, json, os, sys, time, unicodedata
from pathlib import Path
import pymupdf

ap = argparse.ArgumentParser(); ap.add_argument("pdf"); ap.add_argument("--out"); ap.add_argument("--force-ocr", action="store_true"); ap.add_argument("--no-png", action="store_true")
a = ap.parse_args()
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
pdf = Path(a.pdf).resolve()
rel = pdf.relative_to((HARVEST / "raw/library").resolve()) if (HARVEST / "raw/library").resolve() in pdf.parents else Path(pdf.stem + ".pdf")
out = Path(a.out) if a.out else HARVEST / "books" / rel.parent / rel.stem
out.mkdir(parents=True, exist_ok=True)
state = out / "pages.partial.json"
doc = pymupdf.open(pdf)
pages = json.loads(state.read_text()) if state.exists() else []
ocr = None
t0 = time.time()
for i in range(len(pages), doc.page_count):
    pno = i + 1; page = doc[i]
    text = "" if a.force_ocr else unicodedata.normalize("NFKC", page.get_text("text") or "").strip()   # NFKC folds Arabic presentation forms (ﺻﺤﻴﺢ) to plain letters
    if len(text) >= 40:
        pages.append({"page": pno, "text": text, "source": "layer"})
    else:
        if ocr is None:
            from ocrmac import ocrmac as ocr
        (out / "pages-png").mkdir(exist_ok=True); png = out / "pages-png" / f"p{pno:04d}.png"
        if not png.exists(): page.get_pixmap(dpi=200).save(str(png))
        res = ocr.OCR(str(png), language_preference=["ar-SA"], recognition_level="accurate").recognize()
        res = sorted(res, key=lambda r: (-r[2][1], -r[2][0]))   # top to bottom, right to left
        pages.append({"page": pno, "text": "\n".join(r[0] for r in res), "source": "ocr"})
        if a.no_png: png.unlink(missing_ok=True)
    if pno % 25 == 0:
        state.write_text(json.dumps(pages, ensure_ascii=False)); print(f"{pno}/{doc.page_count} {time.time()-t0:.0f}s", flush=True)
(out / "pages.json").write_text(json.dumps(pages, ensure_ascii=False))
(out / "book.txt").write_text("\n".join(f"\n\n===== [p{p['page']}] =====\n{p['text']}" for p in pages))
(out / "meta.json").write_text(json.dumps({"pdf": str(pdf), "pages": len(pages), "ocr_pages": sum(p["source"] == "ocr" for p in pages), "chars": sum(len(p["text"]) for p in pages)}))
state.unlink(missing_ok=True)
print("done", out, len(pages), "pages")
