#!/usr/bin/env python3
"""Transcribe Arabic (including Egyptian) lecture audio with Qwen3-ASR, fine-tuned for Arabic dialects.

Engine: oddadmix/qwen3-asr-1.7b-arabic-dialectal-v2 (Apache-2.0), a fine-tune of Qwen/Qwen3-ASR-1.7B-hf.
Its reported WER on the Egyptian split of the author's balanced test set is 0.322 (all 13 dialects in its card).
Runs on the Mac's GPU (MPS) through PyTorch, offline once the weights are cached. Works in 30-second windows;
each window becomes one segment with its start and end time, so the output has the same shape as mlx-whisper's
and can be compared window by window with scripts/harvest/audio/agree.py.

Writes per input file, into --out:
  <stem>.json       {"segments": [{"start", "end", "text"}]}
  <stem>.txt        one line per window, prefixed with [hh:mm:ss]
  <stem>.meta.json  model, licence, device, input checksum, timings
Resumable: a file whose <stem>.json exists is skipped.

Usage: python transcribe_qwen.py --out DIR FILE.mp3 ...
Needs transformers >= 5.13 and librosa (installed in ~/islam-museum-harvest/.venv-audio).
"""
import argparse, hashlib, json, sys, time
from pathlib import Path

MODEL_ID = "oddadmix/qwen3-asr-1.7b-arabic-dialectal-v2"
WINDOW_SECONDS = 30
PROMPT = ("<|im_start|>system\n<|im_end|>\n<|im_start|>user\n<|audio_start|><|audio_pad|><|audio_end|>"
          "<|im_end|>\n<|im_start|>assistant\n")


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def hms(seconds: float) -> str:
    s = int(seconds)
    return f"{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d}"


def load_model():
    import torch
    from transformers import AutoModelForMultimodalLM, AutoProcessor
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    processor = AutoProcessor.from_pretrained(MODEL_ID)
    model = AutoModelForMultimodalLM.from_pretrained(MODEL_ID, dtype=torch.float32).to(device)
    return processor, model, device


def transcribe(path: Path, out: Path, processor, model, device: str) -> None:
    import librosa, torch
    stem = path.stem
    if (out / f"{stem}.json").exists():
        print(f"skip {stem}: already transcribed", flush=True)
        return
    out.mkdir(parents=True, exist_ok=True)
    audio, _ = librosa.load(str(path), sr=16000, mono=True)
    started = time.time()
    segments = []
    step = WINDOW_SECONDS * 16000
    for i in range(0, len(audio), step):
        window = audio[i:i + step]
        if len(window) < 16000 // 2:  # skip sub-half-second tails
            continue
        inputs = processor(text=PROMPT, audio=window, sampling_rate=16000, return_tensors="pt").to(device)
        with torch.no_grad():
            ids = model.generate(**inputs, max_new_tokens=400, do_sample=False)
        gen = ids[:, inputs["input_ids"].shape[1]:]
        raw = processor.batch_decode(gen, skip_special_tokens=True)[0]
        text = raw.split("<asr_text>", 1)[-1].strip()
        start = i / 16000
        segments.append({"start": round(start, 2), "end": round(start + len(window) / 16000, 2), "text": text})
        if len(segments) % 20 == 0:
            print(f"  {stem}: {hms(start)} done", flush=True)
    elapsed = time.time() - started
    duration = len(audio) / 16000
    (out / f"{stem}.json").write_text(json.dumps({"segments": segments}, ensure_ascii=False, indent=1) + "\n",
                                      encoding="utf-8")
    lines = [f"[{hms(s['start'])}] {s['text']}" for s in segments if s["text"]]
    (out / f"{stem}.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    meta = {
        "input": path.name,
        "input_sha256": sha256(path),
        "engine": "qwen3-asr-arabic-dialectal (transformers)",
        "model": MODEL_ID,
        "licence": "Apache-2.0",
        "base_model": "Qwen/Qwen3-ASR-1.7B-hf",
        "window_seconds": WINDOW_SECONDS,
        "device": device,
        "duration_seconds": round(duration, 1),
        "run_seconds": round(elapsed, 1),
        "speed_x_realtime": round(duration / elapsed, 1) if elapsed else None,
        "run_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    (out / f"{stem}.meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"done {stem}: {hms(duration)} of audio in {elapsed:.0f}s ({meta['speed_x_realtime']}x)", flush=True)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+", type=Path)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()
    processor, model, device = load_model()
    for f in args.files:
        transcribe(f, args.out, processor, model, device)
    return 0


if __name__ == "__main__":
    sys.exit(main())
