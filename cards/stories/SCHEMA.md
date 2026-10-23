# Stories data schema — cards/stories/<slug>.yaml
# Station-based Quranic stories (proposal engine #4).
# Structure extracted from the catalog cards: intro → numbered stations
# (each anchored to its verse ref) → quick facts → lessons → cautions → خلاصة.
#
# Content rules: bodies in own words; refs are "surah ayah" labels only
# (verse text via Tanzil at render time if needed); traditional details
# flagged; «لم يثبت» cautions preserved as house voice; no honorifics.

slug: ashab-al-kahf
title: { ar: "أصحاب الكهف", en: "The People of the Cave" }
lede: { ar: "...", en: "..." }
source_card: fb19a4c4
status: { review: draft }
intro: { ar: "...", en: "..." }
stations:
  - title: { ar: "فتية مؤمنون", en: "Believing youths" }
    ref: "الكهف 13"
    body: { ar: "...", en: "..." }
facts:
  - { ar: "...", en: "..." }
lessons:
  - { ar: "...", en: "..." }
cautions:
  - ar: "لم يثبت في القرآن اسم المدينة ولا موضع الكهف ولا أسماء الفتية."
    en: "The Quran does not establish the city's name, the cave's location, or the youths' names."
khulasa: { ar: "...", en: "..." }
