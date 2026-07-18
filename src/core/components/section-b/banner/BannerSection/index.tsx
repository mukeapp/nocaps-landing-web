import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { MainStyles } from "@/core/constants/styles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, isTablet } from "@/core/utils/responsive";

type Props = { preview?: string | null; onPick: () => void };

const BannerSection: React.FC<Props> = ({ preview, onPick }) => {
  if (preview) {
    return (
      <View>
        <Image source={{ uri: preview }} style={s.img} resizeMode="cover" />
        <TouchableOpacity onPress={onPick} style={s.fab}><Entypo name="plus" size={20} color={Colors.white} /></TouchableOpacity>
      </View>
    );
  }
  return (
    <TouchableOpacity style={s.upload} onPress={onPick}>
      <View style={s.uploadIconWrap}>
        <Image source={Images.upload} resizeMode="contain" style={{ width: wp(8), height: hp(8) }} />
      </View>
      <Text style={[MainStyles.text14, { color: Colors.music, textAlign: "center" }]}>
        Please <Text style={[MainStyles.text14, { textDecorationLine: "underline" }]}>Upload </Text>
        the{"\n"}Photos here
      </Text>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  img: { width: isTablet ? '100%' : wp(90), height: isTablet ? hp(40) : hp(20), marginTop: hp(1), borderRadius: wp(3) },
  fab: {
    position: "absolute", right: wp(1), bottom: wp(1), backgroundColor: Colors.green,
    borderRadius: wp(5), width: wp(6), height: wp(6), alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: Colors.white,
  },
  upload: {
    borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", borderStyle: "dashed",
    width: wp(90), height: hp(20), borderRadius: wp(2), marginTop: hp(1),
    alignItems: "center", paddingVertical: hp(2), paddingHorizontal: wp(20),
  },
  uploadIconWrap: {
    width: wp(14), height: wp(14), borderRadius: wp(1.5), alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(242,242,242,0.08)", marginBottom: hp(1.5),
  },
});

export default BannerSection;
