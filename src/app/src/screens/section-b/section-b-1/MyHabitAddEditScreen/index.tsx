import React, { useCallback, useRef, useState } from "react";
import {useSelector} from "react-redux";

import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import {AIModelSelector} from "@/core/components/section-b";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import {
  ColorModalShow,
  Header,
  IconModalShow,
  ModalShow,
} from "@/core/components/section-b";
import { DefaultLoader, ButtonSignIn } from "@/core/components/section-a";
import { useFocusEffect } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
} from "@/core/utils/responsive";
import RBSheet from "react-native-raw-bottom-sheet";

import {
  BannerSectionV2,
  HabitEditBasicSection,
  HabitEditDateTimeRows,
  HabitEditDescriptionSection,
  HabitEditFrequencyPicker,
  HabitEditStatusPicker,
  HabitEditWeekdayChips,
} from "@/core/components/section-b";
import HabitEditLinksList from "@/core/components/section-b/habit-edit/HabitEditLinksList";
import {
  useHabitAddEditForm,
  useMediaUploadV2,
  useTimePickers,
} from "@/core/hooks";
import { HabitLinkComponent } from "@/core/models/section-b/habit";
import {ensureMinTotalCost, formatCostDecimal} from "@/core/utils";
import {
  makeSelectModelById,
  selectAICompanies,
  selectDefaultSelection,
} from "@/core/redux/ai-models-cost-multiplier";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

function ModalsPanel() {
  return null;
}

const MyHabitAddEditScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const media = useMediaUploadV2();
  const pickers = useTimePickers(route?.params?.habitdata);
  const form = useHabitAddEditForm({ navigation, route, media, pickers });
  // Bottom sheet ref
  const addHabitSheetRef = useRef<RBSheetRef>(null);

  const companies = useSelector(selectAICompanies);
  const { companyName: defaultCompanyName, modelId: defaultModelId } = useSelector(selectDefaultSelection);
  const [selectedCompany, setSelectedCompany] = useState(defaultCompanyName);
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const selectedModel = useSelector(makeSelectModelById(selectedModelId));
  const modelMultiplier = selectedModel?.noCapCostMultiplier ?? 1.0;
  const adjustedCost = form.generateHabitLinkCost * modelMultiplier;
  const totalCost = ensureMinTotalCost(adjustedCost);
  const handleCompanyChange = (companyName: string) => {
    setSelectedCompany(companyName);
    const models = (companies.find(c => c.name === companyName)?.models ?? [])
      .filter(m => m.isVisible !== false);
    const defaultModel = models.find(m => m.isDefault) ?? models[0];
    setSelectedModelId(defaultModel?.id);
  };

  // Force reload FlatList when screen is focused
  const [key, setKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      // Reset the stacks and reload
      form.load?.();
      // Force FlatList to remount by changing key
      setKey((prev) => prev + 1);
    }, [form.load])
  );

  // Bottom sheet options
  const addHabitOptions = [
    {
      id: 1,
      title: "Add HabitLink From Market",
      subtitle: "Browse and add habitLink from the marketplace",
      icon: "store-outline",
      onPress: async () => {
        addHabitSheetRef.current?.close();
        await form.navigateToMarket();
      },
    },
    {
      id: 2,
      title: "Add HabitLink From Friends",
      subtitle: "Browse and copy habitLink from your friends",
      icon: "account-group-outline",
      onPress: async () => {
        addHabitSheetRef.current?.close();
        await form.navigateToFriendsHabits();
      },
    },
    {
      id: 3,
      title: "Add HabitLink From My Library",
      subtitle: "Browse and copy habitLink from your library",
      icon: "account-group-outline",
      onPress: async () => {
        addHabitSheetRef.current?.close();
        await form.navigateToMyLibraryHabitLinks();
      },
    },
    {
      id: 4,
      title: "Add HabitLink With AI",
      subtitle: "Let AI help you build a personalized habit link",
      icon: "robot-outline",
      onPress: () => {
        addHabitSheetRef.current?.close();
        form.setSteerDescription('');
        setTimeout(() => form.setShowAIConfirmModal(true), 350);
      },
    },
  ];

  const onOpenLinkItem = (habitLink: HabitLinkComponent) =>
    navigation.navigate("habitlinks", {
      originScreen: "add_edit_habit",
      habitLink,
      multiple: true,
    });

  const handleAddHabitLinkPress = async () => {
    try {
      //console.log("Attempting to save form before adding habitLinks...");
      // Save the form first
      //const success = await form.saveAndReturnStatus();

      // Only open bottom sheet if save was successful
      if (true) {
        addHabitSheetRef.current?.open();
      }
    } catch (error) {
      console.log("Error saving form:", error);
      // Don't open bottom sheet if save failed
    }
  };

  return (
    <View style={MainStyles.root}>
      <Header txt="Habit" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <BannerSectionV2
          image={media.local}
          remoteImage={form.routeBannerImage}
          onPick={media.pickImg}
          preview={media.preview}
        />

        <HabitEditBasicSection
          name={form.habitname}
          onChangeName={form.setHabitName}
          iconKey={form.icnoname}
          onPressIcon={() => form.setShowIcon(true)}
          color={form.selectedColour}
          onPressColor={() => form.setPopupClr(true)}
        />

        <HabitEditDescriptionSection value={form.des} onChange={form.setDes} />

        <HabitEditStatusPicker
          habitType={form.interestSelect}
          openHabitType={() => form.openModal("interest")}
          status={form.status}
          onChange={form.setStatus}
        />

        <HabitEditDateTimeRows
          startDate={pickers.startDate}
          endDate={pickers.endDate}
          startTime={pickers.startTime}
          endTime={pickers.endTime}
          onPickStartDate={() => pickers.showPicker("startDate", "date")}
          onPickEndDate={() => pickers.showPicker("endDate", "date")}
          onPickStartTime={() => pickers.showPicker("startTime", "time")}
          onPickEndTime={() => pickers.showPicker("endTime", "time")}
          isEditingExisting={form.isEditingExisting}
        />

        <HabitEditFrequencyPicker
          frequency={form.selectedFrequency}
          openFrequency={() => form.openModal("frequency")}
        />

        <HabitEditWeekdayChips
          days={form.alldays}
          selected={form.week}
          onToggle={form.toggleDay}
        />

        <HabitEditLinksList
          items={form.habitlinkitem}
          onEdit={form.editHabitLink}
          onDelete={form.deleteHabitLink}
          onAddItem={onOpenLinkItem}
          canInteract={form.enable}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ButtonSignIn
            text="Add Habit Link"
            wid="45"
            bg={Colors.white}
            bd={Colors.white}
            txcl={Colors.background_color}
            ftn={14}
            top="3"
            mov={handleAddHabitLinkPress}
          />

          <ButtonSignIn
            text="Create Habit Link"
            wid="40"
            bg={Colors.white}
            bd={Colors.white}
            txcl={Colors.background_color}
            ftn={14}
            top="3"
            mov={() => form.save("link")}
          />
        </View>

        <View style={{ height: hp(1) }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ButtonSignIn
            text="Cancel"
            wid="48"
            bg={Colors.background_color}
            bd={Colors.white}
            ftn={14}
            mov={() => navigation.goBack()}
          />
          <ButtonSignIn
            text="Save"
            wid="40"
            bg={Colors.white}
            bd={Colors.white}
            txcl={Colors.background_color}
            ftn={14}
            mov={() => form.save("save")}
          />
        </View>

        <View style={{ height: hp(2) }} />
      </ScrollView>

      <DateTimePickerModal
        isVisible={pickers.show}
        mode={pickers.mode}
        onConfirm={pickers.handleConfirm}
        onCancel={pickers.hide}
        display={Platform.OS === "ios" ? "inline" : "default"}
      />

      <DefaultLoader status={form.loading || media.loading} />
      {/* generic chooser modal */}
      <ModalShow
        name={form.modalName}
        popup={form.modalVisible}
        items={form.modalData}
        onSelect={form.handleSelect}
        onClose={() => form.setModalVisible(false)}
      />
      {/* color + icon pickers (reusing your shared components) */}
      <ColorModalShow
        popup={form.popupclr}
        clor={(_, c) => form.pickColor(c)}
        data={form.allcolor}
        onClose={() => form.setPopupClr(false)}
      />
      <IconModalShow
        popup={form.showicon}
        icn={(_, url) => form.pickIcon(url)}
        onClose={() => form.setShowIcon(false)}
      />
      {/* (optional) extra per-screen modals could live here */}
      <ModalsPanel />

      {/* Add Habit Bottom Sheet */}
      {/* Bottom Sheet */}
      <RBSheet
        ref={addHabitSheetRef}
        useNativeDriver={false}
        height={isTablet ? hp(100) : hp(80)}
        customStyles={{
          container: {
            backgroundColor: "#2C2C2E",
            borderTopLeftRadius: wp(5),
            borderTopRightRadius: wp(5),
          },
          wrapper: {
            backgroundColor: "#000000ab",
          },
          draggableIcon: {
            backgroundColor: Colors.gray,
            width: wp(10),
          },
        }}
        customModalProps={{
          animationType: "fade",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Add Habit </Text>

          <View style={styles.optionsContainer}>
            {addHabitOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={option.onPress}
                style={styles.optionItem}
              >
                <MaterialCommunityIcons
                  name={option.icon as any}
                  size={24}
                  color={Colors.white}
                />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </RBSheet>

      {/* AI Confirm Modal */}
      <Modal
        visible={form.showAIConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => form.setShowAIConfirmModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.aiConfirmOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => form.setShowAIConfirmModal(false)}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.aiConfirmModal}>

              {/* Header */}
              <View style={styles.aiModalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aiModalTitle}>Generate with AI</Text>
                  <Text style={styles.aiModalSubtitle}>HabitLink Generator</Text>
                </View>
                <TouchableOpacity
                  style={styles.aiModalClose}
                  onPress={() => form.setShowAIConfirmModal(false)}
                >
                  <Entypo name="cross" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Credits row */}
              <View style={styles.aiCreditsRow}>
                <Text style={styles.aiCreditsLabel}>Your credits</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                  <Text style={styles.aiCreditsValue}>
                    {(form.revenueCat?.remainingCredits ?? 0).toLocaleString()}
                  </Text>
                </View>
              </View>

              <AIModelSelector
                selectedCompany={selectedCompany}
                selectedModelId={selectedModelId}
                onCompanyChange={handleCompanyChange}
                onModelChange={setSelectedModelId}
              />

              {/* Cost breakdown */}
              <View style={styles.aiCostSection}>
                <View style={styles.aiCostIconWrap}>
                  <MaterialIcons name="auto-awesome" size={24} color="#fff" />
                </View>
                <Text style={styles.aiCostTitle}>Generation Cost</Text>
                <View style={styles.aiCostRow}>
                  <Text style={styles.aiCostDesc}>Items</Text>
                  <Text style={[styles.aiCostDesc, { color: "#E0E0E0" }]}>1</Text>
                </View>
                <View style={styles.aiCostRow}>
                  <Text style={styles.aiCostDesc}>Cost per item</Text>
                  <Text style={[styles.aiCostDesc, { color: "#E0E0E0" }]}>
                    {formatCostDecimal(totalCost)} credits
                  </Text>
                </View>
                <View style={styles.aiCostTotalRow}>
                  <Text style={[styles.aiCostDesc, { fontWeight: "700", color: "#E8E5FF" }]}>
                    Total
                  </Text>
                  <Text style={[styles.aiCostDesc, { fontWeight: "700", color: "#A78BFA" }]}>
                    {formatCostDecimal(totalCost)} credits
                  </Text>
                </View>
                {(form.revenueCat?.remainingCredits ?? 0) < totalCost && (
                  <Text style={styles.aiInsufficientText}>
                    Insufficient credits. Please top up to continue.
                  </Text>
                )}
              </View>

              {/* steerDescription TextArea */}
              <View style={styles.steerContainer}>
                <Text style={styles.steerLabel}>Guide the AI (optional)</Text>
                <TextInput
                  style={styles.steerInput}
                  placeholder="Describe what kind of habit links you want..."
                  placeholderTextColor="#6B7280"
                  multiline
                  textAlignVertical="top"
                  maxLength={300}
                  value={form.steerDescription}
                  onChangeText={form.setSteerDescription}
                />
                <Text style={styles.steerCharCount}>
                  {form.steerDescription.length}/300
                </Text>
              </View>

              {/* Confirm — shown when enough credits */}
              {(form.revenueCat?.remainingCredits ?? 0) >= totalCost && (
                <TouchableOpacity
                  style={styles.aiConfirmBtn}
                  onPress={() => {
                    form.setShowAIConfirmModal(false);
                    setTimeout(() => form.save("link-ai", { adjustedCost: totalCost, modelId: selectedModelId }), 400);
                  }}
                >
                  <MaterialIcons name="auto-awesome" size={16} color="#fff" />
                  <Text style={styles.aiConfirmBtnText}>
                    Generate — {formatCostDecimal(totalCost)} credits
                  </Text>
                </TouchableOpacity>
              )}

              {/* Cancel + Add Credits — shown when insufficient */}
              {(form.revenueCat?.remainingCredits ?? 0) < totalCost && (
                <View style={styles.aiButtonRow}>
                  <TouchableOpacity
                    style={styles.aiCancelBtn}
                    onPress={() => form.setShowAIConfirmModal(false)}
                  >
                    <Text style={styles.aiCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.aiAddCreditsBtn}
                    onPress={() => {
                      form.setShowAIConfirmModal(false);
                      navigation.navigate("account");
                    }}
                  >
                    <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                    <Text style={styles.aiAddCreditsBtnText}>Add Credits</Text>
                  </TouchableOpacity>
                </View>
              )}

            </View>
          </TouchableWithoutFeedback>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default MyHabitAddEditScreen;

const styles = StyleSheet.create({
  sheetTitle: {
    color: Colors.white,
    fontSize: wp(5),
    fontFamily: "poppins_semibold",
    marginBottom: hp(2),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    backgroundColor: Colors.content_back,
    borderRadius: wp(3),
    marginBottom: hp(1.5),
  },
  optionText: {
    color: Colors.white,
    fontSize: wp(4),
    fontFamily: "poppins_regular",
    marginLeft: wp(3),
  },
  // Bottom Sheet Styles
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  bottomSheetTitle: {
    color: Colors.white,
    fontSize: wp(5),
    fontFamily: "poppins_semibold",
    marginBottom: hp(2),
  },
  optionsContainer: {
    marginTop: hp(1),
  },
  optionTextContainer: {
    marginLeft: wp(3),
    flex: 1,
  },
  optionTitle: {
    color: Colors.white,
    fontSize: wp(4),
    fontFamily: "poppins_semibold",
    marginBottom: hp(0.5),
  },
  optionSubtitle: {
    color: Colors.gray,
    fontSize: wp(3.5),
    fontFamily: "poppins_regular",
    lineHeight: wp(4.5),
  },
  // AI Confirm Modal
  aiConfirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: wp(4),
  },
  aiConfirmModal: {
    width: "100%",
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: wp(6),
    borderWidth: 1,
    borderColor: "#333333",
  },
  aiModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2.5),
  },
  aiModalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
  },
  aiModalSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 2,
  },
  aiModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(3),
  },
  aiCreditsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(3),
    borderRadius: 12,
    marginBottom: hp(2),
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  aiCreditsLabel: { fontSize: 13, color: "#9CA3AF" },
  aiCreditsValue: { fontSize: 13, fontWeight: "600", color: "#f59e0b" },
  aiCostSection: {
    alignItems: "center",
    padding: wp(5),
    backgroundColor: "#1e1b4b",
    borderRadius: 14,
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: "#312e81",
  },
  aiCostIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1.5),
  },
  aiCostTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E8E5FF",
    marginBottom: hp(1),
  },
  aiCostDesc: {
    fontSize: 13,
    color: "#9B95C9",
    lineHeight: 20,
    textAlign: "center",
  },
  aiCostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
  },
  aiCostTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#312e81",
  },
  aiInsufficientText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  steerContainer: { marginBottom: hp(2) },
  steerLabel: { fontSize: 13, color: "#9CA3AF", marginBottom: hp(0.8) },
  steerInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    padding: wp(3),
    color: Colors.white,
    fontSize: 13,
    minHeight: hp(10),
    maxHeight: hp(15),
  },
  steerCharCount: {
    color: "#6B7280",
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
  },
  aiConfirmBtn: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#7C3AED",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    marginBottom: hp(1),
  },
  aiConfirmBtnText: { fontSize: 14, fontWeight: "600", color: Colors.white },
  aiButtonRow: { flexDirection: "row", gap: wp(2.5) },
  aiCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
  aiCancelBtnText: { fontSize: 14, fontWeight: "500", color: "#9CA3AF" },
  aiAddCreditsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.4)",
    backgroundColor: "rgba(245,158,11,0.12)",
  },
  aiAddCreditsBtnText: { fontSize: 14, fontWeight: "600", color: "#f59e0b" },
});
