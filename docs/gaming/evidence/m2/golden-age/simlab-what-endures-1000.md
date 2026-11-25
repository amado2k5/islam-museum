# The Golden Age, chapter 3: the simulation lab over 1,000 seeds

_Captured output of `npx tsx tools/simlab.ts 1000 what-endures`, 25 November 2026. The same run's figures are in `simlab-what-endures-1000.json`. Kept as Markdown because the repository ignores `.log` and `.txt` files._

```text
what-endures: 14000 campaigns (1000 seeds x 14 players) in 15882 ms
player          win%   mean score (min-max)   households  welfare  learned  treasury   ended  insolvent  unrest
irrigator       37.6     794 (630-1000)            508       69      737       115     624          0       0
merchant       100.0    1000 (1000-1000)           489       73      746      1526       0          0       0
scholar         74.0     870 (577-1000)            505       70      828       149     260          0       0
balanced        41.5     972 (874-1000)            528       63      824       208     585          0       0
idle             0.0     652 (639-654)             204       60      250      1264    1000          0       0
tax-only         0.0     621 (608-623)             180       53      250      1637    1000          0       0
only-house       0.0     837 (733-929)             304       50      481       841    1000          0       0
only-farm        0.0     629 (619-630)             204       65      216       811    1000          0       0
only-market      0.0     662 (631-662)             204       68      250       257    1000          0       0
only-workshop    0.0     579 (321-625)             204       66      248        27     989         11       0
only-school      0.0     700 (607-768)             204       70      815        32     996          4       0
only-bath        0.0     460 (314-579)             264       70      250        33     999          1       0
only-granary     0.0     658 (640-662)             204       62      250        35    1000          0       0
random           0.0     728 (466-894)             228       62      385       933     996          4       0
FINDINGS (2):
- merchant wins 100% of campaigns: the scenario is too easy for it to be a decision
- merchant ends with 1526 coins on average, more than five times the starting treasury: money piles up with nothing to spend it on
```
