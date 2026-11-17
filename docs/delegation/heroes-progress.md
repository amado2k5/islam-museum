# Heroes of Islam explorer — progress

Lane ad-hoc under approved proposal `docs/plan/71-heroes-explorer.md` (17 November 2026, non-impacting).

## Done in v1 (this session)

- Six virtue trails: `data/exhibit/hero-{sacrifice,courage,mercy,generosity,knowledge,steadfastness}.yaml`, `kind: trail`, four hero rooms each, trilingual.
- Flagship narratives `content/{ar,en,ur}/exhibit/hero-*.md` (18 files), docent voice, `{cite:}` to defined sources.
- "Heroic stand" sections appended to five thin hero records in ar/en/ur: fatima-al-fihri, sumayya-bint-khayyat, salah-al-din-yusuf-ibn-ayyub, abd-al-qadir-al-jazairi, rabia-al-adawiyya.
- Explorer: `site/src/lib/heroes.ts`, `site/src/pages/[lang]/heroes/index.astro`, `components/{VirtueMedallion,HeroCard}.astro`, i18n `heroes:` + `explore.pages.heroes`, nav `heroes` key (people group), landing card automatic.
- Registration: `docs/plan/71`, plan index, `docs/site/browsers.md`, `docs/site/signature-views.md`, `docs/status.md`, `CANARY.md`, `/api/v1/heroes.json` (+ openapi, llms.txt, data README), check-weight budget, check-site assertions.

## Next steps

- More heroes per hall (a new `hero-*` trail or new rooms) once their person prose reaches standard.
- Founder may want a `heroes` lane row in `docs/agents/lanes.md` if the roster is to grow by packets.
- Optional: illustration-lane non-figurative backdrops per hall (place/attribute still-lifes only) once the illustrations pipeline covers exhibits.
