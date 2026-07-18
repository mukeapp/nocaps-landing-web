import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { MainStyles } from "@/core/constants/styles";
import { HabitStyles } from "@/core/styles/HabitStyles";
import { Colors } from "@/core/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { widthPercentageToDP as wp } from "@/core/utils/responsive";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  onPickStartDate: () => void;
  onPickEndDate: () => void;
  onPickStartTime: () => void;
  onPickEndTime: () => void;
  isEditingExisting: boolean;
};

export default function HabitEditDateTimeRows(p: Props) {
  const dateFmt = (d: Date | null) => (d ? moment(d).format("YYYY-MM-DD") : "");
  const timeFmt = (d: Date | null) => (d ? moment(d).local().format("h:mm A") : "");

  return (
    <>
      <View style={[MainStyles.viewtwo, { marginTop: 8 }]}>
        <TouchableOpacity style={HabitStyles.dateview} onPress={p.onPickStartDate}>
          <Feather name="calendar" size={18} color={Colors.text_color} />
          <TextInput style={HabitStyles.input} value={p.isEditingExisting ? dateFmt(p.startDate) : p.startDate?.toLocaleDateString()} placeholder="Start Date" placeholderTextColor={Colors.text_color} editable={false} />
          <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={HabitStyles.dateview} onPress={p.onPickEndDate}>
          <Feather name="calendar" size={18} color={Colors.text_color} />
          <TextInput style={HabitStyles.input} value={p.isEditingExisting ? dateFmt(p.endDate) : p.endDate?.toLocaleDateString()} placeholder="End Date" placeholderTextColor={Colors.text_color} editable={false} />
          <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={[MainStyles.viewtwo, { marginTop: 8 }]}>
        <TouchableOpacity style={HabitStyles.dateview} onPress={p.onPickStartTime}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={19} color={Colors.text_color} />
          <TextInput style={HabitStyles.input} value={p.isEditingExisting ? timeFmt(p.startTime) : p.startTime?.toLocaleTimeString()} placeholder="Start Time" placeholderTextColor={Colors.text_color} editable={false} />
          <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={HabitStyles.dateview} onPress={p.onPickEndTime}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={19} color={Colors.text_color} />
          <TextInput style={HabitStyles.input} value={p.isEditingExisting ? timeFmt(p.endTime) : p.endTime?.toLocaleTimeString()} placeholder="End Time" placeholderTextColor={Colors.text_color} editable={false} />
          <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </>
  );
}
