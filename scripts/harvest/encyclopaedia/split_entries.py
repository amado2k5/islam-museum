#!/usr/bin/env python3
"""Split one volume of the Encyclopaedia of Islam (2nd ed.) into entries, from its Apple Vision OCR.

  python split_entries.py <volume-dir> [--out FILE]

<volume-dir> is ~/islam-museum-harvest/books/encyclopaedia-of-islam-2/<stem>/ (pages.json from ocr_ei2.py).
An EI2 entry starts with its headword in capitals at the start of a line, followed by a comma or a bracket
("ABADAH, a small town", "ABAKA [see ILKHANS]"), and ends with the author's signature line in capitals
("(V. MINORSKY)"). A headword followed by "[see ...]" and nothing else is a cross-reference and becomes an alias.
Output: JSON lines {headword, cross_ref, page_start, page_end, author, text}; text keeps "[pN]" page markers.
The output is harvest material: it stays outside git."""
import argparse, json, re, sys
from pathlib import Path

HEAD = re.compile(r"^(?P<h>[A-Z][A-Z0-9À-ÝĀ-ſḀ-ỿ'ʻʿ’\-]+(?: [A-Z0-9À-ÝĀ-ſḀ-ỿ'ʻʿ’\-]+)*)(?=,\s|\s*\[)")
# journal and series abbreviations that open bibliography lines, not entries
STOP = {"RSO", "MIFAO", "WZKM", "BIFAO", "GMS", "BGA", "TBG", "JA", "JRAS", "ZDMG", "IBLA", "REI", "GAL", "SBAW", "MMAF", "ZA"}
SIGN = re.compile(r"^\((?P<a>[A-Z][A-Z\.\s'’\-]{2,})\)\s*$")

def split(pages):
    entries, cur = [], None
    for pg in pages:
        for line in pg["text"].split("\n"):
            line = line.strip()
            if not line:
                continue
            m = HEAD.match(line)
            letters = re.sub(r"[^A-Za-z]", "", m.group("h")) if m else ""
            if m and len(letters) >= 4 and m.group('h').split()[0] not in STOP and m.group('h') not in STOP:
                if cur and cur["open"]:
                    cur["page_end"] = pg["page"]; entries.append(cur)  # no signature found: close it, flagged below
                    cur["author"] = None
                head = m.group("h").strip(); rest = line[len(m.group("h")):].strip()
                xref = bool(re.match(r"^\[see\b", rest, re.I)) and len(rest) < 80
                cur = {"headword": head, "cross_ref": xref, "page_start": pg["page"], "page_end": pg["page"],
                       "author": None, "text": f"[p{pg['page']}] {line}", "open": not xref}
                if xref:
                    entries.append(cur); cur = None
                continue
            if cur is None:
                continue
            s = SIGN.match(line)
            if s:
                cur["author"] = s.group("a"); cur["page_end"] = pg["page"]; cur["text"] += f"\n{line}"
                cur["open"] = False; entries.append(cur); cur = None
                continue
            cur["text"] += ("\n" if not cur["text"].endswith("\n") else "") + line
            cur["page_end"] = pg["page"]
    if cur:
        entries.append(cur)
    for e in entries:
        e.pop("open", None)
    return entries

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("volume_dir"); ap.add_argument("--out"); a = ap.parse_args()
    d = Path(a.volume_dir); pages = json.loads((d / "pages.json").read_text() if (d / "pages.json").exists() else (d / "pages.partial.json").read_text())
    out = Path(a.out) if a.out else d / "entries.jsonl"
    rows = split(pages)
    with out.open("w") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"{len(rows)} records, {sum(1 for r in rows if r['cross_ref'])} cross-references, "
          f"{sum(1 for r in rows if not r['cross_ref'] and not r['author'])} without signature -> {out}", file=sys.stderr)
