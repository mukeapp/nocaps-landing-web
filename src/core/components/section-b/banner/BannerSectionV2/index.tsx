import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MainStyles } from "@/core/constants/styles";
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
    <>
      <Text style={[MainStyles.text14, { marginTop: 8 }]}>Habit Link Image Banner</Text>
      <TouchableOpacity style={HabitStyles.uploadview} onPress={onPick}>
        <View style={HabitStyles.uploadimg}>
          <Image source={Images.upload} resizeMode="contain" style={{ width: 32, height: 32 }} />
        </View>
        <Text style={[MainStyles.text14, { color: Colors.music, textAlign: "center" }]}>
          Please <Text style={[MainStyles.text14, { textDecorationLine: "underline" }]}>Upload</Text> the{"\n"}Photos here
        </Text>
      </TouchableOpacity>
    </>
  );
}

export const styles = StyleSheet.create({
  imgbanner: {
    width: isWeb ? "100%" : isTablet ? "100%" : wp(90),
    height: isWeb ? 180 : isTablet ? hp(40) : hp(20),
    marginTop: hp(1),
    borderRadius: wp(3)
  },
});