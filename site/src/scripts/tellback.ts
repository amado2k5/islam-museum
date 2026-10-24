// Tell it back (docs/delegation/education-master-plan.md §5 E2). Typed mode keeps the child's text under
// `edu-retell:<id>` on the device, written only when there is something to reward (two sentences, or the tick that
// it was told to a grown-up), so the passport stamps the retelling and not the click; erase is two-step. Order mode
// (Sprouts) stores nothing at all. Every storage call sits inside try/catch; nothing is sent anywhere.
{
  const KEY = (id: string) => `edu-retell:${id}`;
  const enough = (text: string, told: boolean) => told || text.trim().split(/[.!?؟۔]\s*|\n+/).filter((s) => s.trim().length > 0).length >= 2 || text.trim().length >= 60;

  function typed(root: HTMLElement) {
    const id = root.dataset.tellback || "";
    const text = root.querySelector<HTMLTextAreaElement>("[data-text]");
    const told = root.querySelector<HTMLInputElement>("[data-told]");
    const status = root.querySelector<HTMLElement>("[data-status]");
    const erase = root.querySelector<HTMLButtonElement>("[data-erase]");
    const print = root.querySelector<HTMLElement>("[data-print]");
    if (!text || !told || !status || !erase) return;
    try {
      const saved = JSON.parse(localStorage.getItem(KEY(id)) || "null");
      if (saved && typeof saved === "object") { text.value = String(saved.text || ""); told.checked = !!saved.told; }
    } catch { /* nothing saved, or storage unavailable */ }
    if (print) print.textContent = text.value;
    let timer: number | undefined;
    const save = () => {
      const t = text.value;
      if (print) print.textContent = t;
      if (!enough(t, told.checked)) { status.textContent = ""; return; }
      try { localStorage.setItem(KEY(id), JSON.stringify({ text: t, told: told.checked, at: new Date().toISOString().slice(0, 10) })); status.textContent = root.dataset.i18nSaved || ""; } catch { /* storage unavailable */ }
    };
    text.addEventListener("input", () => { if (timer) clearTimeout(timer); timer = window.setTimeout(save, 600); });
    told.addEventListener("change", save);
    let armed = false; const label = erase.textContent || "";
    const disarm = () => { armed = false; erase.textContent = label; erase.classList.remove("armed"); };
    erase.addEventListener("click", () => {
      if (!armed) { armed = true; erase.textContent = erase.dataset.confirm || label; erase.classList.add("armed"); window.setTimeout(disarm, 6000); return; }
      disarm();
      try { localStorage.removeItem(KEY(id)); } catch { /* storage unavailable */ }
      text.value = ""; told.checked = false; if (print) print.textContent = "";
      status.textContent = root.dataset.i18nErased || "";
    });
    erase.addEventListener("keydown", (e) => { if (e.key === "Escape" && armed) disarm(); });
  }

  function order(root: HTMLElement) {
    const pool = root.querySelector<HTMLElement>("[data-pool]");
    const chosen = root.querySelector<HTMLElement>("[data-chosen]");
    const msg = root.querySelector<HTMLElement>("[data-msg]");
    const again = root.querySelector<HTMLButtonElement>("[data-again]");
    if (!pool || !chosen || !msg || !again) return;
    const cards = [...pool.querySelectorAll<HTMLButtonElement>("[data-card]")];
    const reset = () => { chosen.innerHTML = ""; cards.forEach((c) => { c.setAttribute("aria-pressed", "false"); c.disabled = false; }); msg.textContent = ""; again.hidden = true; };
    cards.forEach((c) => c.addEventListener("click", () => {
      if (c.getAttribute("aria-pressed") === "true") return;
      c.setAttribute("aria-pressed", "true"); c.disabled = true;
      const li = document.createElement("li"); li.textContent = c.textContent?.trim() || ""; chosen.appendChild(li);
      if (chosen.children.length === cards.length) { msg.textContent = root.dataset.i18nDone || ""; again.hidden = false; }
    }));
    again.addEventListener("click", reset);
  }

  document.querySelectorAll<HTMLElement>("[data-tellback]").forEach(typed);
  document.querySelectorAll<HTMLElement>("[data-tellback-order]").forEach(order);
}
