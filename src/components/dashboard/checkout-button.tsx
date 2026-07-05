"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createCheckoutSession, type CheckoutRequest } from "@/lib/stripe/client";

export function CheckoutButton({
  request,
  children,
  variant = "default",
  size = "default",
}: {
  request: CheckoutRequest;
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const result = await createCheckoutSession(request);
      if (result.ok) {
        window.location.href = result.url;
      } else {
        toast.info(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={loading}>
      {loading ? "Loading..." : children}
    </Button>
  );
}
