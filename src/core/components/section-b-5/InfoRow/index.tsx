import React from "react";
import {Platform, StyleSheet, Text, View} from "react-native";
import {
    heightPercentageToDP as _hp,
    widthPercentageToDP as _wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _wp(p));
const hp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _hp(p));

interface Props {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: Props) => (
  <View style={s.infoRow}>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoValue}>{value}</Text>
  </View>
);

export default InfoRow;

const s = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.6),
  },
  infoLabel: { fontSize: wp(3.3), fontFamily: "regular", color: "#9ca3af" },
  infoValue: { fontSize: wp(3.5), fontFamily: "medium", color: "#f1f5f9" },
});
