// My museum shelf (docs/delegation/education-master-plan.md §5 E2): up to 60 ids under `edu-shelf` in localStorage,
// shelve buttons on education pages, and the /learn/shelf/ page that resolves ids through the museum's own static JSON
// API (the same pattern as My tour), exports a ?ids= link that carries ids only, and prints as a pack. Storage calls
// sit inside try/catch; nothing about the visitor is stored or sent.
{
  const KEY = "edu-shelf", MAX = 60;
  const ID = /^[a-z]+\/[a-z0-9][a-z0-9-]*$/;
  const get = (): string[] => { try { const v = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string" && ID.test(x)).slice(0, MAX) : []; } catch { return []; } };
  const set = (v: string[]) => { try { localStorage.setItem(KEY, JSON.stringify(v.slice(0, MAX))); } catch { /* storage unavailable */ } };
  const SEG: Record<string, string> = { question: "questions", exhibit: "exhibits" };
  const seg = (id: string) => SEG[id.split("/")[0]] ?? id.split("/")[0];
  const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  // ---- shelve buttons ----
  document.querySelectorAll<HTMLButtonElement>("[data-shelf-add]").forEach((btn) => {
    const id = btn.dataset.shelfAdd || "";
    if (!ID.test(id)) return;
    const paint = () => { const on = get().includes(id); btn.setAttribute("aria-pressed", String(on)); btn.textContent = on ? (btn.dataset.added || "") : (btn.dataset.add || ""); };
    btn.addEventListener("click", () => {
      const l = get(); const i = l.indexOf(id);
      if (i >= 0) l.splice(i, 1); else { if (l.length >= MAX) { btn.textContent = btn.dataset.full || ""; return; } l.push(id); }
      set(l); paint();
    });
    paint();
  });

  // ---- the shelf page ----
  const wrap = document.querySelector<HTMLElement>("[data-shelf]");
  if (wrap) {
    const T = JSON.parse(wrap.querySelector('script[type="application/json"]')?.textContent || "{}");
    const lang = wrap.dataset.lang || "ar";
    const list = wrap.querySelector<HTMLElement>("[data-list]")!;
    const note = wrap.querySelector<HTMLElement>("[data-note]")!;
    const imported = (new URLSearchParams(location.search).get("ids") ?? "").split(",").map((s) => s.trim()).filter((s) => ID.test(s)).slice(0, MAX);
    const shown = imported.length ? imported : get();
    const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
    const card = (id: string, label: string, summary: string) =>
      `<li data-item="${esc(id)}"><a class="card" href="/${lang}/${seg(id)}/${id.split("/")[1]}/"><h3 class="card-title">${esc(label)}</h3><span>${esc(summary)}</span></a><button type="button" class="chip no-print" data-remove="${esc(id)}">${esc(T.remove || "")}</button></li>`;
    const render = async () => {
      if (!shown.length) { list.innerHTML = ""; note.textContent = T.empty || ""; return; }
      note.textContent = fill(T.count || "{n}/{max}", { n: String(shown.length), max: String(MAX) });
      const out: string[] = [];
      for (const id of shown) {
        try {
          const r = await fetch(`/api/v1/${id}.json`);
          const e = r.ok ? await r.json() : null;
          const label = e?.label?.[lang] ?? e?.label?.ar ?? e?.label?.en ?? id;
          const summary = String(e?.summary?.[lang] ?? e?.summary?.ar ?? e?.summary?.en ?? "").replace(/\s*\{cite:[^}]+\}/g, "").replace(/\[\[[^\]|]+\|([^\]]*)\]\]/g, "$1");
          out.push(card(id, label, summary));
        } catch { out.push(card(id, id, "")); }
      }
      list.innerHTML = out.join("");
    };
    list.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-remove]"); if (!b) return;
      const i = shown.indexOf(b.dataset.remove || ""); if (i >= 0) shown.splice(i, 1);
      if (!imported.length) set(shown); render();
    });
    wrap.querySelector("[data-copy]")?.addEventListener("click", async (e) => {
      const url = `${location.origin}/${lang}/learn/shelf/?ids=${shown.join(",")}`;
      try { await navigator.clipboard.writeText(url); (e.target as HTMLElement).textContent = T.copied || ""; } catch { location.href = url; }
    });
    wrap.querySelector("[data-print]")?.addEventListener("click", () => window.print());
    const clear = wrap.querySelector<HTMLButtonElement>("[data-clear]");
    if (clear) {
      let armed = false; const label = clear.textContent || "";
      const disarm = () => { armed = false; clear.textContent = label; clear.classList.remove("armed"); };
      clear.addEventListener("click", () => {
        if (!armed) { armed = true; clear.textContent = clear.dataset.confirm || label; clear.classList.add("armed"); window.setTimeout(disarm, 6000); return; }
        disarm(); shown.length = 0; if (!imported.length) set([]); render();
      });
    }
    const addAll = wrap.querySelector<HTMLElement>("[data-addall]");
    if (addAll) {
      addAll.hidden = !imported.length;
      addAll.addEventListener("click", () => { const l = get(); for (const id of shown) if (!l.includes(id) && l.length < MAX) l.push(id); set(l); addAll.textContent = T.copied || ""; });
    }
    const importNote = wrap.querySelector<HTMLElement>("[data-import-note]");
    if (importNote) importNote.hidden = !imported.length;
    render();
  }
}
