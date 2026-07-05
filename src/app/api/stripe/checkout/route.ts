import { NextRequest, NextResponse } from "next/server";

/**
 * Scaffold only — mobile bills through RevenueCat (App/Play Store), which can't
 * process payments on web. This route is wired up (request shape, response
 * contract) but not connected to a real Stripe secret key / price catalog yet.
 * TODO: create a Stripe Checkout Session here once STRIPE_SECRET_KEY and price
 * IDs are configured, and return { url: session.url } for the client to redirect to.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: "not_implemented",
        message: "Stripe checkout isn't configured yet. Manage your plan from the mobile app for now.",
      },
      { status: 501 },
    );
  }

  // Real implementation goes here once Stripe is configured, using `body`
  // (e.g. { kind: "plan" | "credits", id: string }) to pick the right price.
  return NextResponse.json({ error: "not_implemented" }, { status: 501 });
}
