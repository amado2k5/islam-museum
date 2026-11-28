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
    # The distance makings (LOD1) of the town set, the landmarks and the mill: the exported glTFs decimated to half
    # their triangles by blender/granada_lods.py, for the far view. "own_sources" because the shared kit is not what
    # makes them; "also" names the script that made the glTF they are decimated from.
    {"id": "granada/town-lod1", "game": "granada", "title": "The town's kit, lighter for the distance", "script": "blender/granada_lods.py", "folder": "granada/2", "entry": "town-lod1.gltf", "own_sources": True, "also": ["blender/granada_town.py"]},
    {"id": "granada/landmarks-lod1", "game": "granada", "title": "The larger pieces, lighter for the distance", "script": "blender/granada_lods.py", "folder": "granada/2", "entry": "landmarks-lod1.gltf", "own_sources": True, "also": ["blender/granada_landmarks.py"]},
    {"id": "granada/mill-lod1", "game": "granada", "title": "The watermill, lighter for the distance", "script": "blender/granada_lods.py", "folder": "granada/2", "entry": "mill-lod1.gltf", "own_sources": True, "also": ["blender/granada_mill.py"]},
    # The palace the game shows: the lighter making of the palace written as its own script, in a folder of its own
    # that borrows the first set's textures (art/derive_palace.py copies it there from the export).
    {"id": "granada/palace", "game": "granada", "title": "The palace on the hill, written as its own script (its lighter making)", "script": "blender/granada_palace_c.py", "folder": "granada/p1", "entry": "palace.gltf", "also": ["blender/author.py", "derive_palace.py"]},
    # Candidate C, an art set under evaluation and not the game's art: one palace, and two lighter makings of it.
    {"id": "granada/palace-c", "game": "granada", "title": "Candidate C (under evaluation): a palace written as its own script", "script": "blender/granada_palace_c.py", "folder": "granada/c", "entry": "palace.gltf", "evaluation": True, "also": ["blender/author.py"]},
    {"id": "granada/palace-c-lod1", "game": "granada", "title": "Candidate C (under evaluation): the palace, lighter", "script": "blender/granada_palace_c.py", "folder": "granada/c", "entry": "palace-lod1.gltf", "evaluation": True, "also": ["blender/author.py"]},
    {"id": "granada/palace-c-lod2", "game": "granada", "title": "Candidate C (under evaluation): the palace, lightest, by temporary decimation", "script": "blender/granada_palace_c.py", "folder": "granada/c", "entry": "palace-lod2.gltf", "evaluation": True, "also": ["blender/author.py"]},
    {"id": "granada/animals/sheep", "game": "granada", "title": "A sheep, body and four legs at their joints", "script": "blender/granada_animals.py", "folder": "granada/animals", "entry": "sheep.gltf"},
    {"id": "granada/animals/goat", "game": "granada", "title": "A goat, body and four legs at their joints", "script": "blender/granada_animals.py", "folder": "granada/animals", "entry": "goat.gltf"},
    {"id": "granada/animals/horse", "game": "granada", "title": "A horse with a saddle cloth, body and four legs at their joints", "script": "blender/granada_animals.py", "folder": "granada/animals", "entry": "horse.gltf"},
    {"id": "granada/animals/ox", "game": "granada", "title": "An ox in its cart's frame, body and four legs at their joints", "script": "blender/granada_animals.py", "folder": "granada/animals", "entry": "ox.gltf"},
    {"id": "granada/animals/donkey", "game": "granada", "title": "A donkey, body and four legs at their joints", "script": "blender/granada_animals.py", "folder": "granada/animals", "entry": "donkey.gltf"},
    {"id": "granada/animals/camel", "game": "granada", "title": "A camel with its hump, body and four legs at their joints", "script": "blender/granada_animals.py", "folder": "granada/animals", "entry": "camel.gltf"},
    {"id": "golden-age/market", "game": "golden-age", "title": "A row of shops behind an arcade, awnings out", "script": "blender/golden_age_buildings.py", "folder": "golden-age", "entry": "market.gltf"},
    {"id": "golden-age/bath", "game": "golden-age", "title": "The hot room of a bath: a square hall under one broad dome with four small ones", "script": "blender/golden_age_buildings.py", "folder": "golden-age", "entry": "bath.gltf"},
    {"id": "golden-age/library", "game": "golden-age", "title": "A library's great hall: a tiled portal and a turquoise dome", "script": "blender/golden_age_buildings.py", "folder": "golden-age", "entry": "library.gltf"},
    {"id": "golden-age/school", "game": "golden-age", "title": "A school's teaching hall: an arcade of five bays and a plaster dome", "script": "blender/golden_age_buildings.py", "folder": "golden-age", "entry": "school.gltf"},
    {"id": "golden-age/hospital", "game": "golden-age", "title": "A hospital's main ward: two storeys behind an arcade", "script": "blender/golden_age_buildings.py", "folder": "golden-age", "entry": "hospital.gltf"},
]
# The painted ground-detail atlas is not a model: one image, made of the AI-painted tiles Codex delivered to the
# museum's brief. It travels the same media path as the models, recorded here file by file like them.
IMAGES = [
    {
        "id": "granada/ground-atlas",
        "game": "granada",
        "title": "The valley's painted ground detail: ploughed earth, green and ripe wheat, stubble, vegetable beds, dry grass, riverbank, dirt road, cobbles, in one atlas",
        "script": "make_ground_atlas.py",
        "files": ["granada/ground-atlas.jpg"],
        "madeBy": "AI image (ChatGPT Codex), painted to the museum's brief; draft, pending the founder's look. The tiles' prompts and checksums: /Users/ahmedabdelaal/Documents/islam-museum-game-art/manifest.jsonl",
    },
    {
        "id": "granada/sierra-strips",
        "game": "granada",
        "title": "The Sierra Nevada's snow range, autumn and winter: wide alpha-cut strips for the valley's eastern backdrop, scaled down to 4096x768 webp from the painted 8192x1536",
        "script": None,
        "files": ["granada/sierra-snow-range-autumn-4096x768.webp", "granada/sierra-snow-range-winter-4096x768.webp"],
        "madeBy": "AI image (ChatGPT Codex), painted to the museum's brief; draft, pending the founder's look. The paintings' prompts and checksums: /Users/ahmedabdelaal/Documents/islam-museum-game-art/manifest.jsonl (granada/terrain/sierra-snow-range-autumn-8192x1536.png, sierra-snow-range-winter-8192x1536.png); the scaling down is this machine's",
    },
    {
        "id": "granada/painted-skies",
        "game": "granada",
        "title": "The valley's painted skies: spring morning, summer midday, autumn afternoon, winter overcast and the golden evening, scaled to 4096x2048 webp from the painted 8192x4096 equirects",
        "script": "make_skies.py",
        "files": [
            "granada/sky-spring-morning-4096x2048.webp",
            "granada/sky-summer-midday-4096x2048.webp",
            "granada/sky-autumn-afternoon-4096x2048.webp",
            "granada/sky-winter-overcast-4096x2048.webp",
            "granada/sky-evening-golden-4096x2048.webp",
        ],
        "madeBy": "AI image (ChatGPT Codex), painted to the museum's brief; draft, pending the founder's look. The paintings' prompts and checksums: /Users/ahmedabdelaal/Documents/islam-museum-game-art/manifest.jsonl (granada/sky/*-equirect-8192x4096.png); the scaling down is this machine's",
    },
    {
        "id": "granada/surface-tiles",
        "game": "granada",
        "title": "The valley's painted surface tiles: lime plaster, rammed earth, rubble stone, clay roof, weathered timber, river water and canal water, scaled to 1536 webp",
        "script": "make_tiles.py",
        "files": [
            "granada/tile-lime-plaster-wall-1536.webp",
            "granada/tile-rammed-earth-wall-1536.webp",
            "granada/tile-rubble-stone-wall-1536.webp",
            "granada/tile-clay-roof-1536.webp",
            "granada/tile-timber-planks-1536.webp",
            "granada/tile-river-water-1536.webp",
            "granada/tile-canal-water-1536.webp",
        ],
        "madeBy": "AI image (ChatGPT Codex), painted to the museum's brief; draft, pending the founder's look. The tiles' prompts and checksums: /Users/ahmedabdelaal/Documents/islam-museum-game-art/manifest.jsonl (granada/textures/*-tile-2048.png); the scaling down and mirroring at the edges are this machine's and the game's",
    },
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
        "sources": [{"path": f"art/{p}", "sha256": sha(HERE / p)} for p in ([] if asset.get("own_sources") else ["blender/common.py", "blender/kit.py"]) + [*asset.get("also", []), asset["script"]]],
        "objects": [n["name"] for n in gltf["nodes"] if "mesh" in n],
        # Where each part's origin is, in the export's own axes (y up; x along the building).
        "placed": {n["name"]: [round(v, 4) for v in n.get("translation", [0, 0, 0])] for n in gltf["nodes"] if "mesh" in n},
        "materials": [m["name"] for m in gltf["materials"]],
        "triangles": triangles,
        "bytes": sum(f.stat().st_size for f in files),
        "files": [{"path": str(f.resolve().relative_to(MODELS.resolve())), "bytes": f.stat().st_size, "sha256": sha(f)} for f in files],
    }


def describe_image(asset):
    files = [MODELS / f for f in asset["files"]]
    if not all(f.exists() for f in files):
        return None
    return {
        "id": asset["id"],
        "game": asset["game"],
        "title": asset["title"],
        "madeBy": asset["madeBy"],
        "licence": "the museum's media of its own, CC BY-SA 4.0; the making is draft and awaits the founder's acceptance",
        "surfaces": [],
        "sources": [{"path": "art/" + asset["script"], "sha256": sha(HERE / asset["script"])}] if asset.get("script") else [],
        "objects": [],
        "placed": {},
        "materials": [],
        "triangles": 0,
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
    built = [d for d in (describe(a) for a in ASSETS) if d] + [d for d in (describe_image(a) for a in IMAGES) if d]
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
