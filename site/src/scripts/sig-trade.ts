// "The three roads" readout (components/sig/TradeRoutes.astro). Every waypoint is
// a real link and the map is complete without this script; it adds the readout
// (place label, its road and the first sentence of its summary, all from the JSON
// the component wrote) and the touch rule: the first tap on a waypoint shows it,
// the second opens the record.
for (const root of document.querySelectorAll<HTMLElement>("[data-sg-tr]")) {
  const read = root.querySelector<HTMLElement>("[data-sg-tr-read]");
  const hint = root.querySelector<HTMLElement>("[data-sg-tr-hint]");
  const blob = root.querySelector("[data-sg-tr-data]")?.textContent;
  if (!read || !hint || !blob) continue;
  const J = JSON.parse(blob) as { info: Record<string, { t: string; r: string; s: string; h: string }> };
  const marks = [...root.querySelectorAll<HTMLAnchorElement>("a.sg-tr-m")];
  let pinned: HTMLAnchorElement | null = null, touch = false;

  const show = (a: HTMLAnchorElement | null) => {
    for (const m of marks) m.classList.toggle("is-on", m === a);
    read.replaceChildren();
    const d = a && J.info[a.dataset.id!];
    if (!d) { read.append(hint); return; }
    const h = document.createElement("h3");
    const link = document.createElement("a");
    link.href = d.h;
    link.textContent = d.t;
    link.setAttribute("dir", "auto");
    h.append(link);
    h.style.margin = "0";
    const meta = document.createElement("p");
    meta.className = "muted";
    meta.textContent = d.r;
    meta.style.margin = ".1rem 0 0";
    read.append(h, meta);
    if (d.s) {
      const s = document.createElement("p");
      s.textContent = d.s;
      s.setAttribute("dir", "auto");
      s.style.margin = ".2rem 0 0";
      read.append(s);
    }
  };
  for (const a of marks) {
    a.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; });
    a.addEventListener("mouseenter", () => { if (!touch && !pinned) show(a); });
    a.addEventListener("mouseleave", () => { if (!touch && !pinned) show(null); });
    a.addEventListener("focus", () => show(a));
    a.addEventListener("blur", () => show(pinned));
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (touch && e.detail > 0 && pinned?.dataset.id !== a.dataset.id) { e.preventDefault(); pinned = a; show(a); }
      touch = false;
    });
  }
  root.addEventListener("keydown", (e) => { if (e.key === "Escape") { pinned = null; show(null); } });
}
