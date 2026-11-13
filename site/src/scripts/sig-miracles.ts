// The loom of the Miracles Browser (site/src/components/sig/MiraclesLoom.astro). The loom is drawn and linked in the
// HTML; this script lights a prophet's threads and themes (or a theme's prophets) on hover, focus and first tap, fills
// the read-out from the loom's own links, and sends a theme link to the page's filter box.
const root = document.querySelector<HTMLElement>("[data-sg-ml]");
const loom = root?.querySelector<HTMLElement>("[data-sg-loom]");
const panel = root?.querySelector<HTMLElement>("[data-sg-mlpanel]");
if (root && loom && panel) {
  const prophets = [...loom.querySelectorAll<HTMLAnchorElement>("a[data-p]")];
  const topics = [...loom.querySelectorAll<HTMLAnchorElement>("a[data-t]")];
  const threads = [...loom.querySelectorAll<SVGPathElement>("path.sg-ml-th")];
  const hint = panel.querySelector<HTMLElement>("[data-sg-mlhint]")!;
  const body = panel.querySelector<HTMLElement>("[data-sg-mlbody]")!;
  const f = (k: string) => body.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  const T = loom.dataset;
  const fill = (tpl: string | undefined, v: Record<string, string>) => (tpl ?? "").replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
  const ids = (a: HTMLAnchorElement) => (a.dataset.links ?? "").split(" ").filter(Boolean).map(Number);
  const nameOf = (a: HTMLAnchorElement) => a.querySelector(".sg-ml-nm")?.textContent ?? "";
  const countOf = (a: HTMLAnchorElement) => a.querySelector("b")?.textContent ?? "";
  let hovered: HTMLAnchorElement | null = null;
  let selected: HTMLAnchorElement | null = null;
  let touch = false;
  let wasSelected = false;

  const show = (a: HTMLAnchorElement | null) => {
    hint.hidden = !!a;
    body.hidden = !a;
    if (!a) return;
    const isP = a.dataset.p !== undefined;
    const others = ids(a).map((i) => (isP ? topics : prophets)[i]);
    f("name").textContent = nameOf(a);
    f("line").textContent = fill(isP ? T.tProphet : T.tTopic, { n: countOf(a), k: String(others.length) });
    f("head").textContent = isP ? (T.hTopics ?? "") : (T.hProphets ?? "");
    const ul = f("links");
    ul.replaceChildren(...others.map((o) => { const li = document.createElement("li"); const c = o.cloneNode(true) as HTMLAnchorElement; c.removeAttribute("data-p"); c.removeAttribute("data-t"); c.removeAttribute("data-links"); c.className = ""; c.querySelector("b")?.remove(); li.append(c); return li; }));
    const open = f("open") as HTMLAnchorElement;
    open.hidden = !isP;
    if (isP) { open.href = a.href; open.textContent = nameOf(a) + " →"; }
  };
  const mark = () => {
    const a = hovered ?? selected;
    const on = new Set<HTMLAnchorElement>();
    if (a) {
      on.add(a);
      const isP = a.dataset.p !== undefined;
      for (const i of ids(a)) on.add((isP ? topics : prophets)[i]);
    }
    for (const l of [...prophets, ...topics]) l.classList.toggle("on", on.has(l));
    const key = a ? (a.dataset.p !== undefined ? "p" : "t") : "";
    const idx = a ? a.dataset.p ?? a.dataset.t : "";
    for (const th of threads) th.classList.toggle("on", !!a && th.dataset[key] === idx);
    loom.classList.toggle("has-sel", !!a);
    show(a);
  };

  panel.hidden = false;
  for (const a of [...prophets, ...topics]) {
    a.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; wasSelected = selected === a; });
    a.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = a; mark(); } });
    a.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = null; mark(); } });
    a.addEventListener("focus", () => { selected = a; mark(); });
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      // a touch user's first tap selects and shows the read-out; the second goes on
      if (touch && !wasSelected) { e.preventDefault(); selected = a; mark(); touch = false; return; }
      touch = false;
      if (a.dataset.t !== undefined) sendToFilter(a, e);
    });
  }
  loom.addEventListener("pointerleave", () => { hovered = null; mark(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && (selected || hovered)) { selected = null; hovered = null; mark(); } });

  // chips and theme labels fill the page's filter box with the theme's name
  const sendToFilter = (a: HTMLElement, e: Event) => {
    const input = document.querySelector<HTMLInputElement>("[data-miracles-filter]");
    if (!input || !a.dataset.q) return;
    e.preventDefault();
    input.value = a.dataset.q;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    input.focus({ preventScroll: true });
  };
  root.querySelectorAll<HTMLAnchorElement>(".sg-ml-loose a").forEach((c) => c.addEventListener("click", (e) => sendToFilter(c, e)));
  panel.addEventListener("click", (e) => { const c = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-q]"); if (c) sendToFilter(c, e); });
}
