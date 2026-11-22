// Write the HyperFrames project of one film: film/<lang>-<shape>/ (index.html and one file per scene).
//   node scripts/compose.mjs en|ar wide|tall [teaser]
// Everything is laid out from build/<lang>/plan.json, so the picture, the captions and the voice share one clock.
// The files it writes are plain HTML and can be edited by hand or in the HyperFrames app afterwards; running this
// script again overwrites them.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync, copyFileSync, constants } from "node:fs";
import { ROOT } from "./units.mjs";

const [lang, shape, cut = "full"] = process.argv.slice(2);
const sfx = cut === "full" ? "" : "-" + cut;
const plan = JSON.parse(readFileSync(`${ROOT}build/${lang}/plan${sfx}.json`, "utf8"));
const tall = shape === "tall", ar = lang === "ar";
const W = tall ? 1080 : 1920, H = tall ? 1920 : 1080;
// Vertical: the phone recording (1080 x 1300) is shown at nine tenths, so the captions under it stay inside the band
// that TikTok, Reels and Shorts leave clear (168 to 1330 px from the top). The checker's own safe areas are
// stricter still and would put the captions on top of the map; the captions are marked as placed there on purpose.
const WIN = tall ? { x: 54, y: 28, w: 972, h: 1170, r: 26 } : { x: 128, y: 24, w: 1664, h: 936, r: 14 };
const CAP = tall ? { top: 1200, h: 118, max: 760, size: 44, chars: ar ? 54 : 56, hero: ar ? 66 : 60 }
                 : { top: 968, h: 104, max: 1640, size: ar ? 48 : 42, chars: ar ? 64 : 66, hero: ar ? 96 : 84 };
const out = `${ROOT}film/${lang}-${shape}${sfx}/`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const f = (n) => +(+n).toFixed(3);

// ---------- words that appear as type (the number card and the end card) ----------
const COPY = {
  en: {
    n1: ["50+", "explorers and browsers"], n2: ["63,078", "records"], n2note: "Record pages on 15 November 2026, drafts included",
    n3: "العربية · English · اردو", n4: "and still growing",
    name: "islam.museum", tagline: "A museum for the whole story of Islam", free: "Free, with no ads, forever",
    small: "Recorded from the live site, 15 November 2026 · AI-narrated · Music: the museum’s own “Fourteen Centuries”",
  },
  ar: {
    n1: ["+50", "مستكشفًا ومتصفحًا"], n2: ["63,078", "مادة"], n2note: "صفحات المواد في 15 نوفمبر 2026، ومنها المسودات",
    n3: "العربية · English · اردو", n4: "وما زال ينمو",
    name: "islam.museum", tagline: "متحفٌ لقصة الإسلام كاملةً", free: "مجانيٌّ بلا إعلانات، دائمًا",
    small: "مسجَّل من الموقع الحي، 22 نوفمبر 2026 · التعليق بصوتٍ آلي · الموسيقى: «أربعة عشر قرنًا» من مقطوعات المتحف",
  },
}[lang];

// ---------- shared styles ----------
const FONTS = `
  @font-face { font-family: "Inter"; font-weight: 500; src: url("assets/fonts/inter-latin-500-normal.woff2") format("woff2"); }
  @font-face { font-family: "Inter"; font-weight: 600; src: url("assets/fonts/inter-latin-600-normal.woff2") format("woff2"); }
  @font-face { font-family: "Source Serif 4"; font-weight: 600; src: url("assets/fonts/source-serif-4-latin-600-normal.woff2") format("woff2"); }
  @font-face { font-family: "Noto Naskh Arabic"; font-weight: 400; src: url("assets/fonts/noto-naskh-arabic-arabic-400-normal.woff2") format("woff2"); }
  @font-face { font-family: "Noto Naskh Arabic"; font-weight: 600; src: url("assets/fonts/noto-naskh-arabic-arabic-600-normal.woff2") format("woff2"); }
  @font-face { font-family: "Noto Naskh Arabic"; font-weight: 700; src: url("assets/fonts/noto-naskh-arabic-arabic-700-normal.woff2") format("woff2"); }
  @font-face { font-family: "Amiri"; font-weight: 700; src: url("assets/fonts/amiri-arabic-700-normal.woff2") format("woff2"); }`;
const BODY = ar ? `"Noto Naskh Arabic", "Inter"` : `"Inter", "Noto Naskh Arabic"`;
const DISPLAY = ar ? `"Amiri", "Noto Naskh Arabic"` : `"Source Serif 4", "Amiri"`;
const INK = "#f7f1e1", GOLD = "#e3c478", NAVY = "#0a2533";

// ---------- captions ----------
// One sentence at a time; a long sentence is shown in two or three parts, cut at its own punctuation, each part on
// screen for a share of the sentence's time in proportion to its length.
function chunks(text, max) {
  if (text.length <= max) return [text];
  const parts = text.split(/(?<=[,;:،؛])\s+/);
  const out = []; let cur = "";
  for (const p of parts) {
    if (!cur) cur = p; else if ((cur + " " + p).length <= max) cur += " " + p; else { out.push(cur); cur = p; }
  }
  if (cur) out.push(cur);
  return out.flatMap((c) => {
    if (c.length <= max) return [c];
    const w = c.split(" "), half = Math.ceil(w.length / 2);
    return [w.slice(0, half).join(" "), w.slice(half).join(" ")];
  });
}
const groups = [];
for (const s of plan.scenes) {
  const ids = Object.keys(s.cues);
  ids.forEach((id, i) => {
    const cue = s.cues[id], hero = s.look === "bleed" && !(tall && cue.show.length > 34);
    const parts = s.look === "card" ? [] : chunks(cue.show, hero ? 999 : CAP.chars);
    const total = parts.reduce((a, p) => a + p.replace(/\s/g, "").length, 0);
    let t = s.start + cue.at;
    const nextAt = i < ids.length - 1 ? s.start + s.cues[ids[i + 1]].at : s.start + s.dur;
    parts.forEach((p, k) => {
      const share = cue.dur * (p.replace(/\s/g, "").length / total);
      const last = k === parts.length - 1;
      let start = t - (k === 0 ? 0.08 : 0), end = last ? Math.min(nextAt - 0.06, t + share + (hero ? 0.6 : 0.35)) : t + share;
      if (groups.length === 0) start = 0; // frame 0 is the thumbnail: the first line is already there
      groups.push({ id: `cap-${groups.length}`, unit: id, text: p, start: f(start), dur: f(end - start), hero, scene: s.id });
      t += share;
    });
  });
}

const capStyle = `
  ${FONTS}
  #root { position: absolute; inset: 0; }
  .cap { position: absolute; left: ${tall ? 160 : 0}px; width: ${tall ? 760 : W}px; top: ${CAP.top}px; height: ${CAP.h}px; display: flex; align-items: center; justify-content: center; text-align: center; }
  .cap-t { display: block; max-width: ${CAP.max}px; font-family: ${BODY}; font-weight: ${ar ? 600 : 500}; font-size: ${CAP.size}px; line-height: ${ar ? (tall ? 1.32 : 1.5) : 1.28}; color: ${INK}; text-wrap: balance; }
  .cap.hero { ${tall ? "" : `top: ${H - 330}px; height: 190px;`} }
  .cap.hero .cap-t { font-family: ${DISPLAY}; font-weight: ${ar ? 700 : 600}; font-size: ${CAP.hero}px; line-height: 1.2; ${tall ? "" : "text-shadow: 0 2px 22px rgba(0,0,0,.9), 0 0 4px rgba(0,0,0,.8);"} }
  .cap.hero .cap-t.long { font-size: ${Math.round(CAP.hero * (tall ? 0.66 : 0.62))}px; max-width: ${tall ? 760 : 1500}px; }
  .cap-w { display: inline-block; white-space: pre; }
  .cap-n { font-family: "Inter"; font-weight: 500; font-size: 0.88em; }
  #cap-footer { position: absolute; left: 0; width: ${W}px; top: 1612px; height: 72px; display: flex; align-items: center; justify-content: center; gap: 18px; opacity: 0.62; direction: ltr; }
  #cap-footer img { width: 68px; height: 68px; display: block; }
  #cap-footer span { font-family: "Inter"; font-weight: 600; font-size: 44px; color: ${INK}; letter-spacing: -0.01em; }`;
// Vertical only: the name, under the band the apps keep clear, for the platforms that show that part of the frame.
const footerHtml = tall ? `    <div id="cap-footer" class="clip" data-start="0" data-duration="${plan.scenes[plan.scenes.length - 1].start}" data-track-index="2" data-layout-ignore><img src="assets/brand/mark-512.png" alt=""><span>islam.museum</span></div>\n` : "";
const capHtml = groups.map((g) => {
  const long = g.hero && g.text.length > 34;
  // In Arabic lines the figures come from the Latin face: set them a little lighter and smaller so they sit with the Naskh.
  const inner = g.hero ? g.text.split(" ").map((w, i, a) => `<span class="cap-w">${esc(w)}${i < a.length - 1 ? " " : ""}</span>`).join("")
    : ar ? esc(g.text).replace(/[0-9][0-9,]*/g, (m) => `<span class="cap-n">${m}</span>`) : esc(g.text);
  return `    <div id="${g.id}" class="clip cap${g.hero ? " hero" : ""}" data-start="${g.start}" data-duration="${g.dur}" data-track-index="1"${g.hero ? " data-layout-allow-caption-zone" : ""}${tall ? " data-layout-allow-safe-zone" : ""}><span class="cap-t${long ? " long" : ""}" id="${g.id}-t" dir="${ar ? "rtl" : "ltr"}">${inner}</span></div>`;
}).join("\n");
const capJs = groups.map((g) => {
  const end = f(g.start + g.dur);
  if (g.hero && g.start === 0) return `  tl.to("#${g.id}-t", { opacity: 0, filter: "blur(6px)", duration: 0.16, ease: "power2.in" }, ${f(end - 0.17)});`;
  if (g.hero) return `  tl.fromTo("#${g.id} .cap-w", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.16, stagger: 0.07, ease: "power2.out" }, ${g.start});
  tl.to("#${g.id}-t", { opacity: 0, filter: "blur(6px)", duration: 0.16, ease: "power2.in" }, ${f(end - 0.17)});`;
  return `  tl.fromTo("#${g.id}-t", { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "power1.out" }, ${g.start});
  tl.to("#${g.id}-t", { opacity: 0, duration: 0.1, ease: "power1.in" }, ${f(end - 0.11)});`;
}).join("\n");
const captionsFile = `<template>
  <style>${capStyle}
  </style>
  <div id="root" data-composition-id="captions" data-width="${W}" data-height="${H}">
${footerHtml}${capHtml}
  </div>
  <script>
  {
  const tl = gsap.timeline({ paused: true });
${capJs}
  tl.to({}, { duration: 0.01 }, ${f(plan.dur - 0.01)});
  window.__timelines["captions"] = tl;
  }
  </script>
</template>
`;

// ---------- recorded scenes ----------
const MONTAGE = new Set(["tb", "quran", "companions", "inventions", "kids"]);
function sceneFile(s, first) {
  const bleed = s.look === "bleed" && !tall, d = s.dur, id = s.id;
  const box = bleed ? { x: 0, y: 0, w: W, h: H, r: 0 } : WIN;
  const enter = first ? "" : MONTAGE.has(id)
    ? `  tl.fromTo("#${id}-in", { scale: 1.035 }, { scale: 1, duration: 0.45, ease: "power3.out" }, 0);`
    : `  tl.fromTo("#${id}-win", { opacity: 0, filter: "blur(12px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power2.out" }, 0);`;
  const leave = MONTAGE.has(id) && id !== "kids" ? "" : `  tl.to("#${id}-win", { opacity: 0, filter: "blur(10px)", duration: 0.15, ease: "power2.in" }, ${f(d - 0.16)});`;
  return `<template>
  <style>
    #root { position: absolute; inset: 0; }
    #${id}-win { position: absolute; left: ${box.x}px; top: ${box.y}px; width: ${box.w}px; height: ${box.h}px; border-radius: ${box.r}px; overflow: hidden; background: #0a0a0a; ${bleed ? "" : "box-shadow: 0 0 0 1.5px rgba(197,160,89,.5), 0 26px 70px rgba(0,0,0,.55);"} }
    #${id}-in { position: absolute; inset: 0; }
    #${id}-v { position: absolute; left: 0; top: 0; width: ${box.w}px; height: ${box.h}px; object-fit: cover; }
  </style>
  <div id="root" data-composition-id="${id}" data-width="${W}" data-height="${H}">
    <div id="${id}-win"><div id="${id}-in">
      <video id="${id}-v" class="clip" data-start="0" data-duration="${d}" data-track-index="1" src="assets/footage/${s.src || id}.mp4"${s.mediaStart ? ` data-media-start="${s.mediaStart}"` : ""} muted playsinline></video>
    </div></div>
  </div>
  <script>
  {
  const tl = gsap.timeline({ paused: true });
${enter}
${leave}
  tl.to({}, { duration: 0.01 }, ${f(d - 0.01)});
  window.__timelines["${id}"] = tl;
  }
  </script>
</template>
`;
}

// ---------- the number card ----------
function numbersFile(s) {
  const id = "numbers", d = s.dur, c = s.cues, at = (u) => c[u].at;
  const stills = existsSync(`${ROOT}footage/${lang}/stills`) ? readdirSync(`${ROOT}footage/${lang}/stills`).filter((x) => x.endsWith(".jpg")).sort() : [];
  const cols = tall ? 3 : 4, rows = tall ? 5 : 4, tw = W / cols, th = tall ? 1340 / rows : H / rows;
  const tiles = Array.from({ length: cols * rows }, (_, i) => stills.length ? stills[i % stills.length] : null);
  const band = tall ? { top: 380, h: 360 } : { top: 372, h: 336 }; // vertical: above the height where TikTok's button column begins
  const big = tall ? 150 : 190, lab = tall ? 50 : 64;
  const tileHtml = tiles.map((t, i) => `      <div class="nb-tile" id="nb-t${i}" style="left:${f((i % cols) * tw)}px;top:${f(Math.floor(i / cols) * th)}px;width:${f(tw)}px;height:${f(th)}px">${t ? `<img src="assets/stills/${t}" alt="">` : ""}</div>`).join("\n");
  const line = (k, html) => `      <div class="nb-line" id="nb-l${k}">${html}</div>`;
  const numLine = (n) => `<span class="nb-num" dir="ltr">${esc(n[0])}</span><span class="nb-lab">${esc(n[1])}</span>`;
  return `<template>
  <style>
    ${FONTS}
    #root { position: absolute; inset: 0; }
    #nb-grid { position: absolute; left: 0; top: 0; width: ${W}px; height: ${tall ? 1340 : H}px; overflow: hidden; background: #071a24; }
    #nb-zoom { position: absolute; inset: 0; }
    .nb-tile { position: absolute; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(197,160,89,.35); background: #0d2d3a; }
    .nb-tile img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
    #nb-band { position: absolute; left: 0; width: ${W}px; top: ${band.top}px; height: ${band.h}px; background: ${NAVY}; box-shadow: 0 -1px 0 rgba(197,160,89,.6), 0 1px 0 rgba(197,160,89,.6), 0 0 80px rgba(0,0,0,.6); }
    .nb-line { position: absolute; left: 0; top: 0; width: ${W}px; height: ${band.h}px; display: flex; flex-direction: ${tall ? "column" : "row"}; align-items: ${tall ? "center" : "baseline"}; justify-content: center; gap: ${tall ? 6 : 34}px; ${tall ? "" : `padding-top: ${Math.round((band.h - big * 1.1) / 2)}px;`} direction: ${ar ? "rtl" : "ltr"}; }
    .nb-num { font-family: "Source Serif 4"; font-weight: 600; font-size: ${big}px; line-height: 1.1; color: ${GOLD}; letter-spacing: -0.01em; }
    .nb-lab { font-family: ${DISPLAY}; font-weight: ${ar ? 700 : 600}; font-size: ${lab}px; line-height: 1.2; color: ${INK}; }
    #nb-l2 .nb-lab, #nb-l3 .nb-lab { font-size: ${tall ? 68 : 96}px; }
    #nb-l2, #nb-l3 { align-items: center; padding-top: 0; }
    #nb-note { position: absolute; left: ${tall ? 160 : 0}px; width: ${tall ? 760 : W}px; top: ${band.top + band.h - (tall ? 62 : 58)}px; text-align: center; font-family: ${BODY}; font-weight: ${ar ? 400 : 500}; font-size: ${tall ? 28 : 28}px; color: #cfc4a6; direction: ${ar ? "rtl" : "ltr"}; }
  </style>
  <div id="root" data-composition-id="${id}" data-width="${W}" data-height="${H}">
    <div id="nb-grid" data-layout-ignore><div id="nb-zoom">
${tileHtml}
    </div></div>
    <div id="nb-band">
${line(0, numLine(COPY.n1))}
${line(1, numLine(COPY.n2))}
${line(2, `<span class="nb-lab" dir="auto">${esc(COPY.n3)}</span>`)}
${line(3, `<span class="nb-lab">${esc(COPY.n4)}</span>`)}
    </div>
    <div id="nb-note">${esc(COPY.n2note)}</div>
  </div>
  <script>
  {
  const tl = gsap.timeline({ paused: true });
  tl.fromTo("#nb-zoom", { scale: 1.12 }, { scale: 1, duration: ${f(d)}, ease: "power1.out" }, 0);
  tl.fromTo(".nb-tile", { opacity: 0 }, { opacity: 1, duration: 0.22, stagger: { each: 0.045, from: "random" }, ease: "power1.out" }, 0);
  tl.fromTo("#nb-band", { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "power3.out" }, 0.05);
  const show = (k, t0, t1) => {
    tl.fromTo("#nb-l" + k, { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power2.out" }, t0);
    if (t1) tl.to("#nb-l" + k, { opacity: 0, filter: "blur(8px)", duration: 0.14, ease: "power2.in" }, t1 - 0.15);
  };
  tl.set(".nb-line, #nb-note", { opacity: 0 }, 0);
  show(0, ${f(at("e6_0") - 0.05)}, ${f(at("e6_1") - 0.05)});
  show(1, ${f(at("e6_1") - 0.05)}, ${f(at("e6_2") - 0.05)});
  tl.fromTo("#nb-note", { opacity: 0 }, { opacity: 1, duration: 0.2 }, ${f(at("e6_1") + 0.25)});
  tl.to("#nb-note", { opacity: 0, duration: 0.12 }, ${f(at("e6_2") - 0.2)});
  show(2, ${f(at("e6_2") - 0.05)}, ${f(at("e6_3") - 0.05)});
  show(3, ${f(at("e6_3") - 0.05)}, 0);
  tl.to("#root", { opacity: 0, duration: 0.16, ease: "power2.in" }, ${f(d - 0.17)});
  window.__timelines["${id}"] = tl;
  }
  </script>
</template>
`;
}

// ---------- the end card ----------
function endFile(s) {
  const id = "end", d = s.dur, at = (u) => s.cues[u].at;
  // Vertical: everything sits in a 640 px column in the middle of the frame, clear of the apps' right-hand buttons
  // and of the band they cover at the bottom.
  // TikTok's button column takes the right fifth of the frame from about 800 px down, so the lines that matter sit
  // above that and the small print below it is narrower.
  const cy = tall ? 310 : 300, mark = tall ? 220 : 250;
  const Y = tall ? { name: 20, tag: 140, free: 270, langs: 350, small: 870 } : { name: 30, tag: 186, free: 280, langs: 400, small: H - 96 };
  const col = tall ? `left: 220px; width: 640px;` : `left: 0; width: ${W}px;`;
  return `<template>
  <style>
    ${FONTS}
    #root { position: absolute; inset: 0; }
    #end-mark { position: absolute; left: ${(W - mark) / 2}px; top: ${cy - mark / 2}px; width: ${mark}px; height: ${mark}px; }
    #end-mark img { width: 100%; height: 100%; display: block; }
    #end-name { position: absolute; ${col} top: ${cy + mark / 2 + Y.name}px; text-align: center; font-family: "Inter"; font-weight: 600; font-size: ${tall ? 88 : 120}px; line-height: 1.15; color: ${INK}; letter-spacing: -0.02em; direction: ltr; }
    #end-tag { position: absolute; ${col} top: ${cy + mark / 2 + Y.tag}px; text-align: center; font-family: ${DISPLAY}; font-weight: ${ar ? 700 : 600}; font-size: ${tall ? 40 : 50}px; line-height: 1.3; color: #cfc4a6; text-wrap: balance; direction: ${ar ? "rtl" : "ltr"}; }
    #end-free { position: absolute; ${col} top: ${cy + mark / 2 + Y.free}px; text-align: center; font-family: ${DISPLAY}; font-weight: ${ar ? 700 : 600}; font-size: ${tall ? 48 : 72}px; line-height: 1.25; color: ${GOLD}; direction: ${ar ? "rtl" : "ltr"}; }
    #end-langs { position: absolute; ${col} top: ${cy + mark / 2 + Y.langs}px; text-align: center; font-family: "Noto Naskh Arabic", "Inter"; font-weight: 600; font-size: ${tall ? 40 : 38}px; color: ${INK}; }
    #end-small { position: absolute; left: ${tall ? 280 : 160}px; width: ${tall ? 520 : W - 320}px; top: ${Y.small}px; text-align: center; font-family: ${BODY}; font-weight: ${ar ? 400 : 500}; font-size: 28px; line-height: 1.45; color: #a9b8bd; direction: ${ar ? "rtl" : "ltr"}; text-wrap: balance; }
    .end-w { display: inline-block; white-space: pre; }
  </style>
  <div id="root" data-composition-id="${id}" data-width="${W}" data-height="${H}">
    <div id="end-mark"><img src="assets/brand/mark-512.png" alt=""></div>
    <div id="end-name">${[..."islam.museum"].map((ch) => `<span class="end-w">${ch}</span>`).join("")}</div>
    <div id="end-tag">${esc(COPY.tagline)}</div>
    <div id="end-free">${COPY.free.split(" ").map((w, i, a) => `<span class="end-w">${esc(w)}${i < a.length - 1 ? " " : ""}</span>`).join("")}</div>
    <div id="end-langs">${esc(COPY.n3)}</div>
    <div id="end-small" data-layout-allow-caption-zone>${esc(COPY.small)}</div>
  </div>
  <script>
  {
  const tl = gsap.timeline({ paused: true });
  tl.fromTo("#root", { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power1.out" }, 0);
  tl.fromTo("#end-mark", { scale: 0.2, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, 0.05);
  tl.fromTo("#end-name .end-w", { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.14, stagger: 0.035, ease: "power2.out" }, ${f(Math.max(0.3, at("e1_0") - 0.05))});
  tl.fromTo("#end-tag", { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out" }, ${f(at("e1_0") + 0.55)});
  tl.fromTo("#end-free .end-w", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.18, stagger: 0.11, ease: "power2.out" }, ${f(at("e1_1"))});
  tl.fromTo("#end-langs", { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${f(at("e1_1") + 1.0)});
  tl.fromTo("#end-small", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5);
  tl.to({}, { duration: 0.01 }, ${f(d - 0.01)});
  window.__timelines["${id}"] = tl;
  }
  </script>
</template>
`;
}

// ---------- the root ----------
const hosts = plan.scenes.map((s) => `      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.start}" data-duration="${s.dur}" data-track-index="1" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>`).join("\n");
const index = `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>islam.museum: the Place map, a walkthrough (${lang}, ${shape})</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      @font-face { font-family: "Inter"; font-weight: 600; src: url("assets/fonts/inter-latin-600-normal.woff2") format("woff2"); }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: ${NAVY}; }
      #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
      /* The ground: the site's own hero gradient and lattice. It never cuts; scenes change on top of it. */
      #ground { position: absolute; inset: 0; background: linear-gradient(160deg, #0a2533 0%, #113f4e 100%); }
      #lattice { position: absolute; inset: 0; background-image: url("assets/brand/lattice.svg"); background-size: 120px 120px; opacity: 0.07; }
      ${plan.scenes.map((s) => `#${s.id}`).join(", ")} { z-index: 2; }

      #captions { z-index: 3; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${plan.dur}" data-width="${W}" data-height="${H}">
      <div id="ground"></div>
      <div id="lattice" data-layout-ignore></div>

      <!-- One scene per file; times come from the narration (build/${lang}/plan.json). -->
${hosts}

      <!-- Captions: the narration, sentence by sentence. -->
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${plan.dur}" data-track-index="2" data-track-kind="captions" data-width="${W}" data-height="${H}"></div>

      <!-- Sound: the narration, and under it the museum's own music. -->
      <audio id="a-voice" src="assets/audio/voice.wav" data-start="0" data-duration="${plan.dur}" data-track-index="3" data-volume="1"></audio>
      <audio id="a-music" src="assets/audio/bed.wav" data-start="0" data-duration="${plan.dur}" data-track-index="4" data-volume="1"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      tl.to({}, { duration: ${plan.dur} }, 0);
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

// ---------- write ----------
mkdirSync(out + "compositions", { recursive: true });
mkdirSync(out + "assets", { recursive: true });
// The renderer bundles only what is inside the project folder, so the media is copied in (on this Mac's file
// system a copy of this kind takes no extra space) rather than linked.
const mirror = (name, from, keep = () => true) => {
  const to = out + "assets/" + name; rmSync(to, { force: true, recursive: true }); mkdirSync(to, { recursive: true });
  if (!existsSync(from)) return;
  for (const x of readdirSync(from)) if (keep(x) && statSync(from + "/" + x).isFile()) copyFileSync(from + "/" + x, to + "/" + x, constants.COPYFILE_FICLONE);
};
mirror("fonts", `${ROOT}assets/fonts`);
mirror("brand", `${ROOT}assets/brand`);
mirror("footage", `${ROOT}footage/${lang}/${shape}`, (x) => x.endsWith(".mp4"));
mirror("stills", `${ROOT}footage/${lang}/stills`, (x) => x.endsWith(".jpg"));
mirror("audio", `${ROOT}build/${lang}/audio${sfx}`, (x) => x === "voice.wav" || x === "bed.wav");
writeFileSync(out + "index.html", index);
plan.scenes.forEach((s, i) => writeFileSync(out + `compositions/${s.id}.html`, s.id === "numbers" ? numbersFile(s) : s.id === "end" ? endFile(s) : sceneFile(s, i === 0)));
writeFileSync(out + "compositions/captions.html", captionsFile);
writeFileSync(out + "hyperframes.json", JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry", paths: { blocks: "compositions", components: "compositions/components", assets: "assets" }, media: { autoProxy: true } }, null, 2) + "\n");
writeFileSync(out + "meta.json", JSON.stringify({ id: `place-walkthrough-${lang}-${shape}${sfx}`, name: `place-walkthrough-${lang}-${shape}${sfx}` }, null, 2) + "\n");
writeFileSync(out + "package.json", JSON.stringify({ name: `place-walkthrough-${lang}-${shape}${sfx}`, private: true, type: "module", scripts: { dev: "npx --yes hyperframes@0.9.52 preview", check: "npx --yes hyperframes@0.9.52 check", render: "npx --yes hyperframes@0.9.52 render" } }, null, 2) + "\n");

// Subtitles for the platforms that take a file (YouTube, Facebook).
const ts = (t) => { const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s2 = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s2).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
let n = 0; const srt = [];
for (const s of plan.scenes) for (const [, cue] of Object.entries(s.cues)) srt.push(`${++n}\n${ts(s.start + cue.at)} --> ${ts(s.start + cue.at + cue.dur + 0.15)}\n${cue.show}\n`);
mkdirSync(`${ROOT}renders`, { recursive: true });
writeFileSync(`${ROOT}renders/islam-museum-arabiyya-walkthrough-${lang}.srt`, srt.join("\n"));
console.log(`wrote ${out}  (${plan.scenes.length} scenes, ${groups.length} caption groups, ${plan.dur} s)`);
