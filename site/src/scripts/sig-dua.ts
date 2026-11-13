// The string of lamps of the Du'a Browser (site/src/components/sig/LampStrings.astro): every lit lamp is a real link in
// the HTML (formulas only). This script adds the toggle between formulas and all mentions, which relights the lamps and
// swaps each lamp's link, and the readout (hover, focus, first tap) with the ayah references as links.
const root = document.querySelector<HTMLElement>("[data-sg-du]");
const readout = root?.querySelector<HTMLElement>("[data-sg-readout]");
const json = root?.querySelector<HTMLScriptElement>("[data-sg-json]");
const tools = root?.querySelector<HTMLElement>("[data-sg-tools]");
if (root && readout && json && tools) {
  type Info = { n: string; f: string; a: string; r: [string, number, string?][] };
  const data: Record<string, Info> = JSON.parse(json.textContent || "{}");
  const lamps = [...root.querySelectorAll<SVGAElement>("a.sg-du-l")];
  const keys = [...root.querySelectorAll<HTMLElement>(".sg-du-key li")];
  const G0 = Number(root.dataset.g0), GK = Number(root.dataset.gk), GMAX = Number(root.dataset.gmax);
  const glow = (c: number) => Math.min(GMAX, G0 + GK * Math.sqrt(c));
  const qurl = root.dataset.qurl ?? "";
  const urlOf = (k: string, e: [string, number, string?]) => e[2] ?? qurl.replace("{s}", e[0].split(":")[0]).replace("{a}", e[0].split(":")[1]);
  const hint = readout.querySelector<HTMLElement>("[data-sg-hint]")!;
  const detail = readout.querySelector<HTMLElement>("[data-sg-detail]")!;
  const f = (k: string) => detail.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  const T = readout.dataset;
  const fill = (tpl: string | undefined, v: Record<string, string>) => (tpl ?? "").replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
  const kOf = (a: Element) => (a as unknown as HTMLElement).dataset.k ?? "";
  let mode: "f" | "a" = "f", selected = "", hovered = "", touch = false, wasSel = false;

  const countOf = (a: SVGAElement) => Number((a as unknown as HTMLElement).dataset[mode === "f" ? "f" : "a"]);
  const relight = () => {
    for (const a of lamps) {
      const c = countOf(a), on = c > 0;
      a.classList.toggle("is-off", !on);
      a.querySelector(".gl")?.setAttribute("r", on ? String(Math.round(glow(c) * 10) / 10) : "0");
      const k = kOf(a), first = data[k]?.r.find((e) => mode === "a" || e[1] === 1) ?? data[k]?.r[0];
      if (first && k.startsWith("s")) a.setAttribute("href", urlOf(k, first));
      if (on) { a.removeAttribute("aria-hidden"); a.removeAttribute("tabindex"); } else { a.setAttribute("aria-hidden", "true"); a.setAttribute("tabindex", "-1"); }
    }
    mark();
  };
  const show = (k: string) => {
    const d = k ? data[k] : null;
    readout!.classList.toggle("is-on", !!d);
    hint.hidden = !!d;
    detail.hidden = !d;
    if (!d) return;
    f("name").textContent = d.n;
    f("count").textContent = mode === "f" ? fill(T.tF, { n: d.f }) : fill(T.tA, { n: d.a });
    f("rt").textContent = mode === "a" ? fill(T.tOf, { n: d.f }) + " · " + (T.tRefs ?? "") : (T.tRefs ?? "");
    const ul = f("refs");
    ul.replaceChildren();
    for (const e of d.r) {
      const [ref, formula] = e;
      if (mode === "f" && !formula) continue;
      const li = document.createElement("li"), a = document.createElement("a");
      a.href = urlOf(k, e); a.textContent = ref; a.dir = "ltr";
      if (!formula) li.className = "m";
      li.append(a); ul.append(li);
    }
  };
  const mark = () => {
    const k = hovered || selected;
    for (const a of lamps) a.classList.toggle("is-sel", kOf(a) === k);
    for (const li of keys) li.classList.toggle("is-sel", li.dataset.k === k);
    show(k);
  };

  readout.hidden = false;
  tools.hidden = false;
  for (const b of tools.querySelectorAll<HTMLButtonElement>("button[data-mode]")) {
    b.addEventListener("click", () => {
      mode = b.dataset.mode === "a" ? "a" : "f";
      for (const o of tools.querySelectorAll("button[data-mode]")) o.setAttribute("aria-pressed", String(o === b));
      relight();
    });
  }
  for (const a of lamps) {
    const k = kOf(a);
    a.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; wasSel = selected === k; });
    a.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = k; mark(); } });
    a.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = ""; mark(); } });
    a.addEventListener("focus", () => { selected = k; mark(); });
    a.addEventListener("click", (e) => {
      // a touch user's first tap selects the lamp and shows the readout (its references are links); the second opens it
      if (touch && !wasSel && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) { e.preventDefault(); selected = k; mark(); }
      touch = false;
    });
  }
}
