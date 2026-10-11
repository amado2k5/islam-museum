#!/usr/bin/env python3
"""Download the registry's smaller sources (OpenITI, Met, Pleiades, GeoNames): every source with a `downloads:` list and status enabled.
Registry first, identified User-Agent, one file at a time with a pause, resumable (aria2c -c), size and md5 checked where the registry has them,
SHA-256 recorded in raw/checksums.sha256. Usage: download_misc.py [source ...]"""
import hashlib, subprocess, sys, time
from pathlib import Path
from common import HARVEST, REGISTRY, USER_AGENT, sha256

only = set(sys.argv[1:])
sums = HARVEST / "raw" / "checksums.sha256"
done = {l.split("  ", 1)[1].strip() for l in sums.read_text().splitlines()} if sums.exists() else set()
log = HARVEST / "logs" / "downloads-misc.log"


def say(msg):
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"; print(line, flush=True)
    with open(log, "a") as f: f.write(line + "\n")


def md5(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for c in iter(lambda: f.read(1 << 20), b""): h.update(c)
    return h.hexdigest()


for key, src in REGISTRY["sources"].items():
    if key == "forbidden" or not src.get("downloads") or src.get("status") != "enabled" or (only and key not in only):
        continue
    for d in src["downloads"]:
        target = HARVEST / d["dest"]; rel = d["dest"]
        target.parent.mkdir(parents=True, exist_ok=True)
        if rel in done:
            continue
        if not (target.exists() and not Path(str(target) + ".aria2").exists()):
            say(f"[{key}] download {rel}")
            rc = subprocess.call(["aria2c", "-x2", "-s2", "-c", "--file-allocation=none", "--summary-interval=300", "--console-log-level=warn",
                                  "--allow-overwrite=true", f"--user-agent={USER_AGENT}", "-d", str(target.parent), "-o", target.name, d["url"]])
            if rc != 0:
                say(f"[{key}] FAILED {rel} (exit {rc}); rerun to resume"); continue
        if d.get("size") and target.stat().st_size != d["size"]:
            say(f"[{key}] SIZE MISMATCH {rel}: {target.stat().st_size} != {d['size']}"); continue
        if d.get("md5") and md5(target) != d["md5"]:
            say(f"[{key}] MD5 MISMATCH {rel}: not recording; delete and rerun"); continue
        digest = sha256(target)
        with open(sums, "a") as f: f.write(f"{digest}  {rel}\n")
        done.add(rel); say(f"[{key}] done {rel} ({target.stat().st_size / 2**20:.1f} MiB) sha256={digest[:16]}" + (" md5 ok" if d.get("md5") else ""))
        time.sleep(3)
say("misc queue finished")
