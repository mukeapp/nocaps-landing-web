"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-a").then((m) => m.OnboardLocation),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="onboardlocation" component={Screen} section="auth" />;
}
