---
id: invention/combinatorics-ibn-munim
lang: en
source_lang: ar
translators: ["Copilot SDK in VS Code"]
status: { review: published }
provenance: { generated_by: "Copilot SDK in VS Code", model: "unknown", run: "inventions-p3-b62", source: "Arabic translation from selected actual Djebbar/Arrabita and inspected CC0 image; modern examples, not manuscript transcription" }
---

## Summary

How many selections can a fixed set of colours produce? How does the answer change if order matters or repetition is allowed? [[person/ibn-munim-al-abdari|Ibn Munim al-Abdari]] made such questions tools for counting letters and words in sectionXI of [[work/fiqh-hisab-ibn-munim|Fiqh al-hisab]]. Ahmed Djebbar describes movement from concrete models to rules, tables and reasoning, not merely writing a long list and counting its lines {cite:djebbar-ibn-munim-combinatoire pp9–13}.

Our record concerns systematic combinatorial development, not invention of counting or the world's first triangular table. Djebbar acknowledges al-Khalil ibn Ahmad's linguistic predecessor work and al-Karaji's algebraic construction. The contribution concerns interpreting entries through selections and permutations and extending repetition problems, with limits to abstraction the historian explicitly discusses {cite:djebbar-ibn-munim-combinatoire pp10–12}.

## What it is

A combination selects elements without regard to order; a permutation treats changed positions as different outcomes. Permitting an element to repeat changes the possibilities again. These modern definitions explain the problem, not an assertion that every historical word matches a current textbook term. Djebbar distinguishes these kinds within a linguistic project, using colours as a counting model {cite:djebbar-ibn-munim-combinatoire pp10–12}.

“Counting words” can mean counting constructions under assumptions about letters and signs, not enumerating meaningful vocabulary in actual use. Arrabita describes a chosen alphabet, maximum example length and marking conditions. These are model assumptions, not discovery of everything humans have said. Formal possibility, a dictionary, the number of languages and the number of speakers are different quantities {cite:arrabita-fiqh-hisab combinatorial section}.

## The world before it

Linguists' work, particularly al-Khalil's counting, appears in Ibn Munim's account of his task as reported by Djebbar. Relations between letters and possible arrangements already led to arithmetic questions. The author extends counting without repeated letters rather than claiming an unorganized void before himself. Mathematical and linguistic traditions belong together in this story {cite:djebbar-ibn-munim-combinatoire pp9–11} {cite:arrabita-fiqh-hisab combinatorial section}.

Al-Karaji's earlier algebra supplied an arithmetic triangle. That is distinct from his [[invention/karaji-polynomial-arithmetic|polynomial arithmetic]] record and from the combinatorial interpretation here. We do not count the same shape twice under “first inventor of Pascal's triangle.” We identify reasoning and use: identical numbers do not establish that authors understood every same relationship or read the same copy {cite:djebbar-ibn-munim-combinatoire pp10–11}.

## The story

Abd al-Aziz al-Naqr's biography describes a man from Denia in al-Andalus settling and teaching at the Mansuriyya in [[place/marrakesh|Marrakech]]. Arrival is undated; a caliphal invitation is a reported scholarly suggestion. Djebbar's earlier report could not establish composition place. We distinguish that report's knowledge from an updated biography's use of older biographical evidence {cite:arrabita-ibn-munim-naqr section3} {cite:djebbar-ibn-munim-combinatoire p8}.

Djebbar tentatively dates the book1207–1212 from dedication and praise of al-Nasir, not a dated colophon. Our record uses broad thirteenth-century placement and attributes the narrower suggestion. His analysis also reports application tables added after copies circulated among students. This was teaching and developing exposition, not a single perfectly dated moment of inspiration {cite:djebbar-ibn-munim-combinatoire pp7–8,12}.

## The maker(s)

The author is Abu Jafar Ahmad ibn Ibrahim ibn Ali ibn Munim al-Abdari, not the Sicilian Muhammad ibn Isa ibn Abd al-Munim. The biography warns about confusion; similar names and mathematical occupation do not establish identity. Arrabita's book article explicitly names him among Muslim scholars. That supplies an individual Muslim basis, not his name or birthplace {cite:arrabita-ibn-munim-naqr sections1,3} {cite:arrabita-fiqh-hisab introduction}.

The separate Sunni frame is the museum's declared default, not personal Maliki attestation. Djebbar reports prefatory praise of Ibn Tumart and the Almohad ruler; this remains attributed rhetoric, neither endorsed by the museum nor sufficient alone for a complete personal sect biography. Paternal teaching, medicine and students appear in the biography, but information remains sparse {cite:djebbar-ibn-munim-combinatoire pp5–8} {cite:arrabita-ibn-munim-naqr sections3–5}.

## How it works

Djebbar presents ten silk colours made into tufts of one colour, two and so on to ten, counting selections of each size. The first line has ten single-colour cases. To form pairs, fix a later colour and join it to every earlier one, avoiding a second count when their order reverses. We visually checked printed19–20: a modern analytical account, not the author's manuscript {cite:djebbar-ibn-munim-combinatoire pp19–20}.

In our notation, ten colours give `1+2+...+9=45` pairs and `C(10,3)=120` triples. Here `C(n,k)` selects `k` different objects from `n`, ignoring order. Grouping cases by their largest selected element turns one large problem into smaller sums. Not counting one selection twice is a correctness condition, not just a shortcut.

Our smaller modern example chooses two different cards from five in ten ways. Distinguish first position from second and there are twenty: two positions for each pair. Allow repeated cards in two ordered positions and there are twenty-five. Ignore order but allow repetition and there are fifteen. Different answers need not mean faulty arithmetic; the question changed.

A modern explanation splits selections according to whether the final card is included. This gives `C(n,k)=C(n-1,k)+C(n-1,k-1)`, with `C(n,0)=1` and `C(n,n)=1`. Our convention counts one empty selection, although the tuft problem starts with one colour. We do not attribute that boundary statement to an unread original line.

The recurrence constructs row `1,5,10,10,5,1` for five and `1,10,45,120,210,252,210,120,45,10,1` for ten. The latter sums to1024, giving1023 nonempty selections. We independently checked these by enumeration and recurrence. They are not a photograph of the original table or proof that the author identified every entry with a binomial coefficient.

Repetition needs another distinction. LettersA,A,B give three distinct strings, not six; swapping identicalA copies creates no new writing. The linguistic project adds signs and pronunciation restrictions. Multiplying everything by four per letter fails if the model excludes some states. Djebbar describes repetition, recursive reasoning and tables, not software that knows lexical meaning {cite:djebbar-ibn-munim-combinatoire pp11–13}.

## The spread

Al-Naqr reports use by Ibn al-Banna, Ibn Haydur and Ibn Zakariyya al-Gharnati, and cites Ibn Khaldun concerning sources of Raf al-hijab. These are reception reports from articles read, not our reading of every later text or copy census. Djebbar distinguishes teaching that preserves results from evidence explicitly recognizing combinatorial reasoning as an independent tool {cite:arrabita-ibn-munim-naqr section2} {cite:djebbar-ibn-munim-combinatoire pp12–13}.

Resemblance does not draw a direct route to Pascal or Mersenne. Djebbar compares procedures with later work; comparison is not a particular transmission record. Our modern image uses a familiar triangle name. Its title neither makes the illustrator an authority on Ibn Munim nor settles universal priority or intellectual theft. Each historical route needs its own evidence.

## What it was built on

The book overview identifies Euclid's Elements and part of al-Mutaman's Istikmal as preparatory reading, alongside analysis and synthesis in proofs. This does not make every combinatorial argument a copy of geometry. Djebbar identifies inductive and combinatorial reasoning alongside the declared expository tools: a historian's analysis, clearly attributed {cite:arrabita-fiqh-hisab book introduction} {cite:djebbar-ibn-munim-combinatoire pp12–13}.

Colours and letters are different models sharing selected counting rules. Transfer works when distinctness, ordering and repetition conditions survive, not because a colour and a letter are identical things. Djebbar sees a route toward wider abstraction without an explicitly single model reducing all counting problems to one general structure at this stage {cite:djebbar-ibn-munim-combinatoire pp11–12}.

## What was built on it

Later Maghribi reception is reported, but every computer or language program is not a direct descendant of this book. Educational comparison does not require invented genealogy. An empty direct-dependents list means particular invention links are unestablished here, not that the work lacked influence or students learned nothing {cite:arrabita-ibn-munim-naqr sections2,5}.

Djebbar stresses that possessing the triangle does not establish recognition of its binomial-coefficient interpretation. Indeed, he questions the absence of that link in the root-extraction section. We cannot complete an unexpressed historical result because it now seems easy. What follows mathematically and what a person demonstrably stated are separate questions {cite:djebbar-ibn-munim-combinatoire pp10–11}.

## Impact on daily life

Silk colours make selection visible, not evidence that a factory used one table or that Ibn Munim invented weaving. Tufts serve a model excluding position from selection. Paper cards explain the problem without handling historical threads or making a product. We have no measured trade volume or time saving attributable to these rules {cite:djebbar-ibn-munim-combinatoire pp19–23}.

The teaching story is clearer than an unsupported economic claim: tables and examples were added after students received copies. Djebbar reads an exposition responding to educational needs. This establishes neither modern curricula nor standardized exams nor a particular class size, but it keeps learners present instead of reducing knowledge to a lone hero {cite:djebbar-ibn-munim-combinatoire p12}.

## How it changed history

Significance lies in organizing and explaining problems beyond one example, not an enormous alleged count of all human languages. Djebbar shows linguistic questions opening wider results, with contemporary abstraction's limits. This is bounded methodological development, not the museum adopting broad celebratory claims that one civilization universally surpassed others {cite:djebbar-ibn-munim-combinatoire pp9–13}.

Research history also shows changing knowledge: an earlier report drew clues from dedication; a later biography added information from an older source. New evidence enlarges the picture rather than making earlier limited knowledge dishonest. Author, copyist, editor and historian are different roles. Discovering a manuscript in modern times does not date invention of its rules.

## Who invented it?

Attribution rests on the described section of Fiqh al-hisab. Al-Khalil precedes it in linguistic counting and al-Karaji in algebraic triangle construction. Djebbar's earliest-known combinatorial-construction assessment is qualified by his knowledge and the type of construction, not a claim to the first arithmetic triangle ever. “Improvement” must not become absolute origin for a louder headline {cite:djebbar-ibn-munim-combinatoire pp10–11}.

The mathematician remains separate from his Sicilian namesake and similarly named museum people. Identity care prevents transferring books, dates or religion between individuals.1207–1212 is suggested composition;1551 a reported copy;2005 a modern edition. Replacing one with another changes the claim, even when all appear in the same book's history {cite:arrabita-ibn-munim-naqr sections1–4} {cite:arrabita-fiqh-hisab manuscript and edition}.

## Today

Current programs can check small cases by enumeration and recurrence. That is our modern verification, not Ibn Munim's program. Independently count ordered pairs, then divide by two for two different objects: five gives ten. ButA,A is not a different-object pair; transferring the same division to another case without changing assumptions breaks the reasoning.

Rohieb's2016 CC0 image has eight rows indexed zero through seven. Modern digits and triangular arrangement do not depict Fiqh al-hisab or silk tufts. The final row is1,7,21,35,35,21,7,1. Relationships are also explained in text: readers need not extract them from an image alone {cite:commons-pascal-small-rohieb Description and licence}.

## Surviving examples

Arrabita describes a copy in collection416, pages214–419, copied in Tunis by Hasan al-Rabai in958AH/1551, found by Idriss Lamrabet in1981 and edited in2005. These details come through the article, not firsthand inspection. Its sole-known-copy statement in the edition's context is not a current worldwide library census {cite:arrabita-fiqh-hisab manuscript and edition}.

We read selected parts of Djebbar's study and inspected printed19–20, not all131pages or its Arabic reproduction. Modern editorial symbols are not necessarily manuscript letters. Separating layers lets readers assess what an image, secondary analysis or unknown text establishes. A downloadable file is not permission to put the source book into Git.

## In culture

Language, teaching and arithmetic meet a physician-teacher's biography. Al-Naqr reports an older account of Ibn Munim mentally reviewing Euclid backward before sleep. This is an attributed anecdote, not an observed routine or intelligence test. Medical praise in that biography is neither a treatment recipe nor modern efficacy evidence {cite:arrabita-ibn-munim-naqr sections3–4}.

Fiqh al-hisab concerns knowledge of calculation here, not turning each result into a religious ruling. Dedication's political praise is historical rhetoric with a purpose. We retain it without repeating judgements about opponents in the museum's voice or making patronage establish the truth of a mathematical proof {cite:djebbar-ibn-munim-combinatoire pp5–9}.

## For young readers

Use five cards with different symbols, not colour alone, so colour discrimination is unnecessary. List every pair once. If left and right swap, should that count again? Write the rule before counting. This explores selection versus order without threads, tools or original artifacts.

Then permit the same symbol twice and ask why the answer changes. An adult can compare the list with a small triangle while explaining that it is modern, not Ibn Munim's handwriting. The central question is what counts as identical or different. A correct number answers explicit assumptions; it is not a long ornament to memorize without understanding.

## References

- {cite:djebbar-ibn-munim-combinatoire selected pp5–13,19–23}
- {cite:arrabita-ibn-munim-naqr sections1–5}
- {cite:arrabita-fiqh-hisab book manuscript and methods}
- {cite:commons-pascal-small-rohieb Description licence and image}
