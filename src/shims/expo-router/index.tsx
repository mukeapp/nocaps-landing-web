"use client";

import React from "react";
import { useRouter as useNextRouter } from "next/navigation";

import { ROUTE_NAME_TO_PATH } from "../react-navigation/routes";

// expo-router useRouter shim: route names/hrefs map through the same table as
// the navigation shim; unknown hrefs are passed to Next.js as-is.
export function useRouter() {
  const router = useNextRouter();
  const resolve = (href: any) => {
    const name = typeof href === "string" ? href : href?.pathname;
    return ROUTE_NAME_TO_PATH[name] ?? name;
  };
  return {
    push: (href: any) => router.push(resolve(href)),
    replace: (href: any) => router.replace(resolve(href)),
    back: () => router.back(),
    navigate: (href: any) => router.push(resolve(href)),
  };
}

export const Stack = Object.assign(
  ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  { Screen: (_props: any) => null }
);
