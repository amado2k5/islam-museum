// Draws Granada's valley with Three.js on WebGPU. It is given the geometry of view/valley.ts and a "look" worked out
// from the state of the game (which crop stands where and how much of it, which branches carry water, how full the
// pool is, how many houses stand), and holds no game state of its own.
//
// The materials, the water and the post-processing follow The Golden Age's renderer (docs/gaming/adr/G-0002). One
// lesson from it is kept here: the environment map is made once and never swapped during play.
import * as THREE from "three/webgpu";
import { positionView } from "three/tsl";
import { abs as tslAbs, attribute, builtinAOContext, float, floor, fract, fwidth, instanceIndex, min, mix, mod as tslMod, mrt, normalMap, normalView, pass, positionLocal, positionWorld, screenUV, sin, smoothstep, texture, triplanarTexture, uniform, uv, vec2, vec3, vec4 } from "three/tsl";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { SkyMesh } from "three/addons/objects/SkyMesh.js";
import { Rng, hash32 } from "@im/kernel/prng";
import { instanceMatrix, type MeshData, type Rgb } from "@im/worldkit/mesh";
import { MATERIALS, type MaterialSpec, type SceneMaterialId } from "@im/worldkit/district/generate";
import { ROBE_TINTS, awningMesh, palmMesh, personBodyMesh, personHeadMesh, stallMesh } from "@im/worldkit/district/kit";
import type { Atmosphere } from "@im/worldkit/atmosphere";
import type { TextureData, TextureKind } from "@im/worldkit/textures";
import { FOV, eyeOf, type Pose } from "./camera";
import { HORSE_LEGS, OX_LEGS, PERSON_LEGS, SHEEP_LEGS, basket, bird, donkey, guardGear, horse, horseLeg, ladder, oxBody, oxLeg, personBody, personLeg, sheep, sheepLeg } from "./buildings";
import { ANIMAL_KINDS, extractAnimal, type AnimalKind } from "./animals";
import { along, fieldTo, limbMatrix, route, walkGrid, walkOf, type Walk, type WalkGrid } from "./paths";
import { MODELS_AVAILABLE, disposeModel, disposeSharedMaterials, loadModel, modelUrl } from "./models";
/**
 * The folder of this game's models on the host. A file on the host is never replaced, so a set that changes gets a
 * new folder, and a release that is rolled back to still finds the set it was made for.
 */
const MODEL_SET = "granada/2/";
/** The pieces the hill needs before the valley stops making its own wall, towers and halls there. */
/**
 * Candidate C, an art set under evaluation: the pieces it has, each a file of its own in its own folder. It is drawn
 * only when the page is asked for it (`art=c`, or `art=c1` and `art=c2` for its lighter makings), piece by piece in place of Set A's; a piece that cannot be had leaves
 * Set A's standing. It is not the game's art, and nothing of it is kept in a save.
 */
export type Art = "a" | "c" | "c1" | "c2";
/**
 * The palace the game shows (founder, 26 November 2026: "make a magnificent palace"): the palace written as a
 * building of its own, in its lighter making of about 70,000 triangles, in a folder of its own that borrows the
 * first set's textures instead of carrying copies. It takes the place of the first set's palace once it has arrived
 * whole; if it cannot be had, the first set's stands. `art=a` asks for the first set's palace and fetches no other.
 * Making it the default is not the founder's acceptance of the art's direction, which he has not given.
 */
const PALACE: Record<string, string> = { palace: "granada/p1/palace.gltf" };
const CANDIDATE_C: Record<Exclude<Art, "a">, Record<string, string>> = {
  // The palace as it was written, 214,166 triangles: the one to judge the look by.
  c: { palace: "granada/c/palace.gltf" },
  // Two lighter makings of the same palace (about 70,000 and 20,000 triangles), to judge what is lost. One file is
  // fetched and drawn, whichever is asked for: the game does not change between them by itself.
  c1: { palace: "granada/c/palace-lod1.gltf" },
  c2: { palace: "granada/c/palace-lod2.gltf" },
};
const HILL_PIECES = ["wall", "tower", "gate", "scaffold", "crane", "palace", "estate"];
import { BOUNDS, BRIDGE, RIVER_HALF, riverZ } from "./valley";
import { CHANNELS, ESTATE, FIELDS, GRANARY, HOUSE_LOTS, KIT_HOUSES, MARKET, PLOT_GRID, POOL, STORE, VILLAGE, broadTree, buildLand, buildRange, buildRiver, buildScenery, channelWater, cropSpots, cypressTree, fieldAt, fieldGround, heightAt, oliveTree, orchardTree, placedBuilding, plotTable, poolWater, poplarTree, vegetablePlant, wheatTuft, type Chunk , type KitPlacement } from "./valley";

export type Quality = "low" | "medium" | "high";
/**
 * What each preset spends on the picture. The game is the same game at all three, with the same land, town, people
 * and panels; what changes is how many pixels are drawn, how sharp the shadows are, whether corners are darkened and
 * lights glow, and how far from the eye a tree is still drawn in full.
 */
export const PRESETS: Record<Quality, { pixelRatio: number; shadow: number; occlusion: boolean; glow: boolean; near: number; textures: number }> = {
  low: { pixelRatio: 1, shadow: 1024, occlusion: false, glow: false, near: 0.4, textures: 512 },
  medium: { pixelRatio: 1.5, shadow: 2048, occlusion: false, glow: true, near: 0.7, textures: 1024 },
  high: { pixelRatio: 2, shadow: 4096, occlusion: true, glow: true, near: 1, textures: 1024 },
};
export interface ValleyOptions {
  quality: Quality;
  seed: number;
  reducedMotion: boolean;
  maxPixelRatio: number;
  /** Whether to fetch the authored models. Without them the valley draws its own shapes, as it does until they arrive. */
  models: boolean;
  /** Another palace than the game's own: `a` for the first set's, `c`, `c1` or `c2` for one under evaluation. */
  art?: Art | null;
}
export interface FieldLook {
  crop: "wheat" | "olives" | "vegetables" | null;
  /** 0 to 1. */
  growth: number;
  /** Share of the crop still standing in the field: 1 while it grows, falling as it is brought in, 0 when gathered. */
  standing: number;
  ripe: boolean;
  /** The crop is being brought in now: people are at work in the field. */
  harvesting?: boolean;
}
export interface ValleyLook {
  season: number;
  rain: boolean;
  /** 0 to 1. */
  pool: number;
  branches: Record<string, "flowing" | "weak" | "none">;
  fields: Record<string, FieldLook>;
  houses: number;
  housesUnderWay: number;
  granary: "none" | "under-way" | "built";
  /** People out at work, drawn walking between the village and the places where there is work. */
  busy: number;
  selected: string | null;
  /** What the player has placed on the land: scaffolding until it is done, the building after. */
  placed?: Array<{ id: number; what: string; x: number; z: number; r: number; done: boolean }>;
}

const sunFrom = (azimuthDeg: number, elevationDeg: number): [number, number, number] => {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  return [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)];
};
/**
 * The light of each season. The sun stands in the south, to the right of the valley as it is first seen, so that
 * walls, trees and furrows are modelled by light from the side. Art direction, not a sky model.
 */
/** Three hours of the day, for pictures: where the sun stands, its colour, and its strength beside the season's own. */
const HOUR_LIGHT: Record<"morning" | "midday" | "evening", { azimuth: number; elevation: number; colour: [number, number, number]; strength: number }> = {
  morning: { azimuth: 104, elevation: 16, colour: [1.0, 0.82, 0.6], strength: 1.1 },
  midday: { azimuth: 182, elevation: 58, colour: [1.0, 0.97, 0.9], strength: 0.95 },
  evening: { azimuth: 256, elevation: 11, colour: [1.0, 0.68, 0.42], strength: 1.15 },
};
export const SEASON_LIGHT: Atmosphere[] = [
  { id: "golden", sunDirection: sunFrom(152, 34), sunColor: [1.0, 0.92, 0.78], sunIntensity: 4.6, skyZenith: [0.12, 0.3, 0.68], skyHorizon: [0.86, 0.88, 0.86], ambientSky: [0.66, 0.7, 0.84], ambientGround: [0.46, 0.4, 0.27], ambientIntensity: 1.25, fogColor: [0.6, 0.72, 0.86], fogDensity: 0.00006, exposure: 0.9, emissive: 0.1 },
  { id: "noon", sunDirection: sunFrom(196, 52), sunColor: [1.0, 0.95, 0.84], sunIntensity: 4.2, skyZenith: [0.13, 0.33, 0.76], skyHorizon: [0.82, 0.86, 0.9], ambientSky: [0.55, 0.7, 1.0], ambientGround: [0.5, 0.44, 0.3], ambientIntensity: 1, fogColor: [0.62, 0.74, 0.88], fogDensity: 0.00007, exposure: 0.84, emissive: 0 },
  { id: "golden", sunDirection: sunFrom(214, 21), sunColor: [1.0, 0.76, 0.48], sunIntensity: 5.4, skyZenith: [0.08, 0.22, 0.58], skyHorizon: [1.2, 0.84, 0.52], ambientSky: [0.44, 0.52, 0.8], ambientGround: [0.44, 0.32, 0.2], ambientIntensity: 1, fogColor: [0.82, 0.7, 0.6], fogDensity: 0.00009, exposure: 0.92, emissive: 0.3 },
  { id: "noon", sunDirection: sunFrom(164, 22), sunColor: [0.96, 0.88, 0.8], sunIntensity: 3.6, skyZenith: [0.18, 0.28, 0.5], skyHorizon: [0.8, 0.8, 0.82], ambientSky: [0.5, 0.56, 0.72], ambientGround: [0.36, 0.34, 0.32], ambientIntensity: 1.1, fogColor: [0.66, 0.7, 0.76], fogDensity: 0.00012, exposure: 0.95, emissive: 0.2 },
];
/** The sky model is far brighter than the scene's lights are set for; it is drawn at this share of itself. */
const SKY_GAIN = 0.55;

type TreeKind = "broad" | "citrus" | "almond" | "poplar" | "cypress" | "scrub";
/** The colour of each kind of tree in spring, summer, autumn and winter. */
const TREE_TINT: Record<TreeKind, Rgb[]> = {
  broad: [[0.2, 0.4, 0.1], [0.13, 0.3, 0.07], [0.5, 0.34, 0.07], [0.27, 0.23, 0.16]],
  citrus: [[0.07, 0.2, 0.06], [0.06, 0.18, 0.05], [0.07, 0.19, 0.055], [0.06, 0.16, 0.055]],
  almond: [[0.86, 0.6, 0.66], [0.17, 0.33, 0.09], [0.45, 0.31, 0.08], [0.26, 0.21, 0.16]],
  poplar: [[0.27, 0.45, 0.12], [0.17, 0.36, 0.09], [0.72, 0.52, 0.08], [0.3, 0.26, 0.19]],
  cypress: [[0.05, 0.13, 0.06], [0.05, 0.13, 0.06], [0.05, 0.125, 0.06], [0.045, 0.115, 0.06]],
  scrub: [[0.12, 0.19, 0.075], [0.11, 0.17, 0.07], [0.12, 0.17, 0.07], [0.1, 0.15, 0.07]],
};
interface Grove {
  kind: TreeKind;
  spots: number[][];
  near: THREE.InstancedMesh;
  far: THREE.InstancedMesh;
  tints: Float32Array;
}

const color = (c: readonly [number, number, number]) => new THREE.Color().setRGB(c[0], c[1], c[2], THREE.LinearSRGBColorSpace);
function geometryOf(m: MeshData): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(m.positions, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(m.normals, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(m.uvs, 2));
  g.setAttribute("color", new THREE.BufferAttribute(m.colors, 3));
  g.setIndex(new THREE.BufferAttribute(m.indices, 1));
  return g;
}
/** A figure's matrix: where it stands, the way it faces, and a lean to one side and the other as it walks. */
function walkingMatrix(out: Float32Array, o: number, x: number, y: number, z: number, yaw: number, roll: number, k: number): void {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  out.set([c * cr * k, sr * k, -s * cr * k, 0, -c * sr * k, cr * k, s * sr * k, 0, s * k, 0, c * k, 0, x, y, z, 1], o);
}
const CARTS = 6;
/** Sheep and goats to a flock, riders on the roads, and birds over the valley. They are scenery: the game's rules know nothing of them. */
const FLOCK = 18;
const RIDERS = 7;
const BIRDS = 14;
/** How high above its foot a man stands on the hill's wall. */
const WALL_WALK = 7.2;
const COATS: Rgb[] = [[0.42, 0.27, 0.16], [0.2, 0.17, 0.15], [0.62, 0.5, 0.36], [0.72, 0.7, 0.66], [0.33, 0.2, 0.12]];
const FLEECE: Rgb[] = [[0.92, 0.9, 0.84], [0.86, 0.82, 0.74], [0.95, 0.93, 0.88], [0.3, 0.26, 0.22], [0.7, 0.6, 0.46]];
const GOAT_TINTS: Rgb[] = [[0.4, 0.33, 0.25], [0.6, 0.54, 0.45], [0.22, 0.2, 0.18], [0.78, 0.74, 0.66], [0.5, 0.38, 0.26]];
const DONKEY_TINTS: Rgb[] = [[0.58, 0.55, 0.5], [0.46, 0.43, 0.39], [0.64, 0.6, 0.53]];
const OX_TINTS: Rgb[] = [[0.5, 0.36, 0.22], [0.42, 0.3, 0.18], [0.56, 0.44, 0.3], [0.36, 0.27, 0.19], [0.48, 0.38, 0.3], [0.44, 0.3, 0.16]];
const WHEAT_SPACING = 1.7;
const VEG_SPACING = 2.6;
const WALKERS = 64;
/** People at work in a field that is being brought in, at most. */
const HARVESTERS = 30;
/** Baskets and stooks a harvest sets out, at most. */
const BASKETS = 64;
/** A person standing at (x, y, z), turned by yaw and bent forward by pitch, as one who stoops to cut or reaches to pick. */
function bendingMatrix(out: Float32Array, o: number, x: number, y: number, z: number, yaw: number, pitch: number, k: number): void {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  out.set([c * k, 0, -s * k, 0, s * sp * k, cp * k, c * sp * k, 0, s * cp * k, -sp * k, c * cp * k, 0, x, y, z, 1], o);
}
const GREEN: Rgb = [0.3, 0.56, 0.16];
const GOLD: Rgb = [0.98, 0.68, 0.2];

interface Soil {
  material: THREE.Material;
  ground: { value: THREE.Color };
  rows: { value: THREE.Color };
  /** The ground-atlas slot answering what the field is under: ploughed earth, green or ripe wheat, stubble, vegetables. */
  slot: { value: number };
}

/** The slots of the ground atlas, in the order art/make_ground_atlas.py writes them:
 * 0 ploughed earth, 1 green wheat, 2 ripe wheat, 3 stubble, 4 vegetable beds, 5 dry grass, 6 riverbank, 7 dirt road, 8 cobbles. */

/** The atlas is a grid four slots wide of square tiles, in a file 2048 by 1536: scale and one-texel margin of a slot. */
const ATLAS_SCALE = vec2(0.25, 1 / 3);
const ATLAS_MARGIN = vec2(1 / 2048, 1 / 1536);
/**
 * The painted ground of one slot of the atlas at a point of the land, in tiles of the given metres — the tile's own
 * colour, sampled as the surface's albedo. The tiles are not seamless as delivered, so the mapping mirrors them
 * (a triangle wave) inside the slot rather than trusting the edges to meet; the seam a mirror makes is a line of
 * symmetry, invisible in ground cover.
 */
function atlasPaint(atlasTex: THREE.Texture, p: any, tileMeters: number, slot: any): any {
  const t = p.div(tileMeters);
  const wave = tslAbs(fract(t.add(1).div(2)).mul(2).oneMinus());
  const col = tslMod(slot, float(4));
  // The atlas image's first row in memory is its top, and the texture upload flips it, so the slot rows run
  // three-to-nought in the texture's v: row nought of the slots is the highest third of the picture.
  const row = float(2).sub(floor(slot.div(4)));
  const tileUV = vec2(col, row).mul(ATLAS_SCALE).add(ATLAS_MARGIN).add(wave.mul(ATLAS_SCALE.sub(ATLAS_MARGIN.mul(2))));
  return texture(atlasTex, tileUV).rgb;
}

export class ValleyRenderer {
  private renderer!: THREE.WebGPURenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(FOV, 1, 3, 14000);
  private pipeline: THREE.RenderPipeline | null = null;
  private readonly materials = new Map<SceneMaterialId, THREE.Material>();
  private readonly waterTime = uniform(0);
  private readonly disposables: Array<{ dispose(): void }> = [];
  private sky!: SkyMesh;
  private sun!: THREE.DirectionalLight;
  private hemi!: THREE.HemisphereLight;
  private season = -1;
  private raining = false;
  private skyCover = 0.5;
  private sunDirection: readonly [number, number, number] = [0, 1, 0];
  private shadowAt = "";
  private readonly groves: Grove[] = [];
  private lod: [number, number, number] = [1e9, 1e9, 0];
  private pose: Pose | null = null;
  private pixelRatioCap = 2;
  private aspect = 1;
  private canvas!: HTMLCanvasElement;
  private options!: ValleyOptions;
  private cpuMs = 0;
  private poolMesh!: THREE.Mesh;
  private poolFloor = 0;
  private readonly channels = new Map<string, { head: THREE.Mesh; tail: THREE.Mesh }>();
  private meadowStone: THREE.Mesh[] = [];
  private houses: THREE.Mesh[][] = [];
  private granary: THREE.Mesh[] = [];
  private scaffold!: THREE.InstancedMesh;
  private readonly placedMeshes = new Map<number, THREE.Mesh[]>();
  private lightPreview: "morning" | "midday" | "evening" | null = null;
  private ghost!: THREE.Mesh;
  private ghostFill!: THREE.Mesh;
  private readonly crops = new Map<string, { wheat: THREE.InstancedMesh; veg: THREE.InstancedMesh; wheatSpots: Float32Array; vegSpots: Float32Array; soil: Soil; shown: string }>();
  private olives!: THREE.InstancedMesh;
  private oliveSpots: number[][] = [];
  private bodies!: THREE.InstancedMesh;
  private heads!: THREE.InstancedMesh;
  private walkers = 0;
  private ladders!: THREE.InstancedMesh;
  private baskets!: THREE.InstancedMesh;
  /** Where people are at work in a harvest: a place, the way they face, and whether they reach up (olives) or stoop. */
  private workSpots: Array<{ x: number; z: number; yaw: number; reach: boolean; carrier: boolean; to: [number, number]; walk?: Walk }> = [];
  /** Where people may walk, and for each place they go to, the way to it from anywhere. */
  private walkable: WalkGrid | null = null;
  private fields = new Map<string, Int32Array>();
  /** Each walker's way from home to its work, for the work it has now. */
  private walkRoutes: Walk[] = [];
  /** How far each person's legs swing this frame, by the index they are drawn at. */
  private strides = new Float32Array(0);
  private legs!: THREE.InstancedMesh;
  private watchLegs!: THREE.InstancedMesh;
  private horseLegs!: THREE.InstancedMesh;
  private sheepLegs!: THREE.InstancedMesh;
  private oxLegs!: THREE.InstancedMesh;
  private goats!: THREE.InstancedMesh;
  private goatLegs!: THREE.InstancedMesh;
  private oxen!: THREE.InstancedMesh;
  private donkeys!: THREE.InstancedMesh;
  private donkeyLegs!: THREE.InstancedMesh;
  // Which flock animal is a goat and where it sits in its own kind's mesh: fixed, so a frame writes it the same way every time.
  private flockGoat: boolean[] = [];
  private flockSlot: number[] = [];
  private walkTargets: Array<[number, number]> = [];
  private ring!: THREE.Mesh;
  private wheel!: THREE.Mesh;
  private wheelTurns = false;
  private codeMill: THREE.Mesh[] = [];
  private millModel: THREE.Object3D | null = null;
  private townModel: THREE.Object3D | null = null;
  private landmarksModel: THREE.Object3D | null = null;
  private candidateModels: THREE.Object3D[] = [];
  private millWheel: THREE.Object3D | null = null;
  private readonly models: string[] = [];
  private readonly modelFailures: string[] = [];
  private groundAtlas: THREE.Texture | null = null;
  private sierra: THREE.Mesh | null = null;
  private sierraMaps: { autumn: THREE.Texture; winter: THREE.Texture } | null = null;
  /** The painted sky: a dome that follows the camera, shown in place of the physical sky while its painting is had. */
  private skyDome: THREE.Mesh | null = null;
  private skyPaint: THREE.MeshBasicMaterial | null = null;
  private readonly skyTex = new Map<string, THREE.Texture>();
  private readonly skyLoading = new Set<string>();
  private skyWanted: string | null = null;
  private skyFailed = false;
  private disposed = false;
  private carts!: THREE.InstancedMesh;
  private flocks!: THREE.InstancedMesh;
  private pastures: number[][] = [];
  private horses!: THREE.InstancedMesh;
  private riderBodies!: THREE.InstancedMesh;
  private riderHeads!: THREE.InstancedMesh;
  private riderRoads: Array<ReadonlyArray<readonly [number, number]>> = [];
  private watchBodies!: THREE.InstancedMesh;
  private watchHeads!: THREE.InstancedMesh;
  private watchGear!: THREE.InstancedMesh;
  private guardWalks: number[][] = [];
  private gatePosts: number[][] = [];
  private birds!: THREE.InstancedMesh;
  private cartRoads: Array<ReadonlyArray<readonly [number, number]>> = [];
  private lastTime = 0;
  private rain!: THREE.LineSegments;
  private readonly raycaster = new THREE.Raycaster();

  static async create(canvas: HTMLCanvasElement, textures: Map<TextureKind, TextureData>, options: ValleyOptions): Promise<ValleyRenderer> {
    const r = new ValleyRenderer();
    await r.init(canvas, textures, options);
    return r;
  }

  private async init(canvas: HTMLCanvasElement, textures: Map<TextureKind, TextureData>, options: ValleyOptions): Promise<void> {
    this.canvas = canvas;
    this.options = options;
    this.pixelRatioCap = options.maxPixelRatio;
    const preset = PRESETS[options.quality];
    const seed = options.seed;
    const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, powerPreference: "high-performance", forceWebGL: false });
    await renderer.init();
    if (!(renderer.backend as unknown as { isWebGPUBackend?: boolean }).isWebGPUBackend) throw new Error("no-webgpu-backend");
    this.renderer = renderer;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const scene = this.scene;

    // ---- Light ----
    this.hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(this.hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.castShadow = true;
    sun.shadow.mapSize.set(preset.shadow, preset.shadow);
    const sc = sun.shadow.camera;
    const R = 430;
    sc.left = -R;
    sc.right = R;
    sc.top = R;
    sc.bottom = -R;
    sc.near = 100;
    sc.far = 2600;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.6;
    sun.shadow.radius = 1.6;
    sun.target.position.set(40, 0, 40);
    scene.add(sun, sun.target);
    this.sun = sun;
    scene.fog = new THREE.FogExp2(0xffffff, 0.00015);

    // ---- Sky: a physical sky with drifting cloud, and one prefiltered environment made from it for every season ----
    const sky = new SkyMesh();
    sky.scale.setScalar(20000);
    sky.frustumCulled = false;
    sky.mieCoefficient.value = 0.004;
    sky.mieDirectionalG.value = 0.82;
    sky.turbidity.value = 3;
    sky.rayleigh.value = 1.5;
    sky.sunPosition.value.set(...SEASON_LIGHT[0]!.sunDirection);
    const skyMaterial = sky.material as THREE.NodeMaterial;
    const skyColour = skyMaterial.colorNode as unknown as ReturnType<typeof vec4>;
    skyMaterial.colorNode = vec4(skyColour.rgb.mul(SKY_GAIN), 1);
    // The sun's disc is left out of the environment, where it would become a blot of light on everything.
    sky.showSunDisc.value = false;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(sky);
    const environment = pmrem.fromScene(envScene, 0, 1, 30000);
    sky.showSunDisc.value = true;
    this.disposables.push(pmrem, environment, sky.geometry, skyMaterial);
    this.sky = sky;
    scene.add(sky);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.18;

    // ---- The painted ground detail: one atlas of the tiles painted to the museum's brief (draft, AI-made) ----
    // It is media beside the models. The valley is whole without it: where it cannot be had the land keeps its own
    // colours with the procedural grain alone, and the failure is named in modelFailures.
    if (options.models && MODELS_AVAILABLE) {
      try {
        const atlas = await new THREE.TextureLoader().loadAsync(modelUrl("granada/ground-atlas.jpg"));
        atlas.colorSpace = THREE.SRGBColorSpace;
        atlas.wrapS = atlas.wrapT = THREE.ClampToEdgeWrapping;
        atlas.minFilter = THREE.LinearMipmapLinearFilter;
        atlas.magFilter = THREE.LinearFilter;
        atlas.anisotropy = 8;
        atlas.needsUpdate = true;
        this.disposables.push(atlas);
        this.groundAtlas = atlas;
        this.models.push("granada/ground-atlas");
      } catch (e) {
        this.modelFailures.push(`granada/ground-atlas: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // ---- Materials ----
    const maps = new Map<TextureKind, { map: THREE.DataTexture; normal: THREE.DataTexture }>();
    for (const [kind, t] of textures) {
      const mk = (data: Uint8Array, srgb: boolean) => {
        const tex = new THREE.DataTexture(data, t.size, t.size, THREE.RGBAFormat, THREE.UnsignedByteType);
        tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 8;
        tex.repeat.set(1 / t.tileMeters, 1 / t.tileMeters);
        tex.needsUpdate = true;
        this.disposables.push(tex);
        return tex;
      };
      maps.set(kind, { map: mk(t.albedo, true), normal: mk(t.normal, false) });
    }
    const waterNormal = maps.get("water")?.normal;
    if (!waterNormal) throw new Error("the water texture is missing");
    for (const spec of MATERIALS) {
      const m = spec.id === "water" || spec.id === "canalwater" ? this.makeWater(spec, waterNormal) : spec.id === "foliage" ? this.makeFoliage(spec, seed) : this.makeStandard(spec, maps);
      this.materials.set(spec.id, m);
      this.disposables.push(m);
    }
    const mat = (id: SceneMaterialId) => this.materials.get(id)!;
    const add = (mesh: MeshData, material: SceneMaterialId, cast: boolean, receive = true): THREE.Mesh => {
      const g = geometryOf(mesh);
      this.disposables.push(g);
      const m = new THREE.Mesh(g, mat(material));
      m.castShadow = cast;
      m.receiveShadow = receive;
      scene.add(m);
      return m;
    };
    const addChunks = (chunks: Chunk[]): THREE.Mesh[] => chunks.map((c) => add(c.mesh, c.material, true));

    // ---- The painted sky: a dome inside the physical sky's reach, unfogged like the Sierra ----
    // The paintings are media beside the models, AI-made to the museum's brief (draft, pending the founder's look).
    // Until the one a season asks for has arrived the physical sky stays; once it has, the dome takes over and the
    // physical sky is hidden with its clouds — the painting carries the clouds itself. The physical sky still made
    // the environment map at startup and is never needed again.
    if (options.models && MODELS_AVAILABLE) {
      const domeGeo = new THREE.SphereGeometry(11500, 64, 32);
      const domeMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: true });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.frustumCulled = false;
      dome.visible = false;
      scene.add(dome);
      this.skyDome = dome;
      this.skyPaint = domeMat;
      this.disposables.push(domeGeo, domeMat);
    }

    // ---- The painted Sierra: two strips, autumn and winter, on a far curtain behind the valley ----
    // They are media beside the models, AI-painted to the museum's brief (draft, pending the founder's look). While
    // they cannot be had the valley keeps the range its own code makes, as before; when they arrive the curtain
    // carries them instead, unlit and unfogged so the haze of the air does not wash the painting out.
    let sierraAutumn: THREE.Texture | null = null;
    let sierraWinter: THREE.Texture | null = null;
    if (options.models && MODELS_AVAILABLE) {
      try {
        const load = async (file: string) => {
          const t = await new THREE.TextureLoader().loadAsync(modelUrl(file));
          t.colorSpace = THREE.SRGBColorSpace;
          t.wrapS = THREE.ClampToEdgeWrapping;
          t.minFilter = THREE.LinearMipmapLinearFilter;
          t.magFilter = THREE.LinearFilter;
          t.anisotropy = 4;
          t.needsUpdate = true;
          return t;
        };
        [sierraAutumn, sierraWinter] = await Promise.all([load("granada/sierra-snow-range-autumn-4096x768.webp"), load("granada/sierra-snow-range-winter-4096x768.webp")]);
        this.disposables.push(sierraAutumn!, sierraWinter!);
        this.models.push("granada/sierra-strips");
      } catch (e) {
        sierraAutumn = sierraWinter = null;
        this.modelFailures.push(`granada/sierra-strips: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // ---- The land, the range, the water ----
    const earth = maps.get("earth");
    const earthData = textures.get("earth");
    if (!earth || !earthData) throw new Error("the earth texture is missing");
    const detail = this.detailOf(earth, earthData);
    const land = new THREE.Mesh(geometryOf(buildLand(seed)), this.makeLand(detail, seed));
    land.receiveShadow = true;
    this.disposables.push(land.geometry, land.material as THREE.Material);
    scene.add(land);
    const range = add(buildRange(seed), "prop", false, false);
    range.frustumCulled = false;
    if (sierraAutumn && sierraWinter) {
      range.visible = false;
      // A curtain standing east of the plain, as far again as the code-made range and twice as wide: one breadth of
      // the strip across it, the peaks rising to some 800 m, the foot of the painting tucked behind the land.
      const width = 12000;
      const height = width * (768 / 4096);
      const g = new THREE.PlaneGeometry(width, height, 48, 1);
      // The curtain sags away at its ends, a shallow arc round the valley, so it does not march with the camera.
      const posAttr = g.attributes.position!;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        posAttr.setZ(i, Math.pow(x / width, 2) * 2400);
      }
      const mat = new THREE.MeshBasicMaterial({ map: sierraAutumn, transparent: true, depthWrite: false, fog: false, side: THREE.FrontSide, toneMapped: true });
      const sierra = new THREE.Mesh(g, mat);
      // Its foot tucks behind the land's own rise; the painting's peaks then stand where the code-made ridge stood.
      sierra.position.set(3400, height / 2 - 120, 0);
      sierra.rotation.y = -Math.PI / 2;
      sierra.frustumCulled = false;
      this.disposables.push(g, mat);
      scene.add(sierra);
      this.sierra = sierra;
      this.sierraMaps = { autumn: sierraAutumn, winter: sierraWinter };
    }
    add(buildRiver(), "water", false);
    this.poolMesh = add(poolWater(), "canalwater", false);
    this.poolFloor = heightAt(POOL.x, POOL.z, seed);
    for (const id of Object.keys(CHANNELS)) {
      const w = channelWater(id, seed);
      this.channels.set(id, { head: add(w.head, "canalwater", false), tail: add(w.tail, "canalwater", false) });
    }

    // ---- What is built ----
    // The town's houses are models made ahead of time, where the host has them; the valley is then built without
    // houses of its own and told where each one stands. Without them it makes its houses itself, as before.
    const town = options.models && MODELS_AVAILABLE ? await this.loadTown(options.art ?? null) : null;
    const hill = town !== null && HILL_PIECES.every((name) => town.has(name));
    const scenery = buildScenery(seed, { authoredTown: town !== null, authoredHill: hill });
    addChunks(scenery.chunks);
    this.meadowStone = addChunks(scenery.meadowChannel);
    this.houses = scenery.houses.map((h) => addChunks(h));
    if (town) this.standTown(town, scenery.kit);
    this.granary = addChunks(scenery.granary);
    this.codeMill = addChunks(scenery.mill);
    // The authored mill is fetched while the valley is already on screen, and takes the code-made one's place.
    if (options.models && MODELS_AVAILABLE) void this.loadMill(scenery.millAt);
    // The authored animals, when they can be fetched, take the place of the code-made shapes one kind at a time.
    if (options.models && MODELS_AVAILABLE) void this.loadAnimals();
    // The mill's wheel, on its axle: it turns while the west branch carries water.
    const wheelGeometry = geometryOf(scenery.wheel.mesh);
    this.disposables.push(wheelGeometry);
    this.wheel = new THREE.Mesh(wheelGeometry, mat("wood"));
    this.wheel.position.set(scenery.wheel.x, scenery.wheel.y, scenery.wheel.z);
    this.wheel.rotation.order = "YXZ";
    this.wheel.rotation.y = scenery.wheel.yaw;
    this.wheel.castShadow = true;
    scene.add(this.wheel);
    this.cartRoads = scenery.cartRoads;
    // Where people may walk: not through a house, the store, the mill or the mosque, not into the pool, and over the
    // river only by the bridge.
    this.walkable = walkGrid({ footprints: scenery.footprints, riverZ, riverHalf: RIVER_HALF, bridge: { x: BRIDGE.x, halfWidth: BRIDGE.width / 2 - 0.5 }, pool: POOL, bounds: { x0: BOUNDS.x0, x1: BOUNDS.x1, z0: BOUNDS.z0, z1: BOUNDS.z1 } });

    // ---- Things drawn many times ----
    const rng = new Rng(seed);
    const instanced = (mesh: MeshData, material: SceneMaterialId, capacity: number, shadow: boolean, dynamic = false): THREE.InstancedMesh => {
      const g = geometryOf(mesh);
      this.disposables.push(g);
      const im = new THREE.InstancedMesh(g, mat(material), capacity);
      im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3).fill(1), 3);
      im.count = 0;
      im.castShadow = shadow;
      im.receiveShadow = true;
      im.frustumCulled = false;
      if (dynamic) im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(im);
      return im;
    };
    const fill = (im: THREE.InstancedMesh, spots: number[][], yScale = 1, tint?: (i: number) => Rgb) => {
      const a = im.instanceMatrix.array as Float32Array;
      const c = im.instanceColor!.array as Float32Array;
      spots.forEach((s, i) => {
        instanceMatrix(a, i * 16, s[0]!, s[1]!, s[2]!, s[3]!, s[4]!, s[4]! * yScale, s[4]!);
        const t = tint?.(i) ?? [1, 1, 1];
        c.set(t, i * 3);
      });
      im.count = spots.length;
      im.instanceMatrix.needsUpdate = true;
      im.instanceColor!.needsUpdate = true;
    };
    const grove = (kind: TreeKind, spots: number[][], near: MeshData, far: MeshData) => {
      if (!spots.length) return;
      this.groves.push({ kind, spots, near: instanced(near, "foliage", spots.length, true, true), far: instanced(far, "foliage", spots.length, false, true), tints: new Float32Array(spots.length * 3) });
    };
    const halfOf = (spots: number[][], which: number) => spots.filter((_, i) => i % 2 === which);
    for (const which of [0, 1]) {
      grove("broad", halfOf(scenery.trees, which), broadTree(seed + which, false), broadTree(seed, true));
      grove("citrus", halfOf(scenery.citrus, which), orchardTree(seed + which, false), orchardTree(seed, true));
      grove("almond", halfOf(scenery.almonds, which), orchardTree(seed + 2 + which, false), orchardTree(seed, true));
    }
    grove("scrub", scenery.scrub, orchardTree(seed + 5, false), orchardTree(seed, true));
    grove("citrus", scenery.gardens, orchardTree(seed + 7, false), orchardTree(seed, true));
    grove("poplar", scenery.poplars, poplarTree(false), poplarTree(true));
    grove("cypress", scenery.cypresses, cypressTree(false), cypressTree(true));
    fill(instanced(palmMesh(rng.fork("palm")), "foliage", scenery.palms.length + 1, true), scenery.palms, 1, () => [0.62, 0.7, 0.5]);
    fill(instanced(stallMesh(rng.fork("stall")), "prop", scenery.stalls.length + 1, true), scenery.stalls);
    fill(instanced(awningMesh(), "fabric", scenery.stalls.length + 1, true), scenery.stalls, 1, (i) => (i % 3 === 0 ? [0.75, 0.2, 0.16] : i % 3 === 1 ? [0.16, 0.42, 0.5] : [0.86, 0.66, 0.24]));
    this.oliveSpots = scenery.olives;
    this.olives = instanced(oliveTree(seed), "foliage", scenery.olives.length + 1, true);
    fill(this.olives, scenery.olives);

    // Crops: places for wheat and for vegetables in each field that can be sown.
    const wheatGeo = wheatTuft();
    const vegGeo = vegetablePlant();
    for (const id of Object.keys(FIELDS)) {
      const wheatSpots = id === "olive-terrace" ? new Float32Array(0) : cropSpots(id, WHEAT_SPACING, seed);
      const vegSpots = id === "olive-terrace" ? new Float32Array(0) : cropSpots(id, VEG_SPACING, seed + 1);
      const wheat = instanced(wheatGeo, "foliage", wheatSpots.length / 5 + 1, false);
      const veg = instanced(vegGeo, "foliage", vegSpots.length / 5 + 1, false);
      // Each field's soil has a material of its own, so that it can darken when sown and pale to stubble.
      const soil = this.makeSoil(detail);
      this.disposables.push(soil.material);
      const g = geometryOf(fieldGround(id, seed));
      this.disposables.push(g);
      const ground = new THREE.Mesh(g, soil.material);
      ground.receiveShadow = true;
      scene.add(ground);
      this.crops.set(id, { wheat, veg, wheatSpots, vegSpots, soil, shown: "" });
    }
    (mat("foliage") as THREE.MeshStandardMaterial).side = THREE.DoubleSide;

    // Scaffolding for what is being built: poles round a house lot or the granary.
    const pole = new THREE.BoxGeometry(0.22, 1, 0.22);
    pole.translate(0, 0.5, 0);
    this.disposables.push(pole);
    this.scaffold = new THREE.InstancedMesh(pole, mat("wood"), 80);
    this.scaffold.count = 0;
    this.scaffold.castShadow = true;
    scene.add(this.scaffold);

    // Where the player is thinking of building: a ring and a faint disc laid on the land, drawn over everything.
    const ringGeometry = new THREE.RingGeometry(0.9, 1, 48);
    ringGeometry.rotateX(-Math.PI / 2);
    const discGeometry = new THREE.CircleGeometry(0.9, 48);
    discGeometry.rotateX(-Math.PI / 2);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x4fd06a, transparent: true, opacity: 0.95, depthTest: false, side: THREE.DoubleSide });
    const discMaterial = new THREE.MeshBasicMaterial({ color: 0x4fd06a, transparent: true, opacity: 0.28, depthTest: false, side: THREE.DoubleSide });
    this.disposables.push(ringGeometry, discGeometry, ringMaterial, discMaterial);
    this.ghost = new THREE.Mesh(ringGeometry, ringMaterial);
    this.ghostFill = new THREE.Mesh(discGeometry, discMaterial);
    for (const m of [this.ghost, this.ghostFill]) {
      m.visible = false;
      m.renderOrder = 20;
      m.frustumCulled = false;
      scene.add(m);
    }

    // Ox-carts on the roads.
    this.carts = instanced(scenery.cart, "prop", CARTS, true, true);
    this.carts.count = CARTS;
    this.oxLegs = instanced(oxLeg(), "prop", CARTS * 4, true, true);
    this.oxLegs.count = CARTS * 4;
    // The ox itself is a shape of its own, so the authored one can take its place: it moves exactly with its cart.
    this.oxen = instanced(oxBody(), "prop", CARTS, true, true);
    this.oxen.count = CARTS;

    // Flocks at graze, riders on the roads, the watch on the hill's wall and at its gate, birds over the valley.
    this.pastures = scenery.pastures;
    this.riderRoads = scenery.riderRoads;
    this.guardWalks = scenery.guardWalks;
    this.gatePosts = scenery.gatePosts;
    const paint = (im: THREE.InstancedMesh, count: number, tint: (i: number) => Rgb) => {
      const c = im.instanceColor!.array as Float32Array;
      for (let i = 0; i < count; i++) c.set(tint(i), i * 3);
      im.count = count;
      im.instanceColor!.needsUpdate = true;
    };
    // A flock is sheep and goats together, as they graze to this day. Which animal is which never changes, so the
    // two meshes are written without waste: each kind's instances packed in the order the animals come.
    const flockTotal = this.pastures.length * FLOCK;
    let sheepCount = 0;
    let goatCount = 0;
    for (let i = 0; i < flockTotal; i++) {
      const goat = (i * 11 + 5) % 9 < 2;
      this.flockGoat.push(goat);
      this.flockSlot.push(goat ? goatCount++ : sheepCount++);
    }
    this.flocks = instanced(sheep(), "prop", Math.max(1, sheepCount), true, true);
    paint(this.flocks, sheepCount, (i) => FLEECE[(i * 7 + (i % 5)) % FLEECE.length]!);
    this.sheepLegs = instanced(sheepLeg(), "prop", Math.max(1, sheepCount * 4), true, true);
    this.sheepLegs.count = sheepCount * 4;
    this.goats = instanced(sheep(), "prop", Math.max(1, goatCount), true, true);
    paint(this.goats, goatCount, (i) => GOAT_TINTS[(i * 5 + (i % 3)) % GOAT_TINTS.length]!);
    this.goatLegs = instanced(sheepLeg(), "prop", Math.max(1, goatCount * 4), true, true);
    this.goatLegs.count = goatCount * 4;
    // A donkey or two graze with the flocks, as donkeys do: they keep the sheep off worse harm.
    this.donkeys = instanced(donkey(), "prop", Math.max(1, this.pastures.length), true, true);
    paint(this.donkeys, this.pastures.length, (i) => DONKEY_TINTS[i % DONKEY_TINTS.length]!);
    this.donkeyLegs = instanced(horseLeg(), "prop", Math.max(1, this.pastures.length * 4), true, true);
    paint(this.donkeyLegs, this.pastures.length * 4, (i) => DONKEY_TINTS[Math.floor(i / 4) % DONKEY_TINTS.length]!);
    paint(this.oxen, CARTS, (i) => OX_TINTS[i % OX_TINTS.length]!);
    paint(this.oxLegs, CARTS * 4, (i) => OX_TINTS[Math.floor(i / 4) % OX_TINTS.length]!);
    this.horses = instanced(horse(), "prop", RIDERS, true, true);
    paint(this.horses, RIDERS, (i) => COATS[i % COATS.length]!);
    this.riderBodies = instanced(personBodyMesh(), "prop", RIDERS, true, true);
    this.horseLegs = instanced(horseLeg(), "prop", RIDERS * 4, true, true);
    paint(this.horseLegs, RIDERS * 4, (i) => COATS[Math.floor(i / 4) % COATS.length]!);
    paint(this.riderBodies, RIDERS, (i) => ROBE_TINTS[(i * 3 + 1) % ROBE_TINTS.length]!);
    this.riderHeads = instanced(personHeadMesh(), "prop", RIDERS, false, true);
    this.riderHeads.count = RIDERS;
    const watch = this.guardWalks.length + this.gatePosts.length;
    this.watchBodies = instanced(personBody(), "prop", Math.max(1, watch), true, true);
    this.watchLegs = instanced(personLeg(), "prop", Math.max(1, watch) * 2, true, true);
    this.watchLegs.count = watch * 2;
    paint(this.watchBodies, watch, () => [0.5, 0.14, 0.1]);
    this.watchHeads = instanced(personHeadMesh(), "prop", Math.max(1, watch), false, true);
    this.watchHeads.count = watch;
    this.watchGear = instanced(guardGear(), "prop", Math.max(1, watch), true, true);
    this.watchGear.count = watch;
    this.birds = instanced(bird(), "prop", BIRDS, false, true);
    this.birds.count = BIRDS;

    // People.
    this.bodies = instanced(personBody(), "prop", WALKERS + HARVESTERS, true, true);
    this.legs = instanced(personLeg(), "prop", (WALKERS + HARVESTERS) * 2, true, true);
    this.strides = new Float32Array(WALKERS + HARVESTERS);
    this.heads = instanced(personHeadMesh(), "prop", WALKERS + HARVESTERS, false, true);
    // What a harvest brings out: ladders against the olive trees, and baskets where the pickers are.
    this.ladders = instanced(ladder(), "prop", 16, true, true);
    this.baskets = instanced(basket(), "prop", BASKETS, true, true);
    const tint = this.bodies.instanceColor!.array as Float32Array;
    for (let i = 0; i < WALKERS; i++) tint.set(ROBE_TINTS[i % ROBE_TINTS.length]!, i * 3);
    this.bodies.instanceColor!.needsUpdate = true;

    // The ring round a chosen field, and the rain.
    const ringGeo = new THREE.RingGeometry(0.982, 1, 96);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.9, depthWrite: false, depthTest: false, fog: false });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.ring.renderOrder = 6;
    this.ring.visible = false;
    scene.add(this.ring);
    const drops = new Float32Array(2600 * 6);
    for (let i = 0; i < 2600; i++) {
      const x = rng.range(-520, 620);
      const y = rng.range(0, 260);
      const z = rng.range(-300, 380);
      drops.set([x, y, z, x - 0.9, y - 4.5, z + 0.4], i * 6);
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(drops, 3));
    const rainMat = new THREE.LineBasicMaterial({ color: 0xcfe6f2, transparent: true, opacity: 0.22, fog: false });
    this.rain = new THREE.LineSegments(rainGeo, rainMat);
    this.rain.visible = false;
    this.rain.frustumCulled = false;
    scene.add(this.rain);
    this.disposables.push(ringGeo, ringMat, rainGeo, rainMat);

    // ---- After the picture is drawn: corners darkened where things meet (High), and a little glow (Medium and High) ----
    if (preset.occlusion || preset.glow) {
      const pipeline = new THREE.RenderPipeline(renderer);
      const scenePass = pass(scene, this.camera, { samples: 4 });
      if (preset.occlusion) {
        const prePass = pass(scene, this.camera, { samples: 1 });
        prePass.setMRT(mrt({ output: normalView }));
        const aoPass = ao(prePass.getTextureNode("depth"), prePass.getTextureNode(), this.camera);
        aoPass.resolutionScale = 0.5;
        aoPass.radius.value = 3.2;
        aoPass.thickness.value = 1.6;
        aoPass.distanceExponent.value = 1.2;
        aoPass.samples.value = 12;
        scenePass.contextNode = builtinAOContext(aoPass.getTextureNode().sample(screenUV).r);
      }
      const lit = scenePass.getTextureNode("output");
      pipeline.outputNode = preset.glow ? lit.add(bloom(lit, 0.1, 0.5, 1.5)) : lit;
      this.pipeline = pipeline;
    }
    this.setSeason(0);
    this.resize();
  }

  /**
   * Leaves. A crown is drawn as a few rounded heads; what makes it read as foliage is the dapple of lit leaf and
   * shadowed gap over it. That dapple is a small picture made here, of soft light and dark blots, laid over every
   * crown from three sides (so it needs no unwrapping) and multiplied into the crown's own light and shade.
   */
  private makeFoliage(spec: MaterialSpec, seed: number): THREE.Material {
    const size = 128;
    const rng = new Rng(hash32("leaves", seed >>> 0));
    const field = new Float32Array(size * size);
    // Blots of two sizes, wrapped at the edges so that the picture repeats without a seam.
    for (let k = 0; k < 420; k++) {
      const cx = rng.range(0, size);
      const cy = rng.range(0, size);
      const r = k < 60 ? rng.range(9, 17) : rng.range(2.5, 6);
      const lift = (k % 2 ? 1 : -1) * (k < 60 ? 0.35 : 0.55);
      const reach = Math.ceil(r);
      for (let dy = -reach; dy <= reach; dy++) {
        for (let dx = -reach; dx <= reach; dx++) {
          const d = Math.hypot(dx, dy) / r;
          if (d >= 1) continue;
          const x = (((Math.round(cx) + dx) % size) + size) % size;
          const y = (((Math.round(cy) + dy) % size) + size) % size;
          field[y * size + x]! += lift * (1 - d * d);
        }
      }
    }
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      // From deep shade between the leaves to full light on them.
      const v = Math.max(0.42, Math.min(1.18, 0.86 + field[i]! * 0.42));
      const byte = Math.round((v / 1.18) * 255);
      data.set([byte, byte, byte, 255], i * 4);
    }
    const leaves = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
    leaves.colorSpace = THREE.NoColorSpace;
    leaves.wrapS = leaves.wrapT = THREE.RepeatWrapping;
    leaves.generateMipmaps = true;
    leaves.minFilter = THREE.LinearMipmapLinearFilter;
    leaves.magFilter = THREE.LinearFilter;
    leaves.anisotropy = 4;
    leaves.needsUpdate = true;
    this.disposables.push(leaves);
    const m = new THREE.MeshStandardNodeMaterial({ color: color(spec.color), roughness: spec.roughness, metalness: spec.metalness, vertexColors: true, side: THREE.DoubleSide });
    // 1.18 is the brightest the picture holds; a crown's own colour is multiplied in after this, tree by tree.
    m.colorNode = triplanarTexture(texture(leaves), null, null, float(0.42)).rgb.mul(1.18);
    // Wind: everything that grows leans a little and comes back, more the higher it stands, each plant in its own
    // time. The clock is the water's, which stands still for a visitor who has asked for less motion.
    const phase = float(instanceIndex).mul(1.7);
    // The height is counted only as far as a tall tree's top. A plant drawn in its own frame is measured from its
    // foot; one that is part of a piece of scenery is measured from the sea, and on the hill, ninety metres up, the
    // square of that bent every cypress to the ground. Past the limit a plant sways whole and no longer leans.
    const height = min(positionLocal.y, float(14));
    const lean = height.mul(height).mul(0.0035);
    m.positionNode = positionLocal.add(vec3(sin(this.waterTime.mul(1.3).add(phase)).mul(lean), 0, sin(this.waterTime.mul(0.9).add(phase.mul(0.6))).mul(lean).mul(0.7)));
    return m;
  }

  private makeStandard(spec: MaterialSpec, maps: Map<TextureKind, { map: THREE.DataTexture; normal: THREE.DataTexture }>): THREE.Material {
    const tex = spec.texture ? maps.get(spec.texture) : undefined;
    const m = new THREE.MeshStandardMaterial({ color: color(spec.color), roughness: spec.roughness, metalness: spec.metalness, vertexColors: true, map: tex?.map ?? null, normalMap: tex?.normal ?? null });
    if (spec.emissive) {
      m.emissive = color(spec.emissive);
      m.emissiveIntensity = 0.4;
      if (tex) m.emissiveMap = tex.map;
    }
    return m;
  }

  /** The earth texture as fine grain and as broad patches, both about 1, to multiply a colour by. */
  private detailOf(earth: { map: THREE.DataTexture; normal: THREE.DataTexture }, data: TextureData) {
    // Mean of the tile, in linear light, so that multiplying by it does not darken or tint the land.
    const mean = [0, 0, 0];
    const lin = (v: number) => Math.pow(v / 255, 2.2);
    for (let i = 0; i < data.albedo.length; i += 4 * 97) for (let c = 0; c < 3; c++) mean[c]! += lin(data.albedo[i + c]!);
    const n = Math.ceil(data.albedo.length / (4 * 97));
    const p = positionWorld.xz;
    const grain = texture(earth.map, p.div(data.tileMeters)).rgb.div(vec3(mean[0]! / n, mean[1]! / n, mean[2]! / n));
    const patches = texture(earth.map, p.div(data.tileMeters * 19)).g.div(mean[1]! / n);
    return { colour: mix(vec3(1, 1, 1), grain, 0.5).mul(mix(float(0.86), float(1.14), patches.clamp(0, 2).mul(0.5))), normal: normalMap(texture(earth.normal, p.div(data.tileMeters)), vec2(0.7, 0.7)) };
  }

  /**
   * The land. Its plots are drawn by the material from a table of one texel per plot, so their borders and their
   * rows stay sharp however near the camera comes; off the plain the land takes the colour its points carry.
   */
  private makeLand(detail: ReturnType<ValleyRenderer["detailOf"]>, seed: number): THREE.Material {
    const table = plotTable(seed);
    const lookup = (data: Uint8Array, srgb: boolean) => {
      const t = new THREE.DataTexture(data, table.width, table.height, THREE.RGBAFormat, THREE.UnsignedByteType);
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.magFilter = t.minFilter = THREE.NearestFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
      this.disposables.push(t);
      return t;
    };
    const G = PLOT_GRID;
    const p = positionWorld.xz;
    const u = p.x.mul(G.ax).add(p.y.mul(G.az)).div(G.du);
    const v = p.y.mul(G.ax).sub(p.x.mul(G.az)).div(G.dv);
    const st = vec2(floor(u), floor(v)).sub(vec2(G.u0, G.v0)).add(0.5).div(vec2(G.w, G.h));
    const baseTexel = texture(lookup(table.base, true), st);
    const ground = baseTexel.rgb;
    const rowColour = texture(lookup(table.row, true), st).rgb;
    const params = texture(lookup(table.params, false), st);
    const fu = fract(u);
    const fv = fract(v);
    // Metres to the plot's border, and metres across its rows.
    const edge = min(min(fu, fu.oneMinus()).mul(G.du), min(fv, fv.oneMinus()).mul(G.dv));
    const phase = mix(fu.mul(G.du), fv.mul(G.dv), params.b).div(params.g.mul(12).max(0.5));
    // Far off, where a row is narrower than a pixel, the rows give way to their average.
    const sharp = smoothstep(0.2, 0.7, fwidth(phase)).oneMinus();
    const rows = mix(float(0.5), smoothstep(0.3, 0.7, sin(phase.mul(Math.PI * 2)).mul(0.5).add(0.5)), sharp).mul(params.r);
    const hedge = smoothstep(0.7, 2.1, edge).oneMinus().mul(0.8);
    const plot = mix(mix(ground, rowColour, rows), vec3(0.05, 0.085, 0.035), hedge);
    const m = new THREE.MeshStandardNodeMaterial({ roughness: 1, metalness: 0 });
    let colour: any = mix(attribute("color", "vec3"), plot, uv().x).mul(detail.colour);
    if (this.groundAtlas) {
      // The painting takes the plot colours' place where it can be had: the tile of the plot's own kind is the
      // ground's albedo, shaded by the plot's variety, darkened in its rows and at its hedges as before. Off the
      // plain the land keeps the colours its points carry, with the painting's dry grass for their detail.
      const slot = floor(baseTexel.a.mul(255).add(0.5));
      const shade = texture(lookup(table.row, true), st).a.mul(255).div(128);
      const paint = atlasPaint(this.groundAtlas, p, 18, slot).mul(shade);
      const plotPaint = mix(mix(paint, paint.mul(0.55), rows.mul(0.6)), vec3(0.05, 0.085, 0.035), hedge);
      // Off the plain the land keeps the colours its points carry (rock, scrub, banks, gardens); the dry-grass tile
      // lends them its brightness grain only, so their hues are untouched. Mean luminance of the tile is about 0.25
      // in linear light; the ratio is clamped so an odd texel cannot scar the hill.
      const grassLum = atlasPaint(this.groundAtlas, p, 30, float(5)).dot(vec3(0.299, 0.587, 0.114)).div(0.25).clamp(0.6, 1.5);
      const wild = attribute("color", "vec3").mul(grassLum);
      colour = mix(wild, plotPaint, uv().x).mul(detail.colour);
    }
    m.colorNode = colour;
    m.normalNode = detail.normal;
    return m;
  }

  /** The tilled ground of a field: its soil, and rows along its length in a second colour. */
  private makeSoil(detail: ReturnType<ValleyRenderer["detailOf"]>): Soil {
    const ground = uniform(new THREE.Color(0.3, 0.22, 0.14));
    const rowColour = uniform(new THREE.Color(0.2, 0.14, 0.09));
    const slot = uniform(0);
    const p = positionWorld.xz;
    const phase = p.y.add(p.x.mul(0.056)).div(WHEAT_SPACING);
    const sharp = smoothstep(0.2, 0.7, fwidth(phase)).oneMinus();
    const rows = mix(float(0.5), smoothstep(0.3, 0.7, sin(phase.mul(Math.PI * 2)).mul(0.5).add(0.5)), sharp);
    const m = new THREE.MeshStandardNodeMaterial({ roughness: 1, metalness: 0 });
    if (this.groundAtlas) {
      // The painting answers the crop as it changes: green wheat while it grows, gold when ripe, stubble once cut,
      // bare earth when fallow — the tile itself is the soil's albedo, darkened a little in its rows as before.
      const paint = atlasPaint(this.groundAtlas, p, 7, slot);
      m.colorNode = mix(paint, paint.mul(0.6), rows.mul(0.5)).mul(detail.colour);
    } else {
      m.colorNode = mix(ground, rowColour, rows).mul(detail.colour);
    }
    m.normalNode = detail.normal;
    return { material: m, ground, rows: rowColour, slot };
  }

  /** Fetches the town kit and returns, for each piece, the shapes and surfaces it is made of. Null if it cannot be had. */
  private async loadTown(art: Art | null = null): Promise<Map<string, Array<{ geometry: THREE.BufferGeometry; material: THREE.Material }>> | null> {
    try {
      const pieces = new Map<string, Array<{ geometry: THREE.BufferGeometry; material: THREE.Material }>>();
      const take = (model: THREE.Object3D) => {
        for (const node of model.children) {
          const parts: Array<{ geometry: THREE.BufferGeometry; material: THREE.Material }> = [];
          node.traverse((o) => {
            const m = o as THREE.Mesh;
            if (m.isMesh) parts.push({ geometry: m.geometry, material: m.material as THREE.Material });
          });
          if (parts.length) pieces.set(node.name, parts);
        }
      };
      const model = await loadModel(`${MODEL_SET}town.gltf`);
      take(model);
      for (const name of KIT_HOUSES) if (!pieces.has(name)) throw new Error(`the kit has no ${name}`);
      this.townModel = model;
      this.models.push("granada/town");
      // The larger pieces are a file of their own. Without it the hill keeps the wall and halls the valley makes.
      try {
        const larger = await loadModel(`${MODEL_SET}landmarks.gltf`);
        take(larger);
        this.landmarksModel = larger;
        this.models.push("granada/landmarks");
        // The candidate's pieces, asked for by name, take the place of Set A's only once they have arrived whole.
        if (art !== "a") {
          for (const [piece, path] of Object.entries(art ? CANDIDATE_C[art] : PALACE)) {
            try {
              const candidate = await loadModel(path);
              if (!candidate.children.some((n) => n.name === piece)) throw new Error(`the file has no ${piece}`);
              take(candidate);
              this.candidateModels.push(candidate);
              this.models.push(art ? `granada/${art}/${piece}` : `granada/${piece}`);
            } catch (e) {
              this.modelFailures.push(`${art ? `granada/${art}/${piece}` : `granada/${piece}`}: ${e instanceof Error ? e.message : String(e)}`);
            }
          }
        }
      } catch (e) {
        this.modelFailures.push(`granada/landmarks: ${e instanceof Error ? e.message : String(e)}`);
      }
      return pieces;
    } catch (e) {
      this.modelFailures.push(`granada/town: ${e instanceof Error ? e.message : String(e)}`);
      return null;
    }
  }

  /** Stands the kit's houses where the valley says: the ones built during play as meshes of their own, the rest in bulk. */
  private standTown(town: Map<string, Array<{ geometry: THREE.BufferGeometry; material: THREE.Material }>>, kit: KitPlacement[]): void {
    const at = new THREE.Object3D();
    const set = (p: KitPlacement) => {
      at.position.set(p.x, p.y, p.z);
      at.rotation.set(0, p.yaw, 0);
      at.scale.set(p.scale * (p.sx ?? 1), p.scale, p.scale);
      at.updateMatrix();
      return at.matrix;
    };
    const washed = (m: THREE.Material) => m.name.startsWith("plaster");
    for (const [piece, parts] of town) {
      const standing = kit.filter((p) => p.piece === piece && p.lot === null);
      for (const part of parts) {
        if (standing.length === 0) break;
        const im = new THREE.InstancedMesh(part.geometry, part.material, standing.length);
        const colour = new THREE.Color();
        standing.forEach((p, i) => {
          im.setMatrixAt(i, set(p));
          im.setColorAt(i, washed(part.material) ? colour.setRGB(p.tint[0], p.tint[1], p.tint[2]) : colour.setRGB(1, 1, 1));
        });
        im.castShadow = true;
        im.receiveShadow = true;
        im.frustumCulled = false;
        this.scene.add(im);
      }
    }
    // A house on a building lot appears when it is built, so each is its own.
    for (const p of kit.filter((k) => k.lot !== null)) {
      const meshes = (town.get(p.piece) ?? []).map((part) => {
        const m = new THREE.Mesh(part.geometry, part.material);
        m.applyMatrix4(set(p));
        m.castShadow = true;
        m.receiveShadow = true;
        this.scene.add(m);
        return m;
      });
      this.houses[p.lot!] = meshes;
    }
  }

  private async loadMill(at: { x: number; y: number; z: number; yaw: number }): Promise<void> {
    try {
      const model = await loadModel(`${MODEL_SET}mill.gltf`);
      if (this.disposed) return disposeModel(model);
      model.position.set(at.x, at.y, at.z);
      model.rotation.y = at.yaw;
      this.scene.add(model);
      this.millModel = model;
      this.millWheel = model.getObjectByName("wheel") ?? null;
      for (const m of this.codeMill) m.visible = false;
      this.wheel.visible = this.millWheel === null;
      this.models.push("granada/mill");
    } catch (e) {
      // The code-made mill stays. Said in info(), not thrown: a valley without its models is still the valley.
      this.modelFailures.push(`granada/mill: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  /** The instanced meshes each animal kind is drawn with. */
  private animalTargets(kind: AnimalKind): [THREE.InstancedMesh, THREE.InstancedMesh] {
    switch (kind) {
      case "sheep":
        return [this.flocks, this.sheepLegs];
      case "goat":
        return [this.goats, this.goatLegs];
      case "horse":
        return [this.horses, this.horseLegs];
      case "ox":
        return [this.oxen, this.oxLegs];
      case "donkey":
        return [this.donkeys, this.donkeyLegs];
    }
  }

  /**
   * Fetches the authored animals one file at a time. A kind that arrives whole takes the place of its code-made
   * shape in the same instanced meshes, so nothing about how the animals move changes; one that cannot be fetched
   * or is short of a part leaves the code-made shape standing, named in modelFailures.
   */
  private async loadAnimals(): Promise<void> {
    await Promise.all(
      ANIMAL_KINDS.map(async (kind) => {
        try {
          const model = await loadModel(`granada/animals/${kind}.gltf`);
          if (this.disposed) return disposeModel(model);
          // What the file carries is copied out into the game's own merged geometries; the file itself is let go either way.
          try {
            const parts = extractAnimal(model, kind);
            this.disposables.push(parts.body, parts.leg);
            const [bodies, legs] = this.animalTargets(kind);
            bodies.geometry = parts.body;
            legs.geometry = parts.leg;
            this.models.push(`granada/animals/${kind}`);
          } finally {
            disposeModel(model);
          }
        } catch (e) {
          this.modelFailures.push(`granada/animals/${kind}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }),
    );
  }

  /** Two wave trains crossing at different scales and speeds, in world space. */
  private makeWater(spec: MaterialSpec, normal: THREE.DataTexture): THREE.Material {
    // What makes water read as water from above: a surface that catches the sun and the sky and moves with the
    // current, deep water darker than the shallows at its edges, and foam only where the water meets the bank.
    const m = new THREE.MeshPhysicalNodeMaterial({ roughness: 0.06, metalness: 0 });
    // The sky in the water: the scene's light is kept low for the land; water mirrors more of it.
    m.envMapIntensity = 4.5;
    const p = positionWorld.xz;
    const t = this.waterTime;
    const canal = spec.id === "canalwater";
    // The river runs west through the valley. Three layers of ripple are carried down it at different speeds and
    // sizes, so the surface moves as a whole and never repeats as a pattern; a channel's water barely moves.
    const flow = canal ? vec2(0.0, 0.0) : vec2(-1, 0);
    const layer = (size: number, speed: number, cross: number) => texture(normal, p.div(size).add(flow.mul(t.mul(speed / size))).add(vec2(0, t.mul(cross / size))));
    const r1 = layer(canal ? 4.5 : 9, canal ? 0.25 : 1.6, canal ? 0.2 : 0.18);
    const r2 = layer(canal ? 2.2 : 4.2, canal ? 0.35 : 2.4, canal ? -0.25 : -0.22);
    const r3 = layer(canal ? 11 : 26, canal ? 0.15 : 1.1, 0.05);
    // The layers' slopes are added, not averaged: averaging three ripples flattens them into still water.
    const slope = r1.rg.mul(2).sub(1).add(r2.rg.mul(2).sub(1)).add(r3.rg.mul(2).sub(1).mul(0.6));
    const tilt = canal ? 0.35 : 0.9;
    const blended = vec3(slope.x.mul(tilt), slope.y.mul(tilt), 1).normalize().mul(0.5).add(0.5);
    m.normalNode = normalMap(blended, vec2(1, 1));
    // The sky seen in the water, strongest at a low angle as water is (Schlick's rule for a surface of index 1.33);
    // the ripples break it up, so it moves with them.
    const facing = normalView.dot(positionView.negate().normalize()).clamp(0, 1);
    const fresnel = float(0.02).add(float(0.98).mul(float(1).sub(facing).pow(5)));
    m.emissiveNode = vec3(0.5, 0.64, 0.78).mul(fresnel).mul(canal ? 0.45 : 0.62);
    if (canal) {
      m.colorNode = mix(vec3(0.012, 0.1, 0.1), vec3(0.04, 0.2, 0.18), r3.r.sub(0.5).mul(2).add(0.5).clamp(0, 1));
    } else {
      // How far from the middle of the river, 0 there and 1 at its edge (the river's line, as valley.ts draws it).
      const x = positionWorld.x;
      const centre = float(-150).add(sin(x.div(190).add(0.6)).mul(16)).add(sin(x.div(77).add(2)).mul(7)).sub(x.sub(500).max(0).mul(0.05));
      const side = positionWorld.z.sub(centre).abs().div(RIVER_HALF + 6).clamp(0, 1);
      const deep = vec3(0.012, 0.085, 0.1);
      const shallow = vec3(0.09, 0.2, 0.16);
      const water = mix(deep, shallow, smoothstep(0.45, 0.98, side));
      // Foam: broken, along the banks only, drawn from the moving ripples so it drifts with the water.
      const broken = r1.r.mul(r2.g);
      const foam = smoothstep(0.8, 0.97, side).mul(smoothstep(0.25, 0.45, broken)).mul(0.55);
      m.colorNode = mix(water, vec3(0.78, 0.82, 0.78), foam);
      m.roughnessNode = mix(float(0.05), float(0.6), foam);
    }
    m.ior = 1.33;
    return m;
  }

  /**
   * Which painting the sky should wear: the season's own, the golden-hour one while an evening is being previewed,
   * and the overcast one under rain. The game has no hours; the hour is a picture's choice, as with the light.
   */
  private skyKey(): string | null {
    if (!this.skyDome || this.skyFailed) return null;
    if (this.raining) return "winter-overcast";
    if (this.lightPreview === "evening") return "evening-golden";
    return ["spring-morning", "summer-midday", "autumn-afternoon", "winter-overcast"][this.season] ?? "autumn-afternoon";
  }

  /** Shows the wanted painting once it is had; the physical sky stands in until then, and for good if it fails. */
  private applySky(): void {
    const key = this.skyKey();
    this.skyWanted = key;
    if (key === null) {
      if (this.skyDome) this.skyDome.visible = false;
      this.sky.visible = true;
      return;
    }
    const t = this.skyTex.get(key);
    if (t && this.skyPaint && this.skyDome) {
      if (this.skyPaint.map !== t) {
        this.skyPaint.map = t;
        this.skyPaint.needsUpdate = true;
      }
      this.skyDome.visible = true;
      this.sky.visible = false;
      this.sky.cloudCoverage.value = 0;
      return;
    }
    if (!this.skyLoading.has(key)) {
      this.skyLoading.add(key);
      void this.loadSky(key).finally(() => this.skyLoading.delete(key));
    }
  }

  private async loadSky(key: string): Promise<void> {
    try {
      const t = await new THREE.TextureLoader().loadAsync(modelUrl(`granada/sky-${key}-4096x2048.webp`));
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.anisotropy = 4;
      t.needsUpdate = true;
      this.disposables.push(t);
      this.skyTex.set(key, t);
      this.models.push(`granada/sky-${key}`);
      // A painting that arrives after the season has moved on is kept for when its season comes back.
      if (this.skyWanted === key) this.applySky();
    } catch (e) {
      this.skyFailed = true;
      this.modelFailures.push(`granada/painted-skies: ${e instanceof Error ? e.message : String(e)}`);
      if (this.skyDome) this.skyDome.visible = false;
      this.sky.visible = true;
    }
  }

  /** Light, sky and haze for a season of the year. */
  /**
   * For a picture only: the sun of a morning, a midday or an evening in place of the season's own, or null to give
   * the season its own light back. The game has no hours; this changes nothing but what is drawn.
   */
  previewLight(hour: "morning" | "midday" | "evening" | null): void {
    if (hour === this.lightPreview) return;
    this.lightPreview = hour;
    const season = this.season;
    this.season = -1;
    this.setSeason(season < 0 ? 0 : season);
  }
  /** The camera's angle of view, in degrees: narrow for a long lens, wide for a short one. Null for the game's own. */
  setLens(fov: number | null): void {
    this.camera.fov = fov === null ? FOV : Math.max(12, Math.min(75, fov));
    this.camera.updateProjectionMatrix();
  }
  /** Draws the view once more and hands it over as a PNG. */
  async capture(): Promise<Blob | null> {
    if (this.pipeline) this.pipeline.render();
    else this.renderer.render(this.scene, this.camera);
    return new Promise((resolve) => this.canvas.toBlob(resolve, "image/png"));
  }

  setSeason(season: number): void {
    if (season === this.season) return;
    this.season = season;
    const own = SEASON_LIGHT[season] ?? SEASON_LIGHT[0]!;
    const hour = this.lightPreview ? HOUR_LIGHT[this.lightPreview] : null;
    const atm: Atmosphere = hour ? { ...own, sunDirection: sunFrom(hour.azimuth, hour.elevation), sunColor: hour.colour, sunIntensity: own.sunIntensity * hour.strength } : own;
    this.renderer.toneMappingExposure = atm.exposure;
    this.hemi.color = color(atm.ambientSky);
    this.hemi.groundColor = color(atm.ambientGround);
    this.hemi.intensity = atm.ambientIntensity * (this.raining ? 0.2 : 0.06);
    this.sun.color = color(atm.sunColor);
    this.sun.intensity = atm.sunIntensity * (this.raining ? 0.42 : 1);
    this.sunDirection = atm.sunDirection;
    this.shadowAt = "";
    if (this.pose) this.fitShadow(this.pose);
    const fog = this.scene.fog as THREE.FogExp2;
    fog.color = color(atm.fogColor);
    fog.density = atm.fogDensity;
    // The painted Sierra answers the season: snow down the slopes in winter, the bare autumn range otherwise.
    if (this.sierra && this.sierraMaps) {
      const mat = this.sierra.material as THREE.MeshBasicMaterial;
      const want = season === 3 ? this.sierraMaps.winter : this.sierraMaps.autumn;
      if (mat.map !== want) {
        mat.map = want;
        mat.needsUpdate = true;
      }
    }
    // The sky itself: clear in summer, hazier and lower-lit in autumn, heavier with cloud in winter.
    const skyOf = [
      { turbidity: 2.2, rayleigh: 2.3, cover: 0.52, density: 0.5 },
      { turbidity: 2, rayleigh: 1.9, cover: 0.2, density: 0.3 },
      { turbidity: 5.5, rayleigh: 2.4, cover: 0.34, density: 0.5 },
      { turbidity: 6.5, rayleigh: 1.6, cover: 0.66, density: 0.62 },
    ][season] ?? { turbidity: 3, rayleigh: 1.5, cover: 0.4, density: 0.4 };
    this.sky.turbidity.value = skyOf.turbidity;
    this.sky.rayleigh.value = skyOf.rayleigh;
    this.skyCover = skyOf.cover;
    this.sky.cloudCoverage.value = this.raining ? 0.9 : skyOf.cover;
    this.sky.cloudDensity.value = skyOf.density;
    this.sky.sunPosition.value.set(...atm.sunDirection);
    this.applySky();
    // The trees take the season's colours.
    for (const g of this.groves) {
      const base = TREE_TINT[g.kind][season] ?? TREE_TINT[g.kind][0]!;
      for (let i = 0; i < g.spots.length; i++) {
        const k = 0.8 + 0.4 * (((i * 2654435761) >>> 0) / 4294967296);
        // In a flowering orchard one tree in four is already in leaf.
        const c: Rgb = g.kind === "almond" && season === 0 && i % 4 === 0 ? [0.3, 0.5, 0.15] : base;
        g.tints[i * 3] = c[0] * k;
        g.tints[i * 3 + 1] = c[1] * k;
        g.tints[i * 3 + 2] = c[2] * k;
      }
    }
    this.lod[2] = 0;
    if (this.pose) this.fitDetail(this.pose);
  }

  /** The shadow map follows the place looked at, and covers less ground the nearer the camera is. */
  private fitShadow(pose: Pose): void {
    const r = pose.distance < 190 ? 230 : pose.distance < 380 ? 340 : pose.distance < 660 ? 480 : 620;
    const cx = Math.round(pose.tx / 24) * 24;
    const cz = Math.round(pose.tz / 24) * 24;
    const key = `${cx}:${cz}:${r}`;
    if (key === this.shadowAt) return;
    this.shadowAt = key;
    const sc = this.sun.shadow.camera;
    sc.left = -r;
    sc.right = r;
    sc.top = r;
    sc.bottom = -r;
    sc.updateProjectionMatrix();
    const d = this.sunDirection;
    this.sun.target.position.set(cx, 0, cz);
    this.sun.target.updateMatrixWorld();
    this.sun.position.set(cx + d[0] * 1300, d[1] * 1300, cz + d[2] * 1300);
  }

  /** Trees near the camera are drawn in full and cast shadows; the rest are drawn as light shapes. */
  private fitDetail(pose: Pose): void {
    const cx = pose.tx - Math.sin(pose.yaw) * pose.distance * 0.45;
    const cz = pose.tz + Math.cos(pose.yaw) * pose.distance * 0.45;
    // How far from the eye a tree is still drawn in full: less far on a lighter preset.
    const r = (pose.distance * 0.62 + 90) * PRESETS[this.options.quality].near;
    if (this.lod[2] > 0 && Math.hypot(cx - this.lod[0], cz - this.lod[1]) < 0.12 * r && Math.abs(r - this.lod[2]) < 0.1 * r) return;
    this.lod = [cx, cz, r];
    for (const g of this.groves) {
      const tiers = [g.near, g.far] as const;
      const counts = [0, 0];
      for (let i = 0; i < g.spots.length; i++) {
        const s = g.spots[i]!;
        const tier = (s[0]! - cx) ** 2 + (s[2]! - cz) ** 2 < r * r ? 0 : 1;
        const im = tiers[tier];
        const n = counts[tier]!;
        instanceMatrix(im.instanceMatrix.array as Float32Array, n * 16, s[0]!, s[1]!, s[2]!, s[3]!, s[4]!, s[4]!, s[4]!);
        (im.instanceColor!.array as Float32Array).set(g.tints.subarray(i * 3, i * 3 + 3), n * 3);
        counts[tier] = n + 1;
      }
      tiers.forEach((im, t) => {
        im.count = counts[t]!;
        im.instanceMatrix.needsUpdate = true;
        im.instanceColor!.needsUpdate = true;
      });
    }
  }

  /** Shows the valley as the game's state has it. */
  setLook(look: ValleyLook): void {
    this.setSeason(look.season);
    if (look.rain !== this.raining) {
      // A day of rain is overcast: the sun is dimmed, the sky closes over, and the light comes more from all round.
      this.raining = look.rain;
      const atm = SEASON_LIGHT[this.season] ?? SEASON_LIGHT[0]!;
      // An hour's light chosen for a picture keeps its strength whichever of the hour and the rain was chosen first.
      this.sun.intensity = atm.sunIntensity * (this.lightPreview ? HOUR_LIGHT[this.lightPreview].strength : 1) * (look.rain ? 0.42 : 1);
      this.hemi.intensity = atm.ambientIntensity * (look.rain ? 0.2 : 0.06);
      this.sky.cloudCoverage.value = look.rain ? 0.9 : this.skyCover;
      this.applySky();
    }
    this.rain.visible = look.rain;
    // The pool rises and falls between its floor and its brim.
    this.poolMesh.position.y = this.poolFloor + 0.5 + 2.6 * Math.max(0, Math.min(1, look.pool));
    this.poolMesh.visible = look.pool > 0.02;
    const flowing = look.pool > 0.02;
    for (const [id, w] of this.channels) {
      const state = id === "intake" || id === "main" ? "flowing" : (look.branches[id] ?? "none");
      w.head.visible = flowing && state !== "none";
      w.tail.visible = flowing && state === "flowing";
    }
    for (const m of this.meadowStone) m.visible = (look.branches.meadow ?? "none") !== "none";
    this.wheelTurns = flowing && (look.branches.west ?? "none") === "flowing";
    this.houses.forEach((meshes, i) => {
      for (const m of meshes) m.visible = i < look.houses;
    });
    for (const m of this.granary) m.visible = look.granary === "built";

    // Scaffolding where something is going up.
    const sites: Array<[number, number, number, number]> = [];
    for (let i = look.houses; i < Math.min(HOUSE_LOTS.length, look.houses + look.housesUnderWay); i++) sites.push([HOUSE_LOTS[i]!.x, HOUSE_LOTS[i]!.z, 8, 7]);
    if (look.granary === "under-way") sites.push([GRANARY[0], GRANARY[1], 13, 7]);
    // What the player has placed: poles round it while it is built, the building itself once it is done.
    const placed = look.placed ?? [];
    for (const p of placed) if (!p.done) sites.push([p.x, p.z, p.r * 0.75, p.r * 0.65]);
    for (const p of placed) {
      if (!p.done || this.placedMeshes.has(p.id)) continue;
      this.placedMeshes.set(
        p.id,
        placedBuilding(p.what, p.x, p.z, this.options.seed).map((c) => {
          const m = new THREE.Mesh(geometryOf(c.mesh), this.materials.get(c.material as SceneMaterialId)!);
          m.castShadow = true;
          m.receiveShadow = true;
          this.scene.add(m);
          return m;
        }),
      );
    }
    for (const [id, meshes] of this.placedMeshes) {
      if (placed.some((p) => p.id === id && p.done)) continue;
      for (const m of meshes) {
        this.scene.remove(m);
        m.geometry.dispose();
      }
      this.placedMeshes.delete(id);
    }

    const sa = this.scaffold.instanceMatrix.array as Float32Array;
    let n = 0;
    for (const [x, z, hw, hd] of sites) {
      for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]] as const) {
        if (n >= 80) break;
        const px = x + dx * hw;
        const pz = z + dz * hd;
        instanceMatrix(sa, n * 16, px, heightAt(px, pz, this.options.seed), pz, 0, 1, 6.5, 1);
        n++;
      }
    }
    this.scaffold.count = n;
    this.scaffold.instanceMatrix.needsUpdate = true;

    // Crops.
    for (const [id, c] of this.crops) {
      const f = look.fields[id];
      const key = f ? `${f.crop}:${Math.round(f.growth * 40)}:${Math.round(f.standing * 60)}:${f.ripe}` : "none";
      if (key === c.shown) continue;
      c.shown = key;
      const place = (im: THREE.InstancedMesh, spots: Float32Array, count: number, yScale: number, tint: Rgb) => {
        const a = im.instanceMatrix.array as Float32Array;
        const col = im.instanceColor!.array as Float32Array;
        const total = spots.length / 5;
        const shown = Math.max(0, Math.min(total, count));
        for (let i = 0; i < shown; i++) {
          const o = i * 5;
          const s = spots[o + 4]!;
          instanceMatrix(a, i * 16, spots[o]!, spots[o + 1]!, spots[o + 2]!, spots[o + 3]!, s, s * yScale, s);
          const v = 0.85 + 0.3 * ((i * 29) % 13) / 13;
          col[i * 3] = tint[0] * v;
          col[i * 3 + 1] = tint[1] * v;
          col[i * 3 + 2] = tint[2] * v;
        }
        im.count = shown;
        im.instanceMatrix.needsUpdate = true;
        im.instanceColor!.needsUpdate = true;
      };
      const g = f?.growth ?? 0;
      const mixed: Rgb = f?.ripe ? GOLD : [GREEN[0] + (GOLD[0] - GREEN[0]) * g * g, GREEN[1] + (GOLD[1] - GREEN[1]) * g * g, GREEN[2] + (GOLD[2] - GREEN[2]) * g * g];
      place(c.wheat, c.wheatSpots, f?.crop === "wheat" ? Math.round((c.wheatSpots.length / 5) * f.standing) : 0, 0.25 + 0.85 * g, mixed);
      place(c.veg, c.vegSpots, f?.crop === "vegetables" ? Math.round((c.vegSpots.length / 5) * f.standing) : 0, 0.3 + 0.9 * g, [0.36, 0.74, 0.26]);
      // The soil: pale stubble where a crop has just been cut, dark and green-rowed where one is growing, plain earth when fallow.
      const [ground, rows]: [Rgb, Rgb] = id === "olive-terrace" ? [[0.4, 0.31, 0.19], [0.46, 0.36, 0.22]] : !f?.crop ? [[0.3, 0.22, 0.14], [0.21, 0.15, 0.1]] : f.ripe || f.standing === 0 ? [[0.56, 0.45, 0.22], [0.68, 0.57, 0.3]] : [[0.24, 0.17, 0.11], [0.16 + 0.04 * g, 0.2 + 0.14 * g, 0.08]];
      c.soil.ground.value.setRGB(ground[0], ground[1], ground[2], THREE.LinearSRGBColorSpace);
      c.soil.rows.value.setRGB(rows[0], rows[1], rows[2], THREE.LinearSRGBColorSpace);
      // The painting answers the crop: bare earth fallow or under the olives, stubble once cut, gold when ripe,
      // green while wheat grows, the vegetable beds for vegetables.
      c.soil.slot.value = id === "olive-terrace" || !f?.crop ? 0 : f.standing === 0 ? 3 : f.ripe ? 2 : f.crop === "vegetables" ? 4 : 1;
    }
    // Olives stay on their trees: the crown greys a little as the fruit ripens and darkens once it is gathered.
    const ol = look.fields["olive-terrace"];
    if (ol) {
      const col = this.olives.instanceColor!.array as Float32Array;
      const laden = ol.ripe && ol.standing > 0;
      for (let i = 0; i < this.oliveSpots.length; i++) col.set(laden ? [0.56, 0.62, 0.42] : [0.6 + 0.08 * ((i * 7) % 5) / 5, 0.68, 0.52], i * 3);
      this.olives.instanceColor!.needsUpdate = true;
    }

    // People walk between the village and wherever there is work.
    this.walkers = Math.max(6, Math.min(WALKERS, look.busy + 6));
    const targets: Array<[number, number]> = [[STORE[0], STORE[1] + 12], [MARKET[0], MARKET[1]], [POOL.x - 44, POOL.z + 30]];
    for (const [id, f] of Object.entries(look.fields)) {
      if (!f.crop) continue;
      const poly = FIELDS[id]!;
      targets.push([(poly[0]![0] + poly[2]![0]) / 2, (poly[0]![1] + poly[2]![1]) / 2]);
      if (f.ripe && f.standing > 0) for (const p of poly) targets.push([(p[0] * 2 + poly[2]![0]) / 3, (p[1] * 2 + poly[2]![1]) / 3]);
    }
    this.walkTargets = targets;
    this.walkRoutes = [];
    for (let i = 0; i < this.walkers; i++) {
      const target = targets[i % Math.max(1, targets.length)] ?? [VILLAGE[0], VILLAGE[1]];
      this.walkRoutes.push(this.wayBetween(this.homeOf(i), target));
    }

    // A field that is being brought in has people at work in it: pickers at the olive trees, reapers in a line that
    // crosses the corn as it is cut. They are there because the harvest is, and go when it is done.
    const spots: typeof this.workSpots = [];
    const ladderAt: number[][] = [];
    const basketAt: number[][] = [];
    const tint = new THREE.Color();
    for (const [id, f] of Object.entries(look.fields)) {
      // A field just brought in has no crop left in it, and still has its people for the day.
      if (!f.harvesting) continue;
      const poly = FIELDS[id]!;
      const at = (u: number, v: number): [number, number] => {
        const ax = poly[0]![0] + (poly[1]![0] - poly[0]![0]) * u;
        const az = poly[0]![1] + (poly[1]![1] - poly[0]![1]) * u;
        const bx = poly[3]![0] + (poly[2]![0] - poly[3]![0]) * u;
        const bz = poly[3]![1] + (poly[2]![1] - poly[3]![1]) * u;
        return [ax + (bx - ax) * v, az + (bz - az) * v];
      };
      const store: [number, number] = id === "olive-terrace" ? [ESTATE.x - 12, ESTATE.z] : at(0.5, -0.04);
      if (id === "olive-terrace") {
        // The picking has reached the trees nearest the estate: a ladder against each of a dozen, two pickers at each,
        // a basket under it, and carriers going between them and the estate's press.
        const nearest = this.oliveSpots.map((tree, k) => ({ tree, k, d: Math.hypot(tree[0]! - ESTATE.x, tree[2]! - ESTATE.z) })).sort((a, b) => a.d - b.d).slice(0, 12);
        for (const { tree, k } of nearest) {
          if (spots.length >= HARVESTERS - 1) break;
          const a = k * 2.4;
          ladderAt.push([tree[0]! + Math.cos(a) * 1.5, tree[1]!, tree[2]! + Math.sin(a) * 1.5, Math.atan2(-Math.cos(a), -Math.sin(a))]);
          spots.push({ x: tree[0]! + Math.cos(a + 1.9) * 2.1, z: tree[2]! + Math.sin(a + 1.9) * 2.1, yaw: Math.atan2(-Math.cos(a + 1.9), -Math.sin(a + 1.9)), reach: true, carrier: false, to: store });
          spots.push({ x: tree[0]! + Math.cos(a - 1.7) * 2.3, z: tree[2]! + Math.sin(a - 1.7) * 2.3, yaw: Math.atan2(-Math.cos(a - 1.7), -Math.sin(a - 1.7)), reach: true, carrier: k % 3 === 0, to: store });
          basketAt.push([tree[0]! + Math.cos(a + 0.9) * 2.6, tree[1]!, tree[2]! + Math.sin(a + 0.9) * 2.6, 1.5]);
          basketAt.push([tree[0]! + Math.cos(a + 0.4) * 3.1, tree[1]!, tree[2]! + Math.sin(a + 0.4) * 3.1, 1.5]);
        }
        tint.setRGB(0.2, 0.26, 0.12);
      } else {
        // A line of reapers across the field, standing where the cut has reached; binders and carriers behind them.
        // With the last of it cut, they are in the middle of the field, binding and carrying.
        const front = f.standing > 0 ? Math.min(0.96, Math.max(0.04, 1 - f.standing)) : 0.55;
        const facing = Math.atan2(poly[3]![0] - poly[0]![0], poly[3]![1] - poly[0]![1]);
        // Sixteen reapers shoulder to shoulder, three paces apart, in the middle of the field's width; carriers behind.
        const width = Math.hypot(poly[1]![0] - poly[0]![0], poly[1]![1] - poly[0]![1]);
        const pace = 3 / width;
        for (let i = 0; i < 16 && spots.length < HARVESTERS; i++) {
          const u = 0.5 + (i - 7.5) * pace;
          const [x, z] = at(u, front + ((i * 7) % 3) * 0.008);
          spots.push({ x, z, yaw: facing, reach: false, carrier: false, to: store });
          if (i % 4 === 1) {
            const [cx, cz] = at(u, Math.max(0.02, front - 0.06));
            spots.push({ x: cx, z: cz, yaw: facing + Math.PI, reach: false, carrier: true, to: store });
          }
        }
        // Behind them, what they have cut stands in stooks, row after row back to where they began.
        for (let k = 0; k < 40; k++) {
          const v = front - 0.03 - Math.floor(k / 8) * 0.045;
          if (v < 0.02) break;
          const [sx, sz] = at(0.5 + ((k % 8) - 3.5) * pace * 2.2 + (Math.floor(k / 8) % 2) * pace, v);
          basketAt.push([sx, heightAt(sx, sz, this.options.seed), sz, 2.3]);
        }
        tint.setRGB(0.86, 0.68, 0.26);
      }
    }
    for (const s of spots) if (s.carrier) s.walk = this.wayBetween([s.x, s.z], s.to);
    this.workSpots = spots;
    const seedOfLand = this.options.seed;
    const la = this.ladders.instanceMatrix.array as Float32Array;
    ladderAt.slice(0, 16).forEach((l, i) => bendingMatrix(la, i * 16, l[0]!, heightAt(l[0]!, l[2]!, seedOfLand), l[2]!, l[3]!, 0.32, 1));
    this.ladders.count = Math.min(16, ladderAt.length);
    this.ladders.instanceMatrix.needsUpdate = true;
    const ba = this.baskets.instanceMatrix.array as Float32Array;
    basketAt.slice(0, BASKETS).forEach((b, i) => {
      const size = b[3] ?? 1;
      instanceMatrix(ba, i * 16, b[0]!, heightAt(b[0]!, b[2]!, seedOfLand), b[2]!, i * 1.3, size, size, size);
      this.baskets.setColorAt(i, tint);
    });
    this.baskets.count = Math.min(BASKETS, basketAt.length);
    this.baskets.instanceMatrix.needsUpdate = true;
    if (this.baskets.instanceColor) this.baskets.instanceColor.needsUpdate = true;

    // The ring round the chosen field.
    const sel = look.selected ? FIELDS[look.selected] : undefined;
    this.ring.visible = Boolean(sel);
    if (sel) {
      const cx = sel.reduce((a, p) => a + p[0], 0) / sel.length;
      const cz = sel.reduce((a, p) => a + p[1], 0) / sel.length;
      const r = Math.max(...sel.map((p) => Math.hypot(p[0] - cx, p[1] - cz)));
      this.ring.position.set(cx, heightAt(cx, cz, this.options.seed) + 4, cz);
      this.ring.scale.set(r, 1, r * 0.72);
    }
  }

  setCamera(pose: Pose): void {
    const [x, y, z] = eyeOf(pose);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(pose.tx, pose.ty, pose.tz);
    this.sky.position.copy(this.camera.position);
    if (this.skyDome) this.skyDome.position.copy(this.camera.position);
    this.pose = pose;
    this.fitShadow(pose);
    this.fitDetail(pose);
  }

  /**
   * Where the player is thinking of building: a ring on the ground, green and whole where the ground takes it, red
   * where it does not. The words beside the valley say the same, so nothing is told by colour alone.
   */
  setGhost(g: { x: number; z: number; r: number; ok: boolean; mark?: boolean } | null): void {
    for (const m of [this.ghost, this.ghostFill]) {
      m.visible = g !== null;
      if (!g) continue;
      m.position.set(g.x, heightAt(g.x, g.z, this.options.seed) + 0.6, g.z);
      m.scale.set(g.r, 1, g.r);
      // Gold for what has been chosen to look at; green or red for ground being considered to build on.
      (m.material as THREE.MeshBasicMaterial).color.setHex(g.mark ? 0xe8b23a : g.ok ? 0x4fd06a : 0xe0503c);
    }
  }

  /** The point of the land under a place in the window (CSS pixels), or null if the ray leaves the valley. */
  /** With `lift`, the point where the ray meets the land raised by so many metres: where a roof of that height would be struck. */
  landAt(clientX: number, clientY: number, lift = 0): [number, number] | null {
    const r = this.canvas.getBoundingClientRect();
    this.raycaster.setFromCamera(new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, 1 - ((clientY - r.top) / r.height) * 2), this.camera);
    const o = this.raycaster.ray.origin;
    const d = this.raycaster.ray.direction;
    if (d.y > -0.01) return null;
    // March down the ray until it goes under the land, then step back by halves.
    let t = 0;
    for (let i = 0; i < 400; i++) {
      t += 6;
      const x = o.x + d.x * t;
      const z = o.z + d.z * t;
      if (o.y + d.y * t <= heightAt(x, z, this.options.seed) + lift) {
        let lo = t - 6;
        let hi = t;
        for (let k = 0; k < 8; k++) {
          const mid = (lo + hi) / 2;
          if (o.y + d.y * mid <= heightAt(o.x + d.x * mid, o.z + d.z * mid, this.options.seed) + lift) hi = mid;
          else lo = mid;
        }
        return [o.x + d.x * hi, o.z + d.z * hi];
      }
    }
    return null;
  }
  /** The field under a place in the window, or null. */
  fieldAt(clientX: number, clientY: number): string | null {
    const p = this.landAt(clientX, clientY);
    return p ? fieldAt(p[0], p[1]) : null;
  }
  /** Where a point of the valley is in the window (CSS pixels), or null if it is behind the camera. */
  screenOf(x: number, y: number, z: number): [number, number] | null {
    const v = new THREE.Vector3(x, y, z).project(this.camera);
    if (v.z > 1) return null;
    const r = this.canvas.getBoundingClientRect();
    return [r.left + ((v.x + 1) / 2) * r.width, r.top + ((1 - v.y) / 2) * r.height];
  }

  render(timeSeconds: number): void {
    const t0 = performance.now();
    const still = this.options.reducedMotion;
    this.waterTime.value = still ? 0 : timeSeconds;
    if (this.rain.visible && !still) this.rain.position.y = -((timeSeconds * 160) % 60);
    // People: each goes out from the village to a place of work and back, at a walking pace.
    const body = this.bodies.instanceMatrix.array as Float32Array;
    const seed = this.options.seed;
    const n = this.walkers;
    const at = { x: 0, z: 0, yaw: 0 };
    for (let i = 0; i < n; i++) {
      const walk = this.walkRoutes[i];
      if (!walk) continue;
      // Out along the way and back, at a walking pace of a metre and a half a second, each in its own time.
      const u = ((still ? 0 : timeSeconds) * 1.5) / walk.length + (i * 0.37) % 1;
      const phase = ((u % 2) + 2) % 2;
      along(walk, (phase > 1 ? 2 - phase : phase) * walk.length, at);
      const heading = at.yaw + (phase > 1 ? Math.PI : 0);
      const step = timeSeconds * 6 + i;
      const bob = still ? 0 : 0.04 * Math.abs(Math.sin(step));
      walkingMatrix(body, i * 16, at.x, heightAt(at.x, at.z, seed) + 0.05 + bob, at.z, heading, still ? 0 : 0.04 * Math.sin(step), 1.15);
      this.strides[i] = still ? 0 : 0.5 * Math.sin(step);
    }
    // The wheel, and the carts going out along the roads and back.
    const dt = this.lastTime ? Math.min(0.1, timeSeconds - this.lastTime) : 0;
    this.lastTime = timeSeconds;
    if (this.wheelTurns && !still) (this.millWheel ?? this.wheel).rotation.z -= dt * 0.7;
    const carts = this.carts.instanceMatrix.array as Float32Array;
    for (let i = 0; i < CARTS; i++) {
      const road = this.cartRoads[i % Math.max(1, this.cartRoads.length)];
      if (!road || road.length < 2) continue;
      const last = road.length - 1;
      // Six metres between a road's points, a little over a metre a second: an ox's pace.
      const u = (((still ? 0 : timeSeconds) * 0.2 + i * 17.3) % (2 * last) + 2 * last) % (2 * last);
      const back = u > last;
      const at = back ? 2 * last - u : u;
      const k = Math.min(last - 1, Math.floor(at));
      const a = road[k]!;
      const b = road[k + 1]!;
      const t = at - k;
      const x = a[0] + (b[0] - a[0]) * t;
      const z = a[1] + (b[1] - a[1]) * t;
      const dir = back ? -1 : 1;
      instanceMatrix(carts, i * 16, x, heightAt(x, z, seed) + 0.16, z, Math.atan2((b[0] - a[0]) * dir, (b[1] - a[1]) * dir), 1, 1, 1);
      // The ox walks: legs on one diagonal forward while the other two go back.
      const ox = this.oxLegs.instanceMatrix.array as Float32Array;
      const swing = still ? 0 : 0.32 * Math.sin(timeSeconds * 3.2 + i);
      OX_LEGS.forEach((j, k) => limbMatrix(ox, (i * 4 + k) * 16, carts, i * 16, j[0], j[1], j[2], k === 0 || k === 3 ? swing : -swing));
    }
    (this.oxen.instanceMatrix.array as Float32Array).set(carts);
    this.carts.instanceMatrix.needsUpdate = true;
    this.oxen.instanceMatrix.needsUpdate = true;
    this.oxLegs.instanceMatrix.needsUpdate = true;
    this.moveLife(still ? 0 : timeSeconds, seed);
    // People at the harvest: a picker reaches up and down, a reaper stoops and rises, a carrier goes to the store and back.
    let m = 0;
    for (const w of this.workSpots) {
      const o = (n + m) * 16;
      const beat = still ? 0 : timeSeconds * (w.reach ? 1.7 : 2.3) + m * 1.9;
      this.strides[n + m] = 0;
      if (w.carrier && w.walk) {
        const u = ((still ? 0 : timeSeconds) * 1.3) / w.walk.length + (m * 0.29) % 1;
        const phase = ((u % 2) + 2) % 2;
        along(w.walk, (phase > 1 ? 2 - phase : phase) * w.walk.length, at);
        const step = timeSeconds * 6 + m;
        walkingMatrix(body, o, at.x, heightAt(at.x, at.z, seed) + 0.05, at.z, at.yaw + (phase > 1 ? Math.PI : 0), still ? 0 : 0.04 * Math.sin(step), 1.15);
        this.strides[n + m] = still ? 0 : 0.5 * Math.sin(step);
      } else if (w.reach) bendingMatrix(body, o, w.x, heightAt(w.x, w.z, seed) + 0.05 + 0.1 * Math.max(0, Math.sin(beat)), w.z, w.yaw + 0.25 * Math.sin(beat * 0.37), -0.12 * Math.max(0, Math.sin(beat)), 1.15);
      else bendingMatrix(body, o, w.x, heightAt(w.x, w.z, seed) + 0.05, w.z, w.yaw + 0.3 * Math.sin(beat * 0.5), 0.5 * (0.5 + 0.5 * Math.sin(beat)), 1.15);
      m++;
    }
    (this.heads.instanceMatrix.array as Float32Array).set(body.subarray(0, (n + m) * 16));
    // Legs: two to each person, at the hips, swinging opposite ways as they step; still for one at work in a field.
    const legs = this.legs.instanceMatrix.array as Float32Array;
    for (let i = 0; i < n + m; i++) {
      const s = this.strides[i]!;
      PERSON_LEGS.forEach((j, side) => limbMatrix(legs, (i * 2 + side) * 16, body, i * 16, j[0], j[1], j[2], side ? -s : s));
    }
    this.legs.count = (n + m) * 2;
    this.legs.instanceMatrix.needsUpdate = true;
    this.bodies.count = n + m;
    this.heads.count = n + m;
    this.bodies.instanceMatrix.needsUpdate = true;
    this.heads.instanceMatrix.needsUpdate = true;
    if (this.pipeline) this.pipeline.render();
    else this.renderer.render(this.scene, this.camera);
    this.cpuMs = performance.now() - t0;
  }

  /** Where walker i lives: a place in the village, the same each time. */
  private homeOf(i: number): [number, number] {
    return [VILLAGE[0] + ((i * 37) % 90) - 30 + Math.sin(i * 1.7) * 2, VILLAGE[1] + ((i * 53) % 40) - 6 + Math.cos(i * 2.3) * 2];
  }

  /** The way from one place to another round what stands between; a straight line if the valley has no grid. */
  private wayBetween(from: readonly [number, number], to: readonly [number, number]): Walk {
    const g = this.walkable;
    if (!g) return walkOf([from, to]);
    const key = `${Math.round(to[0])},${Math.round(to[1])}`;
    let field = this.fields.get(key);
    if (!field) {
      field = fieldTo(g, to);
      this.fields.set(key, field);
    }
    return walkOf(route(g, field, from, to) ?? [from, from]);
  }

  /**
   * The valley's other living things, each where the time of the clock puts it: nothing here is remembered from one
   * frame to the next, so a picture taken at a given second is the same picture every time, and with motion reduced
   * (time held at nought) they stand still where they are.
   */
  private moveLife(t: number, seed: number): void {
    // Flocks: each animal ambles about a spot of its own inside the pasture, and now and then lowers its head to graze.
    const flock = this.flocks.instanceMatrix.array as Float32Array;
    const sheepLegs = this.sheepLegs.instanceMatrix.array as Float32Array;
    const goats = this.goats.instanceMatrix.array as Float32Array;
    const goatLegs = this.goatLegs.instanceMatrix.array as Float32Array;
    this.pastures.forEach((p, f) => {
      for (let k = 0; k < FLOCK; k++) {
        const i = f * FLOCK + k;
        const a = i * 2.399;
        const r = p[2]! * (0.25 + 0.75 * ((i * 0.618) % 1));
        const drift = t * 0.05 + i;
        const x = p[0]! + Math.cos(a) * r + Math.sin(drift * 0.9 + i) * 2.4;
        const z = p[1]! + Math.sin(a) * r + Math.cos(drift * 0.7 + i * 1.3) * 2.4;
        const heading = Math.atan2(Math.cos(drift * 0.9 + i) * 0.9, -Math.sin(drift * 0.7 + i * 1.3) * 0.7);
        const size = 0.9 + ((i * 13) % 7) * 0.05;
        const bodies = this.flockGoat[i] ? goats : flock;
        const legs = this.flockGoat[i] ? goatLegs : sheepLegs;
        const slot = this.flockSlot[i]!;
        instanceMatrix(bodies, slot * 16, x, heightAt(x, z, seed) + 0.02, z, heading, size, size, size);
        const amble = t === 0 ? 0 : 0.3 * Math.sin(t * 2.4 + i * 1.3);
        SHEEP_LEGS.forEach((j, q) => limbMatrix(legs, (slot * 4 + q) * 16, bodies, slot * 16, j[0], j[1], j[2], q === 0 || q === 3 ? amble : -amble));
      }
    });
    this.flocks.instanceMatrix.needsUpdate = true;
    this.sheepLegs.instanceMatrix.needsUpdate = true;
    this.goats.instanceMatrix.needsUpdate = true;
    this.goatLegs.instanceMatrix.needsUpdate = true;
    // The donkeys graze with them, slower and less far about.
    const donkeys = this.donkeys.instanceMatrix.array as Float32Array;
    const donkeyLegs = this.donkeyLegs.instanceMatrix.array as Float32Array;
    this.pastures.forEach((p, i) => {
      const drift = t * 0.03 + i * 2.7;
      const x = p[0]! + Math.cos(i * 2.1 + 0.7) * p[2]! * 0.3 + Math.sin(drift + i) * 1.7;
      const z = p[1]! + Math.sin(i * 2.1 + 0.7) * p[2]! * 0.3 + Math.cos(drift * 0.8 + i * 1.4) * 1.7;
      const heading = Math.atan2(Math.cos(drift + i) * 0.8, -Math.sin(drift * 0.8 + i * 1.4) * 0.6);
      instanceMatrix(donkeys, i * 16, x, heightAt(x, z, seed) + 0.02, z, heading, 1, 1, 1);
      const amble = t === 0 ? 0 : 0.2 * Math.sin(t * 1.7 + i * 1.9);
      HORSE_LEGS.forEach((j, q) => limbMatrix(donkeyLegs, (i * 4 + q) * 16, donkeys, i * 16, j[0], j[1], j[2], q === 0 || q === 3 ? amble : -amble));
    });
    this.donkeys.instanceMatrix.needsUpdate = true;
    this.donkeyLegs.instanceMatrix.needsUpdate = true;
    // Riders: out along a road and back at a trot, the rider seated on the horse's back.
    const horses = this.horses.instanceMatrix.array as Float32Array;
    const riders = this.riderBodies.instanceMatrix.array as Float32Array;
    for (let i = 0; i < RIDERS; i++) {
      const road = this.riderRoads[i % Math.max(1, this.riderRoads.length)];
      if (!road || road.length < 2) continue;
      const last = road.length - 1;
      const u = ((t * 0.62 + i * 23.7) % (2 * last) + 2 * last) % (2 * last);
      const back = u > last;
      const at = back ? 2 * last - u : u;
      const k = Math.min(last - 1, Math.floor(at));
      const a = road[k]!;
      const b = road[k + 1]!;
      const s = at - k;
      const dir = back ? -1 : 1;
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      // They keep to one side of the road, as the carts keep to its middle.
      const x = a[0] + (b[0] - a[0]) * s - ((b[1] - a[1]) / l) * dir * 2.6;
      const z = a[1] + (b[1] - a[1]) * s + ((b[0] - a[0]) / l) * dir * 2.6;
      const heading = Math.atan2((b[0] - a[0]) * dir, (b[1] - a[1]) * dir);
      const rise = Math.abs(Math.sin(t * 7 + i)) * 0.07;
      const y = heightAt(x, z, seed) + 0.05 + rise;
      instanceMatrix(horses, i * 16, x, y, z, heading, 1, 1, 1);
      // A trot: the legs move in diagonal pairs.
      const trot = t === 0 ? 0 : 0.42 * Math.sin(t * 7 + i);
      const hl = this.horseLegs.instanceMatrix.array as Float32Array;
      HORSE_LEGS.forEach((j, k) => limbMatrix(hl, (i * 4 + k) * 16, horses, i * 16, j[0], j[1], j[2], k === 0 || k === 3 ? trot : -trot));
      instanceMatrix(riders, i * 16, x, y + 0.86, z, heading, 0.95, 0.82, 0.95);
    }
    this.horses.instanceMatrix.needsUpdate = true;
    this.horseLegs.instanceMatrix.needsUpdate = true;
    (this.riderHeads.instanceMatrix.array as Float32Array).set(riders);
    this.riderBodies.instanceMatrix.needsUpdate = true;
    this.riderHeads.instanceMatrix.needsUpdate = true;
    // The watch: a man paces his stretch of the wall and turns at its ends; two stand at the gate.
    const watch = this.watchBodies.instanceMatrix.array as Float32Array;
    this.guardWalks.forEach((w, i) => {
      const l = Math.hypot(w[2]! - w[0]!, w[3]! - w[1]!) || 1;
      const u = ((t * 0.9) / l + i * 0.31) % 2;
      const back = u > 1;
      // He keeps clear of the towers at the two ends.
      const s = 0.12 + 0.76 * (back ? 2 - u : u);
      const x = w[0]! + (w[2]! - w[0]!) * s;
      const z = w[1]! + (w[3]! - w[1]!) * s;
      instanceMatrix(watch, i * 16, x, heightAt(x, z, seed) + WALL_WALK, z, Math.atan2((w[2]! - w[0]!) * (back ? -1 : 1), (w[3]! - w[1]!) * (back ? -1 : 1)), 1.15, 1.15, 1.15);
    });
    this.gatePosts.forEach((g, j) => instanceMatrix(watch, (this.guardWalks.length + j) * 16, g[0]!, heightAt(g[0]!, g[1]!, seed) + 0.05, g[1]!, g[2]!, 1.15, 1.15, 1.15));
    (this.watchHeads.instanceMatrix.array as Float32Array).set(watch);
    const wl = this.watchLegs.instanceMatrix.array as Float32Array;
    for (let i = 0; i < this.guardWalks.length + this.gatePosts.length; i++) {
      // Those on the wall pace; those at the gate stand.
      const s = t === 0 || i >= this.guardWalks.length ? 0 : 0.45 * Math.sin(t * 5 + i);
      PERSON_LEGS.forEach((j, side) => limbMatrix(wl, (i * 2 + side) * 16, watch, i * 16, j[0], j[1], j[2], side ? -s : s));
    }
    this.watchLegs.instanceMatrix.needsUpdate = true;
    (this.watchGear.instanceMatrix.array as Float32Array).set(watch);
    this.watchBodies.instanceMatrix.needsUpdate = true;
    this.watchHeads.instanceMatrix.needsUpdate = true;
    this.watchGear.instanceMatrix.needsUpdate = true;
    // Birds: slow circles high over the river and the fields, a few over the hill.
    const birds = this.birds.instanceMatrix.array as Float32Array;
    for (let i = 0; i < BIRDS; i++) {
      const overHill = i % 4 === 3;
      const cx = overHill ? 900 : 120 + ((i * 97) % 420) - 160;
      const cz = overHill ? -140 : -60 + ((i * 53) % 260) - 90;
      const r = 30 + (i % 5) * 14;
      const a = t * (0.22 - (i % 3) * 0.04) * (i % 2 ? 1 : -1) + i * 1.9;
      const x = cx + Math.cos(a) * r;
      const z = cz + Math.sin(a) * r;
      const size = 1.6 + (i % 3) * 0.5;
      instanceMatrix(birds, i * 16, x, heightAt(cx, cz, seed) + 55 + (i % 4) * 9 + Math.sin(a * 0.5) * 3, z, Math.atan2(-Math.sin(a) * (i % 2 ? 1 : -1), Math.cos(a) * (i % 2 ? 1 : -1)), size, size * (0.7 + 0.5 * Math.sin(t * 5 + i)), size);
    }
    this.birds.instanceMatrix.needsUpdate = true;
  }

  resize(): void {
    const w = Math.max(1, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.pixelRatioCap));
    this.renderer.setSize(w, h, false);
    this.aspect = w / h;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  /** Sets the light by hand, over the season's own. For the capture tool, to compare settings side by side. */
  tune(o: { environment?: number; ambient?: number; sun?: number; exposure?: number; fog?: number }): void {
    if (o.environment !== undefined) this.scene.environmentIntensity = o.environment;
    if (o.ambient !== undefined) this.hemi.intensity = o.ambient;
    if (o.sun !== undefined) this.sun.intensity = o.sun;
    if (o.exposure !== undefined) this.renderer.toneMappingExposure = o.exposure;
    if (o.fog !== undefined) (this.scene.fog as THREE.FogExp2).density = o.fog;
  }

  /** Draws fewer pixels: used when frames come too slowly. Returns the new limit, or null if it is already at its lowest. */
  easePixels(): number | null {
    if (this.pixelRatioCap <= 1) return null;
    this.pixelRatioCap = Math.max(1, this.pixelRatioCap - 0.25);
    this.resize();
    return this.pixelRatioCap;
  }

  info(): { drawCalls: number; triangles: number; geometries: number | null; textures: number | null; cpuRenderMs: number; engine: string; pixels: [number, number]; walkers: number; atWork: number; models: string[]; modelFailures: string[] } {
    const r = this.renderer.info.render as unknown as { drawCalls: number; triangles: number };
    // What the renderer says it is holding. Null where this renderer does not keep the count.
    const held = (this.renderer.info as unknown as { memory?: { geometries?: number; textures?: number } }).memory;
    return { drawCalls: r.drawCalls, triangles: r.triangles, geometries: held?.geometries ?? null, textures: held?.textures ?? null, cpuRenderMs: this.cpuMs, engine: `three r${THREE.REVISION} webgpu`, pixels: [this.canvas.width, this.canvas.height], walkers: this.walkers, atWork: this.workSpots.length, models: [...this.models], modelFailures: [...this.modelFailures] };
  }

  dispose(): void {
    this.disposed = true;
    for (const meshes of this.placedMeshes.values()) for (const m of meshes) m.geometry.dispose();
    this.placedMeshes.clear();
    if (this.millModel) disposeModel(this.millModel);
    if (this.townModel) disposeModel(this.townModel);
    if (this.landmarksModel) disposeModel(this.landmarksModel);
    for (const m of this.candidateModels) disposeModel(m);
    disposeSharedMaterials();
    for (const d of this.disposables) d.dispose();
    this.pipeline?.dispose();
    this.renderer.dispose();
  }
}
