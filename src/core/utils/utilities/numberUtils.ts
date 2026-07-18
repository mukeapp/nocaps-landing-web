
/*

// formatCost - Returns STRING with K/M suffixes
formatCost(1500)                  // "1.50K"
formatCost(1500000)               // "1.50M"
formatCost(500.567)               // "500.57"
formatCost(500.567, false)        // "501"

// formatCostAsNumber - Returns NUMBER without K/M
formatCostAsNumber(1500)          // 1500
formatCostAsNumber(1500000)       // 1500000
formatCostAsNumber(500.567)       // 500.57
formatCostAsNumber(500.567, false) // 501

*/


// Method 1: Returns formatted string (with K, M suffixes)
export const formatCost = (cost?: number, showDecimals: boolean = true): string => {
  const shouldShowDecimals = showDecimals ?? true;

  if (!cost) return shouldShowDecimals ? "0.00" : "0";

  const value = cost;

  // If >= 1 million, show as M (e.g., $1.20M or $1M)
  if (value >= 1000000) {
    return shouldShowDecimals
      ? `${(value / 1000000).toFixed(2)}M`
      : `${Math.round(value / 1000000)}M`;
  }

  // If >= 1000, show as K (e.g., $12.50K or $13K)
  if (value >= 1000) {
    return shouldShowDecimals
      ? `${(value / 1000).toFixed(2)}K`
      : `${Math.round(value / 1000)}K`;
  }

  // Otherwise show full number with or without decimals
  return shouldShowDecimals
    ? value.toFixed(2)
    : Math.round(value).toString();
};

// Method 2: Returns number (no K, M suffixes, original value)
export const formatCostAsNumber = (cost?: number, showDecimals: boolean = true): number => {
  if (!cost) return 0;

  return showDecimals
    ? parseFloat(cost.toFixed(2))
    : Math.round(cost);
};

export const formatCostAsNumberWithParamString = (cost?: string, showDecimals: boolean = true): number => {
  if (!cost) return 0;
  const parsed = parseFloat(cost);
  if (isNaN(parsed)) return 0;
  return showDecimals
    ? parseFloat(parsed.toFixed(2))
    : Math.round(parsed);
};

// formatCredits(0)         → "0"
// formatCredits(1000)      → "1,000"
// formatCredits(2000)      → "2,000"
// formatCredits(10000)     → "10K"
// formatCredits(100000)    → "100K"
// formatCredits(1000000)   → "1M"
export const formatCredits = (n: number): string => {
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
  if (n >= 10_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
};