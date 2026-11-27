"""Granada prototype animals: sheep, goat, horse, ox and donkey.

Run: blender --background --factory-startup --python gaming/art/blender/granada_animals.py -- <out dir> [render dir]
Each animal is one glTF: a body object and four leg objects. Every leg origin is its shoulder/hip joint so the game
can rotate it there. Forward is Blender -Y, which the glTF exporter writes as game forward +Z. Prototype only;
historical review pending.
"""
import math, os, sys
import bpy
from mathutils import Vector

argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
out=os.path.abspath(argv[0]) if argv else os.path.abspath('gaming/media/models/granada/animals')
rend=os.path.abspath(argv[1]) if len(argv)>1 else None
os.makedirs(out,exist_ok=True)
if rend: os.makedirs(rend,exist_ok=True)

def mat(name,rgb):
 m=bpy.data.materials.get(name) or bpy.data.materials.new(name); m.diffuse_color=(*rgb,1); m.use_nodes=True
 bsdf=m.node_tree.nodes.get('Principled BSDF'); bsdf.inputs['Base Color'].default_value=(*rgb,1); bsdf.inputs['Roughness'].default_value=.82
 return m
M={k:mat(k,v) for k,v in {'hide':(.42,.29,.17,),'darkhide':(.24,.17,.11),'wool':(.82,.78,.67),'darkwool':(.38,.32,.25),'mane':(.12,.095,.07),'hoof':(.09,.075,.06),'horn':(.72,.66,.52),'cloth':(.52,.06,.045),'muzzle':(.16,.12,.09)}.items()}

def clear():
 bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
 for d in (bpy.data.meshes,bpy.data.curves,bpy.data.cameras,bpy.data.lights):
  pass

def obj(name,me):
 o=bpy.data.objects.new(name,me); bpy.context.collection.objects.link(o); return o

def sphere(name,loc,scale,material,seg=12,rings=8):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=rings,location=loc)
 o=bpy.context.object; o.name=name; o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 o.data.materials.append(material); return o

def cyl(name,loc,radius,depth,material,rot=(0,0,0),verts=10):
 bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=radius,depth=depth,location=loc,rotation=rot)
 o=bpy.context.object; o.name=name; o.data.materials.append(material); return o

def cone(name,loc,r1,r2,depth,material,rot=(0,0,0),verts=8):
 bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r1,radius2=r2,depth=depth,location=loc,rotation=rot)
 o=bpy.context.object; o.name=name; o.data.materials.append(material); return o

def cube(name,loc,scale,material,rot=(0,0,0),bevel=.03):
 bpy.ops.mesh.primitive_cube_add(location=loc,rotation=rot); o=bpy.context.object; o.name=name; o.scale=scale
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(material)
 if bevel:
  mod=o.modifiers.new('soft','BEVEL'); mod.width=bevel; mod.segments=2; bpy.ops.object.modifier_apply(modifier=mod.name)
 return o

def join(parts,name):
 bpy.ops.object.select_all(action='DESELECT')
 for p in parts: p.select_set(True)
 bpy.context.view_layer.objects.active=parts[0]; bpy.ops.object.join(); parts[0].name=name; return parts[0]

def leg(name,joint,length,width,forward=0):
 # Leg hangs down from its object origin. Geometry is made around the joint, then the object origin is left there.
 upper=cyl(name+'_upper',(0,0,-length*.38),width,length*.76,M['hide'],verts=8)
 hoof=cube(name+'_hoof',(0,forward,-length+.035),(width*1.15,width*1.45,.045),M['hoof'],bevel=.01)
 o=join([upper,hoof],name)
 o.location=joint
 return o

def animal(kind,cfg):
 clear(); parts=[]
 hide=M[cfg.get('hide','hide')]
 # Blender y is negative forward. Body centre at origin-ish, z up.
 parts.append(sphere('barrel',(0,0,cfg['body_z']),cfg['body'],hide,14,9))
 parts.append(sphere('chest',(0,-cfg['body'][1]*.58,cfg['body_z']+.03),(cfg['body'][0]*.82,cfg['body'][1]*.55,cfg['body'][2]*.9),hide,12,8))
 parts.append(sphere('rump',(0,cfg['body'][1]*.58,cfg['body_z']),(cfg['body'][0]*.86,cfg['body'][1]*.52,cfg['body'][2]*.88),hide,12,8))
 nz=cfg['body_z']+cfg['neck'][2]; ny=-cfg['body'][1]-cfg['neck'][1]
 parts.append(cyl('neck',(0,ny,nz),cfg['neck'][0],cfg['neck'][3],hide,(math.pi/2-cfg['neck'][4],0,0),10))
 hz=nz+math.sin(cfg['neck'][4])*cfg['neck'][3]*.48; hy=ny-math.cos(cfg['neck'][4])*cfg['neck'][3]*.48
 parts.append(sphere('head',(0,hy,hz),cfg['head'],hide,12,8))
 parts.append(sphere('muzzle',(0,hy-cfg['head'][1]*.82,hz-cfg['head'][2]*.18),(cfg['head'][0]*.62,cfg['head'][1]*.55,cfg['head'][2]*.55),M['muzzle'],10,6))
 for sx in (-1,1):
  parts.append(cone('ear',(sx*cfg['head'][0]*.72,hy+cfg['head'][1]*.05,hz+cfg['head'][2]*.65),cfg['ear'],0,cfg['ear']*2.7,hide,(0,sx*.35,0),6))
  if cfg.get('horns'):
   parts.append(cone('horn',(sx*cfg['head'][0]*.58,hy+cfg['head'][1]*.1,hz+cfg['head'][2]*.8),cfg['horns'],0,cfg['horns']*4,M['horn'],(sx*.65,0,0),7))
 if cfg.get('mane'):
  parts.append(cube('mane',(0,ny+0.03,nz+0.1),(cfg['neck'][0]*.35,cfg['neck'][3]*.46,cfg['neck'][0]*.28),M['mane'],bevel=.02))
 if cfg.get('cloth'):
  parts.append(cube('saddle-cloth',(0,0.03,cfg['body_z']+cfg['body'][2]*.83),(cfg['body'][0]*1.04,cfg['body'][1]*.52,.045),M['cloth'],bevel=.015))
 # Tail, backwards (+Y in Blender).
 parts.append(cyl('tail',(0,cfg['body'][1]*1.02,cfg['body_z']+cfg['body'][2]*.25),cfg['tail'],cfg['tail']*7,M['mane'],(math.pi/2-.45,0,0),7))
 body=join(parts,kind+'_body')
 # legs at game-matching joints; Blender forward sign inverted from game z.
 for i,(x,zup,zfwd) in enumerate(cfg['joints']):
  leg(kind+'_leg_'+('fl fr rl rr'.split()[i]),(x,-zfwd,zup),cfg['leglen'],cfg['legwidth'])
 # export whole scene
 for o in bpy.context.scene.objects: o.select_set(True)
 path=os.path.join(out,kind+'.gltf')
 bpy.ops.export_scene.gltf(filepath=path,export_format='GLTF_SEPARATE',use_selection=True,export_yup=True,export_apply=True)
 tris=sum(len(o.data.polygons) for o in bpy.context.scene.objects if o.type=='MESH')
 return path,tris

sheepj=[(-.16,.36,.32),(.16,.36,.32),(-.16,.36,-.32),(.16,.36,-.32)]
horsej=[(-.2,.94,.68),(.2,.94,.68),(-.2,.94,-.68),(.2,.94,-.68)]
oxj=[(-.27,.74,2.2),(.27,.74,2.2),(-.27,.74,.75),(.27,.74,.75)]
# Ox joints are in the cart frame and include the forward cart offset; the standalone ox body is centred under them at z about 1.48.
specs={
 'sheep':dict(body=(.28,.5,.27),body_z=.58,neck=(.11,.08,.12,.32,.45),head=(.12,.18,.13),ear=.045,tail=.018,horns=0,hide='wool',joints=sheepj,leglen=.36,legwidth=.045),
 'goat':dict(body=(.24,.49,.25),body_z=.6,neck=(.095,.08,.13,.34,.55),head=(.105,.17,.12),ear=.04,tail=.015,horns=.035,hide='darkwool',joints=sheepj,leglen=.38,legwidth=.04),
 'horse':dict(body=(.31,.9,.36),body_z=1.12,neck=(.15,.18,.3,.72,.7),head=(.14,.3,.18),ear=.045,tail=.035,horns=0,mane=1,cloth=1,joints=horsej,leglen=.94,legwidth=.065),
 'donkey':dict(body=(.27,.78,.32),body_z=1.0,neck=(.13,.15,.25,.62,.65),head=(.13,.27,.16),ear=.07,tail=.025,horns=0,mane=1,joints=horsej,leglen=.82,legwidth=.055),
 'ox':dict(body=(.43,.93,.43),body_z=.98,neck=(.2,.16,.16,.48,.55),head=(.19,.28,.2),ear=.055,tail=.032,horns=.045,joints=oxj,leglen=.9,legwidth=.085),
}
results={}
for k,c in specs.items(): results[k]=animal(k,c)
print('GRANADA_ANIMALS',results)
