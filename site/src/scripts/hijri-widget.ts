// "Find your Hijri date" (Part 3, B.5): converts a Gregorian date with the museum's converter and looks the day up in the
// embedded "this day" index of the same page. Runs only in the browser, on submit; nothing is sent anywhere.
import { civilToHijri } from "../../../scripts/hijri/convert";

const form = document.querySelector<HTMLFormElement>("[data-hijri-widget]");
const out = document.getElementById("hresult");
const todayEl = document.querySelector<HTMLElement>("[data-today] script[type='application/json']");
if (form && out) {
  const payload = (() => { try { return JSON.parse(todayEl?.textContent || "{}"); } catch { return {}; } })();
  const lang = document.documentElement.lang;
  const T = payload.t ?? {};
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (form.querySelector("input[name=d]") as HTMLInputElement).value;
    if (!v) { out.hidden = true; return; }
    try {
      const [y, m, d] = v.split("-").map(Number);
      const h = civilToHijri("gregorian", { y, m, d }).date;
      const gTxt = `${d} ${payload.gm?.[m - 1] ?? m} ${y}${lang === "ar" ? " م" : ""}`;
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
  });
}
