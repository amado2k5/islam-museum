# Proposal: Wikipedia as a source of truth (broad rule)

Status: **approved by the founder on 26 October 2026 (all five questions) and applied to `AGENTS.md` and `docs/sources-policy.md`, with the claims register row in A.5.** The public listing of every source and fact (question 4) is not yet built; it needs a build step that reads the ledger.
Previously: **proposal, not applied.** This amends the museum's charter and sources policy. It needs the founder's written approval, labelled `submission-impacting`, and it changes what the DPGA and UNESCO submissions say about sources. Nothing here is in force until that approval is recorded in the charter.

## 1. What is proposed

Wikipedia and Wikidata become sources of truth for facts about books, articles, authors, websites and other items: the author's dates and school, the date and place of a publication, the existence and description of a website, and similar facts. A fact taken from Wikipedia is accepted as it stands in a recorded revision of the article.

Wikipedia is not proposed as a source for the text of a book, article or media file. It holds no copies of such texts, so a copy's text still needs a named edition or a matching source under the rules already in force.

## 2. Wikipedia's own charter and means

Wikipedia has its own rules for reviewing, validating and excluding content. This proposal relies on them, so they are stated here, with the page each comes from (English Wikipedia, read in Chrome on 26 October 2026):

- **Verifiability (WP:V).** Every fact must be attributable to a reliable, published source. A challenged or quoted claim needs an inline citation that directly supports it. Unsourced material may be tagged or removed, and uncited material that is likely to be challenged is removed rather than left in place.
- **Reliable sources (WP:RS).** A source is judged on the work, its creator, the publication and the publisher. Academic and peer-reviewed work is the most reliable. Editors consult a noticeboard when a source's reliability is disputed.
- **Self-published sources (WP:SPS).** Personal sites, blogs, forums and social media are largely not acceptable as third-party sources.
- **Circular citation (WP:CIRCULAR).** Wikipedia may not cite itself or sites that mirror it. Each fact must trace back to a reliable source outside Wikipedia.
- **Exceptional claims (WP:ECREE).** A surprising or significant claim needs multiple high-quality sources, and claims challenged by primary or self-published sources alone need extra caution.
- **No original research (NOR).** Editors may not draw new conclusions from sources; a claim must be stated in a source.
- **Neutral point of view (NPOV).** Significant views are presented in proportion, with attribution, and disputes are shown rather than resolved by editors' preference.
- **Dispute and review.** Talk pages, the reliable sources noticeboard, administrators, page protection, and the full revision history. Every change is recorded and can be reverted.

These mechanisms are real, and they are the reason a Wikipedia statement that cites a reliable source is worth more than an uncited one. They do not make a Wikipedia statement true on its own, and Wikipedia says so in its own policy.

## 3. The rule we would adopt

1. A fact taken from Wikipedia or Wikidata is accepted only if, at the revision recorded in the ledger:
   - the article cites a source for it, and the citation is not tagged as needed or failed verification;
   - the fact is not marked as disputed in the article; and
   - the citation is to a source the museum can itself reach or confirm.
2. The ledger records, for each such fact: the article title, the revision ID, the date checked, and the cited source.
3. Validation does not expire. A recorded fact can be revisited and reaffirmed by the founder at any time, and the ledger records each reaffirmation with its date.
4. Facts about the authenticity of a text (the copy's edition, its numbering, its match with a named edition) are never taken from Wikipedia. Those still need a T1 edition or a sample check.
5. A Wikipedia fact that conflicts with a T1 or T2 source is reported to the founder. The T1 or T2 source is preferred.

## 4. What changes in the charter and policy

- `AGENTS.md`: the rule that Wikipedia and Wikidata are pointers, not sources, changes to the rule above.
- `docs/sources-policy.md`: the same change, and the tier table in `docs/delegation/web-sources-rules.md` moves Wikipedia from T4 to a fact-source tier with the conditions above.
- `docs/delegation/authenticity-policy-proposal.md` and the two-source rule for school and era: a Wikipedia infobox may be one of the two sources once the conditions in section 3 hold.
- `docs/outreach/dpga-evidence-map.md` and the UNESCO claims register (A.5): the description of sources changes, and the change is labelled `submission-impacting`.
- The harvest gate and the register validator: a new source type, "wikipedia-fact", with the revision and the expiry fields.

## 5. Risks

- Wikipedia's content changes and can be vandalised. The revision ID and the expiry limit this, but do not remove it.
- Contested topics, especially sect and history, depend on editors' consensus. Those facts need the NPOV labelling the museum already applies to perspectives.
- A reader may take "Wikipedia says" as "the museum says". The public page must say which facts come from Wikipedia and show the revision.
- If the submissions are judged against the old charter, the change has to be explained, not hidden.

## 6. Founder decisions

Recorded 26 October 2026, in the founder's words:

1. **Approved:** the rule in section 3 as a charter change, in writing.
2. **Scope:** Wikipedia and Wikidata are used to validate entity facts: URLs, websites, author names, book names, locations, and similar identifiers. They are not used for prose or the content of a work. This narrows section 1 of this proposal: "texts" means prose and content, and it is excluded.

3. **Validation does not expire.** A recorded fact can be revisited and reaffirmed by the founder at any time, and each reaffirmation is recorded in the ledger with its date. This replaces the one-year expiry in section 3.

4. **Public listing: yes.** The public page lists everything used to decide what the museum includes: the sources, and each Wikipedia- or Wikidata-sourced fact with its revision and date. The museum is transparent by nature. This makes the page a live view of the ledger, so the page itself needs a build step to read the ledger.

Still open: question 5 (the `submission-impacting` label and the claims register in one commit). The charter change is not applied until that is answered.

## 7. Decisions still open for the founder

1. Approve the rule in section 3, in writing, as a charter change.
2. Confirm that texts are excluded (section 3, point 4).
3. Confirm the one-year expiry (section 3, point 3).
4. Decide whether the public page should list each Wikipedia-sourced fact or only say that such facts exist and point to the ledger.
5. Approve the submission-impacting label for the charter change and the claims register update in the same commit.
