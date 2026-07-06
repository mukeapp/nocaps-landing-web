"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-b").then((m) => m.FriendsRequestScreen),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="friends-requests" component={Screen} section="app" />;
}
