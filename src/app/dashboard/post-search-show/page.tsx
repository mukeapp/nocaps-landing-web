"use client";

import dynamic from "next/dynamic";

const ScreenPage = dynamic(() => import("@/shims/react-navigation/ScreenPage"), { ssr: false });
const Screen = dynamic(
  () => import("@/app/src/screens/section-c").then((m) => m.PostSearchShowScreen),
  { ssr: false }
);

export default function Page() {
  return <ScreenPage name="post-search-show" component={Screen} section="app" />;
}
