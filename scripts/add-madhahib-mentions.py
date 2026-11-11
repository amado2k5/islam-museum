#!/usr/bin/env python3
"""Add `mentions` edges from madhhab books to the schools/concepts they treat
(one-off lane tool for the Four Madhhabs browser, docs/plan/38).

Each work record gains `mentions` relations to the madhhab groups (and
`concept/madhhab` for the comparative works) its own text treats — the canonical
manuals of each school name their school throughout, and the comparative
encyclopedias and tabaqat works treat all four. The browser's shared detector
(scripts/madhahib.ts) then files each work under `dhikr` plus its school
section automatically, for this harvest and any future one.

The citation on each edge is the work's own first listed source (the edition or
reference the record already stands on). Existing mentions edges are kept; a
target already mentioned is skipped.

Usage: python3 scripts/add-madhahib-mentions.py [--apply]
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DATA = REPO / "data"

G = {
    "hanafi": "group/hanafi-madhhab",
    "maliki": "group/maliki-madhhab",
    "shafii": "group/shafii-madhhab",
    "hanbali": "group/hanbali-madhhab",
    "madhhab": "concept/madhhab",
}
FOUR = [G["hanafi"], G["maliki"], G["shafii"], G["hanbali"]]

# work slug -> mention targets
MENTIONS = {
    # Hanafi canonical literature
    "al-hidayah-marghinani": [G["hanafi"]],
    "al-mabsut-sarakhsi": [G["hanafi"]],
    "bidayat-al-mubtadi": [G["hanafi"]],
    "mukhtasar-al-tahawi": [G["hanafi"]],
    "sharh-maani-al-athar-tahawi": [G["hanafi"]],
    "al-binaya-sharh-al-hidaya": [G["hanafi"]],
    "al-inaya-sharh-al-hidaya": [G["hanafi"]],
    "nihayat-al-hidaya": [G["hanafi"]],
    "kafi-al-mubtadi": [G["hanafi"]],
    "al-fiqh-al-akbar": [G["hanafi"]],
    "al-fiqh-al-absat": [G["hanafi"]],
    "al-jami-al-saghir-fi-al-fiqh": [G["hanafi"]],
    # Maliki canonical literature
    "muwatta-malik": [G["maliki"]],
    "al-mudawwana-al-kubra": [G["maliki"]],
    "al-mudawwana-al-jamia": [G["maliki"]],
    "mukhtasar-khalil": [G["maliki"]],
    # Shafi'i canonical literature
    "al-risala-shafii": [G["shafii"]],
    "kitab-al-umm": [G["shafii"]],
    "minhaj-al-talibin-nawawi": [G["shafii"]],
    "matn-al-minhaj-fi-madhhab-al-shafii": [G["shafii"]],
    "al-tanbih-fi-al-fiqh-al-shafii": [G["shafii"]],
    "mukhtasar-al-muzani": [G["shafii"]],
    "mukhtasar-al-buwayti": [G["shafii"]],
    "mughni-al-muhtaj": [G["shafii"]],
    "al-majmu-sharh-al-muhadhdhab": [G["shafii"]],
    "al-muhadhdhab-fi-fiqh-al-shafii": [G["shafii"]],
    "al-muhadhdhab-fiqh-shafii": [G["shafii"]],
    "al-wasit-fil-madhhab": [G["shafii"]],
    "al-wajiz-fi-fiqh-al-shafii": [G["shafii"]],
    "al-lubab-fi-al-fiqh-al-shafii": [G["shafii"]],
    "al-hawi-al-kabir": [G["shafii"]],
    "al-tanqih-fi-sharh-al-wasit": [G["shafii"]],
    "tabaqat-al-fuqaha-al-shafiiyya": [G["shafii"]],
    "tabaqat-al-shafiiyya-al-kubra": [G["shafii"]],
    # Hanbali canonical literature
    "al-mughni": [G["hanbali"]],
    "al-muqni": [G["hanbali"]],
    "al-muqni-ibn-qudama": [G["hanbali"]],
    "al-kafi-ibn-qudama": [G["hanbali"]],
    "umdat-al-fiqh-ibn-qudama": [G["hanbali"]],
    "mukhtasar-al-sawaiq-al-mursala": [G["hanbali"]],
    "mukhtasar-al-kharaqi": [G["hanbali"]],
    "mukhtasar-al-khiraqi": [G["hanbali"]],
    "al-sharh-al-kabir-ala-al-muqni": [G["hanbali"]],
    "al-furu-fi-al-fiqh-al-hanbali": [G["hanbali"]],
    "majmu-al-fatawa": [G["hanbali"]],
    "tabaqat-al-hanabila": [G["hanbali"]],
    "dhayl-tabaqat-al-hanabila": [G["hanbali"]],
    "madkhal-ila-madhhab-ahmad": [G["hanbali"]],
    # Other schools' literature
    "al-muhalla-ibn-hazm": ["group/zahiri-madhhab"],
    "al-fisal-ibn-hazm": ["group/zahiri-madhhab"],
    "al-kafi": ["group/jafari-madhhab"],
    "gharaib-fiqhiyya-ind-al-shia-al-imamiyya": ["group/jafari-madhhab"],
    # Comparative literature — treats the madhhab and the four schools
    "bidayat-al-mujtahid": [G["madhhab"]] + FOUR,
    "al-mawsua-al-fiqhiyya": [G["madhhab"]] + FOUR,
    "al-mawsua-al-fiqhiyya-al-kuwaitiyya": [G["madhhab"]] + FOUR,
    "fatawa-aimmat-al-muslimin-subki": [G["madhhab"]] + FOUR,
    "al-mustasfa": [G["madhhab"]],
    "al-muwafaqat": [G["madhhab"]] + FOUR,
    "madkhal-al-shari-al-sharif-ala-al-madhahib": [G["madhhab"]] + FOUR,
}


def first_source(text: str) -> str | None:
    m = re.search(r"^sources:\s*\[([^\]]*)\]", text, re.M)
    if m:
        srcs = re.findall(r"source/[\w.-]+", m.group(1))
        return srcs[0] if srcs else None
    # block style: `sources:` then `- source/x` lines
    m = re.search(r"^sources:\s*\n((?:\s*-\s*source/[\w.-]+\s*\n?)+)", text, re.M)
    if m:
        srcs = re.findall(r"source/[\w.-]+", m.group(1))
        return srcs[0] if srcs else None
    return None


def add_mentions(text: str, targets: list[str], cite: str) -> tuple[str, list[str]]:
    lines = text.splitlines(keepends=True)
    have = set(re.findall(r"type:\s*mentions,\s*target:\s*([\w/-]+)", text))
    new = [t for t in targets if t not in have]
    if not new:
        return text, []
    items = "".join(f"  - {{ type: mentions, target: {t}, sources: [{cite}] }}\n" for t in new)
    # append inside an existing relations: block, right after the key line
    for i, ln in enumerate(lines):
        if ln.rstrip("\n") == "relations:":
            lines.insert(i + 1, items)
            return "".join(lines), new
    # no relations block: insert before provenance:, status: or at EOF
    block = "relations:\n" + items
    for key in ("provenance:", "status:", "kids:"):
        for i, ln in enumerate(lines):
            if ln.startswith(key):
                lines.insert(i, block)
                return "".join(lines), new
    lines.append("\n" + block)
    return "".join(lines), new


def main():
    apply = "--apply" in sys.argv
    changed = edges = skipped_files = 0
    for slug, targets in sorted(MENTIONS.items()):
        f = DATA / "work" / f"{slug}.yaml"
        if not f.exists():
            print(f"MISSING work/{slug}")
            continue
        text = f.read_text(encoding="utf-8")
        cite = first_source(text)
        if not cite:
            print(f"NO-SOURCE work/{slug} — skipped")
            skipped_files += 1
            continue
        new_text, added = add_mentions(text, targets, cite)
        if added:
            changed += 1
            edges += len(added)
            print(f"{'APPLY' if apply else 'WOULD'} work/{slug}: +mentions -> {', '.join(added)} [{cite}]")
            if apply:
                f.write_text(new_text, encoding="utf-8")
        else:
            print(f"SAME   work/{slug}")
    print(f"\n{changed} files, {edges} edges, {skipped_files} skipped")


if __name__ == "__main__":
    main()
