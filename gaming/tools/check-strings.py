#!/usr/bin/env python3
"""Checks a game's string tables: the same keys in the same order in all seven languages, the same {placeholders},
no empty string, no honorific typed, and no bare parenthesis round Arabic script (repository rule of 6 November 2026).
Usage: python3 tools/check-strings.py <i18n dir> [<i18n dir> ...]   Exit code 1 if anything is wrong."""
import json, re, sys, pathlib

LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"]
HONORIFICS = ["ﷺ", "صلى الله عليه", "عليه السلام", "رضي الله عن", "رحمه الله", "صلی اللہ علیہ", "علیہ السلام", "رضی اللہ"]
ph = lambda v: sorted(re.findall(r"\{(\w+)\}", v))
bad = 0
for d in sys.argv[1:]:
    d = pathlib.Path(d)
    tables = {}
    for lang in LANGS:
        f = d / f"{lang}.json"
        if not f.exists():
            print(f"{f}: missing"); bad += 1; continue
        tables[lang] = json.loads(f.read_text(encoding="utf-8"))
    en = tables.get("en")
    if not en:
        continue
    for lang, t in tables.items():
        if list(t.keys()) != list(en.keys()):
            print(f"{d}/{lang}.json: keys differ from en.json: missing {sorted(set(en) - set(t))}, extra {sorted(set(t) - set(en))}" if set(t) != set(en) else f"{d}/{lang}.json: same keys as en.json but in a different order"); bad += 1
        if t.get("_meta", {}).get("lang") != lang:
            print(f"{d}/{lang}.json: _meta.lang is not {lang}"); bad += 1
        for k, v in t.items():
            if k == "_meta" or k not in en:
                continue
            if not isinstance(v, str) or not v.strip():
                print(f"{d}/{lang}.json: {k} is empty"); bad += 1; continue
            if ph(v) != ph(en[k]):
                print(f"{d}/{lang}.json: {k} has placeholders {ph(v)}, en has {ph(en[k])}"); bad += 1
            if any(h in v for h in HONORIFICS):
                print(f"{d}/{lang}.json: {k} types an honorific"); bad += 1
            if re.search(r"(?<!⁦)\([^)]*[؀-ۿ]", v):
                print(f"{d}/{lang}.json: {k} has a bare parenthesis round Arabic script"); bad += 1
    print(f"{d}: {len(tables)} languages, {len(en) - 1} strings")
sys.exit(1 if bad else 0)
