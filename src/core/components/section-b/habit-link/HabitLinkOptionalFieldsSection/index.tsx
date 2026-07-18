import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { TextBox } from "@/core/components/section-b";
import { MainStyles } from "@/core/constants/styles";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";

type Props = {
  company: string;
  setCompany: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
};

const HabitLinkOptionalFieldsSection: React.FC<Props> = ({
  company, setCompany, location, setLocation,
}) => {
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
        onchan={setCompany}
      />

      <Text style={[MainStyles.text14, { marginTop: hp(2) }]}>
        Location
      </Text>
      <TextBox
        clr={true}
        icn={false}
        plac="12 eve foo, New York, USA"
        top={1}
        val={location}
        onchan={setLocation}
      />
    </View>
  );
};

export default HabitLinkOptionalFieldsSection;

export const styles = StyleSheet.create({
  // reserved for future per-view styles if needed
});
