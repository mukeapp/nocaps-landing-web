import React from "react";
import {Platform, StyleSheet, View} from "react-native";
import {
    heightPercentageToDP as _hp,
    widthPercentageToDP as _wp,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _wp(p));
const hp = (p: number): number => (isWeb ? +(p * 3.8).toFixed(1) : _hp(p));

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
