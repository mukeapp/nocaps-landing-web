"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-b").then((m) => m.HabitMarketSeeAllScreen),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="habit-market-see-all" component={Screen} section="app" />;
}
