# Animals and insects in islam.museum: coverage report (29 Oct 2026)

Requested by the founder: does the museum cover animals and insects in Islam, and can the Time Browser cover cats, dogs, horses, camels, ants, spiders and pigeons, with related hadith, Companions, scholars and caliphs?

## 1. What exists (survey of `data/` and `content/`)

| Area | Records | Notes |
|---|---|---|
| General ruling on animals | `concept/hayawan-animal` | Fiqh: food, slaughter, zakat, care. Cited to Fiqh Mawsu'a (Kuwaiti). |
| Insects | `concept/insects-hasharat` | Fiqh ruling on eating insects (locust exception). Cited. |
| Dogs | `concept/kalb-fiqh` | Lexical and legal definition of the dog. Cited. |
| Camels | `concept/hiqqa-camel`, `concept/mabarik-al-ibil-fiqh`, `concept/hady-fiqh` (ritual camels) | Fiqh and object. |
| Horses | `concept/tadmir-training-horses`, `concept/khayl`, `concept/khalq-al-khayl`, `object/qasa-luster-faras`, `object/lawh-ruus-khayl`, `concept/horse-colours-in-timurid-painting`, `object/horse-colours-in-timurid-painting` | Fiqh, objects, painting. |
| Birds | `work/tayr-mantiq` (Conference of the Birds), `object/inna-tayr`, `object/sahn-tayran`, `work/tawq-al-hamama` (Ibn Hazm, the dove's necklace) | Literature and objects; no pigeon story from a hadith or sira. |
| Animal books | `work/nat-al-hayawan` (Jahiz), `work/hayat-al-hayawan` (Damiri) | Works; no event records. |
| Events with an animal | `event/ghar-thawr` (camels offered as bounty), `event/hijra-journey-to-medina` (Suraqa's horse sinks), `event/the-prophets-she-camel-strays` (630), `event/battle-of-the-camel` (656), `event/yawm-al-ghar-389` (camel slaughtered on Ghadir morning, 999) | Cited, dated. |

Not found as records: cats (no entity), ants (only the Quran's ant of Surah al-Naml, not a record), spiders (only the Quran's spider of Surah al-Ankabut, not a record), pigeons as a hadith or sira subject (the cave of Thawr pigeon and spider story is not recorded). Dogs have one fiqh record and no event. Companions linked to animals are not recorded as a group.

## 2. What was added (PR on branch `claude/kind-lumiere-9fa12c`)

- **Time Browser story:** `scripts/explorer-subjects/concept-hayawan-animal.json` (kind `era`, curated `events`). Subject "Hayawan (animal)" with 5 cited, dated nodes, 630 to 999 CE: Thawr (622), Hijra road with Suraqa's horse (622), she-camel strays (630), Battle of the Camel (656), Day of the Cave in Baghdad (999). Built and checked: `npm run graph` and `tsx scripts/time-browser-explorer.ts` show 73 subjects, 710 nodes.
- **Data fixes to existing records (no new entities):**
  - `data/event/battle-of-the-camel.yaml`: added an EDTF date `0656-11` (derived from AH 36, Jumada II), so the event is dated; added `provenance.source` so it passes the publication standard.
  - `data/event/ghar-thawr.yaml`: added a `provenance` block (generated_by Devin, the existing author) so the event passes the publication standard. Prose unchanged.
- **Coverage:** `docs/coverage.md` regenerated.

No image backdrops were generated. Stories ship without images per the pipeline (§2); the local SDXL queue runs on the founder's Mac.

## 3. Gaps and what would close them

1. **Cats, ants, spiders, pigeons, dogs as stories.** Need dated events with sources. The hadith and sira sources that would settle these (Sahih al-Bukhari on the cave, the sira narratives on the Thawr spider and pigeons, the hadith on the cat and dogs, Ibn Kathir on the Companions' animals) are registered in `data/source/` but their scans sit on the founder's drive. Each event needs its page reference read from the scan before it is written. Until then no citation is invented.
2. **Horse story.** Only two dated horse events exist, below the 4-node minimum.
3. **Companions, scholars and caliphs linked to animals** (for example Abu Bakr in the cave, Umar and the camel's milk, Ali at the Battle of the Camel): the person records exist, but the animal link is not written in them. Adding a `participated_in` relation to an existing event is the cheapest way to surface them in a story.
4. **Topic kind.** The Time Browser has no kind for topics. The umbrella story uses `era` so it shows in the existing eras group. A new `topic` kind needs a builder change and a new index group with i18n strings in ar, en and ur.

## 4. Validation status

- `npm run validate`: 0 errors from this change. **Three errors come from main**, not from this change: `content/{ar,en,ur}/place/tarabulus-al-gharb.md` has no data file (`data/place/tarabulus-al-gharb.yaml`). The record is `place/tarabulus-gharb`; the stray prose is from the Tripoli story (commit 19716017d3, alias tarabulus-al-gharb). Not fixed here: it belongs to that story's owner.
- `npx vitest run scripts/time-browser*`: 73 of 73 pass.
- `npm test`: see the final message for the full run.
