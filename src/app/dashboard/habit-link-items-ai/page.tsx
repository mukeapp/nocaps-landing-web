"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-d").then((m) => m.HabitLinkItemsAIScreen),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="habit-link-items-ai" component={Screen} section="app" />;
}
