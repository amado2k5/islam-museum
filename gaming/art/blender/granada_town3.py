"""Granada: the town's kit. Houses, a wall with its tower and gate, scaffolding, a market stall.

Run:  blender --background --factory-startup --python gaming/art/blender/granada_town3.py -- <out dir> [preview.png]

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
from common3 import Part, clear_scene, export_gltf, make_lod, make_materials, render_preview, textures, triangles  # noqa: E402
from kit3 import PITCH, arrow_slit, balcony, chimney, corbels, door, eave_tiles, gables, lattice, opening, ridge_caps, roof, string_course, under_eave_wear, wear_course  # noqa: E402

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out_dir = os.path.abspath(argv[0]) if argv else os.path.abspath("gaming/media/models/granada/3")
preview = os.path.abspath(argv[1]) if len(argv) > 1 else None

clear_scene()
materials = make_materials(textures(os.path.join(out_dir, "_work")))
made = {}


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
eave_tiles(a, W, D, H)
under_eave_wear(a, W, D, H)
ridge_caps(a, W, H + rise + 0.06)
string_course(a, W, D, 2.95)
wear_course(a, W - 0.4, -D / 2)
balcony(a, 1.4, -D / 2, 3.18, 2.1)
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
eave_tiles(b, W, D, H, x=-2.0, y=0.6)
under_eave_wear(b, W, D, H, x=-2.0, y=0.6)
ridge_caps(b, W, H + rise + 0.06, x=-2.0, y=0.6)
string_course(b, W, D, 3.0, x=-2.0, y=0.6, material="stone")
wear_course(b, W - 0.5, 0.6 - D / 2, x=-2.0)
balcony(b, -0.8, 0.6 - D / 2, 3.55, 1.8)
# A row of eave tiles on the wing's low edge, and jars stored against the yard wall.
for i in range(8):
    x = 3.0 - (WW + 0.5) / 2 + (i + 0.5) * (WW + 0.5) / 8
    b.cylinder(0.095, 0.34, (x, 1.1 - WD / 2 - 0.24, WH + 0.04), (math.pi / 2 + slope, 0, 0), material="rooftile", segments=6, radius_top=0.08)
for i in range(3):
    b.cylinder(0.18, 0.52, (1.65 + i * 0.42, -2.55, 0.26), material="clay", segments=8, radius_top=0.12)
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
# A lattice breastwork makes the gallery a screened wooden room rather than a line of bare posts.
lattice(c, 0, -D / 2 + 0.14, H + 0.88, W - 0.55, 0.95)
gables(c, W, D, top, "plaster")
rise = roof(c, W, D, top)
eave_tiles(c, W, D, top)
under_eave_wear(c, W, D, top)
ridge_caps(c, W, top + rise + 0.06)
string_course(c, W, D, 3.1)
wear_course(c, W - 0.35, -D / 2)
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
string_course(d, W, D, 2.55, material="stone", projection=0.04)
wear_course(d, W - 0.5, -D / 2)
# A lattice screen on the roof room and storage jars kept inside the house's existing footprint.
lattice(d, -2.4, 2.0 - 1.43, H + 1.35, 1.15, 0.82)
for i in range(3):
    d.cylinder(0.2, 0.58, (3.25 - i * 0.42, -D / 2 + 0.48, 0.29), material="clay", segments=8, radius_top=0.13)
finish("house-d", d, (W + 0.3, D + 0.3, round(H + 3.0, 2)))

# ---- the town wall: a length of it, a tower, a gate, and scaffolding to stand against any of them ----------------
WALL_L, WALL_T, WALL_H = 10.0, 1.6, 7.0
w = Part("wall", materials)
w.box((WALL_L, WALL_T + 0.3, 1.0), (0, 0, 0.5), material="stone", bevel=0.06)
w.box((WALL_L, WALL_T, WALL_H), (0, 0, WALL_H / 2), material="stone", bevel=0.04)
w.box((WALL_L, 0.4, 0.9), (0, -WALL_T / 2 + 0.2, WALL_H + 0.45), material="stone", bevel=0.03)
for i in range(5):
    w.box((1.1, 0.4, 0.8), (-WALL_L / 2 + 1.0 + i * 2.0, -WALL_T / 2 + 0.2, WALL_H + 1.3), material="stone", bevel=0.04)
string_course(w, WALL_L, WALL_T, 3.8)
string_course(w, WALL_L, WALL_T, WALL_H - 0.55)
corbels(w, WALL_L - 0.8, (0, -WALL_T / 2 - 0.04, WALL_H - 0.15), "x")
wear_course(w, WALL_L - 0.4, -WALL_T / 2, count=10)
for x in (-3.0, 0.0, 3.0):
    arrow_slit(w, x, -WALL_T / 2, 5.2)
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
    arrow_slit(t, -1.6, face * TW / 2, TH - 7.2, facing=face)
    arrow_slit(t, 1.6, face * TW / 2, TH - 7.2, facing=face)
string_course(t, TW, TW, 3.7)
string_course(t, TW, TW, TH - 2.6)
corbels(t, TW - 0.7, (0, -TW / 2 - 0.04, TH - 0.2), "x")
corbels(t, TW - 0.7, (0, TW / 2 + 0.04, TH - 0.2), "x")
wear_course(t, TW - 0.3, -TW / 2, count=7)
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
string_course(g, GW, GT, 4.9)
string_course(g, GW, GT, GH - 0.7)
corbels(g, GW - 0.8, (0, -GT / 2 - 0.04, GH - 0.2), "x")
corbels(g, GW - 0.8, (0, GT / 2 + 0.04, GH - 0.2), "x")
wear_course(g, GW - 0.8, -GT / 2, count=9)
for x in (-3.2, 3.2):
    arrow_slit(g, x, -GT / 2, 6.7)
# Closed wooden leaves within the passage, strapped with iron; their outer face stays inside the gate's old volume.
for sx in (-1, 1):
    g.box((PASS_W / 2 - 0.08, 0.12, PASS_H - 0.25), (sx * PASS_W / 4, -GT / 2 - 0.02, (PASS_H - 0.25) / 2), material="wood", bevel=0.012, grain=2)
    for z in (0.8, 1.8, 2.8):
        g.box((PASS_W / 2 - 0.16, 0.035, 0.08), (sx * PASS_W / 4, -GT / 2 - 0.095, z), material="iron", bevel=0.003)
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
# Rope bindings at the principal crossings and a stack of spare boards on the first lift.
for level in (2.1, 4.2, 6.3):
    for i in range(5):
        x = -SW / 2 + i * SW / 4
        sc.cylinder(0.06, 0.045, (x, 0.0, level), (math.pi / 2, 0, 0), material="dark", segments=6)
for i in range(5):
    sc.box((2.1, 0.18, 0.055), (-2.0, 0.42 + i * 0.19, 2.22 + i * 0.012), material="wood", bevel=0.006, grain=0)
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
# A second cloth valance, jars, baskets and small crates lying about the counter.
for sx in (-1, 1):
    for i in range(7):
        st.box((0.3, 0.035, 0.2), (-1.35 + i * 0.45, sx * 1.05, 2.18), material="cloth_red" if sx < 0 else "cloth", bevel=0.008)
for i in range(4):
    st.cylinder(0.15 + 0.02 * (i % 2), 0.42, (-0.9 + i * 0.45, -0.52, 1.14), material="clay", segments=8, radius_top=0.1)
for i, (x, y) in enumerate(((0.85, -0.4), (1.05, 0.05), (-1.0, 0.15))):
    st.box((0.42, 0.34, 0.24), (x, y, 1.02 + 0.05 * (i == 2)), (0, 0, 0.08 * i), material="wood", bevel=0.015, grain=0)
st.cylinder(0.26, 0.28, (1.0, 0.62, 0.14), material="wood", segments=8, radius_top=0.3)
finish("stall", st, (3.1, 2.3, 2.7))

exported = []
for m in made.values():
    exported.append(m["object"])
    exported.append(make_lod(m["object"]))
export_gltf(os.path.join(out_dir, "town.gltf"), exported)
for obj in exported:
    if obj.name.endswith("-lod1"):
        obj.hide_render = True
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
