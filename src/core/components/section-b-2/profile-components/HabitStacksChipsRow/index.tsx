// src/screens/ProfileScreen/components/HabitStacksChipsRow.tsx
import React, { useState } from "react";
import { Platform, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";

const isWeb = Platform.OS === "web";
// On web, render at a fixed iPad Pro-equivalent size (1024×1366 × 0.55 cap) so
// chips/icons don't inflate with the browser width; native keeps wp/hp.
const wwp = (p: number) => (isWeb ? +(p * 5.632).toFixed(1) : wp(`${p}%`));
const whp = (p: number) => (isWeb ? +(p * 7.513).toFixed(1) : hp(`${p}%`));
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {HabitStackChips, HabitStacksChipsRowProps} from "@/core/models/section-b";
import {normalizeColor} from "@/core/utils";

// Sample data matching the new structure
const defaultHabitStacks: HabitStackChips[] = [
  {
    habitStackId: "1",
    habitStackName: "Healthy Live Style",
    active: true,
    color: "#FF69B4",
    habits: [
      { id: "1", name: "Sports" },
      { id: "2", name: "Food" },
      { id: "3", name: "Workout" },
    ],
  },
  {
    habitStackId: "2",
    habitStackName: "Finance",
    active: true,
    color: "#8B7FFF",
    habits: [
      { id: "4", name: "Groceries" },
      { id: "5", name: "Save Money" },
      { id: "6", name: "Food" },
    ],
  },
];

const HabitStacksChipsRow: React.FC<HabitStacksChipsRowProps> = ({
  habitStacksChips = [],
  isOwnProfile = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const visibleStacks = isOwnProfile
    ? habitStacksChips
    : habitStacksChips.filter(
        (item) => item.hideFromFriends === false && item.isPublic === true
      );

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>HabitStacks & Habits</Text>
        <TouchableOpacity style={styles.collapseButton} onPress={toggleExpand}>
          <AntDesign
            name={isExpanded ? "up" : "down"}
            size={16}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <>
          {visibleStacks.map((habitStack) => (
            <View key={habitStack.habitStackId} style={styles.rowContainer}>
              {/* Icon based on active status */}
              <View style={styles.iconWrapper}>
                {habitStack.active ? (
                  <AntDesign name="caretright" size={16} color={Colors.white} />
                ) : (
                  <FontAwesome name="pause" size={14} color={Colors.white} />
                )}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {/* HabitStack Name Chip (First chip in row) */}
                <TouchableOpacity
                  style={[
                    styles.chip,
                     habitStack.color && {
                      backgroundColor: normalizeColor(habitStack.color)
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      styles.chipTextActive,
                    ]}
                  >
                    {habitStack.habitStackName}
                  </Text>
                </TouchableOpacity>

                {/* Habits Chips */}
                {habitStack.habits?.map((habit) => (
                  <TouchableOpacity
                    key={habit.id}
                    style={styles.chip}
                  >
                    <Text style={styles.chipText}>
                      {habit.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default HabitStacksChipsRow;

const styles = StyleSheet.create({
  sectionCard: {
    marginTop: whp(0),
    backgroundColor: Colors.background_color,
    borderTopLeftRadius: wwp(4),
    borderTopRightRadius: wwp(4),
    paddingHorizontal: wwp(4),
    paddingVertical: whp(2),
    marginHorizontal: wwp(0),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: whp(0),
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "semibold",
  },
  collapseButton: {
    width: wwp(8),
    height: wwp(8),
    borderRadius: wwp(4),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: whp(1),
  },
  iconWrapper: {
    width: wwp(8),
    height: wwp(8),
    borderRadius: wwp(4),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wwp(2),
  },
  chipsScroll: {
    paddingVertical: whp(0.5),
  },
  chip: {
    paddingHorizontal: wwp(4.5),
    paddingVertical: whp(1),
    borderRadius: wwp(6),
    backgroundColor: Colors.sub_title,
    marginRight: wwp(2),
  },
  chipText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "regular",
  },
  chipTextActive: {
    color: Colors.white,
    fontFamily: "semibold",
  },
});