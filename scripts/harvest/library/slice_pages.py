#!/usr/bin/env python3
"""Print a page range of an extracted book with page markers, to feed a mining session.
  slice_pages.py <cat>/<book-id>/<item> START END     (item = the PDF's archive.org identifier)
Pages are PDF pages; many scans carry an offset to the printed page: find it on the page images and record it in the claim."""
import json, os, sys
from pathlib import Path
H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
d = H / "books" / sys.argv[1]; s, e = int(sys.argv[2]), int(sys.argv[3])
for p in json.loads((d / "pages.json").read_text()):
    if s <= p["page"] <= e: print(f"\n===== [p{p['page']}] =====\n{p['text']}")
