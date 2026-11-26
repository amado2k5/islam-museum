#!/usr/bin/env python3
"""Writes gaming/art/manifest.json: what each asset was made from and exactly what came out.

The models and textures are media, so they are not in git (gaming/media/ is ignored). This file is: for each asset it
records the source scripts with their checksums and every output file with its size and checksum, so that anyone can
run the scripts and see whether they got the same bytes, and so that a host can be checked against it.

`assets` is the publishable baseline the game reads. `proofAssets` is local workshop evidence only; the publishing
worker deliberately does not read it, so a proof kept on one machine can never block publication of the baseline.

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
BASE_SOURCES = ["blender/common.py", "blender/kit.py"]
PROOF_SOURCES = ["blender/common3.py", "blender/kit3.py"]
ASSETS = [
    {"id": "granada/mill", "game": "granada", "title": "The watermill", "script": "blender/granada_mill.py", "folder": "granada/2", "entry": "mill.gltf"},
    {"id": "granada/town", "game": "granada", "title": "The town's kit: four houses, a wall, a tower, a gate, scaffolding, a stall", "script": "blender/granada_town.py", "folder": "granada/2", "entry": "town.gltf", "kit": "town.kit.json"},
    {"id": "granada/landmarks", "game": "granada", "title": "The larger pieces: a palace for the hill, an estate, a builders' crane", "script": "blender/granada_landmarks.py", "folder": "granada/2", "entry": "landmarks.gltf", "kit": "landmarks.kit.json"},
]
PROOF_ASSETS = [
    {"id": "granada/mill-3", "game": "granada", "title": "The watermill, finished set 3", "proof": True, "script": "blender/granada_mill3.py", "folder": "granada/3", "entry": "mill.gltf"},
    {"id": "granada/town-3", "game": "granada", "title": "The town's kit, finished set 3: four houses, a wall, a tower, a gate, scaffolding, a stall", "proof": True, "script": "blender/granada_town3.py", "folder": "granada/3", "entry": "town.gltf", "kit": "town.kit.json"},
    {"id": "granada/landmarks-3", "game": "granada", "title": "The larger pieces, finished set 3: a palace for the hill, an estate, a builders' crane", "proof": True, "script": "blender/granada_landmarks3.py", "folder": "granada/3", "entry": "landmarks.gltf", "kit": "landmarks.kit.json"},
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
    files = [entry] + [folder / b["uri"] for b in gltf.get("buffers", [])] + [folder / i["uri"] for i in gltf.get("images", [])]
    triangles = 0
    for mesh in gltf["meshes"]:
        for primitive in mesh["primitives"]:
            triangles += gltf["accessors"][primitive["indices"]]["count"] // 3
    proof = asset.get("proof")
    helpers = PROOF_SOURCES if proof else BASE_SOURCES
    return {
        "id": asset["id"],
        "game": asset["game"],
        "title": asset["title"],
        "madeBy": "the shapes: this repository's own scripts, run in Blender. The surfaces: photographs given to the public domain by Poly Haven, named in art/sources.json, where this machine had them; painted by the scripts where it did not",
        "licence": "the scripts: MIT, with the code; what they make: CC BY-SA 4.0, with the museum's media of its own; the photographed surfaces stay public domain (CC0)",
        "surfaces": [s["id"] for s in json.loads(SOURCES.read_text())["sources"]] if SOURCES.exists() and any("plaster" in i["uri"] for i in gltf.get("images", [])) else [],
        **({"kit": json.loads((folder / asset["kit"]).read_text())["pieces"]} if asset.get("kit") and (folder / asset["kit"]).exists() else {}),
        "sources": [{"path": f"art/{p}", "sha256": sha(HERE / p)} for p in helpers + [asset["script"]]],
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


def build_section(definitions, old_assets):
    """Describe what is present, but never erase the record of a set this machine has not rebuilt."""
    old_by_id = {a.get("id"): a for a in old_assets if isinstance(a, dict)}
    rows = []
    missing = []
    for asset in definitions:
        described = describe(asset)
        if described:
            rows.append(described)
        elif asset["id"] in old_by_id:
            rows.append(old_by_id[asset["id"]])
            missing.append(asset["id"])
    return rows, missing


def main():
    target = HERE / "manifest.json"
    old = json.loads(target.read_text()) if target.exists() else {}
    assets, missing_assets = build_section(ASSETS, old.get("assets", []) if isinstance(old.get("assets"), list) else [])
    proofs, missing_proofs = build_section(PROOF_ASSETS, old.get("proofAssets", []) if isinstance(old.get("proofAssets"), list) else [])
    if not assets and not proofs:
        sys.exit("no asset has been built on this machine: run `npm run art:mill` first")
    manifest = {
        "format": "im.play.art",
        "version": 1,
        "tool": blender_version() or old.get("tool"),
        "where": "gaming/media/models/ on a machine that has run the scripts; not in git",
        "assets": assets,
        "proofAssets": proofs,
    }
    text = json.dumps(manifest, indent=1) + "\n"
    if "--check" in sys.argv:
        if not target.exists() or target.read_text() != text:
            sys.exit("the models on this machine are not the ones gaming/art/manifest.json records")
        missing = missing_assets + missing_proofs
        if missing:
            sys.exit("the manifest preserves records for assets missing on this machine: " + ", ".join(missing))
        print("the models on this machine are the ones the manifest records")
        return
    target.write_text(text)
    for a in assets + proofs:
        print(f"{a['id']}: {a['triangles']} triangles, {len(a['files'])} files, {a['bytes']:,} bytes")


_ = struct  # kept for binary glTF, which the pipeline does not write yet
main()
