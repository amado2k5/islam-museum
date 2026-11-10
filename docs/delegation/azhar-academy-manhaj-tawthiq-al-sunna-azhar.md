# Azhar Academy harvest: منهج توثيق السنة النبوية الشريفة

Book slug: `manhaj-tawthiq-al-sunna-azhar`. Author: محمد إبراهيم الفيومي. Series: السلسلة العلمية لمجمع البحوث الإسلامية.

## What was read
- The whole OCR text, PDF pages 1 to 57 (pages 9 to 11 are blank in the OCR; the contents page is p56). Page markers are PDF pages.
- The claims table is outside git: `/Volumes/exmicroSD/islam-museum-harvest/claims/azhar-academy/manhaj-tawthiq-al-sunna-azhar.tsv` (50 rows).

## Entities
- Source (new): `source/manhaj-tawthiq-al-sunna-azhar`. Year 2017 is taken from the deposit number on the cataloguing card (p3), not a printed publication year. Pages: 56 (p3).
- New concepts (draft, `status.review: draft`): `concept/al-sunna-al-nabawiyya`, `concept/kitabat-al-hadith`, `concept/wad-al-hadith`, `concept/jarh-wa-tadil`.
  - `concept/wad-al-hadith` is the hadith-fabrication concept. It is not the same as `concept/wad` (infant burial), which is a different homonym.
- Existing entities extended (only the `sources` list changed; no prose or dates overwritten): `concept/isnad`, `concept/mustalah-al-hadith`, `concept/al-hadith-al-nabawi`, `person/ibn-al-salah`, `work/sahih-al-bukhari`, `work/sahih-muslim`.

## Doubts (also in the claims table)
- Bukhari's death date: this book gives 254 AH (p52); `work/sahih-al-bukhari` says 256 AH. Recorded as a debated second claim in the table, not written into the entity. A second source is needed.
- Abu Shah (sermon of the conquest): OCR reads "أبي اليمنى" (p30). Verify on the image.
- Bukhari's hadith count (7275 with repetitions) and the 100,000 / 200,000 statement come from OCR numerals (p54). Verify before use.
- The footnote numbers for the Tirmidhi hadith (p18) are garbled.
- Several quotations are secondhand (al-Isaba preface via al-Khatib; Ibn Kathir; Ibn al-Qayyim; Ibn Taymiyya via al-Muntaqa). Not checked against the primary works.
- The author's own reading (three sources, not four, p19) is labelled as his view.

## Not done
- No content prose (`content/ar`, `content/en`, `content/ur`) was written for the new concepts in this pass; the entities carry `summary.ar` only. A translation pass is needed under the 18 October 2026 rule.
- No event entities were created; the book's history of arbitration and fitna is recorded as a claim on `concept/wad-al-hadith`.
- `docs/coverage.md`, `docs/status.md` and `docs/agents/lanes.md` are not edited (maintainer regenerates).
