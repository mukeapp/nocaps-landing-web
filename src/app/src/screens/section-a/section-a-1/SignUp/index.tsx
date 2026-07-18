// src/core/screens/SignUpScreen.tsx
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {useState} from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
  fs,
} from "@/core/utils/responsive";
import {useDispatch} from "react-redux";

import {ButtonSignIn, DefaultLoader} from "@/core/components/section-a";
import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import {handleEmailSignUp} from "@/core/services/section-a";
import {openPrivacy, openTOS} from "@/core/utils/utilities/links";

const SignUpScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Text style={[MainStyles.text20, { marginBottom: hp(5) }]}>
              Create an account
            </Text>

            {/* First Name */}
            <View style={styles.inputRow}>
              <Ionicons name="person-circle-outline" size={fs(18)} color={Colors.white} />
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor={Colors.text_color}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Last Name */}
            <View style={styles.inputRow}>
              <Ionicons name="person-circle-outline" size={fs(18)} color={Colors.white} />
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor={Colors.text_color}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Username */}
            <View style={styles.inputRow}>
              <Ionicons name="person-circle-outline" size={fs(18)} color={Colors.white} />
              <TextInput
                value={userName}
                onChangeText={setUserName}
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={Colors.text_color}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* Email */}
            <View style={styles.inputRow}>
              <Feather name="mail" size={fs(18)} color={Colors.white} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={Colors.text_color}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                inputMode="email"
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View style={styles.inputRow}>
              <Feather name="lock" size={fs(18)} color={Colors.white} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.text_color}
                secureTextEntry={!showPassword}
                textContentType="password"
                autoCorrect={false}
                returnKeyType="next"
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={fs(18)} color={Colors.white} />
              </Pressable>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputRow}>
              <Feather name="lock" size={fs(18)} color={Colors.white} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={Colors.text_color}
                secureTextEntry={!showConfirmPassword}
                textContentType="password"
                autoCorrect={false}
                returnKeyType="done"
              />
              <Pressable onPress={() => setShowConfirmPassword((s) => !s)} hitSlop={8}>
                <Feather
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={fs(18)}
                  color={Colors.white}
                />
              </Pressable>
            </View>

            {/* Submit */}
            <ButtonSignIn
              text={loading ? "Creating Account..." : "Sign Up"}
              bg={Colors.white}
              top="3"
              txcl={Colors.darkblack}
              btom="3"
              mov={() =>
                handleEmailSignUp({
                  firstName,
                  lastName,
                  userName,
                  email,
                  password,
                  confirmPassword,
                  dispatch,
                  navigation,
                  setLoading,
                })
              }
              disabled={loading}
            />

            {/* Terms */}
            <Text
              style={[
                MainStyles.text10,
                { fontSize: fs(11), color: Colors.text_color, textAlign: "center" },
              ]}
            >
              By registering, you confirm that you accept our
            </Text>
            <View style={styles.inlineLinks}>
              <Pressable onPress={openTOS} hitSlop={8}>
                <Text style={MainStyles.text12Bold}>Terms of service</Text>
              </Pressable>
              <Text
                style={[
                  MainStyles.text10,
                  { fontSize: fs(11), color: Colors.text_color, textAlign: "center" },
                ]}
              >
                {"  "}and{"  "}
              </Text>
              <Pressable onPress={openPrivacy} hitSlop={8}>
                <Text style={MainStyles.text12Bold}>Privacy policy</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DefaultLoader status={loading} />
    </View>
  );
};

export default SignUpScreen;

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
  inlineLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  or: {
    width: wp(80),
    height: hp(4),
    tintColor: "white",
    alignSelf: "center",
    marginVertical: hp(4),
  },
  social: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.content_back,
    width: "100%",
    height: hp(6),
    borderRadius: wp(2),
  },
  googleIcon: {
    width: wp(8),
    height: wp(8),
    marginRight: wp(3),
  },
});
