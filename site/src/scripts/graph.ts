// Constellation view, browser side (Part 3, C.5). Fetches the static two-hop neighbourhood JSON for the centre named in
// ?from=, lays the first hop on an inner ring and the second on an outer ring, draws curved labelled edges, and re-centres on
// click. One node per entity id, always. The neighbour list beside the chart is the keyboard and screen-reader reading.
// The legend doubles as a type filter (?only=person,event): the chosen types stay, the rest are hidden, "Show all" clears it.
interface GNode { id: string; c: string; l: Record<string, string>; s: Record<string, string>; hop: number }
interface GEdge { s: string; t: string; r: string }
interface Data { centre: string; nodes: GNode[]; edges: GEdge[] }
interface Payload { lang: string; labels: Record<string, string>; inv?: Record<string, string>; classes: Record<string, string>; t: Record<string, string> }

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

  // --- audit of 13 November 2026, S25 and S36: a name finds the centre, what happens is said at the control, the
  // centres visited stay in view with a way back, and a filter that outlives a change of centre is badged.
  const msg = page.querySelector<HTMLElement>("[data-gx-msg]");
  const say = (text: string) => { if (!msg) return; msg.textContent = text; msg.hidden = !text; };
  const suggest = page.querySelector<HTMLElement>("[data-gx-suggest]");
  const trailNav = page.querySelector<HTMLElement>("[data-gx-trail]");
  const trailList = page.querySelector<HTMLElement>("[data-gx-trail-list]");
  const badge = page.querySelector<HTMLElement>("[data-gx-badge]");
  const badgeText = page.querySelector<HTMLElement>("[data-gx-badge-text]");
  page.querySelector<HTMLButtonElement>("[data-gx-badge-clear]")?.addEventListener("click", () => setOnly(new Set()));
  const norm = (t: string) => t.normalize("NFKD").replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي").toLowerCase().replace(/['’‘`ʿʾ]/g, "").replace(/[-_()\/,.:«»"]/g, " ").replace(/\s+/g, " ").trim();
  // the names a visitor can type: the canon's index (scripts/search-canon.ts), fetched the first time the box is used
  interface Canon { keys: Record<string, number>; records: { id: string; title: string }[] }
  let canon: Canon | null = null, canonLoad: Promise<void> | null = null;
  const needCanon = () => (canonLoad ??= fetch(`/api/v1/meta/search-canon.${lang}.json`).then((r) => (r.ok ? r.json() : null)).then((j) => { canon = j; }).catch(() => { canon = null; }));
  const named = (q: string): string | null => { if (!canon) return null; const k = norm(q); const i = canon.keys[k] ?? canon.keys[k.replace(/^(the|al) /, "")]; return i === undefined ? null : canon.records[i].id; };
  const matches = (q: string) => {
    if (!canon) return [];
    const k = norm(q), seen = new Set<number>(), out: { id: string; title: string }[] = [];
    const exact = canon.keys[k];
    if (exact !== undefined) { seen.add(exact); out.push(canon.records[exact]); }
    for (const key of Object.keys(canon.keys)) { if (out.length >= 8) break; if (!key.startsWith(k)) continue; const i = canon.keys[key]; if (!seen.has(i)) { seen.add(i); out.push(canon.records[i]); } }
    for (let i = 0; i < canon.records.length && out.length < 8; i++) if (!seen.has(i) && norm(canon.records[i].title).includes(k)) { seen.add(i); out.push(canon.records[i]); }
    return out;
  };
  const closeSuggest = () => { if (suggest) { suggest.hidden = true; suggest.textContent = ""; } input?.setAttribute("aria-expanded", "false"); };
  const openSuggest = (q: string) => {
    if (!suggest || !input) return;
    const list = q.trim().length < 2 || q.includes("/") ? [] : matches(q);
    suggest.textContent = "";
    for (const r of list) {
      const li = document.createElement("li"); li.setAttribute("role", "option");
      const b = document.createElement("button"); b.type = "button"; b.textContent = r.title; b.dataset.id = r.id;
      b.style.cssText = "display:block;width:100%;text-align:start;font:inherit;padding:8px 10px;min-height:44px;border:0;border-radius:8px;background:transparent;color:var(--fg);cursor:pointer";
      b.addEventListener("click", () => { closeSuggest(); load(r.id, true); });
      li.appendChild(b); suggest.appendChild(li);
    }
    suggest.hidden = list.length === 0;
    input.setAttribute("aria-expanded", String(list.length > 0));
  };
  input?.addEventListener("focus", () => { needCanon(); });
  input?.addEventListener("input", () => { say(""); needCanon().then(() => openSuggest(input.value)); });
  input?.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeSuggest();
    if (ev.key === "ArrowDown" && suggest && !suggest.hidden) { ev.preventDefault(); suggest.querySelector<HTMLButtonElement>("button")?.focus(); }
  });
  suggest?.addEventListener("keydown", (ev) => {
    const items = [...suggest.querySelectorAll<HTMLButtonElement>("button")], i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (ev.key === "ArrowDown") { ev.preventDefault(); items[Math.min(items.length - 1, i + 1)]?.focus(); }
    if (ev.key === "ArrowUp") { ev.preventDefault(); if (i <= 0) input?.focus(); else items[i - 1].focus(); }
    if (ev.key === "Escape") { closeSuggest(); input?.focus(); }
  });
  document.addEventListener("click", (ev) => { if (suggest && !suggest.hidden && !(ev.target as HTMLElement).closest?.("[data-gx-form]")) closeSuggest(); });
  // the centres visited, oldest first; choosing one goes back to it
  let trail: { id: string; label: string }[] = [];
  const drawTrail = () => {
    if (!trailNav || !trailList) return;
    trailList.textContent = "";
    trail.forEach((t, i) => {
      const li = document.createElement("li");
      if (i > 0) { const sep = document.createElement("span"); sep.setAttribute("aria-hidden", "true"); sep.textContent = "› "; li.appendChild(sep); }
      if (i === trail.length - 1) { const s = document.createElement("span"); s.setAttribute("aria-current", "true"); s.style.fontWeight = "600"; s.textContent = t.label; li.appendChild(s); }
      else { const b = document.createElement("button"); b.type = "button"; b.className = "gx-mini"; b.textContent = t.label; b.addEventListener("click", () => { trail = trail.slice(0, i + 1); load(t.id, true); }); li.appendChild(b); }
      trailList.appendChild(li);
    });
    trailNav.hidden = trail.length < 2;
  };
  const visit = (id: string, label: string) => {
    const at = trail.findIndex((t) => t.id === id);
    if (at >= 0) trail = trail.slice(0, at + 1); else trail.push({ id, label });
    if (trail.length > 8) trail = trail.slice(-8);
    drawTrail();
  };

  // keep only the chosen types; a second-hop entry stays only if it still hangs from a visible first-hop entry
  function filtered(d: Data, types = only): Data {
    if (!types.size) return d;
    const base = new Set(d.nodes.filter((n) => n.hop === 0 || (n.hop === 1 && types.has(classKey(n.c)))).map((n) => n.id));
    const kept = new Set(base);
    for (const n of d.nodes) if (n.hop === 2 && types.has(classKey(n.c)) && d.edges.some((e) => (e.s === n.id && base.has(e.t)) || (e.t === n.id && base.has(e.s)))) kept.add(n.id);
    return { centre: d.centre, nodes: d.nodes.filter((n) => kept.has(n.id)), edges: d.edges.filter((e) => kept.has(e.s) && kept.has(e.t)) };
  }

  function syncFilters(d: Data) {
    // count the entries of a type that show once it joins the current choice: a type seen only behind other types
    // reads as empty on its own and fills in when the type it hangs from is chosen
    const count = new Map<string, number>();
    for (const c of new Set(d.nodes.filter((n) => n.hop).map((n) => classKey(n.c)))) count.set(c, filtered(d, new Set([...only, c])).nodes.filter((n) => n.hop && classKey(n.c) === c).length);
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
    // a filter that is still on is said beside the search box, with its clear button, so it never works unseen
    if (badge && badgeText) { badge.hidden = !only.size; badgeText.textContent = p.t.filter_on.replace("{types}", [...only].map((c) => p.classes[c] ?? c).join(" · ")); }
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
    // the list beside the chart: every neighbour, with the relation to the centre. Edges are stored subject→object
    // (s --r--> t): when the centre is the subject the neighbour is the object, so its label is the predicate's inverse
    // (a parent reads «والد/والدة», not «ابن/ابنة») — the same direction the entity pages use.
    const rel = new Map<string, string>();
    for (const e of d.edges) {
      const key = p.inv?.[e.r];
      if (e.s === centre.id) rel.set(e.t, (key ? p.labels[key] : undefined) ?? p.labels[e.r] ?? e.r);
      else if (e.t === centre.id) rel.set(e.s, p.labels[e.r] ?? e.r);
    }
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

  async function load(id: string, push: boolean, typed?: string) {
    const [c, s] = id.split("/");
    if (!c || !s) return;
    status.textContent = p.t.loading;
    say(p.t.loading);
    closeSuggest();
    try {
      const res = await fetch(`/api/v1/graph/${c}/${s}.json`);
      if (!res.ok) throw new Error(String(res.status));
      const next: Data = await res.json();
      current = next;
      render();
      const centre = next.nodes.find((n) => n.hop === 0);
      if (input) input.value = centre ? labelOf(centre) : id;
      visit(id, centre ? labelOf(centre) : id);
      say("");
      if (push) history.pushState({ from: id }, "", urlFor(id));
    } catch {
      // said at the control that caused it; the chart keeps the last centre that did load
      status.textContent = "";
      say(p.t.notfound.replace("{q}", typed ?? id));
      input?.focus();
    }
  }
  // what was typed, turned into a centre: an id as it is; a name through the canon's index; failing that, the old guess
  async function submitTyped(v: string) {
    if (v.includes("/")) return load(v, true, v);
    say(p.t.loading);
    await needCanon();
    const id = named(v) ?? matches(v)[0]?.id;
    if (id) return load(id, true, v);
    return load(`person/${v.trim().toLowerCase().replace(/\s+/g, "-")}`, true, v);
  }

  const fromParam = () => { const q = new URLSearchParams(location.search).get("from") ?? ""; return q.includes("/") ? q : q ? `person/${q}` : root.dataset.default!; };
  form?.addEventListener("submit", (e) => { e.preventDefault(); const v = (input?.value ?? "").trim(); if (v) submitTyped(v); });
  window.addEventListener("popstate", () => { only = onlyParam(); load(fromParam(), false); });
  load(fromParam(), false);
  void rtl;
}
