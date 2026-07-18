import {TextBox} from "@/core/components/section-b";
import {MainStyles} from "@/core/constants/styles";
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {heightPercentageToDP as hp} from "@/core/utils/responsive";

type Props = {
  itemUrl?: string;
  onChangeItemUrl: (v: string) => void;
};

const HabitLinkItemUrlSection: React.FC<Props> = ({
  itemUrl,
  onChangeItemUrl,
}) => {
  return (
    <View>
      <Text style={[MainStyles.text14, { marginTop: hp(2) }]}>
        Item URL (optional)
      </Text>
      <TextBox
        clr={true}
        icn={false}
        wid={90}
        plac="www.foodmart.com/bread"
        top={1}
        val={itemUrl}
        onchan={onChangeItemUrl as () => void}
      />
    </View>
  );
};

export default HabitLinkItemUrlSection;

export const styles = StyleSheet.create({});
