#!/usr/bin/env python3
"""Builds the valley's ground-detail atlas from the AI-painted tiles Codex made to the museum's brief.

The tiles are the model's imagining, draft, pending the founder's look; their prompts and checksums are in
/Users/ahmedabdelaal/Documents/islam-museum-game-art/manifest.jsonl. They are not perfectly seamless as delivered
(their wrap edges differ by 10 to 22 of 255), so the game samples them with mirrored wrapping, which hides the seam.

Output: gaming/media/models/granada/ground-atlas.jpg — a grid of 4 by 3 slots of 1024 px, one kind a slot — and the
mean colour of each slot in linear light, printed as JSON for the shader (multiplying a colour by texture/mean adds
the painting's detail without taking the land's own colours away). Media is not in git; the manifest records the bytes.

Usage, from gaming/:  python3 art/make_ground_atlas.py
"""
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
TILES = pathlib.Path("/Users/ahmedabdelaal/Documents/islam-museum-game-art/granada/textures")
OUT = HERE.parent / "media" / "models" / "granada" / "ground-atlas.jpg"

# The slot order is the contract the shader uses: index into a grid four slots wide.
SLOTS = [
    ("plough", "olive-terrace-soil-tile-2048.png"),
    ("wheat-green", "wheat-field-green-tile-2048.png"),
    ("wheat-ripe", "wheat-field-ripe-tile-2048.png"),
    ("stubble", "stubble-after-harvest-tile-2048.png"),
    ("vegetables", "irrigated-vegetable-beds-tile-2048.png"),
    ("dry-grass", "dry-grass-hillside-tile-2048.png"),
    ("riverbank", "riverbank-mud-and-pebbles-tile-2048.png"),
    ("dirt-road", "dirt-road-cart-ruts-tile-2048.png"),
    ("cobbles", "cobbled-street-tile-2048.png"),
]
SLOT = 512
COLS = 4


def main() -> int:
    try:
        from PIL import Image
    except ImportError:
        print("PIL is needed (pip install pillow)", file=sys.stderr)
        return 2
    rows = (len(SLOTS) + COLS - 1) // COLS
    atlas = Image.new("RGB", (COLS * SLOT, rows * SLOT))
    means = {}
    for i, (name, file) in enumerate(SLOTS):
        src = TILES / file
        if not src.exists():
            print(f"missing: {src}", file=sys.stderr)
            return 2
        im = Image.open(src).convert("RGB").resize((SLOT, SLOT), Image.LANCZOS)
        x, y = (i % COLS) * SLOT, (i // COLS) * SLOT
        atlas.paste(im, (x, y))
        # Mean in linear light, so the shader can normalise the detail: sRGB bytes to linear, averaged per channel.
        small = im.resize((64, 64))
        px = list(small.getdata())
        # The mean in linear light, the space the shader multiplies in: texture divided by it averages to one,
        # so the detail neither darkens nor tints the colour it modulates.
        lin = [sum((c[0] / 255) ** 2.2 for c in px) / len(px),
               sum((c[1] / 255) ** 2.2 for c in px) / len(px),
               sum((c[2] / 255) ** 2.2 for c in px) / len(px)]
        means[name] = {"slot": i, "mean": [round(v, 4) for v in lin]}
    # Empty slots take the dry grass, so a wrong index still reads as ground.
    grass = Image.open(TILES / SLOTS[5][1]).convert("RGB").resize((SLOT, SLOT), Image.LANCZOS)
    for i in range(len(SLOTS), COLS * rows):
        atlas.paste(grass, ((i % COLS) * SLOT, (i // COLS) * SLOT))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(OUT, "JPEG", quality=87, optimize=True)
    print(json.dumps({"out": str(OUT), "bytes": OUT.stat().st_size, "slots": means}, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
