import {
  CalendarRows,
  EmptyState,
  HabitLinkCostBar,
  HabitLinkItemPreview,
  HabitLinkItemsListV2,
  HabitLinkTabs,
  TopBar,
} from "@/core/components/section-b";
import BannerSectionV3 from "@/core/components/section-b/banner/BannerSectionV3";
import WebHabitLinkHeader from "@/core/components/section-b/habit-links/WebHabitLinkHeader";
import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import {useHabitLinks, useTimeDefaultPickers} from "@/core/hooks";
import {
  makeSelectModelById,
  selectAICompanies,
  selectDefaultSelection,
} from "@/core/redux/ai-models-cost-multiplier";
import {ensureMinTotalCost, formatCostAsNumber, formatCostDecimal, getGroupTotalCost} from "@/core/utils";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {AIModelSelector} from "@/core/components/section-b";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
  isTablet,
} from "@/core/utils/responsive";

const isWeb = Platform.OS === "web";
const wp = (p: number | string): number =>
  isWeb ? +(Number(p) * 3.8).toFixed(1) : _wp(p);
const hp = (p: number | string): number =>
  isWeb ? +(Number(p) * 3.8).toFixed(1) : _hp(p);

type Props = { navigation: any; route: any };

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

const HabitLinksScreen: React.FC<Props> = ({ navigation, route }) => {
  const form = useHabitLinks({ navigation, route });

  const pickers = useTimeDefaultPickers(route?.params?.habitdata);
  const [key, setKey] = useState(0);
  const [fastSave, setFastSave] = useState(true);
  const companies = useSelector(selectAICompanies);
  const { companyName: defaultCompanyName, modelId: defaultModelId } = useSelector(selectDefaultSelection);
  const [selectedCompany, setSelectedCompany] = useState(defaultCompanyName);
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const selectedModel = useSelector(makeSelectModelById(selectedModelId));
  const modelMultiplier = selectedModel?.noCapCostMultiplier ?? 1.0;
  const adjustedCost = form.generateHabitLinkItemCost * modelMultiplier;
  const totalCost = ensureMinTotalCost(adjustedCost);
  const handleCompanyChange = (companyName: string) => {
    setSelectedCompany(companyName);
    const models = (companies.find(c => c.name === companyName)?.models ?? [])
      .filter(m => m.isVisible !== false);
    const defaultModel = models.find(m => m.isDefault) ?? models[0];
    setSelectedModelId(defaultModel?.id);
  };

  // ✅ Run load() every time this screen comes into focus
  // useFocusEffect(
  //   useCallback(() => {
  //     form.load();
  //   }, [form.load])
  // );

  // Force reload FlatList when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Reset the stacks and reload
      form.load?.();
      // Force FlatList to remount by changing key
      setKey((prev) => prev + 1);
    }, [form.load]),
  );

  //console.log("habitlink form:", form.data);
  // Bottom sheet ref
  const addHabitLinkSheetRef = useRef<RBSheetRef>(null);

  // Bottom sheet options
  const addHabitOptions = [
    {
      id: 1,
      title: "Add HabitLinkItem From Market",
      subtitle: "Browse and add habitLinkItem from the marketplace",
      icon: "store-outline",
      onPress: async () => {
        addHabitLinkSheetRef.current?.close();
        await form.navigateToMarket();
      },
    },
    {
      id: 2,
      title: "Add HabitLinkItem From Friends",
      subtitle: "Browse and copy habitLinkItem from your friends",
      icon: "account-group-outline",
      onPress: async () => {
        addHabitLinkSheetRef.current?.close();
        await form.navigateToFriends();
      },
    },
    {
      id: 3,
      title: "Add HabitLinkItem From My Library",
      subtitle: "Browse and copy habitLinkItem from your library",
      icon: "account-group-outline",
      onPress: async () => {
        addHabitLinkSheetRef.current?.close();
        await form.navigateToMyLibrary();
      },
    },
    {
      id: 4,
      title: "Add HabitLinkItem With AI",
      subtitle: "Let AI help you build a personalized habit link item",
      icon: "robot-outline",
      onPress: () => {
        addHabitLinkSheetRef.current?.close();
        form.navigateToHabitLinkItemsAIScreen();
      },
    },
  ];

  const handleAddHabitLinkItemPress = async () => {
    try {
      //console.log("Attempting to save form before adding habitLinks...");
      // Save the form first
      //const success = await form.saveAndReturnStatus();

      // Only open bottom sheet if save was successful
      if (true) {
        addHabitLinkSheetRef.current?.open();
      }
    } catch (error) {
      console.log("Error saving form:", error);
      // Don't open bottom sheet if save failed
    }
  };

  return (
    <View style={[MainStyles.root, { paddingHorizontal: 0, paddingTop: 0 }]}>
      <BannerSectionV3
        overlayText={form.habit?.name || ""}
        remoteImage={form.habit?.bannerImage || ""}
        onPick={() => console.log("Pick Banner Image")}
      />

      <View style={{ flex: 1 }}>
        {isWeb ? (
          <WebHabitLinkHeader
            title={form.destinationScreenTitle}
            onBack={form.onBack}
            canEdit={form.canEdit}
            canAdd={!!form.activeGroupId && form.activeGroupId !== "all"}
            onAdd={() =>
              form.onAddItem(form.activeGroupId, form.activeGroup?.name)
            }
            gotoUpload={form.navigateToHabitLinkItemImporter}
            handleAddHabitLinkItemPress={handleAddHabitLinkItemPress}
          />
        ) : (
          <TopBar
            title={form.destinationScreenTitle}
            canEdit={form.canEdit}
            canAdd={!!form.activeGroupId && form.activeGroupId !== "all"}
            onBack={form.onBack}
            onAdd={() =>
              form.onAddItem(form.activeGroupId, form.activeGroup?.name)
            }
            gotoUpload={form.navigateToHabitLinkItemImporter}
            handleAddHabitLinkItemPress={handleAddHabitLinkItemPress}
            onScorePress={() => console.log("Score pressed")}
          />
        )}

        {!form.canEdit && form.canShowCheckbox && (
          <View style={styles.calendarToggleRow}>
            <View style={{flex: 1}}>
              <CalendarRows
                startDate={pickers.startDate}
                endDate={pickers.endDate}
                onPickStartDate={() => pickers.showPicker("startDate", "date")}
                onPickEndDate={() => pickers.showPicker("endDate", "date")}
                isEditingExisting={false}
                showEndDate={false}
              />
            </View>
            <TouchableOpacity
              style={[styles.fastSaveToggle, fastSave && styles.fastSaveToggleOn]}
              onPress={() => setFastSave((v) => !v)}
            >
              <Text style={styles.fastSaveToggleText}>
                {fastSave ? "⚡" : "✏️"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <HabitLinkTabs
          data={form.groups}
          activeId={form.activeGroupId}
          onChange={(id, group) => {
            form.setActiveGroupId(id);
          }}
        />

        {form.activeGroup && form.activeGroup.items?.length ? (
          <>
            <View style={{ flex: 1 }}>
              <HabitLinkItemsListV2
                costSymbol={form.costUnit?.symbol || ""}
                canEdit={form.canEdit}
                items={form.activeGroup.items}
                color={form.activeGroup.scoreColor}
                onEdit={(item) =>
                  form.onEditItem(
                    form.activeGroupId,
                    form.activeGroup?.name,
                    item,
                  )
                }
                startDate={pickers.startDate}
                onInfo={(item) => form.onInfoItem(item)}
                onDelete={(item) => form.onDeleteRequest(item)}
                canShowCheckbox={form.canShowCheckbox}
                insertCalendarData={form.insertCalendarData}
                canGoToSwapScreen={form.canGoToSwapScreen}
                goToSwapScreen={form.navigateToSwapHabitLinkItem}
                onScoreComplete={form.load}
                showCheckboxButton={fastSave}
                canShowButtonItemData={form.canShowCheckbox && !fastSave}
              />
            </View>

            <HabitLinkCostBar
              habitLinkComponent={form.activeGroup}
              symbol={form.costUnit?.symbol || ""}
              total={formatCostAsNumber(form.activeGroup.scoreComponent?.cost ?? 0)}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </View>

      <HabitLinkItemPreview
        canEdit={form.canEdit}
        rnsheet={form.showInfoSheet}
        shotlist={form.showDeleteSheet}
        closefun={form.onDismissSheet}
        dataitem={form.infoItem}
        costSymbol={form.costUnit?.symbol || ""}
      />

      {/* <DefaultLoader status={form.loading} /> */}
      {/* <DefaultLoader2 status={true} /> */}

      {/* {form.loading && (
        <View style={styles.loadingOverlay}>
          <View
            style={[
              styles.containerLoader,
              { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            ]}
          >
            <ActivityIndicator size={"large"} color={"#ffffff"} />
          </View>
        </View>
      )} */}

      {form.loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <DateTimePickerModal
        isVisible={pickers.show}
        mode={pickers.mode}
        onConfirm={pickers.handleConfirm}
        onCancel={pickers.hide}
        display={Platform.OS === "ios" ? "inline" : "default"}
      />

      {/* Add Habit Bottom Sheet */}
      {/* Bottom Sheet */}
      <RBSheet
        ref={addHabitLinkSheetRef}
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
          <Text style={styles.bottomSheetTitle}>Add HabitLinkItem </Text>

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
                  <Text style={styles.aiModalSubtitle}>HabitLinkItem Generator</Text>
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
                  placeholder="Describe what kind of items you want..."
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
                  onPress={() => form.confirmAndNavigateToAIScreen({ adjustedCost: totalCost, modelId: selectedModelId })}
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

export default HabitLinksScreen;

const styles = StyleSheet.create({
  containerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
    zIndex: 9999,
  },
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
  calendarToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: wp(4),
  },
  fastSaveToggle: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.7),
    borderRadius: 20,
    backgroundColor: "#222222",
    borderWidth: 1,
    borderColor: "#333333",
  },
  fastSaveToggleOn: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  fastSaveToggleText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
