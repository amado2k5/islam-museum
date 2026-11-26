#!/usr/bin/env python3
"""Writes gaming/art/manifest.json: what each asset was made from and exactly what came out.

The models and textures are media, so they are not in git (gaming/media/ is ignored). This file is: for each asset it
records the source scripts with their checksums and every output file with its size and checksum, so that anyone can
run the scripts and see whether they got the same bytes, and so that a host can be checked against it.

Usage, from gaming/:  python3 art/manifest.py [--check]
"""
import hashlib
import json
import pathlib
import struct
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
MODELS = HERE.parent / "media" / "models"
ASSETS = [{"id": "granada/mill", "game": "granada", "title": "The watermill", "script": "blender/granada_mill.py", "folder": "granada", "entry": "mill.gltf"}]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def describe(asset):
    folder = MODELS / asset["folder"]
    entry = folder / asset["entry"]
    if not entry.exists():
        return None
    gltf = json.loads(entry.read_text())
    files = [entry] + [folder / b["uri"] for b in gltf.get("buffers", [])] + [folder / i["uri"] for i in gltf.get("images", [])]
    triangles = 0
    for mesh in gltf["meshes"]:
        for primitive in mesh["primitives"]:
            triangles += gltf["accessors"][primitive["indices"]]["count"] // 3
    return {
        "id": asset["id"],
        "game": asset["game"],
        "title": asset["title"],
        "madeBy": "this repository's own scripts, run in Blender; no file from outside, no photograph",
        "licence": "the scripts: MIT, with the code; what they make: CC BY-SA 4.0, with the museum's media of its own",
        "sources": [{"path": f"art/{p}", "sha256": sha(HERE / p)} for p in ["blender/common.py", asset["script"]]],
        "objects": [n["name"] for n in gltf["nodes"] if "mesh" in n],
        # Where each part's origin is, in the export's own axes (y up; x along the building).
        "placed": {n["name"]: [round(v, 4) for v in n.get("translation", [0, 0, 0])] for n in gltf["nodes"] if "mesh" in n},
        "materials": [m["name"] for m in gltf["materials"]],
        "triangles": triangles,
        "bytes": sum(f.stat().st_size for f in files),
        "files": [{"path": str(f.relative_to(MODELS)), "bytes": f.stat().st_size, "sha256": sha(f)} for f in files],
    }


def blender_version():
    try:
        return subprocess.run(["blender", "--version"], capture_output=True, text=True, timeout=60).stdout.splitlines()[0]
    except Exception:  # not installed here: the manifest then says what it was last built with
        return None


def main():
    target = HERE / "manifest.json"
    old = json.loads(target.read_text()) if target.exists() else {}
    built = [d for d in (describe(a) for a in ASSETS) if d]
    if not built:
        sys.exit("no asset has been built on this machine: run `npm run art:mill` first")
    manifest = {"format": "im.play.art", "version": 1, "tool": blender_version() or old.get("tool"), "where": "gaming/media/models/ on a machine that has run the scripts; not in git", "assets": built}
    text = json.dumps(manifest, indent=1) + "\n"
    if "--check" in sys.argv:
        if not target.exists() or target.read_text() != text:
            sys.exit("the models on this machine are not the ones gaming/art/manifest.json records")
        print("the models on this machine are the ones the manifest records")
        return
    target.write_text(text)
    for a in built:
        print(f"{a['id']}: {a['triangles']} triangles, {len(a['files'])} files, {a['bytes']:,} bytes")


_ = struct  # kept for binary glTF, which the pipeline does not write yet
main()
