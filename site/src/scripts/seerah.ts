// Seerah & Life guide: search box + horizon/domain chips that hide and show the
// practice cards. Progressive enhancement only — without JavaScript every card
// stays visible and readable as <details>.
(() => {
  const q = document.getElementById("q") as HTMLInputElement | null;
  const hzBtns = Array.from(document.querySelectorAll<HTMLElement>(".fchip.hz"));
  const dmBtns = Array.from(document.querySelectorAll<HTMLElement>(".fchip.dm"));
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".practice"));
  const secs = Array.from(document.querySelectorAll<HTMLElement>(".domsec"));
  const countline = document.getElementById("countline");
  if (!cards.length) return;

  let hz = "all";
  let dm = "all";

  function apply() {
    const query = (q?.value ?? "").trim().toLowerCase();
    const words = query ? query.split(/\s+/) : [];
    let shown = 0;
    for (const c of cards) {
      let ok = (hz === "all" || c.dataset.hz === hz) && (dm === "all" || c.dataset.dom === dm);
      if (ok && words.length) {
        const hay = c.dataset.search ?? "";
        ok = words.every((w) => hay.includes(w));
      }
      c.closest("li")?.classList.toggle("hidden", !ok);
      if (ok) shown++;
    }
    for (const s of secs) {
      const any = Array.from(s.querySelectorAll<HTMLElement>(".practice")).some(
        (c) => !c.closest("li")?.classList.contains("hidden"),
      );
      s.classList.toggle("hidden", !any);
    }
    if (countline) countline.textContent = `${shown} ${countline.dataset.label ?? ""}`;
  }

  for (const b of hzBtns) b.addEventListener("click", () => {
    hz = b.dataset.hz ?? "all";
    hzBtns.forEach((x) => x.classList.toggle("active", x === b));
    apply();
  });
  for (const b of dmBtns) b.addEventListener("click", () => {
    dm = b.dataset.dm ?? "all";
    dmBtns.forEach((x) => x.classList.toggle("active", x === b));
    apply();
  });
  q?.addEventListener("input", apply);
  apply();
})();
