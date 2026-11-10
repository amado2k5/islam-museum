// Sprout Garden client: tap a flower → the bloom panel celebrates.
// Progressive enhancement over the server-rendered page; dependency-free.
interface GardenPayload {
  word: string;
  surahs: { s: number; name: string }[];
}

const BURST_EMOJI = ["🎉", "✨", "🌟", "💛", "🌸"];

function init(root: HTMLElement) {
  const payload = JSON.parse(root.querySelector("[data-payload]")!.textContent!) as GardenPayload;
  const reduceMotion = () => (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.getAttribute("data-motion") === "reduce");
  const scrollOpts = (): ScrollIntoViewOptions => ({ block: "nearest", behavior: reduceMotion() ? "auto" : "smooth" });

  const bloom = root.querySelector("[data-bloom]") as HTMLElement;
  const bloomWord = root.querySelector("[data-bloom-word]")!;
  const bloomSurah = root.querySelector("[data-bloom-surah]")!;
  const flowers = [...root.querySelectorAll("[data-flower]")] as HTMLButtonElement[];

  const burst = () => {
    if (reduceMotion()) return;
    for (let i = 0; i < 6; i++) {
      const s = document.createElement("span");
      s.className = "burst-emoji";
      s.setAttribute("aria-hidden", "true");
      s.textContent = BURST_EMOJI[i % BURST_EMOJI.length];
      // Logical-positioned, random drift via CSS custom properties.
      const dir = document.dir === "rtl" ? -1 : 1;
      s.style.insetInlineStart = `${20 + Math.random() * 60}%`;
      s.style.insetBlockStart = `${30 + Math.random() * 40}%`;
      s.style.setProperty("--bx", `${dir * (Math.random() * 160 - 80)}px`);
      s.style.setProperty("--by", `${-(60 + Math.random() * 90)}px`);
      s.addEventListener("animationend", () => s.remove());
      bloom.appendChild(s);
      // Safety: never leave burst nodes behind.
      window.setTimeout(() => s.remove(), 1500);
    }
  };

  flowers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sh = payload.surahs[Number(btn.dataset.index)];
      if (!sh) return;
      flowers.forEach((b) => b.classList.toggle("picked", b === btn));
      bloomWord.textContent = payload.word;
      bloomSurah.textContent = sh.name;
      bloom.hidden = false;
      burst();
      bloom.scrollIntoView(scrollOpts());
    });
  });
}

document.querySelectorAll("[data-sprouts-garden]").forEach((el) => init(el as HTMLElement));

// Module scope: keep this script's globals out of the site-wide script scope.
export {};
