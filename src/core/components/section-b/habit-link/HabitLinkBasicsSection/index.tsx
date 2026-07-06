import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";

import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { Images } from "@/core/constants/Images";

type Props = {
  name: string;
  setName: (v: string) => void;
  iconName: string;
  onOpenIcon: () => void;
  color: string;
  onOpenColor: () => void;
};

const HabitLinkBasicsSection: React.FC<Props> = ({
  name, setName, iconName, onOpenIcon, color, onOpenColor,
}) => {
  return (
    <View style={MainStyles.viewtwo}>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Habit Link Name</Text>
        <TextBox
          icn={false}
          wid={61}
          plac="Name"
          top={1}
          val={name}
          onchan={setName}
        />
      </View>

      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Icon</Text>
        <TouchableOpacity style={styles.iconback} onPress={onOpenIcon}>
          <Image
            source={iconName ? Images[iconName] : Images.dollar}
            resizeMode="contain"
            style={styles.dollar}
          />
        </TouchableOpacity>
      </View>

      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Color</Text>
        <TouchableOpacity
          style={[styles.colorview, { backgroundColor: color }]}
          onPress={onOpenColor}
        />
      </View>
    </View>
  );
};

export default HabitLinkBasicsSection;

export const styles = StyleSheet.create({
  iconback: {
    width: wp(12),
    height: wp(12),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(45, 156, 219, 0.15)",
    borderRadius: wp(3),
    marginTop: hp(1),
  },
  dollar: {
    width: wp(7),
    height: wp(7),
  },
  colorview: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(3),
    marginTop: hp(1),
  },
});
