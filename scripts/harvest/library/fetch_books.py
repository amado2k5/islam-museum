#!/usr/bin/env python3
"""Find and download open archive.org scans of the books in books.yaml (docs/plan/15 rules: registry, polite, resumable).

  fetch_books.py [--only ID,ID] [--cat hadith] [--dry-run] [--max-items 6] [--max-gib 1.5]

Per book: search archive.org (Arabic title words, original and normalised), keep items whose title+creator contain every token group in `k`,
drop commentaries/indexes unless the book itself is one, drop access-restricted (borrow-only) items, rank, download up to N PDFs.
Writes $HARVEST/library/manifest.jsonl (one line per downloaded file or per miss) and files under $HARVEST/raw/library/<cat>/<id>/.
Wrong matches are possible: every row records the item title so a human can reject it; nothing here is trusted as the "right edition"."""
import argparse, json, re, subprocess, sys, time
from pathlib import Path
import yaml
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from common import HARVEST, client, require_source, sha256

ap = argparse.ArgumentParser()
ap.add_argument("--only"); ap.add_argument("--cat"); ap.add_argument("--dry-run", action="store_true")
ap.add_argument("--max-items", type=int, default=6); ap.add_argument("--max-gib", type=float, default=1.5)
ap.add_argument("--require-decision", action="store_true", help="refuse books with no authenticity decision (authenticity_gate.py)")
args = ap.parse_args()
src = require_source("archive-org-books")
PAUSE = src["limits"]["pause_seconds"]
books = yaml.safe_load((Path(__file__).parent / "books.yaml").read_text())["books"]
if args.only: books = [b for b in books if b["id"] in args.only.split(",")]
if args.cat: books = [b for b in books if b["cat"] == args.cat]
# authenticity gate: rejected books are never fetched; labelled and accepted books go on as before
sys.path.insert(0, str(Path(__file__).resolve().parent))  # the gate lives beside this script; works under python -I too
from authenticity_gate import gate, load_decisions, named_edition, edition_matches
_decisions = load_decisions()
_kept = []
for _b in books:
    _ok, _dec, _msg = gate(_b["id"], _decisions, require_decision=args.require_decision)
    print(f"gate: {_msg}", file=sys.stderr)
    if _ok: _kept.append(_b)
books = _kept

OUT = HARVEST / "raw/library"; MAN = HARVEST / "library/manifest.jsonl"; MAN.parent.mkdir(parents=True, exist_ok=True)
DIAC = re.compile("[ً-ٰٟـ]")
def norm(s: str) -> str:
    s = DIAC.sub("", s or "")
    for a, b in (("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ٱ", "ا"), ("ى", "ي"), ("ة", "ه"), ("ؤ", "و"), ("ئ", "ي")): s = s.replace(a, b)
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", s)).strip()
BAD = ["شرح", "مختصر", "ملخص", "فهرس", "فهارس", "تحقيق", "نقد", "دراسة", "رسالة", "تخريج", "حاشيه", "تعليق", "ترجمه", "english", "urdu", "translation", "الأطراف", "اطراف"]
STOP = {"في", "من", "على", "عن", "بن", "ابن", "ابو", "الى", "و"}

def tokens_ok(text: str, groups) -> bool:
    return all(any(alt in text for alt in map(norm, str(g).split("|"))) for g in groups)

def search(http, b):
    seen = {}
    words = [w for w in norm(b["t"]).split() if w not in STOP][:5]
    for q in {" AND ".join(words), " AND ".join(b["t"].split()[:5])}:
        r = http.get("https://archive.org/advancedsearch.php", params={"q": f"title:({q}) AND mediatype:texts", "fl[]": ["identifier", "title", "creator", "downloads", "language"], "rows": 80, "output": "json"})
        r.raise_for_status(); time.sleep(PAUSE)
        for d in r.json()["response"]["docs"]: seen[d["identifier"]] = d
    return list(seen.values())

def choose(b, docs):
    own_bad = [w for w in BAD if w in norm(b["t"])]
    scored = []
    for d in docs:
        title, creator = norm(d.get("title", "")), norm(" ".join(d["creator"]) if isinstance(d.get("creator"), list) else d.get("creator", ""))
        text = f"{title} {creator}"
        if not tokens_ok(text, b["k"]): continue
        if any(w in title and w not in own_bad for w in BAD): continue
        lang = d.get("language"); lang = " ".join(lang) if isinstance(lang, list) else (lang or "")
        if lang and not b.get("lang_any") and not re.search(r"ara|arabic|ar$", lang, re.I): continue
        author_bonus = 1 if norm(b["a"]).split() and any(w in text for w in norm(b["a"]).split() if w not in STOP and len(w) > 3) else 0
        scored.append((author_bonus, -len(title), int(d.get("downloads") or 0), d))
    scored.sort(key=lambda x: (x[0], x[1], x[2]), reverse=True)
    return [s[3] for s in scored]

def pdfs_of(http, ident):
    r = http.get(f"https://archive.org/metadata/{ident}"); r.raise_for_status(); time.sleep(PAUSE)
    m = r.json(); md = m.get("metadata", {})
    if str(md.get("access-restricted-item", "")).lower() == "true": return None, md, "restricted"
    files = [f for f in m.get("files", []) if f.get("name", "").lower().endswith(".pdf") and not f.get("name", "").endswith("_text.pdf") and f.get("source") in ("original", "derivative")]
    files = [f for f in files if int(f.get("size", 0) or 0) > 200_000]
    originals = [f for f in files if f.get("source") == "original"] or files
    return originals, md, None

def log(row):
    with open(MAN, "a") as f: f.write(json.dumps(row, ensure_ascii=False) + "\n")

done = {(json.loads(l)["id"], json.loads(l).get("file")) for l in MAN.read_text().splitlines() if l.strip()} if MAN.exists() else set()
have_file = {json.loads(l)["id"] for l in MAN.read_text().splitlines() if l.strip() and json.loads(l).get("status") == "file"} if MAN.exists() else set()
with client() as http:
    for b in books:
        if b["id"] in have_file: print(f"== {b['id']}: already downloaded, skipped", flush=True); continue
        print(f"== {b['id']}: {b['t']}", flush=True)
        try:
            cands = choose(b, search(http, b))
        except Exception as e:
            print("  search failed:", e); continue
        got = 0
        for d in cands:
            if got >= args.max_items: break
            ident = d["identifier"]
            try: files, md, why = pdfs_of(http, ident)
            except Exception as e: print("  metadata failed", ident, e); continue
            if why or not files: print(f"  skip {ident}: {why or 'no pdf'}"); continue
            # edition check: a candidate is downloaded only if its metadata names the work's named edition
            _cfg = named_edition(b["id"], _decisions)
            if _cfg is not None and not edition_matches(md, _cfg):
                print(f"  skip {ident}: metadata does not match the named edition", flush=True); continue
            f = max(files, key=lambda x: int(x["size"]))
            gib = int(f["size"]) / 2**30
            if gib > args.max_gib: print(f"  skip {ident}: {gib:.2f} GiB over cap"); continue
            lic = md.get("licenseurl") or ("public-domain-mark" if "publicdomain" in str(md.get("rights", "")).lower() else "")
            print(f"  {'would get' if args.dry_run else 'get'} {ident}  {gib:.2f} GiB  {d.get('title','')[:70]}", flush=True)
            if args.dry_run: got += 1; continue
            dest = OUT / b["cat"] / b["id"]; dest.mkdir(parents=True, exist_ok=True)
            url = f"https://archive.org/download/{ident}/{f['name']}"
            fname = f"{ident}.pdf"
            if (dest / fname).exists(): print(f"  already on disk: {ident}, not downloaded"); got += 1; continue
            rc = subprocess.call(["aria2c", "-x2", "-s2", "-c", "--file-allocation=none", "--console-log-level=error", "--summary-interval=0",
                                  f"--user-agent={http.headers['user-agent']}", "-d", str(dest), "-o", fname, url])
            tgt = dest / fname
            if rc != 0 or not tgt.exists(): print("  FAILED", ident); continue
            log({"id": b["id"], "cat": b["cat"], "status": "file", "item": ident, "file": str(tgt.relative_to(HARVEST)), "bytes": tgt.stat().st_size,
                 "sha256": sha256(tgt), "item_title": d.get("title"), "creator": d.get("creator"), "licence_hint": lic, "source_url": f"https://archive.org/details/{ident}",
                 "fetched": time.strftime("%Y-%m-%d")})
            got += 1; time.sleep(PAUSE)
        if not args.dry_run: log({"id": b["id"], "cat": b["cat"], "status": "ok" if got else "miss", "candidates": len(cands)})
        print(f"  -> {got} file(s)", flush=True)
