import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";

type Props = {
  stackname: string;
  onChangeName: (v: string) => void;
  iconKey?: string;
  onOpenIcon: () => void;
  color: string;
  onOpenColor: () => void;
};

const BasicsSection: React.FC<Props> = ({ stackname, onChangeName, iconKey, onOpenIcon, color, onOpenColor }) => (
  <View style={[MainStyles.viewtwo, { marginTop: hp(2) }]}>
    <View style={MainStyles.newview}>
      <Text style={MainStyles.text14}>Habit Stack Name</Text>
      <TextBox icn={false} wid={61} top={1} plac="Stack Name" edt val={stackname} onchan={onChangeName} />
    </View>

    <View style={MainStyles.newview}>
      <Text style={MainStyles.text14}>Icon</Text>
      <TouchableOpacity style={s.iconback} onPress={onOpenIcon}>
        <Image source={iconKey ? Images[iconKey] : Images.dollar} resizeMode="contain" style={s.dollar} />
      </TouchableOpacity>
    </View>

    <View style={MainStyles.newview}>
      <Text style={MainStyles.text14}>Color</Text>
      <TouchableOpacity style={[s.colorview, { backgroundColor: color }]} onPress={onOpenColor} />
    </View>
  </View>
);

const s = StyleSheet.create({
  iconback: {
    width: wp(12), height: wp(12), alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)", borderRadius: wp(3), marginTop: hp(1),
  },
  dollar: { width: wp(7), height: wp(7) },
  colorview: { width: wp(12), height: wp(12), borderRadius: wp(3), marginTop: hp(1) },
});

export default BasicsSection;
