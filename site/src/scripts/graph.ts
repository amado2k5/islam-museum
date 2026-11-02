// Constellation view, browser side (Part 3, C.5). Fetches the static two-hop neighbourhood JSON for the centre named in
// ?from=, lays the first hop on an inner ring and the second on an outer ring, draws curved labelled edges, and re-centres on
// click. One node per entity id, always. The neighbour list beside the chart is the keyboard and screen-reader reading.
// The legend doubles as a type filter (?only=person,event): the chosen types stay, the rest are hidden, "Show all" clears it.
interface GNode { id: string; c: string; l: Record<string, string>; s: Record<string, string>; hop: number }
interface GEdge { s: string; t: string; r: string }
interface Data { centre: string; nodes: GNode[]; edges: GEdge[] }
interface Payload { lang: string; labels: Record<string, string>; classes: Record<string, string>; t: Record<string, string> }

const NS = "http://www.w3.org/2000/svg";
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const COLOR: Record<string, string> = { person: "#c5a059", place: "#2a7b88", event: "#3f6fb5", work: "#9e4a38", concept: "#1c4e40", group: "#8e5aa8", polity: "#7a5c3e", passage: "#335c67", period: "#8c6d3b", journey: "#1b4958", building: "#b27b42", object: "#b65c5c", practice: "#4d8a4f", source: "#5f5a53" };
const SEGMENT: Record<string, string> = { question: "questions", exhibit: "exhibits" };
const el = (tag: string, attrs: Record<string, string | number>, text?: string) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v)); if (text !== undefined) e.textContent = text; return e; };

for (const root of document.querySelectorAll<HTMLElement>("[data-graph]")) {
  const page = root.closest<HTMLElement>("[data-pagefind-ignore]") ?? document.body;
  const p: Payload = JSON.parse(page.querySelector("script[type='application/json']")!.textContent || "{}");
  const svg = root.querySelector<SVGSVGElement>("[data-svg]")!;
  const card = root.querySelector<HTMLElement>("[data-card]")!;
  const status = root.querySelector<HTMLElement>("[data-status]")!;
  const list = root.querySelector<HTMLElement>("[data-list]")!;
  const form = page.querySelector<HTMLFormElement>("[data-gx-form]");
  const input = form?.querySelector<HTMLInputElement>("input[name=from]");
  const lang = p.lang;
  const hrefOf = (id: string) => { const [c, s] = id.split("/"); return `/${lang}/${SEGMENT[c] ?? c}/${s}/`; };
  const labelOf = (n: GNode) => n.l[lang] ?? n.l.en ?? n.id;
  const rtl = document.documentElement.dir === "rtl";
  const cross = page.querySelector<HTMLInputElement>("[data-gx-cross]");
  cross?.addEventListener("change", () => root.classList.toggle("show-cross", cross.checked));
  card.addEventListener("keydown", (ev) => { if (ev.key === "Escape") card.hidden = true; });
  const filters = [...page.querySelectorAll<HTMLButtonElement>("[data-filter]")];
  const allBtn = page.querySelector<HTMLButtonElement>("[data-gx-all]");
  const filterHint = page.querySelector<HTMLElement>("[data-gx-filter-hint]");
  if (filterHint) filterHint.hidden = false;
  const classKey = (c: string) => (c in COLOR ? c : "other");
  const onlyParam = () => new Set((new URLSearchParams(location.search).get("only") ?? "").split(",").filter((c) => filters.some((b) => b.dataset.filter === c)));
  let only = onlyParam();
  let current: Data | null = null;

  // keep only the chosen types; a second-hop entry stays only if it still hangs from a visible first-hop entry
  function filtered(d: Data, types = only): Data {
    if (!types.size) return d;
    const base = new Set(d.nodes.filter((n) => n.hop === 0 || (n.hop === 1 && types.has(classKey(n.c)))).map((n) => n.id));
    const kept = new Set(base);
    for (const n of d.nodes) if (n.hop === 2 && types.has(classKey(n.c)) && d.edges.some((e) => (e.s === n.id && base.has(e.t)) || (e.t === n.id && base.has(e.s)))) kept.add(n.id);
    return { centre: d.centre, nodes: d.nodes.filter((n) => kept.has(n.id)), edges: d.edges.filter((e) => kept.has(e.s) && kept.has(e.t)) };
  }

  function syncFilters(d: Data) {
    // count what choosing a type on its own would show, so a type seen only two hops away behind other types reads as empty
    const count = new Map<string, number>();
    for (const c of new Set(d.nodes.filter((n) => n.hop).map((n) => classKey(n.c)))) count.set(c, filtered(d, new Set([c])).nodes.length - 1);
    for (const b of filters) {
      const c = b.dataset.filter!, k = count.get(c) ?? 0;
      b.querySelector<HTMLElement>("[data-count]")!.textContent = k ? String(k) : "";
      b.disabled = !k && !only.has(c);
      b.setAttribute("aria-pressed", String(only.has(c)));
      b.closest("li")!.hidden = c === "other" && !k;
    }
    root.classList.toggle("is-filtered", only.size > 0);
    page.querySelector(".gx-legend")?.classList.toggle("is-filtered", only.size > 0);
    if (allBtn) allBtn.hidden = !only.size;
  }

  function render() {
    if (!current) return;
    syncFilters(current);
    const v = filtered(current);
    draw(v);
    status.textContent = only.size && !v.nodes.some((n) => n.hop) ? p.t.empty : "";
  }

  function urlFor(id: string) {
    const q = new URLSearchParams({ from: id });
    if (only.size) q.set("only", [...only].join(","));
    return `?${q.toString().replace(/%2F/g, "/").replace(/%2C/g, ",")}`;
  }

  function setOnly(next: Set<string>) {
    only = next;
    render();
    if (current) history.replaceState({ from: current.centre }, "", urlFor(current.centre));
  }
  for (const b of filters) b.addEventListener("click", () => { const c = b.dataset.filter!, next = new Set(only); if (next.has(c)) next.delete(c); else next.add(c); setOnly(next); });
  allBtn?.addEventListener("click", () => { setOnly(new Set()); filters.find((b) => !b.disabled)?.focus(); });

  function draw(d: Data) {
    svg.innerHTML = "";
    const ids = new Set<string>();
    for (const n of d.nodes) { if (ids.has(n.id)) throw new Error("duplicate node " + n.id); ids.add(n.id); }
    const centre = d.nodes.find((n) => n.hop === 0)!;
    const h1 = d.nodes.filter((n) => n.hop === 1), h2 = d.nodes.filter((n) => n.hop === 2);
    const pos = new Map<string, [number, number]>();
    pos.set(centre.id, [0, 0]);
    const R1 = 225, R2 = 335;
    h1.forEach((n, i) => { const a = (i / h1.length) * Math.PI * 2 - Math.PI / 2; pos.set(n.id, [Math.cos(a) * R1, Math.sin(a) * R1]); });
    // second hop: near the first-hop node it hangs from
    const parentOf = new Map<string, string>();
    for (const e of d.edges) { const a = ids.has(e.s) && ids.has(e.t); if (!a) continue; const s = d.nodes.find((n) => n.id === e.s)!, t = d.nodes.find((n) => n.id === e.t)!; if (s.hop === 1 && t.hop === 2 && !parentOf.has(t.id)) parentOf.set(t.id, s.id); if (t.hop === 1 && s.hop === 2 && !parentOf.has(s.id)) parentOf.set(s.id, t.id); }
    const groups = new Map<string, GNode[]>();
    for (const n of h2) { const k = parentOf.get(n.id) ?? "?"; (groups.get(k) ?? groups.set(k, []).get(k)!).push(n); }
    const used: number[] = [];
    for (const n of h2) {
      const par = parentOf.get(n.id);
      const pp = par ? pos.get(par)! : [0, -R1];
      const base = Math.atan2(pp[1], pp[0]);
      const sibs = groups.get(par ?? "?")!, k = sibs.indexOf(n);
      let a = base + (k - (sibs.length - 1) / 2) * 0.22;
      // keep outer nodes apart
      for (let tries = 0; tries < 20 && used.some((u) => Math.abs(((u - a + Math.PI) % (2 * Math.PI)) - Math.PI) < 0.16); tries++) a += 0.17;
      used.push(a);
      pos.set(n.id, [Math.cos(a) * R2, Math.sin(a) * R2]);
    }
    const gE = el("g", { class: "gx-edges" }), gL = el("g", { class: "gx-elabels" }), gN = el("g", { class: "gx-nodes" });
    const hopOf = (id: string) => d.nodes.find((n) => n.id === id)?.hop ?? 2;
    for (const e of d.edges) {
      const a = pos.get(e.s), b = pos.get(e.t);
      if (!a || !b) continue;
      const hs = hopOf(e.s), ht = hopOf(e.t);
      // edges between two first-hop nodes are context: drawn faint, unlabelled (labels go on the spokes from the centre and outward)
      const spoke = hs === 0 || ht === 0 || hs !== ht;
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      const cx = mx - dy / len * 28, cy = my + dx / len * 28;
      const path = el("path", { d: `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`, class: spoke ? "gx-edge" : "gx-edge gx-faint" });
      path.appendChild(el("title", {}, p.labels[e.r] ?? e.r));
      gE.appendChild(path);
      if (!spoke) continue;
      const label = p.labels[e.r] ?? e.r;
      const lx = 0.25 * a[0] + 0.5 * cx + 0.25 * b[0], ly = 0.25 * a[1] + 0.5 * cy + 0.25 * b[1];
      gL.appendChild(el("text", { x: lx, y: ly, "text-anchor": "middle", class: "gx-elabel" }, label));
    }
    for (const n of d.nodes) {
      const [x, y] = pos.get(n.id)!;
      const r = n.hop === 0 ? 46 : n.hop === 1 ? 22 : 14;
      const g = el("g", { class: `gx-node hop-${n.hop}`, transform: `translate(${x} ${y})`, tabindex: 0, role: "button", "data-id": n.id });
      g.appendChild(el("title", {}, `${labelOf(n)} · ${p.classes[n.c] ?? n.c}`));
      g.appendChild(el("circle", { r, fill: COLOR[n.c] ?? "#7a5c3e" }));
      const lab = labelOf(n);
      const short = lab.length > 22 ? lab.slice(0, 21) + "…" : lab;
      // first-hop labels alternate above and below the ring so neighbours do not overwrite each other
      const idx = n.hop === 1 ? h1.indexOf(n) : 0;
      const ly = n.hop === 0 ? 6 : n.hop === 1 && idx % 2 ? -(r + 6) : r + 14;
      g.appendChild(el("text", { x: 0, y: ly, "text-anchor": "middle", class: n.hop === 0 ? "gx-label gx-centre" : "gx-label" }, short));
      const act = () => { if (n.hop === 0) show(n); else load(n.id, true); };
      g.addEventListener("click", act);
      g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); act(); } });
      g.addEventListener("pointerenter", () => show(n, true));
      gN.appendChild(g);
    }
    svg.append(gE, gL, gN);
    show(centre);
    // the list beside the chart: every neighbour, with the relation to the centre
    const rel = new Map<string, string>();
    for (const e of d.edges) { if (e.s === centre.id) rel.set(e.t, p.labels[e.r] ?? e.r); else if (e.t === centre.id) rel.set(e.s, p.labels[e.r] ?? e.r); }
    list.innerHTML = [...h1, ...h2].map((n) => `<li><a href="${esc(hrefOf(n.id))}">${esc(labelOf(n))}</a> <span class="muted">— ${esc(rel.get(n.id) ?? p.t.hops)}</span> · <button type="button" class="gx-mini" data-recentre="${esc(n.id)}">${esc(p.t.recentre)}</button></li>`).join("");
    list.querySelectorAll<HTMLButtonElement>("[data-recentre]").forEach((b) => b.addEventListener("click", () => load(b.dataset.recentre!, true)));
  }

  function show(n: GNode, hover = false) {
    const s = n.s?.[lang] ?? n.s?.en ?? "";
    card.innerHTML = `<button type="button" class="gx-close" aria-label="${esc(p.t.close)}">×</button><p class="gx-kicker">${esc(p.classes[n.c] ?? n.c)}${n.hop === 0 ? ` · ${esc(p.t.centre)}` : ""}</p><p class="gx-title">${esc(labelOf(n))}</p>${s ? `<p class="muted">${esc(s)}</p>` : ""}<p class="gx-actions"><a class="chip" href="${esc(hrefOf(n.id))}">${esc(p.t.open)} →</a>${n.hop ? ` <button type="button" class="chip gx-mini" data-go="${esc(n.id)}">${esc(p.t.recentre)}</button>` : ""}</p>`;
    card.hidden = false;
    card.querySelector<HTMLButtonElement>("[data-go]")?.addEventListener("click", () => load(n.id, true));
    card.querySelector<HTMLButtonElement>(".gx-close")?.addEventListener("click", () => { card.hidden = true; });
    void hover;
  }

  async function load(id: string, push: boolean) {
    const [c, s] = id.split("/");
    if (!c || !s) return;
    status.textContent = p.t.loading;
    try {
      const res = await fetch(`/api/v1/graph/${c}/${s}.json`);
      if (!res.ok) throw new Error(String(res.status));
      current = await res.json();
      render();
      if (input) input.value = id;
      if (push) history.pushState({ from: id }, "", urlFor(id));
    } catch {
      status.textContent = p.t.failed;
    }
  }

  const fromParam = () => { const q = new URLSearchParams(location.search).get("from") ?? ""; return q.includes("/") ? q : q ? `person/${q}` : root.dataset.default!; };
  form?.addEventListener("submit", (e) => { e.preventDefault(); const v = (input?.value ?? "").trim(); if (v) load(v.includes("/") ? v : `person/${v}`, true); });
  window.addEventListener("popstate", () => { only = onlyParam(); load(fromParam(), false); });
  load(fromParam(), false);
  void rtl;
}
