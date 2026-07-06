import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import React from "react";
import {KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";

import {DefaultLoader, FooterButtons} from "@/core/components/section-a";

import {
  BannerPicker,
  DescriptionBox,
  HabitLinkCompanySection,
  HabitLinkItemNameSection,
  HabitLinkItemPriceQuantityRow,
  HabitLinkItemScoreInput,
  HabitLinkItemTopBar,
  HabitLinkItemUrlSection,
  HabitLinkLocationSection,
} from "@/core/components/section-b";
import {useHabitLinkItemAddEditForm} from "@/core/hooks";

type Props = { navigation: any; route: any };

const HabitLinkItemAddEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const form = useHabitLinkItemAddEditForm({ navigation, route });

  return (
    <View style={MainStyles.root}>
      <HabitLinkItemTopBar
        title={`${form.habitLinkName} : Item`}
        onBack={form.goBack}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <ScrollView showsVerticalScrollIndicator={false}>
        <BannerPicker
          imageLocalUri={form.imageLocalUri}
          imageRemoteUrl={form.imageRemoteUrl}
          onPick={form.pickImageAndUpload}
        />

        <HabitLinkItemNameSection
          name={form.name}
          onChangeName={form.setName}
        />

        <HabitLinkCompanySection
          company={form.company}
          setCompany={form.setCompany}
        />

        <HabitLinkItemUrlSection
          itemUrl={form.itemUrl}
          onChangeItemUrl={form.setItemUrl}
        />

        <HabitLinkLocationSection
          location={form.location}
          setLocation={form.setLocation}
        />

        <HabitLinkItemPriceQuantityRow
          price={form.price}
          symbol={form.symbol?.symbol}
          quantity={form.quantity}
          onChangePrice={form.setPrice}
          onDecrement={() => form.setQuantity(Math.max(0, form.quantity - 1))}
          onIncrement={() => form.setQuantity(form.quantity + 1)}
        />

        {/* 👇 INTEGRATE NEW SCORE INPUT HERE */}
        <HabitLinkItemScoreInput
          score={form.score}
          onChangeScore={form.setScore}
        />

        <DescriptionBox
          value={form.description}
          onChange={form.setDescription}
        />
        <FooterButtons
          onCancel={form.goBack}
          onSave={form.save}
          cancelWidth="48"
          saveWidth="40"
          saveText="Save"
          cancelBg={Colors.background_color}
        />
      </ScrollView>
      </KeyboardAvoidingView>

      <DefaultLoader status={form.loading} />
    </View>
  );
};

export default HabitLinkItemAddEditScreen;
