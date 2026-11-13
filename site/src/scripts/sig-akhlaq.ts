// The butterfly of the Ethics and Dealings Browser (site/src/components/sig/ButterflyVirtues.astro): every bar is a link
// to the page's filter box in the HTML. This script adds the readout (hover, focus, first tap), makes a click put the
// topic in the filter, and on a phone lets the visitor expand the shortened lists in place.
const root = document.querySelector<HTMLElement>("[data-sg-akh]");
const readout = root?.querySelector<HTMLElement>("[data-sg-readout]");
const json = root?.querySelector<HTMLScriptElement>("[data-sg-json]");
if (root && readout && json) {
  const data: Record<string, { k: string; n: string; c: [string, string, number, number][]; p: [string, string][]; s: number }> = JSON.parse(json.textContent || "{}");
  const links = [...root.querySelectorAll<HTMLAnchorElement>("a.sg-akh-r")];
  const hint = readout.querySelector<HTMLElement>("[data-sg-hint]")!;
  const detail = readout.querySelector<HTMLElement>("[data-sg-detail]")!;
  const f = (k: string) => detail.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  const T = readout.dataset;
  const fill = (tpl: string | undefined, v: Record<string, string>) => (tpl ?? "").replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
  let selected: HTMLAnchorElement | null = null, hovered: HTMLAnchorElement | null = null, touch = false, wasSel = false;

  const show = (a: HTMLAnchorElement | null) => {
    const d = a ? data[a.dataset.t ?? ""] : null;
    hint.hidden = !!d;
    detail.hidden = !d;
    readout!.classList.toggle("is-on", !!d);
    if (!a || !d) return;
    f("name").textContent = a.querySelector(".sg-akh-l")?.textContent ?? "";
    f("kind").textContent = d.k;
    f("count").textContent = fill(T.tPassages, { n: d.n });
    const split = f("split"), legend = f("legend"), pass = f("pass");
    split.replaceChildren(); legend.replaceChildren(); pass.replaceChildren();
    d.c.forEach(([name, n, pct, idx]) => {
      const seg = document.createElement("i");
      seg.style.inlineSize = `${pct}%`;
      seg.dataset.c = String(idx);
      split.append(seg);
      const li = document.createElement("li"), key = document.createElement("i");
      key.dataset.c = String(idx);
      li.append(key, `${name} ${n}`);
      legend.append(li);
    });
    f("ptitle").textContent = T.tOpen ?? "";
    for (const [h, label] of d.p) {
      const li = document.createElement("li"), link = document.createElement("a");
      link.href = h; link.textContent = label; li.append(link); pass.append(li);
    }
    const btn = f("filter") as HTMLButtonElement;
    btn.textContent = T.tList ?? "";
    btn.onclick = () => applyFilter(a);
  };
  const mark = () => {
    const a = hovered ?? selected;
    for (const l of links) l.classList.toggle("is-sel", l === a);
    show(a);
  };
  const applyFilter = (a: HTMLAnchorElement) => {
    const input = document.querySelector<HTMLInputElement>("[data-akhlaq-filter]");
    if (!input) return;
    input.value = a.querySelector(".sg-akh-l")?.textContent ?? "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    input.focus({ preventScroll: true });
  };

  readout.hidden = false;
  for (const a of links) {
    a.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; wasSel = selected === a; });
    a.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = a; mark(); } });
    a.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = null; mark(); } });
    a.addEventListener("focus", () => { selected = a; mark(); });
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (touch && !wasSel) { selected = a; mark(); } else applyFilter(a);
      touch = false;
    });
  }

  // ---- phones: the lists are cut to the first rows; the button expands them in place (without the script all show)
  const more = root.querySelector<HTMLButtonElement>("[data-sg-more]");
  const mq = matchMedia("(max-width: 640px)");
  if (more) {
    const sync = () => {
      const narrow = mq.matches;
      more.hidden = !narrow;
      root.classList.toggle("is-cut", narrow && more.getAttribute("aria-pressed") !== "true");
    };
    more.addEventListener("click", () => {
      const on = more.getAttribute("aria-pressed") !== "true";
      more.setAttribute("aria-pressed", String(on));
      more.textContent = (on ? more.dataset.tLess : more.dataset.tAll) ?? "";
      sync();
    });
    mq.addEventListener("change", sync);
    sync();
  }
}
