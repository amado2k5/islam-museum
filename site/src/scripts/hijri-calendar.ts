// Hijri calendar client (docs/plan/06 Phase 2): browses the Hijri year month by
// month in the browser, using the same conversion code as scripts/hijri/convert.ts
// (Umm al-Qura 1318–1500 AH, tabular elsewhere). No server calls.
import { civilToHijri, hijriToCivil, toJDN, tabularToJDN, type YMD } from "../../../scripts/hijri/convert";

{
type Obs = { m: number; days: number[]; key: string; label: string; href?: string };
type Payload = {
  months: string[]; weekdays: string[];
  obs: Obs[];
  today: { h: YMD; g: YMD };
  t: { prev: string; next: string; today: string; approx: string; umalqura: string; observances: string; obs_none: string; jump: string };
};

const hijriJDN = (y: number, m: number, d: number): number => {
  if (y >= 1318 && y <= 1500) {
    const c = hijriToCivil({ y, m, d });
    return toJDN(c.calendar, c.date);
  }
  return tabularToJDN({ y, m, d });
};
const monthLen = (y: number, m: number) => {
  const [ny, nm] = m === 12 ? [y + 1, 1] : [y, m + 1];
  return hijriJDN(ny, nm, 1) - hijriJDN(y, m, 1);
};
const wdOf = (jdn: number) => { const a = (jdn + 1) % 7; return a < 0 ? a + 7 : a; };
const pad = (n: number) => String(n).padStart(2, "0");
const fmtG = (c: { date: YMD; calendar: string }) => `${c.date.y}-${pad(c.date.m)}-${pad(c.date.d)}${c.calendar === "julian" ? " Julian" : ""}`;

function init(root: HTMLElement) {
  const payload: Payload = JSON.parse(root.querySelector('script[type="application/json"]')!.textContent!);
  const grid = root.querySelector("[data-grid]") as HTMLElement;
  const title = root.querySelector("[data-title]") as HTMLElement;
  const rangeEl = root.querySelector("[data-range]") as HTMLElement;
  const detail = root.querySelector("[data-detail]") as HTMLElement;
  const obsList = root.querySelector("[data-obslist]") as HTMLElement;
  const { months, weekdays, obs, today, t } = payload;
  const obsFor = (m: number, d: number) => obs.filter((o) => o.m === m && o.days.includes(d));
  const inUQ = (y: number) => y >= 1318 && y <= 1500;
  let cur = { y: today.h.y, m: today.h.m };

  const render = () => {
    const len = monthLen(cur.y, cur.m);
    const start = wdOf(hijriJDN(cur.y, cur.m, 1));
    title.textContent = `${months[cur.m - 1]} ${cur.y}`;
    const c1 = hijriToCivil({ y: cur.y, m: cur.m, d: 1 });
    const c2 = hijriToCivil({ y: cur.y, m: cur.m, d: len });
    rangeEl.textContent = `${fmtG(c1)} — ${fmtG(c2)} · ${inUQ(cur.y) ? t.umalqura : t.approx}`;
    const cells: string[] = weekdays.map((w) => `<span class="cal-wd ui">${w}</span>`);
    for (let k = 0; k < start; k++) cells.push(`<span class="cal-blank" aria-hidden="true"></span>`);
    for (let d = 1; d <= len; d++) {
      const oo = obsFor(cur.m, d);
      const isToday = d === today.h.d && cur.y === today.h.y && cur.m === today.h.m;
      const g = hijriToCivil({ y: cur.y, m: cur.m, d });
      cells.push(
        `<button type="button" class="cal-day${isToday ? " cal-today" : ""}${oo.length ? " cal-marked" : ""}" data-day="${d}" title="${oo.map((o) => o.label).join(" · ")}">` +
        `<span class="cal-h">${d}</span><span class="cal-g">${g.calendar === "gregorian" ? `${g.date.d}/${g.date.m}` : ""}</span></button>`,
      );
    }
    grid.innerHTML = cells.join("");
    const mo = obs.filter((o) => o.m === cur.m);
    obsList.innerHTML = mo.length
      ? mo.map((o) => `<${o.href ? `a class="chip" href="${o.href}"` : 'span class="chip"'}>${o.label} · ${o.days.length > 1 ? `${o.days[0]}–${o.days[o.days.length - 1]}` : o.days[0]}</${o.href ? "a" : "span"}>`).join("")
      : `<p class="ui muted">${t.obs_none}</p>`;
  };

  const step = (dm: number) => { cur.m += dm; while (cur.m > 12) { cur.m -= 12; cur.y++; } while (cur.m < 1) { cur.m += 12; cur.y--; } render(); };
  root.querySelector("[data-prev]")!.addEventListener("click", () => step(-1));
  root.querySelector("[data-next]")!.addEventListener("click", () => step(1));
  root.querySelector("[data-today]")!.addEventListener("click", () => { cur = { y: today.h.y, m: today.h.m }; render(); });
  root.querySelector("[data-jump]")!.addEventListener("click", () => {
    const y = parseInt((root.querySelector("[data-jy]") as HTMLInputElement).value, 10);
    const m = parseInt((root.querySelector("[data-jm]") as HTMLSelectElement).value, 10);
    if (y > 0 && y < 2200 && m >= 1 && m <= 12) { cur = { y, m }; render(); }
  });
  grid.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("[data-day]") as HTMLElement;
    if (!btn) return;
    const d = parseInt(btn.dataset.day!, 10);
    const c = hijriToCivil({ y: cur.y, m: cur.m, d });
    const oo = obsFor(cur.m, d);
    detail.textContent = `${d} ${months[cur.m - 1]} ${cur.y} = ${fmtG(c)}${oo.length ? " · " + oo.map((o) => o.label).join(" · ") : ""}`;
  });
  const convIn = root.querySelector("[data-conv]") as HTMLInputElement;
  const convert = (v: string) => {
    const out = root.querySelector("[data-convout]")!;
    if (!v) { out.textContent = ""; return; }
    const [y, m, d] = v.split("-").map(Number);
    const h = civilToHijri("gregorian", { y, m, d });
    out.textContent = `${h.date.d} ${months[h.date.m - 1]} ${h.date.y}`;
  };
  convIn.addEventListener("change", () => {
    convert(convIn.value);
    // The converted date rides in the address bar as ?d=YYYY-MM-DD, so a copied link reopens the same conversion.
    const u = new URL(location.href);
    if (convIn.value) u.searchParams.set("d", convIn.value); else u.searchParams.delete("d");
    history.replaceState(null, "", u);
  });
  // A shared link reopens the same conversion: a well-formed ?d= fills the input and converts. An absent
  // or malformed parameter leaves the page exactly as it was.
  const qd = new URLSearchParams(location.search).get("d") ?? "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(qd)) {
    const [y, m, d] = qd.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
      convIn.value = qd;
      try { convert(qd); } catch { convIn.value = ""; }
    }
  }
  root.querySelector("[data-ics]")!.addEventListener("click", () => {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//islam.museum//hijri-calendar//EN"];
    for (const o of obs) for (const d of o.days) {
      const len = monthLen(cur.y, o.m);
      if (d > len) continue;
      const c = hijriToCivil({ y: cur.y, m: o.m, d });
      if (c.calendar !== "gregorian") continue;
      const dt = `${c.date.y}${pad(c.date.m)}${pad(c.date.d)}`;
      lines.push("BEGIN:VEVENT", `UID:${cur.y}-${o.m}-${d}-${o.key}@islam.museum`, `DTSTART;VALUE=DATE:${dt}`, `DTEND;VALUE=DATE:${dt}`, `SUMMARY:${o.label} (${d} ${months[o.m - 1]} ${cur.y} AH)`, "END:VEVENT");
    }
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `islam-museum-hijri-${cur.y}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  render();
}
document.querySelectorAll("[data-cal]").forEach((r) => init(r as HTMLElement));
}
