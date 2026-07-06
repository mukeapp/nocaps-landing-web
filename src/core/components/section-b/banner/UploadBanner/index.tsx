import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";
import { Images } from "@/core/constants/Images";
import { Colors } from "@/core/constants/Colors";

type Props = {
  image?: string | null;
  fallback?: string | null;   // routeDataState?.bannerImage
  onPick: () => void;
};

const UploadBanner: React.FC<Props> = ({ image, fallback, onPick }) => {
  const source = image
    ? { uri: image }
    : fallback
    ? { uri: fallback }
    : null;

  if (source) {
    return (
      <View>
        <Image source={source} style={s.imgbanner} resizeMode="cover" />
        <TouchableOpacity onPress={onPick} style={s.pik}>
          <Entypo name="plus" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={s.uploadview} onPress={onPick}>
      <View style={s.uploadimg}>
        <Image source={Images.upload} resizeMode="contain" style={s.upld} />
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  imgbanner: { width: wp(90), height: hp(20), marginTop: hp(1), borderRadius: wp(3) },
  pik: {
    position: "absolute", right: wp(1), bottom: wp(1), backgroundColor: Colors.green,
    borderRadius: wp(5), width: wp(6), height: wp(6), alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: Colors.white,
  },
  uploadview: {
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.3)", borderStyle: "dashed",
    width: wp(90), height: hp(20), borderRadius: wp(2), marginTop: hp(1),
    alignItems: "center", paddingVertical: hp(2), paddingHorizontal: wp(20),
  },
  uploadimg: {
    width: wp(14), height: wp(14), borderRadius: wp(1.5),
    alignItems: "center", justifyContent: "center", backgroundColor: "rgba(242,242,242,0.08)",
    marginBottom: hp(1.5),
  },
  upld: { width: wp(8), height: hp(8) },
});

export default UploadBanner;
