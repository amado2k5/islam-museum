// ChallengeTracker client: toggle cells, persist to localStorage, progress %.
{
function init(root: HTMLElement) {
  const slug = root.dataset.slug!;
  const key = `cards-challenge-${slug}`;
  const bar = root.querySelector("[data-bar]") as HTMLElement;
  const pct = root.querySelector("[data-pct]")!;
  const cells = [...root.querySelectorAll(".cell")] as HTMLButtonElement[];
  let state: Record<string, boolean> = {};
  try { state = JSON.parse(localStorage.getItem(key) || "{}"); } catch { state = {}; }

  const paint = () => {
    let on = 0;
    cells.forEach((c) => {
      const k = `${c.dataset.h}:${c.dataset.d}`;
      const v = !!state[k];
      c.setAttribute("aria-pressed", v ? "true" : "false");
      if (v) on++;
    });
    const p = Math.round((on / cells.length) * 100);
    bar.style.width = `${p}%`;
    pct.textContent = `${p}%`;
  };
  cells.forEach((c) => c.addEventListener("click", () => {
    const k = `${c.dataset.h}:${c.dataset.d}`;
    state[k] = !state[k];
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
    paint();
  }));
  root.querySelector("[data-reset]")!.addEventListener("click", () => {
    if (!confirm(root.querySelector("[data-reset]")!.textContent || "?")) return;
    state = {};
    try { localStorage.removeItem(key); } catch {}
    paint();
  });
  paint();
}
document.querySelectorAll("[data-challenge]").forEach((r) => init(r as HTMLElement));
}
