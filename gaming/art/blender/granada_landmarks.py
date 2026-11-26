"""Granada: the larger pieces. A palace for the hill, an estate for the olive terrace, a builders' crane.

Run:  blender --background --factory-startup --python gaming/art/blender/granada_landmarks.py -- <out dir> [preview.png]

One file, landmarks.gltf, each piece an object of its own name with its origin on the ground at the middle of its
footprint. x runs along a piece's front, y from the front (negative) to the back, z up.

The palace is a walled court with a great tower, two halls, an arcade and a long pool. It is a modeller's general
picture of a fortified palace of the western Mediterranean and copies no building: it is not a model of the Alhambra
or of any part of it, and the game does not call it one. In the historical-review ledger these shapes are a
reconstruction, pending review (entry HR-GR-06).
"""
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from common import Part, clear_scene, export_gltf, make_materials, render_preview, textures, triangles  # noqa: E402
from kit import door, gable_ends, merlons, opening, pyramid, roof_at, roof_y  # noqa: E402

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out_dir = os.path.abspath(argv[0]) if argv else os.path.abspath("gaming/media/models/granada/2")
preview = os.path.abspath(argv[1]) if len(argv) > 1 else None

clear_scene()
materials = make_materials(textures(os.path.join(out_dir, "_work")))
made = {}


def finish(name, part, footprint):
    obj = part.build()
    count = triangles([obj])
    footprint = tuple(round(v, 2) for v in footprint)
    made[name] = {"object": obj, "footprint": footprint, "triangles": count}
    print(f"ART landmarks: {name}: {count} triangles, footprint {footprint[0]} by {footprint[1]} m, {footprint[2]} m high", flush=True)
    return obj


def tower(part, w, h, at, material="plaster_red", top=None):
    """A square tower on a spread foot, with a band under its head, merlons, and narrow lights near the top."""
    x, y = at
    part.box((w + 0.8, w + 0.8, 2.0), (x, y, 1.0), material="stone", bevel=0.08)
    part.box((w, w, h), (x, y, h / 2), material=material, bevel=0.06)
    part.box((w + 0.4, w + 0.4, 0.35), (x, y, h - 2.8), material="stone", bevel=0.05)
    for sx, sy, along in ((0, -1, "x"), (0, 1, "x"), (-1, 0, "y"), (1, 0, "y")):
        part.box((w if along == "x" else 0.5, 0.5 if along == "x" else w, 1.0), (x + sx * (w / 2 - 0.25), y + sy * (w / 2 - 0.25), h + 0.5), material=material, bevel=0)
        merlons(part, w - 0.6, (x + sx * (w / 2 - 0.25), y + sy * (w / 2 - 0.25), h + 1.0), along, material=material, size=(1.1, 0.5, 0.9), gap=2.1)
    for face in (-1, 1):
        for dx in (-w / 5, w / 5):
            opening(part, x + dx, y + face * w / 2, h - 5.0, 0.55, 1.6, facing=face, shutters=False, sill=False)
    if top:
        part.box((w * 0.55, w * 0.55, top), (x, y, h + top / 2), material=material, bevel=0.05)
        pyramid(part, w * 0.55, w * 0.3, (x, y, h + top))


# ---- the palace --------------------------------------------------------------------------------------------------
PW, PD, WALL_H, WALL_T = 76.0, 50.0, 9.0, 1.6
p = Part("palace", materials)
# The enclosing wall, on a stone foot, with a walk and merlons.
for sx, sy, along, length in ((0, -1, "x", PW), (0, 1, "x", PW), (-1, 0, "y", PD), (1, 0, "y", PD)):
    cx, cy = sx * (PW / 2 - WALL_T / 2), sy * (PD / 2 - WALL_T / 2)
    dims = (length, WALL_T, WALL_H) if along == "x" else (WALL_T, length, WALL_H)
    foot = (length, WALL_T + 0.5, 1.6) if along == "x" else (WALL_T + 0.5, length, 1.6)
    p.box(foot, (cx, cy, 0.8), material="stone", bevel=0.06)
    p.box(dims, (cx, cy, WALL_H / 2), material="plaster_red", bevel=0.05)
    out = (sx or 0) * (WALL_T / 2 - 0.25), (sy or 0) * (WALL_T / 2 - 0.25)
    p.box((length, 0.5, 0.9) if along == "x" else (0.5, length, 0.9), (cx + out[0], cy + out[1], WALL_H + 0.45), material="plaster_red", bevel=0)
    merlons(p, length - 10, (cx + out[0], cy + out[1], WALL_H + 0.9), along, material="plaster_red", size=(1.1, 0.5, 0.85), gap=2.2)
# Towers at the corners, and the great tower standing forward of the front wall.
for sx in (-1, 1):
    for sy in (-1, 1):
        tower(p, 9.0, 15.0, (sx * (PW / 2 - 3.5), sy * (PD / 2 - 3.5)))
tower(p, 16.0, 27.0, (-14.0, -PD / 2 + 4.0), top=5.0)
# The gate: a lower tower in the front wall with a dark arch through it.
GX = 16.0
tower(p, 10.0, 13.0, (GX, -PD / 2 + 2.5))
p.prism([(-1.7, 0)] + [(math.cos(math.pi * (1 - k / 10)) * 1.7, math.sin(math.pi * k / 10) * 1.7) for k in range(1, 10)] + [(1.7, 0)], 0.3, (GX, -PD / 2 - 2.6, 3.6), material="dark")
p.box((3.4, 0.3, 3.6), (GX, -PD / 2 - 2.6, 1.8), material="dark", bevel=0)
for k in range(11):
    ang = math.pi * (k + 0.5) / 11
    p.box((0.55, 0.4, 0.55), (GX + math.cos(ang) * 1.95, -PD / 2 - 2.7, 3.6 + math.sin(ang) * 1.95), (0, -(ang - math.pi / 2), 0), material="plaster", bevel=0.04)
# The great hall across the back, with an arcade and a tiled walk before it.
HW, HD, HH = 46.0, 11.0, 10.5
hy = PD / 2 - WALL_T - HD / 2 - 1.0
p.box((HW, HD, HH), (0, hy, HH / 2), material="plaster", bevel=0.05)
gable_ends(p, HW, HD, HH, 0, hy, material="plaster")
roof_at(p, HW, HD, HH, 0, hy)
ARC = 4.6
for i in range(10):
    x = -HW / 2 + 2.0 + i * (HW - 4.0) / 9
    p.cylinder(0.28, ARC, (x, hy - HD / 2 - 3.0, ARC / 2), material="stone", segments=8)
    p.box((0.8, 0.8, 0.3), (x, hy - HD / 2 - 3.0, ARC + 0.15), material="stone", bevel=0.03)
p.box((HW - 2.0, 0.6, 1.2), (0, hy - HD / 2 - 3.0, ARC + 0.9), material="plaster", bevel=0.03)
slope = math.radians(14)
p.box((HW - 1.0, 3.9 / math.cos(slope), 0.14), (0, hy - HD / 2 - 1.6, ARC + 1.5 + math.tan(slope) * 1.6), (slope, 0, 0), material="rooftile", bevel=0.02, grain=1)
for x in (-16, -8, 0, 8, 16):
    opening(p, x, hy - HD / 2, 7.4, 0.8, 1.5, shutters=False)
# A second hall down one side, its ridge running front to back.
SWW, SWD, SWH = 10.0, 24.0, 8.5
sx0 = PW / 2 - WALL_T - SWW / 2 - 1.0
p.box((SWW, SWD, SWH), (sx0, -2.0, SWH / 2), material="plaster", bevel=0.05)
gable_ends(p, SWW, SWD, SWH, sx0, -2.0, material="plaster", along="y")
roof_y(p, SWW, SWD, SWH, sx0, -2.0)
# Two garden pavilions with four-sided roofs, a long pool between them, and paving round it.
p.box((PW - 2 * WALL_T - 1, PD - 2 * WALL_T - 1, 0.12), (0, 0, 0.06), material="cobble", bevel=0)
p.box((30.0, 7.0, 0.5), (-4.0, 3.0, 0.25), material="stone", bevel=0.05)
p.box((28.6, 5.6, 0.06), (-4.0, 3.0, 0.5), material="water", bevel=0)
for x in (-24.0, 16.0):
    p.box((7.0, 7.0, 6.0), (x, 3.0, 3.0), material="plaster", bevel=0.05)
    pyramid(p, 7.0, 3.2, (x, 3.0, 6.0))
    door(p, x, 3.0 - 3.5, 1.4, 2.6, arch=True)
finish("palace", p, (PW + 1.0, PD + 6.0, 34.0))

# ---- the estate: a farmhouse, a store and an open press-house round a yard --------------------------------------
e = Part("estate", materials)
# The house: two storeys, its long side to the yard.
e.box((12.2, 7.2, 0.7), (-7.0, 6.0, 0.35), material="stone", bevel=0.05)
e.box((12.0, 7.0, 6.2), (-7.0, 6.0, 3.1), material="plaster", bevel=0.05)
gable_ends(e, 12.0, 7.0, 6.2, -7.0, 6.0, material="plaster")
rise = roof_at(e, 12.0, 7.0, 6.2, -7.0, 6.0)
door(e, -9.0, 6.0 - 3.5, 1.2, 2.2, arch=True)
for x in (-11.0, -6.0, -3.0):
    opening(e, x, 6.0 - 3.5, 4.6, 0.7, 1.0)
opening(e, -5.0, 6.0 - 3.5, 1.8, 0.7, 0.9)
e.box((0.6, 0.6, 2.2), (-3.0, 7.5, 6.2 + rise), material="plaster", bevel=0.03)
e.box((0.8, 0.8, 0.1), (-3.0, 7.5, 6.2 + rise + 1.15), material="rooftile", bevel=0.02)
# The store: one tall storey with a wide door for a cart.
e.box((10.0, 6.4, 4.6), (7.5, 6.4, 2.3), material="plaster_warm", bevel=0.05)
gable_ends(e, 10.0, 6.4, 4.6, 7.5, 6.4, material="plaster_warm")
roof_at(e, 10.0, 6.4, 4.6, 7.5, 6.4)
door(e, 7.5, 6.4 - 3.2, 2.6, 3.0)
opening(e, 4.2, 6.4 - 3.2, 3.2, 0.6, 0.7, shutters=False)
# The press-house: a tiled roof on posts, open to the yard, with the press beam, its screw and a stone bed under it.
PX, PY = 9.0, -5.0
for sx in (-1, 0, 1):
    for sy in (-1, 1):
        e.box((0.3, 0.3, 3.4), (PX + sx * 3.6, PY + sy * 2.4, 1.7), material="wood", bevel=0.02, grain=2)
e.box((8.4, 5.6, 0.2), (PX, PY, 3.5), material="wood", bevel=0.02, grain=0)
roof_at(e, 8.0, 5.2, 3.6, PX, PY, pitch=math.radians(18))
e.cylinder(1.3, 0.5, (PX - 1.2, PY, 0.25), material="stone", segments=16)
e.cylinder(1.0, 0.5, (PX - 1.2, PY, 0.75), material="stone", segments=16)
e.box((6.4, 0.34, 0.34), (PX + 0.4, PY, 1.9), (0, math.radians(-6), 0), material="wood", bevel=0.03, grain=0)
e.cylinder(0.13, 2.6, (PX + 3.0, PY, 1.3), material="wood", segments=8, grain=2)
e.box((1.0, 1.0, 0.5), (PX + 3.0, PY, 0.25), material="stone", bevel=0.04)
# Oil jars in a row against the store, baskets by the press, and the wall that closes the yard, with its gate.
for i in range(6):
    e.cylinder(0.42, 1.0, (3.6 + i * 1.05, 2.6, 0.5), material="plaster_warm", segments=10, radius_top=0.26)
for i, (bx, by) in enumerate(((5.0, -6.2), (5.7, -5.4), (4.6, -4.8), (5.4, -4.2))):
    e.cylinder(0.36, 0.4 + 0.1 * (i % 2), (bx, by, 0.25), material="wood", segments=10, radius_top=0.42)
for cx, cy, w, d in ((0.0, -9.0, 28.0, 0.4), (-14.0, -1.5, 0.4, 15.0), (14.0, -3.5, 0.4, 11.0)):
    e.box((w, d, 1.9), (cx, cy, 0.95), material="plaster", bevel=0.03)
    e.box((w + 0.2 if w > d else 0.6, 0.6 if w > d else d + 0.2, 0.1), (cx, cy, 1.95), material="rooftile", bevel=0.02)
e.box((3.0, 0.5, 2.0), (-2.0, -9.0, 1.0), material="dark", bevel=0)
for sx in (-1, 1):
    e.box((0.6, 0.7, 2.9), (-2.0 + sx * 1.8, -9.0, 1.45), material="stone", bevel=0.04)
e.box((4.4, 0.7, 0.4), (-2.0, -9.0, 3.0), material="wood", bevel=0.03, grain=0)
e.box((27.0, 17.0, 0.1), (0, -0.5, 0.05), material="earth", bevel=0)
finish("estate", e, (28.4, 19.4, round(6.2 + rise + 1.3, 2)))

# ---- a builders' crane: two legs, a jib, a windlass, and a block of stone on the rope ----------------------------
c = Part("crane", materials)
for sx in (-1, 1):
    c.cylinder(0.12, 9.6, (sx * 1.3, 0, 4.7), (0, sx * -math.radians(8), 0), material="wood", segments=8, grain=2)
c.cylinder(0.1, 2.9, (0, 0, 9.3), (0, math.pi / 2, 0), material="wood", segments=8, grain=2)
c.cylinder(0.11, 8.4, (0, -3.0, 7.9), (math.radians(-46), 0, 0), material="wood", segments=8, grain=2)
c.cylinder(0.03, 5.6, (0, -6.0, 8.1 - 2.8), material="dark", segments=6)
c.box((1.3, 0.9, 0.8), (0, -6.0, 2.1), material="stone", bevel=0.04)
c.cylinder(0.9, 0.5, (0, 1.6, 1.3), (0, math.pi / 2, 0), material="wood", segments=14)
c.cylinder(0.08, 3.2, (0, 1.6, 1.3), (0, math.pi / 2, 0), material="wood", segments=6, grain=2)
for sx in (-1, 1):
    c.box((0.16, 0.16, 2.0), (sx * 1.5, 1.6, 1.0), material="wood", bevel=0.01, grain=2)
c.box((3.4, 3.6, 0.2), (0, 0.8, 0.1), material="wood", bevel=0.02, grain=0)
finish("crane", c, (3.4, 9.6, 9.8))

export_gltf(os.path.join(out_dir, "landmarks.gltf"), [m["object"] for m in made.values()])
with open(os.path.join(out_dir, "landmarks.kit.json"), "w") as kit:
    json.dump({"pieces": {n: {"footprint": m["footprint"], "triangles": m["triangles"]} for n, m in made.items()}}, kit, indent=1)
    kit.write("\n")
print("ART landmarks: exported", os.path.join(out_dir, "landmarks.gltf"), flush=True)

if preview:
    made["estate"]["object"].location = (-62, -34, 0)
    made["crane"]["object"].location = (48, -34, 0)
    render_preview(preview, look_at=(-6, -4, 8), distance=118, azimuth_deg=-28, elevation_deg=24, ground_material=materials["earth"])
    print("ART landmarks: preview", preview)
