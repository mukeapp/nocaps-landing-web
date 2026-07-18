import { useDispatch } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  isTablet,
  fs,
} from "@/core/utils/responsive";

import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import {
  ProfileEditBanner,
} from "@/core/components/section-b";
import {
  DefaultLoader as Loader,
  ButtonSignIn,
} from "@/core/components/section-a";
import { Header2 } from "@/core/components/section-b";
import {
  useMediaUpload,
  useMediaUploadV2,
  useProfileEditForm,
} from "@/core/hooks";
import { ProfileEditForm } from "@/core/components/section-b-2";

const ProfileEditScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const media1 = useMediaUploadV2();
  const media2 = useMediaUpload();

  const form = useProfileEditForm({ navigation, route, media1, media2, dispatch });

  return (
    <View style={MainStyles.root2}>
      <Header2
        title="Edit Profile"
        titleTextFormat={1}
        titleVisibilityIcon={false}
        showSettingsIcon={true}
        navigation={navigation}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileEditBanner
          bannerPreview={media1.preview ?? form.bannerImage}
          onBannerPick={media1.pickImg}
          profilePreview={media2.preview ?? form.userProfileImage}
          onProfilePick={media2.pickImg}
        />

        <ProfileEditForm
          firstName={form.firstName}
          setFirstName={form.setFirstName}
          lastName={form.lastName}
          setLastName={form.setLastName}
          userName={form.userName}
          setUserName={form.setUserName}
          description={form.description}
          setDescription={form.setDescription}
        />

        <View style={styles.footer}>
          <ButtonSignIn
            text="Cancel"
            wid={isTablet ? "80" : "43"}
            bg={Colors.background_color}
            bd={Colors.white}
            ftn={fs(14)}
            mov={() => navigation.goBack()}
          />
          <ButtonSignIn
            text="Save"
            wid={isTablet ? "80" : "43"}
            bg={Colors.white}
            bd={Colors.white}
            txcl={Colors.background_color}
            ftn={fs(14)}
            mov={form.onSave}
          />
        </View>

        <Loader status={form.loading} />
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: isTablet ? wp(5) : wp(4),
    marginVertical: hp(3),
  },
});
