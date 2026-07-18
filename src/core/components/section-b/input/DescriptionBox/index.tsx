import React from "react";
import { View, Text } from "react-native";
import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";
import { StyleSheet } from "react-native";
type Props = {
  value: string;
  onChange: (v: string) => void;
};

const DescriptionBox: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View>
      <Text style={[MainStyles.text14, { marginTop: hp(2) }]}>Item Description</Text>
      <TextBox icn={false} hig={15} wid={90} plac="Write here..." top={1} clr={true} val={value} onchan={onChange} />
    </View>
  );
};

export default DescriptionBox;

export const styles = StyleSheet.create({});
