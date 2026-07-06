import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {
    heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { HabitStackMarketCardProps } from "./HabitStackMarketCard";

const MarketSectionFooter: React.FC<HabitStackMarketCardProps> = ({
  onAdd,
}) => {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text style={styles.addButtonText}>+ Add to Library</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
      borderWidth: 1,
      borderColor: Colors.white,
      borderRadius: 8,
      paddingVertical: hp(0.8),
      alignItems: 'center',
      justifyContent: 'center',
  },
  addButtonText: {
      ...MainStyles.text12,
      color: Colors.white,
  }
});

export default MarketSectionFooter;
