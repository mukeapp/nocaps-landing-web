import React from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "@/core/utils/responsive";

const ScreenChrome: React.FC = () => (
  <>
    <BlurView
      experimentalBlurMethod="dimezisBlurView"
      intensity={35}
      tint="light"
      style={styles.blur}
    />
    <View style={styles.grabber} />
  </>
);

export default ScreenChrome;

export const styles = StyleSheet.create({
  blur: {
    height: hp(30),
    width: wp(100),
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOpacity: 0.15,
  },
  grabber: {
    width: wp(32),
    height: hp(1),
    borderRadius: wp(10),
    backgroundColor: "#000000ab",
    alignSelf: "center",
    marginVertical: hp(1),
  },
});