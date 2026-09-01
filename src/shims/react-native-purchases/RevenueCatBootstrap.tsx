"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Purchases from "./index";

// Web analog of mobile's Purchases.configure in app/navigation/index.tsx —
// deliberately improved: configure *identified* (appUserId = NoCap userId,
// required by Web Billing) instead of mobile's anonymous configure.
export default function RevenueCatBootstrap() {
  const userId = useSelector(
    (s: any) =>
      s?.user?.userdata?.collectdata?.userId ??
      s?.user?.userdata?.collectdata?.id ??
      null,
  );
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_RC_WEB_API_KEY ?? "";
    if (userId) {
      if (!apiKey) {
        console.log("[RevenueCat] EXPO_PUBLIC_RC_WEB_API_KEY is not set — purchases disabled.");
      } else {
        Purchases.configure({ apiKey, appUserId: userId } as any);
      }
      prevUserIdRef.current = userId;
    } else if (prevUserIdRef.current) {
      // Logged out: drop the identified Web Billing session.
      prevUserIdRef.current = null;
      Purchases.logOut().catch(() => {});
    }
  }, [userId]);

  return null;
}
