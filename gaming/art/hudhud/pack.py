#!/usr/bin/env python3
"""Pack transparent PNG parts into 2048×2048 WebP atlases for Hudhud.

No art is bundled with this tool. A production input folder contains PNG parts;
each part may have a `<name>.part.json` sidecar with pivot and provenance:

  {"pivot":{"x":0.5,"y":0.5},"maker":"...","licence":"..."}

Pivot x/y are normalized within the source part (0 at the left/top, 1 at the
right/bottom). The Phaser frame map carries the same normalized pivot as extra
metadata; the manifest also records pixel pivot coordinates.

Usage:
  python3 art/hudhud/pack.py <parts-folder> <out-folder> [--name NAME]
  python3 art/hudhud/pack.py <parts-folder> <out-folder> [--name NAME] --check
"""
from __future__ import annotations

import hashlib
import json
import sys
from dataclasses import dataclass
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # Pillow is already used by repository media tooling.
    raise SystemExit("Pillow is required: the repository's media/image tooling already uses it")

SIZE = 2048
PAD = 2


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


@dataclass
class Part:
    path: Path
    name: str
    image: Image.Image
    pivot: dict[str, float]
    maker: str
    licence: str


def load_parts(folder: Path) -> list[Part]:
    files = sorted(p for p in folder.iterdir() if p.suffix.lower() == ".png" and not p.name.startswith("."))
    if not files:
        raise SystemExit(f"no PNG parts in {folder}")
    out = []
    for path in files:
        sidecar = path.with_suffix(".part.json")
        meta = {}
        if sidecar.exists():
            try:
                meta = json.loads(sidecar.read_text())
            except Exception as exc:
                raise SystemExit(f"{sidecar.name}: invalid JSON: {exc}")
        pivot = meta.get("pivot", {"x": 0.5, "y": 0.5})
        try:
            px, py = float(pivot["x"]), float(pivot["y"])
        except Exception:
            raise SystemExit(f"{sidecar.name}: pivot must contain numeric x and y")
        if not (0 <= px <= 1 and 0 <= py <= 1):
            raise SystemExit(f"{sidecar.name}: pivot x/y must be normalized between 0 and 1")
        im = Image.open(path).convert("RGBA")
        if im.width > SIZE - PAD * 2 or im.height > SIZE - PAD * 2:
            raise SystemExit(f"{path.name}: {im.width}×{im.height} cannot fit a {SIZE} atlas with padding")
        out.append(Part(
            path=path,
            name=path.stem,
            image=im,
            pivot={"x": px, "y": py},
            maker=str(meta.get("maker", "unspecified")),
            licence=str(meta.get("licence", "unspecified")),
        ))
    return out


def pack(parts: list[Part]) -> list[list[tuple[Part, int, int]]]:
    """Shelf-pack parts. Deterministic; adequate for cut-out game parts."""
    ordered = sorted(parts, key=lambda p: (-p.image.height, -p.image.width, p.name))
    atlases: list[list[tuple[Part, int, int]]] = []
    current: list[tuple[Part, int, int]] = []
    x = y = PAD
    shelf_h = 0
    for part in ordered:
        w, h = part.image.size
        if x + w + PAD > SIZE:
            x = PAD
            y += shelf_h + PAD
            shelf_h = 0
        if y + h + PAD > SIZE:
            atlases.append(current)
            current = []
            x = y = PAD
            shelf_h = 0
        current.append((part, x, y))
        x += w + PAD
        shelf_h = max(shelf_h, h)
    if current:
        atlases.append(current)
    return atlases


def frame_map(placed: list[tuple[Part, int, int]]) -> dict:
    frames = {}
    for part, x, y in placed:
        w, h = part.image.size
        frames[part.name] = {
            "frame": {"x": x, "y": y, "w": w, "h": h},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": w, "h": h},
            "sourceSize": {"w": w, "h": h},
            "pivot": part.pivot,
        }
    return {
        "frames": frames,
        "meta": {
            "app": "islam.museum hudhud atlas pipeline",
            "version": "1.0",
            "format": "RGBA8888",
            "size": {"w": SIZE, "h": SIZE},
            "scale": "1",
        },
    }


def write(parts_folder: Path, out_folder: Path, name: str) -> dict:
    parts = load_parts(parts_folder)
    atlases = pack(parts)
    out_folder.mkdir(parents=True, exist_ok=True)
    manifest_atlases = []
    for index, placed in enumerate(atlases):
        suffix = str(index) if len(atlases) > 1 else ""
        atlas_name = f"{name}{suffix}"
        image_path = out_folder / f"{atlas_name}.webp"
        canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        entries = []
        for part, x, y in placed:
            canvas.alpha_composite(part.image, (x, y))
            w, h = part.image.size
            entries.append({
                "frame": part.name,
                "sourceFile": part.path.name,
                "sha256": sha(part.path),
                "dimensions": {"w": w, "h": h},
                "atlasPosition": {"x": x, "y": y},
                "pivot": {
                    "normalized": part.pivot,
                    "pixels": {"x": round(part.pivot["x"] * w, 4), "y": round(part.pivot["y"] * h, 4)},
                },
                "decodedBytes": w * h * 4,
                "provenance": {
                    "maker": part.maker,
                    "licence": part.licence,
                    "transformations": ["converted to RGBA", "packed without scaling or rotation", "lossless WebP"],
                },
            })
        canvas.save(image_path, "WEBP", lossless=True, quality=100, method=4)
        frames = frame_map(placed)
        frames["meta"]["image"] = image_path.name
        json_path = out_folder / f"{atlas_name}.json"
        json_path.write_text(json.dumps(frames, indent=2, sort_keys=True) + "\n")
        manifest_atlases.append({
            "id": atlas_name,
            "image": {"path": image_path.name, "width": SIZE, "height": SIZE, "bytes": image_path.stat().st_size, "sha256": sha(image_path)},
            "frameMap": {"path": json_path.name, "bytes": json_path.stat().st_size, "sha256": sha(json_path), "format": "phaser-json-hash"},
            "parts": entries,
        })
    return {
        "format": "im.hudhud.texture-atlases",
        "version": 1,
        "atlasSize": SIZE,
        "padding": PAD,
        "input": str(parts_folder),
        "atlases": manifest_atlases,
    }


def write_manifest(out_folder: Path, name: str, manifest: dict) -> Path:
    path = out_folder / f"{name}.manifest.json"
    path.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    return path


def check(parts_folder: Path, out_folder: Path, name: str) -> None:
    parts = load_parts(parts_folder)
    manifest_path = out_folder / f"{name}.manifest.json"
    if not manifest_path.exists():
        raise SystemExit(f"missing manifest: run without --check first ({manifest_path})")
    manifest = json.loads(manifest_path.read_text())
    if manifest.get("format") != "im.hudhud.texture-atlases":
        raise SystemExit("manifest format is not im.hudhud.texture-atlases")
    recorded = {}
    errors = []
    for atlas in manifest.get("atlases", []):
        for kind in ["image", "frameMap"]:
            item = atlas.get(kind, {})
            path = out_folder / item.get("path", "")
            if not path.exists():
                errors.append(f"missing {item.get('path')}")
            elif sha(path) != item.get("sha256"):
                errors.append(f"{path.name} changed since the manifest was renewed")
        for part in atlas.get("parts", []):
            recorded[part["sourceFile"]] = part
    current = {p.path.name: p for p in parts}
    if set(current) != set(recorded):
        errors.append(f"input files differ: current {sorted(set(current)-set(recorded)) or 'none extra'}; missing {sorted(set(recorded)-set(current)) or 'none'}")
    for filename, part in current.items():
        old = recorded.get(filename)
        if old and sha(part.path) != old.get("sha256"):
            errors.append(f"source changed without renewing the manifest: {filename}")
    if errors:
        raise SystemExit("atlas check failed:\n- " + "\n- ".join(errors))
    print(f"atlas check passed: {len(parts)} parts, {len(manifest.get('atlases', []))} atlas(es)")


def main() -> None:
    import argparse
    parser = argparse.ArgumentParser(description="pack Hudhud PNG parts into 2048 WebP atlases")
    parser.add_argument("parts_folder")
    parser.add_argument("out_folder")
    parser.add_argument("--name", default="hudhud")
    parser.add_argument("--check", action="store_true")
    ns = parser.parse_args()
    checking = ns.check
    name = ns.name
    parts_folder, out_folder = Path(ns.parts_folder), Path(ns.out_folder)
    if checking:
        check(parts_folder, out_folder, name)
        return
    manifest = write(parts_folder, out_folder, name)
    path = write_manifest(out_folder, name, manifest)
    if len(manifest["atlases"]) > 1:
        print(f"needed {len(manifest['atlases'])} atlases at 2048×2048; no larger atlas was written")
    print(f"wrote {len(manifest['atlases'])} atlas(es); manifest {path}")


if __name__ == "__main__":
    main()
