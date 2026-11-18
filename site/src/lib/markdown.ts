// Prose renderer: marked + wiki-links [[class/slug|text]], {cite:source p.N}, :::perspectives blocks.
import { Marked } from "marked";
import { byId, href, labelOf, realNodes, NEEDS_SOURCE } from "./graph";
import type { Lang } from "./i18n";

export interface Cite { n: number; source: string; locator?: string }
export interface Rendered { html: string; cites: Cite[]; perspectives: { tradition: string; html: string }[] }

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escTitle = (s: string) => esc(s).replace(/'/g, "&#39;");
// Prose has no raw-HTML construct (scripts/validate.ts rejects it), and marked does not sanitize
// link targets: escape every raw HTML token so it renders as text, and render the link or image
// text only when the target uses a script scheme.
const BAD_SCHEME = /^\s*(javascript|data|vbscript)\s*:/i;
const cleanHref = (h: string | null): string | null => {
  if (h == null || BAD_SCHEME.test(h)) return null;
  try {
    return encodeURI(h).replace(/^%([a-fA-F0-9]{2})$/, "%");
  } catch {
    return null;
  }
};
const markedSafe = new Marked({
  renderer: {
    html: ({ text }) => esc(text),
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const clean = cleanHref(href);
      if (clean === null) return text;
      let out = '<a href="' + clean + '"';
      if (title) out += ` title="${escTitle(title)}"`;
      return out + ">" + text + "</a>";
    },
    image({ href, title, text, tokens }) {
      const alt = tokens ? this.parser.parseInline(tokens, this.parser.textRenderer) : text;
      const clean = cleanHref(href);
      if (clean === null) return esc(alt);
      let out = `<img src="${clean}" alt="${alt}"`;
      if (title) out += ` title="${escTitle(title)}"`;
      return out + ">";
    },
  },
});

// Honorifics, one place so the policy stays uniform and reversible. The Prophet gets ﷺ after the first mention, and each
// Companion gets the Sunni formula after the first mention, per article (see newHonState). Headings and tables are left alone.
// Arabic uses رضي الله عنه/عنها, Urdu its own spelling رضی اللہ عنہ/عنہا; English uses the gloss "(may God be pleased with
// him/her)" so the prose reads naturally.
const HON_PATTERNS: Record<Lang, RegExp> = {
  ar: /(?<![\u0621-\u064A])(رسول الله|النبي)(?![\u0621-\u064A])/g,
  en: /(?<![A-Za-z])(the Messenger of God|Prophet Muhammad|the Prophet)(?![A-Za-z])/g,
  ur: /(?<![\u0621-\u06D3])(رسول اللہ|نبی کریم)(?![\u0621-\u06D3])/g,
  fr: /(?<![A-Za-zÀ-ÿ])(le Messager de Dieu|le Prophète Muhammad|le Prophète|l'Envoyé de Dieu)(?![A-Za-zÀ-ÿ])/g,
};
// ﷺ belongs to Muhammad alone: "النبي صموئيل", "the Prophet Daniel" (a person, shrine or village) name another prophet, and
// "النبي الوحيد" speaks of a prophet in general, so neither gets the mark.
const OTHER_PROPHETS: Record<Lang, string[]> = {
  ar: [
    "آدم", "إدريس", "أخنوخ", "نوح", "هود", "صالح", "إبراهيم", "لوط", "إسماعيل", "إسحاق", "يعقوب", "يوسف", "أيوب", "شعيب",
    "موسى", "هارون", "ذا الكفل", "ذي الكفل", "ذو الكفل", "داود", "سليمان", "إلياس", "الياس", "اليسع", "أليشع", "اليشع",
    "يونس", "يونان", "زكريا", "زكرياء", "يحيى", "عيسى", "المسيح", "صموئيل", "شموئيل", "شمويل", "سمويل", "دانيال", "يوشع",
    "شيث", "حزقيال", "حزقيل", "إرميا", "أرميا", "إشعيا", "إشعياء", "أشعيا", "أشعياء", "جرجيس", "عزير", "الخضر", "إيليا",
    "شمعون", "هوشع", "حبقوق", "ناحوم", "عاموس", "ميخا", "ملاخي", "يوئيل", "عوبديا", "صفنيا", "حجي", "لقمان",
    "جادور", "خالد بن سنان",
  ],
  en: [
    "Adam", "Idris", "Enoch", "Nuh", "Noah", "Hud", "Salih", "Saleh", "Ibrahim", "Abraham", "Lut", "Lot", "Ismail", "Isma'il",
    "Ismaʿil", "Ismāʿīl", "Ishmael", "Ishaq", "Isaac", "Yaqub", "Ya'qub", "Yaʿqub", "Jacob", "Yusuf", "Joseph", "Ayyub", "Job",
    "Shu'ayb", "Shuʿayb", "Shuayb", "Jethro", "Musa", "Moses", "Harun", "Aaron", "Dhu al-Kifl", "Dhul-Kifl", "Dhu'l-Kifl",
    "Dawud", "Dawood", "David", "Sulayman", "Solomon", "Ilyas", "Elias", "Elijah", "al-Yasa", "Al-Yasa", "Elisha", "Yunus",
    "Jonah", "Jonas", "Zakariyya", "Zakariya", "Zechariah", "Zachariah", "Yahya", "John", "Isa", "'Isa", "ʿIsa", "ʿĪsā",
    "Jesus", "Samuel", "Samwil", "Shamwil", "Daniel", "Danyal", "Yusha", "Yusha'", "Joshua", "Shith", "Seth", "Hizqil",
    "Ezekiel", "Jeremiah", "Irmiya", "Isaiah", "Jarjis", "George", "Uzayr", "Ezra", "Khidr", "al-Khidr", "Khadir", "Hosea",
    "Amos", "Micah", "Habakkuk", "Nahum", "Malachi", "Joel", "Obadiah", "Zephaniah", "Haggai", "Luqman", "Lukman",
    "Jadur", "Khalid ibn Sinan",
  ],
  ur: [
    "آدم", "ادریس", "نوح", "ہود", "صالح", "ابراہیم", "لوط", "اسماعیل", "اسحاق", "یعقوب", "یوسف", "ایوب", "شعیب", "موسیٰ",
    "موسی", "ہارون", "ذوالکفل", "ذو الکفل", "داؤد", "داود", "سلیمان", "الیاس", "الیسع", "یونس", "زکریا", "یحییٰ", "یحیی",
    "عیسیٰ", "عیسی", "مسیح", "سموئیل", "شموئیل", "دانیال", "یوشع", "شیث", "حزقیل", "حزقی ایل", "یرمیاہ", "ارمیا", "عزیر",
    "خضر", "جرجیس", "لقمان",
  ],
};
// Every prophet in the graph other than Muhammad joins the list in each language, so a new prophet's record is covered as soon as it lands.
for (const n of realNodes) {
  if (n.class !== "person" || n.id === "person/muhammad") continue;
  if (!(n.data?.story_roles ?? []).some((r: { role?: string }) => r?.role === "prophet-figure")) continue;
  for (const l of Object.keys(OTHER_PROPHETS) as Lang[]) {
    const label = n.label?.[l];
    if (typeof label !== "string") continue;
    for (const part of label.replace(/[\u2066-\u2069]/g, "").split(/[()]/)) {
      const name = part.trim();
      if (name && !OTHER_PROPHETS[l].includes(name)) OTHER_PROPHETS[l].push(name);
    }
  }
}
const NAME_END: Record<Lang, string> = { ar: "(?![\u0621-\u064A])", en: "(?![A-Za-z])", ur: "(?![\u0621-\u06D3])" };
const reEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const OTHER_AFTER = Object.fromEntries(
  (Object.keys(OTHER_PROPHETS) as Lang[]).map((l) => {
    const names = OTHER_PROPHETS[l].map(reEsc).join("|");
    const generic = l === "ar" ? "|الوحيد" + NAME_END.ar : "";
    return [l, names ? new RegExp(`^\\s*(?:(?:${names})${NAME_END[l]}${generic})`, "u") : /(?!)/];
  }),
) as Record<Lang, RegExp>;
const OTHER_BEFORE = Object.fromEntries(
  (Object.keys(OTHER_PROPHETS) as Lang[]).map((l) => {
    // "صالح" before the title is mostly the verb ("صالح النبي أهل أيلة": he made peace), and "Ibn Ishaq, the Prophet" names a historian
    const names = OTHER_PROPHETS[l].filter((x) => x !== "صالح").map(reEsc).join("|");
    return [l, names ? new RegExp(`(?:^|[^\\p{L}])(?<!(?:ibn|Ibn|bin|Abu|abu|Umm|ابن|بن|أبو|أبي|أبا|ابو|ابی|أم|ام)\\s+)(?:${names})\\s*[،,]?\\s*$`, "u") : /(?!)/];
  }),
) as Record<Lang, RegExp>;
/** True when a match of the Prophet pattern is not Muhammad: another prophet is named right after it ("النبي صموئيل") or
 *  right before it ("يحيى بن زكريا، النبي"), or "the only prophet"; on another prophet's own page, a mention that opens a
 *  paragraph or follows a comma is that prophet ("النبي المبتلى بالصبر" on Ayyub's page). */
export function notMuhammad(lang: Lang, before: string, after: string, otherProphet = false): boolean {
  if (OTHER_AFTER[lang].test(after)) return true;
  if (OTHER_BEFORE[lang].test(before) && !/^(?:['’]|&#39;)s(?![A-Za-z])/.test(after)) return true; // "Ibrahim, the Prophet's son" is Muhammad's
  return otherProphet && (before.trim() === "" || /[،,]\s*$/.test(before));
}
const COMPANION_SUFFIX: Record<Lang, { m: string; f: string }> = {
  ar: { m: "رضي الله عنه", f: "رضي الله عنها" },
  ur: { m: "رضی اللہ عنہ", f: "رضی اللہ عنہا" },
  en: { m: "(may God be pleased with him)", f: "(may God be pleased with her)" },
  fr: { m: "(que Dieu soit satisfait de lui)", f: "(que Dieu soit satisfait d'elle)" },
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
export interface HonState { prophet: boolean; companions: Set<string>; otherProphet?: boolean }
/** `subject` is the page's entity: on the page of a prophet other than Muhammad, "النبي" may be that prophet. */
export const newHonState = (subject?: { id: string; data?: { story_roles?: { role?: string }[] } }): HonState => ({
  prophet: false,
  companions: new Set(),
  otherProphet: !!subject && subject.id !== "person/muhammad" && (subject.data?.story_roles ?? []).some((r) => r?.role === "prophet-figure"),
});

export function honorify(html: string, lang: Lang, state: HonState = newHonState()): string {
  const prophet = HON_PATTERNS[lang];
  const companions = companionsFor(lang);
  // Marks go only in plain body text: a name inside a link label is left alone, so the link text stays clean.
  const body = (text: string, prev: string, rest: string) => {
    let t = text.replace(prophet, (x: string, _name: string, at: number) => {
      if (state.prophet) return x;
      if (notMuhammad(lang, prev + text.slice(0, at), text.slice(at + x.length) + rest, state.otherProphet)) return x;
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
      if (idx % 2 === 1) return part.replace(NEEDS_SOURCE, "");
      return part.replace(/(^|>)([^<]+)(?=<|$)/g, (m: string, lead: string, text: string, offset: number) => {
        const inLink = part.lastIndexOf("<a ", offset) > part.lastIndexOf("</a>", offset);
        // the words around this text node (a linked name, say) decide whether "النبي" here names another prophet
        const prev = part.slice(Math.max(0, offset - 400), offset + lead.length).replace(/^[^<]*>/, "").replace(/<[^>]*>/g, "");
        const rest = part.slice(offset + m.length, offset + m.length + 400).replace(/<[^>]*>/g, "");
        return lead + (inLink ? text : body(text, prev, rest));
      });
    })
    .join("");
}

export function renderProse(md: string, lang: Lang, hon?: HonState): Rendered {
  const cites: Cite[] = [];

  // Applied to text nodes of already-rendered HTML (raw HTML in the source is escaped by markedSafe's renderer).
  const transform = (html: string) =>
    html.replace(/(^|>)([^<]+)(?=<|$)/g, (_m, lead: string, text: string) =>
      lead +
      text
        .replace(NEEDS_SOURCE, "")
        .replace(/\[\[([a-z]+\/[a-z0-9-]+)(?:\|([^\]]*))?\]\]/g, (_x, id: string, custom?: string) => {
          const n = byId.get(id);
          if (!n) return custom ?? id;
          return `<a href="${href(lang, n.id)}"${n.stub ? ' class="stub-link"' : ""}>${custom ?? esc(labelOf(n, lang))}</a>`;
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
      if (m) perspectives.push({ tradition: m[1].replace(NEEDS_SOURCE, "").trim(), html: transform(markedSafe.parseInline(m[2], { async: false }) as string) });
    }
    return "";
  });

  const html = honorify(transform(markedSafe.parse(md.replace(/<!--[\s\S]*?-->/g, ""), { async: false }) as string), lang, hon);
  return { html, cites, perspectives };
}
