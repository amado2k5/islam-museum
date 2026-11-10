# 24 — "Follow the thread" redesign (renovation proposal)

> **DO NOT IMPLEMENT — PROPOSAL ONLY.** This document is a design proposal awaiting the founder's phase-by-phase approval. No agent may implement anything described here without an explicit written approval from the founder naming the phase. See `docs/ai-change-gates.md` §1.

Status: **proposal — approved phases TBD**. Inputs: founder's design-review megaplan, his dark-mode/accessibility/audience requirements, a competitor benchmark (Met, Rijksmuseum, Smithsonian Searchable Museum, Google Arts & Culture, Wikipedia), and an identity document setting **"Follow the thread"** as the museum's central promise with an **"illuminated atlas"** art direction.

Gate: `docs/ai-change-gates.md` §1 — nothing lands without an approved written proposal; homepage, header, palette and trust-signal changes are submission-impacting (UNESCO/DPGA evidence updates ride in the same commit).

A living skeleton prototype exists (single self-contained HTML, `prototype/follow-the-thread.html` in the session workspace — not committed): Hijra journey stations, thread cards, reading view, saved trail, light/dark, plus entity/place/gallery concept pages.

## Identity

- **Central promise: "Follow the thread"** — every discovery opens another part of the story; each connection carries a readable, sourced explanation (not a glowing-node graph).
- **"An illuminated atlas"**: atlas precision + manuscript intimacy + contemporary-exhibition atmosphere. Layers stay distinguishable: authentic evidence / explanatory diagrams / atmospheric illustration.
- **Evidence-led**: uncertainty is shown, not hidden; "Show me how we know" is a differentiator.
- **House illustration style**: fine ink lines, flat mineral colors, subtle grain, selective detail; a small style guide (line weight, perspective, labeling, how reconstructions are marked); regions keep their own character.
- **Cartoon/character art** per audience only (Hudhud inside the children's experience; teens get graphic essays/cutaways; adults get editorial illustration). Sacred narratives: atmosphere via landscape/architecture/objects/calligraphy — depiction policy confirmed before any character scenes.
- **Audio**: opt-in only; transcripts/captions; no universal soundtrack.

### Palette (proposal — must be AA-validated before adoption)

| Role | Light | Dark |
|---|---|---|
| Canvas | Warm parchment `#F6F1E7` | Deep ink `#0D191D` |
| Text | Ink `#172B30` | Warm ivory `#EEE8DC` |
| Primary accent | Deep teal `#17666A` | Pale turquoise `#7DC9C2` |
| Decorative accent | Muted brass `#A7803E` | Soft brass `#D0AE70` |
| Secondary accent | Terracotta `#A34F3D` | Soft clay `#DB927E` |

Brass sparingly; authentic images carry the color. Dark = "quiet evening exhibition"; light = "daylight across paper".

## Cross-cutting requirements (gate every phase)

- Deliberate dark theme (palette above); audit every component/map/canvas/focus ring in both themes.
- WCAG 2.2 AA: contrast, ≥44px targets, full keyboard, visible focus, accessible dialogs, no info by color alone.
- `prefers-reduced-motion` honored; pause on auto-advancing content; audio opt-in + transcripts.
- Every interactive ships a no-JS structured reading equivalent.
- **Detail × reading level = two axes**: Brief/Standard/Deep (`DepthDial`) stays "how much detail"; reading level only where adapted content exists (sighar/sprouts/shabab/learn). No age disclosure — modes self-selected.
- Trust signals: separate *coverage completeness* from *historical confidence* at point of reading.
- i18n: ar + en + ur in the same commit; no tracking/uppercase on Arabic/Urdu.
- Harvested-record prerequisites for future thread experiences: source + exact passage, original language + identified translation, date ranges + location precision, relationship type + evidence, image rights + "depicts actual item" flag, review status + known disagreements.
- Per-PR verification: `npm run validate`, `npm test`, light+dark × ar/en/ur screenshots, ≤390px overflow, keyboard walk, reduced-motion check.

## Phase A — First prototype: the "Follow the thread" experience

One complete experience end-to-end before scaling — subject: **the Hijra journey** (richest verifiable material; doubles as the new homepage hero). Seven-point acceptance spec:

1. Arresting opening visual (illuminated-atlas treatment).
2. One immediate interaction (select station → route draws → passage).
3. Three meaningful, sourced connections (guide / place / continue-the-story).
4. Readable alternative to the visual experience.
5. Saved personal trail (localStorage; revisitable points).
6. Satisfying ending with a clear next discovery.
7. Equally finished light, dark, mobile, keyboard, reduced-motion presentations.

Homepage work rides along: the prototype IS the hero, plus curiosity entrances ("I have three minutes", "Take me somewhere", "Show me something beautiful", "How was this made?"), page reorder (hero → resume → 3 curated discoveries → map/timeline preview → pathways → nine wings → today/new → support/shop), header consolidation, flattened nested panels, image-led wing featured cards.

## Phase B — 20 authentic objects

- 20 real photographs/scans (manuscript page, astrolabe, coin, building viewpoints) with institution, date/attribution, rights, annotations; zoom inspector + static reading fallback.
- Licence gate: `schema/enums/licenses.yaml` whitelist only; candidate open-access sources: Met OA, Smithsonian OA, Walters, BnF — **founder approval needed on acceptable institutions.**
- These become the "desk" objects of the thread experience (Who made it? / What knowledge? / Where did it travel? / What was it used for?).

## Phase C — Two more flagships + connection stories

- Flagships #2/#3 in the same seven-point mould — candidates: Abyssinia migrations, Islamic astronomy (pairs with the astrolabe), Ottoman architecture (pairs with building photos). Picks TBD.
- Authored connection-stories beside the graph explorer (Smithsonian pattern): one object five connections; one city three centuries; how an idea travelled.
- Next-discovery block on entity pages: 3 curated links, each with a one-line "why".

## Phase D — Personal trail, collection, shareable tours

- "My trail" (saved journey) → personal collection gallery (extends shelf).
- Visitor-curated tours: private on-device first; later explicitly-published shareable link w/ preview.
- Resume strip site-wide; stable per-chapter/object-detail URLs + OG cards.
- "A new connection in your collection": surface newly-added relevant material to returning visitors (device-side matching).

## Phase E — Editorial programme + creative shareable

- Curated daily pick + weekly exhibition (`data/` YAML, founder-editable, consistent format/rhythm).
- **"Make the pattern"**: step-by-step geometric construction → real historical examples; saveable/shareable result.
- Named-contributor visibility.

## Phase F — Reliability & comprehension

- Search: verify reported "temporarily unavailable"; test ar/en/ur + variants + transliterations.
- Article UX: concise opening answer, in-place term explanation, contents on long pages, chapter anchors.
- Confidence-vs-completeness signal redesign.
- Mobile continuity (reading position, journey progress); teen-facing selection audit.
- Future thread-experiences gated on data readiness: "Enter a year", "Who could have met?", "Through different accounts", "Journey of an idea", "Life of an object", "Read a building", "Still alive today" — each only when its harvested-record prerequisites exist.

## Phase G — Audience modes & comfort

- Self-selected modes (Discover 5–8 / Explore 9–12 / Investigate teens / Full) routing to existing sighar/sprouts/shabab/learn; family activities opt-in; comfort controls (text size, spacing) in prefs popover.

## Deferred

Time-maps of cities, broader 3D, advanced personalization, commissioned illustration programme beyond the Phase-A style-guide seed.

## Open questions for the founder

1. Flagships #2/#3 picks (Abyssinia / astronomy / Ottoman, or others).
2. Approved image-source institutions for Phase B.
3. Whether the illuminated-atlas palette becomes the new token set (after AA validation).
4. Curated-picks authorship: founder-edited YAML vs. agent-drafted seed list.
5. Prototype subject confirmation (Hijra assumed).
