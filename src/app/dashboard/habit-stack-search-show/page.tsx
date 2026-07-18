"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-c").then((m) => m.HabitStackSearchShowScreen),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="habit-stack-search-show" component={Screen} section="app" />;
}
