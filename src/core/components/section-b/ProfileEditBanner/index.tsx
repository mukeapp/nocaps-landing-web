import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
  fs,
} from "@/core/utils/responsive";
import BannerSectionV4 from "../banner/BannerSectionV4";

type Props = {
  bannerPreview?: string | null;
  onBannerPick: () => void;
  profilePreview?: string | null;
  onProfilePick: () => void;
};

const ProfileEditBanner: React.FC<Props> = ({
  bannerPreview,
  onBannerPick,
  profilePreview,
  onProfilePick,
}) => {
  const AVATAR = isTablet ? wp(22) : wp(20);

  return (
    <View style={styles.wrapper}>
      <BannerSectionV4
        preview={bannerPreview}
        onPick={onBannerPick}
        titleText3="the Banner Image here"
      />

      {/* Avatar circle — overlaps the bottom of the banner */}
      <TouchableOpacity
        onPress={onProfilePick}
        activeOpacity={0.8}
        style={[
          styles.avatarWrapper,
          {
            width: AVATAR,
            height: AVATAR,
            borderRadius: AVATAR / 2,
            bottom: -(AVATAR / 2),
          },
        ]}
      >
        <Image
          source={
            profilePreview
              ? { uri: profilePreview }
              : (Images as any).userPlaceholder || Images.logo
          }
          style={[styles.avatar, { borderRadius: AVATAR / 2 }]}
          resizeMode="cover"
        />
        <View style={styles.cameraButton}>
          <Feather name="camera" size={fs(10)} color={Colors.black} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileEditBanner;

const styles = StyleSheet.create({
  wrapper: {
    overflow: "visible",
    marginBottom: isTablet ? hp(8) : wp(12),
  },
  avatarWrapper: {
    position: "absolute",
    left: wp(4),
    backgroundColor: Colors.black,
    borderWidth: 3,
    borderColor: Colors.white,
    overflow: "visible",
    zIndex: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 11,
    borderWidth: 1,
    borderColor: Colors.content_back,
  },
});
