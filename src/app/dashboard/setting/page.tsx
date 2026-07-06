"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-b").then((m) => m.SettingScreen),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="settings" component={Screen} section="app" />;
}
