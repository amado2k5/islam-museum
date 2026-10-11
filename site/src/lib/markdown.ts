// Prose renderer: marked + wiki-links [[class/slug|text]], {cite:source p.N}, :::perspectives blocks.
import { marked } from "marked";
import { byId, href, labelOf } from "./graph";
import type { Lang } from "./i18n";

export interface Cite { n: number; source: string; locator?: string }
export interface Rendered { html: string; cites: Cite[]; perspectives: { tradition: string; html: string }[] }

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

  const html = transform(marked.parse(md.replace(/<!--[\s\S]*?-->/g, ""), { async: false }) as string);
  return { html, cites, perspectives };
}
