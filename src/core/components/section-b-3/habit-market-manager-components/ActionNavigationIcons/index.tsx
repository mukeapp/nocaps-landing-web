// FILE 1: ActionIcons.tsx
import { Colors } from "@/core/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);

interface ActionIconsProps {
  navigateToHabitMarketManager: () => void;
}

const ActionNavigationIcons: React.FC<ActionIconsProps> = ({
  navigateToHabitMarketManager,
}) => {
  return (
    <View style={styles.actionIcons}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={navigateToHabitMarketManager}
      >
        <MaterialCommunityIcons
          name="arrow-up-circle"
          size={20}
          color={Colors.white}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialCommunityIcons
          name="dots-vertical"
          size={20}
          color={Colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: hp(2),
    gap: wp(1),
    marginRight: wp(1),
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
});

export default ActionNavigationIcons;
