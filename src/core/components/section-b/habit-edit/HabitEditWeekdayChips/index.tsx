import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";
import {HabitStyles} from "@/core/styles";

type Props = { days: any[]; selected: any[]; onToggle: (d: any) => void };

export default function HabitEditWeekdayChips({ days, selected, onToggle }: Props) {
  return (
    <View style={[MainStyles.viewtwo, { marginTop: hp(2) }]}>
      {days?.map((d, i) => {
        const active = selected.some((x) => x.label === d.label);
        return (
          <TouchableOpacity
            key={i}
            style={[HabitStyles.week, { borderColor: active ? Colors.white : "transparent" }]}
            onPress={() => onToggle(d)}
          >
            <Text style={MainStyles.text14}>{d.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
