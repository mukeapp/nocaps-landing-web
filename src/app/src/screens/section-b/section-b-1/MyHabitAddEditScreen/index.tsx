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
  Image,
} from "react-native";
import {AIModelSelector} from "@/core/components/section-b";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { MainStyles } from "@/core/constants/styles";
import { Colors } from "@/core/constants/Colors";
import { Images } from "@/core/constants/Images";
import WebDashboardHeader from "@/core/components/section-b/header/WebDashboardHeader";
import {
  ColorModalShow,
  IconModalShow,
  ModalShow,
} from "@/core/components/section-b";
import { DefaultLoader } from "@/core/components/section-a";
import { useFocusEffect } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
} from "@/core/utils/responsive";
import RBSheet from "react-native-raw-bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

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

const isWeb = Platform.OS === "web";

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

function ModalsPanel() {
  return null;
}

const HABIT_STATUSES: { key: string; lib: "feather" | "fa6" | "mi"; name: string }[] = [
  { key: "play", lib: "feather", name: "play" },
  { key: "pause", lib: "fa6", name: "pause" },
  { key: "stop", lib: "mi", name: "check-box-outline-blank" },
  { key: "previous", lib: "fa6", name: "backward-step" },
  { key: "next", lib: "fa6", name: "forward-step" },
];

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

  const fmtDate = (d: Date | null) => (d ? moment(d).format("YYYY-MM-DD") : "");
  const fmtTime = (d: Date | null) => (d ? moment(d).local().format("h:mm A") : "");

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
    <View style={[MainStyles.root2, { paddingHorizontal: 0, paddingTop: 0 }]}>
      <WebDashboardHeader title="Habit" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto w-full">
          {/* Page header */}
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            New Habit
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up this habit, then link items to it.
          </p>

          {/* Cover image */}
          <label className="mt-6 block text-sm font-medium text-foreground">
            Cover image
          </label>
          {media.preview ?? media.local ?? form.routeBannerImage ? (
            <div className="relative mt-2 overflow-hidden rounded-2xl">
              <img
                src={(media.preview ?? media.local ?? form.routeBannerImage) as string}
                alt="Cover"
                className="w-full aspect-[16/6] object-cover"
              />
              <button
                onClick={media.pickImg}
                aria-label="Change image"
                className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-[#27AE60] ring-2 ring-white/80"
              >
                <MaterialCommunityIcons name="image-plus-outline" size={18} color={Colors.white} />
              </button>
            </div>
          ) : (
            <button
              onClick={media.pickImg}
              className="mt-2 flex aspect-[16/6] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
            >
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/5">
                <MaterialCommunityIcons name="image-plus-outline" size={26} color={Colors.text_color} />
              </span>
              <span className="text-sm text-muted-foreground">
                Click to upload a cover photo
              </span>
            </button>
          )}

          {/* Name */}
          <label className="mt-6 block text-sm font-medium text-foreground">
            Habit name
          </label>
          <input
            value={form.habitname}
            onChange={(e) => form.setHabitName(e.target.value)}
            placeholder="e.g. Drink water"
            className="mt-2 w-full rounded-xl bg-card px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]"
          />

          {/* Icon + Color */}
          <div className="mt-6 grid max-w-xs grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Icon</label>
              <button
                onClick={() => form.setShowIcon(true)}
                className="mt-2 grid h-14 w-14 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
              >
                <Image
                  source={form.icnoname ? Images[form.icnoname] : Images.dollar}
                  resizeMode="contain"
                  style={{ width: 28, height: 28 }}
                />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Color</label>
              <button
                onClick={() => form.setPopupClr(true)}
                aria-label="Pick color"
                className="mt-2 h-14 w-14 rounded-xl ring-1 ring-white/10 hover:ring-white/25 transition-shadow"
                style={{ backgroundColor: form.selectedColour }}
              />
            </div>
          </div>

          {/* Description */}
          <label className="mt-6 block text-sm font-medium text-foreground">Description</label>
          <textarea
            value={form.des}
            onChange={(e) => form.setDes(e.target.value)}
            placeholder="Write here..."
            rows={4}
            className="mt-2 w-full resize-y rounded-xl bg-card px-4 py-3 text-sm text-foreground ring-1 ring-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]"
          />

          {/* Type + Status */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground">Habit type</label>
              <button
                onClick={() => form.openModal("interest")}
                className="mt-2 flex w-full items-center justify-between rounded-xl bg-card px-4 py-2.5 text-sm ring-1 ring-white/10 hover:bg-white/5 transition-colors"
              >
                <span className={form.interestSelect ? "text-foreground" : "text-muted-foreground"}>
                  {form.interestSelect || "Select type"}
                </span>
                <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.text_color} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Status</label>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-card px-4 py-2.5 ring-1 ring-white/10">
                {HABIT_STATUSES.map((st) => {
                  const active = form.status === st.key;
                  const color = active ? Colors.white : Colors.music;
                  return (
                    <button key={st.key} onClick={() => form.setStatus(st.key)} aria-label={st.key} className="px-1">
                      {st.lib === "feather" ? (
                        <Feather name={st.name as any} size={18} color={color} />
                      ) : st.lib === "mi" ? (
                        <MaterialIcons name={st.name as any} size={18} color={color} />
                      ) : (
                        <FontAwesome6 name={st.name as any} size={18} color={color} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Date / Time */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Start date", val: form.isEditingExisting ? fmtDate(pickers.startDate) : pickers.startDate?.toLocaleDateString(), icon: "calendar-blank-outline", onPick: () => pickers.showPicker("startDate", "date") },
              { label: "End date", val: form.isEditingExisting ? fmtDate(pickers.endDate) : pickers.endDate?.toLocaleDateString(), icon: "calendar-blank-outline", onPick: () => pickers.showPicker("endDate", "date") },
              { label: "Start time", val: form.isEditingExisting ? fmtTime(pickers.startTime) : pickers.startTime?.toLocaleTimeString(), icon: "clock-outline", onPick: () => pickers.showPicker("startTime", "time") },
              { label: "End time", val: form.isEditingExisting ? fmtTime(pickers.endTime) : pickers.endTime?.toLocaleTimeString(), icon: "clock-outline", onPick: () => pickers.showPicker("endTime", "time") },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-foreground">{f.label}</label>
                <button
                  onClick={f.onPick}
                  className="mt-2 flex w-full items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm ring-1 ring-white/10 hover:bg-white/5 transition-colors"
                >
                  <MaterialCommunityIcons name={f.icon as any} size={18} color={Colors.text_color} />
                  <span className={`flex-1 text-left ${f.val ? "text-foreground" : "text-muted-foreground"}`}>
                    {f.val || f.label}
                  </span>
                  <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.text_color} />
                </button>
              </div>
            ))}
          </div>

          {/* Frequency */}
          <label className="mt-6 block text-sm font-medium text-foreground">Frequency</label>
          <button
            onClick={() => form.openModal("frequency")}
            className="mt-2 flex w-full items-center justify-between rounded-xl bg-card px-4 py-2.5 text-sm ring-1 ring-white/10 hover:bg-white/5 transition-colors"
          >
            <span className={form.selectedFrequency ? "text-foreground" : "text-muted-foreground"}>
              {form.selectedFrequency || "Once a week"}
            </span>
            <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.text_color} />
          </button>

          {/* Weekdays */}
          <label className="mt-6 block text-sm font-medium text-foreground">Repeat on</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.alldays?.map((d: any, i: number) => {
              const active = form.week.some((x: any) => x.label === d.label);
              return (
                <button
                  key={i}
                  onClick={() => form.toggleDay(d)}
                  className={
                    active
                      ? "min-w-[3rem] rounded-lg bg-white px-3 py-2 text-sm font-semibold text-neutral-900 transition-colors"
                      : "min-w-[3rem] rounded-lg bg-card px-3 py-2 text-sm font-medium text-muted-foreground ring-1 ring-white/10 hover:bg-white/5 hover:text-foreground transition-colors"
                  }
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Linked items */}
          <div className="mt-6">
            <HabitEditLinksList
              items={form.habitlinkitem}
              onEdit={form.editHabitLink}
              onDelete={form.deleteHabitLink}
              onAddItem={onOpenLinkItem}
              canInteract={form.enable}
            />
          </div>

          {/* Footer actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <button
              onClick={() => navigation.goBack()}
              className="rounded-full px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddHabitLinkPress}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
              >
                <MaterialCommunityIcons name="plus" size={16} color={Colors.white} />
                Add Habit Link
              </button>
              <button
                onClick={() => form.save("link")}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
              >
                Create Habit Link
              </button>
              <button
                onClick={() => form.save("save")}
                className="rounded-full bg-[#2D9CDB] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2D9CDB]/85 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
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
        height={isWeb ? 470 : isTablet ? hp(100) : hp(80)}
        customStyles={{
          container: {
            backgroundColor: "#2C2C2E",
            borderTopLeftRadius: isWeb ? 20 : wp(5),
            borderTopRightRadius: isWeb ? 20 : wp(5),
            ...(isWeb
              ? { maxWidth: 480, width: "100%", alignSelf: "center" }
              : {}),
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
    paddingVertical: isWeb ? 14 : hp(2),
    paddingHorizontal: isWeb ? 14 : wp(3),
    backgroundColor: Colors.content_back,
    borderRadius: isWeb ? 12 : wp(3),
    marginBottom: isWeb ? 10 : hp(1.5),
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
    paddingHorizontal: isWeb ? 20 : wp(4),
    paddingVertical: isWeb ? 20 : hp(2),
  },
  bottomSheetTitle: {
    color: Colors.white,
    fontSize: isWeb ? 18 : wp(5),
    fontFamily: "poppins_semibold",
    marginBottom: isWeb ? 16 : hp(2),
  },
  optionsContainer: {
    marginTop: hp(1),
  },
  optionTextContainer: {
    marginLeft: isWeb ? 12 : wp(3),
    flex: 1,
  },
  optionTitle: {
    color: Colors.white,
    fontSize: isWeb ? 15 : wp(4),
    fontFamily: "poppins_semibold",
    marginBottom: isWeb ? 2 : hp(0.5),
  },
  optionSubtitle: {
    color: Colors.gray,
    fontSize: isWeb ? 13 : wp(3.5),
    fontFamily: "poppins_regular",
    lineHeight: isWeb ? 18 : wp(4.5),
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
