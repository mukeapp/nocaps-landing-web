"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAppDispatch } from "@/redux/hooks";
import { UserDataAction } from "@/redux/user-data";
import { GetUserByEmail } from "@/lib/api/section-a/user";
import { GetUserRevenueCatByNocapUserId } from "@/lib/api/section-b/revenue-cat";
import { setPurchasedPlan } from "@/redux/user-revenue-cat";
import { GetAllSubscriptions, GetHabitIntelligenceCosts } from "@/lib/api/section-b/catalog";
import { setPlans } from "@/redux/subscription-plan";
import { setCosts } from "@/redux/habit-intelligence-cost";

/**
 * Mounted once inside the (app) layout. Two jobs:
 * 1. Auth gate — redirect to sign-in the moment Firebase reports no user
 *    (catches revoked/stale-cookie cases the middleware's cheap check can't).
 * 2. Populate redux on entry — mirrors mobile's post-login dispatch, but runs
 *    on every dashboard mount instead of only at sign-in time, since our
 *    store only lives inside this layout (not the root), so a user arriving
 *    via a fresh page load / persisted session still needs it hydrated.
 */
export function AppBootstrap() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (!user) {
        router.replace("/sign-in");
        return;
      }

      const idToken = await user.getIdToken();
      dispatch(UserDataAction.setUserAuth(idToken));

      try {
        const res = await GetUserByEmail({ mail: user.email ?? "" });
        dispatch(UserDataAction.setUserData(res.data));

        const nocapUserId = (res.data as any)?.userId ?? (res.data as any)?.id;
        if (nocapUserId) {
          const rc = await GetUserRevenueCatByNocapUserId({ nocapUserId });
          if (rc.data) {
            dispatch(
              setPurchasedPlan({
                documentId: (rc.data as any).documentId,
                id: (rc.data as any).id,
                revenueCatUserId: (rc.data as any).revenueCatUserId,
                nocapUserId,
                planId: (rc.data as any).planId ?? "free",
                billingType: (rc.data as any).billingType ?? "personal",
                monthlyCredits: (rc.data as any).monthlyCredits ?? 0,
                remainingCredits: (rc.data as any).remainingCredits,
                purchasedAt: (rc.data as any).purchasedAt,
              }),
            );
          }
        }
      } catch (err) {
        console.log("AppBootstrap: failed to load user profile", err);
      }

      // Best-effort catalog sync — a different (admin) service; failures here
      // shouldn't block the dashboard, bundled defaults already cover the UI.
      try {
        const [subs, costs] = await Promise.all([
          GetAllSubscriptions(),
          GetHabitIntelligenceCosts(),
        ]);
        if (Array.isArray(subs.data)) dispatch(setPlans(subs.data));
        if (Array.isArray(costs.data)) dispatch(setCosts(costs.data));
      } catch (err) {
        console.log("AppBootstrap: failed to sync catalog", err);
      }
    });
  }, [dispatch, router]);

  return null;
}
