// FILE 1: ActionIcons.tsx
import { Colors } from "@/core/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";

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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
});

export default ActionNavigationIcons;
