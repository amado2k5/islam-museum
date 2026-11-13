// The co-occurrence wheel of the Magic Browser (site/src/components/sig/MagicWheel.astro). The legend rows and the arcs are
// links to the filter of the list below. With this script hovering, focusing or selecting a topic lights its arc and fills
// the panel from the outline (the text alternative), with a button that applies the topic as the list's filter; hovering a
// chord names the pair and the number of records they share.
const root = document.querySelector<HTMLElement>("[data-sg-m]");
const panel = root?.querySelector<HTMLElement>("[data-sg-mpanel]");
if (root && panel) {
  const body = panel.querySelector<HTMLElement>("[data-sg-mbody]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sg-mhint]")!;
  const triggers = [...root.querySelectorAll<SVGAElement | HTMLAnchorElement>("[data-t]")];
  const chords = [...root.querySelectorAll<SVGPathElement>("path.sg-m-ch")];
  const applyText = root.dataset.tApply ?? "";
  let selected: string | null = null;

  const mark = (t: string | null, pair: string | null) => {
    root.classList.toggle("dim", !!t || !!pair);
    for (const el of root.querySelectorAll<SVGElement | HTMLElement>(".sg-m-arc, .sg-m-legend a, .sg-m-ch")) el.classList.remove("on");
    for (const el of triggers) {
      const on = el.dataset.t === t || (!!pair && pair.split("|").includes(el.dataset.t ?? ""));
      if (on) (el.closest(".sg-m-legend") ? el : el.querySelector(".sg-m-arc") ?? el).classList.add("on");
    }
    if (t) for (const c of chords) if ((c.dataset.ch ?? "").split("|").includes(t)) c.classList.add("on");
    if (pair) chords.find((c) => c.dataset.ch === pair)?.classList.add("on");
  };
  const showTopic = (t: string | null, sticky: boolean) => {
    body.replaceChildren();
    const card = t && root.querySelector<HTMLElement>(`[data-sg-card="${t}"]`);
    hint.hidden = !!card;
    if (!card || !t) { mark(null, null); return; }
    body.append(...[...card.cloneNode(true).childNodes]);
    const name = root.querySelector<HTMLElement>(`.sg-m-legend a[data-t="${t}"] .sg-m-nm`)?.textContent ?? "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sg-m-apply ui";
    btn.textContent = applyText;
    btn.addEventListener("click", () => {
      const input = document.querySelector<HTMLInputElement>("[data-magic-filter]");
      if (!input) return;
      input.value = name;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      input.focus({ preventScroll: true });
    });
    body.append(btn);
    mark(t, null);
    void sticky;
  };
  const showPair = (pair: string) => {
    const li = root.querySelector<HTMLElement>(`[data-sg-chord="${pair}"]`);
    body.replaceChildren();
    if (!li) return;
    hint.hidden = true;
    const p = document.createElement("p");
    p.textContent = li.textContent ?? "";
    body.append(p);
    mark(null, pair);
  };
  const back = () => (selected ? showTopic(selected, true) : (showTopic(null, false), hint.hidden = false));

  panel.hidden = false;
  for (const el of triggers) {
    const t = el.dataset.t!;
    el.addEventListener("pointerenter", (e) => { if ((e as PointerEvent).pointerType === "mouse" && !selected) showTopic(t, false); });
    el.addEventListener("pointerleave", (e) => { if ((e as PointerEvent).pointerType === "mouse" && !selected) back(); });
    el.addEventListener("focus", () => { if (!selected) showTopic(t, false); });
    el.addEventListener("blur", () => { if (!selected) back(); });
    el.addEventListener("click", (e) => {
      if ((e as MouseEvent).metaKey || (e as MouseEvent).ctrlKey) return;
      e.preventDefault();
      selected = selected === t ? null : t;
      showTopic(selected, true);
      if (!selected) hint.hidden = false;
    });
  }
  for (const c of chords) {
    c.addEventListener("pointerenter", () => showPair(c.dataset.ch!));
    c.addEventListener("pointerleave", () => back());
    c.addEventListener("click", () => showPair(c.dataset.ch!));
  }
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { selected = null; back(); hint.hidden = false; } });
}
