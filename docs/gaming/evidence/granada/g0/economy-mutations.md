# Granada: the economy kernel broken on purpose, one way at a time

_Captured output of `npm --prefix gaming run granada:mutations`, 25 November 2026. Kept as Markdown because the repository ignores `.log` and `.txt` files._

```text
CAUGHT    sell at ask instead of bid: Tests 3 failed | 27 passed (30)
CAUGHT    a repeated command is applied again: Tests 1 failed | 29 passed (30)
CAUGHT    a stale command is accepted: Tests 1 failed | 29 passed (30)
CAUGHT    a market has endless money: Tests 3 failed | 27 passed (30)
CAUGHT    reserved goods can be sold: Tests 2 failed | 28 passed (30)
CAUGHT    a penalty is charged on every advance: Tests 1 failed | 29 passed (30)
CAUGHT    a harvest that does not fit is taken without asking: Tests 1 failed | 29 passed (30)
CAUGHT    a loss is not written down: Tests 1 failed | 29 passed (30)
CAUGHT    each part delivery is rounded on its own: Tests 2 failed | 28 passed (30)
CAUGHT    held cash is released twice: Tests 4 failed | 26 passed (30)
CAUGHT    the state passed in is changed: Tests 7 failed | 23 passed (30)
CAUGHT    the warehouse has no limit: Tests 3 failed | 27 passed (30)
CAUGHT    a contract fails on its last day: Tests 1 failed | 29 passed (30)
CAUGHT    pressed oil forgets what the olives cost: Tests 1 failed | 29 passed (30)
CAUGHT    an expired offer can still be accepted: Tests 1 failed | 29 passed (30)
15 of 15 mutations caught
```
