import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { MainStyles } from "@/core/constants/styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet
} from "@/core/utils/responsive";

type Props = {
  preview?: string | null;
  onPick: () => void;
  titleText3?: string;
  mediumWidth?: boolean;
};

const BannerSectionV4: React.FC<Props> = ({
  preview,
  onPick,
  titleText3 = 'the Photos here',
  mediumWidth = false,
}) => {
  if (preview) {
    return (
      <View>
        <Image source={{ uri: preview }} style={s.img} resizeMode="cover" />
        <TouchableOpacity onPress={onPick} style={s.fab}>
          <Entypo name="plus" size={isTablet ? 40 : 20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <TouchableOpacity
        style={mediumWidth ? s.uploadMedium : s.upload}
        onPress={onPick}>
      <View style={s.uploadIconWrap}>
        <Image
          source={Images.upload}
          resizeMode="contain"
          style={{ width: wp(8), height: hp(8) }}
        />
      </View>
      <Text
        style={[
          MainStyles.text14,
          { color: Colors.music, textAlign: "center" },
        ]}
      >
        Please{" "}
        <Text style={[MainStyles.text14, { textDecorationLine: "underline" }]}>
          Upload{" "}
        </Text>
        {"\n"}{titleText3}
      </Text>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  img: {
     width: isTablet ? '100%' : '100%',
     height: isTablet ? hp(40) : hp(20),
     marginTop: hp(1),
     borderRadius: wp(3)
    },
  fab: {
    position: "absolute",
    right: isTablet ? wp (2) : wp(2),
    bottom: wp(1),
    backgroundColor: Colors.green,
    borderRadius: isTablet ? wp (10) : wp(6),
    width: isTablet ? wp(16) : wp(12),
    height: isTablet ? hp(12) : hp(6),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  upload: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderStyle: "dashed",
    width: wp(90),
    height: hp(20),
    borderRadius: wp(2),
    marginTop: hp(1),
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(20),
  },
  uploadMedium: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderStyle: "dashed",
    width: wp(60),
    height: hp(20),
    borderRadius: wp(2),
    marginTop: hp(1),
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(20),
  },
  uploadIconWrap: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(1.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(242,242,242,0.08)",
    marginBottom: hp(1.5),
  },
});

export default BannerSectionV4;
