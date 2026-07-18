import {TextBox} from "@/core/components/section-b";
import {MainStyles} from "@/core/constants/styles";
import React from "react";
import {StyleSheet, Text, View} from "react-native";

type Props = {
  name: string;
  onChangeName: (v: string) => void;
};

const HabitLinkItemNameSection: React.FC<Props> = ({ name, onChangeName }) => {
  return (
    <View style={MainStyles.newview}>
      <Text style={MainStyles.text14}>Item Name</Text>
      <TextBox
        clr={true}
        icn={false}
        wid={90}
        plac="Bread"
        top={1}
        val={name}
        onchan={onChangeName}
      />
    </View>
  );
};

export default HabitLinkItemNameSection;

export const styles = StyleSheet.create({});
