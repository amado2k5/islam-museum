// Classroom quiz (docs/delegation/education-master-plan.md §5 E3, step 1): one question at a time on the device, a
// 20-second ring per question, keys 1 to 4 to choose, Enter or N for the next question, and a per-device score kept in
// memory only. Nothing is stored and nothing leaves the page: no storage, no network call. The clock is read at run
// time only (the build never reads it). Without this script the page already shows every question and the answer sheet.
{
  const LIMIT = 20;
  const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  function init(root: HTMLElement) {
    const t = root.dataset;
    const qs = [...root.querySelectorAll<HTMLElement>("[data-q]")];
    const begin = root.querySelector<HTMLButtonElement>("[data-begin]");
    const clock = root.querySelector<HTMLElement>("[data-clock]");
    const secs = root.querySelector<HTMLElement>("[data-secs]");
    const arc = root.querySelector<SVGCircleElement>("[data-arc]");
    const done = root.querySelector<HTMLElement>("[data-done]");
    const score = root.querySelector<HTMLElement>("[data-score]");
    const revisit = root.querySelector<HTMLElement>("[data-revisit]");
    const revisitList = root.querySelector<HTMLElement>("[data-revisit-list]");
    const restart = root.querySelector<HTMLButtonElement>("[data-restart]");
    const printBtn = root.querySelector<HTMLButtonElement>("[data-print]");
    if (!begin || !clock || !secs || !arc || !done || !score || !revisit || !revisitList || !restart || !printBtn || qs.length === 0) return;

    if (new URLSearchParams(location.search).get("classroom") === "1") root.classList.add("cq-classroom");

    // Each option's text becomes a button; the HTML carries the bare text so the page reads without this script.
    for (const q of qs) {
      q.querySelectorAll<HTMLElement>(".cq-opt").forEach((li, k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "cq-choice";
        b.dataset.k = String(k);
        b.setAttribute("aria-keyshortcuts", String(k + 1));
        b.append(...li.childNodes);
        li.replaceChildren(b);
      });
    }
    const choices = (q: HTMLElement) => [...q.querySelectorAll<HTMLButtonElement>(".cq-choice")];

    let current = -1;
    let locked = false;
    let timer = 0;
    let deadline = 0;
    const right: boolean[] = [];

    const stopTimer = () => { clearInterval(timer); timer = 0; };
    const setArc = (rem: number) => { arc.style.strokeDashoffset = String(100 - 100 * (rem / LIMIT)); };
    const tick = () => {
      const rem = Math.max(0, (deadline - Date.now()) / 1000);
      secs.textContent = String(Math.ceil(rem));
      clock.setAttribute("aria-label", fill(t.i18nSecs || "", { s: String(Math.ceil(rem)) }));
      setArc(rem);
      if (rem <= 0 && current >= 0 && !locked) lock(qs[current], -1);
    };

    // picked: the option index, or -1 when the time ran out
    const lock = (q: HTMLElement, picked: number) => {
      stopTimer();
      locked = true;
      const answer = Number(q.dataset.answer);
      const ok = picked === answer;
      right[current] = ok;
      choices(q).forEach((b, k) => {
        b.disabled = true;
        if (k === answer) b.classList.add("cq-right");
        else if (k === picked) b.classList.add("cq-wrong");
      });
      q.querySelector<HTMLElement>("[data-fb]")!.textContent = picked === -1 ? t.i18nTimeup || "" : ok ? t.i18nCorrect || "" : t.i18nWrong || "";
      q.querySelector<HTMLElement>("[data-teach]")!.hidden = ok;
      const next = q.querySelector<HTMLButtonElement>("[data-next]")!;
      next.hidden = false;
      if (picked >= 0) next.focus();
    };

    const show = (i: number) => {
      current = i;
      locked = false;
      qs.forEach((q, k) => q.classList.toggle("cq-on", k === i));
      const q = qs[i];
      choices(q).forEach((b) => { b.disabled = false; b.classList.remove("cq-right", "cq-wrong"); });
      q.querySelector<HTMLElement>("[data-fb]")!.textContent = "";
      q.querySelector<HTMLElement>("[data-teach]")!.hidden = true;
      q.querySelector<HTMLButtonElement>("[data-next]")!.hidden = true;
      deadline = Date.now() + LIMIT * 1000;
      tick();
      stopTimer();
      timer = window.setInterval(tick, 200);
      choices(q)[0]?.focus();
    };

    const choose = (k: number) => {
      if (locked || current < 0) return;
      lock(qs[current], k);
    };

    const next = () => {
      if (current < 0 || !locked) return;
      if (current + 1 < qs.length) show(current + 1);
      else finish();
    };

    const finish = () => {
      stopTimer();
      current = -1;
      locked = false;
      qs.forEach((q) => q.classList.remove("cq-on"));
      clock.hidden = true;
      root.classList.remove("cq-playing");
      root.classList.add("cq-finished");
      const n = right.filter(Boolean).length;
      score.textContent = fill(t.i18nScore || "", { n: String(n), total: String(qs.length) });
      revisitList.replaceChildren();
      qs.forEach((q, i) => {
        const link = q.querySelector<HTMLAnchorElement>("[data-teach] a");
        if (right[i] || !link) return;
        const li = document.createElement("li");
        li.append(link.cloneNode(true));
        revisitList.append(li);
      });
      revisit.hidden = revisitList.childElementCount === 0;
      done.hidden = false;
      restart.hidden = false;
      printBtn.hidden = false;
      done.focus();
    };

    begin.addEventListener("click", () => {
      begin.hidden = true;
      root.classList.remove("cq-finished");
      root.classList.add("cq-playing");
      clock.hidden = false;
      done.hidden = true;
      right.length = 0;
      show(0);
    });
    for (const q of qs) {
      q.querySelectorAll<HTMLButtonElement>(".cq-choice").forEach((b, k) => b.addEventListener("click", () => choose(k)));
      q.querySelector<HTMLButtonElement>("[data-next]")!.addEventListener("click", next);
    }
    restart.addEventListener("click", () => {
      restart.hidden = true;
      printBtn.hidden = true;
      done.hidden = true;
      score.textContent = "";
      begin.hidden = false;
      root.classList.remove("cq-finished");
      begin.focus();
    });
    printBtn.addEventListener("click", () => window.print());

    // Keys: 1 to 4 choose; Enter or N goes on once the question is answered (Enter on a button uses that button).
    document.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || !root.classList.contains("cq-playing")) return;
      if (/^[1-4]$/.test(e.key) && !locked) { e.preventDefault(); choose(Number(e.key) - 1); return; }
      if ((e.key === "Enter" || e.key.toLowerCase() === "n") && locked && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); next(); }
    });
  }

  document.querySelectorAll<HTMLElement>("[data-cq]").forEach(init);
}
