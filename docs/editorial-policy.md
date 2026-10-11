# Editorial policy (condensed)

Full text: [`docs/plan/05-editorial.md`](plan/05-editorial.md).

1. **Claims.** Every key statement is `scriptural`, `tradition`, `historical`, `debated` or `legend` (`schema/enums/claim-status.yaml`).
2. **Scope and perspectives.** Sunni Islam is the museum's default and main frame; see `docs/scope.md`. Contested topics must use a `perspectives` block with the Sunni position(s) first, then the academic view, then any other view the topic needs, each cited and labelled before it is stated. Other views are described accurately and respectfully, never unlabelled and never as targets.
3. **Sensitive content.** Figurative depictions of prophets are never displayed. Relics are shown reverently (`sensitivity: sacred`). Violence is sober history. Living persons: well-sourced public facts only. Kid mode hides `violence`, `mature`, `contested`.
4. **Sourcing.** Every entity has at least one source; every dated fact needs two sources or a flag. Wikipedia/Wikidata are pointers. Hadith cited by collection and number; Qur'an by surah:ayah.
5. **AI assistance.** Drafts carry `status.review: draft` and a provenance note, are verified against two independent sources, and are marked `reviewed` only by a human.
6. **Licensing.** Prose CC BY-SA 4.0, data CC0, code MIT; media only from `schema/enums/licenses.yaml`; link rather than copy by default.
7. **Review.** At least one wing editor; two reviewers from different traditions for contested topics.
