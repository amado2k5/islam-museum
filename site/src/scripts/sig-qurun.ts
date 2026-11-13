// "The wheel of the Hijri year" (site/src/components/sig/HijriWheel.astro): the twelve months are drawn and linked in the
// HTML; this script only adds the readout in the centre (month name, its place in the year, its passage count, with the
// split by corpus beneath the wheel), the arrow keys round the wheel, and the touch rule: the first tap on a month shows
// it, the second opens its page. A mouse click, and Enter on a month the keyboard has already reached, open it at once.
(() => {
const root = document.querySelector<HTMLElement>("[data-sg-q]");
if (!root) return;
const segs = [...root.querySelectorAll<SVGAElement>("a.sg-q-seg")];
const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
const idle = q("[data-sg-idle]"), live = q("[data-sg-live]");
const of = q("[data-sg-of]"), name = q("[data-sg-name]"), total = q("[data-sg-total]");
const hint = q("[data-sg-hint]"), detail = q("[data-sg-detail]"), split = q("[data-sg-split]");
const open = q<HTMLAnchorElement>("[data-sg-open]");
const rtl = root.dataset.rtl === "1";
let current = 0, selected: SVGAElement | null = null, lastType = "mouse";

const show = (s: SVGAElement | null) => {
  segs.forEach((x) => x.classList.toggle("is-on", x === s));
  idle.hidden = !!s; live.hidden = !s; hint.hidden = !!s; detail.hidden = !s;
  if (!s) return;
  of.textContent = s.dataset.of ?? ""; name.textContent = s.dataset.name ?? ""; total.textContent = s.dataset.total ?? "";
  split.textContent = s.dataset.split ?? "";
  open.href = s.getAttribute("href") ?? "#";
};
const settle = (s: SVGAElement) => { segs.forEach((x) => x.tabIndex = x === s ? 0 : -1); current = segs.indexOf(s); };

segs.forEach((s) => {
  s.addEventListener("pointerdown", (e) => { lastType = e.pointerType; });
  s.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(s); });
  s.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") show(selected); });
  s.addEventListener("focus", () => { settle(s); show(s); });
  s.addEventListener("blur", () => show(selected));
  s.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (lastType !== "mouse" && e.detail > 0 && selected !== s) { e.preventDefault(); selected = s; settle(s); show(s); }
    lastType = "mouse";
  });
});
settle(segs[0]);
root.addEventListener("keydown", (e) => {
  const k = e.key;
  const fwd = rtl ? ["ArrowLeft", "ArrowDown"] : ["ArrowRight", "ArrowDown"];
  const back = rtl ? ["ArrowRight", "ArrowUp"] : ["ArrowLeft", "ArrowUp"];
  let to = -1;
  if (fwd.includes(k)) to = (current + 1) % segs.length;
  else if (back.includes(k)) to = (current + segs.length - 1) % segs.length;
  else if (k === "Home") to = 0;
  else if (k === "End") to = segs.length - 1;
  else if (k === "Escape") { selected = null; show(null); return; }
  if (to < 0 || !segs.includes(document.activeElement as any)) return;
  e.preventDefault();
  selected = null;
  segs[to].focus();
});
})();
