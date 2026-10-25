// Journey Map (E4 step 6): colours each territory tile when its activity key
// already exists on this device — edu-practice:<topic>, edu-dilemma:<slug>,
// edu-detective:<id>. Read-only; device only.
export function initJourneyMap() {
  for (const root of document.querySelectorAll<HTMLElement>("[data-journey]")) {
    for (const zone of root.querySelectorAll<HTMLElement>(".jm-zone")) {
      const tiles = zone.querySelectorAll<SVGRectElement>("[data-jm-key]");
      let on = 0;
      tiles.forEach((t) => {
        let done = false;
        try { done = localStorage.getItem(t.dataset.jmKey!) !== null; } catch { /* no storage */ }
        if (done) { t.setAttribute("data-on", ""); on++; }
      });
      const c = zone.querySelector<HTMLElement>("[data-jm-count]");
      if (c) c.textContent = `${on} / ${tiles.length}`;
    }
    root.querySelector("[data-jm-print]")?.addEventListener("click", () => window.print());
  }
}
initJourneyMap();
