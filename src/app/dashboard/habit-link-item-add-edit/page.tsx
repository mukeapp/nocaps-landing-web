"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-b").then((m) => m.HabitLinkItemAddEditScreen),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="add_edit_habitlinkitem" component={Screen} section="app" />;
}
