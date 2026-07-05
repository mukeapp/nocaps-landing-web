import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IHabitIntelligenceCostState {
  /** Credit cost to swap a single habit-link item */
  swapCostPerItem: number;
  /** Credit cost to AI-score a single habit-link item */
  scorerCostPerItem: number;
  /** Credit cost to AI-generate a single habit-link item */
  generateHabitLinkItemCost: number;
  /** Credit cost to AI-generate a habit link */
  generateHabitLinkCost: number;
  /** Credit cost to AI-generate a habit */
  generateHabitCost: number;
  /** Credit cost to AI-generate a habit stack */
  generateHabitStackCost: number;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: IHabitIntelligenceCostState = {
  swapCostPerItem: 50,
  scorerCostPerItem: 10,
  generateHabitLinkItemCost: 50,
  generateHabitLinkCost: 100,
  generateHabitCost: 200,
  generateHabitStackCost: 250,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const HabitIntelligenceCost = createSlice({
  name: "habitIntelligenceCost",
  initialState,
  reducers: {
    setSwapCostPerItem: (state, action: PayloadAction<number>) => {
      state.swapCostPerItem = action.payload;
    },
    setScorerCostPerItem: (state, action: PayloadAction<number>) => {
      state.scorerCostPerItem = action.payload;
    },
    setGenerateHabitLinkItemCost: (state, action: PayloadAction<number>) => {
      state.generateHabitLinkItemCost = action.payload;
    },
    setGenerateHabitLinkCost: (state, action: PayloadAction<number>) => {
      state.generateHabitLinkCost = action.payload;
    },
    setGenerateHabitCost: (state, action: PayloadAction<number>) => {
      state.generateHabitCost = action.payload;
    },
    setGenerateHabitStackCost: (state, action: PayloadAction<number>) => {
      state.generateHabitStackCost = action.payload;
    },
    setCosts: (
      state,
      action: PayloadAction<Array<{ id: string; value: number }>>,
    ) => {
      const map: Record<string, number> = {};
      for (const item of action.payload) {
        map[item.id] = item.value;
      }
      if (map.swapCostPerItem !== undefined)
        state.swapCostPerItem = map.swapCostPerItem;
      if (map.scorerCostPerItem !== undefined)
        state.scorerCostPerItem = map.scorerCostPerItem;
      if (map.generateHabitLinkItemCost !== undefined)
        state.generateHabitLinkItemCost = map.generateHabitLinkItemCost;
      if (map.generateHabitLinkCost !== undefined)
        state.generateHabitLinkCost = map.generateHabitLinkCost;
      if (map.generateHabitCost !== undefined)
        state.generateHabitCost = map.generateHabitCost;
      if (map.generateHabitStackCost !== undefined)
        state.generateHabitStackCost = map.generateHabitStackCost;
    },
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
  setSwapCostPerItem,
  setScorerCostPerItem,
  setGenerateHabitLinkItemCost,
  setGenerateHabitLinkCost,
  setGenerateHabitCost,
  setGenerateHabitStackCost,
  setCosts,
} = HabitIntelligenceCost.actions;

export const HabitIntelligenceCostAction = HabitIntelligenceCost.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectSwapCostPerItem = (state: {
  habitIntelligenceCost: IHabitIntelligenceCostState;
}): number => state.habitIntelligenceCost.swapCostPerItem;

export const selectScorerCostPerItem = (state: {
  habitIntelligenceCost: IHabitIntelligenceCostState;
}): number => state.habitIntelligenceCost.scorerCostPerItem;

export const selectGenerateHabitLinkItemCost = (state: {
  habitIntelligenceCost: IHabitIntelligenceCostState;
}): number => state.habitIntelligenceCost.generateHabitLinkItemCost;

export const selectGenerateHabitLinkCost = (state: {
  habitIntelligenceCost: IHabitIntelligenceCostState;
}): number => state.habitIntelligenceCost.generateHabitLinkCost;

export const selectGenerateHabitCost = (state: {
  habitIntelligenceCost: IHabitIntelligenceCostState;
}): number => state.habitIntelligenceCost.generateHabitCost;

export const selectGenerateHabitStackCost = (state: {
  habitIntelligenceCost: IHabitIntelligenceCostState;
}): number => state.habitIntelligenceCost.generateHabitStackCost;

export default HabitIntelligenceCost;
