// The Grand Tour's enhancements. Every page of the Tour is complete without this file: the river is a plain list,
// the rooms link to each other, the completion room states its counts. This script lets the visitor take hold of
// the river (drag, slider, buttons), remembers on this device which rooms were visited (localStorage only: no
// account, no server, no request), and lets the arrow keys walk between rooms.
// A plain file, like shell.js and entity.js beside it, and for the same reason: a script that goes through the site's
// bundler changes the hashed names of script chunks that other pages reference, and every such page would then be
// re-uploaded on the next deploy.
(function () {
"use strict";
const KEY = "grand-tour";
const get = () => { try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") ?? {}; } catch { return {}; } };
const set = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode: the tour works without it */ } };
const calm = () => document.documentElement.getAttribute("data-motion") === "reduce" || matchMedia("(prefers-reduced-motion: reduce)").matches;
const rtl = document.documentElement.dir === "rtl";

// ---- a room: remember the visit; arrow keys walk the tour in reading direction ----
const room = document.querySelector("[data-gt-room]");
if (room) {
  const st = get(), slug = room.dataset.gtRoom;
  st.seen = [...new Set([...(st.seen ?? []), slug])];
  st.last = slug;
  set(st);
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest("input, textarea, select, summary, [contenteditable]")) return;
    const forward = e.key === (rtl ? "ArrowLeft" : "ArrowRight"), back = e.key === (rtl ? "ArrowRight" : "ArrowLeft");
    const a = forward ? document.querySelector("[data-gt-next]") : back ? document.querySelector("[data-gt-prev]") : null;
    if (a) location.href = a.href;
  });
}

// ---- the river ----
const river = document.querySelector("[data-gt-river]");
if (river) {
  const st = get();
  const seen = new Set(st.seen ?? []);
  river.querySelectorAll("[data-gt-stop]").forEach((a) => {
    if (seen.has(a.dataset.gtStop)) a.setAttribute("data-visited", "");
    if (st.last && a.dataset.gtStop === st.last) {
      const resume = document.querySelector("[data-gt-resume]");
      if (resume) { resume.href = a.href; resume.hidden = false; }
    }
  });
  const reaches = [...river.querySelectorAll(".gt-reach")];
  const ctl = document.querySelector("[data-gt-ctl]");
  const scrub = document.querySelector("[data-gt-scrub]");
  const now = document.querySelector("[data-gt-now]");
  const go = (i) => reaches[Math.max(0, Math.min(reaches.length - 1, i))].scrollIntoView({ inline: "start", block: "nearest", behavior: calm() ? "auto" : "smooth" });
  // the reach under the river's leading edge (its left edge when reading left-to-right, its right edge otherwise)
  const current = () => {
    const edge = river.getBoundingClientRect();
    let best = 0;
    reaches.forEach((el, i) => { const r = el.getBoundingClientRect(); if (rtl ? r.right >= edge.right - 4 : r.left <= edge.left + 4) best = i; });
    return best;
  };
  const earlier = document.querySelector("[data-gt-earlier]"), later = document.querySelector("[data-gt-later]");
  const paint = () => {
    const i = current();
    if (scrub) scrub.value = String(i);
    if (now) now.textContent = reaches[i]?.querySelector(".gt-century")?.textContent ?? "";
    if (earlier) earlier.disabled = i === 0;
    // "later" has nowhere to go once the band is scrolled to its end, even if the last stretch is not at the leading edge
    if (later) later.disabled = i === reaches.length - 1 || Math.abs(river.scrollLeft) + river.clientWidth >= river.scrollWidth - 4;
  };
  if (ctl) ctl.hidden = false;
  scrub?.addEventListener("input", () => go(Number(scrub.value)));
  earlier?.addEventListener("click", () => go(current() - 1));
  later?.addEventListener("click", () => go(current() + 1));
  let tick = 0;
  river.addEventListener("scroll", () => { cancelAnimationFrame(tick); tick = requestAnimationFrame(paint); }, { passive: true });
  paint();
  // take hold of the current: drag with a mouse (touch and trackpads scroll the band natively)
  let down = null, moved = false;
  river.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" || e.button !== 0) return; down = { x: e.clientX, left: river.scrollLeft }; moved = false; });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    if (!moved && Math.abs(dx) < 5) return;
    moved = true;
    river.classList.add("dragging");
    river.scrollLeft = down.left - dx;
  });
  window.addEventListener("pointerup", () => { down = null; river.classList.remove("dragging"); });
  river.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
}

// ---- the completion room: mark the rooms this device has visited ----
const tally = document.querySelector("[data-gt-visited]");
if (tally) {
  const seen = new Set(get().seen ?? []);
  let k = 0;
  document.querySelectorAll("[data-gt-node]").forEach((c) => { if (seen.has(c.getAttribute("data-gt-node"))) { c.setAttribute("data-visited", ""); k++; } });
  if (k > 0) { tally.textContent = (tally.dataset.tpl ?? "").replace("{k}", String(k)).replace("{n}", tally.dataset.total ?? ""); tally.hidden = false; }
}
})();
