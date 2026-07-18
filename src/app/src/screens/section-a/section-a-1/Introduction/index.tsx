import {useNavigation} from "@react-navigation/native";
import React, {useCallback} from "react";
import {Image, Pressable, StatusBar, StyleSheet, Text, View} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
  fs,
} from "@/core/utils/responsive";
import {SafeAreaView} from "react-native-safe-area-context";

import {Colors} from "@/core/constants/Colors";
import {Images} from "@/core/constants/Images";

type Nav = {
  navigate: (screen: string) => void;
};

const FADE_STEPS = 14;
// background_color = #0D0D0D → rgb(13,13,13)
// content_back     = rgba(25,25,25,1)
const topFadeSlices = Array.from({ length: FADE_STEPS }, (_, i) => (
  <View
    key={i}
    style={{
      flex: 1,
      backgroundColor: `rgba(13,13,13,${((FADE_STEPS - i) / FADE_STEPS).toFixed(3)})`,
    }}
  />
));
const bottomFadeSlices = Array.from({ length: FADE_STEPS }, (_, i) => (
  <View
    key={i}
    style={{
      flex: 1,
      backgroundColor: `rgba(25,25,25,${((i + 1) / FADE_STEPS).toFixed(3)})`,
    }}
  />
));

type Props = { navigation: any; route: any };

const IntroductionScreen: React.FC<Props> = ({ navigation, route }) => {

  const goSignIn = useCallback(() => {
    navigation.navigate("signin");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Brand row */}
      <View style={styles.brandRow}>
        <Image
          source={Images.logo}
          resizeMode="contain"
          style={styles.logo}
          accessible
          accessibilityLabel="NoCap logo"
        />
        <View style={styles.brandText}>
          <Text style={styles.brandName}>NoCaps</Text>
          <Text style={styles.tagline}>Habit Intelligence</Text>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Image
          source={require("@/core/assets/images/splash-screen.png")}
          resizeMode="cover"
          style={styles.heroImage}
          accessible
          accessibilityLabel="NoCap hero"
        />

        {/* Top fade — background color to transparent */}
        <View style={styles.fadeTop} pointerEvents="none">
          {topFadeSlices}
        </View>

        {/* Bottom fade — transparent to card color */}
        <View style={styles.fadeBottom} pointerEvents="none">
          {bottomFadeSlices}
        </View>
      </View>

      {/* Bottom card */}
      <View style={styles.card}>
        <Text style={styles.title}>Habits + Social + AI = NoCaps</Text>

        <Text style={styles.subtitle}>
          NoCap with Habit Intelligence is the ultimate habit sharing app. Level up your routines, achieve your
          goals, and share your journey with the world.
        </Text>

        <Pressable
          onPress={goSignIn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Continue to sign in"
          style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
        >
          <Text style={styles.ctaBtnText}>Get Started</Text>
        </Pressable>

        <Pressable
          onPress={goSignIn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Skip introduction"
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default IntroductionScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background_color,
  },

  /* Brand row */
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
    height: hp(9),
  },
  logo: {
    width: isTablet ? wp(12) :wp(9),
    height: isTablet ? wp(12) :wp(9),
    marginRight: wp(3),
  },
  brandText: {
    flexDirection: "column",
  },
  brandName: {
    fontSize: fs(18),
    color: Colors.white,
    fontFamily: "bold",
  },
  tagline: {
    fontSize: fs(12),
    color: Colors.gray,
    fontFamily: "semibold",
    marginTop: 1,
  },

  /* Hero */
  hero: {
    flex: 1,
    overflow: "hidden",
  },
  heroImage: {
    width: isTablet ? '100%' : wp(100),
    height: isTablet ? '100%' : hp(50),
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: hp(14),
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: hp(14),
  },

  /* Bottom card */
  card: {
    backgroundColor: Colors.content_back,
    //borderTopLeftRadius: 28,
    //borderTopRightRadius: 28,
    paddingHorizontal: wp(6),
    paddingTop: hp(4),
    paddingBottom: hp(5),
  },
  title: {
    fontSize: fs(20),
    color: Colors.white,
    fontFamily: "bold",
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: hp(1.5),
  },
  subtitle: {
    fontSize: fs(14),
    color: Colors.gray,
    fontFamily: "regular",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: hp(3.5),
  },

  /* CTA */
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: fs(14),
    height: hp(6.5),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.5),
  },
  ctaBtnPressed: {
    opacity: 0.8,
  },
  ctaBtnText: {
    fontSize: fs(16),
    color: Colors.white,
    fontFamily: "bold",
    letterSpacing: 0.5,
  },

  /* Skip */
  skipBtn: {
    alignItems: "center",
    paddingVertical: hp(1),
  },
  skipText: {
    fontSize: fs(14),
    color: Colors.gray,
    fontFamily: "semibold",
  },
});
