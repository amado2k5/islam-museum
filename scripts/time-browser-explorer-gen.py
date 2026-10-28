#!/usr/bin/env python3
"""Timeline Explorer image generator: runs on the founder's Mac before deployment, never at runtime.

Reads the jobs written by scripts/time-browser-explorer-images.ts and, for each node, renders an adult backdrop and a
kids backdrop with local SDXL (Apple GPU), then converts them to WebP in site/public/media/time-browser/explorer/.
A job whose files already exist is skipped, so the queue can be stopped and restarted at any time, and two sessions
can run it on different subjects without touching each other's files.

Usage (from the repository root, in the local image environment):
  HF_HOME=/Volumes/exmicroSD/hf-cache ~/tb-img-venv/bin/python scripts/time-browser-explorer-gen.py \
      .cache/time-browser/explorer-image-jobs.json --agent claude
Progress is appended to .time-browser-logs/<agent>.log (git-ignored): ISO time | explorer-images | action | result | next.
"""
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime, timezone

OUT = "site/public/media/time-browser/explorer"
SIZE = (1024, 640)  # a wide stage backdrop; the same file is the detail image


def log(agent: str, action: str, result: str, nxt: str) -> None:
    os.makedirs(".time-browser-logs", exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with open(f".time-browser-logs/{agent}.log", "a", encoding="utf-8") as f:
        f.write(f"{stamp} | explorer-images | {action} | {result} | {nxt}\n")


def to_webp(png: str, dest: str) -> None:
    subprocess.run(["cwebp", "-quiet", "-q", "78", png, "-o", dest], check=True)


def main() -> None:
    jobs_path = sys.argv[1]
    agent = sys.argv[sys.argv.index("--agent") + 1] if "--agent" in sys.argv else "unknown"
    jobs = json.load(open(jobs_path, encoding="utf-8"))
    os.makedirs(OUT, exist_ok=True)
    todo = [j for j in jobs if not (os.path.exists(f"{OUT}/{j['slug']}.webp") and os.path.exists(f"{OUT}/{j['slug']}-kids.webp"))]
    print(f"queue {len(todo)} of {len(jobs)}", flush=True)
    log(agent, f"start queue {jobs_path}", f"{len(todo)} of {len(jobs)} to do", "generate")
    if not todo:
        return

    import torch
    from diffusers import StableDiffusionXLPipeline

    pipe = StableDiffusionXLPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, variant="fp16", use_safetensors=True
    ).to("mps")
    negative = "people, person, face, human figure, crowd, text, letters, watermark, signature, modern objects"
    with tempfile.TemporaryDirectory() as tmp:
        for i, j in enumerate(todo):
            for suffix, prompt in (("", j["prompt"]), ("-kids", j["kidsPrompt"])):
                dest = f"{OUT}/{j['slug']}{suffix}.webp"
                if os.path.exists(dest):
                    continue
                img = pipe(prompt=prompt, negative_prompt=negative, num_inference_steps=30, guidance_scale=6.5,
                           width=SIZE[0], height=SIZE[1]).images[0]
                png = os.path.join(tmp, "out.png")
                img.save(png)
                to_webp(png, dest)
            print(f"[{i + 1}/{len(todo)}] {j['slug']}", flush=True)
            log(agent, f"image {j['slug']}", "adult and kids saved", f"{len(todo) - i - 1} left")
    log(agent, "queue done", f"{len(todo)} node(s)", "rebuild explorer, validate, PR")


if __name__ == "__main__":
    main()
