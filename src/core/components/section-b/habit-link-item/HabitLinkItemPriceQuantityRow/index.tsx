import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
  fs,
} from "@/core/utils/responsive";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  price: string;
  symbol?: string;
  quantity: number;
  onChangePrice: (v: string) => void;
  onDecrement: () => void;
  onIncrement: () => void;
};

const HabitLinkItemPriceQuantityRow: React.FC<Props> = ({
  price,
  symbol = "",
  quantity,
  onChangePrice,
  onDecrement,
  onIncrement,
}) => {
  const handlePriceChange = (txt: string) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(txt) || txt === "") onChangePrice(txt);
  };

  return (
    <View style={[MainStyles.viewtwo, styles.mt]}>
      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Item Price</Text>
        <View style={styles.inputWrap}>
          <View style={[styles.mid, { alignSelf: "center", width: isTablet ? wp(28) : wp(44) }]}>
            <Text style={MainStyles.text16white}>{symbol}</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={handlePriceChange}
              placeholder="-"
              placeholderTextColor={"rgba(134, 134, 134, 1)"}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </View>

      <View style={MainStyles.newview}>
        <Text style={MainStyles.text14}>Item Quantity</Text>
        <View style={styles.inputWrap}>
          <TouchableOpacity style={styles.minus} onPress={onDecrement}>
            <AntDesign name="minus" size={fs(20)} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.mid}>
            <Text style={[MainStyles.text16white, { marginLeft: wp(2) }]}>{quantity}</Text>
          </View>
          <TouchableOpacity style={styles.plus} onPress={onIncrement}>
            <AntDesign name="plus" size={fs(20)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HabitLinkItemPriceQuantityRow;

export const styles = StyleSheet.create({
  mt: { marginTop: hp(2) },
  input: {
    width: isTablet ? wp(12) : wp(25),
    height: isTablet ? hp(4) : hp(5),
    paddingHorizontal: wp(2),
    color: Colors.white,
    fontSize: fs(14),
  },
  inputWrap: {
    width: isTablet ? wp(28) : wp(44),
    height: isTablet ? hp(4.5) : hp(5.5),
    backgroundColor: Colors.content_back,
    borderRadius: wp(3),
    marginTop: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  minus: {
    backgroundColor: Colors.text_background,
    width: isTablet ? wp(8) : wp(13),
    height: isTablet ? hp(4.5) : hp(5.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mid: {
    height: isTablet ? hp(4.5) : hp(5.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    backgroundColor: Colors.text_background,
    width: isTablet ? wp(8) : wp(13),
    height: isTablet ? hp(4.5) : hp(5.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
