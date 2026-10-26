// Journey Map (E4 step 6): colours each territory tile when its activity key
// already exists on this device — edu-practice:<topic>, edu-dilemma:<slug>,
// edu-detective:<id>. Read-only; device only.
export function initJourneyMap() {
  for (const root of document.querySelectorAll<HTMLElement>("[data-journey]")) {
    for (const zone of root.querySelectorAll<HTMLElement>(".jm-zone")) {
      const tiles = zone.querySelectorAll<SVGRectElement>("rect[data-jm-key]");
      let on = 0;
      for (const el of zone.querySelectorAll<HTMLElement>("[data-jm-key]")) {
        let done = false;
        try { done = localStorage.getItem(el.dataset.jmKey!) !== null; } catch { /* no storage */ }
        if (!done) continue;
        el.setAttribute("data-on", "");
        if (el instanceof SVGRectElement) on++;
        el.querySelector<HTMLElement>("[data-jm-state]")?.removeAttribute("hidden");
      }
      const c = zone.querySelector<HTMLElement>("[data-jm-count]");
      if (c) c.textContent = `${on} / ${tiles.length}`;
    }
    root.querySelector("[data-jm-print]")?.addEventListener("click", () => window.print());
    // Closed <details> hide their items from printers and find-in-page; open the text
    // lists for printing (and Firefox's match-in-collapsed-details), then restore.
    const opened: HTMLDetailsElement[] = [];
    const openAll = (flag: boolean) => {
      for (const d of root.querySelectorAll<HTMLDetailsElement>("details[data-jm-text]")) {
        if (flag && !d.open) { d.open = true; opened.push(d); }
        else if (!flag) { while (opened.length) opened.pop()!.open = false; }
      }
    };
    window.addEventListener("beforeprint", () => openAll(true));
    window.addEventListener("afterprint", () => openAll(false));
  }
}
initJourneyMap();
