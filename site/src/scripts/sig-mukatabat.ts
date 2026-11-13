// "Letters and their senders" (components/sig/MukatabatFlow.astro). The blocks are real links and the ribbons are drawn
// without this script; it adds the highlight of a block's or a ribbon's flow, the readout (counts and three samples, all
// from the JSON the component wrote) and the hand-off of a click to the page's own filters: a sender block presses the
// matching sender chip, a kind block types the kind into the search box. On a touch screen the first tap on a block shows
// it, the second follows its link. Under reduced motion nothing here animates.
for (const root of document.querySelectorAll<HTMLElement>("[data-sg-mk]")) {
  const svg = root.querySelector<SVGSVGElement>(".sg-mk-svg");
  const read = root.querySelector<HTMLElement>("[data-sg-mk-read]");
  const hint = root.querySelector<HTMLElement>("[data-sg-mk-hint]");
  const blob = root.querySelector("[data-sg-mk-data]")?.textContent;
  if (!svg || !read || !hint || !blob) continue;
  const J = JSON.parse(blob) as { d: Record<string, { t: string; n: number; s: string[][]; o?: string }>; c: Record<string, string>; samples: string; open: string; kinds: Record<string, string> };
  const labs = [...root.querySelectorAll<HTMLAnchorElement>("a.sg-mk-lab")];
  const bars = new Map([...root.querySelectorAll<HTMLElement>("[data-bar]")].map((b) => [b.dataset.bar!, b]));
  const rbs = [...svg.querySelectorAll<SVGPathElement>(".sg-mk-rb")];
  let pinned: string | null = null;
  let touch = false;

  const light = (key: string | null) => {
    for (const r of rbs) r.classList.toggle("is-hot", !!key && (key.includes(">") ? `${r.dataset.a}>${r.dataset.b}` === key : r.dataset.a === key || r.dataset.b === key));
    svg.classList.toggle("has-hot", !!key);
    for (const [k, b] of bars) b.classList.toggle("is-hot", !!key && (key.includes(">") ? key.split(">").includes(k) : k === key));
    for (const l of labs) l.classList.toggle("is-hot", !!key && l.dataset.key === key);
  };
  const show = (key: string | null) => {
    light(key);
    read.replaceChildren();
    const d = key && J.d[key];
    if (!d) { read.append(hint); return; }
    const h = document.createElement("h3"); h.textContent = d.t;
    const p = document.createElement("p"); p.className = "muted"; p.textContent = J.c[key];
    const lab = document.createElement("p"); lab.className = "muted"; lab.textContent = J.samples;
    const ul = document.createElement("ul");
    for (const [href, label] of d.s) { const li = document.createElement("li"); const a = document.createElement("a"); a.href = href; a.textContent = label; a.setAttribute("dir", "auto"); li.append(a); ul.append(li); }
    read.append(h, p, lab, ul);
    if (d.o) { const o = document.createElement("a"); o.href = d.o; o.textContent = J.open; read.append(o); }
  };
  const on = (key: string | null) => show(pinned ?? key);

  for (const l of labs) {
    const key = l.dataset.key!;
    l.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; });
    l.addEventListener("mouseenter", () => { if (!touch) on(key); });
    l.addEventListener("mouseleave", () => { if (!touch) on(null); });
    l.addEventListener("focus", () => on(key));
    l.addEventListener("blur", () => on(null));
    l.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (touch && e.detail > 0 && pinned !== key) { e.preventDefault(); pinned = key; show(key); touch = false; return; }
      touch = false;
      // hand the click to the page's own filters (the link still scrolls there)
      if (l.dataset.sender) document.querySelector<HTMLButtonElement>(`[data-mukatabat-sender][data-sender="${l.dataset.sender}"]`)?.click();
      else if (l.dataset.kind && l.dataset.kind !== "record") {
        const input = document.querySelector<HTMLInputElement>("[data-mukatabat-filter]");
        if (input) { input.value = J.kinds[l.dataset.kind] ?? ""; input.dispatchEvent(new Event("input", { bubbles: true })); }
      }
    });
  }
  for (const r of rbs) {
    const key = `${r.dataset.a}>${r.dataset.b}`;
    r.addEventListener("mouseenter", () => { if (!pinned) show(key); });
    r.addEventListener("mouseleave", () => { if (!pinned) show(null); });
    r.addEventListener("click", () => { pinned = pinned === key ? null : key; show(pinned); });
  }
  root.addEventListener("keydown", (e) => { if (e.key === "Escape") { pinned = null; show(null); } });
}
