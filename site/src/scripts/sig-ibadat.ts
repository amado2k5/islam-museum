// The rose window of the Worship and Adhkar Browser (site/src/components/sig/RoseWindow.astro): petals, beads and the topic
// list are real links in the HTML. This script adds the readout (hover, focus, first tap), changes the centre text, and
// makes a click on a petal or a topic put its name in the page's filter box.
const root = document.querySelector<HTMLElement>("[data-sg-ib]");
const readout = root?.querySelector<HTMLElement>("[data-sg-readout]");
const json = root?.querySelector<HTMLScriptElement>("[data-sg-json]");
if (root && readout && json) {
  type Info = { n: string; c: [string, string, number, number][]; p: [string, string, string, string, string][] };
  const data: Record<string, Info> = JSON.parse(json.textContent || "{}");
  const svg = root.querySelector<SVGElement>("[data-sg-svg]")!;
  const petals = [...root.querySelectorAll<SVGElement>("a.sg-ib-petal")];
  const beads = [...root.querySelectorAll<SVGElement>("a.sg-ib-bead")];
  const items = [...root.querySelectorAll<HTMLAnchorElement>(".sg-ib-list a")];
  const ctot = root.querySelector<SVGTextElement>("[data-sg-ctot]")!;
  const csub = root.querySelector<SVGTextElement>("[data-sg-csub]")!;
  const ctot0 = ctot.textContent ?? "", csub0 = csub.textContent ?? "";
  const hint = readout.querySelector<HTMLElement>("[data-sg-hint]")!;
  const detail = readout.querySelector<HTMLElement>("[data-sg-detail]")!;
  const f = (k: string) => detail.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  const T = readout.dataset;
  const fill = (tpl: string | undefined, v: Record<string, string>) => (tpl ?? "").replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
  const nameOf = (t: string) => items.find((a) => a.dataset.t === t)?.querySelector(".sg-ib-ln")?.textContent ?? "";
  const tOf = (el: Element) => (el as unknown as HTMLElement).dataset.t ?? "";
  let selected = "", hovered = "", focusBead: string | null = null, touch = false, wasSel = false;

  const show = (t: string) => {
    const d = t ? data[t] : null;
    readout!.classList.toggle("is-on", !!d);
    hint.hidden = !!d;
    detail.hidden = !d;
    if (!d) { ctot.textContent = ctot0; csub.textContent = csub0; return; }
    ctot.textContent = d.n;
    csub.textContent = fill(T.tPassages, { n: "" }).trim();
    f("name").textContent = nameOf(t);
    f("count").textContent = fill(T.tPassages, { n: d.n });
    const split = f("split"), legend = f("legend"), pr = f("pr");
    split.replaceChildren(); legend.replaceChildren(); pr.replaceChildren();
    for (const [name, n, pct, idx] of d.c) {
      const seg = document.createElement("i");
      seg.style.inlineSize = `${pct}%`; seg.dataset.c = String(idx); split.append(seg);
      const li = document.createElement("li"), key = document.createElement("i");
      key.className = "sg-ib-sw"; key.dataset.c = String(idx);
      li.append(key, `${name} ${n}`); legend.append(li);
    }
    f("ptitle").hidden = d.p.length === 0;
    f("ptitle").textContent = d.p.length ? T.tPr ?? "" : "";
    for (const [h, label, okey, olabel, when] of d.p) {
      const li = document.createElement("li"), a = document.createElement("a"), dot = document.createElement("i");
      dot.className = `sg-ib-dot sg-ob-${okey}`;
      a.href = h; a.textContent = label;
      const m = document.createElement("span");
      m.className = "sg-ib-pm"; m.textContent = when ? `${olabel} · ${when}` : olabel;
      li.append(dot, a, m);
      li.classList.toggle("is-sel", focusBead === label);
      pr.append(li);
    }
    const btn = f("filter") as HTMLButtonElement;
    btn.textContent = T.tList ?? "";
    btn.onclick = () => applyFilter(t);
  };
  const mark = () => {
    const t = hovered || selected;
    for (const p of petals) p.classList.toggle("is-sel", tOf(p) === t);
    for (const i of items) i.classList.toggle("is-sel", i.dataset.t === t);
    for (const b of beads) b.classList.toggle("is-sel", !!focusBead && tOf(b) === t && (b.getAttribute("aria-label") ?? "").split(" · ")[0] === focusBead);
    svg.classList.toggle("has-sel", !!t);
    show(t);
  };
  const applyFilter = (t: string) => {
    const input = document.querySelector<HTMLInputElement>("[data-ibadat-filter]");
    if (!input) return;
    input.value = nameOf(t);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    input.focus({ preventScroll: true });
  };

  readout.hidden = false;
  const wire = (el: Element, bead: boolean) => {
    const t = tOf(el);
    const name = bead ? (el.getAttribute("aria-label") ?? "").split(" · ")[0] : null;
    el.addEventListener("pointerdown", (e) => { touch = (e as PointerEvent).pointerType !== "mouse"; wasSel = selected === t && (!bead || focusBead === name); });
    el.addEventListener("pointerenter", (e) => { if ((e as PointerEvent).pointerType === "mouse") { hovered = t; focusBead = name; mark(); } });
    el.addEventListener("pointerleave", (e) => { if ((e as PointerEvent).pointerType === "mouse") { hovered = ""; focusBead = null; mark(); } });
    el.addEventListener("focus", () => { selected = t; focusBead = name; mark(); });
    el.addEventListener("click", (e) => {
      const me = e as MouseEvent;
      if (me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;
      if (bead) { // a bead opens its practice; on touch the first tap only selects it
        if (touch && !wasSel) { e.preventDefault(); selected = t; focusBead = name; mark(); }
        touch = false;
        return;
      }
      e.preventDefault();
      if (touch && !wasSel) { selected = t; focusBead = null; mark(); } else applyFilter(t);
      touch = false;
    });
  };
  for (const p of petals) wire(p, false);
  for (const a of items) wire(a, false);
  for (const b of beads) wire(b, true);
}
