// FILE 2: HabitDataTypes.tsx
import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { Action, HabitCategory } from "@/core/models/section-b";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);

interface ActionButtonsProps {
  actionButtonFilters: Action[];
  actionButtonString: string;
  onActionButtonChange?: (action: string) => void;
  onActionButtonIdChange?: (actionId: number) => void;
}

const HabitCategoryButtons: React.FC<ActionButtonsProps> = ({
  actionButtonFilters,
  actionButtonString,
  onActionButtonChange = () => { console.log("Action Button Changed"); },
  onActionButtonIdChange = () => { console.log("Action Button ID Changed"); },
}) => {
  return (
    <View style={styles.topRowContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusScrollContent}
        style={styles.statusScrollView}
      >
        {actionButtonFilters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.statusChip,
              actionButtonString === filter.name && styles.statusChipActive,
            ]}
            onPress={() => {
              onActionButtonChange(filter.name);
              onActionButtonIdChange(filter.id);
            }}
          >
            <Text
              style={[
                styles.statusText,
                actionButtonString === filter.name && styles.statusTextActive,
              ]}
            >
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  statusScrollView: {
    flex: 1,
  },
  statusScrollContent: {
    paddingHorizontal: wp(1),
    alignItems: "center",
  },
  statusChip: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: wp(2),
  },
  statusChipActive: {
    backgroundColor: "#29B6F6",
  },
  statusText: {
    ...MainStyles.text10,
    color: Colors.black,
    fontWeight: "600",
  },
  statusTextActive: {
    color: Colors.black,
  },
});

export default HabitCategoryButtons;