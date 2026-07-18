import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";
import { TextBox } from "@/core/components/section-b";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { MainStyles } from "@/core/constants/styles";

type Props = {
  stackname: string;
  onChangeName: (v: string) => void;
  iconKey?: string;           // e.g. "dollar"
  onPickIcon: () => void;
  color: string;
  onPickColor: () => void;
};

const BasicsInputRow: React.FC<Props> = ({ stackname, onChangeName, iconKey, onPickIcon, color, onPickColor }) => {
  return (
    <View style={[styles.row, { marginTop: hp(2) }]}>
      <View style={styles.col}>
        <Text style={MainStyles.text14}>Habit Stack Name</Text>
        <TextBox icn={false} wid={61} top={1} plac="Stack Name" edt={true} val={stackname} onchan={onChangeName} />
      </View>

      <View style={styles.col}>
        <Text style={MainStyles.text14}>Icon</Text>
        <TouchableOpacity style={styles.iconback} onPress={onPickIcon}>
          <Image source={iconKey ? Images[iconKey] : Images.dollar} resizeMode="contain" style={styles.dollar} />
        </TouchableOpacity>
      </View>

      <View style={styles.col}>
        <Text style={MainStyles.text14}>Color</Text>
        <TouchableOpacity style={[styles.colorview, { backgroundColor: color }]} onPress={onPickColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  col: { },
  iconback: {
    width: wp(12), height: wp(12), alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.text_background, borderRadius: wp(3), marginTop: hp(1),
  },
  colorview: { width: wp(12), height: wp(12), borderRadius: wp(3), marginTop: hp(1) },
  dollar: { width: wp(7), height: wp(7) },
});

export default BasicsInputRow;
