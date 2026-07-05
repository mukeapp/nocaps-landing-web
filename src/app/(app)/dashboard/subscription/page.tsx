"use client";

import { Check } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectSubscriptionPlans } from "@/redux/subscription-plan";
import { selectCurrentPlan } from "@/redux/user-revenue-cat";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/dashboard/checkout-button";

export default function SubscriptionPage() {
  const plans = useAppSelector(selectSubscriptionPlans);
  const currentPlan = useAppSelector(selectCurrentPlan);
  const visiblePlans = plans.filter((plan) => plan.isVisible && plan.billingType === "personal");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Subscription</h1>
        <p className="text-sm text-muted-foreground">Pick the plan that fits how much AI you use.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visiblePlans.map((plan) => {
          const isCurrent = currentPlan.planId === plan.id;
          return (
            <Card key={plan.id} className={cn(plan.isPopular && "border-primary")}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.isPopular ? <Badge>Popular</Badge> : null}
                  {isCurrent ? <Badge variant="secondary">Current plan</Badge> : null}
                </div>
                <CardDescription>{plan.tagline}</CardDescription>
                <p className="pt-2 text-3xl font-semibold">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {isCurrent ? (
                  <p className="text-sm text-muted-foreground">You&apos;re on this plan.</p>
                ) : (
                  <CheckoutButton request={{ kind: "plan", planId: plan.id }} size="sm">
                    {plan.price === 0 ? "Downgrade" : "Upgrade"} to {plan.name}
                  </CheckoutButton>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
