"""Count library PDFs on the harvest drive that have no OCR output yet (docs/delegation/microsd-ocr-status.md).

Usage: python3 scripts/harvest/ocr_status.py [--list out.txt]
Reads only metadata and file names; no PDF is opened and nothing is written unless --list is given.
Stdlib only, so it runs under any Python 3.
"""
import argparse, collections, glob, json, os, unicodedata
from pathlib import Path

HARVEST = Path(os.environ.get("HARVEST", "/Volumes/exmicroSD/islam-museum-harvest"))
RAW = HARVEST / "raw" / "library"
BOOKS = HARVEST / "books"
OCR = HARVEST / "ocr"


def nfc(name: str) -> str:
    # Arabic file names are stored in mixed Unicode normal forms; compare in NFC or ~100 matches fail.
    return unicodedata.normalize("NFC", name).strip()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", help="write the PDFs with no OCR output, one relative path per line")
    args = ap.parse_args()

    if not RAW.is_dir():
        raise SystemExit(f"{RAW} not found: is the drive mounted?")

    pdfs = sorted(os.path.relpath(p, HARVEST) for p in glob.glob(f"{RAW}/**/*.pdf", recursive=True))

    # Metadata keyed by PDF basename (NFC). Some meta "pdf" values are truncated at spaces, so the
    # mirror path below is the fallback. Only meta.json files are read; the glob stops at books/.
    by_base = {}
    for m in glob.glob(f"{BOOKS}/**/meta.json", recursive=True):
        d = json.load(open(m, encoding="utf-8"))
        base = nfc(os.path.basename(d.get("pdf", "")))
        if base:
            by_base.setdefault(base, d)

    ocr_dirs = {}
    for sub in OCR.iterdir() if OCR.is_dir() else []:
        if sub.is_dir():
            ocr_dirs[sub.name] = {nfc(f.stem) for f in sub.glob("*.txt")}

    counts = collections.Counter()
    left = []
    for rel in pdfs:
        stem_rel = rel[len("raw/library/"):-len(".pdf")]
        base = nfc(os.path.basename(rel))
        meta = by_base.get(base)
        if meta is None:
            mirror = BOOKS / stem_rel / "meta.json"
            if mirror.exists():
                meta = json.load(open(mirror, encoding="utf-8"))
        if meta is None:
            # Not in a book folder: maybe OCR'd into ocr/<category>/<name>.txt (al-azhar-magmaa, ali-ibn-abi-talib).
            category = rel.split("/")[2]
            if nfc(os.path.basename(rel)[:-4]) in ocr_dirs.get(category, set()):
                counts["OCR in ocr/ folder"] += 1
                continue
            if (BOOKS / stem_rel / "book.txt").exists():
                counts["OCR in mirror folder"] += 1
                continue
            counts["no record, no OCR"] += 1
            left.append(rel)
            continue
        # Done = the run wrote one entry per PDF page. ocr_pages alone is wrong: pages with a text layer are
        # taken from the layer, not OCR'd, and a scan can contain genuinely blank pages.
        pages = meta.get("pages") or 0
        pages_json = BOOKS / stem_rel / "pages.json"
        covered = 0
        if pages_json.exists():
            entries = json.load(open(pages_json, encoding="utf-8"))
            covered = len(entries)
            if any(not e.get("text", "").strip() for e in entries):
                counts["done, some blank pages"] += 1
        if pages and covered >= pages:
            counts["OCR complete"] += 1
        elif covered == 0:
            counts["not run"] += 1
            left.append(rel)
        else:
            counts["partly OCR'd"] += 1
            left.append(rel)

    print(f"PDFs in raw/library: {len(pdfs)}")
    for key, n in sorted(counts.items()):
        print(f"  {key}: {n}")
    print(f"Not OCR'd at all: {counts['no record, no OCR'] + counts['not run']}")
    print("Partly OCR'd:", counts["partly OCR'd"])

    if args.list:
        Path(args.list).write_text("\n".join(left) + "\n", encoding="utf-8")
        print(f"wrote {len(left)} paths to {args.list}")


if __name__ == "__main__":
    main()
