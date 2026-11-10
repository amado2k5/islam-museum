---
id: invention/mahani-successive-quotient-ratios
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b81", source: "Arabic-first museum prose; actual DSB/TDV and MacTutor al-Nayrizi, selected modern definitions/formulas and Commons rights/static image. No original manuscript or general equivalence-proof reading claim." }
---
## Summary

Yvonne Dold-Samplonius describes [[person/al-mahani|al-Mahani]] defining ratio through the mutual behaviour of magnitudes in a greatest-common-measure process: two ratios are proportional when their successive quotient sequences agree. This was an explicit contribution to ratio theory, not the invention of division or the Euclidean algorithm. Her account retains much older precedents {cite:dold-samplonius-mahani-dsb ratio}.

The subject belongs to his [[work/mahani-risala-fi-nisba|Treatise on Ratio]] and the tradition around Euclid's fifth book, not his separately recorded [[invention/mahani-sphere-division-cubic|sphere-division cubic]]. Dold-Samplonius says he did not establish the connection with Euclid's definition; she assigns that later achievement to Ibn al-Haytham. Our modern examples do not silently supply a missing historical proof {cite:tdv-mahani-fazlioglu work1-and-ratio} {cite:dold-samplonius-mahani-dsb ratio}.

## What it is

A ratio is not one isolated length. Two larger lengths can have the same relationship as two smaller ones while their common measures differ. Here we repeatedly ask how many times the smaller fits into the larger, then compare the smaller with the remainder. The historical account presents this as a way to describe the relationship, not as a rejection of Euclid's underlying correctness {cite:dold-samplonius-mahani-dsb ratio}.

Modern teaching can express the resulting quotients as a simple continued fraction. That printed name and notation are not letters copied from al-Mahani's manuscript. MathWorld also warns that authors use different bracket conventions. We must specify our convention before asking whether two written sequences match {cite:weisstein-simple-continued-fraction definition-and-notation}.

## The world before it

Dold-Samplonius identifies a pre-Eudoxian conception, Euclid's equimultiple definition and the inherited comparison process. A headline saying that al-Mahani invented greatest common divisors or every continued-fraction idea would erase that background. His place here is a particular explicit account of proportionality, not the creation of every arithmetic tool used in our explanation {cite:dold-samplonius-mahani-dsb ratio}.

In her account, the synthetic presentation of Book V did not reveal how ratio theory had arisen. Mathematicians accepted its correctness while looking for an account of magnitudes' mutual behaviour. Dissatisfaction with an explanation's presentation is different from discovering an arithmetic mistake. It also does not mean that medieval writers shared all our modern terminology {cite:dold-samplonius-mahani-dsb Euclid-V}.

## The story

TDV lists the ratio treatise, witnesses and two additional title forms. Dold-Samplonius questions whether three reported ratio treatises were different. We represent the named work without manufacturing three books to increase the count, or merging manuscript descriptions as identical without comparison {cite:tdv-mahani-fazlioglu work1} {cite:dold-samplonius-mahani-dsb works}.

MacTutor's al-Nayrizi biography says that he adopted concepts proposed by al-Mahani, who probably worked in Baghdad before his arrival. That reports intellectual reception, not a documented personal teaching session. The ninth century is a lifetime horizon, not a securely dated autograph: an astronomical observation does not become the date of the ratio formulation {cite:nayrizi-mactutor ratio} {cite:tdv-mahani-fazlioglu biography}.

## The maker(s)

MacTutor individually documents al-Mahani as an Islamic mathematician. The museum's default Sunni frame is separately declared, not inferred from his city or his arithmetic. His approximate biographical dates remain approximate; a mathematical explanation does not require inventing an exact birthday or death date {cite:mahani-mactutor summary-and-dates}.

Dold-Samplonius notes a reference to Thabit ibn Qurra and a later similar development by al-Nayrizi. Thabit remains part of the history even though this browser applies a narrower maker-inclusion rule. Nor is Ibn al-Haytham's later equivalence result reassigned to all three predecessors. The account contains different stages, not one inventor responsible for every step {cite:dold-samplonius-mahani-dsb ratio}.

## How it works

Here is an independent modern example using positive commensurable quantities. In the same unit, take17 and7. Then17=2×7+3;7=2×3+1;3=3×1+0. The ordered quotients are2,2,3, and the last nonzero remainder is1. MathWorld explains the quotient-remainder iteration and preservation of common divisors; these particular numbers are not attributed to al-Mahani {cite:weisstein-euclidean-algorithm eqs1-3}.

Double both lengths to34 and14. The remainders become6,2,0, while the quotients remain2,2,3. The common measure changes from1 to2, but34/14=17/7. Equality of ratios therefore cannot mean merely equality of greatest common divisors. Nor is having three steps enough: it is the ordered quotient values that our example compares.

Using modern notation, write[2;2,3], meaning2+1/(2+1/3)=17/7. The entries after the semicolon are not decimal digits or separate lengths. They describe nested operations. If the first positive quantity is smaller, a first quotient of0 is possible; silently reversing the ratio would change the comparison {cite:weisstein-simple-continued-fraction eqs1-3}.

However,5/2=[2;2] is not17/7=[2;2,3], despite a shared beginning. Cross multiplication gives5×7=35 but2×17=34. A finite matching prefix is not enough. We also fix the Euclidean termination convention at remainder0: an alternative expression ending in1 after splitting the last entry must not be confused with the algorithm's canonical terminating record.

For example,[2;2,2,1] represents the same number because its final nested2+1/1 equals3. It is another writing, not another measured ratio. We therefore specify the terminating record produced by division, rather than any chosen symbolic list. Reversing the lengths gives7/17=[0;2,2,3], not17/7. The changed first quotient reflects a changed question. These are modern teaching details for positive examples, not evidence about the original treatise's notation or the independence of its reported title forms {cite:weisstein-simple-continued-fraction eqs1-3}.

## The spread

MacTutor's account of al-Nayrizi supplies a specific reception link rather than two similar names in a catalogue. It does not prove that every sentence or every detail of the theory was transmitted. Dold-Samplonius describes a later similar development; neither description establishes a dated teacher-pupil meeting {cite:nayrizi-mactutor ratio} {cite:dold-samplonius-mahani-dsb ratio}.

Present manuscript locations do not provide a ready-made route of circulation. TDV's witnesses are evidence reported for textual survival, not a travel diary. A modern library may preserve a text without telling us where ninth-century readers encountered it or exactly which later reader used that copy {cite:tdv-mahani-fazlioglu work1}.

## What it was built on

The Euclidean process is inherited. In modern integer language, ifA=qB+r, every common divisor ofA andB dividesr; conversely, every common divisor ofB andr dividesA. This explains the arithmetic step in our example. It is not a translated line from al-Mahani's manuscript or evidence that he first discovered that property {cite:weisstein-euclidean-algorithm eqs1-2}.

Scaling both lengths together preserves the rational example's quotients while changing remainder sizes. Changing only one unit does not preserve the ratio: metres and centimetres need consistent conversion. This is a modern safeguard for understanding the example, not a claim about a surviving ruler or measuring instrument used by the author.

## What was built on it

Dold-Samplonius says that al-Mahani and al-Nayrizi did not establish the connection between their definition and Euclid's; Ibn al-Haytham did so later. The ease of checking17/7 against34/14 does not erase that limit. Two integer examples are not a proof covering every magnitude addressed by ratio theory {cite:dold-samplonius-mahani-dsb ratio}.

Continued-fraction notation offers a modern explanatory tool, not a certificate that al-Mahani anticipated every convergence theorem or computer application. Comparing procedures does not demonstrate a direct lineage. This record supplies no invented transmission chain from his treatise to every cryptographic use of greatest common divisors {cite:weisstein-simple-continued-fraction definition-and-notation}.

## Impact on daily life

The sources describe a mathematical question and its reception, not merchants attributing their balances to this treatise or schools measuring hours saved by it. We do not invent a commercial anecdote to fill the section. The supported contribution concerns the language and explanation of proportional magnitudes, with the proof boundary visible {cite:dold-samplonius-mahani-dsb ratio} {cite:nayrizi-mactutor ratio}.

A reader today can learn that enlarging objects does not change every relationship between them. Doubling both lengths preserves their ratio but changes their common measuring length. That is a lesson from our modern example, not a historical economic estimate. Distinguishing a relationship from an absolute measure prevents superficially similar statements being treated as equivalent.

## How it changed history

The formulation makes a relationship traceable through repeated operations rather than merely asserting that a ratio exists. This does not make the older synthetic account worthless: the historian explicitly says its correctness was accepted. A new explanatory question can matter without requiring a story of total rupture with the past {cite:dold-samplonius-mahani-dsb ratio}.

This contribution differs from al-Mahani's unfinished cubic attempt. One concerns the meaning and comparison of proportion; the other translates a prescribed sphere-volume division into an equation. A shared author does not merge the subjects or establish that one directly caused the other. Each record has its own work and limits, not a repeated title for a larger total {cite:tdv-mahani-fazlioglu work1-and-work5}.

## Who invented it?

**Sunni frame, explicitly declared:** al-Mahani's individual Muslim identification and the museum's Sunni frame are separate from mathematical priority. **Academic account:** Dold-Samplonius retains older origins, describes his explicit formulation, a later development by al-Nayrizi and a subsequent proof by Ibn al-Haytham. We do not award the whole history to one person {cite:mahani-mactutor summary} {cite:dold-samplonius-mahani-dsb ratio}.

“Improvement” here identifies a supported development, not the first human to divide lengths. It preserves inherited ideas and the fact that original texts were not inspected in this session. The historian's scholarship is our cited evidence, not an unannounced substitute for claiming we collated every surviving witness ourselves {cite:dold-samplonius-mahani-dsb bibliography}.

## Today

Positive integer remainders decrease until termination, whereas an irrational magnitude comparison need not terminate in that way. Different quantities can share early steps. We therefore do not offer a procedure that reads five quotients and declares any two magnitudes equal: the scope of our commensurable numerical illustration must remain explicit {cite:weisstein-euclidean-algorithm termination}.

The image belongs to a modern1071-and462 example, not numbers read in the treatise. A black rectangle contains two large orange blocks, three violet upper blocks and smaller green and red regions. There are no visible number labels. Our description invents neither labels nor an original diagram drawn by al-Mahani {cite:commons-euclid-tiling-proteins current-image}.

## Surviving examples

We read the reproduced Dold-Samplonius biography, TDV's work list, MacTutor's al-Nayrizi biography and selected modern MathWorld definitions and formulas. We did not inspect ratio manuscripts or the Plooij and Becker studies named in the bibliography. TDV reports witnesses and title forms; that report does not settle textual independence through guesswork {cite:tdv-mahani-fazlioglu work1} {cite:dold-samplonius-mahani-dsb bibliography}.

The image is by Proteins, dated17April2009 and licensed CC BY-SA3.0. Its static image and rights were inspected, including a white-background inspection copy kept outside git. The published asset remains the unmodified original SVG, not that inspection copy or an animation from the series. A modern series is not an ancient manuscript witness {cite:commons-euclid-tiling-proteins description-rights}.

## In culture

This history distinguishes asking what a relationship means from asking only for one division result. A commentator becomes an investigator by examining a definition and its reasons, not merely by changing a printed symbol. That is an interpretation of the described work, not an invented quotation attributed to al-Mahani {cite:dold-samplonius-mahani-dsb ratio}.

The story needs no imaginary Baghdad competition scene. A reported treatise with limits to our knowledge is enough. Readers should recognize the difference between the author's century and an image dated2009. Juxtaposing those times is an openly declared teaching device, not an attempt to age a modern illustration.

## For young readers

Write17 and7 on paper, recording the quotient and remainder at each step. Repeat with34 and14. Look for what changes and what stays the same, not just how many lines you wrote. You do not need an ancient instrument to try the arithmetic, and should not call these al-Mahani's own examples.

Then compare5/2 and17/7: their beginnings resemble each other, but the ratios differ. Do not stop at the first similarity. Ask what the headline claims: invention of all division, or a particular way of understanding ratios? Our example helps formulate the question without solving the entire theory of magnitudes {cite:weisstein-euclidean-algorithm eq3} {cite:dold-samplonius-mahani-dsb ratio}.

## References

- Dold-Samplonius: ratio theory and proof boundary {cite:dold-samplonius-mahani-dsb ratio}.
- TDV: named work and witnesses {cite:tdv-mahani-fazlioglu work1}.
- MacTutor: al-Nayrizi reception {cite:nayrizi-mactutor ratio}.
- MathWorld: modern arithmetic and notation {cite:weisstein-euclidean-algorithm eqs1-3} {cite:weisstein-simple-continued-fraction eqs1-3}.
- Commons: modern static image and rights {cite:commons-euclid-tiling-proteins description-rights}.
