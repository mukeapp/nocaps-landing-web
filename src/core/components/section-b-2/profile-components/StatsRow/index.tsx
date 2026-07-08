// src/screens/ProfileScreen/components/StatsRow.tsx
import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import { StatGroup, StatItem, StatsRowProps } from "@/core/models/section-b";

const isWeb = Platform.OS === "web";

// Fallback for when no stats are passed in
const testStats: { postStats: StatGroup; habitStats: StatGroup } = {
  postStats: {
    case1: { name: "Post", value: 0 },
    case2: { name: "Following", value: 0 },
    case3: { name: "Followers", value: 0 },
  },
  habitStats: {
    case1: { name: "HabitStacks", value: 0 },
    case2: { name: "Habits", value: 0 },
    case3: { name: "HabitLinks", value: 0 },
  },
};

// Format number as 150 / 1.8k / 2.0k…
const formatStatValue = (value: number): string => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "k";
  }
  return value.toString();
};

const StatsRow: React.FC<StatsRowProps> = ({
  stats = testStats,
  activeToggle,
}) => {
  const source: StatGroup =
    activeToggle === "post" ? stats?.postStats : stats?.habitStats;

  const items = Object.values(source) as StatItem[];

  return (
    <View style={styles.statsRow}>
      {items.map((item, index) => (
        <StatBox
          key={`${item.name}-${index}`}
          label={item.name}
          value={item.value}
        />
      ))}
    </View>
  );
};

const StatBox: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{formatStatValue(value)}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default StatsRow;

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.content_back ?? "#262626",
    borderRadius: isWeb ? 12 : wp("4.5%"),
    paddingVertical: isWeb ? 16 : hp("1.8%"),
    alignItems: "center",
  },
  statValue: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: "semibold",
  },
  statLabel: {
    color: Colors.sub_title,
    fontSize: 13,
    marginTop: 4,
    fontFamily: "regular",
  },
});
