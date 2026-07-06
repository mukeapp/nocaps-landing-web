import React from "react";
import {StyleSheet, Text} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

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
