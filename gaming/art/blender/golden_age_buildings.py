"""The Golden Age's five public buildings: market, bath, library, school, hospital.

Run: blender --background --factory-startup --python gaming/art/blender/golden_age_buildings.py -- <out dir> [render dir]

Each building is one glTF holding a single object that carries several materials; the game reads the primitives
apart by material name and merges them into its own per-material district meshes, so an authored building costs no
draw call of its own. Materials are named for the game's material kinds (plaster, glaze, startile, wood, brick,
ashlar, roof, fabric, lattice) and carry the colours the game's vertex colours carry, because those colours are
baked into the vertices on reading.

Conventions: 1 unit = 1 metre; a building's origin is on the ground at the centre of its footprint; its front —
the side with the door or portal — faces Blender -Y, which the glTF exporter writes as the game's +Z. Sizes follow
the quarter each building stands in (about 18 m square). Prototype only; historical review pending. The buildings
are an original, generic vocabulary, not reconstructions of real buildings; no place of worship is among them.
"""
import math, os, sys
import bpy
from mathutils import Matrix

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
out = os.path.abspath(argv[0]) if argv else os.path.abspath('gaming/media/models/golden-age')
rend = os.path.abspath(argv[1]) if len(argv) > 1 else None
os.makedirs(out, exist_ok=True)
if rend: os.makedirs(rend, exist_ok=True)

# The colours the game's procedural buildings carry in their vertices (games/golden-age/src/view/board.ts).
def mat(name, rgb):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = (*rgb, 1); m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*rgb, 1)
    bsdf.inputs['Roughness'].default_value = .85
    return m

M = {k: mat(k, v) for k, v in {
    'plaster': (.86, .82, .72),     # the lime-washed walls
    'plaster_dark': (.62, .56, .46), # shade inside arcades and recesses
    'glaze': (.1, .62, .62),         # turquoise glazed domes
    'startile': (1, 1, 1),           # white: the star-tile texture carries the pattern
    'cobalt': (.13, .32, .88),       # cobalt tilework inside portals (scaled up as the game does)
    'wood': (.5, .4, .3),
    'darkwood': (.3, .22, .16),
    'brick': (.9, .62, .44),
    'ashlar': (.8, .72, .58),
    'roof': (.72, .64, .5),
    'fabric': (.85, .5, .12),
    'lattice': (.45, .34, .24),
    'gold': (.85, .66, .26),
}.items()}

def clear():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def link(me, name):
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    return o

def cube(loc, scale, material, bevel=0.0, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.object; o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(material)
    if bevel:
        mod = o.modifiers.new('soft', 'BEVEL'); mod.width = bevel; mod.segments = 2
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return o

def cyl(loc, radius, depth, material, rot=(0, 0, 0), verts=12):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=loc, rotation=rot)
    o = bpy.context.object; o.data.materials.append(material); return o

def cone(loc, r1, r2, depth, material, rot=(0, 0, 0), verts=10):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r1, radius2=r2, depth=depth, location=loc, rotation=rot)
    o = bpy.context.object; o.data.materials.append(material); return o

def dome(loc, radius, height, material, seg=18, rings=7, pointed=1.15):
    """A pointed dome of revolution: profile t from 0 (rim) to 1 (crown), radius shrinking, height rising."""
    parts = []
    rings_n = rings
    # Build with a screw-like profile using bmesh-free primitive: use a UV sphere cut is complex; instead revolve a profile with the screw modifier.
    import bmesh
    me = bpy.data.meshes.new('dome')
    verts = []
    faces = []
    for j in range(rings_n + 1):
        t = j / rings_n
        # pointed profile: radius falls with a slight belly, height rises past a half-sphere for pointiness
        ang = (t * math.pi) / 2
        r = radius * math.cos(ang) ** 0.9
        y = height * math.sin(ang) ** pointed * (1 + 0.18 * t)
        for i in range(seg):
            a = (i / seg) * math.pi * 2
            verts.append((r * math.cos(a), r * math.sin(a), y))
    for j in range(rings_n):
        for i in range(seg):
            a = j * seg + i
            b = j * seg + (i + 1) % seg
            c = (j + 1) * seg + (i + 1) % seg
            d = (j + 1) * seg + i
            if j == rings_n - 1:
                faces.append((a, b, d))
            else:
                faces.append((a, b, c, d))
    me.from_pydata(verts, [], faces)
    me.materials.append(material)
    o = link(me, 'dome')
    o.location = loc
    return o

def arch_face(width, height, depth, material, cols=10, spring_ratio=0.55):
    """A wall panel with a pointed-arched opening: flat mesh in the XZ plane, extruded `depth` in Y.
    Returns the object; positions it at the origin of its own local frame, centred horizontally."""
    # Ring of quads between outer rectangle and arch opening, as triangles in a mesh with thickness.
    spring = height * spring_ratio
    half = width / 2
    # Arch opening: width*0.4 span, springing at spring, pointed crown near height*0.88
    span = width * 0.19
    crown = height * 0.86
    # Build a simple panel: two jambs, a lintel band following the arch in steps.
    parts = []
    jambw = half - span
    # jambs
    parts.append(cube((-half + jambw / 2, 0, height / 2), (jambw / 2, depth / 2, height / 2), material))
    parts.append(cube((half - jambw / 2, 0, height / 2), (jambw / 2, depth / 2, height / 2), material))
    # stepped arch above the opening: segments following a pointed curve
    steps = 5
    for i in range(steps):
        t0 = i / steps
        t1 = (i + 1) / steps
        # pointed arch: x from span down to 0 as y rises from spring to crown
        x0 = span * (1 - t0 ** 1.35)
        x1 = span * (1 - t1 ** 1.35)
        y0 = spring + (crown - spring) * t0
        y1 = spring + (crown - spring) * t1
        xm = (x0 + x1) / 2
        for sx in (-1, 1):
            blk = cube((sx * (xm + 0.0), 0, (y0 + y1) / 2), (max(xm, 0.08), depth / 2, (y1 - y0) / 2 + 0.02), material)
            parts.append(blk)
    # band above the arch up to the top
    parts.append(cube((0, 0, (height + crown) / 2), (half, depth / 2, (height - crown) / 2 + 0.01), material))
    return parts

def join(parts, name):
    bpy.ops.object.select_all(action='DESELECT')
    for p in parts: p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    parts[0].name = name
    return parts[0]

def crenellation(parts, length, y_front, y_back, height, material, step=1.1):
    """A row of small merlons along x at the top of a wall."""
    n = int(length / step)
    for i in range(n):
        x = -length / 2 + (i + 0.5) * length / n
        parts.append(cube((x, (y_front + y_back) / 2, height + 0.14), (0.22, abs(y_front - y_back) / 2, 0.14), material))

def finish(kind, parts):
    for o in bpy.context.scene.objects: o.select_set(True)
    path = os.path.join(out, kind + '.gltf')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLTF_SEPARATE', use_selection=True, export_yup=True, export_apply=True)
    tris = sum(len(o.data.polygons) for o in bpy.context.scene.objects if o.type == 'MESH')
    return path, tris

# ---------------------------------------------------------------- the library ----
def library():
    clear(); P = []
    w, d, h = 15.4, 12.6, 7.6
    # The great hall's body.
    P.append(cube((0, 0, h / 2), (w / 2, d / 2, h / 2), M['plaster'], bevel=0.05))
    # A cornice under the roof line, and a stepped parapet.
    P.append(cube((0, 0, h - 0.12), (w / 2 + 0.18, d / 2 + 0.18, 0.12), M['plaster']))
    crenellation(P, w, -d / 2 - 0.05, d / 2 + 0.05, h + 0.02, M['plaster'])
    # The drum, the turquoise pointed dome and its gold finial.
    P.append(cyl((0, 0.4, h + 1.1), 4.6, 2.2, M['plaster'], verts=20))
    P.append(cyl((0, 0.4, h + 2.25), 4.66, 0.5, M['startile'], verts=20))
    P.append(dome((0, 0.4, h + 2.5), 4.4, 4.6, M['glaze'], seg=20, rings=8))
    P.append(cyl((0, 0.4, h + 2.5 + 4.9), 0.1, 1.3, M['gold'], verts=6))
    # The portal on the front (-Y): a tall frame, a deep pointed recess tiled in cobalt, a dark door.
    pw, ph = 7.6, 9.6
    P.append(cube((0, -d / 2 - 0.5, ph / 2 - 0.6), (pw / 2, 0.55, ph / 2 + 0.3), M['plaster']))
    arch_parts = arch_face(pw - 1.5, ph - 1.8, 0.5, M['startile'])
    # The arch face is made about its own centre at ground level: raise it into the portal frame and forward onto its front.
    for ap in arch_parts:
        ap.location.y -= d / 2 + 0.26
        ap.location.z += (ph - 1.8) / 2 - 0.0
    P += arch_parts
    P.append(cube((0, -d / 2 - 0.42, 2.6), (1.7, 0.1, 2.6), M['darkwood']))
    # Rows of arched windows on three sides: recessed dark with lattice shutters.
    for floor in range(2):
        wy = 2.6 + floor * 2.6
        for i in range(5):
            x = -w / 2 + (i + 0.5) * w / 5
            if abs(x) < 3.6 and floor == 0: continue  # the portal takes the middle of the front
            P.append(cube((x, -d / 2 - 0.06, wy), (0.55, 0.08, 0.8), M['darkwood']))
            P.append(cube((x, -d / 2 - 0.02, wy + 0.72), (0.7, 0.12, 0.12), M['plaster']))
        for i in range(4):
            z = -d / 2 + (i + 0.5) * d / 4
            for sx in (-1, 1):
                P.append(cube((sx * (w / 2 + 0.06), z, wy), (0.08, 0.55, 0.8), M['lattice']))
    return join(P, 'library')

# ---------------------------------------------------------------- the bath ----
def bath():
    clear(); P = []
    s, h = 12.6, 4.4
    # The hot room: a square hall under one broad dome with four small ones at the corners.
    P.append(cube((0, 0, h / 2), (s / 2, s / 2, h / 2), M['plaster'], bevel=0.05))
    P.append(cube((0, 0, h - 0.1), (s / 2 + 0.15, s / 2 + 0.15, 0.1), M['plaster']))
    crenellation(P, s, -s / 2 - 0.04, s / 2 + 0.04, h + 0.02, M['plaster'])
    # The great dome on its drum, pierced by small round skylights.
    P.append(cyl((0, 0, h + 0.5), 4.3, 1.0, M['plaster'], verts=18))
    P.append(dome((0, 0, h + 1.0), 4.1, 3.5, M['plaster'], seg=18, rings=7, pointed=1.0))
    for i in range(8):
        a = (i / 8) * math.pi * 2
        P.append(cyl((math.cos(a) * 2.4, math.sin(a) * 2.4, h + 2.6), 0.16, 0.5, M['startile'], verts=8, rot=(0, math.pi / 2 - math.atan2(1.4, 2.4), a)))
    for sx in (-1, 1):
        for sz in (-1, 1):
            P.append(cyl((sx * 4.5, sz * 4.5, h + 0.3), 1.3, 0.6, M['plaster'], verts=12))
            P.append(dome((sx * 4.5, sz * 4.5, h + 0.6), 1.15, 1.1, M['plaster'], seg=12, rings=5, pointed=1.0))
    # The entrance: an arched door with a tiled frame on the front.
    P.append(cube((0, -s / 2 - 0.25, 1.9), (1.9, 0.25, 1.9), M['plaster']))
    P.append(cube((0, -s / 2 - 0.42, 1.3), (0.7, 0.12, 1.3), M['darkwood']))
    P.append(cube((0, -s / 2 - 0.44, 2.75), (1.1, 0.06, 0.35), M['startile']))
    return join(P, 'bath')

# ---------------------------------------------------------------- the school ----
def school():
    clear(); P = []
    w, d, h = 16.0, 9.6, 5.2
    # The teaching hall behind an arcade of five bays.
    P.append(cube((0, 0.8, h / 2), (w / 2, d / 2 - 0.8, h / 2), M['plaster'], bevel=0.04))
    P.append(cube((0, 0.8, h - 0.1), (w / 2 + 0.15, d / 2 - 0.65, 0.1), M['plaster']))
    # The arcade: piers, pointed arches in steps, shade behind.
    bays = 5
    bay = w / bays
    for i in range(bays + 1):
        x = -w / 2 + i * bay
        P.append(cube((x, -d / 2 + 0.9, 1.5), (0.28, 0.3, 1.5), M['plaster']))
    for i in range(bays):
        x = -w / 2 + (i + 0.5) * bay
        # stepped pointed arch above each bay
        spring = 2.6; crown = 3.8
        for st in range(4):
            t0 = st / 4; t1 = (st + 1) / 4
            half = bay / 2 - 0.28
            x0 = half * (1 - t0 ** 1.3); x1 = half * (1 - t1 ** 1.3)
            y0 = spring + (crown - spring) * t0; y1 = spring + (crown - spring) * t1
            xm = (x0 + x1) / 2
            for sx in (-1, 1):
                P.append(cube((x + sx * xm, -d / 2 + 0.9, (y0 + y1) / 2), (max(xm, 0.07), 0.3, (y1 - y0) / 2 + 0.02), M['plaster']))
        P.append(cube((x, -d / 2 + 0.9, (h + crown) / 2 - 0.1), (bay / 2 - 0.2, 0.3, (h - crown) / 2 + 0.1), M['plaster']))
        P.append(cube((x, -d / 2 + 1.5, 1.45), (bay / 2 - 0.35, 0.1, 1.45), M['plaster_dark']))
    # The dome over the hall's middle.
    P.append(cyl((0, 1.2, h + 0.4), 3.0, 0.8, M['plaster'], verts=16))
    P.append(dome((0, 1.2, h + 0.8), 2.85, 2.7, M['plaster'], seg=16, rings=6))
    P.append(cyl((0, 1.2, h + 0.8 + 2.9), 0.08, 0.9, M['gold'], verts=6))
    crenellation(P, w, -d / 2 + 0.6, d - 0.6, h + 0.02, M['plaster'])
    return join(P, 'school')

# ---------------------------------------------------------------- the hospital ----
def hospital():
    clear(); P = []
    w, d = 17.0, 8.6
    # The main ward: an arcade below, a second storey with lattice windows above.
    h1, h2 = 3.6, 3.2
    P.append(cube((0, 0, (h1 + h2) / 2), (w / 2, d / 2, (h1 + h2) / 2), M['plaster'], bevel=0.04))
    # Ground-floor arcade on the front.
    bays = 6
    bay = w / bays
    for i in range(bays + 1):
        x = -w / 2 + i * bay
        P.append(cube((x, -d / 2 - 0.02, 1.35), (0.26, 0.28, 1.35), M['plaster']))
    for i in range(bays):
        x = -w / 2 + (i + 0.5) * bay
        spring = 2.3; crown = 3.3
        for st in range(4):
            t0 = st / 4; t1 = (st + 1) / 4
            half = bay / 2 - 0.26
            x0 = half * (1 - t0 ** 1.3); x1 = half * (1 - t1 ** 1.3)
            y0 = spring + (crown - spring) * t0; y1 = spring + (crown - spring) * t1
            xm = (x0 + x1) / 2
            for sx in (-1, 1):
                P.append(cube((x + sx * xm, -d / 2 - 0.02, (y0 + y1) / 2), (max(xm, 0.07), 0.28, (y1 - y0) / 2 + 0.02), M['plaster']))
        P.append(cube((x, -d / 2 + 0.5, 1.3), (bay / 2 - 0.32, 0.08, 1.3), M['plaster_dark']))
    # Upper-storey lattice windows, each with a small arch and a shutter.
    for i in range(7):
        x = -w / 2 + (i + 0.5) * w / 7
        P.append(cube((x, -d / 2 - 0.06, h1 + 1.5), (0.6, 0.1, 0.85), M['lattice']))
        P.append(cube((x, -d / 2 - 0.02, h1 + 2.28), (0.78, 0.14, 0.12), M['plaster']))
    P.append(cube((0, 0, h1 + h2 - 0.1), (w / 2 + 0.15, d / 2 + 0.15, 0.1), M['plaster']))
    crenellation(P, w, -d / 2 - 0.05, d / 2 + 0.05, h1 + h2 + 0.02, M['plaster'])
    # A small plaster dome over the entrance bay.
    P.append(cyl((0, 0, h1 + h2 + 0.35), 1.9, 0.7, M['plaster'], verts=14))
    P.append(dome((0, 0, h1 + h2 + 0.7), 1.75, 1.7, M['plaster'], seg=14, rings=5))
    return join(P, 'hospital')

# ---------------------------------------------------------------- the market ----
def market():
    clear(); P = []
    w, d, h = 17.2, 5.4, 4.3
    # A row of shops behind an arcade, each shop with its own arched doorway and a cloth awning.
    P.append(cube((0, 0, h / 2), (w / 2, d / 2, h / 2), M['plaster'], bevel=0.04))
    P.append(cube((0, 0, h + 0.02), (w / 2 + 0.1, d / 2 + 0.1, 0.08), M['roof']))
    bays = 5
    bay = w / bays
    for i in range(bays + 1):
        x = -w / 2 + i * bay
        P.append(cube((x, -d / 2 - 0.9, 1.55), (0.26, 0.3, 1.55), M['plaster']))
    for i in range(bays):
        x = -w / 2 + (i + 0.5) * bay
        spring = 2.5; crown = 3.5
        for st in range(4):
            t0 = st / 4; t1 = (st + 1) / 4
            half = bay / 2 - 0.26
            x0 = half * (1 - t0 ** 1.3); x1 = half * (1 - t1 ** 1.3)
            y0 = spring + (crown - spring) * t0; y1 = spring + (crown - spring) * t1
            xm = (x0 + x1) / 2
            for sx in (-1, 1):
                P.append(cube((x + sx * xm, -d / 2 - 0.9, (y0 + y1) / 2), (max(xm, 0.07), 0.3, (y1 - y0) / 2 + 0.02), M['plaster']))
        P.append(cube((x, -d / 2 - 0.9, (h + crown) / 2), (bay / 2 - 0.2, 0.3, (h - crown) / 2 + 0.08), M['plaster']))
        # the shop's dark opening and its wooden counter
        P.append(cube((x, -d / 2 - 0.06, 1.35), (1.05, 0.12, 1.35), M['darkwood']))
        P.append(cube((x, -d / 2 - 0.7, 0.85), (1.2, 0.5, 0.1), M['wood']))
        # a cloth awning sloping out over the stall in front
        awn = cube((x, -d / 2 - 1.7, 2.95), (bay / 2 - 0.25, 0.9, 0.04), M['fabric'], rot=(math.radians(24), 0, 0))
        P.append(awn)
        for px in (-1, 1):
            P.append(cyl((x + px * (bay / 2 - 0.45), -d / 2 - 2.4, 1.3), 0.05, 2.6, M['wood'], verts=6))
    crenellation(P, w, -d / 2 - 0.04, d / 2 + 0.04, h + 0.06, M['plaster'])
    return join(P, 'market')

results = {}
for kind, fn in {'market': market, 'bath': bath, 'library': library, 'school': school, 'hospital': hospital}.items():
    obj = fn()
    results[kind] = finish(kind, [obj])
print('GOLDEN_AGE_BUILDINGS', {k: v[1] for k, v in results.items()})
