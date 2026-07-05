export type CheckoutRequest =
  | { kind: "plan"; planId: string }
  | { kind: "credits"; presetId: string };

/**
 * Posts to the checkout scaffold route. Until Stripe is configured this
 * always resolves to `{ ok: false }` with a user-facing message — see
 * src/app/api/stripe/checkout/route.ts.
 */
export async function createCheckoutSession(
  payload: CheckoutRequest,
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.url) {
    return {
      ok: false,
      message: data.message ?? "Checkout isn't available right now.",
    };
  }

  return { ok: true, url: data.url };
}
