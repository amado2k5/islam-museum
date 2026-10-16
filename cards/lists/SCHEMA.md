# Lists data schema — cards/lists/<slug>.yaml
# Flip-card decks for numbered material (proposal engine #2).
#
# Content rules (proposal §8):
# - Bodies are editorial summaries in our own words; no quoted hadith wording
#   unless verified. Sources cited by name/number; unverified items carry
#   verify: notes and the deck ships as draft until cleared.
# - No typed honorifics. No hand-transcribed Quran text (refs are surah:ayah only).
# - source_card links the catalog entry this deck was built from.

slug: mafatih-al-faraj            # unique, url-safe
title: { ar: "مفاتيح الفرج", en: "Keys to relief" }
lede: { ar: "...", en: "..." }    # one-line deck description
source_card: 9a150716              # flashcard-catalog id
status: { review: draft }         # draft until verification queue clears
quiz: true
items:
  - title: { ar: "التقوى", en: "Taqwa" }
    body: { ar: "...", en: "..." }  # 1-2 lines, own words
    ref: "الطلاق 2"                 # optional: surah ayah / hadith source name
    verify: "..."                   # optional: what needs checking
