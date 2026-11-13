/* The Place wing map: behaviour (markup: site/src/components/PlaceMap.astro; styles: place-map.css; data:
   site/src/lib/place-map.ts through /<lang>/place-map/*.json). A plain file, not bundled, loaded by /<lang>/place/ only.

   The page already holds the map as SVG and the index of places, so nothing here is needed to read it. This script
   takes the same SVG over and adds: pan and zoom (drag, wheel, pinch, double click, keyboard), names on the map,
   search, the year bar, the panel, and the orbit of people and events around a place. It fetches same-origin static
   JSON only, stores nothing on the device, and calls no server code (docs/adr/0002).

   Levels: world → region → place → record. Each has a panel, a breadcrumb and a way back (Escape, the trail).
   `activityState`, `tierOf`, `shardOf` and `searchKey` repeat site/src/lib/place-map-core.ts and place-map.ts: keep them in step. */
(function () {
  "use strict";
  var root = document.getElementById("place-map"), cfgEl = document.getElementById("pm-config");
  if (!root || !cfgEl || !window.fetch || !window.PointerEvent || !window.ResizeObserver || !window.Intl) return;
  var C;
  try { C = JSON.parse(cfgEl.textContent); } catch (e) { return; }
  var VER = C.v ? "?v=" + C.v : "";
  var T = C.t, RTL = C.dir === "rtl", W = C.W, H = C.H, ELSE = C.regions.length - 1, K_MAX = 90, K_PLACE = 26;

  // ---------- small helpers ----------
  function q(sel, el) { return (el || root).querySelector(sel); }
  function h(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  // Text that may be in another language than the page (a name or a summary that fell back) takes its own direction.
  function auto(tag, cls, text) { var e = h(tag, cls, text); e.dir = "auto"; return e; }
  function svgEl(tag) { return document.createElementNS("http://www.w3.org/2000/svg", tag); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function tpl(s, map) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return map[k] != null ? map[k] : ""; }); }
  var nf = new Intl.NumberFormat(C.numLocale);
  function count(s, n) { return tpl(s, { n: nf.format(n) }); }
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  function icon(d, fill) { var s = svgEl("svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "pm-ico" + (fill ? " fill" : "")); s.setAttribute("aria-hidden", "true"); var p = svgEl("path"); p.setAttribute("d", d); s.appendChild(p); return s; }
  var ICON = { prev: "M15 5l-7 7 7 7", next: "M9 5l7 7-7 7", play: "M8 5.5v13l11-6.5z", pause: "M8 5h3v14H8zM13 5h3v14h-3z", full: "M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5", unfull: "M9 4v5H4M15 4v5h5M20 15h-5v5M4 15h5v5" };
  function searchKey(s) {
    return String(s).normalize("NFKD").replace(/[̀-ًͯ-ٰٟـ⁦-⁩]/g, "").replace(/[أإآٱ]/g, "ا").replace(/[ىی]/g, "ي").replace(/ة/g, "ه").replace(/ک/g, "ك").replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/['’ʿʾ`\-]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  }
  function shardOf(key) { var x = 0x811c9dc5; for (var i = 0; i < key.length; i++) { x ^= key.charCodeAt(i); x = Math.imul(x, 0x01000193); } var n = (x >>> 0) % C.shards; return (n < 16 ? "0" : "") + n.toString(16); }
  function activityState(iv, year) { if (!iv.length) return 0; if (year < iv[0]) return 1; for (var i = 0; i < iv.length; i += 2) if (year >= iv[i] && year <= iv[i + 1]) return 3; return 2; }
  function tierOf(n) { return n >= 30 ? 2 : n >= 3 ? 1 : 0; }
  function clsOf(id) { return id.slice(0, id.indexOf("/")); }
  function hrefOf(id) { return C.page + id + "/"; }

  // ---------- elements ----------
  var view = q(".pm-view"), svg = q(".pm-svg"), camEl = q(".pm-cam"), over = q(".pm-over"), links = q(".pm-links");
  var panel = q(".pm-panel"), body = q(".pm-panel-body"), panelTitle = q(".pm-panel-title"), panelToggle = q(".pm-panel-toggle");
  var crumbs = q(".pm-crumbs"), crumbList = q(".pm-crumbs ol"), input = q("#pm-q"), results = q("#pm-results");
  var slider = q("#pm-year"), yearOut = q(".pm-year"), playBtn = q(".pm-play"), tip = q(".pm-tip"), pop = q(".pm-pop"), statusEl = q(".pm-status"), fullBtn = q(".pm-fullbtn");
  var regionEls = [].slice.call(root.querySelectorAll(".pm-region"));
  var dotEls = [0, 1, 2].map(function (t) { return [0, 1, 2, 3].map(function (s) { return q(".pm-dot.t" + t + ".s" + s); }); });
  var haloEls = [0, 1, 2].map(function (t) { return q(".pm-halo.t" + t); });

  // ---------- state ----------
  var vw = 0, vh = 0, kMin = 0.5, kHome = 1.6;
  var cam = { k: 1, tx: 0, ty: 0 };
  var st = { level: "world", region: -1, place: -1, ent: null, ah: C.startAh, filter: "all", page: 0, shown: 60, moved: false };
  var P = null;               // places, once places.json has arrived
  var grid = null, GRID = 6;  // spatial index over the world plane
  var files = {};             // fetched JSON, by file name
  var current = null;         // what the panel and the orbit show: { kind, items, center... }
  var anim = 0, settleTimer = 0, playTimer = 0;

  function ceYear() { return C.ce[clamp(st.ah - C.ahMin, 0, C.ce.length - 1)]; }
  function yearText(ah) {
    var ce = C.ce[clamp(ah - C.ahMin, 0, C.ce.length - 1)];
    return [ah >= 1 ? tpl(T.year_ah, { y: ah }) : tpl(T.year_bh, { y: 1 - ah }), ce >= 1 ? tpl(T.year_ce, { y: ce }) : tpl(T.year_bce, { y: 1 - ce })];
  }
  function eraOf(r, year) {
    var best = null;
    for (var i = 0; i < C.eras.length; i++) { var e = C.eras[i]; if (e.r.indexOf(r) >= 0 && year >= e.y[0] && year <= e.y[1] && (!best || e.y[1] - e.y[0] < best.y[1] - best.y[0])) best = e; }
    return best ? best.name : "";
  }

  // ---------- camera ----------
  function narrow() { return vw <= 760; }
  // The part of the stage not covered by the panel, the year bar and the zoom buttons: views are fitted into it.
  function free() {
    var f = { l: 16, t: 16, r: 16, b: 78 };
    if (narrow()) { f.b = 70 + panel.offsetHeight + 10; f.t = 56; f.l = f.r = 8; return f; }
    var side = panel.classList.contains("is-closed") ? 0 : panel.offsetWidth + 12;
    if (RTL) { f.r += side; f.l += 46; } else { f.l += side; f.r += 46; }
    return f;
  }
  function focusPoint() { var f = free(); return { x: f.l + Math.max(60, vw - f.l - f.r) / 2, y: f.t + Math.max(60, vh - f.t - f.b) / 2 }; }
  function toScreen(wx, wy) { return [wx * cam.k + cam.tx, wy * cam.k + cam.ty]; }
  function toWorld(sx, sy) { return [(sx - cam.tx) / cam.k, (sy - cam.ty) / cam.k]; }
  function fitBox(box, maxK) {
    var f = free(), aw = Math.max(60, vw - f.l - f.r), ah = Math.max(60, vh - f.t - f.b);
    var k = clamp(Math.min(aw / Math.max(box[2] - box[0], 0.01), ah / Math.max(box[3] - box[1], 0.01)), kMin, maxK || K_MAX);
    return { k: k, tx: f.l + aw / 2 - ((box[0] + box[2]) / 2) * k, ty: f.t + ah / 2 - ((box[1] + box[3]) / 2) * k };
  }
  function centred(wx, wy, k) { var p = focusPoint(); return { k: k, tx: p.x - wx * k, ty: p.y - wy * k }; }
  // The whole world can always be brought to the middle of the stage, on any screen (R2.2): the camera is held only
  // so that the middle of the stage never leaves the world.
  function hold(c) {
    c.k = clamp(c.k, kMin, K_MAX);
    c.tx = clamp(c.tx, vw / 2 - W * c.k, vw / 2);
    c.ty = clamp(c.ty, vh / 2 - H * c.k, vh / 2);
    return c;
  }
  function apply() {
    camEl.setAttribute("transform", "translate(" + cam.tx.toFixed(2) + " " + cam.ty.toFixed(2) + ") scale(" + cam.k.toFixed(4) + ")");
    var z = cam.k / kHome;
    root.style.setProperty("--pm-ds", clamp(0.78 + 0.2 * Math.log(cam.k / 1.6) / Math.LN2, 0.7, 2.1).toFixed(2));
    root.style.setProperty("--pm-rt", clamp(1 - ((z - 1.25) / 2.6) * 0.72, 0.28, 1).toFixed(2));
    placeOverlay();
  }
  function setCam(c) { cam = hold(c); apply(); settleSoon(); }
  function fly(target, ms) {
    cancelAnimationFrame(anim);
    target = hold(target);
    if (calm.matches || ms === 0) { cam = target; apply(); settleSoon(); return; }
    var p = focusPoint(), from = { k: cam.k, wx: (p.x - cam.tx) / cam.k, wy: (p.y - cam.ty) / cam.k }, to = { k: target.k, wx: (p.x - target.tx) / target.k, wy: (p.y - target.ty) / target.k };
    var t0 = performance.now(), dur = ms || clamp(380 + 260 * Math.abs(Math.log(to.k / from.k)), 380, 1100);
    (function step(now) {
      var u = clamp((now - t0) / dur, 0, 1), e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      var k = from.k * Math.pow(to.k / from.k, e), wx = from.wx + (to.wx - from.wx) * e, wy = from.wy + (to.wy - from.wy) * e;
      cam = { k: k, tx: p.x - wx * k, ty: p.y - wy * k };
      apply();
      if (u < 1) anim = requestAnimationFrame(step); else settleSoon();
    })(t0);
  }
  function zoomAt(sx, sy, factor, smooth) {
    var k = clamp(cam.k * factor, kMin, K_MAX), w = toWorld(sx, sy), target = { k: k, tx: sx - w[0] * k, ty: sy - w[1] * k };
    st.moved = true;
    if (smooth) { cancelAnimationFrame(anim); if (calm.matches) return setCam(target); var a = { k: cam.k, tx: cam.tx, ty: cam.ty }, t0 = performance.now(); target = hold(target);
      (function step(now) { var u = clamp((now - t0) / 220, 0, 1), e = 1 - Math.pow(1 - u, 3); cam = { k: a.k * Math.pow(target.k / a.k, e), tx: 0, ty: 0 }; cam.tx = sx - w[0] * cam.k; cam.ty = sy - w[1] * cam.k; cam = hold(cam); apply(); if (u < 1) anim = requestAnimationFrame(step); else settleSoon(); })(t0);
    } else setCam(target);
  }
  function homeView() { return fitBox(narrow() ? C.core : C.home, 12); }
  function targetOfLevel() {
    if (st.level === "world") return homeView();
    if (st.place >= 0 && P) return centred(P.x[st.place], P.y[st.place], Math.max(cam.k, K_PLACE));
    if (st.region >= 0 && st.region < ELSE) return fitBox(C.regions[st.region].bbox, 40);
    return fitBox([0, 0, W, H]);
  }
  function settleSoon() { clearTimeout(settleTimer); settleTimer = setTimeout(layoutNames, 110); }

  // ---------- overlay: names, rings, the orbit ----------
  var names = new Map();     // key → { el, wx, wy, dx, dy }
  var ring = h("div", "pm-ring"), hoverRing = h("div", "pm-hover");
  ring.hidden = true; hoverRing.hidden = true;
  over.appendChild(hoverRing); over.appendChild(ring);
  var measure = document.createElement("canvas").getContext("2d"), widths = {}, fonts = {};
  // The width a name will take, measured with the very font its class is drawn in (asked of a hidden sample once per layout width).
  function fontOf(cls) {
    if (!fonts[cls]) { var s = h("button", cls, "x"); s.style.visibility = "hidden"; over.appendChild(s); var cs = getComputedStyle(s); fonts[cls] = { font: cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily, px: parseFloat(cs.fontSize) }; s.remove(); }
    return fonts[cls];
  }
  function textWidth(text, cls) {
    var key = cls + "|" + text;
    if (widths[key] === undefined) { measure.font = fontOf(cls).font; widths[key] = measure.measureText(text).width; }
    return widths[key];
  }
  function hits(b, boxes) { for (var i = 0; i < boxes.length; i++) { var o = boxes[i]; if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) return true; } return false; }
  function put(el, sx, sy) { el.style.transform = "translate(" + sx.toFixed(1) + "px," + sy.toFixed(1) + "px)"; }
  function placeOverlay() {
    names.forEach(function (n) { var s = toScreen(n.wx, n.wy); put(n.el, s[0] + n.dx, s[1] + n.dy); });
    if (!ring.hidden && P && st.place >= 0) { var s = toScreen(P.x[st.place], P.y[st.place]); put(ring, s[0], s[1]); }
    if (!hoverRing.hidden && P && hover >= 0) { var s2 = toScreen(P.x[hover], P.y[hover]); put(hoverRing, s2[0], s2[1]); }
    placeOrbit();
  }
  // Which names fit. Regions first, then places from the best-connected down; a name that would lie on another is
  // tried on the other sides of its dot and dropped if none is free. Names follow the camera between two runs.
  function layoutNames() {
    if (!vw) return;
    var keep = {}, boxes = [], f = free(), z = cam.k / kHome, orbiting = !!current;
    var year = ceYear();
    function show(key, cls, text, sub, wx, wy, dx, dy, click, dim) {
      var n = names.get(key);
      if (!n) {
        n = { el: h("button", cls) }; n.el.type = "button"; n.el.addEventListener("click", click);
        n.el.appendChild(h("span", null, text)); n.small = h("small"); n.el.appendChild(n.small);
        over.insertBefore(n.el, hoverRing); names.set(key, n);
      }
      n.wx = wx; n.wy = wy; n.dx = dx; n.dy = dy; n.small.textContent = sub || ""; n.small.hidden = !sub;
      n.el.classList.toggle("is-dim", !!dim);
      keep[key] = 1;
    }
    // Regions are named while the view is wide; once the reader has come close enough to read towns, towns are named instead.
    if (!orbiting && z < 2.2) {
      var lineH = fontOf("pm-rname").px * 1.45;
      C.regions.forEach(function (r, i) {
        if (i === ELSE || !r.count) return;
        var s = toScreen(r.ax, r.ay), era = eraOf(i, year), w = Math.max(textWidth(r.name, "pm-rname"), era ? textWidth(era, "pm-rname") * 0.8 : 0) + 20, hh = Math.max(28, lineH + 6) + (era ? lineH * 0.8 : 0);
        if (s[0] < f.l - 20 || s[0] > vw - f.r + 20 || s[1] < f.t || s[1] > vh - f.b) return;
        var tries = [0, -hh * 0.75, hh * 0.75, -hh * 1.4, hh * 1.4];
        for (var t = 0; t < tries.length; t++) {
          var b = [s[0] - w / 2, s[1] + tries[t] - hh / 2, s[0] + w / 2, s[1] + tries[t] + hh / 2];
          if (b[0] < 4 || b[2] > vw - 4 || hits(b, boxes)) continue;
          boxes.push(b);
          show("r" + i, "pm-rname", r.name, era, r.ax, r.ay, -w / 2, tries[t] - hh / 2, function () { goRegion(i); });
          return;
        }
      });
    }
    if (P && !orbiting && z >= 1.3) {
      var area = Math.max(1, (vw - f.l - f.r) * (vh - f.t - f.b)), budget = clamp(Math.round(area / 19000), 5, 48), minN = 0;
      if (z < 2.2) { budget = Math.min(budget, narrow() ? 6 : 14); minN = 25; } else if (z < 4) { budget = Math.min(budget, narrow() ? 10 : 28); minN = 4; }
      var w0 = toWorld(f.l, f.t), w1 = toWorld(vw - f.r, vh - f.b), placed = 0, regionOnly = st.level === "region" && st.region >= 0 && st.region < ELSE;
      for (var i = 0; i < P.len && placed < budget; i++) {
        if (P.n[i] < minN) break;
        if (P.x[i] < w0[0] || P.x[i] > w1[0] || P.y[i] < w0[1] || P.y[i] > w1[1]) continue;
        if (regionOnly && P.r[i] !== st.region) continue;
        var s = toScreen(P.x[i], P.y[i]), w = textWidth(P.name[i], "pm-pname ui") + 16, r = 5 + tierOf(P.n[i]) * 2;
        var opts = RTL ? [[-w - r, -12], [r, -12], [-w / 2, -24 - r], [-w / 2, r]] : [[r, -12], [-w - r, -12], [-w / 2, -24 - r], [-w / 2, r]];
        for (var o = 0; o < opts.length; o++) {
          var b = [s[0] + opts[o][0], s[1] + opts[o][1], s[0] + opts[o][0] + w, s[1] + opts[o][1] + 24];
          if (b[0] < f.l || b[2] > vw - f.r || hits(b, boxes)) continue;
          boxes.push(b); placed++;
          (function (i) { show("p" + i, "pm-pname ui", P.name[i], "", P.x[i], P.y[i], opts[o][0], opts[o][1], function () { goPlace(i); }, P.state[i] === 1); })(i);
          break;
        }
      }
    }
    names.forEach(function (n, key) { if (!keep[key]) { n.el.remove(); names.delete(key); } });
    placeOverlay();
  }

  // ---------- places: load, draw, find ----------
  function status(text, retry) {
    statusEl.textContent = text || "";
    if (retry) { var b = h("button", null, T.retry); b.type = "button"; b.addEventListener("click", retry); statusEl.appendChild(b); }
  }
  function load(name) {
    // The page names the build its data belongs to (C.v), so a cached file from an older build is never paired with a
    // newer page. (The page asks for this script by its own fingerprint too, so the two always belong together; a page
    // from before the fingerprints existed has no C.v and is simply asked for without one.)
    if (!files[name]) files[name] = fetch(C.base + name + ".json" + VER).then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).catch(function (e) { delete files[name]; throw e; });
    return files[name];
  }
  function loadPlaces() {
    status(T.loading);
    load("places").then(function (d) {
      var rows = d.places, n = rows.length;
      P = { len: n, slug: [], name: [], key: [], x: new Float32Array(n), y: new Float32Array(n), r: new Uint8Array(n), kind: [], n: new Int32Array(n), iv: [], approx: [], state: new Uint8Array(n), bySlug: {}, byRegion: C.regions.map(function () { return []; }) };
      grid = {};
      for (var i = 0; i < n; i++) {
        var row = rows[i];
        P.slug.push(row[0]); P.name.push(row[1]); P.key.push(searchKey(row[1]) + (row[2] ? "|" + searchKey(row[2]) : ""));
        P.x[i] = row[3]; P.y[i] = row[4]; P.r[i] = row[5]; P.kind.push(d.kinds[row[6]]); P.n[i] = row[7]; P.iv.push(row[8]); P.approx.push(!!row[9]);
        P.bySlug[row[0]] = i; P.byRegion[row[5]].push(i);
        var g = Math.floor(row[3] / GRID) + "," + Math.floor(row[4] / GRID);
        (grid[g] || (grid[g] = [])).push(i);
      }
      status("");
      drawDots(); renderPanel(); layoutNames(); readHash();
    }).catch(function () { status(T.load_error, loadPlaces); });
  }
  function drawDots() {
    if (!P) return;
    var year = ceYear(), d = [["", "", "", ""], ["", "", "", ""], ["", "", "", ""]];
    for (var i = 0; i < P.len; i++) { var s = activityState(P.iv[i], year); P.state[i] = s; d[tierOf(P.n[i])][s] += "M" + P.x[i] + " " + P.y[i] + "h.01"; }
    for (var t = 0; t < 3; t++) { for (var s2 = 0; s2 < 4; s2++) dotEls[t][s2].setAttribute("d", d[t][s2]); haloEls[t].setAttribute("d", d[t][3]); }
  }
  // Places within `px` screen pixels of a point, nearest first.
  function near(sx, sy, px) {
    if (!P) return [];
    var w = toWorld(sx, sy), rad = px / cam.k, out = [];
    for (var gx = Math.floor((w[0] - rad) / GRID); gx <= Math.floor((w[0] + rad) / GRID); gx++) for (var gy = Math.floor((w[1] - rad) / GRID); gy <= Math.floor((w[1] + rad) / GRID); gy++) {
      var cell = grid[gx + "," + gy]; if (!cell) continue;
      for (var c = 0; c < cell.length; c++) { var i = cell[c], dd = Math.hypot(P.x[i] - w[0], P.y[i] - w[1]); if (dd <= rad) out.push([dd, i]); }
    }
    out.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    return out.map(function (o) { return o[1]; });
  }

  // ---------- levels ----------
  function setHash() {
    var hsh = st.place >= 0 && P ? "#p=" + P.slug[st.place] : st.region >= 0 ? "#r=" + C.regions[st.region].id : "";
    try { history.replaceState(null, "", location.pathname + location.search + hsh); } catch (e) { /* a sandboxed frame may refuse; the map works without it */ }
  }
  function readHash() {
    var m = /^#p=([a-z0-9-]+)$/.exec(location.hash), r = /^#r=([a-z0-9-]+)$/.exec(location.hash);
    if (m && P && P.bySlug[m[1]] !== undefined) goPlace(P.bySlug[m[1]], true);
    else if (r) { for (var i = 0; i < C.regions.length; i++) if (C.regions[i].id === r[1]) goRegion(i, true); }
  }
  function enter(level) {
    st.level = level; st.filter = "all"; st.page = 0; st.shown = 60; st.moved = false; current = null;
    closePop(); hideTip();
    if (narrow()) setPanel(level === "region");
    regionEls.forEach(function (el, i) { el.classList.toggle("is-sel", i === st.region && level !== "world"); });
    ring.hidden = !(st.place >= 0);
    setHash(); renderCrumbs(); showYear();
  }
  function goWorld(quiet) { st.region = -1; st.place = -1; st.ent = null; enter("world"); renderPanel(); buildOrbit(); fly(homeView(), quiet ? 0 : undefined); }
  function goRegion(r, quiet) { st.region = r; st.place = -1; st.ent = null; enter("region"); renderPanel(); buildOrbit(); fly(targetOfLevel(), quiet ? 0 : undefined); }
  function goPlace(i, quiet) {
    st.place = i; st.region = P.r[i]; st.ent = null; enter("place");
    renderPanel(); buildOrbit(); fly(targetOfLevel(), quiet ? 0 : undefined);
    var slug = P.slug[i];
    load("p-" + shardOf(slug)).then(function (d) { if (st.level === "place" && st.place === i) { current = placeModel(i, d); renderPanel(); buildOrbit(); } })
      .catch(function () { if (st.level === "place" && st.place === i) panelError(function () { goPlace(i, true); }); });
  }
  function goEntity(id) {
    st.ent = id; st.level = "entity"; st.filter = "all"; st.page = 0; st.shown = 60; current = null; closePop(); hideTip();
    if (narrow()) setPanel(false);
    renderCrumbs(); renderPanel(); buildOrbit();
    load("e-" + shardOf(id)).then(function (d) { if (st.level === "entity" && st.ent === id) { current = entityModel(id, d); renderCrumbs(); renderPanel(); buildOrbit(); } })
      .catch(function () { if (st.level === "entity" && st.ent === id) panelError(function () { goEntity(id); }); });
  }
  function up() {
    if (st.level === "entity") { if (st.place >= 0) goPlace(st.place); else goWorld(); }
    else if (st.level === "place") { if (st.region >= 0) goRegion(st.region); else goWorld(); }
    else if (st.level === "region") goWorld();
  }
  function openItem(id) { if (clsOf(id) === "place") { var i = P && P.bySlug[id.slice(6)]; if (i !== undefined && i !== null) goPlace(i); else location.href = hrefOf(id); } else goEntity(id); }

  // What stands around a place: one item per record, with every relation that ties it to the place.
  function placeModel(i, d) {
    var rec = d.places[P.slug[i]] || ["", []], by = {}, items = [];
    rec[1].forEach(function (l) {
      var e = d.ents[l[0]], it = by[e[0]];
      if (!it) { it = by[e[0]] = { id: e[0], cls: clsOf(e[0]), label: e[1], from: e[2], to: e[3], years: e[4], deg: e[5] || 0, rels: [] }; items.push(it); }
      var type = d.types[l[1]], lab = l[2] === 1 ? (T.here[type] || (C.rel[type] || [type])[0]) : (C.rel[type] || [type, type])[0];
      if (it.rels.indexOf(lab) < 0) it.rels.push(lab);
    });
    return { kind: "place", title: P.name[i], teaser: rec[0], items: items, wx: P.x[i], wy: P.y[i] };
  }
  // A record in focus: its own links, read from its side ("born in", "student of"), its places first. It stays
  // anchored where the reader came from: the place it was opened from, else the first of its own places.
  function entityModel(id, d) {
    var rec = d.full[id] || ["", 0, [], "", ""], by = {}, items = [];
    rec[2].forEach(function (l) {
      var e = d.ents[l[0]], it = by[e[0]];
      if (!it) { it = by[e[0]] = { id: e[0], cls: clsOf(e[0]), label: e[1], from: e[2], to: e[3], years: e[4], deg: e[5] || 0, rels: [] }; items.push(it); }
      var type = d.types[l[1]], lab = (C.rel[type] || [type, type])[l[2]];
      if (it.rels.indexOf(lab) < 0) it.rels.push(lab);
    });
    var a = st.place >= 0 ? [P.x[st.place], P.y[st.place]] : null;
    for (var k = 0; k < items.length && !a; k++) { var pi = items[k].cls === "place" ? P.bySlug[items[k].id.slice(6)] : undefined; if (pi !== undefined) a = [P.x[pi], P.y[pi]]; }
    if (!a) { var f = focusPoint(); a = toWorld(f.x, f.y); }
    return { kind: "entity", id: id, cls: clsOf(id), title: rec[3] || (pendingName[id] ? pendingName[id].label : id), years: rec[4] || "", teaser: rec[0], total: rec[1], items: items, wx: a[0], wy: a[1] };
  }
  var pendingName = {};
  function isActive(it) { var y = ceYear(); return it.from != null && y >= it.from && y <= it.to; }
  var ORDER = { person: 0, event: 1, building: 2, place: 3, polity: 4, group: 5, work: 6, object: 7, journey: 8 };
  function sorted(items) {
    var coll = new Intl.Collator(C.lang);
    return items.slice().sort(function (a, b) {
      if (current && current.kind === "entity") { var pa = a.cls === "place" ? 0 : 1, pb = b.cls === "place" ? 0 : 1; if (pa !== pb) return pa - pb; }
      return Number(isActive(b)) - Number(isActive(a)) || b.deg - a.deg || (ORDER[a.cls] || 9) - (ORDER[b.cls] || 9) || coll.compare(a.label, b.label);
    });
  }
  function visibleItems() {
    if (!current || !current.items) return [];
    var list = st.filter === "all" ? current.items : current.items.filter(function (it) { return it.cls === st.filter; });
    return sorted(list);
  }

  // ---------- trail ----------
  function renderCrumbs() {
    crumbList.textContent = "";
    var parts = [{ text: T.world, go: st.level === "world" ? null : function () { goWorld(); } }];
    if (st.region >= 0) parts.push({ text: C.regions[st.region].name, go: st.level === "region" ? null : function () { goRegion(st.region); } });
    if (st.place >= 0 && P) parts.push({ text: P.name[st.place], go: st.level === "place" ? null : function () { goPlace(st.place); } });
    if (st.level === "entity") parts.push({ text: current && current.kind === "entity" ? current.title : (pendingName[st.ent] ? pendingName[st.ent].label : "…"), go: null });
    parts.forEach(function (p) {
      var li = h("li");
      if (p.go) { var b = h("button", null, p.text); b.type = "button"; b.addEventListener("click", p.go); li.appendChild(b); }
      else { var s = h("span", null, p.text); s.setAttribute("aria-current", "location"); li.appendChild(s); }
      crumbList.appendChild(li);
    });
    crumbs.classList.toggle("is-world", st.level === "world");
  }

  // ---------- panel ----------
  function row(opts) {
    var li = h("li"), b = h("button", "pm-row" + (opts.dim ? " is-dim" : "")); b.type = "button";
    if (opts.cls) b.appendChild(h("span", "pm-shape c-" + opts.cls));
    var t = h("span", "pm-row-t"); t.appendChild(auto("b", null, opts.text)); if (opts.sub) t.appendChild(h("small", null, opts.sub)); b.appendChild(t);
    if (opts.now) { var dot = h("span", "pm-now"); dot.title = T.active_now; b.appendChild(dot); var sr = h("span", "sr-only", T.active_now); b.appendChild(sr); }
    if (opts.n != null) b.appendChild(h("span", "pm-row-n", nf.format(opts.n)));
    b.addEventListener("click", opts.go);
    if (opts.key) { b.dataset.key = opts.key; b.addEventListener("mouseenter", function () { hot(opts.key, true); }); b.addEventListener("mouseleave", function () { hot(opts.key, false); }); b.addEventListener("focus", function () { hot(opts.key, true); }); b.addEventListener("blur", function () { hot(opts.key, false); }); }
    li.appendChild(b);
    return li;
  }
  function more(list, total, again) {
    if (total <= st.shown) return;
    var b = h("button", "pm-link", count(T.show_more, total - st.shown)); b.type = "button";
    b.addEventListener("click", function () { st.shown += 120; again(); });
    var p = h("p", "pm-actions"); p.appendChild(b); list.parentNode.appendChild(p);
  }
  function panelError(retry) { body.textContent = ""; var p = h("p", "pm-wait", T.load_error + " "); var b = h("button", "pm-link", T.retry); b.type = "button"; b.addEventListener("click", retry); body.appendChild(p); body.appendChild(b); }
  function renderPanel() {
    var keepScroll = body.scrollTop, same = body.dataset.for === st.level + ":" + st.region + ":" + st.place + ":" + st.ent;
    var focused = same && body.contains(document.activeElement) ? document.activeElement.dataset.key : null;
    body.textContent = ""; body.dataset.for = st.level + ":" + st.region + ":" + st.place + ":" + st.ent;
    var year = ceYear();
    if (st.level === "world") {
      panelTitle.textContent = T.regions_h;
      body.appendChild(h("p", null, T.regions_lede));
      // Audit of 13 November 2026, S26: the year can be typed, in either calendar, and the panel says what the year
      // bar does: it lights the places that have dated records in that year and names each region's era. It does not
      // filter a place's own list of records.
      if (T.time_note) {
        body.appendChild(h("p", "pm-timenote", T.time_note));
        var yf = h("form", "pm-yearform"); yf.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin:0 0 12px";
        var yl = h("label", null, T.year_typed); yl.htmlFor = "pm-year-typed";
        var yi = h("input"); yi.id = "pm-year-typed"; yi.type = "number"; yi.inputMode = "numeric"; yi.required = true; yi.value = String(st.ah); yi.dataset.key = "yeartyped";
        yi.style.cssText = "font:inherit;width:6em;min-height:44px;padding:4px 8px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--fg)";
        var ys = h("select"); ys.setAttribute("aria-label", T.year_calendar); ys.style.cssText = "font:inherit;min-height:44px;padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--fg)";
        [["ah", T.year_ah_short], ["ce", T.year_ce_short]].forEach(function (o) { var op = h("option", null, o[1]); op.value = o[0]; ys.appendChild(op); });
        var yb = h("button", "pm-btn", T.year_go); yb.type = "submit"; yb.style.cssText = "min-height:44px;padding:0 12px;width:auto";
        var ym = h("span"); ym.setAttribute("role", "alert"); ym.style.cssText = "flex-basis:100%;font-size:.85rem";
        yf.addEventListener("submit", function (ev) {
          ev.preventDefault();
          var v = parseInt(yi.value, 10), ah = v;
          if (!isFinite(v)) return;
          if (ys.value === "ce") { ah = null; for (var k = 0; k < C.ce.length; k++) if (C.ce[k] >= v) { ah = C.ahMin + k; break; } }
          if (ah == null || ah < C.ahMin || ah > C.ahMax) { ym.textContent = tpl(T.year_range, { from: String(C.ahMin), to: String(C.ahMax) }); return; }
          ym.textContent = ""; stopPlay(); setYear(ah, false);
        });
        [yl, yi, ys, yb, ym].forEach(function (e) { yf.appendChild(e); });
        body.appendChild(yf);
      }
      var ul = h("ul", "pm-rows");
      C.regions.forEach(function (r, i) { if (r.count) ul.appendChild(row({ text: r.name, sub: i === ELSE ? "" : eraOf(i, year), n: r.count, go: function () { goRegion(i); }, key: "r" + i })); });
      body.appendChild(ul);
      if (!P) body.appendChild(h("p", "pm-wait", statusEl.textContent || T.loading));
    } else if (st.level === "region") {
      var reg = C.regions[st.region];
      panelTitle.textContent = reg.name;
      body.appendChild(h("p", "pm-eyebrow", T.places_h));
      body.appendChild(h("h2", null, reg.name));
      var meta = h("p", "pm-meta"); meta.appendChild(h("span", null, count(T.region_count, reg.count)));
      var era = st.region === ELSE ? "" : eraOf(st.region, year); if (era) meta.appendChild(h("span", null, tpl(T.era, { name: era })));
      body.appendChild(meta);
      if (!P) { body.appendChild(h("p", "pm-wait", T.loading)); }
      else {
        var list = h("ul", "pm-rows"), ix = P.byRegion[st.region];
        ix.slice(0, st.shown).forEach(function (i) { list.appendChild(row({ text: P.name[i], sub: C.kinds[P.kind[i]] || "", n: P.n[i] || null, now: P.state[i] === 3, dim: P.state[i] === 1, go: function () { goPlace(i); }, key: "p" + i })); });
        body.appendChild(list); more(list, ix.length, renderPanel);
      }
    } else if (st.level === "place") {
      var i = st.place;
      panelTitle.textContent = P.name[i];
      body.appendChild(h("p", "pm-eyebrow", (C.kinds[P.kind[i]] || T.cls.place) + " · " + C.regions[P.r[i]].name));
      body.appendChild(h("h2", null, P.name[i]));
      if (P.approx[i]) body.appendChild(h("p", "pm-meta", T.approx));
      if (!current) { body.appendChild(h("p", "pm-wait", T.loading)); }
      else {
        if (current.teaser) body.appendChild(auto("p", null, current.teaser));
        var act = h("p", "pm-actions"), a = h("a", "pm-link", T.open_place); a.href = hrefOf("place/" + P.slug[i]); act.appendChild(a); body.appendChild(act);
        entityRows(count(T.records, current.items.length), T.no_records);
      }
    } else {
      var title = current ? current.title : (pendingName[st.ent] ? pendingName[st.ent].label : "…");
      panelTitle.textContent = title;
      body.appendChild(h("p", "pm-eyebrow", C.cls[clsOf(st.ent)] || ""));
      body.appendChild(h("h2", null, title));
      if (!current) { body.appendChild(h("p", "pm-wait", T.loading)); }
      else {
        if (current.years) body.appendChild(h("p", "pm-meta", current.years));
        if (current.teaser) body.appendChild(auto("p", null, current.teaser));
        var act2 = h("p", "pm-actions"), a2 = h("a", "pm-link", T.open); a2.href = hrefOf(st.ent); act2.appendChild(a2);
        if (st.place >= 0) { var back = h("button", "pm-link", tpl(T.back_to, { name: P.name[st.place] })); back.type = "button"; back.addEventListener("click", function () { goPlace(st.place); }); act2.appendChild(back); }
        body.appendChild(act2);
        entityRows(T.links_h, T.no_records);
        if (current.total > current.items.length) body.appendChild(h("p", "pm-meta", count(T.links_rest, current.total - current.items.length)));
      }
    }
    body.scrollTop = same ? keepScroll : 0;
    if (focused) refocus(body, focused);
  }
  // A redraw replaces the elements; the reader's place in them is kept by the record each one stands for.
  function refocus(scope, key) {
    var all = scope.querySelectorAll("[data-key]");
    for (var i = 0; i < all.length; i++) if (all[i].dataset.key === key) { all[i].focus({ preventScroll: true }); return; }
  }
  function entityRows(heading, empty) {
    if (!current.items.length) { body.appendChild(h("p", "pm-wait", empty)); return; }
    body.appendChild(h("p", "pm-sub", heading));
    var counts = {}; current.items.forEach(function (it) { counts[it.cls] = (counts[it.cls] || 0) + 1; });
    var classes = Object.keys(counts).sort(function (a, b) { return (ORDER[a] || 9) - (ORDER[b] || 9); });
    if (classes.length > 1) {
      var chips = h("div", "pm-chips");
      [["all", T.filter_all, current.items.length]].concat(classes.map(function (c) { return [c, C.cls[c] || c, counts[c]]; })).forEach(function (c) {
        var b = h("button", null, c[1] + " · " + nf.format(c[2])); b.type = "button"; b.setAttribute("aria-pressed", String(st.filter === c[0]));
        b.addEventListener("click", function () { st.filter = c[0]; st.page = 0; st.shown = 60; renderPanel(); buildOrbit(); var again = q('.pm-chips [aria-pressed="true"]'); if (again) again.focus(); });
        chips.appendChild(b);
      });
      body.appendChild(chips);
    }
    var items = visibleItems(), list = h("ul", "pm-rows");
    items.slice(0, st.shown).forEach(function (it) {
      var now = isActive(it);
      list.appendChild(row({ cls: it.cls, text: it.label, sub: it.rels.concat(it.years ? [it.years] : []).join(" · "), now: now, dim: it.from != null && !now, go: function () { pendingName[it.id] = it; openItem(it.id); }, key: "e" + it.id }));
    });
    body.appendChild(list); more(list, items.length, renderPanel);
  }
  function setPanel(yes) { panel.classList.toggle("is-closed", !yes); panelToggle.setAttribute("aria-expanded", String(yes)); panelToggle.title = yes ? T.panel_hide : T.panel_show; }
  function openPanel(yes) {
    setPanel(yes);
    if (!st.moved) fly(targetOfLevel(), 0); else placeOverlay();
    buildOrbit(); settleSoon();
  }

  // ---------- the orbit ----------
  var orbit = { core: null, nodes: [], per: 12 };
  function clearOrbit() {
    [orbit.core].concat(orbit.nodes.map(function (n) { return n.el; })).forEach(function (el) { if (el) el.remove(); });
    links.textContent = ""; orbit.core = null; orbit.nodes = [];
  }
  function buildOrbit() {
    var focused = document.activeElement && document.activeElement.classList.contains("pm-node") ? document.activeElement.dataset.key : null;
    clearOrbit();
    if (!current || !P) { layoutNames(); return; }
    var f = free(), aw = vw - f.l - f.r, ah = vh - f.t - f.b, tight = aw < 600;
    orbit.per = aw < 430 ? 6 : tight ? 8 : ah < 420 ? 10 : 12;
    var items = visibleItems(), pages = Math.max(1, Math.ceil(items.length / orbit.per));
    st.page = clamp(st.page, 0, pages - 1);
    var slice = items.slice(st.page * orbit.per, (st.page + 1) * orbit.per);
    // The centre label: what is in focus, how much is tied to it, and (when it does not all fit round the ring) the paging arrows.
    orbit.core = h("div", "pm-core");
    var mid = h("div");
    mid.appendChild(auto("b", null, current.title));
    mid.appendChild(h("small", null, current.kind === "place" ? count(T.records, current.items.length) : (C.cls[current.cls] || "") + (current.years ? " · " + current.years : "")));
    if (pages > 1) {
      var prev = h("button"), next = h("button");
      prev.type = next.type = "button"; prev.appendChild(icon(ICON.prev)); next.appendChild(icon(ICON.next));
      prev.setAttribute("aria-label", T.prev_items); next.setAttribute("aria-label", T.more_items); prev.title = T.prev_items; next.title = T.more_items; prev.disabled = st.page === 0; next.disabled = st.page >= pages - 1;
      prev.addEventListener("click", function () { st.page--; buildOrbit(); var b = orbit.core.querySelector("button:not(:disabled)"); if (b) b.focus(); });
      next.addEventListener("click", function () { st.page++; buildOrbit(); var bs = orbit.core.querySelectorAll("button:not(:disabled)"); if (bs.length) bs[bs.length - 1].focus(); });
      mid.appendChild(h("small", "pm-page", tpl(T.page_of, { a: nf.format(st.page + 1), b: nf.format(pages) })));
      orbit.core.appendChild(prev); orbit.core.appendChild(mid); orbit.core.appendChild(next);
    } else orbit.core.appendChild(mid);
    over.appendChild(orbit.core);
    // On a narrow screen the open sheet is the list; the ring comes back when it is folded.
    if (narrow() && !panel.classList.contains("is-closed")) slice = [];
    slice.forEach(function (it) {
      var b = h("button", "pm-node" + (it.from != null && !isActive(it) ? " is-dim" : "")); b.type = "button";
      b.appendChild(h("span", "pm-shape c-" + it.cls));
      var t = h("span"); t.appendChild(auto("span", "pm-node-t", it.label)); var sub = it.rels[0] || it.years; if (sub) t.appendChild(h("small", null, sub)); b.appendChild(t);
      b.title = [it.label].concat(it.rels, it.years ? [it.years] : []).join(" · "); b.dataset.key = "e" + it.id;
      b.addEventListener("click", function () { pendingName[it.id] = it; openItem(it.id); });
      b.addEventListener("mouseenter", function () { hot("e" + it.id, true); }); b.addEventListener("mouseleave", function () { hot("e" + it.id, false); });
      b.addEventListener("focus", function () { hot("e" + it.id, true); }); b.addEventListener("blur", function () { hot("e" + it.id, false); });
      over.appendChild(b);
      var line = svgEl("line"); links.appendChild(line);
      orbit.nodes.push({ el: b, key: "e" + it.id, line: line });
    });
    layoutNames();
    if (focused) refocus(over, focused);
  }
  function placeOrbit() {
    if (!orbit.core || !current) return;
    var c = toScreen(current.wx, current.wy), f = free(), aw = vw - f.l - f.r, ah = vh - f.t - f.b, tight = aw < 600, n = orbit.nodes.length;
    var cw = orbit.core.offsetWidth;
    put(orbit.core, c[0] - cw / 2, c[1] + 16);
    var rx = tight ? Math.max(96, aw / 2 - 66) : clamp(aw / 2 - 196, 150, 330), ry = clamp(ah / 2 - (tight ? 30 : 46), 100, tight ? 200 : 230);
    links.setAttribute("viewBox", "0 0 " + vw + " " + vh);
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (i / n) * Math.PI * 2, cx = Math.cos(a), sy = Math.sin(a), x = c[0] + cx * rx, y = c[1] + sy * ry, el = orbit.nodes[i].el, w = el.offsetWidth, hh = el.offsetHeight;
      var left = tight || Math.abs(cx) < 0.3 ? x - w / 2 : cx > 0 ? x - 14 : x - w + 14, top = tight || Math.abs(cx) >= 0.3 ? y - hh / 2 : sy < 0 ? y - hh + 8 : y - 8;
      put(el, left, top);
      var ln = orbit.nodes[i].line; ln.setAttribute("x1", c[0].toFixed(1)); ln.setAttribute("y1", c[1].toFixed(1)); ln.setAttribute("x2", x.toFixed(1)); ln.setAttribute("y2", y.toFixed(1));
    }
  }
  function hot(key, on) {
    orbit.nodes.forEach(function (nd) { if (nd.key === key) { nd.el.classList.toggle("is-hot", on); nd.line.classList.toggle("is-hot", on); } });
    var r = body.querySelector('.pm-row[data-key="' + (window.CSS && CSS.escape ? CSS.escape(key) : key) + '"]'); if (r) r.classList.toggle("is-hot", on);
    if (key.charAt(0) === "r") { var el = regionEls[+key.slice(1)]; if (el) el.classList.toggle("is-hot", on); var nm = names.get(key); if (nm) nm.el.classList.toggle("is-hot", on); }
    if (key.charAt(0) === "p" && P) { hover = on ? +key.slice(1) : -1; hoverRing.hidden = !on; placeOverlay(); }
  }

  // ---------- tooltip and the chooser for stacked places ----------
  var hover = -1;
  function showTip(sx, sy, title, sub) {
    tip.textContent = ""; tip.appendChild(h("b", null, title)); if (sub) tip.appendChild(h("small", null, sub));
    tip.hidden = false;
    var w = tip.offsetWidth, hh = tip.offsetHeight;
    tip.style.transform = "translate(" + clamp(sx + 14, 6, vw - w - 6).toFixed(0) + "px," + (sy - hh - 12 < 6 ? sy + 18 : sy - hh - 12).toFixed(0) + "px)";
  }
  function hideTip() { tip.hidden = true; }
  function placeSub(i) { var bits = [C.kinds[P.kind[i]] || T.cls.place]; if (P.n[i]) bits.push(count(T.records, P.n[i])); if (P.state[i] === 3) bits.push(T.active_now); return bits.join(" · "); }
  var popReturn = null;
  function closePop() { if (pop.hidden) return; pop.hidden = true; pop.textContent = ""; if (popReturn && document.contains(popReturn)) popReturn.focus(); popReturn = null; }
  function choose(list, sx, sy) {
    pop.textContent = "";
    var head = h("p"); head.appendChild(h("span", null, T.choose_place)); var x = h("button", "pm-x", "×"); x.type = "button"; x.setAttribute("aria-label", T.close); x.addEventListener("click", closePop); head.appendChild(x); pop.appendChild(head);
    var ul = h("ul", "pm-rows");
    list.slice(0, 14).forEach(function (i) { ul.appendChild(row({ text: P.name[i], sub: C.kinds[P.kind[i]] || "", n: P.n[i] || null, go: function () { popReturn = null; goPlace(i); } })); });
    pop.appendChild(ul);
    if (list.length > 14) pop.appendChild(h("p", null, count(T.choose_more, list.length - 14)));
    pop.hidden = false; popReturn = view;
    pop.style.transform = "translate(" + clamp(sx - pop.offsetWidth / 2, 8, vw - pop.offsetWidth - 8).toFixed(0) + "px," + clamp(sy + 12, 8, Math.max(8, vh - pop.offsetHeight - 80)).toFixed(0) + "px)";
    var first = q(".pm-row", pop); if (first) first.focus();
  }

  // ---------- pointer, wheel, keyboard ----------
  var pointers = new Map(), drag = null, lastTap = 0, lastTapAt = [0, 0], regionTimer = 0;
  function local(e) { var b = view.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
  view.addEventListener("pointerdown", function (e) {
    if (e.button > 0 || e.target.closest(".pm-over > *")) return;
    cancelAnimationFrame(anim); closePop(); clearTimeout(regionTimer);
    pointers.set(e.pointerId, local(e));
    try { view.setPointerCapture(e.pointerId); } catch (err) { /* not capturable: the drag still works inside the map */ }
    var p = local(e);
    drag = { x: p[0], y: p[1], sx: p[0], sy: p[1], moved: 0, t: performance.now(), pinch: 0 };
    if (pointers.size === 2) { var a = [], it = pointers.values(); a.push(it.next().value); a.push(it.next().value); drag.pinch = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]); }
  });
  view.addEventListener("pointermove", function (e) {
    var p = local(e);
    if (!pointers.has(e.pointerId)) { if (e.pointerType === "mouse") hoverAt(p[0], p[1], e.target); return; }
    pointers.set(e.pointerId, p);
    if (!drag) return;
    if (pointers.size >= 2) {
      var a = [], it = pointers.values(); a.push(it.next().value); a.push(it.next().value);
      var dist = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]), mx = (a[0][0] + a[1][0]) / 2, my = (a[0][1] + a[1][1]) / 2;
      if (drag.pinch > 0 && dist > 0) zoomAt(mx, my, dist / drag.pinch);
      drag.pinch = dist; drag.moved = 99; return;
    }
    var dx = p[0] - drag.x, dy = p[1] - drag.y;
    drag.moved += Math.abs(dx) + Math.abs(dy); drag.x = p[0]; drag.y = p[1];
    if (drag.moved > 5) { view.classList.add("is-drag"); st.moved = true; hideTip(); setCam({ k: cam.k, tx: cam.tx + dx, ty: cam.ty + dy }); }
  });
  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    try { view.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
    view.classList.remove("is-drag");
    if (!drag || pointers.size) { if (!pointers.size) drag = null; return; }
    var d = drag; drag = null;
    if (e.type === "pointerup" && d.moved <= 5 && performance.now() - d.t < 700) {
      var now = performance.now(), again = now - lastTap < 320 && Math.hypot(d.sx - lastTapAt[0], d.sy - lastTapAt[1]) < 28;
      lastTap = now; lastTapAt = [d.sx, d.sy];
      if (again && e.pointerType !== "mouse") { lastTap = 0; clearTimeout(regionTimer); zoomAt(d.sx, d.sy, 2.2, true); return; }
      tapAt(d.sx, d.sy, e);
    }
  }
  view.addEventListener("pointerup", endPointer);
  view.addEventListener("pointercancel", endPointer);
  view.addEventListener("lostpointercapture", function (e) { if (pointers.has(e.pointerId)) endPointer(e); });
  view.addEventListener("pointerleave", function () { hideTip(); if (hover >= 0 && !pointers.size) { hover = -1; hoverRing.hidden = true; } view.classList.remove("is-point"); });
  function regionAt(e) { var el = document.elementFromPoint(e.clientX, e.clientY), a = el && el.closest ? el.closest(".pm-region") : null; return a ? +a.dataset.r : -1; }
  function hoverAt(sx, sy, target) {
    if (target.closest && target.closest(".pm-over > *")) { hideTip(); return; }
    var list = near(sx, sy, 11);
    if (list.length) {
      hover = list[0]; hoverRing.hidden = false; placeOverlay(); view.classList.add("is-point");
      showTip(sx, sy, P.name[hover] + (list.length > 1 ? "  +" + nf.format(list.length - 1) : ""), placeSub(hover));
      return;
    }
    if (hover >= 0) { hover = -1; hoverRing.hidden = true; }
    var a = target.closest ? target.closest(".pm-region") : null;
    view.classList.toggle("is-point", !!a);
    if (a && st.level === "world") { var r = +a.dataset.r, era = eraOf(r, ceYear()); showTip(sx, sy, C.regions[r].name, count(T.region_count, C.regions[r].count) + (era ? " · " + era : "")); }
    else hideTip();
  }
  function tapAt(sx, sy, e) {
    var list = near(sx, sy, e.pointerType === "mouse" ? 11 : 20);
    if (list.length === 1) return goPlace(list[0]);
    if (list.length > 1) {
      // can a closer look tell them apart? then look closer; otherwise offer the list
      var spread = 0; for (var i = 1; i < list.length; i++) spread = Math.max(spread, Math.hypot(P.x[list[i]] - P.x[list[0]], P.y[list[i]] - P.y[list[0]]));
      if (list.length > 6 && cam.k * 2.4 <= K_MAX && spread * K_MAX > 26) { var w = toWorld(sx, sy); st.moved = true; return fly(centred(w[0], w[1], cam.k * 3)); }
      return choose(list, sx, sy);
    }
    // A region opens a beat after the click, so that a double click (zoom here) is not first read as "open this region".
    var r = regionAt(e);
    if (r >= 0 && (st.level === "world" || r !== st.region)) { clearTimeout(regionTimer); regionTimer = setTimeout(function () { goRegion(r); }, e.pointerType === "mouse" ? 230 : 330); }
  }
  view.addEventListener("wheel", function (e) {
    if (e.target.closest(".pm-over > *")) return;
    e.preventDefault();
    var p = local(e), dy = e.deltaMode === 1 ? e.deltaY * 18 : e.deltaMode === 2 ? e.deltaY * vh : e.deltaY;
    zoomAt(p[0], p[1], Math.exp(-dy * (e.ctrlKey ? 0.011 : 0.0021)));
  }, { passive: false });
  view.addEventListener("dblclick", function (e) { if (e.target.closest(".pm-over > *")) return; e.preventDefault(); clearTimeout(regionTimer); var p = local(e); zoomAt(p[0], p[1], e.shiftKey ? 0.5 : 2.2, true); });
  view.addEventListener("keydown", function (e) {
    if (e.target !== view) return;
    var step = 90, p = focusPoint(), done = true;
    if (e.key === "ArrowLeft") setCam({ k: cam.k, tx: cam.tx + step, ty: cam.ty });
    else if (e.key === "ArrowRight") setCam({ k: cam.k, tx: cam.tx - step, ty: cam.ty });
    else if (e.key === "ArrowUp") setCam({ k: cam.k, tx: cam.tx, ty: cam.ty + step });
    else if (e.key === "ArrowDown") setCam({ k: cam.k, tx: cam.tx, ty: cam.ty - step });
    else if (e.key === "+" || e.key === "=") zoomAt(p.x, p.y, 1.6, true);
    else if (e.key === "-" || e.key === "_") zoomAt(p.x, p.y, 1 / 1.6, true);
    else if (e.key === "0") { st.moved = false; fly(targetOfLevel()); }
    else done = false;
    if (done) { st.moved = e.key !== "0"; e.preventDefault(); }
  });
  root.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || e.defaultPrevented) return;
    if (!pop.hidden) { closePop(); e.preventDefault(); return; }
    if (!results.hidden) return;
    if (e.target === input) return;
    if (st.level !== "world") { up(); e.preventDefault(); if (!root.contains(document.activeElement) || document.activeElement === document.body) view.focus(); }
    else if (root.classList.contains("is-full")) { setFull(false); e.preventDefault(); }
  });
  regionEls.forEach(function (a, i) {
    a.addEventListener("click", function (e) { e.preventDefault(); if (e.detail === 0) goRegion(i); });
    a.addEventListener("focus", function () { hot("r" + i, true); }); a.addEventListener("blur", function () { hot("r" + i, false); });
  });
  q(".pm-zoom").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var p = focusPoint();
    if (b.dataset.act === "in") zoomAt(p.x, p.y, 1.8, true); else if (b.dataset.act === "out") zoomAt(p.x, p.y, 1 / 1.8, true); else { st.moved = false; if (st.level === "world") fly(homeView()); else goWorld(); }
  });
  panelToggle.addEventListener("click", function () { openPanel(panel.classList.contains("is-closed")); });

  // ---------- the year bar ----------
  function showYear() {
    var y = yearText(st.ah), era = st.region >= 0 && st.region < ELSE ? eraOf(st.region, ceYear()) : "";
    yearOut.textContent = ""; yearOut.appendChild(h("span", null, y[0])); yearOut.appendChild(h("i", null, " · ")); yearOut.appendChild(h("span", null, y[1]));
    if (era) yearOut.appendChild(h("small", null, era));
    slider.setAttribute("aria-valuetext", y[0] + "، " + y[1] + (era ? "، " + era : ""));
  }
  function setYear(ah, live) {
    st.ah = clamp(Math.round(ah), C.ahMin, C.ahMax);
    if (+slider.value !== st.ah) slider.value = String(st.ah);
    showYear(); drawDots();
    names.forEach(function (n, key) { if (key.charAt(0) === "p") n.el.classList.toggle("is-dim", P.state[+key.slice(1)] === 1); });
    // What is active decides the order and the marks of the panel's rows and the orbit's nodes, so both follow the
    // year: at once when the year is set, and at most a few times a second while it is running (play, or a drag).
    clearTimeout(liveTimer); liveTimer = 0;
    if (!live) { renderPanel(); buildOrbit(); }
    else if (performance.now() - liveAt > 260) { liveAt = performance.now(); renderPanel(); buildOrbit(); }
    else liveTimer = setTimeout(function () { liveTimer = 0; liveAt = performance.now(); renderPanel(); buildOrbit(); }, 260);
  }
  var liveTimer = 0, liveAt = 0;
  slider.addEventListener("input", function () { stopPlay(); setYear(+slider.value, true); });
  slider.addEventListener("change", function () { setYear(+slider.value, false); });
  [].forEach.call(root.querySelectorAll(".pm-step"), function (b) { b.addEventListener("click", function () { stopPlay(); setYear(st.ah + +b.dataset.step, false); }); });
  function stopPlay() {
    if (!playTimer) return;
    clearInterval(playTimer); playTimer = 0;
    playBtn.setAttribute("aria-pressed", "false"); playBtn.setAttribute("aria-label", T.play); playBtn.title = T.play; playBtn.textContent = ""; playBtn.appendChild(icon(ICON.play, true));
    setYear(st.ah, false);
  }
  playBtn.addEventListener("click", function () {
    if (playTimer) return stopPlay();
    if (st.ah >= C.ahMax) setYear(C.ahMin, true);
    playBtn.setAttribute("aria-pressed", "true"); playBtn.setAttribute("aria-label", T.pause); playBtn.title = T.pause; playBtn.textContent = ""; playBtn.appendChild(icon(ICON.pause, true));
    var jump = calm.matches ? 25 : 6;
    playTimer = setInterval(function () { if (st.ah >= C.ahMax) return stopPlay(); setYear(st.ah + jump, true); }, calm.matches ? 700 : 110);
  });

  // ---------- search ----------
  var found = [], active = -1;
  function closeResults() { results.hidden = true; results.textContent = ""; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); found = []; active = -1; }
  function mark(i) {
    active = i;
    [].forEach.call(results.children, function (li, j) { li.setAttribute("aria-selected", String(j === i)); if (j === i) { input.setAttribute("aria-activedescendant", li.id); li.scrollIntoView({ block: "nearest" }); } });
  }
  function search() {
    var key = searchKey(input.value);
    if (!P || !key) return closeResults();
    var starts = [], inside = [];
    for (var i = 0; i < P.len && starts.length < 12; i++) { var k = P.key[i], at = k.indexOf(key); if (at < 0) continue; if (at === 0 || k.charAt(at - 1) === "|" || k.charAt(at - 1) === " ") starts.push(i); else if (inside.length < 12) inside.push(i); }
    found = starts.concat(inside).slice(0, 12);
    results.textContent = "";
    if (!found.length) { var none = h("li", "pm-none", T.search_none); none.setAttribute("role", "option"); none.setAttribute("aria-disabled", "true"); results.appendChild(none); }
    found.forEach(function (i, j) {
      var li = h("li"); li.id = "pm-o-" + j; li.setAttribute("role", "option"); li.setAttribute("aria-selected", "false");
      li.appendChild(h("span", null, P.name[i])); li.appendChild(h("small", null, (C.kinds[P.kind[i]] || "") + " · " + C.regions[P.r[i]].name));
      li.addEventListener("mousedown", function (e) { e.preventDefault(); pick(i); });
      results.appendChild(li);
    });
    results.hidden = false; input.setAttribute("aria-expanded", "true"); active = -1;
    if (found.length) mark(0);
  }
  function pick(i) { input.value = P.name[i]; closeResults(); goPlace(i); if (narrow()) input.blur(); }
  input.addEventListener("input", search);
  input.addEventListener("focus", function () { if (input.value) search(); });
  input.addEventListener("blur", function () { setTimeout(closeResults, 120); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" && found.length) { mark((active + 1) % found.length); e.preventDefault(); }
    else if (e.key === "ArrowUp" && found.length) { mark((active - 1 + found.length) % found.length); e.preventDefault(); }
    else if (e.key === "Enter" && active >= 0 && found[active] !== undefined) { pick(found[active]); e.preventDefault(); }
    else if (e.key === "Escape") { if (!results.hidden) { closeResults(); e.preventDefault(); e.stopPropagation(); } else if (input.value) { input.value = ""; e.preventDefault(); e.stopPropagation(); } }
  });

  // ---------- full screen ----------
  function setFull(on) {
    root.classList.toggle("is-full", on); document.documentElement.classList.toggle("pm-lock", on);
    fullBtn.setAttribute("aria-pressed", String(on)); fullBtn.setAttribute("aria-label", on ? T.exit_fullscreen : T.fullscreen); fullBtn.title = on ? T.exit_fullscreen : T.fullscreen;
    fullBtn.textContent = ""; fullBtn.appendChild(icon(on ? ICON.unfull : ICON.full));
  }
  fullBtn.addEventListener("click", function () { setFull(!root.classList.contains("is-full")); });

  // ---------- size, start ----------
  function offset() {
    var head = document.querySelector("header.site");
    root.style.setProperty("--pm-off", (head ? Math.round(head.getBoundingClientRect().height) : 0) + "px");
  }
  var first = true;
  new ResizeObserver(function () {
    var w = view.clientWidth, hgt = view.clientHeight;
    if (!w || !hgt || (w === vw && hgt === vh)) return;
    var centre = first ? null : toWorld(vw / 2, vh / 2);
    vw = w; vh = hgt; kMin = Math.min(vw / W, vh / H) * 0.95; fonts = {}; widths = {};
    svg.setAttribute("viewBox", "0 0 " + vw + " " + vh);
    kHome = homeView().k;
    if (first || !st.moved) { cam = hold(targetOfLevel()); first = false; }
    else cam = hold({ k: cam.k, tx: vw / 2 - centre[0] * cam.k, ty: vh / 2 - centre[1] * cam.k });
    apply(); layoutNames(); buildOrbit();
  }).observe(view);
  window.addEventListener("resize", offset);
  window.addEventListener("hashchange", function () { if (P) readHash(); });

  offset();
  view.tabIndex = 0;
  svg.removeAttribute("preserveAspectRatio");
  root.classList.add("is-on");
  setPanel(!window.matchMedia("(max-width: 760px)").matches);
  showYear(); renderCrumbs(); renderPanel();
  loadPlaces();
})();
