import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const TextBox = ({
  wid = 90,
  val = "",
  onchan = () => {},
  plac = "",
  top = 0,
  btm = 0,
  icn = false,
  hig = 6,
  clr = false,
  back = Colors.content_back,
  edt = true,
}) => {
  return (
    <View
      style={{
        marginTop: hp(top),
        marginBottom: hp(btm),
        width: wp(wid),
        backgroundColor: back,
        borderRadius: wp(3),
        height: hp(hig),
        justifyContent: plac == "Write here..." ? "flex-start" : "center",
        paddingTop: plac == "Write here..." ? hp(0.1) : 0,
      }}
    >
      <TextInput
        style={[
          styles.input,
          {
            width: plac == "Write here..." ? wp(wid) : wp(wid - 10),
            backgroundColor: back,
            height: hp(hig),
            textAlignVertical: "center",
          },
        ]}
        value={val}
        onChangeText={onchan}
        placeholder={plac}
        placeholderTextColor={clr ? "rgba(134, 134, 134, 1)" : Colors.white}
        editable={edt}
        multiline={plac == "Write here..." ? true : false}
      />
      {icn ? (
        <View style={[styles.icnview, { top: hig == 5 ? hp(1.1) : hp(1.8) }]}>
          <MaterialIcons
            name={plac == "Bread" ? "search" : "keyboard-arrow-down"}
            size={24}
            color={Colors.white}
          />
        </View>
      ) : null}
    </View>
  );
};

export default TextBox;

const styles = StyleSheet.create({
  input: {
    borderRadius: wp(3),
    paddingLeft: wp(3),
    textAlignVertical: "center",
    color: Colors.white,
  },
  icnview: {
    position: "absolute",
    right: wp(2),
  },
});
