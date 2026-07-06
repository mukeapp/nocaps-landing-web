"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-a").then((m) => m.SignUpScreen),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="signup" component={Screen} section="auth" />;
}
