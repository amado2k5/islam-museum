"""Pieces a building of the kit is put together from: a tiled roof, gables, a shuttered opening, a door, a chimney,
a line of merlons. Shared by the scripts that make Granada's buildings. Each takes the part it adds to.

In every one x runs along the building's front, y from the front (negative) to the back, and z is up.
"""
import math

PITCH = math.radians(24)


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
    # The reveal: narrow jambs, a timber lintel and a stone sill standing a little proud of the plaster.
    for sx in (-1, 1):
        part.box((0.12, 0.12, h + 0.08), (x + sx * (w / 2 + 0.06), y + facing * 0.035, z), material="stone", bevel=0)
    part.box((w + 0.24, 0.12, 0.14), (x, y + facing * 0.03, z + h / 2 + 0.07), material="wood", bevel=0.015, grain=0)
    part.box((w + 0.1, 0.04, 0.05), (x, y + facing * 0.055, z - h / 2 + 0.05), material="wood", bevel=0, grain=0)
    if sill:
        part.box((w + 0.3, 0.2, 0.1), (x, y + facing * 0.06, z - h / 2 - 0.05), material="stone", bevel=0.02)
    if shutters:
        for sx in (-1, 1):
            cx = x + sx * (w / 2 + w / 4 + 0.02)
            part.box((w / 2, 0.05, h), (cx, y + facing * 0.04, z), material="wood", bevel=0.01, grain=2)
            # Battens across each board; small geometry, but it catches light at street distance.
            for dz in (-h * 0.28, h * 0.28):
                part.box((w / 2 - 0.04, 0.025, 0.06), (cx, y + facing * 0.075, z + dz), material="wood", bevel=0, grain=0)


def door(part, x, y_face, w, h, facing=-1, arch=False):
    y = y_face + facing * 0.03
    part.box((w, 0.08, h), (x, y, h / 2), material="wood", bevel=0.01, grain=2)
    # The leaf is of upright boards held by three cross battens, with iron hinges and a small ring.
    for z in (h * 0.24, h * 0.56, h * 0.84):
        part.box((w - 0.08, 0.035, 0.08), (x, y + facing * 0.065, z), material="wood", bevel=0, grain=0)
        part.box((0.16, 0.025, 0.045), (x - w / 2 + 0.1, y + facing * 0.085, z), material="iron", bevel=0)
    part.cylinder(0.055, 0.035, (x + w * 0.27, y + facing * 0.09, h * 0.52), (math.pi / 2, 0, 0), material="iron", segments=8)
    for sx in (-1, 1):
        part.box((0.2, 0.22, h + 0.1), (x + sx * (w / 2 + 0.1), y + facing * 0.04, (h + 0.1) / 2), material="stone", bevel=0.03)
    # A worn stone threshold, kept within the wall's own projection.
    part.box((w + 0.42, 0.22, 0.12), (x, y + facing * 0.04, 0.06), material="stone", bevel=0.01)
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


def roof_y(part, w, d, eave, x=0.0, y=0.0, overhang=0.35, pitch=PITCH, material="rooftile"):
    """Two slopes over a block w across the ridge (along x) and d along it: the ridge runs along y."""
    half = w / 2 + overhang
    run = half / math.cos(pitch)
    rise = math.tan(pitch) * (w / 2)
    for sx in (-1, 1):
        part.box((run, d + 2 * overhang, 0.14), (x + sx * half / 2, y, eave + rise / 2 - math.tan(pitch) * overhang / 2 + 0.07), (0, sx * pitch, 0), material=material, bevel=0.02, grain=0)
    part.box((0.3, d + 2 * overhang, 0.16), (x, y, eave + rise + 0.08), material=material, bevel=0.05)
    return rise


def roof_at(part, w, d, eave, x=0.0, y=0.0, overhang=0.35, pitch=PITCH, material="rooftile"):
    """As roof(), over a block that does not stand at the middle: the ridge runs along x."""
    half = d / 2 + overhang
    run = half / math.cos(pitch)
    rise = math.tan(pitch) * (d / 2)
    for sy in (-1, 1):
        part.box((w + 2 * overhang, run, 0.14), (x, y + sy * half / 2, eave + rise / 2 - math.tan(pitch) * overhang / 2 + 0.07), (sy * -pitch, 0, 0), material=material, bevel=0.02, grain=1)
    part.box((w + 2 * overhang, 0.3, 0.16), (x, y, eave + rise + 0.08), material=material, bevel=0.05)
    return rise


def gable_ends(part, w, d, eave, x=0.0, y=0.0, material="plaster", pitch=PITCH, along="x"):
    """The triangles of wall under a roof's two ends, for a block anywhere; `along` is the ridge's axis."""
    span = d if along == "x" else w
    rise = math.tan(pitch) * (span / 2)
    for s in (-1, 1):
        if along == "x":
            part.prism([(-d / 2, 0), (d / 2, 0), (0, rise)], 0.3, (x + s * (w / 2 - 0.15), y, eave), (0, 0, math.pi / 2), material=material)
        else:
            part.prism([(-w / 2, 0), (w / 2, 0), (0, rise)], 0.3, (x, y + s * (d / 2 - 0.15), eave), material=material)
    return rise


def merlons(part, length, at, along="x", material="stone", size=(1.0, 0.45, 0.8), gap=2.0):
    """A line of merlons `length` long, centred on `at` (x, y, z of their feet), standing along x or along y."""
    n = max(2, int(length // gap))
    for i in range(n):
        off = -length / 2 + (i + 0.5) * length / n
        dims = size if along == "x" else (size[1], size[0], size[2])
        where = (at[0] + off, at[1], at[2] + size[2] / 2) if along == "x" else (at[0], at[1] + off, at[2] + size[2] / 2)
        part.box(dims, where, material=material, bevel=0)


def pyramid(part, side, height, at, material="rooftile"):
    """A four-sided tiled roof over a square block: its foot at `at`."""
    part.cylinder(side / math.sqrt(2) + 0.3, height, (at[0], at[1], at[2] + height / 2), (0, 0, math.pi / 4), material=material, segments=4, radius_top=0.05)


def eave_tiles(part, w, d, eave, x=0.0, y=0.0, overhang=0.35, pitch=PITCH, step=0.78):
    """Half-round tile ends along the two low edges of a roof whose ridge runs along x."""
    span = w + 2 * overhang - 0.22
    n = max(4, int(span // step))
    for sy in (-1, 1):
        yy = y + sy * (d / 2 + overhang - 0.2)
        zz = eave - 0.05
        for i in range(n):
            xx = x - span / 2 + (i + 0.5) * span / n
            part.cylinder(0.105, 0.3, (xx, yy, zz), (math.pi / 2 + sy * -pitch, 0, 0), material="rooftile", segments=5, radius_top=0.09)


def ridge_caps(part, w, z, x=0.0, y=0.0, overhang=0.35, step=0.78):
    """Small round caps along a roof ridge."""
    span = w + 2 * overhang - 0.45
    n = max(4, int(span // step))
    for i in range(n):
        xx = x - span / 2 + (i + 0.5) * span / n
        part.cylinder(0.1, 0.42, (xx, y, z), (0, math.pi / 2, 0), material="rooftile", segments=5, radius_top=0.09)


def string_course(part, w, d, z, x=0.0, y=0.0, material="stone", projection=0.08):
    """A narrow moulded band across the front and back of a wall at height z.

    The band stands a little proud of the wall face. Every piece that uses it already has a roof, parapet or
    recorded footprint reaching farther in that direction, so the piece's outer dimensions are unchanged.
    """
    part.box((w, 0.12, 0.16), (x, y - d / 2 - projection + 0.06, z), material=material, bevel=0)
    part.box((w, 0.12, 0.16), (x, y + d / 2 + projection - 0.06, z), material=material, bevel=0)


def corbels(part, length, at, along="x", material="stone", spacing=0.9):
    """A row of small projecting stones carrying a parapet or a course."""
    n = max(2, int(length // spacing))
    for i in range(n):
        off = -length / 2 + (i + 0.5) * length / n
        if along == "x":
            part.box((0.26, 0.22, 0.18), (at[0] + off, at[1], at[2]), material=material, bevel=0)
        else:
            part.box((0.22, 0.26, 0.18), (at[0], at[1] + off, at[2]), material=material, bevel=0.025)


def wear_course(part, length, y_face, facing=-1, x=0.0, material="stone", count=9):
    """Uneven stones and a dirt wash along a wall foot, deterministic from the piece's dimensions."""
    for i in range(count):
        u = (i + 0.5) / count
        xx = x - length / 2 + u * length
        ww = length / count * (0.52 + 0.18 * ((i * 37) % 5) / 4)
        hh = 0.16 + 0.05 * ((i * 19) % 3)
        part.box((ww, 0.1, hh), (xx, y_face + facing * 0.055, hh / 2), material=material, bevel=0)
    part.box((length * 0.96, 0.025, 0.34), (x, y_face + facing * 0.075, 0.2), material="earth", bevel=0)


def under_eave_wear(part, length, depth, eave, x=0.0, y=0.0, material="earth"):
    """A broken earthen wash just under the two long eaves, kept inside the roof's overhang."""
    n = max(4, int(length // 4))
    span = length * 0.92
    for sy in (-1, 1):
        yy = y + sy * (depth / 2 + 0.035)
        for i in range(n):
            xx = x - span / 2 + (i + 0.5) * span / n
            hh = 0.12 + 0.04 * ((i * 23 + (1 if sy > 0 else 0)) % 3)
            part.box((span / n * 0.82, 0.025, hh), (xx, yy, eave - hh / 2 - 0.025), material=material, bevel=0)


def lattice(part, x, y, z, w, h, facing=-1, material="wood"):
    """A wooden lattice screen in a vertical x-z plane."""
    yy = y + facing * 0.03
    for sx in (-1, 1):
        part.box((0.07, 0.06, h), (x + sx * (w / 2 - 0.035), yy, z), material=material, bevel=0, grain=2)
    for dz in (-h / 2 + 0.04, h / 2 - 0.04):
        part.box((w, 0.06, 0.07), (x, yy, z + dz), material=material, bevel=0, grain=0)
    for i in range(1, 4):
        xx = x - w / 2 + i * w / 4
        part.box((0.045, 0.045, h - 0.08), (xx, yy, z), material=material, bevel=0, grain=2)
    for i in range(1, 3):
        zz = z - h / 2 + i * h / 3
        part.box((w - 0.08, 0.045, 0.045), (x, yy, zz), material=material, bevel=0, grain=0)


def balcony(part, x, y_face, z, w, facing=-1):
    """A small projecting balcony with brackets, a slatted floor and a lattice front."""
    depth = 0.28
    y = y_face + facing * depth / 2
    part.box((w, depth, 0.09), (x, y, z), material="wood", bevel=0.012, grain=0)
    for sx in (-1, 1):
        part.box((0.09, depth, 0.09), (x + sx * (w / 2 - 0.12), y_face + facing * depth * 0.35, z - 0.22), (facing * math.radians(35), 0, 0), material="wood", bevel=0.008, grain=1)
    lattice(part, x, y_face + facing * (depth + 0.02), z + 0.42, w, 0.76, facing)


def arch_band(part, x0, x1, y, spring, rise, bays, facing=-1, material="plaster"):
    """Arched spandrels over an existing row of columns, built from small voussoir-like blocks."""
    span = (x1 - x0) / bays
    for bay in range(bays):
        cx = x0 + (bay + 0.5) * span
        r = span * 0.34
        for k in range(5):
            a = math.pi * (k + 0.5) / 5
            part.box((0.28, 0.18, 0.32), (cx + math.cos(a) * r, y + facing * 0.04, spring + math.sin(a) * rise), (0, -(a - math.pi / 2), 0), material=material, bevel=0)
        part.prism([(-r, 0), (-r * 0.55, rise * 0.72), (0, rise), (r * 0.55, rise * 0.72), (r, 0), (r * 0.72, -0.16), (-r * 0.72, -0.16)], 0.12, (cx, y + facing * 0.02, spring), material=material)


def arrow_slit(part, x, y_face, z, facing=-1):
    """A narrow dark vertical slit with a stone lintel and sill."""
    y = y_face + facing * 0.025
    part.box((0.16, 0.05, 1.0), (x, y, z), material="dark", bevel=0)
    part.box((0.36, 0.12, 0.1), (x, y + facing * 0.035, z + 0.55), material="stone", bevel=0.015)
    part.box((0.34, 0.12, 0.09), (x, y + facing * 0.035, z - 0.55), material="stone", bevel=0.015)
