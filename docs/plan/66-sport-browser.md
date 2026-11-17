# Sport Browser — Sports & Competitions in Islam (متصفح الرياضة والمنافسات)

Plan 66 · requested 16 Nov 2026 (founder, in chat: «متصفح الفروسية والسباحة والرماية وجميع رياضات ومنافسات المسلمون — a browser listing horsemanship, swimming, archery and all the sports and competitions of the Muslims, wherever they are mentioned or written in the Qur'an, seerah, Sunnah, Companion and Tabi'in stories and quotations, and every harvested book, present and future; a box on the landing page and in the navigation menus; end to end and production-ready») · lane `sport` · spec `docs/engineering/58-sport-browser-requirements.md`

## What it is

A browser over the one graph listing everything the museum's sources mention
about sport and contest (الرياضة والمنافسات) in Islam:

- **فروسية** — horsemanship and the equestrian arts (riding, horse and camel
  racing, mounted lance and archery play, the furusiyya manuals),
- **سباحة** — swimming,
- **رماية** — archery and shooting (رمي، نصل، قوس),
- **مصارعة وقوة** — wrestling and strength (Rukana's bout, stone-lifting,
  the strong exercises of the Canon),
- **سباق** — racing on foot (the Prophet's races with Aisha) and animal
  racing with its wager rules («لا سبق إلا في خف أو حافر أو نصل»),
- **لعب ومهارة** — the Abyssinian spear-play in the mosque, fencing and
  weapons play, polo, ball games, board games (labelled where contested),
- **صيد** — hunting and falconry as field sport (guarded: the fiqh hunting
  passages about eating game stay out),
- **modern** — modern Muslim sports and athletes (the `sports:` block on
  person records, football and the rest)

in the Qur'an, the Sunnah and hadith, the seerah, the reports of the
Companions and Tabi'in, quotations, and every harvested book — present and
future — plus the furusiyya tradition of the classical and Ottoman worlds
and the modern game.

## How it works

- `scripts/sport.ts` — a guarded Arabic lexicon in eight topical families:
  `khayl` (horses and riding, خيل فرس ركوب), `ramy` (archery, رمي نصل قوس
  سهم), `sibaha` (swimming, سباحة يسبح عوم), `sira` (wrestling and
  strength, مصارعة صارع صرعه), `sabq` (races and wagers, سبق سابق خف حافر
  محلل مزمل), `laib` (play, spear-play, ball games, لعب حراب كرة صولجان
  شطرنج نرد), `sayd` (hunting as field sport, صيد صائد جوارح — gated), and
  `riyada` (sport named as sport, رياضة رياضي).
- Gating: «سبق» the prize counts only beside race/stake vocabulary (the
  sabiq-forerunner sense stays out); «صيد» counts only beside
  sport/hunt/falconry vocabulary (the every-game-lawful-eating fiqh lines
  stay in — they are part of the topic — but «صيد» of trapping people or
  the Shaytan's snares is out); «لعب» counts only beside
  play/spectacle/diversion-in-the-listed-senses vocabulary; «رمي» counts
  only beside arrow/target vocabulary (رمي الجمرات and رمي بالكلام out);
  «يسبح» counts in the swimming sense only beside water/swim vocabulary
  (تسبيح glorification is a different form and excluded); verified false
  positives drop out by id. A book harvested later brings its sport
  mentions automatically.
- Corpus sections: `quran`, `sunnah`, `seerah`, `books`, `curated`, plus a
  `sports` curated shelf — the named sports. Topic chips per family.
- Signature view `sig/SportFields.astro`: the contest ground — one ruled
  strip per topic family, a disc per corpus sized by count, each disc a
  link; readable without JavaScript (`docs/site/signature-views.md` rules
  1–6, abstract geometry only).
- Curated records carry `sport-browser` (plus `sport-<section>` tags for
  `furusiyya`, `ramy`, `sibaha`, `musaraa`, `sabq`, `games`, `sayd`,
  `modern`).

## Records

- **New class `sport`** (`data/sport/<slug>.yaml`): the named sports and
  contests as first-class entities — label/summary trilingual, `kind`
  (mounted | target | water | combat | racing | ball-game | board-game |
  strength | hunt | modern-team | modern-individual), `era` list, sources,
  `status.review`, `provenance`. Class registered in `scripts/lib.ts`
  CLASSES, `schema/sport.schema.json`, `schema/predicates.yaml`
  domains/ranges, `site/src/lib/browse.ts`, `i18n class.sport`.
- Seed `sport/*` records (each cited): `furusiyya` (horsemanship), `ramy`
  (archery), `sibaha` (swimming), `musaraa` (wrestling), `sibaq-al-adyam`
  (foot-racing), `sibaq-al-khayl` (horse-racing), `sibaq-alibil` (camel
  racing), `laib-al-hirab` (spear-play), `fencing`/`mubaraza`,
  `suljan` (polo), `kura` (ball games), `ishalat-al-hajar`
  (stone-lifting), `sayd-bur` (hawking/hunting as sport), `shatranj`
  and `nard` (labelled contested), `football` (modern anchor).
- Existing records tagged `sport-browser` in place: `concept/al-rimaya`,
  `concept/al-musara-a`, `concept/sabq-in-islam`, `concept/nakhwa-chivalry`,
  `concept/named-exercises-of-the-canon`, `concept/rahan-fiqh`,
  `concept/nard`, `work/al-furusiyya`,
  `work/kitab-al-furusiyya-wal-manasib-al-harbiyya`,
  `object/sahn-furusiyya` — additive tags only, golden set untouched.
- New event records for the famous contests, each cited:
  `event/prophet-aisha-race-outbound`, `event/prophet-aisha-race-return`,
  `event/prophet-rukana-wrestling`, `event/habasha-spear-play-mosque`,
  `event/horse-race-musalla-al-ghaba` (the sabiq/al-mumarr race).
- `sports:` persons (e.g. `person/mohamed-salah`) surface through the
  `modern` shelf — read from the schema `sports` block, no side list.

## Ship list

- `scripts/sport.ts` detector; `site/src/lib/sport.ts`,
  `site/src/pages/[lang]/sport/[...page].astro`,
  `site/src/components/sig/SportFields.astro`,
  `site/src/scripts/sport-filter.ts`; trilingual `sport:` i18n blocks +
  `explore.pages.sport` + `class.sport`; Explore-menu entry and landing
  card.
- `/api/v1/sport.json` (section, `topics`, `signals`, work, ref, kind,
  edges); documented in `docs/data/README.md`,
  `site/public/openapi/v1.json` and `llms.txt`; register
  `docs/site/browsers.md`; lanes; status; CANARY.

## Next waves

- Ottoman archery guilds and the Tozkoparan/okmenzil tradition;
  furusiyya-manual mining (Ibn Qayyim's *al-Furusiyya*, the Mamluk
  manuals) once harvested; Mamluk/Cairene festival games; more modern
  athletes as the `sports:` census fills; human read promotes drafts.
