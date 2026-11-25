# The Golden Age, chapter 1: the simulation lab over 1,000 seeds

_Captured output of `npx tsx tools/simlab.ts 1000`, 25 November 2026. The same run's figures are in `simlab-failing-canal-1000.json`. Kept as Markdown because the repository ignores `.log` and `.txt` files._

```text
failing-canal: 14000 campaigns (1000 seeds x 14 players) in 10967 ms
player          win%   mean score (min-max)   households  welfare  learned  treasury   ended  insolvent  unrest
irrigator       12.3     860 (627-1000)            254       61      261        56     877          0       0
merchant        31.2     975 (675-1000)            345       61      349       275     688          0       0
scholar         14.6     642 (518-769)             228       60      231        60     854          0       0
balanced        73.4     759 (617-1000)            322       65      274        95     266          0       0
idle             0.0     352 (339-353)              56       52        0       366    1000          0       0
tax-only         0.0     333 (320-334)              56       45        0       486    1000          0       0
only-house       0.0     195 (107-240)              48       48        0        17    1000          0       0
only-farm        0.0     246 (209-277)              80       58        0         0     791        209       0
only-market      0.0     240 (194-275)              74       60        0        21    1000          0       0
only-workshop    0.0     216 (186-254)              77       54        0         7    1000          0       0
only-school      0.0     405 (306-547)              78       56      195         1     670        330       0
only-bath        0.0     219 (170-269)              83       51        0        14     945         55       0
only-granary     0.0     358 (345-358)              56       54        0         3    1000          0       0
random           0.0     372 (130-831)              90       54       38        49     795        205       0
FINDINGS (1):
- only 2 of 4 real strategies win at least one campaign in five: irrigator 12.3%, merchant 31.2%, scholar 14.6%, balanced 73.4%
```
