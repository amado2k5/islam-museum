#!/usr/bin/env python3
"""Transcribe lecture audio on the Mac with mlx-whisper (local, offline once the model is cached).

Writes, per input file, into --out:
  <stem>.json   segments with start/end seconds (the citation anchors)
  <stem>.txt    plain text, one segment per line, prefixed with [HH:MM:SS]
  <stem>.meta.json  model, command, input sha256, duration, run time, machine

Skips a file whose <stem>.json already exists (resumable). Reads the audio only; never edits it.
Usage:
  python transcribe.py --out DIR [--model mlx-community/whisper-large-v3-mlx] [--lang ar] FILE.mp3 ...
"""
import argparse, hashlib, json, os, shutil, subprocess, sys, time
from pathlib import Path

MLX = shutil.which("mlx_whisper") or "/opt/homebrew/Caskroom/miniconda/base/bin/mlx_whisper"
DEFAULT_MODEL = "mlx-community/whisper-large-v3-mlx"  # measured better than whisper-large-v3-turbo on Arabic lectures
DEFAULT_PROMPT = "درس صوتي للشيخ عمر عبد الكافي. بسم الله الرحمن الرحيم. قال الله تعالى. قال رسول الله."


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def hms(seconds: float) -> str:
    s = int(seconds)
    return f"{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d}"


def transcribe(path: Path, out: Path, model: str, lang: str, prompt: str) -> None:
    stem = path.stem
    if (out / f"{stem}.json").exists():
        print(f"skip {stem}: already transcribed")
        return
    out.mkdir(parents=True, exist_ok=True)
    cmd = [MLX, str(path), "--model", model, "--language", lang, "--task", "transcribe",
           "--output-format", "json", "--output-dir", str(out), "--output-name", stem,
           "--condition-on-previous-text", "False", "--initial-prompt", prompt, "--verbose", "False"]
    started = time.time()
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    elapsed = time.time() - started
    data = json.loads((out / f"{stem}.json").read_text(encoding="utf-8"))
    lines = [f"[{hms(s['start'])}] {s['text'].strip()}" for s in data.get("segments", []) if s["text"].strip()]
    (out / f"{stem}.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    duration = data["segments"][-1]["end"] if data.get("segments") else 0.0
    meta = {
        "input": path.name,
        "input_sha256": sha256(path),
        "model": model,
        "language": lang,
        "initial_prompt": prompt,
        "duration_seconds": round(duration, 1),
        "run_seconds": round(elapsed, 1),
        "speed_x_realtime": round(duration / elapsed, 1) if elapsed else None,
        "tool": "mlx_whisper",
        "machine": "founder's Mac (Apple M4 Max)",
        "run_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    (out / f"{stem}.meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"done {stem}: {hms(duration)} of audio in {elapsed:.0f}s ({meta['speed_x_realtime']}x)")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+", type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--lang", default="ar")
    ap.add_argument("--prompt", default=DEFAULT_PROMPT)
    args = ap.parse_args()
    if not os.path.exists(MLX):
        print("mlx_whisper not found: pip/uv install mlx-whisper into the harvest venv", file=sys.stderr)
        return 2
    for f in args.files:
        transcribe(f, args.out, args.model, args.lang, args.prompt)
    return 0


if __name__ == "__main__":
    sys.exit(main())
