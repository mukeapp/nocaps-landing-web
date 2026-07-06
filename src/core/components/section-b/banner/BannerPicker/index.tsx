import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet
} from "@/core/utils/responsive";
import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";

type Props = {
  imageLocalUri: string | null;
  imageRemoteUrl: string | null;
  onPick: () => void;
};

const BannerPicker: React.FC<Props> = ({ imageLocalUri, imageRemoteUrl, onPick }) => {
  const uri = imageLocalUri ?? imageRemoteUrl ?? null;

  return (
    <>
      <Text style={[MainStyles.text14, { marginTop: hp(3) }]}>Item Image Banner</Text>

      {uri ? (
        <View>
          <Image source={{ uri }} style={styles.banner} resizeMode="cover" />
          <TouchableOpacity onPress={onPick} style={styles.fab}>
            <Entypo name="plus" size={isTablet ? 32 : 20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadWrap} onPress={onPick}>
          <View style={styles.uploadBox}>
            <Image source={Images.upload} resizeMode="contain" style={styles.uploadIcon} />
          </View>
          <Text style={[MainStyles.text14, styles.hint]}>Please upload image here</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default BannerPicker;

export const styles = StyleSheet.create({
  banner: {
    width: isTablet ? '100%' : wp(90),
    height: isTablet ? hp(40) : hp(20),
    marginTop: hp(1),
    borderRadius: wp(3),
  },
  fab: {
    position: "absolute",
    right: wp(1),
    bottom: wp(1),
    backgroundColor: Colors.green,
    borderRadius: isTablet ? wp(4.5) : wp(5),
    width: isTablet ? wp(9) : wp(6),
    height: isTablet ? wp(9) : wp(6),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  uploadWrap: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
    width: isTablet ? '100%' : wp(90),
    height: isTablet ? hp(20) : hp(13),
    borderRadius: wp(2),
    marginTop: hp(1),
    alignItems: "center",
    paddingVertical: isTablet ? hp(3) : hp(2),
    paddingHorizontal: wp(5),
  },
  uploadBox: {
    width: isTablet ? wp(7) : wp(10),
    height: isTablet ? wp(7) : wp(10),
    borderRadius: wp(1.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(242, 242, 242, 0.08)",
    marginBottom: hp(1.5),
  },
  uploadIcon: { width: isTablet ? wp(4) : wp(6), height: isTablet ? hp(5) : hp(6) },
  hint: { color: Colors.music, textAlign: "center" },
});
