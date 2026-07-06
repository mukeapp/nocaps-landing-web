import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";

type Props = {
  description?: string;
  setDescription: (v: string) => void;
};

const HabitLinkDescriptionSection: React.FC<Props> = ({ description, setDescription }) => {
  return (
    <View>
      <Text style={[MainStyles.text14, { marginTop: hp(2) }]}>Description</Text>
      <TextBox
        icn={false}
        hig={15}
        wid={90}
        plac="Write here..."
        top={1}
        clr={true}
        val={description}
        onchan={setDescription}
      />
    </View>
  );
};

export default HabitLinkDescriptionSection;

export const styles = StyleSheet.create({
  // reserved for future per-view styles if needed
});