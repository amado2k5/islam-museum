// Prose renderer: marked + wiki-links [[class/slug|text]], {cite:source p.N}, :::perspectives blocks.
import { marked } from "marked";
import { byId, href, labelOf, realNodes } from "./graph";
import type { Lang } from "./i18n";

export interface Cite { n: number; source: string; locator?: string }
export interface Rendered { html: string; cites: Cite[]; perspectives: { tradition: string; html: string }[] }

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Honorifics, one place so the policy stays uniform and reversible. The Prophet gets ﷺ after the first mention, and each
// Companion gets the Sunni formula after the first mention, per article (see newHonState). Headings and tables are left alone.
// Arabic uses رضي الله عنه/عنها, Urdu its own spelling رضی اللہ عنہ/عنہا; English uses the gloss "(may God be pleased with
// him/her)" so the prose reads naturally.
const HON_PATTERNS: Record<Lang, RegExp> = {
  ar: /(?<![\u0621-\u064A])(رسول الله|النبي)(?![\u0621-\u064A])/g,
  en: /(?<![A-Za-z])(the Messenger of God|Prophet Muhammad|the Prophet)(?![A-Za-z])/g,
  ur: /(?<![\u0621-\u06D3])(رسول اللہ|نبی کریم)(?![\u0621-\u06D3])/g,
};
const COMPANION_SUFFIX: Record<Lang, { m: string; f: string }> = {
  ar: { m: "رضي الله عنه", f: "رضي الله عنها" },
  ur: { m: "رضی اللہ عنہ", f: "رضی اللہ عنہا" },
  en: { m: "(may God be pleased with him)", f: "(may God be pleased with her)" },
};
const companionCache = new Map<Lang, { name: string; suffix: string }[]>();
function companionsFor(lang: Lang) {
  let list = companionCache.get(lang);
  if (!list) {
    list = realNodes
      .filter((n) => n.class === "person" && (n.data.roles ?? []).includes("companion"))
      .map((n) => {
        const female = n.data.gender === "female";
        const name = lang === "en" ? n.label?.en : labelOf(n, lang);
        const suffix = female ? COMPANION_SUFFIX[lang].f : COMPANION_SUFFIX[lang].m;
        return { name: name ?? "", suffix };
      })
      .filter((c) => c.name)
      .sort((a, b) => b.name.length - a.name.length);
    companionCache.set(lang, list);
  }
  return list;
}

/** Per-article state: the first mention of each name gets its honorific once across all sections of the article. */
export interface HonState { prophet: boolean; companions: Set<string> }
export const newHonState = (): HonState => ({ prophet: false, companions: new Set() });

export function honorify(html: string, lang: Lang, state: HonState = newHonState()): string {
  const prophet = HON_PATTERNS[lang];
  const companions = companionsFor(lang);
  // Marks go only in plain body text: a name inside a link label is left alone, so the link text stays clean.
  const body = (text: string) => {
    let t = text.replace(prophet, (x) => {
      if (state.prophet) return x;
      state.prophet = true;
      return `${x} <span lang="ar">ﷺ</span>`;
    });
    for (const c of companions) {
      if (state.companions.has(c.name)) continue;
      const i = t.indexOf(c.name);
      if (i < 0) continue;
      state.companions.add(c.name);
      t = t.slice(0, i + c.name.length) + ` ${c.suffix}` + t.slice(i + c.name.length);
    }
    return t;
  };
  return html
    .split(/(<h[1-6][\s\S]*?<\/h[1-6]>|<table[\s\S]*?<\/table>)/)
    .map((part, idx) => {
      if (idx % 2 === 1) return part;
      return part.replace(/(^|>)([^<]+)(?=<|$)/g, (_m, lead: string, text: string, offset: number) => {
        const inLink = part.lastIndexOf("<a ", offset) > part.lastIndexOf("</a>", offset);
        return lead + (inLink ? text : body(text));
      });
    })
    .join("");
}

export function renderProse(md: string, lang: Lang, hon?: HonState): Rendered {
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

  const html = honorify(transform(marked.parse(md.replace(/<!--[\s\S]*?-->/g, ""), { async: false }) as string), lang, hon);
  return { html, cites, perspectives };
}
