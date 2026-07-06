/**
 * AI Models Registry — Redux slice
 *
 * Stores AI model metadata (cost multipliers, context windows, visibility flags).
 * Initial state mirrors the hardcoded registry; dispatch setAICompanies to
 * apply backend-driven updates at runtime.
 *
 * noCapCostMultiplier is relative to claude-sonnet-4-6 (base = 1.0).
 *
 * Default company: Anthropic
 * Default model:   claude-sonnet-4-6
 *
 * Last verified: May 2026
 */

import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AIModel {
  id: string;
  name: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  contextWindow: string;
  isDefault: boolean;
  costMultiplier: number;
  /** Cost multiplier relative to claude-sonnet-4-6 (base = 1.0) for NoCap AI credit calculations */
  noCapCostMultiplier: number;
  description: string;
  isVisible?: boolean;
}

export interface AICompany {
  name: string;
  website: string;
  isDefault: boolean;
  isVisible?: boolean;
  models: AIModel[];
}

export interface IAIModelsCostMultiplierState {
  companies: AICompany[];
}

// ── Registry ───────────────────────────────────────────────────────────────────

export const AI_COMPANIES: AICompany[] = [
  {
    name: "Anthropic",
    website: "https://anthropic.com",
    isDefault: true,
    isVisible: true,
    models: [
      {
        id: "claude-opus-4-6",
        name: "Claude Opus 4.6",
        inputCostPer1M: 5.0,
        outputCostPer1M: 25.0,
        contextWindow: "1M tokens",
        isDefault: false,
        costMultiplier: 1.67,
        noCapCostMultiplier: 1.67,
        description: "Most capable model. Best for complex reasoning, coding agents, and long-horizon tasks.",
        isVisible: true,
      },
      {
        id: "claude-sonnet-4-6",
        name: "Claude Sonnet 4.6",
        inputCostPer1M: 3.0,
        outputCostPer1M: 15.0,
        contextWindow: "1M tokens",
        isDefault: true,
        costMultiplier: 1.0,
        noCapCostMultiplier: 1.0,
        description: "Balanced price-to-performance. NoCap AI default model for all operations.",
        isVisible: true,
      },
      {
        id: "claude-haiku-4-5-20251001",
        name: "Claude Haiku 4.5",
        inputCostPer1M: 1.0,
        outputCostPer1M: 5.0,
        contextWindow: "200K tokens",
        isDefault: false,
        costMultiplier: 0.33,
        noCapCostMultiplier: 0.33,
        description: "Fastest and cheapest. Ideal for high-volume, latency-sensitive workloads.",
        isVisible: true,
      },
    ],
  },
  {
    name: "OpenAI",
    website: "https://openai.com",
    isDefault: false,
    isVisible: false,
    models: [
      {
        id: "gpt-5.5",
        name: "GPT-5.5",
        inputCostPer1M: 5.0,
        outputCostPer1M: 30.0,
        contextWindow: "1M tokens",
        isDefault: false,
        costMultiplier: 2.0,
        noCapCostMultiplier: 1.94,
        description: "Newest flagship. Best for hardest coding, agentic tasks, and complex reasoning.",
      },
      {
        id: "gpt-5.4",
        name: "GPT-5.4",
        inputCostPer1M: 2.5,
        outputCostPer1M: 15.0,
        contextWindow: "1M tokens",
        isDefault: true,
        costMultiplier: 1.0,
        noCapCostMultiplier: 0.97,
        description: "Recommended production workhorse. Strong balance of capability and cost.",
      },
      {
        id: "gpt-5.4-mini",
        name: "GPT-5.4 Mini",
        inputCostPer1M: 0.75,
        outputCostPer1M: 4.5,
        contextWindow: "1M tokens",
        isDefault: false,
        costMultiplier: 0.3,
        noCapCostMultiplier: 0.29,
        description: "Competitive mid-tier model. Great for chatbots, support, and lighter workloads.",
      },
    ],
  },
  {
    name: "Google",
    website: "https://ai.google.dev",
    isDefault: false,
    isVisible: false,
    models: [
      {
        id: "gemini-3.1-pro",
        name: "Gemini 3.1 Pro",
        inputCostPer1M: 2.0,
        outputCostPer1M: 12.0,
        contextWindow: "2M tokens",
        isDefault: false,
        costMultiplier: 1.6,
        noCapCostMultiplier: 0.78,
        description: "Flagship reasoning model. Largest context window in the industry (2M). Paid-only since April 2026.",
        isVisible: false,
      },
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        inputCostPer1M: 1.25,
        outputCostPer1M: 10.0,
        contextWindow: "1M tokens",
        isDefault: true,
        costMultiplier: 1.0,
        noCapCostMultiplier: 0.63,
        description: "Proven production model. Strong multimodal capabilities at a competitive price.",
        isVisible: false,
      },
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        inputCostPer1M: 0.3,
        outputCostPer1M: 2.5,
        contextWindow: "1M tokens",
        isDefault: false,
        costMultiplier: 0.24,
        noCapCostMultiplier: 0.16,
        description: "Fast and cheap. Excellent quality-per-dollar for mid-tier workloads.",
        isVisible: false,
      },
    ],
  },
  {
    name: "DeepSeek",
    website: "https://deepseek.com",
    isDefault: false,
    isVisible: true,
    models: [
      {
        id: "deepseek-v4-pro",
        name: "DeepSeek V4 Pro",
        inputCostPer1M: 1.74,
        outputCostPer1M: 3.48,
        contextWindow: "1M tokens",
        isDefault: false,
        costMultiplier: 12.43,
        noCapCostMultiplier: 0.29,
        description: "1.6T parameter flagship. 75% promo until May 31, 2026 ($0.435/$0.87). Strongest reasoning.",
        isVisible: true,
      },
      {
        id: "deepseek-v4-flash",
        name: "DeepSeek V4 Flash",
        inputCostPer1M: 0.14,
        outputCostPer1M: 0.28,
        contextWindow: "1M tokens",
        isDefault: true,
        costMultiplier: 1.0,
        noCapCostMultiplier: 0.023,
        description: "Default model. Absurdly cheap. Frontier-class performance at budget pricing.",
        isVisible: true,
      },
    ],
  },
];

// ── Initial State ──────────────────────────────────────────────────────────────

const initialState: IAIModelsCostMultiplierState = {
  companies: AI_COMPANIES,
};

// ── Slice ──────────────────────────────────────────────────────────────────────

const AIModelsCostMultiplier = createSlice({
  name: "aiModelsCostMultiplier",
  initialState,
  reducers: {
    /** Replace the full companies list (e.g. after a backend sync). */
    setAICompanies: (state, action: PayloadAction<AICompany[]>) => {
      state.companies = action.payload;
    },
  },
});

// ── Actions ────────────────────────────────────────────────────────────────────

export const {setAICompanies} = AIModelsCostMultiplier.actions;
export const AIModelsCostMultiplierAction = AIModelsCostMultiplier.actions;

// ── Selectors ──────────────────────────────────────────────────────────────────

export const selectAICompanies = (state: {
  aiModelsCostMultiplier: IAIModelsCostMultiplierState;
}): AICompany[] => state.aiModelsCostMultiplier.companies;

export const selectVisibleCompanies = createSelector(
  selectAICompanies,
  (companies) => companies.filter(c => c.isVisible !== false),
);

export const makeSelectCompanyModels = (companyName: string) =>
  createSelector(selectAICompanies, (companies) => {
    const company = companies.find(c => c.name === companyName);
    return (company?.models ?? []).filter(m => m.isVisible !== false);
  });

export const makeSelectDefaultModel = (companyName: string) =>
  createSelector(selectAICompanies, (companies) => {
    const company = companies.find(c => c.name === companyName);
    const models = (company?.models ?? []).filter(m => m.isVisible !== false);
    return models.find(m => m.isDefault) ?? models[0];
  });

export const makeSelectModelById = (modelId: string) =>
  createSelector(selectAICompanies, (companies) =>
    companies.flatMap(c => c.models).find(m => m.id === modelId),
  );

export const selectDefaultSelection = createSelector(
  selectAICompanies,
  (companies) => {
    const defaultCompany = companies.find(c => c.isDefault) ?? companies[0];
    const models = (defaultCompany?.models ?? []).filter(m => m.isVisible !== false);
    const defaultModel = models.find(m => m.isDefault) ?? models[0];
    return {
      companyName: defaultCompany?.name ?? "",
      modelId: defaultModel?.id ?? "",
    };
  },
);

export default AIModelsCostMultiplier;
