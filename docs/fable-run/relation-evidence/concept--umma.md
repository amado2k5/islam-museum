# concept/umma

Neighbours before: 0. Relations added: 2.

The record's whole text is one sentence. Both relations come from it.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| mentioned_in -> work/quran | «جماعة المؤمنين الواحدة عابرة الأجناس والأمصار؛ مفهوم مركزي في القرآن والوحدة السياسية الإسلامية.» | {cite:wikidata} | content/ar/concept/umma.md, section «موجز»; the same words are `summary.ar` in data/concept/umma.yaml |
| has_part -> concept/mumin | the same sentence: «جماعة المؤمنين الواحدة ...» | {cite:wikidata} | content/ar/concept/umma.md, section «موجز» |

How each relation reads the sentence:

- `mentioned_in -> work/quran`: «مفهوم مركزي في القرآن» ("a central concept in the Qur'an"). `mentioned_in` is the inverse name of `mentions` (work to concept). Target is the museum's record of the Qur'an ⁦(`work/quran`, label «القرآن»)⁩.
- `has_part -> concept/mumin`: «جماعة المؤمنين» ("the community of the believers"): the believers are what the community is made of. Target labelled «المؤمن» / "Mu'min (believer)". This is the looser of the two: the sentence names the believers as the members, and the target is the record for the term "believer".

Caveat for the re-check: the record's only source is a Wikidata description (`sources: [source/wikidata]`), so both relations rest on that one citation.

Looked for and not found as records: nothing else is named in the sentence.

Could have been added but the sentence does not state it plainly enough:
- concept/unity-of-the-muslim-community ⁦(«وحدة الأمة الإسلامية»)⁩. The sentence calls the umma «مفهوم مركزي في ... الوحدة السياسية الإسلامية». Writing `basis_for` to that record needs two steps the sentence does not take: that "Islamic political unity" is the subject of that record (which is an essay on Islam's call to unity), and that "a central concept in" means "a basis for". Left for the lead to decide.
