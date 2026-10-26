// Studio: four client-side make-and-remix tools (girih tiles, calligraphy
// tracing, design-a-coin, manuscript page). Everything renders on <canvas>;
// export downloads a PNG/SVG locally. Nothing leaves the device or is stored remotely.

type Ctx = CanvasRenderingContext2D;

function canvas(id: string): HTMLCanvasElement | null {
  return document.getElementById(id) as HTMLCanvasElement | null;
}
function ctx2d(c: HTMLCanvasElement): Ctx | null {
  return c.getContext("2d");
}
function download(name: string, url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
function footer(c: Ctx, w: number, h: number, brand: string) {
  c.fillStyle = "#6b6b6b";
  c.font = "12px serif";
  c.textAlign = "center";
  c.fillText(brand, w / 2, h - 10);
}
function exportPNG(c: HTMLCanvasElement, name: string) {
  c.toBlob((b) => {
    if (!b) return;
    download(name, URL.createObjectURL(b));
  }, "image/png");
}

/* ---------- 1. Girih tile designer ---------- */

interface Poly { pts: [number, number][]; cx: number; cy: number; color: string; }

function starPolygon(cx: number, cy: number, r: number, points: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / points) * i - Math.PI / 2;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return pts;
}

function drawGirih(c: Ctx, polys: Poly[], strap: string) {
  c.fillStyle = "#faf6ee";
  c.fillRect(0, 0, 640, 640);
  for (const p of polys) {
    c.beginPath();
    p.pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    c.fillStyle = p.color;
    c.fill();
    c.strokeStyle = strap;
    c.lineWidth = 2;
    c.stroke();
  }
}

function girih() {
  const cv = canvas("studio-girih");
  if (!cv) return;
  const c = ctx2d(cv);
  if (!c) return;
  const brand = cv.dataset.brand || "islam.museum";
  const cols = 5, rows = 5, r = 66;
  const polys: Poly[] = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const cx = 64 + x * 128, cy = 64 + y * 128;
      const pts = starPolygon(cx, cy, r, y % 2 === x % 2 ? 10 : 8);
      polys.push({ pts, cx, cy, color: "#e8e0cd" });
    }
  const strapSel = document.getElementById("girih-strap") as HTMLSelectElement | null;
  const strap = () => strapSel?.value || "#8a6d3b";
  drawGirih(c, polys, strap());
  let color = "#2e6f8e";
  document.querySelectorAll<HTMLButtonElement>("[data-girih-color]").forEach((b) =>
    b.addEventListener("click", () => { color = b.dataset.girihColor || color; })
  );
  cv.addEventListener("pointerdown", (e) => {
    const rect = cv.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * cv.width;
    const y = ((e.clientY - rect.top) / rect.height) * cv.height;
    let best: Poly | null = null, bd = 1e9;
    for (const p of polys) {
      const d = (p.cx - x) ** 2 + (p.cy - y) ** 2;
      if (d < bd) { bd = d; best = p; }
    }
    if (best) { best.color = color; drawGirih(c, polys, strap()); }
  });
  // Keyboard: Tab-focus the canvas, arrows move the selection between tiles,
  // Enter/Space paints the selected tile with the current colour.
  let sel = 0;
  const highlight = () => {
    drawGirih(c, polys, strap());
    const p = polys[sel];
    c.beginPath();
    p.pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    c.strokeStyle = "#1f4e79";
    c.lineWidth = 4;
    c.stroke();
  };
  cv.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { sel = (sel + 1) % polys.length; highlight(); e.preventDefault(); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { sel = (sel - 1 + polys.length) % polys.length; highlight(); e.preventDefault(); }
    else if (e.key === "Enter" || e.key === " ") { polys[sel].color = color; highlight(); e.preventDefault(); }
  });
  cv.addEventListener("focus", highlight);
  cv.addEventListener("blur", () => drawGirih(c, polys, strap()));
  strapSel?.addEventListener("change", () => drawGirih(c, polys, strap()));
  document.getElementById("girih-clear")?.addEventListener("click", () => {
    polys.forEach((p) => (p.color = "#e8e0cd"));
    drawGirih(c, polys, strap());
  });
  document.getElementById("girih-png")?.addEventListener("click", () => {
    footer(c, cv.width, cv.height, brand);
    exportPNG(cv, "girih-tile.png");
    drawGirih(c, polys, strap());
  });
  document.getElementById("girih-svg")?.addEventListener("click", () => {
    const sw = strap();
    const parts = polys.map(
      (p) =>
        `<polygon points="${p.pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="${p.color}" stroke="${sw}" stroke-width="2"/>`
    );
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><rect width="640" height="640" fill="#faf6ee"/>${parts.join("")}<text x="320" y="632" text-anchor="middle" font-size="12" fill="#6b6b6b" font-family="serif">${brand}</text></svg>`;
    download("girih-tile.svg", URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })));
  });
}

/* ---------- 2. Calligraphy tracing ---------- */

function tracing() {
  const cv = canvas("studio-trace");
  if (!cv) return;
  const c = ctx2d(cv);
  if (!c) return;
  const wordSel = document.getElementById("trace-word") as HTMLSelectElement | null;
  const word = () => wordSel?.value || "بغداد";
  const base = () => {
    c.fillStyle = "#fdfbf5";
    c.fillRect(0, 0, cv.width, cv.height);
    c.fillStyle = "#d8d2c2";
    c.font = "150px 'Traditional Arabic','Amiri',serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.direction = "rtl";
    c.fillText(word(), cv.width / 2, cv.height / 2);
  };
  base();
  wordSel?.addEventListener("change", base);
  let drawing = false;
  const pos = (e: PointerEvent): [number, number] => {
    const r = cv.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * cv.width, ((e.clientY - r.top) / r.height) * cv.height];
  };
  cv.addEventListener("pointerdown", (e) => {
    drawing = true;
    const [x, y] = pos(e);
    c.beginPath();
    c.moveTo(x, y);
    cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const [x, y] = pos(e);
    c.strokeStyle = "#1f4e79";
    c.lineWidth = 6;
    c.lineCap = "round";
    c.lineTo(x, y);
    c.stroke();
  });
  ["pointerup", "pointerleave"].forEach((ev) =>
    cv.addEventListener(ev, () => { drawing = false; })
  );
  // Keyboard: arrows move a small pen; hold Space while pressing arrows to draw.
  let px = cv.width / 2, py = cv.height / 2, penDown = false;
  cv.addEventListener("keydown", (e) => {
    const step = 8;
    let moved = true;
    if (e.key === "ArrowLeft") px -= step;
    else if (e.key === "ArrowRight") px += step;
    else if (e.key === "ArrowUp") py -= step;
    else if (e.key === "ArrowDown") py += step;
    else if (e.key === " ") { penDown = !penDown; e.preventDefault(); return; }
    else moved = false;
    if (!moved) return;
    e.preventDefault();
    if (penDown) {
      c.strokeStyle = "#1f4e79";
      c.lineWidth = 6;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(px - (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0),
               py - (e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0));
      c.lineTo(px, py);
      c.stroke();
    }
  });
  const traceBrand = cv.dataset.brand || "islam.museum";
  document.getElementById("trace-clear")?.addEventListener("click", base);
  document.getElementById("trace-png")?.addEventListener("click", () => {
    footer(c, cv.width, cv.height, traceBrand);
    exportPNG(cv, "calligraphy-trace.png");
    base();
  });
}

/* ---------- 3. Design a coin ---------- */

function coin() {
  const cv = canvas("studio-coin");
  if (!cv) return;
  const c = ctx2d(cv);
  if (!c) return;
  const name = document.getElementById("coin-name") as HTMLInputElement | null;
  const date = document.getElementById("coin-date") as HTMLInputElement | null;
  const motif = document.getElementById("coin-motif") as HTMLSelectElement | null;
  const brand = cv.dataset.brand || "islam.museum";
  const draw = () => {
    const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2 - 10, R = 190;
    c.fillStyle = "#f3ead3";
    c.fillRect(0, 0, W, H);
    c.beginPath(); c.arc(cx, cy, R, 0, 7);
    c.fillStyle = "#e3c76a"; c.fill();
    c.lineWidth = 8; c.strokeStyle = "#a8862f"; c.stroke();
    c.beginPath(); c.arc(cx, cy, R - 22, 0, 7);
    c.lineWidth = 3; c.stroke();
    c.fillStyle = "#7a5a1e";
    const m = motif?.value || "star";
    if (m === "star") {
      const pts = starPolygon(cx, cy - 20, 70, 8);
      c.beginPath();
      pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
      c.closePath(); c.fill();
    } else if (m === "crescent") {
      c.beginPath(); c.arc(cx, cy - 20, 60, 0.6, 5.7); c.fill();
      c.fillStyle = "#e3c76a";
      c.beginPath(); c.arc(cx + 24, cy - 28, 52, 0, 7); c.fill();
      c.fillStyle = "#7a5a1e";
    } else {
      for (let i = 0; i < 6; i++) {
        c.save();
        c.translate(cx, cy - 20);
        c.rotate((Math.PI / 3) * i);
        c.fillRect(-6, -70, 12, 70);
        c.restore();
      }
    }
    c.font = "26px serif";
    c.textAlign = "center";
    c.fillText((name?.value || "").slice(0, 24), cx, cy + 92);
    c.font = "20px serif";
    c.fillText((date?.value || "").slice(0, 16), cx, cy + 124);
  };
  draw();
  [name, date].forEach((el) => el?.addEventListener("input", draw));
  motif?.addEventListener("change", draw);
  document.getElementById("coin-png")?.addEventListener("click", () => {
    footer(c, cv.width, cv.height, brand);
    exportPNG(cv, "my-coin.png");
    draw();
  });
}

/* ---------- 4. Manuscript page ---------- */

function manuscript() {
  const cv = canvas("studio-manuscript");
  if (!cv) return;
  const c = ctx2d(cv);
  if (!c) return;
  const name = document.getElementById("ms-name") as HTMLInputElement | null;
  const date = document.getElementById("ms-date") as HTMLInputElement | null;
  const border = document.getElementById("ms-border") as HTMLSelectElement | null;
  const brand = cv.dataset.brand || "islam.museum";
  const draw = () => {
    const W = cv.width, H = cv.height;
    c.fillStyle = "#f7efdc";
    c.fillRect(0, 0, W, H);
    const b = border?.value || "double";
    c.strokeStyle = "#8a6d3b";
    if (b === "double") {
      c.lineWidth = 6; c.strokeRect(24, 24, W - 48, H - 48);
      c.lineWidth = 2; c.strokeRect(40, 40, W - 80, H - 80);
    } else if (b === "zigzag") {
      c.lineWidth = 4; c.strokeRect(30, 30, W - 60, H - 60);
      c.save();
      // clip to the border ring only: outer rect minus the writing area
      c.beginPath();
      c.rect(30, 30, W - 60, H - 60);
      c.rect(58, 58, W - 116, H - 116);
      c.clip("evenodd");
      c.beginPath();
      for (let x = -H; x < W + H; x += 24) { c.moveTo(x, 0); c.lineTo(x + H, H); }
      c.strokeStyle = "#c9b37e"; c.lineWidth = 1.5; c.stroke();
      c.restore();
      c.strokeStyle = "#8a6d3b"; c.lineWidth = 4; c.strokeRect(30, 30, W - 60, H - 60);
      c.lineWidth = 2; c.strokeRect(58, 58, W - 116, H - 116);
    } else {
      // corners: geometric rosette in each corner
      c.lineWidth = 4; c.strokeRect(30, 30, W - 60, H - 60);
      for (const [px, py] of [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]] as const) {
        const pts = starPolygon(px, py, 34, 8);
        c.beginPath();
        pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
        c.closePath();
        c.fillStyle = "#c9b37e"; c.fill();
      }
    }
    c.fillStyle = "#3d3527";
    c.textAlign = "center";
    c.font = "italic 30px serif";
    c.fillText((name?.value || "").slice(0, 30), W / 2, H / 2 - 20);
    c.font = "22px serif";
    c.fillText((date?.value || "").slice(0, 16), W / 2, H / 2 + 24);
  };
  draw();
  [name, date].forEach((el) => el?.addEventListener("input", draw));
  border?.addEventListener("change", draw);
  document.getElementById("ms-png")?.addEventListener("click", () => {
    footer(c, cv.width, cv.height, brand);
    exportPNG(cv, "my-manuscript.png");
    draw();
  });
}

girih();
tracing();
coin();
manuscript();
