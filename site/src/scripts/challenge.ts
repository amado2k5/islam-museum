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
  // Two-step inline reset: first click arms, second click confirms.
  // (Native confirm() dialogs are suppressed in some embedded contexts,
  // which left the button dead; this works everywhere and is keyboard-safe.)
  const resetBtn = root.querySelector("[data-reset]") as HTMLButtonElement;
  const resetLabel = resetBtn.textContent || "";
  const confirmLabel = resetBtn.dataset.confirm || resetLabel;
  let armed = false;
  let armTimer: number | undefined;
  const disarm = () => {
    armed = false;
    resetBtn.textContent = resetLabel;
    resetBtn.removeAttribute("data-armed");
    if (armTimer !== undefined) { clearTimeout(armTimer); armTimer = undefined; }
  };
  resetBtn.addEventListener("click", () => {
    if (!armed) {
      armed = true;
      resetBtn.textContent = confirmLabel;
      resetBtn.setAttribute("data-armed", "true");
      armTimer = window.setTimeout(disarm, 5000);
      return;
    }
    disarm();
    state = {};
    try { localStorage.removeItem(key); } catch {}
    paint();
  });
  resetBtn.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && armed) { disarm(); }
  });
  paint();
}
document.querySelectorAll("[data-challenge]").forEach((r) => init(r as HTMLElement));
}
