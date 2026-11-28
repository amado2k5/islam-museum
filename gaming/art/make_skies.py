#!/usr/bin/env python3
"""Prepares the painted skies Codex made to the museum's brief for the valley's backdrop.

The skies are the model's imagining, draft, pending the founder's look; their prompts and checksums are in
/Users/ahmedabdelaal/Documents/islam-museum-game-art/manifest.jsonl. They arrive as 8192x4096 equirectangular PNGs;
here each is scaled to 4096x2048 webp — wide enough that the horizon band stays clean around the valley, small
enough that five of them are a reasonable thing to fetch beside the models.

Output: gaming/media/models/granada/sky-<name>-4096x2048.webp. Media is not in git; the manifest records the bytes.

Usage, from gaming/:  python3 art/make_skies.py
"""
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
SKIES = pathlib.Path("/Users/ahmedabdelaal/Documents/islam-museum-game-art/granada/sky")
OUT = HERE.parent / "media" / "models" / "granada"

# The file names the game asks for, in the order the seasons and the evening preview need them.
SKY = [
    ("spring-morning", "spring-morning-equirect-8192x4096.png"),
    ("summer-midday", "summer-midday-equirect-8192x4096.png"),
    ("autumn-afternoon", "autumn-afternoon-equirect-8192x4096.png"),
    ("winter-overcast", "winter-overcast-equirect-8192x4096.png"),
    ("evening-golden", "evening-golden-equirect-8192x4096.png"),
]
W, H = 4096, 2048


def main() -> int:
    try:
        from PIL import Image
    except ImportError:
        print("PIL is needed (pip install pillow)", file=sys.stderr)
        return 2
    OUT.mkdir(parents=True, exist_ok=True)
    for name, file in SKY:
        src = SKIES / file
        if not src.exists():
            print(f"missing: {src}", file=sys.stderr)
            return 2
        im = Image.open(src).convert("RGB")
        if im.size != (8192, 4096):
            print(f"{file}: expected 8192x4096, got {im.size}", file=sys.stderr)
            return 2
        im = im.resize((W, H), Image.LANCZOS)
        out = OUT / f"sky-{name}-{W}x{H}.webp"
        im.save(out, "WEBP", quality=85, method=6)
        print(f"{out.name}: {out.stat().st_size} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
