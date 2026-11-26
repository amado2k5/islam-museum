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
ASSETS = [
    {"id": "granada/mill", "game": "granada", "title": "The watermill", "script": "blender/granada_mill.py", "folder": "granada/2", "entry": "mill.gltf"},
    {"id": "granada/town", "game": "granada", "title": "The town's kit: four houses, a wall, a tower, a gate, scaffolding, a stall", "script": "blender/granada_town.py", "folder": "granada/2", "entry": "town.gltf", "kit": "town.kit.json"},
    {"id": "granada/landmarks", "game": "granada", "title": "The larger pieces: a palace for the hill, an estate, a builders' crane", "script": "blender/granada_landmarks.py", "folder": "granada/2", "entry": "landmarks.gltf", "kit": "landmarks.kit.json"},
    # The palace the game shows: the lighter making of the palace written as its own script, in a folder of its own
    # that borrows the first set's textures (art/derive_palace.py copies it there from the export).
    {"id": "granada/palace", "game": "granada", "title": "The palace on the hill, written as its own script (its lighter making)", "script": "blender/granada_palace_c.py", "folder": "granada/p1", "entry": "palace.gltf", "also": ["blender/author.py", "derive_palace.py"]},
    # Candidate C, an art set under evaluation and not the game's art: one palace, and two lighter makings of it.
    {"id": "granada/palace-c", "game": "granada", "title": "Candidate C (under evaluation): a palace written as its own script", "script": "blender/granada_palace_c.py", "folder": "granada/c", "entry": "palace.gltf", "evaluation": True, "also": ["blender/author.py"]},
    {"id": "granada/palace-c-lod1", "game": "granada", "title": "Candidate C (under evaluation): the palace, lighter", "script": "blender/granada_palace_c.py", "folder": "granada/c", "entry": "palace-lod1.gltf", "evaluation": True, "also": ["blender/author.py"]},
    {"id": "granada/palace-c-lod2", "game": "granada", "title": "Candidate C (under evaluation): the palace, lightest, by temporary decimation", "script": "blender/granada_palace_c.py", "folder": "granada/c", "entry": "palace-lod2.gltf", "evaluation": True, "also": ["blender/author.py"]},
]
SOURCES = HERE / "sources.json"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def describe(asset):
    folder = MODELS / asset["folder"]
    entry = folder / asset["entry"]
    if not entry.exists():
        return None
    gltf = json.loads(entry.read_text())
    # A file may borrow another folder's textures ("../2/textures/…"): its path is written as the host has it.
    files = [entry] + [(folder / b["uri"]).resolve() for b in gltf.get("buffers", [])] + [(folder / i["uri"]).resolve() for i in gltf.get("images", [])]
    triangles = 0
    for mesh in gltf["meshes"]:
        for primitive in mesh["primitives"]:
            triangles += gltf["accessors"][primitive["indices"]]["count"] // 3
    return {
        "id": asset["id"],
        "game": asset["game"],
        "title": asset["title"],
        # An asset under evaluation is not the game's art: the game draws it only when the page's address asks for it,
        # and the budget that holds the game's own buildings is not claimed for it (art/art.gtest.ts).
        **({"evaluation": True} if asset.get("evaluation") else {}),
        "madeBy": "the shapes: this repository's own scripts, run in Blender. The surfaces: photographs given to the public domain by Poly Haven, named in art/sources.json, where this machine had them; painted by the scripts where it did not",
        "licence": "the scripts: MIT, with the code; what they make: CC BY-SA 4.0, with the museum's media of its own; the photographed surfaces stay public domain (CC0)",
        "surfaces": [s["id"] for s in json.loads(SOURCES.read_text())["sources"]] if SOURCES.exists() and any("plaster" in i["uri"] for i in gltf.get("images", [])) else [],
        **({"kit": json.loads((folder / asset["kit"]).read_text())["pieces"]} if asset.get("kit") and (folder / asset["kit"]).exists() else {}),
        "sources": [{"path": f"art/{p}", "sha256": sha(HERE / p)} for p in ["blender/common.py", "blender/kit.py", *asset.get("also", []), asset["script"]]],
        "objects": [n["name"] for n in gltf["nodes"] if "mesh" in n],
        # Where each part's origin is, in the export's own axes (y up; x along the building).
        "placed": {n["name"]: [round(v, 4) for v in n.get("translation", [0, 0, 0])] for n in gltf["nodes"] if "mesh" in n},
        "materials": [m["name"] for m in gltf["materials"]],
        "triangles": triangles,
        "bytes": sum(f.stat().st_size for f in files),
        "files": [{"path": str(f.resolve().relative_to(MODELS.resolve())), "bytes": f.stat().st_size, "sha256": sha(f)} for f in files],
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
