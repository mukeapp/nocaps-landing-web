"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-b/section-b-4/NoCapSubscriptionScreen").then((m) => m.default),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="no-cap-subscription" component={Screen} section="app" />;
}
