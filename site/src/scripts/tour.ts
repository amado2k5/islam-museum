// 3D virtual museum tour — client logic for Tour3D.astro.
//
// PERF: three.js is NOT imported at the top level. It loads ONLY when the
// visitor presses the Enter button (dynamic import below), so everyone else
// gets a light page with zero WebGL cost.
//
// All user-facing strings come from the JSON payload rendered by the component
// (data.t / data.journeys / data.exhibits / data.wingTitles); exhibit labels come
// from tour/exhibits.yaml joined to their object records. All links are relative.

export {}; // keep this file a module: no globals leak across bundled scripts

interface JourneyView {
  id: string;
  kind: string; // "حدث" | "مكان" | "زمن" (see tour/journeys.yaml)
  build: string; // key into JOURNEY_BUILDERS
  title: string;
  sub: string;
  lines: string[];
}

interface ExhibitData {
  id: string;
  build: string; // key into exhibitBuilders
  label: string;
  desc: string;
  material: string;
  museum: string;
  date: string;
  note: string; // derived-date legend, when the date carries †
  href: string; // the object record page
}

interface TourData {
  lang: "ar" | "en" | "ur";
  t: Record<string, string>;
  journeys: JourneyView[];
  exhibits: ExhibitData[];
  wingTitles: Record<string, string>;
}

type THREE_NS = typeof import("three");

/* ------------------------------------------------------------------ */
/* Static part — no three.js here. Reads the data bridge, wires the   */
/* entry card, detects touch, and arms the load watchdog.              */
/* ------------------------------------------------------------------ */

function readData(root: HTMLElement): TourData | null {
  const el = root.querySelector("script[type='application/json']");
  try {
    const d = JSON.parse(el?.textContent || "null") as TourData;
    if (d && d.t && Array.isArray(d.journeys) && d.wingTitles) return d;
    return null;
  } catch {
    return null;
  }
}

function wireStatic(root: HTMLElement, data: TourData): void {
  const t = data.t;
  // Reveal the fullscreen overlay. Without JS it stays display:none and the
  // page's own fallback content is what visitors see.
  root.style.display = "block";

  const touch = matchMedia("(pointer: coarse)").matches;
  if (touch) {
    document.body.classList.add("touch");
    const hint = root.querySelector("#hint");
    if (hint && t.hint_touch) hint.textContent = t.hint_touch;
  }

  const enterCard = root.querySelector<HTMLElement>("#enterCard")!;
  const enterBtn = root.querySelector<HTMLButtonElement>("#enterBtn")!;
  const exitBtn = root.querySelector<HTMLButtonElement>("#exitBtn")!;
  const loading = root.querySelector<HTMLElement>("#loading")!;
  const failEl = root.querySelector<HTMLElement>("[data-fail]")!;

  const showFail = (msg: string) => {
    loading.style.display = "none";
    enterCard.classList.remove("hide");
    failEl.textContent = msg;
    failEl.hidden = false;
    enterBtn.disabled = false;
    enterBtn.focus();
  };

  // Wired once; each successful entry replaces the teardown below.
  // Exit asks first; only a confirmed exit disposes the scene and returns to the
  // museum home (two-way nav). Cancel leaves the visitor where they were.
  let teardown: (() => void) | null = null;
  exitBtn.addEventListener("click", () => {
    if (!window.confirm(t.exit_confirm || "Leave the 3D tour?")) return;
    teardown?.();
    window.location.href = `/${data.lang}/`;
  });

  enterBtn.addEventListener("click", async () => {
    enterBtn.disabled = true;
    failEl.hidden = true;
    enterCard.classList.add("hide");
    loading.style.display = "flex";
    // Let the loading state paint before the heavy synchronous scene build.
    await new Promise((r) => requestAnimationFrame(r));
    // Watchdog: if three.js (or WebGL) fails to load, say so in the entry card.
    const watchdog = window.setTimeout(
      () => showFail(t.failed || "The 3D tour failed to load."),
      9000
    );
    try {
      const THREE = await import("three");
      window.clearTimeout(watchdog);
      teardown = init(THREE, data, { root, enterCard, enterBtn, loading }).teardown;
      // Land keyboard/screen-reader focus on a visible, labeled control.
      root.querySelector<HTMLButtonElement>("#exitBtn")?.focus();
    } catch {
      window.clearTimeout(watchdog);
      showFail(t.failed || "The 3D tour failed to load.");
    }
  });
}

const tourRoot = document.getElementById("tour3d-root");
const tourData = tourRoot ? readData(tourRoot) : null;
if (tourRoot && tourData) wireStatic(tourRoot, tourData);

/* ------------------------------------------------------------------ */
/* init — ALL three.js code lives here. Called only after the dynamic  */
/* import resolves. Returns a teardown that fully disposes the tour    */
/* (used by the Exit button; a second entry rebuilds cleanly).         */
/* ------------------------------------------------------------------ */

interface InitOpts {
  root: HTMLElement;
  enterCard: HTMLElement;
  enterBtn: HTMLButtonElement;
  loading: HTMLElement;
}

function init(
  THREE: THREE_NS,
  data: TourData,
  opts: InitOpts
): { teardown: () => void } {
  const { root, enterCard, enterBtn, loading } = opts;
  const t = data.t;
  const lang = data.lang;
  const REDUCED = () => (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.getAttribute("data-motion") === "reduce");

  const $ = <T extends HTMLElement = HTMLElement>(sel: string): T =>
    root.querySelector<T>(sel)!;

  const wingTitle = (id: string): string => data.wingTitles[id] || id;
  const wingHref = (id: string): string => `/${lang}/${id}/`;

  // Listeners registered here are removed by teardown().
  const cleanups: Array<() => void> = [];
  function listen(
    el: Window | HTMLElement,
    type: string,
    fn: EventListener,
    opts?: AddEventListenerOptions
  ): void {
    el.addEventListener(type, fn, opts);
    cleanups.push(() => el.removeEventListener(type, fn, opts));
  }

  /* ---------------- wings & exhibits ---------------- */
  interface Wing {
    id: string;
    color: number;
  }
  const WINGS: Wing[] = [
    { id: "time", color: 0x3b6ea5 },
    { id: "place", color: 0x2e8b7a },
    { id: "people", color: 0xc08a3e },
    { id: "ideas", color: 0x7a5fc0 },
    { id: "objects", color: 0xd4a017 },
    { id: "words", color: 0x4fa3c7 },
    { id: "living", color: 0x5da24f },
    { id: "today", color: 0xc75b6e },
    { id: "made", color: 0x9a7b4f },
  ];

  interface Exhibit extends ExhibitData {
    x: number;
    spinObj?: THREE.Object3D;
  }
  // Stops in order; labels, dates and record links come from the page data.
  const EXHIBITS: Exhibit[] = (data.exhibits || []).map((e) => ({ ...e, x: 0 }));

  /* ---------------- renderer / scene / camera / lights ---------------- */
  const app = $("#app");
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  app.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1b2e);
  const fog = new THREE.Fog(0x0d1b2e, 30, 95);
  scene.fog = fog;

  const camera = new THREE.PerspectiveCamera(
    70,
    innerWidth / innerHeight,
    0.1,
    220
  );
  camera.rotation.order = "YXZ";

  const hemi = new THREE.HemisphereLight(0xbcd0f0, 0x3a2c18, 0.55);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe9b8, 1.15);
  sun.position.set(6, 26, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -35;
  sun.shadow.camera.right = 35;
  sun.shadow.camera.top = 35;
  sun.shadow.camera.bottom = -35;
  scene.add(sun);

  // Shared materials used by several builders.
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x9a8a68,
    roughness: 0.8,
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xc9973f,
    metalness: 0.9,
    roughness: 0.35,
  });
  const goldM = new THREE.MeshStandardMaterial({
    color: 0xd4a017,
    metalness: 0.95,
    roughness: 0.25,
  });
  const creamM = new THREE.MeshStandardMaterial({
    color: 0xf3e9d2,
    roughness: 0.8,
  });

  /* ---------------- canvas-texture helpers ---------------- */
  type Ctx2D = CanvasRenderingContext2D & {
    roundRect(
      x: number,
      y: number,
      w: number,
      h: number,
      radii?: number
    ): void;
  };
  const c2dProto = CanvasRenderingContext2D.prototype as Ctx2D;
  if (
    typeof CanvasRenderingContext2D !== "undefined" &&
    typeof c2dProto.roundRect !== "function"
  ) {
    c2dProto.roundRect = function (
      this: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number
    ) {
      this.rect(x, y, w, h);
    };
  }
  function canvasTex(
    w: number,
    h: number,
    draw: (g: CanvasRenderingContext2D, w: number, h: number) => void
  ): THREE.CanvasTexture {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  const FONT = (px: number): string =>
    `800 ${px}px "Aref Ruqaa","Noto Naskh Arabic","Segoe UI",Tahoma,sans-serif`;
  function textSprite(
    text: string,
    opts: {
      px?: number;
      fg?: string;
      bg?: string;
      pad?: number;
      border?: string;
    } = {}
  ): THREE.Sprite {
    const { px = 64, fg = "#f5d67b", bg = "rgba(8,14,28,0.72)", pad = 28, border = "#d4a017" } = opts;
    const meas = document.createElement("canvas").getContext("2d")!;
    meas.font = FONT(px);
    const tw = Math.ceil(meas.measureText(text).width);
    const tex = canvasTex(tw + pad * 2, px + pad * 1.6, (g, w, h) => {
      const gg = g as Ctx2D;
      g.fillStyle = bg;
      g.beginPath();
      gg.roundRect(0, 0, w, h, 22);
      g.fill();
      if (border) {
        g.strokeStyle = border;
        g.lineWidth = 4;
        g.beginPath();
        gg.roundRect(3, 3, w - 6, h - 6, 20);
        g.stroke();
      }
      g.font = FONT(px);
      g.fillStyle = fg;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(text, w / 2, h / 2 + px * 0.06);
    });
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    const s = 0.011;
    sp.scale.set(tex.image.width * s, tex.image.height * s, 1);
    return sp;
  }

  /* ---- Islamic ornament: pointed-arch frames, girih, dome ribs ---- */
  function pointedArchFrame(
    w: number,
    h: number,
    thick: number,
    archH: number
  ): THREE.ExtrudeGeometry {
    const hw = w / 2;
    const iw = hw - thick;
    const s = new THREE.Shape();
    s.moveTo(-hw, 0);
    s.lineTo(-hw, h - archH);
    s.quadraticCurveTo(-hw, h - 0.4, 0, h);
    s.quadraticCurveTo(hw, h - 0.4, hw, h - archH);
    s.lineTo(hw, 0);
    s.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-iw, 0);
    hole.lineTo(-iw, h - archH);
    hole.quadraticCurveTo(-iw, h - thick - 0.3, 0, h - thick);
    hole.quadraticCurveTo(iw, h - thick - 0.3, iw, h - archH);
    hole.lineTo(iw, 0);
    hole.closePath();
    s.holes.push(hole);
    return new THREE.ExtrudeGeometry(s, { depth: 1.1, bevelEnabled: false });
  }
  function girihTexture(): THREE.CanvasTexture {
    return canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = "#131e38";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "#d4a017";
      g.lineWidth = 4;
      const n = 4;
      const s = w / n;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          const cx = (i + 0.5) * s;
          const cy = (j + 0.5) * s;
          const R = s * 0.44;
          const r = s * 0.19;
          g.beginPath();
          for (let k = 0; k < 16; k++) {
            const rad = k % 2 ? r : R;
            const a = (k / 16) * Math.PI * 2 - Math.PI / 2;
            if (k) g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
            else g.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
          }
          g.closePath();
          g.stroke();
          g.fillStyle = "rgba(212,160,23,.12)";
          g.fill();
        }
    });
  }
  const girihTex = girihTexture();
  const domeTex = canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = "#1d2c4f";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(212,160,23,.4)";
    g.lineWidth = 3;
    for (let i = 0; i <= 32; i++) {
      const x = (i / 32) * w;
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(w / 2 + (x - w / 2) * 0.12, h);
      g.stroke();
    }
    g.strokeStyle = "#d4a017";
    g.lineWidth = 6;
    g.beginPath();
    g.arc(w / 2, h, 70, 0, 7);
    g.stroke();
    g.lineWidth = 3;
    g.beginPath();
    g.arc(w / 2, h, 46, 0, 7);
    g.stroke();
  });
  function loadLogoTexture(cb: (tex: THREE.Texture) => void): void {
    // Same-origin museum mark — never hotlinked, never inlined as base64.
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 512;
      const g = c.getContext("2d")!;
      const s = Math.min(512 / img.width, 512 / img.height) * 0.94;
      const w = img.width * s;
      const hh = img.height * s;
      g.drawImage(img, (512 - w) / 2, (512 - hh) / 2, w, hh);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      cb(tex);
    };
    img.onerror = () => {
      /* keep the plain medallion face */
    };
    img.src = "/brand/logo-mark.svg";
  }

  /* ---------------- the Grand Hall ---------------- */
  const hall = new THREE.Group();
  scene.add(hall);
  type Interactable =
    | { obj: THREE.Object3D; kind: "portal"; wing: Wing; group: THREE.Group }
    | { obj: THREE.Object3D; kind: "exhibit"; ex: Exhibit }
    | { obj: THREE.Object3D; kind: "back" };
  const interact: Interactable[] = [];
  const HALL_R = 26;

  const floorTex = canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = "#1b2b4a";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(212,160,23,.16)";
    g.lineWidth = 2;
    for (let i = 0; i <= 16; i++) {
      const p = (i / 16) * w;
      g.beginPath();
      g.moveTo(p, 0);
      g.lineTo(p, h);
      g.stroke();
      g.beginPath();
      g.moveTo(0, p);
      g.lineTo(w, p);
      g.stroke();
    }
    g.save();
    g.translate(w / 2, h / 2);
    g.strokeStyle = "#d4a017";
    g.lineWidth = 10;
    g.beginPath();
    for (let i = 0; i < 32; i++) {
      const r = i % 2 ? 150 : 330;
      const a = (i / 32) * Math.PI * 2 - Math.PI / 2;
      if (i) g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      else g.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    g.closePath();
    g.stroke();
    g.lineWidth = 5;
    g.beginPath();
    g.arc(0, 0, 380, 0, 7);
    g.stroke();
    g.beginPath();
    g.arc(0, 0, 120, 0, 7);
    g.stroke();
    g.restore();
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(HALL_R + 4, 64),
    new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.5,
      metalness: 0.15,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  hall.add(floor);

  const wallTex = canvasTex(1024, 256, (g, w, h) => {
    g.fillStyle = "#22345c";
    g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 128) {
      g.fillStyle = "#182747";
      g.beginPath();
      g.moveTo(x + 16, h - 58);
      g.lineTo(x + 16, h - 140);
      g.quadraticCurveTo(x + 16, h - 196, x + 64, h - 206);
      g.quadraticCurveTo(x + 112, h - 196, x + 112, h - 140);
      g.lineTo(x + 112, h - 58);
      g.closePath();
      g.fill();
      g.strokeStyle = "#d4a017";
      g.lineWidth = 3;
      g.stroke();
      g.fillStyle = "rgba(212,160,23,.45)";
      g.beginPath();
      g.arc(x + 64, h - 120, 8, 0, 7);
      g.fill();
    }
    g.fillStyle = "#2a3f6e";
    g.fillRect(0, h - 58, w, 58);
    g.strokeStyle = "rgba(212,160,23,.6)";
    g.lineWidth = 2;
    for (let x = 0; x < w; x += 32) {
      g.beginPath();
      g.moveTo(x, h - 29);
      g.lineTo(x + 16, h - 45);
      g.lineTo(x + 32, h - 29);
      g.lineTo(x + 16, h - 13);
      g.closePath();
      g.stroke();
    }
    g.strokeStyle = "#d4a017";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(0, 8);
    g.lineTo(w, 8);
    g.stroke();
    g.beginPath();
    g.moveTo(0, h - 60);
    g.lineTo(w, h - 60);
    g.stroke();
  });
  wallTex.wrapS = THREE.RepeatWrapping;
  wallTex.repeat.set(6, 1);
  const walls = new THREE.Mesh(
    new THREE.CylinderGeometry(HALL_R + 4, HALL_R + 4, 13, 48, 1, true),
    new THREE.MeshStandardMaterial({
      map: wallTex,
      side: THREE.BackSide,
      roughness: 0.85,
    })
  );
  walls.position.y = 6.5;
  hall.add(walls);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(HALL_R + 4, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      map: domeTex,
      side: THREE.BackSide,
      roughness: 0.9,
    })
  );
  dome.position.y = 13;
  hall.add(dome);
  const oculus = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.35, 12, 40),
    new THREE.MeshStandardMaterial({
      color: 0xd4a017,
      emissive: 0xd4a017,
      emissiveIntensity: 1.4,
    })
  );
  oculus.rotation.x = Math.PI / 2;
  oculus.position.y = 41.5;
  hall.add(oculus);
  const shaft = new THREE.Mesh(
    new THREE.ConeGeometry(5, 34, 24, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffe9b8,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  shaft.position.y = 23;
  hall.add(shaft);

  // Central medallion with the museum mark.
  const ped = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 2, 1.1, 24),
    new THREE.MeshStandardMaterial({ color: 0x8a6f4d, roughness: 0.7 })
  );
  ped.position.y = 0.55;
  ped.castShadow = ped.receiveShadow = true;
  hall.add(ped);
  const medalSide = new THREE.MeshStandardMaterial({
    color: 0xd4a017,
    metalness: 0.85,
    roughness: 0.3,
  });
  const medalFace = new THREE.MeshStandardMaterial({
    color: 0xf5f2e8,
    roughness: 0.55,
  });
  const medal = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.35, 48), [
    medalSide,
    medalFace,
    medalFace,
  ]);
  medal.position.y = 3.3;
  medal.castShadow = true;
  hall.add(medal);
  loadLogoTexture((tex) => {
    medalFace.map = tex;
    medalFace.needsUpdate = true;
  });
  const hallTitle = textSprite(t.brand_name || "Museum", { px: 72 });
  hallTitle.position.y = 6.4;
  hall.add(hallTitle);

  // Golden dust.
  const pGeo = new THREE.BufferGeometry();
  const pCount = 260;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 52;
    pPos[i * 3 + 1] = Math.random() * 14 + 1;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 52;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const dust = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xf5d67b,
      size: 0.09,
      transparent: true,
      opacity: 0.55,
    })
  );
  hall.add(dust);

  /* ---------------- the nine wing portals ---------------- */
  const portalGroup = new THREE.Group();
  hall.add(portalGroup);
  WINGS.forEach((w, i) => {
    const a = (i / WINGS.length) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * (HALL_R - 1.5);
    const z = Math.sin(a) * (HALL_R - 1.5);
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.lookAt(0, 0, 0);
    const frame = new THREE.Mesh(pointedArchFrame(6.6, 8.8, 1.1, 2.4), stoneMat);
    frame.castShadow = true;
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(4.1, 6.6),
      new THREE.MeshStandardMaterial({
        map: girihTex,
        color: w.color,
        emissive: w.color,
        emissiveIntensity: 0.32,
        emissiveMap: girihTex,
      })
    );
    door.position.y = 3.4;
    const label = textSprite(wingTitle(w.id), { px: 60 });
    label.position.y = 8.9;
    g.add(frame, door, label);
    portalGroup.add(g);
    interact.push({ obj: door, kind: "portal", wing: w, group: g });
  });

  /* ---------------- columns + muqarnas cornice ---------------- */
  {
    const colGeo = new THREE.CylinderGeometry(0.55, 0.68, 9, 12);
    const capGeo = new THREE.BoxGeometry(1.8, 0.55, 1.8);
    const baseGeo = new THREE.BoxGeometry(1.7, 0.5, 1.7);
    for (let i = 0; i < 9; i++) {
      const a = ((i + 0.5) / 9) * Math.PI * 2 + Math.PI / 2;
      const x = Math.cos(a) * (HALL_R - 1.5);
      const z = Math.sin(a) * (HALL_R - 1.5);
      const col = new THREE.Mesh(colGeo, stoneMat);
      col.position.set(x, 4.5, z);
      col.castShadow = true;
      hall.add(col);
      const cap = new THREE.Mesh(capGeo, stoneMat);
      cap.position.set(x, 9.2, z);
      hall.add(cap);
      const bs = new THREE.Mesh(baseGeo, stoneMat);
      bs.position.set(x, 0.25, z);
      hall.add(bs);
    }
    for (let i = 0; i < 3; i++) {
      const r = HALL_R + 4 - i * 1.4;
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r - 1.4, 1.1, 48, 1, true),
        new THREE.MeshStandardMaterial({
          color: i % 2 ? 0x8a6f4d : 0x9a7f58,
          side: THREE.DoubleSide,
          roughness: 0.8,
        })
      );
      ring.position.y = 12.4 - i * 1.05;
      hall.add(ring);
    }
  }

  /* ---------------- the objects gallery (one wing, 3D) ---------------- */
  const gallery = new THREE.Group();
  gallery.visible = false;
  scene.add(gallery);
  const G_W = 34;
  const G_D = 20;
  const G_H = 8;
  {
    const gf = new THREE.Mesh(
      new THREE.PlaneGeometry(G_W, G_D),
      new THREE.MeshStandardMaterial({ color: 0x2b3a58, roughness: 0.6 })
    );
    gf.rotation.x = -Math.PI / 2;
    gf.receiveShadow = true;
    gallery.add(gf);
    const wallM = new THREE.MeshStandardMaterial({
      color: 0x24345a,
      roughness: 0.9,
    });
    const mkWall = (
      w: number,
      h: number,
      x: number,
      y: number,
      z: number,
      ry: number
    ): void => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallM);
      m.position.set(x, y, z);
      m.rotation.y = ry;
      gallery.add(m);
    };
    mkWall(G_W, G_H, 0, G_H / 2, -G_D / 2, 0);
    mkWall(G_W, G_H, 0, G_H / 2, G_D / 2, Math.PI);
    mkWall(G_D, G_H, -G_W / 2, G_H / 2, 0, Math.PI / 2);
    mkWall(G_D, G_H, G_W / 2, G_H / 2, 0, -Math.PI / 2);
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(G_W, G_D),
      new THREE.MeshStandardMaterial({ color: 0x182442 })
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = G_H;
    gallery.add(ceil);
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(G_W, 0.3, G_D),
      new THREE.MeshStandardMaterial({
        color: 0xd4a017,
        emissive: 0x6b4d08,
        emissiveIntensity: 0.4,
      })
    );
    trim.position.y = G_H - 0.4;
    gallery.add(trim);
    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 7.4),
      new THREE.MeshStandardMaterial({
        color: 0x0e1830,
        emissive: 0xd4a017,
        emissiveIntensity: 0.25,
      })
    );
    back.position.set(0, 3.7, G_D / 2 - 0.05);
    back.rotation.y = Math.PI;
    gallery.add(back);
    const bl = textSprite(t.gallery_back || "Back", { px: 54 });
    bl.position.set(0, 8.4, G_D / 2 - 0.1);
    bl.rotation.y = Math.PI;
    gallery.add(bl);
    interact.push({ obj: back, kind: "back" });
  }

  function buildAstrolabe(): THREE.Object3D {
    const g = new THREE.Group();
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 10, 32), brass);
    g.add(r1);
    const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 8, 28), brass);
    g.add(r2);
    const bar1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.05), brass);
    g.add(bar1);
    const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.0, 0.05), brass);
    g.add(bar2);
    const top = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), brass);
    top.position.y = 0.72;
    g.add(top);
    g.rotation.x = -0.35;
    return g;
  }
  function buildManuscript(): THREE.Object3D {
    const g = new THREE.Group();
    const pg = new THREE.BoxGeometry(0.62, 0.03, 0.85);
    const l = new THREE.Mesh(pg, creamM);
    l.position.x = -0.3;
    l.rotation.z = 0.18;
    const r = new THREE.Mesh(pg, creamM);
    r.position.x = 0.3;
    r.rotation.z = -0.18;
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(1.34, 0.025, 0.92),
      new THREE.MeshStandardMaterial({ color: 0x7a2f2f, roughness: 0.6 })
    );
    cover.position.y = -0.05;
    g.add(l, r, cover);
    return g;
  }
  function buildVase(): THREE.Object3D {
    const pts: Array<[number, number]> = [
      [0, 0],
      [0.34, 0.02],
      [0.42, 0.25],
      [0.3, 0.6],
      [0.2, 0.85],
      [0.24, 1.05],
      [0.34, 1.12],
    ];
    const v = new THREE.Mesh(
      new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p[0], p[1])), 28),
      new THREE.MeshStandardMaterial({
        color: 0x2e8b9a,
        roughness: 0.25,
        metalness: 0.1,
      })
    );
    v.position.y = -0.55;
    return v;
  }
  function buildDirham(): THREE.Object3D {
    const d = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.06, 28),
      new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.85, roughness: 0.3 })
    );
    d.rotation.x = Math.PI / 2;
    return d;
  }
  function buildLamp(): THREE.Object3D {
    const pts: Array<[number, number]> = [
      [0, 0],
      [0.3, 0.02],
      [0.4, 0.12],
      [0.34, 0.3],
      [0.16, 0.42],
      [0.2, 0.55],
      [0.1, 0.62],
    ];
    const l = new THREE.Mesh(
      new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p[0], p[1])), 24),
      new THREE.MeshStandardMaterial({
        color: 0x8a6a3a,
        metalness: 0.7,
        roughness: 0.45,
      })
    );
    l.position.y = -0.3;
    return l;
  }
  const exhibitBuilders: Record<string, () => THREE.Object3D> = {
    astrolabe: buildAstrolabe,
    manuscript: buildManuscript,
    vase: buildVase,
    dirham: buildDirham,
    lamp: buildLamp,
  };
  const pedMat = new THREE.MeshStandardMaterial({
    color: 0x6e5b3e,
    roughness: 0.7,
  });
  const EX_GAP = 6;
  EXHIBITS.forEach((ex, i) => {
    const x = (i - (EXHIBITS.length - 1) / 2) * EX_GAP;
    ex.x = x;
    const p = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.05, 1.2, 20),
      pedMat
    );
    p.position.set(x, 0.6, -2);
    p.castShadow = p.receiveShadow = true;
    gallery.add(p);
    const art = exhibitBuilders[ex.build]();
    art.position.set(x, 2.15, -2);
    art.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true;
    });
    gallery.add(art);
    ex.spinObj = art;
    const label = textSprite(ex.label, { px: 56 });
    label.position.set(x, 3.35, -2);
    gallery.add(label);
    const hit = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 2.6, 2.2),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hit.position.set(x, 2, -2);
    gallery.add(hit);
    interact.push({ obj: hit, kind: "exhibit", ex });
    const spot = new THREE.SpotLight(0xffe9b8, 60, 12, 0.5, 0.5);
    spot.position.set(x, 7.4, 1);
    spot.target.position.set(x, 1.6, -2);
    gallery.add(spot, spot.target);
  });

  /* ---------------- time journeys: imagined scenes ----------------
     Architecture and places only — no depictions of people.        */
  function starsSky(n: number, r: number): THREE.Points {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const e = (Math.random() * Math.PI) / 2.4 + 0.08;
      pos[i * 3] = Math.cos(a) * Math.cos(e) * r;
      pos[i * 3 + 1] = Math.sin(e) * r;
      pos[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(
      g,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.8,
        transparent: true,
        opacity: 0.9,
        fog: false,
      })
    );
  }
  function skyDome(top: string, bottom: string): THREE.Mesh {
    const tex = canvasTex(16, 256, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, top);
      gr.addColorStop(1, bottom);
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    });
    return new THREE.Mesh(
      new THREE.SphereGeometry(130, 24, 16),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false })
    );
  }
  function groundDisc(r: number, color: number): THREE.Mesh {
    const m = new THREE.Mesh(
      new THREE.CircleGeometry(r, 44),
      new THREE.MeshStandardMaterial({ color, roughness: 0.95 })
    );
    m.rotation.x = -Math.PI / 2;
    m.receiveShadow = true;
    return m;
  }
  function minaret(h: number, r: number, color?: number): THREE.Group {
    const g = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({
      color: color || 0xcfc0a0,
      roughness: 0.8,
    });
    const shaftM = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.68, r, h, 10),
      m
    );
    shaftM.position.y = h / 2;
    g.add(shaftM);
    const balc = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 1.6, r * 1.6, 0.5, 10),
      m
    );
    balc.position.y = h * 0.7;
    g.add(balc);
    const top = new THREE.Mesh(
      new THREE.ConeGeometry(r * 1.15, 2.6, 10),
      new THREE.MeshStandardMaterial({ color: 0x2e6f8e, roughness: 0.6 })
    );
    top.position.y = h + 1.5;
    g.add(top);
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true;
    });
    return g;
  }
  function domeOn(r: number, color?: number): THREE.Mesh {
    const d = new THREE.Mesh(
      new THREE.SphereGeometry(r, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: color || 0x8fa3b8,
        roughness: 0.5,
      })
    );
    d.castShadow = true;
    return d;
  }
  function palmTree(h: number): THREE.Group {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.19, h, 8),
      new THREE.MeshStandardMaterial({ color: 0x7a5a36, roughness: 0.9 })
    );
    trunk.position.y = h / 2;
    trunk.castShadow = true;
    g.add(trunk);
    const fm = new THREE.MeshStandardMaterial({
      color: 0x3f7a3a,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    for (let i = 0; i < 7; i++) {
      const f = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 2.4), fm);
      const a = (i / 7) * Math.PI * 2;
      f.position.set(Math.cos(a) * 0.95, h + 0.35, Math.sin(a) * 0.95);
      f.rotation.set(0.75, a, 0);
      g.add(f);
    }
    return g;
  }

  interface JourneyScene {
    group: THREE.Group;
    fog?: [number, number, number];
    sun?: number;
    hemi?: number;
  }
  const JOURNEY_BUILDERS: Record<string, () => JourneyScene> = {
    hira() {
      const g = new THREE.Group();
      g.add(skyDome("#040718", "#0e1c44"));
      g.add(starsSky(600, 110));
      g.add(groundDisc(80, 0x241c12));
      const moon = new THREE.Mesh(
        new THREE.CircleGeometry(3.2, 28),
        new THREE.MeshBasicMaterial({ color: 0xf5f0d8, fog: false })
      );
      moon.position.set(-34, 46, -80);
      moon.lookAt(0, 2, 14);
      g.add(moon);
      const mGeo = new THREE.ConeGeometry(21, 30, 9, 3);
      const pa = mGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pa.count; i++) {
        pa.setX(i, pa.getX(i) * (1 + (Math.random() - 0.5) * 0.3));
        pa.setZ(i, pa.getZ(i) * (1 + (Math.random() - 0.5) * 0.3));
      }
      mGeo.computeVertexNormals();
      const mountain = new THREE.Mesh(
        mGeo,
        new THREE.MeshStandardMaterial({
          color: 0x4a3d2e,
          roughness: 1,
          flatShading: true,
        })
      );
      mountain.position.set(0, 8, -30);
      mountain.castShadow = true;
      g.add(mountain);
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 6.4),
        new THREE.MeshBasicMaterial({
          color: 0xd4a017,
          transparent: true,
          opacity: 0.16,
          fog: false,
        })
      );
      glow.position.set(0, 10.5, -21.2);
      g.add(glow);
      const cave = new THREE.Mesh(
        new THREE.PlaneGeometry(4.2, 5.6),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      );
      cave.position.set(0, 10.5, -21.0);
      g.add(cave);
      return { group: g, fog: [0x0a1024, 25, 110], sun: 0.12, hemi: 0.18 };
    },
    madinah() {
      const g = new THREE.Group();
      g.add(skyDome("#6fa8dc", "#efe0b8"));
      g.add(groundDisc(70, 0xb99a68));
      const trunkM = new THREE.MeshStandardMaterial({
        color: 0x6e5233,
        roughness: 0.9,
      });
      for (let ix = -1; ix <= 1; ix++)
        for (let iz = 0; iz < 2; iz++) {
          const tr = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.24, 4.6, 8),
            trunkM
          );
          tr.position.set(ix * 4.5, 2.3, -8 - iz * 5);
          tr.castShadow = true;
          g.add(tr);
        }
      const roofM = new THREE.MeshStandardMaterial({
        color: 0x4a7a3f,
        roughness: 0.9,
        side: THREE.DoubleSide,
      });
      for (let i = 0; i < 5; i++) {
        const r = new THREE.Mesh(new THREE.PlaneGeometry(15, 2.6), roofM);
        r.rotation.x = -Math.PI / 2 + 0.06;
        r.position.set(0, 4.75, -11 + i * 2.4);
        g.add(r);
      }
      const wallM = new THREE.MeshStandardMaterial({
        color: 0xa8895c,
        roughness: 0.95,
      });
      const wl = new THREE.Mesh(new THREE.BoxGeometry(16, 1.6, 0.6), wallM);
      wl.position.set(0, 0.8, -2);
      wl.castShadow = true;
      g.add(wl);
      for (let i = -2; i <= 2; i++) {
        const p = palmTree(5);
        p.position.set(i * 7, 0, 8);
        g.add(p);
      }
      return { group: g, fog: [0xd8c9a0, 35, 120], sun: 1.25, hemi: 0.6 };
    },
    baghdad() {
      const g = new THREE.Group();
      g.add(skyDome("#5f9fd6", "#f2e3bb"));
      g.add(groundDisc(80, 0xcbb37f));
      const wallM = new THREE.MeshStandardMaterial({
        color: 0xc7a86b,
        roughness: 0.9,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(30, 30, 7, 40, 1, true),
        wallM
      );
      ring.position.set(0, 3.5, -14);
      g.add(ring);
      const gate = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 6.4),
        new THREE.MeshStandardMaterial({ color: 0x2a2118 })
      );
      gate.position.set(0, 3.2, 16.2);
      gate.rotation.y = Math.PI;
      g.add(gate);
      const palace = new THREE.Mesh(
        new THREE.CylinderGeometry(6, 7, 9, 16),
        new THREE.MeshStandardMaterial({ color: 0xd8c092, roughness: 0.8 })
      );
      palace.position.set(0, 4.5, -14);
      palace.castShadow = true;
      g.add(palace);
      const domeB = domeOn(6.5, 0x3f8f6a);
      domeB.position.set(0, 9, -14);
      g.add(domeB);
      const fin = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 10, 8),
        goldM
      );
      fin.position.set(0, 16.4, -14);
      g.add(fin);
      const river = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 90),
        new THREE.MeshStandardMaterial({
          color: 0x3f7fc0,
          roughness: 0.25,
          metalness: 0.35,
        })
      );
      river.rotation.x = -Math.PI / 2;
      river.position.set(26, 0.03, -10);
      g.add(river);
      const gm = new THREE.MeshStandardMaterial({
        color: 0x4a8a44,
        roughness: 0.9,
      });
      for (let i = 0; i < 8; i++) {
        const tr = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.4, 8), gm);
        tr.position.set(-24 + (i % 4) * 5, 1.7, 2 + Math.floor(i / 4) * 6);
        tr.castShadow = true;
        g.add(tr);
      }
      return { group: g, fog: [0xe3d3a8, 40, 130], sun: 1.3, hemi: 0.6 };
    },
    cordoba() {
      const g = new THREE.Group();
      g.add(groundDisc(60, 0x8a7a5c));
      const stripeTex = canvasTex(256, 64, (gg, w, hh) => {
        for (let x = 0; x < w; x += 32) {
          gg.fillStyle = x / 32 % 2 ? "#f3e9d2" : "#a03a2e";
          gg.fillRect(x, 0, 32, hh);
        }
      });
      const colM = new THREE.MeshStandardMaterial({
        color: 0xd9cbb0,
        roughness: 0.7,
      });
      const archM = new THREE.MeshStandardMaterial({
        map: stripeTex,
        roughness: 0.8,
      });
      for (let ix = 0; ix < 5; ix++)
        for (let iz = 0; iz < 4; iz++) {
          const c = new THREE.Mesh(
            new THREE.CylinderGeometry(0.55, 0.62, 7, 12),
            colM
          );
          c.position.set(-12 + ix * 6, 3.5, -24 + iz * 7);
          c.castShadow = true;
          g.add(c);
        }
      for (let iz = 0; iz < 4; iz++) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(27, 1.7, 1.2), archM);
        beam.position.set(0, 7.6, -24 + iz * 7);
        g.add(beam);
      }
      const ceil = new THREE.Mesh(
        new THREE.PlaneGeometry(44, 44),
        new THREE.MeshStandardMaterial({ color: 0x3a2c1c })
      );
      ceil.rotation.x = Math.PI / 2;
      ceil.position.y = 9.5;
      g.add(ceil);
      return { group: g, fog: [0x4a3a26, 12, 60], sun: 0.35, hemi: 0.3 };
    },
    cairo() {
      const g = new THREE.Group();
      g.add(skyDome("#2c3a6e", "#ef9a55"));
      g.add(groundDisc(80, 0xc9a06a));
      const sunDisc = new THREE.Mesh(
        new THREE.CircleGeometry(5, 28),
        new THREE.MeshBasicMaterial({ color: 0xffb347, fog: false })
      );
      sunDisc.position.set(-28, 13, -95);
      sunDisc.lookAt(0, 2, 14);
      g.add(sunDisc);
      const d1 = domeOn(4, 0x8a7a5c);
      d1.position.set(-10, 3, -32);
      g.add(d1);
      const d2 = domeOn(5.5, 0x9a8a68);
      d2.position.set(6, 3.5, -36);
      g.add(d2);
      const m1 = minaret(16, 0.9);
      m1.position.set(-18, 0, -30);
      g.add(m1);
      const m2 = minaret(19, 1);
      m2.position.set(14, 0, -33);
      g.add(m2);
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(30, 3, 8),
        new THREE.MeshStandardMaterial({ color: 0xb08a5a, roughness: 0.9 })
      );
      base.position.set(-2, 1.5, -34);
      g.add(base);
      return { group: g, fog: [0xd88a4e, 40, 130], sun: 0.8, hemi: 0.45 };
    },
    istanbul() {
      const g = new THREE.Group();
      g.add(skyDome("#1c2c5c", "#7fa3c7"));
      g.add(groundDisc(80, 0x9aa08a));
      const water = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 16),
        new THREE.MeshStandardMaterial({
          color: 0x2e5f8e,
          roughness: 0.2,
          metalness: 0.4,
        })
      );
      water.rotation.x = -Math.PI / 2;
      water.position.set(0, 0.04, -4);
      g.add(water);
      const plat = new THREE.Mesh(
        new THREE.BoxGeometry(34, 2, 24),
        new THREE.MeshStandardMaterial({ color: 0xbfae8e, roughness: 0.85 })
      );
      plat.position.set(0, 1, -28);
      plat.receiveShadow = true;
      g.add(plat);
      const drum = new THREE.Mesh(
        new THREE.CylinderGeometry(8.5, 8.5, 4, 20),
        new THREE.MeshStandardMaterial({ color: 0xcfc0a0, roughness: 0.8 })
      );
      drum.position.set(0, 8, -28);
      drum.castShadow = true;
      g.add(drum);
      const big = domeOn(8.5, 0x8fa3b8);
      big.position.set(0, 10, -28);
      g.add(big);
      [-1, 1].forEach((s) => {
        const half = new THREE.Mesh(
          new THREE.SphereGeometry(4.2, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshStandardMaterial({ color: 0x9db0c2, roughness: 0.6 })
        );
        half.position.set(s * 11.5, 6, -28);
        half.castShadow = true;
        g.add(half);
      });
      [
        [-15, -38],
        [15, -38],
        [-15, -18],
        [15, -18],
      ].forEach(([x, z]) => {
        const m = minaret(20, 0.8, 0xd8cba8);
        m.position.set(x, 2, z);
        g.add(m);
      });
      return { group: g, fog: [0x5a7396, 45, 140], sun: 0.7, hemi: 0.5 };
    },
    kaaba() {
      const g = new THREE.Group();
      g.add(skyDome("#5f9fd6", "#f5ecd4"));
      g.add(groundDisc(70, 0xe8e2d2));
      const kb = new THREE.Mesh(
        new THREE.BoxGeometry(7, 8, 7),
        new THREE.MeshStandardMaterial({ color: 0x0d0d0f, roughness: 0.55 })
      );
      kb.position.set(0, 4, -8);
      kb.castShadow = true;
      g.add(kb);
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(7.15, 1.1, 7.15),
        new THREE.MeshStandardMaterial({
          color: 0xd4a017,
          emissive: 0xd4a017,
          emissiveIntensity: 0.5,
          roughness: 0.4,
        })
      );
      band.position.set(0, 5.8, -8);
      g.add(band);
      const door = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 2.8),
        new THREE.MeshStandardMaterial({
          color: 0xd4a017,
          metalness: 0.8,
          roughness: 0.35,
        })
      );
      door.position.set(1.8, 2.4, -4.44);
      g.add(door);
      return { group: g, fog: [0xe8e0c8, 40, 130], sun: 1.25, hemi: 0.6 };
    },
  };

  /* ---------------- scene switching, panels, toast ---------------- */
  const fade = $("#fade");
  const locEl = $("#loc");
  const wingLabel = $("#wingLabel");
  const panel = $("#panel");
  const journeyPanel = $("#journeyPanel");
  const journeyCard = $("#journeyCard");

  let journeyGroup: THREE.Group | null = null;
  function clearJourney(): void {
    if (journeyGroup) {
      scene.remove(journeyGroup);
      journeyGroup = null;
    }
    fog.color.setHex(0x0d1b2e);
    fog.near = 30;
    fog.far = 95;
    sun.intensity = 1.15;
    hemi.intensity = 0.55;
    journeyCard.classList.remove("show");
  }

  type SceneName = "hall" | "gallery" | "journey";
  // Stop links: #objects, #objects/<exhibit>, #journey/<id>; the hall clears the hash.
  function setHash(h: string): void {
    try {
      history.replaceState(null, "", h ? `#${h}` : location.pathname + location.search);
    } catch {
      /* sandboxed or file: URL — links just don't update */
    }
  }
  function setScene(name: SceneName, ref?: Wing | JourneyView, stop?: number): void {
    fade.style.opacity = "1";
    window.setTimeout(
      () => {
        clearJourney();
        hall.visible = name === "hall";
        gallery.visible = name === "gallery";
        player.scene = name;
        player.target = null;
        closePanel(false);
        journeyCard.classList.remove("show");
        nearEx = null;
        stopIdx = -1;
        setHint(null);
        if (name === "hall") {
          setHash("");
          player.pos.set(0, 1.7, 16);
          player.yaw = 0;
          player.pitch = 0;
          locEl.textContent = t.loc_hall || "";
          wingLabel.textContent = t.hall_sub || "";
        } else if (name === "gallery" && ref && "color" in ref) {
          const wt = wingTitle(ref.id);
          player.pos.set(0, 1.7, 6);
          player.yaw = 0;
          player.pitch = 0;
          locEl.textContent = (t.gallery_hall || "{wing}").replace("{wing}", wt);
          wingLabel.textContent = (t.gallery_sub || "{wing}")
            .replace("{wing}", wt)
            .replace("{tour}", t.hall_sub || "");
          setHash(ref.id);
          if (stop !== undefined && EXHIBITS[stop]) placeAtStop(stop);
        } else if (name === "journey" && ref && "lines" in ref) {
          const builder = JOURNEY_BUILDERS[ref.build];
          if (!builder) return;
          const built = builder();
          journeyGroup = built.group;
          scene.add(journeyGroup);
          if (built.fog) {
            fog.color.setHex(built.fog[0]);
            fog.near = built.fog[1];
            fog.far = built.fog[2];
          }
          if (built.sun !== undefined) sun.intensity = built.sun;
          if (built.hemi !== undefined) hemi.intensity = built.hemi;
          setHash(`journey/${ref.id}`);
          player.pos.set(0, 1.7, 16);
          player.yaw = 0;
          player.pitch = 0;
          locEl.textContent = ref.title;
          wingLabel.textContent = t.journey_tag
            ? `${ref.sub} · ${t.journey_tag}`
            : ref.sub;
          $("#jTitle").textContent = ref.title;
          $("#jSub").textContent = ref.sub;
          const jLines = $("#jLines");
          jLines.textContent = "";
          // Narration comes from the page data — never hardcoded.
          for (const line of ref.lines) {
            const p = document.createElement("p");
            p.textContent = "✦ " + line;
            jLines.appendChild(p);
          }
          journeyCard.classList.add("show");
        }
        fade.style.opacity = "0";
      },
      REDUCED() ? 60 : 700
    );
  }

  let toastTimer = 0;
  function toast(html: { text: string; linkText: string; href: string }): void {
    const el = $("#toast");
    el.textContent = "";
    const span = document.createElement("span");
    span.textContent = html.text;
    const br = document.createElement("br");
    const a = document.createElement("a");
    a.href = html.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = html.linkText;
    el.append(span, br, a);
    el.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove("show"), 5000);
  }

  function enterPortal(wing: Wing): void {
    if (wing.id === "objects") {
      setScene("gallery", wing);
      return;
    }
    toast({
      text: (t.portal_toast || "{wing}").replace("{wing}", wingTitle(wing.id)),
      linkText: t.portal_explore || "",
      href: wingHref(wing.id),
    });
  }

  // Label card: one stop at a time, "n of N" with previous/next. Focus moves into
  // the card when it opens and returns to where it was when it closes.
  // Western digits, as the record dates use.
  const numFmt = { format: (n: number): string => String(n) };
  let stopIdx = -1;
  let panelReturn: HTMLElement | null = null;
  function showPanel(ex: Exhibit): void {
    stopIdx = EXHIBITS.indexOf(ex);
    $("#panelCount").textContent = (t.stop_of || "{n} / {total}")
      .replace("{n}", numFmt.format(stopIdx + 1))
      .replace("{total}", numFmt.format(EXHIBITS.length));
    $("#panelTitle").textContent = ex.label;
    $("#panelMeta").textContent = [ex.date, ex.material, ex.museum].filter(Boolean).join(" · ");
    $("#panelNote").textContent = ex.note || "";
    $("#panelDesc").textContent = ex.desc;
    ($<HTMLAnchorElement>("#panelLink")).href = ex.href;
    if (!panel.classList.contains("show")) {
      const active = document.activeElement as HTMLElement | null;
      panelReturn = active && active !== document.body && !panel.contains(active) ? active : null;
    }
    panel.classList.add("show");
    setHash(`objects/${ex.id}`);
    if (!panel.contains(document.activeElement)) $("#panelTitle").focus({ preventScroll: true });
  }
  function closePanel(restore = true): void {
    if (!panel.classList.contains("show")) return;
    panel.classList.remove("show");
    if (player.scene === "gallery") setHash("objects");
    if (restore && panel.contains(document.activeElement)) {
      (panelReturn && root.contains(panelReturn) ? panelReturn : renderer.domElement).focus({ preventScroll: true });
    }
    panelReturn = null;
  }
  // Stand in front of exhibit i and open its label.
  function placeAtStop(i: number): void {
    const n = EXHIBITS.length;
    const ex = EXHIBITS[((i % n) + n) % n];
    player.pos.set(ex.x, 1.7, 2.6);
    player.yaw = 0;
    player.pitch = 0;
    player.target = null;
    showPanel(ex);
  }
  function stepStop(delta: number): void {
    if (player.scene !== "gallery" || !EXHIBITS.length) return;
    placeAtStop(stopIdx < 0 ? (delta > 0 ? 0 : EXHIBITS.length - 1) : stopIdx + delta);
  }

  // Walking up to an exhibit offers its label (keyboard: Enter).
  const hintEl = $("#hint");
  const baseHint = (): string =>
    (document.body.classList.contains("touch") ? t.hint_touch : t.hint_desktop) || "";
  let nearEx: Exhibit | null = null;
  function setHint(ex: Exhibit | null): void {
    const touchUi = document.body.classList.contains("touch");
    hintEl.textContent = ex
      ? `${ex.label} · ${(touchUi ? t.near_prompt_touch : t.near_prompt) || ""}`
      : baseHint();
  }

  const helpPanel = $("#helpPanel");
  let helpReturn: HTMLElement | null = null;
  function openHelp(): void {
    helpReturn = document.activeElement as HTMLElement | null;
    helpPanel.classList.add("show");
    requestAnimationFrame(() => $("#helpTitle").focus({ preventScroll: true }));
  }
  function closeHelp(): void {
    if (!helpPanel.classList.contains("show")) return;
    helpPanel.classList.remove("show");
    (helpReturn && root.contains(helpReturn) ? helpReturn : $("#helpBtn")).focus({ preventScroll: true });
    helpReturn = null;
  }

  /* ---------------- journey chooser ---------------- */
  function startJourney(j: JourneyView): void {
    journeyPanel.classList.remove("show");
    setScene("journey", j);
  }
  {
    // Journey kinds are Arabic in tour/journeys.yaml: حدث | مكان | زمن.
    const KIND_ORDER = ["حدث", "مكان", "زمن"];
    const KIND_LABEL: Record<string, string> = {
      "حدث": t.kind_event || "Events",
      "مكان": t.kind_place || "Places",
      "زمن": t.kind_time || "Eras",
    };
    const wrap = $("#journeyChips");
    wrap.textContent = ""; // rebuild cleanly if the visitor exits and re-enters
    for (const k of KIND_ORDER) {
      const js = data.journeys.filter((j) => j.kind === k);
      if (!js.length) continue;
      const h3 = document.createElement("h3");
      h3.textContent = KIND_LABEL[k];
      wrap.appendChild(h3);
      const div = document.createElement("div");
      div.className = "jchips";
      for (const j of js) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "jchip";
        const nm = document.createElement("span");
        nm.textContent = j.title;
        const small = document.createElement("small");
        small.textContent = j.sub;
        b.append(nm, small);
        b.addEventListener("click", () => startJourney(j));
        div.appendChild(b);
      }
      wrap.appendChild(div);
    }
  }

  /* ---------------- player: keyboard + drag + touch + tap ---------------- */
  const player: {
    pos: THREE.Vector3;
    yaw: number;
    pitch: number;
    target: THREE.Vector3 | null;
    scene: SceneName;
  } = {
    pos: new THREE.Vector3(0, 1.7, 16),
    yaw: 0,
    pitch: 0,
    target: null,
    scene: "hall",
  };
  const keys: Record<string, boolean> = {};

  listen(window, "keydown", ((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      // Escape closes open panels — focus is never trapped.
      if (helpPanel.classList.contains("show")) {
        closeHelp();
        return;
      }
      if (panel.classList.contains("show")) {
        closePanel();
        return;
      }
      if (journeyPanel.classList.contains("show")) {
        journeyPanel.classList.remove("show");
        return;
      }
      if (journeyCard.classList.contains("show")) {
        setScene("hall");
        return;
      }
      return;
    }
    const onControl = !!(e.target as HTMLElement | null)?.closest?.("button, a, input, select, textarea");
    if (player.scene === "gallery" && !e.altKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === "]") return stepStop(1);
      if (e.key === "[") return stepStop(-1);
      const digit = /^Digit([1-9])$/.exec(e.code);
      if (digit && Number(digit[1]) <= EXHIBITS.length) return placeAtStop(Number(digit[1]) - 1);
      if (e.key === "Enter" && !onControl && nearEx) {
        e.preventDefault();
        return showPanel(nearEx);
      }
    }
    if (onControl && (e.code === "Space" || e.key === "Enter")) return;
    keys[e.code] = true;
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
        e.code
      )
    ) {
      e.preventDefault();
    }
    player.target = null;
  }) as EventListener);
  listen(window, "keyup", ((e: KeyboardEvent) => {
    keys[e.code] = false;
  }) as EventListener);

  // Drag-to-look (mouse + touch).
  let dragging = false;
  let px = 0;
  let py = 0;
  let downT = 0;
  let moved = 0;
  const cvs = renderer.domElement;
  cvs.style.touchAction = "none";
  cvs.addEventListener(
    "pointerdown",
    (e) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
      downT = performance.now();
      moved = 0;
    },
    { passive: true }
  );
  listen(window, "pointermove", ((e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - px;
    const dy = e.clientY - py;
    moved += Math.abs(dx) + Math.abs(dy);
    px = e.clientX;
    py = e.clientY;
    if (e.pointerType === "touch" && joyActive) return; // joystick owns movement
    player.yaw -= dx * 0.0032;
    player.pitch = Math.max(
      -1.25,
      Math.min(1.25, player.pitch - dy * 0.0032)
    );
  }) as EventListener);
  listen(window, "pointerup", ((e: PointerEvent) => {
    const wasTap = dragging && moved < 8 && performance.now() - downT < 350;
    dragging = false;
    if (wasTap && e.target === cvs) handleTap(e.clientX, e.clientY);
  }) as EventListener);

  // Touch joystick.
  let joyActive = false;
  const joyVec = { x: 0, y: 0 };
  const joy = $("#joy");
  const knob = $("#joyKnob");
  function joyMove(e: PointerEvent): void {
    const r = joy.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const m = Math.hypot(dx, dy);
    const max = r.width / 2 - 10;
    if (m > max) {
      dx *= max / m;
      dy *= max / m;
    }
    knob.style.transform = `translate(${dx}px,${dy}px)`;
    joyVec.x = dx / max;
    joyVec.y = dy / max;
    player.target = null;
  }
  const joyEnd = (): void => {
    joyActive = false;
    joyVec.x = joyVec.y = 0;
    knob.style.transform = "translate(0px,0px)";
  };
  listen(joy, "pointerdown", ((e: PointerEvent) => {
    joyActive = true;
    try {
      joy.setPointerCapture(e.pointerId);
    } catch {
      /* pointer capture unsupported */
    }
    joyMove(e);
  }) as EventListener);
  listen(joy, "pointermove", ((e: PointerEvent) => {
    if (joyActive) joyMove(e);
  }) as EventListener);
  listen(joy, "pointerup", joyEnd as EventListener);
  listen(joy, "pointercancel", joyEnd as EventListener);

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function handleTap(x: number, y: number): void {
    ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const targets = interact
      .filter((i) =>
        player.scene === "hall"
          ? i.kind === "portal"
          : i.kind === "exhibit" || i.kind === "back"
      )
      .map((i) => i.obj);
    const hits = ray.intersectObjects(targets, false);
    if (hits.length) {
      const it = interact.find((i) => i.obj === hits[0].object);
      if (it?.kind === "portal") return enterPortal(it.wing);
      if (it?.kind === "exhibit") return showPanel(it.ex);
      if (it?.kind === "back") return setScene("hall");
    }
    // Smooth walk to the tapped floor point.
    const pt = new THREE.Vector3();
    if (ray.ray.intersectPlane(floorPlane, pt)) {
      if (player.scene === "hall") {
        const lim = HALL_R - 2;
        const r = Math.hypot(pt.x, pt.z);
        if (r > lim) {
          pt.multiplyScalar(lim / r);
          pt.y = 0;
        }
      } else if (player.scene === "gallery") {
        pt.x = Math.max(-G_W / 2 + 1.5, Math.min(G_W / 2 - 1.5, pt.x));
        pt.z = Math.max(-G_D / 2 + 1.5, Math.min(G_D / 2 - 1.5, pt.z));
      } else {
        const r = Math.hypot(pt.x, pt.z);
        if (r > 21) {
          pt.x *= 21 / r;
          pt.z *= 21 / r;
        }
      }
      player.target = pt;
    }
  }

  function updatePlayer(dt: number): void {
    const fwd =
      (keys.KeyW || keys.ArrowUp ? 1 : 0) -
      (keys.KeyS || keys.ArrowDown ? 1 : 0) -
      joyVec.y;
    const str =
      (keys.KeyD || keys.ArrowRight ? 1 : 0) -
      (keys.KeyA || keys.ArrowLeft ? 1 : 0) +
      joyVec.x;
    const sp = 5.2;
    if (fwd || str) {
      player.target = null;
      const sin = Math.sin(player.yaw);
      const cos = Math.cos(player.yaw);
      player.pos.x += (-sin * fwd + cos * str) * sp * dt;
      player.pos.z += (-cos * fwd - sin * str) * sp * dt;
    } else if (player.target) {
      const d = new THREE.Vector3().subVectors(player.target, player.pos);
      d.y = 0;
      if (d.length() < 0.25) player.target = null;
      else {
        d.normalize();
        player.pos.addScaledVector(d, Math.min(sp * dt, d.length()));
      }
    }
    if (player.scene === "hall") {
      const r = Math.hypot(player.pos.x, player.pos.z);
      const max = HALL_R - 2.4;
      if (r > max) {
        player.pos.x *= max / r;
        player.pos.z *= max / r;
      }
      // Walk-through entry: stepping close to a portal enters it.
      const gp = new THREE.Vector3();
      for (const it of interact) {
        if (it.kind !== "portal") continue;
        it.group.getWorldPosition(gp);
        if (Math.hypot(player.pos.x - gp.x, player.pos.z - gp.z) < 2.2) {
          enterPortal(it.wing);
          break;
        }
      }
    } else if (player.scene === "gallery") {
      player.pos.x = Math.max(
        -G_W / 2 + 1.2,
        Math.min(G_W / 2 - 1.2, player.pos.x)
      );
      player.pos.z = Math.max(
        -G_D / 2 + 1.2,
        Math.min(G_D / 2 - 1.2, player.pos.z)
      );
      if (player.pos.z > G_D / 2 - 2.4 && Math.abs(player.pos.x) < 3)
        setScene("hall");
      let near: Exhibit | null = null;
      for (const ex of EXHIBITS) {
        if (Math.abs(player.pos.x - ex.x) < EX_GAP / 2 && player.pos.z < 4.5) near = ex;
      }
      if (near !== nearEx) {
        nearEx = near;
        setHint(near);
      }
    } else {
      const r = Math.hypot(player.pos.x, player.pos.z);
      const max = 21;
      if (r > max) {
        player.pos.x *= max / r;
        player.pos.z *= max / r;
      }
    }
    camera.position.copy(player.pos);
    camera.rotation.set(player.pitch, player.yaw, 0);
  }

  /* ---------------- panel / journey UI wiring ---------------- */
  listen($<HTMLButtonElement>("#panelClose"), "click", (() => closePanel()) as EventListener);
  listen($<HTMLButtonElement>("#panelPrev"), "click", (() => stepStop(-1)) as EventListener);
  listen($<HTMLButtonElement>("#panelNext"), "click", (() => stepStop(1)) as EventListener);
  listen($<HTMLButtonElement>("#helpBtn"), "click", (() =>
    helpPanel.classList.contains("show") ? closeHelp() : openHelp()) as EventListener);
  listen($<HTMLButtonElement>("#helpClose"), "click", (() => closeHelp()) as EventListener);
  listen($<HTMLButtonElement>("#journeyBtn"), "click", (() =>
    journeyPanel.classList.add("show")) as EventListener);
  listen($<HTMLButtonElement>("#journeyClose"), "click", (() =>
    journeyPanel.classList.remove("show")) as EventListener);
  listen($<HTMLButtonElement>("#jBack"), "click", (() =>
    setScene("hall")) as EventListener);

  listen(window, "resize", (() => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }) as EventListener);

  /* ---------------- animate ---------------- */
  const clock = new THREE.Clock();
  let raf = 0;
  let firstFrame = true;
  function animate(): void {
    raf = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const tsec = clock.elapsedTime;
    if (!REDUCED()) {
      medal.rotation.y = tsec * 0.35;
      medal.position.y = 3.3 + Math.sin(tsec * 1.2) * 0.15;
      dust.rotation.y = tsec * 0.012;
      EXHIBITS.forEach((ex, i) => {
        if (ex.spinObj) ex.spinObj.rotation.y = tsec * (0.4 + i * 0.08);
      });
      portalGroup.children.forEach((p, i) => {
        const door = p.children[1] as THREE.Mesh;
        const m = door.material as THREE.MeshStandardMaterial;
        m.emissiveIntensity = 0.3 + Math.sin(tsec * 2 + i) * 0.12;
      });
    }
    updatePlayer(dt);
    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      loading.style.display = "none";
      fade.style.opacity = "0";
    }
  }
  player.pos.set(0, 1.7, 16);
  player.yaw = 0;
  camera.position.copy(player.pos);
  camera.rotation.set(0, 0, 0);
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute("aria-label", t.canvas_label || "");
  animate();

  // Open at the stop named in the link, if any.
  {
    const [kind, id] = decodeURIComponent(location.hash.slice(1)).split("/");
    const objectsWing = WINGS.find((w) => w.id === "objects")!;
    if (kind === "objects") {
      const i = EXHIBITS.findIndex((e) => e.id === id);
      setScene("gallery", objectsWing, i >= 0 ? i : undefined);
    } else if (kind === "journey") {
      const j = data.journeys.find((x) => x.id === id);
      if (j) setScene("journey", j);
    }
  }

  /* ---------------- teardown (Exit button) ---------------- */
  let exited = false;
  function teardown(): void {
    if (exited) return;
    exited = true;
    cancelAnimationFrame(raf);
    cleanups.forEach((fn) => fn());
    // Free GPU resources so a later re-entry starts clean.
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh || (o as THREE.Sprite).isSprite) {
        (mesh as THREE.Mesh).geometry?.dispose();
        const mats = Array.isArray((o as THREE.Mesh).material)
          ? ((o as THREE.Mesh).material as THREE.Material[])
          : [((o as THREE.Mesh).material || (o as THREE.Sprite).material) as THREE.Material];
        mats.forEach((m) => {
          if (!m) return;
          const sm = m as THREE.MeshStandardMaterial;
          if (sm.map) sm.map.dispose();
          if (sm.emissiveMap) sm.emissiveMap.dispose();
          m.dispose();
        });
      }
    });
    try {
      renderer.dispose();
    } catch {
      /* already gone */
    }
    renderer.domElement.remove();
    journeyPanel.classList.remove("show");
    journeyCard.classList.remove("show");
    panel.classList.remove("show");
    helpPanel.classList.remove("show");
    $("#toast").classList.remove("show");
    enterCard.classList.remove("hide");
    enterBtn.disabled = false;
    enterBtn.focus();
  }

  return { teardown };
}
