import React from "react";
import { View, Text, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as _hp } from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);
import { Colors } from "@/core/constants/Colors";

const EmptyState: React.FC = () => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>No Data Found</Text>
    </View>
  );
};

export default EmptyState;

export const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", height: hp(50) },
  text: { color: Colors.white, fontSize: 16, fontFamily: "semibold" },
});