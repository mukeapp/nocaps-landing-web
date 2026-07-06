"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-a").then((m) => m.TermService),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="termservice" component={Screen} section="auth" />;
}
