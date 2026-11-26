# Granada, "Water for the Valley": the lab over 1,000 seeds

_`npm --prefix gaming run granada:village-lab -- 1000`, 25 November 2026. The figures are in `village-lab-1000.json`. A seed decides the weather and how the river runs that year. Run again for the eleventh pull request, after one rule changed (a harvested field lies fallow the same day, not the day after); the tenth pull request's figures are in git history and in its ledger row._

6,000 campaigns in 39.4 s. Rule violations: 0. Averages at the end of the scenario:

| Player | Wins | Welfare | Households | Days of food | Dinars | Score | Spoiled | Lost for |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| idle | 0% | 25 | 44 | 0 | 1446 | 614 | 350.3 | q01-water 1000, q02-harvest 1000, q03-reserve 1000, q04-home 1000 |
| mender | 99.5% | 75 | 70 | 21.6 | 421.3 | 1250 | 0 | reserve 5 |
| builder | 91.6% | 74.7 | 80 | 23.5 | 1927 | 1457.2 | 0 | reserve 84 |
| merchant | 96.4% | 74.8 | 80 | 20.6 | 2186.5 | 1469.7 | 0 | reserve 36 |
| irrigator | 100% | 75 | 80 | 28.1 | 2052.9 | 1495.6 | 0 | - |
| random | 0% | 32.3 | 64.1 | 0.5 | 611.3 | 706.8 | 157.1 | reserve 999, welfare 902, q05-granary 619, q03-reserve 587 |

Findings the lab printed:

- mender wins 99.5% of campaigns: it cannot lose
- merchant wins 96.4% of campaigns: it cannot lose
- irrigator wins 100% of campaigns: it cannot lose
