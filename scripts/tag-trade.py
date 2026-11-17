#!/usr/bin/env python3
"""Tag existing records for the Trade Browser (one-off lane tool).

Adds `trade-browser` plus topic tags (`trade-caravans` / `trade-silk-road` /
`trade-trade`) and a section tag (`trade-books`) to the tags list of each
record, preserving existing tags and the file's YAML formatting. Passage
mentions are detected at build time by scripts/trade.ts; this script only
tags the curated layer.

One pass — TARGETS: explicit id -> extra tags for the ilaf/caravan
cluster, the Silk Road cluster, and the trade/market/instrument cluster.
The broad trade-and-finance theme AUTO pass was tried and reverted (220
records, too many finance-only items); the curated layer stays a hand
list so the browser's scope — caravans, the Silk Road, Muslim trade —
is not diluted.

Usage: python3 scripts/tag-trade.py [--apply]
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DATA = REPO / "data"

BROWSER = "trade-browser"
CARAVANS = "trade-caravans"
SILK = "trade-silk-road"
TRADE = "trade-trade"
BOOKS = "trade-books"

# trade-and-finance concepts that are finance/money/regulation, not trade.
EXCLUDE_TAF = {
    "concept/hedwig-glass",
    "concept/silk-rulings",  # the silk *prohibition* fiqh ruling, not the road/trade
}

# id -> extra tags to ensure (every id also gets BROWSER)
TARGETS = {
    # --- the ilaf / caravan cluster ---
    "concept/ilaf": [CARAVANS, TRADE],
    "concept/quraysh-clan-offices": [CARAVANS],
    "event/hilf-al-fudul": [TRADE, CARAVANS],
    "event/hilf-al-mutayyibin": [TRADE, CARAVANS],
    "journey/syria-trade-with-abu-talib": [CARAVANS, TRADE],
    "journey/syria-trade-for-khadija": [CARAVANS, TRADE],
    "journey/darb-zubayda": [CARAVANS],
    "invention/caravanserai-network": [CARAVANS, TRADE],
    # --- the Silk Road cluster ---
    "journey/silk-road": [SILK, TRADE],
    "place/samarqand": [SILK],
    "place/bukhara": [SILK],
    "place/merv": [SILK],
    "place/nishapur": [SILK],
    "place/kashgar": [SILK],
    "place/xian": [SILK],
    "place/balkh": [SILK],
    "place/ferghana-valley": [SILK],
    "place/tashkent": [SILK],
    "place/transoxiana": [SILK],
    "invention/paper-mill-samarkand": [SILK],
    "object/mushaf-samarkand": [SILK],
    # --- the trade cluster: places on the caravan roads ---
    "place/mecca": [CARAVANS, TRADE],
    "place/taif": [CARAVANS],
    "place/sanaa": [CARAVANS],
    "place/aden": [CARAVANS],
    "place/petra": [CARAVANS],
    "place/gaza": [CARAVANS],
    "place/busra": [CARAVANS],
    "place/damascus": [CARAVANS],
    "place/baghdad": [SILK, TRADE],
    # --- the trade cluster: concepts, instruments, practices ---
    "concept/trade-in-islam": [TRADE],
    "concept/al-sakk-wal-hawala": [TRADE],
    "concept/hawala-debt-transfer": [TRADE],
    "concept/tacatti-exchange-by-deed": [TRADE],
    "concept/muqasama": [TRADE],
    "invention/hawala-transfer-system": [TRADE],
    "invention/mudaraba-commenda": [TRADE],
    "invention/sakk-cheque": [TRADE],
    "invention/tiraz": [TRADE, SILK],
}

def tags_of(text: str):
    m = re.search(r"^tags:\s*\[([^\]]*)\]", text, re.M)
    if m:
        return [t.strip() for t in m.group(1).split(",") if t.strip()], m
    m = re.search(r"^tags:\s*\n((?:\s*-\s*\S+\n)+)", text, re.M)
    if m:
        return re.findall(r"-\s*(\S+)", m.group(1)), m
    return [], None

def ensure_tags(path: Path, extra):
    text = path.read_text()
    tags, _ = tags_of(text)
    want = sorted(set(tags) | {BROWSER, *extra})
    if set(tags) == set(want):
        return False
    joined = ", ".join(want)
    if re.search(r"^tags:\s*\[", text, re.M):
        text = re.sub(r"^tags:\s*\[[^\]]*\]", f"tags: [{joined}]", text, count=1, flags=re.M)
    elif re.search(r"^tags:\s*\n", text, re.M):
        text = re.sub(r"^tags:\s*\n(?:\s*-\s*\S+\n)+", f"tags: [{joined}]\n", text, count=1, flags=re.M)
    elif re.search(r"^class:", text, re.M):
        text = re.sub(r"^(class:.*\n)", r"\1" + f"tags: [{joined}]\n", text, count=1, flags=re.M)
    else:
        text = re.sub(r"^(id:.*\n)", r"\1" + f"tags: [{joined}]\n", text, count=1, flags=re.M)
    path.write_text(text)
    return True

def main():
    apply = "--apply" in sys.argv
    changed = []
    # TARGETS pass
    for rid, extra in TARGETS.items():
        cls, slug = rid.split("/", 1)
        p = DATA / cls / f"{slug}.yaml"
        if not p.exists():
            print(f"  ! missing {rid}")
            continue
        if ensure_tags(p, extra):
            changed.append(rid)
    print(f"{len(changed)} records tagged" + (" (applied)" if apply else " (dry run — pass --apply)"))
    for c in changed:
        print("  +", c)
    if not apply:
        sys.exit(0)

if __name__ == "__main__":
    main()
