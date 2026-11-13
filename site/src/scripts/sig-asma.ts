// "The ninety-nine beads" (site/src/components/sig/AsmaBeads.astro): the beads are real links in the HTML; this script
// only adds the readout in the centre of the string (name, enumeration number, Qur'an mention count, meaning), the
// arrow keys along the string, and the touch rule: the first tap on a bead shows it, the second opens its page. A mouse
// click, and Enter on a bead the keyboard has already reached, open the page at once.
(() => {
const root = document.querySelector<HTMLElement>("[data-sg-asma]");
if (!root) return;
const beads = [...root.querySelectorAll<SVGAElement>("a.sg-asma-bead")];
const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
const idle = q("[data-sg-idle]"), live = q("[data-sg-live]");
const no = q("[data-sg-no]"), ar = q("[data-sg-ar]"), tr = q("[data-sg-tr]"), meaning = q("[data-sg-meaning]");
const hint = q("[data-sg-hint]"), detail = q("[data-sg-detail]"), count = q("[data-sg-count]"), sum = q("[data-sg-sum]");
const open = q<HTMLAnchorElement>("[data-sg-open]"), rootBox = q("[data-sg-root]"), rootWrap = q(".sg-asma-root");
const data: { o: string; a: string; t: string; r: string; c: string; m: string }[] = JSON.parse(root.querySelector("[data-sg-data]")?.textContent ?? "[]");
const rtl = root.dataset.rtl === "1";
let current = 0, selected: SVGAElement | null = null, lastType = "mouse";

const show = (b: SVGAElement | null) => {
  beads.forEach((x) => x.classList.toggle("is-on", x === b));
  idle.hidden = !!b; live.hidden = !b; hint.hidden = !!b; detail.hidden = !b;
  if (!b) return;
  const d = data[Number(b.dataset.i)];
  if (!d) return;
  no.textContent = d.o; ar.textContent = d.a; tr.textContent = d.t;
  meaning.textContent = d.m; sum.textContent = d.m;
  count.textContent = d.c;
  open.href = b.getAttribute("href") ?? "#";
  rootBox.textContent = d.r; rootWrap.hidden = !d.r;
};
const settle = (b: SVGAElement) => { beads.forEach((x) => x.tabIndex = x === b ? 0 : -1); current = beads.indexOf(b); };

beads.forEach((b) => {
  b.addEventListener("pointerdown", (e) => { lastType = e.pointerType; });
  b.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(b); });
  b.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") show(selected ?? (document.activeElement && beads.includes(document.activeElement as any) ? (document.activeElement as SVGAElement) : null)); });
  b.addEventListener("focus", () => { settle(b); show(b); });
  b.addEventListener("blur", () => show(selected));
  b.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (lastType !== "mouse" && e.detail > 0 && selected !== b) { e.preventDefault(); selected = b; settle(b); show(b); }
    lastType = "mouse";
  });
});
settle(beads[0]);
root.addEventListener("keydown", (e) => {
  const k = e.key;
  const fwd = rtl ? ["ArrowLeft", "ArrowDown"] : ["ArrowRight", "ArrowDown"];
  const back = rtl ? ["ArrowRight", "ArrowUp"] : ["ArrowLeft", "ArrowUp"];
  let to = -1;
  if (fwd.includes(k)) to = Math.min(beads.length - 1, current + 1);
  else if (back.includes(k)) to = Math.max(0, current - 1);
  else if (k === "Home") to = 0;
  else if (k === "End") to = beads.length - 1;
  else if (k === "PageDown") to = Math.min(beads.length - 1, current + 33);
  else if (k === "PageUp") to = Math.max(0, current - 33);
  else if (k === "Escape") { selected = null; show(null); return; }
  if (to < 0 || !beads.includes(document.activeElement as any)) return;
  e.preventDefault();
  selected = null;
  beads[to].focus();
});
})();
