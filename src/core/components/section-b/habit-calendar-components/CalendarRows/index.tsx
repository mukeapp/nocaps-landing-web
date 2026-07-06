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
  onPickStartDate: () => void;
  onPickEndDate: () => void;
  isEditingExisting: boolean;
  startDateTitle?: string;
  endDateTitle?: string;
  showEndDate?: boolean;
};

export default function CalendarRows({
  startDate,
  endDate,
  onPickStartDate,
  onPickEndDate,
  isEditingExisting,
  startDateTitle = "Start Date",
  endDateTitle = "End Date",
  showEndDate = false,
}: Props) {
  const dateFmt = (d: Date | null) => (d ? moment(d).format("YYYY-MM") : "");

  return (
    <>
      <View style={[MainStyles.viewtwo, { marginTop: 8 }]}>
        <TouchableOpacity
          style={HabitStyles.dateview}
          onPress={onPickStartDate}
        >
          <Feather name="calendar" size={18} color={Colors.text_color} />
          <TextInput
            style={HabitStyles.input}
            value={
              isEditingExisting
                ? dateFmt(startDate)
                : startDate?.toLocaleDateString()
            }
            placeholder={startDateTitle}
            placeholderTextColor={Colors.text_color}
            editable={false}
          />
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>
        { showEndDate && (
          <TouchableOpacity style={HabitStyles.dateview} onPress={onPickEndDate}>
            <Feather name="calendar" size={18} color={Colors.text_color} />
            <TextInput
              style={HabitStyles.input}
              value={
                isEditingExisting
                ? dateFmt(endDate)
                : endDate?.toLocaleDateString()
            }
            placeholder={endDateTitle}
            placeholderTextColor={Colors.text_color}
            editable={false}
          />
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>
        )}
      </View>
    </>
  );
}
