// Shared by the two harvesters of the Elegy and Death-Announcement Browser
// (scripts/harvest-ritha-hadithapi.ts, scripts/harvest-ritha-ocr.ts; docs/plan/72-ritha-browser.md):
// the wording of labels and summaries per kind in the five languages, the umbrella record the
// harvested passages point at, and the helpers that read a work's own five-language title.
import { readFileSync } from "node:fs";
import YAML from "yaml";
import type { RithaKind } from "./ritha.js";

export const RITHA_ANCHOR_RECORD = "concept/ritha-wal-nay";
export const LANGS5 = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
export type L5 = Record<(typeof LANGS5)[number], string>;

/** What each kind says, for the label and the summary. */
export const KIND_SAYS: Record<RithaKind, L5> = {
  ritha: { ar: "رثاء وثناء على ميت", en: "an elegy or praise of the dead", ur: "مرثیہ یا میت کی تعریف", fr: "une élégie ou un éloge du défunt", es: "una elegía o elogio del difunto" },
  nay: { ar: "نعي وإخبار بوفاة", en: "a death announcement", ur: "وفات کی خبر", fr: "une annonce de décès", es: "un anuncio de fallecimiento" },
  taziya: { ar: "تعزية ومواساة وصبر عند المصيبة", en: "condolence, consolation and patience at a loss", ur: "تعزیت، تسلی اور مصیبت پر صبر", fr: "des condoléances, une consolation et la patience devant la perte", es: "condolencias, consuelo y paciencia ante la pérdida" },
  bukaa: { ar: "بكاء على ميت أو نياحة وحدودها", en: "weeping over the dead, or wailing and its limits", ur: "میت پر رونا، یا نوحہ اور اس کی حدود", fr: "des pleurs sur un défunt, ou la lamentation et ses limites", es: "llanto por un difunto, o el lamento y sus límites" },
};
export const BROWSER_NAME: L5 = {
  ar: "متصفح أشهر ما قيل في الرثاء والنعي",
  en: "The Elegy and Death-Announcement Browser",
  ur: "مرثیے اور وفات کی خبر کے مشہور اقوال کا براؤزر",
  fr: "Le navigateur des élégies et des annonces de décès",
  es: "El navegador de elegías y anuncios de fallecimiento",
};

/** A work's own title in the five languages, read from its record (every work record carries them). */
export function workTitles(workId: string): L5 {
  const d = YAML.parse(readFileSync(`data/${workId}.yaml`, "utf8"));
  const l = d.label ?? {};
  const en = l.en ?? l.ar;
  return { ar: l.ar ?? en, en, ur: l.ur ?? en, fr: l.fr ?? en, es: l.es ?? en };
}

export const q = (s: string) => JSON.stringify(s);
/** Arabic-script parentheticals are isolated (AGENTS.md, rule of 6 November 2026); stray brackets go. */
export const isolateParens = (s: string) =>
  s.replace(/[⁦⁩]/g, "").replace(/\(([^()]*)\)/g, (m, inner) => (/[؀-ۿ]/.test(inner) ? `⁦(${inner})⁩` : m)).replace(/[()](?![^⁦]*⁩)/g, (c, i, all) => (/⁦\($|\)⁩/.test(all.slice(Math.max(0, i - 1), i + 2)) ? c : c));
export const labelYaml = (l: L5) => `{ ${LANGS5.map((k) => `${k}: ${q(l[k])}`).join(", ")} }`;
