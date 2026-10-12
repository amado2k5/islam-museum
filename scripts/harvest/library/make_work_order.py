#!/usr/bin/env python3
"""Compose the ready-to-paste Codex prompt for one book: common rules + category rules + this book's facts, paths and progress.

  make_work_order.py <book-id> [--out FILE]        e.g. make_work_order.py sahih-bukhari
  make_work_order.py --list                        books with extracted text, and their state
Paste the output into Codex (or save it with --out and point Codex at it)."""
import argparse, json, os, sys
from pathlib import Path
import yaml
sys.path.insert(0, str(Path(__file__).parent))
from idmap import MAP
ROOT = Path(__file__).resolve().parents[3]; H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
CODEX = ROOT / "docs/delegation/codex"
CAT = {"hadith": "hadith", "hadith-sciences": "hadith", "rijal": "hadith", "tafsir": "tafsir", "quran-sciences": "tafsir",
       "seerah": "seerah-tareekh", "shamail": "seerah-tareekh", "tareekh": "seerah-tareekh", "geography": "seerah-tareekh",
       "sahaba": "people", "sahabiyat": "people", "tabaqat": "people",
       "sunnah-aqeedah": "aqeedah-fiqh", "aqeedah": "aqeedah-fiqh", "fiqh": "aqeedah-fiqh", "usul": "aqeedah-fiqh", "adab-zuhd": "aqeedah-fiqh", "lugha": "aqeedah-fiqh"}
ap = argparse.ArgumentParser(); ap.add_argument("book", nargs="?"); ap.add_argument("--list", action="store_true"); ap.add_argument("--out"); a = ap.parse_args()
books = {b["id"]: b for b in yaml.safe_load((Path(__file__).parent / "books.yaml").read_text())["books"]}

def items(b):
    out = []
    for m in sorted((H / "books" / b["cat"] / b["id"]).glob("*/meta.json")):
        meta = json.loads(m.read_text()); out.append((m.parent.name, meta))
    return out

if a.list or not a.book:
    for b in books.values():
        it = items(b); prog = ROOT / "docs/delegation/library" / f"{b['id']}.md"
        if it: print(f"{b['id']:32} {b['cat']:16} {len(it)} copy(ies), {sum(m['pages'] for _, m in it):6} pages  {'in progress' if prog.exists() else 'not started'}")
    sys.exit(0)
b = books[a.book]; sid = MAP.get(b["id"], b["id"])
its = items(b); prog = ROOT / "docs/delegation/library" / f"{b['id']}.md"
copies = "\n".join(f"  - item `{n}`: {m['pages']} pages, {m['ocr_pages']} OCR'd, {m['chars']:,} characters  ->  ~/islam-museum-harvest/books/{b['cat']}/{b['id']}/{n}/" for n, m in its) or "  - NO EXTRACTED COPY YET: run `cd scripts/harvest/library && uv run --quiet --with pymupdf --with ocrmac python ocr_all.py --only " + b["id"] + "` first"
facts = f"""# WORK ORDER: {b['t']}  ({b['a'] or 'author not set'}{', d. ' + str(b['d']) + ' AH' if b['d'] else ''})
- book id: `{b['id']}`   category: `{b['cat']}`   source entity: `source/{sid}`   branch: `content/lib-{b['id']}`   progress file: `docs/delegation/library/{b['id']}.md`
- extracted copies:
{copies}
- progress so far: {'READ docs/delegation/library/' + b['id'] + '.md on main first and resume at its "next step"' if prog.exists() else 'nothing yet. Start with the introduction/biography of the author, then follow the category plan.'}
- first action: `git fetch origin && git log origin/main --oneline | grep lib-{b['id']}` to see whether a previous session already pushed batches; resume after them.
"""
text = "\n\n".join([(CODEX / "common.md").read_text(), (CODEX / f"{CAT[b['cat']]}.md").read_text(), facts])
if a.out: Path(a.out).write_text(text); print("wrote", a.out, len(text), "chars")
else: print(text)
