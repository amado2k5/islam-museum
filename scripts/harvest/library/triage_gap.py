#!/usr/bin/env python3
"""Phase 0 triage for docs/delegation/ar-prose-gap-plan.md: duplicates and scope of the entities with no Arabic prose. Read-only; no model.

  python3 -I scripts/harvest/library/triage_gap.py [--out DIR]

Writes triage.json (per entity: dup_of_prose / dup_of_gap / kind / scope flag) and prints a summary. DIR defaults to ~/islam-museum-harvest/work/prose-gap/."""
import argparse, collections, json, os, re
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[3]
H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
SKIP = {"passage", "source", "listing", "dataset", "language", "screen", "media"}
DIAC = re.compile("[ؐ-ًؚ-ٰٟۖ-ۭـ]")
ISLAMIC_KINDS = {"mosque", "masjid", "mausoleum", "tomb", "madrasa", "mosque-complex", "shrine", "zawiya", "khanqah", "tekke", "caravanserai", "hammam", "bimaristan", "minaret", "fort", "palace", "citadel", "gate", "bridge", "library", "mihrab"}
NONISLAMIC_WORDS = re.compile(r"\b(church|cathedral|synagogue|manor|zespół|pałac|kościół|chapel|monastery|abbey|castle of|schloss|dwór|temple)\b", re.I)


def norm(s):
    s = DIAC.sub("", s or "")
    for a, b in (("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ى", "ي"), ("ة", "ه"), ("ؤ", "و"), ("ئ", "ي")):
        s = s.replace(a, b)
    return re.sub(r"[^\w]+|_+", " ", re.sub(r"\([^)]*\)", " ", s)).strip().lower()


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=str(H / "work/prose-gap")); a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    gap, prose = {}, {}
    for cdir in sorted((ROOT / "data").iterdir()):
        c = cdir.name
        if c.startswith("_") or c in SKIP or not cdir.is_dir():
            continue
        for f in sorted(cdir.glob("*.yaml")):
            d = yaml.safe_load(f.read_text()) or {}
            eid = d.get("id", f"{c}/{f.stem}")
            names = {norm((d.get("label") or {}).get("ar")), norm((d.get("label") or {}).get("en"))} | {norm(x) for x in (d.get("aliases") or []) if isinstance(x, str)}
            names.discard("")
            rec = {"class": c, "kind": d.get("kind"), "qid": (d.get("external_ids") or {}).get("wikidata"), "names": names,
                   "en": (d.get("label") or {}).get("en") or "", "card": "بطاقة أولية" in ((d.get("summary") or {}).get("ar") or ""),
                   "sources": d.get("sources") or []}
            (prose if (ROOT / "content/ar" / c / (f.stem + ".md")).exists() else gap)[eid] = rec
    by_qid_prose = {r["qid"]: i for i, r in prose.items() if r["qid"]}
    by_name_prose = collections.defaultdict(list)
    for i, r in prose.items():
        for n in r["names"]:
            by_name_prose[(r["class"], n)].append(i)
    by_qid_gap = collections.defaultdict(list)
    for i, r in gap.items():
        if r["qid"]:
            by_qid_gap[r["qid"]].append(i)
    res = {}; C = collections.Counter()
    for i, r in gap.items():
        t = {"dup_of_prose_qid": None, "dup_of_prose_name": [], "dup_of_gap_qid": [], "scope": "ok"}
        if r["qid"] in by_qid_prose:
            t["dup_of_prose_qid"] = by_qid_prose[r["qid"]]
        t["dup_of_prose_name"] = sorted({j for n in r["names"] for j in by_name_prose.get((r["class"], n), []) if j != i})[:3]
        t["dup_of_gap_qid"] = [j for j in by_qid_gap.get(r["qid"], []) if j != i][:3] if r["qid"] else []
        if r["class"] == "building":
            if NONISLAMIC_WORDS.search(r["en"]) and (r["kind"] or "") not in ("mosque", "madrasa", "mausoleum", "tomb"):
                t["scope"] = "suspect-non-islamic-name"
            if r["kind"] not in ISLAMIC_KINDS:
                t["scope"] = t["scope"] if t["scope"] != "ok" else "unusual-kind"
        res[i] = t
        C[(r["class"], "dup-of-prose-by-qid" if t["dup_of_prose_qid"] else "dup-of-prose-by-name" if t["dup_of_prose_name"] else "dup-within-gap" if t["dup_of_gap_qid"] else "unique")] += 1
        if t["scope"] != "ok":
            C[(r["class"], t["scope"])] += 1
    (out / "triage.json").write_text(json.dumps(res, ensure_ascii=False, indent=0))
    print("gap entities:", len(gap), "prose entities:", len(prose))
    for k, v in sorted(C.items()):
        print(k, v)
    print("building kinds in gap:", collections.Counter(r["kind"] for r in gap.values() if r["class"] == "building").most_common(15))


if __name__ == "__main__":
    main()
