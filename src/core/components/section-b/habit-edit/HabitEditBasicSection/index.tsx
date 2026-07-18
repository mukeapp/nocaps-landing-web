import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { HabitStyles } from "@/core/styles/HabitStyles";
import { Images } from "@/core/constants/Images";
import { widthPercentageToDP as wp } from "@/core/utils/responsive";

type Props = {
  name: string;
  onChangeName: (v: string) => void;
  iconKey: string;
  onPressIcon: () => void;
  color: string;
  onPressColor: () => void;
};

export default function HabitEditBasicSection({
  name, onChangeName, iconKey, onPressIcon, color, onPressColor,
}: Props) {
  return (
    <View style={[MainStyles.viewtwo, { marginTop: 8 }]}>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Habit Name</Text>
        <TextBox icn={false} wid={61} val={name} plac="Habit Name" top={1} clr="true" onchan={onChangeName} />
      </View>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Icon</Text>
        <TouchableOpacity style={HabitStyles.iconback} onPress={onPressIcon}>
          <Image source={iconKey ? Images[iconKey] : Images.dollar} resizeMode="contain" style={HabitStyles.dollar} />
        </TouchableOpacity>
      </View>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Color</Text>
        <TouchableOpacity style={[HabitStyles.colorview, { backgroundColor: color }]} onPress={onPressColor} />
      </View>
    </View>
  );
}
