#!/usr/bin/env python3
"""Column-aware OCR of single pages: python ocr_page.py PDF PAGE [PAGE...] ; prints right column then left column (Arabic two-column dictionaries)."""
import sys, pymupdf, tempfile, os, re, unicodedata
from ocrmac import ocrmac
pdf=sys.argv[1]; doc=pymupdf.open(pdf)
def parse(args):
    for a in args:
        if "-" in a: x,y=a.split("-"); yield from range(int(x),int(y)+1)
        else: yield int(a)
CACHE=os.path.expanduser("~/islam-museum-harvest/books/colocr/"+os.path.basename(pdf)[:-4]); os.makedirs(CACHE,exist_ok=True)
for pno in parse(sys.argv[2:]):
    cf=f"{CACHE}/p{pno:04d}.txt"
    if os.path.exists(cf): print(open(cf).read()); continue
    png=f"/tmp/ocrpage-{os.getpid()}-{pno}.png"; doc[pno-1].get_pixmap(dpi=220).save(png)
    res=ocrmac.OCR(png, language_preference=["ar-SA"], recognition_level="accurate").recognize()
    os.remove(png)
    boxes=[(t,c,b) for t,c,b in res]
    if not boxes: print(f"[p{pno}] (empty)"); continue
    wide=[b for t,c,b in boxes if b[2]>0.55]
    cx=lambda b: b[0]+b[2]/2
    left=[x for x in boxes if cx(x[2])<0.5 and x[2][2]<=0.55]; right=[x for x in boxes if cx(x[2])>=0.5 and x[2][2]<=0.55]
    two = len(left)>=8 and len(right)>=8
    if two:
        # full-width lines (headers/footers) first by y, then right column, then left column
        top=sorted([x for x in boxes if x[2][2]>0.55], key=lambda x:-x[2][1])
        r=sorted(right,key=lambda x:-x[2][1]); l=sorted(left,key=lambda x:-x[2][1])
        lines=[x[0] for x in top]+[x[0] for x in r]+["  ||| (left column)"]+[x[0] for x in l]
    else:
        lines=[x[0] for x in sorted(boxes,key=lambda x:(-x[2][1],-x[2][0]))]
    out=f"[p{pno}] two_columns={two}\n"+"\n".join(lines)+"\n"; open(cf,"w").write(out); print(out)
