"use client";

import React from "react";
import { View } from "react-native";

// Browsers have no notch insets; SafeAreaView degrades to a plain View.
export const SafeAreaView = React.forwardRef<any, any>(({ children, ...rest }, ref) => (
  <View ref={ref} {...rest}>
    {children}
  </View>
));
SafeAreaView.displayName = "SafeAreaView";

export function useSafeAreaInsets() {
  return { top: 0, bottom: 0, left: 0, right: 0 };
}

export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
