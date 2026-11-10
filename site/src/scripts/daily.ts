// Daily challenge (docs/delegation/education-master-plan.md §5 E3, step 2): plays today's five Century Challenge rounds from
// the static schedule (`/edu/daily-schedule.json`, the same origin, read once; the museum's static JSON is read the same way
// by the shelf and the tour), keeps the score in memory only, and writes the result text: the day, a five-square grid and the
// page path. No storage, no cookie, no personal data, no URL parameter; the clock is read at run time to pick the day.
{
  const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  // Day of the year, 1 to 366, from the device's local date (the schedule has 366 entries, 29 February included).
  function dayOfYear(d: Date): number {
    const start = Date.UTC(d.getFullYear(), 0, 0);
    const today = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    return Math.round((today - start) / 86400000);
  }

  function init(root: HTMLElement) {
    const t = root.dataset;
    const lang = t.lang || "ar";
    const box = root.querySelector<HTMLElement>("[data-rounds]");
    const result = root.querySelector<HTMLElement>("[data-result]");
    const scoreEl = root.querySelector<HTMLElement>("[data-score]");
    const text = root.querySelector<HTMLTextAreaElement>("[data-text]");
    const copy = root.querySelector<HTMLButtonElement>("[data-copy]");
    const share = root.querySelector<HTMLButtonElement>("[data-share]");
    const msg = root.querySelector<HTMLElement>("[data-msg]");
    if (!box || !result || !scoreEl || !text || !copy || !share || !msg) return;
    const nojs = root.querySelector<HTMLElement>("[data-nojs]");
    const loc = (o: Record<string, string> | undefined) => o?.[lang] ?? o?.en ?? o?.ar ?? "";

    const label = (r: any) => loc(r.label);

    function play(day: { day: number; rounds: any[] }) {
      const rounds = day.rounds;
      const got: boolean[] = [];
      let done = 0;
      box!.replaceChildren();
      rounds.forEach((r, i) => {
        const sec = document.createElement("section");
        sec.className = "dl-round";
        const h = document.createElement("h3");
        h.textContent = fill(t.i18nRound || "", { i: String(i + 1), n: String(rounds.length) });
        const q = document.createElement("p");
        q.className = "dl-q";
        q.textContent = fill(t.i18nQuestion || "", { event: label(r) });
        const ul = document.createElement("ul");
        ul.className = "dl-choices";
        const fb = document.createElement("p");
        fb.className = "dl-fb";
        fb.setAttribute("role", "status");
        const buttons: HTMLButtonElement[] = [];
        for (const c of r.choices as number[]) {
          const li = document.createElement("li");
          const b = document.createElement("button");
          b.type = "button";
          b.className = "dl-choice";
          b.textContent = fill(t.i18nChoice || "", { n: String(c) });
          b.addEventListener("click", () => {
            if (got[i] !== undefined) return;
            const ok = c === r.century;
            got[i] = ok;
            buttons.forEach((x, k) => {
              x.disabled = true;
              if ((r.choices as number[])[k] === r.century) x.classList.add("dl-right");
              else if (x === b) x.classList.add("dl-wrong");
            });
            fb.textContent = ok ? t.i18nRight || "" : t.i18nWrong || "";
            done++;
            if (done === rounds.length) finish(got);
          });
          buttons.push(b);
          li.append(b);
          ul.append(li);
        }
        sec.append(h, q, ul, fb);
        box!.append(sec);
      });
    }

    function finish(got: boolean[]) {
      const n = got.filter(Boolean).length;
      const total = got.length;
      const grid = got.map((ok) => (ok ? "🟩" : "⬜")).join("");
      const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "numeric" }).format(new Date());
      const link = `${t.site || ""}${t.path || ""}`;
      scoreEl!.textContent = fill(t.i18nScore || "", { n: String(n), total: String(total) });
      text!.value = `${t.i18nBrand || ""} · ${t.i18nName || ""} · ${date} · ${grid}\n${link}`;
      result!.hidden = false;
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") share!.hidden = false;
      msg!.textContent = t.i18nDone || "";
    }

    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text!.value);
        msg!.textContent = t.i18nCopied || "";
      } catch {
        text!.select();
      }
    });
    share.addEventListener("click", async () => {
      try {
        await navigator.share({ text: text!.value });
      } catch {
        /* the person cancelled the share sheet */
      }
    });

    // The schedule is one same-origin file of static JSON, read once when the page opens.
    fetch("/edu/daily-schedule.json")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((s: { days: { day: number; rounds: any[] }[] }) => {
        if (nojs) nojs.hidden = true;
        const day = s.days[Math.min(Math.max(dayOfYear(new Date()), 1), s.days.length) - 1];
        play(day);
      })
      .catch(() => { box!.textContent = t.i18nError || ""; });
  }

  document.querySelectorAll<HTMLElement>("[data-daily]").forEach(init);
}
