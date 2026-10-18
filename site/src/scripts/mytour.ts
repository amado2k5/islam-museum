// My tour (docs/plan/04-experience.md §5): bookmarks in localStorage only —
// no account, no server. Entity pages get a save toggle; the /tour/ page lists
// the saved entries, resolving each id through the static JSON API, and can
// export the list as a shareable ?ids= URL or a printable sheet.
{
const KEY = "mytour";
const get = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; } };
const set = (v: string[]) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode */ } };
const SEG: Record<string, string> = { question: "questions", exhibit: "exhibits" };
const seg = (id: string) => SEG[id.split("/")[0]] ?? id.split("/")[0];
const slug = (id: string) => id.split("/")[1];

// ---- save toggle on entity pages ----
document.querySelectorAll("[data-tour-add]").forEach((el) => {
  const btn = el as HTMLButtonElement;
  const id = btn.getAttribute("data-tour-add")!;
  const paint = () => {
    const on = get().includes(id);
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = on ? btn.getAttribute("data-saved")! : btn.getAttribute("data-save")!;
  };
  btn.addEventListener("click", () => {
    const l = get();
    const i = l.indexOf(id);
    if (i < 0) l.push(id); else l.splice(i, 1);
    set(l); paint();
  });
  paint();
});

// ---- the /tour/ page ----
const wrap = document.querySelector("[data-tour]") as HTMLElement | null;
if (wrap) {
  const T = JSON.parse(wrap.querySelector('script[type="application/json"]')!.textContent!);
  const lang = wrap.getAttribute("data-lang") ?? "en";
  const list = wrap.querySelector("[data-list]") as HTMLElement;
  const note = wrap.querySelector("[data-note]") as HTMLElement;
  const imported = (new URLSearchParams(location.search).get("ids") ?? "")
    .split(",").map((s) => s.trim()).filter((s) => /^[a-z]+\/[a-z0-9][a-z0-9-]*$/.test(s));
  const own = get();
  const shown = imported.length ? imported : own;

  const card = (id: string, label: string, summary: string) =>
    `<li data-item="${id}"><a class="card" href="/${lang}/${seg(id)}/${slug(id)}/"><h3 class="card-title">${label}</h3><span>${summary}</span></a><button type="button" class="chip" data-remove="${id}">${T.remove}</button></li>`;

  const render = async () => {
    if (!shown.length) { list.innerHTML = ""; note.textContent = T.empty; return; }
    note.textContent = `${shown.length} ${T.items}`;
    const out: string[] = [];
    for (const id of shown) {
      try {
        const r = await fetch(`/api/v1/${id}.json`);
        const e = r.ok ? await r.json() : null;
        const label = e?.label?.[lang] ?? e?.label?.ar ?? e?.label?.en ?? id;
        const summary = (e?.summary?.[lang] ?? e?.summary?.ar ?? e?.summary?.en ?? "").replace(/\s*\{cite:[^}]+\}/g, "");
        out.push(card(id, label, summary));
      } catch { out.push(card(id, id, "")); }
    }
    list.innerHTML = out.join("");
  };

  list.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest("[data-remove]") as HTMLElement;
    if (!b) return;
    const id = b.getAttribute("data-remove")!;
    const i = shown.indexOf(id); if (i >= 0) shown.splice(i, 1);
    if (!imported.length) set(shown);
    render();
  });
  wrap.querySelector("[data-copy]")?.addEventListener("click", async (e) => {
    const url = `${location.origin}/${lang}/tour/?ids=${shown.join(",")}`;
    try { await navigator.clipboard.writeText(url); (e.target as HTMLElement).textContent = T.copied; } catch { location.href = url; }
  });
  wrap.querySelector("[data-clear]")?.addEventListener("click", () => { shown.length = 0; if (!imported.length) set([]); render(); });
  wrap.querySelector("[data-print]")?.addEventListener("click", () => window.print());
  wrap.querySelector("[data-addall]")?.addEventListener("click", () => {
    const l = get();
    for (const id of shown) if (!l.includes(id)) l.push(id);
    set(l);
    (wrap.querySelector("[data-addall]") as HTMLElement).textContent = T.copied;
  });
  const addAll = wrap.querySelector("[data-addall]") as HTMLElement | null;
  if (addAll) addAll.hidden = !imported.length;
  render();
}
}
