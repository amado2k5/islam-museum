// The six habitats (site/src/components/sig/NatureStrata.astro): every token is a link in the HTML. With this script
// hovering or focusing a token fills the read-out panel (name, habitat, Qur'an and hadith counts, first sentence), and
// a first tap on a touch screen selects the token while a second tap opens its page.
const root = document.querySelector<HTMLElement>("[data-sg-n]");
const panel = root?.querySelector<HTMLElement>("[data-sg-npanel]");
if (root && panel) {
  const body = panel.querySelector<HTMLElement>("[data-sg-nbody]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sg-nhint]")!;
  const tokens = [...root.querySelectorAll<HTMLAnchorElement>("a.sg-n-t")];
  const tq = root.dataset.tQ ?? "", th = root.dataset.tH ?? "", to = root.dataset.tOpen ?? "";
  let selected: HTMLAnchorElement | null = null;

  const show = (a: HTMLAnchorElement | null) => {
    body.replaceChildren();
    hint.hidden = !!a;
    if (!a) return;
    const habitat = a.closest(".sg-n-band")?.querySelector(".sg-n-hd a")?.textContent ?? "";
    const name = a.querySelector(".sg-n-nm")?.textContent ?? "";
    const h3 = document.createElement("h3");
    h3.textContent = name;
    const sub = document.createElement("p");
    sub.className = "sg-n-sub";
    sub.textContent = [habitat, tq.replace("{n}", a.dataset.q ?? "0"), th.replace("{n}", a.dataset.h ?? "0")].join(" · ");
    body.append(h3, sub);
    if (a.dataset.s) { const p = document.createElement("p"); p.textContent = a.dataset.s; body.append(p); }
    if (selected === a) {
      const p = document.createElement("p");
      const l = document.createElement("a");
      l.href = a.href;
      l.textContent = to;
      p.append(l);
      body.append(p);
    }
  };
  const select = (a: HTMLAnchorElement | null) => {
    selected?.removeAttribute("aria-current");
    selected = a;
    a?.setAttribute("aria-current", "true");
    show(a);
  };

  panel.hidden = false;
  for (const a of tokens) {
    a.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse" && !selected) show(a); });
    a.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse" && !selected) show(null); });
    a.addEventListener("focus", () => { if (!selected) show(a); });
    a.addEventListener("blur", () => { if (!selected) show(null); });
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (selected === a) return; // second activation follows the link
      if ((e as PointerEvent).pointerType === "mouse" || (e as MouseEvent).detail === 0) return; // mouse and keyboard open at once
      e.preventDefault();
      select(a);
    });
  }
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); back.focus(); } });
}
