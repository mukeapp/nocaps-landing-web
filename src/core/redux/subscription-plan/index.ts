import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlanId = "free" | "go" | "plus" | "pro" | "business" | "enterprise";

export type BillingType = "personal" | "business";

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  price: number;
  currency: string;
  tagline: string;
  description?: string;
  /** Monthly AI credits allocated by the plan (0 = none) */
  credits: number;
  isPopular: boolean;
  isVisible: boolean;
  billingType: BillingType;
  features: string[];
  footerNote?: string;
}

export interface ISubscriptionPlanState {
  plans: SubscriptionPlan[];
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: ISubscriptionPlanState = {
  plans: [
    {
      id: "free",
      name: "Free",
      price: 0,
      currency: "USD",
      tagline: "See what AI can do",
      description:
        "Get started with NoCap at no cost. Build and track unlimited habit stacks, copy habits from friends and the marketplace, and stay on track with the NoCap Habit Calendar.",
      credits: 0,
      isPopular: false,
      isVisible: true,
      billingType: "personal",
      features: [
        "Copy Habits from Friends & Family",
        "Unlimited habitStacks, Habits, HabitLinks & HabitLinksItem",
        "Copy Habits from Marketplace",
        "NOCAP Habit Calendar",
      ],
      footerNote: "Have an existing plan? See billing help",
    },
    {
      id: "go",
      name: "Go",
      price: 10,
      currency: "USD",
      tagline: "Keep chatting with expanded access",
      description:
        "Step up your habit game with 1,000 AI credits per month. Score your habits, swap underperforming ones, generate new stacks with AI, and chat with your personal AI habit assistant.",
      credits: 1000,
      isPopular: false,
      isVisible: true,
      billingType: "personal",
      features: [
        "Copy Habits from Friends & Family",
        "Unlimited habitStacks, Habits, HabitLinks & HabitLinksItem",
        "Copy Habits from Marketplace",
        "NOCAP Habit Calendar",
        "NOCAP AI Score Analysis",
        "NOCAP AI Habit Swap",
        "NOCAP AI Habit Generator",
        "NOCAP AI Habit Chat & Assistant",
        "1,000 AI credits / month",
      ],
      footerNote: "This plan may include ads.",
    },
    {
      id: "plus",
      name: "Plus",
      price: 20,
      currency: "USD",
      tagline: "Unlock the full experience",
      description:
        "The most popular choice. Double the AI credits of Go — 2,000 per month — for power users who want to build, score, and refine habits faster with full AI access.",
      credits: 2000,
      isPopular: true,
      isVisible: true,
      billingType: "personal",
      features: [
        "Copy Habits from Friends & Family",
        "Unlimited habitStacks, Habits, HabitLinks & HabitLinksItem",
        "Copy Habits from Marketplace",
        "NOCAP Habit Calendar",
        "NOCAP AI Score Analysis",
        "NOCAP AI Habit Swap",
        "NOCAP AI Habit Generator",
        "NOCAP AI Habit Chat & Assistant",
        "2,000 AI credits / month",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 100,
      currency: "USD",
      tagline: "Maximize your productivity",
      description:
        "For serious habit builders. 10,000 AI credits per month plus live AI HabitStack portfolio tracking, giving you a real-time view of your progress across every stack.",
      credits: 10000,
      isPopular: false,
      isVisible: true,
      billingType: "personal",
      features: [
        "Copy Habits from Friends & Family",
        "Unlimited habitStacks, Habits, HabitLinks & HabitLinksItem",
        "Copy Habits from Marketplace",
        "NOCAP Habit Calendar",
        "NOCAP AI Score Analysis",
        "NOCAP AI Habit Swap",
        "NOCAP AI Habit Generator",
        "NOCAP AI Habit Chat & Assistant",
        "NOCAP AI HabitStack Live Portfolio",
        "10,000 AI credits / month",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: 1000,
      currency: "USD",
      tagline: "Scale habits across your entire team",
      description:
        "Bring NoCap to your whole team. 100,000 AI credits per month, team habit stacks, collaboration tools, and priority support to keep your organization growing together.",
      credits: 100000,
      isPopular: false,
      isVisible: false,
      billingType: "business",
      features: [
        "Everything in Pro",
        "Team habit stacks and collaboration",
        "Copy Habits from Friends & Family",
        "Unlimited habitStacks, Habits, HabitLinks & HabitLinksItem",
        "Copy Habits from Marketplace",
        "NOCAP Habit Calendar",
        "NOCAP AI Score Analysis",
        "NOCAP AI Habit Swap",
        "NOCAP AI Habit Generator",
        "NOCAP AI Habit Chat & Assistant",
        "NOCAP AI HabitStack Live Portfolio",
        "100,000 AI credits / month",
        "Priority support",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 10000,
      currency: "USD",
      tagline: "Built for organizations that demand the best",
      description:
        "Purpose-built for large organizations. 1,000,000 AI credits per month, private stacks from industry professionals, a dedicated account manager, and SLA-backed uptime.",
      credits: 1000000,
      isPopular: false,
      isVisible: false,
      billingType: "business",
      features: [
        "Everything in Business",
        "Private HabitStacks from Professionals",
        "Dedicated account manager",
        "SLA-backed uptime guarantee",
        "1,000,000 AI credits / month",
      ],
    },
  ],
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const SubscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",
  initialState,
  reducers: {
    /** Replace the full plans array (e.g. after fetching updated plans from backend) */
    setPlans: (state, action: PayloadAction<SubscriptionPlan[]>) => {
      state.plans = action.payload;
    },
    /** Merge partial fields into a single plan by id */
    updatePlan: (
      state,
      action: PayloadAction<Partial<SubscriptionPlan> & { id: PlanId }>,
    ) => {
      const index = state.plans.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = { ...state.plans[index], ...action.payload };
      }
    },
    /** Reset to bundled defaults */
    resetPlans: () => initialState,
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { setPlans, updatePlan, resetPlans } =
  SubscriptionPlanSlice.actions;

export const SubscriptionPlanAction = SubscriptionPlanSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectSubscriptionPlans = (state: {
  subscriptionPlan: ISubscriptionPlanState;
}): SubscriptionPlan[] => state.subscriptionPlan.plans;

export const selectPlanById =
  (id: PlanId) =>
  (state: {
    subscriptionPlan: ISubscriptionPlanState;
  }): SubscriptionPlan | undefined =>
    state.subscriptionPlan.plans.find((p) => p.id === id);

/** Returns the billing types that have at least one visible plan. */
export const selectVisibleBillingTypes = createSelector(
  selectSubscriptionPlans,
  (plans): BillingType[] =>
    (["personal", "business"] as BillingType[]).filter((bt) =>
      plans.some((p) => p.billingType === bt && p.isVisible),
    ),
);

export default SubscriptionPlanSlice;

// ─── RevenueCat Mappings ──────────────────────────────────────────────────────

/** Maps each plan ID to its corresponding RevenueCat offering identifier. */
export const planIdToOfferingId: Record<string, string> = {
  go: "NOCAP-GO",
  plus: "NOCAP-PLUS",
  pro: "NOCAP-PRO",
};

/**
 * Maps each plan ID to its RevenueCat entitlement identifier.
 * Each paid plan has its own entitlement in the RC dashboard.
 */
export const planIdToEntitlement: Record<string, string> = {
  go: "NOCAP-GO",
  plus: "NOCAP-PLUS",
  pro: "NOCAP-PRO",
};
