import React from "react";
import { Text } from "react-native";
import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";

export default function HabitEditDescriptionSection({
  value, onChange,
}: { value: string; onChange: (t: string) => void }) {
  return (
    <>
      <Text style={[MainStyles.text14, { marginTop: hp(2) }]}>Habit Description</Text>
      <TextBox icn={false} hig={15} wid={90} plac="Write here..." top={1} clr={true} val={value} onchan={onChange} />
    </>
  );
}
