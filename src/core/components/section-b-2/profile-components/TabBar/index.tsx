// src/screens/ProfileScreen/components/TabBar.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";

export const TABS_HabitStacks = ["MyHabitStacks", "Friends", "Liked", "Recommended"] as const;
export const TABS_Posts = ["Posts", "Friends", "Liked", "Recommended"] as const;

interface TabBarProps {
  activeToggle: "post" | "habitStacks";
  activeTab: string;
  setActiveTab:  (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab, activeToggle }) => {

  const tabs = activeToggle === "post" ? TABS_Posts : TABS_HabitStacks;

  return (
    <View style={styles.tabsRow}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.tabItem}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab && styles.tabTextActive,
            ]}
          >
            {tab}
          </Text>
          {activeTab === tab && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: "row",
    margin: hp("2.4%"),
  },
  tabItem: {
    marginRight: wp("6%"),
    alignItems: "center",
  },
  tabText: {
    color: Colors.sub_title,
    fontSize: 13,
    fontFamily: "regular",
  },
  tabTextActive: {
    color: Colors.white,
    fontFamily: "semibold",
  },
  tabUnderline: {
    marginTop: hp("0.6%"),
    height: 2,
    width: "100%",
    borderRadius: 1,
    backgroundColor: Colors.white,
  },
});

