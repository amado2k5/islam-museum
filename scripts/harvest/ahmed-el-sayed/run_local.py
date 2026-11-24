#!/usr/bin/env python3
"""Process every transcribed episode of Ahmed Elsayed's podcast with local models only (no API cost), one after the other.

For each episode that has a transcript and no finished translation yet:
  1. local_extract.py   (qwen3:32b through the default Ollama server)  -> claims/<series>/epNN.json, then check_claims.py
  2. local_translate.py (translategemma:27b-it-q8_0 through the second server on the microSD) -> epNN.tr.json, then check_tr.py
An episode whose check fails is logged and skipped (its files are kept for a look); a finished episode is never redone.
Series are taken in the lane's wave order. Run it under caffeinate; it can be stopped and restarted at any time.

Usage: run_local.py [--only SERIES ...] [--limit N]    (paths are those of the harvest workspace on this Mac)
"""
import argparse, csv, glob, os, subprocess, sys, time
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
W = Path(os.path.expanduser("~/islam-museum-harvest/ahmed-el-sayed"))
PY = sys.executable
ORDER = ["khayr-al-qurun", "tariq-ila-bayt-al-maqdis", "umma-bayna-ihtilalayn", "yawm-al-furqan", "sham-bayt-al-maqdis", "riyad-al-salihin",
         "anwar-al-sahihayn", "sharh-al-minhaj", "madarasat-al-anam", "maqasid-al-suwar", "safwat-al-fawaid", "anwar-al-anbiya", "haqiba-aqida",
         "manhaj-islahi-anfal-tawba", "tajarib-islahiyya", "haqiba-tafsir-jil", "fadail-al-sahaba-ghaith-al-sari", "ghaith-al-sari",
         "ihya-minhaj-al-nubuwwa", "zad-al-muslihin", "siyasa-shar-iyya-ibn-taymiyya", "suwiyyat-al-mu-min", "anwar-al-salihin"]


import importlib.util, json, re


def _load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


_EX = _load("local_extract", REPO / "scripts/harvest/ahmed-el-sayed/local_extract.py")
_CC = _load("check_claims_mod", REPO / "scripts/harvest/ahmed-el-sayed/check_claims.py") if False else None
ARPAREN = re.compile(r"(?<!\u2066)\(([^()]*[\u0600-\u06FF][^()]*)\)")
HON_ALL = re.compile(r"رض[يى] ا*لل?ه|رضوان ا+لله|صل[يى] ا*لل?ه|عليه وسلم|عليه السلام|عليهم السلام|عليها السلام|عليه الصلاة|رحمه الله|رحمهم الله|رحمة الله عليه|قدس الله|كرم الله وجهه|ﷺ|ﷻ|peace be upon|PBUH|\(pbuh\)|may God be pleased", re.I)
BAD = re.compile(r"[\"“”«»]|[﴿﴾]")


def isolate(t):
    return ARPAREN.sub(lambda m: "\u2066(" + m.group(1) + ")\u2069", t)


def repair(path):
    """Idempotent clean-up of a locally extracted claims file: isolate Arabic parentheticals, scrub honorifics, and drop any single
    claim (Arabic and English together) that still breaks a rule. Returns the number of claims dropped."""
    d = json.load(open(path, encoding="utf8"))
    dropped = 0
    for s in d["sections"]:
        s["topic_ar"] = isolate(_EX.scrub(s["topic_ar"], "ar")); s["topic_en"] = BAD.sub("", _EX.scrub(s["topic_en"], "en"))
        ar2, en2 = [], []
        for ar, en in zip(s["claims_ar"], s["claims_en"]):
            ar = isolate(_EX.scrub(ar, "ar")); en = BAD.sub("", _EX.scrub(en, "en"))
            if HON_ALL.search(ar) or HON_ALL.search(en) or BAD.search(ar):
                dropped += 1; continue
            ar2.append(ar); en2.append(en)
        s["claims_ar"], s["claims_en"] = ar2, en2
    d["sections"] = [s for s in d["sections"] if s["claims_ar"]]
    d["summary_en"] = BAD.sub("", _EX.scrub(d["summary_en"], "en"))
    json.dump(d, open(path, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    return dropped


def log(msg):
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    with open(W / "local-run.log", "a", encoding="utf8") as f:
        f.write(line + "\n")


def run(cmd):
    r = subprocess.run(cmd, cwd=REPO, capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*"); ap.add_argument("--limit", type=int, default=0)
    a = ap.parse_args()
    rows = list(csv.DictReader(open(REPO / "harvest/ahmed-el-sayed/ledger.tsv", encoding="utf8"), delimiter="\t"))
    series = a.only or ORDER + sorted({r["show_slug"] for r in rows} - set(ORDER) - {"standalone", "seerah-2026", "seerah-lilmuslihin"}) + ["standalone"]
    done = 0
    for sl in series:
        eps = sorted((r for r in rows if r["show_slug"] == sl), key=lambda r: (int(r["episode_no"]) if r["episode_no"] and r["locator"].split("/ep")[1] == r["episode_no"] else 10**12, r["date"]))
        (W / "claims" / sl).mkdir(parents=True, exist_ok=True)
        for r in eps:
            n = int(r["locator"].split("/ep")[1])
            stem = f"ep{n:02d}" if n < 100 else f"ep{n}"
            txt = W / "transcripts" / sl / f"{stem}.txt"
            out = W / "claims" / sl / f"{stem}.json"
            tr = W / "claims" / sl / f"{stem}.tr.json"
            if tr.exists() or not txt.exists() or not (W / "transcripts" / sl / f"{stem}.meta.json").exists():
                continue
            parts = [x.strip() for x in r["title_ar"].split("|") if x.strip()]
            title = " | ".join(parts[1:]) if len(parts) > 1 else r["title_ar"]
            t0 = time.time()
            log(f"START {sl}/{stem} ({r['duration']})")
            if not out.exists():
                code, msg = run([PY, "-I", "scripts/harvest/ahmed-el-sayed/local_extract.py", "--transcript", str(txt), "--ledger-title", r["title_ar"], "--graph", str(W / "graph-index.tsv"), "--episode", str(n), "--out", str(out)])
                if code:
                    log(f"FAIL extract {sl}/{stem}: {msg[-200:]}"); continue
            dropped = repair(out)
            if dropped:
                log(f"repair {sl}/{stem}: dropped {dropped} claim(s) that broke a rule")
            code, msg = run([PY, "-I", "scripts/harvest/ahmed-el-sayed/check_claims.py", str(out), str(W / "graph-index.tsv")])
            if code:
                log(f"FAIL claims-check {sl}/{stem}: {msg[:300]}"); continue
            code, msg = run([PY, "-I", "scripts/harvest/ahmed-el-sayed/local_translate.py", "--claims", str(out), "--title-ar", title, "--out", str(tr)])
            if code:
                log(f"FAIL translate {sl}/{stem}: {msg[-200:]}"); continue
            code, msg = run([PY, "-I", "scripts/harvest/ahmed-el-sayed/check_tr.py", str(out), str(tr)])
            if code:
                log(f"FAIL tr-check {sl}/{stem}: {msg[:300]}"); tr.rename(str(tr) + ".failed"); continue
            log(f"DONE {sl}/{stem} in {int(time.time() - t0)}s")
            done += 1
            if a.limit and done >= a.limit:
                return


if __name__ == "__main__":
    main()
