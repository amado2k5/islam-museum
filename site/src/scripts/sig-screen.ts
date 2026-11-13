// The reel of decades (site/src/components/sig/ScreenReel.astro): sparse-frame tiles are links in the HTML; dense-frame tiles
// are plain marks. This script reads each tile's title, year, format and countries from the page's own card list (the tile's
// data-n is the card's position), shows it in the readout line on hover, focus or tap, turns every frame header into a button
// that opens a panel listing that decade's titles as links (cloned from the cards), and on a phone starts the strip scrolled to
// the most recent decades. Without it every title is still reachable from the card list below.
const root = document.querySelector<HTMLElement>("[data-sg-sc]");
const cards = [...document.querySelectorAll<HTMLElement>("#list > li")];
if (root && cards.length) {
  const line = root.querySelector<HTMLElement>("[data-sg-line]")!;
  const panel = root.querySelector<HTMLElement>("[data-sg-panel]")!;
  const plist = root.querySelector<HTMLElement>("[data-sg-plist]")!;
  const ptitle = root.querySelector<HTMLElement>("[data-sg-ptitle]")!;
  const scroller = root.querySelector<HTMLElement>(".sg-sc-scroll")!;
  const hint = root.dataset.tHint ?? "";
  const rtl = getComputedStyle(root).direction === "rtl";
  let selected: HTMLElement | null = null;
  let lastType = "mouse";
  let openBtn: HTMLButtonElement | null = null;

  const info = (n: number) => {
    const li = cards[n];
    if (!li) return null;
    const a = li.querySelector<HTMLAnchorElement>("a.card");
    const text = (s: string) => li.querySelector(s)?.textContent?.trim() ?? "";
    const spans = [...li.querySelectorAll<HTMLElement>("a.card > span")];
    const dateLine = spans.find((s) => s.style.display === "block")?.textContent?.trim() ?? "";
    return { href: a?.href ?? "#", title: text("h2"), format: text(".kicker"), date: dateLine };
  };
  const show = (el: HTMLElement | null) => {
    root.querySelectorAll(".is-on").forEach((x) => x.classList.remove("is-on"));
    if (!el) { line.textContent = hint; return; }
    el.classList.add("is-on");
    const d = info(Number(el.dataset.n));
    if (!d) return;
    const open = document.createElement("a");
    open.href = d.href;
    open.textContent = root.dataset.tOpen ?? "";
    line.replaceChildren(document.createTextNode([d.title, d.date, d.format].filter(Boolean).join(" · ")), open);
  };
  const rest = () => { const f = document.activeElement as HTMLElement | null; show(selected ?? (f && f.classList.contains("sg-sc-link") ? f : null)); };

  for (const el of root.querySelectorAll<HTMLElement>("[data-n].sg-sc-link, .sg-sc-tiles > i[data-n]")) {
    el.addEventListener("pointerenter", (e) => { if ((e as PointerEvent).pointerType === "mouse") show(el); });
    el.addEventListener("pointerleave", (e) => { if ((e as PointerEvent).pointerType === "mouse") rest(); });
    if (el instanceof HTMLAnchorElement) {
      el.addEventListener("pointerdown", (e) => { lastType = e.pointerType; });
      el.addEventListener("focus", () => show(el));
      el.addEventListener("blur", () => setTimeout(rest, 0));
      el.addEventListener("click", (e) => {
        if (lastType === "mouse" || lastType === "pen" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (selected === el) return; // the second tap opens the title
        e.preventDefault();
        selected = el;
        show(el);
      });
    }
  }

  // the decade panel
  const closePanel = () => {
    panel.hidden = true;
    if (openBtn) { openBtn.setAttribute("aria-expanded", "false"); openBtn.focus(); openBtn = null; }
  };
  for (const frame of root.querySelectorAll<HTMLElement>(".sg-sc-frame[data-d]")) {
    const h = frame.querySelector<HTMLElement>(".sg-sc-fh");
    if (!h) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "sg-sc-panel");
    btn.append(...h.childNodes);
    h.append(btn);
    btn.addEventListener("click", () => {
      if (openBtn === btn) { closePanel(); return; }
      openBtn?.setAttribute("aria-expanded", "false");
      openBtn = btn;
      btn.setAttribute("aria-expanded", "true");
      const d = frame.dataset.d!;
      ptitle.textContent = `${root.dataset.tPanel ?? ""} ${btn.querySelector("span")?.textContent ?? d}`.trim();
      plist.replaceChildren(...cards.filter((li) => li.dataset.year && Math.floor(Number(li.dataset.year) / 10) * 10 === Number(d)).map((li) => {
        const row = document.createElement("li");
        const a = document.createElement("a");
        const card = li.querySelector<HTMLAnchorElement>("a.card");
        a.href = card?.href ?? "#";
        a.textContent = li.querySelector("h2")?.textContent ?? "";
        const y = document.createElement("span");
        y.textContent = li.dataset.year ?? "";
        row.append(a, y);
        return row;
      }));
      panel.id = "sg-sc-panel";
      panel.hidden = false;
      panel.focus();
    });
  }
  root.querySelector("[data-sg-close]")?.addEventListener("click", closePanel);
  panel.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Escape") closePanel(); });

  // the strip starts at the most recent decades, which is the end of the reading direction
  const toEnd = () => { const max = scroller.scrollWidth - scroller.clientWidth; if (max > 0) scroller.scrollLeft = rtl ? -max : max; };
  toEnd();
  addEventListener("load", toEnd);
  show(null);
}
