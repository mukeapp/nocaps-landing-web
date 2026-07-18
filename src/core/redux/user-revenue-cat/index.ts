import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RevenueCatPlanId =
  | "free"
  | "go"
  | "plus"
  | "pro"
  | "business"
  | "enterprise";

export type RevenueCatBillingType = "personal" | "business";

export interface IRevenueCatState {
  documentId: string | null;
  id: string | null;
  revenueCatUserId: string | null;
  nocapUserId: string | null;
  planId: RevenueCatPlanId;
  billingType: RevenueCatBillingType;
  /** Total AI credits allocated by the plan each month */
  monthlyCredits: number;
  /** Remaining credits available for AI features this month */
  remainingCredits: number;
  /** true after a successful purchase; false for the free plan */
  isActive: boolean;
  /** ISO date string of the last successful purchase */
  purchasedAt: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
}

export interface SetPurchasedPlanPayload {
  documentId?: string | null;
  id?: string | null;
  revenueCatUserId: string | null;
  nocapUserId: string | null;
  planId: RevenueCatPlanId;
  billingType: RevenueCatBillingType;
  monthlyCredits: number;
  /** Actual remaining credits from the backend. When provided, used verbatim.
   *  When omitted (purchase flow with no prior balance), falls back to monthlyCredits. */
  remainingCredits?: number | null;
  purchasedAt?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: IRevenueCatState = {
  documentId: null,
  id: null,
  revenueCatUserId: null,
  nocapUserId: null,
  planId: "free",
  billingType: "personal",
  monthlyCredits: 0,
  remainingCredits: 0,
  isActive: false,
  purchasedAt: null,
  createdAt: null,
  updatedAt: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const r2 = (n: number): number => parseFloat(n.toFixed(2));

// ─── Slice ────────────────────────────────────────────────────────────────────

const UserRevenueCat = createSlice({
  name: "revenueCat",
  initialState,
  reducers: {
    /**
     * Call after a successful RevenueCat purchase (real or mocked).
     * Sets the active plan and resets remaining credits to the plan's full quota.
     */
    setPurchasedPlan: (
      state,
      action: PayloadAction<SetPurchasedPlanPayload>,
    ) => {
      state.documentId = action.payload.documentId ?? state.documentId ?? null;
      state.id = action.payload.id ?? state.id ?? null;
      state.revenueCatUserId = action.payload.revenueCatUserId;
      state.nocapUserId = action.payload.nocapUserId;
      state.planId = action.payload.planId;
      state.billingType = action.payload.billingType;
      state.monthlyCredits = action.payload.monthlyCredits;
      state.remainingCredits = r2(
        action.payload.remainingCredits != null
          ? action.payload.remainingCredits
          : action.payload.monthlyCredits,
      );
      state.isActive = action.payload.planId !== "free";
      state.purchasedAt =
        action.payload.purchasedAt ?? state.purchasedAt ?? null;
      state.createdAt = action.payload.createdAt ?? state.createdAt ?? null;
      state.updatedAt = action.payload.updatedAt ?? state.updatedAt ?? null;
    },

    /**
     * Deduct credits when the user triggers an AI feature.
     * Defaults to 1 credit. No-ops when already at 0.
     */
    consumeCredits: (state, action: PayloadAction<number | undefined>) => {
      const amount = r2(action.payload ?? 1);
      state.remainingCredits = r2(Math.max(0, state.remainingCredits - amount));
    },

    /**
     * Add a fixed number of credits on top of remainingCredits (top-up).
     * Does not change monthlyCredits.
     */
    addCredits: (state, action: PayloadAction<number>) => {
      state.remainingCredits = r2(state.remainingCredits + action.payload);
    },

    /**
     * Subtract a fixed number of credits from remainingCredits.
     * Clamps to 0 — will not go negative.
     */
    subtractCredits: (state, action: PayloadAction<number>) => {
      state.remainingCredits = r2(Math.max(
        0,
        state.remainingCredits - action.payload,
      ));
    },

    /**
     * Restore remaining credits to the full monthly quota.
     * Call on billing-cycle reset.
     */
    refillCredits: (state) => {
      state.remainingCredits = r2(state.monthlyCredits);
    },

    /**
     * Revert to the free plan defaults.
     * Call on logout or subscription cancellation.
     */
    resetRevenueCat: () => initialState,
    /**
     * Alias for logout flows. Resets all RevenueCat state on user logout.
     */
    setUserRevenuCatLogOut: () => initialState,
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
  setPurchasedPlan,
  addCredits,
  subtractCredits,
  consumeCredits,
  refillCredits,
  resetRevenueCat,
  setUserRevenuCatLogOut,
} = UserRevenueCat.actions;

export const RevenueCatAction = UserRevenueCat.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectRevenueCat = (state: {
  revenueCat: IRevenueCatState;
}): IRevenueCatState => state.revenueCat;

/**
 * Gate any AI feature behind this selector.
 * Returns true when the user has at least one remaining AI credit.
 */
export const selectCanUseAI = (state: {
  revenueCat: IRevenueCatState;
}): boolean => state.revenueCat.remainingCredits > 0;

export const selectMonthlyCredits = (state: {
  revenueCat: IRevenueCatState;
}): number => state.revenueCat.monthlyCredits;

export const selectCurrentPlan = createSelector(
  (state: { revenueCat: IRevenueCatState }) => state.revenueCat.planId,
  (state: { revenueCat: IRevenueCatState }) => state.revenueCat.billingType,
  (
    planId,
    billingType,
  ): { planId: RevenueCatPlanId; billingType: RevenueCatBillingType } => ({
    planId,
    billingType,
  }),
);

export default UserRevenueCat;
