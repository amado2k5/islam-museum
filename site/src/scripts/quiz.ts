// Mastery check (docs/delegation/education-master-plan.md §5 E2): marks the five questions on the device, points a wrong
// answer to the step that teaches it, and on a pass writes `edu-quiz:<trail id>` = "pass" (the passport's stamp rule);
// nothing else is stored, no answer leaves the device. Storage calls sit inside try/catch.
{
  const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  function init(root: HTMLElement) {
    const id = root.dataset.quiz || "";
    const need = Number(root.dataset.pass || 4);
    const qs = [...root.querySelectorAll<HTMLElement>("[data-q]")];
    const check = root.querySelector<HTMLButtonElement>("[data-check]");
    const again = root.querySelector<HTMLButtonElement>("[data-again]");
    const score = root.querySelector<HTMLElement>("[data-score]");
    const msg = root.querySelector<HTMLElement>("[data-msg]");
    if (!check || !again || !score || !msg) return;
    const t = root.dataset;
    const reset = () => {
      for (const q of qs) {
        q.classList.remove("ok", "ko");
        q.querySelectorAll<HTMLInputElement>("input").forEach((i) => { i.checked = false; i.disabled = false; });
        q.querySelector<HTMLElement>("[data-fb]")!.textContent = "";
        q.querySelector<HTMLElement>("[data-teach]")!.hidden = true;
      }
      score.textContent = ""; msg.textContent = ""; again.hidden = true; check.hidden = false;
    };
    check.addEventListener("click", () => {
      const picked = qs.map((q) => q.querySelector<HTMLInputElement>("input:checked"));
      if (picked.some((p) => !p)) { msg.textContent = t.i18nUnanswered || ""; return; }
      let n = 0;
      qs.forEach((q, i) => {
        const ok = Number(picked[i]!.value) === Number(q.dataset.answer);
        if (ok) n++;
        q.classList.toggle("ok", ok); q.classList.toggle("ko", !ok);
        q.querySelector<HTMLElement>("[data-fb]")!.textContent = ok ? (t.i18nCorrect || "") : (t.i18nWrong || "");
        q.querySelector<HTMLElement>("[data-teach]")!.hidden = ok;
        q.querySelectorAll<HTMLInputElement>("input").forEach((inp) => { inp.disabled = true; });
      });
      score.textContent = fill(t.i18nResult || "{n}/{total}", { n: String(n), total: String(qs.length) });
      const pass = n >= need;
      msg.textContent = pass ? (t.i18nPass || "") : (t.i18nRetry || "");
      if (pass) { try { localStorage.setItem(`edu-quiz:${id}`, "pass"); } catch { /* storage unavailable */ } }
      check.hidden = true; again.hidden = false;
      if (!pass) { const first = qs.find((q) => q.classList.contains("ko")); first?.scrollIntoView({ block: "nearest" }); }
    });
    again.addEventListener("click", reset);
  }
  document.querySelectorAll<HTMLElement>("[data-quiz]").forEach(init);
}
