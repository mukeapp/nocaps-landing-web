import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";

type Props = {
  frequency: string | null;
  openFrequency: () => void;
};

export default function HabitEditFrequencyPicker({ frequency, openFrequency }: Props) {
  return (
    <>
      <Text style={[MainStyles.text14, { marginTop: hp(2) }]}>Frequency</Text>
      <TouchableOpacity onPress={openFrequency}>
        <TextBox icn={true} wid={90} plac="Once a week" top={1} val={frequency || ""} edt={false} />
      </TouchableOpacity>
    </>
  );
}
