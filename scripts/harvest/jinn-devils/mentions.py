#!/usr/bin/env python3
"""Cross-link passages to jinn/devil/dream entities they name (Jinn & Devils lane).

Scans every data/passage/*.yaml (Qur'an ayat + harvested hadith collections),
normalizes the text and adds `mentions` edges to the being/concept records the
Jinn & Devils Browser covers. Conservative: only unambiguous lexical forms are
matched (see PATTERNS); each edge is sourced to the passage's own first source.
Idempotent — existing mentions edges are never duplicated.

Usage: python3 scripts/harvest/jinn-devils/mentions.py [--apply]
"""
import re
import sys
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parents[3]
PDIR = REPO / "data" / "passage"

# collections scanned (hadith + quran); poems and misc are out of scope
PREFIX_SRC = {
    "quran": "source/tanzil-quran",
    "muslim": "source/sahih-muslim",
    "bukhari": "source/sahih-al-bukhari",
    "tirmidhi": "source/jami-al-tirmidhi",
    "nasai": "source/sunan-al-nasai",
    "ibnmajah": "source/sunan-ibn-majah",
    "abudawud": "source/sunan-abi-dawud",
    "muwatta": "source/muwatta-malik",
    "arbaun": "source/arbaeen-nawawi-zelfi-ibn-rajab",
}
SKIP_PREFIX = ("poem-", "shuab-", "matalib-")

# --- normalization (same scheme as scripts/harvest/quran/mentions.py) --------
_DIAC = re.compile(r'[ً-ٰٟۡ-ۭۨ]')

def norm(s: str) -> str:
    s = _DIAC.sub('', s)
    for a, b in [('أ', 'ا'), ('إ', 'ا'), ('آ', 'ا'), ('ٱ', 'ا'),
                 ('ى', 'ي'), ('ة', 'ه'), ('ؤ', 'و'), ('ئ', 'ي')]:
        s = s.replace(a, b)
    return s

P = r'(?:^|\s)[بلوفسك]{0,2}'  # optional clitic prefixes like mentions.py

PATTERNS = [
    # the jinn (definite الجن as a whole token — الجنة/الجنود etc. never match)
    (re.compile(P + r'الجن(?=\s|$)|للجن(?=\s|$)|الجنّي|الجني(?=\s|$)'),
     ['concept/jinn']),
    (re.compile(P + r'جني[هه](?=\s|$)'), ['concept/jinn']),          # جنيّة/جنيّه
    (re.compile(P + r'جني(?=\s|$)'), ['concept/jinn']),            # جنّي / my jinni
    # Iblis
    (re.compile(P + r'ابليس(?=\s|$)'), ['person/iblis']),
    # shaytan / shayatin (never شيطانه = devilry)
    (re.compile(P + r'شيطان(?=\s|$)|شياطين(?=\s|$)|شيطانا(?=\s|$)'),
     ['concept/shayatin-al-ins-wal-jinn']),
    # whispering devils
    (re.compile(P + r'وسواس[هيك]?|لوامه(?=\s|$)'),
     ['concept/al-waswasa', 'concept/al-lamma']),
    # magic domain
    (re.compile(P + r'سحر[هة]?|ساحر|مشعوذ|مسحور'), ['concept/sihr']),
    # kahn / soothsaying
    (re.compile(P + r'كاهن[هة]?|كهنوت'), ['concept/kahana']),
    # the qareen — hadith corpora only (see is_hadith gate below)
    # kinds of jinn
    (re.compile(P + r'مارد|عفريت|غولان|سيّاط|غول(?=\s|$)'),
     ['concept/jinn-anwa', 'concept/ghul']),
    # dreams (ru'ya -> رويا after normalization; ru'yah -> رؤية stays apart)
    (re.compile(P + r'(?:ال)?رويا(?=\s|$)|تعبير[هة]?\s+الرويا'),
     ['concept/ruya-fiqh', 'concept/taabir-al-ruya']),
]
QAREEN = re.compile(P + r'قرين[هي]?(?=\s|$)')


def prefix_of(name: str) -> str:
    return name.split("-", 1)[0]


def source_for(rec: dict, fname: str) -> str:
    srcs = rec.get("sources") or []
    if srcs:
        return srcs[0]
    return PREFIX_SRC.get(prefix_of(fname), "source/tanzil-quran")


def targets_for(text: str, is_quran: bool) -> set:
    out = set()
    for pat, ids in PATTERNS:
        if pat.search(text):
            out.update(ids)
    if not is_quran and QAREEN.search(text):
        out.add("concept/qareen")
    return out


def add_edges(text: str, new: list[str], src: str) -> str:
    lines = text.splitlines(keepends=True)
    # find `relations:` key
    rel_i = None
    for i, ln in enumerate(lines):
        if ln.startswith("relations:"):
            rel_i = i
            break
    edge_lines = [f"  - {{ type: mentions, target: {t}, sources: [{src}] }}\n" for t in new]
    if rel_i is None:
        # insert a relations block before provenance:/sources:/status: or at end
        ins = len(lines)
        for i, ln in enumerate(lines):
            if re.match(r"^(provenance|sources|status|external_ids|education|did_you_know):", ln):
                ins = i
                break
        block = ["relations:\n"] + edge_lines
        return "".join(lines[:ins]) + "".join(block) + "".join(lines[ins:])
    # find end of the relations list: first line after rel_i that is a new
    # top-level key or a non-`  - ` line
    j = rel_i + 1
    while j < len(lines) and (lines[j].startswith("  - ") or lines[j].strip() == ""):
        j += 1
    lines[j:j] = edge_lines
    return "".join(lines)


def main():
    apply = "--apply" in sys.argv
    stats = {}
    files_changed = 0
    samples = []
    for f in sorted(PDIR.glob("*.yaml")):
        name = f.stem
        pref = prefix_of(name)
        if pref in SKIP_PREFIX or not any(name.startswith(p + "-") for p in PREFIX_SRC):
            continue
        try:
            d = yaml.safe_load(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(d, dict):
            continue
        text = d.get("text_search") or d.get("text") or ""
        tnorm = " " + norm(text).replace("  ", " ") + " "
        is_quran = name.startswith("quran-")
        tgts = targets_for(tnorm, is_quran)
        if not tgts:
            continue
        existing = {r.get("target") for r in (d.get("relations") or []) if isinstance(r, dict)}
        new = sorted(t for t in tgts if t not in existing)
        if not new:
            continue
        src = source_for(d, name)
        for t in new:
            stats[t] = stats.get(t, 0) + 1
        files_changed += 1
        if len(samples) < 30:
            samples.append((name, new))
        if not apply:
            continue
        f.write_text(add_edges(f.read_text(encoding="utf-8"), new, src), encoding="utf-8")
    print(f"{'APPLIED' if apply else 'DRY'}: {files_changed} passage records "
          f"{'gained' if apply else 'would gain'} edges")
    for t, n in sorted(stats.items(), key=lambda kv: -kv[1]):
        print(f"  {n:5d}  {t}")
    for stem, new in samples:
        print(" ", stem, "->", ", ".join(new))


if __name__ == "__main__":
    main()
