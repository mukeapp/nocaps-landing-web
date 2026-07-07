"use client";
import dynamic from "next/dynamic";
import React from "react";

const Preview = dynamic(
  async () => {
    const { View } = await import("react-native");
    const { default: MarketSection } = await import(
      "@/core/components/section-b-3/habit-market-components/MarketSection"
    );
    return function P() {
      return (
        <View style={{ backgroundColor: "#0a0f1c", padding: 24, minHeight: 400 }}>
          <MarketSection
            title="Healthy Grocery Habits"
            stacks={[] as any}
            sectorId="tmp"
            habitCategoryId={1}
            onSeeAll={() => {}}
          />
        </View>
      );
    };
  },
  { ssr: false }
);

export default function Page() {
  return <Preview />;
}
