#!/usr/bin/env python3
"""Apple Vision OCR of every Encyclopaedia of Islam volume, every page (no text layer used).
Output: ~/islam-museum-harvest/books/encyclopaedia-of-islam-2/<stem>/{pages.json,book.txt,meta.json}
Resumable per page. Two-column reading order: full-width lines, then the left column, then the right column (English layout; ocr_book.py reads Arabic right-to-left columns).
Run: caffeinate -i uv run --quiet --with pymupdf --with ocrmac python ocr_ei2.py [stem ...]"""
import json, os, sys, time, unicodedata
from pathlib import Path
import pymupdf
from ocrmac import ocrmac

RAW = Path(os.path.expanduser("~/islam-museum-harvest/raw/library/encyclopaedia-of-islam-2"))
OUT = Path(os.path.expanduser("~/islam-museum-harvest/books/encyclopaedia-of-islam-2"))
TMP = Path(os.environ.get("TMPDIR", "/tmp")) / "ei2-ocr-png"; TMP.mkdir(parents=True, exist_ok=True)

def reading_order(res):
    cx = lambda b: b[0] + b[2] / 2
    narrow = [r for r in res if r[2][2] <= 0.55]
    left = [r for r in narrow if cx(r[2]) < 0.5]; right = [r for r in narrow if cx(r[2]) >= 0.5]
    if len(left) >= 8 and len(right) >= 8:
        wide = sorted([r for r in res if r[2][2] > 0.55], key=lambda r: -r[2][1])
        order = wide + sorted(left, key=lambda r: -r[2][1]) + sorted(right, key=lambda r: -r[2][1])  # English: left column first, then right
    else:
        order = sorted(res, key=lambda r: (-r[2][1], -r[2][0]))
    return "\n".join(r[0] for r in order)

only = set(sys.argv[1:])
for pdf in sorted(RAW.glob("*.pdf")):
    stem = pdf.stem
    if only and stem not in only: continue
    out = OUT / stem; out.mkdir(parents=True, exist_ok=True)
    if (out / "pages.json").exists(): print("skip", stem, flush=True); continue
    state = out / "pages.partial.json"
    pages = json.loads(state.read_text()) if state.exists() else []
    doc = pymupdf.open(pdf); t0 = time.time(); print("==", stem, doc.page_count, "pages", flush=True)
    for i in range(len(pages), doc.page_count):
        pno = i + 1; png = TMP / f"{stem}-p{pno:04d}.png"
        doc[i].get_pixmap(dpi=200).save(str(png))
        res = ocrmac.OCR(str(png), language_preference=["en-US"], recognition_level="accurate").recognize()
        png.unlink(missing_ok=True)
        pages.append({"page": pno, "text": unicodedata.normalize("NFC", reading_order(res)), "source": "ocr"})
        if pno % 25 == 0:
            state.write_text(json.dumps(pages, ensure_ascii=False))
            print(f"{stem} {pno}/{doc.page_count} {time.time()-t0:.0f}s", flush=True)
    (out / "pages.json").write_text(json.dumps(pages, ensure_ascii=False))
    (out / "book.txt").write_text("\n".join(f"\n\n===== [p{p['page']}] =====\n{p['text']}" for p in pages))
    (out / "meta.json").write_text(json.dumps({"pdf": str(pdf), "pages": len(pages), "ocr_pages": len(pages), "engine": "apple-vision en-US accurate", "chars": sum(len(p["text"]) for p in pages)}))
    state.unlink(missing_ok=True)
    print("done", stem, len(pages), "pages", f"{time.time()-t0:.0f}s", flush=True)
