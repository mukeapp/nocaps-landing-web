import {BillingType, SubscriptionPlan} from "@/core/redux/subscription-plan";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModalConfig {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  tagline: string;
  description?: string;
  credits: number;
  billingType: BillingType;
  features: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(n: number): string {
  return n === 0 ? "Free" : `$${n.toFixed(2)}/mo`;
}

export function toUIPlan(p: SubscriptionPlan): Plan {
  return {
    id: p.id,
    name: p.name,
    price: formatPrice(p.price),
    tagline: p.tagline,
    ...(p.description != null ? { description: p.description } : {}),
    credits: p.credits,
    billingType: p.billingType,
    features: p.features,
  };
}

export function getInitials(first: string, last: string): string {
  return (
    (first?.charAt(0) ?? "").toUpperCase() +
      (last?.charAt(0) ?? "").toUpperCase() || "?"
  );
}
