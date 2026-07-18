import React from "react";
import { View, Text } from "react-native";
import { TextBox } from "@/core/components/section-b";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "@/core/utils/responsive";
import { MainStyles } from "@/core/constants/styles";

type Props = {
  name: string;
  company: string;
  itemUrl?: string;
  location: string;
  onChangeName: (v: string) => void;
  onChangeCompany: (v: string) => void;
  onChangeItemUrl: (v: string) => void;
  onChangeLocation: (v: string) => void;
};

const HabitLinkItemNameCompanyLocation: React.FC<Props> = ({
  name,
  company,
  itemUrl,
  location,
  onChangeName,
  onChangeCompany,
  onChangeItemUrl,
  onChangeLocation,
}) => {
  return (
    <View style={{ marginTop: hp(2) }}>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Item Name</Text>
        <TextBox clr={true} icn={false} wid={90} plac="Bread" top={1} val={name} onchan={onChangeName} />
      </View>

      <Text style={[MainStyles.text14, styles.mt]}>Company (optional)</Text>
      <TextBox clr={true} icn={false} wid={90} plac="FoodMart" top={1} val={company} onchan={onChangeCompany} />

      <Text style={[MainStyles.text14, styles.mt]}>Item URL (optional)</Text>
      <TextBox clr={true} icn={false} wid={90} plac="www.foodmart.com/bread" top={1} val={itemUrl} onchan={onChangeItemUrl} />

      <Text style={[MainStyles.text14, styles.mt]}>Location (optional)</Text>
      <TextBox
        clr={true}
        icn={false}
        wid={90}
        plac="12 ave foo, New York, USA"
        top={1}
        val={location}
        onchan={onChangeLocation}
      />
    </View>
  );
};

export default HabitLinkItemNameCompanyLocation;

export const styles = StyleSheet.create({
  mt: { marginTop: hp(2) },
});
