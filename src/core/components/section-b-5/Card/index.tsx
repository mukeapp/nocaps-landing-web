import React from "react";
import {StyleSheet, View} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "@/core/utils/responsive";

interface Props {
  children: React.ReactNode;
}

const Card = ({ children }: Props) => <View style={s.card}>{children}</View>;

export default Card;

const s = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: wp(4),
    marginHorizontal: wp(4),
    marginBottom: hp(0.5),
    overflow: "hidden",
  },
});
