// Kids' Word Garden client: flower blooming + bee quiz.
// Progressive enhancement over the server-rendered verse list. Dependency-free.
interface Ref { s: number; a: number; t: string; form: string; name: string; slug?: string }
interface Payload {
  lang: string;
  refs: Ref[];
  surahs: { s: number; name: string }[];
  i18n: { correct: string; wrong: string; score: string };
}

const SCORE_KEY = "kids-bee-score";
const STARS_KEY = "kids-quest-stars";

function init(root: HTMLElement) {
  const payload = JSON.parse(root.querySelector("[data-payload]")!.textContent!) as Payload;
  const reduceMotion = (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.getAttribute("data-motion") === "reduce");
  const scrollOpts: ScrollIntoViewOptions = { block: "nearest", behavior: reduceMotion ? "auto" : "smooth" };

  // --- Bloom: tap a flower → show that surah's verses in the bloom panel.
  const bloom = root.querySelector("[data-bloom]") as HTMLElement;
  const bloomTitle = root.querySelector("[data-bloom-title]")!;
  const bloomList = root.querySelector("[data-bloom-list]")!;
  const flowers = [...root.querySelectorAll("[data-flower]")] as HTMLButtonElement[];
  const surahLabel = (s: number) => payload.surahs.find((x) => x.s === s)?.name ?? `Q${s}`;

  flowers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = Number(btn.dataset.surah);
      flowers.forEach((b) => b.classList.toggle("picked", b === btn));
      const refs = payload.refs.filter((r) => r.s === s);
      bloomTitle.textContent = surahLabel(s);
      bloomList.innerHTML = refs
        .map((r) => `<li><b>${r.name} ${r.a}</b> — <span lang="ar" dir="rtl">${r.t}</span></li>`)
        .join("");
      bloom.hidden = false;
      bloom.classList.add("show");
      bloom.scrollIntoView(scrollOpts);
    });
  });
  root.querySelector("[data-bloom-close]")!.addEventListener("click", () => {
    bloom.hidden = true;
    bloom.classList.remove("show");
    flowers.forEach((b) => b.classList.remove("picked"));
  });

  // --- Bee quiz: verse shown with the word blanked, guess the surah.
  const panel = root.querySelector("[data-bee-panel]") as HTMLElement;
  const start = root.querySelector("[data-bee-start]") as HTMLButtonElement;
  const verse = root.querySelector("[data-bee-verse]")!;
  const opts = root.querySelector("[data-bee-opts]")!;
  const msg = root.querySelector("[data-bee-msg]")!;
  const scoreEl = root.querySelector("[data-bee-score]")!;
  const next = root.querySelector("[data-bee-next]") as HTMLButtonElement;
  let score = 0;
  try { score = Number(localStorage.getItem(SCORE_KEY)) || 0; } catch { /* storage unavailable */ }
  const paintScore = () => { scoreEl.textContent = payload.i18n.score.replace("{n}", String(score)); };
  paintScore();

  const ask = () => {
    const r = payload.refs[Math.floor(Math.random() * payload.refs.length)];
    verse.textContent = r.t.includes(r.form) ? r.t.replace(r.form, "…") : r.t;
    msg.textContent = "";
    next.hidden = true;
    const others = payload.surahs.filter((x) => x.s !== r.s).map((x) => x.name);
    const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [...distractors, r.name].sort(() => Math.random() - 0.5);
    opts.innerHTML = "";
    options.forEach((name) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "kids-btn";
      b.textContent = name;
      b.addEventListener("click", () => {
        const ok = name === r.name;
        opts.querySelectorAll("button").forEach((x) => {
          const bx = x as HTMLButtonElement;
          bx.disabled = true;
          if (bx.textContent === r.name) bx.classList.add("q-correct");
        });
        if (!ok) b.classList.add("q-wrong");
        msg.textContent = ok ? payload.i18n.correct : payload.i18n.wrong.replace("{answer}", r.name);
        if (ok) {
          score += 1;
          try { localStorage.setItem(SCORE_KEY, String(score)); } catch { /* storage unavailable */ }
          paintScore();
        }
        next.hidden = false;
      });
      opts.appendChild(b);
    });
  };
  start.addEventListener("click", () => { panel.hidden = false; start.hidden = true; ask(); });
  next.addEventListener("click", ask);

  // --- Erase progress: two-step confirm, clears all Kids' Wing localStorage.
  const eraseBtn = root.querySelector("[data-erase]") as HTMLButtonElement;
  if (eraseBtn) {
    const eraseLabel = eraseBtn.textContent || "";
    const eraseConfirm = eraseBtn.dataset.confirm || eraseLabel;
    let armed = false;
    let timer: number | undefined;
    const disarm = () => {
      armed = false;
      eraseBtn.textContent = eraseLabel;
      if (timer !== undefined) { window.clearTimeout(timer); timer = undefined; }
    };
    eraseBtn.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        eraseBtn.textContent = eraseConfirm;
        timer = window.setTimeout(disarm, 5000);
        return;
      }
      disarm();
      try { localStorage.removeItem(SCORE_KEY); localStorage.removeItem(STARS_KEY); } catch { /* storage unavailable */ }
      score = 0;
      paintScore();
    });
    eraseBtn.addEventListener("keydown", (e) => { if (e.key === "Escape" && armed) disarm(); });
  }
}

document.querySelectorAll("[data-garden]").forEach((el) => init(el as HTMLElement));
