// The revelation stream of the Sayyi'at Browser (site/src/components/sig/SayyiatStream.astro): the bars and the
// collections are drawn and linked in the HTML (in order of revelation); this script adds the readout (hover, focus,
// first tap) and the Mushaf-order toggle, which moves the bars with an animation only when motion is welcome.
import { bindMarks } from "./sig-readout";

const root = document.querySelector<HTMLElement>("[data-sg-sy]");
const readout = root?.querySelector<HTMLElement>("[data-sg-readout]");
const json = root?.querySelector<HTMLScriptElement>("[data-sg-json]");
if (root && readout && json) {
  const info: Record<string, [string, string, [string, string][]]> = JSON.parse(json.textContent || "{}");
  const links = [...root.querySelectorAll<HTMLAnchorElement>("a[data-id]")];
  const hint = readout.querySelector<HTMLElement>("[data-sg-hint]")!;
  const detail = readout.querySelector<HTMLElement>("[data-sg-detail]")!;
  const f = (k: string) => detail.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  readout.hidden = false;
  const marks = bindMarks(links, (a) => {
    for (const l of links) l.classList.toggle("is-sel", l === a);
    const d = a ? info[a.dataset.id ?? ""] : null;
    hint.hidden = !!d;
    detail.hidden = !d;
    if (!d) return;
    f("name").textContent = d[0];
    f("count").textContent = d[1];
    f("list").replaceChildren(...d[2].map(([label, url]) => {
      const li = document.createElement("li");
      const a2 = document.createElement("a");
      a2.href = url; a2.textContent = label;
      li.append(a2);
      return li;
    }));
  });

  // ---- on a touch screen the bars are too narrow to tap one by one: a finger dragged along the stream selects the bar under it
  const strip = root.querySelector<HTMLElement>("[data-sg-bars]");
  const scrub = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    const a = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLAnchorElement>("a.sg-sy-b");
    if (a) marks.select(a);
  };
  strip?.addEventListener("pointerdown", scrub);
  strip?.addEventListener("pointermove", (e) => { if (e.buttons || e.pointerType === "touch") scrub(e); });

  // ---- axis order (without the script the order of revelation stays)
  const toggle = root.querySelector<HTMLButtonElement>("[data-sg-toggle]");
  const bars = root.querySelector<HTMLElement>("[data-sg-bars]");
  const axis = root.querySelector<HTMLElement>("[data-sg-axis]");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (toggle && bars) {
    const cells = [...bars.children] as HTMLElement[];
    const apply = (mushaf: boolean) => {
      toggle.setAttribute("aria-pressed", String(mushaf));
      root.classList.toggle("is-mushaf", mushaf);
      if (axis) axis.textContent = (mushaf ? axis.dataset.mush : axis.dataset.rev) ?? "";
      const first = new Map(cells.map((c) => [c, c.getBoundingClientRect().left]));
      for (const c of cells) c.style.order = mushaf ? c.style.getPropertyValue("--m") : "";
      if (still) return;
      for (const c of cells) {
        const dx = (first.get(c) ?? 0) - c.getBoundingClientRect().left;
        c.classList.remove("moving");
        c.style.transform = dx ? `translateX(${dx}px)` : "";
      }
      void bars.offsetWidth;
      for (const c of cells) {
        if (!c.style.transform) continue;
        c.classList.add("moving");
        c.style.transform = "";
        c.addEventListener("transitionend", () => c.classList.remove("moving"), { once: true });
      }
    };
    toggle.hidden = false;
    toggle.addEventListener("click", () => apply(toggle.getAttribute("aria-pressed") !== "true"));
  }
}
