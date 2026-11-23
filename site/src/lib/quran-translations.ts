// Verse translations that are not part of the frozen Qur'an records.
//
// The Arabic text and the two public-domain translations (Pickthall in English, Jalandhari in Urdu) live in the
// passage records, which are frozen. French and Spanish have no Sunni-accepted public-domain translation, so the
// museum shows two translations published by QuranEnc.com (Encyclopedia of the Noble Quran) under that site's own
// terms of re-publication: no modification, addition or deletion; name the publisher and the source; state the version
// number. They are third-party content, not CC0, and are kept apart in site/src/data/quran-translations/ — one file
// per translation, exactly as served by the QuranEnc.com API, with the terms inside the file.
//
// Only pages that show the credit, the source and the version call this module; the translations are not copied into
// the graph or the static API. To update: fetch the new version from the API named in the file, replace the file
// whole, and state the new version (docs/data/quran-translations.md).
import type { Lang } from "./i18n";
import french from "../data/quran-translations/french_rashid.json";
import spanish from "../data/quran-translations/spanish_garcia.json";
import turkish from "../data/quran-translations/turkish_rwwad.json";
import indonesian from "../data/quran-translations/indonesian_affairs.json";

interface Verse { t: string; f?: string }
interface Edition { key: string; language: string; translator: string; title: string; version: string; last_update: string; publisher: string; source: string; verses: Record<string, Verse> }
const EDITIONS: Partial<Record<Lang, Edition>> = { fr: french as unknown as Edition, es: spanish as unknown as Edition, tr: turkish as unknown as Edition, id: indonesian as unknown as Edition };

export interface QuranTranslation { text: string; footnotes?: string; translator: string; version: string; source: string; publisher: string }

/** The edition shown in this language, or undefined when the language has its translation in the records (en, ur) or none (ar). */
export const quranEdition = (lang: Lang): Edition | undefined => EDITIONS[lang];

/** The translation of one verse in this language, with what its terms ask to be shown beside it. */
export function quranTranslation(lang: Lang, sura: number, aya: number): QuranTranslation | undefined {
  const e = EDITIONS[lang];
  const v = e?.verses[`${sura}:${aya}`];
  if (!e || !v) return undefined;
  return { text: v.t, footnotes: v.f, translator: e.translator, version: e.version, source: e.source, publisher: e.publisher };
}
