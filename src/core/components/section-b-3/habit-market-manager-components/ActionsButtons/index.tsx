// FILE 2: HabitDataTypes.tsx
import { Colors } from "@/core/constants/Colors";
import { Action } from "@/core/models/section-b";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";

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
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.7),
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginRight: wp(2),
  },
  statusChipActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  statusText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "poppins_semibold",
    fontWeight: "600",
  },
  statusTextActive: {
    color: Colors.black,
  },
});

export default HabitCategoryButtons;