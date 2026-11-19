#!/usr/bin/env python3
"""Import public-domain Qur'an translations from local sura|aya|text files.

Pass EN_FILE UR_FILE for Tanzil's Pickthall and Jalandhari, or
--fr-kazimirski FILE for Kazimirski's Le Koran (Charpentier, 1869).
The French file must already be independently aligned to the frozen Tanzil
verse boundaries; the 1869 edition's numbering is not interchangeable.
Only the selected translation entries and their source references are changed.
"""
import argparse
import json
import re
from pathlib import Path

import yaml

from suras import AYAT

REPO = Path(__file__).resolve().parents[3]
PDIR = REPO / "data" / "passage"
REFS = [(s, a) for s, count in enumerate(AYAT, 1) for a in range(1, count + 1)]
EDITIONS = {
    "en": ("Marmaduke Pickthall", "source/tanzil-translations"),
    "ur": ("Fateh Muhammad Jalandhari", "source/tanzil-translations"),
    "fr": ("Albert Kazimirski de Biberstein", "source/kazimirski-quran-1869"),
}


def parse(path: Path) -> dict:
    out = {}
    for n, line in enumerate(path.read_text(encoding="utf-8-sig").split("\n"), 1):
        if line.startswith("#") or not line.strip():
            continue
        try:
            s, a, value = line.split("|", 2)
            ref = (int(s), int(a))
        except ValueError as e:
            raise ValueError(f"{path}:{n}: expected sura|aya|text") from e
        if ref in out or not value.strip():
            raise ValueError(f"{path}:{n}: duplicate reference or empty text for {s}:{a}")
        out[ref] = value
    if out.keys() != set(REFS):
        raise ValueError(f"{path}: expected exactly the {len(REFS)} Tanzil verse references")
    return out


def scalar(s: str) -> str:
    q = json.dumps(s, ensure_ascii=False)
    if yaml.safe_load("v: " + q)["v"] != s:
        q = json.dumps(s, ensure_ascii=True)
        if yaml.safe_load("v: " + q)["v"] != s:
            raise ValueError("translation text could not be encoded verbatim")
    return q


def merge(text: str, verses: dict) -> str:
    existing = re.search(r"^translations:\n((?:  [^\n]*\n)*)", text, re.MULTILINE)
    if existing is None and re.search(r"^translations:", text, re.MULTILINE):
        raise ValueError("unsupported translations block")
    block = existing[1] if existing else ""
    sources = set()
    for lang, verse in verses.items():
        translator, source = EDITIONS[lang]
        line = f"  {lang}: {{ text: {scalar(verse)}, translator: {scalar(translator)}, license: PD }}\n"
        pattern = re.compile(rf"^  {lang}: \{{[^\n]*\}}\n", re.MULTILINE)
        if pattern.search(block):
            block = pattern.sub(lambda _: line, block, count=1)
        else:
            if re.search(rf"^  {lang}:", block, re.MULTILINE):
                raise ValueError(f"unsupported {lang} translation entry")
            block += line
        sources.add(source)
    block = "translations:\n" + block
    if existing:
        text = text[:existing.start()] + block + text[existing.end():]
    else:
        text, count = re.subn(r"^relations:", lambda _: block + "relations:", text, count=1, flags=re.MULTILINE)
        if not count:
            raise ValueError("missing relation block")

    match = re.search(r"^sources: \[([^\n]*)\]$", text, re.MULTILINE)
    if not match:
        raise ValueError("missing or unsupported sources list")
    present = yaml.safe_load(match[0])["sources"]
    if "source/tanzil-quran" not in present:
        raise ValueError("missing source/tanzil-quran")
    extra = "".join(f", {source}" for source in sorted(sources - set(present)))
    return text[:match.end(1)] + extra + text[match.end(1):]


def main(argv=None):
    cli = argparse.ArgumentParser(description=__doc__.split("\n", 1)[0])
    cli.add_argument("en", nargs="?", type=Path, metavar="EN_FILE")
    cli.add_argument("ur", nargs="?", type=Path, metavar="UR_FILE")
    cli.add_argument("--fr-kazimirski", dest="fr", type=Path, metavar="FILE",
                     help="Kazimirski 1869, independently aligned to Tanzil")
    args = cli.parse_args(argv)
    if (args.en is None) != (args.ur is None) or not (args.en or args.fr):
        cli.error("supply EN_FILE and UR_FILE together, --fr-kazimirski FILE, or both")

    updates = []
    try:
        editions = {lang: parse(path) for lang, path in vars(args).items() if path}
        for ref in REFS:
            path = PDIR / f"quran-{ref[0]}-{ref[1]}.yaml"
            original = path.read_bytes()
            try:
                verses = {lang: rows[ref] for lang, rows in editions.items()}
                updated = merge(original.decode("utf-8"), verses).encode("utf-8")
            except ValueError as e:
                raise ValueError(f"{path}: {e}") from e
            if updated != original:
                updates.append((path, updated))
    except (OSError, ValueError, yaml.YAMLError) as e:
        cli.error(str(e))
    for path, data in updates:
        path.write_bytes(data)
    print("updated", len(updates), "ayah records")


if __name__ == "__main__":
    main()
