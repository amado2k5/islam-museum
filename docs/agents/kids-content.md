# Kids' content rulebook (جناح الصغار)

Applies to every agent, model, and human who writes, edits, or reviews content for the Kids' Wing. The rules that never bend are in [`AGENTS.md`](../../AGENTS.md); this document adapts them for young readers (ages 4–12). Read [`content-standards.md`](content-standards.md) first.

## 1. Reading levels by age band

| Band | AR name | Reading model | Story length | Interaction |
|------|---------|---------------|--------------|-------------|
| 4–6 | براعم (Buds) | **Audio-first.** Assume the child cannot read; Hudhud reads everything aloud. | One idea per screen, 1–2 short sentences. | Tap-only choices (big icons). **No failure states, no scores, no timers.** A tap is never wrong. |
| 7–9 | مستكشفون (Explorers) | Short sentences a new reader can follow; every screen readable in under a minute. | 2–3 sentences per stop. | One choice per screen; gentle quiz with warm feedback on **every** answer (see Prophet Quest: Hudhud's response never ranks answers as right/wrong). |
| 10–12 | روّاة (Storytellers) | Longer stories, richer vocabulary, still no jargon without a gloss. | Full paragraphs; retelling tasks ("tell this story back in your own words"). | Creation tools (draw, map, journal); **bridge to the main museum**: each kids' route ends with links to the full entity pages for deeper reading. |

## 2. Banned patterns

The following never appear in kids' content, whatever the age band:

1. **Fear-based language.** Hellfire as a threat ("if you don't…"), graphic descriptions of punishment, or suffering used as a warning. The goal is love of learning, not fear of failing.
2. **Graphic battle/death detail.** Battles, deaths, and disasters are told at the story's edge: "they crossed safely," never what happened to the defeated. No gore, no cruelty, no lingering on violence.
3. **Moral shaming of the child.** No "shame on you," no "naughty children," no Hudhud dialogue that punishes a choice. The scared choice on the Musa stop is met with "It's okay to feel scared" — never "don't be a coward."
4. **Promises the museum can't keep.** No "God will always…" guarantees tied to a child's action; no reward promises, no outcome promises. Describe the value (patience, courage), don't sell a result.

## 3. Sunni framing

The Kids' Wing shares the main museum's frame: **Sunni Islam is the default frame**, research starts from Sunni sources. No `perspectives` blocks for children — contested topics simply **do not enter kids' routes** (they stay in the main museum for the 10–12 bridge, or out entirely). Prophet stories stay within widely-transmitted narratives (Qur'an + mutawatir-ish Sunna as the main museum records them); do not add miraculous details the main museum would flag as weak, and do not moralize beyond the story.

## 4. Age-gating

Some topics stay out of kids' routes entirely:

- Word maps with negative valence (e.g. «عذابًا»), eschatological detail (signs of the Hour, descriptions of the Afterlife), and legal rulings (fiqh) — nothing prescriptive enters the wing.
- Complex historical conflicts (fitan, wars) — told only as simplified peace-side stories, if at all.

**Implementation:** gating is opt-in, not opt-out. A piece of main-museum content appears in kids' routes only when explicitly marked for it:

- Word-map JSON: `"kids": true` on a word-map file opts that map into the Kids' Wing. Default (absent or `false`) = excluded.
- Lists, explainers, and stories follow the same flag convention in their YAML; quest stops and wing-native content live under `kids/` and are kids-only by location.
- Never "sanitize down" adult content for kids; build kids' routes from the flagged subset and from wing-original material.

## 5. Provenance and review

- Every kids' file carries `status: { review: draft }` plus the `provenance` block (`generated_by`, `model`, `run`, `note`), per AGENTS.md. Nothing leaves `draft` without **scholar review** by a reviewer qualified in children's Islamic content; the reviewer's name and date go in the provenance when cleared.
- **No typed honorifics — ever.** Not ﷺ, not «عليه السلام», not «رضي الله عنه», not "(peace be upon him)". Prophet names are written plain (آدم، نوح، إبراهيم، موسى، عيسى / Adam, Noah, Abraham, Moses, Jesus). The UI renders honorifics programmatically via `kidsHonorify` in `site/src/lib/kids.ts`; authors never type them.
- **Qur'an text is never typed, completed, or corrected.** Quest stories are original prose in the author's own words — retellings, not quotations. No ﴿ ﴾ characters. Any verse a route needs comes only from the frozen Tanzil corpus, linked as a passage reference.
- **No figurative depictions of prophets.** Illustration lanes for the wing use abstract or symbolic art (stars, ark, sea, light) — never a person.

## 6. Voice guide: do / don't

| # | ✅ Do | ❌ Don't |
|---|-------|---------|
| 1 | «آدم هو أول إنسان خلقه الله.» / "Adam was the first human God created." | «عليه السلام أولُ الأنبياء وأبو البشرية» (typed honorific) / "Adam (peace be upon him), the father of mankind" (typed honorific) |
| 2 | «دعا نوح قومه إلى الخير تسعمائة وخمسين سنة ولم يملّ أبدًا.» / "Noah called his people to goodness for nine hundred and fifty years, and he never gave up." | «عاند قومُ نوح فأغرقهم الله جميعًا» (graphic outcome as warning) / "Noah's people refused, so God drowned them all" (graphic outcome as warning) |
| 3 | «لا بأس أن تشعر بالخوف — موسى شعر به أيضًا.» / "It's okay to feel scared — Moses felt it too." | «لا تكن جبانًا، كن شجاعًا مثل موسى» (shaming the child) / "Don't be a coward — be brave like Moses" (shaming the child) |
| 4 | «الصبر قوة عظيمة.» / "Patience is a great strength." | «من صبر نجا ومن جزع هلك» (promise the museum can't keep) / "Whoever is patient will always succeed" (promise the museum can't keep) |
| 5 | «نظر إبراهيم إلى النجوم والقمر والشمس، فعلم أن الخالق أعظم منها جميعًا.» / "Abraham looked at the stars, the moon, and the sun, and knew the Creator was greater than them all." (our own retelling) | «﴿فلما جن عليه الليل رأى كوكبًا﴾» (typed Qur'an text) / "«When the night covered him, he saw a star»" (typed Qur'an text) |
| 6 | «اختيار جميل!» / "Lovely choice!" (Hudhud celebrates every answer) | «إجابة خاطئة، حاول مرة أخرى» (failure state) / "Wrong answer, try again" (failure state) |

Hudhud (هدهد), the wing's hoopoe guide, speaks in the first row's voice: warm, curious, never lecturing, never grading. When in doubt, ask: *would this sentence make a seven-year-old feel braver and more curious?*

## 7. Phase 2/3 additions (recorded 2026-10-16)

1. **Retellings, not copies.** When the same prophet appears in more than one wing format (quest stop vs. bedtime story), each telling must be fresh prose — never a copied sentence. The test suite enforces this: a story body fails if it shares a 12+ word verbatim substring with the quest version.
2. **Audio is progressive enhancement.** Bedtime-story pages check at build time whether `site/public/audio/kids/<slug>-<lang>.mp3` exists; the `<audio>` player renders only when the file is present. No placeholders, no broken players. Narration MP3s may land later without any page change.
3. **Sprouts mode (4–6) is stateless.** No localStorage, no scores, no persistence for the youngest band — every tap is a celebration and nothing can go wrong. State (stars, stickers) begins at the Explorers band.
4. **Printables ship with print CSS.** Tracker-style experiences (Kindness Quest) include a print-only chart (fridge chart) and hide all interactive chrome in print. The print button calls `window.print()`; the chart is fully server-rendered so it prints with JS disabled.

## 8. Phase 4/5 additions (recorded 2026-10-17)

1. **Retell prompts never name the prophet.** Guiding prompts in `kids/retell.yaml` address the child ("What part would you tell first?"), never the prophet by name — this sidesteps the honorific question entirely; the story context identifies the prophet.
2. **The journal is private by design.** Entries live only in the child's browser localStorage (`kids-journal`, capped at 500 entries). There is no sync, no export, no backend — say so plainly on the page. The erase-all control is two-step confirm.
3. **Bridge cards are the only doors out.** Besides the back-to-museum button, bridge cards are the sole links leaving kids mode. They must resolve to real built routes (`/{lang}/cards/{story|explain|word}/{slug}/`), verified against the cards corpus at build time; style them distinctly as "grown-up museum" doors with the door note.
4. **Teacher content is adult-voiced.** Lesson plans, paths, and the pilot guide are written for educators (professional, practical: timings, materials, classroom-mode notes) — not simplified for children. Worksheets are the only child-facing teacher-kit surface.
5. **Lesson titles come from i18n, not YAML.** `kids/lessons.yaml` carries no titles; lesson pages resolve `<unit_slug>_title` from the `kids:` i18n section (garden_title, quest_title, …). Adding a unit slug without a matching i18n key breaks the build.
6. **Classroom mode is a URL param, not a setting.** `?classroom=1` adds a `classroom` class to `<html>` (via `site/src/scripts/classroom.ts`, loaded in BaseLayout's kids branch): type scales ~130%, touch targets grow, erase controls hide (the teacher manages the screen). On the quest page it also reveals a "vote together" banner above the choices — a facilitation cue, never vote counting (no backend, ever).
7. **Pilot contact stays a TODO.** The pilot guide's contact section renders an obvious `TODO:` placeholder in both languages. Never invent an email, form URL, or phone number; the test suite rejects `@` in the contact note.
