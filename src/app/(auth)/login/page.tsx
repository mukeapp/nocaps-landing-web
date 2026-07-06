"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-a/section-a-1/Signing/SigninScreen").then((m) => m.default),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="signin" component={Screen} section="auth" />;
}
