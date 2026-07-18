import React, { useState } from "react";
import { StyleSheet, Image, Text, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
} from "@/core/utils/responsive";
import { useDispatch, useSelector } from "react-redux";

import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import { DefaultLoader, ButtonSignIn } from "@/core/components/section-a";
import { enableAndSaveLocation, skipLocation } from "@/core/services/section-a";

const OnboardLocation = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const userdata = useSelector((state: any) => state?.user?.userdata);

  const [loading, setLoading] = useState(false);

  const handleEnable = () =>
    enableAndSaveLocation({
      collectId: userdata?.collectdata?.id,
      userId: userdata?.collectdata?.userId,
      accessToken: userdata?.accessToken,
      dispatch,
      setLoading,
    });

  const handleSkip = () =>
    skipLocation({
      accessToken: userdata?.accessToken,
      dispatch,
    });

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.headerbox}>
          <Image source={Images.logo} resizeMode="contain" style={styles.logo} />
          <Text style={MainStyles.text20}>NoCaps</Text>
        </View>
        <View style={styles.logomain}>
          <Image source={Images.loc} resizeMode="contain" style={styles.logotitle} />
        </View>
      </View>

      <View style={styles.centerroot}>
        <Text
          style={[
            MainStyles.text20semibold,
            { letterSpacing: 1, marginBottom: hp(2) },
          ]}
        >
          Enable Location
        </Text>

        <Text style={[MainStyles.text14Medium, { paddingHorizontal: isTablet ? wp(15) : wp(5) }]}>
          Take control of your habits with precision – simply set your location
          to align your goals with your surroundings
        </Text>

        <ButtonSignIn
          text="Not Now"
          bg={Colors.darkblack}
          top="5"
          txcl={Colors.white}
          wid="90"
          bd={Colors.darkblack}
          ftn={14}
          mov={handleSkip}
          disabled={loading}
        />

        <ButtonSignIn
          text="Yes, Please"
          bg={Colors.white}
          txcl={Colors.black}
          wid="90"
          mov={handleEnable}
          disabled={loading}
        />
      </View>

      <DefaultLoader status={loading} />
    </View>
  );
};

export default OnboardLocation;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background_color,
    paddingTop: hp(6),
  },
  container: {
    height: isTablet ? hp(35) : hp(30),
  },
  centerroot: {
    flex: 1,
    backgroundColor: Colors.darkblack,
    alignItems: "center",
    paddingTop: isTablet ? hp(20) : hp(15),
  },
  headerbox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: wp(8),
    height: wp(8),
    marginRight: wp(3),
  },
  logomain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logotitle: {
    width: isTablet ? wp(40) : wp(48),
    height: isTablet ? wp(40) : wp(48),
    top: hp(8),
    zIndex: 100,
  },
  footer: {
    flex: 1,
    width: wp(100),
    justifyContent: "flex-end",
    paddingBottom: hp(5),
  },
  skipbtn: {
    width: wp(20),
    height: wp(20),
    marginRight: wp(5),
  },
  sub: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
