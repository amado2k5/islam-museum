// Storytellers retell client: stop picker (one card at a time), per-slug draft
// autosave to localStorage, two-step erase per draft, print. Dependency-free.
// The page server-renders all 5 stops; this script narrows to the picked one
// and drops the no-JS note. Erase follows the same two-step shape as
// kindness.ts (armed state, confirm label swap, 5s auto-disarm, Escape cancels).
const KEY_PREFIX = "kids-retell-";

function guardedLoad(slug: string): string {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + slug);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { text?: unknown } | null;
    return typeof parsed?.text === "string" ? parsed.text : "";
  } catch {
    return "";
  }
}

function guardedSave(slug: string, text: string): void {
  try {
    localStorage.setItem(KEY_PREFIX + slug, JSON.stringify({ text, ts: Date.now() }));
  } catch {
    /* storage unavailable */
  }
}

function guardedRemove(slug: string): void {
  try {
    localStorage.removeItem(KEY_PREFIX + slug);
  } catch {
    /* storage unavailable */
  }
}

function init(root: HTMLElement) {
  const eraseDone = root.dataset.i18nEraseDone || "";

  // The no-JS note is only for readers without scripts; JS is running, so drop it.
  root.querySelector("[data-nojs-note]")?.remove();

  // Picker: show one card at a time, mark the active button.
  const picks = [...root.querySelectorAll<HTMLButtonElement>("[data-pick]")];
  const cards = [...root.querySelectorAll<HTMLElement>("[data-card]")];
  const show = (slug: string) => {
    cards.forEach((c) => { c.hidden = c.dataset.card !== slug; });
    picks.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.pick === slug)));
  };
  if (cards.length) show(cards[0].dataset.card || "");
  picks.forEach((b) => b.addEventListener("click", () => show(b.dataset.pick || "")));

  const areas = [...root.querySelectorAll<HTMLTextAreaElement>("[data-draft]")];
  const paintPrint = (slug: string, text: string) => {
    const el = root.querySelector<HTMLElement>(`[data-draft-print="${slug}"]`);
    if (el) el.textContent = text;
  };
  areas.forEach((ta) => {
    const slug = ta.dataset.draft || "";
    ta.value = guardedLoad(slug);
    paintPrint(slug, ta.value);
    ta.addEventListener("input", () => {
      guardedSave(slug, ta.value);
      paintPrint(slug, ta.value);
    });
  });

  // Refresh the printable drafts right before printing (covers in-flight edits).
  window.addEventListener("beforeprint", () => {
    areas.forEach((ta) => paintPrint(ta.dataset.draft || "", ta.value));
  });

  root.querySelectorAll("[data-print]").forEach((b) =>
    b.addEventListener("click", () => window.print()));

  // Erase per draft: two-step confirm, same shape as kindness.ts.
  const erasers = [...root.querySelectorAll<HTMLButtonElement>("[data-erase]")];
  erasers.forEach((btn) => {
    const slug = btn.dataset.erase || "";
    const msg = root.querySelector<HTMLElement>(`[data-erase-msg="${slug}"]`);
    const ta = root.querySelector<HTMLTextAreaElement>(`[data-draft="${slug}"]`);
    const label = btn.textContent || "";
    const confirm = btn.dataset.confirm || label;
    let armed = false;
    let timer: number | undefined;
    const disarm = () => {
      armed = false;
      btn.textContent = label;
      if (timer !== undefined) { window.clearTimeout(timer); timer = undefined; }
    };
    btn.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        btn.textContent = confirm;
        timer = window.setTimeout(disarm, 5000);
        return;
      }
      disarm();
      guardedRemove(slug);
      if (ta) ta.value = "";
      paintPrint(slug, "");
      if (msg) msg.textContent = eraseDone;
    });
    btn.addEventListener("keydown", (e) => { if (e.key === "Escape" && armed) disarm(); });
  });
}

document.querySelectorAll("[data-retell]").forEach((el) => init(el as HTMLElement));
