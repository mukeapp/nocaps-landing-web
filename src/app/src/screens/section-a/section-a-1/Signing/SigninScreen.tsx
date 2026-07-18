import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useDispatch, useSelector } from "react-redux";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
  fs,
} from "@/core/utils/responsive";

import Constants from "expo-constants";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { MainStyles } from "@/core/constants/styles";
import { DefaultLoader, ButtonSignIn } from "@/core/components/section-a";

import { handleEmailSignIn } from "@/core/services/section-a/login/handle-email-sign-in";
import { handleGoogleSignIn } from "@/core/services/section-a/login/handle-google-sign-in";

type RootState = any;

const SigninScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const savedEmail = useSelector(
    (state: RootState) => state?.user?.email ?? ""
  );

  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!savedEmail);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GoogleSignin.configure({
      // REQUIRED for Firebase auth: the Web client ID
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      // Include Android OAuth client ID (from Google Cloud console)
      //androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      // Optional iOS client if you created one
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
  }, []);

  const onGooglePress = useCallback(async () => {
    try {
      setLoading(true);
      // Android-only: ensure Play Services are available
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) {
        // user cancelled or no saved credential
        setLoading(false);
        console.log("Google Sign-In cancelled or failed");
        Alert.alert("Google Sign-In was cancelled or failed.");
        return;
      }
      // ✅ v16 shape: response.data is the "User" object (has idToken, user profile, etc.)
      const idToken = response?.data?.idToken;
      if (!idToken) throw new Error("No idToken returned from Google Sign-In");

      const userProfile = response?.data?.user;
      console.log("Google Sign-In user profile:", userProfile);

      // Extract user information
      const firstName = userProfile.givenName || "";
      const lastName = userProfile.familyName || "";
      const fullName = userProfile.name || "";
      const email = userProfile.email || "";
      const photoUrl = userProfile.photo || "";

      // create a temp username from email
      const username = email ? email.split("@")[0] : "";

      console.log("User Info:", {
        firstName,
        lastName,
        fullName,
        email,
        photoUrl
      });



      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens?.accessToken;

      const fakeResult = {
        type: "success",
        authentication: {
          idToken,
          accessToken
        },
        // Add user profile data to pass along
        userProfile: {
          first: firstName,
          last: lastName,
          username,
          fullName,
          email,
          photoUrl
        }
      } as const;

      await handleGoogleSignIn({
        result: fakeResult as any,
        dispatch,
        navigation,
        rememberMe,
        setLoading,
      });
    } catch (err: any) {
      setLoading(false);
      if (isErrorWithCode(err)) {
        switch (err.code) {
          case statusCodes.SIGN_IN_CANCELLED:
          case statusCodes.IN_PROGRESS:
            return;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            return Alert.alert(
              "Google Play Services not available or outdated."
            );
          default:
            return Alert.alert(
              "Google Sign-In Error",
              err.message ?? "Unknown error"
            );
        }
      }
      Alert.alert("Google Sign-In Error", err?.message ?? "Unknown error");
    }
  }, [dispatch, navigation, rememberMe]);

  return (
    <View style={MainStyles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <View style={styles.formWrap}>
      <View style={styles.header}>
        <Image source={Images.logo} resizeMode="contain" style={styles.logo} />
        <Text style={MainStyles.text16white}>NoCaps</Text>
      </View>

      <Text style={MainStyles.text20}>Let’s Sign You In</Text>
      <Text
        style={[
          MainStyles.text12Regular,
          {
            color: Colors.text_color,
            marginTop: hp(0.5),
            marginBottom: hp(5),
          },
        ]}
      >
        Welcome back, you’ve been missed!
      </Text>

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
        />
      </View>

      <View style={styles.inputRow}>
        <Feather name="lock" size={fs(18)} color={Colors.white} />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor={Colors.text_color}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={fs(18)}
            color={Colors.white}
          />
        </Pressable>
      </View>

      <View style={MainStyles.viewtwo}>
        <Pressable
          style={[MainStyles.viewone, { marginBottom: 0 }]}
          onPress={() => setRememberMe(!rememberMe)}
          hitSlop={8}
        >
          <Octicons
            name="dot-fill"
            size={fs(22)}
            color={rememberMe ? Colors.white : Colors.content_back}
          />
          <Text
            style={[
              MainStyles.text12semibold,
              { color: Colors.text_color, marginLeft: wp(1.5) },
            ]}
          >
            Remember me
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("recoverpassword")}
          hitSlop={8}
        >
          <Text style={MainStyles.text12semibold}>Forgot Password?</Text>
        </Pressable>
      </View>

      <ButtonSignIn
        text={loading ? "Signing In..." : "Sign In"}
        bg={Colors.white}
        top="7"
        txcl={Colors.darkblack}
        btom="3"
        mov={() =>
          handleEmailSignIn({
            email,
            password,
            rememberMe,
            dispatch,
            navigation,
            setLoading,
          })
        }
        disabled={loading}
      />

      <View style={styles.signupRow}>
        <Text
          style={[
            MainStyles.text10,
            { fontSize: fs(11), color: Colors.text_color },
          ]}
        >
          Don’t have an account?
        </Text>
        <Pressable onPress={() => navigation.navigate("signup")} hitSlop={8}>
          <Text style={MainStyles.text12Bold}> Sign Up</Text>
        </Pressable>
      </View>

      <Image source={Images.or} resizeMode="contain" style={styles.or} />

      {/* Google Sign In */}
      <Pressable
        style={styles.social}
        onPress={onGooglePress}
        disabled={loading}
        hitSlop={8}
      >
        <Image source={Images.google} style={styles.googleIcon} />
        <Text style={MainStyles.text16Simple}>Continue with Google</Text>
      </Pressable>

      <Text style={styles.version}>NoCaps v{Constants.expoConfig?.version ?? '1.0.0'}</Text>
      </View>{/* formWrap */}
      </KeyboardAvoidingView>
      <DefaultLoader status={loading} />
    </View>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  formWrap: {
    width: isTablet ? wp(70) : '100%',
    alignSelf: 'center',
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: hp(5),
  },
  logo: {
    width: wp(6),
    height: wp(6),
    marginRight: wp(2),
  },
  inputRow: {
    width: '100%',
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
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  or: {
    width: wp(80),
    height: hp(4),
    tintColor: "white",
    alignSelf: "center",
    marginVertical: hp(2),
  },
  social: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.content_back,
    width: '100%',
    height: isTablet ? hp(7) : hp(6),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.inuptborder,
  },
  googleIcon: {
    width: wp(8),
    height: wp(8),
    marginRight: wp(3),
  },
  version: {
    fontSize: fs(12),
    color: Colors.text_color,
    fontFamily: "regular",
    textAlign: "center",
    marginTop: "auto",
    paddingBottom: hp(2),
    opacity: 0.5,
  },
});
