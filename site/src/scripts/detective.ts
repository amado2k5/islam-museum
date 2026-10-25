// Source Detective (E4 step 5): remembers the student's grading on this
// device only (localStorage edu-detective:<id>) and reveals the historians'
// note once a scale step is picked. No data leaves the device.
export function initDetective() {
  for (const root of document.querySelectorAll<HTMLElement>("[data-detective]")) {
    const id = root.dataset.detective!;
    const key = `edu-detective:${id}`;
    const inputs = root.querySelectorAll<HTMLInputElement>("[data-scale]");
    const reveal = root.querySelector<HTMLButtonElement>("[data-reveal]")!;
    const note = root.querySelector<HTMLElement>("[data-note]")!;
    const saved = root.querySelector<HTMLElement>("[data-saved]")!;
    const savedText = root.dataset.i18nSaved || "";

    const pick = (v: string) => {
      inputs.forEach((i) => (i.checked = i.value === v));
      reveal.hidden = false;
      try {
        localStorage.setItem(key, v);
        if (savedText) saved.textContent = savedText;
      } catch { /* private mode */ }
    };
    try {
      const old = localStorage.getItem(key);
      if (old !== null) pick(old);
    } catch { /* ignore */ }
    inputs.forEach((i) => i.addEventListener("change", () => pick(i.value)));
    reveal.addEventListener("click", () => { note.hidden = false; reveal.hidden = true; });
  }
}
initDetective();
