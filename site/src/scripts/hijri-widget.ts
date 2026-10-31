// "Find your Hijri date" (Part 3, B.5): converts a Gregorian date with the museum's converter and looks the day up in the
// embedded "this day" index of the same page. Runs only in the browser, on submit; nothing is sent anywhere.
// The chosen date also rides in the address bar as ?d=YYYY-MM-DD (the input's own field name), on the homepage embed
// and on the canonical Time Machine page (/[lang]/time-machine/) alike, so a copied link reopens the same result.
// An absent or malformed parameter leaves the page exactly as it was: no lookup runs and nothing is shown.
import { civilToHijri } from "../../../scripts/hijri/convert";

const form = document.querySelector<HTMLFormElement>("[data-hijri-widget]");
const out = document.getElementById("hresult");
const todayEl = document.querySelector<HTMLElement>("[data-today] script[type='application/json']");
if (form && out) {
  const payload = (() => { try { return JSON.parse(todayEl?.textContent || "{}"); } catch { return {}; } })();
  const lang = document.documentElement.lang;
  const T = payload.t ?? {};
  const input = form.querySelector<HTMLInputElement>("input[name=d]");
  const run = (v: string) => {
    try {
      const [y, m, d] = v.split("-").map(Number);
      const h = civilToHijri("gregorian", { y, m, d }).date;
      const gTxt = `${d} ${payload.gm?.[m - 1] ?? m} ${y}${lang === "en" ? "" : ` ${T.ce ?? ""}`}`;
      const hTxt = `${h.d} ${payload.hm?.[h.m - 1] ?? h.m} ${h.y} ${T.ah ?? "AH"}`;
      const hits: any[] = [...(payload.h ?? []).filter((x: any) => x.m === h.m && x.d === h.d), ...(payload.g ?? []).filter((x: any) => x.m === m && x.d === d)];
      const corr = form.dataset.corresponds ?? "→";
      const none = form.dataset.none ?? "";
      const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
      out.innerHTML = `<strong>${esc(gTxt)}</strong> ${esc(corr)} <strong>${esc(hTxt)}</strong>` + (hits.length ? `<ul class="today-list">${hits.map((x) => `<li><a href="${esc(x.href)}">${esc(x.label)}</a> <span class="muted">— ${esc(x.date)}</span></li>`).join("")}</ul>` : ` — ${esc(none)}`);
      out.hidden = false;
    } catch {
      out.textContent = form.dataset.fail ?? "";
      out.hidden = false;
    }
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input?.value ?? "";
    if (!v) { out.hidden = true; return; }
    run(v);
    const u = new URL(location.href);
    u.searchParams.set("d", v);
    history.replaceState(null, "", u);
  });
  // A shared link reopens the same result: a well-formed ?d= fills the input and runs the same lookup.
  const q = new URLSearchParams(location.search).get("d") ?? "";
  if (input && /^\d{4}-\d{2}-\d{2}$/.test(q)) {
    const [y, m, d] = q.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) { input.value = q; run(q); }
  }
}
