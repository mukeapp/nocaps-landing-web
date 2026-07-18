import React from "react";
import {Platform, StyleSheet, Text} from "react-native";
import {
    heightPercentageToDP as _hp,
    widthPercentageToDP as _wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _wp(p));
const hp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _hp(p));

interface Props {
  children: string;
}

const SectionLabel = ({ children }: Props) => (
  <Text style={s.sectionLabel}>{children}</Text>
);

export default SectionLabel;

const s = StyleSheet.create({
  sectionLabel: {
    fontSize: wp(2.6),
    fontFamily: "medium",
    letterSpacing: 3,
    color: "#6b7280",
    textTransform: "uppercase",
    paddingHorizontal: wp(5),
    paddingTop: hp(2.2),
    paddingBottom: hp(0.8),
  },
});
