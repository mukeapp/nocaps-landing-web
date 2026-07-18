import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useMemo, useState} from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "@/core/utils/responsive";
import {useDispatch, useSelector} from "react-redux";

import {ButtonSignIn} from "@/core/components/section-a";
import {Colors} from "@/core/constants/Colors";
import {Images} from "@/core/constants/Images";
import {MainStyles} from "@/core/constants/styles";
import {handleAcceptTerms} from "@/core/services/section-a";
import {openPrivacy, openTOS} from "@/core/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RouteParams = {
  uid: string;
  email?: string | null;
  accessToken: string;
  refreshToken: string;
};

// ---------------------------------------------------------------------------
// Sub-component
// ---------------------------------------------------------------------------

type CheckboxRowProps = {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  style?: object;
};

const CheckboxRow: React.FC<CheckboxRowProps> = ({
  checked,
  onToggle,
  children,
  style,
}) => (
  <View style={[styles.row, style]}>
    <Pressable onPress={onToggle} hitSlop={8}>
      <MaterialIcons
        name={checked ? "check-box" : "check-box-outline-blank"}
        size={20}
        color={Colors.inputback}
      />
    </Pressable>
    <View style={styles.checkboxContent}>{children}</View>
  </View>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

const TermService = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params as RouteParams;
  const dispatch = useDispatch();
  const tempdata = useSelector((state: any) => state?.user?.tempdata);

  const auth = useMemo(
    () => ({
      uid: params.uid,
      email: params.email,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
    }),
    [params],
  );

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [wantsNews, setWantsNews] = useState(false);
  const [loading, setLoading] = useState(false);

  const onContinue = () =>
    handleAcceptTerms({
      acceptedTerms,
      wantsNews,
      tempdata,
      auth,
      dispatch,
      navigation,
      setLoading,
    });

  return (
    <View style={MainStyles.root}>
      <Text style={[MainStyles.text20semibold, styles.appTitle]}>NoCap</Text>
      <Image source={Images.logo} resizeMode="contain" style={styles.logo} />

      <View style={styles.container}>
        <View style={styles.box}>
          {/* Icon */}
          <View style={styles.lockIcon}>
            <MaterialIcons name="lock" size={23} color={Colors.white} />
          </View>

          <Text style={styles.title}>Terms of Service</Text>

          {/* Required consent */}
          <CheckboxRow
            checked={acceptedTerms}
            onToggle={() => setAcceptedTerms((prev) => !prev)}
          >
            <View style={MainStyles.viewtwo}>
              <Text style={MainStyles.text12black}>
                I agree with Nocap&apos;s{" "}
              </Text>
              <Pressable onPress={openTOS} hitSlop={8}>
                <Text style={MainStyles.text12boldblack}>Terms of Service</Text>
              </Pressable>
              <Text style={MainStyles.text12black}> and</Text>
            </View>
            <View style={MainStyles.viewtwo}>
              <Pressable onPress={openPrivacy} hitSlop={8}>
                <Text style={MainStyles.text12boldblack}>Privacy Policy</Text>
              </Pressable>
              <Text style={MainStyles.text12black}> (Required)</Text>
            </View>
          </CheckboxRow>

          {/* Optional newsletter */}
          <CheckboxRow
            checked={wantsNews}
            onToggle={() => setWantsNews((prev) => !prev)}
            style={styles.newsletterRow}
          >
            <Text style={MainStyles.text12black}>
              Send me news from NoCap and its partners
            </Text>
          </CheckboxRow>

          {/* Continue */}
          <View style={styles.buttonWrapper}>
            <ButtonSignIn
              text="Continue"
              bg={Colors.black}
              top="3"
              txcl={Colors.white}
              wid="40"
              hig="5"
              ftn={14}
              mov={onContinue}
              disabled={loading}
            />
          </View>
        </View>
      </View>

      {loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

export default TermService;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  appTitle: {
    textAlign: "center",
  },
  logo: {
    width: wp("18%"),
    height: wp("18%"),
    alignSelf: "center",
    marginTop: hp("1%"),
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: hp("15%"),
  },
  box: {
    width: wp("90%"),
    backgroundColor: Colors.white,
    borderRadius: wp("2%"),
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
  },
  lockIcon: {
    width: wp("12%"),
    height: wp("12%"),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.black,
    borderRadius: wp("6%"),
    alignSelf: "center",
    marginBottom: hp("2%"),
  },
  title: {
    color: Colors.black,
    textAlign: "center",
    marginBottom: hp("2%"),
    fontSize: 18,
    fontFamily: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxContent: {
    marginLeft: wp("1%"),
    flexShrink: 1,
  },
  newsletterRow: {
    marginTop: hp("1%"),
  },
  buttonWrapper: {
    alignItems: "center",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
