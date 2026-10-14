// Prose renderer: marked + wiki-links [[class/slug|text]], {cite:source p.N}, :::perspectives blocks.
import { marked } from "marked";
import { byId, href, labelOf, realNodes } from "./graph";
import type { Lang } from "./i18n";

export interface Cite { n: number; source: string; locator?: string }
export interface Rendered { html: string; cites: Cite[]; perspectives: { tradition: string; html: string }[] }

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Honorifics (ﷺ after the first mention of the Prophet, رضي الله عنه/عنها after the first mention of each Companion),
// applied once per article body in Arabic only. English body text stays plain for readability (owner decision, see docs).
// Headings and tables are left alone. One place, so the policy stays uniform and reversible.
const PROPHET = /(?<![\u0621-\u064A])(رسول الله|النبي)(?![\u0621-\u064A])/g;
const COMPANIONS = realNodes
  .filter((n) => n.class === "person" && (n.data.roles ?? []).includes("companion"))
  .map((n) => ({ name: labelOf(n, "ar"), suffix: n.data.gender === "female" ? "رضي الله عنها" : "رضي الله عنه" }))
  .filter((c) => c.name)
  .sort((a, b) => b.name.length - a.name.length);

export function honorify(html: string, lang: Lang): string {
  if (lang !== "ar") return html;
  let prophetDone = false;
  const doneCompanions = new Set<string>();
  const body = (text: string) => {
    let t = text.replace(PROPHET, (x) => {
      if (prophetDone) return x;
      prophetDone = true;
      return `${x} ﷺ`;
    });
    for (const c of COMPANIONS) {
      if (doneCompanions.has(c.name)) continue;
      const i = t.indexOf(c.name);
      if (i < 0) continue;
      doneCompanions.add(c.name);
      t = t.slice(0, i + c.name.length) + ` ${c.suffix}` + t.slice(i + c.name.length);
    }
    return t;
  };
  return html
    .split(/(<h[1-6][\s\S]*?<\/h[1-6]>|<table[\s\S]*?<\/table>)/)
    .map((part, idx) => (idx % 2 === 1 ? part : part.replace(/(^|>)([^<]+)(?=<|$)/g, (_m, lead: string, text: string) => lead + body(text))))
    .join("");
}

export function renderProse(md: string, lang: Lang): Rendered {
  const cites: Cite[] = [];

  // Applied to text nodes of already-rendered HTML (marked has escaped everything else).
  const transform = (html: string) =>
    html.replace(/(^|>)([^<]+)(?=<|$)/g, (_m, lead: string, text: string) =>
      lead +
      text
        .replace(/\[\[([a-z]+\/[a-z0-9-]+)(?:\|([^\]]*))?\]\]/g, (_x, id: string, custom?: string) => {
          const n = byId.get(id);
          if (!n) return custom ?? id;
          return `<a href="${href(lang, id)}"${n.stub ? ' class="stub-link"' : ""}>${custom ?? esc(labelOf(n, lang))}</a>`;
        })
        .replace(/\{cite:([a-z0-9-]+)(?:\s+([^}]*))?\}/g, (_x, source: string, locator?: string) => {
          let c = cites.find((k) => k.source === `source/${source}` && k.locator === locator);
          if (!c) { c = { n: cites.length + 1, source: `source/${source}`, locator }; cites.push(c); }
          return `<sup class="cite"><a href="#note-${c.n}" id="cite-${c.n}-${cites.length}">${c.n}</a></sup>`;
        }),
    );

  const perspectives: Rendered["perspectives"] = [];
  md = md.replace(/^:::perspectives\n([\s\S]*?)\n:::\s*$/gm, (_m, body: string) => {
    for (const line of body.split("\n")) {
      const m = line.match(/^- \*\*(.+?)\*\*:\s*(.+)$/);
      if (m) perspectives.push({ tradition: m[1], html: transform(marked.parseInline(m[2], { async: false }) as string) });
    }
    return "";
  });

  const html = honorify(transform(marked.parse(md.replace(/<!--[\s\S]*?-->/g, ""), { async: false }) as string), lang);
  return { html, cites, perspectives };
}
