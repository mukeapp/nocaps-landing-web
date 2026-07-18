"use client";

import React from "react";
import { ScrollView } from "react-native";

// On web every screen is its own Next.js page and the drawer is rendered by the
// dashboard layout, so the Drawertab navigator itself never mounts. This keeps
// the verbatim-copied Drawertab component compiling.
export function createDrawerNavigator() {
  const Navigator = (_props: any) => null;
  const Screen = (_props: any) => null;
  return { Navigator, Screen };
}

export function DrawerContentScrollView({ children, ...rest }: any) {
  return <ScrollView {...rest}>{children}</ScrollView>;
}

export type DrawerContentComponentProps = any;
