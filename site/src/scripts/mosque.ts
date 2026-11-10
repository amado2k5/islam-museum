// Build-a-Mosque client: tap palette buttons to place parts on the courtyard
// canvas (one of each — tapping toggles), tap a placed chip to remove it.
// Placed parts and the mosque name persist in localStorage. Hudhud's speech
// and pose follow milestones: first part, dome, minaret, all seven.
// Start-over uses the same two-step confirm shape as kindness.ts
// (armed state, confirm label swap, 5s auto-disarm, Escape cancels).
// Dependency-free, guarded JSON.
const PARTS_KEY = "kids-mosque-parts";
const NAME_KEY = "kids-mosque-name";
const ALL_SLUGS = ["dome", "minaret", "courtyard", "prayer-hall", "mihrab", "main-door", "fountain"];

function init(root: HTMLElement) {
  const palette = [...root.querySelectorAll("[data-place]")] as HTMLButtonElement[];
  const canvas = root.querySelector("[data-canvas]") as HTMLElement | null;
  const emptyEl = root.querySelector("[data-empty]") as HTMLElement | null;
  const speech = root.querySelector("[data-speech]") as HTMLElement | null;
  const poses = [...root.querySelectorAll("[data-hudhud]")] as HTMLElement[];
  const nameInput = root.querySelector("[data-name-input]") as HTMLInputElement | null;
  const nameLine = root.querySelector("[data-name-line]") as HTMLElement | null;
  const nameText = root.querySelector("[data-name-text]") as HTMLElement | null;
  const printName = root.querySelector("[data-print-name]") as HTMLElement | null;
  const printItems = [...root.querySelectorAll("[data-print-item]")] as HTMLElement[];
  const eraseBtn = root.querySelector("[data-erase]") as HTMLButtonElement | null;
  const eraseMsg = root.querySelector("[data-erase-msg]") as HTMLElement | null;

  const removeT = root.dataset.i18nRemove || "Remove";
  const pickT = root.dataset.i18nPick || "";
  const msFirst = root.dataset.i18nMsFirst || "";
  const msDome = root.dataset.i18nMsDome || "";
  const msMinaret = root.dataset.i18nMsMinaret || "";
  const msAll = root.dataset.i18nMsAll || "";
  const namePattern = root.dataset.namePattern || "{name}";

  const info = new Map<string, { name: string; what: string; icon: string }>();
  palette.forEach((b) => {
    const slug = b.dataset.place || "";
    info.set(slug, {
      name: b.dataset.name || slug,
      what: b.dataset.what || "",
      icon: b.dataset.icon || "⭐",
    });
  });

  let placed: string[] = [];
  try {
    const raw = JSON.parse(localStorage.getItem(PARTS_KEY) || "[]");
    placed = Array.isArray(raw)
      ? raw.filter((s) => typeof s === "string" && ALL_SLUGS.includes(s))
      : [];
  } catch {
    placed = [];
  }
  const saveParts = () => {
    try {
      localStorage.setItem(PARTS_KEY, JSON.stringify(placed));
    } catch {
      /* storage unavailable */
    }
  };

  const setPose = (pose: string) => {
    poses.forEach((p) => {
      p.hidden = p.dataset.hudhud !== pose;
    });
  };

  // Milestone speech is derived from state (highest true milestone wins),
  // so removing parts always lands on the right line and pose.
  const updateSpeech = () => {
    if (speech) {
      let text = pickT;
      if (placed.length >= ALL_SLUGS.length) text = msAll;
      else if (placed.includes("dome")) text = msDome;
      else if (placed.includes("minaret")) text = msMinaret;
      else if (placed.length >= 1) text = msFirst;
      speech.textContent = text;
    }
    setPose(placed.length === 0 ? "greet" : placed.length >= ALL_SLUGS.length ? "celebrate" : "think");
  };

  const paint = () => {
    if (!canvas) return;
    palette.forEach((b) => {
      const on = placed.includes(b.dataset.place || "");
      b.classList.toggle("placed", on);
      b.setAttribute("aria-pressed", String(on));
    });
    canvas.querySelectorAll("[data-chip]").forEach((c) => c.remove());
    placed.forEach((slug) => {
      const part = info.get(slug);
      if (!part) return;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "placed-chip";
      chip.dataset.chip = slug;
      chip.setAttribute("aria-label", `${removeT}: ${part.name}`);
      const icon = document.createElement("span");
      icon.className = "chip-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = part.icon;
      const nm = document.createElement("span");
      nm.className = "chip-name";
      nm.textContent = part.name;
      const wh = document.createElement("span");
      wh.className = "chip-what";
      wh.textContent = part.what;
      chip.append(icon, nm, wh);
      chip.addEventListener("click", () => {
        placed = placed.filter((s) => s !== slug);
        saveParts();
        paint();
      });
      canvas.appendChild(chip);
    });
    if (emptyEl) emptyEl.hidden = placed.length > 0;
    printItems.forEach((li) => {
      li.hidden = !placed.includes(li.dataset.printItem || "");
    });
    updateSpeech();
  };

  palette.forEach((b) =>
    b.addEventListener("click", () => {
      const slug = b.dataset.place || "";
      if (placed.includes(slug)) placed = placed.filter((s) => s !== slug);
      else placed.push(slug);
      saveParts();
      paint();
    })
  );

  // Mosque name: persisted, shown above the canvas and on the print sheet.
  const showName = (name: string) => {
    const label = name ? namePattern.replace("{name}", name) : "";
    if (nameText) nameText.textContent = label;
    if (nameLine) nameLine.hidden = !name;
    if (printName) printName.textContent = label;
  };
  if (nameInput) {
    try {
      nameInput.value = (localStorage.getItem(NAME_KEY) || "").slice(0, 40);
    } catch {
      /* storage unavailable */
    }
    showName(nameInput.value.trim());
    nameInput.addEventListener("input", () => {
      const v = nameInput.value.slice(0, 40);
      try {
        localStorage.setItem(NAME_KEY, v);
      } catch {
        /* storage unavailable */
      }
      showName(v.trim());
    });
  }

  root.querySelector("[data-print]")?.addEventListener("click", () => window.print());

  // Start over: two-step confirm, same shape as kindness.ts.
  if (eraseBtn && eraseMsg) {
    const startOverLabel = eraseBtn.textContent || "";
    const confirmLabel = eraseBtn.dataset.confirm || startOverLabel;
    const doneLabel = root.dataset.i18nEraseDone || "";
    let armed = false;
    let timer: number | undefined;
    const disarm = () => {
      armed = false;
      eraseBtn.textContent = startOverLabel;
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };
    eraseBtn.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        eraseBtn.textContent = confirmLabel;
        timer = window.setTimeout(disarm, 5000);
        return;
      }
      disarm();
      try {
        localStorage.removeItem(PARTS_KEY);
        localStorage.removeItem(NAME_KEY);
      } catch {
        /* storage unavailable */
      }
      placed = [];
      if (nameInput) nameInput.value = "";
      showName("");
      eraseMsg.textContent = doneLabel;
      paint();
    });
    eraseBtn.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && armed) disarm();
    });
  }

  paint();
}

document.querySelectorAll("[data-mosque]").forEach((el) => init(el as HTMLElement));
