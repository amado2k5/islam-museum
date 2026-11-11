#!/usr/bin/env python3
"""Tag existing records for the Four Madhhabs browser (one-off lane tool).

Adds `madhahib-browser` plus section tags (mh-aima / mh-hanafi / mh-maliki /
mh-shafii / mh-hanbali / mh-ukhra / mh-salaf / mh-kutub / mh-mafahim / mh-dhikr)
to the tags list of each record, preserving existing tags and the file's YAML
formatting. Membership is computed at build time by scripts/madhahib.ts; a
record with a forward `mentions` edge to a madhhab target joins `dhikr` (and
the school section) without any tag.

Usage: python3 scripts/tag-madhahib.py [--apply]
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DATA = REPO / "data"

BROWSER = "madhahib-browser"

# id -> section tags to ensure (all get BROWSER + these)
TARGETS = {
    # --- the four school groups ---
    "group/hanafi-madhhab": ["mh-hanafi"],
    "group/maliki-madhhab": ["mh-maliki"],
    "group/shafii-madhhab": ["mh-shafii"],
    "group/hanbali-madhhab": ["mh-hanbali"],
    # --- other schools, labelled ---
    "group/zahiri-madhhab": ["mh-ukhra"],
    "group/jafari-madhhab": ["mh-ukhra"],
    "group/ibadiyya": ["mh-ukhra"],
    # --- the four imams + the other schools' founders ---
    "person/abu-hanifa": ["mh-aima", "mh-hanafi"],
    "person/malik-ibn-anas": ["mh-aima", "mh-maliki"],
    "person/al-shafii": ["mh-aima", "mh-shafii"],
    "person/ahmad-ibn-hanbal": ["mh-aima", "mh-hanbali"],
    "person/dawud-al-zahiri": ["mh-ukhra"],
    "person/jafar-al-sadiq": ["mh-ukhra"],
    "person/abdallah-ibn-ibad": ["mh-ukhra"],
    "person/ibn-hazm": ["mh-ukhra"],
    "person/al-kulayni": ["mh-ukhra"],
    # --- the salaf and formative generation ---
    "person/ibrahim-al-nakhai": ["mh-salaf"],
    "person/al-hasan-al-basri": ["mh-salaf"],
    "person/sufyan-al-thawri": ["mh-salaf"],
    "person/al-awzai-abd-al-rahman": ["mh-salaf"],
    "person/muhammad-ibn-sirin": ["mh-salaf"],
    "person/muhammad-ibn-shihab-al-zuhri": ["mh-salaf"],
    "person/sufyan-ibn-uyayna": ["mh-salaf"],
    "person/qatada-ibn-diama": ["mh-salaf"],
    "person/abu-al-qasim-al-shabi": ["mh-salaf"],
    "person/waki-ibn-al-jarrah": ["mh-salaf"],
    "person/al-amash-sulayman-ibn-mihran": ["mh-salaf"],
    "person/muqatil-ibn-sulayman": ["mh-salaf"],
    "person/hammad-ibn-abi-hanifa": ["mh-salaf", "mh-hanafi"],
    "person/abu-yusuf-al-qadi": ["mh-salaf", "mh-hanafi"],
    "person/zufar-ibn-al-hudhayl": ["mh-salaf", "mh-hanafi"],
    "person/layth-ibn-sad": ["mh-salaf", "mh-maliki"],
    "person/abd-al-rahman-ibn-al-qasim": ["mh-salaf", "mh-maliki"],
    "person/abdallah-ibn-wahb-al-misri": ["mh-salaf", "mh-maliki"],
    "person/al-rabi-ibn-sulayman-al-muradi": ["mh-salaf", "mh-shafii"],
    "person/isa-ibn-aban": ["mh-salaf", "mh-hanafi"],
    "person/hafs-ibn-ghiyath": ["mh-salaf", "mh-hanafi"],
    "person/umar-ibn-husayn-al-khiraqi": ["mh-salaf", "mh-hanbali"],
    # --- Hanafi scholars and books ---
    "person/ibn-abidin": ["mh-hanafi"],
    "person/ala-al-din-al-kasani": ["mh-hanafi"],
    "person/shams-al-aimma-al-sarakhsi": ["mh-hanafi"],
    "work/al-hidayah-marghinani": ["mh-hanafi", "mh-kutub"],
    "work/bidayat-al-mubtadi": ["mh-hanafi", "mh-kutub"],
    "work/mukhtasar-al-tahawi": ["mh-hanafi", "mh-kutub"],
    "work/kafi-al-mubtadi": ["mh-hanafi", "mh-kutub"],
    # --- Maliki scholars and books ---
    "person/ibn-rushd": ["mh-maliki"],
    "person/ibn-rushd-al-jadd": ["mh-maliki"],
    "person/al-dardir": ["mh-maliki"],
    "work/muwatta-malik": ["mh-maliki", "mh-kutub"],
    "work/al-mudawwana-al-kubra": ["mh-maliki", "mh-kutub"],
    "work/al-mudawwana-al-jamia": ["mh-maliki", "mh-kutub"],
    "work/mukhtasar-khalil": ["mh-maliki", "mh-kutub"],
    # --- Shafi'i scholars and books ---
    "person/al-zafarani": ["mh-shafii"],
    "person/al-nawawi": ["mh-shafii"],
    "person/al-rafii-al-qazwini": ["mh-shafii"],
    "person/ibn-hajar-al-asqalani": ["mh-shafii"],
    "person/taqi-al-din-al-subki": ["mh-shafii"],
    "work/al-risala-shafii": ["mh-shafii", "mh-kutub"],
    "work/kitab-al-umm": ["mh-shafii", "mh-kutub"],
    "work/minhaj-al-talibin-nawawi": ["mh-shafii", "mh-kutub"],
    "work/matn-al-minhaj-fi-madhhab-al-shafii": ["mh-shafii", "mh-kutub"],
    "work/al-tanbih-fi-al-fiqh-al-shafii": ["mh-shafii", "mh-kutub"],
    "work/mukhtasar-al-muzani": ["mh-shafii", "mh-kutub"],
    "work/mukhtasar-al-buwayti": ["mh-shafii", "mh-kutub"],
    "work/mughni-al-muhtaj": ["mh-shafii", "mh-kutub"],
    # --- Hanbali scholars and books ---
    "person/ibn-qudama-al-maqdisi": ["mh-hanbali"],
    "person/ibn-taymiyya": ["mh-hanbali"],
    "person/ibn-rajab": ["mh-hanbali"],
    "person/al-buhuti-mansur-ibn-yunus": ["mh-hanbali"],
    "work/al-mughni": ["mh-hanbali", "mh-kutub"],
    "work/al-muqni": ["mh-hanbali", "mh-kutub"],
    "work/al-muqni-ibn-qudama": ["mh-hanbali", "mh-kutub"],
    "work/al-kafi-ibn-qudama": ["mh-hanbali", "mh-kutub"],
    "work/mukhtasar-al-sawaiq-al-mursala": ["mh-hanbali", "mh-kutub"],
    "work/mukhtasar-al-kharaqi": ["mh-hanbali", "mh-kutub"],
    "work/mukhtasar-al-khiraqi": ["mh-hanbali", "mh-kutub"],
    "work/al-sharh-al-kabir-ala-al-muqni": ["mh-hanbali", "mh-kutub"],
    "work/al-furu-fi-al-fiqh-al-hanbali": ["mh-hanbali", "mh-kutub"],
    # --- other schools' literature ---
    "work/al-muhalla-ibn-hazm": ["mh-ukhra", "mh-kutub"],
    "work/al-fisal-ibn-hazm": ["mh-ukhra", "mh-kutub"],
    "work/al-kafi": ["mh-ukhra", "mh-kutub"],
    # --- comparative literature and histories of the schools ---
    "work/bidayat-al-mujtahid": ["mh-kutub"],
    "work/al-mustasfa": ["mh-kutub"],
    "work/al-muwafaqat": ["mh-kutub"],
    "work/tabaqat-fuqaha": ["mh-kutub"],
    "work/tabaqat-al-fuqaha-al-shafiiyya": ["mh-shafii", "mh-kutub"],
    "work/tabaqat-al-shafiiyya-al-kubra": ["mh-shafii", "mh-kutub"],
    "work/tabaqat-al-hanabila": ["mh-hanbali", "mh-kutub"],
    "work/dhayl-tabaqat-al-hanabila": ["mh-hanbali", "mh-kutub"],
    "work/madkhal-al-shari-al-sharif-ala-al-madhahib": ["mh-kutub"],
    "work/madkhal-ila-madhhab-ahmad": ["mh-hanbali", "mh-kutub"],
    # --- second wave: formative students and later school scholars ---
    "person/muhammad-ibn-al-hasan-al-shaybani": ["mh-salaf", "mh-hanafi"],
    "person/al-quduri": ["mh-salaf", "mh-hanafi"],
    "person/ibn-al-humam": ["mh-hanafi"],
    "person/al-tahawi": ["mh-hanafi"],
    "person/al-jassas": ["mh-hanafi"],
    "person/al-muzani": ["mh-salaf", "mh-shafii"],
    "person/al-buwayti": ["mh-salaf", "mh-shafii"],
    "person/al-ghazali-abu-hamid": ["mh-shafii"],
    "person/al-mawardi": ["mh-shafii"],
    "person/abu-ishaq-al-shatibi": ["mh-maliki"],
    "person/abu-ishaq-al-shirazi": ["mh-shafii"],
    "person/al-shirazi-faqih": ["mh-shafii"],
    # --- second wave: more canonical and school books ---
    "work/al-majmu-sharh-al-muhadhdhab": ["mh-shafii", "mh-kutub"],
    "work/majmu-al-fatawa": ["mh-hanbali", "mh-kutub"],
    "work/al-fiqh-al-akbar": ["mh-hanafi", "mh-kutub"],
    "work/al-fiqh-al-absat": ["mh-hanafi", "mh-kutub"],
    "work/al-jami-al-saghir-fi-al-fiqh": ["mh-hanafi", "mh-kutub"],
    "work/gharaib-fiqhiyya-ind-al-shia-al-imamiyya": ["mh-ukhra", "mh-kutub"],
    "work/al-mawsua-al-fiqhiyya": ["mh-kutub"],
    "work/al-mawsua-al-fiqhiyya-al-kuwaitiyya": ["mh-kutub"],
    "work/al-wasit-fil-madhhab": ["mh-shafii", "mh-kutub"],
    "work/al-wajiz-fi-fiqh-al-shafii": ["mh-shafii", "mh-kutub"],
    "work/al-lubab-fi-al-fiqh-al-shafii": ["mh-shafii", "mh-kutub"],
    "work/al-hawi-al-kabir": ["mh-shafii", "mh-kutub"],
    "work/umdat-al-fiqh-ibn-qudama": ["mh-hanbali", "mh-kutub"],
    "work/al-mabsut-sarakhsi": ["mh-hanafi", "mh-kutub"],
    "work/sharh-maani-al-athar-tahawi": ["mh-hanafi", "mh-kutub"],
    "work/al-binaya-sharh-al-hidaya": ["mh-hanafi", "mh-kutub"],
    "work/al-inaya-sharh-al-hidaya": ["mh-hanafi", "mh-kutub"],
    "work/nihayat-al-hidaya": ["mh-hanafi", "mh-kutub"],
    "work/al-muhadhdhab-fi-fiqh-al-shafii": ["mh-shafii", "mh-kutub"],
    "work/al-muhadhdhab-fiqh-shafii": ["mh-shafii", "mh-kutub"],
    "work/al-tanqih-fi-sharh-al-wasit": ["mh-shafii", "mh-kutub"],
    # --- fiqh and usul concepts ---
    "concept/madhhab": ["mh-mafahim"],
    "concept/ijtihad": ["mh-mafahim"],
    "concept/qiyas": ["mh-mafahim"],
    "concept/istihsan": ["mh-mafahim"],
    "concept/taqlid": ["mh-mafahim"],
    "concept/al-taqlid": ["mh-mafahim"],
    "concept/al-taqlid-al-aama": ["mh-mafahim"],
    "concept/ikhtilaf": ["mh-mafahim"],
    "concept/mujtahid": ["mh-mafahim"],
    "concept/ijma": ["mh-mafahim"],
    "concept/ray-fiqh": ["mh-mafahim"],
    "concept/al-maslaha-al-mursala": ["mh-mafahim"],
    "concept/taswib-al-mujtahidin": ["mh-mafahim"],
    "concept/dalil-usul": ["mh-mafahim"],
    "concept/rukhsa-usul": ["mh-mafahim"],
    "concept/tarjih-usul": ["mh-mafahim"],
    "question/can-an-age-be-without-a-mujtahid": ["mh-mafahim"],
}


def ensure_tags(text: str, additions: list[str]) -> tuple[str, bool]:
    """Return (new_text, changed). Handles inline `tags: [a, b]` and block
    `tags:` followed by `  - item` lines."""
    lines = text.splitlines(keepends=True)

    # locate a top-level `tags:` key
    for i, ln in enumerate(lines):
        if re.match(r"^tags:\s", ln) or ln.rstrip("\n") == "tags:":
            break
    else:
        # no tags key: insert after `kind:` or `class:` line near the top
        ins = None
        for i, ln in enumerate(lines[:40]):
            if re.match(r"^(kind|class):", ln):
                ins = i + 1
        if ins is None:
            ins = 1
        add = "tags: [" + ", ".join([BROWSER] + additions) + "]\n"
        lines.insert(ins, add)
        return "".join(lines), True

    # existing tags key found — check inline vs block
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

    # block style: collect `- item` lines, then append missing in same style
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


def main():
    apply = "--apply" in sys.argv
    changed = skipped = missing = 0
    for rid, sections in sorted(TARGETS.items()):
        cls, slug = rid.split("/", 1)
        f = DATA / cls / f"{slug}.yaml"
        if not f.exists():
            print(f"MISSING {rid} -> {f}")
            missing += 1
            continue
        text = f.read_text(encoding="utf-8")
        new, did = ensure_tags(text, sections)
        if did:
            changed += 1
            print(f"{'APPLY' if apply else 'WOULD'} {rid}: +{BROWSER}, +{','.join(sections)}")
            if apply:
                f.write_text(new, encoding="utf-8")
        else:
            skipped += 1
            print(f"SAME   {rid}")
    print(f"\n{changed} changed, {skipped} unchanged, {missing} missing")


if __name__ == "__main__":
    main()
