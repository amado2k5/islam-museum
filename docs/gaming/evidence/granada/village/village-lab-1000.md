# Granada, "Water for the Valley": the lab over 1,000 seeds

_`npx tsx --tsconfig tsconfig.json games/granada/tools/village-lab.ts 1000 water-for-the-valley`, 25 November 2026, from `gaming/`. The figures are in `village-lab-1000.json`. A seed decides the weather and how the river runs that year._

6,000 campaigns in 39.7 s. Rule violations: 0. Averages at the end of the scenario:

| Player | Wins | Welfare | Households | Days of food | Dinars | Score | Spoiled | Lost for |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| idle | 0% | 25 | 44 | 0 | 1446 | 614 | 350.3 | q01-water 1000, q02-harvest 1000, q03-reserve 1000, q04-home 1000 |
| mender | 99.5% | 75 | 70 | 21.6 | 421.3 | 1250 | 0 | reserve 5 |
| builder | 91.6% | 74.7 | 80 | 23.5 | 1927 | 1457.2 | 0 | reserve 84 |
| merchant | 91.4% | 74.6 | 80 | 20.6 | 1955.6 | 1443.5 | 0 | reserve 86 |
| irrigator | 100% | 75 | 80 | 28.1 | 2052.9 | 1495.6 | 0 | - |
| random | 0% | 32.3 | 64.1 | 0.5 | 611.3 | 706.8 | 157.1 | reserve 999, welfare 902, q05-granary 619, q03-reserve 587 |

Findings the lab printed:

- mender wins 99.5% of campaigns: it cannot lose
- irrigator wins 100% of campaigns: it cannot lose
