#!/usr/bin/env python3
"""Run ocr_book.py over every PDF in the download manifest that has not been extracted yet (one at a time, resumable).
  ocr_all.py [--only BOOKID,...] [--cat hadith] [--max-pdf-mib 600]
Intended to run under: caffeinate -i uv run --quiet --with pymupdf --with ocrmac python ocr_all.py"""
import argparse, json, os, subprocess, sys
from pathlib import Path
ap = argparse.ArgumentParser(); ap.add_argument("--only"); ap.add_argument("--cat"); ap.add_argument("--max-pdf-mib", type=int, default=600); a = ap.parse_args()
H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
rows = [json.loads(l) for l in (H / "library/manifest.jsonl").read_text().splitlines() if l.strip()]
for r in rows:
    if r.get("status") != "file": continue
    if a.only and r["id"] not in a.only.split(","): continue
    if a.cat and r["cat"] != a.cat: continue
    pdf = H / r["file"]; out = H / "books" / r["cat"] / r["id"] / pdf.stem
    if (out / "pages.json").exists() or not pdf.exists() or pdf.stat().st_size > a.max_pdf_mib * 2**20: continue
    print("==", r["id"], pdf.name, flush=True)
    subprocess.call([sys.executable, str(Path(__file__).parent / "ocr_book.py"), str(pdf)])
