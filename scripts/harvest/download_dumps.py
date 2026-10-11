#!/usr/bin/env python3
"""Resumable download queue for the big dumps (docs/plan/15 §6.1, §6.2). Sequential, at most 2 connections to Wikimedia (rule 4),
identified User-Agent (rule 3), registry first (rule 1), SHA-256 recorded for every finished file (rule 6), safe to stop and restart (rule 7).
Order: first-ring Wikipedias, then the Wikidata JSON dump, then second-ring Wikipedias.
Usage: download_dumps.py [--only first|wikidata|second] [--dry-run]"""
import subprocess, sys, time
from pathlib import Path
import httpx
from common import HARVEST, REGISTRY, USER_AGENT, require_source, sha256

wd, wp = require_source("wikidata-dump"), require_source("wikipedia-dumps")
lim = wp["limits"]
BASE = "https://dumps.wikimedia.org"
only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
dry = "--dry-run" in sys.argv

queue = []
if only in (None, "first"):
    queue += [(l, f"{BASE}/{l}wiki/latest/{l}wiki-latest-{f}", HARVEST / "raw/wikipedia" / l) for l in lim["first_ring"] for f in lim["files"]]
if only in (None, "wikidata"):
    queue += [("wikidata", wd["url"], HARVEST / "raw/wikidata")]
if only in (None, "second"):
    queue += [(l, f"{BASE}/{l}wiki/latest/{l}wiki-latest-{f}", HARVEST / "raw/wikipedia" / l) for l in lim["second_ring"] for f in lim["files"]]

sums = HARVEST / "raw" / "checksums.sha256"
done = set(l.split("  ", 1)[1].strip() for l in sums.read_text().splitlines()) if sums.exists() else set()
log = HARVEST / "logs" / "downloads.log"


def say(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    with open(log, "a") as f:
        f.write(line + "\n")


with httpx.Client(headers={"User-Agent": USER_AGENT}, follow_redirects=True, timeout=60) as http:
    for name, url, outdir in queue:
        outdir.mkdir(parents=True, exist_ok=True)
        fname = url.rsplit("/", 1)[1]
        target = outdir / fname
        rel = str(target.relative_to(HARVEST))
        if rel in done:
            continue
        expected = int(http.head(url).headers["content-length"])
        if target.exists() and target.stat().st_size == expected and not (outdir / (fname + ".aria2")).exists():
            say(f"have {rel} ({expected} bytes), recording checksum")
        else:
            say(f"download {rel} ({expected / 2**30:.2f} GiB)")
            if dry:
                continue
            rc = subprocess.call(["aria2c", "-x2", "-s2", "-c", "--file-allocation=none", "--summary-interval=300", "--console-log-level=warn",
                                  f"--user-agent={USER_AGENT}", "-d", str(outdir), "-o", fname, url])
            if rc != 0 or target.stat().st_size != expected:
                say(f"FAILED {rel} (aria2c exit {rc}); rerun to resume")
                time.sleep(30)
                continue
        digest = sha256(target)
        with open(sums, "a") as f:
            f.write(f"{digest}  {rel}\n")
        done.add(rel)
        say(f"done {rel} sha256={digest[:16]}")
        time.sleep(5)   # be slow on purpose
say("queue finished")
