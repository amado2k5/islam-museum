// Authored scenarios. Each is a starting district, a number of seasons, and what "a flourishing district" means.
import { plotOf, type Scenario } from "./rules";

/**
 * The first scenario: an inherited district with an old, silted canal, two farms, four houses and a thin treasury.
 * Six years. The water network cannot carry both more farms and more people as it stands, and there is not money
 * for everything: canals bring resilience, markets bring coin, schools bring the knowledge that later unlocks both.
 */
export const FAILING_CANAL: Scenario = {
  id: "failing-canal",
  seasons: 24,
  start: {
    treasury: 130,
    grain: 60,
    households: 56,
    intake: 60,
    buildings: [
      [plotOf(2, 1), "house"],
      [plotOf(3, 1), "house"],
      [plotOf(2, 2), "house"],
      [plotOf(4, 2), "house"],
      [plotOf(1, 1), "farm"],
      [plotOf(1, 2), "farm"],
    ],
    canals: [
      [plotOf(1, 0), plotOf(1, 1)],
      [plotOf(1, 1), plotOf(1, 2)],
    ],
  },
  goal: { households: 200, welfare: 62, knowledge: 200, steadySeasons: 4 },
  eventRate: 300,
};

export const SCENARIOS: Record<string, Scenario> = { [FAILING_CANAL.id]: FAILING_CANAL };
