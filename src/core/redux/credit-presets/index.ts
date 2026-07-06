import {ISubscriptionPlanState} from "@/core/redux/subscription-plan";
import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface CreditPreset {
  id: string;
  name: string;
  cost: number;
  description: string;
  color: string;
  purchaseOptionId: string;
  purchaseType: "buy";
}

interface ICreditPresetsState {
  presets: CreditPreset[];
}

const initialState: ICreditPresetsState = {
  presets: [
    {
      id: "credit_starter",
      name: "Starter",
      cost: 5,
      description: "500 credits — Great for a quick boost",
      color: "#22c55e",
      purchaseOptionId: "nocap-credits-starter",
      purchaseType: "buy",
    },
    {
      id: "credit_basic",
      name: "Basic",
      cost: 10,
      description: "1,000 credits — Good for everyday use",
      color: "#3b82f6",
      purchaseOptionId: "nocap-credits-basic",
      purchaseType: "buy",
    },
    {
      id: "credit_plus",
      name: "Plus",
      cost: 20,
      description: "2,000 credits — Most popular",
      color: "#a855f7",
      purchaseOptionId: "nocap-credits-plus",
      purchaseType: "buy",
    },
    {
      id: "credit_pro",
      name: "Pro",
      cost: 50,
      description: "5,000 credits — For power users",
      color: "#eab308",
      purchaseOptionId: "nocap-credits-pro",
      purchaseType: "buy",
    },
    {
      id: "credit_max",
      name: "Max",
      cost: 100,
      description: "10,000 credits — Maximum credits",
      color: "#ef4444",
      purchaseOptionId: "nocap-credits-max",
      purchaseType: "buy",
    },
  ],
};

const CreditPresetsSlice = createSlice({
  name: "creditPresets",
  initialState,
  reducers: {
    setPresets: (state, action: PayloadAction<CreditPreset[]>) => {
      state.presets = action.payload;
    },
  },
});

export const { setPresets } = CreditPresetsSlice.actions;
export const CreditPresetsAction = CreditPresetsSlice.actions;

export const CREDIT_PRESET_DEFAULTS: CreditPreset[] = initialState.presets;

export const selectCreditPresets = (state: {
  creditPresets: ICreditPresetsState;
}): CreditPreset[] => state.creditPresets.presets;

export const selectFreshCreditPresets = (): CreditPreset[] => CREDIT_PRESET_DEFAULTS;

export const selectCreditsPerDollar = createSelector(
  [
    (state: { subscriptionPlan: ISubscriptionPlanState }) =>
      state.subscriptionPlan.plans,
  ],
  (plans) => {
    const go = plans.find((p) => p.id === "go");
    if (!go || go.price === 0) return 100;
    return Math.round(go.credits / go.price);
  },
);

export default CreditPresetsSlice;
