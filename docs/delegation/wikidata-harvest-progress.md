# Progress: Wikidata harvest (plan 15 §6.1), CC0 layer

Workspace (outside git): `/Volumes/exmicroSD/islam-museum-harvest/layers/cc0/wikidata/`. Tables: `wikidata-subset.duckdb` (wd_entity, wd_label, wd_claim, wd_sitelink, wd_external_id, wd_property).

## Done (12 Oct 2026)
- Dump filtered in two passes and tables built. Pass 1 read 121.9 M lines; pass 2 kept 2,461 outgoing neighbours (needed: 0).
- Checks on the tables: all 1,074 original seeds present; 580 seeds have an Arabic label; 18,261 entities.
- `wd_property` table added: 4,081 property labels fetched from the Wikidata API (3,421 with an Arabic label). The filter's own property branch kept none, so this table is the source for property names.
- Seed queries q06 (battles and wars with a participant in the Islam tree), q07 (treaties) and q08 (mosques with religion Islam) run. Results: q06 1 item, q07 0 items, q08 5,000 items (the query's LIMIT cap was hit, so the mosque list is incomplete). Seeds now 6,075 distinct QIDs. Class IDs verified against live labels.
- `scripts/harvest/wikidata/lookup.py`: local read path (QID view with resolved property labels, Arabic search). Replaces live lookups.

## Open
- **Rebuild needed** to pull the new seeds' neighbours into the subset: two full passes over the 96 GiB dump (hours, heavy disk and CPU). Not started, since it competes with the Ibn Sa'd extraction. Decide when to run it.
- **Filter bug:** property entities are not written (`filter_dump.py` pass 1 claims to keep them). Worked around with `wd_property`; fix in the filter before the next rebuild.
- **Dump deletion:** the 103 GB `latest-all.json.bz2` can be deleted now that the tables exist (plan 15 §6.1). Waiting for the founder's go-ahead.
- **Conflicts and treaties are thin:** q06 and q07 return almost nothing with the participant rule. Plan 15 §6.1 asks for all sides of a conflict; a second query (conflict to location or date, or to Companions' campaigns) is needed.
- Quarterly refresh and the weekly change job are not scheduled.
