// Pathway client (docs/plan/19-tour-learn.md): turns the static step list into
// a step-by-step walk — one card at a time, progress bar, prev/next/skip,
// resume. Position lives in localStorage only; without JS the ordered list
// stays fully readable.
{
const KEY = (id: string) => `pw:${id}`;
const store = {
  get(id: string) { try { return localStorage.getItem(KEY(id)); } catch { return null; } },
  set(id: string, v: string) { try { localStorage.setItem(KEY(id), v); } catch { /* private mode */ } },
};
function init(root: HTMLElement) {
  const id = root.getAttribute("data-pathway")!;
  const steps = [...root.querySelectorAll("[data-step]")] as HTMLElement[];
  const skips = [...root.querySelectorAll("[data-skip]")] as HTMLButtonElement[];
  const fill = root.querySelector("[data-fill]") as HTMLElement;
  const count = root.querySelector("[data-count]")!;
  const walkBtn = root.querySelector("[data-walk]") as HTMLButtonElement;
  const allBtn = root.querySelector("[data-all]") as HTMLButtonElement;
  const resumeBtn = root.querySelector("[data-resume]") as HTMLButtonElement;
  const prevBtn = root.querySelector("[data-prev]") as HTMLButtonElement;
  const nextBtn = root.querySelector("[data-next]") as HTMLButtonElement;
  if (!steps.length || !walkBtn) return;
  let i = 0, walking = false;
  const saved = () => parseInt(store.get(id) ?? "", 10);
  const offerResume = () => { const s = saved(); resumeBtn.hidden = !(s > 0 && s < steps.length); };

  const show = (n: number) => {
    i = Math.max(0, Math.min(steps.length - 1, n));
    steps.forEach((s, k) => {
      s.hidden = walking && k !== i;
      s.classList.toggle("pw-current", walking && k === i);
    });
    skips.forEach((b) => { b.hidden = !walking; });
    fill.style.width = `${((i + 1) / steps.length) * 100}%`;
    count.textContent = walking ? `${i + 1} / ${steps.length}` : "";
    prevBtn.hidden = nextBtn.hidden = !walking;
    prevBtn.disabled = i === 0;
    if (walking) {
      store.set(id, String(i));
      if (steps[i].getBoundingClientRect().top < 0) steps[i].scrollIntoView({ block: "nearest" });
    }
  };
  const start = (at: number) => {
    walking = true;
    walkBtn.hidden = true; allBtn.hidden = false; resumeBtn.hidden = true;
    show(at);
  };
  const stop = () => {
    walking = false;
    walkBtn.hidden = false; allBtn.hidden = true;
    steps.forEach((s) => { s.hidden = false; s.classList.remove("pw-current"); });
    skips.forEach((b) => { b.hidden = true; });
    count.textContent = ""; prevBtn.hidden = nextBtn.hidden = true;
    offerResume();
  };
  const finish = () => { store.set(id, "done"); stop(); root.querySelector("[data-recap]")?.scrollIntoView({ block: "nearest" }); };

  walkBtn.addEventListener("click", () => start(0));
  allBtn.addEventListener("click", stop);
  resumeBtn.addEventListener("click", () => start(saved()));
  prevBtn.addEventListener("click", () => show(i - 1));
  nextBtn.addEventListener("click", () => (i >= steps.length - 1 ? finish() : show(i + 1)));
  skips.forEach((b) => b.addEventListener("click", () => show(i + 1)));
  root.querySelector("[data-print]")?.addEventListener("click", () => window.print());
  const rtl = getComputedStyle(root).direction === "rtl";
  root.addEventListener("keydown", (e) => {
    if (!walking) return;
    if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) show(i + 1);
    if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) show(i - 1);
  });
  root.tabIndex = 0;
  offerResume();
}
document.querySelectorAll("[data-pathway]").forEach((r) => init(r as HTMLElement));
}
