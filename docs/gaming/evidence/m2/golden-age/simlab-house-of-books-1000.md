# The Golden Age, chapter 2: the simulation lab over 1,000 seeds

_Captured output of `npx tsx tools/simlab.ts 1000 house-of-books`, 25 November 2026. The same run's figures are in `simlab-house-of-books-1000.json`. Kept as Markdown because the repository ignores `.log` and `.txt` files._

```text
house-of-books: 14000 campaigns (1000 seeds x 14 players) in 14909 ms
player          win%   mean score (min-max)   households  welfare  learned  treasury   ended  insolvent  unrest
irrigator       24.0     780 (651-991)             507       68      461       101     760          0       0
merchant        78.3     996 (821-1000)            489       71      572       699     217          0       0
scholar         32.7     671 (477-815)             479       66      500        72     673          0       0
balanced        71.4     981 (704-1000)            497       66      614       252     286          0       0
idle             0.0     732 (608-734)             168       68      290       747    1000          0       0
tax-only         0.0     720 (590-723)             168       61      290      1080    1000          0       0
only-house       0.0     696 (325-833)             204       47      345       151    1000          0       0
only-farm        0.0     638 (521-671)             168       71      209        67     946         54       0
only-market      0.0     665 (390-728)             168       78      287        37    1000          0       0
only-workshop    0.0     556 (289-710)             167       74      277        32     996          4       0
only-school      0.0     704 (349-760)             168       72      395        38    1000          0       0
only-bath        0.0     480 (332-688)             190       69      286        29    1000          0       0
only-granary     0.0     730 (368-734)             168       70      290        27    1000          0       0
random           0.0     753 (371-928)             190       67      347       336     980         20       0
FINDINGS (1):
- merchant ends with 699 coins on average, more than five times the starting treasury: money piles up with nothing to spend it on
```
