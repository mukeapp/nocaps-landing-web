// src/core/screens/RecoverPassword.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
  fs,
} from "@/core/utils/responsive";

import { Colors } from "@/core/constants/Colors";
import { MainStyles } from "@/core/constants/styles";
import { DefaultLoader, ButtonSignIn } from "@/core/components/section-a";
import { handlePasswordReset } from "@/core/services/section-a";

const RecoverPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={MainStyles.root}>
      {/* Back */}
      <Pressable
        style={styles.headerbox}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        hitSlop={8}
      >
        <AntDesign name="arrow-left" size={fs(20)} color={Colors.black} />
      </Pressable>

      <View style={styles.form}>
        <Text style={MainStyles.text20}>Password Recovery</Text>
        <Text
          style={[
            MainStyles.text12Regular,
            { color: Colors.text_color, marginTop: hp(0.5), marginBottom: hp(5) },
          ]}
        >
          Please enter your email address to recover
        </Text>

        {/* Email */}
        <View style={styles.inputRow}>
          <Feather name="mail" size={fs(18)} color={Colors.white} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Enter Email Address"
            placeholderTextColor={Colors.text_color}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            inputMode="email"
            textContentType="emailAddress"
            returnKeyType="send"
            onSubmitEditing={() =>
              handlePasswordReset({ email, setLoading, navigation })
            }
          />
        </View>

        {/* Submit */}
        <ButtonSignIn
          text={loading ? "Sending..." : "Send Email"}
          bg={Colors.white}
          top="3"
          txcl={Colors.darkblack}
          btom="3"
          mov={() => handlePasswordReset({ email, setLoading, navigation })}
          disabled={loading}
        />
      </View>

      <DefaultLoader status={loading} />
    </View>
  );
};

export default RecoverPassword;

const styles = StyleSheet.create({
  form: {
    width: isTablet ? wp(70) : "100%",
    alignSelf: "center",
  },
  headerbox: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(3),
  },
  inputRow: {
    width: "100%",
    height: isTablet ? hp(6.5) : hp(5.5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.inuptborder,
    backgroundColor: Colors.content_back,
    marginBottom: hp(1.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
  },
  input: {
    flex: 1,
    marginHorizontal: wp(2),
    fontSize: fs(12),
    fontFamily: "regular",
    color: Colors.white,
  },
});
