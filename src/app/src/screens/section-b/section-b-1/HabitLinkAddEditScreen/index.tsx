import React from "react";
import {KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";
import {heightPercentageToDP as hp} from "@/core/utils/responsive";

import {ButtonSignIn, DefaultLoader} from "@/core/components/section-a";
import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";

import {
  BannerSectionV2,
  HabitLinkBasicsSection,
  HabitLinkCompanySection,
  HabitLinkDescriptionSection,
  HabitLinkLocationSection,
  Header,
  ModalsPanelV2,
} from "@/core/components/section-b";

import {useHabitLinkAddEditForm, useMediaUploadV2} from "@/core/hooks/";

type Props = { navigation: any; route: any };

const HabitLinkAddEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const media = useMediaUploadV2();
  const form = useHabitLinkAddEditForm({ navigation, route, media });

  return (
    <View style={MainStyles.root}>
      <Header txt="HABIT LINK" show={false} navigation={navigation} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BannerSectionV2
          image={media.local}
          remoteImage={form.routeBannerImage}
          onPick={media.pickImg}
          preview={media.preview}
        />

        <HabitLinkBasicsSection
          name={form.name}
          setName={form.setName}
          iconName={form.iconName}
          onOpenIcon={form.openIconPicker}
          color={form.color}
          onOpenColor={form.openColorPicker}
        />

        <HabitLinkCompanySection
          company={form.company}
          setCompany={form.setCompany}
        />
        <HabitLinkLocationSection
          location={form.location}
          setLocation={form.setLocation}
        />

        <HabitLinkDescriptionSection
          description={form.description}
          setDescription={form.setDescription}
        />

        <View style={[MainStyles.viewtwo, { marginVertical: hp(3) }]}>
          <ButtonSignIn
            text="Cancel"
            wid="43"
            bg={Colors.background_color}
            bd={Colors.white}
            ftn={14}
            mov={() => navigation.goBack()}
          />
          <ButtonSignIn
            text="Save"
            wid="43"
            bg={Colors.white}
            bd={Colors.white}
            txcl={Colors.background_color}
            ftn={14}
            mov={form.onSave}
          />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      <DefaultLoader status={form.loading} />

      <ModalsPanelV2
        colorModal={{
          open: form.colorModalOpen,
          data: form.colorsList,
          onClose: () => form.setColorModalOpen(false),
          onPick: form.onPickColor,
        }}
        iconModal={{
          open: form.iconModalOpen,
          data: form.iconsList,
          onClose: () => form.setIconModalOpen(false),
          onPick: form.onPickIcon,
        }}
      />
    </View>
  );
};

export default HabitLinkAddEditScreen;
