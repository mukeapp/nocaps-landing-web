import {TextBox} from "@/core/components/section-b";
import {MainStyles} from "@/core/constants/styles";
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {heightPercentageToDP as hp} from "@/core/utils/responsive";

type Props = {
  company: string;
  setCompany: (v: string) => void;
};

const HabitLinkCompanySection: React.FC<Props> = ({ company, setCompany }) => {
  return (
    <View>
      <Text style={[MainStyles.text14, { marginTop: hp(2) }]}>
        Company (optional)
      </Text>
      <TextBox
        clr={true}
        icn={false}
        plac="FoodMart"
        top={1}
        val={company}
        onchan={setCompany as () => void}
      />
    </View>
  );
};

export default HabitLinkCompanySection;

export const styles = StyleSheet.create({});
