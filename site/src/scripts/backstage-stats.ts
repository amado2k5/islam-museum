// Backstage: fills the entry/page counts from the same sources the rest of the site reads —
// /api/v1/meta/counts.json (entities) and /api/v1/meta/deploy.json (pages, stamped at deploy
// time). The HTML already carries build-derived fallbacks, so nothing breaks without JS.
const NUM: Record<string, string> = { ar: "ar-EG-u-nu-latn", en: "en-GB", ur: "ur-PK-u-nu-latn" };
const locale = NUM[document.documentElement.lang] ?? "en-GB";
const fmt = (n: number) => new Intl.NumberFormat(locale).format(n);

const ents = document.querySelectorAll<HTMLElement>("[data-bs-entities]");
if (ents.length) {
  fetch("/api/v1/meta/counts.json").then((r) => (r.ok ? r.json() : null)).then((c: { entities?: number } | null) => {
    if (typeof c?.entities === "number") ents.forEach((e) => { e.textContent = fmt(c.entities!); });
  }).catch(() => {});
}

const pgs = document.querySelectorAll<HTMLElement>("[data-bs-pages]");
if (pgs.length) {
  fetch("/api/v1/meta/deploy.json").then((r) => (r.ok ? r.json() : null)).then((d: { pages?: number } | null) => {
    if (typeof d?.pages === "number") pgs.forEach((e) => { e.textContent = fmt(d.pages!); });
  }).catch(() => {});
}
