// The Atlas globe as a lit sphere, drawn by Three.js on WebGPU under the 2D globe. It draws the Earth only: the sea,
// the land with its coastline, a faint graticule, the light on them, and stars behind. The pins, the arc and every
// control stay on the 2D canvas above, which also remains the whole globe wherever WebGPU is missing.
//
// The sphere is seen without perspective and turned by view/sphere.ts, which a test holds to the 2D globe's own
// projection, so the two canvases are one picture. The map on it is painted here from the same coastline the 2D
// globe draws (land only, no borders, no names): nothing is downloaded and no photograph of the Earth is used.
import * as THREE from "three/webgpu";
import { geoEquirectangular, geoGraticule10, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { Rng } from "@im/kernel/prng";
import { viewTurn, type SphereView } from "./sphere";

export interface SphereShow extends SphereView {
  width: number;
  height: number;
}
const SPACE = 0x070d18;

/** Paints the world on a flat sheet, Greenwich at its middle and north at its top. */
function paint(land: GeoPermissibleObjects, width: number, kind: "colour" | "roughness"): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = width / 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2D canvas to paint the map on");
  const path = geoPath(geoEquirectangular().translate([width / 2, width / 4]).scale(width / (2 * Math.PI)), ctx);
  const k = width / 4096;
  if (kind === "roughness") {
    // Green carries the roughness: the sea shines a little, the land does not.
    ctx.fillStyle = "rgb(0, 140, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    path(land);
    ctx.fillStyle = "rgb(0, 240, 0)";
    ctx.fill();
    return canvas;
  }
  // The sea: deepest toward the poles.
  const sea = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sea.addColorStop(0, "#0f3157");
  sea.addColorStop(0.5, "#1c5488");
  sea.addColorStop(1, "#0f3157");
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  path(geoGraticule10());
  ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
  ctx.lineWidth = 1.4 * k;
  ctx.stroke();
  // Paler water along every coast, as a soft edge and not as bands: it is a drawing of a coast, and no depth is known.
  for (const [w, a, blur] of [[34, 0.2, 12], [12, 0.2, 4]] as const) {
    ctx.filter = `blur(${blur * k}px)`;
    ctx.beginPath();
    path(land);
    ctx.strokeStyle = `rgba(150, 210, 235, ${a})`;
    ctx.lineJoin = "round";
    ctx.lineWidth = w * k;
    ctx.stroke();
  }
  ctx.filter = "none";
  ctx.beginPath();
  path(land);
  ctx.fillStyle = "#e7dcc3";
  ctx.fill();
  ctx.strokeStyle = "#a9976c";
  ctx.lineWidth = 1.6 * k;
  ctx.stroke();
  return canvas;
}

export class Sphere3D {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 60000);
  private globe!: THREE.Mesh;
  private renderer!: THREE.WebGPURenderer;
  private size = "";
  private readonly disposables: Array<{ dispose(): void }> = [];
  private frames = 0;
  private mapWidth = 0;

  static async create(canvas: HTMLCanvasElement, land: GeoPermissibleObjects): Promise<Sphere3D> {
    const s = new Sphere3D();
    await s.init(canvas, land);
    return s;
  }

  private async init(canvas: HTMLCanvasElement, land: GeoPermissibleObjects): Promise<void> {
    const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, powerPreference: "high-performance", forceWebGL: false });
    await renderer.init();
    if (!(renderer.backend as unknown as { isWebGPUBackend?: boolean }).isWebGPUBackend) throw new Error("no-webgpu-backend");
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(SPACE, 1);
    this.renderer = renderer;

    // A map of 8,192 across stays sharp when the globe is brought close; a device short of memory gets half of that.
    const memory = (navigator as { deviceMemory?: number }).deviceMemory;
    const width = memory !== undefined && memory < 8 ? 4096 : 8192;
    this.mapWidth = width;
    const colour = new THREE.CanvasTexture(paint(land, width, "colour"));
    colour.colorSpace = THREE.SRGBColorSpace;
    colour.anisotropy = 8;
    colour.wrapS = THREE.RepeatWrapping;
    const rough = new THREE.CanvasTexture(paint(land, 2048, "roughness"));
    rough.wrapS = THREE.RepeatWrapping;
    const material = new THREE.MeshStandardMaterial({ map: colour, roughnessMap: rough, roughness: 1, metalness: 0 });
    const geometry = new THREE.SphereGeometry(1, 160, 80);
    this.globe = new THREE.Mesh(geometry, material);
    this.globe.rotation.order = "XYZ";
    this.scene.add(this.globe);
    this.disposables.push(colour, rough, material, geometry);

    // The light stands still to the viewer's upper left, as the drawn globe was shaded: it is there to give the
    // sphere its roundness, and says nothing about the hour or the season.
    const sun = new THREE.DirectionalLight(0xfff2dc, 3.1);
    sun.position.set(-0.55, 0.62, 0.9);
    this.scene.add(sun, new THREE.HemisphereLight(0xa8c4ff, 0x0b1626, 0.75));

    // Stars: small squares far behind the globe, the same every time.
    const rng = new Rng(1475);
    const count = 900;
    const quad = new THREE.PlaneGeometry(1, 1);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const stars = new THREE.InstancedMesh(quad, starMaterial, count);
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const size = rng.chance(0.12) ? rng.range(1.8, 2.8) : rng.range(0.8, 1.6);
      m.makeScale(size, size, 1);
      m.setPosition(rng.range(-2400, 2400), rng.range(-1500, 1500), -20000);
      stars.setMatrixAt(i, m);
      const b = rng.range(0.25, 0.95);
      stars.setColorAt(i, c.setRGB(b, b, Math.min(1, b * rng.range(1, 1.25))));
    }
    stars.frustumCulled = false;
    this.scene.add(stars);
    this.disposables.push(quad, starMaterial);
    this.camera.position.set(0, 0, 30000);
  }

  /** Draws the Earth as the 2D globe above it is looking at it. */
  show(view: SphereShow): void {
    const key = `${view.width}x${view.height}`;
    if (key !== this.size) {
      this.size = key;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(view.width, view.height, false);
      this.camera.left = -view.width / 2;
      this.camera.right = view.width / 2;
      this.camera.top = view.height / 2;
      this.camera.bottom = -view.height / 2;
      this.camera.updateProjectionMatrix();
    }
    const turn = viewTurn(view.lat, view.lon);
    this.globe.rotation.set(turn.x, turn.y, 0);
    this.globe.scale.setScalar(view.radius);
    this.globe.position.set(view.cx - view.width / 2, view.height / 2 - view.cy, 0);
    this.renderer.render(this.scene, this.camera);
    this.frames += 1;
  }

  info(): { engine: string; frames: number; triangles: number; mapWidth: number } {
    const r = this.renderer.info.render as unknown as { triangles: number };
    return { engine: `three r${THREE.REVISION} webgpu`, frames: this.frames, triangles: r.triangles, mapWidth: this.mapWidth };
  }

  dispose(): void {
    for (const d of this.disposables) d.dispose();
    this.renderer.dispose();
  }
}
