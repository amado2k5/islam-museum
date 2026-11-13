// "The tree of tribes" (site/src/components/sig/AnsabTribes.astro): the dendrogram is complete and linked in the HTML; this
// script builds the readout from the drawing itself (the subject's name, section, parent and children as links, and its
// mentions by corpus) and lights the relatives. With a mouse a click opens the page; on a touch screen the first tap selects
// (the readout shows, with its own button to the page) and the second tap opens it.
const root = document.querySelector<HTMLElement>("[data-sga]");
const panel = root?.querySelector<HTMLElement>("[data-sga-panel]");
if (root && panel) {
  const L = root.querySelector<HTMLElement>("[data-sga-labels]")!.dataset;
  const corpora = (L.corpora ?? "").split("|");
  const sections = (L.sections ?? "").split("|");
  const tones = (L.tones ?? "").split("|");
  const sep = L.sep ?? ", ";
  const body = panel.querySelector<HTMLElement>("[data-sga-body]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sga-close]")!;
  const items = [...root.querySelectorAll<SVGAElement>("a.sga-n[data-k]")];
  const byK = new Map(items.map((i) => [i.dataset.k!, i]));
  const nameOf = (i: SVGAElement) => i.getAttribute("aria-label") ?? "";
  const hrefOf = (i: SVGAElement) => i.getAttribute("href") ?? "#";
  let selected: SVGAElement | null = null;
  let touch = false;

  const link = (i: SVGAElement) => { const a = document.createElement("a"); a.href = hrefOf(i); a.textContent = nameOf(i); return a; };
  const linkList = (list: SVGAElement[]) => { const f = document.createDocumentFragment(); list.forEach((i, k) => { if (k) f.append(document.createTextNode(sep)); f.append(link(i)); }); return f; };
  const row = (label: string, content: Node) => { const p = document.createElement("p"); p.className = "ui"; const b = document.createElement("b"); b.textContent = `${label} `; p.append(b, content); return p; };
  const relatives = (i: SVGAElement) => {
    const parent = i.dataset.p ? byK.get(i.dataset.p) : undefined;
    const kids = items.filter((o) => o.dataset.p === i.dataset.k);
    return { parent, kids };
  };
  const show = (i: SVGAElement | null) => {
    body.replaceChildren();
    for (const o of items) o.classList.remove("is-rel");
    panel.hidden = !i;
    if (!i) return;
    const { parent, kids } = relatives(i);
    for (const o of [...(parent ? [parent] : []), ...kids]) o.classList.add("is-rel");
    const h = document.createElement("h4");
    h.append(link(i));
    const sec = document.createElement("p");
    sec.className = "ui muted";
    sec.textContent = sections[tones.indexOf(i.dataset.sec ?? "")] ?? "";
    body.append(h, sec);
    if (parent) body.append(row(L.parent ?? "", link(parent)));
    if (kids.length) body.append(row(L.children ?? "", linkList(kids)));
    const counts = (i.dataset.c ?? "").split(",").map(Number);
    const parts = counts.map((n, k) => (n > 0 ? `${corpora[k]} · ${n}` : "")).filter(Boolean);
    const p = document.createElement("p");
    p.className = "ui";
    if (parts.length) { const b = document.createElement("b"); b.textContent = `${L.mentions} `; p.append(b, document.createTextNode(parts.join(" · "))); }
    else p.textContent = L.none ?? "";
    body.append(p);
    const open = document.createElement("p");
    const a = document.createElement("a");
    a.className = "sga-open"; a.href = hrefOf(i); a.textContent = L.open ?? "";
    open.append(a);
    body.append(open);
  };
  const select = (i: SVGAElement | null) => {
    selected?.classList.remove("is-sel");
    selected = i;
    i?.classList.add("is-sel");
    show(i);
    close.hidden = !i;
  };
  for (const it of items) {
    it.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; });
    it.addEventListener("click", (e) => {
      if (!touch || selected === it || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      select(it);
    });
    it.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(it); });
    it.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") show(selected); });
    it.addEventListener("focus", () => show(it));
    it.addEventListener("blur", () => show(selected));
  }
  close.addEventListener("click", () => { const back = selected; select(null); back?.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); back.focus(); } });
}
