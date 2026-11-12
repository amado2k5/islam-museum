#!/usr/bin/env python3
"""Tag existing records for the Islamic Economy Browser (one-off lane tool).

Adds `islamic-economy-browser` plus topic tags (`islamic-economy-money` /
`islamic-economy-sukuk` / `islamic-economy-waqf`) and section tags
(`islamic-economy-books`) to the tags list of each record, preserving existing
tags and the file's YAML formatting. Passage mentions are detected at build
time by scripts/islamic-economy.ts; this script only tags the curated layer.

Two passes:
  1. AUTO: every data/concept/*.yaml carrying the `trade-and-finance` theme
     joins with the money topic (minus EXCLUDE_TAF — object typologies that are
     not economics).
  2. TARGETS: explicit id -> extra tags for the waqf cluster, the
     deeds/instruments/covenants (sukuk) cluster, the covenant/treaty/waqf
     events, the Islamic-economics and numismatics works, the economic
     practices, the fiscal questions, the finance-standard groups, the market
     buildings/places/objects, and the two TAF-themed passages the detector
     may miss.

Usage: python3 scripts/tag-islamic-economy.py [--apply]
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DATA = REPO / "data"

BROWSER = "islamic-economy-browser"
MONEY = "islamic-economy-money"
SUKUK = "islamic-economy-sukuk"
WAQF = "islamic-economy-waqf"
BOOKS = "islamic-economy-books"

# trade-and-finance concepts that are object typologies, not economics.
EXCLUDE_TAF = {
    "concept/hedwig-glass",
}

# id -> extra tags to ensure (every id also gets BROWSER)
TARGETS = {
    # --- waqf / endowment cluster (concepts) ---
    "concept/waqf": [WAQF],
    "concept/waqf-fiqh": [WAQF],
    "concept/waqf-al-nasab-inda-maadd": [WAQF],
    "concept/habs": [WAQF],
    "concept/sadaqa-jariya": [WAQF],
    "concept/sadaqa": [WAQF],
    "concept/sadaqah": [WAQF],
    "concept/tasbil-endowment-term": [WAQF],
    "concept/nuzul-an-al-wazaif": [WAQF],
    "concept/sabil": [WAQF],
    "concept/sabil-kuttab": [WAQF],
    "concept/ibn-al-sabil": [WAQF],
    "concept/al-infaq-fi-sabil-allah": [WAQF],
    "concept/nazir": [WAQF],
    # --- deeds, instruments, covenants (sukuk) ---
    "concept/al-sakk-wal-hawala": [SUKUK, MONEY],
    "concept/written-instrument-sakk": [SUKUK, MONEY],
    "concept/hawala-debt-transfer": [SUKUK, MONEY],
    "concept/suftaja-in-islam": [SUKUK, MONEY],
    "concept/ahd": [SUKUK],
    "concept/hilf-alliance": [SUKUK],
    "concept/wasiyya-fiqh": [SUKUK],
    "concept/al-wasiyya": [SUKUK],
    "concept/kafala": [SUKUK],
    "concept/wilayat-al-ahd-fiqh": [SUKUK],
    "concept/mithaq-al-nabiyyin": [SUKUK],
    "concept/mithaq-bani-israil": [SUKUK],
    "concept/tacatti-exchange-by-deed": [SUKUK, MONEY],
    "concept/muqasama": [SUKUK, MONEY],
    "concept/bay-al-dayn": [SUKUK, MONEY],
    "concept/dayn-fiqh": [SUKUK, MONEY],
    # --- waqf events ---
    "event/waqf-haramayn-303": [WAQF],
    "event/dar-al-ilm-waqf-382": [WAQF],
    "event/mustansiriyya-founding": [WAQF],
    "event/zubayr-tomb-basra-386": [WAQF],
    # --- covenant, treaty, pledge, market and fiscal events (sukuk/money) ---
    "event/hilf-al-fudul": [SUKUK],
    "event/hilf-al-mutayyibin": [SUKUK],
    "event/treaty-of-hudaybiyya": [SUKUK],
    "event/treaty-of-hasan-and-muawiya": [SUKUK],
    "event/baya-wilayat-ahd-yazid": [SUKUK],
    "event/bayat-ibrahim-ibn-al-mahdi": [SUKUK],
    "event/treaty-of-ayla": [SUKUK],
    "event/treaty-of-ukaydir": [SUKUK],
    "event/treaty-with-taghlib": [SUKUK],
    "event/treaty-with-jarajima": [SUKUK],
    "event/treaty-with-samaritans": [SUKUK],
    "event/treaty-of-darabjird": [SUKUK],
    "event/mah-dinar-treaty": [SUKUK, MONEY],
    "event/treaty-of-babylon": [SUKUK],
    "event/hayyan-ispahbadh-treaty": [SUKUK],
    "event/treaty-crepy-1544": [SUKUK],
    "event/treaty-karlowitz-1110": [SUKUK],
    "event/treaty-kucuk-kaynarca-1187": [SUKUK],
    "event/treaty-passarowitz-1130": [SUKUK],
    "event/treaty-pruth-1123": [SUKUK],
    "event/treaty-szeged-848": [SUKUK],
    "event/treaty-of-adrianople-1125": [SUKUK],
    "event/treaty-of-tiflis": [SUKUK],
    "event/treaty-belgrade-1152": [SUKUK],
    "event/ali-market-rounds-kufa": [MONEY],
    "event/trade-journey-to-syria-for-khadija": [MONEY],
    "event/taj-al-din-kirman-hormuz-611": [MONEY],
    "event/said-bin-sultan-moves-capital-to-zanzibar": [MONEY],
    "event/ashras-jizya-episode": [MONEY],
    "event/dhimmi-dress-edict-429": [MONEY],
    "event/kharaj-milking-egypt": [MONEY],
    "event/umar-ii-jizya-exemption-converts": [MONEY],
    "event/ushr-kharaj-oscillation": [MONEY],
    "event/ali-prays-in-bayt-al-mal": [MONEY],
    # --- economics, numismatics and fiqh works (books section) ---
    "work/al-iqtisad-fi-al-fikr-al-islami": [BOOKS, MONEY],
    "work/al-iqtisad-fil-itiqad": [BOOKS, MONEY],
    "work/al-dawr-al-tawzii-li-l-milkiyya": [BOOKS, MONEY],
    "work/fi-hub-al-mustapha": [BOOKS, MONEY],
    "work/al-ayat-al-quraniyya-ala-al-maskukat": [BOOKS, MONEY],
    "work/al-islam-wal-manahij-al-ishtirakiyya": [BOOKS, MONEY],
    "work/iqtisaduna": [BOOKS, MONEY],
    "work/kitab-al-kharaj-abu-yusuf": [BOOKS, MONEY],
    "work/kitab-al-kharaj-qudama": [BOOKS, MONEY],
    "work/al-hisba-fi-al-islam": [BOOKS, MONEY],
    "work/maalim-al-qurba-fi-ahkam-al-hisba": [BOOKS, MONEY],
    "work/fiqh-hisab-ibn-munim": [BOOKS, MONEY],
    "work/ahkam-ahl-al-dhimmah": [BOOKS, MONEY],
    "work/ahkam-ahl-al-milal": [BOOKS, MONEY],
    "work/radd-al-muhtar": [BOOKS, MONEY],
    "work/kitab-al-masalik-wal-mamalik": [BOOKS, MONEY],
    "work/likaa-al-iman": [BOOKS, MONEY],
    "work/islamic-glass-in-the-making": [BOOKS, MONEY],
    "work/lavoix-catalogue-khalifes-orientaux": [BOOKS, MONEY],
    "work/fraehn-recensio-numorum-muhammedanorum": [BOOKS, MONEY],
    "work/nccah-islamic-coins-booklet": [BOOKS, MONEY],
    "work/xorazmshohlar-davri-tangalari": [BOOKS, MONEY],
    "work/kanz-umm-hajara-al-fiddi": [BOOKS, MONEY],
    "work/mudun-al-milh": [BOOKS, MONEY],
    "work/al-asbila-bi-makka-wa-al-madina": [BOOKS, WAQF],
    "work/waqfeya": [BOOKS, WAQF],
    # --- mosque-donation and finance fatwa works ---
    "work/fatwa-iifa-262-sharia-governance-in-islamic-finance": [BOOKS, MONEY],
    "work/fatwa-aliftaa-jo-a-buy-local-initiative": [BOOKS, MONEY],
    "work/fatwa-dar-alifta-intellectual-property-of-research-after-death": [BOOKS, MONEY],
    "work/fatwa-aliftaa-jo-zakat-for-maintaining-school-and-hospital-buildings": [BOOKS, WAQF],
    "work/fatwa-aliftaa-jo-mosque-donations-for-the-imams-rent": [BOOKS, WAQF],
    "work/fatwa-aliftaa-jo-helping-the-poor-from-mosque-donations": [BOOKS, WAQF],
    "work/fatwa-aliftaa-jo-mosque-committee-using-building-donations-for-car-hire": [BOOKS, WAQF],
    "work/fatwa-aliftaa-jo-spending-mosque-building-donations": [BOOKS, WAQF],
    "work/fatwa-dar-alifta-naming-a-mosque-after-its-donor": [BOOKS, WAQF],
    "work/fatwa-aliftaa-jo-selling-surplus-mosque-water-coolers": [BOOKS, WAQF],
    "work/fatwa-aliftaa-jo-duplicate-books-in-a-mosque-library": [BOOKS, WAQF],
    "work/fatwa-aliftaa-jo-moving-mosque-furnishings": [BOOKS, WAQF],
    "work/fatwa-aliftaa-jo-olive-trees-in-a-mosque-courtyard": [BOOKS, WAQF],
    # --- economic practices ---
    "practice/zakat": [MONEY],
    "practice/zakat-al-fitr": [MONEY],
    "practice/sadaqa": [WAQF],
    "practice/mahr": [MONEY],
    "practice/kaffarat-al-yamin": [MONEY],
    "practice/kafalat-al-yatim": [MONEY],
    # --- fiscal questions ---
    "question/shahadat-al-istithmar": [MONEY],
    "question/is-muzaraa-permitted": [MONEY],
    "question/financial-penalties-tazir-bil-mal": [MONEY],
    # --- Islamic-finance standard bodies ---
    "group/aaoifi": [MONEY],
    "group/ifsb": [MONEY],
    "group/itfc": [MONEY],
    "group/akhi-associations": [MONEY],
    # --- markets, the waqf souq, the pre-Islamic fair, the coin hoard ---
    "building/souq-waqif": [WAQF],
    "building/souq-al-hamidiyya": [MONEY],
    "building/bazaar-tabriz": [MONEY],
    "building/al-madina-souq": [MONEY],
    "building/khan-al-khalili": [MONEY],
    "place/dhu-al-majaz": [MONEY],
    "object/umm-hajara-hoard": [MONEY],
    # --- TAF-themed passages (topic chips come from the detector) ---
    "passage/abudawud-3383": [],
    "passage/muslim-1560": [],
}


def ensure_tags(text: str, additions: list[str]) -> tuple[str, bool]:
    """Return (new_text, changed). Adds BROWSER + additions to the tags list,
    preserving inline vs block style; inserts a `tags:` line after `kind:`/`class:`
    when the file has none."""
    lines = text.splitlines(keepends=True)

    for i, ln in enumerate(lines):
        if re.match(r"^tags:\s", ln) or ln.rstrip("\n") == "tags:":
            break
    else:
        ins = None
        for i, ln in enumerate(lines[:40]):
            if re.match(r"^(kind|class):", ln):
                ins = i + 1
        if ins is None:
            ins = 1
        add = "tags: [" + ", ".join([BROWSER] + additions) + "]\n"
        lines.insert(ins, add)
        return "".join(lines), True

    head = lines[i]
    inline = re.match(r"^tags:\s*\[(.*)\]\s*$", head.rstrip("\n"))
    if inline:
        existing = [t.strip().strip("'\"") for t in inline.group(1).split(",") if t.strip()]
        merged = existing[:]
        for t in [BROWSER] + additions:
            if t not in merged:
                merged.append(t)
        if merged == existing:
            return text, False
        lines[i] = "tags: [" + ", ".join(merged) + "]\n"
        return "".join(lines), True

    j = i + 1
    existing = []
    indent = "- "
    while j < len(lines) and re.match(r"^\s*-\s", lines[j]):
        m = re.match(r"^(\s*)-\s*(.*)$", lines[j].rstrip("\n"))
        indent = m.group(1) + "- "
        existing.append(m.group(2).strip().strip("'\""))
        j += 1
    merged = existing[:]
    added = []
    for t in [BROWSER] + additions:
        if t not in merged:
            merged.append(t)
            added.append(t)
    if not added:
        return text, False
    ins_at = j - 1 if existing else i
    newlines = [f"{indent}{t}\n" for t in added]
    lines[ins_at + 1 : ins_at + 1] = newlines
    return "".join(lines), True


def taf_concepts() -> list[str]:
    """Every data/concept/*.yaml carrying the trade-and-finance theme."""
    out = []
    for f in sorted((DATA / "concept").glob("*.yaml")):
        text = f.read_text(encoding="utf-8")
        if re.search(r"trade-and-finance", text):
            out.append(f"concept/{f.stem}")
    return out


def main():
    apply = "--apply" in sys.argv
    jobs: dict[str, list[str]] = {}
    for rid in taf_concepts():
        if rid not in EXCLUDE_TAF:
            jobs[rid] = jobs.get(rid, []) + [MONEY]
    for rid, tags in TARGETS.items():
        jobs.setdefault(rid, [])
        for t in tags:
            if t not in jobs[rid]:
                jobs[rid].append(t)

    changed = skipped = missing = 0
    for rid in sorted(jobs):
        cls, slug = rid.split("/", 1)
        f = DATA / cls / f"{slug}.yaml"
        if not f.exists():
            print(f"MISSING {rid} -> {f}")
            missing += 1
            continue
        text = f.read_text(encoding="utf-8")
        new, did = ensure_tags(text, jobs[rid])
        if did:
            changed += 1
            print(f"{'APPLY' if apply else 'WOULD'} {rid}: +{BROWSER}, +{','.join(jobs[rid])}")
            if apply:
                f.write_text(new, encoding="utf-8")
        else:
            skipped += 1
            print(f"SAME   {rid}")
    print(f"\n{changed} changed, {skipped} unchanged, {missing} missing")


if __name__ == "__main__":
    main()
