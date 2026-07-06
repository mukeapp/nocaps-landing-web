import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

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
