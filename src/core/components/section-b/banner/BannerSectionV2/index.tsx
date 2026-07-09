import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { HabitStyles } from "@/core/styles/HabitStyles";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import Entypo from "@expo/vector-icons/Entypo";
import { Platform, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, isTablet } from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";


type Props = {
  image: string | null;        // local picked
  remoteImage: string | null;  // existing banner if editing
  preview: string | null;      // uploaded downloadURL
  onPick: () => void;
};

export default function BannerSectionV2({ image, remoteImage, preview, onPick }: Props) {
  const show = image || preview || remoteImage;

  if (show) {
    return (
      <View>
        <Image source={{ uri: (image || preview || remoteImage)! }} style={styles.imgbanner} resizeMode="cover" />
        <TouchableOpacity onPress={onPick} style={HabitStyles.pik}>
          <Entypo name="plus" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.uploadArea} onPress={onPick} activeOpacity={0.7}>
      <View style={styles.uploadIconWrap}>
        <Image source={Images.upload} resizeMode="contain" style={{ width: 28, height: 28 }} />
      </View>
      <Text style={styles.uploadHint}>Click to upload a photo</Text>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  imgbanner: {
    width: isWeb ? "100%" : isTablet ? "100%" : wp(90),
    height: isWeb ? 180 : isTablet ? hp(40) : hp(20),
    marginTop: hp(1),
    borderRadius: wp(3)
  },
  uploadArea: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    gap: 10,
  },
  uploadIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(242,242,242,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadHint: {
    color: "#9CA3AF",
    fontSize: 13,
  },
});