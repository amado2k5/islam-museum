// WordMap client: form expansion → collocation/occurrence detail panel + quiz mode.
// Progressive enhancement over the static SVG + no-JS fallback list.
interface Ref { s: number; a: number; t: string; name: string }
interface Payload {
  slug: string; word: string; total: number; lang: string;
  forms: { form: string; count: number; refs: Ref[] }[];
  collocations: { after: string; phrase: string; count: number; refs: Ref[] }[];
}

function init(root: HTMLElement) {
  const payload = JSON.parse(root.querySelector("[data-payload]")!.textContent!) as Payload;
  const panel = root.querySelector("[data-panel]") as HTMLElement;
  const ptitle = root.querySelector("[data-ptitle]")!;
  const pbody = root.querySelector("[data-pbody]")!;
  const lang = payload.lang;

  const show = (title: string, html: string) => {
    ptitle.textContent = title;
    pbody.innerHTML = html;
    panel.hidden = false;
    panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  const hide = () => { panel.hidden = true; };

  root.querySelector("[data-close]")!.addEventListener("click", hide);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { hide(); quiz.hidden = true; } });

  // Click a form node → show its collocations + sample occurrences.
  const refList = (refs: Ref[]) =>
    `<ul>${refs.slice(0, 12).map((r) =>
      `<li><b>${r.name} ${r.a}</b> — <span lang="ar" dir="rtl">${r.t}</span></li>`).join("")}</ul>` +
    (refs.length > 12 ? `<p>… +${refs.length - 12}</p>` : "");

  root.querySelectorAll(".wm-form").forEach((g) => {
    const open = () => {
      const form = (g as HTMLElement).dataset.form!;
      const f = payload.forms.find((x) => x.form === form)!;
      const colloc = payload.collocations
        .filter((c) => c.refs.some((r) => f.refs.some((fr) => fr.s === r.s && fr.a === r.a)))
        .slice(0, 8);
      show(form,
        (colloc.length ? `<p><b>${lang === "ar" ? "التراكيب" : "Collocations"}</b></p><ul>` +
          colloc.map((c) => `<li><span lang="ar" dir="rtl">${c.phrase}</span> — ${c.count}</li>`).join("") + `</ul>` : "") +
        `<p><b>${lang === "ar" ? "المواضع" : "Occurrences"} (${f.count})</b></p>` + refList(f.refs));
    };
    g.addEventListener("click", open);
    g.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") { e.preventDefault(); open(); } });
  });

  // Quiz: blank the word in a random verse, guess the surah from 4 options.
  const quiz = root.querySelector("[data-quiz]") as HTMLElement;
  const qverse = root.querySelector("[data-qverse]")!;
  const qopts = root.querySelector("[data-qopts]")!;
  const qscore = root.querySelector("[data-qscore]")!;
  let score = 0, rounds = 0;
  const allRefs = payload.forms.flatMap((f) => f.refs.map((r) => ({ ...r, form: f.form })));

  const ask = () => {
    const pick = allRefs[Math.floor(Math.random() * allRefs.length)];
    const blanked = pick.t.split(/\s+/).map((w) =>
      w.replace(/[ً-ٰٟ]/g, "").includes(pick.form.replace(/[ً-ٰٟ]/g, "")) ? "﴿ … ﴾" : w).join(" ");
    qverse.innerHTML = `<span lang="ar" dir="rtl">${blanked}</span>`;
    const correct = pick.name;
    const others = [...new Set(allRefs.map((r) => r.name))].filter((n) => n !== correct);
    const opts = [correct, ...others.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    qopts.innerHTML = "";
    opts.forEach((o) => {
      const b = document.createElement("button");
      b.textContent = o;
      b.addEventListener("click", () => {
        rounds++;
        if (o === correct) { score++; b.style.borderColor = "green"; } else b.style.borderColor = "red";
        qscore.textContent = `${score} / ${rounds}`;
        [...qopts.children].forEach((c) => ((c as HTMLButtonElement).disabled = true));
      });
      qopts.appendChild(b);
    });
  };
  root.querySelector("[data-quizbtn]")!.addEventListener("click", () => { quiz.hidden = false; ask(); });
  root.querySelector("[data-qnext]")!.addEventListener("click", ask);
  root.querySelector("[data-qclose]")!.addEventListener("click", () => { quiz.hidden = true; });
}

document.querySelectorAll("[data-wordmap]").forEach((r) => init(r as HTMLElement));
