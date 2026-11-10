#!/usr/bin/env python3
"""Watchdog for claims_pipeline.py extract: checks Ollama and progress every minute, restarts a stalled extract.
  watch_extract.py <cat>/<book-id>/<item> [--model qwen3:32b] [--stall-minutes 12]
Logs to ~/islam-museum-harvest/work/<book-id>/watch.log. Talks only to localhost:11434."""
import argparse, subprocess, sys, time
from pathlib import Path

import httpx

H = Path.home() / "islam-museum-harvest"
REPO = Path(__file__).resolve().parents[3]
PY = REPO / ".venv-harvest" / "bin" / "python"


def log(logf: Path, msg: str):
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    with logf.open("a") as f:
        f.write(line + "\n")


def ollama_ok() -> bool:
    try:
        return httpx.get("http://localhost:11434/api/ps", timeout=10).status_code == 200
    except httpx.HTTPError:
        return False


def start(item_arg: str, model: str, out: Path) -> subprocess.Popen:
    return subprocess.Popen([str(PY), "-u", str(REPO / "scripts/harvest/library/claims_pipeline.py"), "extract", item_arg, "--model", model],
                            stdout=out.open("a"), stderr=subprocess.STDOUT, cwd=REPO)


def newest_output_mtime(raw_dir: Path) -> float:
    files = list(raw_dir.glob("*.json"))
    return max((f.stat().st_mtime for f in files), default=0.0)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("item"); ap.add_argument("--model", default="qwen3:32b"); ap.add_argument("--stall-minutes", type=float, default=12)
    a = ap.parse_args()
    cat, book, item = a.item.split("/")
    work = H / "work" / book; work.mkdir(parents=True, exist_ok=True)
    logf = work / "watch.log"; runlog = work / "extract.log"
    raw_dir = work / "raw" / item; raw_dir.mkdir(parents=True, exist_ok=True)
    proc = start(a.item, a.model, runlog); started = time.time(); log(logf, f"started extract pid {proc.pid}")
    bad_api = 0
    while True:
        time.sleep(60)
        if proc.poll() is not None:
            if proc.returncode == 0:
                log(logf, f"extract exited with code {proc.returncode}; stopping watchdog"); return 0
            log(logf, f"extract exited early with code {proc.returncode}; restarting"); proc = start(a.item, a.model, runlog); started = time.time(); continue
        bad_api = 0 if ollama_ok() else bad_api + 1
        if bad_api:
            log(logf, f"Ollama not answering /api/ps ({bad_api} checks in a row)")
        last = max(newest_output_mtime(raw_dir), started)
        idle_min = (time.time() - last) / 60
        if bad_api >= 3 or idle_min > a.stall_minutes:
            reason = "Ollama unresponsive" if bad_api >= 3 else f"no new output for {idle_min:.0f} min"
            log(logf, f"stalled ({reason}): killing pid {proc.pid}, restarting extract")
            proc.kill(); proc.wait()
            subprocess.run(["ollama", "stop", a.model], capture_output=True, timeout=60)
            time.sleep(5)
            proc = start(a.item, a.model, runlog); started = time.time(); bad_api = 0
        else:
            log(logf, f"ok: pid {proc.pid} alive, Ollama up, last output {idle_min:.1f} min ago")


if __name__ == "__main__":
    sys.exit(main())
