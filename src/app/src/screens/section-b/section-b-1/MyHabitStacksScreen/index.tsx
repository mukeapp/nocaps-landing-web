import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {AIModelSelector} from "@/core/components/section-b";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  heightPercentageToDP as _hp,
  widthPercentageToDP as _wp,
  isTablet,
} from "@/core/utils/responsive";
import {useDispatch, useSelector} from "react-redux";

const isWeb = Platform.OS === "web";
const wp = (p: number | string): number =>
  isWeb ? +(Number(p) * 3.8).toFixed(1) : _wp(p);
const hp = (p: number | string): number =>
  isWeb ? +(Number(p) * 3.8).toFixed(1) : _hp(p);

import {
  DeleteHabitStack,
  GetAIProviders,
  GetAllSubscriptions,
  getHabitStackComponentsByUserId,
  GetHabitIntelligenceCosts,
} from "@/core/api/section-b";
import {
  BillingType,
  PlanId,
  SubscriptionPlan,
  SubscriptionPlanAction,
} from "@/core/redux/subscription-plan";
import {ButtonSignIn as Button} from "@/core/components/section-a";
import {HabitStackCard} from "@/core/components/section-b";
import WebDashboardHeader from "@/core/components/section-b/header/WebDashboardHeader";
import {Colors} from "@/core/constants/Colors";
import {MainStyles} from "@/core/constants/styles";
import {
  HabitLinkComponent,
  HabitStackComponent,
} from "@/core/models/section-b";
import {
  HabitIntelligenceCostAction,
  selectGenerateHabitStackCost,
} from "@/core/redux/habit-intelligence-cost";
import {
  RevenueCatAction,
  selectRevenueCat,
} from "@/core/redux/user-revenue-cat";
import {
  createUserRevenueCat,
  decreaseRemainingCreditsByUserId,
  getUserRevenueCatByNocapUserId,
} from "@/core/services/section-b";
import {ensureMinTotalCost, formatCostDecimal, uuidUtils} from "@/core/utils";
import {
  AICompany,
  AIModelsCostMultiplierAction,
  makeSelectModelById,
  selectAICompanies,
  selectDefaultSelection,
} from "@/core/redux/ai-models-cost-multiplier";
import Toast from "react-native-root-toast";
import {BannerAd, BannerAdSize, TestIds} from "react-native-google-mobile-ads";

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

type ListItem =
  | { type: 'stack'; data: HabitStackComponent }
  | { type: 'ad'; id: string };

const MyHabitStacksScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const userdata = useSelector((s: any) => s?.user?.userdata);
  const generateHabitStackCost = useSelector((s: any) =>
    selectGenerateHabitStackCost(s),
  );
  const revenueCat = useSelector((s: any) => selectRevenueCat(s));
  const userId: string = userdata?.collectdata?.userId?.trim() ?? "";

  const [loading, setLoading] = useState(false);
  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [showAIConfirmModal, setShowAIConfirmModal] = useState(false);
  const [steerDescription, setSteerDescription] = useState<string>("");
  const companies = useSelector(selectAICompanies);
  const { companyName: defaultCompanyName, modelId: defaultModelId } = useSelector(selectDefaultSelection);
  const [selectedCompany, setSelectedCompany] = useState(defaultCompanyName);
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);

  const selectedModel = useSelector(makeSelectModelById(selectedModelId));
  const modelMultiplier = selectedModel?.noCapCostMultiplier ?? 1.0;
  const adjustedCost = generateHabitStackCost * modelMultiplier;
  const totalCost = ensureMinTotalCost(adjustedCost);

  const handleCompanyChange = (companyName: string) => {
    setSelectedCompany(companyName);
    const models = (companies.find(c => c.name === companyName)?.models ?? [])
      .filter(m => m.isVisible !== false);
    const defaultModel = models.find(m => m.isDefault) ?? models[0];
    setSelectedModelId(defaultModel?.id);
  };
  const refRBSheet = useRef<RBSheetRef>(null);
  const loadingRef = useRef(false);

  const fetchOrCreateRevenueCat = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, status } = await getUserRevenueCatByNocapUserId(userId);
      let record = data;
      if (status === 404 || !record) {
        const created = await createUserRevenueCat({
          id: uuidUtils.generateUUID(),
          nocapUserId: userId,
          revenueCatUserId: `rc_${userId}`,
          planId: "free",
          billingType: "personal",
          monthlyCredits: 0,
          remainingCredits: 0,
          isActive: true,
          purchasedAt: null,
        });
        record = created.data;
      }
      if (record) {
        dispatch(
          RevenueCatAction.setPurchasedPlan({
            documentId: record.documentId ?? null,
            id: record.id ?? null,
            revenueCatUserId: record.revenueCatUserId ?? null,
            nocapUserId: record.nocapUserId ?? userId,
            planId: record.planId ?? "free",
            billingType: record.billingType ?? "personal",
            monthlyCredits: record.monthlyCredits ?? 0,
            remainingCredits: record.remainingCredits ?? 0,
            purchasedAt: record.purchasedAt ?? null,
            createdAt: record.createdAt ?? null,
            updatedAt: record.updatedAt ?? null,
          }),
        );
      }
    } catch (err) {
      console.log("fetchOrCreateRevenueCat:", err);
    }
  }, [userId, dispatch]);

  const fetchSubscriptions = useCallback(async () => {
    const {data, status} = await GetAllSubscriptions();
    if (status >= 200 && status < 300 && Array.isArray(data)) {
      const mapped: SubscriptionPlan[] = data.map((item: any) => ({
        id: item.id as PlanId,
        name: item.name,
        price: item.price,
        tagline: item.tagline,
        ...(item.description != null ? {description: item.description} : {}),
        credits: item.credits,
        isPopular: item.isPopular ?? false,
        billingType: item.billingType as BillingType,
        features: item.features ?? [],
        ...(item.footerNote != null ? {footerNote: item.footerNote} : {}),
      }));
      dispatch(SubscriptionPlanAction.setPlans(mapped));
    }
  }, [dispatch]);

  const fetchAIProviders = useCallback(async () => {
    const {data, status} = await GetAIProviders();
    if (status >= 200 && status < 300 && Array.isArray(data)) {
      const mapped: AICompany[] = data.map((item: any) => ({
        name: item.name,
        website: item.website,
        isDefault: item.isDefault,
        isVisible: item.isVisible,
        models: (item.models ?? []).map((m: any) => ({
          id: m.id,
          name: m.name,
          inputCostPer1M: m.inputCostPer1M,
          outputCostPer1M: m.outputCostPer1M,
          contextWindow: m.contextWindow,
          isDefault: m.isDefault,
          costMultiplier: m.costMultiplier,
          noCapCostMultiplier: m.noCapCostMultiplier,
          description: m.description,
          isVisible: m.isVisible,
        })),
      }));
      dispatch(AIModelsCostMultiplierAction.setAICompanies(mapped));
    }
  }, [dispatch]);

  // Bottom sheet options
  const addOptions = [
    {
      id: 1,
      title: "Add Habit Stack From Market",
      subtitle: "Browse and add habit stacks from the marketplace",
      icon: "store-outline",
      onPress: () => {
        refRBSheet.current?.close();
        // Navigate to market screen
        navigation.navigate("habit-market", {
          originScreen: "my-habit-stacks",
        });
      },
    },
    {
      id: 2,
      title: "Add Habit Stack From Friends",
      subtitle: "Browse and copy habit stacks from your friends",
      icon: "account-group-outline",
      onPress: () => {
        refRBSheet.current?.close();
        // Navigate to friends habit stacks screen
        navigation.navigate("my-friends-and-habits", {
          originScreen: "my-habit-stacks",
        });
      },
    },
    {
      id: 3,
      title: "Add Habit Stack From My Library",
      subtitle: "Browse and copy habit stacks from your library",
      icon: "account-outline",
      onPress: () => {
        refRBSheet.current?.close();
        navigation.navigate("my-friends-and-habits", {
          originScreen: "my-habit-stacks",
          destinationScreenTitle: "My Library",
          routeData: {
            dataHasOnlySelfUser: true,
            habitSectorId: null,
            habitStackId: null,
            habitId: null,
            habitLinkId: null,
            habitLinkItemId: null,
          },
        });
      },
    },
    {
      id: 4,
      title: "Add Habit Stack With AI",
      subtitle: "Let AI help you build a personalized habit stack",
      icon: "robot-outline",
      onPress: () => {
        refRBSheet.current?.close();
        setSteerDescription("");
        setTimeout(() => setShowAIConfirmModal(true), 350);
      },
    },
  ];

  const load = useCallback(async () => {
    const userId = userdata?.collectdata?.userId?.trim();
    if (!userId || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const [res, costsRes] = await Promise.all([
        getHabitStackComponentsByUserId({ id: userId }),
        GetHabitIntelligenceCosts(),
      ]);
      setStacks(res?.data ?? []);
      if (costsRes?.status === 200 && Array.isArray(costsRes?.data)) {
        dispatch(HabitIntelligenceCostAction.setCosts(costsRes.data));
      }
    } catch (e) {
      console.log("GetDataHabitStack error:", e);
    } finally {
      setLoading(false);
      // Hold the lock for 2s so a rapid second focus event (common on first app load
      // when auth/userdata settles) cannot trigger a second DefaultLoader animation cycle
      // that would cause an iOS Modal conflict and freeze the screen.
      setTimeout(() => {
        loadingRef.current = false;
      }, 2000);
    }
  }, [userdata?.collectdata?.userId]);

  useEffect(() => {
    const onFocus = () => {
      load();
      fetchOrCreateRevenueCat();
      fetchSubscriptions();
      fetchAIProviders();
    };
    const unsub = navigation.addListener("focus", onFocus);
    return unsub;
  }, [load, fetchOrCreateRevenueCat, fetchSubscriptions, fetchAIProviders, navigation]);

  const onEditStack = (stack: HabitStackComponent) =>
    navigation.navigate("add_edit_habitstack", { habitstackdata: stack });

  const onDeleteStack = (stack: HabitStackComponent) =>
    Alert.alert("Are you sure?", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const res = await DeleteHabitStack({
              id: stack.documentId ?? stack.id,
            });
            if (res?.status === 200) {
              setStacks((prev) =>
                prev.filter(
                  (x) =>
                    (x.documentId ?? x.id) !== (stack.documentId ?? stack.id),
                ),
              );
              Toast.show("Habit Stack Deleted Successfully", {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
              });
            }
          } catch (e) {
            console.log("delete HabitStack error:", e);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);

  const onOpenLinkItem = (habitLink: HabitLinkComponent) => {
    //console.log("onOpenLinkItem", habitLink);
    navigation.navigate("habitlinks", {
      originScreen: "my-habit-stacks",
      habitLink,
      multiple: true,
    });
  };

  const handleOpenAddOptions = () => {
    refRBSheet.current?.open();
  };

  const handleGoToHabitStackAI = async () => {
    setShowAIConfirmModal(false);
    const { data: record, status } = await decreaseRemainingCreditsByUserId(
      userId,
      totalCost,
    );
    if (status >= 200 && status < 300 && record) {
      dispatch(RevenueCatAction.subtractCredits(totalCost));
      navigation.navigate("habit-stack-ai", {
        originScreen: "my-habit-stacks",
        routeData: { steerDescription: steerDescription.trim(), modelId: selectedModelId },
      });
    }
  };

  const listData: ListItem[] = [];
  stacks.forEach((stack, i) => {
    listData.push({ type: 'stack', data: stack });
    if ((i + 1) % 3 === 0 && i < stacks.length - 1) {
      listData.push({ type: 'ad', id: `ad-${i}` });
    }
  });

  return (
    <View
      style={[
        MainStyles.root,
        Platform.OS === "web" && {
          paddingHorizontal: 0,
          paddingTop: 0,
        },
      ]}
    >
      {/* Sticky top bar — shared web dashboard header */}
      <WebDashboardHeader onOpenDrawer={() => navigation.openDrawer()} />

      {/* Scrollable content */}
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Build Better habits, one day at a time.
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Let NoCaps guide your journey!
        </p>

        {/* Score legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
          {[
            { label: "BAD", color: "#e74c3c" },
            { label: "POOR", color: "#8e44ad" },
            { label: "AVERAGE", color: "#e67e22" },
            { label: "GOOD", color: "#27ae60" },
            { label: "EXCELLENT", color: "#f1c40f" },
            { label: "UNKNOWN", color: "#6B7280" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>

        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
            networkExtras: {
              collapsible: "bottom",
            },
          }}
        />

        {/* Stack grid */}
        {stacks.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {listData.map((item, i) => {
              if (item.type === "ad") {
                return (
                  <div key={item.id} className="col-span-full flex justify-center py-2">
                    <BannerAd
                      unitId={TestIds.BANNER}
                      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                    />
                  </div>
                );
              }
              return (
                <div key={String(item.data.documentId ?? item.data.id ?? i)} className="min-w-0">
                  <HabitStackCard
                    canEdit={true}
                    stack={item.data}
                    username={userdata?.collectdata?.username}
                    onEdit={onEditStack}
                    onDelete={onDeleteStack}
                    onOpenLinkItem={onOpenLinkItem}
                    showExpandedButton={false}
                    showHabitLinkNav={false}
                    canGoToSwapScreen={true}
                    showBottomUpSheetItemList={true}
                    onScoreComplete={load}
                    canAIScore={true}
                    bannerImageShowIconGoToHabitAndFriends={false}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MaterialCommunityIcons
              name="layers-outline"
              size={48}
              color={Colors.text_color}
            />
            <p className="mt-4 text-lg font-semibold text-foreground">
              No Habit Stack Found.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first habit stack to get started.
            </p>
            <button
              onClick={() =>
                navigation.navigate("add_edit_habitstack", { habitstackdata: {} })
              }
              className="mt-5 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium transition-colors"
            >
              Create Habit Stack
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={handleOpenAddOptions}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-5 text-sm font-medium transition-colors flex-1 sm:flex-none sm:px-8"
          >
            Add Habit Stack
          </button>
          <button
            onClick={() =>
              navigation.navigate("add_edit_habitstack", { habitstackdata: {} })
            }
            className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-5 text-sm font-medium transition-colors flex-1 sm:flex-none sm:px-8"
          >
            Create Habit Stack
          </button>
          <button
            onClick={() => navigation.navigate("no-cap-post-home")}
            className="inline-flex items-center justify-center rounded-md bg-foreground text-background hover:bg-foreground/90 h-10 px-5 text-sm font-medium transition-colors flex-1 sm:flex-none sm:px-8"
          >
            Next
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <RBSheet
        ref={refRBSheet}
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
          <Text style={styles.bottomSheetTitle}>Add Habit Stack</Text>

          <View style={styles.optionsContainer}>
            {addOptions.map((option) => (
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

      {loading && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm">
          <div className="h-8 w-8 rounded-full border-2 border-muted border-t-foreground animate-spin" />
        </div>
      )}

      {/* AI Confirm Modal */}
      <Modal
        visible={showAIConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAIConfirmModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.aiConfirmOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setShowAIConfirmModal(false)}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.aiConfirmModal}>
              {/* Header */}
              <View style={styles.aiModalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aiModalTitle}>Generate with AI</Text>
                  <Text style={styles.aiModalSubtitle}>
                    Habit Stack Generator
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.aiModalClose}
                  onPress={() => setShowAIConfirmModal(false)}
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
                    {(revenueCat?.remainingCredits ?? 0).toLocaleString()}
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
                {(revenueCat?.remainingCredits ?? 0) < totalCost && (
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
                  placeholder="Describe what kind of habit stacks you want..."
                  placeholderTextColor="#6B7280"
                  multiline
                  textAlignVertical="top"
                  maxLength={300}
                  value={steerDescription}
                  onChangeText={setSteerDescription}
                />
                <Text style={styles.steerCharCount}>
                  {steerDescription.length}/300
                </Text>
              </View>

              {/* Confirm (enough credits) */}
              {(revenueCat?.remainingCredits ?? 0) >= totalCost && (
                <TouchableOpacity
                  style={styles.aiConfirmBtn}
                  onPress={handleGoToHabitStackAI}
                >
                  <MaterialIcons name="auto-awesome" size={16} color="#fff" />
                  <Text style={styles.aiConfirmBtnText}>
                    Generate — {formatCostDecimal(totalCost)} credits
                  </Text>
                </TouchableOpacity>
              )}

              {/* Cancel + Add Credits (insufficient) */}
              {(revenueCat?.remainingCredits ?? 0) < totalCost && (
                <View style={styles.aiButtonRow}>
                  <TouchableOpacity
                    style={styles.aiCancelBtn}
                    onPress={() => setShowAIConfirmModal(false)}
                  >
                    <Text style={styles.aiCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.aiAddCreditsBtn}
                    onPress={() => {
                      setShowAIConfirmModal(false);
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

export default MyHabitStacksScreen;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: Math.min(wp(6), hp(3.5)),
    color: Colors.white,
    fontFamily: "semibold",
  },
  scoreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: wp(3),
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
  },
  scoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scoreLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    fontFamily: "semibold",
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("1%"),
  },
  logoBox: {
    width: wp("12%"),
    height: wp("12%"),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp("3%"),
    marginRight: wp("3%"),
  },
  logo: {
    width: wp("7%"),
    height: wp("7%"),
  },
  listWrap: {
    flex: 1,
    marginTop: hp("2%"),
  },
  notfound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: hp("55%"),
  },
  nottxt: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "semibold",
  },
  box: {
    width: wp(12),
    height: wp(12),
    backgroundColor: Colors.title_background,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(3),
    marginRight: wp(3),
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
  optionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    marginBottom: hp(1),
    backgroundColor: Colors.content_back,
    borderRadius: wp(3),
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
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
