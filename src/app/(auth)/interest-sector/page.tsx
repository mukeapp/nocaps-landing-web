"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-a").then((m) => m.InterestSector),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="interestsector" component={Screen} section="auth" />;
}
