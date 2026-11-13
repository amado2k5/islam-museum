// The market street (site/src/components/sig/JobsStreet.astro): every tile is a link in the HTML. This script adds the readout
// panel under the street, cloned from the outline list that follows it (the job, how many holders, up to five holders as
// links and how they were chosen), arrow-key movement between tiles and first-tap-selects, second-tap-opens on touch screens.
// Without it the tiles are plain links and the outline carries the same information.
const root = document.querySelector<HTMLElement>("[data-sg-jb]");
if (root) {
  const line = root.querySelector<HTMLElement>("[data-sg-line]")!;
  const hint = root.dataset.tHint ?? "";
  let selected: HTMLAnchorElement | null = null;
  let lastType = "mouse";
  const visibleMap = () => [...root.querySelectorAll<HTMLElement>(".sg-jb-map")].find((m) => m.offsetParent !== null);

  const show = (t: HTMLAnchorElement | null) => {
    root.querySelectorAll(".sg-jb-t.is-on").forEach((x) => x.classList.remove("is-on"));
    if (!t) { line.textContent = hint; return; }
    t.classList.add("is-on");
    const src = root.querySelector<HTMLElement>(`.sg-jb-outline li[data-j="${CSS.escape(t.dataset.j ?? "")}"]`);
    if (!src) { line.textContent = t.textContent ?? ""; return; }
    const name = document.createElement("span");
    name.textContent = src.querySelector("[data-sg-job]")?.textContent ?? "";
    const parts: Node[] = [name];
    const count = src.querySelector("[data-sg-count]");
    if (count) { const c = count.cloneNode(true) as HTMLElement; c.setAttribute("data-sg-count", ""); parts.push(c); }
    const open = document.createElement("a");
    open.href = t.href;
    open.textContent = root.dataset.tOpen ?? "";
    parts.push(open);
    const who = src.querySelector("[data-sg-who]");
    if (who) parts.push(who.cloneNode(true));
    line.replaceChildren(...parts);
  };
  const rest = () => { const f = document.activeElement as HTMLElement | null; show(selected ?? (f && f.classList.contains("sg-jb-t") ? (f as HTMLAnchorElement) : null)); };

  for (const t of root.querySelectorAll<HTMLAnchorElement>(".sg-jb-t")) {
    t.addEventListener("pointerdown", (e) => { lastType = e.pointerType; });
    t.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(t); });
    t.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") rest(); });
    t.addEventListener("focus", () => show(t));
    t.addEventListener("blur", () => setTimeout(rest, 0));
    t.addEventListener("click", (e) => {
      if (lastType === "mouse" || lastType === "pen" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (selected === t) return; // the second tap opens the job
      e.preventDefault();
      selected = t;
      show(t);
    });
    t.addEventListener("keydown", (e) => {
      const map = visibleMap();
      if (!map) return;
      const tiles = [...map.querySelectorAll<HTMLAnchorElement>(".sg-jb-t")];
      const r = t.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dir: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (e.key === "Escape" && selected) { selected = null; show(null); return; }
      const d = dir[e.key];
      if (!d) return;
      // the nearest tile whose centre lies in the pressed direction
      let best: HTMLAnchorElement | undefined, bestScore = Infinity;
      for (const o of tiles) {
        if (o === t) continue;
        const q = o.getBoundingClientRect();
        const dx = q.left + q.width / 2 - cx, dy = q.top + q.height / 2 - cy;
        const along = dx * d[0] + dy * d[1];
        if (along <= 1) continue;
        const score = along + Math.abs(d[0] ? dy : dx) * 2;
        if (score < bestScore) { bestScore = score; best = o; }
      }
      if (best) { e.preventDefault(); best.focus(); }
    });
  }
  show(null);
}
