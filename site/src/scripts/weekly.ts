// The family's weekly sheet (docs/delegation/education-master-plan.md §5 E2): fills, on the device, the stamps earned in
// the last seven days (from `edu-passport`), the cards due for review (from `edu-srs`) and this week's family activity
// (by ISO week number over the 52 the page already carries). Reads only; writes nothing; storage inside try/catch.
{
  const get = (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } };
  const isoWeek = (d: Date): number => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
    const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil((((t.getTime() - y0.getTime()) / 86400000) + 1) / 7);
  };
  const root = document.querySelector<HTMLElement>("[data-weekly]");
  if (root) {
    const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    const now = new Date();
    const since = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
    // done this week
    let stamps: Record<string, string> = {};
    try { const p = JSON.parse(get("edu-passport") || "null"); if (p && p.stamps) stamps = p.stamps; } catch { /* none */ }
    const done = Object.entries(stamps).filter(([, d]) => d >= since).map(([id]) => id);
    root.querySelectorAll<HTMLElement>("[data-stamp-row]").forEach((el) => { el.hidden = !done.includes(el.dataset.stampRow || ""); });
    const none = root.querySelector<HTMLElement>("[data-done-none]"); if (none) none.hidden = done.length > 0;
    // due for review
    let due = 0;
    try { const s = JSON.parse(get("edu-srs") || "{}") as Record<string, Record<string, { due?: string }>>; const t = now.toISOString().slice(0, 10); for (const deck of Object.values(s)) for (const it of Object.values(deck)) if (it && it.due && it.due <= t) due++; } catch { due = 0; }
    const dueEl = root.querySelector<HTMLElement>("[data-due]"); const dueNone = root.querySelector<HTMLElement>("[data-due-none]");
    if (dueEl) { dueEl.hidden = due === 0; dueEl.textContent = fill(dueEl.dataset.tpl || "{n}", { n: String(due) }); }
    if (dueNone) dueNone.hidden = due > 0;
    // this week's activity: week N of 52
    const week = ((isoWeek(now) - 1) % 52) + 1;
    root.querySelectorAll<HTMLElement>("[data-week]").forEach((el) => { el.hidden = Number(el.dataset.week) !== week; });
    const wk = root.querySelector<HTMLElement>("[data-week-label]"); if (wk) wk.textContent = fill(wk.dataset.tpl || "{n}", { n: String(week) });
    root.querySelector("[data-print]")?.addEventListener("click", () => window.print());
  }
}
