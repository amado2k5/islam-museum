// Offline pack (docs/delegation/education-master-plan.md §5 E3, step 5): a build-time endpoint that
// writes /{lang}/learn/teachers/offline/{unit}.html — one self-contained file a teacher can open from
// file:// with no internet: the pack overview, its kit checklist and the fact archive in one document.
// CSS is inlined, there is no script and no absolute http(s) URL except the SVG namespace, fonts are
// referenced not inlined (the file reads in the system font offline), and the file stays far under 2 MB.
import type { APIRoute } from "astro";
import { LANGS, ui, type Lang } from "../../../../../lib/i18n";
import { loadPacks, viewPack } from "../../../../../lib/packs";
import { loadFacts, factText, viewFact } from "../../../../../lib/facts";

export function getStaticPaths() {
  return LANGS.flatMap((lang) => loadPacks().map((p) => ({ params: { lang, slug: p.id }, props: { pack: p.id, lang } })));
}

const CSS = `
  body { font-family: system-ui, "Noto Sans Arabic", "Noto Naskh Arabic", sans-serif; max-width: 46rem; margin: 0 auto; padding: 1rem 1.2rem 3rem; line-height: 1.65; color: #1a1a1a; }
  h1 { font-size: 1.6rem; margin: 0.4rem 0 0.2rem; }
  h2 { font-size: 1.1rem; margin: 1.4rem 0 0.4rem; border-bottom: 1px solid #ccc; padding-bottom: 0.15rem; }
  .when { color: #555; font-size: 0.95rem; }
  ol.kit li, ol.facts li { margin-bottom: 0.35rem; }
  .sheets { color: #666; font-size: 0.85rem; }
  .foot { margin-top: 2rem; font-size: 0.8rem; color: #777; border-top: 1px solid #ccc; padding-top: 0.5rem; }
  @media print { body { max-width: none; } }
`;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = ({ props }) => {
  const { pack, lang } = props as { pack: string; lang: Lang };
  const E = ui(lang).edu;
  const p = viewPack(loadPacks().find((x) => x.id === pack)!, lang);
  const facts = loadFacts().map((f) => ({ text: factText(f, lang), rec: viewFact(f, lang) }));
  const html = `<!doctype html>
<html lang="${lang}" dir="${lang === "en" ? "ltr" : "rtl"}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(p.title)} — islam.museum</title><style>${CSS}</style></head>
<body>
<h1>${esc(p.title)}</h1>
<p class="when">${esc(p.when)}</p>
<p>${esc(p.lede)}</p>
<h2>${esc(E.pk_kit_title.replace("{n}", String(p.kit.reduce((a, k) => a + k.sheets, 0))))}</h2>
<ol class="kit">
${p.kit.map((k) => `  <li>${esc(k.title)} <span class="sheets">${esc(E.pk_sheets.replace("{n}", String(k.sheets)))}</span></li>`).join("\n")}
</ol>
<p>${esc(E.pk_note)}</p>
<h2>${esc(E.fc_all)}</h2>
<ol class="facts">
${facts.map((f) => `  <li>${esc(f.text)} — <em>${esc(f.rec.label)}</em></li>`).join("\n")}
</ol>
<p class="foot">islam.museum — ${esc(`/${lang}/learn/teachers/packs/${p.id}/`)} · ${esc(E.pk_offline_note)}</p>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
