---
id: invention/ibn-yunus-solar-time-tables
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b58", source: "Arabic translation from complete actual King BEA/Dizer TDV/MacTutor; modern spherical example, not manuscript cells or reconstructed historical algorithm" }
---

## Summary

Solar altitude alone cannot tell us how much daylight has passed: the answer changes with location and season. [[person/ali-ibn-yunus-al-munajjim|Ibn Yunus al-Sadafi]] contributed to a Cairo corpus of spherical tables deriving time and azimuth from solar altitude and annual position. David King describes this as a major contribution while warning that the surviving collection includes later additions not all assignable to Ibn Yunus {cite:ibn-yunus-king-bea timekeeping corpus}.

We record a computational tool, not invention of time, the first sundial or a pendulum clock. Nor are the three principal table sets counted as three inventions: they form a connected programme for related astronomical problems. Layers of authorship belong in the story, not beneath a misleading assertion that all the tables were his.

## What it is

The tool has two arguments: solar altitude and solar longitude, yielding quantities such as time since sunrise, time remaining to midday, or azimuth. Solar longitude is a position on the ecliptic, not the user's geographical longitude. King describes three principal sets, each exceeding10,000 entries in the surviving corpus; these are not10,000 individually documented observations by Ibn Yunus {cite:ibn-yunus-king-bea main tables}.

“Spherical” means the calculation concerns the geometry of the sky seen from a terrestrial location. The accompanying plane triangle cannot represent every variable. Tabulating results changes the user's computational work but does not remove the need to identify arguments, units and conventions.

## The world before it

Time reckoning, sundials and observations preceded Ibn Yunus. King relates his work to Yahya ibn Abi Mansur's Mumtahan Zij prepared in Baghdad nearly two centuries earlier. TDV describes his study of Habash, al-Battani, al-Nayrizi and others. These form a network of predecessors, not a single famous origin {cite:ibn-yunus-king-bea Mumtahan discussion} {cite:tdv-ibn-yunus-dizer predecessors}.

Observational lists and planetary computation are not automatically the same as timekeeping tables. The distinction here is preparing a two-argument tool for a solar-time problem in a Cairo setting, not simply writing numbers or noticing the Sun's apparent movement. We add no specific dependency on an earlier shadow-table record merely because both concern sunlight.

## The story

King and Dizer regard the birth date as unknown, despite MacTutor's header displaying950. He lived in Fustat, witnessed the Fatimid conquest and Cairo's foundation as a young man in969, and received support from al-Aziz and later al-Hakim. Recorded observations continued until1003; he died in1009 {cite:ibn-yunus-king-bea biography} {cite:tdv-ibn-yunus-dizer biography} {cite:ibn-yunus-mactutor biography}.

The record's open lifetime endpoint dates only his individual contribution, not the entire surviving corpus with13th- and14th-century additions. The maker's earlier death record remains unchanged. Neither a later copy nor a modern edition's year becomes the original tables' composition date.

## The maker(s)

O'Connor and Robertson individually identify Ibn Yunus as an Islamic mathematician. This supplies a recorded Muslim basis. Sunni is separately the museum's frame, not inferred from family, Arabic name or the personal affiliation of Fatimid patrons. Political sponsorship does not certify an individual scholar's sect {cite:ibn-yunus-mactutor summary} {cite:tdv-ibn-yunus-dizer biography}.

His role is improver and contributor. TDV assigns some later tables to al-Maqsi, while King explicitly notes difficulty determining how many Ibn Yunus computed. Copyists and later contributors cannot all be folded into him. A suggestion that professional calculators assisted also does not produce a verified team roster {cite:tdv-ibn-yunus-dizer work1} {cite:ibn-yunus-king-bea timekeeping corpus} {cite:ibn-yunus-mactutor support discussion}.

## How it works

Our explanation is modern, not a claim that the author derived this symbolic equation. Let phi be latitude, delta solar declination, h solar altitude, and H angular distance from the meridian. In our spherical model, `sin(h)=sin(phi)sin(delta)+cos(phi)cos(delta)cos(H)`. Geographical latitude, solar declination and height above the horizon are different quantities.

Choose latitude30degrees, matching a historical corpus parameter reported by King, and choose zero declination for teaching. In this simplified equinoctial case, `cos(H)=sin(h)/cos(30°)`. We assume an ideal horizon and exclude atmospheric refraction and the Sun's disk size. This is neither an observing procedure nor a usable daily timetable {cite:ibn-yunus-king-bea corpus parameters}.

On the morning branch, altitude30degrees gives `cos(H)=1/sqrt(3)`, so H is approximately54.736degrees. At15degrees per equal solar hour, about3.649hours remain until noon. Our equinoctial half-day is six hours, leaving about2.351hours since sunrise. These are independently checked modern values, not cells read from a manuscript.

At altitude45degrees, `cos(H)=sqrt(2/3)`: about2.351hours remain and3.649hours have passed. At noon H is zero and altitude60degrees, not90. This shows latitude's role. Altitude is not simply hours elapsed, and the Sun is not overhead for every observer at noon.

The same altitude can occur before and after noon, so a branch must be selected. A changing solar declination changes daylight duration and altitude limits at the same place. Civil-clock conversion introduces further conventions, including time zone and apparent versus mean solar time. Our model does not silently perform those conversions.

MacTutor reports that the tables' accuracy led King to suggest nonlinear interpolation. That is a scholar's inference, not proof we have recovered Ibn Yunus's algorithm. Neither King's original1973 paper nor the manuscript grid was read here; choosing a modern interpolation rule would not establish it as his {cite:ibn-yunus-mactutor solar-time-table discussion}.

## The spread

King reports use of the Cairo corpus into the nineteenth century and inspiration for Abu al-Uqul's Taiz tables and al-Khalili's Damascus tables. This is a specialist historian's account, not our independent census of every copy or user. Continued practice does not mean every numerical cell remained unchanged {cite:ibn-yunus-king-bea corpus reception}.

Manuscripts differ in ordering and selection. Different order does not make every copy a new composition, and resemblance does not assign all parts to the first contributor. The spread account therefore remains descriptive rather than manufacturing certain causal edges to every city named in scholarship.

## What it was built on

The calculation requires spherical quantities, time and position conventions, tables and parameters. King reports Cairo latitude30degrees and obliquity23degrees35minutes for the corpus. These are historical parameters, not recommended modern coordinates for every neighbourhood {cite:ibn-yunus-king-bea corpus parameters}.

Obliquity is not solar declination on every day: it helps define the annual range of that changing quantity. Choosing delta zero does not erase the historical obliquity; it selects a school example. Making assumptions explicit matters more than displaying many unexplained digits.

## What was built on it

King describes subsidiary spherical tables, some relating to the five daily prayers. TDV explains that Ghayat al-intifa was a later title for a compilation incorporating Ibn Yunus's tables and others. The [[work/cairo-solar-time-corpus|corpus is therefore recorded as layered]], not a single book entirely in his hand {cite:ibn-yunus-king-bea subsidiary tables} {cite:tdv-ibn-yunus-dizer work1}.

The Hakimi Zij is broader, covering observations, planets and calendars. MacTutor's separately discussed lunar tables, with more than34,000 entries and uncertain attribution, are another subject. Their count must not migrate into the time tables. Different applications also do not justify splitting one example into inflated invention totals {cite:ibn-yunus-mactutor lunar-table discussion}.

## Impact on daily life

Scholarship connects astronomical timekeeping with everyday and religious requirements. Explaining this is not issuing prayer times or a legal ruling. We present an instrument of calculation and its assumptions, not a replacement for an approved timetable. The sources supply neither counts of users for each set nor quantified time savings {cite:ibn-yunus-king-bea timekeeping corpus} {cite:tdv-ibn-yunus-dizer timekeeping discussion}.

Its educational value is seeing a problem move from celestial geometry to two inputs and a numerical answer. Many numbers still need interpretation: is the time measured since sunrise or until noon, and on which branch? A mistaken column heading can spoil use of a correctly calculated table.

## How it changed history

The corpus represents an effort to turn complex spherical problems into a reusable computational aid. King describes roughly hundreds of pages and large numerical sets while qualifying attribution. Scale is not evidence for a lost computer or an algebraic method the source never described {cite:ibn-yunus-king-bea corpus scale and authorship}.

This achievement differs from the claim that Ibn Yunus invented pendulum timekeeping. MacTutor rejects evidence for his use of a pendulum and reports King's tracing of the myth to a later European account. The table contribution deserves attention without adding an unattested instrument {cite:ibn-yunus-mactutor pendulum discussion}.

## Who invented it?

“Ibn Yunus's contribution to the Cairo corpus” is more accurate than “all Cairo tables were his invention.” The association is strong in the scholarship read, but attribution of individual tables is uncertain and later additions are known. Stating this does not diminish his contribution; it prevents assigning generations of work to one person {cite:ibn-yunus-king-bea timekeeping authorship} {cite:tdv-ibn-yunus-dizer work1}.

Nor do we claim global priority in every time calculation. This record identifies a particular problem, computational setting and stated evidence, not the first use of sunlight or time. “Tool” here means numerical organization, not a surviving mechanism in a display case.

## Today

Modern programs return time and azimuth quickly, but this proves neither direct descent from the corpus nor identical definitions of time. A modern example helps readers understand inputs before looking at output. We do not calculate refraction, a real horizon or time zone and hide those differences.

The image is TheOtherJesse's modern plane right triangle, released into the public domain in2007. It recalls sides and angles but does not depict a complete spherical triangle, Ibn Yunus's table page or an equipped observatory {cite:commons-trigonometry-triangle Description and licensing}.

## Surviving examples

King points to important Dublin and Cairo corpus manuscripts alongside many witnesses with different selections and arrangements. These are distinct from the Hakimi Zij fragments in Leiden, Oxford and Paris. Naming repositories does not mean we opened their manuscripts or compared row values {cite:ibn-yunus-king-bea corpus manuscripts and Hakimi fragments}.

The timekeeping manuscripts and original1973 study were not read here. Our defined sources are King's scholarly biography, Dizer's entry and MacTutor, each read completely. We claim no direct inspection that did not occur and do not date every layer from a late copy.

## In culture

Sources recount absent-mindedness, astrology and a prediction of his death. These remain attributed stories, not a personality diagnosis or validation of astrology. Patronage also does not judge the scholar's personal beliefs or guarantee all his results {cite:ibn-yunus-king-bea biographical anecdotes} {cite:tdv-ibn-yunus-dizer biography}.

King and Dizer caution against the familiar “well-equipped observatory” picture: instrument and observing-site descriptions do not establish it. We tell the history of calculation without inventing an observatory or drawing unknown hardware merely because measurements theoretically required equipment {cite:ibn-yunus-king-bea observatory caution} {cite:tdv-ibn-yunus-dizer instruments}.

## For young readers

Imagine cards asking two different questions: “How long since sunrise?” and “How long until noon?” In our12-hour-day example the morning answers sum to six hours. Do not subtract one from24 or compare it directly with a phone clock: meanings and reference points differ.

Read each column's title before its number. Ask whether the model is for a chosen place and day or everywhere. Wanting to know time is never permission to look at the Sun or test eyesight. Paper is enough. Sources support the history; neat handwriting does not turn our school numbers into ancient evidence.

## References

- {cite:ibn-yunus-king-bea complete biography and selected references}
- {cite:tdv-ibn-yunus-dizer main entry and bibliography}
- {cite:ibn-yunus-mactutor complete biography}
- {cite:commons-trigonometry-triangle Description and licensing}
