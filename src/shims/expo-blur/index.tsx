"use client";

import React from "react";
import { View } from "react-native";

// BlurView → backdrop-filter. intensity 0-100 maps to blur px like expo-blur.
export function BlurView({ intensity = 50, tint = "default", style, children, ...rest }: any) {
  const blurPx = Math.round((intensity / 100) * 20);
  const tintColor =
    tint === "dark"
      ? "rgba(0,0,0,0.3)"
      : tint === "light"
        ? "rgba(255,255,255,0.3)"
        : "rgba(0,0,0,0.15)";
  return (
    <View
      {...rest}
      style={[
        style,
        {
          // @ts-ignore web-only styles pass through react-native-web
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`,
          backgroundColor: tintColor,
        },
      ]}
    >
      {children}
    </View>
  );
}
