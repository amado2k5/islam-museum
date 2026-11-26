"""Granada: the town's kit. Houses, a wall with its tower and gate, scaffolding, a market stall.

Run:  blender --background --factory-startup --python gaming/art/blender/granada_town.py -- <out dir> [preview.png]

The pieces are written into one file, town.gltf, each as an object of its own name with its origin on the ground at
the middle of its footprint, so that the game can stand many of them along its streets and they share one set of
materials. x runs along a house's front, y from the street (negative) to the back, z up.

These are a modeller's general picture of a walled town of the western Mediterranean: lime-washed walls, barrel
tiles, small shuttered openings, rubble stone. No source stands behind any of these shapes and none copies a real
building; in the historical-review ledger they are a reconstruction, pending review (entry HR-GR-06).
"""
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from common import Part, clear_scene, export_gltf, make_materials, render_preview, textures, triangles  # noqa: E402

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out_dir = os.path.abspath(argv[0]) if argv else os.path.abspath("gaming/media/models/granada/2")
preview = os.path.abspath(argv[1]) if len(argv) > 1 else None

clear_scene()
materials = make_materials(textures(os.path.join(out_dir, "_work")))
PITCH = math.radians(24)
made = {}


def roof(part, w, d, eave, overhang=0.35, pitch=PITCH, material="rooftile"):
    """Two slopes of tile over a block w along the ridge and d across it, with the ridge along x."""
    half = d / 2 + overhang
    run = half / math.cos(pitch)
    rise = math.tan(pitch) * (d / 2)
    for sy in (-1, 1):
        # A slab whose own y runs down the slope, so the tiles run down it too.
        part.box((w + 2 * overhang, run, 0.14), (0, sy * half / 2, eave + rise / 2 - math.tan(pitch) * overhang / 2 + 0.07), (sy * -pitch, 0, 0), material=material, bevel=0.02, grain=1)
    # The ridge: a line of capping tiles.
    part.box((w + 2 * overhang, 0.3, 0.16), (0, 0, eave + rise + 0.08), material=material, bevel=0.05)
    return rise


def gables(part, w, d, eave, material, pitch=PITCH):
    rise = math.tan(pitch) * (d / 2)
    for sx in (-1, 1):
        part.prism([(-d / 2, 0), (d / 2, 0), (0, rise)], 0.3, (sx * (w / 2 - 0.15), 0, eave), (0, 0, math.pi / 2), material=material)


def opening(part, x, y_face, z, w, h, facing=-1, shutters=True, sill=True):
    """A window on a wall that faces -y (or +y): a dark reveal, a frame of the wall's own stone, boards for shutters."""
    y = y_face + facing * 0.02
    part.box((w, 0.06, h), (x, y, z), material="dark", bevel=0)
    part.box((w + 0.24, 0.12, 0.14), (x, y + facing * 0.03, z + h / 2 + 0.07), material="wood", bevel=0.015, grain=0)
    if sill:
        part.box((w + 0.3, 0.2, 0.1), (x, y + facing * 0.06, z - h / 2 - 0.05), material="stone", bevel=0.02)
    if shutters:
        for sx in (-1, 1):
            part.box((w / 2, 0.05, h), (x + sx * (w / 2 + w / 4 + 0.02), y + facing * 0.04, z), material="wood", bevel=0.01, grain=2)


def door(part, x, y_face, w, h, facing=-1, arch=False):
    y = y_face + facing * 0.03
    part.box((w, 0.08, h), (x, y, h / 2), material="wood", bevel=0.01, grain=2)
    for sx in (-1, 1):
        part.box((0.2, 0.22, h + 0.1), (x + sx * (w / 2 + 0.1), y + facing * 0.04, (h + 0.1) / 2), material="stone", bevel=0.03)
    if arch:
        for k in range(7):
            a = math.pi * (k + 0.5) / 7
            r = w / 2 + 0.1
            part.box((0.34, 0.22, 0.36), (x + math.cos(a) * r, y + facing * 0.04, h + math.sin(a) * r), (0, -(a - math.pi / 2), 0), material="stone", bevel=0.03)
        part.prism([(-w / 2, 0)] + [(math.cos(math.pi * (1 - k / 8)) * w / 2, math.sin(math.pi * k / 8) * w / 2) for k in range(1, 8)] + [(w / 2, 0)], 0.08, (x, y, h), material="wood")
    else:
        part.box((w + 0.5, 0.24, 0.22), (x, y + facing * 0.04, h + 0.11), material="wood", bevel=0.02, grain=0)


def chimney(part, x, y, base, top):
    part.box((0.6, 0.6, top - base), (x, y, (base + top) / 2), material="plaster", bevel=0.03)
    part.box((0.8, 0.8, 0.1), (x, y, top + 0.05), material="rooftile", bevel=0.02)
    part.box((0.5, 0.5, 0.26), (x, y, top + 0.23), material="plaster", bevel=0.03)
    part.box((0.74, 0.74, 0.08), (x, y, top + 0.4), material="rooftile", bevel=0.02)


def finish(name, part, footprint):
    obj = part.build()
    count = triangles([obj])
    footprint = tuple(round(v, 2) for v in footprint)
    made[name] = {"object": obj, "footprint": footprint, "triangles": count}
    print(f"ART town: {name}: {count} triangles, footprint {footprint[0]} by {footprint[1]} m, {footprint[2]} m high", flush=True)
    return obj


# ---- house A: two storeys under one roof, the door on the street -------------------------------------------------
W, D, H = 7.0, 6.0, 5.6
a = Part("house-a", materials)
a.box((W + 0.16, D + 0.16, 0.7), (0, 0, 0.35), material="stone", bevel=0.05)
a.box((W, D, H), (0, 0, H / 2), material="plaster", bevel=0.05)
gables(a, W, D, H, "plaster")
rise = roof(a, W, D, H)
door(a, -1.6, -D / 2, 1.1, 2.1, arch=True)
opening(a, 1.5, -D / 2, 1.7, 0.7, 0.9)
for x in (-1.9, 1.4):
    opening(a, x, -D / 2, 4.0, 0.7, 1.0)
opening(a, 0.4, D / 2, 4.0, 0.7, 1.0, facing=1)
opening(a, -2.0, D / 2, 1.8, 0.6, 0.8, facing=1, shutters=False)
chimney(a, 2.2, 1.2, H, H + rise + 0.5)
finish("house-a", a, (W + 0.7, D + 0.7, round(H + rise + 0.9, 2)))

# ---- house B: a taller block with a lower wing and a walled yard --------------------------------------------------
b = Part("house-b", materials)
W, D, H = 6.0, 5.4, 6.2
b.box((W + 0.16, D + 0.16, 0.7), (-2.0, 0.6, 0.35), material="stone", bevel=0.05)
b.box((W, D, H), (-2.0, 0.6, H / 2), material="plaster_warm", bevel=0.05)
# The roof pieces are built about the block's own middle and the block stands at x = -2, y = 0.6.
for piece in ("roof",):
    half = D / 2 + 0.35
    run = half / math.cos(PITCH)
    rise = math.tan(PITCH) * (D / 2)
    for sy in (-1, 1):
        b.box((W + 0.7, run, 0.14), (-2.0, 0.6 + sy * half / 2, H + rise / 2 - math.tan(PITCH) * 0.175 + 0.07), (sy * -PITCH, 0, 0), material="rooftile", bevel=0.02, grain=1)
    b.box((W + 0.7, 0.3, 0.16), (-2.0, 0.6, H + rise + 0.08), material="rooftile", bevel=0.05)
# The gables were made about the origin: move is not possible after the fact, so they are made again in place.
for sx in (-1, 1):
    b.prism([(-D / 2, 0), (D / 2, 0), (0, rise)], 0.3, (-2.0 + sx * (W / 2 - 0.15), 0.6, H), (0, 0, math.pi / 2), material="plaster_warm")
# The wing: one storey with a single slope falling to the street.
WW, WD, WH = 4.2, 4.4, 3.0
b.box((WW, WD, WH), (3.0, 1.1, WH / 2), material="plaster", bevel=0.05)
slope = math.radians(16)
b.box((WW + 0.5, (WD + 0.6) / math.cos(slope), 0.14), (3.0, 1.1, WH + math.tan(slope) * WD / 2 + 0.1), (slope, 0, 0), material="rooftile", bevel=0.02, grain=1)
b.box((WW, 0.3, math.tan(slope) * WD + 0.1), (3.0, 1.1 + WD / 2 - 0.15, WH + math.tan(slope) * WD / 2), material="plaster", bevel=0)
for sx in (-1, 1):
    b.prism([(-WD / 2, 0), (WD / 2, 0), (WD / 2, math.tan(slope) * WD)], 0.3, (3.0 + sx * (WW / 2 - 0.15), 1.1, WH), (0, 0, math.pi / 2), material="plaster")
# The yard wall along the street, with a gate, and tiles along its top.
b.box((4.4, 0.4, 2.3), (3.0, -2.9, 1.15), material="plaster", bevel=0.04)
b.box((4.5, 0.6, 0.12), (3.0, -2.9, 2.36), material="rooftile", bevel=0.03)
door(b, 3.4, -3.1, 1.3, 1.9)
door(b, -3.2, 0.6 - D / 2, 1.1, 2.1, arch=True)
opening(b, -0.8, 0.6 - D / 2, 1.8, 0.7, 0.9)
for x in (-3.4, -0.8):
    opening(b, x, 0.6 - D / 2, 4.5, 0.7, 1.0)
opening(b, 3.0, 1.1 - WD / 2, 1.7, 0.6, 0.8)
chimney(b, -0.4, 1.8, H, H + rise + 0.4)
finish("house-b", b, (10.6, 6.8, round(H + rise + 0.8, 2)))

# ---- house C: narrow and tall, with an open gallery under the roof ------------------------------------------------
W, D, H = 4.6, 6.4, 6.6
c = Part("house-c", materials)
c.box((W + 0.16, D + 0.16, 0.7), (0, 0, 0.35), material="stone", bevel=0.05)
c.box((W, D, H), (0, 0, H / 2), material="plaster", bevel=0.05)
# The gallery: posts on the wall head, the roof carried over them.
GAL = 1.5
for i in range(5):
    x = -W / 2 + 0.25 + i * (W - 0.5) / 4
    c.box((0.18, 0.18, GAL), (x, -D / 2 + 0.2, H + GAL / 2), material="wood", bevel=0.015, grain=2)
c.box((W, 0.2, 0.2), (0, -D / 2 + 0.2, H + GAL + 0.1), material="wood", bevel=0.02, grain=0)
c.box((W, 0.12, 0.5), (0, -D / 2 + 0.1, H + 0.3), material="wood", bevel=0.015, grain=0)
c.box((W, D - 1.6, GAL + 0.2), (0, 0.8, H + (GAL + 0.2) / 2), material="plaster", bevel=0.04)
for sx in (-1, 1):
    c.box((0.3, 1.6, GAL + 0.2), (sx * (W / 2 - 0.15), -D / 2 + 0.8, H + (GAL + 0.2) / 2), material="plaster", bevel=0.03)
top = H + GAL + 0.2
gables(c, W, D, top, "plaster")
rise = roof(c, W, D, top)
door(c, 0.9, -D / 2, 1.0, 2.1)
opening(c, -1.0, -D / 2, 1.8, 0.6, 0.8)
for x in (-1.0, 1.0):
    opening(c, x, -D / 2, 4.4, 0.65, 1.0)
finish("house-c", c, (W + 0.7, D + 0.7, round(top + rise + 0.3, 2)))

# ---- house D: one storey round a court, with a flat roof to walk on ----------------------------------------------
W, D, H = 8.4, 7.6, 3.4
d = Part("house-d", materials)
d.box((W, D, H), (0, 0, H / 2), material="plaster_warm", bevel=0.05)
d.box((W + 0.1, D + 0.1, 0.5), (0, 0, 0.25), material="stone", bevel=0.04)
# The parapet round the roof, and the roof inside it.
for sx, sy, sw, sd in ((0, -1, W, 0.3), (0, 1, W, 0.3), (-1, 0, 0.3, D), (1, 0, 0.3, D)):
    d.box((sw, sd, 0.7), (sx * (W / 2 - 0.15), sy * (D / 2 - 0.15), H + 0.35), material="plaster_warm", bevel=0.03)
d.box((W - 0.6, D - 0.6, 0.1), (0, 0, H + 0.05), material="earth", bevel=0)
# A small upper room on the roof, tiled, and a line of tiles along the street parapet.
d.box((3.0, 2.8, 2.4), (-2.4, 2.0, H + 1.2), material="plaster", bevel=0.04)
d.box((3.5, 3.3 / math.cos(math.radians(14)), 0.12), (-2.4, 2.0, H + 2.4 + 0.42), (math.radians(14), 0, 0), material="rooftile", bevel=0.02, grain=1)
d.box((W + 0.2, 0.5, 0.1), (0, -D / 2 + 0.15, H + 0.75), material="rooftile", bevel=0.03)
door(d, 2.4, -D / 2, 1.2, 2.1, arch=True)
for x in (-2.6, -0.2):
    opening(d, x, -D / 2, 1.9, 0.6, 0.8)
opening(d, -2.4, 2.0 - 1.4, H + 1.3, 0.6, 0.8, shutters=False)
finish("house-d", d, (W + 0.3, D + 0.3, round(H + 3.0, 2)))

# ---- the town wall: a length of it, a tower, a gate, and scaffolding to stand against any of them ----------------
WALL_L, WALL_T, WALL_H = 10.0, 1.6, 7.0
w = Part("wall", materials)
w.box((WALL_L, WALL_T + 0.3, 1.0), (0, 0, 0.5), material="stone", bevel=0.06)
w.box((WALL_L, WALL_T, WALL_H), (0, 0, WALL_H / 2), material="stone", bevel=0.04)
w.box((WALL_L, 0.4, 0.9), (0, -WALL_T / 2 + 0.2, WALL_H + 0.45), material="stone", bevel=0.03)
for i in range(5):
    w.box((1.1, 0.4, 0.8), (-WALL_L / 2 + 1.0 + i * 2.0, -WALL_T / 2 + 0.2, WALL_H + 1.3), material="stone", bevel=0.04)
finish("wall", w, (WALL_L, WALL_T + 0.3, WALL_H + 1.7))

TW, TH = 6.0, 12.0
t = Part("tower", materials)
t.box((TW + 0.5, TW + 0.5, 1.6), (0, 0, 0.8), material="stone", bevel=0.08)
t.box((TW, TW, TH), (0, 0, TH / 2), material="stone", bevel=0.05)
t.box((TW + 0.3, TW + 0.3, 0.3), (0, 0, TH - 2.6), material="stone", bevel=0.05)
for sx, sy, sw, sd in ((0, -1, TW, 0.45), (0, 1, TW, 0.45), (-1, 0, 0.45, TW), (1, 0, 0.45, TW)):
    t.box((sw, sd, 0.9), (sx * (TW / 2 - 0.22), sy * (TW / 2 - 0.22), TH + 0.45), material="stone", bevel=0.03)
    n = 3
    for i in range(n):
        off = (-TW / 2 + 0.9 + i * (TW - 1.8) / (n - 1))
        t.box((1.0 if sw > sd else 0.45, 0.45 if sw > sd else 1.0, 0.8), (off if sw > sd else sx * (TW / 2 - 0.22), sy * (TW / 2 - 0.22) if sw > sd else off, TH + 1.3), material="stone", bevel=0.04)
for face in (-1, 1):
    opening(t, 0, face * TW / 2, TH - 4.2, 0.5, 1.3, facing=face, shutters=False, sill=False)
finish("tower", t, (TW + 0.5, TW + 0.5, TH + 1.7))

GW, GT, GH = 9.0, 3.2, 9.0
g = Part("gate", materials)
PASS_W, PASS_H = 3.2, 3.6
for sx in (-1, 1):
    side = (GW - PASS_W) / 2
    g.box((side, GT, GH), (sx * (PASS_W / 2 + side / 2), 0, GH / 2), material="stone", bevel=0.05)
    g.box((side + 0.3, GT + 0.3, 1.4), (sx * (PASS_W / 2 + side / 2), 0, 0.7), material="stone", bevel=0.07)
g.box((PASS_W + 0.2, GT, GH - PASS_H - PASS_W / 2), (0, 0, PASS_H + PASS_W / 2 + (GH - PASS_H - PASS_W / 2) / 2), material="stone", bevel=0.04)
# The arch over the passage, of cut stones, on both faces; the dark of the passage behind it.
for face in (-1, 1):
    for k in range(11):
        ang = math.pi * (k + 0.5) / 11
        r = PASS_W / 2 + 0.25
        g.box((0.5, 0.4, 0.52), (math.cos(ang) * r, face * (GT / 2 + 0.05), PASS_H + math.sin(ang) * r), (0, -(ang - math.pi / 2), 0), material="plaster", bevel=0.04)
    g.prism([(-PASS_W / 2, 0)] + [(math.cos(math.pi * (1 - k / 10)) * PASS_W / 2, math.sin(math.pi * k / 10) * PASS_W / 2) for k in range(1, 10)] + [(PASS_W / 2, 0)], 0.3, (0, face * (GT / 2 - 0.5), PASS_H), material="dark")
g.box((PASS_W, GT - 1.0, PASS_H), (0, 0, PASS_H / 2), material="dark", bevel=0)
for i in range(5):
    g.box((1.1, 0.45, 0.8), (-GW / 2 + 0.9 + i * (GW - 1.8) / 4, -GT / 2 + 0.22, GH + 0.4), material="stone", bevel=0.04)
    g.box((1.1, 0.45, 0.8), (-GW / 2 + 0.9 + i * (GW - 1.8) / 4, GT / 2 - 0.22, GH + 0.4), material="stone", bevel=0.04)
finish("gate", g, (GW + 0.3, GT + 0.3, GH + 0.8))

SW, SH = 8.0, 9.0
sc = Part("scaffold", materials)
for i in range(5):
    x = -SW / 2 + i * SW / 4
    for y in (0.0, 1.5):
        sc.cylinder(0.07, SH, (x, y, SH / 2), material="wood", segments=6, grain=2)
for level in range(1, 5):
    z = level * 2.1
    for y in (0.0, 1.5):
        sc.cylinder(0.06, SW, (0, y, z), (0, math.pi / 2, 0), material="wood", segments=6, grain=2)
    for i in range(5):
        sc.cylinder(0.05, 1.5, (-SW / 2 + i * SW / 4, 0.75, z), (math.pi / 2, 0, 0), material="wood", segments=6, grain=2)
    if level < 4:
        sc.box((SW - 0.3, 1.3, 0.06), (0, 0.75, z + 0.08), material="wood", bevel=0.01, grain=0)
for i in range(4):
    x0 = -SW / 2 + i * SW / 4
    length = math.hypot(SW / 4, 2.1)
    sc.cylinder(0.04, length, (x0 + SW / 8, 0.0, 1.05 + (i % 3) * 2.1), (0, math.atan2(SW / 4, 2.1) * (1 if i % 2 else -1), 0), material="wood", segments=6, grain=2)
finish("scaffold", sc, (SW, 1.7, SH))

# ---- a market stall: four posts, a counter, a cloth pulled over a ridge pole -------------------------------------
st = Part("stall", materials)
for sx in (-1, 1):
    for sy in (-1, 1):
        st.cylinder(0.06, 2.3, (sx * 1.3, sy * 0.9, 1.15), material="wood", segments=6, grain=2)
st.box((2.8, 0.9, 0.08), (0, -0.5, 0.9), material="wood", bevel=0.01, grain=0)
st.box((2.6, 0.06, 0.8), (0, -0.92, 0.45), material="wood", bevel=0.01, grain=0)
for sy in (-1, 1):
    st.box((3.1, 1.25, 0.03), (0, sy * 0.55, 2.42), (sy * -math.radians(22), 0, 0), material="plaster_warm", bevel=0)
st.cylinder(0.05, 3.1, (0, 0, 2.66), (0, math.pi / 2, 0), material="wood", segments=6, grain=2)
finish("stall", st, (3.1, 2.3, 2.7))

export_gltf(os.path.join(out_dir, "town.gltf"), [m["object"] for m in made.values()])
with open(os.path.join(out_dir, "town.kit.json"), "w") as kit:
    json.dump({"pieces": {n: {"footprint": m["footprint"], "triangles": m["triangles"]} for n, m in made.items()}}, kit, indent=1)
    kit.write("\n")
print("ART town: exported", os.path.join(out_dir, "town.gltf"), flush=True)

if preview:
    # For the picture only: the pieces set out as a street against the wall.
    layout = {"house-a": (-14, -6, 0), "house-b": (-3, -6, 0), "house-c": (8.5, -6, 0), "house-d": (18, -6, 0), "wall": (-12, 9, 0), "tower": (-4, 9, 0), "gate": (4.5, 9, 0), "scaffold": (-12, 7.2, 0), "stall": (10, -13, 0)}
    for name, where in layout.items():
        made[name]["object"].location = where
    second = made["wall"]["object"].copy()
    second.location = (13.5, 9, 0)
    bpy.context.scene.collection.objects.link(second)
    render_preview(preview, look_at=(2, 0, 3.5), distance=52, azimuth_deg=-24, elevation_deg=20, ground_material=materials["cobble"])
    print("ART town: preview", preview)

print("ART town: " + ", ".join(f"{n} {m['triangles']}" for n, m in made.items()))
