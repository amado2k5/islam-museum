#!/usr/bin/env python3
"""Prepares the wall, roof, timber and water tiles Codex made to the museum's brief for the valley's buildings.

The tiles are the model's imagining, draft, pending the founder's look; their prompts and checksums are in
/Users/ahmedabdelaal/Documents/islam-museum-game-art/manifest.jsonl. They arrive as 2048px PNGs; here each is scaled
to 1536 and saved as webp — wide enough that a wall or a roof slope stays clean, small enough that seven of them
are a reasonable thing to fetch beside the models. The game mirrors them at the edges (MirroredRepeatWrapping), so
the delivered seams do not show.

Output: gaming/media/models/granada/tile-<name>-1536.webp. Media is not in git; the manifest records the bytes.

Usage, from gaming/:  python3 art/make_tiles.py
"""
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
TILES = pathlib.Path("/Users/ahmedabdelaal/Documents/islam-museum-game-art/granada/textures")
OUT = HERE.parent / "media" / "models" / "granada"

# The file names the game asks for: the surface kind the material answers, then the tile's own name.
TILE = [
    ("lime-plaster-wall", "lime-plaster-wall-weathered-tile-2048.png"),
    ("rammed-earth-wall", "red-ochre-rammed-earth-wall-tile-2048.png"),
    ("rubble-stone-wall", "rubble-stone-wall-tile-2048.png"),
    ("clay-roof", "clay-roof-tiles-tile-2048.png"),
    ("timber-planks", "weathered-timber-planks-tile-2048.png"),
    ("river-water", "river-water-surface-tile-2048.png"),
    ("canal-water", "canal-water-surface-tile-2048.png"),
]


def main() -> int:
    try:
        from PIL import Image
    except ImportError:
        print("PIL is needed (pip install pillow)", file=sys.stderr)
        return 2
    OUT.mkdir(parents=True, exist_ok=True)
    for name, file in TILE:
        src = TILES / file
        if not src.exists():
            print(f"missing: {src}", file=sys.stderr)
            return 2
        im = Image.open(src).convert("RGB")
        if im.size != (2048, 2048):
            print(f"{file}: expected 2048x2048, got {im.size}", file=sys.stderr)
            return 2
        im = im.resize((1536, 1536), Image.LANCZOS)
        out = OUT / f"tile-{name}-1536.webp"
        im.save(out, "WEBP", quality=82, method=6)
        print(f"{out.name}: {out.stat().st_size} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
