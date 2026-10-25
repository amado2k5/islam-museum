// Gift shop carousel (landing page): arrows step one card at a time and wrap around; while the pointer rests on the carousel it
// auto-slides, and it stops when the pointer leaves. Visitors who ask the system for reduced motion get no auto-slide. Runs only in the browser.
const root = document.querySelector<HTMLElement>("[data-carousel]");
const track = root?.querySelector<HTMLElement>("[data-track]");
const frame = root?.querySelector<HTMLElement>(".frame");
const prev = root?.querySelector<HTMLButtonElement>("[data-prev]");
const next = root?.querySelector<HTMLButtonElement>("[data-next]");

if (root && track && frame && prev && next) {
  const slides = Array.from(track.children) as HTMLElement[];
  const interval = Number(root.dataset.interval) || 3500;
  const rtl = getComputedStyle(track).direction === "rtl";
  let index = 0;
  let timer: number | undefined;

  // One step is a card plus the gap; the carousel can move until its last card lines up with the frame's far edge.
  const metrics = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = slides[0].getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.floor((frame.clientWidth - 28) / step));
    return { step, last: Math.max(0, slides.length - visible) };
  };

  const show = (i: number) => {
    const { step, last } = metrics();
    index = ((i % (last + 1)) + (last + 1)) % (last + 1);
    // In RTL the first card sits on the right, so moving forward slides the track to the right.
    const offset = index * step * (rtl ? 1 : -1);
    track.style.transform = `translateX(${offset}px)`;
  };

  const stop = () => { if (timer !== undefined) { window.clearInterval(timer); timer = undefined; } };
  const start = () => {
    if (timer !== undefined || (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.getAttribute("data-motion") === "reduce")) return;
    timer = window.setInterval(() => {
      if (document.documentElement.getAttribute("data-motion") === "reduce") { stop(); return; }
      show(index + 1);
    }, interval);
  };

  prev.addEventListener("click", () => { show(index - 1); });
  next.addEventListener("click", () => { show(index + 1); });
  // Hovering a mouse over the carousel starts the auto-slide; moving the mouse off stops it. Touch screens use the arrows.
  root.addEventListener("mouseenter", start);
  root.addEventListener("mouseleave", stop);
  window.addEventListener("resize", () => show(index));
  show(0);
}
