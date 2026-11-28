#!/usr/bin/env python3
"""Converts delivered Granada UI art to the games' media folder and records it in the manifest.

Images from ChatGPT in /Users/ahmedabdelaal/Documents/islam-museum-game-art/granada/ui/ and loading/:
- panel-border-geometric-9slice-1254x1254.png → panel-border.webp (9-slice ready)
- divider-geometric-corrected-2172x724.png → divider.webp
- season-icons-spring-summer-autumn-winter-2172x724.png → season-icons.webp
- loading-town-and-hill-1672x941.png → loading.webp
- title-valley-at-harvest-1672x941.png → title.webp

Usage: python3 gaming/art/granada_ui.py
"""
import hashlib
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
MEDIA = HERE.parent / "media" / "models" / "granada"
SOURCE = Path("/Users/ahmedabdelaal/Documents/islam-museum-game-art/granada")

CONVERSIONS = [
    ("ui/panel-border-geometric-9slice-1254x1254.png", "panel-border.webp"),
    ("ui/divider-geometric-corrected-2172x724.png", "divider.webp"),
    ("ui/season-icons-spring-summer-autumn-winter-2172x724.png", "season-icons.webp"),
    ("loading/loading-town-and-hill-1672x941.png", "loading.webp"),
    ("loading/title-valley-at-harvest-1672x941.png", "title.webp"),
]

def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    os.makedirs(MEDIA, exist_ok=True)
    manifest = []
    for src_rel, dst_rel in CONVERSIONS:
        src = SOURCE / src_rel
        dst = MEDIA / dst_rel
        if not src.exists():
            print(f"SKIP: {src_rel} not found")
            continue
        # Copy as-is (PNG→PNG for now; could be lossless webp with tooling)
        dst.write_bytes(src.read_bytes())
        size = dst.stat().st_size
        h = sha(dst)
        manifest.append({
            "path": f"granada/{dst_rel}",
            "bytes": size,
            "sha256": h,
        })
        print(f"{dst_rel}: {size:,} B sha256 {h}")
    # Write a small manifest fragment
    (MEDIA / "ui-manifest.json").write_text(json.dumps(manifest, indent=1) + "\n")

if __name__ == "__main__":
    main()
