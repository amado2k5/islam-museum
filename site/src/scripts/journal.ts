// Storytellers journal client: append timestamped entries to localStorage
// ("kids-journal", guarded JSON), list newest-first, erase-all with the same
// two-step confirm shape as kindness.ts (armed state, confirm label swap,
// 5s auto-disarm, Escape cancels). Dependency-free.
const KEY = "kids-journal";
const MAX_ENTRIES = 500;

interface Entry { ts: number; text: string }

function guardedLoad(): Entry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return (raw as unknown[])
      .filter((e): e is Entry =>
        !!e && typeof e === "object" &&
        typeof (e as Entry).ts === "number" &&
        typeof (e as Entry).text === "string")
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

function guardedSave(entries: Entry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable */
  }
}

function init(root: HTMLElement) {
  const eraseDone = root.dataset.i18nEraseDone || "";
  const emptyMsg = root.querySelector<HTMLElement>("[data-empty]");
  const list = root.querySelector<HTMLElement>("[data-entries]");
  const ta = root.querySelector<HTMLTextAreaElement>("[data-entry]");
  const saveBtn = root.querySelector<HTMLButtonElement>("[data-save]");
  const eraseBtn = root.querySelector<HTMLButtonElement>("[data-erase]");
  const msg = root.querySelector<HTMLElement>("[data-msg]");

  // JS is running: drop the no-JS explanation section.
  root.querySelector("[data-nojs]")?.remove();

  const locale = document.documentElement.lang === "en" ? "en-US" : "ar-EG";
  const dateFmt = (ts: number): string => {
    try {
      return new Date(ts).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return "";
    }
  };

  const paint = () => {
    if (!list) return;
    list.innerHTML = "";
    const entries = guardedLoad().sort((a, b) => b.ts - a.ts);
    entries.forEach((e) => {
      const li = document.createElement("li");
      const time = document.createElement("time");
      try { time.dateTime = new Date(e.ts).toISOString(); } catch { /* leave unset */ }
      time.textContent = dateFmt(e.ts);
      const p = document.createElement("p");
      p.textContent = e.text; // textContent: no HTML injection
      li.append(time, p);
      list.appendChild(li);
    });
    if (emptyMsg) emptyMsg.hidden = entries.length > 0;
  };

  saveBtn?.addEventListener("click", () => {
    if (!ta) return;
    const text = ta.value.trim();
    if (!text) { ta.focus(); return; }
    const entries = guardedLoad();
    entries.push({ ts: Date.now(), text });
    guardedSave(entries);
    ta.value = "";
    ta.focus();
    paint();
  });

  root.querySelector("[data-print]")?.addEventListener("click", () => window.print());

  // Erase-all: two-step confirm, same shape as kindness.ts.
  if (eraseBtn) {
    const label = eraseBtn.textContent || "";
    const confirm = eraseBtn.dataset.confirm || label;
    let armed = false;
    let timer: number | undefined;
    const disarm = () => {
      armed = false;
      eraseBtn.textContent = label;
      if (timer !== undefined) { window.clearTimeout(timer); timer = undefined; }
    };
    eraseBtn.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        eraseBtn.textContent = confirm;
        timer = window.setTimeout(disarm, 5000);
        return;
      }
      disarm();
      try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
      if (msg) msg.textContent = eraseDone;
      paint();
    });
    eraseBtn.addEventListener("keydown", (e) => { if (e.key === "Escape" && armed) disarm(); });
  }

  paint();
}

document.querySelectorAll("[data-journal]").forEach((el) => init(el as HTMLElement));
