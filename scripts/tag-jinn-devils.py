#!/usr/bin/env python3
"""Tag existing records for the Jinn & Devils browser (one-off lane tool).

Adds `jinn-devils-browser` plus a section tag (jd-jinn / jd-devils / jd-angels /
jd-dreams) to the tags list of each record, preserving existing tags and the
file's YAML formatting (inline lists stay inline, block lists get appended).

Usage: python3 scripts/tag-jinn-devils.py [--apply]
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DATA = REPO / "data"

BROWSER = "jinn-devils-browser"

# id -> section tags to ensure (all get BROWSER + these)
TARGETS = {
    # --- jinn ---
    "concept/jinn": ["jd-jinn"],
    "concept/qareen": ["jd-jinn", "jd-devils"],
    "concept/mass-al-jinn": ["jd-jinn"],
    "concept/tathir-al-jinn-wal-sihr": ["jd-jinn"],
    "event/jinn-hear-the-quran": ["jd-jinn"],
    "question/what-are-jinn": ["jd-jinn"],
    "person/shiqq-al-kahin": ["jd-jinn"],
    # --- devils ---
    "person/iblis": ["jd-devils"],
    "concept/shayatin-al-ins-wal-jinn": ["jd-devils"],
    "concept/al-lamma": ["jd-devils"],
    "concept/al-waswasa": ["jd-devils"],
    "concept/waswasa-fiqh": ["jd-devils"],
    "concept/sihr": ["jd-devils"],
    "concept/kahana": ["jd-devils"],
    "concept/kahana-fiqh": ["jd-devils"],
    "concept/al-ayn": ["jd-devils"],
    "concept/hasad": ["jd-devils"],
    "concept/fariq-bayn-maasiyat-adam-wa-iblis": ["jd-devils"],
    "person/kahin-asfan-al-khuzai": ["jd-devils"],
    "person/imran-ibn-amir-al-kahin": ["jd-devils"],
    "person/satih-al-kahin": ["jd-devils"],
    "question/does-magic-have-a-reality": ["jd-devils"],
    # --- angels (files untouched by feat/angels-browser; its `angels-browser`
    # tag is picked up by the browser lib as well) ---
    "person/dihya-al-kalbi": ["jd-angels"],
    "event/battle-of-badr": ["jd-angels"],
    "event/uhud-archers-mistake": ["jd-angels"],
    # --- dreams ---
    "concept/taabir-al-ruya": ["jd-dreams"],
    "concept/al-hulm": ["jd-dreams"],
    "concept/ruya-fiqh": ["jd-dreams"],
    "work/tafsir-al-ahlam-ibn-sirin": ["jd-dreams"],
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
    # insert new items right after the last existing item line (or after `tags:`)
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
