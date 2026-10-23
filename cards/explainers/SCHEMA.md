# Explainer data schema — cards/explainers/<slug>.yaml
# Step-by-step Q&A cards + special widgets (proposal engine #3).
#
# widget: stepper (default) | decision-tree | timeline | compare
#
# stepper: steps[].q / steps[].a (+ optional evidence, cautions)
# decision-tree: tree of {q, options: [{label, next}], result} — see sujud-al-sahw.yaml
# timeline: stations[] — see alamat-al-saa.yaml
# compare: columns[] — see al-madhahib.yaml
#
# Content rules (proposal §8): bodies in own words; hadith cited by source name
# with verify notes; «لم يثبت» cautions where the card has them; no honorifics;
# no hand-transcribed Quran text.

slug: salat-al-duha
title: { ar: "صلاة الضحى", en: "Duha prayer" }
lede: { ar: "...", en: "..." }
source_card: 2fc1002d
status: { review: draft }
widget: stepper
steps:
  - q: { ar: "ما هي صلاة الضحى؟", en: "What is Duha prayer?" }
    a: { ar: "...", en: "..." }
    evidence: [{ source: "رواه مسلم", note: "مراجعة اللفظ" }]
cautions:
  - { ar: "...", en: "..." }   # «لم يثبت» style cautions
