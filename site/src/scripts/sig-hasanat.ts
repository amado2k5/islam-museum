// The shelves of the Hasanat Browser (site/src/components/sig/HasanatShelves.astro): the spines are drawn and linked in
// the HTML; this script adds the readout (hover, focus, first tap) and the three word-form toggles, which colour each
// spine by that form only (the spine keeps its full outline so the share stays visible).
import { bindMarks } from "./sig-readout";

const root = document.querySelector<HTMLElement>("[data-sg-hn]");
const readout = root?.querySelector<HTMLElement>("[data-sg-readout]");
const json = root?.querySelector<HTMLScriptElement>("[data-sg-json]");
if (root && readout && json) {
  const info: Record<string, [string, string, [string, string][]]> = JSON.parse(json.textContent || "{}");
  const links = [...root.querySelectorAll<HTMLAnchorElement>("a.sg-hn-s")];
  const hint = readout.querySelector<HTMLElement>("[data-sg-hint]")!;
  const detail = readout.querySelector<HTMLElement>("[data-sg-detail]")!;
  const f = (k: string) => detail.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  readout.hidden = false;
  bindMarks(links, (a) => {
    for (const l of links) l.classList.toggle("is-sel", l === a);
    const d = a ? info[a.dataset.id ?? ""] : null;
    hint.hidden = !!d;
    detail.hidden = !d;
    if (!d) return;
    f("name").textContent = d[0];
    f("count").textContent = d[1];
    const ul = f("list");
    ul.replaceChildren(...d[2].map(([label, url]) => {
      const li = document.createElement("li");
      const a2 = document.createElement("a");
      a2.href = url; a2.textContent = label;
      li.append(a2);
      return li;
    }));
  });

  // ---- word-form toggles (without the script the buttons stay inert and the spines show every form)
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("button[data-kind]")];
  const apply = (j: number | null) => {
    for (const b of buttons) b.setAttribute("aria-pressed", String(Number(b.dataset.kind) === j));
    for (const l of links) {
      const k = (l.dataset.k ?? "").split(",").map(Number);
      const t = Number(l.dataset.t) || 1;
      const n = j === null ? t : (k[j] ?? 0);
      l.style.setProperty("--p", j === null ? "100%" : `${Math.round((n / t) * 100)}%`);
      l.classList.toggle("dim", j !== null && n === 0);
    }
  };
  for (const b of buttons) {
    b.disabled = false;
    b.addEventListener("click", () => apply(b.getAttribute("aria-pressed") === "true" ? null : Number(b.dataset.kind)));
  }
}
