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

/**
 * The second chapter: the canal holds and the district is fed, and now it is asked to become a place of learning.
 * Five years. Paper has reached the district, so the library can be built from the first season, but schools and
 * libraries cost upkeep every season and employ few, while more than half the households have no work. Learning
 * has to be paid for by something, and the people kept fed and content while it is. The canal carries less than a
 * district twice the size will need: lined canals and the water wheel, which are themselves learning, are how it
 * gets more.
 *
 * The numbers were chosen in the simulation lab (two sweeps of start and goal, 25 November 2026) as the point where
 * all four scripted strategies win at least one campaign in five and none wins nine in ten.
 */
export const HOUSE_OF_BOOKS: Scenario = {
  id: "house-of-books",
  seasons: 20,
  start: {
    treasury: 110,
    grain: 120,
    households: 130,
    intake: 80,
    canalCondition: 1000,
    researched: ["paper"],
    buildings: [
      [plotOf(0, 0), "granary"],
      [plotOf(2, 0), "farm"],
      [plotOf(3, 0), "farm"],
      [plotOf(0, 1), "farm"],
      [plotOf(0, 2), "farm"],
      [plotOf(0, 3), "farm"],
      [plotOf(2, 1), "school"],
      [plotOf(3, 1), "bath"],
      [plotOf(4, 1), "market"],
      [plotOf(5, 1), "house"],
      [plotOf(2, 2), "house"],
      [plotOf(3, 2), "house"],
      [plotOf(4, 2), "house"],
      [plotOf(2, 3), "house"],
      [plotOf(1, 4), "house"],
    ],
    canals: [
      [plotOf(1, 0), plotOf(1, 1)],
      [plotOf(1, 1), plotOf(1, 2)],
      [plotOf(1, 2), plotOf(1, 3)],
      [plotOf(1, 1), plotOf(2, 1)],
      [plotOf(2, 1), plotOf(3, 1)],
      [plotOf(3, 1), plotOf(4, 1)],
    ],
  },
  goal: { households: 280, welfare: 66, knowledge: 480, steadySeasons: 4 },
  eventRate: 300,
};

/**
 * The third chapter: the district is prosperous, and fevers come with the caravans. What a good year builds a bad
 * year can undo, so the steward is asked to make its welfare last: to endow its public buildings, so that they
 * stand whatever the treasury does. Five years.
 *
 * It is the first chapter with a rule of its own. A school, bath, library or hospital can be endowed: a sum is set
 * aside for ever, its upkeep is paid from then on, and it can no longer be cleared. Wealth, which piled up unused
 * in the second chapter, is what endowments are made of, and the chapter cannot be won without making them.
 *
 * Numbers from the simulation lab (four sweeps, 25 November 2026). All four scripted strategies win at least two
 * campaigns in five, but the merchant wins every one and still ends rich: at no price tried that left the other
 * strategies alive was an endowment a real drain on a trading city. A levy on every household was tried as well
 * and left only the merchant able to win, so it was not kept. See docs/gaming/games/golden-age.md.
 */
export const WHAT_ENDURES: Scenario = {
  id: "what-endures",
  seasons: 20,
  endowments: true,
  // Fever is the common event here; drought and silt are rarer than in the first two chapters.
  eventRate: 450,
  eventWeights: [14, 14, 22, 10, 40],
  start: {
    treasury: 140,
    grain: 150,
    households: 180,
    intake: 120,
    canalCondition: 1000,
    researched: ["paper", "lined-canals"],
    buildings: [
      [plotOf(0, 0), "granary"],
      [plotOf(2, 0), "farm"],
      [plotOf(3, 0), "farm"],
      [plotOf(4, 0), "farm"],
      [plotOf(5, 0), "farm"],
      [plotOf(0, 1), "farm"],
      [plotOf(0, 2), "farm"],
      [plotOf(0, 3), "farm"],
      [plotOf(2, 1), "school"],
      [plotOf(3, 1), "bath"],
      [plotOf(5, 1), "workshop"],
      [plotOf(6, 1), "house"],
      [plotOf(2, 2), "house"],
      [plotOf(3, 2), "house"],
      [plotOf(5, 2), "house"],
      [plotOf(6, 2), "house"],
      [plotOf(2, 3), "library"],
      [plotOf(3, 3), "market"],
      [plotOf(5, 3), "house"],
      [plotOf(1, 4), "house"],
      [plotOf(3, 4), "house"],
      [plotOf(4, 4), "house"],
    ],
    canals: [
      [plotOf(1, 0), plotOf(1, 1)],
      [plotOf(1, 1), plotOf(1, 2)],
      [plotOf(1, 2), plotOf(1, 3)],
      [plotOf(1, 1), plotOf(2, 1)],
      [plotOf(2, 1), plotOf(3, 1)],
      [plotOf(3, 1), plotOf(4, 1)],
      [plotOf(4, 1), plotOf(5, 1)],
      [plotOf(4, 1), plotOf(4, 2)],
      [plotOf(4, 2), plotOf(4, 3)],
    ],
  },
  goal: { households: 380, welfare: 64, knowledge: 520, steadySeasons: 4, endowments: 4 },
};

/** The campaign, in order. A chapter starts from its own authored district, not from the player's last one. */
export const CHAPTERS: Scenario[] = [FAILING_CANAL, HOUSE_OF_BOOKS, WHAT_ENDURES];
export const SCENARIOS: Record<string, Scenario> = Object.fromEntries(CHAPTERS.map((s) => [s.id, s]));
