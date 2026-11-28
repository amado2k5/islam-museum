"""Granada: the LOD1 makings of the town set, the landmarks and the mill.

Run:  blender --background --factory-startup --python gaming/art/blender/granada_lods.py -- <models dir>

Each asset is imported from its glTF, every mesh is decimated to half its triangles (the same temporary
decimation the palace's lod2 uses), and the result is written beside it as <name>-lod1.gltf with the same
textures. Origins, object names and materials are kept so the game can stand the lighter making in the same
places. UVs and normals survive decimation well enough for a distant view; this is a distance LOD, not a
replacement.
"""
import os
import sys

import bpy

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
models = os.path.abspath(argv[0]) if argv else os.path.abspath("gaming/media/models/granada/2")
RATIO = 0.5
SETS = ["town", "landmarks", "mill"]


def triangles(obj):
    mesh = obj.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
    mesh.calc_loop_triangles()
    count = len(mesh.loop_triangles)
    obj.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh_clear()
    return count


def lodify(name):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    src = os.path.join(models, f"{name}.gltf")
    bpy.ops.import_scene.gltf(filepath=src)
    objects = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    before = {o.name: triangles(o) for o in objects}
    for obj in objects:
        mod = obj.modifiers.new("lod1 decimation", "DECIMATE")
        mod.ratio = RATIO
        mod.use_collapse_triangulate = True
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.modifier_apply(modifier=mod.name)
        obj.select_set(False)
    after = {o.name: triangles(o) for o in objects}
    dst = os.path.join(models, f"{name}-lod1.gltf")
    for obj in bpy.context.scene.objects:
        obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=dst,
        export_format="GLTF_SEPARATE",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_tangents=True,
        export_texture_dir="textures",
        export_image_format="JPEG",
        export_image_quality=90,
        export_jpeg_quality=90,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
    )
    print(f"ART lods: {name}: {sum(before.values())} -> {sum(after.values())} triangles", flush=True)
    for obj in objects:
        print(f"ART lods:   {obj.name}: {before[obj.name]} -> {after[obj.name]}", flush=True)


for name in SETS:
    lodify(name)
