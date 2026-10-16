// Surah map (thematic journey), browser side. A proportional "journey rail" (verse scrubber)
// drives an SVG mind-map of the surah's thematic sections; both stay in sync with the detail card.
// Data arrives as JSON in a script[type="application/json"] tag on the page.
interface Kid { t: string; a: number; b: number }
interface Sec { t: string; a: number; b: number; f: "faith" | "stories" | "law"; s: string; kids: Kid[] }
interface Payload {
  lang: string; total: number; name: string;
  families: Record<string, string>;
  colors: Record<string, string>;
  t: { journey: string; stop: string; close: string; prev: string; next: string; verse_n: string };
  sections: Sec[];
}
interface KidL extends Kid { _x: number; _y: number; _el?: SVGGElement }
interface SecL extends Sec { _x: number; _y: number; _el?: SVGGElement; _seg?: HTMLElement; _kids: KidL[] }

const NS = "http://www.w3.org/2000/svg";
const $ = (id: string) => document.getElementById(id)!;

for (const root of document.querySelectorAll<HTMLElement>("[data-surahmap]")) {
  const p: Payload = JSON.parse(root.querySelector("script[type='application/json']")!.textContent || "{}");
  const svg = root.querySelector<SVGSVGElement>("[data-map]")!;
  const rail = root.querySelector<HTMLElement>("[data-rail]")!;
  const handle = root.querySelector<HTMLElement>("[data-handle]")!;
  const card = root.querySelector<HTMLElement>("[data-card]")!;
  const vnum = root.querySelector<HTMLElement>("[data-vnum]")!;
  const vsec = root.querySelector<HTMLElement>("[data-vsec]")!;
  const playBtn = root.querySelector<HTMLButtonElement>("[data-play]")!;
  const TOTAL = p.total, W = 900;
  const secs = p.sections as SecL[];
  const loc = (n: number) => n.toLocaleString(p.lang === "ar" ? "ar-EG" : "en-GB");
  const el = (tag: string, attrs: Record<string, string | number>, text?: string) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    if (text !== undefined) e.textContent = text;
    return e;
  };

  /* ---------- layout ---------- */
  let y = 96;
  secs.forEach((s, i) => {
    s._x = i % 2 === 0 ? 645 : 255;
    s._y = y + 58;
    s._kids = (s.kids as KidL[]).map((k, j) => ({ ...k, _x: s._x + (s._x > 450 ? 30 : -30), _y: y + 58 + 56 + j * 54 }));
    y += 116 + s.kids.length * 54 + 14;
  });
  const H = y + 40;
  const gRoot = el("g", {});
  svg.appendChild(gRoot);
  const tg = el("g", { class: "jnode" });
  tg.appendChild(el("rect", { x: 450 - 170, y: 8, width: 340, height: 56, rx: 28, fill: "#c5a059" }));
  const tt = el("text", { x: 450, y: 43, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: "#0a2533" });
  tt.textContent = `${p.name} · ${loc(TOTAL)}`; tg.appendChild(tt); gRoot.appendChild(tg);
  gRoot.appendChild(el("path", { d: `M450 70 L450 ${H - 30}`, class: "jpath" }));
  secs.forEach((s, i) => {
    const c = p.colors[s.f], edge = s._x > 450 ? s._x - 120 : s._x + 120;
    gRoot.appendChild(el("path", { d: `M450 ${s._y} C 510 ${s._y}, ${edge + (s._x > 450 ? 40 : -40)} ${s._y}, ${edge} ${s._y}`, class: "jconn" }));
    const g = el("g", { class: "jnode", "data-i": i, tabindex: 0, role: "button", "aria-label": `${s.t} — ${loc(s.a)}–${loc(s.b)}` }) as unknown as SVGGElement;
    g.appendChild(el("rect", { x: s._x - 120, y: s._y - 32, width: 240, height: 64, rx: 32, stroke: c }));
    const t1 = el("text", { x: s._x, y: s._y - 4, "text-anchor": "middle", "font-size": 15, "font-weight": 600 }); t1.textContent = s.t; g.appendChild(t1);
    const t2 = el("text", { x: s._x, y: s._y + 18, "text-anchor": "middle", "font-size": 12, class: "rng" }); t2.textContent = `${loc(s.a)}–${loc(s.b)}`; g.appendChild(t2);
    g.addEventListener("click", (ev) => { ev.stopPropagation(); selectSection(i, true); });
    g.addEventListener("keydown", (ev) => { const ke = ev as KeyboardEvent; if (ke.key === "Enter" || ke.key === " ") { ev.preventDefault(); selectSection(i, true); } });
    gRoot.appendChild(g); s._el = g;
    s._kids.forEach((k) => {
      gRoot.appendChild(el("path", { d: `M${s._x} ${s._y + 32} Q ${s._x} ${k._y - 44}, ${k._x} ${k._y - 20}`, class: "jconn" }));
      const kg = el("g", { class: "jnode jchild" }) as unknown as SVGGElement;
      kg.appendChild(el("rect", { x: k._x - 90, y: k._y - 20, width: 180, height: 40, rx: 20, stroke: c, "stroke-width": 1.5 }));
      const kt = el("text", { x: k._x, y: k._y - 1, "text-anchor": "middle", "font-size": 12 }); kt.textContent = k.t; kg.appendChild(kt);
      const kr = el("text", { x: k._x, y: k._y + 14, "text-anchor": "middle", "font-size": 10.5, class: "rng" }); kr.textContent = k.a === k.b ? loc(k.a) : `${loc(k.a)}–${loc(k.b)}`; kg.appendChild(kr);
      kg.addEventListener("click", (ev) => { ev.stopPropagation(); flashKid(i, k); });
      gRoot.appendChild(kg); k._el = kg;
    });
  });
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  /* ---------- viewBox pan / zoom ---------- */
  let vb = { x: 0, y: 0, w: W, h: H };
  const applyVB = () => svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  const aspect = () => { const r = svg.getBoundingClientRect(); return r.height / r.width; };
  function fit() { const a = aspect(); let w = W, h = w * a; if (h > H) { h = H; w = h / a; } vb = { x: (W - w) / 2, y: 0, w, h }; applyVB(); }
  function clampVB() {
    vb.w = Math.min(900, Math.max(260, vb.w)); vb.h = vb.w * aspect();
    vb.x = Math.min(Math.max(vb.x, 0), W - vb.w); vb.y = Math.min(Math.max(vb.y, 0), H - vb.h);
  }
  function zoomAt(mx: number, my: number, f: number) {
    const r = svg.getBoundingClientRect(), px = vb.x + (mx / r.width) * vb.w, py = vb.y + (my / r.height) * vb.h, w2 = vb.w * f;
    vb.x = px - (px - vb.x) * (w2 / vb.w); vb.y = py - (py - vb.y) * (w2 / vb.w); vb.w = w2; clampVB(); applyVB();
  }
  svg.addEventListener("wheel", (e) => { e.preventDefault(); const r = svg.getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 0.85 : 1.18); }, { passive: false });
  let pan: { x: number; y: number } | null = null;
  svg.addEventListener("pointerdown", (e) => { if (e.target === svg) { pan = { x: e.clientX, y: e.clientY }; svg.classList.add("panning"); svg.setPointerCapture(e.pointerId); } stopPlay(); });
  svg.addEventListener("pointermove", (e) => { if (!pan) return; const r = svg.getBoundingClientRect(); vb.x -= (e.clientX - pan.x) * (vb.w / r.width); vb.y -= (e.clientY - pan.y) * (vb.h / r.height); pan = { x: e.clientX, y: e.clientY }; clampVB(); applyVB(); });
  svg.addEventListener("pointerup", () => { pan = null; svg.classList.remove("panning"); });
  root.querySelector("[data-zin]")!.addEventListener("click", () => { const r = svg.getBoundingClientRect(); zoomAt(r.width / 2, r.height / 2, 0.75); });
  root.querySelector("[data-zout]")!.addEventListener("click", () => { const r = svg.getBoundingClientRect(); zoomAt(r.width / 2, r.height / 2, 1.33); });
  root.querySelector("[data-zreset]")!.addEventListener("click", fit);
  function focusAt(cx: number, cy: number, w: number) {
    const w2 = Math.min(vb.w, w); vb.w = w2; vb.h = w2 * aspect();
    vb.x = Math.min(Math.max(cx - vb.w / 2, 0), W - vb.w);
    vb.y = Math.min(Math.max(cy - vb.h / 2, 0), H - vb.h); applyVB();
  }

  /* ---------- journey rail ---------- */
  secs.forEach((s, i) => {
    const d = document.createElement("div"); d.className = "rail-seg"; d.title = `${s.t} (${loc(s.a)}–${loc(s.b)})`;
    d.style.top = ((s.a - 1) / TOTAL) * 100 + "%";
    d.style.height = Math.max(((s.b - s.a + 1) / TOTAL) * 100, 0.9) + "%";
    (d.style as CSSStyleDeclaration).background = p.colors[s.f];
    d.addEventListener("click", (e) => { e.stopPropagation(); selectSection(i, true); stopPlay(); });
    rail.appendChild(d); s._seg = d;
  });
  const secOf = (v: number) => secs.findIndex((s) => v >= s.a && v <= s.b);
  let verse = 1;
  function paint() {
    const i = secOf(verse), s = secs[i];
    handle.style.top = ((verse - 1) / TOTAL) * 100 + "%";
    vnum.textContent = loc(verse); vsec.textContent = s.t;
    rail.setAttribute("aria-valuenow", String(verse));
    rail.setAttribute("aria-valuetext", p.t.verse_n.replace("{n}", loc(verse)) + " — " + s.t);
    secs.forEach((x, j) => { x._seg!.classList.toggle("active", j === i); x._el!.classList.toggle("active", j === i); });
  }
  function setVerse(v: number) { verse = Math.min(TOTAL, Math.max(1, Math.round(v))); paint(); }
  let railDrag = false;
  const verseAt = (e: PointerEvent) => { const r = rail.getBoundingClientRect(); return 1 + ((e.clientY - r.top) / r.height) * TOTAL; };
  rail.addEventListener("pointerdown", (e) => { railDrag = true; rail.setPointerCapture(e.pointerId); setVerse(verseAt(e)); stopPlay(); });
  rail.addEventListener("pointermove", (e) => { if (railDrag) setVerse(verseAt(e)); });
  rail.addEventListener("pointerup", () => { railDrag = false; });
  rail.addEventListener("keydown", (e) => {
    const ke = e as KeyboardEvent;
    if (ke.key === "ArrowUp" || ke.key === "ArrowDown") { e.preventDefault(); setVerse(verse + (ke.key === "ArrowUp" ? -1 : 1)); }
    if (ke.key === "PageUp" || ke.key === "PageDown") { e.preventDefault(); setVerse(verse + (ke.key === "PageUp" ? -10 : 10)); }
  });

  /* ---------- card ---------- */
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
  function showCard(i: number) {
    const s = secs[i], c = p.colors[s.f];
    card.innerHTML =
      `<button type="button" class="gx-close" aria-label="${esc(p.t.close)}">×</button>` +
      `<p class="gx-kicker"><span style="color:${c}">●</span> ${esc(p.families[s.f])} · ${loc(s.a)}–${loc(s.b)}</p>` +
      `<p class="gx-title">${esc(s.t)}</p><p class="gx-sum">${esc(s.s)}</p>` +
      (s.kids.length ? `<div class="gx-kids">${s.kids.map((k, j) => `<button type="button" class="kid" data-j="${j}">${esc(k.t)} · ${k.a === k.b ? loc(k.a) : loc(k.a) + "–" + loc(k.b)}</button>`).join("")}</div>` : "") +
      `<div class="gx-nav"><button type="button" data-nav="-1">→ ${esc(p.t.prev)}</button><button type="button" data-nav="1">${esc(p.t.next)} ←</button></div>`;
    card.hidden = false;
    card.querySelector(".gx-close")!.addEventListener("click", () => { card.hidden = true; });
    card.querySelectorAll(".kid").forEach((b) => b.addEventListener("click", () => flashKid(i, secs[i]._kids[+(b as HTMLElement).dataset.j!])));
    card.querySelectorAll("[data-nav]").forEach((b) => b.addEventListener("click", () => selectSection((i + +(b as HTMLElement).dataset.nav! + secs.length) % secs.length, true)));
  }
  function flashKid(i: number, k: KidL) {
    setVerse(k.a);
    k._el!.classList.add("active"); setTimeout(() => k._el!.classList.remove("active"), 1400);
    focusAt(k._x, k._y, 420);
    void i;
  }
  function selectSection(i: number, focus: boolean) { setVerse(secs[i].a); showCard(i); if (focus) focusAt(450, secs[i]._y, 620); }
  document.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Escape") card.hidden = true; });

  /* ---------- auto journey ---------- */
  let playTimer: number | null = null;
  function stopPlay() { if (playTimer) { clearInterval(playTimer); playTimer = null; playBtn.classList.remove("on"); playBtn.textContent = "▶ " + p.t.journey; } }
  playBtn.addEventListener("click", () => {
    if (playTimer) { stopPlay(); return; }
    playBtn.classList.add("on"); playBtn.textContent = "⏸ " + p.t.stop;
    let i = secOf(verse); selectSection(i, true);
    playTimer = window.setInterval(() => { i = (i + 1) % secs.length; selectSection(i, true); }, 2800);
  });

  /* ---------- init ---------- */
  fit(); window.addEventListener("resize", fit); setVerse(1);
  showCard(Math.min(5, secs.length - 1));
}
