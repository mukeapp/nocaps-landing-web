"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-b").then((m) => m.ProfileEditScreen),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="profile-edit" component={Screen} section="app" />;
}
