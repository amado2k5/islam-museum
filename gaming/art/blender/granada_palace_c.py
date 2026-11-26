"""Granada, Candidate C: the palace on the hill, authored as one building and not drawn from the town's kit.

Run:  blender --background --factory-startup --python gaming/art/blender/granada_palace_c.py -- <out dir> [preview folder]

One file, palace.gltf, one object, `palace`, its origin on the ground at the middle of its footprint; x runs east,
the front (toward the town) is -y, z is up.

What it is: an irregular ring of rammed-earth walls and towers of unequal height on a ridge; a military quarter at
the west end with a keep and a watchtower; a court with a long pool between two porticoes, a hall behind the
northern one and a great tower over it; a second court with arcades all round and a fountain; a square hall under
a pyramid roof; a bath with small domes; a garden of hedges, cypresses and orange trees; a gate in a horseshoe arch.

What it is not: a model of the Alhambra or of any part of it. It is a general picture of a fortified palace of the
western Islamic lands in the later Middle Ages, put together from building types (a pool court with porticoes, a
court with arcades, a square hall, a bath, a gate tower) and it has been seen by no historian: ledger entry
HR-GR-06, a reconstruction, review pending. The game does not call it the Alhambra.
"""
import json
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from author import Frame, arcade, arch_panel, arched_door, capped_merlons, column, cypress, export_with_wear, gable_roof, hip_roof, lattice, materials_with_wear, putlog_holes, round_tree, twin_window, weather  # noqa: E402
from common import Part, clear_scene, render_preview, textures, triangles  # noqa: E402

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out_dir = os.path.abspath(argv[0]) if argv else os.path.abspath("gaming/media/models/granada/c")
preview_dir = os.path.abspath(argv[1]) if len(argv) > 1 else None

clear_scene()
materials = materials_with_wear(textures(os.path.join(out_dir, "_work")))
rng = random.Random(1475)
p = Part("palace", materials)
root = Frame(p)
RED, WARM, WHITE = "plaster_red", "plaster_warm", "plaster"


def faces(frame, w, d):
    """The four sides of a block w by d standing at the frame: (a frame on the side looking outward, its length)."""
    return [(frame.sub((0, -d / 2, 0), 0.0), w), (frame.sub((w / 2, 0, 0), math.pi / 2), d), (frame.sub((0, d / 2, 0), math.pi), w), (frame.sub((-w / 2, 0, 0), -math.pi / 2), d)]


def patches(frame, length, height, y=0.0, count=3, material="stone"):
    """Places where the render has come away and the wall behind shows, or has been mended in another colour."""
    for _ in range(0):                 # tried, and taken out: a patch laid on a wall reads as a label stuck to it
        w, h = rng.uniform(0.8, 2.6), rng.uniform(0.5, 1.6)
        x = rng.uniform(-length / 2 + w, length / 2 - w)
        z = rng.uniform(0.9, max(1.0, height * 0.6))
        frame.box((w, 0.05, h), (x, y - 0.012, z), material=material, bevel=0.0)
        frame.box((w * 0.6, 0.05, h * 0.55), (x + w * 0.5, y - 0.012, z - h * 0.4), material=material)


def tower(frame, w, d, h, wall=RED, quoins=False, windows="slits", pavilion=None, flag=False):
    """A tower on a spread foot: courses, the holes of its shuttering, lights near the top, a corbelled head and
    capped merlons; on the greater ones a roofed room above, open in arches."""
    frame.box((w + 1.1, d + 1.1, 1.5), (0, 0, 0.75), material="stone", bevel=0.1)
    frame.box((w + 0.55, d + 0.55, 1.3), (0, 0, 2.1), material="stone", bevel=0.08)
    frame.box((w, d, h), (0, 0, h / 2), material=wall, bevel=0.05)
    frame.box((w + 0.22, d + 0.22, 0.26), (0, 0, h * 0.52), material="stone", bevel=0.03)
    frame.box((w + 0.3, d + 0.3, 0.3), (0, 0, h - 2.5), material="stone", bevel=0.03)
    frame.box((w + 0.7, d + 0.7, 1.15), (0, 0, h + 0.3), material=wall, bevel=0.04)
    frame.box((w - 0.4, d - 0.4, 0.3), (0, 0, h + 0.75), material="cobble")
    for side, length in faces(frame, w, d):
        # The corbels that carry the head out over the wall.
        n = max(3, int(length // 0.8))
        for i in range(n):
            side.box((0.24, 0.36, 0.42), (-length / 2 + (i + 0.5) * length / n, -0.17, h - 0.48), material="stone")
        capped_merlons(side, length + 0.3, -0.1, h + 0.87, material=wall, size=(0.8, 0.5, 0.9), gap=1.6)
        putlog_holes(side, length - 1.0, 4.4, h - 4.0, every=1.5)
        patches(side, length - 1.5, h, count=2, material=rng.choice(("stone", WARM)))
        if windows == "twin" and length >= 5:
            twin_window(side, 0, h - 6.2, width=min(1.7, length * 0.24), height=2.0)
            if length >= 9:
                for s in (-1, 1):
                    twin_window(side, s * length * 0.3, h - 6.2, width=1.3, height=1.8)
                if h > 20:
                    twin_window(side, 0, h * 0.5 - 3.4, width=1.4, height=1.8)
        else:
            for s in ((-0.22, 0.22) if length > 5.5 else (0,)):
                side.box((0.2, 0.08, 1.4), (s * length, -0.01, h - 4.6), material="dark")
                side.box((0.5, 0.1, 0.14), (s * length, -0.03, h - 3.82), material="stone")
                side.box((0.5, 0.12, 0.12), (s * length, -0.04, h - 5.36), material="stone")
    if quoins:
        for sx in (-1, 1):
            for sy in (-1, 1):
                z, k = 3.2, 0
                while z < h - 3.2:
                    long_x = k % 2 == 0
                    frame.box((0.95 if long_x else 0.55, 0.55 if long_x else 0.95, 0.42), (sx * (w / 2 - (0.42 if long_x else 0.22)), sy * (d / 2 - (0.22 if long_x else 0.42)), z), material="stone", bevel=0.02)
                    z += 0.86
                    k += 1
    top = h + 0.9
    if pavilion:
        pw, pd, ph = pavilion
        frame.box((pw, pd, ph), (0, 0, top + ph / 2), material=WHITE, bevel=0.04)
        frame.box((pw + 0.2, pd + 0.2, 0.2), (0, 0, top + ph - 0.5), material="stone", bevel=0.02)
        for side, length in faces(frame.sub((0, 0, top)), pw, pd):
            n = max(2, int(length // 1.5))
            for i in range(n):
                twin_window(side, -length / 2 + (i + 0.5) * length / n, ph * 0.22, width=1.05, height=ph * 0.5)
        hip_roof(frame, pw, pd, top + ph, pitch=math.radians(27))
        top += ph + math.tan(math.radians(27)) * min(pw, pd) / 2
    if flag:
        frame.cylinder(0.07, 6.0, (w / 2 - 0.7, d / 2 - 0.7, top + 2.6), material="wood", segments=6)
        frame.box((2.2, 0.03, 1.2), (w / 2 - 0.7 + 1.15, d / 2 - 0.7, top + 4.9), material="cloth_red")
    return top


def curtain(a, b, h, t=1.9):
    """A stretch of wall from a to b: its outer side is on the right hand walking from a to b."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    length = math.hypot(dx, dy)
    f = root.sub(((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0), math.atan2(dy, dx))
    f.box((length, t + 0.9, 1.3), (0, 0, 0.65), material="stone", bevel=0.08)
    f.box((length, t + 0.4, 0.9), (0, 0, 1.75), material="stone", bevel=0.06)
    f.box((length, t, h), (0, 0, h / 2), material=RED, bevel=0.04)
    f.box((length, t + 0.16, 0.24), (0, 0, h - 1.5), material="stone", bevel=0.02)
    f.box((length, 0.5, 1.0), (0, -t / 2 + 0.25, h + 0.5), material=RED)
    f.box((length, 0.3, 0.55), (0, t / 2 - 0.15, h + 0.27), material=RED)
    f.box((length, t - 0.8, 0.12), (0, 0.1, h + 0.06), material="cobble")
    capped_merlons(f, length - 1.0, -t / 2 + 0.25, h + 1.0, material=RED)
    outer = f.sub((0, -t / 2, 0))
    putlog_holes(outer, length - 6.0, 3.6, h - 2.4)
    patches(outer, length - 8.0, h, count=max(2, int(length / 7)), material="stone")
    patches(outer, length - 8.0, h, count=max(1, int(length / 10)), material=WARM)
    # A buttress or two where the wall is long, each with a sloped head.
    for k in range(int(length // 15)):
        x = -length / 2 + (k + 1) * length / (int(length // 15) + 1)
        outer.box((1.5, 1.1, h * 0.62), (x, -0.5, h * 0.31), material=RED, bevel=0.04)
        outer.box((1.7, 1.3, 0.5), (x, -0.55, 0.9), material="stone", bevel=0.05)
        outer.prism([(-0.55, 0), (0.55, 0), (0.55, 0.9)], 1.5, (x, -0.5, h * 0.62), (0, 0, math.pi / 2), material=RED)
    return f, length


def hall(frame, w, d, h, wall=WHITE, roof="hip", storeys=2, front="lattice", door=True, back=True, pitch=math.radians(24)):
    """A range of rooms: a stone foot, rendered walls with a band at each floor, windows, a door, a tiled roof."""
    frame.box((w + 0.3, d + 0.3, 0.7), (0, 0, 0.35), material="stone", bevel=0.05)
    frame.box((w, d, h), (0, 0, h / 2), material=wall, bevel=0.04)
    frame.box((w + 0.14, d + 0.14, 0.16), (0, 0, h - 0.25), material="stone", bevel=0.02)
    if storeys > 1:
        frame.box((w + 0.1, d + 0.1, 0.14), (0, 0, h / storeys + 0.2), material="stone", bevel=0.02)
    for index, (side, length) in enumerate(faces(frame, w, d)):
        if index == 2 and not back:
            continue
        n = max(1, int(length // 3.2))
        for floor in range(storeys):
            z = floor * h / storeys + (1.3 if floor == 0 else 0.95)
            for i in range(n):
                x = -length / 2 + (i + 0.5) * length / n
                if floor == 0 and door and index == 0 and i == n // 2:
                    arched_door(side, x, width=1.5, height=2.0)
                elif front == "twin" and floor == storeys - 1:
                    twin_window(side, x, z, width=1.3, height=1.6)
                elif floor == 0:
                    side.box((0.5, 0.08, 0.9), (x, -0.01, z + 0.6), material="dark")
                    side.box((0.74, 0.1, 0.12), (x, -0.03, z + 1.1), material="stone")
                else:
                    lattice(side, x, z, width=0.95, height=1.3)
        patches(side, length - 1.0, h, count=1, material=WARM if wall != WARM else WHITE)
    if roof == "hip":
        return h + hip_roof(frame, w, d, h, pitch=pitch)
    if roof == "gable":
        return h + gable_roof(frame, w, d, h, wall=wall, pitch=pitch)
    frame.box((w + 0.2, d + 0.2, 0.5), (0, 0, h + 0.25), material=wall, bevel=0.03)
    return h + 0.5


# ---- the ring of walls: uneven, as a wall is that follows the edge of a ridge ----------------------------------
RING = [(-47, -19), (-31, -25), (-9, -22.5), (15, -26), (38, -22), (47.5, -8), (44.5, 14), (30, 24.5), (7, 22), (-16, 25.5), (-38, 20.5), (-48.5, 2)]
WALL_H = [8.6, 8.0, 8.2, 8.8, 8.4, 8.0, 8.6, 8.2, 9.0, 8.4, 9.2, 9.4]
TOWERS = [
    # at ring point: (w, d, h, windows, pavilion, quoins)
    (7.0, 7.0, 15.5, "slits", None, False),
    (6.0, 5.5, 12.5, "slits", None, False),
    (6.5, 6.5, 14.0, "twin", (4.6, 4.6, 3.4), False),
    (10.5, 8.0, 16.5, "twin", None, True),            # the gate
    (6.0, 6.0, 13.0, "slits", None, False),
    (7.5, 7.5, 16.0, "twin", (5.4, 5.4, 3.6), False),
    (6.0, 6.5, 12.0, "slits", None, False),
    (7.0, 7.0, 14.5, "twin", None, False),
    (6.0, 6.0, 12.5, "slits", None, False),
    (6.5, 6.0, 13.5, "slits", None, False),
    (8.0, 8.0, 17.5, "slits", None, True),
    (7.0, 7.0, 14.0, "slits", None, False),
]
n_ring = len(RING)
for i in range(n_ring):
    a, b = RING[i], RING[(i + 1) % n_ring]
    curtain(a, b, WALL_H[i])
    w, d, h, windows, pavilion, quoins = TOWERS[i]
    nxt = RING[(i + 1) % n_ring]
    yaw = math.atan2(nxt[1] - a[1], nxt[0] - a[0])
    tower(root.sub((a[0], a[1], 0), yaw), w, d, h, windows=windows, pavilion=pavilion, quoins=quoins)
# Half-towers along the longest stretches, so that no length of wall runs bare.
for i, frac, w, h in ((1, 0.5, 4.6, 11.0), (2, 0.5, 4.2, 10.4), (8, 0.5, 4.4, 11.4), (9, 0.5, 4.6, 11.0), (4, 0.55, 4.2, 10.6)):
    a, b = RING[i], RING[(i + 1) % n_ring]
    yaw = math.atan2(b[1] - a[1], b[0] - a[0])
    x, y = a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac
    tower(root.sub((x, y, 0), yaw).sub((0, -1.2, 0)), w, w, h)

# The ground inside: paving, laid to the line of the walls.
root.slab(RING, 0.16, (0, 0, 0.0), material="cobble")

# ---- the gate: a horseshoe arch in a tall frame on the gate tower's outer side, and a ramp up to it -----------
gx, gy = RING[3]
gate_yaw = math.atan2(RING[4][1] - gy, RING[4][0] - gx)
gate = root.sub((gx, gy, 0), gate_yaw).sub((0, -4.0, 0))
gate.box((5.4, 0.5, 8.6), (0, 0.3, 4.3), material="dark")
arch_panel(gate, 7.4, 9.6, 3.6, 4.4, (0, -0.12, 0), depth=0.5, material="stone", turn=math.radians(26))
gate.box((7.9, 0.2, 0.3), (0, -0.42, 9.75), material="stone", bevel=0.03)
for s in (-1, 1):
    gate.box((0.3, 0.2, 9.6), (s * 3.85, -0.42, 4.8), material="stone", bevel=0.03)
    column(gate, s * 2.05, -0.5, 0, 4.4, radius=0.2)
gate.box((6.6, 0.05, 0.34), (0, -0.4, 8.9), material="tile_blue")
gate.box((6.6, 0.05, 0.12), (0, -0.41, 8.55), material="tile_green")
for k in range(9):
    gate.box((0.3, 0.05, 0.3), (-2.8 + k * 0.7, -0.4, 8.05), (0, math.pi / 4, 0), material="tile_blue" if k % 2 else "tile_green")
gate.box((4.3, 0.14, 7.4), (0, 0.0, 3.7), material="wood", grain=2)
for k in range(7):
    gate.box((3.5, 0.04, 0.1), (0, -0.09, 0.5 + k * 0.95), material="iron")
gate.box((0.06, 0.05, 6.6), (0, -0.09, 3.3), material="dark")
gate.box((7.0, 9.0, 0.4), (0, -4.6, 0.2), material="cobble", bevel=0.05)
for s in (-1, 1):
    gate.box((0.5, 9.0, 1.2), (s * 3.6, -4.6, 0.6), material="stone", bevel=0.05)

# ---- the military quarter at the west end -------------------------------------------------------------------
# An inner wall across the enclosure, with its own gate, a keep, a watchtower and rows of quarters.
curtain((-23, 23.5), (-23, 4), 7.6, t=1.5)
curtain((-23, -3), (-23, -22.5), 7.6, t=1.5)
tower(root.sub((-23, 0.5, 0)), 7.0, 6.0, 12.5, windows="twin")
ig = root.sub((-23, 0.5, 0), math.pi / 2).sub((0, -3.55, 0))
arched_door(ig, 0, width=2.4, height=3.0, surround="stone")
keep_top = tower(root.sub((-36.5, -11.5, 0), math.radians(6)), 10.5, 10.5, 21.5, windows="twin", quoins=True, pavilion=(6.4, 6.4, 3.8))
tower(root.sub((-41.5, 9.5, 0), math.radians(-5)), 6.2, 6.2, 25.5, windows="slits", quoins=True, pavilion=(3.6, 3.6, 3.0), flag=True)
for k, (x, y, w, d, h) in enumerate(((-29.5, 13.5, 9.0, 5.0, 4.4), (-29.5, 7.0, 9.0, 4.6, 4.0), (-34.0, 2.0, 5.0, 8.0, 4.2), (-28.5, -17.5, 8.0, 5.0, 4.6))):
    hall(root.sub((x, y, 0), math.radians((-3, 2, 4, -2)[k])), w, d, h, wall=(WARM, RED, WARM, WHITE)[k], roof=("gable", "flat", "gable", "hip")[k], storeys=1, door=True)
# A cistern's head and a well in the yard.
root.box((6.0, 4.0, 0.6), (-30.5, -4.5, 0.3), material="stone", bevel=0.06)
root.cylinder(0.9, 0.9, (-27.0, -9.5, 0.45), material="stone", segments=12)
root.cylinder(0.7, 0.1, (-27.0, -9.5, 0.86), material="dark", segments=12)

# ---- the court of the pool -----------------------------------------------------------------------------------
# A long pool between hedges, a portico at each end, a hall behind the northern one and the great tower over it.
CX, CY = -3.0, -3.5
court = root.sub((CX, CY, 0))
court.box((15.0, 27.0, 0.12), (0, 0, 0.22), material="marble")
court.box((6.0, 22.0, 0.3), (0, 0, 0.31), material="stone", bevel=0.04)
court.box((5.2, 21.2, 0.06), (0, 0, 0.47), material="water")
for s in (-1, 1):
    court.box((1.3, 21.0, 1.0), (s * 4.6, 0, 0.75), material="green", bevel=0.12)
    for k in range(4):
        round_tree(court, s * 6.6, -8.0 + k * 5.4, 0.25, radius=1.0, material="green_olive", trunk=1.3)
for y in (-11.6, 11.6):
    court.cylinder(0.9, 0.3, (0, y, 0.42), material="marble", segments=14)
    court.cylinder(0.14, 0.7, (0, y, 0.9), material="marble", segments=8)
    court.cylinder(0.45, 0.14, (0, y, 1.3), material="marble", segments=12)
# North: the portico, the hall, the tower.
north = court.sub((0, 13.5, 0))                 # looking south into the court
arcade(north, 7, 2.05, 6.2, y=0.0, z=0.25, roof_depth=3.2, middle_wider=0.9)
hall(court.sub((0, 19.0, 0)), 17.0, 4.6, 8.2, wall=WHITE, roof="hip", storeys=1, front="lattice", door=False)
great = court.sub((0, 27.0, 0))
great_top = tower(great, 14.5, 13.5, 27.0, windows="twin", quoins=True)
# South: a portico with a gallery over it, and the range behind, which shows above the outer wall.
south = court.sub((0, -13.5, 0), math.pi)       # looking north into the court
arcade(south, 7, 2.05, 5.2, y=0.0, z=0.25, roof_depth=0.0, middle_wider=0.9, band="tile_green")
arcade(south.sub((0, 0, 5.65)), 8, 1.9, 3.6, y=0.0, z=0.0, roof_depth=2.6, band=None)
south.box((15.4, 0.5, 0.36), (0, 0.15, 5.6), material="wood", grain=0)
hall(court.sub((0, -17.2, 0)), 19.0, 5.0, 10.6, wall=WHITE, roof="hip", storeys=2, front="twin", door=False)
# The long ranges at the sides, with their doors on the court.
hall(court.sub((-11.2, 0.5, 0), math.pi / 2), 26.0, 6.6, 8.4, wall=WARM, roof="hip", storeys=2, front="twin")
hall(court.sub((11.0, -1.0, 0), -math.pi / 2), 24.0, 6.2, 7.6, wall=WHITE, roof="hip", storeys=2, front="lattice")

# ---- the court of the fountain: arcades all round ------------------------------------------------------------
FX, FY = 26.5, 3.0
fc = root.sub((FX, FY, 0), math.radians(-4))
fc.box((16.0, 20.0, 0.12), (0, 0, 0.22), material="marble")
for turn, half, bays in ((0.0, 8.5, 7), (math.pi, 8.5, 7), (math.pi / 2, 6.5, 9), (-math.pi / 2, 6.5, 9)):
    side = fc.sub((0, 0, 0), turn).sub((0, half, 0))
    arcade(side, bays, 1.7, 5.0, y=0.0, z=0.25, roof_depth=2.4, band="tile_blue" if bays == 7 else "tile_green")
for turn, half in ((math.pi / 2, 9.4), (-math.pi / 2, 9.4), (0.0, 12.6), (math.pi, 12.6)):
    f = fc.sub((0, 0, 0), turn).sub((0, half + 1.6, 0))
    long = 22.0 if half < 10 else 15.0
    hall(f, long, 4.6, 7.4 if half < 10 else 8.6, wall=WHITE if half < 10 else WARM, roof="hip", storeys=2, front="lattice", door=False)
# Two small pavilions that step out into the court from its short sides, each under its own pyramid of tile.
for s in (-1, 1):
    pav = fc.sub((0, s * 6.2, 0.25))
    for cx in (-1.7, 1.7):
        for cy in (-1.7, 1.7):
            column(pav, cx, cy, 0, 3.0, radius=0.11)
    for turn in (0.0, math.pi / 2, math.pi, -math.pi / 2):
        arch_panel(pav.sub((0, 0, 0), turn), 3.6, 2.5, 2.9, 0.25, (0, -1.7, 3.0), depth=0.26, material=WHITE, turn=math.radians(18))
    pav.box((4.0, 4.0, 0.2), (0, 0, 5.6), material="stone", bevel=0.03)
    hip_roof(pav, 3.8, 3.8, 5.7, pitch=math.radians(32), overhang=0.5)
# The fountain: a basin carried on a ring of small supports, and four channels to the arcades.
fc.cylinder(1.9, 0.26, (0, 0, 0.4), material="marble", segments=12)
for k in range(12):
    a = k * math.pi / 6
    fc.box((0.34, 0.5, 0.6), (math.cos(a) * 1.25, math.sin(a) * 1.25, 0.8), (0, 0, a + math.pi / 2), material="marble", bevel=0.05)
fc.cylinder(1.6, 0.3, (0, 0, 1.25), material="marble", segments=12, radius_top=1.75)
fc.cylinder(1.5, 0.04, (0, 0, 1.4), material="water", segments=12)
fc.cylinder(0.12, 0.5, (0, 0, 1.6), material="marble", segments=8)
for turn in (0.0, math.pi / 2, math.pi, -math.pi / 2):
    fc.sub((0, 0, 0), turn).box((0.3, 5.6, 0.03), (0, 4.6, 0.3), material="water")
for sx in (-1, 1):
    for sy in (-1, 1):
        round_tree(fc, sx * 4.2, sy * 4.6, 0.25, radius=1.15, material="green", trunk=1.5)

# ---- the square hall under its pyramid roof, with a ring of small lights under the eave ----------------------
qf = root.sub((31.5, 17.0, 0), math.radians(-4))
qf.box((9.6, 9.6, 0.8), (0, 0, 0.4), material="stone", bevel=0.06)
qf.box((9.2, 9.2, 12.4), (0, 0, 6.2), material=RED, bevel=0.05)
qf.box((9.5, 9.5, 0.24), (0, 0, 8.8), material="stone", bevel=0.03)
for side, length in faces(qf, 9.2, 9.2):
    for i in range(5):
        x = -length / 2 + (i + 0.5) * length / 5
        arch_panel(side, 1.5, 1.7, 0.7, 0.75, (x, -0.06, 9.4), depth=0.14, material=WHITE)
        side.box((1.3, 0.06, 1.5), (x, -0.005, 10.2), material="dark")
    twin_window(side, 0, 4.2, width=1.8, height=2.2)
    putlog_holes(side, length - 1.0, 2.4, 8.0, every=1.5, skip=((-1.4, 1.4),))
hip_roof(qf, 9.2, 9.2, 12.4, pitch=math.radians(33), overhang=0.6)

# ---- the bath: low, thick, its vaults pierced with small lights ----------------------------------------------
bf = root.sub((15.0, -15.5, 0), math.radians(3))
bf.box((11.0, 6.6, 4.2), (0, 0, 2.1), material=WARM, bevel=0.06)
bf.box((11.3, 6.9, 0.7), (0, 0, 0.35), material="stone", bevel=0.05)
bf.box((11.2, 6.8, 0.2), (0, 0, 4.25), material="stone", bevel=0.03)
for k in range(3):
    x = -3.5 + k * 3.5
    for step, (r, zz) in enumerate(((1.45, 4.45), (1.25, 4.85), (0.95, 5.2), (0.55, 5.45))):
        bf.cylinder(r, 0.42, (x, 0, zz), material=WARM, segments=12, radius_top=r * 0.8)
    for j in range(6):
        a = j * math.pi / 3
        bf.box((0.14, 0.14, 0.06), (x + math.cos(a) * 0.8, math.sin(a) * 0.8, 5.43), material="dark")
bf.box((0.8, 0.8, 3.0), (4.8, 2.6, 5.0), material=RED, bevel=0.03)
bf.box((1.0, 1.0, 0.14), (4.8, 2.6, 6.55), material="clay")
arched_door(bf.sub((0, -3.3, 0)), -2.0, width=1.1, height=1.8)

# ---- the garden terraces along the south-east, and trees wherever a yard has room ----------------------------
gf = root.sub((31.0, -13.5, 0), math.radians(8))
gf.box((20.0, 10.0, 0.5), (0, 0, 0.3), material="stone", bevel=0.06)
gf.box((19.4, 9.4, 0.08), (0, 0, 0.56), material="earth")
gf.box((1.0, 8.6, 0.05), (0, 0, 0.6), material="water")
for sx in (-1, 1):
    for k in range(3):
        bx = sx * (3.2 + k * 2.9)
        gf.box((2.2, 3.4, 0.75), (bx, -2.5, 0.93), material="green", bevel=0.1)
        gf.box((2.2, 3.4, 0.75), (bx, 2.5, 0.93), material="green_olive" if k == 1 else "green", bevel=0.1)
    for k in range(4):
        cypress(gf, sx * 9.2, -3.9 + k * 2.6, 0.55, height=8.5, seed=k + (3 if sx > 0 else 0))
gf.cylinder(1.1, 0.5, (0, 0, 0.8), material="marble", segments=12)
gf.cylinder(0.95, 0.04, (0, 0, 1.04), material="water", segments=12)
# A lookout on the garden's outer edge: an open room of arches under a tiled roof.
look = gf.sub((0, -6.6, 0.55))
look.box((6.4, 3.4, 0.4), (0, 0, 0.2), material="stone", bevel=0.04)
arcade(look, 3, 1.9, 4.0, y=-1.5, z=0.4, roof_depth=0.0, band="tile_blue")
arcade(look.sub((0, 0, 0), math.pi), 3, 1.9, 4.0, y=-1.5, z=0.4, roof_depth=0.0, band=None)
hip_roof(look, 6.2, 3.3, 4.75, pitch=math.radians(26))
for k, (x, y) in enumerate(((6, 17.5), (-1, 17.2), (-12, 21.0), (-19.5, 19.5), (39.5, -3), (40.5, 6.5), (13.5, 17.0), (17.5, 14.5), (-17.5, -18.5), (1.5, -21.0), (21, -9.5), (24.5, -20.5))):
    cypress(root, x, y, 0.16, height=9.5, seed=k)
for k, (x, y) in enumerate(((-19, 12), (-18.5, 6), (-19, -8), (14.5, 12.5), (16, 5), (38, 16), (-13, -19))):
    round_tree(root, x, y, 0.16, radius=1.5 + 0.2 * (k % 3), material="green" if k % 2 else "green_olive")

# ---- finish, weather, export ---------------------------------------------------------------------------------
obj = p.build()
weather(obj, ground=0.0, seed=14.75)
count = triangles([obj])
xs = [v.co.x for v in obj.data.vertices]
ys = [v.co.y for v in obj.data.vertices]
zs = [v.co.z for v in obj.data.vertices]
footprint = (round(max(xs) - min(xs), 2), round(max(ys) - min(ys), 2), round(max(zs), 2))
print(f"ART palace-c: {count} triangles, {footprint[0]} by {footprint[1]} m, {footprint[2]} m high", flush=True)
export_with_wear(os.path.join(out_dir, "palace.gltf"), [obj])
with open(os.path.join(out_dir, "palace.kit.json"), "w") as kit:
    json.dump({"pieces": {"palace": {"footprint": footprint, "triangles": count}}}, kit, indent=1)
    kit.write("\n")
print("ART palace-c: exported", os.path.join(out_dir, "palace.gltf"), flush=True)

if preview_dir:
    os.makedirs(preview_dir, exist_ok=True)
    for name, look_at, distance, azimuth, elevation in (("palace-wide", (0, 0, 9), 150, -24, 20), ("palace-far", (0, 0, 10), 330, -12, 9), ("palace-near", (2, -8, 8), 78, 14, 13), ("palace-court", (10, 0, 5), 70, 38, 38)):
        render_preview(os.path.join(preview_dir, name + ".png"), look_at=look_at, distance=distance, azimuth_deg=azimuth, elevation_deg=elevation, ground_material=materials["earth"], samples=64)
        print("ART palace-c: preview", name, flush=True)
