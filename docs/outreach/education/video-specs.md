# Video trailer specs — education programme (E5 step 5)

Spec documents only — no production has been commissioned or budgeted. Seventeen
trailers: one per age band (5) and one per curriculum pathway (12 — the proposal
counted ten; the two extra cover the pathways added since). Shared rules, then
one spec each.

## Shared rules (every trailer)

- **No people.** Screen recordings of the site, maps, object records,
  illustrations and typography only. No faces, no hands on camera, no stock
  footage of people — the museum's no-figurative-depiction rule applies.
- **Static assets only.** Shots are captures of the live site (ar/en shown; ur
  cut for the Urdu trailer variant), the museum's own inline-SVG motifs, and
  whitelisted object imagery. No third-party footage licences needed.
- **Runtime 45–60 s.** Voice-over optional; on-screen text must carry the whole
  message silently (most placements autoplay muted).
- **Ending card (last 4 s):** the museum wordmark, the route's QR code (the
  `Qr.astro` component already renders one), the URL in text, and the line
  "Free — no sign-up, no data collected."
- **Trilingual releases:** the same edit ships with ar, en and ur end-cards and
  captions; narration (if used) recorded per language, never machine-dubbed.

## Band trailers (5)

### T-B1 Sprouts (ages 4–6) — `/sighar/sprouts/`
- **Shots:** the Sprouts hub with Hudhud; tapping a word in the Sprouts Garden
  as the audio reads it; the five-stop Prophet Quest star filling; a bedtime
  story card page.
- **On-screen text:** "A museum wing made for the smallest visitors. Everything
  is read aloud. Everything is safe."
- **QR end:** `https://islam.museum/en/sighar/sprouts/`

### T-B2 Explorers (ages 7–9) — `/sighar/explorers/`
- **Shots:** the Explorers hub; the world map opening a place; the Kindness
  Quest chart; the passport page collecting stamps.
- **On-screen text:** "Real history, kid-sized. Collect stamps as you explore
  the whole museum."
- **QR end:** `https://islam.museum/en/sighar/explorers/`

### T-B3 Storytellers (ages 10–12) — `/sighar/storytellers/`
- **Shots:** a story-in-12-cards auto-playing (the Samarkand Observatory);
  the retell page; the Little Studio coin designer exporting a PNG.
- **On-screen text:** "Twenty stories told in twelve cards each — and a studio
  to make your own."
- **QR end:** `https://islam.museum/en/sighar/storytellers/`

### T-B4 Scholars (ages 13–15) — `/shabab/scholars/`
- **Shots:** the Scholars hub; a leveled reading record switching levels; the
  detective game presenting a chronicle; a dilemma page with two cited voices.
- **On-screen text:** "Sources, debates, detective work — history with the
  evidence left in."
- **QR end:** `https://islam.museum/en/shabab/scholars/`

### T-B5 Researchers (ages 16+) — `/shabab/researchers/`
- **Shots:** the Researchers hub; the sixty-second pathway texts; a homework
  search returning cited records; the citation block on an entity page.
- **On-screen text:** "Citable, sourced, honest about what's contested. Built
  for real assignments."
- **QR end:** `https://islam.museum/en/shabab/researchers/`

## Pathway trailers (12)

Each pathway trailer follows one template: (1) the pathway title card with its
grade and subject line, (2) a scroll through the pathway's stops/sections,
(3) the worksheet and answer-key pages flipping to print, (4) the QR end-card
to the pathway URL. The hook line below is the opening on-screen text.

### T-P1 `pathway-g4-social-studies-four-cities` — grade 4, four cities
- **Hook:** "Four cities, one civilization — a first journey through the museum's places."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g4-social-studies-four-cities/`

### T-P2 `pathway-g6-social-studies-hajj-network` — grade 6, the Hajj network
- **Hook:** "Follow the routes pilgrims walked — geography through the Hajj."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g6-social-studies-hajj-network/`

### T-P3 `pathway-g11-chw3m-rise-of-islam` — grade 11, the rise of Islam
- **Hook:** "The seventh century, told with sources — not summaries."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g11-chw3m-rise-of-islam/`

### T-P4 `pathway-g11-chw3m-baghdad-and-the-silk-roads` — grade 11, Baghdad and the Silk Roads
- **Hook:** "Paper, books and trade: how Baghdad became the world's library."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g11-chw3m-baghdad-and-the-silk-roads/`

### T-P5 `pathway-g11-chw3m-crusades-muslim-side` — grade 11, the Crusades from the Muslim side
- **Hook:** "The Crusades, from the chronicles that lived through them."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g11-chw3m-crusades-muslim-side/`

### T-P6 `pathway-g11-chw3m-mongols-and-after` — grade 11, the Mongols and after
- **Hook:** "After the fall of Baghdad: how a civilization rebuilt itself."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g11-chw3m-mongols-and-after/`

### T-P7 `pathway-g11-chw3m-al-andalus` — grade 11, al-Andalus
- **Hook:** "Seven centuries of al-Andalus — cities, sciences and the people who kept them."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g11-chw3m-al-andalus/`

### T-P8 `pathway-g11-hrt3m-life-of-the-prophet` — grade 11, life of the Prophet
- **Hook:** "The Sira, mapped and dated — the life of the Prophet with its evidence."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g11-hrt3m-life-of-the-prophet/`

### T-P9 `pathway-g11-hrt3m-quran-as-a-text` — grade 11, the Qur'an as a text
- **Hook:** "How a recitation became a book — the history of the Qur'an as a text."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g11-hrt3m-quran-as-a-text/`

### T-P10 `pathway-g11-hrt3m-islamic-art-architecture` — grade 11, Islamic art and architecture
- **Hook:** "Geometry, calligraphy, stone — reading Islamic art like a text."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g11-hrt3m-islamic-art-architecture/`

### T-P11 `pathway-g11-hrf3o-five-pillars-daily-life` — grade 11, the five pillars in daily life
- **Hook:** "The five pillars, lived — a course in everyday practice."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g11-hrf3o-five-pillars-daily-life/`

### T-P12 `pathway-g12-chy4u-ottomans-gunpowder-empires` — grade 12, the Ottomans and gunpowder empires
- **Hook:** "Three empires, one age — the Ottomans among the gunpowder powers."
- **QR end:** `https://islam.museum/en/learn/teachers/pathways/g12-chy4u-ottomans-gunpowder-empires/`
