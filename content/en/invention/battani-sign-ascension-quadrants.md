---
id: invention/battani-sign-ascension-quadrants
lang: en
source_lang: ar
translators: ["Devin drafter w2-07"]
status: { review: draft }
provenance:
  generated_by: devin-drafter-w2-07
  model: SWE-2
  run: inventions-w2-07-drafting
  source: "English prose drafted directly from Nallino's Latin edition of al-Battani's Zij chapter LV and preface, and the TDV biography; translation equivalents of the Arabic claims verified against the same sources."
---
## Summary
Al-Battani's method for sign ascensions between the sphere's quadrants is chapter LV of his Zij together with a dedicated treatise, now lost, that medieval catalogues list under the title Kitab ma'rifat matali' al-buruj fi ma bayna arba' al-falak {cite:nallino-albatenii-opus-astronomicum p. 28}. Right ascensions at the meridian and oblique ascensions at the horizon were already known; what the chapter adds is a complete scheme for the spaces between those four cusps, by a proportional rule between the two known values {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}. The quantities serve the rising times of the zodiacal signs and the astrological directions that Ptolemy raised in the Tetrabiblos {cite:nallino-albatenii-opus-astronomicum t. I p. 135}.

## What it is
It is a computational method in spherical astronomy: a table-driven scheme for finding how many equinoctial hours a sign takes to rise or set at any point of the celestial sphere, at any latitude. The method works on the ecliptic divided into its twelve signs and thirty degrees each; for any degree or star, with or without latitude, it interpolates between the right ascension known from the right sphere and the oblique ascension known from the climate tables {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}. The output is a quantity in temporal hours, the unit in which rising and setting are measured on the celestial sphere.

## The world before it
Before al-Battani, astronomers possessed two families of ascensional values. In the right sphere — the sphere referred to the celestial equator — the ascensions of the signs at the meridian and at the nadir cusps were tabulated in the early chapters of the zij tradition {cite:nallino-albatenii-opus-astronomicum t. I p. 131}. In each climate, the oblique ascensions of the signs at the horizon cusps — the ascendant and descendant points — were likewise known from the climatal tables {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–132}. What remained unknown was the behaviour of the signs in the regions of the sphere between these cusps, and that is precisely the gap the chapter addresses.

The problem was not merely academic. The quantities are needed in astrology: to find the direction of a planet or a sensitive point of a nativity, one must know the arc of the sphere through which it travels between rising and culmination, and that arc depends on ascensions that vary with position {cite:nallino-albatenii-opus-astronomicum t. I p. 135}. Earlier calculators had approximated the needed quantities; al-Battani's chapter replaces approximation with a stated rule.

## The story
[[person/al-battani|Abu Abdallah Muhammad ibn Jabir al-Battani]], known in Latin as Albategnius, worked in ninth-century Abbasid Raqqa, where he made careful solar and lunar observations and composed the zij that bears his name {cite:tdv-battani-muftuoglu}. The zij exists in two versions: an earlier one whose chapters were already cited by Thabit ibn Qurra before 288 AH, and a later, more careful recension {cite:nallino-albatenii-opus-astronomicum t. I p. 131}. Chapter LV belongs to this corpus.

The chapter opens by sorting what was known from what remained. Nallino's Latin translation preserves the structure: the author first recalls the right ascensions of the signs in the right sphere, then the ascensions of the signs in the climata at the two horizon cusps, and then states that what is still needed is the computation for the spaces between these cusps in each region of the sphere {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–134}. He then gives the rule, works an example on the sign Aries, and generalizes to degrees and stars, with and without latitude, in three positional cases {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}.

A separate treatise on the same subject is listed by three medieval bibliographers — Ibn al-Nadim in the Fihrist, al-Qifti in the Akhbar al-hukama', and Ibn Khallikan in the Wafayat al-a'yan — under the title Kitab ma'rifat matali' al-buruj fi ma bayna arba' al-falak, "the book of knowing the ascensions of the signs in what lies between the four spheres" {cite:nallino-albatenii-opus-astronomicum p. 28}. The treatise did not survive; Nallino's critical edition preserves only the catalogue notices and the zij chapter itself.

## The maker(s)
Al-Battani was a Muslim astronomer of the early Abbasid period, active at Raqqa under the caliphs al-Ma'mun's successors. His biography in the TDV Islam Ansiklopedisi describes him as one of the great observational astronomers of his age, whose solar parameters corrected Ptolemy's and whose lunar theory fed later zij tables {cite:tdv-battani-muftuoglu}. His zij was translated into Greek by George Chrysococces in the thirteenth century and influenced the Toledo and Alfonsine traditions {cite:nallino-albatenii-opus-astronomicum t. I}. In the museum's Sunni frame his Muslim identity is documented by the Arabic sources and his position in Abbasid scholarly institutions; no personal madhhab is separately attested in the sources read.

## How it works
The method rests on a proportion. For a degree or star lying between two reference cusps of the sphere, the distance in temporal hours from one cusp determines what fraction of the difference between the right ascension and the oblique ascension applies {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}. Nallino's edition shows the worked example on Aries: the sign ascends at the meridian cusp in 27 degrees 53 minutes of equinoctial time, while in the fourth climate it ascends at the horizon in 19 degrees 12 minutes, and sets with Libra's rising in 36 degrees 34 minutes {cite:nallino-albatenii-opus-astronomicum t. I p. 134}. Six temporal hours separate each cusp from the next, and the proportional rule interpolates within that interval.

The chapter then gives the general rules. For a degree or star without latitude, the computation uses the difference between the right and oblique ascensions weighted by position; for a body with latitude, additional terms account for its distance from the ecliptic {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}. Three cases are distinguished according to whether the body stands in the eastern hemisphere, the western hemisphere, or split between them. An alternative formulation uses diurnal and nocturnal temporal hours directly. The chapter closes by stating that these quantities are required for the nativities of the astrologers, for directing the significators as Ptolemy describes in the Tetrabiblos {cite:nallino-albatenii-opus-astronomicum t. I p. 135}.

## The spread
The zij containing the chapter travelled widely. It was translated into Greek, studied in the Latin West, and formed one of the sources of the Alfonsine tables; the chapter's subject — ascensions for astrological directions — kept it within the working astronomy of court and madrasa alike {cite:nallino-albatenii-opus-astronomicum t. I}. The dedicated treatise appears only in bibliographies; its loss means the zij chapter is the sole surviving statement of the scheme.

## What it was built on
The method is built on two inherited layers. First, the Ptolemaic and Indian astronomical tradition that supplied the spherical framework, the climate tables and the very notion of oblique ascension {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–132}. Second, al-Battani's own earlier chapters, which tabulated the right ascensions and the climatal ascensions that his new rule interpolates between {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}. Nallino's introduction notes that earlier calculators had treated the problem by cruder approximations and that al-Battani's value lies in stating the proportional rule explicitly {cite:nallino-albatenii-opus-astronomicum t. I pp. 315–317}.

## What was built on it
Within the zij tradition the chapter fed the astrological chapters that compute directions and profections; the lost treatise, had it survived, would have been its fullest statement {cite:nallino-albatenii-opus-astronomicum p. 28}. Later zij authors inherited the ascensional tables and the direction problem, though Nallino's edition does not trace a named successor to this specific proportional rule. The scheme's survival is primarily textual: it stands in the chapter where later copyists preserved it.

## Impact on daily life
Its daily impact was indirect but real. Prayer times and qibla direction depend on the same spherical quantities — rising arcs, hour angles, meridian distances — that the chapter systematizes {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}. The muwaqqit who timed prayers at a mosque worked with ascensional tables of exactly this kind, even though the chapter's stated purpose was astrological rather than ritual {cite:tdv-battani-muftuoglu}.

## How it changed history
The chapter is a witness to the precision of Abbasid computational astronomy: a problem that earlier hands had approximated is given an explicit interpolation rule with worked examples and stated limits {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}. It also marks the boundary between mathematical astronomy and astrology inside the zij — the same tables serve both, and the chapter says so by tying its quantities to the Tetrabiblos {cite:nallino-albatenii-opus-astronomicum t. I p. 135}. Its historical weight is documentary: the lost treatise means we see the method at the stage the zij preserves, not its possibly fuller form.

## Who invented it?
Al-Battani did not invent ascensional astronomy. Right and oblique ascensions were tabulated before him, and the direction problem was Ptolemy's. His documented contribution is the systematic extension of the computation to the spaces between the four cusps, stated as a proportional rule and worked in detail — an improvement inside an inherited tradition, not a new science. The museum records the status as improvement, with the caveat that the dedicated treatise's loss leaves the zij chapter as the sole witness.

## Today
The proportional rule itself is superseded: modern spherical astronomy computes ascensions and directions by direct formulae, and the quantities the chapter sought are now obtained instantly by software {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}. What survives is the problem — how rising arcs vary across the celestial sphere — and the chapter remains a clear example of how medieval astronomers turned a geometric difficulty into a tabulated, rule-governed computation.

## Surviving examples
No instrument or manuscript of the lost treatise is known to survive. The method survives textually in chapter LV of the zij, preserved in the Arabic manuscript tradition and in Nallino's 1899–1907 critical edition {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}. The displayed image in this record shows a medieval Islamic astronomical manuscript — a Book of the Images of the Stars — as context for the manuscript culture that preserved such works, not as an example of the method itself.

## In culture
The zij tradition that carries the chapter belongs to the same scholarly world that produced the astrolabe, the quadrant and the muwaqqit's tables; its ascensional chapters were part of the working knowledge of astronomers from Baghdad to Cairo and Cordoba {cite:tdv-battani-muftuoglu}. The chapter's dual audience — mathematicians and astrologers — reflects the era's confidence that one spherical machinery could serve both precise timekeeping and the interpretation of celestial influence.

## For young readers
Imagine the sky as a giant sphere covered in signs, and each sign takes a different amount of time to climb over the horizon depending on where you stand. Al-Battani found a clever shortcut: instead of measuring every point separately, he showed that the answer changes in proportion as you move between two known points. Like guessing the temperature halfway between two thermometer readings, his rule let astronomers compute rising times anywhere on the sky — a trick that helped both star-watchers and the people who timed prayers.

And so chapter LV of the zij — together with its lost treatise — stands as a witness to a period when the computation of astronomy was precise and methodical, before later instruments absorbed it and ready-made formulae replaced hand-worked rules.

## References
{cite:nallino-albatenii-opus-astronomicum p. 28}
{cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}
{cite:nallino-albatenii-opus-astronomicum t. I p. 135}
{cite:nallino-albatenii-opus-astronomicum t. I pp. 315–317}
{cite:tdv-battani-muftuoglu}
