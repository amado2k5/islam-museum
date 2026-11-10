"""Authenticity ledger: one YAML record per harvested book, in docs/authenticity-ledger/books/.

  authenticity_ledger.py            create or refresh the ledger for every harvested canon book
  authenticity_ledger.py --check    verify the ledger (no network, no book text)

A ledger entry holds metadata only: title, author, era, the harvest folder, the count and SHA-256 hashes of the
harvested files (fixity), the decision from authenticity.yaml, and the checks made. It never holds book text.
Existing decisions, checks and history are never overwritten. Re-running only refreshes the harvest facts.
"""
import argparse, hashlib, json, sys
from datetime import date
from pathlib import Path
import yaml

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
LEDGER = REPO / "docs" / "authenticity-ledger" / "books"
HARVEST = Path.home() / "islam-museum-harvest"
FORBIDDEN_KEYS = {"text", "arab", "content", "body", "hadith", "matn"}
DECISIONS = {"accept", "label", "reject", "undecided"}


def era_of(d):
    """Era from the author's death year in AH (books.yaml field d). Pre-print: before about 1450 CE (853 AH)."""
    if d is None:
        return "modern (no death date recorded)"
    if d <= 853:
        return f"pre-print (author died {d} AH)"
    if d <= 1318:
        return f"early print (author died {d} AH)"
    return f"modern (author died {d} AH)"


def harvest_folder(book_id):
    for root in (HARVEST / "books").rglob(book_id):
        if root.is_dir():
            return root.relative_to(HARVEST).as_posix()
    return None


def manifest_files():
    out = {}
    m = HARVEST / "library" / "manifest.jsonl"
    if not m.exists():
        return out
    for line in m.read_text(encoding="utf-8").splitlines():
        try:
            r = json.loads(line)
        except json.JSONDecodeError:
            continue
        if r.get("status") == "file" and r.get("id"):
            out.setdefault(r["id"], []).append(r.get("sha256"))
    return out


def load_yaml(p):
    return yaml.safe_load(p.read_text(encoding="utf-8")) if p.exists() else None


def generate():
    books = yaml.safe_load((HERE / "books.yaml").read_text(encoding="utf-8"))["books"]
    reg = load_yaml(HERE / "authenticity.yaml") or {}
    decided = {d["id"]: d for d in reg.get("decisions", []) if d.get("id")}
    files = manifest_files()
    LEDGER.mkdir(parents=True, exist_ok=True)
    created = refreshed = 0
    for b in books:
        folder = harvest_folder(b["id"])
        if not folder:
            continue
        p = LEDGER / f"{b['id']}.yaml"
        entry = load_yaml(p) or {}
        today = date.today().isoformat()
        is_new = not entry
        d = decided.get(b["id"], {})
        entry.setdefault("id", b["id"])
        entry.setdefault("kind", "book")
        entry["title"] = b.get("t")
        entry["author"] = {"name": b.get("a"), "death_ah": b.get("d")}
        entry["era"] = era_of(b.get("d"))
        entry["harvest"] = {"folder": folder, "files": len(files.get(b["id"], [])),
                            "sha256": sorted(h for h in files.get(b["id"], []) if h)}
        entry.setdefault("copies", [])
        entry.setdefault("checks", [])
        entry["decision"] = {"work": d.get("decision", "undecided"), "decided_by": d.get("decided_by"),
                             "decided_on": d.get("decided_on"), "reason": d.get("reason")}
        entry.setdefault("history", [])
        if is_new:
            entry["history"].append({"date": today, "event": "ledger created from harvest folder and register"})
            created += 1
        else:
            refreshed += 1
        p.write_text(yaml.safe_dump(entry, allow_unicode=True, sort_keys=False), encoding="utf-8")
    print(f"ledger: {created} created, {refreshed} refreshed in {LEDGER.relative_to(REPO)}")


def check():
    problems = []
    books = {b["id"] for b in yaml.safe_load((HERE / "books.yaml").read_text(encoding="utf-8"))["books"]}
    reg = load_yaml(HERE / "authenticity.yaml") or {}
    decided = {d["id"]: d.get("decision") for d in reg.get("decisions", []) if d.get("id")}
    n = 0
    for p in sorted(LEDGER.glob("*.yaml")):
        n += 1
        e = yaml.safe_load(p.read_text(encoding="utf-8")) or {}
        if e.get("id") != p.stem:
            problems.append(f"{p.name}: id does not match file name")
        if p.stem not in books:
            problems.append(f"{p.name}: id is not in books.yaml")
        bad = FORBIDDEN_KEYS & set(_all_keys(e))
        if bad:
            problems.append(f"{p.name}: contains text-like keys {sorted(bad)}; ledgers hold metadata only")
        dec = (e.get("decision") or {}).get("work")
        if dec not in DECISIONS:
            problems.append(f"{p.name}: work decision {dec!r} is not valid")
        if p.stem in decided and decided[p.stem] != dec:
            problems.append(f"{p.name}: ledger says {dec!r} but authenticity.yaml says {decided[p.stem]!r}")
    # website records: each must match a registered source, carry no text, and never allow more uses than the register grants
    sources = {s["id"]: s for s in reg.get("sources", []) if s.get("id")}
    WEB = REPO / "docs" / "authenticity-ledger" / "websites"
    for p in sorted(WEB.glob("*.yaml")) if WEB.exists() else []:
        n += 1
        e = yaml.safe_load(p.read_text(encoding="utf-8")) or {}
        if e.get("id") != p.stem or p.stem not in sources:
            problems.append(f"websites/{p.name}: id must match a registered source")
            continue
        bad = FORBIDDEN_KEYS & set(_all_keys(e))
        if bad:
            problems.append(f"websites/{p.name}: contains text-like keys {sorted(bad)}")
        if set(e.get("allowed_uses", [])) != set(sources[p.stem].get("allowed_uses", [])):
            problems.append(f"websites/{p.name}: allowed_uses differ from authenticity.yaml")
    print(f"ledger check: {n} entries, {len(problems)} problem(s)")
    for x in problems:
        print("  error:", x)
    return 1 if problems else 0


def _all_keys(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield str(k)
            yield from _all_keys(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from _all_keys(v)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    sys.exit(check() if a.check else (generate() or 0))
