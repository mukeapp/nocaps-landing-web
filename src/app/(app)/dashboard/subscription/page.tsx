"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import {
  selectSubscriptionPlans,
  selectVisibleBillingTypes,
  type BillingType,
} from "@/redux/subscription-plan";
import { selectCurrentPlan } from "@/redux/user-revenue-cat";
import { CheckoutButton } from "@/components/dashboard/checkout-button";

/**
 * Mirrors mobile's NoCapSubscriptionScreen (section-b-4): personal/business
 * billing toggle, dark plan cards with tagline, price, feature list (blue
 * check rows), "Most Popular" tag and current-plan state. Purchases run on
 * the Stripe scaffold (RevenueCat store billing has no web equivalent).
 */
export default function SubscriptionPage() {
  const plans = useAppSelector(selectSubscriptionPlans);
  const currentPlan = useAppSelector(selectCurrentPlan);
  const billingTypes = useAppSelector(selectVisibleBillingTypes);
  const [billingType, setBillingType] = useState<BillingType>("personal");

  const visiblePlans = plans.filter((plan) => plan.isVisible && plan.billingType === billingType);

  return (
    <div className="mx-auto max-w-xl pb-10">
      <h1 className="text-[20px] font-bold text-white">Subscribe</h1>
      <p className="mb-4 text-[13px] text-white/50">Pick the plan that fits how much AI you use.</p>

      {/* Billing type toggle — only shown when both types have visible plans */}
      {billingTypes.length > 1 ? (
        <div className="mb-4 flex rounded-full bg-[#2A2A2A] p-1">
          {billingTypes.map((type) => (
            <button
              key={type}
              onClick={() => setBillingType(type)}
              className={`flex-1 rounded-full py-2.5 text-[14px] font-semibold capitalize transition-colors ${
                billingType === type ? "bg-white text-black" : "text-[#6B7280]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      ) : null}

      <div className="space-y-4">
        {visiblePlans.map((plan) => {
          const isCurrent = currentPlan.planId === plan.id && currentPlan.billingType === plan.billingType;
          return (
            <div
              key={plan.id}
              className="rounded-2xl bg-[rgba(25,25,25,1)] p-5"
              style={{
                border: plan.isPopular
                  ? "1px solid rgba(45,156,219,1)"
                  : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[17px] font-bold text-white">{plan.name}</p>
                <div className="flex items-center gap-2">
                  {plan.isPopular ? (
                    <span className="rounded-full bg-[rgba(45,156,219,1)] px-2.5 py-0.5 text-[10px] font-bold text-white">
                      MOST POPULAR
                    </span>
                  ) : null}
                  {isCurrent ? (
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      CURRENT PLAN
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="mt-0.5 text-[13px] text-white/50">{plan.tagline}</p>
              <p className="mt-3 text-[28px] font-bold text-white">
                ${plan.price}
                <span className="text-[13px] font-normal text-white/50">/month</span>
              </p>
              {plan.description ? (
                <p className="mt-2 text-[12px] leading-5 text-white/50">{plan.description}</p>
              ) : null}

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[rgba(45,156,219,1)]" />
                    <span className="text-[13px] text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {isCurrent ? (
                  <p className="text-[13px] text-white/50">You&apos;re on this plan.</p>
                ) : (
                  <CheckoutButton request={{ kind: "plan", planId: plan.id }}>
                    {plan.price === 0 ? "Downgrade" : "Upgrade"} to {plan.name}
                  </CheckoutButton>
                )}
              </div>
              {plan.footerNote ? (
                <p className="mt-3 text-[11px] text-white/40">{plan.footerNote}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
