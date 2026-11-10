// Browser side of the journey player (Part 3, C.4): play/pause, station ticks, keyboard (arrows, Home, End), the moving marker.
interface Station { title: string; narrative: string; dayText: string; dayNote: string; date: string; place: { label: string; href: string; approx: boolean }; events: { href: string; label: string }[] }
interface Payload { n: number; stations: Station[]; t: Record<string, string> }
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

for (const root of document.querySelectorAll<HTMLElement>("[data-journey]")) {
  const p: Payload = JSON.parse(root.querySelector("script[type='application/json']")!.textContent || "{}");
  const ticks = [...root.querySelectorAll<HTMLButtonElement>("[data-tick]")];
  const play = root.querySelector<HTMLButtonElement>("[data-play]")!;
  const marker = root.querySelector<SVGCircleElement>("[data-marker]")!;
  const stops = [...root.querySelectorAll<SVGGElement>("[data-stop]")];
  const count = root.querySelector<HTMLElement>("[data-count]")!;
  const panel = root.querySelector<HTMLElement>("[data-narrative]")!;
  let i = 0, timer = 0;
  const reduced = () => (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.getAttribute("data-motion") === "reduce");

  function show(k: number, focusTick = false) {
    i = (k + p.n) % p.n;
    const s = p.stations[i];
    count.textContent = `${p.t.station} ${i + 1} ${p.t.of} ${p.n} · ${s.dayText}`;
    const place = s.place.href ? `<a href="${esc(s.place.href)}">${esc(s.place.label)}</a>` : esc(s.place.label);
    panel.innerHTML = `<h3 class="jp-h" style="margin:0 0 6px;font-size:1.1rem">${esc(s.title)}</h3>` +
      `<p class="jp-place muted" style="margin:0 0 8px;font-size:.9rem">${place}${s.date ? ` · ${esc(s.date)}` : ""}${s.place.approx ? ` · <span>${esc(p.t.approx)}</span>` : ""}</p>` +
      `<p class="jp-text" style="margin:0">${esc(s.narrative)}</p>` +
      (s.dayNote ? `<p class="muted" style="font-size:.85rem;margin:8px 0 0">${esc(s.dayNote)}</p>` : "") +
      (s.events.length ? `<p class="ui" style="margin:8px 0 0">${s.events.map((e) => `<a class="chip" href="${esc(e.href)}">${esc(e.label)}</a>`).join(" ")}</p>` : "");
    ticks.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    if (focusTick) ticks[i].focus();
    const stop = stops[i].querySelector("circle")!;
    const cx = stop.getAttribute("cx")!, cy = stop.getAttribute("cy")!;
    if (reduced()) { marker.setAttribute("cx", cx); marker.setAttribute("cy", cy); }
    else { marker.style.transition = "cx .6s ease, cy .6s ease"; marker.setAttribute("cx", cx); marker.setAttribute("cy", cy); }
    stops.forEach((g, k) => g.classList.toggle("is-current", k === i));
  }
  function stop() { window.clearInterval(timer); timer = 0; play.textContent = "▶"; play.setAttribute("aria-label", p.t.play); }
  function start() {
    if (timer) return;
    play.textContent = "❚❚"; play.setAttribute("aria-label", p.t.pause);
    timer = window.setInterval(() => { if (i === p.n - 1) stop(); else show(i + 1); }, 4500);
  }
  play.addEventListener("click", () => { if (timer) stop(); else { if (i === p.n - 1) show(0); start(); } });
  ticks.forEach((t, k) => t.addEventListener("click", () => { stop(); show(k); }));
  root.querySelector<HTMLElement>(".jp-ticks")!.addEventListener("keydown", (e) => {
    const rtl = document.documentElement.dir === "rtl";
    const dir = (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0) * (rtl ? -1 : 1);
    if (dir) { e.preventDefault(); stop(); show(i + dir, true); }
    else if (e.key === "Home") { e.preventDefault(); stop(); show(0, true); }
    else if (e.key === "End") { e.preventDefault(); stop(); show(p.n - 1, true); }
  });
  stops.forEach((g, k) => { g.style.cursor = "pointer"; g.addEventListener("click", () => { stop(); show(k); }); });
  root.querySelector("[data-prev]")?.addEventListener("click", () => { stop(); show(i - 1); });
  root.querySelector("[data-next]")?.addEventListener("click", () => { stop(); show(i + 1); });
  show(0);
}
