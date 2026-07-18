import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MainStyles } from "@/core/constants/styles";
import { TextBox } from "@/core/components/section-b";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/core/constants/Colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "@/core/utils/responsive";

type Props = {
  status: string;
  onChange: (s: any) => void;
  habitType: string | null;
  openHabitType: () => void;
};

export default function HabitEditStatusPicker({ status, onChange, habitType, openHabitType }: Props) {
  return (
    <View style={[MainStyles.viewtwo, { marginTop: 8 }]}>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Habit Type</Text>
        <TouchableOpacity onPress={openHabitType}>
          <TextBox icn={true} wid={43} plac="Habit Name" clr="true" top={1} val={habitType || ""} edt={false} />
        </TouchableOpacity>
      </View>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Habit Status</Text>
        <View style={styles.musicview}>
          <TouchableOpacity onPress={() => onChange("play")}>
            <Feather name="play" size={18} color={status === "play" ? Colors.white : Colors.music} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChange("pause")}>
            <FontAwesome6 name="pause" size={18} color={status === "pause" ? Colors.white : Colors.music} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChange("stop")}>
            <MaterialIcons name="check-box-outline-blank" size={18} color={status === "stop" ? Colors.white : Colors.music} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChange("previous")}>
            <FontAwesome6 name="backward-step" size={18} color={status === "previous" ? Colors.white : Colors.music} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChange("next")}>
            <FontAwesome6 name="forward-step" size={18} color={status === "next" ? Colors.white : Colors.music} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  musicview: {
    width: wp(44),
    height: hp(6),
    backgroundColor: Colors.content_back,
    borderRadius: wp(3),
    marginTop: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
  },
});