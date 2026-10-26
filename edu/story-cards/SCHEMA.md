# Story in 12 cards — edu/story-cards/<slug>.yaml (E5)

One story = exactly 12 cards. Each card: one idea (title), one illustration
motif (inline SVG; the whitelist is `MOTIFS` in `site/src/lib/story-cards.ts` —
no external media, no people), one narration line (~15–25 words).

Trilingual (ar/en/ur) at every text field. `status.review: published` with a
`provenance` block naming the generator and the source tradition the cards were
restated from. No typed honorifics, no Qur'an text, no inline citations in the
cards (the provenance carries the sources).

```yaml
slug: the-hijra-route
title: { ar: "...", en: "...", ur: "..." }
lede: { ar: "...", en: "...", ur: "..." }
status: { review: published }
provenance: { generated_by: "Devin", model: "Devin (Cognition)", run: "education-E5-story-cards", source: "..." }
cards:
  - title: { ar: "...", en: "...", ur: "..." }
    motif: mosque          # one of: moon mountain cave camel caravan sea star mosque city book manuscript pen map compass coin tree
    narration: { ar: "...", en: "...", ur: "..." }
  # ... exactly 12
```

Routes: `/{lang}/sighar/storytellers/stories/` (index) and
`/{lang}/sighar/storytellers/stories/<slug>/` (player, 2.8 s auto-play that
stops on any pointer or key; the full list renders without JS).
