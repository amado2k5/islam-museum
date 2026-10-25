// Practice set marking (docs/delegation/education-master-plan.md §5 E4): marks the 10 questions on
// the device, reveals every option's explanation, and writes `edu-practice:<topic id>` = "done" so
// the Journey Map can colour the territory. Keyboard-first: the inputs are native radios, so Tab /
// arrows / Enter work with no script; this file only adds the marking. Storage calls sit inside
// try/catch; nothing leaves the device.
{
  const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  function init(root: HTMLElement) {
    const id = root.dataset.practice || "";
    const qs = [...root.querySelectorAll<HTMLElement>("[data-q]")];
    const check = root.querySelector<HTMLButtonElement>("[data-check]");
    const again = root.querySelector<HTMLButtonElement>("[data-again]");
    const score = root.querySelector<HTMLElement>("[data-score]");
    const msg = root.querySelector<HTMLElement>("[data-msg]");
    if (!check || !again || !score || !msg) return;
    const t = root.dataset;
    const reset = () => {
      for (const q of qs) {
        q.classList.remove("ok", "ko", "done");
        q.querySelectorAll<HTMLElement>("[data-opt]").forEach((o) => {
          delete o.dataset.right;
          delete o.dataset.picked;
        });
        q.querySelectorAll<HTMLInputElement>("input").forEach((i) => { i.checked = false; i.disabled = false; });
        q.querySelectorAll<HTMLElement>("[data-why]").forEach((w) => { w.hidden = true; });
        q.querySelector<HTMLElement>("[data-fb]")!.textContent = "";
      }
      score.textContent = ""; msg.textContent = ""; again.hidden = true; check.hidden = false;
    };
    check.addEventListener("click", () => {
      const picked = qs.map((q) => q.querySelector<HTMLInputElement>("input:checked"));
      if (picked.some((p) => !p)) { msg.textContent = t.i18nUnanswered || ""; return; }
      let n = 0;
      qs.forEach((q, i) => {
        const chosen = Number(picked[i]!.value);
        const ok = chosen === Number(q.dataset.answer);
        if (ok) n++;
        q.classList.add("done");
        q.classList.toggle("ok", ok); q.classList.toggle("ko", !ok);
        q.querySelectorAll<HTMLElement>("[data-opt]").forEach((o) => {
          if (Number(o.dataset.opt) === Number(q.dataset.answer)) o.dataset.right = "";
          if (Number(o.dataset.opt) === chosen) o.dataset.picked = "";
        });
        q.querySelectorAll<HTMLElement>("[data-why]").forEach((w) => { w.hidden = false; });
        q.querySelector<HTMLElement>("[data-fb]")!.textContent = ok ? (t.i18nCorrect || "") : (t.i18nWrong || "");
        q.querySelectorAll<HTMLInputElement>("input").forEach((inp) => { inp.disabled = true; });
      });
      score.textContent = fill(t.i18nResult || "{n}/{total}", { n: String(n), total: String(qs.length) });
      try { localStorage.setItem(`edu-practice:${id}`, "done"); } catch { /* storage unavailable */ }
      check.hidden = true; again.hidden = false;
      const first = qs.find((q) => q.classList.contains("ko"));
      first?.scrollIntoView({ block: "nearest" });
    });
    again.addEventListener("click", reset);
  }
  document.querySelectorAll<HTMLElement>("[data-practice]").forEach(init);
}
