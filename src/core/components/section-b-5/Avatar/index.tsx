import {Colors} from "@/core/constants/Colors";
import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {widthPercentageToDP as wp} from "@/core/utils/responsive";

interface Props {
  initials: string;
  photo?: string;
}

const Avatar = ({ initials, photo }: Props) => (
  <View style={s.avatarWrap}>
    {photo ? (
      <Image source={{ uri: photo }} style={s.avatarImg} />
    ) : (
      <View style={s.avatarFallback}>
        <Text style={s.avatarInitials}>{initials}</Text>
      </View>
    )}
    <View style={s.avatarBadge}>
      <Text style={s.avatarBadgeText}>✓</Text>
    </View>
  </View>
);

export default Avatar;

const s = StyleSheet.create({
  avatarWrap: { position: "relative", width: wp(22), height: wp(22) },
  avatarImg: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    borderWidth: 3,
    borderColor: Colors.colorred,
  },
  avatarFallback: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    backgroundColor: "#16213e",
    borderWidth: 3,
    borderColor: Colors.colorred,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: wp(7),
    fontFamily: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(2.75),
    backgroundColor: "#2ec4b6",
    borderWidth: 2,
    borderColor: "#0f0f1a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadgeText: { fontSize: wp(2.5), color: "#fff", fontFamily: "bold" },
});
