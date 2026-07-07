import {Images} from "@/core/constants/Images";
import {HabitStyles} from "@/core/styles/HabitStyles";
import {getDefaultImageUrl} from "@/core/utils/utilities/images";
import React, {useEffect, useState} from "react";
import {Image, Platform, StyleSheet, Text, View} from "react-native";
import { widthPercentageToDP as _wp, heightPercentageToDP as _hp, isTablet } from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _wp(p);
const hp = (p: number): number =>
  isWeb ? +(p * 3.8).toFixed(1) : _hp(p);

type Props = {
  remoteImage: string | null; // existing banner if editing
  onPick: () => void;
  overlayText?: string; // Text to display on the image
};

export default function BannerSectionV3({
  remoteImage,
  onPick,
  overlayText = "Banner",
}: Props) {
  const imageUrl = remoteImage ? remoteImage : getDefaultImageUrl();
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    setImageLoadError(false);
  }, [remoteImage]);

  return (
    <View style={styles.container}>
      <Image
        source={imageLoadError ? Images.default_banner_000 : { uri: imageUrl }}
        style={styles.imgbannerFull}
        resizeMode="cover"
        onError={() => setImageLoadError(true)}
      />

      {/* Text overlay at bottom right */}
      <View style={styles.textOverlayContainer}>
        <View style={styles.textBackground}>
          <Text style={styles.overlayText}>{overlayText}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  textOverlayContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  textBackground: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  overlayText: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
  },
  imgbannerFull: {
    width: isTablet ? '100%' : wp(100),
    height: isTablet ? hp(40) : hp(20),
    marginTop: hp(1),
    borderRadius: wp(3),
  },
});
