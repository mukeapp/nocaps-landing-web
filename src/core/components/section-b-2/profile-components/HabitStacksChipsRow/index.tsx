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
    marginTop: hp("0%"),
    backgroundColor: Colors.background_color,
    borderTopLeftRadius: isWeb ? 16 : wp("4%"),
    borderTopRightRadius: isWeb ? 16 : wp("4%"),
    paddingHorizontal: isWeb ? 20 : wp("4%"),
    paddingVertical: isWeb ? 18 : hp("2%"),
    marginHorizontal: wp("0%"),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("0%"),
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "semibold",
  },
  collapseButton: {
    width: isWeb ? 32 : wp("8%"),
    height: isWeb ? 32 : wp("8%"),
    borderRadius: isWeb ? 16 : wp("4%"),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  iconWrapper: {
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("4%"),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
  },
  chipsScroll: {
    paddingVertical: hp("0.5%"),
  },
  chip: {
    paddingHorizontal: wp("4.5%"),
    paddingVertical: hp("1%"),
    borderRadius: wp("6%"),
    backgroundColor: Colors.sub_title,
    marginRight: wp("2%"),
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