export const ensureMinTotalCost = (cost: number): number =>
  cost === 0 ? 1 : cost;

export const formatCostDecimal = (cost: number): string =>
  cost.toFixed(2);
