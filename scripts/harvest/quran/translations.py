#!/usr/bin/env python3
"""Merge permitted Qur'an translations into passage/quran-S-A.yaml records (Phase 3).

Tanzil distributes translator texts as `sura|aya|text` lines. We only carry
public-domain translations (Pickthall d.1936, Jalandhari d.1941 — PD under
life+70). The Arabic `text` field is untouched: this script only inserts a
`translations:` block and appends source/tanzil-translations to `sources:`.

Usage: python3 scripts/harvest/quran/translations.py EN_FILE UR_FILE
"""
import json, re, sys
from pathlib import Path
import yaml

REPO = Path(__file__).resolve().parents[3]
PDIR = REPO / "data" / "passage"

def parse(path: str) -> dict:
    out = {}
    for line in Path(path).read_text(encoding="utf-8").splitlines():
        if line.startswith("#") or not line.strip():
            continue
        s, a, t = line.split("|", 2)
        out[(int(s), int(a))] = t.strip()
    return out

def scalar(s: str) -> str:
    q = json.dumps(s, ensure_ascii=False)
    if yaml.safe_load("v: " + q)["v"] != s:
        q = json.dumps(s, ensure_ascii=True)
    return q

def main():
    en, ur = parse(sys.argv[1]), parse(sys.argv[2])
    assert len(en) == 6236 and len(ur) == 6236, (len(en), len(ur))
    n = 0
    for (s, a) in sorted(en):
        f = PDIR / f"quran-{s}-{a}.yaml"
        txt = f.read_text(encoding="utf-8")
        block = (
            "translations:\n"
            f"  en: {{ text: {scalar(en[(s, a)])}, translator: \"Marmaduke Pickthall\", license: PD }}\n"
            f"  ur: {{ text: {scalar(ur[(s, a)])}, translator: \"Fateh Muhammad Jalandhari\", license: PD }}\n"
        )
        if "translations:" in txt:
            txt = re.sub(r"translations:\n(?:  .*\n)+", block, txt, count=1)
        else:
            txt = txt.replace("relations:", block + "relations:", 1)
        txt = txt.replace("sources: [source/tanzil-quran]", "sources: [source/tanzil-quran, source/tanzil-translations]")
        f.write_text(txt, encoding="utf-8")
        n += 1
    print("updated", n, "ayah records")

if __name__ == "__main__":
    main()
