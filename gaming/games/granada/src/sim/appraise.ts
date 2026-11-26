// The sums a panel shows before the player commits: what a harvest is worth, what a contract really pays, how far
// the reserves are from the target. Pure arithmetic over minor units, kept apart from the ledger so that the screen
// and the tests read the same figures, and so that every figure names its condition instead of promising a result.
//
// These are the corrections the Granada package asks for (docs/gaming/spec-granada/04-ECONOMY-AND-SIMULATION.md):
// a raw crop is valued at the raw bid, never at the price of what it could become; a harvest larger than the room
// for it says so; a contract filled with bought goods is costed at what they cost to buy.

export interface Quote {
  /** The player buys at this price. */
  ask: number;
  /** The player sells at this price. */
  bid: number;
}

/** Buying and selling straight back at one market. `net` is never above zero while ask is not below bid. */
export function roundTrip(q: Quote, quantity: number): { buyCost: number; saleRevenue: number; net: number } {
  const buyCost = q.ask * quantity;
  const saleRevenue = q.bid * quantity;
  return { buyCost, saleRevenue, net: saleRevenue - buyCost };
}

export interface HarvestForecast {
  expected: number;
  free: number;
  /** Units there is room for. */
  fits: number;
  /** Units with nowhere to go unless the player decides something. */
  overflow: number;
  /** Gross if every unit were accepted at the raw bid. A condition, not a promise: demand is finite. */
  grossIfAllSold: number;
  /** Gross if only what fits is sold at the raw bid. */
  grossIfStoredOnly: number;
}
export function harvestForecast(expected: number, free: number, rawBid: number): HarvestForecast {
  const fits = Math.max(0, Math.min(expected, free));
  return { expected, free, fits, overflow: expected - fits, grossIfAllSold: expected * rawBid, grossIfStoredOnly: fits * rawBid };
}

/** What a raw quantity becomes through a recipe that takes `rawPerUnit` of it for each unit made. */
export function processingForecast(raw: number, rawPerUnit: number, productBid: number): { units: number; rawLeftOver: number; grossAtBid: number } {
  const units = Math.floor(raw / rawPerUnit);
  return { units, rawLeftOver: raw - units * rawPerUnit, grossAtBid: units * productBid };
}

export interface ContractTerms {
  units: number;
  revenue: number;
  transport: number;
  fees: number;
}
export interface ContractAppraisal {
  /** Money that actually moves if the goods are already in hand: revenue less the new costs. */
  cashMovement: number;
  /** The same, less what the goods cost to make. Cost already spent is sunk: it does not move again. */
  accountingProfit: number;
  /** Selling the same units at the local bid instead. */
  localGross: number;
  localMargin: number;
  /** How much better the contract is than the local sale, before risk. */
  incrementalAdvantage: number;
  /** Filling the contract with goods bought at the local ask. */
  purchaseCost: number;
  profitIfPurchased: number;
}
export function appraiseContract(c: ContractTerms, costBasis: number, local: Quote): ContractAppraisal {
  const cashMovement = c.revenue - c.transport - c.fees;
  const localGross = local.bid * c.units;
  const purchaseCost = local.ask * c.units;
  return {
    cashMovement,
    accountingProfit: cashMovement - costBasis,
    localGross,
    localMargin: localGross - costBasis,
    incrementalAdvantage: cashMovement - localGross,
    purchaseCost,
    profitIfPurchased: cashMovement - purchaseCost,
  };
}

export interface ReserveStatus {
  shortfall: number;
  /** Whole percent of the target reached, rounded down so that 99.9% never reads as met. */
  percentOfTarget: number;
  meetsTarget: boolean;
}
export function reserveStatus(current: number, target: number): ReserveStatus {
  return { shortfall: Math.max(0, target - current), percentOfTarget: target <= 0 ? 100 : Math.floor((current * 100) / target), meetsTarget: current >= target };
}
