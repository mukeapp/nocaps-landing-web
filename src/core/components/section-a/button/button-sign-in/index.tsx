import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "@/core/utils/responsive";
import { Colors } from "@/core/constants/Colors";

const ButtonSignIn = ({
  text = "",
  ftn = 16,
  hig = "6",
  mov = () => {},
  wid = "90",
  top = "0",
  btom = "0",
  bg = Colors.button_back,
  bd = Colors.button_back,
  txcl = Colors.white,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.box,
        {
          width: wp(wid),
          height: hp(hig),
          marginTop: hp(top),
          marginBottom: hp(btom),
          backgroundColor: bg,
          borderColor: bd,
        },
      ]}
      onPress={mov}
      disabled={disabled}
    >
      <Text
        style={[
          styles.boxText,
          {
            color: txcl,
            fontSize: ftn,
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonSignIn;

const styles = StyleSheet.create({
  box: {
    borderRadius: wp(3),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    fontFamily: "bold",
    letterSpacing: 1,
  },
});
