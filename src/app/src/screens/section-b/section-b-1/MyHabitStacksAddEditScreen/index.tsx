import {MainStyles} from "@/core/constants/styles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {Images} from "@/core/constants/Images";
import WebDashboardHeader from "@/core/components/section-b/header/WebDashboardHeader";
import {AIModelSelector} from "@/core/components/section-b";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  isTablet,
} from "@/core/utils/responsive";

import {DefaultLoader} from "@/core/components/section-a";
import {Colors} from "@/core/constants/Colors";

import {
  HabitListSection,
  ModalsPanel,
} from "@/core/components/section-b";
import {
  useHabitStackAddEditForm,
  useMediaUpload,
  usePickers,
} from "@/core/hooks";
import {
  HabitLinkComponent
} from "@/core/models/section-b";
import {ensureMinTotalCost, formatCostDecimal} from "@/core/utils";
import {
  makeSelectModelById,
  selectAICompanies,
  selectDefaultSelection,
} from "@/core/redux/ai-models-cost-multiplier";

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

const MyHabitStacksAddEditScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  // media
  const media = useMediaUpload();

  // form & actions
  const form = useHabitStackAddEditForm({ navigation, route, media });
  // pickers (sector/focus/unit/priority, icon, color)
  const pickers = usePickers({ form });
  // Bottom sheet ref
  const addHabitSheetRef = useRef<RBSheetRef>(null);

  const companies = useSelector(selectAICompanies);
  const { companyName: defaultCompanyName, modelId: defaultModelId } = useSelector(selectDefaultSelection);
  const [selectedCompany, setSelectedCompany] = useState(defaultCompanyName);
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const selectedModel = useSelector(makeSelectModelById(selectedModelId));
  const modelMultiplier = selectedModel?.noCapCostMultiplier ?? 1.0;
  const adjustedCost = form.generateHabitCost * modelMultiplier;
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
    }, [form.load]),
  );

  // Bottom sheet options
  const addHabitOptions = [
    {
      id: 1,
      title: "Add Habit From Market",
      subtitle: "Browse and add habit from the marketplace",
      icon: "store-outline",
      onPress: async () => {
        addHabitSheetRef.current?.close();
        await form.navigateToMarket();
      },
    },
    {
      id: 2,
      title: "Add Habit From Friends",
      subtitle: "Browse and copy habit from your friends",
      icon: "account-group-outline",
      onPress: async () => {
        addHabitSheetRef.current?.close();
        await form.navigateToFriendsHabits();
      },
    },
    {
      id: 3,
      title: "Add Habit From My Library",
      subtitle: "Browse and copy habit from my library",
      icon: "account-outline",
      onPress: async () => {
        addHabitSheetRef.current?.close();
        await form.navigateToMyLibraryHabits();
      },
    },
    {
      id: 4,
      title: "Add Habit With AI",
      subtitle: "Let AI help you build a personalized habit",
      icon: "robot-outline",
      onPress: () => {
        addHabitSheetRef.current?.close();
        form.setSteerDescription("");
        setTimeout(() => form.setShowAIConfirmModal(true), 350);
      },
    },
  ];

  const onOpenLinkItem = (habitLink: HabitLinkComponent) =>
    navigation.navigate("habitlinks", {
      originScreen: "add_edit_habitstack",
      habitLink,
      multiple: true,
    });

  const handleGoToHabitAI = async () => {
    form.setShowAIConfirmModal(false);
    const success = await form.saveAndReturnStatus();
    if (success) form.navigateToHabitsAIScreen({ adjustedCost: totalCost, modelId: selectedModelId });
  };

  const handleAddHabitPress = async () => {
    try {
      //console.log("Attempting to save form before adding habit...");
      // Save the form first
      const success = await form.saveAndReturnStatus();

      // Only open bottom sheet if save was successful
      if (success) {
        addHabitSheetRef.current?.open();
      }
    } catch (error) {
      console.log("Error saving form:", error);
      // Don't open bottom sheet if save failed
    }
  };

  return (
    <View style={[MainStyles.root2, { paddingHorizontal: 0, paddingTop: 0 }]}>
      <WebDashboardHeader title="Habit Stack" onBack={() => navigation.goBack()} />

      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto w-full">
          {/* Page header */}
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            New Habit Stack
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up your stack, then add habits to it.
          </p>

          {/* Cover image */}
          <label className="mt-6 block text-sm font-medium text-foreground">
            Cover image
          </label>
          {media.preview ?? form.bannerImage ? (
            <div className="relative mt-2 overflow-hidden rounded-2xl">
              <img
                src={(media.preview ?? form.bannerImage) as string}
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
            Habit stack name
          </label>
          <input
            value={form.stackname}
            onChange={(e) => form.setStackname(e.target.value)}
            placeholder="e.g. Morning Routine"
            className="mt-2 w-full rounded-xl bg-card px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]"
          />

          {/* Icon + Color */}
          <div className="mt-6 grid max-w-xs grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Icon</label>
              <button
                onClick={pickers.openIcon}
                className="mt-2 grid h-14 w-14 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
              >
                <Image
                  source={form.iconKey ? Images[form.iconKey] : Images.dollar}
                  resizeMode="contain"
                  style={{ width: 28, height: 28 }}
                />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Color</label>
              <button
                onClick={pickers.openColor}
                aria-label="Pick color"
                className="mt-2 h-14 w-14 rounded-xl ring-1 ring-white/10 hover:ring-white/25 transition-shadow"
                style={{ backgroundColor: form.iconColor }}
              />
            </div>
          </div>

          {/* Visibility */}
          <p className="mt-7 mb-2 text-sm font-medium text-foreground">Visibility</p>
          <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-white/10 divide-y divide-white/5">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm text-foreground">Public</p>
                <p className="text-xs text-muted-foreground">Visible to everyone</p>
              </div>
              <Switch
                value={form.isPublic}
                onValueChange={form.setIsPublic}
                trackColor={{ false: Colors.gray, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm text-foreground">Hide from friends</p>
                <p className="text-xs text-muted-foreground">
                  Friends won&apos;t see this stack
                </p>
              </div>
              <Switch
                value={form.hideFromFriends}
                onValueChange={form.setHideFromFriends}
                trackColor={{ false: Colors.gray, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </div>
          </div>

          {/* Selectors */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Sector", val: form.sectorVal, onPick: () => pickers.openMain("habitstack") },
              { label: "Focus", val: form.focusVal, onPick: () => pickers.openMain("focus") },
              { label: "Unit", val: form.unitVal, onPick: () => pickers.openMain("unit") },
              { label: "Priority", val: form.priorityVal, onPick: () => pickers.openMain("priority") },
            ].map((sel) => (
              <div key={sel.label}>
                <label className="block text-sm font-medium text-foreground">{sel.label}</label>
                <button
                  onClick={sel.onPick}
                  className="mt-2 flex w-full items-center justify-between rounded-xl bg-card px-4 py-2.5 text-sm ring-1 ring-white/10 hover:bg-white/5 transition-colors"
                >
                  <span className={sel.val ? "text-foreground" : "text-muted-foreground"}>
                    {sel.val || "Select item"}
                  </span>
                  <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.text_color} />
                </button>
              </div>
            ))}
          </div>

          {/* # of persons */}
          <label className="mt-6 block text-sm font-medium text-foreground"># of persons</label>
          <div className="mt-2 inline-flex items-center overflow-hidden rounded-xl bg-card ring-1 ring-white/10">
            <button
              onClick={form.decPersons}
              aria-label="Decrease"
              className="grid h-11 w-12 place-items-center hover:bg-white/5 transition-colors"
            >
              <AntDesign name="minus" size={18} color={Colors.white} />
            </button>
            <div className="flex h-11 w-20 items-center justify-center gap-2 border-x border-white/10">
              <MaterialIcons name="person-outline" size={16} color={Colors.white} />
              <span className="text-sm font-semibold text-foreground">{form.personsCount}</span>
            </div>
            <button
              onClick={form.incPersons}
              aria-label="Increase"
              className="grid h-11 w-12 place-items-center hover:bg-white/5 transition-colors"
            >
              <AntDesign name="plus" size={18} color={Colors.white} />
            </button>
          </div>

          {/* Description */}
          <label className="mt-6 block text-sm font-medium text-foreground">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => form.setDescription(e.target.value)}
            placeholder="Write here..."
            rows={4}
            className="mt-2 w-full resize-y rounded-xl bg-card px-4 py-3 text-sm text-foreground ring-1 ring-white/10 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9CDB]"
          />

          {/* Added habits */}
          <div className="mt-2">
            <HabitListSection
              user={form.userdata.collectdata}
              username={form.username}
              habits={form.habits}
              expandedIds={form.expandedIds}
              onToggleExpand={form.toggleExpand}
              menuId={form.menuId}
              onOpenMenu={form.openMenu}
              onEdit={form.editHabit}
              onDelete={form.deleteHabit}
              onOpenItem={onOpenLinkItem}
              hideSwap={true}
            />
          </div>

          {/* Footer actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <button
              onClick={form.cancel}
              className="rounded-full px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddHabitPress}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
              >
                <MaterialCommunityIcons name="plus" size={16} color={Colors.white} />
                Add Habit
              </button>
              <button
                onClick={() => form.save(false)}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
              >
                Create Habit
              </button>
              <button
                onClick={() => form.save(true)}
                className="rounded-full bg-[#2D9CDB] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2D9CDB]/85 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </ScrollView>

      <DefaultLoader status={form.loading || media.loading} />

      <ModalsPanel
        // main list picker
        modalVisible={pickers.modalVisible}
        tempName={pickers.tempName}
        tempData={pickers.tempData}
        onSelect={pickers.onSelectMain}
        onClose={pickers.closeMain}
        // color
        popupclr={pickers.colorVisible}
        colorData={form.allColors}
        onPickColor={pickers.pickColor}
        onCloseColor={pickers.closeColor}
        // icon
        showicon={pickers.iconVisible}
        iconData={form.allIcons}
        onPickIcon={pickers.pickIcon}
        onCloseIcon={pickers.closeIcon}
      />

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
                  <Text style={styles.aiModalSubtitle}>Habit Generator</Text>
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
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
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
                  <Text style={[styles.aiCostDesc, { color: "#E0E0E0" }]}>
                    1
                  </Text>
                </View>
                <View style={styles.aiCostRow}>
                  <Text style={styles.aiCostDesc}>Cost per item</Text>
                  <Text style={[styles.aiCostDesc, { color: "#E0E0E0" }]}>
                    {formatCostDecimal(totalCost)} credits
                  </Text>
                </View>
                <View style={styles.aiCostTotalRow}>
                  <Text
                    style={[
                      styles.aiCostDesc,
                      { fontWeight: "700", color: "#E8E5FF" },
                    ]}
                  >
                    Total
                  </Text>
                  <Text
                    style={[
                      styles.aiCostDesc,
                      { fontWeight: "700", color: "#A78BFA" },
                    ]}
                  >
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
                  placeholder="Describe what kind of habits you want..."
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

              {/* Confirm (enough credits) */}
              {(form.revenueCat?.remainingCredits ?? 0) >= totalCost && (
                <TouchableOpacity
                  style={styles.aiConfirmBtn}
                  onPress={handleGoToHabitAI}
                >
                  <MaterialIcons name="auto-awesome" size={16} color="#fff" />
                  <Text style={styles.aiConfirmBtnText}>
                    Generate — {formatCostDecimal(totalCost)} credits
                  </Text>
                </TouchableOpacity>
              )}

              {/* Cancel + Add Credits (insufficient) */}
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

export default MyHabitStacksAddEditScreen;

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
  aiModalTitle: { fontSize: 17, fontWeight: "600", color: Colors.white },
  aiModalSubtitle: { fontSize: 14, color: "#9CA3AF", marginTop: 2 },
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
