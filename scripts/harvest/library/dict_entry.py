#!/usr/bin/env python3
"""Find and read one entry of a dictionary-style book (al-Isaba, Usd al-Ghaba, al-Isti'ab, Tahdhib, Siyar…) whose entries start with a running number.

  dict_entry.py find <cat>/<book-id>/<item> "<name prefix>"        list candidate headings (page, number, heading) from the extracted pages
  dict_entry.py read <cat>/<book-id>/<item> <page> "<regex>" [N]   re-read pages page..page+3 with column-aware OCR (cached) and print the entry whose
                                                                    heading (after the number) matches the regex, up to N characters (default 2600)

Needs the extracted copy (`ocr_all.py`) and, for `read`, `uv` with pymupdf and ocrmac (macOS). Everything stays in the harvest workspace; nothing is written to git.
The old per-page text may interleave the two columns, so use `find` only to locate the page and always read the entry with `read`. Names in headings are
normalised (diacritics, hamza, ta marbuta) for `find`; the regex in `read` is applied to the heading with diacritics removed."""
import json, os, re, subprocess, sys
from pathlib import Path

H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
DIAC = re.compile("[ً-ٰٟـ]")
def norm(s):
    s = DIAC.sub("", s or "")
    for a, b in (("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ى", "ي"), ("ة", "ه"), ("ؤ", "و"), ("ئ", "ي")): s = s.replace(a, b)
    return re.sub(r"\s+", " ", s).strip()
HEAD = re.compile(r"([٠-٩]{3,6})\s*-\s*(?:\([^)]*\)\s*)?([^٠-٩:]{3,70})")

def find(path, prefix):
    pages = json.loads((H / "books" / path / "pages.json").read_text()); k = norm(prefix); n = 0
    for p in pages:
        for m in HEAD.finditer(p["text"]):
            name = norm(m.group(2))
            if name.startswith(k):
                print(f"p{p['page']:>5}  #{m.group(1)}  {name[:70]}"); n += 1
    if not n: print("no heading found; try a shorter prefix or search book.txt")

def read(path, page, pattern, limit=2600):
    d = H / "books" / path; meta = json.loads((d / "meta.json").read_text())
    cache = H / "books" / "colocr" / Path(meta["pdf"]).stem
    pages = list(range(page, page + 4))
    if not all((cache / f"p{p:04d}.txt").exists() for p in pages):
        subprocess.run(["uv", "run", "--quiet", "--with", "pymupdf", "--with", "ocrmac", "python", str(Path(__file__).with_name("ocr_page.py")), meta["pdf"], f"{page}-{page+3}"], stdout=subprocess.DEVNULL, check=True)
    txt = ""
    for p in pages:
        f = cache / f"p{p:04d}.txt"
        if f.exists(): txt += f"\n⟦p{p}⟧\n" + f.read_text().split("\n", 1)[1]
    heading = re.compile(r"\n[٠-٩\d]{3,6}\s*[-–—]\s")
    for m in heading.finditer(txt):
        line = txt[m.start() + 1:].split("\n")[0]
        if re.search(pattern, re.sub(r"^[٠-٩\d]+\s*[-–—]\s*", "", DIAC.sub("", line))):
            nxt = heading.search(txt, m.end()); end = nxt.start() if nxt else len(txt)
            print(txt[m.start() + 1:end][:limit]); return
    print("NOT FOUND on these pages:", pattern)

if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) >= 3 and a[0] == "find": find(a[1], a[2])
    elif len(a) >= 4 and a[0] == "read": read(a[1], int(a[2]), a[3], int(a[4]) if len(a) > 4 else 2600)
    else: print(__doc__)
