// Ported from mobile core/utils/utilities/constantUtils.ts.
export class ConstantsUtils {
  static readonly marketAdminUserId = "9CdfyBf8mVdDk99ynT09XJ4ZJAT2";
  static readonly pageSize = 5;
  static readonly financeSectorId = "sector-finance-000";
  static readonly healthFitnessSectorId = "sector-health-fitness-000";
  static readonly lifestyleRecreationSectorId = "sector-lifestyle-recreation-000";
  static readonly personalGrowthSectorId = "sector-personal-growth-000";
  static readonly productivitySectorId = "sector-productivity-000";
  static readonly relationshipsSectorId = "sector-relationships-000";
}

// The named sector sections mobile's HabitMarketScreen renders, in order.
export const MARKET_SECTIONS = [
  { sectorId: ConstantsUtils.financeSectorId, title: "Finance" },
  { sectorId: ConstantsUtils.healthFitnessSectorId, title: "Health and Fitness" },
  { sectorId: ConstantsUtils.lifestyleRecreationSectorId, title: "Lifestyle and Recreation" },
  { sectorId: ConstantsUtils.personalGrowthSectorId, title: "Personal Growth" },
  { sectorId: ConstantsUtils.productivitySectorId, title: "Productivity" },
  { sectorId: ConstantsUtils.relationshipsSectorId, title: "Relationships" },
] as const;
