# Verse translations of the Qur'an

What a visitor sees beside a verse, by language, and where it comes from. Checked on 20 November 2026; Turkish and Indonesian checked 22 November 2026.

| Language | Translation | Where it is stored | Licence |
|---|---|---|---|
| Arabic | the text itself, Tanzil Project v1.1 | `data/passage/quran-*.yaml`, field `text` (frozen) | Tanzil's terms for the text |
| English | Marmaduke Pickthall | same records, `translations.en` | public domain |
| Urdu | Fateh Muhammad Jalandhari | same records, `translations.ur` | public domain |
| French | Rachid Maach, QuranEnc.com version 1.0.3 | `site/src/data/quran-translations/french_rashid.json` | QuranEnc.com terms |
| Spanish | Muhammad Isa García, QuranEnc.com version 1.0.2 | `site/src/data/quran-translations/spanish_garcia.json` | QuranEnc.com terms |
| Turkish | Rowwad Translation Center team, QuranEnc.com version 1.0.4 | `site/src/data/quran-translations/turkish_rwwad.json` | QuranEnc.com terms |
| Indonesian | Ministry of Religious Affairs (Kemenag), QuranEnc.com version 1.0.1 | `site/src/data/quran-translations/indonesian_affairs.json` | QuranEnc.com terms |

## Why these translations are stored apart

Decision of the founder, 20 November 2026 (in chat); Turkish and Indonesian added 22 November 2026 on the same basis.
No French, Spanish, Turkish or Indonesian translation accepted among Sunni
institutions is in the public domain; the one public-domain French text (Kazimirski, 1869) is an orientalist work
with a different verse numbering. QuranEnc.com (Encyclopedia of the Noble Quran) allows its translations to be
downloaded and re-published under seven conditions, read on the translation pages on 20 November 2026:

1. No modification, addition, or deletion of the content.
2. Clearly referring to the publisher and the source (QuranEnc.com).
3. Mentioning the version number when re-publishing the translation.
4. Keeping the transcript information inside the document.
5. Notifying the source (QuranEnc.com) of any note on the translation.
6. Updating the translation according to the latest version issued from the source (QuranEnc.com).
7. Inappropriate advertisements must not be included when displaying translations of the meanings of the Noble Quran.

"No modification" cannot live under CC0, so these two translations are **third-party content, not CC0 and not public
domain**. They are therefore kept out of `data/` (CC0), out of the frozen Qur'an records, out of the graph and out of
the static API. The four files carry the terms, the version, the source address and the retrieval date inside them.

## What the site does with them

- `site/src/lib/quran-translations.ts` reads the four files. Only two places call it, and both show the translator,
  the publisher, the version and a link to QuranEnc.com: the verse page (`site/src/components/Extras.astro`) and the
  sura reader (`site/src/pages/[lang]/words/quran/[n].astro`).
- The text is shown exactly as served: verse text with its footnote marks, and the footnotes under it. Nothing is
  shortened, corrected or reworded. The Spanish text begins each verse with its number, as the source does.
- The other browsers that quote a verse (angels, nature, miracles and the rest) still read the records and so show
  the English translation to French and Spanish readers. They show no translator credit, which is why the QuranEnc
  translations are not used there.
- No advertisement appears on the site.

## Updating (condition 6)

1. Read the current version: `https://quranenc.com/api/v1/translations/list/fr`, `.../list/es`, `.../list/tr` and `.../list/id` (field `version`).
2. If it is newer than the file's `version`, fetch all 114 suras from
   `https://quranenc.com/api/v1/translation/sura/<key>/<n>` and rebuild the file whole: same shape, `t` for the
   translation and `f` for the footnotes, nothing changed.
3. Update the version in `data/source/quranenc-translations.yaml`, in this page and in `CANARY.md`.
4. `scripts/quran-translations.test.ts` checks that each file has the 6,236 verses of the frozen records.

A remark on a translation goes to QuranEnc.com (condition 5), not into the file.
